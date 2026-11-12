/* Case: Emergency Department, Pod B, evening (15:00–20:00). Specialty.
   Themes: time is tissue, and the facts that decide treatment come from asking, not from the triage note.
   21: "Indigestion" in a 64-year-old with diabetes. Troponin creeping, then an inferior STEMI on the repeat ECG, with
       right ventricular involvement: nitroglycerin will drop her pressure. Aspirin was never given at triage.
   22: Stroke alert. EMS says onset 14:30, which is when his wife found him. She last saw him normal at 10:00, so the
       thrombolysis window closed at 14:30, before he even arrived. The order is coming anyway. The right answer is a thrombectomy.
   23: Lower abdominal pain, positive pregnancy test, "period cramps." Waiting for an ultrasound while she bleeds into
       her abdomen: shoulder pain, dizziness, a heart rate that climbs. Her partner answers every question for her.
   24 (arrives 16:10): Anaphylaxis after peanut sauce. EMS gave diphenhydramine, not epinephrine.
   25 (arrives 17:30): An 81-year-old on warfarin who fell and hit his head. GCS 15, "I feel fine." The bleed is slow. */
(function (S) {
  const { clamp, clock } = S.engine;
  const jit = (s, seed) => ((Math.floor(s.t / 5) * 7 + seed * 13) % 3) - 1;
  const recent = (s, t0, m) => t0 !== null && t0 !== undefined && s.t - t0 <= m;

  /* ---------- 21 Rosalind Hughes: atypical ACS evolving into an inferior STEMI with RV involvement ---------- */
  const stemi = (P) => P.isch >= .35;
  const rHR = (P) => Math.round(stemi(P) ? 58 - Math.min(10, (P.isch - .35) * 14) : 92 + P.isch * 20);
  const rSBP = (P) => Math.round((stemi(P) ? 108 : 134) - P.isch * 8 - (P.nitroDrop || 0) + (P.fluid ? 16 : 0));
  const ros = {
    id: '21', room: '21', name: 'Rosalind Hughes', short: 'Ms. Hughes', age: 64, sex: 'F', mrn: '01844120',
    look: { skin: '#E9C6A8', shade: '#CDA488', lip: '#B06A5E', blush: '#E39883', iris: '#4A5E70', head: { w: 56, h: 61, jaw: .35 }, eye: 9.4,
      hair: { style: 'bob', color: '#B8B0A8' }, brow: { w: 3, color: '#8A8078' }, body: { w: 84, cloth: 'gown' }, extras: ['wrinkles', 'gold'], smile: .3,
      lines: { calm: `It's just indigestion. I shouldn't have had the chili at lunch.`, pain: `The pressure's back. Up into my jaw now.`, anxious: `I feel awful. Something's wrong.`, nausea: `I'm going to be sick.`, drowsy: `I'm so tired.`, none: `She doesn't respond.` } },
    bio: `Ran the laundry at St. Vincent's for 31 years. Type 2 diabetes, smokes half a pack a day "down from two." Lives with her sister Bev, who drove her in.`,
    dx: `Epigastric pain, rule out ACS`, reason: `"Indigestion" since lunch, nausea, unusual tiredness. Triaged at 14:40, ESI 3. First ECG nonspecific; troponin pending.`,
    hx: [`Type 2 diabetes for 15 years`, `Hypertension, high cholesterol`, `Smoker, 40 pack-years`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `79 kg`,
    lines: [`PIV 20g left antecubital`], mobility: `Stretcher`, diet: `NPO except meds`,
    init: { isch: .08, asa: null, ecgs: [], stemiSeen: null, v4r: null, called: null, cath: null, nitro: [], nitroDrop: 0, fluid: false, hep: null, hepDose: null, arrest: false, gone: false, tropSeen: false, sympAt: null },
    nightVitals: { T: 36.8, HR: 94, SBP: 136, DBP: 82, RR: 18, SpO2: 96, O2: 'Room air', pain: 4 },
    labs: [
      { name: 'ECG 14:42 (triage)', val: 'Sinus 92. Nonspecific ST-T changes. No STEMI.', unit: '', ref: '', flag: '', t: -18 },
      { name: 'Glucose', val: 212, unit: 'mg/dL', ref: '70–140', flag: 'H', t: -10 },
      { name: 'hs-Troponin I (0 h)', val: 'Pending', unit: '', ref: 'under 16 (women)', flag: '', t: -10 },
    ],
    orders: [
      { t: -15, text: `Chest pain protocol: continuous cardiac monitoring. Aspirin 324 mg chewed now (not given at triage). Repeat 12-lead ECG in 30 minutes and with any change in symptoms. hs-troponin at 0 and 2 hours.` },
      { t: -15, text: `Nitroglycerin 0.4 mg SL every 5 minutes ×3 as needed for chest pain: hold for SBP under 90, HR under 50, phosphodiesterase inhibitor use, or suspected right ventricular infarct. Ondansetron 4 mg IV as needed, nausea.` },
    ],
    notes: [
      { t: -18, author: 'Sid, triage RN', text: `64F, "indigestion" since 12:30, nauseated, "wiped out." Denies chest pain. Diabetic. ECG at triage read by Dr. Osei, no STEMI. ESI 3. Aspirin not given: pt said she took "something for heartburn" at home.` },
    ],
    io: { intake: `NPO`, output: `—` },
    report: [
      { text: `Rosalind Hughes, 64, diabetic smoker, came in for indigestion and feeling wiped out. Triage ECG was nonspecific.`, key: true },
      { text: `First troponin is pending. Repeat ECG's due at three-fifteen.`, key: true },
      { text: `She didn't get aspirin at triage. She'd taken an antacid at home.`, key: true },
      { text: `She says it's not chest pain. Just pressure.`, key: true },
      { text: `Her sister Bev drove her and keeps asking for a coffee.`, key: false },
    ],
    vitals(s, P) { return { T: 36.8, HR: rHR(P) + jit(s, 1) * 2, SBP: rSBP(P) + jit(s, 2) * 2, DBP: Math.round(rSBP(P) * .6), RR: 18 + (stemi(P) ? 3 : 0), SpO2: stemi(P) ? 94 : 96, O2: 'Room air', pain: P.arrest ? 0 : Math.min(8, Math.round(4 + P.isch * 5)) }; },
    assess: {
      general: (s, P) => (stemi(P) ? `Gray and sweaty, a fist pressed under her sternum. "It's in my jaw now."` : `Sitting up, a hand on her upper belly, tired. "It's just heartburn, honey."`),
      resp: () => `RR 18. Clear bilaterally.`,
      cardiac: (s, P, A) => { P.k.card = s.t; const v = A.vitals('21'); return `HR ${v.HR}${stemi(P) ? ', sinus bradycardia' : ', regular'}. BP ${v.SBP}/${v.DBP}. ${stemi(P) ? 'Neck veins distended sitting up. Lungs clear: a right-sided picture.' : 'No JVD. No murmur.'}`; },
      neuro: () => `Alert, oriented.`,
      pain: (s, P) => { P.k.pain = s.t; return `"Pressure," ${Math.min(8, Math.round(4 + P.isch * 5))}/10, epigastric, ${stemi(P) ? 'now into her jaw and left arm' : 'no radiation'}. Started at 12:30. Nothing makes it better.`; },
      skin: (s, P) => (stemi(P) ? `Cool and diaphoretic.` : `Warm, dry.`),
      gi: () => `Nauseated. Soft, mild epigastric tenderness.`,
    },
    interventions: [
      {
        id: 'ecg', label: 'Repeat 12-lead ECG, and read it', cost: 4,
        run(s, P, A) {
          P.ecgs.push(s.t);
          if (stemi(P)) { if (P.stemiSeen === null) { P.stemiSeen = s.t; A.judge('21-ecg', 'assess', 2, `You caught Ms. Hughes's STEMI on the repeat ECG.`, `A first ECG can be normal. Repeat it on schedule and whenever symptoms change: ST elevation can appear minutes later.`, '21'); } A.addLab('21', { name: `ECG ${clock(s.t)}`, val: 'Sinus bradycardia 58. ST elevation II, III, aVF with reciprocal depression in I and aVL. Inferior STEMI.', unit: '', ref: '', flag: 'A' }); return `Sinus bradycardia 58. ST elevation in II, III and aVF, 3 mm, with ST depression in I and aVL. Inferior STEMI. ST elevation in III greater than in II: think right coronary, and the right ventricle.`; }
          A.judge('21-ecg-early', 'assess', 1, `You repeated Ms. Hughes's ECG.`, `Serial ECGs catch an evolving MI the first one missed.`, '21');
          A.addLab('21', { name: `ECG ${clock(s.t)}`, val: 'Sinus 96. Subtle ST straightening in III, otherwise unchanged.', unit: '', ref: '', flag: '' });
          return `Sinus 96. Subtle straightening of the ST segment in III. No ST elevation yet. Repeat in 15 to 30 minutes, or sooner if her symptoms change.`;
        },
      },
      { id: 'pads', label: 'Place defibrillator pads; crash cart to the bedside', cost: 2, avail: (s, P) => P.called !== null && !P.pads && !P.gone, run(s, P, A) { P.pads = true; A.judge('21-pads', 'safety', 1, `You put pads on Ms. Hughes before the cath lab came.`, `An acute STEMI can go into VF without warning. Pads on means a shock in seconds, not minutes.`, '21'); return `Pads on, front and back. Crash cart parked at the curtain. She asks if that's for her. "Just in case," you say.`; } },
      { id: 'v4r', label: 'Right-sided ECG (V4R)', cost: 3, avail: (s, P) => P.stemiSeen !== null && P.v4r === null, run(s, P, A) { P.v4r = s.t; A.judge('21-v4r', 'assess', 2, `You got a right-sided ECG for Ms. Hughes's inferior STEMI.`, `About a third of inferior MIs involve the right ventricle. A right ventricle that's infarcted depends on preload: nitroglycerin and morphine can crash the pressure.`, '21'); return `V4R: 1.5 mm ST elevation. Right ventricular involvement. Preload-dependent: no nitrates; fluids if her pressure falls.`; } },
    ],
    meds: [
      { id: '21-asa', name: 'Aspirin (chewable)', dose: '324 mg', route: 'PO', freq: 'Once, now', due: 0, block: (s, P) => (P.asa !== null ? 'Given at ' + clock(P.asa) + '.' : null), checks: () => [{ label: 'Allergy', value: 'None', ok: true }, { label: 'Active bleeding', value: 'None', ok: true }], give(s, P, A) { P.asa = s.t; A.judge('21-asa', 'meds', s.t <= 20 ? 2 : 1, `You gave Ms. Hughes chewable aspirin${s.t <= 20 ? ' right away' : ''}.`, `In possible ACS, aspirin chewed early reduces death. An antacid at home isn't a reason to hold it.`, '21'); return `Aspirin 324 mg, four 81 mg tablets, chewed.`; } },
      {
        id: '21-ntg', name: 'Nitroglycerin', dose: '0.4 mg', route: 'SL', freq: 'Every 5 min ×3 as needed, chest pain', prn: true,
        checks: (s, P, A) => { const v = A.vitals('21'); return [{ label: 'Blood pressure', value: `${v.SBP}/${v.DBP}`, ok: v.SBP >= 90 }, { label: 'Heart rate', value: `${v.HR}`, ok: v.HR >= 50 }, { label: 'Right ventricle', value: P.v4r !== null ? 'V4R positive: RV infarct' : stemi(P) && P.stemiSeen !== null ? 'Inferior STEMI: not yet checked' : 'No STEMI seen', ok: P.v4r !== null ? false : stemi(P) && P.stemiSeen !== null ? null : true }, { label: 'Sildenafil or tadalafil', value: 'None', ok: true }]; },
        give(s, P, A) {
          P.nitro.push(s.t);
          if (stemi(P)) { P.nitroDrop = (P.nitroDrop || 0) + 30; A.judge('21-ntg-rv', 'meds', P.v4r !== null ? -3 : -2, `You gave nitroglycerin in an inferior STEMI${P.v4r !== null ? ' with a positive V4R' : ''}.`, `An infarcted right ventricle needs preload to fill. Nitroglycerin dilates the veins and the pressure falls off a cliff. Check V4R in every inferior MI before nitrates.`, '21'); return `Nitroglycerin 0.4 mg SL. Four minutes later her BP is ${rSBP(P)}/${Math.round(rSBP(P) * .6)} and she's gray.`; }
          A.judge('21-ntg', 'meds', 0, `You gave Ms. Hughes nitroglycerin.`, `Reasonable for ischemic pain with a good pressure. Did it help? Pain relief from nitro doesn't rule out MI.`, '21');
          return `Nitroglycerin 0.4 mg SL. Pressure eases a little, 4/10.`;
        },
      },
      { id: '21-ns', name: 'Normal saline bolus', dose: '500 mL', route: 'IV', freq: 'Once (new order)', prn: true, available: (s, P) => P.called !== null, block: (s, P) => (P.fluid ? 'Given.' : null), checks: () => [{ label: 'Lungs', value: 'Clear', ok: true }], give(s, P, A) { P.fluid = true; P.nitroDrop = Math.max(0, (P.nitroDrop || 0) - 20); A.judge('21-ns', 'meds', rSBP(P) < 100 ? 1 : 0, `You gave Ms. Hughes a fluid bolus.`, `Right ventricular infarcts are preload-dependent: fluid holds the pressure.`, '21'); return `500 mL normal saline wide open.`; } },
      {
        id: '21-hep', name: 'Heparin bolus', dose: '60 units/kg, max 4,000 units', route: 'IV', freq: 'Once (new order)', prn: true, available: (s, P) => P.called !== null,
        block: (s, P) => (P.hep !== null ? 'Given at ' + clock(P.hep) + '.' : null),
        checks: () => [{ label: 'Weight', value: '79 kg', ok: null }, { label: 'Bleeding history', value: 'None', ok: true }],
        doses: [{ id: 1, label: '4,000 units IV (60 units/kg = 4,740, capped at 4,000)' }, { id: 2, label: '4,740 units IV (60 units/kg)' }, { id: 3, label: '10,000 units IV' }],
        give(s, P, A, dose) { P.hep = s.t; P.hepDose = dose; A.judge('21-hep', 'meds', dose === 1 ? 1 : dose === 2 ? -1 : -2, dose === 1 ? `You gave the capped heparin bolus.` : `You gave the wrong heparin bolus.`, `The ED STEMI protocol is 60 units/kg with a maximum of 4,000 units; the cath lab tops it up for the procedure. Read the cap, and double-check high-alert doses with a second nurse.`, '21'); return `Heparin ${['', '4,000', '4,740', '10,000'][dose]} units IV push, second-nurse checked.`; },
      },
      { id: '21-ond', name: 'Ondansetron', dose: '4 mg', route: 'IV', freq: 'Every 6 h as needed, nausea', prn: true, checks: () => [{ label: 'QTc', value: '438 ms', ok: true }], give: () => `Ondansetron 4 mg IV.` },
    ],
    talk: (s, P) => (P.gone || P.arrest ? null : stemi(P) && !P.k.talkJaw ? 'ros_jaw' : P.k.talked ? 'ros_after' : 'ros_talk'),
    family: { name: 'Bev', rel: 'Sister', mode: 'bedside', cost: 3, avail: (s, P) => !P.gone, dialog: (s, P) => (P.k.bev ? 'bev_after' : 'bev_talk') },
    sbar: {
      items(s, P, A) {
        const v = A.vitals('21');
        return [
          { id: 'stemi', label: 'Repeat ECG: ST elevation II, III, aVF', key: true, need: P.stemiSeen !== null, lock: 'Repeat her ECG' },
          { id: 'v4r', label: 'V4R positive: right ventricular involvement', key: true, need: P.v4r !== null, lock: 'Get a right-sided ECG' },
          { id: 'pain', label: 'Pressure now into her jaw and arm, diaphoretic', key: true, need: stemi(P) },
          { id: 'vs', label: `HR ${v.HR}, BP ${v.SBP}/${v.DBP}`, key: true, need: true },
          { id: 'asa', label: P.asa !== null ? `Aspirin 324 mg at ${clock(P.asa)}` : 'Aspirin not yet given', key: true, need: true },
          { id: 'trop', label: P.tropSeen ? 'Troponin 0 h: 38' : 'Troponin pending', key: P.tropSeen, need: true },
          { id: 'mail', label: 'Retired laundry supervisor', key: false, need: true },
        ];
      },
      requests: [
        { id: 'cath', label: 'Inferior STEMI on her repeat ECG. Please activate the cath lab. V4R is positive, so I\'m holding nitro.' },
        { id: 'trop', label: 'Can we wait for the second troponin before deciding anything?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (!picked.includes('stemi')) { if (stemi(P)) return `What does her ECG show now? Get me a repeat.`; return `Her first ECG was nonspecific. Repeat it on time and with any change; call me with the second troponin.`; }
        if (req === 'trop') { A.judge('21-sbar-trop', 'judgment', -2, `You suggested waiting for a troponin with a STEMI on the ECG.`, `ST elevation is the diagnosis. Troponin takes hours; the cath lab is the treatment.`, '21'); }
        if (P.called === null) { P.called = s.t; P.cath = s.t + 30; A.addOrder('21', `STEMI: cath lab activated. Heparin 60 units/kg IV bolus (max 4,000 units). Aspirin if not given. No nitrates: RV involvement. Normal saline 500 mL for SBP under 100. Defibrillator pads on.`); }
        A.judge('21-sbar', 'comm', req === 'cath' && picked.includes('v4r') ? 2 : 1, `You called a STEMI for Ms. Hughes.`, `Door to balloon in 90 minutes starts with the nurse who reads the repeat ECG and says "STEMI."${picked.includes('v4r') ? ' And you named the right ventricle, which changes what can be given.' : ''}`, '21');
        return `Cath lab activated, they're 30 minutes out. Heparin bolus, pads on. ${picked.includes('v4r') ? 'Good catch on V4R: no nitro, fluids if she drops.' : 'Did you get a V4R? It\'s inferior.'}`;
      },
    },
    scene: (s, P) => ({ tele: true, teleWave: stemi(P) && !P.arrest ? 'stemi' : 'normal', iv: P.fluid ? 'running' : 'lock', tray: 'none', family: P.gone ? null : 'bev', familyLabel: 'Bev, her sister', empty: P.gone, emptyText: P.arrest ? 'Stretcher empty. To the cath lab after a cardiac arrest.' : 'Stretcher empty. To the cath lab.' }),
    clues: (s, P) => ({ monitor: stemi(P) ? `Sinus bradycardia, the ST segments in the inferior leads lifted like tombstones.` : `Sinus rhythm in the 90s.`, family: `Bev, holding Rosalind's purse. "She never complains. If she came in, it's bad."` }),
    rig: (s, P) => ({ hr: rHR(P), sbp: rSBP(P), pain: Math.min(8, Math.round(4 + P.isch * 5)), sweat: stemi(P) ? .6 : 0, pale: stemi(P) ? .4 : 0, nausea: !stemi(P), anxious: stemi(P) ? .5 : 0 }),
    status: (s, P) => (P.gone ? 'gone' : stemi(P) || rSBP(P) < 90 ? 'urgent' : 'watch'),
    outcome(s, P) {
      if (P.arrest) return { tone: 'bad', title: 'Ventricular fibrillation, then the cath lab', text: `She arrested at ${clock(P.arrestAt)} with an inferior STEMI nobody had called. ${P.stemiSeen === null ? 'The repeat ECG was never done.' : 'It was on the ECG from ' + clock(P.stemiSeen) + '.'} Three shocks, then the cath lab.` };
      if (P.gone && P.called !== null) { const fast = P.called - P.stemiSeen <= 15; return { tone: (P.nitroDrop || 0) > 0 || !fast ? 'mixed' : 'good', title: (P.nitroDrop || 0) > 0 ? 'STEMI called, after a nitro-induced crash' : fast ? 'STEMI caught on the repeat ECG' : 'STEMI called late', text: `Repeat ECG at ${clock(P.stemiSeen)}, cath lab activated at ${clock(P.called)}. Right coronary artery stented.${P.asa !== null ? '' : ' She never got aspirin in the ED.'}${(P.nitroDrop || 0) > 0 ? ' Nitroglycerin dropped her pressure on the way.' : ''}` }; }
      if (P.stemiSeen === null) return { tone: 'bad', title: 'Evolving STEMI, never re-imaged', text: `The repeat ECG was due at 15:15. Her pain went to her jaw and her ST segments lifted on the monitor.` };
      return { tone: 'bad', title: 'STEMI seen, cath lab not called', text: `ST elevation on the ECG at ${clock(P.stemiSeen)}. No one activated the cath lab.` };
    },
  };

  /* ---------- 22 Gerald Haskins: stroke alert; "onset 14:30" is when he was found, not when he was last normal ---------- */
  const wNIH = (P) => Math.round(P.nih + (P.ich ? 8 : 0));
  const wSBP = (P) => Math.round(198 - P.bpDrop + (P.ich ? 22 : 0));
  const walter = {
    id: '22', room: '22', name: 'Gerald Haskins', short: 'Mr. Haskins', age: 72, sex: 'M', mrn: '01844173',
    look: { skin: '#6A4430', shade: '#4F3122', lip: '#502A1E', blush: '#94503E', iris: '#1E130C', head: { w: 58, h: 63, jaw: .6 }, eye: 9.4,
      hair: { style: 'balding', color: '#D8D2CC' }, brow: { w: 4, color: '#C8C0B8' }, body: { w: 86, cloth: 'gown' }, extras: ['mustache', 'wrinkles'], smile: .1,
      lines: { calm: `Mm. Mm-hm.`, confused: `Wha— the, the... (he can't find the word)`, anxious: `(He grips your hand with his left. His right lies still.)`, drowsy: `(He doesn't open his eyes when you say his name.)`, none: `He doesn't respond.` } },
    bio: `Retired high-school band director; still plays trumpet at church. Married to Joan for 48 years.`,
    dx: `Stroke alert: right weakness, aphasia`, reason: `Brought by EMS as a stroke alert at 14:52. Right arm and leg weakness, can't get words out. EMS report: onset 14:30. CT done 14:58.`,
    hx: [`Hypertension (lisinopril)`, `High cholesterol (atorvastatin)`, `No anticoagulants`, `No prior stroke`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `82 kg`,
    lines: [`PIV 18g right antecubital`, `PIV 20g left forearm`], mobility: `Stretcher, fall precautions`, diet: `NPO until swallow screen`,
    init: { nih: 14, reassessed: false, lkw: false, lkwTold: false, checks: [], bpDrop: 0, lab: null, called: null, tpaOrder: false, tpaClarified: false, tpaGiven: null, ich: false, ir: null, gone: false, ctRead: false, cta: false, water: false, swallow: false },
    nightVitals: { T: 36.7, HR: 84, SBP: 198, DBP: 108, RR: 16, SpO2: 97, O2: 'Room air', pain: 0 },
    labs: [
      { name: 'Glucose (EMS)', val: 142, unit: 'mg/dL', ref: '70–140', flag: '', t: -30 },
      { name: 'CT head without contrast', val: 'Read pending', unit: '', ref: '', flag: '', t: -2 },
      { name: 'Platelets', val: 236, unit: 'K/µL', ref: '150–400', flag: '', t: -5 },
      { name: 'INR', val: 1.0, unit: '', ref: '0.9–1.1', flag: '', t: -5 },
    ],
    orders: [
      { t: -8, text: `Stroke alert. NIHSS on arrival and every 15 minutes. Neuro checks every 15 minutes. BP every 15 minutes: goal under 185/110 before any reperfusion therapy. Labetalol 10–20 mg IV over 2 minutes, may repeat once, for BP over 185/110. CT head, CTA head and neck. NPO until bedside swallow screen.` },
    ],
    notes: [
      { t: -8, author: 'EMS', text: `72M, wife found him on the couch at 14:30 unable to speak, R arm and leg weak. Onset 14:30. Glucose 142. BP 202/110. Wife following by car.` },
    ],
    io: { intake: `NPO`, output: `—` },
    report: [
      { text: `Gerald Haskins, 72, stroke alert, came in at two-fifty-two. Right-sided weakness and he can't get his words out.`, key: true },
      { text: `EMS says onset at two-thirty. CT's done, waiting on the read.`, key: true },
      { text: `His pressure's high, 198 over 108.`, key: true },
      { text: `Glucose was fine with EMS. He's NPO.`, key: false },
      { text: `His wife Joan just got here. She's parking.`, key: true },
      { text: `He's a retired band teacher. Joan says he still plays trumpet.`, key: false },
    ],
    vitals(s, P) { return { T: 36.7, HR: 84 + jit(s, 3) * 2, SBP: wSBP(P) + jit(s, 4) * 2, DBP: Math.round(108 - P.bpDrop * .5 + (P.ich ? 10 : 0)), RR: 16, SpO2: 97, O2: 'Room air', pain: P.ich ? 7 : 0 }; },
    assess: {
      general: (s, P) => (P.ich ? `Vomiting. Eyes closed, groaning, hard to rouse.` : `Lying on the stretcher, right arm limp beside him, trying to talk and frowning when the words don't come.`),
      resp: () => `Unlabored. Clear.`,
      cardiac: (s, P, A) => { const v = A.vitals('22'); return `HR ${v.HR}, regular. BP ${v.SBP}/${v.DBP}. No carotid bruit.`; },
      neuro: (s, P, A) => { P.checks.push(s.t); P.k.neuro = s.t; if (P.checks.length === 1) A.judge('22-nih', 'assess', s.t <= 15 ? 2 : 1, `You did Mr. Haskins's NIHSS.`, `The NIH Stroke Scale is the baseline every later check is compared against, and part of the decision about treatment.`, '22'); return P.ich ? `NIHSS ${wNIH(P)}. Responds only to pain. Right pupil 3 mm, left 5 mm and sluggish.` : `NIHSS ${wNIH(P)}: right arm drifts down in 5 seconds, right leg can't lift against gravity, right facial droop, expressive aphasia (understands, can't produce words), no neglect. Gaze conjugate. Pupils equal.`; },
      pain: (s, P) => (P.ich ? `Grimaces; holds his head.` : `Shakes his head no.`),
      skin: () => `Warm, dry. No signs of trauma.`,
      gi: (s, P) => (P.water ? `Coughing after a sip of water. Wet voice.` : `NPO. Abdomen soft.`),
    },
    interventions: [
      { id: 'lkw', label: 'Ask Joan exactly when he was last seen normal', cost: 2, avail: (s, P) => !P.lkw, run(s, P, A) { P.lkw = true; A.judge('22-lkw', 'assess', 2, `You established Mr. Haskins's true last known well.`, `Last known well is the last time someone saw him at his baseline, not the time he was found. Every treatment window starts there.`, '22'); return `Joan: "He was fine when I left for my sister's at ten. He waved from the porch. When I came home at two-thirty he was on the couch like this." Last known well: 10:00, not 14:30.`; } },
      { id: 'reassess', label: 'Recheck his BP and NIHSS after labetalol', cost: 3, avail: (s, P) => P.lab !== null && !P.reassessed && s.t - P.lab >= 8, run(s, P, A) { P.reassessed = true; P.checks.push(s.t); const v = A.vitals('22'); A.judge('22-reassess', 'judgment', 2, `You rechecked Mr. Haskins after lowering his pressure.`, `Did it reach the goal without dropping too far? And did his deficits change? Both decide what happens next.`, '22'); return `BP ${v.SBP}/${v.DBP}${v.SBP <= 185 ? ', under the goal' : ', still over 185: second dose'}. NIHSS ${wNIH(P)}, unchanged.`; } },
      { id: 'swallow', label: 'Bedside swallow screen', cost: 3, avail: (s, P) => !P.swallow, run(s, P, A) { P.swallow = true; A.judge('22-swallow', 'safety', 1, `You did Mr. Haskins's swallow screen before giving him anything by mouth.`, `Up to half of stroke patients have trouble swallowing. Screen before water, food or pills: aspiration pneumonia is a leading complication.`, '22'); return `Fails: coughing and a wet voice after a teaspoon of water. Stays NPO; speech therapy consult.`; } },
    ],
    meds: [
      {
        id: '22-lab', name: 'Labetalol', dose: '10 mg over 2 min', route: 'IV', freq: 'For BP over 185/110; may repeat once', prn: true,
        checks: (s, P, A) => { const v = A.vitals('22'); return [{ label: 'Blood pressure', value: `${v.SBP}/${v.DBP}`, ok: v.SBP > 185 || v.DBP > 110 }, { label: 'Heart rate', value: `${v.HR}`, ok: v.HR >= 60 }, { label: 'Asthma or heart block', value: 'None', ok: true }]; },
        give(s, P, A) { const v = A.vitals('22'); P.bpDrop += 16; if (P.lab === null) P.lab = s.t; if (v.SBP <= 185 && v.DBP <= 110) A.judge('22-lab-' + s.t, 'meds', -1, `You gave labetalol with a pressure of ${v.SBP}/${v.DBP}.`, `In acute stroke the brain around the clot depends on pressure. Lower it only to the threshold the treatment needs.`, '22'); else A.judge('22-lab', 'meds', 1, `You lowered Mr. Haskins's pressure toward the reperfusion goal.`, `Under 185/110 before thrombolysis or thrombectomy, and under 180/105 for 24 hours after.`, '22'); return `Labetalol 10 mg IV over 2 minutes. Recheck in 10.`; },
      },
      {
        id: '22-tpa', name: 'Tenecteplase', dose: '0.25 mg/kg (max 25 mg), single IV bolus', route: 'IV', freq: 'Once (new order)', prn: true, available: (s, P) => P.tpaOrder && !P.tpaClarified,
        block: (s, P) => (P.tpaGiven !== null ? 'Started at ' + clock(P.tpaGiven) + '.' : null),
        checks: (s, P, A) => { const v = A.vitals('22'); return [{ label: 'Last known well', value: P.lkw ? '10:00 (found at 14:30)' : '14:30 per EMS', ok: P.lkw ? false : null }, { label: 'Window', value: P.lkw ? 'Closed at 14:30 (4.5 hours from 10:00)' : 'Open until 19:00 if onset is 14:30', ok: P.lkw ? false : null }, { label: 'Blood pressure', value: `${v.SBP}/${v.DBP}`, ok: v.SBP <= 185 && v.DBP <= 110 }, { label: 'CT', value: 'No hemorrhage', ok: true }, { label: 'Glucose', value: '142', ok: true }]; },
        doses: [{ id: 1, label: '20.5 mg (0.25 mg/kg) IV push over 5 seconds' }, { id: 2, label: '25 mg (the maximum)' }, { id: 3, label: '41 mg (0.5 mg/kg, the cardiac dose)' }],
        give(s, P, A, dose) {
          P.tpaGiven = s.t; const v = A.vitals('22'), late = s.t > 30;
          A.judge('22-tpa', 'meds', -3, `You gave tenecteplase to Mr. Haskins, more than 4.5 hours after he was last known well.`, `His wife last saw him normal at 10:00. "Found at 14:30" isn't onset. Outside the window the bleeding risk outweighs the benefit; a clot in a large artery goes to thrombectomy instead.${P.lkw ? ' You knew the real time.' : ' Asking her was the check.'}`, '22');
          if (dose !== 1) A.judge('22-tpa-dose', 'meds', -1, `You gave the wrong tenecteplase dose.`, `For stroke, 0.25 mg/kg to a maximum of 25 mg: 20.5 mg for 82 kg. The higher MI dose doesn't apply.`, '22');
          if (v.SBP > 185) A.judge('22-tpa-bp', 'meds', -2, `You gave tenecteplase with a pressure over 185.`, `Above 185/110, the risk of brain hemorrhage climbs. Lower it first.`, '22');
          P.ichAt = s.t + 45;
          return `Tenecteplase 20.5 mg IV push.`;
        },
      },
      { id: '22-asa', name: 'Aspirin', dose: '325 mg', route: 'PO', freq: 'Once (stroke order set)', prn: true, available: (s, P) => P.ir !== null || P.called !== null, checks: (s, P) => [{ label: 'Swallow screen', value: P.swallow ? 'Failed' : 'Not done', ok: false }, { label: 'Thrombolytic', value: P.tpaGiven !== null ? 'Given: no antiplatelets for 24 h' : 'Not given', ok: P.tpaGiven === null }], give(s, P, A) { P.water = true; A.judge('22-asa', 'meds', -2, `You gave Mr. Haskins an oral pill ${P.swallow ? 'after he failed' : 'without'} a swallow screen.`, `Nothing by mouth until he passes a swallow screen. Aspirin can go rectally, and not at all before thrombectomy unless the team says so.`, '22'); return `He coughs and sputters on the pill.`; } },
    ],
    talk: (s, P) => (P.gone ? null : 'walt_talk'),
    family: { name: 'Joan', rel: 'Wife', mode: 'bedside', cost: 3, avail: (s, P) => !P.gone || P.ir !== null, dialog: (s, P) => (P.lkw ? 'joan_after' : 'joan_talk') },
    sbar: {
      items(s, P, A) {
        const v = A.vitals('22');
        return [
          { id: 'lkw', label: 'Last known well 10:00 (wife); found at 14:30', key: true, need: P.lkw, lock: 'Ask his wife' },
          { id: 'found', label: 'Onset 14:30 per EMS', key: false, need: true },
          { id: 'nih', label: `NIHSS ${wNIH(P)}: right hemiparesis, expressive aphasia`, key: true, need: P.checks.length > 0, lock: 'Do his NIHSS' },
          { id: 'bp', label: `BP ${v.SBP}/${v.DBP}${P.lab !== null ? ', after labetalol' : ''}`, key: true, need: true },
          { id: 'ct', label: P.ctRead ? 'CT: no hemorrhage' : 'CT read pending', key: P.ctRead, need: true },
          { id: 'cta', label: 'CTA: left M1 occlusion', key: true, need: P.cta, lock: 'Pending' },
          { id: 'tpt', label: 'Plays trumpet at church', key: false, need: true },
        ];
      },
      requests: [
        { id: 'tx', label: 'His real last known well is 10:00, so he\'s outside the thrombolysis window. With a large-vessel occlusion, is he a thrombectomy candidate?' },
        { id: 'tpa', label: 'BP is under 185/110. Ready to give the tenecteplase?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (picked.includes('lkw')) {
          if (P.called === null) P.called = s.t;
          P.tpaClarified = true; A.retireMsgs('22', /tenecteplase|in the window/i); if (P.tpaGiven === null) A.dcOrder('22', /Tenecteplase/);
          if (P.ir === null && P.tpaGiven === null) { P.ir = s.t + 25; A.addOrder('22', `Cancel thrombolysis: last known well 10:00, outside the 4.5-hour window. CTA ${P.cta ? 'shows' : 'pending, likely'} left M1 occlusion: neurointerventional radiology activated for thrombectomy. BP at or under 185/110 for the procedure. Keep NPO.`); }
          A.judge('22-sbar', 'comm', req === 'tx' ? 2 : 1, `You told the team Mr. Haskins's true last known well.`, `The EMS time was when he was found. One question to his wife changed the treatment from thrombolysis, outside its window, to a thrombectomy, which works up to 24 hours out for a large clot.`, '22');
          return P.tpaGiven !== null ? `10:00? It's already in. I'm getting a stat CT and calling neurosurgery. Neuro checks every 15 minutes, and keep his pressure under 180/105.` : `Ten? Then no thrombolysis, thank you. Good thing you asked. He's got an M1 clot: I'm activating IR for thrombectomy. Keep his pressure under 185.`;
        }
        if (req === 'tpa') { if (P.tpaOrder) return `Yes, start it. Onset 14:30, we're well inside the window.`; return `CT's not read yet. Get me his NIHSS and pressure.`; }
        return `Okay. What's his last known well, exactly? EMS said 14:30.`;
      },
    },
    scene: (s, P) => ({ tele: true, iv: 'lock', tray: 'none', fallPrec: true, family: P.gone ? null : 'joan', familyLabel: 'Joan, his wife', empty: P.gone, emptyText: P.ich ? 'Stretcher empty. To the neuro ICU after a brain hemorrhage.' : 'Stretcher empty. To neurointerventional radiology for thrombectomy.' }),
    clues: (s, P) => ({ family: `Joan, in a church-choir sweatshirt, holding his trumpet case. "I didn't know what else to bring."`, monitor: `Sinus rhythm in the 80s. BP cycling every 15 minutes.` }),
    rig: (s, P) => ({ facial: P.ich ? .9 : .7, confused: true, alert: P.ich ? 2 : 0, sbp: wSBP(P), pain: P.ich ? 7 : 0, nausea: P.ich }),
    status: (s, P) => (P.gone ? 'gone' : 'urgent'),
    outcome(s, P) {
      if (P.ich) return { tone: 'bad', title: 'Brain hemorrhage after thrombolysis', text: `Tenecteplase went in at ${clock(P.tpaGiven)}, more than 4.5 hours after his wife last saw him normal. He bled into the stroke. ${P.lkw ? 'The real last known well was in his chart.' : 'Nobody asked her.'}` };
      if (P.ir !== null && P.gone) { const fast = P.called <= 45; return { tone: fast ? 'good' : 'mixed', title: fast ? 'Thrombectomy, not thrombolysis' : 'Thrombectomy, after a delay', text: `Last known well clarified as 10:00, thrombolysis cancelled, to IR at ${clock(P.ir)}. The M1 clot came out in one pass.${P.water ? ' He did aspirate a little water before his swallow screen.' : ''}` }; }
      return { tone: 'bad', title: 'Large-vessel stroke, no reperfusion', text: `His M1 clot was never treated: ${P.lkw ? 'the team never heard his real last known well' : 'nobody asked when he was last normal'}.` };
    },
  };

  /* ---------- 23 Alicia Moreno: positive hCG, "cramps," bleeding into her abdomen while she waits for ultrasound ---------- */
  const aHR = (P) => Math.round(96 + P.hemo * 40 - (P.fluid ? 8 : 0));
  const aSBP = (P) => Math.round(118 - Math.max(0, P.hemo - .45) * 62 + (P.fluid ? 8 : 0));
  const alicia = {
    id: '23', room: '23', name: 'Alicia Moreno', short: 'Ms. Moreno', age: 26, sex: 'F', mrn: '01844099',
    look: { skin: '#D2A07A', shade: '#B4825C', lip: '#9A5648', blush: '#D48A70', iris: '#2A1C12', head: { w: 54, h: 60, jaw: .25 }, eye: 10,
      hair: { style: 'long', color: '#2A1C14' }, brow: { w: 3.2, color: '#1E140E' }, body: { w: 78, cloth: 'gown' }, extras: ['hoops'], smile: .15,
      lines: { calm: `It's just bad cramps. Can I have some water?`, pain: `It's on the left. And my shoulder hurts, which is weird.`, anxious: `I feel really dizzy.`, dizzy: `The room's spinning when I sit up.`, drowsy: `I just want to lie down.`, none: `She doesn't respond.` } },
    bio: `Dental assistant. Lives with her boyfriend Derek. Her mom, Lucia, and two sisters live twenty minutes away.`,
    dx: `Lower abdominal pain, positive pregnancy test`, reason: `Left lower abdominal pain since this morning, "like bad cramps." Last period about 7 weeks ago. Urine hCG positive at 14:35. Pelvic ultrasound ordered; radiology backed up.`,
    hx: [`G1P0`, `Chlamydia treated two years ago`, `No surgeries`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `61 kg`,
    lines: [`PIV 22g right hand`], mobility: `Stretcher`, diet: `NPO`,
    init: { hemo: .16, called: null, or: null, ivs: false, fluid: false, morph: null, ortho: false, private: false, disclosed: false, response: null, derek: true, rupture: false, gone: false, hcgSeen: false },
    nightVitals: { T: 37.0, HR: 98, SBP: 116, DBP: 74, RR: 18, SpO2: 99, O2: 'Room air', pain: 6 },
    labs: [
      { name: 'Urine hCG', val: 'Positive', unit: '', ref: '', flag: 'A', t: -25 },
      { name: 'Serum quantitative hCG', val: 'Pending', unit: '', ref: '', flag: '', t: -20 },
      { name: 'Hemoglobin', val: 11.9, unit: 'g/dL', ref: '12.0–15.5', flag: 'L', t: -20 },
      { name: 'Blood type', val: 'O negative', unit: '', ref: '', flag: 'A', t: -20 },
    ],
    orders: [
      { t: -30, text: `Pelvic ultrasound (transvaginal). Serum hCG, CBC, type and screen. NPO. Morphine 4 mg IV every 3 hours as needed, severe pain. Ondansetron 4 mg IV as needed.` },
    ],
    notes: [
      { t: -40, author: 'Sid, triage RN', text: `26F LLQ pain since 09:00, "cramps," LMP ~7 weeks. hCG +. VS stable at triage. ESI 3. Boyfriend at bedside, answering most questions. Ultrasound backed up, ~2 h.` },
    ],
    io: { intake: `NPO`, output: `Voided for the urine test` },
    report: [
      { text: `Alicia Moreno, 26, left lower belly pain since this morning. Pregnancy test's positive. Last period about seven weeks ago.`, key: true },
      { text: `Ultrasound's backed up. Probably two hours.`, key: true },
      { text: `Her heart rate's high nineties. Pressure's fine.`, key: false },
      { text: `Her boyfriend answers every question for her. He won't leave the room.`, key: true },
      { text: `She keeps asking for water.`, key: false },
    ],
    vitals(s, P) { return { T: 37.0, HR: aHR(P) + jit(s, 5) * 2, SBP: aSBP(P) + jit(s, 6) * 2, DBP: Math.round(aSBP(P) * .62), RR: 18 + (P.hemo > .8 ? 4 : 0), SpO2: 99, O2: 'Room air', pain: Math.min(9, Math.round(6 + P.hemo * 3)) }; },
    assess: {
      general: (s, P) => (P.hemo > .9 ? `Pale, sweaty, eyes closed. Knees drawn up.` : P.hemo > .5 ? `Curled on her left side, pale. She winces when the stretcher moves.` : `Lying still, arms crossed over her belly. Derek is holding her phone.`),
      resp: () => `Clear. RR 18.`,
      cardiac: (s, P, A) => { const v = A.vitals('23'); P.k.card = s.t; return `HR ${v.HR}, regular. BP ${v.SBP}/${v.DBP}. ${P.hemo > .6 ? 'Cool hands, cap refill 3 seconds.' : 'Cap refill 2 seconds.'}`; },
      neuro: (s, P) => (P.hemo > .9 ? `Drowsy, slow to answer.` : `Alert, oriented. Quiet; looks at Derek before answering.`),
      pain: (s, P) => { P.k.pain = s.t; return `Left lower quadrant, sharp, ${Math.min(9, Math.round(6 + P.hemo * 3))}/10. ${P.hemo > .4 ? 'New pain at the tip of her shoulder, worse lying flat.' : 'No other pain.'}`; },
      skin: (s, P) => { P.k.skin = s.t; return `${P.hemo > .6 ? 'Pale, clammy.' : 'Warm.'} Faint, fingertip-sized bruises on both upper arms, yellow and purple.`; },
      gi: (s, P) => (P.hemo > .4 ? `Abdomen distended slightly, tender left lower quadrant with guarding and rebound. Light vaginal spotting.` : `Tender left lower quadrant, no rebound. Light vaginal spotting.`),
    },
    interventions: [
      { id: 'ivs', label: 'Second large-bore IV (18g), type and crossmatch', cost: 6, avail: (s, P) => !P.ivs, run(s, P, A) { P.ivs = true; A.judge('23-ivs', 'safety', P.hemo > .4 ? 2 : 1, `You placed a large-bore IV and sent a crossmatch for Ms. Moreno.`, `A 22-gauge in the hand won't run blood fast. With a possible ruptured ectopic, two large-bore lines and blood in the bank come before the diagnosis is certain.`, '23'); return `18g in the left antecubital. Type and crossmatch for 2 units sent.`; } },
      { id: 'reassess', label: 'Reassess her vital signs and abdomen after the bolus', cost: 2, avail: (s, P) => P.fluid && !P.reassessed && !P.gone, run(s, P, A) { P.reassessed = true; const v = A.recordVitals('23', 'You'); A.judge('23-reassess', 'judgment', 2, `You reassessed Ms. Moreno after the fluid bolus.`, `Fluid buys time; the trend tells the OR team how much. A heart rate that doesn't come down means she's still bleeding.`, '23'); return `HR ${v.HR}, BP ${v.SBP}/${v.DBP}. Abdomen still guarded. Shoulder pain unchanged.`; } },
      { id: 'private', label: 'Ask Derek to step out for the exam; talk with her alone', cost: 4, avail: (s, P) => !P.private, run(s, P, A) { P.private = true; P.derek = false; A.judge('23-private', 'assess', 2, `You made time to talk with Ms. Moreno alone.`, `Every patient gets asked about safety privately. A partner who answers for her and won't leave is a reason to make sure that happens.`, '23'); return `"I need to examine her; would you grab a coffee? Ten minutes." Derek hesitates, then goes. Alicia watches the curtain close.`; } },
    ],
    meds: [
      { id: '23-morph', name: 'Morphine', dose: '4 mg', route: 'IV', freq: 'Every 3 h as needed, severe pain', prn: true, checks: (s, P, A) => { const v = A.vitals('23'); return [{ label: 'Pain', value: P.k.pain !== undefined ? `${Math.min(9, Math.round(6 + P.hemo * 3))}/10` : 'Not assessed', ok: P.k.pain !== undefined ? null : false }, { label: 'Vitals', value: `HR ${v.HR}, BP ${v.SBP}/${v.DBP}`, ok: v.SBP >= 100 && v.HR <= 110 }]; }, give(s, P, A) { P.morph = s.t; if (P.hemo > .5 && P.called === null) A.judge('23-morph', 'judgment', -1, `You treated Ms. Moreno's pain while her heart rate climbed, without calling.`, `Pain relief is right. But shoulder pain, a rising heart rate and a positive hCG are a ruptured ectopic until proven otherwise, and morphine can drop a pressure that's barely holding.`, '23'); else A.judge('23-morph', 'meds', 1, `You treated Ms. Moreno's pain.`, `Analgesia doesn't hide a surgical abdomen; reassess her vitals after.`, '23'); return `Morphine 4 mg IV.`; } },
      { id: '23-ns', name: 'Normal saline bolus', dose: '1,000 mL', route: 'IV', freq: 'Once (new order)', prn: true, available: (s, P) => P.called !== null, block: (s, P) => (P.fluid ? 'Running.' : null), checks: () => [{ label: 'Access', value: 'Large-bore line', ok: true }], give(s, P, A) { P.fluid = true; A.judge('23-ns', 'meds', 1, `You started a fluid bolus for Ms. Moreno.`, `It buys time until the bleeding is stopped in the OR.`, '23'); return `1 L normal saline wide open.`; } },
      { id: '23-ond', name: 'Ondansetron', dose: '4 mg', route: 'IV', freq: 'As needed, nausea', prn: true, checks: () => [{ label: 'Pregnancy', value: 'Positive hCG', ok: null }], give: () => `Ondansetron 4 mg IV.` },
    ],
    talk: (s, P) => (P.gone ? null : P.private && !P.disclosed ? 'ali_private' : P.k.talked ? 'ali_after' : 'ali_talk'),
    family: { name: 'Derek', rel: 'Boyfriend', mode: 'bedside', cost: 2, avail: (s, P) => !P.gone && P.derek, dialog: () => 'derek_talk' },
    sbar: {
      items(s, P, A) {
        const v = A.vitals('23');
        return [
          { id: 'hcg', label: 'Positive hCG, LMP about 7 weeks', key: true, need: true },
          { id: 'shoulder', label: 'New shoulder-tip pain, worse lying flat', key: true, need: P.hemo > .4 && P.k.pain !== undefined, lock: 'Assess her pain' },
          { id: 'vs', label: `HR ${v.HR} (98 at 15:00), BP ${v.SBP}/${v.DBP}`, key: true, need: true },
          { id: 'abd', label: 'Guarding and rebound in the left lower quadrant', key: true, need: P.hemo > .4 },
          { id: 'rh', label: 'O negative', key: false, need: true },
          { id: 'safe', label: 'Disclosed her boyfriend grabbed her; bruises on both arms', key: false, need: P.disclosed, lock: 'Not discussed' },
          { id: 'chla', label: 'Prior chlamydia', key: false, need: true },
        ];
      },
      requests: [
        { id: 'ectopic', label: 'Positive hCG, shoulder pain and a climbing heart rate. I\'m worried about a ruptured ectopic. Can you do a bedside ultrasound and call GYN? I\'m getting a second large-bore IV and a crossmatch.' },
        { id: 'pain', label: 'She\'s still in pain waiting for ultrasound. Can she have more morphine?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'pain' && P.hemo > .4) { A.judge('23-sbar-pain', 'judgment', -1, `You called about Ms. Moreno's pain, not her vital signs.`, `The pain is changing because something is happening. Lead with what changed.`, '23'); return `Sure. What are her vitals doing? Any shoulder pain?`; }
        if (!picked.includes('shoulder') && !picked.includes('vs') && !picked.includes('abd')) return `Okay. Ultrasound will get to her. Tell me if anything changes.`;
        if (P.called === null) { P.called = s.t; P.calledHemo = P.hemo; P.or = s.t + 30; A.addOrder('23', `Bedside ultrasound: free fluid in the pelvis and Morison's pouch. GYN to the OR for laparoscopy, possible ruptured ectopic. Two large-bore IVs, type and crossmatch 2 units. NS 1 L bolus. Rh immune globulin before discharge (O negative). Consent.`); }
        A.judge('23-sbar', 'comm', picked.includes('shoulder') && picked.includes('vs') ? 2 : 1, `You called about a possible ruptured ectopic.`, `Kehr's sign (shoulder pain from blood under the diaphragm), a rising heart rate and a positive hCG. Young women hold their pressure until they don't; the heart rate tells you first.`, '23');
        return `On my way with the ultrasound. If there's free fluid she's going to the OR. Get the second line and the crossmatch.`;
      },
    },
    scene: (s, P) => ({ tele: true, iv: P.fluid ? 'running' : 'lock', tray: 'none', family: P.gone || !P.derek ? null : 'derek', familyLabel: 'Derek, her boyfriend', empty: P.gone, emptyText: P.rupture ? 'Stretcher empty. Rushed to the OR in hemorrhagic shock.' : 'Stretcher empty. To the OR with GYN.' }),
    clues: (s, P) => ({ family: `Derek, scrolling on her phone. He answers her texts for her.`, monitor: `Sinus ${aHR(P) > 100 ? 'tachycardia' : 'rhythm'} at ${aHR(P)}.` }),
    rig: (s, P) => ({ hr: aHR(P), sbp: aSBP(P), pain: Math.min(9, Math.round(6 + P.hemo * 3)), pale: clamp((P.hemo - .4) / .6, 0, 1), sweat: P.hemo > .8 ? .5 : 0, anxious: .3 }),
    status: (s, P) => (P.gone ? 'gone' : aHR(P) > 110 || aSBP(P) < 100 ? 'urgent' : 'watch'),
    outcome(s, P) {
      if (P.rupture) return { tone: 'bad', title: 'Ruptured ectopic, hemorrhagic shock', text: `BP ${aSBP(P)}, HR ${aHR(P)} at ${clock(P.goneAt)}. She went to the OR with 1.8 liters of blood in her abdomen and needed three units. The shoulder pain started around ${clock(Math.round((.4 - .16) / .005))}.` };
      const safe = P.private ? (P.response === 'good' ? ' She talked to a domestic violence advocate before surgery.' : '') : ' Nobody asked her about the bruises alone.';
      if (P.gone && P.called !== null) return { tone: P.calledHemo < .8 && P.ivs ? 'good' : 'mixed', title: P.calledHemo < .8 ? 'Ectopic caught before shock' : 'Ectopic, caught late', text: `Called at ${clock(P.called)}; laparoscopic salpingectomy, 600 mL in the pelvis, no transfusion.${safe}` };
      return { tone: 'bad', title: 'Still waiting for ultrasound', text: `HR ${aHR(P)}, BP ${aSBP(P)} at handoff, shoulder pain, guarding. A ruptured ectopic waiting in line for a scan.${safe}` };
    },
  };

  /* ---------- 24 Kenji Watanabe (arrives 16:10): anaphylaxis; EMS gave diphenhydramine, not epinephrine ---------- */
  const kHR = (P) => Math.round(84 + P.sev * 46 + (P.ivEpi ? 50 : 0) + (P.epi.length ? 6 : 0));
  const kSBP = (P) => Math.round(124 - P.sev * 42 + (P.fluid ? 10 : 0) + (P.ivEpi ? 70 : 0));
  const kenji = {
    id: '24', room: '24', name: 'Kenji Watanabe', short: 'Mr. Watanabe', age: 19, sex: 'M', mrn: '01844261', arrives: 70, arriveAs: 'Arrival', from: 'EMS', arrivedText: '24 Kenji Watanabe is in the bay from EMS: allergic reaction.',
    look: { skin: '#EBC6A2', shade: '#CFA582', lip: '#B86A5E', blush: '#E8907A', iris: '#1E140C', head: { w: 56, h: 62, jaw: .5 }, eye: 9.6,
      hair: { style: 'swoop', color: '#140E0A' }, brow: { w: 3.8, color: '#140E0A' }, body: { w: 84, cloth: 'hoodie' }, extras: [], smile: .2,
      lines: { calm: `I feel fine now. Can I go? I have a lab report due.`, dys: `My throat's — tight. Can't swallow.`, anxious: `I can't breathe right. Am I dying?`, drowsy: `I feel like I'm going to pass out.`, none: `He doesn't respond.` } },
    bio: `College sophomore, chemistry major. Allergic to peanuts since he was four. His EpiPen expired in March and he hadn't replaced it.`,
    dx: `Anaphylaxis, peanut`, reason: `Ate pad thai at 15:50 that turned out to have peanut sauce. Hives, lip swelling, throat tightness, wheeze. EMS gave diphenhydramine 50 mg IV and albuterol.`,
    hx: [`Peanut allergy, anaphylaxis at age 9`, `Mild asthma`, `EpiPen expired`],
    allergies: `Peanuts (anaphylaxis)`, code: `Full code`, weight: `68 kg`,
    lines: [`PIV 18g left antecubital (EMS)`], mobility: `Stretcher`, diet: `NPO`,
    init: { sev: 1, epi: [], ivEpi: false, flat: false, fluid: false, adj: [], airway: false, icu: false, gone: false, teach: false, obs: null, leaveAt: null },
    labs: [],
    orders: [{ t: 60, text: `Anaphylaxis protocol: epinephrine 0.01 mg/kg IM (max 0.5 mg) of 1 mg/mL in the anterolateral thigh; repeat every 5 to 15 minutes as needed. Supine with legs elevated if hypotensive. High-flow oxygen. NS 1 L bolus. Then diphenhydramine, famotidine, methylprednisolone; albuterol for persistent wheeze. Observe at least 4–6 hours; longer after more than one dose of epinephrine.` }],
    notes: [{ t: 66, author: 'EMS', text: `19M, peanut exposure 15:50. Hives, lip/tongue swelling, wheeze. Diphenhydramine 50 mg IV, albuterol neb en route. No epinephrine given (ran out of time). BP 88/52, HR 126, SpO₂ 92%.` }],
    io: { intake: `—`, output: `—` },
    report: [],
    vitals(s, P) { return { T: 36.9, HR: kHR(P) + jit(s, 7) * 2, SBP: kSBP(P) + jit(s, 8) * 2, DBP: Math.round(kSBP(P) * .6), RR: Math.round(18 + P.sev * 10), SpO2: Math.round(99 - P.sev * 7), O2: P.flat ? 'Non-rebreather 15 L' : 'Room air', pain: 0 }; },
    assess: {
      general: (s, P) => (P.sev > 1.2 ? `Sitting bolt upright, drooling, can't speak. Stridor.` : P.sev > .6 ? `Hives everywhere, lips swollen, hoarse. Scratching and frightened.` : P.sev > .25 ? `Hives fading. Voice normal. Still a little wheezy.` : `Hives gone. Joking with you about the pad thai.`),
      resp: (s, P) => { P.k.resp = s.t; return P.sev > 1.1 ? `Stridor at rest. Wheeze throughout. SpO₂ ${Math.round(99 - P.sev * 7)}%.` : P.sev > .6 ? `Hoarse voice. Expiratory wheeze throughout. No stridor yet.` : P.sev > .25 ? `Faint end-expiratory wheeze.` : `Clear.`; },
      cardiac: (s, P, A) => { const v = A.vitals('24'); return `HR ${v.HR}. BP ${v.SBP}/${v.DBP}.${P.ivEpi ? ' Runs of ventricular ectopy; he says his chest hurts.' : ''}`; },
      neuro: (s, P) => (P.sev > 1 ? `Anxious, restless. "I'm going to die."` : `Alert, oriented.`),
      pain: (s, P) => (P.ivEpi ? `Crushing chest pain, 7/10, started right after the IV dose.` : `Throat tight, itchy everywhere.`),
      skin: (s, P) => (P.sev > .25 ? `Raised hives over his chest, back and arms. Lips and tongue swollen.` : `Fading blotches on his chest.`),
      gi: (s, P) => (P.sev > .6 ? `Crampy belly pain. Vomited once.` : `Soft.`),
    },
    interventions: [
      { id: 'flat', label: 'Lay him flat, legs raised; oxygen by non-rebreather', cost: 1, avail: (s, P) => !P.flat, run(s, P, A) { P.flat = true; A.judge('24-flat', 'safety', 1, `You positioned Mr. Watanabe for shock and gave oxygen.`, `In anaphylaxis with low pressure, sitting up suddenly can empty the heart. Flat with legs up, unless he can't breathe that way.`, '24'); return `Flat, legs raised on two pillows, 15 L non-rebreather.`; } },
      { id: 'reassess', label: 'Reassess airway, breathing and BP after epinephrine', cost: 2, avail: (s, P) => P.epi.length > 0 && s.t - P.epi[P.epi.length - 1] >= 5 && P.reassessedFor !== P.epi.length, run(s, P, A) { P.reassessedFor = P.epi.length; const v = A.recordVitals('24', 'You'); A.judge('24-reassess', 'judgment', 2, `You reassessed Mr. Watanabe after epinephrine.`, `Five to fifteen minutes after a dose: still swollen, wheezy or hypotensive means the next dose, now.`, '24'); return `BP ${v.SBP}/${v.DBP}, HR ${v.HR}, SpO₂ ${v.SpO2}%. ${P.sev > .3 ? 'Still wheezy, lips still swollen: needs another dose.' : 'Voice clear, hives fading.'}`; } },
      { id: 'ecg', label: '12-lead ECG after the IV epinephrine', cost: 3, avail: (s, P) => P.ivEpi && !P.ecg && !P.gone, run(s, P, A) { P.ecg = true; A.judge('24-ecg', 'assess', 1, `You got an ECG after Mr. Watanabe's IV epinephrine.`, `IV epinephrine given at the IM dose can cause ischemia and arrhythmias. The ECG and troponin show whether his heart took a hit.`, '24'); return `Sinus tachycardia 148 with frequent PVCs. 1 mm ST depression in V4 to V6. Troponin sent.`; } },
      { id: 'airway', label: 'Assess his airway: voice, stridor, swallowing', cost: 1, run(s, P) { P.k.resp = s.t; return P.sev > 1.1 ? `Stridor, drooling, can't swallow. Airway closing.` : P.sev > .6 ? `Hoarse, swallowing with effort. No stridor yet.` : `Normal voice, swallowing fine.`; } },
    ],
    meds: [
      {
        id: '24-epi', name: 'Epinephrine', dose: '0.01 mg/kg, max 0.5 mg', route: 'IM', freq: 'Every 5–15 min as needed', prn: true,
        checks: (s, P, A) => { const v = A.vitals('24'); return [{ label: 'Airway', value: P.sev > .6 ? 'Lip and tongue swelling, hoarse' : 'Improving', ok: P.sev > .6 }, { label: 'BP', value: `${v.SBP}/${v.DBP}`, ok: null }, { label: 'Weight', value: '68 kg', ok: null }, { label: 'Doses so far', value: P.epi.length ? P.epi.map(clock).join(', ') : 'None (EMS gave diphenhydramine only)', ok: null }]; },
        doses: [{ id: 1, label: '0.5 mg (0.5 mL of 1 mg/mL) IM, anterolateral thigh' }, { id: 2, label: '0.5 mg (0.5 mL of 1 mg/mL) IV push' }, { id: 3, label: '0.3 mg subcutaneous, upper arm' }],
        give(s, P, A, dose) {
          const first = !P.epi.length; P.epi.push(s.t);
          if (dose === 2) { P.ivEpi = true; P.ivEpiEver = true; P.ivEpiAt = s.t; P.sev = Math.max(0, P.sev - .5); A.judge('24-epi-iv', 'meds', -3, `You pushed 1 mg/mL epinephrine IV.`, `Undiluted IV epinephrine causes arrhythmias, severe hypertension and MI. The first dose is IM into the thigh; IV epinephrine is a dilute infusion run by a provider for refractory shock.`, '24'); return `Epinephrine 0.5 mg IV push. Seconds later: HR 182, BP 210/118, "my chest!"`; }
          P.sev = Math.max(0, P.sev - (dose === 1 ? .55 : .3));
          if (first) { const mins = s.t - 70; A.judge('24-epi', 'meds', dose === 1 ? (mins <= 5 ? 2 : 1) : 0, dose === 1 ? `You gave Mr. Watanabe IM epinephrine ${mins <= 5 ? 'right away' : mins + ' minutes after he arrived'}.` : `You gave epinephrine subcutaneously.`, dose === 1 ? `Epinephrine is the only drug that reverses airway swelling and shock in anaphylaxis. Antihistamines and steroids don't. IM in the thigh absorbs fastest.` : `Subcutaneous and arm injections absorb slowly. IM, anterolateral thigh.`, '24'); }
          else A.judge('24-epi2', 'meds', P.sev > .3 || s.t - P.epi[0] >= 5 ? 1 : 0, `You repeated Mr. Watanabe's epinephrine.`, `Symptoms persisting 5 to 15 minutes after the first dose: give the second. Don't wait for the airway to close again.`, '24');
          return `Epinephrine 0.5 mg IM, right anterolateral thigh. ${P.sev < .3 ? 'His voice clears.' : 'Hives fade a little; still wheezy.'}`;
        },
      },
      { id: '24-ns', name: 'Normal saline bolus', dose: '1,000 mL', route: 'IV', freq: 'Once', prn: true, block: (s, P) => (P.fluid ? 'Running.' : null), checks: (s, P, A) => [{ label: 'BP', value: `${A.vitals('24').SBP}`, ok: A.vitals('24').SBP < 100 }], give(s, P, A) { P.fluid = true; A.judge('24-ns', 'meds', 1, `You gave Mr. Watanabe a fluid bolus.`, `Anaphylaxis leaks fluid out of the vessels; a liter wide open supports the pressure while epinephrine works.`, '24'); return `1 L normal saline wide open.`; } },
      { id: '24-adj', name: 'Methylprednisolone and famotidine', dose: '125 mg / 20 mg', route: 'IV', freq: 'Once (adjuncts)', prn: true, block: (s, P) => (P.adj.length ? 'Given.' : null), checks: (s, P) => [{ label: 'Epinephrine given', value: P.epi.length ? 'Yes' : 'Not yet', ok: P.epi.length > 0 }], give(s, P, A) { P.adj.push(s.t); A.judge('24-adj', 'meds', P.epi.length ? 0 : -2, P.epi.length ? `You gave the adjuncts after epinephrine.` : `You gave steroids and an H2 blocker before epinephrine.`, P.epi.length ? `Fine as add-ons. They don't treat the airway or the shock, and steroids don't prevent a second reaction.` : `They take hours to work and don't open an airway. Epinephrine first, always.`, '24'); return `Methylprednisolone 125 mg and famotidine 20 mg IV.`; } },
      { id: '24-alb', name: 'Albuterol', dose: '2.5 mg', route: 'Neb', freq: 'As needed, wheeze', prn: true, checks: (s, P) => [{ label: 'Wheeze', value: P.sev > .25 ? 'Yes' : 'No', ok: P.sev > .25 }], give: () => `Albuterol 2.5 mg nebulized.` },
    ],
    talk: (s, P) => (P.gone ? null : P.sev > .6 ? 'ken_sob' : P.leaveAt !== null && !P.k.leave ? 'ken_leave' : P.k.talked ? 'ken_after' : 'ken_talk'),
    sbar: {
      items(s, P, A) {
        const v = A.vitals('24');
        return [
          { id: 'airway', label: P.sev > 1.1 ? 'Stridor and drooling' : P.sev > .6 ? 'Lip and tongue swelling, hoarse voice' : 'Airway improving', key: P.sev > .6, need: true },
          { id: 'vs', label: `BP ${v.SBP}/${v.DBP}, HR ${v.HR}, SpO₂ ${v.SpO2}%`, key: true, need: true },
          { id: 'epi', label: P.epi.length ? `Epinephrine IM ×${P.epi.length}` : 'No epinephrine yet (EMS gave diphenhydramine)', key: true, need: true },
          { id: 'ivepi', label: 'Got 1 mg/mL epinephrine IV push: chest pain, ectopy', key: true, need: P.ivEpi, lock: 'n/a' },
          { id: 'chem', label: 'Chemistry major', key: false, need: true },
        ];
      },
      requests: [
        { id: 'airway', label: 'Anaphylaxis with airway swelling after IM epinephrine. Can you come now, and should we get anesthesia for the airway?' },
        { id: 'obs', label: 'He\'s better after epinephrine. Plan to observe at least 4 to 6 hours, an epinephrine autoinjector prescription and allergy follow-up?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        P.called = P.called || s.t;
        if (P.ivEpi && !P.ivCalled) { P.ivCalled = true; A.judge('24-sbar-iv', 'comm', 1, `You reported the IV epinephrine error right away.`, `Errors reported immediately can be treated; hidden ones can't.`, '24'); return `I'm coming. Twelve-lead and a troponin. Let's see what his heart does.`; }
        if (req === 'obs' && P.sev <= .3) { P.obs = s.t; A.judge('24-sbar', 'comm', 1, `You planned Mr. Watanabe's observation and discharge teaching.`, `Biphasic reactions can come hours later. Observation, an autoinjector in hand and allergy follow-up are the discharge plan.`, '24'); return `Agreed. Six hours since he needed two doses. Teach him the autoinjector before he leaves.`; }
        if (!P.epi.length) return `Has he had epinephrine? IM, 0.5, in the thigh, now. I'm coming.`;
        return `I'm on my way. Repeat the epi if he's not better in five minutes.`;
      },
    },
    scene: (s, P) => ({ tele: true, iv: P.fluid ? 'running' : 'lock', o2: P.flat ? 10 : 0, tray: 'none', empty: P.gone, emptyText: 'Stretcher empty. Intubated and moved to the ICU.' }),
    clues: () => ({ monitor: `Sinus tachycardia.` }),
    rig: (s, P) => ({ rr: Math.round(18 + P.sev * 10), spo2: Math.round(99 - P.sev * 7), hr: kHR(P), sbp: kSBP(P), anxious: P.sev > .5 ? .7 : 0, sweat: P.sev > .8 ? .5 : 0 }),
    status: (s, P) => (P.gone ? 'gone' : P.sev > .5 || P.ivEpi ? 'urgent' : 'watch'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Airway lost, intubated', text: `No epinephrine ${P.epi.length ? 'until ' + clock(P.epi[0]) : 'given'}; his airway closed at ${clock(P.goneAt)}. Anesthesia intubated him through a swollen larynx.` };
      if (!P.arrived) return { tone: 'mixed', title: 'Not yet arrived', text: '' };
      if (P.ivEpiEver) return { tone: 'bad', title: 'Epinephrine given IV push', text: `Anaphylaxis reversed, but undiluted IV epinephrine caused chest pain and ventricular ectopy. He stayed overnight on a monitor with a troponin of 210.` };
      const fast = P.epi.length && P.epi[0] - 70 <= 10;
      if (P.sev <= .3 && fast && P.teach) return { tone: 'good', title: 'Anaphylaxis reversed, safe plan', text: `IM epinephrine ${P.epi.length > 1 ? 'twice' : 'once'}, fluids, observed. He leaves tonight with a new autoinjector and knows how to use it.` };
      if (P.sev <= .3) return { tone: 'mixed', title: fast ? 'Reversed; discharge plan unfinished' : 'Reversed, after a delay', text: `${fast ? '' : `First epinephrine at ${P.epi.length ? clock(P.epi[0]) : 'never'}. `}${P.teach ? '' : 'Nobody taught him the autoinjector or why he needed to stay.'}` };
      return { tone: 'bad', title: 'Still reacting at handoff', text: `Hives and wheeze at 20:00. ${P.epi.length < 2 ? 'The second dose of epinephrine was never given.' : ''}` };
    },
  };

  /* ---------- 25 Harold Jensen (arrives 17:30): fall on warfarin; a slow subdural behind a GCS of 15 ---------- */
  const gcs = (P) => (P.bleed < .4 ? 15 : P.bleed < .6 ? 14 : P.bleed < .8 ? 13 : P.bleed < 1 ? 11 : 7);
  const harold = {
    id: '25', room: '25', name: 'Harold Jensen', short: 'Mr. Jensen', age: 81, sex: 'M', mrn: '01844318', arrives: 150, arriveAs: 'Arrival', from: 'triage', arrivedText: '25 Harold Jensen is in the bay from triage: fall, head strike, on warfarin.',
    look: { skin: '#EECFB6', shade: '#D2AE96', lip: '#B0675F', blush: '#E59A8A', iris: '#5A7A9A', head: { w: 56, h: 63, jaw: .55 }, eye: 9, hair: { style: 'balding', color: '#E6E2DE' }, brow: { w: 4, color: '#D6D0CA' }, body: { w: 80, cloth: 'flannel' }, extras: ['glasses', 'wrinkles'], glasses: '#3A3A3E', smile: .35,
      lines: { calm: `It's just a bump. I've had worse in the Navy.`, pain: `My head's really pounding now.`, confused: `Where's Karen? What day is it?`, nausea: `I think I'm going to be sick.`, drowsy: `Let me sleep a bit.`, none: `He doesn't respond.` } },
    bio: `Retired Navy machinist, 81. Widowed, lives alone with an old shepherd mix named Duke. His daughter Karen checks on him daily.`,
    dx: `Fall with head strike, on warfarin`, reason: `Tripped on the back steps at 16:45, hit the back of his head. No loss of consciousness. On warfarin for atrial fibrillation. Triaged ESI 2.`,
    hx: [`Atrial fibrillation on warfarin (INR goal 2–3)`, `Hypertension`, `Mild hearing loss`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `78 kg`,
    lines: [`PIV 20g left forearm`], mobility: `Stretcher, fall precautions`, diet: `NPO until CT read`,
    init: { bleed: .12, checks: [], ctSeen: false, inrSeen: false, called: null, pcc: null, vitk: null, warf: null, ond: false, home: false, ns: null, gone: false, herniate: false, declinedAt: null },
    labs: [],
    orders: [{ t: 140, text: `CT head without contrast, stat. PT/INR, CBC. Neuro checks every 30 minutes. NPO. Home meds: warfarin 5 mg PO at 18:00 (verify INR). Acetaminophen 650 mg PO as needed, headache. Ondansetron 4 mg IV as needed.` }],
    notes: [{ t: 146, author: 'Sid, triage RN', text: `81M tripped on steps 16:45, occipital hematoma, no LOC. GCS 15. On warfarin. ESI 2. Daughter Karen with him; wants to take him home if the CT's fine.` }],
    io: { intake: `NPO`, output: `—` },
    report: [],
    vitals(s, P) { return { T: 36.6, HR: 76 - (P.bleed >= 1 ? 20 : 0) + jit(s, 9), SBP: 148 + (P.bleed >= .8 ? 30 : 0) + jit(s, 10) * 2, DBP: 84, RR: P.bleed >= 1 ? 10 : 16, SpO2: 96, O2: 'Room air', pain: P.bleed >= .4 ? 6 : 2 }; },
    assess: {
      general: (s, P) => (P.bleed >= 1 ? `Snoring respirations. Doesn't wake to his name.` : P.bleed >= .6 ? `Drowsy, vomited once, holding his head.` : P.bleed >= .4 ? `Rubbing his head, repeating questions.` : `Sitting up, joking with Karen, a lump on the back of his head.`),
      resp: (s, P) => (P.bleed >= 1 ? `Irregular, slow breathing.` : `Unlabored. Clear.`),
      cardiac: (s, P, A) => { const v = A.vitals('25'); return `HR ${v.HR}, irregularly irregular (AF). BP ${v.SBP}/${v.DBP}.`; },
      neuro: (s, P, A) => { P.checks.push(s.t); P.k.neuro = s.t; if (gcs(P) < 15 && P.declinedAt === null) { P.declinedAt = s.t; A.judge('25-decline', 'assess', 2, `You caught Mr. Jensen's neurological decline on a neuro check.`, `In an anticoagulated head injury, a fall of even one GCS point, a new headache or vomiting is the bleed growing. The check is how you see it.`, '25'); } else if (P.checks.length === 1) A.judge('25-neuro', 'assess', 1, `You did Mr. Jensen's baseline neuro check.`, `The baseline is what later checks are measured against.`, '25'); return `GCS ${gcs(P)} (${gcs(P) === 15 ? 'E4 V5 M6' : gcs(P) === 14 ? 'E4 V4 M6: confused' : gcs(P) === 13 ? 'E3 V4 M6' : gcs(P) === 11 ? 'E3 V3 M5' : 'E1 V2 M4'}). Pupils ${P.bleed >= .8 ? 'left 5 mm sluggish, right 3 mm brisk' : 'equal and reactive, 3 mm'}. ${P.bleed >= .4 ? 'Headache 6/10, worse.' : 'Mild headache 2/10.'} Moves all limbs${P.bleed >= .8 ? ', right side weaker' : ''}.`; },
      pain: (s, P) => (P.bleed >= .4 ? `Headache 6/10, worse than when he came in.` : `Sore spot on the back of his head, 2/10.`),
      skin: () => `4 cm occipital hematoma, no laceration. Skin tears on both forearms.`,
      gi: (s, P) => (P.bleed >= .55 ? `Vomited once, no warning.` : `Soft. No nausea.`),
    },
    interventions: [
      { id: 'hob', label: 'Head of bed to 30 degrees, head midline', cost: 1, avail: (s, P) => P.called !== null && !P.hob && !P.gone, run(s, P, A) { P.hob = true; A.judge('25-hob', 'judgment', 1, `You raised Mr. Jensen's head of bed to 30 degrees.`, `Head up and midline helps venous drainage from the brain and lowers intracranial pressure while the bleed is reversed.`, '25'); return `Head of bed up to 30, pillow out from behind his neck so his head stays midline. Karen tucks the blanket back around him.`; } },
      { id: 'gcs', label: 'Neuro check: GCS, pupils, strength', cost: 2, run(s, P, A) { if (P.pcc !== null && s.t - P.pcc >= 15) A.judge('25-recheck', 'judgment', 2, `You rechecked Mr. Jensen's neuro status after reversal.`, `After reversal, the checks go to every 15 minutes: a stable GCS means the bleed has stopped growing.`, '25'); return harold.assess.neuro(s, P, A); } },
    ],
    meds: [
      { id: '25-warf', name: 'Warfarin', dose: '5 mg', route: 'PO', freq: 'Daily, 18:00 (home)', due: 180, checks: (s, P) => [{ label: 'INR', value: P.inrSeen ? '3.6' : 'Pending', ok: false }, { label: 'Head injury', value: 'Fall with head strike today', ok: false }], give(s, P, A) { P.warf = 'given'; A.judge('25-warf', 'meds', -3, `You gave Mr. Jensen warfarin after a head injury.`, `Anticoagulation after a head strike is held until the CT is read and the team decides. With an INR of 3.6, it's reversed, not continued.`, '25'); return `Warfarin 5 mg.`; }, hold(s, P, A) { P.warf = 'held'; A.judge('25-warf-hold', 'meds', 1, `You held Mr. Jensen's warfarin.`, `Head strike on an anticoagulant: hold, and tell the provider.`, '25'); return 'Held: head injury, INR pending.'; } },
      { id: '25-pcc', name: '4-factor prothrombin complex concentrate', dose: '25 units/kg (1,950 units)', route: 'IV', freq: 'Once (new order)', prn: true, available: (s, P) => P.called !== null, block: (s, P) => (P.pcc !== null ? 'Given at ' + clock(P.pcc) + '.' : null), checks: () => [{ label: 'INR', value: '3.6', ok: false }, { label: 'Weight', value: '78 kg', ok: null }], give(s, P, A) { P.pcc = s.t; A.judge('25-pcc', 'meds', 2, `You gave Mr. Jensen 4-factor PCC.`, `It replaces the clotting factors warfarin blocks and corrects the INR in minutes. Fresh frozen plasma is slower and a lot of volume.`, '25'); return `4F-PCC 1,950 units IV over 10 minutes.`; } },
      { id: '25-vitk', name: 'Vitamin K (phytonadione)', dose: '10 mg', route: 'IV', freq: 'Once (new order)', prn: true, available: (s, P) => P.called !== null, block: (s, P) => (P.vitk !== null ? 'Given.' : null), checks: () => [{ label: 'INR', value: '3.6', ok: false }],
        doses: [{ id: 1, label: '10 mg IV, diluted, over at least 20 minutes' }, { id: 2, label: '10 mg IM' }, { id: 3, label: '10 mg IV push' }],
        give(s, P, A, dose) { P.vitk = dose; A.judge('25-vitk', 'meds', dose === 1 ? 1 : -1, dose === 1 ? `You gave vitamin K IV slowly.` : `You gave vitamin K by the wrong route.`, `PCC works in minutes but wears off; vitamin K keeps the INR corrected. Give it IV, slowly: a fast push can cause anaphylactoid reactions, and IM in an anticoagulated patient causes a hematoma and absorbs unpredictably.`, '25'); return `Vitamin K 10 mg ${['', 'IV in 50 mL over 20 minutes', 'IM, deltoid', 'IV push'][dose]}.`; } },
      { id: '25-ond', name: 'Ondansetron', dose: '4 mg', route: 'IV', freq: 'As needed, nausea', prn: true, checks: (s, P) => [{ label: 'Last neuro check', value: P.checks.length ? clock(P.checks[P.checks.length - 1]) : 'None', ok: P.checks.length && s.t - P.checks[P.checks.length - 1] <= 15 }], give(s, P, A) { P.ond = true; if (P.bleed >= .55 && !(P.checks.length && s.t - P.checks[P.checks.length - 1] <= 15)) A.judge('25-ond', 'judgment', -2, `You treated Mr. Jensen's vomiting without checking his neuro status.`, `New vomiting after a head injury is a sign of rising pressure in the skull. Do a neuro check and call; the antiemetic comes after.`, '25'); return `Ondansetron 4 mg IV.`; } },
      { id: '25-apap', name: 'Acetaminophen', dose: '650 mg', route: 'PO', freq: 'As needed, headache', prn: true, checks: (s, P) => [{ label: 'Diet', value: 'NPO until CT read', ok: P.ctSeen }], give: () => `Acetaminophen 650 mg.` },
    ],
    talk: (s, P) => (P.gone ? null : P.bleed >= .8 ? 'har_out' : P.k.talked ? 'har_after' : 'har_talk'),
    family: { name: 'Karen', rel: 'Daughter', mode: 'bedside', cost: 3, avail: (s, P) => !P.gone, dialog: (s, P) => (P.k.karen ? 'karen_after' : 'karen_talk') },
    sbar: {
      items(s, P) {
        return [
          { id: 'ct', label: 'CT: acute left subdural, 8 mm', key: true, need: P.ctSeen, lock: 'Pending' },
          { id: 'inr', label: 'INR 3.6 on warfarin', key: true, need: P.inrSeen, lock: 'Pending' },
          { id: 'gcs', label: `GCS ${gcs(P)}, down from 15; headache worse${P.bleed >= .55 ? ', vomiting' : ''}`, key: true, need: P.declinedAt !== null, lock: 'Recheck his neuro status' },
          { id: 'pupil', label: 'Left pupil 5 mm, sluggish', key: true, need: P.bleed >= .8 && P.k.neuro !== undefined && s.t - P.k.neuro < 20, lock: 'n/a' },
          { id: 'warf', label: P.warf === 'held' ? 'Warfarin held tonight' : 'Warfarin due at 18:00', key: false, need: true },
          { id: 'navy', label: 'Retired Navy machinist', key: false, need: true },
        ];
      },
      requests: [
        { id: 'rev', label: 'Subdural on warfarin, INR 3.6, and he\'s declining. Can we reverse with 4-factor PCC and vitamin K, and get neurosurgery?' },
        { id: 'home', label: 'He looks okay. His daughter wants to take him home. Can he go?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'home') { A.judge('25-sbar-home', 'judgment', -2, `You asked to send Mr. Jensen home.`, `An anticoagulated head injury stays until the CT and INR are back and the team is sure. Delayed bleeds are the whole reason for the caution.`, '25'); return P.ctSeen ? `Home? He has a subdural. No.` : `Not before the CT and INR. Keep doing his neuro checks.`; }
        if (!picked.includes('ct') && !picked.includes('gcs')) return `Okay. Call me with the CT and his neuro checks.`;
        if (P.called === null) { P.called = s.t; A.addOrder('25', `Acute subdural on warfarin: 4-factor PCC 25 units/kg IV now. Vitamin K 10 mg IV slowly. Hold warfarin. Neurosurgery consult. Neuro checks every 15 minutes. Repeat CT in 6 hours or with any decline. Head of bed 30 degrees.`); }
        A.judge('25-sbar', 'comm', picked.includes('gcs') && picked.includes('inr') ? 2 : 1, `You called about Mr. Jensen's subdural.`, `Anticoagulation reversal is time-critical: every hour the INR stays high, the bleed can grow.`, '25');
        return `Reverse him now: PCC and IV vitamin K. Neurosurgery's coming. Every-15-minute neuro checks; call me with any change.`;
      },
    },
    scene: (s, P) => ({ tele: true, iv: P.pcc !== null && s.t - P.pcc < 15 ? 'running' : 'lock', fallPrec: true, tray: 'none', family: P.gone ? null : 'karen', familyLabel: 'Karen, his daughter', empty: P.gone, emptyText: 'Stretcher empty. To the OR with neurosurgery.' }),
    clues: () => ({ family: `Karen, still in her work lanyard, his pill organizer in her hand. Wednesday's slot is empty.`, alarm: `Bed alarm on, rails up.` }),
    rig: (s, P) => ({ confused: P.bleed >= .4 && P.bleed < 1, alert: P.bleed >= 1 ? 2 : P.bleed >= .6 ? 1 : 0, pain: P.bleed >= .4 ? 6 : 2, nausea: P.bleed >= .55 && P.bleed < 1 }),
    status: (s, P) => (P.gone ? 'gone' : gcs(P) < 15 ? 'urgent' : 'watch'),
    outcome(s, P) {
      if (!P.arrived) return { tone: 'mixed', title: 'Not yet arrived', text: '' };
      if (P.herniate) return { tone: 'bad', title: 'Subdural expanded, emergency craniotomy', text: `GCS ${gcs(P)} with a blown left pupil at ${clock(P.goneAt)}. ${P.called === null ? 'His warfarin was never reversed.' : 'Reversal came too late.'}${P.warf === 'given' ? ' He got his warfarin at 18:00.' : ''}` };
      if (P.pcc !== null && P.declinedAt !== null && P.pcc - P.declinedAt <= 40) return { tone: 'good', title: 'Decline caught, warfarin reversed', text: `GCS dropped at ${clock(P.declinedAt)}, PCC in at ${clock(P.pcc)}. Repeat CT stable; neurosurgery is watching, no surgery tonight.` };
      if (P.pcc !== null) return { tone: 'mixed', title: 'Reversed, but late', text: `PCC at ${clock(P.pcc)}. ${P.declinedAt === null ? 'The decline was never documented on a neuro check.' : ''}` };
      return { tone: 'bad', title: 'Subdural on warfarin, not reversed', text: `INR 3.6, a growing subdural, GCS ${gcs(P)} at handoff.` };
    },
  };

  /* ---------- dialogs ---------- */
  const dialogs = {
    ros_talk: { who: '21', text: `"I feel silly being here for heartburn. Bev made me come." She rubs below her breastbone. "It's not like the movies. No elephant on my chest."`, choices: [
      { label: `Women and people with diabetes often don't get the classic chest pain. Pressure, nausea and feeling wiped out can be the heart. Tell me right away if it changes or spreads.`, next: 'ros_a', fx: (s, A) => { s.p['21'].k.talked = s.t; A.judge('21-talk', 'comm', 1, `You taught Ms. Hughes what to report.`, `Atypical presentations are typical in women, older adults and people with diabetes. She's your best early warning.`, '21'); } },
      { label: `It's probably just heartburn, but we're being careful.`, next: 'ros_b', fx: (s, A) => { s.p['21'].k.talked = s.t; A.judge('21-talk', 'judgment', -1, `You called Ms. Hughes's symptoms probably heartburn.`, `Anchoring on "indigestion" is how atypical MIs get missed, by her and by you.`, '21'); } },
    ] },
    ros_a: { who: '21', text: `"Spreads. Okay." She looks at Bev. "See? I'm not being dramatic."` },
    ros_b: { who: '21', text: `"That's what I told Bev." She leans back and closes her eyes.` },
    ros_jaw: { who: '21', text: `"It's worse. It's in my jaw now, and my left arm's heavy." She's gray and sweating. "I'm going to be sick."`, choices: [
      { label: `I'm getting an ECG right now and the doctor in here.`, next: null, fx: (s, A) => { s.p['21'].k.talkJaw = s.t; A.judge('21-jaw', 'assess', 1, `You acted on Ms. Hughes's changed symptoms.`, `New radiation, sweating and nausea: repeat the ECG now, not at the scheduled time.`, '21'); } },
      { label: `Let me get you something for the nausea.`, next: null, fx: (s, A) => { s.p['21'].k.talkJaw = s.t; A.judge('21-jaw', 'judgment', -2, `You treated Ms. Hughes's nausea instead of her changed chest symptoms.`, `Jaw pain, arm heaviness and diaphoresis are ischemia. ECG first.`, '21'); } },
    ] },
    ros_after: { who: '21', text: `"Thirty-one years running that laundry and I never missed a day for anything." She almost smiles. "I'll tell the girls at the laundry it was my heart, not the chili."` },
    bev_talk: { who: 'bev', pid: '21', text: `Bev holds up a paper cup. "Can she have a coffee? She's been asking. It's just indigestion, right?"`, choices: [
      { label: `Not yet. She needs to stay NPO while we rule out her heart. If she gets sweaty, short of breath, or the pressure spreads, press the call light right away.`, next: 'bev_a', fx: (s, A) => { s.p['21'].k.bev = s.t; A.judge('21-bev', 'comm', 1, `You kept Ms. Hughes NPO and taught Bev what to watch for.`, `She may be going to the cath lab. And family see changes first.`, '21'); } },
      { label: `Sure, a little coffee is fine.`, next: 'bev_b', fx: (s, A) => { s.p['21'].k.bev = s.t; A.judge('21-bev', 'safety', -1, `You let Ms. Hughes have coffee while ACS was being ruled out.`, `NPO until the plan is clear: a cath lab or surgery may be minutes away.`, '21'); } },
    ] },
    bev_a: { who: 'bev', pid: '21', text: `"Her heart?" Bev puts the cup down. "She never complains. Okay. I'll watch her."` },
    bev_b: { who: 'bev', pid: '21', text: `"Thanks, hon." She goes to find the machine.` },
    bev_after: { who: 'bev', pid: '21', text: `"She's been tired for two weeks. I should've made her come sooner."` },

    walt_talk: { who: '22', text: `He looks at you hard and tries. "The — the —" His face crumples. He taps his own mouth with his left hand, frustrated.`, choices: [
      { label: `Take your time. You can squeeze my hand once for yes, twice for no. Did this start today?`, next: 'walt_a', fx: (s, A) => { s.p['22'].k.talked = s.t; A.judge('22-talk', 'comm', 1, `You gave Mr. Haskins a way to communicate.`, `Expressive aphasia: he understands, he can't produce words. Yes/no questions and his good hand let him take part.`, '22'); } },
      { label: `Don't try to talk. Just rest.`, next: 'walt_b', fx: (s, A) => { s.p['22'].k.talked = s.t; A.judge('22-talk', 'comm', -1, `You told Mr. Haskins not to try to communicate.`, `He understands everything. Give him a way to answer.`, '22'); } },
    ] },
    walt_a: { who: '22', text: `One squeeze. Then he points at the door where Joan is standing, and squeezes again, harder.` },
    walt_b: { who: '22', text: `He closes his eyes. A tear runs into his ear.` },
    joan_talk: { who: 'joan', pid: '22', text: `Joan grips the rail. "The paramedics asked when it happened and I said when I found him. Two-thirty. Is that what you need?"`, choices: [
      { label: `What I need is the last time you saw him completely normal. Not when you found him. When was that?`, next: 'joan_a', fx: (s, A) => { const P = s.p['22']; P.lkw = true; A.judge('22-lkw', 'assess', 2, `You established Mr. Haskins's true last known well.`, `Last known well is the last time someone saw him at baseline. Every treatment window starts there, not when he was found.`, '22'); } },
      { label: `Two-thirty, got it. Thank you.`, next: 'joan_b', fx: (s, A) => { A.judge('22-lkw-miss', 'assess', -2, `You accepted "when I found him" as Mr. Haskins's onset.`, `Found at 14:30 isn't last known well. Ask when he was last seen normal.`, '22'); } },
    ] },
    joan_a: { who: 'joan', pid: '22', text: `She thinks. "Ten. He waved at me from the porch when I left for my sister's. I came home at two-thirty and he was on the couch like this." Her face falls. "Does that matter?"` },
    joan_b: { who: 'joan', pid: '22', text: `"Okay." She sits down and holds his good hand.` },
    joan_after: { who: 'joan', pid: '22', text: `"Forty-eight years. He proposed with a trumpet solo." She squeezes his hand. "He'll want to play again."` },

    ali_talk: { who: '23', text: `Alicia starts to answer you, and Derek answers instead. "It's just cramps. She gets them bad. Can we hurry this up?" Alicia looks at the ceiling.`, choices: [
      { label: `I'd like to hear it from Alicia, if that's okay. Alicia, where's the pain, and has anything new started?`, next: 'ali_a', fx: (s, A) => { s.p['23'].k.talked = s.t; A.judge('23-talk', 'comm', 1, `You redirected the history to Ms. Moreno.`, `The patient is the source. A partner who answers for her is a cue to find a private moment.`, '23'); } },
      { label: `Okay, cramps. The ultrasound will tell us more.`, next: 'ali_b', fx: (s, A) => { s.p['23'].k.talked = s.t; A.judge('23-talk', 'assess', -1, `You took the history from Ms. Moreno's boyfriend.`, `You missed what she would have told you: her shoulder hurts and she's dizzy.`, '23'); } },
    ] },
    ali_a: { who: '23', text: `"The left side. And my shoulder hurts now, which is weird. And I get dizzy when I sit up." Derek sighs loudly.` },
    ali_b: { who: '23', text: `Alicia nods. Derek goes back to her phone.` },
    ali_private: { who: '23', text: `When the curtain closes, she lets out a breath. You ask whether she feels safe at home, and about the bruises on her arms. "He grabbed me Tuesday. When I told him about the baby. He's not usually like that." She looks at the curtain. "Please don't say anything to him."`, choices: [
      { label: `Thank you for telling me. It isn't your fault. I won't say anything to him. I'll document what you told me, and there's an advocate who can talk with you here, privately, about options when you're ready.`, next: 'ali_c', fx: (s, A) => { const P = s.p['23']; P.disclosed = true; P.response = 'good'; A.judge('23-ipv', 'comm', 2, `You responded to Ms. Moreno's disclosure safely.`, `Believe her, don't blame her, protect her privacy from him, document objectively, and connect her with an advocate. She decides what happens next.`, '23'); } },
      { label: `You need to leave him, tonight if you can. Pregnancy makes this more dangerous, for you and for the baby, and it only gets worse. I can call the police for you right now and have them waiting when he gets back.`, next: 'ali_d', fx: (s, A) => { const P = s.p['23']; P.disclosed = true; P.response = 'tell'; A.judge('23-ipv', 'comm', -1, `You told Ms. Moreno to leave her partner.`, `True about pregnancy, but leaving is often the most dangerous time, and the decision is hers. Offer an advocate and a safety plan.`, '23'); } },
      { label: `I'll talk to Derek about it when he's back.`, next: 'ali_d', fx: (s, A) => { const P = s.p['23']; P.disclosed = true; P.response = 'confront'; A.judge('23-ipv', 'safety', -3, `You planned to confront Ms. Moreno's partner.`, `Confronting an abusive partner puts her at risk, especially after she leaves the hospital. Her disclosure stays with her and the team.`, '23'); } },
    ] },
    ali_c: { who: '23', text: `"Okay." She wipes her eyes. "Can she come before he gets back?"` },
    ali_d: { who: '23', text: `She shakes her head and stops talking.` },
    ali_after: { who: '23', text: `"My mom's coming. I texted her from your phone." She manages a small smile.` },
    derek_talk: { who: 'derek', pid: '23', text: `"How much longer? She's fine, she just needs something for the cramps. We've been here three hours."`, choices: [
      { label: `I know the wait is hard. I'm watching her closely and I'll update you both as soon as I know more.`, next: null, fx: () => {} },
      { label: `It'll be another couple of hours for ultrasound.`, next: null, fx: () => {} },
    ] },

    ken_talk: { who: '24', text: `"I feel way better. That shot was crazy, my heart's racing." He sits up. "I didn't even taste the peanut."`, choices: [
      { label: `That's the epinephrine. It's working. Hidden peanuts are common in sauces. When did you last have a working EpiPen?`, next: 'ken_a', fx: (s, A) => { s.p['24'].k.talked = s.t; } },
      { label: `You're lucky. Be more careful what you eat.`, next: 'ken_b', fx: (s, A) => { s.p['24'].k.talked = s.t; A.judge('24-talk', 'comm', -1, `You told Mr. Watanabe he should have been more careful.`, `Blame doesn't teach. What he needs is a working autoinjector and a plan.`, '24'); } },
    ] },
    ken_a: { who: '24', text: `"It expired in March. I kept meaning to." He winces. "Lesson learned."` },
    ken_b: { who: '24', text: `"Yeah." He looks at his phone.` },
    ken_sob: { who: '24', text: `He clutches his throat. His voice is a whisper. "Can't — swallow. Tight."` },
    ken_leave: { who: '24', text: `He's pulling on his hoodie. "I'm totally fine now. I have a lab report due at midnight. Can I just go?"`, choices: [
      { label: `I get it. But reactions can come back hours later without any new peanut, and you needed two doses. You need to stay at least until about ten. Before you go I'll show you how to use a new autoinjector, and you'll leave with two.`, next: 'ken_c', fx: (s, A) => { const P = s.p['24']; P.k.leave = s.t; P.teach = true; A.judge('24-teach', 'comm', 2, `You explained the biphasic risk and taught Mr. Watanabe the autoinjector.`, `A biphasic reaction can return hours later. Observation, two autoinjectors, teach-back, and an allergist referral.`, '24'); } },
      { label: `You seem fine. I'll ask the doctor about discharge.`, next: 'ken_d', fx: (s, A) => { const P = s.p['24']; P.k.leave = s.t; A.judge('24-teach', 'judgment', -2, `You started Mr. Watanabe toward an early discharge.`, `He needed two doses of epinephrine. He should be observed for hours, and he can't leave without an autoinjector.`, '24'); } },
    ] },
    ken_c: { who: '24', text: `He practices on the trainer: blue to the sky, orange to the thigh, hold for three. "Okay. I'll email my professor."` },
    ken_d: { who: '24', text: `"Sweet." He's already texting.` },
    ken_after: { who: '24', text: `"I'm going to label everything in the dorm fridge." He shows you a photo of his roommate's peanut butter. "This is getting thrown out."` },

    har_talk: { who: '25', text: `"I keep telling Karen, it's a bump. I've hit my head on worse in an engine room." He winks. "Can I go home and feed Duke?"`, choices: [
      { label: `On a blood thinner, bleeding in the head can be slow and show up hours later. That's why we're scanning you and checking you often. Tell me right away if your headache gets worse or you feel sick.`, next: 'har_a', fx: (s, A) => { s.p['25'].k.talked = s.t; A.judge('25-talk', 'comm', 1, `You explained the risk of a delayed bleed to Mr. Jensen.`, `He's your monitor between checks. A worse headache or vomiting is what he needs to report.`, '25'); } },
      { label: `You'll probably be home tonight.`, next: 'har_b', fx: (s, A) => { s.p['25'].k.talked = s.t; A.judge('25-talk', 'comm', -1, `You promised Mr. Jensen he'd go home tonight.`, `Too early to know. A promise makes him less likely to tell you when something changes.`, '25'); } },
    ] },
    har_a: { who: '25', text: `"Aye aye." He salutes with the hand that isn't holding the ice pack.` },
    har_b: { who: '25', text: `"Good. Duke gets cranky after six."` },
    har_out: { who: '25', text: `He doesn't answer. One pupil is larger than the other.` },
    har_after: { who: '25', text: `"Thirty years on ships and I trip on my own back steps." He shakes his head, carefully.` },
    karen_talk: { who: 'karen', pid: '25', text: `"If the scan's okay, can I just take him home? He hates hospitals. I'll watch him."`, choices: [
      { label: `I understand. With his blood thinner, the team wants the CT, his INR and a few hours of neuro checks first. Bleeding can be slow. If he goes home, you'll get a list of exactly what to watch for.`, next: 'karen_a', fx: (s, A) => { s.p['25'].k.karen = s.t; A.judge('25-karen', 'comm', 1, `You explained why Mr. Jensen needs observation.`, `Families can accept waiting when they know why.`, '25'); } },
      { label: `If the CT is clean he can probably go.`, next: 'karen_b', fx: (s, A) => { s.p['25'].k.karen = s.t; A.judge('25-karen', 'comm', -1, `You told Karen a clean CT meant home.`, `On an anticoagulant, the first CT can be clean and the bleed can come later.`, '25'); } },
    ] },
    karen_a: { who: 'karen', pid: '25', text: `"Okay. He'll hate it." She pulls a chair closer. "I'll stay."` },
    karen_b: { who: 'karen', pid: '25', text: `"Great." She starts looking up the parking validation.` },
    karen_after: { who: 'karen', pid: '25', text: `"He took his warfarin this morning. I set it up in his pill box. Wednesday's empty."` },
  };

  /* ---------- events ---------- */
  const A0 = (s) => ['21', '22', '23'].every((id) => s.p[id].seenAt === null);
  const events = [
    { id: 'tech-hi', when: (s) => s.t >= 2, run(s, A) { A.msg({ from: 'rico', text: `Hey, I'm your tech for Pod B tonight. 21's repeat ECG is due at 3:15. Want me to start vitals?`, replies: [{ label: 'Open tasks for Rico', act: 'delegate' }] }); } },
    { id: 'ct-22', when: (s) => s.t >= 10, run(s, A) { const P = s.p['22']; P.ctRead = true; A.addLab('22', { name: 'CT head', val: 'No hemorrhage. Early loss of gray-white differentiation, left insula.', unit: '', ref: '', flag: 'A' }); A.msg({ from: 'rad', pid: '22', text: `Prelim CT head on 22 Haskins: no bleed. CTA to follow.` }); } },
    { id: 'trop-21', when: (s) => s.t >= 18, run(s, A) { const P = s.p['21']; P.tropSeen = true; A.addLab('21', { name: 'hs-Troponin I (0 h)', val: 38, unit: 'ng/L', ref: 'under 16 (women)', flag: 'H' }); A.msg({ from: 'lab', pid: '21', text: `21 Hughes troponin resulted: 38.` }); } },
    { id: 'tpa-order', when: (s) => s.t >= 24 && !s.p['22'].tpaClarified && !s.p['22'].gone, run(s, A) { const P = s.p['22']; P.tpaOrder = true; A.addOrder('22', `Tenecteplase 0.25 mg/kg IV bolus (82 kg: 20.5 mg). BP under 185/110 before, under 180/105 after. Onset 14:30 per EMS.`); A.msg({ from: 'osei', pid: '22', urgent: true, text: `CT's clean on 22. Onset 14:30 per EMS, so he's in the window. Get his pressure under 185/110 and give the tenecteplase. Order's in.`, replies: [{ label: 'Go to 22', act: 'goto', pid: '22' }] }); } },
    { id: 'ros-worse', when: (s) => { const P = s.p['21']; return !P.gone && P.isch >= .32 && P.stemiSeen === null; }, run(s, A) { const P = s.p['21']; P.sympAt = s.t; A.msg({ from: 'rico', pid: '21', urgent: true, text: `21 says the pressure's worse and it's in her jaw now. She's sweaty. Want me to grab a repeat ECG?`, replies: [{ label: 'Yes, now, and bring it straight to me', act: 'ros-ecg' }, { label: 'I\'m coming', act: 'goto', pid: '21' }] }); } },
    { id: 'cta-22', when: (s) => s.t >= 40 && !s.p['22'].gone, run(s, A) { const P = s.p['22']; P.cta = true; A.addLab('22', { name: 'CTA head and neck', val: 'Occlusion of the proximal left M1 segment.', unit: '', ref: '', flag: 'A' }); A.msg({ from: 'rad', pid: '22', text: `CTA on 22 Haskins: left M1 occlusion.` }); } },
    { id: 'ali-shoulder', when: (s) => { const P = s.p['23']; return !P.gone && P.hemo >= .42; }, run(s, A) { A.msg({ from: 'rico', pid: '23', text: `23 says her shoulder hurts and she's dizzy when she sits up. Her HR's ${aHR(s.p['23'])}.`, replies: [{ label: 'I\'m coming', act: 'goto', pid: '23' }, { label: 'Check her orthostatics for me', act: 'ali-ortho' }] }); } },
    { id: 'ken-arrive', when: (s) => s.t >= 70, run(s, A) { const P = s.p['24']; P.arrived = true; P.vit.push({ t: s.t, by: 'EMS', T: 36.9, HR: 128, SBP: 84, DBP: 50, RR: 28, SpO2: 92, O2: 'Room air', pain: 0 }); A.msg({ from: 'nova', pid: '24', urgent: true, text: `EMS in 24: anaphylaxis, peanut. BP 84/50, lips swelling, wheezing. They gave Benadryl, no epi. He's yours.`, replies: [{ label: 'Go to 24', act: 'goto', pid: '24' }] }); } },
    { id: 'ken-airway', when: (s) => { const P = s.p['24']; return P.arrived && !P.gone && P.sev >= 1.35; }, run(s, A) { const P = s.p['24']; P.icu = true; P.gone = true; P.goneAt = s.t; P.goneText = 'Intubated, to the ICU'; A.judge('24-airway', 'safety', -3, `Mr. Watanabe's airway closed.`, `Anaphylaxis with lip swelling and hypotension, and no epinephrine. Antihistamines don't stop airway edema; epinephrine does.`, '24'); A.msg({ from: 'nova', pid: '24', urgent: true, text: `24 has stridor and is desatting. Anesthesia's intubating. Why hasn't he had epi?` }); } },
    { id: 'ken-leave', when: (s) => { const P = s.p['24']; return P.arrived && !P.gone && P.sev < .3 && s.t >= 140; }, run(s, A) { const P = s.p['24']; P.leaveAt = s.t; A.msg({ from: 'rico', pid: '24', text: `24 is putting his hoodie on. Says he feels fine and wants to leave.`, replies: [{ label: 'I\'ll go talk to him', act: 'goto', pid: '24' }] }); } },
    { id: 'har-arrive', when: (s) => s.t >= 150, run(s, A) { const P = s.p['25']; P.arrived = true; P.vit.push({ t: s.t, by: 'Sid (triage)', T: 36.6, HR: 74, SBP: 150, DBP: 84, RR: 16, SpO2: 96, O2: 'Room air', pain: 2 }); A.msg({ from: 'nova', pid: '25', text: `New one in 25 from triage: 81, fell, hit his head, on warfarin. GCS 15. CT's ordered.`, replies: [{ label: 'Go to 25', act: 'goto', pid: '25' }] }); } },
    { id: 'har-inr', when: (s) => s.t >= 180 && s.p['25'].arrived, run(s, A) { const P = s.p['25']; P.inrSeen = true; A.addLab('25', { name: 'INR', val: 3.6, unit: '', ref: 'goal 2–3 on warfarin', flag: 'H' }); A.msg({ from: 'lab', pid: '25', text: `25 Jensen INR 3.6.` }); } },
    { id: 'har-ct', when: (s) => s.t >= 186 && s.p['25'].arrived, run(s, A) { const P = s.p['25']; P.ctSeen = true; A.addLab('25', { name: 'CT head', val: 'Acute left frontoparietal subdural hematoma, 8 mm. No midline shift.', unit: '', ref: '', flag: 'A' }); A.msg({ from: 'rad', pid: '25', urgent: true, text: `CT on 25 Jensen: acute left subdural, 8 mm, no shift.`, replies: [{ label: 'Go to 25', act: 'goto', pid: '25' }] }); } },
    { id: 'har-vomit', when: (s) => { const P = s.p['25']; return P.arrived && !P.gone && P.bleed >= .55; }, run(s, A) { A.msg({ from: 'rico', pid: '25', text: `25 just vomited. His daughter's asking for something for nausea. He seems sleepier.`, replies: [{ label: 'I\'m coming to check him', act: 'goto', pid: '25' }, { label: 'Give him the Zofran', act: 'har-zofran' }] }); } },
    { id: 'karen-home', when: (s) => s.t >= 200 && s.p['25'].arrived && !s.p['25'].gone, run(s, A) { A.msg({ from: 'rico', pid: '25', text: `25's daughter is asking if she can take him home now.` }); } },
    // Consequences and transfers.
    { id: 'ros-arrest', when: (s) => { const P = s.p['21']; return !P.gone && P.called === null && P.isch >= 1; }, run(s, A) { const P = s.p['21']; P.arrest = true; P.gone = true; P.arrestAt = s.t; P.goneAt = s.t; P.goneText = 'To the cath lab after a cardiac arrest'; A.judge('21-arrest', 'safety', -3, `Ms. Hughes went into ventricular fibrillation.`, `An inferior STEMI evolving all afternoon. The repeat ECG and a STEMI call were the intervention.`, '21'); A.msg({ from: 'nova', pid: '21', urgent: true, text: `Code blue 21: VF. Shocked three times, ROSC. Cath lab's taking her now.` }); } },
    { id: 'ros-cath', when: (s) => { const P = s.p['21']; return !P.gone && P.cath !== null && s.t >= P.cath; }, run(s, A) { const P = s.p['21']; P.gone = true; P.goneAt = s.t; P.goneText = 'To the cath lab'; A.msg({ from: 'osei', pid: '21', text: `Cath team's here for 21. Call report to the cath lab.` }); } },
    { id: 'walt-ir', when: (s) => { const P = s.p['22']; return !P.gone && P.ir !== null && s.t >= P.ir; }, run(s, A) { const P = s.p['22']; P.gone = true; P.goneAt = s.t; P.goneText = 'To neurointerventional radiology'; A.msg({ from: 'osei', pid: '22', text: `IR's ready for 22. Thanks for asking his wife.` }); } },
    { id: 'walt-ich', when: (s) => { const P = s.p['22']; return !P.gone && P.tpaGiven !== null && s.t >= P.ichAt; }, run(s, A) { const P = s.p['22']; P.ich = true; P.icu = true; P.gone = true; P.goneAt = s.t; P.goneText = 'To the neuro ICU after a brain hemorrhage'; A.judge('22-ich', 'safety', -3, `Mr. Haskins bled into his brain after thrombolysis.`, `Given outside the window from his true last known well, thrombolysis turns a clot into a hemorrhage.`, '22'); A.msg({ from: 'nova', pid: '22', urgent: true, text: `22 is vomiting and unresponsive. Repeat CT: big left-sided hemorrhage. Heparin and antiplatelets held. Neuro ICU's taking him.` }); } },
    { id: 'ali-or', when: (s) => { const P = s.p['23']; return !P.gone && P.or !== null && s.t >= P.or; }, run(s, A) { const P = s.p['23']; P.gone = true; P.goneAt = s.t; P.goneText = 'To the OR with GYN'; A.msg({ from: 'osei', pid: '23', text: `Free fluid on ultrasound. GYN's taking 23 to the OR.` }); } },
    { id: 'ali-rupture', when: (s) => { const P = s.p['23']; return !P.gone && P.hemo >= 1.1; }, run(s, A) { const P = s.p['23']; P.rupture = true; P.gone = true; P.goneAt = s.t; P.goneText = 'To the OR in hemorrhagic shock'; A.judge('23-shock', 'safety', -3, `Ms. Moreno went into hemorrhagic shock from a ruptured ectopic.`, `Positive hCG, shoulder pain, dizziness and a heart rate climbing for hours. Young patients hold their pressure until they collapse.`, '23'); A.msg({ from: 'nova', pid: '23', urgent: true, text: `23 passed out. BP 70s. Massive transfusion's started; GYN is taking her straight to the OR.` }); } },
    { id: 'har-herniate', when: (s) => { const P = s.p['25']; return P.arrived && !P.gone && P.bleed >= 1; }, run(s, A) { const P = s.p['25']; P.herniate = true; P.icu = true; P.gone = true; P.goneAt = s.t; P.goneText = 'To the OR for emergency craniotomy'; A.judge('25-herniate', 'safety', -3, `Mr. Jensen's subdural expanded until he herniated.`, `A slow bleed on warfarin: the neuro checks show it, and reversal stops it.`, '25'); A.msg({ from: 'nova', pid: '25', urgent: true, text: `25 is GCS 7 with a blown left pupil. Intubating; neurosurgery's taking him to the OR.` }); } },
    { id: 'nova-idle', when: (s) => s.t >= 30 && s.t < 90 && A0(s), run(s, A) { A.msg({ from: 'nova', urgent: true, text: `Half an hour in and you haven't touched a patient. You have a stroke alert in 22. Go.` }); } },
    { id: 'nova-30', when: (s) => s.t >= 270, run(s, A) { A.msg({ from: 'nova', text: `Thirty minutes. Jo's taking your bays at eight. Pending results, pending transfers, everything.` }); } },
  ];

  const replies = {
    'ros-ecg'(s, A) { const P = s.p['21']; P.ecgs.push(s.t); if (stemi(P)) { P.stemiSeen = s.t; A.judge('21-ecg', 'assess', 2, `You got Ms. Hughes's repeat ECG the moment her symptoms changed.`, `A change in symptoms is a reason for a new ECG right now.`, '21'); A.addLab('21', { name: `ECG ${clock(s.t)}`, val: 'Sinus bradycardia 58. ST elevation II, III, aVF with reciprocal depression in I and aVL. Inferior STEMI.', unit: '', ref: '', flag: 'A' }); A.msg({ from: 'rico', pid: '21', urgent: true, text: `Here's 21's ECG. The machine says "ACUTE MI." ST up in II, III and aVF.`, replies: [{ label: 'Go to 21', act: 'goto', pid: '21' }] }); } },
    'ali-ortho'(s, A) { const P = s.p['23']; P.hemo += .08; A.judge('23-ortho', 'safety', -1, `You had Ms. Moreno stood up for orthostatic vitals.`, `She's already dizzy sitting up, with a rising heart rate. Standing a possibly bleeding patient risks a faint and a fall; the dizziness is the answer.`, '23'); A.msg({ from: 'rico', pid: '23', text: `She almost passed out when she stood. HR went to 134. I got her back down.` }); },
    'har-zofran'(s, A) { A.judge('25-ond', 'judgment', -2, `You had Mr. Jensen's vomiting treated without a neuro check.`, `New vomiting after a head injury on warfarin is rising pressure until proven otherwise. Check him and call.`, '25'); s.p['25'].ond = true; },
  };

  /* ---------- delegation ---------- */
  const delegation = {
    note: () => `Rico is an ED tech: vitals, ECGs, glucose, transport. One thing at a time.`,
    tasks: [
      { id: 'vitals', label: 'Take a set of vital signs', rooms: ['21', '22', '23', '24', '25'], mins: 5 },
      { id: 'ecg', label: 'Repeat 12-lead ECG and bring it to me', rooms: ['21'], mins: 6 },
      { id: 'water', label: 'Get him a cup of water', rooms: ['22'], mins: 0 },
      { id: 'ortho', label: 'Orthostatic vital signs', rooms: ['23'], mins: 0 },
      { id: 'neuro', label: 'Do his neuro checks', rooms: ['22', '25'], mins: 0 },
      { id: 'epi', label: 'Give the epinephrine', rooms: ['24'], mins: 0 },
    ],
    start(task, pid, s, A) {
      const nm = A.def(pid).short;
      if (task.id === 'water') { const P = s.p['22']; P.water = true; A.judge('deleg-water', 'deleg', -2, `You had the tech give water to a stroke patient before a swallow screen.`, `NPO until he passes a swallow screen. Aspiration is one of the most common, preventable complications of stroke.`); return `Rico: "Got it." A minute later: "He coughed a lot on that. Is that okay?"`; }
      if (task.id === 'ortho') { replies['ali-ortho'](s, A); return `Rico: "On it."`; }
      if (task.id === 'neuro') { A.judge('deleg-neuro', 'deleg', -1, `You asked the tech to do neuro checks.`, `Neuro checks are RN assessments: interpreting a change is the point.`); return `Rico: "I can get vitals, but neuro checks are yours."`; }
      if (task.id === 'epi') { A.judge('deleg-epi', 'deleg', -2, `You asked the tech to give epinephrine.`, `Medication administration is a nursing task, and this is the most urgent one in the department.`); return `Rico: "I can't give meds! You need to do it, now."`; }
      if (s.deleg.filter((d) => !d.done).length >= 1) return `Rico: "Give me a minute, I'm still on the last one."`;
      s.deleg.push({ id: task.id, pid, due: s.t + task.mins, done: false, at: s.t });
      A.judge('deleg-good-' + task.id + '-' + pid, 'deleg', 1, `You delegated ${task.label.toLowerCase()} for ${A.def(pid).short} to the tech.`, 'Hand off the task; keep the interpretation.');
      return `Rico: "On it: ${task.label.toLowerCase()} for ${nm}."`;
    },
    complete(d, s, A) {
      const nm = A.def(d.pid).short;
      if (d.id === 'vitals') { const v = A.recordVitals(d.pid, 'Rico (tech)'); A.msg({ from: 'rico', pid: d.pid, text: `${nm}: HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}%.` }); }
      else if (d.id === 'ecg') { const P = s.p['21']; P.ecgs.push(s.t); if (stemi(P)) { replies['ros-ecg'](s, A); } else { A.addLab('21', { name: `ECG ${clock(s.t)}`, val: 'Sinus 96. Subtle ST straightening in III.', unit: '', ref: '', flag: '' }); A.msg({ from: 'rico', pid: '21', text: `21's repeat ECG is in her chart. Machine read: sinus rhythm, nonspecific changes.` }); } }
    },
  };

  /* ---------- Nova ---------- */
  function novaHint(s, A) {
    const R = s.p['21'], W = s.p['22'], L = s.p['23'], K = s.p['24'], H = s.p['25'];
    if (K.arrived && !K.gone && !K.epi.length) return `Anaphylaxis with low pressure and a swelling airway. What's the one drug, and where does it go?`;
    if (!W.gone && !W.lkw) return `"Onset 14:30" came from EMS. Is that when his symptoms started, or when someone found him?`;
    if (!W.gone && W.lkw && W.called === null) return `You know something about 22 that the doctor ordering tenecteplase doesn't.`;
    if (!R.gone && R.stemiSeen === null && s.t >= 15) return `21's repeat ECG was due at 15:15. Diabetic women don't read the textbook.`;
    if (!R.gone && R.stemiSeen !== null && R.called === null) return `You've seen ST elevation. Who needs to hear the word "STEMI"?`;
    if (!R.gone && R.stemiSeen !== null && R.v4r === null) return `Inferior MI. Which ventricle might be involved, and what does that do to nitroglycerin?`;
    if (!L.gone && L.called === null && L.hemo > .4) return `Positive pregnancy test, shoulder pain, dizzy sitting up. Where is the blood going?`;
    if (!L.gone && !L.private) return `Someone in 23 is doing all the talking. Have you heard from your patient alone?`;
    if (H.arrived && !H.gone && H.called === null && H.ctSeen) return `A subdural on warfarin with an INR of 3.6. What reverses warfarin in minutes?`;
    if (H.arrived && !H.gone && (!H.checks.length || s.t - H.checks[H.checks.length - 1] > 30)) return `25 looked fine at triage. When did you last check his pupils?`;
    return `You're holding it together. What's pending on each bay that the next nurse needs to know?`;
  }

  function endChecks(s, A) {
    A.c.patients.forEach((d) => {
      const P = s.p[d.id];
      if ((!d.arrives || P.arrived) && P.seenAt === null && !P.icu && !P.gone) A.judge(d.id + '-unseen', 'assess', -3, `You never went into ${d.room} this shift.`, `In the ED, everyone in a bay is someone's emergency.`, d.id);
      (d.meds || []).forEach((m) => { const st = s.meds[m.id]; if ((!d.arrives || P.arrived) && m.due !== undefined && m.due <= Math.min(240, s.t - 60) && st.status === 'due' && !P.icu && !P.gone && m.id !== '25-warf') A.judge(m.id + '-missed', 'meds', -2, `${m.name} for ${d.short} (due ${clock(m.due)}) was never given or held.`, `Every ordered dose needs a decision: given, or held with a reason.`, d.id); });
    });
    const R = s.p['21'], W = s.p['22'], L = s.p['23'], K = s.p['24'], H = s.p['25'];
    if (R.asa === null && !R.arrest) A.judge('21-noasa', 'meds', -2, `Ms. Hughes never got aspirin.`, `Possible ACS: aspirin, chewed, early.`, '21');
    if (!W.lkw) A.judge('22-nolkw', 'assess', -2, `Nobody asked when Mr. Haskins was last known well.`, `"When was he last normal?" is the most important question in a stroke alert.`, '22');
    if (!W.gone && W.lkw && W.called === null) A.judge('22-norep', 'comm', -3, `Mr. Haskins's true last known well never reached the team.`, `It decides the treatment.`, '22');
    if (!L.private) A.judge('23-noprivate', 'assess', -1, `Ms. Moreno was never asked about her safety alone.`, `Every patient is screened for partner violence in private; a controlling partner is the reason to make sure it happens.`, '23');
    if (K.arrived && K.sev <= .3 && !K.teach && !K.gone) A.judge('24-noteach', 'comm', -1, `Mr. Watanabe was never taught about the autoinjector or biphasic reactions.`, `He came in with an expired EpiPen.`, '24');
    if (H.arrived && !H.gone && H.warf !== 'held' && H.warf !== 'given' && s.t >= 190) A.judge('25-warf-missed', 'meds', -1, `Nobody decided about Mr. Jensen's 18:00 warfarin.`, `Hold it after a head injury, and say so.`, '25');
    if (H.arrived && !H.gone && H.checks.length < 2 && s.t >= 220) A.judge('25-checks', 'assess', -2, `Mr. Jensen's neuro checks weren't kept up.`, `A head-injured patient on warfarin needs scheduled neuro checks; a delayed bleed shows up between them.`, '25');
    const keys = []; A.c.patients.forEach((d) => (d.report || []).forEach((r, i) => { if (r.key) keys.push(d.id + ':' + i); }));
    const hit = keys.filter((k) => s.brain.includes(k)).length;
    if (s.brain.length) { const noise = s.brain.length - hit, precise = hit / s.brain.length;
      if (noise >= 4 && precise < .7) A.judge('brain', 'assess', -1, `You flagged ${s.brain.length} lines in report, ${noise} of them noise.`, 'Flagging everything is the same as flagging nothing.');
      else A.judge('brain', 'assess', hit / keys.length >= 0.6 && precise >= .7 ? 1 : 0, `You flagged ${hit} of ${keys.length} critical cues during handoff${noise ? `, plus ${noise} that didn't matter` : ''}.`, `In the ED, report is what's pending and what the clock is: a test due, a time someone was last normal, a result not yet back.`); }
  }

  const PREP = { '21-ntg': ['vitals'], '22-lab': ['vitals'], '22-tpa': ['lkw', 'vitals'], '23-morph': ['pain', 'vitals'], '24-epi': ['airway'], '25-ond': ['gcs'], '25-warf': ['gcs'] };
  [ros, walter, alicia, kenji, harold].forEach((d) => d.meds.forEach((m) => { if (PREP[m.id]) m.prep = PREP[m.id]; }));

  const LK = (skin, shade, lip, blush, iris, hair, hcol, cloth, extras, smile) => ({ skin, shade, lip, blush, iris, head: { w: 55, h: 61, jaw: .42 }, eye: 9.8, hair: { style: hair, color: hcol }, brow: { w: 3.6, color: hcol }, body: { w: 82, cloth }, extras: extras || [], smile: smile === undefined ? .35 : smile });
  S.engine.registerCase({
    id: 'ed-podb-1', title: 'Evenings in the ED', unit: 'Emergency Department, Pod B', unitShort: 'ED Pod B', level: 'Specialty: Emergency', start: 15 * 60, length: 300, novaCredits: 3,
    card: 'The ED from three to eight: a stroke alert with the wrong onset time, "indigestion" that becomes a STEMI, a pregnancy test and shoulder pain, and two more coming through the doors.',
    hero: { head: 'Evenings, ED Pod B. Three bays and the doors keep opening.', lede: 'Emergency department, 15:00 to 20:00. Every patient comes with a clock: a treatment window, a door-to-balloon time, a scan that\'s backed up. The facts that change the plan come from asking.' },
    intro: { time: '14:58', place: 'Emergency Department, Pod B', cta: 'Take report', beats: ['Paul is handing off Pod B at the board between ambulances.', 'Three in beds and two more on the way before eight.', 'Triage notes and EMS reports are where the story starts. They aren\'t where it ends.'] },
    minutes: 25,
    arrivalNoun: 'arrival',
    sysLabels: { neuro: 'Neuro and stroke scale' },
    handoffBy: 'Paul (day RN)', reportBy: 'paul', reportRole: 'day shift', provider: 'osei', cna: 'rico',
    staff: {
      nova: { name: 'Nova Reyes', role: 'Charge nurse', look: { skin: '#B98A63', shade: '#976D4B', lip: '#7C4435', blush: '#C77B5E', iris: '#3D2A1C', head: { w: 55, h: 62, jaw: .35 }, eye: 10, hair: { style: 'bun', color: '#3A2E2A', streak: true }, brow: { w: 3.6, color: '#2E2421' }, body: { w: 80, cloth: 'navy' }, extras: ['studs'], smile: .35 } },
      rico: { name: 'Rico', role: 'ED tech', look: LK('#C08A64', '#A06E4C', '#86483A', '#C27C60', '#20140C', 'curlyshort', '#140E0A', 'grey', [], .5) },
      paul: { name: 'Paul', role: 'Day RN', look: Object.assign(LK('#F0D2BC', '#D4AE96', '#B4675F', '#EA998A', '#4E6A84', 'short', '#8A6A48', 'navy', ['beard']), { tired: true }) },
      osei: { name: 'Dr. Osei', role: 'Emergency physician', look: LK('#6A4430', '#4F3122', '#502A1E', '#94503E', '#1E130C', 'buzz', '#120D0A', 'coat', ['glasses']) },
      bev: { name: 'Bev', role: 'Sister, 21', look: LK('#E9C6A8', '#CDA488', '#B06A5E', '#E39883', '#4A5E70', 'curls', '#A8A098', 'plum', ['glasses']) },
      joan: { name: 'Joan', role: 'Wife, 22', look: LK('#6A4430', '#4F3122', '#502A1E', '#94503E', '#1E130C', 'short', '#C8C2BC', 'blouse', ['pearls', 'wrinkles']) },
      derek: { name: 'Derek', role: 'Boyfriend, 23', look: LK('#E2B48E', '#C49670', '#A0594C', '#DC8E74', '#3A2616', 'short', '#3A2618', 'tee', []) },
      karen: { name: 'Karen', role: 'Daughter, 25', look: LK('#EECFB6', '#D2AE96', '#B0675F', '#E59A8A', '#5A7A9A', 'bob', '#9A7A58', 'blue', []) },
      lab: { name: 'Lab', role: 'Laboratory', look: null },
      rad: { name: 'Radiology', role: 'Reading room', look: null },
    },
    patients: [ros, walter, alicia, kenji, harold],
    dueExtras(s) {
      const out = [], R = s.p['21'], W = s.p['22'], L = s.p['23'], K = s.p['24'], H = s.p['25'];
      if (!R.gone && R.stemiSeen === null) { const le = R.ecgs.length ? R.ecgs[R.ecgs.length - 1] : -5; out.push({ t: le + 20, late: s.t > le + 30, text: '21 Repeat 12-lead ECG' }); }
      if (!R.gone && R.asa === null) out.push({ t: 0, late: s.t > 15, text: '21 Aspirin 324 mg chewed (not given at triage)' });
      if (!W.gone) { const nx = (W.checks.length ? W.checks[W.checks.length - 1] : -15) + 15; out.push({ t: Math.max(0, nx), late: s.t > nx + 10, text: '22 NIHSS and neuro check' }); if (!W.lkw) out.push({ t: 0, late: s.t > 15, text: '22 Confirm last known well' }); }
      if (!L.gone && L.called === null) out.push({ t: 120, late: false, info: true, text: '23 Ultrasound pending: radiology is backed up' });
      if (K.arrived && !K.gone && !K.epi.length) out.push({ t: 70, late: s.t > 75, text: '24 Anaphylaxis: epinephrine now' });
      if (H.arrived && !H.gone) { const nx = (H.checks.length ? H.checks[H.checks.length - 1] : 150) + (H.called !== null ? 15 : 30); out.push({ t: nx, late: s.t > nx + 10, text: `25 Neuro check every ${H.called !== null ? 15 : 30} minutes` }); }
      return out;
    },
    replies,
    priority: {
      judge(r, A) {
        if (r[0] === '22') A.judge('rank-first', 'priority', 2, `You chose to see Mr. Haskins first.`, `A stroke alert has the shortest clock on the board: every minute, about two million neurons. And his onset time hasn't been checked.`, '22');
        else if (r[0] === '21') A.judge('rank-first', 'priority', 1, `You chose to see Ms. Hughes first.`, `Possible ACS with an ECG due is a strong second. But the stroke alert's window is measured in minutes.`, '22');
        else A.judge('rank-first', 'priority', -1, `You put Ms. Moreno first.`, `She needs watching closely, and she's still compensating. The stroke alert and the possible MI come first.`, '22');
      },
      correct: ['22', '21', '23'],
      why: {
        '22': `Stroke alert: aphasia and right hemiparesis, BP 198/108, a reperfusion decision coming, and an onset time that came from EMS.`,
        '21': `Diabetic woman with "indigestion," a nonspecific first ECG and a repeat due at 15:15. No aspirin yet.`,
        '23': `Positive hCG with pain, waiting for ultrasound. Stable now, at risk of a rupture. Watch her heart rate.`,
      },
    },
    events, delegation, dialogs, novaHint, endChecks,
    tick(s, A) {
      const R = s.p['21'];
      if (!R.gone && R.called === null) R.isch = clamp(R.isch + (R.asa !== null ? .006 : .0075), 0, 1.2);
      const L = s.p['23'];
      if (!L.gone) L.hemo += .005;
      const K = s.p['24'];
      if (K.arrived && !K.gone) {
        if (!K.epi.length) K.sev += .016;
        else if (K.epi.length < 2 && s.t - K.epi[K.epi.length - 1] > 10) K.sev = Math.min(.9, K.sev + .006);
        else K.sev = Math.max(0, K.sev - .004);
        if (K.ivEpi && s.t - K.ivEpiAt > 20) K.ivEpi = false;
      }
      const H = s.p['25'];
      if (H.arrived && !H.gone) H.bleed += H.pcc !== null ? .0008 : .0075;
    },
  });
})(window.Shift);
