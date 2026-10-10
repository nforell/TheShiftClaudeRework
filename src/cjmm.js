/* The Shift — NCSBN Clinical Judgment Measurement Model (CJMM).
   Every scored decision is filed under one of the six steps the Next Generation NCLEX tests, so the debrief can
   show students and educators where judgment broke down, not just which skill area.
   Steps are assigned by rules on each decision's key, domain and wording. A decision can be pinned to a step
   with OVERRIDE (key → step id); docs/cjmm-map.csv lists every decision and its step for clinical review. */
(function (S) {
  const STEPS = [
    ['cues', 'Recognize cues', 'Notice what matters in the data: assessments, vitals, labs, what the patient says.'],
    ['analyze', 'Analyze cues', 'Connect the cues to what could be going on.'],
    ['hypo', 'Prioritize hypotheses', 'Rank what is most urgent and most likely.'],
    ['solve', 'Generate solutions', 'Decide what should and shouldn\'t be done: hold, clarify, plan, choose who does it.'],
    ['act', 'Take action', 'Do it: give, treat, protect, escalate, teach.'],
    ['eval', 'Evaluate outcomes', 'Check whether it worked, and follow through.'],
  ];
  const OVERRIDE = {
    // 'key': 'step',   e.g. '305-ortho': 'cues'
    '401-recheck': 'eval', '407-checkback': 'eval', '403-plan': 'eval', '405-reassess': 'eval', '409-results': 'eval',
    '401-labs': 'cues', '409-admit': 'cues', '403-skin': 'cues',
    '303-postim': 'eval', '303-postim-none': 'eval', '303-debrief': 'eval', '303-checks': 'eval', '303-obs': 'solve', '303-obs-miss': 'solve', '405-docrev': 'cues', '405-docrev-miss': 'cues',
    // ICU (3 West): decide what should and shouldn't be done; name the problem; check whether it worked.
    '711-central-early': 'solve', '711-meto': 'solve', '711-lisin': 'solve', '711-vaso': 'solve', '711-npo': 'solve', '711-ir-delay': 'solve',
    '712-sbt': 'solve', '712-restrain': 'solve', '712-oversed': 'solve', '712-noorder': 'solve', '713-meto': 'solve', '713-lasix': 'solve', '714-meetprep': 'solve', '714-donate': 'solve',
    '711-blanket': 'analyze', '713-alb': 'analyze', '713-sbar-early': 'analyze',
    '712-silence': 'hypo', '712-sedate-alarm': 'hypo', '713-sbar': 'hypo', '713-norep': 'hypo',
    '711-sbar-lac': 'eval', '711-lac-norep': 'eval', '712-release': 'eval', '712-still-restrained': 'eval', '714-sbar-comfort': 'eval', '714-son-unanswered': 'eval',
  };
  const EVAL = /\b(re-?check|re-?assess|re-?scor|re-?scan|re-?evaluat|did it work|follow(?:ed)?[ -]?up|after treating|after (?:the |her |his )?(?:dose|insulin|treatment|transfusion|bolus|naloxone|juice)|repeat (?:level|glucose|potassium|labs?|vitals|score|sodium|lithium|CIWA)|trend|through the first|still on .* at handoff|watched .* through|kept checking|came back to|post-?(?:transfusion|dose)|response to|whether .* worked)/i;
  const CUES = /^(?:You )?(?:checked|assessed|looked|listened|noticed|caught|scanned|counted|weighed|examined|took (?:a |her |his |their )?(?:full )?(?:set of )?vitals|asked .* about|spotted|saw|read|reviewed|verified|confirmed|measured|palpated|auscultated|did (?:a |the )?(?:neuro|skin|full)|got (?:a |the )?(?:full|current|fresh))\b|without (?:a |any )?current|without (?:checking|scanning|assessing|looking|a (?:pain|sedation|neuro|heart rate|glucose|blood pressure))|without (?:a |any )?baseline|learned .*(?:baseline|history)|went unrecognized|went unnoticed|nobody noticed|missed (?:the |her |his )?(?:cue|sign|change|finding)|never assessed|unseen\b/i;
  const ANALYZE = /\b(connected|linked|recognized|put together|tied|pushed back on|saw through|treat(?:ed)? .* instead of (?:its |the )?cause|label|bias|explained the|pattern|dressed up|not (?:just|a) |medicate .* calm|thought it was|mistook|as (?:a |an )?(?:stomach bug|anxiety|behavior))\b/i;
  const HYPO = /\b(first|ahead of|before (?:the |anyone|other)|priority|prioritiz|rank|most urgent|who needs you)\b/i;
  const SOLVE = /\b(held|hold|clarif|questioned the order|asked for (?:a |an )?(?:order|new order|change)|refused to|declined to|didn'?t give|chose not|waited (?:for|until)|stopped .* (?:before|without)|restarted .* before|delegat|asked (?:the |your )?(?:CNA|aide|tech|sitter)|put .* on 1:1 with|kept .* (?:NPO|supine|upright)|plan)\b/i;
  function step(j) {
    if (!j) return 'act';
    const k = j.key || '', t = j.text || '';
    if (OVERRIDE[k]) return OVERRIDE[k];
    if (/^rank-|-rank\b|^prio/.test(k) || j.domain === 'priority') return 'hypo';
    if (j.domain === 'deleg') return 'solve';
    if (/-(re(check|assess|scan|eval)|prn-?eval|eval|follow|fu|upd)\b|^prn-/.test(k) || EVAL.test(t)) return 'eval';
    if (CUES.test(t) || (j.domain === 'assess' && !/^You (gave|started|treated|called|told)/.test(t))) return 'cues';
    if (ANALYZE.test(t) || (j.domain === 'judgment' && /\b(sbar|bias|recog)\b/i.test(k))) return 'analyze';
    if (HYPO.test(t) && /\b(saw|see|chose|put .* first|ranked)\b/i.test(t)) return 'hypo';
    if (SOLVE.test(t) || /-hold\b|-clar/.test(k)) return 'solve';
    if (j.domain === 'judgment') return /^You (gave|started|treated|stopped|let|kept|sat|put|moved|called|asked)/.test(t) ? 'act' : 'analyze';
    return 'act';
  }
  /* Scored with the engine's tally, the same rule as the skill domains, so the two views always agree. */
  function score(judg) {
    return STEPS.map(([id, label, what]) => {
      const js = judg.filter((j) => step(j) === id), T = S.engine.tally(js);
      return { id, label, what, score: T.score, good: T.good, bad: T.bad, js };
    });
  }
  /* What each step looks like on the exam, how to reason through it, and the traps, for the debrief and the
     focus-practice section. Kept short enough to read on a phone. */
  const GUIDE = {
    cues: { exam: 'Items hand you a chart, a note or a set of findings and ask which ones matter: highlight, select-all and matrix items. The skill is separating relevant from irrelevant, and abnormal or changed from expected.',
      ask: ['What is abnormal for this client, not just for the textbook?', 'What has changed since the last assessment, or since their baseline?', 'What is missing that I would expect to see: a vital sign, a lab, an assessment nobody did?', 'What did the client or family say that does not fit?'],
      traps: ['Treating a chronic baseline finding as new, like a barrel chest in COPD.', 'A normal-looking number that hides a trend, like a blood pressure that fell 30 points.', 'Not looking: skipping the assessment the situation calls for.'] },
    analyze: { exam: 'Items ask what the findings are consistent with: matrix items sort findings by condition, and drop-downs link a cue to its cause.',
      ask: ['Which findings cluster together?', 'What pathophysiology explains them?', 'What else could explain this, and which explanation fits all of the cues?', 'Is this expected for the condition and its treatment, or a complication?'],
      traps: ['Blaming a psych diagnosis, dementia or anxiety for a physical change.', 'Anchoring on the first explanation, like report\'s "stomach bug".', 'Treating a symptom without asking what is causing it.'] },
    hypo: { exam: 'Bowtie and drop-down items ask for the most likely and most urgent condition; other items ask which client to see first. Rank by threat to life, then by likelihood.',
      ask: ['Which problem hurts the client fastest if I am wrong? Airway, breathing, circulation, then neuro.', 'Is this client unstable, or at risk of becoming unstable, or stable and predictable?', 'Acute and new before chronic and known; actual before potential.', 'What is time-critical: a treatment window, a dose, a drip?'],
      traps: ['The loudest or most demanding client is not always the sickest.', 'Quiet deterioration: the confused, sleepy or "fine" client ranked last.', 'A scheduled task put ahead of an unstable client.'] },
    solve: { exam: 'Matrix items ask what to give or hold, what is indicated or contraindicated, and who should do it. Select-all items ask what belongs in the plan.',
      ask: ['What outcome am I aiming for, and what gets there?', 'Does every order still fit this client right now: hold parameters, allergies, new labs?', 'What should not be done, and why?', 'Who is the right person? Assessment, teaching, evaluation and unstable clients stay with the RN.'],
      traps: ['Giving a medication because it is due, without checking its hold parameter.', 'Delegating an assessment or an unstable client.', 'Choosing a more restrictive option when a less restrictive one is safe.'] },
    act: { exam: 'Select-all and matrix items ask which actions to take now and how: the right drug, dose and route, the right escalation, the right words.',
      ask: ['What is the first thing that makes the client safer?', 'Is it within my scope, or does it need an order or a provider at the bedside?', 'Am I doing it correctly: dose, route, timing, technique?', 'Who needs to know, and am I giving it to them in SBAR?'],
      traps: ['The right drug by the wrong route or at the wrong dose.', 'Reassessing again when the situation calls for acting.', 'Acting alone where the provider must decide, or waiting for an order when a protocol lets you act.'] },
    eval: { exam: 'Matrix and highlight items show findings after an intervention and ask whether they mean improved, no change or declined, or which ones show it worked.',
      ask: ['What did I expect this intervention to change, and by when?', 'Compared with the client\'s own baseline, not only with normal ranges, where are they now?', 'Did anything get worse while other things improved?', 'If it did not work, what next: repeat, escalate, or rethink the problem?'],
      traps: ['Calling it a success because one number improved.', 'Forgetting the recheck: the PRN effect, post-transfusion vitals, the repeat lab.', 'Mistaking an adverse effect for the intended effect.'] },
  };
  S.cjmm = { STEPS, OVERRIDE, GUIDE, step, score };
})(window.Shift = window.Shift || {});
