/* The Shift — UI. Renders from game state; every control routes through act(). */
(function (S) {
  const E = S.engine, A_ = S.art, R = S.rig, FX = S.fx, F = S.flow, FL = S.floor, RW = S.reward, STY = S.story, CJ = S.cjmm, RV = S.review, CL = S.cloud && S.cloud.on() ? S.cloud : null;
  const TEL = S.tel || { track() { return false; }, flush() {}, feedback() { return 'email'; }, status: () => 'Not loaded', recent: [], optedOut: () => false, setOptOut() {} };
  const CASES = ['medsurg-4w-1', 'medsurg-4w-2', 'medsurg-4w-3', 'psych-3e-1', 'peds-5s-1'];
  let caseId = CASES[0];
  const esc = (x) => String(x == null ? '' : x).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel) => document.querySelector(sel);
  const ICON = {
    msg: '<svg class="ico" viewBox="0 0 24 24"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 18.5h4"/></svg>',
    menu: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chart: '<svg class="ico" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3M8.5 10h7M8.5 14h7M8.5 18h4"/></svg>',
    back: '<svg class="ico" viewBox="0 0 24 24"><path d="M14 6l-6 6 6 6"/></svg>',
    up: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>',
    down: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
    tick: '<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5"/><path d="M7 12.5l3.2 3.2L17.2 8.6"/></svg>',
    ff: '<svg class="ico ff-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6l8 6-8 6zM12 6l8 6-8 6z"/></svg>',
    xp: '<svg class="ico xp-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>',
    flame: '<svg class="fl-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c1.2 3.6 5.5 5.6 5.5 10.7a5.5 5.5 0 0 1-11 0c0-2.7 1.5-4.1 2.6-5.4.3 1.7 1.1 2.8 2.2 3.3.1-3.2-1.1-5.8.7-8.6z"/></svg>',
  };

  let s = null;                 // game state
  let prof = E.store.profile(); // persistent profile + settings
  const ui = { view: 'home', ov: null, chart: null, dock: 'assess', caption: null, toasts: [], rank: null, rankDone: false, dlg: null, med: null, sbar: null, delegMsg: null, nova: null, hIdx: 0, newLog: 0, filter: 'all', confirm: null, adv: null, stamp: null, justKey: null, busy: false };

  const C = () => E.getCase(caseId);
  // The engine API only closes over the game state, so one object per game is enough (it was rebuilt on every call).
  let _A = null, _As = null;
  const A = () => (_As === s && _A ? _A : (_As = s, _A = E.api(s)));
  let RC = null;   // per-render cache: task rows computed once per patient per redraw
  const def = (id) => C().patients.find((p) => p.id === id);
  const staff = (k) => C().staff[k] || { name: k, role: '', look: null };
  /* Rig inputs for a patient: what their body is doing right now, not what was last charted. */
  function rigV(id) {
    const d = def(id), P = s.p[id], Ax = A(), vt = d.vitals(s, P, Ax);
    return Object.assign({ rr: vt.RR, spo2: vt.SpO2, hr: vt.HR, sbp: vt.SBP, temp: vt.T, pain: vt.pain }, d.rig ? d.rig(s, P, Ax) : {});
  }
  const face = (k) => R.icon(k);
  const pface = (id) => R.icon(id, s ? rigV(id) : null);
  const faceOf = (k) => (def(k) ? pface(k) : face(k));
  const who = (k) => (def(k) ? { name: def(k).name, role: 'Room ' + k } : staff(k));
  const here = (d) => !d.arrives || (s && s.p[d.id].arrived);          // admitted patients appear mid-shift
  const pts = () => C().patients.filter(here);
  const gone = (P) => P.icu || P.gone;                                   // off the unit (ICU, OR)
  const goneText = (P) => P.goneText || 'Transferred to ICU';
  const prov = () => staff(C().provider || 'chen');
  const cna = () => staff(C().cna || 'luis');
  const unitS = () => esc(C().unitShort || '4 West');
  const sysL = (id, l) => (C().sysLabels && C().sysLabels[id]) || l;
  const legal = (d) => (d.legal ? `<span class="chip legal">${esc(d.legal)}</span>` : '');
  /* Normal ranges are per patient: a heart rate of 150 is normal at four months and alarming at forty. */
  const NORM = { T: [36, 37.9], HR: [55, 100], RR: [12, 22], SBP: [100, 160], SpO2: [92, 101] };
  const norm = (d, k) => (d && d.norms && d.norms[k]) || NORM[k];
  const abn = (d, k, v) => { const [lo, hi] = norm(d, k); return v < lo || v > hi; };
  const ageSex = (d) => (typeof d.age === 'number' ? `${d.age}${d.sex}` : `${d.age}, ${d.sex}`);
  const fT = (t) => (typeof t === 'number' ? t.toFixed(1) : t);
  const fLab = (l) => (typeof l.val === 'number' && Number.isInteger(l.val) && /\d\.\d/.test(l.ref || '') ? l.val.toFixed(1) : l.val);
  const o2txt = (o) => (o === 'Room air' ? 'room air' : o);
  const hhmm = (c, t) => { const m = (c.start || 420) + Math.round(t); return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };

  /* Frame monitor: if this device can't keep up (under ~30 fps for a few seconds), switch to lighter graphics on Auto. */
  const FM = { dts: [], last: 0, lite: false, bad: 0, fps: 60 };
  function frameMon(ts) {
    if (!document.hidden && FM.last) { const d = ts - FM.last; if (d < 1000) FM.dts.push(d); }
    FM.last = ts;
    if (FM.dts.length >= 90) {
      const a = FM.dts.slice().sort((x, y) => x - y), med = a[a.length >> 1]; FM.fps = Math.round(1000 / med); FM.dts = [];
      FM.bad = med > 34 ? FM.bad + 1 : 0;
      if (FM.bad >= 2 && !FM.lite && (prof.settings.gfx || 'auto') === 'auto') { FM.lite = true; applySettings(); const n = document.querySelector('.top .mark') || document.body; hint(n, 'Switched to lighter graphics to keep things smooth. Change it in Settings.'); }
    }
    requestAnimationFrame(frameMon);
  }
  function applySettings() {
    const r = document.documentElement, st = prof.settings;
    if (st.theme === 'system') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', st.theme);
    r.setAttribute('data-text', st.text); r.setAttribute('data-motion', st.motion);
    const lite = st.gfx === 'lite' || ((st.gfx || 'auto') === 'auto' && FM.lite);
    if (lite) r.setAttribute('data-lite', ''); else r.removeAttribute('data-lite');
    if (R && R.setPower) R.setPower(lite ? 'lite' : 'full');
    FX.setOn(st.sound !== 'off'); FX.setMusic(st.music !== 'off');
  }

  /* ------------ game flow ------------ */
  function save() { if (s && !s.ended) E.store.save(s); }
  function startNew() { s = E.newGame(caseId); s.wall0 = Date.now(); TEL.track('shift_start', { case: caseId, attempt: ((prof.done || {})[caseId] || 0) + 1, shifts_done: prof.runs.length }); ui.view = 'handoff'; ui.hFresh = true; ui.intro = C().intro && !seen('intro:' + caseId) ? 0 : null; ui.hIdx = 0; ui.rank = null; ui.rankDone = false; ui.ov = null; ui.toasts = []; ui.caption = null; save(); render(true); }
  function resume() { const g = E.store.load(); if (!g) return startNew(); s = g; caseId = g.caseId; E.useCase(caseId); TEL.track('shift_resume', { case: caseId, game_min: Math.round(s.t), view: s.view || 'station' }); ui.view = s.view || 'station'; ui.ov = null; render(true); }
  function goView(v) { ui.view = v; s.view = v; ui.caption = null; save(); render(true); }

  /* Spend time; collect new messages into toasts; end shift if the clock runs out. */
  function spend(mins, fn, until) {
    const track = s && !s.ended && (ui.view === 'station' || ui.view === 'room');
    const before = track ? openSnap() : null, pendingDeleg = s.deleg.filter((x) => !x.done).map((x) => x), t0 = s.t;
    const why = E.perform(s, mins, fn, until);
    if (track) {
      pendingDeleg.filter((x) => x.done).forEach((x) => { const tk = C().delegation.tasks.find((k) => k.id === x.id); A().log(x.pid, `${cna().name} finished: ${tk.label.toLowerCase()}.`, 'act'); s.log[s.log.length - 1].label = `${cna().name}: ${tk.label.toLowerCase()}`; });
      const after = s.ended ? {} : openSnap(), nowMs = Date.now();
      Object.keys(before).forEach((k) => {
        const r = before[k], a = after[k], P = s.p[r.pid];
        if (gone(P) && !r.key.startsWith('aw:')) return;
        const doneNow = r.prog ? !a : r.key.startsWith('x:') ? (a ? a.t - r.t >= 30 : ui.actPid === r.pid) : !a;
        if (doneNow && !ui.actPid && !ui.chimeQ) { ui.chimeQ = true; setTimeout(() => { ui.chimeQ = false; FX.play('check'); }, 250); }
        if (doneNow) ui.ghosts.push({ pid: r.pid, text: ((x) => x.charAt(0).toUpperCase() + x.slice(1))(r.text.replace(new RegExp('^' + cna().name + ': '), '')), by: r.prog ? cna().name : 'you', born: nowMs, held: false, id: k + nowMs });
        if (doneNow) earnTask(r);
      });
      // Something slipped past its time while you were busy: the streak ends.
      const slipped = Object.keys(after).filter((k) => after[k].late && !(before[k] && before[k].late) && !after[k].prog);
      if (slipped.length) breakStreak('Overdue: ' + after[slipped[0]].text.toLowerCase());
      ui.ghosts = ui.ghosts.filter((g) => g.held || nowMs - g.born < GHOST_MS);
    }
    if (s.t > t0) ui.adv = s.t - t0;
    const fresh = s.fresh.splice(0);
    const isCrit = (m) => m && m.urgent && m.pid && def(m.pid);
    if (fresh.length) { const ms = fresh.map((id) => s.inbox.find((x) => x.id === id)); const crit = ms.some(isCrit), urgent = ms.some((m) => m && m.urgent); setTimeout(() => FX.play(crit ? 'crit' : urgent ? 'urgent' : 'msg'), crit ? 120 : 420); }
    fresh.forEach((id) => {
      const m = s.inbox.find((x) => x.id === id); if (!m) return;
      if (isCrit(m)) { ui.critQ = (ui.critQ || []).concat(m.id); return; }   // a critical event gets the whole screen, not a toast
      ui.toasts.push(m.id);
      // Routine messages step aside after a few seconds (they stay in the phone); urgent ones wait for the player.
      if (!m.urgent) setTimeout(() => { if (ui.toasts.includes(m.id)) { ui.toasts = ui.toasts.filter((x) => x !== m.id); if (s && ui.view !== 'home' && ui.view !== 'debrief') render(); } }, 8000);
    });
    ui.toasts = ui.toasts.slice(-1);
    if (s.ended) { endShift(); return why; }
    save();
    return why;
  }
  function logHere(pid, text, kind) { A().log(pid, text, kind); ui.newLog = s.seq; if (kind !== 'clue') ui.lastFind = s.seq; }

  /* ------------ care XP: finished work and good calls pay; a run of them multiplies the pay ------------ */
  ui.pops = [];
  const fmtN = (n) => Math.round(n).toLocaleString('en-US');
  function gain(n, label, cls) { s.xp = (s.xp || 0) + n; ui.pops.push({ text: '+' + n, label, cls: cls || '' }); }
  function bump() {
    const pm = RW.mult(s.streak || 0); s.streak = (s.streak || 0) + 1; s.bestStreak = Math.max(s.bestStreak || 0, s.streak);
    const m = RW.mult(s.streak); if (m > pm) { ui.pops.push({ text: '×' + m, label: `${s.streak} in a row`, cls: 'combo' }); ui.combo = true; }
  }
  function breakStreak(why) { if ((s.streak || 0) >= 3) ui.pops.push({ text: 'Streak over', label: why, cls: 'lost' }); s.streak = 0; }
  function earnTask(r) {
    if (r.prog) { gain(10, `${cna().name} finished`, 'cna'); return; }
    if (r.late) { gain(5, 'Done, but late', 'late'); return; }
    const n = RW.round5(20 * RW.mult(s.streak || 0)); gain(n, 'On time'); bump();
  }
  // Judgments pay out when they land, or at the debrief if feedback waits until then.
  function tallyJudg(quiet) {
    const L = s.judg; let i = s.xpSeen || 0;
    for (; i < L.length; i++) {
      const j = L[i];
      if (j.delta > 0) { const n = RW.round5(60 * j.delta * RW.mult(s.streak || 0)); s.xp = (s.xp || 0) + n; if (!quiet) ui.pops.push({ text: '+' + n, label: /^floor-/.test(j.key || '') ? 'Floor call' : 'Good call', cls: 'good' }); bump(); }
      else if (j.delta < 0) { if (quiet) s.streak = 0; else breakStreak('A call to rethink'); }
    }
    s.xpSeen = i;
  }
  // Goals flip as the shift goes: a little ceremony when one lands or slips away.
  function goalWatch() {
    const g = RW.goals(s, C(), A()); s.goalSeen = s.goalSeen || {};
    g.forEach((x) => { const was = s.goalSeen[x.id]; if (x.st !== 'open' && was !== x.st && !s.ended) { ui.pops.push(x.st === 'done' ? { text: 'Goal met', label: x.label, cls: 'goal' } : { text: 'Goal missed', label: x.label, cls: 'lost' }); if (x.st === 'done') ui.goalSound = true; } s.goalSeen[x.id] = x.st; });
  }
  /* Floating rewards, drawn outside the app so a re-render doesn't cut them off. */
  function flushPops() {
    const P = ui.pops.splice(0); if (!P.length) return;
    const pill = document.querySelector('.xp'); if (!pill || reduced()) return;
    const r = pill.getBoundingClientRect();
    P.slice(-4).forEach((p, i) => setTimeout(() => {
      const n = document.createElement('div'); n.className = 'xpop ' + p.cls; n.innerHTML = `<b>${esc(p.text)}</b>${p.label ? `<small>${esc(p.label)}</small>` : ''}`;
      n.style.left = Math.min(innerWidth - 150, Math.max(8, r.left + r.width / 2 - 60)) + 'px'; n.style.top = r.bottom + 6 + 'px';
      document.body.appendChild(n); setTimeout(() => n.remove(), 1700);
      const pl = document.querySelector('.xp'); if (pl) { pl.classList.remove('bump'); void pl.offsetWidth; pl.classList.add('bump'); }
    }, i * 260));
    if (ui.combo) { ui.combo = false; setTimeout(() => FX.play('combo'), 200); }
    if (ui.goalSound) { ui.goalSound = false; setTimeout(() => FX.play('star'), 350); }
    if (ui.bondSound) { ui.bondSound = false; setTimeout(() => FX.play('star'), 250); }
  }

  function endShift() {
    if (s.reward) { ui.view = 'debrief'; s.view = 'debrief'; ui.ov = null; render(true); return; }   // already settled
    E.finish(s); tallyJudg(true); const d = E.debrief(s);
    s.reward = RW.settle(s, C(), A(), d, prof, CASES);
    prof.xp = s.reward.after; prof.stars = s.reward.starsAfter; prof.badges = prof.badges || {}; s.reward.earned.forEach((b) => { prof.badges[b] = Date.now(); });
    prof.done = prof.done || {}; prof.done[s.caseId] = (prof.done[s.caseId] || 0) + 1;
    prof.best = prof.best || {}; prof.best[s.caseId] = Math.max(prof.best[s.caseId] || 0, d.overall);
    const L = RW.record(prof, s, C(), d), R0 = s.reward; s.reward.learn = L;
    if (L.fixed.length) R0.lines.push({ k: `Lessons fixed, ${L.fixed.length}`, v: L.fixed.length * 60 });
    L.ups.forEach((u) => R0.lines.push({ k: `${RW.TRACKS.find((x) => x.id === u.id).label}: ${RW.TIER[u.tier]}`, v: u.tier * 100 }));
    R0.earned = R0.earned.concat(L.badges);
    if (L.xp) { R0.total += L.xp; R0.after += L.xp; R0.lvAfter = RW.level(R0.after); prof.xp = R0.after; }
    prof.runs.unshift({ at: Date.now(), score: d.overall, rating: d.rating, caseId: s.caseId });
    TEL.track('shift_complete', { case: s.caseId, score: d.overall, rating: d.rating, stars: s.reward.stars, ended_early: s.t < C().length - 5, game_min: Math.round(s.t), wall_min: s.wall0 ? Math.round((Date.now() - s.wall0) / 60000) : null, good_calls: d.judg.filter((j) => j.delta > 0).length, misses: d.judg.filter((j) => j.delta < 0).length, poor_outcomes: d.outcomes.filter((o) => o.tone === 'bad').length, hints_used: (C().novaCredits || 3) - s.nova, attempt: prof.done[s.caseId] });
    prof.runs = prof.runs.slice(0, 20); E.store.saveProfile(prof); E.store.clear();
    ui.view = 'debrief'; s.view = 'debrief'; ui.ov = null; ui.chart = null; ui.toasts = []; ui.debDone = false; ui.filter = 'all'; ui.reflected = false; ui.fb = {}; render(true);
  }

  /* ------------ header ------------ */
  function header() {
    const unread = s.inbox.filter((m) => !m.read).length;
    const loc = ui.view === 'room' ? `${unitS()} <span aria-hidden="true">/</span> <b>Room ${s.loc} · ${esc(def(s.loc).short)}</b>` : ui.view === 'handoff' ? `${unitS()} <span aria-hidden="true">/</span> <b>Shift report</b>` : `${unitS()} <span aria-hidden="true">/</span> <b>Nurses' station</b>`;
    return `<header class="top">
      <button class="mark" data-act="menu" aria-label="The Shift menu">The Shift</button>
      <div class="where">${loc}</div>
      <button class="icon-btn roster-btn" data-act="roster" aria-label="Your patients: who is who"><svg class="ico" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2c2.4 0 4.3 1.4 5 4.3"/></svg><span class="nova-l">Patients</span></button>
      ${ui.view !== 'handoff' ? `<button class="icon-btn" data-act="nova" aria-label="Ask the charge nurse, ${s.nova} credits left"><span class="dots" aria-hidden="true">${Array.from({ length: C().novaCredits || 3 }, (_, i) => i).map((i) => `<i class="${i < s.nova ? 'on' : ''}"></i>`).join('')}</span><span class="nova-l" aria-hidden="true">Nova</span></button>
      ${(() => { const m = RW.mult(s.streak || 0); return `<button class="xp ${m > 1 ? 'hot' : ''}" data-act="calls" aria-label="Care XP ${fmtN(s.xp || 0)}${m > 1 ? `, streak times ${m}` : ''}. Your shift so far">${ICON.xp}<b>${fmtN(s.xp || 0)}</b><b class="xp-k">${(s.xp || 0) >= 10000 ? ((s.xp || 0) / 1000).toFixed(0) + 'k' : fmtN(s.xp || 0)}</b>${m > 1 ? `<span class="fl">${ICON.flame}×${m}</span>` : ''}</button>`; })()}
      <button class="icon-btn" data-act="inbox" aria-label="Messages, ${unread} unread">${ICON.msg}${unread ? `<span class="badge">${unread}</span>` : ''}</button>` : ''}
      <div class="clock ${ui.adv ? 'bump' : ''}" role="timer" aria-live="off" aria-label="Shift time ${E.clock(s.t)}">${E.clock(s.t)}<small>ends ${E.clock(C().length)}</small>${ui.adv ? `<span class="adv" aria-hidden="true">+${ui.adv} min</span>` : ''}</div>
      <button class="icon-btn" data-act="menu" aria-label="Menu">${ICON.menu}</button>
      <div class="shiftbar" aria-hidden="true"><i style="width:${Math.min(100, s.t / C().length * 100).toFixed(1)}%"></i></div>
    </header>`;
  }

  /* ------------ home ------------ */
  function vHome() {
    E.useCase(caseId);
    const g = E.store.load(), c = C(), done = (id) => prof.runs.filter((r) => r.caseId === id);
    const start = hhmm(c, 0), initial = c.patients.filter((d) => !d.arrives), adm = c.patients.filter((d) => d.arrives);
    const cols = Math.ceil(initial.length / 2) + (adm.length ? 1 : 0) - (initial.length % 2 && adm.length ? 1 : 0);
    const rung = (id, i) => {
      const k = E.getCase(id), runs = done(id), best = runs.length ? Math.max(...runs.map((r) => r.score)) : null;
      const prev = i ? done(CASES[i - 1]).length : 1;
      const stn = (prof.stars || {})[id] || 0;
      return `<button class="rung" data-act="pick-case" data-id="${id}" aria-pressed="${id === caseId}"><span class="rung-st" aria-label="${stn} of 3 stars">${[0, 1, 2].map((i) => starSvg(i < stn, i, 'rs')).join('')}</span><b>${esc(k.level)}</b><span>${esc(k.title)}. ${esc(k.card)}</span><small>${best !== null ? `Best score ${best}` : prev ? 'Ready' : 'Recommended after ' + esc(E.getCase(CASES[i - 1]).level)}</small></button>`;
    };
    const saved = g && !g.ended ? E.getCase(g.caseId) : null;
    return `<div class="home">
      <div style="display:flex;justify-content:space-between;align-items:center"><span class="mark" style="cursor:default">The Shift</span>
      <span style="display:flex;gap:.3rem"><button class="btn btn-quiet" data-act="help">How it plays</button><button class="btn btn-quiet" data-act="settings">Settings</button></span></div>
      <section class="home-hero">
        <div>
          <p class="eyebrow">A nursing shift simulator</p>
          <p class="big-clock" aria-label="${start}">${start.slice(0, 2)}<span>:</span>${start.slice(3)}</p>
          <h1>${esc(c.hero.head)}</h1>
          <p class="lede">${esc(c.hero.lede)}</p>
          <div class="cta">
            ${saved && g.caseId === caseId ? `<button class="btn btn-primary btn-go" data-act="resume">Resume at ${hhmm(saved, g.t)} <span aria-hidden="true">→</span></button><button class="btn" data-act="new">Start over</button>` : saved ? `<button class="btn btn-primary btn-go" data-act="new">Start ${esc(c.title)} <span aria-hidden="true">→</span></button><button class="btn" data-act="resume">Resume ${esc(saved.title)} at ${hhmm(saved, g.t)}</button>` : `<button class="btn btn-primary btn-go" data-act="new">Start your shift <span aria-hidden="true">→</span></button>`}
          </div>
          <p class="home-meta">${c.patients.length} patients · about ${c.minutes || 15} minutes · saves as you go</p>
        </div>
        <div class="home-cast" style="grid-template-columns:1.25fr repeat(${Math.max(2, cols)},1fr)" aria-label="Your charge nurse and your patients">
          <figure class="lead tap" data-act="cast" data-id="nova" role="button" tabindex="0" aria-label="Nova Reyes">${R.bust('nova', null, 'bust', '-104 -150 208 330')}<figcaption><b>Nova Reyes</b>${ui.castSay && ui.castSay.id === 'nova' ? `<q>${esc(ui.castSay.text)}</q>` : `Charge nurse. ${c.novaCredits || 3} hints per shift.`}</figcaption></figure>
          ${initial.map((d) => `<figure class="tap" data-act="cast" data-id="${d.id}" role="button" tabindex="0" aria-label="${esc(d.name)}">${R.bust(d.id, null, 'bust')}<figcaption><b>${d.room} ${esc(d.short)}</b>${ui.castSay && ui.castSay.id === d.id ? `<q>${esc(ui.castSay.text)}</q>` : esc(d.dx)}</figcaption></figure>`).join('')}
          ${adm.map((d) => `<figure class="adm tap" data-act="cast" data-id="${d.id}" role="button" tabindex="0" aria-label="${esc(d.name)}">${R.bust(d.id, null, 'bust', '-232 -112 464 232')}<figcaption><b>${d.room} ${esc(d.short)}, arriving ${hhmm(c, d.arrives)}</b>${ui.castSay && ui.castSay.id === d.id ? `<q>${esc(ui.castSay.text)}</q>` : 'Admission from the ED: ' + esc(d.reason.toLowerCase())}</figcaption></figure>`).join('')}
        </div>
      </section>
      <div>
        <div class="ladder" role="group" aria-label="Choose a shift">
          ${CASES.map(rung).join('')}
          <div class="rung locked"><b>More specialty units</b><span>ED, ICU, labor and delivery.</span><small>Coming later</small></div>
        </div>
        ${careerHTML()}
        <div class="homefoot"><span>${prof.runs.length ? `Shifts completed: ${prof.runs.length}.` : 'No shifts completed yet.'}${CL ? ` <button class="acct-link" data-act="account">${CL.user() ? 'Saved to your account' : 'Save your progress'}</button>` : ''}</span><span>Original clinical content for education. Not a substitute for clinical instruction.${RV ? ` <button class="acct-link rv-${RV.status(caseId).state}" data-act="review">${esc(RV.status(caseId).label)}</button>` : ''}</span></div>
      </div>
    </div>`;
  }

  /* ------------ handoff ------------ */
  function vHandoff() {
    const pts = C().patients.filter((x) => !x.arrives), d = pts[ui.hIdx], P = s.p[d.id], rb = staff(C().reportBy);
    const nv = P.vit[0];
    const brain = s.brain.map((k) => { const [pid, i] = k.split(':'); return { k, pid, text: def(pid).report[+i].text }; });
    return `<main><div class="handoff">
      <section class="report" aria-labelledby="rh">
        <div class="dana">${face(C().reportBy)}<span><b>${esc(rb.name)}</b>, ${esc(C().reportRole)}, is giving you report. <b class="flag-cue">Tap to flag</b> anything worth remembering. Some of it is noise.</span></div>
        <div class="report-head">${pface(d.id)}<div class="who"><h2 id="rh">${esc(d.name)} <small class="muted" style="font-weight:500">${ageSex(d)}, room ${d.room}</small></h2>
          <div class="muted">${esc(d.dx)}</div>
          <div class="meta">${legal(d)}<span class="chip">${esc(d.code)}</span><span class="chip ${/No known/.test(d.allergies) ? '' : 'alert'}">Allergy: ${esc(d.allergies.split(',')[0].split('(')[0])}</span><span class="chip">${E.clock(nv.t)}: T ${fT(nv.T)}, HR ${nv.HR}, BP ${nv.SBP}/${nv.DBP}, SpO₂ ${nv.SpO2}%</span></div></div></div>
        <ul class="lines ${ui.hFresh ? 'fresh' : ''}">${d.report.map((r, i) => { const k = d.id + ':' + i; return `<li style="--i:${i}"><button class="line" data-act="flag" data-k="${k}" aria-pressed="${s.brain.includes(k)}"><i class="flag-ic" aria-hidden="true"></i><span>${esc(r.text)}</span></button></li>`; }).join('')}</ul>
        <div class="tabsrow" role="tablist" aria-label="Patients in report">
          ${pts.map((p, i) => `<button class="pt-tab rich" role="tab" data-act="h-go" data-i="${i}" aria-current="${i === ui.hIdx}">${pface(p.id)}<span><b>${p.room}</b><small>${esc(p.short)}</small></span></button>`).join('')}
          <span class="sp"></span>
          ${ui.hIdx < pts.length - 1 ? `<button class="btn btn-primary" data-act="h-go" data-i="${ui.hIdx + 1}">Next: ${pts[ui.hIdx + 1].room}</button>` : `<button class="btn btn-primary" data-act="h-done">Finish report</button>`}
        </div>
      </section>
      <aside class="brain" aria-label="Your brain sheet">
        <h2>Your brain sheet${brain.length ? ` <span class="count">${brain.length}</span>` : ''}</h2><p class="hint">Everyone you have today. What you flag lands under their name and stays with you all shift.</p>
        <ol class="bs">${pts.map((p, i) => { const fl = brain.filter((b) => b.pid === p.id); const cur = i === ui.hIdx, heard = i < ui.hIdx || s.hHeard && s.hHeard.includes(p.id); return `<li class="bs-p ${cur ? 'cur' : heard ? 'heard' : 'next'}">
          <button class="bs-h" data-act="h-go" data-i="${i}" aria-current="${cur}">${pface(p.id)}<span class="bs-who"><b>${p.room} ${esc(p.short)}</b><small>${esc(ageSex(p))} · ${esc(p.dx)}</small></span><span class="bs-st">${cur ? 'Reporting' : heard ? 'Heard' : 'Up next'}</span></button>
          ${fl.length ? `<ul>${fl.map((b) => `<li class="tap" data-act="flag" data-k="${b.k}" role="button" tabindex="0" title="Tap to unflag">${esc(b.text)}</li>`).join('')}</ul>` : ''}</li>`; }).join('')}</ol>
        ${ui.hIdx < pts.length - 1 ? `<p style="margin-top:1rem"><button class="btn btn-quiet" data-act="h-done">Skip to triage</button></p>` : ''}
      </aside></div></main>`;
  }

  /* ------------ station ------------ */
  function dueList() {
    const out = [];
    pts().forEach((d) => {
      const P = s.p[d.id]; if (gone(P)) return;
      (d.meds || []).forEach((m) => {
        const st = s.meds[m.id];
        if (m.due !== undefined && (st.status === 'due' || st.status === 'verify') && m.due <= s.t + 75) out.push({ pid: d.id, t: m.due, late: s.t > m.due + 60, text: `${d.room} ${m.name} ${m.dose}${st.status === 'verify' ? ', awaiting pharmacy' : ''}` });
      });
    });
    if (C().dueExtras) C().dueExtras(s, A()).forEach((x) => out.push(Object.assign({ pid: (x.text.match(/^\d{3}/) || [])[0] }, x)));
    s.deleg.filter((x) => !x.done).forEach((x) => out.push({ pid: x.pid, t: x.due, late: false, text: `${cna().name}: ${C().delegation.tasks.find((t) => t.id === x.id).label.toLowerCase()}, ${x.pid}` }));
    pts().forEach((d) => { const P = s.p[d.id]; (gone(P) ? F.awayRows(s, A(), d, P) : flowRows(d, P)).filter((r) => !r.done && r.t !== null && (r.late || r.t <= s.t + 75)).forEach((r) => out.push({ pid: d.id, t: r.t, late: r.late, text: `${d.room} ${r.text}`, act: r.key === 'rp' ? 'report' : null })); });
    return out.sort((a, b) => a.t - b.t);
  }
  /* Your priority order: set at triage, re-rankable any time, shown everywhere. */
  function prioList() { const base = (s.prio || s.answers.rank || []).filter((id) => def(id) && here(def(id))); pts().forEach((d) => { if (!base.includes(d.id)) base.push(d.id); }); return base; }
  const prioN = (pid) => { if (!s.prio && !s.answers.rank) return null; const i = prioList().indexOf(pid); return i < 0 ? null : i + 1; };
  const ordinal = (n) => n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');
  const flagsFor = (pid) => s.brain.filter((k) => k.startsWith(pid + ':')).map((k) => def(pid).report[+k.split(':')[1]].text);
  const shortAllergy = (d) => (/No known/.test(d.allergies) ? '' : `<span class="chip alert">Allergy: ${esc(d.allergies.split(',')[0].split('(')[0].trim())}</span>`);
  const codeChip = (d) => (/^Full code/.test(d.code) ? '' : `<span class="chip alert">${esc(d.code.split(',')[0])}</span>`);

  /* The roster: who is who, why they're here, what you noted, where they sit on your list. */
  function ovRoster() {
    const inShift = ui.view === 'station' || ui.view === 'room', list = s.prio || s.answers.rank ? prioList() : C().patients.filter((d) => !d.arrives).map((d) => d.id);
    const pend = C().patients.filter((d) => !here(d));
    const card = (pid, i) => {
      const d = def(pid), P = s.p[pid], g = gone(P), fl = flagsFor(pid), n = prioN(pid);
      const due = inShift && !g ? brainRows(d, P).filter((r) => !r.done && !r.prog && r.t !== null && (r.late || r.t <= s.t + 30)) : [];
      return `<article class="ro ${g ? 'gone' : ''}">
        <div class="ro-h">${n ? `<span class="ro-n" title="Your priority">${n}<small>${ordinal(n)}</small></span>` : ''}${pface(pid)}<div class="ro-who"><b>${d.room} ${esc(d.name)}</b> <small>${ageSex(d)}</small><span>${esc(d.dx)}</span></div>
          ${s.prio && inShift && !g ? `<span class="ro-mv"><button class="btn" data-act="prio" data-pid="${pid}" data-d="-1" aria-label="Move ${esc(d.short)} up" ${i === 0 ? 'disabled data-why="Already first."' : ''}>${ICON.up}</button><button class="btn" data-act="prio" data-pid="${pid}" data-d="1" aria-label="Move ${esc(d.short)} down" ${i === list.length - 1 ? 'disabled data-why="Already last."' : ''}>${ICON.down}</button></span>` : ''}</div>
        <p class="ro-why"><b>Here for</b> ${esc(d.reason)}</p>
        <div class="facts">${legal(d)}<span class="chip">${esc(d.code.split(',')[0])}</span>${shortAllergy(d)}${inShift ? `<span class="chip ${P.seenAt === null ? 'warn' : ''}">${g ? esc(goneText(P)) : lastSeen(P)}</span>` : ''}${P.read && !g ? `<span class="chip read st-${P.read.st}">${esc(stName(P.read.st))}${trend(P)}</span>` : ''}${due.length ? `<span class="chip ${due.some((r) => r.late) ? 'alert' : 'warn'}">${due.length} due</span>` : ''}</div>
        ${fl.length ? `<ul class="ro-fl">${fl.map((f) => `<li><i class="flag-ic on" aria-hidden="true"></i>${esc(f)}</li>`).join('')}</ul>` : `<p class="ro-none">${ui.view === 'handoff' ? 'Nothing flagged yet.' : 'You flagged nothing from report.'}</p>`}
        ${inShift && g ? `<div class="ro-f"><button class="btn btn-primary" data-act="away" data-pid="${pid}">Follow up</button><button class="btn" data-act="chart" data-pid="${pid}">${ICON.chart}Chart</button></div>` : ''}
        ${inShift && !g ? `<div class="ro-f"><button class="btn btn-primary" data-act="goto" data-pid="${pid}">Go to ${d.room}</button><button class="btn" data-act="chart" data-pid="${pid}">${ICON.chart}Chart</button></div>` : ''}
      </article>`;
    };
    const body = `<p class="muted" style="margin-top:0">${s.prio ? 'In your priority order. Move patients up or down as the shift changes; this list isn\'t scored.' : 'Everyone you have today, with what you flagged in report.'}</p>
      <div class="ro-list">${list.map(card).join('')}${pend.map((d) => `<article class="ro pend"><div class="ro-h"><div class="pend-dot" aria-hidden="true"></div><div class="ro-who"><b>${d.room} Admission</b><span>From the ED, about ${E.clock(d.arrives)}</span></div></div><p class="ro-why"><b>Coming for</b> ${esc(d.reason)}</p></article>`).join('')}</div>`;
    return sheet('Your patients', body, `<button class="btn btn-primary" data-act="close">Done</button>`, { wide: true, label: 'Your patients' });
  }

  function ptStrip() {
    const cur = ui.view === 'room' ? s.loc : 'station';
    return `<nav class="pstrip" aria-label="Station and patients"><div class="pstrip-in">
      <button class="ps ps-st ${cur === 'station' ? 'on' : ''}" data-act="${cur === 'station' ? 'here' : 'back'}" ${cur === 'station' ? 'aria-current="page"' : ''}><span class="ps-top"><b>Station</b></span><small>Board and phone</small></button>
      ${C().patients.map((d) => {
        if (!here(d)) return `<button class="ps pend" data-act="pending" data-pid="${d.id}"><span class="ps-top"><b>${d.room}</b></span><small>Arriving ${E.clock(d.arrives)}</small></button>`;
        const P = s.p[d.id], g = gone(P), light = !g && (P.callLight || !!P.bell || s.inbox.some((m) => m.pid === d.id && m.urgent && !m.read));
        const rows = (g ? F.awayRows(s, A(), d, P) : brainRows(d, P)).filter((r) => !r.done && !r.prog && r.t !== null), late = rows.filter((r) => r.late).length, due = rows.filter((r) => !r.late && r.t <= s.t + 30).length;
        const tk = liveGhosts(d.id).length;
        const pn = prioN(d.id);
        return `<button class="ps ${cur === d.id ? 'on' : ''} ${light ? 'alert' : ''} ${g ? 'gone' : ''} ${tk ? 'ticked' : ''}" data-act="${g ? 'away' : cur === d.id ? 'here' : 'goto'}" data-pid="${d.id}" ${cur === d.id ? 'aria-current="page"' : ''} aria-label="Room ${d.room}, ${esc(d.name)}${g ? ', ' + esc(goneText(P)) + ', follow up' : ''}${late ? `, ${late} overdue` : due ? `, ${due} due` : ''}${light ? ', needs attention' : ''}"><span class="ps-top">${pn ? `<span class="ps-n" title="Your priority">${pn}</span>` : ''}<b>${d.room}</b>${P.read && !g ? `<i class="dot st-${P.read.st}" aria-hidden="true"></i>` : ''}${late ? `<em class="late">${late}</em>` : due ? `<em>${due}</em>` : ''}${tk ? `<span class="ps-tick" aria-hidden="true">✓</span>` : ''}</span><small>${esc(d.short)}</small><small class="ps-dx">${g ? esc(awayShort(P)) : esc(d.dx)}</small></button>`;
      }).join('')}</div></nav>`;
  }
  function dueGroups(due) {
    const li = (x) => { const ok = x.pid && def(x.pid) && here(def(x.pid)), aw = ok && gone(s.p[x.pid]); return `<li class="${x.late ? 'late' : ''} ${ok ? 'tap' : ''}"${ok ? ` data-act="${aw ? 'away' : x.act || 'goto'}" data-pid="${x.pid}" role="button" tabindex="0" aria-label="${aw ? 'Follow up on' : 'Go to'} ${x.pid}: ${esc(x.text)}"` : ''}><span class="tm">${E.clock(Math.max(0, x.t))}</span><span>${esc(x.text)}</span></li>`; };
    const over = due.filter((x) => x.late), now = due.filter((x) => !x.late && x.t <= s.t + 30), soon = due.filter((x) => !x.late && x.t > s.t + 30);
    const g = (t, l, c) => (l.length ? `<h4 class="due-h ${c}">${t}<span>${l.length}</span></h4><ul class="due">${l.map(li).join('')}</ul>` : '');
    const gh = ghostList(null);
    return (gh ? `<div class="due-ghosts">${gh}</div>` : '') + g('Overdue', over, 'over') + g('Due now', now, 'now') + g('Coming up', soon, 'soon');
  }
  function lastSeen(P) { return P.seenAt === null ? 'Not seen yet' : `Seen ${E.clock(P.seenAt)}`; }

  /* ------------ the command bar: what needs you, what's next, and a way to let time pass ------------ */
  function nowRows() {
    const out = [];
    pts().forEach((d) => { const P = s.p[d.id], aw = gone(P); (aw ? F.awayRows(s, A(), d, P) : brainRows(d, P)).forEach((r) => { if (!r.done && !r.prog && r.t !== null && r.t <= s.t) out.push({ pid: d.id, key: r.key, text: r.text, late: !!r.late, t: r.t, away: aw, rp: r.key === 'rp' }); }); });
    const pr = prioList();
    return out.sort((a, b) => b.late - a.late || a.t - b.t || pr.indexOf(a.pid) - pr.indexOf(b.pid));
  }
  function nextKnown() {
    let best = null; const put = (t, text) => { if (t > s.t && (!best || t < best.t)) best = { t, text }; };
    pts().forEach((d) => { const P = s.p[d.id]; (gone(P) ? F.awayRows(s, A(), d, P) : brainRows(d, P)).forEach((r) => { if (!r.done && r.t !== null) put(r.t, r.prog ? r.text : `${d.room} ${r.text}`); }); });
    C().patients.forEach((d) => { if (!here(d)) put(d.arrives, `${d.room} admission from the ED`); });
    put(C().length - 60, 'Report hour begins'); put(C().length, 'End of shift');
    return best;
  }
  const rowLabel = (r) => (r.away ? `${def(r.pid).short}: ` : `${def(r.pid).room} `) + r.text;
  const FLAVOR = {
    med: ['Charting vitals and I&Os', 'Restocking the supply cart', 'Returning pages', 'Checking tomorrow\'s lab orders', 'A sip of cold coffee', 'Scanning the telemetry board'],
    psych: ['Charting behavior checks', 'A walk through the milieu', 'Returning a call from a board-and-care', 'Updating the treatment plan', 'A sip of cold coffee', 'Counting sharps with the tech'],
    peds: ['Charting intake and output', 'Restocking syringes and diapers', 'Returning a page from pharmacy', 'Weighing diapers', 'A sip of cold coffee', 'Checking pump volumes'],
  };
  function goalSub(x) {
    const L = C().length;
    if (x.st === 'done') return x.id === 'meds' ? 'None late' : x.id === 'calls' ? 'Nobody waited' : 'Done';
    if (x.st === 'fail') return x.id === 'meds' ? `${x.n} late` : x.id === 'calls' ? `${x.n} missed` : x.id === 'eyes' ? `${x.n} of ${x.of} in time` : `${x.n} of ${x.of} given`;
    if (x.id === 'eyes') return `${x.n} of ${x.of} · by ${E.clock(90)}`;
    if (x.id === 'report') return s.t >= L - 60 ? `${x.n} of ${x.of} given` : `Opens ${E.clock(L - 60)}`;
    return 'So far, so good';
  }
  function goalsHTML(g, cls) { return `<div class="goals ${cls || ''}" role="list" aria-label="Shift goals">${g.map((x) => `<span role="listitem" class="goal ${x.st}" title="${esc(x.sub)}"><i aria-hidden="true">${x.st === 'done' ? '✓' : x.st === 'fail' ? '✕' : ''}</i><span><b>${esc(x.label)}</b><small>${esc(goalSub(x))}</small></span></span>`).join('')}</div>`; }
  function cmdBar() {
    const now = nowRows(), nx = nextKnown(), open = FL.open(s), top = now[0];
    const status = top ? `<div class="cmd-st busy"><span class="cmd-n" aria-hidden="true">${now.length}</span><div><b>${now.length === 1 ? 'One thing needs you' : `${now.length} things need you`}</b><button class="cmd-go" data-act="${top.rp ? 'report' : top.away ? 'away' : 'goto'}" data-pid="${top.pid}">${top.late ? '<em>Overdue</em> ' : ''}${esc(rowLabel(top))} <span aria-hidden="true">›</span></button></div></div>`
      : `<div class="cmd-st clear"><span class="cmd-ok" aria-hidden="true">${ICON.tick}</span><div><b>You're caught up</b><small>Skip ahead. The clock runs until something needs you.</small></div></div>`;
    const calls = open.map((x) => { const v = FL.view(s, C(), x.id), w = who(v.from), left = Math.max(0, x.exp - s.t), pct = left / Math.max(1, x.exp - x.at); return `<button class="fcall ${pct < .4 ? 'hurry' : ''}" data-act="floor" data-id="${x.id}">${faceOf(v.from)}<span class="fc-l"><b>${esc(v.title)}</b><small>${esc(w.name)}${w.role ? ', ' + esc(w.role) : ''}</small></span><span class="fc-ring" style="--p:${pct.toFixed(2)}" aria-label="${left} minutes left"><i>${left}</i><small>min</small></span></button>`; }).join('');
    const skip = `<button class="btn skip ${top ? '' : 'ready'}" data-act="skip">${ICON.ff}<span><b>Skip ahead</b><small>${nx ? `Next known: ${E.clock(nx.t)} · ${esc(nx.text)}` : 'Until something happens'}</small></span></button>`;
    return `<section class="cmd" aria-label="Right now"><div class="cmd-row">${status}${skip}</div>${calls ? `<div class="fcalls"><h4>Floor calls <span>Someone on the unit needs you</span></h4>${calls}</div>` : ''}${goalsHTML(RW.goals(s, C(), A()))}</section>`;
  }
  /* Let time pass: the clock runs minute by minute and stops the moment something needs you. */
  function skipAhead() {
    if (!s || s.ended) return;
    const t0 = s.t, f0 = s.fresh.length, base = new Set(nowRows().map((r) => r.pid + '|' + r.key)), arr = pts().length, dl = s.deleg.filter((x) => x.done).length, L = C().length;
    const why = spend(Math.min(30, L - s.t), null, (ss) => {
      if (ss.fresh.length > f0) { const m = ss.inbox.find((x) => x.id === ss.fresh[ss.fresh.length - 1]); if (m) return { pid: m.pid, from: m.from, text: m.text, urgent: m.urgent }; }
      if (pts().length > arr) { const d = pts()[pts().length - 1]; return { pid: d.id, text: `${d.room} ${d.name} is up from the ED.` }; }
      if (ss.deleg.filter((x) => x.done).length > dl) return { from: C().cna || 'luis', text: `${cna().name} is back and free.` };
      const nk = nowRows().find((r) => !base.has(r.pid + '|' + r.key)); if (nk) return { pid: nk.pid, text: `${rowLabel(nk)}: due now` };
      if (ss.t === L - 60) return { from: 'nova', text: 'One hour left. Start thinking about report.' };
      if (ss.t === L - 30) return { from: 'nova', text: 'Thirty minutes to handoff.' };
      return null;
    });
    ui.ff = { t0, t1: s.t, why: why || (s.ended ? { text: 'That\'s the shift.' } : { text: 'A quiet half hour. Nothing new came up.' }) };
    if (!s.ended) render();
    ffPlay();
  }
  function ffPlay() {
    const f = ui.ff; ui.ff = null; if (!f) return;
    const mins = f.t1 - f.t0; document.querySelectorAll('.ff').forEach((n) => n.remove());
    const fl = FLAVOR[F.kindOf(C())] || FLAVOR.med, pick = [fl[(f.t0 * 7) % fl.length], fl[(f.t0 * 7 + 3) % fl.length]];
    const el = document.createElement('div'); el.className = 'ff' + (f.why.urgent ? ' urgent' : ''); el.setAttribute('role', 'status');
    el.innerHTML = `<div class="ff-card"><svg class="ff-clock" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" class="ff-face"/>${Array.from({ length: 12 }, (_, i) => `<line x1="50" y1="10" x2="50" y2="${i % 3 ? 15 : 18}" transform="rotate(${i * 30} 50 50)"/>`).join('')}<line class="ff-hh" x1="50" y1="50" x2="50" y2="28"/><line class="ff-mh" x1="50" y1="50" x2="50" y2="16"/><circle cx="50" cy="50" r="3.2" class="ff-hub"/></svg>
      <div class="ff-t"><b class="ff-now">${E.clock(f.t0)}</b><small>+<span class="ff-m">0</span> min</small></div>
      <p class="ff-sub">${esc(pick[0])} · ${esc(pick[1].toLowerCase())}</p>
      <p class="ff-why"><span>${esc(f.why.text)}</span></p></div>`;
    document.body.appendChild(el);
    const dur = reduced() ? 120 : Math.min(1500, 420 + mins * 20), T0 = performance.now(), st = C().start || 420;
    const mh = el.querySelector('.ff-mh'), hh = el.querySelector('.ff-hh'), now = el.querySelector('.ff-now'), mm = el.querySelector('.ff-m');
    const done = () => { if (el.classList.contains('out')) return; el.classList.add('out'); setTimeout(() => el.remove(), 300); };
    if (mins > 0) FX.play('whoosh');
    const step = (n) => {
      const p = Math.min(1, (n - T0) / dur), e = 1 - Math.pow(1 - p, 2.4), tt = f.t0 + mins * e, abs = st + tt;
      mh.setAttribute('transform', `rotate(${(abs % 60) * 6} 50 50)`); hh.setAttribute('transform', `rotate(${(abs % 720) * 0.5} 50 50)`);
      now.textContent = E.clock(Math.round(tt)); mm.textContent = Math.round(mins * e);
      if (p < 1) requestAnimationFrame(step); else { el.classList.add('woke'); setTimeout(done, f.why.urgent ? 1500 : 1150); }
    };
    requestAnimationFrame(step); el.addEventListener('click', done);
  }
  function vStation() {
    const doors = C().patients.map((d) => { const P = s.p[d.id]; if (!here(d)) return { pid: d.id, room: d.room, pending: true, eta: E.clock(d.arrives) }; const light = !gone(P) && (P.callLight || !!P.bell || s.inbox.some((m) => m.pid === d.id && m.urgent && !m.read)); return { pid: d.id, room: d.room, name: d.name, light, gone: gone(P), alert: light ? 'needs attention' : '' }; });
    const pending = C().patients.filter((d) => !here(d));
    const due = dueList();
    return `<main>
      ${cmdBar()}
      <div class="hall-wrap">${A_.hallway(s, doors)}</div>
      <div class="station">
        <section class="board" aria-labelledby="bh">
          <div class="board-h"><h2 id="bh">Assignment</h2>${s.prio ? `<button class="btn btn-quiet" data-act="roster" style="min-height:36px;font-size:.85rem">In your priority order · Re-rank</button>` : ''}</div>
          ${prioList().map(def).map((d) => { const P = s.p[d.id], n = prioN(d.id); const v = A().lastVitals(d.id); const flags = s.brain.filter((k) => k.startsWith(d.id + ':')).length; return `<div class="pt-row tap ${gone(P) ? 'gone' : ''}" data-act="${gone(P) ? 'away' : 'goto'}" data-pid="${d.id}">
            <span class="pr-n" aria-label="Your priority ${n || ''}">${n || ''}</span>${pface(d.id)}
            <div><div class="nm">${d.room} ${esc(d.name)}<small>${ageSex(d)}</small></div><div class="dx">${esc(d.dx)}</div><div class="why">Here for ${esc(d.reason.charAt(0).toLowerCase() + d.reason.slice(1))}</div>
            <div class="facts">${legal(d)}${/^Full code/.test(d.code) ? '' : `<span class="chip alert">${esc(d.code.split(',')[0])}</span>`}${/No known/.test(d.allergies) ? '' : `<span class="chip alert">Allergy</span>`}<span class="chip ${P.seenAt === null && !gone(P) ? 'warn' : ''}">${gone(P) ? esc(goneText(P)) : lastSeen(P)}</span>${gone(P) && P.out ? `<span class="chip af-${P.out.spec.course[P.out.known].st}">${esc(awayShort(P))}</span>` : ''}${P.bell && !gone(P) ? '<span class="chip alert">Call light</span>' : ''}${P.read && !gone(P) ? `<span class="chip read st-${P.read.st}">${esc(stName(P.read.st))}${trend(P)}</span>` : ''}${v && !gone(P) ? `<span class="chip">Last vitals ${E.clock(v.t)}</span>` : ''}${flags ? `<span class="chip">${flags} flagged</span>` : ''}</div></div>
            <div class="go">${gone(P) ? (() => { const n = F.awayRows(s, A(), d, P).filter((r) => !r.done).length; return `<button class="btn ${n ? 'btn-primary' : ''}" data-act="away" data-pid="${d.id}">Follow up${n ? ` (${n})` : ''}</button>`; })() : `<button class="btn btn-primary" data-act="goto" data-pid="${d.id}">Go to ${d.room}</button>`}<button class="btn" data-act="chart" data-pid="${d.id}">${ICON.chart}Chart</button></div>
          </div>`; }).join('')}
          ${pending.map((d) => `<div class="pt-row pending tap" data-act="pending" data-pid="${d.id}"><div class="pend-dot" aria-hidden="true"></div><div><div class="nm">${d.room} Admission</div><div class="dx">From the ED, expected about ${E.clock(d.arrives)}. ${esc(d.reason)}.</div></div></div>`).join('')}
          <div class="board-h" style="border-top:1px solid var(--line)"><h2>Unit brain</h2><span class="muted" style="font-size:.82rem">Due across your patients</span></div>
          ${due.length ? dueGroups(due) : '<p class="empty">Nothing due in the next hour.</p>'}
        </section>
        <aside class="side">
          ${phone(8)}
          <div class="tools">
            <button class="btn" data-act="delegate"><b>Ask ${esc(cna().name)}</b><small>Delegate to the ${esc(/^[A-Z]{2,}/.test(cna().role) ? cna().role : cna().role.toLowerCase())}</small></button>
            <button class="btn" data-act="callpick"><b>Call ${esc(prov().name)}</b><small>SBAR, 6 min</small></button>
            ${s.t >= C().length - 60 ? (() => { const L = pts().filter((x) => !gone(s.p[x.id])), n = L.filter((x) => s.report && s.report[x.id]).length; return `<button class="btn ${n < L.length ? 'btn-primary' : ''}" data-act="report" style="grid-column:1/-1"><b>${n < L.length ? `Give report to ${esc(oncoming().name)}` : `Report given to ${esc(oncoming().name)}`}</b><small>${n} of ${L.length} patients · 2 min each</small></button>`; })() : ''}
            ${s.t >= C().length - 30 ? `<button class="btn ${pts().filter((x) => !gone(s.p[x.id])).every((x) => s.report && s.report[x.id]) ? 'btn-primary' : ''}" data-act="endask" style="grid-column:1/-1"><b>End shift</b><small>Handoff at ${E.clock(C().length)}</small></button>` : ''}
          </div>
        </aside>
      </div></main>`;
  }

  function msgHTML(m) {
    const w = who(m.from);
    return `<div class="msg tap ${m.read ? '' : 'unread'} ${m.urgent ? 'urgent' : ''} ${m.id > (ui.msgSeen || 0) ? 'fresh' : ''}" data-act="msg" data-m="${m.id}">${faceOf(m.from)}
      <div><div class="from"><b>${esc(w.name)}</b> ${esc(w.role)} <span aria-hidden="true">at</span> ${E.clock(m.t)}${m.urgent ? ' <b style="color:var(--red)">Urgent</b>' : ''}</div>
      <p class="tx">${esc(m.text)}</p>
      ${m.replies && !m.done ? `<div class="rep">${m.replies.map((r, i) => `<button class="btn" data-act="reply" data-m="${m.id}" data-i="${i}">${esc(r.label)}</button>`).join('')}</div>` : ''}</div></div>`;
  }
  function phone(n) {
    const list = s.inbox.slice(0, n);
    return `<section class="phone" aria-labelledby="ph"><div class="phone-h"><b id="ph">Unit phone</b><span style="font-size:.8rem">${s.inbox.filter((m) => !m.read).length} unread</span></div>
      <div class="msgs">${list.length ? list.map(msgHTML).join('') : '<p class="empty">Quiet so far.</p>'}</div>
      ${s.inbox.length > n ? `<div style="padding:.4rem;border-top:1px solid var(--line)"><button class="btn btn-quiet" data-act="inbox" style="width:100%">All ${s.inbox.length} messages</button></div>` : ''}</section>`;
  }

  /* ------------ room ------------ */
  const SYS = [['vitals', 'Vital signs', 4], ['general', 'General look', 1], ['resp', 'Lung sounds and breathing', 3], ['cardiac', 'Heart and circulation', 3], ['neuro', 'Neuro and mental status', 3], ['pain', 'Pain and sedation', 2], ['skin', 'Skin and wound', 3], ['gi', 'GI, GU and intake/output', 3], ['full', 'Full head-to-toe', 12]];
  function medStatus(m) {
    const st = s.meds[m.id];
    if (m.later) return { cls: '', text: 'At ' + m.later };
    if (m.initStatus === 'given' && st.at === null) return { cls: 'done', text: m.givenNote || 'Given' };
    if (st.status === 'given' && !m.prn) return { cls: 'done', text: 'Given ' + E.clock(st.at) };
    if (st.status === 'held') return { cls: 'done', text: 'Held ' + E.clock(st.at) };
    if (st.status === 'verify') return { cls: '', text: 'Pharmacy hold' };
    if (m.prn) return { cls: '', text: st.given.length ? 'Last ' + E.clock(st.given[st.given.length - 1]) : 'As needed' };
    if (m.initStatus === 'given') return { cls: 'done', text: m.givenNote || 'Given' };
    const late = s.t > m.due + 60; return { cls: late ? 'late' : s.t >= m.due - 30 ? 'due' : '', text: (late ? 'Late, due ' : 'Due ') + E.clock(m.due) };
  }
  /* ------------ decision review: the why, right after the decision ------------ */
  const fbNow = () => (prof.settings.feedback || 'now') === 'now';
  const DOM = Object.fromEntries(E.DOMAINS);
  const judgSince = (n0, pid) => s.judg.slice(n0).filter((j) => pid === undefined || !j.pid || j.pid === pid);
  function reviewHTML(list, title) {
    if (!fbNow() || !list || !list.length) return '';
    return `<div class="rv"><span class="res-cl">${title || 'Why it matters'}</span>${list.map((j, i) => `<div class="rv-i ${j.delta > 0 ? 'good' : j.delta < 0 ? 'bad' : 'neutral'}" style="--i:${i}"><span class="rv-ic" aria-hidden="true">${j.delta > 0 ? '✓' : j.delta < 0 ? '!' : '•'}</span><div><span class="rv-k">${j.delta > 0 ? 'Good call' : j.delta < 0 ? 'Rethink' : 'Note'} · ${esc(DOM[j.domain] || j.domain)}</span><b>${esc(j.text)}</b><p>${esc(j.why)}</p></div>${j.delta ? `<span class="rv-pts ${j.delta > 0 ? 'up' : 'dn'}">${j.delta > 0 ? '+' : ''}${j.delta}</span>` : '<span></span>'}</div>`).join('')}</div>`;
  }
  // A short sting when a decision is judged: never subtle about a serious miss.
  function reviewSound(list) { if (!fbNow() || !list || !list.length) return; const worst = Math.min(...list.map((j) => j.delta)), best = Math.max(...list.map((j) => j.delta)); setTimeout(() => FX.play(worst <= -1 ? 'miss' : best > 0 ? 'right' : 'tap'), 520); }

  /* ------------ condition reads: what the nurse sees after acting ------------ */
  const ST = { stable: ['Looks settled', 0], watch: ['Concerning', 1], urgent: ['Needs you now', 2], gone: ['Off the unit', -1] };
  const stName = (k) => (ST[k] || ST.stable)[0];
  const stRank = (k) => (ST[k] || ST.stable)[1];
  function markRead(pid, st) { const P = s.p[pid]; P.read = { t: s.t, st }; P.reads = (P.reads || []).concat(st).slice(-6); }
  const trend = (P) => (P.reads && P.reads.length ? `<span class="trend" aria-hidden="true">${P.reads.map((r) => `<i class="st-${r}"></i>`).join('')}</span>` : '');

  /* ------------ the brain: an Epic-style task timeline for one patient ------------ */
  const AI = {
    brain: '<svg class="ai" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
    assess: '<svg class="ai" viewBox="0 0 24 24"><path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M10 13v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="2"/></svg>',
    care: '<svg class="ai" viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    meds: '<svg class="ai" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)"/><path d="M9.5 8.6l5 7"/></svg>',
    talk: '<svg class="ai" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg>',
    chart: '<svg class="ai" viewBox="0 0 24 24"><path d="M4 20V4M4 20h16M8 16l4-5 3 3 4-6"/></svg>',
  };
  const tabFor = (text) => (/glucose|BG\b/i.test(text) ? 'care' : /weigh|weight|scan/i.test(text) ? 'care' : /neuro|POSS|sedation|vital|CIWA|mental|assess/i.test(text) ? 'assess' : null);
  /* Completion tracking: every task that leaves the to-do list gets a visible check-off. */
  ui.ghosts = [];
  function openSnap() {
    const o = {};
    C().patients.forEach((d) => { if (!here(d)) return; const P = s.p[d.id]; (gone(P) ? F.awayRows(s, A(), d, P) : brainRows(d, P)).forEach((r) => { if (!r.done && r.key && r.t !== null) o[d.id + '|' + r.key] = { pid: d.id, key: r.key, t: r.t, text: r.text, prog: !!r.prog, late: !!r.late }; }); });
    return o;
  }
  const GHOST_MS = 2600;
  function liveGhosts(pid) { const n = Date.now(); return ui.ghosts.filter((g) => !g.held && n - g.born < GHOST_MS && (pid === null || g.pid === pid)); }
  function ghostList(pid) {
    const gs = liveGhosts(pid); if (!gs.length) return '';
    const n = Date.now();
    return `<div class="b-grp ghosts"><h4>Just completed<span>${gs.length}</span></h4><ul>${gs.map((g) => `<li class="ghost" style="--gd:-${n - g.born}ms"><div class="b-row gdone"><span class="b-tm">${E.clock(s.t)}</span><span class="b-tx"><b>${pid === null ? esc(g.pid) + ' · ' : ''}${esc(g.text)}</b><small>Done${g.by ? ' by ' + esc(g.by) : ''}</small></span><span class="gcheck" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5"/><path d="M7 12.5l3.2 3.2L17.2 8.6"/></svg></span><span></span></div></li>`).join('')}</ul></div>`;
  }
  function brainRows(d, P) {
    if (RC && RC.has(d.id)) return RC.get(d.id);
    const out = brainRows0(d, P); if (RC) RC.set(d.id, out); return out;
  }
  function brainRows0(d, P) {
    const rows = [];
    // Shift assessment: every patient needs one, early.
    const sysDone = Object.keys(P.assessAt || {}).length + (P.vit.some((v) => v.by === 'You') ? 1 : 0);
    rows.push({ key: 'sa', t: 0, late: s.t > 60 && sysDone < 3, done: sysDone >= 3, text: 'Shift assessment', sub: sysDone >= 3 ? `${sysDone} systems documented` : sysDone ? `${sysDone} of 3+ systems documented` : 'Nothing documented yet', go: { act: 'dock', id: 'assess' } });
    (d.meds || []).forEach((m) => {
      const st = s.meds[m.id];
      if (m.available && !m.available(s, P)) return;
      if (m.later) { rows.push({ t: null, later: m.later, text: `${m.name} ${m.dose} ${m.route}`, sub: `Due at ${m.later}` }); return; }
      if (m.due === undefined || m.prn) return;
      if (st.status === 'given' || st.status === 'held') rows.push({ key: 'm:' + m.id, t: st.at, done: true, text: `${m.name} ${m.dose} ${m.route}`, sub: `${st.status === 'given' ? 'Given' : 'Held'} ${E.clock(st.at)}` });
      else if (m.initStatus === 'given') return;
      else rows.push({ key: 'm:' + m.id, t: m.due, late: s.t > m.due + 60, text: `${m.name} ${m.dose} ${m.route}`, sub: st.status === 'verify' ? 'Awaiting pharmacy' : m.freq, go: { act: 'med', id: m.id } });
    });
    if (C().dueExtras) C().dueExtras(s, A()).forEach((x) => { if ((x.text.match(/^\d{3}/) || [])[0] !== d.id) return; const tx = x.text.replace(/^\d{3}\s*/, ''), tab = tabFor(tx); rows.push({ key: 'x:' + tx, t: x.t, late: x.late, text: tx, go: tab ? { act: 'dock', id: tab } : null }); });
    s.deleg.filter((x) => !x.done && x.pid === d.id).forEach((x) => rows.push({ key: 'd:' + x.id + ':' + x.at, at: x.at, t: x.due, prog: true, text: `${cna().name}: ${C().delegation.tasks.find((t) => t.id === x.id).label.toLowerCase()}`, sub: `In progress, back about ${E.clock(x.due)}` }));
    return rows.concat(flowRows(d, P));
  }
  /* Unit-wide work every patient generates: call lights, rounds, PRN follow-up, report. */
  function flowRows(d, P) {
    if (gone(P)) return [];
    const rows = [], Ax = A();
    if (P.bell) rows.push({ key: 'bell:' + P.bell.at, t: P.bell.at, late: s.t > P.bell.at + 10, text: `Call light: ${P.bell.who} ${F.kindOf(C()) === 'psych' ? 'is asking ' : ''}${P.bell.text}`, sub: P.bell.cnaAt ? `${cna().name} is on it` : P.bell.cna ? `${cna().name} could take this` : 'Needs a nurse', go: { act: 'bell', id: d.id }, prog: !!P.bell.cnaAt });
    F.prnRows(s, Ax, d, P).forEach((r) => rows.push(r));
    const rd = F.roundRow(s, Ax, d, P); if (rd && !P.bell) rows.push(rd);
    if (s.t >= C().length - 45) { const rp = s.report && s.report[d.id]; rows.push({ key: 'rp', t: C().length - 30, late: s.t > C().length - 10 && !rp, done: !!rp, text: `Give report to ${oncoming().name}`, sub: rp ? `Given ${E.clock(rp.t)}` : 'At the station', go: { act: 'report', id: d.id } }); }
    return rows;
  }
  const oncoming = () => staff(F.oncoming(C()));
  function awayShort(P) { const o = P.out; if (!o) return goneText(P); const e = o.spec.course[o.known]; return `${o.spec.unit} · ${F.ST[e.st]}`; }
  function paneBrain(d, P) {
    const rows = brainRows(d, P);
    const open = rows.filter((r) => !r.done && !r.prog && r.t !== null);
    const over = open.filter((r) => r.late), now = open.filter((r) => !r.late && r.t <= s.t + 30), soon = open.filter((r) => !r.late && r.t > s.t + 30);
    const later = rows.filter((r) => r.t === null), prog = rows.filter((r) => r.prog);
    const doneLog = s.log.filter((l) => l.pid === d.id && (l.kind === 'find' || l.kind === 'act') && !/^You: "/.test(l.text)).slice().reverse();
    const shown = ui.brainAll ? doneLog : doneLog.slice(0, 5);
    const row = (r, cls) => { const inner = `${cls === 'prog' ? `<span class="b-prog" aria-hidden="true"><i style="width:${Math.min(100, Math.max(4, (s.t - r.at) / Math.max(1, r.t - r.at) * 100)).toFixed(0)}%"></i></span>` : ''}<span class="b-tm">${r.t === null ? esc(r.later) : E.clock(Math.max(r.t, 0))}</span><span class="b-tx"><b>${esc(r.text)}</b>${r.sub ? `<small>${esc(r.sub)}</small>` : ''}</span><span class="b-st">${cls === 'over' ? 'Overdue' : cls === 'now' ? 'Due' : cls === 'soon' ? 'Upcoming' : cls === 'prog' ? 'In progress' : cls === 'later' ? 'Later' : ''}</span>${r.go ? '<span class="b-go" aria-hidden="true">›</span>' : '<span></span>'}`;
      return r.go ? `<li><button class="b-row ${cls}" data-act="${r.go.act}" data-id="${r.go.id}">${inner}</button></li>` : `<li><div class="b-row ${cls} static">${inner}</div></li>`; };
    const grp = (title, list, cls) => (list.length ? `<div class="b-grp ${cls}"><h4>${title}<span>${list.length}</span></h4><ul>${list.map((r) => row(r, cls)).join('')}</ul></div>` : '');
    const flags = s.brain.filter((k) => k.startsWith(d.id + ':')).map((k) => d.report[+k.split(':')[1]].text);
    let h = ghostList(d.id);
    if (!over.length && !now.length) h += '<p class="b-clear">Nothing overdue or due right now for this patient.</p>';
    h += grp('Overdue', over, 'over') + grp('Due now', now, 'now') + grp('In progress', prog, 'prog') + grp('Coming up', soon, 'soon') + grp('Later today', later, 'later');
    if (flags.length) h += `<div class="b-grp flags"><h4>From report<span>${flags.length}</span></h4><ul>${flags.map((f) => `<li><div class="b-flag"><i class="flag-ic on" aria-hidden="true"></i><span>${esc(f)}</span></div></li>`).join('')}</ul></div>`;
    h += `<div class="b-grp done"><h4>Done this shift<span>${doneLog.length}</span></h4>${doneLog.length ? `<ul>${shown.map((l) => `<li><div class="b-row done static"><span class="b-tm">${E.clock(l.t)}</span><span class="b-tx"><b>${esc(l.label || l.text.split(/[.:]/)[0].slice(0, 70))}</b>${l.label ? `<small>${esc(l.text.slice(0, 110))}${l.text.length > 110 ? '…' : ''}</small>` : ''}</span><span class="b-st">${ICON.tick}</span><span></span></div></li>`).join('')}</ul>${doneLog.length > 5 ? `<button class="btn btn-quiet b-more" data-act="brain-all">${ui.brainAll ? 'Show fewer' : `Show all ${doneLog.length}`}</button>` : ''}` : '<p class="b-empty">Nothing yet. Start with what you see.</p>'}</div>`;
    return h;
  }
  const stamped = (label) => !!(ui.stampRow && ui.stampRow.label === label && Date.now() - ui.stampRow.born < 2200);
  const lastFind = (pid, label) => { const l = s.log.slice().reverse().find((x) => x.pid === pid && x.label === label); return l || null; };
  function paneAssess(d, P) {
    return `<ul class="fs">${SYS.map(([id, label, c]) => {
      const L = sysL(id, label), at = id === 'vitals' ? (P.vit.filter((v) => v.by === 'You').pop() || {}).t : id === 'full' ? null : P.assessAt[id];
      const lf = id === 'full' ? null : lastFind(d.id, id === 'vitals' ? 'Vital signs' : L);
      return `<li><button class="fs-row ${at !== undefined && at !== null ? 'has' : ''} ${stamped(L) ? 'stamped' : ''}" style="${stamped(L) ? `--gd:-${Date.now() - ui.stampRow.born}ms` : ''}" data-act="assess" data-sys="${id}"><span class="fs-l"><b>${esc(L)}</b>${lf ? `<small>${esc(lf.text.slice(0, 120))}${lf.text.length > 120 ? '…' : ''}</small>` : `<small>${id === 'full' ? 'Every system, one after another' : 'Not documented this shift'}</small>`}</span><span class="fs-t">${at !== undefined && at !== null ? `${ICON.tick}${E.clock(at)}` : ''}</span><span class="fs-c">${c} min</span></button></li>`;
    }).join('')}</ul>`;
  }
  const RISKY = /restrain|seclu|stop the (insulin|pca)|stop the infusion|straight cath|massage|search his room|1:1|pause the insulin|release/i;
  const ROUND = { med: ['Hourly round', 'Pain, position, bathroom, things in reach'], psych: ['Check-in round', 'Face to face, room safety scan, needs'], peds: ['Hourly round', 'Comfort, IV site, rails, parent needs'] };
  function paneCare(d, P) {
    const Ax = A(), list = (d.interventions || []).filter((x) => !x.avail || x.avail(s, P, Ax)), rd = ROUND[F.kindOf(C())], last = F.roundRow(s, Ax, d, P);
    const top = `${P.bell ? `<li><button class="fs-row urgent" data-act="bell" data-id="${d.id}"><span class="fs-l"><b>Answer the call light</b><small>${esc(P.bell.who)} ${F.kindOf(C()) === 'psych' ? 'is asking ' : ''}${esc(P.bell.text)} · since ${E.clock(P.bell.at)}</small></span><span class="fs-t"></span><span class="fs-c">2 min</span></button></li>` : ''}<li><button class="fs-row ${last && last.late ? 'due' : ''} ${stamped(rd[0]) ? 'stamped' : ''}" style="${stamped(rd[0]) ? `--gd:-${Date.now() - ui.stampRow.born}ms` : ''}" data-act="round" data-id="${d.id}"><span class="fs-l"><b>${rd[0]}</b><small>${rd[1]}${P.roundAt !== undefined ? ` · last ${E.clock(P.roundAt)}` : ''}</small></span><span class="fs-t">${P.roundAt !== undefined ? `${ICON.tick}${E.clock(P.roundAt)}` : ''}</span><span class="fs-c">2 min</span></button></li>`;
    if (!list.length) return `<ul class="fs">${top}</ul>`;
    return `<ul class="fs">${top}${list.map((x) => { const lf = lastFind(d.id, x.label), risky = RISKY.test(x.label + ' ' + x.id); return `<li><button ${risky ? 'data-hold="1"' : ''} class="${risky ? 'holdbtn ' : ''}fs-row ${x.urgent || /juice|d50|brady/.test(x.id) ? 'urgent' : ''} ${lf ? 'has' : ''} ${stamped(x.label) ? 'stamped' : ''}" style="${stamped(x.label) ? `--gd:-${Date.now() - ui.stampRow.born}ms` : ''}" data-act="int" data-id="${x.id}"> ${risky ? '<i class="hold-fill" aria-hidden="true"></i>' : ''}<span class="fs-l"><b>${esc(x.label)}</b>${risky ? '<small class="hold-note">Press and hold to commit</small>' : ''}${lf ? `<small>Last: ${esc(lf.text.slice(0, 100))}${lf.text.length > 100 ? '…' : ''}</small>` : ''}</span><span class="fs-t">${lf ? `${ICON.tick}${E.clock(lf.t)}` : ''}</span><span class="fs-c">${x.cost} min</span></button></li>`; }).join('')}</ul>`;
  }
  function paneMeds(d, P) {
    const meds = (d.meds || []).filter((m) => !m.available || m.available(s, P));
    const sched = meds.filter((m) => !m.prn), prn = meds.filter((m) => m.prn);
    const row = (m) => { const st = medStatus(m), off = m.later || m.initStatus === 'given'; return `<li><button class="mar-row ${st.cls}" data-act="med" data-id="${m.id}" ${off ? `disabled data-why="${esc(m.later ? 'Not due until ' + m.later + '.' : (m.givenNote || 'Already given') + '. Nothing to do now.')}"` : ''}><span class="mar-n"><b>${esc(m.name)}</b> ${esc(m.dose)} ${m.route}<small>${esc(m.freq)}${m.param ? ' · ' + esc(m.param) : ''}</small></span><span class="pill ${st.cls}">${st.text}</span></button></li>`; };
    return `${sched.length ? `<div class="b-grp"><h4>Scheduled<span>${sched.length}</span></h4><ul class="mar">${sched.map(row).join('')}</ul></div>` : ''}${prn.length ? `<div class="b-grp"><h4>As needed (PRN)<span>${prn.length}</span></h4><ul class="mar">${prn.map(row).join('')}</ul></div>` : ''}`;
  }
  function paneTalk(d, P) {
    const Ax = A();
    const item = (act, label, c, extra, cls) => `<li><button class="fs-row ${cls || ''}" data-act="${act}" ${extra || ''}><span class="fs-l"><b>${label}</b></span><span class="fs-t"></span><span class="fs-c">${c}</span></button></li>`;
    const wants = STY && STY.waiting(s, C(), d, P, Ax);
    let h = `<div class="b-grp"><h4>At the bedside</h4><ul class="fs">${item('talk', `Talk with ${esc(d.short)}${wants ? ' <span class="st-tag">Wants to talk</span>' : ''}`, '3 min')}`;
    if (d.family && (!d.family.avail || d.family.avail(s, P, Ax))) h += item('family', `${d.family.mode === 'phone' ? 'Call' : 'Talk with'} ${esc(d.family.name)} (${esc(d.family.rel.toLowerCase())})`, d.family.cost + ' min');
    h += `</ul></div><div class="b-grp"><h4>Call and escalate</h4><ul class="fs">${item('sbar', `Call ${esc(prov().name)} with an SBAR`, '6 min', `data-pid="${d.id}"`)}`;
    (d.comms || []).filter((x) => !x.avail || x.avail(s, P, Ax)).forEach((x) => { h += item('comm', esc(x.label), x.cost + ' min', `data-id="${x.id}"`, x.id === 'rrt' ? 'urgent' : ''); });
    if (!(d.comms || []).some((x) => x.id === 'rrt')) h += item('rrt-generic', 'Call a rapid response', '3 min');
    h += `</ul></div><div class="b-grp"><h4>Get help</h4><ul class="fs">${item('delegate', `Ask ${esc(cna().name)} (${esc(cna().role)})`, '1 min')}</ul></div>`;
    return h;
  }
  const PANES = [
    ['brain', 'Brain', 'Tasks for this patient, overdue first. Tap a task to do it.'],
    ['assess', 'Assess', 'Document an assessment. Each one takes time; the finding goes in the chart.'],
    ['care', 'Care', 'Bedside interventions. What you do here changes the patient.'],
    ['meds', 'MAR', 'Medication administration record. Give or hold each scheduled dose.'],
    ['talk', 'Talk & call', 'Talk with the patient and family, call the provider, or get help.'],
  ];
  function railCounts(d, P) {
    const rows = brainRows(d, P).filter((r) => !r.done && !r.prog && r.t !== null);
    const late = rows.filter((r) => r.late).length, due = rows.filter((r) => !r.late && r.t <= s.t + 30).length;
    const meds = (d.meds || []).filter((m) => !m.prn && m.due !== undefined && !m.later && s.meds[m.id].status === 'due' && m.initStatus !== 'given');
    const medLate = meds.filter((m) => s.t > m.due + 60).length, medDue = meds.filter((m) => m.due <= s.t + 30).length;
    const Ax = A(), ints = (d.interventions || []).filter((x) => !x.avail || x.avail(s, P, Ax)).length;
    return {
      brain: late ? [`${late} overdue`, 'late'] : due ? [`${due} due`, 'due'] : ['Up to date', ''],
      assess: [Object.keys(P.assessAt || {}).length ? `${Object.keys(P.assessAt).length} documented` : 'Start here', Object.keys(P.assessAt || {}).length ? '' : 'due'],
      care: P.bell ? ['Call light on', 'late'] : [`${ints + 1} option${ints === 0 ? '' : 's'}`, ''],
      meds: medLate ? [`${medLate} late`, 'late'] : medDue ? [`${medDue} due`, 'due'] : ['Nothing due', ''],
      talk: STY && STY.waiting(s, C(), d, P, Ax) ? ['Wants to talk', 'due'] : ['Patient, family, provider', ''],
    };
  }
  function vRoom() {
    const d = def(s.loc), P = s.p[d.id], Ax = A();
    const v = Ax.lastVitals(d.id), fl = d.scene(s, P, Ax), st = d.status(s, P, Ax);
    const sceneSvg = A_.room(d, s, P, fl, rigV(d.id), P.callLight || !!P.bell, st === 'urgent');
    const looks = [...sceneSvg.matchAll(/data-act="clue" data-id="([^"]+)" tabindex="0" role="button" aria-label="([^"]+)"/g)].map((x) => [x[1], x[2]]);
    if (!PANES.some((p) => p[0] === ui.dock)) ui.dock = 'brain';
    const pane = PANES.find((p) => p[0] === ui.dock), cnt = railCounts(d, P);
    const logs = s.log.filter((l) => l.pid === d.id).slice().reverse();
    const ab = { T: abn(d, 'T', v.T), HR: abn(d, 'HR', v.HR), BP: abn(d, 'SBP', v.SBP), RR: abn(d, 'RR', v.RR), SpO2: abn(d, 'SpO2', v.SpO2) };
    const bg = P.bgs && P.bgs.length ? P.bgs[P.bgs.length - 1] : null;
    const body = ui.dock === 'brain' ? paneBrain(d, P) : ui.dock === 'assess' ? paneAssess(d, P) : ui.dock === 'care' ? paneCare(d, P) : ui.dock === 'meds' ? paneMeds(d, P) : paneTalk(d, P);
    return `<main class="roomv">
      <div class="room-top ${ui.enter ? 'enter' : ''} ${ui.flash ? 'flash-' + ui.flash : ''}">
        ${sceneSvg}
        <div class="nameplate"><div class="plate"><h2>${esc(d.name)} <small>${ageSex(d)}, ${d.room}</small></h2><div class="muted" style="font-size:.88rem">${esc(d.dx)}</div>
          <div class="facts">${prioN(d.id) ? `<button class="chip prio-chip" data-act="roster" title="Your priority list">#${prioN(d.id)} on your list</button>` : ''}${legal(d)}<span class="chip">${esc(d.code)}</span><span class="chip ${/No known/.test(d.allergies) ? '' : 'alert'}">${esc(d.allergies.split('.')[0])}</span>${P.read ? `<span class="chip read st-${P.read.st}" title="How ${esc(d.short)} looked after your last action">${esc(stName(P.read.st))}${trend(P)}</span>` : ''}</div></div>
          <div class="plate-btns"><button class="btn" data-act="chart" data-pid="${d.id}">${ICON.chart}Chart</button><button class="btn" data-act="back">${ICON.back}Station</button></div></div>
        ${ui.caption ? `<div class="caption ${ui.captionQuiet ? 'quiet' : ''}" role="status">${esc(ui.caption)}</div>` : ''}
      </div>
      ${looks.length ? `<div class="lookaround" role="group" aria-label="Look around the room"><span>Look at</span>${looks.map(([id, l]) => `<button class="look" data-act="clue" data-id="${id}" aria-label="${l}">${esc(l.replace(/^(Meal|Bedside|Cardiac|Oxygen) /, '').replace(/ and pump$| on the table$/, ''))}</button>`).join('')}</div>` : ''}
      <div class="ws">
        <nav class="rail" role="tablist" aria-label="Activities for ${esc(d.short)}">
          ${PANES.map(([id, l]) => `<button role="tab" class="rt ${cnt[id][1]}" data-act="dock" data-id="${id}" aria-selected="${ui.dock === id}">${AI[id]}<span class="rt-l">${l}</span><span class="rt-s">${esc(cnt[id][0])}</span></button>`).join('')}
          <button class="rt rt-chart" data-act="chart" data-pid="${d.id}">${AI.chart}<span class="rt-l">Chart</span><span class="rt-s">Labs, orders, notes</span></button>
        </nav>
        <section class="pane" role="tabpanel" aria-label="${pane[1]}">
          <header class="pane-h"><h3>${pane[1]}<span> · ${esc(d.short)}, ${d.room}</span></h3><p>${pane[2]}</p></header>
          <div class="pane-b">${body}</div>
        </section>
        <aside class="doc" aria-label="Vitals and documentation">
          <div class="vstrip tap" aria-label="Last recorded vitals. Open the vitals flowsheet." data-act="chart" data-pid="${d.id}" data-tab="vitals" role="button" tabindex="0">
            <div class="${ab.T ? 'ab' : ''}"><span>Temp</span><b>${fT(v.T)}</b></div><div class="${ab.HR ? 'ab' : ''}"><span>HR</span><b>${v.HR}</b></div><div class="${ab.BP ? 'ab' : ''}"><span>BP</span><b>${v.SBP}/${v.DBP}</b></div><div class="${ab.RR ? 'ab' : ''}"><span>RR</span><b>${v.RR}</b></div><div class="${ab.SpO2 ? 'ab' : ''}"><span>SpO₂</span><b>${v.SpO2}%</b></div>${bg ? `<div class="${bg.val < 70 || bg.val > 250 ? 'ab' : ''}"><span>Glucose</span><b>${bg.val}</b></div>` : ''}
          </div>
          <div class="vcap">Recorded ${E.clock(v.t)} by ${esc(v.by)}${s.t - v.t > 60 ? ', <b>over an hour ago</b>' : ''}</div>
          <h4 class="doc-h">Shift documentation</h4>
          <ul class="feed" aria-live="polite">${logs.length ? logs.map((l) => `<li class="k-${l.kind} ${l.id > ui.newLogSeen ? 'new' : ''}"><span class="tm">${E.clock(l.t)}</span><span class="tx">${l.kind === 'find' ? `<b>${esc(l.label || '')}</b>` : ''}${esc(l.text)}</span></li>`).join('') : `<li><span class="tm"></span><span class="tx muted">You're at the bedside. Start with what you see.</span></li>`}</ul>
        </aside>
      </div></main>`;
  }

  /* ------------ critical moment: the screen goes dark and the patient comes forward ------------ */
  function ovCrit() {
    const m = s.inbox.find((x) => x.id === ui.crit), d = def(m.pid), P = s.p[d.id], w = who(m.from), g = gone(P), inRoom = ui.view === 'room' && s.loc === d.id;
    return `<div class="crit" role="alertdialog" aria-modal="true" aria-labelledby="crit-h" aria-describedby="crit-tx">
      <div class="crit-dim" aria-hidden="true"></div>
      <div class="crit-stage">
        <div class="crit-spot"><span class="crit-ring"></span><span class="crit-ring r2"></span>${R.bust(d.id, rigV(d.id), 'crit-bust')}</div>
        <svg class="crit-ecg" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 34 H210 l10 -4 8 4 h16 l8 -28 10 50 8 -30 7 8 h40 l12 -6 10 6 H600"/></svg>
        <p class="crit-k">${g ? 'Critical event' : 'Urgent'} · ${E.clock(m.t)}</p>
        <h2 id="crit-h">${d.room} ${esc(d.short)}</h2>
        <p class="crit-tx" id="crit-tx">${esc(m.text)}</p>
        <p class="crit-from">${faceOf(m.from)}<span><b>${esc(w.name)}</b> ${esc(w.role)}</span></p>
        ${(() => { if (!fbNow()) return ''; const why = s.judg.filter((j) => j.pid === d.id && j.delta < 0 && Math.abs(j.t - m.t) <= 1); return why.length ? `<div class="crit-why">${why.map((j) => `<span class="rv-k">Why this happened</span><b>${esc(j.text)}</b><p>${esc(j.why)}</p>`).join('')}</div>` : ''; })()}
        <div class="crit-f">${g ? `<button class="btn btn-crit" data-act="crit-x">Continue</button><button class="btn crit-later" data-act="chart" data-pid="${d.id}">Open chart</button>` : inRoom ? `<button class="btn btn-crit" data-act="crit-x">Back to the bedside</button>` : `<button class="btn btn-crit" data-act="crit-go" data-pid="${d.id}">Go to ${d.room} now <span aria-hidden="true">→</span></button><button class="btn crit-later" data-act="crit-x">Not now</button>`}</div>
      </div></div>`;
  }

  /* ------------ consequence card ------------ */
  function ovResult() {
    const r = ui.res, d = def(r.pid), changed = r.st0 !== r.st1, dir = !changed ? 0 : r.st1 === 'gone' ? 0 : stRank(r.st1) > stRank(r.st0) ? 1 : -1;
    const V = r.vNew, Vp = r.vPrev;
    const dlt = (k, lab, fmt, hi, lo) => { const a = V[k], b = Vp ? Vp[k] : null; const diff = b === null || b === undefined ? 0 : a - b; const ab = a > hi || a < lo; return `<div class="${ab ? 'ab' : ''}"><span>${lab}</span><b>${fmt(a)}</b>${diff ? `<em class="${diff > 0 ? 'up' : 'dn'}">${diff > 0 ? '▲' : '▼'} ${fmt(Math.abs(diff))}</em>` : Vp ? '<em>no change</em>' : ''}</div>`; };
    const vit = V ? `<div class="res-vit">${dlt('T', 'Temp', (x) => (+x).toFixed(1), norm(d, 'T')[1], norm(d, 'T')[0])}${dlt('HR', 'HR', (x) => Math.round(x), norm(d, 'HR')[1], norm(d, 'HR')[0])}${dlt('SBP', 'Systolic', (x) => Math.round(x), norm(d, 'SBP')[1], norm(d, 'SBP')[0])}${dlt('RR', 'RR', (x) => Math.round(x), norm(d, 'RR')[1], norm(d, 'RR')[0])}${dlt('SpO2', 'SpO₂', (x) => Math.round(x) + '%', 101, norm(d, 'SpO2')[0] - 1)}</div>${Vp ? `<p class="res-since">Compared with ${E.clock(Vp.t)} (${esc(Vp.by)})</p>` : ''}` : '';
    const mins = r.t1 - r.t0;
    const intro = r.crit ? `<div class="res-intro ${r.crit}" aria-hidden="true"><div class="crit-spot"><span class="crit-ring"></span><span class="crit-ring r2"></span>${R.bust(r.pid, rigV(r.pid), 'crit-bust')}</div><b>${r.crit === 'worse' ? (r.st1 === 'urgent' || r.alerts.length ? 'Needs you now' : 'Getting worse') : 'Turning point'}</b><span>${esc(d.room)} ${esc(d.short)}${changed ? `: ${esc(stName(r.st0))} → ${esc(stName(r.st1))}` : ''}</span></div>` : '';
    const alerts = (r.alerts || []).map((a) => `<div class="res-alert">${faceOf(a.from)}<p><b>${esc(who(a.from).name)}</b>${esc(a.text)}</p></div>`).join('');
    return `<div class="scrim res-scrim ${r.crit ? 'crit-' + r.crit : ''}" data-act="${r.crit ? '' : 'res-close'}" data-scrim="1">${intro}<div class="res ${dir > 0 || r.crit === 'worse' || (fbNow() && (r.review || []).some((j) => j.delta <= -2)) ? 'worse' : dir < 0 ? 'better' : ''} ${r.crit ? 'late-in' : ''}" role="dialog" aria-modal="true" aria-label="${esc(r.label)}" data-k="${r.id}">
      <div class="res-top">${pface(r.pid)}<div><span class="res-k">${esc(d.room)} ${esc(d.short)}</span><h2>${esc(r.label)}</h2></div>
        <div class="res-clock" aria-label="${mins} minutes, ${E.clock(r.t0)} to ${E.clock(r.t1)}"><span>${E.clock(r.t0)}</span><i aria-hidden="true"></i><b>${E.clock(r.t1)}</b><small>+${mins} min</small></div></div>
      <div class="res-bar" aria-hidden="true"><i style="--from:${(r.t0 / C().length * 100).toFixed(1)}%;--to:${(r.t1 / C().length * 100).toFixed(1)}%"></i></div>
      ${r.text ? `<p class="res-text">${esc(r.text)}</p>` : ''}
      ${reviewHTML(r.review)}
      ${alerts}
      ${(r.done || []).length ? `<div class="res-done"><span class="res-cl">Checked off</span><ul>${r.done.map((x, i) => `<li style="--i:${i}"><span class="gcheck" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5"/><path d="M7 12.5l3.2 3.2L17.2 8.6"/></svg></span><s>${esc(x)}</s></li>`).join('')}</ul></div>` : ''}
      ${vit}
      <div class="res-cond ${changed ? 'chg' : ''}"><span class="res-cl">${changed ? 'Condition changed' : 'Condition'}</span>${changed ? `<span class="pill st-${r.st0} was">${esc(stName(r.st0))}</span><span class="res-arrow" aria-hidden="true">→</span>` : ''}<span class="pill st-${r.st1} now">${esc(stName(r.st1))}</span></div>
      ${(r.meanwhile || []).length ? `<div class="res-mw"><span class="res-cl">Meanwhile, while you were here</span><ul>${r.meanwhile.map((x) => `<li><b>${esc(x.pid)} ${esc(def(x.pid).short)}</b> ${esc(x.text)} is now overdue</li>`).join('')}</ul></div>` : ''}
      ${r.msgs ? `<button class="res-msgs" data-act="res-inbox">${ICON.msg}<span>While you were busy: <b>${r.msgs} new message${r.msgs === 1 ? '' : 's'}</b></span><span aria-hidden="true">›</span></button>` : ''}
      <div class="res-f"><button class="btn btn-primary" data-act="res-close">Continue</button></div>
    </div></div>`;
  }

  /* ------------ rewards: stars, XP, the career ladder, badges ------------ */
  const GLYPH = {
    badge: '<path d="M12 3.2l2.3 1.7 2.8-.2.9 2.7 2.3 1.7-.9 2.7.9 2.7-2.3 1.7-.9 2.7-2.8-.2L12 20.4l-2.3-1.7-2.8.2-.9-2.7-2.3-1.7.9-2.7-.9-2.7 2.3-1.7.9-2.7 2.8.2z"/><path d="M9.2 12.2l2 2 3.8-4.2"/>',
    star: '<path d="M12 3.6l2.5 5.2 5.7.7-4.2 3.9 1.1 5.7L12 16.3l-5.1 2.8 1.1-5.7-4.2-3.9 5.7-.7z"/>',
    check: '<circle cx="12" cy="12" r="8.2"/><path d="M8 12.4l2.8 2.8 5.3-5.8"/>',
    flame: '<path d="M12 3c1 3.3 5 5.2 5 9.9a5 5 0 0 1-10 0c0-2.4 1.4-3.7 2.4-4.9.3 1.5 1 2.5 2 3 .1-2.9-1-5.3.6-8z"/>',
    eye: '<path d="M2.8 12s3.4-5.8 9.2-5.8 9.2 5.8 9.2 5.8-3.4 5.8-9.2 5.8S2.8 12 2.8 12z"/><circle cx="12" cy="12" r="2.7"/>',
    heart: '<path d="M12 19.6s-7-4.4-7-9.8a4 4 0 0 1 7-2.6 4 4 0 0 1 7 2.6c0 5.4-7 9.8-7 9.8z"/><path d="M5.6 12h3l1.4-2.4 2 4.6 1.5-2.2h4.8"/>',
    solo: '<circle cx="12" cy="8" r="3.4"/><path d="M5.5 19.5c.8-3.8 3.4-5.8 6.5-5.8s5.7 2 6.5 5.8"/>',
    bell: '<path d="M6.5 15.8V11a5.5 5.5 0 0 1 11 0v4.8l1.6 2H4.9z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    map: '<path d="M12 20.8s-5.8-5.4-5.8-10.6a5.8 5.8 0 0 1 11.6 0c0 5.2-5.8 10.6-5.8 10.6z"/><circle cx="12" cy="10.2" r="2.3"/>',
    crown: '<path d="M4.5 17l-1.3-8.6 4.9 3.7L12 5.3l3.9 6.8 4.9-3.7-1.3 8.6z"/><path d="M4.8 20h14.4"/>',
    home: '<path d="M4 11.2L12 4.5l8 6.7"/><path d="M6.3 9.6V19h11.4V9.6"/><path d="M10.3 19v-4.6h3.4V19"/>',
    shield: '<path d="M12 3.5l7 2.8v5.2c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6.3z"/><path d="M9 12l2.2 2.2L15.3 10"/>',
    up: '<path d="M4 18l5.5-5.5 3.5 3.5L20 9"/><path d="M14.5 9H20v5.5"/>',
    redo: '<path d="M18.5 8.5A7 7 0 1 0 19 14"/><path d="M19 4v4.8h-4.8"/>',
    chat: '<path d="M4.5 6.5h15v9h-8l-4 3.5v-3.5h-3z"/><path d="M12 13.2s-2.8-1.6-2.8-3.3a1.5 1.5 0 0 1 2.8-.8 1.5 1.5 0 0 1 2.8.8c0 1.7-2.8 3.3-2.8 3.3z"/>',
    book: '<path d="M4.5 5.5c2.6-.8 5.1-.5 7.5 1 2.4-1.5 4.9-1.8 7.5-1v12.6c-2.6-.8-5.1-.5-7.5 1-2.4-1.5-4.9-1.8-7.5-1z"/><path d="M12 6.5v12.6"/>',
  };
  function badgeHTML(id, locked, tag) {
    const b = RW.BADGES.find((x) => x.id === id);
    return `<${tag || 'button'} class="bdg ${locked ? 'lock' : ''} g-${b.g}" ${tag ? '' : `data-act="badge" data-id="${b.id}"`} aria-label="${esc(b.label)}${locked ? ', locked' : ''}: ${esc(b.how)}"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" class="bd-rim"/><circle cx="24" cy="24" r="16.5" class="bd-in"/><g transform="translate(12 12)" class="bd-g">${GLYPH[b.g]}</g></svg><small>${esc(b.label)}</small></${tag || 'button'}>`;
  }
  const starSvg = (on, i, cls) => `<svg class="${cls || 'st'} ${on ? 'on' : ''}" style="--i:${i}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>`;
  function lvHTML(lv, xp, from, up) {
    return `<div class="rw-lv"><span class="lv-n" aria-hidden="true">${lv.n}</span><div class="lv-b"><b>${esc(lv.title)}${up ? ' <em class="lvup">Level up</em>' : ''}</b><div class="lv-bar" aria-hidden="true"><i style="--from:${(from * 100).toFixed(1)}%;--to:${(lv.pct * 100).toFixed(1)}%"></i></div><small>Level ${lv.n} · ${fmtN(xp)} XP${lv.hi ? ` · ${fmtN(lv.hi - xp)} to ${esc(lv.next)}` : ' · top of the ladder'}</small></div></div>`;
  }
  function rewardHTML() {
    const r = s.reward; if (!r) return '';
    const up = r.lvAfter.n > r.lvBefore.n, from = up ? 0 : r.lvBefore.pct;
    const nextStar = r.stars < 3 ? `${RW.STARS[r.stars]} for ${r.stars ? 'the next' : 'a'} star` : 'Three stars';
    return `<section class="reward ${ui.debDone ? 'shown' : 'play'}" aria-label="Rewards">
      <div class="rw-stars" aria-label="${r.stars} of 3 stars">${[0, 1, 2].map((i) => starSvg(i < r.stars, i)).join('')}<small>${esc(nextStar)}${r.prevStars > r.stars ? ` · your best is ${r.prevStars}` : r.stars > r.prevStars && r.prevStars ? ' · new best' : ''}</small></div>
      <div class="rw-mid"><h3>Shift goals</h3>${goalsHTML(r.goals, 'wide')}</div>
      <div class="rw-xp"><ul>${r.lines.map((l, i) => `<li style="--i:${i}"><span>${esc(l.k)}</span><b>+${fmtN(l.v)}</b></li>`).join('')}<li class="tot" style="--i:${r.lines.length}"><span>This shift</span><b>+${fmtN(r.total)} XP</b></li></ul>
        ${lvHTML(r.lvAfter, r.after, from, up)}</div>
      ${r.earned.length ? `<div class="rw-badges"><h3>New badge${r.earned.length > 1 ? 's' : ''}</h3><div>${r.earned.map((b) => badgeHTML(b, false, 'span')).join('')}</div></div>` : ''}
    </section>`;
  }
  function careerHTML() {
    const xp = prof.xp || 0, lv = RW.level(xp), have = prof.badges || {}, n = Object.keys(have).length;
    const les = Object.values(prof.lessons || {}), open = les.filter((l) => !l.fixed).length, fixed = les.length - open;
    return `<section class="career" aria-label="Your career"><div class="cr-l"><p class="eyebrow">Your career</p>${lvHTML(lv, xp, 0, false)}${les.length ? `<button class="cr-les" data-act="awards" data-k="lessons"><b>${open}</b> open lesson${open === 1 ? '' : 's'} · <b>${fixed}</b> fixed<span aria-hidden="true">›</span></button>` : ''}</div>
      <div class="cr-b"><p class="eyebrow">Badges <span>${n} of ${RW.BADGES.length}</span><button class="btn btn-quiet cr-all" data-act="awards">All achievements ›</button></p><div class="cr-badges">${RW.BADGES.map((b) => badgeHTML(b.id, !have[b.id])).join('')}</div></div></section>`;
  }

  /* ------------ achievements: tracks, milestones, units, the lesson log, the floor-call collection ------------ */
  const MEDAL = ['none', 'bronze', 'silver', 'gold'];
  function medalHTML(tier, g) { return `<svg class="medal m-${MEDAL[tier]}" viewBox="0 0 48 48" aria-hidden="true"><path d="M15 3h7l2 9-6 2zM33 3h-7l-2 9 6 2z" class="md-rib"/><circle cx="24" cy="29" r="15" class="md-rim"/><circle cx="24" cy="29" r="11" class="md-in"/><g transform="translate(12 17)" class="md-g">${GLYPH[g] || GLYPH.star}</g></svg>`; }
  const TRACKG = { safety: 'shield', priority: 'up', assess: 'eye', meds: 'check', deleg: 'solo', comm: 'bell', judgment: 'heart', time: 'flame', lessons: 'book', stories: 'chat', floor: 'badge', shifts: 'map', stars: 'star' };
  const caseTitle = (id) => { const k = E.getCase(id); return k ? `${k.title} · ${k.level}` : 'Floor calls'; };
  const ago = (ms) => { const d = Math.round((Date.now() - ms) / 86400000); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`; };
  function trackRow(tr) {
    const v = tr.val(prof), tier = RW.tierOf(tr, v), next = tr.tiers[tier], lo = tier ? tr.tiers[tier - 1] : 0, pct = next ? Math.min(1, (v - lo) / (next - lo)) : 1;
    return `<li class="trk t-${MEDAL[tier]}">${medalHTML(tier, TRACKG[tr.dom || tr.id])}<div class="trk-b"><b>${esc(tr.label)}<span class="trk-t">${RW.TIER[tier]}</span></b><small>${esc(tr.how)}</small><div class="trk-bar" aria-hidden="true"><i style="width:${(pct * 100).toFixed(0)}%"></i></div><small class="trk-n">${v}${next ? ` of ${next} for ${RW.TIER[tier + 1].toLowerCase()}` : ' · maxed'}</small></div></li>`;
  }
  function lessonsHTML(filter) {
    const L = Object.entries(prof.lessons || {}).map(([k, l]) => Object.assign({ k }, l));
    const list = L.filter((l) => (filter === 'fixed' ? l.fixed : !l.fixed)).sort((a, b) => (b.last || b.first) - (a.last || a.first));
    if (!L.length) return '<p class="empty">No lessons yet. Finish a shift: every call to rethink lands here, and it\'s marked fixed when you replay that shift and don\'t repeat it.</p>';
    const groups = {}; list.forEach((l) => { const g = l.caseId || 'floor'; (groups[g] = groups[g] || []).push(l); });
    const order = CASES.concat('floor').filter((g) => groups[g]);
    return (order.length ? order.map((g) => `<div class="les-g"><h4>${esc(g === 'floor' ? 'Floor calls' : caseTitle(g))}${g !== 'floor' && filter !== 'fixed' ? `<button class="btn btn-quiet les-play" data-act="pick-case" data-id="${g}">Replay to fix ›</button>` : ''}</h4><ul class="les">${groups[g].map((l) => `<li class="${l.fixed ? 'fixed' : ''}"><details><summary><span class="les-ic" aria-hidden="true">${l.fixed ? '✓' : '!'}</span><span class="les-t"><b>${esc(l.text)}</b><small>${esc((DOM[l.dom] || '') + (l.pid ? ' · ' + l.pid : ''))} · ${l.fixed ? `fixed ${ago(l.fixed)}` : l.times > 1 ? `happened ${l.times} times` : `first seen ${ago(l.first)}`}</small></span></summary><p>${esc(l.why)}</p></details></li>`).join('')}</ul></div>`).join('') : `<p class="empty">${filter === 'fixed' ? 'Nothing fixed yet. Replay a shift and avoid a mistake you made before.' : 'No open lessons. Every mistake you\'ve made, you\'ve fixed.'}</p>`);
  }
  function floorHTML() {
    const seen = prof.floorSeen || {}, P = FL.POOL, KIND = { med: 'Med-surg', psych: 'Psych', peds: 'Peds' };
    return `<p class="muted ach-note">Floor calls come at random. Answer one with the best choice to collect it; anything less can be collected on a later shift.</p><div class="fcol">${P.map((x) => { const v = seen[x.id]; return `<div class="fc-t ${v || 'unseen'}" title="${esc(v ? x.title : 'Not seen yet')}"><span class="fc-g" aria-hidden="true">${v === 'best' ? '★' : v ? '◐' : '?'}</span><b>${v ? esc(x.title) : 'Not seen yet'}</b><small>${x.k.length > 1 ? 'Any unit' : KIND[x.k[0]]}${v && v !== 'best' ? ' · try again' : ''}</small></div>`; }).join('')}</div>`;
  }
  function vAwards() {
    const have = prof.badges || {}, tr = RW.TRACKS, tiers = RW.tiers(prof), medals = Object.values(tiers).reduce((n, x) => n + x, 0);
    const les = Object.values(prof.lessons || {}), open = les.filter((l) => !l.fixed).length, fixed = les.length - open;
    const col = Object.values(prof.floorSeen || {}).filter((v) => v === 'best').length, lv = RW.level(prof.xp || 0);
    const tab = ui.awTab || 'all', tabs = [['all', 'Overview'], ['lessons', `Lesson log${open ? ` (${open})` : ''}`], ['floor', 'Floor calls'], ['units', 'Units']];
    let body = '';
    if (tab === 'all') body = `<section class="ach-sec"><h2>Skill tracks</h2><p class="muted ach-note">Every good call counts toward its skill for good. Bronze, silver, gold.</p><ul class="trks">${tr.map(trackRow).join('')}</ul></section>
      <section class="ach-sec"><h2>Milestones <span class="muted">${Object.keys(have).length} of ${RW.BADGES.length}</span></h2><div class="ach-badges">${RW.BADGES.map((b) => `<div class="ach-b ${have[b.id] ? '' : 'lock'}">${badgeHTML(b.id, !have[b.id], 'span')}<div><b>${esc(b.label)}</b><small>${esc(b.how)}</small>${have[b.id] ? `<small class="ach-when">Earned ${ago(have[b.id])}</small>` : ''}</div></div>`).join('')}</div></section>`;
    if (tab === 'lessons') body = `<section class="ach-sec"><h2>Lesson log</h2><p class="muted ach-note">Every call to rethink from a finished shift is kept here with the reason. Replay that shift and don't repeat it, and the lesson is marked fixed (+60 XP). Floor-call lessons are fixed when you meet that call again and choose the best answer.</p>
      <div class="filter" role="group" aria-label="Lessons">${[['open', `Still to fix (${open})`], ['fixed', `Fixed (${fixed})`]].map(([k, l]) => `<button class="btn ${(ui.lesF || 'open') === k ? 'btn-primary' : ''}" data-act="les-f" data-k="${k}" aria-pressed="${(ui.lesF || 'open') === k}">${l}</button>`).join('')}</div>${lessonsHTML(ui.lesF || 'open')}</section>`;
    if (tab === 'floor') body = `<section class="ach-sec"><h2>Floor-call collection <span class="muted">${col} of ${FL.POOL.length}</span></h2>${floorHTML()}</section>`;
    if (tab === 'units') body = `<section class="ach-sec"><h2>Units</h2><div class="ach-units">${CASES.map((id) => { const k = E.getCase(id), st = (prof.stars || {})[id] || 0, n = (prof.done || {})[id] || prof.runs.filter((r) => r.caseId === id).length, best = (prof.best || {})[id] || (prof.runs.filter((r) => r.caseId === id).map((r) => r.score).sort((a, b) => b - a)[0]), ol = les.filter((l) => l.caseId === id && !l.fixed).length; return `<div class="ach-u"><span class="rung-st">${[0, 1, 2].map((i) => starSvg(i < st, i, 'rs')).join('')}</span><b>${esc(k.title)}</b><small>${esc(k.level)}</small><dl><dt>Best</dt><dd>${best !== undefined ? best : '–'}</dd><dt>Played</dt><dd>${n || 0}</dd><dt>Open lessons</dt><dd>${ol}</dd></dl><button class="btn ${n ? '' : 'btn-primary'}" data-act="pick-case" data-id="${id}">${n ? 'Play again' : 'Play'}</button></div>`; }).join('')}</div></section>`;
    return `<header class="top"><button class="mark" data-act="aw-back">The Shift</button><div class="where">Achievements</div><button class="btn btn-quiet" data-act="aw-back">${ICON.back}Back</button></header><main><div class="ach">
      <section class="ach-hero"><div class="ach-lv">${lvHTML(lv, prof.xp || 0, 0, false)}</div><div class="ach-sum"><div><b>${medals}</b><small>track medals</small></div><div><b>${Object.keys(have).length}</b><small>milestones</small></div><div><b>${fixed}</b><small>lessons fixed</small></div><div><b>${col}</b><small>floor calls collected</small></div></div></section>
      <nav class="ach-tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" data-act="aw-tab" data-k="${k}" aria-selected="${tab === k}">${l}</button>`).join('')}</nav>${body}</div></main>`;
  }
  function learnHTML() {
    const r = s.reward, L = r && r.learn; if (!L) return '';
    const fx = L.fixed.map((k) => prof.lessons[k]).filter(Boolean), ag = L.again.map((k) => prof.lessons[k]).filter(Boolean);
    const ups = L.ups.map((u) => { const tr = RW.TRACKS.find((x) => x.id === u.id); return `<span class="up">${medalHTML(u.tier, TRACKG[tr.dom || tr.id])}<span><b>${esc(tr.label)}</b><small>${RW.TIER[u.tier]}</small></span></span>`; }).join('');
    if (!fx.length && !L.added.length && !ups && !ag.length) return `<section class="learn"><p class="muted">Every call to rethink from a finished shift goes into your lesson log. <button class="btn btn-quiet" data-act="awards">Achievements ›</button></p></section>`;
    return `<section class="learn" aria-label="What you learned">
      ${fx.length ? `<div class="ln-fix"><h3>Lessons you fixed <span>${fx.length}</span></h3><ul>${fx.slice(0, 6).map((l) => `<li><span class="les-ic" aria-hidden="true">✓</span><span>${esc(l.text)}</span></li>`).join('')}${fx.length > 6 ? `<li class="muted">and ${fx.length - 6} more</li>` : ''}</ul><p class="muted">Last time you made these mistakes. This time you didn't.</p></div>` : ''}
      ${ag.length ? `<div class="ln-ag"><h3>Came back <span>${ag.length}</span></h3><ul>${ag.slice(0, 4).map((l) => `<li><span class="les-ic" aria-hidden="true">!</span><span>${esc(l.text)}</span></li>`).join('')}</ul></div>` : ''}
      ${ups ? `<div class="ln-ups"><h3>Track medals</h3><div>${ups}</div></div>` : ''}
      <div class="ln-f">${L.added.length ? `<p><b>${L.added.length} new lesson${L.added.length === 1 ? '' : 's'}</b> in your log. Replay this shift and avoid ${L.added.length === 1 ? 'it' : 'them'} to mark ${L.added.length === 1 ? 'it' : 'them'} fixed.</p>` : ''}<button class="btn" data-act="awards" data-k="lessons">Open lesson log ›</button><button class="btn btn-quiet" data-act="awards">All achievements</button></div>
    </section>`;
  }

  /* ------------ debrief ------------ */
  function storyHTML(o) {
    if (!STY) return ''; const e = STY.epilogue(s, C(), def(o.id), s.p[o.id], o.tone); if (!e) return '';
    const more = e.total - e.heard;
    return `<div class="st-epi"><div class="st-eh"><span class="st-k">Their story</span>${trustDots(e.trust)}</div><p>${esc(e.text)}</p>${e.learned.length ? `<details><summary>What you learned about them <span class="muted">${e.heard} of ${e.total}</span></summary><ul>${e.learned.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}${more ? `<small class="muted">${e.heard ? `${more} more to discover` : `You didn't get to know them this shift. There's more to their story`}. Time at the bedside, when they're stable, opens it.</small>` : ''}</div>`;
  }
  function vDebrief() {
    const d = E.debrief(s);
    const prior = prof.runs.filter((r) => r.caseId === s.caseId).slice(1), best = prior.length ? Math.max(...prior.map((r) => r.score)) : null;
    const nextId = CASES[CASES.indexOf(s.caseId) + 1], next = nextId ? E.getCase(nextId) : null;
    const items = d.judg.filter((j) => ui.filter === 'all' || (ui.filter === 'good' ? j.delta > 0 : j.delta < 0));
    return `<main><div class="deb">
      <section class="deb-hero"><div><p class="muted" style="margin:0">${esc(C().title)} debrief, ${E.clock(0)} to ${E.clock(s.t)}</p><h1>${esc(d.rating)}</h1><p class="muted" style="max-width:52ch">${s.t < C().length - 5 ? `You ended the shift early, at ${E.clock(s.t)}. ` : ''}Here is what happened to your patients, and the decisions that shaped it.</p></div>
      <div class="deb-score"><span class="num" data-to="${d.overall}">${ui.debDone ? d.overall : 0}</span><small>Overall, out of 100${best !== null ? ` · your best ${best}` : ''}</small></div></section>
      ${rewardHTML()}${learnHTML()}
      ${(() => { const hurt = (j) => (d.outcomes.find((o) => o.id === j.pid) || {}).tone === 'bad' ? 0 : 1, neg = d.judg.filter((j) => j.delta < 0), real = neg.filter((j) => !/-unseen$/.test(j.key || '')), w = (real.length ? real : neg).sort((a, b) => hurt(a) - hurt(b) || a.delta - b.delta || a.t - b.t)[0], pos = d.judg.filter((j) => j.delta > 0 && !(j.pid && (d.outcomes.find((o) => o.id === j.pid) || {}).tone === 'bad')), g = pos.sort((a, b) => (a.domain === 'priority') - (b.domain === 'priority') || b.delta - a.delta || a.t - b.t)[0]; return w || g ? `<section class="keyline">${w ? `<div class="kl bad"><span class="mk">The decision that mattered most</span><b>${esc(w.text)}</b><p>${esc(w.why)}</p></div>` : ''}${g ? `<div class="kl good"><span class="mk">Your best call</span><b>${esc(g.text)}</b></div>` : ''}</section>` : ''; })()}
      <section class="outs" aria-label="Patient outcomes">${d.outcomes.map((o) => `<div class="out">${pface(o.id)}<div><span class="tone ${o.tone}">${{ good: 'Good outcome', mixed: 'Mixed outcome', bad: 'Poor outcome' }[o.tone]}</span><h3>${def(o.id).room} ${esc(def(o.id).short)}: ${esc(o.title)}</h3><p>${esc(o.text)}</p>${storyHTML(o)}${o.next ? `<details class="nx"><summary>What happened next in ${esc(F.where(o.next.unit))}</summary><ol class="aw-tl">${o.next.entries.map((e) => `<li class="${e.after ? 'after' : ''}"><span class="aw-tm">${e.after ? 'After your shift' : E.clock(e.t)}</span><span class="pill af-${e.st}">${F.ST[e.st]}</span><p>${esc(e.text)}</p></li>`).join('')}${o.next.later ? `<li class="after"><span class="aw-tm">Later</span><span></span><p>${esc(o.next.later)}</p></li>` : ''}</ol></details>` : ''}</div></div>`).join('')}</section>
      <div class="deb-grid">
        <section aria-labelledby="dh"><div class="by-h"><h2 id="dh">${ui.byCj ? 'By NCLEX step' : 'By skill'}</h2>${CJ ? `<div class="seg" role="group" aria-label="Score by"><button data-act="by" data-v="skill" aria-pressed="${!ui.byCj}">Skills</button><button data-act="by" data-v="cj" aria-pressed="${!!ui.byCj}">NCLEX steps</button></div>` : ''}</div>
          ${ui.byCj && CJ ? '<p class="muted by-n">The six steps of the clinical judgment model the Next Generation NCLEX tests. Every decision you made is filed under one.</p>' : ''}
          ${(ui.byCj && CJ ? CJ.score(d.judg) : d.dom).map((x) => `<div class="meter"${x.what ? ` title="${esc(x.what)}"` : ''}><div class="l"><span>${x.label}</span><b>${x.score === null ? 'Not tested' : x.score}</b></div><div class="bar" aria-hidden="true"><i style="width:${x.score || 0}%"></i></div><small class="muted">${x.good} strong, ${x.bad} missed</small></div>`).join('')}
          <p class="muted" style="font-size:.85rem">Nova hints used: ${(C().novaCredits || 3) - s.nova} of ${C().novaCredits || 3}.</p>
          <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:1rem">${next && d.overall >= 58 ? `<button class="btn btn-primary btn-go" data-act="next-case" data-id="${nextId}">Next: ${esc(next.title)} (${esc(next.level)}) <span aria-hidden="true">→</span></button><button class="btn" data-act="new">Play this shift again</button>` : `<button class="btn btn-primary btn-go" data-act="new">Play the shift again <span aria-hidden="true">→</span></button>${next ? `<button class="btn" data-act="next-case" data-id="${nextId}">Try ${esc(next.title)} (${esc(next.level)})</button>` : ''}`}<button class="btn btn-quiet" data-act="home">Home</button></div>
        </section>
        <section aria-labelledby="mh"><h2 id="mh">Moments that mattered</h2>
          <div class="filter" role="group" aria-label="Filter moments">${[['all', 'All'], ['good', 'What went well'], ['bad', 'What to rethink']].map(([k, l]) => `<button class="btn ${ui.filter === k ? 'btn-primary' : ''}" data-act="filter" data-k="${k}" aria-pressed="${ui.filter === k}">${l}</button>`).join('')}</div>
          <ul class="moments">${items.map((j) => `<li class="${j.delta > 0 ? 'good' : j.delta < 0 ? 'bad' : 'neutral'}"><span class="tm">${E.clock(j.t)}${j.pid ? '<br>' + j.pid : ''}</span><div><span class="mk">${j.delta > 0 ? 'Strong' : j.delta < 0 ? 'Rethink' : 'Note'}${CJ ? `<span class="cj-tag"> · ${esc(CJ.STEPS.find((x) => x[0] === CJ.step(j))[1])}</span>` : ''}</span><b>${esc(j.text)}</b><p>${esc(j.why)}</p><button class="rpt-btn" data-act="rpt" data-k="${esc(j.key || '')}" data-t="${j.t}" aria-label="Report a problem with this feedback">Report a problem</button></div></li>`).join('') || '<li><span></span><span class="muted">Nothing here.</span></li>'}</ul>
        </section>
      </div>${fbCard()}</div></main>`;
  }

  /* ------------ beta feedback ------------ */
  const PAY = [['yes', 'Yes'], ['maybe', 'Maybe'], ['no', 'No']];
  function fbCard() {
    const f = ui.fb || (ui.fb = {});
    if (f.sent) return `<section class="fbk sent" aria-live="polite"><h2>Thanks. That goes straight to the person building this.</h2><p class="muted">${f.sent === 'email' ? 'Your email app should have opened with it filled in. Hit send there.' : 'Every report gets read, and clinical problems get fixed first.'}</p></section>`;
    return `<section class="fbk" aria-labelledby="fbh"><h2 id="fbh">Help shape the beta</h2><p class="muted">Two questions. Clinical problems get fixed first.</p>
      <label class="fb-l" for="fb-note">Anything clinically off, confusing, or too easy?</label>
      <textarea id="fb-note" class="fb-t" data-bind="note" rows="3" maxlength="2000" placeholder="Room, moment, what you'd expect instead">${esc(f.note || '')}</textarea>
      <div class="fb-row"><span class="fb-l" id="fb-pay-l">Would you pay for more shifts like this?</span><div class="seg" role="group" aria-labelledby="fb-pay-l">${PAY.map(([v, l]) => `<button data-act="fb-pay" data-v="${v}" aria-pressed="${f.pay === v}">${l}</button>`).join('')}</div></div>
      <div class="fb-f"><button class="btn btn-primary" data-act="fb-send" ${f.note || f.pay ? '' : 'aria-disabled="true" data-why="Answer one of the two first."'}>Send feedback</button></div></section>`;
  }
  const RPT = [['clinical', 'Clinically wrong'], ['unclear', 'Confusing'], ['scoring', 'Unfair scoring'], ['bug', 'Something broke'], ['other', 'Other']];
  function ovReport() {
    const r = ui.rp || {}, j = r.j;
    if (r.sent) return sheet('Report sent', `<p>${r.sent === 'email' ? 'Your email app should have opened with the report filled in. Hit send there.' : 'Thank you. Clinical reports get looked at first.'}</p>`, `<button class="btn btn-primary" data-act="close">Done</button>`, { label: 'Report sent' });
    return sheet(j ? 'Report a problem with this' : 'Send feedback', `${j ? `<blockquote class="rp-q"><b>${esc(j.text)}</b><span>${esc(j.why)}</span></blockquote>` : '<p class="muted" style="margin-top:0">Something wrong, confusing, or missing? Tell me what you saw.</p>'}
      <div class="rp-why" role="group" aria-label="What kind of problem">${RPT.map(([v, l]) => `<button class="btn ${r.why === v ? 'btn-primary' : ''}" data-act="rpt-why" data-v="${v}" aria-pressed="${r.why === v}">${l}</button>`).join('')}</div>
      <label class="fb-l" for="rp-note">What would you expect instead?</label>
      <textarea id="rp-note" class="fb-t" data-bind="rp.note" rows="4" maxlength="2000" placeholder="Optional, but the more specific the better">${esc(r.note || '')}</textarea>`,
      `<button class="btn" data-act="close">Cancel</button><button class="btn btn-primary" data-act="rpt-send" ${r.why || r.note ? '' : 'aria-disabled="true" data-why="Pick what kind of problem, or describe it."'}>Send</button>`, { label: j ? 'Report a problem' : 'Send feedback' });
  }
  const standalone = () => !!((window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone);
  const iosInstallable = () => /iPhone|iPad|iPod/.test(navigator.userAgent) && /^https:/.test(location.protocol) && !standalone();
  /* Who checked the clinical content of each shift, and against which version. */
  function ovReviewInfo() {
    const web = /^https?:$/.test(location.protocol);
    const rows = CASES.map((id) => { const k = E.getCase(id), st = RV.status(id), r = st.r;
      return `<div class="rv-row"><div class="rv-h"><b>${esc(k.title)}</b><span class="chip ${st.state === 'reviewed' ? 'ok' : st.state === 'changed' ? 'alert' : 'warn'}">${esc(st.label)}</span></div>
        ${r.reviewers.length ? `<p>${r.reviewers.map((x) => `${esc(x.name)}, ${esc(x.credentials)}${x.role ? ` (${esc(x.role)})` : ''}${x.date ? `, ${esc(x.date)}` : ''}`).join('; ')}</p>` : ''}
        ${r.references.length ? `<ul class="rv-refs">${r.references.map((x) => `<li>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.text)}</a>` : esc(x.text)}</li>`).join('')}</ul>` : ''}
        ${web ? `<a class="rv-go" href="/review/${id}/" target="_blank" rel="noopener">${st.state === 'reviewed' ? 'See what was reviewed' : 'Review this shift'}</a>` : ''}</div>`; }).join('');
    return sheet('Clinical review', `<p style="margin-top:0">Every shift is written by a working psych RN. Before a shift is marked reviewed, a licensed clinician checks every patient, order and scored decision in it, and signs off on that exact version. If the content changes later, it says so here until it's checked again.</p>
      ${web ? '<p class="muted">Are you a nurse, educator or pharmacist? You can review a shift: it takes about an hour, and reviewers are credited here.</p>' : ''}${rows}`,
      `<button class="btn btn-primary" data-act="close">Done</button>`, { label: 'Clinical review', wide: true });
  }
  function ovAccount() {
    const st = CL.status() || {}, a = ui.acct || (ui.acct = {});
    if (st.state === 'in') {
      const ago = st.at ? Math.round((Date.now() - st.at) / 60000) : null;
      return sheet('Your account', `<p style="margin-top:0">Signed in as <b>${esc(st.email || '')}</b>. Your progress saves to your account and follows you to any device where you sign in.</p>
        <p class="muted">${st.busy ? 'Syncing…' : st.err ? `Last sync didn't go through: ${esc(st.err)}. It will try again.` : ago === null ? 'Not synced yet.' : ago < 1 ? 'Synced just now.' : `Synced ${ago} minute${ago === 1 ? '' : 's'} ago.`}</p>`,
        `<button class="btn" data-act="acct-out">Sign out</button><button class="btn btn-primary" data-act="acct-sync">Sync now</button>`, { label: 'Your account' });
    }
    if (a.sent) return sheet('Check your email', `<p style="margin-top:0">We sent a sign-in link to <b>${esc(a.sent)}</b>. Open it on this device and you'll come back here signed in, with your progress saved.</p><p class="muted">No email in a few minutes? Check spam, or send it again.</p>`,
      `<button class="btn" data-act="acct-again">Use a different email</button><button class="btn btn-primary" data-act="close">Done</button>`, { label: 'Check your email' });
    return sheet('Save your progress', `<p style="margin-top:0">Sign in with your email to keep your shifts, stars and badges safe, and pick up on another device. No password: we email you a link.</p>
      ${st.err ? `<p class="acct-err">${esc(st.err)}</p>` : ''}
      <label class="fb-l" for="acct-email">Email</label>
      <input id="acct-email" class="fb-t acct-in" type="email" autocomplete="email" inputmode="email" data-bind="acct.email" value="${esc(a.email || '')}" placeholder="you@example.com">
      ${a.err ? `<p class="acct-err" role="alert">${esc(a.err)}</p>` : ''}
      <p class="muted" style="font-size:.85rem">Your email is used only to sign you in. <a href="/privacy/" target="_blank" rel="noopener">Privacy</a></p>`,
      `<button class="btn" data-act="close">Not now</button><button class="btn btn-primary" data-act="acct-send" ${a.busy ? 'aria-disabled="true" data-why="Sending…"' : ''}>${a.busy ? 'Sending…' : 'Email me a link'}</button>`, { label: 'Save your progress' });
  }
  /* After a cloud sync, pick up the merged progress (and a newer shift from another device, if this one has none open). */
  function fromCloud() {
    prof = E.store.profile(); applySettings();
    if (!s || s.ended) { const g = E.store.load(); if (g && !g.ended && E.getCase(g.caseId)) { s = g; caseId = g.caseId; E.useCase(caseId); } }
    if (ui.view === 'home' || ui.ov === 'account') render();
  }
  function fbWhere() { return s ? { case: s.caseId, game_min: Math.round(s.t), view: ui.view } : { case: caseId, view: ui.view }; }

  /* ------------ first-run: seen flags ------------ */
  function seen(k) { return !!(prof.seen && prof.seen[k]); }
  function markSeen(k) { prof.seen = prof.seen || {}; prof.seen[k] = 1; E.store.saveProfile(prof); }

  /* Cold open: a few beats that set the stakes before report. Tap to hurry it; it plays once per shift. */
  function ovIntro() {
    const c = C(), I = c.intro;
    return `<div class="intro ${ui.introAll ? 'all' : ''}" data-act="intro-tap" role="dialog" aria-modal="true" aria-label="${esc(c.title)}">
      <button class="intro-skip" data-act="intro-go">Skip</button>
      <svg class="intro-ecg" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70 H420 l18 -6 12 6 h30 l10 -48 14 86 12 -52 10 14 h60 l22 -10 18 10 H1200"/></svg>
      <div class="intro-body">
        <p class="intro-time">${esc(I.time)}</p>
        <p class="intro-place">${esc(I.place)}</p>
        ${I.beats.map((b, i) => `<p class="intro-beat" style="--d:${1.1 + i * 1.5}s">${esc(b)}</p>`).join('')}
        <button class="btn btn-primary btn-go intro-cta" data-act="intro-go" style="--d:${1.1 + I.beats.length * 1.5}s">${esc(I.cta || 'Take report')} <span aria-hidden="true">→</span></button>
      </div></div>`;
  }

  /* Coach tips: shown once, anchored to the thing they describe. */
  const COACH = {
    station: [
      { sel: () => `.door[data-pid="${(s.answers.rank || [])[0]}"]`, alt: '.door[data-act="goto"]', text: 'You picked this room first. Tap the door, or a name below, to walk in. The clock only moves when you act.' },
      { sel: '.phone', text: () => `Your unit phone. ${cna().name}, the lab, pharmacy and the doctors reach you here. Some messages need an answer.` },
      { sel: '.skip', text: 'Caught up? Skip ahead. The clock runs until something needs you, then stops. Care XP, your streak and four shift goals sit up top.' },
    ],
    room: [
      { sel: '.pt', text: 'Tap your patient to hear from them. Tap anything in the room to look closer. Looking is free.' },
      { sel: '.dock-tabs', text: 'Assess, treat, give meds, talk and call. Every action shows what it costs in minutes.' },
      { sel: '[data-act="nova"]', text: 'Stuck? Nova, your charge nurse, gives three nudges a shift. She points; she won\'t answer for you.' },
    ],
  };
  function coachFor() {
    if (!s || s.ended || ui.ov || (ui.intro !== null && ui.intro !== undefined)) return null;
    const key = ui.view === 'station' ? 'station' : ui.view === 'room' ? 'room' : null;
    if (!key || seen('coach:' + key)) return null;
    ui.coachStep = ui.coachStep || {}; const i = ui.coachStep[key] || 0; const step = COACH[key][i];
    return step ? { key, i, step, n: COACH[key].length } : null;
  }
  function coachPlace() {
    const c = coachFor(), id = c ? c.key + ':' + c.i : '';
    let card = document.querySelector('.coach'), ring = document.querySelector('.coach-ring');
    if (!c) { if (card) card.remove(); if (ring) ring.remove(); return; }
    const a = document.querySelector(typeof c.step.sel === 'function' ? c.step.sel() : c.step.sel) || (c.step.alt && document.querySelector(c.step.alt)); if (!a) return;
    let r = a.getBoundingClientRect(); if (!r.width) return;
    if (!card || card.dataset.id !== id) {
      if (card) card.remove(); if (ring) ring.remove();
      if (r.top < 60 || r.bottom > innerHeight - 40) { a.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); }
      ring = document.createElement('div'); ring.className = 'coach-ring';
      card = document.createElement('div'); card.className = 'coach'; card.dataset.id = id; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Tip');
      card.innerHTML = `<p>${esc(typeof c.step.text === 'function' ? c.step.text() : c.step.text)}</p><div class="coach-f"><span class="dots">${Array.from({ length: c.n }, (_, k) => `<i class="${k === c.i ? 'on' : ''}"></i>`).join('')}</span><button class="btn btn-quiet" data-act="coach-skip">Skip tips</button><button class="btn btn-primary" data-act="coach-next">${c.i === c.n - 1 ? 'Got it' : 'Next'}</button></div>`;
      document.body.append(ring, card);
    }
    r = a.getBoundingClientRect();
    Object.assign(ring.style, { left: r.left - 6 + 'px', top: r.top - 6 + 'px', width: r.width + 12 + 'px', height: r.height + 12 + 'px' });
    const w = card.offsetWidth, h = card.offsetHeight, below = r.bottom + h + 20 < innerHeight;
    card.style.left = Math.max(10, Math.min(innerWidth - w - 10, r.left + r.width / 2 - w / 2)) + 'px';
    card.style.top = (below ? r.bottom + 14 : Math.max(10, r.top - h - 14)) + 'px';
  }
  addEventListener('resize', () => coachPlace()); addEventListener('scroll', () => { if (document.querySelector('.coach')) coachPlace(); }, { passive: true });

  /* Debrief pays off: score counts up, meters fill, outcomes land one by one. */
  function debriefAnim(root) {
    if (ui.view !== 'debrief' || ui.debDone) return; ui.debDone = true;
    const n = root.querySelector('.deb-score .num'); if (!n) return;
    const to = +n.dataset.to, t0 = performance.now(), dur = reduced() ? 1 : 1100;
    root.querySelectorAll('.meter .bar i').forEach((b) => { const w = b.style.width; b.style.width = '0'; requestAnimationFrame(() => requestAnimationFrame(() => { b.style.width = w; })); });
    const tick = (now) => { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3); n.textContent = Math.round(to * e); if (p < 1) requestAnimationFrame(tick); else FX.play(to >= 72 ? 'right' : 'commit'); };
    const r = s && s.reward; if (r && !reduced()) { for (let i = 0; i < r.stars; i++) setTimeout(() => FX.play('star'), 1300 + i * 380); if (r.lvAfter.n > r.lvBefore.n) setTimeout(() => FX.play('levelup'), 2900); else if (r.earned.length) setTimeout(() => FX.play('right'), 2900); }
    requestAnimationFrame(tick);
  }

  /* ------------ overlays ------------ */
  function sheet(title, body, foot, opts) {
    opts = opts || {};
    return `<div class="scrim" data-act="${opts.noScrimClose ? '' : 'close'}" data-scrim="1"><div class="sheet ${opts.wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(opts.label || title)}">
      <div class="sheet-h">${opts.face || ''}<h2>${title}</h2>${opts.noClose ? '' : `<button class="icon-btn" data-act="close" aria-label="Close">${ICON.close}</button>`}</div>
      <div class="sheet-b">${body}</div>${foot ? `<div class="sheet-f">${foot}</div>` : ''}</div></div>`;
  }

  function ovChart() {
    const pid = ui.chart.pid, tab = ui.chart.tab, d = def(pid), P = s.p[pid];
    const tabs = [['overview', 'Overview'], ['vitals', 'Vitals'], ['labs', 'Labs'], ['orders', 'Orders'], ['mar', 'MAR'], ['notes', 'Notes'], ['io', 'Intake/output']];
    let b = '';
    if (tab === 'overview') b = `<dl class="kv"><dt>Patient</dt><dd>${esc(d.name)}, ${ageSex(d)}. ${esc(d.bio)}</dd><dt>Admitted for</dt><dd>${esc(d.reason)}</dd><dt>Problem</dt><dd>${esc(d.dx)}</dd><dt>History</dt><dd>${d.hx.map(esc).join('<br>')}</dd><dt>Allergies</dt><dd><b style="color:var(--red)">${esc(d.allergies)}</b></dd><dt>Code status</dt><dd>${esc(d.code)}</dd><dt>Weight</dt><dd>${esc(d.weight)}</dd><dt>Lines and devices</dt><dd>${d.lines.map(esc).join('<br>')}</dd><dt>Mobility</dt><dd>${esc(d.mobility)}</dd><dt>Diet</dt><dd>${esc(d.diet)}</dd></dl>`;
    if (tab === 'vitals') {
      const ab = (k, v) => abn(d, k, v);
      b = `<div class="tbl-wrap"><table><caption class="sr">Vital sign flowsheet</caption><thead><tr><th>Time</th><th>Temp °C</th><th>HR</th><th>BP</th><th>RR</th><th>SpO₂</th><th>O₂</th><th>Pain</th><th>By</th></tr></thead><tbody>
        ${P.vit.slice().reverse().map((v) => `<tr><td>${E.clock(v.t)}</td><td class="${ab('T', v.T) ? 'ab' : ''}">${fT(v.T)}${ab('T', v.T) ? ' ▲' : ''}</td><td class="${ab('HR', v.HR) ? 'ab' : ''}">${v.HR}${ab('HR', v.HR) ? (v.HR < norm(d, 'HR')[0] ? ' ▼' : ' ▲') : ''}</td><td class="${ab('SBP', v.SBP) ? 'ab' : ''}">${v.SBP}/${v.DBP}${ab('SBP', v.SBP) ? ' ▼' : ''}</td><td class="${ab('RR', v.RR) ? 'ab' : ''}">${v.RR}</td><td class="${ab('SpO2', v.SpO2) ? 'ab' : ''}">${v.SpO2}%</td><td>${esc(v.O2)}</td><td>${v.pain}</td><td>${esc(v.by)}</td></tr>`).join('')}</tbody></table></div>
        ${P.bgs ? `<h3 style="margin:1.2rem 0 .5rem">Point-of-care glucose</h3>${P.bgs.length ? `<div class="tbl-wrap"><table><thead><tr><th>Time</th><th>mg/dL</th><th>By</th></tr></thead><tbody>${P.bgs.slice().reverse().map((g) => `<tr><td>${E.clock(g.t)}</td><td class="${g.val < 70 ? 'ab' : ''}">${g.val}${g.val < 70 ? ' ▼' : ''}</td><td>${esc(g.by)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No glucose checked this shift.</p>'}` : ''}
        <p class="muted" style="font-size:.85rem">▲ ▼ mark values outside the normal range. Trends only exist if someone keeps measuring.</p>`;
    }
    if (tab === 'labs') {
      P.k.labsSeen = s.t; if (pid === '418') P.kSeen = true;
      b = `<div class="tbl-wrap"><table><thead><tr><th>Resulted</th><th>Test</th><th>Result</th><th>Flag</th><th>Reference</th></tr></thead><tbody>${P.labs.slice().sort((a, b2) => b2.t - a.t).map((l) => `<tr><td>${l.t < -1000 ? 'Prior' : E.clock(l.t)}</td><td>${esc(l.name)}</td><td class="${l.flag ? 'ab' : ''} wrap">${esc(fLab(l))} ${esc(l.unit)}</td><td class="flag">${l.flag === 'H' ? 'High' : l.flag === 'L' ? 'Low' : l.flag === 'A' ? 'Abnormal' : ''}</td><td class="wrap">${esc(l.ref)}</td></tr>`).join('')}</tbody></table></div>`;
    }
    if (tab === 'orders') b = `<ul class="list">${P.orders.slice().reverse().map((o) => `<li>${esc(o.text)}${o.isNew ? '<span class="new-tag">New ' + E.clock(o.t) + '</span>' : ''}</li>`).join('')}</ul>`;
    if (tab === 'mar') b = `<p class="muted" style="margin-top:0">${s.loc === pid && ui.view === 'room' ? 'You are at the bedside. Select a medication to review it.' : 'Medications are given at the bedside. Go to the room to give or hold.'}</p><div class="tbl-wrap"><table><thead><tr><th>Medication</th><th>Route</th><th>Frequency</th><th>Status</th><th></th></tr></thead><tbody>${d.meds.filter((m) => !m.available || m.available(s, P)).map((m) => { const st = medStatus(m); const inRoom = s.loc === pid && ui.view === 'room' && !m.later && m.initStatus !== 'given'; return `<tr><td class="wrap"><b>${esc(m.name)}</b> ${esc(m.dose)}${m.param ? `<br><small class="muted">${esc(m.param)}</small>` : ''}${m.indication ? `<br><small class="muted">${esc(m.indication)}</small>` : ''}</td><td>${m.route}</td><td class="wrap">${esc(m.freq)}</td><td><b class="${st.cls === 'late' ? 'ab' : ''}">${st.text}</b></td><td>${inRoom ? `<button class="btn" data-act="med" data-id="${m.id}">Review</button>` : ''}</td></tr>`; }).join('')}</tbody></table></div>`;
    if (tab === 'notes') b = `<ul class="list">${P.notes.slice().reverse().map((n) => `<li><div class="src">${esc(n.author)}, ${n.t < -600 ? 'yesterday' : E.clock(n.t)}</div><div class="voice">${esc(n.text)}</div></li>`).join('')}</ul>`;
    if (tab === 'io') b = `<dl class="kv"><dt>Intake</dt><dd>${esc(d.io.intake)}</dd><dt>Output</dt><dd>${esc(d.io.output)}</dd><dt>Diet</dt><dd>${esc(d.diet)}</dd></dl><p class="muted" style="font-size:.85rem">Last 24 hours, charted by night shift. Assess GI/GU at the bedside for current status.</p>`;
    return `<div class="scrim" data-act="close" data-scrim="1" style="padding:0;justify-content:flex-end"></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="Chart for ${esc(d.name)}">
      <div class="chart-h"><div class="who"><b>${esc(d.name)}</b> <span class="muted">${ageSex(d)}, room ${d.room}, ${esc(d.code)}</span></div>
      <div class="seg" role="group" aria-label="Switch patient">${pts().map((p) => `<button data-act="chart" data-pid="${p.id}" data-tab="${tab}" aria-pressed="${p.id === pid}">${p.room}</button>`).join('')}</div>
      <button class="btn" data-act="close">${ICON.close}Close chart</button></div>
      <div class="chart-tabs" role="tablist">${tabs.map(([id, l]) => `<button role="tab" data-act="chart" data-pid="${pid}" data-tab="${id}" aria-selected="${tab === id}">${l}</button>`).join('')}</div>
      <div class="chart-b">${b}</div></aside>`;
  }

  const PREP = { vitals: ['Take vital signs', 4], apical: ['Count apical pulse and BP', 2], pain: ['Assess pain and sedation', 2], bg: ['Check glucose', 3], intake: ['Check breakfast tray', 1], ciwa: ['Score CIWA-Ar', 4], strip: ['Look at the monitor strip', 1] };
  function ovMed() {
    const d = def(s.loc), P = s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id), st = s.meds[m.id], Ax = A();
    const checks = m.checks ? m.checks(s, P, Ax) : [];
    const block = m.block ? m.block(s, P, Ax) : null;
    const done = !m.prn && (st.status === 'given' || st.status === 'held');
    const verify = st.status === 'verify';
    const refuse = !done && !block && !verify && m.refuse ? m.refuse(s, P, Ax) : null;
    let body = `<div class="order"><b>${esc(m.name)} ${esc(m.dose)} ${m.route}</b>, ${esc(m.freq)}${m.indication ? `<br><span class="muted">${esc(m.indication)}</span>` : ''}${m.param ? `<br><b>${esc(m.param)}</b>` : ''}</div>
      <p class="muted" style="margin:.2rem 0">Allergies: ${esc(d.allergies)}</p>
      <ul class="checks">${checks.map((c) => `<li><span class="g ${c.ok === true ? 'ok' : c.ok === false ? 'bad' : 'na'}" aria-hidden="true">${c.ok === true ? '✓' : c.ok === false ? '!' : '•'}</span><span>${esc(c.label)}<small>${esc(c.value)}</small></span></li>`).join('')}</ul>`;
    if (m.prep && m.prep.length && !done) body += `<p class="muted" style="margin:.6rem 0 0;font-size:.88rem">Get what you need before deciding:</p><div class="prep">${m.prep.map((p) => `<button class="btn" data-act="prep" data-p="${p}">${PREP[p][0]} <span class="muted">${PREP[p][1]} min</span></button>`).join('')}</div>`;
    if (ui.med.note) body += `<div class="warnbox" role="status">${esc(ui.med.note)}</div>`;
    if (block) body += `<div class="warnbox">${esc(block)}</div>`;
    if (refuse) body += `<div class="warnbox">${esc(refuse)}</div>${m.prn ? '' : '<p class="muted" style="margin:.4rem 0 0;font-size:.88rem">You can come back and offer it again, or hold it and document the refusal.</p>'}`;
    if (verify) body += `<div class="warnbox">Pharmacy has not verified this order. It can't be dispensed yet.</div>`;
    if (done) body += `<div class="warnbox">${st.status === 'given' ? 'Given' : 'Held'} at ${E.clock(st.at)}.${st.note ? ' ' + esc(st.note) : ''}</div>`;
    if (m.doses && !block && !verify && !refuse) body += `<fieldset style="border:0;padding:0;margin:.6rem 0"><legend style="font-weight:600;margin-bottom:.2rem">Dose</legend>${m.doses.map((x) => `<label class="opt"><input type="radio" name="dose" value="${x.id}" ${ui.med.dose == x.id ? 'checked' : ''} data-act="dose" data-v="${x.id}"><span>${esc(x.label)}</span></label>`).join('')}</fieldset>`;
    if (ui.med.holding) body += `<fieldset style="border:0;padding:0;margin:.6rem 0"><legend style="font-weight:600;margin-bottom:.2rem">Reason for holding</legend>${['Outside the hold parameter', 'Condition changed, clarify with provider', 'Not enough intake', 'Patient declined'].map((r, i) => `<label class="opt"><input type="radio" name="hr" data-act="hreason" data-v="${i}" ${ui.med.reason == i ? 'checked' : ''}><span>${r}</span></label>`).join('')}</fieldset>`;
    let foot = '';
    if (!done && !block && !verify) {
      if (ui.med.holding) foot += `<button class="btn btn-primary" data-act="med-hold" ${ui.med.reason == null ? 'disabled data-why="Choose a reason for holding first."' : ''}>Hold this dose</button>`;
      else {
        if (!m.prn) foot += `<button class="btn" data-act="med-holdask">Hold</button>`;
        if (refuse) foot += `<button class="btn btn-primary" data-act="med-declined">Offer again later <span style="font-weight:400;opacity:.8">2 min</span></button>`;
        else foot += `<button class="btn btn-primary holdbtn" data-act="med-give" data-hold="1" ${m.doses && ui.med.dose == null ? 'disabled data-why="Choose a dose first."' : ''}><i class="hold-fill" aria-hidden="true"></i><span class="hold-l">Hold to give${m.doses && ui.med.dose ? ' ' + ui.med.dose + ' mg' : ''}</span> <span style="font-weight:400;opacity:.8">5 min</span></button>`;
      }
    }
    return sheet(esc(m.name), body, foot, { label: 'Medication ' + m.name });
  }

  function ovSbar() {
    const pid = ui.sbar.pid;
    if (!pid) {
      const body = `<p>Which patient are you calling about?</p>${pts().filter((p) => !gone(s.p[p.id])).map((p) => `<button class="choice" data-act="sbar" data-pid="${p.id}"><b>${p.room} ${esc(p.name)}</b><br><span class="muted">${esc(p.dx)}</span></button>`).join('')}`;
      return sheet(`Call ${esc(prov().name)}`, body, '', { face: face(C().provider) });
    }
    const d = def(pid), P = s.p[pid], Ax = A();
    if (ui.sbar.reply) return sheet(esc(prov().name), `<div class="reply">${face(C().provider)}<p class="voice" style="margin:0">"${esc(ui.sbar.reply)}"</p></div>${reviewHTML(ui.sbar.review, 'Your call, reviewed')}`, `<button class="btn btn-primary" data-act="close">Done</button>`, { face: '' });
    const items = d.sbar.items(s, P, Ax);
    const reqs0 = d.sbar.requests || [{ id: 'orders', label: 'Here\'s what I\'m seeing. What would you like me to do?' }, { id: 'fyi', label: 'Just keeping you updated.' }];
    const body = `<div class="sbar-sec"><h3><i>S</i>Situation</h3><p class="muted" style="margin:.3rem 0">This is your nurse on ${unitS()}, calling about ${esc(d.name)}, ${d.age}, in room ${d.room}.</p></div>
      <div class="sbar-sec"><h3><i>B</i>Background</h3><p class="muted" style="margin:.3rem 0">${esc(d.dx)}. ${esc(d.hx[0])}. ${esc(d.code)}.</p></div>
      <fieldset class="sbar-sec" style="border:0;padding:0"><legend><h3><i>A</i>Assessment: what will you report?</h3></legend>
        ${items.map((it) => `<label class="opt ${it.need ? '' : 'locked'}"><input type="checkbox" data-act="sbar-pick" data-id="${it.id}" ${ui.sbar.picked.includes(it.id) ? 'checked' : ''} ${it.need ? '' : `disabled data-why="${esc(it.lock || 'Not known yet')}."`}><span>${it.need ? esc(it.label) : `<span class="lock-l">Not assessed yet</span><small>${esc(it.lock || 'Not known yet')}</small>`}</span></label>`).join('')}</fieldset>
      <fieldset class="sbar-sec" style="border:0;padding:0"><legend><h3><i>R</i>Recommendation</h3></legend>
        ${(() => { const seed = [...pid].reduce((n, ch) => n + ch.charCodeAt(0), 0); return reqs0.map((r, i) => [r, (i * 7 + seed) % 11]).sort((a, b) => a[1] - b[1]).map((x) => x[0]); })().map((r) => `<label class="opt"><input type="radio" name="req" data-act="sbar-req" data-id="${r.id}" ${ui.sbar.req === r.id ? 'checked' : ''}><span>${esc(r.label)}</span></label>`).join('')}</fieldset>`;
    return sheet(`SBAR: ${esc(d.short)}`, body, `<button class="btn btn-primary" data-act="sbar-send" ${ui.sbar.req && ui.sbar.picked.length ? '' : `disabled data-why="${ui.sbar.picked.length ? 'Choose a recommendation first.' : 'Pick at least one finding to report.'}"`}>Call ${esc(prov().name)} <span style="font-weight:400;opacity:.8">6 min</span></button>`, { face: face(C().provider), wide: true });
  }

  function ovDeleg() {
    const tasks = C().delegation.tasks.filter((t) => !t.avail || t.avail(s));
    const active = s.deleg.filter((x) => !x.done);
    const note = C().delegation.note ? C().delegation.note(s) : '';
    const body = `${note ? `<p class="deleg-note">${esc(note)}</p>` : ''}${!tasks.length ? '<p class="empty" style="padding:0">Nothing to hand off right now.</p>' : ''}${ui.delegMsg ? `<div class="reply" style="margin-bottom:1rem">${face(C().cna)}<p class="voice" style="margin:0">${esc(ui.delegMsg)}</p></div>${reviewHTML(ui.delegReview, 'Delegation, reviewed')}` : ''}
      ${(() => { const fin = s.deleg.filter((x) => x.done).slice(-4).reverse(); const lab = (x) => C().delegation.tasks.find((t) => t.id === x.id).label; if (!active.length && !fin.length) return ''; return `<div class="dl-board">${active.length ? `<h4>${esc(cna().name)} is working on</h4><ul>${active.map((x) => `<li class="dl-row ${ui.delegNew === x.id + ':' + x.pid + ':' + x.at ? 'sent' : ''}"><span class="dl-l"><b>${esc(lab(x))}</b><small>${x.pid} ${esc(def(x.pid).short)} · back about ${E.clock(x.due)}</small></span><span class="dl-bar" aria-hidden="true"><i style="width:${Math.min(100, Math.max(6, (s.t - x.at) / Math.max(1, x.due - x.at) * 100)).toFixed(0)}%"></i></span></li>`).join('')}</ul>` : ''}${fin.length ? `<h4>Finished</h4><ul>${fin.map((x) => `<li class="dl-row fin"><span class="gcheck" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5"/><path d="M7 12.5l3.2 3.2L17.2 8.6"/></svg></span><span class="dl-l"><s>${esc(lab(x))}</s><small>${x.pid} ${esc(def(x.pid).short)} · done ${E.clock(x.due)}</small></span></li>`).join('')}</ul>` : ''}</div>`; })()}
      ${tasks.map((t) => `<div style="padding:.6rem 0;border-bottom:1px solid var(--line)"><div style="font-weight:600;margin-bottom:.35rem">${esc(t.label)}</div><div class="prep">${t.rooms.filter((r) => here(def(r)) && !gone(s.p[r])).map((r) => `<button class="btn" data-act="deleg" data-t="${t.id}" data-pid="${r}">${r} ${esc(def(r).short)}</button>`).join('')}</div></div>`).join('')}`;
    return sheet(`Ask ${esc(cna().name)}`, body, `<button class="btn btn-primary" data-act="close">Done</button>`, { face: face(C().cna), label: `Delegate to ${cna().name}, ${cna().role}` });
  }

  function ovNova() {
    const body = `<div class="nova-card">${face('nova')}<div>
      ${ui.nova ? `<p class="dlg-text">"${esc(ui.nova)}"</p>` : `<p class="dlg-text">"You've got ${s.nova} question${s.nova === 1 ? '' : 's'} left on me today. I won't hand you answers, but I'll point you somewhere useful."</p>`}
      ${s.novaLog.length > (ui.nova ? 1 : 0) ? `<details><summary class="muted">Earlier from Nova</summary>${s.novaLog.slice(0, ui.nova ? -1 : undefined).map((n) => `<p class="voice muted">${E.clock(n.t)}: ${esc(n.text)}</p>`).join('')}</details>` : ''}
    </div></div>`;
    const foot = `<button class="btn" data-act="close">Close</button>${!ui.nova && s.nova > 0 ? `<button class="btn btn-primary" data-act="nova-ask">Ask for a nudge (1 of ${s.nova})</button>` : ''}`;
    return sheet('Nova Reyes, charge nurse', body, foot, { label: 'Ask Nova' });
  }

  const trustDots = (t) => `<span class="st-tr" role="img" aria-label="Trust ${t} of ${STY.MAXR}: ${STY.TRUST[t]}">${Array.from({ length: STY.MAXR }, (_, i) => `<i class="${i < t ? 'on' : ''}"></i>`).join('')}<small>${STY.TRUST[t]}</small></span>`;
  /* Choices show in a stable shuffled order per shift, so the best answer isn't always on top. */
  function mixOrder(n, key) {
    let h = 2166136261 ^ (s.seed || 0); for (const ch of String(key)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    const o = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { h ^= h >>> 13; h = Math.imul(h, 1540483477); const j = (h >>> 0) % (i + 1); [o[i], o[j]] = [o[j], o[i]]; }
    return o;
  }
  function ovDialog() {
    if (ui.dlg.id === '__review') return sheet('Your choice', reviewHTML(ui.dlgReview, 'Why it matters'), `<button class="btn btn-primary" data-act="close">Continue</button>`, { label: 'Decision review' });
    const node = C().dialogs[ui.dlg.id];
    const w = who(node.who);
    const text = typeof node.text === 'function' ? node.text(s) : node.text;
    const stHead = node.story && STY ? (() => { const P = s.p[node.story.pid], t = STY.trust(P), nm = /^\d+$/.test(node.who) ? def(node.story.pid).short : w.name.split(' ')[0]; return `<div class="st-head"><span class="st-k">Getting to know ${esc(nm)}</span>${trustDots(t)}</div>`; })() : '';
    const body = `${stHead}<p class="dlg-text">${esc(text)}</p>${!node.choices && ui.dlgReview ? reviewHTML(ui.dlgReview) : ''}${node.choices ? mixOrder(node.choices.length, ui.dlg.id).map((i) => `<button class="choice" data-act="dlg" data-i="${i}">${esc(node.choices[i].label)}</button>`).join('') : ''}`;
    return sheet(esc(w.name), body, node.choices ? '' : `<button class="btn btn-primary" data-act="close">Continue</button>`, { face: faceOf(node.who), noScrimClose: !!node.choices });
  }

  /* ------------ follow-up: patients who left the unit are still yours to close out ------------ */
  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
  function openAway(pid) { ui.away = { pid, mode: null, picked: [], reply: null, review: null }; ui.ov = 'away'; ui.chart = null; render(); }
  function ovAway() {
    const a = ui.away, d = def(a.pid), P = s.p[a.pid], o = P.out;
    if (!o) return sheet(esc(d.short), `<p>${esc(goneText(P))}.</p>`, `<button class="btn btn-primary" data-act="close">Close</button>`);
    const sp = o.spec, nu = staff(sp.nurse), Ax = A(), rows = F.awayRows(s, Ax, d, P), cur = sp.course[o.known];
    const tl = sp.course.slice(0, o.known + 1).map((e, i) => `<li class="${i === o.known ? 'now' : ''}"><span class="aw-tm">${E.clock(o.at + e.at)}</span><span class="pill af-${e.st}">${F.ST[e.st]}</span><p>${esc(e.text)}</p></li>`).join('');
    const hasNew = F.entryAt(P, s.t - o.at) > o.known;
    let body = `<div class="aw-top">${face(sp.nurse)}<div><span class="aw-k">Now in ${esc(F.where(sp.unit))} since ${E.clock(o.at)}</span><b>${esc(nu.name)}</b> <span class="muted">${esc(nu.role)}</span></div><span class="pill af-${cur.st}">${F.ST[cur.st]}</span></div>
      <p class="aw-ev"><b>What happened.</b> ${esc(sp.event)}</p>`;
    if (a.noteText) body += `<div class="aw-note"><span class="res-cl">Signed ${E.clock(o.note)}</span><p>${esc(a.noteText)}</p></div>`;
    if (a.reply) body += `<div class="reply">${face(a.replyFrom || sp.nurse)}<p class="voice" style="margin:0">${esc(a.reply)}</p></div>${reviewHTML(a.review, 'Your follow-up, reviewed')}`;
    if (a.mode === 'ho') {
      const items = F.handoffItems(s, Ax, d, P);
      body += `<fieldset class="sbar-sec" style="border:0;padding:0"><legend><h3>What goes in your report to ${esc(nu.name)}?</h3></legend><p class="muted" style="margin:.2rem 0 .5rem">Pick what ${esc(F.where(sp.unit))} needs. Skip what they don't.</p>${items.map((it) => `<label class="opt"><input type="checkbox" data-act="away-pick" data-id="${it.id}" ${a.picked.includes(it.id) ? 'checked' : ''}><span>${esc(it.label)}</span></label>`).join('')}</fieldset>`;
      return sheet(`Report to ${esc(F.where(sp.unit))}`, body, `<button class="btn" data-act="away-back">Back</button><button class="btn btn-primary" data-act="away-ho-send" ${a.picked.length ? '' : 'disabled data-why="Pick what you\'ll tell them first."'}>Call report <span style="font-weight:400;opacity:.8">4 min</span></button>`, { wide: true, label: 'Call report' });
    }
    if (a.mode === 'fam') {
      const f = sp.family;
      body += `<h3 style="margin:.6rem 0 .3rem">${f.phone ? 'Calling' : 'Finding'} ${esc(f.name)}, ${esc(d.short)}'s ${esc(f.rel)}</h3><p class="muted" style="margin:.2rem 0 .5rem">What do you say?</p>${F.famChoices(P).map((c) => `<button class="choice" data-act="away-fam-pick" data-id="${c.id}">${esc(c.label)}</button>`).join('')}`;
      return sheet(`Update ${esc(f.name)}`, body, `<button class="btn" data-act="away-back">Back</button>`, { wide: true, label: 'Update family' });
    }
    body += `<h3 class="aw-h3">What you've heard</h3><ol class="aw-tl">${tl}</ol>${hasNew ? `<p class="aw-new">${esc(cap(F.where(sp.unit)))} has news since your last update.</p>` : ''}`;
    const item = (act, label, sub, c, done, cls) => `<li><button class="fs-row ${cls || ''} ${done ? 'has' : ''}" data-act="${act}" data-id="${d.id}" ${done ? `disabled data-why="Done at ${E.clock(done)}."` : ''}><span class="fs-l"><b>${label}</b><small>${sub}</small></span><span class="fs-t">${done ? `${ICON.tick}${E.clock(done)}` : ''}</span><span class="fs-c">${c}</span></button></li>`;
    const late = (k) => (rows.find((r) => r.key === k) || {}).late ? 'urgent' : '';
    body += `<h3 class="aw-h3">Close the loop</h3><ul class="fs">
      ${sp.handoff ? item('away-ho', `Call report to ${esc(nu.name)}`, o.handoff !== null ? 'Report given' : `${esc(cap(F.where(sp.unit)))} is waiting on what you know`, '4 min', o.handoff, late('aw:ho')) : ''}
      ${sp.family ? item('away-fam', `Update ${esc(sp.family.name)} (${esc(sp.family.rel)})`, o.fam !== null ? 'Updated' : `${sp.family.phone ? 'By phone' : 'In the waiting room'}${sp.family.interp ? `, needs a ${esc(sp.family.interp)} interpreter` : ''}`, '4 min', o.fam, late('aw:fam')) : ''}
      ${sp.note ? item('away-note', sp.emergent ? 'Write the event note' : 'Write the transfer note', o.note !== null ? 'In the chart' : 'What you saw, what you did, who you told', '3 min', o.note, late('aw:note')) : ''}
      ${item('away-upd', `Call ${esc(F.where(sp.unit))} for an update`, hasNew ? 'There\'s news' : o.calls.length ? `Last called ${E.clock(o.calls[o.calls.length - 1])}` : 'How are they doing now?', '3 min', null, hasNew ? 'due' : '')}</ul>`;
    return sheet(`${d.room} ${esc(d.short)}: follow-up`, body, `<button class="btn" data-act="chart" data-pid="${d.id}">${ICON.chart}Chart</button><button class="btn btn-primary" data-act="close">Done</button>`, { wide: true, face: pface(d.id), label: `Follow up on ${d.short}` });
  }
  /* ------------ report to the oncoming nurse ------------ */
  function reportPending(d, P) { return brainRows(d, P).filter((r) => !r.done && !r.prog && r.t !== null && !/^(rp|rd:)/.test(r.key || '') && (r.late || r.t <= C().length + 60)); }
  function reportItems(d, P) { return F.reportItems(s, A(), d, P, reportPending(d, P), stName); }
  function openReport(pid) { const list = pts().filter((x) => !gone(s.p[x.id])); const first = pid || (prioList().find((id) => list.some((x) => x.id === id) && !(s.report && s.report[id])) || (list[0] || {}).id); ui.rep = { pid: first, picked: [], reply: null, review: null }; ui.ov = 'give'; ui.chart = null; render(); }
  function ovGive() {
    const r = ui.rep, on = oncoming(), list = prioList().map(def).filter((x) => !gone(s.p[x.id])), d = def(r.pid), P = s.p[r.pid], done = s.report && s.report[r.pid];
    const tabs = `<div class="seg rep-tabs" role="group" aria-label="Patient">${list.map((x) => `<button data-act="rep-go" data-pid="${x.id}" aria-pressed="${x.id === r.pid}">${s.report && s.report[x.id] ? '✓ ' : ''}${x.room}</button>`).join('')}</div>`;
    let body = `<p class="muted" style="margin-top:0">${esc(on.name)} is taking your patients. For each one, pick what ${esc(on.name)} needs to hear. Unfinished work is fine to hand off; unmentioned work isn't.</p>${tabs}
      <div class="rep-who">${pface(d.id)}<div><b>${d.room} ${esc(d.name)}</b> <small class="muted">${ageSex(d)}</small><br><span class="muted">${esc(d.dx)}</span></div></div>`;
    if (r.reply && r.replyPid === r.pid) body += `<div class="reply">${face(F.oncoming(C()))}<p class="voice" style="margin:0">${esc(r.reply)}</p></div>${reviewHTML(r.review, 'Your report, reviewed')}`;
    else if (done) body += `<div class="warnbox">Report given at ${E.clock(done.t)}.</div>`;
    else body += `<fieldset class="sbar-sec" style="border:0;padding:0"><legend class="sr">What goes in report</legend>${reportItems(d, P).map((it) => `<label class="opt"><input type="checkbox" data-act="rep-pick" data-id="${it.id}" ${r.picked.includes(it.id) ? 'checked' : ''}><span>${esc(it.label)}</span></label>`).join('')}</fieldset>`;
    const nextUp = list.find((x) => !(s.report && s.report[x.id]) && x.id !== r.pid);
    const foot = done ? `${nextUp ? `<button class="btn btn-primary" data-act="rep-go" data-pid="${nextUp.id}">Next: ${nextUp.room}</button>` : ''}<button class="btn ${nextUp ? '' : 'btn-primary'}" data-act="close">${nextUp ? 'Later' : 'Done'}</button>` : `<button class="btn" data-act="close">Later</button><button class="btn btn-primary" data-act="rep-send" ${r.picked.length ? '' : 'disabled data-why="Pick what you\'ll tell them first."'}>Give report on ${esc(d.short)} <span style="font-weight:400;opacity:.8">2 min</span></button>`;
    return sheet(`Report to ${esc(on.name)}`, body, foot, { wide: true, face: face(F.oncoming(C())), label: `Give report to ${on.name}` });
  }

  function ovReview() { return sheet('Your reply, reviewed', `<p class="muted" style="margin-top:0">${esc(ui.review.title)}</p>${reviewHTML(ui.review.list, 'Why it matters')}`, `<button class="btn btn-primary" data-act="close">Continue</button>`, { label: 'Decision review' }); }
  function ovCalls() {
    const list = s.judg.slice().reverse(), m = RW.mult(s.streak || 0);
    const good = s.judg.filter((j) => j.delta > 0).length, bad = s.judg.filter((j) => j.delta < 0).length;
    const top = `<div class="prog-top"><div class="pg-xp">${ICON.xp}<b>${fmtN(s.xp || 0)}</b><small>care XP this shift</small></div><div class="pg-st ${m > 1 ? 'hot' : ''}">${ICON.flame}<b>${s.streak || 0}</b><small>in a row${m > 1 ? ` · ×${m} XP` : ''} · best ${s.bestStreak || 0}</small></div></div>
      <p class="muted pg-how">On-time tasks and good calls build your streak; the streak multiplies XP (×1.5 at 3, ×2 at 5, ×2.5 at 8, ×3 at 12). Anything going overdue, or a call to rethink, resets it.</p>
      <h3 class="pg-h">Shift goals</h3>${goalsHTML(RW.goals(s, C(), A()), 'wide')}`;
    const dec = fbNow() ? `<h3 class="pg-h">Decisions <span class="muted">${good} good, ${bad} to rethink</span></h3>${list.length ? list.map((j) => `<div class="calls-t">${E.clock(j.t)}${j.pid ? ' · ' + esc(j.pid) : ''}</div>${reviewHTML([j], ' ').replace('<span class="res-cl"> </span>', '')}`).join('') : '<p class="empty">No decisions scored yet.</p>'}` : '<p class="muted">Decision feedback is set to show at the debrief.</p>';
    return sheet('Your shift so far', top + dec, `<button class="btn btn-primary" data-act="close">Close</button>`, { label: 'Your shift so far', wide: true });
  }
  /* ------------ floor calls ------------ */
  function openFloor(id) { ui.fl = { id }; ui.ov = 'floor'; ui.chart = null; render(); }
  function ovFloor() {
    const v = FL.view(s, C(), ui.fl.id), w = who(v.from), left = Math.max(0, v.exp - s.t), answered = v.done === 'answered', missed = v.done === 'missed';
    let body = `<p class="fl-from"><b>${esc(w.name)}</b>${w.role ? `, ${esc(w.role)}` : ''} · ${E.clock(v.at)}${!v.done ? ` · <span class="fl-left ${left <= 3 ? 'hurry' : ''}">${left} min to respond</span>` : ''}</p><p class="dlg-text fl-text">${esc(v.text)}</p><h3 class="fl-q">${esc(v.q)}</h3>`;
    if (missed) body += `<div class="warnbox">Nova took this one while you were busy.</div>`;
    const show = answered && fbNow();
    body += `<div class="fl-opts">${v.opts.map((o) => {
      if (!v.done) return `<button class="choice fl-opt" data-act="floor-pick" data-i="${o.i}">${esc(o.t)}</button>`;
      const me = answered && o.i === v.pick, cls = show ? (me ? (o.v === 2 ? 'right' : o.v === 1 ? 'ok' : 'wrong') + ' picked' : o.v === 2 ? 'right' : 'dim') : me ? 'picked' : 'dim';
      return `<div class="choice fl-opt ${cls}">${show && (me || o.v === 2) ? `<span class="fl-tag">${me ? (o.v === 2 ? 'Your answer · best' : o.v === 1 ? 'Your answer · acceptable' : 'Your answer') : 'Best answer'}</span>` : me ? '<span class="fl-tag">Your answer</span>' : ''}${esc(o.t)}${show && (me || o.v === 2) ? `<small>${esc(o.fb)}</small>` : ''}</div>`;
    }).join('')}</div>`;
    if (show || missed) body += `<div class="fl-teach"><span class="res-cl">Keep this</span><p>${esc(v.teach)}</p></div>`;
    else if (answered) body += '<p class="muted">Logged. You\'ll see how it went at the debrief.</p>';
    const foot = v.done ? `<button class="btn btn-primary" data-act="close">Back to work</button>` : `<span class="muted fl-cost">Answering takes ${v.cost} min</span>`;
    return sheet(esc(v.title), body, foot, { face: faceOf(v.from), label: `Floor call: ${v.title}`, noScrimClose: !!v.done && false });
  }
  function ovInbox() { return sheet('Unit phone', s.inbox.length ? s.inbox.map(msgHTML).join('') : '<p class="empty">No messages yet.</p>', `<button class="btn" data-act="readall">Mark all read</button><button class="btn btn-primary" data-act="close">Close</button>`); }

  function ovRank() {
    const r = ui.rank, pr = C().priority;
    const done = ui.rankDone;
    const body = `<div class="nova-card">${face('nova')}<p class="dlg-text" style="margin:0">${done ? `"${r.every((p, i) => pr.correct[i] === p) ? 'Same order I\'d pick, top to bottom. Now go prove it.' : r[0] === pr.correct[0] ? 'Same first stop as me. We differ after that. I\'ll tell you where at the debrief.' : 'I\'d have started somewhere else. Keep your eyes open, and I\'ll show you my order at the debrief.'}"` : '"Before you move: who are you seeing first? Put them in order. Don\'t overthink it. Think about who could get hurt fastest."'}</p></div>
      ${done ? '' : '<p class="rank-guide"><span><b>1</b> = see first</span><span class="rank-guide-line" aria-hidden="true"></span><span><b>' + r.length + '</b> = see last</span></p>'}
      <ol class="rank ${done ? 'done' : ''}">${r.map((pid, i) => { const d = def(pid); const right = pr.correct[i] === pid; const ord = ['1st', '2nd', '3rd', '4th', '5th', '6th'][i]; return `<li data-pid="${pid}" class="${done ? (i === 0 ? (right ? 'right' : 'wrong') : 'settled') : ''} ${ui.rankMoved === pid ? 'moved' : ''}"><span class="n" aria-label="${ord}"><b>${i + 1}</b><small>${i === 0 ? 'first' : i === r.length - 1 ? 'last' : ord}</small></span>${pface(pid)}<span class="rk-who"><b>${d.room} ${esc(d.short)}</b> <small class="muted">${ageSex(d)}</small><br><small class="muted">${esc(d.dx)}</small>${(() => { const fl = flagsFor(pid); return `<span class="rk-facts">${codeChip(d)}${shortAllergy(d)}${legal(d)}</span>${fl.length ? `<span class="rk-fl">${fl.map((f) => `<i>${esc(f)}</i>`).join('')}</span>` : ''}<button class="rk-peek" data-act="rank-peek" data-pid="${pid}" aria-expanded="${ui.peek === pid}">${ui.peek === pid ? 'Hide report' : 'Show report'}</button>${ui.peek === pid ? `<span class="rk-rep">${d.report.map((r, k) => `<span class="${s.brain.includes(pid + ':' + k) ? 'on' : ''}">${esc(r.text)}</span>`).join('')}</span>` : ''}`; })()}</span>${done ? '' : `<span class="mv"><button class="btn mv-up" data-act="rk" data-i="${i}" data-d="-1" aria-label="Move ${d.short} up to ${i}" ${i === 0 ? 'disabled data-why="Already first."' : ''}>${ICON.up}<span>Up</span></button><button class="btn mv-dn" data-act="rk" data-i="${i}" data-d="1" aria-label="Move ${d.short} down to ${i + 2}" ${i === r.length - 1 ? 'disabled data-why="Already last."' : ''}>${ICON.down}<span>Down</span></button></span>`}</li>`; }).join('')}</ol>`;
    return sheet('Who first?', body, done ? `<button class="btn btn-primary" data-act="rank-go">Start the shift</button>` : `<button class="btn btn-primary" data-act="rank-submit">Lock in my order</button>`, { noClose: true, noScrimClose: true, wide: true });
  }

  function ovMenu() {
    const inShift = s && !s.ended && ui.view !== 'home' && ui.view !== 'debrief';
    return sheet('Menu', `<div class="menu-list">
      <button class="btn" data-act="help">How it plays</button><button class="btn" data-act="settings">Settings</button>
      ${CL ? `<button class="btn" data-act="account">${CL.user() ? 'Your account' : 'Save your progress across devices'}</button>` : ''}
      <button class="btn" data-act="rpt">Send feedback or report a problem</button>
      ${RV ? '<button class="btn" data-act="review">Clinical review</button>' : ''}
      ${ui.installEvt ? '<button class="btn" data-act="install">Install The Shift on this device</button>' : iosInstallable() ? '<button class="btn" data-act="install-ios">Add The Shift to your home screen</button>' : ''}
      ${inShift && s.t >= 15 ? '<button class="btn" data-act="endask">End the shift early and see debrief</button>' : ''}
      ${inShift ? '<button class="btn btn-danger" data-act="restart">Restart this shift</button>' : ''}
      <button class="btn" data-act="home">Home${inShift ? ' (your shift is saved)' : ''}</button></div>`, '');
  }
  function ovSettings() {
    const st = prof.settings;
    const seg = (key, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button data-act="set" data-k="${key}" data-v="${v}" aria-pressed="${(st[key] || opts[0][0]) === v}">${l}</button>`).join('')}</div>`;
    return sheet('Settings', `<div class="setrow"><span>Theme</span>${seg('theme', [['system', 'System'], ['light', 'Day'], ['dark', 'Night']])}</div>
      <div class="setrow"><span>Text size</span>${seg('text', [['normal', 'Standard'], ['large', 'Large']])}</div>
      <div class="setrow"><span>Motion</span>${seg('motion', [['full', 'Full'], ['reduced', 'Reduced']])}</div>
      <div class="setrow"><span>Graphics<small class="set-sub">${FM.lite && (st.gfx || 'auto') === 'auto' ? 'Auto switched to Lite on this device' : 'Lite keeps things smooth on older computers'}</small></span>${seg('gfx', [['auto', 'Auto'], ['full', 'Full'], ['lite', 'Lite']])}</div>
      <div class="setrow"><span>Health check<small class="set-sub">Speed, memory and the last error, for troubleshooting</small></span><button class="btn" data-act="health">Open</button></div>
      <div class="setrow"><span>Decision feedback</span>${seg('feedback', [['now', 'Right away'], ['debrief', 'At the debrief']])}</div>
      <div class="setrow"><span>Music</span>${seg('music', [['on', 'On'], ['off', 'Off']])}</div>
      <div class="setrow"><span>Sound effects and haptics</span>${seg('sound', [['on', 'On'], ['off', 'Off']])}</div>
      <div class="setrow"><span>Share anonymous usage<small class="set-sub">Which screens people reach and where they stop. No names, nothing you type. <a href="/privacy/" target="_blank" rel="noopener">Privacy</a></small></span><div class="seg" role="group">${[['on', 'On'], ['off', 'Off']].map(([v, l]) => `<button data-act="tel" data-v="${v}" aria-pressed="${(TEL.optedOut() ? 'off' : 'on') === v}">${l}</button>`).join('')}</div></div>
      <div class="setrow"><span>Intro and tips</span><button class="btn" data-act="reset-tips">${prof.seen && Object.keys(prof.seen).length ? 'Show them again' : 'On for your next shift'}</button></div>`, `<button class="btn btn-primary" data-act="close">Done</button>`);
  }
  function ovHelp() {
    return sheet('How it plays', `<div class="help">
      <p><b>You are the nurse.</b> This shift runs ${hhmm(C(), 0)} to ${hhmm(C(), C().length)}. The clock moves when you act (assessing, giving meds, calling, walking between rooms), and each action shows its cost. When you're caught up, <b>Skip ahead</b> at the station: the clock runs until something needs you, then stops.</p>
      <p><b>Report.</b> The outgoing nurse gives you report. Flag the lines that matter; they stay on your brain sheet all shift. Flagging everything counts against you.</p>
      <p><b>Who first.</b> After report you rank your patients. Nova tells you how her order compares, and explains why at the debrief.</p>
      <p><b>The hallway.</b> Doors with an amber light need attention. Go into a room to assess, intervene, give or hold medications, and talk with patients and families. Tap objects in the room to inspect them.</p>
      <p><b>The phone.</b> ${esc(cna().name)} (your ${esc(cna().role)}), pharmacy, the lab${C().unitShort ? '' : ', telemetry'} and ${esc(prov().name)} will reach you here. Some messages ask for a reply.</p>
      <p><b>Charts.</b> Vitals, labs, orders, MAR, notes. Open them from the station or any room. They don't cost time.</p>
      <p><b>Nova.</b> Your charge nurse gives ${C().novaCredits || 3} nudges per shift. She points; she doesn't answer for you.</p>
      <p><b>Rounds and call lights.</b> Patients you haven't checked on in a while start asking for things. An hourly round heads that off. Some requests your ${esc(cna().role.toLowerCase())} can take; some need you.</p>
      <p><b>Follow-up.</b> When a patient leaves for the ICU, ED or OR, they're still on your list: call report, update the family, write the note, and call for updates on how they're doing.</p>
      <p><b>Floor calls.</b> The rest of the unit needs you too: a critical lab, a colleague's question, a visitor at the desk. Each is a quick decision on a clock. Let it run out and Nova takes it.</p>
      <p><b>XP, streaks and goals.</b> On-time work and good calls earn care XP. A run of them builds a streak that multiplies it; anything going overdue resets it. Four shift goals, three stars and badges carry across shifts on your career ladder.</p>
      <p><b>People, not just patients.</b> Once someone is stable, talking with them again opens up their story. Trust grows when you listen, answer their call light yourself, or just sit with them, and some of what they tell you matters clinically. The debrief tells you what became of them.</p>
      <p><b>Report.</b> In the last hour, give report to the oncoming nurse on everyone still on the unit. What's pending matters more than what's done.</p>
      <p><b>Consequences.</b> Patients get better or worse based on what you do, and what you don't. The debrief at the end explains why.</p></div>`, `<button class="btn btn-primary" data-act="close">Got it</button>`);
  }
  function ovHealth() {
    const pm = performance.memory, rs = R.stats ? R.stats() : {}, last = PERF.last || {};
    let err = null; try { err = JSON.parse(localStorage.getItem('theshift.lastError') || 'null'); } catch (e) { /* storage off */ }
    const nodes = document.getElementsByTagName('*').length, save = (() => { try { return Math.round(((localStorage.getItem('theshift.save.v1') || '').length + (localStorage.getItem('theshift.profile.v1') || '').length) / 1024); } catch (e) { return null; } })();
    const row = (k, v, ok) => `<tr><th>${k}</th><td class="${ok === false ? 'ab' : ''}">${v}</td></tr>`;
    const lines = [
      row('Frame rate', `${FM.fps} fps${FM.lite ? ' (auto lite)' : ''}`, FM.fps >= 30),
      row('Redraw, last', `${last.total || 0} ms (${last.view || ''}${last.ov ? '/' + last.ov : ''})`, (last.total || 0) < 50),
      row('Redraw, average / worst', `${PERF.avg.toFixed(1)} / ${PERF.worst.toFixed(0)} ms · ${PERF.slow} slow of ${PERF.n}`, PERF.n < 10 || PERF.avg < 30),
      row('Page elements', nodes, nodes < 3000),
      row('Animated characters', `${rs.onscreen || 0} on screen of ${rs.live || 0} · ${rs.fps || 30} fps`),
      row('Memory', pm ? `${(pm.usedJSHeapSize / 1e6).toFixed(1)} MB of ${(pm.jsHeapSizeLimit / 1e6).toFixed(0)} MB` : 'Not reported by this browser', pm ? pm.usedJSHeapSize < 100e6 : undefined),
      row('Saved data', save === null ? 'Storage blocked' : `${save} KB`, save === null ? false : save < 2000),
      row('Browser', esc(navigator.userAgent.replace(/^Mozilla\/5.0 /, '').slice(0, 90))),
      row('Usage data', esc(TEL.status())),
    ];
    const tel = TEL.recent.slice(-8).reverse();
    const detail = `fps ${FM.fps} · redraw avg ${PERF.avg.toFixed(1)} worst ${PERF.worst.toFixed(0)} ms · nodes ${nodes} · heap ${pm ? (pm.usedJSHeapSize / 1e6).toFixed(1) + 'MB' : 'n/a'} · save ${save}KB · ${navigator.userAgent}${err ? `\nlast error ${err.at}: ${err.msg} [${err.act} ${err.view} t=${err.t} ${err.caseId}]\n${err.stack}` : ''}`;
    ui.healthText = detail;
    return sheet('Health check', `<table class="health">${lines.join('')}</table>${err ? `<h3 style="margin:1rem 0 .3rem">Last error</h3><pre class="h-err">${esc(err.at + '\n' + err.msg + '\n' + err.stack)}</pre>` : '<p class="muted">No errors recorded.</p>'}${tel.length ? `<h3 style="margin:1rem 0 .3rem">Recent events</h3><pre class="h-err">${esc(tel.map((x) => `${x.at} ${x.event} ${JSON.stringify(x.p).slice(0, 90)}`).join('\n'))}</pre>` : ''}`, `<button class="btn" data-act="health-copy">Copy details</button><button class="btn btn-primary" data-act="close">Close</button>`, { label: 'Health check' });
  }
  function ovConfirm() {
    const c = ui.confirm;
    return sheet(c.title, `<p>${esc(c.text)}</p>`, `<button class="btn" data-act="close">Cancel</button><button class="btn ${c.danger ? 'btn-danger' : 'btn-primary'}" data-act="${c.act}">${esc(c.ok)}</button>`);
  }

  function toasts() {
    if (!ui.toasts.length || !s) return '';
    return `<div class="toasts" aria-live="assertive">${ui.toasts.map((id) => { const m = s.inbox.find((x) => x.id === id); if (!m || (ui.ov && !m.urgent) || (ui.view === 'station' && !m.urgent && !(m.replies && !m.done))) return ''; const w = who(m.from); const go = m.replies && !m.done ? m.replies[0] : null; return `<div class="toast tap ${m.urgent ? 'urgent' : ''}" role="alert" data-act="msg" data-m="${m.id}">${faceOf(m.from)}<p><b>${esc(w.name)}, ${E.clock(m.t)}</b>${esc(m.text)}</p><span class="tb">${m.bell && go ? m.replies.map((r, i) => `<button class="btn sm" data-act="reply" data-m="${m.id}" data-i="${i}">${esc(r.act === 'bell-cna' ? 'Ask ' + cna().name : r.label)}</button>`).join('') : go ? `<button class="btn" data-act="reply" data-m="${m.id}" data-i="0">${esc(go.label.length > 22 ? 'Respond' : go.label)}</button>` : ''}<button class="btn" data-act="toast-x" data-m="${m.id}" aria-label="Dismiss">${ICON.close}</button></span></div>`; }).join('')}</div>`;
  }

  /* ------------ render ------------ */
  const keyOf = (el) => JSON.stringify([el.dataset.act, el.dataset.id, el.dataset.pid, el.dataset.i, el.dataset.k, el.dataset.tab, el.dataset.p, el.dataset.t, el.dataset.m, el.dataset.v]);
  function render(scrollTop) {
    const T0 = performance.now();
    applySettings();
    const root = $('#app');
    const focusKey = document.activeElement && document.activeElement.dataset ? keyOf(document.activeElement) : null;
    const y = window.scrollY;
    if (s && !s.ended && (ui.view === 'station' || ui.view === 'room')) { if (fbNow()) tallyJudg(); goalWatch(); }
    RC = new Map();
    let h = '';
    if (ui.view === 'awards') h = vAwards();
    else if (ui.view === 'home' || !s) h = vHome();
    else {
      h = (ui.view === 'debrief' ? '' : header());
      if (ui.view === 'debrief') h += `<header class="top"><button class="mark" data-act="home">The Shift</button><div class="where">Debrief</div></header>`;
      if (ui.view === 'station' || ui.view === 'room') h += ptStrip();
      h += ui.view === 'handoff' ? vHandoff() : ui.view === 'station' ? vStation() : ui.view === 'room' ? vRoom() : vDebrief();
      h += toasts();
      if (ui.stamp) h += `<div class="stamp" role="status" aria-live="polite">${ICON.tick}<span><b>${esc(ui.stamp.text)}</b>${ui.stamp.sub ? `<small>${esc(ui.stamp.sub)}</small>` : ''}</span></div>`;
    }
    if (!ui.ov && s && !s.ended && (ui.critQ || []).length && (ui.view === 'station' || ui.view === 'room')) { ui.crit = ui.critQ.shift(); ui.ov = 'crit'; }
    const ov = ui.ov;
    if (ov === 'chart' && s) h += ovChart();
    else if (ov === 'med') h += ovMed();
    else if (ov === 'sbar') h += ovSbar();
    else if (ov === 'deleg') h += ovDeleg();
    else if (ov === 'nova') h += ovNova();
    else if (ov === 'dialog') h += ovDialog();
    else if (ov === 'inbox') h += ovInbox();
    else if (ov === 'rank') h += ovRank();
    else if (ov === 'menu') h += ovMenu();
    else if (ov === 'settings') h += ovSettings();
    else if (ov === 'help') h += ovHelp();
    else if (ov === 'confirm') h += ovConfirm();
    else if (ov === 'result' && ui.res && s) h += ovResult();
    else if (ov === 'crit' && ui.crit && s) h += ovCrit();
    else if (ov === 'review' && ui.review && s) h += ovReview();
    else if (ov === 'calls' && s) h += ovCalls();
    else if (ov === 'roster' && s) h += ovRoster();
    else if (ov === 'away' && ui.away && s) h += ovAway();
    else if (ov === 'give' && ui.rep && s) h += ovGive();
    else if (ov === 'floor' && ui.fl && s) h += ovFloor();
    else if (ov === 'health') h += ovHealth();
    else if (ov === 'report') h += ovReport();
    else if (ov === 'account' && CL) h += ovAccount();
    else if (ov === 'review' && RV) h += ovReviewInfo();
    if (ui.intro !== null && ui.intro !== undefined && s && ui.view === 'handoff') h += ovIntro();
    if (!h || !h.trim()) { ui.view = 'home'; ui.ov = null; h = vHome(); }   // never a blank screen
    const T1 = performance.now(); RC = null;
    root.innerHTML = h;
    const T2 = performance.now();
    if (ui.view !== ui.lastView) { const v = root.querySelector('main, .home'); if (v) v.classList.add('view-in'); ui.lastView = ui.view; }
    ui.hFresh = false;
    root.querySelectorAll('[disabled]').forEach((el) => { el.removeAttribute('disabled'); el.setAttribute('aria-disabled', 'true'); el.classList.add('off'); });
    R.setReduced(prof.settings.motion === 'reduced');
    R.hydrate(root);
    const T3 = performance.now();
    document.body.classList.toggle('tense', !!(s && !s.ended && ui.view !== 'home' && ui.view !== 'debrief' && isTense()));
    if (ui.view === 'room' && s) ui.newLogSeen = s.seq;
    ui.enter = false; ui.adv = null; if (s && ui.view === 'station') ui.msgSeen = s.seq;
    coachPlace(); debriefAnim(root); flushPops();
    FX.setMood(musicMood());
    if (ov === 'crit' || (ov === 'result' && ui.res && ui.res.crit)) { const k = ov === 'crit' ? (s.inbox.find((x) => x.id === ui.crit) || {}).pid : ui.res.pid; setTimeout(() => R.poke(k + ':bust'), 700); }
    if (ui.spot && ui.view === 'room') { const sp = ui.spot; ui.spot = null; const rt = root.querySelector('.room-top'); if (rt) { rt.classList.add('spot'); setTimeout(() => R.poke('room:' + sp), 350); setTimeout(() => rt.classList.remove('spot'), 2600); } }
    if (ui.flash) { const f = ui.flash; setTimeout(() => { if (ui.flash === f) { ui.flash = null; const rt = document.querySelector('.room-top'); if (rt) rt.classList.remove('flash-' + f); } }, 1600); }
    if (ui.stamp && !ui.stamp.shown) { ui.stamp.shown = true; const st = ui.stamp; setTimeout(() => { if (ui.stamp === st) { ui.stamp = null; const n = root.querySelector('.stamp'); if (n) { n.classList.add('out'); setTimeout(() => n.remove(), 250); } } }, 1500); }
    if (ui.justKey) { const jk = ui.justKey; ui.justKey = null; const el = [...root.querySelectorAll('[data-act]')].find((x) => keyOf(x) === jk && !x.dataset.scrim); if (el) { const tgt = el.tagName === 'INPUT' ? el.closest('.opt') || el : el; tgt.classList.add('just'); } }
    if (scrollTop) window.scrollTo(0, 0); else window.scrollTo(0, y);
    // restore focus
    let target = null;
    if (focusKey) {
      const k = JSON.parse(focusKey);
      target = [...root.querySelectorAll('[data-act]')].find((el) => keyOf(el) === focusKey && !el.dataset.scrim);
    }
    const dlg = root.querySelector('[role="alertdialog"]') || root.querySelector('[role="dialog"]');
    if (dlg && (!target || !dlg.contains(target))) { const f = dlg.querySelector('button:not([aria-disabled="true"]),input:not([aria-disabled="true"])'); if (f) f.focus({ preventScroll: true }); }
    else if (target) target.focus({ preventScroll: true });
    perfNote(T0, T1, T2, T3, performance.now(), h.length);
  }
  /* Render budget: how long each redraw takes, kept for the health check (Settings, or ?health in the URL). */
  const PERF = { n: 0, slow: 0, worst: 0, last: null, avg: 0 };
  function perfNote(t0, t1, t2, t3, t4, len) {
    const tot = t4 - t0; PERF.n += 1; PERF.avg += (tot - PERF.avg) / Math.min(PERF.n, 30); PERF.worst = Math.max(PERF.worst, tot); if (tot > 50) { PERF.slow += 1; PERF.slowLog = (PERF.slowLog || []).concat({ ms: Math.round(tot), build: +(t1 - t0).toFixed(0), dom: +(t2 - t1).toFixed(0), hyd: +(t3 - t2).toFixed(0), after: +(t4 - t3).toFixed(0), v: ui.view + (ui.ov ? '/' + ui.ov : '') }).slice(-40); }
    PERF.last = { build: +(t1 - t0).toFixed(1), dom: +(t2 - t1).toFixed(1), hydrate: +(t3 - t2).toFixed(1), after: +(t4 - t3).toFixed(1), total: +tot.toFixed(1), kb: Math.round(len / 1024), view: ui.view, ov: ui.ov };
  }
  /* What the score should feel like right now: the scene, how many patients are in danger, day or night. */
  function musicMood() {
    if (!s || ui.view === 'home') return { scene: 'home', tension: 0, night: false };
    if (ui.view === 'debrief' || s.ended) return { scene: 'debrief', tension: 0, night: false };
    const Ax = A(); let t = 0;
    C().patients.forEach((d) => { if (!here(d)) return; const P = s.p[d.id]; if (gone(P)) return; const st = d.status(s, P, Ax); t += st === 'urgent' ? .5 : st === 'watch' ? .08 : 0; });
    if (ui.ov === 'crit' || (ui.res && ui.res.crit === 'worse')) t = Math.max(t, 1);
    const a = ((C().start || 420) + s.t) % 1440;
    return { scene: 'play', tension: Math.min(1, t), night: a >= 1260 || a < 300 };
  }
  function isTense() {
    const Ax = A();
    const urgentMsg = s.inbox.some((m) => m.urgent && s.t - m.t <= 20);
    const here = ui.view === 'room' && def(s.loc).status(s, s.p[s.loc], Ax) === 'urgent';
    return urgentMsg || here;
  }

  /* ------------ actions ------------ */
  function enterRoom(pid) {
    if (here(def(pid)) && gone(s.p[pid])) return openAway(pid);
    if (!here(def(pid))) { ui.ov = null; render(); return; }
    const move = ui.view === 'room' && s.loc === pid ? 0 : 1;
    spend(move, () => {});
    if (s.ended) return;
    if (s.loc !== pid) { ui.dock = 'brain'; ui.brainAll = false; }
    s.loc = pid; s.lastRoom = pid; s.p[pid].seenAt = s.t; if (s.p[pid].firstSeen === undefined) s.p[pid].firstSeen = s.t; s.p[pid].callLight = false; ui.res = null; ui.flash = null;
    ui.view = 'room'; s.view = 'room'; ui.ov = null; ui.enter = true; ui.caption = null; ui.chart = null; ui.lastFind = null;
    s.inbox.forEach((m) => { if (m.pid === pid) m.read = true; });
    save(); render(true);
  }

  /* Every object in a room answers when tapped, even when the case has nothing special to say about it. */
  function genericClue(id, d, P, el) {
    const f = d.scene(s, P, A()), v = A().vitals(d.id);
    const g = {
      o2: () => f.bipap ? 'BiPAP running. The flowmeter is off.' : f.o2 ? `Oxygen flowmeter set to ${f.o2} L by nasal cannula.` : 'Oxygen flowmeter on the headwall, turned off. No oxygen ordered.',
      iv: () => f.iv === 'lock' ? 'Saline lock. Site clean and dry, no redness.' : 'IV running on the pump. Site clean, no redness or swelling.',
      monitor: () => `Monitor: ${v.rhythm || 'sinus rhythm'}, rate ${v.HR}. SpO₂ ${v.SpO2}%.`,
      tray: () => 'A meal tray.', alarm: () => 'Bed low and locked.',
    }[id];
    return g ? g() : `${el.getAttribute('aria-label') || 'Nothing'}. Nothing out of the ordinary.`;
  }
  function doAssess(sys, card) {
    const d = def(s.loc), P = s.p[d.id];
    const run = (k) => {
      if (k === 'vitals') {
        const pv = P.vit.filter((x) => x.by === 'You').pop();
        if (pv && s.t - pv.t <= 8 && d.status(s, P, A()) === 'stable') { const nv = A().vitals(d.id); if (['HR', 'SBP', 'RR', 'SpO2'].every((q) => Math.abs(nv[q] - pv[q]) <= 3)) A().judge(d.id + '-repeat', 'time', -1, `You re-took ${d.short}'s vitals minutes after the last set, with nothing changed.`, 'Recheck vitals when you expect a change: after a med, an intervention, or a new symptom. Otherwise the time goes to someone who needs it.', d.id); }
        const v = A().recordVitals(d.id, 'You'); P.k.hrAt = s.t; P.k.hr = v.HR; if (v.poss) P.k.possAt = s.t;
        const txt = `T ${fT(v.T)} °C, HR ${v.HR}${v.rhythm ? ' (' + v.rhythm + ')' : ''}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}% on ${o2txt(v.O2)}${v.poss ? ', sedation ' + v.poss.split(',')[0] : ''}. Pain ${v.pain}/10.`;
        logHere(d.id, txt, 'find'); s.log[s.log.length - 1].label = 'Vital signs'; return txt;
      }
      const L0 = sysL(k, SYS.find((x) => x[0] === k)[1]), prev = lastFind(d.id, L0), prevAt = P.assessAt[k];
      const txt = d.assess[k](s, P, A());
      if (prev && prevAt !== undefined && s.t - prevAt <= 10 && prev.text === txt && d.status(s, P, A()) === 'stable') A().judge(d.id + '-repeat', 'time', -1, `You repeated ${d.short}'s ${L0.toLowerCase()} with nothing new to find.`, 'Every assessment costs minutes another patient is waiting for. Reassess when something has changed, after an intervention, or when a recheck is due.', d.id);
      P.assessAt[k] = s.t; if (k === 'pain') P.k.painAt = s.t;
      logHere(d.id, txt, 'find'); s.log[s.log.length - 1].label = sysL(k, SYS.find((x) => x[0] === k)[1]); return txt;
    };
    const cost = SYS.find((x) => x[0] === sys)[2];
    const fn = () => { if (sys === 'full') { ['vitals', 'general', 'resp', 'cardiac', 'neuro', 'pain', 'skin', 'gi'].forEach(run); return 'Every system documented. Each finding is in the shift documentation.'; } return run(sys); };
    if (card === false) return spend(cost, fn);
    doAct(sys === 'full' ? 'Full head-to-toe' : sysL(sys, SYS.find((x) => x[0] === sys)[1]), cost, fn, sys === 'vitals' || sys === 'full' ? 'vitals' : '');
  }

  /* Every action in a room runs through here: the clock moves, then the nurse sees what happened to the patient. */
  let resSeq = 0;
  function doAct(label, mins, fn, kind) {
    const d = def(s.loc), P = s.p[d.id], Ax0 = A();
    const st0 = gone(P) ? 'gone' : d.status(s, P, Ax0), t0 = s.t, inb0 = s.inbox.length, vPrev = kind === 'vitals' ? Object.assign({}, Ax0.lastVitals(d.id)) : null;
    let text = '';
    const lateKey = () => { const o = new Set(); pts().forEach((dd) => { if (dd.id === d.id || gone(s.p[dd.id])) return; brainRows(dd, s.p[dd.id]).forEach((r) => { if (r.late && !r.done && !r.prog && r.key) o.add(dd.id + '|' + r.key + '|' + r.text); }); }); return o; };
    const late0 = lateKey(), j0 = s.judg.length;
    const g0 = ui.ghosts.length; ui.actPid = d.id;
    spend(mins, (Ax) => { text = fn(Ax) || ''; });
    ui.actPid = null; if (s.p[d.id]) s.p[d.id].touchAt = s.t;
    if (s.ended) return;
    const doneNow = ui.ghosts.slice(g0).filter((g) => g.pid === d.id); doneNow.forEach((g) => { g.held = true; });
    const review = judgSince(j0, d.id).filter((j) => !/-unseen$/.test(j.key || ''));
    const late1 = lateKey(), meanwhile = [...late1].filter((k) => !late0.has(k)).map((k) => { const [pid, , tx] = k.split('|'); return { pid, text: tx }; });
    const P2 = s.p[d.id], st1 = gone(P2) ? 'gone' : d.status(s, P2, A());
    markRead(d.id, st1);
    const dir = st0 === st1 || st1 === 'gone' ? 0 : stRank(st1) > stRank(st0) ? 1 : -1;
    const here = (ui.critQ || []).filter((id) => (s.inbox.find((x) => x.id === id) || {}).pid === d.id);
    ui.critQ = (ui.critQ || []).filter((id) => !here.includes(id));
    const alerts = here.map((id) => { const m = s.inbox.find((x) => x.id === id); m.read = true; return { from: m.from, text: m.text }; });
    const crit = (st1 === 'urgent' && st0 !== 'urgent') || alerts.length ? 'worse' : st0 === 'urgent' && st1 !== 'urgent' && st1 !== 'gone' ? 'better' : null;
    ui.res = { id: ++resSeq, pid: d.id, label, text, t0, t1: s.t, st0, st1, vPrev, vNew: kind === 'vitals' ? A().lastVitals(d.id) : null, msgs: s.inbox.length - inb0 - alerts.length, alerts, crit, done: doneNow.map((g) => g.text), review, meanwhile };
    if (!crit) reviewSound(review);
    ui.ov = 'result'; ui.caption = null; ui.flash = dir > 0 ? 'worse' : dir < 0 ? 'better' : null;
    if (crit === 'worse') setTimeout(() => FX.play('crit'), 100); else if (dir) setTimeout(() => FX.play(dir > 0 ? 'worse' : 'better'), 380);
    save();
  }

  function onReply(m, r) {
    const Ax = A();
    if (r.act === 'goto') return enterRoom(r.pid);
    if (r.act === 'delegate') { ui.ov = 'deleg'; ui.delegMsg = null; m.done = true; }
    if (r.act === 'sbar') { ui.ov = 'sbar'; ui.sbar = { pid: r.pid, picked: [], req: null, reply: null }; }
    if (r.act === 'chart') { ui.ov = 'chart'; ui.chart = { pid: r.pid, tab: r.tab || 'overview' }; }
    if (r.act === 'away') { m.read = true; return openAway(r.pid); }
    if (r.act === 'floor') { m.read = true; return openFloor(r.id); }
    if (r.act === 'bell-cna') { m.done = true; m.read = true; const j0 = s.judg.length; spend(1, (Ax2) => F.bellToCna(s, Ax2, r.pid)); if (s.ended) return; const rv = judgSince(j0, r.pid); if (rv.length && fbNow()) { ui.review = { title: `You replied: "${r.label}"`, list: rv }; ui.ov = 'review'; reviewSound(rv); } else if (s.p[r.pid].bell && s.p[r.pid].bell.cnaAt) stamp(`${cna().name} is on it`, 1); return render(); }
    const rx = C().replies && C().replies[r.act];
    if (rx) { m.done = true; const j0 = s.judg.length; spend(1, (Ax2) => rx(s, Ax2, m, r)); if (s.ended) return; const rv = judgSince(j0).filter((j) => !j.pid || j.pid === m.pid); if (rv.length && fbNow()) { ui.review = { title: `You replied: "${r.label}"`, list: rv }; ui.ov = 'review'; reviewSound(rv); } }
    m.read = true;
    render();
  }

  const stamp = (text, mins) => { ui.stamp = { text, sub: mins ? `${E.clock(s.t - mins)} · ${mins} min` : E.clock(s.t) }; };
  const handlers = {
    'pick-case'(el) { caseId = el.dataset.id; E.useCase(caseId); if (s && s.ended) s = null; ui.view = 'home'; ui.ov = null; render(); },
    new() { if (E.store.load() && ui.view === 'home') { ui.confirm = { title: 'Start over?', text: 'Your saved shift will be replaced.', ok: 'Start a new shift', act: 'new-yes', danger: true }; ui.ov = 'confirm'; return render(); } startNew(); },
    'new-yes'() { E.store.clear(); startNew(); },
    resume, home() { if (s && !s.ended) save(); if (s) caseId = s.caseId; ui.view = 'home'; ui.ov = null; render(true); },
    restart() { ui.confirm = { title: 'Restart this shift?', text: `You'll go back to ${E.clock(0)} report. Progress in this shift is lost.`, ok: 'Restart', act: 'new-yes', danger: true }; ui.ov = 'confirm'; render(); },
    menu() { ui.ov = 'menu'; render(); }, help() { ui.ov = 'help'; render(); }, settings() { ui.ov = 'settings'; render(); },
    set(el) { prof.settings[el.dataset.k] = el.dataset.v; E.store.saveProfile(prof); render(); },
    close() { if (ui.ov === 'report') ui.rp = null; if (ui.ov === 'dialog') { ui.dlg = null; ui.dlgReview = null; } if (ui.ov === 'rank') return; ui.ov = null; ui.chart = null; ui.med = null; ui.sbar = null; ui.nova = null; render(); },
    flag(el) { const k = el.dataset.k; const i = s.brain.indexOf(k); if (i >= 0) s.brain.splice(i, 1); else s.brain.push(k); save(); render(); },
    'h-go'(el) { if (ui.hIdx === +el.dataset.i) return render(); s.hHeard = Array.from(new Set((s.hHeard || []).concat(C().patients.filter((x) => !x.arrives)[ui.hIdx].id))); ui.hIdx = +el.dataset.i; ui.hFresh = true; render(true); },
    'h-done'() { TEL.track('report_done', { case: caseId, flags: s.brain.length, heard: ui.hIdx + 1 }); ui.rankMoved = null; ui.rank = C().patients.filter((p) => !p.arrives).map((p) => p.id); ui.rankDone = false; ui.ov = 'rank'; render(); },
    rk(el) {
      const i = +el.dataset.i, j = i + +el.dataset.d; const r = ui.rank;
      const before = {}; document.querySelectorAll('.rank li[data-pid]').forEach((li) => { before[li.dataset.pid] = li.getBoundingClientRect().top; });
      [r[i], r[j]] = [r[j], r[i]]; ui.rankMoved = r[j]; render();
      document.querySelectorAll('.rank li[data-pid]').forEach((li) => {
        const dy = (before[li.dataset.pid] || 0) - li.getBoundingClientRect().top; if (!dy || reduced()) return;
        li.style.transition = 'none'; li.style.transform = `translateY(${dy}px)`;
        requestAnimationFrame(() => { li.style.transition = 'transform .28s cubic-bezier(.2,.8,.2,1)'; li.style.transform = ''; });
      });
      const btn = document.querySelector(`.rank li[data-pid="${r[j]}"] [data-act="rk"][data-d="${j < i ? -1 : 1}"]:not([aria-disabled="true"])`) || document.querySelector(`.rank li[data-pid="${r[j]}"] [data-act="rk"]:not([aria-disabled="true"])`); if (btn) btn.focus({ preventScroll: true });
      clearTimeout(ui.rankT); ui.rankT = setTimeout(() => { ui.rankMoved = null; const m = document.querySelector('.rank li.moved'); if (m) m.classList.remove('moved'); }, 900);
    },
    'rank-peek'(el) { ui.peek = ui.peek === el.dataset.pid ? null : el.dataset.pid; render(); },
    roster() { ui.ov = 'roster'; render(); },
    prio(el) { const L = prioList(), i = L.indexOf(el.dataset.pid), j = i + +el.dataset.d; if (i < 0 || j < 0 || j >= L.length) return; [L[i], L[j]] = [L[j], L[i]]; s.prio = L; save(); render(); },
    'rank-submit'() {
      const pr = C().priority, r = ui.rank, Ax = A(); s.answers.rank = r.slice(); s.prio = r.slice();
      const hits = r.filter((p, i) => pr.correct[i] === p).length;
      if (pr.judge) pr.judge(r, Ax);
      if (hits === r.length) Ax.judge('rank-all', 'priority', 1, 'Your first-round priorities matched an experienced charge nurse\'s.', 'Unstable or unknown first, time-critical second, stable and predictable last.');
      ui.rankDone = true; TEL.track('triage_ranked', { case: caseId, matched: hits, of: r.length }); render();
    },
    'rank-go'() { ui.ov = null; spend(15, () => {}); ui.view = 'station'; s.view = 'station'; save(); render(true); },
    goto(el) { enterRoom(el.dataset.pid); },
    back() { ui.ov = null; spend(1, () => {}); if (s.ended) return; ui.view = 'station'; s.view = 'station'; s.loc = 'station'; ui.caption = null; save(); render(true); },
    dock(el) {
      ui.dock = el.dataset.id; render();
      // On a phone the panel sits below the scene: bring the chosen tab's content into view.
      const pn = document.querySelector('.pane'); if (pn && innerWidth <= 760) { const y = pn.getBoundingClientRect().top; if (y > innerHeight * .55 || y < 0) window.scrollTo({ top: scrollY + y - 190, behavior: reduced() ? 'auto' : 'smooth' }); }
    },
    assess(el) { doAssess(el.dataset.sys); if (!s.ended) render(); },
    int(el) { const d = def(s.loc), P = s.p[d.id], x = d.interventions.find((i) => i.id === el.dataset.id); doAct(x.label, x.cost, (Ax) => { const t = x.run(s, P, Ax); logHere(d.id, t || x.label, 'find'); s.log[s.log.length - 1].label = x.label; return t; }); if (!s.ended) render(); },
    poke() { const d = def(s.loc), line = R.say(d.id, rigV(d.id)); R.poke('room:' + d.id); if (line) { ui.caption = line.quiet ? line.text : '"' + line.text + '"'; ui.captionQuiet = !!line.quiet; } render(); },
    clue(el) { const d = def(s.loc), P = s.p[d.id]; if (d.onClue) d.onClue(el.dataset.id, s, P, A()); const cl = d.clues(s, P, A()); const t = cl[el.dataset.id] || genericClue(el.dataset.id, d, P, el); if (t) { ui.caption = t; ui.captionQuiet = false; if (!s.log.some((l) => l.pid === d.id && l.text === t)) { logHere(d.id, t, 'clue'); } save(); } render(); },
    med(el) { ui.med = { id: el.dataset.id, dose: null, holding: false, reason: null, note: null }; ui.ov = 'med'; ui.chart = null; render(); },
    dose(el) { ui.med.dose = +el.dataset.v; render(); },
    hreason(el) { ui.med.reason = +el.dataset.v; render(); },
    'med-holdask'() { ui.med.holding = true; render(); },
    prep(el) {
      const d = def(s.loc), P = s.p[d.id], p = el.dataset.p;
      if (p === 'vitals') doAssess('vitals', false);
      else if (p === 'pain') doAssess('pain', false);
      else { const x = d.interventions.find((i) => i.id === p); spend(x.cost, (Ax) => { const t = x.run(s, P, Ax); logHere(d.id, t, 'find'); s.log[s.log.length - 1].label = x.label; ui.med.note = t; }); }
      if (p === 'vitals' || p === 'pain') ui.med.note = s.log[s.log.length - 1].text;
      if (!s.ended) render();
    },
    'med-give'() {
      const d = def(s.loc), P = s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id), st = s.meds[m.id];
      const dose = ui.med.dose; ui.ov = null; ui.med = null;
      doAct(`${m.name} given`, 5, (Ax) => { const t = m.give(s, P, Ax, dose); if (m.prn) st.given.push(s.t); else { st.status = 'given'; st.at = s.t; } logHere(d.id, `${m.name}: ${t}`, 'act'); s.log[s.log.length - 1].label = `${m.name} given`; return t; }); if (!s.ended) render();
    },
    'med-declined'() {
      const d = def(s.loc), P = s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id);
      ui.ov = null; ui.med = null;
      doAct(`${m.name} offered, declined`, 2, (Ax) => { const why = m.refuse(s, P, Ax); if (m.onRefuse) m.onRefuse(s, P, Ax); logHere(d.id, `${m.name} offered and declined. ${why || ''}`.trim(), 'act'); s.log[s.log.length - 1].label = `${m.name} declined`; return why; }); if (!s.ended) render();
    },
    'med-hold'() {
      const d = def(s.loc), P = s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id), st = s.meds[m.id];
      const reasons = ['Outside the hold parameter', 'Condition changed, clarify with provider', 'Not enough intake', 'Patient declined'];
      const reason = ui.med.reason; ui.ov = null; ui.med = null;
      doAct(`${m.name} held`, 2, (Ax) => { let t; if (typeof m.hold === 'function') t = m.hold(s, P, Ax, reason); else { Ax.judge(m.id + '-hold', 'meds', -1, `You held ${d.short}'s ${m.name} without a clear clinical reason.`, 'Holding a scheduled dose is a decision with consequences. It needs a parameter or a change in condition behind it, and a notification.', d.id); t = 'Held.'; } st.status = 'held'; st.at = s.t; st.note = reasons[reason]; logHere(d.id, `${m.name} held (${reasons[reason].toLowerCase()}). ${t}`, 'act'); s.log[s.log.length - 1].label = `${m.name} held`; return `Held: ${reasons[reason].toLowerCase()}. ${t === 'Held.' ? '' : t}`.trim(); }); if (!s.ended) render();
    },
    talk(el) {
      const d = def(s.loc), P = s.p[d.id], Ax = A(), cid = d.talk(s, P, Ax), sid = cid && STY ? STY.pick(s, C(), d, P, Ax, cid) : null, id = sid || cid;
      if (!id) { hint(el, `${d.short} can't talk with you right now.`); return; }
      if (!sid) { s.seenDlg = s.seenDlg || {}; s.seenDlg[cid] = 1; }
      spend(3, () => {}); if (s.ended) return; s.p[d.id].touchAt = s.t; ui.dlgReview = null; ui.dlg = { id }; ui.ov = 'dialog'; render(); },
    family() { const d = def(s.loc); spend(d.family.cost, () => {}); if (s.ended) return; s.p[d.id].touchAt = s.t; ui.dlgReview = null; ui.dlg = { id: d.family.dialog(s, s.p[d.id], A()) }; ui.ov = 'dialog'; render(); },
    dlg(el) {
      const node = C().dialogs[ui.dlg.id], c = node.choices[+el.dataset.i];
      const Ax = A(), j0 = s.judg.length; if (c.fx) c.fx(s, Ax);
      const rv = judgSince(j0); ui.dlgReview = rv.length ? rv : null; reviewSound(rv);
      const text = typeof node.text === 'function' ? node.text(s) : node.text;
      const pid = node.pid || (/^\d+$/.test(node.who) ? node.who : s.loc);
      if (STY && node.story) { const f = s.storyFresh; s.storyFresh = null; if (f && f.d > 0) { gain(25, f.why === 'presence' ? 'Presence' : 'Connection', 'bond'); ui.bondSound = true; } else if (f && f.d < 0) ui.pops.push({ text: 'Trust', label: `${def(f.pid).short} pulls back`, cls: 'lost' }); }
      else if (STY && s.p[pid]) STY.fromDialog(s, pid, rv.filter((j) => j.pid === pid));
      logHere(pid, `You: "${c.label}"`, 'act');
      if (c.next) { const nx = C().dialogs[c.next]; logHere(pid, typeof nx.text === 'function' ? nx.text(s) : nx.text, 'info'); ui.dlg = { id: c.next }; }
      else if (ui.dlgReview && fbNow()) { ui.dlg = { id: '__review' }; }
      else { ui.dlg = null; ui.ov = null; }
      save(); render();
    },
    comm(el) { const d = def(s.loc), x = d.comms.find((c) => c.id === el.dataset.id); doAct(x.label, x.cost, (Ax) => { const t = x.run(s, s.p[d.id], Ax); logHere(d.id, t, 'act'); s.log[s.log.length - 1].label = x.label; return t; }); if (!s.ended) render(); },
    'rrt-generic'() { const d = def(s.loc); doAct('Rapid response called', 3, (Ax) => { Ax.judge(d.id + '-rrt', 'judgment', 0, `You called a rapid response for ${d.short}.`, 'Calling for help when worried is always allowed. The team found a patient who didn\'t yet meet criteria. Next time, pair the call with an SBAR to the provider.', d.id); const t = `The rapid response nurse checks in, reviews vitals, and suggests calling ${prov().name} with an update. "Always call if you're worried."`; logHere(d.id, t, 'act'); s.log[s.log.length - 1].label = 'Rapid response'; return t; }); if (!s.ended) render(); },
    sbar(el) { ui.sbar = { pid: el.dataset.pid || null, picked: [], req: null, reply: null }; ui.ov = 'sbar'; render(); },
    callpick() { ui.sbar = { pid: null, picked: [], req: null, reply: null }; ui.ov = 'sbar'; render(); },
    'sbar-pick'(el) { const id = el.dataset.id, p = ui.sbar.picked; const i = p.indexOf(id); if (i >= 0) p.splice(i, 1); else p.push(id); render(); },
    'sbar-req'(el) { ui.sbar.req = el.dataset.id; render(); },
    'sbar-send'() {
      const pid = ui.sbar.pid, d = def(pid), P = s.p[pid]; let reply = ''; const j0 = s.judg.length;
      spend(6, (Ax) => {
        const items = d.sbar.items(s, P, Ax); const keys = ui.sbar.picked.filter((id) => (items.find((i) => i.id === id) || {}).key);
        const noise = ui.sbar.picked.filter((id) => { const it = items.find((i) => i.id === id); return it && !it.key; });
        reply = d.sbar.respond.call(d.sbar, s, P, Ax, ui.sbar.picked, ui.sbar.req);
        if (!keys.length) Ax.judge(pid + '-sbar-empty-' + s.t, 'comm', -1, `Your call about ${d.short} had no clinically significant data in it.`, 'Providers act on findings. Lead with what changed and what you measured.', pid);
        if (noise.length >= 2) Ax.judge(pid + '-sbar-noise', 'comm', 0, `Your SBAR on ${d.short} included details that didn't change the picture.`, 'Concise beats complete. Every item in an SBAR should earn its place.', pid);
        P.k.calledAt = s.t; Ax.log(pid, `Called ${prov().name}. "${reply}"`, 'info');
      });
      if (s.ended) return; ui.sbar.reply = reply; ui.sbar.review = judgSince(j0, pid); reviewSound(ui.sbar.review); stamp(`Called ${prov().name}`, 6); render();
    },
    delegate() { ui.ov = 'deleg'; ui.delegMsg = null; ui.delegReview = null; render(); },
    deleg(el) { const t = C().delegation.tasks.find((x) => x.id === el.dataset.t); let msg = ''; const n0 = s.deleg.length, j0 = s.judg.length; spend(1, (Ax) => { msg = C().delegation.start(t, el.dataset.pid, s, Ax); }); if (s.ended) return; ui.delegMsg = msg; ui.delegReview = judgSince(j0).filter((j) => /^deleg/.test(j.key || '')); reviewSound(ui.delegReview); const nx = s.deleg[s.deleg.length - 1]; ui.delegNew = s.deleg.length > n0 ? nx.id + ':' + nx.pid + ':' + nx.at : null; ui.ov = 'deleg'; stamp(`${cna().name} is on it`, 1); render(); },
    nova() { ui.nova = null; ui.ov = 'nova'; render(); },
    'nova-ask'() { if (s.nova <= 0) return; s.nova -= 1; ui.nova = C().novaHint(s, A()); s.novaLog.push({ t: s.t, text: ui.nova }); save(); render(); },
    inbox() { ui.ov = 'inbox'; render(); s.inbox.forEach((m) => { m.read = true; }); save(); },
    readall() { s.inbox.forEach((m) => { m.read = true; }); save(); render(); },
    reply(el) { const m = s.inbox.find((x) => x.id === +el.dataset.m); if (!m || !m.replies) return; ui.toasts = ui.toasts.filter((x) => x !== m.id); ui.ov = null; onReply(m, m.replies[+el.dataset.i]); },
    'toast-x'(el) { const id = +el.dataset.m; ui.toasts = ui.toasts.filter((x) => x !== id); const m = s.inbox.find((x) => x.id === id); if (m) m.read = true; render(); },
    chart(el) { ui.chart = { pid: el.dataset.pid, tab: el.dataset.tab || (ui.chart && ui.chart.pid !== el.dataset.pid ? ui.chart.tab : 'overview') }; if (!el.dataset.tab && !(ui.ov === 'chart')) ui.chart.tab = 'overview'; ui.ov = 'chart'; render(); },
    catchup() { spend(10, (Ax) => Ax.log(null, 'Charted and caught up.', 'act')); if (!s.ended) render(); },   // test harness only; players skip ahead
    skip() { skipAhead(); },
    floor(el) { if (!s || s.ended) return; openFloor(el.dataset.id); },
    'floor-pick'(el) {
      const id = ui.fl.id, v0 = FL.view(s, C(), id); if (v0.done) return render();
      let r = null; spend(v0.cost, (Ax) => { r = FL.answer(s, Ax, id, +el.dataset.i); });
      if (s.ended) return; if (!r) return render();
      if (fbNow()) { if (r.v === 2) gain(40, 'Floor call bonus', 'good'); FX.play(r.v === 2 ? 'right' : r.v === 1 ? 'commit' : 'miss'); } else FX.play('commit');
      ui.ov = 'floor'; render();
    },
    health() { ui.ov = 'health'; render(); },
    install() { const ev = ui.installEvt; if (!ev) return; ui.installEvt = null; ui.ov = null; render(); try { ev.prompt(); ev.userChoice.then((c) => TEL.track('install_prompt', { outcome: c && c.outcome })).catch(() => {}); } catch (e) { /* prompt already used */ } },
    'install-ios'(el) { TEL.track('install_prompt', { outcome: 'ios_help' }); hint(el, 'In Safari, tap the Share button, then Add to Home Screen.'); },
    by(el) { ui.byCj = el.dataset.v === 'cj'; if (ui.byCj && !ui.byCjSeen) { ui.byCjSeen = true; TEL.track('debrief_steps_view', { case: s ? s.caseId : caseId }); } render(); },
    review() { ui.ov = 'review'; TEL.track('review_info', { case: caseId }); render(); },
    account() { ui.acct = { email: (ui.acct && ui.acct.email) || '' }; ui.ov = 'account'; render(); },
    'acct-send'() {
      const a = ui.acct || (ui.acct = {}), email = (a.email || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { a.err = 'That email doesn\'t look right.'; return render(); }
      a.err = null; a.busy = true; render();
      CL.sendLink(email).then(() => { a.busy = false; a.sent = email; render(); }).catch((e) => { a.busy = false; a.err = /rate|seconds/i.test(e.message) ? 'Too many tries. Wait a minute, then send again.' : 'Couldn\'t send the link. Check your connection and try again.'; render(); });
    },
    'acct-again'() { ui.acct = { email: '' }; render(); },
    'acct-sync'() { CL.sync().then(fromCloud); render(); },
    'acct-out'() { CL.signOut(); ui.ov = null; render(); hint(document.querySelector('.top .mark') || document.body, 'Signed out. Your progress stays on this device.'); },
    tel(el) { TEL.setOptOut(el.dataset.v === 'off'); render(); },
    'fb-pay'(el) { ui.fb = ui.fb || {}; ui.fb.pay = ui.fb.pay === el.dataset.v ? null : el.dataset.v; render(); },
    'fb-send'() { const f = ui.fb || {}; if (!f.note && !f.pay) return; const d = s && s.ended ? E.debrief(s) : null; f.sent = TEL.feedback('debrief', Object.assign(fbWhere(), { would_pay: f.pay || '', note: (f.note || '').trim(), score: d ? d.overall : null })); render(); },
    rpt(el) { const k = el && el.dataset && el.dataset.k, tt = el && el.dataset && el.dataset.t; const j = k !== undefined && s ? s.judg.find((x) => (x.key || '') === k && String(x.t) === String(tt)) || null : null; ui.rp = { j, why: null, note: '' }; ui.ov = 'report'; render(); },
    'rpt-why'(el) { ui.rp.why = ui.rp.why === el.dataset.v ? null : el.dataset.v; render(); },
    'rpt-send'() { const r = ui.rp; if (!r || (!r.why && !r.note)) return; r.sent = TEL.feedback(r.j ? 'decision' : 'general', Object.assign(fbWhere(), { problem: r.why || '', note: (r.note || '').trim(), decision_key: r.j ? r.j.key || '' : '', decision_text: r.j ? r.j.text : '', patient: r.j ? r.j.pid || '' : '' })); render(); },
    'health-copy'(el) { try { navigator.clipboard.writeText(ui.healthText || ''); hint(el, 'Copied'); } catch (e) { hint(el, 'Copy blocked here. Select the text instead.'); } },
    badge(el) { const b = RW.BADGES.find((x) => x.id === el.dataset.id); if (b) hint(el, `${b.label}: ${b.how}${prof.badges && prof.badges[b.id] ? ' ✓' : ''}`); },
    endask() { const late = s.t >= C().length - 30, left = pts().filter((x) => !gone(s.p[x.id]) && !(s.report && s.report[x.id])).map((x) => x.room); ui.confirm = { title: late ? 'End the shift?' : 'End the shift early?', text: late ? (left.length ? `You haven't given ${oncoming().name} report on ${left.join(', ')}. The next nurse starts blind on them.` : `${oncoming().name} has report on everyone. You'll see your debrief.`) : 'Unfinished work will count as missed in your debrief.', ok: late && left.length ? 'End without report' : 'End shift', act: 'end-yes' }; ui.ov = 'confirm'; render(); },
    'end-yes'() { ui.ov = null; endShift(); },
    filter(el) {
      ui.filter = el.dataset.k;
      if (el.dataset.k === 'bad' && s && !ui.reflected) { ui.reflected = true; prof.reflect = (prof.reflect || 0) + 1; prof.badges = prof.badges || {}; if (prof.reflect >= 3 && !prof.badges.reflect) { prof.badges.reflect = Date.now(); setTimeout(() => { const b = document.querySelector('.filter [data-k="bad"]'); if (b) hint(b, 'New badge: Reflective practice. Looking hard at your misses is how they stop happening.'); FX.play('star'); }, 120); } E.store.saveProfile(prof); }
      render();
    },
    awards(el) { ui.awFrom = ui.view === 'debrief' ? 'debrief' : 'home'; ui.view = 'awards'; ui.awTab = (el && el.dataset.k) || ui.awTab || 'all'; ui.ov = null; render(true); },
    'aw-tab'(el) { ui.awTab = el.dataset.k; render(); },
    'les-f'(el) { ui.lesF = el.dataset.k; render(); },
    'aw-back'() { ui.view = ui.awFrom === 'debrief' && s && s.ended ? 'debrief' : 'home'; render(true); },
    'next-case'(el) { caseId = el.dataset.id; E.useCase(caseId); E.store.clear(); startNew(); },
    'reset-tips'(el) { prof.seen = {}; E.store.saveProfile(prof); ui.coachStep = {}; render(); hint(document.querySelector('[data-act="reset-tips"]') || el, 'The intro and tips will show again.'); },
    'lastfind-x'() { ui.lastFind = null; render(); },
    'res-close'() { const c = ui.res && ui.res.crit, lab = ui.res && ui.res.label; ui.ov = null; ui.res = null; ui.flash = null; if (c) ui.spot = s.loc; const n = Date.now(); if (ui.ghosts.some((g) => g.held)) setTimeout(() => FX.play('check'), 300); ui.ghosts.forEach((g) => { if (g.held) { g.held = false; g.born = n; } }); ui.stampRow = lab ? { label: lab, born: n } : null; render(); },
    'crit-go'(el) { const m = s.inbox.find((x) => x.id === ui.crit); if (m) m.read = true; ui.ov = null; ui.crit = null; ui.spot = el.dataset.pid; enterRoom(el.dataset.pid); },
    'crit-x'() { const m = s.inbox.find((x) => x.id === ui.crit); if (m) m.read = true; const inRoom = m && ui.view === 'room' && s.loc === m.pid; ui.ov = null; ui.crit = null; if (inRoom) ui.spot = m.pid; render(); },
    'res-inbox'() { ui.res = null; ui.flash = null; const n = Date.now(); ui.ghosts.forEach((g) => { if (g.held) { g.held = false; g.born = n; } }); handlers.inbox(); },
    'brain-all'() { ui.brainAll = !ui.brainAll; render(); },
    away(el) { if (!s || s.ended) return; openAway(el.dataset.pid || el.dataset.id); },
    'away-back'() { ui.away.mode = null; ui.away.picked = []; render(); },
    'away-ho'() { ui.away.noteText = null; ui.away.mode = 'ho'; ui.away.picked = []; ui.away.reply = null; ui.away.review = null; render(); },
    'away-pick'(el) { const p = ui.away.picked, i = p.indexOf(el.dataset.id); if (i >= 0) p.splice(i, 1); else p.push(el.dataset.id); render(); },
    'away-ho-send'() { const a = ui.away, j0 = s.judg.length; let rep = ''; spend(4, (Ax) => { rep = F.giveHandoff(s, Ax, a.pid, a.picked); }); if (s.ended) return; if (!ui.away) return render(); a.mode = null; a.reply = rep; a.replyFrom = s.p[a.pid].out.spec.nurse; a.review = judgSince(j0, a.pid); reviewSound(a.review); stamp('Report called', 4); render(); },
    'away-fam'() { if (!ui.away || !s.p[ui.away.pid].out || !s.p[ui.away.pid].out.spec.family) return render(); ui.away.noteText = null; ui.away.mode = 'fam'; ui.away.reply = null; ui.away.review = null; render(); },
    'away-fam-pick'(el) { const a = ui.away, j0 = s.judg.length; let rep = ''; spend(4, (Ax) => { rep = F.famUpdate(s, Ax, a.pid, el.dataset.id); }); if (s.ended) return; if (!ui.away) return render(); a.mode = null; a.reply = rep; a.replyFrom = (s.p[a.pid].out.spec.family.name || '').toLowerCase().normalize('NFD').replace(/[^a-z]/g, ''); a.review = judgSince(j0, a.pid); reviewSound(a.review); render(); },
    'away-note'() { const a = ui.away; let tx = ''; spend(3, (Ax) => { tx = F.writeNote(s, Ax, a.pid); }); if (s.ended) return; if (!ui.away) return render(); a.reply = null; a.review = null; stamp('Note signed', 3); a.noteText = tx; render(); },
    'away-upd'() { const a = ui.away; a.noteText = null; let r = null; spend(3, (Ax) => { r = F.callUpdate(s, Ax, a.pid); }); if (s.ended) return; if (!ui.away) return render(); a.mode = null; a.reply = `${staff(s.p[a.pid].out.spec.nurse).name}: "${r.text}"`; a.replyFrom = s.p[a.pid].out.spec.nurse; a.review = null; FX.play(r.st === 'crit' ? 'worse' : r.st === 'improving' || r.st === 'stable' ? 'better' : 'msg'); render(); },
    bell(el) { const d = def(s.loc); if (!s.p[d.id].bell) return render(); doAct('Answered the call light', 2, (Ax) => { const tx = F.answerBell(s, Ax, d.id); logHere(d.id, tx, 'find'); s.log[s.log.length - 1].label = 'Call light'; return tx; }); if (STY && !s.ended) STY.fromBell(s, d.id); if (!s.ended) render(); },
    round(el) { const d = def(s.loc), lab = ROUND[F.kindOf(C())][0]; doAct(lab, 2, (Ax) => { const tx = F.round(s, Ax, d.id); logHere(d.id, tx, 'find'); s.log[s.log.length - 1].label = lab; return tx; }); if (!s.ended) render(); },
    report(el) { if (!s || s.ended) return; openReport(el.dataset.pid || el.dataset.id || null); },
    'rep-go'(el) { ui.rep = { pid: el.dataset.pid, picked: [], reply: null, review: null }; render(); },
    'rep-pick'(el) { const p = ui.rep.picked, i = p.indexOf(el.dataset.id); if (i >= 0) p.splice(i, 1); else p.push(el.dataset.id); render(); },
    'rep-send'() { const r = ui.rep, d = def(r.pid), P = s.p[r.pid], items = reportItems(d, P), j0 = s.judg.length; let rep = ''; spend(2, (Ax) => { rep = F.giveReport(s, Ax, r.pid, r.picked, items); }); if (s.ended) return; if (!ui.rep) return render(); r.reply = rep; r.replyPid = r.pid; r.review = judgSince(j0, r.pid); reviewSound(r.review); stamp(`Report on ${d.short}`, 2); render(); },
    calls() { ui.ov = 'calls'; render(); },
    here() { render(); window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }); },
    'intro-tap'() { if (!ui.introAll) { ui.introAll = true; render(); } },
    'intro-go'() { markSeen('intro:' + caseId); ui.intro = null; ui.introAll = false; render(); },
    'coach-next'() { const c = coachFor(); if (!c) return; ui.coachStep[c.key] = c.i + 1; if (c.i + 1 >= c.n) markSeen('coach:' + c.key); coachPlace(); },
    'coach-skip'() { markSeen('coach:station'); markSeen('coach:room'); coachPlace(); },
    msg(el) {
      const m = s.inbox.find((x) => x.id === +el.dataset.m); if (!m) return;
      m.read = true; ui.toasts = ui.toasts.filter((x) => x !== m.id);
      if (m.pid && def(m.pid) && here(def(m.pid)) && gone(s.p[m.pid]) && m.away) return openAway(m.pid);
      if (m.pid && def(m.pid) && here(def(m.pid)) && !gone(s.p[m.pid]) && !(ui.view === 'room' && s.loc === m.pid)) return enterRoom(m.pid);
      save(); render();
    },
    pending(el) { const d = def(el.dataset.pid); hint(el, `${d.room} is an admission from the ED, arriving about ${E.clock(d.arrives)}.`); },
    cast(el) {
      const id = el.dataset.id; R.poke(id + ':bust');
      const d = C().patients.find((p) => p.id === id), look = d ? d.look : (C().staff[id] || {}).look;
      const text = id === 'nova' ? 'Take a breath. Then go see the sickest one first.' : look && look.lines ? look.lines.calm : null;
      ui.castSay = text ? { id, text } : null; render();
      clearTimeout(ui.castT); ui.castT = setTimeout(() => { if (ui.castSay && ui.castSay.id === id && ui.view === 'home') { ui.castSay = null; render(); } }, 3200);
    },
  };

  /* Feedback. Answers get a pop and a moment to register; commitments get a chime and a stamp.
     None of it says whether the choice was right: that stays in the debrief. */
  const SELECT = new Set(['aw-tab', 'les-f', 'awards', 'aw-back', 'away', 'away-ho', 'away-fam', 'away-back', 'report', 'rep-go', 'roster', 'prio', 'rank-peek', 'calls', 'brain-all', 'here', 'sbar-req', 'dose', 'hreason', 'pick-case', 'rk', 'filter', 'set', 'assess', 'prep', 'h-go', 'dock', 'poke', 'clue', 'cast', 'msg']);
  const TOGGLE = new Set(['sbar-pick', 'flag', 'away-pick', 'rep-pick']);
  const COMMIT = new Set(['away-ho-send', 'away-note', 'away-upd', 'rep-send', 'bell', 'round', 'crit-x', 'reset-tips', 'med-give', 'med-hold', 'med-declined', 'sbar-send', 'int', 'comm', 'rrt-generic', 'nova-ask', 'rank-go', 'end-yes', 'new-yes', 'catchup']);
  const NAV = new Set(['crit-go', 'goto', 'back', 'msg', 'rank-go', 'h-done', 'new', 'new-yes', 'resume', 'home', 'end-yes', 'next-case', 'intro-go']);
  const CHOOSE = { dlg: 'select', reply: 'select', deleg: 'commit', 'away-fam-pick': 'select' };           // answers that advance the scene
  const JUST = new Set(['away-pick', 'rep-pick', 'rep-go', 'sbar-req', 'dose', 'hreason', 'pick-case', 'sbar-pick', 'flag', 'set', 'filter', 'h-go', 'dock', 'chart']);
  const reduced = () => prof.settings.motion === 'reduced' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  /* Punch: a flash ring and a ripple from the tap point, drawn outside #app so it survives re-render. */
  function zap(el, e, kind) {
    if (!el || !el.getBoundingClientRect || el.dataset.scrim) return;
    const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
    const big = r.width * r.height > innerWidth * innerHeight * .45;
    const z = document.createElement('div'); z.className = 'zap' + (kind ? ' ' + kind : '') + (big ? ' big' : '');
    const rad = el instanceof SVGElement ? '14px' : getComputedStyle(el).borderRadius || '8px';
    Object.assign(z.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: rad });
    const x = e && e.clientX ? e.clientX - r.left : r.width / 2, y = e && e.clientY ? e.clientY - r.top : r.height / 2;
    const d = Math.min(900, Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2.1);
    const i = document.createElement('i'); Object.assign(i.style, { left: x + 'px', top: y + 'px', width: d + 'px', height: d + 'px' }); z.appendChild(i);
    document.body.appendChild(z); setTimeout(() => z.remove(), 650);
  }
  /* A short note next to the thing that was tapped: why it can't be done, or what it is. */
  function hint(el, text, kind) {
    document.querySelectorAll('.pop-tip').forEach((n) => n.remove());
    if (!text) return;
    const r = el.getBoundingClientRect(), n = document.createElement('div'); n.className = 'pop-tip' + (kind ? ' ' + kind : ''); n.setAttribute('role', 'status'); n.textContent = text;
    document.body.appendChild(n);
    const w = n.offsetWidth, h = n.offsetHeight, below = r.bottom + h + 12 < innerHeight;
    n.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px';
    n.style.top = (below ? r.bottom + 8 : Math.max(8, r.top - h - 8)) + 'px';
    setTimeout(() => { n.classList.add('out'); setTimeout(() => n.remove(), 250); }, 2200);
  }
  /* Crash guard: an error never leaves a dead screen. The player can carry on, and the details are kept to report. */
  function safe(act, fn) { try { fn(); return true; } catch (err) { crashed(err, act); return false; } }
  function crashed(err, act) {
    ui.busy = false; RC = null;
    const info = { at: new Date().toISOString(), act: act || '', msg: String(err && err.message || err), stack: String(err && err.stack || '').split('\n').slice(0, 6).join('\n'), view: ui.view, ov: ui.ov, t: s ? s.t : null, caseId: s ? s.caseId : caseId, ua: navigator.userAgent };
    try { localStorage.setItem('theshift.lastError', JSON.stringify(info)); } catch (e) { /* storage off */ }
    try { TEL.track('error', { msg: info.msg.slice(0, 200), act: info.act, view: info.view, ov: info.ov || '', case: info.caseId, game_min: info.t === null ? null : Math.round(info.t), stack: info.stack.slice(0, 500) }); } catch (e) { /* never let reporting crash */ }
    try { console.error('The Shift error', info); } catch (e) { /* no console */ }
    if (document.querySelector('.oops')) return;
    const n = document.createElement('div'); n.className = 'oops'; n.setAttribute('role', 'alertdialog');
    const detail = `${info.msg}\n[${info.act || 'render'} · ${info.view}${info.ov ? '/' + info.ov : ''} · t=${info.t} · ${info.caseId}]\n${info.stack}`;
    n.innerHTML = `<div class="oops-c"><h2>Something went wrong</h2><p>Your shift is saved. You can keep playing, or go home and resume.</p><pre>${esc(detail)}</pre><div class="oops-f"><button class="btn" data-x="copy">Copy details</button><button class="btn" data-x="home">Home</button><button class="btn btn-primary" data-x="go">Keep playing</button></div></div>`;
    document.body.appendChild(n);
    n.addEventListener('click', (e) => {
      const x = e.target.closest('[data-x]'); if (!x) return; e.stopPropagation();
      if (x.dataset.x === 'copy') { try { navigator.clipboard.writeText(detail); x.textContent = 'Copied'; } catch (er) { x.textContent = 'Select the text above'; } return; }
      n.remove(); document.querySelectorAll('.ff,.xpop,.coach,.coach-ring').forEach((q) => q.remove());
      if (x.dataset.x === 'home') { if (s && !s.ended) save(); ui.view = 'home'; }
      ui.ov = null; ui.ff = null; ui.pops = []; ui.critQ = [];
      try { render(true); } catch (e2) { ui.view = 'home'; try { render(true); } catch (e3) { /* truly stuck */ } }
    });
  }
  addEventListener('error', (e) => { if (e.error) crashed(e.error, 'async'); });
  addEventListener('unhandledrejection', (e) => crashed(e.reason, 'promise'));
  function onClick(e) {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    if (el.dataset.scrim && e.target !== el) return; // clicks inside sheet don't close
    const a = el.dataset.act; if (!a) return;
    const h = handlers[a]; if (!h) return;
    e.preventDefault();
    if (ui.busy) return;
    if (el.getAttribute('aria-disabled') === 'true') {
      // Nope: shake, a low double thud, and the reason.
      const tgt = el.tagName === 'INPUT' ? el.closest('.opt') || el : el;
      zap(tgt, e, 'no'); FX.play('nope'); hint(tgt, el.dataset.why || 'Not available right now.', 'no');
      return;
    }
    if (el.dataset.hold) {
      if (ui.holdDone) { ui.holdDone = false; return; }
      if (e.detail !== 0 && e.clientX !== undefined) { hint(el, 'Press and hold to confirm.', ''); FX.play('tap'); return; }
    }
    zap(el.tagName === 'INPUT' ? el.closest('.opt') || el : el, e, COMMIT.has(a) ? 'strong' : '');
    if (NAV.has(a)) {
      // Screen changes: show the press first, then move.
      ui.busy = true; FX.play(COMMIT.has(a) ? 'commit' : a === 'msg' ? 'select' : 'tap');
      setTimeout(() => { ui.busy = false; document.querySelectorAll('.zap').forEach((z) => z.remove()); safe(a, () => h(el)); }, reduced() ? 40 : 130);
      return;
    }
    const choose = CHOOSE[a] || (a === 'sbar' && el.classList.contains('choice') ? 'select' : null);
    if (choose) {
      // Let the pick land: mark it, sound it, then move on.
      ui.busy = true; el.classList.add('chosen'); const box = el.closest('.sheet, .toast, .msg'); if (box) box.classList.add('choosing');
      FX.play(choose);
      setTimeout(() => { ui.busy = false; safe(a, () => h(el)); }, reduced() ? 60 : 280);
      return;
    }
    if (a === 'set' && el.dataset.k === 'sound') FX.setOn(el.dataset.v !== 'off');
    if (JUST.has(a)) ui.justKey = keyOf(el);
    if (!safe(a, () => h(el))) return;
    if (a === 'rank-submit') { const pr = C().priority; FX.play(ui.rank.every((p, i) => pr.correct[i] === p) ? 'right' : 'commit'); }
    else if (TOGGLE.has(a)) FX.play((a === 'flag' ? s.brain.includes(el.dataset.k) : a === 'away-pick' ? ui.away.picked.includes(el.dataset.id) : a === 'rep-pick' ? ui.rep.picked.includes(el.dataset.id) : ui.sbar && ui.sbar.picked.includes(el.dataset.id)) ? 'select' : 'deselect');
    else FX.play(COMMIT.has(a) ? 'commit' : SELECT.has(a) ? 'select' : 'tap');
  }
  /* Press-and-hold: a committing action takes a deliberate beat. */
  function startHold(e) {
    const el = e.target.closest('[data-hold]'); if (!el || el.getAttribute('aria-disabled') === 'true' || ui.busy) return;
    cancelHold(); ui.holdEl = el; el.classList.add('holding'); el.addEventListener('pointerleave', cancelHold, { once: true }); FX.play('tap');
    ui.holdT = setTimeout(() => { ui.holdT = null; el.classList.remove('holding'); ui.holdDone = true; setTimeout(() => { ui.holdDone = false; }, 600); zap(el, null, 'strong'); FX.play('commit'); const h = handlers[el.dataset.act]; if (h) safe(el.dataset.act, () => h(el)); }, 800);
  }
  function cancelHold() { if (ui.holdT) { clearTimeout(ui.holdT); ui.holdT = null; } if (ui.holdEl) ui.holdEl.classList.remove('holding'); ui.holdEl = null; }
  function onKey(e) {
    if (e.key === 'Escape' && ui.ov === 'crit') { handlers['crit-x'](); return; }
    if (e.key === 'Escape' && ui.ov === 'result') { handlers['res-close'](); return; }
    if (e.key === 'Escape' && ui.ov && ui.ov !== 'rank') { handlers.close(); return; }
    const el = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && el && el.getAttribute && el.getAttribute('role') === 'button' && el.tagName !== 'BUTTON') { e.preventDefault(); onClick({ target: el, preventDefault() {} }); }
  }

  function boot() {
    applySettings();
    const all = CASES.map((id) => E.getCase(id)).filter(Boolean);
    all.forEach((k) => { const add = Object.assign(F.staffFor(k, all), FL.staffFor()); Object.keys(add).forEach((key) => { if (!k.staff[key]) k.staff[key] = add[key]; }); });
    CASES.forEach((id) => { const k = E.getCase(id); if (k && STY) STY.install(k); });
    CASES.forEach((id) => { const k = E.getCase(id); if (!k) return; k.patients.forEach((p) => R.define(p.id, p.look)); Object.entries(k.staff).forEach(([key, v]) => { if (v.look) R.define(key, v.look); }); });
    document.addEventListener('click', onClick);
    document.addEventListener('pointerdown', startHold);
    ['pointerup', 'pointercancel'].forEach((ev) => document.addEventListener(ev, cancelHold, true));
    document.addEventListener('contextmenu', (e) => { if (e.target.closest && e.target.closest('[data-hold]')) e.preventDefault(); });
    document.addEventListener('keydown', onKey);
    document.addEventListener('input', (e) => { const b = e.target && e.target.dataset && e.target.dataset.bind; if (!b) return; const v = e.target.value; if (b === 'note') { ui.fb = ui.fb || {}; ui.fb.note = v; } else if (b === 'rp.note' && ui.rp) ui.rp.note = v; else if (b === 'acct.email') { ui.acct = ui.acct || {}; ui.acct.email = v; return; } const btn = document.querySelector(b === 'note' ? '[data-act="fb-send"]' : '[data-act="rpt-send"]'); if (btn) { const ok = b === 'note' ? !!(v.trim() || (ui.fb && ui.fb.pay)) : !!(v.trim() || (ui.rp && ui.rp.why)); if (ok) { btn.removeAttribute('aria-disabled'); btn.removeAttribute('data-why'); } else { btn.setAttribute('aria-disabled', 'true'); btn.dataset.why = 'Answer one of the two first.'; } } });
    requestAnimationFrame(frameMon);
    if (/[?&#]health\b/.test(location.href)) setTimeout(() => { ui.ov = 'health'; render(); }, 400);
    const g = E.store.load(); if (g && !g.ended && E.getCase(g.caseId)) { s = g; caseId = g.caseId; E.useCase(caseId); }
    ui.view = 'home'; safe('boot', () => render(true));
    if (CL) { CL.onChange(() => { if (ui.ov === 'account' || ui.view === 'home') render(); }); CL.ready.then((ok) => { const linked = CL.linked(); if (ok) fromCloud(); if (linked && CL.user()) setTimeout(() => hint(document.querySelector('[data-act=account].acct-link') || document.querySelector('.top .mark') || document.body, `Signed in as ${CL.user().email}. Your progress is saved to your account.`), 300); else if (linked) { ui.ov = 'account'; render(); } }); }
    addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); ui.installEvt = e; });
    addEventListener('appinstalled', () => { ui.installEvt = null; TEL.track('app_installed', {}); });
    TEL.track('app_open', { has_save: !!(s && !s.ended), shifts_done: prof.runs.length, standalone: standalone() });
    // Where people stop: the last screen of an unfinished shift when the page goes away.
    addEventListener('pagehide', () => { if (s && !s.ended && ui.view !== 'home') TEL.track('shift_left', { case: s.caseId, game_min: Math.round(s.t), view: ui.view, ov: ui.ov || '', wall_min: s.wall0 ? Math.round((Date.now() - s.wall0) / 60000) : null }); TEL.flush(true); });
  }
  S.ui = { boot, _handlers: handlers, _ui: ui, _state: () => s, _render: render, _perf: PERF };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window.Shift);
