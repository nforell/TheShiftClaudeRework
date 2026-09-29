/* Case: 5 South, Pediatrics, evening shift (15:00–20:00). Specialty.
   Themes: children compensate until they don't; weight-based everything; the family is part of the patient;
   and when a baby can't tell you what happened, the body can.
   Suspected abuse is handled at the level of recognition and reporting only: bruising in a non-mobile infant,
   objective documentation, a mandated report, and medical workup. */
(function (S) {
  const { clamp, clock } = S.engine;
  const jit = (s, seed) => ((Math.floor(s.t / 5) * 7 + seed * 13) % 3) - 1;
  const recent = (s, t0, m) => t0 !== null && t0 !== undefined && s.t - t0 <= m;
  const J = (key, dom, d, text, why, pid) => (s, A) => A.judge(key, dom, d, text, why, pid);
  const decay = (s, list, mins) => list.reduce((n, r) => { const d = s.t - r.t; return d >= 0 && d < mins ? n + r.amt * (1 - d / mins) : n; }, 0);
  const INFANT = { T: [36.1, 37.9], HR: [100, 160], RR: [30, 60], SBP: [70, 110], SpO2: [90, 101] };

  /* ---------- 501 Mateo Hernández: RSV bronchiolitis on high-flow ---------- */
  const mat = {
    id: '501', room: '501', name: 'Mateo Hernández', short: 'Mateo', age: '4 mo', sex: 'M', mrn: '01120334', legal: 'Interpreter: Spanish',
    norms: INFANT,
    look: { skin: '#D8A77F', shade: '#BC8A63', lip: '#B0655A', blush: '#E59A86', iris: '#2B1B10', head: { w: 60, h: 58, jaw: .05 }, eye: 11.6, small: .72,
      hair: { style: 'buzz', color: '#2A1B12' }, brow: { w: 2.2, color: '#5A4030' }, body: { w: 56, cloth: 'onesie2' }, extras: ['cannula'], smile: .5,
      lines: { calm: '(He coos around the cannula and grabs at your stethoscope.)', dys: '(Grunting with every breath. His head bobs; his belly sucks in under his ribs.)', drowsy: '(Asleep, breathing fast and shallow.)', anxious: '(Fussing, arching, working hard to breathe.)', none: '(Limp and gray. He doesn\'t respond.)' } },
    bio: 'Four months old, second child. His mother Lucía speaks Spanish; his sister Sofía, 11, is at the bedside after school.',
    dx: 'RSV bronchiolitis on high-flow', reason: 'RSV bronchiolitis, day 3 of illness, on heated high-flow nasal cannula',
    hx: ['Born at 36 weeks, no NICU stay', 'Weight 6.0 kg', 'Up to date on vaccines'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '6.0 kg',
    lines: ['High-flow nasal cannula 8 L/min, FiO₂ 40%', 'PIV 24g left foot, saline lock', 'Continuous pulse oximetry'], mobility: 'Held by family, crib', diet: 'Breast milk by bottle every 3 h',
    init: { work: 1.6, flow: 8, suctAt: null, fedAt: null, ng: false, pos: false, interp: false, taught: false, rrt: false, picuAt: null, icu: false, gone: false, score: null, aspirated: false },
    nightVitals: { T: 38.1, HR: 164, SBP: 88, DBP: 52, RR: 62, SpO2: 93, O2: 'HFNC 8 L 40%', pain: 0 },
    labs: [{ name: 'RSV PCR', val: 'Positive', unit: '', ref: '', flag: 'A', t: -3000 }, { name: 'Sodium', val: 138, unit: 'mmol/L', ref: '135–145', flag: '', t: -1600 }],
    orders: [
      { t: -3000, text: 'Heated high-flow nasal cannula, titrate 1–2 L/kg/min (max 12 L/min). FiO₂ to keep SpO₂ ≥ 90%.' },
      { t: -3000, text: 'Nasal suction before feeds and as needed. Bronchiolitis score every 4 h and with changes.' },
      { t: -3000, text: 'PO feeds every 3 h if RR ≤ 60. If RR > 60 or increased work of breathing: hold PO, give NG feeds or IV fluids.' },
      { t: -3000, text: 'Call PICU consult for escalating flow, FiO₂ > 50%, apnea, or worsening score.' },
    ],
    notes: [{ t: -60, author: 'Marcus, day RN', text: 'Working a little harder since lunch. Took 60 mL at 12:30, tired out halfway. Suctioned at 12:30, thick secretions. Mom at bedside, Spanish-speaking; daughter has been interpreting.' }],
    io: { intake: 'PO 240 mL today', output: '4 wet diapers' },
    report: [
      { text: 'Mateo Hernández, four months, RSV bronchiolitis, day three. Full code.', key: false },
      { text: 'He\'s on high-flow at 8 liters, 40%. Sats low 90s. He\'s working harder since lunch.', key: true },
      { text: 'He tired out halfway through his last bottle at 12:30. Next feed is due around 15:30.', key: true },
      { text: 'Suction him before feeds. The secretions are thick.', key: true },
      { text: 'Mom only speaks Spanish. His sister\'s been translating for her, she\'s great.', key: true },
      { text: 'He loves the mobile over the crib.', key: false },
    ],
    vitals(s, P) { const w = P.work; return { T: 38.1, HR: Math.round(150 + w * 9) + jit(s, 1) * 2, SBP: 88, DBP: 52, RR: Math.round(40 + w * 12) + jit(s, 2), SpO2: clamp(Math.round(98 - w * 2.6 + (P.flow - 8) * .6), 76, 99), O2: `HFNC ${P.flow} L 40%`, pain: 0 }; },
    assess: {
      general: (s, P) => (P.work > 2.4 ? 'Pale and tired, too busy breathing to cry. He barely looks at you.' : P.work > 1.9 ? 'Fussy and restless, breathing fast. He can\'t settle.' : 'Awake in the crib, fussy but consolable, breathing quickly.'),
      resp: (s, P, A) => { P.k.resp = s.t; const v = A.vitals('501'); return `RR ${v.RR}. ${P.work > 2.4 ? 'Nasal flaring, head bobbing, grunting. Deep subcostal and intercostal retractions.' : P.work > 1.9 ? 'Nasal flaring, subcostal and intercostal retractions.' : 'Mild subcostal retractions.'} Crackles and wheeze throughout. ${recent(s, P.suctAt, 45) ? 'Nose clear after suctioning.' : 'Thick secretions bubbling at both nostrils.'}`; },
      cardiac: (s, P, A) => `HR ${A.vitals('501').HR}, regular. Cap refill 2 seconds. Fontanelle soft and flat.`,
      neuro: (s, P) => (P.work > 2.4 ? 'Lethargic between breaths. Weak cry.' : 'Alert, fussy, consolable by mom.'),
      pain: () => 'FLACC 2: fussing, consolable. No signs of pain.',
      skin: () => 'Warm, pink centrally. Diaper area clean.',
      gi: (s, P) => { P.k.gi = s.t; return `Last bottle 12:30, took 60 of 120 mL. 4 wet diapers today. ${P.fedAt !== null ? 'Fed at ' + clock(P.fedAt) + '.' : 'Next feed due 15:30.'}`; },
    },
    interventions: [
      { id: 'suction', label: 'Nasal suction (bulb, then NP if needed)', cost: 3, run(s, P, A) { const again = recent(s, P.suctAt, 30); P.suctAt = s.t; P.work = Math.max(1.1, P.work - (again ? .1 : .5)); A.judge('501-suction', 'judgment', 1, 'You suctioned Mateo\'s nose.', 'Infants breathe through their noses. Clearing secretions, especially before a feed, is the single most effective bronchiolitis treatment on the unit.', '501'); return 'Thick yellow secretions from both nostrils. His breathing slows a little and he stops flaring.'; } },
      { id: 'score', label: 'Bronchiolitis respiratory score', cost: 3, run(s, P, A) { const sc = Math.round(3 + P.work * 2.6); P.score = sc; A.judge('501-score', 'assess', 1, 'You scored Mateo\'s work of breathing.', 'A structured score turns "looks worse" into a number the team can trend and act on.', '501'); return `Respiratory score ${sc} of 12 (${sc >= 9 ? 'severe' : sc >= 6 ? 'moderate' : 'mild'}). ${P.score && sc >= 9 ? 'Meets PICU consult criteria.' : ''}`.trim(); } },
      { id: 'pos', label: 'Position: head up, swaddled, calm and dim', cost: 2, avail: (s, P) => !P.pos, run(s, P) { P.pos = true; P.work = Math.max(1.1, P.work - .15); return 'Head of the crib up 30 degrees, swaddled, lights dimmed. He settles a little.'; } },
      { id: 'flow', label: 'Increase high-flow to 12 L/min (protocol max, 2 L/kg/min)', cost: 2, avail: (s, P) => P.flow < 12, run(s, P, A) { P.flow = 12; P.work = Math.max(1.1, P.work - .35); A.judge('501-flow', 'judgment', 1, 'You titrated Mateo\'s high-flow up per protocol.', 'High-flow works by flow: 2 L/kg/min for a 6 kg baby is 12 L. At the protocol max, the next step is the PICU.', '501'); return 'Flow up to 12 L/min. His sat rises two points.'; } },
      {
        id: 'feed', label: 'Give his bottle feed', cost: 6, avail: (s, P) => !P.ng,
        run(s, P, A) {
          P.fedAt = s.t; const rr = A.vitals('501').RR;
          if (rr > 60) { P.aspirated = true; P.work += .6; A.judge('501-feed', 'safety', -2, `You bottle-fed Mateo with a respiratory rate of ${rr}.`, 'Above 60 breaths a minute an infant can\'t coordinate suck, swallow and breathe. That\'s how babies aspirate. The order says hold PO over 60 and use the NG.', '501'); return 'He sucks, coughs, sputters, and turns dusky. Milk bubbles at his nose. His breathing gets worse.'; }
          if (recent(s, P.suctAt, 30)) A.judge('501-feed', 'judgment', 1, 'You suctioned before feeding Mateo.', 'Clear nose, then feed: he takes more and tires less.', '501');
          return 'He takes 90 mL, pausing to breathe.';
        },
      },
      { id: 'ng', label: 'Hold PO: give the feed by NG (order: RR > 60)', cost: 5, avail: (s, P) => !P.ng, run(s, P, A) { P.ng = true; P.fedAt = s.t; const rr = A.vitals('501').RR; A.judge('501-ng', 'safety', rr > 60 ? 2 : 0, rr > 60 ? 'You switched Mateo to NG feeds when his RR was over 60.' : 'You started NG feeds for Mateo.', rr > 60 ? 'Nutrition without the aspiration risk. The order spelled out the threshold; you used it.' : 'Allowed by the order, though his rate was under 60.', '501'); return 'NG placed and verified, 90 mL of breast milk over 30 minutes by pump.'; } },
    ],
    comms: [
      { id: 'rrt', label: 'Call the PICU team / rapid response', cost: 3, avail: (s, P) => !P.rrt && P.work > 1.7, run(s, P, A) { P.rrt = true; P.picuAt = s.t + 30; A.judge('501-rrt', 'judgment', P.work > 2.2 ? 2 : 1, 'You called the PICU team for Mateo.', 'Escalating flow, rising score and a tiring infant: babies with bronchiolitis get worse fast and apnea comes without warning. Early transfer is the safe move.', '501'); return 'The PICU fellow is at the crib in five minutes. "Good call. We\'ll take him upstairs for CPAP."'; } },
    ],
    family: { name: 'Lucía', rel: 'Mother', mode: 'bedside', cost: 4, dialog: (s, P) => (P.interp ? 'lucia_after' : 'lucia_talk') },
    meds: [
      { id: '501-apap', name: 'Acetaminophen', dose: '90 mg (15 mg/kg)', route: 'PO/NG', freq: 'Every 6 h as needed, fever', prn: true, checks: (s, P, A) => [{ label: 'Dose check', value: '15 mg/kg × 6.0 kg = 90 mg', ok: true }, { label: 'Temp', value: `${A.vitals('501').T}`, ok: true }], give: () => 'Acetaminophen 90 mg (2.8 mL of 160 mg/5 mL) given by syringe.' },
      { id: '501-ns', name: '3% saline nebulizer', dose: '4 mL', route: 'Inhaled', freq: 'Not ordered: bronchiolitis', prn: true, available: () => false, give: () => '' },
    ],
    talk: (s, P) => (P.icu || P.gone ? null : 'mateo_hold'),
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('501');
        return [
          { id: 'work', label: 'Increasing work of breathing: retractions, flaring, head bobbing', key: P.work > 1.9, need: recent(s, P.k.resp, 60), lock: 'Assess his breathing' },
          { id: 'vit', label: `RR ${v.RR}, HR ${v.HR}, SpO₂ ${v.SpO2}% on HFNC ${P.flow} L`, key: v.RR > 60 || v.SpO2 < 92, need: true },
          { id: 'score', label: P.score ? `Respiratory score ${P.score} of 12` : 'Respiratory score', key: (P.score || 0) >= 8, need: P.score !== null, lock: 'Score his work of breathing' },
          { id: 'feed', label: 'Tired out on his last bottle', key: true, need: true },
          { id: 'flow', label: P.flow >= 12 ? 'Already at max flow, 12 L/min' : 'On 8 L/min', key: P.flow >= 12, need: true },
          { id: 'mobile', label: 'Loves his mobile', key: false, need: true },
        ];
      },
      requests: [
        { id: 'picu', label: 'He\'s working harder on high-flow. Can the PICU evaluate him?' },
        { id: 'neb', label: 'Can we try an albuterol neb?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'neb') { A.judge('501-sbar-neb', 'judgment', -1, 'You asked for albuterol for bronchiolitis.', 'Bronchodilators don\'t help most infants with bronchiolitis. Supportive care is suction, oxygen, flow, hydration, and knowing when to escalate.', '501'); return 'Albuterol doesn\'t do much in bronchiolitis. What\'s his work of breathing doing?'; }
        if (req === 'picu' && (picked.includes('work') || picked.includes('score') || picked.includes('vit'))) { if (!P.rrt) { P.rrt = true; P.picuAt = s.t + 30; } A.judge('501-sbar', 'comm', 2, 'You escalated Mateo\'s breathing with the findings.', 'Rate, retractions, score and flow are what the PICU needs to say yes on the phone.', '501'); return 'That\'s a PICU kid. I\'m calling them now. Keep suctioning, NPO, and don\'t leave him.'; }
        return 'Keep suctioning and titrating the flow. Call me if he\'s worse.';
      },
    },
    scene: (s, P) => ({ crib: true, o2: P.flow, tele: true, iv: 'lock', family: P.gone || P.icu ? null : 'lucia', familyLabel: 'Lucía, his mother, with Sofía', tray: 'none', empty: P.gone || P.icu, emptyText: P.icu ? 'Crib empty. Taken to the PICU after an apnea spell.' : 'Crib empty. Moved to the PICU for CPAP.' }),
    clues: (s, P) => ({ crib: 'A mobile of felt clouds turns slowly over the crib. The rails are up.', o2: `Heated high-flow: ${P.flow} L/min, FiO₂ 40%. The humidifier chamber is full.`, family: P.interp ? 'Lucía, holding his foot, watching his chest. Sofía is doing homework.' : 'Lucía watches every breath. Sofía, 11, is translating what the last nurse said.' }),
    rig: (s, P) => ({ rr: P.work > 1.9 ? 70 : 58, anxious: clamp((P.work - 1.6) * .6, 0, .8), alert: P.work > 2.6 ? 1 : 0, lean: 0 }),
    status: (s, P) => (P.icu || P.gone ? 'gone' : P.work > 2.4 ? 'urgent' : P.work > 1.9 ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Apnea on the floor, then the PICU', text: 'He tired out and stopped breathing on the unit. The retractions, the rate and the failed feed were the warning.' };
      if (P.gone) return { tone: P.aspirated ? 'mixed' : 'good', title: 'Escalated to the PICU in time', text: 'Moved upstairs for CPAP before he tired out.' + (P.aspirated ? ' He did aspirate on a bottle first.' : '') };
      if (P.work < 1.9) return { tone: 'good', title: 'Breathing easier on the floor', text: 'Suction, flow and position kept him ahead of it.' + (P.interp ? ' Lucía knows the warning signs now.' : '') };
      return { tone: 'mixed', title: 'Still working hard at handoff', text: 'He\'s tiring on high-flow and no one has called the PICU.' };
    },
  };

  /* ---------- 503 Aaliyah Brooks: sickle cell crisis, acute chest brewing ---------- */
  const aalOnset = (P) => 100 + Math.min(2, P.isUses) * 20;
  const acs = (s, P) => P.acs !== null;
  const aalPain = (s, P) => clamp(Math.round(8 - decay(s, P.relief, 180) + (acs(s, P) ? 1 : 0)), 2, 10);
  const aal = {
    id: '503', room: '503', name: 'Aaliyah Brooks', short: 'Aaliyah', age: 15, sex: 'F', mrn: '01054478',
    norms: { T: [36.1, 37.9], HR: [60, 100], RR: [12, 20], SBP: [100, 135], SpO2: [95, 101] },
    look: { skin: '#6F4430', shade: '#553222', lip: '#56281E', blush: '#9A5040', iris: '#24150D', head: { w: 52, h: 60, jaw: .25 }, eye: 10.6, hair: { style: 'curls', color: '#17100B' }, brow: { w: 3.2, color: '#130C08' }, body: { w: 68, cloth: 'rose' }, extras: ['studs'], smile: .3, tired: true,
      lines: { calm: 'Can you turn the heat up in here? Cold makes it worse.', pain: 'It\'s in my back and my legs. It feels like my bones are breaking.', dys: 'My chest hurts when I breathe in.', anxious: 'Please don\'t let them say I\'m faking again.', drowsy: 'Mm. Tired.', none: 'She doesn\'t answer.' } },
    bio: 'Sophomore, plays clarinet in marching band. Hemoglobin SS. Eight admissions for pain crises. Mom works nights and calls at breaks.',
    dx: 'Sickle cell crisis, day 2', reason: 'Vaso-occlusive pain crisis, hemoglobin SS disease, admitted yesterday',
    hx: ['Sickle cell disease (HbSS), on hydroxyurea', 'One prior episode of acute chest syndrome, age 12', 'Asthma, mild'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '52 kg',
    lines: ['PIV 22g right forearm: D5 ½NS at 70 mL/h and morphine PCA'], mobility: 'Up with assist, encourage walking', diet: 'Regular',
    init: { relief: [{ t: -60, amt: 1 }], isUses: 0, acs: null, o2: false, reported: false, ketAt: null, morphAt: null, apapAt: null, icu: false, trusted: false, biased: false, cxr: false, abx: false },
    nightVitals: { T: 37.4, HR: 104, SBP: 118, DBP: 72, RR: 18, SpO2: 97, O2: 'Room air', pain: 7 },
    labs: [{ name: 'Hemoglobin', val: 7.4, unit: 'g/dL', ref: '12–16 (baseline 8.2)', flag: 'L', t: -600 }, { name: 'Reticulocytes', val: 9.8, unit: '%', ref: '0.5–2.5', flag: 'H', t: -600 }, { name: 'Creatinine', val: 0.5, unit: 'mg/dL', ref: '0.5–1.0', flag: '', t: -600 }],
    orders: [
      { t: -1500, text: 'Morphine PCA: 1 mg demand, 10-min lockout, basal 0.5 mg/h, 4-h limit 12 mg.' },
      { t: -1500, text: 'Morphine 2.5 mg IV (0.05 mg/kg) every 2 h as needed for breakthrough pain. Ketorolac 25 mg IV (0.5 mg/kg) every 6 h as needed. Acetaminophen 650 mg PO every 6 h scheduled.' },
      { t: -1500, text: 'Incentive spirometry 10 breaths every hour while awake. Keep SpO₂ ≥ 95%. Notify for fever ≥ 38.5, chest pain, new oxygen need.' },
    ],
    notes: [{ t: -80, author: 'Marcus, day RN', text: 'Pain 7/10, PCA use frequent. Asks for breakthrough doses often. Hasn\'t used the incentive spirometer much; says it hurts. Afebrile.' }],
    io: { intake: 'IV 1,400 mL, PO 400 mL', output: 'Voiding' },
    report: [
      { text: 'Aaliyah Brooks, 15, sickle cell, pain crisis, day two.', key: false },
      { text: 'Pain\'s a 7. She\'s on the morphine PCA and asks for breakthrough a lot.', key: true },
      { text: 'Honestly, some of the staff think she\'s a frequent flyer. She\'s been in eight times.', key: false },
      { text: 'She\'s barely touched her incentive spirometer. Says it hurts.', key: true },
      { text: 'She had acute chest once, when she was twelve.', key: true },
      { text: 'She plays clarinet in marching band.', key: false },
    ],
    vitals(s, P) { const a = acs(s, P), sev = a ? clamp((s.t - P.acs) / 60, 0, 1.5) : 0; return { T: a ? 38.7 : 37.4, HR: Math.round(98 + aalPain(s, P) * 1.5 + (a ? 14 : 0)) + jit(s, 3) * 2, SBP: 118 + jit(s, 4) * 2, DBP: 72, RR: a ? Math.round(24 + sev * 6) : 18, SpO2: a ? clamp(Math.round(93 - sev * 5 + (P.o2 ? 5 : 0)), 80, 99) : 97, O2: P.o2 ? '2 L NC' : 'Room air', pain: aalPain(s, P) }; },
    assess: {
      general: (s, P) => (acs(s, P) ? 'Hunched forward, taking small shallow breaths, holding her side.' : 'Curled on her side under two blankets, headphones in, face tight.'),
      resp: (s, P, A) => { P.k.resp = s.t; const v = A.vitals('503'); return acs(s, P) ? `RR ${v.RR}, shallow. Crackles at the right base, new since this morning. Sharp right-sided chest pain with deep breaths. SpO₂ ${v.SpO2}%.` : 'Clear but shallow; she won\'t take deep breaths because of back pain.'; },
      cardiac: (s, P, A) => `HR ${A.vitals('503').HR}, regular. Systolic flow murmur (known).`,
      neuro: () => 'Alert, oriented, tired. Answers in short sentences.',
      pain: (s, P) => `Pain ${aalPain(s, P)}/10: lower back and both thighs${acs(s, P) ? ', and now her right chest' : ''}. "Like my bones are breaking."`,
      skin: () => 'Warm. Scleral icterus, her baseline. No swelling.',
      gi: () => 'Eating a little. Voiding.',
    },
    interventions: [
      { id: 'is', label: 'Coach incentive spirometry: 10 breaths', cost: 4, run(s, P, A) { P.isUses += 1; if (P.isUses === 1) A.judge('503-is', 'safety', 1, 'You coached Aaliyah through her incentive spirometer.', 'In sickle cell pain crises, shallow breathing from pain sets up acute chest syndrome. Treating pain so she can breathe deep, and using the IS every hour, is prevention.', '503'); return acs(s, P) ? 'She manages 500 mL, wincing on the right.' : 'After a dose of pain medicine she reaches 1,250 mL. "Okay. That wasn\'t terrible."'; } },
      { id: 'warm', label: 'Warm pack, reposition, distraction', cost: 3, run(s, P) { P.relief.push({ t: s.t, amt: .7 }); return 'Heat pack on her back, pillow between her knees. She turns the music up.'; } },
      { id: 'o2', label: 'Oxygen 2 L nasal cannula (keep SpO₂ ≥ 95%)', cost: 1, avail: (s, P) => !P.o2, run(s, P) { P.o2 = true; return 'Cannula on. Her sat climbs.'; } },
    ],
    comms: [],
    meds: [
      { id: '503-pca', name: 'Morphine PCA', dose: '1 mg demand, 0.5 mg/h basal', route: 'IV', freq: '10-min lockout', initStatus: 'given', givenNote: 'Running since yesterday' },
      {
        id: '503-morph', name: 'Morphine (breakthrough)', dose: '2.5 mg (0.05 mg/kg)', route: 'IV', freq: 'Every 2 h as needed', prn: true,
        block: (s, P) => (P.morphAt !== null && s.t - P.morphAt < 120 ? 'Given at ' + clock(P.morphAt) + '.' : null),
        checks: (s, P) => [{ label: 'Pain', value: recent(s, P.k.painAt, 60) ? `${aalPain(s, P)}/10 at ${clock(P.k.painAt)}` : 'Not assessed in the last hour', ok: recent(s, P.k.painAt, 60) }, { label: 'Dose check', value: '0.05 mg/kg × 52 kg = 2.6 mg; 2.5 mg ordered', ok: true }, { label: 'Sedation', value: 'Awake, POSS 1', ok: true }],
        give(s, P, A) { P.morphAt = s.t; P.relief.push({ t: s.t, amt: 3 }); if (!recent(s, P.k.painAt, 60)) A.judge('503-morph', 'judgment', 1, 'You treated Aaliyah\'s breakthrough pain.', 'Assess first, then treat: her own pain score guides the dose and the reassessment.', '503'); else A.judge('503-morph', 'judgment', 2, 'You treated Aaliyah\'s breakthrough pain promptly.', 'Sickle cell pain is real, severe and undertreated, often because of bias. Believe the report, give the ordered dose, reassess in 30 minutes.', '503'); return 'Morphine 2.5 mg IV given. Twenty minutes later: "It\'s a 5. I can breathe."'; },
      },
      { id: '503-ket', name: 'Ketorolac', dose: '25 mg (0.5 mg/kg)', route: 'IV', freq: 'Every 6 h as needed', prn: true, block: (s, P) => (P.ketAt !== null ? 'Given at ' + clock(P.ketAt) + '.' : null), checks: () => [{ label: 'Kidneys', value: 'Creatinine 0.5', ok: true }, { label: 'Dose check', value: '0.5 mg/kg × 52 kg = 26 mg; 25 mg ordered', ok: true }], give(s, P, A) { P.ketAt = s.t; P.relief.push({ t: s.t, amt: 1.6 }); A.judge('503-ket', 'meds', 1, 'You added ketorolac for Aaliyah\'s pain.', 'Multimodal analgesia: an NSAID with the opioid treats the inflammation and lowers the opioid dose needed.', '503'); return 'Ketorolac 25 mg IV given.'; } },
      { id: '503-apap', name: 'Acetaminophen', dose: '650 mg', route: 'PO', freq: 'Every 6 h, scheduled', due: 60, checks: () => [{ label: 'Dose check', value: '12.5 mg/kg; adult dose, 52 kg', ok: true }], give(s, P) { P.apapAt = s.t; P.relief.push({ t: s.t, amt: .8 }); return 'Acetaminophen 650 mg taken.'; } },
      { id: '503-hu', name: 'Hydroxyurea', dose: '1,000 mg', route: 'PO', freq: 'Daily at 17:00', due: 120, checks: () => [{ label: 'Counts', value: 'ANC and platelets fine this morning', ok: true }], give: () => 'Hydroxyurea taken.' },
      { id: '503-abx', name: 'Ceftriaxone + azithromycin', dose: '2 g + 500 mg', route: 'IV', freq: 'Acute chest syndrome, now', prn: true, available: (s, P) => P.reported && acs(s, P), block: (s, P) => (P.abx ? 'Given.' : null), checks: () => [{ label: 'Cultures', value: 'Blood culture drawn first', ok: true }], give(s, P, A) { P.abx = true; A.judge('503-abx', 'meds', 1, 'Aaliyah\'s acute chest antibiotics went in promptly.', 'Infection is a common trigger of acute chest syndrome. Cultures, then antibiotics, without delay.', '503'); return 'Blood culture drawn, then ceftriaxone and azithromycin started.'; } },
    ],
    talk: (s, P) => (P.icu ? null : acs(s, P) ? 'aal_chest' : P.trusted ? 'aal_after' : 'aal_talk'),
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('503');
        return [
          { id: 'fever', label: `Fever ${v.T.toFixed(1)}`, key: v.T >= 38.5, need: acs(s, P) && v.t >= P.acs, lock: 'No fever recorded' },
          { id: 'chest', label: 'New right chest pain, crackles at the right base', key: true, need: acs(s, P) && recent(s, P.k.resp, 60), lock: 'Listen to her lungs' },
          { id: 'spo2', label: `SpO₂ ${v.SpO2}% on ${v.O2 === 'Room air' ? 'room air' : v.O2}`, key: v.SpO2 < 95, need: true },
          { id: 'is', label: 'Barely using her incentive spirometer', key: true, need: true },
          { id: 'hx', label: 'Prior acute chest syndrome at 12', key: true, need: true },
          { id: 'pain', label: `Pain ${aalPain(s, P)}/10 on PCA`, key: aalPain(s, P) >= 7, need: recent(s, P.k.painAt, 90), lock: 'Assess her pain' },
          { id: 'band', label: 'Plays clarinet', key: false, need: true },
        ];
      },
      requests: [
        { id: 'acs', label: 'I\'m worried about acute chest syndrome. Chest X-ray, cultures, antibiotics, and hematology?' },
        { id: 'pain', label: 'Her pain isn\'t controlled. Can we adjust the regimen?' },
        { id: 'seek', label: 'She keeps asking for more. I think she\'s drug-seeking.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'seek') { P.biased = true; A.judge('503-sbar-seek', 'judgment', -3, 'You called Aaliyah drug-seeking.', 'Patients with sickle cell disease are among the most undertreated and most stigmatized in the hospital. Asking for pain medicine during a crisis is not seeking; it\'s pain. The label follows her into every future admission.', '503'); return '"Drug-seeking" isn\'t an assessment. Chart her pain score and what you see, and treat it.'; }
        if (acs(s, P) && req === 'acs' && (picked.includes('chest') || picked.includes('fever') || picked.includes('spo2'))) {
          if (!P.reported) { P.reported = true; P.o2 = true; A.addOrder('503', 'Acute chest syndrome: CXR now, blood culture, ceftriaxone 2 g + azithromycin 500 mg IV, O₂ to ≥ 95%, type and screen for transfusion, hematology consult.'); }
          A.judge('503-sbar', 'comm', 2, 'You recognized and escalated Aaliyah\'s acute chest syndrome.', 'Fever, chest pain, new crackles and a falling sat in a child with sickle cell: acute chest is a leading cause of death in SCD. Found early, it\'s treatable on the floor.', '503');
          return 'That\'s acute chest until proven otherwise. X-ray, culture, antibiotics, oxygen, and I\'m calling heme about transfusion. Push the IS.';
        }
        if (req === 'pain') { A.judge('503-sbar-pain', 'comm', 1, 'You advocated for Aaliyah\'s pain control.', 'Uncontrolled pain means shallow breathing, which means acute chest risk. Pain control is part of the treatment.', '503'); A.addOrder('503', 'PCA demand dose increased to 1.5 mg. Continue ketorolac every 6 h.'); P.relief.push({ t: s.t, amt: 1.5 }); return 'Bump the PCA demand to 1.5 and keep the ketorolac going. Thanks for pushing.'; }
        return 'Keep an eye on her breathing and her pain.';
      },
    },
    scene: (s, P) => ({ iv: 'running', pca: true, o2: P.o2 ? 2 : 0, is: true, isUsed: P.isUses > 0, tablet: true, empty: P.icu, emptyText: 'Bed empty. Transferred to the PICU with acute chest syndrome.' }),
    clues: (s, P) => ({ is: P.isUses ? `Incentive spirometer, used ${P.isUses} time${P.isUses === 1 ? '' : 's'} this shift.` : 'Incentive spirometer, still in its wrapper.', pca: 'Morphine PCA, 1 mg demand. She\'s pressed it steadily; every press within the limit.', tablet: 'Her phone, open to a marching band group chat: "get better!! we need our clarinet 💜"' }),
    rig: (s, P) => ({ pain: aalPain(s, P), lean: acs(s, P) ? .35 : 0, anxious: acs(s, P) ? .4 : 0 }),
    status: (s, P) => (P.icu ? 'gone' : acs(s, P) && !P.reported ? 'urgent' : acs(s, P) || aalPain(s, P) >= 7 ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Acute chest syndrome, PICU', text: 'Fever, chest pain and a falling sat went unreported for an hour. She needed an exchange transfusion upstairs.' };
      if (acs(s, P) && P.reported) return { tone: P.biased ? 'mixed' : 'good', title: 'Acute chest, caught early', text: 'X-ray showed a new right lower lobe infiltrate. Antibiotics, oxygen and a simple transfusion on the floor.' + (P.biased ? ' She overheard "drug-seeking."' : '') };
      if (P.biased) return { tone: 'bad', title: 'Labeled drug-seeking', text: 'Her pain stayed high and the label went in her chart. Next time she\'ll wait longer to come in.' };
      if (aalPain(s, P) <= 5) return { tone: 'good', title: 'Pain controlled, breathing deep', text: 'Treated like a patient in pain, not a problem. She\'s using her IS.' };
      return { tone: 'mixed', title: 'Still hurting at handoff', text: 'Pain 7 or more all evening.' };
    },
  };

  /* ---------- 505 Leo Park: post-op, and a weight entered in the wrong units ---------- */
  const leoPain = (s, P) => clamp(Math.round(6 + (s.t > 90 ? .5 : 0) - decay(s, P.relief, 360)), 0, 10);
  const leo = {
    id: '505', room: '505', name: 'Leo Park', short: 'Leo', age: 3, sex: 'M', mrn: '01188205',
    norms: { T: [36.1, 38.2], HR: [80, 140], RR: [20, 30], SBP: [76, 115], SpO2: [94, 101] },
    look: { skin: '#F0CFB0', shade: '#D6AE8C', lip: '#C0736A', blush: '#F0A08C', iris: '#241810', head: { w: 58, h: 58, jaw: .1 }, eye: 11.2, small: .8,
      hair: { style: 'shag', color: '#141012' }, brow: { w: 2.8, color: '#1A1414' }, body: { w: 60, cloth: 'onesie' }, extras: [], smile: .5,
      lines: { calm: 'Where\'s my dinosaur? I need Rexy.', pain: 'Owie. My tummy. OWIE.', drowsy: '(Sleepy. His eyes won\'t stay open.)', anxious: 'Mommy! I want Mommy!', none: '(He doesn\'t wake up to his name.)' } },
    bio: 'Three years old, loves dinosaurs and trucks. Mom Min-ji hasn\'t left his side since the ED.',
    dx: 'Post-op day 0, perforated appendix', reason: 'Laparoscopic appendectomy for perforated appendicitis, back from surgery at 13:30',
    hx: ['No prior surgery', 'Weight per ED: 31 kg', 'Speech on track, potty training'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '31 kg (ED)',
    lines: ['PIV 22g left hand: D5NS at 70 mL/h', '3 laparoscopic incisions'], mobility: 'Up with parent as tolerated', diet: 'Clear liquids',
    init: { weighed: false, fixed: false, reported: false, relief: [], flacc: null, od: null, naloxAt: null, icu: false, cl: false, hinted: false, wrongApap: false },
    nightVitals: { T: 38.0, HR: 132, SBP: 98, DBP: 60, RR: 26, SpO2: 98, O2: 'Room air', pain: 5 },
    labs: [{ name: 'WBC', val: 19.2, unit: 'K/µL', ref: '5.5–15.5', flag: 'H', t: -900 }],
    orders: [
      { t: -120, text: 'Weight 31 kg (ED triage). All doses calculated from 31 kg.' },
      { t: -120, text: 'Morphine 3.1 mg IV (0.1 mg/kg) every 3 h as needed for moderate to severe pain. Acetaminophen 465 mg PO (15 mg/kg) every 6 h scheduled.' },
      { t: -120, text: 'Ceftriaxone 1,550 mg IV (50 mg/kg) daily at 18:00. Metronidazole per pharmacy. Clear liquids, advance as tolerated.' },
      { t: -120, text: 'FLACC pain score every 2 h and 30 min after analgesia.' },
    ],
    notes: [{ t: -60, author: 'Marcus, day RN', text: 'Back from PACU 13:30, sleepy, FLACC 3. Mom at bedside. Weight is from ED triage; he hasn\'t been weighed on the unit yet.' }],
    io: { intake: 'IV 280 mL', output: '1 wet pull-up' },
    report: [
      { text: 'Leo Park, three years old, lap appy for a perforated appendix. Back from the OR at 13:30.', key: false },
      { text: 'He was comfortable after PACU but he\'s starting to fuss. Morphine\'s ordered PRN.', key: true },
      { text: 'His weight\'s from the ED. We haven\'t weighed him up here yet.', key: true },
      { text: 'Acetaminophen is due at 16:00 and ceftriaxone at 18:00.', key: true },
      { text: 'Mom is amazing, she hasn\'t left.', key: false },
      { text: 'He only lets you touch him if you say hi to Rexy the dinosaur first.', key: false },
    ],
    vitals(s, P) { const od = P.od !== null && (P.naloxAt === null || P.naloxAt < P.od), sev = od ? clamp((s.t - P.od) / 25, 0, 1.4) : 0; const p = leoPain(s, P); return { T: 38.0, HR: Math.round(od ? 100 - sev * 14 : 118 + p * 4) + jit(s, 5) * 2, SBP: 98 + jit(s, 6) * 2, DBP: 60, RR: Math.round(od ? 20 - sev * 9 : 24 + p * .6), SpO2: od ? clamp(Math.round(96 - sev * 10), 78, 99) : 98, O2: 'Room air', pain: od ? 0 : p, poss: od ? (sev > .6 ? '4, minimal response' : '3, drifts off mid-sentence') : undefined }; },
    assess: {
      general: (s, P) => (P.od !== null && P.naloxAt === null ? 'Limp in his mom\'s lap, breathing slow, lips dusky. He doesn\'t lift his head.' : leoPain(s, P) >= 6 ? 'Curled up, legs drawn to his tummy, crying and pushing your hand away.' : 'Small for the bed, clutching a green dinosaur. He looks about average size for three.'),
      resp: (s, P, A) => { const v = A.vitals('505'); return `RR ${v.RR}${v.RR < 18 ? ', slow and shallow' : ''}. Clear. SpO₂ ${v.SpO2}%.`; },
      cardiac: (s, P, A) => `HR ${A.vitals('505').HR}, regular. Cap refill 2 seconds.`,
      neuro: (s, P) => (P.od !== null && P.naloxAt === null ? 'Rouses only to a sternal rub, then drifts off. Pinpoint pupils.' : 'Alert, clingy, talking in short sentences.'),
      pain: (s, P) => { P.k.painAt = s.t; return `FLACC ${leoPain(s, P)}: ${leoPain(s, P) >= 6 ? 'grimacing, legs drawn up, crying steadily, hard to console' : 'occasional grimace, consolable by mom'}.`; },
      skin: () => 'Three small incisions with glue, dry.',
      gi: () => 'Abdomen soft, appropriately tender. Sipping apple juice. One wet pull-up.',
    },
    interventions: [
      { id: 'weigh', label: 'Weigh him on the unit scale', cost: 3, run(s, P, A) { P.weighed = true; A.judge('505-weigh', 'assess', 2, 'You weighed Leo before giving weight-based medications.', 'His ED weight was 31: pounds, entered as kilograms. 31 lb is 14.1 kg. Every weight-based order was 2.2 times too high. Weighing on admission to the unit is how this gets caught.', '505'); return 'Leo weighs 14.1 kg on the unit scale. The chart says 31 kg. 31 pounds is 14.1 kilograms.'; } },
      { id: 'flacc', label: 'FLACC pain score', cost: 2, run(s, P, A) { P.k.painAt = s.t; P.flacc = leoPain(s, P); return `FLACC ${P.flacc} of 10 (face, legs, activity, cry, consolability).`; } },
      { id: 'cl', label: 'Call child life: distraction with bubbles and a tablet', cost: 1, avail: (s, P) => !P.cl, run(s, P, A) { P.cl = true; P.relief.push({ t: s.t, amt: 1.2 }); A.judge('505-cl', 'judgment', 1, 'You brought in child life for Leo.', 'For a three-year-old, distraction and a familiar person reduce pain and fear as much as a dose of medicine, and make the medicine work better.', '505'); return 'Bree from child life arrives with bubbles. Leo stops crying to pop them.'; } },
    ],
    comms: [],
    family: { name: 'Min-ji', rel: 'Mother', mode: 'bedside', cost: 3, dialog: (s, P) => (!P.hinted ? 'minji_talk' : P.fixed ? 'minji_after' : 'minji_b') },
    meds: [
      {
        id: '505-morph', name: 'Morphine', dose: '3.1 mg (0.1 mg/kg × 31 kg)', route: 'IV', freq: 'Every 3 h as needed', prn: true, available: (s, P) => !P.fixed,
        block: (s, P) => (P.od !== null ? 'Given at ' + clock(P.od) + '.' : null),
        checks: (s, P) => [{ label: 'Ordered for', value: 'Weight 31 kg (ED)', ok: P.weighed ? false : null }, { label: 'Typical 3-year-old', value: 'About 14 kg', ok: false }, P.weighed ? { label: 'Unit weight', value: '14.1 kg: this dose is 0.22 mg/kg, 2.2 times too high', ok: false } : { label: 'Unit weight', value: 'Not weighed yet', ok: null }],
        give(s, P, A) { P.od = s.t; A.judge('505-morph-od', 'meds', -3, 'You gave Leo a morphine dose calculated from the wrong weight.', 'The chart said 31 kg; he weighs 14.1. That was 0.22 mg/kg of morphine, more than double. In children, dose checks start with a weight you trust. A 3-year-old who "weighs 31 kg" should make you stop.', '505'); return 'Morphine 3.1 mg IV given.'; },
      },
      { id: '505-apap', name: 'Acetaminophen', dose: '465 mg (15 mg/kg × 31 kg)', route: 'PO', freq: 'Every 6 h, scheduled', due: 60, available: (s, P) => !P.fixed || s.meds['505-apap'].status !== 'due',
        checks: (s, P) => [{ label: 'Ordered for', value: 'Weight 31 kg (ED)', ok: P.weighed ? false : null }, P.weighed ? { label: 'Unit weight', value: '14.1 kg: 465 mg is 33 mg/kg', ok: false } : { label: 'Unit weight', value: 'Not weighed yet', ok: null }],
        give(s, P, A) { P.wrongApap = true; A.judge('505-apap-od', 'meds', -2, 'You gave Leo acetaminophen dosed for the wrong weight.', '465 mg for a 14 kg child is 33 mg/kg per dose. Four doses would be 132 mg/kg/day, far over the 75 mg/kg/day maximum. Verify the weight before any weight-based dose.', '505'); P.relief.push({ t: s.t, amt: 1 }); return 'Acetaminophen 465 mg given.'; },
        hold(s, P, A, r) { A.judge('505-apap-hold', 'meds', P.weighed ? 2 : 1, 'You held Leo\'s acetaminophen to clarify the dose.', P.weighed ? 'Held because the dose didn\'t match his real weight. Now call so he gets the right dose, not no dose.' : 'Holding is safer than guessing. Weigh him and call.', '505'); return 'Held: dose doesn\'t match his weight.'; } },
      { id: '505-cef', name: 'Ceftriaxone', dose: '1,550 mg (50 mg/kg × 31 kg)', route: 'IV', freq: 'Daily at 18:00', due: 180, available: (s, P) => !P.fixed || s.meds['505-cef'].status !== 'due', checks: (s, P) => [{ label: 'Ordered for', value: 'Weight 31 kg (ED)', ok: P.weighed ? false : null }], give(s, P, A) { A.judge('505-cef-od', 'meds', -1, 'You gave Leo ceftriaxone dosed for the wrong weight.', 'Antibiotics have wider margins, but a dose built on a wrong weight is still an error. Clarify first.', '505'); return 'Ceftriaxone 1,550 mg IV given.'; }, hold(s, P, A) { A.judge('505-cef-hold', 'meds', 1, 'You held Leo\'s ceftriaxone to fix the weight.', 'Right drug, wrong dose is still the wrong order.', '505'); return 'Held.'; } },
      { id: '505-cef2', name: 'Ceftriaxone (corrected)', dose: '700 mg (50 mg/kg × 14.1 kg)', route: 'IV', freq: 'Daily at 18:00', due: 180, conditional: true, available: (s, P) => P.fixed, checks: () => [{ label: 'Dose check', value: '50 mg/kg × 14.1 kg = 705 mg', ok: true }], give(s, P, A) { A.judge('505-cef2', 'meds', 1, 'Leo\'s antibiotic went in at the corrected dose.', 'A perforated appendix needs its antibiotics on time, at a dose built on a real weight.', '505'); return 'Ceftriaxone 700 mg IV over 30 minutes.'; } },
      { id: '505-morph2', name: 'Morphine (corrected)', dose: '1.4 mg (0.1 mg/kg × 14.1 kg)', route: 'IV', freq: 'Every 3 h as needed', prn: true, available: (s, P) => P.fixed, block: (s, P) => (P.m2At && s.t - P.m2At < 180 ? 'Given at ' + clock(P.m2At) + '.' : null), checks: (s, P) => [{ label: 'Dose check', value: '0.1 mg/kg × 14.1 kg = 1.4 mg', ok: true }, { label: 'Pain', value: recent(s, P.k.painAt, 60) ? `FLACC ${leoPain(s, P)}` : 'Not scored in the last hour', ok: recent(s, P.k.painAt, 60) }], give(s, P, A) { P.m2At = s.t; P.relief.push({ t: s.t, amt: 3.5 }); A.judge('505-morph2', 'meds', 2, 'You gave Leo the right morphine dose for his real weight.', 'Weight verified, dose recalculated, pain scored: he gets relief without the risk.', '505'); return 'Morphine 1.4 mg IV given. Twenty minutes later he\'s asleep on his mom, breathing easy.'; } },
      { id: '505-apap2', name: 'Acetaminophen (corrected)', dose: '210 mg (15 mg/kg × 14.1 kg)', route: 'PO', freq: 'Every 6 h', prn: true, available: (s, P) => P.fixed, block: (s, P) => (P.a2At ? 'Given at ' + clock(P.a2At) + '.' : null), checks: () => [{ label: 'Dose check', value: '15 mg/kg × 14.1 kg = 211 mg', ok: true }], give(s, P, A) { P.a2At = s.t; P.relief.push({ t: s.t, amt: 1.3 }); A.judge('505-apap2', 'meds', 1, 'You gave Leo acetaminophen at the corrected dose.', 'A scheduled non-opioid lowers the opioid he needs.', '505'); return 'Acetaminophen 210 mg (6.6 mL) given with juice.'; } },
      { id: '505-nalox', name: 'Naloxone', dose: '0.02 mg (≈ 1.5 mcg/kg), repeat every 2 min to effect', route: 'IV', freq: 'For opioid respiratory depression', prn: true, available: (s, P) => P.od !== null, block: (s, P) => (P.naloxAt !== null ? 'Given at ' + clock(P.naloxAt) + '.' : null), checks: (s, P, A) => { const v = A.vitals('505'); return [{ label: 'RR', value: `${v.RR}`, ok: v.RR < 16 }, { label: 'Sedation', value: v.poss || 'Awake', ok: !!v.poss }]; }, give(s, P, A) { P.naloxAt = s.t; A.judge('505-nalox', 'meds', 1, 'You reversed Leo\'s opioid oversedation.', 'Stimulate and give oxygen first; titrate naloxone to breathing, not to full reversal of his pain. It wears off before morphine does: stay with him, recheck every 15 minutes, and report the dosing error.', '505'); return 'Naloxone 0.02 mg IV, repeated once. He rouses and whimpers for his mom. RR 22, SpO₂ 95%.'; } },
    ],
    talk: (s, P) => (P.icu ? null : 'leo_talk'),
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('505');
        return [
          { id: 'wt', label: 'Unit weight 14.1 kg; orders are based on 31 kg (31 lb entered as kg)', key: true, need: P.weighed, lock: 'Weigh him' },
          { id: 'pain', label: `FLACC ${leoPain(s, P)}`, key: leoPain(s, P) >= 5, need: recent(s, P.k.painAt, 90), lock: 'Score his pain' },
          { id: 'od', label: `Oversedated after morphine 3.1 mg: RR ${v.RR}, SpO₂ ${v.SpO2}%`, key: true, need: P.od !== null, lock: 'No sedation' },
          { id: 'post', label: 'Post-op day 0, perforated appendix', key: false, need: true },
          { id: 'rexy', label: 'Has a dinosaur named Rexy', key: false, need: true },
        ];
      },
      requests: [
        { id: 'fix', label: 'His orders are based on the wrong weight. Can you re-order everything for 14.1 kg?' },
        { id: 'pain', label: 'He\'s in pain. Can I give the morphine?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (picked.includes('wt') && req === 'fix') {
          if (!P.fixed) { P.fixed = true; P.reported = true; A.addOrder('505', 'CORRECTED for weight 14.1 kg: morphine 1.4 mg IV every 3 h PRN, acetaminophen 210 mg PO every 6 h, ceftriaxone 700 mg IV daily at 18:00, naloxone 0.02 mg IV PRN respiratory depression. D5NS decreased to 48 mL/h (maintenance for 14.1 kg). Metronidazole recalculated for 14.1 kg. Previous weight-based orders discontinued. Safety report filed.'); }
          A.judge('505-sbar', 'comm', 2, 'You got Leo\'s orders corrected for his real weight.', 'A wrong weight makes every order wrong. Catching it once, at the source, fixes all of them.', '505');
          return 'Oh no. 31 pounds. Thank you. I\'m discontinuing everything and re-ordering for 14.1. I\'ll file the safety report.';
        }
        if (req === 'pain' && !P.weighed) { A.judge('505-sbar-pain', 'meds', -1, 'You asked to give Leo morphine without checking his weight.', 'In pediatrics every dose rides on the weight. A 3-year-old listed at 31 kg deserves a second look before a narcotic.', '505'); return 'Go ahead, it\'s ordered. What does he weigh, by the way?'; }
        if (picked.includes('od')) { P.reported = true; return 'Naloxone now, stay with him, and I\'m coming. What does he actually weigh?'; }
        return 'Okay. FLACC him again in an hour.';
      },
    },
    scene: (s, P) => ({ crib: false, iv: 'running', family: P.icu ? null : 'minji', familyLabel: 'Min-ji, his mother', tablet: P.cl, tray: 'none', dino: true, empty: P.icu, emptyText: 'Bed empty. Moved to the PICU after respiratory depression.' }),
    clues: (s, P) => ({ dino: 'A green plush T. rex named Rexy. The tag has "LEO P." written in marker.', family: 'Min-ji, his mother, with a bag of his clothes: size 3T.', iv: 'D5NS at 70 mL/h. The pump\'s patient weight field reads 31 kg.' }),
    rig: (s, P) => { const od = P.od !== null && P.naloxAt === null; return od ? { alert: s.t - P.od > 12 ? 2 : 1 } : { pain: leoPain(s, P) }; },
    status: (s, P) => (P.icu ? 'gone' : P.od !== null && P.naloxAt === null ? 'urgent' : leoPain(s, P) >= 6 ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Oversedated from a dosing error', text: 'Morphine dosed for 31 kg in a 14 kg child. He needed naloxone and a night in the PICU. The weight field had said 31 since the ED.' };
      if (P.od !== null) return { tone: 'mixed', title: 'Oversedated, reversed', text: 'Naloxone brought him back. The dose came from a weight nobody checked.' };
      if (P.fixed && leoPain(s, P) <= 4) return { tone: 'good', title: 'Right weight, right dose, comfortable', text: 'You caught the pounds-for-kilograms error before any drug went in.' + (P.cl ? ' Bubbles helped too.' : '') };
      if (P.fixed) return { tone: 'mixed', title: 'Orders fixed, pain still high', text: 'The weight was corrected but he spent the evening hurting.' };
      if (P.wrongApap) return { tone: 'mixed', title: 'Overdosed on acetaminophen', text: 'One dose at 33 mg/kg. Nobody weighed him.' };
      return { tone: 'mixed', title: 'Wrong weight still in the chart', text: 'Every order is 2.2 times too high, waiting for the next nurse.' };
    },
  };

  /* ---------- 507 Noah Whitfield: a fussy baby whose body tells a different story ---------- */
  const headSev = (s, P) => (P.ct !== null ? 0 : clamp((s.t - 60) / 110, 0, 1.2));
  const noah = {
    id: '507', room: '507', name: 'Noah Whitfield', short: 'Noah', age: '4 mo', sex: 'M', mrn: '01193310',
    norms: INFANT,
    look: { skin: '#F1D2B8', shade: '#D8B498', lip: '#C47A70', blush: '#F2A594', iris: '#4C6A84', head: { w: 60, h: 58, jaw: .05 }, eye: 11.6, small: .72,
      hair: { style: 'buzz', color: '#B08A5A' }, brow: { w: 2, color: '#C0A078' }, body: { w: 56, cloth: 'onesie' }, extras: [], smile: .2,
      lines: { calm: '(He blinks at the light, quiet.)', pain: '(A high-pitched, inconsolable cry.)', anxious: '(Irritable. Stiffens when you pick him up.)', drowsy: '(Very sleepy. Hard to wake for a feed.)', none: '(Limp. He doesn\'t respond.)' } },
    bio: 'Four months old, first baby. Dad Travis is at the bedside; mom is at work until 19:00.',
    dx: 'Vomiting and fussiness, rule out gastroenteritis', reason: 'Vomiting x3, fussiness and poor feeding since yesterday. Working diagnosis: viral gastroenteritis.',
    hx: ['Term baby, no problems at birth', 'Not rolling over yet', 'Weight 6.2 kg'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '6.2 kg',
    lines: ['PIV 24g right hand: D5NS at 25 mL/h'], mobility: 'Crib', diet: 'Formula 4 oz every 3 h, as tolerated',
    init: { bruises: false, font: false, hc: false, documented: false, reported: false, sw: false, cps: false, confronted: false, dismissed: false, quote: false, observed: false, ct: null, icu: false, gone: false, ondAt: null },
    nightVitals: { T: 37.2, HR: 148, SBP: 86, DBP: 50, RR: 38, SpO2: 99, O2: 'Room air', pain: 0 },
    labs: [{ name: 'Glucose', val: 88, unit: 'mg/dL', ref: '60–100', flag: '', t: -240 }, { name: 'Urinalysis', val: 'Negative', unit: '', ref: '', flag: '', t: -240 }],
    orders: [
      { t: -250, text: 'Admit for vomiting and poor feeding. IV fluids at maintenance. Strict I&O, daily weight.' },
      { t: -250, text: 'Ondansetron 0.6 mg IV (0.1 mg/kg) every 8 h as needed for vomiting (off-label under 6 months; pharmacy verified).' },
      { t: -250, text: 'Notify provider for lethargy, bilious vomiting, or any change in neuro status.' },
    ],
    notes: [{ t: -60, author: 'Marcus, day RN', text: 'Fussy all day, hard to console, vomited again at 13:00 (non-bilious). Took 1 oz. Dad at bedside, says he\'s "just a cranky baby." Haven\'t done a full skin check; he screams when undressed.' }],
    io: { intake: 'Formula 2 oz, IV 150 mL', output: '2 wet diapers, emesis x1' },
    report: [
      { text: 'Noah Whitfield, four months, admitted for vomiting and fussiness. Probably a stomach bug.', key: false },
      { text: 'He\'s been really hard to console. High-pitched crying. He only took an ounce.', key: true },
      { text: 'He threw up again at one.', key: true },
      { text: 'Dad\'s here. Mom\'s at work. Dad says he\'s just a cranky baby.', key: false },
      { text: 'I didn\'t get a full skin check; he screams when you undress him.', key: true },
      { text: 'He\'s a cutie. Big blue eyes.', key: false },
    ],
    vitals(s, P) { const h = headSev(s, P); return { T: 37.2, HR: Math.round(148 - h * 36) + jit(s, 7) * 2, SBP: Math.round(86 + h * 14), DBP: 50, RR: Math.round(38 - h * 8), SpO2: 99, O2: 'Room air', pain: 0 }; },
    assess: {
      general: (s, P) => { const h = headSev(s, P); return h > .8 ? 'Very sleepy, hard to wake. When he does, he cries weakly, then drifts off.' : h > .4 ? 'Irritable, then oddly quiet. Stiffens when you lift him.' : 'Fussing in the crib, a high-pitched cry that doesn\'t settle when Dad picks him up.'; },
      resp: () => 'Clear. Unlabored.',
      cardiac: (s, P, A) => `HR ${A.vitals('507').HR}, regular. Cap refill under 2 seconds.`,
      neuro: (s, P) => { P.font = true; P.k.neuro = s.t; const h = headSev(s, P); return `Anterior fontanelle full and slightly bulging, even when he\'s calm. ${h > .8 ? 'Lethargic; pupils equal but sluggish.' : 'Irritable, high-pitched cry, hard to console.'} Head circumference not measured this admission.`; },
      pain: () => 'FLACC 5: inconsolable crying, tense.',
      skin: (s, P) => { P.bruises = true; P.k.skin = s.t; return 'With Dad\'s help you undress him fully. A bruise on the rim of his left ear. Two small round bruises, about 1 cm each, on the left side of his chest. He isn\'t rolling or crawling yet.'; },
      gi: () => 'Abdomen soft, not distended. Vomiting is non-bilious. 2 wet diapers today.',
    },
    interventions: [
      { id: 'hc', label: 'Measure head circumference', cost: 2, avail: (s, P) => !P.hc, run(s, P, A) { P.hc = true; A.judge('507-hc', 'assess', 1, 'You measured Noah\'s head circumference.', 'A full fontanelle and a head measuring above his growth curve both point inside the skull, not at the stomach.', '507'); return '44.5 cm. At his 2-month visit it was on the 50th percentile; this is above the 97th.'; } },
      { id: 'doc', label: 'Document the findings objectively: size, location, color, exact words', cost: 4, avail: (s, P) => P.bruises && !P.documented, run(s, P, A) { P.documented = true; A.judge('507-doc', 'comm', 2, 'You documented Noah\'s bruises objectively.', 'Describe, don\'t interpret: location, size, color, and the caregiver\'s explanation in quotation marks. Your note may be the most important record in the case.', '507'); return `Charted: 1.5 cm purple bruise, left helix. Two 1 cm bluish bruises, left lateral chest. ${P.quote ? 'Father\'s explanation recorded in quotes. ' : ''}Fontanelle full.`; } },
      { id: 'obs', label: 'Keep Noah in direct view: continuous observation', cost: 1, avail: (s, P) => !P.observed, run(s, P, A) { P.observed = true; if (P.bruises) A.judge('507-obs', 'safety', 1, 'You made sure Noah was continuously observed.', 'While a possible abuse case is evaluated, the infant\'s safety on the unit comes first. Social work and the team decide on visitation.', '507'); return 'Kiana pulls a chair into the doorway. Noah stays in sight.'; } },
    ],
    comms: [
      { id: 'sw', label: 'Page social work', cost: 2, avail: (s, P) => !P.sw, run(s, P, A) { P.sw = true; A.judge('507-sw', 'comm', P.bruises ? 1 : 0, 'You paged social work about Noah.', 'Social work coordinates the family assessment and safety plan. They don\'t replace your own duty to report.', '507'); return 'Maggie from social work: "Thanks. I\'ll come up. Have you or the team made a report yet?"'; } },
      { id: 'cps', label: 'Make a mandated report to child protective services', cost: 6, avail: (s, P) => !P.cps, run(s, P, A) { P.cps = true; A.judge('507-cps', 'safety', P.bruises ? 2 : -1, P.bruises ? 'You made a mandated report for Noah.' : 'You reported without a documented concern.', P.bruises ? 'Nurses are mandated reporters. You don\'t need proof, only reasonable suspicion: bruising in a baby who can\'t move on his own is exactly that. Phone now; a written report follows within your state\'s deadline (36 hours in California).' : 'Reports need a reason you can document. Look at the whole baby first.', '507'); return 'You call the child abuse hotline and give your observations, word for word from your note. Reference number recorded in the chart.'; } },
    ],
    family: { name: 'Travis', rel: 'Father', mode: 'bedside', cost: 3, avail: (s, P) => !P.gone && !P.icu, dialog: (s, P) => (P.bruises ? 'travis_bruise' : 'travis_chat') },
    meds: [
      { id: '507-ond', name: 'Ondansetron', dose: '0.6 mg (0.1 mg/kg)', route: 'IV', freq: 'Every 8 h as needed, vomiting', prn: true, block: (s, P) => (P.ondAt !== null ? 'Given at ' + clock(P.ondAt) + '.' : null), checks: (s, P) => [{ label: 'Dose check', value: '0.1 mg/kg × 6.2 kg = 0.62 mg', ok: true }, { label: 'Neuro', value: P.font ? 'Fontanelle full: vomiting may not be GI' : 'Not assessed', ok: P.font ? false : null }], give(s, P, A) { P.ondAt = s.t; if (P.font) A.judge('507-ond', 'judgment', -1, 'You treated Noah\'s vomiting with a full fontanelle unreported.', 'Vomiting, irritability and a bulging fontanelle in an infant is raised pressure inside the skull until proven otherwise. An antiemetic hides the sign.', '507'); return 'Ondansetron 0.6 mg IV given.'; } },
    ],
    talk: (s, P) => (P.icu || P.gone ? null : 'noah_hold'),
    sbar: {
      items(s, P, A) {
        return [
          { id: 'bruise', label: 'Bruises on the left ear and left chest in a non-mobile 4-month-old', key: true, need: P.bruises, lock: 'Do a full skin check' },
          { id: 'font', label: 'Full, bulging fontanelle; irritable, high-pitched cry', key: true, need: P.font, lock: 'Do a neuro exam' },
          { id: 'hc', label: 'Head circumference 44.5 cm, above the 97th percentile', key: true, need: P.hc, lock: 'Measure his head' },
          { id: 'vom', label: 'Vomiting x3, poor feeding', key: true, need: true },
          { id: 'story', label: 'Dad: "He rolled off the couch" (he can\'t roll yet)', key: true, need: P.quote, lock: 'Ask Dad what happened' },
          { id: 'eyes', label: 'Big blue eyes', key: false, need: true },
        ];
      },
      requests: [
        { id: 'nat', label: 'I\'m worried about non-accidental trauma and a head injury. Head CT, skeletal survey, and the child protection team?' },
        { id: 'gi', label: 'He keeps vomiting. Can we get something stronger for nausea?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'gi') { const saw = P.bruises || P.font; A.judge('507-sbar-gi', 'judgment', saw ? -2 : -1, 'You asked for more antiemetic for Noah.', saw ? 'Anchoring: the admitting label was "stomach bug." Irritability, vomiting and a full fontanelle in an infant with bruises is a head injury until proven otherwise.' : 'Vomiting and irritability in an infant need a neuro exam and a full skin check before more antiemetic.', '507'); return 'Sure, I\'ll add something. Anything else going on with him?'; }
        if (req === 'nat' && (picked.includes('bruise') || picked.includes('font'))) {
          if (!P.reported) { P.reported = true; P.ctAt = s.t + 35; A.addOrder('507', 'Head CT without contrast STAT. Skeletal survey. Child protection team consult. Ophthalmology exam. Social work. Neuro checks every hour.'); }
          A.judge('507-sbar', 'comm', 2, 'You escalated Noah\'s findings as possible abusive head trauma.', 'Bruising in a non-mobile infant plus signs of raised intracranial pressure: the workup is CT, skeletal survey and the child protection team. You named it plainly without accusing anyone.', '507');
          return 'You\'re right to be worried. CT now, skeletal survey, and I\'m calling the child protection team. Has anyone made the report yet? Please do, and keep him in sight.';
        }
        return 'Okay. Keep monitoring.';
      },
    },
    scene: (s, P) => ({ crib: true, iv: 'running', family: P.gone || P.icu ? null : 'travis', familyLabel: 'Travis, his father', tray: 'none', bottle: true, empty: P.gone || P.icu, emptyText: P.icu ? 'Crib empty. Taken to the PICU after a seizure.' : 'Crib empty. Moved to the PICU for neurosurgery evaluation.' }),
    clues: (s, P) => ({ crib: 'The crib rails are up. A thin blanket, a pacifier, nothing else.', bottle: 'A bottle with 4 oz of formula. About 3 oz left.', family: 'Travis, sitting by the crib, looking tired.' }),
    rig: (s, P) => { const h = headSev(s, P); return { alert: h > .8 ? 1 : 0, anxious: h < .8 ? .6 : 0 }; },
    status: (s, P) => (P.icu || P.gone ? 'gone' : headSev(s, P) > .8 && !P.reported ? 'urgent' : P.bruises || P.font ? 'watch' : 'stable'),
    outcome(s, P) {
      const rep = P.cps ? ' A mandated report is on file.' : ' No report was made.';
      if (P.icu) return { tone: 'bad', title: 'Seizure on the floor', text: 'The fussiness and vomiting were a brain injury. CT upstairs showed bleeding under the skull.' + rep };
      if (P.gone) return { tone: P.cps ? 'good' : 'mixed', title: 'Head injury found, safe in the PICU', text: 'CT showed a subdural hemorrhage. Neurosurgery and the child protection team have him.' + rep + (P.confronted ? ' Dad left after being confronted.' : '') };
      if (P.bruises && P.cps) return { tone: 'mixed', title: 'Reported, workup pending', text: 'The bruises are documented and reported, but his head hasn\'t been imaged.' };
      if (P.bruises) return { tone: 'bad', title: 'Bruises seen, not reported', text: 'You saw them. The report is a legal duty and the thing that protects him when he goes home.' };
      return { tone: 'bad', title: 'Discharged as a stomach bug', text: 'Nobody undressed him fully. He goes home tomorrow with an injury no one looked for and no report.' };
    },
  };

  /* ---------- 509 Zoe Kaplan: asthma, and the quiet that isn't better ---------- */
  const silent = (P) => P.br >= 2.5;
  const zoe = {
    id: '509', room: '509', name: 'Zoe Kaplan', short: 'Zoe', age: 8, sex: 'F', mrn: '01170921',
    norms: { T: [36.1, 37.9], HR: [70, 120], RR: [18, 25], SBP: [86, 120], SpO2: [92, 101] },
    look: { skin: '#E9C3A4', shade: '#CFA585', lip: '#B86A5E', blush: '#EC9888', iris: '#3F5E3C', head: { w: 55, h: 59, jaw: .15 }, eye: 11, small: .88,
      hair: { style: 'ponytail', color: '#7A4A26' }, brow: { w: 2.8, color: '#6A3E20' }, body: { w: 60, cloth: 'sun' }, extras: ['freckles'], smile: .5,
      lines: { calm: 'Did you know octopuses have three hearts? I\'m going to be a marine biologist.', dys: 'Can\'t... talk... much.', anxious: 'I can\'t get the air in. Mom?', drowsy: 'So tired.', none: '(She doesn\'t answer. Her lips are blue.)' } },
    bio: 'Third grader, obsessed with octopuses. Fourth asthma admission this year. Mom Rachel is a teacher and hoping for discharge tomorrow.',
    dx: 'Asthma exacerbation', reason: 'Status asthmaticus after a cold, admitted this morning from the ED',
    hx: ['Moderate persistent asthma; fluticasone at home, often missed', 'Eczema', 'Weight 26 kg'],
    allergies: 'Peanuts (anaphylaxis)', code: 'Full code', weight: '26 kg',
    lines: ['PIV 22g left forearm, saline lock'], mobility: 'Up as tolerated', diet: 'Regular, peanut-free',
    init: { br: 1.4, albAt: -120, dexAt: null, cont: false, mg: false, rrt: false, icu: false, gone: false, pas: null, spaced: false, taught: false, o2: false, bumped: false },
    nightVitals: { T: 37.3, HR: 124, SBP: 108, DBP: 64, RR: 28, SpO2: 94, O2: 'Room air', pain: 1 },
    labs: [],
    orders: [
      { t: -400, text: 'Albuterol 5 mg nebulized every 2 h scheduled (15:00, 17:00, 19:00) and every 1 h as needed. Pediatric asthma score before and after each treatment.' },
      { t: -400, text: 'Dexamethasone 16 mg PO (0.6 mg/kg) once, due 17:00. O₂ to keep SpO₂ ≥ 92%.' },
      { t: -400, text: 'Call for asthma score ≥ 9, SpO₂ < 92% on O₂, need for albuterol more than every hour, or decreased air movement.' },
    ],
    notes: [{ t: -60, author: 'Marcus, day RN', text: 'Last neb 13:00. Asthma score 8 before, 6 after. Talking in sentences. Mom asking about discharge tomorrow.' }],
    io: { intake: 'PO 500 mL', output: 'Voiding' },
    report: [
      { text: 'Zoe Kaplan, eight, asthma flare after a cold. Fourth admission this year.', key: false },
      { text: 'She\'s on albuterol every two hours. Next one\'s due at 15:00, and a steroid at 17:00.', key: true },
      { text: 'Asthma score was a 6 after her last neb. She\'s talking in sentences.', key: true },
      { text: 'She\'s allergic to peanuts, the anaphylaxis kind.', key: true },
      { text: 'Mom really wants to go home tomorrow.', key: false },
      { text: 'Ask her about octopuses. You won\'t get a word in.', key: false },
    ],
    vitals(s, P) { const b = P.br, sil = silent(P); return { T: 37.3, HR: Math.round(108 + b * 12 + (recent(s, P.albAt, 30) ? 10 : 0)) + jit(s, 9) * 2, SBP: 108 + jit(s, 10) * 2, DBP: 64, RR: Math.round(20 + b * 6), SpO2: clamp(Math.round(98 - Math.max(0, b - 1.2) * 4 + (P.o2 ? 4 : 0)), 78, 99), O2: P.o2 ? '2 L NC' : 'Room air', pain: 1 }; },
    assess: {
      general: (s, P) => (silent(P) ? 'Sitting bolt upright, leaning on her hands, too tired to talk. She\'s quiet. Too quiet.' : P.br > 1.8 ? 'Sitting up, breathing fast, speaking in short phrases.' : 'Sitting cross-legged, reading an octopus book, talking in full sentences.'),
      resp: (s, P, A) => { P.k.resp = s.t; const v = A.vitals('509'); return silent(P) ? `RR ${v.RR}. Barely any wheeze: almost no air moving in or out. Severe intercostal and suprasternal retractions. SpO₂ ${v.SpO2}%. A silent chest.` : P.br > 1.8 ? `RR ${v.RR}. Wheeze in and out through all fields, intercostal retractions. SpO₂ ${v.SpO2}%.` : `RR ${v.RR}. Expiratory wheeze at the bases, mild retractions. SpO₂ ${v.SpO2}%.`; },
      cardiac: (s, P, A) => `HR ${A.vitals('509').HR}, regular. Cap refill 2 seconds.`,
      neuro: (s, P) => (silent(P) ? 'Drowsy between breaths, answering with one word.' : 'Alert, chatty.'),
      pain: () => 'Chest feels "tight," 3/10.',
      skin: () => 'Eczema patches on her elbows. No hives.',
      gi: () => 'Eating snacks, drinking well.',
    },
    interventions: [
      { id: 'pas', label: 'Pediatric asthma score', cost: 3, run(s, P, A) { const sc = clamp(Math.round(4 + P.br * 2.6), 5, 15); P.pas = sc; A.judge('509-pas', 'assess', 1, 'You scored Zoe\'s asthma.', 'Scoring before and after each treatment turns a wheeze into a trend. A score that won\'t come down is the reason to call.', '509'); return `Pediatric asthma score ${sc} of 15 (${sc >= 12 ? 'severe' : sc >= 8 ? 'moderate' : 'mild'}).${silent(P) ? ' Air movement is almost absent: the quiet chest scores worse, not better.' : ''}`; } },
      { id: 'o2', label: 'Oxygen 2 L to keep SpO₂ ≥ 92%', cost: 1, avail: (s, P) => !P.o2, run(s, P) { P.o2 = true; return 'Cannula on. Sat up four points.'; } },
      { id: 'pos', label: 'Sit her up, calm voice, Mom close', cost: 2, run(s, P) { return 'Upright on pillows, Mom holding her hand. She breathes a little slower.'; } },
    ],
    comms: [
      { id: 'rrt', label: 'Call a rapid response / PICU', cost: 3, avail: (s, P) => !P.rrt && P.br > 1.9, run(s, P, A) { P.rrt = true; P.cont = true; P.mg = true; A.judge('509-rrt', 'judgment', silent(P) ? 2 : 1, 'You escalated Zoe\'s asthma.', 'A silent chest, rising score or need for back-to-back albuterol means the floor plan is failing. Continuous albuterol and magnesium, and the PICU nearby.', '509'); return 'The team starts continuous albuterol and magnesium. The PICU fellow stays to watch her.'; } },
    ],
    family: { name: 'Rachel', rel: 'Mother', mode: 'bedside', cost: 3, dialog: (s, P) => (P.taught ? 'rachel_after' : 'rachel_talk') },
    meds: [
      {
        id: '509-alb', name: 'Albuterol', dose: '5 mg', route: 'Nebulized', freq: 'Every 2 h scheduled; every 1 h as needed', prn: true,
        block: (s, P) => (P.cont ? 'On continuous albuterol now.' : s.t - P.albAt < 60 ? 'Given at ' + clock(P.albAt) + '. PRN every 1 h at most.' : null),
        checks: (s, P, A) => { const v = A.vitals('509'); return [{ label: 'Last dose', value: P.albAt < 0 ? '13:00' : clock(P.albAt), ok: s.t - P.albAt >= 60 }, { label: 'HR', value: `${v.HR}`, ok: v.HR < 170 }, { label: 'Asthma score', value: P.pas !== null ? `${P.pas}` : 'Not scored', ok: P.pas !== null ? null : null }]; },
        give(s, P, A) { const late = s.t - P.albAt > 150 + (P.albAt < 0 ? 20 : 0); P.albAt = s.t; P.br = Math.max(.6, P.br - .85); if (late) A.judge('509-alb-late-' + s.t, 'time', -1, 'Zoe\'s albuterol went in late.', 'Every-2-hour albuterol in a flare is holding the airway open. Late doses let the bronchospasm catch up.', '509'); return 'Albuterol neb over 10 minutes. Her wheeze loosens; she coughs up some mucus. She\'s a little jittery.'; },
      },
      { id: '509-dex', name: 'Dexamethasone', dose: '16 mg (0.6 mg/kg)', route: 'PO', freq: 'Once, 17:00', due: 120, checks: () => [{ label: 'Dose check', value: '0.6 mg/kg × 26 kg = 15.6 mg; 16 mg (max 16)', ok: true }], give(s, P) { P.dexAt = s.t; return 'Dexamethasone 16 mg taken in applesauce.'; }, hold(s, P, A) { A.judge('509-dex-hold', 'meds', -2, 'You held Zoe\'s steroid.', 'Steroids treat the inflammation behind an asthma flare. Without it, the albuterol only buys time.', '509'); return 'Held.'; } },
    ],
    talk: (s, P) => (P.icu ? null : silent(P) ? 'zoe_silent' : 'zoe_talk'),
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('509');
        return [
          { id: 'silent', label: 'Decreased air movement, severe retractions, one-word answers', key: true, need: silent(P) && recent(s, P.k.resp, 45), lock: 'Listen to her chest' },
          { id: 'pas', label: P.pas ? `Asthma score ${P.pas}` : 'Asthma score', key: (P.pas || 0) >= 9, need: P.pas !== null, lock: 'Score her asthma' },
          { id: 'vit', label: `RR ${v.RR}, HR ${v.HR}, SpO₂ ${v.SpO2}%`, key: v.SpO2 < 92 || v.RR > 30, need: true },
          { id: 'alb', label: `Albuterol last at ${P.albAt < 0 ? '13:00' : clock(P.albAt)}`, key: true, need: true },
          { id: 'fourth', label: 'Fourth admission this year', key: false, need: true },
          { id: 'octo', label: 'Loves octopuses', key: false, need: true },
        ];
      },
      requests: [
        { id: 'esc', label: 'She\'s getting worse despite albuterol. Continuous albuterol, magnesium, and the PICU?' },
        { id: 'space', label: 'She\'s much quieter. Can we space her treatments so she can sleep?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'space') { P.spaced = true; A.judge('509-sbar-space', 'judgment', silent(P) ? -3 : -1, 'You asked to space Zoe\'s treatments because she was quieter.', 'In a severe flare, less wheeze can mean less air moving: a silent chest. Quiet plus retractions plus falling sat is danger, not improvement.', '509'); return silent(P) ? 'Quieter? What\'s her air movement like? Listen again before we change anything.' : 'Let\'s keep every two hours tonight.'; }
        if (req === 'esc' && (picked.includes('silent') || picked.includes('pas') || picked.includes('vit'))) { if (!P.rrt) { P.rrt = true; P.cont = true; P.mg = true; } A.judge('509-sbar', 'comm', 2, 'You escalated Zoe\'s asthma with the findings.', 'The score, the air movement and the albuterol timing: that\'s what earns continuous albuterol and the PICU.', '509'); return 'Starting continuous albuterol and a magnesium bolus, and the PICU is on the way. Stay with her.'; }
        return 'Keep the nebs on schedule and score her after each.';
      },
    },
    scene: (s, P) => ({ neb: true, o2: P.o2 ? 2 : 0, iv: 'lock', family: P.icu ? null : 'rachel', familyLabel: 'Rachel, her mother', empty: P.icu, emptyText: 'Bed empty. Intubated and moved to the PICU.' }),
    clues: (s, P) => ({ neb: P.cont ? 'Nebulizer running continuously.' : `Nebulizer on the table, last used ${P.albAt < 0 ? 'at 13:00' : 'at ' + clock(P.albAt)}.`, tablet: 'An octopus documentary, paused.', family: 'Rachel, grading spelling tests on her lap, looking up every few breaths.' }),
    rig: (s, P) => ({ rr: Math.round(20 + P.br * 6), lean: silent(P) ? .6 : P.br > 1.8 ? .25 : 0, anxious: silent(P) ? .7 : P.br > 1.8 ? .3 : 0, alert: P.br > 2.9 ? 1 : 0 }),
    status: (s, P) => (P.icu ? 'gone' : silent(P) && !P.rrt ? 'urgent' : P.br > 1.8 ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Respiratory failure, PICU', text: 'The quiet was her tiring out. She needed intubation upstairs.' };
      if (P.rrt) return { tone: P.spaced ? 'mixed' : 'good', title: 'Escalated before she tired out', text: 'Continuous albuterol and magnesium turned it around.' + (P.spaced ? ' The treatments were almost spaced out first.' : '') };
      if (P.br < 1.8) return { tone: 'good', title: 'Breathing easier, on schedule', text: 'Nebs on time and the steroid in.' + (P.taught ? ' Mom can do the spacer teach-back.' : '') };
      return { tone: 'mixed', title: 'Still tight at handoff', text: 'Wheezy and working, but on the edge.' };
    },
  };

  /* ---------- dialogs ---------- */
  const dialogs = {
    mateo_hold: { who: '501', text: 'You lift him from the crib. He\'s hot and damp, and you can feel his whole chest working against your hands.' },
    lucia_talk: { who: 'lucia', text: 'Lucía says something quickly in Spanish, watching Mateo\'s chest. Sofía, 11, looks up from her homework: "I can translate! I do it for her at the doctor all the time."', choices: [
      { label: 'Thank you, Sofía, that\'s really kind. For medical things we use a trained interpreter so your mom gets every word. (Start the video interpreter.)', next: 'lucia_a', fx: (s, A) => { const P = s.p['501']; P.interp = true; P.taught = true; A.judge('501-interp', 'comm', 2, 'You used a qualified medical interpreter for Lucía.', 'Children should never interpret for their families: they miss medical terms, soften bad news, and carry things they shouldn\'t. A trained interpreter is a patient right, and it\'s how Lucía learns the warning signs.', '501'); } },
      { label: 'Sure, Sofía. Tell your mom he\'s okay and I\'ll suction him before his bottle.', next: 'lucia_b', fx: J('501-interp', 'comm', -2, 'You used an 11-year-old to interpret medical information.', 'Children miss terms, filter what they pass on, and shouldn\'t carry that weight. Use a qualified interpreter every time.', '501') },
      { label: '(Speak slowly in English, with gestures.)', next: 'lucia_b', fx: J('501-interp', 'comm', -1, 'You relied on gestures instead of an interpreter.', 'Slower English isn\'t Spanish. The warning signs you\'re trying to teach need to land.', '501') },
    ] },
    lucia_a: { who: 'lucia', text: 'Through the interpreter: "He\'s been breathing faster since lunch. He sucks, stops, sucks. His ribs pull in." You teach her the signs to call for: ribs pulling in, grunting, pauses in breathing, color change. She nods and repeats them back.' },
    lucia_b: { who: 'lucia', text: 'Lucía nods and smiles politely. Sofía shrugs. "She says okay."' },
    lucia_after: { who: 'lucia', text: 'Through the interpreter: "His ribs are pulling in more. Like you said to watch for."' },
    aal_talk: { who: '503', text: '"Everyone looks at me like I\'m faking." She pulls out an earbud. "It\'s a nine. It feels like my bones are breaking. The button isn\'t doing anything."', choices: [
      { label: 'I believe you. Let\'s get your pain under control, and then work on some deep breaths together so your lungs stay clear.', next: 'aal_a', fx: (s, A) => { s.p['503'].trusted = true; A.judge('503-talk', 'comm', 2, 'You believed Aaliyah\'s pain.', 'The patient\'s report is the pain score. Trust is what gets her to tell you early when her chest starts hurting.', '503'); } },
      { label: 'Your PCA should be enough. Try spacing out your button presses.', next: 'aal_b', fx: J('503-talk', 'comm', -1, 'You told Aaliyah to use less of her PCA.', 'Her PCA has a lockout and limits; pressing it is using it correctly. Under-treated pain means shallow breathing and acute chest risk.', '503') },
      { label: 'Are you sure it\'s that bad? You were on your phone just now.', next: 'aal_b', fx: (s, A) => { s.p['503'].biased = true; A.judge('503-talk', 'judgment', -2, 'You doubted Aaliyah\'s pain because she was on her phone.', 'Distraction is a coping skill, not proof of comfort. Patients with chronic pain learn not to look like they\'re in pain.', '503'); } },
    ] },
    aal_a: { who: '503', text: 'Her shoulders drop a little. "Okay. Thank you. Nobody says that."' },
    aal_b: { who: '503', text: 'She puts the earbud back in and turns to the wall.' },
    aal_after: { who: '503', text: '"The heat pack helps. Can you tell my mom I\'m okay if she calls?"' },
    aal_chest: { who: '503', text: '"My chest hurts. On the right. When I breathe in." She\'s breathing fast and shallow, and she\'s hot.' },
    leo_talk: { who: '505', text: 'You say hi to Rexy first. Leo considers you, then lets you listen to his tummy. "Rexy has a owie too."' },
    minji_talk: { who: 'minji', text: '"He\'s hurting. Can he have more medicine?" She hesitates. "Also, the ED screen said he\'s 31 kilos? He\'s tiny. He wears 3T."', choices: [
      { label: 'That\'s a really important question. Let\'s weigh him right now, before anything else goes in.', next: 'minji_a', fx: (s, A) => { s.p['505'].hinted = true; A.judge('505-mom', 'comm', 1, 'You listened to Min-ji\'s doubt about the weight.', 'Parents know their child. When a parent questions a number, stop and verify.', '505'); } },
      { label: 'The system has his weight. The pharmacy checked the doses.', next: 'minji_b', fx: (s, A) => { s.p['505'].hinted = true; A.judge('505-mom', 'judgment', -2, 'You dismissed Min-ji\'s concern about Leo\'s weight.', 'Pharmacy checks the math, not the scale. A parent saying "he\'s tiny" about a 31 kg entry is a near-miss handed to you.', '505'); } },
    ] },
    minji_a: { who: 'minji', text: '"Thank you. He was 31 pounds at his checkup, I remember because it was the same as his cousin."' },
    minji_b: { who: 'minji', text: '"Okay. You\'re the nurse." She doesn\'t look convinced.' },
    minji_after: { who: 'minji', text: '"He\'s finally sleeping. Thank you for checking."' },
    noah_hold: { who: '507', text: 'He stiffens when you lift him, then cries a thin, high cry that doesn\'t soften when you rock him.' },
    travis_chat: { who: 'travis', text: '"He\'s just cranky. My girlfriend says it\'s teething. Can we go home tonight? I work early."' },
    travis_bruise: { who: 'travis', text: 'Travis watches you re-dress Noah. "Everything okay?"', choices: [
      { label: 'I noticed some bruises on his ear and chest. Can you tell me how he might have gotten them?', next: 'travis_a', fx: (s, A) => { s.p['507'].quote = true; A.judge('507-ask', 'comm', 1, 'You asked an open, neutral question about Noah\'s bruises.', 'Ask once, neutrally, and write down the answer word for word. The explanation, and whether it fits the child\'s development, matters.', '507'); } },
      { label: 'Did you do this to him?', next: 'travis_b', fx: (s, A) => { s.p['507'].confronted = true; A.judge('507-ask', 'safety', -2, 'You confronted Noah\'s father.', 'Accusing a caregiver can put the child at risk, make the family leave, and compromise the investigation. Your job is to observe, document and report; investigators ask the hard questions.', '507'); } },
      { label: 'Oh, babies bruise so easily.', next: 'travis_c', fx: (s, A) => { s.p['507'].dismissed = true; A.judge('507-ask', 'judgment', -2, 'You explained away bruising in a non-mobile infant.', 'Babies who can\'t roll or crawl don\'t bruise from ordinary life. Any bruise on an infant under 5 months is a sentinel injury until evaluated (TEN-4-FACESp); ear and torso bruises are red flags up to age 4.', '507'); } },
    ] },
    travis_a: { who: 'travis', text: '"He rolled off the couch yesterday." A pause. "Or, I mean, he kind of slid." You chart it in quotation marks. Noah doesn\'t roll yet.' },
    travis_b: { who: 'travis', text: 'His face hardens. "Are you serious? I\'m calling his mom. We\'re leaving." He stands up.' },
    travis_c: { who: 'travis', text: '"Yeah, totally." He relaxes and goes back to his phone.' },
    zoe_talk: { who: '509', text: '"Octopuses taste with their arms. Their ARMS." She stops for a breath mid-sentence, then keeps going.' },
    zoe_silent: { who: '509', text: 'She looks at you and shakes her head. She can\'t spare the air to talk.' },
    rachel_talk: { who: 'rachel', text: '"Four times this year. I can\'t keep missing school. What are we doing wrong at home?"', choices: [
      { label: 'Let\'s practice her inhaler with the spacer right now. Can you show me how you do it at home?', next: 'rachel_a', fx: (s, A) => { s.p['509'].taught = true; A.judge('509-teach', 'comm', 1, 'You used teach-back with Zoe\'s mom.', 'Most children use their inhalers wrong. Watching the family do it, then fixing it, prevents the next admission.', '509'); } },
      { label: 'The doctor will go over that at discharge.', next: 'rachel_b', fx: J('509-teach', 'comm', -1, 'You deferred Zoe\'s asthma teaching.', 'Teaching starts on admission, not at the door. Families learn best when they\'re worried and present.', '509') },
    ] },
    rachel_a: { who: 'rachel', text: 'She shakes the inhaler, sprays it into the air, then into the spacer. You gently show her: seal, one puff, six slow breaths. "Oh. We\'ve been doing it wrong for a year."' },
    rachel_b: { who: 'rachel', text: '"Okay." She goes back to grading.' },
    rachel_after: { who: 'rachel', text: '"Seal, one puff, six breaths. I\'m writing it on the fridge."' },
  };

  /* ---------- events ---------- */
  const A0 = (s) => Object.keys(s.p).every((id) => s.p[id].seenAt === null);
  const events = [
    { id: 'kiana-hi', when: (s) => s.t >= 4, run(s, A) { A.msg({ from: 'kiana', text: 'Hi! I\'m Kiana, I\'m your PCT tonight. 501 is working pretty hard and 507 has been crying since I got here. Holler if you need me.', replies: [{ label: 'Open tasks for Kiana', act: 'delegate' }] }); } },
    { id: 'bias', when: (s) => s.t >= 25, run(s, A) { A.msg({ from: 'kiana', pid: '503', text: '503 is on her call light again asking for pain meds. Marcus said she\'s kind of a frequent flyer, so, FYI.', replies: [{ label: 'Her pain is real. I\'m going to assess her', act: 'bias-assess' }, { label: 'She can wait until something\'s due', act: 'bias-wait' }] }); } },
    { id: 'nova-idle', when: (s) => s.t >= 45 && s.t < 120 && A0(s), run(s, A) { A.msg({ from: 'nova', urgent: true, text: 'Almost 16:00 and you haven\'t been in a room. Kids hide how sick they are until they can\'t. Go look.' }); } },
    { id: 'minji', when: (s) => s.t >= 40 && s.p['505'].od === null && !s.p['505'].fixed, run(s, A) { A.msg({ from: 'minji', pid: '505', text: 'Leo\'s mom at the desk: "He\'s crying and holding his tummy. Can he have his pain medicine?"', replies: [{ label: 'Go to 505', act: 'goto', pid: '505' }] }); } },
    { id: 'zoe-bump', when: (s) => s.t >= 90 && !s.p['509'].bumped, run(s, A) { const P = s.p['509']; P.bumped = true; P.br += .45; } },
    { id: 'rachel-quiet', when: (s) => silent(s.p['509']) && !s.p['509'].rrt && !s.p['509'].icu, run(s, A) { A.msg({ from: 'rachel', pid: '509', text: 'Zoe\'s mom: "She\'s so much quieter now, the wheezing is almost gone! Can we skip the next treatment so she can finally sleep?"', replies: [{ label: 'Quiet can be a danger sign. I\'m coming now', act: 'quiet-come' }, { label: 'Good news. Let her sleep', act: 'quiet-sleep' }] }); } },
    { id: 'zoe-fail', when: (s) => { const P = s.p['509']; return !P.icu && !P.rrt && P.br >= 3.1; }, run(s, A) { const P = s.p['509']; P.icu = true; A.judge('509-fail', 'safety', -3, 'Zoe went into respiratory failure on the floor.', 'Missed albuterol, a quiet chest mistaken for improvement, and no escalation. A silent chest in asthma is a pre-arrest sign.', '509'); A.msg({ from: 'nova', pid: '509', urgent: true, text: 'Rapid response 509. Zoe is exhausted, sat 84%, barely moving air. The PICU is intubating her.' }); } },
    { id: 'aal-acs', when: (s) => { const P = s.p['503']; return P.acs === null && s.t >= aalOnset(P); }, run(s, A) { const P = s.p['503']; P.acs = s.t; A.msg({ from: 'kiana', pid: '503', text: '503\'s temp is 38.7 and her sat is 93 on room air. She says her chest hurts now.', replies: [{ label: 'Go to 503', act: 'goto', pid: '503' }] }); } },
    { id: 'aal-cxr', when: (s) => { const P = s.p['503']; return P.reported && !P.cxr && s.t >= P.acs + 25; }, run(s, A) { const P = s.p['503']; P.cxr = true; A.addLab('503', { name: 'Chest X-ray', val: 'New right lower lobe infiltrate: acute chest syndrome', unit: '', ref: '', flag: 'A' }); A.msg({ from: 'okafor', pid: '503', text: 'CXR on 503: new RLL infiltrate. It\'s acute chest. Heme is coming for a simple transfusion.' }); } },
    { id: 'aal-picu', when: (s) => { const P = s.p['503']; return P.acs !== null && !P.reported && !P.icu && s.t >= P.acs + 60; }, run(s, A) { const P = s.p['503']; P.icu = true; A.judge('503-acs-miss', 'safety', -3, 'Aaliyah\'s acute chest syndrome went unrecognized for an hour.', 'Fever, chest pain and a new oxygen need in sickle cell disease is acute chest until proven otherwise. It can progress to respiratory failure within hours.', '503'); A.msg({ from: 'nova', pid: '503', urgent: true, text: 'Rapid response 503. Sat 85% on 2 L, fever 39. The PICU is taking her for an exchange transfusion.' }); } },
    { id: 'mateo-mom', when: (s) => { const P = s.p['501']; return P.taught && P.work >= 2.3 && !P.rrt && !P.icu; }, run(s, A) { A.msg({ from: 'lucia', pid: '501', urgent: true, text: 'Through the interpreter phone at the desk: Mateo\'s mom says his ribs are pulling in a lot and he\'s grunting, like you told her to watch for.', replies: [{ label: 'Go to 501', act: 'goto', pid: '501' }] }); } },
    { id: 'mateo-apnea', when: (s) => { const P = s.p['501']; return !P.icu && !P.gone && P.work >= 2.95; }, run(s, A) { const P = s.p['501']; P.icu = true; A.judge('501-apnea', 'safety', -3, 'Mateo had an apnea spell on the floor.', 'Rising rate, deep retractions, head bobbing and a failed feed: infants with bronchiolitis tire, then stop breathing. The PICU call comes before that.', '501'); A.msg({ from: 'kiana', pid: '501', urgent: true, text: 'Help in 501! Mateo stopped breathing and turned gray. We\'re bagging him. The PICU is on the way.' }); } },
    { id: 'mateo-picu', when: (s) => { const P = s.p['501']; return P.picuAt !== null && !P.gone && !P.icu && s.t >= P.picuAt; }, run(s, A) { const P = s.p['501']; P.gone = true; P.goneText = 'Moved to the PICU for CPAP'; A.msg({ from: 'nova', pid: '501', text: 'The PICU took Mateo upstairs for CPAP. Good call before he tired out.' }); } },
    { id: 'leo-od', when: (s) => { const P = s.p['505']; return P.od !== null && P.naloxAt === null && !P.odMsg && s.t >= P.od + 12; }, run(s, A) { const P = s.p['505']; P.odMsg = true; A.msg({ from: 'minji', pid: '505', urgent: true, text: 'Call light 505. Min-ji: "He won\'t wake up properly and his lips look gray!"', replies: [{ label: 'Go to 505', act: 'goto', pid: '505' }] }); } },
    { id: 'leo-picu', when: (s) => { const P = s.p['505']; return P.od !== null && P.naloxAt === null && !P.icu && s.t >= P.od + 32; }, run(s, A) { const P = s.p['505']; P.icu = true; A.judge('505-picu', 'safety', -3, 'Leo\'s opioid overdose went untreated.', 'Respiratory depression in a child after a narcotic needs stimulation, oxygen and naloxone now. The dose came from a wrong weight.', '505'); A.msg({ from: 'nova', pid: '505', urgent: true, text: 'Rapid response 505. RR 8, sat 80%. Naloxone given by the team; he\'s going to the PICU.' }); } },
    { id: 'noah-sleepy', when: (s) => { const P = s.p['507']; return !P.reported && headSev(s, P) > .8 && !P.gone && !P.icu; }, run(s, A) { A.msg({ from: 'kiana', pid: '507', urgent: true, text: '507 is really hard to wake up for his feed and he threw up again. His dad says he\'s just tired.', replies: [{ label: 'Go to 507', act: 'goto', pid: '507' }] }); } },
    { id: 'noah-ct', when: (s) => { const P = s.p['507']; return P.reported && P.ct === null && s.t >= P.ctAt; }, run(s, A) { const P = s.p['507']; P.ct = s.t; P.gone = true; P.goneText = 'Moved to the PICU'; A.addLab('507', { name: 'CT head', val: 'Acute subdural hemorrhage, left. No midline shift.', unit: '', ref: '', flag: 'A' }); A.msg({ from: 'okafor', pid: '507', urgent: true, text: 'CT on 507 shows a subdural hemorrhage. Neurosurgery is coming and the PICU is taking him. The child protection team is involved. Thank you for looking at the whole baby.' }); } },
    { id: 'noah-seize', when: (s) => { const P = s.p['507']; return !P.reported && !P.icu && !P.gone && s.t >= 175; }, run(s, A) { const P = s.p['507']; P.icu = true; A.judge('507-seize', 'safety', -3, 'Noah seized on the floor.', 'Fussiness, vomiting and a bulging fontanelle in an infant with bruises: the signs of a head injury were there hours earlier. "Stomach bug" was the label, not the diagnosis.', '507'); A.msg({ from: 'kiana', pid: '507', urgent: true, text: 'Help in 507! Noah is seizing. His arms and legs are jerking and he\'s not breathing right.' }); } },
    { id: 'nova-30', when: (s) => s.t >= 270, run(s, A) { A.msg({ from: 'nova', text: 'Half an hour to report. Before you give it: who could get worse overnight, and does the night nurse know why?' }); } },
  ];
  const replies = {
    'bias-assess'(s, A) { A.judge('503-bias', 'judgment', 1, 'You pushed back on the "frequent flyer" label.', 'Labels travel from nurse to nurse and change how pain gets treated. Assess the patient in front of you.', '503'); },
    'bias-wait'(s, A) { s.p['503'].biased = true; s.p['503'].relief = s.p['503'].relief.filter((r) => r.t > s.t); A.judge('503-bias', 'judgment', -2, 'You let Aaliyah wait for pain medicine because of a label.', 'Sickle cell pain is undertreated because of exactly this. Waits for analgesia are longer for these patients than for any other painful condition.', '503'); },
    'quiet-come'(s, A) { A.judge('509-quiet', 'judgment', 2, 'You recognized that a quieter asthmatic might be a silent chest.', 'Less wheeze with more work of breathing means less air moving. You went to look instead of taking the good news.', '509'); },
    'quiet-sleep'(s, A) { const P = s.p['509']; P.spaced = true; P.br += .25; A.judge('509-quiet', 'safety', -3, 'You let Zoe sleep through her treatment because she was quieter.', 'A quiet chest in a severe flare is air not moving. It\'s one of the most dangerous misreadings in pediatrics.', '509'); },
  };

  /* ---------- delegation ---------- */
  const delegation = {
    note: () => 'Kiana is your patient care tech. She can take one task at a time.',
    tasks: [
      { id: 'vitals', label: 'Take a set of vital signs', rooms: ['501', '503', '505', '507', '509'], mins: 10 },
      { id: 'weigh', label: 'Weigh him on the unit scale', rooms: ['505', '507'], mins: 6 },
      { id: 'io', label: 'Weigh diapers and total intake and output', rooms: ['501', '507'], mins: 8 },
      { id: 'feed', label: 'Give his bottle feed', rooms: ['501', '507'], mins: 0 },
      { id: 'watch', label: 'Sit in the doorway: keep him in sight', rooms: ['507'], mins: 0 },
      { id: 'sit', label: 'Sit with her and help with the spirometer', rooms: ['503'], mins: 12 },
      { id: 'neb', label: 'Give her albuterol treatment', rooms: ['509'], mins: 0 },
    ],
    start(task, pid, s, A) {
      const nm = A.def(pid).short;
      if (task.id === 'neb') { A.judge('deleg-neb', 'deleg', -2, 'You asked the PCT to give a medication.', 'Nebulized albuterol is a medication: the RN or respiratory therapist gives it and scores the child before and after.'); return 'Kiana: "I can\'t do nebs, that\'s you or RT. Want me to grab RT?"'; }
      if (task.id === 'feed') { const rr = A.vitals(pid).RR; if (pid === '501' && rr > 60) { const P = s.p['501']; P.aspirated = true; P.work += .6; P.fedAt = s.t; A.judge('deleg-feed', 'deleg', -2, `You had the PCT bottle-feed Mateo with an RR of ${rr}.`, 'Deciding whether an infant is safe to feed is a nursing judgment. Over 60, the order said hold PO.'); return 'Kiana gives the bottle. Mateo coughs and sputters and turns dusky; she stops and calls you.'; } s.p[pid].fedAt = s.t; return `Kiana: "He took most of it."`; }
      if (task.id === 'watch') { s.p['507'].observed = true; A.judge('deleg-watch', 'deleg', 1, 'You had the PCT keep Noah in sight.', 'Continuous observation is a perfect PCT task. The assessment and the report stay with you.'); return 'Kiana: "On it. I\'ll sit in the doorway."'; }
      if (s.deleg.filter((d) => !d.done).length >= 1) return 'Kiana: "Give me a sec, I\'m still on the last thing."';
      s.deleg.push({ id: task.id, pid, due: s.t + task.mins, done: false, at: s.t });
      if (task.id === 'vitals' || task.id === 'weigh' || task.id === 'io') A.judge('deleg-good-' + task.id, 'deleg', 1, `You delegated ${task.label.toLowerCase()} to the PCT.`, 'Hand off the measurements; keep the interpretation.');
      return `Kiana: "On it: ${task.label.toLowerCase()} for ${nm}."`;
    },
    complete(d, s, A) {
      const nm = A.def(d.pid).short;
      if (d.id === 'vitals') { const v = A.recordVitals(d.pid, 'Kiana (PCT)'); A.msg({ from: 'kiana', pid: d.pid, text: `${nm}: T ${v.T.toFixed(1)}, HR ${v.HR}, RR ${v.RR}, BP ${v.SBP}/${v.DBP}, SpO₂ ${v.SpO2}%.` + (d.pid === '501' && v.RR > 60 ? ' He\'s breathing really fast.' : '') + (d.pid === '509' && silent(s.p['509']) ? ' She\'s not wheezing as much but she looks tired.' : '') }); }
      else if (d.id === 'weigh') { if (d.pid === '505') { s.p['505'].weighed = true; A.msg({ from: 'kiana', pid: '505', text: 'Leo is 14.1 kg. Huh, the board says 31. Is that pounds?' }); } else A.msg({ from: 'kiana', pid: d.pid, text: 'Noah is 6.2 kg, same as admission.' }); }
      else if (d.id === 'io') A.msg({ from: 'kiana', pid: d.pid, text: d.pid === '501' ? 'Mateo: 4 wet diapers today, last one light. Took 60 mL at 12:30.' : 'Noah: 2 wet diapers, one emesis at 13:00, 2 oz formula total.' });
      else if (d.id === 'sit') { s.p['503'].isUses += 1; A.msg({ from: 'kiana', pid: '503', text: 'Sat with Aaliyah. She did the spirometer ten times. She says thank you for believing her.' }); }
    },
  };

  /* ---------- Nova ---------- */
  function novaHint(s, A) {
    const M = s.p['501'], Aa = s.p['503'], L = s.p['505'], N = s.p['507'], Z = s.p['509'];
    if (L.od !== null && L.naloxAt === null && !L.icu) return 'A three-year-old who won\'t wake up after a narcotic. What reverses it, and what was the dose based on?';
    if (silent(Z) && !Z.rrt && !Z.icu) return 'An asthmatic who has gone quiet isn\'t necessarily better. What does her chest actually sound like?';
    if (Aa.acs !== null && !Aa.reported && !Aa.icu) return 'Fever, chest pain and a new oxygen need in sickle cell. What is that until proven otherwise?';
    if (M.work > 2.2 && !M.rrt && !M.icu && !M.gone) return 'A baby at max support who keeps working harder. Who needs to see him before he gets tired?';
    if (!L.weighed && !L.fixed) return 'Every dose on a kids\' unit rides on one number. Do you trust the number in 505\'s chart?';
    if (!N.bruises && !N.gone && !N.icu) return 'A fussy baby who "screams when undressed" never got a full skin check. Look at the whole baby.';
    if (N.bruises && !N.cps) return 'You found something on a baby who can\'t roll over yet. What is your legal duty?';
    if (!M.interp) return 'Who has been explaining Mateo\'s care to his mother, and should they be?';
    const unseen = A.c.patients.filter((d) => !s.p[d.id].gone && !s.p[d.id].icu && (s.p[d.id].seenAt === null || s.t - s.p[d.id].seenAt > 90)).map((d) => d.room);
    if (unseen.length) return `You haven't been in ${unseen.join(' and ')} for a while. Kids compensate, then crash.`;
    return 'You\'re on top of it. Now teach: who goes home tomorrow, and what do their parents need to know?';
  }

  function endChecks(s, A) {
    A.c.patients.forEach((d) => {
      const P = s.p[d.id];
      if (P.seenAt === null && !P.icu && !P.gone) A.judge(d.id + '-unseen', 'assess', -3, `You never went into ${d.room} this shift.`, 'Children compensate until they suddenly can\'t. Every child gets seen.', d.id);
      (d.meds || []).forEach((m) => { const st = s.meds[m.id]; if (m.due !== undefined && m.due <= Math.min(240, s.t - 60) && st.status === 'due' && !P.icu && !P.gone && (!m.available || m.available(s, P))) A.judge(m.id + '-missed', 'meds', -2, `${m.name} for ${d.short} (due ${clock(m.due)}) was never given or held.`, 'Every scheduled dose needs a decision: given, or held with a reason.', d.id); });
    });
    const M = s.p['501'], L = s.p['505'], N = s.p['507'], Z = s.p['509'];
    if (!L.weighed && !L.fixed) A.judge('505-noweigh', 'assess', -2, 'Leo was never weighed on the unit.', 'In pediatrics, a measured weight is the first safety check for every medication. His chart weight was 31 pounds entered as kilograms.', '505');
    if (N.bruises && !N.cps && !N.gone) A.judge('507-noreport', 'safety', -3, 'You saw bruising on a non-mobile infant and no report was made.', 'Mandated reporters must report reasonable suspicion of abuse. It isn\'t an accusation; it\'s how a trained team takes a look.', '507');
    if (N.bruises && !N.cps && N.gone) A.judge('507-noreport', 'safety', -2, 'Noah went to the PICU without a mandated report from you.', 'The CT confirmed the injury, but the duty to report was yours as soon as you saw the bruises.', '507');
    if (!M.interp && !M.icu) A.judge('501-nointerp', 'comm', -1, 'Mateo\'s mother never had a qualified interpreter this shift.', 'Language access is a right and a safety measure. A family that understands the warning signs calls sooner.', '501');
    if (s.t - Z.albAt > 150 && !Z.cont && !Z.icu) A.judge('509-alb-miss', 'meds', -1, 'Zoe\'s albuterol was overdue at the end of the shift.', 'Scheduled means scheduled in a flare.', '509');
    const keys = []; A.c.patients.forEach((d) => (d.report || []).forEach((r, i) => { if (r.key) keys.push(d.id + ':' + i); }));
    const hit = keys.filter((k) => s.brain.includes(k)).length;
    if (s.brain.length) { const noise = s.brain.length - hit, precise = hit / s.brain.length;
      if (noise >= 4 && precise < .7) A.judge('brain', 'assess', -1, `You flagged ${s.brain.length} lines in report, ${noise} of them noise.`, 'Flagging everything is the same as flagging nothing.');
      else A.judge('brain', 'assess', hit / keys.length >= 0.6 && precise >= .7 ? 1 : 0, `You flagged ${hit} of ${keys.length} critical cues during handoff${noise ? `, plus ${noise} that didn\'t matter` : ''}.`, 'On peds, the lines that matter are often the quiet ones: "we haven\'t weighed him," "he screams when undressed," "his sister translates."'); }
  }

  const PREP = { '505-morph': ['pain'], '505-morph2': ['pain'], '503-morph': ['pain'], '509-alb': ['vitals'] };
  [mat, aal, leo, noah, zoe].forEach((d) => d.meds.forEach((m) => { if (PREP[m.id]) m.prep = PREP[m.id]; }));

  S.engine.registerCase({
    id: 'peds-5s-1', title: 'Small voices', unit: '5 South, Pediatrics', unitShort: '5 South', level: 'Specialty: Peds', start: 15 * 60, length: 300, novaCredits: 3,
    card: 'Five children and their families. Kids compensate, until they don\'t.',
    hero: { head: 'Five kids. Five families. Every dose by the kilogram.', lede: 'Evening shift on 5 South, pediatrics. Children hide how sick they are until they suddenly can\'t, and half of what you need to know will come from the parent in the chair.' },
    intro: { time: '14:58', place: '5 South · Pediatrics · Evening', cta: 'Take report', beats: ['Five patients, from four months to fifteen years old.', 'Normal vital signs change with age. So does every dose.', 'Some of these children can\'t tell you what\'s wrong. Their bodies can.'] },
    minutes: 20,
    handoffBy: 'Marcus (day RN)', reportBy: 'marcus', reportRole: 'day shift', provider: 'okafor', cna: 'kiana',
    staff: {
      nova: { name: 'Nova Reyes', role: 'Charge nurse', look: { skin: '#B98A63', shade: '#976D4B', lip: '#7C4435', blush: '#C77B5E', iris: '#3D2A1C', head: { w: 55, h: 62, jaw: .35 }, eye: 10, hair: { style: 'bun', color: '#3A2E2A', streak: true }, brow: { w: 3.6, color: '#2E2421' }, body: { w: 80, cloth: 'navy' }, extras: ['studs'], smile: .35 } },
      kiana: { name: 'Kiana', role: 'Patient care tech', look: { skin: '#A26B4A', shade: '#825236', lip: '#6E372B', blush: '#B96F57', iris: '#24160E', head: { w: 54, h: 60, jaw: .3 }, eye: 10.4, hair: { style: 'curls', color: '#1E1410' }, brow: { w: 3.2, color: '#1A110C' }, body: { w: 78, cloth: 'wine' }, extras: ['hoops'], smile: .55 } },
      marcus: { name: 'Marcus', role: 'Day RN', look: { skin: '#E8C7A8', shade: '#CDA586', lip: '#AE6B5E', blush: '#E39A85', iris: '#3F5E7A', head: { w: 57, h: 62, jaw: .55 }, eye: 9.6, hair: { style: 'short', color: '#8A6A44' }, brow: { w: 4.2, color: '#735638' }, body: { w: 86, cloth: 'blue' }, extras: ['beard'], smile: .4, tired: true } },
      okafor: { name: 'Dr. Okafor', role: 'Pediatric hospitalist', look: { skin: '#5A3624', shade: '#43281A', lip: '#48241A', blush: '#86463A', iris: '#1E120B', head: { w: 55, h: 63, jaw: .4 }, eye: 9.6, hair: { style: 'buzz', color: '#110C09' }, brow: { w: 4, color: '#0E0A08' }, body: { w: 82, cloth: 'coat', steth: true }, extras: ['thinGlasses'], glasses: '#3A3A3A', smile: .3 } },
      lucia: { name: 'Lucía Hernández', role: 'Mother, 501', look: { skin: '#C99A70', shade: '#AA7B53', lip: '#94554A', blush: '#D08A6C', iris: '#2B1B10', head: { w: 54, h: 60, jaw: .3 }, eye: 9.8, hair: { style: 'long', color: '#1E140E' }, brow: { w: 3.4, color: '#1A110C' }, body: { w: 80, cloth: 'plum' }, extras: ['gold'], smile: .15, tired: true } },
      minji: { name: 'Min-ji Park', role: 'Mother, 505', look: { skin: '#F0CFB0', shade: '#D6AE8C', lip: '#C0736A', blush: '#F0A08C', iris: '#241810', head: { w: 53, h: 60, jaw: .3 }, eye: 9.6, hair: { style: 'bob', color: '#141012' }, brow: { w: 3.2, color: '#141012' }, body: { w: 78, cloth: 'tee' }, extras: [], smile: .1, tired: true } },
      travis: { name: 'Travis Whitfield', role: 'Father, 507', look: { skin: '#EAC7AB', shade: '#CFA88A', lip: '#A8645B', blush: '#E0947F', iris: '#4E6A82', head: { w: 58, h: 62, jaw: .6 }, eye: 9.4, hair: { style: 'short', color: '#5A4028' }, brow: { w: 4.4, color: '#4A3420' }, body: { w: 90, cloth: 'hoodie' }, extras: [], smile: .05 } },
      rachel: { name: 'Rachel Kaplan', role: 'Mother, 509', look: { skin: '#E9C3A4', shade: '#CFA585', lip: '#B86A5E', blush: '#EC9888', iris: '#3F5E3C', head: { w: 54, h: 61, jaw: .3 }, eye: 9.6, hair: { style: 'ponytail', color: '#6A3E20' }, brow: { w: 3.2, color: '#5A3418' }, body: { w: 80, cloth: 'blouse' }, extras: ['thinGlasses'], glasses: '#6A5040', smile: .25 } },
      lab: { name: 'Lab', role: 'Laboratory', look: null },
    },
    patients: [mat, aal, leo, noah, zoe],
    dueExtras(s) {
      const out = [], M = s.p['501'], Z = s.p['509'], L = s.p['505'];
      if (!M.icu && !M.gone && M.fedAt === null) out.push({ t: 30, late: s.t > 60, text: '501 Feed due: suction first; hold PO if RR > 60' });
      if (!Z.icu && !Z.cont) out.push({ t: Math.max(0, Z.albAt + 120), late: s.t > Z.albAt + 150, text: '509 Albuterol neb (every 2 h) with asthma score' });
      if (!L.weighed && !L.fixed && !L.icu) out.push({ t: 0, late: s.t > 45, text: '505 Unit admission weight (not done)' });
      return out;
    },
    replies,
    priority: {
      judge(r, A) {
        if (r[0] === '501') A.judge('rank-first', 'priority', 2, 'You chose to see Mateo first.', 'An infant on high-flow who is working harder: airway and breathing, and the youngest patient with the least reserve.', '501');
        else if (r[0] === '509') A.judge('rank-first', 'priority', 1, 'You chose to see Zoe first.', 'Reasonable: her albuterol is due right now. But the baby on high-flow who is getting worse has less reserve.', '509');
        else A.judge('rank-first', 'priority', -1, `You put ${A.def(r[0]).short} first, ahead of Mateo.`, 'Airway and breathing in the youngest, least stable child first; time-critical treatments next.', '501');
      },
      correct: ['501', '509', '503', '507', '505'],
      why: {
        '501': 'Four months old on high-flow and working harder since lunch. Infants have the least reserve and tire fast.',
        '509': 'Albuterol due at 15:00 in an active flare. On-time treatment is what keeps her off the PICU list.',
        '503': 'Pain 7 in a sickle cell crisis with a history of acute chest. Treat the pain so she can breathe deeply.',
        '507': 'A fussy, vomiting baby with no full skin check. Easy to label as a stomach bug; don\'t.',
        '505': 'Post-op and fussing, but stable. Weigh him before any weight-based dose.',
      },
    },
    events, delegation, dialogs, novaHint, endChecks,
    tick(s, A) {
      const M = s.p['501'];
      if (!M.icu && !M.gone) M.work = clamp(M.work + (M.rrt ? -.004 : .0068), 1, 3.2);
      const Z = s.p['509'];
      if (!Z.icu) { let r = .006; if (Z.dexAt !== null && s.t - Z.dexAt > 60) r *= .3; if (Z.cont) r = -.012; Z.br = clamp(Z.br + r, .5, 3.4); }
    },
  });
})(window.Shift);
