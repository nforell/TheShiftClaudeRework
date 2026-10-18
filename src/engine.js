/* The Shift — simulation engine. Knows nothing about specific patients; cases plug in. */
window.Shift = window.Shift || {};
(function (S) {
  let START = 7 * 60;   // minutes after midnight when the active case's shift starts
  const cases = {};
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const clock = (t) => {
    const m = START + Math.round(t);
    return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  };

  function registerCase(c) { cases[c.id] = c; }
  function useCase(id) { const c = cases[id]; if (c) START = c.start !== undefined ? c.start : 7 * 60; }
  function getCase(id) { return cases[id]; }

  function newGame(caseId) {
    const c = cases[caseId];
    useCase(caseId);
    const s = {
      v: 1, caseId, t: 0, view: 'handoff', hIdx: 0, loc: 'station',
      brain: [], p: {}, meds: {}, inbox: [], log: [], judg: [], fired: {},
      nova: c.novaCredits || 3, novaLog: [], deleg: [], ended: false,
      answers: {}, seq: 0, fresh: [], lastRoom: null, seed: Math.floor(Math.random() * 1e9), xp: 0, streak: 0, bestStreak: 0, xpSeen: 0,
    };
    c.patients.forEach((d) => {
      const P = Object.assign({ k: {}, vit: [], labs: [], notes: [], orders: [], seenAt: null, assessAt: {}, arrived: !d.arrives },
        JSON.parse(JSON.stringify(d.init || {})));
      P.labs = JSON.parse(JSON.stringify(d.labs || []));
      P.orders = JSON.parse(JSON.stringify(d.orders || []));
      P.notes = JSON.parse(JSON.stringify(d.notes || []));
      if (d.nightVitals) P.vit.push(Object.assign({ t: -25, by: c.handoffBy || 'Dana (night RN)' }, d.nightVitals));
      s.p[d.id] = P;
      (d.meds || []).forEach((m) => {
        s.meds[m.id] = { status: m.initStatus || (m.prn ? 'prn' : 'due'), at: null, pid: d.id, note: '', given: [] };
      });
    });
    return s;
  }

  /* Handoff flags, itemized: which critical lines were missed and which flagged lines weren't critical. */
  function cueDetail(s, c) {
    const short = (t) => { t = String(t).replace(/\s+/g, ' ').trim(); return t.length > 70 ? t.slice(0, t.lastIndexOf(' ', 68)) + '…' : t; };
    const missed = [], extra = [];
    c.patients.forEach((d) => (d.report || []).forEach((r, i) => { const k = d.id + ':' + i, on = s.brain.includes(k); if (r.key && !on) missed.push(`${d.room}: "${short(r.text)}"`); if (!r.key && on) extra.push(`${d.room}: "${short(r.text)}"`); }));
    const list = (a) => a.slice(0, 6).join('; ') + (a.length > 6 ? `; and ${a.length - 6} more` : '');
    return (missed.length ? ` Critical lines you didn't flag: ${list(missed)}.` : '') + (extra.length ? ` Flagged but not critical: ${list(extra)}.` : '');
  }
  function api(s) {
    const c = cases[s.caseId];
    const a = {
      s, c, clock, clamp,
      P: (id) => s.p[id],
      def: (id) => c.patients.find((p) => p.id === id),
      log(pid, text, kind) { s.log.push({ id: ++s.seq, t: s.t, pid, text, kind: kind || 'info' }); },
      judge(key, domain, delta, text, why, pid) {
        if (key && s.judg.some((j) => j.key === key)) return;
        // A dose whose order was discontinued or replaced can't be "missed".
        if (key && /-missed$/.test(key)) { const mid = key.slice(0, -7); for (const d of c.patients) { const m = (d.meds || []).find((x) => x.id === mid); if (m && m.available && !m.available(s, s.p[d.id])) return; } }
        if (key === 'brain') why = (why || '') + cueDetail(s, c);   // name the lines, so "4 that didn't matter" can be checked
        s.judg.push({ key, t: s.t, domain, delta, text, why, pid });
      },
      hasJudg: (key) => s.judg.some((j) => j.key === key),
      msg(o) {
        const m = Object.assign({ id: ++s.seq, t: s.t, read: false, replies: null, done: false }, o);
        s.inbox.unshift(m); s.fresh.push(m.id); return m;
      },
      vitals(pid) { return a.def(pid).vitals(s, s.p[pid], a); },
      recordVitals(pid, by) {
        const v = a.vitals(pid);
        s.p[pid].vit.push(Object.assign({ t: s.t, by }, v));
        s.p[pid].k.vitalsAt = s.t;
        return v;
      },
      lastVitals(pid) { const v = s.p[pid].vit; return v[v.length - 1]; },
      /* The vitals a dose decision is judged on: the set the nurse had in front of them (recorded in the last
         `mins` minutes), so feedback never quotes a number the player never saw. Falls back to the live value. */
      seen(pid, mins) { const v = s.p[pid].vit, l = v[v.length - 1]; if (l && s.t - l.t <= (mins || 30)) return Object.assign({ seenAt: l.t }, l); return Object.assign({ seenAt: null }, a.vitals(pid)); },
      addLab(pid, lab) { s.p[pid].labs.push(Object.assign({ t: s.t }, lab)); },
      addOrder(pid, text) { s.p[pid].orders.push({ t: s.t, text, isNew: true }); },
      /* An order that needs repeated nursing checks ("vitals every 15 min × 4"): puts each check on the task list until done.
         o: { id, text, every (min), times, vitals: true | rx: 'regex on the action label', tab, sys, first (min to first check) } */
      watch(pid, o) { s.watch = s.watch || []; if (s.watch.some((w) => w.id === o.id)) return; s.watch.push(Object.assign({ from: s.t, every: 15, times: 1 }, o, { pid })); },
      note(pid, author, text) { s.p[pid].notes.push({ t: s.t, author, text }); },
      recent: (t0, mins) => t0 !== null && t0 !== undefined && s.t - t0 <= mins,
    };
    return a;
  }

  /* When a patient leaves the unit (ICU, OR, NICU, discharge), questions asked about them before they left
     ("he won't wake to eat, is that normal?") stop offering answers: the situation those replies were for is over. */
  function retireStale(s) {
    Object.keys(s.p).forEach((pid) => {
      const P = s.p[pid]; if (!P || !(P.icu || P.gone)) return;
      if (P.leftAt === undefined) P.leftAt = s.t;
      s.inbox.forEach((m) => { if (m.pid === pid && m.replies && !m.done && m.t < P.leftAt && !m.replies.some((r) => r.act === 'away' || r.act === 'floor')) { m.done = true; m.read = true; } });
    });
  }

  /* Move the clock. With `until`, stop early at the first minute it names a reason, and return that reason. */
  function advance(s, mins, until) {
    const c = cases[s.caseId];
    const A = api(s);
    let why = null;
    for (let i = 0; i < mins; i++) {
      if (s.t >= c.length) break;
      s.t += 1;
      if (c.tick) c.tick(s, A);
      s.deleg.forEach((d) => {
        if (!d.done && d.due <= s.t) { d.done = true; c.delegation.complete(d, s, A); }
      });
      c.events.forEach((ev) => {
        if (s.fired[ev.id] !== undefined) return;
        if (ev.when(s, A)) { s.fired[ev.id] = s.t; ev.run(s, A); }
      });
      if (S.flow) S.flow.tick(s, A, c);
      if (S.floor) S.floor.tick(s, A, c);
      retireStale(s);
      if (until) { why = until(s, A); if (why) break; }
    }
    if (s.t >= c.length) s.ended = true;
    return why;
  }

  /* Run an action: effect happens now, then the clock moves. */
  function perform(s, cost, fn, until) {
    if (s.ended) return null;
    const A = api(s);
    if (fn) fn(A);
    return advance(s, cost || 0, until);
  }

  function finish(s) {
    const c = cases[s.caseId];
    const A = api(s);
    if (!s.finalized) { s.finalized = true; if (c.endChecks) c.endChecks(s, A); if (S.flow) S.flow.endChecks(s, A); if (S.floor) S.floor.endChecks(s, A); mergeMissedMeds(s, A); }
    s.ended = true;
    return debrief(s);
  }

  /* One missed med pass is one lesson, not five. Scheduled doses never given or held are folded into a
     single judgment per patient: -2 for one dose, -3 for two, -4 for three or more. */
  function mergeMissedMeds(s, A) {
    const by = {};
    s.judg.forEach((j) => { if (j.domain === 'meds' && j.pid && /-missed$/.test(j.key || '') && / was never given or held\.$/.test(j.text)) (by[j.pid] = by[j.pid] || []).push(j); });
    Object.keys(by).forEach((pid) => {
      const L = by[pid]; if (L.length < 2) return;
      const names = L.map((j) => j.text.replace(/ for .*$/, '')), d = A.def(pid), who = d ? d.short : pid;
      const list = names.length > 3 ? names.slice(0, 3).join(', ') + ` and ${names.length - 3} more` : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
      const merged = { key: `${pid}-meds-missed`, t: L[0].t, domain: 'meds', delta: L.length >= 3 ? -4 : -3, text: `${names.length} scheduled doses for ${who} were never given or held: ${list}.`, why: L[0].why, pid };
      const drop = new Set(L); s.judg = s.judg.filter((j) => !drop.has(j)); s.judg.push(merged);
    });
  }

  const DOMAINS = [
    ['safety', 'Patient safety'], ['priority', 'Prioritization'], ['assess', 'Assessment'],
    ['meds', 'Medication safety'], ['deleg', 'Delegation'], ['comm', 'Communication'],
    ['judgment', 'Clinical judgment'], ['time', 'Time management'],
  ];

  /* How one skill (or one NCLEX step) is scored from its decisions, kept step by step so the debrief can show the
     working. Every area starts at 60 (a shift with nothing notable). Each point from a strong call adds 6. The first
     3 points of misses cost 9 each; misses past that cost 4.5 each, so one bad stretch can't zero a whole skill.
     The result is rounded and kept between 5 and 100. No decisions at all means the area wasn't tested (null). */
  const BASE = 60, GOOD = 6, BAD = 9, BAD_AFTER = 4.5, BAD_FULL = 3;
  function tally(js) {
    const good = js.filter((j) => j.delta > 0).sort((a, b) => a.t - b.t), bad = js.filter((j) => j.delta < 0).sort((a, b) => a.t - b.t);
    let used = 0;
    const plus = good.map((j) => ({ j, pts: j.delta, add: j.delta * GOOD }));
    const minus = bad.map((j) => { const pts = -j.delta, full = Math.max(0, Math.min(pts, BAD_FULL - used)), half = pts - full; used += pts; return { j, pts, full, half, sub: full * BAD + half * BAD_AFTER }; });
    const goodPts = good.reduce((n, j) => n + j.delta, 0), badPts = bad.reduce((n, j) => n - j.delta, 0);
    const pen = Math.min(badPts, BAD_FULL) * BAD + Math.max(0, badPts - BAD_FULL) * BAD_AFTER;
    const raw = BASE + goodPts * GOOD - pen, score = js.length ? clamp(Math.round(raw), 5, 100) : null;
    return { base: BASE, plus, minus, notes: js.filter((j) => !j.delta), goodPts, badPts, gain: goodPts * GOOD, pen, raw, score, good: good.length, bad: bad.length };
  }
  function debrief(s) {
    const c = cases[s.caseId];
    const A = api(s);
    const dom = DOMAINS.map(([id, label]) => {
      const T = tally(s.judg.filter((j) => j.domain === id));
      return { id, label, score: T.score, good: T.good, bad: T.bad };
    });
    const scored = dom.filter((d) => d.score !== null);
    const overall = scored.length ? Math.round(scored.reduce((n, d) => n + d.score, 0) / scored.length) : 0;
    const outcomes = c.patients.map((d) => {
      const P = s.p[d.id], o = Object.assign({ id: d.id }, d.outcome(s, P, A));
      if (S.flow) o.next = S.flow.nextFor(s, A, d, P);
      // A patient nobody saw can't have a good outcome credited to the nurse.
      if (P.seenAt === null && (!d.arrives || P.arrived) && !P.icu && !P.gone && o.tone !== 'bad') return { id: d.id, tone: 'mixed', title: 'Never seen this shift', text: 'You never went into the room. Whatever happened with this patient happened without you.' };
      return o;
    });
    const harmed = outcomes.filter((o) => o.tone === 'bad').length;
    let rating = overall >= 85 ? 'Charge-nurse material' : overall >= 72 ? 'Safe, solid shift' : overall >= 58 ? 'Getting there' : 'Rough shift';
    if (harmed && overall >= 72) rating = 'Solid, with a miss that mattered';
    if (!harmed && rating === 'Rough shift' && overall >= 45) rating = 'Getting there';
    return { dom, overall, rating, outcomes, judg: s.judg.slice().sort((a, b) => a.t - b.t) };
  }

  /* Persistence — local for now; same shape could post to a backend later. */
  const KEY = 'theshift.save.v1', PROF = 'theshift.profile.v1', LAST = 'theshift.last.v1';
  /* Whatever is in storage (an older version, a cloud copy, a half-written save), hand the game a profile whose
     fields have the types it expects, so a bad value can never stop the screen from drawing. */
  const obj = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
  function cleanProfile(raw) {
    const p = Object.assign({}, obj(raw));
    p.runs = Array.isArray(p.runs) ? p.runs.filter((r) => r && typeof r === 'object' && typeof r.caseId === 'string').map((r) => Object.assign({}, r, { score: Number.isFinite(+r.score) ? +r.score : 0 })) : [];
    p.settings = Object.assign({ theme: 'system', text: 'normal', motion: 'full' }, obj(p.settings));
    ['seen', 'ngn', 'stars', 'best', 'done', 'badges', 'floorSeen', 'lessons'].forEach((k) => { if (k in p) p[k] = obj(p[k]); });
    Object.keys(p.ngn || {}).forEach((k) => { const r = p.ngn[k]; if (!r || typeof r !== 'object' || !Number.isFinite(+r.max) || !Number.isFinite(+r.score)) delete p.ngn[k]; });
    if ('xp' in p && !Number.isFinite(+p.xp)) p.xp = 0;
    return p;
  }
  const store = {
    save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} },
    load() { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} },
    profile() {
      let p = null;
      try { p = JSON.parse(localStorage.getItem(PROF) || 'null'); } catch (e) {}
      return cleanProfile(p);
    },
    saveProfile(p) { try { localStorage.setItem(PROF, JSON.stringify(p)); } catch (e) {} },
    /* The last finished shift, so its debrief (and the NCLEX questions waiting on it) survives a reload or a closed tab. */
    saveLast(s) { try { localStorage.setItem(LAST, JSON.stringify(s)); } catch (e) {} },
    loadLast() { try { const r = localStorage.getItem(LAST); const g = r ? JSON.parse(r) : null; return g && g.ended && g.reward && cases[g.caseId] ? g : null; } catch (e) { return null; } },
    clearLast() { try { localStorage.removeItem(LAST); } catch (e) {} },
  };

  S.engine = { registerCase, useCase, getCase, newGame, abs: (t) => START + t, api, advance, perform, finish, debrief, tally, SCORE: { BASE, GOOD, BAD, BAD_AFTER, BAD_FULL }, clock, clamp, store, DOMAINS, cases };
})(window.Shift);
