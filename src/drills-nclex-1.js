/* The Shift — NCLEX-level drill cards (lv: 2), part 1: Med Pass and Who's First.
   Harder on purpose: every option is something a reasonable nurse might do, the checks all matter, and the right
   answer is often "give" (the trap is holding what's safe). Every wrong option says why (w).
   Clinical review: docs/DRILLS-REVIEW.md. */
(function (S) {
  const D = S.drillData, GOWN = 'gown';

  D.med.push(
    { id: 'mp-h-digoxin-k', lv: 2, p: { n: 'Harold Banks', a: 78, x: 'M', sk: 2, h: ['balding', '#C9C2B8'], c: GOWN, e: ['wrinkles', 'glasses'], sm: .3 },
      med: 'Digoxin 0.125 mg PO', for: 'Atrial fibrillation with heart failure', line: 'He also takes furosemide 40 mg daily. Morning labs just posted. He feels fine.',
      check: [{ t: 'Potassium', v: 'K 3.2.', ok: 1 }, { t: 'Apical pulse for a full minute', v: 'Apical 72, irregular.' }, { t: 'Yesterday\'s digoxin level', v: '1.0 ng/mL, in range.' }],
      pick: [{ t: 'Hold it and call about the potassium first', ok: 1 }, { t: 'Give it: his pulse is over 60 and the level is in range', w: 'Both are reassuring, but a low potassium makes even an in-range digoxin level toxic to the heart. Report the K before the dose.' }, { t: 'Give it and ask for potassium replacement afterward', w: 'Close. The order matters: the provider may want the potassium corrected before he gets more digoxin.' }],
      why: 'Low potassium lets digoxin bind more tightly to the heart, so toxicity can happen at a normal level. Furosemide is pulling his potassium down.',
      pearl: 'Digoxin: apical pulse, potassium and the level. Hypokalemia, hypomagnesemia and hypercalcemia all raise the risk of toxicity even when the level looks fine.',
      v: {}, good: {}, bad: { hr: 46, nausea: true, pale: .4 },
      goodLine: 'Potassium is replaced first; the digoxin goes in that afternoon without trouble.', badLine: 'That evening the monitor shows runs of PVCs and a slow, irregular rate.' },

    { id: 'mp-h-lisinopril-give', lv: 2, p: { n: 'Maria Santos', a: 64, x: 'F', sk: 4, h: ['bob', '#3A302A'], c: GOWN, e: ['hoops'], sm: .4 },
      med: 'Lisinopril 10 mg PO (hold for SBP under 100)', for: 'Hypertension and diabetic kidney disease', line: 'She feels well and wants to walk to the window.',
      check: [{ t: 'Blood pressure, against the hold parameter', v: 'BP 104/64. No dizziness sitting or standing.', ok: 1 }, { t: 'This morning\'s potassium level', v: 'K 4.6.' }, { t: 'Creatinine against her baseline', v: '1.1, stable.' }],
      pick: [{ t: 'Give it', ok: 1 }, { t: 'Hold it: 104 is too close to the line', w: 'Parameters exist so you don\'t have to guess. She\'s above it, without symptoms, and the drug also protects her kidneys.' }, { t: 'Give half the dose', w: 'Changing a dose isn\'t a nursing decision. Either the parameter is met or it isn\'t.' }],
      why: 'Her pressure is above the hold line, she has no symptoms of low blood pressure, and her potassium and kidney function are fine. Holding without a reason is a missed dose.',
      pearl: 'Hold parameters cut both ways: under the line, hold and report; over it, give. Check orthostatic symptoms if you\'re unsure.',
      v: {}, good: {}, bad: { pain: 2 },
      goodLine: 'She walks to the window and back, steady on her feet.', badLine: 'Missed doses add up; her pressure is 168/96 by evening.' },

    { id: 'mp-h-enox-plt', lv: 2, p: { n: 'Owen Price', a: 70, x: 'M', sk: 1, h: ['short', '#B8B0A6'], c: GOWN, e: ['wrinkles'], sm: .3 },
      med: 'Enoxaparin 40 mg SubQ', for: 'Clot prevention after hip surgery', line: 'Day 2 after surgery. A colleague wonders if he should get it with his platelets down.',
      check: [{ t: 'Platelets, against his baseline', v: '141,000, from 168,000 before surgery.', ok: 1 }, { t: 'Creatinine, for the dose', v: '0.9.' }, { t: 'Look at the incision and his skin', v: 'Dressing dry. No new bruising.' }],
      pick: [{ t: 'Give it', ok: 1 }, { t: 'Hold it and report possible HIT', w: 'HIT drops platelets by half or more, usually 5 to 10 days after heparin starts. A small dip on day 2 after surgery isn\'t that pattern.' }, { t: 'Hold it until tomorrow\'s platelet count', w: 'Skipping clot prevention after hip surgery raises the risk of a DVT or PE, and nothing here calls for it.' }],
      why: 'A 16% drop two days after surgery is expected from blood loss and dilution. He isn\'t bleeding, and his kidneys clear the drug normally.',
      pearl: 'Think HIT when platelets fall by half or more, 5 to 10 days in (sooner if exposed in the last 100 days), or a new clot forms. Small early dips are common after surgery.',
      v: { pain: 3 }, good: { pain: 3 }, bad: { pain: 6, rr: 26, spo2: 90, anxious: .6 },
      goodLine: 'He walks the hall twice. No clot, no bleeding.', badLine: 'Two days later his calf swells.' },

    { id: 'mp-h-oxy-poss2', lv: 2, p: { n: 'Darius King', a: 47, x: 'M', sk: 7, h: ['buzz', '#120C09'], c: GOWN, e: ['beard'], sm: 0 },
      med: 'Oxycodone 5 mg PO, every 4 hours as needed', for: 'Pain after a hernia repair', line: 'Pain 7 of 10. His eyes are heavy between questions, though he answers clearly when you speak. Last dose 4 hours ago.',
      check: [{ t: 'Sedation level and breathing', v: 'POSS 2: slightly drowsy, wakes easily to your voice and stays awake during conversation. RR 14, SpO₂ 96% on room air.', ok: 1 }, { t: 'Blood pressure, lying and sitting', v: 'BP 138/84.' }, { t: 'Bowel sounds and last stool', v: 'Present in all four quadrants.' }],
      pick: [{ t: 'Give it, and recheck his sedation and breathing in 30 to 60 minutes', ok: 1 }, { t: 'Hold it, because he looks slightly drowsy between questions', w: 'Slightly drowsy and easy to rouse (POSS 2) with normal breathing is acceptable. Untreated pain keeps him from breathing deeply and walking.' }, { t: 'Give half the dose to be safe', w: 'He\'s safe for the ordered dose. A partial dose isn\'t ordered, and undertreating pain has its own risks.' }],
      why: 'Slightly drowsy yet easily aroused and able to stay awake while talking (POSS 2), with normal respirations, is acceptable for an opioid. Drifting off mid-conversation (POSS 3) is when you hold.',
      pearl: 'Use a sedation scale (like POSS). 1 to 2 (awake or slightly drowsy, easy to rouse): give and monitor. 3 (frequently drowsy, drifts off mid-conversation): hold, rouse, report. 4: emergency.',
      v: { pain: 7, alert: 1 }, good: { pain: 3, alert: 0 }, bad: { pain: 8, rr: 22, anxious: .6 },
      goodLine: 'An hour later his pain is 3 and he walks to the bathroom.', badLine: 'Unrelieved, he splints and takes shallow breaths all night. By morning he has a low fever.' },

    { id: 'mp-h-levo-hr', lv: 2, p: { n: 'Linda Park', a: 58, x: 'F', sk: 3, h: ['bob', '#1E1612'], c: GOWN, e: ['glasses'], sm: 0 },
      med: 'Levothyroxine 150 mcg PO', for: 'Hypothyroidism (dose raised last week)', line: '06:00. She says her heart has been "racing" and she can\'t sleep.',
      check: [{ t: 'Apical pulse and how she looks', v: 'HR 118, regular. Fine tremor of the hands. Sweaty.', ok: 1 }, { t: 'Her last TSH and when it was drawn', v: 'Low-normal, a month ago, before the dose went up.' }, { t: 'Her temperature', v: '37.2.' }],
      pick: [{ t: 'Hold it and report the symptoms', ok: 1 }, { t: 'Give it: last month\'s TSH was normal', w: 'That TSH was before the dose went up. Her symptoms now point to too much thyroid hormone.' }, { t: 'Give it and ask for a beta blocker for the heart rate', w: 'Treating the symptom while giving more of the cause doesn\'t make sense. Report first.' }],
      why: 'A racing heart, tremor, sweating and insomnia after a dose increase are signs of too much thyroid hormone. In older adults this can trigger atrial fibrillation or angina.',
      pearl: 'Levothyroxine: hold and report signs of excess (tachycardia, palpitations, tremor, heat intolerance, insomnia), especially after a dose change.',
      v: { hr: 118, anxious: .6, sweat: .5, tremor: .4 }, good: { hr: 92, anxious: .2, sweat: .1, tremor: .1 }, bad: { hr: 142, anxious: .9, sweat: .7, pain: 5 },
      goodLine: 'Her dose goes back down. By the next week her pulse is 84.', badLine: 'Two days later she\'s in atrial fibrillation at 142.' },

    { id: 'mp-h-ssri-teen', lv: 2, p: { n: 'Emma Walsh', a: 16, x: 'F', sk: 0, h: ['long', '#8A5A3A'], c: 'hoodie', e: ['freckles'], sm: 0, k: .94 },
      med: 'Sertraline 50 mg PO', for: 'Depression, started 2 weeks ago', line: 'She tells you quietly she\'s been thinking about death more since starting it.',
      check: [{ t: 'Ask her directly about suicide', v: '"I think about not being here. I don\'t have a plan."', ok: 1 }, { t: 'Her weight since admission', v: 'Down 1 kg since admission.' }, { t: 'How she\'s been sleeping and eating', v: 'About 6 hours a night.' }],
      pick: [{ t: 'Ensure her safety, notify the psychiatrist now, and clarify whether to give today\'s dose', ok: 1 }, { t: 'Discontinue it yourself: antidepressants cause suicidal thoughts in teens', w: 'The boxed warning is to watch closely and notify the prescriber, not to unilaterally discontinue an SSRI. Her safety and an immediate call come first.' }, { t: 'Give it as scheduled and pass it on to the morning team', w: 'New or worse suicidal thoughts require an immediate safety assessment and provider notification, not a routine handoff.' }],
      why: 'Young people starting an SSRI carry a boxed warning for emergent suicidal thinking, especially in the first weeks. Ensure immediate safety and notify the psychiatrist promptly so the prescriber can evaluate and decide whether to continue or change the medication.',
      pearl: 'Antidepressants under 25: watch for new suicidal thoughts, agitation or unusual changes, especially early or after a dose change. Ask directly, ensure safety, notify the prescriber now.',
      v: { anxious: .4 }, good: { anxious: .2 }, bad: { anxious: .7 },
      goodLine: 'She\'s moved to closer observation and her psychiatrist evaluates her and adjusts the plan that afternoon.', badLine: 'Nobody hears about it until a peer reports what she said two days later.' },

    { id: 'mp-h-warfarin-low', lv: 2, p: { n: 'George Hill', a: 74, x: 'M', sk: 6, h: ['balding', '#3A302A'], c: GOWN, e: ['mustache', 'wrinkles'], sm: .3 },
      med: 'Warfarin 5 mg PO', for: 'Atrial fibrillation (INR goal 2 to 3)', line: 'He missed two doses at home before admission.',
      check: [{ t: 'Today\'s INR', v: 'INR 1.6.', ok: 1 }, { t: 'Signs of bleeding', v: 'None.' }, { t: 'Platelets', v: '220,000.' }],
      pick: [{ t: 'Give it and report the low INR', ok: 1 }, { t: 'Hold it until the INR is back in range', w: 'A low INR means he needs the drug, not less of it. Holding raises his stroke risk further.' }, { t: 'Give a double dose to catch up', w: 'Dose changes are the prescriber\'s, and doubling warfarin can overshoot into bleeding.' }],
      why: 'Below goal, his clot and stroke risk is higher. Give the ordered dose and let the prescriber adjust it or add a bridge.',
      pearl: 'High INR: hold and report. Low INR: give as ordered and report. Never adjust warfarin yourself.',
      v: {}, good: {}, bad: { confused: true, alert: 1 },
      goodLine: 'His dose is adjusted and his INR is 2.3 by discharge.', badLine: 'Days of missed doses later, he has a stroke.' },

    { id: 'mp-h-iron-antacid', lv: 2, p: { n: 'Grace Lin', a: 39, x: 'F', sk: 3, h: ['long', '#151010'], c: GOWN, e: [], sm: .4 },
      med: 'Ferrous sulfate 325 mg PO', for: 'Iron deficiency anemia', line: '09:00. Her heartburn is bad this morning.',
      check: [{ t: 'What else is due at 09:00', v: 'Calcium carbonate antacid, 2 tablets.', ok: 1 }, { t: 'Hemoglobin', v: '9.2.' }, { t: 'Her last bowel movement', v: 'Yesterday, dark and formed.' }],
      pick: [{ t: 'Give the antacid now for her heartburn, and the iron 2 hours later', ok: 1 }, { t: 'Give them together with breakfast to protect her stomach', w: 'Antacids and food both cut iron absorption. Separate them.' }, { t: 'Hold the iron today because of the heartburn', w: 'Heartburn isn\'t a reason to skip iron. Spacing the doses solves it.' }],
      why: 'Calcium and antacids bind iron in the gut. Space them at least 1 to 2 hours apart. Treat her symptom first, then give the iron later.',
      pearl: 'Iron: empty stomach if tolerated, with vitamin C helps; not with antacids, calcium, dairy or tea. Dark stools are expected; tarry, sticky stools with symptoms are not.',
      v: { pain: 3 }, good: { pain: 1 }, bad: { pale: .4 },
      goodLine: 'Heartburn settled, iron absorbed. Her hemoglobin climbs over the month.', badLine: 'Weeks of iron taken with antacids, and her hemoglobin barely moves.' },

    { id: 'mp-h-lithium-give', lv: 2, p: { n: 'Sam Ortega', a: 29, x: 'M', sk: 4, h: ['shag', '#1A120E'], c: 'tee', e: [], sm: .2 },
      med: 'Lithium carbonate 300 mg PO', for: 'Bipolar disorder, started 5 days ago', line: 'He says his hands are a bit shaky and he felt queasy after breakfast. He wants to stop it.',
      check: [{ t: 'Lithium level and what the tremor looks like', v: 'Level 0.8. Fine tremor holding a cup. No vomiting or diarrhea. Alert.', ok: 1 }, { t: 'Sodium level', v: 'Na 139.' }, { t: 'Urine output and how much he\'s drinking', v: 'Normal, clear.' }],
      pick: [{ t: 'Give it with food, and explain these effects often ease', ok: 1 }, { t: 'Hold it: tremor and nausea are signs of toxicity', w: 'A fine tremor and mild nausea at a level of 0.8 are common early side effects. Toxicity looks like a coarse tremor, vomiting, diarrhea, confusion or unsteadiness.' }, { t: 'Hold it because he wants to stop', w: 'His concern deserves a conversation and a report to the prescriber, but holding a mood stabilizer on day 5 without that conversation isn\'t the answer.' }],
      why: 'His level is in range and his symptoms are the expected early ones. Taking it with food helps the nausea. Tell the prescriber he\'s thinking of stopping.',
      pearl: 'Lithium: fine tremor and mild nausea early are common. Coarse tremor, vomiting, diarrhea, confusion or ataxia is toxicity. Keep fluids and salt steady.',
      v: { tremor: .2, nausea: true }, good: { tremor: .1 }, bad: { anxious: .6 },
      goodLine: 'A week later the queasiness is gone and he\'s sleeping through the night.', badLine: 'He goes home off lithium and is readmitted manic three weeks later.' },

    { id: 'mp-h-furosemide-give', lv: 2, p: { n: 'Betty Clarke', a: 81, x: 'F', sk: 1, h: ['curls', '#E4DED6'], c: GOWN, e: ['wrinkles', 'cannula'], sm: .2 },
      med: 'Furosemide 40 mg IV', for: 'Heart failure exacerbation', line: 'Weight up 1.2 kg. Crackles at both bases. Her pressure is lower than yesterday.',
      check: [{ t: 'Blood pressure and how she feels', v: 'BP 104/62, no dizziness. Yesterday 132/78.', ok: 1 }, { t: 'This morning\'s potassium level', v: 'K 3.8.' }, { t: 'Creatinine against yesterday\'s value', v: '1.2, stable.' }],
      pick: [{ t: 'Give it', ok: 1 }, { t: 'Hold it: her pressure is soft', w: '104 without symptoms isn\'t a hold, and she\'s carrying extra fluid. The fluid is what\'s hurting her.' }, { t: 'Give it orally instead to make it gentler', w: 'Changing the route is a new order, and gut swelling in heart failure makes oral absorption less reliable.' }],
      why: 'She\'s fluid overloaded with crackles and weight gain. Her pressure is lower but adequate, potassium and kidneys are fine. Diuresis is the treatment.',
      pearl: 'In heart failure, a modest pressure drop is common with treatment. Hold for symptomatic hypotension, low potassium or worsening kidney function, not for a number that still meets the order.',
      v: { rr: 22, spo2: 92 }, good: { rr: 16, spo2: 96 }, bad: { rr: 30, spo2: 87, lean: .6 },
      goodLine: 'She diureses 1.4 liters. Her crackles are gone by morning.', badLine: 'At 03:00 she sits bolt upright, gasping.' },

    { id: 'mp-h-diltiazem-ef', lv: 2, p: { n: 'Raymond Bell', a: 69, x: 'M', sk: 6, h: ['balding', '#3A302A'], c: GOWN, e: ['wrinkles'], sm: 0 },
      med: 'Diltiazem 15 mg IV push, once', for: 'Atrial fibrillation, HR 132', line: 'New order from the covering cross-cover resident. BP 114/70, mild bibasilar crackles.',
      check: [{ t: 'Recent echocardiogram and heart failure history', v: 'Echo from yesterday shows EF 25% (HFrEF).', ok: 1 }, { t: 'His morning serum sodium', v: 'Na 136.' }, { t: 'His allergy band', v: 'No known drug allergies.' }],
      pick: [{ t: 'Hold it and call the resident about his EF of 25%', ok: 1 }, { t: 'Give it slowly over 2 minutes since his BP is over 100', w: 'BP alone is not the issue: non-dihydropyridine calcium channel blockers depress contractility and worsen heart failure with reduced EF.' }, { t: 'Give half the ordered dose and watch his telemetry closely', w: 'Diltiazem is contraindicated in HFrEF regardless of half-dosing; clarify for a safer agent such as amiodarone or digoxin.' }],
      why: 'Non-dihydropyridine calcium channel blockers (diltiazem, verapamil) are negative inotropes that can precipitate acute decompensated heart failure when EF is reduced.',
      pearl: 'Before IV diltiazem or verapamil for AFib with RVR, check the EF. In HFrEF (EF ≤ 40%), question the order.',
      v: { hr: 132, rr: 22 }, good: { hr: 98, rr: 18 }, bad: { hr: 124, sbp: 82, rr: 30, spo2: 87, lean: .6 },
      goodLine: 'The resident switches to amiodarone; his rate settles to 96 with stable BP.', badLine: 'Ten minutes after IV diltiazem his BP falls to 82 and his crackles climb.' },

    { id: 'mp-h-carboprost-asthma', lv: 2, p: { n: 'Tessa Okafor', a: 30, x: 'F', sk: 8, h: ['bun', '#17110E'], c: GOWN, e: [], sm: 0 },
      med: 'Carboprost 250 mcg IM, now', for: 'Postpartum uterine atony', line: 'Fundus boggy despite oxytocin and massage; BP 116/72, HR 110. The provider calls for carboprost.',
      check: [{ t: 'Medical history for contraindications', v: 'Moderate persistent asthma (uses daily inhaled steroid and albuterol).', ok: 1 }, { t: 'Her latest prenatal hemoglobin', v: 'Hgb 11.2 g/dL.' }, { t: 'Her Rh blood type', v: 'A positive.' }],
      pick: [{ t: 'Hold it, speak up about her asthma, ask for another uterotonic', ok: 1 }, { t: 'Give it now because hemorrhage is more urgent than asthma', w: 'Carboprost (PGF2α) causes severe bronchospasm in asthma; safe alternatives like misoprostol or methylergonovine (her BP is normal) are right there.' }, { t: 'Give it with an albuterol nebulizer at the same time to block wheezing', w: 'Giving a contraindicated uterotonic alongside a bronchodilator risks life-threatening bronchospasm when safe uterotonics exist.' }],
      why: 'Carboprost is a prostaglandin F2α analog that triggers severe bronchoconstriction and is contraindicated in asthma. Because her BP is 116/72, methylergonovine or misoprostol can be used instead.',
      pearl: 'Uterotonic contraindications: no methylergonovine in hypertension; no carboprost in asthma. Speak up immediately before drawing it.',
      v: { hr: 110, anxious: .5 }, good: { hr: 90, anxious: .2 }, bad: { rr: 32, spo2: 85, anxious: .9, lean: .6 },
      goodLine: 'She gets methylergonovine IM instead; her fundus firms up and her lungs stay clear.', badLine: 'Minutes later she develops severe wheezing and SpO₂ drops to 85%.' },

    { id: 'mp-h-mg-oliguria', lv: 2, p: { n: 'Elena Vargas', a: 34, x: 'F', sk: 4, h: ['long', '#1E1612'], c: GOWN, e: [], sm: 0 },
      med: 'Magnesium sulfate 2 g/h IV, continuing infusion', for: 'Preeclampsia with severe features', line: 'Hourly safety check on her infusion. BP 142/88, awake and talking softly.',
      check: [{ t: 'Reflexes, breathing, and hourly urine output', v: 'Urine output 15 mL/h for 2 hours, patellar reflexes absent, RR 11.', ok: 1 }, { t: 'Her fetal heart rate baseline earlier', v: 'Baseline 140, moderate variability.' }, { t: 'Her last meal time', v: 'Clear liquids only.' }],
      pick: [{ t: 'Stop the infusion now, notify the provider, ready calcium gluconate', ok: 1 }, { t: 'Cut the rate to 1 g/h and send a stat magnesium level first', w: 'Absent reflexes and RR 11 are active magnesium toxicity; stop the infusion completely rather than continuing at half rate.' }, { t: 'Give an IV fluid bolus to boost urine output while magnesium runs', w: 'Continuing magnesium while the kidneys cannot clear it worsens respiratory depression and risks cardiac arrest.' }],
      why: 'Magnesium is cleared by the kidneys. Oliguria lets levels climb, causing loss of deep tendon reflexes first, then respiratory depression (RR < 12). Stop the drip immediately.',
      pearl: 'Magnesium toxicity ladder: reflexes vanish first, then breathing slows, then cardiac arrest. Stop the drip and have IV calcium gluconate 1 g at the bedside.',
      v: { alert: 1, rr: 11 }, good: { alert: 0, rr: 16 }, bad: { alert: 2, rr: 7, spo2: 86 },
      goodLine: 'Stopping the drip and giving calcium gluconate brings her breathing back to 16.', badLine: 'Twenty minutes later her respirations fall to 7 and a rapid response is called.' }
  );

  D.first.push(
    { id: 'wf-h-surg', lv: 2, where: 'Surgical, 08:00', q: 'Every one of them has something. Who first?',
      pts: [
        { p: { n: 'Mr. Pace', a: 61, x: 'M', sk: 2, h: ['short', '#6B5440'] }, line: 'Day 2 after bowel resection. Abdomen rigid, HR 118, temp 38.6.', ok: 1 },
        { p: { n: 'Mrs. Cho', a: 77, x: 'F', sk: 3, h: ['bob', '#B8B0A6'] }, line: 'Day 1 after hip replacement. Pain 9 of 10, last dose 3 hours ago.', w: 'Severe pain needs treatment soon, but it\'s expected and her vitals are stable. A rigid abdomen with fever and tachycardia is a leak until proven otherwise.' },
        { p: { n: 'Mr. Neal', a: 68, x: 'M', sk: 1, h: ['balding', '#C9C2B8'] }, line: 'COPD. SpO₂ 87% on 2 L, baseline 88 to 92. Pursed-lip breathing, comfortable.', w: 'Just under his range, comfortable. Recheck and adjust oxygen per orders; not first.' },
        { p: { n: 'Mrs. Ruiz', a: 72, x: 'F', sk: 5, h: ['bob', '#2A1E18'] }, line: 'Heart failure. Weight up 1.5 kg overnight. Lungs clear, SpO₂ 96%.', w: 'Report the gain today. With clear lungs and normal oxygen she isn\'t in distress.' },
      ],
      why: 'A rigid abdomen, fever and tachycardia after bowel surgery suggest an anastomotic leak and peritonitis. It can turn into septic shock fast.',
      pearl: 'After abdominal surgery: a rigid abdomen with fever and rising heart rate is a surgical emergency. Pain, expected findings and stable chronic conditions wait.' },

    { id: 'wf-h-psych', lv: 2, where: 'Adult psych, 13:00', q: 'Who first?',
      pts: [
        { p: { n: 'Nina', a: 44, x: 'F', sk: 1, h: ['bob', '#6B5440'], c: 'blouse' }, line: 'On lithium. Vomited twice since lunch, coarse tremor, mixing up words.', ok: 1 },
        { p: { n: 'Carl', a: 35, x: 'M', sk: 6, h: ['buzz', '#120C09'], c: 'tee' }, line: 'Paranoid, refusing his meds, shouting in his room. Not approaching anyone.', w: 'Give him space and a calm check-in soon. He\'s contained and not a danger to others right now.' },
        { p: { n: 'Pia', a: 22, x: 'F', sk: 3, h: ['long', '#151010'], c: 'hoodie' }, line: 'Admitted 3 days ago after an overdose. Asking for a razor to shave her legs.', w: 'Safety matters: she can shave with supervision per policy. A medical emergency comes first.' },
        { p: { n: 'Ray', a: 51, x: 'M', sk: 2, h: ['short', '#4A3A2C'], c: 'flannel' }, line: 'Alcohol use disorder, day 4. CIWA 7, asking for coffee.', w: 'A low score on day 4: withdrawal is easing. Keep scoring.' },
      ],
      why: 'Vomiting, a coarse tremor and new confusion on lithium are toxicity. It can progress to seizures and kidney damage.',
      pearl: 'On a psych unit, medical emergencies come first: toxicity, NMS, withdrawal, overdose. Safety requests and refusals follow.' },

    { id: 'wf-h-ld', lv: 2, where: 'Labor and delivery, 22:00', q: 'Who first?',
      pts: [
        { p: { n: 'Ms. Ward', a: 30, x: 'F', sk: 0, h: ['ponytail', '#8A5A3A'] }, line: '34 weeks, placenta previa. Sudden painless bright red bleeding.', ok: 1 },
        { p: { n: 'Mrs. Ali', a: 27, x: 'F', sk: 4, h: ['hijab', '#3C5A7A'] }, line: 'Preterm labor on magnesium. RR 14, knee reflexes 2+, warm and flushed.', w: 'Flushing and warmth are expected with magnesium. Breathing and reflexes are fine.' },
        { p: { n: 'Ms. Pope', a: 33, x: 'F', sk: 6, h: ['bun', '#1A120E'] }, line: '39 weeks, 6 cm, epidural just placed. BP 98/58. Fetal heart rate 140s.', w: 'Common after an epidural: tilt her, fluids per orders. The baby is tolerating it.' },
        { p: { n: 'Mrs. Dunn', a: 36, x: 'F', sk: 2, h: ['bob', '#6B5440'] }, line: 'Postpartum day 1. Fundus firm 1 cm below the umbilicus. Moderate lochia rubra.', w: 'Normal findings for day 1.' },
      ],
      why: 'Painless bright red bleeding with a previa can become a hemorrhage quickly for both mother and baby.',
      pearl: 'Placenta previa: painless bright red bleeding. Never do a vaginal exam. Abruption: painful, a rigid uterus, sometimes concealed bleeding.' },

    { id: 'wf-h-cardiac', lv: 2, where: 'Cardiac step-down, 04:00', q: 'Who first?',
      pts: [
        { p: { n: 'Mr. Byrne', a: 66, x: 'M', sk: 1, h: ['swoop', '#9C8F80'] }, line: 'Two days after an MI. New loud murmur, short of breath, crackles to mid-lung.', ok: 1 },
        { p: { n: 'Mrs. Fry', a: 74, x: 'F', sk: 0, h: ['curls', '#D8D2CA'] }, line: 'Atrial fibrillation on a diltiazem drip. Rate 112, BP 116/70.', w: 'Rate a bit high but blood pressure fine; titrate per protocol soon.' },
        { p: { n: 'Mr. Okon', a: 59, x: 'M', sk: 8, h: ['balding', '#2A2220'] }, line: 'Heart failure. K 3.3 on furosemide. Rhythm sinus.', w: 'Replace per protocol and report soon; no rhythm change.' },
        { p: { n: 'Ms. Ito', a: 52, x: 'F', sk: 3, h: ['bob', '#151010'] }, line: 'Admitted for chest pain. Now 2 of 10, same as on arrival. Troponin negative twice.', w: 'Unchanged and ruled out so far; reassess, not first.' },
      ],
      why: 'A new murmur and sudden pulmonary edema days after an MI suggests papillary muscle rupture or a ventricular septal rupture. Both need surgery urgently.',
      pearl: 'After an MI, a new murmur with sudden heart failure is a mechanical complication. Call immediately.' },

    { id: 'wf-h-peds', lv: 2, where: 'Pediatrics, 20:00', q: 'Who first?',
      pts: [
        { p: { n: 'Baby Rose', a: '6 wks', x: 'F', sk: 2, h: ['buzz', '#4A3A2C'], c: 'onesie', e: [], k: .68 }, line: '6 weeks old. Temp 38.3. Feeding poorly, sleepier than usual.', ok: 1 },
        { p: { n: 'Kai', a: 4, x: 'M', sk: 5, h: ['curlyshort', '#1A120E'], c: 'onesie2', k: .78 }, line: 'Asthma. SpO₂ 93%, mild wheeze 20 minutes after his nebulizer.', w: 'Mild and improving; reassess after the neb finishes working.' },
        { p: { n: 'Luca', a: 10, x: 'M', sk: 1, h: ['short', '#8A5A3A'], c: 'tee', k: .86 }, line: 'Femur fracture in traction. Pain 6. Toes pink and warm.', w: 'Treat his pain soon; circulation is good.' },
        { p: { n: 'Amara', a: 15, x: 'F', sk: 7, h: ['long', '#120C09'], c: 'hoodie' }, line: 'Appendectomy yesterday. Temp 38.1, eating crackers.', w: 'A low-grade temperature after surgery; encourage deep breaths and recheck.' },
      ],
      why: 'Any fever in an infant under about 2 to 3 months, with poor feeding or sleepiness, can be sepsis or meningitis. Infants show few other signs.',
      pearl: 'Young infants with fever get a full workup fast. Lethargy and poor feeding are danger signs at any age.' },

    { id: 'wf-h-neuro', lv: 2, where: 'Neuro, 15:00', q: 'Who first?',
      pts: [
        { p: { n: 'Mr. Shaw', a: 42, x: 'M', sk: 2, h: ['short', '#4A3A2C'] }, line: 'Guillain-Barré. Vital capacity down from 2.2 L to 1.4 L since this morning.', ok: 1 },
        { p: { n: 'Ms. Rios', a: 38, x: 'F', sk: 4, h: ['long', '#1E1612'] }, line: 'Myasthenia gravis. Drooping eyelids, worse at the end of the day.', w: 'Fatigue worse late in the day is typical. Watch her breathing and swallowing, but this is her pattern.' },
        { p: { n: 'Mr. Gray', a: 76, x: 'M', sk: 1, h: ['balding', '#E4DED6'] }, line: 'Parkinson\'s. Freezing when he walks; fell yesterday without injury.', w: 'Fall precautions and PT soon; stable now.' },
        { p: { n: 'Mrs. Lee', a: 34, x: 'F', sk: 3, h: ['bob', '#151010'] }, line: 'Multiple sclerosis. Blurry vision in one eye since yesterday.', w: 'Possibly a relapse to report today. Not an airway threat.' },
      ],
      why: 'A falling vital capacity in Guillain-Barré means the breathing muscles are weakening. Many need intubation before oxygen levels fall.',
      pearl: 'Guillain-Barré and myasthenic crisis: follow vital capacity and negative inspiratory force, not just SpO₂. A falling trend means call now.' },

    { id: 'wf-h-endo', lv: 2, where: 'Med-surg, 18:00', q: 'Who first?',
      pts: [
        { p: { n: 'Ms. Grant', a: 46, x: 'F', sk: 6, h: ['bun', '#120C09'] }, line: 'Thyroidectomy this morning. Muscle cramps. Her cheek twitches when you tap it.', ok: 1 },
        { p: { n: 'Mr. Vos', a: 63, x: 'M', sk: 1, h: ['short', '#B8B0A6'] }, line: 'SIADH. Sodium 131, alert, on a fluid restriction.', w: 'Mildly low and improving on treatment. Keep the restriction.' },
        { p: { n: 'Mrs. Kahn', a: 55, x: 'F', sk: 3, h: ['bob', '#3A3330'] }, line: 'On high-dose steroids. Glucose 260 before dinner.', w: 'Expected with steroids. Correction insulin per orders.' },
        { p: { n: 'Mr. Bose', a: 48, x: 'M', sk: 4, h: ['short', '#151010'] }, line: 'Addison\'s disease. Evening hydrocortisone due. BP 116/72, feels fine.', w: 'Give it on time; he\'s stable now.' },
      ],
      why: 'Muscle cramps and a positive Chvostek sign after thyroid surgery suggest low calcium from parathyroid injury. It can progress to laryngospasm and seizures.',
      pearl: 'After thyroid or parathyroid surgery: tingling, cramps, Chvostek or Trousseau sign mean check calcium and have IV calcium ready.' },

    { id: 'wf-h-renal', lv: 2, where: 'Renal, 06:00', q: 'Who first?',
      pts: [
        { p: { n: 'Mr. Akins', a: 58, x: 'M', sk: 7, h: ['buzz', '#2A2220'] }, line: 'On dialysis, missed yesterday\'s session. Weak. K 6.4, HR 52.', ok: 1 },
        { p: { n: 'Mrs. Reed', a: 49, x: 'F', sk: 1, h: ['ponytail', '#6B5440'] }, line: 'Peritoneal dialysis. Cloudy drainage this morning, temp 37.6.', w: 'Possible peritonitis: cultures and antibiotics today. Hyperkalemia with a slowing heart can stop it now.' },
        { p: { n: 'Mr. Tan', a: 66, x: 'M', sk: 3, h: ['short', '#3A3330'] }, line: 'Kidney biopsy yesterday. Mild flank pain, urine light pink.', w: 'A little blood is expected after a biopsy. Watch the vitals and the color.' },
        { p: { n: 'Ms. Ford', a: 71, x: 'F', sk: 2, h: ['curls', '#D8D2CA'] }, line: 'Acute kidney injury on IV fluids. Urine output 40 mL/hr, up from 20.', w: 'Improving. Keep going.' },
      ],
      why: 'A potassium of 6.4 with a slow heart rate means the potassium is affecting the heart. It can cause a fatal rhythm.',
      pearl: 'Dialysis patients who miss treatment: think potassium and fluid. Hyperkalemia with bradycardia or ECG changes is an emergency.' },

    { id: 'wf-h-geri', lv: 2, where: 'Geriatrics, 11:00', q: 'Who first?',
      pts: [
        { p: { n: 'Mrs. Hale', a: 84, x: 'F', sk: 0, h: ['curls', '#ECE8E3'] }, line: 'On warfarin. Fell an hour ago, hit her head. Now asking the same question over and over.', ok: 1 },
        { p: { n: 'Mr. Brook', a: 88, x: 'M', sk: 2, h: ['balding', '#E4DED6'] }, line: 'Dementia. Trying to leave the unit to "go to work."', w: 'A safety risk: redirect him soon. He\'s calm and walking.' },
        { p: { n: 'Mrs. Toll', a: 79, x: 'F', sk: 1, h: ['short', '#D0C8BE'] }, line: 'Hip fracture, waiting for surgery. Pain 7, last dose 2 hours ago.', w: 'Pain to treat soon; expected and stable.' },
        { p: { n: 'Mr. Webb', a: 90, x: 'M', sk: 5, h: ['balding', '#C8C0B6'] }, line: 'Stage 2 pressure injury on his sacrum. Dressing soiled.', w: 'Change it soon; not urgent.' },
      ],
      why: 'A head strike on an anticoagulant, with new repetitive questioning, can be a bleed in the skull. Older adults can bleed slowly and look fine at first.',
      pearl: 'Anticoagulant plus a fall with head strike: neuro checks and a CT, even if they look okay. New confusion is a red flag.' },

    { id: 'wf-h-resp', lv: 2, where: 'Pulmonary, 09:00', q: 'Who first?',
      pts: [
        { p: { n: 'Mrs. Vance', a: 67, x: 'F', sk: 1, h: ['bob', '#B8B0A6'] }, line: 'Pneumonia. RR 30, SpO₂ 91% on 4 L, using her neck muscles. Says she\'s tired.', ok: 1 },
        { p: { n: 'Mr. Oyelaran', a: 70, x: 'M', sk: 8, h: ['balding', '#2A2220'] }, line: 'COPD. SpO₂ 88% on 2 L, his baseline. Thick yellow sputum.', w: 'At his baseline. Sputum culture and treatment per orders.' },
        { p: { n: 'Ms. Hart', a: 24, x: 'F', sk: 0, h: ['ponytail', '#C08A4E'] }, line: 'Asthma. Peak flow 70% of her best after a nebulizer.', w: 'Moderate and responding. Reassess.' },
        { p: { n: 'Mr. Lane', a: 58, x: 'M', sk: 2, h: ['short', '#6B5440'] }, line: 'Pleural effusion. Chest tube drained 300 mL of yellow fluid since morning.', w: 'Expected after placement; monitor the amount.' },
      ],
      why: 'Fast breathing, accessory muscle use and fatigue mean she\'s tiring. Respiratory failure can follow even while her saturation looks acceptable.',
      pearl: 'Work of breathing and fatigue predict respiratory failure before SpO₂ falls. "I\'m tired" from a patient breathing 30 times a minute is an emergency.' }
  );
})(window.Shift = window.Shift || {});
