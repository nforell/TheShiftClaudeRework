/* The Shift — UI. Renders from game state; every control routes through act(). */
(function (S) {
  const E = S.engine, OR = S.orient, A_ = S.art, R = S.rig, FX = S.fx, F = S.flow, FL = S.floor, RW = S.reward, STY = S.story, CJ = S.cjmm, NG = S.ngn, RV = S.review, CL = S.cloud && S.cloud.on() ? S.cloud : null;
  const TEL = S.tel || { track() { return false; }, flush() {}, feedback() { return 'email'; }, status: () => 'Not loaded', recent: [], optedOut: () => false, setOptOut() {} };
  const CASES = ['medsurg-4w-1', 'medsurg-4w-2', 'medsurg-4w-3', 'stepdown-6e-1', 'icu-3w-1', 'ed-podb-1', 'ld-2s-1', 'ob-2n-1', 'psych-3e-1', 'psych-4n-1', 'peds-5s-1'];
  let caseId = CASES[0];
  /* Psych law: the content is written to California law (5150, 5250, Riese, LPS). "General US" swaps those for
     plain descriptions that hold in most states. Applied to everything the game shows, at display time. */
  const LAW = [
    [/\bWIC 5150\b/g, '72-hour involuntary hold'], [/\bWIC 5250\b/g, 'extended involuntary certification'],
    [/\ba 5150\b/g, 'a 72-hour hold'], [/\b5150 hold\b/g, '72-hour hold'], [/\b5150\b/g, '72-hour hold'],
    [/\ba 5250\b/g, 'an extended certification'], [/\bthe 5250\b/g, 'the extended certification'], [/^5250\b/g, 'Extended certification'], [/\b5250\b/g, 'extended certification'],
    [/\bthe hearing is usually within a day\b/g, 'the hearing timeline depends on the state'],
    [/\bRiese petition\b/g, 'petition for court-ordered medication'], [/ ?\(Riese\)/g, ''], [/\bRiese\b/g, 'capacity hearing'],
    [/\bLPS conservatorship\b/g, 'mental health conservatorship'], [/\bWIC 5585\b/g, '72-hour involuntary hold for a minor'], [/\b5585\b/g, '72-hour hold (minor)'],
    [/\billegal in California\b/g, 'illegal in most states'], [/\bCalifornia law protects\b/g, 'Privacy law protects'], [/ \(36 hours in California\)/g, ' (the deadline varies by state)'],
  ];
  const LAWHIT = /5150|5250|5585|Riese|LPS|California/;
  const lawText = (x) => { if (!LAWHIT.test(x) || ((prof && prof.settings) || {}).law !== 'general') return x; LAW.forEach(([re, to]) => { x = x.replace(re, to); }); return x; };
  const esc = (x) => lawText(String(x == null ? '' : x)).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel) => document.querySelector(sel);
  const ICON = {
    msg: '<svg class="ico" viewBox="0 0 24 24"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 18.5h4"/></svg>',
    menu: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chart: '<svg class="ico" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3M8.5 10h7M8.5 14h7M8.5 18h4"/></svg>',
    back: '<svg class="ico" viewBox="0 0 24 24"><path d="M14 6l-6 6 6 6"/></svg>',
    station: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 11.2L12 4.5l8 6.7"/><path d="M6.3 9.6V19h11.4V9.6"/><path d="M10.3 19v-4.6h3.4V19"/></svg>',
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

  /* The home screen's selected card (caseId) can differ from the shift in progress (s.caseId) while a game is
     saved. Everywhere except home, the shift in progress wins, so game code never mixes one shift's patients
     with another's case. */
  const GAMEVIEW = { handoff: 1, station: 1, room: 1, debrief: 1 };
  const inGame = () => !!(s && GAMEVIEW[ui.view]);
  const C = () => E.getCase(s && ui.view !== 'home' && E.getCase(s.caseId) ? s.caseId : caseId);
  /* Shift picker: which specialty each shift belongs to and how hard it is (1–5), with the reason in one line. */
  const SPEC = {
    ms: { name: 'Medical-surgical', unit: '4 West', blurb: 'Adult general floor: post-op care, diabetes, infection, heart failure. Start here.' },
    sd: { name: 'Cardiac step-down', unit: '6 East', blurb: 'Telemetry, drips and protocols that run on numbers. Best after med-surg.' },
    psy: { name: 'Adult psychiatry', unit: '3 East', blurb: 'Locked adult unit: holds, seclusion, the right to refuse, and medical problems hiding behind psych diagnoses.' },
    teen: { name: 'Adolescent psychiatry', unit: '4 North', blurb: 'Teens 14 to 17: consent, privacy, restraint charting and mandated reporting.' },
    icu: { name: 'Critical care', unit: '3 West ICU', blurb: 'Two to four patients who can die this hour: vasopressors, ventilators, fresh hearts, and families deciding. Best after step-down.' },
    ed: { name: 'Emergency', unit: 'ED Pod B', blurb: 'Patients arrive with clocks running: stroke windows, door-to-balloon times, an airway that is closing.' },
    ld: { name: 'Labor and delivery', unit: 'L&D, 2 South', blurb: 'Every patient is two patients: fetal monitoring, oxytocin, an epidural, a trial of labor after cesarean, fever in labor, and a birth you catch yourself.' },
    ob: { name: 'Mother-baby', unit: '2 North', blurb: 'The first day after birth: fundus checks, magnesium, newborn glucose, and the screens that catch what doesn\'t show.' },
    peds: { name: 'Pediatrics', unit: '5 South', blurb: 'Infants to teens: age-based vital signs, weight-based doses, and their families.' },
  };
  const DIFF = ['', 'Orientation', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const META = {
    'medsurg-4w-1': { sp: 'ms', d: 1, why: 'Four patients and three hints. One of them is quietly getting worse. The best place to learn how the game works.' },
    'medsurg-4w-2': { sp: 'ms', d: 2, why: 'A fifth patient arrives from the ED, a unit of blood, a critical lab call, and other people changing orders on you.' },
    'medsurg-4w-3': { sp: 'ms', d: 3, why: 'Nights: nobody calls you when someone changes, your aide is floated at 01:00, and you only get two hints.' },
    'stepdown-6e-1': { sp: 'sd', d: 4, why: 'Every patient is on a drip, a nomogram or a protocol, and new results that should change them. Assumes med-surg basics.' },
    'psych-3e-1': { sp: 'psy', d: 4, why: 'Legal holds and seclusion charted step by step, plus a medical emergency on a psych unit. Uses California law (switch in Settings).' },
    'psych-4n-1': { sp: 'teen', d: 5, why: 'Minors: parents, privacy and mandated reports, restraint charting, refeeding labs and a hidden overdose. The hardest shift.' },
    'ed-podb-1': { sp: 'ed', d: 4, why: 'Five patients, two arriving mid-shift, each with a time-critical treatment that depends on a fact someone has to ask for. Assumes med-surg basics.' },
    'icu-3w-1': { sp: 'icu', d: 5, why: 'Septic shock on a vasopressor, a ventilator alarm, a tamponade that looks like the bleeding stopped, and a family meeting about stopping life support. Assumes step-down basics.' },
    'ld-2s-1': { sp: 'ld', d: 4, why: 'Four women in labor and four babies on the monitor: tachysystole on an oxytocin order that says go up, epidural hypotension, a uterine rupture, fever in labor, and a delivery before the doctor arrives. Assumes mother-baby basics.' },
    'ob-2n-1': { sp: 'ob', d: 3, why: 'Mothers and a newborn at once: bleeding, a high-alert drip, weight-based newborn dosing and a mental health screen. Assumes med-surg basics.' },
    'peds-5s-1': { sp: 'peds', d: 4, why: 'Normal vital signs change with age and every dose depends on weight. Parents, an interpreter and a safeguarding concern.' },
  };
  const meta = (id) => META[id] || { sp: 'ms', d: 1, why: '' };
  const specOf = (id) => SPEC[meta(id).sp];
  const diffLabel = (id) => DIFF[meta(id).d];
  const diffPips = (id, cls) => { const d = meta(id).d; return `<span class="diff d${d} ${cls || ''}" role="img" aria-label="Difficulty ${d} of 5, ${DIFF[d]}"><span class="pips" aria-hidden="true">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= d ? 'on' : ''}"></i>`).join('')}</span><b aria-hidden="true">${DIFF[d]}</b></span>`; };
  const shiftFacts = (k) => { const n = k.patients.filter((x) => !x.arrives).length, a = k.patients.length - n; return `${n} patients${a ? ` + ${a} ${k.arrivalNoun || 'admission'}${a > 1 ? 's' : ''}` : ''} · ${k.novaCredits || 3} hints · about ${k.minutes || 15} min`; };
  /* Terms of use: the game asks once, and again whenever src/terms.json gets a new version. */
  const TERMS = S.terms || null;
  const termsOk = () => !TERMS || String(prof.terms || '') >= TERMS.version;
  // The engine API only closes over the game state, so one object per game is enough (it was rebuilt on every call).
  let _A = null, _As = null;
  const A = () => (_As === s && _A ? _A : (_As = s, _A = E.api(s)));
  let RC = null;   // per-render cache: task rows computed once per patient per redraw
  const def = (id) => C().patients.find((p) => p.id === id);
  // What changes about a patient as the shift goes on (code status after a family meeting, the problem after a birth): d.live(s, P) overrides.
  const liveDef = (d) => { if (!d || !d.live || !s || !s.p[d.id]) return d; const o = d.live(s, s.p[d.id]); return o ? Object.assign({}, d, o) : d; };
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
  const fromOf = (d) => d.from || 'the ED', admWord = (d) => d.arriveAs || 'Admission';
  const here = (d) => !d.arrives || (s && s.p[d.id].arrived);          // admitted patients appear mid-shift
  const pts = () => C().patients.filter(here);
  const gone = (P) => !P || P.icu || P.gone;                                 // off the unit (ICU, OR)
  const goneText = (P) => P.goneText || 'Transferred to ICU';
  /* A case can give patients their own provider (an OB for the mother, a pediatrician for the baby). */
  const provKey = (pid) => ((pid && def(pid) && def(pid).provider) || C().provider || 'chen');
  const prov = (pid) => (pid === undefined && C().patients.some((x) => x.provider) ? { name: C().providerLabel || 'a provider', role: '', look: null } : staff(provKey(pid)));
  const cna = () => staff(C().cna || 'luis');
  const cnaAway = () => (s && C().delegation && C().delegation.away ? C().delegation.away(s) : null);   // floated, on break: who isn't there now
  const unitS = () => esc(C().unitShort || '4 West');
  const sysL = (id, l) => (C().sysLabels && C().sysLabels[id]) || l;
  const legal = (d0) => { const d = liveDef(d0); return d.legal ? `<span class="chip legal">${esc(d.legal)}</span>` : ''; };
  /* Normal ranges are per patient: a heart rate of 150 is normal at four months and alarming at forty. */
  const NORM = { T: [36, 37.9], HR: [55, 100], RR: [12, 22], SBP: [100, 160], SpO2: [92, 101] };
  const norm = (d, k) => (d && d.norms && d.norms[k]) || NORM[k];
  const abn = (d, k, v) => { const [lo, hi] = norm(d, k); return v < lo || v > hi; };
  const ageSex = (d) => (typeof d.age === 'number' && String(d.sex).length === 1 ? (d.age < 18 ? `${d.age} yr, ${d.sex}` : `${d.age}${d.sex}`) : `${d.age}, ${d.sex}`);   // "3M" reads like three months
  // Shorten text at a word boundary so a number is never cut in half ("Pain 9 out of 1…").
  const clip = (t, n) => { t = String(t || ''); if (t.length <= n) return t; const c = t.slice(0, n + 1), i = c.lastIndexOf(' '); return (i > n * .6 ? c.slice(0, i) : t.slice(0, n)).replace(/[\s,;:.(]+$/, '') + '…'; };
  const lcFirst = (t) => (/^[A-Z][A-Z0-9]/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));   // "UTI, ..." stays "UTI"
  // A drip's dose is whatever the pump says now ("Stopped 09:12", "1 g/h"), not the admission order.
  const medDose = (m) => { const st = s && s.meds[m.id]; return m.doseNow && st ? m.doseNow(s, s.p[st.pid]) || m.dose : m.dose; };
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
  /* The shift pack. Locked shifts can be picked and previewed; starting one offers the pack instead. */
  const PACK = (S.config || {}).pack || {};
  const owned = () => !!(CL && CL.owns && CL.owns('pack'));
  const locked = (id) => !!PACK.on && !(PACK.free || []).includes(id) && !owned();
  /* Orientation: offered automatically to a brand-new player the first time they start a shift; always available
     from How it plays. Finishing it from Start goes straight into that shift. */
  const firstTimer = () => !seen('orient') && !(prof.runs || []).length && !Object.keys(prof.seen || {}).length;
  /* Where the player is in the orientation survives a reload or a closed tab (a phone that locks mid-walkthrough):
     it reopens at the same step with the same answers, and is forgotten once finished, skipped or reset. */
  const ORK = 'theshift.orient.v1';
  const orSave = () => { try { if (ui.or) localStorage.setItem(ORK, JSON.stringify(Object.assign({}, ui.or, { caseId }))); else localStorage.removeItem(ORK); } catch (e) { /* storage off */ } };
  const orLoad = () => { try { const o = JSON.parse(localStorage.getItem(ORK) || 'null'); return o && typeof o.i === 'number' && o.i >= 0 && OR && o.i < OR.CH.length ? o : null; } catch (e) { return null; } };
  function openOrient(start) {
    if (!OR) return start ? startNew() : (ui.ov = 'help', render());
    const was = orLoad();
    ui.or = was && was.start === !!start ? Object.assign(OR.fresh(start), was) : OR.fresh(start); delete ui.or.caseId;
    OR._o = ui.or; ui.ov = 'orient'; orSave(); TEL.track('orient_open', { from: start ? 'start' : 'help', resumed: !!(was && ui.or.i) }); render(true);
  }
  function closeOrient(finished) {
    const o = ui.or; markSeen('orient'); try { localStorage.removeItem(ORK); } catch (e) { /* storage off */ } TEL.track(finished ? 'orient_done' : 'orient_skip', { step: o ? o.i : 0 });
    ui.or = null; ui.ov = null;
    if (o && o.start) return startNew();
    render(true);
  }
  function startNew() { if (locked(caseId)) { ui.ov = 'pack'; TEL.track('pack_view', { case: caseId, from: 'start' }); return render(); } s = E.newGame(caseId); s.wall0 = Date.now(); TEL.track('shift_start', { case: caseId, attempt: ((prof.done || {})[caseId] || 0) + 1, shifts_done: prof.runs.length }); ui.view = 'handoff'; ui.hFresh = true; ui.intro = C().intro && !seen('intro:' + caseId) ? 0 : null; ui.hIdx = 0; ui.rank = null; ui.rankDone = false; ui.ov = null; ui.toasts = []; ui.caption = null; save(); render(true); }
  function resume() { const g = E.store.load(); if (!g) return startNew(); s = g; caseId = g.caseId; E.useCase(caseId); TEL.track('shift_resume', { case: caseId, game_min: Math.round(s.t), view: s.view || 'station' }); ui.view = s.view || 'station'; ui.ov = null; render(true); }
  function goView(v) { ui.view = v; s.view = v; ui.caption = null; save(); render(true); }

  /* Spend time; collect new messages into toasts; end shift if the clock runs out. */
  function spend(mins, fn, until) {
    const track = s && !s.ended && (ui.view === 'station' || ui.view === 'room');
    const before = track ? openSnap() : null, pendingDeleg = s.deleg.filter((x) => !x.done).map((x) => x), t0 = s.t;
    const why = E.perform(s, mins, fn, until);
    if (track) {
      pendingDeleg.filter((x) => x.done && !x.dropped).forEach((x) => { const tk = C().delegation.tasks.find((k) => k.id === x.id); A().log(x.pid, `${cna().name} finished: ${tk.label.toLowerCase()}.`, 'act'); s.log[s.log.length - 1].label = `${cna().name}: ${tk.label.toLowerCase()}`; });
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
    if (track && s.t > t0) stuckCheck();
    const fresh = s.fresh.splice(0);
    const isCrit = (m) => m && m.urgent && m.pid && def(m.pid);
    if (fresh.length) { const ms = fresh.map((id) => s.inbox.find((x) => x.id === id)); const crit = ms.some(isCrit), urgent = ms.some((m) => m && m.urgent); setTimeout(() => FX.play(crit ? 'crit' : urgent ? 'urgent' : 'msg'), crit ? 120 : 420); }
    fresh.forEach((id) => {
      const m = s.inbox.find((x) => x.id === id); if (!m) return;
      if (isCrit(m)) { ui.critQ = (ui.critQ || []).concat(m.id); return; }   // a critical event gets the whole screen, not a toast
      ui.toasts.push(m.id);
      // Routine messages step aside after a few seconds (they stay in the phone); urgent ones wait for the player.
    });
    // One banner at a time, but a message still waiting for an answer (a call light, a question) isn't pushed out by
    // routine news: it stays until answered or dismissed, and the newest answer-needed one wins.
    { const ask = (id) => { const m = s.inbox.find((x) => x.id === id); return m && (m.urgent || (m.replies && !m.done)); }; ui.toasts = ui.toasts.filter((id) => { const m = s.inbox.find((x) => x.id === id); return m && !(m.replies && m.done && !m.urgent); }); const keep = ui.toasts.filter(ask); ui.toasts = keep.length ? keep.slice(-1) : ui.toasts.slice(-1); }
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
    TEL.track('shift_complete', { case: s.caseId, score: d.overall, rating: d.rating, stars: s.reward.stars, ended_early: s.t < C().length - 30, game_min: Math.round(s.t), wall_min: s.wall0 ? Math.round((Date.now() - s.wall0) / 60000) : null, good_calls: d.judg.filter((j) => j.delta > 0).length, misses: d.judg.filter((j) => j.delta < 0).length, poor_outcomes: d.outcomes.filter((o) => o.tone === 'bad').length, hints_used: (C().novaCredits || 3) - s.nova, attempt: prof.done[s.caseId] });
    if (CL) CL.recordRun({ case_id: s.caseId, score: d.overall, stars: s.reward.stars, minutes: s.t,
      domains: d.dom.filter((x) => x.score !== null).map((x) => ({ id: x.id, score: x.score })),
      steps: CJ.score(d.judg).filter((x) => x.score !== null).map((x) => ({ id: x.id, score: x.score })),
      misses: d.judg.filter((j) => j.delta < 0).map((j) => ({ key: j.key, text: j.text, step: CJ.step(j), pid: j.pid || null })),
      outcomes: d.outcomes.map((o) => ({ id: o.id, tone: o.tone })) });
    prof.runs = prof.runs.slice(0, 20); E.store.saveProfile(prof); E.store.clear(); E.store.saveLast(s);
    ui.view = 'debrief'; s.view = 'debrief'; ui.ov = null; ui.chart = null; ui.toasts = []; ui.debDone = false; ui.filter = 'all'; ui.dtab = 'shift'; ui.byCj = false; ui.reflected = false; ui.fb = {}; render(true);
  }

  /* Your helpers, always one tap away: Nova (tips) and the aide (delegation). Faces, so they read as people. */
  function helpers() {
    const busy = s.deleg.filter((x) => !x.done).length, sug = aideSuggest().length;
    return `<span class="helpers" role="group" aria-label="Your team">
      <button class="hb" data-act="nova" aria-label="Ask Nova, your charge nurse, for a tip. ${s.nova} tip${s.nova === 1 ? '' : 's'} left"><span class="hb-f">${face('nova')}<i class="hb-n">${s.nova}</i></span><span class="hb-t"><b>Ask Nova</b><small>${s.nova ? `Tips · ${s.nova} left` : 'No tips left'}</small></span></button>
      <button class="hb" data-act="delegate" aria-label="${cnaAway() ? `${esc(cna().name)}: ${esc(cnaAway())}` : `Ask ${esc(cna().name)}, your ${esc(cna().role)}.`} ${busy ? `${busy} task${busy === 1 ? '' : 's'} in progress` : 'Free'}${sug ? `, ${sug} suggestion${sug === 1 ? '' : 's'}` : ''}"><span class="hb-f">${face(C().cna)}<i class="hb-n ${busy ? 'busy' : 'free'}">${busy || ''}</i></span><span class="hb-t"><b>${cnaAway() ? esc(cna().name) : `Ask ${esc(cna().name)}`}</b><small>${cnaAway() ? esc(cnaAway()) : busy ? `Busy · ${busy} task${busy === 1 ? '' : 's'}` : sug ? `Free · ${sug} idea${sug === 1 ? '' : 's'}` : 'Free'}</small></span></button>
    </span>`;
  }
  /* What the aide offers to take, the way a good aide would: things on the unit's due list that are theirs to do,
     the vitals round, and routine care (walks, turns, I&O, baths). Each offer is tried on a copy of the shift first,
     and anything the game would score as a delegation mistake is left out: an aide doesn't offer to walk a confused
     fall risk. One-off judgment calls (a sitter, keeping someone flat) are never offered; they stay in the full list
     with everything an aide can't do, so delegation is still a decision. */
  const AIDE_DUE = { vitals: /vital/i, bg: /glucose|sugar|\bBG\b|fingerstick/i, intake: /intake|breakfast|lunch|dinner tray/i, io: /intake and output|\bI&O\b|diaper/i, weigh: /weigh|weight/i, turn: /turn|reposition/i, walk: /walk|ambulat/i, ortho: /orthostatic/i, tray: /tray|renal diet/i, blood: /transfus|PRBC|blood bank/i };
  const AIDE_ROUTINE = { walk: 'Up and walking', turn: 'Due every 2 hours', io: 'Diapers and intake this shift', bath: 'When there\'s time' };
  let aideCache = null;
  function aideSuggest() {
    if (cnaAway()) return [];
    if (!s || s.ended || !C().delegation) return [];
    const key = [s.caseId, s.t, s.deleg.length, s.judg.length, s.seq, (s.prio || []).join()].join('|');
    if (aideCache && aideCache.key === key) return aideCache.out;
    const tasks = C().delegation.tasks.filter((t) => !t.avail || t.avail(s));
    const busy = (id, pid) => s.deleg.some((x) => !x.done && x.id === id && x.pid === pid);
    const ok = (t, pid) => t.rooms.includes(pid) && here(def(pid)) && !gone(s.p[pid]) && !busy(t.id, pid);
    const cand = [], seen = new Set(), add = (t, pid, why, rank) => { const k = t.id + ':' + pid; if (seen.has(k) || !ok(t, pid)) return; seen.add(k); cand.push({ t, pid, why, rank }); };
    // 1. Due soon, and the aide's to do.
    dueList().filter((x) => x.pid && x.t <= s.t + 60 && !x.text.startsWith(cna().name + ':')).forEach((x) => tasks.forEach((t) => { if (AIDE_DUE[t.id] && AIDE_DUE[t.id].test(x.text)) add(t, x.pid, `${x.late ? 'Overdue' : 'Due'} ${E.clock(x.t)}`, x.t); }));
    // 2. The vitals round: an hour into the shift, then every four hours. Lower-priority patients first: you see your sickest yourself.
    const vt = tasks.find((t) => t.id === 'vitals');
    if (vt) {
      const round = 60 + Math.max(0, Math.ceil((s.t - 60 - 45) / 240)) * 240;
      if (s.t >= round - 45 && round < C().length) {
        const order = prioList().slice().reverse();
        order.forEach((pid, i) => { const v = A().lastVitals(pid); if (!v || v.t < round - 60) add(vt, pid, `Vitals round, ${E.clock(round)}`, round + i); });
      }
    }
    // 3. Routine care.
    tasks.filter((t) => AIDE_ROUTINE[t.id]).forEach((t) => t.rooms.forEach((pid, i) => {
      const last = s.deleg.filter((d) => d.id === t.id && d.pid === pid).map((d) => d.at).pop();
      if (t.id === 'turn' && last !== undefined && s.t - last < 110) return;
      if (t.id !== 'turn' && last !== undefined) return;
      add(t, pid, AIDE_ROUTINE[t.id], (t.id === 'bath' ? 10000 : 5000) + i);
    }));
    // Try each on a copy of the shift; drop what would be scored as a mistake.
    const tryIt = (c) => {
      try {
        const cl = JSON.parse(JSON.stringify(s)); cl.deleg = cl.deleg.filter((x) => x.done); const j0 = cl.judg.length;
        C().delegation.start(c.t, c.pid, cl, E.api(cl));
        return !cl.judg.slice(j0).some((j) => j.delta < 0);
      } catch (e) { return false; }
    };
    const out = [], per = {};
    for (const c of cand.sort((a, b) => a.rank - b.rank)) {
      if (out.length >= 3) break;
      if ((per[c.t.id] || 0) >= 2 || !tryIt(c)) continue;
      per[c.t.id] = (per[c.t.id] || 0) + 1; out.push(c);
    }
    aideCache = { key, out };
    return out;
  }
  /* ------------ header ------------ */
  function header() {
    const unread = s.inbox.filter((m) => !m.read).length;
    const loc = ui.view === 'room' ? `${unitS()} <span aria-hidden="true">/</span> <b>${s.loc} ${esc(def(s.loc).short)}</b>` : ui.view === 'handoff' ? `${unitS()} <span aria-hidden="true">/</span> <b>Shift report</b>` : `${unitS()} <span aria-hidden="true">/</span> <b>Nurses' station</b>`;
    return `<header class="top">
      <button class="mark" data-act="menu" aria-label="The Shift menu">The Shift</button>
      <div class="where">${loc}</div>
      <button class="icon-btn roster-btn" data-act="roster" aria-label="Your patients: who is who"><svg class="ico" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2c2.4 0 4.3 1.4 5 4.3"/></svg><span class="nova-l">Patients</span></button>
      ${ui.view !== 'handoff' ? `${helpers()}
      ${(() => { const m = RW.mult(s.streak || 0); return `<button class="xp ${m > 1 ? 'hot' : ''}" data-act="calls" aria-label="Care XP ${fmtN(s.xp || 0)}${m > 1 ? `, streak times ${m}` : ''}. Your shift so far">${ICON.xp}<b>${fmtN(s.xp || 0)}</b><b class="xp-k">${(s.xp || 0) >= 10000 ? ((s.xp || 0) / 1000).toFixed(0) + 'k' : fmtN(s.xp || 0)}</b>${m > 1 ? `<span class="fl">${ICON.flame}×${m}</span>` : ''}</button>`; })()}
      <button class="icon-btn" data-act="inbox" aria-label="Messages, ${unread} unread">${ICON.msg}${unread ? `<span class="badge">${unread}</span>` : ''}</button>` : ''}
      <div class="clock ${ui.adv ? 'bump' : ''}" role="timer" aria-live="off" aria-label="Shift time ${E.clock(s.t)}">${E.clock(s.t)}<small>ends ${E.clock(C().length)}</small>${ui.adv ? `<span class="adv" aria-hidden="true">+${ui.adv} min</span>` : ''}</div>
      <button class="icon-btn" data-act="menu" aria-label="Menu">${ICON.menu}</button>
      <div class="shiftbar" aria-hidden="true"><i style="width:${Math.min(100, s.t / C().length * 100).toFixed(1)}%"></i></div>
    </header>`;
  }

  /* ------------ home ------------ */
  function specHead(sp) { const x = SPEC[sp]; return `<div class="spec-h sp-${sp}"><b>${esc(x.name)}</b><span class="spec-u">${esc(x.unit)}</span><span class="spec-b">${esc(x.blurb)}</span></div>`; }
  function diffKey() { return `<span class="diff-scale" aria-hidden="true">${[1, 2, 3, 4, 5].map((d) => `<span class="dk diff d${d}"><span class="pips">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= d ? 'on' : ''}"></i>`).join('')}</span>${DIFF[d]}</span>`).join('')}</span>`; }
  function vHome() {
    E.useCase(caseId);
    const g = E.store.load(), c = C(), done = (id) => prof.runs.filter((r) => r.caseId === id);
    const start = hhmm(c, 0), initial = c.patients.filter((d) => !d.arrives), adm = c.patients.filter((d) => d.arrives);
    const cols = Math.ceil(initial.length / 2) + (adm.length ? 1 : 0) - (initial.length % 2 && adm.length ? 1 : 0);
    const saved = g && !g.ended ? E.getCase(g.caseId) : null;
    // Shift picker card: an illustrated header (the shift's sky, its start time and its real patients), the facts, and,
    // once picked, a bold ring and its own start button so choosing never depends on the hero scrolled out of view.
    const tod = (k) => { const h = Math.floor(((k.start || 420) % 1440) / 60); return h >= 21 || h < 5 ? 'night' : h >= 13 ? 'eve' : 'day'; };
    const TOD = { day: 'Day shift', eve: 'Evening shift', night: 'Night shift' };
    const rung = (id, i) => {
      const k = E.getCase(id), runs = done(id), best = runs.length ? Math.max(...runs.map((r) => r.score)) : null;
      const prev = i ? done(CASES[i - 1]).length : 1, on = id === caseId, lk = locked(id);
      const stn = (prof.stars || {})[id] || 0, tm = tod(k);
      const pts = k.patients.filter((x) => !x.arrives), shown = pts.slice(0, 3), more = k.patients.length - shown.length;
      const status = lk ? `<span class="rg-lock"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>Shift pack</span>` : best !== null ? `Best ${best}` : prev ? 'Not played' : 'Best after ' + esc(E.getCase(CASES[i - 1]).title);
      const cta = saved && g.caseId === id ? `<button class="btn btn-primary btn-go sc-go" data-act="resume">Resume at ${hhmm(saved, g.t)} <span aria-hidden="true">→</span></button>`
        : lk ? `<button class="btn btn-primary btn-go sc-go" data-act="pack">Unlock with the shift pack <span aria-hidden="true">→</span></button>`
        : `<button class="btn btn-primary btn-go sc-go" data-act="new">Start this shift <span aria-hidden="true">→</span></button>`;
      return `<article class="sc sp-${meta(id).sp} tod-${tm} ${on ? 'on' : ''} ${lk ? 'in-pack' : ''}">
        <button class="sc-pick ${lk ? 'in-pack' : ''}" data-act="pick-case" data-id="${id}" aria-pressed="${on}">
          <span class="sc-art" aria-hidden="true">
            <span class="sc-sky"></span>
            <span class="sc-time"><b>${hhmm(k, 0)}</b><small>${TOD[tm]}</small><small>to ${hhmm(k, k.length)}</small></span>
            ${on ? `<span class="sc-sel">${ICON.tick}Selected</span>` : ''}
            <span class="sc-cast">${shown.map((d) => R.still(d.id, 'sc-bust')).join('')}${more > 0 ? `<span class="sc-more">+${more}</span>` : ''}</span>
            <span class="sc-floor"></span>
          </span>
          <span class="sc-body">
            <span class="sc-unit"><span class="sc-dot"></span>${esc(specOf(id).name)} · ${esc(specOf(id).unit)}</span>
            <b class="sc-title"><span class="sr">${esc(specOf(id).name)}: </span>${esc(k.title)}</b>
            <span class="sc-card">${esc(k.card)}</span>
            <small class="rg-facts">${esc(shiftFacts(k))}</small>
            ${NG ? (() => { const nq = NG.items(id).length, nc = NG.count ? NG.count.cases(meta(id).sp) : 0; return nq || nc ? `<small class="sc-nx"><b>NCLEX</b>${nq ? `${nq} questions after the shift` : ''}${nq && nc ? ' · ' : ''}${nc ? `${nc} matching case stud${nc === 1 ? 'y' : 'ies'}` : ''}</small>` : ''; })() : ''}
            <span class="sc-foot">${diffPips(id)}<span class="sc-st"><span class="rung-st" aria-label="${stn} of 3 stars">${[0, 1, 2].map((j) => starSvg(j < stn, j, 'rs')).join('')}</span><small>${status}</small></span></span>
          </span>
        </button>
        ${on ? `<div class="sc-cta">${cta}</div>` : ''}
      </article>`;
    };
    return `<div class="home">
      <div style="display:flex;justify-content:space-between;align-items:center"><span class="mark" style="cursor:default">The Shift</span>
      <span class="home-nav"><button class="btn btn-quiet hn-px" data-act="practice">NCLEX practice</button><button class="btn btn-quiet" data-act="ref">Pocket reference</button><button class="btn btn-quiet" data-act="help">How it plays</button><button class="btn btn-quiet" data-act="settings">Settings</button><button class="btn btn-quiet hn-menu" data-act="menu" aria-label="Menu: settings, how it plays, pocket reference and more">Menu</button></span></div>
      <section class="home-hero">
        <div>
          <p class="big-clock" aria-label="${start}">${start.slice(0, 2)}<span>:</span>${start.slice(3)}</p>
          <p class="home-tags"><span class="spec-chip sp-${meta(caseId).sp}">${esc(specOf(caseId).name)} · ${esc(specOf(caseId).unit)}</span>${diffPips(caseId, 'big')}</p>
          <h1>${esc(c.hero.head)}</h1>
          <p class="lede">${esc(c.hero.lede)}</p>
          <p class="home-why"><b>Why it's rated ${esc(diffLabel(caseId).toLowerCase())}:</b> ${esc(meta(caseId).why)}</p>
          <div class="cta">
            ${saved && g.caseId === caseId ? `<button class="btn btn-primary btn-go" data-act="resume">Resume at ${hhmm(saved, g.t)} <span aria-hidden="true">→</span></button><button class="btn" data-act="new">Start over</button>` : locked(caseId) ? `<button class="btn btn-primary btn-go" data-act="pack">Unlock with the shift pack <span aria-hidden="true">→</span></button>${saved ? `<button class="btn" data-act="resume">Resume ${esc(saved.title)} at ${hhmm(saved, g.t)}</button>` : ''}` : saved ? `<button class="btn btn-primary btn-go" data-act="new">Start ${esc(c.title)} <span aria-hidden="true">→</span></button><button class="btn" data-act="resume">Resume ${esc(saved.title)} at ${hhmm(saved, g.t)}</button>` : `<button class="btn btn-primary btn-go" data-act="new">Start your shift <span aria-hidden="true">→</span></button>`}
          </div>
          <p class="home-meta">${c.patients.length} patients, about ${c.minutes || 15} minutes to play. Your progress saves as you go.</p>
          ${(() => { if (s && !s.ended) return ''; const L = E.store.loadLast(); if (!L) return ''; const k = E.getCase(L.caseId), d0 = E.debrief(L); return `<button class="btn btn-quiet last-deb" data-act="last-debrief">See your last debrief: ${esc(k.title)}, ${d0.overall} <span aria-hidden="true">→</span></button>`; })()}
        </div>
        <div class="home-cast" style="grid-template-columns:1.25fr repeat(${Math.max(2, cols)},1fr)" aria-label="Your charge nurse and your patients">
          <figure class="lead tap" data-act="cast" data-id="nova" role="button" tabindex="0" aria-label="Nova Reyes">${R.bust('nova', null, 'bust', '-104 -150 208 330')}<figcaption><b>Nova Reyes</b>${ui.castSay && ui.castSay.id === 'nova' ? `<q>${esc(ui.castSay.text)}</q>` : `Charge nurse. ${c.novaCredits || 3} hints per shift.`}</figcaption></figure>
          ${initial.map((d) => `<figure class="tap" data-act="cast" data-id="${d.id}" role="button" tabindex="0" aria-label="${esc(d.name)}">${R.bust(d.id, null, 'bust')}<figcaption><b>${d.room} ${esc(d.short)}</b>${ui.castSay && ui.castSay.id === d.id ? `<q>${esc(ui.castSay.text)}</q>` : esc(liveDef(d).dx)}</figcaption></figure>`).join('')}
          ${adm.map((d) => `<figure class="adm tap" data-act="cast" data-id="${d.id}" role="button" tabindex="0" aria-label="${esc(d.name)}">${R.bust(d.id, null, 'bust', '-232 -112 464 232')}<figcaption><b>${d.room} ${esc(d.short)}, arriving ${hhmm(c, d.arrives)}</b>${ui.castSay && ui.castSay.id === d.id ? `<q>${esc(ui.castSay.text)}</q>` : esc(admWord(d)) + ' from ' + esc(fromOf(d)) + ': ' + esc(d.reason.toLowerCase())}</figcaption></figure>`).join('')}
        </div>
      </section>
      ${NG && NG.bank ? `<section class="px-band"><div><p class="pr-k">NCLEX practice</p><h2>${NG.count.cases()} unfolding case studies. ${NG.count.bank()} questions. Every answer explained.</h2><p>NGN-style cases where the chart grows as the client changes, questions in all eight NCLEX-RN Client Needs categories, calculations, and a readiness view that shows what to study next.</p></div><div class="px-go"><button class="btn btn-primary btn-go" data-act="practice">Open NCLEX practice <span aria-hidden="true">→</span></button><button class="btn" data-act="ref">Pocket reference</button></div></section>` : ''}
      <div>
        <div class="sched-top"><h2 class="sched-h">Choose a shift</h2><p class="diff-key" aria-label="Difficulty runs from 1, Orientation, to 5, Expert">Difficulty ${diffKey()}</p></div>
        <p class="sched-sub">Tap a shift to see who you'll have, then start it from its card. ${CASES.length} shifts across ${new Set(CASES.map((id) => meta(id).sp)).size} units.</p>
        <div class="ladder sc-grid" role="group" aria-label="Choose a shift">
          ${CASES.map((id, i) => rung(id, i)).join('')}
          <article class="sc sc-soon"><div class="sc-pick"><span class="sc-art" aria-hidden="true"><span class="sc-sky"></span><span class="sc-time"><b>Soon</b></span><span class="sc-floor"></span></span><span class="sc-body"><span class="sc-unit">Coming later</span><b class="sc-title">In the works</b><span class="sc-card">More shifts on every unit.</span></span></div></article>
        </div>
        ${careerHTML()}
        <div class="homefoot"><span>${prof.runs.length ? `Shifts completed: ${prof.runs.length}.` : 'No shifts completed yet.'}${CL ? ` <button class="acct-link" data-act="account">${CL.user() ? 'Saved to your account' : 'Save your progress'}</button>` : ''}</span><span>An educational game, not clinical advice. Never use it for real patient care.${TERMS ? ' <button class="acct-link" data-act="terms">Terms</button>' : ''}${RV ? ` <button class="acct-link rv-${RV.status(caseId).state}" data-act="review">${esc(RV.status(caseId).label)}</button>` : ''}</span></div>
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
          <div class="muted">${esc(liveDef(d).dx)}</div>
          <div class="meta">${legal(d)}<span class="chip">${esc(liveDef(d).code)}</span><span class="chip ${/No known/.test(liveDef(d).allergies) ? '' : 'alert'}">Allergy: ${esc(liveDef(d).allergies.split(',')[0].split('(')[0])}</span><span class="chip">${E.clock(nv.t)}: T ${fT(nv.T)}, HR ${nv.HR}, BP ${nv.SBP}/${nv.DBP}, SpO₂ ${nv.SpO2}%</span></div></div></div>
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
          <button class="bs-h" data-act="h-go" data-i="${i}" aria-current="${cur}">${pface(p.id)}<span class="bs-who"><b>${p.room} ${esc(p.short)}</b><small>${esc(ageSex(p))}, ${esc(p.dx)}</small></span><span class="bs-st">${cur ? 'Reporting' : heard ? 'Heard' : 'Up next'}</span></button>
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
        if (m.available && !m.available(s, P)) return;   // a discontinued or replaced order is nobody's task
        if (m.due !== undefined && (st.status === 'due' || st.status === 'verify') && m.due <= s.t + 75) out.push({ pid: d.id, t: m.due, late: s.t > m.due + 60, text: `${d.room} ${m.name} ${m.dose}${st.status === 'verify' ? ', awaiting pharmacy' : ''}` });
      });
    });
    if (C().dueExtras) C().dueExtras(s, A()).forEach((x) => { if (!x.info) out.push(Object.assign({ pid: (x.text.match(/^\d{2,3}(?=\s)/) || [])[0] }, x)); });
    s.deleg.filter((x) => !x.done).forEach((x) => out.push({ pid: x.pid, t: x.due, late: false, text: `${cna().name}: ${C().delegation.tasks.find((t) => t.id === x.id).label.toLowerCase()}, ${x.pid}` }));
    pts().forEach((d) => { const P = s.p[d.id]; (gone(P) ? F.awayRows(s, A(), d, P) : flowRows(d, P)).filter((r) => !r.done && r.t !== null && (r.late || r.t <= s.t + 75)).forEach((r) => out.push({ pid: d.id, t: r.t, late: r.late, text: `${d.room} ${r.text}`, act: r.key === 'rp' ? 'report' : null })); });
    return out.sort((a, b) => a.t - b.t);
  }
  /* Your priority order: set at triage, re-rankable any time, shown everywhere. */
  function prioList() { const base = (s.prio || s.answers.rank || []).filter((id) => def(id) && here(def(id))); pts().forEach((d) => { if (!base.includes(d.id)) base.push(d.id); }); return base; }
  const prioN = (pid) => { if (!s.prio && !s.answers.rank) return null; const i = prioList().indexOf(pid); return i < 0 ? null : i + 1; };
  const ordinal = (n) => n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');
  const flagsFor = (pid) => s.brain.filter((k) => k.startsWith(pid + ':')).map((k) => def(pid).report[+k.split(':')[1]].text);
  const shortAllergy = (d) => (/No known/.test(liveDef(d).allergies) ? '' : `<span class="chip alert">Allergy: ${esc(liveDef(d).allergies.split(',')[0].split('(')[0].trim())}</span>`);
  const codeChip = (d) => (/^Full code/.test(liveDef(d).code) ? '' : `<span class="chip alert">${esc(liveDef(d).code.split(',')[0])}</span>`);

  /* The roster: who is who, why they're here, what you noted, where they sit on your list. */
  function ovRoster() {
    const inShift = ui.view === 'station' || ui.view === 'room', list = s.prio || s.answers.rank ? prioList() : C().patients.filter((d) => !d.arrives).map((d) => d.id);
    const pend = C().patients.filter((d) => !here(d));
    const card = (pid, i) => {
      const d = def(pid), P = s.p[pid], g = gone(P), fl = flagsFor(pid), n = prioN(pid);
      const due = inShift && !g ? brainRows(d, P).filter((r) => !r.done && !r.prog && r.t !== null && (r.late || r.t <= s.t + 30)) : [];
      return `<article class="ro ${g ? 'gone' : ''}">
        <div class="ro-h">${n ? `<span class="ro-n" title="Your priority">${n}<small>${ordinal(n)}</small></span>` : ''}${pface(pid)}<div class="ro-who"><b>${d.room} ${esc(d.name)}</b> <small>${ageSex(d)}</small><span>${esc(liveDef(d).dx)}</span></div>
          ${s.prio && inShift && !g ? `<span class="ro-mv"><button class="btn" data-act="prio" data-pid="${pid}" data-d="-1" aria-label="Move ${esc(d.short)} up" ${i === 0 ? 'disabled data-why="Already first."' : ''}>${ICON.up}</button><button class="btn" data-act="prio" data-pid="${pid}" data-d="1" aria-label="Move ${esc(d.short)} down" ${i === list.length - 1 ? 'disabled data-why="Already last."' : ''}>${ICON.down}</button></span>` : ''}</div>
        <p class="ro-why"><b>Here for</b> ${esc(d.reason)}</p>
        <div class="facts">${legal(d)}<span class="chip">${esc(liveDef(d).code.split(',')[0])}</span>${shortAllergy(d)}${inShift ? `<span class="chip ${P.seenAt === null ? 'warn' : ''}">${g ? esc(goneText(P)) : lastSeen(P)}</span>` : ''}${P.read && !g ? `<span class="chip read st-${P.read.st}">${esc(stName(P.read.st))}${trend(P)}</span>` : ''}${due.length ? `<span class="chip ${due.some((r) => r.late) ? 'alert' : 'warn'}">${due.length} due</span>` : ''}</div>
        ${fl.length ? `<ul class="ro-fl">${fl.map((f) => `<li><i class="flag-ic on" aria-hidden="true"></i>${esc(f)}</li>`).join('')}</ul>` : `<p class="ro-none">${ui.view === 'handoff' ? 'Nothing flagged yet.' : 'You flagged nothing from report.'}</p>`}
        ${inShift && g ? `<div class="ro-f"><button class="btn btn-primary" data-act="away" data-pid="${pid}">Follow up</button><button class="btn" data-act="chart" data-pid="${pid}">${ICON.chart}Chart</button></div>` : ''}
        ${inShift && !g ? `<div class="ro-f"><button class="btn btn-primary" data-act="goto" data-pid="${pid}">Go to ${d.room}</button><button class="btn" data-act="chart" data-pid="${pid}">${ICON.chart}Chart</button></div>` : ''}
      </article>`;
    };
    const body = `<p class="muted" style="margin-top:0">${s.prio ? 'In your priority order. Move patients up or down as the shift changes; this list isn\'t scored.' : 'Everyone you have today, with what you flagged in report.'}</p>
      <div class="ro-list">${list.map(card).join('')}${pend.map((d) => `<article class="ro pend"><div class="ro-h"><div class="pend-dot" aria-hidden="true"></div><div class="ro-who"><b>${d.room} ${esc(admWord(d))}</b><span>From ${esc(fromOf(d))}, about ${E.clock(d.arrives)}</span></div></div><p class="ro-why"><b>Coming for</b> ${esc(d.reason)}</p></article>`).join('')}</div>`;
    return sheet('Your patients', body, `<button class="btn btn-primary" data-act="close">Done</button>`, { wide: true, label: 'Your patients' });
  }

  function ptStrip() {
    const cur = ui.view === 'room' ? s.loc : 'station';
    return `<nav class="pstrip" aria-label="Station and patients"><div class="pstrip-in">
      ${(() => { const unread = s.inbox.filter((m) => !m.read).length, calls = (FL.open(s) || []).length, n = unread + calls; return `<button class="ps ps-st ${cur === 'station' ? 'on' : ''}" data-act="${cur === 'station' ? 'here' : 'back'}" ${cur === 'station' ? 'aria-current="page"' : ''} aria-label="Nurses' station${n ? `, ${unread ? unread + ' unread' : ''}${unread && calls ? ', ' : ''}${calls ? calls + ' call' + (calls > 1 ? 's' : '') + ' waiting' : ''}` : ''}"><span class="ps-top">${ICON.station}<b><span class="ps-wide">Nurses' station</span><span class="ps-narrow">Station</span></b>${n ? `<em class="${calls ? 'late' : ''}">${n}</em>` : ''}</span><small>Plan, phone, help</small></button>`; })()}<div class="ps-pts">
      ${C().patients.map((d) => {
        if (!here(d)) return `<button class="ps pend" data-act="pending" data-pid="${d.id}"><span class="ps-top"><b>${d.room}</b></span><small>Arriving ${E.clock(d.arrives)}</small></button>`;
        const P = s.p[d.id], g = gone(P), light = !g && (P.callLight || !!P.bell || s.inbox.some((m) => m.pid === d.id && m.urgent && !m.read));
        const rows = (g ? F.awayRows(s, A(), d, P) : brainRows(d, P)).filter((r) => !r.done && !r.prog && r.t !== null), late = rows.filter((r) => r.late).length, due = rows.filter((r) => !r.late && r.t <= s.t + 30).length;
        const tk = liveGhosts(d.id).length;
        const pn = prioN(d.id);
        return `<button class="ps ${cur === d.id ? 'on' : ''} ${light ? 'alert' : ''} ${g ? 'gone' : ''} ${tk ? 'ticked' : ''}" data-act="${g ? 'away' : cur === d.id ? 'here' : 'goto'}" data-pid="${d.id}" ${cur === d.id ? 'aria-current="page"' : ''} aria-label="Room ${d.room}, ${esc(d.name)}${g ? ', ' + esc(goneText(P)) + ', follow up' : ''}${late ? `, ${late} overdue` : due ? `, ${due} due` : ''}${light ? ', needs attention' : ''}"><span class="ps-top">${pn ? `<span class="ps-n" title="Your priority">${pn}</span>` : ''}<b>${d.room}</b>${P.read && !g ? `<i class="dot st-${P.read.st}" aria-hidden="true"></i>` : ''}${late ? `<em class="late">${late}</em>` : due ? `<em>${due}</em>` : ''}${tk ? `<span class="ps-tick" aria-hidden="true">✓</span>` : ''}</span><small>${esc(d.short)}</small><small class="ps-dx">${g ? esc(awayShort(P)) : esc(liveDef(d).dx)}</small></button>`;
      }).join('')}</div></div></nav>`;
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
    const acu = {};
    pts().forEach((d) => { const P = s.p[d.id], aw = gone(P); acu[d.id] = aw ? 0 : stRank(d.status(s, P, A())); (aw ? F.awayRows(s, A(), d, P) : brainRows(d, P)).forEach((r) => { if (!r.done && !r.prog && !r.info && r.t !== null && r.t <= s.t) out.push({ pid: d.id, key: r.key, text: r.text + (r.blocked ? ' (awaiting pharmacy)' : ''), late: !!r.late, t: r.t, away: aw, rp: r.key === 'rp', blocked: !!r.blocked, stat: !!r.stat }); }); });
    const pr = prioList(), now = (r) => (r.stat || acu[r.pid] >= 2 ? 1 : 0);
    // What the orientation teaches: something you can act on before something you're waiting on; new orders and
    // a patient who needs you now before anything routine; then overdue work, then the sicker patient, then the clock.
    return out.sort((a, b) => a.blocked - b.blocked || now(b) - now(a) || b.late - a.late || acu[b.pid] - acu[a.pid] || a.t - b.t || pr.indexOf(a.pid) - pr.indexOf(b.pid));
  }
  function nextKnown() {
    let best = null; const put = (t, text) => { if (t > s.t && (!best || t < best.t)) best = { t, text }; };
    pts().forEach((d) => { const P = s.p[d.id]; (gone(P) ? F.awayRows(s, A(), d, P) : brainRows(d, P)).forEach((r) => { if (!r.done && r.t !== null) put(r.t, r.prog ? r.text : `${d.room} ${r.text}`); }); });
    C().patients.forEach((d) => { if (!here(d)) put(d.arrives, `${d.room} ${admWord(d).toLowerCase()} from ${fromOf(d)}`); });
    put(C().length - 60, 'Report hour begins'); put(C().length, 'End of shift');
    return best;
  }
  const rowLabel = (r) => (r.away ? `${def(r.pid).short}: ` : `${def(r.pid).room} `) + r.text;
  const FLAVOR = {
    med: ['Charting vitals and I&Os', 'Restocking the supply cart', 'Returning pages', 'Checking tomorrow\'s lab orders', 'A sip of cold coffee', 'Scanning the telemetry board'],
    psych: ['Charting behavior checks', 'A walk through the milieu', 'Returning a call from a board-and-care', 'Updating the treatment plan', 'A sip of cold coffee', 'Counting sharps with the tech'],
    ob: ['Charting fundal checks and lochia', 'Restocking pads and peri bottles', 'Answering the infant security alarm test', 'Logging feeds and diapers', 'A sip of cold coffee', 'Calling the lactation consultant back'],
    ed: ['Charting triage notes', 'Restocking the trauma bay', 'Returning a call from radiology', 'Checking the lobby board', 'A sip of cold coffee', 'Cleaning a stretcher for the next patient'],
    peds: ['Charting intake and output', 'Restocking syringes and diapers', 'Returning a page from pharmacy', 'Weighing diapers', 'A sip of cold coffee', 'Checking pump volumes'],
  };
  function goalSub(x) {
    const L = C().length;
    if (x.st === 'done') return x.id === 'meds' ? 'None late' : x.id === 'calls' ? 'All answered' : 'Done';
    if (x.st === 'fail') return x.id === 'meds' ? `${x.n} late` : x.id === 'calls' ? `${x.n} missed` : x.id === 'eyes' ? `${x.n} of ${x.of} in time` : `${x.n} of ${x.of} given`;
    if (x.id === 'eyes') return `${x.n} of ${x.of} seen, due by ${E.clock(90)}`;
    if (x.id === 'report') return s.t >= L - 60 ? `${x.n} of ${x.of} given` : `Opens ${E.clock(L - 60)}`;
    return 'So far, so good';
  }
  function goalsHTML(g, cls) { return `<div class="goals ${cls || ''}" role="list" aria-label="Shift goals">${g.map((x) => `<span role="listitem" class="goal ${x.st}" title="${esc(x.sub)}"><i aria-hidden="true">${x.st === 'done' ? '✓' : x.st === 'fail' ? '✕' : ''}</i><span><b>${esc(x.label)}</b><small>${esc(goalSub(x))}</small></span></span>`).join('')}</div>`; }
  /* Stuck players. Real time: 45 seconds with no input while work is waiting shows a pointer to the next step.
     Game time: falling well behind brings a free check-in from Nova (it doesn't use up a tip). */
  let idleT = null;
  function armIdle() { if (ui.stuck) { ui.stuck = false; } clearTimeout(idleT); idleT = setTimeout(idleCheck, 45000); }
  function idleCheck() {
    if (!s || s.ended || ui.ov || document.hidden || (ui.view !== 'station' && ui.view !== 'room') || !nowRows().length) return;
    ui.stuck = true; render();
    const g = document.querySelector('.cmd-go'); if (g && !reduced()) g.classList.add('nudge');
  }
  function stuckTip(where) {
    if (!ui.stuck || !s || s.ended) return '';
    const rows = nowRows(), top = (where === 'room' && rows.find((r) => r.pid === s.loc && !r.blocked)) || rows[0]; if (!top) return '';
    if (where === 'station') return `<div class="stuck-tip" role="status"><p><b>Not sure where to start?</b> Tap the task above. It walks you to ${top.away ? 'the follow-up' : 'the room'} and the right tab.${s.nova ? ' Nova can also point you somewhere.' : ''}</p>${s.nova ? '<button class="btn" data-act="nova">Ask Nova</button>' : ''}</div>`;
    const d = def(s.loc), mine = top.pid === d.id;
    return `<div class="stuck-tip" role="status"><p>${mine ? `<b>Next here:</b> ${esc(top.text)}. ${ui.dock === 'brain' ? 'Tap it in the list below.' : 'Open the Brain tab: it lists this patient\'s tasks, overdue first.'}` : `<b>Done in here?</b> ${esc(def(top.pid).room)} needs you next: ${esc(top.text)}.`}</p>${mine ? (ui.dock === 'brain' ? '' : '<button class="btn" data-act="dock" data-id="brain">Brain</button>') : `<button class="btn" data-act="${top.away ? 'away' : top.rp ? 'report' : 'goto'}" data-pid="${top.pid}">Go</button>`}</div>`;
  }
  function stuckCheck() {
    if (!s || s.ended || (ui.view !== 'station' && ui.view !== 'room')) return;
    const late = nowRows().filter((r) => r.late && !r.blocked);
    s.help = s.help || { n: 0, at: -999, skips: 0 };
    const H = s.help, behind = late.length >= 3 || (late.length >= 1 && H.skips >= 2);
    if (!behind || H.n >= 2 || s.t - H.at < 40 || s.t < 40 || s.t > C().length - 25) return;
    H.n += 1; H.at = s.t; H.skips = 0;
    let tip = ''; try { tip = C().novaHint ? C().novaHint(s, A()) : ''; } catch (e) { tip = ''; }
    const first = late[0], d = def(first.pid);
    const lead = late.length >= 3 ? `${late.length} tasks are overdue. It happens to everyone. Pick one room and finish it before you move on.` : 'Skipping ahead won\'t make the overdue work go away. Deal with it first.';
    A().msg({ from: 'nova', pid: first.away ? undefined : first.pid, help: true, text: `${lead} I'd start with ${d.room}: ${first.text.toLowerCase()}.${tip ? ' One more thing to keep in mind: ' + tip : ''} (This one's free. It doesn't use one of your tips.)`, replies: [{ label: `Go to ${d.room}`, act: first.away ? 'away' : 'goto', pid: first.pid }] });
  }
  // Caught up: point at the patient nobody has looked at for longest. Quiet time is reassessment time.
  function suggestIdle() {
    let best = null;
    pts().forEach((d) => { const P = s.p[d.id]; if (gone(P)) return; const last = Math.max(P.seenAt === null ? -999 : P.seenAt, P.touchAt === undefined ? -999 : P.touchAt); if (s.t - last >= 45 && (!best || last < best.last)) best = { pid: d.id, last, d }; });
    if (!best) return null;
    const d = best.d, P = s.p[d.id];
    return { pid: d.id, text: P.seenAt === null ? `Nobody's waiting on you. You haven't seen ${d.short} yet.` : `Nobody's waiting on you. ${d.short} hasn't seen you since ${E.clock(best.last)}: a good time to look again.`, go: `Go to ${d.room}` };
  }
  function cmdBar() {
    const now = nowRows(), nx = nextKnown(), open = FL.open(s), top = now[0];
    // One next step, and a count you can live with: rooms waiting, not every line item.
    const rooms = new Set(now.map((r) => r.pid)).size, lateN = now.filter((r) => r.late && !r.blocked).length;
    const head = now.length === 1 ? 'One thing needs you' : rooms === 1 ? `${now.length} things in one room` : `Work waiting in ${rooms} rooms`;
    const tail = now.length > 1 ? `<small class="cmd-sub">${now.length} tasks due${lateN ? ` · <em>${lateN} overdue</em>` : ''}. Start with this one:</small>` : '';
    const idle = suggestIdle();
    const status = top ? `<div class="cmd-st busy ${lateN >= 3 ? 'behind' : ''}"><span class="cmd-n" aria-hidden="true">${now.length === 1 ? 1 : rooms}</span><div><b>${head}</b>${tail}<button class="cmd-go" data-act="${top.rp ? 'report' : top.away ? 'away' : 'goto'}" data-pid="${top.pid}">${top.late && !top.blocked ? '<em>Overdue</em> ' : ''}${esc(rowLabel(top))} <span aria-hidden="true">›</span></button></div></div>`
      : `<div class="cmd-st clear"><span class="cmd-ok" aria-hidden="true">${ICON.tick}</span><div><b>You're caught up</b>${idle ? `<small>${esc(idle.text)}</small><button class="cmd-go" data-act="goto" data-pid="${idle.pid}">${esc(idle.go)} <span aria-hidden="true">›</span></button>` : '<small>Skip ahead. The clock runs until something needs you.</small>'}</div></div>`;
    const calls = open.map((x) => { const v = FL.view(s, C(), x.id), w = who(v.from), left = Math.max(0, x.exp - s.t), pct = left / Math.max(1, x.exp - x.at); return `<button class="fcall ${pct < .4 ? 'hurry' : ''}" data-act="floor" data-id="${x.id}">${faceOf(v.from)}<span class="fc-l"><b>${esc(v.title)}</b><small>${esc(w.name)}${w.role ? ', ' + esc(w.role) : ''}</small></span><span class="fc-ring" style="--p:${pct.toFixed(2)}" aria-label="${left} minutes left"><i>${left}</i><small>min</small></span></button>`; }).join('');
    const skip = `<button class="btn skip ${top ? '' : 'ready'}" data-act="skip" title="Moves the clock forward. It stops the moment a message, task or patient needs you.">${ICON.ff}<span><b>Skip ahead in time</b><small>${nx ? `Fast-forward to ${E.clock(nx.t)}: ${esc(nx.text)}` : 'Fast-forward up to 30 min; stops if anything needs you'}</small></span></button>`;
    return `<section class="cmd" aria-label="Right now"><div class="cmd-row">${status}${skip}</div>${stuckTip('station')}${calls ? `<div class="fcalls"><h4>Floor calls <span>Someone on the unit needs you</span></h4>${calls}</div>` : ''}${goalsHTML(RW.goals(s, C(), A()))}</section>`;
  }
  /* Let time pass: the clock runs minute by minute and stops the moment something needs you. */
  function skipAhead() {
    if (!s || s.ended) return;
    s.help = s.help || { n: 0, at: -999, skips: 0 };
    if (nowRows().some((r) => r.late && !r.blocked)) s.help.skips += 1; else s.help.skips = 0;
    const t0 = s.t, f0 = s.fresh.length, base = new Set(nowRows().map((r) => r.pid + '|' + r.key)), arr = pts().length, dl = s.deleg.filter((x) => x.done).length, L = C().length;
    const why = spend(Math.min(30, L - s.t), null, (ss) => {
      if (ss.fresh.length > f0) { const m = ss.inbox.find((x) => x.id === ss.fresh[ss.fresh.length - 1]); if (m) return { pid: m.pid, from: m.from, text: m.text, urgent: m.urgent }; }
      if (pts().length > arr) { const d = pts()[pts().length - 1]; return { pid: d.id, text: d.arrivedText || `${d.room} ${d.name} is up from the ED.` }; }
      if (!cnaAway() && ss.deleg.filter((x) => x.done && !x.dropped).length > dl) return { from: C().cna || 'luis', text: `${cna().name} is back and free.` };
      const nk = nowRows().find((r) => !base.has(r.pid + '|' + r.key)); if (nk) return { pid: nk.pid, text: `${rowLabel(nk)}: due now` };
      if (ss.t === L - 60) return { from: 'nova', text: 'One hour left. Start thinking about report.' };
      if (ss.t === L - 30) return { from: 'nova', text: 'Thirty minutes to handoff.' };
      return null;
    });
    ui.ff = { t0, t1: s.t, why: why || (s.ended ? { text: 'That\'s the shift.' } : (nowRows().some((r) => r.late && !r.blocked) ? { text: 'Half an hour went by. The overdue work is still waiting for you.', urgent: true } : { text: 'A quiet half hour. Nothing new came up.' })) };
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
    const doors = C().patients.map((d) => { const P = s.p[d.id]; if (!here(d)) return { pid: d.id, room: d.room, pending: true, eta: E.clock(d.arrives), label: admWord(d) }; const light = !gone(P) && (P.callLight || !!P.bell || s.inbox.some((m) => m.pid === d.id && m.urgent && !m.read)); return { pid: d.id, room: d.room, name: d.name, light, gone: gone(P), alert: light ? 'needs attention' : '' }; });
    const pending = C().patients.filter((d) => !here(d));
    const due = dueList();
    return `<main>
      <div class="st-intro"><h1>Nurses' station</h1><p>Your home base between rooms.<span class="long"> Plan who's next, read the phone, ask ${esc(cna().name)} or the doctor for help, and skip ahead when nothing needs you.</span> <b>Tap a door or a patient to walk to their room.</b></p></div>
      ${cmdBar()}
      <div class="hall-wrap">${A_.hallway(s, doors)}</div>
      <div class="station">
        <section class="board" aria-labelledby="bh">
          <div class="board-h"><h2 id="bh">Assignment</h2>${s.prio ? `<button class="btn btn-quiet" data-act="roster" style="font-size:.85rem">Change order</button>` : ''}</div>
          ${prioList().map(def).map((d) => { const P = s.p[d.id], n = prioN(d.id); const v = A().lastVitals(d.id); const flags = s.brain.filter((k) => k.startsWith(d.id + ':')).length; return `<div class="pt-row tap ${gone(P) ? 'gone' : ''}" data-act="${gone(P) ? 'away' : 'goto'}" data-pid="${d.id}">
            <span class="pr-n" aria-label="Your priority ${n || ''}">${n || ''}</span>${pface(d.id)}
            <div><div class="nm">${d.room} ${esc(d.name)}<small>${ageSex(d)}</small></div><div class="dx">${esc(liveDef(d).dx)}</div><div class="why">Here for ${esc(lcFirst(d.reason).slice(0, 1) + d.reason.slice(1))}</div>
            <div class="facts">${legal(d)}${/^Full code/.test(liveDef(d).code) ? '' : `<span class="chip alert">${esc(liveDef(d).code.split(',')[0])}</span>`}${/No known/.test(liveDef(d).allergies) ? '' : `<span class="chip alert">Allergy</span>`}<span class="chip ${P.seenAt === null && !gone(P) ? 'warn' : ''}">${gone(P) ? esc(goneText(P)) : lastSeen(P)}</span>${gone(P) && P.out ? `<span class="chip af-${P.out.spec.course[P.out.known].st}">${esc(awayShort(P))}</span>` : ''}${P.bell && !gone(P) ? '<span class="chip alert">Call light</span>' : ''}${P.read && !gone(P) ? `<span class="chip read st-${P.read.st}">${esc(stName(P.read.st))}${trend(P)}</span>` : ''}${v && !gone(P) ? `<span class="chip">Last vitals ${E.clock(v.t)}</span>` : ''}${flags ? `<span class="chip">${flags} flagged</span>` : ''}</div></div>
            <div class="go">${gone(P) ? (() => { const n = F.awayRows(s, A(), d, P).filter((r) => !r.done).length; return `<button class="btn ${n ? 'btn-primary' : ''}" data-act="away" data-pid="${d.id}">Follow up${n ? ` (${n})` : ''}</button>`; })() : `<button class="btn btn-primary" data-act="goto" data-pid="${d.id}">Go to ${d.room}</button>`}<button class="btn" data-act="chart" data-pid="${d.id}">${ICON.chart}Chart</button></div>
          </div>`; }).join('')}
          ${pending.map((d) => `<div class="pt-row pending tap" data-act="pending" data-pid="${d.id}"><div class="pend-dot" aria-hidden="true"></div><div><div class="nm">${d.room} ${esc(admWord(d))}</div><div class="dx">From ${esc(fromOf(d))}, expected about ${E.clock(d.arrives)}. ${esc(d.reason)}.</div></div></div>`).join('')}
          <div class="board-h" style="border-top:1px solid var(--line)"><h2>Unit brain</h2><span class="muted" style="font-size:.82rem">Due across your patients</span></div>
          ${due.length ? dueGroups(due) : '<p class="empty">Nothing due in the next hour.</p>'}
        </section>
        <aside class="side">
          ${phone(8)}
          <div class="tools">
            ${(() => { const n = aideSuggest().length; return `<button class="btn ${n ? 'has-sug' : ''}" data-act="delegate"><b>${cnaAway() ? esc(cna().name) : `Ask ${esc(cna().name)}`}</b><small>${cnaAway() ? esc(cnaAway()) : n ? `${n} thing${n === 1 ? '' : 's'} ${esc(cna().name)} can take now` : `Delegate to the ${esc(/^[A-Z]{2,}/.test(cna().role) ? cna().role : cna().role.toLowerCase())}`}</small></button>`; })()}
            <button class="btn" data-act="callpick"><b>Call ${esc(prov().name)}</b><small>${prov().role ? esc(prov().role) + ", " : ""}SBAR, 6 min</small></button>
            ${s.t >= C().length - 60 ? (() => { const L = pts().filter((x) => !gone(s.p[x.id])), n = L.filter((x) => s.report && s.report[x.id]).length; if (!L.length) return ''; return `<button class="btn ${n < L.length ? 'btn-primary' : ''}" data-act="report" style="grid-column:1/-1"><b>${n < L.length ? `Give report to ${esc(oncoming().name)}` : `Report given to ${esc(oncoming().name)}`}</b><small>${n} of ${L.length} patients · 2 min each</small></button>`; })() : ''}
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
      ${m.replies && !m.done ? `<div class="rep">${m.replies.map((r, i) => `<button class="btn" data-act="reply" data-m="${m.id}" data-i="${i}">${esc(r.label)}</button>`).join('')}</div>` : m.pid && def(m.pid) && here(def(m.pid)) && !(ui.view === 'room' && s.loc === m.pid) ? `<span class="msg-go" aria-hidden="true">${gone(s.p[m.pid]) ? 'Follow up on' : 'Go to'} ${esc(def(m.pid).room)} ›</span>` : ''}</div></div>`;
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
    return `<div class="rv"><span class="res-cl">${title || 'Why it matters'}</span>${list.map((j, i) => `<div class="rv-i ${j.delta > 0 ? 'good' : j.delta < 0 ? 'bad' : 'neutral'}" style="--i:${i}"><span class="rv-ic" aria-hidden="true">${j.delta > 0 ? '✓' : j.delta < 0 ? '!' : '•'}</span><div><span class="rv-k">${j.delta > 0 ? 'Good call' : j.delta < 0 ? 'Rethink' : 'Note'} · ${esc(DOM[j.domain] || j.domain)}${CJ ? `<span class="rv-cj" title="The NCLEX clinical judgment step this decision tests">NCLEX: ${esc((CJ.STEPS.find((x) => x[0] === CJ.step(j)) || [])[1] || '')}</span>` : ''}</span><b>${esc(j.text)}</b><p>${esc(j.why)}</p></div>${j.delta ? `<span class="rv-pts ${j.delta > 0 ? 'up' : 'dn'}">${j.delta > 0 ? '+' : ''}${j.delta}</span>` : '<span></span>'}</div>`).join('')}</div>`;
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
  const tabFor = (text) => (/glucose|BG\b/i.test(text) ? 'care' : /weigh|weight|scan/i.test(text) ? 'care' : /neuro|POSS|sedation|vital|mental|assess/i.test(text) ? 'assess' : null);
  // A task the case didn't route: send it to the tab whose action shares the most words with it, so every due task is tappable.
  function paneFor(d, P, text) {
    const w = text.toLowerCase().split(/[^a-z]+/).filter((x) => x.length > 3), Ax = A();
    const score = (label) => w.filter((x) => label.toLowerCase().includes(x)).length;
    let best = null, bs = 0;
    // The action whose name best matches the task wins; a care action wins a tie, since it's usually the one written for that task.
    (d.interventions || []).filter((x) => !x.avail || x.avail(s, P, Ax)).forEach((x) => { const n = score(x.label); if (n > bs) { bs = n; best = 'care'; } });
    SYS.forEach(([id, label]) => { if (id === 'full') return; const n = score(sysL(id, label)); if (n > bs) { bs = n; best = 'assess'; } });
    (d.comms || []).filter((x) => !x.avail || x.avail(s, P, Ax)).forEach((x) => { const n = score(x.label); if (n > bs) { bs = n; best = 'talk'; } });
    (d.meds || []).filter((m) => !m.available || m.available(s, P)).forEach((m) => { const n = score(m.name); if (n > bs) { bs = n; best = 'meds'; } });
    if (best) return best;
    return tabFor(text) || (/call|page|notify|update|family|provider|SBAR/i.test(text) ? 'talk' : /med|dose|give/i.test(text) ? 'meds' : 'care');
  }
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
  // Systems documented this shift, counted the same way everywhere: each body system, plus vitals you took yourself.
  const sysCount = (P) => Object.keys(P.assessAt || {}).length + (P.vit.some((v) => v.by === 'You') ? 1 : 0);
  function brainRows(d, P) {
    if (RC && RC.has(d.id)) return RC.get(d.id);
    const out = brainRows0(d, P); if (RC) RC.set(d.id, out); return out;
  }
  function brainRows0(d, P) {
    const rows = [];
    // Shift assessment: every patient needs one, early.
    const sysDone = sysCount(P);
    rows.push({ key: 'sa', t: 0, late: s.t > 90 && sysDone < 3, done: sysDone >= 3, sys: 'full', text: 'Shift assessment', sub: sysDone >= 3 ? `${sysDone} systems documented` : sysDone ? `${sysDone} of 3+ systems documented` : 'Nothing documented yet', go: { act: 'dock', id: 'assess' } });
    const off = gone(P);   // transferred: their scheduled work went with them
    if (off) rows.pop();
    // A patient who needs you now always has something on the list, even when nothing is scheduled: look, then act.
    if (!off && d.status(s, P, A()) === 'urgent') {
      const mine = [P.vit.filter((v) => v.by === 'You').map((v) => v.t), Object.values(P.assessAt || {})].flat(), lastLook = mine.length ? Math.max(...mine) : -999;
      const alert = s.inbox.find((m) => m.pid === d.id && m.urgent && s.t - m.t <= 60), fresh = s.t - lastLook <= 15;
      rows.push({ key: 'urg', t: s.t, late: false, stat: true, text: fresh ? `Needs you now: you assessed at ${E.clock(lastLook)}. Act on it` : 'Needs you now: assess and act', sub: fresh ? 'Treat what you can at the bedside (Care), and call for what you can\'t (Talk & call).' : alert ? clip(alert.text, 110) : 'Look at the patient, take vital signs, then decide what to do and who to call.', ...(() => { if (!fresh) return { go: { act: 'dock', id: 'assess' }, sys: 'vitals', hl: 'Vital signs' }; const Ax = A(), u = (d.interventions || []).find((x) => (!x.avail || x.avail(s, P, Ax)) && (x.urgent || /juice|d50|brady/.test(x.id))); return u ? { go: { act: 'dock', id: 'care' }, hl: u.label } : { go: { act: 'dock', id: 'talk' }, hl: 'Call SBAR' }; })() });
    }
    (d.meds || []).forEach((m) => {
      const st = s.meds[m.id];
      if (m.available && !m.available(s, P)) return;
      if (off && st.status !== 'given' && st.status !== 'held') return;
      if (m.later) { rows.push({ t: null, later: m.later, text: `${m.name} ${m.dose} ${m.route}`, sub: `Due at ${m.later}` }); return; }
      if (m.due === undefined || m.prn) return;
      if (st.status === 'given' || st.status === 'held') rows.push({ key: 'm:' + m.id, t: st.at, done: true, text: `${m.name} ${m.dose} ${m.route}`, sub: `${st.status === 'given' ? 'Given' : 'Held'} ${E.clock(st.at)}` });
      else if (m.initStatus === 'given') return;
      else rows.push({ key: 'm:' + m.id, t: m.due, late: s.t > m.due + 60, text: `${m.name} ${m.dose} ${m.route}`, sub: st.status === 'verify' ? 'Awaiting pharmacy: it can\'t be given until it\'s released' : m.freq, blocked: st.status === 'verify', go: { act: 'med', id: m.id } });
    });
    if (C().dueExtras) C().dueExtras(s, A()).forEach((x) => { if ((x.text.match(/^\d{2,3}(?=\s)/) || [])[0] !== d.id) return; const tx = x.text.replace(/^\d{2,3}\s*/, ''); if (x.info) { rows.push({ key: 'x:' + tx, t: x.t, late: false, info: true, text: tx, sub: 'Heads-up: nothing to do yet' }); return; } const tab = x.tab || (x.sys ? 'assess' : paneFor(d, P, tx)); rows.push({ key: 'x:' + tx, t: x.t, late: x.late, text: tx, sys: x.sys, hl: x.hl, go: tab ? { act: 'dock', id: tab } : null }); });
    // Anything a provider ordered that the nurse carries out ("Draw blood cultures × 2 (ordered)") is a task, not just a button.
    if (!off) {
      const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(), have = rows.map((r) => norm(r.text || '')), Ax = A();
      const ordT = (P.orders || []).filter((o) => o.isNew).reduce((m, o) => Math.max(m, o.t), -Infinity);
      (d.interventions || []).filter((x) => /\(ordered\)$/.test(x.label) && (!x.avail || x.avail(s, P, Ax))).forEach((x) => {
        const tx = x.label.replace(/\s*\(ordered\)$/, ''), n = norm(tx); if (have.some((h) => h === n || h.startsWith(n.slice(0, 14)) || n.startsWith(h.slice(0, 14)))) return;
        const t = Number.isFinite(ordT) ? Math.max(0, ordT) : 0;
        rows.push({ key: 'o:' + x.id, t, stat: true, late: s.t > t + (x.urgent ? 10 : 30), text: tx, sub: 'Ordered: yours to do', hl: x.label, go: { act: 'dock', id: 'care' } });
      });
    }
    s.deleg.filter((x) => !x.done && x.pid === d.id).forEach((x) => rows.push({ key: 'd:' + x.id + ':' + x.at, at: x.at, t: x.due, prog: true, text: `${cna().name}: ${C().delegation.tasks.find((t) => t.id === x.id).label.toLowerCase()}`, sub: `In progress, back about ${E.clock(x.due)}` }));
    return rows.concat(flowRows(d, P));
  }
  /* Unit-wide work every patient generates: call lights, rounds, PRN follow-up, report. */
  function flowRows(d, P) {
    if (gone(P)) return [];
    const rows = [], Ax = A();
    if (P.bell) rows.push({ key: 'bell:' + P.bell.at, t: P.bell.at, late: s.t > P.bell.at + 10, text: `Call light: ${P.bell.who} ${F.kindOf(C()) === 'psych' ? 'is asking ' : ''}${P.bell.text}`, sub: P.bell.cnaAt ? `${cna().name} is on it` : P.bell.cna ? `${cna().name} could take this` : 'Needs a nurse', go: { act: 'bell', id: d.id }, prog: !!P.bell.cnaAt });
    F.prnRows(s, Ax, d, P).forEach((r) => rows.push(r));
    F.watchRows(s, Ax, d, P).forEach((r) => rows.push(r));
    F.errRows(s, Ax, d, P, prov(d.id).name).forEach((r) => rows.push(r));
    const rd = F.roundRow(s, Ax, d, P); if (rd && !P.bell) rows.push(rd);
    if (s.t >= C().length - 45) { const rp = s.report && s.report[d.id]; rows.push({ key: 'rp', t: C().length - 30, late: s.t > C().length - 10 && !rp, done: !!rp, text: `Give report to ${oncoming().name}`, sub: rp ? `Given ${E.clock(rp.t)}` : 'At the station', go: { act: 'report', id: d.id } }); }
    return rows;
  }
  const oncoming = () => staff(F.oncoming(C()));
  function awayShort(P) { const o = P.out; if (!o) return goneText(P); const e = o.spec.course[o.known]; return `${o.spec.unit} · ${F.ST[e.st]}`; }
  function paneBrain(d, P) {
    const rows = brainRows(d, P);
    const open = rows.filter((r) => !r.done && !r.prog && r.t !== null);
    const ord = (L) => L.sort((a, b) => !!a.blocked - !!b.blocked || !!b.stat - !!a.stat || a.t - b.t);
    const over = ord(open.filter((r) => r.late && !r.info)), now = ord(open.filter((r) => !r.late && !r.info && r.t <= s.t + 30)), soon = open.filter((r) => r.info || (!r.late && r.t > s.t + 30));
    const later = rows.filter((r) => r.t === null), prog = rows.filter((r) => r.prog);
    const doneLog = s.log.filter((l) => l.pid === d.id && (l.kind === 'find' || l.kind === 'act') && !/^You: "/.test(l.text)).slice().reverse();
    const shown = ui.brainAll ? doneLog : doneLog.slice(0, 5);
    const row = (r, cls) => { const inner = `${cls === 'prog' ? `<span class="b-prog" aria-hidden="true"><i style="width:${Math.min(100, Math.max(4, (s.t - r.at) / Math.max(1, r.t - r.at) * 100)).toFixed(0)}%"></i></span>` : ''}<span class="b-tm">${r.t === null ? esc(r.later) : E.clock(Math.max(r.t, 0))}</span><span class="b-tx"><b>${esc(r.text)}</b>${r.sub ? `<small>${esc(r.sub)}</small>` : ''}</span><span class="b-st">${cls === 'over' ? 'Overdue' : cls === 'now' ? (r.t > s.t ? `In ${Math.round(r.t - s.t)} min` : 'Due') : cls === 'soon' ? 'Upcoming' : cls === 'prog' ? 'In progress' : cls === 'later' ? 'Later' : ''}</span>${r.go ? '<span class="b-go" aria-hidden="true">›</span>' : '<span></span>'}`;
      return r.go ? `<li><button class="b-row ${cls}" data-act="${r.go.act}" data-id="${r.go.id}"${r.go.act === 'dock' ? ` data-hl="${esc(r.hl || r.text)}"${r.sys ? ` data-sys="${esc(r.sys)}"` : ''}` : ''}>${inner}</button></li>` : `<li><div class="b-row ${cls} static">${inner}</div></li>`; };
    const grp = (title, list, cls) => (list.length ? `<div class="b-grp ${cls}"><h4>${title}<span>${list.length}</span></h4><ul>${list.map((r) => row(r, cls)).join('')}</ul></div>` : '');
    const flags = s.brain.filter((k) => k.startsWith(d.id + ':')).map((k) => d.report[+k.split(':')[1]].text);
    let h = ghostList(d.id);
    if (!over.length && !now.length) h += '<p class="b-clear">Nothing overdue or due right now for this patient.</p>';
    h += grp('Overdue', over, 'over') + grp(now.some((r) => r.t > s.t) ? 'Due now or in the next 30 min' : 'Due now', now, 'now') + grp('In progress', prog, 'prog') + grp('Coming up', soon, 'soon') + grp('Later today', later, 'later');
    if (flags.length) h += `<div class="b-grp flags"><h4>From report<span>${flags.length}</span></h4><ul>${flags.map((f) => `<li><div class="b-flag"><i class="flag-ic on" aria-hidden="true"></i><span>${esc(f)}</span></div></li>`).join('')}</ul></div>`;
    h += `<div class="b-grp done"><h4>Done this shift<span>${doneLog.length}</span></h4>${doneLog.length ? `<ul>${shown.map((l) => `<li><div class="b-row done static"><span class="b-tm">${E.clock(l.t)}</span><span class="b-tx"><b>${esc(l.label || clip(l.text.split(/[.:](?=\s|$)/)[0], 70))}</b>${l.label ? `<small>${esc(clip(l.text, 110))}</small>` : ''}</span><span class="b-st">${ICON.tick}</span><span></span></div></li>`).join('')}</ul>${doneLog.length > 5 ? `<button class="btn btn-quiet b-more" data-act="brain-all">${ui.brainAll ? 'Show fewer' : `Show all ${doneLog.length}`}</button>` : ''}` : '<p class="b-empty">Nothing yet. Start with what you see.</p>'}</div>`;
    return h;
  }
  const stamped = (label) => !!(ui.stampRow && ui.stampRow.label === label && Date.now() - ui.stampRow.born < 2200);
  const lastFind = (pid, label) => { const l = s.log.slice().reverse().find((x) => x.pid === pid && x.label === label); return l || null; };
  function paneAssess(d, P) {
    return `<ul class="fs">${SYS.map(([id, label, c]) => {
      const L = sysL(id, label), at = id === 'vitals' ? (P.vit.filter((v) => v.by === 'You').pop() || {}).t : id === 'full' ? null : P.assessAt[id];
      const lf = id === 'full' ? null : lastFind(d.id, id === 'vitals' ? 'Vital signs' : L);
      return `<li><button class="fs-row ${at !== undefined && at !== null ? 'has' : ''} ${stamped(L) ? 'stamped' : ''}" style="${stamped(L) ? `--gd:-${Date.now() - ui.stampRow.born}ms` : ''}" data-act="assess" data-sys="${id}"><span class="fs-l"><b>${esc(L)}</b>${lf ? `<small>${esc(clip(lf.text, 120))}</small>` : `<small>${id === 'full' ? 'Every system, one after another' : 'Not documented this shift'}</small>`}</span><span class="fs-t">${at !== undefined && at !== null ? `${ICON.tick}${E.clock(at)}` : ''}</span><span class="fs-c">${c} min</span></button></li>`;
    }).join('')}</ul>`;
  }
  const RISKY = /restrain|seclu|stop the (insulin|pca)|stop the infusion|straight cath|massage|search his room|1:1|pause the insulin|release/i;
  const ROUND = { ld: ['Labor round', 'Strip through a few contractions, position, comfort, ice chips, partner'], med: ['Hourly round', 'Pain, position, bathroom, things in reach'], psych: ['Check-in round', 'Face to face, room safety scan, needs'], peds: ['Hourly round', 'Comfort, IV site, rails, parent needs'], ob: ['Hourly round', 'Fundus, pad, pain, bathroom, baby on their back'], ed: ['Hourly round', 'Pain, what they\'re waiting on, things in reach'] };
  function paneCare(d, P) {
    const Ax = A(), list = (d.interventions || []).filter((x) => !x.avail || x.avail(s, P, Ax)), rd = ROUND[F.kindOf(C())], last = F.roundRow(s, Ax, d, P);
    const top = `${P.bell ? `<li><button class="fs-row urgent" data-act="bell" data-id="${d.id}"><span class="fs-l"><b>Answer the call light</b><small>${esc(P.bell.who)} ${F.kindOf(C()) === 'psych' ? 'is asking ' : ''}${esc(P.bell.text)} · since ${E.clock(P.bell.at)}</small></span><span class="fs-t"></span><span class="fs-c">2 min</span></button></li>` : ''}<li><button class="fs-row ${last && last.late ? 'due' : ''} ${stamped(rd[0]) ? 'stamped' : ''}" style="${stamped(rd[0]) ? `--gd:-${Date.now() - ui.stampRow.born}ms` : ''}" data-act="round" data-id="${d.id}"><span class="fs-l"><b>${rd[0]}</b><small>${rd[1]}${P.roundAt !== undefined ? ` · last ${E.clock(P.roundAt)}` : ''}</small></span><span class="fs-t">${P.roundAt !== undefined ? `${ICON.tick}${E.clock(P.roundAt)}` : ''}</span><span class="fs-c">2 min</span></button></li>`;
    if (!list.length) return `<ul class="fs">${top}</ul>`;
    return `<ul class="fs">${top}${list.map((x) => { const lf = lastFind(d.id, x.label), risky = RISKY.test(x.label + ' ' + x.id); return `<li><button ${risky ? `data-hold="1" data-hk="int:${x.id}"` : ''} class="${risky ? 'holdbtn ' : ''}fs-row ${x.urgent || /juice|d50|brady/.test(x.id) ? 'urgent' : ''} ${lf ? 'has' : ''} ${stamped(x.label) ? 'stamped' : ''}" style="${stamped(x.label) ? `--gd:-${Date.now() - ui.stampRow.born}ms` : ''}" data-act="int" data-id="${x.id}"> ${risky ? '<i class="hold-fill" aria-hidden="true"></i>' : ''}<span class="fs-l"><b>${esc(x.label)}</b>${risky ? '<small class="hold-note">Press and hold, or tap twice, to commit</small>' : ''}${lf ? `<small>Last: ${esc(clip(lf.text, 100))}</small>` : ''}</span><span class="fs-t">${lf ? `${ICON.tick}${E.clock(lf.t)}` : ''}</span><span class="fs-c">${x.cost} min</span></button></li>`; }).join('')}</ul>`;
  }
  function paneMeds(d, P) {
    const meds = (d.meds || []).filter((m) => !m.available || m.available(s, P));
    const sched = meds.filter((m) => !m.prn), prn = meds.filter((m) => m.prn);
    const row = (m) => { const st = medStatus(m), off = m.later || m.initStatus === 'given'; return `<li><button class="mar-row ${st.cls}" data-act="med" data-id="${m.id}" ${off ? `disabled data-why="${esc(m.later ? 'Not due until ' + m.later + '.' : (m.givenNote || 'Already given') + '. Nothing to do now.')}"` : ''}><span class="mar-n"><b>${esc(m.name)}</b> ${esc(medDose(m))} ${m.route}<small>${esc(m.freq)}${m.param ? ' · ' + esc(m.param) : ''}</small></span><span class="pill ${st.cls}">${st.text}</span></button></li>`; };
    return `${sched.length ? `<div class="b-grp"><h4>Scheduled<span>${sched.length}</span></h4><ul class="mar">${sched.map(row).join('')}</ul></div>` : ''}${prn.length ? `<div class="b-grp"><h4>As needed (PRN)<span>${prn.length}</span></h4><ul class="mar">${prn.map(row).join('')}</ul></div>` : ''}`;
  }
  function paneTalk(d, P) {
    const Ax = A();
    const item = (act, label, c, extra, cls) => `<li><button class="fs-row ${cls || ''}" data-act="${act}" ${extra || ''}><span class="fs-l"><b>${label}</b></span><span class="fs-t"></span><span class="fs-c">${c}</span></button></li>`;
    const wants = STY && STY.waiting(s, C(), d, P, Ax);
    let h = `<div class="b-grp"><h4>At the bedside</h4><ul class="fs">${item('talk', `${esc(d.talkLabel || 'Talk with ' + d.short)}${wants ? ' <span class="st-tag">Wants to talk</span>' : ''}`, '3 min')}`;
    if (d.family && (!d.family.avail || d.family.avail(s, P, Ax))) h += item('family', `${d.family.mode === 'phone' ? 'Call' : 'Talk with'} ${esc(d.family.name)} (${esc(d.family.rel.toLowerCase())})`, d.family.cost + ' min');
    h += `</ul></div><div class="b-grp"><h4>Call and escalate</h4><ul class="fs">${item('sbar', `Call ${esc(prov(d.id).name)} with an SBAR`, '6 min', `data-pid="${d.id}"`)}`;
    (d.comms || []).filter((x) => !x.avail || x.avail(s, P, Ax)).forEach((x) => { h += item('comm', esc(x.label), x.cost + ' min', `data-id="${x.id}"`, x.id === 'rrt' ? 'urgent' : ''); });
    if (!(d.comms || []).some((x) => x.id === 'rrt')) h += item('rrt-generic', 'Call a rapid response', '3 min');
    h += `</ul></div><div class="b-grp"><h4>Get help</h4><ul class="fs">${F.errsFor(s, d.id, 'charge').length ? item('err-charge', `Tell ${esc(staff('nova').name.split(' ')[0])} (charge nurse) about your error`, '2 min', '', 'urgent') : ''}${(cnaAway() ? '' : item('delegate', `Ask ${esc(cna().name)} (${esc(cna().role)})`, '1 min'))}</ul></div>`;
    return h;
  }
  const PANES = [
    ['brain', 'Brain', 'Tasks for this patient, overdue first. Tap a task to do it.'],
    ['assess', 'Assess', 'Document an assessment. Each one takes time; the finding goes in the chart.'],
    ['care', 'Care', 'Hands-on care at the bedside.'],
    ['meds', 'MAR', 'Medication administration record. Give or hold each scheduled dose.'],
    ['talk', 'Talk & call', 'Talk with the patient and family, call the provider, or get help.'],
  ];
  function railCounts(d, P) {
    const rows = brainRows(d, P).filter((r) => !r.done && !r.prog && r.t !== null);
    const late = rows.filter((r) => r.late).length, due = rows.filter((r) => !r.late && r.t <= s.t + 30).length;
    const meds = (d.meds || []).filter((m) => !m.prn && m.due !== undefined && !m.later && s.meds[m.id].status === 'due' && m.initStatus !== 'given' && (!m.available || m.available(s, P)));
    const medLate = meds.filter((m) => s.t > m.due + 60).length, medDue = meds.filter((m) => m.due <= s.t + 30).length;
    const Ax = A(), ints = (d.interventions || []).filter((x) => !x.avail || x.avail(s, P, Ax)).length;
    return {
      brain: late ? [`${late} overdue`, 'late'] : due ? [`${due} due`, 'due'] : ['Up to date', ''],
      assess: [sysCount(P) ? `${sysCount(P)} documented` : 'Start here', sysCount(P) ? '' : 'due'],
      care: P.bell ? ['Call light on', 'late'] : [`${ints + 1} option${ints === 0 ? '' : 's'}`, ''],
      meds: medLate ? [`${medLate} late`, 'late'] : medDue ? [`${medDue} due`, 'due'] : ['Nothing due', ''],
      talk: STY && STY.waiting(s, C(), d, P, Ax) ? ['Wants to talk', 'due'] : ['Patient, family, provider', ''],
    };
  }
  /* ------------ talking in the room ------------
     The patient (or the family member beside them) speaks in a speech bubble by their head. Your replies are
     speech bubbles under the scene; tap one to say it. Speech is plain; what people do is in italics. */
  /* One look for everything a character says or does, wherever it appears: the words as written, spoken words in
     quotation marks, what people do in plain text around them. A line that is only speech (an idle line) gets its
     quotation marks here; a line in parentheses is a description, shown without them. */
  function sayText(t, spoken) {
    t = String(t == null ? '' : t).trim();
    if (/^\(.*\)$/.test(t)) return t.slice(1, -1).trim();
    if (spoken && !t.includes('"')) return `"${t}"`;
    if (spoken && !/^"/.test(t)) return `"${t.replace(/"([^"]*)"/g, "'$1'")}"`;
    return t;
  }
  const speechHTML = (t, spoken) => esc(sayText(t, spoken));
  const isPt = (key) => !!def(key);
  function dlgLine() {
    if (ui.dlg.id === '__review') return ui.dlgLast || null;
    const node = C().dialogs[ui.dlg.id]; if (!node) return null;
    return { who: node.who, text: typeof node.text === 'function' ? node.text(s) : node.text, story: node.story || null };
  }
  function sayNow(d) { const l = R.say(d.id, rigV(d.id)), q = liveDef(d).quiet; return l && l.quiet && q ? { quiet: true, text: q } : l; }
  function speech(d, P, fl) {
    const Ax = A();
    if (ui.ov === 'dialog' && ui.dlg) {
      const L = dlgLine(); if (!L) return '';
      const pt = isPt(L.who), fam = !pt && fl.family === L.who, nm = pt ? def(L.who).short : who(L.who).name;
      const st = L.story && STY ? trustDots(STY.trust(s.p[L.story.pid])) : '';
      return `<div class="sb talking" data-anchor="${fam ? 'fam' : pt ? 'pt' : 'side'}" role="status" aria-live="polite">
        <p class="sb-who"><b>${esc(nm)}</b>${st ? `<span class="sb-st">Getting to know ${esc(pt ? d.short : nm.split(' ')[0])} ${st}</span>` : ''}</p>
        <p class="sb-tx">${speechHTML(L.text, false)}</p><i class="sb-tail" aria-hidden="true"></i></div>`;
    }
    if (fl.empty || gone(P)) return '';
    const cid = d.talk(s, P, Ax), node = cid && C().dialogs[cid];
    const line = ui.captionPoke && ui.caption ? { text: ui.captionRaw, quiet: ui.captionQuiet } : sayNow(d);
    let h = '';
    if (cid || line) {
      const story = !!(STY && STY.waiting(s, C(), d, P, Ax)), fresh = !!(node && node.choices && !(s.seenDlg || {})[cid]);
      const wants = cid && (story || fresh), label = wants && !d.newborn && !liveDef(d).vented ? `${d.short} wants to talk` : (d.talkLabel || `Talk with ${d.short}`);
      h += `<div class="sb idle ${wants ? 'wants' : ''} ${ui.captionPoke ? 'fresh' : ''}" data-anchor="pt">${line ? `<p class="sb-tx">${speechHTML(line.text, !line.quiet)}</p>` : ''}${cid ? `<button class="sb-go" data-act="talk">${wants ? '<i class="ping" aria-hidden="true"></i>' : ''}<span>${esc(label)}</span><small>3 min</small></button>` : ''}<i class="sb-tail" aria-hidden="true"></i></div>`;
    }
    if (d.family && fl.family && (!d.family.avail || d.family.avail(s, P, Ax))) h += `<div class="sb idle fam" data-anchor="fam"><button class="sb-go" data-act="family"><span>Talk with ${esc(d.family.name)}</span><small>${d.family.cost} min</small></button><i class="sb-tail" aria-hidden="true"></i></div>`;
    return h;
  }
  function convoTray(d) {
    const rev = ui.dlg.id === '__review', node = rev ? null : C().dialogs[ui.dlg.id];
    const L = dlgLine(), nm = L ? (isPt(L.who) ? def(L.who).short : who(L.who).name) : d.short;
    let h = `<section class="convo" aria-label="Conversation with ${esc(nm)}">`;
    if (ui.said) h += `<p class="said"><span class="said-b">${esc(ui.said)}</span><span class="said-k">You</span></p>`;
    if (node && node.choices) h += `<div class="replies" role="group" aria-label="Your reply"><p class="replies-k">Your reply<button class="cv-away" data-act="close">Step away</button></p>${mixOrder(node.choices.length, ui.dlg.id).map((i, k) => `<button class="cv-reply" data-act="dlg" data-i="${i}"><kbd aria-hidden="true">${k + 1}</kbd><span>${esc(node.choices[i].label)}</span></button>`).join('')}</div>`;
    else h += `${ui.dlgReview ? reviewHTML(ui.dlgReview, rev ? 'Why it matters' : undefined) : ''}<div class="convo-f"><button class="btn btn-primary" data-act="close">Continue</button></div>`;
    return h + '</section>';
  }
  /* Bubbles point at whoever is speaking: map the speaker's head from scene coordinates to the screen. */
  function placeBubbles(root) {
    const rt = (root || document).querySelector('.room-top'), sv = rt && rt.querySelector('svg.scene'); if (!sv || !s || !s.loc) return;
    const d = def(s.loc); if (!d) return;
    const M = sv.getScreenCTM(), R0 = rt.getBoundingClientRect(); if (!M || !R0.width) return;
    const narrow = innerWidth <= 760, sm = d.look.small || 0;
    const pt = (x, y) => { const q = sv.createSVGPoint(); q.x = x; q.y = y; const o = q.matrixTransform(M); return { x: o.x - R0.left, y: o.y - R0.top }; };
    const blockers = [...rt.querySelectorAll('.nameplate .plate, .plate-btns')].map((e) => e.getBoundingClientRect()).filter((z) => z.width).map((z) => ({ l: z.left - R0.left, r: z.right - R0.left, t: z.top - R0.top, b: z.bottom - R0.top }));
    rt.querySelectorAll('.sb').forEach((b) => {
      const fam = b.dataset.anchor === 'fam', talking = b.classList.contains('talking');
      const hx = fam ? 963 : 515, hy = fam ? 250 : (sm ? 150 + (1 - sm) * 330 : 150), hr = fam ? 38 : d.look.head.h * (sm || 1);
      const c = pt(hx, hy), r = Math.abs(pt(hx + hr, hy).x - c.x);
      b.style.cssText = ''; b.dataset.side = '';
      if (narrow) {
        // Phones: the conversation bubble sits under the scene (tail up); the idle one floats at the top (tail down).
        // Idle: over the bed when the head is high in the frame, at the top when it's low (a baby in a crib).
        b.style.setProperty('--tx', Math.max(26, Math.min(R0.width - 26, c.x)) + 'px');
        // The family's button goes on the opposite edge from the patient's bubble.
        const SH = sv.getBoundingClientRect().height, low = pt(515, sm ? 150 + (1 - sm) * 330 : 150).y > SH * .5;
        b.dataset.side = talking ? 'up' : fam ? (low ? 'famlo' : 'fam') : low ? 'down' : 'below';
        if (!talking) { const atTop = fam ? !low : low; b.style.top = Math.max(10, atTop ? 10 : SH - b.offsetHeight - 10) + 'px'; }
        return;
      }
      if (b.dataset.anchor === 'side') { b.dataset.side = 'none'; b.style.left = '50%'; b.style.top = '12px'; b.style.transform = 'translateX(-50%)'; b.style.width = Math.min(440, R0.width - 40) + 'px'; return; }
      const maxW = talking ? 420 : fam ? 230 : 300;
      let P = { x: c.x - r * (fam ? 1.15 : .95), y: c.y + r * .25 }, side = 'l', avail = P.x - 16 - 12;
      if (avail < 220 && !fam) { P = { x: c.x + r * .95, y: P.y }; side = 'r'; avail = R0.width - P.x - 16 - 12; }
      const w = Math.max(150, Math.min(maxW, avail));
      b.style.width = w + 'px';
      const left = side === 'l' ? P.x - 16 - w : P.x + 16, h = b.offsetHeight;
      let top = P.y - h * .62, minTop = 10;
      blockers.forEach((z) => { if (left < z.r && left + w > z.l) minTop = Math.max(minTop, z.b + 8); });
      top = Math.max(minTop, Math.min(top, R0.height - h - 10)); if (top < 10) top = 10;
      Object.assign(b.style, { left: left + 'px', top: top + 'px' });
      b.style.setProperty('--ty', Math.max(16, Math.min(h - 16, P.y - top)) + 'px');
      b.dataset.side = side;
    });
  }
  addEventListener('resize', () => { if (ui.view === 'room') placeBubbles(); });

  function receiptHTML(d) {
    const r = ui.receipt; if (!r || r.pid !== d.id) return '';
    return `<div class="receipt" role="status"><div class="rc-h"><b>${esc(r.label)}</b><span class="rc-t">${E.clock(r.t0)} → ${E.clock(r.t1)} · +${r.t1 - r.t0} min</span><button class="rc-x" data-act="rc-x" aria-label="Dismiss">${ICON.close}</button></div>${r.text ? `<p class="rc-tx">${esc(r.text)}</p>` : ''}${vitDelta(r, d)}</div>`;
  }
  function vRoom() {
    const d = def(s.loc), P = s.p[d.id], Ax = A();
    const v = Ax.lastVitals(d.id), fl = d.scene(s, P, Ax), st = d.status(s, P, Ax);
    let sceneSvg = A_.room(d, s, P, fl, rigV(d.id), P.callLight || !!P.bell, st === 'urgent');
    if (ui.ov === 'dialog' && ui.dlg) sceneSvg = sceneSvg.replace('<svg class="scene"', '<svg class="scene" inert');   // the room holds still while you talk
    const looks = [...sceneSvg.matchAll(/data-act="clue" data-id="([^"]+)" tabindex="0" role="button" aria-label="([^"]+)"/g)].map((x) => [x[1], x[2]]);
    if (!PANES.some((p) => p[0] === ui.dock)) ui.dock = 'brain';
    const pane = PANES.find((p) => p[0] === ui.dock), cnt = railCounts(d, P);
    const logs = s.log.filter((l) => l.pid === d.id).slice().reverse();
    const ab = { T: abn(d, 'T', v.T), HR: abn(d, 'HR', v.HR), BP: abn(d, 'SBP', v.SBP), RR: abn(d, 'RR', v.RR), SpO2: abn(d, 'SpO2', v.SpO2) };
    const bg = P.bgs && P.bgs.length ? P.bgs[P.bgs.length - 1] : null;
    const body = ui.dock === 'brain' ? paneBrain(d, P) : ui.dock === 'assess' ? paneAssess(d, P) : ui.dock === 'care' ? paneCare(d, P) : ui.dock === 'meds' ? paneMeds(d, P) : paneTalk(d, P);
    const talking = ui.ov === 'dialog' && !!ui.dlg;
    return `<main class="roomv ${talking ? 'talking' : ''}">
      <div class="room-top ${ui.enter ? 'enter' : ''} ${ui.flash ? 'flash-' + ui.flash : ''} ${talking ? 'talking' : ''}">
        ${sceneSvg}
        ${speech(d, P, fl)}
        <div class="nameplate"><div class="plate"><h2>${esc(d.name)} <small>${ageSex(d)}, ${d.room}</small></h2><div class="muted" style="font-size:.88rem">${esc(liveDef(d).dx)}</div>
          <div class="facts">${prioN(d.id) ? `<button class="chip prio-chip" data-act="roster" title="Your priority list">#${prioN(d.id)} on your list</button>` : ''}${legal(d)}<span class="chip">${esc(liveDef(d).code)}</span><span class="chip ${/No known/.test(liveDef(d).allergies) ? '' : 'alert'}">${esc(liveDef(d).allergies.split('.')[0])}</span>${P.read ? `<span class="chip read st-${P.read.st}" title="How ${esc(d.short)} looked after your last action">${esc(stName(P.read.st))}${trend(P)}</span>` : ''}</div></div>
          <div class="plate-btns"><button class="btn" data-act="chart" data-pid="${d.id}">${ICON.chart}Chart</button><button class="btn" data-act="back">${ICON.back}Back to station</button></div></div>
        ${ui.caption && !ui.captionPoke && !talking ? `<div class="caption ${ui.captionQuiet ? 'quiet' : ''}" role="status">${esc(ui.caption)}</div>` : ''}
      </div>
      ${talking ? convoTray(d) : ''}
      ${looks.length && !talking ? `<div class="lookaround" role="group" aria-label="Look around the room"><span>Look at</span>${looks.map(([id, l]) => `<button class="look" data-act="clue" data-id="${id}" aria-label="${l}">${esc(l.replace(/^(Meal|Bedside|Cardiac|Oxygen) /, '').replace(/ and pump$| on the table$/, ''))}</button>`).join('')}</div>` : ''}
      <div class="ws" ${talking ? 'inert' : ''}>
        <nav class="rail" role="tablist" aria-label="Activities for ${esc(d.short)}">
          ${PANES.map(([id, l]) => `<button role="tab" class="rt ${cnt[id][1]}" data-act="dock" data-id="${id}" aria-selected="${ui.dock === id}">${AI[id]}<span class="rt-l">${l}</span><span class="rt-s">${esc(cnt[id][0])}</span></button>`).join('')}
          <button class="rt rt-chart" data-act="chart" data-pid="${d.id}">${AI.chart}<span class="rt-l">Chart</span><span class="rt-s">Labs, orders, notes</span></button>
        </nav>
        <section class="pane" role="tabpanel" aria-label="${pane[1]}">
          <header class="pane-h"><h3>${pane[1]}<span> · ${esc(d.short)}, ${d.room}</span></h3><p>${pane[2]}</p>${stuckTip('room')}</header>
          <div class="pane-b">${receiptHTML(d)}${body}</div>
        </section>
        <aside class="doc" aria-label="Vitals and documentation">
          <div class="vstrip tap" aria-label="Last recorded vitals, ${E.clock(v.t)}: temperature ${fT(v.T)}, heart rate ${v.HR}, blood pressure ${v.SBP} over ${v.DBP}, respiratory rate ${v.RR}, SpO₂ ${v.SpO2}%${bg ? `, glucose ${bg.val}` : ''}. Open the vitals flowsheet." data-act="chart" data-pid="${d.id}" data-tab="vitals" role="button" tabindex="0">
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
  function vitDelta(r, d) {
    const V = r.vNew, Vp = r.vPrev;
    const dlt = (k, lab, fmt, hi, lo) => { const a = V[k], b = Vp ? Vp[k] : null; const diff = b === null || b === undefined ? 0 : a - b; const ab = a > hi || a < lo; return `<div class="${ab ? 'ab' : ''}"><span>${lab}</span><b>${fmt(a)}</b>${diff ? `<em class="${diff > 0 ? 'up' : 'dn'}" aria-label="${diff > 0 ? 'up' : 'down'} from ${fmt(b)}">${diff > 0 ? '▲' : '▼'} ${fmt(Math.abs(diff))} <small>from ${fmt(b)}</small></em>` : Vp ? `<em>same as before</em>` : ''}</div>`; };
    return V ? `<div class="res-vit">${dlt('T', 'Temp', (x) => (+x).toFixed(1), norm(d, 'T')[1], norm(d, 'T')[0])}${dlt('HR', 'HR', (x) => Math.round(x), norm(d, 'HR')[1], norm(d, 'HR')[0])}${dlt('SBP', 'Systolic', (x) => Math.round(x), norm(d, 'SBP')[1], norm(d, 'SBP')[0])}${dlt('RR', 'RR', (x) => Math.round(x), norm(d, 'RR')[1], norm(d, 'RR')[0])}${dlt('SpO2', 'SpO₂', (x) => Math.round(x) + '%', 101, norm(d, 'SpO2')[0] - 1)}</div>${Vp ? `<p class="res-since">Compared with ${E.clock(Vp.t)} (${esc(Vp.by)})</p>` : ''}` : '';
  }
  function ovResult() {
    const r = ui.res, d = def(r.pid), changed = r.st0 !== r.st1, dir = !changed ? 0 : r.st1 === 'gone' ? 0 : stRank(r.st1) > stRank(r.st0) ? 1 : -1;
    const vit = vitDelta(r, d);
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
      ${changed ? `<div class="res-cond chg"><span class="res-cl">Overall, since you came in</span><span class="pill st-${r.st0} was">${esc(stName(r.st0))}</span><span class="res-arrow" aria-hidden="true">→</span><span class="pill st-${r.st1} now">${esc(stName(r.st1))}</span></div>` : ''}
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
    return `<div class="rw-lv"><span class="lv-n" aria-hidden="true">${lv.n}</span><div class="lv-b"><b>${esc(lv.title)}${up ? ' <em class="lvup">Level up</em>' : ''}</b><div class="lv-bar" aria-hidden="true"><i style="--from:${(from * 100).toFixed(1)}%;--to:${(lv.pct * 100).toFixed(1)}%"></i></div><small>Level ${lv.n}, ${fmtN(xp)} XP.${lv.hi ? ` ${fmtN(lv.hi - xp)} more to ${esc(lv.next)}.` : ' Top of the ladder.'}</small></div></div>`;
  }
  function rewardHTML() {
    const r = s.reward; if (!r) return '';
    const up = r.lvAfter.n > r.lvBefore.n, from = up ? 0 : r.lvBefore.pct;
    const nextStar = r.stars < 3 ? `${RW.STARS[r.stars]} for ${r.stars ? 'the next' : 'a'} star` : 'Three stars';
    return `<section class="reward ${ui.debDone ? 'shown' : 'play'}" aria-label="Rewards">
      <div class="rw-stars" aria-label="${r.stars} of 3 stars">${[0, 1, 2].map((i) => starSvg(i < r.stars, i)).join('')}<small>${esc(nextStar)}${r.prevStars > r.stars ? `. Your best is ${r.prevStars}` : r.stars > r.prevStars && r.prevStars ? '. New best' : ''}</small></div>
      <div class="rw-mid"><h3>Shift goals</h3>${goalsHTML(r.goals, 'wide')}</div>
      <div class="rw-xp"><ul><li class="tot" style="--i:0"><span>This shift</span><b>+${fmtN(r.total)} XP</b></li></ul><details class="rw-more"><summary>Where it came from</summary><ul>${r.lines.map((l) => `<li><span>${esc(l.k)}</span><b>+${fmtN(l.v)}</b></li>`).join('')}</ul></details>
        ${lvHTML(r.lvAfter, r.after, from, up)}</div>
      ${r.earned.length ? `<div class="rw-badges"><h3>New badge${r.earned.length > 1 ? 's' : ''}</h3><div>${r.earned.map((b) => badgeHTML(b, false, 'span')).join('')}</div></div>` : ''}
    </section>`;
  }
  function careerHTML() {
    const xp = prof.xp || 0, lv = RW.level(xp), have = prof.badges || {}, n = Object.keys(have).length;
    const les = Object.values(prof.lessons || {}), open = les.filter((l) => !l.fixed).length, fixed = les.length - open;
    return `<section class="career" aria-label="Your progress">${lvHTML(lv, xp, 0, false)}<div class="cr-links">${les.length ? `<button class="cr-les" data-act="awards" data-k="lessons">${open} open lesson${open === 1 ? '' : 's'}, ${fixed} fixed</button>` : ''}<button class="cr-les" data-act="awards">Badges: ${n} of ${RW.BADGES.length}</button></div></section>`;
  }

  /* ------------ achievements: tracks, milestones, units, the lesson log, the floor-call collection ------------ */
  const MEDAL = ['none', 'bronze', 'silver', 'gold'];
  function medalHTML(tier, g) { return `<svg class="medal m-${MEDAL[tier]}" viewBox="0 0 48 48" aria-hidden="true"><path d="M15 3h7l2 9-6 2zM33 3h-7l-2 9 6 2z" class="md-rib"/><circle cx="24" cy="29" r="15" class="md-rim"/><circle cx="24" cy="29" r="11" class="md-in"/><g transform="translate(12 17)" class="md-g">${GLYPH[g] || GLYPH.star}</g></svg>`; }
  const TRACKG = { safety: 'shield', priority: 'up', assess: 'eye', meds: 'check', deleg: 'solo', comm: 'bell', judgment: 'heart', time: 'flame', lessons: 'book', stories: 'chat', floor: 'badge', shifts: 'map', stars: 'star' };
  const caseTitle = (id) => { const k = E.getCase(id); return k ? `${k.title} (${specOf(id).name})` : 'Floor calls'; };
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
    const seen = prof.floorSeen || {}, P = FL.POOL, KIND = { med: 'Med-surg', psych: 'Psych', peds: 'Peds', ob: 'Maternity and L&D', ed: 'Emergency', icu: 'ICU', sd: 'Step-down', ld: 'Labor and delivery' };
    return `<p class="muted ach-note">Floor calls come at random. Answer one with the best choice to collect it; anything less can be collected on a later shift.</p><div class="fcol">${P.map((x) => { const v = seen[x.id]; return `<div class="fc-t ${v || 'unseen'}" title="${esc(v ? x.title : 'Not seen yet')}"><span class="fc-g" aria-hidden="true">${v === 'best' ? '★' : v ? '◐' : '?'}</span><b>${v ? esc(x.title) : 'Not seen yet'}</b><small>${x.k.length > 1 ? 'Any unit' : esc(KIND[x.k[0]] || 'One unit')}${v && v !== 'best' ? ' · try again' : ''}</small></div>`; }).join('')}</div>`;
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
    if (tab === 'units') body = `<section class="ach-sec"><h2>Units</h2><div class="ach-units">${CASES.map((id) => { const k = E.getCase(id), st = (prof.stars || {})[id] || 0, n = (prof.done || {})[id] || prof.runs.filter((r) => r.caseId === id).length, best = (prof.best || {})[id] || (prof.runs.filter((r) => r.caseId === id).map((r) => r.score).sort((a, b) => b - a)[0]), ol = les.filter((l) => l.caseId === id && !l.fixed).length; return `<div class="ach-u"><span class="rung-st">${[0, 1, 2].map((i) => starSvg(i < st, i, 'rs')).join('')}</span><b>${esc(k.title)}</b><small>${esc(specOf(id).name)} · ${esc(diffLabel(id))}</small><dl><dt>Best</dt><dd>${best !== undefined ? best : '–'}</dd><dt>Played</dt><dd>${n || 0}</dd><dt>Open lessons</dt><dd>${ol}</dd></dl><button class="btn ${n ? '' : 'btn-primary'}" data-act="pick-case" data-id="${id}">${n ? 'Play again' : 'Play'}</button></div>`; }).join('')}</div></section>`;
    return `<header class="top"><button class="mark" data-act="aw-back">The Shift</button><div class="where">Achievements</div><button class="btn btn-quiet" data-act="aw-back">${ICON.back}Back</button></header><main><div class="ach">
      <section class="ach-hero"><div class="ach-lv">${lvHTML(lv, prof.xp || 0, 0, false)}</div><div class="ach-sum"><div><b>${medals}</b><small>track medals</small></div><div><b>${Object.keys(have).length}</b><small>milestones</small></div><div><b>${fixed}</b><small>lessons fixed</small></div><div><b>${col}</b><small>floor calls collected</small></div></div></section>
      <nav class="ach-tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" data-act="aw-tab" data-k="${k}" aria-selected="${tab === k}">${l}</button>`).join('')}</nav>${body}</div></main>`;
  }
  function learnHTML() {
    const r = s.reward, L = r && r.learn; if (!L) return '';
    const fx = L.fixed.map((k) => prof.lessons[k]).filter(Boolean), ag = L.again.map((k) => prof.lessons[k]).filter(Boolean);
    const ups = L.ups.map((u) => { const tr = RW.TRACKS.find((x) => x.id === u.id); return `<span class="up">${medalHTML(u.tier, TRACKG[tr.dom || tr.id])}<span><b>${esc(tr.label)}</b><small>${RW.TIER[u.tier]}</small></span></span>`; }).join('');
    if (!fx.length && !L.added.length && !ups && !ag.length) return `<section class="learn learn-empty"><p class="muted">Every call to rethink from a finished shift goes into your lesson log.</p><button class="btn btn-quiet" data-act="awards">Achievements ›</button></section>`;
    return `<section class="learn" aria-label="What you learned">
      ${fx.length ? `<div class="ln-fix"><h3>Lessons you fixed <span>${fx.length}</span></h3><ul>${fx.slice(0, 6).map((l) => `<li><span class="les-ic" aria-hidden="true">✓</span><span>${esc(l.text)}</span></li>`).join('')}${fx.length > 6 ? `<li class="muted">and ${fx.length - 6} more</li>` : ''}</ul><p class="muted">Mistakes from last time that you didn't repeat.</p></div>` : ''}
      ${ag.length ? `<div class="ln-ag"><h3>Came back <span>${ag.length}</span></h3><ul>${ag.slice(0, 4).map((l) => `<li><span class="les-ic" aria-hidden="true">!</span><span>${esc(l.text)}</span></li>`).join('')}</ul></div>` : ''}
      ${ups ? `<div class="ln-ups"><h3>Track medals</h3><div>${ups}</div></div>` : ''}
      <div class="ln-f">${L.added.length ? `<p><b>${L.added.length} new lesson${L.added.length === 1 ? '' : 's'}</b> in your log. Replay this shift and avoid ${L.added.length === 1 ? 'it' : 'them'} to mark ${L.added.length === 1 ? 'it' : 'them'} fixed.</p>` : ''}<button class="btn" data-act="awards" data-k="lessons">Open lesson log ›</button><button class="btn btn-quiet" data-act="awards">All achievements</button></div>
    </section>`;
  }

  /* ------------ debrief ------------ */
  function storyHTML(o) {
    if (!STY) return ''; const e = STY.epilogue(s, C(), def(o.id), s.p[o.id], o.tone); if (!e) return '';
    const more = e.total - e.heard;
    return `<div class="st-epi"><div class="st-eh"><span class="st-k">Their story</span>${trustDots(e.trust)}</div><p>${esc(e.text)}</p>${e.learned.length ? `<details><summary>What you learned about them <span class="muted">${e.heard} of ${e.total}</span></summary><ul>${e.learned.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}${more && e.heard ? `<small class="muted">${more} more thing${more === 1 ? '' : 's'} to learn about them on another shift.</small>` : ''}</div>`;
  }
  /* ------------ debrief: showing the working ------------ */
  const STARS_AT = () => (RW && RW.STARS) || [58, 72, 85];
  // Focus practice: the two lowest NCLEX steps under 72 (or the lowest, as a stretch, when none is), two items each.
  function focusPlan(cj) {
    if (!NG || !NG.focus || !cj) return null;
    const key = s.caseId + ':' + s.t + ':' + s.judg.length; if (ui.fx && ui.fx.key === key) return ui.fx;
    const tested = cj.filter((x) => x.score !== null).sort((a, b) => a.score - b.score);
    let weak = tested.filter((x) => x.score < STARS_AT()[1]).slice(0, 2), stretch = false;
    if (!weak.length && tested.length) { weak = tested.slice(0, 1); stretch = true; }
    const its = NG.focus(weak.map((x) => x.id), s.caseId, prof.ngn, 2, meta(s.caseId).sp);
    return (ui.fx = { key, weak: weak.map((x) => ({ id: x.id, label: x.label, score: x.score })), stretch, ids: its.map((x) => x.id) });
  }
  const ngnList = () => {
    const q = ui.ngn; if (!q) return [];
    if (q.list === 'focus' && ui.fx) return ui.fx.ids.map((id) => NG.byId(id)).filter(Boolean);
    if (q.list === 'bank' && ui.pset) return ui.pset.ids.map((id) => NG.byId(id)).filter(Boolean);
    if (q.list === 'case') { const c = NG.caseById(q.cs); return c ? c.items : []; }
    return s ? NG.items(s.caseId) : [];
  };
  // Ordered-response items start shuffled (never already in order), the same way each time for a given item.
  function orderStart(it) {
    let h = 0; for (const ch of it.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const o = it.opts.map((_, i) => i); for (let i = o.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [o[i], o[j]] = [o[j], o[i]]; }
    if (o.every((x, i) => x === i)) o.push(o.shift());
    return o;
  }
  function ngnStart(list, i, extra) {
    ui.ngn = Object.assign({ list, i, a: {}, checked: false }, extra || {});
    const it = ngnList()[i]; if (it && it.type === 'order') ui.ngn.a.o = orderStart(it);
  }
  const fmt1 = (n) => (Math.round(n * 10) / 10).toString();
  // Under the big number: which skills were averaged, and where the star lines sit.
  function scoreWhyHTML(d) {
    const open = !!ui.scWhy, sc = d.dom.filter((x) => x.score !== null), ST = STARS_AT(), nst = ST.filter((x) => d.overall >= x).length;
    const names = ['Rough shift', 'Getting there', 'Safe, solid shift', 'Charge-nurse material'], harmed = d.outcomes.some((o) => o.tone === 'bad');
    const body = !open ? '' : `<div class="sw-b">
      <p>Your score is the average of the <b>${sc.length} skill area${sc.length === 1 ? '' : 's'}</b> this shift tested. An area is tested when at least one of your decisions falls in it; areas with none are left out so they can't drag you up or down.</p>
      <ul class="sw-sk">${sc.map((x) => `<li><span>${esc(x.label)}</span><b>${x.score}</b></li>`).join('')}</ul>
      <p class="sw-eq">(${sc.map((x) => x.score).join(' + ')}) ÷ ${sc.length} = <b>${d.overall}</b></p>
      <div class="sw-bands" aria-hidden="true"><i class="sw-m" style="left:${Math.max(0, Math.min(100, d.overall))}%"></i>${ST.map((x) => `<span class="sw-t" style="left:${x}%"><b>${x}</b></span>`).join('')}</div>
      <ul class="sw-key">${[0, 1, 2, 3].map((n) => `<li class="${n === nst ? 'on' : ''}"><span>${n ? `${'★'.repeat(n)} ${ST[n - 1]}+` : `Under ${ST[0]}`}</span><b>${names[n]}</b></li>`).join('')}</ul>
      <p>${nst < 3 ? `<b>${ST[nst] - d.overall} more point${ST[nst] - d.overall === 1 ? '' : 's'}</b> would have earned ${nst ? 'the next star' : 'a star'}.` : 'Three stars: the top band.'}${harmed && d.overall >= ST[1] ? ' A patient had a poor outcome, so the title is "Solid, with a miss that mattered" instead.' : !harmed && nst === 0 && d.overall >= 45 ? ' With no patient harmed, a score from 45 is still called "Getting there".' : ''}</p>
      <p>Each skill starts at 60. Strong calls add 6 per point and misses take off 9 per point, then 4.5 per point after the first three. Open any skill or NCLEX step below to see every decision behind its number.</p>
      <p class="muted">The NCLEX steps re-sort the same decisions by clinical judgment step; they don't change this score. The real NCLEX is pass or fail and doesn't report step scores, so treat these as a map of what to study.</p></div>`;
    return `<div class="sc-why"><button class="sw-btn" data-act="sc-why" aria-expanded="${open}">How your ${d.overall} was worked out <span aria-hidden="true">${open ? '▴' : '▾'}</span></button>${body}</div>`;
  }
  // One skill or step, opened: start at 60, every decision that moved it, and the sum.
  function workHTML(T) {
    const K = E.SCORE, row = (j, cls, val, how) => `<li class="wk ${cls}"><span class="wk-t">${E.clock(j.t)}${j.pid ? ' · ' + esc(j.pid) : ''}</span><span class="wk-x">${esc(j.text)}</span><span class="wk-p"><b>${val}</b><small>${how}</small></span></li>`;
    const pt = (n) => `${fmt1(n)} pt${n === 1 ? '' : 's'}`;
    const minusHow = (m) => m.half && m.full ? `${pt(m.full)} × ${K.BAD} + ${pt(m.half)} × ${K.BAD_AFTER}` : m.full ? `${pt(m.full)} × ${K.BAD}` : `${pt(m.half)} × ${K.BAD_AFTER}, past the first ${K.BAD_FULL}`;
    const rounded = Math.round(T.raw), adj = T.score !== rounded ? (T.score === 100 ? 'capped at 100' : 'raised to the minimum of 5') : T.raw !== rounded ? 'rounded' : '';
    return `<ol class="wk-list"><li class="wk base"><span class="wk-t"></span><span class="wk-x">Everyone starts here</span><span class="wk-p"><b>${K.BASE}</b></span></li>
      ${T.plus.map((x) => row(x.j, 'good', '+' + fmt1(x.add), `${pt(x.pts)} × ${K.GOOD}`)).join('')}
      ${T.minus.map((x) => row(x.j, 'bad', '−' + fmt1(x.sub), minusHow(x))).join('')}
      ${T.notes.map((j) => row(j, 'note', '0', 'noted, not scored')).join('')}</ol>
      <p class="wk-eq">${K.BASE}${T.gain ? ` + ${fmt1(T.gain)}` : ''}${T.pen ? ` − ${fmt1(T.pen)}` : ''} = ${fmt1(T.raw)}${T.raw !== T.score ? ` → <b>${T.score}</b> (${adj})` : ''}</p>
      ${T.badPts > K.BAD_FULL ? `<p class="wk-n muted">Misses past the first ${K.BAD_FULL} points count half, so one bad stretch can't zero a whole area.</p>` : ''}`;
  }
  function guideHTML(id) {
    const g = CJ && CJ.GUIDE && CJ.GUIDE[id]; if (!g) return '';
    const fxi = ui.fx ? ui.fx.ids.findIndex((x) => { const it = NG.byId(x); return it && it.step === id; }) : -1;
    return `<div class="gd"><h4>On the NCLEX</h4><p>${esc(g.exam)}</p><h4>Ask yourself</h4><ul>${g.ask.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><h4>Common traps</h4><ul>${g.traps.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>${fxi >= 0 ? `<button class="btn gd-go" data-act="ngn-open" data-list="focus" data-i="${fxi}">Practice this step <span aria-hidden="true">›</span></button>` : ''}</div>`;
  }
  function meterHTML(x, T, step, d) {
    ui.mOpen = ui.mOpen || {}; const k = (step ? 'c:' : 'k:') + x.id, open = !!ui.mOpen[k];
    const head = `<div class="l"><span>${x.label}</span><b>${x.score === null ? 'Not tested' : x.score}</b></div><div class="bar" aria-hidden="true"><i style="width:${x.score || 0}%"></i></div><small class="muted">${x.score === null ? 'No decisions fell here this shift' : `${x.good} strong, ${x.bad} missed`}<span class="mt-how">${open ? 'Hide' : x.score === null ? (step ? 'What it means' : '') : 'How it was scored'}</span></small>`;
    if (x.score === null && !step) return `<div class="meter">${head}</div>`;
    return `<div class="meter ${open ? 'open' : ''}"><button class="meter-b" data-act="meter" data-k="${k}" aria-expanded="${open}"${x.what ? ` title="${esc(x.what)}"` : ''}>${head}</button>${open ? `<div class="meter-w">${step && x.what ? `<p class="mw-what">${esc(x.what)}</p>` : ''}${x.score !== null ? workHTML(T) : ''}${step ? guideHTML(x.id) : ''}</div>` : ''}</div>`;
  }
  function vDebrief() {
    const d = E.debrief(s), cj = CJ ? CJ.score(d.judg) : null; focusPlan(cj);
    if (!ui.mOpen || ui.mOpenFor !== (ui.fx && ui.fx.key)) {   // first look: open the weakest area in each view
      ui.mOpen = {}; ui.mOpenFor = ui.fx && ui.fx.key;
      const low = (L) => L.filter((x) => x.score !== null).sort((a, b) => a.score - b.score)[0];
      const a = low(d.dom), b = cj && low(cj); if (a) ui.mOpen['k:' + a.id] = 1; if (b) ui.mOpen['c:' + b.id] = 1;
    }
    const prior = prof.runs.filter((r) => r.caseId === s.caseId).slice(1), best = prior.length ? Math.max(...prior.map((r) => r.score)) : null;
    const nextId = CASES[CASES.indexOf(s.caseId) + 1], next = nextId ? E.getCase(nextId) : null;
    const items = d.judg.filter((j) => ui.filter === 'all' || (ui.filter === 'good' ? j.delta > 0 : j.delta < 0));
    const nx = NG && CJ && cj ? nclexSummary(cj) : null, tab = nx && ui.dtab === 'nclex' ? 'nclex' : 'shift';
    const tabs = nx ? `<div class="dtabs" role="tablist" aria-label="Debrief">${[['shift', 'Your shift', `${d.outcomes.length} patients`], ['nclex', 'NCLEX review', nx.left ? `${nx.left} question${nx.left === 1 ? '' : 's'} waiting` : 'All answered']].map(([k, l, sub]) => `<button role="tab" id="dt-${k}" class="dtab dt-${k}" aria-selected="${tab === k}" aria-controls="dp" data-act="dtab" data-v="${k}"><b>${l}</b><small>${sub}</small></button>`).join('')}</div>` : '';
    const hero = `<section class="deb-hero"><div><p class="muted" style="margin:0">${esc(C().title)} debrief, ${E.clock(0)} to ${E.clock(s.t)}</p><h1>${esc(d.rating)}</h1><p class="muted" style="max-width:52ch">${s.t < C().length - 30 ? `You ended the shift early, at ${E.clock(s.t)}. ` : ''}What happened to your patients, and the calls behind it.</p></div>
      <div class="deb-score"><span class="num" data-to="${d.overall}">${ui.debDone ? d.overall : 0}</span><small>out of 100${best !== null ? `. Your best: ${best}` : ''}</small></div></section>`;
    if (tab === 'nclex') return `<main><div class="deb">${hero}${tabs}<div id="dp" role="tabpanel" aria-labelledby="dt-nclex">${nclexTab(d, cj, nx, next, nextId)}</div>${fbCard()}</div></main>`;
    return `<main><div class="deb">
      ${hero}${tabs}<div id="dp" role="tabpanel" aria-labelledby="dt-shift">
      ${nx ? nclexCta(nx) : ''}
      ${scoreWhyHTML(d)}
      ${rewardHTML()}${learnHTML()}
      ${(() => { const hurt = (j) => (d.outcomes.find((o) => o.id === j.pid) || {}).tone === 'bad' ? 0 : 1, neg = d.judg.filter((j) => j.delta < 0), real = neg.filter((j) => !/-unseen$/.test(j.key || '')), w = (real.length ? real : neg).sort((a, b) => hurt(a) - hurt(b) || a.delta - b.delta || a.t - b.t)[0], pos = d.judg.filter((j) => j.delta > 0 && !(j.pid && (d.outcomes.find((o) => o.id === j.pid) || {}).tone === 'bad')), g = pos.sort((a, b) => (a.domain === 'priority') - (b.domain === 'priority') || b.delta - a.delta || a.t - b.t)[0]; return w || g ? `<section class="keyline">${w ? `<div class="kl bad"><span class="mk">The decision that mattered most</span><b>${esc(w.text)}</b><p>${esc(w.why)}</p></div>` : ''}${g ? `<div class="kl good"><span class="mk">Your best call</span><b>${esc(g.text)}</b></div>` : ''}</section>` : ''; })()}
      ${(() => { if (!STY) return ''; const n = d.outcomes.filter((o) => { const e = STY.epilogue(s, C(), def(o.id), s.p[o.id], o.tone); return e && !e.heard && e.total; }).length; return n ? `<p class="muted st-note">You didn't get to know ${n === d.outcomes.length ? 'any of your patients' : n === 1 ? 'one of your patients' : n + ' of your patients'} this shift, so ${n === 1 ? 'that story stays' : 'their stories stay'} short. Talking with patients once they're stable fills them in.</p>` : ''; })()}
      <section class="outs" aria-label="Patient outcomes">${d.outcomes.map((o) => `<div class="out">${pface(o.id)}<div><span class="tone ${o.tone}">${{ good: 'Good outcome', mixed: 'Mixed outcome', bad: 'Poor outcome' }[o.tone]}</span><h3>${def(o.id).room} ${esc(def(o.id).short)}: ${esc(o.title)}</h3><p>${esc(o.text)}</p>${storyHTML(o)}${o.next ? `<details class="nx"><summary>What happened next in ${esc(F.where(o.next.unit))}</summary><ol class="aw-tl">${o.next.entries.map((e) => `<li class="${e.after ? 'after' : ''}"><span class="aw-tm">${e.after ? 'After your shift' : E.clock(e.t)}</span><span class="pill af-${e.st}">${F.ST[e.st]}</span><p>${esc(e.text)}</p></li>`).join('')}${o.next.later ? `<li class="after"><span class="aw-tm">Later</span><span></span><p>${esc(o.next.later)}</p></li>` : ''}</ol></details>` : ''}</div></div>`).join('')}</section>
      <div class="deb-grid">
        <section aria-labelledby="dh"><div class="by-h"><h2 id="dh">By skill</h2>${nx ? `<button class="btn btn-quiet by-nx" data-act="dtab" data-v="nclex">By NCLEX step <span aria-hidden="true">›</span></button>` : ''}</div>
          <p class="muted by-n">Tap a skill to see every decision behind its number.</p>
          ${d.dom.map((x) => meterHTML(x, E.tally(d.judg.filter((j) => j.domain === x.id)), false, d)).join('')}
          <p class="muted" style="font-size:.85rem">Nova hints used: ${(C().novaCredits || 3) - s.nova} of ${C().novaCredits || 3}.</p>
          <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:1rem">${nx ? `<button class="btn btn-nx" data-act="dtab" data-v="nclex"><span><b>NCLEX review</b><small>${nx.left ? `${nx.left} question${nx.left === 1 ? '' : 's'} from this shift and your weakest steps` : 'Your steps, step by step'}</small></span> <span aria-hidden="true">→</span></button>` : ''}${next && d.overall >= 58 ? `<button class="btn btn-primary btn-go btn-next" data-act="next-case" data-id="${nextId}"><span><b>Next: ${esc(next.title)}</b><small>${esc(specOf(nextId).name)} · ${esc(diffLabel(nextId))}</small></span> <span aria-hidden="true">→</span></button><button class="btn" data-act="new">Play this shift again</button>` : `<button class="btn btn-primary btn-go" data-act="new">Play the shift again <span aria-hidden="true">→</span></button>${next ? `<button class="btn btn-next" data-act="next-case" data-id="${nextId}"><span><b>Or try ${esc(next.title)}</b><small>${esc(specOf(nextId).name)} · ${esc(diffLabel(nextId))}</small></span></button>` : ''}`}<button class="btn btn-quiet" data-act="home">Home</button></div>
        </section>
        <section aria-labelledby="mh"><h2 id="mh">Moments that mattered</h2>
          <div class="filter" role="group" aria-label="Filter moments">${[['all', 'All'], ['good', 'What went well'], ['bad', 'What to rethink']].map(([k, l]) => `<button class="btn ${ui.filter === k ? 'btn-primary' : ''}" data-act="filter" data-k="${k}" aria-pressed="${ui.filter === k}">${l}</button>`).join('')}</div>
          <ul class="moments">${items.map((j) => `<li class="${j.delta > 0 ? 'good' : j.delta < 0 ? 'bad' : 'neutral'}"><span class="tm">${E.clock(j.t)}${j.pid ? '<br>' + j.pid : ''}</span><div><span class="mk">${j.delta > 0 ? 'Strong' : j.delta < 0 ? 'Rethink' : 'Note'}${CJ ? `<span class="cj-tag"> · ${esc(CJ.STEPS.find((x) => x[0] === CJ.step(j))[1])}</span>` : ''}</span><b>${esc(j.text)}</b><p>${esc(j.why)}</p><button class="rpt-btn" data-act="rpt" data-k="${esc(j.key || '')}" data-t="${j.t}" aria-label="Report a problem with this feedback">Report a problem</button></div></li>`).join('') || '<li><span></span><span class="muted">Nothing here.</span></li>'}</ul>
        </section>
      </div>${nx ? '' : ngnHTML()}</div>${fbCard()}</div></main>`;
  }

  /* ------------ debrief: the NCLEX review tab ------------ */
  // What's waiting: this shift's items and focus items not yet answered, and the weakest step.
  function nclexSummary(cj) {
    const done = prof.ngn || {}, shiftIts = NG.items(s.caseId), fx = ui.fx, fits = fx ? fx.ids.map((id) => NG.byId(id)).filter(Boolean) : [];
    const tested = cj.filter((x) => x.score !== null).sort((a, b) => a.score - b.score);
    const all = shiftIts.concat(fits), left = all.filter((x) => !done[x.id]).length;
    const got = all.reduce((n, x) => n + (done[x.id] ? lastOf(done[x.id]) : 0), 0), mx = all.reduce((n, x) => n + NG.max(x), 0);
    const cases = NG.cases ? NG.cases().filter((c) => c.sp === meta(s.caseId).sp) : [];
    return { shiftIts, fits, all, left, got, mx, weak: tested[0] || null, strong: tested.length > 1 ? tested[tested.length - 1] : null, tested, cases };
  }
  const cjTone = (sc) => (sc === null ? 'na' : sc >= STARS_AT()[1] ? 'hi' : sc >= STARS_AT()[0] ? 'mid' : 'lo');
  function cjStrip(cj, nx, act) {
    return `<ol class="cj-strip">${cj.map((x, i) => `<li><button class="cj-c t-${cjTone(x.score)} ${nx.weak && nx.weak.id === x.id ? 'weak' : ''}" ${act ? `data-act="cj-go" data-v="${x.id}"` : 'data-act="dtab" data-v="nclex"'} aria-label="${esc(x.label)}: ${x.score === null ? 'not tested' : x.score + ' of 100'}"><span class="cj-n">${i + 1}</span><span class="cj-l">${esc(x.label)}</span><b class="cj-s">${x.score === null ? '–' : x.score}</b><span class="cj-b" aria-hidden="true"><i style="width:${x.score || 0}%"></i></span>${nx.weak && nx.weak.id === x.id ? '<span class="cj-w">Weakest</span>' : ''}</button></li>`).join('')}</ol>`;
  }
  function nclexCta(nx) {
    const w = nx.weak;
    return `<section class="nx-cta" aria-labelledby="nxh"><div class="nx-ct"><p class="nx-k">NCLEX review</p><h2 id="nxh">${w ? `Your weakest NCLEX step this shift: ${esc(w.label)} (${w.score}).` : 'See this shift through the NCLEX lens.'}</h2><p>${nx.left ? `${nx.left} practice question${nx.left === 1 ? '' : 's'} in Next Generation NCLEX formats are waiting: ${nx.shiftIts.length} from this shift${nx.fits.length ? ` and ${nx.fits.length} aimed at your weakest step${nx.fits.length > 2 ? 's' : ''}` : ''}.` : `You've answered every question for this shift: ${nx.got} of ${nx.mx} points.`}</p></div>
      ${cjStrip(CJ.score(E.debrief(s).judg), nx, false)}
      <button class="btn btn-primary btn-go nx-go" data-act="dtab" data-v="nclex">Open NCLEX review <span aria-hidden="true">→</span></button></section>`;
  }
  function nclexTab(d, cj, nx, next, nextId) {
    const done = prof.ngn || {}, fx = ui.fx;
    const why = fx && fx.weak.length ? (fx.stretch ? `None of your steps fell below ${STARS_AT()[1]}. These stretch questions aim at your lowest, <b>${esc(fx.weak[0].label)}</b> (${fx.weak[0].score}).` : `Aimed at ${fx.weak.map((w) => `<b>${esc(w.label)}</b> (${w.score})`).join(' and ')}, using clients from other units so you practice the thinking, not the patient.`) : '';
    const qcard = (it, i, list) => { const r = done[it.id]; return `<li><button class="nq ${r ? (lastOf(r) === r.max ? 'full' : 'part') : ''}" data-act="ngn-open" data-list="${list}" data-i="${i}"><span class="nq-n">${i + 1}</span><span class="nq-t"><b>${esc(NG.TYPE[it.type])}</b><small>Tests ${esc(STEPNAME(it.step))}${it.cn && NG.CN ? ` · ${esc((NG.CN.find((c) => c[0] === it.cn) || [])[1] || '')}` : ''}</small></span><span class="nq-s">${r ? `${lastOf(r)} of ${r.max}` : 'Start'} <span aria-hidden="true">›</span></span></button></li>`; };
    const pct = nx.mx ? Math.round(nx.got / nx.mx * 100) : 0, answered = nx.all.length - nx.left;
    const misses = nx.tested.filter((x) => x.bad).slice(0, 3);
    const cs = nx.cases.map((c) => ({ c, a: c.items.filter((x) => done[x.id]).length })).sort((a, b) => (a.a === 6) - (b.a === 6) || b.a - a.a).slice(0, 3);
    return `<section class="nx-tab">
      <div class="nx-head"><h2>This shift, the way the NCLEX thinks</h2><p class="muted">The Next Generation NCLEX is built on the NCSBN Clinical Judgment Measurement Model: six steps from noticing cues to checking whether it worked. Every decision you made this shift is filed under one of them. These step scores are a study map, not a pass prediction; the real exam is pass or fail.</p></div>
      ${cjStrip(cj, nx, true)}
      <div class="nx-plan"><h3>Your NCLEX plan for this shift</h3><ol>
        <li class="${nx.shiftIts.every((x) => done[x.id]) ? 'done' : ''}"><b>Answer this shift's ${nx.shiftIts.length} questions.</b> Same patients, exam format.</li>
        ${nx.fits.length ? `<li class="${nx.fits.every((x) => done[x.id]) ? 'done' : ''}"><b>Focus on ${fx && fx.weak.length ? esc(fx.weak.map((w) => w.label).join(' and ')) : 'your weakest step'}.</b> ${nx.fits.length} questions from other units.</li>` : ''}
        <li><b>Read how each step works below</b>, especially the traps.</li>
        ${cs.length ? `<li><b>Then try a ${esc(SPN[nx.cases[0].sp] || '')} case study</b>, one client through all six steps.</li>` : ''}
      </ol><div class="nx-prog"><span><b>${answered} of ${nx.all.length}</b> answered</span><span class="nx-pb" aria-hidden="true"><i style="width:${nx.all.length ? answered / nx.all.length * 100 : 0}%"></i></span><span>${answered ? `${pct}% of points` : ''}</span></div></div>
      <div class="nx-qs">
        <section><h3 class="nx-h">From this shift</h3><p class="muted nx-sub">Built on the patients you just cared for.</p><ol class="nq-list">${nx.shiftIts.map((it, i) => qcard(it, i, 'shift')).join('')}</ol></section>
        ${nx.fits.length ? `<section><h3 class="nx-h">Focus practice</h3><p class="muted nx-sub ngn-fx">${why}</p><ol class="nq-list">${nx.fits.map((it, i) => qcard(it, i, 'focus')).join('')}</ol></section>` : ''}
      </div>
      ${misses.length ? `<section class="nx-miss"><h3 class="nx-h">Where your thinking slipped</h3><ul>${misses.map((x) => { const j = x.js.filter((y) => y.delta < 0).sort((a, b) => a.delta - b.delta)[0]; return j ? `<li><span class="nm-s t-${cjTone(x.score)}">${esc(x.label)}</span><b>${esc(j.text)}</b><p>${esc(j.why)}</p></li>` : ''; }).join('')}</ul></section>` : ''}
      <section class="nx-steps" id="nx-steps"><h3 class="nx-h">Step by step</h3><p class="muted nx-sub">Tap a step to see every decision behind its number, how the exam tests it, the questions to ask yourself and the common traps.</p>
        ${cj.map((x) => meterHTML(x, E.tally(x.js), true, d)).join('')}</section>
      <section class="nx-more"><h3 class="nx-h">Keep going</h3><div class="nx-mg">
        ${cs.map(({ c, a }) => `<button class="pc sp-${SPC[c.sp] || 'ms'}" data-act="cs-open" data-id="${c.id}"><span class="pc-u">Case study · ${esc(SPN[c.sp] || '')}</span><b class="pc-t">${esc(c.title)}</b><span class="pc-c">${esc(c.client)}</span><span class="pc-f"><span>${a ? (a === 6 ? 'Finished' : `${a} of 6 answered`) : '6 questions'}</span><span class="pc-go">${a === 6 ? 'Retry' : a ? 'Continue' : 'Start'} ›</span></span></button>`).join('')}
        ${NG.bank ? `<button class="pc nx-hub" data-act="practice"><span class="pc-u">NCLEX practice</span><b class="pc-t">${NG.count.cases()} case studies, ${NG.count.bank()} questions</b><span class="pc-c">Filter by Client Needs, judgment step and format, and see your readiness by category.</span><span class="pc-f"><span></span><span class="pc-go">Open ›</span></span></button>` : ''}
      </div></section>
      <div class="nx-nav"><button class="btn" data-act="dtab" data-v="shift"><span aria-hidden="true">←</span> Back to your shift</button>${next ? `<button class="btn" data-act="next-case" data-id="${nextId}">Next: ${esc(next.title)}</button>` : ''}<button class="btn btn-quiet" data-act="home">Home</button></div>
    </section>`;
  }

  /* ------------ NCLEX-style practice items ------------ */
  const STEPNAME = (id) => (CJ ? (CJ.STEPS.find((x) => x[0] === id) || [])[1] : '') || '';
  function ngnRow(it, i, list) {
    const dn = (prof.ngn || {})[it.id];
    return `<li><button class="ngn-row" data-act="ngn-open" data-list="${list}" data-i="${i}"><span class="ngn-n">${i + 1}</span><span class="ngn-t"><b>${esc(NG.TYPE[it.type])}</b><small>${esc(STEPNAME(it.step))}</small></span><span class="ngn-sc ${dn ? '' : 'ngn-go'}">${dn ? `${dn.score} of ${dn.max}` : 'Start'} <span aria-hidden="true">›</span></span></button></li>`;
  }
  function ngnHTML() {
    if (!NG || !s) return ''; const its = NG.items(s.caseId); if (!its.length) return '';
    const fx = ui.fx, fits = fx ? fx.ids.map((id) => NG.byId(id)).filter(Boolean) : [];
    const why = fx && fx.weak.length ? (fx.stretch ? `None of your NCLEX steps fell below ${STARS_AT()[1]} this shift. These stretch questions aim at your lowest, <b>${esc(fx.weak[0].label)}</b> (${fx.weak[0].score}).` : `Your lowest NCLEX step${fx.weak.length > 1 ? 's' : ''} this shift: ${fx.weak.map((w) => `<b>${esc(w.label)}</b> (${w.score})`).join(' and ')}. These questions, from other units, practice the same thinking.`) : '';
    return `<section class="ngn-sec" aria-labelledby="ngh"><div class="ngn-h"><h2 id="ngh">Practice questions</h2><p class="muted">In the formats the Next Generation NCLEX uses, scored the way NCSBN scores them. Every answer comes with the reasoning behind each option.</p></div>
      <h3 class="ngn-sub">From this shift</h3><ol class="ngn-list">${its.map((it, i) => ngnRow(it, i, 'shift')).join('')}</ol>
      ${fits.length ? `<h3 class="ngn-sub">Focus practice</h3><p class="ngn-fx">${why}</p><ol class="ngn-list">${fits.map((it, i) => ngnRow(it, i, 'focus')).join('')}</ol>` : ''}</section>`;
  }
  function ovNgn() {
    const its = ngnList(), q = ui.ngn, it = its[q.i], a = q.a, ck = q.checked, W = NG.whys(it);
    if (!it) { ui.ov = null; return ''; }
    const mark = (ok, on) => (!ck ? '' : ok ? ' right' : on ? ' wrong' : '');
    // After checking: the reason for an option, styled by whether you chose it and whether it was right.
    const rw = (txt, ok, on) => (!ck || !txt ? '' : `<small class="nb-why ${ok ? 'y' : 'n'}${on ? ' you' : ''}">${on ? '<i>Your choice</i>' : ok ? '<i>You missed this</i>' : ''}${esc(txt.replace(/^(Yes|No):\s*/, '').replace(/^[a-z]/, (c) => c.toUpperCase()))}</small>`);
    const stp = CJ ? CJ.STEPS.find((x) => x[0] === it.step) : null;
    const cnl = it.cn && NG.CN ? (NG.CN.find((x) => x[0] === it.cn) || [])[1] : '';
    let body = `<p class="ngn-tag">${esc(NG.TYPE[it.type])}${stp ? ` · Tests <b>${esc(stp[1])}</b>` : ''}${cnl ? ` · ${esc(cnl)}` : ''}${q.list === 'focus' ? ' · Focus practice' : ''}</p>${it.update ? `<p class="cs-up">${esc(it.update)}</p>` : ''}<p class="ngn-stem">${esc(it.stem)}</p><p class="ngn-q"><b>${esc(it.q)}</b></p>`;
    if (it.type === 'mc') {
      body += `<div class="ngn-opts" role="radiogroup">${it.opts.map((o, i) => { const on = a.m === i; return `<div class="nb-w"><button class="nb-opt rd${on ? ' on' : ''}${mark(o.ok, on)}" data-act="ngn-pick" data-k="m" data-v="${i}" role="radio" aria-checked="${on}" ${ck ? 'disabled' : ''}>${esc(o.t)}</button>${rw(W.opts[i], o.ok, on)}</div>`; }).join('')}</div>`;
    } else if (it.type === 'order') {
      const o = a.o || [];
      body += `<p class="muted ord-h">${ck ? 'Your order, with the correct position for anything out of place:' : 'Put the steps in order, first at the top. Use the arrows to move a step.'}</p><ol class="ord">${o.map((x, k) => `<li class="${ck ? (x === k ? 'right' : 'wrong') : ''}"><span class="ord-n">${k + 1}</span><span class="ord-t">${esc(it.opts[x])}${ck && x !== k ? `<small>Belongs at step ${x + 1}</small>` : ''}</span>${ck ? '' : `<span class="ord-b"><button class="icon-btn" data-act="ngn-move" data-k="${k}" data-d="-1" aria-label="Move up" ${k ? '' : 'disabled'}>▲</button><button class="icon-btn" data-act="ngn-move" data-k="${k}" data-d="1" aria-label="Move down" ${k < o.length - 1 ? '' : 'disabled'}>▼</button></span>`}</li>`).join('')}</ol>`;
      if (ck) body += `<h4 class="ord-c">The correct order</h4><ol class="nb-whys">${it.opts.map((t, i) => `<li><b>${esc(t)}</b>${rw(W.steps[i], true, true).replace('<i>Your choice</i>', '')}</li>`).join('')}</ol>`;
    } else if (it.type === 'num') {
      body += `<div class="num-in"><label for="ngn-num" class="sr">Your answer in ${esc(it.unit)}</label><input id="ngn-num" class="fb-t" inputmode="decimal" autocomplete="off" data-bind="ngn.n" value="${esc(a.n || '')}" ${ck ? 'disabled' : ''} placeholder="Answer"><span class="num-u">${esc(it.unit)}</span></div><p class="muted num-r">${esc(it.round || '')}</p>`;
      if (ck) body += `<h4 class="ord-c">Working it out</h4><ol class="num-w">${(it.work || []).map((w) => `<li>${esc(w)}</li>`).join('')}</ol>`;
    }
    if (it.type === 'bowtie') {
      const wk = { a: 'actions', c: 'cond', p: 'params' };
      const col = (k, lab, g, multi) => `<div class="bt-col bt-${k}"><h4>${lab}</h4>${g.opts.map((o, i) => { const on = multi ? (a[k] || []).includes(i) : a[k] === i, ok = multi ? g.ans.includes(i) : g.ans === i; return `<div class="nb-w"><button class="nb-opt${on ? ' on' : ''}${mark(ok, on)}" data-act="ngn-pick" data-k="${k}" data-v="${i}" aria-pressed="${on}" ${ck ? 'disabled' : ''}>${esc(o)}</button>${rw((W[wk[k]] || [])[i], ok, on)}</div>`; }).join('')}</div>`;
      body += `<div class="bowtie">${col('a', 'Actions to take (choose 2)', it.actions, true)}${col('c', 'Most likely condition (choose 1)', it.cond, false)}${col('p', 'Parameters to monitor (choose 2)', it.params, true)}</div>`;
    } else if (it.type === 'matrix') {
      body += `<div class="tbl-wrap"><table class="ngn-mx"><thead><tr><th></th>${it.cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${it.rows.map((r, ri) => `<tr><td class="wrap">${esc(r.t)}${ck ? `<small class="muted ngn-why">${esc(r.why)}</small>` : ''}</td>${it.cols.map((c, ci) => { const on = (a.r || [])[ri] === ci; return `<td><button class="nb-cell${on ? ' on' : ''}${mark(r.ans === ci, on)}" data-act="ngn-pick" data-k="r" data-row="${ri}" data-v="${ci}" aria-pressed="${on}" aria-label="${esc(c)}" ${ck ? 'disabled' : ''}>${on ? '●' : ''}</button></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`;
    } else if (it.type === 'sata') {
      body += `<div class="ngn-opts">${it.opts.map((o, i) => { const on = (a.s || []).includes(i); return `<div class="nb-w"><button class="nb-opt sq${on ? ' on' : ''}${mark(o.ok, on)}" data-act="ngn-pick" data-k="s" data-v="${i}" aria-pressed="${on}" ${ck ? 'disabled' : ''}>${esc(o.t)}</button>${rw(W.opts[i], o.ok, on)}</div>`; }).join('')}</div>`;
    } else if (it.type === 'highlight') {
      body += `<p class="ngn-note">${it.parts.map((o, i) => { const on = (a.s || []).includes(i); return `<button class="nb-hl${on ? ' on' : ''}${mark(o.ok, on)}" data-act="ngn-pick" data-k="s" data-v="${i}" aria-pressed="${on}" ${ck ? 'disabled' : ''}>${esc(o.t)}</button>`; }).join(' ')}</p>`;
      if (ck) body += `<ol class="nb-whys">${it.parts.map((o, i) => { const on = (a.s || []).includes(i); return `<li><b>${esc(o.t)}</b>${rw(W.parts[i], o.ok, on)}</li>`; }).join('')}</ol>`;
    } else if (it.type === 'cloze') {
      let k = 0; body += `<p class="ngn-cloze">${it.parts.map((p) => { if (typeof p === 'string') return esc(p); const bi = k++; return `<span class="ngn-blank">${p.opts.map((o, oi) => { const on = (a.d || [])[bi] === oi; return `<button class="nb-chip${on ? ' on' : ''}${mark(p.ans === oi, on)}" data-act="ngn-pick" data-k="d" data-row="${bi}" data-v="${oi}" aria-pressed="${on}" ${ck ? 'disabled' : ''}>${esc(o)}</button>`; }).join('')}</span>`; }).join('')}</p>`;
      if (ck) { let bi = 0; body += `<ol class="nb-whys">${it.parts.filter((p) => typeof p !== 'string').map((p) => { const k2 = bi++, v = (a.d || [])[k2]; return `<li><b>Blank ${k2 + 1}</b>${p.opts.map((o, oi) => (oi === p.ans || oi === v) ? `<span class="nb-bl"><em>${esc(o)}</em>${rw((W.blanks[k2] || [])[oi], oi === p.ans, oi === v)}</span>` : '').join('')}</li>`; }).join('')}</ol>`; }
    }
    if (ck) {
      const B = NG.breakdown(it, a), sc = B.score, mx = B.max;
      const pts = (n) => (n > 0 ? '+' + n : n < 0 ? '−' + -n : '0');
      const brows = B.rows.map((r) => `<tr class="${r.pts > 0 ? 'y' : r.pts < 0 ? 'n' : r.missed ? 'm' : 'z'}"><td>${esc(r.part)}</td><td>${B.pm ? (r.missed ? 'Not chosen (correct)' : r.ok ? 'Chosen, correct' : 'Chosen, incorrect') : `${esc(r.pick || '—')}${!r.ok && r.want ? `<small>Correct: ${esc(r.want)}</small>` : ''}`}</td><td class="n">${pts(r.pts)}</td></tr>`).join('');
      body += `<div class="ngn-res ${sc === mx ? 'full' : sc ? 'part' : 'none'}">
        <div class="nr-h"><b>${sc} of ${mx} points</b><span>${esc(B.math)}${B.pm && B.rows.some((r) => r.missed) ? `; ${B.rows.filter((r) => r.missed).length} correct option${B.rows.filter((r) => r.missed).length === 1 ? '' : 's'} not chosen` : ''}</span></div>
        ${B.all ? '' : `<div class="tbl-wrap"><table class="nr-t"><thead><tr><th>${it.type === 'matrix' ? 'Row' : B.pm ? 'Option' : 'Part'}</th><th>${B.pm ? 'Your answer' : 'You chose'}</th><th class="n">Points</th></tr></thead><tbody>${brows || `<tr><td colspan="3" class="muted">Nothing chosen.</td></tr>`}</tbody></table></div>`}
        <p class="nr-rule">${esc(B.rule)}</p>
        <h4>The reasoning</h4><p>${esc(it.why)}</p>
        ${W.tip ? `<p class="nr-tip"><b>Test-taking tip.</b> ${esc(W.tip)}</p>` : ''}
        ${stp ? `<p class="nr-step muted">This question tests <b>${esc(stp[1])}</b>: ${esc(stp[2])}</p>` : ''}</div>`;
    }
    const last = q.i === its.length - 1;
    const done = q.list === 'case' ? `<button class="btn btn-primary" data-act="cs-done">See how you did</button>` : q.list === 'bank' ? `<button class="btn btn-primary" data-act="pset-done">See your set</button>` : `<button class="btn btn-primary" data-act="close">Done</button>`;
    const foot = !ck ? `<button class="btn btn-primary" data-act="ngn-check" ${NG.complete(it, a) ? '' : `aria-disabled="true" data-why="${it.type === 'num' ? 'Type a number first.' : 'Answer every part first.'}"`}>Check answer</button>` : last ? done : `<button class="btn btn-primary" data-act="ngn-go" data-list="${q.list || 'shift'}" data-i="${q.i + 1}">Next question</button>`;
    if (q.list === 'case') {
      const c = NG.caseById(q.cs);
      return sheet(`${esc(c.title)} · ${q.i + 1} of 6`, `<div class="cs-wrap">${recordHTML(c, q.i)}<div class="cs-q">${body}</div></div>`, foot, { wide: true, label: 'Case study question', cls: 'cs-sheet' });
    }
    body += `<p class="ngn-rpt"><button class="rpt-btn" data-act="rpt" data-q="${esc(it.id)}">Report a problem with this question</button></p>`;
    return sheet(`Question ${q.i + 1} of ${its.length}: ${esc(NG.TYPE[it.type])}`, body, foot, { wide: true, label: 'Practice question' });
  }

  /* ------------ NCLEX practice: case studies, question bank, readiness ------------ */
  const CNL = (id) => (NG && NG.CN ? (NG.CN.find((x) => x[0] === id) || [])[1] : '') || '';
  const SPN = { ms: 'Med-surg', sd: 'Step-down', icu: 'ICU', ld: 'Labor and delivery', ed: 'Emergency', ob: 'Maternity', peds: 'Pediatrics', psy: 'Adult psych', teen: 'Teen psych', comm: 'Community', periop: 'Perioperative' };
  const SPC = { ms: 'ms', sd: 'sd', icu: 'icu', ld: 'ld', ed: 'ed', ob: 'ob', peds: 'peds', psy: 'psy', teen: 'teen', comm: 'ms', periop: 'ms' };
  // The chart for a case-study item: every entry that has appeared by now, by tab; what just appeared is marked New.
  function recordHTML(c, i) {
    const vis = c.record.filter((r) => r.at <= i), tabs = []; vis.forEach((r) => { if (!tabs.includes(r.tab)) tabs.push(r.tab); });
    const fresh = vis.filter((r) => r.at === i && i > 0), pick = (ui.ngn && ui.ngn.tab && tabs.includes(ui.ngn.tab)) ? ui.ngn.tab : (fresh[0] || vis[vis.length - 1]).tab;
    const ent = vis.filter((r) => r.tab === pick);
    const one = (r) => `<div class="rec-e${r.at === i && i > 0 ? ' new' : ''}"><div class="rec-t">${esc(r.time)}${r.at === i && i > 0 ? '<span class="rec-new">New</span>' : ''}</div>${r.text ? `<p>${esc(r.text)}</p>` : ''}${r.rows ? `<table class="rec-tb"><tbody>${r.rows.map((x) => `<tr class="${x[2] ? 'ab' : ''}"><th>${esc(x[0])}</th><td>${esc(x[1])}${x[2] ? ` <small>${esc(x[2])}</small>` : ''}</td></tr>`).join('')}</tbody></table>` : ''}</div>`;
    return `<aside class="cs-rec" aria-label="Medical record"><p class="rec-who"><b>${esc(c.client)}</b></p><div class="rec-tabs" role="tablist">${tabs.map((t) => `<button role="tab" aria-selected="${t === pick}" data-act="cs-tab" data-v="${esc(t)}">${esc(t)}${fresh.some((r) => r.tab === t) ? '<i aria-label="new"></i>' : ''}</button>`).join('')}</div><div class="rec-b">${ent.slice().reverse().map(one).join('')}</div></aside>`;
  }
  const pRec = (id) => (prof.ngn || {})[id];
  const lastOf = (r) => (r.last != null ? r.last : r.score);
  function pStats() {
    const by = { cn: {}, step: {} }; let pts = 0, max = 0, n = 0;
    Object.entries(prof.ngn || {}).forEach(([id, r]) => { const it = NG.byId(id); if (!it) return; const l = lastOf(r); n++; pts += l; max += r.max;
      [['cn', it.cn], ['step', it.step]].forEach(([k, v]) => { if (!v) return; const o = (by[k][v] = by[k][v] || { pts: 0, max: 0, n: 0 }); o.pts += l; o.max += r.max; o.n++; }); });
    return { by, pts, max, n };
  }
  function bankFiltered() {
    const f = ui.pf || {}, done = prof.ngn || {};
    return NG.bank().filter((x) => (!f.cn || x.cn === f.cn) && (!f.step || x.step === f.step) && (!f.type || x.type === f.type)
      && (!f.st || (f.st === 'new' ? !done[x.id] : f.st === 'missed' ? done[x.id] && lastOf(done[x.id]) < done[x.id].max : true)));
  }
  function startSet(list, label) {
    const done = prof.ngn || {}, rank = (x) => (!done[x.id] ? 0 : lastOf(done[x.id]) < done[x.id].max ? 1 : 2);
    let h = Date.now() % 997; const r = () => { h = (h * 9301 + 49297) % 233280; return h / 233280; };
    const ids = list.map((x) => [x, rank(x), r()]).sort((a, b) => a[1] - b[1] || a[2] - b[2]).slice(0, 10).map((x) => x[0].id);
    if (!ids.length) return;
    ui.pset = { ids, label, at: Date.now() }; ngnStart('bank', 0); ui.ov = 'ngn'; TEL.track('practice_set', { n: ids.length, label });
  }
  function chips(key, opts, all) {
    const f = ui.pf || {}; return `<div class="pf-row" role="group" aria-label="${esc(all)}"><span class="pf-l">${esc(all)}</span><div class="pf-c">${[['', 'All']].concat(opts).map(([v, l]) => `<button class="chip ${(f[key] || '') === v ? 'on' : ''}" data-act="pf" data-k="${key}" data-v="${v}" aria-pressed="${(f[key] || '') === v}">${esc(l)}</button>`).join('')}</div></div>`;
  }
  function vPractice() {
    const tab = ui.pTab || 'cases', St = pStats(), cs = NG.cases(), bank = NG.bank(), done = prof.ngn || {};
    const csDone = cs.filter((c) => c.items.every((x) => done[x.id])).length, pct = St.max ? Math.round(St.pts / St.max * 100) : null;
    const head = `<div class="pr-top"><button class="mark" data-act="home">The Shift</button><span class="pr-nav"><button class="btn btn-quiet" data-act="home">Shifts</button><button class="btn btn-quiet" data-act="ref">Pocket reference</button><button class="btn btn-quiet" data-act="settings">Settings</button><button class="btn btn-quiet hn-menu" data-act="menu" aria-label="Menu: settings, how it plays, pocket reference and more">Menu</button></span></div>
      <section class="pr-hero"><div><p class="pr-k">NCLEX practice</p><h1>Think like the exam. Then like the nurse.</h1><p class="lede">Unfolding case studies in the Next Generation NCLEX format, a question bank across every NCLEX-RN Client Needs category, and the reasoning behind every option.</p></div>
        <div class="pr-stats"><div><b>${St.n}</b><span>of ${bank.length + cs.length * 6} questions answered</span></div><div><b>${pct === null ? '–' : pct + '%'}</b><span>of points on your latest tries</span></div><div><b>${csDone} of ${cs.length}</b><span>case studies finished</span></div></div></section>
      <div class="pr-tabs" role="tablist">${[['cases', `Case studies <small>${cs.length}</small>`], ['bank', `Question bank <small>${bank.length}</small>`], ['ready', 'Readiness']].map(([k, l]) => `<button role="tab" aria-selected="${tab === k}" data-act="ptab" data-v="${k}">${l}</button>`).join('')}</div>`;
    let body = '';
    if (tab === 'cases') {
      body = `<p class="pr-note">Each case follows one client through six questions, one for each step of the clinical judgment model. The chart grows as the case unfolds, the way it does on the exam.</p><div class="pc-grid">${cs.map((c) => {
        const a = c.items.filter((x) => done[x.id]).length, p = c.items.reduce((n, x) => n + (done[x.id] ? lastOf(done[x.id]) : 0), 0), m = c.items.reduce((n, x) => n + NG.max(x), 0);
        return `<button class="pc sp-${SPC[c.sp] || 'ms'}" data-act="cs-open" data-id="${c.id}"><span class="pc-u">${esc(SPN[c.sp] || '')}</span><b class="pc-t">${esc(c.title)}</b><span class="pc-c">${esc(c.client)}</span><span class="pc-f"><span>${a ? (a === 6 ? `Finished · ${p} of ${m} points` : `${a} of 6 answered`) : '6 questions'}</span><span class="pc-go">${a === 6 ? 'Retry' : a ? 'Continue' : 'Start'} ›</span></span></button>`; }).join('')}</div>`;
    } else if (tab === 'bank') {
      const L = bankFiltered(), shown = ui.pAll ? L : L.slice(0, 40), types = [...new Set(bank.map((x) => x.type))];
      body = `<div class="pf">${chips('cn', NG.CN.map((x) => [x[0], x[1]]), 'Client Needs')}${chips('step', CJ.STEPS.map((x) => [x[0], x[1]]), 'Judgment step')}${chips('type', types.map((t) => [t, NG.TYPE[t]]), 'Format')}${chips('st', [['new', 'Not tried'], ['missed', 'Missed'], ['done', 'Tried']], 'Status')}</div>
        <div class="pr-go"><span><b>${L.length}</b> question${L.length === 1 ? '' : 's'} match</span><button class="btn btn-primary btn-go" data-act="pset" ${L.length ? '' : 'aria-disabled="true" data-why="Nothing matches these filters."'}>Start ${Math.min(10, L.length) || ''} question${Math.min(10, L.length) === 1 ? '' : 's'} <span aria-hidden="true">→</span></button></div>
        <p class="pr-note">Sets take up to ten, questions you haven't tried first, then ones you missed.</p>
        <ol class="qb-list">${shown.map((x) => { const r = done[x.id]; return `<li><button class="qb-row" data-act="qb-one" data-id="${x.id}"><span class="qb-t"><b>${esc(x.topic || NG.TYPE[x.type])}</b><small>${esc(CNL(x.cn))} · ${esc(NG.TYPE[x.type])} · ${esc(STEPNAME(x.step))}</small></span><span class="qb-s ${r ? (lastOf(r) === r.max ? 'ok' : 'miss') : ''}">${r ? `${lastOf(r)} of ${r.max}` : 'New'}</span></button></li>`; }).join('')}</ol>
        ${L.length > shown.length ? `<button class="btn" data-act="pall">Show all ${L.length}</button>` : ''}`;
    } else {
      const bar = (o, lab, sub, act) => { const p = o && o.max ? Math.round(o.pts / o.max * 100) : null; return `<div class="rd"><div class="rd-l"><b>${esc(lab)}</b><small>${esc(sub)}</small></div><div class="rd-b"><div class="bar" aria-hidden="true"><i style="width:${p || 0}%" class="${p === null ? '' : p >= 80 ? 'hi' : p >= 60 ? 'mid' : 'lo'}"></i></div><span>${p === null ? 'Not tried' : `${p}% · ${o.n} question${o.n === 1 ? '' : 's'}`}</span></div>${act}</div>`; };
      body = `<p class="pr-note">Your share of points on your latest try at each question, by NCLEX-RN Client Needs category and by clinical judgment step. It shows where to study; it isn't a pass prediction. The real exam is adaptive and scored pass or fail.</p>
        <h3 class="pr-h">By Client Needs category</h3>${NG.CN.map(([id, lab, w]) => bar(St.by.cn[id], lab, `${w} of the exam`, `<button class="btn btn-quiet rd-go" data-act="pset-cn" data-v="${id}">Practice ›</button>`)).join('')}
        <h3 class="pr-h">By clinical judgment step</h3>${CJ.STEPS.map(([id, lab, what]) => bar(St.by.step[id], lab, what, `<button class="btn btn-quiet rd-go" data-act="pset-step" data-v="${id}">Practice ›</button>`)).join('')}`;
    }
    return `<div class="home prac">${head}<section class="pr-body">${body}</section><div class="homefoot"><span>Written to current US nursing standards and reviewed for accuracy. Practice still varies by state and facility: follow your program and your policies.</span><span>${TERMS ? '<button class="acct-link" data-act="terms">Terms</button>' : ''}</span></div></div>`;
  }
  function ovPres() {
    const P = ui.pset; if (!P) return '';
    const its = P.ids.map((id) => NG.byId(id)).filter(Boolean), done = prof.ngn || {};
    const got = its.reduce((n, x) => n + (done[x.id] ? lastOf(done[x.id]) : 0), 0), mx = its.reduce((n, x) => n + NG.max(x), 0);
    return sheet('Your set', `<p class="pres-h"><b>${got} of ${mx} points</b> on ${its.length} question${its.length === 1 ? '' : 's'}${P.label ? ` · ${esc(P.label)}` : ''}</p><ol class="qb-list">${its.map((x, i) => { const r = done[x.id]; return `<li><button class="qb-row" data-act="ngn-go" data-list="bank" data-i="${i}"><span class="qb-t"><b>${esc(x.topic || '')}</b><small>${esc(CNL(x.cn))} · ${esc(STEPNAME(x.step))}</small></span><span class="qb-s ${r ? (lastOf(r) === r.max ? 'ok' : 'miss') : ''}">${r ? `${lastOf(r)} of ${r.max}` : '–'}</span></button></li>`; }).join('')}</ol><p class="muted">Tap a question to see it and its reasoning again.</p>`,
      `<button class="btn" data-act="close">Done</button><button class="btn btn-primary" data-act="pset">Another set</button>`, { label: 'Set results' });
  }
  function ovCsres() {
    const c = NG.caseById(ui.csres); if (!c) return '';
    const done = prof.ngn || {}, got = c.items.reduce((n, x) => n + (done[x.id] ? lastOf(done[x.id]) : 0), 0), mx = c.items.reduce((n, x) => n + NG.max(x), 0);
    return sheet(esc(c.title), `<p class="pres-h"><b>${got} of ${mx} points</b> across the six steps of clinical judgment.</p><ol class="cs-steps">${c.items.map((x, i) => { const r = done[x.id], p = r ? lastOf(r) : 0, m = NG.max(x); return `<li class="${p === m ? 'ok' : p ? 'part' : 'miss'}"><span class="cs-sn">${i + 1}</span><span class="qb-t"><b>${esc(STEPNAME(x.step))}</b><small>${esc(NG.TYPE[x.type])}</small></span><span class="qb-s">${p} of ${m}</span><button class="btn btn-quiet" data-act="cs-open" data-id="${c.id}" data-i="${i}" data-review="1">Review ›</button></li>`; }).join('')}</ol>
      <p class="muted">On the Next Generation NCLEX, each case study works the same way: one client, six questions, one per step. Where you lost points tells you which step of your thinking to practice.</p>`,
      `<button class="btn" data-act="cs-retry" data-id="${c.id}">Try it again</button><button class="btn btn-primary" data-act="close">Back to case studies</button>`, { label: 'Case study results' });
  }
  /* ------------ pocket reference ------------ */
  function ovRef() {
    const R = S.ref || [], c = ui.refCard && R.find((x) => x.id === ui.refCard);
    if (c) {
      const blk = (b) => `<section class="rf-b"><h3>${esc(b.h)}</h3>${b.rows ? `<table class="rf-t"><tbody>${b.rows.map((r) => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}${r[2] ? `<small>${esc(r[2])}</small>` : ''}</td></tr>`).join('')}</tbody></table>` : b.list ? `<ul>${b.list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : `<p>${esc(b.text)}</p>`}</section>`;
      return sheet(esc(c.title), `<p class="rf-blurb">${esc(c.blurb)}</p>${c.blocks.map(blk).join('')}<p class="rf-src muted">${esc(c.src || '')}</p>`, `<button class="btn" data-act="ref-back">All cards</button><button class="btn btn-primary" data-act="close">Done</button>`, { wide: true, label: c.title });
    }
    const groups = []; R.forEach((x) => { if (!groups.includes(x.group)) groups.push(x.group); });
    return sheet('Pocket reference', `<p class="muted" style="margin-top:0">Quick facts for the floor and the exam. Ranges vary by lab and facility; your policies win.</p>${groups.map((g) => `<h3 class="rf-g">${esc(g)}</h3><div class="rf-list">${R.filter((x) => x.group === g).map((x) => `<button class="rf-row" data-act="ref-card" data-id="${x.id}"><b>${esc(x.title)}</b><small>${esc(x.blurb)}</small></button>`).join('')}</div>`).join('')}`, `<button class="btn btn-primary" data-act="close">Done</button>`, { wide: true, label: 'Pocket reference' });
  }

  /* ------------ beta feedback ------------ */
  const PAY = [['yes', 'Yes'], ['maybe', 'Maybe'], ['no', 'No']];
  function fbCard() {
    const f = ui.fb || (ui.fb = {});
    if (f.sent) return `<section class="fbk sent" aria-live="polite"><h2>Thanks. I read every one of these.</h2><p class="muted">${f.sent === 'email' ? 'Your email app should have opened with it filled in. Hit send there.' : 'Every report gets read, and clinical problems get fixed first.'}</p></section>`;
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
    const qq = r.q;
    return sheet(j ? 'Report a problem with this' : qq ? 'Report a problem with this question' : 'Send feedback', `${j ? `<blockquote class="rp-q"><b>${esc(j.text)}</b><span>${esc(j.why)}</span></blockquote>` : qq ? `<blockquote class="rp-q"><b>${esc(NG.TYPE[qq.type] || 'Question')} · ${esc(qq.id)}</b><span>${esc(String(qq.stem || qq.q || '').slice(0, 240))}</span></blockquote>` : '<p class="muted" style="margin-top:0">Something wrong, confusing, or missing? Tell me what you saw.</p>'}
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
        <p class="muted">${st.busy ? 'Syncing…' : st.err ? `Last sync didn't go through: ${esc(st.err)}. It will try again.` : ago === null ? 'Not synced yet.' : ago < 1 ? 'Synced just now.' : `Synced ${ago} minute${ago === 1 ? '' : 's'} ago.`}</p>
        <p class="muted" style="margin-bottom:0">${a.delErr ? `Couldn't delete the account: ${esc(a.delErr)}` : 'Done with The Shift? <button class="acct-link" data-act="acct-del-ask">Delete your account</button> and everything saved to it.'}</p>`,
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
  /* Your class: a student joins an instructor's class with a code, so the instructor sees their results. */
  function ovClass() {
    const st = CL.status() || {}, c = ui.cls || (ui.cls = {});
    const teach = location.protocol.startsWith('http') ? '<p class="muted" style="font-size:.85rem">Teaching? <a href="/teach/" target="_blank" rel="noopener">Open the instructor dashboard</a> to make a class and get a code.</p>' : '';
    if (st.state !== 'in') return sheet('Your class', `<p style="margin-top:0">If your instructor gave you a class code, join here and they'll see how your shifts and practice questions go: scores by skill and NCLEX step, and the decisions to rethink. Nobody else sees them.</p>
      <p>Sign in first, so your results are tied to you and not to this device.</p>${teach}`,
      `<button class="btn" data-act="close">Not now</button><button class="btn btn-primary" data-act="account">Sign in</button>`, { label: 'Your class' });
    if (!c.list && !c.loading) { c.loading = true; CL.myClasses().then((L) => { c.list = L; c.loading = false; render(); }).catch((e) => { c.list = []; c.loading = false; c.err = e.message; render(); }); }
    const L = c.list || [];
    const rows = c.loading ? '<p class="muted">Loading your classes…</p>' : L.length ? `<ul class="cls-list">${L.map((k) => `<li><span><b>${esc(k.name || 'Class')}</b><br><small class="muted">Code ${esc(k.code || '')} · your instructor sees you as ${esc(k.as)}${k.pack ? ' · all shifts included' : ''}</small></span><button class="btn" data-act="cls-leave" data-id="${esc(k.id)}">Leave</button></li>`).join('')}</ul>` : '';
    return sheet('Your class', `${L.length ? '' : '<p style="margin-top:0">Join with the code your instructor gave you. They\'ll see your shift scores by skill and NCLEX step, the decisions to rethink, and your practice-question results. Nobody else sees them.</p>'}${rows}
      <label class="fb-l" for="cls-code">${L.length ? 'Join another class' : 'Class code'}</label>
      <input id="cls-code" class="fb-t acct-in cls-code" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="8" data-bind="cls.code" value="${esc(c.code || '')}" placeholder="ABC234">
      <label class="fb-l" for="cls-name">Your name, as your instructor should see it</label>
      <input id="cls-name" class="fb-t acct-in" autocomplete="name" maxlength="60" data-bind="cls.name" value="${esc(c.name || '')}" placeholder="First and last name">
      ${c.err ? `<p class="acct-err" role="alert">${esc(c.err)}</p>` : ''}${c.ok ? `<p class="cls-ok" role="status">${esc(c.ok)}</p>` : ''}
      <p class="muted" style="font-size:.85rem">Results from shifts you've already played on this device go too.</p>${teach}`,
      `<button class="btn" data-act="close">Done</button><button class="btn btn-primary" data-act="cls-join" ${c.busy ? 'aria-disabled="true" data-why="Joining…"' : ''}>${c.busy ? 'Joining…' : 'Join class'}</button>`, { label: 'Your class' });
  }
  function ovPack() {
    const lockedIds = CASES.filter((id) => !(PACK.free || []).includes(id)), freeN = CASES.length - lockedIds.length;
    const st = CL ? CL.status() || {} : {}, w = ui.packWait;
    if (owned()) return sheet('Shift pack unlocked', `<p style="margin-top:0">Every shift is open${CL.owns('pack') === 'class' ? ', through your class' : ''}. Thanks for supporting The Shift.</p>`, `<button class="btn btn-primary" data-act="close">Play</button>`, { label: 'Shift pack' });
    if (w) return sheet('Finishing your purchase', `<p style="margin-top:0">${w === 'slow' ? 'Your payment went through, but the unlock hasn\'t reached your account yet. It usually takes a few seconds. Check again in a minute; if it still doesn\'t show, email us and we\'ll sort it out.' : 'Checking with your account…'}</p>`,
      `<button class="btn" data-act="close">Close</button><button class="btn btn-primary" data-act="pack-check">Check again</button>`, { label: 'Shift pack' });
    const list = `<ul class="pack-list">${lockedIds.map((id) => { const k = E.getCase(id); return `<li><b>${esc(k.title)}</b><small>${esc(specOf(id).name)} · ${esc(diffLabel(id))} · ${esc(k.card)}</small></li>`; }).join('')}</ul>`;
    const intro = `<p style="margin-top:0">${freeN} shifts are free to play as much as you like. The shift pack opens the other ${lockedIds.length}, and every shift we add after this, for one payment of <b>${esc(PACK.price || '')}</b>. No subscription.</p>${list}`;
    const school = CL ? '<p class="muted" style="font-size:.9rem">Is your school paying? <button class="acct-link" data-act="cls">Join your class</button> with the code from your instructor and every shift opens.</p>' : '';
    if (!CL) return sheet('The shift pack', intro + '<p class="muted">Buying the pack needs the online version of The Shift.</p>', `<button class="btn btn-primary" data-act="close">Close</button>`, { label: 'Shift pack' });
    if (st.state !== 'in') return sheet('The shift pack', intro + '<p>Sign in first, so the pack belongs to your account and opens on every device you use.</p>' + school,
      `<button class="btn" data-act="close">Not now</button><button class="btn btn-primary" data-act="account">Sign in to buy</button>`, { label: 'Shift pack' });
    return sheet('The shift pack', intro + school + `<p class="muted" style="font-size:.85rem">Payment is handled by Stripe. Already bought it? <button class="acct-link" data-act="pack-check">Check again</button></p>`,
      `<button class="btn" data-act="close">Not now</button>${PACK.checkoutUrl ? `<button class="btn btn-primary" data-act="pack-buy">Unlock for ${esc(PACK.price || '')}</button>` : '<button class="btn btn-primary" aria-disabled="true" data-why="Purchases open soon.">Coming soon</button>'}`, { label: 'Shift pack' });
  }
  /* After a cloud sync, pick up the merged progress (and a newer shift from another device, if this one has none open). */
  /* Back from Stripe: the webhook writes the purchase; poll the account until it shows. */
  function packPoll(n) {
    CL.checkOwns().catch(() => {}).then(() => {
      if (owned()) { ui.packWait = null; TEL.track('pack_unlocked', {}); if (ui.ov === 'pack' || !ui.ov) ui.ov = 'pack'; render(); return; }
      if (n > 1) return setTimeout(() => packPoll(n - 1), 2000);
      ui.packWait = 'slow'; ui.ov = 'pack'; render();
    });
  }
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
      { sel: '.st-intro', text: 'This is the nurses\' station, your home base. You start here and come back here between rooms to plan, read the phone and get help.' },
      { sel: () => `.door[data-pid="${(s.answers.rank || [])[0]}"]`, alt: '.door[data-act="goto"]', text: 'You picked this room first. Tap the door, or a name below, to walk in. The clock only moves when you act.' },
      { sel: '.phone', text: () => `Your unit phone. ${cna().name}, the lab, pharmacy and the doctors reach you here. Some messages need an answer.` },
      { sel: '.helpers', text: () => `Your team, always up here. Nova gives tips when you're stuck. ${cna().name}, your ${/^[A-Z]{2,}/.test(cna().role) ? cna().role : cna().role.toLowerCase()}, can take routine work like vitals off your plate: tap ${cna().name} to see what's worth handing off.` },
      { sel: '.skip', text: 'Caught up? Skip ahead. The clock runs until something needs you, then stops. Care XP, your streak and four shift goals sit up top.' },
    ],
    /* The first room is a guided walk: each "do" step waits for the player to actually do it. */
    room: [
      { sel: '.pt', text: () => `Meet ${def(s.loc).short}. Tap the patient to see how they look and hear what they say. Looking and listening are free: the clock doesn't move.`, until: () => !!ui.caption, try: true },
      { sel: '[data-act="dock"][data-id="assess"]', text: 'Open Assess. Vital signs and body-system checks live here.', until: () => ui.dock === 'assess', try: true },
      { sel: '[data-act="assess"][data-sys="vitals"]', text: 'Take a set of vital signs. Every check shows what it costs in minutes, and the clock moves when you commit.', until: () => youVitals() > (ui.guide0 || 0), try: true },
      { sel: '.vstrip', alt: '.feed', text: 'Your findings land here, with the time you got them. Compare them with what you heard in report, and look at the trend, not just this set.' },
      { sel: '.plate-btns [data-act="chart"]', alt: '[data-act="chart"]', text: 'Before you give or hold anything, check the chart: labs, orders and the medication record (MAR). Open it now.', until: () => ui.ov === 'chart' || !!ui.guideChart, try: true },
      { sel: '[data-act="dock"][data-id="care"]', alt: '[data-act="dock"]', text: () => `Care, meds and talking work the same way: pick it, see the cost, commit. To talk with ${def(s.loc).short}, tap their speech bubble. When this room is handled, go back to the station: ${Math.max(0, pts().length - 1)} more patients are waiting.` },
      { sel: '[data-act="nova"]', text: 'Stuck? Nova, your charge nurse, gives a few nudges a shift. She points; she won\'t answer for you.' },
    ],
  };
  const youVitals = () => { const P = s && s.loc && s.p[s.loc]; return P && P.vit ? P.vit.filter((x) => x.by === 'You').length : 0; };
  function coachFor() {
    if (!s || s.ended || (ui.intro !== null && ui.intro !== undefined)) return null;
    const key = ui.view === 'station' ? 'station' : ui.view === 'room' ? 'room' : null;
    if (!key || seen('coach:' + key)) return null;
    ui.coachStep = ui.coachStep || {};
    if (key === 'room' && ui.guidePid !== s.loc) { ui.guidePid = s.loc; ui.guide0 = youVitals(); ui.guideChart = false; if (!ui.coachStep.room) TEL.track('tour_start', { case: s.caseId }); }
    // Steps the player completes by doing them advance on their own, even behind an open sheet.
    let i = ui.coachStep[key] || 0;
    while (COACH[key][i] && COACH[key][i].until && COACH[key][i].until()) { i += 1; ui.coachStep[key] = i; if (key === 'room') TEL.track('tour_step', { step: i, case: s.caseId }); }
    if (!COACH[key][i]) { markSeen('coach:' + key); if (key === 'room') TEL.track('tour_done', { case: s.caseId }); return null; }
    if (ui.ov) return null;
    const step = COACH[key][i];
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
      card.innerHTML = `<p>${esc(typeof c.step.text === 'function' ? c.step.text() : c.step.text)}</p><div class="coach-f"><span class="dots">${Array.from({ length: c.n }, (_, k) => `<i class="${k === c.i ? 'on' : ''}"></i>`).join('')}</span><button class="btn btn-quiet" data-act="coach-skip">${c.key === 'room' ? 'Skip tour' : 'Skip tips'}</button>${c.step.try ? '<span class="coach-try">Tap the highlighted spot</span>' : `<button class="btn btn-primary" data-act="coach-next">${c.i === c.n - 1 ? 'Got it' : 'Next'}</button>`}</div>`;
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
    requestAnimationFrame(tick); setTimeout(() => { n.textContent = to; }, dur + 120);   // rAF can stall in a background tab; never leave the count short
  }

  /* ------------ overlays ------------ */
  function sheet(title, body, foot, opts) {
    opts = opts || {};
    return `<div class="scrim" data-act="${opts.noScrimClose ? '' : 'close'}" data-scrim="1"><div class="sheet ${opts.wide ? 'wide' : ''} ${opts.cls || ''}" role="dialog" aria-modal="true" aria-label="${esc(opts.label || title)}">
      <div class="sheet-h">${opts.face || ''}<h2>${title}</h2>${opts.noClose ? '' : `<button class="icon-btn" data-act="close" aria-label="Close">${ICON.close}</button>`}</div>
      <div class="sheet-b">${body}</div>${foot ? `<div class="sheet-f">${foot}</div>` : ''}</div></div>`;
  }

  const ehrName = (n) => { const p = n.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.) /, '').split(' '); return p.length > 1 ? p[p.length - 1].toUpperCase() + ', ' + p.slice(0, -1).join(' ') : n; };
  const mrn = (d) => { let h = 7; for (const ch of d.name + d.room) h = (h * 31 + ch.charCodeAt(0)) % 9999991; return String(h).padStart(7, '0'); };
  function ovChart() {
    const pid = ui.chart.pid, tab = ui.chart.tab, d = def(pid), P = s.p[pid];
    const tabs = [['overview', 'Overview'], ['vitals', 'Vitals'], ['labs', 'Labs'], ['orders', 'Orders'], ['mar', 'MAR'], ['notes', 'Notes'], ['io', 'Intake/output']];
    let b = '';
    if (tab === 'overview') b = `<dl class="kv"><dt>Patient</dt><dd>${esc(d.name)}, ${ageSex(d)}. ${esc(d.bio)}</dd><dt>Admitted for</dt><dd>${esc(d.reason)}</dd><dt>Problem</dt><dd>${esc(liveDef(d).dx)}</dd><dt>History</dt><dd>${liveDef(d).hx.map(esc).join('<br>')}</dd><dt>Allergies</dt><dd>${/^(no known|nkda|none)/i.test(liveDef(d).allergies || "") ? esc(liveDef(d).allergies) : `<b style="color:var(--red)">${esc(liveDef(d).allergies)}</b>`}</dd><dt>Code status</dt><dd>${esc(liveDef(d).code)}</dd><dt>Weight</dt><dd>${esc(liveDef(d).weight)}</dd><dt>Lines and devices</dt><dd>${liveDef(d).lines.map(esc).join('<br>')}</dd><dt>Mobility</dt><dd>${esc(d.mobility)}</dd><dt>Diet</dt><dd>${esc(d.diet)}</dd></dl>`;
    if (tab === 'vitals') {
      const ab = (k, v) => abn(d, k, v);
      b = `<div class="tbl-wrap"><table><caption class="sr">Vital sign flowsheet</caption><thead><tr><th>Time</th><th>Temp °C</th><th>HR</th><th>BP</th><th>RR</th><th>SpO₂</th><th>O₂</th><th>Pain</th><th>By</th></tr></thead><tbody>
        ${P.vit.slice().reverse().map((v) => `<tr><td>${E.clock(v.t)}</td><td class="${ab('T', v.T) ? 'ab' : ''}">${fT(v.T)}${ab('T', v.T) ? ' ▲' : ''}</td><td class="${ab('HR', v.HR) ? 'ab' : ''}">${v.HR}${ab('HR', v.HR) ? (v.HR < norm(d, 'HR')[0] ? ' ▼' : ' ▲') : ''}</td><td class="${ab('SBP', v.SBP) ? 'ab' : ''}">${v.SBP}/${v.DBP}${ab('SBP', v.SBP) ? ' ▼' : ''}</td><td class="${ab('RR', v.RR) ? 'ab' : ''}">${v.RR}</td><td class="${ab('SpO2', v.SpO2) ? 'ab' : ''}">${v.SpO2}%</td><td>${esc(v.O2)}</td><td>${v.pain}</td><td>${esc(v.by)}</td></tr>`).join('')}</tbody></table></div>
        ${P.bgs ? `<h3 style="margin:1.2rem 0 .5rem">Point-of-care glucose</h3>${P.bgs.length ? `<div class="tbl-wrap"><table><thead><tr><th>Time</th><th>mg/dL</th><th>By</th></tr></thead><tbody>${P.bgs.slice().reverse().map((g) => `<tr><td>${E.clock(g.t)}</td><td class="${g.val < 70 ? 'ab' : ''}">${g.val}${g.val < 70 ? ' ▼' : ''}</td><td>${esc(g.by)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No glucose checked this shift.</p>'}` : ''}
        <p class="muted" style="font-size:.85rem">▲ ▼ outside the normal range.</p>`;
    }
    if (tab === 'labs') {
      P.k.labsSeen = s.t; if (pid === '418') P.kSeen = true;
      b = `<div class="tbl-wrap"><table><thead><tr><th>Resulted</th><th>Test</th><th>Result</th><th>Flag</th><th>Reference</th></tr></thead><tbody>${P.labs.slice().sort((a, b2) => b2.t - a.t).map((l) => `<tr><td>${(C().start || 420) + l.t < -1440 ? 'Prior' : (C().start || 420) + l.t < 0 ? 'Yesterday ' + E.clock(l.t) : E.clock(l.t)}</td><td>${esc(l.name)}</td><td class="${l.flag ? 'ab' : ''} wrap">${esc(fLab(l))} ${esc(l.unit)}</td><td class="flag">${l.flag === 'H' ? 'High' : l.flag === 'L' ? 'Low' : l.flag === 'A' ? 'Abnormal' : ''}</td><td class="wrap">${esc(l.ref)}</td></tr>`).join('')}</tbody></table></div>`;
    }
    if (tab === 'orders') b = `<ul class="list">${P.orders.slice().reverse().map((o) => `<li>${esc(o.text)}${o.isNew ? '<span class="new-tag">New ' + E.clock(o.t) + '</span>' : ''}</li>`).join('')}</ul>`;
    if (tab === 'mar') b = `<p class="muted" style="margin-top:0">${s.loc === pid && ui.view === 'room' ? 'You are at the bedside. Select a medication to review it.' : 'Medications are given at the bedside. Go to the room to give or hold.'}</p><div class="tbl-wrap"><table><thead><tr><th>Medication</th><th>Route</th><th>Frequency</th><th>Status</th><th></th></tr></thead><tbody>${d.meds.filter((m) => !m.available || m.available(s, P)).map((m) => { const st = medStatus(m); const inRoom = s.loc === pid && ui.view === 'room' && !m.later && m.initStatus !== 'given'; return `<tr><td class="wrap"><b>${esc(m.name)}</b> ${esc(medDose(m))}${m.param ? `<br><small class="muted">${esc(m.param)}</small>` : ''}${m.indication ? `<br><small class="muted">${esc(m.indication)}</small>` : ''}</td><td>${m.route}</td><td class="wrap">${esc(m.freq)}</td><td><b class="${st.cls === 'late' ? 'ab' : ''}">${st.text}</b></td><td>${inRoom ? `<button class="btn" data-act="med" data-id="${m.id}">Review</button>` : ''}</td></tr>`; }).join('')}</tbody></table></div>`;
    if (tab === 'notes') b = `<ul class="list">${P.notes.slice().reverse().map((n) => `<li><div class="src">${esc(n.author)}, ${(C().start || 420) + n.t < 0 ? 'yesterday' : E.clock(n.t)}</div><div class="voice">${esc(n.text)}</div></li>`).join('')}</ul>`;
    if (tab === 'io') b = `<dl class="kv"><dt>Intake</dt><dd>${esc(d.io.intake)}</dd><dt>Output</dt><dd>${esc(d.io.output)}</dd><dt>Diet</dt><dd>${esc(d.diet)}</dd></dl><p class="muted" style="font-size:.85rem">Last 24 hours, charted by night shift. Assess GI/GU at the bedside for current status.</p>`;
    return `<div class="scrim" data-act="close" data-scrim="1" style="padding:0;justify-content:flex-end"></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="Chart for ${esc(d.name)}">
      <div class="chart-h"><div class="who"><b>${esc(ehrName(d.name))}</b> <span>${ageSex(d)}, Rm ${d.room}, MRN ${mrn(d)}</span><span class="ehr-tags"><span class="ehr-tag ${/No known/.test(liveDef(d).allergies) ? '' : 'al'}">${/No known/.test(liveDef(d).allergies) ? 'NKDA' : 'ALLERGY: ' + esc(liveDef(d).allergies.split(',')[0].split('(')[0].trim())}</span><span class="ehr-tag ${/^Full code/.test(liveDef(d).code) ? '' : 'cd'}">${esc(liveDef(d).code.split(',')[0])}</span><span class="ehr-tag">Wt ${esc(String(liveDef(d).weight).split(' (')[0])}</span></span></div>
      <div class="seg" role="group" aria-label="Switch patient">${pts().map((p) => `<button data-act="chart" data-pid="${p.id}" data-tab="${tab}" aria-pressed="${p.id === pid}">${p.room}</button>`).join('')}</div>
      <button class="btn" data-act="close">${ICON.close}Close chart</button></div>
      <div class="chart-tabs" role="tablist">${tabs.map(([id, l]) => `<button role="tab" data-act="chart" data-pid="${pid}" data-tab="${id}" aria-selected="${tab === id}">${l}</button>`).join('')}</div>
      <div class="chart-b">${b}</div></aside>`;
  }

  const PREP = { vitals: ['Take vital signs', 4], apical: ['Count apical pulse and BP', 2], pain: ['Assess pain and sedation', 2], bg: ['Check glucose', 3], intake: ['Check breakfast tray', 1], ciwa: ['Score CIWA-Ar', 4], strip: ['Look at the monitor strip', 1], labs: ['Review the morning labs', 2] };
  /* PRN safety net for orders that don't define their own limit: the frequency on the order is the limit, the way
     a dispensing cabinet enforces it. "Every 6 h" waits 6 hours, "every 5 min ×3" stops after three, "Once" is once. */
  function prnLimit(m, st) {
    if (!m.prn || m.infusion || !st || !st.given || !st.given.length) return null;
    const f = String(m.freq || ''), last = st.given[st.given.length - 1], n = st.given.length;
    if (/^\s*once\b/i.test(f) || /\bonce,/i.test(f)) return `Given at ${E.clock(last)}. This is a one-time order.`;
    const x = /(?:×|x)\s*(\d+)/i.exec(f); if (x && n >= +x[1]) return `Given ${n} times (last ${E.clock(last)}). The order allows ${x[1]}. Call the provider for more.`;
    const e = /every\s+(\d+(?:\.\d+)?)(?:\s*(?:to|–|-)\s*\d+)?\s*(min|minutes|h|hr|hours?)\b/i.exec(f); if (!e) return null;
    const gap = +e[1] * (/^m/i.test(e[2]) ? 1 : 60);
    return s.t - last < gap ? `Given at ${E.clock(last)}. Next dose available at ${E.clock(last + gap)} (${f.split(/[,;]/)[0].toLowerCase()}).` : null;
  }
  function ovMed() {
    const d = def(s.loc), P = s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id), st = s.meds[m.id], Ax = A();
    const checks = m.checks ? m.checks(s, P, Ax) : [];
    const block = m.block ? m.block(s, P, Ax) : prnLimit(m, st);
    const done = !m.prn && (st.status === 'given' || st.status === 'held');
    const verify = st.status === 'verify';
    const refuse = !done && !block && !verify && m.refuse ? m.refuse(s, P, Ax) : null;
    let body = `<div class="order"><b>${esc(m.name)} ${esc(medDose(m))} ${m.route}</b>, ${esc(m.freq)}${m.indication ? `<br><span class="muted">${esc(m.indication)}</span>` : ''}${m.param ? `<br><b>${esc(m.param)}</b>` : ''}</div>
      <p class="muted" style="margin:.2rem 0">Allergies: ${esc(liveDef(d).allergies)}</p>
      <ul class="checks">${checks.map((c) => `<li><span class="g ${c.ok === true ? 'ok' : c.ok === false ? 'bad' : 'na'}" aria-hidden="true">${c.ok === true ? '✓' : c.ok === false ? '!' : '•'}</span><span>${esc(c.label)}<small>${esc(c.value)}</small></span></li>`).join('')}</ul>`;
    if (m.prep && m.prep.length && !done) body += `<p class="muted" style="margin:.6rem 0 0;font-size:.88rem">Get what you need before deciding:</p><div class="prep">${m.prep.map((p) => { const x = (def(s.loc).interventions || []).find((i) => i.id === p), lab = PREP[p] || (x ? [x.label, x.cost] : null); if (!lab) return ''; const lf = s.log.slice().reverse().find((l) => l.pid === d.id && l.kind === 'find' && [lab[0], x && x.label, p === 'vitals' && 'Vital signs', p === 'pain' && sysL('pain', (SYS.find((y) => y[0] === 'pain') || [])[1] || '')].includes(l.label) && s.t - l.t <= 30); return lf ? `<button class="btn prep-done" data-act="prep" data-p="${p}" aria-label="${esc(lab[0])}: done at ${E.clock(lf.t)}. Again, ${lab[1]} minutes">${ICON.tick}${esc(lab[0])} <span class="muted">done ${E.clock(lf.t)} · again ${lab[1]} min</span></button>` : `<button class="btn" data-act="prep" data-p="${p}">${esc(lab[0])} <span class="muted">${lab[1]} min</span></button>`; }).join('')}</div>`;
    if (ui.med.note) body += `<div class="warnbox" role="status">${esc(ui.med.note)}</div>`;
    if (block) body += `<div class="warnbox">${esc(block)}</div>`;
    if (refuse) body += `<div class="warnbox">${esc(refuse)}</div>${m.prn ? '' : '<p class="muted" style="margin:.4rem 0 0;font-size:.88rem">You can come back and offer it again, or hold it and document the refusal.</p>'}`;
    if (verify) { const ph = (d.interventions || []).concat(d.comms || []).find((x) => /pharmac/i.test(x.label) && (!x.avail || x.avail(s, P, Ax))), tab = ph && (d.interventions || []).includes(ph) ? 'Care' : 'Talk & call'; body += `<div class="warnbox">Pharmacy has not verified this order. It can't be dispensed yet.${ph ? ` To find out what they need, use <b>${esc(ph.label)}</b> on the ${tab} tab.` : ' Check your messages: pharmacy usually says what they need to release it.'}</div>`; }
    if (done) body += `<div class="warnbox">${st.status === 'given' ? 'Given' : 'Held'} at ${E.clock(st.at)}.${st.note ? ' ' + esc(st.note) : ''}</div>`;
    if (m.doses && !block && !verify && !refuse) body += `<fieldset style="border:0;padding:0;margin:.6rem 0"><legend style="font-weight:600;margin-bottom:.2rem">Dose</legend>${m.doses.map((x) => `<label class="opt"><input type="radio" name="dose" value="${x.id}" ${ui.med.dose == x.id ? 'checked' : ''} data-act="dose" data-v="${x.id}"><span>${esc(x.label)}</span></label>`).join('')}</fieldset>`;
    if (ui.med.holding) body += `<fieldset style="border:0;padding:0;margin:.6rem 0"><legend style="font-weight:600;margin-bottom:.2rem">Reason for holding</legend>${['Meets the hold parameter', 'Condition changed, clarify with provider', 'Not enough intake', 'Patient declined'].map((r, i) => `<label class="opt"><input type="radio" name="hr" data-act="hreason" data-v="${i}" ${ui.med.reason == i ? 'checked' : ''}><span>${r}</span></label>`).join('')}</fieldset>`;
    let foot = '';
    if (done && st.status === 'held' && !block) foot += `<button class="btn" data-act="med-unhold">Undo the hold <span style="font-weight:400;opacity:.8">so you can give it</span></button>`;
    if (!done && !block && !verify) {
      if (ui.med.holding) foot += `<button class="btn btn-primary" data-act="med-hold" ${ui.med.reason == null ? 'disabled data-why="Choose a reason for holding first."' : ''}>Hold this dose</button>`;
      else {
        if (!m.prn) foot += `<button class="btn" data-act="med-holdask">Hold</button>`;
        if (refuse) foot += `<button class="btn btn-primary" data-act="med-declined">Offer again later <span style="font-weight:400;opacity:.8">2 min</span></button>`;
        else { const dl = m.doses && ui.med.dose != null ? m.doses.find((x) => x.id == ui.med.dose) : null, dshort = dl ? dl.label.split(/ \(|: /)[0] : '', what = m.infusion ? (dshort ? `Set the pump: ${dshort}` : 'Set the pump') : `Give ${esc(m.name)}${dshort ? ' ' + dshort : ''}`;
          foot += `<button class="btn btn-primary holdbtn" data-act="med-give" data-hold="1" data-hk="med-give:${m.id}" ${m.doses && ui.med.dose == null ? 'disabled data-why="Choose a dose first."' : ''}><i class="hold-fill" aria-hidden="true"></i><span class="hold-l">${esc(what)}<small class="hold-how">Press and hold, or tap twice</small></span> <span style="font-weight:400;opacity:.8">${P.medPassAt !== undefined && s.t - P.medPassAt <= 6 ? '2 min, same med pass' : '5 min'}</span></button>`; }
      }
    }
    return sheet(esc(m.name), body, foot, { label: 'Medication ' + m.name });
  }

  // Medications given to this patient this shift, newest first: what the nurse could report as a possible error.
  function givenList(d) {
    const out = [];
    (d.meds || []).forEach((m) => { const st = s.meds[m.id]; if (!st) return; (m.prn ? st.given : st.status === 'given' && st.at !== null ? [st.at] : []).forEach((t) => out.push({ mid: m.id, t, name: lcFirst(m.name) })); });
    return out.sort((a, b) => b.t - a.t).slice(0, 8);
  }
  /* SBAR: what the nurse has already done for this patient, from the shift log, so a call always reflects the
     latest actions even where the case's own findings list doesn't. Skips anything a case item already says. */
  function doneFor(pid, items) {
    const latest = new Map();
    s.log.forEach((l) => { if (l.pid === pid && l.label && (l.kind === 'act' || l.kind === 'find')) latest.set(l.label, l); });
    const have = items.filter((i) => i.need).map((i) => i.label.toLowerCase());
    return [...latest.values()].filter((l) => {
      const m = l.label.match(/^(.+?) (given|held|declined|offered, declined)$/); if (!m) return true;
      const k = m[1].toLowerCase().split(/[ ,(]/)[0];
      return !have.some((h) => h.includes(k) && (m[2] === 'given' ? /\b(gave|given|after)\b/.test(h) : /\b(held|hold|declin|refus)/.test(h)));
    }).sort((a, b) => b.t - a.t).slice(0, 8);
  }
  function didText(l) {
    const m = l.label.match(/^(.+?) (given|held|declined|offered, declined)$/), c = lcFirst;
    const inf = l.label.match(/^(.+?) (stopped|rate changed|checked, no change)$/);
    if (inf) return inf[2] === 'stopped' ? `Stopped the ${c(inf[1])}` : inf[2] === 'rate changed' ? `Changed the ${c(inf[1])} rate` : `Checked the ${c(inf[1])}: no change`;
    if (m) return m[2] === 'given' ? `Gave ${c(m[1])}` : m[2] === 'held' ? `Held ${c(m[1])}` : `${m[1]}: offered, patient declined`;
    const x = l.label.replace(/ \((ordered|protocol[^)]*|new order)\)$/i, ''), w = x.split(' ')[0], past = PAST[w];
    return past ? past + x.slice(w.length) : `Done: ${c(x)}`;
  }
  // Past tense for the verbs that start action labels, so "Start a bolus" is reported as "Started a bolus".
  const PAST = { Check: 'Checked', Call: 'Called', Start: 'Started', Recheck: 'Rechecked', Reassess: 'Reassessed', Review: 'Reviewed', Give: 'Gave', Turn: 'Turned', Ask: 'Asked', Read: 'Read', Remove: 'Removed', Draw: 'Drew', Apply: 'Applied', Offer: 'Offered', Chart: 'Charted', Coach: 'Coached', Walk: 'Walked', Reorient: 'Reoriented', Stop: 'Stopped', Look: 'Looked', Sit: 'Sat', Weigh: 'Weighed', Prepare: 'Prepared', Send: 'Sent', Raise: 'Raised', Increase: 'Increased', Bring: 'Brought', Repeat: 'Repeated', Change: 'Changed', Put: 'Put', Measure: 'Measured', Search: 'Searched', Place: 'Placed', Gently: 'Gently', Keep: 'Kept', Assess: 'Assessed', Extubate: 'Extubated', Get: 'Got', Feel: 'Felt', Pull: 'Pulled', Wait: 'Waited', Reposition: 'Repositioned', Count: 'Counted', Lower: 'Lowered', Score: 'Scored', Dim: 'Dimmed', Pick: 'Picked', Return: 'Returned', Stay: 'Stayed', Hang: 'Hung', Swap: 'Swapped', Massage: 'Massaged', Pause: 'Paused', Resume: 'Resumed', Release: 'Released', Debrief: 'Debriefed', Compare: 'Compared', Clean: 'Cleaned', Hold: 'Held', Warm: 'Warmed', Document: 'Documented', Page: 'Paged', Make: 'Made', Run: 'Ran', Evaluate: 'Evaluated', Disconnect: 'Disconnected', Pass: 'Passed', Join: 'Joined', Carry: 'Carried', Help: 'Helped', Lay: 'Laid', Support: 'Supported', Let: 'Let', Dry: 'Dried', Clamp: 'Clamped', Confirm: 'Confirmed', Notify: 'Notified', Cool: 'Cooled', Stimulate: 'Stimulated', 'Stimulate:': 'Stimulated:', 'Position:': 'Positioned:', Straight: 'Did a straight', Bladder: 'Did a bladder', Orthostatic: 'Checked orthostatic', Fall: 'Set up fall', Seizure: 'Set up seizure', Bedside: 'Did a bedside', 'Two-person': 'Did a two-person', Second: 'Placed a second' };
  function ovSbar() {
    const pid = ui.sbar.pid;
    if (!pid) {
      const body = `<p>Which patient are you calling about?</p>${pts().filter((p) => !gone(s.p[p.id])).map((p) => `<button class="choice" data-act="sbar" data-pid="${p.id}"><b>${p.room} ${esc(p.name)}</b><br><span class="muted">${esc(p.dx)}</span></button>`).join('')}`;
      return sheet(`Call ${esc(prov().name)}`, body, '', { face: C().patients.some((x) => x.provider) ? '' : face(C().provider) });
    }
    const d = def(pid), P = s.p[pid], Ax = A();
    if (ui.sbar.reply) return sheet(esc(prov(pid).name), `<div class="reply">${face(provKey(pid))}<p class="voice" style="margin:0">"${esc(ui.sbar.reply)}"</p></div>${reviewHTML(ui.sbar.review, 'Your call, reviewed')}`, `<button class="btn btn-primary" data-act="close">Done</button>`, { face: '' });
    const items = d.sbar.items(s, P, Ax);
    const reqs0 = (typeof d.sbar.requests === 'function' ? d.sbar.requests(s, s.p[pid], A()) : d.sbar.requests) || [{ id: 'orders', label: 'Here\'s what I\'m seeing. What would you like me to do?' }, { id: 'fyi', label: 'Just keeping you updated.' }];
    const body = `<div class="sbar-sec"><h3><i>S</i>Situation</h3><p class="muted" style="margin:.3rem 0">This is your nurse on ${unitS()}, calling about ${esc(d.name)}, ${d.age}, in room ${d.room}.</p></div>
      <div class="sbar-sec"><h3><i>B</i>Background</h3><p class="muted" style="margin:.3rem 0">${esc(liveDef(d).dx)}. ${esc(liveDef(d).hx[0])}. ${esc(liveDef(d).code)}.</p></div>
      ${(() => { const es = F.errsFor(s, pid, 'md'), gv = givenList(d).filter((g) => !es.some((e) => e.medId === g.mid && e.t === g.t)), hv = (d.meds || []).filter((m) => s.meds[m.id] && s.meds[m.id].status === 'held' && s.meds[m.id].at !== null); if (!es.length && !gv.length && !hv.length) return '';
        const box = (id, label) => `<label class="opt"><input type="checkbox" data-act="sbar-pick" data-id="${id}" ${ui.sbar.picked.includes(id) ? 'checked' : ''}><span>${esc(label)}</span></label>`;
        return `<details class="sbar-sec sbar-err" ${es.length || ui.sbar.picked.some((x) => /^(err|rx|hd):/.test(x)) ? 'open' : ''}><summary><h3><i>!</i>Report a medication error</h3></summary><p class="muted" style="margin:.2rem 0 .4rem">If something you gave was wrong, say what, when, and how the patient is now.</p>${es.map((e) => box('err:' + e.id, F.errLabel(e))).join('')}${gv.map((g) => box(`rx:${g.mid}:${g.t}`, `I'm worried the ${g.name} I gave at ${E.clock(g.t)} was an error.`)).join('')}${hv.map((m) => box(`hd:${m.id}`, `I held the ${lcFirst(m.name)} due at ${E.clock(m.due !== undefined ? m.due : s.meds[m.id].at)} (held ${E.clock(s.meds[m.id].at)}). I'm not sure that was right.`)).join('')}</details>`; })()}
      ${(() => { const dn = doneFor(pid, items); return dn.length ? `<fieldset class="sbar-sec sbar-did" style="border:0;padding:0"><legend><h3><i>✓</i>What you've already done</h3></legend><p class="muted" style="margin:.2rem 0 .4rem">Tell the provider what's in place so the plan builds on it.</p>${dn.map((l) => `<label class="opt"><input type="checkbox" data-act="sbar-pick" data-id="did:${l.id}" ${ui.sbar.picked.includes('did:' + l.id) ? 'checked' : ''}><span><span class="did-t">${E.clock(l.t)}</span>${esc(didText(l))}</span></label>`).join('')}</fieldset>` : ''; })()}
      <fieldset class="sbar-sec" style="border:0;padding:0"><legend><h3><i>A</i>Assessment: what will you report?</h3></legend>
        ${items.map((it) => `<label class="opt ${it.need ? '' : 'locked'}"><input type="checkbox" data-act="sbar-pick" data-id="${it.id}" ${ui.sbar.picked.includes(it.id) ? 'checked' : ''} ${it.need ? '' : `disabled data-why="${esc(it.lock || 'Not known yet')}."`}><span>${it.need ? esc(it.label) : `<span class="lock-l">Not assessed yet</span><small>${esc(it.lock || 'Not known yet')}</small>`}</span></label>`).join('')}</fieldset>
      <fieldset class="sbar-sec" style="border:0;padding:0"><legend><h3><i>R</i>Recommendation</h3></legend>
        ${(() => { const seed = [...pid].reduce((n, ch) => n + ch.charCodeAt(0), 0); return reqs0.map((r, i) => [r, (i * 7 + seed) % 11]).sort((a, b) => a[1] - b[1]).map((x) => x[0]); })().map((r) => `<label class="opt"><input type="radio" name="req" data-act="sbar-req" data-id="${r.id}" ${ui.sbar.req === r.id ? 'checked' : ''}><span>${esc(r.label)}</span></label>`).join('')}</fieldset>`;
    const errOnly = ui.sbar.picked.length && ui.sbar.picked.every((x) => /^(err|rx|hd):/.test(x));
    return sheet(`SBAR: ${esc(d.short)}`, body, `<button class="btn btn-primary" data-act="sbar-send" ${(ui.sbar.req || errOnly) && ui.sbar.picked.length ? '' : `disabled data-why="${ui.sbar.picked.length ? 'Choose a recommendation first.' : 'Pick at least one finding to report.'}"`}>Call ${esc(prov().name)} <span style="font-weight:400;opacity:.8">6 min</span></button>`, { face: face(provKey(pid)), wide: true });
  }

  function ovDeleg() {
    const tasks = C().delegation.tasks.filter((t) => !t.avail || t.avail(s));
    const active = s.deleg.filter((x) => !x.done), sug = aideSuggest(), nm = esc(cna().name);
    const note = C().delegation.note ? C().delegation.note(s) : '';
    const lab = (x) => C().delegation.tasks.find((t) => t.id === x.id).label;
    const fin = s.deleg.filter((x) => x.done).slice(-3).reverse();
    const board = active.length || fin.length ? `<div class="dl-board">${active.length ? `<h4>${nm} is working on</h4><ul>${active.map((x) => `<li class="dl-row ${ui.delegNew === x.id + ':' + x.pid + ':' + x.at ? 'sent' : ''}"><span class="dl-l"><b>${esc(lab(x))}</b><small>${x.pid} ${esc(def(x.pid).short)} · back about ${E.clock(x.due)}</small></span><span class="dl-bar" aria-hidden="true"><i style="width:${Math.min(100, Math.max(6, (s.t - x.at) / Math.max(1, x.due - x.at) * 100)).toFixed(0)}%"></i></span></li>`).join('')}</ul>` : ''}${fin.length ? `<h4>Finished</h4><ul>${fin.map((x) => `<li class="dl-row fin"><span class="gcheck" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5"/><path d="M7 12.5l3.2 3.2L17.2 8.6"/></svg></span><span class="dl-l"><s>${esc(lab(x))}</s><small>${x.pid} ${esc(def(x.pid).short)} · done ${E.clock(x.due)}</small></span></li>`).join('')}</ul>` : ''}</div>` : '';
    const offer = sug.length ? `<div class="dl-sug"><h4>${nm} suggests</h4>${sug.map((x) => `<button class="dl-s" data-act="deleg" data-t="${x.t.id}" data-pid="${x.pid}"><span class="dl-l"><b>${esc(x.t.label)}</b><small>${x.pid} ${esc(def(x.pid).short)} · ${esc(x.why)}</small></span><span class="dl-go">Ask</span></button>`).join('')}<p class="dl-fine">${nm} offers what's coming due. You decide who's stable enough to hand off.</p></div>`
      : `<p class="dl-fine" style="margin-top:0">"Nothing coming due that I can take. Need something?"</p>`;
    const all = `<details class="dl-all" ${sug.length ? '' : 'open'}><summary>Ask ${nm} for something else <small>${tasks.length} options</small></summary>${tasks.map((t) => `<div class="dl-task"><div class="dl-tl">${esc(t.label)}</div><div class="prep">${t.rooms.filter((r) => here(def(r)) && !gone(s.p[r])).map((r) => `<button class="btn" data-act="deleg" data-t="${t.id}" data-pid="${r}">${r} ${esc(def(r).short)}</button>`).join('')}</div></div>`).join('')}</details>`;
    const body = `${ui.delegMsg ? `<div class="reply" style="margin-bottom:1rem">${face(C().cna)}<p class="voice" style="margin:0">${esc(ui.delegMsg)}</p></div>${reviewHTML(ui.delegReview, 'Delegation, reviewed')}` : `<p class="dl-who">${nm} is your ${esc(/^[A-Z]{2,}/.test(cna().role) ? cna().role : cna().role.toLowerCase())}: collecting data and helping with care, like vitals, weights, walks and baths. Assessing, teaching, meds and judgment calls stay with you.</p>`}
      ${note ? `<p class="deleg-note">${esc(note)}</p>` : ''}${board}${tasks.length ? offer + all : '<p class="empty" style="padding:0">Nothing to hand off right now.</p>'}`;
    return sheet(`Ask ${nm}`, body, `<button class="btn btn-primary" data-act="close">Done</button>`, { face: face(C().cna), label: `Delegate to ${cna().name}, ${cna().role}` });
  }

  /* Charting a restrictive intervention: a structured note the nurse signs. Every box is a claim; the case checks
     each claim against what actually happened this shift, so the note has to be specific, complete and true. */
  function ovDoc() {
    const q = ui.doc, d = def(q.pid), P = s.p[q.pid], x = d.interventions.find((i) => i.id === q.id);
    if (q.done) return sheet(q.done.title, `<div class="doc-paper"><div class="doc-hd"><b>${esc(q.done.title)}</b><span>${esc(d.name)} · ${d.room} · ${E.clock(q.done.t)} · signed: you, RN</span></div><p>${esc(q.done.text)}</p></div>${reviewHTML(q.done.review, 'Your note, reviewed')}`,
      `<button class="btn btn-primary" data-act="close">Done</button>`, { label: q.done.title, wide: true });
    const f = x.form(s, P, A());
    const body = `${f.intro ? `<p class="doc-intro">${esc(f.intro)}</p>` : ''}${f.sections.map((sec) => { const pick = q.a[sec.id] || []; const o = mixOrder(sec.opts.length, q.id + sec.id); return `<fieldset class="doc-sec"><legend>${esc(sec.q)}</legend>${sec.hint ? `<p class="doc-hint">${esc(sec.hint)}</p>` : ''}${o.map((i) => sec.opts[i]).map((op) => `<label class="opt"><input type="${sec.one ? 'radio' : 'checkbox'}" name="doc-${sec.id}" data-act="doc-pick" data-s="${sec.id}" data-o="${op.id}" ${pick.includes(op.id) ? 'checked' : ''}><span>${esc(op.label)}</span></label>`).join('')}</fieldset>`; }).join('')}`;
    const ready = f.sections.every((sec) => (q.a[sec.id] || []).length);
    return sheet(f.title, body, `<button class="btn" data-act="close">Not yet</button><button class="btn btn-primary" data-act="doc-sign" ${ready ? '' : 'aria-disabled="true" data-why="Answer every section first."'}>Sign the note <span style="font-weight:400;opacity:.8">${x.cost} min</span></button>`, { label: f.title, wide: true });
  }

  function ovNova() {
    const body = `<div class="nova-card">${face('nova')}<div>
      ${ui.nova ? `<p class="dlg-text">"${esc(ui.nova)}"</p>` : `<p class="nova-what"><b>Nova is your charge nurse.</b> Stuck, or not sure what matters most right now? Ask her for a tip. She looks at your whole assignment and tells you where she'd look next: which patient, and what to check. She won't make the call for you. Tips don't lower your score.</p>
      <p class="dlg-text">"${s.nova ? `You've got ${s.nova} tip${s.nova === 1 ? '' : 's'} left on me today. Use them when you're stuck.` : 'That\'s all my tips for today. You\'ve got this.'}"</p>`}
      ${s.novaLog.length > (ui.nova ? 1 : 0) ? `<details><summary class="muted">Earlier from Nova</summary>${s.novaLog.slice(0, ui.nova ? -1 : undefined).map((n) => `<p class="voice muted">${E.clock(n.t)}: ${esc(n.text)}</p>`).join('')}</details>` : ''}
    </div></div>`;
    const foot = `<button class="btn" data-act="close">Close</button>${!ui.nova && s.nova > 0 ? `<button class="btn btn-primary" data-act="nova-ask">Get a tip <span style="font-weight:400;opacity:.8">${s.nova} left</span></button>` : ''}`;
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
    if (ui.view === 'room') return '';
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
  function openReport(pid) { const list = pts().filter((x) => !gone(s.p[x.id])); const first = pid || (prioList().find((id) => list.some((x) => x.id === id) && !(s.report && s.report[id])) || (list[0] || {}).id); if (!first || !def(first)) { stamp('Nobody left on the unit to report on'); return render(); } ui.rep = { pid: first, picked: [], reply: null, review: null }; ui.ov = 'give'; ui.chart = null; render(); }
  function ovGive() {
    const r = ui.rep, on = oncoming(), list = prioList().map(def).filter((x) => x && !gone(s.p[x.id])), d = def(r.pid);
    if (!d) { ui.ov = null; ui.rep = null; return ''; }
    const _d = d, P = s.p[r.pid], done = s.report && s.report[r.pid];
    const tabs = `<div class="seg rep-tabs" role="group" aria-label="Patient">${list.map((x) => `<button data-act="rep-go" data-pid="${x.id}" aria-pressed="${x.id === r.pid}">${s.report && s.report[x.id] ? '✓ ' : ''}${x.room}</button>`).join('')}</div>`;
    let body = `<p class="muted" style="margin-top:0">${esc(on.name)} is taking your patients. For each one, pick what ${esc(on.name)} needs to hear. Unfinished work is fine to hand off; unmentioned work isn't.</p>${tabs}
      <div class="rep-who">${pface(d.id)}<div><b>${d.room} ${esc(d.name)}</b> <small class="muted">${ageSex(d)}</small><br><span class="muted">${esc(liveDef(d).dx)}</span></div></div>`;
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
    const body = `<div class="nova-card">${face('nova')}<p class="dlg-text" style="margin:0">${done ? `"${r.every((p, i) => pr.correct[i] === p) ? 'Same order I\'d pick, top to bottom. Now go prove it.' : r[0] === pr.correct[0] ? 'Same first stop as me. We differ after that. I\'ll tell you where at the debrief.' : 'I\'d have started somewhere else. Keep your eyes open, and I\'ll show you my order at the debrief.'}"` : '"Before you move: who are you seeing first? Drag them into order. Don\'t overthink it. Think about who could get hurt fastest."'}</p></div>
      ${done ? '' : '<p class="rank-guide"><span><b>1</b> = see first</span><span class="rank-guide-line" aria-hidden="true"></span><span><b>' + r.length + '</b> = see last</span></p><p class="rank-how">Drag a card by its handle to move it. You can also use the arrows.</p>'}
      <ol class="rank ${done ? 'done' : ''}" data-sort="rank" aria-describedby="rank-live">${r.map((pid, i) => { const d = def(pid); const right = pr.correct[i] === pid; const ord = ['1st', '2nd', '3rd', '4th', '5th', '6th'][i]; return `<li data-pid="${pid}" data-key="${pid}" class="${done ? (i === 0 ? (right ? 'right' : 'wrong') : 'settled') : ''} ${ui.rankMoved === pid ? 'moved' : ''}">${done ? '' : `<span class="grip" aria-hidden="true" title="Drag to reorder"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg></span>`}<span class="n" aria-label="${ord}"><b>${i + 1}</b><small>${i === 0 ? 'first' : i === r.length - 1 ? 'last' : ord}</small></span>${pface(pid)}<span class="rk-who"><b>${d.room} ${esc(d.short)}</b> <small class="muted">${ageSex(d)}</small><br><small class="muted">${esc(liveDef(d).dx)}</small>${(() => { const fl = flagsFor(pid); return `<span class="rk-facts">${codeChip(d)}${shortAllergy(d)}${legal(d)}</span>${fl.length ? `<span class="rk-fl">${fl.map((f) => `<i>${esc(f)}</i>`).join('')}</span>` : ''}<button class="rk-peek" data-act="rank-peek" data-pid="${pid}" aria-expanded="${ui.peek === pid}">${ui.peek === pid ? 'Hide report' : 'Show report'}</button>${ui.peek === pid ? `<span class="rk-rep">${d.report.map((r, k) => `<span class="${s.brain.includes(pid + ':' + k) ? 'on' : ''}">${esc(r.text)}</span>`).join('')}</span>` : ''}`; })()}</span>${done ? '' : `<span class="mv"><button class="btn mv-up" data-act="rk" data-i="${i}" data-d="-1" aria-label="Move ${d.short} up to ${i}" ${i === 0 ? 'disabled data-why="Already first."' : ''}>${ICON.up}</button><button class="btn mv-dn" data-act="rk" data-i="${i}" data-d="1" aria-label="Move ${d.short} down to ${i + 2}" ${i === r.length - 1 ? 'disabled data-why="Already last."' : ''}>${ICON.down}</button></span>`}</li>`; }).join('')}</ol><p class="sr" id="rank-live" aria-live="polite"></p>`;
    return sheet('Who first?', body, done ? `<button class="btn btn-primary" data-act="rank-go">Start the shift</button>` : `<button class="btn btn-primary" data-act="rank-submit">Lock in my order</button>`, { noClose: true, noScrimClose: true, wide: true });
  }

  function ovMenu() {
    const inShift = s && !s.ended && ui.view !== 'home' && ui.view !== 'debrief';
    return sheet('Menu', `<div class="menu-list">
      <button class="btn" data-act="help">How it plays</button><button class="btn" data-act="settings">Settings</button>
      ${S.ref ? '<button class="btn" data-act="ref">Pocket reference</button>' : ''}${NG && NG.bank ? `<button class="btn" data-act="practice">NCLEX practice${inShift ? ' (your shift is saved)' : ''}</button>` : ''}
      ${CL ? `<button class="btn" data-act="account">${CL.user() ? 'Your account' : 'Save your progress across devices'}</button><button class="btn" data-act="cls">Your class</button>` : ''}
      <button class="btn" data-act="rpt">Send feedback or report a problem</button>
      ${TERMS ? '<button class="btn" data-act="terms">Terms and disclaimer</button>' : ''}
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
      <div class="setrow"><span>Psych law<small class="set-sub">The psych shift is written to California law. General US uses plain terms that hold in most states.</small></span>${seg('law', [['ca', 'California'], ['general', 'General US']])}</div>
      <div class="setrow"><span>Decision feedback</span>${seg('feedback', [['now', 'Right away'], ['debrief', 'At the debrief']])}</div>
      <div class="setrow"><span>Routine results<small class="set-sub">Where a finding shows when nothing changed. Important ones always get a card.</small></span>${seg('results', [['inline', 'In the panel'], ['card', 'Pop-up card']])}</div>
      <div class="setrow"><span>Music</span>${seg('music', [['on', 'On'], ['off', 'Off']])}</div>
      <div class="setrow"><span>Sound effects and haptics</span>${seg('sound', [['on', 'On'], ['off', 'Off']])}</div>
      <div class="setrow"><span>Share anonymous usage<small class="set-sub">Which screens people reach and where they stop. No names, nothing you type. <a href="/privacy/" target="_blank" rel="noopener">Privacy</a></small></span><div class="seg" role="group">${[['on', 'On'], ['off', 'Off']].map(([v, l]) => `<button data-act="tel" data-v="${v}" aria-pressed="${(TEL.optedOut() ? 'off' : 'on') === v}">${l}</button>`).join('')}</div></div>
      <div class="setrow"><span>Intro and tips</span><button class="btn" data-act="reset-tips">${prof.seen && Object.keys(prof.seen).length ? 'Show them again' : 'On for your next shift'}</button></div>
      <div class="setrow"><span>Start over<small class="set-sub">Clears your shifts, stars, XP, badges and lessons on this device, and replays the first-time walkthrough. Settings stay.</small></span><button class="btn btn-danger" data-act="reset-ask">Reset progress</button></div>`, `<button class="btn btn-primary" data-act="close">Done</button>`);
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
      <p><b>Consequences.</b> Patients get better or worse based on what you do, and what you don't. The debrief at the end explains why.</p></div>`, `${ui.or ? '<button class="btn" data-act="or-open">Back to orientation</button>' : '<button class="btn" data-act="or-open">Walk me through it</button>'}<button class="btn btn-primary" data-act="close">Got it</button>`);
  }
  function ovTerms(gate) {
    const web = /^https?:/.test(location.protocol);
    const sum = `<ul class="terms-sum">${TERMS.summary.map(([h, x]) => `<li><b>${esc(h)}</b> ${esc(x)}</li>`).join('')}</ul>`;
    const full = `<details class="terms-full"><summary>Read the full terms of use</summary>${TERMS.sections.map((sec) => `<h3>${esc(sec.h)}</h3>${sec.p.map((x) => `<p>${esc(x)}</p>`).join('')}`).join('')}<p class="muted">Updated ${esc(TERMS.updated)}. Questions: ${esc(TERMS.contact)}.</p></details>`;
    const links = web ? `<p class="terms-links"><a href="/terms/" target="_blank" rel="noopener">Terms of use</a> · <a href="/privacy/" target="_blank" rel="noopener">Privacy</a></p>` : '';
    const lead = gate ? '<p class="terms-lead">The Shift is a game for practicing nursing judgment. Before your first shift, please read and agree to the following.</p>' : '<p class="terms-lead">The Shift is a game for practicing nursing judgment, not a guide to caring for real patients.</p>';
    return sheet(gate ? 'Before you play' : 'Terms and disclaimer', `<div class="terms">${lead}${sum}${full}${links}</div>`,
      gate ? `<p class="terms-ok-note">By continuing you confirm you're 18 or older (or playing under an educator's supervision) and agree to the terms of use.</p><button class="btn btn-primary" data-act="terms-ok">I understand and agree</button>` : `<button class="btn btn-primary" data-act="close">Close</button>`,
      gate ? { noClose: true, noScrimClose: true, wide: true, label: 'Before you play: terms of use' } : { wide: true });
  }
  function ovHealth() {
    const pm = performance.memory, rs = R.stats ? R.stats() : {}, last = PERF.last || {};
    let err = null; try { err = JSON.parse(localStorage.getItem('theshift.lastError') || 'null'); } catch (e) { /* storage off */ }
    let asy = null; try { asy = JSON.parse(localStorage.getItem('theshift.lastAsync') || 'null'); } catch (e) { /* storage off */ }
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
    const detail = `fps ${FM.fps} · redraw avg ${PERF.avg.toFixed(1)} worst ${PERF.worst.toFixed(0)} ms · nodes ${nodes} · heap ${pm ? (pm.usedJSHeapSize / 1e6).toFixed(1) + 'MB' : 'n/a'} · save ${save}KB · ${navigator.userAgent}${err ? `\nlast error ${err.at}: ${err.msg} [${err.act} ${err.view} t=${err.t} ${err.caseId}]\n${err.stack}` : ''}${asy ? `\nlast browser refusal ${asy.at}: ${asy.name} ${asy.msg} [${asy.view}${asy.ov ? '/' + asy.ov : ''} ${asy.caseId}]` : ''}`;
    ui.healthText = detail;
    return sheet('Health check', `<table class="health">${lines.join('')}</table>${err ? `<h3 style="margin:1rem 0 .3rem">Last error</h3><pre class="h-err">${esc(err.at + '\n' + err.msg + '\n' + err.stack)}</pre>` : '<p class="muted">No errors recorded.</p>'}${asy ? `<h3 style="margin:1rem 0 .3rem">Last browser refusal (handled)</h3><pre class="h-err">${esc(asy.at + '\n' + asy.name + ' ' + asy.msg)}</pre>` : ''}${tel.length ? `<h3 style="margin:1rem 0 .3rem">Recent events</h3><pre class="h-err">${esc(tel.map((x) => `${x.at} ${x.event} ${JSON.stringify(x.p).slice(0, 90)}`).join('\n'))}</pre>` : ''}`, `<button class="btn" data-act="health-copy">Copy details</button><button class="btn btn-primary" data-act="close">Close</button>`, { label: 'Health check' });
  }
  function ovConfirm() {
    const c = ui.confirm;
    return sheet(c.title, `<p>${esc(c.text)}</p>`, `<button class="btn" data-act="close">Cancel</button><button class="btn ${c.danger ? 'btn-danger' : 'btn-primary'}" data-act="${c.act}">${esc(c.ok)}</button>`);
  }

  function toasts() {
    if (!ui.toasts.length || !s) return '';
    return `<div class="toasts" aria-live="assertive">${ui.toasts.map((id) => { const m = s.inbox.find((x) => x.id === id); if (!m || (ui.ov && !m.urgent) || (ui.view === 'station' && !m.urgent && !(m.replies && !m.done))) return '';
      // Routine messages step aside after a few seconds of being seen (they stay in the phone); urgent ones wait for the player.
      if (!m.urgent && !m.toastAt && !(m.replies && !m.done)) { m.toastAt = Date.now(); const expire = () => { if (ui.hold) { setTimeout(expire, 700); return; } if (ui.toasts.includes(m.id)) { ui.toasts = ui.toasts.filter((x) => x !== m.id); if (s && ui.view !== 'home' && ui.view !== 'debrief') render(); } }; setTimeout(expire, 7000); }
      const w = who(m.from); const go = m.replies && !m.done ? m.replies[0] : null; return `<div class="toast tap ${m.urgent ? 'urgent' : ''}" role="alert" data-act="msg" data-m="${m.id}">${faceOf(m.from)}<p><b>${esc(w.name)}, ${E.clock(m.t)}</b>${esc(m.text)}</p><span class="tb">${m.bell && go ? m.replies.map((r, i) => `<button class="btn sm" data-act="reply" data-m="${m.id}" data-i="${i}">${esc(r.act === 'bell-cna' ? 'Ask ' + cna().name : r.label)}</button>`).join('') : go && m.replies.length > 1 ? `<button class="btn" data-act="msg" data-m="${m.id}">See replies</button>` : go ? `<button class="btn" data-act="reply" data-m="${m.id}" data-i="0">${esc(go.label.length > 22 ? 'Respond' : go.label)}</button>` : ''}<button class="btn" data-act="toast-x" data-m="${m.id}" aria-label="Dismiss">${ICON.close}</button></span></div>`; }).join('')}</div>`;
  }

  /* ------------ render ------------ */
  const keyOf = (el) => JSON.stringify([el.dataset.act, el.dataset.id, el.dataset.pid, el.dataset.i, el.dataset.k, el.dataset.tab, el.dataset.p, el.dataset.t, el.dataset.m, el.dataset.v, el.dataset.row]);
  /* A breathing tube that came out comes off the portrait too: look follows liveDef(d).vented. */
  const lookNow = {};
  function syncLooks() {
    if (!s) return;
    C().patients.forEach((d) => { if (!d.look || !(d.look.extras || []).includes('ett')) return; const off = liveDef(d).vented === false, k = d.id; if (!!lookNow[k] === off) return; lookNow[k] = off; R.define(k, off ? Object.assign({}, d.look, { extras: d.look.extras.filter((x) => x !== 'ett') }) : d.look); });
  }
  function render(scrollTop) {
    syncLooks();
    const T0 = performance.now();
    if (inGame() && caseId !== s.caseId && E.getCase(s.caseId)) { caseId = s.caseId; E.useCase(caseId); }
    applySettings();
    const root = $('#app');
    const focusKey = document.activeElement && document.activeElement.dataset ? keyOf(document.activeElement) : null;
    const y = window.scrollY;
    if (s && !s.ended && (ui.view === 'station' || ui.view === 'room')) { if (fbNow()) tallyJudg(); goalWatch(); }
    RC = new Map();
    let h = '';
    if (ui.view === 'awards') h = vAwards();
    else if (ui.view === 'practice' && NG && NG.bank) h = vPractice();
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
    else if (ov === 'doc' && ui.doc) h += ovDoc();
    else if (ov === 'nova') h += ovNova();
    else if (ov === 'dialog') h += ovDialog();
    else if (ov === 'inbox') h += ovInbox();
    else if (ov === 'rank') h += ovRank();
    else if (ov === 'menu') h += ovMenu();
    else if (ov === 'settings') h += ovSettings();
    else if (ov === 'help') h += ovHelp();
    else if (ov === 'orient' && ui.or && OR) { OR._o = ui.or; h += OR.view(ui.or); }
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
    else if (ov === 'ngn' && ui.ngn && NG) h += ovNgn();
    else if (ov === 'pres' && NG) h += ovPres();
    else if (ov === 'csres' && NG) h += ovCsres();
    else if (ov === 'ref') h += ovRef();
    else if (ov === 'account' && CL) h += ovAccount();
    else if (ov === 'class' && CL) h += ovClass();
    else if (ov === 'pack') h += ovPack();
    else if (ov === 'review' && RV) h += ovReviewInfo();
    else if (ov === 'terms' && TERMS) h += ovTerms(false);
    if (!ov && TERMS && !termsOk() && (ui.view === 'home' || !s)) h += ovTerms(true);
    if (ui.intro !== null && ui.intro !== undefined && s && ui.view === 'handoff') h += ovIntro();
    if (!h || !h.trim()) { ui.view = 'home'; ui.ov = null; h = vHome(); }   // never a blank screen
    const T1 = performance.now(); RC = null;
    // The same overlay redrawn (an answer picked, a box ticked) must not look like it reopened: no fade-in, no
    // slide-up, and every scrolled panel stays where it was. Only a new overlay, or a new question, animates in.
    const ovSig = ui.ov ? `${ui.ov}|${ui.ov === 'ngn' && ui.ngn ? `${ui.ngn.list}:${ui.ngn.cs || ''}:${ui.ngn.i}` : ui.ov === 'sbar' && ui.sbar ? ui.sbar.pid : ui.ov === 'med' && ui.med ? ui.med.id : ui.ov === 'chart' && ui.chart ? ui.chart.pid + ':' + ui.chart.tab : ''}` : '';
    const steady = !!ovSig && ovSig === ui.lastOvSig, SCROLLERS = '.sheet-b, .chart-b, .rec-b, .or-body, .or-log, .msgs, .feed, .res, .crit';
    const kept = steady ? [...root.querySelectorAll(SCROLLERS)].map((el) => el.scrollTop) : null;
    ui.lastOvSig = ovSig;
    root.innerHTML = h;
    if (steady) { root.querySelectorAll('.scrim, .sheet, .drawer').forEach((el) => el.classList.add('steady')); root.querySelectorAll(SCROLLERS).forEach((el, i) => { if (kept[i]) el.scrollTop = kept[i]; }); }
    const T2 = performance.now();
    if (ui.view !== ui.lastView) { const v = root.querySelector('main, .home'); if (v) v.classList.add('view-in'); ui.lastView = ui.view; }
    ui.hFresh = false;
    root.querySelectorAll('[disabled]').forEach((el) => { el.removeAttribute('disabled'); el.setAttribute('aria-disabled', 'true'); el.classList.add('off'); });
    if (ui.hold || ui.armed) root.querySelectorAll('[data-hold]').forEach((el) => { const k = el.dataset.hk || el.dataset.act; if (ui.hold && ui.hold.k === k) el.classList.add('holding'); if (ui.armed && ui.armed.k === k && Date.now() - ui.armed.at < 4000) el.classList.add('armed'); });
    R.setReduced(prof.settings.motion === 'reduced');
    R.hydrate(root);
    if (ui.view === 'room') placeBubbles(root);
    // Keep the patient you're with in view in the strip (the station stays pinned at its left edge).
    { const pin = root.querySelector('.ps-pts'), on = pin && pin.querySelector('.ps.on'); if (pin && on) { const l = on.offsetLeft - pin.offsetLeft; if (l < pin.scrollLeft || l + on.offsetWidth > pin.scrollLeft + pin.clientWidth) pin.scrollLeft = Math.max(0, l - 8); } }
    // A fresh inline result should be on screen.
    if (ui.receipt && !ui.receipt.shown && ui.view === 'room') { ui.receipt.shown = true; const rc = root.querySelector('.receipt'); if (rc) requestAnimationFrame(() => { if (!rc.isConnected) return; const r = rc.getBoundingClientRect(); if (r.top < 170 || r.top > innerHeight - 140) window.scrollTo({ top: Math.max(0, scrollY + r.top - 190), behavior: reduced() ? 'auto' : 'smooth' }); }); }
    if (ui.convoIn && ui.view === 'room') { ui.convoIn = false; const cv = root.querySelector('.convo'); if (cv) { requestAnimationFrame(() => { const rtEl = root.querySelector('.room-top'); if (!rtEl || !cv.isConnected) return; const r = cv.getBoundingClientRect(), rt = rtEl.getBoundingClientRect(); const sticky = Math.max(0, ...[...document.querySelectorAll('.top, .pstrip')].map((e) => e.getBoundingClientRect().bottom)); const dy = Math.min(rt.top - sticky - 8, r.bottom - innerHeight + 16); if (dy > 0 || rt.top < sticky) window.scrollBy({ top: dy, behavior: reduced() ? 'auto' : 'smooth' }); const f = cv.querySelector('.cv-reply, .btn'); if (f) f.focus({ preventScroll: true }); }); } }
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
    if (!s || !GAMEVIEW[ui.view]) return { scene: 'home', tension: 0, night: false };
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
    s.loc = pid; s.lastRoom = pid; s.p[pid].seenAt = s.t; if (s.p[pid].firstSeen === undefined) s.p[pid].firstSeen = s.t; s.p[pid].callLight = false; ui.res = null; ui.receipt = null; ui.flash = null;
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
    // Working at the bedside answers a call light: you're in the room, and they ask you. Only the bell's own
    // action skips this (it already answers), and only when the light's need is something a nurse in the room meets.
    let bellTx = '';
    if (P && P.bell && s.loc === d.id && label !== 'Answered the call light' && !gone(P)) { const Ax1 = A(); bellTx = F.answerBell(s, Ax1, d.id); if (bellTx) { logHere(d.id, bellTx, 'find'); s.log[s.log.length - 1].label = 'Call light'; } }
    spend(mins, (Ax) => { text = fn(Ax) || ''; });
    if (bellTx) text = `${text}${text ? ' ' : ''}(While you were in the room: ${bellTx.replace(/^Call light: /, '').replace(/^Request: /, '')})`;
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
    // A routine result (nothing changed, nothing to learn from, nothing new) doesn't need a modal: it shows at the top of the panel.
    const routine = !crit && !alerts.length && st0 === st1 && !meanwhile.length && ui.res.msgs <= 0 && !(fbNow() && review.length) && !(prof.settings.results === 'card');
    if (routine) { const r = Object.assign({ born: Date.now() }, ui.res); handlers['res-close'](); ui.receipt = r; render(); save(); return; }
    ui.receipt = null;
    ui.ov = 'result'; ui.caption = null; ui.flash = dir > 0 ? 'worse' : dir < 0 ? 'better' : null;
    if (crit === 'worse') setTimeout(() => FX.play('crit'), 100); else if (dir) setTimeout(() => FX.play(dir > 0 ? 'worse' : 'better'), 380);
    save();
  }

  function onReply(m, r) {
    const Ax = A();
    if (r.act === 'goto') { m.done = true; m.read = true; return enterRoom(r.pid); }   // the choice is made: the other replies are gone
    if (r.act === 'delegate') { ui.ov = 'deleg'; ui.delegMsg = null; m.done = true; }
    if (r.act === 'sbar') { ui.ov = 'sbar'; ui.sbar = { pid: r.pid, picked: [], req: null, reply: null, msg: m.id }; }
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
    new() { if (locked(caseId)) return startNew(); if (firstTimer()) { openOrient(true); return; } if (E.store.load() && ui.view === 'home') { ui.confirm = { title: 'Start over?', text: 'Your saved shift will be replaced.', ok: 'Start a new shift', act: 'new-yes', danger: true }; ui.ov = 'confirm'; return render(); } startNew(); },
    'new-yes'() { E.store.clear(); startNew(); },
    'last-debrief'() { const L = E.store.loadLast(); if (!L) return render(); s = L; caseId = L.caseId; E.useCase(caseId); ui.view = 'debrief'; ui.ov = null; ui.debDone = true; ui.filter = 'all'; ui.dtab = 'shift'; render(true); },
    resume, home() { if (s && !s.ended) save(); if (s) caseId = s.caseId; ui.view = 'home'; ui.ov = null; render(true); },
    restart() { ui.confirm = { title: 'Restart this shift?', text: `You'll go back to ${E.clock(0)} report. Progress in this shift is lost.`, ok: 'Restart', act: 'new-yes', danger: true }; ui.ov = 'confirm'; render(); },
    menu() { ui.ov = 'menu'; render(); }, help() { openOrient(false); }, 'help-ref'() { ui.ov = 'help'; render(); },
    'or-open'() { if (ui.or) { ui.ov = 'orient'; render(true); } else openOrient(false); },
    or(el) { const o = ui.or; if (!o) return; const i0 = o.i, r = OR.act(o, el.dataset); if (r === 'done') return closeOrient(true); if (r === 'skip') return closeOrient(false); orSave(); if (r === 'ref') { ui.ov = 'help'; return render(); } render(); if (o.i !== i0) { const st = document.querySelector('.or-body'); if (st) st.scrollTop = 0; window.scrollTo(0, 0); const h2 = document.querySelector('.or-head h2'); if (h2) h2.focus({ preventScroll: true }); } else if (document.activeElement && document.activeElement.closest && document.activeElement.closest('.or-list')) document.activeElement.blur(); }, settings() { ui.ov = 'settings'; render(); },
    terms() { ui.ov = 'terms'; render(); },
    'terms-ok'() { prof.terms = TERMS.version; prof.termsAt = new Date().toISOString(); E.store.saveProfile(prof); TEL.track('terms_accept', { version: TERMS.version }); ui.ov = null; render(); },
    set(el) { prof.settings[el.dataset.k] = el.dataset.v; E.store.saveProfile(prof); render(); },
    close() { if (ui.ov === 'report' && ui.rp && ui.rp.back === 'ngn' && ui.ngn) { ui.rp = null; ui.ov = 'ngn'; return render(); } if (ui.ov === 'report') ui.rp = null; if (ui.ov === 'dialog') { ui.dlg = null; ui.dlgReview = null; ui.said = null; } if (ui.ov === 'rank') return; ui.ov = null; ui.chart = null; ui.med = null; ui.sbar = null; ui.nova = null; render(); },
    flag(el) { const k = el.dataset.k; const i = s.brain.indexOf(k); if (i >= 0) s.brain.splice(i, 1); else s.brain.push(k); save(); render(); },
    'h-go'(el) { if (ui.hIdx === +el.dataset.i) return render(); s.hHeard = Array.from(new Set((s.hHeard || []).concat(C().patients.filter((x) => !x.arrives)[ui.hIdx].id))); ui.hIdx = +el.dataset.i; ui.hFresh = true; render(true); },
    'h-done'() { if (!s) return; TEL.track('report_done', { case: caseId, flags: s.brain.length, heard: ui.hIdx + 1 }); ui.rankMoved = null; ui.rank = C().patients.filter((p) => !p.arrives).map((p) => p.id); ui.rankDone = false; ui.ov = 'rank'; render(); },
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
    back() { ui.ov = null; ui.receipt = null; spend(1, () => {}); if (s.ended) return; ui.view = 'station'; s.view = 'station'; s.loc = 'station'; ui.caption = null; save(); render(true); },
    dock(el) {
      ui.dock = el.dataset.id; render();
      // Coming from a task in the brain: point at the action that does it.
      if (el.dataset.hl) {
        const w = el.dataset.hl.toLowerCase().split(/[^a-z]+/).filter((x) => x.length > 3); let best = el.dataset.sys ? document.querySelector(`.pane .fs-row[data-sys="${el.dataset.sys}"]`) : null, bs = best ? 99 : 0;
        document.querySelectorAll('.pane .fs-row, .pane .mar-row').forEach((b) => { const l = (b.querySelector('b') || b).textContent.toLowerCase(), n = w.filter((x) => l.includes(x)).length; if (n > bs) { bs = n; best = b; } });
        if (best) { best.classList.add('hl'); if (innerWidth <= 760) best.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); return; }
      }
      // On a phone the panel sits below the scene: bring the chosen tab's content into view.
      const pn = document.querySelector('.pane'); if (pn && innerWidth <= 760) { const y = pn.getBoundingClientRect().top; if (y > innerHeight * .55 || y < 0) window.scrollTo({ top: scrollY + y - 190, behavior: reduced() ? 'auto' : 'smooth' }); }
    },
    assess(el) { doAssess(el.dataset.sys); if (!s.ended) render(); },
    int(el) { const d = def(s.loc), P = s.p[d.id], x = d.interventions.find((i) => i.id === el.dataset.id); if (x.form) { ui.doc = { pid: d.id, id: x.id, a: {} }; ui.ov = 'doc'; TEL.track('doc_open', { case: s.caseId, doc: x.id }); return render(); } doAct(x.label, x.cost, (Ax) => { const k0 = s.judg.length; const t = x.run(s, P, Ax); F.recordErrors(s, Ax, d, `${lcFirst(x.label)} at ${E.clock(s.t)}`, k0, false, fbNow()); logHere(d.id, t || x.label, 'find'); s.log[s.log.length - 1].label = x.label; return t; }); if (!s.ended) render(); },
    poke() { const d = def(s.loc), line = sayNow(d); R.poke('room:' + d.id); if (line) { ui.captionPoke = true; ui.captionRaw = line.text; ui.caption = sayText(line.text, !line.quiet); ui.captionQuiet = !!line.quiet; } render(); },
    clue(el) { const d = def(s.loc), P = s.p[d.id]; if (d.onClue) d.onClue(el.dataset.id, s, P, A()); const cl = d.clues(s, P, A()); const t = cl[el.dataset.id] || genericClue(el.dataset.id, d, P, el); if (t) { ui.caption = t; ui.captionQuiet = false; ui.captionPoke = false; if (!s.log.some((l) => l.pid === d.id && l.text === t)) { logHere(d.id, t, 'clue'); } save(); } render(); },
    med(el) { ui.med = { id: el.dataset.id, dose: null, holding: false, reason: null, note: null }; ui.ov = 'med'; ui.chart = null; render(); },
    dose(el) { ui.med.dose = +el.dataset.v; render(); },
    hreason(el) { ui.med.reason = +el.dataset.v; ui.med.paramOk = false; if (ui.med.note && /hold criteria/.test(ui.med.note)) ui.med.note = null; render(); },
    'med-unhold'() { const d = def(s.loc), m = d.meds.find((x) => x.id === ui.med.id), st = s.meds[m.id]; const at = st.at; st.status = 'due'; st.at = null; st.note = ''; A().log(d.id, `${m.name}: hold reversed (held at ${E.clock(at)}).`, 'act'); s.log[s.log.length - 1].label = `${m.name} hold reversed`; ui.med.holding = false; ui.med.reason = null; save(); render(); },
    'med-holdask'() { ui.med.holding = true; render(); },
    'ngn-open'(el) { ngnStart(el.dataset.list || 'shift', +el.dataset.i || 0); ui.ov = 'ngn'; render(); },
    'ngn-go'(el) { const cs = ui.ngn && ui.ngn.cs; ngnStart(el.dataset.list || 'shift', +el.dataset.i, cs ? { cs } : null); ui.ov = 'ngn'; render(); const sb = document.querySelector('.sheet-b'); if (sb) sb.scrollTop = 0; },
    'ngn-move'(el) { const q = ui.ngn, o = q && q.a.o; if (!o || q.checked) return; const k = +el.dataset.k, j = k + +el.dataset.d; if (j < 0 || j >= o.length) return; [o[k], o[j]] = [o[j], o[k]]; render(); },
    practice() { ui.view = 'practice'; ui.ov = null; window.scrollTo(0, 0); TEL.track('practice_open', {}); render(); },
    ptab(el) { ui.pTab = el.dataset.v; ui.pAll = false; render(); },
    pf(el) { ui.pf = ui.pf || {}; ui.pf[el.dataset.k] = el.dataset.v || ''; ui.pAll = false; render(); },
    pall() { ui.pAll = true; render(); },
    pset() { const f = ui.pf || {}; startSet(bankFiltered(), [f.cn && CNL(f.cn), f.step && STEPNAME(f.step)].filter(Boolean).join(', ')); render(); },
    'pset-cn'(el) { ui.pf = { cn: el.dataset.v }; startSet(bankFiltered(), CNL(el.dataset.v)); render(); },
    'pset-step'(el) { ui.pf = { step: el.dataset.v }; startSet(bankFiltered(), STEPNAME(el.dataset.v)); render(); },
    'pset-done'() { ui.ov = 'pres'; render(); },
    'qb-one'(el) { ui.pset = { ids: [el.dataset.id], label: '' }; ngnStart('bank', 0); ui.ov = 'ngn'; render(); },
    'cs-open'(el) {
      const c = NG.caseById(el.dataset.id); if (!c) return; const done = prof.ngn || {};
      const i = el.dataset.i !== undefined ? +el.dataset.i : Math.max(0, c.items.findIndex((x) => !done[x.id]));
      ngnStart('case', i === -1 ? 0 : i, { cs: c.id }); ui.ov = 'ngn'; TEL.track('case_study_open', { id: c.id }); render();
    },
    'cs-retry'(el) { ngnStart('case', 0, { cs: el.dataset.id }); ui.ov = 'ngn'; render(); },
    'cs-tab'(el) { if (ui.ngn) ui.ngn.tab = el.dataset.v; render(); },
    'cs-done'() { ui.csres = ui.ngn && ui.ngn.cs; ui.ov = 'csres'; render(); },
    ref() { ui.refCard = null; ui.ov = 'ref'; render(); },
    'ref-card'(el) { ui.refCard = el.dataset.id; TEL.track('ref_card', { id: el.dataset.id }); render(); const sb = document.querySelector('.sheet-b'); if (sb) sb.scrollTop = 0; },
    'ref-back'() { ui.refCard = null; render(); },
    meter(el) { ui.mOpen = ui.mOpen || {}; const k = el.dataset.k; if (ui.mOpen[k]) delete ui.mOpen[k]; else ui.mOpen[k] = 1; render(); },
    'sc-why'() { ui.scWhy = !ui.scWhy; if (ui.scWhy) TEL.track('debrief_score_why', { case: s ? s.caseId : caseId }); render(); },
    'ngn-pick'(el) {
      const q = ui.ngn, it = ngnList()[q.i], k = el.dataset.k, v = +el.dataset.v; if (q.checked) return;
      if (k === 'c' || k === 'm') q.a[k] = v;
      else if (k === 'a' || k === 'p') { const L = q.a[k] = q.a[k] || []; const at = L.indexOf(v); if (at >= 0) L.splice(at, 1); else { L.push(v); if (L.length > 2) L.shift(); } }
      else if (k === 'r' || k === 'd') { const L = q.a[k] = q.a[k] || []; L[+el.dataset.row] = v; }
      else { const L = q.a.s = q.a.s || []; const at = L.indexOf(v); if (at >= 0) L.splice(at, 1); else L.push(v); }
      render();
    },
    'ngn-check'() {
      const q = ui.ngn, it = ngnList()[q.i]; if (!NG.complete(it, q.a)) { const n = document.getElementById('ngn-num'); if (n) n.focus(); return; } q.checked = true;
      const where = s && q.list !== 'case' && q.list !== 'bank' ? s.caseId : q.list === 'case' ? q.cs : 'practice';
      const sc = NG.score(it, q.a), mx = NG.max(it); prof.ngn = prof.ngn || {}; const prev = prof.ngn[it.id];
      prof.ngn[it.id] = { score: Math.max(sc, prev ? prev.score : 0), max: mx, last: sc, at: Date.now() }; E.store.saveProfile(prof);
      TEL.track('ngn_item', { case: where, item: it.id, type: it.type, step: it.step, cn: it.cn || null, score: sc, max: mx, focus: q.list === 'focus', list: q.list });
      if (CL) CL.recordNgn(where, it, sc, mx);
      render();
    },
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
      if (!m.block && prnLimit(m, st)) return render();
      const dose = ui.med.dose; ui.ov = null; ui.med = null;
      // A med pass: once you're at the bedside with the cart, each further dose for the same patient takes less time.
      const pass = P.medPassAt !== undefined && s.t - P.medPassAt <= 6 && s.loc === d.id; P.medPassAt = s.t;
      doAct(m.infusion ? `${m.name}: pump set` : `${m.name} given`, pass ? 2 : 5, (Ax) => { P.medPassAt = s.t + (pass ? 2 : 5); const k0 = s.judg.length; const t = m.give(s, P, Ax, dose); const dl = (m.doses || []).find((x) => x.id === dose); F.recordErrors(s, Ax, d, `${m.name} ${dl ? dl.label.split(' (')[0] : m.dose} at ${E.clock(s.t)}`, k0, true, fbNow(), m.id); if (m.prn) st.given.push(s.t); else { st.status = 'given'; st.at = s.t; } logHere(d.id, `${m.name}: ${t}`, 'act'); s.log[s.log.length - 1].label = m.infusion ? (/\b(stopped|off|clamped)\b/i.test(t) ? `${m.name} stopped` : /^no change/i.test(t) || dose != null && dl && /no change|continue/i.test(dl.label) ? `${m.name} checked, no change` : `${m.name} rate changed`) : `${m.name} given`; return t; }); if (!s.ended) render();
    },
    'med-declined'() {
      const d = def(s.loc), P = s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id);
      ui.ov = null; ui.med = null;
      doAct(`${m.name} offered, declined`, 2, (Ax) => { const why = m.refuse(s, P, Ax); if (m.onRefuse) m.onRefuse(s, P, Ax); logHere(d.id, `${m.name} offered and declined. ${why || ''}`.trim(), 'act'); s.log[s.log.length - 1].label = `${m.name} declined`; return why; }); if (!s.ended) render();
    },
    'med-hold'() {
      const d = def(s.loc), P = s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id), st = s.meds[m.id];
      const reasons = ['Meets the hold parameter', 'Condition changed, clarify with provider', 'Not enough intake', 'Patient declined'];
      // Check the reason against the numbers before accepting it: a hold "for the parameter" when every check is inside it gets one warning.
      if (ui.med.reason === 0 && m.param && !ui.med.paramOk) { const ck = (m.checks ? m.checks(s, P, A()) : []).filter((c) => c.ok === true || c.ok === false); if (ck.length && ck.every((c) => c.ok === true)) { ui.med.paramOk = true; ui.med.note = `None of these meet the hold criteria (${m.param.replace(/\.$/, '')}): ${ck.map((c) => `${c.label} ${c.value}`).join(', ')}. By the order, this dose should be given. If you're holding for another reason, pick it; if you're sure, press Hold again.`; FX.play('nope'); return render(); } }
      const reason = ui.med.reason; ui.ov = null; ui.med = null;
      doAct(`${m.name} held`, 2, (Ax) => { let t; if (typeof m.hold === 'function') t = m.hold(s, P, Ax, reason); else { Ax.judge(m.id + '-hold', 'meds', -1, `You held ${d.short}'s ${m.name} without a clear clinical reason.`, 'Holding a scheduled dose is a decision with consequences. It needs a parameter or a change in condition behind it, and a notification.', d.id); t = 'Held.'; } st.status = 'held'; st.at = s.t; st.note = reasons[reason]; logHere(d.id, `${m.name} held (${reasons[reason].toLowerCase()}). ${t}`, 'act'); s.log[s.log.length - 1].label = `${m.name} held`; return `Held: ${reasons[reason].toLowerCase()}. ${t === 'Held.' ? '' : t}`.trim(); }); if (!s.ended) render();
    },
    talk(el) {
      const d = def(s.loc), P = s.p[d.id], Ax = A(), cid = d.talk(s, P, Ax), sid = cid && STY ? STY.pick(s, C(), d, P, Ax, cid) : null, id = sid || cid;
      if (!id) { hint(el, `${d.short} can't talk with you right now.`); return; }
      if (!sid) { s.seenDlg = s.seenDlg || {}; s.seenDlg[cid] = 1; }
      spend(3, () => {}); if (s.ended) return; s.p[d.id].touchAt = s.t; ui.dlgReview = null; ui.said = null; ui.captionPoke = false; ui.caption = null; ui.dlg = { id }; ui.ov = 'dialog'; ui.convoIn = true; R.poke('room:' + d.id); render(); },
    family() { const d = def(s.loc); spend(d.family.cost, () => {}); if (s.ended) return; s.p[d.id].touchAt = s.t; ui.dlgReview = null; ui.said = null; ui.convoIn = true; ui.dlg = { id: d.family.dialog(s, s.p[d.id], A()) }; ui.ov = 'dialog'; render(); },
    dlg(el) {
      const node = C().dialogs[ui.dlg.id], c = node.choices[+el.dataset.i];
      const Ax = A(), j0 = s.judg.length; if (c.fx) c.fx(s, Ax);
      const rv = judgSince(j0); ui.dlgReview = rv.length ? rv : null; reviewSound(rv);
      const text = typeof node.text === 'function' ? node.text(s) : node.text;
      const pid = node.pid || (/^\d+$/.test(node.who) ? node.who : s.loc);
      if (STY && node.story) { const f = s.storyFresh; s.storyFresh = null; if (f && f.d > 0) { gain(25, f.why === 'presence' ? 'Presence' : 'Connection', 'bond'); ui.bondSound = true; } else if (f && f.d < 0) ui.pops.push({ text: 'Trust', label: `${def(f.pid).short} pulls back`, cls: 'lost' }); }
      else if (STY && s.p[pid]) STY.fromDialog(s, pid, rv.filter((j) => j.pid === pid));
      logHere(pid, `You: "${c.label}"`, 'act'); ui.said = c.label; ui.dlgLast = { who: node.who, text, story: node.story || null }; ui.convoIn = true;
      if (c.next) { const nx = C().dialogs[c.next]; logHere(pid, typeof nx.text === 'function' ? nx.text(s) : nx.text, 'info'); ui.dlg = { id: c.next }; if (isPt(nx.who)) setTimeout(() => R.poke('room:' + nx.who), 60); }
      else if (ui.dlgReview && fbNow()) { ui.dlg = { id: '__review' }; }
      else { ui.dlg = null; ui.ov = null; ui.said = null; }
      save(); render();
    },
    comm(el) { const d = def(s.loc), x = d.comms.find((c) => c.id === el.dataset.id); doAct(x.label, x.cost, (Ax) => { const t = x.run(s, s.p[d.id], Ax); logHere(d.id, t, 'act'); s.log[s.log.length - 1].label = x.label; return t; }); if (!s.ended) render(); },
    'err-charge'() {
      const d = def(s.loc), es = F.errsFor(s, d.id, 'charge'); if (!es.length) return;
      const toldMD = es.every((e) => e.md !== null), nm = staff('nova').name.split(' ')[0];
      doAct(`Told ${nm} about the error`, 2, (Ax) => { es.forEach((e) => F.tellCharge(s, Ax, d, e)); return `${nm}: "Thank you for telling me. ${toldMD ? 'Good that the doctor already knows.' : `Check on ${d.short}, then call ${prov(d.id).name} with an SBAR right now.`} I'll watch your other rooms for ten minutes, and we'll write the safety report together before you leave. Everyone makes one of these eventually. Telling fast is what keeps patients safe."`; });
      if (!s.ended) render();
    },
    'rrt-generic'() { const d = def(s.loc); doAct('Rapid response called', 3, (Ax) => { Ax.judge(d.id + '-rrt', 'judgment', 0, `You called a rapid response for ${d.short}.`, 'Calling for help when worried is always allowed. The team found a patient who didn\'t yet meet criteria. Next time, pair the call with an SBAR to the provider.', d.id); const t = `The rapid response nurse checks in, reviews vitals, and suggests calling ${prov().name} with an update. "Always call if you're worried."`; logHere(d.id, t, 'act'); s.log[s.log.length - 1].label = 'Rapid response'; return t; }); if (!s.ended) render(); },
    sbar(el) { ui.sbar = { pid: el.dataset.pid || null, picked: [], req: null, reply: null }; ui.ov = 'sbar'; render(); },
    callpick() { ui.sbar = { pid: null, picked: [], req: null, reply: null }; ui.ov = 'sbar'; render(); },
    'sbar-pick'(el) { const id = el.dataset.id, p = ui.sbar.picked; const i = p.indexOf(id); if (i >= 0) p.splice(i, 1); else p.push(id); render(); },
    'sbar-req'(el) { ui.sbar.req = el.dataset.id; render(); },
    'sbar-send'() {
      const pid = ui.sbar.pid, d = def(pid), P = s.p[pid]; let reply = ''; const j0 = s.judg.length;
      // The call is placed: a message that asked for it no longer offers to make it.
      s.inbox.forEach((m) => { if (m.replies && !m.done && (m.id === ui.sbar.msg || (m.pid === pid && m.replies.every((r) => ['sbar', 'goto', 'chart'].includes(r.act) && (!r.pid || r.pid === pid))))) { m.done = true; m.read = true; } });
      spend(6, (Ax) => {
        const rx = ui.sbar.picked.filter((id) => id.startsWith('rx:')).map((id) => { const [, mid, t] = id.split(':'); return { mid, t: +t, e: (s.errors || []).find((e) => e.pid === pid && e.medId === mid && e.t === +t) }; });
        const errs = ui.sbar.picked.filter((id) => id.startsWith('err:')).map((id) => (s.errors || []).find((e) => 'err:' + e.id === id)).concat(rx.map((r) => r.e)).filter(Boolean);
        const fine = rx.filter((r) => !r.e).map((r) => `The ${d.meds.find((m) => m.id === r.mid).name.toLowerCase()} at ${E.clock(r.t)} was ordered and appropriate. Thanks for double-checking.`);
        const held = ui.sbar.picked.filter((id) => id.startsWith('hd:')).map((id) => d.meds.find((m) => m.id === id.slice(3))).filter(Boolean).map((m) => { const st = s.meds[m.id], hAt = st.at, nm = m.name.toLowerCase(); if (m.param) { const ck = (m.checks ? m.checks(s, P, Ax) : []).filter((c) => c.ok === true || c.ok === false), bad = ck.filter((c) => c.ok === false); if (ck.length && !bad.length) { st.status = 'due'; st.at = null; st.note = ''; return `You held the ${nm} at ${E.clock(hAt)}? ${ck.map((c) => `${c.label} ${c.value}`).join(', ')}. None of that meets "${m.param}", so the order says give it. Give it now, and thanks for flagging it.`; } return `Holding the ${nm} was right: ${bad.map((c) => `${c.label.toLowerCase()} ${c.value}`).join(', ')}. Keep it held and recheck before the next dose.`; } return `Thanks for telling me about the ${nm}. Hold it for now; I'll review it.`; });
        const picked = ui.sbar.picked.filter((id) => !/^(err|rx|did|hd):/.test(id));
        const did = ui.sbar.picked.filter((id) => id.startsWith('did:')).map((id) => s.log.find((l) => 'did:' + l.id === id)).filter(Boolean);
        const noted = did.length ? `Good to know: ${did.slice(0, 3).map((l) => { const x = didText(l); return lcFirst(x); }).join('; ')}${did.length > 3 ? `, and ${did.length - 3} more` : ''}.` : '';
        const items = d.sbar.items(s, P, Ax); const keys = picked.filter((id) => (items.find((i) => i.id === id) || {}).key);
        const noise = picked.filter((id) => { const it = items.find((i) => i.id === id); return it && !it.key; });
        const fix = errs.map((e) => F.tellMD(s, Ax, d, e, prov(pid).name));
        reply = [errs.length ? `Thank you for telling me. ${[...new Set(fix)].join(' ')}` : '', ...fine, ...held, picked.length && ui.sbar.req ? d.sbar.respond.call(d.sbar, s, P, Ax, picked, ui.sbar.req) : '', noted].filter(Boolean).join(' ');
        if (!keys.length && !errs.length && !fine.length && !did.length) Ax.judge(pid + '-sbar-empty-' + s.t, 'comm', -1, `Your call about ${d.short} had no clinically significant data in it.`, 'Providers act on findings. Lead with what changed and what you measured.', pid);
        if (noise.length >= 2) Ax.judge(pid + '-sbar-noise', 'comm', 0, `Your SBAR on ${d.short} included details that didn't change the picture.`, 'Keep it short. Include what the provider needs to make a decision.', pid);
        P.k.calledAt = s.t; Ax.log(pid, `Called ${prov(pid).name}. "${reply}"`, 'info');
      });
      if (s.ended) return; ui.sbar.reply = reply; ui.sbar.review = judgSince(j0, pid); reviewSound(ui.sbar.review); stamp(`Called ${prov(pid).name}`, 6); render();
    },
    'doc-pick'(el) {
      const q = ui.doc; if (!q || q.done) return; const d = def(q.pid), x = d.interventions.find((i) => i.id === q.id), sec = x.form(s, s.p[q.pid], A()).sections.find((z) => z.id === el.dataset.s);
      const L = q.a[sec.id] = q.a[sec.id] || [], o = el.dataset.o;
      if (sec.one) q.a[sec.id] = [o]; else { const i = L.indexOf(o); if (i >= 0) L.splice(i, 1); else L.push(o); }
      render();
    },
    'doc-sign'() {
      const q = ui.doc; if (!q || q.done) return; const d = def(q.pid), P = s.p[q.pid], x = d.interventions.find((i) => i.id === q.id), f = x.form(s, P, A());
      if (!f.sections.every((sec) => (q.a[sec.id] || []).length)) return;
      const j0 = s.judg.length, t0 = s.t; let text = '';
      doAct(x.label, x.cost, (Ax) => { text = x.sign(s, P, Ax, q.a) || ''; Ax.note(q.pid, 'You (RN)', text); return f.title + ' signed.'; });
      if (s.ended) return;
      ui.doc = { pid: q.pid, id: q.id, done: { title: f.title, text, t: t0, review: judgSince(j0).filter((j) => /note/.test(j.key || '')) } };
      reviewSound(ui.doc.done.review); TEL.track('doc_sign', { case: s.caseId, doc: q.id }); ui.ov = 'doc'; render();
    },
    delegate(el) { if (cnaAway()) { hint((el && el.nodeType ? el : document.querySelector('[data-act=delegate]')) || document.body, `${cna().name} isn't on the unit: ${cnaAway().charAt(0).toLowerCase() + cnaAway().slice(1)}. Ask Nova if you need hands.`); return; } ui.ov = 'deleg'; ui.delegMsg = null; ui.delegReview = null; render(); },
    deleg(el) { const t = C().delegation.tasks.find((x) => x.id === el.dataset.t); let msg = ''; const n0 = s.deleg.length, j0 = s.judg.length; spend(1, (Ax) => { msg = C().delegation.start(t, el.dataset.pid, s, Ax); }); if (s.ended) return; ui.delegMsg = msg; ui.delegReview = judgSince(j0).filter((j) => /^deleg/.test(j.key || '')); reviewSound(ui.delegReview); const nx = s.deleg[s.deleg.length - 1]; ui.delegNew = s.deleg.length > n0 ? nx.id + ':' + nx.pid + ':' + nx.at : null; ui.ov = 'deleg'; stamp(`${cna().name} is on it`, 1); render(); },
    nova() { ui.nova = null; ui.ov = 'nova'; render(); },
    'nova-ask'() { if (s.nova <= 0) return; s.nova -= 1; ui.nova = C().novaHint(s, A()); s.novaLog.push({ t: s.t, text: ui.nova }); save(); render(); },
    inbox() { ui.ov = 'inbox'; render(); s.inbox.forEach((m) => { m.read = true; }); save(); },
    readall() { s.inbox.forEach((m) => { m.read = true; }); save(); render(); },
    reply(el) { const m = s.inbox.find((x) => x.id === +el.dataset.m); if (!m || !m.replies) return; ui.toasts = ui.toasts.filter((x) => x !== m.id); ui.ov = null; onReply(m, m.replies[+el.dataset.i]); },
    'toast-x'(el) { const id = +el.dataset.m; ui.toasts = ui.toasts.filter((x) => x !== id); const m = s.inbox.find((x) => x.id === id); if (m) m.read = true; render(); },
    chart(el) { ui.guideChart = true; ui.chart = { pid: el.dataset.pid, tab: el.dataset.tab || (ui.chart && ui.chart.pid !== el.dataset.pid ? ui.chart.tab : 'overview') }; if (!el.dataset.tab && !(ui.ov === 'chart')) ui.chart.tab = 'overview'; ui.ov = 'chart'; render(); },
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
    by(el) { ui.byCj = el.dataset.v === 'cj'; ui.dtab = ui.byCj ? 'nclex' : 'shift'; if (ui.byCj && !ui.byCjSeen) { ui.byCjSeen = true; TEL.track('debrief_steps_view', { case: s ? s.caseId : caseId }); } render(); },
    dtab(el) { const v = el.dataset.v === 'nclex' ? 'nclex' : 'shift'; if (ui.dtab === v) return; ui.dtab = v; ui.byCj = v === 'nclex'; TEL.track('debrief_tab', { case: s ? s.caseId : caseId, tab: v }); render(); const tb = document.querySelector('.dtabs'); if (tb && tb.getBoundingClientRect().top < 0) window.scrollTo(0, window.scrollY + tb.getBoundingClientRect().top - 64); },
    'cj-go'(el) { ui.mOpen = ui.mOpen || {}; Object.keys(ui.mOpen).forEach((k) => { if (k.startsWith('c:')) delete ui.mOpen[k]; }); ui.mOpen['c:' + el.dataset.v] = 1; render(); const m = document.querySelector('.nx-steps .meter.open'); if (m) m.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); },
    review() { ui.ov = 'review'; TEL.track('review_info', { case: caseId }); render(); },
    pack() { ui.ov = 'pack'; TEL.track('pack_view', { case: caseId, from: 'home' }); render(); },
    'pack-buy'() {
      const u = CL && CL.user(); if (!u || !PACK.checkoutUrl) return;
      TEL.track('pack_checkout', { case: caseId });
      const url = new URL(PACK.checkoutUrl); url.searchParams.set('client_reference_id', u.id); if (u.email) url.searchParams.set('prefilled_email', u.email);
      location.href = url.toString();
    },
    'pack-check'() { if (!CL) return; ui.packWait = ui.packWait || 'checking'; render(); packPoll(1); },
    cls() { ui.cls = { code: '', name: (ui.cls && ui.cls.name) || '' }; ui.ov = 'class'; TEL.track('class_open', {}); render(); },
    'cls-join'() {
      const c = ui.cls || (ui.cls = {}), code = (c.code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, ''), name = (c.name || '').trim();
      c.ok = null;
      if (code.length < 4) { c.err = 'Enter the class code from your instructor.'; return render(); }
      if (!name) { c.err = 'Add your name, so your instructor knows who you are.'; return render(); }
      c.err = null; c.busy = true; render();
      CL.join(code, name).then((k) => { c.busy = false; c.code = ''; c.list = null; c.ok = `You're in ${k && k.name ? k.name : 'the class'}.${k && k.pack ? ' Every shift is open to you.' : ''}`; render(); })
        .catch((e) => { c.busy = false; c.err = /no class/i.test(e.message) ? 'No class with that code. Check it with your instructor.' : /too many/i.test(e.message) ? e.message : 'Couldn\'t join. Check your connection and try again.'; render(); });
    },
    'cls-leave'(el) { const c = ui.cls || (ui.cls = {}); CL.leave(el.dataset.id).then(() => { c.list = null; c.ok = 'You left the class.'; render(); }).catch(() => { c.err = 'Couldn\'t leave the class. Try again.'; render(); }); },
    account() { ui.acct = { email: (ui.acct && ui.acct.email) || '' }; ui.ov = 'account'; render(); },
    'acct-send'() {
      const a = ui.acct || (ui.acct = {}), email = (a.email || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { a.err = 'That email doesn\'t look right.'; return render(); }
      a.err = null; a.busy = true; render();
      CL.sendLink(email).then(() => { a.busy = false; a.sent = email; render(); }).catch((e) => { a.busy = false; a.err = CL.why(e); render(); });
    },
    'acct-again'() { ui.acct = { email: '' }; render(); },
    'acct-sync'() { CL.sync().then(fromCloud).catch(() => {}); render(); },
    'acct-del-ask'() { ui.confirm = { title: 'Delete your account?', text: 'Your account, your saved progress and results, your class memberships (your instructor stops seeing your results), any classes you run, and any shift pack you bought are deleted for good. Progress on this device stays until you reset it. This can\'t be undone.', ok: 'Delete my account', act: 'acct-del-yes', danger: true }; ui.ov = 'confirm'; render(); },
    'acct-del-yes'() { const a = ui.acct || (ui.acct = {}); a.delErr = null; ui.ov = null; render();
      CL.deleteAccount().then(() => { render(); hint(document.querySelector('.top .mark') || document.body, 'Account deleted. Progress on this device stays until you reset it.'); })
        .catch((e) => { a.delErr = (e && e.message) || 'check your connection and try again'; ui.ov = 'account'; render(); }); },
    'acct-out'() { CL.signOut(); ui.ov = null; render(); hint(document.querySelector('.top .mark') || document.body, 'Signed out. Your progress stays on this device.'); },
    tel(el) { TEL.setOptOut(el.dataset.v === 'off'); render(); },
    'fb-pay'(el) { ui.fb = ui.fb || {}; ui.fb.pay = ui.fb.pay === el.dataset.v ? null : el.dataset.v; render(); },
    'fb-send'() { const f = ui.fb || {}; if (!f.note && !f.pay) return; const d = s && s.ended ? E.debrief(s) : null; f.sent = TEL.feedback('debrief', Object.assign(fbWhere(), { would_pay: f.pay || '', note: (f.note || '').trim(), score: d ? d.overall : null })); render(); },
    rpt(el) { const k = el && el.dataset && el.dataset.k, tt = el && el.dataset && el.dataset.t, qid = el && el.dataset && el.dataset.q; const j = k !== undefined && s ? s.judg.find((x) => (x.key || '') === k && String(x.t) === String(tt)) || null : null; const q = qid && NG ? NG.byId(qid) : null; ui.rp = { j, q, back: q && ui.ov === 'ngn' ? 'ngn' : null, why: null, note: '' }; ui.ov = 'report'; render(); },
    'rpt-why'(el) { ui.rp.why = ui.rp.why === el.dataset.v ? null : el.dataset.v; render(); },
    'rpt-send'() { const r = ui.rp; if (!r || (!r.why && !r.note)) return; r.sent = TEL.feedback(r.j ? 'decision' : r.q ? 'question' : 'general', Object.assign(fbWhere(), { problem: r.why || '', note: (r.note || '').trim(), decision_key: r.j ? r.j.key || '' : '', decision_text: r.j ? r.j.text : '', patient: r.j ? r.j.pid || '' : '', question_id: r.q ? r.q.id : '', question_type: r.q ? r.q.type : '', question_step: r.q ? r.q.step || '' : '', question_stem: r.q ? String(r.q.stem || r.q.q || '').slice(0, 300) : '' })); render(); },
    'health-copy'(el) { copyText(ui.healthText || '').then((ok) => { if (ok) hint(el, 'Copied'); else hint(el, 'Copy blocked here. Select the text instead.'); }); },
    badge(el) { const b = RW.BADGES.find((x) => x.id === el.dataset.id); if (b) hint(el, `${b.label}: ${b.how}${prof.badges && prof.badges[b.id] ? ' ✓' : ''}`); },
    endask() { const late = s.t >= C().length - 30, left = pts().filter((x) => !gone(s.p[x.id]) && !(s.report && s.report[x.id])).map((x) => x.room); ui.confirm = { title: late ? 'End the shift?' : 'End the shift early?', text: late ? (left.length ? `You haven't given ${oncoming().name} report on ${left.join(', ')}. The next nurse starts blind on them.` : `${oncoming().name} has report on everyone. You'll see your debrief.`) : 'Unfinished work will count as missed in your debrief.', ok: late && left.length ? 'End without report' : 'End shift', act: 'end-yes' }; ui.ov = 'confirm'; render(); },
    'end-yes'() { ui.ov = null; endShift(); },
    filter(el) {
      ui.filter = el.dataset.k;
      if (el.dataset.k === 'bad' && s && !ui.reflected) { ui.reflected = true; prof.reflect = (prof.reflect || 0) + 1; prof.badges = prof.badges || {}; if (prof.reflect >= 3 && !prof.badges.reflect) { prof.badges.reflect = Date.now(); setTimeout(() => { const b = document.querySelector('.filter [data-k="bad"]'); if (b) hint(b, 'New badge: Reflective practice, for going back over your misses.'); FX.play('star'); }, 120); } E.store.saveProfile(prof); }
      render();
    },
    awards(el) { ui.awFrom = ui.view === 'debrief' ? 'debrief' : 'home'; ui.view = 'awards'; ui.awTab = (el && el.dataset.k) || ui.awTab || 'all'; ui.ov = null; render(true); },
    'aw-tab'(el) { ui.awTab = el.dataset.k; render(); },
    'les-f'(el) { ui.lesF = el.dataset.k; render(); },
    'aw-back'() { ui.view = ui.awFrom === 'debrief' && s && s.ended ? 'debrief' : 'home'; render(true); },
    'next-case'(el) { caseId = el.dataset.id; E.useCase(caseId); E.store.clear(); startNew(); },
    'reset-ask'() { const signed = CL && CL.user && CL.user(); ui.confirm = { title: 'Reset all progress?', text: `Every finished shift, star, XP point, badge, lesson and practice result on this device will be cleared, and any shift in progress ends. This can't be undone.${signed ? ' You\'re signed in: your account keeps its copy and will sync it back. Sign out first to start fresh here.' : ''}`, ok: 'Reset everything', act: 'reset-yes', danger: true }; ui.ov = 'confirm'; render(); },
    'reset-yes'() { E.store.clear(); E.store.clearLast(); s = null; ui.or = null; try { localStorage.removeItem(ORK); } catch (e) { /* storage off */ } ['runs', 'seen', 'ngn', 'stars', 'best', 'done', 'badges', 'floorSeen', 'lessons', 'life', 'badOut', 'reflect', 'xp'].forEach((k) => { delete prof[k]; }); Object.assign(prof, { runs: [], seen: {} }); E.store.saveProfile(prof); prof = E.store.profile(); ui.coachStep = {}; ui.ov = null; ui.view = 'home'; TEL.track('progress_reset', {}); render(true); hint(document.querySelector('.top .mark') || document.body, 'Progress reset. Your next shift starts with the walkthrough.'); },
    'reset-tips'(el) { prof.seen = {}; E.store.saveProfile(prof); ui.coachStep = {}; render(); hint(document.querySelector('[data-act="reset-tips"]') || el, 'The intro and tips will show again.'); },
    'lastfind-x'() { ui.lastFind = null; render(); },
    'res-close'() { const c = ui.res && ui.res.crit, lab = ui.res && ui.res.label; ui.ov = null; ui.res = null; ui.flash = null; if (c) ui.spot = s.loc; const n = Date.now(); if (ui.ghosts.some((g) => g.held)) setTimeout(() => FX.play('check'), 300); ui.ghosts.forEach((g) => { if (g.held) { g.held = false; g.born = n; } }); ui.stampRow = lab ? { label: lab, born: n } : null; render(); },
    'crit-go'(el) { const m = s.inbox.find((x) => x.id === ui.crit); if (m) m.read = true; ui.ov = null; ui.crit = null; ui.spot = el.dataset.pid; enterRoom(el.dataset.pid); },
    'crit-x'() { const m = s.inbox.find((x) => x.id === ui.crit); if (m) m.read = true; const inRoom = m && ui.view === 'room' && s.loc === m.pid; ui.ov = null; ui.crit = null; if (inRoom) ui.spot = m.pid; render(); },
    'rc-x'() { ui.receipt = null; render(); },
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
    report(el) { if (!s || s.ended || !inGame()) return; openReport(el.dataset.pid || el.dataset.id || null); },
    'rep-go'(el) { ui.rep = { pid: el.dataset.pid, picked: [], reply: null, review: null }; render(); },
    'rep-pick'(el) { const p = ui.rep.picked, i = p.indexOf(el.dataset.id); if (i >= 0) p.splice(i, 1); else p.push(el.dataset.id); render(); },
    'rep-send'() { const r = ui.rep, d = def(r.pid), P = s.p[r.pid], items = reportItems(d, P), j0 = s.judg.length; let rep = ''; spend(2, (Ax) => { rep = F.giveReport(s, Ax, r.pid, r.picked, items); }); if (s.ended) return; if (!ui.rep) return render(); r.reply = rep; r.replyPid = r.pid; r.review = judgSince(j0, r.pid); reviewSound(r.review); stamp(`Report on ${d.short}`, 2); render(); },
    calls() { ui.ov = 'calls'; render(); },
    here() { render(); window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }); },
    'intro-tap'() { if (!ui.introAll) { ui.introAll = true; render(); } },
    'intro-go'() { markSeen('intro:' + caseId); ui.intro = null; ui.introAll = false; render(); },
    'coach-next'() { const c = coachFor(); if (!c) return; ui.coachStep[c.key] = c.i + 1; if (c.i + 1 >= c.n) { markSeen('coach:' + c.key); if (c.key === 'room') TEL.track('tour_done', { case: s.caseId }); } coachPlace(); },
    'coach-skip'() { if (ui.view === 'room' && !seen('coach:room')) TEL.track('tour_skip', { step: (ui.coachStep && ui.coachStep.room) || 0, case: s && s.caseId }); markSeen('coach:station'); markSeen('coach:room'); coachPlace(); },
    msg(el) {
      const m = s.inbox.find((x) => x.id === +el.dataset.m); if (!m) return;
      m.read = true; ui.toasts = ui.toasts.filter((x) => x !== m.id);
      if (m.replies && !m.done && m.replies.length > 1 && !m.bell) { ui.ov = 'inbox'; ui.msgFocus = m.id; save(); return render(); }   // a question with choices opens where the choices are
      if (m.pid && def(m.pid) && here(def(m.pid)) && gone(s.p[m.pid]) && m.away) return openAway(m.pid);
      if (m.pid && def(m.pid) && here(def(m.pid)) && !gone(s.p[m.pid]) && !(ui.view === 'room' && s.loc === m.pid)) return enterRoom(m.pid);
      save(); render();
    },
    pending(el) { const d = def(el.dataset.pid); hint(el, `${d.room} is ${/^[AEIOU]/i.test(admWord(d)) ? 'an' : 'a'} ${admWord(d).toLowerCase()} from ${fromOf(d)}, arriving about ${E.clock(d.arrives)}.`); },
    cast(el) {
      const id = el.dataset.id; R.poke(id + ':bust');
      const d = C().patients.find((p) => p.id === id), look = d ? d.look : (C().staff[id] || {}).look;
      const text = id === 'nova' ? sayText('Go see the sickest one first.', true) : look && look.lines ? sayText(look.lines.calm, true) : null;
      ui.castSay = text ? { id, text } : null; render();
      clearTimeout(ui.castT); ui.castT = setTimeout(() => { if (ui.castSay && ui.castSay.id === id && ui.view === 'home') { ui.castSay = null; render(); } }, 3200);
    },
  };

  /* Feedback. Answers get a pop and a moment to register; commitments get a chime and a stamp.
     None of it says whether the choice was right: that stays in the debrief. */
  const SELECT = new Set(['dtab', 'cj-go', 'ptab', 'pf', 'cs-tab', 'ngn-move', 'ref-card', 'meter', 'sc-why', 'aw-tab', 'les-f', 'awards', 'aw-back', 'away', 'away-ho', 'away-fam', 'away-back', 'report', 'rep-go', 'roster', 'prio', 'rank-peek', 'calls', 'brain-all', 'here', 'sbar-req', 'dose', 'hreason', 'pick-case', 'rk', 'filter', 'set', 'assess', 'prep', 'h-go', 'dock', 'poke', 'clue', 'cast', 'msg']);
  const TOGGLE = new Set(['sbar-pick', 'flag', 'away-pick', 'rep-pick']);
  const COMMIT = new Set(['reset-yes', 'doc-sign', 'away-ho-send', 'away-note', 'away-upd', 'rep-send', 'bell', 'round', 'crit-x', 'reset-tips', 'med-give', 'med-hold', 'med-declined', 'sbar-send', 'int', 'comm', 'rrt-generic', 'nova-ask', 'rank-go', 'end-yes', 'new-yes', 'catchup']);
  const NAV = new Set(['crit-go', 'goto', 'back', 'msg', 'rank-go', 'h-done', 'new', 'new-yes', 'resume', 'home', 'end-yes', 'next-case', 'intro-go']);
  const CHOOSE = { dlg: 'select', reply: 'select', deleg: 'commit', 'away-fam-pick': 'select' };           // answers that advance the scene
  const JUST = new Set(['ngn-pick', 'pf', 'away-pick', 'rep-pick', 'rep-go', 'sbar-req', 'dose', 'hreason', 'pick-case', 'sbar-pick', 'flag', 'set', 'filter', 'h-go', 'dock', 'chart']);
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
      if (x.dataset.x === 'copy') { copyText(detail).then((ok) => { x.textContent = ok ? 'Copied' : 'Select the text above'; }); return; }
      n.remove(); document.querySelectorAll('.ff,.xpop,.coach,.coach-ring').forEach((q) => q.remove());
      if (x.dataset.x === 'home') { if (s && !s.ended) save(); ui.view = 'home'; }
      ui.ov = null; ui.ff = null; ui.pops = []; ui.critQ = [];
      try { render(true); } catch (e2) { ui.view = 'home'; try { render(true); } catch (e3) { /* truly stuck */ } }
    });
  }
  /* A thrown error in the game's own code shows the crash card. Errors from browser extensions don't. A rejected
     promise is never game logic (the game's state code is synchronous): it's the browser declining something
     (audio, clipboard, a network call, the install prompt), so it's logged quietly instead of blanking the game. */
  addEventListener('error', (e) => { if (!e.error) return; const f = String(e.filename || ''); if (f && !f.startsWith(location.href.split('#')[0].split('?')[0]) && !f.startsWith(location.origin)) return; crashed(e.error, 'async'); });
  addEventListener('unhandledrejection', (e) => {
    try { e.preventDefault(); } catch (er) { /* old browsers */ }
    const r = e.reason, info = { at: new Date().toISOString(), act: 'promise', msg: String((r && r.message) || r), name: String((r && r.name) || ''), view: ui.view, ov: ui.ov || '', caseId: s ? s.caseId : caseId };
    try { localStorage.setItem('theshift.lastAsync', JSON.stringify(info)); } catch (er) { /* storage off */ }
    try { TEL.track('error_async', { msg: info.msg.slice(0, 200), name: info.name, view: info.view, ov: info.ov, case: info.caseId }); } catch (er) { /* never let reporting crash */ }
  });
  // Copy text: the clipboard API where allowed, a hidden textarea where it isn't. Resolves true or false, never rejects.
  function copyText(text) {
    const legacy = () => { try { const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok; } catch (e) { return false; } };
    try { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(() => true, () => legacy()); } catch (e) { /* fall through */ }
    return Promise.resolve(legacy());
  }
  function onClick(e) {
    armIdle();
    if (ui.dragJust) { ui.dragJust = false; return; }
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
      // A plain tap arms the button; a second tap within a few seconds commits. Keyboard activation commits at once.
      const hk = el.dataset.hk || a;
      if (e.detail !== 0 && e.clientX !== undefined && !(ui.armed && ui.armed.k === hk && Date.now() - ui.armed.at < 4000)) { ui.armed = { k: hk, at: Date.now() }; el.classList.add('armed'); hint(el, 'Tap again to confirm, or press and hold.', ''); FX.play('tap'); clearTimeout(ui.armT); ui.armT = setTimeout(() => { ui.armed = null; document.querySelectorAll('.holdbtn.armed').forEach((b) => b.classList.remove('armed')); }, 4000); return; }
      ui.armed = null; cancelHold();
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
    else if (a === 'ngn-pick') { const now = [...document.querySelectorAll('[data-act="ngn-pick"]')].find((x) => keyOf(x) === keyOf(el)); FX.play(now && now.classList.contains('on') ? 'select' : 'deselect'); }
    else if (TOGGLE.has(a)) FX.play((a === 'flag' ? s.brain.includes(el.dataset.k) : a === 'away-pick' ? ui.away.picked.includes(el.dataset.id) : a === 'rep-pick' ? ui.rep.picked.includes(el.dataset.id) : ui.sbar && ui.sbar.picked.includes(el.dataset.id)) ? 'select' : 'deselect');
    else FX.play(COMMIT.has(a) ? 'commit' : SELECT.has(a) ? 'select' : 'tap');
  }
  /* Press-and-hold: a committing action takes a deliberate beat (HOLD_MS, the same everywhere).
     The hold is tracked by key, not by element, so a re-render under the finger (a toast, the clock) doesn't
     cancel it or hide its progress; only lifting the finger or sliding well off the button does. */
  const HOLD_MS = 600;
  function holdKey(el) { return el.dataset.hk || el.dataset.act; }
  function holdEls(k) { return [...document.querySelectorAll('[data-hold]')].filter((x) => holdKey(x) === k); }
  function startHold(e) {
    if (e.button > 0) return;
    const el = e.target.closest && e.target.closest('[data-hold]'); if (!el || el.getAttribute('aria-disabled') === 'true' || ui.busy) return;
    cancelHold(); const k = holdKey(el);
    ui.hold = { k, act: el.dataset.act, ds: Object.assign({}, el.dataset), t0: performance.now(), x: e.clientX, y: e.clientY, id: e.pointerId };
    el.classList.add('holding'); FX.play('tap');
    const step = () => {
      const h = ui.hold; if (!h || h.k !== k) return;
      const f = Math.min(1, (performance.now() - h.t0) / HOLD_MS);
      holdEls(k).forEach((b) => { b.classList.add('holding'); b.style.setProperty('--hp', f.toFixed(3)); });
      if (f < 1) { h.raf = requestAnimationFrame(step); return; }
      ui.hold = null; holdEls(k).forEach((b) => { b.classList.remove('holding', 'armed'); b.style.removeProperty('--hp'); });
      ui.holdDone = true; setTimeout(() => { ui.holdDone = false; }, 600); ui.armed = null;
      const cur = holdEls(k)[0] || el; zap(cur, null, 'strong'); FX.play('commit');
      const fn = handlers[h.act]; if (fn) safe(h.act, () => fn(cur.isConnected ? cur : { dataset: h.ds }));
    };
    ui.hold.raf = requestAnimationFrame(step);
  }
  function moveHold(e) {
    const h = ui.hold; if (!h || (h.id !== undefined && e.pointerId !== h.id)) return;
    // Sliding off the button cancels; a jitter, or the button being redrawn underneath, doesn't.
    const b = holdEls(h.k)[0], r = b && b.getBoundingClientRect();
    const off = r ? (e.clientX < r.left - 16 || e.clientX > r.right + 16 || e.clientY < r.top - 16 || e.clientY > r.bottom + 16) : Math.hypot(e.clientX - h.x, e.clientY - h.y) > 40;
    if (off) cancelHold();
  }
  function cancelHold() {
    const h = ui.hold; ui.hold = null;
    if (h) { cancelAnimationFrame(h.raf); holdEls(h.k).forEach((b) => { b.classList.remove('holding'); b.style.removeProperty('--hp'); }); }
  }
  function onKey(e) {
    if (e.key === 'Escape' && ui.ov === 'crit') { handlers['crit-x'](); return; }
    if (e.key === 'Escape' && ui.ov === 'result') { handlers['res-close'](); return; }
    if (ui.ov === 'orient' && ui.or && !/INPUT|TEXTAREA/.test((e.target && e.target.tagName) || '')) { if (e.key === 'Escape') { closeOrient(false); return; } if (e.key === 'ArrowRight' && !(e.target.closest && e.target.closest('.or-board'))) { handlers.or({ dataset: { do: ui.or.i === OR.CH.length - 1 ? 'done' : 'next' } }); return; } if (e.key === 'ArrowLeft' && !(e.target.closest && e.target.closest('.or-board'))) { handlers.or({ dataset: { do: 'back' } }); return; } }
    if (ui.ov === 'dialog' && ui.view === 'room' && /^[1-9]$/.test(e.key) && !/INPUT|TEXTAREA/.test((e.target && e.target.tagName) || '')) { const b = document.querySelectorAll('.convo .cv-reply')[+e.key - 1]; if (b) { e.preventDefault(); b.click(); return; } }
    if (e.key === 'Escape' && ui.ov && ui.ov !== 'rank') { handlers.close(); return; }
    if (e.key === 'Escape' && !ui.ov && s && !s.ended && ui.view === 'room') { handlers.back(); return; }
    const el = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && el && el.getAttribute && el.getAttribute('role') === 'button' && el.tagName !== 'BUTTON') { e.preventDefault(); onClick({ target: el, preventDefault() {} }); }
  }

  /* ------------ drag to reorder: any [data-sort] list whose children carry data-key ------------
     Mouse and pen drag the whole card; on touch, drag from the handle so the page still scrolls.
     While dragging, the card follows the pointer and the others slide out of the way; on drop the new
     order goes to onSorted() and the page re-renders with the card easing into its slot. */
  let SD = null;
  function sortDown(e) {
    if (e.button > 0 || ui.busy) return;
    const li = e.target.closest && e.target.closest('[data-sort] > [data-key]'); if (!li) return;
    const list = li.parentElement; if (list.classList.contains('done')) return;
    if (!e.target.closest('.grip') && (e.pointerType === 'touch' || e.target.closest('button, a, input, textarea, select, summary'))) return;
    const items = [...list.children].filter((x) => x.dataset.key);
    if (items.length < 2) return;
    const tops = items.map((x) => x.offsetTop), hs = items.map((x) => x.offsetHeight);
    const gap = Math.max(0, tops[1] - tops[0] - hs[0]);
    const sc = list.closest('.sheet-b, .or-body') || document.scrollingElement;
    SD = { li, list, items, tops, hs, gap, idx: items.indexOf(li), to: items.indexOf(li), y0: e.clientY, s0: sc.scrollTop, sc, id: e.pointerId, moved: false };
    try { li.setPointerCapture(e.pointerId); } catch (er) { /* fine */ }
    e.preventDefault();
  }
  function sortMove(e) {
    if (!SD || e.pointerId !== SD.id) return;
    const d = SD, dy0 = e.clientY - d.y0 + (d.sc.scrollTop - d.s0);
    if (!d.moved) { if (Math.abs(dy0) < 4) return; d.moved = true; d.li.classList.add('dragging'); d.list.classList.add('sorting'); FX.play('tap'); }
    const lo = d.tops[0] - d.tops[d.idx], hi = d.tops[d.items.length - 1] + d.hs[d.items.length - 1] - d.tops[d.idx] - d.hs[d.idx];
    const dy = Math.max(lo - 12, Math.min(hi + 12, dy0));
    d.li.style.transform = `translateY(${dy}px) scale(1.02)`;
    // Cards differ in height: going up, the dragged card's top edge decides; going down, its bottom edge.
    const top = d.tops[d.idx] + dy, bot = top + d.hs[d.idx];
    let to = d.idx; d.items.forEach((x, j) => { const mid = d.tops[j] + d.hs[j] / 2; if (j < d.idx && top < mid) to = Math.min(to, j); if (j > d.idx && bot > mid) to = Math.max(to, j); });
    const step = d.hs[d.idx] + d.gap;
    d.items.forEach((x, j) => { if (j === d.idx) return; const sh = j > d.idx && j <= to ? -step : j < d.idx && j >= to ? step : 0; x.style.transform = sh ? `translateY(${sh}px)` : ''; });
    if (to !== d.to) {
      d.to = to; FX.play('tap');
      const ord = d.items.map((x, j) => j).filter((j) => j !== d.idx); ord.splice(to, 0, d.idx);
      const L = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
      ord.forEach((j, pos) => { const n = d.items[j].querySelector('.n'); if (!n) return; const bb = n.querySelector('b'), sm = n.querySelector('small'); if (bb) bb.textContent = pos + 1; if (sm) sm.textContent = pos === 0 ? 'first' : pos === ord.length - 1 ? 'last' : L[pos]; n.classList.toggle('lead', pos === 0); }); const live = document.getElementById('rank-live'); if (live) live.textContent = `Moved to position ${to + 1} of ${d.items.length}.`; }
    const r = d.sc === document.scrollingElement ? { top: 0, bottom: innerHeight } : d.sc.getBoundingClientRect();
    if (e.clientY < r.top + 48) d.sc.scrollTop -= 10; else if (e.clientY > r.bottom - 48) d.sc.scrollTop += 10;
  }
  function sortUp(e) {
    if (!SD || e.pointerId !== SD.id) return;
    const d = SD; SD = null;
    if (!d.moved) return;
    ui.dragJust = true; setTimeout(() => { ui.dragJust = false; }, 60);
    const keys = d.items.map((x) => x.dataset.key), k = keys.splice(d.idx, 1)[0]; keys.splice(d.to, 0, k);
    const from = d.li.getBoundingClientRect().top;
    d.items.forEach((x) => { x.style.transform = ''; }); d.list.classList.remove('sorting');
    onSorted(d.list.dataset.sort, keys, k);
    const n = document.querySelector(`[data-sort="${d.list.dataset.sort}"] > [data-key="${k}"]`);
    if (n && !reduced()) { const dy = from - n.getBoundingClientRect().top; n.style.transition = 'none'; n.style.transform = `translateY(${dy}px) scale(1.02)`; requestAnimationFrame(() => { n.style.transition = 'transform .22s cubic-bezier(.2,.8,.2,1)'; n.style.transform = ''; }); }
    FX.play('commit');
  }
  function onSorted(name, keys, moved) {
    if (name === 'rank' && ui.rank && !ui.rankDone) {
      ui.rank = keys; ui.rankMoved = moved; ui.rankDragged = true; render();
      clearTimeout(ui.rankT); ui.rankT = setTimeout(() => { ui.rankMoved = null; const m = document.querySelector('.rank li.moved'); if (m) m.classList.remove('moved'); }, 900);
      const f = document.querySelector(`.rank li[data-key="${moved}"] .grip`); if (f) f.focus && f.focus({ preventScroll: true });
    } else if (S.orient && S.orient.sorted(name, keys, moved)) render();
  }

  function boot() {
    applySettings();
    const all = CASES.map((id) => E.getCase(id)).filter(Boolean);
    all.forEach((k) => { const add = Object.assign(F.staffFor(k, all), FL.staffFor()); Object.keys(add).forEach((key) => { if (!k.staff[key]) k.staff[key] = add[key]; }); });
    CASES.forEach((id) => { const k = E.getCase(id); if (k && STY) STY.install(k); });
    CASES.forEach((id) => { const k = E.getCase(id); if (!k) return; k.patients.forEach((p) => R.define(p.id, p.look)); Object.entries(k.staff).forEach(([key, v]) => { if (v.look) R.define(key, v.look); }); });
    document.addEventListener('click', onClick);
    document.addEventListener('pointerdown', startHold); document.addEventListener('pointermove', moveHold);
    document.addEventListener('pointerdown', sortDown); document.addEventListener('pointermove', sortMove);
    ['pointerup', 'pointercancel'].forEach((ev) => document.addEventListener(ev, sortUp));
    ['pointerup', 'pointercancel'].forEach((ev) => document.addEventListener(ev, cancelHold, true));
    document.addEventListener('contextmenu', (e) => { if (e.target.closest && e.target.closest('[data-hold]')) e.preventDefault(); });
    document.addEventListener('keydown', onKey); document.addEventListener('keydown', armIdle);
    document.addEventListener('input', (e) => { const b = e.target && e.target.dataset && e.target.dataset.bind; if (!b) return; const v = e.target.value; if (b === 'ngn.n' && ui.ngn) { ui.ngn.a.n = v; const bt = document.querySelector('[data-act="ngn-check"]'); if (bt) { if (NG.numOf(v) !== null) { bt.removeAttribute('aria-disabled'); bt.classList.remove('off'); } else { bt.setAttribute('aria-disabled', 'true'); } } }
      else if (b === 'note') { ui.fb = ui.fb || {}; ui.fb.note = v; } else if (b === 'rp.note' && ui.rp) ui.rp.note = v; else if (b === 'acct.email') { ui.acct = ui.acct || {}; ui.acct.email = v; return; } else if (b === 'cls.code' || b === 'cls.name') { ui.cls = ui.cls || {}; ui.cls[b.slice(4)] = v; return; } const btn = document.querySelector(b === 'note' ? '[data-act="fb-send"]' : '[data-act="rpt-send"]'); if (btn) { const ok = b === 'note' ? !!(v.trim() || (ui.fb && ui.fb.pay)) : !!(v.trim() || (ui.rp && ui.rp.why)); if (ok) { btn.removeAttribute('aria-disabled'); btn.removeAttribute('data-why'); } else { btn.setAttribute('aria-disabled', 'true'); btn.dataset.why = 'Answer one of the two first.'; } } });
    requestAnimationFrame(frameMon);
    if (/[?&#]health\b/.test(location.href)) setTimeout(() => { ui.ov = 'health'; render(); }, 400);
    const g = E.store.load(); if (g && !g.ended && E.getCase(g.caseId)) { s = g; caseId = g.caseId; E.useCase(caseId); }
    ui.view = 'home'; safe('boot', () => render(true));
    // A walkthrough interrupted by a reload picks up where it stopped (finishing it from Start still starts that shift).
    const wasOr = !seen('orient') && OR && orLoad();
    if (wasOr) safe('orient-resume', () => { if (!s && wasOr.caseId && E.getCase(wasOr.caseId)) caseId = wasOr.caseId; openOrient(wasOr.start); });
    if (CL) { CL.onChange(() => { if (ui.ov === 'account' || ui.ov === 'class' || ui.ov === 'pack' || ui.view === 'home') render(); }); CL.ready.then((ok) => { const linked = CL.linked(); if (ok) fromCloud(); if (/[?&]pack=thanks/.test(location.search)) { history.replaceState(null, '', location.pathname); if (CL.user()) { ui.packWait = 'checking'; ui.ov = 'pack'; render(); packPoll(8); } } if (linked && CL.user()) setTimeout(() => hint(document.querySelector('[data-act=account].acct-link') || document.querySelector('.top .mark') || document.body, `Signed in as ${CL.user().email}. Your progress is saved to your account.`), 300); else if (linked) { ui.ov = 'account'; render(); } }).catch(() => {}); }
    addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); ui.installEvt = e; });
    addEventListener('appinstalled', () => { ui.installEvt = null; TEL.track('app_installed', {}); });
    TEL.track('app_open', { has_save: !!(s && !s.ended), shifts_done: prof.runs.length, standalone: standalone() });
    // Where people stop: the last screen of an unfinished shift when the page goes away.
    addEventListener('pagehide', () => { if (s && !s.ended && ui.view !== 'home') TEL.track('shift_left', { case: s.caseId, game_min: Math.round(s.t), view: ui.view, ov: ui.ov || '', wall_min: s.wall0 ? Math.round((Date.now() - s.wall0) / 60000) : null }); TEL.flush(true); });
  }
  S.ui = { boot, _handlers: handlers, _ui: ui, _state: () => s, _render: render, _perf: PERF, _law: lawText };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window.Shift);
