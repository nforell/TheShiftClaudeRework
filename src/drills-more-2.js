/* The Shift — more drill cards: SBAR and De-escalation. Same format as src/drills-content.js.
   De-escalation: the meter runs 0 to 10; each turn has exactly one best line, and the best path must end at 3 or under. */
(function (S) {
  const D = S.drillData, GOWN = 'gown';

  D.sbar.push(
    { id: 'sb-transfusion', p: { n: 'Doris Moss', a: 61, x: 'F', sk: 2, h: ['short', '#8E8378'], c: GOWN, e: ['glasses'], sm: 0 },
      to: 'Dr. Iyer, oncology', at: '09:22', setup: '15 minutes into a unit of red cells: chills, back pain, T 38.6, HR 118, BP 96/58. You stopped the blood and hung saline through new tubing.',
      v: { temp: 38.6, hr: 118, sbp: 96, anxious: .6, pain: 6 }, good: { temp: 37.6, hr: 94, sbp: 112, anxious: .2, pain: 2 }, bad: { temp: 39.4, hr: 132, sbp: 78, anxious: .9, pain: 8 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Doris Moss. I think she\'s having a transfusion reaction: chills, back pain, fever 38.6, BP 96/58. I\'ve stopped the blood.', ok: 1 },
          { t: 'This is the nurse for Doris Moss. She has a fever of 38.6 about fifteen minutes into her transfusion, so I\'ve slowed the rate down.', w: 'Missing the back pain and low pressure, and that you\'ve stopped the blood.' },
          { t: 'This is the nurse for Doris Moss, who\'s getting blood today. She has chills and back pain and says she feels awful all of a sudden.', w: 'Add the numbers and that the blood is off.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Leukemia, hemoglobin 6.9 this morning. This is her first unit today. Bedside check was done with two nurses.', ok: 1 },
          { t: 'Leukemia. She\'s had many transfusions before without problems, and she was premedicated with acetaminophen today.', w: 'Previous transfusions don\'t protect against this one; give the unit and the bedside check.' },
          { t: 'Leukemia, on chemotherapy, port in place. Her counts have been low all week.', w: 'Missing the hemoglobin, which unit this is, and that the bedside check was done.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'Fever, back pain and a falling pressure this early make me worried about a hemolytic reaction.', ok: 1 },
          { t: 'She\'s had fevers with blood before. I think it\'s a febrile non-hemolytic reaction and she\'ll settle with acetaminophen.', w: 'Possible, but back pain and a falling pressure this early point to hemolysis. Assume the worst until ruled out.' },
          { t: 'She has a port and her counts are low. She might have a line infection.', w: 'Timing with the transfusion makes the blood the cause until proven otherwise.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'d like you to see her now. I\'ll send the bag and tubing to the blood bank with blood and urine samples. Do you want a fluid bolus?', ok: 1 },
          { t: 'Her fever is coming down a little. Can I restart the transfusion at a slower rate and stay with her for the first 15 minutes?', w: 'The blood stays off until a reaction is ruled out.' },
          { t: 'Should I give acetaminophen and diphenhydramine, watch her for half an hour, and call you back if she isn\'t better?', w: 'Treats the fever, not the reaction. Send the workup and get her evaluated.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Keep the blood off. Normal saline 500 mL bolus. Send the transfusion reaction workup. I\'m coming up."', o: [
          { t: 'Read back: blood stays off, normal saline 500 mL bolus, transfusion reaction workup sent. You\'re on your way.', ok: 1 },
          { t: 'Read back: blood stays off, normal saline 250 mL bolus, transfusion reaction workup sent. You\'re on your way.', w: 'He said 500 mL.' },
          { t: 'Okay, saline and the workup. I\'ll get those going and see you when you get here.', w: 'No volume repeated.' }] },
      ],
      win: 'The blood bank finds a mislabelled sample. Her kidneys stay safe and her pressure recovers.', lose: 'By the time anyone acts her urine is dark red.',
      pearl: 'Act, then call: stop the transfusion, keep the vein open with saline through new tubing, then SBAR. Send the bag back; it\'s evidence.' },

    { id: 'sb-nms', p: { n: 'Leon Carter', a: 33, x: 'M', sk: 6, h: ['buzz', '#120C09'], c: 'tee', e: [], sm: 0 },
      to: 'Dr. Abrams, psychiatrist on call', at: '14:10', setup: 'Started haloperidol three days ago. T 39.4, HR 124, BP 168/98. Arms stiff as pipes. Confused and sweating.',
      v: { temp: 39.4, hr: 124, sweat: .8, confused: true }, good: { temp: 38.0, hr: 100, sweat: .3 }, bad: { temp: 40.6, hr: 140, alert: 1, sweat: 1 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Leon Carter on 3 East. I\'m worried about neuroleptic malignant syndrome: T 39.4, rigid, confused, BP 168/98.', ok: 1 },
          { t: 'This is the nurse for Leon Carter on 3 East. He has a fever of 39.4 this afternoon and I\'d like an order for acetaminophen.', w: 'Add rigidity, confusion and the new antipsychotic: name NMS.' },
          { t: 'This is the nurse for Leon Carter on 3 East. He\'s stiff and confused today, more than yesterday, and he isn\'t making much sense.', w: 'Missing the vital signs.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'First-episode psychosis. Haloperidol started three days ago and increased yesterday. He\'s barely drinking.', ok: 1 },
          { t: 'First-episode psychosis, admitted three days ago on a hold. No medical history and no drug allergies that we know of.', w: 'Missing the haloperidol start and dose increase.' },
          { t: 'First-episode psychosis. On haloperidol and lorazepam as needed. He\'s been cooperative with his medications.', w: 'Say when the haloperidol started and that it went up yesterday.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'Fever, rigidity and confusion after a new antipsychotic. I think this is NMS and he needs medical care.', ok: 1 },
          { t: 'He\'s mute and holding odd postures for long stretches. This could be catatonia from his psychosis getting worse.', w: 'Catatonia can look similar, but fever and unstable vitals after a new antipsychotic are NMS until proven otherwise.' },
          { t: 'With a fever that high he may have an infection, maybe a pneumonia or a urinary infection.', w: 'Possible, but rigidity with fever after haloperidol is a medical emergency in its own right.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'d like to hold the haloperidol, get a CK and labs, start cooling and fluids, and transfer him to medicine.', ok: 1 },
          { t: 'Should I give his PRN lorazepam for the rigidity and see whether he loosens up over the next hour?', w: 'Lorazepam may be part of NMS treatment, but the antipsychotic must stop and he needs medical care first.' },
          { t: 'Can we add a CK to his morning labs and recheck his temperature every four hours overnight?', w: 'He needs labs and cooling now.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Hold all antipsychotics. CK, basic panel, IV fluids. I\'m calling medicine for transfer now."', o: [
          { t: 'Read back: hold all antipsychotics, CK and basic panel, IV fluids. You\'re calling medicine for transfer.', ok: 1 },
          { t: 'Read back: hold the haloperidol, CK and basic panel, IV fluids. You\'re calling medicine for transfer now.', w: 'She said hold all antipsychotics, not just haloperidol.' },
          { t: 'Okay, labs and fluids. I\'ll get those started while you call medicine.', w: 'No details repeated.' }] },
      ],
      win: 'His CK is in the thousands. He goes to the ICU early, and a week later he\'s back, stable on a different plan.', lose: 'By evening his temperature is 40.6 and his kidneys are failing.',
      pearl: 'Psych units see medical emergencies too. Say the diagnosis you\'re worried about, by name, in the first sentence.' },

    { id: 'sb-pph', p: { n: 'Ana Reyes', a: 31, x: 'F', sk: 4, h: ['long', '#1A120E'], c: GOWN, e: [], sm: 0 },
      to: 'Dr. Holt, OB', at: '11:05', setup: '2 hours after a vaginal birth. Fundus boggy above the umbilicus, soaked a pad in 15 minutes. HR 118, BP 92/58. You\'re massaging the fundus.',
      v: { hr: 118, sbp: 92, pale: .6, anxious: .5 }, good: { hr: 92, sbp: 110, pale: .2, anxious: .2 }, bad: { hr: 138, sbp: 74, pale: .9, alert: 1 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Ana Reyes in 214. She\'s hemorrhaging: boggy uterus, a pad soaked in 15 minutes, HR 118, BP 92/58.', ok: 1 },
          { t: 'This is the nurse for Ana Reyes in 214. Her bleeding is heavier than expected and I\'d like you to take a look when you can.', w: 'Say "hemorrhage" and give the numbers: a pad in 15 minutes, HR 118, BP 92/58.' },
          { t: 'This is the nurse for Ana Reyes in 214, two hours after delivery. Her fundus is boggy when I check it.', w: 'Add how fast she\'s bleeding and her vitals.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Vaginal birth at 09:00 after a 20-hour induction on oxytocin. Baby 4.2 kg. Asthma, so no carboprost.', ok: 1 },
          { t: 'Vaginal birth at 09:00. Second baby. Breastfeeding well, and her first delivery was uncomplicated.', w: 'Missing the long oxytocin induction, the big baby and the asthma.' },
          { t: 'Vaginal birth at 09:00 after a 20-hour induction on oxytocin. Baby 4.2 kg. No drug allergies.', w: 'Missing her asthma, which rules out carboprost.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'Uterine atony with hemorrhage. Her bladder is empty. She\'s getting tachycardic.', ok: 1 },
          { t: 'The uterus was firm earlier. I think she may have a vaginal tear that was missed.', w: 'A boggy uterus points to atony. Tears bleed with a firm fundus.' },
          { t: 'I think she may have a full bladder that\'s keeping the uterus from clamping down.', w: 'Good thought, but her bladder is empty, and that\'s part of your assessment.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'m massaging and I\'ve called for help. I\'d like uterotonics, a second IV, type and cross, and you at the bedside.', ok: 1 },
          { t: 'Can I keep massaging the fundus, weigh the pads, and recheck her bleeding and vitals in 15 minutes?', w: 'Keep massaging, yes, but she needs uterotonics and the provider now.' },
          { t: 'She says the cramping is bad. Can I give her ibuprofen for the cramping and a warm pack?', w: 'Pain isn\'t the problem. Hemorrhage is.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Oxytocin 40 units in a liter, wide open. Methylergonovine 0.2 mg IM. TXA 1 gram IV. Type and cross 2 units. I\'m on my way."', o: [
          { t: 'Read back: oxytocin 40 units in a liter wide open, methylergonovine 0.2 mg IM, TXA 1 g IV, type and cross 2 units.', ok: 1 },
          { t: 'Read back: oxytocin 40 units in a liter wide open, methylergonovine 0.2 mg IV, TXA 1 g IV, type and cross 2 units.', w: 'Methylergonovine is given IM, not IV: IV can cause severe hypertension and stroke.' },
          { t: 'Okay, oxytocin, methylergonovine and TXA, and I\'ll send the type and cross.', w: 'No doses or routes repeated.' }] },
      ],
      win: 'Her uterus firms up. By noon she\'s holding her daughter skin to skin.', lose: 'She loses 2 liters before the team gets ahead of it.',
      pearl: 'In hemorrhage, say the numbers that show it: how fast she\'s bleeding, heart rate, blood pressure. Mention allergies and conditions that rule out drugs.' },

    { id: 'sb-compartment', p: { n: 'Kenji Sato', a: 27, x: 'M', sk: 3, h: ['short', '#151010'], c: GOWN, e: [], sm: 0 },
      to: 'Dr. Fisher, orthopedics', at: '02:10', setup: 'Tibia fracture, casted yesterday. Pain 10 after morphine, worse when you stretch his toes. Toes pale and cool, he says they\'re tingling.',
      v: { pain: 10, anxious: .7, sweat: .4 }, good: { pain: 4, anxious: .2 }, bad: { pain: 10, anxious: 1, sweat: .7 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Kenji Sato. I\'m worried about compartment syndrome in his left leg: pain 10 despite morphine, worse on passive stretch.', ok: 1 },
          { t: 'This is the nurse for Kenji Sato. His pain is 10 out of 10 even after morphine, and I\'d like to know if he can have another dose.', w: 'Say what you\'re worried about: compartment syndrome, and pain on passive stretch.' },
          { t: 'This is the nurse for Kenji Sato, tibia fracture in a cast. His toes are tingling under the cast and he can\'t get comfortable.', w: 'Add pain out of proportion and pain on stretch.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Closed tibia fracture from a motorcycle crash, casted at 16:00. Morphine 4 mg IV at 01:30 didn\'t touch it.', ok: 1 },
          { t: 'Closed tibia fracture, casted yesterday afternoon. He\'s 28, healthy, no medical history and no allergies.', w: 'Missing that the morphine didn\'t help.' },
          { t: 'Tibia fracture from a motorcycle crash. He had a lot of pain in the ED too, and needed several doses there.', w: 'Earlier pain doesn\'t explain pain that\'s worse now despite morphine.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'Toes pale and cool, tingling, pulses still there. Pain out of proportion. I think pressure is building in the leg.', ok: 1 },
          { t: 'He\'s anxious and keeps watching the clock for his next dose, which makes the pain worse.', w: 'Pain out of proportion and on passive stretch is a physical sign, not a personality.' },
          { t: 'His toes are a little cool and tingling, but his pulses are present, so I think circulation to the foot is fine for now.', w: 'Pulses are a late sign. Pain on stretch is the early one.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'ve kept the leg at heart level. I\'d like you to see him now and decide about splitting the cast and pressure measurements.', ok: 1 },
          { t: 'Can I elevate his leg higher on two more pillows, put ice over the cast, and give another dose of morphine now?', w: 'Raising it above the heart lowers blood flow into the compartment.' },
          { t: 'He just had morphine. Can we give it time to work and reassess him in an hour?', w: 'Muscle can die within hours.' }] },
        { k: '✓', q: 'Close the loop.', say: '"I\'m coming in. Bivalve the cast now, keep it at heart level, NPO in case we go to the OR."', o: [
          { t: 'Read back: split the cast now, leg at heart level, NPO in case of surgery. You\'re coming in.', ok: 1 },
          { t: 'Read back: split the cast now, elevate the leg high on pillows, NPO in case of surgery. You\'re coming in.', w: 'He said heart level, not elevated.' },
          { t: 'Okay, I\'ll split the cast and call you when it\'s done.', w: 'Missing heart level and NPO.' }] },
      ],
      win: 'He\'s in the OR by 03:30 for fasciotomy. He keeps his leg and its function.', lose: 'By morning the muscle has died. He\'ll need more surgery and may never run again.',
      pearl: 'Pulses are a late sign. Pain out of proportion and pain on passive stretch are the early ones. Say them first.' },

    { id: 'sb-ich', p: { n: 'Harriet Lowe', a: 81, x: 'F', sk: 0, h: ['curls', '#ECE8E3'], c: GOWN, e: ['glasses', 'wrinkles'], sm: 0 },
      to: 'Dr. Mendez, hospitalist', at: '22:40', setup: 'She slipped in the bathroom at 21:30 and hit her head. Now she has a headache and is vomiting. She\'s on warfarin.',
      v: { nausea: true, confused: true, pain: 6 }, good: { pain: 3 }, bad: { alert: 2, confused: true, pain: 6 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Harriet Lowe. She hit her head in a fall an hour ago and now has a headache and vomiting. She\'s on warfarin.', ok: 1 },
          { t: 'This is the nurse for Harriet Lowe. She fell in the bathroom an hour ago. She got herself up and didn\'t want me to call.', w: 'Add the head strike, symptoms, and warfarin.' },
          { t: 'This is the nurse for Harriet Lowe, admitted for pneumonia. She has a headache and is vomiting, and wants something for it.', w: 'Missing the fall and the warfarin.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Atrial fibrillation on warfarin, INR 2.8 this morning. Admitted for pneumonia. She was oriented this afternoon.', ok: 1 },
          { t: 'Admitted for pneumonia, day 3 of antibiotics. History of atrial fibrillation, hypertension and two falls at home.', w: 'Say she\'s on warfarin and her INR.' },
          { t: 'On warfarin for atrial fibrillation. She takes it at night and hasn\'t missed any doses.', w: 'Add the INR and that she was oriented this afternoon.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'GCS 14, now slower to answer, pupils equal. I\'m worried about a bleed in her head.', ok: 1 },
          { t: 'She has a bump on the back of her head, but she\'s talking to me and knows where she is.', w: 'Talking now doesn\'t rule out a growing bleed, especially on warfarin.' },
          { t: 'She\'s sleepy and slow to answer, but it\'s late and she\'s had a long day.', w: 'New sleepiness after a head strike is a warning sign.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'d like a head CT now, neuro checks every 15 minutes, and to hold her warfarin. Will you come see her?', ok: 1 },
          { t: 'Can I give ondansetron for the vomiting and acetaminophen for the headache, and recheck her in an hour?', w: 'Treats a symptom of a possible bleed. CT first.' },
          { t: 'Can we do neuro checks every 4 hours overnight and get a CT in the morning if she\'s worse?', w: 'Too infrequent for a possible bleed on warfarin.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Stat head CT, INR now, hold warfarin, neuro checks every 15 minutes. If there\'s a bleed we reverse it. I\'m coming."', o: [
          { t: 'Read back: stat head CT, INR now, hold warfarin, neuro checks every 15 minutes. You\'re coming.', ok: 1 },
          { t: 'Read back: head CT in the morning, INR now, hold warfarin, neuro checks every 15 minutes.', w: 'He said stat CT.' },
          { t: 'Okay, CT and neuro checks. I\'ll call you with the result.', w: 'Missing stat, the INR, and the warfarin hold.' }] },
      ],
      win: 'The CT shows a small bleed. It\'s reversed within the hour and doesn\'t grow.', lose: 'At 02:00 she doesn\'t wake up. The bleed has grown.',
      pearl: 'Head strike plus an anticoagulant is high risk even if they look fine. Say both in the first sentence; it gets a CT ordered.' },

    { id: 'sb-peds-dehyd', p: { n: 'Noah Bailey', a: '9 mos', x: 'M', sk: 1, h: ['buzz', '#8A5A3A'], c: 'onesie', e: [], sm: 0, k: .7 },
      to: 'Dr. Grant, pediatric resident', at: '04:15', setup: 'Vomiting and diarrhea for two days. No wet diaper since 16:00. Sunken soft spot, no tears, hard to wake. HR 178, cap refill 4 seconds.',
      v: { alert: 1, hr: 178 }, good: { alert: 0, hr: 140 }, bad: { alert: 2, hr: 190, pale: .7 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Noah Bailey, 9 months. He\'s severely dehydrated and lethargic: HR 178, cap refill 4 seconds, no wet diaper in 12 hours.', ok: 1 },
          { t: 'This is the nurse for Noah Bailey, 9 months. He hasn\'t had a wet diaper in 12 hours and his mom is asking about it.', w: 'Add the heart rate, cap refill and lethargy that make it shock.' },
          { t: 'This is the nurse for Noah Bailey, 9 months, here for gastroenteritis. His heart rate is 178 and he\'s sleeping a lot.', w: 'Give the whole picture: lethargic, slow cap refill, no wet diapers.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Gastroenteritis, admitted yesterday for fluids. His IV came out at 18:00. Weight 8.5 kg.', ok: 1 },
          { t: 'Gastroenteritis, admitted yesterday for fluids. He\'s still having loose stools, about six today.', w: 'Missing that his IV came out and his weight.' },
          { t: 'His IV came out at 18:00 and he\'s been taking sips by mouth since then.', w: 'Add his weight so the resident can dose fluids.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'Sunken fontanelle, dry mouth, hard to wake. I think he\'s in shock from fluid loss.', ok: 1 },
          { t: 'He\'s sleeping through his cares. I think he\'s tired from being sick for three days.', w: 'Hard to wake with a fast heart rate is shock, not tiredness.' },
          { t: 'Dry mouth and fewer wet diapers. I think he\'s mildly dehydrated.', w: 'Sunken fontanelle, no tears, slow refill and lethargy are severe.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'He needs IV access now and a fluid bolus. I\'d like a glucose check and you at the bedside.', ok: 1 },
          { t: 'He takes a bottle sometimes. Should we try oral rehydration by syringe first and see how he does?', w: 'He\'s too lethargic to drink safely.' },
          { t: 'He\'s a hard stick. Can we call the IV team in the morning when they\'re in?', w: 'He needs access now; an IO if needed.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Normal saline 20 mL per kilo, so 170 mL, over 15 minutes. Check a glucose. If no IV in two tries, call me for an IO. I\'m coming."', o: [
          { t: 'Read back: normal saline 20 mL/kg, 170 mL over 15 minutes, glucose now, and an IO if two IV attempts fail.', ok: 1 },
          { t: 'Read back: normal saline 20 mL/kg, 170 mL over an hour, glucose now. You\'re coming.', w: 'She said over 15 minutes, and an IO after two failed IV attempts.' },
          { t: 'Okay, a bolus and a glucose. I\'ll get the IV started.', w: 'No volume or rate repeated.' }] },
      ],
      win: 'After two boluses he wets a diaper and reaches for his mom\'s hair.', lose: 'He gets the fluid late, after his blood pressure has already started to fall.',
      pearl: 'Babies hide shock until late: a fast heart rate and slow cap refill are early signs. Low blood pressure is late. Weight-based fluids, read back the math.' },

    { id: 'sb-suicide', p: { n: 'Tom Brennan', a: 46, x: 'M', sk: 1, h: ['short', '#6B5440'], c: 'flannel', e: ['beard'], sm: 0 },
      to: 'Dr. Vasquez, attending psychiatrist', at: '16:30', setup: 'Voluntary admission for depression, on 15-minute checks. He tells you he plans to hang himself with his shoelaces tonight. He has them on.',
      v: { anxious: .5 }, good: { anxious: .2 }, bad: { anxious: .8 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Tom Brennan. He just told me he plans to hang himself tonight with his shoelaces, and he had them on. I\'ve removed them and I\'m with him.', ok: 1 },
          { t: 'This is the nurse for Tom Brennan. He\'s talking about wanting to die again tonight, and I wanted to let you know before you leave.', w: 'Give the plan, the means and the time, and what you\'ve already done.' },
          { t: 'This is the nurse for Tom Brennan, admitted after an overdose. I\'m worried he\'s suicidal; something about him is different tonight.', w: 'Say what he told you: a plan, a method, tonight.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Admitted two days ago after an overdose. On 15-minute checks. His divorce was finalized today.', ok: 1 },
          { t: 'Admitted two days ago for depression. Started on sertraline. He\'s been attending groups.', w: 'Missing the overdose and today\'s divorce.' },
          { t: 'Admitted two days ago after an overdose of his own medications. He\'s been quiet but cooperative.', w: 'Add today\'s divorce and that he\'s on 15-minute checks.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'He has a plan, a method and a time. He\'s at high risk of suicide right now.', ok: 1 },
          { t: 'He\'s upset about his divorce today, which is understandable. I think he needs to talk.', w: 'True, but the plan, method and timing are what make this high risk.' },
          { t: 'He\'s at moderate risk; he\'s talking about it, and people who talk about it are asking for help.', w: 'A specific plan with access and a time is high risk.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'d like him on 1:1 observation, a room and belongings search, and you to evaluate him today.', ok: 1 },
          { t: 'Can we increase his checks to every 5 minutes and move him to the room by the station?', w: 'Even 5-minute checks leave gaps. With a plan and means, ask for 1:1.' },
          { t: 'Should I keep him on 15-minute checks now that the laces are gone, and have him promise to come to staff?', w: 'Removing the laces is right, but 15-minute checks aren\'t enough.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Start 1:1 observation now. Search the room and his belongings. I\'ll see him within the hour."', o: [
          { t: 'Read back: 1:1 now, room and belongings search, you\'ll see him within the hour.', ok: 1 },
          { t: 'Read back: 1:1 now, room and belongings search, you\'ll see him tomorrow morning.', w: 'She said within the hour, not tomorrow.' },
          { t: 'Okay, 1:1. I\'ll get someone to sit with him.', w: 'Missing the search and the time she\'ll see him.' }] },
      ],
      win: 'The search finds a second pair of laces and a belt. He stays on 1:1, and a week later he says thank you.', lose: 'His 15-minute check finds him in the bathroom.',
      pearl: 'Plan, means, timing: say all three. 15-minute checks are too far apart for a patient with a plan and access. Ask for 1:1.' },

    { id: 'sb-stemi', p: { n: 'Earl Watts', a: 66, x: 'M', sk: 2, h: ['balding', '#B6A58E'], c: GOWN, e: ['wrinkles'], sm: 0 },
      to: 'Dr. Ng, hospitalist', at: '05:30', setup: 'Day 2 after hip surgery. Crushing chest pain for 15 minutes, sweating. 12-lead shows ST elevation in II, III and aVF.',
      v: { pain: 8, sweat: .7, pale: .5, anxious: .6 }, good: { pain: 2, sweat: .1, pale: .1 }, bad: { pain: 9, sweat: .9, pale: .8, sbp: 82 },
      steps: [
        { k: 'S', q: 'Open the call.', o: [
          { t: 'This is the nurse for Earl Watts. He has chest pain and the ECG shows ST elevation in II, III and aVF. I think he\'s having a STEMI.', ok: 1 },
          { t: 'This is the nurse for Earl Watts. He has crushing chest pain and he\'s sweating. It started about ten minutes ago at rest.', w: 'Add the ECG: ST elevation in II, III and aVF.' },
          { t: 'This is the nurse for Earl Watts, hip replacement two days ago. His ECG looks abnormal to me and I\'d like you to read it.', w: 'Say what\'s abnormal and that you think it\'s a STEMI.' }] },
        { k: 'B', q: 'Background.', o: [
          { t: 'Hip replacement two days ago, on enoxaparin. Diabetic, smoker. No cardiac history.', ok: 1 },
          { t: 'Hip replacement two days ago. He\'s been walking with therapy and his pain is controlled.', w: 'Missing the enoxaparin and his cardiac risk factors.' },
          { t: 'Diabetic and a smoker, no cardiac history. His father had a heart attack at 60.', w: 'Add the recent surgery and the enoxaparin; they affect the cath plan.' }] },
        { k: 'A', q: 'Assessment.', o: [
          { t: 'BP 110/64, HR 58, sweaty. Inferior changes. I\'m holding nitroglycerin until we check the right side.', ok: 1 },
          { t: 'He\'s two days out from a hip replacement. I think it could be a PE given his surgery.', w: 'Possible after surgery, but ST elevation in a coronary pattern points to an MI.' },
          { t: 'BP 110/64, HR 58, sweaty. I think he\'s having an MI. Should I give nitro from the PRN order?', w: 'With inferior changes, ask about a right-sided ECG before nitrates.' }] },
        { k: 'R', q: 'Ask.', o: [
          { t: 'I\'d like the cath lab activated and you here now. Do you want aspirin and a right-sided ECG?', ok: 1 },
          { t: 'Should I repeat the ECG in 15 minutes and send a troponin to see if it\'s really his heart?', w: 'ST elevation already means activate the cath lab.' },
          { t: 'His pain is 8 out of 10. Can I give him nitroglycerin for the pain and recheck his pressure?', w: 'Possible right ventricular involvement: nitrates can drop his pressure.' }] },
        { k: '✓', q: 'Close the loop.', say: '"Activating the cath lab. Aspirin 324 chewed. Right-sided ECG. No nitro for now. I\'m on my way."', o: [
          { t: 'Read back: cath lab activated, aspirin 324 mg chewed, right-sided ECG, no nitro for now. You\'re coming.', ok: 1 },
          { t: 'Read back: cath lab activated, aspirin 81 mg chewed, right-sided ECG, no nitro for now. You\'re on your way.', w: 'He said 324 mg, not 81.' },
          { t: 'Okay, aspirin and ECG. I\'ll have him ready.', w: 'No doses repeated.' }] },
      ],
      win: 'He\'s in the cath lab 52 minutes after the pain started. His heart muscle is saved.', lose: 'He gets nitro first. His pressure falls to 82 and the delay costs heart muscle.',
      pearl: 'Read the ECG out loud: "ST elevation in II, III, aVF" gets a STEMI response. With an inferior MI, ask about a right-sided ECG before nitrates.' }
  );

  D.calm.push(
    { id: 'de-intox-ama', p: { n: 'Rick Dawson', a: 44, x: 'M', sk: 1, h: ['short', '#6B5440'], c: GOWN, e: ['beard'], sm: 0 },
      where: 'ED, 01:30', setup: 'Brought in drunk after hitting his head. He\'s pulling off the monitor leads and heading for the door.', m: 6,
      turns: [
        { say: '"I\'m FINE. I\'m going home. You can\'t stop me."', o: [
          { t: '"Rick, I\'m Jess, your nurse. I hear you want to go home. Can you sit with me for one minute so I can check your head first?"', d: -2, r: 'He stops by the door, swaying.' },
          { t: '"Rick, you\'re too drunk to leave and you know it. Sit down before you fall and hurt yourself again."', d: 2, r: '"Watch me."' },
          { t: 'Call security to stand in the doorway so he can see that leaving isn\'t an option tonight, then try talking to him.', d: 2, r: 'He sees the guards and raises his fists.' }] },
        { say: '"My head\'s fine. I\'ve been hit harder."', o: [
          { t: '"Maybe so. With a head injury and alcohol, I can\'t tell yet, and neither can you. That\'s why we want a scan."', d: -2, r: 'He touches the cut on his head and frowns.' },
          { t: '"You could have a bleed in your head right now. You could die tonight if you walk out that door, do you understand?"', d: 1, r: '"Everybody dies."' },
          { t: '"Fine. It\'s your choice. Sign here that you\'re leaving against medical advice and you can go."', d: 0, r: 'He grabs the pen. You\'re not sure he can make this decision.' }] },
        { say: '"I need a cigarette. I\'m going nuts in here."', o: [
          { t: '"I can\'t let you smoke, but I can ask the doctor about a nicotine patch and get you a sandwich. Deal?"', d: -2, r: '"...A sandwich would be good."' },
          { t: '"No smoking anywhere on hospital grounds. Those are the rules and I don\'t make them."', d: 1, r: '"Then I\'m out."' },
          { t: '"Go ahead outside for five minutes, just promise me you\'ll come straight back in for your scan afterward."', d: 1, r: 'He wanders toward the exit unmonitored.' }] },
        { say: 'Sitting now, eating. "How long\'s the scan?"', o: [
          { t: '"About half an hour. I\'ll come back and tell you when it\'s time, and I\'ll check on you in between."', d: -1, r: 'He nods and leans back.' },
          { t: '"Whenever they get to you. Radiology is backed up tonight, so it could be a while."', d: 1, r: 'He starts looking at the door again.' },
          { t: '"Not long. Just stay put this time, and don\'t make me chase you down the hallway again."', d: 2, r: '"Nobody\'s chasing me."' }] },
      ],
      win: 'His scan is clear. He sleeps it off and leaves sober in the morning with a ride.', lose: 'He walks out. At 05:00 he comes back by ambulance, confused.',
      pearl: 'Intoxicated people with head injuries can\'t reliably judge their own risk. Stay calm, give a reason, meet a need (food, nicotine), and involve the provider on capacity.' },

    { id: 'de-paranoid', p: { n: 'Celia Vance', a: 52, x: 'F', sk: 2, h: ['bob', '#4A3A2C'], c: 'blouse', e: [], sm: 0 },
      where: 'Adult psych, 12:15', setup: 'She hasn\'t eaten in two days. She pushes her tray away and stands up.', m: 6,
      turns: [
        { say: '"I know what you put in it. I\'m not stupid."', o: [
          { t: '"It sounds scary to think your food isn\'t safe. I\'m not going to argue with you about it."', d: -2, r: 'She sits back down, watching you.' },
          { t: '"There\'s nothing in your food. That\'s the illness talking; it\'s a paranoid thought, and it isn\'t real."', d: 2, r: '"That\'s what they\'d say."' },
          { t: '"If you don\'t start eating, the doctor will have to order a feeding tube."', d: 3, r: 'She shoves the tray off the table.' }] },
        { say: '"Everyone here is in on it."', o: [
          { t: '"I can\'t see what you\'re seeing. What would help you feel safe enough to eat something?"', d: -2, r: 'She thinks. "Something sealed."' },
          { t: '"Nobody is in on anything. We\'re all here to help you, every single one of us."', d: 1, r: '"You would say that."' },
          { t: '"Okay, I believe you. I\'ve wondered about the kitchen staff myself."', d: 0, r: 'She looks unsure. Now you\'re part of the story too.' }] },
        { say: '"Sealed. From a package I open myself."', o: [
          { t: '"I can bring you sealed crackers, peanut butter and a juice box from the pantry. You open them."', d: -2, r: '"...Okay."' },
          { t: '"We can\'t make special arrangements for one patient. The trays all come from the same kitchen."', d: 2, r: 'She turns away.' },
          { t: '"Just eat what\'s here. It\'s fine. Look, I\'ll take a bite of it first to show you."', d: 1, r: 'She doesn\'t touch it.' }] },
        { say: 'She eats the crackers. "Don\'t tell anyone I ate."', o: [
          { t: '"I need to write down what you ate so your team knows you\'re okay. I won\'t make a big deal of it."', d: -1, r: '"Fine. Just you."' },
          { t: '"Okay, I won\'t tell anyone. It can stay just between the two of us, I promise."', d: 0, r: 'She relaxes, but you\'ve promised a secret you can\'t keep.' },
          { t: '"Great job! See, nothing happened! I told you the food here was perfectly safe."', d: 1, r: 'She stops chewing and stares at you.' }] },
      ],
      win: 'She eats two sealed meals a day while her medication starts working. By day five she eats from the tray.', lose: 'She refuses food for another day and needs IV fluids.',
      pearl: 'Don\'t argue with a delusion, and don\'t agree with it. Acknowledge the feeling, find a safe workaround, and never promise secrecy.' },

    { id: 'de-parent-ivs', p: { n: 'Denise Carter', a: 36, x: 'F', sk: 6, h: ['curlyshort', '#1A120E'], c: 'blouse', e: ['hoops'], sm: 0 },
      where: 'Pediatrics, 15:00', setup: 'Her 3-year-old has been stuck three times for an IV. You come in with supplies for a fourth try.', m: 7,
      turns: [
        { say: '"NO. You\'re not touching him again. Three times!"', o: [
          { t: '"Three tries is too many. I\'m sorry. Let\'s stop and talk about what happens next."', d: -2, r: 'She lowers her arm, still between you and the bed.' },
          { t: '"I understand, but he needs this IV for his fluids. We have to try again."', d: 2, r: '"Over my dead body."' },
          { t: '"I\'m sorry. The last nurse wasn\'t very experienced with kids. I\'m better at this, I promise."', d: 1, r: '"So you sent a beginner to stab my son?"' }] },
        { say: '"Why can\'t anyone get it?"', o: [
          { t: '"He\'s dehydrated, which makes veins hard to find. I\'d like to ask our vascular team to use an ultrasound to find one."', d: -2, r: '"An ultrasound? Why didn\'t anyone say that before?"' },
          { t: '"Kids just have small veins, and his are smaller than most. It\'s nobody\'s fault, it just happens sometimes."', d: 1, r: '"That\'s not an answer."' },
          { t: '"He wouldn\'t hold still for us. It\'s very hard to get a vein when a child is moving that much."', d: 2, r: '"He\'s THREE."' }] },
        { say: '"He\'s so scared of you all now."', o: [
          { t: '"Let\'s give him a break. Numbing cream first, his tablet and you holding him on your lap. Child life can help too."', d: -2, r: 'She strokes his hair. "Can I hold him?"' },
          { t: '"He\'ll forget about it by tomorrow. Kids his age bounce back fast, faster than their parents do."', d: 2, r: '"He won\'t."' },
          { t: '"We\'ll just have to hold him down this time so it\'s over quickly. It\'s kinder in the long run."', d: 2, r: 'She picks him up and backs away.' }] },
        { say: '"Okay. Ultrasound. But I\'m staying."', o: [
          { t: '"Of course. You\'re the person he trusts most. I\'ll be here too."', d: -1, r: '"Thank you."' },
          { t: '"Parents usually wait outside for this. It tends to go more smoothly that way."', d: 2, r: '"Absolutely not."' },
          { t: '"Fine. Just try to stay out of the way."', d: 0, r: 'She nods, still tense.' }] },
      ],
      win: 'The ultrasound team gets it on the first try while he watches cartoons on her lap.', lose: 'She asks to leave against advice. The doctor talks her into staying, but the trust is gone.',
      pearl: 'With frightened parents: apologize for the experience, explain the "why," offer a better plan (ultrasound, numbing, comfort positions), and keep them close.' },

    { id: 'de-ama-cp', p: { n: 'Frank Morris', a: 59, x: 'M', sk: 4, h: ['short', '#3A3330'], c: GOWN, e: ['mustache'], sm: 0 },
      where: 'Telemetry, 18:00', setup: 'Admitted with chest pain to rule out a heart attack. Second troponin pending. He\'s getting dressed.', m: 6,
      turns: [
        { say: '"I\'ve got a business to run. I\'m leaving."', o: [
          { t: '"Your business matters. Can I tell you what we\'re waiting for, and then you decide?"', d: -2, r: 'He pauses with one shoe on. "Make it quick."' },
          { t: '"You can\'t leave, sir. You might be having a heart attack right now, and I can\'t let you walk out."', d: 2, r: '"Try and stop me."' },
          { t: '"Okay, it\'s your right to leave. I\'ll get the paperwork for you to sign."', d: 1, r: 'He leaves before anyone explains the risk.' }] },
        { say: '"The first test was normal. So I\'m fine."', o: [
          { t: '"The first one is often normal early. The second one, in about an hour, is the one that catches it."', d: -2, r: '"One hour?"' },
          { t: '"Tests can be wrong, so one normal result doesn\'t really tell us anything about your heart."', d: 1, r: '"Then why bother?"' },
          { t: '"I\'m not a doctor, so I can\'t say what the tests mean. You\'d have to ask her when she\'s free."', d: 1, r: '"Then why are you stopping me?"' }] },
        { say: '"My wife\'s going to kill me either way."', o: [
          { t: '"Want to call her? I\'ll get you a phone, and I\'ll ask the doctor to come talk to you both."', d: -2, r: 'He sits. "Yeah. Okay."' },
          { t: '"That\'s between you and her. It\'s not my problem, and it\'s not a reason to leave."', d: 2, r: 'He picks up his keys.' },
          { t: '"Trust me, heart attacks are a lot worse than angry wives. She\'d rather have you late than dead."', d: 0, r: 'He half-laughs, half-scowls.' }] },
        { say: '"If I stay, can I at least use my laptop?"', o: [
          { t: '"Yes. I\'ll find you an outlet and the wifi password."', d: -1, r: 'He opens his laptop.' },
          { t: '"No, you need to rest. Work stress is the last thing your heart needs right now."', d: 2, r: '"Then I\'m resting at home."' },
          { t: '"Maybe later, once the doctor has seen you."', d: 1, r: 'He sighs and looks at the door.' }] },
      ],
      win: 'His second troponin is up. He\'s in the cath lab that night with a blocked artery opened.', lose: 'He leaves. Two days later he arrives by ambulance in cardiac arrest.',
      pearl: 'Patients can refuse care, but they need the real risk in plain words first. Find what\'s driving the exit (work, family), meet it, and bring in the provider.' },

    { id: 'de-icu-delirium', p: { n: 'Ruth Gallo', a: 78, x: 'F', sk: 1, h: ['curls', '#E4DED6'], c: GOWN, e: ['wrinkles'], sm: 0 },
      where: 'ICU, 03:00', setup: 'Two days after bowel surgery. She\'s trying to climb out of bed and pulling at her central line.', m: 7,
      turns: [
        { say: '"Let me out! Where am I? Who are you people?"', o: [
          { t: 'Check her oxygen and glucose first.', d: -1, r: 'SpO₂ 86%: her oxygen cannula is off. Glucose 112.' },
          { t: 'Ask for wrist restraints before she pulls a line.', d: 3, r: 'She fights harder.' },
          { t: '"Ruth, calm down. You\'re fine. Lie back."', d: 1, r: '"I\'m NOT fine!"' }] },
        { say: '"I can\'t breathe right."', o: [
          { t: 'Put her oxygen back on and speak slowly: "Ruth, I\'m Kim, your nurse. You\'re in the hospital after surgery. You\'re safe."', d: -3, r: 'Her breathing slows. SpO₂ climbs to 93%.' },
          { t: '"Your breathing is fine, Ruth. Your numbers look okay to me, so try to relax and stop pulling at things."', d: 2, r: 'She grabs your arm in panic.' },
          { t: 'Give the PRN haloperidol so she settles and stops pulling at her lines, then reassess her.', d: 0, r: 'She\'s quieter but still hypoxic and confused.' }] },
        { say: '"Where are my glasses? Everything\'s blurry."', o: [
          { t: 'Find her glasses and hearing aid, turn on a soft light, and show her the clock.', d: -2, r: '"Oh. It\'s three in the morning."' },
          { t: '"You don\'t need them right now. It\'s the middle of the night and there\'s nothing to see."', d: 1, r: 'She squints and reaches for the line again.' },
          { t: 'Turn on the bright overheads so she can see the whole room clearly.', d: 1, r: 'She flinches.' }] },
        { say: '"I want my son."', o: [
          { t: '"Let\'s call him. He asked us to, any time. And I\'ll put his photo where you can see it."', d: -2, r: 'She holds the photo and closes her eyes.' },
          { t: '"It\'s too late to call. It\'s three in the morning and he needs his sleep too. We\'ll try him after breakfast."', d: 1, r: 'She starts crying.' },
          { t: '"He\'ll be here tomorrow. Try to get some sleep so you\'re rested when he comes."', d: 0, r: '"Tomorrow when?"' }] },
      ],
      win: 'Her son talks to her on speaker. She sleeps until 06:00 with her line intact.', lose: 'She pulls the central line. It bleeds, and she needs a new one placed.',
      pearl: 'In delirium, look for a cause first: low oxygen, low glucose, pain, a full bladder. Then reorient, glasses and hearing aids, light, family. Restraints and drugs come last.' },

    { id: 'de-mania', p: { n: 'Dev Anand', a: 28, x: 'M', sk: 4, h: ['shag', '#1A120E'], c: 'tee', e: [], sm: 0 },
      where: 'Adult psych, 22:30', setup: 'He\'s at the nurses\' station talking fast and loud, demanding to call his lawyer about his "billion-dollar app."', m: 7,
      turns: [
        { say: '"I need a phone RIGHT NOW. Do you know who I am?"', o: [
          { t: 'Speak slowly and quietly: "Dev, I can tell this is important to you. Let\'s step into the quiet room and figure it out."', d: -2, r: 'He follows, still talking fast.' },
          { t: '"Everyone on this unit thinks they\'re important, Dev. You\'ll wait for phone hours like everybody else."', d: 2, r: '"You\'re all JEALOUS."' },
          { t: 'Match his energy to engage him: "A billion dollars? Tell me everything, let\'s get your lawyer on the line!"', d: 2, r: 'He gets louder.' }] },
        { say: '"I don\'t need sleep. I\'m on fire tonight."', o: [
          { t: '"You haven\'t slept in two nights. Your brain needs it, even when it doesn\'t feel that way."', d: -1, r: 'He pauses. "Two nights?"' },
          { t: '"It\'s late and lights out has come and gone. Go to bed now."', d: 2, r: '"You can\'t make me."' },
          { t: '"A billion-dollar app? That sounds amazing. Tell me more about the app and how you came up with it."', d: 1, r: 'He talks for ten minutes, faster and faster.' }] },
        { say: '"Fine, but I need to call my lawyer."', o: [
          { t: '"Phone hours start at 08:00. I\'ll write your lawyer\'s name on the board so it\'s first on your list."', d: -2, r: '"First on the list. Okay."' },
          { t: '"No calls at night. Those are the rules for everybody, including you."', d: 2, r: 'He slams the table.' },
          { t: '"Fine, use my phone, but keep it short and give it right back to me when you\'re done with your lawyer."', d: 1, r: 'He calls four people and gets more wound up.' }] },
        { say: '"I\'m too wired. I can\'t."', o: [
          { t: '"Your PRN can help your body slow down. Want to try it, with a dark room and some quiet?"', d: -2, r: '"...Yeah. Dark sounds good."' },
          { t: '"You\'ll get a shot if you don\'t settle down in the next few minutes. It\'s up to you."', d: 3, r: 'He backs against the wall.' },
          { t: '"Try harder. Lie down, close your eyes and count."', d: 1, r: 'He paces again.' }] },
      ],
      win: 'He takes the oral medicine and sleeps six hours. In the morning his lawyer is first on his list.', lose: 'It ends with a hold and an injection at 01:00.',
      pearl: 'Mania: low stimulation, short clear sentences, firm and kind limits, and channel the energy. Don\'t argue with grandiosity, and don\'t feed it either.' },

    { id: 'de-lateral', p: { n: 'Dr. Raines', a: 50, x: 'M', sk: 1, h: ['swoop', '#6B5440'], c: 'coat', e: ['glasses'], sm: 0 },
      where: 'Med-surg hallway, 08:15', setup: 'You called him overnight about a patient\'s low blood pressure. Now he\'s shouting at you in the hallway in front of families.', m: 7,
      turns: [
        { say: '"Why the hell would you call me at 3 AM for THAT?"', o: [
          { t: '"I want to talk about this, and I\'d like to do it somewhere private. Can we step into the conference room?"', d: -2, r: 'He glances at the families and walks.' },
          { t: '"Don\'t yell at me! I was doing my job, and I won\'t be spoken to like that in front of the whole unit."', d: 2, r: '"I\'ll yell when I want."' },
          { t: 'Apologize for waking him, say it won\'t happen again, and get back to your patients before it gets worse.', d: 0, r: 'He nods, satisfied. But the next nurse may not call when it matters.' }] },
        { say: '"His pressure was 88. That\'s not a crisis."', o: [
          { t: '"His baseline is 140. 88 with a heart rate of 120 is a change. I was concerned."', d: -2, r: '"...He was tachy?"' },
          { t: '"I was just following policy. It says to call for a systolic under 90, so I called."', d: 1, r: '"Use your judgment."' },
          { t: '"You weren\'t there. You didn\'t see him. I did."', d: 2, r: '"Excuse me?"' }] },
        { say: '"Nobody told me he was tachy."', o: [
          { t: '"I may not have said it clearly. Next time I\'ll start with the trend and the heart rate. What would you want first?"', d: -2, r: '"Trend, then your ask. That works."' },
          { t: '"I did tell you. I said his heart rate was up when I gave you his vitals."', d: 1, r: '"Not clearly."' },
          { t: '"Maybe you should listen when nurses call you at night instead of rushing us off the phone every single time."', d: 2, r: 'His face reddens.' }] },
        { say: '"Fine. But don\'t page for nonsense."', o: [
          { t: '"I\'ll always call when I\'m worried about a patient. I\'d appreciate it if we kept these talks private."', d: -1, r: 'He pauses. "Fair."' },
          { t: '"Okay, I won\'t. I\'ll hold the smaller things for morning rounds from now on."', d: 1, r: 'You\'re less likely to call next time, and the patient pays.' },
          { t: '"I\'m reporting you to the chief of medicine. You can\'t talk to nurses like this and get away with it."', d: 1, r: '"Do what you want." He walks off.' }] },
      ],
      win: 'You talk it through privately. He starts asking "what\'s the trend?" when you call. You also tell your charge nurse what happened.', lose: 'It stays public and unresolved. The next time a patient drops their pressure, you hesitate to call.',
      pearl: 'Disruptive behavior: move it out of public view, stay factual, focus on the patient. Never promise not to call when you\'re worried. Report the behavior through your chain of command.' },

    { id: 'de-dementia-bath', p: { n: 'Mabel Ortiz', a: 88, x: 'F', sk: 4, h: ['bun', '#E4DED6'], c: GOWN, e: ['wrinkles', 'pearls'], sm: 0 },
      where: 'Med-surg, 09:00', setup: 'Dementia. Incontinent overnight. When the aide brings the washbasin, she swats at her and yells.', m: 6,
      turns: [
        { say: '"Get away! I don\'t know you!"', o: [
          { t: 'Step back, get to eye level and smile: "Good morning, Mabel. I\'m Rosa. I\'m here to help you feel fresh."', d: -2, r: 'She looks at you, wary but quieter.' },
          { t: '"Mabel, you\'re wet. We have to clean you up now, or your skin will break down."', d: 2, r: '"How DARE you!"' },
          { t: 'Ask a second aide to hold her hands so you can get the wet gown off quickly and be done before she\'s more upset.', d: 3, r: 'She screams and kicks.' }] },
        { say: '"I bathe at night. Always have."', o: [
          { t: '"Then we\'ll save the full bath for tonight. Right now, just a warm cloth and a fresh nightgown?"', d: -2, r: '"Warm. Not cold."' },
          { t: '"Hospital baths are in the morning, Mabel. That\'s when we have the staff to help you."', d: 2, r: '"Not mine."' },
          { t: 'Skip care entirely for now and chart that she refused.', d: 0, r: 'She calms, but her skin is still wet and breaking down.' }] },
        { say: '"It\'s so cold in here."', o: [
          { t: 'Warm the cloths, cover her with a towel, and wash one area at a time.', d: -2, r: 'She sighs. "That\'s nice."' },
          { t: '"It\'s not cold, Mabel. The thermostat says 72 in here, and we\'re nearly done."', d: 1, r: 'She pulls the blanket up tight.' },
          { t: 'Hurry through it to get it over with.', d: 1, r: 'She shivers and pushes your hand away.' }] },
        { say: '"My mother used to sing when she did my hair."', o: [
          { t: 'Hum a song while you brush her hair.', d: -1, r: 'She hums along.' },
          { t: '"Oh, I can\'t sing. You wouldn\'t want to hear me try."', d: 0, r: 'She goes quiet.' },
          { t: '"Your mother has passed, Mabel. That was a long time ago."', d: 2, r: 'Her face crumples.' }] },
      ],
      win: 'She\'s clean and dry, hair brushed, humming. Her skin heals over the week.', lose: 'She bruises her arm fighting the hold, and refuses all care that day.',
      pearl: 'Dementia care: approach from the front, slowly, at eye level. Keep their routines when you can, keep them warm and covered, and break care into small steps.' }
  );
})(window.Shift = window.Shift || {});
