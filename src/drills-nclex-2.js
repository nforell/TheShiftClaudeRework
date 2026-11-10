/* The Shift — NCLEX-level drill cards (lv: 2), part 2: SBAR and De-escalation.
   SBAR: every line sounds professional; the right one carries the fact that changes the decision.
   De-escalation: every option sounds kind; the wrong ones are the classic traps (false reassurance, asking "why",
   giving advice, defending, changing the subject, agreeing with a distortion). */
(function (S) {
  const D = S.drillData, GOWN = 'gown';

  D.sbar.push(
    { id: 'sb-h-hit', lv: 2, p: { n: 'Paul Grady', a: 63, x: 'M', sk: 1, h: ['short', '#9C8F80'], c: GOWN, e: ['glasses'], sm: 0 },
      to: 'Dr. Reyes, cardiology', at: '07:40', setup: 'Day 7 on a heparin drip after a PE. Platelets 72,000, from 180,000 on admission. New swelling and pain in his right arm.',
      v: { pain: 5, anxious: .4 }, good: { pain: 2, anxious: .1 }, bad: { pain: 7, rr: 28, spo2: 88, anxious: .8 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Paul Grady. I\'m worried about HIT: platelets fell from 180,000 to 72,000 on day 7 of heparin, and he has a new swollen right arm.', ok: 1 },
          { t: 'This is the nurse for Paul Grady, on a heparin drip for a PE. His platelets are 72,000 this morning and I wanted to make sure you\'d seen the result.', w: 'The number alone doesn\'t say why it matters. The drop from 180,000, the timing and the new clot make it HIT.' },
          { t: 'This is the nurse for Paul Grady. His right arm is newly swollen and tender this morning. I think he may have a DVT, even on the heparin drip.', w: 'Half the story. A new clot with falling platelets on heparin is HIT until proven otherwise.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Admitted for a PE, on a heparin drip since day 1. Platelets were 180,000 on admission. No bleeding.', ok: 1 },
          { t: 'Admitted for a PE a week ago. History of hypertension and type 2 diabetes, on metformin and amlodipine at home.', w: 'Leaves out how long he\'s been on heparin and his baseline count, the two facts that point to HIT.' },
          { t: 'His anti-Xa levels have all been in range, so the drip has been therapeutic the whole time.', w: 'True, but it doesn\'t matter for HIT. It\'s an immune reaction, not a dose problem.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'A more than 50% drop 5 to 10 days into heparin, with a new clot. I think this is HIT.', ok: 1 },
          { t: 'With platelets that low, I think the heparin is too much for him and he\'s at risk of bleeding.', w: 'HIT causes clots, not bleeding. The danger here is thrombosis.' },
          { t: 'He had a low-grade temp yesterday. He may be getting thrombocytopenia from an infection.', w: 'Possible, but the timing on heparin and the new clot make HIT the first thing to rule out.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'ve stopped the heparin. I\'d like a non-heparin anticoagulant, a HIT antibody test, and an ultrasound of the arm.', ok: 1 },
          { t: 'Can we lower the heparin rate by a couple of units and recheck his platelets with tomorrow morning\'s labs?', w: 'Lowering the rate doesn\'t stop HIT. All heparin stops.' },
          { t: 'Should I stop the heparin and hold all anticoagulation until the HIT antibody test comes back in a day or two?', w: 'Stopping heparin is right, but with HIT and a new clot, he needs a different anticoagulant now. Untreated, clots keep forming.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Stop all heparin, including flushes. Start argatroban per protocol. Send a HIT antibody. Upper extremity Doppler. Flag the allergy."', o: [
          { t: 'Read back: stop all heparin including flushes, start argatroban per protocol, HIT antibody, arm Doppler, heparin allergy flagged.', ok: 1 },
          { t: 'Read back: stop the heparin drip, start argatroban per protocol, HIT antibody, upper extremity Doppler this morning.', w: 'Missed "including flushes" and the allergy flag. Small heparin exposures keep HIT going.' },
          { t: 'Read back: stop all heparin including flushes, start enoxaparin, HIT antibody, arm Doppler, heparin allergy flagged.', w: 'Enoxaparin is a heparin. She said argatroban.' }] },
      ],
      win: 'Argatroban starts within the hour. The arm clot stops growing and his platelets recover over the week.', lose: 'The heparin keeps running another day. He develops a second clot in his leg.',
      pearl: 'HIT: platelets drop by more than half 5 to 10 days into heparin, often with new clots. Stop all heparin (flushes too), start a non-heparin anticoagulant, and list heparin as an allergy.' },

    { id: 'sb-h-preE', lv: 2, p: { n: 'Tasha Green', a: 32, x: 'F', sk: 7, h: ['bun', '#120C09'], c: GOWN, e: ['studs'], sm: 0 },
      to: 'Dr. Holt, OB', at: '19:10', setup: 'Day 2 after a cesarean, doing well this morning. Now BP 164/112 (rechecked 15 minutes apart), headache 7 of 10, seeing spots.',
      v: { pain: 7, anxious: .5 }, good: { pain: 2, anxious: .2 }, bad: { alert: 2, pain: 8 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Tasha Green, day 2 after a cesarean. Severe-range BP 164/112 twice, 15 minutes apart, with a headache and visual changes.', ok: 1 },
          { t: 'This is the nurse for Tasha Green, day 2 after a cesarean. Her blood pressure is high this afternoon and she has a headache.', w: 'No numbers. "Severe range, twice, 15 minutes apart" is what starts the treatment clock.' },
          { t: 'This is the nurse for Tasha Green, day 2 after a cesarean. She has a bad headache and the lights bother her. Can she have something stronger than acetaminophen?', w: 'Treating the headache misses that it\'s a sign of severe preeclampsia.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Cesarean two days ago. Blood pressures were normal in pregnancy and this morning. No magnesium given.', ok: 1 },
          { t: 'G2P2, cesarean two days ago for breech. Breastfeeding well, incision clean, and she\'s planning to go home tomorrow.', w: 'True but not what he needs. Preeclampsia can start after birth even with normal pressures in pregnancy.' },
          { t: 'She has a history of migraines with aura and says this one feels a lot like those.', w: 'Tempting, but a history of migraines doesn\'t explain a pressure of 164/112. Don\'t let it anchor the call.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'I think this is postpartum preeclampsia with severe features. She\'s at risk of eclampsia and stroke.', ok: 1 },
          { t: 'She had a spinal for the cesarean. I think it\'s a post-spinal headache from her anesthesia.', w: 'A spinal headache is positional and doesn\'t cause severe hypertension or visual spots.' },
          { t: 'Her incision pain is 6 out of 10 and she\'s worried about the baby. I think it\'s pain and anxiety raising her pressure.', w: 'Pain can raise pressure, but not to 164/112 with visual changes. Assume preeclampsia.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I need an antihypertensive within the hour, magnesium for seizure prevention, and preeclampsia labs. Can you come now?', ok: 1 },
          { t: 'Can I give her pain medicine, let her rest in a dark room, recheck her pressure in an hour, and call if it\'s still high?', w: 'Severe-range pressures confirmed 15 minutes apart need treatment within 30 to 60 minutes, not another hour of watching.' },
          { t: 'Can we start oral labetalol tonight and recheck her pressure and her labs in the morning?', w: 'Treating the pressure is right, but she also needs magnesium and labs, and closer checks than the morning.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Labetalol 20 mg IV now, repeat BP in 10 minutes. Magnesium 4 gram load, then 2 grams an hour. CBC, liver enzymes, creatinine. I\'m coming."', o: [
          { t: 'Read back: labetalol 20 mg IV now, BP in 10 minutes, magnesium 4 g load then 2 g/hr, CBC, liver enzymes, creatinine.', ok: 1 },
          { t: 'Read back: labetalol 20 mg IV now, BP in 10 minutes, magnesium 2 g load then 4 g/hr, CBC, liver enzymes, creatinine.', w: 'The magnesium numbers are reversed: 4 g load, then 2 g an hour. Reversed, she\'d get a dangerous maintenance rate.' },
          { t: 'Read back: labetalol 200 mg IV now, BP in 10 minutes, magnesium 4 g load then 2 g/hr, CBC, liver enzymes, creatinine.', w: '20 mg, not 200. Read back every number.' }] },
      ],
      win: 'Her pressure is 148/94 within the hour. No seizure. She goes home on day 4 with a blood pressure cuff.', lose: 'Two hours later she has a seizure.',
      pearl: 'Preeclampsia can start up to 6 weeks after birth. Severe range is 160 or more systolic, or 110 or more diastolic, confirmed in 15 minutes: treat within the hour and start magnesium.' },

    { id: 'sb-h-na', lv: 2, p: { n: 'Ellen Moore', a: 74, x: 'F', sk: 1, h: ['curls', '#D8D2CA'], c: GOWN, e: ['glasses', 'wrinkles'], sm: 0 },
      to: 'Dr. Patel, hospitalist', at: '14:20', setup: 'Admitted for pneumonia. Now confused and vomited once. Sodium 118, down from 129 yesterday. On a thiazide at home.',
      v: { confused: true, nausea: true }, good: { confused: false }, bad: { alert: 2, confused: true },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Ellen Moore. Her sodium dropped from 129 to 118 in a day, and she\'s newly confused and vomiting.', ok: 1 },
          { t: 'This is the nurse for Ellen Moore. The lab just called with a critical sodium of 118 and I\'m passing it on.', w: 'Add the speed of the drop and the symptoms. A fast drop with neuro signs is an emergency; a slow one without symptoms is not.' },
          { t: 'This is the nurse for Ellen Moore. She\'s confused this afternoon and pulling at her gown. I think she may be delirious from being in the hospital.', w: 'Delirium is a description, not a cause. The sodium is the cause.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Pneumonia. Takes hydrochlorothiazide at home, still ordered here. She\'s been drinking a lot of water.', ok: 1 },
          { t: 'Pneumonia, on ceftriaxone and azithromycin, improving on 2 liters. She was oriented yesterday.', w: 'Missing the thiazide and the water intake, the likely causes.' },
          { t: 'She has a history of mild dementia and her daughter says she gets muddled in new places.', w: 'Dementia doesn\'t explain an acute change. Don\'t let it anchor the call.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'Symptomatic hyponatremia that fell fast. I\'m worried about seizures and brain swelling.', ok: 1 },
          { t: 'She\'s vomited three times today. I think she\'s dehydrated from vomiting and needs fluids.', w: 'Possible contributor, but a sodium of 118 with confusion is the emergency.' },
          { t: 'Her sodium is low, but she\'s awake and she\'s not having seizures, so I think it\'s stable for now.', w: 'Confusion and vomiting are already neuro symptoms. Seizures are what you\'re trying to prevent.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'ve held the thiazide and put her on seizure precautions. Can you see her, and do you want hypertonic saline and frequent sodium checks?', ok: 1 },
          { t: 'She looks dry. Should I give a liter of normal saline quickly to bring the sodium up before the next lab draw?', w: 'Correction rate matters. Too fast can cause osmotic demyelination. Let the provider order the solution and the rate.' },
          { t: 'Should I put her on a one-liter fluid restriction, hold the thiazide, and recheck the sodium in the morning?', w: 'A restriction may be part of the plan, but symptomatic sodium of 118 needs active treatment and close checks now.' }] },
        { k: '✓', q: 'Close the loop.', say: '"3% saline, 100 mL bolus over 10 minutes. Sodium every 2 hours. Don\'t correct more than 8 in 24 hours. Hold the thiazide. Seizure precautions."', o: [
          { t: 'Read back: 3% saline 100 mL over 10 minutes, sodium every 2 hours, no more than 8 in 24 hours, thiazide held, seizure precautions.', ok: 1 },
          { t: 'Read back: 3% saline 100 mL over an hour, sodium every 4 hours, no more than 8 in 24 hours, thiazide held, seizure precautions.', w: 'Wrong rate and wrong check frequency: she said over 10 minutes, and sodium every 2 hours.' },
          { t: 'Read back: normal saline 100 mL over 10 minutes, sodium every 2 hours, no more than 8 in 24 hours, thiazide held.', w: 'She ordered 3% saline, not normal saline.' }] },
      ],
      win: 'Her sodium rises to 123 by evening, slowly and safely. By day 3 she\'s doing her crossword.', lose: 'She has a seizure at 16:00.',
      pearl: 'Hyponatremia: how fast it fell and the symptoms matter more than the number. Correct slowly (usually no more than 8 to 10 in 24 hours) to avoid osmotic demyelination.' },

    { id: 'sb-h-gib', lv: 2, p: { n: 'Walter Kim', a: 69, x: 'M', sk: 3, h: ['balding', '#3A3330'], c: GOWN, e: ['wrinkles'], sm: 0 },
      to: 'Dr. Shah, hospitalist', at: '02:30', setup: 'Admitted for a COPD flare. Just vomited 200 mL of coffee-ground material. HR 112, BP 104/66 (baseline 142/80). Takes aspirin and naproxen.',
      v: { pale: .5, hr: 112, sbp: 104, nausea: true }, good: { pale: .2, hr: 92, sbp: 122 }, bad: { pale: .9, hr: 134, sbp: 82, alert: 1 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Walter Kim. He vomited 200 mL of coffee-ground material. HR 112, BP 104/66, down from his baseline of 142.', ok: 1 },
          { t: 'This is the nurse for Walter Kim. He vomited about 200 mL a few minutes ago and his heart rate is up to 112.', w: 'Coffee-ground is the key word, and the pressure drop from his baseline tells how much he\'s lost.' },
          { t: 'This is the nurse for Walter Kim. I think he has a GI bleed: he vomited coffee-ground material. His pressure is holding at 104/66.', w: '104 sounds fine until you say his baseline is 142. Give the change.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'COPD flare, on prednisone since admission. Takes daily aspirin and naproxen at home. Hemoglobin 12.1 yesterday.', ok: 1 },
          { t: 'COPD flare, admitted three days ago. On scheduled nebulizers and oxygen at 2 L, breathing better than yesterday.', w: 'Leaves out the steroid and the NSAIDs, the reasons he\'s bleeding.' },
          { t: 'No history of GI bleeding or ulcers, and he doesn\'t drink.', w: 'True and worth saying, but the steroid plus NSAIDs is what raises his risk now.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'An upper GI bleed with early shock. I think he\'s losing more than we see.', ok: 1 },
          { t: 'He\'s on oxygen and his nose is dry. I think it\'s swallowed blood from a nosebleed.', w: 'No nosebleed was seen, and his heart rate and pressure say he\'s lost volume.' },
          { t: 'His heart rate is up a little, but his pressure is still over 100, so he\'s stable for now.', w: 'A drop from 142 with a heart rate of 112 is compensated shock.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'He\'s NPO and I\'ve placed a second large IV. I\'d like a type and cross, a stat hemoglobin, a PPI, and GI consulted. Can you come?', ok: 1 },
          { t: 'Can I give ondansetron for the vomiting and keep him on clear liquids until his stomach settles?', w: 'Treats the symptom, not the bleed.' },
          { t: 'His hemoglobin was 12.1 yesterday. Can I start a liter of fluid and recheck his hemoglobin with the morning labs?', w: 'Fluids may help, but he needs blood available and a hemoglobin now.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Type and cross 2 units. Stat CBC. Pantoprazole 80 mg IV bolus, then 8 mg an hour. Hold the aspirin and naproxen. I\'m calling GI."', o: [
          { t: 'Read back: type and cross 2 units, stat CBC, pantoprazole 80 mg IV bolus then 8 mg/hr, hold aspirin and naproxen. You\'re calling GI.', ok: 1 },
          { t: 'Read back: type and cross 2 units, stat CBC, pantoprazole 8 mg IV bolus then 80 mg/hr, hold aspirin and naproxen. You\'re calling GI.', w: 'The numbers are reversed: an 80 mg bolus, then 8 mg an hour.' },
          { t: 'Read back: type and cross, CBC, pantoprazole, hold his aspirin and naproxen, and you\'re calling GI.', w: 'No doses or units repeated.' }] },
      ],
      win: 'His hemoglobin is 9.4. He gets a unit and an endoscopy at 07:00 that finds and treats an ulcer.', lose: 'At 04:00 he vomits again and his pressure falls to 82.',
      pearl: 'In bleeding, give the change from baseline: a "normal" pressure can be a big drop. Steroids plus NSAIDs or aspirin is a classic setup for a GI bleed.' }
  );

  D.calm.push(
    { id: 'de-h-grief', lv: 2, p: { n: 'Carla Diaz', a: 49, x: 'F', sk: 4, h: ['long', '#1E1612'], c: 'blouse', e: ['hoops'], sm: 0 },
      where: 'Med-surg, 20:00', setup: 'Her father is dying. She snaps at you when you come in to turn him: "Can\'t you people leave him alone?"', m: 6,
      turns: [
        { say: '"Every hour someone comes in and hurts him."', o: [
          { t: '"It\'s hard to watch him be moved when he\'s this frail."', d: -2, r: 'She looks at you. "It is."' },
          { t: '"We have to turn him every two hours to prevent pressure sores."', d: 1, r: '"I don\'t care about pressure sores. He\'s dying."' },
          { t: '"I understand exactly how you feel. I went through this with my own father."', d: 1, r: '"No, you don\'t."' }] },
        { say: '"Nobody told us it would be this fast."', o: [
          { t: '"Tell me what you\'ve been told so far."', d: -2, r: 'She lists what the doctor said, then stops. "I didn\'t hear the rest."' },
          { t: '"The doctor should have explained that."', d: 1, r: '"So it\'s her fault now?"' },
          { t: '"Don\'t worry, he\'s comfortable. He isn\'t aware of any of this."', d: 0, r: 'She glances at him, not convinced.' }] },
        { say: '"Is he in pain? He keeps frowning."', o: [
          { t: '"Let me check him with you. A frown can mean pain, and we can treat it."', d: -2, r: 'She nods and watches you assess him.' },
          { t: '"That\'s just a reflex. People this close to the end of life don\'t really feel pain the way we do."', d: 2, r: '"How would you know?"' },
          { t: '"He\'s had his scheduled dose. Why do you think he\'s in pain?"', d: 1, r: '"Because he\'s FROWNING."' }] },
        { say: 'After his medicine he settles. "I don\'t know what to do now."', o: [
          { t: '"You can sit close and talk to him. Hearing is often one of the last senses to go."', d: -2, r: 'She takes his hand.' },
          { t: '"You\'ve been here all night. You should go home and get some rest."', d: 1, r: '"I\'m not leaving him."' },
          { t: '"Everything will be okay. You\'re doing everything right."', d: 1, r: 'She looks away.' }] },
      ],
      win: 'She stays the night, holding his hand. She thanks you at 05:00.', lose: 'She asks for a different nurse and spends the night alone and angry.',
      pearl: 'Grief often comes out as anger. Reflect the feeling, find out what they know, treat what you can (pain), and tell them what they can do. Avoid false reassurance and "I know how you feel."' },

    { id: 'de-h-new-dx', lv: 2, p: { n: 'Mark Ellis', a: 52, x: 'M', sk: 2, h: ['short', '#4A3A2C'], c: GOWN, e: ['glasses'], sm: 0 },
      where: 'Oncology, 16:00', setup: 'He learned an hour ago that his cancer has spread. He\'s staring at the wall and won\'t take his medicine.', m: 5,
      turns: [
        { say: '"What\'s the point of any of it?"', o: [
          { t: '"You just got hard news. I\'m here. We don\'t have to talk about medicine right now."', d: -2, r: 'He lets out a long breath.' },
          { t: '"Lots of people live for years with treatment now. You have to stay positive and fight this."', d: 1, r: '"You don\'t know that about me."' },
          { t: '"I know it\'s hard, but you need to take your medicine so you stay strong for what\'s ahead."', d: 1, r: 'He turns further away.' }] },
        { say: '"I keep thinking about my kids."', o: [
          { t: '"Tell me about them."', d: -2, r: 'He talks about his daughter\'s soccer season.' },
          { t: '"Why are you thinking about that now?"', d: 2, r: '"What kind of question is that?"' },
          { t: '"Try not to think about that right now."', d: 1, r: 'He goes quiet.' }] },
        { say: '"Am I going to die soon?"', o: [
          { t: '"That\'s an important question. I\'ll make sure your oncologist sits down with you about it. What have they told you so far?"', d: -2, r: '"Just \'treatment options.\' I want the real answer."' },
          { t: '"Nobody can know that. Every patient is different, and statistics don\'t tell you about one person."', d: 0, r: 'He nods, unsatisfied.' },
          { t: '"Of course not, don\'t think like that. You\'ve only just started; give the treatment a chance to work first."', d: 2, r: '"Don\'t lie to me."' }] },
        { say: '"I just don\'t want to feel like this tonight."', o: [
          { t: '"Are you having any thoughts of hurting yourself?"', d: -1, r: '"No. Just tired. And scared." His shoulders drop.' },
          { t: '"Let me get you something to help you sleep. Things feel worse at night."', d: 0, r: 'He shrugs.' },
          { t: '"Tomorrow will look better. It always does after some sleep."', d: 1, r: 'He shakes his head.' }] },
      ],
      win: 'He takes his medicine at 18:00. The oncologist meets with him and his wife the next morning.', lose: 'He refuses care for the rest of the night and stops talking to staff.',
      pearl: 'After bad news: presence first, then open questions. Don\'t reassure falsely or dodge. Ask directly about suicide when someone says they don\'t want to feel this way.' },

    { id: 'de-h-refuse', lv: 2, p: { n: 'Ivy Chen', a: 31, x: 'F', sk: 3, h: ['bob', '#151010'], c: 'tee', e: [], sm: 0 },
      where: 'Adult psych, 09:00', setup: 'On a 72-hour hold for psychosis. She refuses her antipsychotic: "It makes me a zombie."', m: 6,
      turns: [
        { say: '"I\'m not taking it. You can\'t make me."', o: [
          { t: '"You\'re right that you can refuse. Can you tell me what it\'s been like on it?"', d: -2, r: '"Slow. Like my head is full of cotton."' },
          { t: '"If you don\'t take it by mouth, the doctor will just order a shot, so you may as well take it now."', d: 3, r: '"See? You\'re all the same."' },
          { t: '"It\'s for your own good. You were much sicker before you started it."', d: 1, r: '"Says who?"' }] },
        { say: '"Slow. Like my head is full of cotton. I can\'t think."', o: [
          { t: '"That sounds miserable. I\'ll tell your doctor exactly how it feels so the dose or the drug can be looked at."', d: -2, r: '"You\'d do that?"' },
          { t: '"That\'s a normal side effect when you first start. It goes away in a few weeks for most people."', d: 1, r: '"It\'s been a week."' },
          { t: '"Everyone feels like that at first. Your body just needs time to get used to the medicine."', d: 1, r: '"I\'m not everyone."' }] },
        { say: '"And if I still say no?"', o: [
          { t: '"Then I write down that you refused and why, and your doctor talks with you about other options."', d: -2, r: 'She nods slowly.' },
          { t: '"Then you won\'t get better, and you\'ll be in here a lot longer than you need to be."', d: 2, r: '"Great."' },
          { t: '"Let\'s not worry about that right now. Let\'s just take this one dose at a time."', d: 0, r: 'She frowns, unsure what you mean.' }] },
        { say: '"Okay. I\'ll talk to her."', o: [
          { t: '"I\'ll ask her to see you this morning. Thanks for telling me what\'s been happening."', d: -1, r: '"Thanks for listening."' },
          { t: '"Good. Now take your pill this morning, and you can talk to her about it afterward."', d: 2, r: 'She pushes the cup away.' },
          { t: '"Great decision. I knew you\'d come around."', d: 0, r: 'She shrugs.' }] },
      ],
      win: 'Her psychiatrist lowers the dose. She takes it that evening and says her head feels clearer.', lose: 'It ends in a capacity hearing and a week of mistrust.',
      pearl: 'Patients on a hold still have the right to refuse medication except in an emergency or by court order. Ask about side effects, advocate, and document the refusal and the reason.' },

    { id: 'de-h-veteran', lv: 2, p: { n: 'Ray Ortiz', a: 41, x: 'M', sk: 5, h: ['buzz', '#1E1814'], c: GOWN, e: ['beard'], sm: 0 },
      where: 'ICU step-down, 02:30', setup: 'A veteran recovering from surgery. A tray crashed in the hall. Now he\'s out of bed, breathing fast, eyes darting.', m: 7,
      turns: [
        { say: '"Where am I? Get down!"', o: [
          { t: 'From a few feet away, calmly: "Ray, it\'s Dana, your nurse. You\'re in the hospital. You\'re safe."', d: -2, r: 'His eyes find yours.' },
          { t: 'Put a hand on his shoulder to ground him and say his name firmly: "Ray. Look at me."', d: 2, r: 'He flinches hard and swings.' },
          { t: '"It\'s just a tray. Nothing\'s wrong. Get back in bed."', d: 1, r: '"Something\'s wrong!"' }] },
        { say: '"I heard it. It was right there."', o: [
          { t: '"A tray fell in the hall. It was loud. You\'re in room 6, and it\'s 2:30 in the morning."', d: -2, r: 'He looks at the door, then the clock.' },
          { t: '"Are you having a flashback? Is this about the war? Tell me what you\'re seeing right now."', d: 0, r: 'He doesn\'t answer.' },
          { t: '"You\'re overreacting. It was only a tray."', d: 3, r: '"Don\'t tell me how to react."' }] },
        { say: 'Breathing hard. "I can\'t slow down."', o: [
          { t: '"Breathe with me: in for four, out for six. Feel your feet on the floor."', d: -2, r: 'His breathing slows.' },
          { t: '"Just relax. Nothing here can hurt you, so there\'s no reason to breathe like that."', d: 1, r: '"I CAN\'T."' },
          { t: '"Let me get you something to calm you down. You have lorazepam ordered."', d: 0, r: 'He shakes his head. "No drugs."' }] },
        { say: '"Sorry. That happens."', o: [
          { t: '"No need to be sorry. Would it help to keep the door closed and a light on at night?"', d: -2, r: '"Yeah. That would."' },
          { t: '"It\'s okay, everybody gets scared sometimes. It\'s nothing to be embarrassed about."', d: 0, r: 'He looks away.' },
          { t: '"Why didn\'t you tell us about your PTSD when you were admitted?"', d: 2, r: 'His jaw tightens.' }] },
      ],
      win: 'He sleeps with the door closed and a soft light on. His care plan now says why.', lose: 'He pulls his IV and spends the night awake by the window.',
      pearl: 'Trauma responses: keep your distance, say who you are and where they are, avoid touching without asking, ground with breath and senses, then adjust the environment.' },

    { id: 'de-h-teen-od', lv: 2, p: { n: 'Riley', a: 16, x: 'F', sk: 1, h: ['ponytail', '#6B5440'], c: 'hoodie', e: ['studs'], sm: 0, k: .94 },
      where: 'Pediatrics, 10:00', setup: 'Admitted after an acetaminophen overdose. Medically stable now. She glares when you come in: "I don\'t want to talk."', m: 6,
      turns: [
        { say: '"I don\'t want to talk."', o: [
          { t: '"That\'s okay. I\'m going to sit here for a few minutes while I check your IV."', d: -2, r: 'She doesn\'t look up, but doesn\'t tell you to leave.' },
          { t: '"You\'ll have to talk to someone eventually. The psychiatrist won\'t clear you until you do."', d: 2, r: '"Not to you."' },
          { t: '"Okay. Can you at least tell me why you did it?"', d: 2, r: 'She pulls the blanket over her head.' }] },
        { say: '"My mom\'s acting like I ruined her life."', o: [
          { t: '"It sounds like you\'re feeling blamed."', d: -2, r: '"Yeah. Like it\'s about her."' },
          { t: '"I\'m sure she\'s just worried about you."', d: 1, r: '"You don\'t know her."' },
          { t: '"Your mom loves you."', d: 1, r: 'She rolls her eyes.' }] },
        { say: '"Are you going to tell her what I say?"', o: [
          { t: '"Most of what you tell me stays between us and your care team. If you\'re in danger, I can\'t keep that private, and I\'d tell you first."', d: -2, r: 'She thinks about it. "Okay."' },
          { t: '"No, everything you say to me is confidential. I won\'t repeat a word of it to your mom or anyone else."', d: 1, r: 'She relaxes, but you\'ve promised something you can\'t keep.' },
          { t: '"You\'re a minor, so your mom has a right to know everything you tell us while you\'re here."', d: 2, r: '"Then forget it."' }] },
        { say: '"I still kind of want to die."', o: [
          { t: '"Thank you for telling me. Do you have a plan for how?"', d: -1, r: '"No. I just feel empty." She stays.' },
          { t: '"You don\'t mean that. You\'re just exhausted and upset."', d: 2, r: '"Yes, I do."' },
          { t: '"You\'re so young. You have so much to live for, and so many people who love you."', d: 1, r: 'She stops talking.' }] },
      ],
      win: 'She tells the psychiatry team the same thing an hour later. Her safety plan includes her aunt.', lose: 'She shuts down. The team learns nothing new before her transfer.',
      pearl: 'With teens: presence before questions, reflect feelings, and be honest about confidentiality limits. Ask directly about suicide and a plan; it doesn\'t plant the idea.' },

    { id: 'de-h-son-ama', lv: 2, p: { n: 'Victor Hale', a: 55, x: 'M', sk: 1, h: ['short', '#6B5440'], c: 'flannel', e: [], sm: 0 },
      where: 'Med-surg, 17:30', setup: 'His mother, 83, has pneumonia and is confused today. He\'s packing her bag. "I\'m taking her home. You people aren\'t helping."', m: 6,
      turns: [
        { say: '"She was fine before she came here."', o: [
          { t: '"Seeing her this confused is frightening. Can you tell me what she\'s usually like at home?"', d: -2, r: '"Sharp. She does her own bills."' },
          { t: '"She\'s confused because of the infection, not because of anything we\'ve done. This is very common at her age."', d: 1, r: '"So you\'re saying it\'s not your fault?"' },
          { t: '"Sir, please calm down. I can\'t help you or your mother when you\'re raising your voice."', d: 2, r: '"Don\'t tell me to calm down."' }] },
        { say: '"Sharp. She does her own bills."', o: [
          { t: '"That\'s really helpful. A sudden change like this is called delirium. It often improves as the infection is treated."', d: -2, r: '"It gets better?"' },
          { t: '"Older people often get confused in the hospital. It\'s the new surroundings and the broken sleep."', d: 0, r: '"That\'s not an answer."' },
          { t: '"She\'ll be fine. Once the antibiotics kick in she\'ll be back to herself."', d: 1, r: '"You can\'t promise that."' }] },
        { say: '"So what am I supposed to do? Just watch?"', o: [
          { t: '"You can help a lot: her glasses and hearing aids, photos, talking about home, being here at night if you can."', d: -2, r: 'He sets the bag down.' },
          { t: '"The best thing is to let the staff handle it. She needs rest more than visitors right now."', d: 1, r: '"That\'s what I\'ve been doing."' },
          { t: '"If you take her home like this, she could die. I need you to understand that."', d: 1, r: 'He stares at you, frozen.' }] },
        { say: '"Can I talk to her doctor?"', o: [
          { t: '"Yes. I\'ll page her now and stay with you until she calls."', d: -1, r: '"Thank you."' },
          { t: '"The doctor\'s very busy tonight. She has thirty patients."', d: 2, r: 'He picks the bag up again.' },
          { t: '"Maybe tomorrow on rounds. They usually come by around nine."', d: 1, r: '"Tomorrow might be too late."' }] },
      ],
      win: 'The doctor explains delirium and the plan. He stays the night. By day 3 she\'s doing her crossword.', lose: 'He leaves against advice with her. She\'s readmitted two days later, sicker.',
      pearl: 'Families who want to leave: acknowledge the fear, use what they know about the patient, explain in plain words, give them a role, and get the provider involved. Scare tactics backfire.' }
  );
})(window.Shift = window.Shift || {});
