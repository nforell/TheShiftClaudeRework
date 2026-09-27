/* Case: 4 West Med-Surg, morning block. All clinical content lives here; the engine and UI are generic. */
(function (S) {
  const { clamp, clock } = S.engine;
  const jit = (s, seed) => ((Math.floor(s.t / 5) * 7 + seed * 13) % 3) - 1;
  const recent = (s, t0, m) => t0 !== null && t0 !== undefined && s.t - t0 <= m;

  /* ---------- 412 Marcus Bell: post-op ---------- */
  function bellPain(s, P) {
    let p = s.t >= 85 ? 7 : 6;
    if (P.apapAt !== null && s.t >= P.apapAt + 45) p -= 1;
    if (P.oxyAt !== null) { const d = s.t - P.oxyAt; if (d >= 30 && d < 240) p -= P.oxyDose === 10 ? 4 : 2; else if (d >= 15 && d < 30) p -= 1; }
    if (P.hmAt !== null) { const d = s.t - P.hmAt; if (d >= 10 && d < 180) p -= 4; }
    if (P.ambAt && s.t - P.ambAt < 20) p += 1;
    return clamp(p, 1, 10);
  }
  const bellSedated = (s, P) => (P.oxyAt !== null && s.t - P.oxyAt < 90) || (P.hmAt !== null && s.t - P.hmAt < 60);
  const bellAtel = (s, P) => P.atel && !(P.atelFix !== null && s.t > P.atelFix + 30);

  const bell = {
    id: '412', room: '412', name: 'Marcus Bell', short: 'Mr. Bell', age: 58, sex: 'M',
    look: { skin: '#8C5637', shade: '#6A3E25', lip: '#5C2E22', blush: '#B9563F', iris: '#3A2618', head: { w: 60, h: 63, jaw: .8 }, eye: 10.2,
      hair: { style: 'buzz', color: '#2A2220' }, brow: { w: 4.6, color: '#241C1A' }, body: { w: 92, cloth: 'gown' }, extras: ['goatee'], smile: .2, guard: true,
      lines: { calm: 'Better. Not great, better. Don\'t tell Denise I said that.', pain: 'Easy. That\'s a 7, and it\'s climbing.', dys: 'Can\'t get a good breath in. Hurts to try.', drowsy: 'Mm. Just resting my eyes, chief.', fever: 'Is it hot in here, or is it me?', none: 'Snores. He doesn\'t wake to his name.' } },
    bio: 'Retired city bus mechanic. Wry, stoic, hates asking for help. Wife Denise works days.',
    dx: 'Post-op day 1, open sigmoid colectomy', reason: 'Perforated diverticulitis',
    hx: ['Hypertension', 'Obstructive sleep apnea, uses CPAP (brought his own)', 'Smoker, 30 pack-years; quit 2 weeks ago'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '96 kg',
    lines: ['PIV 20g right forearm, saline lock', 'Foley catheter (order: remove at 08:00)', 'Midline abdominal incision, dry dressing', 'SCDs both legs'],
    mobility: 'Out of bed with assist of 1. First walk is due today.', diet: 'Clear liquids',
    init: { isCoached: null, isPoor: false, ambulated: false, ambAt: null, orthoAt: null, fell: false, atel: false, atelFix: null, foleyOut: null, oxyAt: null, oxyDose: 0, hmAt: null, apapAt: null, callLight: false, walkAsked: false, talkedOpioid: false, walkDelegated: false },
    nightVitals: { T: 37.3, HR: 90, SBP: 138, DBP: 84, RR: 18, SpO2: 94, O2: 'Room air', pain: 6 },
    labs: [
      { name: 'Hemoglobin', val: 11.8, unit: 'g/dL', ref: '13.5–17.5', flag: 'L', t: -120 },
      { name: 'WBC', val: 10.9, unit: 'K/µL', ref: '4.5–11.0', flag: '', t: -120 },
      { name: 'Platelets', val: 214, unit: 'K/µL', ref: '150–400', flag: '', t: -120 },
      { name: 'Potassium', val: 3.9, unit: 'mmol/L', ref: '3.5–5.0', flag: '', t: -120 },
      { name: 'Creatinine', val: 1.0, unit: 'mg/dL', ref: '0.7–1.3', flag: '', t: -120 },
    ],
    orders: [
      { t: -900, text: 'Remove Foley catheter at 08:00 POD 1. Voiding trial; bladder scan if no void in 6 h.' },
      { t: -900, text: 'Ambulate 3 times daily, first walk with RN.' },
      { t: -900, text: 'Incentive spirometer 10 times/hour while awake.' },
      { t: -900, text: 'Oxycodone 5 mg PO q4h PRN moderate pain (4–6); 10 mg PO q4h PRN severe pain (7–10).' },
      { t: -900, text: 'Hydromorphone 0.5 mg IV q3h PRN severe pain unrelieved by oxycodone, or if unable to take PO.' },
      { t: -900, text: 'Acetaminophen 1,000 mg PO q6h scheduled.' },
      { t: -900, text: 'Enoxaparin 40 mg subQ daily. Amlodipine 5 mg PO daily, hold SBP < 100.' },
      { t: -900, text: 'CPAP at night and with naps. Continuous pulse oximetry while on opioids overnight.' },
    ],
    notes: [
      { t: -150, author: 'Dana, night RN', text: 'Pain 7/10 at 04:30, oxycodone 10 mg given, down to 5/10 at 05:15. Refused incentive spirometer twice, says it "hurts too much." CPAP on overnight. Foley draining well. Said he felt woozy when he sat up to use the urinal.' },
      { t: -800, author: 'Dr. Patel, surgery', text: 'Uncomplicated open sigmoid colectomy with end colostomy deferred; primary anastomosis. EBL 400 mL. Early ambulation, pulmonary toilet, advance diet as tolerated.' },
    ],
    io: { intake: 'IV 1,150 mL, PO 240 mL', output: 'Urine 610 mL (Foley)' },
    report: [
      { text: 'Marcus Bell, 58, post-op day 1 from an open sigmoid colectomy for perforated diverticulitis. Full code, no allergies.', key: false },
      { text: 'He has sleep apnea. His own CPAP is here and he wore it all night.', key: true },
      { text: 'Pain was a 7 at 04:30. I gave oxycodone 10, he got down to a 5. Next dose is available at 08:30.', key: true },
      { text: 'He refused incentive spirometry twice. Breathing is shallow. He splints when he moves.', key: true },
      { text: 'He said he felt woozy sitting up to use the urinal around 05:00. He hasn\'t walked yet.', key: true },
      { text: 'Foley is ordered out at 08:00. Dressing is clean. Hemoglobin 11.8, down from 13.4 pre-op.', key: true },
      { text: 'He\'s a good guy. His wife Denise will come by after work.', key: false },
    ],
    vitals(s, P) {
      const at = bellAtel(s, P), p = bellPain(s, P), sed = bellSedated(s, P);
      return {
        T: at ? 38.2 : 37.4, HR: 86 + (p >= 7 ? 8 : 0) + (at ? 8 : 0) + jit(s, 1), SBP: 136 + jit(s, 2) * 2, DBP: 82 + jit(s, 3),
        RR: (at ? 22 : 18) + (p >= 7 ? 2 : 0) - (sed ? 2 : 0), SpO2: (at ? 91 : 94) - (sed ? 1 : 0), O2: 'Room air', pain: p,
        poss: sed ? '2, slightly drowsy, easily aroused' : '1, awake and alert',
      };
    },
    assess: {
      general: (s, P) => bellPain(s, P) >= 7 ? 'Lying very still, jaw tight, arm guarding his belly. Breathing is quick and shallow.' : 'Resting, more relaxed. He shifts in bed without wincing.',
      resp: (s, P) => bellAtel(s, P)
        ? 'Diminished breath sounds with fine crackles at both bases. Shallow breaths, splinting. The spirometer marker sits at 500 mL; his goal is 1,500.'
        : 'Diminished at the bases, clear above. Shallow, splinted breaths. The incentive spirometer is on the table, still in its wrapper.',
      cardiac: () => 'Regular rhythm, S1 S2. Pedal pulses 2+. No edema. SCDs on and cycling.',
      neuro: (s, P) => 'Alert and oriented to person, place, time, situation. POSS ' + (bellSedated(s, P) ? '2, drowsy but easily aroused.' : '1, awake and alert.'),
      pain: (s, P, A) => {
        const p = bellPain(s, P);
        if (P.oxyAt !== null && s.t - P.oxyAt >= 25 && s.t - P.oxyAt <= 100) A.judge('412-reassess', 'judgment', 1, 'You reassessed Mr. Bell\'s pain and sedation after his oxycodone.', 'Evaluating the outcome is the last step of every intervention. After an oral opioid, reassess in 30 to 60 minutes: did it work, and is he over-sedated? In a patient with sleep apnea, both answers matter.', '412');
        return `Pain ${p}/10 at the incision, sharp, worse when he coughs or moves. ${p >= 7 ? 'He says he "can\'t take a deep breath."' : 'He says he could walk on this.'} Sedation (POSS) ${bellSedated(s, P) ? '2' : '1'}. His goal is 4/10, enough to walk.`;
      },
      skin: () => 'Midline incision: edges well approximated, scant serosanguineous drainage on the dressing, no redness or odor. Skin warm and dry.',
      gi: (s, P) => `Abdomen soft, appropriately tender, hypoactive bowel sounds, no flatus yet. Tolerating clear liquids. ${P.foleyOut === null ? 'Foley draining clear yellow urine.' : 'Foley out at ' + clock(P.foleyOut) + '. ' + (s.t - P.foleyOut > 150 ? 'He voided 300 mL.' : 'He hasn\'t voided yet.')}`,
    },
    interventions: [
      {
        id: 'is', label: 'Coach incentive spirometry with splinted cough', cost: 4,
        run(s, P, A) {
          if (P.atel) P.atelFix = s.t;
          if (bellPain(s, P) >= 7) {
            if (P.isCoached === null) P.isCoached = s.t; P.isPoor = true;
            return 'He tries. 500 mL, then he stops with a hand pressed to his incision. "Can\'t. Not like this." Pain is the barrier here, not effort.';
          }
          P.isCoached = s.t; P.isPoor = false;
          A.judge('412-is', 'safety', 1, 'You got Mr. Bell using his incentive spirometer with a splinting pillow.', 'Shallow, splinted breathing after abdominal surgery collapses alveoli. Pain control, incentive spirometry and early walking together prevent atelectasis and pneumonia.', '412');
          return 'Pillow hugged to his belly, he pulls 1,000 mL, then 1,100. "Ten an hour, huh? You\'re worse than Denise."';
        },
      },
      {
        id: 'ortho', label: 'Check orthostatic vital signs', cost: 5,
        run(s, P, A) {
          P.orthoAt = s.t; A.recordVitals('412', 'You');
          return 'Lying 136/82, HR 88. Sitting 126/78, HR 96. Standing 114/72, HR 108. The room "tilts" for a few seconds, then settles. Mildly orthostatic: dangle first, move slowly, use a gait belt.';
        },
      },
      {
        id: 'walk', label: 'Walk with him using a gait belt', cost: 8, avail: (s, P) => !P.ambulated,
        run(s, P, A) {
          if (P.orthoAt === null) {
            A.judge('412-walk-blind', 'safety', -1, 'You got Mr. Bell up for his first walk without checking orthostatic vital signs.', 'First time up after surgery, on opioids, with a hemoglobin drop and a report that he felt woozy: orthostatic vital signs tell you whether standing is safe before you find out the hard way.', '412');
            return 'He stands, sways and goes gray. You ease him back to the edge of the bed. No fall, but he was dizzier than you knew.';
          }
          if (bellPain(s, P) >= 7) return 'He makes it to the doorway and stops. "It\'s an 8 when I walk." Treat the pain first, then try again.';
          P.ambulated = true; P.ambAt = s.t; if (P.atel) P.atelFix = s.t;
          A.judge('412-walk', 'safety', 2, 'You checked orthostatic vital signs, then walked Mr. Bell yourself for his first time up.', 'The first walk after surgery is an RN assessment: orthostasis, pain, gait, tolerance. Once he has proven steady, later walks can go to the CNA.', '412');
          return 'Two minutes dangling, then up. Sixty feet down the hall with the walker, steady. "Huh. Didn\'t die." Luis can take him on the next walk.';
        },
      },
      {
        id: 'foley', label: 'Remove Foley catheter (ordered)', cost: 4, avail: (s, P) => P.foleyOut === null,
        run(s, P, A) {
          P.foleyOut = s.t;
          A.judge('412-foley', s.t <= 150 ? 'safety' : 'time', s.t <= 150 ? 1 : -1, s.t <= 150 ? 'You removed Mr. Bell\'s Foley catheter close to the ordered time.' : 'Mr. Bell\'s Foley came out well past the ordered 08:00.', 'Every catheter day raises the risk of a catheter-associated UTI. Post-op removal orders are time-sensitive; afterward, make sure he voids within 6 hours.', '412');
          return 'Balloon deflated, 10 mL withdrawn, catheter out. Urine clear yellow. Voiding trial started; he needs to void within 6 hours.';
        },
      },
      { id: 'repo', label: 'Reposition with a pillow splint', cost: 2, run: () => 'Turned to his side, pillow tucked against his belly, SCDs rechecked. "Better. Not great, better."' },
    ],
    meds: [
      {
        id: '412-apap', name: 'Acetaminophen', dose: '1,000 mg', route: 'PO', freq: 'Every 6 h, scheduled', due: 60,
        checks: () => [{ label: 'Last dose', value: '02:00', ok: true }, { label: 'Daily total after this dose', value: '2 g of 4 g max', ok: true }],
        give(s, P) { P.apapAt = s.t; return 'Given with a sip of water. Scheduled acetaminophen lowers how much opioid he will need.'; },
      },
      {
        id: '412-oxy', name: 'Oxycodone', dose: '5 or 10 mg', route: 'PO', freq: 'Every 4 h as needed', prn: true,
        indication: '5 mg for moderate pain (4–6). 10 mg for severe pain (7–10).',
        doses: [{ id: 5, label: '5 mg' }, { id: 10, label: '10 mg' }],
        block(s, P) {
          if (P.oxyAt === null && s.t < 90) return 'Not available until 08:30. The last dose was at 04:30 and the order is every 4 hours.';
          if (P.oxyAt !== null && s.t - P.oxyAt < 240) return 'Given at ' + clock(P.oxyAt) + '. Next available at ' + clock(P.oxyAt + 240) + '.';
          return null;
        },
        checks: (s, P) => [
          { label: 'Pain score', value: recent(s, P.k.painAt, 60) ? 'Assessed at ' + clock(P.k.painAt) : 'Not assessed in the last hour', ok: recent(s, P.k.painAt, 60) },
          { label: 'Resp. rate and sedation', value: recent(s, P.k.vitalsAt, 60) ? 'Checked at ' + clock(P.k.vitalsAt) : 'Not checked in the last hour', ok: recent(s, P.k.vitalsAt, 60) },
          { label: 'Risk', value: 'Sleep apnea. Watch sedation and breathing.', ok: null },
        ],
        give(s, P, A, dose) {
          const p = bellPain(s, P);
          if (!recent(s, P.k.painAt, 60) || !recent(s, P.k.vitalsAt, 60)) A.judge('412-oxy-blind', 'meds', -2, 'You gave Mr. Bell oxycodone without a current pain score and respiratory/sedation check.', 'Before any opioid: pain intensity to choose the dose, respiratory rate and sedation level to know it is safe. With sleep apnea, sedation is the early warning for respiratory depression.', '412');
          else A.judge('412-oxy-ok', 'meds', 1, 'You checked pain, respiratory rate and sedation before giving Mr. Bell oxycodone.', 'Assess, then medicate, then reassess. The dose was matched to his reported severity.', '412');
          if (dose === 10 && p <= 6) A.judge('412-oxy-dose', 'meds', -1, 'You gave 10 mg for pain the order classifies as moderate.', 'The order ties dose to severity: 5 mg for 4–6, 10 mg for 7–10. Matching dose to pain limits sedation risk.', '412');
          P.oxyAt = s.t; P.oxyDose = dose; P.callLight = false;
          return `Oxycodone ${dose} mg given. Reassess pain and sedation in 30 to 60 minutes.`;
        },
      },
      {
        id: '412-hm', name: 'Hydromorphone', dose: '0.5 mg', route: 'IV', freq: 'Every 3 h as needed', prn: true,
        indication: 'Severe pain (7–10) not relieved by oxycodone, or if unable to take PO.',
        block: (s, P) => (P.hmAt !== null && s.t - P.hmAt < 180) ? 'Given at ' + clock(P.hmAt) + '.' : null,
        checks: (s, P) => [
          { label: 'Oxycodone tried first?', value: P.oxyAt !== null ? 'Yes, at ' + clock(P.oxyAt) : 'No oral dose this shift', ok: P.oxyAt !== null },
          { label: 'Taking PO?', value: 'Yes, clear liquids', ok: null },
          { label: 'Resp. rate and sedation', value: recent(s, P.k.vitalsAt, 60) ? 'Checked at ' + clock(P.k.vitalsAt) : 'Not checked in the last hour', ok: recent(s, P.k.vitalsAt, 60) },
        ],
        give(s, P, A) {
          if (P.oxyAt === null || s.t - P.oxyAt < 45) A.judge('412-hm', 'meds', -1, 'You went to IV hydromorphone before the oral oxycodone had a chance to work.', 'The order reserves IV hydromorphone for pain the oral dose does not relieve, or when he cannot swallow. He can take PO. IV opioids peak faster and carry more sedation risk, especially with sleep apnea.', '412');
          P.hmAt = s.t; P.callLight = false;
          return 'Hydromorphone 0.5 mg IV given over 2 minutes. Recheck sedation and respiratory rate in 15 minutes.';
        },
      },
      {
        id: '412-enox', name: 'Enoxaparin', dose: '40 mg', route: 'SubQ', freq: 'Daily', due: 120,
        checks: () => [{ label: 'Platelets', value: '214 K/µL', ok: true }, { label: 'Incision', value: 'No active bleeding', ok: true }],
        give: () => 'Given subQ in the abdomen, 2 inches from the incision. No rubbing.',
        hold(s, P, A) { A.judge('412-enox-hold', 'meds', -1, 'You held Mr. Bell\'s enoxaparin without a clinical reason.', 'After abdominal surgery, in a recent smoker with limited mobility, VTE prophylaxis matters. Platelets were normal and there was no bleeding.', '412'); return 'Held.'; },
      },
      {
        id: '412-aml', name: 'Amlodipine', dose: '5 mg', route: 'PO', freq: 'Daily', due: 120, param: 'Hold if SBP < 100',
        checks: (s, P, A) => { const v = A.lastVitals('412'); return [{ label: 'Latest BP', value: `${v.SBP}/${v.DBP} at ${clock(v.t)}`, ok: v.SBP >= 100 }]; },
        give: () => 'Given.',
        hold(s, P, A) { A.judge('412-aml-hold', 'meds', -1, 'You held Mr. Bell\'s amlodipine with a BP well above the hold parameter.', 'His SBP ran in the 130s. The order holds only for SBP under 100.', '412'); return 'Held.'; },
      },
    ],
    talk(s, P) {
      if (bellPain(s, P) >= 7 && !P.talkedOpioid) return 'bell_opioid';
      if (bellPain(s, P) <= 4 && P.ambulated) return 'bell_thanks';
      return 'bell_idle';
    },
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('412');
        return [
          { id: 'pain', label: `Pain ${bellPain(s, P)}/10, limiting deep breathing`, key: bellPain(s, P) >= 7, need: recent(s, P.k.painAt, 90), lock: 'Assess pain first' },
          { id: 'vit', label: `Latest vitals: T ${v.T}, SpO₂ ${v.SpO2}% RA, RR ${v.RR}`, key: v.T >= 38 || v.SpO2 <= 92, need: true },
          { id: 'crackles', label: 'Crackles at both bases, poor IS effort', key: true, need: P.atel && P.assessAt.resp >= s.t - 90, lock: 'Listen to his lungs first' },
          { id: 'ortho', label: 'Mildly orthostatic on standing', key: false, need: P.orthoAt !== null, lock: 'Check orthostatics first' },
          { id: 'hgb', label: 'Hemoglobin 11.8, down from 13.4', key: false, need: true },
          { id: 'tv', label: 'Watching the game replay', key: false, need: true },
        ];
      },
      respond(s, P, A, picked) {
        if (picked.includes('crackles') || (picked.includes('vit') && P.atel)) {
          A.addOrder('412', 'Incentive spirometry every hour while awake with RN check. Ambulate 3 to 4 times today. Chest X-ray if T > 38.5.');
          A.judge('412-sbar-atel', 'comm', 1, 'You reported Mr. Bell\'s fever, low SpO₂ and crackles together.', 'Post-op day 1 fever with crackles and falling saturation points to atelectasis. Pairing findings gives the provider a picture instead of isolated numbers.', '412');
          return 'Sounds like atelectasis. Push the IS every hour and get him walking. Chest X-ray if he spikes over 38.5. Thanks for catching it.';
        }
        if (picked.includes('pain')) return 'His oral oxycodone should cover that. Use the 10 mg for a 7 and let me know if it doesn\'t touch it.';
        return 'Okay, sounds like post-op day 1. Anything you need from me?';
      },
    },
    scene: (s, P) => ({ tray: 'clear', is: true, isUsed: P.isCoached !== null && !P.isPoor, foley: P.foleyOut === null, walker: true, iv: 'lock', scd: true, callLight: P.callLight, cpap: true }),
    clues(s, P) {
      return {
        is: P.isCoached !== null && !P.isPoor ? 'Incentive spirometer, used. The marker is set at 1,500 mL.' : 'Incentive spirometer on the table, still in its plastic wrap.',
        foley: 'Foley bag hanging below the bed. Clear yellow urine. The order says it comes out at 08:00.',
        walker: 'A walker, parked by the wall. He hasn\'t used it yet.',
        tray: 'Clear liquid tray: broth, apple juice, gelatin. About half gone.',
        cpap: 'His own CPAP machine, mask hung on the rail.',
        iv: 'Saline lock, right forearm. Site clean, no redness.',
      };
    },
    rig: (s, P) => ({ alert: bellSedated(s, P) ? 1 : 0 }),
    status(s, P) { return bellAtel(s, P) || P.fell ? 'watch' : 'stable'; },
    outcome(s, P) {
      if (P.fell) return { tone: 'bad', title: 'Near-fall on his first walk', text: 'Luis lowered him to the floor when his legs gave out. No injury, but an incident report and a frightened patient.' };
      if (bellAtel(s, P)) return { tone: 'mixed', title: 'Early atelectasis', text: 'Febrile to 38.2 with SpO₂ 91% and basilar crackles. Preventable with pain control, spirometry and walking.' };
      if (P.ambulated && bellPain(s, P) <= 5) return { tone: 'good', title: 'On track for day 2', text: 'Pain controlled, walked the hall, lungs holding. The kind of day that gets people home early.' };
      return { tone: 'mixed', title: s.t < 150 && !P.ambulated ? 'Stable, first walk still ahead' : 'Stable, but behind', text: P.ambulated ? 'He walked, but his pain is still limiting him.' : s.t < 150 ? 'He hasn\'t been up yet. His first walk is still on the list.' : 'He never took his first walk. Every hour in bed after surgery raises clot and lung risk.' };
    },
  };

  /* ---------- 414 Grace Okafor: diabetes + cellulitis ---------- */
  function okaforBG(s, P) {
    const t = s.t; let v = 168;
    if (t > 90) v += Math.min(22, (t - 90) * 0.4);
    if (P.corrAt !== null && t > P.corrAt + 20) v -= Math.min(30, (t - P.corrAt - 20) * 0.8);
    if (P.prandAt !== null && t > P.prandAt + 20) v -= Math.min(135, (t - P.prandAt - 20) * 2.4);
    if (P.juiceAt !== null && t > P.juiceAt) v += Math.min(45, (t - P.juiceAt) * 3);
    if (P.snackAt !== null && t > P.snackAt) v += Math.min(30, (t - P.snackAt) * 1);
    if (P.d50At !== null && t > P.d50At) v += 95;
    return Math.round(clamp(v, 34, 400));
  }
  function checkBG(s, P, A, by) {
    const v = okaforBG(s, P); P.bgAt = s.t; P.lastBG = v; P.bgs.push({ t: s.t, val: v, by });
    if (P.juiceAt !== null && s.t - P.juiceAt >= 10 && s.t - P.juiceAt <= 35) A.judge('414-recheck', 'judgment', 1, 'You rechecked Mrs. Okafor\'s glucose about 15 minutes after treating her low.', 'The rule of 15: 15 g of fast carbohydrate, recheck in 15 minutes, repeat if still under 70. Evaluating the outcome is what makes it a treatment instead of a guess.', '414');
    return v;
  }
  const okaforNausea = (s, P) => s.t >= 60 && s.t < 240 && !(P.ondAt !== null && s.t > P.ondAt + 15);

  const okafor = {
    id: '414', room: '414', name: 'Grace Okafor', short: 'Mrs. Okafor', age: 46, sex: 'F',
    look: { skin: '#5B3827', shade: '#42281B', lip: '#3D2118', blush: '#9A4838', iris: '#2B1810', head: { w: 53, h: 64, jaw: .25 }, eye: 10.4,
      hair: { style: 'bun', color: '#17110E', pencil: true }, brow: { w: 3.2, color: '#130D0B' }, body: { w: 72, cloth: 'gown' }, extras: ['glasses', 'hoops'], glasses: '#7B3E28', smile: .1, legUp: true,
      lines: { calm: 'Twenty-eight lab reports to go. Don\'t let me fall asleep on the rubric.', nausea: 'Please don\'t mention the eggs.', hypo: 'I feel weird. Shaky. Is it hot in here?', confused: 'Sorry, what time is it? I lost my place.', drowsy: 'Mm. Five more minutes.', none: 'She slurs something and doesn\'t open her eyes.' } },
    bio: 'Middle-school science teacher. Organized, asks precise questions, grades lab reports from bed. Her father lost a leg to diabetes.',
    dx: 'Left foot cellulitis', reason: 'Cellulitis, type 2 diabetes (A1c 9.8%)',
    hx: ['Type 2 diabetes for 9 years', 'Hypertension', 'Peripheral neuropathy, both feet'],
    allergies: 'Sulfa drugs (hives)', code: 'Full code', weight: '88 kg',
    lines: ['PIV 22g left hand, saline lock'], mobility: 'Up as she likes. Keep the left leg elevated.', diet: 'Consistent carbohydrate',
    init: { bgAt: null, lastBG: null, bgs: [], intakeKnown: false, corrAt: null, prandAt: null, prandHeld: false, notifiedHold: false, hypo: false, hypoAt: null, juiceAt: null, snackAt: null, d50At: null, hypoSevere: false, hypoResolved: false, cefAt: null, ondOrdered: false, ondAt: null, talked: false },
    nightVitals: { T: 37.5, HR: 82, SBP: 128, DBP: 78, RR: 16, SpO2: 98, O2: 'Room air', pain: 3 },
    labs: [
      { name: 'Glucose (serum)', val: 212, unit: 'mg/dL', ref: '70–99', flag: 'H', t: -120 },
      { name: 'WBC', val: 12.1, unit: 'K/µL', ref: '4.5–11.0', flag: 'H', t: -120 },
      { name: 'Hemoglobin A1c', val: 9.8, unit: '%', ref: '< 5.7', flag: 'H', t: -1400 },
      { name: 'Creatinine', val: 0.8, unit: 'mg/dL', ref: '0.6–1.1', flag: '', t: -120 },
      { name: 'Potassium', val: 4.1, unit: 'mmol/L', ref: '3.5–5.0', flag: '', t: -120 },
      { name: 'Blood cultures', val: 'No growth at 24 h', unit: '', ref: '', flag: '', t: -120 },
    ],
    orders: [
      { t: -1400, text: 'Point-of-care glucose before meals and at bedtime.' },
      { t: -1400, text: 'Insulin lispro 6 units subQ with meals. Give within 15 minutes after the meal if intake is at least 50%. If intake is under 50%, hold and notify provider.' },
      { t: -1400, text: 'Insulin lispro correction scale before meals: 150–199 give 2 units; 200–249, 4; 250–299, 6; 300 or higher, 8 units and call.' },
      { t: -1400, text: 'Insulin glargine 18 units subQ at 21:00.' },
      { t: -1400, text: 'Cefazolin 2 g IV every 8 h.' },
      { t: -1400, text: 'Hypoglycemia protocol. Elevate left leg. Mark erythema borders every shift.' },
    ],
    notes: [
      { t: -120, author: 'Dana, night RN', text: 'Bedtime glucose 212, 4 units correction given. Slept fair. Queasy after the midnight cefazolin, no vomiting. Erythema still inside yesterday\'s pen line. Asked a lot of questions about amputation.' },
    ],
    io: { intake: 'PO 900 mL, IV 100 mL', output: 'Voiding, 3 times' },
    report: [
      { text: 'Grace Okafor, 46, left foot cellulitis on IV cefazolin. Type 2 diabetes, A1c 9.8. Sulfa allergy, hives.', key: false },
      { text: 'Bedtime glucose was 212. She got 4 units of correction.', key: false },
      { text: 'Pre-breakfast glucose is due at 07:30. Mealtime lispro 6 units, but only if she eats at least half.', key: true },
      { text: 'She got nauseous after the midnight cefazolin. Next dose is at 08:00.', key: true },
      { text: 'Redness is still inside the pen line. Not spreading.', key: false },
      { text: 'She\'s really scared about her foot. Her dad lost his leg to diabetes.', key: true },
    ],
    vitals(s, P) {
      const hypo = P.hypo && !P.hypoResolved;
      return { T: 37.5, HR: (hypo ? 108 : 82) + jit(s, 4), SBP: 128 + jit(s, 5) * 2, DBP: 78, RR: hypo ? 20 : 16, SpO2: 98, O2: 'Room air', pain: 3 };
    },
    assess: {
      general: (s, P) => P.hypo && !P.hypoResolved ? (P.hypoSevere ? 'Diaphoretic, pale, slow to answer. Words come out slurred.' : 'Sweating, hands trembling, anxious. "I feel weird."') : okaforNausea(s, P) ? 'Sitting up, grading on her tablet. Pale around the mouth, sipping ginger ale.' : 'Sitting up, grading on her tablet, alert and engaged.',
      resp: () => 'Clear in all fields. Even, unlabored.',
      cardiac: (s, P) => P.hypo && !P.hypoResolved ? 'Tachycardic, regular. Skin cool and clammy.' : 'Regular rate and rhythm. Pedal pulse on the left 1+, harder to feel through the edema.',
      neuro: (s, P) => P.hypo && !P.hypoResolved ? (P.hypoSevere ? 'Confused, slurred speech, follows commands slowly.' : 'Alert, anxious, tremulous. Oriented.') : 'Alert and oriented. Decreased sensation to monofilament on both feet (known neuropathy).',
      pain: () => 'Left foot 3/10, throbbing, better when elevated.',
      skin: (s, P, A) => { P.k.skin = s.t; return 'Left foot: erythema across the top of the foot, warm, 2+ edema. The margin sits inside yesterday\'s pen line. Not spreading. Small ulcer at the base of the great toe, clean, dressing dry.'; },
      gi: (s, P) => okaforNausea(s, P) ? 'Nauseous since the 08:00 cefazolin, no vomiting. Abdomen soft.' : 'No nausea. Abdomen soft. Voiding without problems.',
    },
    interventions: [
      { id: 'bg', label: 'Check blood glucose', cost: 3, run(s, P, A) { const v = checkBG(s, P, A, 'You'); return `Glucose ${v} mg/dL.` + (v < 70 ? ' Low.' : v >= 150 ? ' Correction scale applies.' : ''); } },
      {
        id: 'intake', label: 'Check breakfast intake', cost: 1, avail: (s) => s.t >= 75,
        run(s, P) {
          if (s.t < 88) return 'Tray just arrived. She\'s picking at toast. "Stomach\'s off."';
          P.intakeKnown = true; return 'About 20%: two bites of egg, half a slice of toast, some tea. "I can\'t. That antibiotic wrecks me."';
        },
      },
      {
        id: 'juice', label: 'Give 4 oz juice (15 g fast carbs)', cost: 2, avail: (s, P) => P.hypo && !P.hypoResolved && P.juiceAt === null,
        run(s, P, A) {
          if (P.hypoSevere) { A.judge('414-juice-unsafe', 'safety', -1, 'You tried oral juice when Mrs. Okafor could no longer swallow safely.', 'Once a patient with hypoglycemia is confused or slurring, oral carbohydrate risks aspiration. With IV access, IV dextrose per protocol is the route.', '414'); return 'She can\'t coordinate the straw. Juice dribbles down her chin. This needs the IV route now.'; }
          P.juiceAt = s.t;
          A.judge('414-juice', 'safety', 2, 'You treated Mrs. Okafor\'s hypoglycemia with 15 g of fast carbohydrate.', 'Alert and able to swallow: oral fast-acting carbs first. Save IV dextrose for patients who cannot swallow safely.', '414');
          return 'She drinks the juice. Recheck her glucose in 15 minutes.';
        },
      },
      {
        id: 'snack', label: 'Give a snack with protein', cost: 2, avail: (s, P) => P.hypo && !P.hypoResolved && P.juiceAt !== null && s.t - P.juiceAt >= 10,
        run(s, P, A) {
          if (okaforBG(s, P) < 70) return 'Recheck first. You don\'t know she\'s back above 70 yet.';
          P.snackAt = s.t; P.hypoResolved = true;
          A.judge('414-snack', 'judgment', 1, 'You followed the recovery with a protein-and-carb snack.', 'Fast carbs fix the number. A snack with protein keeps it fixed until the next meal, since the insulin she received is still working.', '414');
          return 'Peanut butter and crackers. Color comes back to her face. "That was scary."';
        },
      },
      {
        id: 'd50', label: 'Give IV dextrose 50% (protocol)', cost: 3, avail: (s, P) => P.hypo && !P.hypoResolved,
        run(s, P, A) {
          P.d50At = s.t; P.hypoResolved = true;
          if (P.hypoSevere) A.judge('414-d50', 'safety', 2, 'You gave IV dextrose when Mrs. Okafor could no longer swallow safely.', 'Altered mental status with hypoglycemia means the oral route is unsafe. IV dextrose per protocol, then recheck in 15 minutes.', '414');
          else A.judge('414-d50', 'meds', -1, 'You gave IV dextrose to a patient who was alert and able to drink juice.', 'D50 is caustic to veins and overshoots. The protocol starts with 15 g of oral carbohydrate when the patient can swallow.', '414');
          return 'Dextrose 50% pushed slowly through her IV. Within minutes she\'s blinking, clearer.';
        },
      },
    ],
    meds: [
      {
        id: '414-cef', name: 'Cefazolin', dose: '2 g', route: 'IV', freq: 'Every 8 h', due: 60,
        checks: () => [{ label: 'Allergy', value: 'Sulfa. No cross-reactivity with cefazolin.', ok: true }, { label: 'Last dose', value: '00:00, nausea afterward', ok: null }],
        give(s, P, A) {
          P.cefAt = s.t;
          if (s.t > 120) A.judge('414-cef-late', 'time', -1, 'Mrs. Okafor\'s 08:00 cefazolin was given more than an hour late.', 'Antibiotic timing keeps drug levels above the kill threshold. Most facilities allow a window of about an hour for time-critical doses.', '414');
          return 'Cefazolin 2 g infusing over 30 minutes.';
        },
      },
      {
        id: '414-corr', conditional: true, name: 'Insulin lispro, correction', dose: 'per scale', route: 'SubQ', freq: 'Before meals', due: 60,
        checks: (s, P) => [{ label: 'Glucose', value: P.bgAt !== null ? `${P.lastBG} mg/dL at ${clock(P.bgAt)}` : 'Not checked this shift', ok: recent(s, P.bgAt, 60) }, { label: 'Scale', value: '150–199: 2 u, 200–249: 4 u, 250–299: 6 u', ok: null }],
        block(s, P) { if (P.bgAt !== null && recent(s, P.bgAt, 60) && P.lastBG < 150) return `Glucose ${P.lastBG} is below the scale. No correction insulin is due.`; if (P.corrAt !== null) return 'Given at ' + clock(P.corrAt) + '.'; return null; },
        give(s, P, A) {
          const v = okaforBG(s, P); const u = v >= 250 ? 6 : v >= 200 ? 4 : v >= 150 ? 2 : 0;
          if (!recent(s, P.bgAt, 60)) A.judge('414-corr-blind', 'meds', -2, 'You gave correction insulin without a current glucose.', 'A correction scale is dosed from a number. Without a fresh point-of-care glucose, the dose is a guess.', '414');
          P.corrAt = s.t; return `Lispro ${u} units given in the abdomen.`;
        },
      },
      {
        id: '414-prand', name: 'Insulin lispro, mealtime', dose: '6 units', route: 'SubQ', freq: 'With meals', due: 75, param: 'Hold if intake < 50%, then notify provider',
        checks: (s, P) => [{ label: 'Breakfast intake', value: P.intakeKnown ? 'About 20%' : 'Not checked', ok: P.intakeKnown ? false : null }, { label: 'Glucose', value: P.bgAt !== null ? `${P.lastBG} at ${clock(P.bgAt)}` : 'Not checked', ok: recent(s, P.bgAt, 90) }],
        give(s, P, A) {
          if (!P.intakeKnown) A.judge('414-prand-blind', 'meds', -2, 'You gave Mrs. Okafor her mealtime insulin without checking how much she ate.', 'Mealtime (prandial) insulin covers the carbohydrate a patient actually eats. The order made it conditional on at least 50% intake. She ate about 20% because of nausea.', '414');
          else A.judge('414-prand-bad', 'meds', -2, 'You gave mealtime insulin after documenting 20% intake.', 'The order said hold if intake is under 50%. Rapid-acting insulin with almost no carbohydrate on board is a setup for hypoglycemia.', '414');
          P.prandAt = s.t; return 'Lispro 6 units given.';
        },
        hold(s, P, A) {
          P.prandHeld = true;
          if (P.intakeKnown) A.judge('414-prand-hold', 'meds', 2, 'You held Mrs. Okafor\'s mealtime insulin after confirming she ate only 20%.', 'You matched the insulin to what she ate, not to the clock. The order also asks you to notify the provider. Her nausea is the underlying problem worth reporting.', '414');
          else A.judge('414-prand-hold-guess', 'assess', 0, 'You held mealtime insulin without checking her intake first.', 'Right result, thin reasoning. Look at the tray: the decision should rest on the data the order names.', '414');
          return 'Held: intake under 50%. The order says to notify the provider.';
        },
      },
      {
        id: '414-ond', name: 'Ondansetron', dose: '4 mg', route: 'IV', freq: 'Every 6 h as needed, nausea', prn: true, available: (s, P) => P.ondOrdered,
        checks: () => [{ label: 'Indication', value: 'Nausea after cefazolin', ok: true }],
        give(s, P, A) { P.ondAt = s.t; A.judge('414-ond', 'judgment', 1, 'You treated the nausea that was driving Mrs. Okafor\'s poor intake.', 'Fixing the cause (nausea) protects both nutrition and glucose control. Otherwise you are managing insulin around a problem nobody is treating.', '414'); return 'Ondansetron 4 mg IV given.'; },
      },
      { id: '414-glar', name: 'Insulin glargine', dose: '18 units', route: 'SubQ', freq: 'Daily at 21:00', later: '21:00' },
    ],
    talk: (s, P) => (P.hypo && !P.hypoResolved) ? 'okafor_hypo' : !P.talked ? 'okafor_foot' : 'okafor_later',
    sbar: {
      items(s, P) {
        return [
          { id: 'bg', label: P.lastBG !== null ? `Glucose ${P.lastBG} at ${clock(P.bgAt)}` : 'Glucose not checked', key: true, need: P.bgAt !== null, lock: 'Check her glucose first' },
          { id: 'intake', label: 'Ate about 20% of breakfast', key: true, need: P.intakeKnown, lock: 'Check her tray first' },
          { id: 'nausea', label: 'Nauseous after each cefazolin dose', key: true, need: P.intakeKnown || P.assessAt.gi !== undefined, lock: 'Assess GI or check her tray' },
          { id: 'held', label: 'Held 6 units mealtime lispro per order', key: true, need: P.prandHeld, lock: 'Nothing held' },
          { id: 'hypo', label: 'Hypoglycemia this morning, treated', key: true, need: P.hypo, lock: 'No low this shift' },
          { id: 'foot', label: 'Erythema inside marked borders', key: false, need: P.k.skin !== undefined, lock: 'Assess her foot first' },
          { id: 'tablet', label: 'Grading lab reports in bed', key: false, need: true },
        ];
      },
      respond(s, P, A, picked) {
        const out = [];
        if (picked.includes('nausea')) { P.ondOrdered = true; A.addOrder('414', 'Ondansetron 4 mg IV every 6 h as needed for nausea.'); out.push('Give her ondansetron 4 mg IV for the nausea; I\'ve put the order in.'); A.judge('414-sbar-nausea', 'comm', 1, 'You reported the nausea behind Mrs. Okafor\'s poor intake and got it treated.', 'You gave the provider the cause, not just the consequence.', '414'); }
        if (picked.includes('held')) { P.notifiedHold = true; out.push('Good call holding the lispro. Keep holding if she eats less than half.'); }
        if (picked.includes('hypo')) { P.notifiedHold = true; A.addOrder('414', 'Hold mealtime lispro if intake < 50%. Glucose checks every hour for 2 hours.'); out.push('Glucose checks every hour for 2 hours, and hold the mealtime dose unless she eats.'); A.judge('414-sbar-hypo', 'comm', 1, 'You reported Mrs. Okafor\'s hypoglycemic episode to the provider.', 'Any hypoglycemia on insulin needs the provider to know: the regimen may need changing.', '414'); }
        return out.length ? out.join(' ') : 'Okay. Anything you need from me for her?';
      },
    },
    scene: (s, P) => ({ tray: s.t >= 75 ? (s.t >= 88 ? 'barely' : 'full') : 'none', iv: P.cefAt !== null && s.t - P.cefAt < 30 ? 'running' : 'lock', elevated: true, tablet: true, gingerale: true }),
    clues(s, P) {
      return {
        tray: s.t >= 88 ? 'Breakfast tray: eggs nearly untouched, half a slice of toast, tea. About 20% eaten.' : 'Breakfast tray, just delivered. She hasn\'t touched it.',
        leg: 'Left leg propped on two pillows. The erythema border is marked in pen with yesterday\'s date.',
        tablet: 'A tablet open to a stack of 7th-grade lab reports, red-pen annotations in the margins.',
        gingerale: 'A can of ginger ale, half full.',
        iv: 'Saline lock, left hand. Site clean.',
      };
    },
    rig: (s, P) => ({ glu: okaforBG(s, P), nausea: okaforNausea(s, P) }),
    status: (s, P) => (P.hypo && !P.hypoResolved) ? 'urgent' : 'stable',
    outcome(s, P) {
      if (P.hypoSevere) return { tone: 'bad', title: 'Severe hypoglycemia', text: 'Glucose fell into the 30s with confusion before she was treated. Preventable: the mealtime insulin was conditional on intake.' };
      if (P.hypo) return { tone: 'mixed', title: 'Low, caught and treated', text: 'Hypoglycemia after mealtime insulin on an empty stomach. Treated well, but it didn\'t need to happen.' };
      return { tone: 'good', title: 'Steady glucose, foot improving', text: 'Glucose stayed in range. Erythema within the marked borders. ' + (P.ondOrdered ? 'Her nausea is finally being treated.' : 'Her nausea is still unaddressed.') };
    },
  };

  /* ---------- 416 Eleanor Whitfield: urosepsis ---------- */
  const tier = (sv) => sv < 35 ? 0 : sv < 55 ? 1 : sv < 75 ? 2 : 3;
  const whitfield = {
    id: '416', room: '416', name: 'Eleanor Whitfield', short: 'Mrs. Whitfield', age: 82, sex: 'F',
    look: { skin: '#F0D2BE', shade: '#D2A48C', lip: '#B4655F', blush: '#E88A83', iris: '#5B7E9C', head: { w: 57, h: 59, jaw: .1 }, eye: 9.6,
      hair: { style: 'curls', color: '#ECE8E3' }, brow: { w: 3, color: '#BDB6AE' }, body: { w: 66, cloth: 'gown', cardigan: '#D98F9C' }, extras: ['pearls', 'wrinkles'], smile: .35, guard: true,
      lines: { calm: 'Is Ruth coming today, dear? Somebody has to feed Biscuit.', confused: 'I have to get home. Biscuit hasn\'t eaten since Tuesday.', fever: 'Something\'s wrong, isn\'t it, dear?', drowsy: 'Mm? Oh. Hello.', dys: 'I can\'t seem to catch up.', none: 'Her eyes flutter at your voice, then close.' } },
    bio: 'Retired children\'s librarian. Lives alone with a cat named Biscuit. Daughter Ruth lives 40 minutes away.',
    dx: 'Urinary tract infection with confusion', reason: 'UTI, acute confusion',
    hx: ['Hypertension', 'Hypothyroidism', 'Osteoarthritis, both knees'],
    allergies: 'Penicillin, reaction unknown', code: 'Full code', weight: '58 kg',
    lines: ['PIV 20g right antecubital, normal saline at 75 mL/h'], mobility: 'Up with assist of 1. High fall risk (Morse 55).', diet: 'Regular',
    init: { sev: 22, allergyInfo: false, baseline: false, abxAvail: null, abxAt: null, escalated: false, bundle: false, bundleLate: false, culturesAt: null, lactAt: null, lactResult: null, lactReported: false, bolusAt: null, fallPrec: false, rrt: false, icu: false, apapAt: null, lisinoprilAt: null, pharmAsked: false },
    nightVitals: { T: 37.9, HR: 98, SBP: 116, DBP: 68, RR: 20, SpO2: 95, O2: 'Room air', pain: 2 },
    labs: [
      { name: 'WBC', val: 13.2, unit: 'K/µL', ref: '4.5–11.0', flag: 'H', t: -270 },
      { name: 'Creatinine', val: 1.3, unit: 'mg/dL', ref: '0.6–1.1 (her baseline 0.9)', flag: 'H', t: -270 },
      { name: 'Sodium', val: 134, unit: 'mmol/L', ref: '135–145', flag: 'L', t: -270 },
      { name: 'Urinalysis', val: 'Nitrite +, leukocyte esterase large, many bacteria', unit: '', ref: '', flag: 'A', t: -280 },
      { name: 'Urine culture', val: 'Pending', unit: '', ref: '', flag: '', t: -280 },
    ],
    orders: [
      { t: -280, text: 'Ceftriaxone 1 g IV every 24 h. (Pharmacy verification pending: allergy.)' },
      { t: -280, text: 'Normal saline at 75 mL/h.' },
      { t: -280, text: 'Lisinopril 10 mg PO daily, hold SBP < 100. Levothyroxine 50 mcg daily at 06:00.' },
      { t: -280, text: 'Acetaminophen 650 mg PO every 6 h as needed for T > 38.3 or pain.' },
      { t: -280, text: 'Vital signs every 4 h. Fall precautions. AM CBC and BMP.' },
    ],
    notes: [
      { t: -40, author: 'Dana, night RN', text: 'Admitted 02:10 from the ED. Pleasantly confused, pulled at her IV once. Kept saying she needed to feed the cat. Sleepy but arousable. Voided 150 mL dark amber at 05:00. Ceftriaxone not given: pharmacy flagged the penicillin allergy. Daughter Ruth\'s number is on the facesheet.' },
      { t: -300, author: 'ED provider', text: '82F, daughter reports she has been "a bit off" since yesterday. Dysuria for 3 days per daughter. UA consistent with UTI. Admit to medicine.' },
    ],
    io: { intake: 'IV 375 mL, PO 120 mL', output: 'Urine 150 mL (one void, 05:00)' },
    report: [
      { text: 'Eleanor Whitfield, 82, came up at 2 a.m. with a UTI. Full code. Penicillin allergy, reaction unknown.', key: false },
      { text: 'She\'s pleasantly confused. Kept asking about feeding her cat. Pulled at her IV once.', key: true },
      { text: 'Temp 37.9, heart rate 98. Pressure was 116/68 at 06:30.', key: true },
      { text: 'She only voided once, 150 mL at 5, dark.', key: true },
      { text: 'Her ceftriaxone hasn\'t gone in. Pharmacy is holding it for the penicillin allergy.', key: true },
      { text: 'Daughter Ruth is on the facesheet. I didn\'t get a chance to call her.', key: false },
      { text: 'She\'s sweet. Pretty sleepy. Probably just sundowning, honestly.', key: false },
    ],
    vitals(s, P) {
      const sv = P.sev, apap = P.apapAt !== null && s.t - P.apapAt > 30 && s.t - P.apapAt < 240 ? 0.6 : 0;
      const sbp = Math.round(131 - 0.7 * sv) + jit(s, 6) * 2;
      return {
        T: +(37.6 + 0.016 * sv - apap).toFixed(1), HR: Math.round(88 + 0.45 * sv) + jit(s, 7), SBP: sbp, DBP: Math.round(sbp * 0.58),
        RR: Math.round(18 + 0.12 * sv), SpO2: Math.round(97 - 0.07 * sv), O2: 'Room air', pain: 3,
      };
    },
    assess: {
      general: (s, P) => ['Drowsy in bed, blanket pulled to her chin. Rouses to her name.', 'Restless, picking at the sheets and her IV tubing. Flushed.', 'Lethargic. Opens her eyes to voice, then drifts. Skin hot.', 'Barely rousable. Mottled knees. Breathing fast.'][tier(P.sev)],
      resp: (s, P, A) => `Clear but diminished at the bases. RR ${A.vitals('416').RR}, shallow.`,
      cardiac: (s, P, A) => { const v = A.vitals('416'); return `HR ${v.HR}, regular. Capillary refill ${P.sev > 60 ? '4' : '3'} seconds. ${P.sev >= 70 ? 'Knees mottled, feet cool.' : 'Extremities warm.'}`; },
      neuro: (s, P) => {
        P.k.confusion = s.t;
        const t = ['Oriented to self and place, not to date or situation. Drowsy, answers slowly.', 'Oriented to self only. Inattentive: can\'t say the months backward past November. Picking at the sheets.', 'Lethargic. Mumbles, cannot follow a two-step command.', 'Responds only to firm touch.'][tier(P.sev)];
        return t + (P.baseline ? ' Ruth says her baseline is fully oriented. This is an acute change.' : ' Her baseline mental status isn\'t documented.');
      },
      pain: () => '"My back hurts, dear." Points to her lower back and right flank. 3/10.',
      skin: (s, P) => P.sev >= 70 ? 'Hot centrally, cool mottled knees. Dry mucous membranes.' : 'Warm and flushed. Dry lips, dry mucous membranes. Skin intact.',
      gi: (s, P) => { P.k.uop = s.t; return `No void since 05:00. Bladder scan shows 90 mL. Urine output is about ${P.sev > 60 ? '10' : '25'} mL/h, below 0.5 mL/kg/h for her 58 kg.`; },
    },
    interventions: [
      {
        id: 'fall', label: 'Start fall precautions (bed alarm, low bed, call light, socks)', cost: 3, avail: (s, P) => !P.fallPrec,
        run(s, P, A) { P.fallPrec = true; A.judge('416-fall', 'safety', 1, 'You set up fall precautions for Mrs. Whitfield.', 'New confusion plus an IV, urgency from a UTI and a Morse of 55: she will try to get up. The alarm buys the seconds that prevent a hip fracture.', '416'); return 'Bed low and locked, alarm on, non-skid socks, call light clipped to her gown. "You\'re fussing," she says, not unkindly.'; },
      },
      { id: 'reorient', label: 'Reorient her and offer fluids', cost: 3, run: (s, P) => P.sev < 55 ? 'You tell her where she is and why. She takes three sips of water. "Is Ruth coming?"' : 'She can\'t hold the cup. Her mouth is dry. She\'s too drowsy to drink safely.' },
      {
        id: 'cult', label: 'Draw blood cultures × 2 (ordered)', cost: 6, avail: (s, P) => P.bundle && P.culturesAt === null,
        run(s, P, A) { P.culturesAt = s.t; if (P.abxAt === null) A.judge('416-cult', 'judgment', 1, 'You drew blood cultures before Mrs. Whitfield\'s first antibiotic dose.', 'Cultures first when it won\'t delay antibiotics. Once antibiotics are in, bacteria may no longer grow and the organism can be missed.', '416'); return 'Two sets drawn from two sites. Labeled at the bedside.'; },
      },
      {
        id: 'lact', label: 'Send lactate (ordered)', cost: 2, avail: (s, P) => P.bundle && P.lactAt === null,
        run(s, P) { P.lactAt = s.t; return 'Lactate drawn and tubed to the lab. Result in about 30 minutes.'; },
      },
      {
        id: 'bolus', label: 'Start 1,000 mL normal saline bolus (ordered)', cost: 4, avail: (s, P) => P.bundle && P.bolusAt === null,
        run(s, P, A) { P.bolusAt = s.t; A.judge('416-bolus', 'judgment', 2, 'You started Mrs. Whitfield\'s fluid bolus.', 'Sepsis-induced hypotension is a volume problem first: dilated vessels and leaky capillaries. Fluids restore perfusion; the lactate tells you whether it worked.', '416'); return 'Bolus running wide open on the pump, 1,000 mL over an hour. Watch her lungs as it goes in.'; },
      },
    ],
    comms: [
      {
        id: 'pharm', label: 'Call pharmacy about the ceftriaxone', cost: 3, avail: (s, P, A) => A.s.meds['416-cef'].status === 'verify' && P.abxAvail === null,
        run(s, P, A) {
          P.pharmAsked = true;
          if (!P.allergyInfo) return 'Omar, pharmacy: "I need to know what the penicillin reaction was and whether she\'s had a cephalosporin before. Can you find out? Until then I can\'t verify it."';
          P.abxAvail = s.t + 15;
          A.judge('416-pharm', 'comm', 2, 'You clarified Mrs. Whitfield\'s allergy with her daughter and closed the loop with pharmacy.', 'A childhood rash to penicillin and a tolerated cephalosporin since then makes ceftriaxone low risk. Every hour of delayed antibiotics in sepsis raises mortality. The fastest path was a phone call, not a note.', '416');
          return 'Omar: "Childhood rash, tolerated Keflex. That works. Verifying now. It\'ll be in the tube station in 15."';
        },
      },
      {
        id: 'rrt', label: 'Call a rapid response', cost: 3, avail: (s, P) => !P.rrt && !P.icu,
        run(s, P, A) {
          P.rrt = true;
          if (P.sev >= 55) {
            P.escalated = true; P.bundle = true; if (P.bolusAt === null) P.bolusAt = s.t;
            if (P.abxAt === null) { P.abxAvail = s.t; A.s.meds['416-cef'].status = 'due'; }
            A.judge('416-rrt', 'judgment', 2, 'You called a rapid response for Mrs. Whitfield.', 'Hypotension, tachycardia, fever and altered mentation meet rapid response criteria. Calling is the right move, and the earlier the better.', '416');
            return 'The rapid response team arrives in four minutes. Bolus started, cultures and lactate drawn, and the ICU resident overrides the antibiotic hold. "Good call. Let\'s see how she responds."';
          }
          P.escalated = true; P.bundle = true;
          A.judge('416-rrt-early', 'judgment', 1, 'You called a rapid response early for Mrs. Whitfield.', 'Early calls are never wrong. A clear SBAR to her provider often gets the same orders faster, but trusting your worry is the habit that saves lives.', '416');
          A.addOrder('416', 'Sepsis bundle: blood cultures × 2, lactate, normal saline 1,000 mL bolus. Vitals every 15 min × 4.');
          return 'The rapid response nurse looks her over. "Early sepsis picture. Agree with your concern." Sepsis orders are entered for you to start.';
        },
      },
    ],
    family: { name: 'Ruth', rel: 'Daughter', mode: 'phone', cost: 5, dialog: () => 'ruth_call' },
    meds: [
      {
        id: '416-cef', name: 'Ceftriaxone', dose: '1 g', route: 'IV', freq: 'Every 24 h', due: 60, initStatus: 'verify',
        checks: (s, P) => [{ label: 'Allergy', value: P.allergyInfo ? 'Penicillin: childhood rash. Tolerated cephalexin in 2024.' : 'Penicillin, reaction unknown', ok: P.allergyInfo ? true : null }],
        give(s, P, A) {
          P.abxAt = s.t;
          if (s.t <= 150) A.judge('416-abx-time', 'time', 1, 'Mrs. Whitfield\'s first antibiotic dose went in by mid-morning.', 'In suspected sepsis, antibiotics within an hour of recognition is the standard. It started 6 hours after admission because of the allergy hold.', '416');
          else A.judge('416-abx-late', 'time', -1, 'Mrs. Whitfield\'s first antibiotic dose was delayed past 09:30.', 'She arrived at 02:00. Each hour of antibiotic delay in sepsis raises mortality. The block was a phone call to her daughter.', '416');
          return 'Ceftriaxone 1 g IV over 30 minutes. Watching for any reaction.';
        },
      },
      {
        id: '416-lis', name: 'Lisinopril', dose: '10 mg', route: 'PO', freq: 'Daily', due: 120, param: 'Hold if SBP < 100',
        checks: (s, P, A) => { const v = A.lastVitals('416'); return [{ label: 'Latest BP', value: `${v.SBP}/${v.DBP} at ${clock(v.t)}`, ok: v.SBP >= 100 }, { label: 'Trend', value: `Admission 128/74, 06:35 116/68`, ok: null }]; },
        give(s, P, A) {
          const v = A.vitals('416'); P.lisinoprilAt = s.t;
          if (v.SBP < 100) { A.judge('416-lis', 'meds', -2, `You gave lisinopril with an SBP of ${v.SBP}.`, 'The hold parameter exists for exactly this. In early sepsis an ACE inhibitor worsens hypotension and kidney perfusion.', '416'); P.sev = Math.min(100, P.sev + 10); }
          else if (P.sev >= 38) { A.judge('416-lis', 'judgment', -1, 'You gave lisinopril to a patient whose BP was drifting down with an infection.', 'Within parameters is not the same as safe. Her BP had fallen since admission, her creatinine was rising, and she was likely early sepsis. Hold and clarify.', '416'); P.sev = Math.min(100, P.sev + 5); }
          return 'Lisinopril 10 mg given.';
        },
        hold(s, P, A) { A.judge('416-lis-hold', 'meds', 1, 'You held Mrs. Whitfield\'s lisinopril.', 'A falling BP, rising creatinine and infection: holding an ACE inhibitor protects perfusion and kidneys.', '416'); return 'Held: BP soft and trending down, creatinine rising.'; },
      },
      {
        id: '416-apap', name: 'Acetaminophen', dose: '650 mg', route: 'PO', freq: 'Every 6 h as needed, T > 38.3 or pain', prn: true,
        checks: (s, P, A) => { const v = A.lastVitals('416'); return [{ label: 'Latest temp', value: `${v.T} °C at ${clock(v.t)}`, ok: v.T > 38.3 ? true : null }, { label: 'Swallow', value: P.sev >= 60 ? 'Too drowsy to swallow safely' : 'Swallowing OK', ok: P.sev < 60 }]; },
        block: (s, P) => P.apapAt !== null && s.t - P.apapAt < 360 ? 'Given at ' + clock(P.apapAt) + '.' : null,
        give(s, P, A) { if (P.sev >= 60) { A.judge('416-apap-asp', 'safety', -1, 'You gave oral medication to a patient too drowsy to swallow safely.', 'Aspiration risk rises with sedation or delirium. Assess swallow before anything by mouth.', '416'); } P.apapAt = s.t; return 'Acetaminophen 650 mg given. It will lower the fever, but it won\'t treat the cause.'; },
      },
      { id: '416-levo', name: 'Levothyroxine', dose: '50 mcg', route: 'PO', freq: 'Daily at 06:00', initStatus: 'given', givenNote: 'Given 06:00 by Dana' },
    ],
    talk: (s, P) => P.icu ? null : P.sev >= 48 ? 'whitfield_scared' : 'whitfield_early',
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('416'), first = P.vit[0] || v, fresh = s.t - v.t <= 60;
        return [
          { id: 'base', label: 'Acute confusion. Ruth says she is sharp at baseline.', key: true, need: P.baseline && P.k.confusion !== undefined, lock: 'Assess her mentation and learn her baseline' },
          { id: 'conf', label: 'Confused and inattentive, picking at sheets', key: true, need: P.k.confusion !== undefined, lock: 'Do a neuro assessment first' },
          { id: 'vit', label: `T ${v.T}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR} (at ${clock(v.t)})`, key: fresh, need: true },
          { id: 'trend', label: v.SBP < first.SBP - 2 ? `BP down from ${first.SBP}/${first.DBP} at 06:35` : `BP ${v.SBP}/${v.DBP}, about the same as 06:35`, key: v.SBP < first.SBP - 8, need: fresh, lock: 'Get a current set of vitals' },
          { id: 'uop', label: 'Urine output about 25 mL/h, nothing since 05:00', key: true, need: P.k.uop !== undefined, lock: 'Check her output' },
          { id: 'labs', label: (() => { const w = P.labs.filter((l) => l.name === 'WBC').pop(), c = P.labs.filter((l) => l.name === 'Creatinine').pop(); return `WBC ${w.val}, creatinine ${c.val} (baseline 0.9)`; })(), key: true, need: s.t >= 180, lock: 'AM labs not back yet' },
          { id: 'lact', label: P.lactResult ? `Lactate ${P.lactResult} mmol/L` : 'Lactate', key: true, need: P.lactResult !== null, lock: 'No lactate result' },
          { id: 'abx', label: 'No antibiotic yet. Pharmacy allergy hold.', key: P.abxAt === null, need: true },
          { id: 'levo', label: 'Levothyroxine given at 06:00', key: false, need: true },
          { id: 'cat', label: 'Worried about her cat, Biscuit', key: false, need: true },
        ];
      },
      requests: [
        { id: 'sepsis', label: 'I\'m concerned about sepsis. Can you see her, and can we get cultures, a lactate and a fluid bolus?' },
        { id: 'sleep', label: 'Can we get something to help her rest? She\'s agitated.' },
        { id: 'fyi', label: 'Just keeping you updated.' },
        { id: 'sitter', label: 'Can we get a sitter for her confusion?' },
      ],
      respond(s, P, A, picked, req) {
        const items = this.items(s, P, A); const keys = picked.filter((id) => (items.find((i) => i.id === id) || {}).key).length;
        if (picked.includes('lact')) P.lactReported = true;
        if (P.bundle) { return 'I\'m following her. Keep me posted on the lactate and her pressure after the bolus.'; }
        if (req === 'sleep') { A.judge('416-sleep', 'judgment', -2, 'You asked for sedation for Mrs. Whitfield\'s agitation.', 'New agitation in an older adult with infection is a symptom, not the problem. Sedatives worsen delirium and mask deterioration. Find and treat the cause.', '416'); return 'Nothing sedating for an 82-year-old with new delirium. What are her vitals doing?'; }
        if (keys >= 3) {
          P.escalated = true; P.bundle = true; A.addOrder('416', 'Sepsis bundle: blood cultures × 2, lactate, normal saline 1,000 mL bolus. Vitals every 15 min × 4. Hold lisinopril.');
          if (P.abxAt === null && s.meds['416-cef'].status === 'verify') { P.abxAvail = s.t + 20; }
          A.judge('416-sbar', 'comm', req === 'sepsis' ? 2 : 1, req === 'sepsis' ? 'Your SBAR on Mrs. Whitfield named sepsis and asked for specific orders.' : 'You gave Dr. Chen the right data on Mrs. Whitfield, but didn\'t say what you were worried about.', 'Assessment and Recommendation are where nurses change outcomes: say what you think is happening and what you need. The pattern (fever, tachycardia, falling BP, acute confusion, low urine output) is sepsis until proven otherwise.', '416');
          return (req === 'sepsis' ? 'Agree. ' : 'That sounds like sepsis. ') + 'Cultures times two, lactate, a liter bolus now. I\'ll call pharmacy about the ceftriaxone myself. I\'m coming to see her.';
        }
        if (req === 'sepsis') { A.judge('416-sbar-thin', 'comm', -1, 'You raised sepsis for Mrs. Whitfield without the data to back it.', 'Providers act on patterns. A concern plus current vitals, trend, mental status versus baseline and urine output makes a case. A concern alone gets a "watch her."', '416'); P.lactAt = P.lactAt === null ? s.t : P.lactAt; A.addOrder('416', 'Lactate now.'); return 'What\'s making you think sepsis? I\'ll order a lactate. Call me back with the result and a fresh set of vitals.'; }
        A.judge('416-sbar-miss', 'comm', -1, 'Your update on Mrs. Whitfield didn\'t give Dr. Chen enough to act on.', 'An update without a current assessment and a clear concern invites "keep an eye on her." Gather the cues first: vitals trend, mentation compared with baseline, urine output, labs.', '416');
        return 'Okay, keep an eye on her and let me know if anything changes.';
      },
    },
    scene: (s, P) => ({ tray: s.t >= 75 ? 'untouched' : 'none', iv: P.bolusAt !== null && s.t - P.bolusAt < 60 ? 'bolus' : 'running', fallPrec: P.fallPrec, empty: P.icu, flowers: true }),
    clues(s, P) {
      return {
        tray: 'Breakfast tray: oatmeal skinned over, untouched.',
        iv: P.bolusAt !== null && s.t - P.bolusAt < 60 ? 'Pump running the 1,000 mL bolus.' : 'Normal saline at 75 mL/h. Site dry, taped well. She\'s picked at the tape.',
        flowers: 'A card on the table: "Get well, Grandma! Love, Theo," drawn in crayon.',
        alarm: P.fallPrec ? 'Bed alarm armed. Bed low and locked.' : 'Bed at working height. No alarm set. Side rails half up.',
        urinal: 'A hat in the toilet. Empty.',
      };
    },
    rig: (s, P) => ({ alert: P.sev >= 75 ? 2 : P.sev >= 55 ? 1 : (P.sev >= 15 && P.sev < 35) ? 1 : 0, confused: P.sev >= 15 && P.sev < 75 }),
    status: (s, P) => P.icu ? 'gone' : P.sev >= 58 ? 'urgent' : P.sev >= 40 ? 'watch' : 'stable',
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Septic shock, transferred to ICU', text: 'Found hypotensive and hard to rouse. The cues were there at 07:00: fever, tachycardia, new confusion, low urine output and a delayed antibiotic.' };
      if (P.bundle && P.sev < 35) return { tone: P.bundleLate ? 'mixed' : 'good', title: P.bundleLate ? 'Stabilized after a late catch' : 'Early sepsis, caught and turning', text: P.bundleLate ? 'Dr. Chen found her on rounds. She responded to fluids and antibiotics, but those hours were avoidable.' : `BP back above 110${P.lactResult !== null ? ', lactate clearing' : ''}, more awake. She asked about her cat by name. Early recognition changed her trajectory.` };
      if (P.bundle) return { tone: 'mixed', title: 'Sepsis being treated, not yet turning', text: 'Orders are in, but she still needs fluids, antibiotics and reassessment to stabilize.' };
      return { tone: 'bad', title: 'Unrecognized sepsis', text: 'Still febrile, tachycardic and hypotensive at handoff with no sepsis workup. The next shift inherits a patient in trouble.' };
    },
  };

  /* ---------- 418 Samuel Ortiz: heart failure ---------- */
  const ortizBrady = (s, P) => P.metoAt !== null && P.metoHR < 55 && s.t >= P.metoAt + 25 && s.t < P.metoAt + 150;
  const ortiz = {
    id: '418', room: '418', name: 'Samuel Ortiz', short: 'Mr. Ortiz', age: 71, sex: 'M',
    look: { skin: '#B47A51', shade: '#8F5E3B', lip: '#7A3F2C', blush: '#C4674D', iris: '#3B2616', head: { w: 64, h: 61, jaw: .5 }, eye: 9.8,
      hair: { style: 'balding', color: '#D9D3CB' }, brow: { w: 5.8, color: '#C8C0B6' }, body: { w: 98, cloth: 'gown' }, extras: ['mustache', 'cannula', 'wrinkles'], smile: .45,
      lines: { calm: 'Mija, tell Rosa to stop worrying. I\'m fine.', dizzy: 'The room is swimming, mijo.', dys: 'Can\'t... catch... my breath.', drowsy: 'Just tired.', none: 'He doesn\'t answer.' } },
    bio: 'Retired landscaper. Warm, teasing, calls everyone "mijo" or "mija." His wife Rosa rarely leaves his side.',
    dx: 'Heart failure exacerbation (EF 30%)', reason: 'Acute on chronic systolic heart failure',
    hx: ['Heart failure with reduced ejection fraction', 'Atrial fibrillation, on apixaban', 'Chronic kidney disease stage 3'],
    allergies: 'Lisinopril (cough). An intolerance, not an allergy.', code: 'Full code', weight: '85.2 kg today (84.6 yesterday, 87.0 on admission)',
    lines: ['PIV 20g left forearm, saline lock', 'Telemetry', 'Oxygen 2 L nasal cannula'], mobility: 'Up with assist of 1. Tires quickly.', diet: '2 g sodium, 1.5 L fluid restriction',
    init: { fl: 50, metoAt: null, metoHR: null, metoHeld: false, notifiedMeto: false, lasixAt: null, kclAt: null, kSeen: false, notifiedK: false, kxOrdered: false, lx80: false, educated: false, bradyCare: false, overload: false, o2: 2, hob: false, losAt: null },
    nightVitals: { T: 36.8, HR: 58, SBP: 108, DBP: 64, RR: 20, SpO2: 94, O2: '2 L NC', pain: 0 },
    labs: [
      { name: 'Potassium', val: 3.3, unit: 'mmol/L', ref: '3.5–5.0', flag: 'L', t: -120 },
      { name: 'Magnesium', val: 1.8, unit: 'mg/dL', ref: '1.7–2.2', flag: '', t: -120 },
      { name: 'Sodium', val: 136, unit: 'mmol/L', ref: '135–145', flag: '', t: -120 },
      { name: 'Creatinine', val: 1.4, unit: 'mg/dL', ref: '0.7–1.3 (his baseline 1.3)', flag: 'H', t: -120 },
      { name: 'BNP', val: 1450, unit: 'pg/mL', ref: '< 100 (2,210 on admission)', flag: 'H', t: -120 },
      { name: 'Hemoglobin', val: 12.9, unit: 'g/dL', ref: '13.5–17.5', flag: 'L', t: -120 },
    ],
    orders: [
      { t: -2800, text: 'Telemetry. Daily weight. Strict intake and output. 2 g sodium diet, 1.5 L fluid restriction.' },
      { t: -2800, text: 'Oxygen by nasal cannula, titrate to SpO₂ ≥ 92%, max 4 L.' },
      { t: -2800, text: 'Metoprolol succinate 50 mg PO daily. Hold for HR < 55 or SBP < 90.' },
      { t: -2800, text: 'Losartan 25 mg PO daily, hold SBP < 100. Furosemide 40 mg IV twice daily.' },
      { t: -2800, text: 'Potassium chloride 20 mEq PO daily. Apixaban 5 mg PO twice daily.' },
    ],
    notes: [
      { t: -30, author: 'Dana, night RN', text: 'Slept on 3 pillows. Weight up 0.6 kg from yesterday. Rosa brought food from home; I talked with her and she said "he has to eat something he likes." HR 50s to 60s in AFib overnight. K 3.3, day team to address. 350 mL urine after the 21:00 furosemide.' },
    ],
    io: { intake: 'PO 1,900 mL yesterday (limit 1,500)', output: 'Urine 1,450 mL yesterday' },
    report: [
      { text: 'Samuel Ortiz, 71, heart failure exacerbation, EF 30. AFib on apixaban. Full code.', key: false },
      { text: 'On 2 liters, sats 94. He slept on three pillows.', key: true },
      { text: 'Heart rate ran 50s to 60s in AFib overnight. He\'s got metoprolol at 9.', key: true },
      { text: 'His potassium is 3.3 this morning and he\'s getting IV furosemide at 9.', key: true },
      { text: 'Weight\'s up 0.6 from yesterday. Rosa keeps bringing food and big sodas.', key: true },
      { text: 'Lisinopril made him cough, so he\'s on losartan. That\'s charted as an allergy but it isn\'t really.', key: false },
    ],
    vitals(s, P) {
      const b = ortizBrady(s, P), ex = Math.max(0, P.fl - 50);
      const sbp = b ? 86 : 104 - (P.lasixAt !== null && s.t > P.lasixAt + 30 ? 4 : 0) - (P.losAt !== null && s.t > P.losAt + 60 ? 3 : 0) + jit(s, 8) * 2;
      return {
        T: 36.8, HR: b ? 44 + jit(s, 9) : (s.t < 30 ? 57 : 53) + jit(s, 9), SBP: sbp, DBP: b ? 48 : 60,
        RR: 20 + Math.round(ex * 0.35), SpO2: Math.min(97, 95 - Math.round(ex * 0.3) + (P.o2 >= 4 ? 3 : 0) + (P.hob ? 1 : 0)), O2: P.o2 + ' L NC', pain: 0, rhythm: b ? 'Slow AFib' : 'AFib',
      };
    },
    assess: {
      general: (s, P) => ortizBrady(s, P) ? 'Pale, eyes half closed. "The room is swimming, mijo."' : P.fl >= 60 ? 'Sitting bolt upright, gripping the rails. Talking in short phrases.' : 'Propped on pillows, joking with Rosa. A little winded when he laughs.',
      resp: (s, P) => { P.k.resp = s.t; return P.fl >= 60 ? 'Crackles halfway up both lung fields. Using his neck muscles to breathe. Speaks 3 to 4 words at a time.' : 'Fine crackles at both bases. Mild dyspnea on exertion. Sleeps on 3 pillows.'; },
      cardiac: (s, P, A) => { const v = A.vitals('418'); P.k.hrAt = s.t; P.k.hr = v.HR; return `Apical pulse ${v.HR}, irregularly irregular (AFib), counted for a full minute. JVD visible at 45°. 2+ pitting edema to mid-shin, both legs.`; },
      neuro: (s, P) => ortizBrady(s, P) ? 'Alert but lightheaded, especially sitting up.' : 'Alert, oriented, sharp. Asks about the Dodgers.',
      pain: () => 'No chest pain. No pain anywhere. "Just tired."',
      skin: () => 'Legs shiny and tight with edema. No breakdown. Warm.',
      gi: (s, P) => { P.k.io = s.t; return 'Took in 1,900 mL yesterday against a 1.5 L limit. Output 1,450. Urinal at the bedside.'; },
    },
    interventions: [
      { id: 'hob', label: 'Raise head of bed to high Fowler\'s', cost: 1, avail: (s, P) => !P.hob, run(s, P, A) { P.hob = true; if (P.fl >= 60) A.judge('418-hob', 'safety', 1, 'You sat Mr. Ortiz upright when he became short of breath.', 'High Fowler\'s drops venous return and lets the diaphragm work: the fastest free intervention in pulmonary congestion.', '418'); return 'Bed up to 80 degrees, legs dependent. "Better, mijo."'; } },
      { id: 'o2', label: 'Increase oxygen to 4 L (order: titrate to ≥ 92%)', cost: 1, avail: (s, P) => P.o2 < 4, run(s, P, A) { const v = A.vitals('418'); P.o2 = 4; if (v.SpO2 < 92) A.judge('418-o2', 'safety', 1, 'You titrated Mr. Ortiz\'s oxygen for SpO₂ below 92%.', 'The order gives you a target. Titrating to it is a nursing action, then you reassess.', '418'); return v.SpO2 < 92 ? 'Up to 4 L. Give it a few minutes, then recheck.' : 'Up to 4 L. His SpO₂ was already at goal. The order titrates to 92%, not to 100.'; } },
      { id: 'apical', label: 'Count apical pulse and check BP', cost: 2, run(s, P, A) { const v = A.recordVitals('418', 'You'); P.k.hrAt = s.t; P.k.hr = v.HR; return `Apical ${v.HR}, irregularly irregular, full minute. BP ${v.SBP}/${v.DBP}.`; } },
      { id: 'brady', label: 'Lay him back, hold further doses, stay with him', cost: 3, avail: (s, P) => ortizBrady(s, P) && !P.bradyCare, run(s, P, A) { P.bradyCare = true; A.judge('418-brady-care', 'safety', 1, 'You kept Mr. Ortiz supine and monitored his symptomatic bradycardia.', 'Lying flat supports cerebral perfusion. Then notify the provider, and have atropine and pads nearby if he worsens.', '418'); return 'Head of bed down, call light in his hand, Rosa beside him. Monitor reads 44. He\'s talking, lightheaded, no chest pain.'; } },
    ],
    family: { name: 'Rosa', rel: 'Wife', mode: 'bedside', cost: 3, dialog: (s, P) => P.educated ? 'rosa_after' : 'rosa_talk' },
    meds: [
      {
        id: '418-meto', name: 'Metoprolol succinate', dose: '50 mg', route: 'PO', freq: 'Daily', due: 120, param: 'Hold for HR < 55 or SBP < 90',
        checks: (s, P) => [{ label: 'Apical pulse', value: recent(s, P.k.hrAt, 30) ? `${P.k.hr} at ${clock(P.k.hrAt)}` : 'Not counted in the last 30 min', ok: recent(s, P.k.hrAt, 30) ? P.k.hr >= 55 : false }],
        give(s, P, A) {
          const v = A.vitals('418'); P.metoAt = s.t; P.metoHR = v.HR;
          if (!recent(s, P.k.hrAt, 30)) A.judge('418-meto-blind', 'meds', -2, 'You gave metoprolol without counting Mr. Ortiz\'s apical pulse.', 'Beta-blockers slow the heart. The hold parameter only protects him if someone checks the number, for a full minute in AFib.', '418');
          if (v.HR < 55) A.judge('418-meto-low', 'meds', -3, `You gave metoprolol with a heart rate of ${v.HR}.`, 'The order said hold for HR under 55. He was already slow in AFib overnight. The beta-blocker pushed him into symptomatic bradycardia.', '418');
          return 'Metoprolol 50 mg given.';
        },
        hold(s, P, A) {
          P.metoHeld = true;
          if (recent(s, P.k.hrAt, 30)) A.judge('418-meto-hold', 'meds', 2, `You counted an apical pulse of ${P.k.hr} and held Mr. Ortiz\'s metoprolol.`, 'Assess, compare with the parameter, act. Then tell the provider: a held cardiac med is information they need.', '418');
          else A.judge('418-meto-hold-guess', 'assess', -1, 'You held metoprolol without a current heart rate.', 'Right call, unverified. Hold decisions rest on data you collected, not on report from hours ago.', '418');
          return 'Held: HR below 55. Notify the provider.';
        },
      },
      {
        id: '418-los', name: 'Losartan', dose: '25 mg', route: 'PO', freq: 'Daily', due: 120, param: 'Hold if SBP < 100',
        checks: (s, P, A) => { const v = A.lastVitals('418'); return [{ label: 'Latest BP', value: `${v.SBP}/${v.DBP} at ${clock(v.t)}`, ok: v.SBP >= 100 }]; },
        give(s, P, A) { const v = A.vitals('418'); P.losAt = s.t; if (v.SBP < 100) A.judge('418-los', 'meds', -2, `You gave losartan with an SBP of ${v.SBP}.`, 'Hold parameters exist because layering vasodilators on a soft pressure causes symptomatic hypotension.', '418'); return 'Losartan 25 mg given.'; },
        hold(s, P, A) { const v = A.vitals('418'); A.judge('418-los-hold', 'meds', v.SBP < 100 ? 1 : 0, v.SBP < 100 ? 'You held losartan for SBP under 100.' : 'You held losartan with an SBP above the parameter.', v.SBP < 100 ? 'Parameter met, dose held.' : 'His SBP was just above 100. Holding is defensible with a borderline pressure, but tell the provider.', '418'); return 'Held.'; },
      },
      {
        id: '418-lasix', name: 'Furosemide', dose: '40 mg', route: 'IV', freq: 'Twice daily', due: 120,
        checks: (s, P) => { P.kSeen = true; return [{ label: 'Potassium', value: '3.3 mmol/L (low) at 05:00', ok: false }, { label: 'KCl given?', value: P.kclAt !== null ? 'Yes, ' + clock(P.kclAt) : 'Not yet', ok: P.kclAt !== null }, { label: 'Lungs / weight', value: 'Crackles, weight up 0.6 kg', ok: null }]; },
        give(s, P, A) {
          P.lasixAt = s.t;
          if (P.kclAt === null && !P.notifiedK) A.judge('418-lasix-k', 'meds', -1, 'You gave IV furosemide with a potassium of 3.3 and no replacement in.', 'Loop diuretics waste potassium. Going lower in a heart patient invites arrhythmia. Give the ordered KCl first and ask for more.', '418');
          else A.judge('418-lasix-k', 'meds', 1, 'You addressed Mr. Ortiz\'s low potassium around his diuretic.', 'Diurese, but protect the potassium.', '418');
          if (s.t > 180) A.judge('418-lasix-late', 'time', -1, 'Mr. Ortiz\'s 09:00 furosemide went in late.', 'While the diuretic waits, fluid keeps backing into his lungs.', '418');
          return 'Furosemide 40 mg IV push over 2 minutes. Urinal at the bedside. Strict I&O.';
        },
      },
      { id: '418-kcl', name: 'Potassium chloride', dose: '20 mEq', route: 'PO', freq: 'Daily', due: 120, checks: () => [{ label: 'Potassium', value: '3.3 (low)', ok: true }, { label: 'Creatinine', value: '1.4, near baseline', ok: true }], give(s, P) { P.kclAt = s.t; return 'KCl 20 mEq given with water, upright.'; }, hold(s, P, A) { A.judge('418-kcl-hold', 'meds', -1, 'You held potassium from a patient with a potassium of 3.3 on a loop diuretic.', 'This is the dose that protects him.', '418'); return 'Held.'; } },
      { id: '418-kx', name: 'Potassium chloride (extra)', dose: '40 mEq', route: 'PO', freq: 'Once', prn: true, available: (s, P) => P.kxOrdered, block: (s, P) => P.kxAt ? 'Given at ' + clock(P.kxAt) + '.' : null, checks: () => [{ label: 'Ordered for', value: 'K 3.3 on IV furosemide', ok: true }], give(s, P) { P.kxAt = s.t; P.kclAt = P.kclAt === null ? s.t : P.kclAt; return 'KCl 40 mEq given. Recheck K in the afternoon.'; } },
      { id: '418-lx80', name: 'Furosemide (extra)', dose: '80 mg', route: 'IV', freq: 'Once, now', prn: true, available: (s, P) => P.lx80, block: (s, P) => P.lx80At ? 'Given at ' + clock(P.lx80At) + '.' : null, checks: () => [{ label: 'Ordered for', value: 'Pulmonary congestion', ok: true }], give(s, P) { P.lx80At = s.t; P.lasixAt = P.lasixAt === null ? s.t : P.lasixAt; P.fl = Math.max(40, P.fl - 6); return 'Furosemide 80 mg IV given. Strict I&O.'; } },
      { id: '418-apix', name: 'Apixaban', dose: '5 mg', route: 'PO', freq: 'Twice daily', due: 120, checks: () => [{ label: 'Bleeding signs', value: 'None', ok: true }, { label: 'Hemoglobin', value: '12.9, stable', ok: true }], give: () => 'Apixaban 5 mg given.', hold(s, P, A) { A.judge('418-apix-hold', 'meds', -1, 'You held Mr. Ortiz\'s anticoagulant without a reason.', 'In AFib, missed anticoagulant doses raise stroke risk. No bleeding, stable hemoglobin.', '418'); return 'Held.'; } },
    ],
    talk: (s, P) => ortizBrady(s, P) ? 'ortiz_brady' : P.fl >= 60 ? 'ortiz_sob' : 'ortiz_idle',
    sbar: {
      items(s, P, A) {
        const v = A.lastVitals('418');
        return [
          { id: 'hr', label: recent(s, P.k.hrAt, 60) ? `Apical HR ${P.k.hr}, AFib` : 'Heart rate', key: true, need: recent(s, P.k.hrAt, 60), lock: 'Count his apical pulse' },
          { id: 'held', label: 'Held metoprolol 50 mg (HR < 55)', key: true, need: P.metoHeld, lock: 'Nothing held' },
          { id: 'brady', label: 'HR 44, BP 86/48, lightheaded after metoprolol', key: true, need: ortizBrady(s, P), lock: 'No bradycardia' },
          { id: 'k', label: 'Potassium 3.3 on IV furosemide', key: true, need: true },
          { id: 'wt', label: 'Weight up 0.6 kg, intake 1,900 mL vs 1.5 L limit', key: true, need: P.k.io !== undefined, lock: 'Review his I&O' },
          { id: 'resp', label: `Crackles${P.fl >= 60 ? ' halfway up' : ' at bases'}, SpO₂ ${v.SpO2}% on ${v.O2}`, key: P.fl >= 58, need: P.k.resp !== undefined, lock: 'Listen to his lungs' },
          { id: 'rosa', label: 'Wife at bedside', key: false, need: true },
        ];
      },
      respond(s, P, A, picked) {
        const out = [];
        if (picked.includes('k')) { P.notifiedK = true; P.kxOrdered = true; A.addOrder('418', 'Potassium chloride 40 mEq PO once now. Recheck BMP at 16:00.'); out.push('Give an extra 40 of KCl now and recheck this afternoon.'); A.judge('418-sbar-k', 'comm', 1, 'You flagged Mr. Ortiz\'s low potassium to the provider.', 'A low K on a loop diuretic in a heart patient is worth a call.', '418'); }
        if (picked.includes('held')) { P.notifiedMeto = true; out.push('Agree with holding the metoprolol. I\'ll drop it to 25 on rounds.'); A.judge('418-sbar-meto', 'comm', 1, 'You told the provider you held Mr. Ortiz\'s metoprolol.', 'Closing the loop on a held medication lets the plan change.', '418'); }
        if (picked.includes('brady')) { P.notifiedMeto = true; A.addOrder('418', 'Hold metoprolol. Vitals every 15 min × 4. Atropine and pads at bedside. Call if SBP < 85 or chest pain.'); out.push('Hold any more beta-blocker, vitals every 15, atropine to the bedside. Call me if his SBP drops below 85.'); A.judge('418-sbar-brady', 'comm', 2, 'You escalated Mr. Ortiz\'s symptomatic bradycardia promptly.', 'Symptomatic bradycardia with hypotension needs the provider now, with the drug, the time and the numbers.', '418'); }
        if ((picked.includes('resp') || picked.includes('wt')) && P.fl >= 58) { P.lx80 = true; A.addOrder('418', 'Furosemide 80 mg IV once now. Chest X-ray. Strict I&O.'); out.push('Give 80 of IV furosemide now and get a chest film.'); A.judge('418-sbar-fl', 'comm', 1, 'You reported worsening congestion with the data to support it.', 'Crackles, saturation, weight and intake together describe fluid overload far better than "he\'s short of breath."', '418'); }
        return out.length ? out.join(' ') : 'Okay. What do you need from me?';
      },
    },
    scene: (s, P) => ({ tray: 'soup', soda: !P.educated, iv: 'lock', tele: true, o2: P.o2, hob: P.hob, family: 'rosa', familyLabel: 'Rosa, his wife' }),
    clues(s, P, A) {
      const v = A.vitals('418');
      return {
        monitor: `Telemetry: ${v.rhythm}, rate ${v.HR}. SpO₂ ${v.SpO2}%.`,
        soda: 'A 32-oz fountain soda, half gone. That\'s nearly a liter of his 1.5 L limit.',
        tray: 'A thermos of homemade caldo de res next to the hospital tray. Delicious, and salty.',
        o2: `Nasal cannula at ${P.o2} L.`,
        family: 'Rosa, knitting, one eye on the monitor.',
        iv: 'Saline lock, left forearm.',
      };
    },
    rig: (s, P) => ({ lean: clamp((P.fl - 59) / 5, 0, 1) }),
    status: (s, P) => ortizBrady(s, P) || P.fl >= 62 ? 'urgent' : P.fl >= 57 ? 'watch' : 'stable',
    outcome(s, P) {
      if (P.fl >= 62 && P.lasixAt === null) return { tone: 'bad', title: 'Worsening pulmonary edema', text: 'His diuretic never went in. He\'s working to breathe on 4 L. The night shift inherits a likely ICU consult.' };
      if (P.metoAt !== null && P.metoHR < 55) return { tone: 'mixed', title: 'Bradycardia after metoprolol', text: 'Heart rate dropped into the 40s with a soft pressure after a dose that should have been held. Resolving, but avoidable.' };
      return { tone: 'good', title: 'Diuresing, rate controlled', text: 'Metoprolol held for his rate, furosemide in, urine flowing. ' + (P.educated ? 'Rosa is packing low-sodium caldo tomorrow.' : 'The soda is still on the table.') };
    },
  };

  /* ---------- dialogs ---------- */
  const J = (key, dom, d, text, why, pid) => (s, A) => A.judge(key, dom, d, text, why, pid);
  const dialogs = {
    bell_opioid: { who: '412', text: '"It\'s a 7. More when I move. But I don\'t want to get hooked on that stuff. My brother went down that road."', choices: [
      { label: 'Short-term opioids for surgical pain rarely cause addiction. Controlled pain lets you breathe deep and walk, which is what gets you home. Lowest dose that works, then we step down.', next: 'bell_opioid_a', fx: (s, A) => { s.p['412'].talkedOpioid = true; J('412-talk', 'comm', 2, 'You addressed Mr. Bell\'s fear of addiction with facts and a plan.', 'Validating the fear, correcting the misconception and tying pain control to his goals (breathing, walking, going home) is therapeutic, not persuasive.', '412')(s, A); } },
      { label: 'Everybody takes them after surgery. You\'ll be fine.', next: 'bell_opioid_b', fx: (s, A) => { s.p['412'].talkedOpioid = true; J('412-talk', 'comm', -1, 'You brushed off Mr. Bell\'s addiction worry.', '"You\'ll be fine" is false reassurance. It dismisses a fear rooted in his family history.', '412')(s, A); } },
      { label: 'Then let\'s skip it. We can try ice and repositioning.', next: 'bell_opioid_c', fx: (s, A) => { s.p['412'].talkedOpioid = true; J('412-talk', 'judgment', -1, 'You agreed to skip analgesia for a man whose pain was stopping him from breathing deeply.', 'Undertreated post-op pain has consequences: splinting, atelectasis, immobility, clots. Non-drug measures help, but they don\'t replace analgesia at a 7.', '412')(s, A); } },
    ] },
    bell_opioid_a: { who: '412', text: 'He exhales. "Alright. Lowest dose." He\'ll take it if you offer it.' },
    bell_opioid_b: { who: '412', text: '"Hm." He doesn\'t look convinced. He\'ll probably say "I\'m fine" next time you ask.' },
    bell_opioid_c: { who: '412', text: 'He grimaces. "Sure." His breathing stays shallow.' },
    bell_thanks: { who: '412', text: '"Hey. Earlier I was ready to fight somebody. Now I walked the hall. Thank you. For real."' },
    bell_idle: { who: '412', text: 'He\'s watching a replay of last night\'s game. "Don\'t mind me. Do your thing."' },
    okafor_foot: { who: '414', text: '"Can I ask you something straight? My dad lost his leg to diabetes when I was twelve. Is that where this is going?"', choices: [
      { label: 'Don\'t worry. You\'re in good hands here.', next: 'okafor_a', fx: (s, A) => { s.p['414'].talked = true; J('414-talk', 'comm', -1, 'You answered Mrs. Okafor\'s fear with reassurance.', 'False reassurance closes the conversation. She asked a direct question and deserves engagement with the fear and the facts.', '414')(s, A); } },
      { label: 'That\'s a frightening thing to carry in here. Can I show you what we\'re watching on your foot, and what\'s changed since yesterday?', next: 'okafor_b', fx: (s, A) => { s.p['414'].talked = true; J('414-talk', 'comm', 2, 'You acknowledged Mrs. Okafor\'s fear and gave her something concrete to track.', 'Naming the emotion, then offering real information she can use (the border hasn\'t spread), is therapeutic communication. It also opened the door to foot-care teaching.', '414')(s, A); } },
      { label: 'That\'s a question for your doctor.', next: 'okafor_c', fx: (s, A) => { s.p['414'].talked = true; J('414-talk', 'comm', -1, 'You deflected Mrs. Okafor\'s question to the doctor.', 'Some questions need the provider. This one needed a nurse to acknowledge the fear first. Deflecting teaches patients to stop asking you.', '414')(s, A); } },
      { label: 'If you\'d come in sooner it might not have gotten this bad.', next: 'okafor_d', fx: (s, A) => { s.p['414'].talked = true; J('414-talk', 'comm', -2, 'You responded to Mrs. Okafor\'s fear with blame.', 'Judgmental responses shut down trust. She\'ll share less, and adherence follows trust.', '414')(s, A); } },
    ] },
    okafor_a: { who: '414', text: 'She nods, but her jaw tightens. "Okay." She goes back to her tablet.' },
    okafor_b: { who: '414', text: 'You show her the pen line. The redness sits inside it. Her shoulders drop an inch. "Okay. That I can track." She asks how she should check her feet at home.' },
    okafor_c: { who: '414', text: '"Right. Sure." She stops asking you questions.' },
    okafor_d: { who: '414', text: 'She looks away. "Yeah. I know."' },
    okafor_later: { who: '414', text: (s) => (s.p['414'].ondAt !== null ? '"Feeling more human. Thank you for sorting out the nausea."' : '"Still queasy. That antibiotic does a number on me every time."') },
    okafor_hypo: { who: '414', text: '"I feel weird. Shaky. Is it hot in here?" Her hands are trembling on the tablet.' },
    whitfield_early: { who: '416', text: '"Is it Tuesday? I have to get home. Biscuit hasn\'t eaten." She\'s plucking at the blanket.', choices: [
      { label: 'It\'s Wednesday morning. You\'re in the hospital, and I\'m your nurse. Let\'s make sure Biscuit is looked after. I\'ll ask Ruth.', next: 'whitfield_a', fx: J('416-talk', 'comm', 1, 'You reoriented Mrs. Whitfield gently.', 'Brief, calm reorientation without arguing, and addressing the worry underneath, calms delirium better than correcting it.', '416') },
      { label: 'There\'s no cat here, Mrs. Whitfield.', next: 'whitfield_b', fx: J('416-talk', 'comm', -1, 'You corrected Mrs. Whitfield instead of reorienting her.', 'Arguing with delirium escalates distress. Orient to time and place, then address the worry.', '416') },
    ] },
    whitfield_a: { who: '416', text: '"Oh. Good. Ruth\'s a good girl." She settles, for now.' },
    whitfield_b: { who: '416', text: 'She looks frightened. "Then where is she?"' },
    whitfield_scared: { who: '416', text: 'She grips your wrist, hot and dry. "Something\'s wrong, isn\'t it? Am I going to die, dear?"', choices: [
      { label: 'You\'re very sick right now, and I\'m not leaving you alone with that. I\'m getting your doctor here, and we\'re going to treat this.', next: 'whitfield_c', fx: J('416-talk2', 'comm', 2, 'You answered Mrs. Whitfield honestly and stayed present.', 'Honest, calm, and tied to action. You didn\'t promise what you can\'t know, and you didn\'t leave her alone with the fear.', '416') },
      { label: 'Of course not! You\'re fine.', next: 'whitfield_d', fx: J('416-talk2', 'comm', -1, 'You told a deteriorating patient she was fine.', 'Patients often sense deterioration before the numbers show it. "Am I dying?" can be a clinical cue as well as an emotional one.', '416') },
      { label: 'Let\'s not talk about that right now.', next: 'whitfield_d', fx: J('416-talk2', 'comm', -1, 'You changed the subject when Mrs. Whitfield asked if she was dying.', 'Avoidance leaves her alone with the fear. A sense of doom can also be a cue of physiologic decline.', '416') },
    ] },
    whitfield_c: { who: '416', text: 'Her grip loosens a little. "Don\'t go far."' },
    whitfield_d: { who: '416', text: 'She turns her face to the wall.' },
    ruth_call: { who: 'ruth', text: '"This is Ruth. Is Mom okay?" You ask about the penicillin allergy. "She broke out in a rash as a little girl, that\'s all anyone knows. And she took Keflex two years ago for a cut on her shin, no problem." She pauses. "Honestly? This isn\'t Mom. She did the Sunday crossword in pen. Confused is not her."', choices: [
      { label: 'Thank you. That\'s exactly what I needed. I\'ll call you with an update after the doctor sees her.', next: null, fx: (s, A) => { const P = s.p['416']; P.allergyInfo = true; P.baseline = true; A.judge('416-ruth', 'assess', 2, 'You called Ruth and learned Mrs. Whitfield\'s baseline and allergy history.', 'Acute change from baseline is the cue. "Pleasantly confused" only reassures if it\'s her normal. The same call unlocked her antibiotic.', '416'); A.note('416', 'You', 'Spoke with daughter Ruth: PCN reaction was a childhood rash; tolerated cephalexin 2024. Baseline: fully oriented, independent. Current confusion is acute.'); } },
    ] },
    rosa_talk: { who: 'rosa', text: '"The hospital food has no taste. I bring him my caldo, and a Coke, just a small one." She lifts a 32-ounce cup.', choices: [
      { label: 'Teach with teach-back: explain the 1.5 L limit and the salt, then ask her to show you how she\'d pack his lunch tomorrow.', next: 'rosa_a', fx: (s, A) => { s.p['418'].educated = true; A.judge('418-teach', 'comm', 2, 'You taught Rosa about fluid and sodium limits and confirmed with teach-back.', 'Involving the person who cooks, and confirming understanding with teach-back, is how heart failure education survives discharge.', '418'); } },
      { label: 'No outside food. It\'s hospital policy.', next: 'rosa_b', fx: J('418-teach', 'comm', -1, 'You set a rule instead of teaching.', 'Rules without reasons don\'t go home with the patient. Rosa will cook for him for years.', '418') },
      { label: 'A little is fine. It\'s good that he\'s eating.', next: 'rosa_b', fx: J('418-teach', 'comm', -1, 'You let the fluid and sodium excess slide.', 'His weight is up and his lungs are wet. That soda is a third of his daily fluid.', '418') },
    ] },
    rosa_a: { who: 'rosa', text: 'She counts on her fingers. "So the soup counts as water. And less salt, more lime and cilantro." She pours the soda down the sink herself.' },
    rosa_b: { who: 'rosa', text: '"Okay." She tucks the cup behind the flowers.' },
    rosa_after: { who: 'rosa', text: '"No more Coke. I told him, you listen to the nurse, viejo."' },
    ortiz_idle: { who: '418', text: '"Mija, I\'m fine. Just tired. Tell Rosa to stop worrying so much."' },
    ortiz_brady: { who: '418', text: '"Everything\'s swimming. I feel like I\'m going to pass out."' },
    ortiz_sob: { who: '418', text: '"Can\'t — catch — my breath." He\'s leaning forward, hands on his knees.' },
  };

  /* ---------- events ---------- */
  const A0 = (s) => Object.keys(s.p).every((id) => s.p[id].seenAt === null);
  const events = [
    { id: 'luis-hi', when: (s) => s.t >= 12, run(s, A) { A.msg({ from: 'luis', text: 'Morning! I\'ve got 412 to 418 with you. Want me to start vitals or sugars on anyone?', replies: [{ label: 'Open tasks for Luis', act: 'delegate' }] }); } },
    { id: 'pharm', when: (s) => s.t >= 65, run(s, A) { if (s.meds['416-cef'].status !== 'verify') return; A.msg({ from: 'omar', pid: '416', text: 'Ceftriaxone for 416 is on hold. Penicillin allergy with an unknown reaction. Can you find out what happened and whether she\'s had a cephalosporin?', replies: [{ label: 'Go to 416', act: 'goto', pid: '416' }] }); } },
    { id: 'trays', when: (s) => s.t >= 75, run(s, A) { A.log(null, 'Breakfast trays are out.', 'ambient'); } },
    { id: 'bell-light', when: (s, A) => s.t >= 85 && s.p['412'].oxyAt === null && s.p['412'].hmAt === null && bellPain(s, s.p['412']) >= 7, run(s, A) { s.p['412'].callLight = true; A.msg({ from: 'luis', pid: '412', text: 'Call light in 412. Mr. Bell says his pain is "a solid 7" and asked if you can come.', replies: [{ label: 'Go to 412', act: 'goto', pid: '412' }] }); } },
    { id: 'bell-walk', when: (s) => s.t >= 130 && !s.p['412'].ambulated, run(s, A) { s.p['412'].walkAsked = true; A.msg({ from: 'luis', pid: '412', text: 'Mr. Bell wants to walk. He said he felt dizzy earlier but he\'s ready. Want me to take him?', replies: [{ label: 'Yes, go ahead', act: 'bellwalk-yes' }, { label: 'Wait. I\'ll assess him first.', act: 'bellwalk-no' }] }); } },
    { id: 'bell-fall', when: (s) => s.p['412'].walkDelegated && s.t >= s.p['412'].walkDelegated + 15 && !s.p['412'].ambulated, run(s, A) { s.p['412'].fell = true; A.judge('412-deleg-walk', 'deleg', -2, 'You delegated Mr. Bell\'s first post-op walk to the CNA.', 'The first time up after surgery requires RN assessment: orthostatics, pain, sedation. The report of dizziness was the cue. Luis can walk stable patients, not unassessed ones.', '412'); A.msg({ from: 'luis', pid: '412', urgent: true, text: 'Mr. Bell\'s legs buckled in the hallway. I lowered him to the floor. He\'s okay, no hit head, but he\'s pale and sweaty. Can you come?', replies: [{ label: 'Go to 412', act: 'goto', pid: '412' }] }); A.note('412', 'Luis, CNA', 'Assisted to floor during ambulation. No head strike. Returned to bed with 2 assist.'); } },
    { id: 'chen-ask', when: (s) => s.t >= 140 && !s.p['416'].escalated, run(s, A) { A.msg({ from: 'chen', pid: '416', text: 'Can you give me a quick update on Ms. Whitfield before rounds?', replies: [{ label: 'Call Dr. Chen with an SBAR', act: 'sbar', pid: '416' }, { label: 'Reply: "No changes, she\'s stable."', act: 'chen-nochange' }] }); } },
    { id: 'wh-bp', when: (s) => s.p['416'].sev >= 58 && !s.p['416'].escalated && !s.p['416'].icu, run(s, A) { const v = A.recordVitals('416', 'Luis (CNA)'); A.msg({ from: 'luis', pid: '416', urgent: true, text: `416's pressure is ${v.SBP}/${v.DBP}, heart rate ${v.HR}, temp ${v.T}. She's really drowsy. That\'s not right, is it?`, replies: [{ label: 'Go to 416', act: 'goto', pid: '416' }] }); } },
    { id: 'wh-icu', when: (s) => s.p['416'].sev >= 82 && !s.p['416'].icu, run(s, A) { const P = s.p['416']; P.icu = true; P.rrt = true; A.judge('416-shock', 'judgment', -3, 'Mrs. Whitfield progressed to septic shock before anyone escalated her care.', 'The cues came early: fever, tachycardia, new confusion, low urine output, a falling BP and a delayed antibiotic. Sepsis rewards the nurse who connects trends before the pressure crashes.', '416'); A.msg({ from: 'luis', pid: '416', urgent: true, text: 'I called a rapid response on 416. She\'s barely waking up, pressure 74 systolic. They\'re taking her to the ICU.' }); A.note('416', 'Rapid response RN', 'Hypotension 74/42 refractory to 1 L bolus, lactate 4.6. Norepinephrine started. Transferred to ICU.'); } },
    { id: 'labs', when: (s) => s.t >= 180, run(s, A) { const P = s.p['416']; const w = P.sev < 35 ? 15.1 : 17.9, c = P.sev < 35 ? 1.4 : 1.6; A.addLab('416', { name: 'WBC', val: w, unit: 'K/µL', ref: '4.5–11.0', flag: 'H' }); A.addLab('416', { name: 'Creatinine', val: c, unit: 'mg/dL', ref: '0.6–1.1 (her baseline 0.9)', flag: 'H' }); A.addLab('416', { name: 'Bands', val: 12, unit: '%', ref: '0–5', flag: 'H' }); A.addLab('418', { name: 'Magnesium', val: 1.9, unit: 'mg/dL', ref: '1.7–2.2', flag: '' }); A.msg({ from: 'lab', pid: '416', text: `AM labs resulted for 416: WBC ${w} with 12% bands, creatinine ${c}.`, replies: [{ label: 'Open 416 labs', act: 'chart', pid: '416', tab: 'labs' }] }); } },
    { id: 'rounds', when: (s) => s.t >= 195, run(s, A) { const P = s.p['416']; if (!P.escalated && !P.icu && P.sev >= 45) { P.escalated = true; P.bundle = true; P.bundleLate = true; if (s.meds['416-cef'].status === 'verify') { P.abxAvail = s.t + 5; } A.addOrder('416', 'Sepsis bundle: blood cultures × 2, lactate, normal saline 1,000 mL bolus. Vitals every 15 min × 4. Hold lisinopril.'); A.judge('416-rounds', 'judgment', -2, 'Dr. Chen recognized Mrs. Whitfield\'s sepsis on rounds before you escalated it.', 'The provider shouldn\'t be the first to connect the dots. Trending your own assessments against the 07:00 report is how nurses catch sepsis hours earlier.', '416'); A.msg({ from: 'chen', pid: '416', urgent: true, text: 'I\'m in 416. She\'s hypotensive and confused. This is sepsis. I put in cultures, lactate and a liter bolus. Please start them now, and I\'ll get the antibiotic released.', replies: [{ label: 'Go to 416', act: 'goto', pid: '416' }] }); } else { A.msg({ from: 'chen', text: P.escalated ? 'Rounded on your four. Nice work catching 416 early.' : 'Rounded on your four. No new orders.' }); } } },
    { id: 'bell-atel', when: (s) => s.t >= 210, run(s, A) { const P = s.p['412']; const ok = (P.isCoached !== null && !P.isPoor) || P.ambulated; if (ok) return; P.atel = true; A.judge('412-atel', 'safety', -2, 'Mr. Bell developed early atelectasis: T 38.2, SpO₂ 91%, crackles.', 'Post-op day 1, a smoker, splinting from pain, no spirometry and no walking: the prevention bundle is pain control, IS every hour, and getting him up.', '412'); A.msg({ from: 'luis', pid: '412', text: 'Mr. Bell\'s temp is 38.2 and his sat is 91% on room air. He\'s breathing kind of shallow.', replies: [{ label: 'Go to 412', act: 'goto', pid: '412' }] }); A.recordVitals('412', 'Luis (CNA)'); } },
    { id: 'wh-fall', when: (s) => s.t >= 220 && s.p['416'].sev >= 38 && !s.p['416'].icu, run(s, A) { const P = s.p['416']; if (P.fallPrec) { A.judge('416-fall-caught', 'safety', 1, 'Your bed alarm caught Mrs. Whitfield trying to get up.', 'Precautions set earlier turned a fall into a redirection.', '416'); A.msg({ from: 'luis', pid: '416', text: 'Bed alarm went off in 416. She was trying to get up to "feed the cat." I got her settled. She\'s okay.' }); } else { A.judge('416-fall-near', 'safety', -2, 'Mrs. Whitfield nearly fell climbing out of bed with no fall precautions in place.', 'New confusion, an IV line, urinary urgency and age 82: a textbook fall risk. Bed alarm, low bed and call light take three minutes.', '416'); A.msg({ from: 'luis', pid: '416', urgent: true, text: 'Found 416 with one leg over the rail and her IV pulled tight. She said she had to feed the cat. I got her back in bed. There was no bed alarm on.', replies: [{ label: 'Go to 416', act: 'goto', pid: '416' }] }); } } },
    { id: 'or-brady', when: (s) => ortizBrady(s, s.p['418']), run(s, A) { A.msg({ from: 'jae', pid: '418', urgent: true, text: 'Tele here. 418 is running in the low 40s, slow AFib. Is he okay?', replies: [{ label: 'Go to 418', act: 'goto', pid: '418' }] }); } },
    { id: 'or-sob', when: (s) => s.p['418'].fl >= 63, run(s, A) { s.p['418'].overload = true; A.msg({ from: 'rosa', pid: '418', urgent: true, text: 'Call light 418. Rosa: "He can\'t catch his breath! Please come."', replies: [{ label: 'Go to 418', act: 'goto', pid: '418' }] }); } },
    { id: 'ok-hypo', when: (s) => s.p['414'].prandAt !== null && okaforBG(s, s.p['414']) < 62, run(s, A) { const P = s.p['414']; P.hypo = true; P.hypoAt = s.t; A.msg({ from: 'luis', pid: '414', urgent: true, text: 'Mrs. Okafor in 414 is sweaty and shaky. She says she feels "off."', replies: [{ label: 'Go to 414', act: 'goto', pid: '414' }] }); } },
    { id: 'ok-severe', when: (s) => s.p['414'].hypo && !s.p['414'].hypoResolved && s.p['414'].juiceAt === null && s.t - s.p['414'].hypoAt >= 25, run(s, A) { s.p['414'].hypoSevere = true; A.judge('414-untreated', 'safety', -2, 'Mrs. Okafor\'s hypoglycemia went untreated for 25 minutes.', 'Shaky, sweaty and anxious on insulin is hypoglycemia until proven otherwise. Check, treat, recheck, and don\'t let it wait behind routine tasks.', '414'); A.msg({ from: 'luis', pid: '414', urgent: true, text: '414 isn\'t making sense. She\'s slurring. I checked her sugar: 36.', replies: [{ label: 'Go to 414', act: 'goto', pid: '414' }] }); } },
    { id: 'lact', when: (s) => s.p['416'].lactAt !== null && s.t >= s.p['416'].lactAt + 30, run(s, A) { const P = s.p['416']; const v = +(0.9 + P.sev * 0.034).toFixed(1); P.lactResult = v; A.addLab('416', { name: 'Lactate', val: v, unit: 'mmol/L', ref: '0.5–2.0', flag: v > 2 ? 'H' : '' }); A.msg({ from: 'lab', pid: '416', urgent: v >= 2, text: v >= 2 ? `Critical value, 416: lactate ${v} mmol/L. Read back and notify the provider.` : `416 lactate ${v} mmol/L.`, replies: v >= 2 ? [{ label: 'Call Dr. Chen with an SBAR', act: 'sbar', pid: '416' }] : null }); } },
    { id: 'cm', when: (s) => s.t >= 250, run(s, A) { A.msg({ from: 'maya', pid: '414', text: 'Mrs. Okafor may go home tomorrow on oral antibiotics. Does she have a glucometer and strips at home? I\'ll check her insurance for supplies.' }); } },
    { id: 'wh-drowsy', when: (s) => { const P = s.p['416']; return !P.escalated && !P.icu && P.sev >= 40; }, run(s, A) { A.msg({ from: 'luis', pid: '416', text: 'Heads up: 416 is a lot sleepier than she was at 7, and she didn\'t touch her breakfast. Her face looks flushed.', replies: [{ label: 'Go to 416', act: 'goto', pid: '416' }] }); } },
    { id: 'wh-turn', when: (s) => { const P = s.p['416']; return !P.icu && P.bundle && P.abxAt !== null && s.t - P.abxAt >= 30 && P.sev < 30; }, run(s, A) { A.msg({ from: 'luis', pid: '416', text: '416 just asked me to call Ruth and make sure Biscuit got fed. She knew the cat\'s name and what day it is. She\'s way more with it. Whatever you did, it worked.' }); A.log('416', 'She\'s more awake, pinker, and asking about Biscuit by name.', 'info'); } },
    { id: 'nova-idle', when: (s) => s.t >= 50 && s.t < 120 && A0(s), run(s, A) { A.msg({ from: 'nova', urgent: true, text: 'Hey. It\'s been almost an hour and you haven\'t been in a single room. Report is not an assessment. Go lay eyes on somebody.' }); } },
    { id: 'nova-30', when: (s) => s.t >= 270, run(s, A) { A.msg({ from: 'nova', text: 'Thirty minutes to handoff. Anyone you haven\'t laid eyes on in the last hour? Do that before you give report.' }); } },
  ];

  /* ---------- delegation ---------- */
  const delegation = {
    tasks: [
      { id: 'vitals', label: 'Take a full set of vital signs', rooms: ['412', '414', '416', '418'], mins: 12 },
      { id: 'bg', label: 'Check blood glucose', rooms: ['414'], mins: 8 },
      { id: 'intake', label: 'Record breakfast intake', rooms: ['412', '414', '416', '418'], mins: 6, avail: (s) => s.t >= 80 },
      { id: 'walk', label: 'Walk the patient in the hall', rooms: ['412', '416', '418'], mins: 12 },
      { id: 'bath', label: 'Help with a bath and linen change', rooms: ['412', '414', '416', '418'], mins: 25 },
      { id: 'confusion', label: 'Reassess her confusion', rooms: ['416'], mins: 0 },
      { id: 'meds', label: 'Give his morning pills', rooms: ['418'], mins: 0 },
      { id: 'teach', label: 'Teach her about her insulin', rooms: ['414'], mins: 0 },
    ],
    start(task, pid, s, A) {
      const nm = A.def(pid).short;
      if (task.id === 'confusion') { A.judge('deleg-assess', 'deleg', -1, 'You asked the CNA to reassess a patient\'s mental status.', 'Assessment, teaching, evaluation and medication administration stay with the RN. CNAs collect data (vitals, intake, glucose) and help with care; interpreting it is yours.'); return 'Luis: "That\'s an assessment. That one\'s yours. I can grab her vitals though."'; }
      if (task.id === 'meds') { A.judge('deleg-meds', 'deleg', -2, 'You asked the CNA to give medications.', 'Medication administration is outside a CNA\'s scope. Especially cardiac meds with hold parameters.'); return 'Luis: "I can\'t pass meds. You know that."'; }
      if (task.id === 'teach') { A.judge('deleg-teach', 'deleg', -1, 'You asked the CNA to do patient teaching.', 'Teaching requires RN judgment: assessing understanding and adapting. CNAs can reinforce, not initiate.'); return 'Luis: "Teaching\'s an RN thing. I can bring her a snack, though."'; }
      const busy = s.deleg.filter((d) => !d.done).length;
      if (busy >= 2) return 'Luis: "I\'m tied up with two things already. Give me a few minutes."';
      if (task.id === 'walk' && pid === '412') {
        if (s.p['412'].ambulated) { A.judge('deleg-walk412-ok', 'deleg', 1, 'You delegated Mr. Bell\'s second walk after walking him yourself first.', 'Once the RN has assessed tolerance, routine ambulation is appropriate to delegate.', '412'); }
        else { s.p['412'].walkDelegated = s.t; return 'Luis: "On it. Gait belt and walker."'; }
      }
      if (task.id === 'walk' && pid === '416') { A.judge('deleg-walk416', 'deleg', -1, 'You sent Mrs. Whitfield, newly confused and a high fall risk, for a walk.', 'Changing mental status makes her unstable for delegation. Assess first.', '416'); return 'Luis gets her to the edge of the bed. She sways. He sits her back. "Not today, I think."'; }
      if (task.id === 'walk' && pid === '418' && (ortizBrady(s, s.p['418']) || s.p['418'].fl >= 60)) { A.judge('deleg-walk418', 'deleg', -1, 'You sent an unstable Mr. Ortiz for a walk.', 'Symptomatic patients are not stable for delegated ambulation.', '418'); return 'Luis: "He can barely sit up. I\'m not walking him right now."'; }
      s.deleg.push({ id: task.id, pid, due: s.t + task.mins, done: false, at: s.t });
      if (task.id === 'vitals' || task.id === 'bg' || task.id === 'intake') A.judge('deleg-good', 'deleg', 1, 'You delegated routine data collection to the CNA.', 'Vitals on stable patients, glucose checks and intake measurement are appropriate to delegate. It frees you to assess. You still own interpreting the results.');
      return `Luis: "Got it: ${task.label.toLowerCase()} for ${nm}."`;
    },
    complete(d, s, A) {
      const nm = A.def(d.pid).short;
      if (d.id === 'vitals') {
        const v = A.recordVitals(d.pid, 'Luis (CNA)');
        const flag = v.SBP < 100 || v.HR > 110 || v.HR < 55 || v.SpO2 < 92 || v.T >= 38;
        A.msg({ from: 'luis', pid: d.pid, urgent: flag && d.pid === '416' && s.p['416'].sev >= 50, text: `${nm}: T ${v.T}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}% ${v.O2}.` + (flag ? ' Some of those look off to me.' : '') });
      } else if (d.id === 'bg') {
        const P = s.p['414']; const v = checkBG(s, P, A, 'Luis (CNA)'); A.msg({ from: 'luis', pid: '414', text: `Mrs. Okafor's glucose is ${v}.` });
      } else if (d.id === 'intake') {
        if (d.pid === '414') { if (s.t >= 88) s.p['414'].intakeKnown = true; A.msg({ from: 'luis', pid: '414', text: s.t >= 88 ? 'Mrs. Okafor ate maybe 20%. Says she\'s nauseous.' : 'She\'s just started eating.' }); }
        else A.msg({ from: 'luis', pid: d.pid, text: { '412': 'Mr. Bell had most of his broth and juice.', '416': 'Mrs. Whitfield didn\'t touch her tray.', '418': 'Mr. Ortiz ate his wife\'s soup, not the tray. And the whole soda.' }[d.pid] });
      } else if (d.id === 'walk') {
        if (d.pid === '412') A.msg({ from: 'luis', pid: '412', text: 'Walked Mr. Bell to the window and back. Steady.' });
        else A.msg({ from: 'luis', pid: d.pid, text: `Walked ${nm} a short loop. Tired but okay.` });
      } else if (d.id === 'bath') A.msg({ from: 'luis', pid: d.pid, text: `${nm} is washed up, fresh linens.` });
    },
  };

  /* ---------- Nova ---------- */
  function novaHint(s, A) {
    const W = s.p['416'], O = s.p['414'], R = s.p['418'], B = s.p['412'];
    if (O.hypo && !O.hypoResolved) return 'Shaky, sweaty, anxious, on insulin. You don\'t need a lab to know what to check first, or what to do if she can still swallow.';
    if (!W.icu && W.sev >= 50 && !W.escalated) return 'Someone on your assignment is quietly getting worse. Line up the vitals you have now against Dana\'s at 07:00. Whose numbers have all drifted in the same direction? And what does that pattern add up to?';
    if (ortizBrady(s, R)) return 'His heart rate is in the forties. What did he get in the last hour that slows the heart, and who needs to hear about it now?';
    if (R.fl >= 60) return 'Air hunger in a heart failure patient: sit him up, and look at what\'s due that pulls fluid off. What\'s the free intervention, and what\'s the ordered one?';
    if (s.meds['416-cef'].status === 'verify' && !W.allergyInfo) return 'Pharmacy can\'t release her antibiotic without an allergy history. Who could answer that better than a confused 82-year-old? While you\'re at it, ask what "normal" looks like for her.';
    if (s.meds['418-meto'].status === 'due' && s.t >= 90) return 'Before any beta-blocker: what number does the hold parameter want, and when did you last count it yourself, a full minute, in AFib?';
    if (s.meds['414-prand'].status === 'due' && s.t >= 75 && !O.intakeKnown) return 'Mealtime insulin is a bet on what she eats. Have you seen her tray?';
    if (bellPain(s, B) >= 7 && B.oxyAt === null && B.hmAt === null) return 'Pain that stops him breathing deeply is a lung problem in the making. Before an opioid in a man with sleep apnea, what two things do you check?';
    if (B.foleyOut === null && s.t >= 60) return 'Scan the orders for anything with a clock on it. Some lines are supposed to come out today.';
    if (!W.fallPrec && W.sev >= 30) return 'New confusion, an IV and a bladder infection. Picture her at 3 a.m. trying to get to the bathroom. What would you set up now?';
    const unseen = A.c.patients.filter((d) => s.p[d.id].seenAt === null || s.t - s.p[d.id].seenAt > 75).map((d) => d.room);
    if (unseen.length) return `Quiet stretch. Good nurses spend quiet stretches reassessing. You haven't laid eyes on ${unseen.join(' and ')} in over an hour.`;
    return 'You\'re in good shape. Use it: reassess what you treated. Did your interventions actually work?';
  }

  function endChecks(s, A) {
    A.c.patients.forEach((d) => {
      const P = s.p[d.id];
      if (P.seenAt === null && !(d.id === '416' && P.icu)) A.judge(d.id + '-unseen', 'assess', -3, `You never went into ${d.room} this shift.`, 'Every patient gets eyes on them early. Report tells you what happened overnight; your assessment tells you what\'s happening now.', d.id);
      (d.meds || []).forEach((m) => {
        const st = s.meds[m.id];
        if (m.due !== undefined && !m.conditional && m.due <= Math.min(240, s.t - 60) && (st.status === 'due' || st.status === 'verify') && !(d.id === '416' && P.icu)) A.judge(m.id + '-missed', 'meds', -2, `${m.name} for ${d.short} (due ${clock(m.due)}) was never given or held.`, 'Every scheduled dose needs a decision: give it, or hold it with a documented reason and a notification.', d.id);
      });
    });
    const B = s.p['412'];
    if (B.foleyOut === null && s.t >= 120) A.judge('412-foley-left', 'safety', -1, 'Mr. Bell\'s Foley was never removed despite an 08:00 order.', 'Catheter days drive infection risk.', '412');
    if (B.oxyAt !== null && !A.hasJudg('412-reassess')) A.judge('412-noreassess', 'judgment', -1, 'You didn\'t reassess Mr. Bell\'s pain and sedation after his opioid.', 'Intervene, then evaluate. Otherwise you don\'t know whether it worked or whether he is over-sedated.', '412');
    const O = s.p['414'];
    if (O.bgAt === null && s.t >= 120) A.judge('414-nobg', 'assess', -1, 'Mrs. Okafor\'s pre-breakfast glucose was never checked.', 'Every insulin decision at breakfast starts with a point-of-care glucose. It can be delegated, but it can\'t be skipped.', '414');
    if (O.prandHeld && !O.notifiedHold) A.judge('414-hold-notify', 'comm', -1, 'You held Mrs. Okafor\'s mealtime insulin but didn\'t notify the provider as ordered.', 'Holds with a "notify" clause aren\'t finished until the loop is closed, and her nausea needed treatment anyway.', '414');
    const W = s.p['416'];
    if (W.bolusAt !== null && s.t >= W.bolusAt + 60) {
      const re = W.vit.some((v) => v.t >= W.bolusAt + 20 && v.t <= W.bolusAt + 120);
      A.judge('416-evaluate', 'judgment', re ? 1 : -1, re ? 'You rechecked Mrs. Whitfield\'s vitals after her bolus.' : 'You didn\'t recheck Mrs. Whitfield\'s vitals after her bolus.', 'Fluid is a treatment with an expected response. Reassessing BP, HR and mentation tells you whether she needs more or a vasopressor.', '416');
    }
    if (W.lactResult !== null && W.lactResult >= 2 && !W.lactReported) A.judge('416-lact-unreported', 'comm', -1, 'The critical lactate on Mrs. Whitfield wasn\'t reported to the provider.', 'Critical values need to reach the provider promptly, read back and documented.', '416');
    const R = s.p['418'];
    if (R.metoHeld && !R.notifiedMeto) A.judge('418-hold-notify', 'comm', -1, 'You held Mr. Ortiz\'s metoprolol but didn\'t tell the provider.', 'A held cardiac medication changes the plan. The provider needs to know to adjust the dose.', '418');
    const keys = []; A.c.patients.forEach((d) => d.report.forEach((r, i) => { if (r.key) keys.push(d.id + ':' + i); }));
    const hit = keys.filter((k) => s.brain.includes(k)).length;
    if (s.brain.length) { const noise = s.brain.length - hit, precise = hit / s.brain.length;
      if (noise >= 4 && precise < .7) A.judge('brain', 'assess', -1, `You flagged ${s.brain.length} lines in report, ${noise} of them noise.`, 'Flagging everything is the same as flagging nothing. The skill is choosing: what here could hurt someone in the next few hours?');
      else A.judge('brain', 'assess', hit / keys.length >= 0.6 && precise >= .7 ? 1 : 0, `You flagged ${hit} of ${keys.length} critical cues during handoff${noise ? `, plus ${noise} that didn\'t matter` : ''}.`, 'Report is noisy. Separating "she\'s sweet" from "she only voided once, dark" is the first act of clinical judgment on every shift.'); }
  }


  /* Bedside prep shortcuts offered inside the medication review. */
  const PREP = { '412-oxy': ['pain', 'vitals'], '412-hm': ['pain', 'vitals'], '412-aml': ['vitals'], '414-corr': ['bg'], '414-prand': ['intake', 'bg'], '416-lis': ['vitals'], '416-apap': ['vitals'], '418-meto': ['apical'], '418-los': ['apical'], '418-lasix': ['vitals'] };
  [bell, okafor, whitfield, ortiz].forEach((d) => d.meds.forEach((m) => { if (PREP[m.id]) m.prep = PREP[m.id]; }));

  S.engine.registerCase({
    id: 'medsurg-4w-1', title: 'First light', unit: '4 West, Medical-Surgical', level: 'Orientation', start: 7 * 60, length: 300, novaCredits: 3,
    card: 'Morning on 4 West. Four patients, one quietly getting worse.',
    hero: { head: 'You have four patients. Report starts now.', lede: 'A medical-surgical morning on 4 West. Take report, walk the hall, decide who needs you first. Your patients will get better or worse depending on what you notice.' },
    intro: { time: '06:58', place: '4 West · Medical-Surgical', cta: 'Take report', beats: ['You\'re the day nurse. Four patients are yours until noon.', 'Dana worked all night. She\'s tired, and report will be quick.', 'One of your patients is getting sicker. Nobody has noticed yet.'] },
    minutes: 15,
    reportBy: 'dana', reportRole: 'night shift', provider: 'chen', cna: 'luis',
    /* Extra lines for the station's due list that aren't medications. */
    dueExtras(s) {
      const out = [];
      if (s.p['414'].bgAt === null && !s.deleg.some((x) => x.id === 'bg' && !x.done)) out.push({ t: 30, late: s.t > 75, text: '414 Glucose before breakfast' });
      if (s.p['412'].foleyOut === null) out.push({ t: 60, late: s.t > 120, text: '412 Remove Foley catheter' });
      return out;
    },
    /* Reply buttons on phone messages that do more than navigate. Each costs a minute. */
    replies: {
      'bellwalk-yes'(s, A) { s.p['412'].walkDelegated = s.t; A.log('412', 'You told Luis to walk Mr. Bell.', 'act'); },
      'bellwalk-no'(s, A) { A.judge('412-deleg-hold', 'deleg', 1, 'You held Luis back from Mr. Bell\'s first walk until you could assess him.', 'A report of dizziness plus a first post-op walk makes this an RN assessment, not a delegated task.', '412'); A.msg({ from: 'luis', pid: '412', text: 'Copy. He\'s all yours for the first walk.' }); },
      'chen-nochange'(s, A) { const P = s.p['416']; if (P.sev >= 38) A.judge('416-nochange', 'comm', -2, 'You told Dr. Chen Mrs. Whitfield had "no changes."', 'An update is an assessment. Her fever, heart rate, BP and mental status had all moved since admission. "No changes" without a fresh look is how deterioration gets missed.', '416'); A.msg({ from: 'chen', text: 'Thanks, I\'ll see her on rounds.' }); },
    },
    blurb: 'Four patients. A post-op man in pain, a teacher on insulin, a quiet 82-year-old, and a heart that doesn\'t need slowing. 07:00 to 12:00.',
    staff: {
      nova: { name: 'Nova Reyes', role: 'Charge nurse', look: { skin: '#B98A63', shade: '#976D4B', lip: '#7C4435', blush: '#C77B5E', iris: '#3D2A1C', head: { w: 55, h: 62, jaw: .35 }, eye: 10, hair: { style: 'bun', color: '#3A2E2A', streak: true }, brow: { w: 3.6, color: '#2E2421' }, body: { w: 80, cloth: 'navy' }, extras: ['studs'], smile: .35 } },
      luis: { name: 'Luis', role: 'CNA', look: { skin: '#B07B52', shade: '#8C5E3B', lip: '#7A4232', blush: '#C3705A', iris: '#2E1E14', head: { w: 56, h: 62, jaw: .6 }, eye: 10.4, hair: { style: 'swoop', color: '#1E1814' }, brow: { w: 4.4, color: '#1A1411' }, body: { w: 84, cloth: 'teal' }, extras: [], smile: .55 } },
      chen: { name: 'Dr. Chen', role: 'Hospitalist', look: { skin: '#ECCBAB', shade: '#CFA682', lip: '#B56A5E', blush: '#E59B87', iris: '#2C1F16', head: { w: 52, h: 62, jaw: .3 }, eye: 9.6, hair: { style: 'long', color: '#17120F' }, brow: { w: 3.2, color: '#17120F' }, body: { w: 78, cloth: 'coat', steth: true }, extras: ['thinGlasses'], glasses: '#3A3A3E', smile: .12 } },
      omar: { name: 'Omar', role: 'Pharmacist', look: { skin: '#9C6A48', shade: '#7B5134', lip: '#6A372A', blush: '#B36650', iris: '#2A1B12', head: { w: 58, h: 63, jaw: .55 }, eye: 9.8, hair: { style: 'short', color: '#1A1410' }, brow: { w: 4.6, color: '#16110E' }, body: { w: 84, cloth: 'coat' }, extras: ['beard'], smile: .25 } },
      jae: { name: 'Jae', role: 'Monitor tech', look: { skin: '#E6C29C', shade: '#C79E76', lip: '#A8625A', blush: '#DE9380', iris: '#241810', head: { w: 55, h: 61, jaw: .45 }, eye: 9.4, hair: { style: 'short', color: '#121012' }, brow: { w: 3.8, color: '#121012' }, body: { w: 80, cloth: 'grey' }, extras: ['headset'], smile: .3 } },
      lab: { name: 'Lab', role: 'Laboratory', look: null },
      maya: { name: 'Maya', role: 'Case manager', look: { skin: '#7A4A33', shade: '#5E3825', lip: '#5A2E24', blush: '#A65744', iris: '#2A1A10', head: { w: 54, h: 61, jaw: .3 }, eye: 10.2, hair: { style: 'curlyshort', color: '#241A14', big: true }, brow: { w: 3.4, color: '#1C140F' }, body: { w: 78, cloth: 'plum', lanyard: true }, extras: ['gold'], smile: .4 } },
      dana: { name: 'Dana', role: 'Night RN', look: { skin: '#F0CFB6', shade: '#D4A98E', lip: '#B8675F', blush: '#EC9588', iris: '#4E7A5B', head: { w: 54, h: 61, jaw: .3 }, eye: 10.2, hair: { style: 'ponytail', color: '#8A5A2F' }, brow: { w: 3.2, color: '#6F4623' }, body: { w: 78, cloth: 'navy' }, extras: ['freckles'], smile: .2, tired: true } },
      rosa: { name: 'Rosa Ortiz', role: 'Wife, 418', look: { skin: '#B07B58', shade: '#8D5F40', lip: '#8A4538', blush: '#C9725B', iris: '#3B2616', head: { w: 56, h: 60, jaw: .3 }, eye: 9.8, hair: { style: 'curlyshort', color: '#6D5B52' }, brow: { w: 3.4, color: '#4A3C35' }, body: { w: 80, cloth: 'blouse', cardigan: '#8A5A48' }, extras: ['wrinkles', 'gold'], smile: .5 } },
      ruth: { name: 'Ruth', role: 'Daughter, 416', look: { skin: '#EDCCB6', shade: '#D1A78D', lip: '#B0645E', blush: '#E6907F', iris: '#5B7E9C', head: { w: 54, h: 61, jaw: .25 }, eye: 9.8, hair: { style: 'bob', color: '#7B5B3C' }, brow: { w: 3.2, color: '#5C4230' }, body: { w: 78, cloth: 'blouse', cardigan: '#6F8FA8' }, extras: ['studs'], smile: .2 } },
    },
    patients: [bell, okafor, whitfield, ortiz],
    priority: {
      judge(r, A) {
        if (r[0] === '416') A.judge('rank-first', 'priority', 2, 'You chose to see Mrs. Whitfield first after report.', 'The quiet, confused 82-year-old with fever, tachycardia and a missed antibiotic had the most dangerous possible trajectory. Priority goes to who could deteriorate, not who is loudest.', '416');
        else A.judge('rank-first', 'priority', -1, `You put ${A.def(r[0]).short} first after report, ahead of Mrs. Whitfield.`, 'Mrs. Whitfield\'s cues (new confusion, fever, tachycardia, low output, no antibiotic) suggested early sepsis. Quiet patients can be the sickest.', '416');
        if (r.indexOf('414') < 2) A.judge('rank-414', 'priority', -1, 'You ranked stable Mrs. Okafor near the top.', 'Her 07:30 glucose check is time-bound but delegable. Stable patients with predictable needs go after unstable or uncertain ones.', '414');
      },
      correct: ['416', '418', '412', '414'],
      why: {
        '416': 'New confusion, fever, tachycardia, one dark void and no antibiotic yet. She\'s the only one whose story could be early sepsis. Quiet isn\'t stable.',
        '418': 'Cardiac meds at 09:00 with a heart rate already in the 50s and a low potassium. You need your own assessment before that med pass.',
        '412': 'Real pain and a real risk (atelectasis), but predictable, and his next opioid isn\'t available until 08:30.',
        '414': 'Stable. Her 07:30 glucose check can go to Luis. Her mealtime insulin decision comes later, at breakfast.',
      },
    },
    events, delegation, dialogs, novaHint, endChecks, tick(s, A) {
      const W = s.p['416'];
      if (!W.icu) {
        let r = 0.26; const abxOn = W.abxAt !== null && s.t > W.abxAt + 30; if (abxOn) r = 0.1;
        if (W.bolusAt !== null) { const d = s.t - W.bolusAt; if (d > 0 && d <= 60) r = -0.45; else if (d > 60) r = abxOn ? -0.08 : 0.12; }
        W.sev = clamp(W.sev + r, 8, 100);
        if (W.abxAvail !== null && s.t >= W.abxAvail && s.meds['416-cef'].status === 'verify') { s.meds['416-cef'].status = 'due'; A.msg({ from: 'omar', pid: '416', text: 'Ceftriaxone for 416 is verified and in the tube station.' }); }
      }
      const R = s.p['418'];
      if (s.t >= 90) { if (R.lasixAt === null) R.fl += 0.15; else if (s.t > R.lasixAt + 20) R.fl = Math.max(38, R.fl - 0.18); }
      if (!R.educated) R.fl += 0.02;
    },
  });
})(window.Shift);
