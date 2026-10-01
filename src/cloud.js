/* The Shift — accounts and cloud saves (Supabase).
   Sign in with an emailed link, no passwords. Progress (profile) and the shift in progress (game) sync to one row
   per player in public.saves (see supabase/schema.sql). Talks to Supabase's REST endpoints directly, so the game
   stays one file with no libraries. Without config.supabaseUrl and config.supabaseKey this module stays off and
   the game saves only on the device, as before. */
(function (S) {
  const CFG = S.config || {}, E = S.engine, TEL = S.tel || { track() {} };
  const SK = 'theshift.auth.v1', SYNCK = 'theshift.sync.v1';
  const base = () => String(CFG.supabaseUrl || '').replace(/\/$/, '');
  const on = () => !!(CFG.supabaseUrl && CFG.supabaseKey) && /^https?:$/.test(location.protocol);
  const get = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  const put = (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage off */ } };

  let sess = get(SK);                 // { access_token, refresh_token, expires_at, user: { id, email } }
  let meta = get(SYNCK) || {};        // { at: last successful sync (ms), err }
  let dirty = false, timer = null, busy = null, linked = false;
  const listeners = [];
  const changed = () => listeners.forEach((f) => { try { f(); } catch (e) { /* UI handles its own errors */ } });

  async function call(path, opts) {
    opts = opts || {};
    const h = Object.assign({ apikey: CFG.supabaseKey, 'Content-Type': 'application/json' }, opts.headers || {});
    if (opts.auth && sess) h.Authorization = 'Bearer ' + sess.access_token;
    const r = await fetch(base() + path, { method: opts.method || 'GET', headers: h, body: opts.body ? JSON.stringify(opts.body) : undefined, keepalive: !!opts.keepalive });
    const txt = await r.text(); let data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
    if (!r.ok) { const err = new Error((data && (data.msg || data.message || data.error_description || data.error)) || ('HTTP ' + r.status)); err.status = r.status; throw err; }
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
  /* 2. Coming back from the emailed link: the tokens arrive in the address after #. */
  async function fromLink() {
    const h = new URLSearchParams(location.hash.replace(/^#/, ''));
    if (h.get('error_description')) { linked = true; meta.err = h.get('error_description').replace(/\+/g, ' '); put(SYNCK, meta); history.replaceState(null, '', location.pathname + location.search); return false; }
    if (!h.get('access_token')) return false;
    linked = true;
    keep({ access_token: h.get('access_token'), refresh_token: h.get('refresh_token'), expires_in: h.get('expires_in') });
    history.replaceState(null, '', location.pathname + location.search);   // don't leave tokens in the address bar
    try { const u = await call('/auth/v1/user', { auth: true }); sess.user = { id: u.id, email: u.email }; put(SK, sess); } catch (e) { signOut(true); return false; }
    TEL.track('account_signed_in', {});
    return true;
  }
  function signOut(quiet) { sess = null; put(SK, null); meta = {}; put(SYNCK, null); if (!quiet) TEL.track('account_signed_out', {}); changed(); }

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
    out.floorSeen = Object.assign({}, a.floorSeen || {}); Object.entries(b.floorSeen || {}).forEach(([id, v]) => { if (out.floorSeen[id] === undefined || RANK[v] > RANK[out.floorSeen[id]]) out.floorSeen[id] = v; });
    out.lessons = Object.assign({}, a.lessons || {}); Object.entries(b.lessons || {}).forEach(([k, L]) => { const m = out.lessons[k]; if (!m || (L.last || 0) > (m.last || 0) || (L.fixed && !m.fixed)) out.lessons[k] = L; });
    return out;
  }
  const empty = (p) => !p || (!(p.runs || []).length && !(p.xp || 0));

  /* 3. Sync: pull this player's row, merge with this device, write both places. */
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
        let game = E.store.load();
        const rg = remote && remote.game;
        if (rg && !rg.ended && (!game || (rg.savedAt || 0) > (game.savedAt || 0))) { game = rg; E.store.save(rg); }
        E.store.saveProfile(merged);
        await call('/rest/v1/saves?on_conflict=user_id', { method: 'POST', auth: true, keepalive: why === 'leaving', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: { user_id: uid, profile: merged, game: game && !game.ended ? game : null, updated_at: new Date().toISOString() } });
        dirty = false; meta = { at: Date.now() }; put(SYNCK, meta);
        if (why === 'signin') TEL.track('account_synced', { had_cloud: !!(remote && !empty(remote.profile)), had_local: !empty(local) });
        return true;
      } catch (e) {
        meta = Object.assign({}, meta, { err: String(e.message || e).slice(0, 140) }); put(SYNCK, meta);
        return false;
      } finally { busy = null; changed(); }
    })();
    return busy;
  }
  function later() { dirty = true; if (!timer && sess) timer = setTimeout(() => { timer = null; if (dirty) sync('auto'); }, 20000); }

  /* Every local save also schedules a cloud save. The shift's own timestamp settles which device's shift is newer. */
  if (E && E.store) {
    const st = E.store, s0 = st.save, p0 = st.saveProfile, c0 = st.clear;
    st.save = (g) => { if (g) g.savedAt = Date.now(); s0(g); later(); };
    st.saveProfile = (p) => { p0(p); later(); };
    st.clear = () => { c0(); later(); };
  }
  addEventListener('pagehide', () => { if (dirty && sess) sync('leaving'); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && dirty && sess) sync('leaving'); });

  /* On load: finish a sign-in from the emailed link, or refresh an existing session. Resolves when the first sync
     is done, so the UI can show merged progress. */
  const ready = (async () => {
    if (!on()) return false;
    const justIn = await fromLink().catch(() => false);
    if (!sess) { changed(); return false; }
    return sync(justIn ? 'signin' : 'boot');
  })();

  S.cloud = {
    on, ready, sendLink, sync: () => sync('manual'), signOut, onChange: (f) => listeners.push(f),
    user: () => (sess && sess.user) || null,
    linked: () => linked,   // this page load came from the emailed link
    status: () => (!on() ? null : !sess ? { state: 'out', err: meta.err || null } : { state: 'in', email: sess.user && sess.user.email, at: meta.at || null, err: meta.err || null, busy: !!busy }),
    _merge: mergeProfile,
  };
})(window.Shift);
