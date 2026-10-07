/* The Shift — NCLEX-style practice items after the debrief.
   Three items per shift, built from that shift's patients, in the formats the Next Generation NCLEX uses:
   bowtie, matrix, extended multiple response (select all), highlight, and drop-down cloze. Scoring follows the
   NCSBN rules: 0/1 for bowtie, matrix and cloze; +/- for select-all and highlight (wrong picks cancel right ones,
   floor of zero). Each item names the clinical judgment step it tests. */
(function (S) {
  const ITEMS = {
    'medsurg-4w-1': [
      { id: 'ms1-bow', type: 'bowtie', step: 'hypo',
        stem: `An 82-year-old admitted for a urinary tract infection is newly confused this morning. T 38.6 °C, HR 112, BP 98/58, RR 22. Urine output 15 mL/h for the last 2 hours. The first antibiotic dose hasn't been given.`,
        q: `Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.`,
        cond: { opts: [`Sepsis`, `Worsening dementia`, `Dehydration only`, `Stroke`], ans: 0 },
        actions: { opts: [`Obtain blood cultures, then start the antibiotic`, `Give the ordered IV fluid bolus`, `Give haloperidol for the confusion`, `Apply soft wrist restraints`, `Encourage oral fluids and recheck in 4 hours`], ans: [0, 1] },
        params: { opts: [`Serum lactate`, `Blood pressure and mean arterial pressure`, `Hemoglobin A1c`, `Serum albumin`, `TSH`], ans: [0, 1] },
        why: `New confusion, fever, tachycardia, soft pressure and low urine output with a known infection is sepsis until proven otherwise. Cultures, then antibiotics and fluids, fast; then watch whether the lactate clears and the pressure holds. Sedating or restraining treats the symptom and hides the cause.` },
      { id: 'ms1-mat', type: 'matrix', step: 'solve',
        stem: `A 71-year-old with heart failure (EF 30%) and atrial fibrillation, on daily furosemide, has 09:00 medications due. Apical pulse 52, irregular, counted for a full minute. BP 112/70. Potassium 3.3. Hemoglobin stable, no bleeding.`,
        q: `For each medication, indicate whether the nurse should give it or hold it and notify the provider.`,
        cols: [`Give`, `Hold and notify`],
        rows: [
          { t: `Metoprolol succinate 50 mg PO (hold for HR under 55)`, ans: 1, why: `Apical 52 is under the parameter.` },
          { t: `Losartan 25 mg PO (hold for SBP under 100)`, ans: 0, why: `SBP 112 is above the parameter.` },
          { t: `Apixaban 5 mg PO`, ans: 0, why: `No bleeding, stable hemoglobin; in AF, missed doses raise stroke risk.` },
          { t: `Potassium chloride 20 mEq PO`, ans: 0, why: `K 3.3 on a loop diuretic: this is the dose that protects him.` },
        ],
        why: `Hold parameters only work if someone checks the number first, against the exact threshold in the order.` },
      { id: 'ms1-sata', type: 'sata', step: 'act',
        stem: `A 58-year-old is on post-op day 1 after an open sigmoid colectomy. He splints when he breathes and has refused the incentive spirometer twice. Pain 7/10.`,
        q: `Which actions help prevent atelectasis? Select all that apply.`,
        opts: [
          { t: `Coach the incentive spirometer 10 times an hour while awake`, ok: true },
          { t: `Teach him to hug a pillow over the incision to cough`, ok: true },
          { t: `Walk him in the hall today`, ok: true },
          { t: `Give his pain medication before walking and coughing`, ok: true },
          { t: `Keep him on bed rest until the fever resolves`, ok: false },
          { t: `Hold opioids so he breathes more deeply`, ok: false },
        ],
        why: `Deep breaths, coughing and walking re-open alveoli; good pain control is what makes them possible. Bed rest and untreated pain both cause shallow breathing.` },
    ],
    'medsurg-4w-2': [
      { id: 'ms2-bow', type: 'bowtie', step: 'hypo',
        stem: `A 52-year-old with stage 4 chronic kidney disease has a potassium of 6.6. The monitor shows tall, peaked T waves. HR 58.`,
        q: `Complete the diagram.`,
        cond: { opts: [`Hyperkalemia with cardiac effects`, `Hypocalcemia`, `Digoxin toxicity`, `Dehydration`], ans: 0 },
        actions: { opts: [`Give IV calcium gluconate as ordered`, `Give IV regular insulin with dextrose as ordered`, `Give spironolactone`, `Encourage orange juice and bananas`, `Pause telemetry until the potassium is normal`], ans: [0, 1] },
        params: { opts: [`Cardiac rhythm on telemetry`, `Blood glucose`, `Serum sodium`, `Platelet count`, `Urine specific gravity`], ans: [0, 1] },
        why: `Peaked T waves mean the potassium is affecting the heart. Calcium stabilizes the heart muscle within minutes; insulin with dextrose shifts potassium into cells. Watch the rhythm, and the glucose after insulin.` },
      { id: 'ms2-hl', type: 'highlight', step: 'cues',
        stem: `Nurse's note, 15:30, for a 68-year-old with a COPD exacerbation who usually runs SpO₂ 88–92%.`,
        q: `Highlight the findings that require follow-up.`,
        parts: [
          { t: `Respiratory therapist increased oxygen from 2 L to 6 L at 14:00 for an SpO₂ of 87%.`, ok: true },
          { t: `SpO₂ now 97%.`, ok: true },
          { t: `Difficult to rouse; falls asleep mid-sentence.`, ok: true },
          { t: `Pursed-lip breathing.`, ok: false },
          { t: `Barrel chest.`, ok: false },
          { t: `Ate about half of lunch.`, ok: false },
        ],
        why: `In a CO₂ retainer, too much oxygen blunts the drive to breathe and CO₂ climbs. A saturation above her target, new sleepiness and a big oxygen increase add up to CO₂ narcosis. Pursed lips and a barrel chest are her baseline.` },
      { id: 'ms2-mat', type: 'matrix', step: 'solve',
        stem: `A 24-year-old with suspected appendicitis is going to the OR tonight. Allergy band: penicillin (anaphylaxis). Pain 8/10, RR 16. Urine hCG sent, not yet resulted.`,
        q: `For each order or task, indicate whether the nurse should carry it out or clarify first.`,
        cols: [`Carry out`, `Clarify first`],
        rows: [
          { t: `Ampicillin-sulbactam 3 g IV on call to the OR`, ans: 1, why: `A penicillin, in a patient with penicillin anaphylaxis.` },
          { t: `Morphine 4 mg IV for pain 8/10`, ans: 0, why: `Ordered, indicated, and her breathing is fine.` },
          { t: `Ondansetron 4 mg IV for nausea`, ans: 0, why: `Ordered and indicated.` },
          { t: `Send her to the OR before the hCG results`, ans: 1, why: `Pregnancy status has to be known before anesthesia and surgery.` },
          { t: `Confirm her allergy band matches the chart`, ans: 0, why: `Always.` },
        ],
        why: `Read every order against the allergy list and the pre-op checklist. "On call to the OR" is when errors slip through.` },
    ],
    'medsurg-4w-3': [
      { id: 'ms3-bow', type: 'bowtie', step: 'hypo',
        stem: `At 01:09, a 71-year-old with pneumonia has a new right facial droop, right arm drift and slurred speech. His last normal neuro check was at 21:00. BP 188/96. Glucose 142.`,
        q: `Complete the diagram.`,
        cond: { opts: [`Acute ischemic stroke`, `Hypoglycemia`, `Bell's palsy`, `Delirium from the infection`], ans: 0 },
        actions: { opts: [`Call a stroke alert`, `Keep him NPO until a swallow screen`, `Give his oral aspirin now`, `Lower his BP to 120 systolic right away`, `Wait an hour to see if it resolves`], ans: [0, 1] },
        params: { opts: [`Neuro checks (NIH Stroke Scale)`, `Blood pressure`, `Daily weight`, `Serum lipase`, `Hemoglobin A1c`], ans: [0, 1] },
        why: `Last known well sets the treatment window, so call now. Nothing by mouth until he passes a swallow screen. BP is kept under 185/110 if he may get a clot-buster, not dropped to normal.` },
      { id: 'ms3-sata', type: 'sata', step: 'cues',
        stem: `A 45-year-old is on post-op day 0 after an open hysterectomy, with a hydromorphone PCA. Her husband has been pressing the button "so she stays comfortable" while she sleeps.`,
        q: `Which findings indicate opioid-induced respiratory depression? Select all that apply.`,
        opts: [
          { t: `Drifts off to sleep mid-sentence (POSS 3)`, ok: true },
          { t: `Respiratory rate 9`, ok: true },
          { t: `Snoring with pauses in her breathing`, ok: true },
          { t: `Pain 6/10 when awake`, ok: false },
          { t: `Nausea`, ok: false },
          { t: `Pinpoint pupils`, ok: true },
        ],
        why: `Sedation comes before respiratory depression, so it's the early sign to watch. Pulse oximetry falls late, especially on oxygen. Only the patient presses a PCA.` },
      { id: 'ms3-cloze', type: 'cloze', step: 'eval',
        stem: `A 26-year-old with diabetic ketoacidosis is on an insulin infusion.`,
        q: `Complete the sentences.`,
        parts: [`Keep the insulin infusion running until the `, { opts: [`ketoacidosis has resolved (gap closed, ketones down)`, `glucose is under 200`, `potassium is over 5`], ans: 0 }, `. Give subcutaneous basal insulin about `, { opts: [`2 hours`, `10 minutes`, `24 hours`], ans: 0 }, ` before stopping the infusion. If the potassium is `, { opts: [`under 3.5`, `over 5.0`, `between 4 and 5`], ans: 0 }, `, hold the insulin and replace potassium first.`],
        why: `The acidosis (anion gap and ketones), not the glucose, tells you DKA has resolved. Without overlap, ketones come back within hours. Insulin drives potassium into cells, so a low potassium has to be fixed first (the 2024 ADA consensus holds insulin for K under 3.5).` },
    ],
    'stepdown-6e-1': [
      { id: 'sd-bow', type: 'bowtie', step: 'hypo',
        stem: `A 59-year-old had a stent placed through the right femoral artery at 04:30. At 08:30 he has new right low back pain, 6/10. HR 102 (78 at 07:00), BP 108/70 (134/80 at 07:00). The groin site is soft with no hematoma; distal pulses are 2+.`,
        q: `Complete the diagram.`,
        cond: { opts: [`Retroperitoneal bleeding`, `Back strain from lying flat`, `Stent thrombosis`, `Pulmonary embolism`], ans: 0 },
        actions: { opts: [`Notify the provider and anticipate a CT of the abdomen and pelvis`, `Keep him flat and place a second large-bore IV`, `Give morphine and reassess in 2 hours`, `Sit him up to relieve the back pain`, `Hold the aspirin and ticagrelor on your own`], ans: [0, 1] },
        params: { opts: [`Heart rate and blood pressure`, `Hemoglobin`, `Size of the groin hematoma`, `Blood glucose`, `Troponin`], ans: [0, 1] },
        why: `A retroperitoneal bleed hides behind a clean groin. Back or flank pain with a rising heart rate and falling pressure after femoral access is the pattern. Stopping a fresh stent's antiplatelets is the cardiologist's call.` },
      { id: 'sd-mat', type: 'matrix', step: 'solve',
        stem: `A 74-year-old on day 5 of a heparin infusion for pulmonary emboli has platelets of 98, down from 230 on admission. No other cause is found.`,
        q: `For each action, indicate whether it is indicated or contraindicated.`,
        cols: [`Indicated`, `Contraindicated`],
        rows: [
          { t: `Stop the heparin infusion`, ans: 0, why: `Suspected HIT: all heparin stops.` },
          { t: `Flush her saline lock with heparin 10 units/mL`, ans: 1, why: `Flushes are heparin too.` },
          { t: `Transfuse platelets for a count of 98`, ans: 1, why: `Platelets can fuel clotting in HIT.` },
          { t: `Start argatroban as ordered`, ans: 0, why: `She still has a PE and now a clotting disorder.` },
          { t: `Start warfarin today`, ans: 1, why: `Warfarin waits until platelets recover; early warfarin in HIT can cause limb gangrene.` },
          { t: `Send a PF4/heparin antibody test`, ans: 0, why: `Confirms the diagnosis.` },
        ],
        why: `A drop of more than half, 5 to 10 days after starting heparin, is the classic picture of HIT. It causes clots, not bleeding, so the treatment is a different anticoagulant.` },
      { id: 'sd-sata', type: 'sata', step: 'act',
        stem: `An 81-year-old admitted for syncope has a QTc of 516 ms. K 3.2, Mg 1.4. He takes citalopram 40 mg daily. The unit has a nurse-initiated electrolyte replacement protocol.`,
        q: `Which actions reduce his risk of torsades de pointes? Select all that apply.`,
        opts: [
          { t: `Give potassium chloride per the protocol`, ok: true },
          { t: `Give magnesium sulfate per the protocol`, ok: true },
          { t: `Hold the citalopram and notify the provider`, ok: true },
          { t: `Give ondansetron for his nausea`, ok: false },
          { t: `Give his furosemide as scheduled`, ok: false },
          { t: `Silence the frequent alarms as artifact`, ok: false },
        ],
        why: `Low potassium and magnesium lengthen the QT; citalopram over 20 mg in someone over 60 and ondansetron do too; a loop diuretic drops the potassium further. Short runs on the monitor are the warning.` },
    ],
    'psych-3e-1': [
      { id: 'p3-bow', type: 'bowtie', step: 'hypo',
        stem: `A 58-year-old on lithium has a coarse hand tremor, diarrhea since yesterday and new confusion. His lithium level is 2.1. His outpatient doctor recently added hydrochlorothiazide, and he takes ibuprofen for his back.`,
        q: `Complete the diagram.`,
        cond: { opts: [`Lithium toxicity`, `Serotonin syndrome`, `Neuroleptic malignant syndrome`, `Viral gastroenteritis`], ans: 0 },
        actions: { opts: [`Hold the lithium and notify the provider`, `Arrange medical evaluation for IV fluids`, `Give the 08:00 lithium with food`, `Restrict his salt intake`, `Give loperamide and recheck tomorrow`], ans: [0, 1] },
        params: { opts: [`Serum lithium level`, `Mental status and neuro checks`, `Weight`, `Lipid panel`, `AIMS score`], ans: [0, 1] },
        why: `Thiazides and NSAIDs both raise lithium levels. Diarrhea, coarse tremor and confusion at 2.1 are moderate toxicity: hold, call, get him medical care. Low salt raises the level further.` },
      { id: 'p3-hl', type: 'highlight', step: 'cues',
        stem: `Nurse's note for a 34-year-old admitted after an overdose, on day 4.`,
        q: `Highlight the findings that require follow-up.`,
        parts: [
          { t: `Bright and calm today, for the first time this week.`, ok: true },
          { t: `Gave his watch to a peer.`, ok: true },
          { t: `Says, "I've figured everything out."`, ok: true },
          { t: `Ate all of breakfast.`, ok: false },
          { t: `Asking to be discharged today.`, ok: true },
          { t: `Attended morning group.`, ok: false },
        ],
        why: `A sudden lift in mood after a severe depression can mean a decision has been made. Giving things away and a new sense of resolve are warning signs. Ask directly about suicide, and tell the team.` },
      { id: 'p3-mat', type: 'matrix', step: 'solve',
        stem: `A 26-year-old in a manic episode is loud, intrusive and pacing, and hasn't slept in two nights. She hasn't threatened or hurt anyone.`,
        q: `For each intervention, indicate whether it is appropriate right now.`,
        cols: [`Appropriate`, `Not appropriate`],
        rows: [
          { t: `Offer a quiet room with less stimulation`, ans: 0, why: `Lowers stimulation, least restrictive.` },
          { t: `Offer her PRN by mouth as a choice`, ans: 0, why: `Respects autonomy and often works.` },
          { t: `Seclusion because she is disruptive`, ans: 1, why: `Seclusion is for imminent danger, not noise.` },
          { t: `Short, simple, calm statements`, ans: 0, why: `Easier to follow when thoughts are racing.` },
          { t: `Invite her to a competitive group game`, ans: 1, why: `Competition escalates mania.` },
          { t: `Finger foods she can eat while moving`, ans: 0, why: `Keeps her nourished when she can't sit for a meal.` },
        ],
        why: `Use the least restrictive intervention that keeps everyone safe. Lower the stimulation and give her choices before anything more.` },
    ],
    'psych-4n-1': [
      { id: 'p4-bow', type: 'bowtie', step: 'hypo',
        stem: `An hour after his first-ever dose of IM haloperidol, a 14-year-old's neck is twisted to one side, his eyes are rolled upward and his jaw is clenched. Staff say he is "acting out for attention."`,
        q: `Complete the diagram.`,
        cond: { opts: [`Acute dystonic reaction`, `Behavioral acting out`, `Neuroleptic malignant syndrome`, `Tardive dyskinesia`], ans: 0 },
        actions: { opts: [`Give diphenhydramine or benztropine as ordered`, `Check his airway for stridor`, `Give another dose of haloperidol`, `Place him in seclusion`, `Tell him to relax his neck`], ans: [0, 1] },
        params: { opts: [`Airway and swallowing`, `Return of muscle spasms as the dose wears off`, `Lithium level`, `Blood glucose`, `Weight`], ans: [0, 1] },
        why: `Young males after a first dose of a high-potency antipsychotic are at the highest risk. An anticholinergic reverses it within minutes; dystonia of the throat can threaten the airway. It can come back, so it needs a scheduled dose.` },
      { id: 'p4-cloze', type: 'cloze', step: 'solve',
        stem: `A 15-year-old with anorexia nervosa is on day 4 of refeeding. Her 16:00 phosphorus is 2.1 (the order says call for under 3.0).`,
        q: `Complete the sentences.`,
        parts: [`The nurse's priority is to `, { opts: [`call the provider for electrolyte replacement`, `hold her meals until the phosphorus rises`, `give a laxative`], ans: 0 }, `. Refeeding syndrome is most likely in the first `, { opts: [`week`, `day`, `month`], ans: 0 }, ` of refeeding. Staff supervise her meals and `, { opts: [`the hour after`, `the next morning's weight`, `only dinner`], ans: 0 }, `.`],
        why: `Replace and keep feeding; stopping food is what the illness wants. Risk peaks in the first week. The hour after meals is when exercise and purging happen.` },
      { id: 'p4-sata', type: 'sata', step: 'act',
        stem: `A 16-year-old tells you her mother's partner has been sexually abusing her, and that he is on tonight's visitor list.`,
        q: `Which nurse actions are appropriate? Select all that apply.`,
        opts: [
          { t: `Tell her you believe her and it isn't her fault`, ok: true },
          { t: `Make the mandated report yourself`, ok: true },
          { t: `Change the visitor list with the team before visiting hours`, ok: true },
          { t: `Promise to keep it a secret so she keeps talking`, ok: false },
          { t: `Ask detailed questions so the report is complete`, ok: false },
          { t: `Ask her mother at visiting whether it's true`, ok: false },
          { t: `Document her words exactly as she said them`, ok: true },
        ],
        why: `Believe, report, protect, document. Forensic questioning belongs to specialists, and questioning family can tip off the person she named.` },
    ],
    'ed-podb-1': [
      { id: 'ed-bow', type: 'bowtie', step: 'hypo',
        stem: `A 64-year-old with type 2 diabetes came in with "indigestion" and fatigue. Her first ECG was nonspecific. Thirty minutes later she is diaphoretic with pressure radiating to her jaw. Repeat ECG: ST elevation in II, III and aVF. HR 58, BP 104/64. V4R shows ST elevation.`,
        q: `Complete the diagram.`,
        cond: { opts: [`Inferior STEMI with right ventricular involvement`, `Gastroesophageal reflux`, `Anterior STEMI with heart failure`, `Pulmonary embolism`], ans: 0 },
        actions: { opts: [`Notify the provider to activate the cardiac catheterization lab`, `Give aspirin 324 mg chewed if not already given`, `Give nitroglycerin 0.4 mg SL for the pain`, `Give furosemide 40 mg IV`, `Wait for the second troponin before acting`], ans: [0, 1] },
        params: { opts: [`Blood pressure`, `Cardiac rhythm`, `Blood glucose every hour`, `Urine specific gravity`, `Peak flow`], ans: [0, 1] },
        why: `ST elevation is the diagnosis; troponin comes later. Inferior MIs often involve the right ventricle, which depends on preload, so nitrates and diuretics can crash the pressure. Watch the pressure and rhythm: inferior MIs cause bradycardia and heart block.` },
      { id: 'ed-hl', type: 'highlight', step: 'cues',
        stem: `Stroke alert triage note: 72-year-old man, right arm and leg weakness and difficulty speaking.`,
        q: `Highlight the findings that change whether he can receive a thrombolytic.`,
        parts: [
          { t: `Wife found him on the couch at 14:30.`, ok: false },
          { t: `Wife last saw him normal at 10:00.`, ok: true },
          { t: `BP 198/108.`, ok: true },
          { t: `Glucose 142.`, ok: false },
          { t: `CT head: no hemorrhage.`, ok: false },
          { t: `Takes lisinopril and atorvastatin.`, ok: false },
          { t: `Arrived at 14:52.`, ok: false },
        ],
        why: `The window starts at last known well (10:00), not when he was found, so it closed at 14:30, before he arrived. A pressure over 185/110 must be lowered before any reperfusion. A normal glucose, a clean CT and his usual medicines don't exclude him.` },
      { id: 'ed-sata', type: 'sata', step: 'act',
        stem: `A 19-year-old who ate peanut sauce has hives, lip swelling, a hoarse voice and wheezing. BP 84/50, HR 128. EMS gave diphenhydramine 50 mg IV.`,
        q: `Which actions should the nurse take now? Select all that apply.`,
        opts: [
          { t: `Give epinephrine 0.5 mg (1 mg/mL) IM in the anterolateral thigh`, ok: true },
          { t: `Place him supine with legs elevated and give high-flow oxygen`, ok: true },
          { t: `Start a 1 L normal saline bolus`, ok: true },
          { t: `Give epinephrine 0.5 mg (1 mg/mL) IV push`, ok: false },
          { t: `Wait 30 minutes for the diphenhydramine to work`, ok: false },
          { t: `Repeat the IM epinephrine in 5 to 15 minutes if symptoms persist`, ok: true },
        ],
        why: `Epinephrine IM is first-line; antihistamines don't treat airway swelling or shock. Undiluted IV push epinephrine causes arrhythmias and MI. Supine with legs up, oxygen and fluids support circulation while it works.` },
    ],
    'ob-2n-1': [
      { id: 'ob-bow', type: 'bowtie', step: 'hypo',
        stem: `A client is 2.5 hours after a vaginal birth that followed a 20-hour oxytocin induction; the newborn weighed 4.3 kg. She has not voided since birth. The fundus is boggy, 2 cm above the umbilicus and deviated to the right. Her pad is saturated in 30 minutes. HR 104, BP 112/68. She has asthma.`,
        q: `Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take first, and two parameters to monitor.`,
        cond: { opts: [`Postpartum hemorrhage from uterine atony`, `Retained placental fragments only`, `Normal lochia rubra`, `Amniotic fluid embolism`], ans: 0 },
        actions: { opts: [`Massage the fundus while supporting the lower uterine segment`, `Empty the bladder (catheterize if she cannot void)`, `Give carboprost 250 mcg IM`, `Encourage her to rest flat and recheck in an hour`, `Apply an ice pack to the perineum`], ans: [0, 1] },
        params: { opts: [`Quantitative blood loss (weighed pads)`, `Fundal tone and position`, `Blood glucose`, `Deep tendon reflexes`, `Urine specific gravity`], ans: [0, 1] },
        why: `A full bladder displaces the uterus and keeps it from contracting. Massage and emptying the bladder are first; uterotonics follow. Carboprost causes bronchospasm in asthma. Weighing pads (1 g = 1 mL) and trending the fundus show whether it's working.` },
      { id: 'ob-mat', type: 'matrix', step: 'cues',
        stem: `A client with preeclampsia with severe features is receiving magnesium sulfate 2 g/h. The nurse reviews this morning's findings.`,
        q: `For each finding, indicate whether it is expected on magnesium or requires immediate follow-up.`,
        cols: [`Expected`, `Requires follow-up`],
        rows: [
          { t: `Feels warm and flushed`, ans: 0, why: `Vasodilation from magnesium.` },
          { t: `Urine output 20 mL/h for 3 hours`, ans: 1, why: `Magnesium is cleared by the kidneys; oliguria lets it accumulate.` },
          { t: `Patellar reflexes absent`, ans: 1, why: `Loss of reflexes is the first sign of toxicity: stop the infusion.` },
          { t: `Drowsy but easy to rouse`, ans: 0, why: `Mild sedation is common.` },
          { t: `Respiratory rate 10`, ans: 1, why: `Respiratory depression: stop the infusion and give calcium gluconate.` },
          { t: `Serum magnesium 6.0 mg/dL`, ans: 0, why: `Within the therapeutic range (about 4.8 to 8.4 mg/dL).` },
        ],
        why: `Hourly checks catch toxicity in order: reflexes fade first, then breathing slows, then the heart. Urine output tells you whether the level is about to climb.` },
      { id: 'ob-cloze', type: 'cloze', step: 'solve',
        stem: `A 6-hour-old, 4.45 kg newborn of a mother with insulin-treated gestational diabetes has a heel-stick glucose of 38 mg/dL. He has no symptoms.`,
        q: `Complete the sentences.`,
        parts: [`The nurse should give dextrose 40% gel `, { opts: [`2.2 mL`, `0.5 mL`, `4.5 mL`], ans: 0 }, ` to the buccal mucosa, then `, { opts: [`feed the baby`, `keep him NPO`, `give IV fluids`], ans: 0 }, `, and recheck the glucose in `, { opts: [`1 hour`, `4 hours`, `10 minutes`], ans: 0 }, `. If he becomes `, { opts: [`jittery or lethargic`, `pink and alert`, `hungry`], ans: 0 }, `, notify the provider immediately.`],
        why: `Gel is 0.5 mL/kg (200 mg/kg). It raises glucose briefly; feeding keeps it up. The 1-hour recheck decides the next step. Symptoms mean IV dextrose is needed.` },
    ],
    'peds-5s-1': [
      { id: 'pd-bow', type: 'bowtie', step: 'hypo',
        stem: `An 8-year-old with an asthma exacerbation was wheezing loudly an hour ago. Now her chest is quiet. RR 36, SpO₂ 89%, deep retractions, and she can say only two words at a time.`,
        q: `Complete the diagram.`,
        cond: { opts: [`Impending respiratory failure`, `Improving asthma`, `Anxiety`, `Upper airway foreign body`], ans: 0 },
        actions: { opts: [`Give continuous albuterol and oxygen as ordered`, `Call a rapid response`, `Let her sleep now that the wheezing stopped`, `Give a large glass of water`, `Recheck in an hour`], ans: [0, 1] },
        params: { opts: [`Work of breathing and respiratory rate`, `Oxygen saturation`, `Peak flow every 4 hours`, `Blood glucose`, `Daily weight`], ans: [0, 1] },
        why: `A silent chest means too little air is moving to make a wheeze. With rising work of breathing and falling saturation, it's an emergency, not improvement.` },
      { id: 'pd-mat', type: 'matrix', step: 'cues',
        stem: `You're reviewing vital signs on a pediatric unit.`,
        q: `For each finding, indicate whether it is expected for the child or requires follow-up.`,
        cols: [`Expected`, `Requires follow-up`],
        rows: [
          { t: `4-month-old, HR 150, asleep`, ans: 0, why: `Normal for an infant.` },
          { t: `4-month-old with RSV, RR 68 with retractions and nasal flaring`, ans: 1, why: `Increased work of breathing.` },
          { t: `15-year-old in sickle cell crisis, new chest pain, RR 28, SpO₂ 91%`, ans: 1, why: `Acute chest syndrome until proven otherwise.` },
          { t: `8-year-old, HR 118 after albuterol`, ans: 0, why: `Expected tachycardia from albuterol.` },
          { t: `3-year-old, SBP 92`, ans: 0, why: `Normal for age.` },
        ],
        why: `Normal ranges change with age. Work of breathing and new symptoms matter more than a single number.` },
      { id: 'pd-sata', type: 'sata', step: 'solve',
        stem: `A 3-year-old is ordered morphine 0.1 mg/kg IV. The chart weight is 31 kg, so the order reads 3.1 mg. The child looks small for 31 kg.`,
        q: `Which actions should the nurse take? Select all that apply.`,
        opts: [
          { t: `Hold the dose`, ok: true },
          { t: `Weigh the child in kilograms`, ok: true },
          { t: `Ask the provider and pharmacy to correct the order`, ok: true },
          { t: `Give half the dose to be safe`, ok: false },
          { t: `Give it as ordered because pharmacy verified it`, ok: false },
          { t: `Report the error through the safety reporting system`, ok: true },
        ],
        why: `31 is about what a 3-year-old weighs in pounds. Every pediatric dose depends on a weight in kilograms that someone actually measured.` },
    ],
  };

  const TYPE = { bowtie: 'Bowtie', matrix: 'Matrix', sata: 'Select all that apply', highlight: 'Highlight', cloze: 'Drop-down' };
  const max = (it) => it.type === 'bowtie' ? 5 : it.type === 'matrix' ? it.rows.length : it.type === 'cloze' ? it.parts.filter((p) => typeof p !== 'string').length : it.type === 'sata' ? it.opts.filter((o) => o.ok).length : it.parts.filter((p) => p.ok).length;
  /* Answers: bowtie { c: i, a: [i..], p: [i..] }, matrix { r: [col per row] }, sata/highlight { s: [i..] }, cloze { d: [i per blank] } */
  function score(it, a) {
    a = a || {};
    if (it.type === 'bowtie') return (a.c === it.cond.ans ? 1 : 0) + (a.a || []).filter((i) => it.actions.ans.includes(i)).length + (a.p || []).filter((i) => it.params.ans.includes(i)).length;
    if (it.type === 'matrix') return it.rows.filter((r, i) => (a.r || [])[i] === r.ans).length;
    if (it.type === 'cloze') { let k = 0; return it.parts.filter((p) => typeof p !== 'string').filter((p) => (a.d || [])[k++] === p.ans).length; }
    const list = it.type === 'sata' ? it.opts : it.parts, s = a.s || [];
    return Math.max(0, s.filter((i) => list[i].ok).length - s.filter((i) => !list[i].ok).length);
  }
  const complete = (it, a) => { a = a || {}; if (it.type === 'bowtie') return a.c !== undefined && (a.a || []).length === 2 && (a.p || []).length === 2; if (it.type === 'matrix') return it.rows.every((r, i) => (a.r || [])[i] !== undefined); if (it.type === 'cloze') return it.parts.filter((p) => typeof p !== 'string').every((p, i) => (a.d || [])[i] !== undefined); return (a.s || []).length > 0; };
  /* Per-option rationale for any item, in one shape: { cond, actions, params } for bowtie, opts for select-all,
     parts for highlight, blanks (one list per blank) for drop-down, and a tip. Shift items take theirs from
     ngn-why.js; focus items carry theirs inline. Missing pieces come back as empty lists. */
  function whys(it) {
    const w = (S.ngnWhy || {})[it.id] || {}, o = { tip: it.tip || w.tip || '' };
    if (it.type === 'bowtie') ['cond', 'actions', 'params'].forEach((k) => { o[k] = (it.whys && it.whys[k]) || w[k] || []; });
    else if (it.type === 'sata') o.opts = it.opts.map((x, i) => x.why || (w.opts || [])[i] || '');
    else if (it.type === 'highlight') o.parts = it.parts.map((x, i) => x.why || (w.parts || [])[i] || '');
    else if (it.type === 'cloze') { let b = 0; o.blanks = it.parts.filter((x) => typeof x !== 'string').map((x) => x.whys || (w.blanks || [])[b++] || []); }
    return o;
  }
  /* Scoring, shown as working: every part that earns or loses a point, and the rule the exam uses for this format. */
  const RULE = {
    bowtie: 'Bowtie items are scored 0 or 1 per part: 1 point for the condition, 1 for each correct action you chose and 1 for each correct parameter, 5 in all. A wrong choice earns 0 but takes nothing away.',
    matrix: 'Matrix items are scored 0 or 1 per row: each row you mark correctly earns 1 point. A wrong row earns 0 but takes nothing away.',
    cloze: 'Drop-down items are scored 0 or 1 per blank: each correct choice earns 1 point.',
    sata: 'Select-all items are scored plus or minus: +1 for each correct option you choose, -1 for each incorrect one, never below 0. Options you leave unchosen cost nothing, but a correct option you miss is a point you did not earn.',
    highlight: 'Highlight items are scored plus or minus: +1 for each finding you correctly highlight, -1 for each one you highlight that did not need follow-up, never below 0.',
  };
  function breakdown(it, a) {
    a = a || {}; const rows = [];
    if (it.type === 'bowtie') {
      rows.push({ part: 'Condition', pick: it.cond.opts[a.c], ok: a.c === it.cond.ans, pts: a.c === it.cond.ans ? 1 : 0, want: it.cond.opts[it.cond.ans] });
      [['a', 'actions', 'Action'], ['p', 'params', 'Parameter']].forEach(([k, g, lab]) => (a[k] || []).forEach((i, n) => { const ok = it[g].ans.includes(i); rows.push({ part: `${lab} ${n + 1}`, pick: it[g].opts[i], ok, pts: ok ? 1 : 0 }); }));
    } else if (it.type === 'matrix') {
      it.rows.forEach((r, i) => { const v = (a.r || [])[i], ok = v === r.ans; rows.push({ part: r.t, pick: it.cols[v], ok, pts: ok ? 1 : 0, want: it.cols[r.ans] }); });
    } else if (it.type === 'cloze') {
      let k = 0; it.parts.forEach((x) => { if (typeof x === 'string') return; const v = (a.d || [])[k], ok = v === x.ans; rows.push({ part: `Blank ${k + 1}`, pick: x.opts[v], ok, pts: ok ? 1 : 0, want: x.opts[x.ans] }); k++; });
    } else {
      const list = it.type === 'sata' ? it.opts : it.parts, s = a.s || [];
      list.forEach((o, i) => { const on = s.includes(i); if (on) rows.push({ part: o.t, pick: true, ok: !!o.ok, pts: o.ok ? 1 : -1 }); else if (o.ok) rows.push({ part: o.t, pick: false, ok: false, pts: 0, missed: true }); });
    }
    const sum = rows.reduce((n, r) => n + r.pts, 0), sc = score(it, a);
    const pm = it.type === 'sata' || it.type === 'highlight';
    const right = rows.filter((r) => r.pts > 0).length, wrong = rows.filter((r) => r.pts < 0).length;
    const math = pm ? `${right} correct ${right === 1 ? 'choice' : 'choices'} (+${right})${wrong ? ` minus ${wrong} incorrect (-${wrong})` : ''} = ${sum}${sum < 0 ? ', raised to the floor of 0' : ''}` : `${right} of ${rows.length} ${it.type === 'matrix' ? 'rows' : it.type === 'cloze' ? 'blanks' : 'parts'} correct`;
    return { rows, rule: RULE[it.type], math, score: sc, max: max(it), pm };
  }
  /* Every item, and lookup by id (focus items included), for the debrief and the instructor dashboard. */
  const focusItems = () => S.ngnFocus || [];
  const all = () => Object.values(ITEMS).reduce((n, L) => n.concat(L), []).concat(focusItems());
  const byId = (id) => all().find((x) => x.id === id) || null;
  /* Focus practice: for each weak step (lowest first), up to `per` items that test it. Prefers items written for
     focus practice, then other shifts' items; skips this shift's own three and anything already answered, unless
     that leaves nothing to offer. */
  function focus(steps, caseId, done, per, sp) {
    done = done || {}; per = per || 2; const own = new Set((ITEMS[caseId] || []).map((x) => x.id)), out = [], used = new Set();
    steps.forEach((st) => {
      const pool = focusItems().filter((x) => x.step === st).concat(Object.entries(ITEMS).filter(([cid]) => cid !== caseId).reduce((n, [, L]) => n.concat(L.filter((x) => x.step === st)), []))
        .filter((x) => !own.has(x.id) && !used.has(x.id)).sort((x, y) => (y.sp === sp) - (x.sp === sp));   // same unit first, then the order above
      const fresh = pool.filter((x) => !done[x.id]), pick = (fresh.length ? fresh : pool).slice(0, per);
      pick.forEach((x) => { used.add(x.id); out.push(x); });
    });
    return out;
  }
  S.ngn = { ITEMS, TYPE, RULE, items: (id) => ITEMS[id] || [], score, max, complete, whys, breakdown, all, byId, focus };
})(window.Shift = window.Shift || {});
