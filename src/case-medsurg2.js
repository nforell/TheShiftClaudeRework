/* Case: 4 West Med-Surg, evening block (15:00–20:00). Beginner level: four patients plus an ED admission. */
(function (S) {
  const { clamp, clock } = S.engine;
  const jit = (s, seed) => ((Math.floor(s.t / 5) * 7 + seed * 13) % 3) - 1;
  const recent = (s, t0, m) => t0 !== null && t0 !== undefined && s.t - t0 <= m;
  const decay = (s, list, mins) => list.reduce((n, r) => { const d = s.t - r.t; return d >= 0 && d < mins ? n + r.amt * (1 - d / mins) : n; }, 0);

  /* ---------- 421 Pat Kowalski: COPD exacerbation, CO2 retainer ---------- */
  const patDrowsy = (P) => (P.co2 >= 76 ? 2 : P.co2 >= 62 ? 1 : 0);
  const pat = {
    id: '421', room: '421', name: 'Patricia Kowalski', short: 'Mrs. Kowalski', age: 68, sex: 'F', mrn: '00377210',
    look: { skin: '#EBC6A8', shade: '#CFA184', lip: '#A45A55', blush: '#E2917F', iris: '#6C7A4E', head: { w: 57, h: 60, jaw: .35 }, eye: 9.6,
      hair: { style: 'curlyshort', color: '#9A4E2E', big: true }, brow: { w: 3.2, color: '#7A4A34' }, body: { w: 74, cloth: 'gown', cardigan: '#6E8B5E' }, extras: ['cannula', 'wrinkles', 'pearls'], smile: .35,
      lines: { calm: 'The cardinal\'s back on the ledge across the way. Third day running.', anxious: 'I feel like I\'m breathing through a coffee straw.', dys: 'Can\'t... get the air... out.', drowsy: 'Mm. So tired. Let me sleep, hon.', none: 'She doesn\'t wake to her name. Her breathing is slow and shallow.' } },
    bio: 'Retired school bus dispatcher, 45 pack-years, quit at 60. Birdwatcher; keeps binoculars on the windowsill. Lives with her sister.',
    dx: 'COPD exacerbation, day 2', reason: 'COPD exacerbation with bronchitis',
    hx: ['COPD, GOLD 3. Known CO₂ retainer (baseline PaCO₂ about 52)', 'Hypertension', 'Osteoporosis'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '61 kg',
    lines: ['PIV 22g left forearm, saline lock', 'Oxygen 2 L nasal cannula'], mobility: 'Up to chair with assist of 1. Gets winded fast.', diet: 'Regular',
    init: { o2: 2, co2: 54, o2Fixed: null, raisedAt: null, lorazAt: null, nebAt: null, coachAt: null, abgOrdered: false, abgAt: null, abgResult: null, bipapOrdered: false, bipap: null, rtCalled: false, luisTaught: false, icu: false, drowsyMsg: false },
    nightVitals: { T: 37.2, HR: 96, SBP: 142, DBP: 82, RR: 22, SpO2: 90, O2: '2 L NC', pain: 0 },
    labs: [
      { name: 'ABG pH', val: 7.37, unit: '', ref: '7.35–7.45', flag: '', t: -1300 },
      { name: 'ABG PaCO₂', val: 53, unit: 'mmHg', ref: '35–45 (her baseline about 52)', flag: 'H', t: -1300 },
      { name: 'ABG PaO₂', val: 58, unit: 'mmHg', ref: '80–100', flag: 'L', t: -1300 },
      { name: 'Bicarbonate', val: 31, unit: 'mmol/L', ref: '22–28', flag: 'H', t: -500 },
      { name: 'WBC', val: 11.6, unit: 'K/µL', ref: '4.5–11.0', flag: 'H', t: -500 },
      { name: 'Glucose', val: 188, unit: 'mg/dL', ref: '70–99 (on prednisone)', flag: 'H', t: -500 },
    ],
    orders: [
      { t: -1300, text: 'Oxygen by nasal cannula, titrate to SpO₂ 88–92%. Notify provider if more than 4 L is needed.' },
      { t: -1300, text: 'Ipratropium-albuterol 3 mL nebulized every 4 h. Prednisone 40 mg PO daily. Azithromycin 500 mg IV daily.' },
      { t: -1300, text: 'Lorazepam 0.5 mg PO every 6 h as needed for anxiety. Hold for sedation or RR < 12.' },
      { t: -1300, text: 'Respiratory therapy to follow. Continuous pulse oximetry.' },
    ],
    notes: [
      { t: -60, author: 'Marisol, day RN', text: 'Anxious off and on, better after nebs and pursed-lip breathing. Sats 89–91% on 2 L, which is her goal. Sister visited at lunch. Sleeps sitting up.' },
      { t: -1300, author: 'Admitting hospitalist', text: 'Chronic hypercapnia. Avoid over-oxygenation: target 88–92%. BiPAP if acidotic.' },
    ],
    io: { intake: 'PO 1,100 mL', output: 'Voiding, 4 times' },
    report: [
      { text: 'Pat Kowalski, 68, COPD exacerbation, day two. Full code, no allergies.', key: false },
      { text: 'She\'s a CO₂ retainer. Her goal sat is 88 to 92, and she\'s sitting at 90 on 2 liters. That\'s where we want her.', key: true },
      { text: 'She gets anxious and asks for her lorazepam. Pursed-lip breathing and her neb usually settle her first.', key: true },
      { text: 'Neb is due at 15:30. Azithromycin at 17:00.', key: false },
      { text: 'She\'ll tell you everything about the cardinals outside her window. Ask her, it calms her down.', key: false },
    ],
    vitals(s, P) {
      const sp = P.o2 <= 2 ? 90 : P.o2 <= 3 ? 93 : P.o2 <= 4 ? 95 : 98;
      const rr = Math.round(P.co2 >= 60 ? Math.max(9, 22 - (P.co2 - 60) * .45) : 22 - (recent(s, P.nebAt, 90) ? 2 : 0) - (recent(s, P.coachAt, 45) ? 2 : 0));
      return { T: 37.2, HR: 96 + (recent(s, P.nebAt, 30) ? 8 : 0) + jit(s, 1), SBP: 142 + jit(s, 2) * 2, DBP: 82, RR: rr, SpO2: Math.min(99, sp + (P.bipap ? 2 : 0) + jit(s, 3)), O2: P.bipap ? 'BiPAP 30%' : P.o2 + ' L NC', pain: 0 };
    },
    assess: {
      general: (s, P) => P.co2 >= 76 ? 'Slumped in bed, chin on her chest. Rouses to a firm shake, then drifts.' : P.co2 >= 62 ? 'Drowsy, eyes closing mid-sentence. Pink and comfortable-looking, which is the trap.' : 'Sitting forward on the edge of the bed, elbows on the table. Talking in full sentences, a little winded.',
      resp: (s, P, A) => `${P.co2 >= 62 ? 'Shallow, slow breaths.' : 'Prolonged expiration, pursed lips.'} Diffuse expiratory wheezes, diminished bases. RR ${A.vitals('421').RR}. Using her neck muscles at rest.`,
      cardiac: () => 'Regular, tachycardic. Trace ankle edema. Cap refill under 3 seconds.',
      neuro: (s, P) => ['Alert, oriented, sharp as a tack.', 'Drowsy but rousable to voice. Slow to answer. Complains of a headache.', 'Rouses only to touch. Mumbles. Asterixis when she holds out her hands.'][patDrowsy(P)],
      pain: () => 'No pain. "Just the breathing."',
      skin: (s, P) => P.co2 >= 62 ? 'Warm and flushed. Slightly sweaty.' : 'Warm, dry. Barrel chest. Fingertips clubbed.',
      gi: () => 'Eating about half her meals. Voiding without trouble.',
    },
    interventions: [
      {
        id: 'titrate', label: 'Turn oxygen down to her 88–92% goal (2 L)', cost: 1, avail: (s, P) => P.o2 > 2 && !P.bipap,
        run(s, P, A) {
          P.o2 = 2; P.o2Fixed = s.t;
          A.judge('421-titrate', 'safety', P.co2 < 62 ? 2 : 1, 'You turned Mrs. Kowalski\'s oxygen back to her 88–92% target.', 'In chronic CO₂ retainers, high-flow oxygen blunts the drive to breathe and worsens V/Q mismatch. A sat of 98% isn\'t a win for her; it\'s a warning. The order sets the target, not the highest number possible.', '421');
          return 'Flowmeter back to 2 L. Her sat drifts from 98% down toward 91%. Now reassess how awake she is.';
        },
      },
      {
        id: 'plb', label: 'Coach pursed-lip breathing, sit her forward', cost: 3,
        run(s, P, A) {
          P.coachAt = s.t;
          if (P.co2 >= 62) return 'She\'s too drowsy to follow the coaching. Her eyes keep closing.';
          A.judge('421-plb', 'judgment', 1, 'You coached Mrs. Kowalski through pursed-lip breathing.', 'Pursed-lip breathing keeps small airways open and slows the breathing rate. For COPD anxiety, it\'s the first tool, before any sedative.', '421');
          return 'Elbows on the table, in through the nose, out slowly through pursed lips. Six rounds in, her shoulders drop. "Okay. Okay. That\'s better."';
        },
      },
      {
        id: 'abg', label: 'Draw arterial blood gas (ordered)', cost: 5, avail: (s, P) => P.abgOrdered && P.abgAt === null,
        run(s, P) { P.abgAt = s.t; return 'ABG drawn from the right radial artery, pressure held for 5 minutes. Result in about 15 minutes.'; },
      },
      {
        id: 'bipap', label: 'Start BiPAP with respiratory therapy (ordered)', cost: 6, avail: (s, P) => P.bipapOrdered && !P.bipap, urgent: true,
        run(s, P, A) {
          P.bipap = s.t;
          A.judge('421-bipap', 'judgment', 1, 'You got Mrs. Kowalski onto BiPAP once she was retaining CO₂.', 'Noninvasive ventilation blows off CO₂ and often avoids intubation. Reassess her mental status within the hour.', '421');
          return 'Sam fits the mask. BiPAP 12 over 5, 30%. She fights it for a minute, then settles. Recheck her in 30 to 60 minutes.';
        },
      },
    ],
    comms: [
      {
        id: 'rt', label: 'Call respiratory therapy', cost: 3, avail: (s, P) => !P.rtCalled,
        run(s, P, A) {
          P.rtCalled = true;
          if (P.o2 > 3 || P.co2 >= 60) {
            P.abgOrdered = true; A.addOrder('421', 'ABG now (RT protocol).');
            A.judge('421-rt', 'comm', 1, 'You brought respiratory therapy in on Mrs. Kowalski\'s oxygen problem.', 'RT is the expert on oxygen delivery and ventilation. Using the team early is good practice.', '421');
            return 'Sam, RT: "She\'s a retainer. Get her back to her 88 to 92 and I\'ll draw a gas under our protocol. If she\'s sleepy, call the doc about BiPAP."';
          }
          return 'Sam, RT: "Her neb\'s due at 15:30. I can give it if you\'re slammed. She looks okay to me on 2 L."';
        },
      },
    ],
    meds: [
      {
        id: '421-neb', name: 'Ipratropium-albuterol', dose: '3 mL', route: 'Neb', freq: 'Every 4 h', due: 30,
        checks: (s, P, A) => [{ label: 'Heart rate', value: `${A.lastVitals('421').HR} at ${clock(A.lastVitals('421').t)}`, ok: A.lastVitals('421').HR < 120 }, { label: 'Wheezes', value: 'Diffuse, expiratory', ok: true }],
        give(s, P) { P.nebAt = s.t; return 'Nebulizer running. Albuterol may bump her heart rate a little.'; },
      },
      { id: '421-pred', name: 'Prednisone', dose: '40 mg', route: 'PO', freq: 'Daily', initStatus: 'given', givenNote: 'Given 09:00' },
      {
        id: '421-azi', name: 'Azithromycin', dose: '500 mg', route: 'IV', freq: 'Daily', due: 120,
        checks: () => [{ label: 'QTc (this morning)', value: '446 ms', ok: true }, { label: 'Allergies', value: 'None', ok: true }],
        give: () => 'Azithromycin infusing over 60 minutes.',
      },
      {
        id: '421-loraz', name: 'Lorazepam', dose: '0.5 mg', route: 'PO', freq: 'Every 6 h as needed, anxiety', prn: true, param: 'Hold for sedation or RR < 12',
        block: (s, P) => (P.lorazAt !== null && s.t - P.lorazAt < 360) ? 'Given at ' + clock(P.lorazAt) + '.' : null,
        checks: (s, P, A) => { const v = A.lastVitals('421'); return [{ label: 'RR and sedation', value: recent(s, v.t, 30) ? `RR ${v.RR} at ${clock(v.t)}` : 'Not checked in the last 30 min', ok: recent(s, v.t, 30) ? v.RR >= 12 : false }, { label: 'Tried first', value: P.coachAt !== null ? 'Pursed-lip breathing at ' + clock(P.coachAt) : 'Nothing yet', ok: P.coachAt !== null }, { label: 'Risk', value: 'CO₂ retainer. Benzodiazepines depress the drive to breathe.', ok: null }]; },
        give(s, P, A) {
          P.lorazAt = s.t;
          if (P.co2 >= 58) A.judge('421-loraz', 'meds', -2, 'You gave lorazepam to Mrs. Kowalski while she was retaining CO₂.', 'In hypercapnia, anxiety and restlessness can be symptoms of rising CO₂. A benzodiazepine suppresses the respiratory drive further. Check her mental status and the oxygen flow before sedating.', '421');
          else if (P.coachAt === null) A.judge('421-loraz', 'judgment', -1, 'You reached for lorazepam before trying pursed-lip breathing or her neb.', 'The order allows it, but nonpharmacologic measures and bronchodilators come first in COPD anxiety.', '421');
          return 'Lorazepam 0.5 mg given. Watch her sedation and respiratory rate.';
        },
      },
    ],
    talk: (s, P) => (P.icu ? null : P.co2 >= 62 ? 'pat_sleepy' : 'pat_anxious'),
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('421');
        return [
          { id: 'o2', label: `SpO₂ ${v.SpO2}% on ${v.O2} (at ${clock(v.t)})`, key: true, need: true },
          { id: 'raised', label: 'CNA turned her O₂ up to 6 L at 15:25', key: P.raisedAt !== null, need: P.raisedAt !== null, lock: 'Nothing changed' },
          { id: 'drowsy', label: patDrowsy(P) ? 'Drowsy and slow to answer, new headache' : 'Alert and oriented', key: patDrowsy(P) > 0, need: P.assessAt.neuro !== undefined || P.assessAt.general !== undefined, lock: 'Assess her mental status' },
          { id: 'rr', label: `RR ${v.RR}`, key: v.RR < 14, need: recent(s, v.t, 60), lock: 'Get fresh vitals' },
          { id: 'abg', label: P.abgResult ? `ABG: pH ${P.abgResult.ph}, PaCO₂ ${P.abgResult.co2}` : 'ABG', key: true, need: P.abgResult !== null, lock: 'No ABG result' },
          { id: 'hx', label: 'Known CO₂ retainer, baseline PaCO₂ about 52', key: true, need: true },
          { id: 'birds', label: 'Watching cardinals from her window', key: false, need: true },
        ];
      },
      respond(s, P, A, picked) {
        const sleepy = patDrowsy(P) > 0;
        if ((picked.includes('drowsy') && sleepy) || picked.includes('abg') && P.abgResult && P.abgResult.ph < 7.32) {
          P.abgOrdered = true; if (!P.bipapOrdered) { P.bipapOrdered = true; A.addOrder('421', 'BiPAP 12/5, FiO₂ to SpO₂ 88–92%. ABG 1 h after starting. Hold all sedatives.'); }
          A.judge('421-sbar', 'comm', 2, 'You reported Mrs. Kowalski\'s new drowsiness as a respiratory problem.', 'Drowsiness plus high oxygen in a CO₂ retainer is hypercapnic respiratory failure until proven otherwise. You gave the provider the pattern, not just the sat.', '421');
          return 'That\'s CO₂ narcosis until proven otherwise. Back to 88 to 92 now, BiPAP order is in, RT is on the way, and no more sedatives. I\'ll come look.';
        }
        if (picked.includes('raised') || picked.includes('o2')) { P.abgOrdered = true; A.addOrder('421', 'ABG now. Titrate O₂ to SpO₂ 88–92%.'); return 'Her goal is 88 to 92. Titrate down and get a gas. Call me with it.'; }
        return 'Okay. Keep her 88 to 92 and call me if anything changes.';
      },
    },
    scene: (s, P) => ({ o2: P.bipap ? 2 : P.o2, bipap: !!P.bipap, iv: 'lock', tray: s.t >= 120 ? 'full' : 'none', empty: P.icu }),
    clues: (s, P) => ({
      o2: P.bipap ? 'BiPAP running at 30%. The flowmeter is off.' : `Flowmeter set to ${P.o2} L. Her ordered target is 88–92%.${P.o2 > 2 ? ' Someone turned it up.' : ''}`,
      tray: 'Dinner tray: meatloaf, mashed potatoes. She\'s eaten three bites.',
      iv: 'Saline lock, left forearm. Clean and dry.',
      bipap: 'BiPAP at 12 over 5. Mask seal is good.',
    }),
    rig: (s, P) => ({ alert: patDrowsy(P), anxious: P.co2 < 60 && !recent(s, P.coachAt, 45) && !recent(s, P.nebAt, 60) && !recent(s, P.lorazAt, 120) ? .55 : 0, lean: P.co2 < 60 ? .3 : 0, sweat: P.co2 >= 62 ? .3 : 0 }),
    status: (s, P) => P.icu ? 'gone' : P.co2 >= 70 ? 'urgent' : P.co2 >= 62 || P.o2 > 3 ? 'watch' : 'stable',
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Hypercapnic respiratory failure, ICU', text: 'Found barely rousable with a PaCO₂ in the 80s. The high-flow oxygen that looked like good care drove it.' };
      if (P.bipap) return { tone: P.co2 < 66 ? 'mixed' : 'bad', title: 'BiPAP for CO₂ retention', text: 'She needed noninvasive ventilation after hours on 6 L. Recognized and treated, but it started with an oxygen change nobody reversed.' };
      if (P.co2 >= 62) return { tone: 'bad', title: 'Drowsy and retaining CO₂ at handoff', text: 'Still over-oxygenated and sleepy. The next nurse inherits a patient drifting toward respiratory failure.' };
      return { tone: 'good', title: 'Back at her baseline', text: 'Sats 88–92% on 2 L, alert, breathing easier after nebs and coaching.' + (P.lorazAt !== null ? ' She did get a benzodiazepine.' : '') };
    },
  };

  /* ---------- 423 Kevin Tran: pancreatitis, alcohol withdrawal ---------- */
  function ciwa(s, P) {
    let v = 9 + s.t * .06 - decay(s, P.relief, 240) - decay(s, P.calm, 60);
    if (P.seizedAt !== null) v = Math.min(v, 12);
    return clamp(Math.round(v), 0, 40);
  }
  const kevinPain = (s, P) => clamp(6 + (P.ate ? 2 : 0) - decay(s, P.painRelief, 180), 1, 10);
  const kevin = {
    id: '423', room: '423', name: 'Kevin Tran', short: 'Mr. Tran', age: 38, sex: 'M', mrn: '00552918',
    look: { skin: '#E2BC94', shade: '#C39871', lip: '#A4625A', blush: '#D98C77', iris: '#1E140E', head: { w: 55, h: 63, jaw: .55 }, eye: 9.4,
      hair: { style: 'shag', color: '#16110F' }, brow: { w: 4.2, color: '#130E0C' }, body: { w: 82, cloth: 'gown' }, extras: [], smile: .3, guard: true,
      lines: { calm: 'Pho place is short a cook tonight. They\'re gonna kill me.', shaky: 'Why are my hands doing this? I can\'t hold the cup.', anxious: 'I can\'t sit still. Something\'s crawling under my skin.', pain: 'It goes straight through to my back. Like a knife.', confused: 'There are bugs on the wall. Right there. You don\'t see them?', drowsy: 'Mm. Leave the light off.', none: 'He\'s post-ictal. He groans but doesn\'t answer.' } },
    bio: 'Line cook at a family pho restaurant. Drinks 8–10 beers a day since his divorce last year. His mother Linh calls every evening.',
    dx: 'Acute pancreatitis, alcohol withdrawal risk', reason: 'Alcohol-related acute pancreatitis',
    hx: ['Alcohol use disorder. Last drink Tuesday night, about 40 h ago', 'No prior withdrawal seizures reported', 'Gastritis'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '74 kg',
    lines: ['PIV 20g right forearm, lactated Ringer\'s at 150 mL/h'], mobility: 'Up as tolerated. Fall risk if tremulous.', diet: 'NPO',
    init: { relief: [], calm: [], painRelief: [], ciwaAt: null, lastCiwa: null, thiaAt: null, dexAt: null, trayIn: false, trayGone: false, ate: false, seizPrec: false, seizedAt: null, lorazAt: null, askedMom: false, momAnswered: false, amaDone: false },
    nightVitals: { T: 37.4, HR: 102, SBP: 146, DBP: 88, RR: 18, SpO2: 97, O2: 'Room air', pain: 6 },
    labs: [
      { name: 'Lipase', val: 1840, unit: 'U/L', ref: '13–60', flag: 'H', t: -1100 },
      { name: 'Glucose', val: 142, unit: 'mg/dL', ref: '70–99', flag: 'H', t: -500 },
      { name: 'Magnesium', val: 1.5, unit: 'mg/dL', ref: '1.7–2.2', flag: 'L', t: -500 },
      { name: 'AST / ALT', val: '148 / 62', unit: 'U/L', ref: 'AST 10–40', flag: 'H', t: -500 },
      { name: 'Ethanol level (admission)', val: 'Negative', unit: '', ref: '', flag: '', t: -1100 },
    ],
    orders: [
      { t: -1100, text: 'NPO. Lactated Ringer\'s at 150 mL/h; change to D5 ½NS with 20 mEq KCl at 16:00.' },
      { t: -1100, text: 'Thiamine 100 mg IV daily. Give thiamine before any dextrose-containing fluid.' },
      { t: -1100, text: 'CIWA-Ar every 4 h, every 1 h if score is 10 or more. Lorazepam per protocol: CIWA 10–15, 1 mg IV; CIWA 16 or more, 2 mg IV. Reassess 1 h after each dose. Call if more than 4 mg in 1 h.' },
      { t: -1100, text: 'Hydromorphone 0.5 mg IV every 3 h as needed for pain 4–10. Pantoprazole 40 mg IV daily. Seizure precautions if CIWA 16 or more.' },
    ],
    notes: [
      { t: -60, author: 'Marisol, day RN', text: 'CIWA 9 at 14:00: mild tremor, sweats, anxious. No meds needed per protocol yet. Pain 6, hydromorphone at 11:00. Asked me twice not to tell his mom why he\'s here.' },
    ],
    io: { intake: 'IV 1,650 mL', output: 'Urine 1,200 mL' },
    report: [
      { text: 'Kevin Tran, 38, alcohol-related pancreatitis. NPO. Full code.', key: false },
      { text: 'Last drink was Tuesday night, so he\'s about 40 hours out. Withdrawal peaks right about now.', key: true },
      { text: 'CIWA was 9 at 14:00. He didn\'t need any lorazepam yet. It\'s every hour if he hits 10.', key: true },
      { text: 'Thiamine hasn\'t gone in today. His fluids switch to D5 at 16:00.', key: true },
      { text: 'Pain\'s a 6. Last hydromorphone was at 11.', key: false },
      { text: 'He really doesn\'t want his mom to know about the drinking. She calls every night.', key: true },
    ],
    vitals(s, P) {
      const c = ciwa(s, P);
      return { T: +(37.3 + (c >= 18 ? .5 : 0)).toFixed(1), HR: Math.round(90 + c * 1.3) + jit(s, 4), SBP: Math.round(132 + c * 1.1) + jit(s, 5) * 2, DBP: 86, RR: Math.round(17 + c * .15), SpO2: 97, O2: 'Room air', pain: kevinPain(s, P) };
    },
    assess: {
      general: (s, P) => { const c = ciwa(s, P); return P.seizedAt !== null && s.t - P.seizedAt < 45 ? 'Post-ictal. Groggy, bitten tongue, sheets soaked.' : c >= 18 ? 'Pacing next to the bed, IV tubing tangled around his arm. Staring at the wall.' : c >= 12 ? 'Restless, sweating through his gown, can\'t settle.' : 'Lying curled on his side, arms around his belly.'; },
      resp: () => 'Clear bilaterally. No distress.',
      cardiac: (s, P, A) => `HR ${A.vitals('423').HR}, regular. Bounding pulses.`,
      neuro: (s, P) => { const c = ciwa(s, P); return c >= 18 ? 'Oriented to person only. Tactile and visual hallucinations: bugs on the wall.' : c >= 12 ? 'Oriented. Coarse tremor of both hands, anxious, jumpy with noise.' : 'Oriented. Fine tremor with arms out.'; },
      pain: (s, P) => `Epigastric pain ${kevinPain(s, P)}/10, boring straight through to his back. Better leaning forward.`,
      skin: (s, P) => ciwa(s, P) >= 10 ? 'Diaphoretic, flushed.' : 'Warm, slightly clammy.',
      gi: (s, P) => `Abdomen tender in the epigastrium, guarding, hypoactive bowel sounds.${P.ate ? ' He ate some of the dinner tray.' : ' NPO.'}`,
    },
    interventions: [
      {
        id: 'ciwa', label: 'Score CIWA-Ar', cost: 4,
        run(s, P, A) {
          const c = ciwa(s, P); P.ciwaAt = s.t; P.lastCiwa = c;
          if (s.t <= 60) A.judge('423-ciwa-early', 'assess', 1, 'You scored Mr. Tran\'s CIWA early in the shift.', 'At 40 hours after his last drink he\'s in the window where withdrawal escalates. The protocol only works if someone scores it on time.', '423');
          const parts = c >= 18 ? 'nausea 3, tremor 5, sweats 4, anxiety 4, agitation 4, tactile 3, visual 3, headache 2' : c >= 12 ? 'nausea 2, tremor 4, sweats 3, anxiety 3, agitation 2, headache 1' : 'nausea 2, tremor 2, sweats 2, anxiety 2, headache 1';
          return `CIWA-Ar ${c}. (${parts}.) ${c >= 16 ? 'Protocol: lorazepam 2 mg IV, seizure precautions.' : c >= 10 ? 'Protocol: lorazepam 1 mg IV, recheck in 1 hour.' : 'Below treatment threshold. Recheck in 4 hours.'}`;
        },
      },
      {
        id: 'dex', label: 'Change IV fluid to D5 ½NS + 20 KCl (ordered for 16:00)', cost: 3, avail: (s, P) => s.t >= 50 && P.dexAt === null,
        run(s, P, A) {
          P.dexAt = s.t;
          if (P.thiaAt === null) A.judge('423-dex', 'meds', -2, 'You started dextrose fluid before Mr. Tran\'s thiamine.', 'Thiamine-depleted patients who get glucose first can be tipped into Wernicke\'s encephalopathy: confusion, ataxia, eye movement problems. Thiamine first, then dextrose.', '423');
          else A.judge('423-dex', 'meds', 1, 'You gave thiamine before switching Mr. Tran to dextrose fluid.', 'Glucose metabolism burns thiamine. Replacing it first protects against Wernicke\'s encephalopathy.', '423');
          return 'D5 ½NS with 20 mEq KCl running at 150 mL/h.';
        },
      },
      {
        id: 'tray', label: 'Remove the dinner tray (he is NPO)', cost: 1, avail: (s, P) => P.trayIn && !P.trayGone && !P.ate,
        run(s, P, A) { P.trayGone = true; A.judge('423-tray', 'safety', 1, 'You caught a dinner tray delivered to an NPO patient.', 'Eating stimulates the pancreas. In acute pancreatitis that means more pain and inflammation. Check the diet order against what shows up.', '423'); return 'Tray back to the cart. You call dietary to flag his NPO order. "Aw, man. That smelled good."'; },
      },
      {
        id: 'seiz', label: 'Seizure precautions: pad rails, suction set up, bed low', cost: 3, avail: (s, P) => !P.seizPrec,
        run(s, P, A) { P.seizPrec = true; A.judge('423-seiz', 'safety', 1, 'You set up seizure precautions for Mr. Tran.', 'Withdrawal seizures peak 24 to 48 hours after the last drink. Suction and padded rails turn a seizure from a catastrophe into an event.', '423'); return 'Rails padded, suction tested at the headwall, bed low and locked.'; },
      },
      {
        id: 'calm', label: 'Dim the lights, quiet the room, stay with him', cost: 5, avail: (s, P) => ciwa(s, P) >= 12,
        run(s, P) { P.calm.push({ t: s.t, amt: 2 }); return 'Lights down, TV off, door half closed. You sit with him. His breathing slows a little.'; },
      },
    ],
    meds: [
      {
        id: '423-thia', name: 'Thiamine', dose: '100 mg', route: 'IV', freq: 'Daily', due: 60,
        checks: (s, P) => [{ label: 'Dextrose running?', value: P.dexAt !== null ? 'Yes, since ' + clock(P.dexAt) : 'Not yet', ok: P.dexAt === null }],
        give(s, P) { P.thiaAt = s.t; return 'Thiamine 100 mg IV given.'; },
      },
      {
        id: '423-loraz', name: 'Lorazepam (CIWA protocol)', dose: '1 or 2 mg', route: 'IV', freq: 'Per CIWA score', prn: true,
        indication: 'CIWA 10–15: 1 mg. CIWA 16 or more: 2 mg. Reassess 1 h after each dose.',
        doses: [{ id: 1, label: '1 mg (CIWA 10–15)' }, { id: 2, label: '2 mg (CIWA 16 or more)' }],
        block: (s, P) => (P.lorazAt !== null && s.t - P.lorazAt < 55) ? 'Given at ' + clock(P.lorazAt) + '. The protocol reassesses 1 hour after each dose.' : null,
        checks: (s, P) => [{ label: 'CIWA score', value: recent(s, P.ciwaAt, 30) ? `${P.lastCiwa} at ${clock(P.ciwaAt)}` : 'Not scored in the last 30 min', ok: recent(s, P.ciwaAt, 30) }, { label: 'Sedation, RR', value: 'Awake, RR 18–20', ok: true }],
        give(s, P, A, dose) {
          const want = P.lastCiwa >= 16 ? 2 : P.lastCiwa >= 10 ? 1 : 0;
          if (!recent(s, P.ciwaAt, 30)) A.judge('423-loraz-blind-' + s.t, 'meds', -2, 'You gave protocol lorazepam without a current CIWA score.', 'Symptom-triggered protocols dose from the score. No score, no dose: you risk oversedation or undertreatment.', '423');
          else if (want === 0) A.judge('423-loraz-low-' + s.t, 'meds', -1, `You gave lorazepam for a CIWA of ${P.lastCiwa}, below the treatment threshold.`, 'Symptom-triggered dosing avoids unnecessary benzodiazepines. Under 10, the protocol says reassess, not medicate.', '423');
          else if (dose !== want) A.judge('423-loraz-dose-' + s.t, 'meds', -1, `You gave ${dose} mg for a CIWA of ${P.lastCiwa}.`, 'The protocol ties the dose to the score. Undertreating lets withdrawal climb; overtreating sedates.', '423');
          else A.judge('423-loraz-ok', 'meds', 2, 'You dosed Mr. Tran\'s lorazepam from a current CIWA score.', 'Score, match the dose to the protocol, reassess in an hour. That\'s symptom-triggered therapy done right.', '423');
          P.lorazAt = s.t; P.relief.push({ t: s.t, amt: dose === 2 ? 11 : 6 });
          return `Lorazepam ${dose} mg IV given. Reassess CIWA in 1 hour.`;
        },
      },
      {
        id: '423-hm', name: 'Hydromorphone', dose: '0.5 mg', route: 'IV', freq: 'Every 3 h as needed, pain 4–10', prn: true,
        block: (s, P) => { const last = P.painRelief.length ? P.painRelief[P.painRelief.length - 1].t : null; return last !== null && s.t - last < 180 ? 'Given at ' + clock(last) + '.' : null; },
        checks: (s, P) => [{ label: 'Pain score', value: recent(s, P.assessAt.pain, 60) ? `${kevinPain(s, P)}/10` : 'Not assessed in the last hour', ok: recent(s, P.assessAt.pain, 60) }, { label: 'Sedation', value: recent(s, P.lorazAt, 60) ? 'Lorazepam within the hour' : 'Awake', ok: !recent(s, P.lorazAt, 60) }],
        give(s, P, A) {
          if (recent(s, P.lorazAt, 30)) A.judge('423-hm-stack', 'meds', -1, 'You gave hydromorphone within 30 minutes of lorazepam.', 'Opioids and benzodiazepines together multiply respiratory depression. Space them and watch sedation closely.', '423');
          P.painRelief.push({ t: s.t, amt: 4 }); return 'Hydromorphone 0.5 mg IV given.';
        },
      },
      { id: '423-panto', name: 'Pantoprazole', dose: '40 mg', route: 'IV', freq: 'Daily', due: 120, checks: () => [{ label: 'Indication', value: 'Gastritis, stress ulcer prevention', ok: true }], give: () => 'Pantoprazole 40 mg IV given.' },
    ],
    talk: (s, P) => (P.seizedAt !== null && s.t - P.seizedAt < 45) ? null : ciwa(s, P) >= 16 && !P.amaDone ? 'kevin_ama' : !P.askedMom ? 'kevin_mom' : 'kevin_idle',
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('423');
        return [
          { id: 'ciwa', label: recent(s, P.ciwaAt, 60) ? `CIWA ${P.lastCiwa} at ${clock(P.ciwaAt)}, up from 9 at 14:00` : 'CIWA score', key: true, need: recent(s, P.ciwaAt, 60), lock: 'Score his CIWA' },
          { id: 'vit', label: `HR ${v.HR}, BP ${v.SBP}/${v.DBP}, T ${v.T}`, key: v.HR > 110, need: true },
          { id: 'hall', label: 'Visual and tactile hallucinations', key: true, need: ciwa(s, P) >= 18 && recent(s, P.assessAt.neuro, 60), lock: 'Assess his neuro status' },
          { id: 'last', label: 'Last drink about 40 h before 15:00', key: true, need: true },
          { id: 'loraz', label: P.lorazAt !== null ? `Lorazepam last at ${clock(P.lorazAt)}` : 'No lorazepam yet', key: false, need: true },
          { id: 'cook', label: 'Worried about his shift at the restaurant', key: false, need: true },
        ];
      },
      respond(s, P, A, picked) {
        if (picked.includes('hall') || (picked.includes('ciwa') && P.lastCiwa >= 16)) {
          if (!P.seizPrec) A.addOrder('423', 'Seizure precautions. Magnesium sulfate 2 g IV. Lorazepam 2 mg IV now, may repeat once in 1 h per CIWA.');
          else A.addOrder('423', 'Magnesium sulfate 2 g IV. Lorazepam 2 mg IV now, may repeat once in 1 h per CIWA.');
          P.relief.push({ t: s.t + 8, amt: 11 }); P.lorazAt = s.t + 8;
          A.judge('423-sbar', 'comm', 2, 'You escalated Mr. Tran\'s worsening withdrawal with the score and the timeline.', 'CIWA, time since last drink and new hallucinations tell the provider exactly where he is on the withdrawal curve.', '423');
          return 'He\'s heading toward DTs. Give 2 of IV lorazepam now, replace his magnesium, seizure precautions. If he needs more than 4 in an hour, he goes to step-down. Thanks for scoring him.';
        }
        if (picked.includes('ciwa')) return 'Keep following the protocol and rescore every hour. Call me if he hallucinates or you\'re giving a lot of lorazepam.';
        return 'Okay. What\'s his CIWA?';
      },
    },
    scene: (s, P) => ({ iv: 'running', tray: P.trayIn && !P.trayGone ? (P.ate ? 'barely' : 'full') : 'none', fallPrec: P.seizPrec }),
    clues: (s, P) => ({
      tray: P.ate ? 'Dinner tray, half eaten. He\'s supposed to be NPO.' : 'A full dinner tray: chicken, rice, a roll. His diet order is NPO.',
      iv: P.dexAt !== null ? 'D5 ½NS with 20 mEq KCl at 150 mL/h.' : 'Lactated Ringer\'s at 150 mL/h. Order: change to D5 ½NS at 16:00, after thiamine.',
      alarm: P.seizPrec ? 'Padded rails, suction ready at the headwall.' : 'Bed at working height, rails bare.',
    }),
    rig(s, P) {
      const c = ciwa(s, P), post = P.seizedAt !== null && s.t - P.seizedAt < 45;
      return { tremor: post ? 0 : clamp((c - 6) / 14, 0, 1), sweat: clamp((c - 9) / 12, 0, 1), anxious: post ? 0 : clamp((c - 8) / 12, 0, 1), confused: !post && c >= 18, alert: post ? 2 : recent(s, P.lorazAt, 60) && c < 10 ? 1 : 0 };
    },
    status: (s, P) => (ciwa(s, P) >= 18 || (P.seizedAt !== null && s.t - P.seizedAt < 30)) ? 'urgent' : ciwa(s, P) >= 12 ? 'watch' : 'stable',
    outcome(s, P) {
      if (P.seizedAt !== null) return { tone: 'bad', title: 'Withdrawal seizure', text: `Generalized seizure at ${clock(P.seizedAt)} with CIWA in the 20s. Symptom-triggered lorazepam, given on time, prevents this.${P.seizPrec ? ' Seizure precautions kept him from injury.' : ' No precautions were in place.'}` };
      if (ciwa(s, P) >= 16) return { tone: 'mixed', title: 'Withdrawal escalating at handoff', text: `CIWA ${ciwa(s, P)} at 20:00 and climbing. The night nurse inherits a patient heading toward delirium tremens.` };
      return { tone: P.thiaAt !== null && P.dexAt !== null && P.dexAt > P.thiaAt ? 'good' : 'mixed', title: 'Withdrawal controlled', text: `CIWA ${ciwa(s, P)} at handoff.${P.thiaAt === null ? ' Thiamine never went in.' : ''}${P.ate ? ' He ate a tray he shouldn\'t have had.' : ''}` };
    },
  };

  /* ---------- 425 Beatrice Nakamura: upper GI bleed, transfusion ---------- */
  const reacting = (P) => P.rsev > 0.5;
  const bea = {
    id: '425', room: '425', name: 'Beatrice Nakamura', short: 'Mrs. Nakamura', age: 79, sex: 'F', mrn: '00481822', dob: '03/11/1947',
    look: { skin: '#EACBAE', shade: '#C9A281', lip: '#AD6660', blush: '#E3978A', iris: '#20150F', head: { w: 53, h: 58, jaw: .2 }, eye: 9.2,
      hair: { style: 'bun', color: '#D9D6D1' }, brow: { w: 2.8, color: '#A9A49E' }, body: { w: 64, cloth: 'gown', cardigan: '#7C8FA8' }, extras: ['thinGlasses', 'wrinkles', 'studs'], glasses: '#B8963E', smile: .35,
      lines: { calm: 'My granddaughter plays Chopin now. Badly, but with feeling.', chills: 'I\'m so cold. And my back, dear. Something is wrong.', anxious: 'Something is wrong. I can feel it.', drowsy: 'Just resting my eyes.', dizzy: 'The room tilts when I sit up.', none: 'She doesn\'t respond to her name.' } },
    bio: 'Retired piano teacher. Hard of hearing on the left: stand on her right. Took ibuprofen for years for arthritic knees. Daughter-in-law Keiko visits after work.',
    dx: 'Upper GI bleed, gastric ulcer', reason: 'Upper GI bleed from an NSAID-related gastric ulcer',
    hx: ['Gastric ulcer, endoscopy this morning with clips', 'Osteoarthritis, both knees', 'Atrial fibrillation, apixaban held'],
    allergies: 'Sulfa (rash)', code: 'DNR, OK for transfusion and fluids', weight: '52 kg',
    lines: ['PIV 18g right antecubital (for blood)', 'PIV 20g left hand: pantoprazole infusion'], mobility: 'Bed rest with bathroom privileges using the commode. Fall risk.', diet: 'Clear liquids',
    init: { unit: null, checked: false, mismatch: false, returned: false, rightUnitAt: null, transAt: null, transUnit: null, stopped: null, ns: false, bankSent: false, rsev: 0, reactionAt: null, vit15: false, doneAt: null, hgb: 6.9, apapAt: null, ibuGiven: false, ibuStopped: false, fell: false, icu: false, walkAsked: false },
    nightVitals: { T: 36.9, HR: 104, SBP: 102, DBP: 58, RR: 18, SpO2: 97, O2: 'Room air', pain: 2 },
    labs: [
      { name: 'Hemoglobin', val: 6.9, unit: 'g/dL', ref: '12–16 (8.4 yesterday)', flag: 'L', t: -90 },
      { name: 'Platelets', val: 182, unit: 'K/µL', ref: '150–400', flag: '', t: -90 },
      { name: 'BUN / creatinine', val: '42 / 1.0', unit: 'mg/dL', ref: 'BUN 7–20', flag: 'H', t: -90 },
      { name: 'Type and crossmatch', val: 'O positive, antibody screen negative. 2 units crossmatched.', unit: '', ref: '', flag: '', t: -80 },
    ],
    orders: [
      { t: -80, text: 'Transfuse 2 units packed red blood cells, each over 2 hours. Vital signs before, at 15 minutes, and after each unit.' },
      { t: -500, text: 'Pantoprazole 8 mg/h IV infusion. Clear liquids. Hemoglobin every 6 h.' },
      { t: -500, text: 'Acetaminophen 650 mg PO every 6 h as needed for pain. Hold apixaban.' },
      { t: -2000, text: 'Ibuprofen 400 mg PO every 6 h as needed for arthritis pain (home medication, admission reconciliation).' },
    ],
    notes: [
      { t: -120, author: 'GI, endoscopy', text: 'Large gastric ulcer with visible vessel, clipped. NSAID-related. Stop all NSAIDs. PPI infusion 72 h. Transfuse to Hgb above 7.' },
      { t: -60, author: 'Marisol, day RN', text: 'One black tarry stool at 13:30. Dizzy sitting up. Blood bank says her first unit will be ready around 15:20. Hard of hearing on the left.' },
    ],
    io: { intake: 'IV 900 mL, PO 300 mL', output: 'Urine 450 mL, one melena stool' },
    report: [
      { text: 'Bea Nakamura, 79, upper GI bleed from an ulcer. Scoped this morning, they clipped it. DNR, but she wants blood and fluids.', key: false },
      { text: 'Hemoglobin 6.9, down from 8.4. Heart rate\'s been 100 to 105, pressure around 100.', key: true },
      { text: 'Two units ordered. Blood bank says the first one is ready around 15:20.', key: true },
      { text: 'She had a black tarry stool at 13:30 and she\'s dizzy when she sits up. Commode only.', key: true },
      { text: 'She\'s hard of hearing on the left. Talk to her right side.', key: false },
      { text: 'She taught piano for 50 years. Ask her about her students.', key: false },
    ],
    vitals(s, P) {
      const r = P.rsev, done = P.doneAt !== null && s.t > P.doneAt;
      const baseHR = done ? 92 : P.transAt !== null && P.transUnit === 'right' && s.t > P.transAt + 60 ? 98 : 104;
      const sbp = Math.round((done ? 112 : 102) - r * 1.3) + jit(s, 6) * 2;
      return { T: +clamp(36.9 + r * .09, 36.5, 39.6).toFixed(1), HR: Math.round(baseHR + r * 1.3) + jit(s, 7), SBP: sbp, DBP: Math.round(sbp * .58), RR: Math.round(18 + r * .25), SpO2: Math.round(97 - r * .1), O2: 'Room air', pain: r > 8 ? 7 : 2 };
    },
    assess: {
      general: (s, P) => reacting(P) ? 'Shaking under the blanket, pale, clutching her lower back. "Something is wrong, dear."' : 'Small in the bed, pale lips, alert. Reading glasses on, sheet music in her lap.',
      resp: (s, P) => reacting(P) ? 'Breathing faster, clear lungs.' : 'Clear, unlabored.',
      cardiac: (s, P, A) => `HR ${A.vitals('425').HR}, irregular (AFib). Pale conjunctivae. Cap refill 3 seconds.`,
      neuro: () => 'Alert, oriented. Hard of hearing on the left.',
      pain: (s, P) => reacting(P) ? 'New pain in her lower back and flanks, 7/10, and a burning at the IV site.' : 'Knees ache, 2/10. "My old friend."',
      skin: (s, P) => reacting(P) ? 'Flushed face, hives across her chest, cool hands.' : 'Pale, cool hands. No bruising.',
      gi: (s, P) => `Abdomen soft, mildly tender in the epigastrium. One melena stool this afternoon.${reacting(P) ? ' Urine in the commode is dark red-brown.' : ''}`,
    },
    interventions: [
      {
        id: 'pickup', label: 'Pick up her unit from blood bank', cost: 8, avail: (s, P) => !P.unit && P.transAt === null && s.t >= 20 && (!P.returned || s.t >= P.rightUnitAt),
        run(s, P) {
          P.unit = P.returned ? 'right' : 'wrong'; P.checked = false;
          return P.unit === 'wrong' ? 'Unit in hand. Tag: NAKAMURA, BEATRICE. MRN 00418822. O positive. Unit W0412 26 004871. Expires in 21 days. Start within 30 minutes of pickup.' : 'Unit in hand. Tag: NAKAMURA, BEATRICE. MRN 00481822. DOB 03/11/1947. O positive. Unit W0412 26 004902. Start within 30 minutes of pickup.';
        },
      },
      {
        id: 'check', label: 'Two-person bedside check with Nova', cost: 4, avail: (s, P) => !!P.unit && !P.checked,
        run(s, P, A) {
          P.checked = true;
          if (P.unit === 'wrong') { P.mismatch = true; A.judge('425-check', 'safety', 3, 'Your two-person bedside check caught a wrong-blood unit.', 'The unit\'s MRN (00418822) had two digits transposed from her wristband (00481822). Name and blood type matched, which is exactly why every identifier gets read aloud, every time. ABO-incompatible transfusion kills.', '425'); return 'Nova reads the tag aloud. You read the wristband. "MRN zero-zero-four-one-eight..." "Four-EIGHT-one." You both stop. The name and type match, the MRN doesn\'t. This isn\'t her unit.'; }
          A.judge('425-check-2', 'safety', 1, 'You did the two-person check on Mrs. Nakamura\'s second unit too.', 'Every unit, every time. The check is only protective if it\'s never skipped.', '425');
          return 'Name, DOB, MRN, O positive, unit number, expiry: all match. Both of you sign.';
        },
      },
      {
        id: 'return', label: 'Return the unit and report the mismatch to blood bank', cost: 6, avail: (s, P) => P.mismatch && P.unit === 'wrong',
        run(s, P, A) { P.unit = null; P.returned = true; P.rightUnitAt = s.t + 25; A.judge('425-return', 'comm', 1, 'You returned the mismatched unit and reported it.', 'A labeling error is a system problem. Reporting it protects the next patient, possibly the other Nakamura in the building.', '425'); return 'Blood bank: "There\'s a Beatrice Nakamura on 6 East with a similar MRN. We\'re pulling the error. Her correct unit will be up in about 25 minutes." You file a safety report.'; },
      },
      {
        id: 'start', label: 'Start the transfusion, slow for the first 15 minutes', cost: 4, avail: (s, P) => !!P.unit && P.transAt === null,
        run(s, P, A) {
          if (P.mismatch && P.unit === 'wrong') A.judge('425-start-known', 'safety', -5, 'You hung a unit you knew didn\'t match Mrs. Nakamura.', 'A mismatch at the bedside check is an absolute stop. Never transfuse a unit that fails verification.', '425');
          else if (!P.checked) A.judge('425-nocheck', 'safety', -3, 'You started blood without the two-person bedside check.', 'The bedside check is the last barrier against ABO-incompatible transfusion. Two licensed people, every identifier, at the bedside.', '425');
          if (!recent(s, P.k.vitalsAt, 30)) A.judge('425-nobase', 'assess', -1, 'You started the transfusion without baseline vital signs.', 'Without a baseline temperature and blood pressure, you can\'t recognize the change that signals a reaction.', '425');
          else A.judge('425-base', 'assess', 1, 'You took baseline vitals right before the transfusion.', 'Reactions show up as change: temperature up, blood pressure down. You need the before to see the after.', '425');
          P.transAt = s.t; P.transUnit = P.unit; P.unit = null;
          return 'Blood running at 60 mL/h for the first 15 minutes, through a filtered set with normal saline only. Most severe reactions show up in the first 15 minutes.';
        },
      },
      {
        id: 'stay', label: 'Stay at the bedside for the first 15 minutes', cost: 15, avail: (s, P) => P.transAt !== null && P.stopped === null && s.t - P.transAt < 15,
        run(s, P, A) {
          P.vit15 = true; A.recordVitals('425', 'You');
          const v = A.vitals('425');
          if (reacting(P)) { A.judge('425-stay', 'assess', 2, 'You stayed with Mrs. Nakamura for the first 15 minutes and saw the reaction start.', 'Acute hemolytic reactions start within minutes: fever, chills, back pain, hypotension, a sense of doom. Being in the room is what makes early recognition possible.', '425'); return `Eight minutes in she grabs your wrist. "I'm so cold, and my back." T ${v.T}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}. Hives across her chest.`; }
          A.judge('425-stay', 'assess', 1, 'You watched Mrs. Nakamura through the first 15 minutes of her transfusion.', 'The first 15 minutes carry most of the risk of a severe reaction. Vitals were stable, so the rate can go up.', '425');
          return `15 minutes: T ${v.T}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}. No reaction. Rate up to finish over 2 hours.`;
        },
      },
      {
        id: 'stop', label: 'Stop the transfusion', cost: 1, avail: (s, P) => P.transAt !== null && P.stopped === null && P.doneAt === null, urgent: true,
        run(s, P, A) {
          P.stopped = s.t;
          if (reacting(P)) { A.judge('425-stop', 'safety', s.t - P.reactionAt <= 10 ? 3 : 1, 'You stopped the transfusion at the first signs of a reaction.', 'Stop first, then everything else. Every milliliter of incompatible blood makes hemolysis worse.', '425'); return 'Clamped at the bag. The blood stops.'; }
          A.judge('425-stop-none', 'judgment', -1, 'You stopped Mrs. Nakamura\'s transfusion without signs of a reaction.', 'She needs this blood. Stop for fever, chills, hives, back pain, dyspnea or hypotension, not by default.', '425');
          return 'Transfusion stopped. Her hemoglobin is still 6.9.';
        },
      },
      {
        id: 'ns', label: 'Hang normal saline with new tubing at the hub', cost: 3, avail: (s, P) => P.stopped !== null && !P.ns,
        run(s, P, A) { P.ns = true; A.judge('425-ns', 'safety', 1, 'You kept the vein open with new tubing and saline.', 'The old tubing is full of the incompatible blood. New tubing at the hub keeps access without pushing more in.', '425'); return 'New tubing spiked to normal saline at the hub. Blood tubing capped and bagged.'; },
      },
      {
        id: 'bank', label: 'Send bag, tubing, blood and urine samples to blood bank', cost: 4, avail: (s, P) => P.stopped !== null && P.reactionAt !== null && !P.bankSent,
        run(s, P, A) { P.bankSent = true; A.judge('425-bank', 'comm', 1, 'You sent the bag, tubing and samples for the transfusion reaction workup.', 'Blood bank needs the unit and fresh samples to confirm hemolysis and trace the error.', '425'); return 'Bag, tubing, two tubes and a urine sample go down with a reaction form.'; },
      },
    ],
    meds: [
      { id: '425-ppi', name: 'Pantoprazole infusion', dose: '8 mg/h', route: 'IV', freq: 'Continuous', initStatus: 'given', givenNote: 'Running since 08:00' },
      {
        id: '425-apap', name: 'Acetaminophen', dose: '650 mg', route: 'PO', freq: 'Every 6 h as needed, pain', prn: true,
        block: (s, P) => P.apapAt !== null && s.t - P.apapAt < 360 ? 'Given at ' + clock(P.apapAt) + '.' : null,
        checks: () => [{ label: 'Indication', value: 'Arthritic knee pain', ok: true }],
        give(s, P, A) { P.apapAt = s.t; if (P.walkAsked || s.t >= 100) A.judge('425-apap', 'meds', 1, 'You treated Mrs. Nakamura\'s knee pain with acetaminophen.', 'Acetaminophen doesn\'t injure the stomach lining or affect platelets. It\'s the right choice after an ulcer bleed.', '425'); return 'Acetaminophen 650 mg given.'; },
      },
      {
        id: '425-ibu', name: 'Ibuprofen', dose: '400 mg', route: 'PO', freq: 'Every 6 h as needed, arthritis', prn: true, available: (s, P) => !P.ibuStopped,
        checks: () => [{ label: 'Diagnosis', value: 'Bleeding NSAID-related gastric ulcer', ok: false }, { label: 'GI note', value: 'Stop all NSAIDs', ok: false }],
        give(s, P, A) { P.ibuGiven = true; P.rebleed = s.t; A.judge('425-ibu', 'meds', -4, 'You gave ibuprofen to a patient bleeding from an NSAID ulcer.', 'The home medication survived reconciliation, but the GI note said stop all NSAIDs. An order being active doesn\'t make it safe. Catching conflicts like this is a core nursing check.', '425'); return 'Ibuprofen 400 mg given.'; },
      },
    ],
    talk: (s, P) => P.icu ? null : reacting(P) ? 'bea_react' : s.t >= 90 && !P.ibuStopped ? 'bea_knees' : 'bea_idle',
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('425');
        return [
          { id: 'react', label: 'Chills, fever, back pain, hives, BP falling during transfusion', key: true, need: reacting(P) && (P.vit15 || recent(s, P.assessAt.general, 30) || recent(s, P.k.vitalsAt, 30)), lock: 'No reaction observed' },
          { id: 'stopped', label: P.stopped !== null ? `Transfusion stopped at ${clock(P.stopped)}` : 'Transfusion running', key: P.stopped !== null && reacting(P), need: P.transAt !== null, lock: 'No transfusion started' },
          { id: 'vit', label: `T ${v.T}, HR ${v.HR}, BP ${v.SBP}/${v.DBP} (at ${clock(v.t)})`, key: true, need: true },
          { id: 'mismatch', label: 'Unit MRN didn\'t match her wristband', key: P.mismatch, need: P.mismatch, lock: 'No mismatch found' },
          { id: 'hgb', label: `Hemoglobin ${P.doneAt !== null && s.t > P.doneAt + 15 ? '7.9 after 1 unit' : '6.9'}`, key: true, need: true },
          { id: 'nsaid', label: 'Ibuprofen still active on her MAR', key: true, need: s.t >= 60 || P.k.labsSeen !== undefined, lock: 'Review her MAR' },
          { id: 'piano', label: 'Taught piano for 50 years', key: false, need: true },
        ];
      },
      respond(s, P, A, picked) {
        const out = [];
        if (picked.includes('nsaid') && !P.ibuStopped) { P.ibuStopped = true; A.addOrder('425', 'Discontinue ibuprofen. No NSAIDs.'); out.push('Good catch on the ibuprofen, I\'ve discontinued it.'); A.judge('425-nsaid', 'meds', 2, 'You flagged the ibuprofen order still active on Mrs. Nakamura\'s MAR.', 'Reconciliation errors survive until someone reads the MAR against the diagnosis. That someone is usually the nurse.', '425'); }
        if (picked.includes('react') && reacting(P)) {
          A.addOrder('425', 'Transfusion reaction workup: DAT, repeat type and screen, CBC, bilirubin, LDH, haptoglobin, UA. Normal saline 500 mL bolus. Keep urine output over 100 mL/h.');
          if (P.stopped !== null) { A.judge('425-sbar', 'comm', 2, 'You reported the transfusion reaction after stopping the blood.', 'Stop, keep the line open, notify the provider and blood bank, send samples. You did the first step first.', '425'); out.push('You did the right thing stopping it. Saline bolus, full reaction workup, and watch her urine. I\'m coming up.'); }
          else { A.judge('425-sbar-running', 'safety', -2, 'You called about the reaction while the blood was still running.', 'Stop the transfusion first. The call can wait 10 seconds; the hemolysis can\'t.', '425'); out.push('Stop the blood right now! Then saline with new tubing, and I\'m on my way.'); }
        }
        return out.length ? out.join(' ') : 'Okay. Let me know how the transfusion goes.';
      },
    },
    scene: (s, P) => ({ iv: P.transAt !== null && P.stopped === null && P.doneAt === null ? 'blood' : 'running', bloodHung: P.stopped !== null, commode: true, tray: 'clear', empty: P.icu }),
    clues: (s, P) => ({
      iv: P.transAt !== null && P.stopped === null && P.doneAt === null ? 'Packed red cells running through the 18g in her right arm.' : P.stopped !== null ? 'Blood clamped and capped. Saline running.' : 'Pantoprazole infusion at 8 mg/h in her left hand. The 18g in her right arm is saved for blood.',
      commode: reacting(P) ? 'In the commode: dark red-brown urine.' : 'Bedside commode. Black, tarry stool from earlier, saved for the nurse to see.',
      tray: 'Clear liquids: broth, gelatin, tea. She\'s had the tea.',
    }),
    rig: (s, P) => ({ pale: clamp((8.4 - (P.doneAt !== null && s.t > P.doneAt ? 7.9 : 6.9)) / 2.5, 0, 1), chills: P.rsev > 5, anxious: P.rsev > 8 ? .7 : 0, alert: P.fell ? 1 : 0 }),
    status: (s, P) => P.icu ? 'gone' : reacting(P) ? 'urgent' : 'watch',
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Acute hemolytic reaction, ICU', text: 'Wrong-blood transfusion with shock and dark urine. The bedside check would have caught the transposed MRN.' };
      if (P.fell) return { tone: 'bad', title: 'Fell walking to the bathroom', text: 'Hemoglobin under 7, orthostatic, and up alone. Found on the floor with a scalp laceration.' };
      if (P.reactionAt !== null) return { tone: 'mixed', title: 'Transfusion reaction, caught', text: `Reaction recognized and the blood stopped ${P.stopped !== null ? 'at ' + clock(P.stopped) : 'late'}. She's stabilizing, but a wrong unit reached her.` };
      if (P.doneAt !== null) return { tone: P.ibuGiven ? 'mixed' : 'good', title: 'Transfused safely', text: 'First unit in, hemoglobin 7.9, heart rate settling.' + (P.ibuGiven ? ' She got ibuprofen, though.' : P.ibuStopped ? ' The ibuprofen order is gone.' : '') };
      if (P.transAt !== null) return { tone: 'good', title: 'Transfusion running', text: 'Correct unit verified and running at handoff.' };
      return { tone: 'mixed', title: 'Still waiting for blood', text: 'Hemoglobin 6.9 at handoff with blood available. The next shift inherits a symptomatic anemia.' };
    },
  };

  /* ---------- 427 Darnell Brooks: AKI on CKD, hyperkalemia ---------- */
  function darnellK(s, P) {
    let k = 6.55 + s.t * .0025 + (P.spiroAt !== null ? .5 : 0) + (P.ate ? .3 : 0);
    if (P.insAt !== null) { const d = s.t - P.insAt; k -= d < 30 ? .9 * d / 30 : d < 240 ? .9 : .9 - (d - 240) * .004; }
    if (P.lokAt !== null) k -= clamp((s.t - P.lokAt) / 180, 0, 1) * .6;
    return +clamp(k, 3.5, 8).toFixed(1);
  }
  function darnellBG(s, P) {
    let g = 118;
    if (P.insAt !== null) { const d = s.t - P.insAt; g += d < 15 ? 60 * (d / 15) : d < 70 ? 60 - (d - 15) * 2.2 : d < 150 ? -61 : -61 + (d - 150) * .5; }
    if (P.juiceAt !== null && s.t > P.juiceAt) g += Math.min(50, (s.t - P.juiceAt) * 3);
    return Math.round(clamp(g, 40, 300));
  }
  const darnell = {
    id: '427', room: '427', name: 'Darnell Brooks', short: 'Mr. Brooks', age: 52, sex: 'M', mrn: '00264037',
    look: { skin: '#5E3A26', shade: '#462A1A', lip: '#4A2519', blush: '#96503F', iris: '#1F130D', head: { w: 62, h: 64, jaw: .7 }, eye: 9.8,
      hair: { style: 'balding', color: '#6B625C' }, brow: { w: 4.8, color: '#3E3631' }, body: { w: 100, cloth: 'gown' }, extras: ['beard', 'thinGlasses'], glasses: '#222222', smile: .55,
      lines: { calm: 'Tell my JV kids I\'m running suicides with them Monday. Tell them I said it with love.', hypo: 'Whoa. I\'m sweating like it\'s the fourth quarter.', drowsy: 'Just resting my legs, coach.', none: 'He doesn\'t answer.' } },
    bio: 'High school basketball coach and history teacher. Big laugh. Wife Tanya works nights as a 911 dispatcher.',
    dx: 'AKI on CKD stage 4, hyperkalemia', reason: 'Acute kidney injury on chronic kidney disease after a stomach bug',
    hx: ['CKD stage 4 (baseline creatinine 2.6)', 'Hypertension', 'Heart failure with preserved EF'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '112 kg',
    lines: ['PIV 20g left forearm, saline lock', 'Telemetry'], mobility: 'Up ad lib.', diet: 'Renal diet: 2 g potassium, 2 g sodium',
    init: { notified: false, critAt: null, hkOrders: false, caAt: null, insAt: null, lokAt: null, spiroAt: null, spiroHeld: false, trayIn: false, traySwapped: false, ate: false, bgAt: null, lastBG: null, bgs: [], juiceAt: null, hypo: false, stripAt: null, arrhythmia: false, icu: false, talked: false },
    nightVitals: { T: 36.8, HR: 78, SBP: 158, DBP: 92, RR: 16, SpO2: 97, O2: 'Room air', pain: 0 },
    labs: [
      { name: 'Potassium', val: 5.8, unit: 'mmol/L', ref: '3.5–5.0', flag: 'H', t: -540 },
      { name: 'Creatinine', val: 3.9, unit: 'mg/dL', ref: '0.7–1.3 (baseline 2.6)', flag: 'H', t: -540 },
      { name: 'BUN', val: 68, unit: 'mg/dL', ref: '7–20', flag: 'H', t: -540 },
      { name: 'Bicarbonate', val: 18, unit: 'mmol/L', ref: '22–28', flag: 'L', t: -540 },
      { name: 'Glucose', val: 118, unit: 'mg/dL', ref: '70–99', flag: 'H', t: -540 },
      { name: 'Potassium (repeat)', val: 'Pending, drawn 14:30', unit: '', ref: '', flag: '', t: -30 },
    ],
    orders: [
      { t: -1500, text: 'Telemetry. Renal diet: 2 g potassium, 2 g sodium. Strict I&O.' },
      { t: -1500, text: 'Hold lisinopril. Spironolactone 25 mg PO daily at 17:00. Heparin 5,000 units subQ every 8 h.' },
      { t: -600, text: 'Repeat BMP at 14:30. Call with potassium over 6.0.' },
    ],
    notes: [
      { t: -60, author: 'Marisol, day RN', text: 'Urine output about 25 mL/h. Repeat potassium drawn at 14:30. Wife called, will visit after her shift. He\'s been grading history essays.' },
    ],
    io: { intake: 'PO 800 mL, IV 1,000 mL', output: 'Urine 300 mL (12 h)' },
    report: [
      { text: 'Darnell Brooks, 52, kidney injury on top of stage 4 CKD after a GI bug. Full code, on tele.', key: false },
      { text: 'Potassium was 5.8 this morning. We sent a repeat at 14:30, still pending.', key: true },
      { text: 'Urine output\'s low, about 25 an hour. Creatinine 3.9, his baseline is 2.6.', key: true },
      { text: 'Spironolactone at 17:00 is still on his MAR. Lisinopril\'s held.', key: true },
      { text: 'He\'s a basketball coach. He\'ll try to get you to agree the Warriors need a center.', key: false },
    ],
    vitals(s, P) {
      const k = darnellK(s, P), g = darnellBG(s, P), hypo = g < 70;
      return { T: 36.8, HR: (k >= 6.8 && !recent(s, P.caAt, 60) ? 54 : 76 + (hypo ? 22 : 0)) + jit(s, 8), SBP: 154 + jit(s, 9) * 2, DBP: 90, RR: 16, SpO2: 97, O2: 'Room air', pain: 0, rhythm: k >= 6.2 ? 'Sinus with peaked T waves' : 'Normal sinus' };
    },
    assess: {
      general: (s, P) => darnellBG(s, P) < 70 ? 'Sweating, shaky, pale. "Something\'s off, man."' : darnellK(s, P) >= 6.6 ? 'Sitting up, rubbing his thighs. "My legs feel heavy. Like after two-a-days."' : 'Grading a stack of history essays with a red pen, chatting.',
      resp: () => 'Fine crackles at the bases. No distress.',
      cardiac: (s, P, A) => { P.stripAt = s.t; const k = darnellK(s, P); return `HR ${A.vitals('427').HR}. ${k >= 6.2 ? 'Monitor shows tall, narrow, peaked T waves.' : 'Monitor shows normal T waves.'} 1+ ankle edema.`; },
      neuro: (s, P) => darnellK(s, P) >= 6.6 ? 'Alert. Proximal leg weakness, 4/5. Tingling in his hands.' : 'Alert, oriented, strength 5/5.',
      pain: () => 'No pain.',
      skin: (s, P) => darnellBG(s, P) < 70 ? 'Cool, clammy.' : 'Warm, dry. Mild pitting edema at the ankles.',
      gi: (s, P) => { P.k.io = s.t; return `Urine output about 20 mL/h, dark. ${P.trayIn && !P.traySwapped ? 'Dinner tray has a banana and orange juice.' : 'Tolerating his diet.'}`; },
    },
    interventions: [
      { id: 'strip', label: 'Look at his monitor strip', cost: 1, run(s, P, A) { P.stripAt = s.t; const k = darnellK(s, P); if (k >= 6.2) A.judge('427-strip', 'assess', 1, 'You looked at Mr. Brooks\'s rhythm strip in the context of his potassium.', 'Peaked T waves are the earliest ECG sign of hyperkalemia. The monitor is an assessment tool, not wallpaper.', '427'); return k >= 6.2 ? 'Tall, narrow, tented T waves in every beat. Rate 76, sinus.' : 'Normal sinus rhythm, normal T waves.'; } },
      { id: 'bg', label: 'Check blood glucose', cost: 3, run(s, P, A) { const g = darnellBG(s, P); P.bgAt = s.t; P.lastBG = g; P.bgs.push({ t: s.t, val: g, by: 'You' }); if (P.insAt !== null && s.t - P.insAt >= 30 && s.t - P.insAt <= 130) A.judge('427-bg', 'judgment', 1, 'You checked Mr. Brooks\'s glucose after IV insulin.', 'IV insulin shifts potassium into cells and glucose with it. In kidney failure insulin lasts longer, so hypoglycemia can come 1 to 3 hours later.', '427'); return `Glucose ${g} mg/dL.${g < 70 ? ' Low.' : ''}`; } },
      { id: 'tray', label: 'Swap the dinner tray for a renal-diet tray', cost: 3, avail: (s, P) => P.trayIn && !P.traySwapped && !P.ate, run(s, P, A) { P.traySwapped = true; A.judge('427-tray', 'safety', 1, 'You caught a high-potassium dinner tray for a hyperkalemic patient.', 'Bananas, orange juice and potatoes are loaded with potassium. Diet orders get mixed up; the nurse at the bedside is the last check.', '427'); return 'Dietary sends up a renal tray: chicken, rice, green beans, apple juice. "Man. I was looking forward to that banana."'; } },
      { id: 'juice', label: 'Give 4 oz apple juice (15 g fast carbs)', cost: 2, avail: (s, P) => darnellBG(s, P) < 70 && (P.juiceAt === null || s.t - P.juiceAt > 20), urgent: true, run(s, P, A) { P.juiceAt = s.t; A.judge('427-juice', 'safety', 2, 'You treated Mr. Brooks\'s low glucose with apple juice.', 'Apple juice is a low-potassium fast carb. Orange juice would have fixed the glucose and fed the hyperkalemia.', '427'); return 'He drinks the apple juice. Recheck in 15 minutes.'; } },
    ],
    meds: [
      {
        id: '427-spiro', name: 'Spironolactone', dose: '25 mg', route: 'PO', freq: 'Daily at 17:00', due: 120,
        checks: (s, P) => [{ label: 'Potassium', value: P.critAt !== null ? '6.6 (critical) at ' + clock(P.critAt) : '5.8 this morning, repeat pending', ok: false }, { label: 'Kidney function', value: 'Creatinine 3.9, rising', ok: false }],
        give(s, P, A) { P.spiroAt = s.t; A.judge('427-spiro', 'meds', -3, 'You gave spironolactone to a patient with hyperkalemia and acute kidney injury.', 'Spironolactone blocks potassium excretion. The order was still active, but the potassium and creatinine made it dangerous. Hold and clarify.', '427'); return 'Spironolactone 25 mg given.'; },
        hold(s, P, A) { P.spiroHeld = true; A.judge('427-spiro-hold', 'meds', 2, 'You held Mr. Brooks\'s spironolactone.', 'A potassium-sparing diuretic with a potassium above 6 and a failing kidney: hold it, and tell the provider so the order goes away.', '427'); return 'Held: hyperkalemia and AKI. Notify the provider.'; },
      },
      { id: '427-hep', name: 'Heparin', dose: '5,000 units', route: 'SubQ', freq: 'Every 8 h', due: 60, checks: () => [{ label: 'Platelets', value: '210 K/µL', ok: true }], give: () => 'Heparin 5,000 units subQ, abdomen.' },
      {
        id: '427-ca', name: 'Calcium gluconate', dose: '1 g', route: 'IV', freq: 'Once, over 10 min', prn: true, available: (s, P) => P.hkOrders, block: (s, P) => P.caAt !== null ? 'Given at ' + clock(P.caAt) + '.' : null,
        checks: () => [{ label: 'Why first', value: 'Stabilizes the heart muscle within minutes. Doesn\'t lower potassium.', ok: true }],
        give(s, P, A) { P.caAt = s.t; A.judge('427-ca', 'judgment', P.insAt === null ? 2 : 1, P.insAt === null ? 'You gave calcium gluconate first.' : 'You gave calcium gluconate after the insulin.', 'Calcium protects the heart from arrhythmia within minutes while insulin and binders lower the potassium. Protect the heart first.', '427'); return 'Calcium gluconate 1 g IV over 10 minutes. The T waves soften on the monitor.'; },
      },
      {
        id: '427-ins', name: 'Insulin regular + dextrose 50%', dose: '10 units + 25 g', route: 'IV', freq: 'Once', prn: true, available: (s, P) => P.hkOrders, block: (s, P) => P.insAt !== null ? 'Given at ' + clock(P.insAt) + '.' : null,
        checks: (s, P) => [{ label: 'Glucose before', value: P.bgAt !== null ? `${P.lastBG} at ${clock(P.bgAt)}` : 'Not checked', ok: recent(s, P.bgAt, 60) }, { label: 'After', value: 'Glucose every hour for 4 hours (kidney failure prolongs insulin)', ok: null }],
        give(s, P, A) { P.insAt = s.t; if (!recent(s, P.bgAt, 60)) A.judge('427-ins-bg', 'assess', -1, 'You gave IV insulin without a baseline glucose.', 'You need the starting number to judge the drop that follows.', '427'); return 'Regular insulin 10 units IV, then dextrose 50% 25 g IV. Potassium shifts into cells over 15 to 30 minutes. Glucose checks every hour.'; },
      },
      {
        id: '427-lok', name: 'Sodium zirconium cyclosilicate', dose: '10 g', route: 'PO', freq: 'Once', prn: true, available: (s, P) => P.hkOrders, block: (s, P) => P.lokAt !== null ? 'Given at ' + clock(P.lokAt) + '.' : null,
        checks: () => [{ label: 'Why', value: 'Binds potassium in the gut: removes it, slowly', ok: true }],
        give(s, P) { P.lokAt = s.t; return 'Sodium zirconium cyclosilicate 10 g in water.'; },
      },
    ],
    talk: (s, P) => (P.icu ? null : !P.talked ? 'darnell_dialysis' : 'darnell_idle'),
    sbar: {
      items(s, P, A) {
        return [
          { id: 'k', label: 'Potassium 6.6, critical (5.8 this morning)', key: true, need: P.critAt !== null, lock: 'Repeat potassium not back' },
          { id: 'ecg', label: 'Peaked T waves on the monitor', key: true, need: P.stripAt !== null && darnellK(s, P) >= 6.2, lock: 'Look at his rhythm strip' },
          { id: 'uop', label: 'Urine output about 20 mL/h, creatinine 3.9 (baseline 2.6)', key: true, need: true },
          { id: 'spiro', label: P.spiroHeld ? 'Held his 17:00 spironolactone' : 'Spironolactone 25 mg still ordered for 17:00', key: true, need: true },
          { id: 'weak', label: 'New leg weakness and tingling', key: true, need: darnellK(s, P) >= 6.6 && P.assessAt.neuro !== undefined, lock: 'Do a neuro check' },
          { id: 'tray', label: 'Dinner tray came with a banana and orange juice', key: false, need: P.trayIn },
          { id: 'hoops', label: 'Coaches JV basketball', key: false, need: true },
        ];
      },
      respond(s, P, A, picked) {
        const out = [];
        if (picked.includes('k') && !P.hkOrders) {
          P.hkOrders = true; P.notified = true;
          A.addOrder('427', 'Calcium gluconate 1 g IV now. Regular insulin 10 units IV with dextrose 50% 25 g. Sodium zirconium cyclosilicate 10 g PO. Glucose every hour × 4. Repeat BMP in 2 h. Nephrology consult.');
          const late = s.t - P.critAt;
          A.judge('427-crit', 'comm', late <= 20 ? 2 : late <= 45 ? 0 : -2, late <= 20 ? 'You reported Mr. Brooks\'s critical potassium promptly.' : `You reported the critical potassium ${late} minutes after the lab called.`, 'Critical values go to the provider right away, ideally within 15 to 30 minutes, read back and documented. A potassium of 6.6 can stop a heart.', '427');
          out.push(picked.includes('ecg') ? 'Peaked Ts with a 6.6, that\'s treat-now. Calcium gluconate first to protect the heart, then insulin and D50, and the binder. Glucose every hour after the insulin, he\'s got no kidneys to clear it.' : 'Treat it now: calcium gluconate, insulin with D50, and the binder. Is he showing ECG changes? Glucose every hour after the insulin.');
        }
        if (picked.includes('spiro')) { if (P.spiroAt === null && !P.spiroHeld) P.spiroHeld = true; A.addOrder('427', 'Discontinue spironolactone.'); out.push('Stop the spironolactone, good catch.'); A.judge('427-sbar-spiro', 'comm', 1, 'You got Mr. Brooks\'s spironolactone discontinued.', 'Holding a dose protects tonight. Getting the order changed protects every shift after.', '427'); }
        return out.length ? out.join(' ') : 'Call me when the repeat potassium is back.';
      },
    },
    scene: (s, P) => ({ tele: true, teleWave: darnellK(s, P) >= 6.2 && !recent(s, P.caAt, 90) ? 'peaked' : 'normal', iv: 'lock', tray: P.trayIn && !P.ate ? (P.traySwapped ? 'full' : 'renal') : 'none', empty: P.icu, emptyText: 'Bed empty. Taken to the ICU after a code.' }),
    clues: (s, P, A) => ({
      monitor: `Telemetry: ${A.vitals('427').rhythm}, rate ${A.vitals('427').HR}.`,
      tray: P.traySwapped ? 'Renal tray: chicken, rice, green beans, apple juice.' : 'Dinner tray: a banana, a glass of orange juice, baked potato. The tray card says "Regular diet."',
      iv: 'Saline lock, left forearm.',
    }),
    rig: (s, P) => ({ glu: darnellBG(s, P), alert: P.arrhythmia ? 2 : 0 }),
    status: (s, P) => P.icu ? 'gone' : darnellBG(s, P) < 70 || (darnellK(s, P) >= 6.6 && !P.hkOrders) ? 'urgent' : darnellK(s, P) >= 6 ? 'watch' : 'stable',
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Cardiac arrest from hyperkalemia', text: 'Potassium near 7 with no calcium on board. Wide complexes, then a code. ROSC after calcium and CPR; now in the ICU for dialysis.' };
      const k = darnellK(s, P);
      if (!P.hkOrders) return { tone: 'bad', title: 'Critical potassium never treated', text: `Potassium ${k} at handoff with peaked T waves. The critical value didn't reach the provider.` };
      if (P.hypo && P.hypoCaught && P.juiceAt !== null) return { tone: 'good', title: 'Potassium down, low glucose caught', text: `Potassium ${k}. His glucose dipped after the insulin, and you were already watching for it.` };
      if (P.hypo) return { tone: 'mixed', title: 'Potassium down, glucose crashed', text: `Potassium ${k}. The insulin worked, and then his glucose fell into the 60s because nobody checked it in time.` };
      return { tone: P.spiroAt !== null ? 'mixed' : 'good', title: 'Potassium coming down', text: `Potassium ${k} on recheck, heart protected with calcium, glucose watched.${P.spiroAt !== null ? ' He did get spironolactone.' : ''}` };
    },
  };

  /* ---------- 429 Amina Hassan: ED admission, suspected appendicitis ---------- */
  const aminaPain = (s, P) => clamp((P.ruptured ? 9 : 8) - decay(s, P.relief, 180) - (P.ruptured && s.t - P.rupturedAt < 20 ? 5 : 0), 1, 10);
  const amina = {
    id: '429', room: '429', name: 'Amina Hassan', short: 'Ms. Hassan', age: 24, sex: 'F', mrn: '00619455', arrives: 90,
    look: { skin: '#6A4330', shade: '#4F301F', lip: '#4D2A20', blush: '#A15A45', iris: '#1E130C', head: { w: 52, h: 62, jaw: .25 }, eye: 10.6,
      hair: { style: 'hijab', color: '#5B6FA3' }, brow: { w: 3.4, color: '#140D0A' }, body: { w: 70, cloth: 'gown' }, extras: [], smile: .25, guard: true,
      lines: { calm: 'I had a midterm Friday. Tell me I don\'t have to reschedule it.', pain: 'It\'s right here. Low on the right. Please.', anxious: 'Is it going to burst? My cousin\'s did.', drowsy: 'Mm. The medicine made me floaty.', fever: 'I\'m burning up. It stopped hurting and now it hurts everywhere.', none: 'She doesn\'t answer.' } },
    bio: 'Second-year accounting student. Lives with her mother Hodan and her 12-year-old brother Abdi. Speaks English and Somali; her mother speaks Somali.',
    dx: 'Suspected acute appendicitis, for appendectomy tonight', reason: 'Suspected acute appendicitis',
    hx: ['No past medical history', 'Combined oral contraceptive'],
    allergies: 'Penicillin (throat swelling, needed epinephrine)', code: 'Full code', weight: '63 kg',
    lines: ['PIV 20g left antecubital, normal saline at 125 mL/h'], mobility: 'Up as tolerated.', diet: 'NPO',
    init: { admitted: null, bands: false, relief: [], morphAt: null, apapAt: null, momTaught: false, interp: null, tea: false, consentAt: null, consentFail: false, abxGiven: null, abxChanged: false, anaph: 0, epiAt: null, checklistAt: null, hcgSeen: false, orReady: null, ruptured: false, rupturedAt: null, gone: false, goneText: null, delay: false },
    labs: [
      { name: 'WBC', val: 14.8, unit: 'K/µL', ref: '4.5–11.0', flag: 'H', t: 40 },
      { name: 'CT abdomen/pelvis', val: 'Dilated appendix 11 mm with periappendiceal fat stranding. No perforation.', unit: '', ref: '', flag: 'A', t: 60 },
      { name: 'Serum hCG', val: 'Pending', unit: '', ref: '', flag: '', t: 70 },
    ],
    orders: [
      { t: 80, text: 'Admit to surgery. NPO. Normal saline 125 mL/h. Appendectomy tonight, OR around 19:00.' },
      { t: 80, text: 'Morphine 4 mg IV every 3 h as needed for severe pain. Acetaminophen 1 g IV every 6 h as needed for mild to moderate pain. Ondansetron 4 mg IV as needed.' },
      { t: 80, text: 'Pre-op antibiotic: ampicillin-sulbactam 3 g IV within 60 minutes before incision.' },
      { t: 80, text: 'Consent for laparoscopic appendectomy (surgeon). Serum hCG before OR.' },
    ],
    notes: [
      { t: 80, author: 'ED RN', text: 'Periumbilical pain since last night, now RLQ, 8/10. Nauseous, no vomiting. Morphine 4 mg IV at 14:30 in ED. Mother at bedside, Somali-speaking. Allergy band not on yet.' },
    ],
    io: { intake: 'IV 500 mL (ED)', output: 'Voided in ED' },
    report: [],
    vitals(s, P) {
      const r = P.ruptured, an = P.anaph;
      const sbp = Math.round((r ? 104 : 118) - an * 2.2) + jit(s, 10) * 2;
      return { T: +(r ? 38.9 : 37.9).toFixed(1), HR: Math.round((r ? 124 : 102) + an * 2) + jit(s, 11), SBP: sbp, DBP: Math.round(sbp * .6), RR: Math.round(18 + an * .5 + (r ? 4 : 0)), SpO2: Math.round(99 - an * .6), O2: 'Room air', pain: aminaPain(s, P) };
    },
    assess: {
      general: (s, P) => P.anaph > 2 ? 'Hives spreading up her neck, lips swelling, voice hoarse. She\'s scratching at her throat.' : P.ruptured ? 'Lying perfectly still, flushed, knees drawn up. Every bump of the bed makes her wince.' : 'Curled on her left side, knees up, one hand on her right lower belly.',
      resp: (s, P) => P.anaph > 2 ? 'Inspiratory stridor. Wheezes throughout.' : 'Clear.',
      cardiac: (s, P, A) => `HR ${A.vitals('429').HR}, regular. Cap refill 2 seconds.`,
      neuro: (s, P) => recent(s, P.morphAt, 60) ? 'Drowsy from morphine but oriented.' : 'Alert, oriented, anxious.',
      pain: (s, P) => P.ruptured ? `Diffuse abdominal pain ${aminaPain(s, P)}/10. She says the sharp pain "let go" earlier, then everything started hurting.` : `Right lower quadrant pain ${aminaPain(s, P)}/10, worse with movement and coughing.`,
      skin: (s, P) => P.anaph > 2 ? 'Raised hives on her chest and neck.' : 'Warm, dry.',
      gi: (s, P) => P.ruptured ? 'Rigid abdomen, rebound everywhere. Absent bowel sounds.' : `Tender at McBurney's point, guarding, positive rebound. Nauseous. NPO${P.tea ? ', but she drank tea at ' + clock(P.tea) : ''}.`,
    },
    interventions: [
      {
        id: 'admit', label: 'Admission assessment and home medication review', cost: 10, avail: (s, P) => P.admitted === null,
        run(s, P, A) { P.admitted = s.t; A.judge('429-admit', 'assess', s.t - 90 <= 45 ? 1 : 0, 'You completed Ms. Hassan\'s admission assessment.', 'The admission assessment sets the baseline everything after is compared to, and it\'s where allergies and home meds get verified.', '429'); A.recordVitals('429', 'You'); return 'Allergy verified: penicillin, throat swelling, needed epinephrine at age 10. Home medication: a combined oral contraceptive, last pack started 3 weeks ago. She hasn\'t eaten since yesterday lunch.'; },
      },
      {
        id: 'bands', label: 'Apply her allergy band and verify her ID band', cost: 2, avail: (s, P) => !P.bands,
        run(s, P, A) { P.bands = true; A.judge('429-bands', 'safety', 1, 'You put Ms. Hassan\'s allergy band on.', 'The red band travels with her to the OR, where people who have never met her will give her antibiotics.', '429'); return 'Red allergy band: PENICILLIN. ID band matches name, DOB and MRN.'; },
      },
      {
        id: 'checklist', label: 'Walk through the pre-op checklist', cost: 4, avail: (s, P) => !P.gone,
        run(s, P) {
          P.checklistAt = s.t;
          const hcg = s.t >= 130;
          if (hcg) P.hcgSeen = true;
          const it = [['Consent signed', P.consentAt !== null], ['NPO since midnight, nothing since arrival', !P.tea], ['ID and allergy bands on', P.bands], ['Pre-op antibiotic safe for her allergy, due on call', P.abxChanged || P.abxGiven === 'safe'], ['hCG resulted', hcg], ['Admission assessment done', P.admitted !== null]];
          return it.map(([l, ok]) => (ok ? '✓ ' : '✗ ') + l).join('. ') + '.' + (hcg ? ' hCG: negative.' : '');
        },
      },
      {
        id: 'epi', label: 'Epinephrine 0.3 mg IM, stop the infusion (anaphylaxis protocol)', cost: 2, avail: (s, P) => P.anaph > 0 && P.epiAt === null, urgent: true,
        run(s, P, A) { P.epiAt = s.t; A.judge('429-epi', 'safety', 2, 'You gave epinephrine for anaphylaxis.', 'Airway swelling, hives and falling blood pressure after an antibiotic: epinephrine IM first, then call for help. Antihistamines don\'t open an airway.', '429'); return 'Infusion clamped. Epinephrine 0.3 mg into her thigh. Within minutes the stridor eases and the hives stop spreading.'; },
      },
    ],
    comms: [
      {
        id: 'interp', label: 'Call the Somali interpreter line for her mother', cost: 6, avail: (s, P) => !P.interp,
        run(s, P, A) {
          P.interp = s.t; P.momTaught = true;
          A.judge('429-interp', 'comm', 2, 'You used a professional interpreter to talk with Ms. Hassan\'s mother.', 'Family members, and especially children, aren\'t interpreters: they filter, soften and don\'t know medical terms. A trained interpreter gets the NPO rule and the surgery plan across accurately.', '429');
          return 'The interpreter, Faduma, joins on the speakerphone. You explain the surgery, why Amina can\'t eat or drink, and when she\'ll be back. Hodan nods, puts the thermos of tea back in her bag, and asks when she can see her daughter after.';
        },
      },
    ],
    family: { name: 'Hodan', rel: 'Mother', mode: 'bedside', cost: 3, dialog: () => 'hodan_talk' },
    meds: [
      {
        id: '429-morph', name: 'Morphine', dose: '4 mg', route: 'IV', freq: 'Every 3 h as needed, severe pain', prn: true,
        block: (s, P) => { const last = P.morphAt !== null ? P.morphAt : -30; return s.t - last < 180 ? 'Last dose at ' + clock(last) + (P.morphAt === null ? ' in the ED' : '') + '. Next at ' + clock(last + 180) + '.' : null; },
        checks: (s, P) => [{ label: 'Consent', value: P.consentAt !== null ? 'Signed at ' + clock(P.consentAt) : 'Not signed yet. Surgeon coming around 17:45', ok: P.consentAt !== null ? true : null }, { label: 'Pain', value: `${aminaPain(s, P)}/10`, ok: true }],
        give(s, P, A) { P.morphAt = s.t; P.relief.push({ t: s.t, amt: 4 }); if (P.consentAt === null && s.t >= 150 && s.t < 170) A.judge('429-morph-consent', 'judgment', -1, 'You gave morphine right before the surgeon came for consent.', 'Informed consent requires a patient who isn\'t impaired by sedating medication. Time opioids around consent, or use a non-sedating option first.', '429'); return 'Morphine 4 mg IV given.'; },
      },
      {
        id: '429-apap', name: 'Acetaminophen', dose: '1 g', route: 'IV', freq: 'Every 6 h as needed, mild to moderate pain', prn: true,
        block: (s, P) => P.apapAt !== null && s.t - P.apapAt < 360 ? 'Given at ' + clock(P.apapAt) + '.' : null,
        checks: () => [{ label: 'Liver disease, alcohol', value: 'None', ok: true }, { label: 'Sedation', value: 'None: safe before consent', ok: true }],
        give(s, P, A) { P.apapAt = s.t; P.relief.push({ t: s.t, amt: 2 }); if (P.consentAt === null) A.judge('429-apap', 'judgment', 1, 'You used IV acetaminophen for Ms. Hassan\'s pain before consent.', 'Treating pain matters, and so does her ability to consent. A non-sedating analgesic let you do both.', '429'); return 'Acetaminophen 1 g IV over 15 minutes.'; },
      },
      {
        id: '429-abx', name: 'Ampicillin-sulbactam', dose: '3 g', route: 'IV', freq: 'Once, on call to OR', prn: true, available: (s, P) => !P.abxChanged,
        checks: () => [{ label: 'Allergy', value: 'PENICILLIN: throat swelling, needed epinephrine', ok: false }, { label: 'Drug class', value: 'Ampicillin is a penicillin', ok: false }],
        give(s, P, A) { P.abxGiven = 'pcn'; P.anaph = 1; A.judge('429-pcn', 'meds', -5, 'You gave a penicillin to a patient with penicillin anaphylaxis.', 'The allergy check showed it: ampicillin is a penicillin. When an order conflicts with a documented anaphylaxis, hold it and call. Every time.', '429'); return 'Ampicillin-sulbactam infusing.'; },
      },
      {
        id: '429-cipro', name: 'Ciprofloxacin + metronidazole', dose: '400 mg + 500 mg', route: 'IV', freq: 'Once, on call to OR', prn: true, available: (s, P) => P.abxChanged, block: (s, P) => P.abxGiven === 'safe' ? 'Given at ' + clock(P.abxAt) + '.' : null,
        checks: (s) => [{ label: 'Allergy', value: 'Penicillin. No cross-reactivity.', ok: true }, { label: 'Timing', value: 'Within 60 minutes before incision (OR about 19:00)', ok: s.t >= 180 }],
        give(s, P, A) { P.abxGiven = 'safe'; P.abxAt = s.t; if (s.t < 180) A.judge('429-abx-early', 'time', -1, 'You gave the pre-op antibiotic more than an hour before incision.', 'Surgical prophylaxis works best within 60 minutes before incision, so tissue levels peak during surgery.', '429'); else A.judge('429-abx-time', 'time', 1, 'You timed Ms. Hassan\'s pre-op antibiotic to the incision.', 'Within 60 minutes before incision puts peak tissue levels in the operating window.', '429'); return 'Ciprofloxacin and metronidazole infusing.'; },
      },
      { id: '429-ond', name: 'Ondansetron', dose: '4 mg', route: 'IV', freq: 'Every 6 h as needed, nausea', prn: true, checks: () => [{ label: 'Nausea', value: 'Yes', ok: true }], give: () => 'Ondansetron 4 mg IV.' },
    ],
    talk: (s, P) => (P.gone ? null : P.anaph > 2 ? 'amina_anaph' : 'amina_scared'),
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('429');
        return [
          { id: 'allergy', label: 'Pre-op antibiotic ordered is ampicillin-sulbactam. She has penicillin anaphylaxis.', key: true, need: true },
          { id: 'anaph', label: 'Hives, stridor, BP falling after the antibiotic', key: true, need: P.anaph > 2, lock: 'No reaction' },
          { id: 'vit', label: v ? `T ${v.T}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}` : 'Vitals', key: false, need: !!v },
          { id: 'pain', label: P.ruptured ? 'Pain went away suddenly, now diffuse, rigid abdomen, fever' : `RLQ pain ${aminaPain(s, P)}/10`, key: P.ruptured, need: P.assessAt.pain !== undefined, lock: 'Assess her pain' },
          { id: 'tea', label: `Drank tea at ${P.tea ? clock(P.tea) : '?'}`, key: true, need: !!P.tea, lock: 'NPO intact' },
          { id: 'mid', label: 'Worried about a midterm', key: false, need: true },
        ];
      },
      respond(s, P, A, picked) {
        const out = [];
        if (picked.includes('allergy') && !P.abxChanged && P.abxGiven === null) { P.abxChanged = true; A.addOrder('429', 'Discontinue ampicillin-sulbactam. Pre-op: ciprofloxacin 400 mg IV and metronidazole 500 mg IV within 60 minutes before incision.'); A.judge('429-abx-catch', 'meds', 3, 'You caught a penicillin ordered for a patient with penicillin anaphylaxis.', 'The allergy was documented; the order still got written. Reading every order against the allergy list, especially for a patient you just met, is the check that catches it.', '429'); out.push('Oh, you\'re right. Switching her to cipro and metronidazole. Thank you.'); }
        if (picked.includes('anaph')) out.push('Epinephrine IM now if you haven\'t, stop that infusion, I\'m calling a rapid response.');
        if (picked.includes('pain') && P.ruptured) out.push('That\'s a rupture until proven otherwise. I\'m calling Dr. Morales to bump her up.');
        return out.length ? out.join(' ') : 'Okay. She\'s on for 19:00. Anything else?';
      },
    },
    scene: (s, P) => ({ iv: 'running', family: P.gone ? null : 'hodan', familyLabel: 'Hodan, her mother', thermos: !P.momTaught && !P.gone, consent: P.consentAt !== null, empty: P.gone, emptyText: P.goneText || 'In the OR.' }),
    clues: (s, P) => ({
      thermos: P.tea ? 'The thermos is open. Sweet tea with milk. Amina drank some.' : 'Hodan\'s thermos: hot tea with milk and cardamom. Amina is NPO.',
      family: 'Hodan, her mother, holding Amina\'s hand. She speaks Somali. Abdi, 12, is doing homework in the corner.',
      consent: 'Signed consent for laparoscopic appendectomy.',
      iv: 'Normal saline at 125 mL/h, left antecubital.',
    }),
    rig: (s, P) => ({ alert: recent(s, P.morphAt, 45) ? 1 : 0, anxious: P.anaph > 2 ? .8 : aminaPain(s, P) >= 7 ? .4 : .2, sweat: P.ruptured ? .5 : 0, lean: P.anaph > 4 ? .6 : 0 }),
    status: (s, P) => P.gone ? 'gone' : P.anaph > 0 && P.epiAt === null || P.ruptured ? 'urgent' : 'watch',
    outcome(s, P) {
      if (!P.arrived) return { tone: 'mixed', title: 'Admission not yet arrived', text: 'Shift ended before she came up.' };
      if (P.icu) return { tone: 'bad', title: 'Anaphylaxis, ICU', text: 'She got the penicillin her allergy band warned about. Airway swelling and shock before epinephrine.' };
      if (P.anaph > 0) return { tone: 'bad', title: 'Anaphylaxis to a penicillin', text: 'Given the antibiotic she was allergic to. Epinephrine reversed it, but surgery is postponed.' };
      if (P.ruptured) return { tone: 'bad', title: 'Appendix ruptured while waiting', text: 'Surgery slipped, and the appendix perforated. Now a longer operation, a drain and a week of antibiotics.' };
      if (P.gone) return { tone: 'good', title: 'In the OR on time', text: 'Consent signed, NPO intact, bands on, a safe antibiotic timed to incision.' };
      return { tone: 'mixed', title: 'Surgery delayed', text: 'Not ready when the OR called. ' + (P.delayWhy || '') };
    },
  };

  /* ---------- dialogs ---------- */
  const J = (key, dom, d, text, why, pid) => (s, A) => A.judge(key, dom, d, text, why, pid);
  const dialogs = {
    pat_anxious: { who: '421', text: '"I feel like I\'m breathing through a coffee straw. Can I have my nerve pill? Please?"', choices: [
      { label: 'Let\'s try one thing first. Lean forward on the table with me. In through your nose, out slowly through pursed lips, like blowing out a candle. Your breathing treatment is due, too.', next: 'pat_a', fx: (s, A) => { s.p['421'].coachAt = s.t; A.judge('421-talk', 'comm', 1, 'You coached Mrs. Kowalski through the panic before reaching for a sedative.', 'Breathlessness and anxiety feed each other in COPD. Coaching breaks the cycle without suppressing her drive to breathe.', '421'); } },
      { label: 'Sure. I\'ll bring your lorazepam.', next: 'pat_b' },
      { label: 'You\'re fine, your oxygen is good.', next: 'pat_c', fx: J('421-talk', 'comm', -1, 'You told a breathless patient she was fine.', 'Her sat was in range, but she wasn\'t fine: she was frightened and working to breathe. Acknowledge the symptom, then treat it.', '421') },
    ] },
    pat_a: { who: '421', text: 'Six slow breaths. Her shoulders drop. "Okay. Okay. The cardinal\'s back, see him? On the ledge."' },
    pat_b: { who: '421', text: '"Thank you, hon." She closes her eyes and waits.' },
    pat_c: { who: '421', text: '"Doesn\'t feel fine." She grips the table harder.' },
    pat_sleepy: { who: '421', text: 'She opens her eyes halfway. "Just... let me sleep, hon. Head hurts." Her words run together.' },
    pat_idle: { who: '421', text: '"The cardinal\'s back. Third day running."' },
    kevin_mom: { who: '423', text: '"Hey. Can I ask you something? My mom calls every night. Please don\'t tell her about the drinking. She thinks I quit."', choices: [
      { label: 'I won\'t share anything with her without your permission. That\'s your call. If you ever want help telling her, I can help with that too.', next: 'kevin_a', fx: (s, A) => { s.p['423'].askedMom = true; A.judge('423-talk', 'comm', 2, 'You confirmed Mr. Tran controls who hears about his health.', 'Adult patients decide who gets their health information. Saying it plainly builds the trust that makes him tell you when he\'s getting worse.', '423'); } },
      { label: 'She\'s your mom, she\'s going to find out eventually.', next: 'kevin_b', fx: (s, A) => { s.p['423'].askedMom = true; A.judge('423-talk', 'comm', -1, 'You brushed off Mr. Tran\'s privacy request.', 'Adult patients control their health information. Dismissing the request erodes trust with someone at high risk of leaving.', '423'); } },
      { label: 'Why are you drinking that much, anyway?', next: 'kevin_c', fx: (s, A) => { s.p['423'].askedMom = true; A.judge('423-talk', 'comm', -1, 'You met Mr. Tran\'s request with judgment.', '"Why" questions feel like accusations. Curiosity without blame opens doors to treatment later.', '423'); } },
    ] },
    kevin_a: { who: '423', text: 'He lets out a breath. "Thanks. For real." He tells you his hands have been shaking since this morning.' },
    kevin_b: { who: '423', text: '"Yeah. Whatever." He turns toward the wall.' },
    kevin_c: { who: '423', text: 'His jaw tightens. "Divorce. Whatever. Can I get my pain med?"' },
    kevin_ama: { who: '423', text: 'He\'s out of bed, tugging at his IV tape, sweating. "I\'m leaving. I need to get out of here. There\'s bugs all over that wall, man. I just need one drink and I\'ll be fine."', choices: [
      { label: 'You\'re feeling awful, and some of this is withdrawal. It can get dangerous, like seizures. Let me treat it right now, and if you still want to talk about leaving after, we will.', next: 'kevin_d', fx: (s, A) => { s.p['423'].amaDone = true; s.p['423'].calm.push({ t: s.t, amt: 2 }); A.judge('423-ama', 'comm', 2, 'You de-escalated Mr. Tran with empathy and a concrete offer.', 'Acknowledge, explain the risk in plain words, offer relief. Threats and arguments escalate agitation; respect and a plan lower it.', '423'); } },
      { label: 'If you leave, it\'s against medical advice and your insurance won\'t pay.', next: 'kevin_e', fx: (s, A) => { s.p['423'].amaDone = true; A.judge('423-ama', 'comm', -1, 'You tried to keep Mr. Tran with an insurance threat.', 'The insurance claim is also usually false. Patients have the right to leave; your job is to inform them honestly and treat what\'s driving it.', '423'); } },
      { label: 'I\'m calling security.', next: 'kevin_e', fx: (s, A) => { s.p['423'].amaDone = true; A.judge('423-ama', 'comm', -2, 'You escalated to security before trying to de-escalate.', 'Security has a role when someone is dangerous. A frightened, withdrawing patient first needs someone to name what\'s happening and treat it.', '423'); } },
    ] },
    kevin_d: { who: '423', text: 'He sits on the edge of the bed, shaking. "Okay. Okay. Just make it stop."' },
    kevin_e: { who: '423', text: 'He sits back down, but he\'s glaring at the door, bouncing his knee.' },
    kevin_idle: { who: '423', text: '"Pho place is short a cook tonight. They\'re gonna kill me."' },
    bea_knees: { who: '425', text: '"Dear, my knees are singing tonight. Could I have my ibuprofen? It\'s the only thing that works."', choices: [
      { label: 'Ibuprofen is what caused this ulcer, so I can\'t give you that. I can bring acetaminophen, and I\'ll let your doctor know the ibuprofen order needs to come off.', next: 'bea_a', fx: (s, A) => A.judge('425-talk', 'comm', 1, 'You explained why Mrs. Nakamura can\'t have ibuprofen and offered an alternative.', 'Teaching the "why" matters: she\'s taken ibuprofen for years and will reach for it at home.', '425') },
      { label: 'Sure, it\'s on your MAR.', next: 'bea_b' },
    ] },
    bea_a: { who: '425', text: '"Oh. Oh, I didn\'t know that. Fifty years of piano and ibuprofen." She pats your hand.' },
    bea_b: { who: '425', text: '"Thank you, dear."' },
    bea_react: { who: '425', text: 'She grips your wrist, shaking. "Something is wrong, dear. My back. I\'m so cold."' },
    bea_idle: { who: '425', text: '"My granddaughter plays Chopin now. Badly, but with feeling."' },
    darnell_dialysis: { who: '427', text: 'He sets the red pen down. "Real talk. The doc said the word dialysis this morning. Am I going on the machine?"', choices: [
      { label: 'I don\'t know yet, and I won\'t pretend to. Your kidneys are struggling and your potassium is high. The kidney team is looking at it tonight. What worries you most about it?', next: 'darnell_a', fx: (s, A) => { s.p['427'].talked = true; A.judge('427-talk', 'comm', 2, 'You answered Mr. Brooks honestly and opened the door to his fear.', 'Honest uncertainty plus an open question beats false reassurance. He heard the truth and got to say what scares him.', '427'); } },
      { label: 'Don\'t worry about that, you\'ll be fine.', next: 'darnell_b', fx: (s, A) => { s.p['427'].talked = true; A.judge('427-talk', 'comm', -1, 'You reassured Mr. Brooks about something no one knows yet.', 'False reassurance closes the conversation and breaks trust if the answer turns out to be yes.', '427'); } },
    ] },
    darnell_a: { who: '427', text: '"Tuesdays and Thursdays are practice. That\'s what worries me." He laughs, but his eyes are wet. "Thanks for not lying to me."' },
    darnell_b: { who: '427', text: '"Yeah, okay." He picks the pen back up.' },
    darnell_idle: { who: '427', text: '"The Warriors need a center. You know I\'m right."' },
    amina_scared: { who: '429', text: '"Is it going to burst? My cousin\'s did. And my mom keeps asking me things and I can\'t explain it right now."', choices: [
      { label: 'Your CT shows it hasn\'t burst. Surgery tonight is how we keep it that way. I\'m going to get a Somali interpreter so your mom can ask everything she wants, and you can just rest.', next: 'amina_a', fx: J('429-talk', 'comm', 2, 'You gave Ms. Hassan honest information and took translating off her plate.', 'A patient in pain shouldn\'t be the interpreter. Honest reassurance grounded in her CT is not false reassurance.', '429') },
      { label: 'It\'s fine, you\'re in the right place.', next: 'amina_b', fx: J('429-talk', 'comm', -1, 'You gave Ms. Hassan a platitude.', 'She asked a specific question. Specific answers build trust.', '429') },
    ] },
    amina_a: { who: '429', text: 'She exhales. "Okay. Thank you. She\'s going to have a hundred questions."' },
    amina_b: { who: '429', text: '"Okay." She squeezes her eyes shut.' },
    amina_anaph: { who: '429', text: '"My throat. It\'s tight. I can\'t—" Her voice is hoarse.' },
    hodan_talk: { who: 'hodan', text: 'Hodan speaks to you in Somali, gesturing at Amina and then at her thermos. Abdi, 12, looks up from his homework. "I can translate. She wants to know if Amina can have some tea for the pain."', choices: [
      { label: 'Thank you, Abdi, but I\'ll call our interpreter so your mom gets every detail. (Somali interpreter line.)', next: null, fx: (s, A) => { const P = s.p['429']; if (!P.interp) { P.interp = s.t; P.momTaught = true; A.judge('429-interp', 'comm', 2, 'You used a professional interpreter instead of a 12-year-old.', 'Children shouldn\'t carry medical conversations: they don\'t know the terms, may be frightened, and families filter what kids hear. A trained interpreter delivered the NPO rule accurately.', '429'); A.log('429', 'Interpreter Faduma explains NPO and the surgery plan. Hodan puts the thermos away.', 'info'); } } },
      { label: 'Sure, Abdi. Tell her no food or drink before surgery.', next: 'hodan_b', fx: (s, A) => { const P = s.p['429']; A.judge('429-abdi', 'comm', -2, 'You used Ms. Hassan\'s 12-year-old brother as an interpreter.', 'Children are not medical interpreters. Abdi told his mother "no food," but not that tea counts, or why it matters.', '429'); } },
      { label: 'Smile and nod.', next: null, fx: J('429-nod', 'comm', -2, 'You nodded along without understanding Ms. Hassan\'s mother.', 'Nodding reads as yes. Hodan now thinks tea is fine.', '429') },
    ] },
    hodan_b: { who: 'hodan', text: 'Abdi translates. Hodan nods, then looks at her thermos, unsure.' },
  };

  /* ---------- events ---------- */
  const A0 = (s) => Object.keys(s.p).every((id) => s.p[id].seenAt === null);
  const events = [
    { id: 'luis-hi', when: (s) => s.t >= 8, run(s, A) { A.msg({ from: 'luis', text: 'Pulling a double tonight. Coffee is my whole personality now. I\'ve got 421 to 429 with you.', replies: [{ label: 'Open tasks for Luis', act: 'delegate' }] }); } },
    { id: 'bank-1', when: (s) => s.t >= 20, run(s, A) { A.msg({ from: 'bank', pid: '425', text: 'Blood bank: first unit of packed red cells for NAKAMURA in 425 is ready for pickup.', replies: [{ label: 'Go to 425', act: 'goto', pid: '425' }] }); } },
    { id: 'o2-up', when: (s) => s.t >= 25, run(s, A) { const P = s.p['421']; if (P.o2 > 2) return; P.o2 = 6; P.raisedAt = s.t; A.msg({ from: 'luis', pid: '421', text: '421 looked short of breath so I turned her oxygen up to 6 L. She\'s 98% now! Much better.', replies: [{ label: 'Turn it back to 2 L, and check with me before changing oxygen', act: 'o2-back' }, { label: 'Great, leave it at 6', act: 'o2-leave' }, { label: 'Go to 421', act: 'goto', pid: '421' }] }); } },
    { id: 'k-crit', when: (s) => s.t >= 40, run(s, A) { const P = s.p['427']; P.critAt = s.t; A.addLab('427', { name: 'Potassium (repeat)', val: 6.6, unit: 'mmol/L', ref: '3.5–5.0', flag: 'H' }); A.msg({ from: 'lab', pid: '427', urgent: true, text: 'Critical value, 427 Brooks: potassium 6.6 mmol/L. Please read back and notify the provider.', replies: [{ label: `Call Dr. Adebayo with an SBAR`, act: 'sbar', pid: '427' }, { label: 'Go to 427', act: 'goto', pid: '427' }] }); } },
    { id: 'k-tele', when: (s) => s.t >= 70 && !recent(s, s.p['427'].caAt, 90) && darnellK(s, s.p['427']) >= 6.3, run(s, A) { A.msg({ from: 'jae', pid: '427', urgent: true, text: 'Tele here. 427\'s T waves are getting really tall and peaked. His K was high, right?', replies: [{ label: 'Go to 427', act: 'goto', pid: '427' }] }); } },
    { id: 'pat-anx', when: (s) => s.t >= 60 && s.p['421'].co2 < 62, run(s, A) { A.msg({ from: 'luis', pid: '421', text: '421 is asking for something for her nerves. She says she can\'t catch her breath.', replies: [{ label: 'Go to 421', act: 'goto', pid: '421' }] }); } },
    { id: 'ed-call', when: (s) => s.t >= 80, run(s, A) { A.msg({ from: 'ed', pid: '429', text: 'ED: sending up Amina Hassan, 24, to 429. Probable appendicitis, OR tonight around 19:00. She got morphine at 14:30. Mom\'s with her, Somali-speaking. Allergy band still needs to go on.' }); } },
    { id: 'arrive', when: (s) => s.t >= 90, run(s, A) { const P = s.p['429']; P.arrived = true; P.vit.push({ t: s.t, by: 'ED RN', T: 37.9, HR: 102, SBP: 118, DBP: 72, RR: 18, SpO2: 99, O2: 'Room air', pain: 8 }); A.msg({ from: 'luis', pid: '429', text: '429 is here. Got her in bed. Her mom\'s with her.', replies: [{ label: 'Go to 429', act: 'goto', pid: '429' }] }); } },
    { id: 'bea-knees', when: (s) => s.t >= 100, run(s, A) { if (s.p['425'].ibuStopped) return; A.msg({ from: 'luis', pid: '425', text: '425 is asking for her ibuprofen for her knees. It\'s on her MAR?' }); } },
    { id: 'linh', when: (s) => s.t >= 110, run(s, A) { A.msg({ from: 'linh', pid: '423', text: 'Kevin\'s mother, Linh, on line 2: "Is my son drinking again? What is wrong with him? Nobody tells me anything."', replies: [{ label: '"I can\'t share details without his permission. I\'ll tell him you called and ask if he wants to talk."', act: 'linh-good' }, { label: '"He\'s here for pancreatitis from drinking."', act: 'linh-bad' }, { label: '"He\'s fine, don\'t worry."', act: 'linh-fine' }] }); } },
    { id: 'trays', when: (s) => s.t >= 120, run(s, A) { s.p['423'].trayIn = true; s.p['427'].trayIn = true; A.log(null, 'Dinner trays are out.', 'ambient'); } },
    { id: 'hcg', when: (s) => s.t >= 130, run(s, A) { A.addLab('429', { name: 'Serum hCG', val: 'Negative (< 5)', unit: 'mIU/mL', ref: '', flag: '' }); } },
    { id: 'kev-eat', when: (s) => s.t >= 165 && s.p['423'].trayIn && !s.p['423'].trayGone, run(s, A) { const P = s.p['423']; P.ate = true; A.judge('423-ate', 'safety', -1, 'Mr. Tran ate a dinner tray while NPO for pancreatitis.', 'Food stimulates pancreatic enzymes. The tray should have been caught at delivery.', '423'); A.msg({ from: 'luis', pid: '423', text: '423 ate half his dinner. Wasn\'t he NPO? He says his stomach is worse.' }); } },
    { id: 'dar-eat', when: (s) => s.t >= 165 && s.p['427'].trayIn && !s.p['427'].traySwapped, run(s, A) { const P = s.p['427']; P.ate = true; A.judge('427-ate', 'safety', -1, 'Mr. Brooks ate a banana and orange juice with a potassium over 6.', 'The dinner tray violated his renal diet. Diet errors happen; the bedside check catches them.', '427'); } },
    { id: 'tea', when: (s) => s.t >= 160 && !s.p['429'].momTaught && !s.p['429'].gone, run(s, A) { const P = s.p['429']; P.tea = s.t; A.msg({ from: 'luis', pid: '429', text: 'FYI, 429\'s mom gave her some tea from a thermos. Is she allowed?' }); } },
    { id: 'morales-1', when: (s) => s.t >= 150, run(s, A) { A.msg({ from: 'morales', pid: '429', text: 'Dr. Morales, surgery: heading to 429 in 15 minutes to consent Ms. Hassan.' }); } },
    { id: 'consent', when: (s) => s.t >= 165 && s.p['429'].arrived, run(s, A) {
      const P = s.p['429'];
      if (recent(s, P.morphAt, 60)) { P.consentFail = true; A.msg({ from: 'morales', pid: '429', text: 'She\'s had morphine in the last hour and she\'s drowsy. I can\'t get valid consent. I\'ll come back at 18:45, which pushes her case.' }); A.judge('429-consent-fail', 'judgment', -2, 'Ms. Hassan was too sedated for consent when the surgeon arrived.', 'You knew the surgeon was coming. Informed consent needs a patient who can understand and decide. Time sedating opioids around it, or use a non-sedating option.', '429'); return; }
      P.consentAt = s.t; A.msg({ from: 'morales', pid: '429', text: 'Consented 429 with the interpreter on the line. She\'s on for 19:00.' });
    } },
    { id: 'consent-late', when: (s) => s.t >= 225 && s.p['429'].consentFail && s.p['429'].consentAt === null, run(s, A) { s.p['429'].consentAt = s.t; } },
    { id: 'bea-walk', when: (s) => s.t >= 170, run(s, A) { const P = s.p['425']; if (P.icu) return; P.walkAsked = true; A.msg({ from: 'luis', pid: '425', text: '425 wants to walk to the bathroom by herself. She says the commode is undignified. Should I let her?', replies: [{ label: 'Commode only, and stay with her. She\'s dizzy and her Hgb is low.', act: 'bea-walk-no' }, { label: 'Sure, let her walk.', act: 'bea-walk-yes' }] }); } },
    { id: 'or-call', when: (s) => s.t >= 225 && s.p['429'].arrived, run(s, A) { A.msg({ from: 'or', pid: '429', text: 'OR here. Is 429 ready? We want her down at 19:00.', replies: [{ label: 'Go to 429', act: 'goto', pid: '429' }] }); } },
    { id: 'or-go', when: (s) => s.t >= 240 && s.p['429'].arrived, run(s, A) {
      const P = s.p['429']; if (P.anaph > 0 || P.icu) return;
      const miss = [];
      if (P.consentAt === null || P.consentAt > 235) miss.push('consent wasn\'t signed in time');
      if (P.tea) miss.push('she drank tea, so anesthesia wants a longer fast');
      if (!P.bands) miss.push('no allergy band');
      if (P.abxGiven !== 'safe') miss.push('no safe pre-op antibiotic');
      if (!P.hcgSeen && !(P.k.labsSeen >= 130)) miss.push('nobody confirmed the hCG');
      if (!miss.length) { P.gone = true; P.goneText = 'In the OR for her appendectomy.'; A.judge('429-or', 'time', 2, 'Ms. Hassan went to the OR on time and ready.', 'A clean pre-op handoff is a dozen small checks done early: bands, NPO, consent, labs, antibiotic. Each one you finished was one less delay.', '429'); A.msg({ from: 'or', pid: '429', text: 'Got her. Checklist complete. Thanks, 4 West.' }); }
      else { P.delay = true; P.delayWhy = 'Delayed because ' + miss.join('; ') + '.'; A.judge('429-or-late', 'time', -2, 'Ms. Hassan\'s surgery was delayed: ' + miss.join('; ') + '.', 'Every missed pre-op item pushes the case. With appendicitis, delay raises the risk of perforation.', '429'); A.msg({ from: 'or', pid: '429', urgent: true, text: 'We can\'t take 429 yet: ' + miss.join('; ') + '. We\'ll bump her to later.' }); }
    } },
    { id: 'rupture', when: (s) => s.p['429'].arrived && !s.p['429'].gone && s.p['429'].anaph === 0 && ((s.p['429'].delay && s.t >= 262) || (s.p['429'].tea && s.t >= 280)), run(s, A) { const P = s.p['429']; P.ruptured = true; P.rupturedAt = s.t; A.msg({ from: 'luis', pid: '429', urgent: true, text: '429 says her pain suddenly got better, but now she\'s burning up and her whole belly hurts. Temp 38.9.', replies: [{ label: 'Go to 429', act: 'goto', pid: '429' }] }); A.recordVitals('429', 'Luis (CNA)'); } },
    { id: 'bank-2', when: (s) => s.p['425'].returned && s.t >= s.p['425'].rightUnitAt, run(s, A) { A.msg({ from: 'bank', pid: '425', text: 'Blood bank: corrected unit for NAKAMURA, MRN 00481822, is ready for pickup. We\'ve filed the labeling error.' }); } },
    { id: 'bea-found', when: (s) => { const P = s.p['425']; return P.reactionAt !== null && P.stopped === null && s.t >= P.reactionAt + 12; }, run(s, A) { A.recordVitals('425', 'Luis (CNA)'); A.msg({ from: 'luis', pid: '425', urgent: true, text: '425 is shaking all over and says her back is killing her. Her pee is dark red. Blood is still running!', replies: [{ label: 'Go to 425', act: 'goto', pid: '425' }] }); } },
    { id: 'bea-done', when: (s) => { const P = s.p['425']; return P.transAt !== null && P.transUnit === 'right' && P.stopped === null && s.t >= P.transAt + 120; }, run(s, A) { const P = s.p['425']; P.doneAt = s.t; A.log('425', 'First unit complete.', 'ambient'); } },
    { id: 'bea-hgb', when: (s) => s.p['425'].doneAt !== null && s.t >= s.p['425'].doneAt + 15, run(s, A) { A.addLab('425', { name: 'Hemoglobin', val: 7.9, unit: 'g/dL', ref: '12–16', flag: 'L' }); A.msg({ from: 'lab', pid: '425', text: '425 Nakamura hemoglobin 7.9 after unit 1.' }); } },
    { id: 'bea-icu', when: (s) => s.p['425'].rsev >= 45 && !s.p['425'].icu, run(s, A) { const P = s.p['425']; P.icu = true; A.judge('425-icu', 'safety', -3, 'Mrs. Nakamura went into shock from an acute hemolytic transfusion reaction.', 'Incompatible blood kept running. The first 15 minutes at the bedside, and stopping at the first chill or backache, are what prevent this.', '425'); A.msg({ from: 'luis', pid: '425', urgent: true, text: 'Rapid response in 425. BP 70s, she\'s barely talking. They\'re taking her to the ICU.' }); } },
    { id: 'abg', when: (s) => s.p['421'].abgAt !== null && s.t >= s.p['421'].abgAt + 15, run(s, A) { const P = s.p['421']; const ph = +(7.37 - (P.co2 - 52) * .006).toFixed(2); P.abgResult = { ph, co2: Math.round(P.co2) }; A.addLab('421', { name: 'ABG pH', val: ph, unit: '', ref: '7.35–7.45', flag: ph < 7.35 ? 'L' : '' }); A.addLab('421', { name: 'ABG PaCO₂', val: Math.round(P.co2), unit: 'mmHg', ref: '35–45 (baseline about 52)', flag: 'H' }); A.msg({ from: 'lab', pid: '421', urgent: ph < 7.32, text: `ABG 421 Kowalski: pH ${ph}, PaCO₂ ${Math.round(P.co2)}.`, replies: ph < 7.32 ? [{ label: 'Call Dr. Adebayo with an SBAR', act: 'sbar', pid: '421' }] : null }); } },
    { id: 'pat-sleepy', when: (s) => s.p['421'].co2 >= 64 && !s.p['421'].bipap, run(s, A) { A.msg({ from: 'luis', pid: '421', text: '421 is really sleepy. Hard to wake up for vitals. Her sat\'s great though, 98%.', replies: [{ label: 'Go to 421', act: 'goto', pid: '421' }] }); } },
    { id: 'pat-icu', when: (s) => s.p['421'].co2 >= 84 && !s.p['421'].bipap, run(s, A) { const P = s.p['421']; P.icu = true; A.judge('421-icu', 'safety', -3, 'Mrs. Kowalski went into hypercapnic respiratory failure on 6 L of oxygen.', 'Her sat looked perfect the whole time. In a CO₂ retainer, the dangerous number is the one you don\'t see on the monitor: rising CO₂ shows up as sleepiness, headache, slow breathing.', '421'); A.msg({ from: 'luis', pid: '421', urgent: true, text: 'Rapid response in 421. She won\'t wake up. They\'re taking her to the ICU for BiPAP.' }); } },
    { id: 'kev-hall', when: (s) => ciwa(s, s.p['423']) >= 18, run(s, A) { A.msg({ from: 'luis', pid: '423', urgent: true, text: '423 is out of bed pulling at his IV. He says there are bugs on the wall and he\'s leaving.', replies: [{ label: 'Go to 423', act: 'goto', pid: '423' }] }); } },
    { id: 'kev-seize', when: (s) => ciwa(s, s.p['423']) >= 23 && s.p['423'].seizedAt === null, run(s, A) { const P = s.p['423']; P.seizedAt = s.t; A.judge('423-seize', 'safety', -3, 'Mr. Tran had a withdrawal seizure.', 'CIWA climbed for hours. Scoring hourly and dosing lorazepam per protocol is what keeps withdrawal from reaching seizures and delirium tremens.', '423'); if (!P.seizPrec) A.judge('423-seize-noprec', 'safety', -1, 'There were no seizure precautions in place when Mr. Tran seized.', 'He hit his head on the bare rail.', '423'); P.relief.push({ t: s.t, amt: 12 }); P.lorazAt = s.t; A.msg({ from: 'luis', pid: '423', urgent: true, text: 'Code seizure 423! He\'s shaking all over. Rapid response is here, they gave IV lorazepam.', replies: [{ label: 'Go to 423', act: 'goto', pid: '423' }] }); } },
    { id: 'dar-hypo', when: (s) => darnellBG(s, s.p['427']) < 66 && !s.p['427'].hypo, run(s, A) { const P = s.p['427']; P.hypo = true; const watched = P.bgs.some((b) => b.t > P.insAt && s.t - b.t <= 60); if (watched) { P.hypoCaught = true; A.msg({ from: 'luis', pid: '427', urgent: true, text: '427 is getting sweaty and shaky, like you said he might.', replies: [{ label: 'Go to 427', act: 'goto', pid: '427' }] }); } else { A.judge('427-hypo', 'judgment', -2, 'Mr. Brooks went hypoglycemic after IV insulin with no glucose check.', 'Insulin for hyperkalemia moves glucose into cells along with potassium. Kidney failure keeps the insulin around longer. Hourly glucose checks were in the order for this reason.', '427'); A.msg({ from: 'luis', pid: '427', urgent: true, text: '427 is sweaty and shaky. He says he feels like he\'s gonna pass out.', replies: [{ label: 'Go to 427', act: 'goto', pid: '427' }] }); } } },
    { id: 'dar-code', when: (s) => darnellK(s, s.p['427']) >= 6.9 && !recent(s, s.p['427'].caAt, 60) && !s.p['427'].icu, run(s, A) { const P = s.p['427']; P.arrhythmia = true; P.icu = true; A.judge('427-code', 'safety', -3, 'Mr. Brooks arrested from hyperkalemia.', 'A critical potassium with peaked T waves is a treat-now emergency: calcium to protect the heart, insulin with dextrose to shift the potassium, then binders or dialysis. The lab call was the warning.', '427'); A.msg({ from: 'jae', pid: '427', urgent: true, text: 'CODE BLUE 427. Wide complex, now V-fib. Team is on the way.' }); } },
    { id: 'k-recheck', when: (s) => s.p['427'].insAt !== null && s.t >= s.p['427'].insAt + 120, run(s, A) { const k = darnellK(s, s.p['427']); A.addLab('427', { name: 'Potassium (2 h)', val: k, unit: 'mmol/L', ref: '3.5–5.0', flag: k > 5 ? 'H' : '' }); A.msg({ from: 'lab', pid: '427', text: `427 Brooks potassium ${k} on recheck.` }); } },
    { id: 'nova-idle', when: (s) => s.t >= 50 && s.t < 120 && A0(s), run(s, A) { A.msg({ from: 'nova', urgent: true, text: 'Hey. It\'s been almost an hour and you haven\'t been in a single room. Report is not an assessment. Go lay eyes on somebody.' }); } },
    { id: 'nova-30', when: (s) => s.t >= 270, run(s, A) { A.msg({ from: 'nova', text: 'Half an hour to handoff. Look at every patient once more with fresh eyes. Who would you worry about at 3 a.m.?' }); } },
  ];

  /* ---------- delegation ---------- */
  const delegation = {
    tasks: [
      { id: 'vitals', label: 'Take a full set of vital signs', rooms: ['421', '423', '425', '427', '429'], mins: 12 },
      { id: 'bg', label: 'Check blood glucose', rooms: ['427'], mins: 8 },
      { id: 'blood', label: 'Pick up blood from blood bank', rooms: ['425'], mins: 12, avail: (s) => s.t >= 20 },
      { id: 'tray', label: 'Swap the dinner tray for a renal tray', rooms: ['427'], mins: 10, avail: (s) => s.t >= 120 },
      { id: 'o2', label: 'Adjust her oxygen', rooms: ['421'], mins: 0 },
      { id: 'ciwa', label: 'Score his CIWA', rooms: ['423'], mins: 0 },
      { id: 'walk', label: 'Walk her to the bathroom', rooms: ['425'], mins: 0 },
      { id: 'bath', label: 'Help with a bath and linen change', rooms: ['421', '423', '425', '427'], mins: 25 },
    ],
    start(task, pid, s, A) {
      const nm = A.def(pid).short;
      if (task.id === 'o2') { A.judge('deleg-o2', 'deleg', -1, 'You asked the CNA to adjust oxygen.', 'Titrating oxygen means interpreting a sat against an order and a patient. That\'s assessment, and it stays with the RN (or RT).'); return 'Luis: "I already turned it up once today and you looked at me funny. You do it."'; }
      if (task.id === 'ciwa') { A.judge('deleg-ciwa', 'deleg', -1, 'You asked the CNA to score a CIWA.', 'CIWA includes judging orientation, hallucinations and agitation. That\'s nursing assessment, and it drives medication dosing.'); return 'Luis: "That\'s an assessment. I\'ll grab his vitals though."'; }
      if (task.id === 'walk') { A.judge('deleg-walk425', 'deleg', -2, 'You delegated walking a dizzy patient with a hemoglobin under 7.', 'Unstable patients aren\'t appropriate for delegated ambulation. She needed the commode, not a walk.', '425'); s.p['425'].fell = true; A.msg({ from: 'luis', pid: '425', urgent: true, text: 'She went down in the bathroom doorway. Knees buckled. Small cut on her scalp. She\'s back in bed.' }); return 'Luis helps her up. Halfway to the bathroom she goes gray.'; }
      const busy = s.deleg.filter((d) => !d.done).length;
      if (busy >= 2) return 'Luis: "I\'m tied up with two things. Give me a few."';
      if (task.id === 'blood' && (s.p['425'].unit || s.p['425'].transAt !== null || (s.p['425'].returned && s.t < s.p['425'].rightUnitAt))) return 'Luis: "Blood bank says there\'s nothing ready for her right now."';
      s.deleg.push({ id: task.id, pid, due: s.t + task.mins, done: false, at: s.t });
      if (task.id === 'vitals' || task.id === 'bg' || task.id === 'blood' || task.id === 'tray') A.judge('deleg-good-' + task.id, 'deleg', 1, `You delegated ${task.label.toLowerCase()} to the CNA.`, task.id === 'blood' ? 'Transporting blood is commonly delegated. The verification at the bedside is still yours.' : 'Routine, predictable tasks on stable patients are what CNAs are for. It frees you to assess.');
      return `Luis: "On it: ${task.label.toLowerCase()} for ${nm}."`;
    },
    complete(d, s, A) {
      const nm = A.def(d.pid).short;
      if (d.id === 'vitals') { const v = A.recordVitals(d.pid, 'Luis (CNA)'); A.msg({ from: 'luis', pid: d.pid, text: `${nm}: T ${v.T}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}% ${v.O2}.` }); }
      else if (d.id === 'bg') { const P = s.p['427'], g = darnellBG(s, P); P.bgAt = s.t; P.lastBG = g; P.bgs.push({ t: s.t, val: g, by: 'Luis (CNA)' }); A.msg({ from: 'luis', pid: '427', text: `Mr. Brooks's glucose is ${g}.` }); }
      else if (d.id === 'blood') { const P = s.p['425']; P.unit = P.returned ? 'right' : 'wrong'; P.checked = false; A.msg({ from: 'luis', pid: '425', text: 'Blood for 425 is in her room. Clock\'s ticking: 30 minutes to hang it.' }); }
      else if (d.id === 'tray') { const P = s.p['427']; if (!P.ate) { P.traySwapped = true; A.msg({ from: 'luis', pid: '427', text: 'Swapped 427\'s tray for renal. He\'s mourning the banana.' }); } }
      else if (d.id === 'bath') A.msg({ from: 'luis', pid: d.pid, text: `${nm} is washed up, fresh linens.` });
    },
  };

  /* ---------- Nova ---------- */
  function novaHint(s, A) {
    const Pa = s.p['421'], K = s.p['423'], B = s.p['425'], D = s.p['427'], M = s.p['429'];
    if (M.anaph > 0 && M.epiAt === null) return 'Throat tight after a new IV drug. One medication opens an airway. It\'s not the antihistamine.';
    if (reacting(B) && B.stopped === null) return 'Chills and back pain during a transfusion. What\'s the first thing you do, before you call anyone?';
    if (D.critAt !== null && !D.hkOrders) return 'The lab called you with a number that can stop a heart. Who needs to hear it, and how fast? Look at his monitor on your way.';
    if (B.unit && !B.checked) return 'Blood in hand. Read every identifier on that tag against her wristband with a second nurse. Every digit.';
    if (Pa.o2 > 2 && !Pa.bipap) return 'Somebody made a sat look better. For a CO₂ retainer, is 98% a good number? Check how awake she is.';
    if (ciwa(s, K) >= 14 && !recent(s, K.ciwaAt, 60)) return 'When did anyone last score his withdrawal? The protocol only works on schedule.';
    if (K.thiaAt === null && s.t >= 45) return 'His fluids switch to dextrose at 16:00. Is there anything that has to go in first?';
    if (M.arrived && !M.abxChanged && M.abxGiven === null) return 'New admission, new orders. Read every one of them against her allergy band. Well, against her allergy list; she doesn\'t have a band yet.';
    if (M.arrived && M.consentAt === null && s.t >= 120 && s.t < 165) return 'The surgeon is coming to consent her. What would make her unable to consent, and is there a pain option that won\'t?';
    if (!B.ibuStopped && s.t >= 60) return 'Read Mrs. Nakamura\'s MAR against her diagnosis. Does every active order make sense for a bleeding ulcer?';
    if (D.insAt !== null && !D.bgs.some((b) => b.t > D.insAt)) return 'Insulin fixed his potassium. What else does insulin do, and how long does it last without kidneys?';
    const unseen = A.c.patients.filter((d) => (!d.arrives || s.p[d.id].arrived) && !s.p[d.id].icu && !s.p[d.id].gone && (s.p[d.id].seenAt === null || s.t - s.p[d.id].seenAt > 75)).map((d) => d.room);
    if (unseen.length) return `You haven't laid eyes on ${unseen.join(' and ')} in over an hour. Go look.`;
    return 'You\'re in good shape. Now check the things you already fixed. Did they stay fixed?';
  }

  function endChecks(s, A) {
    A.c.patients.forEach((d) => {
      const P = s.p[d.id];
      if (d.arrives && !P.arrived) return;
      if (P.seenAt === null && !P.icu && !P.gone) A.judge(d.id + '-unseen', 'assess', -3, `You never went into ${d.room} this shift.`, 'Report tells you about the last shift; your own assessment tells you about this one.', d.id);
      (d.meds || []).forEach((m) => {
        const st = s.meds[m.id];
        if (m.due !== undefined && !m.conditional && m.due <= Math.min(240, s.t - 60) && st.status === 'due' && !P.icu && !P.gone) A.judge(m.id + '-missed', 'meds', -2, `${m.name} for ${d.short} (due ${clock(m.due)}) was never given or held.`, 'Every scheduled dose needs a decision: give, or hold with a reason and a notification.', d.id);
      });
    });
    const Pa = s.p['421'], K = s.p['423'], B = s.p['425'], D = s.p['427'], M = s.p['429'];
    if (Pa.o2 > 2 && !Pa.icu && !Pa.bipap) A.judge('421-o2-left', 'safety', -1, 'Mrs. Kowalski was still on 6 L at handoff.', 'Her order said 88–92%. The CNA\'s change was never reversed.', '421');
    if (K.ciwaAt === null) A.judge('423-noscore', 'assess', -2, 'Mr. Tran\'s CIWA was never scored this shift.', 'He was in the peak withdrawal window with a rising score. The protocol can\'t work without the assessment.', '423');
    if (D.critAt !== null && !D.notified) A.judge('427-crit-miss', 'comm', -2, 'Mr. Brooks\'s critical potassium never reached the provider.', 'Critical values have to be communicated, read back and documented. That call is the whole point of the lab calling you.', '427');
    if (D.spiroHeld && !A.hasJudg('427-sbar-spiro')) A.judge('427-hold-notify', 'comm', -1, 'You held spironolactone but didn\'t get the order changed.', 'The night nurse will face the same order tomorrow.', '427');
    if (M.arrived && M.admitted === null && !M.gone) A.judge('429-noadmit', 'assess', -1, 'Ms. Hassan\'s admission assessment wasn\'t done.', 'Admission sets the baseline and verifies allergies and home meds before anything else happens.', '429');
    const keys = []; A.c.patients.forEach((d) => (d.report || []).forEach((r, i) => { if (r.key) keys.push(d.id + ':' + i); }));
    const hit = keys.filter((k) => s.brain.includes(k)).length;
    if (s.brain.length) { const noise = s.brain.length - hit, precise = hit / s.brain.length;
      if (noise >= 4 && precise < .7) A.judge('brain', 'assess', -1, `You flagged ${s.brain.length} lines in report, ${noise} of them noise.`, 'Flagging everything is the same as flagging nothing. The skill is choosing: what here could hurt someone in the next few hours?');
      else A.judge('brain', 'assess', hit / keys.length >= 0.6 && precise >= .7 ? 1 : 0, `You flagged ${hit} of ${keys.length} critical cues during handoff${noise ? `, plus ${noise} that didn\'t matter` : ''}.`, 'Separating "he coaches basketball" from "potassium was 5.8 with a repeat pending" is the first act of clinical judgment on every shift.'); }
  }

  /* Bedside prep shortcuts offered inside the medication review. */
  const PREP = { '421-loraz': ['vitals'], '423-loraz': ['ciwa'], '423-hm': ['pain'], '427-ins': ['bg'], '427-spiro': ['strip'], '427-ca': ['strip'], '429-morph': ['pain'] };
  [pat, kevin, bea, darnell, amina].forEach((d) => d.meds.forEach((m) => { if (PREP[m.id]) m.prep = PREP[m.id]; }));

  S.engine.registerCase({
    id: 'medsurg-4w-2', title: 'Second wind', unit: '4 West, Medical-Surgical', level: 'Beginner', start: 15 * 60, length: 300, novaCredits: 3,
    card: 'Evening on 4 West. Four patients and an admission from the ED.',
    hero: { head: 'Four patients, one admission. Report at 15:00.', lede: 'An evening shift on 4 West. Blood is on its way up, a lab result is pending, and the ED is sending you a surgical patient before dinner. Watch what other people change, and read every order twice.' },
    intro: { time: '14:58', place: '4 West · Medical-Surgical', cta: 'Take report', beats: ['Evening shift. Four patients, and the ED is sending you a fifth.', 'Blood is on its way up. A critical lab is about to call.', 'Watch what other people change. Read every order twice.'] },
    minutes: 20,
    handoffBy: 'Marisol (day RN)', reportBy: 'marisol', reportRole: 'day shift', provider: 'adebayo', cna: 'luis',
    staff: {
      nova: { name: 'Nova Reyes', role: 'Charge nurse', look: { skin: '#B98A63', shade: '#976D4B', lip: '#7C4435', blush: '#C77B5E', iris: '#3D2A1C', head: { w: 55, h: 62, jaw: .35 }, eye: 10, hair: { style: 'bun', color: '#3A2E2A', streak: true }, brow: { w: 3.6, color: '#2E2421' }, body: { w: 80, cloth: 'navy' }, extras: ['studs'], smile: .35 } },
      luis: { name: 'Luis', role: 'CNA', look: { skin: '#B07B52', shade: '#8C5E3B', lip: '#7A4232', blush: '#C3705A', iris: '#2E1E14', head: { w: 56, h: 62, jaw: .6 }, eye: 10.4, hair: { style: 'swoop', color: '#1E1814' }, brow: { w: 4.4, color: '#1A1411' }, body: { w: 84, cloth: 'teal' }, extras: [], smile: .55, tired: true } },
      marisol: { name: 'Marisol', role: 'Day RN', look: { skin: '#C68B5E', shade: '#A36D44', lip: '#8A4538', blush: '#D07A5C', iris: '#2B1C12', head: { w: 54, h: 61, jaw: .3 }, eye: 10.2, hair: { style: 'long', color: '#2B1B14' }, brow: { w: 3.4, color: '#20150F' }, body: { w: 78, cloth: 'navy' }, extras: ['hoops'], smile: .3 } },
      adebayo: { name: 'Dr. Adebayo', role: 'Evening hospitalist', look: { skin: '#4A2C1C', shade: '#35200F', lip: '#3A1D13', blush: '#7E4230', iris: '#1B110B', head: { w: 53, h: 62, jaw: .3 }, eye: 10, hair: { style: 'bun', color: '#0F0B09' }, brow: { w: 3.4, color: '#0B0806' }, body: { w: 78, cloth: 'coat', steth: true }, extras: ['thinGlasses', 'gold'], glasses: '#8A6A2E', smile: .2 } },
      morales: { name: 'Dr. Morales', role: 'Surgeon', look: { skin: '#C9936A', shade: '#A7734C', lip: '#8A4A3A', blush: '#D0806A', iris: '#2D1D13', head: { w: 58, h: 63, jaw: .6 }, eye: 9.6, hair: { style: 'short', color: '#3A2A22' }, brow: { w: 4.4, color: '#2A1E18' }, body: { w: 86, cloth: 'blue' }, extras: ['mustache'], smile: .2 } },
      sam: { name: 'Sam', role: 'Respiratory therapist', look: { skin: '#F1D0B8', shade: '#D4A98E', lip: '#B8675F', blush: '#EC9588', iris: '#4A6A8A', head: { w: 54, h: 61, jaw: .35 }, eye: 10, hair: { style: 'ponytail', color: '#C9A35B' }, brow: { w: 3, color: '#9C7A3E' }, body: { w: 78, cloth: 'wine' }, extras: ['freckles'], smile: .4 } },
      jae: { name: 'Jae', role: 'Monitor tech', look: { skin: '#E6C29C', shade: '#C79E76', lip: '#A8625A', blush: '#DE9380', iris: '#241810', head: { w: 55, h: 61, jaw: .45 }, eye: 9.4, hair: { style: 'short', color: '#121012' }, brow: { w: 3.8, color: '#121012' }, body: { w: 80, cloth: 'grey' }, extras: ['headset'], smile: .3 } },
      hodan: { name: 'Hodan', role: 'Mother, 429', look: { skin: '#5E3A28', shade: '#452819', lip: '#4A281D', blush: '#94503E', iris: '#1C120B', head: { w: 56, h: 60, jaw: .35 }, eye: 9.6, hair: { style: 'hijab', color: '#2F6B5A' }, brow: { w: 3.2, color: '#1A110C' }, body: { w: 84, cloth: 'blouse', cardigan: '#6B4E3A' }, extras: ['wrinkles'], smile: .25 } },
      linh: { name: 'Linh', role: 'Mother, 423 (phone)', look: { skin: '#E6C3A0', shade: '#C7A07C', lip: '#A5625A', blush: '#DC9381', iris: '#1E140E', head: { w: 53, h: 59, jaw: .3 }, eye: 9.2, hair: { style: 'bob', color: '#4A4440' }, brow: { w: 2.8, color: '#3A3430' }, body: { w: 74, cloth: 'blouse', cardigan: '#9A6A7A' }, extras: ['wrinkles', 'thinGlasses'], glasses: '#6B4A3A', smile: .15 } },
      bank: { name: 'Blood bank', role: 'Transfusion service', look: null },
      lab: { name: 'Lab', role: 'Laboratory', look: null },
      ed: { name: 'ED', role: 'Emergency department', look: null },
      or: { name: 'OR', role: 'Operating room desk', look: null },
    },
    patients: [pat, kevin, bea, darnell, amina],
    dueExtras(s) {
      const out = [], K = s.p['423'], B = s.p['425'], D = s.p['427'], M = s.p['429'];
      if (K.dexAt === null) out.push({ t: 60, late: s.t > 90, text: '423 Change IV to D5 ½NS (thiamine first)' });
      if (K.ciwaAt === null || s.t - K.ciwaAt >= 60 && (K.lastCiwa || 0) >= 10) out.push({ t: K.ciwaAt === null ? 0 : K.ciwaAt + 60, late: K.ciwaAt === null ? s.t > 60 : s.t > K.ciwaAt + 90, text: '423 CIWA-Ar score' });
      if (B.transAt === null && !B.icu && s.t >= 20) out.push({ t: 20, late: s.t > 80, text: '425 Transfuse PRBC unit 1' });
      if (D.insAt !== null) { const next = D.insAt + 60 * (1 + D.bgs.filter((b) => b.t > D.insAt).length); if (next <= D.insAt + 240) out.push({ t: next, late: s.t > next + 20, text: '427 Glucose check after insulin' }); }
      if (M.arrived && !M.gone && M.anaph === 0 && M.abxGiven === null) out.push({ t: 180, late: s.t > 235, text: '429 Pre-op antibiotic, within 60 min of incision' });
      if (M.arrived && !M.gone && M.anaph === 0) out.push({ t: 240, late: false, text: '429 To OR, pre-op checklist complete' });
      return out;
    },
    replies: {
      'o2-back'(s, A) { const P = s.p['421']; P.o2 = 2; P.o2Fixed = s.t; P.luisTaught = true; A.judge('421-o2-back', 'deleg', 2, 'You had Luis return Mrs. Kowalski\'s oxygen to 2 L and explained why.', 'Changing oxygen isn\'t in a CNA\'s scope, and for a CO₂ retainer more isn\'t better. Correcting it right away, and teaching, protects this patient and the next one.', '421'); A.msg({ from: 'luis', pid: '421', text: 'Got it, back to 2. I didn\'t know high sats could be bad for her. Won\'t touch the O₂ again.' }); },
      'o2-leave'(s, A) { A.judge('421-o2-leave', 'judgment', -2, 'You approved raising a CO₂ retainer\'s oxygen to 6 L.', 'Her target was 88–92%. A sat of 98% in chronic hypercapnia is too much oxygen. It suppresses her drive to breathe and lets CO₂ climb.', '421'); A.msg({ from: 'luis', pid: '421', text: 'Cool, leaving it.' }); },
      'linh-good'(s, A) { A.judge('423-linh', 'comm', 2, 'You protected Mr. Tran\'s privacy with his mother, kindly.', 'Without his permission, you can\'t confirm diagnosis details, even to family. Offering to pass the message along respects both of them.', '423'); A.msg({ from: 'linh', pid: '423', text: '"...Okay. Tell him his mother loves him and he should call."' }); },
      'linh-bad'(s, A) { A.judge('423-linh', 'comm', -3, 'You disclosed Mr. Tran\'s diagnosis and drinking to his mother without permission.', 'He specifically asked you not to. That\'s a privacy violation (HIPAA) and a break in trust with a patient already at risk of leaving.', '423'); A.msg({ from: 'linh', pid: '423', text: '"I knew it. I KNEW it." She hangs up. Ten minutes later his phone starts ringing nonstop.' }); },
      'linh-fine'(s, A) { A.judge('423-linh', 'comm', -1, 'You told Mr. Tran\'s mother he was fine.', 'That\'s not true, and it\'s still disclosing information. "I can\'t share details without his permission" is honest and kind.', '423'); A.msg({ from: 'linh', pid: '423', text: '"Then why is he in the hospital?" She sounds unconvinced.' }); },
      'bea-walk-no'(s, A) { A.judge('425-walk-no', 'safety', 1, 'You kept Mrs. Nakamura on the commode with help.', 'Hemoglobin under 7, orthostatic dizziness and a GI bleed: getting up alone is how hip fractures happen. Her dignity matters, and so does staying with her.', '425'); A.msg({ from: 'luis', pid: '425', text: 'Got it. I\'ll pull the curtain and stay close.' }); },
      'bea-walk-yes'(s, A) { const P = s.p['425']; if (P.doneAt !== null) { A.judge('425-walk-yes', 'judgment', -1, 'You let Mrs. Nakamura walk alone right after a transfusion.', 'Even at 7.9, she\'s orthostatic and a fall risk. She made it, but someone should have been with her.', '425'); A.msg({ from: 'luis', pid: '425', text: 'She made it there and back. Slow, but okay.' }); } else { P.fell = true; A.judge('425-walk-yes', 'safety', -2, 'You let Mrs. Nakamura walk alone with a hemoglobin of 6.9.', 'Orthostatic, anemic, bleeding: she fainted in the doorway. The commode order existed for this.', '425'); A.msg({ from: 'luis', pid: '425', urgent: true, text: 'She fainted in the bathroom doorway. Hit her head on the frame. She\'s awake, back in bed, small cut.' }); } },
    },
    priority: {
      judge(r, A) {
        if (r[0] === '425') A.judge('rank-first', 'priority', 2, 'You chose to see Mrs. Nakamura first.', 'Hemoglobin 6.9, heart rate over 100, pressure around 100, and blood on the way: she\'s the one whose circulation is actually failing right now.', '425');
        else A.judge('rank-first', 'priority', -1, `You put ${A.def(r[0]).short} first, ahead of Mrs. Nakamura.`, 'Mrs. Nakamura was the one with an active circulation problem: a bleeding ulcer, Hgb 6.9, tachycardia, soft pressure. Airway, breathing, circulation, and hers was the most at risk.', '425');
        if (r[0] !== '421' && r.indexOf('421') < 2) A.judge('rank-421', 'priority', -1, 'You ranked Mrs. Kowalski near the top.', 'A sat of 90% was exactly her goal. She looked the most distressed and was the most stable. That will change if someone changes her oxygen.', '421');
      },
      correct: ['425', '427', '423', '421'],
      why: {
        '425': 'Hemoglobin 6.9 from an ulcer bleed, heart rate over 100, pressure near 100, and blood coming up. Circulation first.',
        '427': 'Potassium 5.8 with rising creatinine, on tele, repeat pending. Potentially lethal, but not yet critical.',
        '423': 'Forty hours from his last drink, CIWA climbing. He needs a score within the hour, not this minute.',
        '421': 'Sat 90% on 2 L is her target. She looks the most anxious and is the most stable, for now.',
      },
    },
    events, delegation, dialogs, novaHint, endChecks,
    tick(s, A) {
      const Pa = s.p['421'];
      if (!Pa.icu) {
        if (Pa.bipap) Pa.co2 = Math.max(52, Pa.co2 - .6);
        else if (Pa.o2 > 3) Pa.co2 += .06 * (Pa.o2 - 2);
        else Pa.co2 += (53 - Pa.co2) * .012;
        if (recent(s, Pa.lorazAt, 240)) Pa.co2 += .05;
      }
      const B = s.p['425'];
      if (!B.icu && B.transAt !== null && B.transUnit === 'wrong') {
        if (B.reactionAt === null && s.t >= B.transAt + 6) B.reactionAt = s.t;
        if (B.reactionAt !== null) B.rsev = clamp(B.rsev + (B.stopped === null ? 1.3 : B.ns ? -.35 : -.15), 0, 60);
      }
      const M = s.p['429'];
      if (M.anaph > 0 && !M.icu) { M.anaph = M.epiAt === null ? M.anaph + .8 : Math.max(.1, M.anaph - .4); if (M.anaph >= 14) { M.icu = true; M.gone = true; M.goneText = 'Transferred to ICU (anaphylaxis)'; A.judge('429-icu', 'safety', -3, 'Ms. Hassan\'s anaphylaxis progressed to airway compromise before epinephrine.', 'Anaphylaxis kills in minutes. Epinephrine IM at the first sign of airway or circulation involvement.', '429'); A.msg({ from: 'luis', pid: '429', urgent: true, text: 'Rapid response 429. Airway\'s closing. They\'re intubating and moving her to ICU.' }); } }
    },
  });
})(window.Shift);
