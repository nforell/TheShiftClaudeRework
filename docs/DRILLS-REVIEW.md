# Drill content: clinical review checklist

Generated from `src/drills-content.js` by `node tools/drills_doc.js`. Do not edit by hand; edit the content and regenerate.

For each card: is the right answer right, is every wrong answer clearly wrong (not just less good), are the numbers current, and is the pearl safe to remember as a rule? Tick the box and initial it.

Cards: 50 Med Pass, 36 Who's First, 20 SBAR, 22 De-escalation.

## Med Pass

### [ ] mp-metoprolol: Metoprolol tartrate 25 mg PO (Samuel Ortiz, 71)
His 09:00 dose. He says he feels "a little floaty" this morning.

- **Check first:** Apical pulse and blood pressure → Apical 52. BP 94/58.
- Other checks: This morning's potassium level (K 4.0. Normal.); Daily weight compared with yesterday (Down 0.5 kg since yesterday.)
- **Decision:** Hold it and tell the provider
- Wrong:
  - Give it, then recheck his pulse in an hour _(why not: By then the dose is already working. The parameter is checked before the dose, not after.)_
  - Hold it now and give it at noon if his pulse is over 60 _(why not: Holding is right, but choosing a new time yourself is a new order. The provider needs to know he's bradycardic and hypotensive.)_
- Why: A pulse of 52 and a systolic of 94 are under the usual hold lines. Another dose slows him further.
- Pearl: Beta blocker: pulse and pressure first. Under 60 or a systolic under 100, hold and report.

### [ ] mp-digoxin: Digoxin 0.125 mg PO (Ruth Abernathy, 84)
She skipped breakfast. "My stomach is off, and the lights look fuzzy."

- **Check first:** Apical pulse for a full minute → Apical 54, irregular.
- Other checks: Sitting blood pressure (BP 128/76.); Morning potassium level (K 3.9.)
- **Decision:** Hold it and report possible toxicity
- Wrong:
  - Hold it, recount in an hour, and give it if the pulse is over 60 _(why not: Nausea and vision changes point to toxicity whatever the next pulse is. She needs a level and the provider, not a delayed dose.)_
  - Give it and ask for a digoxin level with the morning labs _(why not: If she's toxic, this dose adds to it. The level comes before the next dose, not after.)_
- Why: Slow pulse, nausea and blurry or halo vision together point to digoxin toxicity, which is common in frail older adults.
- Pearl: Digoxin: count the apical pulse for a full minute. Under 60, or nausea and vision changes, hold and ask for a level and a potassium.

### [ ] mp-furosemide-k: Furosemide 40 mg IV (Gloria Vance, 66)
Her ankles are still swollen. Morning labs just posted.

- **Check first:** Potassium → K 3.1. Low.
- Other checks: Daily weight (Down 0.6 kg since yesterday.); Heart rate (HR 84, regular.)
- **Decision:** Call the provider about the potassium before the dose
- Wrong:
  - Give it and recheck her potassium in the morning _(why not: The furosemide will push 3.1 lower tonight. Waiting for morning labs leaves her open to an arrhythmia overnight.)_
  - Hold it and recheck the potassium in 4 hours _(why not: Holding without telling anyone leaves her overloaded and her potassium untreated. The provider has to adjust both.)_
- Why: Furosemide pulls potassium out with the water. At 3.1 another dose can tip her into an arrhythmia. The provider may replace potassium and still diurese.
- Pearl: Loop diuretics waste potassium. A low K gets reported before the dose, not after the run of PVCs.

### [ ] mp-lispro-low: Insulin lispro 6 units SubQ (Grace Okafor, 46)
Her tray is here. She says she feels shaky and a bit sweaty.

- **Check first:** Fingerstick glucose → Glucose 64.
- Other checks: Last A1c (A1c 9.8% last month.); Her carbohydrate count for breakfast (About 60 g on the tray.)
- **Decision:** Hold it, give 15 g of fast sugar, recheck in 15 minutes
- Wrong:
  - Give 15 g of fast sugar, then give the insulin once she starts eating _(why not: Treat the low, then recheck in 15 minutes. Mealtime insulin waits until she's back in range, and the provider should know she went low.)_
  - Hold the insulin and have her eat her breakfast tray _(why not: Holding is right, but a meal tray is slow sugar. With symptoms at 64 she needs 15 g of fast sugar now and a recheck in 15 minutes.)_
- Why: She is already low and has symptoms. Rapid-acting insulin on top of 64 drives her lower before the food absorbs.
- Pearl: Rule of 15: 15 grams of fast sugar, recheck in 15 minutes. No mealtime insulin into a low. Tell the provider.

### [ ] mp-warfarin: Warfarin 5 mg PO (Henry Ballard, 77)
He mentions his gums bled when he brushed this morning.

- **Check first:** INR → INR 4.6.
- Other checks: Platelets (Platelets 210,000.); Hemoglobin (12.8, stable.)
- **Decision:** Hold it and tell the provider
- Wrong:
  - Give half the dose and recheck the INR tomorrow _(why not: Changing a warfarin dose is the prescriber's call. At 4.6 with new bleeding, hold and report.)_
  - Hold it and recheck the INR tomorrow _(why not: Holding is right, but a high INR with new bleeding needs the provider today. They may want vitamin K or a bleeding workup.)_
- Why: For atrial fibrillation the target INR is 2 to 3. At 4.6 with new bleeding, another dose raises his risk of a serious bleed.
- Pearl: Warfarin: check the INR every time. Above range, hold and report. Vitamin K is the provider's call, not a nursing add-on.

### [ ] mp-enox-hit: Enoxaparin 40 mg SubQ (Darnell Price, 59)
Day 6. He was on a heparin drip before surgery. His left calf is new and sore.

- **Check first:** Platelets, compared with admission → 82,000. It was 230,000 on admission.
- Other checks: Creatinine and kidney function (Creatinine 0.9. Normal.); Calf circumference, both legs (Left calf 2 cm bigger than the right.)
- **Decision:** Hold it, stop all heparin, call now
- Wrong:
  - Hold the enoxaparin but keep the heparin flushes in his IV _(why not: Even small heparin flushes keep HIT going. All heparin stops, flushes included.)_
  - Hold it and ask for a leg ultrasound before deciding _(why not: The ultrasound is reasonable, but a halved platelet count after heparin is HIT until proven otherwise. He needs a non-heparin anticoagulant now; waiting leaves the clot untreated.)_
- Why: A platelet drop of more than half, 5 to 10 days after heparin, with a new clot, is heparin-induced thrombocytopenia until proven otherwise.
- Pearl: HIT: platelets fall and clots form. Stop all heparin, including flushes and enoxaparin, and call. He needs a non-heparin anticoagulant.

### [ ] mp-ace-angio: Lisinopril 10 mg PO (Leticia Moore, 54)
She started it yesterday. She sounds a little thick when she says good morning.

- **Check first:** Look at her face and mouth → Her lips and tongue are swollen.
- Other checks: Blood pressure before the dose (BP 144/88.); When she last took it (Yesterday at 09:00, her first dose.)
- **Decision:** Hold it, stay with her, call rapid response
- Wrong:
  - Hold it, give the PRN diphenhydramine, and recheck in 30 minutes _(why not: ACE-inhibitor angioedema comes from bradykinin, not histamine, so antihistamines don't reliably help. A swelling tongue needs the team now.)_
  - Hold it and ask the prescriber to switch her to an ARB _(why not: Switching drugs is a later question. Right now her airway is the problem.)_
- Why: Lip and tongue swelling on an ACE inhibitor is angioedema. It can close the airway, and antihistamines don't reliably stop it.
- Pearl: ACE inhibitor plus facial or tongue swelling: never the next dose. Airway first, get help, and list it as an allergy.

### [ ] mp-morphine-sed: Morphine 4 mg IV, as needed (Marcus Bell, 58)
His wife says he asked for pain medicine. He has sleep apnea.

- **Check first:** Sedation and breathing → Drifts off mid-sentence. RR 9. SpO₂ 89%.
- Other checks: Pain score (He mumbles "eight" and closes his eyes.); Time of his last opioid dose (Oxycodone 10 mg at 04:30.)
- **Decision:** Hold it, rouse him, CPAP on, tell the provider
- Wrong:
  - Give half the dose and recheck his sedation in 30 minutes _(why not: He's already falling asleep mid-sentence. Any opioid now deepens it.)_
  - Hold it and give naloxone right away _(why not: He rouses to voice. Wake him, get his CPAP on and call; naloxone is for a patient you can't rouse or whose breathing stays slow, and it takes away all his pain control.)_
- Why: Drifting off mid-sentence is sedation level 3. Sedation comes before the breathing stops, and sleep apnea makes it worse.
- Pearl: Sedation comes before respiratory depression. A sleepy patient on opioids gets assessed, not dosed.

### [ ] mp-kcl: Potassium chloride 10 mEq IV (Imani Shaw, 38)
A small premixed bag. Pharmacy sent it up. She's been vomiting for two days.

- **Check first:** Urine output → 240 mL over the last 6 hours.
- Other checks: Glucose (96.); Magnesium level (Mg 2.0.)
- **Decision:** Run it on a pump, no faster than 10 mEq an hour
- Wrong:
  - Run it over 30 minutes so it's in before her next lab draw _(why not: That's 20 mEq an hour, double the usual limit through a peripheral IV on a regular floor. Faster potassium risks arrhythmia and burns the vein.)_
  - Hold it until her vomiting stops _(why not: Vomiting is why she's losing potassium. With urine flowing, replace it now.)_
- Why: Her kidneys are making urine, so it's safe to replace. IV potassium is never pushed: a bolus can stop the heart.
- Pearl: Never push potassium. Check that urine is flowing, then pump it, usually 10 mEq an hour or slower on a regular floor.

### [ ] mp-lithium: Lithium carbonate 300 mg PO (Daniel Kim, 33)
He calls it a stomach bug: two days of diarrhea. His hand shakes holding the cup.

- **Check first:** Lithium level and how he looks → Level 1.8. Coarse tremor. Slow to answer.
- Other checks: Blood pressure, sitting (BP 118/74.); Morning sodium level (Na 134.)
- **Decision:** Hold it and call for a medical evaluation
- Wrong:
  - Hold this dose, push fluids, and give it tonight _(why not: Fluids alone won't fix a level of 1.8 with neuro signs. He needs a medical evaluation, and the next dose waits for the prescriber.)_
  - Give it and recheck the level in the morning _(why not: At 1.8 with a coarse tremor and slowed thinking, another dose can push him toward seizures.)_
- Why: Fluid loss raises lithium levels. 1.8 with a coarse tremor and slowed thinking is toxicity, and it can progress to seizures.
- Pearl: Lithium works in a narrow range, about 0.6 to 1.2. Vomiting, diarrhea, coarse tremor or confusion: hold and get a level.

### [ ] mp-clozapine: Clozapine 100 mg PO (Theo Grant, 41)
He says his throat has been sore since yesterday.

- **Check first:** Absolute neutrophil count → ANC 800.
- Other checks: Heart rate, counted for a minute (HR 98.); When he last had a bowel movement (Yesterday.)
- **Decision:** Hold it and call now
- Wrong:
  - Hold it and recheck the ANC tomorrow _(why not: Holding is right, but a sore throat with an ANC of 800 could be the start of a serious infection. The prescriber needs to know today.)_
  - Give it and ask for a throat swab _(why not: With an ANC under 1,000, clozapine is interrupted. The swab is reasonable; the dose isn't.)_
- Why: An ANC under 1,000 is moderate neutropenia; clozapine is interrupted. A sore throat could be the first sign of a serious infection.
- Pearl: Clozapine: check the ANC before the dose. Fever, sore throat or flu-like symptoms are urgent until proven otherwise.

### [ ] mp-levo: Levothyroxine 75 mcg PO (Priya Raman, 62)
06:00. She takes calcium and iron with breakfast at home.

- **Check first:** When she last ate → Nothing since 21:00. Breakfast comes at 07:30.
- Other checks: Her last TSH result (Last month: in range.); Resting heart rate (HR 76.)
- **Decision:** Give it now with a full glass of water
- Wrong:
  - Give it with breakfast at 07:30 so it won't upset her stomach _(why not: Food cuts absorption. It goes on an empty stomach, 30 to 60 minutes before breakfast.)_
  - Give it now along with her morning calcium _(why not: Calcium binds levothyroxine. Separate them by at least 4 hours.)_
- Why: Levothyroxine absorbs best on an empty stomach, 30 to 60 minutes before food, and at least 4 hours apart from calcium or iron.
- Pearl: Not every check ends in a hold. When it's safe and timed right, give it on time.

### [ ] mp-apap-max: Acetaminophen 1,000 mg PO, scheduled (Frank Delgado, 68)
Due at 12:00. He also has hydrocodone-acetaminophen ordered for breakthrough pain.

- **Check first:** Every acetaminophen since midnight → 1 g at 00:00 and 06:00, plus 2 hydrocodone-acetaminophen tablets (325 mg each) at 04:00 and 10:00. Total 3.3 g.
- Other checks: Pain score, at rest and moving (Pain 4 of 10.); Yesterday's liver enzymes (Normal yesterday.)
- **Decision:** Hold it and ask for the orders to be adjusted
- Wrong:
  - Give it and tell the next nurse to skip his 16:00 hydrocodone _(why not: This dose alone puts him at 4.3 g today. The fix is new orders, not a handoff note.)_
  - Give 650 mg instead of 1,000 _(why not: That's still 3.95 g today, right at the adult limit and above many hospitals' limit for older adults. Changing a dose is the prescriber's decision.)_
- Why: Another gram makes 4.3 g today. Adults shouldn't exceed 4 g a day, and many hospitals cap older adults lower.
- Pearl: Count every acetaminophen, including combination pills. Adults: no more than 4 g a day, often less in older adults and liver disease.

### [ ] mp-pcn: Amoxicillin 500 mg PO (Olivia Hart, 29)
A new order. She says she's allergic "to something, a penicillin maybe."

- **Check first:** Her allergy band and chart → Penicillin: hives and throat tightness.
- Other checks: Her temperature right now (38.1.); When her ear pain started (Three days ago, worse at night.)
- **Decision:** Hold it and call for a different antibiotic
- Wrong:
  - Give it. Amoxicillin isn't a true penicillin _(why not: Amoxicillin is a penicillin (an aminopenicillin), so her reaction applies.)_
  - Give it after premedicating with diphenhydramine _(why not: Premedicating doesn't prevent anaphylaxis. With throat tightness last time, it isn't given at all.)_
- Why: Amoxicillin is a penicillin. Throat tightness last time means this could be anaphylaxis.
- Pearl: Match the allergy to the drug class, not just the name. Ask what happened last time.

### [ ] mp-two-ids: Oxycodone 5 mg PO (Kenneth Lee, 66)
Room 302, bed B. You say "Mr. Lee?" and he says "Yep, that's me."

- **Check first:** His name and birth date, from him, against the band and MAR → He says "Kevin Lee, March 4, 1961." Your MAR is Kenneth Lee, 1958.
- Other checks: The room and bed number on the door, against the MAR (Room 302, bed B.); How he rates his pain right now (Pain 6.)
- **Decision:** Don't give it. Sort out the mix-up first
- Wrong:
  - Recheck the room and bed against the MAR, then give it _(why not: Room and bed are locations, not identifiers. Two identifiers he stated already disagree with the MAR.)_
  - Give it, then report the band mix-up _(why not: Wrong patient: Kevin has never had opioids. Sort out who he is before anything is given.)_
- Why: Two Mr. Lees on the unit. A room number and a yes are not identifiers. The patient states them; you match them.
- Pearl: Two identifiers, said by the patient, matched to the band and the MAR. Every time.

### [ ] mp-spiro: Spironolactone 25 mg PO (Mae Collins, 73)
She's also on lisinopril. She says her legs feel heavy.

- **Check first:** Potassium → K 5.9.
- Other checks: Blood pressure (BP 122/70.); Creatinine (1.6, up from 1.3.)
- **Decision:** Hold it and call. Ask for an ECG
- Wrong:
  - Hold the spironolactone but give the lisinopril _(why not: Lisinopril raises potassium too. At 5.9 both wait for the provider.)_
  - Hold it and recheck the potassium in the morning _(why not: A potassium of 5.9 with weakness needs an ECG and treatment now, not tomorrow.)_
- Why: Spironolactone keeps potassium, and so does lisinopril. At 5.9 with weakness, she needs an ECG and treatment, not more.
- Pearl: Potassium-sparing diuretics, ACE inhibitors and ARBs raise K. Above about 5.0, hold and report; high K plus weakness gets an ECG.

### [ ] mp-nitro-pde5: Nitroglycerin 0.4 mg SL (Walter Ames, 63)
Chest pressure, 5 of 10. The ECG is done and the team is on the way.

- **Check first:** Ask about erectile dysfunction medicines → He took sildenafil at 22:00 last night.
- Other checks: Blood pressure in both arms, sitting up (BP 132/80.); Heart rate and rhythm on the monitor (HR 88.)
- **Decision:** Hold the nitro and tell the provider
- Wrong:
  - Give it, since his systolic is over 100 _(why not: Blood pressure is only half the check. Sildenafil in the last 24 hours makes nitrates dangerous at any starting pressure.)_
  - Give it and have IV fluids ready in case his pressure drops _(why not: Preparing for the drop you expect isn't a reason to cause it.)_
- Why: Sildenafil within 24 hours (tadalafil within 48) plus nitrates can drop the pressure dangerously low.
- Pearl: Before nitro: blood pressure, and ask about sildenafil, vardenafil or tadalafil. Men often don't list them.

### [ ] mp-glargine: Insulin glargine 20 units SubQ (Rafael Soto, 50)
21:00. He ate most of his dinner.

- **Check first:** Fingerstick glucose → Glucose 182.
- Other checks: Evening potassium level (K 4.1.); Blood pressure (BP 130/78.)
- **Decision:** Give the full dose
- Wrong:
  - Give half the dose, since he'll be fasting overnight _(why not: Basal insulin covers the body's overnight needs. At 182 the full dose is right, and changing it is the prescriber's call.)_
  - Give it, plus correction lispro for the 182 _(why not: Correction insulin at bedtime raises the risk of overnight lows, and it wasn't ordered for bedtime. Give what's ordered.)_
- Why: Basal insulin covers the body's background needs through the night. 182 is safe; holding it sets him up for a high morning.
- Pearl: Don't hold basal insulin because a meal was small. Hold for a low, and call.

### [ ] mp-lasix-give: Furosemide 40 mg PO (Beatrice Lowell, 79)
Crackles at both bases. Up 1.5 kg since yesterday. She asks if she can skip it so she isn't up all night.

- **Check first:** Potassium and blood pressure → K 4.2. BP 128/74.
- Other checks: Temperature, since she has crackles (36.9.); Fingerstick glucose (104.)
- **Decision:** Give it now, and explain why the timing helps
- Wrong:
  - Respect her wish: hold it and chart her refusal _(why not: She hasn't refused; she asked a question. Explain the timing first, then let her decide.)_
  - Move it to 14:00 so she's less bothered this morning _(why not: Changing the time is a new order, and she's gaining fluid now.)_
- Why: The numbers are safe and she is gaining fluid. Giving it in the morning means she's done urinating by evening.
- Pearl: When the numbers are safe, give it on time. Explain before you accept a refusal; she may just need the reason.

### [ ] mp-peds-apap: Acetaminophen 15 mg/kg PO (160 mg/5 mL) (Leo Ferris, 20 mos)
A 20-month-old. The syringe on the counter reads 15 mL.

- **Check first:** Weight in kilograms → 10 kg. 15 mg/kg is 150 mg, which is 4.7 mL.
- Other checks: Temperature, rechecked now (38.9.); Last dose time (None today.)
- **Decision:** Discard it and draw up 4.7 mL
- Wrong:
  - Give the 15 mL; pharmacy verified it _(why not: Pharmacy can make errors too. The final check is yours, at the bedside.)_
  - Give 5 mL, the usual dose for a toddler _(why not: 5 mL is 160 mg, a little over his 150 mg, and there's no "usual" toddler dose. Always calculate by weight.)_
- Why: 15 mL is 480 mg, three times his dose. Someone wrote the mg/kg number as millilitres.
- Pearl: Kids: dose by weight in kilograms, every time. Then check that the volume makes sense for the size of the child.

### [ ] mp-heparin-xa: Heparin infusion, continue current rate (Helen Brandt, 69)
The 6-hour level just posted. She mentions her gums bled when she brushed.

- **Check first:** Anti-Xa level against the protocol goal → Anti-Xa 0.95. The goal is 0.3 to 0.7.
- Other checks: Blood pressure and heart rate now (BP 128/74.); Oxygen saturation on room air (SpO₂ 95% on room air.)
- **Decision:** Pause and lower the rate per the protocol, check for bleeding, report
- Wrong:
  - Keep the rate and recheck the level in 6 hours _(why not: Above goal with bleeding needs the protocol's pause and rate change now, not another level at the same rate.)_
  - Stop the infusion and ask for protamine _(why not: Protamine is for major bleeding. Gum bleeding with a high level is handled by the protocol.)_
- Why: Her level is above the goal and she is bleeding from her gums. The heparin protocol tells you how long to pause and how much to lower the rate.
- Pearl: Heparin drips run on the protocol. Above goal: pause and lower as written, look for bleeding, recheck on time. A bolus is only for a level under goal.

### [ ] mp-lispro-npo: Insulin lispro 8 units SubQ, with breakfast (Arturo Medina, 61)
He's going to the OR at 10:00 for a hernia repair.

- **Check first:** His diet order today → Nothing by mouth since midnight. No tray is coming.
- Other checks: His A1c from this admission (A1c 8.1%.); His morning potassium (K 4.2.)
- **Decision:** Hold the mealtime dose, check his glucose, ask about his basal dose
- Wrong:
  - Give it and ask for a dextrose infusion to cover it _(why not: That treats a problem you created. No meal, no mealtime insulin.)_
  - Give half to cover stress hyperglycemia before surgery _(why not: High glucose from stress is covered by correction insulin, if ordered, not by mealtime insulin.)_
- Why: Mealtime insulin covers a meal. With no meal, it only drops his glucose, and he will be under anesthesia where nobody can see the symptoms.
- Pearl: Mealtime insulin follows the meal. NPO? Hold it, check glucose often, and ask what to do with the long-acting dose.

### [ ] mp-dilt-push: Diltiazem 10 mg IV push (Carol Pierce, 74)
Ordered for her fast rate. She says she feels lightheaded.

- **Check first:** Blood pressure → BP 84/52.
- Other checks: Potassium (K 4.1.); Last bowel movement (This morning.)
- **Decision:** Hold it and call. She is already hypotensive
- Wrong:
  - Give it slowly over 5 minutes to soften the drop _(why not: A slower push doesn't change the fact she's already hypotensive.)_
  - Give a fluid bolus, then the diltiazem _(why not: A bolus may well be part of the plan, but that's the provider's decision. A fast rate with a low pressure needs them now.)_
- Why: Diltiazem lowers blood pressure as well as heart rate. With a systolic of 84 and dizziness, it could drop her pressure much further.
- Pearl: Calcium channel blockers and beta blockers for rate control: check the blood pressure first. Hypotension plus a fast rate needs a provider now, not a push.

### [ ] mp-oxy-er: Oxycodone ER 10 mg PO (Walter Grimes, 80)
After his stroke he can't swallow whole pills. You were about to crush it into applesauce.

- **Check first:** Whether this tablet can be crushed → Extended release. The label says do not crush.
- Other checks: His pain score at rest and moving (Pain 5.); His blood pressure (BP 142/80.)
- **Decision:** Don't crush it. Ask for a form he can take safely
- Wrong:
  - Cut it in half and give both halves in applesauce _(why not: Cutting breaks the extended-release design just like crushing does.)_
  - Give it whole in applesauce _(why not: He can't safely swallow whole pills after his stroke. That's an aspiration risk.)_
- Why: Crushing an extended-release opioid releases the whole 12-hour dose at once. That can stop his breathing.
- Pearl: ER, XR, SR, LA, CR: never crush, cut or chew unless the label says you can. Ask pharmacy for another form.

### [ ] mp-tramadol-ss: Tramadol 50 mg PO, as needed (Diane Kowalski, 52)
She takes sertraline at home. She's sweating, restless, and her legs keep jerking.

- **Check first:** Temperature, heart rate and a neuro check → T 38.6, HR 122. Twitching that keeps going when you tap her ankle (clonus).
- Other checks: Pain score and where it hurts most (Pain 6.); Her morning potassium level (K 3.9.)
- **Decision:** Hold it. Report possible serotonin syndrome
- Wrong:
  - Give it, then recheck her temperature in an hour _(why not: Tramadol adds to the serotonin load that's causing the fever and clonus.)_
  - Hold the tramadol and give acetaminophen for the fever _(why not: Holding is right, but this is a possible drug toxicity and needs the provider now, not just a fever treatment.)_
- Why: Tramadol raises serotonin, and so does sertraline. Fever, a fast pulse, sweating and clonus point to serotonin syndrome. More tramadol makes it worse.
- Pearl: Serotonin syndrome: agitation, sweating, fever, fast heart, clonus. Common culprits with SSRIs: tramadol, linezolid, triptans, ondansetron in high doses. Stop the drug and call.

### [ ] mp-haldol-qtc: Haloperidol 2 mg IV, as needed (Peter Lam, 67)
He's pulling at his oxygen. This morning's ECG is in the chart.

- **Check first:** The QTc on this morning's ECG → QTc 528 ms.
- Other checks: His blood pressure, lying in bed (BP 146/84.); His fingerstick glucose (132.)
- **Decision:** Hold it, reorient him, call about the QTc
- Wrong:
  - Give half the dose _(why not: Any dose adds to the risk at a QTc of 528.)_
  - Give it IM instead, which is gentler on the heart _(why not: IM haloperidol prolongs the QT too. The route doesn't fix a QTc over 500.)_
- Why: A QTc over 500 raises the risk of a deadly rhythm called torsades. Haloperidol, especially IV, prolongs the QT further.
- Pearl: Before QT-prolonging drugs (haloperidol, ondansetron, many antibiotics), check the QTc, potassium and magnesium. Over 500: hold and call.

### [ ] mp-mag-tox: Magnesium sulfate 2 g/hour IV, continue (Keisha Monroe, 27)
Six hours after birth. She's hard to rouse and her catheter bag has barely changed.

- **Check first:** Reflexes, breathing and urine output → No knee reflex. RR 10. 40 mL of urine in 2 hours.
- Other checks: Fundal height and firmness (Firm, at the umbilicus.); Her temperature this hour (37.0.)
- **Decision:** Stop the infusion, call now, get calcium gluconate ready
- Wrong:
  - Keep it running and give calcium gluconate _(why not: The antidote doesn't make the infusion safe. Stop the magnesium first.)_
  - Slow it to 1 g/hour and recheck her reflexes in an hour _(why not: No reflexes and a respiratory rate of 10 mean she's toxic now. Stop it.)_
- Why: Magnesium leaves through the kidneys. Low urine output lets it build up; lost reflexes and slow breathing are signs of toxicity.
- Pearl: Magnesium checks: reflexes, breathing (12 or more), urine (30 mL/hr or more), level of consciousness. Toxic? Stop it, call, calcium gluconate is the antidote.

### [ ] mp-pit-up: Oxytocin: increase by 2 milliunits/min per protocol (Sofia Ramirez, 30)
The titration is due. She says the contractions are "one on top of the other."

- **Check first:** The contraction pattern and fetal heart tracing → 6 contractions in 10 minutes. Late decelerations with the last three.
- Other checks: Her pain score and how she's coping (Pain 8.); Her temperature this hour (37.2.)
- **Decision:** Don't increase. Stop the oxytocin, turn her on her side, fluid bolus, call
- Wrong:
  - Decrease it by half and reposition her _(why not: With late decelerations, protocols stop oxytocin, not just lower it.)_
  - Hold the increase and recheck in 30 minutes _(why not: Late decelerations with tachysystole need action now, not a recheck.)_
- Why: More than 5 contractions in 10 minutes is tachysystole. With late decelerations, the baby isn't getting enough oxygen between contractions.
- Pearl: Tachysystole with a worrying tracing: stop oxytocin, lateral position, IV fluid, notify. An order to titrate never overrides the tracing.

### [ ] mp-gent-cr: Gentamicin IV, scheduled (Ray Holloway, 72)
Day 4. His urine output has been dropping.

- **Check first:** Creatinine trend and drug level → Creatinine 2.1, up from 1.0. Trough above range.
- Other checks: His temperature curve since day 1 (37.3.); His blood pressure trend (BP 132/76.)
- **Decision:** Hold it and call the provider and pharmacy
- Wrong:
  - Give it and ask pharmacy to recheck a level tomorrow _(why not: A doubled creatinine and a high trough mean it's accumulating now.)_
  - Give it with an extra liter of fluid to protect his kidneys _(why not: Fluid doesn't make a toxic level safe.)_
- Why: Gentamicin can damage the kidneys and the ear. A doubling creatinine and a high trough mean it's building up.
- Pearl: Aminoglycosides and vancomycin: watch creatinine, urine output and levels. Rising creatinine? Hold and call before the next dose.

### [ ] mp-alendronate: Alendronate 70 mg PO, weekly (June Whitaker, 77)
06:30. She's sitting up in the chair. Breakfast arrives at 07:30. She asks for it with her coffee.

- **Check first:** Whether she can stay upright and wait to eat → She can sit up for the next hour. Nothing to eat or drink yet.
- Other checks: Her most recent calcium level (9.2. Normal.); Blood pressure, sitting in the chair (BP 134/78.)
- **Decision:** Give it now with a full glass of plain water. Upright 30 minutes, then breakfast
- Wrong:
  - Give it with her coffee, since she'll stay upright _(why not: Anything but plain water blocks absorption.)_
  - Give it now, then help her back to bed to rest _(why not: Lying down within 30 minutes risks esophageal injury.)_
- Why: Alendronate absorbs poorly with anything but water, and it can burn the esophagus if she lies down.
- Pearl: Bisphosphonates: first thing in the morning, full glass of plain water, upright 30 minutes, nothing else by mouth for 30 minutes.

### [ ] mp-vanco-rate: Vancomycin 1.5 g IV, infusing (Marcus Webb, 45)
Ten minutes in, his face and neck are red and he says he's itchy. He's breathing fine.

- **Check first:** The infusion rate → It's set to run over 30 minutes.
- Other checks: His temperature right now (37.4.); His glucose (118.)
- **Decision:** Stop it, tell the provider, restart over at least 90 minutes
- Wrong:
  - Keep it running and give PRN diphenhydramine _(why not: The rate is the cause. Stop the infusion first.)_
  - Stop it and list vancomycin as an allergy _(why not: Flushing from a fast infusion is a rate reaction, not usually an allergy. Labeling it an allergy can take away an antibiotic he needs.)_
- Why: Flushing and itching from a fast vancomycin infusion is an infusion reaction, not usually a true allergy. It's about speed: run 1.5 g over 90 minutes or more.
- Pearl: Vancomycin: no faster than about 1 g an hour. Flushing above the waist? Stop, treat as ordered, restart slower. Wheeze, swelling or low BP is anaphylaxis: call a rapid response.

### [ ] mp-blood-abo: 1 unit packed red blood cells (Esther Nwosu, 63)
The unit is here. You and another nurse are at the bedside for the check.

- **Check first:** Her ID band against the unit tag, together → Name and record number match. The unit is A positive. Her type is B positive.
- Other checks: Her pre-transfusion vital signs (T 36.9, HR 98, BP 118/70.); The IV size and whether it flushes (20 gauge in her forearm.)
- **Decision:** Don't hang it. Return it to the blood bank and call them
- Wrong:
  - Call the blood bank, but hang it while you wait _(why not: Nothing mismatched goes up, ever.)_
  - Hang it slowly and stay for the first 15 minutes _(why not: Watching doesn't make a mismatched unit safe.)_
- Why: Type A cells given to a type B patient can cause a fatal hemolytic reaction within minutes. The bedside check is the last stop before that happens.
- Pearl: Blood: two licensed people check patient and unit at the bedside, every time. Any mismatch, it doesn't go up. Stay with them for the first 15 minutes.

### [ ] mp-dka-k: Regular insulin infusion, start per DKA protocol (Tyler Brooks, 22)
He arrived from the ED with fluids running. The first labs just posted.

- **Check first:** Potassium → K 3.0.
- Other checks: Glucose trend (486, down from 610 with fluids.); Anion gap (24.)
- **Decision:** Hold the insulin. Replace potassium first, then start the drip
- Wrong:
  - Start the drip; his potassium will rise as the acidosis corrects _(why not: It's the reverse: correcting acidosis and giving insulin both push potassium into cells.)_
  - Start the drip at half rate while potassium runs in _(why not: Protocols hold insulin under 3.3. Even half the rate drives potassium lower.)_
- Why: Insulin drives potassium into cells. Starting at 3.0 can push it dangerously low and stop the heart. DKA protocols hold insulin until potassium is at least 3.3.
- Pearl: DKA: fluids first, check potassium before insulin. Under 3.3, replace it before the drip. Glucose is not the emergency; potassium and acidosis are.

### [ ] mp-peds-ibu: Ibuprofen 10 mg/kg PO (Mila Torres, 2)
Gastroenteritis. She's been vomiting since last night.

- **Check first:** Her hydration and urine output → No wet diaper in 10 hours. Dry lips, no tears.
- Other checks: Her weight in kilograms for the dose (12 kg.); Her ears and throat (Normal.)
- **Decision:** Hold the ibuprofen and call about fluids
- Wrong:
  - Give it and start oral rehydration _(why not: She's too dry and still vomiting. She needs fluids before an NSAID.)_
  - Give it with a small sip of fluid to protect her stomach _(why not: The concern isn't her stomach; it's the kidneys of a dehydrated child.)_
- Why: A child who is this dry is at risk of kidney injury, and NSAIDs reduce blood flow to the kidneys. She needs fluids before anything else.
- Pearl: Kids: count the wet diapers. Dehydration plus an NSAID can hurt the kidneys. Fluids first; ask about acetaminophen for the fever.

### [ ] mp-olz-benzo: Olanzapine 10 mg IM, as needed (Andre Tillman, 39)
He's calmer than an hour ago but still yelling. A colleague grabs the olanzapine.

- **Check first:** What he's had in the last few hours → Lorazepam 2 mg IM 40 minutes ago.
- Other checks: His blood pressure and heart rate now (BP 128/78.); His oxygen saturation (SpO₂ 97%.)
- **Decision:** Hold it. Keep watching his breathing and call the prescriber
- Wrong:
  - Give it, since the lorazepam was 40 minutes ago _(why not: That's too soon after an injected benzodiazepine.)_
  - Give it and check his vitals every 15 minutes _(why not: Monitoring is for a decision that's already safe. This combination is warned against.)_
- Why: IM olanzapine soon after an injected benzodiazepine can cause dangerous low blood pressure and slowed breathing.
- Pearl: Before any PRN for agitation, read what was already given. IM olanzapine and an injected benzodiazepine are not given close together.

### [ ] mp-dystonia: Haloperidol 5 mg PO, scheduled (Jordan Ellis, 19)
He started it yesterday. Staff say he's "acting out": his neck is twisted and his eyes keep rolling up.

- **Check first:** Look closely at his neck, jaw and eyes → Neck held to one side, jaw clenched, eyes fixed upward. He says he can't stop it.
- Other checks: His blood pressure, sitting and standing (BP 124/78.); His pulse for a full minute (HR 96.)
- **Decision:** Hold it, give the PRN benztropine or diphenhydramine, call
- Wrong:
  - Give it, along with a dose of benztropine _(why not: Treat the dystonia first and tell the prescriber. Giving the same dose again may bring it right back.)_
  - Hold it and give lorazepam for the agitation _(why not: He isn't agitated; his muscles are in spasm. Benztropine or diphenhydramine treats it.)_
- Why: This is an acute dystonic reaction to haloperidol. It's frightening and painful, and it can affect the airway. An anticholinergic fixes it within minutes.
- Pearl: New antipsychotic plus a twisted neck, rolled eyes or a locked jaw: acute dystonia, not behavior. Benztropine or diphenhydramine, and tell the prescriber.

### [ ] mp-ciwa-low: Lorazepam 1 mg PO, as needed for CIWA 10 or more (Dale Hutchins, 48)
He asks for "something to take the edge off." Last drink: about 30 hours ago.

- **Check first:** His withdrawal score (CIWA) right now → CIWA 6: mild anxiety and a slight tremor.
- Other checks: His fingerstick glucose right now (102.); His liver tests from this morning's labs (Mildly up.)
- **Decision:** Hold it. Offer a quiet room and fluids, rescore in an hour
- Wrong:
  - Give it, since he's at risk for withdrawal seizures _(why not: Symptom-triggered dosing protects him by scoring often, not by dosing under the threshold.)_
  - Give half a dose to keep him ahead of it _(why not: The order doesn't cover partial doses below the threshold.)_
- Why: His score is below the line on the order. Symptom-triggered dosing works because it's given for the score, not the request. You can still help him.
- Pearl: Symptom-triggered orders: score, then dose. Under the threshold, comfort measures and a rescore. Withdrawal peaks at 24 to 72 hours, so keep scoring.

### [ ] mp-enox-epi: Enoxaparin 40 mg SubQ (Nancy Ferguson, 68)
Her epidural catheter is coming out at 10:00. It's 08:00.

- **Check first:** The timing against the epidural removal → Removal is in 2 hours. Her last dose was 20 hours ago.
- Other checks: Her platelets from this morning's labs (214,000.); Her pain score with the epidural running (Pain 3.)
- **Decision:** Hold it and check timing with anesthesia
- Wrong:
  - Give it now so it's done before the catheter comes out _(why not: That's exactly the timing that risks a spinal hematoma.)_
  - Give it and ask anesthesia to push the removal back _(why not: Anesthesia sets the timing. Ask before you give, not after.)_
- Why: Removing an epidural catheter while enoxaparin is working can cause a spinal bleed that paralyses. The catheter usually comes out 12 hours after a dose, and the next dose waits about 4 hours after removal.
- Pearl: Anticoagulants and epidurals: line up the dose times with catheter placement and removal. If you're unsure, hold and ask anesthesia.

### [ ] mp-kcl-po: Potassium chloride 20 mEq PO (Lorraine Biggs, 58)
She's eating breakfast. "These pills are huge."

- **Check first:** Her urine output and kidney function → Urinating normally. Creatinine 0.8.
- Other checks: Her temperature this morning, by mouth (36.8.); Her oxygen saturation (SpO₂ 97%.)
- **Decision:** Give it with breakfast and a full glass of water
- Wrong:
  - Give it on an empty stomach so it absorbs better _(why not: Oral potassium irritates the stomach. Give it with food.)_
  - Crush it into her oatmeal so it's easier to swallow _(why not: Many potassium tablets are extended release and can't be crushed. Ask for the liquid form.)_
- Why: Her kidneys work and her potassium is low. Taken with food and water, oral potassium is less likely to upset or injure her stomach.
- Pearl: Oral potassium: with food and a full glass of water, swallowed whole. Many tablets are extended release. If the pill is too big, ask for the liquid.

### [ ] mp-ng-check: Medications through the NG tube (Gerald Fox, 76)
The tape is loose. The mark at his nose read 55 cm yesterday.

- **Check first:** The tube's mark at the nose → It now reads 47 cm. The tube has slid out 8 cm.
- Other checks: His blood pressure before the feeding (BP 150/88.); His gastric residual (30 mL.)
- **Decision:** Don't use it. Report it and confirm placement before anything goes in
- Wrong:
  - Advance it back to 55 cm and give the meds _(why not: Advancing a tube blindly doesn't confirm where the tip is.)_
  - Test the pH of an aspirate and give the meds if it's acidic _(why not: After a tube has moved 8 cm, follow policy to reconfirm placement (usually an X-ray) before anything goes in. pH alone isn't enough here.)_
- Why: A tube that has moved may now end in the esophagus or the airway. Anything you push could go into his lungs.
- Pearl: Before every use: check the external length. If it has moved, stop and reconfirm placement per policy (X-ray is the standard). Never push a tube back in blindly.

### [ ] mp-h-digoxin-k **[NCLEX level]**: Digoxin 0.125 mg PO (Harold Banks, 78)
He also takes furosemide 40 mg daily. Morning labs just posted. He feels fine.

- **Check first:** Potassium → K 3.2.
- Other checks: Apical pulse for a full minute (Apical 72, irregular.); Yesterday's digoxin level (1.0 ng/mL, in range.)
- **Decision:** Hold it and call about the potassium first
- Wrong:
  - Give it: his pulse is over 60 and the level is in range _(why not: Both are reassuring, but a low potassium makes even an in-range digoxin level toxic to the heart. Report the K before the dose.)_
  - Give it and ask for potassium replacement afterward _(why not: Close. The order matters: the provider may want the potassium corrected before he gets more digoxin.)_
- Why: Low potassium lets digoxin bind more tightly to the heart, so toxicity can happen at a normal level. Furosemide is pulling his potassium down.
- Pearl: Digoxin: apical pulse, potassium and the level. Hypokalemia, hypomagnesemia and hypercalcemia all raise the risk of toxicity even when the level looks fine.

### [ ] mp-h-lisinopril-give **[NCLEX level]**: Lisinopril 10 mg PO (hold for SBP under 100) (Maria Santos, 64)
She feels well and wants to walk to the window.

- **Check first:** Blood pressure, against the hold parameter → BP 104/64. No dizziness sitting or standing.
- Other checks: This morning's potassium level (K 4.6.); Creatinine against her baseline (1.1, stable.)
- **Decision:** Give it
- Wrong:
  - Hold it: 104 is too close to the line _(why not: Parameters exist so you don't have to guess. She's above it, without symptoms, and the drug also protects her kidneys.)_
  - Give half the dose _(why not: Changing a dose isn't a nursing decision. Either the parameter is met or it isn't.)_
- Why: Her pressure is above the hold line, she has no symptoms of low blood pressure, and her potassium and kidney function are fine. Holding without a reason is a missed dose.
- Pearl: Hold parameters cut both ways: under the line, hold and report; over it, give. Check orthostatic symptoms if you're unsure.

### [ ] mp-h-enox-plt **[NCLEX level]**: Enoxaparin 40 mg SubQ (Owen Price, 70)
Day 2 after surgery. A colleague wonders if he should get it with his platelets down.

- **Check first:** Platelets, against his baseline → 141,000, from 168,000 before surgery.
- Other checks: Creatinine, for the dose (0.9.); Look at the incision and his skin (Dressing dry. No new bruising.)
- **Decision:** Give it
- Wrong:
  - Hold it and report possible HIT _(why not: HIT drops platelets by half or more, usually 5 to 10 days after heparin starts. A small dip on day 2 after surgery isn't that pattern.)_
  - Hold it until tomorrow's platelet count _(why not: Skipping clot prevention after hip surgery raises the risk of a DVT or PE, and nothing here calls for it.)_
- Why: A 16% drop two days after surgery is expected from blood loss and dilution. He isn't bleeding, and his kidneys clear the drug normally.
- Pearl: Think HIT when platelets fall by half or more, 5 to 10 days in (sooner if exposed in the last 100 days), or a new clot forms. Small early dips are common after surgery.

### [ ] mp-h-oxy-poss2 **[NCLEX level]**: Oxycodone 5 mg PO, every 4 hours as needed (Darius King, 47)
Pain 7 of 10. He has dozed off twice while you talked. His last dose was 4 hours ago.

- **Check first:** Sedation level and breathing → Drowsy but wakes easily to your voice and stays awake. RR 14, SpO₂ 96% on room air.
- Other checks: Blood pressure, lying and sitting (BP 138/84.); Bowel sounds and last stool (Present in all four quadrants.)
- **Decision:** Give it, and recheck his sedation and breathing in 30 to 60 minutes
- Wrong:
  - Hold it, because he keeps dozing off _(why not: Drowsy but easy to rouse is an acceptable sedation level. Untreated pain keeps him from breathing deeply and walking.)_
  - Give half the dose to be safe _(why not: He's safe for the ordered dose. A partial dose isn't ordered, and undertreating pain has its own risks.)_
- Why: Sedation that's easy to reverse with your voice, with normal breathing, is acceptable for an opioid. Sedation you can't interrupt, or drifting off mid-sentence, is when you hold.
- Pearl: Use a sedation scale (like POSS). 1 to 2 (awake or drowsy, easy to rouse): give and monitor. 3 (falls asleep mid-conversation): hold, rouse, report. 4: emergency.

### [ ] mp-h-levo-hr **[NCLEX level]**: Levothyroxine 150 mcg PO (Linda Park, 58)
06:00. She says her heart has been "racing" and she can't sleep.

- **Check first:** Apical pulse and how she looks → HR 118, regular. Fine tremor of the hands. Sweaty.
- Other checks: Her last TSH and when it was drawn (Low-normal, a month ago, before the dose went up.); Her temperature (37.2.)
- **Decision:** Hold it and report the symptoms
- Wrong:
  - Give it: last month's TSH was normal _(why not: That TSH was before the dose went up. Her symptoms now point to too much thyroid hormone.)_
  - Give it and ask for a beta blocker for the heart rate _(why not: Treating the symptom while giving more of the cause doesn't make sense. Report first.)_
- Why: A racing heart, tremor, sweating and insomnia after a dose increase are signs of too much thyroid hormone. In older adults this can trigger atrial fibrillation or angina.
- Pearl: Levothyroxine: hold and report signs of excess (tachycardia, palpitations, tremor, heat intolerance, insomnia), especially after a dose change.

### [ ] mp-h-ssri-teen **[NCLEX level]**: Sertraline 50 mg PO (Emma Walsh, 16)
She tells you quietly she's been thinking about death more since starting it.

- **Check first:** Ask her directly about suicide → "I think about not being here. I don't have a plan."
- Other checks: Her weight since admission (Down 1 kg since admission.); How she's been sleeping and eating (About 6 hours a night.)
- **Decision:** Give it, keep her safe, and report the suicidal thoughts now
- Wrong:
  - Hold it: antidepressants cause suicidal thoughts in teens _(why not: The warning is to watch closely, not to stop on your own. Stopping is the prescriber's call; her safety and the report are yours.)_
  - Give it and pass it on to the morning team _(why not: New or worse suicidal thoughts are reported now, with a safety check now.)_
- Why: Young people starting an antidepressant need close watching for new or worse suicidal thinking, especially in the first weeks. The response is a safety assessment and an urgent report, not a nurse-initiated stop.
- Pearl: Antidepressants under 25: watch for new suicidal thoughts, agitation or unusual changes, especially early or after a dose change. Ask directly, keep them safe, report now.

### [ ] mp-h-warfarin-low **[NCLEX level]**: Warfarin 5 mg PO (George Hill, 74)
He missed two doses at home before admission.

- **Check first:** Today's INR → INR 1.6.
- Other checks: Signs of bleeding (None.); Platelets (220,000.)
- **Decision:** Give it and report the low INR
- Wrong:
  - Hold it until the INR is back in range _(why not: A low INR means he needs the drug, not less of it. Holding raises his stroke risk further.)_
  - Give a double dose to catch up _(why not: Dose changes are the prescriber's, and doubling warfarin can overshoot into bleeding.)_
- Why: Below goal, his clot and stroke risk is higher. Give the ordered dose and let the prescriber adjust it or add a bridge.
- Pearl: High INR: hold and report. Low INR: give as ordered and report. Never adjust warfarin yourself.

### [ ] mp-h-iron-antacid **[NCLEX level]**: Ferrous sulfate 325 mg PO (Grace Lin, 39)
09:00. Her heartburn is bad this morning.

- **Check first:** What else is due at 09:00 → Calcium carbonate antacid, 2 tablets.
- Other checks: Hemoglobin (9.2.); Her last bowel movement (Yesterday, dark and formed.)
- **Decision:** Give the antacid now for her heartburn, and the iron 2 hours later
- Wrong:
  - Give them together with breakfast to protect her stomach _(why not: Antacids and food both cut iron absorption. Separate them.)_
  - Hold the iron today because of the heartburn _(why not: Heartburn isn't a reason to skip iron. Spacing the doses solves it.)_
- Why: Calcium and antacids bind iron in the gut. Space them at least 1 to 2 hours apart. Treat her symptom first, then give the iron later.
- Pearl: Iron: empty stomach if tolerated, with vitamin C helps; not with antacids, calcium, dairy or tea. Dark stools are expected; tarry, sticky stools with symptoms are not.

### [ ] mp-h-lithium-give **[NCLEX level]**: Lithium carbonate 300 mg PO (Sam Ortega, 29)
He says his hands are a bit shaky and he felt queasy after breakfast. He wants to stop it.

- **Check first:** Lithium level and what the tremor looks like → Level 0.8. Fine tremor holding a cup. No vomiting or diarrhea. Alert.
- Other checks: Sodium level (Na 139.); Urine output and how much he's drinking (Normal, clear.)
- **Decision:** Give it with food, and explain these effects often ease
- Wrong:
  - Hold it: tremor and nausea are signs of toxicity _(why not: A fine tremor and mild nausea at a level of 0.8 are common early side effects. Toxicity looks like a coarse tremor, vomiting, diarrhea, confusion or unsteadiness.)_
  - Hold it because he wants to stop _(why not: His concern deserves a conversation and a report to the prescriber, but holding a mood stabilizer on day 5 without that conversation isn't the answer.)_
- Why: His level is in range and his symptoms are the expected early ones. Taking it with food helps the nausea. Tell the prescriber he's thinking of stopping.
- Pearl: Lithium: fine tremor and mild nausea early are common. Coarse tremor, vomiting, diarrhea, confusion or ataxia is toxicity. Keep fluids and salt steady.

### [ ] mp-h-furosemide-give **[NCLEX level]**: Furosemide 40 mg IV (Betty Clarke, 81)
Weight up 1.2 kg. Crackles at both bases. Her pressure is lower than yesterday.

- **Check first:** Blood pressure and how she feels → BP 104/62, no dizziness. Yesterday 132/78.
- Other checks: This morning's potassium level (K 3.8.); Creatinine against yesterday's value (1.2, stable.)
- **Decision:** Give it
- Wrong:
  - Hold it: her pressure is soft _(why not: 104 without symptoms isn't a hold, and she's carrying extra fluid. The fluid is what's hurting her.)_
  - Give it orally instead to make it gentler _(why not: Changing the route is a new order, and gut swelling in heart failure makes oral absorption less reliable.)_
- Why: She's fluid overloaded with crackles and weight gain. Her pressure is lower but adequate, potassium and kidneys are fine. Diuresis is the treatment.
- Pearl: In heart failure, a modest pressure drop is common with treatment. Hold for symptomatic hypotension, low potassium or worsening kidney function, not for a number that still meets the order.

## Who's First

### [ ] wf-sepsis: Med-surg, 07:30
- Mr. Bell, 58: Post-op day 1. Pain 8 of 10, guarding. Last oxycodone 4 hours ago. _(not first: Pain matters, but it's expected after surgery and his vitals are stable. Sepsis with a low pressure comes first.)_
- Mr. Gray, 70: COPD. SpO₂ 89% on 2 L. His baseline is 88 to 92. _(not first: 89% is inside his target range. Expected and stable.)_
- Mrs. Okafor, 46: Diabetic. Glucose 342 before breakfast. No ketones. _(not first: High, but she's alert with no ketones. Correction insulin per the scale, after the unstable patient.)_
- **Mrs. Whitfield, 82: UTI. Newly confused. HR 118, BP 92/60, T 38.6.** ← first
- Why: New confusion with a fast heart rate, low pressure and fever is sepsis. The others are expected for their conditions.
- Pearl: Unexpected beats expected. Acute beats chronic. Sepsis is a clock.

### [ ] wf-pe: Ortho, 10:00
- Mrs. Adler, 72: Hip replacement day 1. Pain 8 of 10, BP 158/92. _(not first: Pain is driving her pressure up; treat it soon. A new breathing problem comes first.)_
- **Mr. Nguyen, 55: Knee replacement day 2. Sudden sharp chest pain, short of breath. HR 122.** ← first
- Ms. Patel, 40: Day 1 after a hysterectomy. Temp 38.0. Incentive spirometer at 750 mL. _(not first: A low-grade temp on day 1 is usually atelectasis. Keep her deep breathing; she's stable.)_
- Mr. Boyd, 64: Day 2 after a knee replacement. Left calf tender and warm. _(not first: A possible DVT matters, but a possible PE already causing breathlessness and a fast pulse comes first.)_
- Why: Sudden chest pain and breathlessness after joint surgery is a pulmonary embolism until proven otherwise. Breathing comes before pain.
- Pearl: Airway, breathing, circulation. A new problem with breathing jumps the line.

### [ ] wf-psych-calm: Adult psych, 09:00
- Jasmine, 27: Manic. Pacing, loud, yelling at a peer. Redirectable so far. _(not first: Escalating, but still redirectable and nobody is hurt. A hidden suicide risk is more dangerous.)_
- **Daniel, 35: Admitted for depression. Suddenly calm and smiling. Gave his watch to a peer.** ← first
- Ruth, 61: Refused her morning lithium. Says it makes her hands shake. _(not first: Address the refusal and check the tremor today; not an emergency.)_
- Marcus, 44: Hears voices calling him worthless. Says he would never act on them. _(not first: Assess the voices soon, but he's engaged and denies intent. Daniel's sudden calm is the bigger red flag.)_
- Why: Sudden calm and giving things away after deep depression can mean a decision has been made. That is a suicide warning sign.
- Pearl: Sudden peace in a depressed patient is a finding, not a recovery. Ask directly about suicide, and keep them safe.

### [ ] wf-croup: Pediatrics, 14:00
- **Mateo, 2: Croup. Stridor even at rest. Pulling in at the ribs.** ← first
- Ava, 8: Broken arm in a cast. Pain 7 of 10. Fingers pink, cap refill 2 seconds. _(not first: Pain to treat soon; circulation is fine.)_
- Noah, 6 mos: 6 months old. Temp 38.9, fussy, feeding a little less. _(not first: Fever to assess soon, but he's feeding and his airway is fine.)_
- Zoe, 15: DKA resolving. Off the drip, glucose 74, eating lunch. _(not first: Low-normal and she's eating. Recheck soon; airway first.)_
- Why: Stridor at rest with retractions means the airway is narrowing now. Children decompensate fast.
- Pearl: Stridor at rest is never "just croup." Airway first, always.

### [ ] wf-pph: Mother-baby, 11:00
- **Ms. Reyes, 31: 2 hours after birth. Fundus boggy. Soaked a pad in 15 minutes.** ← first
- Mrs. Chen, 34: Day 1. BP 142/90. No headache or vision changes. _(not first: Raised but not severe range, and no symptoms. Recheck soon; active bleeding comes first.)_
- Ms. Ward, 26: Day 2. Temp 38.1, breasts full and tender. _(not first: Engorgement can cause a low-grade temperature. Assess her, but she's stable.)_
- Baby Ito, 3 days: Day 3. Jaundice to the chest. Bilirubin near the phototherapy line. _(not first: Needs a recheck and maybe phototherapy today; not a minutes-matter emergency.)_
- Why: A boggy uterus soaking a pad in 15 minutes is a postpartum hemorrhage. She can lose a lot of blood very fast.
- Pearl: Postpartum: a soft fundus and heavy bleeding means massage the fundus and get help, now.

### [ ] wf-k: Lab results, 06:00
- **Mr. Hale, 67: K 6.8. Peaked T waves on the monitor.** ← first
- Mrs. Ruiz, 58: Sodium 127. Mild headache, alert. _(not first: Low and needs follow-up, but she's alert with mild symptoms. ECG changes with K 6.8 come first.)_
- Mr. Owens, 49: Hemoglobin 7.6, down from 8.4. No bleeding seen. _(not first: A drop to report today, possibly a transfusion. Not as immediate as a lethal rhythm.)_
- Ms. Lin, 44: Glucose 412 on steroids. Alert, no ketones. _(not first: High and needs insulin per orders, but not immediately life-threatening.)_
- Why: A potassium of 6.8 with ECG changes can cause a fatal arrhythmia within minutes.
- Pearl: A critical value with a physical sign (ECG change, symptoms) is an emergency, not a result to file.

### [ ] wf-stroke: Med-surg, 15:10
- **Mr. Feld, 74: New facial droop and slurred speech. Fine at 14:50.** ← first
- Mrs. Dunn, 80: Aphasia from an old stroke, unchanged. Temp 38.2 tonight. _(not first: Fever needs a workup soon, but her deficit is old. A new deficit inside the treatment window comes first.)_
- Mr. Obi, 69: Atrial fibrillation, rate 128, BP 124/78. Says he feels fine. _(not first: Rapid AF with a normal pressure and no symptoms: report it, but he's stable.)_
- Ms. Ross, 52: Migraine history. Headache 6 of 10, like her usual ones. _(not first: A familiar pattern and stable. Treat after the stroke alert.)_
- Why: New stroke signs with a known last-well time 20 minutes ago. Every minute counts for clot-busting and clot removal.
- Pearl: New neuro deficit: note the last known well time and call the stroke alert. Old deficits are baseline.

### [ ] wf-thyroid: Surgical, 13:00
- **Ms. Ford, 45: 4 hours after thyroidectomy. Hoarse, new noisy breathing.** ← first
- Mr. Silva, 50: Gallbladder out yesterday. Right shoulder pain 6 of 10. _(not first: Referred gas pain after laparoscopy is expected.)_
- Mrs. Bly, 66: Catheter out 6 hours ago. Hasn't voided. Bladder scan 450 mL. _(not first: Needs a straight cath soon. It can wait minutes; an airway can't.)_
- Mr. Kahn, 38: Thyroidectomy yesterday. Tingling around his lips. _(not first: Possible low calcium: check a calcium soon. But noisy breathing right now is the airway.)_
- Why: Noisy breathing after neck surgery can be a hematoma or swelling closing the airway.
- Pearl: After neck surgery: stridor, hoarseness or swelling is an airway emergency. Shoulder pain after laparoscopy is expected gas.

### [ ] wf-heparin-bleed: Telemetry, 02:00
- Mr. Cole, 60: Cirrhosis. Abdomen tighter than yesterday, breathing comfortably. _(not first: More ascites to report, but he's breathing comfortably.)_
- **Mrs. Grant, 71: Heparin drip. New headache, now confused.** ← first
- Mr. Ali, 57: On chemo. Vomited twice, nausea 7 of 10. _(not first: Give the PRN antiemetic soon; not a neuro emergency.)_
- Ms. Park, 48: Can't sleep. Heart rate 108, says she can't stop worrying. _(not first: Worth assessing, but she's talking and stable.)_
- Why: A new headache and confusion on an anticoagulant could be bleeding in the brain.
- Pearl: Anticoagulant plus a new neuro change: stop the drip, neuro checks, call now.

### [ ] wf-rp-bleed: Step-down, 18:00
- **Mr. Webb, 63: Femoral cath 3 hours ago. New back pain. HR 110, BP 98/60.** ← first
- Mrs. Lowe, 79: Pacemaker placed today. Hiccups since the procedure. _(not first: Constant hiccups can mean the lead is pacing the diaphragm: report it. She's stable; hidden bleeding is first.)_
- Mr. Diaz, 55: Ileus. NG output 900 mL since noon. _(not first: Replace the losses per orders and watch his potassium. Not as urgent as shock.)_
- Ms. Moore, 61: Glucose 238 before dinner. Correction insulin due. _(not first: Correction insulin per the scale; not urgent.)_
- Why: Back or flank pain with a rising heart rate after a femoral procedure is a retroperitoneal bleed until proven otherwise. The groin can look fine.
- Pearl: Bleeding hides. Rising heart rate and falling pressure after a procedure: think blood loss.

### [ ] wf-dts: Med-surg, 22:00
- **Mr. Tate, 52: Last drink 2 days ago. Sweating, shaking, HR 118. Says there are bugs on the wall.** ← first
- Ms. Ortiz, 33: Depression. Says she's tired of living. No plan. _(not first: Needs a suicide risk assessment today. Untreated severe withdrawal can kill within hours.)_
- Mr. Bloom, 47: Hears voices telling him to leave. Calm, in his room. _(not first: Assess the command voices soon; he's calm and safe right now.)_
- Ms. Kay, 19: Anorexia, day 3 of refeeding. Phosphorus 2.4. _(not first: Just under normal: watch closely and report. She's stable now.)_
- Why: Hallucinations, tremor and a fast pulse two days after the last drink point to severe withdrawal. Delirium tremens can kill.
- Pearl: Alcohol withdrawal peaks at 24 to 72 hours. Score it (CIWA), treat it, and watch for seizures.

### [ ] wf-neutro: Oncology, 16:00
- **Mr. Shah, 58: ANC 300. Temp just came back 38.4.** ← first
- Mrs. Kerr, 66: Mouth sores, pain 7 of 10, not drinking much. _(not first: Needs pain control and fluids, but not the one-hour clock of neutropenic fever.)_
- Ms. Bell, 49: Platelets 18,000. A few new bruises. _(not first: Bleeding precautions and report, but no active bleeding.)_
- Mr. Young, 70: Hemoglobin 7.8. Tired, vitals stable. _(not first: May need a transfusion today; stable.)_
- Why: Fever with neutropenia is an emergency. Without neutrophils, infection spreads fast; antibiotics are due within an hour.
- Pearl: Neutropenic fever: cultures and antibiotics within the hour. The conversation about hospice matters, and comes next.

### [ ] wf-ed-chest: ED triage, 13:00
- **Mr. Hayes, 54: Pressure in his chest for 30 minutes. Sweaty and pale.** ← first
- Ms. Grant, 22: Ankle injury. Can't bear weight. Foot pink and warm. _(not first: Likely a fracture, but the foot is perfused.)_
- Mrs. Lopez, 38: Burning urination and flank pain. Temp 38.4, HR 102. _(not first: Possible kidney infection: soon. Possible heart attack: now.)_
- Mr. Byrd, 30: Deep hand laceration. Bleeding controlled with pressure. _(not first: Controlled bleeding can wait for the next bed.)_
- Why: Chest pressure with sweating and pallor is a heart attack until proven otherwise. He needs an ECG within 10 minutes of arrival.
- Pearl: ED chest pain: ECG within 10 minutes. Sweating, pallor and pressure are cardiac warning signs, even if the pain is "only a 4."

### [ ] wf-ectopic: ED, 21:00
- **Ms. Kim, 26: Lower belly pain, period is 6 weeks late. Dizzy. Pain in her right shoulder.** ← first
- Mr. Shaw, 41: Migraine like his usual ones. Pain 8, vomited once. _(not first: A familiar pattern; treat soon.)_
- Ms. Fox, 33: Hives after a new antibiotic. Lips normal, breathing fine. _(not first: Watch for anaphylaxis, but no airway or circulation signs right now.)_
- Mr. Okoro, 60: Ran out of blood pressure pills a week ago. BP 188/104. No headache or chest pain. _(not first: Very high, but no signs of organ damage: urgent, not an emergency.)_
- Why: A missed period, belly pain, dizziness and shoulder-tip pain point to a ruptured ectopic pregnancy bleeding into the abdomen.
- Pearl: Any person of childbearing age with belly pain gets a pregnancy test. Shoulder-tip pain plus dizziness can mean blood under the diaphragm.

### [ ] wf-cord: Labor and delivery, 03:00
- **Ms. Diaz, 28: Waters just broke. You see a loop of cord at the opening.** ← first
- Mrs. Tran, 32: 7 cm, asking for her epidural. Fetal heart rate 140s, moderate variability. _(not first: A reassuring tracing. Her epidural can wait a few minutes.)_
- Ms. Hall, 25: GBS positive. Antibiotic dose 30 minutes late. _(not first: Give it soon; a late dose isn't a baby losing oxygen.)_
- Mrs. Abebe, 35: 1 hour after birth. Fundus firm. BP 152/96. _(not first: Recheck her pressure and symptoms soon. A cord prolapse is minutes.)_
- Why: A prolapsed cord can be squeezed shut by the baby's head, cutting off the baby's oxygen. Minutes count.
- Pearl: Cord prolapse: call for help, lift the presenting part off the cord with a gloved hand, knees-to-chest or Trendelenburg, and stay until delivery.

### [ ] wf-vent: ICU, 10:00
- **Mr. Ruiz, 58: On the ventilator. High-pressure alarm, SpO₂ 84% and falling.** ← first
- Mrs. Kane, 70: Norepinephrine bag will be empty in about 15 minutes. MAP 68 and steady. _(not first: Get the next bag ready soon. A patient desaturating on the vent is happening now.)_
- Mr. Bell, 66: Sedation pause in progress. Awake, following commands. _(not first: Expected during a pause; reassess for a breathing trial.)_
- Mrs. Wu, 81: Urine output 25 mL/hr for the last 2 hours. _(not first: Low and needs reporting, but not seconds-to-minutes.)_
- Why: A high-pressure alarm with falling oxygen means something is blocking or fighting the airway: a plug, a kink, biting, or a collapsed lung. That's seconds to minutes.
- Pearl: Vent alarm plus falling SpO₂: look at the patient, not the screen. If you can't fix it fast, take them off the vent and bag them with 100% oxygen. Remember DOPE: displacement, obstruction, pneumothorax, equipment.

### [ ] wf-nms: Adult psych, 14:00
- **Leon, 33: Started haloperidol 3 days ago. T 39.4, stiff arms, confused, sweating.** ← first
- Maya, 24: Manic. Hasn't slept in two nights, pacing. _(not first: Needs sleep and limit-setting; not a medical emergency right now.)_
- Gus, 58: Lithium level 1.4 this morning. Mild hand tremor. _(not first: Slightly high: hold and report. Not as urgent as NMS.)_
- Rina, 41: On clozapine for two months. Drooling at night. Bowel movement yesterday, eating well. _(not first: Expected clozapine side effect; stable.)_
- Why: Fever, rigid muscles and confusion after starting an antipsychotic point to neuroleptic malignant syndrome. It can kill through high fever, kidney failure and unstable vital signs.
- Pearl: NMS: fever, "lead-pipe" rigidity, confusion, unstable vitals. Stop the antipsychotic, cool, fluids, and get a medical team now. Check a CK.

### [ ] wf-peds-edema: Pediatrics, 23:00
- **Ella, 13: DKA, on her insulin drip. New headache, heart rate dropped from 110 to 58, now confused.** ← first
- Omar, 4: Ear infection. Temp 39.5, crying but consolable. _(not first: Fever to treat; consolable and stable.)_
- Lily, 10: Asthma. SpO₂ 93%, mild wheeze, talking in sentences. _(not first: Mild: nebulizer per orders. A neuro decline in DKA comes first.)_
- Baby Cole, 2 days: 2 days old. Jaundice to the belly. Feeding every 3 hours. _(not first: Needs a bilirubin check today; not first.)_
- Why: A headache, falling heart rate and new confusion during DKA treatment in a child suggest cerebral edema, the leading cause of death in pediatric DKA.
- Pearl: Kids in DKA: neuro checks hourly. Headache, slowing heart rate, rising blood pressure or confusion: call now. Treatment can't wait for a scan.

### [ ] wf-hypo: Med-surg, 11:30
- **Mr. Pratt, 64: Got insulin at 07:30, ate two bites of breakfast. Now sweaty and confused.** ← first
- Mrs. Ames, 59: Day 1 after gallbladder surgery. Pain 7, BP 150/88. _(not first: Pain to treat soon; she's alert and stable.)_
- Ms. Ray, 37: Pneumonia. SpO₂ 92% on 2 L, temp 38.3. _(not first: Expected with pneumonia on treatment.)_
- Mr. Dunn, 72: Heart failure. Up 1 kg since yesterday, mild ankle swelling, breathing easily. _(not first: Report the gain; not an emergency right now.)_
- Why: Insulin without food, then sweating and confusion: hypoglycemia. The brain runs on glucose, and he can seize if it keeps falling.
- Pearl: Sweaty and confused on insulin: check a glucose now, and treat a low before anything else. If he can't swallow, IV dextrose or glucagon.

### [ ] wf-compartment: Ortho, 02:00
- **Mr. Sato, 27: Tibia fracture in a cast. Pain 10 despite opioids, worse when you move his toes. Toes pale.** ← first
- Mrs. Fair, 74: Hip replacement day 2. Pain 7 when she turns, leg looks normal. _(not first: Expected pain with movement; treat it soon.)_
- Mr. Lowe, 55: Spine fusion. Pain 6, wants to try walking. _(not first: Stable; get help to walk him soon.)_
- Ms. Hart, 49: Knee replacement. Drain output 40 mL in 4 hours. _(not first: Expected drainage.)_
- Why: Pain out of proportion to the injury, worse on passive stretch, with pale toes, is compartment syndrome. Muscle and nerve can die within hours.
- Pearl: Compartment syndrome: pain out of proportion and pain on passive stretch come first. Pulselessness is late. Don't elevate above the heart; call the surgeon now.

### [ ] wf-burn-airway: ED, 19:00
- **Mr. Clay, 45: Singed nose hair, soot in his mouth, voice getting hoarse.** ← first
- Ms. Clay, 42: Blistered burns over 15% of her body. Pain 9. _(not first: Needs fluids and pain control soon, but a burned airway can close first.)_
- Teddy Clay, 12: Coughing after the fire. SpO₂ 97% on room air. Carbon monoxide level pending. _(not first: Give high-flow oxygen while the level comes back; he's protecting his airway.)_
- Mr. Pike, 70: Neighbor. Mild cough, no burns, SpO₂ 98%. _(not first: Stable; keep an eye on him.)_
- Why: Hoarseness and soot after a fire mean the airway is burned and swelling. It can close within hours, and intubating gets harder every minute.
- Pearl: Burns: airway first. Singed facial hair, soot, hoarseness or stridor means early intubation. Painful burns look worse, but airways kill.

### [ ] wf-dysreflexia: Rehab, 16:00
- **Mr. Owusu, 31: Spinal cord injury at T4. Pounding headache, flushed face, BP 212/112.** ← first
- Mrs. Kline, 68: Stroke rehab. Coughing during lunch, voice sounds wet. _(not first: Possible aspiration: stop the meal and assess soon. But 212/112 can cause a stroke now.)_
- Mr. Vega, 50: Amputation. Small spot of drainage on the stump dressing. _(not first: Mark and monitor.)_
- Ms. Ito, 40: Brain injury rehab. Restless this afternoon, pulling at her helmet strap, easily redirected. _(not first: Redirect her soon; she's safe.)_
- Why: A spinal cord injury at T6 or above, a pounding headache and a very high blood pressure is autonomic dysreflexia. It can cause a stroke.
- Pearl: Autonomic dysreflexia: sit them up, loosen anything tight, find the trigger (usually a full bladder or bowel), and call. The cause below the injury is the treatment.

### [ ] wf-icp: Neuro, 05:00
- **Mr. Reed, 23: Head injury yesterday. Right pupil now larger than the left and slow. Harder to wake.** ← first
- Mrs. Gold, 66: Old stroke. Left-sided weakness, unchanged. BP 168/92. _(not first: Unchanged deficits; report the pressure.)_
- Mr. Doe, 45: Seizure yesterday. Phenytoin level low this morning. _(not first: Needs a dose change today; no seizure now.)_
- Ms. Ng, 30: Migraine. Pain 8 of 10, asking for her dose early. _(not first: A familiar pattern; treat after the new neuro change.)_
- Why: A new unequal, sluggish pupil and falling level of consciousness after a head injury means pressure in the skull is rising. It can lead to herniation.
- Pearl: In neuro patients, change is what matters. A new dilated pupil or a drop in level of consciousness: call now, head of bed up 30 degrees, keep the neck straight.

### [ ] wf-tension: Surgical, 15:00
- **Mr. Banks, 52: Chest tube clamped for transport. Now struggling to breathe, trachea shifted, BP 84/50.** ← first
- Mrs. Holt, 63: Chest tube with continuous bubbling in the water seal chamber. _(not first: Look for an air leak in the system soon; she's breathing comfortably.)_
- Mr. Kerr, 40: Lobectomy yesterday. Pain 7 when he coughs, SpO₂ 93%. _(not first: Treat the pain so he can cough; stable.)_
- Ms. Diaz, 58: Chest tube. Water in the seal chamber rises and falls as she breathes. _(not first: Tidaling is normal.)_
- Why: A clamped chest tube, severe breathlessness, a shifted trachea and low blood pressure is a tension pneumothorax. Air is crushing the heart and the other lung.
- Pearl: Never leave a chest tube clamped. Sudden distress, tracheal shift and hypotension: unclamp, call a rapid response, and prepare for needle decompression.

### [ ] wf-transfusion: Oncology, 09:20
- **Mrs. Moss, 61: 15 minutes into a blood transfusion. Chills, back pain, temp 38.6.** ← first
- Mr. Lin, 55: Platelets 22,000. A few new bruises. _(not first: Bleeding precautions and report; no active bleeding.)_
- Ms. Ray, 47: Nausea 6, vomited once. Antiemetic due. _(not first: Treat soon; stable.)_
- Mr. Day, 73: Port site red and tender since this morning. Temp 37.9, feels well otherwise. _(not first: Possible line infection to report and culture. A hemolytic reaction worsens every minute.)_
- Why: Chills, fever and back pain early in a transfusion suggest a hemolytic reaction. Every extra milliliter makes it worse.
- Pearl: Transfusion reaction: stop the blood, keep the line open with saline through new tubing, check vitals, call, and send the bag back to the blood bank.

### [ ] wf-acs-sickle: Pediatrics, 12:00
- **Marcus, 15: Sickle cell crisis. New chest pain, temp 38.4, SpO₂ 90%.** ← first
- Sara, 7: Appendectomy yesterday. Temp 38.2, pain 5. _(not first: Low-grade fever after surgery: deep breathing and monitoring.)_
- Ben, 3: Croup, improving. Barky cough, no stridor at rest. _(not first: Improving; keep watching.)_
- Ava, 11: Type 1 diabetes. Glucose 285, small ketones, alert and drinking. _(not first: Needs insulin per orders and fluids; she's alert and talking.)_
- Why: Chest pain, fever and low oxygen in sickle cell disease is acute chest syndrome, a leading cause of death in sickle cell.
- Pearl: Sickle cell: new chest pain, fever, cough or low SpO₂ is acute chest syndrome until proven otherwise. Oxygen, pain control, incentive spirometry, and call.

### [ ] wf-h-surg **[NCLEX level]**: Surgical, 08:00
- **Mr. Pace, 61: Day 2 after bowel resection. Abdomen rigid, HR 118, temp 38.6.** ← first
- Mrs. Cho, 77: Day 1 after hip replacement. Pain 9 of 10, last dose 3 hours ago. _(not first: Severe pain needs treatment soon, but it's expected and her vitals are stable. A rigid abdomen with fever and tachycardia is a leak until proven otherwise.)_
- Mr. Neal, 68: COPD. SpO₂ 87% on 2 L, baseline 88 to 92. Pursed-lip breathing, comfortable. _(not first: Just under his range, comfortable. Recheck and adjust oxygen per orders; not first.)_
- Mrs. Ruiz, 72: Heart failure. Weight up 1.5 kg overnight. Lungs clear, SpO₂ 96%. _(not first: Report the gain today. With clear lungs and normal oxygen she isn't in distress.)_
- Why: A rigid abdomen, fever and tachycardia after bowel surgery suggest an anastomotic leak and peritonitis. It can turn into septic shock fast.
- Pearl: After abdominal surgery: a rigid abdomen with fever and rising heart rate is a surgical emergency. Pain, expected findings and stable chronic conditions wait.

### [ ] wf-h-psych **[NCLEX level]**: Adult psych, 13:00
- **Nina, 44: On lithium. Vomited twice since lunch, coarse tremor, mixing up words.** ← first
- Carl, 35: Paranoid, refusing his meds, shouting in his room. Not approaching anyone. _(not first: Give him space and a calm check-in soon. He's contained and not a danger to others right now.)_
- Pia, 22: Admitted 3 days ago after an overdose. Asking for a razor to shave her legs. _(not first: Safety matters: she can shave with supervision per policy. A medical emergency comes first.)_
- Ray, 51: Alcohol use disorder, day 4. CIWA 7, asking for coffee. _(not first: A low score on day 4: withdrawal is easing. Keep scoring.)_
- Why: Vomiting, a coarse tremor and new confusion on lithium are toxicity. It can progress to seizures and kidney damage.
- Pearl: On a psych unit, medical emergencies come first: toxicity, NMS, withdrawal, overdose. Safety requests and refusals follow.

### [ ] wf-h-ld **[NCLEX level]**: Labor and delivery, 22:00
- **Ms. Ward, 30: 34 weeks, placenta previa. Sudden painless bright red bleeding.** ← first
- Mrs. Ali, 27: Preterm labor on magnesium. RR 14, knee reflexes 2+, warm and flushed. _(not first: Flushing and warmth are expected with magnesium. Breathing and reflexes are fine.)_
- Ms. Pope, 33: 39 weeks, 6 cm, epidural just placed. BP 98/58. Fetal heart rate 140s. _(not first: Common after an epidural: tilt her, fluids per orders. The baby is tolerating it.)_
- Mrs. Dunn, 36: Postpartum day 1. Fundus firm 1 cm below the umbilicus. Moderate lochia rubra. _(not first: Normal findings for day 1.)_
- Why: Painless bright red bleeding with a previa can become a hemorrhage quickly for both mother and baby.
- Pearl: Placenta previa: painless bright red bleeding. Never do a vaginal exam. Abruption: painful, a rigid uterus, sometimes concealed bleeding.

### [ ] wf-h-cardiac **[NCLEX level]**: Cardiac step-down, 04:00
- **Mr. Byrne, 66: Two days after an MI. New loud murmur, short of breath, crackles to mid-lung.** ← first
- Mrs. Fry, 74: Atrial fibrillation on a diltiazem drip. Rate 112, BP 116/70. _(not first: Rate a bit high but blood pressure fine; titrate per protocol soon.)_
- Mr. Okon, 59: Heart failure. K 3.3 on furosemide. Rhythm sinus. _(not first: Replace per protocol and report soon; no rhythm change.)_
- Ms. Ito, 52: Admitted for chest pain. Now 2 of 10, same as on arrival. Troponin negative twice. _(not first: Unchanged and ruled out so far; reassess, not first.)_
- Why: A new murmur and sudden pulmonary edema days after an MI suggests papillary muscle rupture or a ventricular septal rupture. Both need surgery urgently.
- Pearl: After an MI, a new murmur with sudden heart failure is a mechanical complication. Call immediately.

### [ ] wf-h-peds **[NCLEX level]**: Pediatrics, 20:00
- **Baby Rose, 6 wks: 6 weeks old. Temp 38.3. Feeding poorly, sleepier than usual.** ← first
- Kai, 4: Asthma. SpO₂ 93%, mild wheeze 20 minutes after his nebulizer. _(not first: Mild and improving; reassess after the neb finishes working.)_
- Luca, 10: Femur fracture in traction. Pain 6. Toes pink and warm. _(not first: Treat his pain soon; circulation is good.)_
- Amara, 15: Appendectomy yesterday. Temp 38.1, eating crackers. _(not first: A low-grade temperature after surgery; encourage deep breaths and recheck.)_
- Why: Any fever in an infant under about 2 to 3 months, with poor feeding or sleepiness, can be sepsis or meningitis. Infants show few other signs.
- Pearl: Young infants with fever get a full workup fast. Lethargy and poor feeding are danger signs at any age.

### [ ] wf-h-neuro **[NCLEX level]**: Neuro, 15:00
- **Mr. Shaw, 42: Guillain-Barré. Vital capacity down from 2.2 L to 1.4 L since this morning.** ← first
- Ms. Rios, 38: Myasthenia gravis. Drooping eyelids, worse at the end of the day. _(not first: Fatigue worse late in the day is typical. Watch her breathing and swallowing, but this is her pattern.)_
- Mr. Gray, 76: Parkinson's. Freezing when he walks; fell yesterday without injury. _(not first: Fall precautions and PT soon; stable now.)_
- Mrs. Lee, 34: Multiple sclerosis. Blurry vision in one eye since yesterday. _(not first: Possibly a relapse to report today. Not an airway threat.)_
- Why: A falling vital capacity in Guillain-Barré means the breathing muscles are weakening. Many need intubation before oxygen levels fall.
- Pearl: Guillain-Barré and myasthenic crisis: follow vital capacity and negative inspiratory force, not just SpO₂. A falling trend means call now.

### [ ] wf-h-endo **[NCLEX level]**: Med-surg, 18:00
- **Ms. Grant, 46: Thyroidectomy this morning. Muscle cramps. Her cheek twitches when you tap it.** ← first
- Mr. Vos, 63: SIADH. Sodium 131, alert, on a fluid restriction. _(not first: Mildly low and improving on treatment. Keep the restriction.)_
- Mrs. Kahn, 55: On high-dose steroids. Glucose 260 before dinner. _(not first: Expected with steroids. Correction insulin per orders.)_
- Mr. Bose, 48: Addison's disease. Evening hydrocortisone due. BP 116/72, feels fine. _(not first: Give it on time; he's stable now.)_
- Why: Muscle cramps and a positive Chvostek sign after thyroid surgery suggest low calcium from parathyroid injury. It can progress to laryngospasm and seizures.
- Pearl: After thyroid or parathyroid surgery: tingling, cramps, Chvostek or Trousseau sign mean check calcium and have IV calcium ready.

### [ ] wf-h-renal **[NCLEX level]**: Renal, 06:00
- **Mr. Akins, 58: On dialysis, missed yesterday's session. Weak. K 6.4, HR 52.** ← first
- Mrs. Reed, 49: Peritoneal dialysis. Cloudy drainage this morning, temp 37.6. _(not first: Possible peritonitis: cultures and antibiotics today. Hyperkalemia with a slowing heart can stop it now.)_
- Mr. Tan, 66: Kidney biopsy yesterday. Mild flank pain, urine light pink. _(not first: A little blood is expected after a biopsy. Watch the vitals and the color.)_
- Ms. Ford, 71: Acute kidney injury on IV fluids. Urine output 40 mL/hr, up from 20. _(not first: Improving. Keep going.)_
- Why: A potassium of 6.4 with a slow heart rate means the potassium is affecting the heart. It can cause a fatal rhythm.
- Pearl: Dialysis patients who miss treatment: think potassium and fluid. Hyperkalemia with bradycardia or ECG changes is an emergency.

### [ ] wf-h-geri **[NCLEX level]**: Geriatrics, 11:00
- **Mrs. Hale, 84: On warfarin. Fell an hour ago, hit her head. Now asking the same question over and over.** ← first
- Mr. Brook, 88: Dementia. Trying to leave the unit to "go to work." _(not first: A safety risk: redirect him soon. He's calm and walking.)_
- Mrs. Toll, 79: Hip fracture, waiting for surgery. Pain 7, last dose 2 hours ago. _(not first: Pain to treat soon; expected and stable.)_
- Mr. Webb, 90: Stage 2 pressure injury on his sacrum. Dressing soiled. _(not first: Change it soon; not urgent.)_
- Why: A head strike on an anticoagulant, with new repetitive questioning, can be a bleed in the skull. Older adults can bleed slowly and look fine at first.
- Pearl: Anticoagulant plus a fall with head strike: neuro checks and a CT, even if they look okay. New confusion is a red flag.

### [ ] wf-h-resp **[NCLEX level]**: Pulmonary, 09:00
- **Mrs. Vance, 67: Pneumonia. RR 30, SpO₂ 91% on 4 L, using her neck muscles. Says she's tired.** ← first
- Mr. Oyelaran, 70: COPD. SpO₂ 88% on 2 L, his baseline. Thick yellow sputum. _(not first: At his baseline. Sputum culture and treatment per orders.)_
- Ms. Hart, 24: Asthma. Peak flow 70% of her best after a nebulizer. _(not first: Moderate and responding. Reassess.)_
- Mr. Lane, 58: Pleural effusion. Chest tube drained 300 mL of yellow fluid since morning. _(not first: Expected after placement; monitor the amount.)_
- Why: Fast breathing, accessory muscle use and fatigue mean she's tiring. Respiratory failure can follow even while her saturation looks acceptable.
- Pearl: Work of breathing and fatigue predict respiratory failure before SpO₂ falls. "I'm tired" from a patient breathing 30 times a minute is an emergency.

## SBAR

### [ ] sb-hf: Samuel Ortiz, calling Dr. Chen, hospitalist
Heart failure, EF 30%. He can't lie flat. RR 26. SpO₂ 90% on 2 L. Crackles halfway up. Weight up 2 kg.

- **S:** Dr. Chen, this is the nurse for 418, Samuel Ortiz. He's more short of breath: SpO₂ 90% on 2 liters.
  - Wrong:
    - Dr. Chen, this is the nurse for 418, Samuel Ortiz. His vitals are RR 26, HR 104, BP 148/90, temp 37.1. _(why not: Numbers with no headline. Say what changed first: he's more short of breath, SpO₂ 90% on 2 L.)_
    - Dr. Chen, this is the nurse for 418, Samuel Ortiz. He has heart failure and I'm a little worried about him. _(why not: Sounds polite, but it gives her nothing to act on. Lead with the change and the number.)_
- **B:** Admitted yesterday for heart failure, EF 30%. One dose of IV furosemide yesterday. Weight up 2 kg.
  - Wrong:
    - 71, here for heart failure. History of hypertension, diabetes, CKD stage 3, gout and atrial fibrillation. _(why not: A history list buries what matters tonight: the EF, the one dose of furosemide, and the 2 kg gain.)_
    - Admitted yesterday for heart failure. His home meds include furosemide 40 mg by mouth daily. _(why not: Close, but it leaves out the EF and the 2 kg weight gain, the facts that frame the call.)_
- **A:** Crackles halfway up, RR 26, can't lie flat. I think he's fluid overloaded and getting worse.
  - Wrong:
    - Crackles and a fever would fit pneumonia. I think he may be developing an infection. _(why not: He has no fever. Crackles halfway up, orthopnea and a 2 kg gain with an EF of 30% point to fluid.)_
    - He's breathing fast and seems anxious. I think the anxiety is making his breathing worse. He settles when I sit with him. _(why not: Anxiety can follow air hunger, but the crackles and weight gain say fluid. Name the likely cause.)_
- **R:** I'd like another dose of IV furosemide, a chest X-ray, and for you to see him.
  - Wrong:
    - Could you put in some orders for his breathing? _(why not: Too vague. Ask for what you think he needs: a diuretic, an X-ray, and a look.)_
    - He's frightened and working hard. Can I give him the PRN morphine for his air hunger and see if he settles? _(why not: Morphine may ease the feeling but doesn't treat the fluid. Ask for the diuretic and an evaluation.)_
- **✓:** Read back: furosemide 80 mg IV now, portable chest X-ray, you're on your way. Correct?
  - Provider: "Furosemide 80 milligrams IV now, portable chest X-ray, and I'm coming up."
  - Wrong:
    - Read back: furosemide 40 mg IV now, portable chest X-ray, you're on your way. _(why not: She said 80 mg. The read-back is how wrong numbers get caught.)_
    - Okay, furosemide and an X-ray. I'll get those going. _(why not: No numbers repeated, so a wrong dose or route can't be caught.)_
- Pearl: Situation in one sentence, the background that matters, your assessment, a clear ask, and a read-back.

### [ ] sb-sepsis: Eleanor Whitfield, calling Dr. Patel, hospitalist
UTI, admitted yesterday. Now she doesn't know where she is. T 38.7, HR 116, BP 88/52, RR 24.

- **S:** This is the nurse for Eleanor Whitfield in 416. I'm worried she's septic: new confusion, BP 88/52, HR 116, temp 38.7.
  - Wrong:
    - This is the nurse for Eleanor Whitfield in 416. She's newly confused this morning and her temp is up to 38.7. Can you take a look? _(why not: Missing the low pressure and fast pulse that make this urgent, and the word sepsis.)_
    - This is the nurse for 416. Her vitals are off this morning: BP 88/52, HR 116, RR 24, temp 38.7, SpO₂ 95% on room air. _(why not: The numbers are there but not your worry. Say "I think she's septic" and the new confusion.)_
- **B:** UTI, admitted yesterday. First dose of ceftriaxone was due at 08:00 but is still waiting on pharmacy.
  - Wrong:
    - 82, admitted yesterday for a UTI. History of hypertension and osteoarthritis. She lives alone with her cat. _(why not: Leaves out the delayed antibiotic, the fact that changes the plan.)_
    - UTI, admitted yesterday. She was a little confused on admission, so this may be her baseline. _(why not: She was oriented at 07:00. Calling it baseline delays sepsis care.)_
- **A:** She was oriented at 07:00. With the fever, low pressure and fast pulse, I think this is sepsis.
  - Wrong:
    - Her mouth is dry and her urine is dark. I think she's dehydrated from not drinking since yesterday. _(why not: Dehydration doesn't explain a fever with a known infection. Name sepsis.)_
    - She's pulling at her lines and calling for her cat. I think she's delirious, maybe from the new environment. _(why not: She is delirious, but from a cause: infection with low pressure. The cause is the assessment.)_
- **R:** I'd like blood cultures, a lactate, a fluid bolus, the antibiotic now, and you at the bedside.
  - Wrong:
    - Can I give acetaminophen for the fever, push oral fluids, and recheck her vitals in an hour? _(why not: Treats the number, not the sepsis. An hour's delay matters.)_
    - Could you see her when you're next on the unit? I'll keep a close eye on her vitals until then. _(why not: No time frame and no bundle. Ask for cultures, lactate, fluid, antibiotic, and a bedside look now.)_
- **✓:** Read back: two blood cultures, lactate, 30 mL/kg lactated Ringer's, then ceftriaxone. See you in five.
  - Provider: "Two sets of cultures, lactate, 30 mL per kilo of lactated Ringer's, then the ceftriaxone. I'll be there in five."
  - Wrong:
    - Read back: two blood cultures, lactate, 30 mL/kg normal saline, then ceftriaxone. See you in five. _(why not: She ordered lactated Ringer's, not normal saline.)_
    - Okay, cultures, lactate, fluid and the antibiotic. I'll get all of that started right away and see you in five. _(why not: No numbers repeated. The read-back exists to catch a wrong volume or drug.)_
- Pearl: Lead with your worry. "I think she's septic" gets action faster than a list of numbers.

### [ ] sb-bleed: Margaret Doyle, calling Dr. Abara, orthopedics
Hip replacement yesterday. Hemoglobin 7.1, down from 10.2. HR 112. BP 94/60. Dressing soaked through.

- **S:** This is the nurse for Margaret Doyle, hip replacement yesterday. Her hemoglobin dropped from 10.2 to 7.1 and she's tachycardic at 112.
  - Wrong:
    - This is the nurse for Margaret Doyle, hip replacement yesterday. Her hemoglobin this morning came back at 7.1 and I wanted you to know. _(why not: Give the trend and the heart rate. 7.1 alone may not sound urgent; 10.2 to 7.1 with HR 112 does.)_
    - This is the nurse for Margaret Doyle, hip replacement yesterday. She's pale and a bit dizzy this morning when she sits up. _(why not: No numbers and no worry stated.)_
- **B:** Right total hip yesterday. On enoxaparin for clot prevention. The dressing is soaked through.
  - Wrong:
    - Right total hip yesterday. History of osteoporosis and hypothyroidism. She takes levothyroxine at home. _(why not: Leaves out the enoxaparin and the soaked dressing.)_
    - Right total hip yesterday. Estimated blood loss in the OR was 400 mL and she got 2 liters of fluid. _(why not: Useful, but the anticoagulant and the soaked dressing matter more right now.)_
- **A:** BP 94/60, she's pale and dizzy sitting up. I think she's bleeding.
  - Wrong:
    - Her urine output is fine. I think it's dilution from the IV fluids she got overnight. _(why not: Fluids can lower hemoglobin a little, not 3 points with a fast pulse and a soaked dressing.)_
    - BP 94/60. I think she's dehydrated and needs fluids. _(why not: Low pressure and a fast pulse, yes, but the falling hemoglobin says blood loss.)_
- **R:** I'd like a type and crossmatch, to hold the enoxaparin, and for you to look at the wound.
  - Wrong:
    - Her pressure is soft. Can I give her a 500 mL fluid bolus and recheck her pressure when it's in? _(why not: May be part of the plan, but ask for blood, holding the enoxaparin, and a look at the wound.)_
    - Can I recheck the hemoglobin at noon and call you if it's dropped again? _(why not: Too slow for an active bleed.)_
- **✓:** Read back: hold enoxaparin, type and cross, transfuse one unit, recheck after. You're coming after your case.
  - Provider: "Hold the enoxaparin. Type and cross, transfuse one unit, recheck after. I'll be up after this case."
  - Wrong:
    - Read back: hold enoxaparin, type and cross, transfuse two units, recheck after. You're coming after your case. _(why not: He said one unit.)_
    - Okay, hold the enoxaparin and get blood going. I'll let you know how she does. Thanks. _(why not: No details repeated, so the unit count and recheck can't be confirmed.)_
- Pearl: Give the trend, not just the number: "10.2 to 7.1" says more than "7.1".

### [ ] sb-pca: Kevin Ramos, calling Rapid response nurse, then the surgeon
Day 1 after bowel surgery on a morphine PCA. You can't wake him. RR 7, SpO₂ 84%. You stopped the PCA and gave naloxone per protocol. He's waking.

- **S:** This is the nurse for Kevin Ramos. He had opioid oversedation on his PCA: RR 7 and SpO₂ 84%. I stopped it and gave naloxone; he's rousing.
  - Wrong:
    - This is the nurse for Kevin Ramos. He had a low respiratory rate on his PCA a few minutes ago, but he's awake and okay now. _(why not: Undersells it. Say oversedation, the numbers, and what you did.)_
    - This is the nurse for Kevin Ramos, bowel resection yesterday. I gave naloxone a few minutes ago and he's awake and talking to me now, so the worst is over. _(why not: Missing what happened and the numbers that made you act.)_
- **B:** Bowel resection yesterday. Morphine PCA with a basal rate. History of sleep apnea, no CPAP here.
  - Wrong:
    - Bowel resection yesterday. Morphine PCA for pain, which was a 6 out of 10 overnight. _(why not: Leaves out the basal rate and the sleep apnea, the two risk factors.)_
    - Bowel resection yesterday. 44, on a morphine PCA, no significant medical history. _(why not: Not true: sleep apnea is the key history.)_
- **A:** Now RR 12, SpO₂ 93% on 2 L, sedation improving. The naloxone may wear off before the morphine does.
  - Wrong:
    - RR 12, SpO₂ 93% on 2 L. He's awake and talking now, so I think he's out of danger. _(why not: Naloxone wears off before morphine does. He can go back under.)_
    - He says he only pressed the button twice all night. I think the PCA pump may have malfunctioned, and I've tagged it. _(why not: The basal rate and his sleep apnea explain it.)_
- **R:** I'd like the basal rate stopped, continuous pulse oximetry, and a new pain plan. Can you see him?
  - Wrong:
    - His pain is back up to a 7. Should I restart the PCA with a lower basal rate? _(why not: Restarting the drug that caused this without new monitoring is the risk. Ask for the basal off and continuous monitoring.)_
    - Can we stop the PCA altogether and switch him to oral oxycodone instead? _(why not: A new pain plan comes, but first: stop the basal and monitor continuously.)_
- **✓:** Read back: basal off, continuous oximetry and capnography, repeat naloxone for RR under 10. You're coming in 20.
  - Provider: "Stop the basal. Continuous oximetry and capnography. Repeat naloxone if RR under 10. I'll see him in 20 minutes."
  - Wrong:
    - Read back: basal off, continuous oximetry, repeat naloxone for RR under 8. You're coming to see him in 20 minutes. Correct? _(why not: He said under 10, and capnography too.)_
    - Okay, I'll stop the basal and keep a close eye on him until you get here in 20. _(why not: Not a read-back: the monitoring and the naloxone threshold aren't repeated.)_
- Pearl: Act first, then call: stop the opioid and give naloxone by protocol. Then say what you did and what you need.

### [ ] sb-lithium: Rosa Benitez, calling Dr. Lund, psychiatrist on call
Bipolar disorder on lithium. Vomiting since lunch. Coarse tremor. Slow to answer. Stat level: 2.1.

- **S:** This is the nurse for Rosa Benitez on 3 East. I'm worried about lithium toxicity: level 2.1, vomiting, coarse tremor and new slowing.
  - Wrong:
    - This is the nurse for Rosa Benitez on 3 East. She's been vomiting since lunch and can't keep anything down. _(why not: Lead with the danger: possible lithium toxicity and the level.)_
    - This is the nurse for Rosa Benitez on 3 East. Her stat lithium level just came back at 2.1. _(why not: Add the symptoms; the number with the coarse tremor and slowing is the story.)_
- **B:** Lithium 600 mg twice a day. Started ibuprofen for a toothache three days ago. Last level was 0.9.
  - Wrong:
    - Bipolar I, on lithium 600 mg twice a day and quetiapine 200 mg at night. No drug allergies that I know of. _(why not: Missing the new ibuprofen and the last level.)_
    - She's been stable on lithium for years and her levels are usually fine. _(why not: Past stability is why the new ibuprofen and the vomiting matter now. Say them.)_
- **A:** I think this is lithium toxicity, made worse by the ibuprofen and the vomiting. She needs a medical evaluation.
  - Wrong:
    - Two other patients on the unit were sick this week. I think she has a stomach virus. _(why not: Vomiting with a coarse tremor and slowing at 2.1 is toxicity.)_
    - Her mouth is dry and she's dizzy standing. I think she's dehydrated from the vomiting. _(why not: True but incomplete. Dehydration is driving lithium toxicity; name the toxicity.)_
- **R:** I'd like to hold lithium and ibuprofen, get a chemistry panel, and transfer her to the ED for evaluation.
  - Wrong:
    - Should I give ondansetron for the vomiting, push fluids by mouth, and recheck the lithium level in the morning? _(why not: Treating the nausea masks the toxicity.)_
    - Can we lower her lithium dose tonight and recheck a level in a few days? _(why not: She needs it held and a medical evaluation, not a smaller dose.)_
- **✓:** Read back: hold lithium and ibuprofen, basic panel now, transfer to the ED, you'll call them.
  - Provider: "Hold the lithium and the ibuprofen. Basic panel now. Send her to the ED, I'll call them."
  - Wrong:
    - Read back: hold lithium, basic panel now, transfer to the ED, you'll call them. _(why not: Missed holding the ibuprofen.)_
    - Okay, I'll hold her meds, get the labs and get her ready to go to the ED. _(why not: Which meds? Repeat them.)_
- Pearl: Name the danger in the first sentence. NSAIDs, dehydration and some blood pressure pills push lithium levels up.

### [ ] sb-hyperk: Arthur Hale, calling Dr. Okoye, hospitalist
Kidney disease, on lisinopril and spironolactone. Morning K 6.6. Peaked T waves. Feels weak.

- **S:** This is the nurse for Arthur Hale in 410. His potassium is 6.6 and he has peaked T waves on the monitor.
  - Wrong:
    - This is the nurse for Arthur Hale in 410. His potassium just came back from the lab at 6.6. _(why not: Add the peaked T waves. That's what makes it an emergency.)_
    - This is the nurse for Arthur Hale in 410. He feels weak this morning and his potassium is high. Can you take a look at his labs? _(why not: Give the number and the ECG change.)_
- **B:** Chronic kidney disease, creatinine 2.8. On lisinopril and spironolactone. Yesterday's K was 5.4.
  - Wrong:
    - Chronic kidney disease, hypertension and gout. He isn't on dialysis and he's making urine. _(why not: Missing the lisinopril and spironolactone, which raise potassium.)_
    - His potassium was 5.4 yesterday and 6.6 today, so it's climbing fast. _(why not: A good trend, but add the meds and the kidney function.)_
- **A:** BP 130/80, HR 64. I think this is dangerous hyperkalemia and could cause an arrhythmia.
  - Wrong:
    - He has no chest pain and says he feels okay. It may be a hemolyzed sample. Can we redraw it? _(why not: Possible, but peaked T waves on the monitor make it real until proven otherwise.)_
    - BP 130/80, HR 64. He's stable for now; his blood pressure and heart rate are fine. _(why not: A normal pressure doesn't protect his heart from a potassium of 6.6.)_
- **R:** I'd like orders for calcium gluconate, insulin with dextrose, a 12-lead, and a repeat K. And hold his spironolactone.
  - Wrong:
    - Can you order a repeat potassium, and I'll call you back as soon as it results? _(why not: A repeat alone leaves his heart unprotected.)_
    - Should I give him a dose of IV furosemide and recheck the potassium this afternoon? _(why not: It may help later, but calcium protects the heart now.)_
- **✓:** Read back: calcium gluconate 1 g IV, regular insulin 10 units IV with 25 g dextrose, 12-lead, repeat K in 2 hours, hold spironolactone and lisinopril.
  - Provider: "Calcium gluconate 1 gram IV, regular insulin 10 units IV with 25 grams of dextrose, 12-lead, repeat K in 2 hours, hold spironolactone and lisinopril."
  - Wrong:
    - Read back: calcium gluconate 1 g IV, regular insulin 10 units IV, 12-lead on the monitor, repeat potassium in 2 hours. I'll call you as soon as it results. _(why not: Missed the dextrose, which prevents a low after IV insulin, and the meds to hold.)_
    - Okay, calcium, insulin with dextrose, a 12-lead, a repeat potassium, and I'll hold his spironolactone and lisinopril. _(why not: No doses repeated.)_
- Pearl: Critical value + a body sign = say both in the first sentence. Calcium protects the heart; insulin moves potassium into cells.

### [ ] sb-stroke: Leon Feld, calling Stroke team, via the stroke alert
Admitted for pneumonia. At 15:05 his right arm is weak and his speech is slurred. Last known well: 14:50, talking normally.

- **S:** Stroke alert, 4 West room 420. Leon Feld, 74: right arm weakness and slurred speech. Last known well 14:50.
  - Wrong:
    - Room 420, Leon Feld, 74: new right arm weakness and slurred speech. Can someone come see him? _(why not: Say "stroke alert" and the last known well time.)_
    - Stroke alert, 4 West room 420. Leon Feld, 74: right arm weakness and slurred speech. Symptoms started at 15:05. _(why not: 15:05 is when you found him. Last known well is 14:50, and that's the time that matters.)_
- **B:** Here for pneumonia. History of atrial fibrillation, on no anticoagulant. Glucose 112.
  - Wrong:
    - Here for pneumonia, day 2 of antibiotics. History of atrial fibrillation, hypertension and diabetes. _(why not: Missing whether he's anticoagulated and his glucose.)_
    - Here for pneumonia. On apixaban for atrial fibrillation. Glucose 112. _(why not: Not true here: he's on no anticoagulant. Getting this wrong changes the treatment.)_
- **A:** New right-sided weakness and aphasia. I think he's having an acute stroke.
  - Wrong:
    - He started a new antibiotic today. This could be a reaction to his antibiotic. _(why not: Focal weakness with aphasia is a stroke until proven otherwise.)_
    - He didn't eat much lunch today. It could be low blood sugar. _(why not: Reasonable to check, and you did: 112.)_
- **R:** He's NPO and I have an IV. I'd like the team at the bedside and a head CT now.
  - Wrong:
    - Should I give his 15:00 meds before he goes down to CT? _(why not: NPO until a swallow screen.)_
    - He may just be tired. Can we recheck him in 30 minutes and see if it clears up on its own? _(why not: Every minute counts in a stroke.)_
- **✓:** Read back: NPO, neuro checks every 15 minutes, CT ready now. I'll have him on the monitor.
  - Provider: "We're on our way. Keep him NPO, neuro checks every 15 minutes, CT is clearing the scanner."
  - Wrong:
    - Read back: NPO, neuro checks every hour, CT now. I'll have him on the monitor and ready to go. _(why not: She said every 15 minutes.)_
    - Okay, CT and neuro checks. I'll get him ready to go. _(why not: No frequency repeated.)_
- Pearl: For stroke: the last known well time is the most important number you have. Say it first.

### [ ] sb-asthma: Jayden Brooks, calling Dr. Ames, pediatric resident
Asthma, 6 years old. He was wheezing; now you hear almost nothing. Sitting forward. SpO₂ 89%. Can't finish a sentence.

- **S:** This is the nurse for Jayden Brooks in 512. He has a silent chest: SpO₂ 89%, sitting forward, can't finish sentences. I need you now.
  - Wrong:
    - This is the nurse for Jayden Brooks in 512. Good news: his wheezing is much quieter now than an hour ago. _(why not: A quiet chest with worse work of breathing is a danger sign, not improvement.)_
    - This is the nurse for Jayden Brooks in 512. His SpO₂ is 89% on his asthma treatment and he's sitting forward. _(why not: Add "silent chest" and "can't finish sentences.")_
- **B:** Admitted for asthma today. Albuterol at 18:30, steroid given at 16:00. Two ICU stays for asthma before.
  - Wrong:
    - 6 years old, admitted today for an asthma flare after a cold. Mom is at the bedside. _(why not: Missing the last albuterol, the steroid, and the ICU history.)_
    - He had albuterol at 18:30 and it seemed to help for a little while. _(why not: Add the steroid and his two ICU stays: they tell the resident how fast he can crash.)_
- **A:** Quiet chest with worse work of breathing. He's moving very little air. I think he's about to tire out.
  - Wrong:
    - The wheezing is gone and his chest is quiet, so I think the albuterol is working. _(why not: Wheezing disappears when air stops moving.)_
    - He looks scared and won't talk to me. I think he's anxious, which is making him breathe faster and tire himself out. _(why not: Anxiety doesn't cause a silent chest.)_
- **R:** I've started albuterol back-to-back. I'd like you at the bedside, and I'm calling the rapid response team.
  - Wrong:
    - Can I give another albuterol now and recheck him in an hour to see if it's helping? _(why not: Too slow. He needs continuous treatment and help now.)_
    - He's working himself up. Can I give him something to help him calm down and rest? _(why not: Sedating a tiring asthmatic can stop his breathing.)_
- **✓:** Read back: continuous albuterol, ipratropium, IV magnesium, rapid response called. See you now.
  - Provider: "Continuous albuterol, ipratropium, IV magnesium, and get rapid response. I'm coming."
  - Wrong:
    - Read back: albuterol every hour, ipratropium, IV magnesium, rapid response called. See you in a minute. _(why not: She said continuous albuterol, not every hour.)_
    - Okay, albuterol and magnesium. I'll get those going right away. _(why not: Incomplete: no ipratropium, no rapid response, and "okay" isn't a read-back.)_
- Pearl: A quiet chest in a struggling asthmatic is not improvement. It means almost no air is moving.

### [ ] sb-transfusion: Doris Moss, calling Dr. Iyer, oncology
15 minutes into a unit of red cells: chills, back pain, T 38.6, HR 118, BP 96/58. You stopped the blood and hung saline through new tubing.

- **S:** This is the nurse for Doris Moss. I think she's having a transfusion reaction: chills, back pain, fever 38.6, BP 96/58. I've stopped the blood.
  - Wrong:
    - This is the nurse for Doris Moss. She has a fever of 38.6 about fifteen minutes into her transfusion, so I've slowed the rate down. _(why not: Missing the back pain and low pressure, and that you've stopped the blood.)_
    - This is the nurse for Doris Moss, who's getting blood today. She has chills and back pain and says she feels awful all of a sudden. _(why not: Add the numbers and that the blood is off.)_
- **B:** Leukemia, hemoglobin 6.9 this morning. This is her first unit today. Bedside check was done with two nurses.
  - Wrong:
    - Leukemia. She's had many transfusions before without problems, and she was premedicated with acetaminophen today. _(why not: Previous transfusions don't protect against this one; give the unit and the bedside check.)_
    - Leukemia, on chemotherapy, port in place. Her counts have been low all week. _(why not: Missing the hemoglobin, which unit this is, and that the bedside check was done.)_
- **A:** Fever, back pain and a falling pressure this early make me worried about a hemolytic reaction.
  - Wrong:
    - She's had fevers with blood before. I think it's a febrile non-hemolytic reaction and she'll settle with acetaminophen. _(why not: Possible, but back pain and a falling pressure this early point to hemolysis. Assume the worst until ruled out.)_
    - She has a port and her counts are low. She might have a line infection. _(why not: Timing with the transfusion makes the blood the cause until proven otherwise.)_
- **R:** I'd like you to see her now. I'll send the bag and tubing to the blood bank with blood and urine samples. Do you want a fluid bolus?
  - Wrong:
    - Her fever is coming down a little. Can I restart the transfusion at a slower rate and stay with her for the first 15 minutes? _(why not: The blood stays off until a reaction is ruled out.)_
    - Should I give acetaminophen and diphenhydramine, watch her for half an hour, and call you back if she isn't better? _(why not: Treats the fever, not the reaction. Send the workup and get her evaluated.)_
- **✓:** Read back: blood stays off, normal saline 500 mL bolus, transfusion reaction workup sent. You're on your way.
  - Provider: "Keep the blood off. Normal saline 500 mL bolus. Send the transfusion reaction workup. I'm coming up."
  - Wrong:
    - Read back: blood stays off, normal saline 250 mL bolus, transfusion reaction workup sent. You're on your way. _(why not: He said 500 mL.)_
    - Okay, saline and the workup. I'll get those going and see you when you get here. _(why not: No volume repeated.)_
- Pearl: Act, then call: stop the transfusion, keep the vein open with saline through new tubing, then SBAR. Send the bag back; it's evidence.

### [ ] sb-nms: Leon Carter, calling Dr. Abrams, psychiatrist on call
Started haloperidol three days ago. T 39.4, HR 124, BP 168/98. Arms stiff as pipes. Confused and sweating.

- **S:** This is the nurse for Leon Carter on 3 East. I'm worried about neuroleptic malignant syndrome: T 39.4, rigid, confused, BP 168/98.
  - Wrong:
    - This is the nurse for Leon Carter on 3 East. He has a fever of 39.4 this afternoon and I'd like an order for acetaminophen. _(why not: Add rigidity, confusion and the new antipsychotic: name NMS.)_
    - This is the nurse for Leon Carter on 3 East. He's stiff and confused today, more than yesterday, and he isn't making much sense. _(why not: Missing the vital signs.)_
- **B:** First-episode psychosis. Haloperidol started three days ago and increased yesterday. He's barely drinking.
  - Wrong:
    - First-episode psychosis, admitted three days ago on a hold. No medical history and no drug allergies that we know of. _(why not: Missing the haloperidol start and dose increase.)_
    - First-episode psychosis. On haloperidol and lorazepam as needed. He's been cooperative with his medications. _(why not: Say when the haloperidol started and that it went up yesterday.)_
- **A:** Fever, rigidity and confusion after a new antipsychotic. I think this is NMS and he needs medical care.
  - Wrong:
    - He's mute and holding odd postures for long stretches. This could be catatonia from his psychosis getting worse. _(why not: Catatonia can look similar, but fever and unstable vitals after a new antipsychotic are NMS until proven otherwise.)_
    - With a fever that high he may have an infection, maybe a pneumonia or a urinary infection. _(why not: Possible, but rigidity with fever after haloperidol is a medical emergency in its own right.)_
- **R:** I'd like to hold the haloperidol, get a CK and labs, start cooling and fluids, and transfer him to medicine.
  - Wrong:
    - Should I give his PRN lorazepam for the rigidity and see whether he loosens up over the next hour? _(why not: Lorazepam may be part of NMS treatment, but the antipsychotic must stop and he needs medical care first.)_
    - Can we add a CK to his morning labs and recheck his temperature every four hours overnight? _(why not: He needs labs and cooling now.)_
- **✓:** Read back: hold all antipsychotics, CK and basic panel, IV fluids. You're calling medicine for transfer.
  - Provider: "Hold all antipsychotics. CK, basic panel, IV fluids. I'm calling medicine for transfer now."
  - Wrong:
    - Read back: hold the haloperidol, CK and basic panel, IV fluids. You're calling medicine for transfer now. _(why not: She said hold all antipsychotics, not just haloperidol.)_
    - Okay, labs and fluids. I'll get those started while you call medicine. _(why not: No details repeated.)_
- Pearl: Psych units see medical emergencies too. Say the diagnosis you're worried about, by name, in the first sentence.

### [ ] sb-pph: Ana Reyes, calling Dr. Holt, OB
2 hours after a vaginal birth. Fundus boggy above the umbilicus, soaked a pad in 15 minutes. HR 118, BP 92/58. You're massaging the fundus.

- **S:** This is the nurse for Ana Reyes in 214. She's hemorrhaging: boggy uterus, a pad soaked in 15 minutes, HR 118, BP 92/58.
  - Wrong:
    - This is the nurse for Ana Reyes in 214. Her bleeding is heavier than expected and I'd like you to take a look when you can. _(why not: Say "hemorrhage" and give the numbers: a pad in 15 minutes, HR 118, BP 92/58.)_
    - This is the nurse for Ana Reyes in 214, two hours after delivery. Her fundus is boggy when I check it. _(why not: Add how fast she's bleeding and her vitals.)_
- **B:** Vaginal birth at 09:00 after a 20-hour induction on oxytocin. Baby 4.2 kg. Asthma, so no carboprost.
  - Wrong:
    - Vaginal birth at 09:00. Second baby. Breastfeeding well, and her first delivery was uncomplicated. _(why not: Missing the long oxytocin induction, the big baby and the asthma.)_
    - Vaginal birth at 09:00 after a 20-hour induction on oxytocin. Baby 4.2 kg. No drug allergies. _(why not: Missing her asthma, which rules out carboprost.)_
- **A:** Uterine atony with hemorrhage. Her bladder is empty. She's getting tachycardic.
  - Wrong:
    - The uterus was firm earlier. I think she may have a vaginal tear that was missed. _(why not: A boggy uterus points to atony. Tears bleed with a firm fundus.)_
    - I think she may have a full bladder that's keeping the uterus from clamping down. _(why not: Good thought, but her bladder is empty, and that's part of your assessment.)_
- **R:** I'm massaging and I've called for help. I'd like uterotonics, a second IV, type and cross, and you at the bedside.
  - Wrong:
    - Can I keep massaging the fundus, weigh the pads, and recheck her bleeding and vitals in 15 minutes? _(why not: Keep massaging, yes, but she needs uterotonics and the provider now.)_
    - She says the cramping is bad. Can I give her ibuprofen for the cramping and a warm pack? _(why not: Pain isn't the problem. Hemorrhage is.)_
- **✓:** Read back: oxytocin 40 units in a liter wide open, methylergonovine 0.2 mg IM, TXA 1 g IV, type and cross 2 units.
  - Provider: "Oxytocin 40 units in a liter, wide open. Methylergonovine 0.2 mg IM. TXA 1 gram IV. Type and cross 2 units. I'm on my way."
  - Wrong:
    - Read back: oxytocin 40 units in a liter wide open, methylergonovine 0.2 mg IV, TXA 1 g IV, type and cross 2 units. _(why not: Methylergonovine is given IM, not IV: IV can cause severe hypertension and stroke.)_
    - Okay, oxytocin, methylergonovine and TXA, and I'll send the type and cross. _(why not: No doses or routes repeated.)_
- Pearl: In hemorrhage, say the numbers that show it: how fast she's bleeding, heart rate, blood pressure. Mention allergies and conditions that rule out drugs.

### [ ] sb-compartment: Kenji Sato, calling Dr. Fisher, orthopedics
Tibia fracture, casted yesterday. Pain 10 after morphine, worse when you stretch his toes. Toes pale and cool, he says they're tingling.

- **S:** This is the nurse for Kenji Sato. I'm worried about compartment syndrome in his left leg: pain 10 despite morphine, worse on passive stretch.
  - Wrong:
    - This is the nurse for Kenji Sato. His pain is 10 out of 10 even after morphine, and I'd like to know if he can have another dose. _(why not: Say what you're worried about: compartment syndrome, and pain on passive stretch.)_
    - This is the nurse for Kenji Sato, tibia fracture in a cast. His toes are tingling under the cast and he can't get comfortable. _(why not: Add pain out of proportion and pain on stretch.)_
- **B:** Closed tibia fracture from a motorcycle crash, casted at 16:00. Morphine 4 mg IV at 01:30 didn't touch it.
  - Wrong:
    - Closed tibia fracture, casted yesterday afternoon. He's 28, healthy, no medical history and no allergies. _(why not: Missing that the morphine didn't help.)_
    - Tibia fracture from a motorcycle crash. He had a lot of pain in the ED too, and needed several doses there. _(why not: Earlier pain doesn't explain pain that's worse now despite morphine.)_
- **A:** Toes pale and cool, tingling, pulses still there. Pain out of proportion. I think pressure is building in the leg.
  - Wrong:
    - He's anxious and keeps watching the clock for his next dose, which makes the pain worse. _(why not: Pain out of proportion and on passive stretch is a physical sign, not a personality.)_
    - His toes are a little cool and tingling, but his pulses are present, so I think circulation to the foot is fine for now. _(why not: Pulses are a late sign. Pain on stretch is the early one.)_
- **R:** I've kept the leg at heart level. I'd like you to see him now and decide about splitting the cast and pressure measurements.
  - Wrong:
    - Can I elevate his leg higher on two more pillows, put ice over the cast, and give another dose of morphine now? _(why not: Raising it above the heart lowers blood flow into the compartment.)_
    - He just had morphine. Can we give it time to work and reassess him in an hour? _(why not: Muscle can die within hours.)_
- **✓:** Read back: split the cast now, leg at heart level, NPO in case of surgery. You're coming in.
  - Provider: "I'm coming in. Bivalve the cast now, keep it at heart level, NPO in case we go to the OR."
  - Wrong:
    - Read back: split the cast now, elevate the leg high on pillows, NPO in case of surgery. You're coming in. _(why not: He said heart level, not elevated.)_
    - Okay, I'll split the cast and call you when it's done. _(why not: Missing heart level and NPO.)_
- Pearl: Pulses are a late sign. Pain out of proportion and pain on passive stretch are the early ones. Say them first.

### [ ] sb-ich: Harriet Lowe, calling Dr. Mendez, hospitalist
She slipped in the bathroom at 21:30 and hit her head. Now she has a headache and is vomiting. She's on warfarin.

- **S:** This is the nurse for Harriet Lowe. She hit her head in a fall an hour ago and now has a headache and vomiting. She's on warfarin.
  - Wrong:
    - This is the nurse for Harriet Lowe. She fell in the bathroom an hour ago. She got herself up and didn't want me to call. _(why not: Add the head strike, symptoms, and warfarin.)_
    - This is the nurse for Harriet Lowe, admitted for pneumonia. She has a headache and is vomiting, and wants something for it. _(why not: Missing the fall and the warfarin.)_
- **B:** Atrial fibrillation on warfarin, INR 2.8 this morning. Admitted for pneumonia. She was oriented this afternoon.
  - Wrong:
    - Admitted for pneumonia, day 3 of antibiotics. History of atrial fibrillation, hypertension and two falls at home. _(why not: Say she's on warfarin and her INR.)_
    - On warfarin for atrial fibrillation. She takes it at night and hasn't missed any doses. _(why not: Add the INR and that she was oriented this afternoon.)_
- **A:** GCS 14, now slower to answer, pupils equal. I'm worried about a bleed in her head.
  - Wrong:
    - She has a bump on the back of her head, but she's talking to me and knows where she is. _(why not: Talking now doesn't rule out a growing bleed, especially on warfarin.)_
    - She's sleepy and slow to answer, but it's late and she's had a long day. _(why not: New sleepiness after a head strike is a warning sign.)_
- **R:** I'd like a head CT now, neuro checks every 15 minutes, and to hold her warfarin. Will you come see her?
  - Wrong:
    - Can I give ondansetron for the vomiting and acetaminophen for the headache, and recheck her in an hour? _(why not: Treats a symptom of a possible bleed. CT first.)_
    - Can we do neuro checks every 4 hours overnight and get a CT in the morning if she's worse? _(why not: Too infrequent for a possible bleed on warfarin.)_
- **✓:** Read back: stat head CT, INR now, hold warfarin, neuro checks every 15 minutes. You're coming.
  - Provider: "Stat head CT, INR now, hold warfarin, neuro checks every 15 minutes. If there's a bleed we reverse it. I'm coming."
  - Wrong:
    - Read back: head CT in the morning, INR now, hold warfarin, neuro checks every 15 minutes. _(why not: He said stat CT.)_
    - Okay, CT and neuro checks. I'll call you with the result. _(why not: Missing stat, the INR, and the warfarin hold.)_
- Pearl: Head strike plus an anticoagulant is high risk even if they look fine. Say both in the first sentence; it gets a CT ordered.

### [ ] sb-peds-dehyd: Noah Bailey, calling Dr. Grant, pediatric resident
Vomiting and diarrhea for two days. No wet diaper since 16:00. Sunken soft spot, no tears, hard to wake. HR 178, cap refill 4 seconds.

- **S:** This is the nurse for Noah Bailey, 9 months. He's severely dehydrated and lethargic: HR 178, cap refill 4 seconds, no wet diaper in 12 hours.
  - Wrong:
    - This is the nurse for Noah Bailey, 9 months. He hasn't had a wet diaper in 12 hours and his mom is asking about it. _(why not: Add the heart rate, cap refill and lethargy that make it shock.)_
    - This is the nurse for Noah Bailey, 9 months, here for gastroenteritis. His heart rate is 178 and he's sleeping a lot. _(why not: Give the whole picture: lethargic, slow cap refill, no wet diapers.)_
- **B:** Gastroenteritis, admitted yesterday for fluids. His IV came out at 18:00. Weight 8.5 kg.
  - Wrong:
    - Gastroenteritis, admitted yesterday for fluids. He's still having loose stools, about six today. _(why not: Missing that his IV came out and his weight.)_
    - His IV came out at 18:00 and he's been taking sips by mouth since then. _(why not: Add his weight so the resident can dose fluids.)_
- **A:** Sunken fontanelle, dry mouth, hard to wake. I think he's in shock from fluid loss.
  - Wrong:
    - He's sleeping through his cares. I think he's tired from being sick for three days. _(why not: Hard to wake with a fast heart rate is shock, not tiredness.)_
    - Dry mouth and fewer wet diapers. I think he's mildly dehydrated. _(why not: Sunken fontanelle, no tears, slow refill and lethargy are severe.)_
- **R:** He needs IV access now and a fluid bolus. I'd like a glucose check and you at the bedside.
  - Wrong:
    - He takes a bottle sometimes. Should we try oral rehydration by syringe first and see how he does? _(why not: He's too lethargic to drink safely.)_
    - He's a hard stick. Can we call the IV team in the morning when they're in? _(why not: He needs access now; an IO if needed.)_
- **✓:** Read back: normal saline 20 mL/kg, 170 mL over 15 minutes, glucose now, and an IO if two IV attempts fail.
  - Provider: "Normal saline 20 mL per kilo, so 170 mL, over 15 minutes. Check a glucose. If no IV in two tries, call me for an IO. I'm coming."
  - Wrong:
    - Read back: normal saline 20 mL/kg, 170 mL over an hour, glucose now. You're coming. _(why not: She said over 15 minutes, and an IO after two failed IV attempts.)_
    - Okay, a bolus and a glucose. I'll get the IV started. _(why not: No volume or rate repeated.)_
- Pearl: Babies hide shock until late: a fast heart rate and slow cap refill are early signs. Low blood pressure is late. Weight-based fluids, read back the math.

### [ ] sb-suicide: Tom Brennan, calling Dr. Vasquez, attending psychiatrist
Voluntary admission for depression, on 15-minute checks. He tells you he plans to hang himself with his shoelaces tonight. He has them on.

- **S:** This is the nurse for Tom Brennan. He just told me he plans to hang himself tonight with his shoelaces, and he had them on. I've removed them and I'm with him.
  - Wrong:
    - This is the nurse for Tom Brennan. He's talking about wanting to die again tonight, and I wanted to let you know before you leave. _(why not: Give the plan, the means and the time, and what you've already done.)_
    - This is the nurse for Tom Brennan, admitted after an overdose. I'm worried he's suicidal; something about him is different tonight. _(why not: Say what he told you: a plan, a method, tonight.)_
- **B:** Admitted two days ago after an overdose. On 15-minute checks. His divorce was finalized today.
  - Wrong:
    - Admitted two days ago for depression. Started on sertraline. He's been attending groups. _(why not: Missing the overdose and today's divorce.)_
    - Admitted two days ago after an overdose of his own medications. He's been quiet but cooperative. _(why not: Add today's divorce and that he's on 15-minute checks.)_
- **A:** He has a plan, a method and a time. He's at high risk of suicide right now.
  - Wrong:
    - He's upset about his divorce today, which is understandable. I think he needs to talk. _(why not: True, but the plan, method and timing are what make this high risk.)_
    - He's at moderate risk; he's talking about it, and people who talk about it are asking for help. _(why not: A specific plan with access and a time is high risk.)_
- **R:** I'd like him on 1:1 observation, a room and belongings search, and you to evaluate him today.
  - Wrong:
    - Can we increase his checks to every 5 minutes and move him to the room by the station? _(why not: Even 5-minute checks leave gaps. With a plan and means, ask for 1:1.)_
    - Should I keep him on 15-minute checks now that the laces are gone, and have him promise to come to staff? _(why not: Removing the laces is right, but 15-minute checks aren't enough.)_
- **✓:** Read back: 1:1 now, room and belongings search, you'll see him within the hour.
  - Provider: "Start 1:1 observation now. Search the room and his belongings. I'll see him within the hour."
  - Wrong:
    - Read back: 1:1 now, room and belongings search, you'll see him tomorrow morning. _(why not: She said within the hour, not tomorrow.)_
    - Okay, 1:1. I'll get someone to sit with him. _(why not: Missing the search and the time she'll see him.)_
- Pearl: Plan, means, timing: say all three. 15-minute checks are too far apart for a patient with a plan and access. Ask for 1:1.

### [ ] sb-stemi: Earl Watts, calling Dr. Ng, hospitalist
Day 2 after hip surgery. Crushing chest pain for 15 minutes, sweating. 12-lead shows ST elevation in II, III and aVF.

- **S:** This is the nurse for Earl Watts. He has chest pain and the ECG shows ST elevation in II, III and aVF. I think he's having a STEMI.
  - Wrong:
    - This is the nurse for Earl Watts. He has crushing chest pain and he's sweating. It started about ten minutes ago at rest. _(why not: Add the ECG: ST elevation in II, III and aVF.)_
    - This is the nurse for Earl Watts, hip replacement two days ago. His ECG looks abnormal to me and I'd like you to read it. _(why not: Say what's abnormal and that you think it's a STEMI.)_
- **B:** Hip replacement two days ago, on enoxaparin. Diabetic, smoker. No cardiac history.
  - Wrong:
    - Hip replacement two days ago. He's been walking with therapy and his pain is controlled. _(why not: Missing the enoxaparin and his cardiac risk factors.)_
    - Diabetic and a smoker, no cardiac history. His father had a heart attack at 60. _(why not: Add the recent surgery and the enoxaparin; they affect the cath plan.)_
- **A:** BP 110/64, HR 58, sweaty. Inferior changes. I'm holding nitroglycerin until we check the right side.
  - Wrong:
    - He's two days out from a hip replacement. I think it could be a PE given his surgery. _(why not: Possible after surgery, but ST elevation in a coronary pattern points to an MI.)_
    - BP 110/64, HR 58, sweaty. I think he's having an MI. Should I give nitro from the PRN order? _(why not: With inferior changes, ask about a right-sided ECG before nitrates.)_
- **R:** I'd like the cath lab activated and you here now. Do you want aspirin and a right-sided ECG?
  - Wrong:
    - Should I repeat the ECG in 15 minutes and send a troponin to see if it's really his heart? _(why not: ST elevation already means activate the cath lab.)_
    - His pain is 8 out of 10. Can I give him nitroglycerin for the pain and recheck his pressure? _(why not: Possible right ventricular involvement: nitrates can drop his pressure.)_
- **✓:** Read back: cath lab activated, aspirin 324 mg chewed, right-sided ECG, no nitro for now. You're coming.
  - Provider: "Activating the cath lab. Aspirin 324 chewed. Right-sided ECG. No nitro for now. I'm on my way."
  - Wrong:
    - Read back: cath lab activated, aspirin 81 mg chewed, right-sided ECG, no nitro for now. You're on your way. _(why not: He said 324 mg, not 81.)_
    - Okay, aspirin and ECG. I'll have him ready. _(why not: No doses repeated.)_
- Pearl: Read the ECG out loud: "ST elevation in II, III, aVF" gets a STEMI response. With an inferior MI, ask about a right-sided ECG before nitrates.

### [ ] sb-h-hit **[NCLEX level]**: Paul Grady, calling Dr. Reyes, cardiology
Day 7 on a heparin drip after a PE. Platelets 72,000, from 180,000 on admission. New swelling and pain in his right arm.

- **S:** This is the nurse for Paul Grady. I'm worried about HIT: platelets fell from 180,000 to 72,000 on day 7 of heparin, and he has a new swollen right arm.
  - Wrong:
    - This is the nurse for Paul Grady, on a heparin drip for a PE. His platelets are 72,000 this morning and I wanted to make sure you'd seen the result. _(why not: The number alone doesn't say why it matters. The drop from 180,000, the timing and the new clot make it HIT.)_
    - This is the nurse for Paul Grady. His right arm is newly swollen and tender this morning. I think he may have a DVT, even on the heparin drip. _(why not: Half the story. A new clot with falling platelets on heparin is HIT until proven otherwise.)_
- **B:** Admitted for a PE, on a heparin drip since day 1. Platelets were 180,000 on admission. No bleeding.
  - Wrong:
    - Admitted for a PE a week ago. History of hypertension and type 2 diabetes, on metformin and amlodipine at home. _(why not: Leaves out how long he's been on heparin and his baseline count, the two facts that point to HIT.)_
    - His anti-Xa levels have all been in range, so the drip has been therapeutic the whole time. _(why not: True, but it doesn't matter for HIT. It's an immune reaction, not a dose problem.)_
- **A:** A more than 50% drop 5 to 10 days into heparin, with a new clot. I think this is HIT.
  - Wrong:
    - With platelets that low, I think the heparin is too much for him and he's at risk of bleeding. _(why not: HIT causes clots, not bleeding. The danger here is thrombosis.)_
    - He had a low-grade temp yesterday. He may be getting thrombocytopenia from an infection. _(why not: Possible, but the timing on heparin and the new clot make HIT the first thing to rule out.)_
- **R:** I've stopped the heparin. I'd like a non-heparin anticoagulant, a HIT antibody test, and an ultrasound of the arm.
  - Wrong:
    - Can we lower the heparin rate by a couple of units and recheck his platelets with tomorrow morning's labs? _(why not: Lowering the rate doesn't stop HIT. All heparin stops.)_
    - Should I stop the heparin and hold all anticoagulation until the HIT antibody test comes back in a day or two? _(why not: Stopping heparin is right, but with HIT and a new clot, he needs a different anticoagulant now. Untreated, clots keep forming.)_
- **✓:** Read back: stop all heparin including flushes, start argatroban per protocol, HIT antibody, arm Doppler, heparin allergy flagged.
  - Provider: "Stop all heparin, including flushes. Start argatroban per protocol. Send a HIT antibody. Upper extremity Doppler. Flag the allergy."
  - Wrong:
    - Read back: stop the heparin drip, start argatroban per protocol, HIT antibody, upper extremity Doppler this morning. _(why not: Missed "including flushes" and the allergy flag. Small heparin exposures keep HIT going.)_
    - Read back: stop all heparin including flushes, start enoxaparin, HIT antibody, arm Doppler, heparin allergy flagged. _(why not: Enoxaparin is a heparin. She said argatroban.)_
- Pearl: HIT: platelets drop by more than half 5 to 10 days into heparin, often with new clots. Stop all heparin (flushes too), start a non-heparin anticoagulant, and list heparin as an allergy.

### [ ] sb-h-preE **[NCLEX level]**: Tasha Green, calling Dr. Holt, OB
Day 2 after a cesarean, doing well this morning. Now BP 164/112 (rechecked 15 minutes apart), headache 7 of 10, seeing spots.

- **S:** This is the nurse for Tasha Green, day 2 after a cesarean. Severe-range BP 164/112 twice, 15 minutes apart, with a headache and visual changes.
  - Wrong:
    - This is the nurse for Tasha Green, day 2 after a cesarean. Her blood pressure is high this afternoon and she has a headache. _(why not: No numbers. "Severe range, twice, 15 minutes apart" is what starts the treatment clock.)_
    - This is the nurse for Tasha Green, day 2 after a cesarean. She has a bad headache and the lights bother her. Can she have something stronger than acetaminophen? _(why not: Treating the headache misses that it's a sign of severe preeclampsia.)_
- **B:** Cesarean two days ago. Blood pressures were normal in pregnancy and this morning. No magnesium given.
  - Wrong:
    - G2P2, cesarean two days ago for breech. Breastfeeding well, incision clean, and she's planning to go home tomorrow. _(why not: True but not what he needs. Preeclampsia can start after birth even with normal pressures in pregnancy.)_
    - She has a history of migraines with aura and says this one feels a lot like those. _(why not: Tempting, but a history of migraines doesn't explain a pressure of 164/112. Don't let it anchor the call.)_
- **A:** I think this is postpartum preeclampsia with severe features. She's at risk of eclampsia and stroke.
  - Wrong:
    - She had a spinal for the cesarean. I think it's a post-spinal headache from her anesthesia. _(why not: A spinal headache is positional and doesn't cause severe hypertension or visual spots.)_
    - Her incision pain is 6 out of 10 and she's worried about the baby. I think it's pain and anxiety raising her pressure. _(why not: Pain can raise pressure, but not to 164/112 with visual changes. Assume preeclampsia.)_
- **R:** I need an antihypertensive within the hour, magnesium for seizure prevention, and preeclampsia labs. Can you come now?
  - Wrong:
    - Can I give her pain medicine, let her rest in a dark room, recheck her pressure in an hour, and call if it's still high? _(why not: Severe-range pressures confirmed 15 minutes apart need treatment within 30 to 60 minutes, not another hour of watching.)_
    - Can we start oral labetalol tonight and recheck her pressure and her labs in the morning? _(why not: Treating the pressure is right, but she also needs magnesium and labs, and closer checks than the morning.)_
- **✓:** Read back: labetalol 20 mg IV now, BP in 10 minutes, magnesium 4 g load then 2 g/hr, CBC, liver enzymes, creatinine.
  - Provider: "Labetalol 20 mg IV now, repeat BP in 10 minutes. Magnesium 4 gram load, then 2 grams an hour. CBC, liver enzymes, creatinine. I'm coming."
  - Wrong:
    - Read back: labetalol 20 mg IV now, BP in 10 minutes, magnesium 2 g load then 4 g/hr, CBC, liver enzymes, creatinine. _(why not: The magnesium numbers are reversed: 4 g load, then 2 g an hour. Reversed, she'd get a dangerous maintenance rate.)_
    - Read back: labetalol 200 mg IV now, BP in 10 minutes, magnesium 4 g load then 2 g/hr, CBC, liver enzymes, creatinine. _(why not: 20 mg, not 200. Read back every number.)_
- Pearl: Preeclampsia can start up to 6 weeks after birth. Severe range is 160 or more systolic, or 110 or more diastolic, confirmed in 15 minutes: treat within the hour and start magnesium.

### [ ] sb-h-na **[NCLEX level]**: Ellen Moore, calling Dr. Patel, hospitalist
Admitted for pneumonia. Now confused and vomited once. Sodium 118, down from 129 yesterday. On a thiazide at home.

- **S:** This is the nurse for Ellen Moore. Her sodium dropped from 129 to 118 in a day, and she's newly confused and vomiting.
  - Wrong:
    - This is the nurse for Ellen Moore. The lab just called with a critical sodium of 118 and I'm passing it on. _(why not: Add the speed of the drop and the symptoms. A fast drop with neuro signs is an emergency; a slow one without symptoms is not.)_
    - This is the nurse for Ellen Moore. She's confused this afternoon and pulling at her gown. I think she may be delirious from being in the hospital. _(why not: Delirium is a description, not a cause. The sodium is the cause.)_
- **B:** Pneumonia. Takes hydrochlorothiazide at home, still ordered here. She's been drinking a lot of water.
  - Wrong:
    - Pneumonia, on ceftriaxone and azithromycin, improving on 2 liters. She was oriented yesterday. _(why not: Missing the thiazide and the water intake, the likely causes.)_
    - She has a history of mild dementia and her daughter says she gets muddled in new places. _(why not: Dementia doesn't explain an acute change. Don't let it anchor the call.)_
- **A:** Symptomatic hyponatremia that fell fast. I'm worried about seizures and brain swelling.
  - Wrong:
    - She's vomited three times today. I think she's dehydrated from vomiting and needs fluids. _(why not: Possible contributor, but a sodium of 118 with confusion is the emergency.)_
    - Her sodium is low, but she's awake and she's not having seizures, so I think it's stable for now. _(why not: Confusion and vomiting are already neuro symptoms. Seizures are what you're trying to prevent.)_
- **R:** I've held the thiazide and put her on seizure precautions. Can you see her, and do you want hypertonic saline and frequent sodium checks?
  - Wrong:
    - She looks dry. Should I give a liter of normal saline quickly to bring the sodium up before the next lab draw? _(why not: Correction rate matters. Too fast can cause osmotic demyelination. Let the provider order the solution and the rate.)_
    - Should I put her on a one-liter fluid restriction, hold the thiazide, and recheck the sodium in the morning? _(why not: A restriction may be part of the plan, but symptomatic sodium of 118 needs active treatment and close checks now.)_
- **✓:** Read back: 3% saline 100 mL over 10 minutes, sodium every 2 hours, no more than 8 in 24 hours, thiazide held, seizure precautions.
  - Provider: "3% saline, 100 mL bolus over 10 minutes. Sodium every 2 hours. Don't correct more than 8 in 24 hours. Hold the thiazide. Seizure precautions."
  - Wrong:
    - Read back: 3% saline 100 mL over an hour, sodium every 4 hours, no more than 8 in 24 hours, thiazide held, seizure precautions. _(why not: Wrong rate and wrong check frequency: she said over 10 minutes, and sodium every 2 hours.)_
    - Read back: normal saline 100 mL over 10 minutes, sodium every 2 hours, no more than 8 in 24 hours, thiazide held. _(why not: She ordered 3% saline, not normal saline.)_
- Pearl: Hyponatremia: how fast it fell and the symptoms matter more than the number. Correct slowly (usually no more than 8 to 10 in 24 hours) to avoid osmotic demyelination.

### [ ] sb-h-gib **[NCLEX level]**: Walter Kim, calling Dr. Shah, hospitalist
Admitted for a COPD flare. Just vomited 200 mL of coffee-ground material. HR 112, BP 104/66 (baseline 142/80). Takes aspirin and naproxen.

- **S:** This is the nurse for Walter Kim. He vomited 200 mL of coffee-ground material. HR 112, BP 104/66, down from his baseline of 142.
  - Wrong:
    - This is the nurse for Walter Kim. He vomited about 200 mL a few minutes ago and his heart rate is up to 112. _(why not: Coffee-ground is the key word, and the pressure drop from his baseline tells how much he's lost.)_
    - This is the nurse for Walter Kim. I think he has a GI bleed: he vomited coffee-ground material. His pressure is holding at 104/66. _(why not: 104 sounds fine until you say his baseline is 142. Give the change.)_
- **B:** COPD flare, on prednisone since admission. Takes daily aspirin and naproxen at home. Hemoglobin 12.1 yesterday.
  - Wrong:
    - COPD flare, admitted three days ago. On scheduled nebulizers and oxygen at 2 L, breathing better than yesterday. _(why not: Leaves out the steroid and the NSAIDs, the reasons he's bleeding.)_
    - No history of GI bleeding or ulcers, and he doesn't drink. _(why not: True and worth saying, but the steroid plus NSAIDs is what raises his risk now.)_
- **A:** An upper GI bleed with early shock. I think he's losing more than we see.
  - Wrong:
    - He's on oxygen and his nose is dry. I think it's swallowed blood from a nosebleed. _(why not: No nosebleed was seen, and his heart rate and pressure say he's lost volume.)_
    - His heart rate is up a little, but his pressure is still over 100, so he's stable for now. _(why not: A drop from 142 with a heart rate of 112 is compensated shock.)_
- **R:** He's NPO and I've placed a second large IV. I'd like a type and cross, a stat hemoglobin, a PPI, and GI consulted. Can you come?
  - Wrong:
    - Can I give ondansetron for the vomiting and keep him on clear liquids until his stomach settles? _(why not: Treats the symptom, not the bleed.)_
    - His hemoglobin was 12.1 yesterday. Can I start a liter of fluid and recheck his hemoglobin with the morning labs? _(why not: Fluids may help, but he needs blood available and a hemoglobin now.)_
- **✓:** Read back: type and cross 2 units, stat CBC, pantoprazole 80 mg IV bolus then 8 mg/hr, hold aspirin and naproxen. You're calling GI.
  - Provider: "Type and cross 2 units. Stat CBC. Pantoprazole 80 mg IV bolus, then 8 mg an hour. Hold the aspirin and naproxen. I'm calling GI."
  - Wrong:
    - Read back: type and cross 2 units, stat CBC, pantoprazole 8 mg IV bolus then 80 mg/hr, hold aspirin and naproxen. You're calling GI. _(why not: The numbers are reversed: an 80 mg bolus, then 8 mg an hour.)_
    - Read back: type and cross, CBC, pantoprazole, hold his aspirin and naproxen, and you're calling GI. _(why not: No doses or units repeated.)_
- Pearl: In bleeding, give the change from baseline: a "normal" pressure can be a big drop. Steroids plus NSAIDs or aspirin is a classic setup for a GI bleed.

## De-escalation

### [ ] de-ed-wait: Luis Reyes, ED waiting room, 16:20 (starts at 6/10)
He's been waiting six hours with a cut hand. He's at the front desk, shouting.

- Turn 1: "Six HOURS. Nobody tells me ANYTHING in here!"
  - **Best (-2):** "Mr. Reyes, I'm Sam, one of the nurses. Six hours is a long time. Tell me what's going on."
  - Others: "Sir, I understand you're frustrated, but you need to calm down or security will walk you out." (+3) / "Everyone here is waiting, sir. You're not the only one who's been here six hours." (+2)
- Turn 2: "My kid's home with my sister and she has to leave at five."
  - **Best (-2):** "So you need to get home to your kid. Let me find out where you are in line, and I'll come back by 16:40."
  - Others: "I'm sorry, but I can't do anything about childcare. Is there someone else who can pick her up?" (+1) / "I know it's been long. You'll be seen when it's your turn; the sickest people go first, that's how triage works." (+2)
- Turn 3: He steps in close and points at your face. "Don't feed me a line."
  - **Best (-1):** Step back so you're out of reach, open hands. "I hear you. I'm going to give you some space, and I'll be back with a real answer."
  - Others: Put a hand on his shoulder to reassure him. "Hey, I'm on your side. Let's take a breath together." (+3) / Hold your ground so he knows you won't be pushed around, and match his volume: "I am NOT feeding you a line." (+3)
- Turn 4: "...Fine. Can I at least get some water?"
  - **Best (-2):** "Let me check if you can drink before they stitch you. If yes, I'll bring it myself."
  - Others: "No food or water until you're seen. That's the rule for everyone waiting on a procedure." (+1) / "If you sit down and stay quiet for a while, I'll see what I can do about some water." (+1)
- Pearl: Introduce yourself, use their name, name the feeling, find the real need, and stay out of reach.

### [ ] de-hold: Nadia Farouk, Adult psych, 11:00 (starts at 6/10)
Brought in on a 72-hour hold overnight. She's at the locked door, pulling the handle.

- Turn 1: "You can't keep me here! I didn't do anything!"
  - **Best (-2):** "I'm Alex, your nurse today. It's frightening to wake up somewhere locked. Can we sit and talk about what happens next?"
  - Others: "Actually we can. You're on a legal hold, so the doors stay locked until the doctor says otherwise." (+2) / "Everyone says that on their first day. Give it a little time and you'll see it's not so bad in here." (+2)
- Turn 2: "How long? Tell me the truth."
  - **Best (-2):** "Up to 72 hours for now. You have rights: a patients' rights advocate, and a hearing if they want to keep you longer."
  - Others: "Just a few hours, probably. Let's not worry about that right now; let's get you something to eat." (+1) / "That's up to the doctor, not me. I just work here. You can ask her when she rounds tomorrow." (+1)
- Turn 3: "I need my phone. My mom doesn't know where I am."
  - **Best (-2):** "Let's call her from the unit phone right now. Your phone is locked up safely and you'll get it back."
  - Others: "Phones aren't allowed on the unit. Those are the rules for everybody, and I can't make exceptions." (+2) / "Your mom will find out eventually. The social worker usually calls families in a day or two, so try not to worry." (+2)
- Turn 4: "Fine. But I'm not taking any pills."
  - **Best (-1):** "You can ask about any medicine before you decide. Nobody will hide anything in your food."
  - Others: "If you don't take them, the doctor can order a shot, and nobody wants it to come to that." (+3) / "You'll feel better if you do. Everyone feels that way at first, and the medicine really does help." (+1)
- Pearl: Honesty de-escalates. Explain the hold, her rights, and what happens next. Threats escalate.

### [ ] de-sundown: Harold Pike, Med-surg, 18:30 (starts at 5/10)
Dementia. He's out of bed, pulling at his IV, trying the door.

- Turn 1: "I have to get home. The kids need dinner."
  - **Best (-2):** "You're thinking about your kids. Tell me about them."
  - Others: "Harold, your kids are grown. You're in the hospital." (+2) / "You can't go home tonight, Harold. Get back in bed." (+2)
- Turn 2: "Who are you? What's this thing in my arm?"
  - **Best (-2):** Get to eye level, slow and quiet. "I'm Jo, a nurse. That's medicine to help you. Let's keep it safe."
  - Others: Gently hold his hand down so he can't reach the IV. "Don't touch that, Harold, you'll hurt yourself." (+3) / "I told you already, Harold. It's your IV, the same one you asked me about ten minutes ago." (+1)
- Turn 3: "I'm so hungry. When's supper?"
  - **Best (-2):** "Let's get you something now. Sit with me and we'll have a snack."
  - Others: "Dinner was an hour ago, Harold. You ate the whole tray, remember?" (+1) / Call the provider and ask for a sedative to help him settle for the night. (0)
- Turn 4: He sits, chewing a graham cracker. "Is it dark out?"
  - **Best (-2):** "It is. Let's turn on the lamp and close the curtain. Would you like the radio?"
  - Others: Leave the overheads on and the TV loud so he stays awake until a normal bedtime and sleeps through. (+2) / Say nothing, since he's settled, and slip out to catch up on your charting. (+1)
- Pearl: In dementia: don't argue with the reality they're in. Join it, redirect, and meet the need underneath (hunger, fear, the dark).

### [ ] de-teen-phone: Kai, Teen psych, 21:00 (starts at 5/10)
Phone time is over. He refuses to hand it back and is swearing at staff.

- Turn 1: "This is so stupid. I was literally in the middle of something."
  - **Best (-2):** "Sounds like I caught you mid-conversation. That's frustrating."
  - Others: "Rules are rules, and phone time is over for everyone. Hand it to me, please." (+2) / "Watch your language. You don't talk to staff like that here." (+2)
- Turn 2: "Everyone else got five extra minutes yesterday."
  - **Best (-2):** "You can take two minutes to say goodnight, then hand it to me. Or hand it now and have first phone time tomorrow."
  - Others: "I don't care what happened yesterday. I wasn't here, and tonight phone time ends when I say it ends." (+1) / "Fine, keep it tonight. But this is a one-time thing, and I want it handed in first thing in the morning." (-1)
- Turn 3: "Whatever. You can't make me."
  - **Best (-2):** "You're right, I won't grab it. I'd rather you choose. Two minutes?"
  - Others: Call three staff to stand around him until he hands it over. (+3) / "Then you lose phone time tomorrow too. And the day after, if you keep this up." (+1)
- Turn 4: He hands it over. "Can I at least have music to fall asleep?"
  - **Best (-2):** "Yes, the unit player's in the day room. Thanks for handing it over. That took something."
  - Others: "Don't push it. You already got more chances tonight than you should have." (+1) / "We'll see. It depends how the rest of the night goes." (0)
- Pearl: With teens, give two acceptable choices and a way to save face. Power struggles have no winner.

### [ ] de-withdrawal: Greg Tate, Med-surg, 02:00 (starts at 6/10)
Admitted for pancreatitis. Shouting, sweating, shaking. Last drink was about 48 hours ago.

- Turn 1: "Get them OFF me! The bugs, they're on the wall!"
  - **Best (-1):** Check his vital signs and score his withdrawal.
  - Others: "There are no bugs. You're imagining it." (+2) / "Keep it down, please. People are trying to sleep." (+2)
- Turn 2: "Make it stop. Please. I'm scared."
  - **Best (-3):** Give the lorazepam ordered for his withdrawal score, and tell him it will help.
  - Others: Give haloperidol for the hallucinations, since that's what's scaring him. (0) / Tell him this is what happens when you drink, and that he did this to himself. (+3)
- Turn 3: "Everything's so loud. And bright."
  - **Best (-2):** Lower the lights, close the door, one calm voice.
  - Others: Move him by the nurses' station where it's busy. (+1) / Put on the TV to give him something else to look at. (+1)
- Turn 4: Quieter now. "Am I going to die?"
  - **Best (-2):** "You're in the right place. We're watching you closely and treating it. I'll be back every 30 minutes."
  - Others: "I won't lie to you: people do die from alcohol withdrawal, so you need to do exactly what we tell you tonight." (+2) / "Just try to sleep. You'll feel a lot better in the morning, I promise." (0)
- Pearl: Agitation can be medical. Withdrawal, low glucose, low oxygen and pain all look like "behavior." Assess before you redirect.

### [ ] de-family: Dana Whitfield, Med-surg, 13:00 (starts at 6/10)
A daughter found her mother wet, with the call light on for 20 minutes. She's at the station, furious.

- Turn 1: "My mother sat in urine for TWENTY minutes. Where was everyone?"
  - **Best (-3):** "I'm so sorry. That shouldn't have happened. Let's go to her together right now."
  - Others: "I'm sorry, but we have a lot of patients today and we're short one aide." (+2) / "I wasn't her nurse this morning, so I can't tell you what happened before I got here." (+2)
- Turn 2: Back in the room, after you've changed her: "This keeps happening."
  - **Best (-2):** "Tell me what you've seen. I'm going to set up a toileting schedule every two hours and write it on her board."
  - Others: "I'm sure it's not that often. The aides round every two hours and I haven't heard about any other times." (+2) / "You can file a complaint with patient relations downstairs. They're open until five." (+1)
- Turn 3: "I want to talk to someone in charge."
  - **Best (-2):** "Of course. I'll get the charge nurse now, and I'll stay until she arrives."
  - Others: "That's not necessary. I'm her nurse and I can handle whatever you need." (+2) / "She's busy with a new admission right now. I can leave her a note for later." (+2)
- Turn 4: "I just want her to be treated like she matters."
  - **Best (-2):** "She does. I'll check on her myself every hour today. Here's the unit number if you want an update."
  - Others: "We treat everyone the same here. Every patient gets the same care, no matter who they are." (+1) / "I understand. I'd feel exactly the same way if it were my own mother lying in that bed, believe me." (0)
- Pearl: With angry families: apologize for the experience, act right away, and follow through on what you promise.

### [ ] de-chair: Victor Kane, Adult psych, 15:00 (starts at 7/10)
He's been pacing all morning. Now he picks up a chair in the day room. Two other patients are nearby.

- Turn 1: He raises the chair. "Everybody get BACK!"
  - **Best (-1):** Keep your distance, call for help, and get the other patients out.
  - Others: Walk up to him alone, slowly, and try to take the chair. (+3) / Stay where you are and keep talking to him, alone, with the others watching. (+1)
- Turn 2: Team at the door. He's breathing hard. "They're saying I'm going to die in here."
  - **Best (-2):** One person talks, from a distance: "Victor, it's Sam. You're safe. Nobody's going to hurt you. Can you set the chair down?"
  - Others: Everyone on the team talks at once, each trying a different way to reach him. (+2) / From the doorway, firm and loud so he knows you mean it: "Victor, put it down NOW." (+2)
- Turn 3: He sets the chair down. "I can't stop hearing them."
  - **Best (-2):** "That sounds exhausting. You have a medicine that can quiet them down. Will you take it by mouth?"
  - Others: Signal the team to hold him for an injection now that the chair is down and his hands are free. (+3) / "Good. Now go to your room and stay there until you've calmed down." (+1)
- Turn 4: After the medicine: "I didn't want to hurt anybody."
  - **Best (-2):** "I know. You stopped. Let's talk later about what helps when the voices get loud."
  - Others: "You scared a lot of people tonight, Victor. We're going to have to talk about that." (+1) / Say nothing. He needs to sit with what he did. (0)
- Pearl: When there's a weapon: distance, help, and clear the area first. One voice. Offer oral medicine before anything more restrictive.

### [ ] de-pain: Tina Marsh, Surgical, 04:00 (starts at 5/10)
Day 1 after abdominal surgery. You're here for vitals. She yanks her arm away.

- Turn 1: "STOP poking me! Every hour, all night!"
  - **Best (-2):** "You haven't slept at all. That's awful. How's your pain right now?"
  - Others: "I have to do vitals every four hours after surgery. It's hospital policy." (+1) / Put the cuff on anyway. It only takes a minute. (+3)
- Turn 2: "Nine. Nobody's given me anything since ten."
  - **Best (-2):** Check her MAR: hydromorphone is due. "You're due for pain medicine. Let me do your pressure first, then give it."
  - Others: "Pain is expected after surgery. It usually gets better by the second or third day." (+2) / "You'll have to ask the doctor in the morning. I can't change your orders in the middle of the night." (+2)
- Turn 3: "And can you all stop waking me up?"
  - **Best (-2):** "Let's group things: I'll do your next checks and meds together at 08:00, and put a sign on your door."
  - Others: "No. That's the schedule after surgery, and it's there to keep you safe." (+1) / "Sure, I'll skip your vitals for the rest of tonight so you can get some real sleep." (-1)
- Turn 4: Thirty minutes later: "It's a four now."
  - **Best (-2):** "Good. Get some sleep. The light's by your hand if it creeps back up."
  - Others: "See? You didn't need to yell. All you had to do was ask me nicely the first time." (+2) / Leave quietly without saying anything so she can sleep. (0)
- Pearl: Pain is a common cause of anger. Ask about pain first, then explain, then cluster care so people can sleep.

### [ ] de-intox-ama: Rick Dawson, ED, 01:30 (starts at 6/10)
Brought in drunk after hitting his head. He's pulling off the monitor leads and heading for the door.

- Turn 1: "I'm FINE. I'm going home. You can't stop me."
  - **Best (-2):** "Rick, I'm Jess, your nurse. I hear you want to go home. Can you sit with me for one minute so I can check your head first?"
  - Others: "Rick, you're too drunk to leave and you know it. Sit down before you fall and hurt yourself again." (+2) / Call security to stand in the doorway so he can see that leaving isn't an option tonight, then try talking to him. (+2)
- Turn 2: "My head's fine. I've been hit harder."
  - **Best (-2):** "Maybe so. With a head injury and alcohol, I can't tell yet, and neither can you. That's why we want a scan."
  - Others: "You could have a bleed in your head right now. You could die tonight if you walk out that door, do you understand?" (+1) / "Fine. It's your choice. Sign here that you're leaving against medical advice and you can go." (0)
- Turn 3: "I need a cigarette. I'm going nuts in here."
  - **Best (-2):** "I can't let you smoke, but I can ask the doctor about a nicotine patch and get you a sandwich. Deal?"
  - Others: "No smoking anywhere on hospital grounds. Those are the rules and I don't make them." (+1) / "Go ahead outside for five minutes, just promise me you'll come straight back in for your scan afterward." (+1)
- Turn 4: Sitting now, eating. "How long's the scan?"
  - **Best (-1):** "About half an hour. I'll come back and tell you when it's time, and I'll check on you in between."
  - Others: "Whenever they get to you. Radiology is backed up tonight, so it could be a while." (+1) / "Not long. Just stay put this time, and don't make me chase you down the hallway again." (+2)
- Pearl: Intoxicated people with head injuries can't reliably judge their own risk. Stay calm, give a reason, meet a need (food, nicotine), and involve the provider on capacity.

### [ ] de-paranoid: Celia Vance, Adult psych, 12:15 (starts at 6/10)
She hasn't eaten in two days. She pushes her tray away and stands up.

- Turn 1: "I know what you put in it. I'm not stupid."
  - **Best (-2):** "It sounds scary to think your food isn't safe. I'm not going to argue with you about it."
  - Others: "There's nothing in your food. That's the illness talking; it's a paranoid thought, and it isn't real." (+2) / "If you don't start eating, the doctor will have to order a feeding tube." (+3)
- Turn 2: "Everyone here is in on it."
  - **Best (-2):** "I can't see what you're seeing. What would help you feel safe enough to eat something?"
  - Others: "Nobody is in on anything. We're all here to help you, every single one of us." (+1) / "Okay, I believe you. I've wondered about the kitchen staff myself." (0)
- Turn 3: "Sealed. From a package I open myself."
  - **Best (-2):** "I can bring you sealed crackers, peanut butter and a juice box from the pantry. You open them."
  - Others: "We can't make special arrangements for one patient. The trays all come from the same kitchen." (+2) / "Just eat what's here. It's fine. Look, I'll take a bite of it first to show you." (+1)
- Turn 4: She eats the crackers. "Don't tell anyone I ate."
  - **Best (-1):** "I need to write down what you ate so your team knows you're okay. I won't make a big deal of it."
  - Others: "Okay, I won't tell anyone. It can stay just between the two of us, I promise." (0) / "Great job! See, nothing happened! I told you the food here was perfectly safe." (+1)
- Pearl: Don't argue with a delusion, and don't agree with it. Acknowledge the feeling, find a safe workaround, and never promise secrecy.

### [ ] de-parent-ivs: Denise Carter, Pediatrics, 15:00 (starts at 7/10)
Her 3-year-old has been stuck three times for an IV. You come in with supplies for a fourth try.

- Turn 1: "NO. You're not touching him again. Three times!"
  - **Best (-2):** "Three tries is too many. I'm sorry. Let's stop and talk about what happens next."
  - Others: "I understand, but he needs this IV for his fluids. We have to try again." (+2) / "I'm sorry. The last nurse wasn't very experienced with kids. I'm better at this, I promise." (+1)
- Turn 2: "Why can't anyone get it?"
  - **Best (-2):** "He's dehydrated, which makes veins hard to find. I'd like to ask our vascular team to use an ultrasound to find one."
  - Others: "Kids just have small veins, and his are smaller than most. It's nobody's fault, it just happens sometimes." (+1) / "He wouldn't hold still for us. It's very hard to get a vein when a child is moving that much." (+2)
- Turn 3: "He's so scared of you all now."
  - **Best (-2):** "Let's give him a break. Numbing cream first, his tablet and you holding him on your lap. Child life can help too."
  - Others: "He'll forget about it by tomorrow. Kids his age bounce back fast, faster than their parents do." (+2) / "We'll just have to hold him down this time so it's over quickly. It's kinder in the long run." (+2)
- Turn 4: "Okay. Ultrasound. But I'm staying."
  - **Best (-1):** "Of course. You're the person he trusts most. I'll be here too."
  - Others: "Parents usually wait outside for this. It tends to go more smoothly that way." (+2) / "Fine. Just try to stay out of the way." (0)
- Pearl: With frightened parents: apologize for the experience, explain the "why," offer a better plan (ultrasound, numbing, comfort positions), and keep them close.

### [ ] de-ama-cp: Frank Morris, Telemetry, 18:00 (starts at 6/10)
Admitted with chest pain to rule out a heart attack. Second troponin pending. He's getting dressed.

- Turn 1: "I've got a business to run. I'm leaving."
  - **Best (-2):** "Your business matters. Can I tell you what we're waiting for, and then you decide?"
  - Others: "You can't leave, sir. You might be having a heart attack right now, and I can't let you walk out." (+2) / "Okay, it's your right to leave. I'll get the paperwork for you to sign." (+1)
- Turn 2: "The first test was normal. So I'm fine."
  - **Best (-2):** "The first one is often normal early. The second one, in about an hour, is the one that catches it."
  - Others: "Tests can be wrong, so one normal result doesn't really tell us anything about your heart." (+1) / "I'm not a doctor, so I can't say what the tests mean. You'd have to ask her when she's free." (+1)
- Turn 3: "My wife's going to kill me either way."
  - **Best (-2):** "Want to call her? I'll get you a phone, and I'll ask the doctor to come talk to you both."
  - Others: "That's between you and her. It's not my problem, and it's not a reason to leave." (+2) / "Trust me, heart attacks are a lot worse than angry wives. She'd rather have you late than dead." (0)
- Turn 4: "If I stay, can I at least use my laptop?"
  - **Best (-1):** "Yes. I'll find you an outlet and the wifi password."
  - Others: "No, you need to rest. Work stress is the last thing your heart needs right now." (+2) / "Maybe later, once the doctor has seen you." (+1)
- Pearl: Patients can refuse care, but they need the real risk in plain words first. Find what's driving the exit (work, family), meet it, and bring in the provider.

### [ ] de-icu-delirium: Ruth Gallo, ICU, 03:00 (starts at 7/10)
Two days after bowel surgery. She's trying to climb out of bed and pulling at her central line.

- Turn 1: "Let me out! Where am I? Who are you people?"
  - **Best (-1):** Check her oxygen and glucose first.
  - Others: Ask for wrist restraints before she pulls a line. (+3) / "Ruth, calm down. You're fine. Lie back." (+1)
- Turn 2: "I can't breathe right."
  - **Best (-3):** Put her oxygen back on and speak slowly: "Ruth, I'm Kim, your nurse. You're in the hospital after surgery. You're safe."
  - Others: "Your breathing is fine, Ruth. Your numbers look okay to me, so try to relax and stop pulling at things." (+2) / Give the PRN haloperidol so she settles and stops pulling at her lines, then reassess her. (0)
- Turn 3: "Where are my glasses? Everything's blurry."
  - **Best (-2):** Find her glasses and hearing aid, turn on a soft light, and show her the clock.
  - Others: "You don't need them right now. It's the middle of the night and there's nothing to see." (+1) / Turn on the bright overheads so she can see the whole room clearly. (+1)
- Turn 4: "I want my son."
  - **Best (-2):** "Let's call him. He asked us to, any time. And I'll put his photo where you can see it."
  - Others: "It's too late to call. It's three in the morning and he needs his sleep too. We'll try him after breakfast." (+1) / "He'll be here tomorrow. Try to get some sleep so you're rested when he comes." (0)
- Pearl: In delirium, look for a cause first: low oxygen, low glucose, pain, a full bladder. Then reorient, glasses and hearing aids, light, family. Restraints and drugs come last.

### [ ] de-mania: Dev Anand, Adult psych, 22:30 (starts at 7/10)
He's at the nurses' station talking fast and loud, demanding to call his lawyer about his "billion-dollar app."

- Turn 1: "I need a phone RIGHT NOW. Do you know who I am?"
  - **Best (-2):** Speak slowly and quietly: "Dev, I can tell this is important to you. Let's step into the quiet room and figure it out."
  - Others: "Everyone on this unit thinks they're important, Dev. You'll wait for phone hours like everybody else." (+2) / Match his energy to engage him: "A billion dollars? Tell me everything, let's get your lawyer on the line!" (+2)
- Turn 2: "I don't need sleep. I'm on fire tonight."
  - **Best (-1):** "You haven't slept in two nights. Your brain needs it, even when it doesn't feel that way."
  - Others: "It's late and lights out has come and gone. Go to bed now." (+2) / "A billion-dollar app? That sounds amazing. Tell me more about the app and how you came up with it." (+1)
- Turn 3: "Fine, but I need to call my lawyer."
  - **Best (-2):** "Phone hours start at 08:00. I'll write your lawyer's name on the board so it's first on your list."
  - Others: "No calls at night. Those are the rules for everybody, including you." (+2) / "Fine, use my phone, but keep it short and give it right back to me when you're done with your lawyer." (+1)
- Turn 4: "I'm too wired. I can't."
  - **Best (-2):** "Your PRN can help your body slow down. Want to try it, with a dark room and some quiet?"
  - Others: "You'll get a shot if you don't settle down in the next few minutes. It's up to you." (+3) / "Try harder. Lie down, close your eyes and count." (+1)
- Pearl: Mania: low stimulation, short clear sentences, firm and kind limits, and channel the energy. Don't argue with grandiosity, and don't feed it either.

### [ ] de-lateral: Dr. Raines, Med-surg hallway, 08:15 (starts at 7/10)
You called him overnight about a patient's low blood pressure. Now he's shouting at you in the hallway in front of families.

- Turn 1: "Why the hell would you call me at 3 AM for THAT?"
  - **Best (-2):** "I want to talk about this, and I'd like to do it somewhere private. Can we step into the conference room?"
  - Others: "Don't yell at me! I was doing my job, and I won't be spoken to like that in front of the whole unit." (+2) / Apologize for waking him, say it won't happen again, and get back to your patients before it gets worse. (0)
- Turn 2: "His pressure was 88. That's not a crisis."
  - **Best (-2):** "His baseline is 140. 88 with a heart rate of 120 is a change. I was concerned."
  - Others: "I was just following policy. It says to call for a systolic under 90, so I called." (+1) / "You weren't there. You didn't see him. I did." (+2)
- Turn 3: "Nobody told me he was tachy."
  - **Best (-2):** "I may not have said it clearly. Next time I'll start with the trend and the heart rate. What would you want first?"
  - Others: "I did tell you. I said his heart rate was up when I gave you his vitals." (+1) / "Maybe you should listen when nurses call you at night instead of rushing us off the phone every single time." (+2)
- Turn 4: "Fine. But don't page for nonsense."
  - **Best (-1):** "I'll always call when I'm worried about a patient. I'd appreciate it if we kept these talks private."
  - Others: "Okay, I won't. I'll hold the smaller things for morning rounds from now on." (+1) / "I'm reporting you to the chief of medicine. You can't talk to nurses like this and get away with it." (+1)
- Pearl: Disruptive behavior: move it out of public view, stay factual, focus on the patient. Never promise not to call when you're worried. Report the behavior through your chain of command.

### [ ] de-dementia-bath: Mabel Ortiz, Med-surg, 09:00 (starts at 6/10)
Dementia. Incontinent overnight. When the aide brings the washbasin, she swats at her and yells.

- Turn 1: "Get away! I don't know you!"
  - **Best (-2):** Step back, get to eye level and smile: "Good morning, Mabel. I'm Rosa. I'm here to help you feel fresh."
  - Others: "Mabel, you're wet. We have to clean you up now, or your skin will break down." (+2) / Ask a second aide to hold her hands so you can get the wet gown off quickly and be done before she's more upset. (+3)
- Turn 2: "I bathe at night. Always have."
  - **Best (-2):** "Then we'll save the full bath for tonight. Right now, just a warm cloth and a fresh nightgown?"
  - Others: "Hospital baths are in the morning, Mabel. That's when we have the staff to help you." (+2) / Skip care entirely for now and chart that she refused. (0)
- Turn 3: "It's so cold in here."
  - **Best (-2):** Warm the cloths, cover her with a towel, and wash one area at a time.
  - Others: "It's not cold, Mabel. The thermostat says 72 in here, and we're nearly done." (+1) / Hurry through it to get it over with. (+1)
- Turn 4: "My mother used to sing when she did my hair."
  - **Best (-1):** Hum a song while you brush her hair.
  - Others: "Oh, I can't sing. You wouldn't want to hear me try." (0) / "Your mother has passed, Mabel. That was a long time ago." (+2)
- Pearl: Dementia care: approach from the front, slowly, at eye level. Keep their routines when you can, keep them warm and covered, and break care into small steps.

### [ ] de-h-grief **[NCLEX level]**: Carla Diaz, Med-surg, 20:00 (starts at 6/10)
Her father is dying. She snaps at you when you come in to turn him: "Can't you people leave him alone?"

- Turn 1: "Every hour someone comes in and hurts him."
  - **Best (-2):** "It's hard to watch him be moved when he's this frail."
  - Others: "We have to turn him every two hours to prevent pressure sores." (+1) / "I understand exactly how you feel. I went through this with my own father." (+1)
- Turn 2: "Nobody told us it would be this fast."
  - **Best (-2):** "Tell me what you've been told so far."
  - Others: "The doctor should have explained that." (+1) / "Don't worry, he's comfortable. He isn't aware of any of this." (0)
- Turn 3: "Is he in pain? He keeps frowning."
  - **Best (-2):** "Let me check him with you. A frown can mean pain, and we can treat it."
  - Others: "That's just a reflex. People this close to the end of life don't really feel pain the way we do." (+2) / "He's had his scheduled dose. Why do you think he's in pain?" (+1)
- Turn 4: After his medicine he settles. "I don't know what to do now."
  - **Best (-2):** "You can sit close and talk to him. Hearing is often one of the last senses to go."
  - Others: "You've been here all night. You should go home and get some rest." (+1) / "Everything will be okay. You're doing everything right." (+1)
- Pearl: Grief often comes out as anger. Reflect the feeling, find out what they know, treat what you can (pain), and tell them what they can do. Avoid false reassurance and "I know how you feel."

### [ ] de-h-new-dx **[NCLEX level]**: Mark Ellis, Oncology, 16:00 (starts at 5/10)
He learned an hour ago that his cancer has spread. He's staring at the wall and won't take his medicine.

- Turn 1: "What's the point of any of it?"
  - **Best (-2):** "You just got hard news. I'm here. We don't have to talk about medicine right now."
  - Others: "Lots of people live for years with treatment now. You have to stay positive and fight this." (+1) / "I know it's hard, but you need to take your medicine so you stay strong for what's ahead." (+1)
- Turn 2: "I keep thinking about my kids."
  - **Best (-2):** "Tell me about them."
  - Others: "Why are you thinking about that now?" (+2) / "Try not to think about that right now." (+1)
- Turn 3: "Am I going to die soon?"
  - **Best (-2):** "That's an important question. I'll make sure your oncologist sits down with you about it. What have they told you so far?"
  - Others: "Nobody can know that. Every patient is different, and statistics don't tell you about one person." (0) / "Of course not, don't think like that. You've only just started; give the treatment a chance to work first." (+2)
- Turn 4: "I just don't want to feel like this tonight."
  - **Best (-1):** "Are you having any thoughts of hurting yourself?"
  - Others: "Let me get you something to help you sleep. Things feel worse at night." (0) / "Tomorrow will look better. It always does after some sleep." (+1)
- Pearl: After bad news: presence first, then open questions. Don't reassure falsely or dodge. Ask directly about suicide when someone says they don't want to feel this way.

### [ ] de-h-refuse **[NCLEX level]**: Ivy Chen, Adult psych, 09:00 (starts at 6/10)
On a 72-hour hold for psychosis. She refuses her antipsychotic: "It makes me a zombie."

- Turn 1: "I'm not taking it. You can't make me."
  - **Best (-2):** "You're right that you can refuse. Can you tell me what it's been like on it?"
  - Others: "If you don't take it by mouth, the doctor will just order a shot, so you may as well take it now." (+3) / "It's for your own good. You were much sicker before you started it." (+1)
- Turn 2: "Slow. Like my head is full of cotton. I can't think."
  - **Best (-2):** "That sounds miserable. I'll tell your doctor exactly how it feels so the dose or the drug can be looked at."
  - Others: "That's a normal side effect when you first start. It goes away in a few weeks for most people." (+1) / "Everyone feels like that at first. Your body just needs time to get used to the medicine." (+1)
- Turn 3: "And if I still say no?"
  - **Best (-2):** "Then I write down that you refused and why, and your doctor talks with you about other options."
  - Others: "Then you won't get better, and you'll be in here a lot longer than you need to be." (+2) / "Let's not worry about that right now. Let's just take this one dose at a time." (0)
- Turn 4: "Okay. I'll talk to her."
  - **Best (-1):** "I'll ask her to see you this morning. Thanks for telling me what's been happening."
  - Others: "Good. Now take your pill this morning, and you can talk to her about it afterward." (+2) / "Great decision. I knew you'd come around." (0)
- Pearl: Patients on a hold still have the right to refuse medication except in an emergency or by court order. Ask about side effects, advocate, and document the refusal and the reason.

### [ ] de-h-veteran **[NCLEX level]**: Ray Ortiz, ICU step-down, 02:30 (starts at 7/10)
A veteran recovering from surgery. A tray crashed in the hall. Now he's out of bed, breathing fast, eyes darting.

- Turn 1: "Where am I? Get down!"
  - **Best (-2):** From a few feet away, calmly: "Ray, it's Dana, your nurse. You're in the hospital. You're safe."
  - Others: Put a hand on his shoulder to ground him and say his name firmly: "Ray. Look at me." (+2) / "It's just a tray. Nothing's wrong. Get back in bed." (+1)
- Turn 2: "I heard it. It was right there."
  - **Best (-2):** "A tray fell in the hall. It was loud. You're in room 6, and it's 2:30 in the morning."
  - Others: "Are you having a flashback? Is this about the war? Tell me what you're seeing right now." (0) / "You're overreacting. It was only a tray." (+3)
- Turn 3: Breathing hard. "I can't slow down."
  - **Best (-2):** "Breathe with me: in for four, out for six. Feel your feet on the floor."
  - Others: "Just relax. Nothing here can hurt you, so there's no reason to breathe like that." (+1) / "Let me get you something to calm you down. You have lorazepam ordered." (0)
- Turn 4: "Sorry. That happens."
  - **Best (-2):** "No need to be sorry. Would it help to keep the door closed and a light on at night?"
  - Others: "It's okay, everybody gets scared sometimes. It's nothing to be embarrassed about." (0) / "Why didn't you tell us about your PTSD when you were admitted?" (+2)
- Pearl: Trauma responses: keep your distance, say who you are and where they are, avoid touching without asking, ground with breath and senses, then adjust the environment.

### [ ] de-h-teen-od **[NCLEX level]**: Riley, Pediatrics, 10:00 (starts at 6/10)
Admitted after an acetaminophen overdose. Medically stable now. She glares when you come in: "I don't want to talk."

- Turn 1: "I don't want to talk."
  - **Best (-2):** "That's okay. I'm going to sit here for a few minutes while I check your IV."
  - Others: "You'll have to talk to someone eventually. The psychiatrist won't clear you until you do." (+2) / "Okay. Can you at least tell me why you did it?" (+2)
- Turn 2: "My mom's acting like I ruined her life."
  - **Best (-2):** "It sounds like you're feeling blamed."
  - Others: "I'm sure she's just worried about you." (+1) / "Your mom loves you." (+1)
- Turn 3: "Are you going to tell her what I say?"
  - **Best (-2):** "Most of what you tell me stays between us and your care team. If you're in danger, I can't keep that private, and I'd tell you first."
  - Others: "No, everything you say to me is confidential. I won't repeat a word of it to your mom or anyone else." (+1) / "You're a minor, so your mom has a right to know everything you tell us while you're here." (+2)
- Turn 4: "I still kind of want to die."
  - **Best (-1):** "Thank you for telling me. Do you have a plan for how?"
  - Others: "You don't mean that. You're just exhausted and upset." (+2) / "You're so young. You have so much to live for, and so many people who love you." (+1)
- Pearl: With teens: presence before questions, reflect feelings, and be honest about confidentiality limits. Ask directly about suicide and a plan; it doesn't plant the idea.

### [ ] de-h-son-ama **[NCLEX level]**: Victor Hale, Med-surg, 17:30 (starts at 6/10)
His mother, 83, has pneumonia and is confused today. He's packing her bag. "I'm taking her home. You people aren't helping."

- Turn 1: "She was fine before she came here."
  - **Best (-2):** "Seeing her this confused is frightening. Can you tell me what she's usually like at home?"
  - Others: "She's confused because of the infection, not because of anything we've done. This is very common at her age." (+1) / "Sir, please calm down. I can't help you or your mother when you're raising your voice." (+2)
- Turn 2: "Sharp. She does her own bills."
  - **Best (-2):** "That's really helpful. A sudden change like this is called delirium. It often improves as the infection is treated."
  - Others: "Older people often get confused in the hospital. It's the new surroundings and the broken sleep." (0) / "She'll be fine. Once the antibiotics kick in she'll be back to herself." (+1)
- Turn 3: "So what am I supposed to do? Just watch?"
  - **Best (-2):** "You can help a lot: her glasses and hearing aids, photos, talking about home, being here at night if you can."
  - Others: "The best thing is to let the staff handle it. She needs rest more than visitors right now." (+1) / "If you take her home like this, she could die. I need you to understand that." (+1)
- Turn 4: "Can I talk to her doctor?"
  - **Best (-1):** "Yes. I'll page her now and stay with you until she calls."
  - Others: "The doctor's very busy tonight. She has thirty patients." (+2) / "Maybe tomorrow on rounds. They usually come by around nine." (+1)
- Pearl: Families who want to leave: acknowledge the fear, use what they know about the patient, explain in plain words, give them a role, and get the provider involved. Scare tactics backfire.
