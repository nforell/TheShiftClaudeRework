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
  ];

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
      bells: bells >= 3 && !bellMiss, float: cases.every((id) => allRuns.includes(id)), house: cases.every((id) => starsAfter[id] === 3),
    };
    BADGES.forEach((b) => { if (test[b.id] && !have[b.id]) earned.push(b.id); });
    return { goals: g, stars: st, prevStars, lines, total, before, after, lvBefore: level(before), lvAfter: level(after), earned, starsAfter };
  }

  S.reward = { level, mult, round5, stars, STARS, goals, BADGES, settle, LEVELS };
})(window.Shift);
