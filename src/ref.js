/* The Shift — pocket reference: short cards for the floor and the NCLEX (labs, meds, math, safety, communication,
   scales, maternal-newborn). Values are common textbook ranges; cards say where practice varies. Needs nurse review. */
window.Shift = window.Shift || {};
window.Shift.ref = [
 {
  "id": "labs-chem",
  "title": "Chemistry and electrolytes",
  "group": "Labs and vitals",
  "blurb": "Common adult chemistry ranges and what to watch for when an electrolyte is low or high.",
  "blocks": [
   {
    "h": "Basic panel",
    "rows": [
     [
      "Sodium (Na)",
      "135 to 145 mEq/L"
     ],
     [
      "Potassium (K)",
      "3.5 to 5.0 mEq/L"
     ],
     [
      "Chloride (Cl)",
      "98 to 106 mEq/L",
      "Tracks with Na; high after large NS volumes"
     ],
     [
      "CO2 / bicarbonate",
      "22 to 29 mEq/L",
      "Low suggests metabolic acidosis"
     ],
     [
      "BUN",
      "10 to 20 mg/dL",
      "High with dehydration, GI bleed, kidney injury"
     ],
     [
      "Creatinine",
      "0.6 to 1.2 mg/dL",
      "Best routine kidney marker; varies by sex and muscle mass"
     ],
     [
      "Glucose, fasting",
      "70 to 99 mg/dL",
      "Under 70 is hypoglycemia"
     ]
    ]
   },
   {
    "h": "Other chemistries",
    "rows": [
     [
      "Calcium, total",
      "8.5 to 10.5 mg/dL",
      "Low albumin lowers total Ca; check ionized"
     ],
     [
      "Calcium, ionized",
      "4.5 to 5.3 mg/dL",
      "About 1.12 to 1.32 mmol/L"
     ],
     [
      "Magnesium (Mg)",
      "1.5 to 2.5 mg/dL",
      "Some labs report 1.3 to 2.1 mEq/L"
     ],
     [
      "Phosphorus (PO4)",
      "2.5 to 4.5 mg/dL",
      "Moves opposite to calcium"
     ],
     [
      "Albumin",
      "3.5 to 5.0 g/dL",
      "Low with malnutrition, liver disease, critical illness"
     ],
     [
      "Ammonia",
      "15 to 45 mcg/dL",
      "Range varies widely by lab; high in liver failure (confusion, asterixis)"
     ],
     [
      "Lactate",
      "Under 2 mmol/L",
      "2 or higher is concerning; 4 or higher signals severe hypoperfusion in sepsis"
     ]
    ]
   },
   {
    "h": "Key nursing concern: low / high",
    "rows": [
     [
      "Na",
      "Low: confusion, seizures. High: thirst, agitation, seizures",
      "Correct slowly; fast correction risks brain injury"
     ],
     [
      "K",
      "Low: weakness, U waves, dysrhythmias. High: peaked T waves, dysrhythmias, arrest",
      "Low K raises digoxin toxicity risk"
     ],
     [
      "Ca",
      "Low: tetany, Chvostek and Trousseau signs, long QT. High: weakness, constipation, stones, short QT"
     ],
     [
      "Mg",
      "Low: tremor, hyperreflexia, torsades, seizures. High: lost reflexes, low RR, bradycardia, hypotension",
      "Low Mg often travels with low K"
     ],
     [
      "PO4",
      "Low: weakness, respiratory muscle failure. High: low Ca signs, itching in CKD",
      "Watch PO4 with refeeding"
     ]
    ]
   }
  ],
  "src": "Common adult reference ranges from nursing lab texts; ranges vary by lab, so use your facility's."
 },
 {
  "id": "labs-heme",
  "title": "Hematology and coagulation",
  "group": "Labs and vitals",
  "blurb": "Blood counts, clotting tests, anticoagulant targets and transfusion thresholds at a glance.",
  "blocks": [
   {
    "h": "Blood counts",
    "rows": [
     [
      "Hemoglobin (Hgb)",
      "Male 14 to 18 g/dL; female 12 to 16 g/dL",
      "Lab ranges vary"
     ],
     [
      "Hematocrit (Hct)",
      "Male 42% to 52%; female 37% to 47%",
      "About 3 x Hgb"
     ],
     [
      "WBC",
      "5,000 to 10,000/mm3",
      "Some labs 4,500 to 11,000"
     ],
     [
      "ANC",
      "Neutropenia under 1,500/mm3; severe under 500",
      "ANC = WBC x (% neutrophils + % bands) / 100"
     ],
     [
      "Platelets",
      "150,000 to 400,000/mm3"
     ],
     [
      "Platelets, bleeding risk",
      "Under 50,000: bleeding with procedures or trauma; under 20,000: spontaneous bleeding risk; under 10,000: usual prophylactic transfusion threshold",
      "Bleeding precautions per policy"
     ]
    ]
   },
   {
    "h": "Coagulation",
    "rows": [
     [
      "PT",
      "About 11 to 12.5 seconds",
      "Varies by lab"
     ],
     [
      "INR, normal",
      "0.8 to 1.1"
     ],
     [
      "INR, on warfarin",
      "2 to 3 for most indications",
      "2.5 to 3.5 for mechanical mitral and some higher-risk mechanical valves"
     ],
     [
      "aPTT, normal",
      "About 30 to 40 seconds",
      "Varies by lab"
     ],
     [
      "aPTT, on heparin",
      "Per protocol, often 1.5 to 2.5 x control"
     ],
     [
      "Anti-Xa",
      "Per protocol",
      "Many heparin protocols target 0.3 to 0.7 units/mL"
     ],
     [
      "D-dimer",
      "Normal under 0.5 mcg/mL FEU (500 ng/mL FEU)",
      "Negative helps rule out clot in low-risk patients; positive is nonspecific (surgery, pregnancy, cancer, infection, age)"
     ]
    ]
   },
   {
    "h": "Red cell transfusion thresholds (AABB 2023)",
    "rows": [
     [
      "Most stable hospitalized adults",
      "Hgb 7 g/dL",
      "Restrictive strategy"
     ],
     [
      "Cardiac surgery",
      "Hgb 7.5 g/dL"
     ],
     [
      "Orthopedic surgery or existing cardiovascular disease",
      "Hgb 8 g/dL"
     ],
     [
      "Active bleeding, symptoms, acute coronary syndrome",
      "Clinical judgment; not a number alone"
     ],
     [
      "Expected rise",
      "1 unit raises Hgb about 1 g/dL, Hct about 3%"
     ]
    ]
   }
  ],
  "src": "Common adult reference ranges; AABB 2023 red cell transfusion guideline; ranges vary by lab and protocols vary by facility."
 },
 {
  "id": "labs-abg",
  "title": "ABG interpretation",
  "group": "Labs and vitals",
  "blurb": "Normal arterial blood gas values and a fast method to name the acid-base problem.",
  "blocks": [
   {
    "h": "Normal values",
    "rows": [
     [
      "pH",
      "7.35 to 7.45",
      "Under 7.35 acidosis; over 7.45 alkalosis"
     ],
     [
      "PaCO2",
      "35 to 45 mmHg",
      "Respiratory (acid). High = acid"
     ],
     [
      "HCO3",
      "22 to 26 mEq/L",
      "Metabolic (base). Low = acid"
     ],
     [
      "PaO2",
      "80 to 100 mmHg",
      "Under 80 hypoxemia; under 60 significant"
     ],
     [
      "SaO2",
      "95% to 100%"
     ]
    ]
   },
   {
    "h": "4 steps (ROME)",
    "list": [
     "1. pH: acidosis or alkalosis?",
     "2. PaCO2: does it explain the pH? Respiratory = Opposite (pH down, CO2 up, or pH up, CO2 down)",
     "3. HCO3: does it explain the pH? Metabolic = Equal (pH and HCO3 move the same way)",
     "4. Compensation: is the other value moving the opposite way to fix it?",
     "Then check oxygenation (PaO2, SaO2)"
    ]
   },
   {
    "h": "Compensation",
    "rows": [
     [
      "Uncompensated",
      "pH abnormal; other value normal"
     ],
     [
      "Partially compensated",
      "pH abnormal; both PaCO2 and HCO3 abnormal",
      "Only if the second value moves to correct the pH; if both push the pH the same way, it is a mixed disorder"
     ],
     [
      "Fully compensated",
      "pH normal; both abnormal",
      "pH 7.35 to 7.39 leans acid, 7.41 to 7.45 leans alkaline"
     ],
     [
      "Speed",
      "Lungs: minutes to hours. Kidneys: hours to days"
     ]
    ]
   },
   {
    "h": "Classic causes",
    "rows": [
     [
      "Respiratory acidosis",
      "Hypoventilation: COPD, opioid or sedative overdose, neuromuscular weakness"
     ],
     [
      "Respiratory alkalosis",
      "Hyperventilation: anxiety or pain, early PE or hypoxemia, high altitude"
     ],
     [
      "Metabolic acidosis",
      "DKA, lactic acidosis (sepsis, shock), kidney failure, diarrhea",
      "Look for Kussmaul breathing"
     ],
     [
      "Metabolic alkalosis",
      "Vomiting or NG suction, diuretics with low K, excess antacids or bicarbonate"
     ]
    ]
   }
  ],
  "src": "Standard adult arterial blood gas ranges from nursing and critical care texts; lab ranges vary slightly."
 },
 {
  "id": "drug-levels",
  "title": "Drug levels and antidotes",
  "group": "Medications",
  "blurb": "Therapeutic ranges for narrow-window drugs and the antidote for common toxicities.",
  "blocks": [
   {
    "h": "Therapeutic levels",
    "rows": [
     [
      "Digoxin",
      "0.5 to 2.0 ng/mL",
      "Many target 0.5 to 0.9 in heart failure. Toxicity: nausea, vision changes, bradycardia, dysrhythmias; low K worsens it"
     ],
     [
      "Lithium",
      "Maintenance 0.6 to 1.2 mEq/L; toxic above 1.5",
      "Early: GI upset, coarse tremor. Severe: ataxia, confusion, seizures. Draw about 12 h after last dose"
     ],
     [
      "Phenytoin",
      "10 to 20 mcg/mL (total)",
      "Toxicity: nystagmus, ataxia, slurred speech. Low albumin raises the free (active) fraction, so a normal total level can still be toxic"
     ],
     [
      "Vancomycin",
      "Per pharmacy protocol",
      "Now often AUC-guided (AUC 400 to 600); some still use troughs. Watch creatinine"
     ],
     [
      "Theophylline",
      "5 to 15 mcg/mL",
      "Toxicity: tachycardia, vomiting, restlessness, seizures"
     ]
    ]
   },
   {
    "h": "Antidotes",
    "rows": [
     [
      "Opioids",
      "Naloxone",
      "Short acting; watch for re-sedation and withdrawal"
     ],
     [
      "Benzodiazepines",
      "Flumazenil",
      "Caution: can cause seizures, especially with long-term benzo use"
     ],
     [
      "Heparin",
      "Protamine sulfate",
      "Give slowly; only partly reverses LMWH"
     ],
     [
      "Warfarin",
      "Vitamin K; 4-factor PCC for major bleeding",
      "Give PCC with IV vitamin K"
     ],
     [
      "Dabigatran",
      "Idarucizumab"
     ],
     [
      "Apixaban, rivaroxaban",
      "4-factor PCC or andexanet alfa per protocol",
      "Andexanet availability varies; follow your facility's reversal protocol"
     ],
     [
      "Acetaminophen",
      "Acetylcysteine",
      "Most effective within 8 h of ingestion"
     ],
     [
      "Beta blocker overdose",
      "Glucagon"
     ],
     [
      "Digoxin",
      "Digoxin immune fab",
      "For life-threatening dysrhythmias or high K"
     ],
     [
      "Symptomatic bradycardia, organophosphates",
      "Atropine"
     ],
     [
      "Magnesium toxicity, hyperkalemia",
      "Calcium gluconate",
      "Protects the heart in high K; does not lower K"
     ],
     [
      "Insulin overdose, hypoglycemia",
      "Dextrose IV",
      "Glucagon if no IV access"
     ]
    ]
   }
  ],
  "src": "Common adult therapeutic ranges and antidotes from nursing pharmacology texts; 2020 ASHP/IDSA vancomycin consensus. Follow your pharmacy's protocols."
 },
 {
  "id": "high-alert",
  "title": "High-alert medications",
  "group": "Medications",
  "blurb": "Drugs that cause the most harm when given wrong, and the checks that prevent it.",
  "blocks": [
   {
    "h": "High-alert drugs (ISMP)",
    "rows": [
     [
      "Insulin",
      "Hypoglycemia",
      "Write out 'units'; check glucose and meal timing; one pen per patient"
     ],
     [
      "Heparin and anticoagulants",
      "Bleeding",
      "Check weight, concentration, bolus vs rate; follow aPTT or anti-Xa"
     ],
     [
      "Opioids",
      "Respiratory depression",
      "Assess sedation before RR drops; know if opioid-naive; naloxone nearby"
     ],
     [
      "Potassium chloride concentrate",
      "Cardiac arrest",
      "Never IV push. Use premixed bags on a pump; rate limits per policy"
     ],
     [
      "Magnesium sulfate",
      "Toxicity, respiratory depression",
      "Check reflexes, RR, urine output; calcium gluconate available"
     ],
     [
      "Chemotherapy",
      "Toxicity, extravasation",
      "Independent double check by two qualified practitioners per policy; hazardous drug PPE"
     ],
     [
      "Neuromuscular blockers",
      "Paralysis without breathing",
      "Only with a secured airway and sedation; labeled as paralyzing agent"
     ],
     [
      "Moderate and deep sedation",
      "Airway loss",
      "Continuous SpO₂ and capnography; reversal agents ready"
     ],
     [
      "Hypertonic saline (3%)",
      "Too-fast Na rise, fluid overload",
      "Frequent Na checks per protocol; pump only"
     ]
    ]
   },
   {
    "h": "Safety checks",
    "list": [
     "Independent double check: a second nurse checks order, drug, concentration, dose, rate, pump and line separately, not by reading your math",
     "Smart pump: always use the drug library; heed soft and hard limits; trace the line from bag to patient",
     "Look-alike sound-alike: read the label three times; note tall man lettering (hydrOXYzine vs hydrALAZINE)",
     "Rights: right patient, drug, dose, route, time, documentation, plus reason, response and right to refuse",
     "Barcode: scan the wristband and every med. An override is a stop sign: verify, then report the scan failure"
    ]
   }
  ],
  "src": "ISMP List of High-Alert Medications in Acute Care Settings; facility policies set exact double-check and rate rules."
 },
 {
  "id": "iv-math",
  "title": "IV and dosage math",
  "group": "Medications",
  "blurb": "Core dosage formulas with a worked example each, plus conversions and rounding rules.",
  "blocks": [
   {
    "h": "Formulas with examples",
    "rows": [
     [
      "Desired / have x quantity",
      "Order 500 mg; have 250 mg/5 mL",
      "500 / 250 x 5 = 10 mL"
     ],
     [
      "mL/h = volume / hours",
      "1,000 mL over 8 h",
      "1,000 / 8 = 125 mL/h"
     ],
     [
      "gtt/min = (volume x drop factor) / minutes",
      "1,000 mL over 8 h, 15 gtt/mL",
      "1,000 x 15 / 480 = 31.25, give 31 gtt/min"
     ],
     [
      "mcg/kg/min to mL/h",
      "mL/h = dose x kg x 60 / concentration (mcg/mL)",
      "5 mcg/kg/min, 80 kg, 400 mg in 250 mL (1,600 mcg/mL): 5 x 80 x 60 / 1,600 = 15 mL/h"
     ],
     [
      "units/h to mL/h",
      "mL/h = units/h / units per mL",
      "Heparin 25,000 units in 500 mL = 50 units/mL; 1,000 units/h / 50 = 20 mL/h"
     ],
     [
      "mg/kg/day divided",
      "Daily dose / number of doses",
      "45 mg/kg/day every 12 h, 22 lb (10 kg): 450 mg/day / 2 = 225 mg per dose"
     ]
    ]
   },
   {
    "h": "Conversions",
    "rows": [
     [
      "1 kg",
      "2.2 lb"
     ],
     [
      "1 tsp",
      "5 mL"
     ],
     [
      "1 tbsp",
      "15 mL"
     ],
     [
      "1 g",
      "1,000 mg"
     ],
     [
      "1 mg",
      "1,000 mcg"
     ],
     [
      "1 L",
      "1,000 mL"
     ]
    ]
   },
   {
    "h": "Safe rounding",
    "list": [
     "Leading zero always: 0.5 mg, never .5 mg",
     "Trailing zero never: 5 mg, never 5.0 mg",
     "Round only at the final step",
     "Drops: round to a whole number. Microdrip (60 gtt/mL): gtt/min = mL/h",
     "mL: tenths for most doses; hundredths under 1 mL, per policy",
     "Peds weight-based: compare the dose to the safe range before giving"
    ]
   }
  ],
  "src": "Standard dosage calculation methods; ISMP error-prone abbreviation guidance. Follow facility rounding policy."
 },
 {
  "id": "insulin",
  "title": "Insulin types",
  "group": "Medications",
  "blurb": "Onset, peak and duration by insulin type, plus mixing, hypoglycemia and sick day rules.",
  "blocks": [
   {
    "h": "Types (times vary by source)",
    "rows": [
     [
      "Rapid: lispro, aspart, glulisine",
      "Onset 15 min; peak 1 to 2 h; lasts 3 to 5 h",
      "Give within 15 min of a meal; have food in reach"
     ],
     [
      "Short: regular",
      "Onset 30 to 60 min; peak 2 to 4 h; lasts 5 to 8 h",
      "Give 30 min before meals; the usual IV insulin for drips"
     ],
     [
      "Intermediate: NPH",
      "Onset 1 to 2 h; peak 4 to 12 h; lasts 12 to 18 h",
      "Cloudy; roll, do not shake; hypoglycemia risk at peak"
     ],
     [
      "Long: glargine",
      "Onset 1 to 2 h; no peak; lasts about 24 h",
      "Once daily, same time each day"
     ],
     [
      "Long: detemir",
      "Onset 1 to 2 h; minimal peak; lasts 12 to 24 h",
      "Once or twice daily; discontinued in the US at the end of 2024; still used in some other countries"
     ],
     [
      "Long: degludec",
      "Onset about 1 h; no peak; lasts over 42 h",
      "Once daily"
     ]
    ]
   },
   {
    "h": "Mixing",
    "list": [
     "Clear before cloudy: draw up regular, then NPH",
     "Air into NPH, air into regular, withdraw regular, then withdraw NPH",
     "Never mix glargine, detemir or degludec with any other insulin in a syringe"
    ]
   },
   {
    "h": "Hypoglycemia: glucose under 70 mg/dL",
    "list": [
     "Rule of 15: give 15 g fast carbs (4 oz juice or regular soda, or 3 to 4 glucose tablets)",
     "Recheck in 15 min; repeat until 70 or higher",
     "Then a snack or meal with protein if the next meal is more than an hour away",
     "Cannot swallow or unconscious: glucagon IM, SC or nasal, or IV dextrose per protocol; turn on side"
    ]
   },
   {
    "h": "Sick day rules",
    "list": [
     "Keep taking basal insulin even if not eating",
     "Check glucose every 2 to 4 h; check ketones if over 240 mg/dL (type 1)",
     "Sip fluids hourly; use carb-containing liquids if unable to eat",
     "Call the provider for persistent vomiting, moderate or large ketones, or glucose that stays high"
    ]
   }
  ],
  "src": "Common textbook insulin action times and ADA hypoglycemia guidance; times vary by product, dose and patient."
 },
 {
  "id": "vitals-age",
  "title": "Vital signs by age",
  "group": "Labs and vitals",
  "blurb": "Adult and pediatric normal vital signs and common rapid response triggers.",
  "blocks": [
   {
    "h": "Adult normals",
    "rows": [
     [
      "Heart rate",
      "60 to 100/min"
     ],
     [
      "Respiratory rate",
      "12 to 20/min"
     ],
     [
      "Blood pressure",
      "Under 120/80 mmHg",
      "MAP 65 or higher for organ perfusion"
     ],
     [
      "Temperature",
      "About 36.5 to 37.5 °C (97.7 to 99.5 °F)",
      "Fever 38.0 °C (100.4 °F) or higher"
     ],
     [
      "SpO₂",
      "95% to 100%",
      "88% to 92% may be the target in some COPD patients"
     ]
    ]
   },
   {
    "h": "Rapid response triggers (typical)",
    "list": [
     "HR under 40 or over 130",
     "SBP under 90",
     "RR under 8 or over 28",
     "SpO₂ under 90% despite oxygen",
     "Acute change in consciousness",
     "Urine output under 50 mL in 4 hours",
     "Staff member worried about the patient",
     "Criteria vary by facility; use yours"
    ]
   },
   {
    "h": "Pediatric ranges (awake, PALS)",
    "rows": [
     [
      "Newborn (0 to 1 mo)",
      "HR 100 to 205; RR 30 to 60; SBP 60 to 84"
     ],
     [
      "Infant (1 to 12 mo)",
      "HR 100 to 180; RR 30 to 53; SBP 72 to 104"
     ],
     [
      "Toddler (1 to 2 y)",
      "HR 98 to 140; RR 22 to 37; SBP 86 to 106"
     ],
     [
      "Preschool (3 to 5 y)",
      "HR 80 to 120; RR 20 to 28; SBP 89 to 112"
     ],
     [
      "School-age (6 to 11 y)",
      "HR 75 to 118; RR 18 to 25; SBP 97 to 120"
     ],
     [
      "Adolescent (12 to 15 y)",
      "HR 60 to 100; RR 12 to 20; SBP 110 to 131"
     ]
    ]
   },
   {
    "h": "Pediatric hypotension (SBP below)",
    "rows": [
     [
      "Term newborn (0 to 28 days)",
      "Under 60 mmHg"
     ],
     [
      "Infant (1 to 12 mo)",
      "Under 70 mmHg"
     ],
     [
      "Child 1 to 10 y",
      "Under 70 + (2 x age in years)",
      "Age 4: 70 + 8 = 78 mmHg"
     ],
     [
      "Over 10 y",
      "Under 90 mmHg"
     ],
     [
      "Remember",
      "Tachycardia comes first; hypotension is a late sign in children"
     ]
    ]
   }
  ],
  "src": "Common adult normals; AHA PALS 2020 pediatric ranges (ranges vary by source); rapid response criteria vary by facility."
 },
 {
  "id": "isolation",
  "title": "Isolation precautions",
  "group": "Safety and procedures",
  "blurb": "Which precautions to use for which infections, PPE order, and when to use soap and water.",
  "blocks": [
   {
    "h": "Precaution types",
    "rows": [
     [
      "Standard",
      "Every patient",
      "Hand hygiene, PPE for expected exposure, respiratory hygiene, safe sharps and injections"
     ],
     [
      "Contact",
      "MRSA, VRE, scabies",
      "Gown and gloves on entry; dedicated equipment; private room or cohort"
     ],
     [
      "Contact plus (enteric)",
      "C. difficile",
      "Soap and water hand hygiene (alcohol does not kill spores); bleach or sporicidal cleaning"
     ],
     [
      "Droplet",
      "Influenza, pertussis, meningococcal meningitis, mumps, rubella",
      "Mask on entry to the room (CDC); private room preferred; patient masks for transport"
     ],
     [
      "Airborne",
      "TB, measles, varicella, disseminated zoster",
      "Fit-tested N95 or PAPR; AIIR (negative pressure), door closed; patient masks for transport"
     ]
    ]
   },
   {
    "h": "Good to know",
    "list": [
     "Varicella and disseminated zoster: airborne plus contact",
     "Meningococcal disease: droplet until 24 h of effective antibiotics",
     "Older texts say mask within 3 or 6 feet for droplet; CDC says mask on room entry"
    ]
   },
   {
    "h": "PPE order (CDC)",
    "rows": [
     [
      "Donning",
      "Gown, mask or respirator, goggles or face shield, gloves"
     ],
     [
      "Doffing",
      "Gloves, goggles or face shield, gown, mask or respirator",
      "Remove respirator after leaving the room and closing the door"
     ],
     [
      "After",
      "Hand hygiene right after removing all PPE",
      "Also between steps if hands get contaminated"
     ]
    ]
   },
   {
    "h": "Hand hygiene",
    "rows": [
     [
      "Alcohol-based rub",
      "Preferred for most care when hands are not visibly soiled",
      "At least 60% alcohol; rub until dry"
     ],
     [
      "Soap and water",
      "Visibly soiled hands, C. difficile, norovirus, before eating, after the restroom",
      "Rub at least 15 to 20 seconds"
     ]
    ]
   }
  ],
  "src": "CDC 2007 Guideline for Isolation Precautions (with updates), CDC PPE sequence, and CDC hand hygiene guidance for healthcare settings."
 },
 {
  "id": "transfusion",
  "title": "Blood transfusion",
  "group": "Safety and procedures",
  "blurb": "Steps before and during a transfusion, reaction signs, and what to do first if one happens.",
  "blocks": [
   {
    "h": "Before",
    "list": [
     "Verify order and signed consent",
     "Type and crossmatch current per policy",
     "IV commonly 18 to 20 gauge for adults; 22 to 24 gauge is acceptable per INS and policy; larger bore for rapid transfusion",
     "Prime blood tubing with filter using normal saline only; no other fluids or meds in the line",
     "Baseline vitals including temperature",
     "Two qualified staff verify at the bedside: two patient identifiers, ABO and Rh, unit number, expiration"
    ]
   },
   {
    "h": "During",
    "list": [
     "Start slowly and stay with the patient for the first 15 minutes",
     "Vitals at 15 minutes, then per policy",
     "Complete each unit within 4 hours",
     "Watch for reaction signs the whole time and after"
    ]
   },
   {
    "h": "Reactions",
    "rows": [
     [
      "Acute hemolytic",
      "Fever, chills, flank or back pain, hypotension, dark urine, sense of doom",
      "ABO mismatch; often in first minutes; most dangerous"
     ],
     [
      "Febrile non-hemolytic",
      "Fever, chills, rigors without hemolysis",
      "Most common; rule out hemolysis first"
     ],
     [
      "Allergic (mild)",
      "Hives, itching, flushing",
      "Antihistamine; may resume only per order"
     ],
     [
      "Anaphylactic",
      "Wheezing, stridor, angioedema, hypotension, shock",
      "Epinephrine, airway; linked to IgA deficiency"
     ],
     [
      "TACO",
      "Dyspnea, crackles, hypertension, JVD, orthopnea",
      "Fluid overload; sit up, diuretic per order; risk in HF, kidney disease, elderly"
     ],
     [
      "TRALI",
      "Sudden hypoxemia, bilateral infiltrates, fever, hypotension within 6 h",
      "Lung injury, not overload; oxygen and ventilation support"
     ],
     [
      "Septic",
      "High fever, rigors, hypotension, shock",
      "Contaminated unit, most often platelets; blood cultures"
     ]
    ]
   },
   {
    "h": "Any reaction: first steps",
    "list": [
     "Stop the transfusion",
     "Keep the line open with new tubing and normal saline",
     "Assess the patient and vitals; support airway and BP",
     "Notify the provider and blood bank",
     "Recheck the patient ID and unit labels",
     "Send the bag and tubing to the blood bank",
     "Send blood and urine samples per policy",
     "Document"
    ]
   }
  ],
  "src": "AABB standards and common nursing transfusion practice; follow your facility's transfusion policy."
 },
 {
  "id": "sbar-ipass",
  "title": "SBAR, I-PASS and speaking up",
  "group": "Communication and practice",
  "blurb": "Structure a call to a provider, a handoff, or a safety concern so nothing gets lost.",
  "blocks": [
   {
    "h": "SBAR",
    "rows": [
     [
      "S: Situation",
      "Who you are, unit, patient, the problem right now",
      "Lead with the concern"
     ],
     [
      "B: Background",
      "Diagnosis, admit date, relevant history, recent meds, code status",
      "Only what applies"
     ],
     [
      "A: Assessment",
      "Current vitals, focused findings, trend, what you think is going on",
      "Say it even if unsure"
     ],
     [
      "R: Recommendation",
      "What you need: see the patient, orders, transfer, labs",
      "Ask for a time frame"
     ]
    ]
   },
   {
    "h": "Example SBAR: deteriorating patient",
    "list": [
     "S: Dr. Lee, this is Sam, RN on 4 West, about Mr. Ruiz in 12. His BP dropped to 84/50 and HR is 122.",
     "B: Day 2 after bowel resection, full code, got morphine 2 mg IV an hour ago.",
     "A: Temp 38.6 °C (101.5 °F), RR 26, SpO₂ 91% on 2 L, new confusion, urine 15 mL last 2 hours. I am worried about sepsis.",
     "R: Please come see him in the next 15 minutes. Can I get a fluid bolus, lactate and blood cultures now? I am calling the rapid response team."
    ]
   },
   {
    "h": "I-PASS handoff",
    "rows": [
     [
      "I: Illness severity",
      "Stable, watcher, or unstable"
     ],
     [
      "P: Patient summary",
      "Diagnosis, events, current status, plan"
     ],
     [
      "A: Action list",
      "To-dos with timing and owner"
     ],
     [
      "S: Situation awareness",
      "What might happen and what to do if it does"
     ],
     [
      "S: Synthesis by receiver",
      "Receiver summarizes back and asks questions"
     ]
    ]
   },
   {
    "h": "Closing the loop",
    "list": [
     "Read-back: write down verbal or phone orders, read the full order back, get confirmation",
     "Closed-loop: sender gives message, receiver repeats it back, sender confirms",
     "Call-out task completion: 'Epi 1 mg in at 14:02'",
     "Verbal orders only when needed (emergency, provider unable to enter); never for chemotherapy except to hold or stop it, per most policies"
    ]
   },
   {
    "h": "Speaking up (TeamSTEPPS)",
    "rows": [
     [
      "CUS",
      "I am Concerned; I am Uncomfortable; this is a Safety issue",
      "Safety issue means stop and listen"
     ],
     [
      "Two-challenge rule",
      "State the concern at least twice",
      "If still ignored, take stronger action or go up the chain of command"
     ],
     [
      "Check-back",
      "Same as closed-loop communication"
     ]
    ]
   }
  ],
  "src": "AHRQ TeamSTEPPS 3.0; IHI SBAR toolkit; Starmer et al., I-PASS (NEJM 2014); Joint Commission NPSG.02"
 },
 {
  "id": "delegation",
  "title": "Delegation and scope",
  "group": "Communication and practice",
  "blurb": "Decide what you can hand off, to whom, and what stays with the RN.",
  "blocks": [
   {
    "h": "Five rights of delegation (NCSBN)",
    "rows": [
     [
      "Right task",
      "Within the delegatee's scope and job description; allowed by policy"
     ],
     [
      "Right circumstance",
      "Patient stable, outcome predictable, setting appropriate"
     ],
     [
      "Right person",
      "Delegatee is trained and competent for this task"
     ],
     [
      "Right directions and communication",
      "Clear, specific: what, when, limits, what to report"
     ],
     [
      "Right supervision and evaluation",
      "RN follows up, evaluates the outcome, intervenes if needed"
     ]
    ]
   },
   {
    "h": "Stays with the RN",
    "list": [
     "Initial and ongoing assessment, and interpreting data",
     "Nursing diagnosis and care planning",
     "Initial teaching and discharge teaching",
     "Evaluation of outcomes and response to treatment",
     "Unstable, new, or unpredictable patients",
     "Judgment calls: triage, deciding to escalate"
    ]
   },
   {
    "h": "LPN/LVN (varies by state and facility)",
    "list": [
     "Stable patients with predictable outcomes",
     "Data collection and focused reassessment; RN interprets",
     "Most oral, IM, subcut, topical meds",
     "Reinforce teaching the RN started",
     "Wound care, catheters, suctioning of stable airways",
     "IV therapy rules vary widely by state; check your state's practice act"
    ]
   },
   {
    "h": "UAP (CNA, patient care tech)",
    "list": [
     "Vital signs on stable patients; report values to the RN",
     "Hygiene, bathing, linen changes, positioning",
     "Ambulation and transfers of stable patients",
     "Intake and output, weights",
     "Feeding patients without dysphagia or aspiration risk",
     "Point-of-care glucose if trained and policy allows"
    ]
   },
   {
    "h": "Do not delegate",
    "rows": [
     [
      "Vitals on a new post-op or unstable patient",
      "RN"
     ],
     [
      "Feeding a patient with dysphagia or a new stroke",
      "RN (or trained staff per swallow plan)"
     ],
     [
      "First ambulation after surgery",
      "RN"
     ],
     [
      "Admission assessment, teaching a new insulin user",
      "RN"
     ],
     [
      "Assessing a patient who reports new chest pain",
      "RN, right now"
     ],
     [
      "Blood transfusion monitoring in first 15 minutes",
      "RN"
     ]
    ]
   }
  ],
  "src": "NCSBN and ANA National Guidelines for Nursing Delegation (2019); state nurse practice acts"
 },
 {
  "id": "priority",
  "title": "Prioritization",
  "group": "Communication and practice",
  "blurb": "Pick who to see first and what to do first, on the NCLEX and on the floor.",
  "blocks": [
   {
    "h": "Frameworks",
    "rows": [
     [
      "ABCs",
      "Airway, then breathing, then circulation",
      "Cardiac arrest: CAB, start compressions first"
     ],
     [
      "Maslow",
      "Physiologic needs, then safety, then love and belonging, esteem, self-actualization",
      "Psychosocial matters but body first"
     ],
     [
      "Acute vs chronic",
      "New problems beat long-standing ones"
     ],
     [
      "Actual vs potential",
      "A problem happening now beats a risk"
     ],
     [
      "Unstable vs stable",
      "Changing or worsening beats steady"
     ],
     [
      "Unexpected vs expected",
      "A finding not explained by the diagnosis is the red flag"
     ],
     [
      "Safety first",
      "Remove immediate danger: falls, wrong patient, restraints, fire"
     ],
     [
      "Nursing process",
      "Assess before you act",
      "Exception: emergency, act first (call for help, start CPR)"
     ]
    ]
   },
   {
    "h": "Which patient first",
    "list": [
     "Read each patient: is this expected for the condition?",
     "Look for airway, breathing, circulation, or neuro changes",
     "Unexpected plus unstable equals see first",
     "Then time-critical: STAT meds, sliding scale before meals, pre-op",
     "Then routine care and teaching",
     "Stable, expected findings can wait or be delegated"
    ]
   },
   {
    "h": "Common traps",
    "list": [
     "Calling the provider before assessing the patient (unless emergency)",
     "Choosing a pain or anxiety answer over an airway answer",
     "Picking the chronic finding: COPD with SpO₂ 89% may be their baseline",
     "Picking the expected finding: mild incisional pain day 1 post-op",
     "Delegating assessment or the unstable patient",
     "Leaving a patient in danger to get supplies or call someone",
     "Answers with 'always' or 'never' are usually wrong"
    ]
   }
  ],
  "src": "NCSBN NCLEX-RN Test Plan (2023); Maslow hierarchy; AHA 2020 Guidelines for CAB"
 },
 {
  "id": "scales",
  "title": "Assessment scales",
  "group": "Assessment scales",
  "blurb": "Score ranges and action points for the scales you will chart most.",
  "blocks": [
   {
    "h": "Glasgow Coma Scale (3 to 15)",
    "rows": [
     [
      "Eye opening",
      "1 to 4",
      "4 spontaneous, 3 to voice, 2 to pain, 1 none"
     ],
     [
      "Verbal",
      "1 to 5",
      "5 oriented, 4 confused, 3 inappropriate words, 2 sounds, 1 none"
     ],
     [
      "Motor",
      "1 to 6",
      "6 obeys, 5 localizes, 4 withdraws, 3 flexion, 2 extension, 1 none"
     ],
     [
      "8 or less",
      "Severe; protect the airway",
      "Drop of 2 or more points: escalate now"
     ]
    ]
   },
   {
    "h": "Risk scales",
    "rows": [
     [
      "Braden (pressure injury)",
      "6 to 23; lower is worse",
      "18 or less at risk; 9 or less very high risk"
     ],
     [
      "Morse fall scale",
      "0 to 125",
      "45 or more high risk (cutoff varies by facility)"
     ]
    ]
   },
   {
    "h": "Withdrawal scales",
    "rows": [
     [
      "CIWA-Ar (alcohol)",
      "10 items, 0 to 67",
      "Treat at 8 to 10 or more per protocol; over 15 to 20 severe"
     ],
     [
      "COWS (opioid)",
      "5 to 12 mild; 13 to 24 moderate",
      "25 to 36 moderately severe; over 36 severe"
     ]
    ]
   },
   {
    "h": "Pain scales",
    "rows": [
     [
      "Numeric",
      "0 to 10",
      "Adults and children who can self-report"
     ],
     [
      "Wong-Baker FACES",
      "0 to 10",
      "Children 3 years and older"
     ],
     [
      "FLACC",
      "0 to 10",
      "Preverbal children 2 months to 7 years"
     ],
     [
      "CPOT",
      "0 to 8",
      "Nonverbal critically ill adults; over 2 suggests pain"
     ],
     [
      "PAINAD",
      "0 to 10",
      "Advanced dementia"
     ]
    ]
   },
   {
    "h": "POSS (opioid sedation)",
    "rows": [
     [
      "S",
      "Sleep, easy to arouse",
      "Acceptable"
     ],
     [
      "1",
      "Awake and alert",
      "Acceptable"
     ],
     [
      "2",
      "Slightly drowsy, easily aroused",
      "Acceptable"
     ],
     [
      "3",
      "Frequently drowsy, drifts off mid-conversation",
      "Unacceptable: hold or reduce opioid per order, monitor sedation and RR closely, notify provider"
     ],
     [
      "4",
      "Somnolent, minimal or no response",
      "Stop opioid, stimulate, consider naloxone, call rapid response"
     ]
    ]
   }
  ],
  "src": "Teasdale and Jennett (GCS); Braden Scale; Morse (1989); Sullivan et al. (CIWA-Ar); Wesson and Ling (COWS); Pasero (POSS); ASPMN pain assessment guidance"
 },
 {
  "id": "rapid-code",
  "title": "Rapid response and codes",
  "group": "Safety and procedures",
  "blurb": "When to call for help, what to bring, and the basics of a code blue.",
  "blocks": [
   {
    "h": "Call a rapid response",
    "list": [
     "Any time you are worried. You never need permission.",
     "Typical triggers (vary by facility): HR under 40 or over 130; SBP under 90",
     "RR under 8 or over 28; SpO₂ under 90% despite oxygen",
     "Acute change in mental status or new seizure",
     "New chest pain, threatened airway, uncontrolled bleeding",
     "Urine output under 50 mL in 4 hours"
    ]
   },
   {
    "h": "Have ready",
    "list": [
     "SBAR in your head",
     "Chart open, current vitals and trend",
     "Recent meds (opioids, sedatives, insulin, anticoagulants)",
     "Last labs, glucose, I&O",
     "Code status and allergies",
     "Stay with the patient; you know them best"
    ]
   },
   {
    "h": "Code blue roles",
    "rows": [
     [
      "Leader",
      "Runs the code, assigns roles, makes decisions"
     ],
     [
      "Compressors",
      "Two or more, rotate every 2 minutes"
     ],
     [
      "Airway",
      "Bag-mask, suction, airway adjuncts; RT or anesthesia"
     ],
     [
      "Defibrillator",
      "Pads on, rhythm checks, shocks"
     ],
     [
      "Medications",
      "Draws up and gives drugs, IV or IO access"
     ],
     [
      "Recorder",
      "Times, rhythms, shocks, drugs, calls out 2-minute marks"
     ]
    ]
   },
   {
    "h": "High-quality CPR (adult)",
    "rows": [
     [
      "Rate",
      "100 to 120 per minute"
     ],
     [
      "Depth",
      "At least 2 in (5 cm), not over 2.4 in (6 cm)"
     ],
     [
      "Recoil",
      "Full recoil; do not lean"
     ],
     [
      "Pauses",
      "Minimize; under 10 seconds for checks"
     ],
     [
      "Ratio without advanced airway",
      "30 compressions to 2 breaths"
     ],
     [
      "Advanced airway",
      "Continuous compressions, 1 breath every 6 seconds"
     ]
    ]
   },
   {
    "h": "Rhythms and drugs (ACLS)",
    "rows": [
     [
      "Shockable",
      "VF, pulseless VT",
      "Shock, CPR 2 min, epi after 2nd shock, amiodarone 300 mg after 3rd shock then 150 mg (or lidocaine)"
     ],
     [
      "Non-shockable",
      "Asystole, PEA",
      "CPR, epi as soon as possible, look for reversible causes (Hs and Ts)"
     ],
     [
      "Epinephrine",
      "1 mg IV/IO every 3 to 5 minutes"
     ]
    ]
   }
  ],
  "src": "AHA 2020 Guidelines for CPR and ECC (ACLS); IHI rapid response team guidance; facility RRT criteria"
 },
 {
  "id": "restraints",
  "title": "Restraints and seclusion",
  "group": "Safety and procedures",
  "blurb": "Rules for using restraints or seclusion safely, legally, and for the shortest time.",
  "blocks": [
   {
    "h": "Least restrictive first",
    "list": [
     "Restraint is a last resort for immediate safety, never for convenience or punishment",
     "Try alternatives first and document them",
     "Verbal de-escalation, calm voice, reduce stimulation",
     "Sitter or video monitoring, move closer to the station",
     "Treat causes: pain, hypoxia, toileting, delirium, withdrawal",
     "Camouflage lines, bed alarm, low bed, frequent rounding",
     "Involve family; reorient"
    ]
   },
   {
    "h": "Orders (CMS)",
    "rows": [
     [
      "PRN orders",
      "Not allowed",
      "Includes 'restrain as needed'"
     ],
     [
      "Violent or self-destructive: adults 18 and older",
      "Up to 4 hours per order",
      "Renew to continue"
     ],
     [
      "Ages 9 to 17",
      "Up to 2 hours per order"
     ],
     [
      "Under 9",
      "Up to 1 hour per order"
     ],
     [
      "Face-to-face evaluation",
      "Within 1 hour of starting (violent or self-destructive)",
      "By physician, LIP, or trained RN/PA"
     ],
     [
      "Non-violent (medical) restraint",
      "Renew per policy",
      "Commonly every calendar day"
     ],
     [
      "Emergency start",
      "RN may initiate per policy",
      "Get the order immediately"
     ]
    ]
   },
   {
    "h": "Monitoring",
    "list": [
     "Frequency per policy; violent restraint often continuous or every 15 minutes",
     "Circulation, sensation, and skin distal to and under the restraint",
     "Nutrition and hydration offered",
     "Toileting and hygiene",
     "Range of motion and release at least every 2 hours (one limb at a time if violent)",
     "Mental status, emotional state, readiness to end",
     "Remove at the earliest safe time, even before the order expires"
    ]
   },
   {
    "h": "Application",
    "list": [
     "Quick-release knot, tied to the bed frame, never the side rails",
     "Two fingers fit under the restraint",
     "Seclusion plus restraint at the same time: continuous in-person or audio-video monitoring",
     "Never restrain prone if avoidable; watch breathing"
    ]
   },
   {
    "h": "Document",
    "list": [
     "Behavior that required it and alternatives tried",
     "Order, type, time on and time off",
     "Every monitoring check and the patient's response",
     "Patient and family education",
     "Deaths associated with restraint or seclusion must be reported to CMS (some soft-restraint deaths are logged internally instead); report injuries per facility policy"
    ]
   }
  ],
  "src": "CMS Conditions of Participation 42 CFR 482.13(e) and (f); Joint Commission PC.03.05; facility restraint policy"
 },
 {
  "id": "documentation",
  "title": "Documentation and legal basics",
  "group": "Communication and practice",
  "blurb": "Chart so it is accurate, defensible, and safe to read.",
  "blocks": [
   {
    "h": "Charting rules",
    "list": [
     "Objective: what you saw, heard, measured. Quote the patient.",
     "No opinions or labels: 'yelled and threw a cup', not 'combative'",
     "Timely: chart as close to the event as possible",
     "Chart only care you gave; never chart before doing it",
     "Never chart for someone else or let them chart under your login",
     "Never alter, delete, or backdate an entry",
     "If it was not charted, it legally was not done"
    ]
   },
   {
    "h": "Fixing the record",
    "rows": [
     [
      "Late entry",
      "Label 'late entry', use the current date and time, state the time the care happened"
     ],
     [
      "Error (paper)",
      "Single line through, write 'error' per policy, initial and date; keep it readable"
     ],
     [
      "Error (EHR)",
      "Use the correction or addendum function; original stays in the audit trail"
     ]
    ]
   },
   {
    "h": "Joint Commission Do Not Use list",
    "rows": [
     [
      "U, u",
      "Write 'unit'",
      "Misread as 0, 4, or cc"
     ],
     [
      "IU",
      "Write 'international unit'",
      "Misread as IV or 10"
     ],
     [
      "Q.D., QD, q.d., qd",
      "Write 'daily'",
      "Confused with Q.O.D."
     ],
     [
      "Q.O.D., QOD, q.o.d., qod",
      "Write 'every other day'",
      "Confused with Q.D."
     ],
     [
      "Trailing zero (X.0 mg)",
      "Write 'X mg'",
      "1.0 misread as 10"
     ],
     [
      "No leading zero (.X mg)",
      "Write '0.X mg'",
      ".5 misread as 5"
     ],
     [
      "MS, MSO4, MgSO4",
      "Write 'morphine sulfate' or 'magnesium sulfate'",
      "Confused with each other"
     ]
    ]
   },
   {
    "h": "Incident and safety reports",
    "list": [
     "File for errors, near misses, falls, equipment failures",
     "Quality improvement tool, not discipline",
     "In the chart: document facts of the event, assessment, who was notified, and care given",
     "Do not write 'incident report filed' in the chart"
    ]
   },
   {
    "h": "Informed consent",
    "list": [
     "Provider explains the procedure, risks, benefits, and alternatives",
     "Nurse witnesses the signature and confirms the patient is competent, voluntary, and understands",
     "Patient not impaired by sedatives or opioids at signing",
     "Patient has questions or seems unsure: stop, do not sign, notify the provider",
     "Use a qualified medical interpreter, not family",
     "Patient may withdraw consent at any time"
    ]
   },
   {
    "h": "HIPAA",
    "list": [
     "Minimum necessary: access and share only what you need for your role",
     "No looking up coworkers, family, or famous patients",
     "No patient details in hallways, elevators, or social media",
     "Verify identity before giving information by phone"
    ]
   }
  ],
  "src": "Joint Commission Official Do Not Use List; HIPAA Privacy Rule 45 CFR 164.502(b); ANA Principles for Nursing Documentation"
 },
 {
  "id": "fluids-electrolytes",
  "title": "IV fluids and electrolytes",
  "group": "Medications",
  "blurb": "Which fluid does what, and the safety rules for replacing electrolytes.",
  "blocks": [
   {
    "h": "IV fluids",
    "rows": [
     [
      "0.9% NaCl (normal saline)",
      "Isotonic",
      "Volume, blood products (only fluid with blood); watch overload, hyperchloremic acidosis"
     ],
     [
      "Lactated Ringer's",
      "Isotonic",
      "Volume, surgery, burns; contains K and Ca; caution in severe liver failure"
     ],
     [
      "D5W",
      "Isotonic in the bag, hypotonic once glucose is metabolized",
      "Free water; not for resuscitation; avoid in increased ICP"
     ],
     [
      "0.45% NaCl",
      "Hypotonic",
      "Cellular dehydration, hypernatremia; avoid in increased ICP, burns, trauma"
     ],
     [
      "3% NaCl",
      "Hypertonic",
      "Severe symptomatic hyponatremia, cerebral edema; ICU or monitored setting; peripheral or central line per protocol"
     ]
    ]
   },
   {
    "h": "3% saline cautions",
    "list": [
     "Check sodium often (every 2 to 6 hours per protocol)",
     "Correct chronic hyponatremia slowly; common limit 8 to 10 mEq/L in 24 hours",
     "Too fast: osmotic demyelination syndrome"
    ]
   },
   {
    "h": "Potassium (IV)",
    "list": [
     "Never IV push. Never IM or subcut.",
     "Always diluted and on a pump",
     "Peripheral max rate per policy, commonly 10 mEq/h",
     "Faster rates (often up to 20 mEq/h) via central line with cardiac monitoring",
     "Check urine output first, at least 30 mL/h (0.5 mL/kg/h)",
     "Infusion burns peripherally; check the site often",
     "Correct low magnesium too, or potassium stays low"
    ]
   },
   {
    "h": "Magnesium and calcium",
    "rows": [
     [
      "IV magnesium",
      "Monitor deep tendon reflexes, RR, urine output",
      "Toxicity: lost reflexes, RR under 12; antidote calcium gluconate"
     ],
     [
      "Calcium gluconate",
      "Preferred for peripheral IV",
      "Give slowly; caution with digoxin"
     ],
     [
      "Calcium chloride",
      "About 3 times more elemental calcium; vesicant",
      "Central line preferred"
     ],
     [
      "Calcium with bicarbonate",
      "Do not mix in the same line",
      "Precipitates"
     ]
    ]
   },
   {
    "h": "Overload vs deficit",
    "rows": [
     [
      "Fluid overload",
      "Crackles, dyspnea, JVD, bounding pulse, edema, high BP, weight gain",
      "Low Hct and BUN from dilution"
     ],
     [
      "Fluid deficit",
      "Tachycardia, low or orthostatic BP, dry mucous membranes, low and dark urine, weight loss",
      "High Hct, BUN, urine specific gravity"
     ],
     [
      "Daily weight",
      "1 kg change is about 1 L of fluid",
      "Same scale, same time, same clothing"
     ]
    ]
   }
  ],
  "src": "ISMP High-Alert Medications (concentrated potassium); Infusion Nurses Society Standards (2024); common institutional electrolyte replacement protocols"
 },
 {
  "id": "ob-newborn",
  "title": "Maternal and newborn normals",
  "group": "Maternal and newborn",
  "blurb": "Fetal monitoring, postpartum checks, and newborn normals at a glance.",
  "blocks": [
   {
    "h": "Fetal heart rate",
    "rows": [
     [
      "Baseline",
      "110 to 160 bpm",
      "Over 10 minutes, rounded to 5 bpm"
     ],
     [
      "Absent variability",
      "Undetectable",
      "Concerning, especially with late or variable decels"
     ],
     [
      "Minimal variability",
      "5 bpm or less"
     ],
     [
      "Moderate variability",
      "6 to 25 bpm",
      "Reassuring; rules out acidemia at that time"
     ],
     [
      "Marked variability",
      "Over 25 bpm"
     ]
    ]
   },
   {
    "h": "Decelerations (VEAL CHOP)",
    "rows": [
     [
      "Variable",
      "Cord compression",
      "Reposition, stop oxytocin if persistent, notify provider; amnioinfusion per order"
     ],
     [
      "Early",
      "Head compression",
      "Benign, mirrors contraction; keep watching"
     ],
     [
      "Accelerations",
      "OK, well oxygenated",
      "No action"
     ],
     [
      "Late",
      "Placental insufficiency",
      "Stop oxytocin, lateral position, IV bolus, treat low BP, notify provider; oxygen per policy"
     ]
    ]
   },
   {
    "h": "Contractions",
    "list": [
     "Frequency: start of one to start of the next",
     "Duration: start to end of one contraction",
     "Normal: 5 or fewer in 10 minutes, averaged over 30 minutes",
     "Tachysystole: more than 5 in 10 minutes; reduce or stop oxytocin per protocol",
     "Check resting tone between contractions (soft to palpation)"
    ]
   },
   {
    "h": "Postpartum checks",
    "rows": [
     [
      "Fundus after birth",
      "Firm, midline, at or just below the umbilicus",
      "Rises to umbilicus around 12 hours"
     ],
     [
      "Involution",
      "Descends about 1 cm per day",
      "Usually not palpable by about day 10 to 14"
     ],
     [
      "Boggy fundus",
      "Massage, empty bladder, notify if not firming",
      "Uterotonics per order"
     ],
     [
      "Deviated to one side, usually right",
      "Full bladder",
      "Void or catheterize"
     ],
     [
      "Lochia rubra",
      "Days 1 to 3",
      "Red, small clots"
     ],
     [
      "Lochia serosa",
      "About days 4 to 10",
      "Pink to brown"
     ],
     [
      "Lochia alba",
      "About day 10 to 6 weeks",
      "Yellow-white"
     ],
     [
      "Heavy bleeding",
      "Saturating a pad in 1 hour or less; large clots",
      "Notify; pad in 15 minutes is an emergency"
     ]
    ]
   },
   {
    "h": "Hemorrhage",
    "rows": [
     [
      "Measure, do not estimate",
      "Quantitative blood loss: weigh pads (1 g = 1 mL), measure canisters"
     ],
     [
      "Postpartum hemorrhage",
      "Cumulative 1,000 mL or more, or any loss with signs of hypovolemia, within 24 hours",
      "Any birth route"
     ],
     [
      "Watch",
      "Rising HR is often first; BP drops late"
     ]
    ]
   },
   {
    "h": "Apgar (1 and 5 minutes)",
    "rows": [
     [
      "Appearance",
      "0 blue or pale all over; 1 blue hands and feet; 2 pink all over"
     ],
     [
      "Pulse",
      "0 absent; 1 under 100; 2 100 or more"
     ],
     [
      "Grimace",
      "0 none; 1 grimace; 2 cry, cough, sneeze"
     ],
     [
      "Activity",
      "0 limp; 1 some flexion; 2 active motion"
     ],
     [
      "Respiration",
      "0 absent; 1 slow, irregular, weak cry; 2 good cry"
     ],
     [
      "Score",
      "7 to 10 reassuring; 4 to 6 moderately abnormal; 0 to 3 low",
      "Under 7 at 5 minutes: repeat every 5 minutes up to 20"
     ]
    ]
   },
   {
    "h": "Newborn vitals",
    "rows": [
     [
      "Heart rate",
      "110 to 160 bpm",
      "May drop near 100 in deep sleep"
     ],
     [
      "Respiratory rate",
      "30 to 60 per minute",
      "Brief pauses under 20 seconds can be normal"
     ],
     [
      "Axillary temperature",
      "36.5 to 37.5 °C (97.7 to 99.5 °F)"
     ]
    ]
   },
   {
    "h": "Newborn glucose (AAP, at-risk late preterm and term)",
    "rows": [
     [
      "Birth to 4 hours",
      "Under 25 mg/dL: feed, recheck in 1 hour",
      "Still under 25: IV glucose; 25 to 40: refeed or IV glucose as needed"
     ],
     [
      "4 to 24 hours",
      "Under 35 mg/dL: feed, recheck in 1 hour",
      "Still under 35: IV glucose; 35 to 45: refeed or IV glucose as needed"
     ],
     [
      "Target",
      "45 mg/dL or more before routine feeds"
     ],
     [
      "Symptomatic and under 40 mg/dL",
      "IV glucose"
     ]
    ]
   },
   {
    "h": "Newborn meds",
    "rows": [
     [
      "Vitamin K (phytonadione)",
      "Over 1,500 g: 1 mg IM once, within 6 hours of birth",
      "1,500 g or less: 0.3 to 0.5 mg/kg IM; can follow the first feed or skin-to-skin; prevents vitamin K deficiency bleeding"
     ],
     [
      "Erythromycin 0.5% eye ointment",
      "Both eyes, within about 1 to 2 hours of birth",
      "Gonococcal ophthalmia prophylaxis; required in most states (laws vary by state)"
     ],
     [
      "Hepatitis B vaccine",
      "AAP: within 24 hours of birth (medically stable, 2,000 g or more)",
      "Mother HBsAg positive or unknown: vaccine within 12 hours (plus HBIG if positive). Federal guidance for HBsAg-negative mothers has changed recently; follow facility policy"
     ]
    ]
   }
  ],
  "src": "NICHD/ACOG three-tier FHR interpretation (ACOG Practice Bulletin 106); ACOG reVITALize and AWHONN QBL guidance; AAP Committee on Fetus and Newborn, Postnatal Glucose Homeostasis (2011); AAP vitamin K policy (2022); AAP and CDC/ACIP hepatitis B guidance; AAP/ACOG Guidelines for Perinatal Care"
 },
 {
  "id": "new-grad",
  "title": "New grad survival guide",
  "group": "Communication and practice",
  "blurb": "Habits and scripts for getting through your first shifts safely.",
  "blocks": [
   {
    "h": "Organize the shift",
    "list": [
     "Brain sheet: one box per patient with diagnosis, code status, allergies, lines, drips, labs, timed tasks",
     "Get report, then lay eyes on every patient in the first hour, sickest first",
     "First-hour checklist: ID band, airway and oxygen, pumps match orders, lines and drains, safety (bed low, call light, alarms on)",
     "Map timed meds, labs, and procedures on one timeline",
     "Cluster care: vitals, meds, assessment, and turns in one visit",
     "Recheck the plan at midday and 2 hours before shift end"
    ]
   },
   {
    "h": "Escalate and ask for help",
    "list": [
     "Chain of command (order varies by facility): charge nurse, then provider, then the provider's attending, then nurse manager or house supervisor",
     "Worried and the provider does not come or respond: keep going up the chain and call a rapid response",
     "Ask early, before you are drowning. 'I have 3 things due at 09:00; can you hang this antibiotic?'",
     "Not sure how to do a skill? Ask. Doing it wrong is the real risk.",
     "Document who you notified, when, and what they said"
    ]
   },
   {
    "h": "If you make a med error",
    "rows": [
     [
      "1. Assess",
      "Check the patient first: vitals, symptoms, response"
     ],
     [
      "2. Notify",
      "Provider and charge nurse right away; follow orders given"
     ],
     [
      "3. Report",
      "File a safety report; chart facts and care, not the report"
     ],
     [
      "4. Learn",
      "Find what failed: system or practice. Just culture separates honest error from at-risk or reckless choices."
     ],
     [
      "Disclose",
      "Patient disclosure per facility policy, usually with the provider"
     ]
    ]
   },
   {
    "h": "Unsafe assignment vs abandonment",
    "list": [
     "Before you accept: state your concern to the charge nurse with specifics (acuity, skills, ratio)",
     "Ask for changes: different patients, help, a resource nurse",
     "If you must take it, document objection per facility process (assignment despite objection form, varies by state and union)",
     "Abandonment: accepting the assignment, then leaving without a proper handoff",
     "Refusing before accepting is not abandonment; walking out mid-shift can be"
    ]
   },
   {
    "h": "Self-care and fatigue",
    "list": [
     "Eat, drink, and take your break; ask someone to cover your patients",
     "Fatigue causes errors like alcohol does; avoid stacking long shifts",
     "Drowsy driving home is a real risk; nap or arrange a ride",
     "Debrief after bad shifts; use your employee assistance program",
     "Mistakes and hard days are normal in year one"
    ]
   },
   {
    "h": "Habits that keep patients safe",
    "list": [
     "Check every order against the patient: does it make sense for this person today?",
     "Verify before you give: rights of med administration, two identifiers, allergies, scan",
     "Look at the patient, not the monitor",
     "Trends beat single values; compare to baseline",
     "Close the loop on every order, call, and handoff",
     "If it does not look right, stop and ask",
     "Recheck after every intervention: pain med, bolus, oxygen change",
     "Leave your patients the way you want to find them"
    ]
   }
  ],
  "src": "ANA Code of Ethics and position statements on assignments and abandonment; NCSBN Just Culture guidance; Joint Commission NPSG.01 (two identifiers); ANA fatigue position statement (2014)"
 }
];
