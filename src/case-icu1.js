/* Case: 3 West ICU, day shift (07:00 to 12:00). Specialty: Critical care.
   Themes: the number on the pump, the alarm on the vent and the quiet chest tube all tell you something. So does a family.
   711: Septic shock from an obstructed, infected kidney. Norepinephrine running through a peripheral IV overnight; the new
        central line is in but nobody has read the x-ray. The peripheral site is extravasating. MAP goal 65: chase the
        number in either direction and you hurt him. Source control (IR nephrostomy) at 10:00 needs a surrogate's consent.
   712: ARDS from influenza, ventilator day 3. SAT is due but he fails the SBT screen (FiO2 0.6, PEEP 12). Lightened, he is
        delirious and reaches for his tube. At 09:15 a mucus plug: high-pressure alarm and falling SpO2. DOPE: bag, check
        the tube, suction. Silencing it or sedating him is how he arrests.
   713: Day 1 after CABG x3. Chest tube output stops at 08:15 while her heart rate climbs, her pressure falls, her pulse
        pressure narrows and her CVP rises: tamponade from clotted tubes. "The bleeding stopped" is the trap.
   714: Anoxic brain injury after a cardiac arrest. Family meeting at 10:30. The nurse prepares, attends, clarifies; the OPO
        is called before anyone discusses withdrawal; the nurse never raises donation; comfort care done well. */
(function (S) {
  const { clamp, clock } = S.engine;
  const jit = (s, seed) => ((Math.floor(s.t / 5) * 7 + seed * 13) % 3) - 1;
  const LK = (skin, shade, lip, blush, iris, hair, hcol, cloth, extras, smile) => ({ skin, shade, lip, blush, iris, head: { w: 55, h: 61, jaw: .4 }, eye: 9.8, hair: { style: hair, color: hcol }, brow: { w: 3.6, color: hcol }, body: { w: 82, cloth }, extras: extras || [], smile: smile === undefined ? .3 : smile });

  /* ---------- 711 Frank Kowalski: septic shock on norepinephrine; a peripheral site, an unconfirmed central line ---------- */
  const neEff = (P) => (P.site === 'off' ? 0 : P.site === 'peri' ? P.ne * (1 - Math.min(.7, P.ext * .6)) : P.ne);
  const frMAP = (P) => Math.round(55 + neEff(P) + (P.vaso ? 6 : 0) - (P.sev - 1) * 12 - P.bpDrop);
  const frSBP = (P) => Math.round(frMAP(P) * 1.45);
  const frDBP = (P) => Math.round((3 * frMAP(P) - frSBP(P)) / 2);
  const frank = {
    id: '711', room: '711', name: 'Frank Kowalski', short: 'Mr. Kowalski', age: 64, sex: 'M', mrn: '00718842', provider: 'siddiqui',
    look: { skin: '#E8C3A4', shade: '#CDA384', lip: '#AE6A5E', blush: '#E39A86', iris: '#4E6A84', head: { w: 58, h: 62, jaw: .6 }, eye: 9.2,
      hair: { style: 'balding', color: '#BDB6AE' }, brow: { w: 4, color: '#A39C94' }, body: { w: 88, cloth: 'gown' }, extras: ['mustache', 'cannula'], smile: .2,
      lines: { calm: `Linda? Is it morning?`, drowsy: `Mm. So tired. What day is it?`, anxious: `My arm's cold. Why is my arm cold?`, pain: `My back. Left side. Like a kick.`, none: `(He doesn't open his eyes.)` } },
    bio: `Retired union electrician, IBEW Local 6. Wired half the houses on his street, including his own. Married to Linda for 41 years.`,
    dx: `Septic shock from an obstructed kidney`, reason: `Urosepsis from a 9 mm left ureteral stone with hydronephrosis. Hypotensive in the ED despite 30 mL/kg of fluid; norepinephrine started at 01:00 through a peripheral IV. Right IJ central line placed at 06:30. IR nephrostomy planned for 10:00.`,
    hx: [`Hypertension, on metoprolol and lisinopril at home`, `Kidney stones in 2019`, `No other medical problems`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `90 kg`,
    lines: [`PIV 18g left forearm: norepinephrine 4 mg/250 mL`, `PIV 20g right hand: antibiotic, saline lock`, `Right internal jugular triple-lumen central line, placed 06:30: capped, placement not yet confirmed`, `Foley catheter`],
    mobility: `Bed rest`, diet: `NPO for IR at 10:00`,
    init: { ne: 12, site: 'peri', away: null, ext: 0, extFound: false, periStopped: false, cxrRead: false, unconfirmed: false, centralAt: null, phentAt: null, vaso: false, vasoAt: null, sev: 1, bpDrop: 0, lowMap: 0, crashMin: 0, crash: false, injury: false, lacDrawn: null, lac2: null, lacSeen: false, lacCalled: false, uo: 28, consent: null, irDelayed: false, awayAt: null, srcDone: false, postIR: false, evaluated: false, over: 0, under: 0, homeGiven: 0, called: false, cap: false, cefAt: null },
    nightVitals: { T: 38.6, HR: 110, SBP: 96, DBP: 54, RR: 22, SpO2: 94, O2: '4 L nasal cannula', pain: 3 },
    labs: [
      { name: 'Lactate', val: 4.6, unit: 'mmol/L', ref: 'under 2.0', flag: 'H', t: -180 },
      { name: 'WBC', val: 21.4, unit: 'K/µL', ref: '4.5–11.0', flag: 'H', t: -180 },
      { name: 'Creatinine', val: 2.1, unit: 'mg/dL', ref: '0.7–1.3 (baseline 0.9)', flag: 'H', t: -180 },
      { name: 'Platelets', val: 118, unit: 'K/µL', ref: '150–400', flag: 'L', t: -180 },
      { name: 'INR', val: 1.3, unit: '', ref: '0.9–1.1', flag: 'H', t: -180 },
      { name: 'Blood and urine cultures', val: 'Drawn in the ED 23:40, before antibiotics. Pending', unit: '', ref: '', flag: '', t: -440 },
      { name: 'Chest x-ray (line placement)', val: 'Image taken 06:45. Read pending', unit: '', ref: '', flag: '', t: -15 },
    ],
    orders: [
      { t: -360, text: `Norepinephrine 4 mg in 250 mL (16 mcg/mL). Titrate by 2 mcg/min every 5 minutes to keep MAP 65 or higher. Maximum 30 mcg/min. Wean by 2 mcg/min for MAP over 75. Run through a central line once placement is confirmed.` },
      { t: -360, text: `Vasopressin 0.03 units/min IV, fixed rate (do not titrate), if norepinephrine reaches 20 mcg/min or more. Notify the intensivist when started.` },
      { t: -360, text: `Vasopressor extravasation protocol: stop the infusion at the site, leave the catheter in and aspirate, elevate the limb, notify the provider. Phentolamine 5 mg in 10 mL normal saline, injected subcutaneously around the site.` },
      { t: -30, text: `Central line: do not use until tip position is confirmed on chest x-ray and no pneumothorax is seen.` },
      { t: -360, text: `Lactate repeat at 08:00. Hourly urine output; notify for under 0.5 mL/kg/h for 2 hours. Piperacillin-tazobactam 4.5 g IV every 6 hours (next 09:30).` },
      { t: -360, text: `Home medications on the MAR: metoprolol tartrate 25 mg PO twice daily (09:00), lisinopril 10 mg PO daily (09:00). NPO for IR nephrostomy at 10:00; consent needed.` },
    ],
    notes: [
      { t: -40, author: 'Bree, night RN', text: `Norepinephrine up from 6 to 12 overnight for MAPs in the low 60s; MAP 64 to 70 since 04:00. Peripheral 18g left forearm, good blood return at 04:00. Right IJ placed by Dr. Siddiqui at 06:30, x-ray taken, not read yet. Urine 25 to 30 mL/h. Drowsy, oriented to self. Wife Linda at the bedside since 02:00.` },
    ],
    io: { intake: `ED: 2.7 L crystalloid (30 mL/kg). Overnight: 600 mL including drips`, output: `Foley: 25 to 30 mL/h overnight` },
    report: [
      { text: `Frank Kowalski, 64, septic shock from an infected kidney stone. Norepinephrine at 12, MAPs mid-60s.`, key: true },
      { text: `The norepi's still in his forearm peripheral. The central line went in at six-thirty; I don't think anybody's read the x-ray.`, key: true },
      { text: `Lactate was 4.6 at four. Repeat's due at eight.`, key: true },
      { text: `IR's doing a nephrostomy at ten. He's drowsy; his wife Linda is here.`, key: true },
      { text: `He's an electrician. He told me how to fix the light in the break room.`, key: false },
      { text: `His home metoprolol and lisinopril are on the MAR for nine.`, key: false },
    ],
    vitals(s, P) { const m = frMAP(P); return { T: +(38.6 - (P.srcDone ? .6 : 0) - (P.cefAt !== null ? .1 : 0)).toFixed(1), HR: Math.round(clamp(106 + (65 - m) * 1.2 - (P.srcDone ? 10 : 0), 84, 140)) + jit(s, 1) * 2, SBP: frSBP(P) + jit(s, 2), DBP: frDBP(P), RR: 22, SpO2: 94, O2: '4 L nasal cannula', pain: 3, extra: P.away ? '' : `MAP ${m} on norepinephrine ${P.site === 'off' ? '0 (stopped at the site)' : P.ne + ' mcg/min'}${P.vaso ? ' and vasopressin 0.03 units/min' : ''}.` }; },
    assess: {
      general: (s, P) => (P.away ? `He's in IR.` : frMAP(P) < 58 ? `Gray and clammy. Mottled knees. Hard to rouse.` : `Drowsy, flushed, lying still. Linda is holding his right hand.`),
      resp: (s, P) => (P.away ? `He's in IR.` : `RR 22, unlabored on 4 L. Clear, a few crackles at the right base.`),
      cardiac: (s, P, A) => { if (P.away) return `He's in IR.`; P.k.card = s.t; const v = A.vitals('711'); return `HR ${v.HR}, sinus tachycardia. BP ${v.SBP}/${v.DBP}, MAP ${frMAP(P)}. ${frMAP(P) >= 65 ? 'Feet warm, capillary refill 3 seconds.' : 'Cool feet, capillary refill 4 seconds, mottled knees.'}`; },
      neuro: (s, P) => { if (P.away) return `He's in IR.`; P.cap = true; P.k.neuro = s.t; return frMAP(P) < 60 ? `Opens his eyes to a loud voice. Mumbles. Doesn't know where he is.` : `Drowsy. Oriented to himself only. Asked why he's here, he says "my back... a stone?" and drifts off. He can't tell you what the 10:00 procedure is or why it's needed.`; },
      pain: (s, P) => (P.away ? `He's in IR.` : `Left flank pain 3/10, "a kick in the back." No chest pain.`),
      skin: (s, P) => { if (P.away) return `He's in IR.`; P.k.skin = s.t; if (P.ext >= .2 && P.site === 'peri') { P.extFound = true; P.extAt = P.extAt === undefined ? s.t : P.extAt; } return P.ext >= .2 && !P.periStopped && P.site === 'peri' ? `Hot and flushed, except the left forearm: around the 18g the skin is pale, cool and hard, about ${Math.round(4 + P.ext * 6)} cm across. Slow refill in that patch.` : P.injury ? `Left forearm: a dusky, blistered patch around the old IV site. Elevated.` : P.periStopped ? `Left forearm: the pale patch is ${P.phentAt !== null ? 'pinking up at the edges after phentolamine' : 'still pale and cool'}. Arm elevated on a pillow.` : `Hot and flushed. Peripheral IV sites look clean. Central line dressing dry.`; },
      gi: (s, P) => (P.away ? `He's in IR.` : `Abdomen soft. Left flank tender. Foley draining ${Math.round(P.uo)} mL in the last hour, dark amber${P.srcDone ? '. Left nephrostomy draining cloudy urine' : ''}.`),
    },
    interventions: [
      { id: 'site', label: 'Check the peripheral IV site running the norepinephrine', cost: 1, avail: (s, P) => !P.away && P.site === 'peri',
        run(s, P, A) { P.k.site = s.t; if (P.ext >= .2) { P.extFound = true; if (P.extAt === undefined) P.extAt = s.t; A.judge('711-site', 'assess', 2, `You checked Mr. Kowalski's pressor site and found the extravasation.`, `A vasopressor in a peripheral vein can leak into the tissue and clamp down the blood supply around it. Pale, cool, hard skin around the site is the sign. Check it at least hourly while it runs there.`, '711'); return `The skin around the 18g is pale, cool and hard, about ${Math.round(4 + P.ext * 6)} cm across. The pump shows no alarm. The norepinephrine is going into his arm, not his vein.`; }
          A.judge('711-site', 'assess', 1, `You checked Mr. Kowalski's peripheral pressor site.`, `Peripheral norepinephrine needs the site checked often. It looks fine now; the safer fix is to move it to the central line once placement is confirmed.`, '711'); return `Site soft, warm, no blanching. Good blood return. Still, a vasopressor in a forearm vein is a time-limited arrangement.`; } },
      { id: 'cxr', label: 'Read the chest x-ray report for the new central line', cost: 1, avail: (s, P) => s.t >= 20 && !P.cxrRead,
        run(s, P, A) { P.cxrRead = true; A.judge('711-cxr', 'assess', 2, `You read the x-ray report before using Mr. Kowalski's central line.`, `A new central line isn't used until the x-ray shows where the tip is and that the lung is up. A tip in the wrong place, or a pneumothorax, turns a vasopressor line into an emergency.`, '711'); return `Final read 07:18: "Right internal jugular catheter, tip at the cavoatrial junction. No pneumothorax." The line is cleared for use.`; } },
      { id: 'extstop', label: 'Extravasation: stop the infusion at the site, leave the catheter in, aspirate, elevate the arm', cost: 3, avail: (s, P) => !P.away && P.extFound && !P.periStopped,
        run(s, P, A) { P.periStopped = true; P.periAt = s.t; if (P.site === 'peri') P.site = 'off';
          A.judge('711-extstop', 'safety', 2, `You stopped the norepinephrine at the extravasated site and aspirated.`, `Stop the infusion at that site, leave the catheter in to aspirate what you can (and in some protocols to give the antidote), elevate, notify. Then the pressor needs a new home right away.`, '711');
          return `Pump stopped. Tubing off; you draw back 3 mL of pink fluid through the catheter and leave it in place. Arm up on two pillows. MAP ${frMAP(P)} and falling: he needs the norepinephrine running somewhere else, now.`; } },
      { id: 'central', label: 'Run the norepinephrine through the new central line', cost: 3, avail: (s, P) => !P.away && P.site !== 'central',
        run(s, P, A) {
          if (!P.cxrRead) { P.unconfirmed = true; A.judge('711-central-early', 'safety', -3, `You ran a vasopressor through a central line nobody had confirmed.`, `Until the x-ray shows the tip position and no pneumothorax, the line isn't cleared for use. The report was minutes away.`, '711'); }
          else if (P.extFound && !P.periStopped) A.judge('711-central-site', 'safety', -1, `You moved the norepinephrine without managing the extravasated site.`, `Moving the drip stops more drug going into the arm, but the site still needs the protocol: aspirate through the catheter, elevate, phentolamine, notify.`, '711');
          else A.judge('711-central', 'safety', 2, P.extFound ? `You moved the norepinephrine to the confirmed central line.` : `You moved the norepinephrine to the confirmed central line before the peripheral site failed.`, `Once the tip is confirmed, a vasopressor belongs in a central line. ${P.extFound ? 'The sooner it\'s back in a vein, the shorter the drop in pressure.' : 'Doing it early means the forearm never gets the chance to extravasate.'}`, '711');
          if (P.site === 'peri') { P.periStopped = P.periStopped || !P.extFound; }
          P.site = 'central'; P.centralAt = s.t;
          return `Norepinephrine on the distal port of the right IJ line at ${P.ne} mcg/min, its own lumen, nothing else on it. MAP coming back up.`; } },
      { id: 'lactate', label: 'Draw the repeat lactate', cost: 3, avail: (s, P) => !P.away && s.t >= 40 && P.lacDrawn === null,
        run(s, P, A) { P.lacDrawn = s.t; const good = P.lowMap <= 20 && P.ext < .6 && !P.crash && P.homeGiven === 0; P.lac2 = good ? 3.1 : 5.2; A.judge('711-lacdraw', 'assess', s.t <= 75 ? 1 : 0, s.t <= 75 ? `You drew Mr. Kowalski's repeat lactate on time.` : `You drew Mr. Kowalski's repeat lactate late.`, `The repeat lactate is how you know whether resuscitation is reaching the tissues. Surviving Sepsis: remeasure when the first one is over 2.`, '711'); return `Drawn by venipuncture from his right arm and sent on ice. Result in about 20 minutes.`; } },
      { id: 'lacread', label: 'Review the repeat lactate', cost: 1, avail: (s, P) => P.lac2 !== null && s.t >= P.lacDrawn + 20 && !P.lacSeen,
        run(s, P, A) { P.lacSeen = true; P.k.lacAt = s.t; const up = P.lac2 > 4.6; A.judge('711-lacread', 'judgment', up ? 1 : 2, up ? `You saw that Mr. Kowalski's lactate was rising.` : `You recognized Mr. Kowalski's lactate falling as resuscitation working.`, up ? `4.6 to ${P.lac2}: the tissues are worse off than three hours ago. That's a call: something isn't working.` : `4.6 to 3.1 in four hours is clearance of about a third. Pressure, perfusion and treatment are moving the right way; keep going.`, '711'); return `Lactate ${P.lac2} at ${clock(P.lacDrawn)}, from 4.6 at 04:00. ${up ? 'Rising.' : 'Falling, about 33% clearance.'}`; } },
      { id: 'postir', label: 'Post-procedure check: nephrostomy site and output, MAP, mental status', cost: 3, avail: (s, P) => P.srcDone && !P.away && !P.postIR,
        run(s, P, A) { P.postIR = true; A.judge('711-postir', 'assess', 1, `You checked Mr. Kowalski after his nephrostomy.`, `After source control: the drain, the site, the pressure. Purulent urine draining means the source is open.`, '711'); return `Left nephrostomy dressing dry, draining cloudy yellow urine, 60 mL so far. MAP ${frMAP(P)} on ${P.ne} mcg/min. More awake: "Linda, did they fix it?"`; } },
      { id: 'eval', label: 'Evaluate his resuscitation: MAP trend, urine output, lactate, mental status', cost: 3, avail: (s, P) => !P.away && P.lacSeen && s.t >= 150 && !P.evaluated,
        run(s, P, A) { P.evaluated = true; const ok = frMAP(P) >= 65 && P.uo >= 45 && P.lac2 < 4.6; A.judge('711-eval', 'judgment', ok ? 2 : 1, `You evaluated whether Mr. Kowalski's resuscitation was working.`, `Not one number: MAP at goal on a steady or falling pressor dose, urine 0.5 mL/kg/h or more (45 mL/h for him), lactate clearing, mind clearing. ${ok ? 'All moving the right way.' : 'Not all there yet; say what isn\'t when you hand off.'}`, '711');
          return `MAP ${frMAP(P)} on norepinephrine ${P.ne}${P.vaso ? ' plus vasopressin' : ''}. Urine ${Math.round(P.uo)} mL/h (goal 45 or more). Lactate ${P.lac2} from 4.6. ${P.srcDone ? 'Nephrostomy draining. ' : ''}${frMAP(P) >= 65 ? 'Following simple commands now.' : 'Still drowsy.'}`; } },
    ],
    meds: [
      { id: '711-ne', name: 'Norepinephrine infusion', dose: 'titrate to MAP 65 or higher', route: 'IV', freq: 'Continuous; titrate per order', prn: true, infusion: true,
        block: (s, P) => (P.away ? 'He\'s in IR with the IR nurse.' : P.site === 'off' ? 'Stopped at the extravasated site. Run it through the confirmed central line (Care tab).' : null),
        param: 'Titrate by 2 mcg/min every 5 minutes for MAP 65 or higher; wean for MAP over 75',
        checks: (s, P) => [{ label: 'MAP', value: `${frMAP(P)}`, ok: frMAP(P) >= 65 && frMAP(P) <= 75 }, { label: 'Current rate', value: `${P.ne} mcg/min`, ok: null }, { label: 'Line', value: P.site === 'central' ? 'Central line, tip confirmed' : 'Peripheral 18g, left forearm', ok: P.site === 'central' }, { label: 'Vasopressin', value: P.vaso ? 'Running' : 'Add at 20 mcg/min or more', ok: null }],
        doses: [{ id: 1, label: 'Increase by 2 mcg/min' }, { id: 2, label: 'Decrease by 2 mcg/min' }, { id: 3, label: 'No change' }],
        give(s, P, A, dose) {
          const m = frMAP(P);
          if (dose === 1) {
            if (m >= 65) { P.over += 1; A.judge('711-over', 'meds', m > 70 ? -2 : -1, `You turned up Mr. Kowalski's norepinephrine with a MAP of ${m}.`, `The goal is 65 or higher, not higher is better. More vasopressor than he needs clamps down on gut, kidneys and fingers, and makes arrhythmias more likely. Chasing the number is a harm of its own.`, '711'); }
            else A.judge('711-up', 'meds', 1, `You titrated Mr. Kowalski's norepinephrine up for a MAP of ${m}.`, `Under 65, by the order, in the step it allows. Recheck in 5 minutes.`, '711');
            P.ne = Math.min(30, P.ne + 2); return `Norepinephrine up to ${P.ne} mcg/min. MAP ${frMAP(P)} a few minutes later.${P.ne >= 20 && !P.vaso ? ' That\'s the vasopressin threshold in his orders.' : ''}`;
          }
          if (dose === 2) {
            if (m < 69) { P.under += 1; A.judge('711-down', 'meds', m < 66 ? -2 : -1, `You weaned Mr. Kowalski's norepinephrine with a MAP of ${m}.`, `His order says wean for MAP over 75. At ${m}, a 2 mcg/min drop puts him under 65, and a MAP under 65 is the kidneys and the gut going without.`, '711'); }
            else A.judge('711-wean', 'meds', 1, `You weaned Mr. Kowalski's norepinephrine for a MAP of ${m}.`, `Above the goal: the least vasopressor that holds 65 is the right dose.`, '711');
            P.ne = Math.max(0, P.ne - 2); return `Norepinephrine down to ${P.ne} mcg/min. MAP ${frMAP(P)}.`;
          }
          if (m < 65) A.judge('711-nochange', 'meds', -1, `You left Mr. Kowalski's norepinephrine unchanged with a MAP of ${m}.`, `Under 65 the order says titrate. Every minute under goal is less blood to his kidneys.`, '711');
          else A.judge('711-hold', 'meds', 1, `You left Mr. Kowalski's norepinephrine alone with a MAP of ${m}.`, `At goal: no change is the right titration.`, '711');
          return `No change. ${P.ne} mcg/min, MAP ${m}.`;
        } },
      { id: '711-vaso', name: 'Vasopressin', dose: '0.03 units/min', route: 'IV', freq: 'Fixed rate, if norepinephrine 20 mcg/min or more', prn: true, infusion: true,
        block: (s, P) => (P.away ? 'He\'s in IR.' : P.vaso ? `Running since ${clock(P.vasoAt)}.` : null),
        checks: (s, P) => [{ label: 'Norepinephrine', value: `${P.ne} mcg/min`, ok: P.ne >= 20 }, { label: 'Line', value: P.site === 'central' ? 'Central, confirmed' : 'No confirmed central line', ok: P.site === 'central' }],
        give(s, P, A) { P.vaso = true; P.vasoAt = s.t; if (P.ne < 20) A.judge('711-vaso', 'meds', -1, `You started vasopressin with norepinephrine at ${P.ne}.`, `His order adds it at 20 mcg/min or more. Below that, titrate the norepinephrine.`, '711'); else A.judge('711-vaso', 'meds', 1, `You added vasopressin at the ordered norepinephrine threshold.`, `Surviving Sepsis: add vasopressin rather than keep escalating norepinephrine. Fixed rate; tell the intensivist.`, '711'); return `Vasopressin 0.03 units/min on its own central lumen.`; } },
      { id: '711-pip', name: 'Piperacillin-tazobactam', dose: '4.5 g', route: 'IV', freq: 'Every 6 hours', due: 150, block: (s, P) => (P.away ? 'He\'s in IR.' : null),
        checks: () => [{ label: 'Cultures', value: 'Drawn before the first dose', ok: true }, { label: 'Allergies', value: 'None', ok: true }],
        give(s, P, A) { P.cefAt = s.t; A.judge('711-pip', 'meds', s.t <= 165 ? 1 : 0, `You gave Mr. Kowalski's antibiotic${s.t <= 165 ? ' on time' : ' late'}.`, `In septic shock, every dose on time matters as much as the first.`, '711'); return `Piperacillin-tazobactam 4.5 g IV over 30 minutes.`; },
        hold(s, P, A) { A.judge('711-pip-hold', 'meds', -3, `You held Mr. Kowalski's antibiotic.`, `Antibiotics are the treatment for septic shock. Missing a dose lets the infection gain ground.`, '711'); return 'Held.'; } },
      { id: '711-meto', name: 'Metoprolol tartrate (home)', dose: '25 mg', route: 'PO', freq: 'Twice daily', due: 120, param: 'Home blood pressure medication',
        checks: (s, P) => [{ label: 'MAP', value: `${frMAP(P)} on norepinephrine`, ok: false }, { label: 'Diet', value: 'NPO for IR', ok: false }],
        give(s, P, A) { P.homeGiven += 1; P.bpDrop += 8; A.judge('711-meto', 'meds', -3, `You gave Mr. Kowalski his home metoprolol in septic shock.`, `He needs a vasopressor to hold a MAP of 65. A beta-blocker lowers his pressure and blunts the heart rate he's using to compensate. Home antihypertensives are held in shock.`, '711'); return `Metoprolol 25 mg given with a sip of water.`; },
        hold(s, P, A) { A.judge('711-meto-hold', 'meds', 1, `You held Mr. Kowalski's home metoprolol.`, `In shock on a vasopressor, his blood pressure medicines are held. Ask the team to discontinue them for now.`, '711'); return 'Held: septic shock on norepinephrine, NPO.'; } },
      { id: '711-lisin', name: 'Lisinopril (home)', dose: '10 mg', route: 'PO', freq: 'Daily', due: 120, param: 'Home blood pressure medication',
        checks: (s, P) => [{ label: 'MAP', value: `${frMAP(P)} on norepinephrine`, ok: false }, { label: 'Creatinine', value: '2.1 (baseline 0.9)', ok: false }],
        give(s, P, A) { P.homeGiven += 1; P.bpDrop += 7; A.judge('711-lisin', 'meds', -3, `You gave Mr. Kowalski lisinopril in septic shock with an acute kidney injury.`, `An ACE inhibitor lowers pressure and the kidney's filtering pressure. In shock with a creatinine of 2.1 it's held.`, '711'); return `Lisinopril 10 mg given.`; },
        hold(s, P, A) { A.judge('711-lisin-hold', 'meds', 1, `You held Mr. Kowalski's lisinopril.`, `Shock and an acute kidney injury: held, and the team told.`, '711'); return 'Held: septic shock, AKI.'; } },
      { id: '711-phent', name: 'Phentolamine (extravasation protocol)', dose: '5 mg in 10 mL', route: 'SC around the site', freq: 'Once, per protocol', prn: true, available: (s, P) => P.extFound,
        block: (s, P) => (P.phentAt !== null ? `Given at ${clock(P.phentAt)}.` : null),
        checks: (s, P) => [{ label: 'Infusion at the site', value: P.periStopped ? 'Stopped, aspirated' : 'Still running', ok: P.periStopped }, { label: 'Site', value: 'Pale, cool, hard', ok: null }],
        give(s, P, A) { P.phentAt = s.t; if (!P.periStopped) A.judge('711-phent', 'meds', -1, `You gave phentolamine with the norepinephrine still running into the site.`, `Stop the infusion at the site first, or you're giving the antidote and the poison at once.`, '711'); else A.judge('711-phent', 'meds', 2, `You gave phentolamine for the extravasation.`, `Phentolamine blocks the alpha receptors norepinephrine is clamping down on, so blood can get back to the tissue. Sooner is better, ideally within 12 hours.`, '711'); return `Phentolamine 5 mg in 10 mL, small subcutaneous injections around the pale area with a fine needle. Arm elevated.`; } },
    ],
    talk: (s, P) => (P.away ? null : P.k.talked ? 'fr_after' : 'fr_talk'),
    family: { name: 'Linda', rel: 'Wife', mode: 'bedside', cost: 3, avail: (s, P) => !P.away, dialog: (s, P) => (P.k.linda ? 'linda_after' : 'linda_talk') },
    sbar: {
      items(s, P, A) {
        const v = A.vitals('711');
        return [
          { id: 'map', label: `MAP ${frMAP(P)} on norepinephrine ${P.site === 'off' ? '(stopped at the site)' : P.ne + ' mcg/min'}`, key: true, need: true },
          { id: 'ext', label: 'Peripheral norepinephrine site extravasated: pale, cool, hard', key: true, need: P.extFound, lock: 'Check the IV site' },
          { id: 'line', label: P.cxrRead ? 'Central line tip confirmed on x-ray, no pneumothorax' : 'Central line x-ray not yet read', key: P.cxrRead, need: true },
          { id: 'lac', label: P.lac2 !== null && P.lacSeen ? `Lactate ${P.lac2}, from 4.6 at 04:00` : 'Repeat lactate pending', key: P.lacSeen, need: true },
          { id: 'uo', label: `Urine ${Math.round(P.uo)} mL/h`, key: P.uo < 45, need: true },
          { id: 'meds', label: 'Home metoprolol and lisinopril held', key: false, need: s.meds['711-meto'].status === 'held' || s.meds['711-lisin'].status === 'held' },
          { id: 'hr', label: `HR ${v.HR}, temp ${v.T}`, key: false, need: true },
          { id: 'wire', label: 'Retired electrician', key: false, need: true },
        ];
      },
      requests: [
        { id: 'ext', label: 'His peripheral norepinephrine extravasated. I stopped it at the site and aspirated. The x-ray confirms the central line; I\'m running it there. I\'m giving phentolamine per protocol. Can you look at the arm?' },
        { id: 'lac', label: 'His lactate is going up and his urine is down. Can you come and reassess his resuscitation?' },
        { id: 'up', label: 'Can I run his MAP a little higher, say 75, to be safe?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'up') { A.judge('711-sbar-up', 'judgment', -1, `You asked to raise Mr. Kowalski's MAP goal without a reason.`, `MAP 65 is the evidence-based starting target in septic shock. Higher targets mean more vasopressor and more harm, without better survival for most patients.`, '711'); return `No. Sixty-five is the goal. More pressor isn't safer. What's his lactate doing?`; }
        P.called = true;
        if (req === 'ext' || picked.includes('ext')) {
          if (!P.extFound) return `What's going on with the site?`;
          A.judge('711-sbar', 'comm', picked.includes('line') ? 2 : 1, `You called about Mr. Kowalski's extravasation.`, `Say what happened, what you've already done under the protocol, and what you need: the provider has to see the site and document it.`, '711');
          return P.cxrRead ? `Good. Central line's cleared, use it. Phentolamine per protocol, elevate, mark the edges with a pen so we can see if it spreads. I'll come look before IR.` : `Read the x-ray before you use that central line; it should be resulted by now. Then move the pressor. Phentolamine per protocol.`;
        }
        if (req === 'lac' || picked.includes('lac')) {
          if (P.lacSeen && P.lac2 > 4.6) { P.lacCalled = true; A.judge('711-sbar-lac', 'comm', 2, `You called about Mr. Kowalski's rising lactate.`, `A rising lactate on a vasopressor means perfusion is failing. Find out why: the pressor going into his arm, a drug that dropped his pressure, an undrained source.`, '711'); return `Rising? Is the norepinephrine actually going into a vein? Get it on the central line, give him another 500 of balanced crystalloid, and I'll be there in five. IR needs to know too.`; }
          if (P.lacSeen) { A.judge('711-sbar-lac', 'comm', 1, `You updated the intensivist on Mr. Kowalski's lactate.`, `Clearing lactate is good news worth passing on, especially before IR.`, '711'); return `Three-one, good. Keep the MAP at 65 and get him to IR at ten.`; }
          return `What was the repeat lactate?`;
        }
        A.judge('711-sbar-fyi', 'comm', 0, `You called with an update on Mr. Kowalski.`, `Fine, but a call is for a decision. Lead with what's changed.`, '711');
        return `Okay. MAP 65, lactate at eight, IR at ten.`;
      },
    },
    scene: (s, P) => ({ tele: true, iv: P.site === 'off' ? 'lock' : 'running', o2: 4, foley: true, family: P.away ? null : 'linda', familyLabel: 'Linda, his wife, holding his hand', empty: !!P.away, emptyText: 'In IR for a left nephrostomy. Back about ' + (P.awayAt !== null ? clock(P.awayAt + 45) : '10:45') + '.' }),
    clues: (s, P) => ({ iv: P.site === 'central' ? `Norepinephrine ${P.ne} mcg/min on the central line. The forearm IV is capped${P.extFound ? ', the arm on pillows' : ''}.` : P.site === 'off' ? `The norepinephrine pump is stopped. The bag is still hanging.` : `Norepinephrine ${P.ne} mcg/min into the 18g in his left forearm. The central line ports are capped and labeled "do not use: CXR pending."`, family: `Linda, in yesterday's clothes, holding his hand. A thermos of coffee she hasn't touched. A list on her phone titled "Questions for the doctor."`, foley: `Foley bag: dark amber. ${Math.round(P.uo)} mL in the last hour.`, monitor: `MAP ${frMAP(P)}.`, o2: `Nasal cannula at 4 L.` }),
    rig: (s, P) => ({ sbp: frSBP(P), alert: frMAP(P) < 60 ? 2 : 1, anxious: P.ext >= .3 && P.site === 'peri' ? .5 : 0, pain: 3 }),
    status: (s, P) => (P.away ? 'watch' : frMAP(P) < 60 || P.site === 'off' || (P.ext >= .2 && P.site === 'peri') ? 'urgent' : frMAP(P) < 65 || P.site === 'peri' || !P.srcDone ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.injury || P.crash) return { tone: 'bad', title: P.injury ? 'Extravasation injury, shock worse' : 'Shock worsened on your watch', text: `${P.injury ? 'Norepinephrine ran into his left forearm until the skin broke down; plastic surgery will see the wound. ' : ''}${P.crash ? 'His MAP sat under 55 for a quarter of an hour. ' : ''}${P.homeGiven ? 'His home blood pressure pills went in too. ' : ''}${P.lac2 ? `Lactate ${P.lac2}.` : ''}` };
      const misses = [P.unconfirmed && 'a central line used before the x-ray was read', P.over && 'norepinephrine turned up above goal', P.under && 'weaned below goal', P.homeGiven && 'a home blood pressure pill given', !P.lacSeen && 'the repeat lactate never reviewed', P.consent !== 'surrogate' && (P.irDelayed ? 'no valid consent, so IR waited' : 'consent handled the wrong way')].filter(Boolean);
      if (P.srcDone && !misses.length) return { tone: 'good', title: 'Resuscitated and source controlled', text: `MAP held at goal${P.site === 'central' ? ' on the confirmed central line' : ''}, lactate ${P.lac2} from 4.6, nephrostomy draining at ${clock(P.awayAt + 45)}. ${P.extFound ? 'The forearm site was caught and treated.' : 'The pressor moved before the forearm could extravasate.'}${P.evaluated ? ' You checked that it was working.' : ''}` };
      return { tone: 'mixed', title: P.srcDone ? 'Better, with gaps' : 'Still waiting on source control', text: `${misses.length ? 'Missed: ' + misses.join('; ') + '.' : ''} ${P.srcDone ? 'The nephrostomy is draining.' : 'The infected kidney is still blocked.'}` };
    },
  };

  /* ---------- 712 Tuan Pham: ARDS on the ventilator; SAT without SBT; delirium; a mucus plug at 09:15 ---------- */
  const tuRASS = (s, P) => (P.arrest ? -5 : !P.sedOff ? (P.resedated ? -1 : -3) : P.resedated ? -1 : Math.min(P.alts ? 1 : 2, Math.round(-3 + (s.t - P.satAt) / 4)));
  const tuSpO2 = (P) => Math.round(clamp(91 - P.plug * 30 + (P.bagged && P.plugOn ? 5 : 0) - (P.sbtOn ? 7 : 0), 40, 96));
  const tuPeak = (P) => Math.round(32 + (P.plugOn ? 8 + P.plug * 20 : 0));
  const tuan = {
    id: '712', room: '712', name: 'Tuan Pham', short: 'Mr. Pham', talkLabel: 'Check on Mr. Pham', age: 52, sex: 'M', mrn: '00720419', provider: 'siddiqui', vented: true,
    look: { skin: '#E3B98E', shade: '#C49A70', lip: '#A0645A', blush: '#DC9478', iris: '#2A1C12', head: { w: 55, h: 61, jaw: .5 }, eye: 9.4,
      hair: { style: 'short', color: '#1E1A18' }, brow: { w: 3.8, color: '#1A1614' }, body: { w: 82, cloth: 'gown' }, extras: ['ett'], smile: 0,
      lines: { calm: `(Awake. He nods slowly and squeezes your hand.)`, anxious: `(Eyes wide. He mouths something around the tube and reaches for it.)`, drowsy: `(He opens his eyes to his name, then closes them.)`, dys: `(He's fighting the ventilator, chest heaving.)`, none: `(Sedated on the ventilator. His eyes stay closed; his chest rises with each breath from the machine.)` } },
    bio: `High school band director for 24 years. Plays trumpet. His partner Michael is a nurse anesthetist at another hospital.`,
    dx: `ARDS from influenza A, ventilator day 3`, reason: `Influenza A pneumonia progressing to ARDS. Intubated 3 days ago. Lung-protective ventilation; sedation with propofol and fentanyl.`,
    hx: [`Asthma as a child`, `Skipped his flu shot this year`, `No other medical problems`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `82 kg (predicted body weight 66 kg, height 170 cm)`,
    lines: [`Endotracheal tube 7.5, 23 cm at the teeth, subglottic suction port`, `Left subclavian central line: propofol, fentanyl`, `Right radial arterial line`, `Orogastric tube: feeds at 40 mL/h`, `Foley catheter`],
    mobility: `Bed rest; turn every 2 hours`, diet: `Tube feeds at goal`,
    init: { sedOff: false, satAt: null, screened: false, sbtPlan: null, sbtOn: false, sbtTried: false, resedated: false, fentOn: true, alts: false, micHelped: false, cpot: false, agitAt: null, rOrder: false, restrained: false, rAt: null, rAgit: false, rChecks: [], rNote: false, released: null, toldMic: false, agitCalled: false, plug: 0, plugOn: false, plugAt: null, bagged: false, tubeChecked: false, cleared: null, silenced: false, postPlug: false, arrest: false, selfExt: false, hob: 15, oral: false, turnAt: -70, abg: false },
    nightVitals: { T: 37.9, HR: 96, SBP: 116, DBP: 68, RR: 26, SpO2: 91, O2: 'vent, FiO₂ 60%', pain: 0 },
    labs: [
      { name: 'ABG 05:00', val: 'pH 7.30, PaCO₂ 52, HCO₃ 25, PaO₂ 72', unit: '', ref: 'pH 7.35–7.45, PaCO₂ 35–45, HCO₃ 22–26', flag: 'A', t: -120 },
      { name: 'P/F ratio', val: 120, unit: '', ref: 'over 300; 100–200 is moderate ARDS', flag: 'L', t: -120 },
      { name: 'Influenza A PCR', val: 'Positive', unit: '', ref: '', flag: 'A', t: -4200 },
      { name: 'Triglycerides', val: 210, unit: 'mg/dL', ref: 'under 150 (check on propofol)', flag: 'H', t: -1500 },
      { name: 'Chest x-ray 04:30', val: 'Bilateral diffuse opacities, unchanged. ETT 4 cm above the carina.', unit: '', ref: '', flag: '', t: -150 },
    ],
    orders: [
      { t: -4200, text: `Volume control: tidal volume 400 mL (6 mL/kg predicted body weight), rate 26, PEEP 12, FiO₂ 0.6. Keep plateau pressure 30 or less. SpO₂ goal 88 to 95%. Permissive hypercapnia: notify for pH under 7.25.` },
      { t: -4200, text: `Propofol 5 to 50 mcg/kg/min and fentanyl 25 to 200 mcg/h, titrate to RASS 0 to -1; analgesia first. CPOT and CAM-ICU every 4 hours and as needed.` },
      { t: -4200, text: `Daily paired SAT and SBT per protocol: safety screen first. SBT only if FiO₂ 0.5 or less, PEEP 8 or less, SpO₂ 88% or more, hemodynamically stable. If the SAT fails, restart sedation at half the previous dose.` },
      { t: -4200, text: `VAP prevention: head of bed 30 to 45 degrees, oral care with toothbrushing every 4 hours, subglottic suction, in-line suction as needed. Heparin 5,000 units SC every 8 hours. Pantoprazole 40 mg IV daily. Oseltamivir 75 mg per tube twice daily. Turn every 2 hours, float heels.` },
      { t: -4200, text: `Restraints: non-violent soft wrist restraints only with a provider order, after alternatives fail, to protect life-sustaining devices. Monitor and document per policy; release as soon as no longer needed.` },
    ],
    notes: [
      { t: -60, author: 'Bree, night RN', text: `RASS -3 to -4 overnight; propofol 30, fentanyl 50. Coughed at 04:00 with a desat to 86%, suctioned thick tan secretions, recovered. Turned at 05:00; HOB was flat for the x-ray and I didn't get back to it. Partner Michael at the bedside overnight.` },
    ],
    io: { intake: `Tube feeds 40 mL/h, drips about 30 mL/h`, output: `Foley 60 to 80 mL/h` },
    report: [
      { text: `Tuan Pham, 52, flu ARDS, vent day three. FiO₂ 60, PEEP 12, sats low 90s.`, key: true },
      { text: `He's due for his SAT and SBT this morning.`, key: true },
      { text: `Thick secretions. He plugged a little at four and came back with suctioning.`, key: true },
      { text: `The head of the bed went flat for the x-ray and I didn't get it back up.`, key: true },
      { text: `His partner Michael is a nurse anesthetist. He'll read the vent.`, key: false },
      { text: `He's a band teacher. Michael brought in a picture of his marching band.`, key: false },
    ],
    vitals(s, P) {
      const r = tuRASS(s, P), ag = Math.max(0, r);
      return { T: 37.9, HR: Math.round(96 + P.plug * 28 + ag * 12) + jit(s, 3), SBP: Math.round(116 + ag * 14 - P.plug * 10) + jit(s, 4), DBP: 68 + ag * 4, RR: P.selfExt ? 30 : ag >= 1 ? 34 : 26, SpO2: P.selfExt ? 90 : tuSpO2(P), O2: P.sbtOn ? 'vent, PS 5/PEEP 5' : 'vent, FiO₂ 60%', pain: 0,
        extra: `Vent: VC 400 mL, rate 26, PEEP 12, FiO₂ 60%. Peak ${tuPeak(P)}${P.plugOn ? ' (high-pressure alarm)' : ''}, plateau 28. RASS ${r > 0 ? '+' + r : r}.` };
    },
    assess: {
      general: (s, P) => { const r = tuRASS(s, P); return P.plugOn ? `Dusky. Chest barely moving with each breath. The ventilator is alarming high pressure.` : r >= 1 ? `Eyes open, wild. Both hands reaching for the tube; he coughs and fights the ventilator.` : r >= -1 ? `Eyes open to voice. Calmer. Watches you.` : `Sedated, eyes closed, still. Head of bed ${P.hob} degrees.`; },
      resp: (s, P) => { P.k.resp = s.t; return P.plugOn ? `Breath sounds faint on both sides, equal. No wheeze. Peak pressure ${tuPeak(P)}; the ventilator is dropping breaths at the pressure limit.` : `Coarse crackles both sides. Tube secured at 23 cm at the teeth. ${P.hob < 30 ? 'Head of bed ' + P.hob + ' degrees: flat.' : 'Head of bed 35 degrees.'} Thick tan secretions in the in-line catheter.`; },
      cardiac: (s, P, A) => { const v = A.vitals('712'); return `HR ${v.HR}, sinus. BP ${v.SBP}/${v.DBP} on the arterial line. Warm, pulses 2+.`; },
      neuro: (s, P) => { const r = tuRASS(s, P); P.k.neuro = s.t; return r <= -3 ? `RASS -3: moves to voice, no eye contact. Pupils equal and reactive. Below his goal of 0 to -1.` : r >= 1 ? `RASS +${r}: restless, pulling at the tube, not following commands. Can't hold attention.` : `RASS ${r}: opens eyes to voice, follows simple commands some of the time.`; },
      pain: (s, P) => { const r = tuRASS(s, P); return r >= 0 ? `CPOT 4: grimacing, fighting the ventilator, tense arms. He's in pain.` : `CPOT 1: relaxed face, tolerating the ventilator.`; },
      skin: (s, P) => `Sacrum intact. Both heels red, blanching. ${P.turnAt > s.t - 120 ? 'Heels floated.' : 'Heels on the mattress.'} Lips dry, tube tape intact.`,
      gi: () => `Abdomen soft. Feeds at goal, residuals small. Foley draining clear yellow urine.`,
    },
    interventions: [
      { id: 'hob', label: 'Raise the head of the bed to 30 to 45 degrees', cost: 1, avail: (s, P) => P.hob < 30 && !P.arrest,
        run(s, P, A) { P.hob = 35; A.judge('712-hob', 'safety', 1, `You raised Mr. Pham's head of bed.`, `Flat in bed with a breathing tube, stomach contents and mouth bacteria run down into the lungs. Head of bed 30 to 45 degrees is part of every VAP bundle.`, '712'); return `Head of bed 35 degrees. Tube and lines checked as you raised it.`; } },
      { id: 'screen', label: 'SAT and SBT safety screen', cost: 2, avail: (s, P) => !P.screened && !P.arrest,
        run(s, P, A) { P.screened = true; A.judge('712-screen', 'assess', 2, `You did Mr. Pham's SAT and SBT safety screens.`, `Screen first. The SAT screen looks for seizures, withdrawal, paralytics, active ischemia and high ICP; the SBT screen asks if the lungs are ready: FiO₂ 0.5 or less, PEEP 8 or less, stable.`, '712'); return `SAT screen: no seizures, no withdrawal, no paralytic, no active ischemia, no raised ICP. Passes. SBT screen: FiO₂ 0.6 (needs 0.5 or less), PEEP 12 (needs 8 or less), SpO₂ 91%. Fails. Plan: SAT today, no SBT.`; } },
      { id: 'sat', label: 'Sedation awakening trial: pause the propofol and fentanyl', cost: 2, avail: (s, P) => !P.sedOff && !P.arrest && !P.selfExt,
        run(s, P, A) { P.sedOff = true; P.satAt = s.t; P.fentOn = false; A.judge('712-sat', 'judgment', P.screened || P.sbtPlan === 'sat' ? 2 : 1, `You paused Mr. Pham's sedation for his SAT${P.screened ? ' after screening him' : ''}.`, `Daily sedation interruption shortens ventilator days and ICU stays. ${P.screened ? '' : 'Screen first next time: it takes two minutes.'} Stay close: when he wakes, he'll find the tube.`, '712'); return `Propofol and fentanyl paused at ${clock(s.t)}. You stay at the bedside. He'll lighten over the next 10 to 15 minutes.`; } },
      { id: 'sbt', label: 'Spontaneous breathing trial: pressure support 5, PEEP 5', cost: 2, avail: (s, P) => !P.sbtTried && !P.arrest && !P.selfExt,
        run(s, P, A) { P.sbtTried = true; P.sbtOn = true; P.sbtAt = s.t; A.judge('712-sbt', 'safety', -2, `You started an SBT on Mr. Pham with FiO₂ 0.6 and PEEP 12.`, `He fails the SBT safety screen. Dropping PEEP from 12 to 5 lets his stiff alveoli collapse; his saturation will fall and it can take hours to recruit them again.`, '712'); return `Pressure support 5, PEEP 5. Within three minutes: RR 38, SpO₂ 83%. Jonah puts him back on his settings. SpO₂ crawls back to 89% over ten minutes.`; } },
      { id: 'cam', label: 'Assess pain (CPOT) and delirium (CAM-ICU)', cost: 3, avail: (s, P) => P.sedOff && !P.cpot && tuRASS(s, P) >= -2 && !P.arrest,
        run(s, P, A) { P.cpot = true; A.judge('712-cam', 'assess', 2, `You screened Mr. Pham for pain and delirium when he was light enough to test.`, `CAM-ICU can only be done at RASS -3 or lighter. Pain first: an agitated patient on a ventilator is often a patient in pain.`, '712'); return `CPOT 4: grimacing, fighting the vent, tense arms. CAM-ICU positive: an acute change from baseline, inattention (squeezes on the wrong letters in SAVEAHAART), and disorganized thinking. Delirium, and pain.`; } },
      { id: 'reorient', label: 'Reorient him: your name, where he is, the tube; hold his hand; ask Michael to talk to him', cost: 3, avail: (s, P) => P.sedOff && !P.alts && tuRASS(s, P) >= 0 && !P.arrest && !P.selfExt,
        run(s, P, A) { P.alts = true; P.micHelped = true; A.judge('712-alts', 'safety', 2, `You tried reorientation and family before anything restrictive.`, `Least restrictive first: explain, reorient, touch, a familiar voice, glasses and hearing aids, light. It often helps. With delirium, it may not be enough on its own.`, '712'); return `"Tuan, I'm your nurse. You're in the hospital. A tube is helping you breathe; don't pull it." Michael holds his other hand and talks about the band. He settles a little, then his hand drifts back toward his mouth when he coughs.`; } },
      { id: 'restrain', label: 'Apply soft wrist restraints', cost: 3, avail: (s, P) => P.sedOff && !P.restrained && tuRASS(s, P) >= 0 && !P.arrest && !P.selfExt && !P.released,
        run(s, P, A) { P.restrained = true; P.rAt = s.t; P.rAgit = tuRASS(s, P) >= 1;
          if (!P.alts) A.judge('712-restrain', 'safety', -2, `You restrained Mr. Pham before trying anything less restrictive.`, `Restraint is the last resort, after reorientation, family, treating pain, and adjusting sedation. CMS requires that less restrictive measures were tried or judged ineffective.`, '712');
          else if (!P.rOrder) A.judge('712-restrain', 'safety', -1, `You restrained Mr. Pham without an order.`, `In an emergency you can apply them, but the order is needed right away, and a nurse can't start restraints on a standing or PRN order.`, '712');
          else A.judge('712-restrain', 'safety', 1, `You used soft wrist restraints as a last resort, with an order.`, `He's delirious and reaching for a life-sustaining tube despite alternatives: short-term, least restrictive restraint with an order, monitoring, and release the moment it's safe.`, '712');
          return `Soft wrist restraints, tied to the bed frame with quick-release knots, two fingers' room at each wrist. He can bend his elbows but can't reach his face.`; } },
      { id: 'rcheck', label: 'Restraint check: circulation, skin, range of motion, position, needs', cost: 2, avail: (s, P) => P.restrained,
        run(s, P) { P.rChecks.push(s.t); return `Hands warm and pink, refill under 2 seconds, skin intact under the cuffs. Each arm released and moved through its range one at a time. Repositioned. RASS ${tuRASS(s, P)}.`; } },
      { id: 'release', label: 'Remove the restraints', cost: 1, avail: (s, P) => P.restrained,
        run(s, P, A) { P.restrained = false; P.released = s.t; if (tuRASS(s, P) <= 0) A.judge('712-release', 'safety', 1, `You removed Mr. Pham's restraints as soon as he was calm.`, `Restraints end when the reason ends, not when the order runs out.`, '712'); else A.judge('712-release', 'safety', -1, `You removed the restraints while he was still pulling at his tube.`, `Release when the risk has passed. Right now he can still reach the tube.`, '712'); return `Restraints off. Hands on the blanket. ${tuRASS(s, P) <= 0 ? 'He lies still and watches you.' : 'His hand goes straight to his mouth.'}`; } },
      { id: 'rnote', label: 'Chart the restraint note', cost: 5, avail: (s, P) => P.rAt !== null && !P.rNote,
        form(s, P) {
          return { title: 'Restraint note (non-violent)', intro: 'Every box you check is a claim in his record. Chart what you saw and did. If it didn\'t happen, leave it out.',
            sections: [
              { id: 'why', q: 'Why restraint was needed', hint: 'Specific and observed.', opts: [{ id: 'tube', label: 'Reaching for and pulling at his endotracheal tube during the SAT' }, { id: 'agitated', label: 'Agitated' }, { id: 'staff', label: 'No one was free to stay with him' }, { id: 'prevent', label: 'In case he pulls the tube later' }] },
              { id: 'tried', q: 'Less restrictive measures tried first', opts: [{ id: 'reorient', label: 'Reoriented him and explained the tube' }, { id: 'family', label: 'Michael at the bedside talking to him' }, { id: 'pain', label: 'Pain assessed (CPOT) and analgesia restarted' }, { id: 'sed', label: 'Sedation plan reviewed with the provider' }, { id: 'none', label: 'None: there wasn\'t time' }] },
              { id: 'mon', q: 'Order and monitoring', opts: [{ id: 'order', label: 'Provider order for soft wrist restraints' }, { id: 'checks', label: 'Circulation, skin and range of motion checked' }, { id: 'told', label: 'Michael told why, and what it will take to remove them' }, { id: 'nonem', label: 'None of these yet' }] },
              { id: 'rel', q: 'When they come off', one: true, opts: [{ id: 'calm', label: 'When he is calm (RASS 0 to -1) and no longer reaching for the tube, or is extubated' }, { id: 'shift', label: 'At the end of the shift' }, { id: 'expire', label: 'When the order expires' }, { id: 'sleep', label: 'When he falls asleep' }] },
            ] };
        },
        sign(s, P, A, a) {
          P.rNote = true;
          const truth = { tube: P.rAgit, agitated: P.rAgit, staff: false, prevent: false, reorient: P.alts, family: P.micHelped, pain: P.cpot && P.fentOn, sed: P.agitCalled, none: false, order: P.rOrder, checks: P.rChecks.length > 0, told: P.toldMic, nonem: false };
          truth.none = !(P.alts || P.micHelped || (P.cpot && P.fentOn) || P.agitCalled); truth.nonem = !(truth.order || truth.checks || truth.told);
          const L = { tube: 'that he was pulling at the tube', staff: 'that no one could stay', prevent: 'a preventive reason', reorient: 'reorientation', family: 'Michael\'s help', pain: 'pain assessed and treated', sed: 'a sedation plan with the provider', none: 'that nothing could be tried', order: 'an order', checks: 'restraint checks', told: 'that Michael was told', nonem: 'that none of it was done' };
          const lies = [];
          ['tried', 'mon'].forEach((k) => (a[k] || []).forEach((id) => { if (!truth[id]) lies.push(L[id]); }));
          const why = a.why || [];
          if (why.includes('staff')) A.judge('712-note-why', 'judgment', -2, `Your note gives staffing as the reason for restraint.`, `Restraint for staff convenience is never allowed. The reason has to be the patient's behavior and the danger to him.`, '712');
          else if (why.includes('tube') && P.rAgit) A.judge('712-note-why', 'comm', 1, `Your note names the behavior: pulling at his tube.`, `Specific and observed. "Agitated" alone doesn't show why a life-sustaining device was at risk.`, '712');
          else if (why.includes('prevent')) A.judge('712-note-why', 'judgment', -1, `Your note justifies restraint as prevention.`, `Restraint answers a present risk, not a possible one later.`, '712');
          else A.judge('712-note-why', 'comm', 0, `Your note says "agitated" without the behavior.`, `A label isn't a reason. Chart what he did.`, '712');
          const r = (a.rel || [])[0];
          if (r === 'calm') A.judge('712-note-release', 'safety', 1, `Your note sets release by his behavior.`, `Off as soon as he's calm and not reaching for the tube.`, '712');
          else A.judge('712-note-release', 'safety', -1, `Your note ties release to ${r === 'shift' ? 'the shift' : r === 'expire' ? 'the order' : 'sleep'}, not to his behavior.`, `Restraints come off when the risk ends, whatever the clock or the order says. Asleep and sedated is not the same as safe without them.`, '712');
          if (lies.length) A.judge('712-note-true', 'judgment', -2, `Your note claims things that didn't happen: ${[...new Set(lies)].join('; ')}.`, `A restraint record is a legal document. Charting care that wasn't given is falsification.`, '712');
          else A.judge('712-note-true', 'judgment', 1, `Everything in your restraint note happened.`, `Specific, complete and true: it will stand on its own if anyone reviews it.`, '712');
          const f = this.form(s, P), pick = (k, i) => f.sections[i].opts.filter((o) => (a[k] || []).includes(o.id)).map((o) => o.label).join('; ');
          return `Soft wrist restraints applied ${clock(P.rAt)}${P.released ? `, removed ${clock(P.released)}` : ''}. Reason: ${pick('why', 0)}. Tried first: ${pick('tried', 1)}. ${pick('mon', 2)}. Release: ${pick('rel', 3)}.`;
        } },
      { id: 'oral', label: 'Oral care: brush his teeth, swab, suction the mouth and subglottic port', cost: 4, avail: (s, P) => !P.oral && !P.plugOn && !P.arrest,
        run(s, P, A) { P.oral = true; A.judge('712-oral', 'safety', 1, `You did Mr. Pham's oral care.`, `Plaque on the teeth seeds the lungs. Toothbrushing and subglottic suction are part of preventing ventilator-associated pneumonia.`, '712'); return `Teeth brushed, mouth swabbed and suctioned, 10 mL of thick secretions from the subglottic port. Lips moisturized. Tube position unchanged at 23 cm.`; } },
      { id: 'turn', label: 'Turn him with Jonah at the head of the bed; float his heels', cost: 4, avail: (s, P) => s.t - P.turnAt >= 90 && !P.plugOn && !P.arrest,
        run(s, P, A) { P.turnAt = s.t; A.judge('712-turn', 'safety', 1, `You turned Mr. Pham with RT protecting the tube.`, `Turning every 2 hours prevents pressure injuries and helps secretions move. With a breathing tube and PEEP 12, someone holds the tube and watches the vent while you turn.`, '712'); return `Turned to his left side, 30 degrees, Jonah holding the tube. Heels floated on a pillow. SpO₂ dips to 88% and recovers in a minute.`; } },
      { id: 'bag', label: 'Disconnect from the ventilator and bag him with 100% oxygen', cost: 1, avail: (s, P) => P.plugOn && !P.bagged,
        run(s, P, A) { P.bagged = true; A.judge('712-bag', 'safety', 2, `You took Mr. Pham off the ventilator and bagged him with 100% oxygen.`, `When a ventilated patient desaturates and you don't know why, take the machine out of the picture. If bagging is easy, look at the ventilator; if it's hard, the problem is in the patient or the tube.`, '712'); return `Bag-valve with 100% oxygen and the PEEP valve on. The bag is stiff; it takes real effort to squeeze, and his chest barely rises. SpO₂ creeps to ${tuSpO2(P)}%. The problem is in the tube or the patient, not the machine.`; } },
      { id: 'tubepos', label: 'Check the tube: the mark at the teeth, breath sounds on both sides', cost: 1, avail: (s, P) => P.plugOn && !P.tubeChecked,
        run(s, P, A) { P.tubeChecked = true; A.judge('712-dope', 'assess', 1, `You checked Mr. Pham's tube position and breath sounds.`, `DOPE: Displacement (the cm mark), Obstruction, Pneumothorax (unequal sounds, a shifted trachea, falling pressure), Equipment. Rule them out in order.`, '712'); return `23 cm at the teeth, same as charted. Breath sounds faint but equal on both sides; trachea midline; BP holding. Not displaced, no sign of a pneumothorax. Obstruction is next.`; } },
      { id: 'suction', label: 'Pass a suction catheter down the tube', cost: 2, avail: (s, P) => !P.arrest && !P.selfExt,
        run(s, P, A) {
          if (!P.plugOn) { P.k.sx = s.t; return `In-line suction: a moderate amount of thick tan secretions. SpO₂ ${tuSpO2(P)}%.`; }
          P.plugOn = false; P.cleared = s.t; P.plug = 0;
          A.judge('712-suction', 'safety', 2, `You passed a suction catheter and cleared Mr. Pham's mucus plug.`, `High peak pressure, a stiff bag, equal breath sounds and a tube in the right place point to obstruction. A catheter that meets resistance and pulls back a plug is the fix.`, '712');
          return `The catheter stops at about 25 cm. You pull back a thick, rubbery tan plug the length of your finger. The bag suddenly gives. Back on the ventilator: peak 31, SpO₂ 90%, then 93%.`; } },
      { id: 'postplug', label: 'Recheck him after clearing the plug: SpO₂, peak pressure, breath sounds', cost: 2, avail: (s, P) => P.cleared !== null && !P.postPlug && s.t - P.cleared >= 5,
        run(s, P, A) { P.postPlug = true; A.judge('712-postplug', 'judgment', 1, `You rechecked Mr. Pham after clearing the plug.`, `Did it work, and will it happen again? Back to baseline, then ask RT about humidification and how often he needs suctioning.`, '712'); return `SpO₂ 93% on FiO₂ 60%. Peak 31, plateau 28. Coarse crackles both sides, air entry better. Jonah adds a heated humidifier check and more frequent suction.`; } },
    ],
    meds: [
      { id: '712-prop', name: 'Propofol infusion', dose: '5 to 50 mcg/kg/min', route: 'IV', freq: 'Continuous, RASS goal 0 to -1', prn: true, infusion: true,
        block: (s, P) => (P.arrest ? 'Code in progress.' : null),
        checks: (s, P) => [{ label: 'RASS', value: `${tuRASS(s, P)} (goal 0 to -1)`, ok: tuRASS(s, P) <= 0 && tuRASS(s, P) >= -1 }, { label: 'Running', value: P.sedOff ? (P.resedated ? 'Restarted' : 'Paused for SAT since ' + clock(P.satAt)) : (P.resedated ? 'Restarted' : '30 mcg/kg/min'), ok: null }, { label: 'Ventilator', value: P.plugOn ? `High-pressure alarm, SpO₂ ${tuSpO2(P)}%` : 'No alarms', ok: !P.plugOn }, { label: 'Triglycerides', value: '210', ok: null }],
        doses: [{ id: 1, label: 'Set at 15 mcg/kg/min: half the previous rate, goal RASS 0 to -1' }, { id: 2, label: 'Set at 30 mcg/kg/min: the previous rate' }, { id: 3, label: 'Increase to 50 mcg/kg/min and give a 20 mg bolus' }, { id: 4, label: 'No change' }],
        give(s, P, A, dose) {
          if (dose === 3) { if (P.plugOn) { P.silenced = true; A.judge('712-sedate-alarm', 'safety', -3, `You sedated Mr. Pham through a high-pressure alarm without finding the cause.`, `A high-pressure alarm with falling saturation is an obstruction until proven otherwise. Sedation quiets the alarm's cause only if the cause is fighting the vent; a plug stays.`, '712'); } else A.judge('712-oversed', 'meds', -2, `You increased and bolused Mr. Pham's propofol.`, `His goal is RASS 0 to -1. Deep sedation means more delirium, more ventilator days, and a lower blood pressure.`, '712'); P.resedated = true; P.sedOff = false; return `Propofol 20 mg bolus, rate 50. He goes still. RASS -4.`; }
          if (dose === 4) return `No change.`;
          if (!P.sedOff) { P.resedated = true; A.judge('712-lighten', 'meds', dose === 1 ? 1 : 0, `You ${dose === 1 ? 'lightened' : 'left'} Mr. Pham's propofol without a SAT.`, `Over-sedated at RASS -3, but the daily SAT is the protocol way to find his lightest safe level.`, '712'); return `Propofol at ${dose === 1 ? 15 : 30}.`; }
          P.resedated = true; P.sedOff = true;
          if (dose === 1) A.judge('712-resed', 'meds', 2, `You restarted Mr. Pham's propofol at half the previous rate.`, `A failed SAT restarts at half the dose and titrates to the goal. Starting back at the old rate is how patients end up at RASS -4 again.`, '712');
          else A.judge('712-resed', 'meds', 0, `You restarted Mr. Pham's propofol at the previous rate.`, `The protocol restarts at half the previous dose after a failed SAT, then titrates up only if needed.`, '712');
          return `Propofol ${dose === 1 ? 15 : 30} mcg/kg/min. Over the next few minutes his hands settle. RASS -1: eyes open to voice, still.`; } },
      { id: '712-fent', name: 'Fentanyl infusion', dose: '25 to 200 mcg/h', route: 'IV', freq: 'Continuous; analgesia first', prn: true, infusion: true,
        block: (s, P) => (P.arrest ? 'Code in progress.' : P.fentOn ? 'Running at ' + (P.fentRate || 50) + ' mcg/h.' : null),
        checks: (s, P) => [{ label: 'CPOT', value: P.cpot ? '4 (pain)' : 'Not assessed', ok: P.cpot ? false : null }, { label: 'RASS', value: `${tuRASS(s, P)}`, ok: null }],
        doses: [{ id: 1, label: 'Restart at 25 mcg/h (half), for a CPOT of 3 or more' }, { id: 2, label: 'Restart at 50 mcg/h' }],
        give(s, P, A, dose) { P.fentOn = true; P.fentRate = dose === 1 ? 25 : 50; A.judge('712-fent', 'meds', P.cpot ? (dose === 1 ? 2 : 1) : 0, `You restarted Mr. Pham's fentanyl${P.cpot ? ' for a CPOT of 4' : ' without a pain score'}.`, `Analgesia first: treating pain often settles a ventilated patient with less sedative. ${dose === 1 ? 'Half the old rate, then titrate.' : 'After a SAT, half the previous rate is the usual restart.'}`, '712'); return `Fentanyl ${P.fentRate} mcg/h.`; } },
      { id: '712-osel', name: 'Oseltamivir', dose: '75 mg', route: 'per tube', freq: 'Twice daily', due: 120, checks: () => [{ label: 'Influenza A', value: 'Positive', ok: true }, { label: 'Creatinine', value: '0.9', ok: true }], give: () => `Oseltamivir 75 mg per orogastric tube, flushed with 30 mL water.`, hold(s, P, A) { A.judge('712-osel-hold', 'meds', -1, `You held Mr. Pham's oseltamivir.`, `Antiviral treatment continues in severe influenza.`, '712'); return 'Held.'; } },
      { id: '712-panto', name: 'Pantoprazole', dose: '40 mg', route: 'IV', freq: 'Daily', due: 120, checks: () => [{ label: 'Indication', value: 'Stress ulcer prophylaxis: mechanical ventilation over 48 h', ok: true }], give: () => `Pantoprazole 40 mg IV push over 2 minutes.`, hold(s, P, A) { A.judge('712-panto-hold', 'meds', -1, `You held Mr. Pham's stress ulcer prophylaxis.`, `Ventilated over 48 hours is a bleeding risk; it's part of his bundle.`, '712'); return 'Held.'; } },
      { id: '712-hep', name: 'Heparin', dose: '5,000 units', route: 'SC', freq: 'Every 8 hours', due: 60, checks: () => [{ label: 'Platelets', value: '210', ok: true }, { label: 'Bleeding', value: 'None', ok: true }], give: () => `Heparin 5,000 units SC, abdomen.`, hold(s, P, A) { A.judge('712-hep-hold', 'meds', -1, `You held Mr. Pham's DVT prophylaxis.`, `Immobile and ventilated: clot prevention is part of his bundle.`, '712'); return 'Held.'; } },
    ],
    talk: (s, P) => (P.arrest || P.selfExt ? null : tuRASS(s, P) >= 1 ? 'tu_agit' : 'tu_talk'),
    family: { name: 'Michael', rel: 'Partner', mode: 'bedside', cost: 3, avail: (s, P) => !P.arrest, dialog: (s, P) => (!P.k.mic ? 'mic_talk' : P.sedOff && P.cpot && !P.k.micDel ? 'mic_del' : P.restrained && !P.toldMic ? 'mic_rest' : 'mic_after') },
    sbar: {
      items(s, P, A) {
        return [
          { id: 'abg', label: 'ABG pH 7.30, PaCO₂ 52, HCO₃ 25 on Vt 400 (6 mL/kg)', key: false, need: true },
          { id: 'sat', label: P.sedOff ? `SAT since ${clock(P.satAt)}: RASS ${tuRASS(s, P)}` : 'SAT not started', key: P.sedOff, need: true },
          { id: 'cam', label: 'CAM-ICU positive, CPOT 4', key: true, need: P.cpot, lock: 'Assess pain and delirium' },
          { id: 'tube', label: 'Reaching for his tube despite reorienting and Michael at the bedside', key: true, need: P.alts && tuRASS(s, P) >= 0, lock: 'Not seen' },
          { id: 'sbt', label: 'Fails the SBT screen: FiO₂ 0.6, PEEP 12', key: false, need: P.screened, lock: 'Do the safety screen' },
          { id: 'plug', label: P.cleared !== null ? `Mucus plug at ${clock(P.plugAt)}, cleared with suction` : P.plugOn ? `High-pressure alarm, SpO₂ ${tuSpO2(P)}%` : 'No alarms', key: P.plugOn || P.cleared !== null, need: true },
          { id: 'band', label: 'Band director; plays trumpet', key: false, need: true },
        ];
      },
      requests: [
        { id: 'agit', label: 'He\'s CAM-positive with a CPOT of 4 and reaching for his tube despite reorienting him. Can we restart fentanyl, restart propofol at half dose, and get an order for soft wrist restraints as a last resort?' },
        { id: 'plug', label: 'He had a mucus plug with a high-pressure alarm and desaturation. I bagged him and suctioned it out; he\'s back to baseline. Can we add humidification and look at a chest x-ray?' },
        { id: 'sed', label: 'He\'s waking up and agitated. Can I put the propofol back to 30 and bolus him?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'sed') { A.judge('712-sbar-sed', 'judgment', -1, `You asked to deepen Mr. Pham's sedation without treating pain or delirium.`, `Pain and delirium first. Back to the old dose undoes the SAT.`, '712'); return `What's his CPOT? Treat pain first. Restart at half, goal RASS 0 to -1.`; }
        if (req === 'agit') {
          if (!picked.includes('cam')) return `Have you done a CPOT and CAM? Tell me what you've tried.`;
          P.agitCalled = true;
          if (!P.rOrder) { P.rOrder = true; A.addOrder('712', `Fentanyl restart 25 mcg/h for CPOT 3 or more. Propofol restart 15 mcg/kg/min, titrate to RASS 0 to -1. Soft bilateral wrist restraints, non-violent, to protect the endotracheal tube; reassess the need at each check; discontinue as soon as safe. CAM-ICU every shift. Delirium bundle: sleep, glasses, family, early mobility.`); }
          A.judge('712-sbar-agit', 'comm', picked.includes('tube') ? 2 : 1, `You called about Mr. Pham's delirium and agitation during the SAT.`, `Bring the scores (RASS, CPOT, CAM) and what you've tried. The order you need is for pain, for sedation, and, only if still necessary, restraint.`, '712');
          return `Good work-up. Fentanyl back at 25, propofol at 15, RASS 0 to -1. Restraint order is in for now; take them off as soon as he's settled. No SBT today, not on 60 and 12.`;
        }
        if (req === 'plug') { if (P.cleared === null) return `Plug? What happened?`; A.judge('712-sbar-plug', 'comm', 1, `You told the intensivist about Mr. Pham's mucus plug.`, `A plug that nearly took his airway is a change in condition. The team needs it for the plan: humidity, suction frequency, an x-ray for collapse.`, '712'); return `Good save. Portable chest x-ray, heated humidifier, suction every two hours and as needed. Call if it happens again.`; }
        A.judge('712-sbar-fyi', 'comm', 0, `You called with an update on Mr. Pham.`, `Lead with what's changed or what you need.`, '712');
        return `Thanks. SAT today; no SBT on those settings.`;
      },
    },
    scene: (s, P) => ({ tele: true, iv: 'running', vent: true, foley: true, family: P.arrest ? null : 'michael', familyLabel: 'Michael, his partner, in scrubs from his own shift' }),
    clues: (s, P) => ({ vent: P.plugOn ? `Alarm: HIGH PRESSURE. Peak ${tuPeak(P)}. The pressure waveform spikes and cuts off each breath early. Exhaled volume 240 mL of the 400 set.` : `Volume control 400 mL, rate 26, PEEP 12, FiO₂ 60%. Peak 32, plateau 28. No alarms.`, family: `Michael, in scrubs from his own night shift, a photo of a marching band propped on the windowsill. He watches the ventilator screen more than the TV.`, iv: `Propofol ${P.sedOff && !P.resedated ? 'paused' : P.resedated ? '15' : '30'} mcg/kg/min, fentanyl ${P.fentOn ? (P.fentRate || 50) : 'paused'}, on the central line.`, monitor: `SpO₂ ${tuSpO2(P)}%.`, foley: `Clear yellow urine.` }),
    rig: (s, P) => { const r = tuRASS(s, P); return { alert: r <= -3 || P.arrest ? 2 : r <= -1 ? 1 : 0, anxious: r >= 1 ? .7 : 0, spo2: tuSpO2(P), rr: r >= 1 ? 34 : 26 }; },
    status: (s, P) => (P.plugOn || P.sbtOn || tuRASS(s, P) >= 1 ? 'urgent' : 'watch'),
    outcome(s, P) {
      if (P.arrest) return { tone: 'bad', title: 'Hypoxic arrest from a mucus plug', text: `The high-pressure alarm ran at ${clock(P.plugAt)} with his saturation falling${P.silenced ? ', and he was sedated instead of suctioned' : ''}. PEA arrest, ROSC after 4 minutes when RT pulled the plug. Too early to know what the minutes without oxygen cost him.` };
      if (P.selfExt) return { tone: 'bad', title: 'Pulled out his own tube', text: `Delirious and lightened, he pulled his tube at ${clock(P.selfExtAt)}. Reintubated by anesthesia with his saturation at 70%. ${[!P.alts && 'Nobody reoriented him or brought Michael in', !(P.fentOn && P.cpot) && 'his pain was never assessed and treated', !P.resedated && 'sedation was never restarted at a lower dose'].filter(Boolean).join('; ').replace(/^./, (c) => c.toUpperCase()) || 'Even with reorientation and analgesia, delirium needed light sedation too'}.` };
      const fine = P.cleared !== null && P.sedOff && !P.sbtTried && P.hob >= 30 && (P.resedated || !P.sedOff);
      const misses = [P.sbtTried && 'an SBT on FiO₂ 0.6 and PEEP 12', P.hob < 30 && 'head of bed left flat', !P.sedOff && 'no SAT', P.sedOff && !P.resedated && tuRASS(s, P) >= 1 && 'agitation never settled', P.restrained && tuRASS(s, P) <= 0 && 'restraints left on after he was calm', P.restrained && !P.rOrder && 'restraints without an order'].filter(Boolean);
      if (fine && !misses.length) return { tone: 'good', title: 'Plug cleared, SAT done, settled', text: `You bagged, checked the tube and suctioned out a plug at ${clock(P.cleared)}. SAT without an unsafe SBT; delirium found and treated${P.rAt !== null ? `; restraints ${P.released ? 'off at ' + clock(P.released) : 'still on'}` : ''}. RASS -1 at noon.` };
      return { tone: 'mixed', title: P.cleared !== null ? 'Plug cleared, bundle gaps' : 'No crisis, bundle gaps', text: `${misses.length ? 'Missed: ' + misses.join('; ') + '.' : ''} ${P.cleared !== null ? 'The plug was cleared at ' + clock(P.cleared) + '.' : ''}` };
    },
  };

  /* ---------- 713 Beatrice Holloway: POD 1 CABG; clotted chest tubes and tamponade ---------- */
  const beHR = (P) => Math.round(84 + P.tamp * 40 + (P.af ? 40 : 0));
  const beSBP = (P) => Math.round(116 - P.tamp * 38 - (P.metoGiven ? 6 : 0));
  const beDBP = (P) => Math.round(64 - P.tamp * 10);
  const beCVP = (P) => Math.round(9 + P.tamp * 10);
  const beCT = (s, P) => (P.reexp ? 40 : s.t >= 75 && !P.reexp ? 5 : Math.round(90 - s.t * .25));
  const bea = {
    id: '713', room: '713', name: 'Beatrice Holloway', short: 'Mrs. Holloway', age: 70, sex: 'F', mrn: '00699217', provider: 'hale',
    look: { skin: '#F0D2BC', shade: '#D4AE96', lip: '#B4675F', blush: '#EA998A', iris: '#5C7A6A', head: { w: 55, h: 60, jaw: .2 }, eye: 9.2,
      hair: { style: 'curls', color: '#DCD6CF' }, brow: { w: 2.8, color: '#BDB4AC' }, body: { w: 78, cloth: 'gown' }, extras: ['cannula', 'pearls', 'wrinkles'], smile: .4,
      lines: { calm: `Morning, dear. They tell me I've got three new pipes.`, pain: `It hurts to take a deep breath. Like a seatbelt across my chest.`, anxious: `I feel heavy. Like something's sitting on me. I can't get comfortable.`, drowsy: `I'm so tired.`, dizzy: `The room's swimming.`, none: `(She doesn't answer.)` } },
    bio: `Retired children's librarian. Ran story time at the Elmhurst branch for 30 years. Widowed; her daughter Carol lives 20 minutes away.`,
    dx: `Day 1 after CABG ×3`, reason: `Three-vessel coronary disease. CABG ×3 yesterday (LIMA to LAD, vein grafts to the obtuse marginal and the right coronary). Extubated at 22:00.`,
    hx: [`Coronary artery disease, angina for 6 months`, `Type 2 diabetes (metformin at home)`, `Hypertension`],
    allergies: `Sulfa (rash)`, code: `Full code`, weight: `66 kg`,
    lines: [`Two mediastinal chest tubes to -20 cm water suction`, `Epicardial pacing wires (atrial and ventricular), capped; pacer box at the bedside`, `Right IJ introducer: CVP`, `Left radial arterial line`, `Foley catheter`],
    mobility: `Up to the chair today with help; sternal precautions`, diet: `Clear liquids, advance as tolerated`,
    init: { tamp: 0, ctSeen: null, called: null, prep: false, cleared: false, stripped: false, reexp: false, reexpAt: null, arrest: false, gone: false, reassessed: false, kGiven: null, mgGiven: null, af: false, glu: 196, ins: 2, lastBg: null, bgs: [], insOk: 0, insBad: 0, is: false, chair: false, wires: false, metoGiven: false, lasixGiven: false, albGiven: false, heavyAsked: false, pullAsked: false },
    nightVitals: { T: 37.2, HR: 84, SBP: 118, DBP: 66, RR: 18, SpO2: 95, O2: '2 L nasal cannula', pain: 4 },
    labs: [
      { name: 'Potassium', val: 3.4, unit: 'mmol/L', ref: '3.5–5.0 (goal 4.0 or more after heart surgery)', flag: 'L', t: -120 },
      { name: 'Magnesium', val: 1.7, unit: 'mg/dL', ref: '1.7–2.2 (goal 2.0 or more after heart surgery)', flag: 'L', t: -120 },
      { name: 'Hemoglobin', val: 9.4, unit: 'g/dL', ref: '12.0–15.5', flag: 'L', t: -120 },
      { name: 'Platelets', val: 142, unit: 'K/µL', ref: '150–400', flag: 'L', t: -120 },
      { name: 'Glucose (fingerstick)', val: 196, unit: 'mg/dL', ref: 'goal 140–180 on the insulin infusion', flag: 'H', t: -60 },
    ],
    orders: [
      { t: -960, text: `Chest tubes to -20 cm suction. Record output hourly. Notify for over 100 mL/h for 2 hours, over 200 mL in any hour, or a sudden stop in drainage. Gentle clot clearance of the tubing per unit protocol only; no stripping.` },
      { t: -960, text: `Electrolyte protocol (post-cardiac surgery, nurse-initiated): K under 4.0, give potassium chloride 20 mEq IV over 1 hour via central line (repeat once if under 3.5). Mg under 2.0, give magnesium sulfate 2 g IV over 1 hour.` },
      { t: -960, text: `Insulin infusion protocol, glucose goal 140 to 180, fingerstick hourly. Over 180: increase 1 unit/h. 141 to 180: no change. 110 to 140: decrease 1 unit/h. Under 110: stop and recheck in 30 minutes. Under 70: stop, dextrose 50% 25 mL IV, notify.` },
      { t: -960, text: `Aspirin 81 mg daily. Metoprolol tartrate 12.5 mg PO twice daily (hold for HR under 60 or SBP under 100). Furosemide 20 mg IV twice daily (hold for SBP under 100). Albumin 5% 250 mL IV for SBP under 90 with CVP under 8. Acetaminophen 1 g every 6 hours as needed. Incentive spirometer 10 times an hour while awake. Up to the chair today. Sternal precautions.` },
      { t: -960, text: `Epicardial pacing wires: pacer box at the bedside, settings posted. Insulate exposed wires; gloves when handling.` },
    ],
    notes: [
      { t: -45, author: 'Bree, night RN', text: `Chest tubes 120, 110, 100, 90 mL/h overnight, serosanguineous, trending down. Extubated 22:00, IS 750. Insulin at 2 units/h, glucose 196 at 06:00. K 3.4 and Mg 1.7 after furosemide; didn't get to the protocol. Wires capped, pacer off, underlying sinus 80s.` },
    ],
    io: { intake: `Overnight 1,100 mL`, output: `Urine 1,450 mL overnight after furosemide. Chest tubes 420 mL since midnight` },
    report: [
      { text: `Beatrice Holloway, 70, day one after a triple bypass. Extubated last night. Chest tubes were putting out a hundred an hour, trending down.`, key: true },
      { text: `K 3.4 and mag 1.7 after diuresis. I didn't get to the electrolyte protocol.`, key: true },
      { text: `She's on an insulin drip at 2; last sugar was 196.`, key: true },
      { text: `Pacing wires are capped; box is off, she's in sinus.`, key: false },
      { text: `She was a children's librarian. She'll read you a story if you let her.`, key: false },
      { text: `Up to the chair today, sternal precautions.`, key: false },
    ],
    vitals(s, P) { return { T: 37.2, HR: beHR(P) + jit(s, 5), SBP: beSBP(P) + jit(s, 6), DBP: beDBP(P), RR: Math.round(18 + P.tamp * 6), SpO2: Math.round(95 - P.tamp * 3), O2: '2 L nasal cannula', pain: 4, rhythm: P.af ? 'atrial fibrillation' : beHR(P) > 100 ? 'sinus tachycardia' : '', extra: `MAP ${Math.round((beSBP(P) + 2 * beDBP(P)) / 3)}, CVP ${beCVP(P)}.` }; },
    assess: {
      general: (s, P) => (P.tamp >= .5 ? `Pale, restless, sweating. "I can't get comfortable. Something's wrong."` : P.tamp >= .2 ? `Shifting in bed, frowning. "I feel heavy."` : `Sitting up at 30 degrees, hugging a heart-shaped pillow, reading a paperback.`),
      resp: (s, P) => `RR ${Math.round(18 + P.tamp * 6)}. Diminished at the bases, clear above. ${P.is ? 'Better after the spirometer.' : 'Shallow breaths: she\'s guarding her sternum.'}`,
      cardiac: (s, P, A) => { P.k.card = s.t; const v = A.vitals('713'); return `HR ${v.HR}${P.af ? ', irregularly irregular' : ''}. BP ${v.SBP}/${v.DBP}: pulse pressure ${v.SBP - v.DBP}. CVP ${beCVP(P)}. Heart sounds ${P.tamp >= .3 ? 'muffled and distant' : 'crisp, no rub'}. Neck veins ${P.tamp >= .3 ? 'distended at 45 degrees' : 'flat at 45 degrees'}. ${P.tamp >= .4 ? 'Arterial line waveform drops more than 10 mm Hg with each breath in.' : ''} ${P.tamp >= .5 ? 'Cool hands, refill 4 seconds.' : 'Warm hands.'}`; },
      neuro: (s, P) => (P.tamp >= .7 ? `Anxious, slow to answer, oriented.` : `Alert, oriented, sharp.`),
      pain: (s, P) => `Sternal pain 4/10, worse with coughing. ${P.tamp >= .3 ? 'New: a heavy pressure in her chest, different from the incision.' : ''}`,
      skin: (s, P) => `Sternal dressing dry. Leg incision dry. Pacing wire exit sites clean. ${P.tamp >= .5 ? 'Clammy.' : 'Warm and dry.'}`,
      gi: (s, P) => `Abdomen soft. Clear liquids, a few sips. Urine ${P.tamp >= .4 ? '15 mL last hour' : '50 mL/h'}.`,
    },
    interventions: [
      { id: 'ct', label: 'Check the chest tubes: output, color, clots, patency', cost: 2, avail: (s, P) => !P.gone,
        run(s, P, A) { P.ctSeen = s.t; const out = beCT(s, P);
          if (P.tamp >= .15 && !P.reexp) { A.judge('713-ct', 'assess', 2, `You found Mrs. Holloway's chest tubes had stopped draining.`, `After heart surgery, a sudden stop in drainage isn't the bleeding stopping. It can mean the blood is staying in the chest, behind clotted tubes.`, '713'); return `Last hour: ${out} mL, down from 70 the hour before. Dark clots in both tubes near the chest, no fresh drainage moving. Suction bubbling steadily. ${P.tamp >= .3 ? 'Her heart rate is up and her CVP is ' + beCVP(P) + '.' : ''}`; }
          return `Last hour: ${out} mL, dark red thinning to serosanguineous. No clots. Suction at -20, tubing free of kinks and dependent loops.`; } },
      { id: 'is', label: 'Incentive spirometer and coughing with a pillow splint', cost: 4, avail: (s, P) => !P.is && P.tamp < .3 && !P.gone,
        run(s, P, A) { P.is = true; A.judge('713-is', 'safety', 1, `You coached Mrs. Holloway on the spirometer and splinted coughing.`, `After a sternotomy, pain makes breathing shallow, and shallow breathing collapses the lung bases. A pillow hugged to the chest makes deep breaths and coughs possible.`, '713'); return `She hugs the heart pillow and gets to 1,000 mL, then coughs twice, productively. "That's better than last night's 750."`; } },
      { id: 'chair', label: 'Up to the chair with Tomas, sternal precautions', cost: 6, avail: (s, P) => !P.chair && P.tamp < .1 && s.t < 75 && !P.gone,
        run(s, P, A) { P.chair = true; A.judge('713-chair', 'safety', 1, `You got Mrs. Holloway up to the chair on day one.`, `Early mobility after cardiac surgery prevents pneumonia, clots and deconditioning. Lines, tubes and wires managed; she stands with her legs, not her arms.`, '713'); return `Chest tubes, wires and lines gathered. She rolls to her side, hugs the pillow and pushes up with her legs while you and Tomas guide her. Twenty minutes in the chair, then back to bed.`; } },
      { id: 'wires', label: 'Check the pacing wires and the pacer box', cost: 2, avail: (s, P) => !P.wires && !P.gone,
        run(s, P, A) { P.wires = true; A.judge('713-wires', 'safety', 1, `You checked Mrs. Holloway's pacing wires and box.`, `Epicardial wires lead straight to the heart. Gloves on, exposed ends insulated, box at the bedside with a fresh battery and the settings known, in case her rhythm changes.`, '713'); return `Gloves on. Atrial and ventricular wires coiled in insulated caps, taped to the chest, dry. Pacer box off at the bedside, fresh battery, last night's thresholds taped to it.`; } },
      { id: 'bg', label: 'Fingerstick glucose', cost: 2, avail: (s, P) => !P.gone,
        run(s, P) { const v = Math.round(P.glu); P.lastBg = { t: s.t, val: v }; P.bgs.push({ t: s.t, val: v, by: 'You' }); return `Glucose ${v} mg/dL on insulin ${P.ins} units/h. Protocol: ${v > 180 ? 'over 180, increase 1 unit/h' : v > 140 ? '141 to 180, no change' : v >= 110 ? '110 to 140, decrease 1 unit/h' : 'under 110, stop and recheck in 30 minutes'}.`; } },
      { id: 'clear', label: 'Gently clear clots from the tubing per protocol (squeeze and release, no stripping)', cost: 2, avail: (s, P) => P.tamp >= .1 && !P.reexp && !P.cleared && !P.gone,
        run(s, P, A) { P.cleared = true; P.tamp = Math.max(0, P.tamp - .06); A.judge('713-clear', 'safety', P.called !== null ? 1 : 0, P.called !== null ? `You cleared clots from the tubing per protocol while the surgeon came.` : `You tried clearing Mrs. Holloway's tubing instead of calling.`, P.called !== null ? `Gentle clearance per protocol can keep a tube open. It isn't a fix for blood that's already collected around the heart.` : `Gentle clearance per protocol is reasonable, but not a substitute for the call. The clot that matters is inside her chest.`, '713'); return `You squeeze and release along the tubing near her chest. A few small clots move into the chamber; 20 mL of dark blood follows, then nothing.`; } },
      { id: 'strip', label: 'Strip the chest tubes hard with a roller', cost: 2, avail: (s, P) => P.tamp >= .1 && !P.reexp && !P.stripped && !P.gone,
        run(s, P, A) { P.stripped = true; A.judge('713-strip', 'safety', -1, `You stripped Mrs. Holloway's chest tubes.`, `Stripping generates very high negative pressure in the chest. Most units don't allow it unless the surgeon orders it; her orders say no stripping. And it doesn't replace the call.`, '713'); return `The roller drags along the tubing. She gasps. A few clots move, then nothing.`; } },
      { id: 'prep', label: 'Prepare for bedside re-exploration: open-chest cart, sterile setup, blood in the room, OR team called', cost: 4, avail: (s, P) => P.called !== null && !P.prep && !P.reexp && !P.gone,
        run(s, P, A) { P.prep = true; A.judge('713-prep', 'safety', 2, `You set up for Mrs. Holloway's bedside re-exploration.`, `When tamponade is suspected after cardiac surgery, the fix is opening the chest. The cart, sterile field, two units of blood and the OR team waiting save the minutes that matter.`, '713'); return `Sternotomy cart open, sterile drapes, suction set up, two units of red cells checked into the room, OR team on standby. Pacer box at hand.`; } },
      { id: 'reassess', label: 'Reassess after the re-exploration: HR, BP, CVP, chest tube output', cost: 3, avail: (s, P) => P.reexp && !P.reassessed && s.t - P.reexpAt >= 10,
        run(s, P, A) { P.reassessed = true; A.judge('713-reassess', 'judgment', 2, `You reassessed Mrs. Holloway after her re-exploration.`, `Did it work? Heart rate down, pressure up, pulse pressure wider, CVP lower, tubes draining again.`, '713'); return `HR ${beHR(P)}, BP ${beSBP(P)}/${beDBP(P)}, CVP ${beCVP(P)}. Pulse pressure back to ${beSBP(P) - beDBP(P)}. Chest tubes draining 40 mL/h, serosanguineous. "I can breathe again."`; } },
    ],
    meds: [
      { id: '713-kcl', name: 'Potassium chloride (protocol)', dose: '20 mEq over 1 hour', route: 'IV, central', freq: 'Per electrolyte protocol: K under 4.0', prn: true, available: (s, P) => !P.gone, block: (s, P) => (P.kGiven !== null ? 'Started at ' + clock(P.kGiven) + '.' : null),
        checks: () => [{ label: 'Potassium', value: '3.4 at 05:00', ok: true }, { label: 'Urine output', value: 'Adequate', ok: true }, { label: 'Line', value: 'Central (IJ introducer)', ok: true }],
        give(s, P, A) { P.kGiven = s.t; A.judge('713-kcl', 'meds', s.t <= 90 ? 2 : 1, `You started the electrolyte protocol for Mrs. Holloway's potassium${s.t <= 90 ? ' early' : ''}.`, `Low potassium and magnesium after heart surgery raise the risk of post-op atrial fibrillation. The protocol is yours to start.`, '713'); return `KCl 20 mEq in 100 mL over 1 hour on the pump, central line. Recheck after the second run.`; } },
      { id: '713-mag', name: 'Magnesium sulfate (protocol)', dose: '2 g over 1 hour', route: 'IV', freq: 'Per electrolyte protocol: Mg under 2.0', prn: true, available: (s, P) => !P.gone, block: (s, P) => (P.mgGiven !== null ? 'Started at ' + clock(P.mgGiven) + '.' : null),
        checks: () => [{ label: 'Magnesium', value: '1.7 at 05:00', ok: true }, { label: 'Creatinine', value: '1.0', ok: true }],
        give(s, P, A) { P.mgGiven = s.t; A.judge('713-mag', 'meds', s.t <= 90 ? 2 : 1, `You started magnesium for Mrs. Holloway.`, `Magnesium 2.0 or higher after cardiac surgery helps prevent atrial fibrillation and makes potassium easier to correct.`, '713'); return `Magnesium sulfate 2 g over 1 hour.`; } },
      { id: '713-ins', name: 'Insulin infusion (regular)', dose: 'per protocol', route: 'IV', freq: 'Continuous; glucose goal 140 to 180', prn: true, infusion: true, available: (s, P) => !P.gone,
        checks: (s, P) => [{ label: 'Last glucose', value: P.lastBg ? `${P.lastBg.val} at ${clock(P.lastBg.t)}` : '196 at 06:00 (over an hour ago)', ok: P.lastBg ? s.t - P.lastBg.t <= 60 : false }, { label: 'Current rate', value: `${P.ins} units/h`, ok: null }],
        doses: [{ id: 1, label: 'Increase by 1 unit/h' }, { id: 2, label: 'No change' }, { id: 3, label: 'Decrease by 1 unit/h' }, { id: 4, label: 'Stop and recheck in 30 minutes' }],
        give(s, P, A, dose) {
          const g = P.lastBg && s.t - P.lastBg.t <= 30 ? P.lastBg.val : null;
          const right = g === null ? null : g > 180 ? 1 : g > 140 ? 2 : g >= 110 ? 3 : 4;
          if (g === null) A.judge('713-ins-stale', 'meds', -1, `You adjusted Mrs. Holloway's insulin without a current glucose.`, `An insulin protocol runs on a fresh fingerstick. Check first, then decide.`, '713');
          else if (dose === right) A.judge('713-ins', 'meds', 1, `You adjusted Mrs. Holloway's insulin by the protocol for a glucose of ${g}.`, `Glucose under 180 after cardiac surgery lowers wound infection; under 110 risks hypoglycemia. The table tells you which.`, '713');
          else A.judge('713-ins-err', 'meds', -1, `You set Mrs. Holloway's insulin outside the protocol for a glucose of ${g}.`, `Read the value against the table before touching the pump.`, '713');
          P.ins = dose === 1 ? P.ins + 1 : dose === 3 ? Math.max(0, P.ins - 1) : dose === 4 ? 0 : P.ins;
          return `Insulin at ${P.ins} units/h.`;
        } },
      { id: '713-asa', name: 'Aspirin', dose: '81 mg', route: 'PO', freq: 'Daily', due: 120, available: (s, P) => !P.gone, checks: () => [{ label: 'Grafts', value: 'Vein grafts: aspirin keeps them open', ok: true }], give: () => `Aspirin 81 mg with a sip of water.`, hold(s, P, A) { A.judge('713-asa-hold', 'meds', -1, `You held Mrs. Holloway's aspirin.`, `Aspirin after bypass keeps the vein grafts open. Holding it is the surgeon's decision.`, '713'); return 'Held.'; } },
      { id: '713-meto', name: 'Metoprolol tartrate', dose: '12.5 mg', route: 'PO', freq: 'Twice daily', due: 120, param: 'Hold for HR under 60 or SBP under 100', available: (s, P) => !P.gone,
        checks: (s, P, A) => { const v = A.vitals('713'); return [{ label: 'Heart rate', value: `${v.HR}`, ok: v.HR >= 60 }, { label: 'Blood pressure', value: `${v.SBP}/${v.DBP}`, ok: v.SBP >= 100 }]; },
        give(s, P, A) { const v = A.vitals('713'); P.metoGiven = true; if (v.SBP < 100 || P.tamp >= .3) A.judge('713-meto', 'meds', -3, `You gave metoprolol to Mrs. Holloway with an SBP of ${v.SBP} and a climbing heart rate.`, `The hold parameter was met. In tamponade, the fast heart rate is what's keeping her output up; a beta-blocker takes it away.`, '713'); return `Metoprolol 12.5 mg given.`; },
        hold(s, P, A) { const v = A.vitals('713'); A.judge('713-meto-hold', 'meds', v.SBP < 100 ? 1 : 0, v.SBP < 100 ? `You held metoprolol for an SBP under 100.` : `You held metoprolol with her vitals inside the parameters.`, v.SBP < 100 ? `Parameter met. And a new low pressure after heart surgery is something to report, not just a hold.` : `Post-op beta-blockade helps prevent atrial fibrillation; if you hold it, say why.`, '713'); return 'Held.'; } },
      { id: '713-lasix', name: 'Furosemide', dose: '20 mg', route: 'IV', freq: 'Twice daily', due: 120, param: 'Hold for SBP under 100', available: (s, P) => !P.gone,
        checks: (s, P, A) => { const v = A.vitals('713'); return [{ label: 'Blood pressure', value: `${v.SBP}/${v.DBP}`, ok: v.SBP >= 100 }, { label: 'Potassium', value: P.kGiven !== null ? 'Being replaced' : '3.4, not yet replaced', ok: P.kGiven !== null }]; },
        give(s, P, A) { const v = A.vitals('713'); P.lasixGiven = true; if (v.SBP < 100) A.judge('713-lasix', 'meds', -2, `You gave furosemide with an SBP of ${v.SBP}.`, `Under the hold parameter. A heart squeezed by blood around it needs all the filling it can get.`, '713'); return `Furosemide 20 mg IV.`; },
        hold(s, P, A) { const v = A.vitals('713'); A.judge('713-lasix-hold', 'meds', v.SBP < 100 ? 1 : 0, `You held Mrs. Holloway's furosemide${v.SBP < 100 ? ' for an SBP under 100' : ''}.`, v.SBP < 100 ? 'Parameter met.' : 'Inside the parameter; if you hold, say why.', '713'); return 'Held.'; } },
      { id: '713-alb', name: 'Albumin 5%', dose: '250 mL', route: 'IV', freq: 'For SBP under 90 with CVP under 8', prn: true, available: (s, P) => !P.gone, block: (s, P) => (P.albGiven ? 'Given.' : null),
        checks: (s, P, A) => { const v = A.vitals('713'); return [{ label: 'SBP', value: `${v.SBP}`, ok: v.SBP < 90 }, { label: 'CVP', value: `${beCVP(P)}`, ok: beCVP(P) < 8 }]; },
        give(s, P, A) { P.albGiven = true; A.judge('713-alb', 'meds', beCVP(P) >= 8 ? -1 : 0, `You gave albumin to Mrs. Holloway with a CVP of ${beCVP(P)}.`, `Her order is for low pressure with a low CVP: an empty tank. A low pressure with a high CVP is a heart that can't fill or can't pump. Fluid buys minutes at most.`, '713'); return `Albumin 5% 250 mL over 15 minutes.`; } },
      { id: '713-apap', name: 'Acetaminophen', dose: '1 g', route: 'PO', freq: 'Every 6 h as needed, pain', prn: true, available: (s, P) => !P.gone, checks: () => [{ label: 'Pain', value: 'Sternal 4/10', ok: true }, { label: 'Liver', value: 'Normal', ok: true }], give: () => `Acetaminophen 1 g with clear liquids.` },
    ],
    talk: (s, P) => (P.gone ? null : P.tamp >= .25 && !P.reexp ? 'bea_heavy' : P.k.talked ? 'bea_after' : 'bea_talk'),
    sbar: {
      items(s, P, A) {
        const v = A.vitals('713');
        return [
          { id: 'ct', label: `Chest tubes: ${beCT(s, P)} mL last hour, from 70 to 100 mL/h; clots in the tubing`, key: true, need: P.ctSeen !== null && P.ctSeen >= 75 && P.tamp >= .15, lock: 'Check the chest tubes' },
          { id: 'hr', label: `HR ${v.HR}, up from 84`, key: true, need: P.tamp >= .15 },
          { id: 'bp', label: `BP ${v.SBP}/${v.DBP}: pulse pressure ${v.SBP - v.DBP}, narrowing`, key: true, need: P.tamp >= .15 },
          { id: 'cvp', label: `CVP ${beCVP(P)}, up from 9`, key: true, need: P.tamp >= .15 },
          { id: 'sounds', label: 'Muffled heart sounds, neck veins distended', key: true, need: P.k.card !== undefined && P.tamp >= .3, lock: 'Assess her heart' },
          { id: 'lytes', label: P.kGiven !== null && P.mgGiven !== null ? 'K and Mg being replaced per protocol' : 'K 3.4, Mg 1.7', key: false, need: true },
          { id: 'lib', label: 'Retired children\'s librarian', key: false, need: true },
        ];
      },
      requests: [
        { id: 'tamp', label: 'Her chest tube output stopped suddenly with a rising heart rate and CVP, a falling pressure and a narrowing pulse pressure. I\'m worried about tamponade. Can you come now?' },
        { id: 'pull', label: 'Her chest tubes have finally stopped draining. Can we pull them?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        const cues = ['ct', 'hr', 'bp', 'cvp', 'sounds'].filter((k) => picked.includes(k)).length;
        if (req === 'pull') { P.pullAsked = true; A.judge('713-sbar-pull', 'judgment', -2, `You read Mrs. Holloway's stopped chest tubes as the bleeding settling.`, `Output that stops suddenly, rather than tapering, after cardiac surgery means the blood may be collecting around the heart. Look at the heart rate, the pressure and the CVP before calling it good news.`, '713'); if (cues < 2) return `Stopped? All at once? What are her pressures? Don't pull anything; check her and call me back.`; }
        if (P.tamp < .15) { if (req === 'tamp') A.judge('713-sbar-early', 'comm', 0, `You called about tamponade before there were signs of it.`, `Worth knowing the signs, but the numbers aren't there yet. Keep checking the tubes.`, '713'); return `Output trending down is what we want. Keep checking hourly and call me for a sudden change.`; }
        if (cues < 2) return `What are her numbers? Heart rate, pressure, CVP?`;
        if (P.called === null) { P.called = s.t; P.calledTamp = P.tamp; A.addOrder('713', `STAT: possible tamponade. Surgeon to bedside. Prepare for bedside re-exploration: sternotomy cart, sterile setup, 2 units PRBC to the room, OR team on standby. Hold metoprolol and furosemide. Keep MAP over 60.`); }
        A.judge('713-sbar', 'comm', req === 'tamp' && cues >= 3 ? 2 : 1, `You called Dr. Hale about tamponade in Mrs. Holloway.`, `Beck's triad (falling pressure, distended neck veins, muffled heart sounds) with a rising CVP, a narrow pulse pressure and tubes that stopped draining. Tamponade after cardiac surgery is a surgical emergency.`, '713');
        return `I'm on my way. Set up for a bedside re-exploration: open-chest cart, blood in the room, call the OR. Don't strip the tubes. Hold the beta-blocker.`;
      },
    },
    scene: (s, P) => ({ tele: true, teleWave: P.af ? 'afib' : 'normal', iv: 'running', o2: 2, foley: true, ctube: true, ctLevel: P.reexp ? .7 : .55, is: true, isUsed: P.is, flowers: true, empty: P.gone, emptyText: 'Bed stripped. Emergency resternotomy at the bedside after a PEA arrest; now in the OR.' }),
    clues: (s, P) => ({ ctube: P.tamp >= .15 && !P.reexp ? `Collection chamber: the level hasn't moved since the 08:00 mark. Dark clots sit in both tubes where they leave her chest.` : `Collection chamber marked each hour: 120, 110, 100, 90, then ${s.t >= 60 ? '70' : 'filling'}. Serosanguineous, no clots. Suction bubbling gently.`, flowers: `A card from the Elmhurst library story-time kids, crayon hearts. "Get well Mrs. H! We miss the bear book."`, is: P.is ? `The spirometer marker is at 1,000.` : `The spirometer marker is at 750.`, monitor: `HR ${beHR(P)}. CVP ${beCVP(P)}.`, foley: `Urine ${P.tamp >= .4 ? 'scant, dark' : 'clear yellow'}.` }),
    rig: (s, P) => ({ hr: beHR(P), sbp: beSBP(P), anxious: P.tamp >= .25 && !P.reexp ? Math.min(.9, P.tamp) : 0, sweat: P.tamp >= .6 ? .5 : 0, pain: 4 }),
    status: (s, P) => (P.gone ? 'gone' : P.tamp >= .4 ? 'urgent' : P.tamp >= .15 || P.af ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.gone) return { tone: 'bad', title: 'Tamponade, arrest, emergency resternotomy', text: `Her chest tubes stopped at 08:15 while her heart rate climbed and her pressure fell. PEA arrest at ${clock(P.arrestAt)}; Dr. Hale opened her chest at the bedside and took her to the OR. ${P.pullAsked ? 'Someone asked to pull the tubes because the bleeding had "stopped."' : ''}` };
      if (P.reexp) { const early = P.calledTamp < .6; const lytes = P.kGiven !== null && P.mgGiven !== null;
        const ok = early && lytes && !P.metoGiven && !P.af;
        return { tone: ok ? 'good' : 'mixed', title: ok ? 'Tamponade caught and relieved' : early ? 'Tamponade relieved, with gaps' : 'Tamponade relieved, late', text: `Re-explored at the bedside at ${clock(P.reexpAt)}: 450 mL of clot around the heart, a bleeding sternal wire site sewn. ${P.reassessed ? 'Pressure and CVP back to normal when you rechecked.' : ''}${!lytes ? ' Her potassium and magnesium were never replaced.' : ''}${P.af ? ' New atrial fibrillation at ' + clock(P.afAt) + '.' : ''}${P.metoGiven ? ' Metoprolol went in during the tamponade.' : ''}` }; }
      if (P.tamp >= .15) return { tone: 'bad', title: 'Tamponade at handoff', text: `HR ${beHR(P)}, BP ${beSBP(P)}/${beDBP(P)}, CVP ${beCVP(P)}, tubes not draining. Nobody called the surgeon.` };
      return { tone: 'good', title: 'Stable after bypass', text: 'Tubes draining, electrolytes replaced.' };
    },
  };

  /* ---------- 714 Joseph Mensah: anoxic brain injury; the family meeting and comfort care ---------- */
  const jo = {
    id: '714', room: '714', name: 'Joseph Mensah', short: 'Mr. Mensah', talkLabel: 'Sit with Mr. Mensah', age: 58, sex: 'M', mrn: '00715560', provider: 'siddiqui', vented: true,
    look: { skin: '#5E3A27', shade: '#47291B', lip: '#4A2418', blush: '#86493A', iris: '#1A100A', head: { w: 58, h: 63, jaw: .6 }, eye: 9.6,
      hair: { style: 'buzz', color: '#8E8A86' }, brow: { w: 4, color: '#4A4440' }, body: { w: 88, cloth: 'gown' }, extras: ['ett'], smile: 0,
      lines: { calm: `(He doesn't respond.)`, none: `(He doesn't respond. The ventilator breathes for him; now and then he gives a weak cough.)` } },
    bio: `Bus mechanic for the transit authority, 31 years. Deacon at his church. Married to Abena for 34 years; their son Kofi and daughter Ama are both here.`,
    dx: `Anoxic brain injury after cardiac arrest`, reason: `Collapsed at church 4 days ago; bystander CPR, ROSC after 25 minutes. Temperature control completed. Neurology: no pupillary or corneal reflexes, weak cough only, no motor response; prognosis for meaningful recovery very poor.`,
    hx: [`Hypertension`, `Advance directive (2019) on file: no life support if in a coma with no reasonable hope of waking`, `No power of attorney named`],
    allergies: `No known drug allergies`, code: `Full code (family meeting 10:30)`, weight: `84 kg`,
    live: (s, P) => {
      if (P.decision === null) return null;
      const o = { code: `DNR, comfort care (family decision ${clock(P.decision)})`, dx: P.extAt === null ? `Anoxic brain injury; comfort care, extubation planned` : `Anoxic brain injury; comfort care after extubation` };
      if (P.extAt !== null) { o.lines = [`Extubated ${clock(P.extAt)}: room air`, `Right IJ central line (comfort medications)`, P.stopped ? `Feeds off` : `Nasogastric tube: feeds`, `Foley catheter`]; o.quiet = `(He doesn't respond. ${P.dist >= .3 ? 'He breathes fast and shallow.' : 'His breathing is slow and irregular.'} Abena holds his hand.)`; o.vented = false; }
      return o;
    },
    lines: [`Endotracheal tube, ventilator: FiO₂ 30%, PEEP 5`, `Right IJ central line`, `Nasogastric tube: feeds`, `Foley catheter`],
    mobility: `Bed rest; turn every 2 hours`, diet: `Tube feeds`,
    init: { opo: null, adRead: false, meetPrep: false, atMeeting: null, meetDone: false, meetMissed: false, decision: null, stopped: false, extPrep: false, extAt: null, stayed: null, donationRaised: false, don: null, nothing: null, kofi: null, son: null, pastor: null, dying: false, dist: 0, sec: 0, morph: [], glyco: null, sat: false },
    nightVitals: { T: 37.4, HR: 86, SBP: 132, DBP: 74, RR: 14, SpO2: 98, O2: 'vent, FiO₂ 30%', pain: 0 },
    labs: [
      { name: 'EEG (day 3)', val: 'Suppressed background, no reactivity', unit: '', ref: '', flag: 'A', t: -1500 },
      { name: 'MRI brain (day 3)', val: 'Diffuse anoxic injury of the cortex and deep gray matter', unit: '', ref: '', flag: 'A', t: -1400 },
      { name: 'Neuron-specific enolase', val: 96, unit: 'ng/mL', ref: 'over 60 at 48 to 72 h suggests poor outcome', flag: 'H', t: -2900 },
    ],
    orders: [
      { t: -1500, text: `Neurology: no pupillary, corneal or oculocephalic reflexes; weak cough; no motor response. Off sedation over 72 hours, normothermic. Prognosis for meaningful neurologic recovery very poor. Not brain dead (cough present).` },
      { t: -1500, text: `Family meeting today 10:30 with Dr. Siddiqui, palliative care and chaplain. Ventilator FiO₂ 30%, PEEP 5. Tube feeds. Heparin 5,000 units SC every 8 hours.` },
      { t: -4000, text: `Unit policy: refer to the organ procurement organization (OPO) within 1 hour when a ventilated patient has a GCS of 5 or less or a plan to discuss withdrawal of support, before any discussion of withdrawal with the family. Only the OPO's designated requester discusses donation with families.` },
    ],
    notes: [
      { t: -50, author: 'Bree, night RN', text: `GCS 3 off sedation (weak cough). No changes. Wife Abena at the bedside all night, son Kofi and daughter Ama came at 06:00. Kofi upset after neurology yesterday: "they're giving up on him." Don't think anyone has called the OPO.` },
    ],
    io: { intake: `Tube feeds 60 mL/h`, output: `Foley 80 mL/h` },
    report: [
      { text: `Joseph Mensah, 58, anoxic brain injury after an arrest four days ago. GCS 3, just a weak cough. Neuro says it's very poor.`, key: true },
      { text: `Family meeting at ten-thirty with Dr. Siddiqui and palliative.`, key: true },
      { text: `I don't think anyone has called the OPO.`, key: true },
      { text: `His son Kofi doesn't agree with his mom. He was loud with neurology yesterday.`, key: true },
      { text: `He fixes buses. His wife says he can fix anything with an engine.`, key: false },
      { text: `They're a big church family. Lots of visitors.`, key: false },
    ],
    vitals(s, P) {
      if (P.extAt === null) return { T: 37.4, HR: 86 + jit(s, 7), SBP: 132 + jit(s, 8) * 2, DBP: 74, RR: 14, SpO2: 98, O2: 'vent, FiO₂ 30%', pain: 0, extra: `GCS 3 (E1 VT M1). Pupils 5 mm, fixed.` };
      const dt = s.t - P.extAt;
      return { T: 37.6, HR: Math.round(104 - dt * .3), SBP: Math.round(112 - dt * .5), DBP: 62, RR: Math.round(10 + P.dist * 20), SpO2: Math.round(Math.max(70, 92 - dt * .3)), O2: 'room air (comfort care)', pain: 0, extra: `Breathing ${P.dist >= .3 ? 'labored, with pauses' : 'irregular, unlabored'}${P.sec >= .3 ? '; gurgling with each breath' : ''}.` };
    },
    assess: {
      general: (s, P) => (P.extAt === null ? `Still. Eyes closed. The ventilator breathes for him. Abena is sitting close, a Bible in her lap.` : P.dist >= .3 ? `Breathing fast and shallow with his shoulders, brow tight.` : `Breathing slowly and quietly. Face relaxed. Family around the bed.`),
      resp: (s, P) => (P.extAt === null ? `On the ventilator, triggering no breaths of his own beyond the set rate. Clear.` : `RR ${Math.round(10 + P.dist * 20)}, irregular, pauses of 10 to 15 seconds. ${P.sec >= .3 ? 'Loud gurgling secretions in his throat.' : 'Quiet.'}`),
      cardiac: (s, P, A) => `HR ${A.vitals('714').HR}, BP ${A.vitals('714').SBP}/${A.vitals('714').DBP}. ${P.extAt !== null ? 'Hands cooling, mottling at the knees.' : 'Warm.'}`,
      neuro: () => `GCS 3. Pupils 5 mm, fixed. No corneal reflex. Weak cough with suctioning. No response to pain.`,
      pain: (s, P) => (P.extAt === null ? `No signs of distress: relaxed face, no grimace, synchronous with the ventilator.` : P.dist >= .3 ? `Signs of distress: tachypnea, accessory muscle use, furrowed brow.` : `No signs of distress.`),
      skin: () => `Intact. Heels floated.`,
      gi: (s, P) => (P.stopped ? `Feeds off. Mouth care given.` : `Feeds at 60 mL/h. Foley clear.`),
    },
    interventions: [
      { id: 'opo', label: 'Call the organ procurement organization (OPO) referral line', cost: 3, avail: (s, P) => P.opo === null,
        run(s, P, A) { P.opo = s.t; const before = !P.meetDone && P.atMeeting === null;
          A.judge('714-opo', 'judgment', before ? 2 : 0, before ? `You referred Mr. Mensah to the OPO before the family meeting.` : `You referred Mr. Mensah to the OPO after the withdrawal discussion.`, `Federal rules (CMS) require hospitals to notify the OPO in a timely way about imminent death, by unit triggers such as a GCS of 5 or less, before withdrawal is discussed. The referral is a phone call from the nurse; it isn't a conversation with the family.`, '714');
          return `OPO referral line: name, age, diagnosis, GCS 3, ventilator, meeting at 10:30. The coordinator takes it from here and will tell the team if he might be a candidate. "Please don't raise donation with the family. If they ask, tell them someone will come talk with them."`; } },
      { id: 'ad', label: 'Read his advance directive', cost: 2, avail: (s, P) => !P.adRead,
        run(s, P, A) { P.adRead = true; const pre = !P.meetDone && P.atMeeting === null; A.judge('714-ad', 'assess', pre ? 1 : 0, pre ? `You read Mr. Mensah's advance directive before the meeting.` : `You read Mr. Mensah's advance directive after the family meeting.`, `${pre ? '' : 'Reading it beforehand lets you bring it to the table. '}What he wrote is the starting point for the family's decision. It doesn't name an agent, so his wife is his surrogate by law in most states.`, '714'); return `Signed 2019, witnessed: "If I am in a coma and the doctors believe I have no reasonable hope of waking up, I do not want to be kept alive by machines. I want my family with me and my pastor to pray." No healthcare agent named.`; } },
      { id: 'meetprep', label: 'Prepare for the meeting: a private room, who\'s coming, chaplain and palliative care, what the family understands', cost: 4, avail: (s, P) => !P.meetPrep && !P.meetDone,
        run(s, P, A) { P.meetPrep = true; A.judge('714-meetprep', 'comm', 1, `You prepared Mr. Mensah's family and the room for the meeting.`, `Before a meeting: a quiet room with enough chairs, the right people invited, and a sense of what the family already understands so the team can start there.`, '714'); return `Conference room booked, tissues and water. Chaplain Ruth and palliative care confirmed. Abena, Kofi and Ama will come. Abena understands "his brain was without oxygen too long." Kofi believes "he just needs more time."`; } },
      { id: 'meeting', label: 'Join the family meeting with Dr. Siddiqui (about 25 minutes)', cost: 25, avail: (s, P) => s.t >= 205 && !P.meetDone,
        run(s, P, A) { P.atMeeting = s.t; P.meetDone = true;
          if (P.opo === null && !P.novaOpo) { A.judge('714-opo-late', 'judgment', -2, `The withdrawal discussion started before anyone called the OPO.`, `The referral has to come before the family is asked about withdrawing support. He met the trigger last night.`, '714'); }
          A.judge('714-meeting', 'comm', 2, `You were at Mr. Mensah's family meeting.`, `The nurse's place in a family meeting: prepare the family, be there, translate jargon, say what you've seen at the bedside, and stay with them afterward. You know them better than anyone in the room.`, '714');
          decide(s, A, P);
          return `Dr. Siddiqui explains, slowly, what the tests show. Kofi asks hard questions; you help by describing what you've seen at the bedside: no response to pain, a weak cough, nothing more. Abena reads his advance directive aloud. Kofi cries. They decide on comfort-focused care, with the breathing tube out after their pastor comes at 11:00.`; } },
      { id: 'donate', label: 'Ask the family whether they have thought about organ donation', cost: 3, avail: (s, P) => !P.donationRaised,
        run(s, P, A) { P.donationRaised = true; A.judge('714-donate', 'comm', -2, `You raised organ donation with Mr. Mensah's family yourself.`, `Donation is discussed only by the OPO's trained designated requester, and only after the OPO decides he might be a candidate. Families approached by the right person, at the right time, say yes more often and feel less pressured.`, '714'); return `Abena stares at you. "Is that why you're all in such a hurry?" Kofi walks out.`; } },
      { id: 'stopcare', label: 'Carry out the comfort orders: stop labs, feeds, heparin and routine vitals; silence the room monitor', cost: 3, avail: (s, P) => P.decision !== null && !P.stopped,
        run(s, P, A) { P.stopped = true; A.judge('714-stopcare', 'judgment', 1, `You stopped what wasn't for his comfort.`, `Comfort care means taking away what doesn't help him: blood draws, feeds that can cause aspiration and swelling, alarms that pull the family's eyes to a screen.`, '714'); return `Labs canceled, feeds off and the tube capped, heparin discontinued. Room monitor off; the central station still watches. Chairs brought in.`; } },
      { id: 'extprep', label: 'Prepare for extubation: premedicate per order, suction, explain what they\'ll see, ask who wants to be there', cost: 4, avail: (s, P) => P.decision !== null && !P.extPrep && P.extAt === null,
        run(s, P, A) { P.extPrep = true; A.judge('714-extprep', 'comm', 1, `You prepared Mr. Mensah's family for the extubation.`, `Tell them what they'll see: the tube out, breathing that may change, pauses, noisy secretions, color changes. Ask who wants to be in the room. Premedicate so breathlessness is treated before it starts.`, '714'); return `You explain what will happen and what they may see and hear. Abena wants everyone there. The pastor is on his way.`; } },
      { id: 'extubate', label: 'Extubate with RT, with the family at the bedside, and stay with them', cost: 10, avail: (s, P) => P.decision !== null && P.extAt === null && s.t >= 240,
        run(s, P, A) { P.extAt = s.t; P.stayed = true; A.judge('714-extubate', 'comm', P.extPrep ? 2 : 1, `You stayed with the Mensah family through the extubation.`, `Never leave a family alone at the moment of withdrawal. Your presence, watching for distress and treating it, is the care.`, '714'); return `Jonah suctions and slides the tube out. The room is quiet. The pastor prays; the family sings, softly, a hymn in Twi. His breathing is slow and irregular. You stay at the head of the bed, watching his face.`; } },
      { id: 'extleave', label: 'Extubate with RT, then step out to give the family privacy', cost: 5, avail: (s, P) => P.decision !== null && P.extAt === null && s.t >= 240,
        run(s, P, A) { P.extAt = s.t; P.stayed = false; A.judge('714-extubate', 'comm', -2, `You left the Mensah family alone after the extubation.`, `Privacy can be offered later. At the moment the tube comes out, they need someone who knows what they're seeing and can treat distress.`, '714'); return `Jonah pulls the tube and you both step out. A few minutes later Ama comes to the door: "He's breathing funny. Is he choking? Is he suffering?"`; } },
      { id: 'presence', label: 'Sit with the family a while', cost: 6, avail: (s, P) => P.extAt !== null && !P.sat,
        run(s, P, A) { P.sat = true; A.judge('714-presence', 'comm', 1, `You sat with the Mensah family.`, `Presence is an intervention. Silence, a hand on a shoulder, saying his name.`, '714'); return `You pull up a chair. Abena tells you how he whistled while he worked on engines, always the same three hymns. Kofi laughs, once, for the first time today.`; } },
    ],
    meds: [
      { id: '714-hep', name: 'Heparin', dose: '5,000 units', route: 'SC', freq: 'Every 8 hours', due: 60, available: (s, P) => !P.stopped || s.meds['714-hep'].status !== 'due', checks: () => [{ label: 'Platelets', value: '190', ok: true }], give: () => `Heparin 5,000 units SC.`, hold(s, P, A) { if (P.decision === null) A.judge('714-hep-hold', 'meds', -1, `You held Mr. Mensah's heparin before any change in the plan.`, `Until the family decides, his orders stand.`, '714'); return P.decision === null ? 'Held.' : 'Discontinued: comfort care.'; } },
      { id: '714-morph', name: 'Morphine (comfort)', dose: '2 to 4 mg', route: 'IV', freq: 'Every 15 min as needed, dyspnea or distress; may premedicate', prn: true, available: (s, P) => P.decision !== null,
        checks: (s, P) => [{ label: 'Distress', value: P.extAt === null ? 'Before extubation: premedication allowed' : P.dist >= .3 ? 'Tachypnea, accessory muscles, furrowed brow' : 'None now', ok: P.extAt === null || P.dist >= .3 }, { label: 'Goal', value: 'Comfort', ok: null }],
        give(s, P, A) { P.morph.push(s.t); if (P.extAt === null) P.premed = true; const need = P.extAt === null || P.dist >= .3; P.dist = Math.max(0, P.dist - .45);
          A.judge(P.extAt === null ? '714-morph-pre' : '714-morph', 'meds', need ? 1 : 0, need ? `You gave morphine for Mr. Mensah's ${P.extAt === null ? 'comfort before extubation' : 'breathlessness'}.` : `You gave morphine without signs of distress.`, need ? `Opioids treat the feeling of breathlessness. Given to relieve distress, at the dose that does it, they don't hasten death; that's the principle of double effect.` : `Comfort meds follow signs of distress, or a premedication order. Reassess and dose to what you see.`, '714');
          return `Morphine 2 mg IV. ${P.extAt !== null ? 'A few minutes later his breathing slows and his brow softens.' : ''}`; } },
      { id: '714-glyco', name: 'Glycopyrrolate', dose: '0.2 mg', route: 'IV', freq: 'Every 4 h as needed, secretions', prn: true, available: (s, P) => P.decision !== null,
        checks: (s, P) => [{ label: 'Secretions', value: P.sec >= .3 ? 'Gurgling with each breath' : 'Quiet', ok: P.sec >= .3 }],
        give(s, P, A) { P.glyco = s.t; A.judge('714-glyco', 'meds', P.sec >= .3 ? 1 : 0, `You gave glycopyrrolate for Mr. Mensah's secretions.`, `Noisy breathing near death usually doesn't distress the patient, but it distresses the family. Reposition, then glycopyrrolate dries new secretions; deep suctioning mostly doesn't help.`, '714'); P.sec = Math.max(0, P.sec - .5); return `Glycopyrrolate 0.2 mg IV. Turned onto his side. The gurgling eases over the next 20 minutes.`; } },
    ],
    talk: () => 'jo_talk',
    family: { name: 'Abena', rel: 'Wife', mode: 'bedside', cost: 3, dialog: (s, P) => (!P.k.ab ? 'ab_talk' : P.meetDone && P.kofiMeet === undefined ? 'kofi_meet' : P.decision !== null && P.don === null ? 'ab_don' : P.extAt !== null && !P.dying ? 'ab_dying' : 'ab_after') },
    sbar: {
      items(s, P) {
        return [
          { id: 'gcs', label: 'GCS 3, weak cough only; neurology prognosis very poor', key: true, need: true },
          { id: 'opo', label: P.opo !== null ? `OPO referral made at ${clock(P.opo)}` : 'OPO not yet notified', key: true, need: true },
          { id: 'ad', label: 'Advance directive: no machines if no reasonable hope of waking', key: true, need: P.adRead, lock: 'Read his advance directive' },
          { id: 'kofi', label: 'Son disagrees with his mother about stopping', key: true, need: P.kofi !== null || s.t >= 160 },
          { id: 'dist', label: P.extAt !== null ? (P.dist >= .3 ? 'Labored breathing after extubation' : 'Comfortable after extubation') : 'Comfortable on the ventilator', key: P.dist >= .3, need: true },
          { id: 'bus', label: 'Bus mechanic for 31 years', key: false, need: true },
        ];
      },
      requests: [
        { id: 'meet', label: 'Before the 10:30 meeting: his advance directive says no machines without hope of waking, his son disagrees, and I\'ve called the OPO. Can chaplain and palliative care join?' },
        { id: 'comfort', label: 'He\'s breathing hard after extubation. Can we increase his comfort medication?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'meet') { A.judge('714-sbar-meet', 'comm', picked.includes('ad') && picked.includes('opo') ? 2 : 1, `You briefed Dr. Siddiqui before the family meeting.`, `What the patient wanted, where the family disagrees, and that the OPO knows: the doctor walks in prepared.`, '714'); return P.opo !== null ? `Thank you. That changes how I'll open. Chaplain and palliative are coming. Please be there.` : `Has the OPO been called? He met the trigger last night. Do that before 10:30.`; }
        if (req === 'comfort') { if (P.extAt === null) return `He's not extubated yet.`; P.morphUp = true; A.judge('714-sbar-comfort', 'comm', P.dist >= .3 ? 1 : 0, `You called for more comfort medication for Mr. Mensah.`, `Distress you can't relieve with the ordered dose is a call. Titrate to comfort.`, '714'); A.addOrder('714', `Morphine infusion 2 mg/h, may bolus 2 to 4 mg every 15 minutes for distress. Titrate to comfort.`); return `Yes. Start a morphine infusion at 2 an hour and bolus as you need to. Whatever keeps him comfortable.`; }
        return `Thanks. See you at 10:30.`;
      },
    },
    scene: (s, P) => ({ tele: P.extAt === null && !P.stopped, iv: 'running', vent: P.extAt === null, foley: true, family: 'abena', familyLabel: P.extAt !== null ? 'Abena, with Kofi and Ama, around the bed' : 'Abena, his wife, a Bible in her lap', flowers: true }),
    clues: (s, P) => ({ vent: `FiO₂ 30%, PEEP 5, rate 14. He isn't triggering breaths of his own.`, family: P.extAt !== null ? `Abena holds his hand. Kofi stands at the window. Ama has her phone on speaker: her aunt in Kumasi, praying.` : `Abena, in her church clothes, a Bible open to the Psalms. A photo on the windowsill: Joseph in coveralls, grinning, in front of a bus.`, flowers: `A card from the transit authority's maintenance shop, signed by 40 mechanics. "Fix yourself up, Deacon."`, foley: `Clear urine.` }),
    rig: (s, P) => ({ alert: 2, rr: P.extAt === null ? 14 : Math.round(10 + P.dist * 20), spo2: P.extAt === null ? 98 : 86, anxious: 0 }),
    status: (s, P) => (P.extAt !== null && (P.dist >= .4 || P.sec >= .5) ? 'urgent' : 'watch'),
    outcome(s, P) {
      const fails = [P.opo === null ? 'the OPO was never called' : P.opo > (P.atMeeting || 999) ? 'the OPO was called after the withdrawal talk' : null, P.donationRaised && 'donation raised by the nurse', P.don === 'bad' && 'a wrong answer about donation', P.meetMissed && 'no nurse at the family meeting', P.nothing === 'bad' && '"nothing more we can do"', P.stayed === false && 'the family left alone at extubation', P.son === 'bad' && 'the son\'s request answered the wrong way', P.decision !== null && !P.stopped && 'comfort orders not carried out', P.extAt !== null && P.dist >= .4 && 'distress at the end of the shift'].filter(Boolean);
      const done = P.extAt !== null ? `He died at 12:52 with Abena holding his hand and the family singing.` : P.decision !== null ? `The tube came out with the afternoon nurse.` : `The decision is still waiting.`;
      if (P.donationRaised || P.son === 'bad' || fails.length >= 3) return { tone: 'bad', title: 'A hard death for the family', text: `${done} Gaps: ${fails.join('; ')}.` };
      if (!fails.length && P.extAt !== null) return { tone: 'good', title: 'A good death, as he wanted', text: `${done} OPO called before the meeting, the nurse at the table, comfort care done well, and you never left them alone. The OPO's requester spoke with them; he wasn't a candidate for organ donation, and they were glad to have been asked.` };
      return { tone: 'mixed', title: 'Comfort care, with gaps', text: `${done} ${fails.length ? 'Gaps: ' + fails.join('; ') + '.' : ''}` };
    },
  };
  function decide(s, A, P) {
    if (P.decision !== null) return;
    P.decision = s.t;
    A.addOrder('714', `Comfort-focused care (Dr. Siddiqui, after the family meeting). DNR. Compassionate extubation with RT when the family is ready. Morphine 2 to 4 mg IV every 15 minutes as needed for dyspnea or distress; may premedicate before extubation. Glycopyrrolate 0.2 mg IV every 4 hours as needed for secretions. Discontinue labs, tube feeds, heparin, routine vital signs and in-room monitor alarms. Unrestricted visiting. Chaplain.`);
  }

  /* ---------- dialogs ---------- */
  const dialogs = {
    fr_talk: { who: '711', text: `His eyes open. "Who are you? Where's Linda?" He tries to sit up and winces at his back.`, choices: [
      { label: `I'm your nurse, Mr. Kowalski. You're in the ICU. You have a bad infection from a kidney stone, and we're treating it. Linda is right here, holding your hand.`, next: 'fr_a', fx: (s, A) => { s.p['711'].k.talked = s.t; A.judge('711-talk', 'comm', 1, `You reoriented Mr. Kowalski simply and honestly.`, `Septic patients are often confused. Short, true, repeated: who you are, where he is, who's here.`, '711'); } },
      { label: `Can you tell me why you're in the hospital, and what the doctors want to do this morning?`, next: 'fr_b', fx: (s, A) => { const P = s.p['711']; P.k.talked = s.t; P.cap = true; A.judge('711-cap', 'assess', 1, `You checked whether Mr. Kowalski could understand his procedure.`, `Capacity is decision-specific: can he understand, appreciate, reason and choose about this procedure? Drowsy and oriented to self, he can't.`, '711'); } },
      { label: `Don't worry about it. Go back to sleep.`, next: 'fr_c', fx: (s, A) => { s.p['711'].k.talked = s.t; A.judge('711-talk', 'comm', -1, `You told Mr. Kowalski not to worry about it.`, `Confusion is frightening. A sentence of orientation costs nothing.`, '711'); } },
    ] },
    fr_a: { who: '711', text: `He squeezes her hand. "Kidney stone. Huh." His eyes drift shut. "Fix the light in the break room. It's the ballast."` },
    fr_b: { who: '711', text: `"My... back. A stone?" He frowns, loses the thread. "Linda knows." He can't say what the procedure is or why.` },
    fr_c: { who: '711', text: `He closes his eyes, then opens them again, looking for Linda.` },
    fr_after: { who: '711', text: `"Is it fixed yet?" He means the stone. Or the light. He isn't sure.` },
    linda_talk: { who: 'linda', pid: '711', text: `Linda looks up. "He keeps asking for water. Can I give him a little? And some of my coffee? He's so thirsty."`, choices: [
      { label: `He can't have anything by mouth before the procedure at ten; he'll be sedated, and anything in his stomach could go into his lungs. I can give him mouth swabs and lip balm right now, and you can help.`, next: 'linda_a', fx: (s, A) => { s.p['711'].k.linda = s.t; A.judge('711-npo', 'safety', 1, `You kept Mr. Kowalski NPO and offered comfort.`, `NPO before a sedated procedure protects his airway. Swabs and lip balm treat the thirst.`, '711'); } },
      { label: `A few sips of water are fine.`, next: 'linda_b', fx: (s, A) => { s.p['711'].k.linda = s.t; s.p['711'].npoBroken = true; A.judge('711-npo', 'safety', -2, `You let Mr. Kowalski drink before his procedure.`, `He's NPO for IR sedation, and he's drowsy: aspiration risk twice over.`, '711'); } },
      { label: `No. He's NPO.`, next: 'linda_c', fx: (s, A) => { s.p['711'].k.linda = s.t; A.judge('711-npo', 'comm', 0, `You said no without explaining.`, `Right rule. Linda would help keep it if she knew why, and what she can do instead.`, '711'); } },
    ] },
    linda_a: { who: 'linda', pid: '711', text: `She takes the swab and runs it gently over his lips. "Forty-one years and I've never seen him this quiet." She manages a smile.` },
    linda_b: { who: 'linda', pid: '711', text: `She holds a cup to his lips. He coughs on the first sip.` },
    linda_c: { who: 'linda', pid: '711', text: `"Okay." She looks at the cup, then at him.` },
    linda_after: { who: 'linda', pid: '711', text: `"His color's a little better, isn't it?" She's been watching the monitor all night. "The top number on the right. The doctor said 65."` },

    tu_talk: { who: '712', text: (s) => (s.p['712'].sedOff ? `You tell him your name, the day, that he's in the hospital and Michael is here. His eyes flutter toward Michael's voice.` : `You tell him your name, the day, and that Michael is here. Hearing can remain under sedation. His eyes don't open.`) },
    tu_agit: { who: '712', text: `His eyes are wide. He coughs against the tube, grabs for it, and the ventilator alarms.`, choices: [
      { label: `Tuan, I'm your nurse. You're in the hospital. There's a tube helping you breathe; please don't pull it. Michael is right here. Squeeze my hand if you hear me.`, next: 'tu_a', fx: (s, A) => { const P = s.p['712']; P.alts = true; A.judge('712-alts', 'safety', 2, `You tried reorientation and family before anything restrictive.`, `Least restrictive first: explain, reorient, touch, a familiar voice. With delirium it may not be enough, but it comes first.`, '712'); } },
      { label: `Stop that! You'll pull your tube out!`, next: 'tu_b', fx: (s, A) => { A.judge('712-alts', 'comm', -1, `You shouted at Mr. Pham.`, `A delirious patient hears threat, not instruction. Calm, simple, repeated words work better.`, '712'); } },
    ] },
    tu_a: { who: '712', text: `He squeezes your hand, hard. Michael leans in and talks about the band. For a minute he settles. Then he coughs, and his free hand goes back toward his mouth.` },
    tu_b: { who: '712', text: `He flinches and pulls harder.` },
    mic_talk: { who: 'michael', pid: '712', text: `Michael rubs his eyes. "I'm a CRNA. I put people to sleep for a living. But I don't know if he can hear me. Can he?"`, choices: [
      { label: `He may. Hearing seems to be one of the last senses to go, and many patients remember voices from the ICU. Talk to him like you would at home: about your day, the band. It may help him wake up less frightened.`, next: 'mic_a', fx: (s, A) => { s.p['712'].k.mic = s.t; A.judge('712-mic', 'comm', 2, `You encouraged Michael to talk to Tuan.`, `Family voices help orient patients as they wake and may reduce delirium. Honest: we don't know for sure, and talking to him can only help.`, '712'); } },
      { label: `No, he's too sedated to hear anything.`, next: 'mic_b', fx: (s, A) => { s.p['712'].k.mic = s.t; A.judge('712-mic', 'comm', -1, `You told Michael that Tuan couldn't hear him.`, `We don't know that, and it takes away something Michael can do.`, '712'); } },
      { label: `You'd know better than me. You're the anesthesia expert.`, next: 'mic_c', fx: (s, A) => { s.p['712'].k.mic = s.t; A.judge('712-mic', 'comm', 0, `You turned Michael's question back on him.`, `At this bedside he's family, not a colleague. Answer the question he asked.`, '712'); } },
    ] },
    mic_a: { who: 'michael', pid: '712', text: `He pulls his chair closer. "Okay. Hey, Tuan. The sophomores sent a video. The trumpets are still flat." He laughs, a little.` },
    mic_b: { who: 'michael', pid: '712', text: `"Right." He goes back to watching the ventilator numbers.` },
    mic_c: { who: 'michael', pid: '712', text: `"In the OR, sure. Here I'm just his husband." He looks at Tuan.` },
    mic_del: { who: 'michael', pid: '712', text: `"He looked at me like he didn't know me. Is this the propofol? Is he brain damaged?"`, choices: [
      { label: `It's delirium: a sudden, usually temporary confusion that's very common on a ventilator. It isn't brain damage. Your voice, his glasses, daylight, sleep at night, and less sedation all help. You're part of the treatment.`, next: 'mic_d', fx: (s, A) => { s.p['712'].k.micDel = s.t; A.judge('712-mic-del', 'comm', 1, `You explained ICU delirium to Michael.`, `Families who understand delirium are less frightened by it and help prevent it: the F in the ABCDEF bundle.`, '712'); } },
      { label: `I can't say. The doctor will talk to you.`, next: 'mic_e', fx: (s, A) => { s.p['712'].k.micDel = s.t; A.judge('712-mic-del', 'comm', -1, `You deflected Michael's question about delirium.`, `Explaining delirium is nursing education, well within your role.`, '712'); } },
    ] },
    mic_d: { who: 'michael', pid: '712', text: `He lets out a breath. "His glasses are in my bag. I'll bring them in."` },
    mic_e: { who: 'michael', pid: '712', text: `"Okay." He's quiet for a long time.` },
    mic_rest: { who: 'michael', pid: '712', text: `Michael sees the wrist restraints. "Is that really necessary?"`, choices: [
      { label: `For now. He's confused and kept reaching for his tube even with both of us here. They're soft, he can still move his arms, and I check them often. They come off as soon as he's calm, likely once the sedation settles him.`, next: 'mic_f', fx: (s, A) => { s.p['712'].toldMic = true; A.judge('712-mic-rest', 'comm', 1, `You explained the restraints to Michael.`, `Tell the family why, how they're monitored, and what it will take to remove them.`, '712'); } },
      { label: `Hospital policy.`, next: 'mic_g', fx: (s, A) => { s.p['712'].toldMic = false; A.judge('712-mic-rest', 'comm', -1, `You answered "policy" about the restraints.`, `That's not a reason. He deserves the real one.`, '712'); } },
    ] },
    mic_f: { who: 'michael', pid: '712', text: `"Okay. I've seen people pull tubes." He holds Tuan's restrained hand anyway.` },
    mic_g: { who: 'michael', pid: '712', text: `He frowns and says nothing.` },
    mic_after: { who: 'michael', pid: '712', text: `"The sophomores are learning 'September' for when he's back." He plays a few seconds of it from his phone, very quietly.` },

    bea_talk: { who: '713', text: `"Help me sit forward, dear, I'll just push myself up with my arms like I always do."`, choices: [
      { label: `Let's do it the sternum-safe way: hug your heart pillow, roll to your side, and push up with your legs while I guide you. No pushing or pulling with your arms for six weeks, while your breastbone heals.`, next: 'bea_a', fx: (s, A) => { s.p['713'].k.talked = s.t; s.p['713'].sternal = true; A.judge('713-sternal', 'safety', 2, `You taught Mrs. Holloway sternal precautions.`, `Pushing up with the arms pulls the sternum apart while the wires hold it together. Hug, roll, legs.`, '713'); } },
      { label: `Sure, go ahead.`, next: 'bea_b', fx: (s, A) => { s.p['713'].k.talked = s.t; A.judge('713-sternal', 'safety', -1, `You let Mrs. Holloway push up with her arms.`, `Sternal precautions: no pushing or pulling with the arms while the breastbone heals.`, '713'); } },
      { label: `Best to stay lying back today. You just had heart surgery.`, next: 'bea_c', fx: (s, A) => { s.p['713'].k.talked = s.t; A.judge('713-sternal', 'safety', 0, `You kept Mrs. Holloway flat instead of moving her safely.`, `Day one after bypass she should be sitting up and getting to the chair. Move her, just the right way.`, '713'); } },
    ] },
    bea_a: { who: '713', text: `She hugs the pillow and rolls. "Like getting out of a car in a pencil skirt." She's up. "Oh, that's clever."` },
    bea_b: { who: '713', text: `She pushes up on her arms and gasps. "Oh! That pulled."` },
    bea_c: { who: '713', text: `"Oh. All right." She settles back, a little disappointed.` },
    bea_heavy: { who: '713', text: `"I feel heavy, dear. Like something's sitting on my chest. Not the incision; different. And I'm dizzy." Her hand is cold in yours.` },
    bea_after: { who: '713', text: `"Shall I tell you about the bear who couldn't sleep? The children loved that one." She tells you the first page from memory.` },

    jo_talk: { who: '714', text: `You tell him your name and what you're doing: turning him, mouth care, that Abena is here. He doesn't respond. You keep talking to him anyway.` },
    ab_talk: { who: 'abena', pid: '714', text: `Abena holds his hand. "Kofi says he just needs more time. The neurologist said 'very poor.' Is there any chance? You're with him every day. Tell me what you see."`, choices: [
      { label: `I'll tell you what I see: he doesn't respond to my voice or to pain, and the only reflex left is a weak cough. That fits what the neurologist found. Dr. Siddiqui will go through all of it at 10:30, and I'll be there with you.`, next: 'ab_a', fx: (s, A) => { s.p['714'].k.ab = s.t; A.judge('714-ab', 'comm', 2, `You answered Abena honestly about what you see.`, `Families need truthful, plain information from the person at the bedside. Prognosis is the doctor's to give, but what you observe is yours to share.`, '714'); } },
      { label: `Miracles happen. Keep praying.`, next: 'ab_b', fx: (s, A) => { s.p['714'].k.ab = s.t; A.judge('714-ab', 'comm', -2, `You offered Abena false hope.`, `It feels kind, and it makes the 10:30 meeting harder. Honesty, with compassion, respects her faith and her decision.`, '714'); } },
      { label: `You'll have to ask the doctor.`, next: 'ab_c', fx: (s, A) => { s.p['714'].k.ab = s.t; A.judge('714-ab', 'comm', -1, `You deflected Abena's question.`, `You can't give a prognosis, but you can say what you see at the bedside and promise to be at the meeting.`, '714'); } },
    ] },
    ab_a: { who: 'abena', pid: '714', text: `She nods slowly. "That's what I see too. I needed someone to say it." She squeezes his hand.` },
    ab_b: { who: 'abena', pid: '714', text: `"Yes." She closes her eyes. "Yes, we'll pray."` },
    ab_c: { who: 'abena', pid: '714', text: `"Everyone says that." She looks back at him.` },
    kofi_meet: { who: 'kofi', pid: '714', text: `In the hallway after the meeting, Kofi stops you. "So that's it? There's nothing more you can do for him?"`, choices: [
      { label: `We can't make his brain recover. What we can do is a lot: keep him comfortable, make sure he isn't suffering, and make sure all of you can be with him. That's still care, and we'll keep giving it.`, next: 'kofi_a', fx: (s, A) => { const P = s.p['714']; P.kofiMeet = true; P.nothing = 'good'; A.judge('714-nothing', 'comm', 2, `You told Kofi what care continues.`, `"There's nothing more we can do" is never true. Comfort, dignity and presence are active care.`, '714'); } },
      { label: `I'm sorry. There's nothing more we can do.`, next: 'kofi_b', fx: (s, A) => { const P = s.p['714']; P.kofiMeet = true; P.nothing = 'bad'; A.judge('714-nothing', 'comm', -2, `You told Kofi there was nothing more you could do.`, `Families hear abandonment. We stop treatments that won't help; we never stop caring.`, '714'); } },
      { label: `Maybe the doctors are wrong. We could ask for another opinion.`, next: 'kofi_c', fx: (s, A) => { const P = s.p['714']; P.kofiMeet = true; P.nothing = 'hope'; A.judge('714-nothing', 'comm', -1, `You suggested the prognosis might be wrong.`, `Second opinions are his right to ask for, but suggesting the findings are wrong when they aren't gives false hope.`, '714'); } },
    ] },
    kofi_a: { who: 'kofi', pid: '714', text: `He leans on the wall. "He'd hate this. The machines. He'd say 'turn off the engine, it's done.'" He wipes his face. "Okay."` },
    kofi_b: { who: 'kofi', pid: '714', text: `"Then why is he still here?" He walks away fast.` },
    kofi_c: { who: 'kofi', pid: '714', text: `"So maybe we shouldn't stop." He looks at you hard. Abena calls his name from the room.` },
    ab_don: { who: 'abena', pid: '714', text: `Abena says quietly, "Ama asked me something. Joseph has the heart on his driver's license. Can he still give? Should we ask someone?"`, choices: [
      { label: `I'm glad you asked. There's a team whose job is to talk with families about donation, and they'll know what's possible for him. I'll let them know you'd like to talk.`, next: 'ab_d', fx: (s, A) => { const P = s.p['714']; P.don = 'good'; A.judge('714-don', 'comm', 2, `You answered the donation question by connecting the family to the OPO.`, `The nurse doesn't discuss donation details or ask for consent. The OPO's designated requester does, once they know if he's a candidate.`, '714'); } },
      { label: `Yes, I'll get the forms and we can go over what can be donated.`, next: 'ab_e', fx: (s, A) => { const P = s.p['714']; P.don = 'bad'; A.judge('714-don', 'comm', -2, `You started the donation conversation yourself.`, `Only the OPO's trained requester discusses donation and consent with families. He may not even be a candidate.`, '714'); } },
      { label: `He's too sick to donate.`, next: 'ab_f', fx: (s, A) => { const P = s.p['714']; P.don = 'bad'; A.judge('714-don', 'comm', -1, `You told the family he couldn't donate.`, `That isn't the nurse's call. Only the OPO can say whether he's a candidate.`, '714'); } },
    ] },
    ab_d: { who: 'abena', pid: '714', text: `"Thank you. He'd like that we asked." She strokes his hand.` },
    ab_e: { who: 'abena', pid: '714', text: `Kofi, from the window: "Wait. Is that what this is about?"` },
    ab_f: { who: 'abena', pid: '714', text: `"Oh." Ama, beside her, looks down.` },
    ab_dying: { who: 'abena', pid: '714', text: `"His breathing is changing. What's going to happen? Is he suffering?"`, choices: [
      { label: `His breathing may slow, with long pauses, and sound noisy. His hands and knees may turn mottled and cool. That's the body slowing down; it isn't pain. If he looks uncomfortable, I'll give him medicine right away. Keep talking to him.`, next: 'ab_g', fx: (s, A) => { const P = s.p['714']; P.dying = true; A.judge('714-dying', 'comm', 2, `You explained to Abena what dying looks like.`, `Families who know what to expect are less frightened by it: the pauses, the noisy breathing, the color changes. And they need to hear that you are watching for distress.`, '714'); } },
      { label: `He'll go peacefully in a few minutes.`, next: 'ab_h', fx: (s, A) => { const P = s.p['714']; P.dying = true; A.judge('714-dying', 'comm', -1, `You predicted a time and a peaceful course.`, `It can take minutes or days. A wrong prediction becomes something the family carries.`, '714'); } },
      { label: `I can't say.`, next: 'ab_i', fx: (s, A) => { const P = s.p['714']; P.dying = true; A.judge('714-dying', 'comm', -1, `You didn't explain what to expect.`, `You know the signs. Sharing them is part of the care.`, '714'); } },
    ] },
    ab_g: { who: 'abena', pid: '714', text: `She nods and leans close to his ear, speaking softly in Twi.` },
    ab_h: { who: 'abena', pid: '714', text: `An hour later he's still breathing. She keeps looking at you.` },
    ab_i: { who: 'abena', pid: '714', text: `She grips his hand harder.` },
    ab_after: { who: 'abena', pid: '714', text: `"He used to whistle the same three hymns under every bus." She hums one. Kofi joins in, off key.` },
  };

  /* ---------- events ---------- */
  const A0 = (s) => Object.keys(s.p).every((id) => s.p[id].seenAt === null);
  const events = [
    { id: 'tech-hi', when: (s) => s.t >= 3, run(s, A) { A.msg({ from: 'tomas', text: `Morning. I've got 711 to 714 with you. I can do vitals, turns, I&Os and sugars on whoever's stable. 713's sugar is due.`, replies: [{ label: 'Open tasks for Tomas', act: 'delegate' }] }); } },
    { id: 'rt-abg', when: (s) => s.t >= 8, run(s, A) { A.msg({ from: 'jonah', pid: '712', text: `712's 05:00 gas: pH 7.30, CO₂ 52, bicarb 25, PaO₂ 72 on 400 and 26, plateau 28. The night resident wondered about bumping his tidal volume to blow off the CO₂. What do you think?`, replies: [{ label: 'Acute respiratory acidosis, no compensation yet. pH 7.30 is acceptable: keep 6 mL/kg and plateau 30 or less', act: 'abg-ok' }, { label: 'Go to 600 mL to bring the CO₂ down', act: 'abg-vt' }, { label: 'It\'s a metabolic acidosis. Ask for bicarbonate', act: 'abg-met' }] }); } },
    { id: 'rad-cxr', when: (s) => s.t >= 20, run(s, A) { A.addLab('711', { name: 'Chest x-ray (line placement), final', val: 'Right IJ tip at the cavoatrial junction. No pneumothorax.', unit: '', ref: '', flag: '' }); A.msg({ from: 'rad', pid: '711', text: `Final read on 711 Kowalski's line x-ray is in the chart.` }); } },
    { id: 'rt-sat', when: (s) => s.t >= 25 && !s.p['712'].sedOff && !s.p['712'].arrest, run(s, A) { A.msg({ from: 'jonah', pid: '712', text: `Ready for 712's SAT and SBT when you are. Still FiO₂ 0.6, PEEP 12, sats 91.`, replies: [{ label: 'SAT only. He fails the SBT screen on FiO₂ and PEEP. I\'ll pause sedation and stay with him', act: 'sat-only' }, { label: 'Let\'s do both: I\'ll pause sedation, you put him on 5 and 5', act: 'sat-both' }, { label: 'Skip both today. He\'s too sick', act: 'sat-none' }] }); } },
    { id: 'tu-sbt-off', when: (s) => s.p['712'].sbtOn && s.t >= s.p['712'].sbtAt + 6, run(s, A) { s.p['712'].sbtOn = false; A.msg({ from: 'jonah', pid: '712', text: `Put 712 back on 60 and 12. He desatted to 83 on 5 and 5. It'll take a while to get those lungs back open.` }); } },
    { id: 'tu-agit', when: (s) => { const P = s.p['712']; return P.sedOff && !P.resedated && !P.arrest && tuRASS(s, P) >= 1; }, run(s, A) { s.p['712'].agitAt = s.t; A.msg({ from: 'tomas', pid: '712', urgent: true, text: `712's awake and grabbing at his tube! Michael's trying to hold his hand.`, replies: [{ label: 'Go to 712', act: 'goto', pid: '712' }] }); } },
    { id: 'tu-selfext', when: (s) => { const P = s.p['712']; return P.agitAt !== null && !P.resedated && !P.restrained && !P.arrest && !P.selfExt && tuRASS(s, P) >= 1 && s.t - P.agitAt >= (P.alts ? 40 : 25); }, run(s, A) { const P = s.p['712']; P.selfExt = true; P.selfExtAt = s.t; P.resedated = true; A.judge('712-selfext', 'safety', -3, `Mr. Pham pulled out his breathing tube.`, `Lightened, delirious, in pain, and nothing changed for ${s.t - P.agitAt} minutes: reorientation, analgesia, half-dose sedation, and if still needed a restraint order were all available.`, '712'); A.msg({ from: 'nova', pid: '712', urgent: true, text: `712 self-extubated. SpO₂ 70%. Anesthesia reintubated him; he's back on the vent at 100%.` }); } },
    { id: 'fr-site', when: (s) => { const P = s.p['711']; return s.t >= 60 && P.site === 'peri' && !P.extFound && !P.away; }, run(s, A) { A.msg({ from: 'tomas', pid: '711', text: `711's left arm looks pale and cold around the IV where his drip's running. Is that normal?`, replies: [{ label: 'No. I\'m coming to look at it now', act: 'goto', pid: '711' }, { label: 'Probably just cold in here. Put a blanket over it', act: 'fr-blanket' }] }); } },
    { id: 'lab-lac', when: (s) => { const P = s.p['711']; return P.lacDrawn !== null && s.t >= P.lacDrawn + 20; }, run(s, A) { const P = s.p['711']; A.addLab('711', { name: 'Lactate', val: P.lac2, unit: 'mmol/L', ref: 'under 2.0', flag: 'H' }); A.msg({ from: 'lab', pid: '711', text: `Repeat lactate resulted for 711 Kowalski.` }); } },
    { id: 'fr-injury', when: (s) => { const P = s.p['711']; return !P.injury && P.ext >= 1; }, run(s, A) { const P = s.p['711']; P.injury = true; A.judge('711-injury', 'safety', -3, `Mr. Kowalski's forearm was injured by extravasated norepinephrine.`, `Peripheral norepinephrine ran into the tissue for over an hour. A confirmed central line was available from 07:20; the site needed hourly checks.`, '711'); A.msg({ from: 'nova', pid: '711', urgent: true, text: `711's left forearm is white and blistering around the IV, and his MAP's in the 50s. The norepi's been going into his arm. Get it on the central line and call Siddiqui.` }); } },
    { id: 'bea-ct', when: (s) => { const P = s.p['713']; return s.t >= 95 && P.tamp >= .2 && P.called === null && !P.gone; }, run(s, A) { A.msg({ from: 'tomas', pid: '713', text: `713's chest tubes put out almost nothing this hour, and she says she feels heavy. Bleeding's finally stopped, right?`, replies: [{ label: 'Not necessarily. I\'m coming to look at her', act: 'goto', pid: '713' }, { label: 'Good news. Let her rest', act: 'bea-good' }] }); } },
    { id: 'ir-consent', when: (s) => s.t >= 100, run(s, A) { A.msg({ from: 'ir', pid: '711', text: `IR here. We're set for 711 Kowalski at 10:00. Is the consent signed?`, replies: [{ label: 'Not yet. He\'s drowsy and can\'t tell me what the procedure is. His wife Linda is here; please have your physician get consent from her as his surrogate. I\'ll witness', act: 'cons-surr' }, { label: 'I\'ll have him sign it. He\'s awake enough to hold a pen', act: 'cons-pt' }, { label: 'I\'ll explain the procedure to Linda and have her sign', act: 'cons-rn' }] }); } },
    { id: 'tu-plug', when: (s) => { const P = s.p['712']; return s.t >= 135 && !P.arrest && !P.selfExt; }, run(s, A) { const P = s.p['712']; P.plugOn = true; P.plugAt = s.t; P.plug = .2; A.msg({ from: 'jonah', pid: '712', urgent: true, text: `712's alarming high pressure, peaks in the 50s, SpO₂ 85 and dropping. I'm stuck on the other side of the unit. Can you get in there?`, replies: [{ label: 'Go to 712', act: 'goto', pid: '712' }, { label: 'He\'s probably fighting the vent. Silence it and bolus his propofol', act: 'plug-silence' }] }); } },
    { id: 'tu-arrest', when: (s) => { const P = s.p['712']; return P.plugOn && P.plug >= 1.5 && !P.arrest; }, run(s, A) { const P = s.p['712']; P.arrest = true; P.plugOn = false; P.plug = 0; P.cleared = null; A.judge('712-arrest', 'safety', -3, `Mr. Pham had a hypoxic cardiac arrest from a mucus plug.`, `High-pressure alarm, falling saturation, a stiff bag: DOPE. Bag, check the tube, suction. The plug was a catheter's length away.`, '712'); A.msg({ from: 'nova', pid: '712', urgent: true, text: `Code blue 712. PEA from hypoxia. Jonah got a catheter down and pulled a huge plug; ROSC after 4 minutes. He's back on the vent at 100%.` }); } },
    { id: 'bea-af', when: (s) => { const P = s.p['713']; return s.t >= 200 && !P.gone && !P.af && (P.kGiven === null || P.mgGiven === null); }, run(s, A) { const P = s.p['713']; P.af = true; P.afAt = s.t; A.judge('713-af', 'safety', -2, `Mrs. Holloway went into atrial fibrillation.`, `Post-op AF is common after bypass, and low potassium and magnesium make it more likely. Her protocol was ready at 07:00.`, '713'); A.msg({ from: 'tomas', pid: '713', urgent: true, text: `713's monitor just changed: irregular, rate 130s. She says her heart's fluttering.` }); A.addOrder('713', `New AF: amiodarone 150 mg IV over 10 minutes, then infusion per protocol (started by the team). Replace K and Mg per protocol now.`); } },
    { id: 'bea-arrest', when: (s) => { const P = s.p['713']; return !P.gone && !P.reexp && P.tamp >= 1.35; }, run(s, A) { const P = s.p['713']; P.gone = true; P.arrest = true; P.arrestAt = s.t; P.goneText = 'Emergency resternotomy, then the OR'; A.judge('713-arrest', 'safety', -3, `Mrs. Holloway arrested from cardiac tamponade.`, `Chest tubes that stopped draining, a climbing heart rate and CVP, a falling, narrowing pressure, muffled heart sounds. Tamponade after heart surgery is fixed by opening the chest; it needed a STAT call.`, '713'); A.msg({ from: 'nova', pid: '713', urgent: true, text: `Code blue 713: PEA. Dr. Hale opened her chest at the bedside, a lot of clot around the heart. She's going to the OR.` }); } },
    { id: 'hale-here', when: (s) => { const P = s.p['713']; return P.called !== null && !P.gone && s.t >= P.called + 12; }, run(s, A) { A.msg({ from: 'hale', pid: '713', text: `At 713's bedside. Opening the lower sternal wound now${s.p['713'].prep ? '; thanks for the setup' : ''}.` }); } },
    { id: 'hale-done', when: (s) => { const P = s.p['713']; return P.called !== null && !P.gone && !P.reexp && s.t >= P.called + 25 - (P.prep ? 4 : 0); }, run(s, A) { const P = s.p['713']; P.reexp = true; P.reexpAt = s.t; A.msg({ from: 'hale', pid: '713', text: `Done. 450 mL of clot off the right atrium and a bleeder at a sternal wire. Tubes flushed and draining again. Watch her closely; call me for more than 100 an hour.` }); A.log('713', 'Bedside re-exploration: 450 mL clot evacuated, bleeding sternal wire site controlled.', 'act'); } },
    { id: 'fr-ir-go', when: (s) => { const P = s.p['711']; return s.t >= 180 && P.consent === 'surrogate' && P.awayAt === null && frMAP(P) >= 60 && P.site !== 'off'; }, run(s, A) { const P = s.p['711']; P.away = true; P.awayAt = s.t; P.oneToOne = true; A.msg({ from: 'ir', pid: '711', text: `Taking 711 Kowalski down to IR with his drips on transport. Linda's coming to the waiting room.` }); } },
    { id: 'fr-ir-back', when: (s) => { const P = s.p['711']; return P.away === true && s.t >= P.awayAt + 45; }, run(s, A) { const P = s.p['711']; P.away = null; P.oneToOne = false; P.srcDone = true; A.msg({ from: 'ir', pid: '711', text: `711 is back. Left nephrostomy in, frank pus drained, cultures sent. MAP held during. Over to you.` }); } },
    { id: 'fr-ir-delay', when: (s) => { const P = s.p['711']; return s.t >= 185 && P.awayAt === null && !P.irDelayed && P.consent !== 'surrogate'; }, run(s, A) { const P = s.p['711']; P.irDelayed = true; A.judge('711-ir-delay', 'comm', -2, `Mr. Kowalski's source control was delayed.`, `No valid consent from someone with capacity or authority means no procedure. An obstructed, infected kidney is the source of his shock.`, '711'); A.msg({ from: 'ir', pid: '711', text: `We can't take 711 without a valid consent. He's bumped to this afternoon.` }); } },
    { id: 'jo-pastor', when: (s) => s.t >= 150, run(s, A) { A.msg({ from: 'tomas', pid: '714', text: `714's wife asked me if their pastor can come at 11, and if the whole family can be in the room to pray and sing. There are about eleven of them.`, replies: [{ label: 'Yes. I\'ll bring chairs, let the front desk know, and make room. Ask her what else matters to them', act: 'pastor-yes' }, { label: 'Two visitors at a time is the policy', act: 'pastor-two' }] }); } },
    { id: 'jo-kofi', when: (s) => s.t >= 165 && !s.p['714'].meetDone, run(s, A) { A.msg({ from: 'kofi', pid: '714', text: `I'm his son. I'm not letting them pull the plug on my father. My mother doesn't get to decide this alone.`, replies: [{ label: 'Your mother is his legal decision-maker as his wife, but the question for all of you is what he would want, and he wrote some of that down. Please come to the 10:30 meeting; I\'ll be there, with the chaplain', act: 'kofi-surr' }, { label: 'You all get an equal say. Majority decides', act: 'kofi-vote' }, { label: 'That\'s between you and your mother', act: 'kofi-out' }] }); } },
    { id: 'jo-meet', when: (s) => s.t >= 205 && !s.p['714'].meetDone, run(s, A) { A.msg({ from: 'siddiqui', pid: '714', text: `Starting the Mensah family meeting in the conference room in five minutes. Palliative and chaplain are here. Can you join us?`, replies: [{ label: 'Go to 714', act: 'goto', pid: '714' }] }); } },
    { id: 'jo-opo-nova', when: (s) => s.t >= 200 && s.p['714'].opo === null && !s.p['714'].meetDone, run(s, A) { const P = s.p['714']; P.novaOpo = true; A.judge('714-opo-late', 'judgment', -2, `Mr. Mensah's OPO referral hadn't been made by the time of the family meeting.`, `He met the trigger (GCS 5 or less on a ventilator) last night. The referral comes before anyone discusses withdrawal with the family.`, '714'); A.msg({ from: 'nova', pid: '714', urgent: true, text: `Before Siddiqui talks withdrawal with 714's family: has anyone called the OPO? He met the trigger last night. Call it now, before the meeting.` }); } },
    { id: 'jo-meet-miss', when: (s) => s.t >= 240 && !s.p['714'].meetDone, run(s, A) { const P = s.p['714']; P.meetDone = true; P.meetMissed = true; P.kofiMeet = P.kofiMeet || false; A.judge('714-meeting', 'comm', -2, `You weren't at Mr. Mensah's family meeting.`, `The nurse knows the family and the bedside better than anyone at the table. Prepare them, be there, clarify, and stay after.`, '714'); decide(s, A, P); A.msg({ from: 'siddiqui', pid: '714', text: `We met without you. They've chosen comfort care; extubation after the pastor comes. Orders are in. Kofi's struggling.` }); } },
    { id: 'jo-son', when: (s) => { const P = s.p['714']; return P.decision !== null && s.t >= P.decision + 10 && s.t <= 285; }, run(s, A) { A.msg({ from: 'kofi', pid: '714', text: `Can I ask you something, just us? You can't let him suffer. Can't you just give him enough morphine to end it? Nobody would have to know.`, replies: [{ label: 'I can\'t give medicine to end his life. I will give whatever he needs to be comfortable, even if it might slow his breathing; the goal is his comfort, never to hasten death. Can I ask the chaplain and Dr. Siddiqui to talk with you too?', act: 'son-de' }, { label: 'I\'ll give him a bigger dose when he\'s off the vent. It\'s kinder', act: 'son-yes' }, { label: 'That\'s euthanasia. I could report you for asking', act: 'son-no' }] }); } },
    { id: 'jo-dist', when: (s) => { const P = s.p['714']; return P.extAt !== null && s.t >= P.extAt + 6 && P.dist >= .3; }, run(s, A) { A.msg({ from: 'tomas', pid: '714', text: `714's breathing fast and the family says he looks like he's struggling.`, replies: [{ label: 'Go to 714', act: 'goto', pid: '714' }] }); } },
    { id: 'nova-idle', when: (s) => s.t >= 50 && s.t < 120 && A0(s), run(s, A) { A.msg({ from: 'nova', urgent: true, text: `It's almost eight and you haven't been in a room. A pressor, a vent, a fresh heart and a family. Go look.` }); } },
    { id: 'nova-30', when: (s) => s.t >= 270, run(s, A) { A.msg({ from: 'nova', text: `Thirty minutes to handoff. Rosa's coming on. Every drip rate, every vent setting, and where each family is.` }); } },
  ];

  const replies = {
    'abg-ok'(s, A) { s.p['712'].abg = true; A.judge('712-abg', 'judgment', 2, `You recognized acute respiratory acidosis and kept lung-protective settings.`, `pH 7.30 low, PaCO₂ 52 high, HCO₃ 25 normal: respiratory acidosis the kidneys haven't caught up with. In ARDS, permissive hypercapnia is accepted to keep tidal volume at 6 mL/kg and plateau at 30 or less; pH down to about 7.25 is usually tolerated.`, '712'); A.msg({ from: 'jonah', pid: '712', text: `Agreed. I'll tell the resident: rate before volume if the pH drops.` }); },
    'abg-vt'(s, A) { A.judge('712-abg', 'judgment', -2, `You suggested a tidal volume of 600 mL for Mr. Pham.`, `That's 9 mL/kg of predicted body weight. In ARDS, bigger breaths overstretch the healthy lung and raise mortality. A pH of 7.30 is an acceptable trade.`, '712'); A.msg({ from: 'jonah', pid: '712', text: `That's 9 per kilo. Not in ARDS. I'm leaving it at 400.` }); },
    'abg-met'(s, A) { A.judge('712-abg', 'judgment', -2, `You read Mr. Pham's gas as a metabolic acidosis.`, `The bicarbonate is normal and the CO₂ is high: it's respiratory.`, '712'); A.msg({ from: 'jonah', pid: '712', text: `Bicarb's 25. That's the CO₂.` }); },
    'sat-only'(s, A) { const P = s.p['712']; P.sbtPlan = 'sat'; A.judge('712-plan', 'judgment', 2, `You planned a SAT without an SBT for Mr. Pham.`, `He passes the SAT screen and fails the SBT screen (FiO₂ 0.6, PEEP 12). The pairing is the default; the screen decides what's safe today.`, '712'); A.msg({ from: 'jonah', pid: '712', text: `Agreed, he's not ready for 5 and 5. Pause the sedation when you're at his bedside.` }); },
    'sat-both'(s, A) { const P = s.p['712']; P.sbtPlan = 'both'; P.sbtTried = true; P.sbtOn = true; P.sbtAt = s.t; A.judge('712-sbt', 'safety', -2, `You asked for an SBT on Mr. Pham with FiO₂ 0.6 and PEEP 12.`, `He fails the SBT safety screen. Dropping PEEP from 12 to 5 collapses recruited lung.`, '712'); },
    'sat-none'(s, A) { const P = s.p['712']; P.sbtPlan = 'none'; A.judge('712-plan', 'judgment', -1, `You skipped Mr. Pham's SAT.`, `He passes the SAT screen. RASS -3 is deeper than his goal; a daily sedation vacation is how you find his lightest safe dose.`, '712'); },
    'fr-blanket'(s, A) { const P = s.p['711']; P.ext += .1; A.judge('711-blanket', 'judgment', -2, `You put Mr. Kowalski's pale, cold IV arm down to the room temperature.`, `A pale, cold patch around a peripheral vasopressor is extravasation until you've looked.`, '711'); },
    'bea-good'(s, A) { s.p['713'].pullAsked = true; A.judge('713-good', 'judgment', -2, `You took the drop in Mrs. Holloway's chest tube output as good news.`, `Output that stops suddenly after cardiac surgery, with new symptoms, means blood may be collecting around the heart. Look before you reassure.`, '713'); },
    'cons-surr'(s, A) { const P = s.p['711']; P.consent = 'surrogate'; A.judge('711-consent', 'judgment', 2, `You arranged surrogate consent for Mr. Kowalski's nephrostomy.`, `He lacks capacity for this decision today. Informed consent is the physician's to obtain; his wife is his surrogate; the nurse can witness the signature and make sure her questions are answered.`, '711'); A.msg({ from: 'ir', pid: '711', text: `Dr. Lam talked it through with Linda by phone and in person; she signed, you witnessed. See you at ten.` }); },
    'cons-pt'(s, A) { const P = s.p['711']; P.consent = 'patient'; A.judge('711-consent', 'judgment', -2, `You had Mr. Kowalski sign his own consent.`, `Drowsy and oriented only to himself, he can't understand or weigh the procedure. A signature without capacity isn't consent.`, '711'); A.msg({ from: 'ir', pid: '711', text: `Our physician saw him; he couldn't say what the procedure was. That signature won't stand. Who's his surrogate?`, replies: [{ label: 'His wife Linda. Please get consent from her; I\'ll witness', act: 'cons-surr2' }] }); },
    'cons-rn'(s, A) { const P = s.p['711']; P.consent = 'nurse'; A.judge('711-consent', 'judgment', -1, `You planned to obtain the consent yourself.`, `Explaining the risks and alternatives of a procedure is the physician's job. The nurse witnesses the signature and checks understanding.`, '711'); A.msg({ from: 'ir', pid: '711', text: `Our physician has to do the consent conversation. We'll talk with Linda.`, replies: [{ label: 'Thanks. I\'ll be there to witness', act: 'cons-surr2' }] }); },
    'cons-surr2'(s, A) { s.p['711'].consent = 'surrogate'; },
    'plug-silence'(s, A) { const P = s.p['712']; P.silenced = true; P.plug += .2; A.judge('712-silence', 'safety', -3, `You had Mr. Pham's high-pressure alarm silenced and his sedation bolused.`, `A high-pressure alarm with a falling saturation needs eyes on the patient: DOPE. Sedation can't clear a plug.`, '712'); },
    'pastor-yes'(s, A) { s.p['714'].pastor = 'yes'; A.judge('714-pastor', 'comm', 1, `You made room for the Mensah family's faith and their numbers.`, `At the end of life, visiting rules bend. Ask what matters to the family: prayer, song, who should be there.`, '714'); },
    'pastor-two'(s, A) { s.p['714'].pastor = 'no'; A.judge('714-pastor', 'comm', -1, `You held the Mensah family to two visitors.`, `Policies have exceptions for a dying patient. Let them be together.`, '714'); },
    'kofi-surr'(s, A) { s.p['714'].kofi = 'good'; A.judge('714-kofi', 'comm', 2, `You explained the surrogate role and his father's wishes to Kofi.`, `With no agent named, his wife is his legal surrogate. The standard isn't who wins; it's what Joseph would want (substituted judgment). The meeting, the chaplain and, if needed, ethics help families get there together.`, '714'); },
    'kofi-vote'(s, A) { s.p['714'].kofi = 'bad'; A.judge('714-kofi', 'judgment', -2, `You told Kofi the family would vote.`, `Medical decisions aren't made by majority. There's a legal surrogate, and the question is what the patient would want.`, '714'); },
    'kofi-out'(s, A) { s.p['714'].kofi = 'meh'; A.judge('714-kofi', 'comm', -1, `You stepped away from Kofi's distress.`, `Conflict at the end of life is the nurse's business: listen, explain, bring in help.`, '714'); },
    'son-de'(s, A) { s.p['714'].son = 'good'; A.judge('714-son', 'judgment', 2, `You answered Kofi with the goal of comfort, not hastening death.`, `Double effect: medicine given to relieve suffering is right even if it might shorten life; medicine given to end life is not. Say it plainly, and bring in support for him.`, '714'); },
    'son-yes'(s, A) { s.p['714'].son = 'bad'; A.judge('714-son', 'judgment', -3, `You agreed to give Mr. Mensah morphine to hasten his death.`, `Intentionally hastening death is illegal and against the ANA Code of Ethics. Dose to relieve distress, never to end life.`, '714'); },
    'son-no'(s, A) { s.p['714'].son = 'meh'; A.judge('714-son', 'comm', -1, `You threatened Kofi with a report.`, `He's grieving and afraid of his father suffering. Answer the fear: promise comfort, refuse to hasten death, offer support.`, '714'); },
  };

  /* ---------- delegation (ICU tech) ---------- */
  const delegation = {
    note: () => `Tomas is the ICU tech: vitals, turns, I&Os, sugars and baths on stable patients. He doesn't titrate drips, suction tubes or assess.`,
    tasks: [
      { id: 'bg', label: 'Fingerstick glucose', rooms: ['713'], mins: 5 },
      { id: 'uo', label: 'Empty the Foley and record urine output', rooms: ['711', '712', '713', '714'], mins: 5 },
      { id: 'turn', label: 'Turn and reposition, float heels', rooms: ['712', '713', '714'], mins: 10 },
      { id: 'bath', label: 'Chlorhexidine bath', rooms: ['713', '714'], mins: 20 },
      { id: 'vitals', label: 'Take a manual set of vital signs', rooms: ['711', '712', '713', '714'], mins: 10 },
      { id: 'titrate', label: 'Turn the norepinephrine up if his MAP drops under 65', rooms: ['711'], mins: 0 },
      { id: 'suction', label: 'Suction his breathing tube', rooms: ['712', '714'], mins: 0 },
      { id: 'ct', label: 'Watch the chest tubes and decide if she needs the surgeon', rooms: ['713'], mins: 0 },
      { id: 'restrain', label: 'Put soft wrist restraints on him', rooms: ['712'], mins: 0 },
      { id: 'chairs', label: 'Bring chairs, water and tissues for the family', rooms: ['714'], mins: 5 },
    ],
    start(task, pid, s, A) {
      const nm = A.def(pid).short;
      if (task.id === 'titrate') { A.judge('deleg-titrate', 'deleg', -2, `You asked the ICU tech to titrate a vasopressor.`, `Titrating a high-alert drip takes a nurse's assessment every time. A tech can report a number; the decision is yours.`); return `Tomas: "I can't touch the pumps. I'll tell you if his pressure drops."`; }
      if (task.id === 'suction') { A.judge('deleg-suction', 'deleg', -1, `You asked the ICU tech to suction an endotracheal tube.`, `Airway suctioning on a ventilated patient belongs to the nurse or RT: it can drop the saturation and needs assessment before and after.`); return `Tomas: "That's you or Jonah. I'll grab Jonah."`; }
      if (task.id === 'ct') { A.judge('deleg-ct', 'deleg', -2, `You asked the ICU tech to decide whether a post-op patient needs the surgeon.`, `He can read the number on the chamber. Deciding what it means is assessment, and after heart surgery it's a nurse's job.`); return `Tomas: "I can write down the numbers. Deciding what they mean is yours."`; }
      if (task.id === 'restrain') { A.judge('deleg-restrain', 'deleg', -2, `You asked the ICU tech to put restraints on a patient.`, `Restraint needs an RN assessment, alternatives tried, and a provider order. A tech can help apply them with you, not decide.`); return `Tomas: "Not without you and an order."`; }
      if (task.id === 'turn' && pid === '712') { A.judge('deleg-turn-vent', 'deleg', -1, `You sent the tech alone to turn a patient on PEEP 12.`, `Turning a ventilated patient needs someone protecting the tube and watching the saturation: the nurse or RT at the head of the bed.`); return `Tomas: "I'll help, but someone needs to hold his tube. Grab me when you and Jonah are ready."`; }
      if (task.id === 'vitals' && (pid === '711' || pid === '712')) { A.judge('deleg-vitals-' + pid, 'deleg', -1, `You delegated vital signs on ${nm}, who isn't stable.`, pid === '711' ? `His MAP is driving a titration. The number and what it means are yours.` : `On a ventilator with a falling-out pattern, the vitals are part of an RN assessment. The tech can help, not replace it.`); return `Tomas: "I'll write down what the monitor says, but you'll want to see him yourself."`; }
      if (task.id === 'bath' && pid === '714' && s.p['714'].extAt !== null) return `Tomas: "Not now. The family's with him."`;
      if (s.deleg.filter((d) => !d.done).length >= 2) return `Tomas: "I've got two going. Give me a few minutes."`;
      s.deleg.push({ id: task.id, pid, due: s.t + task.mins, done: false, at: s.t });
      A.judge('deleg-good-' + task.id, 'deleg', 1, `You delegated ${task.label.toLowerCase()} to the ICU tech.`, 'Hand off the measurements and routine care on stable patients; keep the assessment and the drips.');
      return `Tomas: "On it: ${task.label.toLowerCase()} for ${nm}."`;
    },
    complete(d, s, A) {
      const nm = A.def(d.pid).short, P = s.p[d.pid];
      if (d.id === 'bg') { const v = Math.round(P.glu); P.lastBg = { t: s.t, val: v }; P.bgs.push({ t: s.t, val: v, by: 'Tomas (ICU tech)' }); A.msg({ from: 'tomas', pid: d.pid, text: `713's sugar is ${v}. Insulin's at ${P.ins}.` }); }
      else if (d.id === 'uo') A.msg({ from: 'tomas', pid: d.pid, text: `${nm}: ${d.pid === '711' ? Math.round(P.uo) : d.pid === '713' ? (P.tamp >= .4 ? 15 : 50) : 70} mL in the last hour.${d.pid === '711' && P.uo < 45 ? ' Dark.' : ''}` });
      else if (d.id === 'turn') { if (d.pid === '712') P.turnAt = s.t; A.msg({ from: 'tomas', pid: d.pid, text: `Turned ${nm}, heels floated.` }); }
      else if (d.id === 'bath') A.msg({ from: 'tomas', pid: d.pid, text: `CHG bath done for ${nm}. Skin looks good.` });
      else if (d.id === 'chairs') A.msg({ from: 'tomas', pid: d.pid, text: `Chairs, water and tissues in 714. I put a sign on the door.` });
      else if (d.id === 'vitals') { const v = A.recordVitals(d.pid, 'Tomas (ICU tech)'); A.msg({ from: 'tomas', pid: d.pid, text: `${nm}: HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}%.${d.pid === '713' && P.tamp >= .3 ? ' She says she feels heavy.' : ''}` }); }
    },
  };

  /* ---------- Nova ---------- */
  function novaHint(s, A) {
    const F = s.p['711'], T = s.p['712'], B = s.p['713'], J = s.p['714'];
    if (T.plugOn) return `High-pressure alarm and a falling saturation on a ventilator. Take the machine out of the picture first. Then: is the tube where it should be, and is it open?`;
    if (!B.gone && B.tamp >= .2 && B.called === null) return `After heart surgery, chest tubes that stop all at once aren't always good news. What are her heart rate, pressure and CVP doing?`;
    if (F.site === 'peri' && !F.extFound && s.t >= 50) return `A vasopressor has been running into a forearm vein all night. When did someone last look at that arm?`;
    if (F.site !== 'central' && s.t >= 20 && !F.cxrRead) return `A new line went in this morning. What has to happen before anyone can use it?`;
    if (J.opo === null && !J.meetDone) return `One of your patients met a referral trigger last night that has to be acted on before a family meeting. Read 714's unit policy order.`;
    if (!T.sedOff && !T.arrest) return `712 is deeper than his sedation goal and has a daily protocol due. What does the safety screen say?`;
    if (B.kGiven === null || B.mgGiven === null) return `713 has a nurse-initiated protocol waiting since 05:00.`;
    if (F.lacDrawn === null && s.t >= 50) return `711's resuscitation has a number due at 08:00 that tells you whether it's working.`;
    return `You're on top of it. Which family on your hall needs you next?`;
  }

  function endChecks(s, A) {
    A.c.patients.forEach((d) => {
      const P = s.p[d.id];
      if (P.seenAt === null && !P.gone) A.judge(d.id + '-unseen', 'assess', -3, `You never went into ${d.room} this shift.`, `In the ICU the monitor is not the patient.`, d.id);
      (d.meds || []).forEach((m) => { const st = s.meds[m.id]; if (m.due !== undefined && m.due <= Math.min(240, s.t - 60) && st.status === 'due' && !P.gone && !(d.id === '714' && P.decision !== null)) A.judge(m.id + '-missed', 'meds', -2, `${m.name} for ${d.short} (due ${clock(m.due)}) was never given or held.`, `Every scheduled dose needs a decision: given, or held with a reason.`, d.id); });
    });
    const F = s.p['711'], T = s.p['712'], B = s.p['713'], J = s.p['714'];
    if (F.site === 'peri' && !F.injury) A.judge('711-still-peri', 'safety', -1, `Mr. Kowalski's norepinephrine was still in a peripheral IV at handoff.`, `A confirmed central line was available from 07:20.`, '711');
    if (F.lacSeen && F.lac2 > 4.6 && !F.lacCalled) A.judge('711-lac-norep', 'comm', -2, `Mr. Kowalski's rising lactate never reached the intensivist.`, `A rising lactate is a call.`, '711');
    if (F.lacDrawn === null) A.judge('711-nolac', 'assess', -2, `Mr. Kowalski's repeat lactate was never drawn.`, `It was ordered for 08:00; it's how you know whether the resuscitation is working.`, '711');
    if (F.extFound && F.phentAt === null && !F.injury) A.judge('711-nophent', 'meds', -1, `The extravasation antidote was never given.`, `Phentolamine per protocol, ideally within 12 hours.`, '711');
    if (T.hob < 30 && !T.arrest) A.judge('712-hob-flat', 'safety', -1, `Mr. Pham's head of bed stayed flat all shift.`, `30 to 45 degrees is part of every VAP bundle.`, '712');
    if (!T.sedOff && !T.arrest && !T.selfExt) A.judge('712-nosat', 'judgment', -1, `Mr. Pham's SAT never happened.`, `He passed the SAT screen; daily interruption shortens time on the ventilator.`, '712');
    if (T.restrained && tuRASS(s, T) <= 0) A.judge('712-still-restrained', 'safety', -1, `Mr. Pham was still restrained at handoff while calm.`, `Restraints come off when the reason ends.`, '712');
    if (T.rAt !== null && !T.rNote) A.judge('712-nonote', 'comm', -1, `Mr. Pham's restraint episode was never charted.`, `Every restraint needs the order, the reason, what was tried and the monitoring in the record.`, '712');
    if (T.rAt !== null && !T.rOrder) A.judge('712-noorder', 'safety', -2, `Mr. Pham's restraints never had an order.`, `CMS requires a provider order for every restraint episode.`, '712');
    if (!B.gone && B.kGiven === null && B.mgGiven === null) A.judge('713-noprotocol', 'meds', -2, `Mrs. Holloway's electrolyte protocol was never started.`, `K 3.4 and Mg 1.7 after cardiac surgery: replace by protocol to protect against atrial fibrillation.`, '713');
    if (!B.gone && B.tamp >= .15 && B.called === null) A.judge('713-norep', 'comm', -3, `Mrs. Holloway's signs of tamponade never reached the surgeon.`, `Tubes that stop, a rising CVP and heart rate, a falling pressure: STAT call.`, '713');
    if (!B.gone && B.lastBg === null) A.judge('713-nobg', 'assess', -1, `Mrs. Holloway's glucose was never checked on her insulin infusion.`, `Hourly fingersticks drive the protocol.`, '713');
    if (J.opo === null) A.judge('714-noopo', 'judgment', -2, `Mr. Mensah was never referred to the OPO.`, `CMS requires timely referral of imminent deaths. The trigger was met last night.`, '714');
    if (J.decision !== null && !J.stopped) A.judge('714-nocomfort', 'judgment', -1, `Mr. Mensah's comfort orders weren't carried out.`, `Stop what doesn't help him; keep what does.`, '714');
    if (J.decision !== null && J.son === null && s.fired['jo-son'] !== undefined) A.judge('714-son-unanswered', 'comm', -1, `Kofi's question about morphine went unanswered.`, `A family member asking that is in distress. It needs an answer and support.`, '714');
    const keys = []; A.c.patients.forEach((d) => (d.report || []).forEach((r, i) => { if (r.key) keys.push(d.id + ':' + i); }));
    const hit = keys.filter((k) => s.brain.includes(k)).length;
    if (s.brain.length) { const noise = s.brain.length - hit, precise = hit / s.brain.length;
      if (noise >= 4 && precise < .7) A.judge('brain', 'assess', -1, `You flagged ${s.brain.length} lines in report, ${noise} of them noise.`, 'Flagging everything is the same as flagging nothing.');
      else A.judge('brain', 'assess', hit / keys.length >= 0.6 && precise >= .7 ? 1 : 0, `You flagged ${hit} of ${keys.length} critical cues during handoff${noise ? `, plus ${noise} that didn't matter` : ''}.`, `In the ICU, report is drips, devices, results and plans. The lines that matter change what you do in the first hour.`); }
  }

  const PREP = { '711-ne': ['vitals'], '711-phent': ['site'], '712-prop': ['vitals'], '712-fent': ['pain'], '713-ins': ['bg'], '713-meto': ['vitals'], '713-lasix': ['vitals'], '713-alb': ['vitals'], '714-morph': ['resp'] };
  [frank, tuan, bea, jo].forEach((d) => d.meds.forEach((m) => { if (PREP[m.id]) m.prep = PREP[m.id]; }));

  S.engine.registerCase({
    id: 'icu-3w-1', title: 'Days in the ICU', unit: '3 West ICU, Medical-Cardiac Intensive Care', unitShort: '3 West ICU', level: 'Specialty: Critical care', start: 7 * 60, length: 300, novaCredits: 3,
    card: 'Critical care until noon: septic shock on a pressor in the wrong line, a ventilator alarm, a chest tube that stops, and a family meeting.',
    hero: { head: 'Days, 3 West ICU. Four patients, two ventilators, one family meeting.', lede: 'Critical care, 07:00 to noon. Drips titrated to a number, a ventilator bundle, a fresh bypass, and a man who isn\'t going to wake up. The monitors show you a lot. They don\'t show you everything.' },
    intro: { time: '06:58', place: '3 West ICU', cta: 'Take report', beats: ['Bree is finishing nights and giving report at the central station, under a wall of monitors.', 'Four patients until noon: a pressor, a ventilator, a heart surgery from yesterday, and a family meeting at 10:30.', 'In the ICU, a good number can be the wrong goal, and a quiet tube can be the loudest finding in the room.'] },
    minutes: 25,
    sysLabels: { cardiac: 'Heart, hemodynamics and pulses', pain: 'Pain, sedation and delirium', gi: 'GI, GU, drains and output', skin: 'Skin, lines and sites' },
    handoffBy: 'Bree (night RN)', reportBy: 'bree', reportRole: 'night shift', provider: 'siddiqui', providerLabel: 'a provider', cna: 'tomas',
    staff: {
      nova: { name: 'Nova Reyes', role: 'Charge nurse', look: { skin: '#B98A63', shade: '#976D4B', lip: '#7C4435', blush: '#C77B5E', iris: '#3D2A1C', head: { w: 55, h: 62, jaw: .35 }, eye: 10, hair: { style: 'bun', color: '#3A2E2A', streak: true }, brow: { w: 3.6, color: '#2E2421' }, body: { w: 80, cloth: 'navy' }, extras: ['studs'], smile: .35 } },
      tomas: { name: 'Tomas', role: 'ICU tech', look: LK('#C99A72', '#A97B54', '#8E5246', '#CC8A70', '#2A1A10', 'curlyshort', '#1A1410', 'teal', [], .5) },
      bree: { name: 'Bree', role: 'Night RN', look: Object.assign(LK('#F2D6BE', '#D8B49A', '#B87068', '#EEA090', '#5A7A9A', 'ponytail', '#8A5A30', 'navy', ['studs']), { tired: true }) },
      siddiqui: { name: 'Dr. Siddiqui', role: 'Intensivist', look: LK('#C99A74', '#AA7C58', '#8E5246', '#C8866C', '#2A1B10', 'hijab', '#2C3E5A', 'coat', ['thinGlasses']) },
      hale: { name: 'Dr. Hale', role: 'Cardiac surgeon', look: LK('#EDCBAE', '#D2AA8B', '#AE665C', '#E69A86', '#43607A', 'short', '#8A7A6A', 'teal', []) },
      jonah: { name: 'Jonah', role: 'Respiratory therapist', look: LK('#8A5A3C', '#6E4530', '#6A3A2C', '#A8604A', '#1E130C', 'buzz', '#140E0A', 'grey', ['beard']) },
      linda: { name: 'Linda', role: 'Wife, 711', look: LK('#EBC9AE', '#CFA88C', '#A9655B', '#E2958A', '#4E6E8E', 'bob', '#C8C2BA', 'blouse', ['glasses', 'wrinkles'], .2) },
      michael: { name: 'Michael', role: 'Partner, 712', look: LK('#E6C29C', '#C79E76', '#A8625A', '#DE9380', '#3A2A1C', 'short', '#6B4B2E', 'teal', ['beard']) },
      abena: { name: 'Abena', role: 'Wife, 714', look: LK('#6A4330', '#4F301F', '#4D2A20', '#9C5642', '#1A100A', 'hijab', '#7A3E5A', 'plum', ['gold'], .1) },
      kofi: { name: 'Kofi', role: 'Son, 714', look: LK('#5E3A27', '#47291B', '#4A2418', '#86493A', '#1A100A', 'short', '#140E0A', 'tee', ['goatee']) },
      lab: { name: 'Lab', role: 'Laboratory', look: null },
      rad: { name: 'Radiology', role: 'Reading room', look: null },
      ir: { name: 'IR', role: 'Interventional radiology', look: null },
    },
    patients: [frank, tuan, bea, jo],
    dueExtras(s) {
      const out = [], F = s.p['711'], T = s.p['712'], B = s.p['713'], J = s.p['714'];
      if (!F.away) {
        if (F.site === 'peri') { const last = F.k.site === undefined ? -60 : F.k.site; out.push({ t: last + 60, late: s.t > last + 75, tab: 'care', hl: 'peripheral IV site', text: '711 Peripheral pressor site check (hourly)' }); }
        if (s.t >= 20 && !F.cxrRead && F.site !== 'central') out.push({ t: 20, late: s.t > 50, tab: 'care', hl: 'chest x-ray', text: '711 Line x-ray resulted: read before using the central line' });
        if (F.extFound && !F.periStopped) out.push({ t: F.extAt || s.t, late: s.t > (F.extAt || s.t) + 10, tab: 'care', hl: 'Extravasation', text: '711 Extravasation: stop the infusion at the site' });
        if (F.site === 'off') out.push({ t: F.periAt || s.t, late: s.t > (F.periAt || s.t) + 5, tab: 'care', hl: 'central line', text: '711 Norepinephrine off: restart through the central line' });
        if (F.lacDrawn === null && s.t >= 40 && !F.away) out.push({ t: 60, late: s.t > 80, tab: 'care', hl: 'repeat lactate', text: '711 Repeat lactate due' });
        if (F.lac2 !== null && s.t >= F.lacDrawn + 20 && !F.lacSeen) out.push({ t: F.lacDrawn + 20, late: s.t > F.lacDrawn + 45, tab: 'care', hl: 'Review the repeat lactate', text: '711 Repeat lactate resulted' });
        if (F.srcDone && !F.postIR) out.push({ t: F.awayAt + 45, late: s.t > F.awayAt + 65, tab: 'care', hl: 'Post-procedure', text: '711 Post-procedure check after IR' });
      }
      if (!T.arrest) {
        if (!T.sedOff && !T.selfExt) out.push({ t: 60, late: s.t > 90, tab: 'care', hl: 'Sedation awakening trial', text: '712 Daily SAT and SBT: screen first' });
        if (T.hob < 30) out.push({ t: 0, late: s.t > 30, tab: 'care', hl: 'head of the bed', text: '712 Head of bed 30 to 45 degrees' });
        if (s.t - T.turnAt >= 90 && !T.plugOn) out.push({ t: T.turnAt + 120, late: s.t > T.turnAt + 140, tab: 'care', hl: 'Turn him', text: '712 Turn every 2 hours' });
        if (T.restrained) { const last = T.rChecks.length ? T.rChecks[T.rChecks.length - 1] : T.rAt; out.push({ t: last + (T.rChecks.length ? 120 : 15), late: s.t > last + (T.rChecks.length ? 135 : 30), tab: 'care', hl: 'Restraint check', text: '712 Restraint check' }); }
        if (T.rAt !== null && !T.rNote) out.push({ t: T.rAt + 30, late: s.t > T.rAt + 90, tab: 'care', hl: 'restraint note', text: '712 Chart the restraint note' });
      }
      if (!B.gone) {
        const nb = (B.lastBg ? B.lastBg.t : -60) + 60; out.push({ t: nb, late: s.t > nb + 20, tab: 'care', hl: 'Fingerstick glucose', text: '713 Fingerstick glucose (insulin infusion, hourly)' });
        if (B.kGiven === null || B.mgGiven === null) out.push({ t: 0, late: s.t > 60, tab: 'meds', hl: B.kGiven === null ? 'Potassium chloride' : 'Magnesium', text: '713 K 3.4, Mg 1.7: electrolyte protocol' });
        const nc = (B.ctSeen === null ? -30 : B.ctSeen) + 60; out.push({ t: nc, late: s.t > nc + 20, tab: 'care', hl: 'chest tubes', text: '713 Chest tube output (hourly)' });
        if (B.reexp && !B.reassessed && s.t - B.reexpAt >= 10) out.push({ t: B.reexpAt + 10, late: s.t > B.reexpAt + 30, tab: 'care', hl: 'Reassess after', text: '713 Reassess after re-exploration' });
      }
      if (J.opo === null) out.push({ t: 0, late: s.t > 60, tab: 'care', hl: 'organ procurement', text: '714 GCS 3 on a ventilator: OPO referral (unit policy)' });
      if (!J.meetDone && s.t >= 150) out.push({ t: 210, late: false, info: true, text: '714 Family meeting at 10:30' });
      if (J.decision !== null && !J.stopped) out.push({ t: J.decision, late: s.t > J.decision + 30, tab: 'care', hl: 'comfort orders', text: '714 Carry out the comfort orders' });
      return out;
    },
    replies,
    priority: {
      judge(r, A) {
        if (r[0] === '711') A.judge('rank-first', 'priority', 2, `You chose to see Mr. Kowalski first.`, `In shock, on a vasopressor in a peripheral vein, with a central line waiting on an x-ray and a lactate due: the least stable patient, and the one whose next hour you can change most.`, '711');
        else if (r[0] === '712') A.judge('rank-first', 'priority', 1, `You chose to see Mr. Pham first.`, `Reasonable: on 60% oxygen with thick secretions. But he's stable on the ventilator right now; Mr. Kowalski's pressure depends on a drip in the wrong place.`, '711');
        else A.judge('rank-first', 'priority', -1, `You put ${A.def(r[0]).short} first, ahead of the patient in shock.`, `Unstable hemodynamics first, then the ventilator, then the fresh post-op, then the meeting that's hours away.`, '711');
      },
      correct: ['711', '712', '713', '714'],
      why: {
        '711': `Septic shock: MAP mid-60s on norepinephrine running in a forearm vein, a central line not yet cleared, a lactate due. Unstable now.`,
        '712': `ARDS on FiO₂ 0.6 and PEEP 12 with thick secretions and a plug overnight. Stable on the vent, little reserve.`,
        '713': `Day one after bypass, extubated, chest tubes trending down, electrolytes low. Stable for now, high risk.`,
        '714': `Comfortable on the ventilator. The work is a referral and a meeting, both today, neither in the next ten minutes.`,
      },
    },
    events, delegation, dialogs, novaHint, endChecks,
    tick(s, A) {
      const F = s.p['711'];
      if (F.site === 'peri' && s.t >= 35) F.ext = clamp(F.ext + .012, 0, 1.5);
      else if (F.periStopped) F.ext = Math.max(F.injury ? F.ext : 0, F.ext - (F.phentAt !== null ? .004 : .001));
      if (F.srcDone) F.sev = Math.max(.85, F.sev - .004); else F.sev = Math.min(1.4, F.sev + .0011);
      F.bpDrop = Math.max(0, F.bpDrop - .06);
      if (!F.away) {
        const m = frMAP(F);
        if (m < 65) F.lowMap += 1;
        if (m < 55) { F.crashMin += 1; if (F.crashMin >= 15 && !F.crash) { F.crash = true; A.judge('711-crash', 'safety', -3, `Mr. Kowalski's MAP stayed under 55 for 15 minutes.`, `A MAP that low starves the kidneys, gut and brain. The pressor needs to be running into a vein, at the dose the MAP calls for.`, '711'); } }
        const tgt = m >= 65 ? (F.srcDone ? 60 : 42) : 18; F.uo += (tgt - F.uo) * .03;
      }
      const T = s.p['712'];
      if (T.plugOn && !T.arrest) T.plug = clamp(T.plug + (T.bagged ? .045 : .07) + (T.silenced ? .02 : 0), 0, 2);
      const B = s.p['713'];
      if (!B.gone) {
        if (s.t >= 75 && !B.reexp) B.tamp = clamp(B.tamp + (B.albGiven ? .011 : .012), 0, 2);
        if (B.reexp) B.tamp = Math.max(0, B.tamp - .05);
        B.glu = Math.max(60, B.glu + (.9 - .4 * B.ins));
      }
      const J = s.p['714'];
      if (J.extAt !== null) { J.dist = clamp(J.dist + (J.morphUp ? .004 : J.premed ? .006 : .012), 0, 1); J.sec = clamp(J.sec + .012, 0, 1); }
    },
  });
})(window.Shift);
