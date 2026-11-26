/* Case: 6 East, Cardiac Step-Down, day shift (07:00–12:00). Specialty.
   Themes: drips and protocols that run on numbers, and the information that should change the protocol.
   601: AF with RVR on a diltiazem drip, and an echo this morning showing EF 25%. Diltiazem is a negative inotrope;
        in reduced-EF heart failure it worsens the failure. The titration order says go up; the echo says stop.
   603: Inferior STEMI, stent through the right femoral artery overnight, sheath out at 06:15. A retroperitoneal
        bleed with a clean-looking groin: back pain, a climbing heart rate, a falling pressure.
   605: PE on a heparin drip, day 5. The aPTT is high (the nomogram says hold and decrease), and the platelets have
        fallen by more than half (heparin-induced thrombocytopenia: stop all heparin).
   607: Syncope workup. QTc over 500, potassium and magnesium low, citalopram 40 mg in an 81-year-old, ondansetron
        on the PRN list, furosemide due. The unit's electrolyte protocol is the nurse's to start. */
(function (S) {
  const { clamp, clock } = S.engine;
  const jit = (s, seed) => ((Math.floor(s.t / 5) * 7 + seed * 13) % 3) - 1;
  const recent = (s, t0, m) => t0 !== null && t0 !== undefined && s.t - t0 <= m;
  const J = (key, dom, d, text, why, pid) => (s, A) => A.judge(key, dom, d, text, why, pid);

  /* ---------- 601 Gloria Mendes: AF with RVR on diltiazem; the echo shows EF 25% ---------- */
  const gloHR = (P) => Math.round(P.hr);
  const gloSBP = (P) => Math.round(98 - (P.dilt - 10) * 3 - P.hf * 12 + (P.lasixAt !== null ? 2 : 0));
  const gloria = {
    id: '601', room: '601', name: 'Gloria Mendes', short: 'Mrs. Mendes', age: 68, sex: 'F', mrn: '00561284',
    look: { skin: '#C99872', shade: '#A97A55', lip: '#9A5A4E', blush: '#D08A72', iris: '#3A2A1C', head: { w: 56, h: 60, jaw: .3 }, eye: 9.4,
      hair: { style: 'bob', color: '#6B6460' }, brow: { w: 3.2, color: '#4A423E' }, body: { w: 80, cloth: 'gown' }, extras: ['gold', 'thinGlasses'], glasses: '#7A5A3A', smile: .25,
      lines: { calm: `Is my heart still racing? I can feel it in my throat.`, dys: `I can't get a breath. Can you sit me up more?`, anxious: `It's going so fast. Is it going to stop?`, drowsy: `I'm so tired.`, none: `She doesn't answer.` } },
    bio: `Retired court stenographer. Runs the Thursday book club at her church. Her son Rafael lives in Sacramento and calls every night at nine.`,
    dx: `Atrial fibrillation with RVR, new heart failure`, reason: `New atrial fibrillation with a fast ventricular rate, three days of palpitations and swelling. Admitted from the ED overnight on a diltiazem infusion.`,
    hx: [`Hypertension`, `No known heart disease before this week`, `Ankles swelling for a month; slept in her recliner the last two nights`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `72 kg`,
    lines: [`PIV 20g left forearm: diltiazem infusion`, `PIV 22g right hand: saline lock`], mobility: `Up with assist, telemetry`, diet: `Cardiac, 2 g sodium`,
    init: { hr: 138, dilt: 10, diltOn: true, hf: .3, echoSeen: false, stripSeen: false, lungs: false, called: false, stopOrder: false, stoppedAt: null, amioAt: null, lasixAt: null, upTitrated: 0, reassessed: false, icu: false, warned: false },
    nightVitals: { T: 36.8, HR: 136, SBP: 100, DBP: 64, RR: 22, SpO2: 94, O2: '2 L nasal cannula', pain: 0 },
    labs: [
      { name: 'BNP', val: 1840, unit: 'pg/mL', ref: 'under 100', flag: 'H', t: -420 },
      { name: 'hs-Troponin I', val: 12, unit: 'ng/L', ref: 'under 16 (women)', flag: '', t: -420 },
      { name: 'Potassium', val: 4.1, unit: 'mmol/L', ref: '3.5–5.0', flag: '', t: -60 },
      { name: 'TSH', val: 2.1, unit: 'mIU/L', ref: '0.4–4.0', flag: '', t: -420 },
      { name: 'Echocardiogram', val: 'Done 06:10, reading pending', unit: '', ref: '', flag: '', t: -50 },
    ],
    orders: [
      { t: -400, text: `Diltiazem infusion, 125 mg in 125 mL. Titrate by 2.5 mg/h every 15 minutes for HR over 110, maximum 15 mg/h. Hold for SBP under 90. HR and BP every 15 minutes while titrating.` },
      { t: -400, text: `Continuous telemetry. Oxygen to keep SpO₂ 92% or above. Strict intake and output, daily weight. Transthoracic echocardiogram in the morning.` },
      { t: -400, text: `Apixaban 5 mg PO twice daily (09:00, 21:00). Electrolyte replacement protocol.` },
    ],
    notes: [
      { t: -90, author: 'Lena, night RN', text: `HR 130s–140s all night in AF. Diltiazem 5 → 7.5 at 02:00 → 10 at 05:00, HR barely moved; SBP 98–104. Crackles at the bases, needed 2 L for SpO₂ 93–94%. Echo done at 06:10, read pending.` },
    ],
    io: { intake: `Overnight: 640 mL (including the drip)`, output: `Overnight: 350 mL` },
    report: [
      { text: `Gloria Mendes, 68, new A-fib with RVR from the ED. On a diltiazem drip, up to 10 since five. Her rate is still in the 130s.`, key: true },
      { text: `Her pressure's soft, high 90s to about 100.`, key: true },
      { text: `She has crackles at the bases and went on 2 liters overnight. She slept in her recliner at home the last two nights.`, key: true },
      { text: `Echo was done at six-ten. Nobody's read it yet.`, key: true },
      { text: `The protocol says go up on the dilt if she's over 110. I didn't get to it before report.`, key: false },
      { text: `She runs a book club. She's reading something about lighthouses.`, key: false },
    ],
    vitals(s, P) { return { T: 36.8, HR: gloHR(P) + jit(s, 1) * 3, SBP: gloSBP(P) + jit(s, 2) * 2, DBP: Math.round(62 - P.hf * 6), RR: Math.round(21 + P.hf * 7), SpO2: Math.round(95 - P.hf * 7), O2: P.hf >= 1 ? '6 L nasal cannula' : '2 L nasal cannula', pain: 0 }; },
    assess: {
      general: (s, P) => (P.hf >= 1 ? `Bolt upright, gripping the bed rails, talking two or three words at a time.` : `Propped up on three pillows, fanning herself with a book. "I can't lie flat. I tried."`),
      resp: (s, P) => { P.lungs = true; P.k.resp = s.t; return P.hf >= 1 ? `RR ${Math.round(21 + P.hf * 7)}, labored. Crackles halfway up both lungs. Pink frothy edge to her cough.` : P.hf >= .6 ? `RR ${Math.round(21 + P.hf * 7)}. Crackles a third of the way up both sides, more than report described.` : `RR ${Math.round(21 + P.hf * 7)}. Fine crackles at both bases. Can't lie flat.`; },
      cardiac: (s, P, A) => { P.k.card = s.t; const v = A.vitals('601'); return `Apical ${v.HR}, irregularly irregular. BP ${v.SBP}/${v.DBP}. Neck veins distended at 45 degrees. 2+ pitting edema to mid-shin. Cool hands.`; },
      neuro: () => `Alert, oriented. Anxious. "I can feel it pounding in my throat."`,
      pain: () => `Denies chest pain. Chest feels "fluttery."`,
      skin: () => `Pale, cool hands. IV sites clean, diltiazem running in the left forearm.`,
      gi: () => `Nauseous at the smell of breakfast. Ate two bites.`,
    },
    interventions: [
      { id: 'strip', label: 'Look at her monitor strip', cost: 1, run(s, P, A) { P.stripSeen = true; P.k.stripAt = s.t; A.judge('601-strip', 'assess', 1, `You looked at Mrs. Mendes's rhythm yourself.`, `Atrial fibrillation: irregularly irregular, no P waves. The number on the monitor is a rate; the strip tells you whether the drip is doing anything.`, '601'); return `Atrial fibrillation, irregularly irregular, no P waves, ventricular rate ${gloHR(P)}. Narrow QRS. No pauses.`; } },
      { id: 'echo', label: 'Read the echo report', cost: 2, avail: (s, P) => s.t >= 15 && !P.echoSeen, run(s, P, A) { P.echoSeen = true; A.judge('601-echo', 'assess', 2, `You read Mrs. Mendes's echo as soon as it was available.`, `A new result can change the whole plan. An ejection fraction of 25% means reduced-EF heart failure, and that changes which rate-control drug is safe.`, '601'); return `Preliminary: LVEF 25%. Severe global left ventricular hypokinesis. Moderate mitral regurgitation. Dilated left atrium. "Findings consistent with a cardiomyopathy, possibly rate-related."`; } },
      { id: 'situp', label: 'High Fowler\'s, legs down, oxygen titrated', cost: 2, avail: (s, P) => P.hf >= .6 && !P.sat, run(s, P, A) { P.sat = true; A.judge('601-position', 'safety', 1, `You positioned Mrs. Mendes to breathe.`, `Sitting up with legs down pools fluid away from the lungs. It buys time; it doesn't fix why she's wet.`, '601'); P.hf = Math.max(0, P.hf - .08); return `Head of bed straight up, legs dangling, oxygen up to keep her at 92%. She takes a slower breath.`; } },
      { id: 'reassess', label: 'Reassess her heart rate, pressure and lungs', cost: 3, avail: (s, P) => P.amioAt !== null && !P.reassessed && s.t - P.amioAt >= 30, run(s, P, A) { P.reassessed = true; A.judge('601-reassess', 'judgment', 2, `You reassessed Mrs. Mendes after the medication change.`, `Did it work? Rate down, pressure holding, lungs drier. That's what the next call and the next nurse need to hear.`, '601'); return `Apical ${gloHR(P)}, still irregular but slower. BP ${gloSBP(P)}/62. Crackles only at the bases now. Commode hat: 650 mL since the furosemide.`; } },
    ],
    meds: [
      {
        id: '601-dilt', name: 'Diltiazem infusion', dose: '10 mg/h', doseNow: (s, P) => (!P.diltOn ? `stopped ${P.stoppedAt !== null ? clock(P.stoppedAt) : ''}`.trim() : `${P.dilt} mg/h`), route: 'IV', freq: 'Continuous; titrate per order', prn: true, infusion: true,
        block: (s, P) => (!P.diltOn ? `Stopped at ${clock(P.stoppedAt)}.` : null),
        param: 'Titrate by 2.5 mg/h every 15 min for HR over 110; hold for SBP under 90',
        checks: (s, P, A) => { const v = A.vitals('601'); return [{ label: 'Heart rate', value: `${v.HR}, AF`, ok: v.HR <= 110 }, { label: 'Blood pressure', value: `${v.SBP}/${v.DBP}`, ok: v.SBP >= 90 }, { label: 'Echo', value: P.echoSeen ? 'LVEF 25%: reduced-EF heart failure' : s.t >= 15 ? 'Resulted, not read' : 'Pending', ok: P.echoSeen ? false : null }, { label: 'Current rate', value: `${P.dilt} mg/h`, ok: null }]; },
        doses: [{ id: 1, label: 'Increase by 2.5 mg/h, per the titration order' }, { id: 2, label: 'Leave it at the current rate' }, { id: 3, label: 'Stop the infusion and call the provider' }],
        give(s, P, A, dose) {
          const v = A.vitals('601');
          if (dose === 3) {
            P.diltOn = false; P.stoppedAt = s.t;
            if (P.echoSeen || P.stopOrder) A.judge('601-stop', 'meds', 2, `You stopped Mrs. Mendes's diltiazem.`, `Diltiazem weakens how hard the heart squeezes. With an EF of 25% and crackles, more of it makes the heart failure worse. Stop, call, and ask for a rate-control drug that's safe in heart failure.`, '601');
            else if (v.SBP < 90) A.judge('601-stop', 'meds', 1, `You stopped the diltiazem for an SBP under 90.`, `The order's hold parameter. Then call.`, '601');
            else A.judge('601-stop', 'judgment', 0, `You stopped the diltiazem without a reason you could name yet.`, `Stopping a rate-control drip with a heart rate of ${v.HR} needs a reason and a call. Read the echo first.`, '601');
            return `Diltiazem infusion stopped at the pump. Line capped. Rate ${gloHR(P)}.`;
          }
          if (dose === 2) { A.judge('601-hold-rate', 'judgment', P.echoSeen ? -1 : 0, `You left the diltiazem at ${P.dilt} mg/h.`, P.echoSeen ? `With an EF of 25%, the question isn't more or less diltiazem; it's whether she should be on it at all. That's a call.` : `Waiting is reasonable for a minute, but the order says titrate for HR over 110, and the echo is back. Read it and decide.`, '601'); return `No change. Still ${P.dilt} mg/h.`; }
          P.dilt = Math.min(15, P.dilt + 2.5); P.upTitrated += 1; P.hf = Math.min(2, P.hf + .22); P.hr = Math.max(112, P.hr - 6);
          A.judge('601-up', 'meds', P.echoSeen ? -3 : -1, `You increased Mrs. Mendes's diltiazem to ${P.dilt} mg/h.`, P.echoSeen ? `Her echo showed an EF of 25%. Diltiazem depresses contractility; in reduced-EF heart failure it worsens the failure and drops the pressure. The titration order was written before the echo.` : `The order allowed it, but the echo had resulted and wasn't read. In heart failure with a low EF, diltiazem makes things worse.`, '601');
          return `Diltiazem up to ${P.dilt} mg/h. Rate ${gloHR(P)} a few minutes later. BP ${gloSBP(P)}.`;
        },
      },
      {
        id: '601-amio', name: 'Amiodarone', dose: '150 mg over 10 min, then 1 mg/min', route: 'IV', freq: 'Once, now (new order)', prn: true, available: (s, P) => P.stopOrder,
        block: (s, P) => (P.amioAt !== null ? 'Started at ' + clock(P.amioAt) + '.' : null),
        checks: (s, P) => [{ label: 'Diltiazem', value: P.diltOn ? 'Still running' : 'Stopped', ok: !P.diltOn }, { label: 'QTc', value: '448 ms', ok: true }, { label: 'Anticoagulation', value: 'Apixaban since last night. AF over 48 h: amiodarone can convert her; cardiology aware, TEE if she does', ok: null }, { label: 'Line', value: 'Dedicated IV, in-line filter', ok: true }],
        give(s, P, A) { P.amioAt = s.t; if (P.diltOn) A.judge('601-amio-dilt', 'meds', -1, `You started amiodarone with the diltiazem still running.`, `The order was to switch, not to add. Two rate-control drugs together can drop her pressure and her rate too far.`, '601'); else A.judge('601-amio', 'meds', 1, `You started amiodarone after stopping the diltiazem.`, `Amiodarone controls the rate without weakening the heart. Bolus over 10 minutes, then the infusion, on its own line.`, '601'); return `Amiodarone 150 mg over 10 minutes on the pump, then 1 mg/min. In-line filter. Monitor on.`; },
      },
      {
        id: '601-lasix', name: 'Furosemide', dose: '40 mg', route: 'IV', freq: 'Once, now (new order)', prn: true, available: (s, P) => P.stopOrder,
        block: (s, P) => (P.lasixAt !== null ? 'Given at ' + clock(P.lasixAt) + '.' : null),
        checks: () => [{ label: 'Potassium', value: '4.1', ok: true }, { label: 'Lungs', value: 'Crackles', ok: true }],
        give(s, P, A) { P.lasixAt = s.t; A.judge('601-lasix', 'meds', 1, `You gave Mrs. Mendes's IV furosemide.`, `Diuresis takes the fluid off her lungs. Strict I&O, and watch her potassium and pressure.`, '601'); return `Furosemide 40 mg IV push over 2 minutes. Commode with urine hat at the bedside. Strict I&O.`; },
      },
      { id: '601-apix', name: 'Apixaban', dose: '5 mg', route: 'PO', freq: 'Twice daily', due: 120, checks: () => [{ label: 'Bleeding signs', value: 'None', ok: true }, { label: 'Creatinine', value: '0.9', ok: true }], give: () => `Apixaban 5 mg given with a sip of water.`, hold(s, P, A) { A.judge('601-apix-hold', 'meds', -1, `You held Mrs. Mendes's anticoagulant without a reason.`, `New AF carries a stroke risk, and a possible cardioversion needs anticoagulation behind it.`, '601'); return 'Held.'; } },
    ],
    talk: (s, P) => (P.icu ? null : P.hf >= 1 ? 'glo_sob' : P.k.talked ? 'glo_after' : 'glo_talk'),
    sbar: {
      items(s, P, A) {
        const v = A.vitals('601');
        return [
          { id: 'ef', label: 'Echo this morning: LVEF 25%, severe global hypokinesis', key: true, need: P.echoSeen, lock: 'Read the echo' },
          { id: 'rate', label: `AF, rate ${v.HR}, on diltiazem ${P.dilt} mg/h`, key: true, need: true },
          { id: 'bp', label: `BP ${v.SBP}/${v.DBP}`, key: true, need: true },
          { id: 'lungs', label: P.hf >= .6 ? 'Crackles a third of the way up, can\'t lie flat, on 2 L' : 'Crackles at both bases, can\'t lie flat, on 2 L', key: true, need: P.lungs, lock: 'Listen to her lungs' },
          { id: 'jvd', label: 'Neck veins distended, 2+ edema to mid-shin', key: false, need: P.k.card !== undefined, lock: 'Assess her heart' },
          { id: 'bnp', label: 'BNP 1,840 overnight', key: false, need: true },
          { id: 'book', label: 'Runs a book club at her church', key: false, need: true },
        ];
      },
      requests: [
        { id: 'switch', label: 'Her EF is 25% and she\'s wet on a diltiazem drip. Can we stop the diltiazem, switch to something safe in heart failure, and diurese her?' },
        { id: 'up', label: 'Her rate is still over 110. Okay to keep titrating the diltiazem up?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'up') { A.judge('601-sbar-up', 'judgment', P.echoSeen ? -2 : -1, `You asked to keep titrating Mrs. Mendes's diltiazem.`, `The order allows it, but something new came back this morning. Read the echo before asking for more of a negative inotrope.`, '601'); return P.echoSeen ? `Wait. What was her echo? If her EF's low, we don't go up on diltiazem.` : `Has her echo been read? Look before you titrate.`; }
        if (!picked.includes('ef')) return `What's changed since the ED? Has anyone read the echo?`;
        P.called = true;
        if (!P.stopOrder) { P.stopOrder = true; A.addOrder('601', `Discontinue diltiazem infusion. Amiodarone 150 mg IV over 10 minutes, then 1 mg/min for 6 hours, then 0.5 mg/min. Furosemide 40 mg IV now. Cardiology consult. Daily weights, strict I&O, BMP in the afternoon.`); }
        A.judge('601-sbar', 'comm', picked.includes('lungs') ? 2 : 1, `You called about Mrs. Mendes's echo and her heart failure on diltiazem.`, `New information changes a protocol order. An EF of 25% plus crackles on a non-dihydropyridine calcium channel blocker is a call, not a titration.`, '601');
        return picked.includes('lungs') ? `Good catch. Stop the diltiazem now. Amiodarone bolus and drip, 40 of IV Lasix. Cardiology will see her this morning. Call me if her pressure drops under 90.` : `Stop the diltiazem; amiodarone and IV Lasix are in. How are her lungs?`;
      },
    },
    scene: (s, P) => ({ tele: true, teleWave: 'afib', iv: 'running', o2: P.hf >= 1 ? 6 : 2, tray: 'full', flowers: true, empty: P.icu, emptyText: 'Bed stripped. Transferred to the CCU on BiPAP.' }),
    clues: () => ({ flowers: `Carnations from the book club. The card: "Get well soon! We're saving the lighthouse book for you. — Thursday Ladies."`, tray: `Oatmeal, a banana, coffee. Two bites gone. The salt packet has been put back unopened.` }),
    rig: (s, P) => ({ rr: Math.round(21 + P.hf * 7), spo2: Math.round(95 - P.hf * 7), hr: gloHR(P), anxious: .5, lean: P.hf >= 1 ? .6 : 0 }),
    status: (s, P) => (P.icu ? 'gone' : P.hf >= 1 || gloSBP(P) < 90 ? 'urgent' : P.diltOn ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Flash pulmonary edema, CCU', text: `Her lungs filled while the diltiazem kept running${P.upTitrated ? ' and going up' : ''}. The echo showing an EF of 25% had been in the chart since 07:15.` };
      if (!P.diltOn && P.amioAt !== null && P.lasixAt !== null) return { tone: P.stoppedAt <= 120 ? 'good' : 'mixed', title: P.stoppedAt <= 120 ? 'Switched off diltiazem early, rate coming down' : 'Switched, but late', text: `Diltiazem off at ${clock(P.stoppedAt)}, amiodarone running, furosemide in.${P.reassessed ? ' Rate and lungs reassessed and better.' : ''}${P.upTitrated ? ' She got more diltiazem first, and her lungs paid for it.' : ''}` };
      if (!P.diltOn) return { tone: 'mixed', title: 'Diltiazem stopped, plan unfinished', text: `The drip came off${P.called ? ', but the new orders weren\'t all carried out' : ' without a call, so nothing replaced it'}. Her rate and her lungs are the next nurse's problem.` };
      return { tone: 'bad', title: 'Still on diltiazem with an EF of 25%', text: `${P.hf >= 1 ? 'Short of breath on 6 L at handoff.' : 'Wetter than at 07:00.'} The echo was in the chart all morning.` };
    },
  };

  /* ---------- 603 Raymond Okoro: post-PCI via the right femoral; a retroperitoneal bleed with a clean groin ---------- */
  const rayHR = (P) => Math.round(76 + P.bleed * 45 - (P.fluids ? 6 : 0));
  const raySBP = (P) => Math.round(132 - P.bleed * 46 + (P.fluids ? 8 : 0));
  const rayPain = (P) => (P.bleed > .12 ? Math.min(9, Math.round(3 + P.bleed * 5)) : 1);
  const raymond = {
    id: '603', room: '603', name: 'Raymond Okoro', short: 'Mr. Okoro', age: 59, sex: 'M', mrn: '00417736',
    look: { skin: '#6A4330', shade: '#4F301F', lip: '#4D2A20', blush: '#9C5642', iris: '#24160D', head: { w: 60, h: 63, jaw: .7 }, eye: 9.6,
      hair: { style: 'balding', color: '#3A3430' }, brow: { w: 4.2, color: '#26201C' }, body: { w: 86, cloth: 'gown' }, extras: ['mustache'], smile: .4,
      lines: { calm: `When can I get up? I've been on my back since four in the morning.`, pain: `It's my back. Low down, on the right. It's getting worse.`, drowsy: `I feel kind of washed out.`, anxious: `Something's not right. I can feel it.`, none: `He doesn't answer.` } },
    bio: `Drives a city bus, 26 years, the 51 line. Coaches his granddaughter's under-10 soccer team on Saturdays. Married to Adaeze for 34 years.`,
    dx: `Inferior STEMI, stent to the RCA overnight`, reason: `Inferior ST-elevation MI at 03:40. Emergent cath: drug-eluting stent to the right coronary artery through the right femoral artery. Sheath removed 06:15, manual pressure.`,
    hx: [`Hypertension, high cholesterol`, `Smoked until 2019`, `No prior cardiac history`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `94 kg`,
    lines: [`PIV 20g left forearm: saline lock`, `Right femoral puncture site: pressure dressing (sheath out 06:15)`], mobility: `Bed rest, flat, head of bed 30° or less, right leg straight until 12:15`, diet: `Cardiac`,
    init: { bleed: 0, upright: false, checks: [], lastCheck: -15, called: null, fluids: false, ivs: false, cbcSeen: false, morphAt: null, painAsked: false, dismissed: false, icu: false, tica: null, ticaClar: false },
    nightVitals: { T: 36.9, HR: 78, SBP: 134, DBP: 80, RR: 16, SpO2: 97, O2: 'Room air', pain: 1 },
    labs: [
      { name: 'Hemoglobin', val: 13.8, unit: 'g/dL', ref: '13.5–17.5', flag: '', t: -120 },
      { name: 'Platelets', val: 246, unit: 'K/µL', ref: '150–400', flag: '', t: -120 },
      { name: 'hs-Troponin I (peak)', val: '18,600', unit: 'ng/L', ref: 'under 34 (men)', flag: 'H', t: -60 },
      { name: 'Creatinine', val: 1.0, unit: 'mg/dL', ref: '0.7–1.3', flag: '', t: -120 },
    ],
    orders: [
      { t: -50, text: `Post-PCI, right femoral access, manual hemostasis 06:15. Bed rest 6 hours: flat, head of bed 30° or less, right leg straight. Groin site, distal pulses and vital signs every 15 minutes ×4, every 30 minutes ×2, then every hour. Call for bleeding, hematoma, new back or flank pain, loss of distal pulse, SBP under 100 or HR over 100.` },
      { t: -50, text: `Aspirin 81 mg PO daily. Ticagrelor 90 mg PO twice daily (09:00, 21:00). Atorvastatin 80 mg nightly. Metoprolol tartrate 12.5 mg PO twice daily, hold for HR under 60 or SBP under 100. CBC at 09:00.` },
      { t: -50, text: `Morphine 2 mg IV every 2 hours as needed, severe pain. Nitroglycerin 0.4 mg SL as needed, chest pain, hold for SBP under 100.` },
    ],
    notes: [
      { t: -40, author: 'Cath lab RN', text: `RCA DES ×1. Heparin given in lab. 6 Fr right femoral sheath pulled 06:15, 20 minutes manual pressure, hemostasis achieved. Site soft, no hematoma, DP and PT pulses 2+. Some difficulty with access: two arterial sticks, the first above the inguinal ligament.` },
    ],
    io: { intake: `IV fluids and contrast in the lab`, output: `Voided 400 mL in a urinal at 06:30` },
    report: [
      { text: `Raymond Okoro, 59, inferior STEMI. Stent to the RCA at four-thirty this morning, through the right groin.`, key: false },
      { text: `Sheath came out at six-fifteen. Site's soft, pulses are good. His fifteen-minute checks are almost done; then it's every thirty.`, key: true },
      { text: `The cath note says it took them two sticks, and the first one was high.`, key: true },
      { text: `He's flat until twelve-fifteen and he hates it. He keeps trying to sit up.`, key: true },
      { text: `He drives the 51 bus. He'll tell you about every stop if you let him.`, key: false },
      { text: `Ticagrelor and aspirin at nine.`, key: false },
    ],
    vitals(s, P) { return { T: 36.9, HR: rayHR(P) + jit(s, 3), SBP: raySBP(P) + jit(s, 4) * 2, DBP: Math.round(80 - P.bleed * 22), RR: 16 + (P.bleed > .8 ? 4 : 0), SpO2: 97, O2: 'Room air', pain: rayPain(P) }; },
    assess: {
      general: (s, P) => (P.bleed > .9 ? `Pale and sweaty, restless, keeps shifting his hips. "I feel washed out."` : P.bleed > .3 ? `Lying flat, rubbing at the right side of his lower back, wincing.` : P.upright ? `Sitting on the edge of the bed, which he isn't supposed to be.` : `Flat, bored, telling Benny about the 51 bus.`),
      resp: () => `Unlabored. Clear.`,
      cardiac: (s, P, A) => { P.k.card = s.t; const v = A.vitals('603'); return `HR ${v.HR}, regular${v.HR > 100 ? ', sinus tachycardia on the monitor' : ''}. BP ${v.SBP}/${v.DBP}. ${P.bleed > .6 ? 'Cool, clammy hands. Capillary refill 3 seconds.' : 'Warm, cap refill under 2 seconds.'}`; },
      neuro: (s, P) => (P.bleed > 1 ? `Oriented but slow to answer. Anxious.` : `Alert, oriented, chatty.`),
      pain: (s, P) => { P.painAsked = true; P.k.pain = s.t; return P.bleed > .12 ? `Low back pain, right side, ${rayPain(P)}/10, "deep, like a toothache in my back." Started about ${clock(62)}. Not like his heart attack pain. No chest pain.` : `No chest pain. Back a little stiff from lying flat, 1/10.`; },
      skin: (s, P) => (P.bleed > .6 ? `Pale. Clammy. Right groin dressing dry.` : `Warm and dry. Right groin dressing dry.`),
      gi: (s, P) => (P.bleed > .5 ? `Abdomen soft, tender low on the right side and into the flank when you press deep. Bowel sounds present.` : `Soft, nontender. Bowel sounds present.`),
    },
    interventions: [
      {
        id: 'groin', label: 'Groin site, distal pulses and vital signs', cost: 4,
        run(s, P, A) {
          P.checks.push(s.t); P.lastCheck = s.t; const v = A.recordVitals('603', 'You'); P.k.groin = s.t;
          const late = s.t - (P.checks.length > 1 ? P.checks[P.checks.length - 2] : -15) > (s.t < 75 ? 40 : 75);
          if (P.checks.length === 1) A.judge('603-check', 'assess', late ? 0 : 1, late ? `You did Mr. Okoro's first post-sheath check late.` : `You kept Mr. Okoro's post-sheath checks on schedule.`, `After femoral access, the checks are scheduled because bleeding, hematoma and a lost pulse show up early. The groin is only part of it; the vital signs are the rest.`, '603');
          return `Dressing dry. Site soft, no hematoma, no bruit. Right DP and PT pulses 2+, foot warm. HR ${v.HR}, BP ${v.SBP}/${v.DBP}.${P.bleed > .3 ? ` He winces when you press above the dressing, toward his hip. "It's my back, not my leg."` : ''}`;
        },
      },
      { id: 'urinal', label: 'Bring a urinal, give him privacy, keep him flat', cost: 2, avail: (s, P) => !P.urinal, run(s, P, A) { P.urinal = true; return `Urinal, curtain closed, bed flat, call light in his hand. "Fine. But I'm telling Adaeze you made me do this."`; } },
      { id: 'ivs', label: 'Second large-bore IV, type and screen sent', cost: 6, avail: (s, P) => P.called !== null && !P.ivs, run(s, P, A) { P.ivs = true; A.judge('603-ivs', 'safety', 1, `You placed a second large-bore IV and sent the type and screen.`, `If he needs blood or fluid fast, the access and the crossmatch need to already be there.`, '603'); return `18g in the right antecubital. Type and screen to the lab. Stat CBC drawn.`; } },
      { id: 'reassess', label: 'Reassess him after the fluid bolus', cost: 3, avail: (s, P) => P.fluids && !P.reassessed && s.t - P.fluidAt >= 20, run(s, P, A) { P.reassessed = true; A.judge('603-reassess', 'judgment', 2, `You reassessed Mr. Okoro after the bolus.`, `Did the fluid hold his pressure? A bleed that's still going will out-run a bolus, and the team needs to know before the CT.`, '603'); return `HR ${rayHR(P)}, BP ${raySBP(P)}/70. Back pain ${rayPain(P)}/10. ${P.bleed < 1 ? 'Holding.' : 'Drifting down again.'}`; } },
    ],
    meds: [
      { id: '603-asa', name: 'Aspirin', dose: '81 mg', route: 'PO', freq: 'Daily', due: 120, checks: () => [{ label: 'Stent', value: 'Drug-eluting, RCA, this morning', ok: true }], give: () => `Aspirin 81 mg swallowed with a sip of water.`, hold(s, P, A) { A.judge('603-asa-hold', 'meds', -2, `You held Mr. Okoro's aspirin on the morning of his stent.`, `Dual antiplatelet therapy keeps a fresh stent open. Stopping it is a cardiologist's decision, made against the risk of stent thrombosis.`, '603'); return 'Held.'; } },
      {
        id: '603-tica', name: 'Ticagrelor', dose: '90 mg', route: 'PO', freq: 'Twice daily', due: 120,
        checks: (s, P, A) => { const v = A.vitals('603'); return [{ label: 'Stent', value: 'Drug-eluting, RCA, this morning', ok: true }, { label: 'Bleeding concern', value: P.bleed > .3 ? 'New back pain, HR and BP trending' : 'None found', ok: P.bleed > .3 ? (P.called !== null) : true }, { label: 'Vitals', value: `HR ${v.HR}, BP ${v.SBP}/${v.DBP}`, ok: v.SBP >= 100 && v.HR <= 100 }]; },
        give(s, P, A) { P.tica = 'given'; if (P.bleed > .3 && P.called === null) A.judge('603-tica', 'meds', -1, `You gave ticagrelor with signs of a bleed you hadn't reported.`, `Usually right to give it: stopping it risks the stent. But a possible bleed is information the cardiologist needs before the next dose, not after.`, '603'); else if (P.called !== null) A.judge('603-tica', 'meds', 1, `You gave ticagrelor after the cardiologist weighed the bleed against the stent.`, `With a fresh drug-eluting stent, losing antiplatelet coverage risks stent thrombosis, another MI. That decision belongs to the cardiologist, with the bleed on the table.`, '603'); return `Ticagrelor 90 mg given.`; },
        hold(s, P, A) { P.tica = 'held'; A.judge('603-tica-hold', 'meds', P.called !== null ? -1 : -2, `You held Mr. Okoro's ticagrelor yourself.`, `A fresh stent without antiplatelet therapy can clot off within hours. If you're worried about bleeding, call; don't decide it alone.`, '603'); return 'Held.'; },
      },
      { id: '603-meto', name: 'Metoprolol tartrate', dose: '12.5 mg', route: 'PO', freq: 'Twice daily', due: 120, param: 'Hold for HR under 60 or SBP under 100',
        checks: (s, P, A) => { const v = A.vitals('603'); return [{ label: 'Heart rate', value: `${v.HR}`, ok: v.HR >= 60 }, { label: 'Blood pressure', value: `${v.SBP}/${v.DBP}`, ok: v.SBP >= 100 }]; },
        give(s, P, A) { const v = A.vitals('603'); if (v.SBP < 100) A.judge('603-meto', 'meds', -2, `You gave metoprolol with an SBP of ${v.SBP}.`, `The hold parameter was met. In a patient who may be bleeding, a beta-blocker also hides the tachycardia that's telling you.`, '603'); return `Metoprolol 12.5 mg given.`; },
        hold(s, P, A) { const v = A.vitals('603'); A.judge('603-meto-hold', 'meds', v.SBP < 100 ? 1 : 0, v.SBP < 100 ? `You held metoprolol for an SBP under 100.` : `You held metoprolol with vitals above the parameters.`, v.SBP < 100 ? `Parameter met. A held cardiac med is something to report.` : `Defensible if you're worried about a bleed; say so when you call.`, '603'); return 'Held.'; } },
      {
        id: '603-morph', name: 'Morphine', dose: '2 mg', route: 'IV', freq: 'Every 2 h as needed, severe pain', prn: true,
        checks: (s, P, A) => { const v = A.vitals('603'); return [{ label: 'Pain', value: P.painAsked ? `${rayPain(P)}/10, low back, new` : 'Not assessed', ok: P.painAsked ? null : false }, { label: 'Vitals', value: `HR ${v.HR}, BP ${v.SBP}/${v.DBP}`, ok: v.SBP >= 100 }]; },
        give(s, P, A) { P.morphAt = s.t; if (P.bleed > .25 && P.called === null) A.judge('603-morph', 'judgment', -2, `You treated Mr. Okoro's new back pain with morphine without working it up.`, `New back or flank pain after femoral access, with a climbing heart rate, is a retroperitoneal bleed until proven otherwise. Morphine treats the symptom and drops the pressure; it doesn't stop the bleed.`, '603'); return `Morphine 2 mg IV given.`; },
      },
      { id: '603-ns', name: 'Normal saline bolus', dose: '500 mL', route: 'IV', freq: 'Once, now (new order)', prn: true, available: (s, P) => P.called !== null, block: (s, P) => (P.fluids ? 'Given at ' + clock(P.fluidAt) + '.' : null), checks: () => [{ label: 'Lungs', value: 'Clear', ok: true }], give(s, P, A) { P.fluids = true; P.fluidAt = s.t; return `500 mL normal saline wide open through the 18g.`; } },
    ],
    talk: (s, P) => (P.icu ? null : P.bleed > .25 && !P.k.talkPain ? 'ray_pain' : P.k.talked ? 'ray_after' : 'ray_talk'),
    sbar: {
      items(s, P, A) {
        const v = A.vitals('603'), first = (P.vit.find((x) => x.t >= 0) || P.vit[0]), hgb = (P.labs.filter((l) => l.name === 'Hemoglobin').pop() || { val: 11.4 }).val;
        return [
          { id: 'back', label: `New right low back pain, ${rayPain(P)}/10, since about ${clock(62)}`, key: true, need: P.bleed > .12 && recent(s, P.k.pain, 60), lock: 'Assess his pain' },
          { id: 'hr', label: `HR ${v.HR}, up from 78 at 07:00`, key: true, need: P.bleed > .12 },
          { id: 'bp', label: `BP ${v.SBP}/${v.DBP}, down from 134/80`, key: true, need: P.bleed > .12 },
          { id: 'groin', label: 'Groin site soft, no hematoma, pulses 2+', key: true, need: P.k.groin !== undefined, lock: 'Check his groin site' },
          { id: 'stick', label: 'High first arterial stick in the cath lab', key: true, need: true },
          { id: 'hgb', label: P.cbcSeen ? `Hemoglobin ${hgb} at 09:00, from 13.8 at 05:00` : 'CBC due at 09:00', key: P.cbcSeen, need: true },
          { id: 'bus', label: 'Drives the 51 bus', key: false, need: true },
        ];
      },
      requests: [
        { id: 'rp', label: 'New back pain, rising heart rate and falling pressure after femoral access. I\'m worried about a retroperitoneal bleed. Can you see him, and can we get a stat CBC, type and screen, CT and fluids?' },
        { id: 'pain', label: 'His back hurts from lying flat. Can he have more morphine, or get up early?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'pain') { A.judge('603-sbar-pain', 'judgment', -2, `You called Mr. Okoro's back pain positional.`, `Back pain plus a climbing heart rate after a femoral stick isn't from the mattress until a CT says so.`, '603'); return `Lying flat is miserable, but what are his vitals doing? Back pain after a femoral stick makes me nervous.`; }
        if (!picked.includes('back') && !picked.includes('hr') && !picked.includes('bp')) return `Okay. Site okay? Vitals stable? Call me if anything changes.`;
        if (P.called === null) { P.called = s.t; A.addOrder('603', `Stat CBC, type and screen, PT/INR. Second large-bore IV. Normal saline 500 mL bolus now. CT abdomen and pelvis without contrast, stat. Keep flat. Hold metoprolol. Continue aspirin and ticagrelor: cardiology aware. Transfuse for hemoglobin under 8 or hemodynamic instability.`); }
        const early = s.t <= 120;
        A.judge('603-sbar', 'comm', early && picked.includes('groin') ? 2 : 1, `You called about a possible retroperitoneal bleed in Mr. Okoro.`, `A retroperitoneal bleed hides behind a clean groin. Back or flank pain, tachycardia and hypotension after femoral access are the signs; the earlier the call, the smaller the bleed.`, '603');
        return picked.includes('groin') ? `A clean groin doesn't rule it out, especially with a high stick. I'm coming up. Bolus, labs, CT; keep him flat. We continue the antiplatelets for now; the stent is the bigger risk.` : `I'm on my way. What does the groin look like?`;
      },
    },
    scene: (s, P) => ({ tele: true, iv: P.fluids && s.t - P.fluidAt < 40 ? 'running' : 'lock', tray: 'full', groin: true, empty: P.icu, emptyText: 'Bed stripped. To interventional radiology, then the CCU.' }),
    clues: (s, P) => ({ groin: P.bleed > .3 ? `The groin dressing is dry and the site is soft. No hematoma you can see. He keeps reaching around to rub the right side of his back.` : `Pressure dressing over the right groin. Dry, soft underneath. Right leg straight.`, tray: `A breakfast tray he can't reach lying flat. Eggs, toast, decaf.` }),
    rig: (s, P) => ({ hr: rayHR(P), sbp: raySBP(P), pain: rayPain(P), pale: clamp(P.bleed * .7, 0, 1), sweat: P.bleed > .8 ? .6 : 0 }),
    status: (s, P) => (P.icu ? 'gone' : raySBP(P) < 100 || rayHR(P) > 100 ? 'urgent' : P.bleed > .2 ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Retroperitoneal bleed, shock', text: `Hypotensive and tachycardic${P.called !== null ? ' when the call finally went in' : ' before anyone called'}. Two units of blood and a covered stent in interventional radiology. The groin looked clean the whole time.` };
      if (P.called !== null) { const early = P.called <= 120; return { tone: early ? 'good' : 'mixed', title: early ? 'Retroperitoneal bleed, caught early' : 'Retroperitoneal bleed, caught late', text: `CT showed a ${early ? 'small' : 'moderate'} right retroperitoneal hematoma. ${early ? 'Fluids and watching; no transfusion.' : 'One unit of blood.'} The stent stayed protected.${P.morphAt !== null && P.morphAt < P.called ? ' Morphine went in before anyone looked for why.' : ''}${P.upright ? ' He sat up early, too.' : ''}` }; }
      if (P.bleed > .2) return { tone: 'bad', title: 'Bleeding at handoff, unreported', text: `HR ${rayHR(P)}, BP ${raySBP(P)}, low back pain ${rayPain(P)}/10. The next nurse inherits a retroperitoneal bleed.` };
      return { tone: 'good', title: 'Stable after his stent', text: 'Checks done, site quiet.' };
    },
  };

  /* ---------- 605 Dolores Price: PE on heparin, day 5. aPTT 104, and platelets 98 from 230 ---------- */
  const NOMO = `Weight-based heparin nomogram (70 kg). aPTT goal 60–85. Under 45: bolus 40 units/kg, increase 2 units/kg/h. 45–59: increase 1 unit/kg/h. 60–85: no change. 86–100: decrease 2 units/kg/h. Over 100: hold 1 hour, then decrease 3 units/kg/h. aPTT 6 hours after any change.`;
  const dolores = {
    id: '605', room: '605', name: 'Dolores Price', short: 'Mrs. Price', age: 74, sex: 'F', mrn: '00288140',
    look: { skin: '#EFD3BE', shade: '#D2AE96', lip: '#B0675F', blush: '#E79B8C', iris: '#5C7A6A', head: { w: 55, h: 60, jaw: .15 }, eye: 9.2,
      hair: { style: 'curls', color: '#D9D4CF' }, brow: { w: 2.8, color: '#B8AFA8' }, body: { w: 78, cloth: 'gown', cardigan: '#7A93B0' }, extras: ['pearls', 'wrinkles'], smile: .45,
      lines: { calm: `Is it time for my crossword? Do you know an eight-letter word for "steadfast"?`, pain: `My left foot. It's gone cold and it hurts.`, anxious: `Something's wrong with my foot.`, drowsy: `I'm a bit sleepy, dear.`, none: `She doesn't answer.` } },
    bio: `Retired high-school chemistry teacher. Keeps a crossword going at all times. Her neighbor Bernadette feeds her cat, Mendeleev.`,
    dx: `Pulmonary embolism, heparin day 5`, reason: `Bilateral pulmonary emboli after a long car trip to her sister's. On a heparin infusion since admission; transition to apixaban planned.`,
    hx: [`Hypertension`, `Osteoarthritis`, `Never had heparin before this admission`],
    allergies: `Sulfa (rash)`, code: `Full code`, weight: `70 kg`,
    lines: [`PIV 20g right forearm: heparin infusion`, `Single-lumen PICC left upper arm: locked (difficult access)`], mobility: `Up in the room with assist`, diet: `Regular`,
    // Once the heparin stops or the HIT orders come in, the chart says so everywhere it's shown.
    live: (s, P) => {
      if (P.stopped === null && !P.called) return null;
      const o = {}, hep = P.stopped !== null ? `heparin stopped ${clock(P.stopped)}` : `heparin still running`;
      o.dx = P.called ? `Pulmonary embolism; suspected HIT (${hep})` : `Pulmonary embolism; ${hep}`;
      o.reason = `Bilateral pulmonary emboli after a long car trip to her sister's. Heparin infusion from admission to day 5, ${P.stopped !== null ? `stopped at ${clock(P.stopped)}` : 'now being stopped'} for suspected heparin-induced thrombocytopenia${P.argaAt !== null ? `; argatroban since ${clock(P.argaAt)}` : P.called ? '; argatroban ordered' : ''}.`;
      o.lines = [`PIV 20g right forearm: ${P.argaAt !== null ? `argatroban infusion (heparin off since ${clock(P.stopped !== null ? P.stopped : P.argaAt)})` : P.stopped !== null ? `heparin stopped ${clock(P.stopped)}, line clamped` : 'heparin infusion'}`, `Single-lumen PICC left upper arm: locked${P.called || P.flushFixed ? ', saline flushes only' : ''}`];
      if (P.called) o.allergies = `Heparin (suspected HIT), Sulfa (rash)`;
      return o;
    },
    init: { rate: 18, hepOn: true, holdUntil: null, adjusted: null, labsRead: false, stopped: null, called: false, argaAt: null, foot: 0, footSeen: false, gone: false, nomo: null },
    nightVitals: { T: 36.9, HR: 86, SBP: 136, DBP: 78, RR: 18, SpO2: 95, O2: 'Room air', pain: 0 },
    labs: [
      { name: 'Platelets', val: 230, unit: 'K/µL', ref: '150–400', flag: '', t: -5800 },
      { name: 'Platelets', val: 214, unit: 'K/µL', ref: '150–400', flag: '', t: -2900 },
      { name: 'aPTT', val: 72, unit: 'sec', ref: 'goal 60–85 on heparin', flag: '', t: -1500 },
      { name: 'Platelets', val: 98, unit: 'K/µL', ref: '150–400', flag: 'L', t: -60 },
      { name: 'Hemoglobin', val: 12.1, unit: 'g/dL', ref: '12.0–15.5', flag: '', t: -60 },
      { name: 'aPTT', val: 104, unit: 'sec', ref: 'goal 60–85 on heparin', flag: 'H', t: -60 },
    ],
    orders: [
      { t: -5800, text: `Heparin infusion per weight-based nomogram, started at 18 units/kg/h (1,260 units/h). ${NOMO}` },
      { t: -5800, text: `CBC every other day while on heparin. PICC lumen maintenance: flush with heparin 10 units/mL, 3 mL every 8 hours per legacy protocol.` },
      { t: -1500, text: `Plan: transition to apixaban when platelets and aPTT are stable. Case management for discharge.` },
    ],
    notes: [
      { t: -70, author: 'Lena, night RN', text: `Comfortable, no shortness of breath, ambulated to the bathroom. 06:00 labs drawn. Lab called the aPTT as critical right before report; not yet addressed.` },
    ],
    io: { intake: `Eating well`, output: `Voiding` },
    report: [
      { text: `Dolores Price, 74, PEs, day five on the heparin drip. She feels great. Wants to go home.`, key: false },
      { text: `Her six a.m. aPTT came back high. Lab called it right before report. I didn't get to adjust it.`, key: true },
      { text: `The heparin's at 18 units per kilo.`, key: true },
      { text: `I haven't looked at the rest of her morning labs.`, key: true },
      { text: `She's doing the crossword in pen. Don't help her, she gets offended.`, key: false },
      { text: `Her PICC lumen still has heparin flushes ordered.`, key: false },
    ],
    vitals(s, P) { return { T: 36.9, HR: 84 + Math.round(P.foot * 14) + jit(s, 5), SBP: 136 + jit(s, 6) * 2, DBP: 78, RR: 18, SpO2: 95, O2: 'Room air', pain: P.foot >= .5 ? Math.min(8, Math.round(3 + P.foot * 5)) : 0 }; },
    assess: {
      general: (s, P) => (P.foot >= .5 ? `Sitting up, rubbing her left foot, frowning.` : `Sitting up in a cardigan, crossword in her lap, pen behind her ear.`),
      resp: () => `Unlabored on room air. Clear.`,
      cardiac: (s, P, A) => `HR ${A.vitals('605').HR}, regular. Right leg: warm, pulses 2+. Left leg: ${P.foot >= .5 ? 'foot cool and pale below the ankle, dorsalis pedis and posterior tibial pulses faint, slow capillary refill' : 'warm, pulses 2+'}.`,
      neuro: () => `Alert, oriented, sharp. Correcting your spelling.`,
      pain: (s, P) => (P.foot >= .5 ? `Left foot pain, ${Math.min(8, Math.round(3 + P.foot * 5))}/10, "cold and pins and needles."` : `Denies pain.`),
      skin: (s, P) => { P.k.skin = s.t; return `A few small bruises on her forearms and abdomen from injections. ${P.foot >= .5 ? 'Left foot pale and cool.' : 'No petechiae. No bleeding from IV sites.'}`; },
      gi: () => `Eating well. Soft, nontender.`,
    },
    interventions: [
      { id: 'labs', label: 'Review her morning CBC and aPTT, with the trend', cost: 2, avail: (s, P) => !P.labsRead, run(s, P, A) { P.labsRead = true; A.judge('605-labs', 'assess', 2, `You reviewed Mrs. Price's full morning labs, with the trend.`, `The critical value is the one they called; the platelet count is the one they didn't. A fall of more than half, on day 5 of heparin, is the classic timing for heparin-induced thrombocytopenia.`, '605'); return `aPTT 104 (goal 60–85). Platelets 98, down from 214 two days ago and 230 on admission: a 57% drop. Hemoglobin 12.1, stable. Day 5 of heparin; she'd never had heparin before.`; } },
      { id: 'pf4', label: 'Send the PF4/heparin antibody (ordered)', cost: 2, avail: (s, P) => P.called && !P.pf4 && !P.gone, run(s, P, A) { P.pf4 = s.t; A.log('605', 'PF4/heparin antibody drawn and sent.', 'act'); return `Drawn from a fresh stick and sent. The lab says the result takes a day; treat as HIT until then.`; } },
      { id: 'duplex', label: 'Request the bilateral leg duplex (ordered)', cost: 1, avail: (s, P) => P.called && !P.duplex && !P.gone, run(s, P, A) { P.duplex = s.t; return `Vascular lab has her on the list${P.footSeen ? ', moved up for the cold left foot' : ''}. They'll come to the bedside.`; } },
      { id: 'reassess', label: 'Recheck her left foot after the change', cost: 2, avail: (s, P) => P.footSeen && P.stopped !== null && !P.reassessed && s.t - Math.max(P.stopped, P.argaAt || 0) >= 30, run(s, P, A) { P.reassessed = true; A.judge('605-reassess', 'judgment', 1, `You rechecked Mrs. Price's foot after the change in treatment.`, `Arterial clots in HIT can take a limb. Compare pulses, color, temperature and pain against your last look, and say exactly what changed.`, '605'); return P.argaAt !== null ? `Left foot a little warmer, pulses still faint but present, pain ${Math.max(2, Math.round(3 + P.foot * 4))}/10.` : `Unchanged: cool, faint pulses. She needs the non-heparin anticoagulant running.`; } },
    ],
    meds: [
      {
        id: '605-hep', name: 'Heparin infusion', dose: '18 units/kg/h (1,260 units/h)', doseNow: (s, P) => (P.stopped !== null ? `stopped ${clock(P.stopped)}` : P.holdUntil !== null && s.t < P.holdUntil ? `on hold until ${clock(P.holdUntil)}` : `${P.rate} units/kg/h`), route: 'IV', freq: 'Continuous, per nomogram', prn: true, infusion: true,
        block: (s, P) => (P.stopped !== null ? `Stopped at ${clock(P.stopped)}.` : P.holdUntil !== null && s.t < P.holdUntil ? `On hold until ${clock(P.holdUntil)}, then ${P.rate} units/kg/h.` : null),
        param: 'aPTT goal 60–85; adjust per nomogram',
        checks: (s, P) => [{ label: 'aPTT 06:00', value: '104 seconds (goal 60–85)', ok: false }, { label: 'Platelets', value: P.labsRead ? '98, down from 230: a 57% drop on day 5' : 'Not reviewed', ok: P.labsRead ? false : null }, { label: 'Current rate', value: `${P.rate} units/kg/h`, ok: null }, { label: 'Nomogram', value: 'aPTT over 100: hold 1 hour, then decrease 3 units/kg/h', ok: null }],
        doses: [{ id: 1, label: 'Hold 1 hour, then restart 3 units/kg/h lower (15 units/kg/h, 1,050 units/h)' }, { id: 2, label: 'Decrease by 2 units/kg/h (16 units/kg/h)' }, { id: 3, label: 'No change' }, { id: 4, label: 'Bolus 40 units/kg and increase by 2 units/kg/h' }, { id: 5, label: 'Stop the heparin: platelets have fallen by more than half (then call the provider)' }],
        give(s, P, A, dose) {
          if (dose === 5) { P.stopped = s.t; P.hepOn = false; A.judge('605-stop', 'meds', P.labsRead ? 2 : 0, P.labsRead ? `You stopped Mrs. Price's heparin for suspected HIT.` : `You stopped the heparin without reviewing her platelets yourself.`, P.labsRead ? `A platelet drop of more than half, 5 to 10 days into heparin, is HIT until proven otherwise. Stop all heparin (flushes too), then call for a non-heparin anticoagulant: she still has a PE.` : `The right move, but know why. Read the CBC.`, '605'); return `Heparin stopped at the pump. Line clamped and labeled. She still has a PE: call ${A.c.staff[A.def('605').provider] ? A.c.staff[A.def('605').provider].name : 'the provider'} now for a non-heparin anticoagulant.`; }
          P.nomo = dose;
          if (dose === 1) { P.rate = 15; P.holdUntil = s.t + 60; A.judge('605-nomo', 'meds', P.labsRead ? -1 : 1, P.labsRead ? `You followed the nomogram for Mrs. Price's aPTT after seeing her platelets fall.` : `You adjusted Mrs. Price's heparin correctly for an aPTT of 104.`, P.labsRead ? `The math was right, but a 57% platelet drop on day 5 means the heparin itself is the problem. Titrating keeps it running.` : `Over 100: hold an hour, decrease 3 units/kg/h, recheck in 6 hours. Then read the rest of her labs.`, '605'); return `Heparin on hold for 1 hour. Pump programmed to restart at 1,050 units/h at ${clock(s.t + 60)}. aPTT due ${clock(s.t + 420)}.`; }
          if (dose === 2) { P.rate = 16; A.judge('605-nomo', 'meds', -1, `You decreased Mrs. Price's heparin by 2 units/kg/h.`, `That's the step for an aPTT of 86 to 100. At 104, the nomogram says hold an hour and decrease by 3.`, '605'); return `Heparin decreased to 1,120 units/h.`; }
          if (dose === 3) { A.judge('605-nomo', 'meds', -2, `You left Mrs. Price's heparin unchanged with an aPTT of 104.`, `Supratherapeutic heparin in a 74-year-old is a bleeding risk. The nomogram has an answer for 104.`, '605'); return `No change.`; }
          P.rate = 20; A.judge('605-nomo', 'meds', -3, `You bolused and increased Mrs. Price's heparin with an aPTT of 104.`, `That's the step for an aPTT under 45. Read the value against the nomogram before touching the pump.`, '605'); return `Bolus given, rate up to 1,400 units/h.`;
        },
      },
      {
        id: '605-arga', name: 'Argatroban infusion', dose: '2 mcg/kg/min (start)', route: 'IV', freq: 'Continuous, titrate to aPTT 1.5–3 × baseline (new order)', prn: true, infusion: true, available: (s, P) => P.called,
        block: (s, P) => (P.argaAt !== null ? 'Started at ' + clock(P.argaAt) + '.' : null),
        checks: (s, P) => [{ label: 'Heparin', value: P.stopped !== null ? `Stopped at ${clock(P.stopped)}` : 'Still running', ok: P.stopped !== null }, { label: 'Liver function', value: 'Normal', ok: true }, { label: 'Heparin flushes', value: P.flushFixed || P.called ? 'Changed to saline' : 'Still ordered', ok: !!(P.flushFixed || P.called) }],
        give(s, P, A) { P.argaAt = s.t; if (P.stopped === null) { A.judge('605-arga-hep', 'meds', -2, `You started argatroban with heparin still running.`, `Two anticoagulants at once is a bleeding risk, and the heparin is the cause of her clotting. Stop the heparin first.`, '605'); } else A.judge('605-arga', 'meds', 1, `You started argatroban after stopping the heparin.`, `She still has a PE and now a clotting disorder; she needs anticoagulation that isn't heparin.`, '605'); return `Argatroban started at 2 mcg/kg/min. aPTT in 2 hours.`; },
      },
      { id: '605-flush', name: 'Heparin lock flush', dose: '10 units/mL, 3 mL', route: 'IV', freq: 'Every 8 h', due: 60,
        // Discontinued with the HIT orders ("all heparin, including flushes"): it leaves the MAR and the task list.
        available: (s, P) => !P.called || s.meds['605-flush'].status !== 'due',
        checks: (s, P) => [{ label: 'Platelets', value: P.labsRead ? '98, down 57% on heparin' : 'Not reviewed', ok: P.labsRead ? false : null }],
        give(s, P, A) { P.flushGiven = true; if (P.labsRead || P.stopped !== null) A.judge('605-flush', 'meds', -2, `You flushed Mrs. Price's line with heparin after suspecting HIT.`, `In HIT, all heparin stops, including flushes and heparin-coated catheters. Flush with saline.`, '605'); return `Flushed with 3 mL heparin 10 units/mL.`; },
        hold(s, P, A) { P.flushFixed = true; A.judge('605-flush-hold', 'meds', P.labsRead || P.stopped !== null ? 1 : 0, `You held the heparin flush${P.labsRead ? ' and used saline' : ''}.`, P.labsRead ? `Right: no heparin of any kind once you suspect HIT.` : `Holding a flush needs a reason; saline works when there is one.`, '605'); return 'Held. Flushed with saline instead.'; } },
    ],
    talk: (s, P) => (P.gone ? null : P.foot >= .5 ? 'dol_foot' : P.k.talked ? 'dol_after' : 'dol_talk'),
    sbar: {
      items(s, P) {
        return [
          { id: 'plt', label: 'Platelets 98, down from 230 on admission (57%), day 5 of heparin', key: true, need: P.labsRead, lock: 'Review her CBC trend' },
          { id: 'aptt', label: 'aPTT 104 at 06:00', key: true, need: true },
          { id: 'stopped', label: P.stopped !== null ? `Heparin stopped at ${clock(P.stopped)}` : 'Heparin still running', key: P.stopped !== null, need: true },
          { id: 'foot', label: 'Left foot cool and pale, faint pulses, new pain', key: true, need: P.footSeen, lock: 'Not found' },
          { id: 'bruise', label: 'Small injection bruises, no bleeding', key: false, need: P.k.skin !== undefined, lock: 'Check her skin' },
          { id: 'cross', label: 'Does the crossword in pen', key: false, need: true },
        ];
      },
      requests: [
        { id: 'hit', label: 'Her platelets fell by more than half on day 5 of heparin. I\'m worried about HIT. Can we stop all heparin, send a HIT antibody, and start a non-heparin anticoagulant?' },
        { id: 'nomo', label: 'Her aPTT is 104. I\'ll follow the nomogram. Anything else?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (!picked.includes('plt')) { if (req === 'hit') return `What makes you think HIT? What are her platelets doing?`; A.judge('605-sbar-nomo', 'comm', 0, `You called about Mrs. Price's aPTT.`, `Fine, but the nomogram covers the aPTT. The thing worth a call is in the CBC.`, '605'); return `Follow the nomogram. What did her CBC show?`; }
        P.called = true; P.flushFixed = P.flushFixed || false;
        A.addOrder('605', `Discontinue all heparin, including flushes: flush with normal saline. Add heparin to the allergy list (suspected HIT). PF4/heparin antibody. Argatroban 2 mcg/kg/min, aPTT in 2 hours. No platelet transfusion. Bilateral lower extremity duplex.`, [/heparin/i]);
        A.judge('605-sbar', 'comm', req === 'hit' ? 2 : 1, `You called about suspected HIT in Mrs. Price.`, `Timing, a platelet drop of more than half, no other cause: a high-probability 4T score. HIT clots more than it bleeds, so she needs a different anticoagulant, not none.`, '605');
        return `Good catch. That's HIT until proven otherwise. ${P.stopped === null ? 'Stop the heparin now, flushes too. ' : ''}Argatroban, antibody, duplex. No platelets.${P.footSeen ? ' And I\'m calling vascular about that foot.' : ''}`;
      },
    },
    scene: (s, P) => ({ tele: true, iv: P.hepOn && (P.holdUntil === null || s.t >= P.holdUntil) && P.stopped === null ? 'running' : P.argaAt !== null ? 'running' : 'lock', tray: 'eaten', letter: true, empty: P.gone, emptyText: 'Bed stripped. Taken to interventional radiology for a clot in her leg artery.' }),
    clues: () => ({ letter: `The crossword, in pen. 14 across, "Steadfast," filled in: CONSTANT. In the margin, in shaky capitals: "PLATELETS?" She's a chemistry teacher; she read her own lab sheet.`, tray: `Breakfast, finished. Even the prunes.` }),
    rig: (s, P) => ({ pain: P.foot >= .5 ? Math.min(8, Math.round(3 + P.foot * 5)) : 0, anxious: P.foot >= .5 ? .5 : 0 }),
    status: (s, P) => (P.gone ? 'gone' : P.foot >= .5 ? 'urgent' : P.stopped === null ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.gone) return { tone: 'bad', title: 'HIT with an arterial clot', text: `The heparin kept running with her platelets at 98, and a clot blocked the artery to her left foot. Interventional radiology took her at ${clock(P.goneAt)}.` };
      if (P.stopped !== null && P.called && P.argaAt !== null) return { tone: P.footSeen ? 'mixed' : 'good', title: P.footSeen ? 'HIT caught, after a clot started' : 'HIT caught before it clotted', text: `Heparin off at ${clock(P.stopped)}, argatroban running, antibody sent.${P.footSeen ? ' Her left foot is being watched with vascular surgery.' : ''}${P.flushGiven && P.labsRead ? ' One heparin flush slipped through.' : ''}` };
      if (P.stopped !== null) return { tone: 'mixed', title: 'Heparin stopped, nothing replaced it', text: `${P.called ? 'The new orders weren\'t all started.' : 'No call, so no other anticoagulant.'} She still has a PE.` };
      if (P.nomo === 1) return { tone: 'mixed', title: 'Titrated by the book, HIT missed', text: `The aPTT step was right, but the heparin kept running with platelets at 98.` };
      return { tone: 'bad', title: 'Supratherapeutic heparin, HIT missed', text: `aPTT 104, never adjusted, and the platelet drop sat in the chart.` };
    },
  };

  /* ---------- 607 Theodore Lindqvist: syncope, QTc over 500, low K and Mg, citalopram 40 mg at 81 ---------- */
  const qtc = (P) => Math.round(452 + (4 - P.kv) * 45 + (2.1 - P.mg) * 45 + (P.cital ? 25 : 0) + (P.ond ? 15 : 0));
  const theo = {
    id: '607', room: '607', name: 'Theodore Lindqvist', short: 'Mr. Lindqvist', age: 81, sex: 'M', mrn: '00193357',
    look: { skin: '#EBC9AE', shade: '#CFA88C', lip: '#A9655B', blush: '#E2958A', iris: '#4E6E8E', head: { w: 56, h: 63, jaw: .5 }, eye: 9, hair: { style: 'balding', color: '#E1DDD8' }, brow: { w: 4, color: '#CFC9C2' }, body: { w: 78, cloth: 'flannel' }, extras: ['glasses', 'wrinkles'], glasses: '#2E2A28', smile: .35,
      lines: { calm: `I fainted in church. In front of the whole choir. Very dramatic of me.`, nausea: `My stomach's turning. Could I have something?`, dizzy: `The room just went sideways.`, anxious: `My heart did a funny flip.`, none: `He doesn't answer.` } },
    bio: `Retired clock repairman. Sings bass in the Lutheran church choir. Married to Ingrid for 55 years. Grows roses he names after composers.`,
    dx: `Syncope, prolonged QT`, reason: `Passed out in church yesterday. No injury. Admitted for telemetry; QTc 516 on this morning's ECG, potassium and magnesium low.`,
    hx: [`Depression, on citalopram`, `Mild heart failure, on furosemide`, `Chronic kidney disease stage 2`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `68 kg`,
    lines: [`PIV 20g left forearm: saline lock`], mobility: `Up with assist, fall precautions`, diet: `Cardiac`,
    init: { kv: 3.2, mg: 1.4, cital: false, citalHeld: false, ond: false, lasix: false, lasixHeld: false, kGiven: null, mgGiven: null, called: false, stripSeen: false, alarm: null, run: false, tors: 0, icu: false, ortho: false },
    nightVitals: { T: 36.6, HR: 64, SBP: 128, DBP: 70, RR: 16, SpO2: 96, O2: 'Room air', pain: 0 },
    labs: [
      { name: 'Potassium', val: 3.2, unit: 'mmol/L', ref: '3.5–5.0', flag: 'L', t: -60 },
      { name: 'Magnesium', val: 1.4, unit: 'mg/dL', ref: '1.7–2.2', flag: 'L', t: -60 },
      { name: 'Creatinine', val: 1.2, unit: 'mg/dL', ref: '0.7–1.3', flag: '', t: -60 },
      { name: 'ECG 06:30', val: 'Sinus rhythm 64, QTc 516 ms', unit: '', ref: 'QTc under 450', flag: 'H', t: -30 },
    ],
    orders: [
      { t: -900, text: `Continuous telemetry. Notify provider for QTc over 500 ms, runs of ventricular tachycardia, or symptomatic arrhythmia. Fall precautions. Orthostatic vital signs daily.` },
      { t: -900, text: `Electrolyte replacement protocol (nurse-initiated, creatinine under 2): K under 4.0, give KCl 40 mEq PO and recheck in 4 hours. Mg under 2.0, give magnesium sulfate 2 g IV over 1 hour. Notify provider of K under 3.0 or Mg under 1.2.` },
      { t: -900, text: `Home meds continued: citalopram 40 mg PO daily (09:00). Furosemide 40 mg PO daily (09:00): hold for K under 3.5, notify. Ondansetron 4 mg IV every 6 hours as needed, nausea.` },
    ],
    notes: [
      { t: -30, author: 'Lena, night RN', text: `Slept well. 06:30 ECG done. Lab drew BMP and Mg at 06:00. Monitor tech reported a couple of PVCs overnight.` },
    ],
    io: { intake: `Poor appetite yesterday`, output: `Voiding` },
    report: [
      { text: `Theodore Lindqvist, 81, passed out in church yesterday. Here on tele for the workup.`, key: false },
      { text: `His ECG this morning had a QTc over 500.`, key: true },
      { text: `His potassium and magnesium came back a little low.`, key: true },
      { text: `He takes citalopram and Lasix at home. Both are due at nine.`, key: true },
      { text: `A few PVCs on the monitor overnight.`, key: true },
      { text: `He sings bass in his church choir. He'll sing for you if you ask.`, key: false },
    ],
    vitals(s, P) { return { T: 36.6, HR: 64 + (P.run ? 8 : 0) + jit(s, 7), SBP: 128 + jit(s, 8) * 2, DBP: 70, RR: 16, SpO2: 96, O2: 'Room air', pain: 0 }; },
    assess: {
      general: (s, P) => (P.run ? `Pale, holding the rail. "That was a funny one. The room went grey."` : `Sitting in the chair by the window in a flannel shirt, humming.`),
      resp: () => `Unlabored. Faint crackles at the very bases.`,
      cardiac: (s, P, A) => { P.k.card = s.t; return `HR ${A.vitals('607').HR}, regular with occasional extra beats. BP ${A.vitals('607').SBP}/70. Trace ankle edema.`; },
      neuro: () => `Alert, oriented ×4. Remembers singing, then waking up on the floor of the choir loft. No warning, no chest pain, no palpitations he noticed.`,
      pain: () => `Denies pain.`,
      skin: () => `Small bruise on his left hip from the fall.`,
      gi: (s, P) => (s.t >= 100 ? `Nauseous since breakfast. Ate a few bites.` : `Appetite poor. Soft, nontender.`),
    },
    interventions: [
      { id: 'strip', label: 'Look at his monitor strip and measure the QT', cost: 2, run(s, P, A) { P.stripSeen = true; P.k.stripAt = s.t; A.judge('607-strip', 'assess', 1, `You measured Mr. Lindqvist's QT yourself.`, `A long QT is the setup for torsades de pointes. The number on this morning's ECG is a snapshot; the strip tells you whether it's getting longer.`, '607'); return `Sinus rhythm ${A.vitals('607').HR}. QTc about ${qtc(P)} ms. ${P.run ? 'Frequent PVCs, some landing on the T wave, and a short run of polymorphic beats earlier.' : 'Occasional PVCs.'}`; } },
      { id: 'sips', label: 'Ginger ale in small sips, cool cloth, sit him up', cost: 3, avail: (s, P) => s.t >= 100 && !P.sips && !P.icu, run(s, P, A) { P.sips = true; A.judge('607-sips', 'judgment', 1, `You eased Mr. Lindqvist's nausea without another QT drug.`, `With a QTc over 500, comfort measures come first. Ask the provider before any antiemetic.`, '607'); return `He sips the ginger ale, the cloth on his neck. "Better. Ingrid swears by this." He hums a bar of something.`; } },
      { id: 'ortho', label: 'Orthostatic vital signs, with a second person', cost: 5, avail: (s, P) => !P.ortho, run(s, P, A) { P.ortho = true; A.judge('607-ortho', 'assess', 1, `You checked Mr. Lindqvist's orthostatics safely.`, `Part of any syncope workup, done with help and a chair behind him.`, '607'); return `Lying 128/70, HR 64. Standing at 3 minutes 120/68, HR 70. No orthostatic drop; no symptoms. Points away from dehydration, toward his heart.`; } },
    ],
    meds: [
      { id: '607-kcl', name: 'Potassium chloride (protocol)', dose: '40 mEq', route: 'PO', freq: 'Per electrolyte protocol: K under 4.0', prn: true, block: (s, P) => (P.kGiven !== null ? 'Given at ' + clock(P.kGiven) + '.' : null), checks: (s, P) => [{ label: 'Potassium', value: '3.2 at 06:00', ok: true }, { label: 'Creatinine', value: '1.2 (protocol allows under 2)', ok: true }], give(s, P, A) { P.kGiven = s.t; A.judge('607-kcl', 'meds', s.t <= 90 ? 2 : 1, `You started the electrolyte protocol for Mr. Lindqvist's potassium${s.t <= 90 ? ' early' : ''}.`, `A protocol is an order you can act on. Low potassium lengthens the QT; with a QTc over 500, replacing it is part of preventing torsades.`, '607'); return `KCl 40 mEq taken with water, sitting up. Recheck at ${clock(s.t + 240)}.`; } },
      { id: '607-mag', name: 'Magnesium sulfate (protocol)', dose: '2 g over 1 hour', route: 'IV', freq: 'Per electrolyte protocol: Mg under 2.0', prn: true, block: (s, P) => (P.mgGiven !== null ? 'Started at ' + clock(P.mgGiven) + '.' : null), checks: () => [{ label: 'Magnesium', value: '1.4 at 06:00', ok: true }, { label: 'Creatinine', value: '1.2', ok: true }], give(s, P, A) { P.mgGiven = s.t; A.judge('607-mag', 'meds', s.t <= 90 ? 2 : 1, `You started magnesium for Mr. Lindqvist.`, `Magnesium is the first-line treatment for torsades and part of preventing it. With a long QT, replace it before the rhythm asks.`, '607'); return `Magnesium sulfate 2 g IV over 1 hour on the pump.`; } },
      {
        id: '607-cital', name: 'Citalopram', dose: '40 mg', route: 'PO', freq: 'Daily', due: 120,
        checks: (s, P) => [{ label: 'QTc', value: `${P.stripSeen ? qtc(P) : 516} ms`, ok: false }, { label: 'Age', value: '81: the FDA maximum over age 60 is 20 mg a day, for QT risk', ok: false }],
        give(s, P, A) { P.cital = true; A.judge('607-cital', 'meds', -3, `You gave Mr. Lindqvist citalopram 40 mg with a QTc over 500.`, `Citalopram lengthens the QT in a dose-dependent way. Over 60, the maximum is 20 mg; with a QTc over 500 it should be held and clarified.`, '607'); return `Citalopram 40 mg given.`; },
        hold(s, P, A) { P.citalHeld = true; A.judge('607-cital-hold', 'meds', 2, `You held Mr. Lindqvist's citalopram and flagged it.`, `QTc over 500 plus a QT-prolonging drug above its age limit: hold it and get it changed. Missing one dose of an SSRI does no harm.`, '607'); return 'Held: QTc over 500. Clarify with provider.'; },
      },
      {
        id: '607-lasix', name: 'Furosemide', dose: '40 mg', route: 'PO', freq: 'Daily', due: 120, param: 'Hold for K under 3.5, notify',
        checks: (s, P) => [{ label: 'Potassium', value: '3.2 at 06:00 (low)', ok: false }, { label: 'KCl given', value: P.kGiven !== null ? `Yes, ${clock(P.kGiven)}` : 'Not yet', ok: P.kGiven !== null }],
        give(s, P, A) { P.lasix = true; A.judge('607-lasix', 'meds', -2, `You gave furosemide with a potassium of 3.2.`, `The order said hold for K under 3.5. A loop diuretic wastes more potassium and lengthens the QT further.`, '607'); return `Furosemide 40 mg given.`; },
        hold(s, P, A) { P.lasixHeld = true; A.judge('607-lasix-hold', 'meds', 1, `You held furosemide for a potassium under 3.5.`, `Parameter met. Notify the provider; he still has heart failure, so it's a plan, not just a hold.`, '607'); return 'Held: K 3.2. Notify the provider.'; },
      },
      {
        id: '607-ond', name: 'Ondansetron', dose: '4 mg', route: 'IV', freq: 'Every 6 h as needed, nausea', prn: true, available: (s, P) => !P.called,
        checks: (s, P) => [{ label: 'Nausea', value: s.t >= 100 ? 'Since breakfast' : 'None', ok: s.t >= 100 }, { label: 'QTc', value: `${P.stripSeen ? qtc(P) : 516} ms`, ok: false }],
        give(s, P, A) { P.ond = true; A.judge('607-ond', 'meds', -2, `You gave ondansetron with a QTc over 500.`, `Ondansetron lengthens the QT too. Ask for a different plan: small sips, ginger ale, and whatever the provider thinks is safest.`, '607'); return `Ondansetron 4 mg IV given.`; },
      },
    ],
    talk: (s, P) => (P.icu ? null : P.k.talked ? 'theo_after' : 'theo_talk'),
    sbar: {
      items(s, P) {
        return [
          { id: 'qtc', label: `QTc ${P.stripSeen ? qtc(P) : 516} ms`, key: true, need: true },
          { id: 'lytes', label: 'K 3.2, Mg 1.4 this morning', key: true, need: true },
          { id: 'protocol', label: P.kGiven !== null || P.mgGiven !== null ? 'Replacement started per protocol' : 'Electrolyte protocol not started', key: P.kGiven !== null || P.mgGiven !== null, need: true },
          { id: 'cital', label: 'Citalopram 40 mg daily, age 81', key: true, need: true },
          { id: 'run', label: 'Run of polymorphic VT on the monitor, felt lightheaded', key: true, need: P.run, lock: 'None seen' },
          { id: 'lasix', label: P.lasixHeld ? 'Furosemide held for K 3.2' : 'Furosemide due at 09:00', key: P.lasixHeld, need: true },
          { id: 'choir', label: 'Sings bass in his church choir', key: false, need: true },
        ];
      },
      requests: [
        { id: 'qt', label: 'QTc over 500 with low K and Mg. I\'ve started the protocol. Can we stop or lower his citalopram, avoid other QT drugs, and decide about his furosemide?' },
        { id: 'ond', label: 'He\'s nauseated. Okay to give the ondansetron?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'ond') { A.judge('607-sbar-ond', 'judgment', -1, `You asked to give ondansetron to a patient with a QTc over 500.`, `Another QT-prolonging drug. Ask for an alternative instead.`, '607'); return `Not with that QT. Small sips and ginger ale for now. Has his potassium been replaced?`; }
        if (!picked.includes('qtc')) return `Okay. What's his QTc doing?`;
        P.called = true;
        A.addOrder('607', `Stop citalopram; restart at 10 mg daily tomorrow if the QTc is under 470. Discontinue ondansetron. Hold furosemide today. Repeat K and Mg at 13:00; keep K over 4 and Mg over 2. Repeat ECG this afternoon. Avoid QT-prolonging medications.`);
        const both = P.kGiven !== null && P.mgGiven !== null;
        A.judge('607-sbar', 'comm', both && picked.includes('cital') ? 2 : 1, `You called about Mr. Lindqvist's long QT.`, `QTc over 500 is a call by his own orders. Bring the fixable parts: electrolytes, and every drug on his list that lengthens the QT.`, '607');
        return both ? `Thank you, and good that you started the protocol. Stop the citalopram; I'll talk to his psychiatrist about a safer dose. No ondansetron. Hold the Lasix today.` : `Start the electrolyte protocol now: potassium and magnesium. Stop the citalopram, no ondansetron, hold the Lasix.`;
      },
    },
    scene: (s, P) => ({ tele: true, teleWave: P.run && s.t - P.runAt < 30 ? 'tors' : 'normal', iv: P.mgGiven !== null && s.t - P.mgGiven < 60 ? 'running' : 'lock', tray: s.t >= 100 ? 'full' : 'eaten', fallPrec: true, flowers: true, empty: P.icu, emptyText: 'Bed stripped. Transferred to the CCU after torsades.' }),
    clues: () => ({ flowers: `A rose cutting in a paper cup, labeled "Brahms." A card in careful handwriting: "Come home, Theo. The choir is lost without its bass. — Ingrid"`, alarm: `Bed alarm on. Call light clipped to his shirt.`, tray: `Rye toast and coffee, barely touched.` }),
    rig: (s, P) => ({ nausea: s.t >= 100 && !P.ond, dizzy: P.run && s.t - P.runAt < 20, anxious: P.run ? .4 : 0 }),
    status: (s, P) => (P.icu ? 'gone' : P.run || qtc(P) >= 540 ? 'urgent' : qtc(P) >= 500 ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Torsades de pointes, CCU', text: `Torsades at ${clock(P.icuAt)}, shocked once, magnesium in the code. QTc ${qtc(P)}, potassium and magnesium low all morning${P.cital ? ', and the citalopram went in at nine' : ''}.` };
      const fixed = P.kGiven !== null && P.mgGiven !== null;
      if (fixed && !P.cital && !P.ond && P.called) return { tone: 'good', title: 'QT risk lowered', text: `Potassium and magnesium replaced by protocol, citalopram stopped, no ondansetron. QTc ${qtc(P)} by noon and falling.` };
      if (fixed) return { tone: 'mixed', title: 'Electrolytes replaced, drugs still a problem', text: `${P.cital ? 'Citalopram 40 mg went in. ' : ''}${P.ond ? 'Ondansetron went in. ' : ''}${!P.called ? 'The provider never heard about a QTc over 500.' : ''}` };
      return { tone: 'bad', title: 'Long QT, nothing changed', text: `QTc ${qtc(P)}, K and Mg never replaced${P.cital ? ', and citalopram 40 mg on top' : ''}. The protocol was his nurse's to start.` };
    },
  };

  /* ---------- dialogs ---------- */
  const dialogs = {
    glo_talk: { who: '601', text: `"It's going so fast. I can feel it in my throat." She grips your wrist. "Is it going to stop? My husband's heart stopped."`, choices: [
      { label: `That sounds frightening, especially after your husband. Your heart is beating fast and irregularly, but it's pumping, and we're watching every beat. Let me listen and see what it needs.`, next: 'glo_a', fx: (s, A) => { s.p['601'].k.talked = s.t; A.judge('601-talk', 'comm', 1, `You acknowledged Mrs. Mendes's fear and told her what was happening.`, `Name the fear, give a true and simple explanation, then act. Anxiety pushes the rate up too.`, '601'); } },
      { label: `You're fine. A-fib isn't dangerous.`, next: 'glo_b', fx: (s, A) => { s.p['601'].k.talked = s.t; A.judge('601-talk', 'comm', -1, `You told Mrs. Mendes atrial fibrillation isn't dangerous.`, `False reassurance. Fast AF strains the heart and raises stroke risk; she deserves an honest answer and a plan.`, '601'); } },
    ] },
    glo_a: { who: '601', text: `She loosens her grip. "Okay. Okay. My son calls at nine every night. Will I be able to talk to him?" She sounds out of breath saying it.` },
    glo_b: { who: '601', text: `"Then why does it feel like this?" She turns away and fans herself with the book.` },
    glo_after: { who: '601', text: `"The lighthouse keeper's wife is the best character. Everyone thinks it's him." She holds up the book. Her breathing's a little easier when she talks about it.` },
    glo_sob: { who: '601', text: `She can't finish a sentence. "Can't — breathe. Sit me — up." Her lips are dusky.` },

    ray_talk: { who: '603', text: `"I've got to pee, and I'm not doing it in a jug lying on my back like a baby. Just let me sit on the edge for one minute."`, choices: [
      { label: `I get it, it's miserable. The artery in your groin was opened a few hours ago; sitting up bends it and can start it bleeding. Here's a urinal, I'll close the curtain and give you privacy. Flat until 12:15, then we'll get you up.`, next: 'ray_a', fx: (s, A) => { s.p['603'].k.talked = s.t; s.p['603'].urinal = true; A.judge('603-flat', 'safety', 2, `You kept Mr. Okoro flat and helped him void safely.`, `Bed rest after femoral access protects the puncture while it seals. Explain why, solve the actual problem, and give him a time.`, '603'); } },
      { label: `Sure, just for a minute, since it's been a couple of hours and the site looks dry. I'll help you sit up on the edge of the bed slowly, you can use the urinal there, and then it's straight back down flat for the rest of your bed rest. Deal?`, next: 'ray_b', fx: (s, A) => { const P = s.p['603']; P.k.talked = s.t; P.upright = true; A.judge('603-flat', 'safety', -2, `You let Mr. Okoro sit up two hours after his sheath came out.`, `Flexing the hip on a fresh femoral puncture can start a bleed. The order said flat until 12:15.`, '603'); } },
      { label: `Doctor's orders. Sorry.`, next: 'ray_c', fx: (s, A) => { s.p['603'].k.talked = s.t; A.judge('603-flat', 'comm', 0, `You enforced bed rest without explaining it.`, `Right rule, weak delivery. He'll try again the minute you leave unless he knows why.`, '603'); } },
    ] },
    ray_a: { who: '603', text: `He grumbles, but takes the urinal. "Twelve-fifteen. I'm holding you to that." Then, quieter: "Adaeze says I'm a terrible patient."` },
    ray_b: { who: '603', text: `He swings his legs over with a grunt. "Ah. That's better." The groin dressing creases as he sits.` },
    ray_c: { who: '603', text: `"Everybody keeps saying that." He eyes the edge of the bed.` },
    ray_pain: { who: '603', text: `"My back's killing me. Low, right side, deep. It's from lying flat, right? Can I just get the morphine?"`, choices: [
      { label: `Maybe, but back pain after a groin catheter can also mean bleeding where we can't see it. Let me check your pain, your vitals and your belly first, then I'll decide what to give you.`, next: 'ray_d', fx: (s, A) => { const P = s.p['603']; P.k.talkPain = s.t; P.painAsked = true; P.k.pain = s.t; A.judge('603-painq', 'assess', 2, `You assessed Mr. Okoro's new back pain before treating it.`, `New back or flank pain after femoral access is a red flag for a retroperitoneal bleed. Assess before you medicate.`, '603'); } },
      { label: `Yes, it's from lying flat. I'll get you some morphine.`, next: 'ray_e', fx: (s, A) => { const P = s.p['603']; P.k.talkPain = s.t; P.dismissed = true; A.judge('603-painq', 'judgment', -2, `You attributed Mr. Okoro's new back pain to positioning.`, `The easy explanation is the dangerous one after a femoral stick. Check vitals and his abdomen first.`, '603'); } },
    ] },
    ray_d: { who: '603', text: `"Bleeding? Inside?" He goes quiet. "It's not like the heart attack. It's deeper. And I feel kind of washed out, now that you mention it."` },
    ray_e: { who: '603', text: `"Thank you." He shifts his hips again, wincing.` },
    ray_after: { who: '603', text: `"Number 51 goes past this hospital, you know. Stop 14. I used to wave at the ambulances." He smiles. "Never thought I'd be in one."` },

    dol_talk: { who: '605', text: `"When can I switch to the pills? These bruises are spreading." She shows you her forearm. "And I read my lab sheet, dear. My platelets are half what they were. I taught chemistry for thirty-one years; I know what half means."`, choices: [
      { label: `You're right to notice that, and I'm glad you said it. A drop like that on heparin can be a reaction to the heparin itself. I'm going to look at the trend and talk to your doctor now.`, next: 'dol_a', fx: (s, A) => { const P = s.p['605']; P.k.talked = s.t; P.k.told = true; A.judge('605-talk', 'comm', 2, `You took Mrs. Price's observation seriously.`, `Patients notice things. "My platelets are half what they were" is assessment data, from someone who reads her own labs.`, '605'); } },
      { label: `Don't worry about the numbers. That's our job.`, next: 'dol_b', fx: (s, A) => { const P = s.p['605']; P.k.talked = s.t; A.judge('605-talk', 'comm', -2, `You brushed off Mrs. Price's concern about her platelets.`, `She was right. Dismissing a patient's observation is how a clue gets lost.`, '605'); } },
    ] },
    dol_a: { who: '605', text: `"Thank you." She clicks her pen. "Mendeleev would be proud. My cat, not the chemist. Well. Both."` },
    dol_b: { who: '605', text: `"Mm." She writes something in the crossword margin and doesn't look up.` },
    dol_after: { who: '605', text: `"Eight letters, 'watchful.' Vigilant." She fills it in. "That's you today."` },
    dol_foot: { who: '605', text: `"My left foot's gone cold. Pins and needles, and it hurts." She pulls back the blanket. The foot is paler than the other one.` },

    theo_talk: { who: '607', text: `"I fainted in church. Fell off the choir riser in the middle of the Kyrie." He chuckles. "Ingrid says I'm grumpy lately, so I've been taking two of my happy pills. Is that why?"`, choices: [
      { label: `That may be part of it. Your antidepressant can affect your heart rhythm, especially at a higher dose. Can you tell me exactly what you take, and how much?`, next: 'theo_a', fx: (s, A) => { const P = s.p['607']; P.k.talked = s.t; P.k.twoPills = true; A.judge('607-talk', 'assess', 2, `You took a medication history from Mr. Lindqvist.`, `He doubled his own citalopram at home. Asking how patients actually take their meds finds what the list doesn't.`, '607'); } },
      { label: `Probably just dehydration. Drink some water.`, next: 'theo_b', fx: (s, A) => { s.p['607'].k.talked = s.t; A.judge('607-talk', 'judgment', -1, `You put Mr. Lindqvist's syncope down to dehydration.`, `Syncope with no warning and a long QT is cardiac until proven otherwise.`, '607'); } },
    ] },
    theo_a: { who: '607', text: `"Twenty milligrams of the citalo-something. Twice a day now. And the water pill." He rubs his chest. "My heart does a little flip now and then. Like a missed note."` },
    theo_b: { who: '607', text: `"Water. Right." He takes a polite sip and goes back to humming.` },
    theo_after: { who: '607', text: `"Would you like to hear the bass line from the Kyrie?" He sings four bars, very quietly. It's lovely.` },
  };

  /* ---------- events ---------- */
  const A0 = (s) => Object.keys(s.p).every((id) => s.p[id].seenAt === null);
  const events = [
    { id: 'aide-hi', when: (s) => s.t >= 3, run(s, A) { A.msg({ from: 'benny', text: `Morning. I've got 601 to 607 with you. 603 wants to sit up already. Want me to start vitals?`, replies: [{ label: 'Open tasks for Benny', act: 'delegate' }] }); } },
    { id: 'lab-aptt', when: (s) => s.t >= 6, run(s, A) { A.msg({ from: 'lab', pid: '605', text: `Calling a critical: 605 Price, aPTT 104 seconds, drawn 06:00. Read back?`, replies: [{ label: 'Read back: 605 Price, aPTT 104', act: 'readback' }] }); } },
    { id: 'echo', when: (s) => s.t >= 15, run(s, A) { A.addLab('601', { name: 'Echocardiogram (prelim)', val: 'LVEF 25%, severe global hypokinesis', unit: '', ref: 'LVEF 55–70%', flag: 'A' }); A.msg({ from: 'echo', pid: '601', text: `Prelim read on 601 Mendes's echo is in the chart.` }); } },
    { id: 'ray-up', when: (s) => s.t >= 22 && !s.p['603'].k.talked, run(s, A) { A.msg({ from: 'benny', pid: '603', text: `603 needs to pee and is trying to swing his legs over. He wants to sit on the commode. Okay?`, replies: [{ label: 'No: bring a urinal, keep him flat, I\'ll come explain', act: 'ray-urinal' }, { label: 'Help him onto the commode, quickly', act: 'ray-commode' }, { label: 'Raise his head to 60 so he can eat too', act: 'ray-hob' }] }); } },
    { id: 'tele-607', when: (s) => s.t >= 60, run(s, A) { s.p['607'].alarm = s.t; A.msg({ from: 'jae', pid: '607', text: `607's been alarming a lot. Couplets, and a few runs of three or four. Honestly it's probably artifact; he's been moving around in the chair.`, replies: [{ label: 'Print me his strip; I\'m going to look at him', act: 'tele-look' }, { label: 'Probably artifact. Fix his leads when you can.', act: 'tele-art' }] }); } },
    { id: 'ray-back', when: (s) => s.t >= 85 && s.p['603'].called === null && !s.p['603'].icu, run(s, A) { A.msg({ from: 'benny', pid: '603', text: `603 says his lower back is killing him and wants the morphine. His heart rate's been alarming at 100.`, replies: [{ label: 'I\'m coming to assess him', act: 'goto', pid: '603' }, { label: 'It\'s from lying flat. Reposition him.', act: 'ray-reposition' }] }); } },
    { id: 'theo-nausea', when: (s) => s.t >= 100 && !s.p['607'].icu, run(s, A) { A.msg({ from: 'benny', pid: '607', text: `607's nauseated after breakfast. He's asking for "the stomach medicine."`, replies: [{ label: 'I\'ll come see him', act: 'goto', pid: '607' }] }); } },
    { id: 'ray-cbc', when: (s) => s.t >= 125, run(s, A) { const P = s.p['603']; const h = P.icu ? 9.6 : (13.8 - Math.min(2.8, P.bleed * 2.4)).toFixed(1); P.cbcSeen = true; A.addLab('603', { name: 'Hemoglobin', val: +h, unit: 'g/dL', ref: '13.5–17.5', flag: 'L' }); A.msg({ from: 'lab', pid: '603', text: `09:00 CBC resulted for 603 Okoro.` }); } },
    { id: 'theo-run', when: (s) => { const P = s.p['607']; return !P.run && !P.icu && s.t >= 140 && (P.tors >= .25 || (P.mgGiven === null && s.t >= 150)); }, run(s, A) { const P = s.p['607']; P.run = true; P.runAt = s.t; A.msg({ from: 'jae', pid: '607', urgent: true, text: `607 just had a 9-beat run of polymorphic VT. Twisting, real. He says he felt woozy. Printing it.`, replies: [{ label: 'Go to 607', act: 'goto', pid: '607' }] }); } },
    { id: 'theo-tors', when: (s) => { const P = s.p['607']; return !P.icu && P.tors >= 1; }, run(s, A) { const P = s.p['607']; P.icu = true; P.icuAt = s.t; P.goneText = 'Transferred to the CCU after torsades'; A.judge('607-tors', 'safety', -3, `Mr. Lindqvist went into torsades de pointes.`, `QTc over 500, potassium and magnesium low, and QT-prolonging drugs on board. The protocol, a hold and a call were all available this morning.`, '607'); A.msg({ from: 'nova', pid: '607', urgent: true, text: `Code blue 607: torsades, pulseless. Shocked once, back in sinus, magnesium 2 g in. He's going to the CCU.` }); } },
    { id: 'glo-sob', when: (s) => { const P = s.p['601']; return !P.icu && !P.warned && P.hf >= 1; }, run(s, A) { s.p['601'].warned = true; A.msg({ from: 'benny', pid: '601', urgent: true, text: `601 can't catch her breath. SpO₂ 88% on 2 L. She's sitting straight up and coughing.`, replies: [{ label: 'Go to 601', act: 'goto', pid: '601' }] }); } },
    { id: 'glo-icu', when: (s) => { const P = s.p['601']; return !P.icu && P.hf >= 1.45; }, run(s, A) { const P = s.p['601']; P.icu = true; P.goneText = 'Transferred to the CCU on BiPAP'; A.judge('601-icu', 'safety', -3, `Mrs. Mendes went into flash pulmonary edema.`, `An EF of 25% on a negative inotrope, wetter by the hour. The echo was the cue to stop and call.`, '601'); A.msg({ from: 'nova', pid: '601', urgent: true, text: `Rapid response 601. Flash pulmonary edema, SpO₂ 82%. BiPAP on, diltiazem off, going to the CCU.` }); } },
    { id: 'dol-foot', when: (s) => { const P = s.p['605']; return !P.gone && !P.footSeen && P.foot >= .5; }, run(s, A) { s.p['605'].footSeen = true; A.msg({ from: 'benny', pid: '605', urgent: true, text: `605 says her left foot is cold and numb. It looks pale compared to the right.`, replies: [{ label: 'Go to 605', act: 'goto', pid: '605' }] }); } },
    { id: 'dol-out', when: (s) => { const P = s.p['605']; return !P.gone && P.foot >= 1.15; }, run(s, A) { const P = s.p['605']; P.gone = true; P.goneAt = s.t; P.goneText = 'To interventional radiology for an arterial clot'; A.judge('605-clot', 'safety', -3, `Mrs. Price developed an arterial clot from HIT.`, `Platelets down 57% on day 5 of heparin, and the heparin kept running. HIT causes clots, not bleeding.`, '605'); A.msg({ from: 'nova', pid: '605', urgent: true, text: `605's left foot is white and pulseless. Vascular's taking her to IR. They're asking why she's still on heparin with platelets of 98.` }); } },
    { id: 'hep-restart', when: (s) => { const P = s.p['605']; return P.holdUntil !== null && s.t >= P.holdUntil && !P.restartNoted && P.stopped === null; }, run(s, A) { s.p['605'].restartNoted = true; A.log('605', `Heparin restarted at ${s.p['605'].rate} units/kg/h per nomogram.`, 'act'); } },
    { id: 'nova-idle', when: (s) => s.t >= 50 && s.t < 120 && A0(s), run(s, A) { A.msg({ from: 'nova', urgent: true, text: `It's almost eight and you haven't been in a room. Three drips and a fresh stent on your hall. Go look.` }); } },
    { id: 'nova-30', when: (s) => s.t >= 270 && !(s.report && Object.keys(s.report).length), run(s, A) { A.msg({ from: 'nova', text: `Thirty minutes to handoff. Ari's taking your patients. Every drip rate and every changed order, out loud.` }); } },
  ];

  const replies = {
    readback(s, A) { A.judge('605-readback', 'comm', 1, `You read back the critical aPTT.`, `Read-back closes the loop on a critical value. Now act on it, and look at what else was drawn.`, '605'); },
    'ray-urinal'(s, A) { const P = s.p['603']; P.urinal = true; A.judge('603-flat', 'safety', 2, `You kept Mr. Okoro flat after his sheath removal.`, `Flat, leg straight: it protects a fresh femoral puncture. Solve the actual problem with a urinal and privacy.`, '603'); A.msg({ from: 'benny', pid: '603', text: `Got him a urinal and closed the curtain. He's grumpy but flat.` }); },
    'ray-commode'(s, A) { const P = s.p['603']; P.upright = true; A.judge('603-flat', 'safety', -2, `You let Mr. Okoro onto the commode two hours after sheath removal.`, `Hip flexion and bearing down on a fresh femoral puncture can start a bleed. The order said flat until 12:15.`, '603'); },
    'ray-hob'(s, A) { const P = s.p['603']; P.upright = true; A.judge('603-flat', 'safety', -1, `You raised Mr. Okoro's head of bed to 60 degrees.`, `Head of bed 30 or less until 12:15. More than that flexes the hip over the puncture.`, '603'); },
    'ray-reposition'(s, A) { const P = s.p['603']; P.dismissed = true; A.judge('603-dismiss', 'judgment', -2, `You put Mr. Okoro's new back pain down to positioning.`, `New back pain and a heart rate alarming at 100, two hours after a femoral stick. That's a retroperitoneal bleed until someone looks.`, '603'); },
    'tele-look'(s, A) { const P = s.p['607']; P.stripSeen = true; P.teleLook = true; A.judge('607-alarm', 'assess', 2, `You went to look at Mr. Lindqvist instead of calling the alarms artifact.`, `Alarm fatigue is real, and so is a long QT with PVCs. Runs of extra beats in a patient with a QTc over 500 are a warning, not noise.`, '607'); A.msg({ from: 'jae', pid: '607', text: `Strip's printed. Those runs are real, PVCs landing on the T wave. QTc on my calipers is about ${qtc(P)}.` }); },
    'tele-art'(s, A) { const P = s.p['607']; P.dismissedAlarm = true; P.tors += .15; A.judge('607-alarm', 'judgment', -2, `You called Mr. Lindqvist's alarms artifact without looking.`, `With a QTc over 500, short runs and R-on-T PVCs are how torsades announces itself. Look at the patient and the strip.`, '607'); },
  };

  /* ---------- delegation ---------- */
  const delegation = {
    note: () => `Benny is doing vitals and fingersticks on the hall. He can take one more thing at a time.`,
    tasks: [
      { id: 'vitals', label: 'Take a set of vital signs', rooms: ['601', '603', '605', '607'], mins: 10 },
      { id: 'ortho', label: 'Orthostatic vital signs', rooms: ['607'], mins: 10 },
      { id: 'urinal', label: 'Bring a urinal, help him keep flat', rooms: ['603'], mins: 0 },
      { id: 'groin', label: 'Check his groin site and pulses', rooms: ['603'], mins: 0 },
      { id: 'pump', label: 'Turn the drip up per the protocol', rooms: ['601', '605'], mins: 0 },
    ],
    start(task, pid, s, A) {
      const nm = A.def(pid).short;
      if (task.id === 'groin') { A.judge('deleg-groin', 'deleg', -1, `You asked the CNA to do a post-cath groin and pulse check.`, `A CNA can take vital signs, but assessing a puncture site and distal pulses after a cath is an RN assessment.`); return `Benny: "I'll grab his vitals, but I'm not supposed to do the site check. That's you."`; }
      if (task.id === 'pump') { A.judge('deleg-pump', 'deleg', -2, `You asked the CNA to titrate a drip.`, `Titrating a high-alert infusion needs a nurse's assessment and judgment, every time.`); return `Benny: "I can't touch the pumps. I'll get you her vitals though."`; }
      if (task.id === 'urinal') { const P = s.p['603']; P.urinal = true; A.judge('deleg-urinal', 'deleg', 1, `You had Benny help Mr. Okoro void while flat.`, `A good task for a CNA, with a clear instruction: keep him flat.`); return `Benny: "Urinal and a curtain. On it."`; }
      if (s.deleg.filter((d) => !d.done).length >= 1) return `Benny: "Give me a minute, I'm still on the last thing."`;
      s.deleg.push({ id: task.id, pid, due: s.t + task.mins, done: false, at: s.t });
      A.judge('deleg-good-' + task.id + '-' + pid, 'deleg', 1, `You delegated ${task.label.toLowerCase()} for ${A.def(pid).short} to the CNA.`, 'Hand off the measurements; keep the interpretation.');
      return `Benny: "On it: ${task.label.toLowerCase()} for ${nm}."`;
    },
    complete(d, s, A) {
      const nm = A.def(d.pid).short;
      if (d.id === 'vitals') { const v = A.recordVitals(d.pid, 'Benny (CNA)'); A.msg({ from: 'benny', pid: d.pid, text: `${nm}: T ${v.T.toFixed(1)}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}%.` + (d.pid === '603' && s.p['603'].bleed > .3 ? ' He keeps rubbing his back.' : '') + (d.pid === '601' && s.p['601'].hf >= .6 ? ' She sounds really out of breath.' : '') }); }
      else if (d.id === 'ortho') { s.p['607'].ortho = true; A.msg({ from: 'benny', pid: '607', text: `607 orthostatics: lying 128/70, HR 64; standing 120/68, HR 70. No symptoms.` }); }
    },
  };

  /* ---------- Nova ---------- */
  function novaHint(s, A) {
    const G = s.p['601'], R = s.p['603'], D = s.p['605'], T = s.p['607'];
    if (!R.icu && R.bleed > .3 && R.called === null) return `Someone two hours out from a femoral stick has new back pain and a heart rate that keeps climbing. Where can blood hide that you can't see?`;
    if (!G.icu && G.diltOn && s.t >= 15 && !G.echoSeen) return `A test came back this morning that changes which drugs are safe for one of your drips. Have you read it?`;
    if (!G.icu && G.diltOn && G.echoSeen) return `What does diltiazem do to a heart that only squeezes 25%?`;
    if (!D.gone && D.stopped === null && !D.labsRead) return `The lab called one critical value on 605. What else was in that blood draw?`;
    if (!D.gone && D.stopped === null && D.labsRead) return `When the drug is causing the problem, adjusting the dose isn't the fix.`;
    if (!T.icu && T.kGiven === null && T.mgGiven === null) return `One of your patients has an order you're allowed to act on without calling anyone. Which protocol is it?`;
    if (!T.icu && !T.cital && !T.citalHeld && s.t >= 100) return `Look at 607's nine o'clock meds against his QTc and his age.`;
    const unseen = A.c.patients.filter((d) => !s.p[d.id].gone && !s.p[d.id].icu && (s.p[d.id].seenAt === null || s.t - s.p[d.id].seenAt > 90)).map((d) => d.room);
    if (unseen.length) return `You haven't laid eyes on ${unseen.join(' and ')} in over an hour and a half. Monitors don't see everything.`;
    return `You're on top of it. Which of your drip rates would you want double-checked before handoff?`;
  }

  function endChecks(s, A) {
    { const R = s.p['603']; if (R.upright && !s.judg.some((j) => j.key === '603-flat')) A.judge('603-flat', 'safety', -2, `Mr. Okoro sat up before 12:15, two hours after his sheath came out.`, `The order was flat (head of bed 30 or less) until 12:15. Hip flexion on a fresh femoral puncture can start a bleed, and a retroperitoneal bleed is silent at first.`, '603'); }
    A.c.patients.forEach((d) => {
      const P = s.p[d.id];
      if (P.seenAt === null && !P.icu && !P.gone) A.judge(d.id + '-unseen', 'assess', -3, `You never went into ${d.room} this shift.`, `Telemetry shows a rhythm, not a person. Every patient needs eyes on them early.`, d.id);
      (d.meds || []).forEach((m) => { const st = s.meds[m.id]; if (m.due !== undefined && m.due <= Math.min(240, s.t - 60) && st.status === 'due' && !P.icu && !P.gone) A.judge(m.id + '-missed', 'meds', -2, `${m.name} for ${d.short} (due ${clock(m.due)}) was never given or held.`, `Every scheduled dose needs a decision: given, or held with a reason.`, d.id); });
    });
    const G = s.p['601'], R = s.p['603'], D = s.p['605'], T = s.p['607'];
    if (!G.icu && G.diltOn && G.echoSeen && !G.called) A.judge('601-norep', 'comm', -2, `Mrs. Mendes's EF of 25% never reached the provider.`, `A new result that contradicts the active orders is a call.`, '601');
    if (!G.icu && G.stopOrder && G.diltOn) A.judge('601-notstopped', 'meds', -2, `The order to stop Mrs. Mendes's diltiazem was never carried out.`, `An order isn't done until the pump says so.`, '601');
    if (!R.icu && R.bleed > .3 && R.called === null) A.judge('603-norep', 'comm', -3, `Mr. Okoro's bleeding signs never reached the provider.`, `Back pain, tachycardia and a falling pressure after femoral access are a call, every time.`, '603');
    if (!D.gone && D.labsRead && D.stopped === null) A.judge('605-hit-missed', 'meds', -2, `Mrs. Price's heparin kept running after you saw her platelets fall.`, `In suspected HIT, all heparin stops.`, '605');
    if (!D.gone && D.nomo === null && D.stopped === null) A.judge('605-noadj', 'meds', -2, `Mrs. Price's aPTT of 104 was never acted on.`, `A critical value needs an action, and a nomogram tells you which.`, '605');
    if (!T.icu && T.kGiven === null && T.mgGiven === null) A.judge('607-noprotocol', 'meds', -2, `Mr. Lindqvist's electrolyte protocol was never started.`, `A nurse-initiated protocol is an order. Potassium and magnesium protect a long QT.`, '607');
    if (!T.icu && !T.called) A.judge('607-norep', 'comm', -1, `The provider never heard about Mr. Lindqvist's QTc over 500.`, `His own orders said to call for it.`, '607');
    const keys = []; A.c.patients.forEach((d) => (d.report || []).forEach((r, i) => { if (r.key) keys.push(d.id + ':' + i); }));
    const hit = keys.filter((k) => s.brain.includes(k)).length;
    if (s.brain.length) { const noise = s.brain.length - hit, precise = hit / s.brain.length;
      if (noise >= 4 && precise < .7) A.judge('brain', 'assess', -1, `You flagged ${s.brain.length} lines in report, ${noise} of them noise.`, 'Flagging everything is the same as flagging nothing.');
      else A.judge('brain', 'assess', hit / keys.length >= 0.6 && precise >= .7 ? 1 : 0, `You flagged ${hit} of ${keys.length} critical cues during report${noise ? `, plus ${noise} that didn't matter` : ''}.`, `On step-down, report is drip rates, results and procedures. The lines that matter are the ones that should change an order.`); }
  }

  const PREP = { '601-dilt': ['strip', 'vitals'], '603-meto': ['vitals'], '603-morph': ['pain', 'vitals'], '603-tica': ['vitals'], '605-hep': ['labs'], '607-cital': ['strip'], '607-ond': ['strip'] };
  [gloria, raymond, dolores, theo].forEach((d) => d.meds.forEach((m) => { if (PREP[m.id]) m.prep = PREP[m.id]; }));

  S.engine.registerCase({
    id: 'stepdown-6e-1', title: 'Days on 6 East', unit: '6 East, Cardiac Step-Down', unitShort: '6 East', level: 'Specialty: Step-down', start: 7 * 60, length: 300, novaCredits: 3,
    card: 'Cardiac step-down until noon: atrial fibrillation on a drip, fresh femoral stent, heparin infusion, and syncope on telemetry.',
    hero: { head: 'Days, 6 East. Four patients, three drips and a fresh stent.', lede: 'Cardiac step-down, 07:00 to noon. Everyone is on a monitor and most of the orders run on numbers. Some of this morning\'s results should change those orders.' },
    intro: { time: '06:58', place: '6 East, Cardiac Step-Down', cta: 'Take report', beats: ['Lena is finishing nights and giving report at the monitor bank.', 'Four patients until noon: two drips titrated by protocol, a stent placed at 04:30, and a long QT.', 'A protocol tells you what to do with a number. It doesn\'t always know about this morning\'s results.'] },
    minutes: 20,
    sysLabels: { cardiac: 'Cardiovascular and pulses' },
    handoffBy: 'Lena (night RN)', reportBy: 'lena', reportRole: 'night shift', provider: 'haddad', cna: 'benny',
    staff: {
      nova: { name: 'Nova Reyes', role: 'Charge nurse', look: { skin: '#B98A63', shade: '#976D4B', lip: '#7C4435', blush: '#C77B5E', iris: '#3D2A1C', head: { w: 55, h: 62, jaw: .35 }, eye: 10, hair: { style: 'bun', color: '#3A2E2A', streak: true }, brow: { w: 3.6, color: '#2E2421' }, body: { w: 80, cloth: 'navy' }, extras: ['studs'], smile: .35 } },
      benny: { name: 'Benny', role: 'CNA', look: { skin: '#D8A57C', shade: '#BA875E', lip: '#9A564A', blush: '#D68A70', iris: '#2C1D12', head: { w: 56, h: 61, jaw: .55 }, eye: 10, hair: { style: 'curlyshort', color: '#1B1410' }, brow: { w: 4, color: '#16100C' }, body: { w: 84, cloth: 'wine' }, extras: [], smile: .55 } },
      lena: { name: 'Lena', role: 'Night RN', look: { skin: '#F0D2BC', shade: '#D4AE96', lip: '#B4675F', blush: '#EA998A', iris: '#4E6A84', head: { w: 53, h: 60, jaw: .3 }, eye: 9.8, hair: { style: 'ponytail', color: '#C9A06A' }, brow: { w: 3.2, color: '#9A7448' }, body: { w: 78, cloth: 'navy' }, extras: ['studs'], smile: .3, tired: true } },
      haddad: { name: 'Dr. Haddad', role: 'Cardiology hospitalist', look: { skin: '#C99A72', shade: '#A97B54', lip: '#8E5246', blush: '#CC8A70', iris: '#2A1A10', head: { w: 55, h: 63, jaw: .55 }, eye: 9.4, hair: { style: 'short', color: '#2A2420' }, brow: { w: 4.2, color: '#201A16' }, body: { w: 82, cloth: 'coat', steth: true }, extras: ['beard'], smile: .3 } },
      jae: { name: 'Jae', role: 'Monitor tech', look: { skin: '#E6C29C', shade: '#C79E76', lip: '#A8625A', blush: '#DE9380', iris: '#241810', head: { w: 55, h: 61, jaw: .45 }, eye: 9.4, hair: { style: 'short', color: '#121012' }, brow: { w: 3.8, color: '#121012' }, body: { w: 80, cloth: 'grey' }, extras: ['headset'], smile: .3 } },
      lab: { name: 'Lab', role: 'Laboratory', look: null },
      echo: { name: 'Echo lab', role: 'Cardiology', look: null },
    },
    patients: [gloria, raymond, dolores, theo],
    dueExtras(s) {
      const out = [], G = s.p['601'], R = s.p['603'], D = s.p['605'], T = s.p['607'];
      if (!R.icu) { const next = R.lastCheck + (R.lastCheck < 75 ? 30 : 60); if (next <= 300) out.push({ t: next, late: s.t > next + 15, tab: 'care', text: '603 Groin site, distal pulses and vital signs' }); }
      if (G.diltOn && !G.icu) { const lv = Math.max(-15, ...G.vit.map((v) => v.t)); out.push({ t: lv + 15, late: s.t > lv + 30, sys: 'vitals', text: '601 Diltiazem drip: HR and BP every 15 minutes' }); }
      if (s.t >= 15 && !G.echoSeen && !G.icu) out.push({ t: 15, late: s.t > 45, text: '601 Echo report resulted' });
      if (D.nomo === null && D.stopped === null && !D.gone) out.push({ t: 0, late: s.t > 30, tab: 'meds', hl: 'Heparin infusion', text: '605 aPTT 104: adjust heparin per nomogram' });
      if (D.stopped !== null && !D.called && !D.gone) out.push({ t: D.stopped, late: s.t > D.stopped + 20, tab: 'talk', text: '605 Heparin stopped for HIT: call for a non-heparin anticoagulant' });
      if (T.kGiven === null && !T.icu) out.push({ t: 0, late: s.t > 60, text: '607 K 3.2, Mg 1.4: electrolyte protocol' });
      return out;
    },
    replies,
    priority: {
      judge(r, A) {
        if (r[0] === '601') A.judge('rank-first', 'priority', 2, `You chose to see Mrs. Mendes first.`, `A rate in the 130s with a soft pressure, crackles and new oxygen: the least stable patient on the hall, on a drip that's due for a titration decision.`, '601');
        else if (r[0] === '603') A.judge('rank-first', 'priority', 1, `You chose to see Mr. Okoro first.`, `Reasonable: a fresh femoral puncture with checks due. But Mrs. Mendes was already unstable.`, '601');
        else A.judge('rank-first', 'priority', -1, `You put ${A.def(r[0]).short} first, ahead of Mrs. Mendes and Mr. Okoro.`, `Unstable vital signs first, then the fresh procedure with checks due, then the time-sensitive drips.`, '601');
      },
      correct: ['601', '603', '605', '607'],
      why: {
        '601': `AF at 138 with an SBP around 98, crackles and new oxygen, on a drip with a titration decision due. Unstable now.`,
        '603': `Sheath out 45 minutes ago after a high arterial stick; checks every 15 to 30 minutes. Stable for now, high risk.`,
        '605': `aPTT 104 on a running heparin drip in a 74-year-old: a bleeding risk that needs action this hour. And her CBC hasn't been read.`,
        '607': `QTc over 500 with low potassium and magnesium. Dangerous, but stable this minute, and his protocol is quick to start.`,
      },
    },
    events, delegation, dialogs, novaHint, endChecks,
    tick(s, A) {
      const G = s.p['601'];
      if (!G.icu) {
        if (G.diltOn) { G.hf = clamp(G.hf + .004 * (G.dilt / 10), 0, 2); G.hr += ((138 - (G.dilt - 10) * 3) - G.hr) * .05; }
        else { G.hf = clamp(G.hf - (G.lasixAt !== null ? .007 : .0015), 0, 2); const tgt = G.amioAt !== null ? 98 : 142; G.hr += (tgt - G.hr) * (G.amioAt !== null ? .03 : .02); }
      }
      const R = s.p['603'];
      if (!R.icu) {
        const start = R.upright ? 35 : 50;
        if (s.t >= start) { const grow = R.called !== null ? (R.fluids ? .001 : .003) : (R.upright ? .013 : .0095); R.bleed = clamp(R.bleed + grow, 0, 2); }
        if (R.bleed >= 1.35 && !R.icu) { R.icu = true; R.goneText = 'To interventional radiology, then the CCU'; A.judge('603-shock', 'safety', -3, `Mr. Okoro went into hemorrhagic shock from a retroperitoneal bleed.`, `Back pain from about 08:00, a heart rate that climbed all morning, a falling pressure. The groin looked fine because the blood was behind it.`, '603'); A.msg({ from: 'nova', pid: '603', urgent: true, text: `Rapid response 603: BP 72/40, HR 132, back pain 9/10. Retroperitoneal bleed. Blood's coming up and IR is waiting.` }); }
      }
      const D = s.p['605'];
      if (!D.gone) {
        const hepRunning = D.stopped === null && (D.holdUntil === null || s.t >= D.holdUntil);
        if (hepRunning && s.t >= 50) D.foot = clamp(D.foot + .0065, 0, 1.5);
        else if (D.argaAt !== null) D.foot = Math.max(0, D.foot - .002);
      }
      const T = s.p['607'];
      if (!T.icu) {
        if (T.kGiven === null) T.kv = Math.max(2.8, T.kv - (T.lasix ? .003 : .0012)); else T.kv = Math.min(4.1, T.kv + .006);
        if (T.mgGiven !== null) T.mg = Math.min(2.1, T.mg + .012);
        const q = qtc(T);
        if (q >= 528 && T.mgGiven === null) T.tors = clamp(T.tors + (q - 520) / 1500, 0, 1.2);
        else T.tors = Math.max(0, T.tors - .004);
      }
    },
  });
})(window.Shift);
