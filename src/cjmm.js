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
  /* Scored like the skill domains in the engine, so the two views agree. */
  function score(judg) {
    return STEPS.map(([id, label, what]) => {
      const js = judg.filter((j) => step(j) === id);
      const good = js.filter((j) => j.delta > 0).reduce((n, j) => n + j.delta, 0), bad = js.filter((j) => j.delta < 0).reduce((n, j) => n - j.delta, 0);
      return { id, label, what, score: js.length ? Math.max(5, Math.min(100, Math.round(60 + good * 6 - bad * 9))) : null, good: js.filter((j) => j.delta > 0).length, bad: js.filter((j) => j.delta < 0).length };
    });
  }
  S.cjmm = { STEPS, OVERRIDE, step, score };
})(window.Shift = window.Shift || {});
