# NCLEX challenge items: clinical review checklist

Generated from `src/ngn-challenge.js` by `node tools/challenge_doc.js`. Two per shift, after its three regular items. For each: is the key right, is every wrong option clearly wrong, and is the reasoning current?

## medsurg-4w-1

### [ ] ms1-ch1 (matrix, step: solve, Electrolytes and cardiac drugs)
A 71-year-old with heart failure (EF 30%) and atrial fibrillation. Morning results: K 3.1, Mg 1.5, creatinine 1.0. Apical pulse 58, regular for a full minute. BP 108/64. No dizziness.

**For each 09:00 medication, indicate whether the nurse should give it or hold it and notify the provider.**

- Digoxin 0.125 mg PO → **Hold and notify**: Low potassium and magnesium make digoxin toxic to the heart even at a normal level. Replace them first.
- Carvedilol 6.25 mg PO (hold for HR under 55 or SBP under 90) → **Give**: HR 58 and SBP 108 are above both parameters.
- Spironolactone 25 mg PO → **Give**: It spares potassium; with a K of 3.1 it helps, not hurts.
- Furosemide 40 mg PO → **Hold and notify**: It wastes potassium and magnesium. With both low, the provider needs to replace them or adjust the dose first.
- Potassium chloride 20 mEq PO → **Give**: Kidneys are working and potassium is low: give it.
- Magnesium oxide 400 mg PO → **Give**: Low magnesium makes low potassium hard to correct and raises arrhythmia risk: give it.
- Why: Three of these are given and two are held. Hold the drugs made dangerous by low potassium and magnesium (digoxin) or that will push them lower (furosemide); give the replacements and the drugs whose parameters are met.
- Tip: In a matrix, decide each row on its own. Don't assume a pattern; "low potassium" doesn't mean hold everything.

### [ ] ms1-ch2 (sata, step: analyze, Necrotizing soft tissue infection)
A 46-year-old with type 2 diabetes has had IV cefazolin for left lower leg cellulitis for 24 hours. The nurse reviews this morning's assessment.

**Which findings suggest a necrotizing soft tissue infection rather than worsening cellulitis? Select all that apply.**

- **[x]** Pain far worse than the skin looks: Yes: Pain out of proportion is often the earliest sign; the infection is deeper than the skin shows.
- **[x]** Crackling felt under the skin when pressed: Yes: Crepitus means gas in the tissue from gas-forming bacteria.
- **[x]** Dusky, purplish skin with blisters: Yes: Bullae and dusky skin mean the tissue is dying.
- **[x]** Redness spreading past the line marked yesterday despite IV antibiotics: Yes: Rapid spread despite antibiotics suggests a deep infection that needs surgery.
- [ ] Warm, red skin with a clear border: No: A well-defined, warm, red area is typical of cellulitis.
- [ ] Temperature 38.0: No: Fever happens in both; it doesn't tell them apart.
- [ ] Tenderness that matches the area of redness: No: Pain in proportion to the skin findings fits cellulitis.
- Why: Necrotizing infections spread along deep tissue planes. Pain out of proportion, crepitus, bullae, dusky skin and spread despite antibiotics are surgical emergencies.
- Tip: When a question asks what tells two conditions apart, rule out findings that occur in both, like fever.

## medsurg-4w-2

### [ ] ms2-ch1 (bowtie, step: hypo, Delirium tremens)
A 52-year-old admitted 60 hours ago for pancreatitis drinks a fifth of vodka a day. Now: T 38.4, HR 128, BP 172/104, RR 24. Drenched in sweat, disoriented to time and place, picking at the air, says there are snakes on the floor.

**Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.**

- cond:
  - **Delirium tremens**: Yes: Hallucinations, disorientation, fever and autonomic hyperactivity 48 to 96 hours after the last drink are delirium tremens.
  - Wernicke encephalopathy: No: Wernicke causes confusion, ataxia and eye movement problems, not fever, hypertension and hallucinations.
  - Hepatic encephalopathy: No: Hepatic encephalopathy causes confusion and asterixis, not a hyperadrenergic state.
  - Sepsis from pancreatitis: No: Sepsis can cause fever and confusion, but the timing and the vivid hallucinations point to withdrawal. Keep it in mind if he doesn't respond.
- actions:
  - **Give IV benzodiazepine per the withdrawal protocol**: Yes: Benzodiazepines are the treatment; delirium tremens often needs large, escalating doses.
  - **Seizure precautions with continuous monitoring**: Yes: Withdrawal seizures and arrhythmias can happen; he needs close monitoring.
  - Give haloperidol as the first-line drug: No: Haloperidol doesn't treat withdrawal and lowers the seizure threshold. It may be added only after benzodiazepines.
  - Give IV dextrose before thiamine: No: Glucose before thiamine can precipitate Wernicke encephalopathy. Thiamine goes first.
  - Restrict fluids to prevent cerebral edema: No: He's febrile, sweating and losing fluid; he needs fluids, not a restriction.
- params:
  - **Withdrawal score (CIWA-Ar) and level of sedation**: Yes: The score guides dosing, and sedation tells you if you've given too much.
  - **Heart rate and blood pressure**: Yes: Autonomic hyperactivity is part of the danger, and it should settle as treatment works.
  - Serum ammonia: No: Ammonia is for hepatic encephalopathy.
  - Blood alcohol level: No: The level doesn't guide withdrawal treatment; withdrawal happens as it falls.
  - Hemoglobin A1c: No: A1c doesn't help here.

- Why: This is delirium tremens, a medical emergency with real mortality. Treat with benzodiazepines titrated to symptoms, protect against seizures, give thiamine before glucose, and watch for oversedation.
- Tip: Bowtie: pick the condition first, then choose actions and parameters that match it, not ones that would fit a lookalike.

### [ ] ms2-ch2 (cloze, step: act, Acute hemolytic transfusion reaction)
Ten minutes into a unit of packed red cells, the client reports back pain and chills. T 38.7, HR 124, BP 92/56.

**Complete the sentences.**

- Blank 1:
  - **stop the transfusion**: Yes: Every milliliter makes a hemolytic reaction worse; stopping it is the first action.
  - slow the transfusion: No: Slowing still gives incompatible blood.
  - give acetaminophen: No: It treats the fever but not the reaction, and can hide it.
- Blank 2:
  - **normal saline through new tubing**: Yes: New tubing avoids flushing the blood left in the old line into the client.
  - normal saline through the blood tubing: No: The old tubing still holds incompatible blood.
  - D5W through new tubing: No: Dextrose solutions hemolyze red cells and aren't used with blood.
- Blank 3:
  - **sent to the blood bank with blood and urine samples**: Yes: The blood bank tests them to find the cause.
  - discarded in a biohazard bin: No: Discarding them destroys the evidence.
  - kept at the bedside for the provider: No: They need to go to the blood bank promptly.
- Why: Suspected hemolytic reaction: stop, keep the vein open with saline through new tubing, check vitals, notify the provider and the blood bank, and send the bag, tubing and samples for testing. Watch urine output and color.
- Tip: "First" questions: the action that stops the harm comes before treating the symptoms.

## medsurg-4w-3

### [ ] ms3-ch1 (highlight, step: cues, Delirium from urinary retention)
Night nurse's note, 02:00, for an 84-year-old admitted for a fall. Oriented and pleasant at 20:00.

**Highlight the findings that need follow-up.**

- **[highlight]** Now restless, pulling at her IV, calling for her late husband.: Yes: An acute change in attention and thinking is delirium, and it has a cause to find.
- **[highlight]** Last voided at 17:00.: Yes: Nine hours without voiding in an older adult points to retention.
- **[highlight]** Bladder scan 820 mL.: Yes: Urinary retention is a common, reversible cause of delirium.
- **[highlight]** Diphenhydramine 50 mg given at 22:00 for sleep.: Yes: Anticholinergic drugs cause both retention and delirium in older adults.
- [ ] Hearing aid in place.: No: That's good practice for preventing delirium.
- [ ] Ate 75% of dinner.: No: Normal intake.
- [ ] SpO₂ 96% on room air.: No: Normal; low oxygen is ruled out as a cause.
- Why: New delirium has a cause. Here: an anticholinergic sleep aid and a full bladder. Straight-cath per orders, report the diphenhydramine, and avoid it in older adults.
- Tip: With new confusion in an older adult, look for causes in the note: drugs, retention, infection, low oxygen, pain.

### [ ] ms3-ch2 (matrix, step: eval, DKA treatment response)
A 24-year-old with DKA has been on an insulin infusion and IV fluids for 6 hours. New results: glucose 194 (was 520), anion gap 14 (was 26), K 3.2 (was 5.1), bicarbonate 16 (was 8), HR 96 (was 128). She now has a new headache.

**For each finding, indicate whether it shows expected progress or needs follow-up now.**

- Glucose 194 → **Needs follow-up**: Falling is good, but under about 200 to 250 she needs dextrose added to her fluids so the insulin can keep clearing ketones without dropping her too low.
- Anion gap 14 → **Expected progress**: Closing toward normal: the ketoacidosis is resolving.
- Potassium 3.2 → **Needs follow-up**: Insulin is moving potassium into cells. It needs replacing now, and the drip may need adjusting per protocol.
- Bicarbonate 16 → **Expected progress**: Rising toward normal: the acidosis is correcting.
- Heart rate 96 → **Expected progress**: Falling with fluids: volume is coming back.
- New headache → **Needs follow-up**: During DKA treatment, a new headache can be an early sign of cerebral edema. Report it and check neuro status.
- Why: Progress isn't just a falling glucose. Watch for the three follow-ups during DKA treatment: add dextrose when glucose falls, replace potassium, and take new neuro symptoms seriously.
- Tip: "Expected progress" can still need an action. Ask whether a normal-looking trend changes what you need to do next.

## stepdown-6e-1

### [ ] sd-ch1 (bowtie, step: hypo, Retroperitoneal bleed after PCI)
A 63-year-old had a femoral PCI 4 hours ago. Now: new right flank and back pain, 7 of 10. HR 118, BP 92/58 (was 138/82). The groin site is soft, without hematoma, and distal pulses are present.

**Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.**

- cond:
  - **Retroperitoneal bleeding**: Yes: Back or flank pain with a fast pulse and falling pressure after femoral access is a retroperitoneal bleed until proven otherwise, even with a clean groin.
  - Acute stent thrombosis: No: Stent thrombosis causes chest pain and ECG changes, not back pain with signs of blood loss.
  - Vasovagal reaction to sheath removal: No: Vasovagal reactions slow the heart; this heart rate is fast.
  - Kidney stone: No: Possible, but it doesn't explain hypotension and tachycardia hours after a femoral puncture.
- actions:
  - **Notify the provider now and ask for a stat hemoglobin**: Yes: This needs a provider and labs now; bleeding can be large before it shows.
  - **Give IV fluid as ordered while keeping the client flat**: Yes: Volume support for low pressure, and flat positioning, while the bleed is found.
  - Apply a sandbag to the groin: No: The bleeding is behind the abdomen, not at the groin; pressure on the groin won't help.
  - Raise the head of the bed to 45 degrees for comfort: No: Flexing the hip can disturb the puncture site and worsen bleeding.
  - Give sublingual nitroglycerin: No: Nitroglycerin drops the pressure further in a client who's bleeding.
- params:
  - **Hemoglobin trend**: Yes: A falling hemoglobin confirms the bleed and its size.
  - **Heart rate and blood pressure**: Yes: Rising heart rate and falling pressure track blood loss.
  - Troponin: No: There's no sign of cardiac ischemia here.
  - Activated clotting time only: No: Clotting time matters but doesn't show blood loss.
  - The groin site alone: No: The groin looks fine; that's why this bleed is missed.

- Why: Retroperitoneal bleeding hides. The clue is pain in the back or flank with signs of blood loss after a femoral procedure. Get help, labs and volume; the groin can look perfect.
- Tip: When the obvious site looks normal but the vital signs say bleeding, think of where blood can hide.

### [ ] sd-ch2 (sata, step: solve, Heart failure with reduced EF)
A 68-year-old has atrial fibrillation at 142 and a new echo showing an EF of 25%. BP 118/72. Mild crackles at the bases.

**Which orders should the nurse question before giving? Select all that apply.**

- **[x]** Diltiazem 15 mg IV push: Yes: Non-dihydropyridine calcium channel blockers depress contraction and can worsen heart failure with a reduced EF.
- **[x]** Verapamil 5 mg IV push: Yes: Same class and same risk as diltiazem.
- **[x]** Ibuprofen 600 mg PO for a headache: Yes: NSAIDs cause sodium and water retention and worsen heart failure.
- [ ] Amiodarone IV per protocol: No: Amiodarone is an accepted option for rate or rhythm control when EF is low.
- [ ] Apixaban 5 mg PO twice a day: No: Anticoagulation for AF is appropriate.
- [ ] Furosemide 40 mg IV: No: Diuresis is appropriate for crackles and overload.
- Why: With a low EF, avoid drugs that weaken the heart's pumping (diltiazem, verapamil) or retain fluid (NSAIDs). An order can be active and still be wrong for this patient.
- Tip: "Question the order" items test whether you know who a drug is unsafe for, not just what it does.

## icu-3w-1

### [ ] icu-ch1 (highlight, step: cues, Cardiac tamponade after heart surgery)
ICU note, 6 hours after coronary bypass surgery.

**Highlight the findings that need immediate follow-up.**

- **[highlight]** Chest tube output fell from 120 mL/hr to 5 mL/hr.: Yes: A sudden stop after steady drainage can mean a clot is blocking the tube and blood is collecting around the heart.
- **[highlight]** CVP rose from 8 to 18.: Yes: Rising filling pressures with falling output fit tamponade.
- **[highlight]** BP 84/66, narrowing pulse pressure.: Yes: Low pressure with a narrow pulse pressure is the heart failing to fill.
- **[highlight]** Heart sounds now muffled.: Yes: Fluid around the heart muffles the sounds.
- [ ] Temperature 37.6.: No: A low-grade temperature is common after bypass.
- [ ] Glucose 168 on an insulin infusion.: No: Within the usual post-op target.
- [ ] Pacing wires capped and dry.: No: Normal.
- Why: Tamponade after heart surgery: falling chest tube output, rising CVP, hypotension with narrow pulse pressure, muffled heart sounds. It may need a return to the OR.
- Tip: A number that "improves" (less drainage) can be the warning sign. Ask why it changed.

### [ ] icu-ch2 (cloze, step: act, Vasopressor extravasation)
Norepinephrine is running through a forearm peripheral IV. The site is cold, pale and hard.

**Complete the sentences.**

- Blank 1:
  - **stop the infusion**: Yes: Stop more drug going into the tissue.
  - slow the infusion: No: Any more norepinephrine in the tissue worsens the injury.
  - flush the IV with saline: No: Flushing pushes more drug into the tissue.
- Blank 2:
  - **phentolamine**: Yes: Phentolamine reverses the vasoconstriction that kills tissue.
  - hyaluronidase: No: Hyaluronidase is for some other extravasations, not vasopressors.
  - protamine: No: Protamine reverses heparin.
- Blank 3:
  - **subcutaneously around the site**: Yes: It's infiltrated into the affected tissue.
  - IV through the same catheter: No: It's given into the tissue, not systemically through the IV.
  - by mouth: No: It has to reach the tissue directly.
- Blank 4:
  - **a central line**: Yes: Vasopressors belong in a central line, or a large, well-placed peripheral IV only briefly with close checks.
  - a new IV in the same arm: No: Same arm, same risk, and the arm is already injured.
  - the same IV after flushing: No: The line has failed.
- Why: Vasopressor extravasation: stop, aspirate, phentolamine around the site, mark and monitor the area, and move the drip to a central line.
- Tip: For drug-specific antidotes, match the antidote to how the drug causes harm (here, vasoconstriction).

## ed-podb-1

### [ ] ed-ch1 (matrix, step: solve, Right ventricular infarction)
A 62-year-old has an inferior STEMI. A right-sided ECG shows ST elevation in V4R. BP 92/60, HR 58, lungs clear.

**For each intervention, indicate whether it is indicated or should be avoided.**

- IV normal saline bolus → **Indicated**: The right ventricle depends on preload; fluids support the pressure.
- Sublingual nitroglycerin → **Avoid**: Nitrates drop preload and can cause profound hypotension in RV infarction.
- Aspirin 324 mg chewed → **Indicated**: Every STEMI gets aspirin unless allergic.
- IV furosemide → **Avoid**: Diuretics remove the preload the right ventricle needs.
- Activate the cath lab → **Indicated**: Reperfusion is the treatment.
- IV morphine for pain → **Avoid**: Morphine lowers preload and blood pressure; use with great caution, if at all.
- Why: RV infarction is preload-dependent. Avoid anything that lowers preload (nitrates, diuretics, morphine) and support it with fluids while reperfusion is arranged.
- Tip: When a scenario names a special case (right-sided changes), expect the usual drugs to be the traps.

### [ ] ed-ch2 (bowtie, step: hypo, Subdural hematoma on anticoagulation)
An 81-year-old on warfarin fell two days ago and was fine. Today her daughter says she's sleepy and "not herself." GCS 13, left pupil 5 mm and sluggish (right 3 mm), headache, vomited once. INR 3.4.

**Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.**

- cond:
  - **Subdural hematoma**: Yes: A fall on warfarin, then slowly falling consciousness and a dilating pupil days later, is a classic subdural.
  - Ischemic stroke: No: Possible, but the fall, the anticoagulant and a unilateral dilated pupil point to a bleed.
  - Migraine: No: Migraine doesn't cause a falling GCS and a fixed or sluggish pupil.
  - Hypoglycemia: No: Check a glucose, but it doesn't explain a unilateral pupil change.
- actions:
  - **Get a stat head CT**: Yes: Imaging confirms the bleed fast.
  - **Prepare anticoagulation reversal as ordered (PCC and IV vitamin K)**: Yes: Reversing warfarin limits growth of the bleed.
  - Give aspirin: No: An antiplatelet worsens bleeding.
  - Give ondansetron and observe: No: Treating the vomiting misses a bleed.
  - Prepare for a lumbar puncture: No: A lumbar puncture with raised pressure in the skull can cause herniation.
- params:
  - **GCS and pupils**: Yes: A falling GCS or enlarging pupil means the bleed is growing.
  - **INR**: Yes: Tracks reversal.
  - Troponin: No: No sign of cardiac ischemia.
  - Serum lactate: No: Not related.
  - Lipase: No: Not related.

- Why: Older adults on anticoagulants can bleed slowly after minor falls. A unilateral dilated pupil and falling consciousness mean pressure is rising: CT and reversal now.
- Tip: Days between injury and symptoms don't rule a bleed out; slow bleeds are the ones that fool people.

## ld-2s-1

### [ ] ld-ch1 (highlight, step: cues, Uterine rupture)
Labor note for a 33-year-old attempting vaginal birth after a previous cesarean. Epidural placed 3 hours ago with good relief.

**Highlight the findings that need immediate follow-up.**

- **[highlight]** Sudden sharp abdominal pain that continues between contractions, breaking through the epidural.: Yes: Pain through a working epidural is a red flag for rupture.
- **[highlight]** Fetal heart rate in the 80s for the last 4 minutes.: Yes: Prolonged bradycardia is the most common sign of rupture.
- **[highlight]** The fetal head, previously at +1 station, is now at -2.: Yes: Loss of station means the baby has moved back through the tear.
- **[highlight]** Contractions have stopped.: Yes: A ruptured uterus can't contract normally.
- [ ] Cervix 7 cm.: No: Expected labor progress.
- [ ] GBS negative.: No: Not related.
- [ ] Temperature 37.4.: No: Normal.
- Why: Uterine rupture during a trial of labor after cesarean: sudden pain (even through an epidural), fetal bradycardia, loss of station and stopped contractions. It's a surgical emergency for both.
- Tip: In obstetrics, sudden changes in the fetal heart rate plus new maternal pain point to an emergency. "Contractions stopped" is not good news in labor.

### [ ] ld-ch2 (sata, step: analyze, Intraamniotic infection)
A 26-year-old in labor has had ruptured membranes for 20 hours.

**Which findings support intraamniotic infection (chorioamnionitis)? Select all that apply.**

- **[x]** Maternal temperature 39.1: Yes: Maternal fever is the main criterion.
- **[x]** Fetal heart rate baseline 170: Yes: Fetal tachycardia often accompanies maternal infection.
- **[x]** Foul-smelling, cloudy amniotic fluid: Yes: Purulent or foul fluid supports infection.
- **[x]** Uterine tenderness between contractions: Yes: A tender uterus supports the diagnosis.
- [ ] Clear amniotic fluid: No: Clear fluid is normal.
- [ ] Maternal heart rate 72: No: Normal. Maternal tachycardia would support infection.
- [ ] Fetal heart rate baseline 135 with moderate variability: No: A reassuring tracing.
- Why: Intraamniotic infection: maternal fever with fetal tachycardia, foul or purulent fluid, or uterine tenderness. Long rupture of membranes raises the risk. Treat with antibiotics and plan for the newborn.
- Tip: Select-all items reward the full set. Each pick that's wrong cancels one that's right, so don't guess on the borderline ones.

## ob-2n-1

### [ ] ob-ch1 (cloze, step: act, Newborn hypoglycemia)
A 4.4 kg infant of a mother with diabetes is 2 hours old and asymptomatic. Glucose 22 mg/dL. The mother wants to breastfeed only.

**Complete the sentences.**

- Blank 1:
  - **give 40% dextrose gel to the inner cheek and help her breastfeed**: Yes: For an asymptomatic infant, oral dextrose gel plus a feed raises glucose and supports breastfeeding.
  - give formula by bottle: No: It may be used later, but it isn't first-line for this mother's goals and an asymptomatic infant.
  - start IV dextrose: No: IV dextrose is for symptomatic infants or when gel and feeding fail.
- Blank 2:
  - **30 to 60 minutes**: Yes: Recheck soon after treatment to make sure it worked.
  - 4 hours: No: Too long for a low glucose.
  - 12 hours: No: Far too long.
- Blank 3:
  - **jittery, limp, or has a seizure**: Yes: Symptoms mean the brain is short on glucose; IV dextrose is needed.
  - pink and alert: No: That's reassuring.
  - hungry: No: Expected.
- Why: Infants of diabetic mothers make extra insulin and drop their glucose after birth. Asymptomatic lows are treated with dextrose gel and feeding; symptomatic lows need IV dextrose.
- Tip: Match the treatment to whether the infant has symptoms. Symptoms change the urgency.

### [ ] ob-ch2 (matrix, step: analyze, Postpartum findings)
The nurse reviews findings for clients on postpartum day 2.

**For each finding, indicate whether it is expected or should be reported.**

- Fundus firm, 2 cm below the umbilicus → **Expected**: The uterus descends about 1 cm a day.
- Lochia rubra, moderate → **Expected**: Red lochia is normal for the first 3 to 4 days.
- Saturating a pad in an hour → **Report**: That's heavy bleeding.
- BP 158/104 with a headache → **Report**: Possible postpartum preeclampsia with severe features.
- Cramping during breastfeeding → **Expected**: Oxytocin from breastfeeding contracts the uterus.
- One calf red, warm and swollen → **Report**: Possible DVT; postpartum clients are at high risk.
- Why: Know what's normal for each postpartum day, so the abnormal stands out: heavy bleeding, high blood pressure with symptoms, and signs of a clot.
- Tip: "Report" means outside the expected range for that day, not just uncomfortable.

## psych-3e-1

### [ ] p3-ch1 (bowtie, step: hypo, Psychogenic polydipsia)
A 38-year-old with schizophrenia on clozapine has been drinking from every fountain on the unit. Weight up 3 kg since morning. Now confused and vomiting. Sodium 121.

**Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.**

- cond:
  - **Water intoxication (hyponatremia from polydipsia)**: Yes: Compulsive drinking, rapid weight gain, confusion, vomiting and a low sodium are water intoxication.
  - Neuroleptic malignant syndrome: No: NMS causes fever and rigidity, not low sodium with weight gain.
  - Clozapine-induced agranulocytosis: No: Agranulocytosis causes infection, not low sodium.
  - Lithium toxicity: No: He isn't on lithium.
- actions:
  - **Restrict fluids and weigh per protocol**: Yes: Restricting water and tracking weight are the core of treatment.
  - **Notify the provider and start seizure precautions**: Yes: Sodium at 121 with confusion risks seizures; the provider needs to know now.
  - Encourage sports drinks to replace electrolytes: No: More fluid worsens it, sports drinks included.
  - Give PRN haloperidol for the confusion: No: Sedating confusion hides the cause.
  - Stop clozapine permanently: No: Clozapine may help polydipsia in some clients; stopping it isn't the nurse's call.
- params:
  - **Serum sodium**: Yes: Tracks correction (slowly, to avoid brain injury).
  - **Weight and neuro status**: Yes: Weight tracks water intake; neuro status tracks danger.
  - Absolute neutrophil count: No: Important on clozapine, but not the issue here.
  - Lithium level: No: Not on lithium.
  - Creatine kinase: No: For NMS.

- Why: Psychogenic polydipsia can cause life-threatening hyponatremia. Restrict and track fluids, monitor sodium and neuro status, and correct slowly.
- Tip: When a psych client is confused, look for a medical cause before a psychiatric one.

### [ ] p3-ch2 (matrix, step: solve, Least restrictive intervention)
A client with mania is loud and intrusive in the day room, interrupting groups. No threats, no weapons, responds briefly to staff.

**For each intervention, indicate whether it is appropriate now or not justified yet.**

- Calm verbal redirection with clear limits → **Appropriate now**: The first step on the least-restrictive ladder.
- Offer an oral PRN → **Appropriate now**: Voluntary medication is less restrictive than anything forced.
- Offer a quiet room by choice → **Appropriate now**: Lowering stimulation helps mania, and it's voluntary.
- Seclusion → **Not justified yet**: Only for imminent danger to self or others when less restrictive steps fail.
- Emergency IM medication → **Not justified yet**: Requires an emergency: imminent danger. Being loud isn't that.
- Four-point restraints → **Not justified yet**: The most restrictive measure; never for disruption alone.
- Why: Use the least restrictive intervention that keeps everyone safe. Being loud and intrusive calls for limits, choices and lower stimulation, not seclusion, restraint or forced medication.
- Tip: Restraint and seclusion are justified by imminent danger, not by inconvenience or disruption.

## psych-4n-1

### [ ] p4-ch1 (cloze, step: act, Mandated reporting)
A 15-year-old tells the nurse that her stepfather hits her and she's scared to go home.

**Complete the sentences.**

- Blank 1:
  - **report to child protective services the same day**: Yes: Mandated reporters report reasonable suspicion promptly; confirming isn't required.
  - wait until the psychiatrist confirms the story: No: The duty to report is the nurse's own and doesn't wait for anyone.
  - ask the parents for their side first: No: That could put her in danger.
- Blank 2:
  - **that the nurse has to share this to keep her safe**: Yes: Honesty about limits keeps trust.
  - that it will stay between them: No: A promise you can't keep breaks trust.
  - nothing about the report: No: She deserves to know what happens next.
- Blank 3:
  - **her exact words in quotes**: Yes: Her own words are the most accurate record.
  - "abuse alleged" as a summary: No: A summary loses what she actually said.
  - nothing until it's investigated: No: Documentation is required now.
- Why: Mandated reporting requires a report on reasonable suspicion, not proof. Be honest with the young person about why you're telling, and record what they said in their own words.
- Tip: Answers that wait for someone else to confirm are almost always wrong for mandated reporting.

### [ ] p4-ch2 (sata, step: cues, Refeeding syndrome)
A 16-year-old with anorexia (BMI 14.8) is on day 3 of refeeding.

**Which findings suggest refeeding syndrome? Select all that apply.**

- **[x]** Phosphorus 1.8: Yes: Low phosphorus is the hallmark; cells pull it in as feeding restarts.
- **[x]** New swelling in the feet: Yes: Fluid retention as insulin returns.
- **[x]** Heart rate 118, up from 52: Yes: A sharp rise can be heart strain from fluid and electrolyte shifts.
- **[x]** New confusion: Yes: Severe low phosphorus affects the brain.
- [ ] Weight up 0.2 kg: No: Small gains are the goal.
- [ ] Feeling full after meals: No: Expected while the stomach readjusts.
- [ ] Potassium 4.1: No: Normal; low potassium would support refeeding syndrome.
- Why: Refeeding syndrome: as nutrition returns, insulin drives phosphorus, potassium and magnesium into cells. Watch labs daily the first week, plus heart rate, swelling and mental status.
- Tip: Normal values are distractors in select-all items: only pick findings that are actually abnormal.

## peds-5s-1

### [ ] pd-ch1 (matrix, step: analyze, Bruising and abuse)
The nurse assesses bruises on several children.

**For each finding, indicate whether it is concerning for abuse or consistent with normal activity.**

- Any bruise on a 4-month-old who can't roll yet → **Concerning**: Infants who don't cruise shouldn't bruise. "Those who don't cruise rarely bruise."
- Bruises on the shins of an active 3-year-old → **Consistent with normal activity**: Bony fronts of the legs bruise in normal play.
- Bruising on the ears and neck of a 2-year-old → **Concerning**: Ears, neck and torso are protected areas; bruising there is a warning sign.
- A bruise on the forehead of a 12-month-old learning to walk → **Consistent with normal activity**: Foreheads take falls when kids learn to walk.
- A bruise in the shape of a hand on a child's back → **Concerning**: Patterned bruises suggest an object or a hand.
- A history that doesn't match the child's development → **Concerning**: "He rolled off the couch" doesn't fit a 1-month-old.
- Why: Use TEN-4-FACESp: bruising on the torso, ears or neck, any bruise under 4 months, or patterned bruising is concerning. Check whether the story fits the child's development.
- Tip: With children, ask whether the injury fits the development and the story.

### [ ] pd-ch2 (bowtie, step: hypo, Bronchiolitis with respiratory failure)
A 3-month-old with RSV is on high-flow oxygen. RR 74, head bobbing, grunting, deep retractions. SpO₂ 88% on 60% oxygen. Two apnea pauses of 20 seconds in the last hour.

**Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.**

- cond:
  - **Impending respiratory failure**: Yes: Grunting, head bobbing, apneas and low saturation on high oxygen mean he's failing.
  - Expected RSV course: No: RSV is common, but these signs aren't the expected course.
  - Dehydration: No: Possible alongside, but it doesn't explain grunting and apnea.
  - Pneumothorax: No: Possible but less likely; get help either way.
- actions:
  - **Call a rapid response and escalate care now**: Yes: He needs a higher level of care now.
  - **Suction the nose before reassessing**: Yes: Infants breathe through their noses; suctioning can quickly improve breathing.
  - Increase oral feeds to keep him hydrated: No: With this work of breathing he can aspirate. Feeds may need to stop.
  - Give albuterol every 2 hours: No: Routine albuterol isn't recommended in bronchiolitis.
  - Give a cough suppressant: No: Not used in infants.
- params:
  - **Work of breathing and apneas**: Yes: The earliest signs of failure.
  - **SpO₂ and oxygen requirement**: Yes: A rising oxygen need tracks worsening.
  - Blood glucose: No: Not the main concern.
  - Temperature only: No: Doesn't track breathing.
  - Stool output: No: Not related.

- Why: In bronchiolitis, watch effort and apneas more than the saturation number. Escalate early in young infants.
- Tip: In infants, grunting, head bobbing and apnea are late signs. Act on them immediately.
