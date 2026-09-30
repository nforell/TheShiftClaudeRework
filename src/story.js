/* The Shift — stories. Every patient is a person before they're a diagnosis. Each has a short arc that opens up
   over the shift as you spend time with them: a few beats, each unlocked by trust.

   How it plays:
   - Talking to a patient shows their clinical conversation first. After that, when they're stable enough to chat,
     talking moves their story forward instead. Sick patients don't make small talk.
   - Trust (0–5) rises with therapeutic choices, answering their call light yourself, and plain presence. It falls
     with dismissive answers. Each beat needs a little more trust than the last; below it, they stay guarded.
   - Some beats hold something clinically important that they'd only tell a nurse they trust.
   - The debrief tells you what became of them, shaped by how well you knew them.

   Arcs live in src/stories/*.js and register with S.story.add(caseId, { pid: arc }). An arc:
     { who?, gate?(s,P,A), idle?: [clinical dialog ids that story may replace right away], gap?: minutes,
       beats: [{ need, who?, learn, text, choices: [{ label, reply, rap, judge?: [domain, delta, text, why], set? }] }],
       guarded: ['line', ...], presence: 'reply when you just sit with them',
       epi: { close, warm, distant, hard, mixed? } }                                                                     */
(function (S) {
  const ARCS = {};
  const MAXR = 5;
  function add(caseId, arcs) { ARCS[caseId] = Object.assign(ARCS[caseId] || {}, arcs); }
  const arcOf = (c, pid) => (ARCS[c.id] || {})[pid];
  const has = (c) => !!ARCS[c.id];
  function st(P) { if (!P.story) P.story = { n: 0, at: -999, heard: [], rap: 0, sat: -999, g: 0 }; return P.story; }
  const clampR = (x) => Math.max(0, Math.min(MAXR, x));
  const trust = (P) => clampR(Math.round(st(P).rap));
  function bump(P, d) { const S0 = st(P); S0.rap = clampR(S0.rap + d); }
  const TRUST = ['A stranger', 'Getting to know you', 'Opening up', 'Trusts you', 'Close', 'Close'];

  /* Put every beat into the case's dialog table so the existing dialog sheet can show it. */
  function install(c) {
    const arcs = ARCS[c.id]; if (!arcs) return;
    Object.keys(arcs).forEach((pid) => {
      const arc = arcs[pid], base = arc.who || pid;
      arc.beats.forEach((b, i) => {
        const id = `st:${pid}:${i}`, who = b.who || base;
        c.dialogs[id] = { who, pid, story: { pid, i }, text: b.text, choices: b.choices.map((ch, k) => ({ label: ch.label, next: `${id}:r${k}`, fx: (s, A) => choose(s, A, c, pid, i, k) })) };
        b.choices.forEach((ch, k) => { c.dialogs[`${id}:r${k}`] = { who, pid, story: { pid, i, reply: k }, text: ch.reply }; });
      });
      (arc.guarded || ['"I\'m alright. Just tired."']).forEach((g, j) => {
        c.dialogs[`st:${pid}:g${j}`] = { who: base, pid, story: { pid, guarded: true }, text: g, choices: [
          { label: 'Pull up a chair and stay a few minutes. No questions, no agenda.', next: `st:${pid}:sat`, fx: (s) => { const P = s.p[pid], S0 = st(P); S0.sat = s.t; bump(P, 1); s.storyFresh = { pid, d: 1, why: 'presence' }; } },
          { label: 'Let them rest.', next: null, fx: () => {} },
        ] };
      });
      c.dialogs[`st:${pid}:sat`] = { who: base, pid, story: { pid, sat: true }, text: arc.presence || 'You sit. Neither of you says much. After a while the silence feels less like a wall.' };
    });
  }
  function choose(s, A, c, pid, i, k) {
    const P = s.p[pid], S0 = st(P), b = arcOf(c, pid).beats[i], ch = b.choices[k];
    bump(P, ch.rap || 0); S0.n = i + 1; S0.at = s.t; if (!S0.heard.includes(i)) S0.heard.push(i);
    if (ch.judge) A.judge(`st-${pid}-${i}`, ch.judge[0], ch.judge[1], ch.judge[2], ch.judge[3], pid);
    if (ch.set) Object.assign(P, ch.set);
    s.storyFresh = { pid, d: ch.rap || 0 };
  }

  /* What talking to this patient should open right now: a story beat, a guarded line, or nothing (clinical). */
  function next(s, c, d, P, A) {
    const arc = arcOf(c, d.id); if (!arc) return null;
    const S0 = st(P);
    if (S0.n >= arc.beats.length) return null;
    const stt = d.status(s, P, A);
    if ((arc.watch ? stt === 'urgent' : stt !== 'stable') || P.icu || P.gone) return null;   // parent arcs (watch) can talk while the child is being watched
    if (arc.gate && !arc.gate(s, P, A)) return null;
    if (S0.n > 0 && s.t - S0.at < (arc.gap || 18)) return null;
    const b = arc.beats[S0.n];
    if (b.when && !b.when(s, P, A)) return null;
    if ((b.need || 0) > trust(P)) return s.t - S0.sat < 25 ? null : { guarded: true };
    return { i: S0.n };
  }
  function pick(s, c, d, P, A, clinicalId) {
    const arc = arcOf(c, d.id); if (!arc) return null;
    s.seenDlg = s.seenDlg || {};
    // The clinical conversation always wins while it still has something to decide. The story takes over from
    // idle lines right away, from listed conversations once they've been had, and from any line without choices once seen.
    if (clinicalId && !(arc.idle || []).includes(clinicalId)) {
      const node = c.dialogs[clinicalId], seen = !!s.seenDlg[clinicalId];
      if (!seen || !((arc.after || []).includes(clinicalId) || !(node && node.choices))) return null;
    }
    const nx = next(s, c, d, P, A); if (!nx) return null;
    if (nx.guarded) { const g = (arc.guarded || ['']).length; const S0 = st(P); S0.g = (S0.g + 1) % g; return `st:${d.id}:g${S0.g}`; }
    return `st:${d.id}:${nx.i}`;
  }
  const waiting = (s, c, d, P, A) => { const nx = next(s, c, d, P, A); return !!(nx && !nx.guarded); };

  /* Trust shifts from the rest of the shift, too: every judged conversation with them or their family, and
     coming yourself when they ring. */
  function fromDialog(s, pid, judged) { const P = s.p[pid]; if (!P) return 0; const d = judged.reduce((n, j) => n + Math.sign(j.delta), 0); if (d) bump(P, Math.max(-1, Math.min(1, d))); return d; }
  function fromBell(s, pid) { const P = s.p[pid]; if (P) bump(P, 0.5); }

  /* The debrief: what became of them, and what you learned about them. */
  function epilogue(s, c, d, P, tone) {
    const arc = arcOf(c, d.id); if (!arc || !arc.epi) return null;
    const S0 = st(P), t = trust(P), e = arc.epi;
    // A mixed outcome can have its own set; any entry can be a function of the patient, so the story never
    // contradicts what happened clinically.
    const m = tone === 'mixed' && e.mixed ? (typeof e.mixed === 'object' ? e.mixed : { close: e.mixed, warm: e.mixed, distant: e.mixed }) : {};
    const pickE = (k) => (m[k] !== undefined ? m[k] : e[k]);
    const raw = tone === 'bad' && e.hard ? e.hard : t >= 3 ? pickE('close') : t >= 1 ? pickE('warm') : pickE('distant');
    const text = typeof raw === 'function' ? raw(s, P, tone) : raw;
    const learned = S0.heard.map((i) => arc.beats[i].learn).filter(Boolean);
    return { text, trust: t, label: TRUST[t], learned, total: arc.beats.length, heard: S0.heard.length };
  }
  function stats(s, c) {
    const arcs = ARCS[c.id] || {}; let beats = 0, close = 0, n = 0;
    Object.keys(arcs).forEach((pid) => { const P = s.p[pid]; if (!P) return; const d = c.patients.find((x) => x.id === pid); if (d && d.arrives && !P.arrived) return; n += 1; beats += st(P).heard.length; if (trust(P) >= 3) close += 1; });
    return { beats, close, n };
  }

  S.story = { add, install, pick, waiting, fromDialog, fromBell, epilogue, stats, trust, has, TRUST, MAXR, _arcs: ARCS };
})(window.Shift);
