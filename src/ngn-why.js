/* The Shift — per-option rationales for the practice items in ngn.js, keyed by item id.
   bowtie: cond/actions/params; sata: opts; highlight: parts; cloze: blanks (one list per blank); every item: tip.
   Each line starts "Yes:" (keyed correct) or "No:". Written for clinical review alongside the items. */
window.Shift = window.Shift || {};
window.Shift.ngnWhy = {
 "ms1-bow": {
  "cond": [
   "Yes: A known infection plus new confusion, fever, tachycardia, tachypnea, soft BP and low urine output shows infection driving organ hypoperfusion; that is sepsis until proven otherwise.",
   "No: Confusion in an older adult tempts you to blame dementia, but dementia is chronic and gradual; acute confusion with abnormal vital signs is delirium from an acute cause.",
   "No: Dehydration can explain low urine output and a fast heart rate, but not the fever with a known infection; calling it dehydration alone delays cultures and antibiotics.",
   "No: Stroke causes sudden neuro changes, but global confusion with fever and no focal deficits points to a systemic infection, not a focal brain lesion."
  ],
  "actions": [
   "Yes: Cultures drawn before the first dose identify the organism without antibiotic interference, and every hour of antibiotic delay raises sepsis mortality, so draw and then give promptly.",
   "Yes: Soft BP and low urine output mean poor perfusion; IV crystalloid restores circulating volume and organ perfusion while the antibiotic takes effect.",
   "No: Haloperidol sedates confusion that is actually a perfusion warning sign; it masks the cause and can worsen hypotension and fall risk in an older adult.",
   "No: Restraints treat the behavior, not the sepsis, and raise the risk of injury and worsening delirium; they are a last resort, never a first response to new confusion.",
   "No: Oral fluids sound safe, but a confused, hypotensive client cannot drink enough fast enough, and waiting 4 hours lets sepsis progress toward septic shock."
  ],
  "params": [
   "Yes: Lactate reflects tissue hypoperfusion; a level that falls on repeat shows resuscitation is working, and one that stays high signals worsening shock.",
   "Yes: MAP shows whether organs are being perfused; the usual sepsis target is 65 mm Hg or higher, and a falling MAP despite fluids means vasopressors may be needed.",
   "No: A1c reflects average glucose over about 3 months; it is useful for diabetes care but tells you nothing about sepsis or the response to treatment today.",
   "No: Albumin changes slowly and reflects nutrition and chronic illness; it does not guide acute sepsis resuscitation.",
   "No: Thyroid disease can cause confusion, which makes this tempting, but TSH does not track sepsis or the response to fluids and antibiotics."
  ],
  "tip": "When an older adult with a known infection has new confusion plus abnormal vital signs, think sepsis first; options that sedate, restrain or wait treat the symptom and are the traps."
 },
 "ms1-mat": {
  "tip": "For give-or-hold matrices, compare each vital sign or lab against the exact hold parameter written in the order; replacing a low electrolyte or continuing an anticoagulant without bleeding is usually the safe choice."
 },
 "ms1-sata": {
  "opts": [
   "Yes: Incentive spirometry promotes sustained deep breaths that re-expand collapsed alveoli; 10 times an hour while awake is the standard post-op teaching.",
   "Yes: Splinting the incision with a pillow reduces pain during coughing, so he can cough effectively and clear secretions that would otherwise plug small airways.",
   "Yes: Early ambulation increases tidal volume and mobilizes secretions; it also lowers the risk of VTE and ileus after abdominal surgery.",
   "Yes: Pain of 7/10 and splinting mean he is breathing shallowly to avoid pain; premedicating makes deep breathing, coughing and walking possible.",
   "No: Early post-op fever is often linked to atelectasis, so bed rest worsens the very problem causing concern; immobility promotes shallow breathing and pooled secretions.",
   "No: Withholding opioids may seem to protect breathing, but uncontrolled incisional pain causes splinting and shallow breaths; the goal is safe pain control with sedation monitoring."
  ],
  "tip": "For prevention questions, pick actions that directly expand the lungs or make expansion possible; distractors usually restrict activity or undertreat pain, and both cause shallow breathing."
 },
 "ms2-bow": {
  "cond": [
   "Yes: Potassium of 6.6 with peaked T waves and a slowing heart rate in advanced CKD means potassium is now affecting cardiac conduction, which can progress to fatal arrhythmias.",
   "No: CKD does cause hypocalcemia, a tempting link, but low calcium shows a prolonged QT interval and signs of tetany, not peaked T waves.",
   "No: Digoxin toxicity can cause bradycardia and arrhythmias, but nothing suggests she takes it, and the measured potassium of 6.6 explains the ECG.",
   "No: Dehydration can concentrate potassium, but it is not the condition endangering her; the priority problem is the potassium's effect on the heart."
  ],
  "actions": [
   "Yes: IV calcium stabilizes the cardiac cell membrane within minutes and protects against arrhythmias; it does not lower potassium, so other therapy is given alongside it.",
   "Yes: Insulin shifts potassium into cells quickly; dextrose is given with it to prevent hypoglycemia, which is more likely in CKD because insulin clears slowly.",
   "No: Spironolactone is a potassium-sparing diuretic that raises potassium; a student may pick it because diuretics can remove potassium, but this one would worsen the problem.",
   "No: Orange juice and bananas are high in potassium; they are taught for hypokalemia and would add to an already dangerous level.",
   "No: Telemetry is exactly what catches the arrhythmias hyperkalemia causes; pausing it removes the key safety monitor during the highest-risk period."
  ],
  "params": [
   "Yes: Continuous rhythm monitoring shows whether the peaked T waves resolve and catches a widening QRS, worsening bradycardia or ventricular arrhythmias early.",
   "Yes: Insulin can cause hypoglycemia for hours after the dose, and reduced kidney clearance in CKD prolongs that risk, so recheck glucose on schedule.",
   "No: Sodium matters in kidney disease, but it is not the problem being treated and does not show whether the potassium emergency is resolving.",
   "No: Platelets are unrelated to hyperkalemia or its treatment; nothing in the scenario points to bleeding or clotting risk.",
   "No: Specific gravity reflects urine concentration and hydration; in stage 4 CKD it is unreliable and does not track potassium or cardiac risk."
  ],
  "tip": "In electrolyte emergencies, rank actions as protect the heart first, then shift or remove the electrolyte; distractors often include foods or drugs that worsen the imbalance."
 },
 "ms2-hl": {
  "parts": [
   "Yes: Tripling the oxygen in a known CO2 retainer is a red flag; high oxygen can raise CO2 by blunting respiratory drive and worsening ventilation-perfusion mismatch.",
   "Yes: 97% is above her target of 88 to 92%; in COPD a high saturation can mean too much oxygen, so titrate down and assess her CO2.",
   "Yes: New difficulty rousing is a change in level of consciousness consistent with rising CO2; it needs immediate assessment and likely a blood gas.",
   "No: Pursed-lip breathing is a compensatory technique COPD clients use to keep airways open longer; it is expected baseline behavior.",
   "No: A barrel chest reflects chronic air trapping and hyperinflation; it is a long-standing finding, not an acute change.",
   "No: Eating half a meal is common during an exacerbation because of dyspnea and fatigue; it is worth noting but not urgent."
  ],
  "tip": "Separate chronic baseline findings from new changes; in COPD, a saturation above target paired with new sleepiness is a warning, not reassurance."
 },
 "ms2-mat": {
  "tip": "Before any on-call-to-the-OR order, check every drug against the allergy band, including drugs whose names hide their class, and confirm pre-op requirements such as pregnancy status."
 },
 "ms3-bow": {
  "cond": [
   "Yes: Sudden one-sided facial droop, arm drift and slurred speech are focal deficits; with a normal glucose, ischemic stroke is the working diagnosis until imaging rules out bleeding.",
   "No: Hypoglycemia can mimic stroke, which is why glucose is checked first, but a glucose of 142 rules it out here.",
   "No: Bell's palsy affects only the face, including the forehead; it does not cause arm drift or slurred speech.",
   "No: Delirium from infection causes global, fluctuating confusion, not new one-sided weakness; blaming the pneumonia would waste the treatment window."
  ],
  "actions": [
   "Yes: Last known well was 21:00, so he may still be within the thrombolytic window; a stroke alert brings rapid imaging and the stroke team now.",
   "Yes: Dysphagia is common after stroke and raises aspiration risk, already a concern with pneumonia; nothing by mouth, including medicines, until he passes a swallow screen.",
   "No: Aspirin is tempting because it treats clots, but it cannot be given before imaging rules out hemorrhage, and nothing goes by mouth before a swallow screen.",
   "No: Rapid BP lowering reduces blood flow to at-risk brain tissue; BP is lowered only to under 185/110 if a thrombolytic is planned, not to normal.",
   "No: Waiting to see if symptoms resolve uses up the treatment window; even symptoms that improve need emergency evaluation."
  ],
  "params": [
   "Yes: Serial NIH Stroke Scale scores detect worsening or improvement objectively and are required before and after any thrombolytic.",
   "Yes: BP must stay under 185/110 before a thrombolytic and under 180/105 afterward to limit bleeding risk, while too low a pressure worsens ischemia.",
   "No: Daily weight tracks fluid balance in heart failure or kidney disease; it does not reflect acute stroke changes.",
   "No: Lipase is a marker for pancreatitis and has no role in stroke monitoring.",
   "No: A1c is a long-term diabetes marker; it may matter for secondary prevention later but does not guide acute stroke care."
  ],
  "tip": "With sudden focal deficits, time is the priority cue: find the last known well time, and reject any option that waits, gives oral medication first, or drops the BP to normal."
 },
 "ms3-sata": {
  "opts": [
   "Yes: POSS 3 means frequently drowsy and drifting off mid-conversation; sedation comes before respiratory depression, so this is the early warning to stop the opioid and monitor closely.",
   "Yes: A respiratory rate under 10 is a classic sign of opioid-induced respiratory depression; stimulate her, stop the PCA and anticipate naloxone.",
   "Yes: Snoring with pauses signals airway obstruction and apnea during opioid-induced sleep, a dangerous sign even when pulse oximetry still looks acceptable.",
   "No: Moderate pain when awake shows the opioid is not over-treating her; it is not a sign of respiratory depression.",
   "No: Nausea is a common opioid side effect, so students link it to overdose, but it does not indicate depressed breathing.",
   "Yes: Pinpoint pupils show strong opioid effect on the brainstem; together with sedation and slow breathing, they point to opioid excess rather than another cause."
  ],
  "tip": "Remember the sequence: sedation comes before respiratory depression; choose findings that reflect central nervous system and breathing changes, and skip common side effects like nausea."
 },
 "ms3-cloze": {
  "blanks": [
   [
    "Yes: DKA is resolved when the ketoacidosis clears (anion gap closed, ketones down), not when the glucose normalizes, so the drip continues until then.",
    "No: Glucose usually falls well before the acidosis resolves; stopping insulin at a glucose target leaves ketoacidosis untreated, so dextrose is added instead of stopping insulin.",
    "No: Potassium guides replacement and the safety of starting insulin, but a potassium over 5 is not the endpoint of DKA treatment."
   ],
   [
    "Yes: Subcutaneous basal insulin needs time to absorb; overlapping it about 2 hours with the drip prevents a gap in insulin that lets ketoacidosis return.",
    "No: Ten minutes is too little time for subcutaneous insulin to be absorbed, so the client would be left briefly with no effective insulin.",
    "No: A full day of both insulins is unnecessary and raises hypoglycemia risk; the standard overlap is a couple of hours, not 24."
   ],
   [
    "Yes: Insulin drives potassium into cells; starting or continuing it with potassium under 3.5 can drop the level enough to cause dangerous arrhythmias, so replace potassium first.",
    "No: Over 5.0 is when potassium replacement is held, not insulin; insulin is still needed and will lower the potassium.",
    "No: Between 4 and 5 is a safe range to continue insulin with potassium added to the fluids; nothing needs to be held."
   ]
  ],
  "tip": "In DKA, follow the acidosis rather than the glucose, and remember insulin drives potassium into cells; any question about holding insulin is really about a low potassium."
 },
 "sd-bow": {
  "cond": [
   "Yes: New back pain with a rising heart rate and falling BP hours after femoral access is the classic picture of a retroperitoneal bleed, which can occur with a clean groin site.",
   "No: Back discomfort from lying flat is common after a cath, which makes this tempting, but it does not cause tachycardia and a falling BP.",
   "No: Stent thrombosis causes chest pain and ST changes from coronary occlusion, not back pain with signs of blood loss.",
   "No: PE causes sudden dyspnea, pleuritic chest pain and hypoxia; this client has back pain and hemodynamic changes that point to bleeding."
  ],
  "actions": [
   "Yes: A suspected retroperitoneal bleed needs prompt provider evaluation; CT of the abdomen and pelvis confirms the bleed and its size.",
   "Yes: Lying flat limits stress on the arterial puncture, and a second large-bore IV prepares for rapid fluids or blood if he becomes unstable.",
   "No: Morphine treats the pain but can lower the BP further and mask worsening; waiting 2 hours delays treatment of a possible hemorrhage.",
   "No: Sitting up flexes the hip and stresses the femoral puncture, which can worsen bleeding; it treats the symptom, not the cause.",
   "No: Stopping antiplatelets after a fresh stent risks stent thrombosis, so that decision belongs to the cardiologist; the nurse reports and advocates rather than acting alone."
  ],
  "params": [
   "Yes: Trending HR and BP shows whether bleeding continues; a rising heart rate with a falling pressure signals worsening hypovolemia and possible shock.",
   "Yes: Serial hemoglobin shows ongoing blood loss and guides transfusion, though the drop can lag behind acute bleeding.",
   "No: The groin is tempting to watch, but a retroperitoneal bleed tracks into the back of the abdomen without a visible hematoma, so a clean site is falsely reassuring.",
   "No: Glucose is not affected by bleeding and does not reflect this complication.",
   "No: Troponin tracks myocardial injury; nothing suggests a new coronary event, and it would not show the course of a bleed."
  ],
  "tip": "After femoral access, back or flank pain plus a rising heart rate is a bleed until proven otherwise; options that watch only the visible site or treat only the pain are the traps."
 },
 "sd-mat": {
  "tip": "In HIT, think clotting, not bleeding: stop every source of heparin, start a non-heparin anticoagulant, and avoid anything that adds clot risk, such as platelets or early warfarin."
 },
 "sd-sata": {
  "opts": [
   "Yes: Low potassium prolongs ventricular repolarization and the QT; replacing it per the protocol directly lowers torsades risk and is within the nurse's scope here.",
   "Yes: Low magnesium prolongs the QT and makes potassium hard to correct; magnesium also stabilizes the myocardium and is first-line treatment for torsades itself.",
   "Yes: Citalopram prolongs the QT in a dose-dependent way, and the FDA advises no more than 20 mg daily over age 60; changing therapy needs the provider, so notify.",
   "No: Treating nausea seems kind, but ondansetron also prolongs the QT; adding another QT-prolonging drug raises torsades risk, so ask for an alternative.",
   "No: Furosemide wastes potassium and magnesium, lowering already low levels; giving it as scheduled without discussing it with the provider increases the risk.",
   "No: Frequent alarms in a client with a long QT may be ectopy or runs of torsades; calling them artifact without assessing the client is a classic alarm-fatigue error."
  ],
  "tip": "For QT prolongation, sort each option into lengthens the QT or corrects it: replace electrolytes, remove offending drugs, and never dismiss alarms without assessing the client."
 },
 "ed-bow": {
  "cond": [
   "Yes: ST elevation in II, III and aVF localizes an inferior STEMI, and ST elevation in V4R confirms right ventricular involvement, which fits the soft BP and slow rate.",
   "No: The early complaint of indigestion is the trap; women and people with diabetes often have atypical MI symptoms, and the ECG now shows a STEMI.",
   "No: Anterior STEMI shows elevation in the precordial leads such as V1 to V4, not II, III and aVF, and nothing here suggests heart failure.",
   "No: PE can cause tachycardia, hypoxia and right heart strain, but not localized ST elevation in the inferior leads with V4R elevation."
  ],
  "actions": [
   "Yes: Time to reperfusion drives outcome in STEMI; the ECG alone is enough to activate the cath lab without waiting for labs.",
   "Yes: Chewed aspirin is absorbed quickly and inhibits platelet aggregation, limiting clot growth; it is given early in suspected acute coronary syndrome unless contraindicated.",
   "No: Nitroglycerin is routine chest pain care, which makes it tempting, but in RV infarction it reduces preload and can cause severe hypotension.",
   "No: Furosemide treats fluid overload; the preload-dependent right ventricle needs volume, and diuresis could crash the BP.",
   "No: Troponin rises hours after injury; ST elevation already makes the diagnosis, and waiting delays reperfusion while heart muscle dies."
  ],
  "params": [
   "Yes: RV infarction makes the BP preload dependent and fragile; trending it guides fluid therapy and warns of cardiogenic shock.",
   "Yes: The right coronary artery often supplies the SA and AV nodes, so inferior MIs commonly cause bradycardia and heart block, already hinted at by HR 58.",
   "No: She has diabetes, so glucose matters, but hourly checks are not a priority parameter for an inferior STEMI with RV involvement.",
   "No: Specific gravity reflects urine concentration and does not track cardiac perfusion or rhythm in an acute MI.",
   "No: Peak flow measures airway obstruction in asthma and has no role in monitoring an MI."
  ],
  "tip": "Let the ECG leads drive the answer: inferior leads plus V4R mean right ventricular involvement, so eliminate any option that lowers preload, such as nitrates or diuretics."
 },
 "ed-hl": {
  "parts": [
   "No: The time he was found is tempting, but the thrombolytic window is measured from last known well, not from discovery, so 14:30 does not set the clock.",
   "Yes: Last known well at 10:00 starts the clock; the standard 4.5-hour IV thrombolytic window closed at 14:30, before he arrived.",
   "Yes: BP above 185/110 must be lowered and kept below that level before a thrombolytic can be given, because higher pressure raises the risk of intracranial hemorrhage.",
   "No: Glucose is checked to rule out a stroke mimic and extreme values; 142 is acceptable and does not change eligibility.",
   "No: A CT without hemorrhage is a required finding before a thrombolytic; it permits treatment rather than excluding it.",
   "No: Lisinopril and atorvastatin do not raise bleeding risk; anticoagulants would matter, but these routine medicines do not change eligibility.",
   "No: Arrival time matters for door-to-needle goals, but the window had already closed at 14:30, so arriving at 14:52 is not what excludes him."
  ],
  "tip": "For thrombolytic eligibility, anchor on last known well rather than time found or time of arrival, and check BP against 185/110; normal findings like a clean CT support treatment."
 },
 "ed-sata": {
  "opts": [
   "Yes: IM epinephrine in the anterolateral thigh is first-line for anaphylaxis; it reverses airway swelling, bronchospasm and vasodilation, and 0.5 mg is the adult single dose.",
   "Yes: Supine with legs elevated improves venous return in shock, and high-flow oxygen supports oxygenation; a client in severe respiratory distress may sit up, but must not stand.",
   "Yes: Anaphylaxis causes widespread vasodilation and capillary leak; a crystalloid bolus restores circulating volume for a BP of 84/50.",
   "No: The dose looks right but the route and concentration are dangerous; undiluted 1 mg/mL epinephrine by IV push can cause arrhythmias, severe hypertension and MI.",
   "No: Antihistamines relieve itching and hives but do not reverse airway swelling or shock; waiting delays epinephrine, the only drug that treats the emergency.",
   "Yes: Symptoms can persist or recur, so IM epinephrine is repeated every 5 to 15 minutes as needed while monitoring for a biphasic reaction."
  ],
  "tip": "In anaphylaxis, IM epinephrine comes first; watch for distractors that use the right drug by the wrong route or concentration, or that rely on antihistamines."
 },
 "p3-bow": {
  "cond": [
   "Yes: A level of 2.1 with coarse tremor, GI losses and new confusion is moderate lithium toxicity, and a thiazide plus an NSAID both reduce renal lithium clearance.",
   "No: Serotonin syndrome also causes tremor and diarrhea, which is the trap, but it follows serotonergic drugs and brings clonus, hyperthermia and agitation; nothing here is serotonergic and the lithium level explains everything.",
   "No: NMS follows antipsychotics and presents with lead-pipe rigidity, high fever and autonomic instability. A coarse tremor with a high lithium level and recent interacting drugs points elsewhere.",
   "No: Diarrhea alone could suggest a stomach bug, but gastroenteritis does not explain the confusion or a level of 2.1. Diarrhea is a symptom of toxicity and also worsens it through dehydration."
  ],
  "actions": [
   "Yes: Every further dose raises a level that is already toxic. Holding is within nursing judgment, and the provider must know now to address the thiazide, the NSAID and the level.",
   "Yes: Moderate toxicity with confusion needs medical care for IV isotonic fluids, labs and possible dialysis; a psych unit cannot safely manage it alone.",
   "No: Giving the scheduled dose with food treats lithium as routine, which is the trap. Food reduces GI upset but does nothing about a toxic level and adds more drug.",
   "No: Restricting salt sounds heart-healthy, but low sodium makes the kidneys retain lithium and drives the level higher. Patients on lithium need steady sodium and fluid intake.",
   "No: Treating the diarrhea symptomatically misses that it is a sign of toxicity, and waiting until tomorrow lets neurologic damage progress."
  ],
  "params": [
   "Yes: Serial levels show whether fluids, held doses and stopping the interacting drugs are bringing lithium back toward the therapeutic range.",
   "Yes: Confusion is the sign of neurotoxicity; worsening mental status, ataxia or seizures would signal severe toxicity needing escalation such as dialysis.",
   "No: Weight gain matters for long-term lithium therapy, so it is a familiar choice, but it does not track an acute toxic episode.",
   "No: Lipids are monitored for second-generation antipsychotics, not lithium, and they say nothing about acute toxicity.",
   "No: The AIMS screens for tardive dyskinesia from antipsychotics; it is a long-term movement screen, not a measure of lithium toxicity."
  ],
  "tip": "When a stem lists new medications next to a narrow-therapeutic-index drug, look for the interaction; here thiazides and NSAIDs raise lithium, and the distractors are syndromes that share one or two symptoms."
 },
 "p3-hl": {
  "parts": [
   "Yes: A sudden brightening after a severe depression can mean the patient has made a decision to die and now has the energy to act on it.",
   "Yes: Giving away possessions is a classic behavioral warning sign of suicide planning and warrants a direct suicide assessment.",
   "Yes: A statement of sudden resolve can signal a settled plan. Ask directly whether he is thinking of killing himself rather than assuming it means recovery.",
   "No: Eating well is a reassuring sign of improving self-care and does not by itself suggest increased risk.",
   "Yes: Pushing for discharge right after a sudden mood lift may reflect a wish to leave supervision to carry out a plan; the team needs a full risk reassessment first.",
   "No: Attending group shows engagement in treatment and is an expected, positive behavior on day 4."
  ],
  "tip": "In suicide-risk items, ask which findings are sudden changes from the patient's pattern; healthy routine behaviors are the distractors, and a rapid improvement is a cue, not a relief."
 },
 "p3-mat": {
  "tip": "For agitation items, rank each intervention from least to most restrictive and check whether there is imminent danger; without a threat or harm, only the least restrictive options are appropriate."
 },
 "p4-bow": {
  "cond": [
   "Yes: Torticollis, oculogyric crisis and trismus within hours of a first dose of a high-potency antipsychotic in a young male is the textbook acute dystonic reaction.",
   "No: Staff framing it as attention-seeking is the trap. Sustained involuntary muscle spasms after haloperidol are a medication emergency, and labeling them behavioral delays treatment.",
   "No: NMS involves generalized rigidity, high fever, altered consciousness and unstable vitals, and usually develops over days, not focal spasms an hour after a dose.",
   "No: Tardive dyskinesia is also a movement disorder, but it develops after months to years of exposure and causes repetitive movements, not acute sustained spasms."
  ],
  "actions": [
   "Yes: An anticholinergic such as diphenhydramine or benztropine restores the dopamine and acetylcholine balance and usually relieves the spasm within minutes.",
   "Yes: Laryngeal dystonia can close the airway, so stridor, drooling or trouble swallowing take priority under the ABCs.",
   "No: More haloperidol is the cause of the reaction, so another dose would worsen it; this is the trap if the movements are misread as agitation.",
   "No: Seclusion treats an involuntary drug reaction as dangerous behavior, violates the least restrictive principle, and removes him from observation while his airway is at risk.",
   "No: He cannot voluntarily relax a dystonic muscle; the instruction blames him and delays the medication that actually works."
  ],
  "params": [
   "Yes: Throat and tongue involvement can compromise breathing and swallowing, so airway status is the priority assessment until the spasm resolves.",
   "Yes: The anticholinergic can wear off before the haloperidol does, so spasms may return and a scheduled dose may be needed.",
   "No: Lithium levels matter for patients on lithium; he received haloperidol, so this is an unrelated lab.",
   "No: Blood glucose is monitored with second-generation antipsychotics over time and is not relevant to an acute dystonic reaction.",
   "No: Weight gain is a long-term antipsychotic concern, not a parameter for an acute movement reaction."
  ],
  "tip": "Match the timing to the syndrome: hours after a first dose is acute dystonia, days to weeks is akathisia or parkinsonism, months to years is tardive dyskinesia; and an airway option is almost always one of the actions."
 },
 "p4-cloze": {
  "blanks": [
   [
    "Yes: Hypophosphatemia below the ordered threshold needs prompt replacement because low phosphorus can cause cardiac arrhythmias, heart failure, respiratory muscle weakness and seizures.",
    "No: Holding meals seems logical because feeding drives phosphorus into cells, but stopping nutrition reinforces the eating disorder. The standard is to replace electrolytes and keep feeding.",
    "No: A laxative does nothing for phosphorus and is a common misuse behavior in anorexia; it could also worsen electrolyte losses."
   ],
   [
    "Yes: Electrolyte shifts are greatest in roughly the first week as insulin rises and phosphorus, potassium and magnesium move into cells, so labs are checked frequently then.",
    "No: Risk does not end after the first day; shifts continue over the first several days, so monitoring only on day one would miss most cases.",
    "No: By a month the acute shift risk has largely passed; waiting that long describes neither the peak nor the monitoring period."
   ],
   [
    "Yes: The hour after meals is when purging, hidden exercise or other compensatory behaviors are most likely, so supervision continues through it.",
    "No: Daily weights are part of care, but they do not prevent purging or exercise right after a meal, which is what supervision targets.",
    "No: Compensatory behaviors can follow any meal or snack, so supervising only dinner leaves most meals unprotected."
   ]
  ],
  "tip": "In refeeding items, any option that stops or delays nutrition is a distractor; the safe answer corrects the lab and continues feeding."
 },
 "p4-sata": {
  "opts": [
   "Yes: Believing her and affirming it is not her fault is therapeutic, reduces shame and makes further disclosure and safety planning possible.",
   "Yes: In California each mandated reporter has a personal duty to report suspected child abuse; telling a supervisor or relying on someone else does not satisfy it.",
   "Yes: The person she named is on tonight's list, so protecting her from contact before visiting hours is an immediate safety need.",
   "No: Promising secrecy may seem to build trust, but the nurse must report, so the promise would be broken and damage trust later.",
   "No: Thorough questions seem helpful, but detailed or leading questioning can contaminate a forensic interview; the nurse gathers only enough to report.",
   "No: Confronting family may seem like clarifying, but it can alert the abuser, pressure the teen to recant and put her at risk; investigation belongs to child protective services and police.",
   "Yes: Quoting her exact words, without interpretation, creates an accurate record for the report and any investigation and avoids putting words in her mouth."
  ],
  "tip": "For abuse disclosures, follow believe, report, protect, document; options that promise confidentiality, investigate or confront family are the usual distractors."
 },
 "ob-bow": {
  "cond": [
   "Yes: A boggy, high fundus with heavy bleeding and rising heart rate after a long oxytocin induction and a macrosomic baby points to atony, worsened by a full bladder.",
   "No: Retained fragments can cause hemorrhage, but a boggy uterus displaced by an unemptied bladder after classic atony risk factors fits atony; the word only makes it too narrow.",
   "No: Rubra lochia is expected, which is the trap, but saturating a pad in 30 minutes with a boggy fundus and tachycardia is excessive bleeding, not normal flow.",
   "No: Amniotic fluid embolism presents with sudden respiratory distress, hypotension, hypoxia and coagulopathy, usually during or right after birth, not a boggy fundus with steady bleeding."
  ],
  "actions": [
   "Yes: Fundal massage stimulates the myometrium to contract and compress bleeding vessels; supporting the lower segment prevents uterine inversion.",
   "Yes: A distended bladder pushes the uterus up and to the side and prevents contraction; emptying it often firms the fundus quickly.",
   "No: Carboprost is a second-line uterotonic, so it can look correct, but it causes bronchospasm and is contraindicated in asthma; also massage and bladder emptying come first.",
   "No: Rest and recheck delays care during active hemorrhage; her heart rate is already rising, a sign of compensation before blood pressure falls.",
   "No: Perineal ice treats swelling and pain from perineal trauma; it does nothing for uterine bleeding."
  ],
  "params": [
   "Yes: Weighing pads and linens gives quantitative blood loss, which is more accurate than visual estimates and guides escalation.",
   "Yes: Trending firmness, height and midline position shows whether massage and bladder emptying are working or atony is recurring.",
   "No: Blood glucose matters for the macrosomic newborn and diabetic mothers, but it does not track her hemorrhage.",
   "No: Deep tendon reflexes are monitored for magnesium therapy, not postpartum hemorrhage.",
   "No: Specific gravity reflects hydration and is not a meaningful real-time measure of bleeding or uterine tone."
  ],
  "tip": "With a boggy, displaced fundus, the first actions are hands-on nursing measures (massage, empty the bladder) before medications, and always check a uterotonic against the client's history."
 },
 "ob-mat": {
  "tip": "Sort magnesium findings into expected side effects (flushing, warmth, mild drowsiness) versus toxicity in order (lost reflexes, slowed breathing, then cardiac effects), and treat low urine output as a warning that the level will rise."
 },
 "ob-cloze": {
  "blanks": [
   [
    "Yes: The gel dose is 0.5 mL/kg, and 0.5 mL times 4.45 kg is about 2.2 mL.",
    "No: 0.5 mL is the per-kilogram dose, a trap for anyone who forgets to multiply by the weight; it would underdose this baby.",
    "No: 4.5 mL comes from using the weight itself as the volume, giving about double the correct 0.5 mL/kg dose."
   ],
   [
    "Yes: Gel raises glucose only briefly; feeding supplies sustained carbohydrate and is part of standard management for asymptomatic hypoglycemia.",
    "No: Keeping him NPO removes the main source of glucose and would let the level fall again once the gel wears off.",
    "No: IV dextrose is for symptomatic newborns or those who do not respond to gel and feeding; an asymptomatic baby starts with gel and a feed."
   ],
   [
    "Yes: Rechecking within about an hour of the gel and feed shows whether the intervention worked and decides whether to repeat it or escalate.",
    "No: Four hours is too long to wait after treating a low glucose; a persistent low could cause neurologic injury in that time.",
    "No: Ten minutes is too soon for the gel and feeding to take full effect, so the result would not reflect the response."
   ],
   [
    "Yes: Jitteriness, lethargy, poor feeding, apnea or seizures signal symptomatic hypoglycemia, which needs IV dextrose and immediate provider notification.",
    "No: Pink and alert describes a well newborn, a reassuring finding, not a reason to call.",
    "No: Hunger is a normal newborn cue to feed, not a sign of worsening hypoglycemia."
   ]
  ],
  "tip": "For weight-based newborn doses, multiply the per-kg dose by the weight in kg and watch for distractors that use the per-kg number or the weight itself as the answer."
 },
 "pd-bow": {
  "cond": [
   "Yes: A silent chest with high respiratory rate, deep retractions, falling saturation and speaking only two words means air movement is failing, signaling impending respiratory failure.",
   "No: Loss of wheezing looks like improvement, which is the trap, but with worsening work of breathing and saturation it means too little air is moving to make sound.",
   "No: Anxiety can raise respiratory rate, but it does not cause retractions, hypoxemia or a silent chest in a child with known asthma.",
   "No: A foreign body can cause sudden distress, but this child has a known exacerbation that progressed from wheezing to a silent chest, which fits worsening asthma."
  ],
  "actions": [
   "Yes: Continuous bronchodilator and oxygen treat bronchospasm and hypoxemia directly while help arrives.",
   "Yes: She is unstable and may need escalation such as magnesium, ventilatory support or ICU care, so a rapid response brings that team now.",
   "No: Sleep may seem like relief, but drowsiness here can signal fatigue and CO2 retention; the silent chest is a warning, not recovery.",
   "No: Drinking risks aspiration in a child who can barely speak and does nothing for bronchospasm or hypoxemia.",
   "No: Rechecking in an hour delays care in a deteriorating child; respiratory failure can progress to arrest in minutes."
  ],
  "params": [
   "Yes: Retractions, accessory muscle use, ability to speak and respiratory rate show whether she is responding or tiring.",
   "Yes: Saturation trends show oxygenation; a continued fall despite oxygen means she needs higher-level support.",
   "No: Peak flow is part of routine asthma care, but a child who can say only two words cannot perform it reliably, and every 4 hours is far too infrequent.",
   "No: Blood glucose may rise with steroids or albuterol but is not a priority parameter for respiratory failure.",
   "No: Daily weight has no role in tracking an acute respiratory emergency."
  ],
  "tip": "A change that looks like improvement (wheezing stops, child gets quiet or sleepy) is a red flag when work of breathing and saturation are worsening; trust the trend in the vital signs over the sound."
 },
 "pd-mat": {
  "tip": "Compare each number to the normal range for that age, then ask whether the context explains it (sleep, albuterol) or adds danger (retractions, new chest pain, low saturation)."
 },
 "pd-sata": {
  "opts": [
   "Yes: The weight is implausible for a 3-year-old, so the dose is likely about double the safe amount; any doubt about a dose means holding it until it is verified.",
   "Yes: An actual measured weight in kilograms is the only safe basis for a pediatric dose and resolves whether 31 was really pounds.",
   "Yes: The order is based on a wrong weight, so the prescriber and pharmacy must correct it rather than the nurse adjusting it independently.",
   "No: Halving the dose may feel cautious, but it is still an unverified guess; changing a dose without an order is outside nursing scope.",
   "No: Pharmacy verification is a safety check, not a guarantee; pharmacists rely on the charted weight too, and the nurse is the last check before the patient.",
   "Yes: A pound-for-kilogram weight error is a system problem, and reporting it, even as a near miss, helps prevent the same error for other children."
  ],
  "tip": "When a weight looks wrong for the age, suspect a pounds-for-kilograms mix-up; the answers that hold, verify and report are correct, and any option that gives some form of the dose is a distractor."
 },
 "icu-bow": {
  "cond": [
   "Yes: Chest tube output that stops abruptly while HR and CVP climb, the pressure falls and narrows, the heart sounds muffle and the neck veins distend is Beck's triad and tamponade.",
   "No: The tempting read is that the bleeding stopped. But stopped bleeding brings the heart rate down and the pressure up; here every sign is moving the wrong way, and the CVP is rising, not falling.",
   "No: Atrial fibrillation is common after bypass and can drop the pressure, but it doesn't explain a rising CVP, muffled heart sounds and chest tubes that suddenly stopped draining.",
   "No: Left heart failure raises pressure in the lungs and causes crackles; it doesn't explain clotted chest tubes, a narrowing pulse pressure and muffled heart sounds."
  ],
  "actions": [
   "Yes: Tamponade after cardiac surgery is a surgical emergency. The surgeon needs to know now, by phone, not in a note.",
   "Yes: The definitive treatment is evacuating the clot, often by reopening the chest in the ICU. Preparing the sterile setup saves minutes.",
   "No: Fluid can briefly support filling, but it doesn't relieve compression, and waiting an hour lets the pressure keep falling toward arrest.",
   "No: Documenting the bleeding as resolved is the classic trap; the drainage stopped because the tubes clotted while blood kept collecting around the heart.",
   "No: The high CVP comes from compression, not fluid overload. A diuretic would drop preload the heart depends on and worsen the shock."
  ],
  "params": [
   "Yes: A rising heart rate and a falling, narrowing pressure show how hard the heart is being squeezed and whether the intervention worked.",
   "Yes: CVP and neck veins rise as blood backs up behind a compressed heart; they fall once the tamponade is relieved.",
   "No: Potassium matters after bypass for arrhythmias, but it doesn't track tamponade or the response to evacuating it.",
   "No: Glucose control matters after heart surgery for wound healing, but it isn't a measure of tamponade.",
   "No: Specific gravity reflects urine concentration, not cardiac filling or output in an emergency."
  ],
  "tip": "When a drain suddenly stops after surgery, ask why before you celebrate: compare the drain with the vital sign trends, and believe the trends."
 },
 "icu-mat": {
  "tip": "Sort ventilator alarms by mechanism: anything that resists flow raises pressure; anything that lets air escape lowers it."
 },
 "icu-sata": {
  "opts": [
   "Yes: Holding the MAP goal while the vasopressor dose comes down means vascular tone and volume are recovering.",
   "Yes: For an 80 kg client, 50 mL/h is above 0.5 mL/kg/h, so the kidneys are being perfused.",
   "Yes: A lactate falling from 4.6 to 2.1 shows tissue perfusion improving; lactate clearance is a key resuscitation marker.",
   "Yes: Warm hands and a brisk capillary refill show blood is reaching the skin again, an easy bedside sign of perfusion.",
   "No: A rising heart rate suggests ongoing hypovolemia, fever or pain; it is not a sign that the shock is resolving.",
   "No: New confusion can mean the brain is underperfused. A worsening mental status is a red flag, not improvement.",
   "No: Needing more vasopressor to hold the same MAP means the shock is getting worse, even if the number looks fine."
  ],
  "tip": "In shock questions, judge the patient by perfusion (mental status, urine, skin, lactate) and by how much support it takes to get there, not by a single number."
 }
};
