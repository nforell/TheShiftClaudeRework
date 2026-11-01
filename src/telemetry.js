/* The Shift — telemetry and feedback delivery.
   Anonymous: a random install id, no names, no emails (unless someone types one into feedback).
   Opt-out in Settings; Do Not Track and Global Privacy Control are honored.
   Sends only from a real website (not file:// or localhost) and only when config.posthogKey is set.
   Events are batched, kept in a small queue across reloads, and flushed on a timer and when the page hides. */
(function (S) {
  const CFG = S.config || {};
  const K = { id: 'theshift.tel.id', q: 'theshift.tel.q', off: 'theshift.tel.off', src: 'theshift.tel.src' };
  const MAXQ = 200, BATCH = 50, EVERY = 15000;
  const get = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const put = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage off */ } };
  const del = (k) => { try { localStorage.removeItem(k); } catch (e) { /* storage off */ } };
  const rand = () => { try { return crypto.randomUUID(); } catch (e) { return 'x' + Math.random().toString(36).slice(2) + Date.now().toString(36); } };

  let id = get(K.id); if (!id) { id = rand(); put(K.id, id); }
  const session = rand();
  let q = []; try { q = JSON.parse(get(K.q) || '[]') || []; } catch (e) { q = []; }
  const recent = [];   // last few events, for the health check
  /* Where this player first came from (utm tags or the referring site), kept from their first visit so a shift
     played days later still counts toward the post or video that brought them. */
  let src = null; try { src = JSON.parse(get(K.src) || 'null'); } catch (e) { src = null; }
  if (!src) {
    const u = new URLSearchParams(location.search), ref = (() => { try { const h = new URL(document.referrer).hostname; return h && h !== location.hostname ? h : ''; } catch (e) { return ''; } })();
    src = { source: u.get('utm_source') || ref || 'direct', medium: u.get('utm_medium') || '', campaign: u.get('utm_campaign') || '' };
    put(K.src, JSON.stringify(src));
  }
  let timer = null;

  const site = /^https?:$/.test(location.protocol) && !/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);
  const dnt = () => navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  const optedOut = () => get(K.off) === '1';
  const configured = () => !!CFG.posthogKey;
  const enabled = () => configured() && site && !dnt() && !optedOut();
  const status = () => !configured() ? 'Off: no analytics key set' : !site ? 'Off: running from a local file' : dnt() ? 'Off: your browser asks not to be tracked' : optedOut() ? 'Off: you turned it off' : 'On, anonymous';

  const vw = () => (innerWidth < 600 ? 'phone' : innerWidth < 1024 ? 'tablet' : 'desktop');
  function track(event, props) {
    const e = { event, timestamp: new Date().toISOString(), properties: Object.assign({ distinct_id: id, session_id: session, app_version: CFG.version || '', screen: vw(), $current_url: site ? location.origin + location.pathname : '', first_source: src.source, first_campaign: src.campaign }, props || {}) };
    recent.push({ at: e.timestamp.slice(11, 19), event, p: props || {} }); if (recent.length > 25) recent.shift();
    if (!enabled()) return false;
    q.push(e); if (q.length > MAXQ) q = q.slice(-MAXQ); put(K.q, JSON.stringify(q));
    if (!timer) timer = setTimeout(() => { timer = null; flush(); }, EVERY);
    return true;
  }
  function flush(leaving) {
    if (!enabled() || !q.length) return;
    const batch = q.slice(0, BATCH), url = String(CFG.posthogHost || 'https://us.i.posthog.com').replace(/\/$/, '') + '/batch/';
    const body = JSON.stringify({ api_key: CFG.posthogKey, batch });
    const done = () => { q = q.slice(batch.length); put(K.q, JSON.stringify(q)); if (q.length && !leaving) flush(); };
    if (leaving && navigator.sendBeacon) { if (navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }))) done(); return; }
    try {
      fetch(url, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } })
        .then((r) => { if (r.ok) done(); }).catch(() => { /* offline: keep the queue for next time */ });
    } catch (e) { /* no fetch */ }
  }
  function setOptOut(off) { if (off) { put(K.off, '1'); q = []; del(K.q); } else del(K.off); }

  /* Things a person chose to send (feedback, a beta signup) go out even under Do Not Track, which is about tracking.
     They still need a key, a real site, and no opt-out. */
  const canSend = () => configured() && site && !optedOut();
  function direct(event, props) {
    const e = { event, timestamp: new Date().toISOString(), properties: Object.assign({ distinct_id: id, session_id: session, app_version: CFG.version || '', screen: vw(), first_source: src.source, first_campaign: src.campaign }, props) };
    recent.push({ at: e.timestamp.slice(11, 19), event, p: { kind: props.kind || '' } }); if (recent.length > 25) recent.shift();
    if (enabled()) { q.push(e); put(K.q, JSON.stringify(q)); flush(); return; }
    try { fetch(String(CFG.posthogHost || 'https://us.i.posthog.com').replace(/\/$/, '') + '/batch/', { method: 'POST', body: JSON.stringify({ api_key: CFG.posthogKey, batch: [e] }), keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {}); } catch (er) { /* offline */ }
  }
  function mail(subject, fields) {
    const lines = Object.entries(fields).filter(([, v]) => v !== '' && v != null).map(([k, v]) => `${k}: ${v}`);
    try { location.href = `mailto:${CFG.feedbackEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n') + `\n\nversion: ${CFG.version || ''}`)}`; } catch (e) { /* blocked */ }
    return 'email';
  }
  /* An email copy to the developer (supabase/functions/notify), on top of PostHog. Off until config.notify is true,
     which is set once that function is deployed with a mail sender (docs/EMAIL-SETUP.md). Best effort, never blocks. */
  const trim = (f) => { const o = {}; Object.entries(f || {}).forEach(([k, v]) => { if (k === 'flagged') return; o[k] = typeof v === 'string' ? v.slice(0, k === 'text' ? 45000 : 3000) : v; }); return o; };   // the review's text already lists what was flagged
  function notify(kind, fields) {
    if (!CFG.notify || !CFG.supabaseUrl || !CFG.supabaseKey || !/^https:$/.test(location.protocol)) return;
    try {
      fetch(String(CFG.supabaseUrl).replace(/\/$/, '') + '/functions/v1/notify', { method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json', apikey: CFG.supabaseKey },
        body: JSON.stringify({ kind, fields: trim(fields), version: CFG.version || '', page: location.pathname }) }).catch(() => {});
    } catch (e) { /* offline */ }
  }
  /* A copy of every feedback note in Supabase's feedback table (supabase/feedback.sql), so the whole beta can be
     exported as one CSV and handed to Claude. Anonymous: the install id, never an account. Insert-only for players;
     only the project owner can read the table. Best effort, never blocks. */
  function store(kind, fields) {
    if (!CFG.supabaseUrl || !CFG.supabaseKey || !site) return;
    const f = fields || {}, note = String(f.note || f.comments || '').slice(0, 4000);
    const row = { install_id: id, kind: String(kind).slice(0, 40), shift: String(f.case || '').slice(0, 80), difficulty: f.difficulty || null,
      helps_nclex: f.helps_nclex || null, would_pay: f.would_pay || null, problem: f.problem || null, note: note || null,
      score: typeof f.score === 'number' ? Math.round(f.score) : null, source: src.source || '', app_version: CFG.version || '', screen: vw(),
      details: trim(f) };
    if (row.details && row.details.text) row.details.text = String(row.details.text).slice(0, 20000);
    try {
      fetch(String(CFG.supabaseUrl).replace(/\/$/, '') + '/rest/v1/feedback', { method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json', apikey: CFG.supabaseKey, Prefer: 'return=minimal' }, body: JSON.stringify(row) }).catch(() => {});
    } catch (e) { /* offline */ }
  }
  /* Feedback: returns 'sent', or 'email' when it opened a prefilled email instead. */
  function feedback(kind, fields) {
    const props = Object.assign({ kind }, fields);
    store(kind, fields);
    if (canSend()) { direct('feedback', props); notify(kind, fields); return 'sent'; }
    return mail('The Shift beta: ' + kind, props);
  }
  /* Beta list signup from the landing page. The address is attached to this install's anonymous id so the
     list can be matched to who actually played. */
  function signup(email, role) {
    const props = { kind: 'signup', role: role || '', $set: { email, role: role || '' } };
    if (canSend()) { direct('beta_signup', props); notify('signup', { email, role: role || '' }); return 'sent'; }
    return mail('Add me to The Shift beta list', { email, role: role || '' });
  }

  /* The same signup, but only says "sent" once PostHog answered OK. If it can't be reached (offline, blocked by a
     content blocker, a server error), the signup is kept on this device and resent on the next visit, and the page
     says so instead of "You're on the list". Resolves 'sent', 'queued' or 'email' (no analytics key: opened a
     prefilled email). */
  const KS = 'theshift.tel.signups';
  const pending = () => { try { return JSON.parse(get(KS) || '[]') || []; } catch (e) { return []; } };
  function postNow(events) {
    const url = String(CFG.posthogHost || 'https://us.i.posthog.com').replace(/\/$/, '') + '/batch/';
    let p; try { p = fetch(url, { method: 'POST', body: JSON.stringify({ api_key: CFG.posthogKey, batch: events }), keepalive: true, headers: { 'Content-Type': 'text/plain' } }).then((r) => r.ok); } catch (e) { p = Promise.resolve(false); }
    return Promise.race([p.catch(() => false), new Promise((ok) => setTimeout(() => ok(false), 8000))]);
  }
  function signupSend(email, role) {
    if (!canSend()) return Promise.resolve(mail('Add me to The Shift beta list', { email, role: role || '' }));
    const e = { event: 'beta_signup', timestamp: new Date().toISOString(), properties: { distinct_id: id, session_id: session, app_version: CFG.version || '', screen: vw(), first_source: src.source, first_campaign: src.campaign, kind: 'signup', role: role || '', $set: { email, role: role || '' } } };
    recent.push({ at: e.timestamp.slice(11, 19), event: e.event, p: { kind: 'signup' } }); if (recent.length > 25) recent.shift();
    notify('signup', { email, role: role || '' });
    return postNow([e]).then((ok) => { if (ok) return 'sent'; put(KS, JSON.stringify(pending().concat(e).slice(-5))); return 'queued'; });
  }
  if (canSend() && pending().length) setTimeout(() => { const p = pending(); postNow(p).then((ok) => { if (ok) del(KS); }); }, 1500);

  addEventListener('pagehide', () => flush(true));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(true); });
  setTimeout(() => flush(), 3000);   // anything left from last time

  S.tel = { track, flush, feedback, signup, signupSend, source: () => src, enabled, configured, status, optedOut, setOptOut, recent, id: () => id };
})(window.Shift);
