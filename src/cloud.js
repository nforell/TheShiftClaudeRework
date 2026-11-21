/* The Shift — accounts and cloud saves (Supabase).
   Sign in with an emailed link, no passwords. Progress (profile, which holds every finished shift's summary) syncs
   to public.saves; the shift in progress (game) syncs separately to public.shift_snapshots, debounced, so a long
   shift's growing logs aren't re-sent with every action or alongside the profile (see supabase/schema.sql). Talks to Supabase's REST endpoints directly, so the game
   stays one file with no libraries. Without config.supabaseUrl and config.supabaseKey this module stays off and
   the game saves only on the device, as before. */
(function (S) {
  const CFG = S.config || {}, E = S.engine, TEL = S.tel || { track() {} };
  const SK = 'theshift.auth.v1', SYNCK = 'theshift.sync.v1', OUTK = 'theshift.outbox.v1', OWNK = 'theshift.owns.v1';
  const base = () => String(CFG.supabaseUrl || '').replace(/\/$/, '');
  const on = () => !!(CFG.supabaseUrl && CFG.supabaseKey) && /^https?:$/.test(location.protocol);
  const get = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  const put = (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage off */ } };

  let sess = get(SK);                 // { access_token, refresh_token, expires_at, user: { id, email } }
  let meta = get(SYNCK) || {};        // { at: last successful sync (ms), err }
  let dirty = false, timer = null, busy = null, linked = false;
  let dirtyG = false, timerG = null, firstG = 0, pushingG = null, sentP = null, sentG = null, snapTable = true;
  const listeners = [];
  const changed = () => listeners.forEach((f) => { try { f(); } catch (e) { /* UI handles its own errors */ } });

  async function call(path, opts) {
    opts = opts || {};
    const h = Object.assign({ apikey: CFG.supabaseKey, 'Content-Type': 'application/json' }, opts.headers || {});
    if (opts.auth && sess) h.Authorization = 'Bearer ' + sess.access_token;
    const r = await fetch(base() + path, { method: opts.method || 'GET', headers: h, body: opts.body ? JSON.stringify(opts.body) : undefined, keepalive: !!opts.keepalive });
    const txt = await r.text(); let data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
    if (!r.ok) { const err = new Error((data && (data.msg || data.message || data.error_description || data.error)) || ('HTTP ' + r.status)); err.status = r.status; err.code = data && data.code; throw err; }
    return data;
  }
  function keep(t) {
    sess = { access_token: t.access_token, refresh_token: t.refresh_token, expires_at: Date.now() + (Number(t.expires_in) || 3600) * 1000, user: t.user || (sess && sess.user) || null };
    put(SK, sess);
  }
  async function fresh() {     // a valid access token, refreshed when close to expiry
    if (!sess) return false;
    if (Date.now() < sess.expires_at - 60000) return true;
    try { keep(await call('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: sess.refresh_token } })); return true; }
    catch (e) { if (e.status === 400 || e.status === 401) signOut(true); return false; }
  }

  /* 1. Ask for a sign-in link. */
  async function sendLink(email) {
    const back = location.origin + location.pathname;
    await call('/auth/v1/otp?redirect_to=' + encodeURIComponent(back), { method: 'POST', body: { email, create_user: true } });
    TEL.track('account_link_sent', {});
  }
  /* Why a link couldn't be sent, in words a player can act on. */
  function why(e) {
    const m = String((e && e.message) || '');
    if (/not authori[sz]ed/i.test(m)) return 'Accounts aren\'t open to everyone yet. You can play without one; your progress saves on this device.';
    if ((e && e.status === 429) || /rate|seconds|too many/i.test(m)) return 'Too many sign-in emails just now. Wait a few minutes, then send again.';
    if (/invalid|valid email|format/i.test(m)) return 'That email address doesn\'t look right. Check it and try again.';
    return 'Couldn\'t send the link. Check your connection and try again.';
  }
  /* 2. Coming back from the emailed link. The branded email (supabase/email-templates) links straight to this page
     with a one-time token_hash after #, which is traded for a session here; the older Supabase link arrives with the
     tokens themselves after #. Either way the address bar is cleaned so nothing is left in it. */
  async function fromLink() {
    const h = new URLSearchParams(location.hash.replace(/^#/, ''));
    const clean = () => history.replaceState(null, '', location.pathname + location.search);
    const fail = (t) => { linked = true; meta.err = t; put(SYNCK, meta); clean(); TEL.track('account_link_failed', {}); return false; };
    if (h.get('error_description')) return fail(/expired|invalid/i.test(h.get('error_description')) ? 'That sign-in link has expired or was already used. Send yourself a new one.' : h.get('error_description').replace(/\+/g, ' '));
    if (h.get('token_hash')) {
      let t;
      try { t = await call('/auth/v1/verify', { method: 'POST', body: { type: h.get('type') || 'email', token_hash: h.get('token_hash') } }); }
      catch (e) { return fail(e.status >= 400 && e.status < 500 ? 'That sign-in link has expired or was already used. Send yourself a new one.' : 'Couldn\'t finish signing in. Check your connection, then open the link again.'); }
      if (!t || !t.access_token) return fail('Couldn\'t finish signing in. Send yourself a new link.');
      linked = true; clean(); meta.err = null; put(SYNCK, meta);
      keep(t);
    } else {
      if (!h.get('access_token')) return false;
      linked = true;
      keep({ access_token: h.get('access_token'), refresh_token: h.get('refresh_token'), expires_in: h.get('expires_in') });
      clean();   // don't leave tokens in the address bar
    }
    try { const u = await call('/auth/v1/user', { auth: true }); sess.user = { id: u.id, email: u.email }; put(SK, sess); } catch (e) { signOut(true); return false; }
    TEL.track('account_signed_in', {});
    return true;
  }
  /* Deleting the account: the database removes the user and everything tied to it (supabase/schema.sql,
     delete_my_account). Then this device forgets the session and anything still waiting to upload. Progress saved on
     the device itself stays, as with signing out. */
  async function deleteAccount() {
    if (!(await fresh())) throw new Error('Sign in again first.');
    await call('/rest/v1/rpc/delete_my_account', { method: 'POST', auth: true, body: {} });
    put(OUTK, null); TEL.track('account_deleted', {}); signOut(true);
  }
  function signOut(quiet) { sess = null; put(SK, null); meta = {}; put(SYNCK, null); put(OWNK, null); if (!quiet) TEL.track('account_signed_out', {}); changed(); }

  /* Merging two devices' progress: nothing earned on either is lost. Settings stay with this device. */
  const RANK = { wrong: 0, ok: 1, best: 2 };
  function mergeProfile(a, b) {
    if (!b || !b.runs) return a; if (!a || !a.runs) return b;
    const big = (b.xp || 0) > (a.xp || 0) ? b : a, out = JSON.parse(JSON.stringify(big));
    out.settings = a.settings;
    out.xp = Math.max(a.xp || 0, b.xp || 0); out.reflect = Math.max(a.reflect || 0, b.reflect || 0);
    const runs = {}; a.runs.concat(b.runs).forEach((r) => { runs[r.at + '|' + r.caseId] = r; });
    out.runs = Object.values(runs).sort((x, y) => y.at - x.at).slice(0, 20);
    ['best', 'stars', 'done'].forEach((k) => { out[k] = Object.assign({}, a[k] || {}); Object.entries(b[k] || {}).forEach(([c, v]) => { out[k][c] = Math.max(out[k][c] || 0, v); }); });
    out.badges = Object.assign({}, a.badges || {}); Object.entries(b.badges || {}).forEach(([id, t]) => { out.badges[id] = out.badges[id] ? Math.min(out.badges[id], t) : t; });
    out.seen = Object.assign({}, a.seen || {}, b.seen || {});
    if (String(b.terms || '') > String(out.terms || '')) { out.terms = b.terms; out.termsAt = b.termsAt; }   // keep the newest terms agreement
    if (String(a.terms || '') > String(out.terms || '')) { out.terms = a.terms; out.termsAt = a.termsAt; }
    out.floorSeen = Object.assign({}, a.floorSeen || {}); Object.entries(b.floorSeen || {}).forEach(([id, v]) => { if (out.floorSeen[id] === undefined || RANK[v] > RANK[out.floorSeen[id]]) out.floorSeen[id] = v; });
    out.lessons = Object.assign({}, a.lessons || {}); Object.entries(b.lessons || {}).forEach(([k, L]) => { const m = out.lessons[k]; if (!m || (L.last || 0) > (m.last || 0) || (L.fixed && !m.fixed)) out.lessons[k] = L; });
    // Drills: the newer answer per card, every day played, the most rounds and the best score per drill.
    const da = (a.drills && typeof a.drills === 'object') ? a.drills : {}, db = (b.drills && typeof b.drills === 'object') ? b.drills : {};
    if (Object.keys(da).length || Object.keys(db).length) {
      const cards = Object.assign({}, da.cards || {}); Object.entries(db.cards || {}).forEach(([id, r]) => { const m = cards[id]; if (!Array.isArray(m) || (Array.isArray(r) && (r[2] || 0) > (m[2] || 0))) cards[id] = r; });
      const days = [...new Set([].concat(da.days || [], db.days || []))].sort().slice(-120), mx = (k) => { const o = Object.assign({}, da[k] || {}); Object.entries(db[k] || {}).forEach(([x, v]) => { o[x] = Math.max(o[x] || 0, v); }); return o; };
      out.drills = { cards, days, rounds: mx('rounds'), best: mx('best') };
    }
    return out;
  }
  const empty = (p) => !p || (!(p.runs || []).length && !(p.xp || 0) && !Object.keys((p.drills && p.drills.cards) || {}).length);

  /* 3. Sync. Two rows per player, synced on their own clocks:
       saves.profile          progress: scores, badges, every finished shift's summary. Pulled and merged on boot,
                              sign-in and Sync now; pushed (merged with the cloud copy first) 20 s after it changes.
       shift_snapshots.game   the shift in progress. Pushed, never merged: 45 s after the last action, at least every
                              3 minutes while playing, and when the page is hidden. Unchanged content isn't re-sent.
     Older databases without shift_snapshots keep the game in saves.game, as before. */
  // A cheap fingerprint of what was last sent, so an unchanged profile or shift isn't uploaded again.
  const sig = (x) => { const t = JSON.stringify(x === undefined ? null : x); let h = 0; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return t.length + ':' + h; };
  const missingTable = (e) => e && (e.status === 404 || e.code === 'PGRST205' || e.code === '42P01');
  const live = (g) => (g && !g.ended ? g : null);
  async function pullGame(uid, row) {
    let snap = null;
    if (snapTable) {
      try { const r = await call('/rest/v1/shift_snapshots?select=game,saved_at&user_id=eq.' + encodeURIComponent(uid), { auth: true }); snap = r && r[0] ? r[0].game : null; }
      catch (e) { if (missingTable(e)) snapTable = false; else throw e; }
    }
    // A shift saved by an older version of the game sits in saves.game; the newer of the two wins.
    const old = row && row.game, a = live(snap), b = live(old);
    return !a ? b : !b ? a : (b.savedAt || 0) > (a.savedAt || 0) ? b : a;
  }
  async function pushGame(why) {
    if (!on() || !sess || !sess.user) return false;
    if (pushingG) return pushingG;
    pushingG = (async () => {
      try {
        if (!(await fresh())) return false;
        const uid = sess.user.id, game = live(E.store.load()), h = sig(game);
        if (h === sentG) { dirtyG = false; firstG = 0; return true; }
        const keepalive = why === 'leaving';
        if (snapTable) {
          try {
            await call('/rest/v1/shift_snapshots?on_conflict=user_id', { method: 'POST', auth: true, keepalive, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
              body: { user_id: uid, game, case_id: game ? game.caseId : null, game_min: game ? Math.round(game.t || 0) : null, saved_at: new Date((game && game.savedAt) || Date.now()).toISOString() } });
          } catch (e) { if (!missingTable(e)) throw e; snapTable = false; }
        }
        if (!snapTable) await call('/rest/v1/saves?on_conflict=user_id', { method: 'POST', auth: true, keepalive, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: { user_id: uid, game, updated_at: new Date().toISOString() } });
        sentG = h; dirtyG = false; firstG = 0;
        return true;
      } catch (e) { meta = Object.assign({}, meta, { err: String(e.message || e).slice(0, 140) }); put(SYNCK, meta); return false; }
      finally { pushingG = null; }
    })();
    return pushingG;
  }
  async function sync(why) {
    if (!on() || !sess || !sess.user) return false;
    if (busy) return busy;
    busy = (async () => {
      try {
        if (!(await fresh())) return false;
        const uid = sess.user.id;
        const rows = await call('/rest/v1/saves?select=profile,game,updated_at&user_id=eq.' + encodeURIComponent(uid), { auth: true });
        const remote = rows && rows[0], local = E.store.profile();
        const merged = remote && !empty(remote.profile) ? (empty(local) ? Object.assign({}, remote.profile, { settings: local.settings }) : mergeProfile(local, remote.profile)) : local;
        // The shift in progress: pulled on boot, sign-in and Sync now, never on the automatic profile push.
        if (why !== 'auto' && why !== 'leaving') {
          const rg = await pullGame(uid, remote), game = E.store.load();
          if (rg && (!game || (rg.savedAt || 0) > (game.savedAt || 0))) { saveQuiet(rg); sentG = sig(rg); }
        }
        saveProfileQuiet(merged);
        const hp = sig(merged);
        if (hp !== sentP || !remote) {
          const body = { user_id: uid, profile: merged, updated_at: new Date().toISOString() };
          if (!snapTable) body.game = live(E.store.load());   // older database: the shift rides along, as before
          await call('/rest/v1/saves?on_conflict=user_id', { method: 'POST', auth: true, keepalive: why === 'leaving', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body });
          sentP = hp;
        }
        dirty = false; meta = { at: Date.now() }; put(SYNCK, meta);
        if (dirtyG || (why !== 'auto' && why !== 'leaving')) await pushGame(why);
        await flush().catch(() => {});
        await checkOwns().catch(() => {});
        if (why === 'signin') TEL.track('account_synced', { had_cloud: !!(remote && !empty(remote.profile)), had_local: !empty(local) });
        return true;
      } catch (e) {
        meta = Object.assign({}, meta, { err: String(e.message || e).slice(0, 140) }); put(SYNCK, meta);
        return false;
      } finally { busy = null; changed(); }
    })();
    return busy;
  }

  /* Results for instructors: each finished shift and each practice question goes to an outbox on the device,
     then up to results / ngn_results when signed in. Nothing is lost while offline or signed out; the outbox is
     capped so a device that never signs in doesn't grow forever. */
  const outbox = () => { const o = get(OUTK) || {}; return { results: o.results || [], ngn: o.ngn || [], drills: o.drills || [] }; };
  function enqueue(kind, row) {
    if (!on()) return;
    const o = outbox(); o[kind].push(row); o[kind] = o[kind].slice(kind === 'drills' ? -200 : -60); put(OUTK, o);
    if (sess) flush().catch(() => {});
  }
  let flushing = null;
  async function flush() {
    if (!on() || !sess || !sess.user) return false;
    if (flushing) return flushing;
    flushing = (async () => {
      try {
        if (!(await fresh())) return false;
        const uid = sess.user.id, o = outbox();
        for (const [kind, table] of [['results', 'results'], ['ngn', 'ngn_results'], ['drills', 'drill_results']]) {
          if (!o[kind].length) continue;
          const rows = o[kind].map((r) => Object.assign({}, r, { user_id: uid }));
          try { await call('/rest/v1/' + table, { method: 'POST', auth: true, headers: { Prefer: 'return=minimal' }, body: rows }); }
          catch (e) { if (kind === 'drills') continue; throw e; }   // drills wait on the device until their table exists; they never block shifts
          const now = outbox(); now[kind] = now[kind].slice(o[kind].length); put(OUTK, now);
        }
        return true;
      } finally { flushing = null; }
    })();
    return flushing;
  }
  function recordRun(r) {
    enqueue('results', { case_id: r.case_id, score: Math.round(r.score || 0), stars: r.stars || 0, minutes: r.minutes == null ? null : Math.round(r.minutes),
      domains: r.domains || [], steps: r.steps || [], misses: (r.misses || []).slice(0, 30), outcomes: r.outcomes || [], played_at: new Date().toISOString() });
  }
  function recordDrill(kind, cardId, ok, retry) {
    enqueue('drills', { kind, card_id: cardId, ok: !!ok, retry: !!retry, at: new Date().toISOString() });
  }
  function recordNgn(caseId, item, score, max) {
    enqueue('ngn', { case_id: caseId, item_id: item.id, item_type: item.type, step: item.step || null, score, max, at: new Date().toISOString() });
  }

  /* Classes. A student joins with the instructor's code and the name the instructor will see. */
  async function need() { if (!on() || !sess || !sess.user) throw new Error('Sign in first'); if (!(await fresh())) throw new Error('Sign in again'); return sess.user.id; }
  async function myClasses() {
    const uid = await need();
    const rows = await call('/rest/v1/class_members?select=class_id,display_name,classes(name,code,pack)&user_id=eq.' + encodeURIComponent(uid), { auth: true });
    return (rows || []).map((r) => ({ id: r.class_id, as: r.display_name, name: r.classes && r.classes.name, code: r.classes && r.classes.code, pack: !!(r.classes && r.classes.pack) }));
  }
  async function join(code, name) {
    await need();
    const k = await call('/rest/v1/rpc/join_class', { method: 'POST', auth: true, body: { p_code: String(code || '').trim().toUpperCase(), p_name: String(name || '').trim() } });
    if (!k || k.error) throw new Error((k && k.error) || 'No class with that code');
    TEL.track('class_joined', {});
    await flush().catch(() => {}); await checkOwns().catch(() => {}); changed();
    return k;
  }
  async function leave(classId) {
    const uid = await need();
    await call('/rest/v1/class_members?class_id=eq.' + encodeURIComponent(classId) + '&user_id=eq.' + encodeURIComponent(uid), { method: 'DELETE', auth: true, headers: { Prefer: 'return=minimal' } });
    await checkOwns().catch(() => {}); changed();
  }
  /* Instructor side (used by /teach/). */
  async function createClass(name) { await need(); const k = await call('/rest/v1/rpc/create_class', { method: 'POST', auth: true, body: { p_name: String(name || '').trim() } }); TEL.track('class_created', {}); return k; }
  async function teaching() { const uid = await need(); return (await call('/rest/v1/classes?select=id,name,code,pack,created_at&order=created_at.desc&teacher=eq.' + encodeURIComponent(uid), { auth: true })) || []; }
  async function roster(classId) { await need(); return (await call('/rest/v1/class_members?select=user_id,display_name,joined_at&order=display_name.asc&class_id=eq.' + encodeURIComponent(classId), { auth: true })) || []; }
  async function removeMember(classId, userId) { await need(); await call('/rest/v1/class_members?class_id=eq.' + encodeURIComponent(classId) + '&user_id=eq.' + encodeURIComponent(userId), { method: 'DELETE', auth: true, headers: { Prefer: 'return=minimal' } }); }
  const inList = (ids) => 'in.(' + ids.map(encodeURIComponent).join(',') + ')';
  async function classResults(ids) { await need(); if (!ids.length) return []; return (await call('/rest/v1/results?select=*&order=played_at.desc&limit=5000&user_id=' + inList(ids), { auth: true })) || []; }
  async function classDrills(ids) { await need(); if (!ids.length) return []; try { return (await call('/rest/v1/drill_results?select=*&order=at.desc&limit=10000&user_id=' + inList(ids), { auth: true })) || []; } catch (e) { return []; } }
  async function classNgn(ids) { await need(); if (!ids.length) return []; return (await call('/rest/v1/ngn_results?select=*&order=at.desc&limit=5000&user_id=' + inList(ids), { auth: true })) || []; }

  /* The shift pack: owned through a purchase (entitlements, written only by the payment webhook) or through a class
     whose school bought it (classes.pack). Remembered on the device so it stays unlocked offline. */
  async function checkOwns() {
    if (!on() || !sess || !sess.user || !(await fresh())) return;
    const uid = sess.user.id;
    const ent = (await call('/rest/v1/entitlements?select=product,source&user_id=eq.' + encodeURIComponent(uid), { auth: true })) || [];
    const cls = (await call('/rest/v1/class_members?select=classes(pack)&user_id=eq.' + encodeURIComponent(uid), { auth: true })) || [];
    const owns = {};
    ent.forEach((e) => { owns[e.product] = e.source || 'stripe'; });
    if (!owns.pack && cls.some((c) => c.classes && c.classes.pack)) owns.pack = 'class';
    const before = JSON.stringify(get(OWNK) || {});
    put(OWNK, owns);
    if (before !== JSON.stringify(owns)) changed();
  }
  const owns = (product) => { const o = sess ? get(OWNK) || {} : {}; return o[product] || null; };

  /* Every local save schedules a cloud save of just what changed. Profile: 20 s after the first change. The shift in
     progress: a trailing debounce (45 s after the last action), capped so a long run of actions still uploads at
     least every 3 minutes. The shift's own timestamp settles which device's shift is newer. */
  const PROF_WAIT = 20000, GAME_WAIT = 45000, GAME_MAX = 180000;
  function later() { dirty = true; if (!timer && sess) timer = setTimeout(() => { timer = null; if (dirty) sync('auto'); }, PROF_WAIT); }
  function laterGame() {
    dirtyG = true; if (!sess) return;
    const now = Date.now(); if (!firstG) firstG = now;
    clearTimeout(timerG); timerG = setTimeout(() => { timerG = null; if (dirtyG) pushGame('auto'); }, Math.max(0, Math.min(GAME_WAIT, firstG + GAME_MAX - now)));
  }
  let saveQuiet = (g) => { if (E && E.store) E.store.save(g); }, saveProfileQuiet = (p) => { if (E && E.store) E.store.saveProfile(p); };
  if (E && E.store) {
    const st = E.store, s0 = st.save, p0 = st.saveProfile, c0 = st.clear;
    st.save = (g) => { if (g) g.savedAt = Date.now(); s0(g); laterGame(); };
    st.saveProfile = (p) => { p0(p); later(); };
    st.clear = () => { c0(); laterGame(); };
    // What sync pulls down is written locally without scheduling another upload of the same thing.
    saveQuiet = (g) => s0(g); saveProfileQuiet = (p) => p0(p);
  }
  function leaving() { if (!sess) return; if (dirty) sync('leaving'); else if (dirtyG) { clearTimeout(timerG); timerG = null; pushGame('leaving'); } }
  addEventListener('pagehide', leaving);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') leaving(); });

  /* On load: finish a sign-in from the emailed link, or refresh an existing session. Resolves when the first sync
     is done, so the UI can show merged progress. */
  const ready = (async () => {
    if (!on()) return false;
    const justIn = await fromLink().catch(() => false);
    if (!sess) { changed(); return false; }
    return sync(justIn ? 'signin' : 'boot');
  })();

  S.cloud = {
    on, ready, sendLink, why, sync: () => sync('manual'), signOut, deleteAccount, onChange: (f) => listeners.push(f),
    user: () => (sess && sess.user) || null,
    linked: () => linked,   // this page load came from the emailed link
    status: () => (!on() ? null : !sess ? { state: 'out', err: meta.err || null } : { state: 'in', email: sess.user && sess.user.email, at: meta.at || null, err: meta.err || null, busy: !!busy }),
    recordRun, recordNgn, recordDrill, flush, pushGame: () => pushGame('manual'), _sync: () => ({ dirty, dirtyG, snapTable, waits: { PROF_WAIT, GAME_WAIT, GAME_MAX } }), pending: () => { const o = outbox(); return o.results.length + o.ngn.length + o.drills.length; },
    myClasses, join, leave, createClass, teaching, roster, removeMember, classResults, classNgn, classDrills,
    owns, checkOwns,
    _merge: mergeProfile,
  };
})(window.Shift);
