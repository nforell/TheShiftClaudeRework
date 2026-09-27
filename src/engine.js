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
      answers: {}, seq: 0, fresh: [], lastRoom: null,
    };
    c.patients.forEach((d) => {
      const P = Object.assign({ k: {}, vit: [], labs: [], notes: [], orders: [], seenAt: null, assessAt: {}, arrived: !d.arrives },
        JSON.parse(JSON.stringify(d.init || {})));
      P.labs = JSON.parse(JSON.stringify(d.labs || []));
      P.orders = JSON.parse(JSON.stringify(d.orders || []));
      P.notes = JSON.parse(JSON.stringify(d.notes || []));
      if (d.nightVitals) P.vit.push(Object.assign({ t: -25, by: 'Dana (night RN)' }, d.nightVitals));
      s.p[d.id] = P;
      (d.meds || []).forEach((m) => {
        s.meds[m.id] = { status: m.initStatus || (m.prn ? 'prn' : 'due'), at: null, pid: d.id, note: '', given: [] };
      });
    });
    return s;
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
      addLab(pid, lab) { s.p[pid].labs.push(Object.assign({ t: s.t }, lab)); },
      addOrder(pid, text) { s.p[pid].orders.push({ t: s.t, text, isNew: true }); },
      note(pid, author, text) { s.p[pid].notes.push({ t: s.t, author, text }); },
      recent: (t0, mins) => t0 !== null && t0 !== undefined && s.t - t0 <= mins,
    };
    return a;
  }

  function advance(s, mins) {
    const c = cases[s.caseId];
    const A = api(s);
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
    }
    if (s.t >= c.length) s.ended = true;
  }

  /* Run an action: effect happens now, then the clock moves. */
  function perform(s, cost, fn) {
    if (s.ended) return;
    const A = api(s);
    if (fn) fn(A);
    advance(s, cost || 0);
  }

  function finish(s) {
    const c = cases[s.caseId];
    const A = api(s);
    if (!s.finalized) { s.finalized = true; if (c.endChecks) c.endChecks(s, A); }
    s.ended = true;
    return debrief(s);
  }

  const DOMAINS = [
    ['safety', 'Patient safety'], ['priority', 'Prioritization'], ['assess', 'Assessment'],
    ['meds', 'Medication safety'], ['deleg', 'Delegation'], ['comm', 'Communication'],
    ['judgment', 'Clinical judgment'], ['time', 'Time management'],
  ];

  function debrief(s) {
    const c = cases[s.caseId];
    const A = api(s);
    const dom = DOMAINS.map(([id, label]) => {
      const js = s.judg.filter((j) => j.domain === id);
      const good = js.filter((j) => j.delta > 0).reduce((n, j) => n + j.delta, 0);
      const bad = js.filter((j) => j.delta < 0).reduce((n, j) => n - j.delta, 0);
      const score = js.length ? clamp(Math.round(60 + good * 6 - bad * 9), 5, 100) : null;
      return { id, label, score, good: js.filter((j) => j.delta > 0).length, bad: js.filter((j) => j.delta < 0).length };
    });
    const scored = dom.filter((d) => d.score !== null);
    const overall = scored.length ? Math.round(scored.reduce((n, d) => n + d.score, 0) / scored.length) : 0;
    const outcomes = c.patients.map((d) => {
      const P = s.p[d.id], o = Object.assign({ id: d.id }, d.outcome(s, P, A));
      // A patient nobody saw can't have a good outcome credited to the nurse.
      if (P.seenAt === null && (!d.arrives || P.arrived) && !P.icu && !P.gone && o.tone === 'good') return { id: d.id, tone: 'mixed', title: 'Never seen this shift', text: 'You never went into the room. Whatever happened with this patient happened without you.' };
      return o;
    });
    const harmed = outcomes.filter((o) => o.tone === 'bad').length;
    let rating = overall >= 85 ? 'Charge-nurse material' : overall >= 72 ? 'Safe, solid shift' : overall >= 58 ? 'Getting there' : 'Rough shift';
    if (harmed && overall >= 72) rating = 'Solid, with a miss that mattered';
    return { dom, overall, rating, outcomes, judg: s.judg.slice().sort((a, b) => a.t - b.t) };
  }

  /* Persistence — local for now; same shape could post to a backend later. */
  const KEY = 'theshift.save.v1', PROF = 'theshift.profile.v1';
  const store = {
    save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} },
    load() { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} },
    profile() {
      let p = null;
      try { p = JSON.parse(localStorage.getItem(PROF) || 'null'); } catch (e) {}
      return Object.assign({ runs: [], settings: { theme: 'system', text: 'normal', motion: 'full' } }, p || {});
    },
    saveProfile(p) { try { localStorage.setItem(PROF, JSON.stringify(p)); } catch (e) {} },
  };

  S.engine = { registerCase, useCase, getCase, newGame, abs: (t) => START + t, api, advance, perform, finish, debrief, clock, clamp, store, DOMAINS, cases };
})(window.Shift);
