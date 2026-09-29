/* Case: 4 West Med-Surg, night block (23:00–04:00). Intermediate: five patients, fewer hands.
   Themes: nobody calls to tell you something changed. Rounding, last-known-well, and hidden causes. */
(function (S) {
  const { clamp, clock } = S.engine;
  const jit = (s, seed) => ((Math.floor(s.t / 5) * 7 + seed * 13) % 3) - 1;
  const recent = (s, t0, m) => t0 !== null && t0 !== undefined && s.t - t0 <= m;
  const decay = (s, list, mins) => list.reduce((n, r) => { const d = s.t - r.t; return d >= 0 && d < mins ? n + r.amt * (1 - d / mins) : n; }, 0);
  const J = (key, dom, d, text, why, pid) => (s, A) => A.judge(key, dom, d, text, why, pid);

  /* ---------- 431 Dorothy Pruitt: post-op hip, delirium from urinary retention ---------- */
  const dotVol = (s, P) => (P.cathAt === null ? 420 + 2.2 * s.t : 80 + 0.8 * (s.t - P.cathAt));
  const dotPain = (s, P) => clamp(Math.round(6 - decay(s, P.relief, 240)), 1, 10);
  function dotAg(s, P) {
    let a = clamp((dotVol(s, P) - 500) / 220, 0, 1.6) + (dotPain(s, P) >= 6 ? .35 : 0) + (recent(s, P.diphenAt, 300) ? .8 : 0) + (P.restrained ? .5 : 0) - (P.aids ? .25 : 0) - decay(s, P.calm, 45);
    return clamp(a, 0, 2.5);
  }
  const dot = {
    id: '431', room: '431', name: 'Dorothy Pruitt', short: 'Mrs. Pruitt', age: 84, sex: 'F', mrn: '00702214',
    look: { skin: '#6B4430', shade: '#50311F', lip: '#4E2A1F', blush: '#9C5642', iris: '#2A1A10', head: { w: 55, h: 58, jaw: .2 }, eye: 9.4,
      hair: { style: 'curlyshort', color: '#DAD6D0', big: true }, brow: { w: 3, color: '#BDB7AF' }, body: { w: 66, cloth: 'gown', cardigan: '#A58BB8' }, extras: ['wrinkles', 'gold'], smile: .4, guard: true,
      lines: { calm: 'Thank you, baby. I think I could sleep now.', confused: 'Where\'s the bathroom? I have to go. Why won\'t anybody let me go?', anxious: 'Where am I? Who are you people?', pain: 'Lord, my hip.', drowsy: 'Mm. Is it morning?', none: 'She doesn\'t answer.' } },
    bio: 'Retired church organist. Sharp, funny, eleven grandchildren. Lives alone; fell reaching for a hymnal on a high shelf.',
    dx: 'Post-op day 1, right hip repair', reason: 'Right intertrochanteric hip fracture, surgical repair',
    hx: ['Hypertension', 'Hard of hearing, wears hearing aids', 'Mild cataracts, reading glasses'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '58 kg',
    lines: ['PIV 20g left forearm, saline lock', 'Right hip dressing', 'Foley removed 17:00'], mobility: 'Up to chair with 2 assist and walker. High fall risk.', diet: 'Regular',
    init: { relief: [], calm: [], cathAt: null, scanAt: null, lastVol: null, diphenAt: null, oxyAt: null, apapAt: null, aids: false, fallPrec: false, restrained: false, fell: false, sitter: false },
    nightVitals: { T: 37.1, HR: 86, SBP: 146, DBP: 82, RR: 18, SpO2: 95, O2: 'Room air', pain: 5 },
    labs: [
      { name: 'Hemoglobin', val: 10.2, unit: 'g/dL', ref: '12–16 (11.8 pre-op)', flag: 'L', t: -420 },
      { name: 'Sodium', val: 137, unit: 'mmol/L', ref: '135–145', flag: '', t: -420 },
      { name: 'Creatinine', val: 0.9, unit: 'mg/dL', ref: '0.6–1.1', flag: '', t: -420 },
      { name: 'WBC', val: 9.8, unit: 'K/µL', ref: '4.5–11.0', flag: '', t: -420 },
    ],
    orders: [
      { t: -900, text: 'Foley out 17:00 POD 1. Bladder scan if no void in 6 h; straight cath for volume over 500 mL per bladder protocol.' },
      { t: -900, text: 'Acetaminophen 650 mg PO every 6 h scheduled. Oxycodone 2.5 mg PO every 4 h as needed for pain 4–10.' },
      { t: -900, text: 'Diphenhydramine 25 mg PO at bedtime as needed for sleep (admission order set).' },
      { t: -900, text: 'Enoxaparin 30 mg subQ every 12 h. Fall precautions. Weight bearing as tolerated.' },
    ],
    notes: [
      { t: -240, author: 'Jamal, evening RN', text: 'Alert, oriented × 4 at 19:00, joking with staff. Pain 5–6. Oxycodone 2.5 mg at 19:00. Foley out at 17:00, has not voided; says she doesn\'t need to. Aids and glasses in their case on the table.' },
    ],
    io: { intake: 'PO 900 mL, IV 400 mL', output: 'Foley 350 mL (until 17:00). Nothing since.' },
    report: [
      { text: 'Dorothy Pruitt, 84, day one after a right hip repair. She fell at home. Full code.', key: false },
      { text: 'She was sharp as a tack at 19:00. Told me all about her grandkids.', key: true },
      { text: 'Foley came out at 17:00. I don\'t think she\'s voided yet, but she said she didn\'t need to.', key: true },
      { text: 'Pain\'s been a 5 or 6. She got oxycodone 2.5 at 19:00.', key: true },
      { text: 'Hard of hearing. Her aids and glasses are in the case on the table.', key: true },
      { text: 'There\'s Benadryl ordered for sleep if she wants it.', key: false },
    ],
    vitals(s, P) { const a = dotAg(s, P); return { T: 37.1, HR: Math.round(84 + a * 10) + jit(s, 1), SBP: Math.round(144 + a * 8) + jit(s, 2) * 2, DBP: 82, RR: Math.round(18 + a * 2), SpO2: 95, O2: 'Room air', pain: dotPain(s, P) }; },
    assess: {
      general: (s, P) => { const a = dotAg(s, P); return a > 1 ? 'Pulling at her gown, trying to swing her legs over the rail. "I have to go. Let me go."' : a > .35 ? 'Restless, picking at the blanket, looking around the room like she doesn\'t know it.' : 'Resting, blanket to her chin. She smiles when you come in.'; },
      resp: () => 'Clear, slightly diminished at the bases. Even and unlabored.',
      cardiac: (s, P, A) => `HR ${A.vitals('431').HR}, regular. Right foot warm, pulses 2+, brisk cap refill.`,
      neuro: (s, P) => { P.k.neuro = s.t; return dotAg(s, P) > .35 ? `Oriented to self only. Inattentive: she loses the thread of your question. ${P.aids ? '' : 'Her hearing aids aren\'t in, so she can barely hear you. '}Jamal says she was fully oriented at 19:00. This is an acute change.` : 'Oriented to self, place and time. Follows well' + (P.aids ? ' with her aids in.' : ' if you speak into her left ear.'); },
      pain: (s, P) => `Right hip ${dotPain(s, P)}/10, deep and aching. She grimaces when she shifts.`,
      skin: () => 'Hip dressing dry and intact. Heels on a pillow, skin intact. Warm and dry.',
      gi: (s, P) => { P.k.gi = s.t; return P.cathAt === null ? 'Lower abdomen firm and rounded above the pubic bone; she winces when you press there. No void recorded since the Foley came out at 17:00.' : 'Abdomen soft now. Straight cath done at ' + clock(P.cathAt) + '.'; },
    },
    interventions: [
      { id: 'scan', label: 'Bladder scan', cost: 2, run(s, P, A) { const v = Math.round(dotVol(s, P)); P.scanAt = s.t; P.lastVol = v; if (v > 500) A.judge('431-scan', 'assess', 2, `You bladder-scanned Mrs. Pruitt and found ${v} mL.`, 'New agitation in an older adult is a symptom, not a diagnosis. Urinary retention is one of the most common and most fixable causes, especially after a Foley comes out.', '431'); return `Bladder scan: ${v} mL.` + (v > 500 ? ' The bladder protocol allows a straight cath over 500 mL.' : ''); } },
      {
        id: 'cath', label: 'Straight catheterize (bladder protocol)', cost: 8, avail: (s, P) => P.cathAt === null,
        run(s, P, A) {
          const v = Math.round(dotVol(s, P));
          if (!recent(s, P.scanAt, 90)) A.judge('431-cath-blind', 'assess', -1, 'You catheterized Mrs. Pruitt without scanning her bladder first.', 'The protocol runs on a number: scan, then cath if over 500 mL. Every catheter is an infection risk.', '431');
          else if (P.lastVol < 500) A.judge('431-cath-low', 'judgment', -1, 'You catheterized with a scanned volume under 500 mL.', 'Below the protocol threshold, the catheter adds infection risk without solving the problem.', '431');
          else A.judge('431-cath', 'judgment', 2, 'You relieved Mrs. Pruitt\'s urinary retention.', 'Treating the cause beats sedating the symptom. After emptying, she settles within half an hour. Check for a void in 6 hours.', '431');
          P.cathAt = s.t;
          return `Sterile technique. ${v} mL of clear yellow urine. Her whole face relaxes. "Oh. Oh, thank you, baby."`;
        },
      },
      { id: 'aids', label: 'Put in her hearing aids and glasses', cost: 2, avail: (s, P) => !P.aids, run(s, P, A) { P.aids = true; A.judge('431-aids', 'safety', 1, 'You put in Mrs. Pruitt\'s hearing aids and glasses.', 'Sensory aids are one of the simplest delirium measures: she can see and hear where she is.', '431'); return 'Glasses on, aids in. She blinks at you. "Well, there you are."'; } },
      { id: 'reorient', label: 'Reorient her, dim the lights, stay a few minutes', cost: 5, run(s, P) { P.calm.push({ t: s.t, amt: .6 }); return dotAg(s, P) > 1 ? 'She settles for a moment, then pushes at the rail again. "I have to GO."' : 'You tell her where she is and that her surgery went well. She holds your hand and closes her eyes.'; } },
      { id: 'fall', label: 'Fall precautions: low bed, bed alarm, non-skid socks', cost: 3, avail: (s, P) => !P.fallPrec, run(s, P, A) { P.fallPrec = true; A.judge('431-fall', 'safety', 1, 'You set up fall precautions for Mrs. Pruitt.', 'A delirious 84-year-old with a fresh hip repair: a fall tonight could mean another surgery, or worse.', '431'); return 'Bed low and locked, alarm armed, socks on, call light in her hand.'; } },
      { id: 'restrain', label: 'Apply soft wrist restraints', cost: 4, avail: (s, P) => !P.restrained, run(s, P, A) { P.restrained = true; A.judge('431-restrain', 'safety', -2, 'You restrained Mrs. Pruitt without an order or trying less restrictive measures.', 'Restraints need a provider order and a documented reason, and they come last, after less restrictive measures. They make delirium worse, and patients still fall in them.', '431'); return 'Soft restraints on both wrists. She fights them, crying out. Her agitation climbs.'; } },
      { id: 'unrestrain', label: 'Remove the restraints', cost: 1, avail: (s, P) => P.restrained, run(s, P) { P.restrained = false; return 'Restraints off. She rubs her wrists.'; } },
    ],
    comms: [
      { id: 'sitter', label: 'Ask Nova for a sitter or video monitor', cost: 2, avail: (s, P) => !P.sitter, run(s, P, A) { P.sitter = true; A.judge('431-sitter', 'safety', 1, 'You got Mrs. Pruitt a video monitor.', 'When a confused patient is a fall risk, closer observation is the least restrictive safety measure.', '431'); return 'Nova: "No sitters tonight. I can get you the video monitor." A camera on a cart is watching her from the desk ten minutes later.'; } },
    ],
    meds: [
      { id: '431-apap', name: 'Acetaminophen', dose: '650 mg', route: 'PO', freq: 'Every 6 h, scheduled', due: 60, checks: () => [{ label: 'Last dose', value: '18:00', ok: true }], give(s, P) { P.apapAt = s.t; P.relief.push({ t: s.t, amt: 1.5 }); return 'Acetaminophen 650 mg given with applesauce.'; } },
      {
        id: '431-oxy', name: 'Oxycodone', dose: '2.5 mg', route: 'PO', freq: 'Every 4 h as needed, pain 4–10', prn: true,
        block: (s, P) => (P.oxyAt !== null && s.t - P.oxyAt < 240 ? 'Given at ' + clock(P.oxyAt) + '.' : s.t < 20 ? 'Last dose 19:00. Next available at 23:00.' : null),
        checks: (s, P) => [{ label: 'Pain score', value: recent(s, P.k.painAt, 60) ? `${dotPain(s, P)}/10 at ${clock(P.k.painAt)}` : 'Not assessed in the last hour', ok: recent(s, P.k.painAt, 60) }, { label: 'Sedation', value: 'Awake', ok: true }],
        give(s, P, A) { P.oxyAt = s.t; P.relief.push({ t: s.t, amt: 3.5 }); if (!recent(s, P.k.painAt, 60)) A.judge('431-oxy-blind', 'meds', -1, 'You gave Mrs. Pruitt oxycodone without a current pain assessment.', 'Assess, then medicate. In a confused patient, use behavioral signs too: grimacing, guarding, moaning.', '431'); else A.judge('431-oxy', 'judgment', 1, 'You treated Mrs. Pruitt\'s hip pain.', 'Untreated pain drives delirium after hip fracture. A small opioid dose often clears confusion rather than causing it.', '431'); return 'Oxycodone 2.5 mg given.'; },
      },
      {
        id: '431-diph', name: 'Diphenhydramine', dose: '25 mg', route: 'PO', freq: 'At bedtime as needed, sleep', prn: true,
        block: (s, P) => (P.diphenAt !== null ? 'Given at ' + clock(P.diphenAt) + '.' : null),
        checks: () => [{ label: 'Age', value: '84: Beers list, avoid', ok: false }, { label: 'Effects', value: 'Anticholinergic: confusion, urinary retention', ok: false }],
        give(s, P, A) { P.diphenAt = s.t; A.judge('431-diph', 'meds', -3, 'You gave diphenhydramine to an 84-year-old with delirium.', 'Diphenhydramine is on the Beers list: it\'s anticholinergic, worsens confusion, and causes urinary retention, which was the problem to begin with. The order was active; it still wasn\'t safe.', '431'); return 'Diphenhydramine 25 mg given.'; },
      },
      { id: '431-enox', name: 'Enoxaparin', dose: '30 mg', route: 'SubQ', freq: 'Every 12 h', initStatus: 'given', givenNote: 'Given 21:00 by Jamal' },
    ],
    talk: (s, P) => (dotAg(s, P) > .35 ? 'dot_confused' : P.cathAt !== null ? 'dot_better' : 'dot_calm'),
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('431'), a = dotAg(s, P);
        return [
          { id: 'agit', label: 'New confusion and agitation, trying to climb out of bed', key: a > .35, need: a > .35 && (recent(s, P.k.neuro, 60) || recent(s, P.assessAt.general, 60)), lock: 'Assess her mental status' },
          { id: 'base', label: 'Fully oriented at 19:00 per evening RN', key: true, need: true },
          { id: 'bladder', label: P.lastVol !== null ? `Bladder scan ${P.lastVol} mL` : 'Bladder scan', key: (P.lastVol || 0) > 500, need: P.scanAt !== null, lock: 'Scan her bladder' },
          { id: 'novoid', label: 'No void since the Foley came out at 17:00', key: true, need: P.k.gi !== undefined, lock: 'Check her GI/GU' },
          { id: 'pain', label: `Hip pain ${dotPain(s, P)}/10`, key: dotPain(s, P) >= 6, need: recent(s, P.k.painAt, 90), lock: 'Assess her pain' },
          { id: 'vit', label: `T ${v.T.toFixed(1)}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}, SpO₂ ${v.SpO2}%`, key: false, need: true },
          { id: 'organ', label: 'Retired church organist', key: false, need: true },
        ];
      },
      requests: [
        { id: 'sleep', label: 'Can we get something to help her sleep?' },
        { id: 'eval', label: 'She\'s acutely confused. Can you help me find the cause?' },
        { id: 'restraint', label: 'Can I get a restraint order?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'sleep') { A.judge('431-sbar-sleep', 'judgment', -1, 'You asked to sedate Mrs. Pruitt\'s new confusion.', 'Sedation treats the provider\'s worry, not the patient. New delirium needs a cause: pain, bladder, bowels, oxygen, infection, medications.', '431'); return 'I\'d rather not sedate an 84-year-old. What\'s her bladder doing? Her pain?'; }
        if (req === 'restraint') { A.judge('431-sbar-restr', 'judgment', -1, 'You asked for restraints before looking for a cause.', 'Restraints are the last resort, after less restrictive measures and after you\'ve looked for why she\'s agitated.', '431'); return 'Not yet. What\'s driving it? Scan her bladder and treat her pain first.'; }
        if (picked.includes('bladder') && (P.lastVol || 0) > 500 && P.cathAt === null) { A.judge('431-sbar', 'comm', 2, 'You reported Mrs. Pruitt\'s delirium with the likely cause.', 'Baseline, acute change and a bladder scan over 500 mL: the provider can act on that picture in ten seconds.', '431'); return 'That\'s your answer. Straight cath per protocol and let\'s see if she settles. No Benadryl, please.'; }
        if (picked.includes('novoid')) return 'No void since 17:00? Scan her bladder and call me back.';
        return 'Try the non-drug measures, and look for a cause. Call me if she\'s unsafe.';
      },
    },
    scene: (s, P) => ({ iv: 'lock', fallPrec: P.fallPrec, walker: true, aids: !P.aids, tray: 'none', night: true }),
    clues: (s, P) => ({
      aids: 'Her glasses and hearing aids in their case on the table. Not in.',
      walker: 'A walker at the bedside. She\'s supposed to have two people with her to use it.',
      iv: 'Saline lock, left forearm.',
      alarm: P.fallPrec ? 'Bed low, alarm armed.' : 'Bed at working height, no alarm set.',
    }),
    rig: (s, P) => { const a = dotAg(s, P); return { confused: a > .35, anxious: clamp(a * .45, 0, .9) }; },
    status: (s, P) => (P.fell ? 'watch' : dotAg(s, P) > 1.2 && !P.fallPrec && !P.sitter ? 'urgent' : dotAg(s, P) > .35 ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.fell) return { tone: 'bad', title: 'Fell trying to reach the bathroom', text: 'Found on the floor beside her bed. X-rays pending on the new hip. The cause was a full bladder; the fix was a bladder scan.' };
      if (P.diphenAt !== null) return { tone: 'bad', title: 'Sedated and more confused', text: 'Benadryl on top of a full bladder: she\'s drowsy, still delirious, and retaining more.' };
      if (P.cathAt !== null && dotAg(s, P) < .5) return { tone: 'good', title: 'Settled once her bladder was emptied', text: `${P.lastVol ? P.lastVol + ' mL' : 'A full bladder'} was driving the delirium. She\'s asleep, oriented when she wakes, and asked for her glasses.` };
      if (dotAg(s, P) > .6) return { tone: 'mixed', title: 'Still delirious at handoff', text: 'Restless and disoriented all night with the cause never found. The day nurse inherits a fall waiting to happen.' };
      return { tone: 'mixed', title: 'Quiet, cause unclear', text: 'Calmer by morning, but her bladder was never checked.' };
    },
  };

  /* ---------- 433 Walter Brandt: refused prophylaxis, DVT, possible PE ---------- */
  function peSev(s, P) {
    if (P.pe === null) return 0;
    const rate = (P.rrt ? .25 : 1) * (P.hepAt !== null ? .4 : 1) * (P.o2 ? .7 : 1);
    return clamp(.4 + (s.t - P.pe) * rate / 30, 0, 1.6);
  }
  const walt = {
    id: '433', room: '433', name: 'Walter Brandt', short: 'Mr. Brandt', age: 63, sex: 'M', mrn: '00588130',
    look: { skin: '#E6C8AE', shade: '#C9A58A', lip: '#A2625B', blush: '#D9967F', iris: '#4B6A7E', head: { w: 55, h: 64, jaw: .45 }, eye: 9.4,
      hair: { style: 'short', color: '#9C958E' }, brow: { w: 4, color: '#7E776F' }, body: { w: 74, cloth: 'gown' }, extras: ['thinGlasses', 'wrinkles'], glasses: '#4A4A4A', smile: .3,
      lines: { calm: 'Seven letters for "stubborn." Starts with an O.', dys: 'Can\'t... breathe. Something\'s... wrong.', anxious: 'Something terrible is about to happen. I can feel it.', pain: 'My leg. The right one. It\'s killing me.', drowsy: 'Just resting.', none: 'He doesn\'t answer.' } },
    bio: 'Retired high school chemistry teacher. Does the crossword in pen. Widowed; his son is flying in Friday.',
    dx: 'Pancreatic cancer, pain control', reason: 'Metastatic pancreatic cancer, uncontrolled abdominal pain',
    hx: ['Pancreatic adenocarcinoma with liver metastases, on chemotherapy', 'Mostly in bed for two weeks', 'Hypertension'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '71 kg',
    lines: ['PIV 20g right forearm, saline lock'], mobility: 'Up as tolerated. Mostly stays in bed.', diet: 'Regular, poor appetite',
    init: { educated: false, reported: false, calfSeen: false, duplexAt: null, dvt: false, hepOrdered: false, hepAt: null, pe: null, o2: 0, hob: false, rrt: false, lorazAt: null, lorazInPe: false, icu: false, massaged: false },
    nightVitals: { T: 37.5, HR: 96, SBP: 126, DBP: 74, RR: 18, SpO2: 95, O2: 'Room air', pain: 3 },
    labs: [
      { name: 'Hemoglobin', val: 10.8, unit: 'g/dL', ref: '13.5–17.5', flag: 'L', t: -600 },
      { name: 'Platelets', val: 236, unit: 'K/µL', ref: '150–400', flag: '', t: -600 },
      { name: 'Creatinine', val: 0.9, unit: 'mg/dL', ref: '0.7–1.3', flag: '', t: -600 },
      { name: 'Albumin', val: 2.6, unit: 'g/dL', ref: '3.5–5.0', flag: 'L', t: -600 },
    ],
    orders: [
      { t: -5000, text: 'Enoxaparin 40 mg subQ daily at 21:00 (VTE prophylaxis, high risk).' },
      { t: -5000, text: 'Morphine 2 mg IV every 2 h as needed for severe pain. Lorazepam 0.5 mg IV every 6 h as needed for anxiety.' },
      { t: -5000, text: 'Ambulate three times daily as tolerated. SCDs when in bed.' },
    ],
    notes: [
      { t: -120, author: 'Jamal, evening RN', text: 'Refused enoxaparin at 21:00, third night in a row. Says the shots bruise him. Declined SCDs, says they\'re hot. Complains of right calf ache "from lying around." HR 90s.' },
    ],
    io: { intake: 'PO 500 mL', output: 'Voiding' },
    report: [
      { text: 'Walter Brandt, 63, pancreatic cancer with liver mets, in for pain control. Full code.', key: false },
      { text: 'He refused his enoxaparin again at 21:00. That\'s three nights. Says the shots bruise him.', key: true },
      { text: 'He mostly stays in bed. Says his right leg aches from lying there.', key: true },
      { text: 'Pain\'s okay on the morphine PRN. Last dose 21:30.', key: false },
      { text: 'Heart rate\'s been in the 90s all day.', key: true },
      { text: 'He does the crossword every night. Ask him for a seven-letter word.', key: false },
    ],
    vitals(s, P) {
      const v = peSev(s, P), pe = P.pe !== null;
      const spo2 = pe ? Math.round(88 - v * 8 + (P.o2 ? 7 : 0)) : 95;
      return { T: pe ? 37.8 : 37.5, HR: Math.round(pe ? 118 + v * 14 : 94) + jit(s, 3), SBP: Math.round(pe ? 118 - v * 22 : 126) + jit(s, 4) * 2, DBP: pe ? 70 : 74, RR: Math.round(pe ? 28 + v * 6 : 18), SpO2: clamp(spo2, 70, 99), O2: P.o2 ? 'NRB 15 L' : 'Room air', pain: pe ? 7 : 3 };
    },
    assess: {
      general: (s, P) => (P.pe !== null ? 'Sitting bolt upright, gripping the rail, breathing fast. Gray, sweaty, terrified.' : 'Reading glasses on, crossword on his knee. Thin and tired.'),
      resp: (s, P, A) => { const v = A.vitals('433'); return P.pe !== null ? `RR ${v.RR}, shallow and fast. Lungs clear on both sides. Sharp pain on the right when he breathes in.` : 'Clear bilaterally. Unlabored.'; },
      cardiac: (s, P, A) => { const v = A.vitals('433'); return P.pe !== null ? `HR ${v.HR}, regular and fast. Neck veins mildly distended.` : `HR ${v.HR}, regular. Pulses 2+.`; },
      neuro: (s, P) => 'Alert, oriented. ' + (P.pe !== null ? 'Keeps saying something is wrong.' : 'Wry and quick.'),
      pain: (s, P) => (P.pe !== null ? 'Sharp right-sided chest pain, worse with every breath, 7/10. The right calf still aches.' : 'Right calf aches, 3/10. "Probably from lying here." Abdominal pain controlled.'),
      skin: (s, P, A) => { P.calfSeen = true; return 'Right calf visibly larger than the left, warm and tender. Left leg normal. Skin pale, dry.'; },
      gi: () => 'Poor appetite. Abdomen soft, mildly tender in the upper abdomen. Voiding.',
    },
    interventions: [
      { id: 'calf', label: 'Measure and compare his calves', cost: 3, run(s, P, A) { P.calfSeen = true; A.judge('433-calf', 'assess', 1, 'You compared Mr. Brandt\'s calves.', 'Unilateral swelling, warmth and tenderness in a bed-bound cancer patient refusing prophylaxis is a DVT until proven otherwise. Report it; don\'t rub it.', '433'); return 'Right calf 39 cm, left 36 cm, measured 10 cm below the kneecap. Right is warm and tender.'; } },
      { id: 'massage', label: 'Massage his calf to ease the ache', cost: 3, avail: (s, P) => P.pe === null, run(s, P, A) { P.massaged = true; A.judge('433-massage', 'safety', -2, 'You massaged a calf with signs of DVT.', 'Rubbing a leg with a suspected clot can dislodge it. Swelling plus warmth plus tenderness means hands off and call.', '433'); if (P.pe === null && s.t < 145) P.early = s.t + 8; return '"Oh, that helps." He closes his eyes.'; } },
      { id: 'hob', label: 'Sit him up, high Fowler\'s', cost: 1, avail: (s, P) => P.pe !== null && !P.hob, run(s, P) { P.hob = true; return 'Bed up to 90 degrees. He leans forward on the table, working to breathe.'; } },
      { id: 'o2', label: 'Oxygen by non-rebreather at 15 L', cost: 1, avail: (s, P) => P.pe !== null && !P.o2, urgent: true, run(s, P, A) { P.o2 = 15; A.judge('433-o2', 'safety', 1, 'You put Mr. Brandt on high-flow oxygen.', 'Hypoxia first. The cause can be worked out once oxygen is going in.', '433'); return 'Mask on, bag inflating. His sat creeps up.'; } },
    ],
    comms: [
      {
        id: 'rrt', label: 'Call a rapid response', cost: 3, avail: (s, P) => P.pe !== null && !P.rrt && !P.icu,
        run(s, P, A) {
          P.rrt = true; P.hepOrdered = true;
          A.judge('433-rrt', 'judgment', s.t - P.pe <= 12 ? 2 : 1, 'You called a rapid response for Mr. Brandt.', 'Sudden dyspnea, tachycardia, hypoxia and clear lungs in a high-risk patient: this is a PE picture. Early escalation keeps it from becoming shock.', '433');
          A.addOrder('433', 'CT angiogram chest STAT. Heparin 80 units/kg IV bolus, then 18 units/kg/h per weight-based protocol. Oxygen to SpO₂ ≥ 92%.');
          return 'The rapid response team is here in three minutes. CT angiogram ordered, heparin per protocol. "Good call. This looks like a PE."';
        },
      },
    ],
    meds: [
      { id: '433-enox', name: 'Enoxaparin', dose: '40 mg', route: 'SubQ', freq: 'Daily at 21:00 (refused three nights)', later: '21:00' },
      {
        id: '433-hep', name: 'Heparin infusion', dose: '80 units/kg bolus, then 18 units/kg/h', route: 'IV', freq: 'Weight-based protocol', prn: true, available: (s, P) => P.hepOrdered, block: (s, P) => (P.hepAt !== null ? 'Started at ' + clock(P.hepAt) + '.' : null),
        checks: () => [{ label: 'Weight', value: '71 kg: bolus 5,700 units, 1,280 units/h', ok: true }, { label: 'Baseline labs', value: 'aPTT and CBC drawn', ok: true }, { label: 'Bleeding risk', value: 'No active bleeding. Platelets 236', ok: true }],
        give(s, P, A) { P.hepAt = s.t; A.judge('433-hep', 'meds', 2, 'You started Mr. Brandt\'s heparin infusion.', 'Anticoagulation stops the clot from growing while his body breaks it down. Weight-based dosing and a second-nurse check are standard for a high-alert drip.', '433'); return 'Heparin bolus given, infusion running at 1,280 units/h. Second nurse verified. aPTT in 6 hours.'; },
      },
      {
        id: '433-loraz', name: 'Lorazepam', dose: '0.5 mg', route: 'IV', freq: 'Every 6 h as needed, anxiety', prn: true, block: (s, P) => (P.lorazAt !== null && s.t - P.lorazAt < 360 ? 'Given at ' + clock(P.lorazAt) + '.' : null),
        checks: (s, P, A) => { const v = A.lastVitals('433'); return [{ label: 'Latest SpO₂ and RR', value: `${v.SpO2}%, RR ${v.RR} at ${clock(v.t)}`, ok: v.SpO2 >= 92 && v.RR <= 22 }]; },
        give(s, P, A) { P.lorazAt = s.t; if (P.pe !== null) { P.lorazInPe = true; A.judge('433-loraz', 'meds', -2, 'You gave lorazepam for "anxiety" during an acute PE.', 'Sudden anxiety with a fast heart, fast breathing and a falling sat is hypoxia until proven otherwise. Sedating him masks the deterioration and slows his breathing.', '433'); } return 'Lorazepam 0.5 mg IV given.'; },
      },
      { id: '433-morph', name: 'Morphine', dose: '2 mg', route: 'IV', freq: 'Every 2 h as needed, severe pain', prn: true, checks: () => [{ label: 'Last dose', value: '21:30', ok: true }], give: () => 'Morphine 2 mg IV given.' },
    ],
    talk: (s, P) => (P.icu ? null : P.pe !== null ? 'walter_pe' : !P.educated ? 'walter_enox' : 'walter_idle'),
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('433'), pe = P.pe !== null;
        return [
          { id: 'sob', label: 'Sudden shortness of breath, pleuritic chest pain', key: pe, need: pe && s.t - P.pe < 180, lock: 'No new symptoms' },
          { id: 'vit', label: `HR ${v.HR}, RR ${v.RR}, SpO₂ ${v.SpO2}% on ${v.O2 === 'Room air' ? 'room air' : v.O2}`, key: pe || v.HR > 100, need: true },
          { id: 'lungs', label: 'Lungs clear', key: pe, need: pe && recent(s, P.assessAt.resp, 30), lock: 'Listen to his lungs' },
          { id: 'calf', label: 'Right calf 3 cm larger, warm and tender', key: true, need: P.calfSeen, lock: 'Examine his legs' },
          { id: 'refused', label: 'Refused enoxaparin three nights in a row', key: true, need: true },
          { id: 'cancer', label: 'Metastatic cancer, mostly in bed for two weeks', key: true, need: true },
          { id: 'cross', label: 'Doing the crossword', key: false, need: true },
        ];
      },
      requests: [
        { id: 'eval', label: 'I\'m worried about a clot. Can you evaluate him and order imaging?' },
        { id: 'anx', label: 'Can I give him something for his anxiety?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (P.pe !== null) {
          if (req === 'anx') { A.judge('433-sbar-anx', 'judgment', -2, 'You asked for anxiolytics during Mr. Brandt\'s PE.', 'His "anxiety" was air hunger. Report the numbers and ask for help.', '433'); return 'Anxiety? With a sat like that? I\'m calling a rapid response. Oxygen now.'; }
          if (picked.includes('sob') || picked.includes('vit')) { if (!P.rrt) { P.rrt = true; P.hepOrdered = true; A.addOrder('433', 'CT angiogram chest STAT. Heparin 80 units/kg IV bolus, then 18 units/kg/h per protocol.'); } A.judge('433-sbar-pe', 'comm', 2, 'You escalated Mr. Brandt\'s sudden hypoxia fast.', 'Sudden onset, the numbers, and the risk factors: the provider can name PE from that call.', '433'); return 'That\'s a PE until proven otherwise. I\'m calling the rapid response and coming up. Oxygen, sit him up, CT angiogram, and start heparin per protocol.'; }
          return 'What are his vitals? I need numbers.';
        }
        if (picked.includes('calf') && picked.includes('refused')) {
          if (P.duplexAt === null) { P.reported = true; P.duplexAt = s.t; A.addOrder('433', 'Venous duplex right leg now. If positive, heparin infusion per weight-based protocol. Bed rest until results.'); }
          A.judge('433-sbar', 'comm', 2, 'You reported Mr. Brandt\'s calf findings with his refused prophylaxis.', 'Refusal plus a swollen, warm, tender calf is a pattern, not two facts. Putting them together got him an ultrasound before the clot moved.', '433');
          return 'That\'s a DVT until proven otherwise. Duplex now, and if it\'s positive start heparin. Thanks for looking at his legs.';
        }
        if (picked.includes('refused')) { P.reported = true; A.judge('433-sbar-ref', 'comm', 1, 'You told the provider Mr. Brandt keeps refusing prophylaxis.', 'Refusals need to reach the provider so the plan can change. Now go look at his legs.', '433'); return 'Hm. Offer the SCDs again, and I\'ll talk to him about the shots on rounds. Have you looked at his legs?'; }
        return 'Okay. Anything else on him?';
      },
    },
    scene: (s, P) => ({ iv: P.hepAt !== null ? 'running' : 'lock', o2: P.o2 ? 10 : 0, tray: 'none', tablet: true, empty: P.icu, emptyText: 'Bed empty. Taken to the ICU with a massive PE.', night: true }),
    clues: (s, P) => ({
      tablet: 'Tonight\'s crossword, half done, in pen. 14 across: "obstinate," written in firmly.',
      iv: P.hepAt !== null ? 'Heparin infusion at 1,280 units/h. Two-nurse verified.' : 'Saline lock, right forearm.',
      o2: P.o2 ? 'Non-rebreather mask at 15 L.' : 'Oxygen flowmeter on the headwall, off.',
    }),
    rig: (s, P) => { const pe = P.pe !== null, v = peSev(s, P); return pe ? { lean: clamp(.4 + v * .4, 0, 1), anxious: .8, sweat: .5, pale: .4 } : { pale: .2 }; },
    status: (s, P) => (P.icu ? 'gone' : P.pe !== null && !P.rrt ? 'urgent' : P.pe !== null ? 'watch' : P.calfSeen && P.hepAt === null ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Massive PE, ICU', text: 'Hypotensive and hypoxic within half an hour of the first symptom. His calf had been telling the story since the evening.' };
      if (P.pe !== null) return { tone: P.lorazInPe ? 'bad' : 'mixed', title: P.lorazInPe ? 'PE, treated late and sedated' : 'Pulmonary embolism, caught fast', text: P.lorazInPe ? 'He got lorazepam for air hunger before anyone treated the clot.' : `A PE at ${clock(P.pe)}. Oxygen and a fast rapid response kept him out of the ICU. The swollen calf was the early warning.` };
      if (P.hepAt !== null) return { tone: 'good', title: 'DVT caught before it moved', text: 'Duplex confirmed a popliteal DVT. Heparin is running. You looked at his legs because of what report said.' };
      return { tone: 'mixed', title: 'Clot risk never addressed', text: 'Swollen calf, refused prophylaxis, no evaluation.' };
    },
  };

  /* ---------- 435 Kaia Sorensen: DKA on an insulin infusion ---------- */
  const kaia = {
    id: '435', room: '435', name: 'Kaia Sorensen', short: 'Ms. Sorensen', age: 26, sex: 'F', mrn: '00815530',
    look: { skin: '#D6A47C', shade: '#B8845C', lip: '#9B574D', blush: '#D98468', iris: '#3A2618', head: { w: 52, h: 61, jaw: .3 }, eye: 10.4,
      hair: { style: 'ponytail', color: '#2B1B14' }, brow: { w: 3.4, color: '#20150F' }, body: { w: 70, cloth: 'gown' }, extras: ['studs', 'freckles'], smile: .35,
      lines: { calm: 'Is it bad that I\'m most upset about missing climbing this week?', hypo: 'I feel shaky and weird. Is my sugar low?', nausea: 'Still queasy. The smell of the hallway is not helping.', anxious: 'When can I eat? I\'m so hungry it hurts.', drowsy: 'Just tired.', none: 'She doesn\'t respond.' } },
    bio: 'Grad student in marine biology, bouldering obsessive. Type 1 since age 9. Her insulin pump site failed on a field trip.',
    dx: 'Diabetic ketoacidosis on insulin infusion', reason: 'DKA after insulin pump failure',
    hx: ['Type 1 diabetes since age 9, insulin pump', 'No prior DKA admissions', 'Anxiety'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '60 kg',
    lines: ['PIV 18g right antecubital: insulin infusion, 6 units/h', 'PIV 20g left forearm: 0.9% saline at 250 mL/h'], mobility: 'Up as tolerated', diet: 'NPO until anion gap closes',
    init: { bg: 312, bgAt: -60, lastBG: 338, bgs: [{ t: -60, val: 338, by: 'Jamal (evening RN)' }], dripOn: true, dripMin: 0, paused: false, dex: false, dexAt: null, K: 3.6, kclAt: null, kLow: false, kclLowAt: null, gapClosed: false, glarAt: null, dripOffAt: null, rebound: false, hypo: false, askedOff: false },
    nightVitals: { T: 37.0, HR: 104, SBP: 112, DBP: 68, RR: 22, SpO2: 99, O2: 'Room air', pain: 2 },
    labs: [
      { name: 'Glucose (serum)', val: 338, unit: 'mg/dL', ref: '70–99', flag: 'H', t: -60 },
      { name: 'Potassium', val: 3.6, unit: 'mmol/L', ref: '3.5–5.0', flag: '', t: -60 },
      { name: 'Bicarbonate', val: 13, unit: 'mmol/L', ref: '22–28', flag: 'L', t: -60 },
      { name: 'Anion gap', val: 18, unit: 'mmol/L', ref: '8–12', flag: 'H', t: -60 },
      { name: 'Venous pH', val: 7.24, unit: '', ref: '7.31–7.41', flag: 'L', t: -60 },
    ],
    orders: [
      { t: -420, text: 'DKA protocol: regular insulin infusion 0.1 units/kg/h (6 units/h). Point-of-care glucose every hour.' },
      { t: -420, text: 'When glucose < 250 mg/dL: change fluids to D5 ½NS at 150 mL/h and reduce insulin to 0.05 units/kg/h (3 units/h).' },
      { t: -420, text: 'Potassium protocol: K 3.3–5.2, give KCl 20 mEq IV per liter of fluid. K < 3.3: HOLD insulin, give KCl 40 mEq IV, recheck in 2 h. BMP every 2 h.' },
      { t: -420, text: 'When anion gap ≤ 12: give insulin glargine subQ, continue the infusion for 2 h after, then stop. NPO until gap closes.' },
    ],
    notes: [
      { t: -60, author: 'Jamal, evening RN', text: 'Glucose 338 at 22:00, drip at 6 units/h. Gap 18. K 3.6. Protocol KCl 20 mEq due 23:00. Nauseous earlier, better now. Very hungry, asking to eat, told her not until the gap closes.' },
    ],
    io: { intake: 'IV 3,100 mL since admission', output: 'Urine 1,650 mL' },
    report: [
      { text: 'Kaia Sorensen, 26, type 1, DKA after her pump failed. Full code.', key: false },
      { text: 'Insulin drip at 6 units an hour. Glucose was 338 at 22:00. She\'s on hourly checks.', key: true },
      { text: 'Potassium was 3.6. The protocol KCl is due at 23:00.', key: true },
      { text: 'When she drops under 250, add D5 and cut the drip in half. That\'s the protocol.', key: true },
      { text: 'Gap was 18 at 22:00, still open.', key: true },
      { text: 'She\'s starving and asking to eat. NPO until the gap closes.', key: false },
    ],
    vitals(s, P) { const lo = P.bg < 70; return { T: 37.0, HR: (P.gapClosed ? 86 : 100) + (lo ? 20 : 0) + jit(s, 5), SBP: 114 + jit(s, 6) * 2, DBP: 70, RR: P.gapClosed ? 16 : 22, SpO2: 99, O2: 'Room air', pain: 2 }; },
    assess: {
      general: (s, P) => (P.bg < 70 ? 'Sweaty and shaky, staring at her hands. "Something\'s wrong."' : P.gapClosed ? 'Sitting up, color back, scrolling her phone. "I feel human again."' : 'Curled on her side, pale, sipping nothing. Tired but chatty.'),
      resp: (s, P) => (P.gapClosed ? 'Clear, normal rate.' : 'Clear. Deep, slightly fast breathing. A faint fruity smell on her breath.'),
      cardiac: (s, P, A) => `HR ${A.vitals('435').HR}, regular. Mucous membranes ${P.gapClosed ? 'moist' : 'still dry'}.`,
      neuro: (s, P) => (P.bg < 70 ? 'Confused, slow to answer, tremulous.' : 'Alert and oriented.'),
      pain: () => 'Mild abdominal cramping, 2/10.',
      skin: () => 'Warm. Infusion sites clean. Old pump site on her abdomen red and a little swollen.',
      gi: (s, P) => (s.t < 120 && !P.gapClosed ? 'Nauseous on and off, no vomiting since 18:00. NPO.' : 'Nausea gone. Very hungry.'),
    },
    interventions: [
      {
        id: 'bg', label: 'Check blood glucose (hourly on the drip)', cost: 3,
        run(s, P, A) { const v = Math.round(P.bg); P.bgAt = s.t; P.lastBG = v; P.bgs.push({ t: s.t, val: v, by: 'You' }); return `Glucose ${v} mg/dL.` + (v < 70 ? ' Low.' : v < 250 && !P.dex && P.dripOn ? ' Under 250: protocol says add D5 ½NS and halve the insulin rate.' : ''); },
      },
      {
        id: 'dex', label: 'Change to D5 ½NS, halve the insulin rate (protocol: glucose < 250)', cost: 3, avail: (s, P) => !P.dex && P.dripOn,
        run(s, P, A) {
          P.dex = true; P.dexAt = s.t;
          if (!recent(s, P.bgAt, 60)) A.judge('435-dex-blind', 'assess', -1, 'You changed Ms. Sorensen\'s fluids without a current glucose.', 'Protocol steps run on the number. Check first.', '435');
          else if (P.lastBG >= 250) A.judge('435-dex-early', 'judgment', -1, 'You added dextrose before her glucose was under 250.', 'Too early and her glucose stalls high, and the drip has to run longer.', '435');
          else A.judge('435-dex', 'judgment', 2, 'You added dextrose when Ms. Sorensen\'s glucose fell below 250.', 'In DKA the insulin is treating the acid, not just the sugar. Dextrose lets the insulin keep running until the gap closes without dropping her into hypoglycemia.', '435');
          return 'D5 ½NS hung at 150 mL/h. Insulin infusion reduced to 3 units/h. Second nurse verified.';
        },
      },
      {
        id: 'pause', label: 'Pause the insulin infusion (protocol: K < 3.3)', cost: 1, avail: (s, P) => P.dripOn && !P.paused,
        run(s, P, A) {
          P.paused = true;
          if (!P.kLow) A.judge('435-pause-bad', 'judgment', -2, 'You paused Ms. Sorensen\'s insulin without a low potassium.', 'Every minute off the drip is a minute the acidosis isn\'t being treated. The protocol only holds insulin for K under 3.3.', '435');
          else A.judge('435-pause', 'safety', 2, 'You held the insulin infusion for a potassium under 3.3.', 'Insulin drives potassium into cells. Running it with a K of 3.1 invites a dangerous arrhythmia. Replace first, then restart.', '435');
          return 'Insulin infusion paused.';
        },
      },
      { id: 'resume', label: 'Resume the insulin infusion', cost: 1, avail: (s, P) => P.dripOn && P.paused, run(s, P, A) { if (P.K < 3.3) A.judge('435-resume-early', 'safety', -1, 'You restarted insulin before her potassium was replaced.', 'Give the KCl and let it run before you restart the drip.', '435'); P.paused = false; return 'Insulin infusion running again.'; } },
      {
        id: 'stop', label: 'Stop the insulin infusion', cost: 1, avail: (s, P) => P.dripOn,
        run(s, P, A) {
          P.dripOn = false; P.dripOffAt = s.t;
          if (!P.gapClosed) A.judge('435-stop', 'meds', -3, 'You stopped the insulin infusion before the anion gap closed.', 'The drip is treating the ketoacidosis. Glucose looking better isn\'t the endpoint; a closed gap is.', '435');
          else if (P.glarAt === null) A.judge('435-stop', 'meds', -3, 'You stopped the insulin infusion with no basal insulin on board.', 'Regular insulin IV lasts minutes. Without long-acting insulin already working, ketones come right back.', '435');
          else if (s.t - P.glarAt < 120) A.judge('435-stop', 'meds', -2, `You stopped the drip ${s.t - P.glarAt} minutes after the glargine.`, 'Subcutaneous glargine takes about 2 hours to start working. Stop the drip early and DKA comes back.', '435');
          else A.judge('435-stop', 'meds', 2, 'You stopped the drip after a full 2-hour overlap with glargine.', 'Textbook transition: gap closed, basal on board, overlap, then off.', '435');
          return 'Insulin infusion stopped.';
        },
      },
    ],
    meds: [
      { id: '435-drip', name: 'Insulin regular infusion', dose: '0.1 units/kg/h', route: 'IV', freq: 'Continuous, per DKA protocol', initStatus: 'given', givenNote: 'Running since 16:30' },
      {
        id: '435-kcl', name: 'Potassium chloride', dose: '20 mEq', route: 'IV', freq: 'Per liter, protocol for K 3.3–5.2', due: 0,
        checks: (s, P) => [{ label: 'Potassium', value: '3.6 at 22:00', ok: true }, { label: 'Urine output', value: 'Adequate, 1,650 mL since admission', ok: true }, { label: 'Rate', value: 'No faster than 10 mEq/h peripherally', ok: null }],
        give(s, P, A) { P.kclAt = s.t; if (s.t > 60) A.judge('435-kcl-late', 'time', -1, 'Ms. Sorensen\'s protocol potassium went in late.', 'Insulin keeps pulling potassium down. Replacement has to keep pace.', '435'); return 'KCl 20 mEq added to the running liter, infusing over 2 h.'; },
        hold(s, P, A) { A.judge('435-kcl-hold', 'meds', -2, 'You held the protocol potassium on an insulin drip.', 'Her K was 3.6 and falling with every hour of insulin.', '435'); return 'Held.'; },
      },
      {
        id: '435-kcl2', name: 'Potassium chloride (low-K protocol)', dose: '40 mEq', route: 'IV', freq: 'Once, K < 3.3', prn: true, available: (s, P) => P.kLow, block: (s, P) => (P.kclLowAt !== null ? 'Given at ' + clock(P.kclLowAt) + '.' : null),
        checks: () => [{ label: 'Potassium', value: '3.1 (low)', ok: true }, { label: 'Insulin', value: 'Hold while replacing', ok: null }],
        give(s, P, A) { P.kclLowAt = s.t; P.kclAt = s.t; A.judge('435-kcl2', 'meds', 1, 'You replaced Ms. Sorensen\'s low potassium.', 'Replace, recheck, then restart the insulin.', '435'); return 'KCl 40 mEq IV infusing over 4 h via pump.'; },
      },
      {
        id: '435-glar', name: 'Insulin glargine', dose: '20 units', route: 'SubQ', freq: 'Once, when the gap closes', prn: true, available: (s, P) => P.gapClosed, block: (s, P) => (P.glarAt !== null ? 'Given at ' + clock(P.glarAt) + '.' : null),
        checks: () => [{ label: 'Anion gap', value: '11, closed', ok: true }, { label: 'Keep drip', value: 'Continue infusion 2 h after this dose', ok: null }],
        give(s, P, A) { P.glarAt = s.t; A.judge('435-glar', 'meds', 1, 'You gave glargine once the gap closed.', 'Basal first, overlap, then the drip comes off.', '435'); return 'Glargine 20 units subQ given. The infusion keeps running for 2 more hours.'; },
      },
      { id: '435-ond', name: 'Ondansetron', dose: '4 mg', route: 'IV', freq: 'Every 6 h as needed, nausea', prn: true, checks: () => [{ label: 'Nausea', value: 'On and off', ok: true }], give: () => 'Ondansetron 4 mg IV given.' },
    ],
    talk: (s, P) => (P.bg < 70 ? 'kaia_low' : P.gapClosed && P.dripOn && !P.askedOff ? 'kaia_off' : 'kaia_talk'),
    sbar: {
      items(s, P, A) {
        const kLab = P.labs.filter((l) => l.name === 'Potassium').pop();
        return [
          { id: 'bg', label: P.bgAt !== null && P.bgAt >= 0 ? `Glucose ${P.lastBG} at ${clock(P.bgAt)}` : 'Glucose', key: true, need: P.bgAt >= 0, lock: 'Check her glucose' },
          { id: 'k', label: `Potassium ${kLab.val}${P.kLow ? ' (below 3.3)' : ''}`, key: P.kLow, need: true },
          { id: 'gap', label: P.gapClosed ? 'Anion gap 11, bicarb 18: closed' : 'Anion gap 18 at 22:00', key: P.gapClosed, need: true },
          { id: 'dex', label: P.dex ? `On D5 ½NS since ${clock(P.dexAt)}` : 'Still on normal saline', key: false, need: true },
          { id: 'hungry', label: 'Hungry, asking to eat', key: false, need: true },
          { id: 'climb', label: 'Worried about missing climbing', key: false, need: true },
        ];
      },
      respond(s, P, A, picked) {
        if (picked.includes('k') && P.kLow && !P.paused) return 'Hold the drip. 40 of IV KCl, and recheck in two hours. Don\'t restart until the KCl is in.';
        if (picked.includes('gap') && P.gapClosed) return 'Great. Glargine 20 now, keep the drip running two more hours, then stop it. She can eat.';
        if (picked.includes('bg')) return 'Follow the protocol. Call me if she drops under 70 or the gap closes.';
        return 'Okay. What\'s her glucose?';
      },
    },
    scene: (s, P) => ({ iv: P.dripOn && !P.paused ? 'running' : 'lock', tray: P.gapClosed ? 'full' : 'none', tablet: true, night: true }),
    clues: (s, P) => ({
      iv: P.dripOn ? (P.paused ? 'Insulin pump paused. ' : 'Insulin infusion at ' + (P.dex ? '3' : '6') + ' units/h. ') + (P.dex ? 'D5 ½NS on the other line.' : 'Normal saline at 250 mL/h.') : 'Insulin infusion stopped.',
      tablet: 'Her phone, open to a bouldering video. The battery is at 4%.',
      tray: 'A late dinner tray: turkey sandwich, apple, juice.',
    }),
    rig: (s, P) => ({ glu: P.bg, nausea: !P.gapClosed && s.t < 120, anxious: P.bg < 70 ? .6 : 0 }),
    status: (s, P) => (P.bg < 70 || (P.kLow && !P.paused) ? 'urgent' : !P.gapClosed || P.rebound ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.rebound) return { tone: 'bad', title: 'DKA came back', text: 'The drip came off before basal insulin was working. Her gap reopened by morning.' };
      if (P.hypo) return { tone: 'mixed', title: 'Gap closing, but her glucose crashed', text: 'Insulin kept running without dextrose, and her glucose fell into the 50s.' };
      if (P.kLow && !P.paused) return { tone: 'mixed', title: 'Insulin ran with a low potassium', text: 'Her K dipped to 3.1 while the drip ran. No arrhythmia, this time.' };
      if (P.gapClosed && P.glarAt !== null) return { tone: 'good', title: 'DKA resolved, safe transition', text: P.dripOn ? 'Gap closed, glargine given, and the drip handed off to finish its 2-hour overlap.' : 'Gap closed, glargine on board, drip off after a full overlap. She\'s eating breakfast.' };
      if (P.gapClosed) return { tone: 'mixed', title: 'Gap closed, no basal yet', text: 'Ready to transition, but glargine never went in.' };
      return { tone: 'mixed', title: 'Still in DKA at handoff', text: 'The gap never closed overnight.' };
    },
  };

  /* ---------- 437 Frank Delgado: pneumonia, silent stroke overnight ---------- */
  const stroke = (P) => P.onset !== null;
  const frankSeen = (s, P) => { if (stroke(P)) { if (P.found === null) P.found = s.t; } else P.lastNormal = s.t; };
  const frank = {
    id: '437', room: '437', name: 'Frank Delgado', short: 'Mr. Delgado', age: 71, sex: 'M', mrn: '00439977',
    look: { skin: '#C99B77', shade: '#A77A56', lip: '#8A4B3C', blush: '#CF7F66', iris: '#3B2616', head: { w: 60, h: 62, jaw: .55 }, eye: 9.6,
      hair: { style: 'swoop', color: '#E6E2DC' }, brow: { w: 5, color: '#D2CCC4' }, body: { w: 90, cloth: 'gown' }, extras: ['beard', 'wrinkles', 'cannula'], smile: .5,
      lines: { calm: 'Tell the doctor I\'m ready to go home. My tomatoes need me.', confused: 'I\'m... fine. Jus\' tired. Cup keeps... slippin\'.', drowsy: 'Mm. Leave the TV on.', none: 'He doesn\'t answer.' } },
    bio: 'Retired city bus driver and prize-winning tomato grower. Widowed, lives with his daughter Lupe.',
    dx: 'Pneumonia, day 3', reason: 'Community-acquired pneumonia, improving',
    hx: ['Atrial fibrillation; apixaban on hold since a GI bleed in May', 'Hypertension', 'Type 2 diabetes, diet controlled'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '84 kg',
    lines: ['PIV 20g left hand, saline lock', 'Oxygen 2 L nasal cannula'], mobility: 'Up with assist of 1', diet: 'Cardiac, consistent carbohydrate',
    init: { onset: null, lastNormal: -120, found: null, alert: null, bgAt: null, labeAt: null, ct: null, eligible: null, tpa: null, swallow: null, poGiven: false, missed: false, waitMsg: false },
    nightVitals: { T: 37.4, HR: 88, SBP: 158, DBP: 88, RR: 18, SpO2: 94, O2: '2 L NC', pain: 0 },
    labs: [
      { name: 'WBC', val: 11.4, unit: 'K/µL', ref: '4.5–11.0 (16.2 on admission)', flag: 'H', t: -600 },
      { name: 'Hemoglobin', val: 12.6, unit: 'g/dL', ref: '13.5–17.5', flag: 'L', t: -600 },
      { name: 'Platelets', val: 248, unit: 'K/µL', ref: '150–400', flag: '', t: -600 },
      { name: 'INR', val: 1.0, unit: '', ref: '0.9–1.1', flag: '', t: -600 },
    ],
    orders: [
      { t: -3000, text: 'Ceftriaxone 1 g IV daily, azithromycin completed. Oxygen to SpO₂ ≥ 92%.' },
      { t: -3000, text: 'Aspirin 81 mg PO daily at 00:00. Metoprolol tartrate 25 mg PO every 12 h (00:00, 12:00); hold HR < 60 or SBP < 100.' },
      { t: -3000, text: 'Neuro checks every 4 h (history of TIA). Apixaban on hold: GI bleed May, GI to advise.' },
    ],
    notes: [
      { t: -120, author: 'Jamal, evening RN', text: 'Neuro check 21:00: alert, oriented × 4, face symmetric, strength equal, speech clear. BP 158/88. Eating well. Asking when he can go home.' },
    ],
    io: { intake: 'PO 1,400 mL', output: 'Voiding' },
    report: [
      { text: 'Frank Delgado, 71, pneumonia day three, getting better. Full code.', key: false },
      { text: 'He\'s in AFib. His apixaban is on hold after a GI bleed in May.', key: true },
      { text: 'BP ran in the 150s and 160s today.', key: true },
      { text: 'Last neuro check was at 21:00. Totally normal. They\'re every four hours.', key: true },
      { text: 'Aspirin and metoprolol are due at midnight.', key: false },
      { text: 'He wants to go home to his tomato garden.', key: false },
    ],
    vitals(s, P) {
      const st = stroke(P), bp = st ? (P.labeAt !== null ? 176 : 196) : 158;
      return { T: 37.4, HR: 88 + jit(s, 7) * 2, SBP: bp + jit(s, 8) * 2, DBP: st ? (P.labeAt !== null ? 98 : 108) : 88, RR: 18, SpO2: 94, O2: '2 L NC', pain: 0, rhythm: 'AFib' };
    },
    assess: {
      general: (s, P) => { frankSeen(s, P); return stroke(P) ? 'The right side of his mouth droops. He\'s trying to pick up his cup with his left hand, and the right hangs at his side.' : 'Propped up, watching the muted TV, chatty.'; },
      resp: () => 'Coarse crackles at the right base, less than yesterday. 2 L nasal cannula.',
      cardiac: (s, P, A) => { const v = A.vitals('437'); return `HR ${v.HR}, irregularly irregular (AFib). BP ${v.SBP}/${v.DBP}.`; },
      neuro: (s, P) => { frankSeen(s, P); P.k.neuroAt = s.t; return stroke(P) ? 'Right facial droop. Right arm drifts down within five seconds, weak grip. Speech slurred, but he understands you and knows where he is. BE-FAST positive: face, arm, speech.' : 'Alert, oriented × 4. Face symmetric, strength equal, speech clear. Normal neuro exam.'; },
      pain: () => 'No pain. "Just tired of this place."',
      skin: () => 'Warm, dry, intact.',
      gi: () => 'Eating well. Continent.',
    },
    interventions: [
      { id: 'bg', label: 'Check blood glucose', cost: 3, run(s, P, A) { P.bgAt = s.t; if (stroke(P)) A.judge('437-bg', 'assess', 1, 'You checked Mr. Delgado\'s glucose right away.', 'Hypoglycemia can look exactly like a stroke. It\'s the first number the stroke team asks for.', '437'); return 'Glucose 132 mg/dL.'; } },
      { id: 'swallow', label: 'Bedside swallow screen', cost: 3, avail: (s, P) => stroke(P) && P.found !== null && P.swallow === null, run(s, P, A) { P.swallow = s.t; A.judge('437-swallow', 'safety', 1, 'You screened Mr. Delgado\'s swallow before giving anything by mouth.', 'Up to half of stroke patients have trouble swallowing. Nothing by mouth, meds included, until they pass.', '437'); return 'He coughs and his voice turns wet after a sip of water. Failed. NPO, including meds.'; } },
    ],
    comms: [
      {
        id: 'stroke', label: 'Call a stroke alert', cost: 3, avail: (s, P) => P.alert === null,
        run(s, P, A) {
          if (!stroke(P) || P.found === null) { A.judge('437-alert-none', 'judgment', 0, 'You called a stroke alert with no deficits found.', 'Always allowed if you\'re worried, but the team will ask what you saw.', '437'); return 'The stroke nurse checks him: no deficits. "Call anytime, but tell me what you saw."'; }
          P.alert = s.t;
          A.judge('437-alert', 'judgment', s.t - P.found <= 10 ? 2 : 1, 'You called a stroke alert for Mr. Delgado.', 'Time is brain: about 1.9 million neurons a minute. The alert starts the CT, the labs and the clock at once.', '437');
          A.addOrder('437', 'Stroke alert. CT head without contrast STAT. Labetalol 10 mg IV for SBP > 185 or DBP > 110. NPO. Neuro checks every 15 min.');
          return `The stroke team is here in four minutes. "When was he last known well?" You tell them ${clock(P.lastNormal)}. "His pressure has to be under 185/110 before we can even think about alteplase."`;
        },
      },
    ],
    meds: [
      {
        id: '437-asa', name: 'Aspirin', dose: '81 mg', route: 'PO', freq: 'Daily at 00:00', due: 60,
        block: (s, P) => { if (stroke(P) && (P.found === null || P.foundByMed === s.t)) { if (P.found === null) { P.found = s.t; P.foundByMed = s.t; } return 'As you hand him the cup, the right side of his mouth doesn\'t close around it. Water dribbles down his chin, and his right hand can\'t hold the pill cup. Something is wrong.'; } return null; },
        checks: (s, P) => [{ label: 'Swallow', value: stroke(P) && P.found !== null ? (P.swallow !== null ? 'Failed screen' : 'Not screened since new symptoms') : 'Swallowing normally', ok: !(stroke(P) && P.found !== null) }],
        give(s, P, A) { if (stroke(P)) { P.poGiven = true; A.judge('437-po', 'safety', -2, 'You gave oral medication to a patient with new stroke symptoms.', 'New facial droop and slurred speech mean possible dysphagia: nothing by mouth until a swallow screen. Aspirin also has to wait until a bleed is ruled out.', '437'); return 'He chokes on the pill and coughs for a full minute.'; } return 'Aspirin 81 mg given.'; },
        hold(s, P, A) { if (stroke(P)) A.judge('437-hold-po', 'safety', 1, 'You held Mr. Delgado\'s oral meds after his stroke symptoms.', 'NPO until swallow screen, and aspirin waits for the CT.', '437'); return 'Held: NPO.'; },
      },
      {
        id: '437-meto', name: 'Metoprolol tartrate', dose: '25 mg', route: 'PO', freq: 'Every 12 h', due: 60, param: 'Hold for HR < 60 or SBP < 100',
        block: (s, P) => { if (stroke(P) && (P.found === null || P.foundByMed === s.t)) { if (P.found === null) { P.found = s.t; P.foundByMed = s.t; } return 'As you hand him the cup, the right side of his mouth doesn\'t close around it. Water dribbles down his chin, and his right hand can\'t hold the pill cup. Something is wrong.'; } return null; },
        checks: (s, P, A) => { const v = A.lastVitals('437'); return [{ label: 'HR and BP', value: `${v.HR}, ${v.SBP}/${v.DBP} at ${clock(v.t)}`, ok: v.HR >= 60 && v.SBP >= 100 }, { label: 'Swallow', value: stroke(P) && P.found !== null ? 'New deficits: NPO' : 'Normal', ok: !(stroke(P) && P.found !== null) }]; },
        give(s, P, A) { if (stroke(P)) { P.poGiven = true; A.judge('437-po', 'safety', -2, 'You gave oral medication to a patient with new stroke symptoms.', 'NPO until a swallow screen. The stroke team will manage his BP IV.', '437'); return 'He chokes on the pill and coughs for a full minute.'; } return 'Metoprolol 25 mg given.'; },
        hold(s, P, A) { if (stroke(P)) A.judge('437-hold-po', 'safety', 1, 'You held Mr. Delgado\'s oral meds after his stroke symptoms.', 'NPO until swallow screen.', '437'); return 'Held.'; },
      },
      {
        id: '437-labe', name: 'Labetalol', dose: '10 mg', route: 'IV', freq: 'For SBP > 185 or DBP > 110', prn: true, available: (s, P) => P.alert !== null, block: (s, P) => (P.labeAt !== null ? 'Given at ' + clock(P.labeAt) + '.' : null),
        checks: (s, P, A) => { const v = A.vitals('437'); return [{ label: 'BP now', value: `${v.SBP}/${v.DBP}`, ok: v.SBP > 185 }, { label: 'HR', value: `${v.HR}`, ok: v.HR >= 60 }]; },
        give(s, P, A) { P.labeAt = s.t; A.judge('437-labe', 'meds', 1, 'You brought Mr. Delgado\'s BP under the alteplase threshold.', 'Alteplase needs BP under 185/110 before it starts and under 180/105 after. The nurse gets it there.', '437'); return 'Labetalol 10 mg IV over 2 minutes. BP 176/98 on recheck.'; },
      },
      {
        id: '437-tpa', name: 'Alteplase', dose: '0.9 mg/kg (76 mg)', route: 'IV', freq: '10% bolus, rest over 60 min', prn: true, available: (s, P) => P.eligible === true, block: (s, P) => (P.tpa !== null ? 'Started at ' + clock(P.tpa) + '.' : null),
        checks: () => [{ label: 'CT', value: 'No hemorrhage', ok: true }, { label: 'BP', value: 'Under 185/110 after labetalol', ok: true }, { label: 'Window', value: 'Within 4.5 h of last known well', ok: true }],
        give(s, P, A) { P.tpa = s.t; A.judge('437-tpa', 'judgment', 2, 'Alteplase went in for Mr. Delgado inside the window.', 'Every step you did fast (finding him, the alert, glucose, BP) came off the clock. Neuro checks every 15 minutes now.', '437'); return 'Alteplase bolus given, infusion running. Neuro checks every 15 minutes, BP every 15.'; },
      },
      { id: '437-cef', name: 'Ceftriaxone', dose: '1 g', route: 'IV', freq: 'Daily at 10:00', later: '10:00' },
    ],
    talk: (s, P) => { frankSeen(s, P); return stroke(P) ? 'frank_stroke' : 'frank_chat'; },
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('437');
        return [
          { id: 'face', label: 'New right facial droop, right arm drift, slurred speech', key: true, need: stroke(P) && P.found !== null, lock: 'Nothing new found' },
          { id: 'lkw', label: `Last known well ${clock(P.lastNormal)}`, key: stroke(P), need: true },
          { id: 'bp', label: `BP ${v.SBP}/${v.DBP}`, key: v.SBP > 185, need: true },
          { id: 'bg', label: 'Glucose 132', key: stroke(P), need: P.bgAt !== null, lock: 'Check his glucose' },
          { id: 'afib', label: 'AFib, apixaban on hold since May', key: true, need: true },
          { id: 'tom', label: 'Wants to go home to his tomatoes', key: false, need: true },
        ];
      },
      respond(s, P, A, picked) {
        if (picked.includes('face') && stroke(P)) {
          if (P.alert === null) { P.alert = s.t; A.addOrder('437', 'Stroke alert. CT head without contrast STAT. Labetalol 10 mg IV for SBP > 185 or DBP > 110. NPO. Neuro checks every 15 min.'); }
          A.judge('437-sbar', 'comm', picked.includes('lkw') ? 2 : 1, 'You called in Mr. Delgado\'s stroke symptoms.', 'Deficits plus a last-known-well time is the whole call. Everything the team decides runs off that one time.', '437');
          return `That\'s a stroke. I\'m activating the stroke alert now. When was he last normal? ${picked.includes('lkw') ? clock(P.lastNormal) + ', got it.' : 'Find out.'} Glucose, NPO, and get his BP under 185.`;
        }
        return 'Okay. Keep up the neuro checks.';
      },
    },
    scene: (s, P) => ({ iv: P.tpa !== null ? 'running' : 'lock', o2: 2, tray: 'none', flowers: true, night: true }),
    clues: (s, P) => ({
      flowers: 'A paper cup with a tomato seedling in it. A card: "Get home soon, Papi. The garden misses you. Lupe."',
      iv: P.tpa !== null ? 'Alteplase infusing.' : 'Saline lock, left hand.',
      o2: 'Nasal cannula at 2 L.',
    }),
    rig: (s, P) => (stroke(P) ? { facial: P.tpa !== null && s.t - P.tpa > 40 ? .5 : 1, confused: true } : {}),
    status: (s, P) => (stroke(P) && P.found !== null && P.alert === null ? 'urgent' : stroke(P) ? 'watch' : 'stable'),
    outcome(s, P) {
      if (!stroke(P)) return { tone: 'good', title: 'Stable', text: 'Resting.' };
      if (P.tpa !== null) return { tone: P.poGiven ? 'mixed' : 'good', title: 'Stroke, treated in the window', text: `Alteplase at ${clock(P.tpa)}, last known well ${clock(P.lastNormal)}. His arm was lifting again by 04:00.` + (P.poGiven ? ' He did choke on an oral med first.' : '') };
      if (P.missed) return { tone: 'bad', title: 'Stroke found an hour late', text: 'Nobody saw him between 21:00 and Nova\'s walk-by. Out of the alteplase window; he\'s going to IR for a possible thrombectomy.' };
      if (P.eligible === false) return { tone: 'mixed', title: 'Stroke, outside the alteplase window', text: `Last known well was ${clock(P.lastNormal)}. A midnight neuro check would have moved that time forward and kept the window open.` };
      return { tone: 'mixed', title: 'Stroke, workup incomplete', text: 'Symptoms found, but the alteplase decision never got made.' };
    },
  };

  /* ---------- 439 Renee Holloway: PCA by proxy, opioid-induced sedation ---------- */
  const poss = (P) => (P.op < 2.5 ? 1 : P.op < 3.5 ? 2 : P.op < 4.3 ? 3 : 4);
  const POSS = { 1: 'awake and alert', 2: 'slightly drowsy, easily roused', 3: 'frequently drowsy, drifts off mid-sentence', 4: 'somnolent, minimal response to voice or touch' };
  const renee = {
    id: '439', room: '439', name: 'Renee Holloway', short: 'Ms. Holloway', age: 45, sex: 'F', mrn: '00932871',
    look: { skin: '#F2CDB5', shade: '#D6A98E', lip: '#B5655F', blush: '#EC9486', iris: '#5D7B4C', head: { w: 53, h: 61, jaw: .25 }, eye: 9.8,
      hair: { style: 'long', color: '#C08A4E' }, brow: { w: 3, color: '#8E6035' }, body: { w: 72, cloth: 'gown' }, extras: ['freckles'], smile: .3, tired: true,
      lines: { calm: 'Is Carl still here? Tell him to go home and sleep.', drowsy: 'Mm... so sleepy...', pain: 'It burns when I move.', none: 'She doesn\'t open her eyes. Her breathing is slow, with long pauses.' } },
    bio: 'Middle school principal. Direct and funny. Her husband Carl is anxious, devoted, and has not left her side.',
    dx: 'Post-op day 0, open hysterectomy', reason: 'Open total abdominal hysterectomy for large fibroids',
    hx: ['Obstructive sleep apnea; didn\'t bring her CPAP', 'BMI 36', 'Opioid-naive'],
    allergies: 'Codeine (nausea)', code: 'Full code', weight: '96 kg',
    lines: ['PIV 20g left forearm: LR at 100 mL/h and hydromorphone PCA', 'Foley catheter', 'Midline incision, dressing dry'], mobility: 'Bed rest tonight, dangle in the morning', diet: 'Clear liquids',
    init: { op: 1.2, taught: false, pcaStopped: false, presses: [], naloxAt: null, naloxDose: null, capno: false, o2: false, crisis: null, icu: false, histSeen: false, reported: false, carlTalked: false },
    nightVitals: { T: 37.4, HR: 76, SBP: 116, DBP: 70, RR: 14, SpO2: 96, O2: 'Room air', pain: 3 },
    labs: [
      { name: 'Hemoglobin', val: 10.9, unit: 'g/dL', ref: '12–16 (12.8 pre-op)', flag: 'L', t: -300 },
      { name: 'Creatinine', val: 0.8, unit: 'mg/dL', ref: '0.6–1.1', flag: '', t: -300 },
    ],
    orders: [
      { t: -420, text: 'Hydromorphone PCA 0.2 mg per dose, 10-min lockout, no basal, 1-h limit 1.2 mg. Patient-activated ONLY.' },
      { t: -420, text: 'POSS and RR every 1 h while on PCA. Continuous pulse oximetry. Capnography if POSS ≥ 3 or OSA.' },
      { t: -420, text: 'Naloxone 0.4 mg diluted to 10 mL: give 0.04 mg (1 mL) IV every 2 min for POSS 4 or RR < 8. Acetaminophen 1 g IV every 6 h.' },
    ],
    notes: [
      { t: -120, author: 'Jamal, evening RN', text: 'Back from PACU 16:00. PCA teaching done with patient. Sleepy since about 21:00 but easy to rouse, POSS 2. Husband Carl at bedside, very attentive, asking lots of questions about the pump.' },
    ],
    io: { intake: 'IV 1,800 mL', output: 'Foley 900 mL' },
    report: [
      { text: 'Renee Holloway, 45, back from an open hysterectomy this afternoon. Full code.', key: false },
      { text: 'Hydromorphone PCA, 0.2 a dose, 10-minute lockout, no basal. She\'s opioid-naive.', key: true },
      { text: 'She\'s been sleepy since about 21:00, but easy to wake.', key: true },
      { text: 'Her husband Carl is staying the night. He\'s really attentive, always asking about the pump.', key: true },
      { text: 'She has sleep apnea but didn\'t bring her CPAP.', key: true },
      { text: 'Foley\'s in and the dressing is clean.', key: false },
    ],
    vitals(s, P) {
      const o = P.op, rr = Math.round(clamp(18 - Math.max(0, o - 2) * 3.2, 5, 20)), sp = Math.round(clamp(97 - Math.max(0, o - 3.5) * 6 + (P.o2 ? 4 : 0), 78, 99));
      const pain = P.pcaStopped && o < 2 ? 7 : P.naloxDose === .4 && s.t - P.naloxAt < 60 ? 10 : o > 3 ? 2 : 3;
      return { T: 37.4, HR: Math.round(78 - Math.max(0, o - 3) * 4) + jit(s, 9), SBP: Math.round(118 - Math.max(0, o - 2) * 3) + jit(s, 10) * 2, DBP: 70, RR: rr, SpO2: sp, O2: P.o2 ? '2 L NC' : 'Room air', pain, poss: `${poss(P)}, ${POSS[poss(P)]}` };
    },
    assess: {
      general: (s, P) => ['', 'Awake, sipping ice chips. Carl is holding her hand.', 'Drowsy but easy to wake. Comfortable.', 'Asleep. Rouses to her name, then drifts off mid-sentence.', 'Snoring, head slumped to one side. She doesn\'t open her eyes to her name.'][poss(P)],
      resp: (s, P, A) => { const v = A.vitals('439'); P.k.rrAt = s.t; return `RR ${v.RR}${v.RR < 10 ? ', slow and shallow with long pauses' : ''}. Lungs clear. SpO₂ ${v.SpO2}% on ${P.o2 ? '2 L' : 'room air'}.` + (v.RR < 10 && v.SpO2 >= 90 ? ' The sat still looks okay. That\'s the trap: oximetry falls late.' : ''); },
      cardiac: (s, P, A) => `HR ${A.vitals('439').HR}, regular. Warm.`,
      neuro: (s, P) => { P.k.possAt = s.t; return `Sedation (POSS) ${poss(P)}: ${POSS[poss(P)]}. Pupils ${P.op > 3.5 ? 'pinpoint' : 'small'}.`; },
      pain: (s, P, A) => `Incision pain ${A.vitals('439').pain}/10.`,
      skin: () => 'Incision dressing dry. Skin warm.',
      gi: () => 'Hypoactive bowel sounds, expected tonight. Foley draining clear.',
    },
    interventions: [
      { id: 'hist', label: 'Check the PCA history (doses and attempts)', cost: 2, run(s, P, A) { P.histSeen = true; const n = P.presses.filter((t) => s.t - t <= 120).length; if (n >= 6) A.judge('439-hist', 'assess', 1, 'You checked Ms. Holloway\'s PCA history.', 'The pump log tells you who\'s pressing and when. Doses delivered while the patient is asleep mean someone else is pressing.', '439'); return `${n} doses in the last 2 hours, every attempt delivered. ${n >= 6 ? 'Most came while she was asleep.' : 'A reasonable pattern.'}`; } },
      { id: 'capno', label: 'Start continuous capnography (protocol)', cost: 3, avail: (s, P) => !P.capno, run(s, P, A) { P.capno = true; const e = Math.round(38 + Math.max(0, P.op - 2) * 7); A.judge('439-capno', 'assess', 1, 'You put Ms. Holloway on capnography.', 'End-tidal CO₂ rises before the sat falls. With sleep apnea and a PCA, it\'s the early warning.', '439'); return `EtCO₂ ${e} mmHg.` + (e > 50 ? ' High: she\'s retaining CO₂.' : ''); } },
      { id: 'stop', label: 'Stop the PCA', cost: 1, avail: (s, P) => !P.pcaStopped, run(s, P, A) { P.pcaStopped = true; if (poss(P) >= 3) A.judge('439-stop', 'safety', 2, 'You stopped Ms. Holloway\'s PCA when she was over-sedated.', 'POSS 3 means decrease the opioid; POSS 4 means stop it. Sedation comes before respiratory depression.', '439'); else A.judge('439-stop-early', 'judgment', -1, 'You stopped a PCA in a patient who wasn\'t over-sedated.', 'Her pain will come back hard. Teach, reassess, and adjust instead.', '439'); return 'PCA paused and locked.'; } },
      { id: 'stim', label: 'Stimulate: call her name, sternal rub, deep breaths', cost: 2, run(s, P) { return poss(P) >= 4 ? 'She groans and takes two deep breaths, then drifts off again. Her RR slows back down.' : 'She opens her eyes. "Mm. I\'m awake." She takes a few deep breaths.'; } },
      { id: 'o2', label: 'Apply oxygen 2 L nasal cannula', cost: 1, avail: (s, P) => !P.o2, run(s, P) { P.o2 = true; return 'Cannula on at 2 L. Her sat rises, which also means the pulse ox will now warn you later.'; } },
    ],
    family: { name: 'Carl', rel: 'Husband', mode: 'bedside', cost: 3, dialog: (s, P) => (P.taught ? 'carl_after' : 'carl_talk') },
    meds: [
      { id: '439-pca', name: 'Hydromorphone PCA', dose: '0.2 mg per dose', route: 'IV', freq: '10-min lockout, no basal', initStatus: 'given', givenNote: 'Running since 16:00' },
      {
        id: '439-nalox', name: 'Naloxone', dose: '0.04 mg titrated', route: 'IV', freq: 'Every 2 min for POSS 4 or RR < 8', prn: true, param: 'Dilute 0.4 mg in 10 mL; give 1 mL at a time',
        doses: [{ id: .04, label: '0.04 mg (1 mL of dilute), repeat every 2 min' }, { id: .4, label: '0.4 mg undiluted IV push' }],
        checks: (s, P, A) => { const v = A.vitals('439'); return [{ label: 'Sedation', value: `POSS ${poss(P)}`, ok: poss(P) >= 4 }, { label: 'RR', value: `${v.RR}`, ok: v.RR < 10 }]; },
        give(s, P, A, dose) {
          P.naloxAt = s.t; P.naloxDose = dose;
          if (P.crisis === null && poss(P) < 4 && A.vitals('439').RR >= 10) A.judge('439-nalox-early', 'meds', -1, 'You gave naloxone to a patient who was rousable and breathing adequately.', 'Naloxone is for POSS 4 or RR under 8. Before that, decrease or stop the opioid and stimulate.', '439');
          else if (dose === .4) A.judge('439-nalox', 'meds', -1, 'You pushed a full 0.4 mg of naloxone.', 'Dilute and titrate 0.04 mg at a time to breathing and arousal. A full push reverses all analgesia: severe pain, vomiting, a surge in heart rate and BP.', '439');
          else A.judge('439-nalox', 'meds', 2, 'You titrated dilute naloxone for Ms. Holloway.', 'Small doses reverse the sedation and keep some pain control. Watch her closely: naloxone wears off before hydromorphone does.', '439');
          P.op = Math.max(.8, P.op - (dose === .4 ? 4 : 1.8));
          return dose === .4 ? 'Naloxone 0.4 mg IV push. She bolts upright, gasping, clutching her incision, and vomits.' : 'Naloxone 0.04 mg, then another 0.04 two minutes later. She opens her eyes and takes a deep breath. RR 12.';
        },
      },
      { id: '439-apap', name: 'Acetaminophen', dose: '1 g', route: 'IV', freq: 'Every 6 h, scheduled', due: 60, checks: () => [{ label: 'Last dose', value: '18:00', ok: true }], give: () => 'Acetaminophen 1 g IV over 15 minutes. A non-opioid adds relief without sedation.' },
      { id: '439-ond', name: 'Ondansetron', dose: '4 mg', route: 'IV', freq: 'Every 6 h as needed, nausea', prn: true, checks: () => [{ label: 'Nausea', value: 'Mild', ok: true }], give: () => 'Ondansetron 4 mg IV given.' },
    ],
    talk: (s, P) => (P.icu ? null : poss(P) >= 3 ? 'renee_sleepy' : 'renee_awake'),
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('439');
        return [
          { id: 'poss', label: `Sedation POSS ${poss(P)}`, key: poss(P) >= 3, need: recent(s, P.k.possAt, 60), lock: 'Assess her sedation' },
          { id: 'rr', label: `RR ${v.RR}`, key: v.RR < 10, need: recent(s, v.t, 60), lock: 'Get fresh vitals' },
          { id: 'etco2', label: `EtCO₂ ${Math.round(38 + Math.max(0, P.op - 2) * 7)} mmHg`, key: P.op > 3.6, need: P.capno, lock: 'Start capnography' },
          { id: 'proxy', label: 'Husband pressing the PCA button while she sleeps', key: true, need: P.histSeen || P.carlTalked, lock: 'Check the pump history or talk to Carl' },
          { id: 'osa', label: 'Untreated sleep apnea, no CPAP', key: true, need: true },
          { id: 'spo2', label: `SpO₂ ${v.SpO2}%`, key: false, need: true },
          { id: 'kindle', label: 'Carl brought her e-reader', key: false, need: true },
        ];
      },
      respond(s, P, A, picked) {
        if (picked.includes('proxy') || (picked.includes('poss') && poss(P) >= 3)) {
          P.reported = true;
          A.judge('439-sbar', 'comm', 2, 'You reported Ms. Holloway\'s sedation and its cause.', 'Sedation score, breathing, sleep apnea and PCA by proxy together: the provider can fix the plan instead of just the number.', '439');
          return 'Stop the PCA for now. Naloxone 0.04 every two minutes if she\'s a POSS 4 or RR under 8. Capnography on, and make sure Carl understands only she presses that button. We\'ll switch to scheduled oral in the morning.';
        }
        if (picked.includes('spo2') && picked.length === 1) { A.judge('439-sbar-spo2', 'comm', -1, 'You reassured the provider with a normal sat.', 'Oxygen saturation is the last number to fall with opioid sedation. Sedation and respiratory rate come first.', '439'); return 'Sat\'s fine, so she\'s fine? How sedated is she? What\'s her rate?'; }
        return 'Keep checking her POSS every hour. Call me if she\'s a 3 or more.';
      },
    },
    scene: (s, P) => ({ iv: 'running', pca: !P.pcaStopped, foley: true, family: P.icu ? null : 'carl', familyLabel: 'Carl, her husband', o2: P.o2 ? 2 : 0, empty: P.icu, emptyText: 'Bed empty. Taken to the ICU after a respiratory arrest.', night: true }),
    clues: (s, P) => ({
      pca: P.pcaStopped ? 'PCA pump paused and locked.' : `PCA pump: hydromorphone 0.2 mg per press. The button cord is looped over the bed rail, closer to Carl's chair than to her hand.`,
      family: P.taught ? 'Carl, reading. His hands are in his lap now.' : 'Carl, in the chair by the bed, the PCA button in his hand. He presses it every time she stirs.',
      iv: 'LR at 100 mL/h, PCA on the same line.',
      foley: 'Foley draining clear yellow urine.',
      o2: P.o2 ? 'Nasal cannula at 2 L.' : 'Oxygen flowmeter on the headwall, off.',
    }),
    rig: (s, P) => ({ alert: poss(P) >= 4 ? 2 : poss(P) === 3 ? 1 : 0 }),
    status: (s, P) => (P.icu ? 'gone' : poss(P) >= 4 ? 'urgent' : poss(P) === 3 ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Respiratory arrest, ICU', text: 'Found apneic after hours of doses delivered while she slept. Her husband thought he was helping.' };
      if (P.crisis !== null) return { tone: 'mixed', title: 'Over-sedated, reversed', text: `She reached POSS 4 at ${clock(P.crisis)} and needed naloxone. The pump history showed the pattern long before.` };
      if (P.taught && poss(P) <= 2) return { tone: 'good', title: 'Comfortable and breathing', text: 'Carl learned that only Renee presses the button. She woke up sore, clear-headed and breathing well.' };
      if (poss(P) >= 3) return { tone: 'mixed', title: 'Heavily sedated at handoff', text: 'POSS 3 and drifting. The day nurse inherits a respiratory event in progress.' };
      return { tone: 'good', title: 'Stable', text: 'Sedation settled once the extra doses stopped.' };
    },
  };

  /* ---------- dialogs ---------- */
  const dialogs = {
    dot_confused: { who: '431', text: '"I have to go! Where\'s the bathroom? Why won\'t anybody let me go?" She pushes at the rail.', choices: [
      { label: 'You need the bathroom? Let me check your bladder, Mrs. Pruitt. I think I can help with that.', next: 'dot_a', fx: J('431-talk', 'comm', 1, 'You took Mrs. Pruitt\'s words literally.', 'Delirious patients often tell you exactly what\'s wrong. "I need the bathroom" plus no void since 17:00 is a clue, not noise.', '431') },
      { label: 'You don\'t need to go. Go back to sleep, it\'s the middle of the night.', next: 'dot_b', fx: J('431-talk', 'comm', -1, 'You dismissed what Mrs. Pruitt was telling you.', 'She was telling you the cause. Arguing with delirium also escalates it.', '431') },
      { label: 'Would you like something to help you sleep?', next: 'dot_c', fx: J('431-talk', 'judgment', -1, 'You offered Mrs. Pruitt a sleep aid for agitation.', 'Sleep aids in delirium, especially anticholinergics, usually make it worse. Look for the cause first.', '431') },
    ] },
    dot_a: { who: '431', text: 'She grips your wrist. "Yes. Please. It hurts down there."' },
    dot_b: { who: '431', text: '"Don\'t you tell me what I need!" She tries to swing a leg over the rail.' },
    dot_c: { who: '431', text: '"I don\'t want to sleep, I want the bathroom!"' },
    dot_calm: { who: '431', text: '"Eleven grandbabies, and every one of them thinks I\'m a pushover. They\'re right."' },
    dot_better: { who: '431', text: '"I don\'t know what got into me earlier. I feel like myself again. Is it still Tuesday?"' },
    walter_enox: { who: '433', text: '"Before you ask: no to the belly shots. Look at this." He lifts his gown: a quilt of bruises. "Three weeks of that. And the leg squeezers make me sweat."', choices: [
      { label: 'Those bruises look miserable. Can I tell you why the shots matter so much for you right now, and ask the doctor about other options? And can I look at that sore leg?', next: 'walter_a', fx: (s, A) => { s.p['433'].educated = true; A.judge('433-talk', 'comm', 2, 'You validated Mr. Brandt\'s refusal and engaged with it.', 'Refusals are information. Acknowledge the reason, explain the risk plainly, look for alternatives, and tell the provider. The leg ache was worth asking about.', '433'); } },
      { label: 'That\'s your right. I\'ll document that you refused.', next: 'walter_b', fx: J('433-talk', 'comm', -1, 'You accepted Mr. Brandt\'s refusal without exploring it.', 'Documenting a refusal is required, not sufficient. He hadn\'t heard why this mattered for a bed-bound cancer patient, and nobody told the provider.', '433') },
      { label: 'You really have to take them. Doctor\'s orders.', next: 'walter_b', fx: J('433-talk', 'comm', -1, 'You tried to pressure Mr. Brandt into his injections.', 'Pressure without explanation hardens a refusal. He has the right to decline; he also has the right to understand.', '433') },
    ] },
    walter_a: { who: '433', text: '"Cancer makes clots? Nobody told me that." He rubs his right calf. "This leg\'s been aching two days. Go ahead, take a look."' },
    walter_b: { who: '433', text: '"Good." He goes back to his crossword.' },
    walter_idle: { who: '433', text: '"Obstinate. Eight letters. I got it wrong on purpose to see if you\'d notice."' },
    walter_pe: { who: '433', text: '"Can\'t... get a breath. My chest. Something\'s wrong. Please."' },
    kaia_talk: { who: '435', text: '"Can I please eat something? And when does this thing come off? It beeps every time I roll over."', choices: [
      { label: 'Not quite yet. The drip is clearing the acid out of your blood, not just your sugar. Once your labs show that\'s done, you can eat and we\'ll switch you to your long-acting insulin.', next: 'kaia_a', fx: J('435-talk', 'comm', 1, 'You explained the DKA endpoint to Ms. Sorensen.', 'Patients push to eat and to get off the drip. Understanding why makes waiting easier.', '435') },
      { label: 'Your sugar\'s way better. I\'ll grab you some crackers.', next: 'kaia_b', fx: J('435-talk', 'judgment', -1, 'You offered food to a patient who was NPO with an open anion gap.', 'Glucose improving isn\'t DKA resolving. The order was NPO until the gap closed.', '435') },
    ] },
    kaia_a: { who: '435', text: '"Okay. Science. I respect it." She pulls the blanket up. "Wake me when I\'m not acidic."' },
    kaia_b: { who: '435', text: '"Oh my god, thank you." She tears into them.' },
    kaia_off: { who: '435', text: '"The doctor said my labs are good! Can you take the drip off now? I just want to sleep without the beeping."', choices: [
      { label: 'Almost. Your long-acting insulin takes about two hours to kick in, so the drip keeps running until then. If we stop it now, you could slide right back into DKA.', next: 'kaia_c', fx: (s, A) => { s.p['435'].askedOff = true; A.judge('435-talk-off', 'comm', 1, 'You explained the insulin overlap to Ms. Sorensen.', 'Knowing why the drip stays on for two hours is how patients (and nurses) avoid the most common DKA relapse.', '435'); } },
      { label: 'Sure, your labs are good. I\'ll stop it.', next: null, fx: (s, A) => { const P = s.p['435']; P.askedOff = true; P.dripOn = false; P.dripOffAt = s.t; A.judge('435-stop', 'meds', P.glarAt === null ? -3 : s.t - P.glarAt < 120 ? -2 : 2, P.glarAt === null ? 'You stopped the insulin infusion with no basal insulin on board.' : `You stopped the drip ${s.t - P.glarAt} minutes after the glargine.`, 'Subcutaneous glargine takes about 2 hours to start working. Stop the drip early and DKA comes back.', '435'); } },
    ] },
    kaia_c: { who: '435', text: '"Two more hours of beeping. Fine. For science."' },
    kaia_low: { who: '435', text: '"I feel shaky and weird. Sweaty. Is my sugar low?" Her hands are trembling.' },
    frank_chat: { who: '437', text: '"You ever grown a Cherokee Purple? Ugly as sin, best tomato you\'ll ever eat." He\'s grinning, words clear, both hands waving.' },
    frank_stroke: { who: '437', text: '"I\'m... fine. Jus\' tired." The right side of his mouth doesn\'t move. His right hand lies still on the blanket.' },
    renee_awake: { who: '439', text: '"Is Carl still here? Tell him to go home and sleep. He\'s been hovering all day."' },
    renee_sleepy: { who: '439', text: 'Her eyes open halfway. "Mm... so sleepy..." She\'s asleep again before she finishes.' },
    carl_talk: { who: 'carl', text: '"How\'s she doing? I\'ve been hitting her button whenever she moans. The nurse said it has a lockout, so it can\'t hurt her, right?"', choices: [
      { label: 'I\'m really glad you asked. Only Renee should press that button. The safety comes from her having to be awake to press it; if she\'s too sleepy, she stops. When someone else presses, that safety is gone.', next: 'carl_a', fx: (s, A) => { const P = s.p['439']; P.taught = true; P.carlTalked = true; A.judge('439-teach', 'comm', 2, 'You taught Carl about PCA by proxy.', 'PCA is safe because a sedated patient can\'t press the button. A loving family member pressing it removes that safety. It\'s one of the most preventable causes of opioid overdose in the hospital.', '439'); } },
      { label: 'Good idea. Keep her comfortable.', next: 'carl_b', fx: (s, A) => { s.p['439'].carlTalked = true; A.judge('439-proxy', 'safety', -2, 'You approved Carl pressing Renee\'s PCA.', 'PCA by proxy defeats the pump\'s safety: a sedated patient can\'t press, but a worried husband can.', '439'); } },
      { label: 'Only if she asks you to.', next: 'carl_c', fx: (s, A) => { s.p['439'].carlTalked = true; A.judge('439-proxy', 'comm', -1, 'You gave Carl a half-rule about the PCA.', 'She\'s moaning in her sleep; he\'ll hear that as asking. Only the patient presses. Full stop.', '439'); } },
    ] },
    carl_a: { who: 'carl', text: 'He looks at the button in his hand like it bit him. "Oh God. I\'ve pressed it... a lot." He sets it on the bed next to her hand.' },
    carl_b: { who: 'carl', text: '"Thanks. I just can\'t stand seeing her hurt." He presses it again.' },
    carl_c: { who: 'carl', text: '"Okay. She did kind of moan just now..." His thumb hovers.' },
    carl_after: { who: 'carl', text: '"I haven\'t touched it. She woke up and pressed it once herself. Is that okay?"' },
  };

  /* ---------- events ---------- */
  const A0 = (s) => Object.keys(s.p).every((id) => s.p[id].seenAt === null);
  const events = [
    { id: 'dee-hi', when: (s) => s.t >= 8, run(s, A) { A.msg({ from: 'dee', text: 'Hey, I\'m Dee, I\'ve got the hall with you. Heads up: staffing says they might float me to the ED around one.', replies: [{ label: 'Open tasks for Dee', act: 'delegate' }] }); } },
    { id: 'carl-tell', when: (s) => s.t >= 30 && !s.p['439'].taught, run(s, A) { A.msg({ from: 'dee', pid: '439', text: '439\'s husband asked me how often he\'s allowed to press her pain button. He said he\'s been doing it whenever she moans.', replies: [{ label: 'Go to 439', act: 'goto', pid: '439' }] }); } },
    { id: 'dot-restless', when: (s) => s.t >= 50 && s.p['431'].cathAt === null && dotAg(s, s.p['431']) > .5, run(s, A) { A.msg({ from: s.t < 120 ? 'dee' : 'nova', pid: '431', text: '431 keeps trying to get out of bed. She says she has to find the bathroom, but then she can\'t go. I can\'t get her to settle.', replies: [{ label: 'Go to 431', act: 'goto', pid: '431' }] }); } },
    { id: 'nova-idle', when: (s) => s.t >= 50 && s.t < 120 && A0(s), run(s, A) { A.msg({ from: 'nova', urgent: true, text: 'It\'s almost midnight and you haven\'t been in a single room. At night nobody calls to tell you something changed. Go look.' }); } },
    { id: 'stroke', when: (s) => s.t >= 95, run(s, A) { s.p['437'].onset = s.t; } },
    { id: 'dee-437', when: (s) => s.t >= 116 && stroke(s.p['437']) && s.p['437'].found === null, run(s, A) { A.msg({ from: 'dee', pid: '437', text: 'Before they pull me: 437\'s words were mushy when I did his vitals just now, and his right hand kept dropping the cup. He says he\'s fine.', replies: [{ label: 'Go to 437', act: 'goto', pid: '437' }] }); } },
    { id: 'dee-float', when: (s) => s.t >= 120, run(s, A) { A.msg({ from: 'dee', urgent: true, text: 'They just floated me to the ED. I\'m so sorry. You\'ve got the whole hall. Nova says she\'ll help when she can.' }); } },
    { id: 'k-recheck', when: (s) => s.t >= 120, run(s, A) { const P = s.p['435'], k = +P.K.toFixed(1); A.addLab('435', { name: 'Potassium', val: k, unit: 'mmol/L', ref: '3.5–5.0', flag: k < 3.5 ? 'L' : '' }); if (k < 3.3) { P.kLow = true; A.msg({ from: 'lab', pid: '435', urgent: true, text: `435 Sorensen potassium ${k.toFixed(1)}. DKA protocol: hold insulin for K under 3.3.`, replies: [{ label: 'Go to 435', act: 'goto', pid: '435' }] }); } else A.msg({ from: 'lab', pid: '435', text: `435 Sorensen BMP: potassium ${k.toFixed(1)}, anion gap 14. Closing.` }); } },
    { id: 'duplex', when: (s) => s.p['433'].duplexAt !== null && s.t >= s.p['433'].duplexAt + 35, run(s, A) { const P = s.p['433']; P.dvt = true; P.hepOrdered = true; A.addLab('433', { name: 'Venous duplex, right leg', val: 'Occlusive DVT, right popliteal and femoral veins', unit: '', ref: '', flag: 'A' }); A.msg({ from: 'us', pid: '433', text: 'Ultrasound: 433 Brandt has an occlusive DVT in the right popliteal and femoral veins. Heparin order is in.', replies: [{ label: 'Go to 433', act: 'goto', pid: '433' }] }); } },
    { id: 'pe', when: (s) => { const P = s.p['433']; return P.pe === null && !P.icu && ((s.t >= 150 && !(P.hepAt !== null && P.hepAt < 150)) || (P.early && s.t >= P.early)); }, run(s, A) { const P = s.p['433']; P.pe = s.t; P.callLight = true; A.msg({ from: 'nova', pid: '433', urgent: true, text: '433\'s call light. He says he can\'t breathe and his chest hurts. He looks gray.', replies: [{ label: 'Go to 433', act: 'goto', pid: '433' }] }); } },
    { id: 'pe-icu', when: (s) => { const P = s.p['433']; return P.pe !== null && !P.icu && peSev(s, P) >= 1.35; }, run(s, A) { const P = s.p['433']; P.icu = true; A.judge('433-icu', 'safety', -3, 'Mr. Brandt\'s PE progressed to shock before anyone escalated.', 'Sudden dyspnea, tachycardia and hypoxia in a high-risk patient needs oxygen and a rapid response in minutes, not after the next round.', '433'); A.msg({ from: 'nova', pid: '433', urgent: true, text: 'Rapid response in 433. BP 78 systolic, sat 81%. They\'re taking him to the ICU.' }); } },
    { id: 'pca-crisis', when: (s) => { const P = s.p['439']; return P.crisis === null && !P.icu && poss(P) >= 4; }, run(s, A) { const P = s.p['439']; P.crisis = s.t; P.callLight = true; P.op = Math.max(P.op, 4.7); A.msg({ from: 'carl', pid: '439', urgent: true, text: 'Call light 439. Carl: "She\'s snoring really weird and I can\'t wake her up. Please come."', replies: [{ label: 'Go to 439', act: 'goto', pid: '439' }] }); } },
    { id: 'pca-arrest', when: (s) => { const P = s.p['439']; return P.crisis !== null && !P.icu && s.t - P.crisis >= 25 && poss(P) >= 4; }, run(s, A) { const P = s.p['439']; P.icu = true; A.judge('439-arrest', 'safety', -3, 'Ms. Holloway stopped breathing from opioid over-sedation.', 'POSS 4 with a falling respiratory rate needs the opioid stopped and naloxone titrated now. The sedation had been building for hours.', '439'); A.msg({ from: 'nova', pid: '439', urgent: true, text: 'Code blue 439. Respiratory arrest. They bagged her and gave naloxone; she\'s going to the ICU.' }); } },
    { id: 'gap', when: (s) => { const P = s.p['435']; return !P.gapClosed && P.dripMin >= 170 && P.bg < 250 && s.t >= 175; }, run(s, A) { const P = s.p['435']; P.gapClosed = true; A.addLab('435', { name: 'Anion gap', val: 11, unit: 'mmol/L', ref: '8–12', flag: '' }); A.addLab('435', { name: 'Bicarbonate', val: 18, unit: 'mmol/L', ref: '22–28', flag: 'L' }); A.addOrder('435', 'Anion gap closed. Insulin glargine 20 units subQ now. Continue insulin infusion 2 h after glargine, then stop. Diet as tolerated.'); A.msg({ from: 'sato', pid: '435', text: '435\'s gap is closed. Give glargine 20 units now, keep the drip going for 2 hours after, then stop it. She can eat.', replies: [{ label: 'Go to 435', act: 'goto', pid: '435' }] }); } },
    { id: 'kaia-low', when: (s) => s.p['435'].bg < 70 && !s.p['435'].hypo, run(s, A) { s.p['435'].hypo = true; A.judge('435-hypo', 'judgment', -2, 'Ms. Sorensen went hypoglycemic on the insulin drip.', 'Glucose falls before the acid clears. That\'s why the protocol adds dextrose under 250 and checks every hour.', '435'); A.msg({ from: 'nova', pid: '435', urgent: true, text: '435 is sweaty and confused. Her sugar is 58 on the drip.', replies: [{ label: 'Go to 435', act: 'goto', pid: '435' }] }); } },
    { id: 'rebound', when: (s) => { const P = s.p['435']; return P.dripOffAt !== null && !P.rebound && (P.glarAt === null || P.dripOffAt - P.glarAt < 120) && s.t >= P.dripOffAt + 45; }, run(s, A) { const P = s.p['435']; P.rebound = true; A.addLab('435', { name: 'Anion gap', val: 19, unit: 'mmol/L', ref: '8–12', flag: 'H' }); A.msg({ from: 'lab', pid: '435', urgent: true, text: '435 Sorensen BMP: glucose 318, anion gap 19. The gap has reopened.', replies: [{ label: 'Go to 435', act: 'goto', pid: '435' }] }); } },
    { id: 'bg-late', when: (s) => { const P = s.p['435']; const last = P.bgs.length ? P.bgs[P.bgs.length - 1].t : -60; return P.dripOn && s.t - last > 85; }, run(s, A) { A.judge('435-bg-late', 'time', -1, 'Ms. Sorensen\'s hourly glucose checks slipped.', 'On an insulin infusion, the hourly glucose is the steering wheel. Miss one and you\'re driving blind.', '435'); A.msg({ from: 'nova', pid: '435', text: '435\'s glucose is overdue. She\'s on a drip.', replies: [{ label: 'Go to 435', act: 'goto', pid: '435' }] }); } },
    { id: 'ct', when: (s) => { const P = s.p['437']; return P.alert !== null && P.ct === null && s.t >= P.alert + 20; }, run(s, A) { const P = s.p['437']; P.ct = s.t; A.addLab('437', { name: 'CT head without contrast', val: 'No hemorrhage. No early ischemic changes.', unit: '', ref: '', flag: '' }); A.msg({ from: 'stroke', pid: '437', text: 'CT head on 437: no bleed.' }); } },
    { id: 'tpa-wait', when: (s) => { const P = s.p['437']; return P.ct !== null && P.eligible === null && (P.labeAt === null || P.bgAt === null) && s.t >= P.ct + 4; }, run(s, A) { A.msg({ from: 'stroke', pid: '437', urgent: true, text: 'We can\'t decide on alteplase for 437 yet. We need a glucose and a BP under 185/110.', replies: [{ label: 'Go to 437', act: 'goto', pid: '437' }] }); } },
    { id: 'tpa', when: (s) => { const P = s.p['437']; return P.ct !== null && P.eligible === null && P.labeAt !== null && P.bgAt !== null; }, run(s, A) { const P = s.p['437'], win = P.lastNormal + 270; P.eligible = s.t <= win; A.msg({ from: 'stroke', pid: '437', urgent: P.eligible, text: P.eligible ? `No bleed, BP under 185/110, glucose 132, last known well ${clock(P.lastNormal)}. He\'s inside the window. Start alteplase now.` : `Last known well was ${clock(P.lastNormal)}, more than 4.5 hours ago. He\'s outside the alteplase window. We\'re calling IR about thrombectomy.`, replies: P.eligible ? [{ label: 'Go to 437', act: 'goto', pid: '437' }] : null }); } },
    { id: 'nova-437', when: (s) => { const P = s.p['437']; return stroke(P) && P.found === null && s.t >= 175; }, run(s, A) { const P = s.p['437']; P.found = s.t; P.missed = true; A.judge('437-missed', 'assess', -3, 'Mr. Delgado\'s stroke went unnoticed for over an hour.', 'At night, patients don\'t call you when they have a stroke. Hourly rounding and scheduled neuro checks are how it gets found in time.', '437'); A.msg({ from: 'nova', pid: '437', urgent: true, text: 'I just walked past 437. His face is drooping and he can\'t lift his right arm. When did anyone last see him?', replies: [{ label: 'Go to 437', act: 'goto', pid: '437' }] }); } },
    { id: 'dot-fall', when: (s) => { const P = s.p['431']; return s.t >= 200 && !P.fell && dotAg(s, P) > 1.1 && !P.fallPrec && !P.sitter; }, run(s, A) { const P = s.p['431']; P.fell = true; A.judge('431-fell', 'safety', -3, 'Mrs. Pruitt fell trying to get to the bathroom.', 'Delirium, a fresh hip repair, no fall precautions, and a bladder no one checked. Every one of those was fixable.', '431'); A.msg({ from: 'nova', pid: '431', urgent: true, text: '431 is on the floor next to her bed. She was trying to get to the bathroom. She\'s crying about her hip.', replies: [{ label: 'Go to 431', act: 'goto', pid: '431' }] }); } },
    { id: 'nova-30', when: (s) => s.t >= 270, run(s, A) { A.msg({ from: 'nova', text: 'Half an hour to report. Go look at everyone one more time. At 4 a.m., the quiet ones are the ones to worry about.' }); } },
  ];

  /* ---------- delegation ---------- */
  const delegation = {
    note: (s) => (s.t >= 120 ? 'Dee was floated to the ED at 01:00. You\'re on your own for the rest of the night.' : 'Dee is with you until about 01:00, when she may be floated.'),
    tasks: [
      { id: 'vitals', label: 'Take a full set of vital signs', rooms: ['431', '433', '435', '437', '439'], mins: 12, avail: (s) => s.t < 120 },
      { id: 'bg', label: 'Check blood glucose', rooms: ['435', '437'], mins: 8, avail: (s) => s.t < 120 },
      { id: 'sit', label: 'Sit with her for a while', rooms: ['431'], mins: 20, avail: (s) => s.t < 120 },
      { id: 'turn', label: 'Turn and reposition', rooms: ['431', '433'], mins: 10, avail: (s) => s.t < 120 },
      { id: 'neuro', label: 'Do his neuro check', rooms: ['437'], mins: 0, avail: (s) => s.t < 120 },
      { id: 'pca', label: 'Press her PCA button if she wakes up in pain', rooms: ['439'], mins: 0, avail: (s) => s.t < 120 },
    ],
    start(task, pid, s, A) {
      const nm = A.def(pid).short;
      if (s.t >= 120) return 'Dee\'s phone goes to voicemail. She\'s in the ED now.';
      if (task.id === 'neuro') { A.judge('deleg-neuro', 'deleg', -1, 'You asked the CNA to do a neuro check.', 'Neurological assessment is RN work. A CNA can report what she notices; interpreting a neuro exam is yours.'); return 'Dee: "That\'s an assessment, that one\'s yours. I can get his vitals."'; }
      if (task.id === 'pca') { A.judge('deleg-pca', 'deleg', -2, 'You asked the CNA to press a patient\'s PCA button.', 'Nobody but the patient presses a PCA. That rule is the pump\'s whole safety system.'); return 'Dee: "No way. Only the patient presses that. You know that."'; }
      if (s.deleg.filter((d) => !d.done).length >= 2) return 'Dee: "I\'ve got two things going. Give me a few."';
      s.deleg.push({ id: task.id, pid, due: s.t + task.mins, done: false, at: s.t });
      if (task.id === 'vitals' || task.id === 'bg') A.judge('deleg-good-' + task.id, 'deleg', 1, `You delegated ${task.label.toLowerCase()} to the CNA.`, 'Before your help disappears at 01:00, use it on the routine work so you can assess.');
      if (task.id === 'sit') s.p['431'].calm.push({ t: s.t, amt: .9 });
      return `Dee: "On it: ${task.label.toLowerCase()} for ${nm}."`;
    },
    complete(d, s, A) {
      const nm = A.def(d.pid).short;
      if (d.id === 'vitals') { const v = A.recordVitals(d.pid, 'Dee (CNA)'); A.msg({ from: 'dee', pid: d.pid, text: `${nm}: T ${v.T.toFixed(1)}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}% ${v.O2 === 'Room air' ? 'on room air' : v.O2}.` + (d.pid === '439' && v.RR < 12 ? ' Her breathing looked slow to me.' : '') + (d.pid === '437' && stroke(s.p['437']) ? ' His words were mushy.' : '') }); }
      else if (d.id === 'bg') { if (d.pid === '435') { const P = s.p['435'], g = Math.round(P.bg); P.bgAt = s.t; P.lastBG = g; P.bgs.push({ t: s.t, val: g, by: 'Dee (CNA)' }); A.msg({ from: 'dee', pid: '435', text: `435's glucose is ${g}.` }); } else { s.p['437'].bgAt = s.t; A.msg({ from: 'dee', pid: '437', text: '437\'s glucose is 132.' }); } }
      else if (d.id === 'sit') A.msg({ from: 'dee', pid: '431', text: 'Sat with 431 for a bit. She calmed down some, but she keeps asking for the bathroom and then can\'t go.' });
      else if (d.id === 'turn') A.msg({ from: 'dee', pid: d.pid, text: `Turned ${nm}.` + (d.pid === '433' ? ' His right leg looked puffy to me.' : '') });
    },
  };

  /* ---------- Nova ---------- */
  function novaHint(s, A) {
    const D = s.p['431'], W = s.p['433'], K = s.p['435'], F = s.p['437'], R = s.p['439'];
    if (!R.icu && poss(R) >= 4) return 'Someone on a PCA won\'t wake up. What reverses the opioid, and how do you give it without taking away all her pain?';
    if (W.pe !== null && !W.rrt && !W.icu) return 'Sudden breathlessness, a racing heart and clear lungs in a man who\'s been refusing his clot shots. That\'s not anxiety.';
    if (stroke(F) && F.found === null) return 'Someone\'s face may have changed since the last time anyone looked. Who haven\'t you laid eyes on since midnight?';
    if (stroke(F) && F.alert === null) return 'Face, arm, speech. Who do you call, and what\'s the one time they\'ll ask you for?';
    if (F.alert !== null && F.eligible === null && (F.labeAt === null || F.bgAt === null)) return 'The stroke team is waiting on two things from you before they can decide. What are they?';
    if (K.kLow && !K.paused) return 'Insulin drives potassium into cells. What does the protocol say to do with a K under 3.3?';
    if (K.dripOn && K.bg < 250 && !K.dex) return 'Her sugar is dropping faster than her acid is clearing. What does the protocol add at 250?';
    if (K.glarAt !== null && K.dripOn && s.t - K.glarAt < 120) return 'She wants the drip off. How long does glargine take to start working?';
    if (D.cathAt === null && dotAg(s, D) > .5) return 'An 84-year-old who keeps saying she needs the bathroom. When did she last actually go?';
    if (!R.taught) return 'Ask Carl what he\'s been doing with that button.';
    if (!W.calfSeen) return 'Cancer, bed-bound, refusing his shots, and a leg that aches. Have you looked at his legs?';
    const unseen = A.c.patients.filter((d) => !s.p[d.id].icu && (s.p[d.id].seenAt === null || s.t - s.p[d.id].seenAt > 60)).map((d) => d.room);
    if (unseen.length) return `You haven't laid eyes on ${unseen.join(' and ')} in over an hour. At night, that's how things get missed.`;
    return 'You\'re on top of it. Now check the things you fixed. Did they stay fixed?';
  }

  function endChecks(s, A) {
    A.c.patients.forEach((d) => {
      const P = s.p[d.id];
      if (P.seenAt === null && !P.icu) A.judge(d.id + '-unseen', 'assess', -3, `You never went into ${d.room} this shift.`, 'At night nobody calls to tell you something changed. Every patient gets seen, early and again.', d.id);
      (d.meds || []).forEach((m) => {
        const st = s.meds[m.id];
        if (m.due !== undefined && !m.conditional && m.due <= Math.min(240, s.t - 60) && st.status === 'due' && !P.icu) A.judge(m.id + '-missed', 'meds', -2, `${m.name} for ${d.short} (due ${clock(m.due)}) was never given or held.`, 'Every scheduled dose needs a decision: give, or hold with a reason.', d.id);
      });
    });
    const D = s.p['431'], W = s.p['433'], K = s.p['435'], F = s.p['437'], R = s.p['439'];
    if (D.scanAt === null && s.t >= 90) A.judge('431-noscan', 'assess', -1, 'Mrs. Pruitt\'s bladder was never scanned.', 'No void since 17:00 and new confusion: the bladder scan was the first test to run.', '431');
    if (!W.reported && W.pe === null && W.hepAt === null) A.judge('433-norep', 'comm', -1, 'Mr. Brandt\'s refused prophylaxis never reached the provider.', 'Three refusals in a high-risk patient is a plan problem. The provider can offer alternatives only if they know.', '433');
    if (F.lastNormal > 0) A.judge('437-lkw', 'assess', 1, `Your check on Mr. Delgado at ${clock(F.lastNormal)} set his last-known-well time.`, 'A documented normal exam moves the stroke clock forward. That one look is what can keep the treatment window open.', '437');
    const gaps = []; let prev = -60; K.bgs.forEach((b) => { if (b.t >= 0) { gaps.push(b.t - prev); prev = b.t; } }); if (K.dripOn || K.dripOffAt !== null) gaps.push(Math.min(s.t, K.dripOffAt !== null ? K.dripOffAt : s.t) - prev);
    if (!K.hypo && gaps.length && Math.max(...gaps) <= 75) A.judge('435-hourly', 'time', 1, 'You kept Ms. Sorensen\'s glucose checks on schedule all night.', 'Hourly means hourly, even at 3 a.m.', '435');
    if (K.gapClosed && K.glarAt !== null && K.dripOn && !K.rebound) A.judge('435-overlap', 'meds', 1, 'You handed off Ms. Sorensen\'s drip mid-overlap instead of stopping it early.', 'The 2-hour overlap is the step most often cut short. Handing it off with a clear stop time is exactly right.', '435');
    const possChecks = Object.values(s.log).filter((l) => l.pid === '439' && /Sedation \(POSS\)|sedation \d/.test(l.text)).length;
    if (possChecks < 2 && !R.icu) A.judge('439-poss', 'assess', -1, 'Ms. Holloway\'s sedation was barely checked overnight.', 'On a PCA, sedation and respiratory rate every hour are the monitoring. The pulse ox alone isn\'t.', '439');
    const keys = []; A.c.patients.forEach((d) => (d.report || []).forEach((r, i) => { if (r.key) keys.push(d.id + ':' + i); }));
    const hit = keys.filter((k) => s.brain.includes(k)).length;
    if (s.brain.length) { const noise = s.brain.length - hit, precise = hit / s.brain.length;
      if (noise >= 4 && precise < .7) A.judge('brain', 'assess', -1, `You flagged ${s.brain.length} lines in report, ${noise} of them noise.`, 'Flagging everything is the same as flagging nothing.');
      else A.judge('brain', 'assess', hit / keys.length >= 0.6 && precise >= .7 ? 1 : 0, `You flagged ${hit} of ${keys.length} critical cues during handoff${noise ? `, plus ${noise} that didn\'t matter` : ''}.`, 'At night, report is most of what you know. Separating "does the crossword" from "refused his enoxaparin three nights" is the job.'); }
  }

  const PREP = { '431-oxy': ['pain'], '437-meto': ['vitals'], '437-labe': ['vitals'], '439-nalox': ['vitals'], '435-kcl': ['bg'] };
  [dot, walt, kaia, frank, renee].forEach((d) => d.meds.forEach((m) => { if (PREP[m.id]) m.prep = PREP[m.id]; }));

  S.engine.registerCase({
    id: 'medsurg-4w-3', title: 'Small hours', unit: '4 West, Medical-Surgical', level: 'Intermediate', start: 23 * 60, length: 300, novaCredits: 2,
    card: 'Night on 4 West. Five patients, fewer hands.',
    hero: { head: 'Five patients. One aide, until one o\'clock.', lede: 'Night shift on 4 West. The halls go quiet, the lights go down, and the things that go wrong at 2 a.m. go wrong quietly. Round like you mean it.' },
    intro: { time: '22:58', place: '4 West · Night shift', cta: 'Take report', beats: ['Five patients until 04:00. Most of them will be asleep.', 'Your aide gets floated to the ED at one. After that, it\'s you.', 'At night, nobody calls to tell you something changed. You have to go look.'] },
    minutes: 20,
    handoffBy: 'Jamal (evening RN)', reportBy: 'jamal', reportRole: 'evening shift', provider: 'sato', cna: 'dee',
    staff: {
      nova: { name: 'Nova Reyes', role: 'Charge nurse', look: { skin: '#B98A63', shade: '#976D4B', lip: '#7C4435', blush: '#C77B5E', iris: '#3D2A1C', head: { w: 55, h: 62, jaw: .35 }, eye: 10, hair: { style: 'bun', color: '#3A2E2A', streak: true }, brow: { w: 3.6, color: '#2E2421' }, body: { w: 80, cloth: 'navy' }, extras: ['studs'], smile: .35, tired: true } },
      dee: { name: 'Dee', role: 'CNA', look: { skin: '#8A5A3C', shade: '#6B4229', lip: '#5E3024', blush: '#B0604A', iris: '#2A1A10', head: { w: 55, h: 60, jaw: .35 }, eye: 10.2, hair: { style: 'bun', color: '#1A120E' }, brow: { w: 3.6, color: '#140E0B' }, body: { w: 82, cloth: 'wine' }, extras: ['hoops'], smile: .5 } },
      jamal: { name: 'Jamal', role: 'Evening RN', look: { skin: '#5C3A26', shade: '#452A1A', lip: '#48261B', blush: '#8E4E3C', iris: '#1F130D', head: { w: 57, h: 62, jaw: .6 }, eye: 9.8, hair: { style: 'buzz', color: '#15100D' }, brow: { w: 4.4, color: '#120D0A' }, body: { w: 86, cloth: 'navy' }, extras: ['goatee'], smile: .35, tired: true } },
      sato: { name: 'Dr. Sato', role: 'Night hospitalist', look: { skin: '#EFD0B0', shade: '#D2AE8C', lip: '#B86C60', blush: '#E8A08A', iris: '#241810', head: { w: 54, h: 62, jaw: .4 }, eye: 9.4, hair: { style: 'shag', color: '#141012' }, brow: { w: 3.8, color: '#141012' }, body: { w: 80, cloth: 'coat', steth: true }, extras: ['thinGlasses'], glasses: '#2F3438', smile: .15, tired: true } },
      carl: { name: 'Carl Holloway', role: 'Husband, 439', look: { skin: '#EAC7AB', shade: '#CFA88A', lip: '#A8645B', blush: '#E0947F', iris: '#4E6A82', head: { w: 60, h: 62, jaw: .6 }, eye: 9.6, hair: { style: 'short', color: '#6E5238' }, brow: { w: 4.6, color: '#5A412B' }, body: { w: 92, cloth: 'grey' }, extras: ['beard'], smile: .2, tired: true } },
      stroke: { name: 'Stroke team', role: 'Rapid response', look: null },
      us: { name: 'Ultrasound', role: 'Vascular lab', look: null },
      lab: { name: 'Lab', role: 'Laboratory', look: null },
    },
    patients: [dot, walt, kaia, frank, renee],
    dueExtras(s) {
      const out = [], K = s.p['435'], F = s.p['437'], R = s.p['439'];
      if (K.dripOn) { const last = K.bgs.length ? K.bgs[K.bgs.length - 1].t : -60; out.push({ t: last + 60, late: s.t > last + 75, text: '435 Glucose (hourly on insulin drip)' }); }
      if (K.dripOn && !K.dex && K.bg < 260) out.push({ t: s.t, late: false, text: '435 Check if glucose < 250: D5 ½NS per protocol' });
      if (F.lastNormal < 0 && !stroke(F)) out.push({ t: 60, late: s.t > 90, text: '437 Neuro check (every 4 h)' });
      const pl = R.k.possAt !== undefined ? R.k.possAt : -60; if (!R.icu) out.push({ t: pl + 60, late: s.t > pl + 75, text: '439 Sedation (POSS) and RR (hourly on PCA)' });
      return out;
    },
    replies: {},
    priority: {
      judge(r, A) {
        if (r[0] === '435') A.judge('rank-first', 'priority', 2, 'You chose to see Ms. Sorensen first.', 'An active insulin infusion with an hourly glucose and a potassium replacement due right now: time-bound, high-alert, and changing by the minute.', '435');
        else if (r[0] === '439') A.judge('rank-first', 'priority', 1, 'You chose to see Ms. Holloway first.', 'Reasonable: first night on a PCA with untreated sleep apnea. Ms. Sorensen\'s drip had checks due that very minute, though.', '439');
        else A.judge('rank-first', 'priority', -1, `You put ${A.def(r[0]).short} first, ahead of Ms. Sorensen's insulin drip.`, 'A high-alert infusion with a due glucose and a due potassium comes first; stable patients with risks come after.', '435');
      },
      correct: ['435', '439', '431', '437', '433'],
      why: {
        '435': 'Insulin infusion with an hourly glucose and a protocol potassium due at 23:00. High-alert drug, time-bound tasks.',
        '439': 'First post-op night on a PCA, opioid-naive, untreated sleep apnea, already sleepy, and a husband "asking about the pump."',
        '431': 'Sharp at 19:00, no void since the Foley came out at 17:00. An 84-year-old heading into her first night after hip surgery.',
        '437': 'Stable pneumonia, but AFib off anticoagulation and a neuro check due at midnight. Easy to skip; don\'t.',
        '433': 'Looks stable, but refused prophylaxis three nights and has a leg that aches. Assess his legs before the night gets busy.',
      },
    },
    events, delegation, dialogs, novaHint, endChecks,
    tick(s, A) {
      // 435: insulin, dextrose, potassium
      const K = s.p['435'];
      const running = K.dripOn && !K.paused;
      if (running) { K.dripMin += 1; K.bg += K.dex ? (175 - K.bg) * .03 : -1.0; K.K -= .0035; }
      else if (K.glarAt !== null && s.t - K.glarAt >= 120) K.bg += (160 - K.bg) * .02;
      else K.bg += .45;
      if (K.kclAt !== null && s.t - K.kclAt < 120) K.K += .006;
      if (K.kclLowAt !== null && s.t - K.kclLowAt < 240) K.K += .004;
      K.bg = clamp(K.bg, 35, 500); K.K = clamp(K.K, 2.6, 5.5);
      // 439: PCA by proxy
      const R = s.p['439'];
      if (!R.icu) {
        if (!R.pcaStopped && !R.taught && s.t % 12 === 6) { R.op += .55; R.presses.push(s.t); }
        else if (!R.pcaStopped && R.taught && s.t % 50 === 20 && R.op < 2.2) { R.op += .35; R.presses.push(s.t); }
        R.op = Math.max(R.crisis !== null && R.naloxAt === null ? 4.6 : .6, R.op - R.op * .008);
      }
    },
  });
})(window.Shift);
