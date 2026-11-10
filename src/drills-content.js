/* The Shift — drill content. Short, single-decision practice: Med Pass, Who's First, SBAR and De-escalation.
   Plain data, read by src/drill.js. Writing rules (same as the shifts): plain words a tired nurse can read in five
   seconds; one right answer and believable wrong ones; every answer explained in one or two lines; a pearl worth
   remembering. In each option list the right answer is marked ok: 1; options are shuffled on screen.

   Patients: n name, a age, x sex, sk skin tone (0 lightest to 8 deepest), h [hair style, colour], c clothing,
   e extras (glasses, wrinkles, mustache, beard, goatee, cannula, studs, hoops, pearls, freckles), sm smile, k child scale.
   Vitals for the face (v, good, bad) use the rig's inputs: rr, spo2, hr, sbp, temp, pain, glu, alert (0 awake,
   1 drowsy, 2 unresponsive), confused, nausea, anxious, tremor, sweat, pale, lean.

   Clinical review: docs/DRILLS-REVIEW.md lists every card (regenerate with node tools/drills_doc.js). Every card here needs a working nurse's sign-off before it is sold. */
(function (S) {
  const GOWN = 'gown';

  /* ---------------- MED PASS: check first, then give, hold or call ---------------- */
  const med = [
    { id: 'mp-metoprolol', p: { n: 'Samuel Ortiz', a: 71, x: 'M', sk: 5, h: ['balding', '#D9D3CB'], c: GOWN, e: ['mustache', 'wrinkles'], sm: .4 },
      med: 'Metoprolol tartrate 25 mg PO', for: 'Heart failure', line: 'His 09:00 dose. He says he feels "a little floaty" this morning.',
      check: [{ t: 'Apical pulse and blood pressure', v: 'Apical 52. BP 94/58.', ok: 1 }, { t: 'This morning\'s potassium level', v: 'K 4.0. Normal.' }, { t: 'Daily weight compared with yesterday', v: 'Down 0.5 kg since yesterday.' }],
      pick: [{ t: 'Hold it and tell the provider', ok: 1 }, { t: 'Give it, then recheck his pulse in an hour', w: 'By then the dose is already working. The parameter is checked before the dose, not after.' }, { t: 'Hold it now and give it at noon if his pulse is over 60', w: 'Holding is right, but choosing a new time yourself is a new order. The provider needs to know he\'s bradycardic and hypotensive.' }],
      why: 'A pulse of 52 and a systolic of 94 are under the usual hold lines. Another dose slows him further.',
      pearl: 'Beta blocker: pulse and pressure first. Under 60 or a systolic under 100, hold and report.',
      v: { hr: 52, sbp: 94, pale: .3 }, good: { hr: 64, sbp: 108 }, bad: { hr: 42, sbp: 80, alert: 1, pale: .7 },
      goodLine: '"The floaty feeling\'s easing off. Thanks for checking."', badLine: 'An hour later he greys out on the commode. Pulse 42.' },

    { id: 'mp-digoxin', p: { n: 'Ruth Abernathy', a: 84, x: 'F', sk: 1, h: ['curls', '#ECE8E3'], c: GOWN, e: ['glasses', 'wrinkles', 'pearls'], sm: .3 },
      med: 'Digoxin 0.125 mg PO', for: 'Atrial fibrillation', line: 'She skipped breakfast. "My stomach is off, and the lights look fuzzy."',
      check: [{ t: 'Apical pulse for a full minute', v: 'Apical 54, irregular.', ok: 1 }, { t: 'Sitting blood pressure', v: 'BP 128/76.' }, { t: 'Morning potassium level', v: 'K 3.9.' }],
      pick: [{ t: 'Hold it and report possible toxicity', ok: 1 }, { t: 'Hold it, recount in an hour, and give it if the pulse is over 60', w: 'Nausea and vision changes point to toxicity whatever the next pulse is. She needs a level and the provider, not a delayed dose.' }, { t: 'Give it and ask for a digoxin level with the morning labs', w: 'If she\'s toxic, this dose adds to it. The level comes before the next dose, not after.' }],
      why: 'Slow pulse, nausea and blurry or halo vision together point to digoxin toxicity, which is common in frail older adults.',
      pearl: 'Digoxin: count the apical pulse for a full minute. Under 60, or nausea and vision changes, hold and ask for a level and a potassium.',
      v: { hr: 54, nausea: true }, good: { hr: 66 }, bad: { hr: 40, nausea: true, alert: 1, confused: true },
      goodLine: 'The level comes back high. The provider stops it. "You caught that," she says.', badLine: 'By noon she is confused and her rhythm strip shows a block.' },

    { id: 'mp-furosemide-k', p: { n: 'Gloria Vance', a: 66, x: 'F', sk: 6, h: ['bob', '#3A2A22'], c: GOWN, e: ['hoops'], sm: .3 },
      med: 'Furosemide 40 mg IV', for: 'Fluid overload', line: 'Her ankles are still swollen. Morning labs just posted.',
      check: [{ t: 'Potassium', v: 'K 3.1. Low.', ok: 1 }, { t: 'Daily weight', v: 'Down 0.6 kg since yesterday.' }, { t: 'Heart rate', v: 'HR 84, regular.' }],
      pick: [{ t: 'Call the provider about the potassium before the dose', ok: 1 }, { t: 'Give it and recheck her potassium in the morning', w: 'The furosemide will push 3.1 lower tonight. Waiting for morning labs leaves her open to an arrhythmia overnight.' }, { t: 'Hold it and recheck the potassium in 4 hours', w: 'Holding without telling anyone leaves her overloaded and her potassium untreated. The provider has to adjust both.' }],
      why: 'Furosemide pulls potassium out with the water. At 3.1 another dose can tip her into an arrhythmia. The provider may replace potassium and still diurese.',
      pearl: 'Loop diuretics waste potassium. A low K gets reported before the dose, not after the run of PVCs.',
      v: {}, good: {}, bad: { hr: 132, anxious: .6, pale: .4 },
      goodLine: 'Potassium replacement is ordered first, then the furosemide. Her rhythm stays clean.', badLine: 'An hour after the dose the monitor shows runs of PVCs.' },

    { id: 'mp-lispro-low', p: { n: 'Grace Okafor', a: 46, x: 'F', sk: 8, h: ['bun', '#17110E'], c: GOWN, e: ['glasses', 'hoops'], sm: .2 },
      med: 'Insulin lispro 6 units SubQ', for: 'Mealtime insulin', line: 'Her tray is here. She says she feels shaky and a bit sweaty.',
      check: [{ t: 'Fingerstick glucose', v: 'Glucose 64.', ok: 1 }, { t: 'Last A1c', v: 'A1c 9.8% last month.' }, { t: 'Her carbohydrate count for breakfast', v: 'About 60 g on the tray.' }],
      pick: [{ t: 'Hold it, give 15 g of fast sugar, recheck in 15 minutes', ok: 1 }, { t: 'Give 15 g of fast sugar, then give the insulin once she starts eating', w: 'Treat the low, then recheck in 15 minutes. Mealtime insulin waits until she\'s back in range, and the provider should know she went low.' }, { t: 'Hold the insulin and have her eat her breakfast tray', w: 'Holding is right, but a meal tray is slow sugar. With symptoms at 64 she needs 15 g of fast sugar now and a recheck in 15 minutes.' }],
      why: 'She is already low and has symptoms. Rapid-acting insulin on top of 64 drives her lower before the food absorbs.',
      pearl: 'Rule of 15: 15 grams of fast sugar, recheck in 15 minutes. No mealtime insulin into a low. Tell the provider.',
      v: { glu: 64, sweat: .5, tremor: .5 }, good: { glu: 108 }, bad: { glu: 38, alert: 1, sweat: .9, tremor: .8 },
      goodLine: '"Juice did it. I can feel my hands again."', badLine: 'Twenty minutes later she slurs her words. Glucose 38.' },

    { id: 'mp-warfarin', p: { n: 'Henry Ballard', a: 77, x: 'M', sk: 2, h: ['balding', '#C9C2B8'], c: GOWN, e: ['wrinkles'], sm: .35 },
      med: 'Warfarin 5 mg PO', for: 'Atrial fibrillation', line: 'He mentions his gums bled when he brushed this morning.',
      check: [{ t: 'INR', v: 'INR 4.6.', ok: 1 }, { t: 'Platelets', v: 'Platelets 210,000.' }, { t: 'Hemoglobin', v: '12.8, stable.' }],
      pick: [{ t: 'Hold it and tell the provider', ok: 1 }, { t: 'Give half the dose and recheck the INR tomorrow', w: 'Changing a warfarin dose is the prescriber\'s call. At 4.6 with new bleeding, hold and report.' }, { t: 'Hold it and recheck the INR tomorrow', w: 'Holding is right, but a high INR with new bleeding needs the provider today. They may want vitamin K or a bleeding workup.' }],
      why: 'For atrial fibrillation the target INR is 2 to 3. At 4.6 with new bleeding, another dose raises his risk of a serious bleed.',
      pearl: 'Warfarin: check the INR every time. Above range, hold and report. Vitamin K is the provider\'s call, not a nursing add-on.',
      v: {}, good: {}, bad: { pale: .6, pain: 6 },
      goodLine: 'The dose is held and the INR rechecked tomorrow. The bleeding stops.', badLine: 'Two days later he has blood in his urine and a falling hemoglobin.' },

    { id: 'mp-enox-hit', p: { n: 'Darnell Price', a: 59, x: 'M', sk: 7, h: ['buzz', '#2A2220'], c: GOWN, e: ['goatee'], sm: .2 },
      med: 'Enoxaparin 40 mg SubQ', for: 'Clot prevention', line: 'Day 6. He was on a heparin drip before surgery. His left calf is new and sore.',
      check: [{ t: 'Platelets, compared with admission', v: '82,000. It was 230,000 on admission.', ok: 1 }, { t: 'Creatinine and kidney function', v: 'Creatinine 0.9. Normal.' }, { t: 'Calf circumference, both legs', v: 'Left calf 2 cm bigger than the right.' }],
      pick: [{ t: 'Hold it, stop all heparin, call now', ok: 1 }, { t: 'Hold the enoxaparin but keep the heparin flushes in his IV', w: 'Even small heparin flushes keep HIT going. All heparin stops, flushes included.' }, { t: 'Hold it and ask for a leg ultrasound before deciding', w: 'The ultrasound is reasonable, but a halved platelet count after heparin is HIT until proven otherwise. He needs a non-heparin anticoagulant now; waiting leaves the clot untreated.' }],
      why: 'A platelet drop of more than half, 5 to 10 days after heparin, with a new clot, is heparin-induced thrombocytopenia until proven otherwise.',
      pearl: 'HIT: platelets fall and clots form. Stop all heparin, including flushes and enoxaparin, and call. He needs a non-heparin anticoagulant.',
      v: { pain: 3 }, good: { pain: 2 }, bad: { pain: 7, rr: 26, spo2: 90, anxious: .6 },
      goodLine: 'He is switched to argatroban. The clot doesn\'t grow.', badLine: 'That night he is short of breath with chest pain.' },

    { id: 'mp-ace-angio', p: { n: 'Leticia Moore', a: 54, x: 'F', sk: 7, h: ['long', '#140E0A'], c: GOWN, e: ['studs'], sm: .1 },
      med: 'Lisinopril 10 mg PO', for: 'Blood pressure', line: 'She started it yesterday. She sounds a little thick when she says good morning.',
      check: [{ t: 'Look at her face and mouth', v: 'Her lips and tongue are swollen.', ok: 1 }, { t: 'Blood pressure before the dose', v: 'BP 144/88.' }, { t: 'When she last took it', v: 'Yesterday at 09:00, her first dose.' }],
      pick: [{ t: 'Hold it, stay with her, call rapid response', ok: 1 }, { t: 'Hold it, give the PRN diphenhydramine, and recheck in 30 minutes', w: 'ACE-inhibitor angioedema comes from bradykinin, not histamine, so antihistamines don\'t reliably help. A swelling tongue needs the team now.' }, { t: 'Hold it and ask the prescriber to switch her to an ARB', w: 'Switching drugs is a later question. Right now her airway is the problem.' }],
      why: 'Lip and tongue swelling on an ACE inhibitor is angioedema. It can close the airway, and antihistamines don\'t reliably stop it.',
      pearl: 'ACE inhibitor plus facial or tongue swelling: never the next dose. Airway first, get help, and list it as an allergy.',
      v: { anxious: .5 }, good: { anxious: .1 }, bad: { spo2: 86, rr: 28, anxious: .9, lean: .6 },
      goodLine: 'The swelling peaks and settles with the team at the bedside.', badLine: 'Her voice goes hoarse. Then she can\'t swallow.' },

    { id: 'mp-morphine-sed', p: { n: 'Marcus Bell', a: 58, x: 'M', sk: 6, h: ['buzz', '#2A2220'], c: GOWN, e: ['goatee'], sm: .2 },
      med: 'Morphine 4 mg IV, as needed', for: 'Severe pain', line: 'His wife says he asked for pain medicine. He has sleep apnea.',
      check: [{ t: 'Sedation and breathing', v: 'Drifts off mid-sentence. RR 9. SpO₂ 89%.', ok: 1 }, { t: 'Pain score', v: 'He mumbles "eight" and closes his eyes.' }, { t: 'Time of his last opioid dose', v: 'Oxycodone 10 mg at 04:30.' }],
      pick: [{ t: 'Hold it, rouse him, CPAP on, tell the provider', ok: 1 }, { t: 'Give half the dose and recheck his sedation in 30 minutes', w: 'He\'s already falling asleep mid-sentence. Any opioid now deepens it.' }, { t: 'Hold it and give naloxone right away', w: 'He rouses to voice. Wake him, get his CPAP on and call; naloxone is for a patient you can\'t rouse or whose breathing stays slow, and it takes away all his pain control.' }],
      why: 'Drifting off mid-sentence is sedation level 3. Sedation comes before the breathing stops, and sleep apnea makes it worse.',
      pearl: 'Sedation comes before respiratory depression. A sleepy patient on opioids gets assessed, not dosed.',
      v: { rr: 9, spo2: 89, alert: 1 }, good: { rr: 14, spo2: 95, pain: 5 }, bad: { rr: 6, spo2: 80, alert: 2 },
      goodLine: 'Awake on his CPAP: "Sorry. I was way under."', badLine: 'Twenty minutes later he doesn\'t wake to his name. RR 6.' },

    { id: 'mp-kcl', p: { n: 'Imani Shaw', a: 38, x: 'F', sk: 6, h: ['curlyshort', '#1A120E'], c: GOWN, e: ['studs'], sm: .4 },
      med: 'Potassium chloride 10 mEq IV', for: 'K 3.2', line: 'A small premixed bag. Pharmacy sent it up. She\'s been vomiting for two days.',
      check: [{ t: 'Urine output', v: '240 mL over the last 6 hours.', ok: 1 }, { t: 'Glucose', v: '96.' }, { t: 'Magnesium level', v: 'Mg 2.0.' }],
      pick: [{ t: 'Run it on a pump, no faster than 10 mEq an hour', ok: 1 }, { t: 'Run it over 30 minutes so it\'s in before her next lab draw', w: 'That\'s 20 mEq an hour, double the usual limit through a peripheral IV on a regular floor. Faster potassium risks arrhythmia and burns the vein.' }, { t: 'Hold it until her vomiting stops', w: 'Vomiting is why she\'s losing potassium. With urine flowing, replace it now.' }],
      why: 'Her kidneys are making urine, so it\'s safe to replace. IV potassium is never pushed: a bolus can stop the heart.',
      pearl: 'Never push potassium. Check that urine is flowing, then pump it, usually 10 mEq an hour or slower on a regular floor.',
      v: { nausea: true }, good: {}, bad: { hr: 40, alert: 2, pale: .8 },
      goodLine: 'The rhythm stays steady and her next K is 3.8.', badLine: 'She says it burns. Then the monitor alarms.' },

    { id: 'mp-lithium', p: { n: 'Daniel Kim', a: 33, x: 'M', sk: 3, h: ['short', '#151010'], c: 'tee', e: [], sm: .2 },
      med: 'Lithium carbonate 300 mg PO', for: 'Bipolar disorder', line: 'He calls it a stomach bug: two days of diarrhea. His hand shakes holding the cup.',
      check: [{ t: 'Lithium level and how he looks', v: 'Level 1.8. Coarse tremor. Slow to answer.', ok: 1 }, { t: 'Blood pressure, sitting', v: 'BP 118/74.' }, { t: 'Morning sodium level', v: 'Na 134.' }],
      pick: [{ t: 'Hold it and call for a medical evaluation', ok: 1 }, { t: 'Hold this dose, push fluids, and give it tonight', w: 'Fluids alone won\'t fix a level of 1.8 with neuro signs. He needs a medical evaluation, and the next dose waits for the prescriber.' }, { t: 'Give it and recheck the level in the morning', w: 'At 1.8 with a coarse tremor and slowed thinking, another dose can push him toward seizures.' }],
      why: 'Fluid loss raises lithium levels. 1.8 with a coarse tremor and slowed thinking is toxicity, and it can progress to seizures.',
      pearl: 'Lithium works in a narrow range, about 0.6 to 1.2. Vomiting, diarrhea, coarse tremor or confusion: hold and get a level.',
      v: { tremor: .6, nausea: true }, good: { tremor: .2 }, bad: { tremor: .9, confused: true, alert: 1 },
      goodLine: 'He goes to medicine for fluids. A day later his hands are steady.', badLine: 'That evening he is confused and walking unsteadily.' },

    { id: 'mp-clozapine', p: { n: 'Theo Grant', a: 41, x: 'M', sk: 1, h: ['shag', '#6B5440'], c: 'tee', e: ['beard'], sm: .1 },
      med: 'Clozapine 100 mg PO', for: 'Schizophrenia', line: 'He says his throat has been sore since yesterday.',
      check: [{ t: 'Absolute neutrophil count', v: 'ANC 800.', ok: 1 }, { t: 'Heart rate, counted for a minute', v: 'HR 98.' }, { t: 'When he last had a bowel movement', v: 'Yesterday.' }],
      pick: [{ t: 'Hold it and call now', ok: 1 }, { t: 'Hold it and recheck the ANC tomorrow', w: 'Holding is right, but a sore throat with an ANC of 800 could be the start of a serious infection. The prescriber needs to know today.' }, { t: 'Give it and ask for a throat swab', w: 'With an ANC under 1,000, clozapine is interrupted. The swab is reasonable; the dose isn\'t.' }],
      why: 'An ANC under 1,000 is moderate neutropenia; clozapine is interrupted. A sore throat could be the first sign of a serious infection.',
      pearl: 'Clozapine: check the ANC before the dose. Fever, sore throat or flu-like symptoms are urgent until proven otherwise.',
      v: { temp: 37.6 }, good: { temp: 37.1 }, bad: { temp: 39.2, hr: 118, sweat: .5 },
      goodLine: 'Clozapine is paused and his counts are followed daily. They recover.', badLine: 'By night he has a fever of 39.2.' },

    { id: 'mp-levo', p: { n: 'Priya Raman', a: 62, x: 'F', sk: 4, h: ['bun', '#2C2220'], c: GOWN, e: ['glasses', 'studs'], sm: .45 },
      med: 'Levothyroxine 75 mcg PO', for: 'Hypothyroidism', line: '06:00. She takes calcium and iron with breakfast at home.',
      check: [{ t: 'When she last ate', v: 'Nothing since 21:00. Breakfast comes at 07:30.', ok: 1 }, { t: 'Her last TSH result', v: 'Last month: in range.' }, { t: 'Resting heart rate', v: 'HR 76.' }],
      pick: [{ t: 'Give it now with a full glass of water', ok: 1 }, { t: 'Give it with breakfast at 07:30 so it won\'t upset her stomach', w: 'Food cuts absorption. It goes on an empty stomach, 30 to 60 minutes before breakfast.' }, { t: 'Give it now along with her morning calcium', w: 'Calcium binds levothyroxine. Separate them by at least 4 hours.' }],
      why: 'Levothyroxine absorbs best on an empty stomach, 30 to 60 minutes before food, and at least 4 hours apart from calcium or iron.',
      pearl: 'Not every check ends in a hold. When it\'s safe and timed right, give it on time.',
      v: {}, good: {}, bad: { tired: true },
      goodLine: 'She takes it with water and goes back to sleep until breakfast.', badLine: 'Taken with calcium for months, her dose stops working and she is exhausted.' },

    { id: 'mp-apap-max', p: { n: 'Frank Delgado', a: 68, x: 'M', sk: 4, h: ['swoop', '#8E8378'], c: GOWN, e: ['mustache'], sm: .3 },
      med: 'Acetaminophen 1,000 mg PO, scheduled', for: 'Post-op pain', line: 'Due at 12:00. He also has hydrocodone-acetaminophen ordered for breakthrough pain.',
      check: [{ t: 'Every acetaminophen since midnight', v: '1 g at 00:00 and 06:00, plus 2 hydrocodone-acetaminophen tablets (325 mg each) at 04:00 and 10:00. Total 3.3 g.', ok: 1 }, { t: 'Pain score, at rest and moving', v: 'Pain 4 of 10.' }, { t: 'Yesterday\'s liver enzymes', v: 'Normal yesterday.' }],
      pick: [{ t: 'Hold it and ask for the orders to be adjusted', ok: 1 }, { t: 'Give it and tell the next nurse to skip his 16:00 hydrocodone', w: 'This dose alone puts him at 4.3 g today. The fix is new orders, not a handoff note.' }, { t: 'Give 650 mg instead of 1,000', w: 'That\'s still 3.95 g today, right at the adult limit and above many hospitals\' limit for older adults. Changing a dose is the prescriber\'s decision.' }],
      why: 'Another gram makes 4.3 g today. Adults shouldn\'t exceed 4 g a day, and many hospitals cap older adults lower.',
      pearl: 'Count every acetaminophen, including combination pills. Adults: no more than 4 g a day, often less in older adults and liver disease.',
      v: { pain: 4 }, good: { pain: 3 }, bad: { pain: 4, nausea: true },
      goodLine: 'The orders are rewritten so the two can\'t add up past the limit.', badLine: 'Days of this, and his liver enzymes start to climb.' },

    { id: 'mp-pcn', p: { n: 'Olivia Hart', a: 29, x: 'F', sk: 0, h: ['ponytail', '#C08A4E'], c: GOWN, e: ['freckles'], sm: .4 },
      med: 'Amoxicillin 500 mg PO', for: 'Ear infection', line: 'A new order. She says she\'s allergic "to something, a penicillin maybe."',
      check: [{ t: 'Her allergy band and chart', v: 'Penicillin: hives and throat tightness.', ok: 1 }, { t: 'Her temperature right now', v: '38.1.' }, { t: 'When her ear pain started', v: 'Three days ago, worse at night.' }],
      pick: [{ t: 'Hold it and call for a different antibiotic', ok: 1 }, { t: 'Give it. Amoxicillin isn\'t a true penicillin', w: 'Amoxicillin is a penicillin (an aminopenicillin), so her reaction applies.' }, { t: 'Give it after premedicating with diphenhydramine', w: 'Premedicating doesn\'t prevent anaphylaxis. With throat tightness last time, it isn\'t given at all.' }],
      why: 'Amoxicillin is a penicillin. Throat tightness last time means this could be anaphylaxis.',
      pearl: 'Match the allergy to the drug class, not just the name. Ask what happened last time.',
      v: { temp: 38.1 }, good: { temp: 37.4 }, bad: { spo2: 88, rr: 28, anxious: .9, sbp: 84 },
      goodLine: 'She gets azithromycin instead.', badLine: 'Ten minutes after the dose she is scratching, then wheezing.' },

    { id: 'mp-two-ids', p: { n: 'Kenneth Lee', a: 66, x: 'M', sk: 3, h: ['short', '#3A3330'], c: GOWN, e: ['glasses'], sm: .4 },
      med: 'Oxycodone 5 mg PO', for: 'Pain', line: 'Room 302, bed B. You say "Mr. Lee?" and he says "Yep, that\'s me."',
      check: [{ t: 'His name and birth date, from him, against the band and MAR', v: 'He says "Kevin Lee, March 4, 1961." Your MAR is Kenneth Lee, 1958.', ok: 1 }, { t: 'The room and bed number on the door, against the MAR', v: 'Room 302, bed B.' }, { t: 'How he rates his pain right now', v: 'Pain 6.' }],
      pick: [{ t: 'Don\'t give it. Sort out the mix-up first', ok: 1 }, { t: 'Recheck the room and bed against the MAR, then give it', w: 'Room and bed are locations, not identifiers. Two identifiers he stated already disagree with the MAR.' }, { t: 'Give it, then report the band mix-up', w: 'Wrong patient: Kevin has never had opioids. Sort out who he is before anything is given.' }],
      why: 'Two Mr. Lees on the unit. A room number and a yes are not identifiers. The patient states them; you match them.',
      pearl: 'Two identifiers, said by the patient, matched to the band and the MAR. Every time.',
      v: { pain: 6 }, good: { pain: 6 }, bad: { alert: 1, rr: 10 },
      goodLine: 'Kevin Lee was moved to this bed an hour ago. Kenneth is two doors down, waiting.', badLine: 'Kevin is opioid-naive. An hour later he is hard to wake.' },

    { id: 'mp-spiro', p: { n: 'Mae Collins', a: 73, x: 'F', sk: 2, h: ['short', '#B8B0A6'], c: GOWN, e: ['wrinkles', 'glasses'], sm: .3 },
      med: 'Spironolactone 25 mg PO', for: 'Heart failure', line: 'She\'s also on lisinopril. She says her legs feel heavy.',
      check: [{ t: 'Potassium', v: 'K 5.9.', ok: 1 }, { t: 'Blood pressure', v: 'BP 122/70.' }, { t: 'Creatinine', v: '1.6, up from 1.3.' }],
      pick: [{ t: 'Hold it and call. Ask for an ECG', ok: 1 }, { t: 'Hold the spironolactone but give the lisinopril', w: 'Lisinopril raises potassium too. At 5.9 both wait for the provider.' }, { t: 'Hold it and recheck the potassium in the morning', w: 'A potassium of 5.9 with weakness needs an ECG and treatment now, not tomorrow.' }],
      why: 'Spironolactone keeps potassium, and so does lisinopril. At 5.9 with weakness, she needs an ECG and treatment, not more.',
      pearl: 'Potassium-sparing diuretics, ACE inhibitors and ARBs raise K. Above about 5.0, hold and report; high K plus weakness gets an ECG.',
      v: { pale: .2 }, good: {}, bad: { hr: 44, pale: .7, alert: 1 },
      goodLine: 'The ECG shows peaked T waves. She\'s treated before it goes further.', badLine: 'That night her heart rate drops into the 40s.' },

    { id: 'mp-nitro-pde5', p: { n: 'Walter Ames', a: 63, x: 'M', sk: 1, h: ['swoop', '#9C8F80'], c: GOWN, e: [], sm: .1 },
      med: 'Nitroglycerin 0.4 mg SL', for: 'Chest pain', line: 'Chest pressure, 5 of 10. The ECG is done and the team is on the way.',
      check: [{ t: 'Ask about erectile dysfunction medicines', v: 'He took sildenafil at 22:00 last night.', ok: 1 }, { t: 'Blood pressure in both arms, sitting up', v: 'BP 132/80.' }, { t: 'Heart rate and rhythm on the monitor', v: 'HR 88.' }],
      pick: [{ t: 'Hold the nitro and tell the provider', ok: 1 }, { t: 'Give it, since his systolic is over 100', w: 'Blood pressure is only half the check. Sildenafil in the last 24 hours makes nitrates dangerous at any starting pressure.' }, { t: 'Give it and have IV fluids ready in case his pressure drops', w: 'Preparing for the drop you expect isn\'t a reason to cause it.' }],
      why: 'Sildenafil within 24 hours (tadalafil within 48) plus nitrates can drop the pressure dangerously low.',
      pearl: 'Before nitro: blood pressure, and ask about sildenafil, vardenafil or tadalafil. Men often don\'t list them.',
      v: { pain: 5, anxious: .4 }, good: { pain: 3, anxious: .2 }, bad: { sbp: 70, pale: .8, alert: 1 },
      goodLine: 'The team treats his pain another way and takes him to the cath lab.', badLine: 'Two minutes after the tablet his pressure falls to 70.' },

    { id: 'mp-glargine', p: { n: 'Rafael Soto', a: 50, x: 'M', sk: 5, h: ['short', '#1E1814'], c: GOWN, e: ['mustache'], sm: .35 },
      med: 'Insulin glargine 20 units SubQ', for: 'Type 2 diabetes, bedtime basal', line: '21:00. He ate most of his dinner.',
      check: [{ t: 'Fingerstick glucose', v: 'Glucose 182.', ok: 1 }, { t: 'Evening potassium level', v: 'K 4.1.' }, { t: 'Blood pressure', v: 'BP 130/78.' }],
      pick: [{ t: 'Give the full dose', ok: 1 }, { t: 'Give half the dose, since he\'ll be fasting overnight', w: 'Basal insulin covers the body\'s overnight needs. At 182 the full dose is right, and changing it is the prescriber\'s call.' }, { t: 'Give it, plus correction lispro for the 182', w: 'Correction insulin at bedtime raises the risk of overnight lows, and it wasn\'t ordered for bedtime. Give what\'s ordered.' }],
      why: 'Basal insulin covers the body\'s background needs through the night. 182 is safe; holding it sets him up for a high morning.',
      pearl: 'Don\'t hold basal insulin because a meal was small. Hold for a low, and call.',
      v: {}, good: {}, bad: { glu: 340, nausea: true },
      goodLine: 'His morning glucose is 128.', badLine: 'His morning glucose is 340.' },

    { id: 'mp-lasix-give', p: { n: 'Beatrice Lowell', a: 79, x: 'F', sk: 0, h: ['curls', '#D8D2CA'], c: GOWN, e: ['wrinkles', 'cannula'], sm: .25 },
      med: 'Furosemide 40 mg PO', for: 'Heart failure', line: 'Crackles at both bases. Up 1.5 kg since yesterday. She asks if she can skip it so she isn\'t up all night.',
      check: [{ t: 'Potassium and blood pressure', v: 'K 4.2. BP 128/74.', ok: 1 }, { t: 'Temperature, since she has crackles', v: '36.9.' }, { t: 'Fingerstick glucose', v: '104.' }],
      pick: [{ t: 'Give it now, and explain why the timing helps', ok: 1 }, { t: 'Respect her wish: hold it and chart her refusal', w: 'She hasn\'t refused; she asked a question. Explain the timing first, then let her decide.' }, { t: 'Move it to 14:00 so she\'s less bothered this morning', w: 'Changing the time is a new order, and she\'s gaining fluid now.' }],
      why: 'The numbers are safe and she is gaining fluid. Giving it in the morning means she\'s done urinating by evening.',
      pearl: 'When the numbers are safe, give it on time. Explain before you accept a refusal; she may just need the reason.',
      v: { rr: 22, spo2: 92 }, good: { rr: 16, spo2: 96 }, bad: { rr: 28, spo2: 88, lean: .5 },
      goodLine: '"Morning\'s fine then. I\'d rather sleep." By afternoon she\'s breathing easier.', badLine: 'Overnight she wakes up gasping.' },

    { id: 'mp-peds-apap', p: { n: 'Leo Ferris', a: '20 mos', x: 'M', sk: 2, h: ['buzz', '#B98E5C'], c: 'onesie2', e: [], sm: .1, k: .72 },
      med: 'Acetaminophen 15 mg/kg PO (160 mg/5 mL)', for: 'Fever', line: 'A 20-month-old. The syringe on the counter reads 15 mL.',
      check: [{ t: 'Weight in kilograms', v: '10 kg. 15 mg/kg is 150 mg, which is 4.7 mL.', ok: 1 }, { t: 'Temperature, rechecked now', v: '38.9.' }, { t: 'Last dose time', v: 'None today.' }],
      pick: [{ t: 'Discard it and draw up 4.7 mL', ok: 1 }, { t: 'Give the 15 mL; pharmacy verified it', w: 'Pharmacy can make errors too. The final check is yours, at the bedside.' }, { t: 'Give 5 mL, the usual dose for a toddler', w: '5 mL is 160 mg, a little over his 150 mg, and there\'s no "usual" toddler dose. Always calculate by weight.' }],
      why: '15 mL is 480 mg, three times his dose. Someone wrote the mg/kg number as millilitres.',
      pearl: 'Kids: dose by weight in kilograms, every time. Then check that the volume makes sense for the size of the child.',
      v: { temp: 38.9 }, good: { temp: 37.6 }, bad: { temp: 37.8, nausea: true, alert: 1 },
      goodLine: 'He naps, cool and pink.', badLine: 'Poison control is called. His liver enzymes are followed for days.' },
  ];

  /* ---------------- WHO'S FIRST: four patients, one nurse ---------------- */
  const first = [
    { id: 'wf-sepsis', where: 'Med-surg, 07:30', q: 'Report\'s done. Who do you see first?',
      pts: [
        { p: { n: 'Mr. Bell', a: 58, x: 'M', sk: 6, h: ['buzz', '#2A2220'], e: ['goatee'] }, line: 'Post-op day 1. Pain 8 of 10, guarding. Last oxycodone 4 hours ago.', w: 'Pain matters, but it\'s expected after surgery and his vitals are stable. Sepsis with a low pressure comes first.' },
        { p: { n: 'Mr. Gray', a: 70, x: 'M', sk: 2, h: ['balding', '#C9C2B8'], e: ['cannula', 'wrinkles'] }, line: 'COPD. SpO₂ 89% on 2 L. His baseline is 88 to 92.', w: '89% is inside his target range. Expected and stable.' },
        { p: { n: 'Mrs. Okafor', a: 46, x: 'F', sk: 8, h: ['bun', '#17110E'], e: ['glasses'] }, line: 'Diabetic. Glucose 342 before breakfast. No ketones.', w: 'High, but she\'s alert with no ketones. Correction insulin per the scale, after the unstable patient.' },
        { p: { n: 'Mrs. Whitfield', a: 82, x: 'F', sk: 1, h: ['curls', '#ECE8E3'], e: ['wrinkles', 'pearls'] }, line: 'UTI. Newly confused. HR 118, BP 92/60, T 38.6.', ok: 1 },
      ],
      why: 'New confusion with a fast heart rate, low pressure and fever is sepsis. The others are expected for their conditions.',
      pearl: 'Unexpected beats expected. Acute beats chronic. Sepsis is a clock.' },

    { id: 'wf-pe', where: 'Ortho, 10:00', q: 'Four call lights at once. Who first?',
      pts: [
        { p: { n: 'Mrs. Adler', a: 72, x: 'F', sk: 1, h: ['short', '#D0C8BE'], e: ['wrinkles'] }, line: 'Hip replacement day 1. Pain 8 of 10, BP 158/92.', w: 'Pain is driving her pressure up; treat it soon. A new breathing problem comes first.' },
        { p: { n: 'Mr. Nguyen', a: 55, x: 'M', sk: 3, h: ['short', '#1A1410'], e: [] }, line: 'Knee replacement day 2. Sudden sharp chest pain, short of breath. HR 122.', ok: 1 },
        { p: { n: 'Ms. Patel', a: 40, x: 'F', sk: 4, h: ['long', '#1E1612'], e: ['studs'] }, line: 'Day 1 after a hysterectomy. Temp 38.0. Incentive spirometer at 750 mL.', w: 'A low-grade temp on day 1 is usually atelectasis. Keep her deep breathing; she\'s stable.' },
        { p: { n: 'Mr. Boyd', a: 64, x: 'M', sk: 5, h: ['balding', '#3A302A'], e: [] }, line: 'Day 2 after a knee replacement. Left calf tender and warm.', w: 'A possible DVT matters, but a possible PE already causing breathlessness and a fast pulse comes first.' },
      ],
      why: 'Sudden chest pain and breathlessness after joint surgery is a pulmonary embolism until proven otherwise. Breathing comes before pain.',
      pearl: 'Airway, breathing, circulation. A new problem with breathing jumps the line.' },

    { id: 'wf-psych-calm', where: 'Adult psych, 09:00', q: 'Who needs you first?',
      pts: [
        { p: { n: 'Jasmine', a: 27, x: 'F', sk: 6, h: ['curlyshort', '#130C08'], c: 'tee', e: ['hoops'] }, line: 'Manic. Pacing, loud, yelling at a peer. Redirectable so far.', w: 'Escalating, but still redirectable and nobody is hurt. A hidden suicide risk is more dangerous.' },
        { p: { n: 'Daniel', a: 35, x: 'M', sk: 2, h: ['short', '#4A3A2C'], c: 'tee', e: [] }, line: 'Admitted for depression. Suddenly calm and smiling. Gave his watch to a peer.', ok: 1 },
        { p: { n: 'Ruth', a: 61, x: 'F', sk: 4, h: ['bob', '#8E8378'], c: 'blouse', e: ['glasses'] }, line: 'Refused her morning lithium. Says it makes her hands shake.', w: 'Address the refusal and check the tremor today; not an emergency.' },
        { p: { n: 'Marcus', a: 44, x: 'M', sk: 7, h: ['buzz', '#120C09'], c: 'hoodie', e: ['beard'] }, line: 'Hears voices calling him worthless. Says he would never act on them.', w: 'Assess the voices soon, but he\'s engaged and denies intent. Daniel\'s sudden calm is the bigger red flag.' },
      ],
      why: 'Sudden calm and giving things away after deep depression can mean a decision has been made. That is a suicide warning sign.',
      pearl: 'Sudden peace in a depressed patient is a finding, not a recovery. Ask directly about suicide, and keep them safe.' },

    { id: 'wf-croup', where: 'Pediatrics, 14:00', q: 'Who do you see first?',
      pts: [
        { p: { n: 'Mateo', a: 2, x: 'M', sk: 4, h: ['buzz', '#1E1612'], c: 'onesie2', e: [], k: .74 }, line: 'Croup. Stridor even at rest. Pulling in at the ribs.', ok: 1 },
        { p: { n: 'Ava', a: 8, x: 'F', sk: 1, h: ['ponytail', '#B07A3E'], c: 'sun', e: ['freckles'], k: .85 }, line: 'Broken arm in a cast. Pain 7 of 10. Fingers pink, cap refill 2 seconds.', w: 'Pain to treat soon; circulation is fine.' },
        { p: { n: 'Noah', a: '6 mos', x: 'M', sk: 3, h: ['buzz', '#5A4430'], c: 'onesie', e: [], k: .7 }, line: '6 months old. Temp 38.9, fussy, feeding a little less.', w: 'Fever to assess soon, but he\'s feeding and his airway is fine.' },
        { p: { n: 'Zoe', a: 15, x: 'F', sk: 7, h: ['long', '#120C09'], c: 'hoodie', e: ['studs'] }, line: 'DKA resolving. Off the drip, glucose 74, eating lunch.', w: 'Low-normal and she\'s eating. Recheck soon; airway first.' },
      ],
      why: 'Stridor at rest with retractions means the airway is narrowing now. Children decompensate fast.',
      pearl: 'Stridor at rest is never "just croup." Airway first, always.' },

    { id: 'wf-pph', where: 'Mother-baby, 11:00', q: 'Who first?',
      pts: [
        { p: { n: 'Ms. Reyes', a: 31, x: 'F', sk: 4, h: ['long', '#1A120E'] }, line: '2 hours after birth. Fundus boggy. Soaked a pad in 15 minutes.', ok: 1 },
        { p: { n: 'Mrs. Chen', a: 34, x: 'F', sk: 3, h: ['bob', '#151010'] }, line: 'Day 1. BP 142/90. No headache or vision changes.', w: 'Raised but not severe range, and no symptoms. Recheck soon; active bleeding comes first.' },
        { p: { n: 'Ms. Ward', a: 26, x: 'F', sk: 0, h: ['ponytail', '#C08A4E'], e: ['freckles'] }, line: 'Day 2. Temp 38.1, breasts full and tender.', w: 'Engorgement can cause a low-grade temperature. Assess her, but she\'s stable.' },
        { p: { n: 'Baby Ito', a: '3 days', x: 'F', sk: 2, h: ['buzz', '#2A2220'], c: 'onesie', e: [], k: .68 }, line: 'Day 3. Jaundice to the chest. Bilirubin near the phototherapy line.', w: 'Needs a recheck and maybe phototherapy today; not a minutes-matter emergency.' },
      ],
      why: 'A boggy uterus soaking a pad in 15 minutes is a postpartum hemorrhage. She can lose a lot of blood very fast.',
      pearl: 'Postpartum: a soft fundus and heavy bleeding means massage the fundus and get help, now.' },

    { id: 'wf-k', where: 'Lab results, 06:00', q: 'Four results post at once. Which do you act on first?',
      pts: [
        { p: { n: 'Mr. Hale', a: 67, x: 'M', sk: 2, h: ['balding', '#B6A58E'], e: ['wrinkles'] }, line: 'K 6.8. Peaked T waves on the monitor.', ok: 1 },
        { p: { n: 'Mrs. Ruiz', a: 58, x: 'F', sk: 5, h: ['bob', '#2A1E18'] }, line: 'Sodium 127. Mild headache, alert.', w: 'Low and needs follow-up, but she\'s alert with mild symptoms. ECG changes with K 6.8 come first.' },
        { p: { n: 'Mr. Owens', a: 49, x: 'M', sk: 7, h: ['buzz', '#120C09'], e: ['beard'] }, line: 'Hemoglobin 7.6, down from 8.4. No bleeding seen.', w: 'A drop to report today, possibly a transfusion. Not as immediate as a lethal rhythm.' },
        { p: { n: 'Ms. Lin', a: 44, x: 'F', sk: 3, h: ['long', '#151010'] }, line: 'Glucose 412 on steroids. Alert, no ketones.', w: 'High and needs insulin per orders, but not immediately life-threatening.' },
      ],
      why: 'A potassium of 6.8 with ECG changes can cause a fatal arrhythmia within minutes.',
      pearl: 'A critical value with a physical sign (ECG change, symptoms) is an emergency, not a result to file.' },

    { id: 'wf-stroke', where: 'Med-surg, 15:10', q: 'Who first?',
      pts: [
        { p: { n: 'Mr. Feld', a: 74, x: 'M', sk: 1, h: ['swoop', '#C8C0B6'], e: ['glasses', 'wrinkles'] }, line: 'New facial droop and slurred speech. Fine at 14:50.', ok: 1 },
        { p: { n: 'Mrs. Dunn', a: 80, x: 'F', sk: 2, h: ['curls', '#ECE8E3'], e: ['wrinkles'] }, line: 'Aphasia from an old stroke, unchanged. Temp 38.2 tonight.', w: 'Fever needs a workup soon, but her deficit is old. A new deficit inside the treatment window comes first.' },
        { p: { n: 'Mr. Obi', a: 69, x: 'M', sk: 8, h: ['balding', '#2A2220'] }, line: 'Atrial fibrillation, rate 128, BP 124/78. Says he feels fine.', w: 'Rapid AF with a normal pressure and no symptoms: report it, but he\'s stable.' },
        { p: { n: 'Ms. Ross', a: 52, x: 'F', sk: 0, h: ['bob', '#8A5A3A'] }, line: 'Migraine history. Headache 6 of 10, like her usual ones.', w: 'A familiar pattern and stable. Treat after the stroke alert.' },
      ],
      why: 'New stroke signs with a known last-well time 20 minutes ago. Every minute counts for clot-busting and clot removal.',
      pearl: 'New neuro deficit: note the last known well time and call the stroke alert. Old deficits are baseline.' },

    { id: 'wf-thyroid', where: 'Surgical, 13:00', q: 'Who first?',
      pts: [
        { p: { n: 'Ms. Ford', a: 45, x: 'F', sk: 0, h: ['ponytail', '#6B5440'] }, line: '4 hours after thyroidectomy. Hoarse, new noisy breathing.', ok: 1 },
        { p: { n: 'Mr. Silva', a: 50, x: 'M', sk: 5, h: ['short', '#1E1814'], e: ['mustache'] }, line: 'Gallbladder out yesterday. Right shoulder pain 6 of 10.', w: 'Referred gas pain after laparoscopy is expected.' },
        { p: { n: 'Mrs. Bly', a: 66, x: 'F', sk: 2, h: ['short', '#B8B0A6'], e: ['glasses'] }, line: 'Catheter out 6 hours ago. Hasn\'t voided. Bladder scan 450 mL.', w: 'Needs a straight cath soon. It can wait minutes; an airway can\'t.' },
        { p: { n: 'Mr. Kahn', a: 38, x: 'M', sk: 4, h: ['short', '#151010'], e: ['beard'] }, line: 'Thyroidectomy yesterday. Tingling around his lips.', w: 'Possible low calcium: check a calcium soon. But noisy breathing right now is the airway.' },
      ],
      why: 'Noisy breathing after neck surgery can be a hematoma or swelling closing the airway.',
      pearl: 'After neck surgery: stridor, hoarseness or swelling is an airway emergency. Shoulder pain after laparoscopy is expected gas.' },

    { id: 'wf-heparin-bleed', where: 'Telemetry, 02:00', q: 'Who first?',
      pts: [
        { p: { n: 'Mr. Cole', a: 60, x: 'M', sk: 2, h: ['balding', '#8E8378'] }, line: 'Cirrhosis. Abdomen tighter than yesterday, breathing comfortably.', w: 'More ascites to report, but he\'s breathing comfortably.' },
        { p: { n: 'Mrs. Grant', a: 71, x: 'F', sk: 5, h: ['bob', '#B8B0A6'], e: ['glasses'] }, line: 'Heparin drip. New headache, now confused.', ok: 1 },
        { p: { n: 'Mr. Ali', a: 57, x: 'M', sk: 4, h: ['short', '#1E1612'], e: ['beard'] }, line: 'On chemo. Vomited twice, nausea 7 of 10.', w: 'Give the PRN antiemetic soon; not a neuro emergency.' },
        { p: { n: 'Ms. Park', a: 48, x: 'F', sk: 3, h: ['long', '#151010'] }, line: 'Can\'t sleep. Heart rate 108, says she can\'t stop worrying.', w: 'Worth assessing, but she\'s talking and stable.' },
      ],
      why: 'A new headache and confusion on an anticoagulant could be bleeding in the brain.',
      pearl: 'Anticoagulant plus a new neuro change: stop the drip, neuro checks, call now.' },

    { id: 'wf-rp-bleed', where: 'Step-down, 18:00', q: 'Who first?',
      pts: [
        { p: { n: 'Mr. Webb', a: 63, x: 'M', sk: 1, h: ['short', '#9C8F80'] }, line: 'Femoral cath 3 hours ago. New back pain. HR 110, BP 98/60.', ok: 1 },
        { p: { n: 'Mrs. Lowe', a: 79, x: 'F', sk: 0, h: ['curls', '#D8D2CA'], e: ['wrinkles'] }, line: 'Pacemaker placed today. Hiccups since the procedure.', w: 'Constant hiccups can mean the lead is pacing the diaphragm: report it. She\'s stable; hidden bleeding is first.' },
        { p: { n: 'Mr. Diaz', a: 55, x: 'M', sk: 5, h: ['short', '#1E1814'], e: ['mustache'] }, line: 'Ileus. NG output 900 mL since noon.', w: 'Replace the losses per orders and watch his potassium. Not as urgent as shock.' },
        { p: { n: 'Ms. Moore', a: 61, x: 'F', sk: 7, h: ['bun', '#1A120E'] }, line: 'Glucose 238 before dinner. Correction insulin due.', w: 'Correction insulin per the scale; not urgent.' },
      ],
      why: 'Back or flank pain with a rising heart rate after a femoral procedure is a retroperitoneal bleed until proven otherwise. The groin can look fine.',
      pearl: 'Bleeding hides. Rising heart rate and falling pressure after a procedure: think blood loss.' },

    { id: 'wf-dts', where: 'Med-surg, 22:00', q: 'Who first?',
      pts: [
        { p: { n: 'Mr. Tate', a: 52, x: 'M', sk: 1, h: ['shag', '#6B5440'], e: ['beard'] }, line: 'Last drink 2 days ago. Sweating, shaking, HR 118. Says there are bugs on the wall.', ok: 1 },
        { p: { n: 'Ms. Ortiz', a: 33, x: 'F', sk: 4, h: ['long', '#1E1612'] }, line: 'Depression. Says she\'s tired of living. No plan.', w: 'Needs a suicide risk assessment today. Untreated severe withdrawal can kill within hours.' },
        { p: { n: 'Mr. Bloom', a: 47, x: 'M', sk: 2, h: ['short', '#4A3A2C'], e: ['glasses'] }, line: 'Hears voices telling him to leave. Calm, in his room.', w: 'Assess the command voices soon; he\'s calm and safe right now.' },
        { p: { n: 'Ms. Kay', a: 19, x: 'F', sk: 0, h: ['ponytail', '#C8A070'] }, line: 'Anorexia, day 3 of refeeding. Phosphorus 2.4.', w: 'Just under normal: watch closely and report. She\'s stable now.' },
      ],
      why: 'Hallucinations, tremor and a fast pulse two days after the last drink point to severe withdrawal. Delirium tremens can kill.',
      pearl: 'Alcohol withdrawal peaks at 24 to 72 hours. Score it (CIWA), treat it, and watch for seizures.' },

    { id: 'wf-neutro', where: 'Oncology, 16:00', q: 'Who first?',
      pts: [
        { p: { n: 'Mr. Shah', a: 58, x: 'M', sk: 4, h: ['balding', '#2A2220'] }, line: 'ANC 300. Temp just came back 38.4.', ok: 1 },
        { p: { n: 'Mrs. Kerr', a: 66, x: 'F', sk: 1, h: ['short', '#B8B0A6'], e: ['glasses'] }, line: 'Mouth sores, pain 7 of 10, not drinking much.', w: 'Needs pain control and fluids, but not the one-hour clock of neutropenic fever.' },
        { p: { n: 'Ms. Bell', a: 49, x: 'F', sk: 7, h: ['bun', '#120C09'] }, line: 'Platelets 18,000. A few new bruises.', w: 'Bleeding precautions and report, but no active bleeding.' },
        { p: { n: 'Mr. Young', a: 70, x: 'M', sk: 2, h: ['swoop', '#C9C2B8'] }, line: 'Hemoglobin 7.8. Tired, vitals stable.', w: 'May need a transfusion today; stable.' },
      ],
      why: 'Fever with neutropenia is an emergency. Without neutrophils, infection spreads fast; antibiotics are due within an hour.',
      pearl: 'Neutropenic fever: cultures and antibiotics within the hour. The conversation about hospice matters, and comes next.' },
  ];

  /* ---------------- SBAR: build the call, line by line ---------------- */
  const sbar = [
    { id: 'sb-hf', p: { n: 'Samuel Ortiz', a: 71, x: 'M', sk: 5, h: ['balding', '#D9D3CB'], c: GOWN, e: ['mustache', 'wrinkles', 'cannula'], sm: .3 },
      to: 'Dr. Chen, hospitalist', at: '02:40', setup: 'Heart failure, EF 30%. He can\'t lie flat. RR 26. SpO₂ 90% on 2 L. Crackles halfway up. Weight up 2 kg.',
      v: { rr: 26, spo2: 90, lean: .5, anxious: .4 }, good: { rr: 18, spo2: 95, lean: 0 }, bad: { rr: 32, spo2: 85, lean: .9, anxious: .8 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'Dr. Chen, this is the nurse for 418, Samuel Ortiz. He\'s more short of breath: SpO₂ 90% on 2 liters.', ok: 1 },
          { t: 'Dr. Chen, this is the nurse for 418, Samuel Ortiz. His vitals are RR 26, HR 104, BP 148/90, temp 37.1.', w: 'Numbers with no headline. Say what changed first: he\'s more short of breath, SpO₂ 90% on 2 L.' },
          { t: 'Dr. Chen, this is the nurse for 418, Samuel Ortiz. He has heart failure and I\'m a little worried about him.', w: 'Sounds polite, but it gives her nothing to act on. Lead with the change and the number.' }] },
        { k: 'B', q: 'Give the background she needs.', o: [
          { t: 'Admitted yesterday for heart failure, EF 30%. One dose of IV furosemide yesterday. Weight up 2 kg.', ok: 1 },
          { t: '71, here for heart failure. History of hypertension, diabetes, CKD stage 3, gout and atrial fibrillation.', w: 'A history list buries what matters tonight: the EF, the one dose of furosemide, and the 2 kg gain.' },
          { t: 'Admitted yesterday for heart failure. His home meds include furosemide 40 mg by mouth daily.', w: 'Close, but it leaves out the EF and the 2 kg weight gain, the facts that frame the call.' }] },
        { k: 'A', q: 'What do you think is going on?', o: [
          { t: 'Crackles halfway up, RR 26, can\'t lie flat. I think he\'s fluid overloaded and getting worse.', ok: 1 },
          { t: 'Crackles and a fever would fit pneumonia. I think he may be developing an infection.', w: 'He has no fever. Crackles halfway up, orthopnea and a 2 kg gain with an EF of 30% point to fluid.' },
          { t: 'He\'s breathing fast and seems anxious. I think the anxiety is making his breathing worse. He settles when I sit with him.', w: 'Anxiety can follow air hunger, but the crackles and weight gain say fluid. Name the likely cause.' }] },
        { k: 'R', q: 'Ask for what he needs.', o: [
          { t: 'I\'d like another dose of IV furosemide, a chest X-ray, and for you to see him.', ok: 1 },
          { t: 'Could you put in some orders for his breathing?', w: 'Too vague. Ask for what you think he needs: a diuretic, an X-ray, and a look.' },
          { t: 'He\'s frightened and working hard. Can I give him the PRN morphine for his air hunger and see if he settles?', w: 'Morphine may ease the feeling but doesn\'t treat the fluid. Ask for the diuretic and an evaluation.' }] },
        { k: '✓', q: 'She gives an order. Close the loop.', say: '"Furosemide 80 milligrams IV now, portable chest X-ray, and I\'m coming up."', o: [
          { t: 'Read back: furosemide 80 mg IV now, portable chest X-ray, you\'re on your way. Correct?', ok: 1 },
          { t: 'Read back: furosemide 40 mg IV now, portable chest X-ray, you\'re on your way.', w: 'She said 80 mg. The read-back is how wrong numbers get caught.' },
          { t: 'Okay, furosemide and an X-ray. I\'ll get those going.', w: 'No numbers repeated, so a wrong dose or route can\'t be caught.' }] },
      ],
      win: '"Good call. That\'s exactly what I needed." He diureses a liter by morning and sleeps propped up.',
      lose: '"I\'m not following what you need." It takes three more minutes to get an order while he works to breathe.',
      pearl: 'Situation in one sentence, the background that matters, your assessment, a clear ask, and a read-back.' },

    { id: 'sb-sepsis', p: { n: 'Eleanor Whitfield', a: 82, x: 'F', sk: 1, h: ['curls', '#ECE8E3'], c: GOWN, e: ['pearls', 'wrinkles'], sm: .2 },
      to: 'Dr. Patel, hospitalist', at: '10:15', setup: 'UTI, admitted yesterday. Now she doesn\'t know where she is. T 38.7, HR 116, BP 88/52, RR 24.',
      v: { temp: 38.7, hr: 116, sbp: 88, confused: true }, good: { temp: 37.6, hr: 92, sbp: 108 }, bad: { temp: 39.2, hr: 132, sbp: 74, alert: 1, confused: true },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Eleanor Whitfield in 416. I\'m worried she\'s septic: new confusion, BP 88/52, HR 116, temp 38.7.', ok: 1 },
          { t: 'This is the nurse for Eleanor Whitfield in 416. She\'s newly confused this morning and her temp is up to 38.7. Can you take a look?', w: 'Missing the low pressure and fast pulse that make this urgent, and the word sepsis.' },
          { t: 'This is the nurse for 416. Her vitals are off this morning: BP 88/52, HR 116, RR 24, temp 38.7, SpO₂ 95% on room air.', w: 'The numbers are there but not your worry. Say "I think she\'s septic" and the new confusion.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'UTI, admitted yesterday. First dose of ceftriaxone was due at 08:00 but is still waiting on pharmacy.', ok: 1 },
          { t: '82, admitted yesterday for a UTI. History of hypertension and osteoarthritis. She lives alone with her cat.', w: 'Leaves out the delayed antibiotic, the fact that changes the plan.' },
          { t: 'UTI, admitted yesterday. She was a little confused on admission, so this may be her baseline.', w: 'She was oriented at 07:00. Calling it baseline delays sepsis care.' }] },
        { k: 'A', q: 'Your assessment.', o: [
          { t: 'She was oriented at 07:00. With the fever, low pressure and fast pulse, I think this is sepsis.', ok: 1 },
          { t: 'Her mouth is dry and her urine is dark. I think she\'s dehydrated from not drinking since yesterday.', w: 'Dehydration doesn\'t explain a fever with a known infection. Name sepsis.' },
          { t: 'She\'s pulling at her lines and calling for her cat. I think she\'s delirious, maybe from the new environment.', w: 'She is delirious, but from a cause: infection with low pressure. The cause is the assessment.' }] },
        { k: 'R', q: 'Your ask.', o: [
          { t: 'I\'d like blood cultures, a lactate, a fluid bolus, the antibiotic now, and you at the bedside.', ok: 1 },
          { t: 'Can I give acetaminophen for the fever, push oral fluids, and recheck her vitals in an hour?', w: 'Treats the number, not the sepsis. An hour\'s delay matters.' },
          { t: 'Could you see her when you\'re next on the unit? I\'ll keep a close eye on her vitals until then.', w: 'No time frame and no bundle. Ask for cultures, lactate, fluid, antibiotic, and a bedside look now.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Two sets of cultures, lactate, 30 mL per kilo of lactated Ringer\'s, then the ceftriaxone. I\'ll be there in five."', o: [
          { t: 'Read back: two blood cultures, lactate, 30 mL/kg lactated Ringer\'s, then ceftriaxone. See you in five.', ok: 1 },
          { t: 'Read back: two blood cultures, lactate, 30 mL/kg normal saline, then ceftriaxone. See you in five.', w: 'She ordered lactated Ringer\'s, not normal saline.' },
          { t: 'Okay, cultures, lactate, fluid and the antibiotic. I\'ll get all of that started right away and see you in five.', w: 'No numbers repeated. The read-back exists to catch a wrong volume or drug.' }] },
      ],
      win: 'Antibiotics are in within the hour. By afternoon she asks after her cat by name.',
      lose: 'The plan takes another 40 minutes to come together. Her pressure drifts to 74.',
      pearl: 'Lead with your worry. "I think she\'s septic" gets action faster than a list of numbers.' },

    { id: 'sb-bleed', p: { n: 'Margaret Doyle', a: 76, x: 'F', sk: 0, h: ['short', '#D0C8BE'], c: GOWN, e: ['glasses', 'wrinkles'], sm: .2 },
      to: 'Dr. Abara, orthopedics', at: '06:20', setup: 'Hip replacement yesterday. Hemoglobin 7.1, down from 10.2. HR 112. BP 94/60. Dressing soaked through.',
      v: { hr: 112, sbp: 94, pale: .6 }, good: { hr: 88, sbp: 112, pale: .2 }, bad: { hr: 128, sbp: 80, pale: .9, alert: 1 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Margaret Doyle, hip replacement yesterday. Her hemoglobin dropped from 10.2 to 7.1 and she\'s tachycardic at 112.', ok: 1 },
          { t: 'This is the nurse for Margaret Doyle, hip replacement yesterday. Her hemoglobin this morning came back at 7.1 and I wanted you to know.', w: 'Give the trend and the heart rate. 7.1 alone may not sound urgent; 10.2 to 7.1 with HR 112 does.' },
          { t: 'This is the nurse for Margaret Doyle, hip replacement yesterday. She\'s pale and a bit dizzy this morning when she sits up.', w: 'No numbers and no worry stated.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Right total hip yesterday. On enoxaparin for clot prevention. The dressing is soaked through.', ok: 1 },
          { t: 'Right total hip yesterday. History of osteoporosis and hypothyroidism. She takes levothyroxine at home.', w: 'Leaves out the enoxaparin and the soaked dressing.' },
          { t: 'Right total hip yesterday. Estimated blood loss in the OR was 400 mL and she got 2 liters of fluid.', w: 'Useful, but the anticoagulant and the soaked dressing matter more right now.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'BP 94/60, she\'s pale and dizzy sitting up. I think she\'s bleeding.', ok: 1 },
          { t: 'Her urine output is fine. I think it\'s dilution from the IV fluids she got overnight.', w: 'Fluids can lower hemoglobin a little, not 3 points with a fast pulse and a soaked dressing.' },
          { t: 'BP 94/60. I think she\'s dehydrated and needs fluids.', w: 'Low pressure and a fast pulse, yes, but the falling hemoglobin says blood loss.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'d like a type and crossmatch, to hold the enoxaparin, and for you to look at the wound.', ok: 1 },
          { t: 'Her pressure is soft. Can I give her a 500 mL fluid bolus and recheck her pressure when it\'s in?', w: 'May be part of the plan, but ask for blood, holding the enoxaparin, and a look at the wound.' },
          { t: 'Can I recheck the hemoglobin at noon and call you if it\'s dropped again?', w: 'Too slow for an active bleed.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Hold the enoxaparin. Type and cross, transfuse one unit, recheck after. I\'ll be up after this case."', o: [
          { t: 'Read back: hold enoxaparin, type and cross, transfuse one unit, recheck after. You\'re coming after your case.', ok: 1 },
          { t: 'Read back: hold enoxaparin, type and cross, transfuse two units, recheck after. You\'re coming after your case.', w: 'He said one unit.' },
          { t: 'Okay, hold the enoxaparin and get blood going. I\'ll let you know how she does. Thanks.', w: 'No details repeated, so the unit count and recheck can\'t be confirmed.' }] },
      ],
      win: 'One unit and a pressure dressing later, her heart rate is 88 and she\'s pink.',
      lose: 'Nobody sees the wound until noon. She needs two units by then.',
      pearl: 'Give the trend, not just the number: "10.2 to 7.1" says more than "7.1".' },

    { id: 'sb-pca', p: { n: 'Kevin Ramos', a: 44, x: 'M', sk: 4, h: ['short', '#1E1612'], c: GOWN, e: ['beard'], sm: .1 },
      to: 'Rapid response nurse, then the surgeon', at: '03:05', setup: 'Day 1 after bowel surgery on a morphine PCA. You can\'t wake him. RR 7, SpO₂ 84%. You stopped the PCA and gave naloxone per protocol. He\'s waking.',
      v: { rr: 7, spo2: 84, alert: 2 }, good: { rr: 14, spo2: 95, alert: 0, pain: 5 }, bad: { rr: 6, spo2: 80, alert: 2 },
      steps: [
        { k: 'S', q: 'Open the call to the surgeon.', o: [
          { t: 'This is the nurse for Kevin Ramos. He had opioid oversedation on his PCA: RR 7 and SpO₂ 84%. I stopped it and gave naloxone; he\'s rousing.', ok: 1 },
          { t: 'This is the nurse for Kevin Ramos. He had a low respiratory rate on his PCA a few minutes ago, but he\'s awake and okay now.', w: 'Undersells it. Say oversedation, the numbers, and what you did.' },
          { t: 'This is the nurse for Kevin Ramos, bowel resection yesterday. I gave naloxone a few minutes ago and he\'s awake and talking to me now, so the worst is over.', w: 'Missing what happened and the numbers that made you act.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Bowel resection yesterday. Morphine PCA with a basal rate. History of sleep apnea, no CPAP here.', ok: 1 },
          { t: 'Bowel resection yesterday. Morphine PCA for pain, which was a 6 out of 10 overnight.', w: 'Leaves out the basal rate and the sleep apnea, the two risk factors.' },
          { t: 'Bowel resection yesterday. 44, on a morphine PCA, no significant medical history.', w: 'Not true: sleep apnea is the key history.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'Now RR 12, SpO₂ 93% on 2 L, sedation improving. The naloxone may wear off before the morphine does.', ok: 1 },
          { t: 'RR 12, SpO₂ 93% on 2 L. He\'s awake and talking now, so I think he\'s out of danger.', w: 'Naloxone wears off before morphine does. He can go back under.' },
          { t: 'He says he only pressed the button twice all night. I think the PCA pump may have malfunctioned, and I\'ve tagged it.', w: 'The basal rate and his sleep apnea explain it.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'d like the basal rate stopped, continuous pulse oximetry, and a new pain plan. Can you see him?', ok: 1 },
          { t: 'His pain is back up to a 7. Should I restart the PCA with a lower basal rate?', w: 'Restarting the drug that caused this without new monitoring is the risk. Ask for the basal off and continuous monitoring.' },
          { t: 'Can we stop the PCA altogether and switch him to oral oxycodone instead?', w: 'A new pain plan comes, but first: stop the basal and monitor continuously.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Stop the basal. Continuous oximetry and capnography. Repeat naloxone if RR under 10. I\'ll see him in 20 minutes."', o: [
          { t: 'Read back: basal off, continuous oximetry and capnography, repeat naloxone for RR under 10. You\'re coming in 20.', ok: 1 },
          { t: 'Read back: basal off, continuous oximetry, repeat naloxone for RR under 8. You\'re coming to see him in 20 minutes. Correct?', w: 'He said under 10, and capnography too.' },
          { t: 'Okay, I\'ll stop the basal and keep a close eye on him until you get here in 20.', w: 'Not a read-back: the monitoring and the naloxone threshold aren\'t repeated.' }] },
      ],
      win: 'He is on continuous monitoring with a new pain plan. At dawn he is awake and sore, which is how he should be.',
      lose: 'The naloxone wears off at 04:10. You find him gray again.',
      pearl: 'Act first, then call: stop the opioid and give naloxone by protocol. Then say what you did and what you need.' },

    { id: 'sb-lithium', p: { n: 'Rosa Benitez', a: 47, x: 'F', sk: 5, h: ['long', '#1E1612'], c: 'blouse', e: ['hoops'], sm: .1 },
      to: 'Dr. Lund, psychiatrist on call', at: '20:30', setup: 'Bipolar disorder on lithium. Vomiting since lunch. Coarse tremor. Slow to answer. Stat level: 2.1.',
      v: { tremor: .7, nausea: true, confused: true }, good: { tremor: .2 }, bad: { tremor: .9, alert: 1, confused: true },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Rosa Benitez on 3 East. I\'m worried about lithium toxicity: level 2.1, vomiting, coarse tremor and new slowing.', ok: 1 },
          { t: 'This is the nurse for Rosa Benitez on 3 East. She\'s been vomiting since lunch and can\'t keep anything down.', w: 'Lead with the danger: possible lithium toxicity and the level.' },
          { t: 'This is the nurse for Rosa Benitez on 3 East. Her stat lithium level just came back at 2.1.', w: 'Add the symptoms; the number with the coarse tremor and slowing is the story.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Lithium 600 mg twice a day. Started ibuprofen for a toothache three days ago. Last level was 0.9.', ok: 1 },
          { t: 'Bipolar I, on lithium 600 mg twice a day and quetiapine 200 mg at night. No drug allergies that I know of.', w: 'Missing the new ibuprofen and the last level.' },
          { t: 'She\'s been stable on lithium for years and her levels are usually fine.', w: 'Past stability is why the new ibuprofen and the vomiting matter now. Say them.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'I think this is lithium toxicity, made worse by the ibuprofen and the vomiting. She needs a medical evaluation.', ok: 1 },
          { t: 'Two other patients on the unit were sick this week. I think she has a stomach virus.', w: 'Vomiting with a coarse tremor and slowing at 2.1 is toxicity.' },
          { t: 'Her mouth is dry and she\'s dizzy standing. I think she\'s dehydrated from the vomiting.', w: 'True but incomplete. Dehydration is driving lithium toxicity; name the toxicity.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'d like to hold lithium and ibuprofen, get a chemistry panel, and transfer her to the ED for evaluation.', ok: 1 },
          { t: 'Should I give ondansetron for the vomiting, push fluids by mouth, and recheck the lithium level in the morning?', w: 'Treating the nausea masks the toxicity.' },
          { t: 'Can we lower her lithium dose tonight and recheck a level in a few days?', w: 'She needs it held and a medical evaluation, not a smaller dose.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Hold the lithium and the ibuprofen. Basic panel now. Send her to the ED, I\'ll call them."', o: [
          { t: 'Read back: hold lithium and ibuprofen, basic panel now, transfer to the ED, you\'ll call them.', ok: 1 },
          { t: 'Read back: hold lithium, basic panel now, transfer to the ED, you\'ll call them.', w: 'Missed holding the ibuprofen.' },
          { t: 'Okay, I\'ll hold her meds, get the labs and get her ready to go to the ED.', w: 'Which meds? Repeat them.' }] },
      ],
      win: 'She gets fluids in the ED. Two days later her level is 0.8 and she\'s back for group.',
      lose: 'She seizes at 23:00 on the unit.',
      pearl: 'Name the danger in the first sentence. NSAIDs, dehydration and some blood pressure pills push lithium levels up.' },

    { id: 'sb-hyperk', p: { n: 'Arthur Hale', a: 67, x: 'M', sk: 2, h: ['balding', '#B6A58E'], c: GOWN, e: ['wrinkles', 'mustache'], sm: .2 },
      to: 'Dr. Okoye, hospitalist', at: '05:50', setup: 'Kidney disease, on lisinopril and spironolactone. Morning K 6.6. Peaked T waves. Feels weak.',
      v: { pale: .3 }, good: {}, bad: { hr: 38, alert: 1, pale: .8 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Arthur Hale in 410. His potassium is 6.6 and he has peaked T waves on the monitor.', ok: 1 },
          { t: 'This is the nurse for Arthur Hale in 410. His potassium just came back from the lab at 6.6.', w: 'Add the peaked T waves. That\'s what makes it an emergency.' },
          { t: 'This is the nurse for Arthur Hale in 410. He feels weak this morning and his potassium is high. Can you take a look at his labs?', w: 'Give the number and the ECG change.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Chronic kidney disease, creatinine 2.8. On lisinopril and spironolactone. Yesterday\'s K was 5.4.', ok: 1 },
          { t: 'Chronic kidney disease, hypertension and gout. He isn\'t on dialysis and he\'s making urine.', w: 'Missing the lisinopril and spironolactone, which raise potassium.' },
          { t: 'His potassium was 5.4 yesterday and 6.6 today, so it\'s climbing fast.', w: 'A good trend, but add the meds and the kidney function.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'BP 130/80, HR 64. I think this is dangerous hyperkalemia and could cause an arrhythmia.', ok: 1 },
          { t: 'He has no chest pain and says he feels okay. It may be a hemolyzed sample. Can we redraw it?', w: 'Possible, but peaked T waves on the monitor make it real until proven otherwise.' },
          { t: 'BP 130/80, HR 64. He\'s stable for now; his blood pressure and heart rate are fine.', w: 'A normal pressure doesn\'t protect his heart from a potassium of 6.6.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'d like orders for calcium gluconate, insulin with dextrose, a 12-lead, and a repeat K. And hold his spironolactone.', ok: 1 },
          { t: 'Can you order a repeat potassium, and I\'ll call you back as soon as it results?', w: 'A repeat alone leaves his heart unprotected.' },
          { t: 'Should I give him a dose of IV furosemide and recheck the potassium this afternoon?', w: 'It may help later, but calcium protects the heart now.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Calcium gluconate 1 gram IV, regular insulin 10 units IV with 25 grams of dextrose, 12-lead, repeat K in 2 hours, hold spironolactone and lisinopril."', o: [
          { t: 'Read back: calcium gluconate 1 g IV, regular insulin 10 units IV with 25 g dextrose, 12-lead, repeat K in 2 hours, hold spironolactone and lisinopril.', ok: 1 },
          { t: 'Read back: calcium gluconate 1 g IV, regular insulin 10 units IV, 12-lead on the monitor, repeat potassium in 2 hours. I\'ll call you as soon as it results.', w: 'Missed the dextrose, which prevents a low after IV insulin, and the meds to hold.' },
          { t: 'Okay, calcium, insulin with dextrose, a 12-lead, a repeat potassium, and I\'ll hold his spironolactone and lisinopril.', w: 'No doses repeated.' }] },
      ],
      win: 'The T waves flatten after the calcium. His repeat K is 5.3.',
      lose: 'Nothing is ordered until 07:00. At 06:40 his heart rate drops into the 30s.',
      pearl: 'Critical value + a body sign = say both in the first sentence. Calcium protects the heart; insulin moves potassium into cells.' },

    { id: 'sb-stroke', p: { n: 'Leon Feld', a: 74, x: 'M', sk: 1, h: ['swoop', '#C8C0B6'], c: GOWN, e: ['glasses', 'wrinkles'], sm: 0 },
      to: 'Stroke team, via the stroke alert', at: '15:12', setup: 'Admitted for pneumonia. At 15:05 his right arm is weak and his speech is slurred. Last known well: 14:50, talking normally.',
      v: { confused: true, anxious: .4 }, good: { anxious: .1 }, bad: { alert: 1, confused: true },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'Stroke alert, 4 West room 420. Leon Feld, 74: right arm weakness and slurred speech. Last known well 14:50.', ok: 1 },
          { t: 'Room 420, Leon Feld, 74: new right arm weakness and slurred speech. Can someone come see him?', w: 'Say "stroke alert" and the last known well time.' },
          { t: 'Stroke alert, 4 West room 420. Leon Feld, 74: right arm weakness and slurred speech. Symptoms started at 15:05.', w: '15:05 is when you found him. Last known well is 14:50, and that\'s the time that matters.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Here for pneumonia. History of atrial fibrillation, on no anticoagulant. Glucose 112.', ok: 1 },
          { t: 'Here for pneumonia, day 2 of antibiotics. History of atrial fibrillation, hypertension and diabetes.', w: 'Missing whether he\'s anticoagulated and his glucose.' },
          { t: 'Here for pneumonia. On apixaban for atrial fibrillation. Glucose 112.', w: 'Not true here: he\'s on no anticoagulant. Getting this wrong changes the treatment.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'New right-sided weakness and aphasia. I think he\'s having an acute stroke.', ok: 1 },
          { t: 'He started a new antibiotic today. This could be a reaction to his antibiotic.', w: 'Focal weakness with aphasia is a stroke until proven otherwise.' },
          { t: 'He didn\'t eat much lunch today. It could be low blood sugar.', w: 'Reasonable to check, and you did: 112.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'He\'s NPO and I have an IV. I\'d like the team at the bedside and a head CT now.', ok: 1 },
          { t: 'Should I give his 15:00 meds before he goes down to CT?', w: 'NPO until a swallow screen.' },
          { t: 'He may just be tired. Can we recheck him in 30 minutes and see if it clears up on its own?', w: 'Every minute counts in a stroke.' }] },
        { k: '✓', q: 'Close the loop.', say: '"We\'re on our way. Keep him NPO, neuro checks every 15 minutes, CT is clearing the scanner."', o: [
          { t: 'Read back: NPO, neuro checks every 15 minutes, CT ready now. I\'ll have him on the monitor.', ok: 1 },
          { t: 'Read back: NPO, neuro checks every hour, CT now. I\'ll have him on the monitor and ready to go.', w: 'She said every 15 minutes.' },
          { t: 'Okay, CT and neuro checks. I\'ll get him ready to go.', w: 'No frequency repeated.' }] },
      ],
      win: 'He\'s in the scanner 18 minutes after you noticed. The clot is pulled out. He talks to his daughter that night.',
      lose: 'He gets to CT an hour later. The window for the clot-busting drug has closed.',
      pearl: 'For stroke: the last known well time is the most important number you have. Say it first.' },

    { id: 'sb-asthma', p: { n: 'Jayden Brooks', a: 6, x: 'M', sk: 7, h: ['curlyshort', '#120C09'], c: 'onesie2', e: [], sm: 0, k: .85 },
      to: 'Dr. Ames, pediatric resident', at: '19:40', setup: 'Asthma, 6 years old. He was wheezing; now you hear almost nothing. Sitting forward. SpO₂ 89%. Can\'t finish a sentence.',
      v: { rr: 40, spo2: 89, lean: .8, anxious: .7 }, good: { rr: 26, spo2: 95, lean: .2, anxious: .2 }, bad: { rr: 44, spo2: 82, lean: 1, alert: 1 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Jayden Brooks in 512. He has a silent chest: SpO₂ 89%, sitting forward, can\'t finish sentences. I need you now.', ok: 1 },
          { t: 'This is the nurse for Jayden Brooks in 512. Good news: his wheezing is much quieter now than an hour ago.', w: 'A quiet chest with worse work of breathing is a danger sign, not improvement.' },
          { t: 'This is the nurse for Jayden Brooks in 512. His SpO₂ is 89% on his asthma treatment and he\'s sitting forward.', w: 'Add "silent chest" and "can\'t finish sentences."' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Admitted for asthma today. Albuterol at 18:30, steroid given at 16:00. Two ICU stays for asthma before.', ok: 1 },
          { t: '6 years old, admitted today for an asthma flare after a cold. Mom is at the bedside.', w: 'Missing the last albuterol, the steroid, and the ICU history.' },
          { t: 'He had albuterol at 18:30 and it seemed to help for a little while.', w: 'Add the steroid and his two ICU stays: they tell the resident how fast he can crash.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'Quiet chest with worse work of breathing. He\'s moving very little air. I think he\'s about to tire out.', ok: 1 },
          { t: 'The wheezing is gone and his chest is quiet, so I think the albuterol is working.', w: 'Wheezing disappears when air stops moving.' },
          { t: 'He looks scared and won\'t talk to me. I think he\'s anxious, which is making him breathe faster and tire himself out.', w: 'Anxiety doesn\'t cause a silent chest.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'ve started albuterol back-to-back. I\'d like you at the bedside, and I\'m calling the rapid response team.', ok: 1 },
          { t: 'Can I give another albuterol now and recheck him in an hour to see if it\'s helping?', w: 'Too slow. He needs continuous treatment and help now.' },
          { t: 'He\'s working himself up. Can I give him something to help him calm down and rest?', w: 'Sedating a tiring asthmatic can stop his breathing.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Continuous albuterol, ipratropium, IV magnesium, and get rapid response. I\'m coming."', o: [
          { t: 'Read back: continuous albuterol, ipratropium, IV magnesium, rapid response called. See you now.', ok: 1 },
          { t: 'Read back: albuterol every hour, ipratropium, IV magnesium, rapid response called. See you in a minute.', w: 'She said continuous albuterol, not every hour.' },
          { t: 'Okay, albuterol and magnesium. I\'ll get those going right away.', w: 'Incomplete: no ipratropium, no rapid response, and "okay" isn\'t a read-back.' }] },
      ],
      win: 'By 21:00 he\'s wheezing again, which is the good news, and asking for his tablet.',
      lose: 'He tires out. The PICU team intubates him at 20:25.',
      pearl: 'A quiet chest in a struggling asthmatic is not improvement. It means almost no air is moving.' },
  ];

  /* ---------------- DE-ESCALATION: talk them down ---------------- */
  // m: the agitation meter, 0 to 10. d on an option moves it. win at or under 3 after the last turn; at 9 or more it ends.
  const calm = [
    { id: 'de-ed-wait', p: { n: 'Luis Reyes', a: 34, x: 'M', sk: 4, h: ['short', '#1E1612'], c: 'hoodie', e: ['goatee'], sm: 0 },
      where: 'ED waiting room, 16:20', setup: 'He\'s been waiting six hours with a cut hand. He\'s at the front desk, shouting.', m: 6,
      turns: [
        { say: '"Six HOURS. Nobody tells me ANYTHING in here!"', o: [
          { t: '"Mr. Reyes, I\'m Sam, one of the nurses. Six hours is a long time. Tell me what\'s going on."', d: -2, r: 'He\'s still loud, but he\'s looking at you now.' },
          { t: '"Sir, I understand you\'re frustrated, but you need to calm down or security will walk you out."', d: 3, r: '"Oh, you\'re going to THREATEN me?"' },
          { t: '"Everyone here is waiting, sir. You\'re not the only one who\'s been here six hours."', d: 2, r: 'He slaps the counter.' }] },
        { say: '"My kid\'s home with my sister and she has to leave at five."', o: [
          { t: '"So you need to get home to your kid. Let me find out where you are in line, and I\'ll come back by 16:40."', d: -2, r: 'His shoulders come down an inch.' },
          { t: '"I\'m sorry, but I can\'t do anything about childcare. Is there someone else who can pick her up?"', d: 1, r: '"Then what CAN you do?"' },
          { t: '"I know it\'s been long. You\'ll be seen when it\'s your turn; the sickest people go first, that\'s how triage works."', d: 2, r: '"That\'s what they said four hours ago!"' }] },
        { say: 'He steps in close and points at your face. "Don\'t feed me a line."', o: [
          { t: 'Step back so you\'re out of reach, open hands. "I hear you. I\'m going to give you some space, and I\'ll be back with a real answer."', d: -1, r: 'He drops his hand.' },
          { t: 'Put a hand on his shoulder to reassure him. "Hey, I\'m on your side. Let\'s take a breath together."', d: 3, r: 'He jerks away. "Don\'t touch me!"' },
          { t: 'Hold your ground so he knows you won\'t be pushed around, and match his volume: "I am NOT feeding you a line."', d: 3, r: 'Now you\'re both shouting.' }] },
        { say: '"...Fine. Can I at least get some water?"', o: [
          { t: '"Let me check if you can drink before they stitch you. If yes, I\'ll bring it myself."', d: -2, r: '"Okay. Thanks."' },
          { t: '"No food or water until you\'re seen. That\'s the rule for everyone waiting on a procedure."', d: 1, r: 'He sighs and sits, jaw tight.' },
          { t: '"If you sit down and stay quiet for a while, I\'ll see what I can do about some water."', d: 1, r: '"Like a dog?"' }] },
      ],
      win: 'You come back at 16:38 with a time. He calls his sister and sits down. He thanks you on his way to get stitched.',
      lose: 'Security is called. He leaves without being seen, still bleeding into a towel.',
      pearl: 'Introduce yourself, use their name, name the feeling, find the real need, and stay out of reach.' },

    { id: 'de-hold', p: { n: 'Nadia Farouk', a: 29, x: 'F', sk: 4, h: ['hijab', '#3C5A7A'], c: 'tee', e: [], sm: 0 },
      where: 'Adult psych, 11:00', setup: 'Brought in on a 72-hour hold overnight. She\'s at the locked door, pulling the handle.', m: 6,
      turns: [
        { say: '"You can\'t keep me here! I didn\'t do anything!"', o: [
          { t: '"I\'m Alex, your nurse today. It\'s frightening to wake up somewhere locked. Can we sit and talk about what happens next?"', d: -2, r: 'She lets go of the handle.' },
          { t: '"Actually we can. You\'re on a legal hold, so the doors stay locked until the doctor says otherwise."', d: 2, r: '"So I\'m a prisoner?"' },
          { t: '"Everyone says that on their first day. Give it a little time and you\'ll see it\'s not so bad in here."', d: 2, r: 'She glares and pulls harder.' }] },
        { say: '"How long? Tell me the truth."', o: [
          { t: '"Up to 72 hours for now. You have rights: a patients\' rights advocate, and a hearing if they want to keep you longer."', d: -2, r: '"An advocate. Okay. I want that."' },
          { t: '"Just a few hours, probably. Let\'s not worry about that right now; let\'s get you something to eat."', d: 1, r: 'She looks at you hard. She doesn\'t believe it.' },
          { t: '"That\'s up to the doctor, not me. I just work here. You can ask her when she rounds tomorrow."', d: 1, r: '"Great. Nobody knows anything."' }] },
        { say: '"I need my phone. My mom doesn\'t know where I am."', o: [
          { t: '"Let\'s call her from the unit phone right now. Your phone is locked up safely and you\'ll get it back."', d: -2, r: 'She nods. Her breathing slows.' },
          { t: '"Phones aren\'t allowed on the unit. Those are the rules for everybody, and I can\'t make exceptions."', d: 2, r: '"So I can\'t talk to anyone?"' },
          { t: '"Your mom will find out eventually. The social worker usually calls families in a day or two, so try not to worry."', d: 2, r: 'Her eyes fill and her voice rises.' }] },
        { say: '"Fine. But I\'m not taking any pills."', o: [
          { t: '"You can ask about any medicine before you decide. Nobody will hide anything in your food."', d: -1, r: '"Okay. I\'ll listen."' },
          { t: '"If you don\'t take them, the doctor can order a shot, and nobody wants it to come to that."', d: 3, r: 'She backs into the corner.' },
          { t: '"You\'ll feel better if you do. Everyone feels that way at first, and the medicine really does help."', d: 1, r: '"You don\'t know that."' }] },
      ],
      win: 'She calls her mom, then meets the advocate. By evening she\'s eating dinner in the day room.',
      lose: 'She pulls the fire alarm. The team holds her for an emergency injection.',
      pearl: 'Honesty de-escalates. Explain the hold, her rights, and what happens next. Threats escalate.' },

    { id: 'de-sundown', p: { n: 'Harold Pike', a: 86, x: 'M', sk: 1, h: ['balding', '#E4DED6'], c: GOWN, e: ['wrinkles', 'glasses'], sm: 0 },
      where: 'Med-surg, 18:30', setup: 'Dementia. He\'s out of bed, pulling at his IV, trying the door.', m: 5,
      turns: [
        { say: '"I have to get home. The kids need dinner."', o: [
          { t: '"You\'re thinking about your kids. Tell me about them."', d: -2, r: 'He pauses. "Three boys. Always hungry."' },
          { t: '"Harold, your kids are grown. You\'re in the hospital."', d: 2, r: 'He looks scared. "What hospital? Where are they?"' },
          { t: '"You can\'t go home tonight, Harold. Get back in bed."', d: 2, r: 'He pushes the door harder.' }] },
        { say: '"Who are you? What\'s this thing in my arm?"', o: [
          { t: 'Get to eye level, slow and quiet. "I\'m Jo, a nurse. That\'s medicine to help you. Let\'s keep it safe."', d: -2, r: 'He stops pulling.' },
          { t: 'Gently hold his hand down so he can\'t reach the IV. "Don\'t touch that, Harold, you\'ll hurt yourself."', d: 3, r: 'He shouts and swings his other arm.' },
          { t: '"I told you already, Harold. It\'s your IV, the same one you asked me about ten minutes ago."', d: 1, r: '"You never told me anything."' }] },
        { say: '"I\'m so hungry. When\'s supper?"', o: [
          { t: '"Let\'s get you something now. Sit with me and we\'ll have a snack."', d: -2, r: 'He shuffles to the chair.' },
          { t: '"Dinner was an hour ago, Harold. You ate the whole tray, remember?"', d: 1, r: '"No it wasn\'t."' },
          { t: 'Call the provider and ask for a sedative to help him settle for the night.', d: 0, r: 'The order takes 20 minutes. He\'s still at the door.' }] },
        { say: 'He sits, chewing a graham cracker. "Is it dark out?"', o: [
          { t: '"It is. Let\'s turn on the lamp and close the curtain. Would you like the radio?"', d: -2, r: '"Big band. If you have it."' },
          { t: 'Leave the overheads on and the TV loud so he stays awake until a normal bedtime and sleeps through.', d: 2, r: 'He winces and gets up again.' },
          { t: 'Say nothing, since he\'s settled, and slip out to catch up on your charting.', d: 1, r: 'He\'s at the door again in five minutes.' }] },
      ],
      win: 'He dozes in the chair to big band music, IV intact. No restraints, no sedative.',
      lose: 'He pulls the IV and falls at the door.',
      pearl: 'In dementia: don\'t argue with the reality they\'re in. Join it, redirect, and meet the need underneath (hunger, fear, the dark).' },

    { id: 'de-teen-phone', p: { n: 'Kai', a: 15, x: 'M', sk: 3, h: ['shag', '#1A1410'], c: 'hoodie', e: ['studs'], sm: 0, k: .95 },
      where: 'Teen psych, 21:00', setup: 'Phone time is over. He refuses to hand it back and is swearing at staff.', m: 5,
      turns: [
        { say: '"This is so stupid. I was literally in the middle of something."', o: [
          { t: '"Sounds like I caught you mid-conversation. That\'s frustrating."', d: -2, r: '"Yeah. With my girlfriend."' },
          { t: '"Rules are rules, and phone time is over for everyone. Hand it to me, please."', d: 2, r: 'He shoves the phone in his pocket.' },
          { t: '"Watch your language. You don\'t talk to staff like that here."', d: 2, r: 'He says it again, louder.' }] },
        { say: '"Everyone else got five extra minutes yesterday."', o: [
          { t: '"You can take two minutes to say goodnight, then hand it to me. Or hand it now and have first phone time tomorrow."', d: -2, r: 'He thinks about it.' },
          { t: '"I don\'t care what happened yesterday. I wasn\'t here, and tonight phone time ends when I say it ends."', d: 1, r: '"Of course you don\'t."' },
          { t: '"Fine, keep it tonight. But this is a one-time thing, and I want it handed in first thing in the morning."', d: -1, r: 'He calms, but now every teen on the unit wants the same deal.' }] },
        { say: '"Whatever. You can\'t make me."', o: [
          { t: '"You\'re right, I won\'t grab it. I\'d rather you choose. Two minutes?"', d: -2, r: 'He exhales. "Two minutes."' },
          { t: 'Call three staff to stand around him until he hands it over.', d: 3, r: 'He backs against the wall, fists up.' },
          { t: '"Then you lose phone time tomorrow too. And the day after, if you keep this up."', d: 1, r: '"I don\'t care!" He does.' }] },
        { say: 'He hands it over. "Can I at least have music to fall asleep?"', o: [
          { t: '"Yes, the unit player\'s in the day room. Thanks for handing it over. That took something."', d: -2, r: 'A tiny shrug. Almost a smile.' },
          { t: '"Don\'t push it. You already got more chances tonight than you should have."', d: 1, r: 'He slams his door.' },
          { t: '"We\'ll see. It depends how the rest of the night goes."', d: 0, r: 'He shrugs.' }] },
      ],
      win: 'He says goodnight to his girlfriend and gives you the phone. He falls asleep to music.',
      lose: 'It ends in a hold and a seclusion room. He doesn\'t speak to staff for two days.',
      pearl: 'With teens, give two acceptable choices and a way to save face. Power struggles have no winner.' },

    { id: 'de-withdrawal', p: { n: 'Greg Tate', a: 52, x: 'M', sk: 1, h: ['shag', '#6B5440'], c: GOWN, e: ['beard'], sm: 0 },
      where: 'Med-surg, 02:00', setup: 'Admitted for pancreatitis. Shouting, sweating, shaking. Last drink was about 48 hours ago.', m: 6,
      turns: [
        { say: '"Get them OFF me! The bugs, they\'re on the wall!"', o: [
          { t: 'Check his vital signs and score his withdrawal.', d: -1, r: 'HR 124, BP 168/98, T 38.1. Withdrawal score: 24. Severe.' },
          { t: '"There are no bugs. You\'re imagining it."', d: 2, r: '"You\'re lying! They\'re right there!"' },
          { t: '"Keep it down, please. People are trying to sleep."', d: 2, r: 'He throws his water cup.' }] },
        { say: '"Make it stop. Please. I\'m scared."', o: [
          { t: 'Give the lorazepam ordered for his withdrawal score, and tell him it will help.', d: -3, r: 'Twenty minutes later his hands are steadier.' },
          { t: 'Give haloperidol for the hallucinations, since that\'s what\'s scaring him.', d: 0, r: 'It doesn\'t treat withdrawal, and it lowers the seizure threshold.' },
          { t: 'Tell him this is what happens when you drink, and that he did this to himself.', d: 3, r: 'He pulls at his IV.' }] },
        { say: '"Everything\'s so loud. And bright."', o: [
          { t: 'Lower the lights, close the door, one calm voice.', d: -2, r: 'He closes his eyes.' },
          { t: 'Move him by the nurses\' station where it\'s busy.', d: 1, r: 'He flinches at every phone ring.' },
          { t: 'Put on the TV to give him something else to look at.', d: 1, r: 'He thinks the TV is talking to him.' }] },
        { say: 'Quieter now. "Am I going to die?"', o: [
          { t: '"You\'re in the right place. We\'re watching you closely and treating it. I\'ll be back every 30 minutes."', d: -2, r: '"Okay." He holds the rail, not your arm.' },
          { t: '"I won\'t lie to you: people do die from alcohol withdrawal, so you need to do exactly what we tell you tonight."', d: 2, r: 'His heart rate jumps.' },
          { t: '"Just try to sleep. You\'ll feel a lot better in the morning, I promise."', d: 0, r: 'He watches the door.' }] },
      ],
      win: 'His score falls to 8 by morning. No seizure. He asks about rehab before discharge.',
      lose: 'He has a seizure at 03:10.',
      pearl: 'Agitation can be medical. Withdrawal, low glucose, low oxygen and pain all look like "behavior." Assess before you redirect.' },

    { id: 'de-family', p: { n: 'Dana Whitfield', a: 52, x: 'F', sk: 1, h: ['bob', '#8A5A3A'], c: 'blouse', e: ['glasses'], sm: 0 },
      where: 'Med-surg, 13:00', setup: 'A daughter found her mother wet, with the call light on for 20 minutes. She\'s at the station, furious.', m: 6,
      turns: [
        { say: '"My mother sat in urine for TWENTY minutes. Where was everyone?"', o: [
          { t: '"I\'m so sorry. That shouldn\'t have happened. Let\'s go to her together right now."', d: -3, r: '"...Thank you."' },
          { t: '"I\'m sorry, but we have a lot of patients today and we\'re short one aide."', d: 2, r: '"That\'s not my problem."' },
          { t: '"I wasn\'t her nurse this morning, so I can\'t tell you what happened before I got here."', d: 2, r: '"Then who was?"' }] },
        { say: 'Back in the room, after you\'ve changed her: "This keeps happening."', o: [
          { t: '"Tell me what you\'ve seen. I\'m going to set up a toileting schedule every two hours and write it on her board."', d: -2, r: 'She takes a breath and lists three things.' },
          { t: '"I\'m sure it\'s not that often. The aides round every two hours and I haven\'t heard about any other times."', d: 2, r: '"Are you calling me a liar?"' },
          { t: '"You can file a complaint with patient relations downstairs. They\'re open until five."', d: 1, r: '"Oh, I will."' }] },
        { say: '"I want to talk to someone in charge."', o: [
          { t: '"Of course. I\'ll get the charge nurse now, and I\'ll stay until she arrives."', d: -2, r: '"Okay. Good."' },
          { t: '"That\'s not necessary. I\'m her nurse and I can handle whatever you need."', d: 2, r: '"No. I want someone in charge."' },
          { t: '"She\'s busy with a new admission right now. I can leave her a note for later."', d: 2, r: 'She raises her voice again.' }] },
        { say: '"I just want her to be treated like she matters."', o: [
          { t: '"She does. I\'ll check on her myself every hour today. Here\'s the unit number if you want an update."', d: -2, r: 'Her eyes well up. "Thank you."' },
          { t: '"We treat everyone the same here. Every patient gets the same care, no matter who they are."', d: 1, r: '"That\'s what worries me."' },
          { t: '"I understand. I\'d feel exactly the same way if it were my own mother lying in that bed, believe me."', d: 0, r: 'She nods, unconvinced.' }] },
      ],
      win: 'The charge nurse meets her. The schedule holds all week. She brings cookies on Friday.',
      lose: 'She posts about it online that night and asks to move her mother to another hospital.',
      pearl: 'With angry families: apologize for the experience, act right away, and follow through on what you promise.' },

    { id: 'de-chair', p: { n: 'Victor Kane', a: 38, x: 'M', sk: 6, h: ['buzz', '#120C09'], c: 'tee', e: ['beard'], sm: 0 },
      where: 'Adult psych, 15:00', setup: 'He\'s been pacing all morning. Now he picks up a chair in the day room. Two other patients are nearby.', m: 7,
      turns: [
        { say: 'He raises the chair. "Everybody get BACK!"', o: [
          { t: 'Keep your distance, call for help, and get the other patients out.', d: -1, r: 'The team is on the way. The other patients are out.' },
          { t: 'Walk up to him alone, slowly, and try to take the chair.', d: 3, r: 'He swings it.' },
          { t: 'Stay where you are and keep talking to him, alone, with the others watching.', d: 1, r: 'He turns toward the other patients.' }] },
        { say: 'Team at the door. He\'s breathing hard. "They\'re saying I\'m going to die in here."', o: [
          { t: 'One person talks, from a distance: "Victor, it\'s Sam. You\'re safe. Nobody\'s going to hurt you. Can you set the chair down?"', d: -2, r: 'He lowers the chair a few inches.' },
          { t: 'Everyone on the team talks at once, each trying a different way to reach him.', d: 2, r: 'He backs up and raises it again.' },
          { t: 'From the doorway, firm and loud so he knows you mean it: "Victor, put it down NOW."', d: 2, r: 'He grips it tighter.' }] },
        { say: 'He sets the chair down. "I can\'t stop hearing them."', o: [
          { t: '"That sounds exhausting. You have a medicine that can quiet them down. Will you take it by mouth?"', d: -2, r: '"Yeah. Okay."' },
          { t: 'Signal the team to hold him for an injection now that the chair is down and his hands are free.', d: 3, r: 'He fights the hold.' },
          { t: '"Good. Now go to your room and stay there until you\'ve calmed down."', d: 1, r: 'He sits on the floor and won\'t move.' }] },
        { say: 'After the medicine: "I didn\'t want to hurt anybody."', o: [
          { t: '"I know. You stopped. Let\'s talk later about what helps when the voices get loud."', d: -2, r: 'He nods and lies down.' },
          { t: '"You scared a lot of people tonight, Victor. We\'re going to have to talk about that."', d: 1, r: 'He stares at the floor.' },
          { t: 'Say nothing. He needs to sit with what he did.', d: 0, r: 'He watches the door.' }] },
      ],
      win: 'He takes the oral medicine. No restraint. That evening he plans with you what to do next time.',
      lose: 'Someone gets hurt. He spends the night in seclusion.',
      pearl: 'When there\'s a weapon: distance, help, and clear the area first. One voice. Offer oral medicine before anything more restrictive.' },

    { id: 'de-pain', p: { n: 'Tina Marsh', a: 45, x: 'F', sk: 0, h: ['ponytail', '#8A5A3A'], c: GOWN, e: [], sm: 0 },
      where: 'Surgical, 04:00', setup: 'Day 1 after abdominal surgery. You\'re here for vitals. She yanks her arm away.', m: 5,
      turns: [
        { say: '"STOP poking me! Every hour, all night!"', o: [
          { t: '"You haven\'t slept at all. That\'s awful. How\'s your pain right now?"', d: -2, r: '"Nine. It\'s a nine."' },
          { t: '"I have to do vitals every four hours after surgery. It\'s hospital policy."', d: 1, r: '"I don\'t CARE about policy."' },
          { t: 'Put the cuff on anyway. It only takes a minute.', d: 3, r: 'She rips it off.' }] },
        { say: '"Nine. Nobody\'s given me anything since ten."', o: [
          { t: 'Check her MAR: hydromorphone is due. "You\'re due for pain medicine. Let me do your pressure first, then give it."', d: -2, r: 'She offers her arm.' },
          { t: '"Pain is expected after surgery. It usually gets better by the second or third day."', d: 2, r: '"So I just have to suffer?"' },
          { t: '"You\'ll have to ask the doctor in the morning. I can\'t change your orders in the middle of the night."', d: 2, r: 'She starts to cry, furious.' }] },
        { say: '"And can you all stop waking me up?"', o: [
          { t: '"Let\'s group things: I\'ll do your next checks and meds together at 08:00, and put a sign on your door."', d: -2, r: '"You can do that?"' },
          { t: '"No. That\'s the schedule after surgery, and it\'s there to keep you safe."', d: 1, r: 'She turns away.' },
          { t: '"Sure, I\'ll skip your vitals for the rest of tonight so you can get some real sleep."', d: -1, r: 'She settles, but you\'ve skipped checks she still needs.' }] },
        { say: 'Thirty minutes later: "It\'s a four now."', o: [
          { t: '"Good. Get some sleep. The light\'s by your hand if it creeps back up."', d: -2, r: 'She\'s asleep before you leave.' },
          { t: '"See? You didn\'t need to yell. All you had to do was ask me nicely the first time."', d: 2, r: '"Wow."' },
          { t: 'Leave quietly without saying anything so she can sleep.', d: 0, r: 'She stares at the ceiling.' }] },
      ],
      win: 'She sleeps three hours straight. At breakfast she says, "Thanks for listening last night."',
      lose: 'She refuses all vitals until morning and asks for a new nurse.',
      pearl: 'Pain is a common cause of anger. Ask about pain first, then explain, then cluster care so people can sleep.' },
  ];

  S.drillData = { med, first, sbar, calm };
})(window.Shift = window.Shift || {});
