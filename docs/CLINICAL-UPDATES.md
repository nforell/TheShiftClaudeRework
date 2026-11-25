# Clinical content updates

A running record of content changed to keep the shifts current, so reviewers know what moved and why.

## November 24, 2026: Comprehensive clinical & psychometric audit fixes

| Where | What changed | Basis |
|---|---|---|
| L&D (`case-ld1.js`, `tests/ld.py`) | Vigorous 1-minute APGAR corrected from 8 to 9 (acrocyanosis 1 + HR 2 + grimace 2 + flexed/active 2 + vigorous cry 2); `tl-baby` units (`2 / 3 / 6`) and cord pH (`6.91`) aligned with `outcome()`. | Standard APGAR scoring; internal consistency. |
| Nights 4W (`case-medsurg3.js`) | Replaced bedside KCl-added-to-bag phrasing with pharmacy-premixed KCl 20 mEq/L at 250 mL/h (5 mEq/h over 4 h); updated DKA resolution criteria to include venous pH ≥ 7.3 / bicarb ≥ 18, beta-hydroxybutyrate < 0.6, and anion gap ≤ 12. | ISMP Targeted Medication Safety Best Practices; 2024 ADA DKA consensus. |
| ED (`case-ed1.js`) | Fixed tenecteplase `give()` logged dose (20.5 / 25 / 41 mg); blocked Harold Jensen PO acetaminophen (`25-apap`) permanently once CT confirms acute SDH; aligned Karen's Wednesday evening 18:00 warfarin pillbox clue/dialog. | FDA tenecteplase weight-tier dosing; neurosurgical NPO safety; internal consistency. |
| Adult psych (`case-psych1.js`) | Fixed Jasmine seclusion order vs 1-hr F2F phrasing; recognized `P.poOffered` in emergency IM MAR check; corrected Linda Fairweather q6h PRN acetaminophen lockout window to 10:00 (`s.t < 180`). | CMS 42 CFR 482.13; MAR safety. |
| Teen psych (`case-adolpsych1.js`) | Unified Ella Mg ref range (1.7–2.2), added repeat Mg to `ella-recheck`, added ASPEN 2020 nuance for severe symptomatic refeeding; aligned Jaylen post-IM q15/q30 check timeline and Ben note timestamp; clarified haloperidol dystonia as intolerance rather than IgE allergy. | ASPEN 2020 Refeeding Consensus; clinical pharmacology & internal consistency. |
| Mother-baby (`case-ob1.js`) | Replaced `"placental"` with `"cerebral and end-organ perfusion"` in postpartum preeclampsia rationale. | Postpartum physiology (placenta already delivered). |
| Step-down (`case-stepdown1.js`) | Replaced `"Urinal"` with commode urine hat for Gloria Mendes (`601`); changed Raymond Okoro daily maintenance ASA 81 mg from chewed to swallowed and made SBAR Hgb dynamic; changed Dolores Price (`605`) secondary line to single-lumen PICC for heparin flush trap; fixed argatroban logged start rate (`2 mcg/kg/min`). | INS 2021/2024 Infusion Standards; ACC/AHA; internal consistency. |
| Pediatrics (`case-peds1.js`) | Fixed Leo Park Holliday-Segar math wording (70 vs 48 mL/h = nearly 1.5×, not >2×); made IV room clue reflect `P.ivFixed`. | Holliday-Segar arithmetic; internal consistency. |
| Evenings 4W (`case-medsurg2.js`) | Computed dynamic CIWA-Ar sub-scores summing exactly to `c`; removed urticaria/hives from AHTR (`425`) presentation; ordered D50 before regular insulin IV (`427`); aligned Amina cipro pre-op order window to 120 min; updated COPD hypercapnia rationale to V/Q mismatch & Haldane effect. | CIWA-Ar; AABB transfusion reactions; hyperkalemia safety; GOLD COPD physiology. |
| Days 4W (`case-medsurg1.js`) | Labeled Mr. Bell's SBP −22 / HR +20 as positive orthostatic hypotension; added SSC 2021 balanced crystalloid & 30 mL/kg reassessment nuance; added oral KCl >40 mEq GI splitting check for Mr. Ortiz. | Orthostatic hypotension criteria; SSC 2021; oral KCl GI safety. |
| ICU (`case-icu1.js`) | Replaced routine gastric residual language with ASPEN/SCCM tolerance check (`712`); enabled second KCl 20 mEq protocol run for `713` per `"repeat once if < 3.5"` order. | ASPEN/SCCM nutrition guidelines; internal order consistency. |
| Law & Pocket Ref (`law.js`, `ref.js`) | Updated General US standing-restraint wording to federal CMS 42 CFR 482.13; added RN/PA F2F physician consultation requirement; updated OB late decels to ACOG 2022 (no routine maternal O₂ if SpO₂ normal); clarified newborn resting vs PALS awake HR. | CMS 42 CFR 482.13; ACOG 2022; PALS. |
| Drills & NGN (`drills-*.js`, `ngn*.js`, `floor-more.js`) | Rewrote `mp-h-oxy-poss2` stem to true POSS 2 and refined `mp-h-ssri-teen`; updated `mp-dka-k` to 2024 ADA K⁺ < 3.5 threshold; added CO pulse-ox caveat to `wf-burn-airway`; removed orphaned hospice sentence from `wf-neutro`; clarified `mp-apap-max` math; fixed `sb-compartment`, `sb-stemi`, `sb-h-na`, and hyponatremia ≤ 6–8 mEq/L/24h cap; fixed `ed-hl` arrival ambiguity, `pd-mat` sleeping infant HR, `p4-sata` national mandated-reporter wording, `ob-ch1` glucose threshold (`32 mg/dL`), `ms1-ch1` row count, `cs-preterm` Mg units (`4.8–8.4 mg/dL`), and ABA/ABLS 2 mL/kg/%TBSA note on Parkland items; replaced 4 duplicate-topic challenge items (`sd-ch1`, `icu-ch1`, `ld-ch1`, `p4-ch2`) with fresh unit-relevant items. | 2024 ADA; AAP; US hyponatremia consensus; ABA/ABLS; NCLEX-RN blueprint. |

## November 1, 2026: Round 3 playtest fixes (needs nurse review)

| Where | What changed | Basis |
|---|---|---|
| Nights 4W, 435 DKA transition | The drip-stop task is never offered before 2 hours after glargine; a stop at 115 minutes or later is the order followed. The debrief quotes the real minutes of overlap. | ADA DKA guidance: basal insulin 1 to 2 hours before stopping IV insulin; the order in the case says 2 hours. |
| Step-down, 603 post-cath | Sitting him up after first keeping him flat is now judged (the reversal replaces the earlier credit). | Bed rest with the hip straight after femoral sheath removal per order. |
| Step-down, 605 HIT | The HIT orders discontinue every heparin order (infusion, flushes) in the chart, add heparin to allergies, update problem, reason and lines, and make the PF4 antibody and duplex into tasks. | ASH 2018 HIT guideline: stop all heparin, including flushes; non-heparin anticoagulant; PF4 antibody; duplex. |
| Days 4W, 418 verbal orders | One-time ordered doses (KCl 40, furosemide 80) are tasks until given or held; the chest X-ray has an action and a result. | Every provider order needs a path to completion. |
| ED, 22 stroke | Once the last known well is corrected, the tenecteplase message and order are retired. | AHA/ASA 2019: thrombolysis within 4.5 hours of last known well. |
| Mother-baby, 212 PPH | Saying "asthma, so no carboprost" in the request counts as telling the provider; holding a suggested carboprost is credited with the reason. Dr. Brennan and the hemorrhage team now arrive. | ACOG PB 183: carboprost contraindicated in asthma. |
| Mother-baby, 214 magnesium | The second call states the rate actually running; the debrief quotes only a magnesium level that resulted. | |
| L&D, 223 rupture | Debrief and OR course agree: two units (STAT call within 5 min), three (within 10), six with hysterectomy (later). | Internal consistency. |
| L&D, 224 intraamniotic infection | One charted temperature is quoted everywhere; the fever is dated from the first charted temperature of 38 or more. | |
| Adult psych, 309 | Dr. Iyer, the transfer and the note quote the resulted sodium. The emergency-medication and restraint notes include the observed behavior (knocked the medication cup away and threw it). | Chart the observed behavior (CMS 482.13). |
| Teen psych, 405 | Scheduled diphenhydramine 25 mg PO every 6 hours for 48 hours reaches the MAR (first dose 6 hours after the IM dose); haloperidol PRN is discontinued and listed as an allergy. | |
| Peds, 505 / 501 / 509 | Wrong-weight orders are discontinued in the chart after correction; NG-feed judgment uses the charted RR; the asthma debrief reports real neb timing and the steroid. | |
| Evenings 4W, CIWA | A lorazepam CIWA-protocol dose is reassessed with a CIWA score, not a general look. | Symptom-triggered CIWA-Ar protocol. |

## October 10, 2026: Shift 11, Days in Labor and Delivery (needs L&D nurse review)

| Patient | Teaching | Basis |
|---|---|---|
| 221 oxytocin induction | Tachysystole is more than 5 contractions in 10 minutes averaged over 30; it is about the uterus, not the FHR category. On oxytocin with tachysystole: reduce or stop, left lateral, IV bolus, tell the provider, terbutaline if it persists off oxytocin. The order set's "increase every 30 minutes" is not a reason to go up on a tachysystolic uterus. Maternal oxygen is not routine intrauterine resuscitation. Restart at half the last rate after about 30 minutes of a Category I tracing, per protocol. | ACOG Practice Bulletins 106 and 107; ACOG Committee Opinion on oxygen for intrauterine resuscitation (2022); AWHONN oxytocin safety guidance. |
| 222 epidural, then an unplanned birth | Epidural hypotension with a prolonged deceleration: left lateral, bolus, phenylephrine per the anesthesia order, call anesthesia. A full bladder under an epidural slows descent and raises PPH risk: scan and straight cath. Unattended birth: call for help, never tell her to cross her legs or hold the head back, controlled delivery of the head, check for a nuchal cord, dry and stimulate, skin to skin, delayed cord clamping 30 to 60 seconds for a vigorous term baby, no traction on the cord, postpartum oxytocin, fundal check. APGAR at 1 and 5 minutes as an analysis decision. | ASA/SOAP obstetric anesthesia practice; AWHONN; NRP 8th edition; ACOG Committee Opinion 814 (delayed cord clamping); ACOG Practice Bulletin 183 (PPH). |
| 223 TOLAC with uterine rupture | TOLAC needs continuous EFM, IV access and a team immediately available; read the prior operative report. Recurrent variable decelerations are often the first sign. Rupture: sudden constant pain, loss of contractions on the toco, loss of station, fetal bradycardia, maternal tachycardia and falling pressure. STAT call for an emergency cesarean, second large-bore IV, type and crossmatch, neonatal team to the OR. Not "transition", not "the toco slipped". | ACOG Practice Bulletin 205 (VBAC). |
| 224 GBS and intraamniotic infection | Intrapartum GBS prophylaxis on time (penicillin G 5 million units, then 2.5 to 3 million every 4 hours; adequate at 4 hours or more before birth). Fever with a long rupture, maternal and fetal tachycardia and a tender uterus is intraamniotic infection: tell the provider, ampicillin plus gentamicin, acetaminophen, pediatrics to the birth. GBS prophylaxis does not treat it. Not by itself a reason for cesarean. | CDC/ACOG 2019 GBS prophylaxis (Committee Opinion 797); ACOG Committee Opinion 712. |
| Fetal monitoring throughout | Every strip read uses NICHD three-tier categories and is scored as an Analyze cues decision. The bedside monitor in labor rooms shows the FHR. | NICHD 2008 consensus; ACOG Practice Bulletin 106. |

## October 10, 2026: Shift 10, Days in the ICU (needs critical care nurse review)

| Patient | Teaching | Basis |
|---|---|---|
| 711 septic shock | Norepinephrine first line, MAP 65 or higher, wean above 75; vasopressin at 0.03 units/min added at norepinephrine 20 mcg/min or more; confirm central line tip before use; peripheral extravasation: stop, leave the catheter, aspirate, elevate, phentolamine per protocol; hold home beta-blocker and ACE inhibitor; repeat lactate; source control; surrogate consent when the patient lacks capacity. | Surviving Sepsis Campaign 2021; ISMP; Infusion Nurses Society standards. |
| 712 ARDS on the ventilator | Vt 6 mL/kg PBW, plateau 30 or less, permissive hypercapnia; SAT paired with SBT only when the SBT screen passes (FiO₂ and PEEP thresholds vary by protocol); CPOT and CAM-ICU; analgesia first; least-restrictive measures before restraints, with an order, monitoring and release by behavior; DOPE for a high-pressure alarm with falling SpO₂. | ARDSNet; SCCM PADIS 2018 and the ABCDEF bundle; CMS 42 CFR 482.13. |
| 713 day 1 after CABG | Tamponade from clotted chest tubes (Beck's triad, rising CVP, narrowing pulse pressure): STAT surgeon, bedside re-exploration; no routine stripping; potassium and magnesium replacement to prevent post-op AF; insulin infusion goal 140 to 180. | STS practice guidelines; AHA/AATS post-cardiac surgery care. |
| 714 anoxic brain injury | Timely OPO referral before any withdrawal discussion; the nurse doesn't raise donation (designated requester); surrogate hierarchy and substituted judgment; double effect for comfort medication; glycopyrrolate for secretions; family presence at extubation. | CMS 42 CFR 482.45; ANA Code of Ethics; palliative care practice. |
| Floor calls (ICU) | Damped arterial line before titrating; agitation on the ventilator; central line removal (air embolism prevention); hypoglycemia on an insulin infusion. | Standard critical care references. |

## October 10, 2026: NCLEX practice hub, pocket reference, transition-to-practice floor calls

**All of this needs nurse review before launch.** Written to current US standard teaching and checked item by item for an answer key that scores full marks and a rationale for every option.

| Where | What's new | Basis |
|---|---|---|
| `src/ngn-cases.js` | 19 unfolding case studies in the NGN format (one client, a chart that grows, six items in clinical judgment order): sepsis from pneumonia, heart failure, pediatric DKA, hip replacement with PE, variceal bleed, stroke, preeclampsia, infant dehydration, burns with inhalation injury, alcohol withdrawal, AKI with hyperkalemia, serotonin syndrome, COPD with pneumonia, post-op hemorrhage, TBI with rising ICP, placental abruption, preterm labor, bacterial meningitis, NMS. | Surviving Sepsis 2021, AHA/ACC HF 2022, ADA/ISPAD, CHEST VTE, AASLD, AHA/ASA stroke, ACOG 222, AAP, ABA/ABLS, ASAM, KDIGO, GOLD 2024, Brain Trauma Foundation 4th ed., ACOG fetal heart rate and preterm labor guidance, IDSA meningitis. |
| `src/ngn-bank.js` | 202 standalone items across all eight NCLEX-RN Client Needs categories and all six judgment steps, in every NGN format plus multiple choice, ordered response and 34 dosage calculations (tablets, liquids, IV and drip rates, mcg/kg/min titrations, heparin and insulin protocols, pediatric safe-dose ranges, Holliday-Segar, Parkland). | 2023 NCLEX-RN test plan; ISMP; NCSBN delegation guidelines; CDC isolation and immunization schedules; USPSTF screening. |
| `src/ref.js` | Pocket reference: 20 cards (labs, ABGs, drug levels and antidotes, high-alert meds, IV math, insulin, vitals by age, isolation, transfusion, rapid response, restraints, SBAR/I-PASS, delegation, prioritization, scales, documentation, fluids and electrolytes, OB/newborn, the new-grad year). Values are common textbook ranges; cards say where practice varies. | Standard references. |
| `src/floor-more.js` | 70 more floor calls (106 in all): professional and legal practice (unsafe assignment, error disclosure, near misses, chain of command, verbal and telephone orders, tenfold doses, consent, POLST, social media, gifts, blood refusal, interpreters, diversion, lateral violence, harassment, fatigue, floating, witnessing documents, student co-signs, recording, bedside report, late entries) and unit clinical calls (C. diff, TB, PPE doffing, pressure injury, CLABSI, CAUTI, suicide screen on a medical unit, elopement, latex, MRI safety, site marking, heparin double check, breast milk mix-up, car seats, VT, tamponade signs, PCA oversedation, postpartum preeclampsia, shoulder dystocia, newborn fever, and more). | ANA Code of Ethics, NCSBN, Joint Commission NPSGs, CDC, CMS, OSHA. |

## October 7, 2026: practice question rationales and focus practice

| Where | What's new or changed | Basis |
|---|---|---|
| All 27 shift practice items | A rationale for every answer option (why it is or isn't correct, and the trap), plus a test-taking tip, in `src/ngn-why.js`. | Standard NCLEX review practice; written to agree with each item's key and existing rationale. |
| 20 new focus items (`src/ngn-focus.js`) | Offered after the debrief for the player's two weakest clinical judgment steps; weighted to Analyze cues and Evaluate outcomes, which had 0 and 1 items before. Topics: HF left vs right, purging vs starvation, ABO jaundice, PE, pneumonia response, naloxone, CIWA, pediatric fluid bolus, adolescent suicide cues, newborn findings, opioid overdose, prolapsed cord, SBAR for unstable AF, de-escalation, delegation, pediatric give/hold, adolescent safety plan, intussusception, ED triage (atypical ACS), adolescent anorexia instability. | AHA/ACC, ADA, AAP, ACOG, NCSBN delegation guidelines, SAMHSA. **Needs clinical review.** |
| Nights on 4 West, DKA drop-down | The infusion runs until "ketoacidosis has resolved (gap closed, ketones down)" instead of "anion gap has closed". | 2024 ADA/EASD DKA consensus defines resolution by ketones and pH or bicarbonate. |
| Days on 4 West, give/hold matrix | Stem now says the client takes daily furosemide, which the potassium rationale relied on. | Internal consistency. |

## October 3, 2026: two new shifts

| Shift | What's new | Basis |
|---|---|---|
| Days on 2 North | Postpartum hemorrhage: QBL by weighed pads, 1,000 mL threshold, uterotonic contraindications (carboprost in asthma, methylergonovine in hypertension), TXA within 3 hours of birth. | ACOG Practice Bulletin 183; WOMAN trial; CMQCC OB Hemorrhage Toolkit. |
| Days on 2 North | Magnesium therapeutic range 4.8–8.4 mg/dL, hourly reflex/RR/urine checks, calcium gluconate 1 g for toxicity; severe hypertension treated within 30–60 minutes with labetalol, hydralazine or immediate-release nifedipine. | ACOG Practice Bulletin 222 and Committee Opinion 767. |
| Days on 2 North | Newborn hypoglycemia: 45 mg/dL target from 4–24 hours, dextrose 40% gel 0.5 mL/kg, recheck in an hour; hepatitis B vaccine within 24 hours, vastus lateralis. | AAP 2011 clinical report; Sugar Babies trial; ACIP. |
| Days on 2 North | EPDS with any positive item 10 needs same-day assessment; Rh immune globulin 300 mcg within 72 hours. | ACOG Clinical Practice Guideline 4 (2023); ACOG Practice Bulletin 181. |
| Evenings in the ED | Stroke: last known well vs. time found, 4.5-hour thrombolytic window, tenecteplase 0.25 mg/kg (max 25 mg), BP under 185/110, thrombectomy up to 24 hours for large-vessel occlusion. | AHA/ASA 2019 guideline and updates; FDA tenecteplase approval. |
| Evenings in the ED | Inferior STEMI: repeat ECGs for ongoing symptoms, V4R, nitrates avoided with RV involvement; aspirin chewed. | ACC/AHA STEMI guidance. |
| Evenings in the ED | Anaphylaxis: epinephrine 0.01 mg/kg IM (max 0.5 mg) in the thigh, repeat in 5–15 minutes, observation for biphasic reactions. | 2023 AAAAI/ACAAI anaphylaxis practice parameter. |
| Evenings in the ED | Warfarin-associated subdural: 4-factor PCC 25 units/kg for INR 2–4, vitamin K 10 mg IV slowly. | ACC 2020 expert consensus on bleeding with oral anticoagulants. |

## October 2, 2026 sweep

| Shift | What changed | Why |
|---|---|---|
| Days on 4 West | Sepsis antibiotic timing rationale now gives 1 hour (probable sepsis or shock) and 3 hours (possible sepsis without shock). | Surviving Sepsis Campaign 2021. "Within an hour" for everyone was out of date. |
| Days on 4 West | Penicillin–ceftriaxone rationale notes very low cross-reactivity with third-generation cephalosporins. | 2022 AAAAI/ACAAI drug allergy practice parameter. |
| Days on 4 West | Lactate 2–4 is reported as elevated (notify per sepsis protocol); only ≥ 4 is called a critical value. | Calling 2.1 a "critical value" doesn't match most lab policies. |
| Days on 4 West | Cardiology note added for Mr. Ortiz (HFrEF): SGLT2 inhibitor, MRA and ARNI planned once euvolemic. | 2022 AHA/ACC/HFSA heart failure guideline (four-drug GDMT). His regimen alone looked outdated. |
| Evenings on 4 West | Pancreatitis: NPO order now says "for now, reassess for early oral feeding". Tray rationale reframed as a diet-order mismatch, not "food harms the pancreas". | ACG 2024 / AGA guidance favors early oral feeding in mild pancreatitis. |
| Evenings on 4 West | Thiamine-before-dextrose rationale adds: never delay glucose for a hypoglycemic patient. | Current Wernicke prevention guidance. |
| Evenings on 4 West | Hyperkalemia insulin check notes many protocols use 5 units or add dextrose in kidney failure or glucose under ~125. | Hypoglycemia risk after insulin for hyperkalemia (KDIGO, UK Kidney Association). |
| Evenings on 4 West | Transfusion order is now one unit, recheck, second unit if still under 7 or rebleeding. | Single-unit transfusion and restrictive thresholds (AABB 2023, ACG UGIB). |
| Evenings on 4 West | Pre-op checklist says "nothing by mouth since arrival" instead of "NPO since midnight". | ASA fasting guidance no longer uses midnight. |
| Nights on 4 West | DKA potassium hold threshold raised from 3.3 to 3.5; replacement range 3.5–5.0. Practice question updated to match. | 2024 ADA/EASD/JBDS/AACE/DTS consensus on hyperglycemic crises. |
| Nights on 4 West | Stroke thrombolytic is now tenecteplase 0.25 mg/kg single bolus (21 mg); BP thresholds unchanged. | FDA approval for acute ischemic stroke (2025) and widespread adoption. |
| Days on 6 East | Troponins shown as high-sensitivity troponin I in ng/L. | Most US hospitals now report hs-troponin. |
| Floor calls | Needlestick: HIV PEP as soon as possible, ideally within 2 hours, no later than 72. | Adds the outer limit. |

Reviewed and left as is: hypoglycemia rule of 15, CO₂ retainer oxygen targets, CIWA-Ar protocol, transfusion reaction steps, PCA/POSS and naloxone titration, HIT recognition and argatroban, AF rate control in HFrEF, retroperitoneal bleed, QTc and citalopram limits, lithium toxicity, clozapine constipation, California holds and Riese, CMS seclusion/restraint and the one-hour face-to-face, refeeding labs, acute dystonia, acetaminophen overdose, mandated reporting, bronchiolitis supportive care, sickle cell pain and acute chest, weight-based pediatric dosing, pediatric asthma.

These edits change each shift's content version, so reviewers should use the links sent after this date.
