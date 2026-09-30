/* The Shift — rewards. What a good shift earns: care XP as you work, a streak that multiplies it, shift goals,
   stars, a career ladder across shifts, and badges. Pure logic; the UI draws it. */
(function (S) {
  const LEVELS = [
    [0, 'Student nurse'], [2500, 'Orientee'], [6000, 'New grad RN'], [11000, 'Staff RN'], [17500, 'Experienced RN'],
    [26000, 'Preceptor'], [36000, 'Resource nurse'], [50000, 'Charge nurse'], [70000, 'Unit legend'],
  ];
  function level(xp) {
    let i = 0; LEVELS.forEach((l, k) => { if (xp >= l[0]) i = k; });
    const lo = LEVELS[i][0], hi = LEVELS[i + 1] ? LEVELS[i + 1][0] : null;
    return { n: i + 1, title: LEVELS[i][1], lo, hi, next: LEVELS[i + 1] ? LEVELS[i + 1][1] : null, pct: hi ? (xp - lo) / (hi - lo) : 1 };
  }
  const mult = (streak) => (streak >= 12 ? 3 : streak >= 8 ? 2.5 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1);
  const round5 = (x) => Math.max(5, Math.round(x / 5) * 5);
  const STARS = [58, 72, 85];
  const stars = (score) => STARS.filter((x) => score >= x).length;

  /* Shift goals: the same four every shift, so they become habits. */
  function goals(s, c, A, ctx) {
    const here = (d) => !d.arrives || s.p[d.id].arrived, out = (P) => P.icu || P.gone, len = c.length;
    const quit = s.ended && s.t < len - 30;   // leaving early doesn't earn the goals you walked away from
    const init = c.patients.filter((d) => !d.arrives);
    // 1. Eyes on everyone early.
    const seeBy = 90, need = init.filter((d) => !(out(s.p[d.id]) && s.p[d.id].firstSeen === undefined));
    const seen = need.filter((d) => s.p[d.id].firstSeen !== undefined && s.p[d.id].firstSeen <= seeBy).length;
    const eyes = seen === need.length ? 'done' : s.t > seeBy ? 'fail' : 'open';
    // 2. No scheduled dose more than an hour late.
    let late = 0, tot = 0;
    c.patients.forEach((d) => { if (!here(d)) return; const P = s.p[d.id]; (d.meds || []).forEach((m) => {
      if (m.prn || m.due === undefined || m.later || m.initStatus === 'given' || m.initStatus === 'verify' || (m.available && !m.available(s, P))) return;   // a pharmacy hold isn't the nurse's delay
      const st = s.meds[m.id]; tot += 1;
      if ((st.status === 'given' || st.status === 'held') && st.at > m.due + 60) late += 1;
      else if (st.status === 'due' && s.t > m.due + 60 && !out(P)) late += 1;
    }); });
    const medsDone = !late && (s.ended || c.patients.every((d) => !here(d) || (d.meds || []).every((m) => m.prn || m.due === undefined || m.later || m.initStatus === 'given' || s.meds[m.id].status !== 'due' || out(s.p[d.id]))));
    const meds = late || quit ? 'fail' : medsDone ? 'done' : 'open';
    // 3. Nobody left waiting: call lights and floor calls.
    const bellMiss = s.judg.filter((j) => /-bell-/.test(j.key || '') && j.delta < 0).length;
    const fl = S.floor ? S.floor.stats(s) : { missed: 0, answered: 0 };
    const rang = c.patients.reduce((n, d) => n + (s.p[d.id].lastBell !== undefined ? 1 : 0), 0);
    const calls = bellMiss || fl.missed || quit ? 'fail' : s.ended ? 'done' : 'open';
    // 4. Report on everyone.
    const onUnit = c.patients.filter((d) => here(d) && !out(s.p[d.id])), rep = onUnit.filter((d) => s.report && s.report[d.id]).length;
    const report = onUnit.length && rep === onUnit.length ? 'done' : s.ended ? 'fail' : 'open';
    return [
      { id: 'eyes', label: 'Eyes on everyone', sub: `Every patient seen by ${A.clock(seeBy)}`, st: eyes, n: seen, of: need.length },
      { id: 'meds', label: 'On the clock', sub: 'No scheduled dose over an hour late', st: meds, n: late, of: tot, bad: true },
      { id: 'calls', label: 'Nobody waits', sub: 'Every call light and floor call answered', st: calls, n: bellMiss + fl.missed, of: rang + fl.answered + fl.missed, bad: true },
      { id: 'report', label: 'Clean handoff', sub: `Report on every patient by ${A.clock(len)}`, st: report, n: rep, of: onUnit.length },
    ];
  }

  const BADGES = [
    { id: 'first', label: 'First shift', how: 'Finish any shift', g: 'badge' },
    { id: 'three', label: 'Three stars', how: 'Earn three stars on a shift', g: 'star' },
    { id: 'goals', label: 'Clean sweep', how: 'Meet all four shift goals', g: 'check' },
    { id: 'zone', label: 'In the zone', how: 'Build a 12-action streak', g: 'flame' },
    { id: 'sharp', label: 'Sharp eye', how: 'Get every floor call right (at least 4)', g: 'eye' },
    { id: 'catch', label: 'Good catch', how: 'Your sickest patient ends the shift with a good outcome', g: 'heart' },
    { id: 'solo', label: 'Solo', how: 'Score 72 or better without asking Nova', g: 'solo' },
    { id: 'bells', label: 'Nobody waited', how: 'Answer every call light on a shift (at least 3)', g: 'bell' },
    { id: 'float', label: 'Float nurse', how: 'Finish a shift on all five units', g: 'map' },
    { id: 'house', label: 'Full house', how: 'Three stars on all five shifts', g: 'crown' },
    { id: 'allgood', label: 'Everyone home safe', how: 'Finish a shift with a good outcome for every patient', g: 'home' },
    { id: 'clean', label: 'Clean record', how: 'Finish a shift with no calls to rethink', g: 'shield' },
    { id: 'comeback', label: 'Comeback', how: 'Beat your last score on a shift by 15 points or more', g: 'up' },
    { id: 'second', label: 'Second chance', how: 'Replay a shift and turn a patient\'s poor outcome into a good one', g: 'redo' },
    { id: 'reflect', label: 'Reflective practice', how: 'Review "What to rethink" in three debriefs', g: 'book' },
    { id: 'bedside', label: 'Bedside manner', how: 'End a shift close with every patient (at least 4)', g: 'chat' },
  ];

  /* Tracks: lifetime progress with bronze, silver and gold tiers. */
  const DOMS = (S.engine && S.engine.DOMAINS) || [];
  const TRACKS = DOMS.map(([id, label]) => ({ id: 'dom-' + id, dom: id, label, how: `Good calls in ${label.toLowerCase()}`, tiers: [5, 20, 50], val: (p) => (p.life && p.life.good && p.life.good[id]) || 0 })).concat([
    { id: 'lessons', label: 'Lessons learned', how: 'Mistakes fixed on a later shift', tiers: [1, 10, 30], val: (p) => Object.values(p.lessons || {}).filter((l) => l.fixed).length },
    { id: 'floor', label: 'Floor-call collection', how: 'Floor calls answered with the best choice', tiers: [5, 15, (S.floor ? S.floor.POOL.length : 28)], val: (p) => Object.values(p.floorSeen || {}).filter((v) => v === 'best').length },
    { id: 'shifts', label: 'Shifts worked', how: 'Shifts finished through handoff', tiers: [1, 10, 25], val: (p) => (p.life && p.life.shifts) || 0 },
    { id: 'stories', label: 'Their stories', how: 'Moments you shared with patients and families', tiers: [10, 40, 90], val: (p) => (p.life && p.life.beats) || 0 },
    { id: 'stars', label: 'Stars', how: 'Best stars, added across all five shifts', tiers: [5, 10, 15], val: (p) => Object.values(p.stars || {}).reduce((n, x) => n + x, 0) },
  ]);
  const TIER = ['Not started', 'Bronze', 'Silver', 'Gold'];
  const tierOf = (tr, v) => tr.tiers.filter((x) => v >= x).length;
  const tiers = (p) => Object.fromEntries(TRACKS.map((tr) => [tr.id, tierOf(tr, tr.val(p))]));
  // A mistake is the same mistake next time even if it happened at a different minute.
  const norm = (k) => String(k || '').replace(/-\d+$/, '');
  const lessonKey = (caseId, k) => (/^floor-/.test(k) ? 'floor|' + norm(k).slice(6) : caseId + '|' + norm(k));

  /* After a shift: lifetime tallies, the lesson log, the floor-call collection, tier changes, and the badges that need history. */
  function record(prof, s, c, d) {
    const done = s.t >= c.length - 30, out = { fixed: [], added: [], again: [], ups: [], badges: [] };
    prof.life = prof.life || { good: {}, shifts: 0 }; prof.life.good = prof.life.good || {};
    prof.lessons = prof.lessons || {}; prof.floorSeen = prof.floorSeen || {}; prof.badOut = prof.badOut || {}; prof.badges = prof.badges || {};
    const t0 = tiers(prof);
    s.judg.forEach((j) => { if (j.delta > 0) prof.life.good[j.domain] = (prof.life.good[j.domain] || 0) + 1; });
    if (done) prof.life.shifts = (prof.life.shifts || 0) + 1;
    if (S.story) prof.life.beats = (prof.life.beats || 0) + S.story.stats(s, c).beats;
    const rank = { wrong: 0, ok: 1, best: 2 };
    (s.floor ? s.floor.q : []).forEach((x) => { if (x.done !== 'answered') return; const now = x.v === 2 ? 'best' : x.v === 1 ? 'ok' : 'wrong', was = prof.floorSeen[x.id]; if (was === undefined || rank[now] > rank[was]) prof.floorSeen[x.id] = now; });
    // Lessons: every mistake from a finished shift goes in the log; it's fixed when you replay and don't repeat it.
    const neg = {}, pos = new Set();
    s.judg.forEach((j) => { if (!j.key) return; const k = lessonKey(s.caseId, j.key); if (j.delta < 0) neg[k] = j; else if (j.delta > 0) pos.add(k); });
    Object.keys(prof.lessons).forEach((k) => {
      const L = prof.lessons[k]; if (L.fixed || neg[k]) return;
      const fl = /^floor\|/.test(k);
      if (fl ? pos.has(k) : done && L.caseId === s.caseId) { L.fixed = Date.now(); out.fixed.push(k); }
    });
    if (done || Object.keys(neg).some((k) => /^floor\|/.test(k))) Object.keys(neg).forEach((k) => {
      if (!done && !/^floor\|/.test(k)) return;
      const j = neg[k], L = prof.lessons[k];
      if (L) { L.times += 1; L.last = Date.now(); if (L.fixed) { L.fixed = null; out.again.push(k); } }
      else { prof.lessons[k] = { caseId: /^floor\|/.test(k) ? null : s.caseId, text: j.text, why: j.why, dom: j.domain, pid: j.pid || null, first: Date.now(), last: Date.now(), times: 1, fixed: null }; out.added.push(k); }
    });
    // Keep saved data bounded: at most 300 lessons, dropping the oldest fixed ones first.
    const keys = Object.keys(prof.lessons);
    if (keys.length > 300) keys.sort((a, b) => (!!prof.lessons[b].fixed - !!prof.lessons[a].fixed) || (prof.lessons[a].last || 0) - (prof.lessons[b].last || 0)).slice(0, keys.length - 300).forEach((k) => { delete prof.lessons[k]; });
    // Badges that need history.
    const prev = (prof.runs || []).find((r) => r.caseId === s.caseId);
    const was = prof.badOut[s.caseId] || [];
    const test = {
      allgood: done && d.outcomes.every((o) => o.tone === 'good'),
      clean: done && !s.judg.some((j) => j.delta < 0),
      comeback: !!(prev && d.overall - prev.score >= 15),
      second: done && was.some((pid) => (d.outcomes.find((o) => o.id === pid) || {}).tone === 'good'),
    };
    Object.keys(test).forEach((id) => { if (test[id] && !prof.badges[id]) { prof.badges[id] = Date.now(); out.badges.push(id); } });
    if (done) prof.badOut[s.caseId] = d.outcomes.filter((o) => o.tone === 'bad').map((o) => o.id);
    const t1 = tiers(prof);
    TRACKS.forEach((tr) => { if (t1[tr.id] > t0[tr.id]) out.ups.push({ id: tr.id, tier: t1[tr.id] }); });
    out.xp = out.fixed.length * 60 + out.ups.reduce((n, u) => n + u.tier * 100, 0);
    return out;
  }

  /* End of shift: everything the shift earned, and what changes on the profile. */
  function settle(s, c, A, d, prof, cases) {
    const g = goals(s, c, A), st = stars(d.overall), fl = S.floor ? S.floor.stats(s) : { best: 0, answered: 0, total: 0 };
    const firstClear = !prof.runs.some((r) => r.caseId === s.caseId);   // called before this run is recorded
    const prevStars = (prof.stars || {})[s.caseId] || 0;
    const lines = [{ k: 'Care XP', v: s.xp }];
    const gd = g.filter((x) => x.st === 'done').length; if (gd) lines.push({ k: `Shift goals, ${gd} of 4`, v: gd * 150 });
    if (st) lines.push({ k: `${st} star${st === 1 ? '' : 's'}`, v: [0, 100, 250, 500][st] });
    if (s.bestStreak >= 5) lines.push({ k: `Best streak, ${s.bestStreak}`, v: s.bestStreak * 10 });
    if (firstClear) lines.push({ k: 'First time on this shift', v: 200 });
    const total = lines.reduce((n, l) => n + l.v, 0);
    const before = prof.xp || 0, after = before + total;
    // Badges
    const have = prof.badges || {}, earned = [];
    const bells = c.patients.reduce((n, x) => n + (s.p[x.id].lastBell !== undefined ? 1 : 0), 0), bellMiss = s.judg.some((j) => /-bell-/.test(j.key || '') && j.delta < 0);
    const top = c.priority && c.priority.correct ? c.priority.correct[0] : null, topOut = top ? d.outcomes.find((o) => o.id === top) : null;
    const allRuns = prof.runs.map((r) => r.caseId).concat(s.caseId), starsAfter = Object.assign({}, prof.stars || {}, { [s.caseId]: Math.max(prevStars, st) });
    const test = {
      first: true, three: st === 3, goals: gd === 4, zone: s.bestStreak >= 12, sharp: fl.total >= 4 && fl.best === fl.total,
      catch: !!(topOut && topOut.tone === 'good'), solo: d.overall >= 72 && s.nova === (c.novaCredits || 3),
      bells: bells >= 3 && !bellMiss, bedside: (() => { const x = S.story ? S.story.stats(s, c) : { n: 0, close: 0 }; return x.n >= 4 && x.close === x.n; })(), float: cases.every((id) => allRuns.includes(id)), house: cases.every((id) => starsAfter[id] === 3),
    };
    BADGES.forEach((b) => { if (test[b.id] && !have[b.id]) earned.push(b.id); });
    return { goals: g, stars: st, prevStars, lines, total, before, after, lvBefore: level(before), lvAfter: level(after), earned, starsAfter };
  }

  S.reward = { level, mult, round5, stars, STARS, goals, BADGES, settle, LEVELS, TRACKS, TIER, tierOf, tiers, record };
})(window.Shift);
