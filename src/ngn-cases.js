/* The Shift — NGN-style unfolding case studies. One client, a chart that grows as the case unfolds (record entries
   appear from item 'at' onward), and six items in clinical judgment order: recognize cues, analyze cues, prioritize
   hypotheses, generate solutions, take action, evaluate outcomes. Needs nurse review before launch. */
window.Shift = window.Shift || {};
window.Shift.ngnCases = [
 {
  "id": "cs-pneumonia-sepsis",
  "title": "Pneumonia that turns septic",
  "sp": "ms",
  "topic": "Sepsis from pneumonia",
  "client": "74-year-old man admitted to the medical-surgical unit with community-acquired pneumonia",
  "record": [
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "14:00",
    "text": "Direct admission from his primary care clinic. Three days of productive cough, fever and right-sided chest pain that is worse on deep breaths. Clinic chest x-ray: right lower lobe infiltrate. History: hypertension, type 2 diabetes. Home medications: lisinopril 20 mg daily, metformin 1,000 mg twice daily. Weight 70 kg (154 lb). No known allergies. Lives with his wife and is independent at home. Alert and oriented to person, place, time and situation on arrival."
   },
   {
    "tab": "Orders",
    "at": 0,
    "time": "14:00",
    "text": "Vital signs every 4 hours. Oxygen by nasal cannula to keep SpO₂ 92% or higher. Blood cultures x2 and sputum culture. Ceftriaxone 1 g IV daily and azithromycin 500 mg IV daily, first doses when available from pharmacy. 0.9% sodium chloride at 75 mL/h. CBC, basic metabolic panel. Metformin 1,000 mg PO at 08:00 and 17:00. Lisinopril 20 mg PO daily."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "14:00",
    "rows": [
     [
      "Temperature",
      "38.3 °C (100.9 °F)",
      "high"
     ],
     [
      "Heart rate",
      "98"
     ],
     [
      "Blood pressure",
      "128/74"
     ],
     [
      "Respiratory rate",
      "22",
      "high"
     ],
     [
      "SpO₂",
      "93% on 2 L nasal cannula"
     ]
    ]
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "15:30",
    "rows": [
     [
      "Temperature",
      "38.9 °C (102 °F)",
      "high"
     ],
     [
      "Heart rate",
      "118",
      "high"
     ],
     [
      "Blood pressure",
      "98/56 (MAP 70)",
      "low"
     ],
     [
      "Respiratory rate",
      "26",
      "high"
     ],
     [
      "SpO₂",
      "91% on 2 L nasal cannula",
      "low"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "15:30",
    "text": "Wife states he asked her three times what day it is. Oriented to person only. Coarse crackles over the right lower lobe. Coughing up rust-colored sputum. Respirations 26 and shallow. BP 98/56, was 128/74 at 14:00. No urine output since 09:00 per wife. States he feels tired and achy. Skin warm and flushed. Labs drawn; cultures not yet collected, antibiotics not yet received from pharmacy."
   },
   {
    "tab": "Laboratory Results",
    "at": 1,
    "time": "15:50",
    "rows": [
     [
      "WBC",
      "18,600/mm³",
      "high"
     ],
     [
      "Bands",
      "14%",
      "high"
     ],
     [
      "Lactate",
      "3.4 mmol/L",
      "high"
     ],
     [
      "Creatinine",
      "1.6 mg/dL (baseline 0.9 mg/dL)",
      "high"
     ],
     [
      "BUN",
      "32 mg/dL",
      "high"
     ],
     [
      "Glucose",
      "214 mg/dL",
      "high"
     ],
     [
      "Platelets",
      "148,000/mm³"
     ]
    ]
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "16:05",
    "text": "Sepsis orders. Blood cultures x2 from two separate sites and sputum culture, collect before antibiotics without delaying them. Give ceftriaxone 1 g IV and azithromycin 500 mg IV now, within 1 hour. 0.9% sodium chloride 2,100 mL (30 mL/kg) IV over 90 minutes; reassess BP, lung sounds and SpO₂ after each 500 mL. Repeat lactate at 18:00. Insert indwelling urinary catheter; hourly urine output. Titrate oxygen to SpO₂ 92% or higher. Hold metformin and lisinopril. Notify provider and ICU if MAP stays below 65 after fluids."
   },
   {
    "tab": "Vital Signs",
    "at": 4,
    "time": "16:05",
    "rows": [
     [
      "Temperature",
      "39.0 °C (102.2 °F)",
      "high"
     ],
     [
      "Heart rate",
      "124",
      "high"
     ],
     [
      "Blood pressure",
      "84/48 (MAP 60)",
      "low"
     ],
     [
      "Respiratory rate",
      "28",
      "high"
     ],
     [
      "SpO₂",
      "90% on 2 L nasal cannula",
      "low"
     ]
    ]
   },
   {
    "tab": "Intake and Output",
    "at": 5,
    "time": "18:00",
    "rows": [
     [
      "Urinary catheter inserted",
      "16:20, 30 mL residual"
     ],
     [
      "Urine 16:20 to 17:00",
      "40 mL"
     ],
     [
      "Urine 17:00 to 18:00",
      "45 mL"
     ],
     [
      "IV bolus",
      "2,100 mL completed 17:40"
     ]
    ]
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "18:00",
    "rows": [
     [
      "Temperature",
      "38.1 °C (100.6 °F)",
      "high"
     ],
     [
      "Heart rate",
      "102",
      "high"
     ],
     [
      "Blood pressure",
      "104/62 (MAP 76)"
     ],
     [
      "Respiratory rate",
      "28",
      "high"
     ],
     [
      "SpO₂",
      "89% on 4 L nasal cannula",
      "low"
     ]
    ]
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "18:00",
    "rows": [
     [
      "Lactate",
      "1.9 mmol/L (was 3.4)"
     ],
     [
      "Glucose",
      "188 mg/dL",
      "high"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "18:10",
    "text": "Oriented to person and place, not time. Fine crackles now heard in both lung bases, new since 16:00. Coarse crackles remain in the right lower lobe. Says he feels a little more short of breath. No peripheral edema."
   }
  ],
  "items": [
   {
    "id": "cs-pneumonia-sepsis-1",
    "type": "highlight",
    "step": "cues",
    "cn": "physio",
    "stem": "Refer to the chart. The nurse reviews the 15:30 nurses' note.",
    "q": "Highlight the findings that require immediate follow-up.",
    "parts": [
     {
      "t": "Wife states he asked her three times what day it is.",
      "ok": true,
      "why": "Yes: he was fully oriented at 14:00, so new confusion in an older adult with an infection is altered mentation, a qSOFA criterion and an early sign of sepsis."
     },
     {
      "t": "Oriented to person only.",
      "ok": true,
      "why": "Yes: a drop from full orientation to person only within 90 minutes reflects reduced brain perfusion or a septic encephalopathy and needs urgent action."
     },
     {
      "t": "Coarse crackles over the right lower lobe.",
      "ok": false,
      "why": "No: crackles over the known infiltrate are expected with his diagnosis. The trap is treating an expected local finding as the new problem."
     },
     {
      "t": "Coughing up rust-colored sputum.",
      "ok": false,
      "why": "No: rust-colored sputum is a classic finding of bacterial pneumonia and matches the admitting diagnosis; it does not signal a change."
     },
     {
      "t": "Respirations 26 and shallow.",
      "ok": true,
      "why": "Yes: a respiratory rate of 22 or higher is a qSOFA criterion, and rapid shallow breathing can be compensation for a rising lactate."
     },
     {
      "t": "BP 98/56, was 128/74 at 14:00.",
      "ok": true,
      "why": "Yes: a systolic pressure of 100 or lower is a qSOFA criterion, and a 30-point drop in 90 minutes suggests vasodilation from sepsis."
     },
     {
      "t": "No urine output since 09:00 per wife.",
      "ok": true,
      "why": "Yes: more than 6 hours without urine suggests the kidneys are underperfused, an early sign of organ dysfunction."
     },
     {
      "t": "States he feels tired and achy.",
      "ok": false,
      "why": "No: fatigue and aches are common with any febrile illness and do not by themselves point to deterioration."
     }
    ],
    "why": "He meets all three qSOFA criteria: new altered mentation, respiratory rate 22 or higher, and systolic BP 100 or lower. Together with no urine for hours, these point to sepsis with early organ dysfunction. The crackles and rusty sputum belong to the pneumonia he was admitted with.",
    "tip": "Compare each finding with the admission baseline; what is new or worse needs follow-up, and what matches the diagnosis is expected."
   },
   {
    "id": "cs-pneumonia-sepsis-2",
    "type": "matrix",
    "step": "analyze",
    "cn": "physio",
    "update": "It is 15:50. The laboratory results are back.",
    "stem": "Refer to the chart.",
    "q": "For each finding, indicate whether it is more consistent with the local lung infection or with sepsis (a systemic response with organ dysfunction).",
    "cols": [
     "Local lung infection (pneumonia)",
     "Sepsis"
    ],
    "rows": [
     {
      "t": "Coarse crackles and rust-colored sputum",
      "ans": 0,
      "why": "these come from exudate filling the alveoli of the infected lobe and are expected with pneumonia alone."
     },
     {
      "t": "Right-sided chest pain that worsens with deep breaths",
      "ans": 0,
      "why": "pleuritic pain comes from inflammation of the pleura next to the infected lobe, a local finding."
     },
     {
      "t": "New confusion, oriented to person only",
      "ans": 1,
      "why": "altered mentation shows the infection is now affecting the brain through poor perfusion and inflammation, a sign of organ dysfunction."
     },
     {
      "t": "BP 98/56 with heart rate 118",
      "ans": 1,
      "why": "widespread vasodilation lowers the pressure, and the heart speeds up to compensate; this is a systemic circulatory response."
     },
     {
      "t": "Lactate 3.4 mmol/L",
      "ans": 1,
      "why": "a lactate above 2 means tissues are not getting enough oxygen and are switching to anaerobic metabolism."
     },
     {
      "t": "Creatinine 1.6 mg/dL, baseline 0.9, with no urine since 09:00",
      "ans": 1,
      "why": "a rising creatinine with low output signals acute kidney injury from poor renal perfusion, another failing organ."
     }
    ],
    "why": "Pneumonia explains the findings in the chest. Sepsis is the body's dysregulated response to that infection, and it shows up in distant organs: the brain, the circulation, the kidneys and tissue oxygenation. Findings outside the lungs tell the nurse the infection has become a systemic emergency.",
    "tip": "Ask whether a finding is limited to the infected organ or shows another organ system failing; distant organ effects point to sepsis."
   },
   {
    "id": "cs-pneumonia-sepsis-3",
    "type": "cloze",
    "step": "hypo",
    "cn": "physio",
    "stem": "Refer to the chart.",
    "q": "Complete the sentences.",
    "parts": [
     "The client's qSOFA score is ",
     {
      "opts": [
       "3",
       "1",
       "2"
      ],
      "ans": 0,
      "whys": [
       "Yes: he has all three criteria: altered mentation, respiratory rate 26, and systolic BP 98, which is 100 or lower.",
       "No: this counts only one criterion. He has new confusion, a respiratory rate of 22 or higher, and a systolic BP of 100 or lower.",
       "No: this misses one criterion; the systolic BP of 98 counts because the cutoff is 100 or lower, not below 90."
      ]
     },
     ", and his lactate of 3.4 mmol/L reflects ",
     {
      "opts": [
       "tissue hypoperfusion",
       "normal muscle activity from coughing",
       "the effect of metformin alone"
      ],
      "ans": 0,
      "whys": [
       "Yes: with hypotension, confusion and low urine output, an elevated lactate means tissues are underperfused and using anaerobic metabolism.",
       "No: coughing does not raise lactate to this level, and the trap is explaining away a lactate that matches other perfusion signs.",
       "No: metformin can raise lactate, but it does not explain fever, falling BP and new confusion. Assume sepsis until proven otherwise."
      ]
     },
     ". The priority concern is ",
     {
      "opts": [
       "progression to septic shock",
       "dehydration from poor oral intake",
       "hyperglycemia from diabetes"
      ],
      "ans": 0,
      "whys": [
       "Yes: an infection with organ dysfunction and a falling BP can progress to shock within hours, and every hour of delayed treatment raises mortality.",
       "No: poor intake may contribute, but fever, new confusion, high WBC with bands and rising lactate point to a systemic infection, not simple dehydration.",
       "No: a glucose of 214 mg/dL is expected with infection and stress. It needs management but is not the life-threatening problem."
      ]
     },
     "."
    ],
    "why": "A qSOFA of 2 or more in a client with infection flags a high risk of poor outcomes. His lactate, kidney injury and new confusion show organ dysfunction, so this is sepsis. The danger now is septic shock, so it outranks his other problems.",
    "tip": "When several problems are present, pick the one that will kill the client fastest if it is not treated."
   },
   {
    "id": "cs-pneumonia-sepsis-4",
    "type": "matrix",
    "step": "solve",
    "cn": "mgmt",
    "stem": "Refer to the chart. The nurse plans for the first hour of sepsis care. The hospital sepsis protocol, based on the CMS SEP-1 measure, triggers a 30 mL/kg crystalloid bolus for hypotension (systolic BP below 90 or MAP below 65) or a lactate of 4 mmol/L or more.",
    "q": "For each intervention, indicate whether the nurse should anticipate it now, anticipate it only if protocol-defined hypotension or a lactate of 4 mmol/L or more develops, or not anticipate it.",
    "cols": [
     "Anticipate now",
     "Anticipate only if hypotension or lactate 4 or more",
     "Not anticipated"
    ],
    "rows": [
     {
      "t": "Blood cultures x2 from two sites before the first antibiotic dose",
      "ans": 0,
      "why": "cultures drawn before antibiotics identify the organism; once antibiotics are in, cultures may grow nothing."
     },
     {
      "t": "IV antibiotics within 1 hour of recognizing sepsis",
      "ans": 0,
      "why": "each hour of delay in antibiotics for sepsis raises the risk of death, so they are given as soon as cultures are drawn."
     },
     {
      "t": "Repeat lactate within 2 to 4 hours",
      "ans": 0,
      "why": "his first lactate is above 2 mmol/L, so it is remeasured to see whether perfusion is improving."
     },
     {
      "t": "0.9% sodium chloride 30 mL/kg IV bolus",
      "ans": 1,
      "why": "under this protocol the bolus is triggered by hypotension or a lactate of 4 or more; his systolic BP is 98, MAP 70 and lactate 3.4, so the nurse reassesses perfusion closely."
     },
     {
      "t": "Hold antibiotics until culture results identify the organism",
      "ans": 2,
      "why": "culture results take 24 to 72 hours. Waiting that long to treat sepsis is the trap; start broad coverage now."
     },
     {
      "t": "Give the scheduled 17:00 metformin",
      "ans": 2,
      "why": "metformin is held with acute kidney injury, a high lactate and an unstable client because it raises the risk of lactic acidosis."
     }
    ],
    "why": "The hour-1 sepsis bundle is: measure lactate, draw blood cultures before antibiotics, give broad-spectrum antibiotics, and give 30 mL/kg crystalloid for hypotension or lactate of 4 or more. Remeasure lactate if the first value is above 2. Surviving Sepsis 2021 suggests at least 30 mL/kg within 3 hours for sepsis-induced hypoperfusion or septic shock, so practice varies by facility; this protocol uses the SEP-1 triggers. Vasopressors follow if the MAP stays below 65 after fluids.",
    "tip": "Remember the bundle in its order: cultures, then antibiotics, with lactate and fluids triggered by the numbers."
   },
   {
    "id": "cs-pneumonia-sepsis-5",
    "type": "sata",
    "step": "act",
    "cn": "mgmt",
    "update": "It is 16:05. His BP is now 84/48 (MAP 60) and his heart rate is 124. The nurse has activated the rapid response team, and the provider has entered sepsis orders.",
    "stem": "Refer to the chart.",
    "q": "Which actions should the nurse take now? Select all that apply.",
    "opts": [
     {
      "t": "Give the rapid response team an SBAR report: suspected sepsis from pneumonia, new confusion, BP 84/48, lactate 3.4, no urine since 09:00.",
      "ok": true,
      "why": "Yes: a concise SBAR with the key trends lets the team act quickly and states clearly that the nurse suspects sepsis."
     },
     {
      "t": "Start the 2,100 mL 0.9% sodium chloride bolus as ordered.",
      "ok": true,
      "why": "Yes: his MAP is now below 65, so the 30 mL/kg crystalloid bolus is indicated to restore circulating volume and perfusion."
     },
     {
      "t": "Draw two sets of blood cultures from two different sites before the first antibiotic dose.",
      "ok": true,
      "why": "Yes: cultures come before antibiotics so the organism can be identified, and drawing them takes only minutes."
     },
     {
      "t": "Give ceftriaxone and azithromycin as soon as the blood cultures are drawn.",
      "ok": true,
      "why": "Yes: antibiotics must start within the first hour; blood cultures should not delay them more than a few minutes."
     },
     {
      "t": "Increase the oxygen to keep SpO₂ at 92% or higher.",
      "ok": true,
      "why": "Yes: his SpO₂ is 90% and the order allows titration; better oxygen delivery supports tissues that are already underperfused."
     },
     {
      "t": "Wait to give antibiotics until he can cough up a sputum specimen.",
      "ok": false,
      "why": "No: a sputum specimen can take a long time to obtain. Antibiotics are not delayed for it, which is the trap in this option."
     },
     {
      "t": "Give acetaminophen for the fever and recheck the BP in 1 hour.",
      "ok": false,
      "why": "No: treating the fever does not treat shock, and waiting an hour with a MAP of 60 delays lifesaving care."
     },
     {
      "t": "Place him flat with his legs raised higher than his head.",
      "ok": false,
      "why": "No: the Trendelenburg position does not reliably raise BP and makes breathing harder for a client with pneumonia."
     }
    ],
    "why": "His MAP has fallen below 65, so he now needs the full bundle at once. The nurse reports with SBAR, starts the fluid bolus, draws cultures and then gives antibiotics within the hour, and supports oxygenation. Nothing should delay the antibiotics.",
    "tip": "In sepsis, choose actions that restore perfusion and start antibiotics quickly; reject any option that waits."
   },
   {
    "id": "cs-pneumonia-sepsis-6",
    "type": "matrix",
    "step": "eval",
    "cn": "physio",
    "update": "It is 18:15. The bolus finished at 17:40, and both antibiotics were given by 16:40.",
    "stem": "Refer to the chart. The client weighs 70 kg.",
    "q": "For each finding, indicate whether it shows improvement or requires follow-up.",
    "cols": [
     "Improving or goal met",
     "Requires follow-up"
    ],
    "rows": [
     {
      "t": "BP 104/62 (MAP 76)",
      "ans": 0,
      "why": "the goal is a MAP of 65 or higher, so fluids have restored perfusion pressure without a vasopressor so far."
     },
     {
      "t": "Lactate 1.9 mmol/L, down from 3.4",
      "ans": 0,
      "why": "the lactate fell by more than 40% and is now below 2, showing tissues are getting enough oxygen again."
     },
     {
      "t": "Urine output 40 mL in 40 minutes, then 45 mL in the next hour",
      "ans": 0,
      "why": "the goal is at least 0.5 mL/kg/h, which is 35 mL/h for 70 kg; both periods meet it, so the kidneys are being perfused."
     },
     {
      "t": "Oriented to person and place, was oriented to person only",
      "ans": 0,
      "why": "his mental status is better than at 15:30, which reflects improved brain perfusion, though not yet back to baseline."
     },
     {
      "t": "Heart rate 102, down from 124",
      "ans": 0,
      "why": "a falling heart rate shows less need to compensate for low volume and vasodilation."
     },
     {
      "t": "RR 28, SpO₂ 89% on 4 L, new fine crackles in both bases",
      "ans": 1,
      "why": "worse oxygenation with new bilateral crackles after 2.1 L of fluid may be fluid overload or acute lung injury and must be reported now."
     }
    ],
    "why": "Most sepsis targets are met: MAP 65 or higher, lactate clearing, urine 0.5 mL/kg/h or more, and better mentation. His breathing is worse, though, and new crackles in both bases after a large bolus in an older adult need prompt reporting and reassessment of fluids and oxygen.",
    "tip": "Check each finding against its specific goal, and remember that one worsening system needs action even when others improve."
   }
  ]
 },
 {
  "id": "cs-heart-failure",
  "title": "Heart failure that tips over",
  "sp": "sd",
  "topic": "Acute decompensated heart failure",
  "client": "66-year-old woman with HFrEF (EF 30%) admitted to the cardiac step-down unit with acute decompensated heart failure",
  "record": [
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "08:30",
    "text": "Admitted from the emergency department with 5 days of worsening shortness of breath. Heart failure with reduced ejection fraction, EF 30% on echocardiogram 3 months ago. Hypertension. Ran out of furosemide 6 days ago and ate restaurant meals at a family reunion over the weekend. Home medications: furosemide 40 mg PO daily, carvedilol 12.5 mg PO twice daily, lisinopril 10 mg PO daily. Weight 82.5 kg (181.9 lb); usual dry weight 78 kg (172 lb)."
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "08:45",
    "text": "Sitting upright in bed; speaks in short phrases. States: 'I've been sleeping in my recliner for three nights. If I lie down I feel like I'm drowning.' Crackles bilaterally to the mid-lung fields. Jugular veins distended at 45 degrees. 3+ pitting edema of both ankles and shins. S3 heard at the apex. Skin warm and dry. Alert and oriented x4. Bowel sounds active in all four quadrants."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "08:45",
    "rows": [
     [
      "Temperature",
      "36.8 °C (98.2 °F)"
     ],
     [
      "Heart rate",
      "108, sinus tachycardia",
      "high"
     ],
     [
      "Blood pressure",
      "152/90",
      "high"
     ],
     [
      "Respiratory rate",
      "28",
      "high"
     ],
     [
      "SpO₂",
      "89% on room air; 93% on 2 L nasal cannula"
     ]
    ]
   },
   {
    "tab": "Laboratory Results",
    "at": 1,
    "time": "09:30",
    "rows": [
     [
      "BNP",
      "1,450 pg/mL",
      "high"
     ],
     [
      "Sodium",
      "132 mEq/L",
      "low"
     ],
     [
      "Potassium",
      "3.9 mEq/L"
     ],
     [
      "Magnesium",
      "1.9 mg/dL"
     ],
     [
      "BUN",
      "26 mg/dL",
      "high"
     ],
     [
      "Creatinine",
      "1.1 mg/dL"
     ]
    ]
   },
   {
    "tab": "Imaging",
    "at": 1,
    "time": "09:30",
    "text": "Chest x-ray: enlarged heart, pulmonary vascular congestion, small bilateral pleural effusions. No consolidation."
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "09:45",
    "text": "Furosemide 40 mg IV twice daily at 10:00 and 18:00, first dose now. Continue carvedilol and lisinopril. 2 g sodium diet. Fluid restriction 1.5 L/day. Daily weight before breakfast. Strict intake and output. Telemetry. Basic metabolic panel and magnesium at 17:00 and every morning. Notify provider for potassium below 3.5 mEq/L or magnesium below 1.8 mg/dL."
   },
   {
    "tab": "Intake and Output",
    "at": 4,
    "time": "17:00",
    "rows": [
     [
      "Intake 10:00 to 17:00",
      "700 mL"
     ],
     [
      "Urine output 10:00 to 17:00",
      "2,600 mL"
     ]
    ]
   },
   {
    "tab": "Laboratory Results",
    "at": 4,
    "time": "17:00",
    "rows": [
     [
      "Potassium",
      "3.2 mEq/L",
      "low"
     ],
     [
      "Magnesium",
      "1.6 mg/dL",
      "low"
     ],
     [
      "Sodium",
      "134 mEq/L",
      "low"
     ],
     [
      "Creatinine",
      "1.2 mg/dL"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "17:15",
    "text": "Breathing easier; speaking in full sentences. SpO₂ 94% on 2 L. Reports cramping in both calves. On telemetry."
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "08:00 (day 3)",
    "rows": [
     [
      "Heart rate",
      "78"
     ],
     [
      "Blood pressure",
      "118/72"
     ],
     [
      "Respiratory rate",
      "16"
     ],
     [
      "SpO₂",
      "95% on room air"
     ],
     [
      "Weight",
      "78.6 kg (173.3 lb)"
     ]
    ]
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "06:00 (day 3)",
    "rows": [
     [
      "Potassium",
      "4.1 mEq/L"
     ],
     [
      "Magnesium",
      "2.0 mg/dL"
     ],
     [
      "Sodium",
      "137 mEq/L"
     ],
     [
      "Creatinine",
      "1.1 mg/dL"
     ]
    ]
   }
  ],
  "items": [
   {
    "id": "cs-heart-failure-1",
    "type": "sata",
    "step": "cues",
    "cn": "physio",
    "stem": "Refer to the chart.",
    "q": "Which findings indicate fluid volume excess? Select all that apply.",
    "opts": [
     {
      "t": "Weight 82.5 kg, 4.5 kg above her dry weight",
      "ok": true,
      "why": "Yes: rapid weight gain is the most reliable sign of fluid retention; 1 kg of weight is about 1 L of fluid."
     },
     {
      "t": "Crackles bilaterally to the mid-lung fields",
      "ok": true,
      "why": "Yes: the failing left ventricle backs pressure into the pulmonary veins, pushing fluid into the alveoli."
     },
     {
      "t": "Sleeping in a recliner because lying down feels like drowning",
      "ok": true,
      "why": "Yes: orthopnea occurs because lying flat returns more blood to a heart that cannot pump it forward, worsening lung congestion."
     },
     {
      "t": "Jugular veins distended at 45 degrees",
      "ok": true,
      "why": "Yes: distended neck veins at 45 degrees show high right-sided filling pressure from excess circulating volume."
     },
     {
      "t": "3+ pitting edema of both ankles and shins",
      "ok": true,
      "why": "Yes: systemic venous congestion pushes fluid into dependent tissues, a sign of right-sided backup."
     },
     {
      "t": "Temperature 36.8 °C (98.2 °F)",
      "ok": false,
      "why": "No: a normal temperature makes infection less likely but says nothing about fluid status."
     },
     {
      "t": "Alert and oriented x4",
      "ok": false,
      "why": "No: normal mentation is reassuring about brain perfusion, but it is not a sign of fluid overload."
     },
     {
      "t": "Bowel sounds active in all four quadrants",
      "ok": false,
      "why": "No: normal bowel sounds are an expected finding and do not reflect volume status."
     }
    ],
    "why": "Her weight gain, crackles, orthopnea, distended neck veins and leg edema all show fluid retention from a weak left ventricle that has backed up into both the lungs and the body. Stopping her diuretic and eating salty meals tipped her into decompensation. The other findings are normal.",
    "tip": "For fluid status, look at weight, lungs, neck veins and edema; normal findings in other systems are distractors."
   },
   {
    "id": "cs-heart-failure-2",
    "type": "cloze",
    "step": "analyze",
    "cn": "physio",
    "update": "It is 09:30. The laboratory and imaging results are back.",
    "stem": "Refer to the chart.",
    "q": "Complete the sentences.",
    "parts": [
     "The BNP of 1,450 pg/mL reflects ",
     {
      "opts": [
       "ventricular stretch from volume overload",
       "death of heart muscle from a heart attack",
       "a normal result for her age"
      ],
      "ans": 0,
      "whys": [
       "Yes: the ventricles release BNP when they are stretched by excess volume and pressure, which supports heart failure as the cause of her dyspnea.",
       "No: troponin, not BNP, is the marker of heart muscle injury. The trap is confusing the two cardiac labs.",
       "No: a BNP below 100 pg/mL is the usual cutoff; 1,450 is markedly high and consistent with decompensation."
      ]
     },
     ". The chest x-ray shows ",
     {
      "opts": [
       "pulmonary congestion from left-sided failure",
       "pneumonia",
       "a collapsed lung"
      ],
      "ans": 0,
      "whys": [
       "Yes: vascular congestion and bilateral effusions with an enlarged heart are the x-ray picture of fluid backing up into the lungs.",
       "No: the report states no consolidation and she has no fever, so pneumonia is not supported.",
       "No: a pneumothorax would show air in the pleural space; her report describes fluid and congestion instead."
      ]
     },
     ". Her sodium of 132 mEq/L is most likely ",
     {
      "opts": [
       "dilutional, from water retention",
       "from too little salt in her diet",
       "from dehydration"
      ],
      "ans": 0,
      "whys": [
       "Yes: in heart failure the kidneys hold on to water more than sodium, diluting the serum sodium; it improves as excess water is removed.",
       "No: she recently ate salty restaurant meals; low serum sodium here reflects excess water, not low intake.",
       "No: she is clearly volume overloaded. The trap is assuming low sodium always means a fluid deficit."
      ]
     },
     "."
    ],
    "why": "The BNP and chest x-ray confirm that her dyspnea is from heart failure with pulmonary congestion, not a lung infection. Her low sodium is dilutional: total body water is high. Treatment removes water with diuretics and limits sodium and fluid intake.",
    "tip": "Link each lab or image to the physiology it measures before deciding what it means for this client."
   },
   {
    "id": "cs-heart-failure-3",
    "type": "matrix",
    "step": "hypo",
    "cn": "physio",
    "stem": "Refer to the chart.",
    "q": "For each client problem, indicate whether it is a priority now, a risk to anticipate during treatment, or not supported by the data.",
    "cols": [
     "Priority now",
     "Risk to anticipate during treatment",
     "Not supported by the data"
    ],
    "rows": [
     {
      "t": "Impaired gas exchange from pulmonary congestion",
      "ans": 0,
      "why": "her SpO₂ was 89% on room air with crackles to mid-lung, so oxygenation is the most immediate threat."
     },
     {
      "t": "Fluid volume excess",
      "ans": 0,
      "why": "excess volume is the cause of her congestion, and removing it is the main goal of treatment."
     },
     {
      "t": "Hypokalemia and hypomagnesemia",
      "ans": 1,
      "why": "her levels are normal now, but IV loop diuretics waste potassium and magnesium, so they are expected to fall."
     },
     {
      "t": "Falls from urgency and frequent toileting",
      "ans": 1,
      "why": "brisk diuresis causes urgency and may cause orthostatic changes, so fall precautions belong in the plan."
     },
     {
      "t": "Cardiogenic shock",
      "ans": 2,
      "why": "her BP is 152/90, her skin is warm and she is alert, so perfusion is adequate; she is warm and wet, not cold."
     },
     {
      "t": "Pneumonia",
      "ans": 2,
      "why": "she is afebrile and the x-ray shows no consolidation, so her crackles are from congestion, not infection."
     }
    ],
    "why": "Her immediate problems are poor gas exchange and the fluid excess causing it. Diuresis brings predictable risks: electrolyte loss and falls. Cardiogenic shock and pneumonia are not supported because her perfusion is adequate and there are no signs of infection.",
    "tip": "Rank problems by what threatens airway and breathing now, then list the predictable side effects of the treatment."
   },
   {
    "id": "cs-heart-failure-4",
    "type": "sata",
    "step": "solve",
    "cn": "mgmt",
    "stem": "Refer to the chart. The nurse is helping plan care for the first 24 hours.",
    "q": "Which interventions should the nurse anticipate? Select all that apply.",
    "opts": [
     {
      "t": "Furosemide by IV push",
      "ok": true,
      "why": "Yes: IV loop diuretics act fast and avoid poor gut absorption from an edematous bowel; the IV dose is usually at least her home oral dose."
     },
     {
      "t": "Daily weight on the same scale, at the same time, before breakfast",
      "ok": true,
      "why": "Yes: daily weight is the best measure of fluid loss, and consistent technique makes the trend accurate."
     },
     {
      "t": "Strict intake and output",
      "ok": true,
      "why": "Yes: measuring intake and output shows whether the diuretic is producing a net fluid loss."
     },
     {
      "t": "Potassium and magnesium levels at least daily",
      "ok": true,
      "why": "Yes: loop diuretics waste both electrolytes, and low levels can trigger dangerous dysrhythmias in a weakened heart."
     },
     {
      "t": "Sodium restriction with a fluid restriction of about 1.5 L/day",
      "ok": true,
      "why": "Yes: limiting sodium and fluid reduces water retention and supports diuresis in a client who is hyponatremic and overloaded."
     },
     {
      "t": "A 500 mL 0.9% sodium chloride bolus for the low sodium",
      "ok": false,
      "why": "No: her sodium is low from excess water. A saline bolus adds volume to a client already in pulmonary congestion."
     },
     {
      "t": "Keep the bed flat to promote kidney blood flow",
      "ok": false,
      "why": "No: lying flat worsens orthopnea and lung congestion; she should sit upright in high Fowler position."
     },
     {
      "t": "Encourage 3 L of fluid a day to help the diuretic work",
      "ok": false,
      "why": "No: extra fluid offsets the diuretic and worsens overload. This is the opposite of the plan for decompensated failure."
     }
    ],
    "why": "Care for acute decompensated heart failure centers on removing excess fluid with IV loop diuretics, measuring the result with daily weights and intake and output, protecting against electrolyte loss, and limiting new sodium and fluid. Anything that adds volume or worsens orthopnea is harmful.",
    "tip": "For a client with fluid overload, reject any option that adds fluid or makes breathing harder."
   },
   {
    "id": "cs-heart-failure-5",
    "type": "order",
    "step": "act",
    "cn": "pharm",
    "update": "It is 17:30. The second furosemide dose is due at 18:00. The 17:00 laboratory results are back.",
    "stem": "Refer to the chart.",
    "q": "Place the nurse's actions in the order they should be performed.",
    "opts": [
     "Check the telemetry rhythm and assess for weakness and muscle cramps.",
     "Report the potassium of 3.2 mEq/L, magnesium of 1.6 mg/dL and her symptoms to the provider using SBAR.",
     "Give the potassium and magnesium replacement as ordered.",
     "After replacement has started, give the 18:00 furosemide dose only as the provider directs.",
     "Recheck potassium and magnesium at the time ordered after replacement."
    ],
    "whys": [
     "Yes: low potassium and magnesium can cause dysrhythmias, so the nurse first assesses for their effects on the heart and muscles.",
     "Yes: both values are below the notify parameters in the orders, and an SBAR with the assessment findings lets the provider decide on replacement.",
     "Yes: replacing potassium and magnesium reduces dysrhythmia risk; magnesium also helps the body hold on to potassium.",
     "Yes: another loop diuretic dose will lower potassium further, so it is given only after the provider knows the levels and replacement is underway.",
     "Yes: rechecking levels evaluates whether replacement worked and guides further doses."
    ],
    "why": "The 17:00 labs show potassium and magnesium below the notify parameters, and she has calf cramps. The nurse assesses for cardiac effects, reports with SBAR, gives the ordered replacement, gives the next diuretic only as directed, and then rechecks levels. Giving furosemide without addressing the low potassium is the trap.",
    "tip": "In an ordering item, assess before you report, report before you act on new orders, and evaluate last."
   },
   {
    "id": "cs-heart-failure-6",
    "type": "highlight",
    "step": "eval",
    "cn": "health",
    "update": "It is day 3, 10:00. The client is being discharged home. The nurse documents the discharge assessment and teach-back.",
    "stem": "Refer to the chart. Discharge note:",
    "q": "Highlight the findings and statements that show the expected outcomes of treatment and teaching have been met.",
    "parts": [
     {
      "t": "Weight 78.6 kg (173.3 lb), down 3.9 kg since admission.",
      "ok": true,
      "why": "Yes: she is close to her dry weight of 78 kg, showing the diuresis removed most of the excess fluid."
     },
     {
      "t": "Breathing easily on room air, SpO₂ 95%, lungs clear, slept on one pillow.",
      "ok": true,
      "why": "Yes: clear lungs, normal oxygenation and no orthopnea show the pulmonary congestion has resolved."
     },
     {
      "t": "Potassium 4.1 mEq/L and magnesium 2.0 mg/dL.",
      "ok": true,
      "why": "Yes: both electrolytes are back in the normal range after replacement, which lowers dysrhythmia risk."
     },
     {
      "t": "Client states: 'I will weigh myself every morning after I urinate and before breakfast.'",
      "ok": true,
      "why": "Yes: daily weight at the same time and in the same way is the key self-monitoring skill for heart failure."
     },
     {
      "t": "'I will call the clinic if I gain 2 to 3 pounds in a day or 5 pounds in a week.'",
      "ok": true,
      "why": "Yes: these are the standard thresholds for early reporting, so problems are caught before she needs admission."
     },
     {
      "t": "'I can stop the water pill once my ankles go back to normal.'",
      "ok": false,
      "why": "No: stopping her diuretic caused this admission. She needs teaching that it is a daily medication even when she feels well."
     },
     {
      "t": "'If I get short of breath at night, I will just sleep in my recliner again.'",
      "ok": false,
      "why": "No: new orthopnea is a warning sign to report, not to manage at home. This statement needs more teaching."
     }
    ],
    "why": "Her weight, lungs, oxygenation and electrolytes show that treatment worked. Two teach-back statements show she understands daily weights and when to call. Two statements show she still needs teaching on staying on her diuretic and reporting new orthopnea before discharge.",
    "tip": "For evaluation of teaching, select statements that match the teaching exactly; any plan to stop a medication or self-manage new symptoms needs more teaching."
   }
  ]
 },
 {
  "id": "cs-dka",
  "title": "New diabetes in DKA",
  "sp": "peds",
  "topic": "Pediatric diabetic ketoacidosis",
  "client": "15-year-old girl directly admitted to the pediatric unit with new-onset type 1 diabetes and diabetic ketoacidosis",
  "record": [
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "15:30",
    "text": "Direct admission from her pediatrician's office after a point-of-care glucose read above the meter range. Three weeks of thirst, frequent urination and getting up 4 times a night to urinate. Lost 4 kg (8.8 lb) in 3 weeks. Vomited twice today; abdominal pain since this morning. No past medical history. No medications. Weight 50 kg (110 lb). Lives with her mother and younger brother."
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "15:40",
    "text": "Respirations deep and rapid at 32. Fruity odor on breath. Lips cracked, mucous membranes dry, capillary refill 3 seconds. Drowsy but answers questions correctly; GCS 15. Reports abdominal pain and vomited twice today. SpO₂ 99% on room air. Temperature 37.2 °C (99 °F). Peripheral IV placed and labs drawn."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "15:40",
    "rows": [
     [
      "Temperature",
      "37.2 °C (99 °F)"
     ],
     [
      "Heart rate",
      "124",
      "high"
     ],
     [
      "Blood pressure",
      "108/64"
     ],
     [
      "Respiratory rate",
      "32, deep",
      "high"
     ],
     [
      "SpO₂",
      "99% on room air"
     ]
    ]
   },
   {
    "tab": "Laboratory Results",
    "at": 1,
    "time": "16:00",
    "rows": [
     [
      "Glucose",
      "512 mg/dL",
      "high"
     ],
     [
      "Venous pH",
      "7.14",
      "low"
     ],
     [
      "Bicarbonate",
      "9 mEq/L",
      "low"
     ],
     [
      "Sodium",
      "132 mEq/L",
      "low"
     ],
     [
      "Chloride",
      "98 mEq/L"
     ],
     [
      "Potassium",
      "5.6 mEq/L",
      "high"
     ],
     [
      "BUN",
      "24 mg/dL",
      "high"
     ],
     [
      "Creatinine",
      "1.0 mg/dL"
     ],
     [
      "Beta-hydroxybutyrate",
      "6.2 mmol/L",
      "high"
     ],
     [
      "Urine ketones",
      "Large",
      "high"
     ]
    ]
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "16:10",
    "text": "Pediatric DKA protocol. 0.9% sodium chloride 500 mL (10 mL/kg) IV over 1 hour, then 0.9% sodium chloride at 160 mL/h. Regular insulin infusion 0.1 units/kg/h (5 units/h) to start at 17:10, 1 hour after fluids begin; no insulin bolus. Add potassium 40 mEq/L to IV fluids once potassium is below 5.5 mEq/L and the client has voided. Add dextrose 5% to IV fluids when glucose is below 300 mg/dL. Bedside glucose every hour. Electrolytes and venous gas every 2 hours. Neurologic checks every hour. Strict intake and output. Mannitol 0.5 to 1 g/kg IV available at the bedside; notify provider immediately for any change in neurologic status."
   },
   {
    "tab": "Medication Administration Record",
    "at": 4,
    "time": "17:10",
    "text": "17:10 Regular insulin infusion started at 5 units/h, independent double check by two RNs. 18:05 Potassium chloride 40 mEq/L added to IV fluids (potassium 5.0, voided 400 mL). 20:00 Dextrose 5% added to IV fluids (glucose 290 mg/dL)."
   },
   {
    "tab": "Vital Signs",
    "at": 4,
    "time": "19:30",
    "rows": [
     [
      "Heart rate",
      "104",
      "high"
     ],
     [
      "Blood pressure",
      "112/70"
     ],
     [
      "Respiratory rate",
      "24"
     ],
     [
      "GCS",
      "15"
     ]
    ]
   },
   {
    "tab": "Laboratory Results",
    "at": 4,
    "time": "21:00",
    "rows": [
     [
      "Bedside glucose",
      "262 mg/dL",
      "high"
     ],
     [
      "Venous pH",
      "7.22",
      "low"
     ],
     [
      "Bicarbonate",
      "12 mEq/L",
      "low"
     ],
     [
      "Sodium",
      "136 mEq/L"
     ],
     [
      "Potassium",
      "4.2 mEq/L"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "21:30",
    "text": "Client says, 'My head is pounding, it's the worst headache I've ever had.' Opens eyes to voice, confused about where she is; GCS 13. Pupils equal and reactive. HR 62, was 104 at 19:30. BP 136/88, was 112/70. Respirations 20, regular."
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "08:00 (day 2)",
    "text": "Mannitol 25 g (0.5 g/kg) IV given at 21:45 per provider; IV fluid rate reduced by one third; transferred to the pediatric ICU. Headache gone by 23:30; neurologic checks normal overnight. Now alert and oriented, GCS 15. Drinking water and asking for breakfast; no vomiting since admission."
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "07:00 (day 2)",
    "rows": [
     [
      "Glucose",
      "182 mg/dL",
      "high"
     ],
     [
      "Venous pH",
      "7.34"
     ],
     [
      "Bicarbonate",
      "18 mEq/L",
      "low"
     ],
     [
      "Sodium",
      "138 mEq/L"
     ],
     [
      "Chloride",
      "108 mEq/L",
      "high"
     ],
     [
      "Potassium",
      "4.0 mEq/L"
     ],
     [
      "Beta-hydroxybutyrate",
      "0.4 mmol/L"
     ]
    ]
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "08:00 (day 2)",
    "rows": [
     [
      "Heart rate",
      "88"
     ],
     [
      "Blood pressure",
      "112/68"
     ],
     [
      "Respiratory rate",
      "18"
     ],
     [
      "GCS",
      "15"
     ]
    ]
   }
  ],
  "items": [
   {
    "id": "cs-dka-1",
    "type": "highlight",
    "step": "cues",
    "cn": "physio",
    "stem": "Refer to the chart. The nurse reviews the 15:40 nurses' note.",
    "q": "Highlight the findings that require follow-up.",
    "parts": [
     {
      "t": "Respirations deep and rapid at 32.",
      "ok": true,
      "why": "Yes: Kussmaul breathing is the body blowing off carbon dioxide to compensate for a severe metabolic acidosis."
     },
     {
      "t": "Fruity odor on breath.",
      "ok": true,
      "why": "Yes: acetone, a ketone, is exhaled through the lungs and signals ketoacidosis."
     },
     {
      "t": "Lips cracked, mucous membranes dry, capillary refill 3 seconds.",
      "ok": true,
      "why": "Yes: these show significant dehydration from osmotic diuresis and vomiting, which needs careful fluid replacement."
     },
     {
      "t": "Drowsy but answers questions correctly; GCS 15.",
      "ok": true,
      "why": "Yes: drowsiness reflects acidosis and dehydration, and it sets the neurologic baseline the nurse will compare against during treatment."
     },
     {
      "t": "Reports abdominal pain and vomited twice today.",
      "ok": true,
      "why": "Yes: abdominal pain and vomiting are common in DKA and worsen fluid and electrolyte losses."
     },
     {
      "t": "SpO₂ 99% on room air.",
      "ok": false,
      "why": "No: her oxygenation is normal. The trap is treating rapid breathing in DKA as a lung or oxygen problem."
     },
     {
      "t": "Temperature 37.2 °C (99 °F).",
      "ok": false,
      "why": "No: her temperature is normal, so there is no sign of an infection triggering this episode."
     }
    ],
    "why": "Deep rapid respirations, fruity breath, dehydration, drowsiness, vomiting and abdominal pain together with weeks of thirst, frequent urination and weight loss form the classic picture of new type 1 diabetes in ketoacidosis. Her normal oxygen saturation and temperature help rule out a lung or infectious cause.",
    "tip": "Group the findings into one pattern; cues that fit the suspected condition need follow-up, and normal values are distractors."
   },
   {
    "id": "cs-dka-2",
    "type": "cloze",
    "step": "analyze",
    "cn": "physio",
    "update": "It is 16:00. The laboratory results are back.",
    "stem": "Refer to the chart.",
    "q": "Complete the sentences.",
    "parts": [
     "The client's anion gap is ",
     {
      "opts": [
       "25 mEq/L",
       "12 mEq/L",
       "34 mEq/L"
      ],
      "ans": 0,
      "whys": [
       "Yes: anion gap is sodium minus the sum of chloride and bicarbonate: 132 minus 107 equals 25, well above the normal of about 12.",
       "No: 12 is roughly the upper end of normal. Her sodium of 132 minus chloride 98 and bicarbonate 9 gives 25.",
       "No: this subtracts only the chloride. Subtract both chloride and bicarbonate from the sodium: 132 minus 107 equals 25."
      ]
     },
     ", which shows ",
     {
      "opts": [
       "ketoacids building up in the blood",
       "chloride lost through vomiting",
       "a laboratory error"
      ],
      "ans": 0,
      "whys": [
       "Yes: an elevated gap means unmeasured acids are present; with a beta-hydroxybutyrate of 6.2 mmol/L, they are ketoacids.",
       "No: vomiting loses acid and causes alkalosis; it does not create a high anion gap acidosis.",
       "No: the gap matches her low pH, low bicarbonate and high ketones. The trap is dismissing a consistent result."
      ]
     },
     ". Her potassium of 5.6 mEq/L most likely reflects ",
     {
      "opts": [
       "potassium shifting out of cells, with a low total body potassium",
       "too much potassium in her diet",
       "kidney failure"
      ],
      "ans": 0,
      "whys": [
       "Yes: acidosis and lack of insulin move potassium out of cells while urine losses deplete total stores; the level will drop once insulin starts.",
       "No: diet does not raise serum potassium this way in a child with normal kidneys, and she has been vomiting.",
       "No: her creatinine is 1.0 mg/dL, so the kidneys are working. The high level is from a shift, not poor excretion."
      ]
     },
     "."
    ],
    "why": "Her pH of 7.14, bicarbonate of 9, high ketones and an anion gap of 25 confirm diabetic ketoacidosis. Her serum potassium looks high, but she has lost potassium in her urine for weeks. Insulin will drive potassium back into cells, so it can fall quickly.",
    "tip": "Calculate the anion gap as sodium minus chloride and bicarbonate, and remember that potassium in DKA reflects a shift, not true body stores."
   },
   {
    "id": "cs-dka-3",
    "type": "matrix",
    "step": "hypo",
    "cn": "physio",
    "stem": "Refer to the chart.",
    "q": "For each client problem, indicate whether it is a priority now, a risk to anticipate during treatment, or not supported by the data.",
    "cols": [
     "Priority now",
     "Risk to anticipate during treatment",
     "Not supported by the data"
    ],
    "rows": [
     {
      "t": "Metabolic acidosis from ketoacidosis",
      "ans": 0,
      "why": "her pH of 7.14 and bicarbonate of 9 show a significant acidosis that insulin must reverse."
     },
     {
      "t": "Fluid volume deficit from osmotic diuresis",
      "ans": 0,
      "why": "dry membranes, delayed capillary refill, tachycardia and a 4 kg weight loss show she is dehydrated."
     },
     {
      "t": "Hypokalemia once insulin starts",
      "ans": 1,
      "why": "insulin moves potassium into cells, unmasking her total body deficit, so the level is expected to fall."
     },
     {
      "t": "Cerebral edema",
      "ans": 1,
      "why": "children and teens with new-onset DKA are at highest risk, usually 4 to 12 hours into treatment."
     },
     {
      "t": "Hypoglycemia as glucose falls on insulin",
      "ans": 1,
      "why": "the insulin infusion continues until ketones clear, so dextrose is added as glucose falls to prevent lows."
     },
     {
      "t": "Hyperosmolar hyperglycemic state",
      "ans": 2,
      "why": "that condition has little or no ketosis and a pH above 7.3; her large ketones and pH of 7.14 point to DKA."
     }
    ],
    "why": "Acidosis and dehydration are the problems to treat now. Treatment itself brings predictable risks: falling potassium, falling glucose and, in children, cerebral edema. Planning for these from the start makes treatment safe.",
    "tip": "Separate what is harming the client now from what the treatment is likely to cause; both belong in the plan, but now comes first."
   },
   {
    "id": "cs-dka-4",
    "type": "matrix",
    "step": "solve",
    "cn": "pharm",
    "stem": "Refer to the chart. The client weighs 50 kg.",
    "q": "For each intervention, indicate whether the nurse should anticipate it or not anticipate it in the pediatric DKA protocol.",
    "cols": [
     "Anticipated",
     "Not anticipated"
    ],
    "rows": [
     {
      "t": "0.9% sodium chloride 10 mL/kg IV over 1 hour, then deficit replaced evenly over 24 to 48 hours",
      "ans": 0,
      "why": "an initial bolus restores circulation, and the remaining deficit is replaced evenly over 24 to 48 hours rather than all at once, as ISPAD 2022 recommends."
     },
     {
      "t": "Regular insulin infusion at 0.05 to 0.1 units/kg/h, started 1 hour after fluids, now that potassium is known",
      "ans": 0,
      "why": "insulin stops ketone production; it starts only after the potassium level is known and fluids are running."
     },
     {
      "t": "Potassium added to IV fluids once potassium is below 5.5 mEq/L and she is voiding",
      "ans": 0,
      "why": "insulin will lower her potassium, so replacement begins as soon as the level falls and kidney function is confirmed."
     },
     {
      "t": "IV insulin bolus of 0.1 units/kg before the infusion",
      "ans": 1,
      "why": "a bolus is not recommended in children because it drops glucose and osmolality too fast and may raise cerebral edema risk."
     },
     {
      "t": "IV sodium bicarbonate to correct the pH",
      "ans": 1,
      "why": "bicarbonate is not routine in pediatric DKA; it is linked to cerebral edema and worsens hypokalemia. Insulin corrects the acidosis."
     },
     {
      "t": "Repeated rapid 20 mL/kg boluses until the heart rate is normal",
      "ans": 1,
      "why": "she is not in shock and needs a measured bolus followed by steady deficit replacement; her heart rate falls as the deficit is corrected over 24 to 48 hours. Repeat boluses are for circulatory compromise."
     }
    ],
    "why": "Pediatric DKA is treated with a measured fluid bolus, deficit replacement over 24 to 48 hours, a low-dose insulin infusion without a bolus started at least 1 hour after fluids, and early potassium replacement. An insulin bolus and bicarbonate are avoided; bicarbonate is linked to cerebral edema. ISPAD 2022 notes that the PECARN FLUID trial did not link fluid rate to cerebral injury, so fluids should not be withheld when needed.",
    "tip": "In pediatric DKA, choose the options that correct things slowly and safely; anything that corrects too fast is usually the trap."
   },
   {
    "id": "cs-dka-5",
    "type": "sata",
    "step": "act",
    "cn": "physio",
    "update": "It is 21:30, a little over 4 hours after the insulin infusion started. The nurse finds the client harder to wake and holding her head.",
    "stem": "Refer to the chart.",
    "q": "Which actions should the nurse take now? Select all that apply.",
    "opts": [
     {
      "t": "Notify the provider immediately and call the rapid response team.",
      "ok": true,
      "why": "Yes: severe headache, a falling heart rate, rising BP and a GCS drop from 15 to 13 are warning signs of cerebral edema, an emergency."
     },
     {
      "t": "Raise the head of the bed to 30 degrees with the head midline.",
      "ok": true,
      "why": "Yes: elevating the head and keeping it midline helps venous drainage from the brain and can lower intracranial pressure."
     },
     {
      "t": "Bring the ordered mannitol to the bedside and prepare to give 0.5 to 1 g/kg IV.",
      "ok": true,
      "why": "Yes: mannitol draws fluid out of the brain and should be given without delay once cerebral edema is suspected."
     },
     {
      "t": "Anticipate an order to reduce the IV fluid rate.",
      "ok": true,
      "why": "Yes: fluids are reduced, often by one third, to avoid adding to brain swelling while still treating dehydration."
     },
     {
      "t": "Check a bedside glucose.",
      "ok": true,
      "why": "Yes: any change in mental status during an insulin infusion calls for a glucose check to rule out hypoglycemia quickly."
     },
     {
      "t": "Give acetaminophen for the headache and recheck in 1 hour.",
      "ok": false,
      "why": "No: treating the headache as minor and waiting an hour misses a life-threatening complication that needs action in minutes."
     },
     {
      "t": "Give a 20 mL/kg fluid bolus for the slower heart rate.",
      "ok": false,
      "why": "No: the slow heart rate with rising BP is a sign of rising intracranial pressure, not low volume; extra fluid can worsen swelling."
     },
     {
      "t": "Lay her flat with her legs raised.",
      "ok": false,
      "why": "No: lowering the head raises intracranial pressure, which is the opposite of what she needs."
     }
    ],
    "why": "New severe headache, bradycardia, rising BP and decreasing level of consciousness during DKA treatment signal cerebral edema. The nurse calls for help immediately, positions the head up and midline, prepares mannitol, anticipates a lower fluid rate and rules out hypoglycemia. Delay or extra fluid can be fatal.",
    "tip": "A falling heart rate with a rising BP and changing mental status means rising intracranial pressure; act and call at once."
   },
   {
    "id": "cs-dka-6",
    "type": "matrix",
    "step": "eval",
    "cn": "pharm",
    "update": "It is 08:00 on day 2 in the pediatric ICU. The team is deciding whether to switch to subcutaneous insulin.",
    "stem": "Refer to the chart.",
    "q": "For each finding or plan, indicate whether it supports a safe transition to subcutaneous insulin or needs follow-up first.",
    "cols": [
     "Supports transition",
     "Needs follow-up first"
    ],
    "rows": [
     {
      "t": "Venous pH 7.34 and bicarbonate 18 mEq/L",
      "ans": 0,
      "why": "DKA is resolved when venous pH is 7.30 or higher and bicarbonate is 18 mEq/L or higher (ISPAD 2022); both targets are met."
     },
     {
      "t": "Sodium 138, chloride 108, bicarbonate 18",
      "ans": 0,
      "why": "the anion gap is now 12, down from 25, showing the ketoacids have cleared."
     },
     {
      "t": "Beta-hydroxybutyrate 0.4 mmol/L, down from 6.2",
      "ans": 0,
      "why": "a blood ketone level below 0.6 mmol/L is near normal and shows ketone production has stopped."
     },
     {
      "t": "Alert, GCS 15, no headache, drinking and asking for breakfast",
      "ans": 0,
      "why": "a normal neurologic exam and the ability to eat are needed before starting a subcutaneous meal-based insulin plan."
     },
     {
      "t": "Heart rate 88, BP 112/68",
      "ans": 0,
      "why": "her vital signs are normal, and the bradycardia and high BP from last night have resolved."
     },
     {
      "t": "Plan: stop the insulin infusion at 08:00 and give the first subcutaneous insulin with lunch at 12:00",
      "ans": 1,
      "why": "stopping the drip before subcutaneous insulin takes effect can cause ketoacidosis to return; give it first and overlap before stopping the infusion."
     }
    ],
    "why": "Her acidosis, anion gap and ketones have all resolved, her neurologic status is back to normal and she can eat, so she is ready for subcutaneous insulin. IV insulin lasts only minutes after it stops, so the first subcutaneous dose must be given before the infusion is turned off.",
    "tip": "Judge DKA resolution by pH, bicarbonate, anion gap and ketones, not glucose, and never leave a gap in insulin coverage."
   }
  ]
 },
 {
  "id": "cs-hip-pe",
  "title": "Hip replacement with a clot that travels",
  "sp": "ms",
  "topic": "DVT and pulmonary embolism",
  "client": "71-year-old female, med-surg unit, post-op day 2 after right total hip arthroplasty",
  "record": [
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "07:30",
    "text": "71-year-old female, post-op day 2 after elective right total hip arthroplasty, posterior approach. History: hypertension, osteoarthritis, BMI 32. Weight 78 kg (172 lb). Posterior hip precautions: no hip flexion past 90 degrees, no crossing the legs, no inward rotation of the right leg. VTE prophylaxis: enoxaparin and sequential compression devices."
   },
   {
    "tab": "Medication Administration Record",
    "at": 0,
    "time": "07:30",
    "text": "Enoxaparin 40 mg subcutaneous daily at 21:00; last given yesterday at 21:00. Oxycodone 5 mg PO every 4 hours PRN pain; last given 06:30. Lisinopril 10 mg PO daily at 09:00."
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "08:00",
    "text": "Reports hip pain 3/10 after oxycodone at 06:30. Incision dry with edges approximated. Mild swelling and bruising of the right thigh around the incision. Reports aching and tightness in the right calf since early morning. Right calf is 3 cm larger than the left and is warm and slightly red. Pedal pulses 2+ and equal; toes warm with brisk capillary refill. Declined sequential compression devices overnight because of the noise. Has been out of bed once since surgery."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "08:00",
    "rows": [
     [
      "Temperature",
      "37.6 °C (99.7 °F)"
     ],
     [
      "Heart rate",
      "92"
     ],
     [
      "Blood pressure",
      "138/82"
     ],
     [
      "Respiratory rate",
      "18"
     ],
     [
      "SpO₂",
      "95% on room air"
     ]
    ]
   },
   {
    "tab": "Orders",
    "at": 1,
    "time": "08:30",
    "text": "Venous duplex ultrasound of the right lower extremity today. Notify provider of result."
   },
   {
    "tab": "Nurses' Notes",
    "at": 2,
    "time": "10:40",
    "text": "After getting up to the bedside commode with assistance, the client suddenly says, \"I can't catch my breath,\" and reports sharp right-sided chest pain that is worse when she breathes in. Anxious and restless. Lungs clear bilaterally. No petechiae. Alert and oriented x4. Duplex ultrasound not yet done."
   },
   {
    "tab": "Vital Signs",
    "at": 2,
    "time": "10:42",
    "rows": [
     [
      "Temperature",
      "37.7 °C (99.9 °F)"
     ],
     [
      "Heart rate",
      "124"
     ],
     [
      "Blood pressure",
      "108/68"
     ],
     [
      "Respiratory rate",
      "30"
     ],
     [
      "SpO₂",
      "86% on room air"
     ]
    ]
   },
   {
    "tab": "Laboratory Results",
    "at": 4,
    "time": "11:30",
    "rows": [
     [
      "Hemoglobin",
      "10.8 g/dL",
      "low"
     ],
     [
      "Platelets",
      "210,000/mm³"
     ],
     [
      "aPTT",
      "30 seconds"
     ],
     [
      "Creatinine",
      "0.9 mg/dL"
     ]
    ]
   },
   {
    "tab": "Imaging",
    "at": 4,
    "time": "11:40",
    "text": "CT pulmonary angiography: filling defects in the right lower lobe segmental arteries consistent with acute pulmonary embolism. No right heart strain. Venous duplex: occlusive thrombus in the right popliteal and posterior tibial veins."
   },
   {
    "tab": "Vital Signs",
    "at": 4,
    "time": "11:40",
    "rows": [
     [
      "Heart rate",
      "108"
     ],
     [
      "Blood pressure",
      "116/72"
     ],
     [
      "Respiratory rate",
      "24"
     ],
     [
      "SpO₂",
      "94% on 4 L nasal cannula"
     ]
    ]
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "11:45",
    "text": "Discontinue enoxaparin. Heparin weight-based protocol: 80 units/kg IV bolus (6,240 units), then 18 units/kg/h continuous infusion (1,404 units/h). aPTT 6 hours after start and 6 hours after each rate change; goal 60 to 100 seconds; adjust rate per protocol nomogram. CBC with platelets daily. Oxygen by nasal cannula titrated to SpO₂ 94% or higher. Bleeding precautions."
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "05:45",
    "rows": [
     [
      "aPTT",
      "74 seconds"
     ],
     [
      "Hemoglobin",
      "10.5 g/dL",
      "low"
     ],
     [
      "Platelets",
      "198,000/mm³"
     ]
    ]
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "06:00",
    "rows": [
     [
      "Temperature",
      "37.2 °C (99.0 °F)"
     ],
     [
      "Heart rate",
      "90"
     ],
     [
      "Blood pressure",
      "126/76"
     ],
     [
      "Respiratory rate",
      "18"
     ],
     [
      "SpO₂",
      "95% on 2 L nasal cannula"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "06:00",
    "text": "Breathing easier; speaks in full sentences. Pleuritic chest pain 2/10. Right calf remains swollen, 2 cm larger than the left. Pink-tinged urine noted in the bedside commode at 05:30. Incision dry. Heparin infusing at 1,400 units/h per protocol."
   }
  ],
  "items": [
   {
    "id": "cs-hip-pe-1",
    "type": "highlight",
    "step": "cues",
    "cn": "risk",
    "stem": "Refer to the chart. Nurses' note at 08:00 on post-op day 2.",
    "q": "Highlight the findings that require follow-up.",
    "parts": [
     {
      "t": "Reports hip pain 3/10 after oxycodone at 06:30.",
      "ok": false,
      "why": "No: mild incisional pain controlled with an oral opioid is expected on post-op day 2."
     },
     {
      "t": "Incision dry with edges approximated.",
      "ok": false,
      "why": "No: a dry, closed incision is a normal healing finding and needs no action."
     },
     {
      "t": "Mild swelling and bruising of the right thigh around the incision.",
      "ok": false,
      "why": "No: some thigh swelling and bruising near the surgical site are expected after hip arthroplasty."
     },
     {
      "t": "Reports aching and tightness in the right calf since early morning.",
      "ok": true,
      "why": "Yes: new calf pain in one leg after hip surgery is a classic early symptom of deep vein thrombosis."
     },
     {
      "t": "Right calf is 3 cm larger than the left and is warm and slightly red.",
      "ok": true,
      "why": "Yes: unilateral calf swelling, warmth and redness away from the incision point to a DVT and need to be reported."
     },
     {
      "t": "Pedal pulses 2+ and equal; toes warm with brisk capillary refill.",
      "ok": false,
      "why": "No: these show normal arterial flow. The trap is thinking good pulses rule out a venous clot; they do not."
     },
     {
      "t": "Declined sequential compression devices overnight because of the noise.",
      "ok": true,
      "why": "Yes: missing mechanical prophylaxis raises clot risk and calls for teaching and a plan the client will accept."
     },
     {
      "t": "Has been out of bed once since surgery.",
      "ok": true,
      "why": "Yes: immobility causes venous stasis, a major part of Virchow's triad, so early mobility needs follow-up."
     }
    ],
    "why": "Hip arthroplasty is one of the highest-risk surgeries for venous thromboembolism. One-sided calf pain, swelling, warmth and redness are the early cues, and immobility plus refused compression devices add risk. Incisional pain, thigh bruising and good pulses are expected findings.",
    "tip": "Separate findings at the surgical site, which are usually expected, from new findings in a different part of the limb."
   },
   {
    "id": "cs-hip-pe-2",
    "type": "matrix",
    "step": "analyze",
    "cn": "physio",
    "update": "It is 08:30. The provider is notified and orders a venous duplex ultrasound.",
    "stem": "Refer to the chart.",
    "q": "For each finding, indicate whether it is more consistent with a deep vein thrombosis or is expected after hip arthroplasty.",
    "cols": [
     "Consistent with DVT",
     "Expected after hip arthroplasty"
    ],
    "rows": [
     {
      "t": "Aching and tightness in the right calf",
      "ans": 0,
      "why": "a clot in the deep calf veins blocks venous return and inflames the vein wall, causing pain well below the surgical site."
     },
     {
      "t": "Right calf 3 cm larger than the left, warm and red",
      "ans": 0,
      "why": "blocked outflow and inflammation cause one-sided swelling and warmth; a difference of 3 cm or more is significant."
     },
     {
      "t": "Mild swelling and bruising of the right thigh around the incision",
      "ans": 1,
      "why": "tissue trauma from surgery causes local swelling and bruising near the hip that fades over days."
     },
     {
      "t": "Hip pain 3/10 after oral oxycodone",
      "ans": 1,
      "why": "controlled incisional pain is the normal course on day 2. The trap is linking all leg pain to a clot."
     },
     {
      "t": "Pedal pulses 2+ and equal with warm toes",
      "ans": 1,
      "why": "arterial flow is intact as expected; a DVT affects veins, so normal pulses do not rule it out."
     }
    ],
    "why": "The location of the finding matters. Swelling and pain at the hip incision are part of normal healing, while one-sided calf pain, swelling and warmth point to a DVT. Normal pulses reflect arterial flow and do not exclude a venous clot. Duplex ultrasound confirms the diagnosis.",
    "tip": "Ask whether each finding is at the surgical site or downstream of it, and whether it is arterial or venous."
   },
   {
    "id": "cs-hip-pe-3",
    "type": "cloze",
    "step": "hypo",
    "cn": "physio",
    "update": "It is 10:42. The client has just gotten up to the bedside commode before the ultrasound was done.",
    "stem": "Refer to the chart.",
    "q": "Complete the sentences.",
    "parts": [
     "The client's sudden findings are most consistent with ",
     {
      "opts": [
       "pulmonary embolism",
       "fat embolism syndrome",
       "postoperative atelectasis"
      ],
      "ans": 0,
      "whys": [
       "Yes: a suspected calf DVT followed by sudden dyspnea, tachycardia, pleuritic pain and hypoxemia after getting up fits a clot traveling to the lungs.",
       "No: fat embolism usually follows long bone fractures and brings confusion and petechiae; this client is oriented with no petechiae.",
       "No: atelectasis develops gradually with diminished breath sounds and low-grade fever, not a sudden drop to SpO₂ 86% with clear lungs."
      ]
     },
     ". The finding that best supports this is ",
     {
      "opts": [
       "sudden dyspnea and pleuritic pain after signs of a calf DVT",
       "confusion with a petechial rash on the chest",
       "a temperature of 37.7 °C (99.9 °F)"
      ],
      "ans": 0,
      "whys": [
       "Yes: the earlier calf findings give a clot source, and the abrupt respiratory change with movement shows it likely embolized.",
       "No: this pattern suggests fat embolism, and neither finding is in this client's record.",
       "No: a low-grade temperature is nonspecific after surgery and does not explain sudden hypoxemia."
      ]
     },
     ", and the priority problem is ",
     {
      "opts": [
       "impaired gas exchange",
       "acute pain",
       "risk for bleeding"
      ],
      "ans": 0,
      "whys": [
       "Yes: a clot blocking pulmonary blood flow causes a ventilation and perfusion mismatch, shown by SpO₂ 86%, which threatens oxygen delivery.",
       "No: the pleuritic pain is real, but airway and breathing problems come before comfort.",
       "No: bleeding becomes a concern once anticoagulation starts; it is not the current threat."
      ]
     },
     "."
    ],
    "why": "A post-op client with signs of a calf DVT who suddenly becomes short of breath, tachycardic and hypoxemic has a pulmonary embolism until proven otherwise. Fat embolism and atelectasis are distractors that do not fit the clear lungs, normal orientation and sudden onset. Oxygenation is the immediate priority.",
    "tip": "Link the earlier cues to the new ones: a clot source plus sudden respiratory distress points to an embolism."
   },
   {
    "id": "cs-hip-pe-4",
    "type": "sata",
    "step": "solve",
    "cn": "physio",
    "update": "The nurse has helped the client back to bed and is planning immediate care.",
    "stem": "Refer to the chart.",
    "q": "Which actions should the nurse plan now? Select all that apply.",
    "opts": [
     {
      "t": "Stay with the client and call the rapid response team.",
      "ok": true,
      "why": "Yes: sudden hypoxemia and tachycardia need immediate team support; the nurse should not leave an unstable client alone."
     },
     {
      "t": "Raise the head of the bed to Fowler position while keeping the right hip flexed no more than 90 degrees.",
      "ok": true,
      "why": "Yes: upright positioning eases breathing, and limiting hip flexion respects posterior hip precautions to prevent dislocation."
     },
     {
      "t": "Apply oxygen and titrate to keep SpO₂ at 94% or higher.",
      "ok": true,
      "why": "Yes: supplemental oxygen treats the hypoxemia caused by blocked pulmonary blood flow."
     },
     {
      "t": "Prepare for CT pulmonary angiography and anticipate a heparin infusion.",
      "ok": true,
      "why": "Yes: CT angiography confirms the embolism, and therapeutic anticoagulation stops the clot from growing."
     },
     {
      "t": "Massage the right calf to relieve the aching.",
      "ok": false,
      "why": "No: massaging a leg with a suspected DVT can dislodge more clot and send it to the lungs."
     },
     {
      "t": "Lay the client flat with both legs elevated.",
      "ok": false,
      "why": "No: lying flat makes breathing harder in respiratory distress. Leg elevation does not treat an embolism."
     },
     {
      "t": "Give the 21:00 enoxaparin dose now.",
      "ok": false,
      "why": "No: a prophylactic dose is not treatment, and giving it early without an order complicates starting a heparin infusion."
     },
     {
      "t": "Walk the client in the hall to improve lung expansion.",
      "ok": false,
      "why": "No: activity increases oxygen demand in a hypoxemic client and could dislodge more clot from the leg."
     }
    ],
    "why": "Suspected pulmonary embolism is an emergency. The nurse stays with the client, calls for help, positions upright within hip precautions and gives oxygen, then prepares for diagnosis and anticoagulation. The leg is never massaged, and the client is not made to exert herself.",
    "tip": "For sudden respiratory distress, choose actions that support breathing and bring help first, then ones that prepare for definitive treatment."
   },
   {
    "id": "cs-hip-pe-5",
    "type": "order",
    "step": "act",
    "cn": "pharm",
    "update": "It is 11:45. CT angiography confirms a pulmonary embolism. Baseline labs have resulted and the heparin protocol is ordered.",
    "stem": "Refer to the chart.",
    "q": "Place the nurse's actions for starting the heparin protocol in the correct order.",
    "opts": [
     "Verify the weight-based order against the client's current weight of 78 kg.",
     "Have a second nurse independently double-check the doses and pump programming.",
     "Give the 6,240-unit heparin bolus IV as ordered.",
     "Start the continuous infusion at 1,404 units/h on an infusion pump.",
     "Draw an aPTT 6 hours after the infusion starts.",
     "Adjust the infusion rate per the protocol nomogram based on the aPTT result."
    ],
    "whys": [
     "Yes: weight-based doses are only safe if the weight is accurate and in kilograms, so verification comes first.",
     "Yes: heparin is a high-alert medication, so an independent double-check catches errors before any drug reaches the client.",
     "Yes: the bolus quickly brings heparin to a therapeutic level and is given before the infusion starts.",
     "Yes: the continuous infusion maintains the level; a pump is required for an accurate, steady rate.",
     "Yes: heparin reaches a steady state in about 6 hours, so the first aPTT is drawn then to guide dosing.",
     "Yes: the rate is changed only after a result is available, following the protocol rather than guesswork."
    ],
    "why": "Heparin is a high-alert drug, so the sequence moves from verifying weight and dose, to an independent double-check, to bolus, then infusion. Monitoring follows at 6 hours, using aPTT here or anti-Xa where that is the protocol. Baseline aPTT and platelets were already drawn before the first dose.",
    "tip": "For high-alert infusions, think verify, double-check, give, then monitor and adjust."
   },
   {
    "id": "cs-hip-pe-6",
    "type": "matrix",
    "step": "eval",
    "cn": "pharm",
    "update": "It is 06:00 the next morning. The heparin infusion has run overnight.",
    "stem": "Refer to the chart.",
    "q": "For each finding, indicate whether it is expected or shows improvement, or requires follow-up.",
    "cols": [
     "Expected or improving",
     "Requires follow-up"
    ],
    "rows": [
     {
      "t": "SpO₂ 95% on 2 L, down from 4 L",
      "ans": 0,
      "why": "oxygenation is meeting the goal on less oxygen, showing gas exchange is improving."
     },
     {
      "t": "Respiratory rate 18 and speaking in full sentences",
      "ans": 0,
      "why": "work of breathing has returned to normal from a rate of 30 with distress."
     },
     {
      "t": "aPTT 74 seconds",
      "ans": 0,
      "why": "this falls within the ordered goal of 60 to 100 seconds, so anticoagulation is therapeutic."
     },
     {
      "t": "Platelets 198,000/mm³",
      "ans": 0,
      "why": "a stable platelet count shows no sign of heparin-induced thrombocytopenia so far."
     },
     {
      "t": "Right calf still 2 cm larger than the left",
      "ans": 0,
      "why": "heparin stops clot growth but does not dissolve the clot, so swelling settles slowly over days."
     },
     {
      "t": "Pink-tinged urine",
      "ans": 1,
      "why": "blood in the urine is a bleeding sign during anticoagulation and must be reported, with the aPTT and hemoglobin reviewed."
     }
    ],
    "why": "The client's oxygenation and breathing have improved, and the aPTT is in range with stable platelets. Persistent calf swelling is expected because heparin prevents extension rather than dissolving clot. New hematuria is a bleeding sign that needs prompt reporting even when lab values look therapeutic.",
    "tip": "When evaluating an anticoagulant, check both whether it is working and whether it is causing bleeding."
   }
  ]
 },
 {
  "id": "cs-gi-bleed",
  "title": "Variceal bleed in cirrhosis",
  "sp": "ms",
  "topic": "Upper GI bleed in cirrhosis",
  "client": "58-year-old male with alcohol-related cirrhosis admitted to the medical unit with hematemesis and melena",
  "record": [
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "13:30",
    "text": "58-year-old male with alcohol-related cirrhosis diagnosed 3 years ago. Endoscopy 1 year ago showed large esophageal varices; prescribed propranolol but stopped taking it. States last alcohol use was 1 month ago. Also takes spironolactone. Weight 74 kg (163 lb). Brought in after vomiting blood at home."
   },
   {
    "tab": "Laboratory Results",
    "at": 0,
    "time": "13:45",
    "rows": [
     [
      "Hemoglobin",
      "6.8 g/dL",
      "low"
     ],
     [
      "Hematocrit",
      "20%",
      "low"
     ],
     [
      "Platelets",
      "72,000/mm³",
      "low"
     ],
     [
      "INR",
      "1.8",
      "high"
     ],
     [
      "BUN",
      "38 mg/dL",
      "high"
     ],
     [
      "Creatinine",
      "1.0 mg/dL"
     ],
     [
      "Sodium",
      "134 mEq/L",
      "low"
     ],
     [
      "Potassium",
      "3.8 mEq/L"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "14:00",
    "text": "Vomited about 300 mL of bright red blood with clots in the ED. Two black, tarry, sticky stools since yesterday. Skin pale, cool and clammy; capillary refill 4 seconds. Spider angiomas on chest; abdomen distended with shifting dullness. Yellow sclera, unchanged from last month per his wife. Alert and oriented x4. One 20-gauge IV in the left hand. Urine output 20 mL in the past hour."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "14:00",
    "rows": [
     [
      "Temperature",
      "36.4 °C (97.5 °F)"
     ],
     [
      "Heart rate",
      "122"
     ],
     [
      "Blood pressure",
      "88/54"
     ],
     [
      "Respiratory rate",
      "24"
     ],
     [
      "SpO₂",
      "95% on room air"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 2,
    "time": "14:15",
    "text": "Vomited another 200 mL of bright red blood. More restless. Remains oriented x4."
   },
   {
    "tab": "Vital Signs",
    "at": 2,
    "time": "14:15",
    "rows": [
     [
      "Heart rate",
      "128"
     ],
     [
      "Blood pressure",
      "84/50"
     ],
     [
      "Respiratory rate",
      "26"
     ],
     [
      "SpO₂",
      "94% on room air"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "Day 2 07:30",
    "text": "Upper endoscopy yesterday at 16:30: band ligation of 3 bleeding esophageal varices. Received 2 units packed red blood cells without reaction. No hematemesis since. Overnight became confused, asked repeatedly where he was and pulled at his IV. Now oriented to person only. Flapping tremor of both hands when arms are held out. No stool in 30 hours. Gag reflex intact; follows simple commands."
   },
   {
    "tab": "Laboratory Results",
    "at": 4,
    "time": "Day 2 06:00",
    "rows": [
     [
      "Hemoglobin",
      "8.1 g/dL",
      "low"
     ],
     [
      "Ammonia",
      "92 µmol/L",
      "high"
     ],
     [
      "Potassium",
      "3.6 mEq/L"
     ],
     [
      "Sodium",
      "135 mEq/L"
     ]
    ]
   },
   {
    "tab": "Vital Signs",
    "at": 4,
    "time": "Day 2 07:30",
    "rows": [
     [
      "Temperature",
      "36.8 °C (98.2 °F)"
     ],
     [
      "Heart rate",
      "94"
     ],
     [
      "Blood pressure",
      "112/68"
     ],
     [
      "Respiratory rate",
      "18"
     ],
     [
      "SpO₂",
      "96% on room air"
     ]
    ]
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "Day 2 08:00",
    "text": "Lactulose 30 mL PO every 2 hours until a bowel movement, then 30 mL three times daily, titrated to 2 to 3 soft stools per day. Continue octreotide infusion, pantoprazole IV and ceftriaxone IV. Clear liquid diet when alert enough to swallow safely. Fall precautions. Basic metabolic panel daily."
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "Day 3 06:00",
    "rows": [
     [
      "Hemoglobin",
      "8.2 g/dL",
      "low"
     ],
     [
      "Potassium",
      "3.5 mEq/L"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "Day 3 08:00",
    "text": "Three soft, brown stools since 14:00 yesterday. Oriented to person, place, time and situation. No flapping tremor when arms are held out. Answers questions clearly and follows two-step commands. Hemoglobin 8.2 g/dL, stable. No hematemesis since banding. Abdomen remains distended with ascites."
   }
  ],
  "items": [
   {
    "id": "cs-gi-bleed-1",
    "type": "highlight",
    "step": "cues",
    "cn": "physio",
    "stem": "Refer to the chart. Nurses' note at 14:00 on admission.",
    "q": "Highlight the findings that require immediate follow-up.",
    "parts": [
     {
      "t": "Vomited about 300 mL of bright red blood with clots in the ED.",
      "ok": true,
      "why": "Yes: bright red hematemesis with clots means active, brisk upper GI bleeding."
     },
     {
      "t": "Two black, tarry, sticky stools since yesterday.",
      "ok": true,
      "why": "Yes: melena shows blood has been passing through the gut for some time, so total loss is larger than what was vomited."
     },
     {
      "t": "Skin pale, cool and clammy; capillary refill 4 seconds.",
      "ok": true,
      "why": "Yes: these show peripheral vasoconstriction from blood loss, an early sign of hypovolemic shock."
     },
     {
      "t": "Spider angiomas on chest; abdomen distended with shifting dullness.",
      "ok": false,
      "why": "No: spider angiomas and ascites are chronic signs of cirrhosis and portal hypertension, not new changes needing urgent action."
     },
     {
      "t": "Yellow sclera, unchanged from last month per his wife.",
      "ok": false,
      "why": "No: stable jaundice reflects his known liver disease. The trap is treating a chronic finding as the emergency."
     },
     {
      "t": "Alert and oriented x4.",
      "ok": false,
      "why": "No: intact mental status is reassuring for now and does not require action."
     },
     {
      "t": "One 20-gauge IV in the left hand.",
      "ok": true,
      "why": "Yes: one small IV is not enough for rapid fluid and blood replacement; two large-bore lines are needed."
     },
     {
      "t": "Urine output 20 mL in the past hour.",
      "ok": true,
      "why": "Yes: output under 30 mL/h shows poor kidney perfusion from low circulating volume."
     }
    ],
    "why": "This client is actively bleeding and shows early shock: cool clammy skin, slow capillary refill and low urine output. His single small IV cannot support resuscitation. Jaundice, ascites and spider angiomas are part of his chronic cirrhosis and are not the immediate threat.",
    "tip": "In a client with chronic disease, separate long-standing findings from new ones that signal acute deterioration."
   },
   {
    "id": "cs-gi-bleed-2",
    "type": "matrix",
    "step": "analyze",
    "cn": "physio",
    "stem": "Refer to the chart.",
    "q": "For each finding, indicate whether it points to an upper GI source of bleeding, reflects chronic liver disease, or reflects volume loss.",
    "cols": [
     "Points to upper GI bleeding",
     "Reflects chronic liver disease",
     "Reflects volume loss"
    ],
    "rows": [
     {
      "t": "Bright red blood with clots in the emesis",
      "ans": 0,
      "why": "blood vomited from the stomach or esophagus places the source above the ligament of Treitz."
     },
     {
      "t": "Black, tarry, sticky stools",
      "ans": 0,
      "why": "melena forms when blood is digested on its way through the gut, which usually means an upper GI source."
     },
     {
      "t": "BUN 38 mg/dL with creatinine 1.0 mg/dL",
      "ans": 0,
      "why": "digested blood protein raises the BUN while creatinine stays normal; a high ratio supports an upper GI bleed."
     },
     {
      "t": "Platelets 72,000/mm³ and INR 1.8",
      "ans": 1,
      "why": "the scarred liver makes fewer clotting factors, and an enlarged spleen traps platelets, which worsens any bleeding."
     },
     {
      "t": "Spider angiomas and ascites",
      "ans": 1,
      "why": "these come from portal hypertension and altered hormone metabolism in long-standing cirrhosis."
     },
     {
      "t": "Heart rate 122, cool clammy skin, urine output 20 mL/h",
      "ans": 2,
      "why": "the body compensates for lost blood volume by raising heart rate, constricting vessels and conserving water."
     }
    ],
    "why": "The record tells three stories at once. Hematemesis, melena and a high BUN with normal creatinine point to an upper GI source. Low platelets and a high INR are from cirrhosis and make bleeding harder to stop. Tachycardia, clammy skin and low urine output show the volume he has lost.",
    "tip": "For each finding, ask what process causes it: the bleeding source, the underlying disease or the body's response."
   },
   {
    "id": "cs-gi-bleed-3",
    "type": "cloze",
    "step": "hypo",
    "cn": "physio",
    "update": "It is 14:15. The client has vomited another 200 mL of bright red blood.",
    "stem": "Refer to the chart.",
    "q": "Complete the sentences.",
    "parts": [
     "The most likely source of bleeding is ",
     {
      "opts": [
       "ruptured esophageal varices",
       "a lower GI source such as diverticula",
       "a Mallory-Weiss tear from forceful retching"
      ],
      "ans": 0,
      "whys": [
       "Yes: he has known large varices from portal hypertension and stopped his propranolol, which makes variceal rupture the most likely cause.",
       "No: hematemesis and a high BUN point above the ligament of Treitz; lower GI bleeding causes bright red blood from the rectum.",
       "No: a Mallory-Weiss tear follows repeated retching, which is not reported, and his varices are a far more likely source."
      ]
     },
     ". The priority problem is ",
     {
      "opts": [
       "hypovolemic shock from ongoing blood loss",
       "hepatic encephalopathy",
       "fluid excess from ascites"
      ],
      "ans": 0,
      "whys": [
       "Yes: continued bleeding with falling blood pressure threatens circulation and is immediately life threatening.",
       "No: he is still oriented. Encephalopathy is a later risk once blood is digested, not the current priority.",
       "No: ascites is chronic, and the problem now is too little circulating volume, not too much."
      ]
     },
     ", shown by ",
     {
      "opts": [
       "blood pressure falling to 84/50 as heart rate rises to 128",
       "a distended abdomen with shifting dullness",
       "spider angiomas on the chest"
      ],
      "ans": 0,
      "whys": [
       "Yes: a heart rate that keeps rising while the blood pressure keeps falling shows his compensation is failing.",
       "No: shifting dullness confirms ascites, a chronic finding that does not show shock.",
       "No: spider angiomas are a stable sign of cirrhosis, not a sign of acute blood loss."
      ]
     },
     "."
    ],
    "why": "In a client with cirrhosis and known varices who stopped his beta blocker, massive hematemesis is variceal bleeding until proven otherwise. The ongoing loss and worsening vital signs make hypovolemic shock the priority. Chronic liver findings matter, but circulation comes first.",
    "tip": "Use the history to name the likely source, then use the trend in vital signs to name the priority."
   },
   {
    "id": "cs-gi-bleed-4",
    "type": "sata",
    "step": "solve",
    "cn": "mgmt",
    "update": "It is 14:20. The provider is at the bedside, and the nurse anticipates the orders.",
    "stem": "Refer to the chart.",
    "q": "Which interventions should the nurse anticipate? Select all that apply.",
    "opts": [
     {
      "t": "Insert a second large-bore IV, 18-gauge or larger.",
      "ok": true,
      "why": "Yes: two large-bore lines allow rapid infusion of fluids and blood products at the same time."
     },
     {
      "t": "Send a type and crossmatch and prepare to transfuse packed red blood cells.",
      "ok": true,
      "why": "Yes: his hemoglobin is 6.8 g/dL, below the restrictive transfusion threshold of 7 g/dL, and he is still bleeding."
     },
     {
      "t": "Start an octreotide infusion.",
      "ok": true,
      "why": "Yes: octreotide reduces blood flow to the splanchnic and portal system, lowering pressure in the varices."
     },
     {
      "t": "Give an IV proton pump inhibitor.",
      "ok": true,
      "why": "Yes: an IV acid suppressant is commonly ordered until endoscopy confirms the source, since ulcers can coexist."
     },
     {
      "t": "Give an IV antibiotic such as ceftriaxone.",
      "ok": true,
      "why": "Yes: clients with cirrhosis and GI bleeding have a high risk of bacterial infection, and prophylaxis improves survival."
     },
     {
      "t": "Keep NPO, raise the head of the bed, keep suction at the bedside and prepare for upper endoscopy.",
      "ok": true,
      "why": "Yes: these protect the airway from aspiration of blood and prepare for endoscopic banding to stop the bleeding."
     },
     {
      "t": "Give propranolol now to lower portal pressure.",
      "ok": false,
      "why": "No: a beta blocker during active bleeding with BP 84/50 would worsen hypotension and block compensatory tachycardia."
     },
     {
      "t": "Transfuse until the hemoglobin is above 10 g/dL.",
      "ok": false,
      "why": "No: overtransfusion raises portal pressure and rebleeding risk. In variceal bleeding, transfuse at a hemoglobin of about 7 g/dL and target 7 to 8 g/dL."
     }
    ],
    "why": "Care for an acute variceal bleed restores volume through good access and restrictive transfusion, lowers portal pressure with octreotide, prevents infection with antibiotics and protects the airway while preparing for endoscopy. Beta blockers are held during shock, and liberal transfusion can restart bleeding.",
    "tip": "Group the interventions by goal: access and volume, stopping the bleed, preventing complications, and airway protection."
   },
   {
    "id": "cs-gi-bleed-5",
    "type": "matrix",
    "step": "act",
    "cn": "physio",
    "update": "It is day 2 at 08:00. The varices were banded yesterday and the bleeding has stopped, but the client is newly confused.",
    "stem": "Refer to the chart.",
    "q": "For each action, indicate whether it is indicated or not indicated for this client now.",
    "cols": [
     "Indicated",
     "Not indicated"
    ],
    "rows": [
     {
      "t": "Give lactulose with the head of the bed elevated after confirming the client can swallow safely",
      "ans": 0,
      "why": "lactulose treats hepatic encephalopathy by trapping ammonia in the gut; checking swallowing first protects a confused client from aspiration."
     },
     {
      "t": "Give PRN lorazepam for confusion and pulling at the IV",
      "ans": 1,
      "why": "sedatives can deepen hepatic encephalopathy and hide changes in mental status. The trap is treating the behavior instead of the cause."
     },
     {
      "t": "Keep the bed low with a bed alarm and round frequently",
      "ans": 0,
      "why": "a confused client is at high risk for falls and for pulling out lines, so close observation is needed."
     },
     {
      "t": "Track the number and consistency of stools",
      "ans": 0,
      "why": "the dose is titrated to 2 to 3 soft stools a day, so stool output guides therapy."
     },
     {
      "t": "Hold lactulose after the first soft stool",
      "ans": 1,
      "why": "lactulose continues on a schedule; stopping it at the first stool lets ammonia rise again."
     },
     {
      "t": "Monitor potassium on the daily metabolic panel",
      "ans": 0,
      "why": "lactulose diarrhea can cause hypokalemia, and low potassium increases ammonia production in the kidneys."
     }
    ],
    "why": "New confusion, asterixis and a high ammonia level after a GI bleed point to hepatic encephalopathy; digested blood is a large protein load for a failing liver. Lactulose is titrated to soft stools, with attention to aspiration, falls and potassium. Sedatives worsen encephalopathy.",
    "tip": "When mental status changes, treat the cause and keep the client safe; avoid drugs that cloud the picture."
   },
   {
    "id": "cs-gi-bleed-6",
    "type": "highlight",
    "step": "eval",
    "cn": "pharm",
    "update": "It is day 3 at 08:00. The client has received lactulose for 24 hours.",
    "stem": "Refer to the chart. Nurses' note, day 3.",
    "q": "Highlight the findings that show the lactulose is effective.",
    "parts": [
     {
      "t": "Three soft, brown stools since 14:00 yesterday.",
      "ok": true,
      "why": "Yes: 2 to 3 soft stools a day is the dosing goal and shows ammonia is being cleared through the gut."
     },
     {
      "t": "Oriented to person, place, time and situation.",
      "ok": true,
      "why": "Yes: return of full orientation from person only shows the encephalopathy is resolving."
     },
     {
      "t": "No flapping tremor when arms are held out.",
      "ok": true,
      "why": "Yes: loss of asterixis shows less ammonia is affecting the brain."
     },
     {
      "t": "Answers questions clearly and follows two-step commands.",
      "ok": true,
      "why": "Yes: clearer thinking and attention show improved brain function as ammonia falls."
     },
     {
      "t": "Hemoglobin 8.2 g/dL, stable.",
      "ok": false,
      "why": "No: a stable hemoglobin shows the bleeding is controlled; it is not an effect of lactulose."
     },
     {
      "t": "No hematemesis since banding.",
      "ok": false,
      "why": "No: this reflects successful endoscopic banding and octreotide, not lactulose."
     },
     {
      "t": "Abdomen remains distended with ascites.",
      "ok": false,
      "why": "No: ascites comes from portal hypertension and low albumin; lactulose is not meant to treat it."
     }
    ],
    "why": "Lactulose works by drawing ammonia into the colon and clearing it in the stool. Success shows up as the target number of soft stools and a return of normal mental status without asterixis. Stable hemoglobin and no further vomiting reflect bleeding control, a separate goal.",
    "tip": "Match each finding to the treatment that produced it; highlight only those tied to the drug in the question."
   }
  ]
 },
 {
  "id": "cs-stroke",
  "title": "Stroke alert in the ED",
  "sp": "ed",
  "topic": "Acute ischemic stroke and thrombolysis",
  "client": "67-year-old male brought to the emergency department with sudden right-sided weakness and trouble speaking",
  "record": [
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "10:15",
    "text": "Brought in by his wife. She left for the store at 08:30, when he was talking normally while reading the paper. She returned at 09:50 and found him in his chair unable to get words out, with his right arm hanging limp. Right facial droop. Right arm and leg drift to the bed within seconds. Understands questions and tries to answer, but speech is halting and he cannot find words. Pupils equal and reactive at 3 mm. History: type 2 diabetes treated with glipizide; did not eat breakfast today. Atrial fibrillation; stopped his anticoagulant 6 months ago because of cost. Hypertension. Seasonal allergies. Weight 82 kg (181 lb)."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "10:15",
    "rows": [
     [
      "Temperature",
      "36.8 °C (98.2 °F)"
     ],
     [
      "Heart rate",
      "96, irregularly irregular"
     ],
     [
      "Blood pressure",
      "192/104"
     ],
     [
      "Respiratory rate",
      "18"
     ],
     [
      "SpO₂",
      "96% on room air"
     ]
    ]
   },
   {
    "tab": "Orders",
    "at": 1,
    "time": "10:20",
    "text": "Stroke alert. Point-of-care glucose now. NIHSS. Non-contrast CT head stat. CBC with platelets, PT/INR, aPTT, basic metabolic panel, troponin. 12-lead ECG. Cardiac monitor. NPO."
   },
   {
    "tab": "Laboratory Results",
    "at": 2,
    "time": "10:22",
    "rows": [
     [
      "Point-of-care glucose",
      "148 mg/dL"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 2,
    "time": "10:25",
    "text": "NIHSS 12: right facial droop, right arm and leg weakness, expressive aphasia."
   },
   {
    "tab": "Imaging",
    "at": 2,
    "time": "10:38",
    "text": "Non-contrast CT head: no intracranial hemorrhage. No large area of established infarct."
   },
   {
    "tab": "Laboratory Results",
    "at": 2,
    "time": "10:40",
    "rows": [
     [
      "Platelets",
      "230,000/mm³"
     ],
     [
      "INR",
      "1.0"
     ],
     [
      "aPTT",
      "29 seconds"
     ],
     [
      "Creatinine",
      "1.0 mg/dL"
     ]
    ]
   },
   {
    "tab": "Vital Signs",
    "at": 2,
    "time": "10:40",
    "rows": [
     [
      "Heart rate",
      "98, irregularly irregular"
     ],
     [
      "Blood pressure",
      "194/106"
     ],
     [
      "Respiratory rate",
      "18"
     ],
     [
      "SpO₂",
      "96% on room air"
     ]
    ]
   },
   {
    "tab": "Orders",
    "at": 3,
    "time": "10:50",
    "text": "Labetalol 10 mg IV over 2 minutes; may repeat once in 10 minutes. Goal BP under 185/110 before alteplase. Alteplase 0.9 mg/kg for 82 kg: total 73.8 mg; give 7.4 mg IV bolus over 1 minute, then 66.4 mg IV over 60 minutes. Admit to the stroke unit after the infusion."
   },
   {
    "tab": "Medication Administration Record",
    "at": 4,
    "time": "10:52",
    "text": "Labetalol 10 mg IV given at 10:52. Alteplase prepared; dose independently double-checked by two RNs."
   },
   {
    "tab": "Vital Signs",
    "at": 4,
    "time": "11:02",
    "rows": [
     [
      "Heart rate",
      "92, irregularly irregular"
     ],
     [
      "Blood pressure",
      "176/98"
     ],
     [
      "Respiratory rate",
      "18"
     ],
     [
      "SpO₂",
      "96% on room air"
     ]
    ]
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "11:03",
    "text": "Post-thrombolytic care: neuro checks and vital signs every 15 minutes for 2 hours, every 30 minutes for 6 hours, then hourly for 16 hours. Keep BP under 180/105. NPO until bedside swallow screen is passed. No anticoagulants or antiplatelet drugs for 24 hours."
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "12:15",
    "text": "Alteplase bolus given 11:05; infusion completed 12:06. NIHSS 9. Speaking in short phrases; right arm lifts against gravity. BP 164/92."
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "13:35",
    "text": "Says suddenly, \"My head is pounding, worst headache I've ever had.\" Vomited once. Opens eyes only to voice and is no longer speaking; right arm now flaccid. BP 198/112, up from 164/92 at 12:15. Heart rate 88, irregularly irregular as on arrival. Small bruise at the left antecubital IV site, not enlarging. SpO₂ 96% on room air."
   }
  ],
  "items": [
   {
    "id": "cs-stroke-1",
    "type": "sata",
    "step": "cues",
    "cn": "physio",
    "stem": "Refer to the chart. Triage note and vital signs at 10:15.",
    "q": "Which findings require immediate follow-up? Select all that apply.",
    "opts": [
     {
      "t": "Right facial droop with right arm and leg drift",
      "ok": true,
      "why": "Yes: sudden one-sided face, arm and leg weakness is a hallmark sign of acute stroke and triggers a stroke alert."
     },
     {
      "t": "Understands questions but cannot find words",
      "ok": true,
      "why": "Yes: expressive aphasia with right-sided weakness points to the left hemisphere, where language centers are in most people."
     },
     {
      "t": "Blood pressure 192/104",
      "ok": true,
      "why": "Yes: this is above the 185/110 limit for thrombolysis and must be lowered before alteplase can be given."
     },
     {
      "t": "Takes glipizide and did not eat breakfast",
      "ok": true,
      "why": "Yes: a sulfonylurea without food can cause hypoglycemia, a common stroke mimic that must be ruled out right away."
     },
     {
      "t": "Irregularly irregular pulse after stopping his anticoagulant",
      "ok": true,
      "why": "Yes: untreated atrial fibrillation is a major source of embolic stroke and shapes later treatment decisions."
     },
     {
      "t": "Pupils equal and reactive at 3 mm",
      "ok": false,
      "why": "No: this is a normal finding and does not need action now, though it is a useful baseline."
     },
     {
      "t": "Temperature 36.8 °C (98.2 °F)",
      "ok": false,
      "why": "No: the temperature is normal; fever would worsen brain injury, but none is present."
     },
     {
      "t": "History of seasonal allergies",
      "ok": false,
      "why": "No: this has no bearing on stroke assessment or thrombolytic eligibility."
     }
    ],
    "why": "Sudden right-sided weakness with aphasia is a stroke until proven otherwise. The high blood pressure, possible hypoglycemia from glipizide and untreated atrial fibrillation each change what happens in the next few minutes. Normal pupils, temperature and allergy history do not.",
    "tip": "In a time-critical emergency, pick findings that change the next decision, not every detail in the history."
   },
   {
    "id": "cs-stroke-2",
    "type": "cloze",
    "step": "analyze",
    "cn": "physio",
    "update": "It is 10:20. A stroke alert has been called.",
    "stem": "Refer to the chart.",
    "q": "Complete the sentences.",
    "parts": [
     "The time used to decide thrombolytic eligibility is ",
     {
      "opts": [
       "08:30",
       "09:50",
       "10:15"
      ],
      "ans": 0,
      "whys": [
       "Yes: onset is the last time he was known to be at baseline, which was 08:30 when his wife left.",
       "No: 09:50 is when symptoms were found. The trap is using time found; the stroke could have started any time after 08:30.",
       "No: arrival time has no link to when the stroke began."
      ]
     },
     ", so at 10:20 the client is ",
     {
      "opts": [
       "about 1 hour 50 minutes into the 4.5-hour window",
       "already outside the 4.5-hour window",
       "too early for thrombolysis until 3 hours have passed"
      ],
      "ans": 0,
      "whys": [
       "Yes: 08:30 to 10:20 is 1 hour 50 minutes, well within 4.5 hours, but every minute of delay loses brain tissue.",
       "No: 4.5 hours from 08:30 is 13:00, so there is still time if the workup moves quickly.",
       "No: there is no minimum wait. Earlier treatment gives better outcomes."
      ]
     },
     ". A stroke mimic that must be ruled out first in this client is ",
     {
      "opts": [
       "hypoglycemia from glipizide",
       "hyperkalemia",
       "dehydration"
      ],
      "ans": 0,
      "whys": [
       "Yes: he takes a sulfonylurea and skipped breakfast, and low glucose can cause focal weakness and speech changes that resolve with treatment.",
       "No: high potassium causes muscle weakness and dysrhythmias, but not one-sided weakness with aphasia.",
       "No: dehydration can cause dizziness or confusion but does not produce focal deficits like these."
      ]
     },
     "."
    ],
    "why": "Eligibility for thrombolysis is measured from the last known well time, not the time symptoms were discovered. This client is within the window, so speed matters. A point-of-care glucose is checked before CT because hypoglycemia, especially with a sulfonylurea, can look exactly like a stroke.",
    "tip": "When onset was not witnessed, use the last time the client was seen normal."
   },
   {
    "id": "cs-stroke-3",
    "type": "matrix",
    "step": "hypo",
    "cn": "risk",
    "update": "It is 10:45. The stroke team suspects acute ischemic stroke and is considering alteplase.",
    "stem": "Refer to the chart.",
    "q": "For each finding, indicate whether it supports giving alteplase or must be corrected before alteplase can be given.",
    "cols": [
     "Supports giving alteplase",
     "Must be corrected first"
    ],
    "rows": [
     {
      "t": "Last known well 08:30, now 10:45",
      "ans": 0,
      "why": "2 hours 15 minutes since last known well is within the 4.5-hour window for alteplase."
     },
     {
      "t": "Non-contrast CT shows no hemorrhage",
      "ans": 0,
      "why": "non-contrast CT is done first to exclude bleeding; a hemorrhagic stroke would be an absolute contraindication."
     },
     {
      "t": "Point-of-care glucose 148 mg/dL",
      "ans": 0,
      "why": "glucose is the one lab required before alteplase; 148 mg/dL rules out hypoglycemia as the cause of the deficits and is within the acceptable range for thrombolysis."
     },
     {
      "t": "Platelets 230,000/mm³ and INR 1.0",
      "ans": 0,
      "why": "normal clotting values mean no added bleeding risk; he stopped his anticoagulant months ago."
     },
     {
      "t": "NIHSS 12 with aphasia and right-sided weakness",
      "ans": 0,
      "why": "these are disabling deficits, which is the reason to accept the bleeding risk of thrombolysis."
     },
     {
      "t": "Blood pressure 194/106",
      "ans": 1,
      "why": "BP must be under 185/110 before alteplase because higher pressure raises the risk of bleeding into the brain."
     }
    ],
    "why": "The most likely problem is an acute ischemic stroke, and nearly every finding supports thrombolysis: he is within the window, CT shows no bleeding, glucose and clotting are normal and the deficits are disabling. Blood pressure is the one barrier and must be lowered first.",
    "tip": "Run through the eligibility checklist: time, CT, glucose, clotting and blood pressure, then find the item that is out of range."
   },
   {
    "id": "cs-stroke-4",
    "type": "sata",
    "step": "solve",
    "cn": "risk",
    "update": "It is 10:50. Labetalol and alteplase are ordered. The nurse plans care for during and after the infusion.",
    "stem": "Refer to the chart.",
    "q": "Which interventions should the nurse include in the plan of care? Select all that apply.",
    "opts": [
     {
      "t": "Neuro checks and vital signs every 15 minutes for 2 hours, every 30 minutes for 6 hours, then hourly for 16 hours.",
      "ok": true,
      "why": "Yes: this standard schedule catches bleeding or worsening deficits during the highest-risk first 24 hours."
     },
     {
      "t": "Keep blood pressure under 180/105 after alteplase is started.",
      "ok": true,
      "why": "Yes: after thrombolysis the BP goal is lower than before, to reduce the risk of intracranial hemorrhage."
     },
     {
      "t": "Keep NPO, including oral medications, until a bedside swallow screen is passed.",
      "ok": true,
      "why": "Yes: aphasia and facial weakness suggest dysphagia, and aspiration pneumonia is a leading complication of stroke."
     },
     {
      "t": "Avoid IM injections, arterial punctures and new tubes such as urinary catheters unless essential.",
      "ok": true,
      "why": "Yes: invasive procedures create bleeding sites while alteplase is active; essential lines are placed before the infusion when possible."
     },
     {
      "t": "Give aspirin 325 mg PO as soon as the infusion ends.",
      "ok": false,
      "why": "No: antiplatelet and anticoagulant drugs are held for 24 hours after alteplase because they add to bleeding risk."
     },
     {
      "t": "Hold all antihypertensives to protect brain perfusion.",
      "ok": false,
      "why": "No: permissive hypertension applies to clients who do not receive a thrombolytic. After alteplase, BP must stay under 180/105."
     },
     {
      "t": "Test swallowing by giving a full glass of water first.",
      "ok": false,
      "why": "No: a swallow screen uses a structured protocol with small amounts; a large volume risks aspiration."
     }
    ],
    "why": "After alteplase, care centers on finding bleeding early and preventing it. That means a strict neuro and vital sign schedule, a tighter BP goal, no antithrombotics for 24 hours and avoiding invasive procedures. Aspiration is prevented by keeping the client NPO until a swallow screen is passed.",
    "tip": "For thrombolytics, every planned intervention should either detect bleeding or reduce its risk."
   },
   {
    "id": "cs-stroke-5",
    "type": "order",
    "step": "act",
    "cn": "pharm",
    "update": "It is 11:02. Labetalol 10 mg IV was given at 10:52, and the alteplase dose has been verified by two nurses.",
    "stem": "Refer to the chart.",
    "q": "Place the nurse's actions in the correct order.",
    "opts": [
     "Recheck the blood pressure and confirm it is below 185/110.",
     "Give alteplase 7.4 mg as an IV bolus over 1 minute.",
     "Start the remaining 66.4 mg as an infusion over 60 minutes on a pump.",
     "Perform neuro checks and vital signs every 15 minutes during and after the infusion for 2 hours.",
     "Continue neuro checks and vital signs every 30 minutes for the next 6 hours."
    ],
    "whys": [
     "Yes: alteplase cannot start until BP is below 185/110; the 176/98 reading after labetalol meets that goal.",
     "Yes: 10% of the total dose is given as a bolus first to begin breaking down the clot.",
     "Yes: the remaining 90% follows immediately as a 60-minute infusion on a pump for an accurate rate.",
     "Yes: the first 2 hours carry the highest risk of hemorrhage, so checks are most frequent then.",
     "Yes: after the first 2 hours, checks space out to every 30 minutes for 6 hours, then hourly to complete 24 hours."
    ],
    "why": "Alteplase is given only after BP is confirmed under 185/110. The dose is split into a 10% bolus over 1 minute and the remaining 90% over 60 minutes. Monitoring then follows a fixed schedule that is most intense in the first 2 hours.",
    "tip": "For time-critical drugs, put the safety gate first, then the drug as ordered, then monitoring from most to least frequent."
   },
   {
    "id": "cs-stroke-6",
    "type": "highlight",
    "step": "eval",
    "cn": "physio",
    "update": "It is 13:35, during the every 30 minute checks. At 12:15 the client was improving.",
    "stem": "Refer to the chart. Nurses' note at 13:35.",
    "q": "Highlight the findings that show the client's condition is worsening and require immediate action.",
    "parts": [
     {
      "t": "Says suddenly, \"My head is pounding, worst headache I've ever had.\"",
      "ok": true,
      "why": "Yes: a sudden severe headache after thrombolysis is a classic sign of intracranial hemorrhage."
     },
     {
      "t": "Vomited once.",
      "ok": true,
      "why": "Yes: new vomiting with headache suggests rising intracranial pressure from bleeding."
     },
     {
      "t": "Opens eyes only to voice and is no longer speaking; right arm now flaccid.",
      "ok": true,
      "why": "Yes: a falling level of consciousness and loss of earlier gains show the neuro exam is getting worse, not better."
     },
     {
      "t": "BP 198/112, up from 164/92 at 12:15.",
      "ok": true,
      "why": "Yes: a sharp BP rise above the 180/105 limit can signal rising intracranial pressure and worsens bleeding."
     },
     {
      "t": "Heart rate 88, irregularly irregular as on arrival.",
      "ok": false,
      "why": "No: this is his baseline atrial fibrillation and has not changed."
     },
     {
      "t": "Small bruise at the left antecubital IV site, not enlarging.",
      "ok": false,
      "why": "No: minor stable bruising is expected after thrombolysis. The trap is focusing on a small surface bleed over a brain bleed."
     },
     {
      "t": "SpO₂ 96% on room air.",
      "ok": false,
      "why": "No: oxygenation is normal and unchanged, though the airway needs watching as consciousness falls."
     }
    ],
    "why": "Intracranial hemorrhage is the most feared complication of alteplase. Sudden severe headache, vomiting, a worsening neuro exam and a sharp rise in BP after initial improvement point to it. The nurse notifies the provider and stroke team at once and prepares for a stat non-contrast CT; if alteplase were still running, it would be stopped.",
    "tip": "After thrombolysis, any neurologic decline paired with headache, vomiting or rising BP means bleeding until proven otherwise."
   }
  ]
 },
 {
  "id": "cs-preeclampsia",
  "title": "Preeclampsia that turns severe",
  "sp": "ob",
  "topic": "Preeclampsia with severe features",
  "client": "32-year-old G1 P0 at 35 weeks, admitted to labor and delivery with headache and high blood pressure",
  "record": [
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "07:30",
    "text": "32-year-old G1 P0 at 35 0/7 weeks by early ultrasound. Prenatal BP 108/68 to 118/76 until 32 weeks; 138/88 at a clinic visit 5 days ago. No chronic hypertension, asthma or diabetes. No known drug allergies. Sent from clinic for BP 160/108 and headache. Weight 82 kg (181 lb)."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "07:40",
    "rows": [
     [
      "Temperature",
      "36.8 °C (98.2 °F)"
     ],
     [
      "Heart rate",
      "92"
     ],
     [
      "Blood pressure 07:40",
      "162/110"
     ],
     [
      "Blood pressure 07:55 (repeat)",
      "164/112"
     ],
     [
      "Respiratory rate",
      "18"
     ],
     [
      "SpO₂",
      "98% on room air"
     ],
     [
      "Fetal heart rate",
      "Baseline 140, moderate variability, accelerations present, no decelerations"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "07:45",
    "text": "Client reports a throbbing frontal headache rated 8/10 that did not improve with acetaminophen 1,000 mg at 05:00. She says she has been seeing flashing spots since last night. She reports a constant ache under her right ribs and in the upper abdomen. Trace edema of both ankles. Patellar reflexes 3+ with 2 beats of clonus. Urine dipstick protein 3+. Fetal heart rate baseline 140 with moderate variability and accelerations. She reports active fetal movement."
   },
   {
    "tab": "Laboratory Results",
    "at": 1,
    "time": "08:20",
    "rows": [
     [
      "Platelets",
      "92,000/mm³",
      "low"
     ],
     [
      "AST",
      "98 units/L",
      "high"
     ],
     [
      "ALT",
      "110 units/L",
      "high"
     ],
     [
      "Creatinine",
      "1.2 mg/dL",
      "high"
     ],
     [
      "Urine protein/creatinine ratio",
      "2.1",
      "high"
     ],
     [
      "Hemoglobin",
      "11.4 g/dL"
     ]
    ]
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "08:30",
    "text": "1. Labetalol 20 mg IV over 2 minutes now for BP 160/110 or higher; recheck BP in 10 minutes; if still 160/110 or higher give 40 mg IV, then 80 mg IV per protocol. 2. Magnesium sulfate 4 g IV over 20 minutes, then 1 g/h continuous infusion (maintenance reduced for creatinine above 1.1 mg/dL). Stop the infusion for absent reflexes, RR below 12 or decreased level of consciousness. 3. Calcium gluconate 1 g IV at the bedside; give 1 g IV over 3 minutes for RR below 12 per magnesium toxicity protocol. 4. BP every 15 minutes; reflexes, RR, level of consciousness and urine output every hour. 5. Indwelling urinary catheter; strict intake and output; total IV fluids 100 mL/h. 6. Notify provider for RR below 12, absent reflexes, urine output below 30 mL/h or SpO₂ below 95%. 7. Serum magnesium level 4 hours after the infusion starts and if toxicity is suspected. 8. Continuous fetal monitoring. 9. Begin induction of labor with oxytocin per protocol after maternal stabilization."
   },
   {
    "tab": "Medication Administration Record",
    "at": 4,
    "time": "08:35",
    "text": "08:35 Labetalol 20 mg IV (BP 164/110). 08:45 BP 162/108; labetalol 40 mg IV given 08:46. 08:56 BP 150/98. 08:40 Magnesium sulfate 4 g IV loading dose started; completed 09:00. 09:00 Magnesium sulfate 1 g/h started. 10:00 Oxytocin 2 milliunits/min started."
   },
   {
    "tab": "Intake and Output",
    "at": 4,
    "time": "13:00",
    "rows": [
     [
      "Urine 10:00 to 11:00",
      "40 mL"
     ],
     [
      "Urine 11:00 to 12:00",
      "24 mL"
     ],
     [
      "Urine 12:00 to 13:00",
      "18 mL"
     ],
     [
      "IV intake 12:00 to 13:00",
      "100 mL"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "13:00",
    "text": "Client is drowsy and opens her eyes to voice; speech is slurred. Patellar reflexes absent bilaterally. RR 10 and shallow. SpO₂ 93% on room air. BP 148/94, HR 88. Cervix 4 cm. Fetal heart rate baseline 130 with minimal variability, no decelerations."
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "13:40",
    "rows": [
     [
      "Magnesium (drawn 13:10)",
      "10.6 mg/dL (therapeutic 4.8 to 8.4)",
      "high"
     ],
     [
      "Creatinine (drawn 13:10)",
      "1.5 mg/dL",
      "high"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "14:15",
    "text": "Magnesium infusion stopped at 13:01. Oxygen by nonrebreather mask at 13:02. Calcium gluconate 1 g IV given 13:03 to 13:06. Provider at bedside 13:10. Client now alert and oriented, speaking clearly. Patellar reflexes 1+ bilaterally. Headache has returned, rated 6/10."
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "14:15",
    "rows": [
     [
      "Blood pressure 14:00",
      "164/108"
     ],
     [
      "Blood pressure 14:15 (repeat)",
      "166/108"
     ],
     [
      "Heart rate",
      "96"
     ],
     [
      "Respiratory rate",
      "16"
     ],
     [
      "SpO₂",
      "99% on nonrebreather mask"
     ],
     [
      "Fetal heart rate",
      "Baseline 135, moderate variability, no decelerations"
     ]
    ]
   },
   {
    "tab": "Intake and Output",
    "at": 5,
    "time": "14:00",
    "rows": [
     [
      "Urine 13:00 to 14:00",
      "28 mL"
     ]
    ]
   }
  ],
  "items": [
   {
    "id": "cs-preeclampsia-1",
    "type": "highlight",
    "step": "cues",
    "cn": "physio",
    "stem": "Refer to the chart. The nurse admits the client at 07:45.",
    "q": "Highlight the findings in the 07:45 nurses' note that require follow-up.",
    "parts": [
     {
      "t": "Client reports a throbbing frontal headache rated 8/10 that did not improve with acetaminophen 1,000 mg at 05:00.",
      "ok": true,
      "why": "Yes: a new, persistent headache that does not respond to analgesics is a cerebral sign of preeclampsia with severe features and a warning sign of eclampsia."
     },
     {
      "t": "She says she has been seeing flashing spots since last night.",
      "ok": true,
      "why": "Yes: scotomata reflect cerebral vasospasm and edema; visual disturbance is a severe feature and often comes before a seizure."
     },
     {
      "t": "She reports a constant ache under her right ribs and in the upper abdomen.",
      "ok": true,
      "why": "Yes: right upper quadrant or epigastric pain signals liver swelling or injury. The trap is writing it off as heartburn of late pregnancy."
     },
     {
      "t": "Trace edema of both ankles.",
      "ok": false,
      "why": "No: dependent ankle edema is common in the third trimester and is no longer a diagnostic criterion for preeclampsia."
     },
     {
      "t": "Patellar reflexes 3+ with 2 beats of clonus.",
      "ok": true,
      "why": "Yes: hyperreflexia with clonus shows central nervous system irritability and raises the risk of an eclamptic seizure."
     },
     {
      "t": "Urine dipstick protein 3+.",
      "ok": true,
      "why": "Yes: new proteinuria with hypertension after 20 weeks supports preeclampsia and needs a quantitative test to confirm."
     },
     {
      "t": "Fetal heart rate baseline 140 with moderate variability and accelerations.",
      "ok": false,
      "why": "No: a normal baseline with moderate variability and accelerations is a reassuring tracing that shows the fetus is well oxygenated right now."
     },
     {
      "t": "She reports active fetal movement.",
      "ok": false,
      "why": "No: active movement is a reassuring sign of fetal well-being and does not need follow-up."
     }
    ],
    "why": "This client has severe-range blood pressure plus cerebral, visual and hepatic symptoms, which together point to preeclampsia with severe features. Hyperreflexia with clonus signals that the brain is irritable and a seizure could follow. The fetal findings are reassuring for now, and ankle edema is an expected pregnancy change.",
    "tip": "Sort each finding by body system and ask whether it is new and abnormal for pregnancy or an expected third-trimester change."
   },
   {
    "id": "cs-preeclampsia-2",
    "type": "matrix",
    "step": "analyze",
    "cn": "physio",
    "update": "It is now 08:20. The laboratory results are back.",
    "stem": "Refer to the chart.",
    "q": "For each finding, indicate whether it is a severe feature of preeclampsia or is not a severe feature.",
    "cols": [
     "Severe feature",
     "Not a severe feature"
    ],
    "rows": [
     {
      "t": "BP 162/110 and 164/112, 15 minutes apart",
      "ans": 0,
      "why": "a systolic of 160 or higher or a diastolic of 110 or higher, confirmed on repeat, is severe-range hypertension that must be treated promptly."
     },
     {
      "t": "Platelets 92,000/mm³",
      "ans": 0,
      "why": "a platelet count below 100,000/mm³ is a severe feature and raises concern for evolving HELLP syndrome."
     },
     {
      "t": "AST 98 units/L and ALT 110 units/L",
      "ans": 0,
      "why": "liver enzymes at twice the upper limit of normal reflect hepatic injury and explain her right upper quadrant pain."
     },
     {
      "t": "Creatinine 1.2 mg/dL",
      "ans": 0,
      "why": "a creatinine above 1.1 mg/dL signals renal insufficiency. Creatinine normally falls in pregnancy, so this value is clearly abnormal."
     },
     {
      "t": "Urine protein/creatinine ratio 2.1",
      "ans": 1,
      "why": "the ratio confirms proteinuria, but the amount of protein is no longer counted as a severe feature. The trap is assuming more protein means more severe disease."
     },
     {
      "t": "Hemoglobin 11.4 g/dL",
      "ans": 1,
      "why": "mild dilutional anemia is expected in the third trimester because plasma volume expands faster than red cell mass."
     }
    ],
    "why": "Under ACOG criteria, severe features include severe-range BP, platelets below 100,000/mm³, liver enzymes twice normal, creatinine above 1.1 mg/dL, pulmonary edema, and new cerebral or visual symptoms. The quantity of proteinuria is not a severe feature. This client meets several criteria, so delivery after stabilization is indicated at 35 weeks.",
    "tip": "Memorize the short list of severe features; anything not on that list, such as the amount of protein or edema, does not upgrade the diagnosis."
   },
   {
    "id": "cs-preeclampsia-3",
    "type": "cloze",
    "step": "hypo",
    "cn": "risk",
    "stem": "Refer to the chart.",
    "q": "Complete the sentences.",
    "parts": [
     "The client is at greatest risk for ",
     {
      "opts": [
       "an eclamptic seizure",
       "a pulmonary embolism",
       "hypovolemic shock"
      ],
      "ans": 0,
      "whys": [
       "Yes: preeclampsia with cerebral symptoms and hyperreflexia can progress to eclampsia, a life-threatening seizure for both client and fetus.",
       "No: pregnancy raises clot risk, but she has no dyspnea, chest pain or hypoxemia to suggest an embolism.",
       "No: she is hypertensive, not hypotensive, and has no bleeding; shock is not the current threat."
      ]
     },
     " as shown by ",
     {
      "opts": [
       "the persistent headache, flashing spots and 3+ reflexes with clonus",
       "the ankle edema and urine protein",
       "the fetal heart rate baseline of 140"
      ],
      "ans": 0,
      "whys": [
       "Yes: these are signs of cerebral irritability and vasospasm, the warning signs that most often come before an eclamptic seizure.",
       "No: edema is expected in pregnancy and proteinuria confirms the diagnosis, but neither predicts a seizure.",
       "No: a baseline of 140 is normal and reflects fetal status, not maternal seizure risk."
      ]
     },
     ". Her sustained blood pressure of 164/112 also places her at immediate risk for ",
     {
      "opts": [
       "hemorrhagic stroke",
       "deep vein thrombosis",
       "hypoglycemia"
      ],
      "ans": 0,
      "whys": [
       "Yes: severe systolic hypertension is the leading cause of stroke in preeclampsia, which is why severe-range BP is treated within 30 to 60 minutes.",
       "No: DVT is a pregnancy risk, but it is not caused by acute severe hypertension.",
       "No: nothing in the record suggests a glucose problem; she has no diabetes."
      ]
     },
     "."
    ],
    "why": "Two threats compete for attention: eclampsia and stroke. Headache, visual changes and hyperreflexia warn of a seizure, so magnesium sulfate is needed. Sustained severe-range BP threatens a cerebral hemorrhage, so a fast-acting antihypertensive is needed at the same time. Both are treated urgently.",
    "tip": "When a client has severe hypertension, link each finding to the organ at risk: brain signs predict seizure and stroke, liver and platelet changes predict HELLP."
   },
   {
    "id": "cs-preeclampsia-4",
    "type": "sata",
    "step": "solve",
    "cn": "pharm",
    "update": "It is now 08:25. The provider confirms preeclampsia with severe features and plans delivery once the client is stabilized.",
    "stem": "Refer to the chart.",
    "q": "Which interventions should the nurse anticipate in the plan of care? Select all that apply.",
    "opts": [
     {
      "t": "Give an IV antihypertensive within 30 to 60 minutes of the confirmed severe-range BP",
      "ok": true,
      "why": "Yes: ACOG recommends treating confirmed severe-range BP within 30 to 60 minutes with IV labetalol, IV hydralazine or immediate-release oral nifedipine to prevent stroke."
     },
     {
      "t": "Magnesium sulfate IV loading dose followed by a continuous infusion",
      "ok": true,
      "why": "Yes: magnesium sulfate is the drug of choice to prevent eclamptic seizures. With a creatinine of 1.2 mg/dL the loading dose is unchanged, but the maintenance rate is reduced and levels are checked because the kidneys clear magnesium."
     },
     {
      "t": "Calcium gluconate available at the bedside",
      "ok": true,
      "why": "Yes: calcium gluconate is the antidote for magnesium toxicity and must be ready before the infusion begins."
     },
     {
      "t": "Hourly patellar reflexes, respiratory rate, urine output and level of consciousness",
      "ok": true,
      "why": "Yes: loss of reflexes, slowed breathing, low urine output and drowsiness are the bedside signs of rising magnesium levels."
     },
     {
      "t": "Seizure precautions with suction and oxygen at the bedside and low stimulation",
      "ok": true,
      "why": "Yes: magnesium lowers but does not remove seizure risk, so the room must be ready to protect the airway."
     },
     {
      "t": "Furosemide IV to reduce her edema",
      "ok": false,
      "why": "No: preeclampsia already depletes intravascular volume; a diuretic would worsen kidney and placental perfusion. The trap is treating the edema."
     },
     {
      "t": "Lower the BP to 110/70 within the first hour",
      "ok": false,
      "why": "No: the goal is about 140 to 150 over 90 to 100; dropping BP too far or too fast reduces placental blood flow and harms the fetus."
     },
     {
      "t": "Encourage 3 L of oral fluids to protect her kidneys",
      "ok": false,
      "why": "No: leaky capillaries put her at risk for pulmonary edema, so total fluids are restricted and tracked closely."
     }
    ],
    "why": "The plan has two urgent goals: lower severe-range BP promptly and prevent seizures. That means a first-line antihypertensive within 30 to 60 minutes and magnesium sulfate with hourly toxicity checks and the antidote ready. Fluids are restricted, diuretics are avoided, and BP is lowered gradually to protect the placenta.",
    "tip": "For severe preeclampsia, think in pairs: an antihypertensive for stroke and magnesium for seizures, each with its own safety monitoring."
   },
   {
    "id": "cs-preeclampsia-5",
    "type": "order",
    "step": "act",
    "cn": "pharm",
    "update": "It is now 13:00. The client has received magnesium sulfate 1 g/h since 09:00 and oxytocin since 10:00. The nurse finds her as documented in the 13:00 note.",
    "stem": "Refer to the chart, including the Orders, Medication Administration Record and Intake and Output.",
    "q": "Place the nurse's actions in the order they should be performed.",
    "opts": [
     "Stop the magnesium sulfate infusion.",
     "Stay with the client, call for help and have the provider notified now, and apply oxygen by nonrebreather mask.",
     "Give calcium gluconate 1 g IV over 3 minutes per protocol.",
     "Draw the serum magnesium level and recheck reflexes, RR, SpO₂ and level of consciousness after the calcium dose.",
     "Give the provider a full SBAR report at the bedside, including the response to calcium and the urine output trend."
    ],
    "whys": [
     "Yes: stopping the source comes first; every minute it runs adds magnesium that her failing kidneys cannot clear, and the order set authorizes stopping it.",
     "Yes: RR 10 with drowsiness threatens her breathing, so support oxygenation and summon the team and provider without leaving the bedside; the order calls for prompt notification.",
     "Yes: calcium reverses magnesium's effect at the neuromuscular junction; the protocol allows it for RR below 12 without waiting for a level.",
     "Yes: the level confirms toxicity and guides when magnesium can safely resume, and reassessment after the antidote shows whether it worked.",
     "Yes: once the antidote and reassessment are done, a complete report lets the provider decide on further magnesium, the BP and the delivery plan."
    ],
    "why": "Absent reflexes, RR 10, drowsiness and urine output below 30 mL/h for 2 hours mean magnesium toxicity. Magnesium is cleared by the kidneys, so oliguria lets it build up even at a reduced maintenance rate. The nurse stops the drug, calls for help and the provider while supporting breathing, gives the antidote, then reassesses and gives a full report.",
    "tip": "In a drug toxicity emergency, stop the drug, call for help while protecting the airway, give the antidote, then reassess and report the response."
   },
   {
    "id": "cs-preeclampsia-6",
    "type": "matrix",
    "step": "eval",
    "cn": "physio",
    "update": "It is now 14:15. The magnesium infusion was stopped at 13:01 and calcium gluconate was given at 13:06.",
    "stem": "Refer to the chart.",
    "q": "For each finding, indicate whether it shows improvement or requires follow-up.",
    "cols": [
     "Improving",
     "Requires follow-up"
    ],
    "rows": [
     {
      "t": "RR 16 and SpO₂ 99%",
      "ans": 0,
      "why": "breathing has returned to normal after stopping the infusion and giving calcium gluconate."
     },
     {
      "t": "Patellar reflexes 1+",
      "ans": 0,
      "why": "the return of reflexes shows the magnesium effect on the neuromuscular junction is lessening."
     },
     {
      "t": "Alert, oriented and speaking clearly",
      "ans": 0,
      "why": "her level of consciousness has returned, which shows central nervous system depression has resolved."
     },
     {
      "t": "Urine output 28 mL in the last hour",
      "ans": 1,
      "why": "output is still below 30 mL/h and creatinine has risen, so magnesium will keep accumulating if it is restarted at the same dose."
     },
     {
      "t": "BP 164/108 and 166/108, 15 minutes apart",
      "ans": 1,
      "why": "this is severe-range hypertension again and needs an antihypertensive within 30 to 60 minutes; her returning headache adds to the concern."
     },
     {
      "t": "Fetal heart rate baseline 135 with moderate variability",
      "ans": 0,
      "why": "variability has returned from minimal to moderate as the magnesium effect fades, a reassuring sign of fetal oxygenation."
     }
    ],
    "why": "The antidote worked: breathing, reflexes and alertness have recovered. The client is not out of danger, though. Her BP is back in the severe range with a headache, and her kidneys are still clearing poorly, so the provider must treat the BP now and adjust magnesium before restarting it.",
    "tip": "When evaluating, check whether each original problem resolved, then look for anything that has returned or worsened."
   }
  ]
 },
 {
  "id": "cs-infant-dehydration",
  "title": "Infant with gastroenteritis and dehydration",
  "sp": "peds",
  "topic": "Pediatric dehydration",
  "client": "11-month-old male, 8.5 kg, admitted to the pediatric unit with vomiting and diarrhea",
  "record": [
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "10:00",
    "text": "11-month-old, previously healthy. Rotavirus vaccine series not completed. Attends daycare where several children have had diarrhea this week. Watery, nonbloody stools 8 to 10 times a day for 3 days and vomiting for 2 days. Taking only sips of formula since yesterday. Weight today 8.5 kg (18.7 lb); weight at a clinic visit 2 weeks ago 9.5 kg (20.9 lb). No known allergies."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "10:05",
    "rows": [
     [
      "Temperature",
      "38.3 °C (100.9 °F) axillary"
     ],
     [
      "Heart rate",
      "178"
     ],
     [
      "Blood pressure",
      "78/48"
     ],
     [
      "Respiratory rate",
      "40"
     ],
     [
      "Capillary refill",
      "4 seconds"
     ],
     [
      "SpO₂",
      "99% on room air"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "10:10",
    "text": "Infant lies quietly in the caregiver's arms and arouses only to touch. Weak cry without tears. Mucous membranes dry and sticky. Anterior fontanel sunken. Skin on the abdomen tents briefly. Hands and feet cool. One wet diaper in the last 12 hours, per the caregiver. Diaper area red and raw."
   },
   {
    "tab": "Laboratory Results",
    "at": 1,
    "time": "10:40",
    "rows": [
     [
      "Sodium",
      "137 mEq/L"
     ],
     [
      "Potassium",
      "3.4 mEq/L",
      "low"
     ],
     [
      "Chloride",
      "110 mEq/L",
      "high"
     ],
     [
      "Bicarbonate",
      "15 mEq/L",
      "low"
     ],
     [
      "BUN",
      "28 mg/dL",
      "high"
     ],
     [
      "Creatinine",
      "0.6 mg/dL",
      "high"
     ],
     [
      "Stool rotavirus antigen",
      "Pending"
     ]
    ]
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "10:50",
    "text": "1. Contact precautions. 2. Peripheral IV. 3. 0.9% sodium chloride 170 mL (20 mL/kg) IV over 20 minutes; reassess and notify provider if perfusion does not improve. 4. Point-of-care glucose now. 5. After the bolus: D5 0.9% sodium chloride at 34 mL/h; add potassium chloride 20 mEq/L after the first void. 6. Oral rehydration solution 5 mL every 1 to 2 minutes once awake and able to suck; advance as tolerated. 7. Strict intake and output; weigh all diapers. 8. Daily weight, unclothed, on the same scale."
   },
   {
    "tab": "Laboratory Results",
    "at": 4,
    "time": "11:00",
    "rows": [
     [
      "Point-of-care glucose",
      "74 mg/dL"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "11:00",
    "text": "24-gauge IV placed in the right hand on the second attempt. Infant remains lethargic. No void since admission."
   },
   {
    "tab": "Intake and Output",
    "at": 5,
    "time": "16:00",
    "rows": [
     [
      "0.9% sodium chloride bolus 11:00 to 11:20",
      "170 mL"
     ],
     [
      "D5 0.9% sodium chloride 11:20 to 16:00 (potassium chloride added 12:45)",
      "159 mL"
     ],
     [
      "Oral rehydration solution 14:00 to 16:00",
      "90 mL"
     ],
     [
      "Diaper 12:40, urine",
      "38 g"
     ],
     [
      "Diaper 14:10, urine",
      "52 g"
     ],
     [
      "Diaper 15:50, urine and loose stool",
      "60 g"
     ]
    ]
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "16:00",
    "rows": [
     [
      "Temperature",
      "37.6 °C (99.7 °F) axillary"
     ],
     [
      "Heart rate",
      "128"
     ],
     [
      "Blood pressure",
      "86/54"
     ],
     [
      "Respiratory rate",
      "32"
     ],
     [
      "Capillary refill",
      "2 seconds"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "16:00",
    "text": "Infant awake, fussing and reaching for his bottle. Tears present when crying. Mucous membranes moist. Took 90 mL of oral rehydration solution since 14:00 without vomiting. Caregiver at the bedside; oral rehydration teaching started."
   }
  ],
  "items": [
   {
    "id": "cs-infant-dehydration-1",
    "type": "sata",
    "step": "cues",
    "cn": "physio",
    "stem": "Refer to the chart. The nurse completes the admission assessment at 10:10.",
    "q": "Which findings indicate dehydration with poor perfusion? Select all that apply.",
    "opts": [
     {
      "t": "Anterior fontanel sunken",
      "ok": true,
      "why": "Yes: a sunken fontanel in an infant reflects loss of extracellular fluid volume and is a classic sign of significant dehydration."
     },
     {
      "t": "Weak cry without tears",
      "ok": true,
      "why": "Yes: absent tears and a weak cry show the infant is conserving fluid and losing energy, both signs of moderate to severe dehydration."
     },
     {
      "t": "Capillary refill 4 seconds with cool hands and feet",
      "ok": true,
      "why": "Yes: refill longer than 3 seconds and cool extremities show the body is shunting blood away from the skin to protect vital organs."
     },
     {
      "t": "Heart rate 178",
      "ok": true,
      "why": "Yes: tachycardia is how infants maintain cardiac output when stroke volume falls; it is an early sign of shock."
     },
     {
      "t": "One wet diaper in 12 hours",
      "ok": true,
      "why": "Yes: low urine output shows the kidneys are conserving water because renal blood flow has dropped."
     },
     {
      "t": "Arouses only to touch",
      "ok": true,
      "why": "Yes: lethargy means the brain is not getting enough perfusion and marks dehydration as severe."
     },
     {
      "t": "Blood pressure 78/48",
      "ok": false,
      "why": "No: this is within the normal range for age. Infants keep BP normal until late shock; the trap is feeling reassured by it."
     },
     {
      "t": "Red, raw diaper area",
      "ok": false,
      "why": "No: this is irritant dermatitis from frequent stools; it needs skin care but does not reflect fluid volume or perfusion."
     }
    ],
    "why": "Infants show dehydration through the fontanel, tears, mucous membranes, urine output and perfusion. Tachycardia, delayed capillary refill and lethargy mean circulation is affected. A normal BP is expected until shock is advanced, so it should never be used to rule out hypovolemia in a child.",
    "tip": "In pediatric shock, rely on heart rate, capillary refill and mental status; hypotension is a late, ominous sign."
   },
   {
    "id": "cs-infant-dehydration-2",
    "type": "cloze",
    "step": "analyze",
    "cn": "physio",
    "update": "It is now 10:40. The electrolyte results are back.",
    "stem": "Refer to the chart.",
    "q": "Complete the sentences.",
    "parts": [
     "The weight change from 9.5 kg to 8.5 kg is a loss of about ",
     {
      "opts": [
       "10%",
       "5%",
       "1%"
      ],
      "ans": 0,
      "whys": [
       "Yes: 1 kg lost from 9.5 kg is about 10.5%. Acute weight loss in diarrheal illness is mostly fluid.",
       "No: 5% would be a loss of about 0.5 kg; this infant lost twice that.",
       "No: 1% confuses the 1 kg lost with a percentage; divide the loss by the starting weight."
      ]
     },
     " of body weight. Together with lethargy and capillary refill of 4 seconds, this indicates ",
     {
      "opts": [
       "severe",
       "mild",
       "no"
      ],
      "ans": 0,
      "whys": [
       "Yes: a loss of 10% or more with altered mental status and delayed refill is severe dehydration with impaired perfusion.",
       "No: mild dehydration is under 5% loss with a normal heart rate, normal refill and an alert infant.",
       "No: every perfusion and hydration finding in the chart is abnormal."
      ]
     },
     " dehydration. The bicarbonate of 15 mEq/L indicates ",
     {
      "opts": [
       "metabolic acidosis from bicarbonate lost in stool and poor perfusion",
       "metabolic alkalosis from vomiting",
       "respiratory acidosis from hypoventilation"
      ],
      "ans": 0,
      "whys": [
       "Yes: diarrhea removes bicarbonate, and poor perfusion adds lactic acid, so the bicarbonate falls and chloride rises.",
       "No: vomiting can cause alkalosis, but a low bicarbonate means acidosis; the diarrhea losses dominate here.",
       "No: his respiratory rate is not low, and a respiratory acidosis would raise bicarbonate, not lower it."
      ]
     },
     "."
    ],
    "why": "Percent weight loss is the most objective measure of dehydration in infants. This infant lost about 10% and has lethargy and delayed refill, which is severe dehydration. Diarrhea also causes a non-anion-gap metabolic acidosis, and the low potassium reflects stool losses.",
    "tip": "Calculate percent weight loss as the amount lost divided by the starting weight, then match it to the mild, moderate and severe ranges."
   },
   {
    "id": "cs-infant-dehydration-3",
    "type": "matrix",
    "step": "hypo",
    "cn": "mgmt",
    "stem": "Refer to the chart.",
    "q": "For each client problem, indicate whether it is the priority now, should be addressed after the priority, or is not a current problem.",
    "cols": [
     "Priority now",
     "Address after the priority",
     "Not a current problem"
    ],
    "rows": [
     {
      "t": "Hypovolemia with poor tissue perfusion",
      "ans": 0,
      "why": "lethargy, tachycardia and delayed refill show circulation is failing; restoring volume comes first because it threatens life."
     },
     {
      "t": "Metabolic acidosis",
      "ans": 1,
      "why": "the acidosis comes from stool losses and poor perfusion and will improve as volume is restored, so treating the cause comes first."
     },
     {
      "t": "Irritant dermatitis in the diaper area",
      "ans": 1,
      "why": "skin care with barrier cream and frequent changes is needed, but it is not a threat to life."
     },
     {
      "t": "Caregiver knowledge of oral rehydration",
      "ans": 1,
      "why": "teaching matters for home care but should wait until the infant is stable and the caregiver can focus."
     },
     {
      "t": "Fluid volume excess",
      "ans": 2,
      "why": "nothing in the chart suggests overload; the infant is clearly volume depleted."
     },
     {
      "t": "Hypernatremia",
      "ans": 2,
      "why": "the sodium of 137 mEq/L is normal, so this is isotonic dehydration and hypernatremia is not present."
     }
    ],
    "why": "Prioritize by threat to life. Hypovolemia with signs of poor perfusion affects circulation and the brain, so it comes first. The acidosis is a result of the hypovolemia and will improve with fluid. Skin and teaching needs are real but follow stabilization.",
    "tip": "Use ABCs to prioritize: a circulation problem with altered mental status outranks lab abnormalities that will correct with treatment of the cause."
   },
   {
    "id": "cs-infant-dehydration-4",
    "type": "matrix",
    "step": "solve",
    "cn": "pharm",
    "update": "It is now 10:45. The nurse and provider discuss the plan of care.",
    "stem": "Refer to the chart. The infant weighs 8.5 kg.",
    "q": "For each potential intervention, indicate whether it is indicated or not indicated for this client.",
    "cols": [
     "Indicated",
     "Not indicated"
    ],
    "rows": [
     {
      "t": "0.9% sodium chloride 170 mL IV bolus",
      "ans": 0,
      "why": "20 mL/kg times 8.5 kg is 170 mL of isotonic fluid, the standard bolus for hypovolemia with poor perfusion."
     },
     {
      "t": "D5 0.2% sodium chloride 170 mL IV bolus",
      "ans": 1,
      "why": "hypotonic dextrose fluid does not stay in the vessels and can cause hyponatremia; boluses must be isotonic."
     },
     {
      "t": "Point-of-care blood glucose",
      "ans": 0,
      "why": "infants have small glycogen stores, and poor intake plus lethargy can mean hypoglycemia, which must be ruled out quickly."
     },
     {
      "t": "Maintenance IV rate of 34 mL/h after the bolus",
      "ans": 0,
      "why": "by the 4-2-1 rule, 4 mL/kg/h for the first 10 kg times 8.5 kg is 34 mL/h."
     },
     {
      "t": "Loperamide to slow the diarrhea",
      "ans": 1,
      "why": "antidiarrheals are not recommended for young children with acute gastroenteritis because of serious adverse effects, and they do not treat the fluid loss."
     },
     {
      "t": "Potassium chloride in the IV fluid before the first void",
      "ans": 1,
      "why": "potassium is added only after urine output confirms the kidneys can excrete it, even though his potassium is low."
     }
    ],
    "why": "Severe dehydration needs a rapid 20 mL/kg isotonic bolus, a glucose check and then weight-based maintenance fluid. Holliday-Segar gives 4 mL/kg/h for the first 10 kg. Hypotonic boluses, antidiarrheals and potassium before voiding are unsafe for this infant.",
    "tip": "For any pediatric fluid order, check that the bolus is isotonic and weight-based, and confirm urine output before adding potassium."
   },
   {
    "id": "cs-infant-dehydration-5",
    "type": "sata",
    "step": "act",
    "cn": "safety",
    "update": "It is now 11:00. The IV is in place, the point-of-care glucose is 74 mg/dL, and the infant has not voided since admission.",
    "stem": "Refer to the chart, including the Orders.",
    "q": "Which actions should the nurse take? Select all that apply.",
    "opts": [
     {
      "t": "Place the infant on contact precautions and wear a gown and gloves for care",
      "ok": true,
      "why": "Yes: rotavirus spreads by the fecal-oral route and survives on surfaces, so contact precautions protect other children on the unit."
     },
     {
      "t": "Infuse the 170 mL bolus by infusion pump over 20 minutes",
      "ok": true,
      "why": "Yes: a pump delivers the exact weight-based volume over the ordered time, which prevents both under- and over-infusion in a small infant."
     },
     {
      "t": "Reassess heart rate, capillary refill and mental status after the bolus",
      "ok": true,
      "why": "Yes: response to each bolus decides whether another is needed; the order asks the nurse to notify the provider if perfusion does not improve."
     },
     {
      "t": "Weigh each diaper, subtract the dry weight and record 1 g as 1 mL",
      "ok": true,
      "why": "Yes: diaper weights are the most accurate way to measure infant output; 1 g of wet weight equals about 1 mL of urine."
     },
     {
      "t": "Give 120 mL of apple juice by bottle to start oral rehydration",
      "ok": false,
      "why": "No: a lethargic infant is at risk for aspiration, and juice is high in sugar and low in sodium, which worsens diarrhea."
     },
     {
      "t": "Hang the maintenance fluid with potassium chloride now",
      "ok": false,
      "why": "No: the infant has not voided; potassium is added only after the first void, as the order states."
     },
     {
      "t": "Take the temperature rectally with each set of vital signs",
      "ok": false,
      "why": "No: rectal temperatures are avoided in an infant with frequent diarrhea because they irritate the inflamed mucosa and can stimulate more stools; use the axillary route."
     }
    ],
    "why": "The nurse delivers the bolus accurately, checks the response, measures output precisely and protects other clients from a highly contagious virus. Oral fluids wait until the infant is alert enough to suck safely, and potassium waits for urine output.",
    "tip": "When a sata mixes safety and treatment, check each option against the client's current status, such as level of alertness and whether the client has voided."
   },
   {
    "id": "cs-infant-dehydration-6",
    "type": "matrix",
    "step": "eval",
    "cn": "basic",
    "update": "It is now 16:00. The infant is drinking oral rehydration solution, and the caregiver asks how to continue it at home.",
    "stem": "Refer to the chart.",
    "q": "For each finding or caregiver statement, indicate whether it shows improvement or understanding, or needs further intervention or teaching.",
    "cols": [
     "Shows improvement or understanding",
     "Needs further intervention or teaching"
    ],
    "rows": [
     {
      "t": "Heart rate 128, capillary refill 2 seconds, awake and reaching for his bottle",
      "ans": 0,
      "why": "heart rate, refill and alertness have all returned toward normal, showing perfusion has been restored."
     },
     {
      "t": "Urine-only diapers of 38 g at 12:40 and 52 g at 14:10",
      "ans": 0,
      "why": "about 90 mL of urine in roughly 3 hours after the bolus is well above 1 mL/kg/h for an 8.5 kg infant, showing kidney perfusion has returned."
     },
     {
      "t": "\"I will give him about 5 mL of the solution every minute or two and give more as he keeps it down.\"",
      "ans": 0,
      "why": "small, frequent amounts are the correct way to give oral rehydration solution because they are absorbed without triggering vomiting."
     },
     {
      "t": "\"At home I will give him apple juice or a sports drink instead, since he likes them better.\"",
      "ans": 1,
      "why": "juice and sports drinks have too much sugar and too little sodium; they can worsen diarrhea and do not replace electrolytes."
     },
     {
      "t": "\"If the diarrhea starts again, I will stop his formula and solid foods for a few days.\"",
      "ans": 1,
      "why": "infants should resume their usual diet as soon as they are rehydrated; withholding food delays gut recovery and worsens nutrition."
     },
     {
      "t": "\"I will call if he has no wet diaper in 6 hours, will not drink or is very sleepy.\"",
      "ans": 0,
      "why": "these are the correct warning signs of recurring dehydration that need prompt medical care."
     }
    ],
    "why": "Normal heart rate, brisk refill, alertness and good urine output show the bolus and maintenance fluid worked. Teaching focuses on giving oral rehydration solution in small frequent amounts, avoiding sugary drinks, continuing normal feeding and knowing when to call. Two statements show the caregiver needs more teaching.",
    "tip": "For evaluation items with caregiver statements, flag any statement that substitutes a sugary drink for oral rehydration solution or withholds normal feeding."
   }
  ]
 },
 {
  "id": "cs-burns",
  "title": "House fire with inhalation injury",
  "sp": "ed",
  "topic": "Major burns and inhalation injury",
  "client": "34-year-old male, 80 kg, brought to the emergency department after a house fire",
  "record": [
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "03:00",
    "text": "34-year-old male, 80 kg (176 lb), carried by firefighters from a closed bedroom of a burning house. Time of injury about 02:00. EMS could not obtain IV access; no fluids given in the field. No past medical history, no allergies, tetanus status unknown. Burns: partial-thickness and full-thickness burns of the entire anterior trunk and both entire arms. Face reddened without blisters (superficial)."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "03:00",
    "rows": [
     [
      "Temperature",
      "36.4 °C (97.5 °F)"
     ],
     [
      "Heart rate",
      "118"
     ],
     [
      "Blood pressure",
      "132/84"
     ],
     [
      "Respiratory rate",
      "26"
     ],
     [
      "SpO₂",
      "98% on 2 L/min nasal cannula"
     ],
     [
      "Pain",
      "9/10"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "03:05",
    "text": "Found in a closed bedroom. Nasal hairs and eyebrows singed. Soot around the mouth; coughing up black-streaked sputum. Voice is hoarse. High-pitched sound on inspiration, heard intermittently. Reports a headache and nausea. SpO₂ 98% on 2 L/min nasal cannula. Rates pain 9/10 in his arms and chest."
   },
   {
    "tab": "Laboratory Results",
    "at": 1,
    "time": "03:20",
    "rows": [
     [
      "pH",
      "7.32",
      "low"
     ],
     [
      "PaCO₂",
      "36 mm Hg"
     ],
     [
      "PaO₂",
      "92 mm Hg"
     ],
     [
      "Bicarbonate",
      "19 mEq/L",
      "low"
     ],
     [
      "Carboxyhemoglobin",
      "18%",
      "high"
     ],
     [
      "Lactate",
      "2.8 mmol/L",
      "high"
     ],
     [
      "Hemoglobin",
      "17.2 g/dL",
      "high"
     ]
    ]
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "03:30",
    "text": "1. 100% oxygen by nonrebreather mask. 2. Prepare for rapid sequence intubation; anesthesia to the bedside. 3. Two large-bore IVs. 4. Lactated Ringer's by Parkland formula: 4 mL/kg/%TBSA over 24 hours, half in the first 8 hours from the time of injury; titrate to urine output 0.5 mL/kg/h. 5. Indwelling urinary catheter; hourly urine output. 6. Morphine 4 mg IV now and every hour as needed for pain. 7. Cover burns with clean, dry sheets; keep the room warm. 8. Tetanus toxoid IM. 9. NPO. 10. Repeat carboxyhemoglobin and lactate at 08:00."
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "03:45",
    "text": "On 100% oxygen by nonrebreather mask. Stridor now continuous and voice more hoarse. Anesthesia at the bedside preparing for intubation. Two large-bore IVs in place. Lactated Ringer's ready to start at 04:00."
   },
   {
    "tab": "Intake and Output",
    "at": 5,
    "time": "08:00",
    "rows": [
     [
      "Lactated Ringer's 04:00 to 08:00",
      "3,840 mL"
     ],
     [
      "Urine 05:00 to 06:00",
      "45 mL"
     ],
     [
      "Urine 06:00 to 07:00",
      "22 mL"
     ],
     [
      "Urine 07:00 to 08:00",
      "18 mL"
     ]
    ]
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "08:00",
    "rows": [
     [
      "Carboxyhemoglobin",
      "4%"
     ],
     [
      "Lactate",
      "3.9 mmol/L",
      "high"
     ],
     [
      "Hemoglobin",
      "17.8 g/dL",
      "high"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "08:00",
    "text": "Intubated at 03:50; sedated, opens eyes to voice. Heart rate 128, up from 112 at 05:00. BP 92/54. Urine output 22 mL/h and 18 mL/h over the last 2 hours. Lactate 3.9 mmol/L, up from 2.8. Breath sounds clear; SpO₂ 99% on FiO₂ 0.40. Temperature 36.9 °C (98.4 °F) with warm blankets and the room warmed. Carboxyhemoglobin 4%."
   }
  ],
  "items": [
   {
    "id": "cs-burns-1",
    "type": "highlight",
    "step": "cues",
    "cn": "physio",
    "stem": "Refer to the chart. The client arrived in the emergency department at 03:00.",
    "q": "Highlight the findings in the 03:05 note that suggest inhalation injury or carbon monoxide poisoning.",
    "parts": [
     {
      "t": "Found in a closed bedroom.",
      "ok": true,
      "why": "Yes: a fire in an enclosed space traps smoke and hot gases, which greatly raises the risk of both inhalation injury and carbon monoxide poisoning."
     },
     {
      "t": "Nasal hairs and eyebrows singed.",
      "ok": true,
      "why": "Yes: singed facial hair shows heat reached the face and airway, a classic sign of thermal airway injury."
     },
     {
      "t": "Soot around the mouth; coughing up black-streaked sputum.",
      "ok": true,
      "why": "Yes: carbonaceous sputum means smoke particles reached the lower airway, which signals inhalation injury."
     },
     {
      "t": "Voice is hoarse.",
      "ok": true,
      "why": "Yes: hoarseness means the vocal cords and larynx are swelling, an early sign the upper airway may close."
     },
     {
      "t": "High-pitched sound on inspiration, heard intermittently.",
      "ok": true,
      "why": "Yes: stridor means the upper airway is already narrowed; swelling worsens over hours, so this is an emergency."
     },
     {
      "t": "Reports a headache and nausea.",
      "ok": true,
      "why": "Yes: headache and nausea are early symptoms of carbon monoxide poisoning, which blocks oxygen delivery to tissues."
     },
     {
      "t": "SpO₂ 98% on 2 L/min nasal cannula.",
      "ok": false,
      "why": "No: this reading does not suggest poisoning, but it does not rule it out; pulse oximetry reads carboxyhemoglobin as oxygenated hemoglobin. The trap is feeling reassured."
     },
     {
      "t": "Rates pain 9/10 in his arms and chest.",
      "ok": false,
      "why": "No: severe pain is expected with partial-thickness burns and needs treatment, but it does not point to an airway or carbon monoxide injury."
     }
    ],
    "why": "Inhalation injury is suggested by an enclosed-space fire, singed facial hair, carbonaceous sputum, hoarseness and stridor. Airway edema worsens over the first hours, so these cues call for early intubation. Headache and nausea point to carbon monoxide, which a normal SpO₂ cannot rule out.",
    "tip": "In any burn client, look at the face, voice and sputum first; airway cues outrank the burn wounds themselves."
   },
   {
    "id": "cs-burns-2",
    "type": "cloze",
    "step": "analyze",
    "cn": "physio",
    "update": "It is now 03:20. The arterial blood gas and carboxyhemoglobin results are back.",
    "stem": "Refer to the chart. Use the rule of nines and the Parkland formula (lactated Ringer's 4 mL/kg/%TBSA over 24 hours).",
    "q": "Complete the sentences.",
    "parts": [
     "The burned total body surface area is ",
     {
      "opts": [
       "36%",
       "45%",
       "27%"
      ],
      "ans": 0,
      "whys": [
       "Yes: anterior trunk 18% plus each entire arm 9% equals 36%. Only partial-thickness and full-thickness burns are counted.",
       "No: this adds the 9% for the head, but the face burn is superficial, and superficial burns are not counted in the TBSA.",
       "No: this counts only one arm; both entire arms are burned, 9% each."
      ]
     },
     ". The volume of lactated Ringer's due in the first 8 hours after injury is ",
     {
      "opts": [
       "5,760 mL",
       "11,520 mL",
       "2,880 mL"
      ],
      "ans": 0,
      "whys": [
       "Yes: 4 mL x 80 kg x 36% is 11,520 mL for 24 hours; half, 5,760 mL, is given in the first 8 hours from the time of injury.",
       "No: 11,520 mL is the full 24-hour volume, not the first 8-hour portion.",
       "No: 2,880 mL is one quarter of the total, the amount for each 8-hour period on day 1 after the first."
      ]
     },
     ". The SpO₂ of 98% with a carboxyhemoglobin of 18% shows that ",
     {
      "opts": [
       "pulse oximetry overestimates oxygenation in carbon monoxide poisoning",
       "tissue oxygenation is adequate",
       "the carboxyhemoglobin is within the normal range"
      ],
      "ans": 0,
      "whys": [
       "Yes: the oximeter cannot tell carboxyhemoglobin from oxyhemoglobin, so it reads falsely normal while tissues are starved of oxygen.",
       "No: the metabolic acidosis and rising lactate show tissues are not getting enough oxygen despite the normal reading.",
       "No: normal carboxyhemoglobin is under about 3% in nonsmokers; 18% is clinically significant poisoning."
      ]
     },
     "."
    ],
    "why": "The rule of nines gives 36% TBSA, counting only partial-thickness and full-thickness burns. Parkland gives 11,520 mL over 24 hours, with 5,760 mL in the first 8 hours measured from the time of injury. Carbon monoxide makes the SpO₂ falsely normal, so carboxyhemoglobin and lactate guide oxygen therapy. Parkland (4 mL/kg/%TBSA) is still widely taught, but ABLS 2018 starts adult thermal burns at 2 mL/kg/%TBSA; always calculate from the formula in the order, then titrate to urine output.",
    "tip": "Leave superficial burns out of the TBSA, and always time the first 8 hours of Parkland from the injury, not from arrival."
   },
   {
    "id": "cs-burns-3",
    "type": "matrix",
    "step": "hypo",
    "cn": "risk",
    "stem": "Refer to the chart.",
    "q": "For each complication, indicate whether it is an immediate threat in the first hours or a later complication of this injury.",
    "cols": [
     "Immediate threat in the first hours",
     "Later complication"
    ],
    "rows": [
     {
      "t": "Upper airway obstruction from edema",
      "ans": 0,
      "why": "stridor and hoarseness are already present, and airway swelling peaks within the first 24 hours, so the airway can close quickly."
     },
     {
      "t": "Tissue hypoxia from carbon monoxide",
      "ans": 0,
      "why": "a carboxyhemoglobin of 18% with acidosis means oxygen delivery is impaired right now; it needs 100% oxygen immediately."
     },
     {
      "t": "Burn shock from fluid shifting out of the vessels",
      "ans": 0,
      "why": "capillary leak begins within minutes of a 36% burn and is greatest in the first 24 hours, so fluid loss is an early threat."
     },
     {
      "t": "Wound infection and sepsis",
      "ans": 1,
      "why": "infection becomes a major risk after the first several days as the wound is colonized, not in the first hours."
     },
     {
      "t": "Stress ulcer of the stomach or duodenum",
      "ans": 1,
      "why": "a stress ulcer can develop days after a major burn; prevention starts early, but it is not the immediate threat."
     },
     {
      "t": "Joint contractures",
      "ans": 1,
      "why": "contractures develop over weeks as burned skin heals and tightens; positioning and therapy prevent them later."
     }
    ],
    "why": "In the first hours after a major burn, the airway, carbon monoxide and burn shock can kill. Infection, stress ulcers and contractures matter later in the course. Prioritizing by time helps the nurse focus on airway, breathing and circulation now.",
    "tip": "Sort burn complications by phase: airway and circulation threats in the emergent phase, infection and healing problems in the acute and rehabilitation phases."
   },
   {
    "id": "cs-burns-4",
    "type": "matrix",
    "step": "solve",
    "cn": "physio",
    "update": "It is now 03:25. The provider is at the bedside planning initial care.",
    "stem": "Refer to the chart.",
    "q": "For each potential intervention, indicate whether it is indicated or not indicated for this client.",
    "cols": [
     "Indicated",
     "Not indicated"
    ],
    "rows": [
     {
      "t": "100% oxygen by nonrebreather mask",
      "ans": 0,
      "why": "high-flow oxygen shortens the half-life of carboxyhemoglobin and is given until carbon monoxide levels fall, no matter what the SpO₂ shows."
     },
     {
      "t": "Early intubation while the airway can still be secured",
      "ans": 0,
      "why": "stridor and hoarseness mean edema is closing the airway; waiting can make intubation impossible as swelling peaks."
     },
     {
      "t": "Lactated Ringer's by the Parkland formula through two large-bore IVs",
      "ans": 0,
      "why": "a 36% burn needs large-volume isotonic fluid to replace capillary leak and prevent burn shock."
     },
     {
      "t": "Ice packs on the burned arms to relieve pain",
      "ans": 1,
      "why": "ice causes vasoconstriction that deepens the burn, and cooling large areas causes hypothermia. The trap is treating it like a minor burn."
     },
     {
      "t": "Morphine IM for pain",
      "ans": 1,
      "why": "absorption from muscle is unreliable while fluid is shifting and perfusion is poor; opioids are given IV in major burns."
     },
     {
      "t": "Titrate fluid to a urine output of 0.5 mL/kg/h",
      "ans": 0,
      "why": "for an 80 kg adult that is about 40 mL/h, the main bedside sign that resuscitation is adequate without overloading."
     }
    ],
    "why": "Initial burn care follows the ABCs: protect the airway early, give 100% oxygen for carbon monoxide, and start Parkland fluid titrated to urine output. Pain is treated with IV opioids. The burns are kept clean, dry and warm rather than iced.",
    "tip": "For a major burn, remember airway, oxygen, fluids by formula, urine output, IV pain control and warmth, in that order of concern."
   },
   {
    "id": "cs-burns-5",
    "type": "sata",
    "step": "act",
    "cn": "pharm",
    "update": "It is now 03:45. Two large-bore IVs are in place, stridor is now continuous, and lactated Ringer's will start at 04:00.",
    "stem": "Refer to the chart, including the Orders. The time of injury was 02:00.",
    "q": "Which actions should the nurse take? Select all that apply.",
    "opts": [
     {
      "t": "Assist with intubation now",
      "ok": true,
      "why": "Yes: continuous stridor and worsening hoarseness mean the airway is narrowing quickly; securing it now comes before anything else."
     },
     {
      "t": "Start lactated Ringer's at 960 mL/h so the first 5,760 mL is in by 10:00",
      "ok": true,
      "why": "Yes: the first 8 hours end at 10:00, 8 hours after injury; 5,760 mL over the remaining 6 hours is 960 mL/h."
     },
     {
      "t": "Start lactated Ringer's at 720 mL/h, spreading the 5,760 mL over the next 8 hours",
      "ok": false,
      "why": "No: this times the 8 hours from arrival instead of injury and under-resuscitates. The trap is ignoring the 2 hours already lost."
     },
     {
      "t": "Insert an indwelling urinary catheter and measure output hourly, aiming for at least 40 mL/h",
      "ok": true,
      "why": "Yes: hourly urine output is the main guide for titrating fluid; 0.5 mL/kg/h for 80 kg is 40 mL/h."
     },
     {
      "t": "Give morphine 4 mg IV",
      "ok": true,
      "why": "Yes: IV opioids give reliable, quick relief of severe burn pain; pain also drives tachycardia and oxygen demand."
     },
     {
      "t": "Cover the burns with clean, dry sheets and warm blankets",
      "ok": true,
      "why": "Yes: burned skin cannot hold heat, and hypothermia worsens bleeding and shock; dry coverings also reduce pain from air on the wounds."
     },
     {
      "t": "Apply cool, wet saline dressings over the chest and both arms",
      "ok": false,
      "why": "No: wet dressings over 36% of the body cause rapid heat loss and hypothermia in a client already at risk."
     },
     {
      "t": "Give sips of water for his dry, sore throat",
      "ok": false,
      "why": "No: he is about to be intubated and is NPO; anything by mouth raises aspiration risk with a compromised airway."
     }
    ],
    "why": "The nurse secures the airway first, then starts Parkland fluid at a rate that makes up for time lost since injury. Urine output, IV pain control and warmth complete the early bundle. Cooling large burns and oral fluids are unsafe here.",
    "tip": "When a Parkland question gives both the injury time and the arrival time, subtract the hours already passed before calculating the hourly rate."
   },
   {
    "id": "cs-burns-6",
    "type": "highlight",
    "step": "eval",
    "cn": "physio",
    "update": "It is now 08:00, 6 hours after the injury. Lactated Ringer's has run at 960 mL/h since 04:00.",
    "stem": "Refer to the chart, including the Intake and Output. The client weighs 80 kg.",
    "q": "Highlight the findings in the 08:00 note that show the fluid resuscitation is not adequate.",
    "parts": [
     {
      "t": "Intubated at 03:50; sedated, opens eyes to voice.",
      "ok": false,
      "why": "No: this is the expected level of sedation for a ventilated client and does not measure fluid status."
     },
     {
      "t": "Heart rate 128, up from 112 at 05:00.",
      "ok": true,
      "why": "Yes: a rising heart rate despite pain control suggests the intravascular volume is still low."
     },
     {
      "t": "BP 92/54.",
      "ok": true,
      "why": "Yes: the BP has fallen from 132/84 on arrival, which points to ongoing burn shock from capillary leak."
     },
     {
      "t": "Urine output 22 mL/h and 18 mL/h over the last 2 hours.",
      "ok": true,
      "why": "Yes: the goal is at least 40 mL/h (0.5 mL/kg/h); two hours below target means the rate should be increased per protocol."
     },
     {
      "t": "Lactate 3.9 mmol/L, up from 2.8.",
      "ok": true,
      "why": "Yes: a rising lactate after carbon monoxide has cleared means tissues are still poorly perfused."
     },
     {
      "t": "Breath sounds clear; SpO₂ 99% on FiO₂ 0.40.",
      "ok": false,
      "why": "No: clear lungs and good oxygenation show no sign of fluid overload, which supports giving more fluid."
     },
     {
      "t": "Temperature 36.9 °C (98.4 °F) with warm blankets and the room warmed.",
      "ok": false,
      "why": "No: a normal temperature shows the warming measures are working; it does not indicate a fluid problem."
     },
     {
      "t": "Carboxyhemoglobin 4%.",
      "ok": false,
      "why": "No: carbon monoxide has largely cleared with 100% oxygen, so the rising lactate is from poor perfusion, not carbon monoxide."
     }
    ],
    "why": "The Parkland formula is only a starting point; urine output decides the rate. Here output is below 0.5 mL/kg/h, heart rate is rising, BP is falling and lactate is climbing, so the client is under-resuscitated. Inhalation injury often raises fluid needs above the formula. Whether the order uses Parkland or the ABLS starting dose of 2 mL/kg/%TBSA, the adult target is 0.5 mL/kg/h. The nurse reports this and increases lactated Ringer's per protocol.",
    "tip": "Judge burn resuscitation by hourly urine output first, then confirm with heart rate, BP and lactate, not by whether the formula volume was given."
   }
  ]
 },
 {
  "id": "cs-alcohol-withdrawal",
  "title": "Ankle fracture that turns into alcohol withdrawal",
  "sp": "ms",
  "topic": "Alcohol withdrawal",
  "client": "49-year-old man on a med-surg unit, admitted with a fractured right ankle awaiting surgery",
  "record": [
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "Tuesday 21:00",
    "text": "Fell down the front steps of his home at about 18:00. Closed fracture of the right ankle; splinted, non-weight-bearing, surgery planned once swelling decreases. History: hypertension, not taking medication. On admission he stated he drinks \"a couple of beers on weekends.\" Last drink reported as Tuesday about 16:00. Weight 82 kg (181 lb)."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "Tuesday 21:00",
    "rows": [
     [
      "Temperature",
      "36.9 °C (98.4 °F)"
     ],
     [
      "Heart rate",
      "84"
     ],
     [
      "Blood pressure",
      "134/82"
     ],
     [
      "Respiratory rate",
      "16"
     ],
     [
      "SpO₂",
      "97% on room air"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "Thursday 08:00",
    "text": "Awake since 04:00, says he cannot sleep. Coarse tremor of both hands when arms are extended. Skin moist and forehead beaded with sweat. Right ankle pain 5/10, splint intact, toes warm with brisk capillary refill. Reports nausea and has asked for an emesis basin twice. Anxious and keeps asking if he can leave. Wife, visiting, states he drinks a 12-pack of beer and a pint of vodka every day and had a seizure when he stopped drinking 2 years ago. Voided 400 mL clear yellow urine."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "Thursday 08:00",
    "rows": [
     [
      "Temperature",
      "37.9 °C (100.2 °F)"
     ],
     [
      "Heart rate",
      "116"
     ],
     [
      "Blood pressure",
      "162/98"
     ],
     [
      "Respiratory rate",
      "22"
     ],
     [
      "SpO₂",
      "96% on room air"
     ]
    ]
   },
   {
    "tab": "Laboratory Results",
    "at": 1,
    "time": "Thursday 09:10",
    "rows": [
     [
      "Magnesium",
      "1.3 mg/dL",
      "low"
     ],
     [
      "Potassium",
      "3.1 mEq/L",
      "low"
     ],
     [
      "Sodium",
      "136 mEq/L"
     ],
     [
      "Glucose",
      "74 mg/dL"
     ],
     [
      "AST",
      "112 units/L",
      "high"
     ],
     [
      "ALT",
      "48 units/L",
      "high"
     ],
     [
      "MCV",
      "104 fL",
      "high"
     ],
     [
      "Platelets",
      "112,000/mm³",
      "low"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 1,
    "time": "Thursday 09:15",
    "text": "CIWA-Ar score 14. Tremor and sweating unchanged. Oriented to person, place, time and situation."
   },
   {
    "tab": "Nurses' Notes",
    "at": 2,
    "time": "Thursday 10:30",
    "text": "Picking at the blanket. States, \"There are spiders crawling on the wall.\" Knows he is in the hospital and states the correct date. Pulled at the splint strap twice; reoriented. CIWA-Ar score 17. Provider notified."
   },
   {
    "tab": "Orders",
    "at": 3,
    "time": "Thursday 10:45",
    "text": "CIWA-Ar every 1 hour until below 10 on 2 checks in a row, then every 4 hours. Lorazepam IV per CIWA-Ar: score 10 to 15, 1 mg; score 16 to 20, 2 mg; above 20, 2 mg and notify provider. Hold lorazepam for RR below 12 or if client does not rouse to voice. Thiamine 100 mg IV now, then daily. After thiamine is given, start D5 0.45% NaCl with 20 mEq KCl/L at 100 mL/h. Magnesium sulfate 2 g IV over 2 hours. Folic acid 1 mg PO daily. Multivitamin PO daily. Seizure precautions. Fall precautions with bed alarm."
   },
   {
    "tab": "Medication Administration Record",
    "at": 4,
    "time": "Thursday 10:55",
    "text": "Thiamine 100 mg IV given at 10:55. Magnesium sulfate and D5 0.45% NaCl with KCl not yet started."
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "Thursday 11:00",
    "text": "CIWA-Ar score 19; no lorazepam given yet. Sees spiders on the ceiling, still oriented. Diaphoretic, tremor visible at rest. BP 168/100, HR 124, RR 20, SpO₂ 96% on room air. Asks to walk to the bathroom."
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "Friday 08:00",
    "text": "CIWA-Ar checked per protocol overnight, including 15 at 00:00, 11 at 03:00, 8 at 06:00 and 6 at 07:00. Lorazepam given 1 mg at 00:00 and 1 mg at 03:00; none since. No hallucinations since 03:00. Oriented to person, place, time and situation. Slight hand tremor only. Sleeping between checks and rouses easily to voice. States, \"Once this cast is on I will just cut back to a few beers a night.\""
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "Friday 08:00",
    "rows": [
     [
      "Temperature",
      "37.1 °C (98.8 °F)"
     ],
     [
      "Heart rate",
      "88"
     ],
     [
      "Blood pressure",
      "138/84"
     ],
     [
      "Respiratory rate",
      "16"
     ],
     [
      "SpO₂",
      "97% on room air"
     ]
    ]
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "Friday 06:00",
    "rows": [
     [
      "Magnesium",
      "1.9 mg/dL"
     ],
     [
      "Potassium",
      "4.0 mEq/L"
     ],
     [
      "Glucose",
      "96 mg/dL"
     ]
    ]
   }
  ],
  "items": [
   {
    "id": "cs-alcohol-withdrawal-1",
    "type": "highlight",
    "step": "cues",
    "cn": "physio",
    "stem": "Refer to the chart. It is Thursday 08:00, about 40 hours after the client's reported last drink.",
    "q": "Highlight the findings in the nurse's note that require follow-up.",
    "parts": [
     {
      "t": "Coarse tremor of both hands when arms are extended.",
      "ok": true,
      "why": "Yes: tremor is one of the earliest signs of alcohol withdrawal, caused by rebound nervous system excitation once alcohol is removed."
     },
     {
      "t": "Skin moist and forehead beaded with sweat.",
      "ok": true,
      "why": "Yes: diaphoresis reflects autonomic hyperactivity in withdrawal and is scored on the CIWA-Ar."
     },
     {
      "t": "Right ankle pain 5/10, splint intact, toes warm with brisk capillary refill.",
      "ok": false,
      "why": "No: moderate pain with good circulation distal to the splint is expected after a fracture and shows no compartment or perfusion problem."
     },
     {
      "t": "Reports nausea and has asked for an emesis basin twice.",
      "ok": true,
      "why": "Yes: nausea and vomiting are part of the withdrawal picture and also raise the risk of fluid and electrolyte loss."
     },
     {
      "t": "Anxious and keeps asking if he can leave.",
      "ok": true,
      "why": "Yes: anxiety and restlessness are scored withdrawal signs, and a wish to leave raises safety and fall concerns for a client who cannot bear weight."
     },
     {
      "t": "Wife states he drinks a 12-pack of beer and a pint of vodka every day and had a seizure when he stopped drinking 2 years ago.",
      "ok": true,
      "why": "Yes: heavy daily use and a prior withdrawal seizure are the strongest predictors of severe withdrawal, seizures and delirium tremens."
     },
     {
      "t": "Voided 400 mL clear yellow urine.",
      "ok": false,
      "why": "No: adequate clear urine output shows he is not yet significantly dehydrated; this finding is reassuring."
     }
    ],
    "why": "Tremor, sweating, nausea and anxiety starting 1 to 2 days after the last drink point to alcohol withdrawal. The wife's report reveals the real intake and a prior withdrawal seizure, which predicts a severe course. The ankle findings are expected for a splinted fracture.",
    "tip": "When new symptoms appear a day or two into a hospital stay, ask what substance the client may have stopped when admitted."
   },
   {
    "id": "cs-alcohol-withdrawal-2",
    "type": "matrix",
    "step": "analyze",
    "cn": "physio",
    "stem": "Refer to the chart. Morning labs have returned and the CIWA-Ar score is 14.",
    "q": "For each finding, indicate whether it is most consistent with acute alcohol withdrawal, chronic heavy alcohol use, or the ankle fracture.",
    "cols": [
     "Acute alcohol withdrawal",
     "Chronic heavy alcohol use",
     "Ankle fracture"
    ],
    "rows": [
     {
      "t": "Coarse tremor and sweating 40 hours after the last drink",
      "ans": 0,
      "why": "these start 6 to 24 hours after the last drink as the brain, adapted to alcohol, becomes overexcited."
     },
     {
      "t": "HR 116 and BP 162/98, up from 84 and 134/82 on admission",
      "ans": 0,
      "why": "the rise came with tremor and sweating while pain stayed moderate, pointing to withdrawal autonomic hyperactivity rather than the fracture."
     },
     {
      "t": "MCV 104 fL and platelets 112,000/mm³",
      "ans": 1,
      "why": "large red cells and low platelets come from alcohol's toxic effect on the marrow and poor folate intake over months."
     },
     {
      "t": "AST 112 units/L with ALT 48 units/L",
      "ans": 1,
      "why": "an AST more than twice the ALT is the classic pattern of alcohol-related liver injury."
     },
     {
      "t": "Magnesium 1.3 mg/dL",
      "ans": 1,
      "why": "alcohol causes poor intake and kidney wasting of magnesium; low magnesium also lowers the seizure threshold during withdrawal."
     },
     {
      "t": "Right ankle pain 5/10 with swelling under the splint",
      "ans": 2,
      "why": "pain and swelling are expected local effects of the fracture and do not explain the systemic signs."
     }
    ],
    "why": "Separating acute withdrawal from the marks of long-term drinking clarifies the problem. Tremor, sweating and rising vital signs are acute withdrawal. Macrocytosis, low platelets, the AST to ALT pattern and low magnesium show months of heavy use. The fracture explains only the local ankle findings.",
    "tip": "Ask whether a finding developed over hours or over months; acute signs belong to withdrawal, slow changes belong to chronic use."
   },
   {
    "id": "cs-alcohol-withdrawal-3",
    "type": "cloze",
    "step": "hypo",
    "cn": "safety",
    "update": "It is now 10:30. The client sees spiders on the wall but knows where he is and the date. The CIWA-Ar score is 17.",
    "stem": "Refer to the chart.",
    "q": "Complete the sentences.",
    "parts": [
     "Hallucinations with intact orientation are most consistent with ",
     {
      "opts": [
       "alcohol withdrawal with hallucinations",
       "delirium tremens",
       "a new dementia"
      ],
      "ans": 0,
      "whys": [
       "Yes: withdrawal hallucinations usually appear within 12 to 48 hours of the last drink while the client stays oriented.",
       "No: delirium tremens adds disorientation and a fluctuating level of consciousness; this client still knows where he is and the date.",
       "No: dementia develops over months and does not appear suddenly with tremor, sweating and tachycardia."
      ]
     },
     ". With a prior withdrawal seizure and low magnesium, the nurse's priority concern is ",
     {
      "opts": [
       "seizures and progression to delirium tremens",
       "compartment syndrome of the right ankle",
       "dehydration from sweating"
      ],
      "ans": 0,
      "whys": [
       "Yes: seizures and delirium tremens are the life-threatening complications of withdrawal, and his history and labs put him at high risk.",
       "No: the toes are warm with brisk refill and pain is stable, so there are no cues for compartment syndrome.",
       "No: fluid loss matters, but urine output is adequate and dehydration is not the immediate threat to life."
      ]
     },
     ". Delirium tremens typically begins ",
     {
      "opts": [
       "48 to 96 hours",
       "6 to 12 hours",
       "7 to 10 days"
      ],
      "ans": 0,
      "whys": [
       "Yes: delirium tremens usually starts 2 to 4 days after the last drink, so this client is entering the high-risk window now.",
       "No: 6 to 12 hours is when early tremor and anxiety begin, not delirium tremens.",
       "No: by 7 to 10 days most acute withdrawal has resolved; this is too late for typical delirium tremens."
      ]
     },
     " after the last drink."
    ],
    "why": "This client has worsening withdrawal with hallucinations but an intact sensorium, so this is not yet delirium tremens. He is entering the 48 to 96 hour window, and his prior seizure and low magnesium make seizures and delirium tremens the priority threats.",
    "tip": "Orientation is the dividing line: hallucinations with intact orientation are withdrawal hallucinosis, while confusion and fluctuating awareness signal delirium tremens."
   },
   {
    "id": "cs-alcohol-withdrawal-4",
    "type": "sata",
    "step": "solve",
    "cn": "safety",
    "stem": "Refer to the chart. The provider has written new orders.",
    "q": "Which interventions should the nurse include in the plan of care? Select all that apply.",
    "opts": [
     {
      "t": "Keep the bed in the lowest position with the bed alarm on",
      "ok": true,
      "why": "Yes: he is non-weight-bearing, hallucinating and wants to leave, so a low bed and alarm reduce the risk of a fall."
     },
     {
      "t": "Keep oxygen and suction set up at the bedside",
      "ok": true,
      "why": "Yes: seizure precautions include equipment to clear and protect the airway if a withdrawal seizure occurs."
     },
     {
      "t": "Give thiamine before starting the dextrose-containing IV fluid",
      "ok": true,
      "why": "Yes: glucose given to a thiamine-deficient client can trigger or worsen Wernicke encephalopathy, so thiamine goes first."
     },
     {
      "t": "Reassess the CIWA-Ar every hour and give lorazepam based on the score",
      "ok": true,
      "why": "Yes: symptom-triggered dosing matches the benzodiazepine to the severity of withdrawal and limits oversedation."
     },
     {
      "t": "Keep the room quiet and well lit and reorient him often",
      "ok": true,
      "why": "Yes: low stimulation calms the overexcited nervous system, and good lighting reduces misreading of shadows into hallucinations."
     },
     {
      "t": "Apply wrist restraints to keep him from pulling at the splint",
      "ok": false,
      "why": "No: restraints increase agitation and injury risk; they are a last resort after less restrictive measures and adequate sedation."
     },
     {
      "t": "Hold lorazepam until the hallucinations stop",
      "ok": false,
      "why": "No: benzodiazepines are the treatment for withdrawal; withholding them allows progression to seizures and delirium tremens."
     },
     {
      "t": "Turn off the lights and close the door so he can rest",
      "ok": false,
      "why": "No: a dark room deepens misperceptions and prevents close observation of a high-risk client."
     }
    ],
    "why": "Care in alcohol withdrawal rests on symptom-triggered benzodiazepines, nutrient and electrolyte replacement and safety. Thiamine comes before dextrose to prevent Wernicke encephalopathy. Seizure and fall precautions protect a client who is agitated and cannot bear weight.",
    "tip": "For withdrawal, group the plan into three buckets: treat the withdrawal, replace what alcohol depleted, and keep the client safe."
   },
   {
    "id": "cs-alcohol-withdrawal-5",
    "type": "matrix",
    "step": "act",
    "cn": "pharm",
    "update": "It is now 11:00. Thiamine was given at 10:55. No lorazepam has been given yet, and the CIWA-Ar score is now 19.",
    "stem": "Refer to the chart.",
    "q": "For each action, indicate whether it is indicated or not indicated at this time.",
    "cols": [
     "Indicated",
     "Not indicated"
    ],
    "rows": [
     {
      "t": "Give lorazepam 2 mg IV per the CIWA-Ar protocol",
      "ans": 0,
      "why": "a score of 19 falls in the 16 to 20 range, which calls for 2 mg; he rouses easily and RR is 20."
     },
     {
      "t": "Start D5 0.45% NaCl with 20 mEq KCl/L at 100 mL/h",
      "ans": 0,
      "why": "thiamine was given at 10:55, so dextrose can now run safely, and the added potassium treats his level of 3.1 mEq/L."
     },
     {
      "t": "Start magnesium sulfate 2 g IV over 2 hours",
      "ans": 0,
      "why": "replacing magnesium raises the seizure threshold and helps potassium correct, since low magnesium keeps potassium low."
     },
     {
      "t": "Recheck the CIWA-Ar and vital signs in 1 hour",
      "ans": 0,
      "why": "the protocol calls for hourly scoring while the score is 10 or higher to judge the response to each dose."
     },
     {
      "t": "Give haloperidol for the hallucinations",
      "ans": 1,
      "why": "it is not ordered and antipsychotics lower the seizure threshold; benzodiazepines are the treatment for withdrawal hallucinations."
     },
     {
      "t": "Help him walk to the bathroom with a gait belt",
      "ans": 1,
      "why": "he is non-weight-bearing on a fractured ankle and is tremulous and hallucinating; offer a urinal at the bedside instead."
     }
    ],
    "why": "Withdrawal is worsening, so the next lorazepam dose follows the protocol range. Thiamine is in, so the dextrose fluid with potassium can start along with magnesium. Hourly scoring guides the next dose. CIWA-Ar dose ranges vary by facility protocol, so follow the one ordered. Antipsychotics and walking on the fracture both add risk.",
    "tip": "Before giving a protocol drug, match the current score to the dose range and check the hold parameters."
   },
   {
    "id": "cs-alcohol-withdrawal-6",
    "type": "matrix",
    "step": "eval",
    "cn": "physio",
    "update": "It is now Friday 08:00, about 64 hours after the last drink.",
    "stem": "Refer to the chart.",
    "q": "For each finding, indicate whether it shows the plan is effective or needs follow-up.",
    "cols": [
     "Effective",
     "Needs follow-up"
    ],
    "rows": [
     {
      "t": "CIWA-Ar scores fell from 15 at midnight to 6 at 07:00",
      "ans": 0,
      "why": "a steady fall to below 10 shows the symptom-triggered lorazepam is controlling the withdrawal."
     },
     {
      "t": "HR 88 and BP 138/84",
      "ans": 0,
      "why": "the autonomic hyperactivity has settled from HR 124 and BP 168/100 the day before."
     },
     {
      "t": "Oriented, with no hallucinations since 03:00",
      "ans": 0,
      "why": "clearing hallucinations with intact orientation show he has not progressed to delirium tremens."
     },
     {
      "t": "Sleeping between checks and rouses easily to voice, RR 16",
      "ans": 0,
      "why": "he is resting without being oversedated; the lorazepam hold criteria are not met."
     },
     {
      "t": "Magnesium 1.9 mg/dL and potassium 4.0 mEq/L",
      "ans": 0,
      "why": "both are now in the normal range after replacement, lowering seizure and dysrhythmia risk."
     },
     {
      "t": "States he will \"just cut back to a few beers a night\" after surgery",
      "ans": 1,
      "why": "this shows he does not see the need for abstinence after a withdrawal seizure history; plan teaching and a referral for alcohol use treatment."
     }
    ],
    "why": "Falling CIWA-Ar scores, normal vital signs, clearing hallucinations and normal electrolytes show the treatment is working. He is still inside the 48 to 96 hour window, so scoring continues. His plan to keep drinking needs a brief intervention and referral before discharge.",
    "tip": "Evaluate against the same measures that triggered treatment, then look for what the plan has not yet addressed."
   }
  ]
 },
 {
  "id": "cs-aki-hyperkalemia",
  "title": "Stomach bug that ends in hyperkalemia",
  "sp": "sd",
  "topic": "AKI and hyperkalemia",
  "client": "70-year-old woman admitted to the step-down unit from the ED with dehydration and acute kidney injury",
  "record": [
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "08:30",
    "text": "Four days of vomiting and watery diarrhea after a family gathering where others were ill. Eating and drinking very little. Kept taking all home medications: lisinopril 20 mg daily, spironolactone 25 mg daily for hypertension, and ibuprofen 400 mg three times daily for knee osteoarthritis, started 2 weeks ago. Baseline creatinine 0.9 mg/dL 6 months ago. Received 1 L 0.9% NaCl in the ED. Weight 68 kg (150 lb)."
   },
   {
    "tab": "Laboratory Results",
    "at": 0,
    "time": "07:45",
    "rows": [
     [
      "Potassium",
      "6.5 mEq/L",
      "high"
     ],
     [
      "Sodium",
      "132 mEq/L",
      "low"
     ],
     [
      "Bicarbonate",
      "17 mEq/L",
      "low"
     ],
     [
      "BUN",
      "62 mg/dL",
      "high"
     ],
     [
      "Creatinine",
      "2.6 mg/dL",
      "high"
     ],
     [
      "Glucose",
      "104 mg/dL"
     ]
    ]
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "09:00",
    "rows": [
     [
      "Temperature",
      "37.3 °C (99.1 °F)"
     ],
     [
      "Heart rate",
      "96"
     ],
     [
      "Blood pressure",
      "94/52 lying; 80/48 standing"
     ],
     [
      "Respiratory rate",
      "18"
     ],
     [
      "SpO₂",
      "97% on room air"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "09:00",
    "text": "Arrived from ED. Telemetry applied: sinus rhythm 96 with tall, peaked T waves. Mucous membranes dry. Dizzy on standing. States, \"My legs feel heavy and weak.\" Voided 60 mL dark amber urine; 60 mL total since 05:00. Knee pain 3/10."
   },
   {
    "tab": "Laboratory Results",
    "at": 1,
    "time": "09:40",
    "rows": [
     [
      "Urine specific gravity",
      "1.030",
      "high"
     ],
     [
      "Urine sodium",
      "12 mEq/L",
      "low"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 2,
    "time": "10:00",
    "text": "Telemetry: sinus rhythm 92, T waves remain tall and peaked, PR 0.22 seconds, QRS 0.10 seconds. Client resting in bed, call light in reach."
   },
   {
    "tab": "Medication Administration Record",
    "at": 3,
    "time": "10:15",
    "text": "Admission orders continued from home medication list: lisinopril 20 mg PO daily at 10:00; spironolactone 25 mg PO daily at 10:00; ibuprofen 400 mg PO every 8 hours as needed for knee pain. New: acetaminophen 650 mg PO every 6 hours as needed for pain; ondansetron 4 mg IV every 6 hours as needed for nausea; 0.9% NaCl IV at 125 mL/h."
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "10:30",
    "text": "Continuous cardiac monitoring. Calcium gluconate 10%, 1 g (10 mL) IV over 10 minutes now. Dextrose 50%, 25 g (50 mL) IV with regular insulin 10 units IV now. Sodium zirconium cyclosilicate 10 g PO now. Discontinue lisinopril, spironolactone and ibuprofen. Strict intake and output. Capillary glucose every hour for 4 hours after insulin. Repeat potassium and 12-lead ECG 2 hours after insulin."
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "14:00",
    "text": "Potassium 5.3 mEq/L. T waves now normal height on telemetry. Urine output 150 mL over the last 3 hours. BP 116/68 lying, no dizziness when standing. Capillary glucose 62 mg/dL. Fine crackles in both lung bases. Asked her daughter to bring her ibuprofen from home."
   },
   {
    "tab": "Intake and Output",
    "at": 5,
    "time": "14:00",
    "rows": [
     [
      "IV intake since 10:00",
      "500 mL"
     ],
     [
      "Oral intake since 10:00",
      "240 mL"
     ],
     [
      "Urine output 11:00 to 14:00",
      "150 mL"
     ]
    ]
   }
  ],
  "items": [
   {
    "id": "cs-aki-hyperkalemia-1",
    "type": "sata",
    "step": "cues",
    "cn": "physio",
    "stem": "Refer to the chart. The client has just arrived on the step-down unit.",
    "q": "Which findings require immediate follow-up? Select all that apply.",
    "opts": [
     {
      "t": "Potassium 6.5 mEq/L",
      "ok": true,
      "why": "Yes: potassium above 6 mEq/L can cause lethal dysrhythmias and is a medical emergency, especially with ECG changes."
     },
     {
      "t": "Tall, peaked T waves on telemetry",
      "ok": true,
      "why": "Yes: peaked T waves show high potassium is already affecting cardiac conduction; this is the earliest ECG sign."
     },
     {
      "t": "Creatinine 2.6 mg/dL, baseline 0.9 mg/dL",
      "ok": true,
      "why": "Yes: nearly tripling the baseline creatinine meets criteria for acute kidney injury, which explains why potassium is building up."
     },
     {
      "t": "Urine output 60 mL since 05:00",
      "ok": true,
      "why": "Yes: about 15 mL/h is well below 0.5 mL/kg/h (34 mL/h for 68 kg), so she is oliguric."
     },
     {
      "t": "\"My legs feel heavy and weak.\"",
      "ok": true,
      "why": "Yes: high potassium impairs muscle cell firing, causing weakness that starts in the legs and can progress."
     },
     {
      "t": "Temperature 37.3 °C (99.1 °F)",
      "ok": false,
      "why": "No: this is within normal limits and does not suggest infection or a new problem."
     },
     {
      "t": "Glucose 104 mg/dL",
      "ok": false,
      "why": "No: this is a normal value; it becomes important only as a baseline before insulin is given."
     },
     {
      "t": "Knee pain 3/10",
      "ok": false,
      "why": "No: mild chronic knee pain is her baseline osteoarthritis and is not an urgent finding."
     }
    ],
    "why": "The urgent cues cluster around two linked problems: kidneys that have suddenly stopped clearing waste, and potassium high enough to affect the heart and muscles. Peaked T waves with a potassium of 6.5 make this an emergency. Normal temperature, glucose and mild knee pain are not priorities.",
    "tip": "Look for cues that connect: a lab abnormality plus an organ showing its effect, like high potassium plus ECG changes, deserves the fastest response."
   },
   {
    "id": "cs-aki-hyperkalemia-2",
    "type": "cloze",
    "step": "analyze",
    "cn": "physio",
    "stem": "Refer to the chart. Urine studies have returned.",
    "q": "Complete the sentences.",
    "parts": [
     "A BUN to creatinine ratio above 20:1, urine specific gravity of 1.030 and a low urine sodium point to ",
     {
      "opts": [
       "prerenal",
       "intrarenal",
       "postrenal"
      ],
      "ans": 0,
      "whys": [
       "Yes: the kidneys are holding on to sodium and water because blood flow to them is low, which concentrates the urine and raises BUN out of proportion.",
       "No: damage to the tubules, as in acute tubular necrosis, impairs sodium reabsorption, so urine sodium would be high and urine dilute.",
       "No: postrenal injury comes from obstruction of urine flow, such as an enlarged prostate or stones, with no cues here."
      ]
     },
     " acute kidney injury. Ibuprofen contributes by ",
     {
      "opts": [
       "blocking prostaglandins that dilate the afferent arteriole",
       "directly obstructing the ureters",
       "dilating the efferent arteriole"
      ],
      "ans": 0,
      "whys": [
       "Yes: when volume is low, prostaglandins keep the vessel into the glomerulus open; NSAIDs remove that protection and blood flow into the glomerulus falls.",
       "No: NSAIDs do not obstruct the ureters; this would be a postrenal cause.",
       "No: dilating the efferent arteriole is how ACE inhibitors act, not NSAIDs."
      ]
     },
     ", and lisinopril contributes by ",
     {
      "opts": [
       "dilating the efferent arteriole, which lowers filtration pressure",
       "raising blood volume",
       "causing direct tubular toxicity"
      ],
      "ans": 0,
      "whys": [
       "Yes: angiotensin II normally tightens the vessel leaving the glomerulus to keep pressure up; blocking it drops filtration when the client is dry.",
       "No: ACE inhibitors lower blood pressure and do not raise blood volume.",
       "No: ACE inhibitors change blood flow in the glomerulus; they are not tubular toxins like aminoglycosides."
      ]
     },
     "."
    ],
    "why": "Vomiting and diarrhea reduced blood volume. The diuretic removed more fluid, the NSAID narrowed the vessel into the glomerulus, and the ACE inhibitor widened the vessel out of it. This combination, called the triple whammy, collapses filtration pressure. ACE inhibitors and spironolactone also hold potassium in.",
    "tip": "For kidney injury, sort the cause by location first: before the kidney, in the kidney, or after it, then ask which drugs affect each spot."
   },
   {
    "id": "cs-aki-hyperkalemia-3",
    "type": "matrix",
    "step": "hypo",
    "cn": "physio",
    "stem": "Refer to the chart. It is 10:00.",
    "q": "For each client problem, indicate whether it is the top priority now, a concern to address after the priority, or not supported by the data.",
    "cols": [
     "Top priority now",
     "Address after the priority",
     "Not supported by the data"
    ],
    "rows": [
     {
      "t": "Risk for a lethal dysrhythmia from hyperkalemia",
      "ans": 0,
      "why": "potassium of 6.5 with peaked T waves and a lengthening PR interval can progress to ventricular fibrillation or asystole within minutes."
     },
     {
      "t": "Fluid volume deficit from vomiting and diarrhea",
      "ans": 1,
      "why": "it caused the kidney injury and needs IV fluid replacement, but it threatens life less quickly than the heart rhythm."
     },
     {
      "t": "Risk for falls from orthostatic hypotension and leg weakness",
      "ans": 1,
      "why": "she is dizzy on standing with weak legs, so fall precautions are needed, but this follows the cardiac threat."
     },
     {
      "t": "Fluid volume overload",
      "ans": 2,
      "why": "she is dry, with dry membranes and orthostatic hypotension; there are no crackles or edema at this point."
     },
     {
      "t": "Hypoglycemia",
      "ans": 2,
      "why": "glucose is 104 mg/dL; this becomes a risk only after insulin is given."
     },
     {
      "t": "Metabolic alkalosis",
      "ans": 2,
      "why": "bicarbonate is 17 mEq/L, which shows metabolic acidosis from kidney injury, not alkalosis."
     }
    ],
    "why": "Several problems are real, but only one can stop the heart within minutes. Hyperkalemia with ECG changes comes first. Volume depletion and fall risk are important and are addressed next. Overload, hypoglycemia and alkalosis are not supported by the current data.",
    "tip": "When ranking problems, choose the one that threatens life soonest; a lab plus ECG change beats a slower process."
   },
   {
    "id": "cs-aki-hyperkalemia-4",
    "type": "matrix",
    "step": "solve",
    "cn": "pharm",
    "stem": "Refer to the chart. It is 10:15, and the 10:00 medications are due.",
    "q": "For each medication order on the MAR, indicate whether the nurse should give it as ordered or hold it and clarify with the provider.",
    "cols": [
     "Give as ordered",
     "Hold and clarify"
    ],
    "rows": [
     {
      "t": "Lisinopril 20 mg PO daily",
      "ans": 1,
      "why": "ACE inhibitors raise potassium and reduce filtration pressure, and her BP is already 94/52; giving it worsens all three problems."
     },
     {
      "t": "Spironolactone 25 mg PO daily",
      "ans": 1,
      "why": "this potassium-sparing diuretic blocks potassium excretion and removes more fluid from a dry client."
     },
     {
      "t": "Ibuprofen 400 mg PO every 8 hours as needed",
      "ans": 1,
      "why": "NSAIDs reduce kidney blood flow and are nephrotoxic in AKI; this was one cause of her injury."
     },
     {
      "t": "Acetaminophen 650 mg PO every 6 hours as needed",
      "ans": 0,
      "why": "acetaminophen is the safer analgesic for her knee because it does not affect kidney blood flow or potassium."
     },
     {
      "t": "0.9% NaCl IV at 125 mL/h",
      "ans": 0,
      "why": "restoring volume improves kidney perfusion, the main fix for prerenal injury; the nurse watches lung sounds as fluid goes in."
     },
     {
      "t": "Ondansetron 4 mg IV every 6 hours as needed",
      "ans": 0,
      "why": "controlling nausea helps her take oral fluids and has no effect on kidney function or potassium."
     }
    ],
    "why": "Home medications are often continued automatically at admission. Three of them caused this injury: the ACE inhibitor, the potassium-sparing diuretic and the NSAID. The nurse holds them and calls the provider. Fluids, acetaminophen and an antiemetic support recovery.",
    "tip": "Before giving any medication in kidney injury, ask whether it lowers kidney blood flow, is cleared by the kidney, or raises potassium."
   },
   {
    "id": "cs-aki-hyperkalemia-5",
    "type": "order",
    "step": "act",
    "cn": "pharm",
    "update": "It is now 10:30. The provider has written new orders for hyperkalemia.",
    "stem": "Refer to the chart.",
    "q": "Place the nurse's actions in the order they should be performed.",
    "opts": [
     "Confirm continuous cardiac monitoring is running with the emergency cart nearby",
     "Give calcium gluconate 1 g IV over 10 minutes",
     "Give dextrose 50% 25 g IV with regular insulin 10 units IV",
     "Give sodium zirconium cyclosilicate 10 g orally",
     "Check capillary glucose 1 hour after the insulin"
    ],
    "whys": [
     "Yes: the heart must be watched continuously before and during treatment, since dysrhythmias can occur at any moment and calcium itself is given with monitoring.",
     "Yes: calcium works within minutes to stabilize the heart muscle membrane; it does not lower potassium but buys time and comes first when the ECG is changing.",
     "Yes: insulin drives potassium into cells within 15 to 30 minutes, and dextrose prevents hypoglycemia; this lowers the blood level quickly but temporarily.",
     "Yes: the binder removes potassium from the body through the gut, but it takes hours to work, so it follows the faster measures.",
     "Yes: insulin can cause hypoglycemia for several hours, especially when kidney injury slows insulin clearance, so glucose is checked after the treatment is given."
    ],
    "why": "Hyperkalemia treatment follows protect, shift, remove. Calcium protects the heart first. Insulin with dextrose shifts potassium into cells. A binder removes it from the body. Glucose checks catch the most common harm from treatment.",
    "tip": "Remember the sequence protect, shift, remove, then monitor for the side effect of the shifting drug."
   },
   {
    "id": "cs-aki-hyperkalemia-6",
    "type": "highlight",
    "step": "eval",
    "cn": "physio",
    "update": "It is now 14:00. The nurse documents the following note.",
    "stem": "Refer to the chart.",
    "q": "Highlight the findings that show the client's condition is improving.",
    "parts": [
     {
      "t": "Potassium 5.3 mEq/L.",
      "ok": true,
      "why": "Yes: potassium has fallen from 6.5 toward normal; because insulin only shifts it, the nurse still expects repeat levels."
     },
     {
      "t": "T waves now normal height on telemetry.",
      "ok": true,
      "why": "Yes: resolution of peaked T waves shows the cardiac effect of hyperkalemia has eased."
     },
     {
      "t": "Urine output 150 mL over the last 3 hours.",
      "ok": true,
      "why": "Yes: 50 mL/h is above 0.5 mL/kg/h for 68 kg, showing kidney perfusion is improving with fluids."
     },
     {
      "t": "BP 116/68 lying, no dizziness when standing.",
      "ok": true,
      "why": "Yes: blood pressure is up from 94/52 and orthostatic symptoms are gone, showing volume is being restored."
     },
     {
      "t": "Capillary glucose 62 mg/dL.",
      "ok": false,
      "why": "No: this is hypoglycemia from the insulin and needs treatment per protocol and a recheck; it is a complication, not improvement."
     },
     {
      "t": "Fine crackles in both lung bases.",
      "ok": false,
      "why": "No: new crackles in an older adult receiving IV fluid suggest early fluid overload; report and reassess the fluid rate."
     },
     {
      "t": "Asked her daughter to bring her ibuprofen from home.",
      "ok": false,
      "why": "No: NSAIDs helped cause this kidney injury; she needs teaching to avoid them and use acetaminophen instead."
     }
    ],
    "why": "Lower potassium, normal T waves, better urine output and a higher blood pressure show treatment is working. Hypoglycemia after insulin, new crackles during fluid replacement and her plan to keep taking ibuprofen each need action. Potassium can rebound as insulin wears off, so monitoring continues.",
    "tip": "In evaluation items, a finding that is new since treatment began is often a side effect of the treatment rather than progress."
   }
  ]
 },
 {
  "id": "cs-serotonin",
  "title": "New antibiotic that triggers serotonin syndrome",
  "sp": "psy",
  "topic": "Serotonin syndrome",
  "client": "41-year-old man on an adult inpatient psychiatric unit for major depression, day 6 of admission",
  "record": [
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "Day 1 14:00",
    "text": "Admitted for major depressive disorder with suicidal thoughts, no plan. Sertraline 150 mg daily for 5 months. No antipsychotic use in the past year. Day 3: started tramadol 50 mg PO every 6 hours for a low back strain. Day 5 at 20:00: medical consult started linezolid 600 mg PO every 12 hours for an MRSA abscess of the left forearm after incision and drainage. Weight 80 kg (176 lb)."
   },
   {
    "tab": "Medication Administration Record",
    "at": 0,
    "time": "Day 6 07:00",
    "text": "Sertraline 150 mg PO daily: last given Day 5 at 09:00. Tramadol 50 mg PO every 6 hours: given Day 5 at 18:00 and Day 6 at 00:00 and 06:00. Linezolid 600 mg PO every 12 hours: given Day 5 at 20:00; next due 08:00. PRN: haloperidol 5 mg IM every 6 hours as needed for severe agitation, not given this admission. PRN: acetaminophen 650 mg PO every 6 hours as needed for pain or fever."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "Day 5 16:00",
    "rows": [
     [
      "Temperature",
      "36.8 °C (98.2 °F)"
     ],
     [
      "Heart rate",
      "78"
     ],
     [
      "Blood pressure",
      "124/78"
     ],
     [
      "Respiratory rate",
      "16"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "Day 6 07:30",
    "text": "Pacing the hallway and cannot sit for more than a minute. Skin flushed and damp with sweat; gown changed twice since 05:00. Three loose stools since 04:00. Tremor of both hands; ankle jerks brisk with sustained clonus in both ankles, more than in the arms. Pupils 6 mm and reactive. Forearm dressing dry and intact. Denies thoughts of suicide today. Reports back pain 3/10, improved from 6/10 yesterday."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "Day 6 07:30",
    "rows": [
     [
      "Temperature",
      "38.6 °C (101.5 °F)"
     ],
     [
      "Heart rate",
      "122"
     ],
     [
      "Blood pressure",
      "158/96"
     ],
     [
      "Respiratory rate",
      "22"
     ],
     [
      "SpO₂",
      "97% on room air"
     ]
    ]
   },
   {
    "tab": "Nurses' Notes",
    "at": 1,
    "time": "Day 6 08:15",
    "text": "Skin warm and moist. Bowel sounds hyperactive. No rigidity of the arms or neck. Oriented, but restless and says, \"I feel like my whole body is revving.\" Voiding without difficulty. 08:00 linezolid held and provider paged with these findings."
   },
   {
    "tab": "Laboratory Results",
    "at": 1,
    "time": "Day 6 08:30",
    "rows": [
     [
      "CK",
      "480 units/L",
      "high"
     ],
     [
      "WBC",
      "11,200/mm³",
      "high"
     ],
     [
      "Sodium",
      "139 mEq/L"
     ],
     [
      "Creatinine",
      "1.0 mg/dL"
     ],
     [
      "Glucose",
      "98 mg/dL"
     ]
    ]
   },
   {
    "tab": "Orders",
    "at": 3,
    "time": "Day 6 09:00",
    "text": "Hold sertraline, tramadol and linezolid. Medical consult to select a non-serotonergic antibiotic. Lorazepam 1 mg PO or IM every 1 hour as needed for agitation or tremor; hold for RR below 12 or sedation. External cooling measures. Vital signs every 30 minutes. Encourage oral fluids."
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "Day 6 10:15",
    "text": "Lorazepam 1 mg PO given at 09:10. Temperature 39.6 °C (103.3 °F), HR 136, BP 174/102, RR 26. Leg muscles now stiff with sustained clonus. Disoriented to time. Provider at bedside."
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "Day 6 10:20",
    "text": "Cyproheptadine 12 mg PO now, then 2 mg every 2 hours if symptoms continue. Insert IV and start 0.9% NaCl at 150 mL/h. Transfer to medical ICU."
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "Day 6 18:00",
    "text": "Medical ICU note: Temperature 37.6 °C (99.7 °F). HR 96, BP 136/82. Ankle clonus now 2 beats, not sustained. No loose stools since 13:00. Calm and oriented to person, place, time and situation. CK 2,150 units/L. Asks when he can restart tramadol for his back."
   }
  ],
  "items": [
   {
    "id": "cs-serotonin-1",
    "type": "highlight",
    "step": "cues",
    "cn": "physio",
    "stem": "Refer to the chart. It is Day 6 at 07:30.",
    "q": "Highlight the findings in the nurse's note that require follow-up.",
    "parts": [
     {
      "t": "Pacing the hallway and cannot sit for more than a minute.",
      "ok": true,
      "why": "Yes: new restlessness and agitation are early signs of excess serotonin activity, not simply worsening depression."
     },
     {
      "t": "Skin flushed and damp with sweat; gown changed twice since 05:00.",
      "ok": true,
      "why": "Yes: heavy sweating reflects autonomic overactivity; with a fever of 38.6 °C (101.5 °F), it signals a drug reaction."
     },
     {
      "t": "Three loose stools since 04:00.",
      "ok": true,
      "why": "Yes: diarrhea and hyperactive bowel are caused by serotonin stimulating the gut."
     },
     {
      "t": "Tremor of both hands; ankle jerks brisk with sustained clonus in both ankles, more than in the arms.",
      "ok": true,
      "why": "Yes: inducible clonus and hyperreflexia, greater in the legs, are the hallmark neuromuscular signs of serotonin toxicity."
     },
     {
      "t": "Pupils 6 mm and reactive.",
      "ok": true,
      "why": "Yes: dilated pupils are a sign of serotonergic and sympathetic excess."
     },
     {
      "t": "Forearm dressing dry and intact.",
      "ok": false,
      "why": "No: a dry, intact dressing shows the abscess site is stable and is not the source of these new symptoms."
     },
     {
      "t": "Denies thoughts of suicide today.",
      "ok": false,
      "why": "No: this is a reassuring finding that is still monitored, but it does not require urgent follow-up right now."
     },
     {
      "t": "Reports back pain 3/10, improved from 6/10 yesterday.",
      "ok": false,
      "why": "No: improving back pain shows the analgesic is working and is not a new problem."
     }
    ],
    "why": "Agitation, sweating, diarrhea, dilated pupils and clonus that is worse in the legs, all starting overnight, form a pattern. A new fever and tachycardia make it urgent. The stable dressing, improved pain and absence of suicidal thoughts are not the problem.",
    "tip": "When several body systems change at once soon after a medication change, look for a drug reaction that ties them together."
   },
   {
    "id": "cs-serotonin-2",
    "type": "matrix",
    "step": "analyze",
    "cn": "pharm",
    "stem": "Refer to the chart. The nurse compares the client's findings with three drug-related syndromes.",
    "q": "For each finding, indicate the syndrome it is most characteristic of.",
    "cols": [
     "Serotonin syndrome",
     "Neuroleptic malignant syndrome",
     "Anticholinergic toxicity"
    ],
    "rows": [
     {
      "t": "Onset within 24 hours of adding a serotonergic drug",
      "ans": 0,
      "why": "serotonin syndrome develops within hours of a new drug or dose increase; this client's symptoms began about 8 hours after linezolid."
     },
     {
      "t": "Hyperreflexia with inducible clonus, worse in the legs",
      "ans": 0,
      "why": "neuromuscular hyperactivity with clonus is the key feature that separates serotonin syndrome from the other two."
     },
     {
      "t": "Profuse sweating and diarrhea",
      "ans": 0,
      "why": "serotonin increases sweating and gut motility; the client has both."
     },
     {
      "t": "Lead-pipe rigidity with slow or reduced reflexes",
      "ans": 1,
      "why": "NMS causes severe, uniform rigidity and slow reflexes; this client has brisk reflexes and no arm or neck rigidity."
     },
     {
      "t": "Develops over days after starting or increasing an antipsychotic",
      "ans": 1,
      "why": "NMS evolves over days from dopamine blockade; this client has had no antipsychotic in the past year."
     },
     {
      "t": "Hot, dry, flushed skin with urinary retention",
      "ans": 2,
      "why": "anticholinergic drugs block sweating and bladder emptying; this client is sweating and voiding normally."
     }
    ],
    "why": "All three syndromes can cause fever, tachycardia and agitation, so the nurse looks at the differences. Rapid onset, clonus and sweating point to serotonin syndrome. NMS is slow with rigidity and slow reflexes after an antipsychotic. Anticholinergic toxicity dries the skin.",
    "tip": "To separate these syndromes, compare three things: how fast it started, what the reflexes and muscles do, and whether the skin is wet or dry."
   },
   {
    "id": "cs-serotonin-3",
    "type": "cloze",
    "step": "hypo",
    "cn": "physio",
    "stem": "Refer to the chart. It is Day 6 at 08:45.",
    "q": "Complete the sentences.",
    "parts": [
     "The client's findings are most consistent with ",
     {
      "opts": [
       "serotonin syndrome",
       "neuroleptic malignant syndrome",
       "anticholinergic toxicity"
      ],
      "ans": 0,
      "whys": [
       "Yes: rapid onset with clonus, hyperreflexia, sweating and diarrhea after combining serotonergic drugs fits serotonin syndrome.",
       "No: he has no antipsychotic exposure, no lead-pipe rigidity, and brisk rather than slow reflexes.",
       "No: his skin is wet and he is voiding normally; anticholinergic toxicity causes dry skin and urinary retention."
      ]
     },
     ", most likely triggered by ",
     {
      "opts": [
       "adding linezolid to sertraline and tramadol",
       "the forearm abscess",
       "sertraline alone at a stable dose"
      ],
      "ans": 0,
      "whys": [
       "Yes: linezolid inhibits monoamine oxidase, so adding it to an SSRI and tramadol sharply raises serotonin levels within hours.",
       "No: an infection can cause fever, but it does not cause clonus, hyperreflexia and dilated pupils, and the wound is stable.",
       "No: he took sertraline for 5 months without symptoms; the reaction followed the new drugs."
      ]
     },
     ". The priority concern is ",
     {
      "opts": [
       "rising temperature from muscle overactivity, which can lead to rhabdomyolysis and seizures",
       "dehydration from diarrhea",
       "a return of suicidal thoughts"
      ],
      "ans": 0,
      "whys": [
       "Yes: hyperthermia from muscle activity drives the serious complications, and an elevated CK shows muscle breakdown has begun.",
       "No: fluid loss matters, but it is a secondary effect and not the main threat to life.",
       "No: safety monitoring continues, but he denies suicidal thoughts and the physical emergency comes first."
      ]
     },
     "."
    ],
    "why": "This is serotonin syndrome from linezolid, a monoamine oxidase inhibitor, added to sertraline and tramadol. The danger is heat from overactive muscles, which can cause rhabdomyolysis, seizures and organ failure. A rising temperature signals a worsening course.",
    "tip": "When naming a cause, pick the most recent change that fits the timing; a drug taken safely for months is rarely the trigger alone."
   },
   {
    "id": "cs-serotonin-4",
    "type": "matrix",
    "step": "solve",
    "cn": "pharm",
    "stem": "Refer to the chart. The provider has written new orders.",
    "q": "For each intervention, indicate whether it is indicated or not indicated for this client.",
    "cols": [
     "Indicated",
     "Not indicated"
    ],
    "rows": [
     {
      "t": "Hold sertraline, tramadol and linezolid, including the 08:00 linezolid dose",
      "ans": 0,
      "why": "stopping every serotonergic drug is the first and most important treatment, and the antibiotic will be replaced with a safer one."
     },
     {
      "t": "Remove extra blankets, cool the room and apply ice packs to the groin and armpits",
      "ans": 0,
      "why": "external cooling lowers the body temperature while the excess muscle activity is controlled."
     },
     {
      "t": "Give lorazepam per order for agitation and tremor",
      "ans": 0,
      "why": "benzodiazepines calm agitation and reduce muscle activity, which lowers heat production."
     },
     {
      "t": "Give the PRN haloperidol IM for agitation",
      "ans": 1,
      "why": "antipsychotics can impair heat loss and confuse the picture with NMS; benzodiazepines are the drug of choice."
     },
     {
      "t": "Apply four-point restraints to stop the pacing",
      "ans": 1,
      "why": "fighting restraints causes intense muscle contraction, which raises temperature and worsens muscle breakdown and acidosis."
     },
     {
      "t": "Rely on PRN acetaminophen as the main way to lower the fever",
      "ans": 1,
      "why": "the heat comes from muscle activity, not a reset in the brain's set point, so antipyretics do not work well."
     }
    ],
    "why": "Treatment of serotonin syndrome is stop the drugs, cool the body, calm the muscles. Benzodiazepines are first-line sedation. Antipsychotics, physical restraints and reliance on antipyretics are traps: each either fails to reduce heat or adds to it.",
    "tip": "Ask where the heat comes from: when it comes from the muscles, the treatment is to relax the muscles and cool the skin, not to give an antipyretic."
   },
   {
    "id": "cs-serotonin-5",
    "type": "sata",
    "step": "act",
    "cn": "physio",
    "update": "It is now 10:15. Despite lorazepam and cooling, the client is worse. The provider is at the bedside and has written new orders.",
    "stem": "Refer to the chart.",
    "q": "Which actions should the nurse take now? Select all that apply.",
    "opts": [
     {
      "t": "Call the rapid response team to help stabilize and transfer the client",
      "ok": true,
      "why": "Yes: a temperature of 39.6 °C (103.3 °F) with rising rigidity and new disorientation is a medical emergency beyond what the psychiatric unit can manage."
     },
     {
      "t": "Give cyproheptadine 12 mg orally as ordered",
      "ok": true,
      "why": "Yes: cyproheptadine blocks serotonin receptors and is the antidote used when supportive care is not enough; it is only available orally."
     },
     {
      "t": "Insert an IV and start 0.9% NaCl at 150 mL/h",
      "ok": true,
      "why": "Yes: fluids replace losses from sweating and diarrhea and protect the kidneys from muscle breakdown products."
     },
     {
      "t": "Stay with the client and continue external cooling",
      "ok": true,
      "why": "Yes: continuous observation keeps him safe while disoriented, and cooling continues until he reaches the ICU."
     },
     {
      "t": "Prepare a handoff report for the medical ICU, including all medication times",
      "ok": true,
      "why": "Yes: the ICU team needs the timeline of serotonergic drugs, doses given and response to treatment for safe care."
     },
     {
      "t": "Give the 08:00 linezolid dose now since it is late",
      "ok": false,
      "why": "No: linezolid is part of the cause and was held; giving it would add more serotonin activity."
     },
     {
      "t": "Place the client in seclusion until the agitation settles",
      "ok": false,
      "why": "No: this is a medical emergency, and seclusion prevents close monitoring of a client at risk for seizures and hyperthermia."
     },
     {
      "t": "Give acetaminophen and recheck the temperature in 1 hour before calling for help",
      "ok": false,
      "why": "No: acetaminophen does not lower heat from muscle activity, and waiting delays rescue for a rapidly worsening client."
     }
    ],
    "why": "Worsening fever, rigidity and confusion mean the serotonin syndrome is becoming severe. The nurse calls for help, gives the antidote, starts fluids, keeps cooling and stays with the client. Late serotonergic doses, seclusion and waiting on an antipyretic all add risk.",
    "tip": "When a client deteriorates despite first-line care, choose actions that bring more help and more treatment, not ones that wait."
   },
   {
    "id": "cs-serotonin-6",
    "type": "highlight",
    "step": "eval",
    "cn": "physio",
    "update": "It is now 18:00. The medical ICU nurse documents the following note.",
    "stem": "Refer to the chart.",
    "q": "Highlight the findings that show the client's condition is improving.",
    "parts": [
     {
      "t": "Temperature 37.6 °C (99.7 °F).",
      "ok": true,
      "why": "Yes: temperature is down from 39.6 °C (103.3 °F), showing muscle activity and heat production are under control."
     },
     {
      "t": "HR 96, BP 136/82.",
      "ok": true,
      "why": "Yes: the autonomic overactivity has settled from HR 136 and BP 174/102."
     },
     {
      "t": "Ankle clonus now 2 beats, not sustained.",
      "ok": true,
      "why": "Yes: clonus that is no longer sustained shows the neuromuscular toxicity is resolving after the drugs were stopped."
     },
     {
      "t": "No loose stools since 13:00.",
      "ok": true,
      "why": "Yes: the gut effects of excess serotonin are easing."
     },
     {
      "t": "Calm and oriented to person, place, time and situation.",
      "ok": true,
      "why": "Yes: agitation and confusion have cleared, showing mental status is returning to baseline."
     },
     {
      "t": "CK 2,150 units/L.",
      "ok": false,
      "why": "No: CK has risen from 480, showing ongoing muscle breakdown; the nurse monitors urine output, color and kidney function."
     },
     {
      "t": "Asks when he can restart tramadol for his back.",
      "ok": false,
      "why": "No: tramadol is serotonergic and helped cause this reaction; he needs teaching and a non-serotonergic pain plan."
     }
    ],
    "why": "Most signs of serotonin syndrome resolve within 24 hours once the drugs are stopped, and this client's vital signs, clonus, bowel and mental status show that. The rising CK means muscle damage still threatens the kidneys. His tramadol request shows a teaching need.",
    "tip": "In evaluation, compare each finding with its earlier value; a lab that rose after the crisis can lag behind the bedside improvement."
   }
  ]
 },
 {
  "id": "cs-copd",
  "title": "COPD flare with pneumonia",
  "sp": "ms",
  "topic": "COPD flare with pneumonia",
  "client": "66-year-old woman with severe COPD is admitted to the medical-surgical unit with an exacerbation and right lower lobe community-acquired pneumonia",
  "record": [
   {
    "tab": "Admission Notes",
    "at": 0,
    "time": "",
    "text": "A 66-year-old woman with severe COPD is admitted to the medical-surgical unit with an exacerbation and right lower lobe community-acquired pneumonia. She still smokes and has type 2 diabetes. You receive her from the emergency department in the afternoon."
   },
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "",
    "text": "66-year-old woman. COPD (FEV₁ 42% of predicted), 45 pack-year history, still smokes half a pack a day. Two exacerbations last year; no home oxygen. Pulmonology note: usual SpO₂ 90 to 92% on room air. Type 2 diabetes (A1c 7.2%), hypertension. Home medications: tiotropium inhaler daily, albuterol inhaler as needed, metformin 1,000 mg PO twice daily, lisinopril 10 mg PO daily. Four days of worsening dyspnea, more sputum that has turned thick and green, and fever with chills since yesterday. Has not received a pneumococcal vaccine. Weight 58 kg (127.9 lb). Lives with her daughter. No known allergies."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "14:00",
    "text": "T 38.4 °C (101.1 °F), HR 112, BP 146/88, RR 28, SpO₂ 85% on room air, 90% on 2 L nasal cannula."
   },
   {
    "tab": "Laboratory Results",
    "at": 0,
    "time": "13:30",
    "text": "Arterial blood gas on 2 L: pH 7.33 (7.35 to 7.45), PaCO₂ 58 mm Hg (35 to 45), HCO₃ 30 mEq/L (22 to 26), PaO₂ 61 mm Hg (80 to 100). WBC 15,200/mm³ (5,000 to 10,000), neutrophils 84% (40 to 70). Glucose 164 mg/dL (70 to 99). Sodium 138 mEq/L. Potassium 4.2 mEq/L. Creatinine 0.8 mg/dL. Lactate 1.4 mmol/L (0.5 to 2.2)."
   },
   {
    "tab": "Diagnostic Results",
    "at": 0,
    "time": "13:00",
    "text": "Chest x-ray: hyperinflated lungs with flattened diaphragms; right lower lobe consolidation."
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "14:30",
    "text": "Arrived from the ED on 2 L nasal cannula. Using neck and shoulder muscles to breathe at rest. Speaks 4 to 5 words between breaths. Barrel-shaped chest. Pursed-lip breathing. Coarse crackles over the right lower lobe; expiratory wheezes throughout. Clubbing of the fingertips. Coughing thick green sputum; daughter says it was white last week. Alert and oriented to person, place, time and situation, answering questions appropriately."
   },
   {
    "tab": "Orders",
    "at": 0,
    "time": "14:45",
    "text": "Oxygen by nasal cannula, titrate to SpO₂ 88 to 92%; notify provider for SpO₂ under 88%, need for more than 4 L, or new drowsiness or confusion. Ipratropium-albuterol nebulizer every 4 hours; albuterol 2.5 mg nebulizer every 2 hours PRN wheezing. Prednisone 40 mg PO daily for 5 days, first dose now. Blood cultures x2 and sputum culture, then ceftriaxone 1 g IV every 24 hours and azithromycin 500 mg IV every 24 hours. Point-of-care glucose before meals and at bedtime with insulin lispro correction scale: 151 to 200, 2 units; 201 to 250, 4 units; 251 to 300, 6 units; over 300, call provider. Continue metformin and lisinopril. Enoxaparin 40 mg subcut daily. Nicotine patch 14 mg daily. Zolpidem 5 mg PO at bedtime PRN sleep. Head of bed 30 degrees or higher. Repeat ABG for drowsiness, confusion or SpO₂ outside target."
   },
   {
    "tab": "Medication Administration Record",
    "at": 3,
    "time": "16:45",
    "text": "Ipratropium-albuterol nebulizer 15:00. Prednisone 40 mg PO 15:00. Blood cultures x2 and sputum culture collected 15:30. Ceftriaxone 1 g IV 15:45. Azithromycin 500 mg IV 16:00. Insulin lispro 4 units subcut 16:45."
   },
   {
    "tab": "Laboratory Results",
    "at": 3,
    "time": "16:40",
    "text": "Point-of-care glucose 248 mg/dL."
   },
   {
    "tab": "Vital Signs",
    "at": 3,
    "time": "17:00",
    "text": "T 38.1 °C (100.6 °F), HR 104, BP 140/84, RR 24, SpO₂ 91% on 2 L nasal cannula."
   },
   {
    "tab": "Nurses' Notes",
    "at": 3,
    "time": "17:00",
    "text": "Tired. Coughs often but cannot bring up the thick sputum. Wheezes slightly decreased after the nebulizer. Oral intake 300 mL since arrival. Her daughter asks why her mother can't have \"more oxygen to make it easier.\" Client asks to skip the prednisone because her sugar is high."
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "22:00",
    "text": "Found the flowmeter at 5 L. Daughter turned it up at about 19:30 \"because she was working so hard to breathe.\" Client is drowsy and falls asleep mid-sentence but wakes to her name. Complains of a headache. Respirations shallow. Skin warm and flushed. Daughter asks for \"her sleeping pill so she can rest.\""
   },
   {
    "tab": "Vital Signs",
    "at": 4,
    "time": "22:00",
    "text": "T 37.9 °C (100.2 °F), HR 98, BP 154/92, RR 12, SpO₂ 98% on 5 L nasal cannula."
   },
   {
    "tab": "Laboratory Results",
    "at": 4,
    "time": "22:15",
    "text": "Arterial blood gas on 5 L: pH 7.25, PaCO₂ 74 mm Hg, HCO₃ 31 mEq/L, PaO₂ 108 mm Hg. Compare 13:30 on 2 L: pH 7.33, PaCO₂ 58 mm Hg, HCO₃ 30 mEq/L, PaO₂ 61 mm Hg."
   },
   {
    "tab": "Flowsheet",
    "at": 5,
    "time": "06:00",
    "text": "BiPAP from 22:45 to 06:00, then 2 L nasal cannula."
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "05:30",
    "text": "Arterial blood gas on 2 L: pH 7.35, PaCO₂ 57 mm Hg, HCO₃ 31 mEq/L, PaO₂ 62 mm Hg. WBC 12,400/mm³ (15,200 on admission). Sputum culture: Streptococcus pneumoniae, sensitivities pending."
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "11:30",
    "text": "Point-of-care glucose: day 1 at 21:00, 286 mg/dL; day 2 at 07:00, 162 mg/dL; day 2 at 11:30, 274 mg/dL."
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "08:00",
    "text": "T 37.4 °C (99.3 °F), HR 92, BP 138/80, RR 20, SpO₂ 90% on 2 L nasal cannula."
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "12:00",
    "text": "Alert and oriented to person, place, time and situation. Speaks in full sentences. Wheezes decreased; coarse crackles remain over the right lower lobe. Coughing up thinner, lighter sputum. States, \"As soon as I can walk, I'm going outside for a cigarette. I'll take this oxygen off first, so don't worry.\""
   }
  ],
  "items": [
   {
    "id": "cs-copd-1",
    "step": "cues",
    "type": "highlight",
    "stem": "Refer to the 14:30 nurses' note.",
    "q": "Highlight the findings that require follow-up.",
    "parts": [
     {
      "t": "Using neck and shoulder muscles to breathe at rest.",
      "ok": true,
      "why": "Yes: accessory muscle use at rest means her breathing muscles are working near their limit. Fatigue can follow and lead to respiratory failure."
     },
     {
      "t": "Speaks 4 to 5 words between breaths.",
      "ok": true,
      "why": "Yes: being unable to finish a sentence shows a high work of breathing. It is a quick bedside measure you can trend."
     },
     {
      "t": "Barrel-shaped chest.",
      "ok": false,
      "why": "No: a barrel chest comes from years of air trapping in COPD. It is her chronic baseline, not a new problem."
     },
     {
      "t": "Pursed-lip breathing.",
      "ok": false,
      "why": "No: pursed lips keep small airways open and help her empty her lungs. It is a helpful technique, not a sign of new trouble."
     },
     {
      "t": "Coarse crackles over the right lower lobe.",
      "ok": true,
      "why": "Yes: crackles over the area of consolidation on x-ray reflect the new pneumonia. They are new compared with her usual COPD exam."
     },
     {
      "t": "Clubbing of the fingertips.",
      "ok": false,
      "why": "No: clubbing develops over months to years of low oxygen. The trap is treating a chronic finding as an acute change."
     },
     {
      "t": "Coughing thick green sputum; daughter says it was white last week.",
      "ok": true,
      "why": "Yes: a change in sputum color and volume is a key sign of a bacterial exacerbation and supports starting antibiotics."
     },
     {
      "t": "Alert and oriented to person, place, time and situation, answering questions appropriately.",
      "ok": false,
      "why": "No: normal mentation is her baseline. Record it carefully, because new drowsiness would be an early sign of rising CO₂."
     }
    ],
    "why": "Sort what is chronic from what is new. Barrel chest, clubbing and pursed-lip breathing are her COPD baseline. Accessory muscle use, short phrases, new focal crackles and green sputum describe an acute exacerbation with pneumonia.",
    "tip": "For a client with a chronic disease, ask whether each finding was there last month; only the new or worse findings need follow-up.",
    "cn": "physio"
   },
   {
    "id": "cs-copd-2",
    "step": "analyze",
    "type": "cloze",
    "stem": "Refer to the 13:30 arterial blood gas.",
    "q": "Complete the sentences.",
    "parts": [
     "The pH of 7.33 with a PaCO₂ of 58 mm Hg shows ",
     {
      "opts": [
       "respiratory acidosis",
       "metabolic acidosis",
       "respiratory alkalosis"
      ],
      "ans": 0,
      "whys": [
       "Yes: the pH is below 7.35 and the PaCO₂ is high, moving in opposite directions. Retained CO₂ from poor ventilation is causing the acidosis.",
       "No: in metabolic acidosis the HCO₃ is low. Her HCO₃ is high, so the bicarbonate is not the cause.",
       "No: alkalosis requires a pH above 7.45. The trap is reading the high HCO₃ alone without starting from the pH."
      ]
     },
     ". The HCO₃ of 30 mEq/L shows the kidneys have ",
     {
      "opts": [
       "partially compensated",
       "fully compensated",
       "not compensated"
      ],
      "ans": 0,
      "whys": [
       "Yes: the kidneys have retained bicarbonate to buffer the acid, but the pH is still below normal. That is partial compensation.",
       "No: full compensation brings the pH back into the normal range. Her pH of 7.33 is still acidotic.",
       "No: an uncompensated gas would have a normal HCO₃. Hers is elevated, which takes days of kidney work."
      ]
     },
     ". Because she retains CO₂, her oxygen should be titrated to an SpO₂ of ",
     {
      "opts": [
       "88 to 92%",
       "94 to 98%",
       "100%"
      ],
      "ans": 0,
      "whys": [
       "Yes: GOLD guidance targets 88 to 92% in COPD with CO₂ retention. It prevents hypoxemia without driving the CO₂ higher.",
       "No: this is the target for most clients without CO₂ retention. In her, extra oxygen can raise the PaCO₂ and cause drowsiness.",
       "No: there is no benefit to full saturation, and high-flow oxygen can cause CO₂ narcosis in a chronic retainer."
      ]
     },
     "."
    ],
    "why": "Start with the pH, then match the PaCO₂ or HCO₃ that explains it. Her acidosis is respiratory, and the high HCO₃ shows the kidneys have been holding bicarbonate for some time, so she is a chronic CO₂ retainer with an acute rise on top. That is why her oxygen target is 88 to 92%.",
    "tip": "Use the same three steps on every ABG: pH for acid or base, PaCO₂ or HCO₃ for the cause, then the other value for compensation.",
    "cn": "physio"
   },
   {
    "id": "cs-copd-3",
    "step": "hypo",
    "type": "sata",
    "stem": "Refer to the chart.",
    "q": "Which client problems should the nurse address as priorities now? Select all that apply.",
    "opts": [
     {
      "t": "Impaired gas exchange from airway obstruction and consolidation",
      "ok": true,
      "why": "Yes: an SpO₂ of 85% on room air, a PaO₂ of 61 mm Hg and a PaCO₂ of 58 mm Hg show she is not oxygenating or ventilating well."
     },
     {
      "t": "Ineffective airway clearance from thick, increased secretions",
      "ok": true,
      "why": "Yes: thick green sputum and wheezes block small airways that are already narrowed by COPD. Clearing them improves gas exchange."
     },
     {
      "t": "Infection that could progress to sepsis without prompt antibiotics",
      "ok": true,
      "why": "Yes: fever, HR 112, RR 28 and a WBC of 15,200 with a consolidation need cultures and antibiotics promptly. Her normal lactate and BP are reassuring for now."
     },
     {
      "t": "Worsening CO₂ retention if oxygen is given above her target",
      "ok": true,
      "why": "Yes: her ABG shows chronic CO₂ retention. Oxygen above 88 to 92% can blunt her drive to breathe and push the PaCO₂ higher."
     },
     {
      "t": "Fluid volume excess",
      "ok": false,
      "why": "No: she has no edema, neck vein distention or bilateral crackles. Her crackles are localized to the consolidated lobe."
     },
     {
      "t": "Hypoglycemia",
      "ok": false,
      "why": "No: her glucose is 164 mg/dL, and the steroid she is about to start will raise it further. The risk is high glucose, not low."
     },
     {
      "t": "Acute pulmonary embolism",
      "ok": false,
      "why": "No: fever, purulent sputum and a lobar consolidation explain her findings. The trap is chasing a rare cause when a common one fits the data."
     },
     {
      "t": "Disturbed body image related to her barrel chest",
      "ok": false,
      "why": "No: psychosocial needs matter, but there is no data suggesting distress about her appearance. Airway, breathing and infection come first now."
     }
    ],
    "why": "Her problems now are breathing and infection. Gas exchange and airway clearance come from the exacerbation and pneumonia, the infection needs prompt treatment, and her chronic CO₂ retention makes oxygen dosing a safety issue. The other choices are not supported by her data.",
    "tip": "Choose problems that the chart directly supports and that threaten airway, breathing or circulation right now.",
    "cn": "physio"
   },
   {
    "id": "cs-copd-4",
    "step": "solve",
    "type": "matrix",
    "stem": "It is 17:00 on day 1. Refer to the new chart entries.",
    "q": "For each intervention, indicate whether it is indicated or contraindicated for this client now.",
    "cols": [
     "Indicated",
     "Contraindicated"
    ],
    "rows": [
     {
      "t": "Keep the head of the bed high and let her lean forward on the over-bed table if she prefers",
      "ans": 0,
      "why": "upright, forward-leaning positions lower the diaphragm and let her use her accessory muscles more efficiently."
     },
     {
      "t": "Increase the oxygen to 6 L so her SpO₂ reaches 98%",
      "ans": 1,
      "why": "her SpO₂ of 91% is in target. Raising it to 98% risks CO₂ narcosis, which is the trap behind the daughter's request."
     },
     {
      "t": "Encourage oral fluids, about 2 L a day unless restricted, to thin secretions",
      "ans": 0,
      "why": "she has taken only 300 mL and has a fever. Adequate hydration makes thick sputum easier to cough up."
     },
     {
      "t": "Teach huff coughing after each nebulizer treatment",
      "ans": 0,
      "why": "huff coughing moves secretions without collapsing her floppy airways, and it works best once the bronchodilator has opened them."
     },
     {
      "t": "Hold the prednisone because the glucose is 248 mg/dL",
      "ans": 1,
      "why": "systemic steroids shorten COPD exacerbations. Steroid hyperglycemia is expected and managed with insulin, not by stopping the steroid."
     },
     {
      "t": "Cluster care and plan rest periods between activities",
      "ans": 0,
      "why": "she is tired, and every task costs oxygen. Spacing activity protects her from respiratory muscle fatigue."
     }
    ],
    "why": "Good care for a COPD exacerbation opens airways, clears secretions and keeps oxygen in a safe range. Position, fluids, huff coughing and rest all support her breathing. Over-oxygenating her or stopping the steroid would trade a short-term comfort for real harm.",
    "tip": "When a family member or client requests a change, test it against the target or the order before agreeing.",
    "cn": "physio"
   },
   {
    "id": "cs-copd-5",
    "step": "act",
    "type": "sata",
    "stem": "It is 22:15 on day 1. Refer to the new chart entries.",
    "q": "Which actions should the nurse take now? Select all that apply.",
    "opts": [
     {
      "t": "Turn the oxygen down and titrate to an SpO₂ of 88 to 92%",
      "ok": true,
      "why": "Yes: excess oxygen is driving the CO₂ up. Lowering it to her target reverses the cause while keeping her oxygenated."
     },
     {
      "t": "Stay with the client and keep the head of the bed elevated",
      "ok": true,
      "why": "Yes: she is sedated by CO₂ and could stop protecting her airway. Upright positioning helps ventilation, and someone must watch her closely."
     },
     {
      "t": "Notify the provider or call a rapid response and report the ABG",
      "ok": true,
      "why": "Yes: a pH of 7.25 with a PaCO₂ of 74 mm Hg and new drowsiness is acute hypercapnic respiratory failure needing urgent evaluation."
     },
     {
      "t": "Prepare for noninvasive positive pressure ventilation",
      "ok": true,
      "why": "Yes: BiPAP is first-line for acute hypercapnic failure in COPD. It improves ventilation and can prevent intubation."
     },
     {
      "t": "Turn the oxygen off completely until she is fully awake",
      "ok": false,
      "why": "No: stopping oxygen abruptly can drop her PaO₂ dangerously low. The trap is overcorrecting; titrate down, do not remove."
     },
     {
      "t": "Give the PRN zolpidem so she can rest",
      "ok": false,
      "why": "No: a sedative-hypnotic will further depress her drive to breathe. Hold it and ask to have it discontinued."
     },
     {
      "t": "Switch to a nonrebreather mask to support her breathing",
      "ok": false,
      "why": "No: a nonrebreather delivers even more oxygen and would worsen the CO₂ retention. It does nothing to improve ventilation."
     },
     {
      "t": "Explain her 88 to 92% target to her daughter and ask her to call the nurse instead of adjusting the flowmeter",
      "ok": true,
      "why": "Yes: the daughter acted out of love. Teaching her why more oxygen is harmful prevents a repeat."
     }
    ],
    "why": "Too much oxygen in a chronic CO₂ retainer reduced her drive to breathe, and her CO₂ rose from 58 to 74 mm Hg. Titrate the oxygen down, stay with her, get help, and prepare for BiPAP. Removing oxygen entirely, sedating her or adding more oxygen would each make her worse.",
    "tip": "When the cause of deterioration is something the team gave, the first action is usually to correct it safely, not stop it abruptly.",
    "cn": "physio"
   },
   {
    "id": "cs-copd-6",
    "step": "eval",
    "type": "matrix",
    "trend": true,
    "stem": "It is 12:00 on day 2. Refer to the new chart entries.",
    "q": "For each finding, indicate whether it shows the treatment is effective or that the client needs further intervention.",
    "cols": [
     "Effective",
     "Needs further intervention"
    ],
    "rows": [
     {
      "t": "Drowsy at 22:00; now alert and oriented in full sentences",
      "ans": 0,
      "why": "her mental status returned to baseline as the CO₂ came down on BiPAP and correct oxygen dosing."
     },
     {
      "t": "ABG pH 7.25 and PaCO₂ 74 mm Hg at 22:15; pH 7.35 and PaCO₂ 57 mm Hg at 05:30",
      "ans": 0,
      "why": "the pH is back in range and the PaCO₂ is near her admission value. A chronic retainer will not normalize her CO₂."
     },
     {
      "t": "SpO₂ 90% on 2 L nasal cannula",
      "ans": 0,
      "why": "this is inside her 88 to 92% target. The trap is calling 90% low when the goal for her is not 95%."
     },
     {
      "t": "Temperature 38.4 °C (101.1 °F) on admission, now 37.4 °C (99.3 °F); WBC 15,200, now 12,400/mm³",
      "ans": 0,
      "why": "falling fever and white count within 24 hours of antibiotics show the pneumonia is responding. Persistent crackles are expected for days."
     },
     {
      "t": "Glucose 286 mg/dL at 21:00 and 274 mg/dL at 11:30",
      "ans": 1,
      "why": "correction insulin alone is not controlling steroid-driven afternoon highs. Report the pattern so the provider can add scheduled or mealtime insulin."
     },
     {
      "t": "\"I'll take this oxygen off first, so don't worry.\"",
      "ans": 1,
      "why": "smoking is the main driver of her COPD and delays recovery. She needs cessation counseling, use of her nicotine patch, and support rather than a lecture."
     }
    ],
    "why": "Her breathing, mental status and infection are improving, which shows BiPAP, oxygen titration and antibiotics are working. Steroid hyperglycemia is not controlled by correction insulin alone, and her plan to smoke shows she needs cessation support. Mixed results like this are common on day 2.",
    "tip": "Compare each value with the client's own target, not a textbook normal, before calling it effective or not.",
    "cn": "physio"
   }
  ],
  "sys": "respiratory"
 },
 {
  "id": "cs-hemorrhage",
  "title": "Bleeding after a hysterectomy",
  "sp": "ms",
  "topic": "Bleeding after a hysterectomy",
  "client": "54-year-old woman is on the medical-surgical unit after an open total abdominal hysterectomy this morning",
  "record": [
   {
    "tab": "Admission Notes",
    "at": 0,
    "time": "",
    "text": "A 54-year-old woman is on the medical-surgical unit after an open total abdominal hysterectomy this morning. She arrived from the PACU at 13:30 with stable vital signs. You are her nurse for the afternoon."
   },
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "",
    "text": "54-year-old female. Open total abdominal hysterectomy with bilateral salpingo-oophorectomy for symptomatic fibroids and heavy menstrual bleeding. Surgery 08:15 to 11:05; estimated blood loss 450 mL. History: hypertension, iron deficiency anemia. Home medications: lisinopril 10 mg PO daily, ferrous sulfate 325 mg PO daily. Weight 72 kg (159 lb). Allergies: none known. Blood type O positive, antibody screen negative; type and screen drawn 06:00, valid 72 hours."
   },
   {
    "tab": "Laboratory Results",
    "at": 0,
    "time": "06:00",
    "text": "Preoperative. Hemoglobin 11.2 g/dL (12 to 16). Hematocrit 34% (36 to 46). Platelets 268,000/mm³ (150,000 to 400,000). INR 1.1 (0.8 to 1.1). Potassium 4.2 mEq/L (3.5 to 5). Creatinine 0.8 mg/dL (0.6 to 1.1)."
   },
   {
    "tab": "Orders",
    "at": 0,
    "time": "13:30",
    "text": "Vital signs every hour for 4 hours, then every 4 hours. Lactated Ringer's at 125 mL/h. Indwelling urinary catheter to gravity; hourly urine output. Hydromorphone PCA: 0.2 mg demand dose, 10-minute lockout, no basal rate. Ondansetron 4 mg IV every 6 hours as needed for nausea. Sequential compression devices. Incentive spirometer 10 times an hour while awake. Enoxaparin 40 mg subcut daily, first dose POD 1 at 08:00. CBC at 18:00 and 05:00. Clear liquids when nausea free. Lisinopril on hold."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "13:30",
    "text": "T 36.8 °C (98.2 °F), HR 84, RR 16, BP 132/78, SpO₂ 97% on 2 L nasal cannula. Pain 4/10."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "14:30",
    "text": "T 36.9 °C (98.4 °F), HR 92, RR 18, BP 128/82, SpO₂ 97% on 2 L nasal cannula. Pain 5/10."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "15:30",
    "text": "T 37 °C (98.6 °F), HR 104, RR 20, BP 122/86, SpO₂ 96% on 2 L nasal cannula. Pain 5/10."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "16:30",
    "text": "T 37.1 °C (98.8 °F), HR 116, RR 22, BP 112/88, SpO₂ 95% on 2 L nasal cannula. Pain 6/10."
   },
   {
    "tab": "Flowsheet",
    "at": 0,
    "time": "16:30",
    "text": "Urine output: 13:30 to 14:30, 60 mL; 14:30 to 15:30, 35 mL; 15:30 to 16:30, 20 mL. IV intake 125 mL/h. PCA: 14 demands, 12 doses delivered since 13:30."
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "16:30",
    "text": "Restless, keeps shifting in bed. States, I just feel off, and asks for another blanket. Skin cool and pale; capillary refill 3 seconds. Abdomen more distended and firmer than at 13:30, tender around the incision. Bowel sounds hypoactive. Midline dressing dry and intact. Scant dark red vaginal drainage on the pad. Lungs clear. Alert and oriented x4."
   },
   {
    "tab": "Nurses' Notes",
    "at": 3,
    "time": "16:40",
    "text": "Rapid response team at bedside 16:38. Surgeon paged and on the way. Only IV access is a 20 gauge in the left hand. Client says, Something is wrong. Abdomen firm, distended and tender. Stat labs sent."
   },
   {
    "tab": "Vital Signs",
    "at": 3,
    "time": "16:55",
    "text": "T 37.1 °C (98.8 °F), HR 122, RR 24, BP 104/84, SpO₂ 95% on 2 L nasal cannula."
   },
   {
    "tab": "Laboratory Results",
    "at": 3,
    "time": "16:55",
    "text": "Hemoglobin 7.6 g/dL (12 to 16; 11.2 at 06:00). Hematocrit 23% (36 to 46). Platelets 214,000/mm³ (150,000 to 400,000). INR 1.1 (0.8 to 1.1). PTT 31 seconds (25 to 35). Lactate 3.2 mmol/L (0.5 to 2). Potassium 4.1 mEq/L (3.5 to 5). Creatinine 1.1 mg/dL (0.6 to 1.1)."
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "17:05",
    "text": "Transfuse packed red blood cells, 2 units, now. Continue lactated Ringer's 1,000 mL bolus. Exploratory laparotomy; OR notified, case at 18:00; surgeon has obtained consent. Vital signs every 15 minutes. Strict intake and output. Repeat CBC after the second unit."
   },
   {
    "tab": "Medication Administration Record",
    "at": 4,
    "time": "17:00",
    "text": "Lactated Ringer's 1,000 mL IV bolus started 17:00 via 18 gauge right antecubital IV (placed 16:50)."
   },
   {
    "tab": "Laboratory Results",
    "at": 4,
    "time": "17:20",
    "text": "Blood bank: unit 1 packed red blood cells, O positive, crossmatch compatible, issued 17:20."
   },
   {
    "tab": "Vital Signs",
    "at": 4,
    "time": "17:20",
    "text": "T 37.1 °C (98.8 °F), HR 124, RR 24, BP 98/82, SpO₂ 95% on 2 L nasal cannula."
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "20:45",
    "text": "Returned from the OR. Operative report: 1,200 mL of blood evacuated from the pelvis; bleeding from the left uterine artery pedicle, ligated. Received 2 units packed red blood cells (1 on the unit, 1 in the OR) and 2,500 mL lactated Ringer's total since 17:00."
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "21:30",
    "text": "Hemoglobin 9.2 g/dL (12 to 16). Hematocrit 28% (36 to 46). Platelets 176,000/mm³ (150,000 to 400,000). INR 1.1 (0.8 to 1.1). Lactate 1.5 mmol/L (0.5 to 2)."
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "22:30",
    "text": "T 37 °C (98.6 °F), HR 94, RR 22, BP 118/74, SpO₂ 91% on 2 L nasal cannula (96% at 21:30)."
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "22:30",
    "text": "Heart rate 94, down from 124 before surgery. BP 118/74, pulse pressure 44. Urine output 45 mL and 50 mL over the last 2 hours. Skin warm and dry, capillary refill under 2 seconds. Lactate 1.5 mmol/L and hemoglobin 9.2 g/dL. New fine crackles in both lung bases. SpO₂ 91% on 2 L, was 96% at 21:30."
   }
  ],
  "items": [
   {
    "id": "cs-hemorrhage-1",
    "step": "cues",
    "type": "matrix",
    "trend": true,
    "stem": "Refer to the vital signs and flowsheet from 13:30 to 16:30.",
    "q": "For each finding, indicate whether it requires follow-up or is expected after this surgery.",
    "cols": [
     "Requires follow-up",
     "Expected"
    ],
    "rows": [
     {
      "t": "Heart rate 84, 92, 104, then 116",
      "ans": 0,
      "why": "a steady climb past 100 is the earliest compensatory sign of volume loss. The trap is blaming pain, which has barely changed."
     },
     {
      "t": "Blood pressure 132/78 falling to 112/88",
      "ans": 0,
      "why": "systolic falls while diastolic rises, so pulse pressure narrows from 54 to 24 as vasoconstriction offsets a shrinking stroke volume."
     },
     {
      "t": "Urine output 60, 35, then 20 mL/h",
      "ans": 0,
      "why": "20 mL/h is below 0.5 mL/kg/h (36 mL/h for 72 kg); blood is being diverted away from the kidneys to protect the brain and heart."
     },
     {
      "t": "Respiratory rate 16 rising to 22",
      "ans": 0,
      "why": "faster breathing accompanies early shock as tissues make lactate. A client using an opioid PCA would be expected to breathe slower, not faster."
     },
     {
      "t": "Temperature 37.1 °C (98.8 °F)",
      "ans": 1,
      "why": "a mild rise in the first 24 hours is the normal inflammatory response to surgery and does not point to bleeding or infection."
     },
     {
      "t": "Scant dark red vaginal drainage on the pad",
      "ans": 1,
      "why": "a small amount of vaginal bleeding is expected after hysterectomy. Bleeding here is hidden in the abdomen, so a clean pad is not reassuring."
     }
    ],
    "why": "Trend each value against the client's own first reading. Heart rate, respirations and diastolic pressure rise while urine output falls, which is the pattern of compensated hypovolemia. Systolic pressure is still over 110, and that is exactly why bleeding is missed when the nurse waits for hypotension.",
    "tip": "On trend items, compare each value with the client's first reading rather than the normal range, and ask which direction it is moving.",
    "cn": "risk"
   },
   {
    "id": "cs-hemorrhage-2",
    "step": "analyze",
    "type": "sata",
    "q": "Which findings are consistent with a loss of circulating blood volume? Select all that apply.",
    "opts": [
     {
      "t": "Heart rate 116",
      "ok": true,
      "why": "Yes: sympathetic stimulation speeds the heart to keep cardiac output up as the stroke volume falls with blood loss."
     },
     {
      "t": "Pulse pressure narrowing from 54 to 24",
      "ok": true,
      "why": "Yes: arterioles constrict and raise the diastolic pressure while the systolic falls; a narrowing pulse pressure is an early sign of hypovolemia."
     },
     {
      "t": "Cool, pale skin with capillary refill of 3 seconds",
      "ok": true,
      "why": "Yes: blood is shunted away from the skin to the vital organs, so the skin cools and pales before the blood pressure drops."
     },
     {
      "t": "Urine output 20 mL/h",
      "ok": true,
      "why": "Yes: low kidney perfusion plus aldosterone and antidiuretic hormone release cut urine output; it is one of the most sensitive early signs of volume loss."
     },
     {
      "t": "Abdomen more distended and firmer than at 13:30",
      "ok": true,
      "why": "Yes: an enlarging, firm abdomen after pelvic surgery suggests blood collecting in the abdomen or pelvis, where it cannot be seen."
     },
     {
      "t": "Hypoactive bowel sounds",
      "ok": false,
      "why": "No: slowed bowel activity is expected for a day or more after abdominal surgery and anesthesia; it does not indicate blood loss."
     },
     {
      "t": "Midline dressing dry and intact",
      "ok": false,
      "why": "No: a dry dressing does not rule out bleeding. The trap is checking only the incision when bleeding after hysterectomy usually collects inside."
     },
     {
      "t": "SpO₂ 95% on 2 L nasal cannula",
      "ok": false,
      "why": "No: a saturation of 95% is acceptable and has changed little; it does not reflect circulating volume and is not a reliable early shock sign."
     }
    ],
    "why": "The body defends blood pressure by speeding the heart, constricting vessels and holding on to water. That is what produces tachycardia, a narrow pulse pressure, cool skin and low urine output while the systolic pressure looks acceptable. A firm, distended abdomen tells you where the blood is going.",
    "tip": "For each option, ask whether the body would produce it to compensate for less volume; findings expected after any abdominal surgery are distractors.",
    "cn": "risk",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-hemorrhage-3",
    "step": "hypo",
    "type": "cloze",
    "q": "Complete the sentences.",
    "parts": [
     "The client is most likely experiencing ",
     {
      "opts": [
       "hemorrhage progressing toward hypovolemic shock",
       "early sepsis from a surgical site infection",
       "opioid-induced respiratory depression"
      ],
      "ans": 0,
      "whys": [
       "Yes: rising heart rate, narrowing pulse pressure, cool skin, falling urine output and a firmer abdomen hours after pelvic surgery all point to bleeding.",
       "No: infection rarely appears 5 hours after surgery, and early sepsis usually causes fever and warm skin rather than a narrowing pulse pressure.",
       "No: opioid toxicity slows breathing and causes sedation; she is breathing faster, restless and tachycardic."
      ]
     },
     ". Her systolic pressure is still above 110 because she is in the ",
     {
      "opts": [
       "compensated",
       "progressive",
       "irreversible"
      ],
      "ans": 0,
      "whys": [
       "Yes: in compensated shock, tachycardia and vasoconstriction hold the systolic pressure near normal while perfusion to the skin and kidneys falls.",
       "No: progressive shock brings hypotension, a MAP under 65 and worsening organ dysfunction; her pressure has not fallen that far yet.",
       "No: irreversible shock is organ failure that no longer responds to treatment; she can still be rescued."
      ]
     },
     " stage of shock. The nurse's priority is to ",
     {
      "opts": [
       "call the rapid response team and notify the surgeon",
       "encourage her to use the PCA more often",
       "recheck her vital signs in 1 hour"
      ],
      "ans": 0,
      "whys": [
       "Yes: compensation can fail suddenly, so she needs a team at the bedside and the surgeon informed now.",
       "No: pain does not explain this trend, and more opioid can drop her pressure and mask the restlessness of shock.",
       "No: waiting lets her keep bleeding; by the time the systolic pressure falls she may have lost 30% or more of her blood volume."
      ]
     },
     "."
    ],
    "why": "The cluster fits postoperative hemorrhage in compensated shock. Compensation buys time but fails abruptly, so the nurse escalates on the trend instead of waiting for hypotension. Sepsis and opioid toxicity each have features she does not have.",
    "tip": "When a stable client changes after surgery, name the complication that fits every cue and the timing, then escalate before the blood pressure falls.",
    "cn": "risk",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-hemorrhage-4",
    "step": "solve",
    "type": "matrix",
    "q": "The nurse prepares for the surgeon's arrival. For each intervention, indicate whether it is anticipated or contraindicated.",
    "cols": [
     "Anticipated",
     "Contraindicated"
    ],
    "rows": [
     {
      "t": "Insert a second IV, 18 gauge or larger",
      "ans": 0,
      "why": "a single 20 gauge cannot deliver fluid and blood fast enough; flow rises sharply with catheter diameter, so two large-bore lines are standard."
     },
     {
      "t": "Send a type and crossmatch for packed red blood cells",
      "ans": 0,
      "why": "her hemoglobin has dropped from 11.2 to 7.6 g/dL with ongoing signs of shock; crossmatched units should be ready before they are needed."
     },
     {
      "t": "Give a 1,000 mL lactated Ringer's bolus",
      "ans": 0,
      "why": "isotonic crystalloid supports volume while blood is prepared. Large volumes alone dilute clotting factors, so blood should follow promptly."
     },
     {
      "t": "Keep her NPO for a possible return to surgery",
      "ans": 0,
      "why": "a firm, distended abdomen with a falling hemoglobin often means a bleeding vessel that must be tied off; an empty stomach lowers aspiration risk."
     },
     {
      "t": "Give the enoxaparin dose now instead of in the morning",
      "ans": 1,
      "why": "an anticoagulant during active bleeding worsens hemorrhage. The trap is following the clot-prevention routine when bleeding is the immediate threat."
     },
     {
      "t": "Give ketorolac 30 mg IV for her abdominal pain",
      "ans": 1,
      "why": "ketorolac is an NSAID that impairs platelet function and kidney blood flow, both dangerous in a client who is bleeding with low urine output."
     }
    ],
    "why": "The plan is to restore volume and stop the bleeding: two large-bore lines, crystalloid, blood ready, and an empty stomach for surgery. Anything that impairs clotting or kidney perfusion makes things worse. A hemoglobin drop of more than 3 g/dL in hours confirms what the vital signs showed.",
    "tip": "For anticipated versus contraindicated items, ask whether each option helps restore volume or stop bleeding, or instead adds to the bleeding.",
    "cn": "risk",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-hemorrhage-5",
    "step": "act",
    "type": "sata",
    "q": "The first unit of packed red blood cells arrives at 17:25. Which actions should the nurse take? Select all that apply.",
    "opts": [
     {
      "t": "Check the client's two identifiers, ABO and Rh type, unit number and expiration with a second licensed nurse at the bedside",
      "ok": true,
      "why": "Yes: bedside verification by two licensed staff is the main safeguard against an ABO mismatch, the most common cause of fatal transfusion reactions."
     },
     {
      "t": "Prime the blood tubing with 0.9% sodium chloride",
      "ok": true,
      "why": "Yes: normal saline is the only solution that is compatible with red cells; it does not cause clotting or hemolysis in the line."
     },
     {
      "t": "Take a full set of vital signs before starting the unit",
      "ok": true,
      "why": "Yes: a baseline is needed to recognize a reaction; fever, a rising heart rate or a falling pressure are compared with the pre-transfusion values."
     },
     {
      "t": "Stay with the client for the first 15 minutes of the transfusion",
      "ok": true,
      "why": "Yes: most severe reactions, including acute hemolytic and anaphylactic reactions, appear early, so the nurse watches closely and repeats vital signs at 15 minutes."
     },
     {
      "t": "Infuse the blood through the 18 gauge antecubital IV",
      "ok": true,
      "why": "Yes: an 18 gauge catheter lets blood run quickly without damaging red cells, which matters in a client who is actively bleeding."
     },
     {
      "t": "Connect the blood to the lactated Ringer's line to save a step",
      "ok": false,
      "why": "No: the calcium in lactated Ringer's can trigger clotting of the citrated blood in the tubing; textbook practice is 0.9% sodium chloride only."
     },
     {
      "t": "Warm the unit in the unit microwave to prevent hypothermia",
      "ok": false,
      "why": "No: microwaving heats unevenly and destroys red cells. When warming is needed, only an approved blood warmer is used."
     },
     {
      "t": "Ask the unlicensed assistive personnel to do the bedside check with you to save time",
      "ok": false,
      "why": "No: verifying blood products cannot be delegated to unlicensed staff. The trap is trading safety for speed in an emergency."
     }
    ],
    "why": "Urgency does not change the transfusion safety steps. Two licensed staff verify the client and the unit at the bedside, the line is primed with normal saline, and baseline vital signs come first. The nurse stays for the first 15 minutes, when most severe reactions appear.",
    "tip": "Transfusion items test safety rules that do not bend in an emergency; eliminate any option that skips verification, uses the wrong fluid or delegates the check.",
    "cn": "pharm",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-hemorrhage-6",
    "step": "eval",
    "type": "highlight",
    "q": "Refer to the 22:30 nurse's note. Highlight the findings that show the client's condition has improved.",
    "parts": [
     {
      "t": "Heart rate 94, down from 124 before surgery.",
      "ok": true,
      "why": "Yes: with the bleeding stopped and volume restored, the sympathetic drive eases and the heart no longer has to race to keep output up."
     },
     {
      "t": "BP 118/74, pulse pressure 44.",
      "ok": true,
      "why": "Yes: the pulse pressure has widened back toward her baseline of 54, showing stroke volume has recovered and vasoconstriction has relaxed."
     },
     {
      "t": "Urine output 45 mL and 50 mL over the last 2 hours.",
      "ok": true,
      "why": "Yes: output is above 0.5 mL/kg/h (36 mL/h), so the kidneys are perfused again."
     },
     {
      "t": "Skin warm and dry, capillary refill under 2 seconds.",
      "ok": true,
      "why": "Yes: blood is returning to the skin because the body no longer needs to divert it to the core organs."
     },
     {
      "t": "Lactate 1.5 mmol/L and hemoglobin 9.2 g/dL.",
      "ok": true,
      "why": "Yes: a normal lactate shows tissues are getting enough oxygen, and the hemoglobin rose as expected after 2 units with the bleeding controlled."
     },
     {
      "t": "New fine crackles in both lung bases.",
      "ok": false,
      "why": "No: new crackles after 2 units of blood and 2.5 L of fluid suggest volume overload or transfusion-associated circulatory overload; notify the provider."
     },
     {
      "t": "SpO₂ 91% on 2 L, was 96% at 21:30.",
      "ok": false,
      "why": "No: falling oxygenation with new crackles is a worsening finding. Raise the head of the bed, increase oxygen as ordered and report it."
     }
    ],
    "why": "Heart rate, pulse pressure, urine output, skin and lactate all show that perfusion has been restored. Evaluation also means catching what the treatment caused: new crackles and a falling SpO₂ after large volumes of fluid and blood point to circulatory overload. The nurse reports this and anticipates a diuretic and slower fluids.",
    "tip": "When evaluating, sort findings into improved, unchanged and new problems; a new problem caused by the treatment is never a sign of improvement.",
    "cn": "risk",
    "stem": "Refer to the chart."
   }
  ],
  "sys": "heme"
 },
 {
  "id": "cs-tbi",
  "title": "Head injury after a motorcycle crash",
  "sp": "icu",
  "topic": "Head injury after a motorcycle crash",
  "client": "23-year-old man was admitted to the neuro ICU after a motorcycle crash with a right temporal skull fracture, a brain contusion and a small subdural hematoma",
  "record": [
   {
    "tab": "Admission Notes",
    "at": 0,
    "time": "21:30",
    "text": "A 23-year-old man was admitted to the neuro ICU after a motorcycle crash with a right temporal skull fracture, a brain contusion and a small subdural hematoma. Neurosurgery is managing him without surgery for now. You take over his care at 22:00."
   },
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "21:30",
    "text": "23-year-old male, motorcycle driver, no helmet, struck a car at about 40 mph at 20:10. Brief loss of consciousness at the scene per EMS. ED GCS 14. CT head: nondisplaced right temporal bone fracture, right temporal contusion, 6 mm acute right subdural hematoma, 2 mm midline shift. Neurosurgery: nonoperative management, repeat CT at 04:00 or sooner with any decline. CT cervical spine: no fracture; collar stays on until clinical clearance. Closed left distal radius fracture, splinted. No past medical history, no daily medications, no known allergies. Weight 78 kg (172 lb)."
   },
   {
    "tab": "Laboratory Results",
    "at": 0,
    "time": "21:20",
    "text": "Sodium 140 mEq/L (135 to 145). Potassium 3.9 mEq/L (3.5 to 5). Glucose 148 mg/dL (70 to 99). Serum osmolality 292 mOsm/kg (275 to 295). Hemoglobin 14.1 g/dL (13.5 to 17.5). Platelets 236,000/mm³ (150,000 to 400,000). INR 1.1 (0.8 to 1.1). Blood alcohol 90 mg/dL. Urine drug screen negative."
   },
   {
    "tab": "Orders",
    "at": 0,
    "time": "22:00",
    "text": "Admit to neuro ICU. Neuro checks every hour: GCS, pupils, motor strength. Head of bed 30 degrees, head and neck midline. Cervical collar on. 0.9% sodium chloride at 75 mL/h. Oxygen to keep SpO₂ 94% or higher. Levetiracetam 1,000 mg IV every 12 hours for 7 days. Acetaminophen 1,000 mg IV every 6 hours as needed for pain. Fentanyl 25 mcg IV every hour as needed for severe pain. Seizure precautions. NPO. Nothing in the nose. Notify provider for a GCS drop of 2 or more, any new pupil change, SBP under 110 or over 160, or seizure."
   },
   {
    "tab": "Flowsheet",
    "at": 0,
    "time": "22:00",
    "text": "GCS 13 (E3 V4 M6). Pupils: right 3 mm brisk, left 3 mm brisk. Moves all extremities; strength 5/5 except left wrist in splint."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "22:00",
    "text": "T 37.2 °C (99 °F), HR 92, RR 18, BP 134/78, SpO₂ 98% on 2 L nasal cannula."
   },
   {
    "tab": "Flowsheet",
    "at": 0,
    "time": "00:00",
    "text": "GCS 12 (E3 V3 M6). Pupils: right 3 mm brisk, left 3 mm brisk. Moves all extremities equally."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "00:00",
    "text": "T 37.4 °C (99.3 °F), HR 84, RR 18, BP 142/76, SpO₂ 97% on 2 L nasal cannula."
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "00:00",
    "text": "Reports headache worsening, now 8/10. Vomited once without nausea at 23:40. Harder to rouse; opens eyes to loud voice and answers with random words. Clear, watery drainage from the right ear; on the pillowcase it dries as a blood spot with a yellow ring around it. Bruising behind the right ear. Breath smells of alcohol. Splinted left wrist: fingers warm, capillary refill under 2 seconds. Abrasions on both knees, cleaned and dressed."
   },
   {
    "tab": "Flowsheet",
    "at": 2,
    "time": "02:00",
    "text": "GCS 9 (E2 V2 M5). Pupils: right 5 mm sluggish, left 3 mm brisk. Left arm and leg 4/5; right side 5/5."
   },
   {
    "tab": "Vital Signs",
    "at": 2,
    "time": "02:00",
    "text": "T 37.6 °C (99.7 °F), HR 56, RR 10 and irregular with pauses, BP 178/72, SpO₂ 93% on 2 L nasal cannula."
   },
   {
    "tab": "Nurses' Notes",
    "at": 3,
    "time": "02:05",
    "text": "Provider and neurosurgery notified of GCS 9, right pupil change and vital signs. Intensivist at bedside 02:08. Anesthesia called for intubation. Stat CT head ordered after airway secured."
   },
   {
    "tab": "Vital Signs",
    "at": 3,
    "time": "02:10",
    "text": "HR 58, RR 10 and irregular, BP 176/70, SpO₂ 92% on 2 L nasal cannula; increased to nonrebreather mask, SpO₂ 98%."
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "02:25",
    "text": "Intubated at 02:22 with an orotracheal tube; placement confirmed by end-tidal CO₂ and chest x-ray. Orogastric tube placed. Propofol infusion started for sedation per protocol. Arterial blood gas: PaCO₂ 38 mm Hg, PaO₂ 142 mm Hg."
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "02:30",
    "text": "Mannitol 20% 78 g (1 g/kg) IV over 20 minutes now. Indwelling urinary catheter; hourly urine output. Serum sodium and osmolality every 6 hours; hold repeat mannitol and notify for serum osmolality over 320 mOsm/kg. Ventilator: target PaCO₂ 35 to 40 mm Hg. Continue levetiracetam. CT head when mannitol is infusing."
   },
   {
    "tab": "Vital Signs",
    "at": 4,
    "time": "02:30",
    "text": "T 37.6 °C (99.7 °F), HR 60, RR 16 on ventilator, BP 170/74, SpO₂ 99% on FiO₂ 0.4."
   },
   {
    "tab": "Diagnostic Results",
    "at": 5,
    "time": "03:00",
    "text": "CT head: right subdural hematoma 7 mm (was 6 mm), midline shift 3 mm (was 2 mm), increased edema around the right temporal contusion, no new bleeding. Neurosurgery: continue medical management; repeat CT at 08:00."
   },
   {
    "tab": "Flowsheet",
    "at": 5,
    "time": "04:00",
    "text": "Sedation paused for neuro check: GCS E3 VT M6; opens eyes to voice, squeezes hand on command. Pupils: right 4 mm brisk, left 3 mm brisk. Urine output 02:30 to 04:00: 1,150 mL."
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "04:00",
    "text": "T 38.5 °C (101.3 °F), HR 78, RR 16 on ventilator, BP 138/76, SpO₂ 99% on FiO₂ 0.4."
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "04:00",
    "text": "Sodium 146 mEq/L (135 to 145). Potassium 3.6 mEq/L (3.5 to 5). Serum osmolality 308 mOsm/kg (275 to 295). Glucose 136 mg/dL (70 to 99). PaCO₂ 37 mm Hg."
   }
  ],
  "items": [
   {
    "id": "cs-tbi-1",
    "step": "cues",
    "type": "highlight",
    "q": "Refer to the 00:00 nurse's note. Highlight the findings that require follow-up.",
    "parts": [
     {
      "t": "Reports headache worsening, now 8/10.",
      "ok": true,
      "why": "Yes: a headache that keeps getting worse after a head injury can mean rising intracranial pressure from an expanding bleed or swelling."
     },
     {
      "t": "Vomited once without nausea at 23:40.",
      "ok": true,
      "why": "Yes: vomiting without nausea comes from pressure on the brainstem vomiting center, a classic sign of increasing intracranial pressure."
     },
     {
      "t": "Harder to rouse; opens eyes to loud voice and answers with random words.",
      "ok": true,
      "why": "Yes: level of consciousness is the earliest and most sensitive sign of neurologic decline; his verbal score has dropped from confused to inappropriate words."
     },
     {
      "t": "Clear, watery drainage from the right ear that dries as a blood spot with a yellow ring.",
      "ok": true,
      "why": "Yes: a halo or ring sign suggests cerebrospinal fluid leaking through a skull base fracture, which raises the risk of meningitis."
     },
     {
      "t": "Breath smells of alcohol.",
      "ok": false,
      "why": "No: alcohol may have explained some drowsiness on arrival, but the level falls over time. The trap is blaming worsening consciousness hours later on alcohol."
     },
     {
      "t": "Splinted left wrist: fingers warm, capillary refill under 2 seconds.",
      "ok": false,
      "why": "No: warm fingers with brisk refill show good circulation below the splint; no follow-up is needed."
     },
     {
      "t": "Abrasions on both knees, cleaned and dressed.",
      "ok": false,
      "why": "No: minor abrasions that are already cleaned and covered need routine care only."
     }
    ],
    "why": "After a head injury, any decline in consciousness, a worsening headache or vomiting without nausea suggests rising intracranial pressure. Clear drainage from the ear or nose with a halo suggests a CSF leak from a basilar skull fracture. Alcohol is a dangerous explanation to accept, because it hides a bleed that is growing.",
    "tip": "In neuro items, treat any change in level of consciousness as the most important cue until proven otherwise.",
    "cn": "physio",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-tbi-2",
    "step": "analyze",
    "type": "matrix",
    "q": "For each finding, indicate whether it is consistent with increasing intracranial pressure, a basilar skull fracture with CSF leak, or neither.",
    "cols": [
     "Increasing intracranial pressure",
     "Basilar skull fracture with CSF leak",
     "Neither"
    ],
    "rows": [
     {
      "t": "GCS falling from 13 to 12",
      "ans": 0,
      "why": "rising pressure reduces blood flow to the cortex, so arousal and orientation fail first."
     },
     {
      "t": "Worsening headache with vomiting without nausea",
      "ans": 0,
      "why": "stretching of the dura and pressure on the brainstem vomiting center cause headache and vomiting that does not follow nausea."
     },
     {
      "t": "Clear ear drainage that forms a yellow ring around blood",
      "ans": 1,
      "why": "CSF separates from blood as it spreads on fabric, leaving a halo; it escapes through a torn dura at the skull base."
     },
     {
      "t": "Bruising over the mastoid behind the right ear",
      "ans": 1,
      "why": "Battle sign is blood tracking from a temporal bone fracture at the skull base; it often appears with a CSF leak from the ear."
     },
     {
      "t": "Glucose 148 mg/dL",
      "ans": 2,
      "why": "stress hormones after trauma raise glucose. It is monitored and controlled but does not signal rising pressure or a leak."
     },
     {
      "t": "Blood alcohol 90 mg/dL",
      "ans": 2,
      "why": "alcohol was in his system before the crash and will fall over time; it explains neither the leak nor the neurologic trend."
     }
    ],
    "why": "Two problems are developing at once. Declining consciousness, headache and vomiting point to rising intracranial pressure from the expanding bleed or swelling. The halo sign and Battle sign point to a basilar skull fracture with a CSF leak, which raises the risk of infection rather than pressure.",
    "tip": "Link each finding to the mechanism that produces it; when two problems coexist, sort the cues by cause before choosing a priority.",
    "cn": "physio",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-tbi-3",
    "step": "hypo",
    "type": "cloze",
    "trend": true,
    "stem": "Compare the neuro checks and vital signs at 22:00, 00:00 and 02:00.",
    "q": "Complete the sentences.",
    "parts": [
     "The trend is most consistent with ",
     {
      "opts": [
       "rising intracranial pressure with impending herniation",
       "alcohol intoxication wearing off",
       "a postictal state after an unwitnessed seizure"
      ],
      "ans": 0,
      "whys": [
       "Yes: GCS 13 to 9, a dilating right pupil, left-sided weakness and changing vital signs show a right-sided lesion compressing the brain.",
       "No: as alcohol clears, alertness should improve, not decline; alcohol also does not cause one pupil to dilate.",
       "No: a postictal state improves over minutes to hours and does not produce a fixed one-sided pupil change with Cushing triad."
      ]
     },
     ". The heart rate of 56, a pulse pressure that widened from 56 to 106, and irregular breathing are ",
     {
      "opts": [
       "Cushing triad, a late sign",
       "an early sign of hypovolemic shock",
       "an expected effect of fentanyl"
      ],
      "ans": 0,
      "whys": [
       "Yes: the body raises systolic pressure to push blood into a compressed brain, then reflex bradycardia and brainstem breathing changes follow; herniation is near.",
       "No: hypovolemic shock causes tachycardia and a narrowing pulse pressure, the opposite of this pattern.",
       "No: opioids can slow breathing but do not raise blood pressure or widen the pulse pressure."
      ]
     },
     ". The right pupil change suggests pressure on ",
     {
      "opts": [
       "the right third cranial nerve from the expanding lesion",
       "the left optic nerve",
       "the cervical spinal cord"
      ],
      "ans": 0,
      "whys": [
       "Yes: the oculomotor nerve is compressed on the same side as the lesion as the temporal lobe shifts; a dilated, sluggish pupil is an emergency.",
       "No: the change is on the right, the same side as the bleed; optic nerve injury affects vision, not this pattern.",
       "No: the cervical spine CT was negative, and spinal cord injury does not dilate one pupil."
      ]
     },
     "."
    ],
    "why": "A falling GCS is the earliest sign; pupil changes and Cushing triad are late. Hypertension with a widening pulse pressure, bradycardia and irregular respirations mean the brainstem is being compressed. The pupil on the side of the lesion dilates first, so this client needs emergency treatment now.",
    "tip": "On neuro trend items, order the cues from early to late: consciousness first, then pupils and motor, then Cushing triad.",
    "cn": "physio"
   },
   {
    "id": "cs-tbi-4",
    "step": "solve",
    "type": "sata",
    "q": "Which interventions should the nurse include in the plan to prevent further increases in intracranial pressure? Select all that apply.",
    "opts": [
     {
      "t": "Keep the head of the bed at 30 degrees with the head and neck midline and the collar not pressing on the neck veins",
      "ok": true,
      "why": "Yes: elevation and a straight neck let venous blood drain from the brain; a tight collar or a turned head blocks the jugular veins and raises pressure."
     },
     {
      "t": "Keep systolic BP at 110 mm Hg or higher and report any hypotension",
      "ok": true,
      "why": "Yes: cerebral perfusion pressure is mean arterial pressure minus intracranial pressure, so even one episode of hypotension starves the injured brain."
     },
     {
      "t": "Keep oxygenation adequate and carbon dioxide in the normal range after intubation",
      "ok": true,
      "why": "Yes: hypoxia worsens secondary brain injury, and high carbon dioxide dilates cerebral vessels and raises intracranial pressure."
     },
     {
      "t": "Space out nursing care and keep the room quiet with low light",
      "ok": true,
      "why": "Yes: repositioning, suctioning and noise each raise intracranial pressure briefly; spacing them out prevents stacked spikes."
     },
     {
      "t": "Place the client in Trendelenburg position because of the low heart rate",
      "ok": false,
      "why": "No: head-down positioning blocks venous drainage from the brain and raises intracranial pressure. The bradycardia here comes from brain compression."
     },
     {
      "t": "Hyperventilate to a PaCO₂ of 25 mm Hg for the rest of the night",
      "ok": false,
      "why": "No: prolonged deep hyperventilation constricts cerebral vessels so much that it causes ischemia; it is used only briefly as a bridge to definitive treatment."
     },
     {
      "t": "Insert a nasogastric tube to empty the stomach before intubation",
      "ok": false,
      "why": "No: with a basilar skull fracture, a nasal tube can pass through the fracture into the brain; gastric tubes are placed through the mouth."
     },
     {
      "t": "Change the IV fluid to 5% dextrose in water",
      "ok": false,
      "why": "No: once the dextrose is used, free water moves into brain cells and worsens edema; isotonic or hypertonic fluids are used."
     }
    ],
    "why": "Secondary brain injury comes from low pressure, low oxygen, high carbon dioxide, poor venous drainage and stimulation. The plan keeps the head up and midline, protects blood pressure and oxygenation, and minimizes stimulation. Nasal tubes are avoided with a basilar skull fracture.",
    "tip": "For intracranial pressure items, check each option against venous drainage, perfusion pressure, oxygen and carbon dioxide; anything that worsens one of them is a distractor.",
    "cn": "physio",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-tbi-5",
    "step": "act",
    "type": "matrix",
    "q": "For each nursing action, indicate whether it is appropriate or inappropriate at this time.",
    "cols": [
     "Appropriate",
     "Inappropriate"
    ],
    "rows": [
     {
      "t": "Give the mannitol through IV tubing with an in-line filter",
      "ans": 0,
      "why": "mannitol 20% can form crystals, so it is given through a filter to keep crystals out of the bloodstream."
     },
     {
      "t": "Insert the indwelling catheter and measure urine output every hour",
      "ans": 0,
      "why": "mannitol causes a brisk osmotic diuresis; hourly output tracks its effect and warns of hypovolemia that could lower his blood pressure."
     },
     {
      "t": "Suction the endotracheal tube every hour for 30 seconds",
      "ans": 1,
      "why": "suctioning raises intracranial pressure; suction only when needed, for no more than 10 seconds, after preoxygenating."
     },
     {
      "t": "Pack the right ear canal with gauze to stop the drainage",
      "ans": 1,
      "why": "blocking the leak traps fluid and bacteria at the fracture and raises meningitis risk; a loose sterile pad over the ear is used instead."
     },
     {
      "t": "Pad the side rails and keep oxygen and suction ready at the bedside",
      "ans": 0,
      "why": "seizures are common after a contusion and sharply raise intracranial pressure; precautions limit injury and prepare for airway support."
     },
     {
      "t": "Hold the levetiracetam dose until the CT is done",
      "ans": 1,
      "why": "seizures increase brain metabolism and pressure, so the anticonvulsant is given on schedule; a scan is not a reason to miss it."
     }
    ],
    "why": "Osmotic therapy pulls water out of the brain, so the nurse gives it safely and tracks urine output and osmolality. Care is organized to avoid pressure spikes from suctioning and seizures. The CSF leak is left to drain onto a loose sterile dressing, never packed.",
    "tip": "For each action, ask whether it lowers or raises intracranial pressure, or adds infection risk; reject any that raises either.",
    "cn": "physio",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-tbi-6",
    "step": "eval",
    "type": "sata",
    "q": "Which findings indicate that the interventions to lower intracranial pressure have been effective? Select all that apply.",
    "opts": [
     {
      "t": "Heart rate 78, up from 56",
      "ok": true,
      "why": "Yes: the reflex bradycardia of Cushing triad has resolved, showing less pressure on the brainstem."
     },
     {
      "t": "BP 138/76, with the pulse pressure narrowing from 106 to 62",
      "ok": true,
      "why": "Yes: the body no longer has to drive systolic pressure up to perfuse the brain, a sign intracranial pressure has fallen."
     },
     {
      "t": "Right pupil 4 mm and brisk, was 5 mm and sluggish",
      "ok": true,
      "why": "Yes: less compression of the third cranial nerve lets the pupil react again; this is a key sign herniation has been reversed."
     },
     {
      "t": "Opens eyes to voice and squeezes hand on command during the sedation pause",
      "ok": true,
      "why": "Yes: following commands is the best motor score and shows the cortex is perfused, an improvement over localizing to pain."
     },
     {
      "t": "Urine output 1,150 mL over 90 minutes",
      "ok": false,
      "why": "No: brisk diuresis shows mannitol is acting as an osmotic diuretic, not that intracranial pressure fell; it also raises the risk of hypovolemia and hypotension."
     },
     {
      "t": "Serum osmolality 308 mOsm/kg",
      "ok": false,
      "why": "No: this confirms the drug's osmotic effect and that a repeat dose is still allowed (under 320), but it is a safety check, not a treatment outcome."
     },
     {
      "t": "Temperature 38.5 °C (101.3 °F)",
      "ok": false,
      "why": "No: fever raises brain metabolism and intracranial pressure. It needs prompt treatment and a search for a cause, such as meningitis from the CSF leak."
     }
    ],
    "why": "Effectiveness is judged by the brain's response: a better GCS, a reactive pupil and resolution of Cushing triad. Diuresis and a higher osmolality show the drug is acting, not that the brain improved. The new fever must be treated quickly, because it raises intracranial pressure and may signal infection from the CSF leak.",
    "tip": "Separate signs that a drug is acting from signs that the client's problem is improving; only the second answers an evaluate item.",
    "cn": "physio",
    "stem": "Refer to the chart."
   }
  ],
  "sys": "neuro"
 },
 {
  "id": "cs-abruption",
  "title": "Placental abruption at 34 weeks",
  "sp": "ob",
  "topic": "Placental abruption at 34 weeks",
  "client": "31-year-old G2P1 at 34 weeks 2 days with chronic hypertension arrives at labor and delivery triage at 06:40 with sudden abdominal pain and vaginal bleeding",
  "record": [
   {
    "tab": "Admission Notes",
    "at": 0,
    "time": "",
    "text": "A 31-year-old G2P1 at 34 weeks 2 days with chronic hypertension arrives at labor and delivery triage at 06:40 with sudden abdominal pain and vaginal bleeding. Her partner is with her. You are the triage nurse."
   },
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "",
    "text": "G2P10:01 at 34 weeks 2 days by first-trimester ultrasound. Chronic hypertension diagnosed 4 years ago; takes labetalol 200 mg PO twice daily, last dose at 20:00 last night. Prior term vaginal birth 3 years ago. 20-week anatomy ultrasound: posterior fundal placenta, well clear of the cervix. Blood type O negative; received Rh immune globulin 300 mcg at 28 weeks. Nonsmoker, denies substance use. Weight 82 kg (180 lb). No known drug allergies."
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "06:45",
    "text": "Reports sudden, constant abdominal pain that began at 06:00, rated 8/10, 'worse than labor with my first.' Dark red vaginal bleeding; pad saturated in about 1 hour. Uterus firm and tender, does not relax between contractions. Felt the baby move at 05:00, less since. Denies leakage of clear fluid. Denies trauma or falls. Mild ankle edema, present for 2 weeks. Skin pale and cool."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "06:45",
    "text": "T 37 °C (98.6 °F), HR 112, RR 22, BP 158/98, SpO₂ 98% on room air"
   },
   {
    "tab": "Flowsheet",
    "at": 0,
    "time": "06:50",
    "text": "Electronic fetal monitoring: FHR baseline 160, minimal variability (amplitude 5 bpm or less), no accelerations, late decelerations with each contraction. Contractions every 2 minutes, lasting 40 to 60 seconds. Elevated resting tone between contractions on palpation."
   },
   {
    "tab": "Orders",
    "at": 0,
    "time": "06:50",
    "text": "Continuous electronic fetal monitoring. Vital signs every 15 minutes. Insert 18-gauge IV; lactated Ringer's at 125 mL/h. CBC, type and screen. Obstetrician to bedside for ultrasound."
   },
   {
    "tab": "Laboratory Results",
    "at": 3,
    "time": "07:15",
    "text": "Hemoglobin 9.4 g/dL (11 to 15). Hematocrit 28% (33 to 44). Platelets 96,000/mm³ (150,000 to 400,000). Fibrinogen 180 mg/dL (300 to 600 in late pregnancy). PT 14.8 seconds (11 to 13.5). INR 1.3 (0.8 to 1.1). aPTT 38 seconds (25 to 35). Blood type O negative, antibody screen negative."
   },
   {
    "tab": "Diagnostic Results",
    "at": 3,
    "time": "07:20",
    "text": "Bedside ultrasound: single fetus, cephalic. Placenta fundal and posterior; no previa. Hypoechoic area behind the placenta consistent with retroplacental clot."
   },
   {
    "tab": "Nurses' Notes",
    "at": 3,
    "time": "07:22",
    "text": "Obstetrician at bedside; diagnosis of placental abruption discussed with the client and partner. Bleeding continues. Plan for cesarean birth."
   },
   {
    "tab": "Vital Signs",
    "at": 4,
    "time": "07:25",
    "text": "HR 124, RR 24, BP 132/84, SpO₂ 97% on room air"
   },
   {
    "tab": "Flowsheet",
    "at": 4,
    "time": "07:25",
    "text": "FHR baseline 165, minimal variability, late decelerations with every contraction, now deeper with a slower return to baseline. Client lying supine since the ultrasound."
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "07:26",
    "text": "Lactated Ringer's 500 mL IV bolus. Insert a second 18-gauge IV. NPO. Emergency cesarean, OR 2. Anesthesia notified."
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "09:15",
    "text": "Emergency cesarean birth at 07:48 under general anesthesia. Large retroplacental clot; about 40% of the placenta separated. Male newborn, 2,250 g, Apgar scores 4 and 7, admitted to the NICU; newborn blood type A positive. Estimated blood loss 1,400 mL. Received 2 units packed red blood cells and 10 units cryoprecipitate in the OR."
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "09:30",
    "text": "T 36.8 °C (98.2 °F), HR 96, RR 18, BP 136/86, SpO₂ 98% on 2 L nasal cannula"
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "09:30",
    "text": "Hemoglobin 9.6 g/dL (9.4 at 07:15). Platelets 88,000/mm³ (96,000 at 07:15). Fibrinogen 260 mg/dL (180 at 07:15). INR 1.1 (1.3 at 07:15). Kleihauer-Betke: estimated fetal whole blood 18 mL."
   },
   {
    "tab": "Flowsheet",
    "at": 5,
    "time": "10:00",
    "text": "Fundus firm, midline, 1 cm below the umbilicus. Lochia rubra, moderate. Abdominal dressing dry. Urine output 50 mL/h for the last 2 hours. New oozing of blood around the IV site in the left hand."
   }
  ],
  "items": [
   {
    "id": "cs-abruption-1",
    "step": "cues",
    "type": "highlight",
    "q": "Highlight the findings in the 06:45 nurses' note that require immediate follow-up.",
    "parts": [
     {
      "t": "Reports sudden, constant abdominal pain that began at 06:00, rated 8/10.",
      "ok": true,
      "why": "Yes: sudden, constant pain with bleeding in the third trimester is the classic presentation of placental separation and needs immediate evaluation."
     },
     {
      "t": "Dark red vaginal bleeding; pad saturated in about 1 hour.",
      "ok": true,
      "why": "Yes: dark blood suggests bleeding that pooled behind the placenta first, and visible loss can underestimate total loss because some stays concealed in the uterus."
     },
     {
      "t": "Uterus firm and tender, does not relax between contractions.",
      "ok": true,
      "why": "Yes: a rigid, board-like uterus with high resting tone suggests blood in the uterine muscle and cuts placental blood flow between contractions."
     },
     {
      "t": "Felt the baby move at 05:00, less since.",
      "ok": true,
      "why": "Yes: decreased fetal movement with bleeding and a rigid uterus suggests fetal compromise and matches the abnormal tracing."
     },
     {
      "t": "Denies leakage of clear fluid.",
      "ok": false,
      "why": "No: this lowers concern for ruptured membranes. It is a pertinent negative, useful history, but not a finding the nurse must act on."
     },
     {
      "t": "Denies trauma or falls.",
      "ok": false,
      "why": "No: trauma is a cause of abruption, so its absence is worth documenting, but it does not change what the nurse does next."
     },
     {
      "t": "Mild ankle edema, present for 2 weeks.",
      "ok": false,
      "why": "No: dependent edema is common late in pregnancy. The trap is chasing a stable, expected finding while the uterus and fetus are in trouble."
     },
     {
      "t": "Skin pale and cool.",
      "ok": true,
      "why": "Yes: pale, cool skin with HR 112 signals compensation for blood loss. Her chronic hypertension can make the BP look falsely reassuring."
     }
    ],
    "why": "Painful dark bleeding, a rigid tender uterus, less fetal movement and signs of compensation for blood loss point to placental separation in a client with a major risk factor. The pertinent negatives and her chronic ankle edema do not change the priority. Chronic hypertension can mask volume loss, so trust the heart rate and skin.",
    "tip": "In third-trimester bleeding, flag every finding about pain, uterine tone, fetal status and perfusion before anything else.",
    "cn": "health",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-abruption-2",
    "step": "analyze",
    "type": "matrix",
    "stem": "Her partner asks whether this is the same as a friend's placenta previa.",
    "q": "For each finding, indicate whether it is more consistent with placental abruption or placenta previa.",
    "cols": [
     "Placental abruption",
     "Placenta previa"
    ],
    "rows": [
     {
      "t": "Bleeding with constant abdominal pain",
      "ans": 0,
      "why": "abruption hurts because blood collects behind the separating placenta and irritates the uterine muscle; previa bleeding is classically painless."
     },
     {
      "t": "Bright red bleeding with no pain or uterine tenderness",
      "ans": 1,
      "why": "previa bleeds when the lower uterine segment stretches over a placenta covering the os, so the blood is bright red and the uterus stays soft."
     },
     {
      "t": "Rigid, board-like uterus with high resting tone",
      "ans": 0,
      "why": "blood seeping into the myometrium makes the uterus firm and tender. The trap is calling it a strong contraction when it never relaxes."
     },
     {
      "t": "Soft, relaxed uterus between episodes of bleeding",
      "ans": 1,
      "why": "with previa the uterine muscle is not irritated, so resting tone is normal and the fetal tracing is often reassuring at first."
     },
     {
      "t": "Late decelerations with minimal variability early in the presentation",
      "ans": 0,
      "why": "loss of attached placental surface cuts oxygen delivery to the fetus, so fetal compromise appears early in abruption."
     },
     {
      "t": "Chronic hypertension as the main risk factor",
      "ans": 0,
      "why": "hypertension damages the decidual vessels and is a leading risk factor for abruption, along with cocaine use, smoking and abdominal trauma."
     }
    ],
    "why": "Pain and uterine tone separate the two. Abruption hurts, the uterus is rigid, the blood is often dark, and the fetus is stressed early. Previa is painless, bright red bleeding from a soft uterus, with risk factors such as prior cesarean birth. Her anatomy scan placed the placenta well away from the cervix.",
    "tip": "Sort third-trimester bleeding with two questions: does it hurt, and is the uterus soft or hard?",
    "cn": "health"
   },
   {
    "id": "cs-abruption-3",
    "step": "hypo",
    "type": "cloze",
    "q": "Complete the sentences.",
    "parts": [
     "The client is most likely experiencing ",
     {
      "opts": [
       "placental abruption",
       "placenta previa",
       "preterm labor with bloody show"
      ],
      "ans": 0,
      "whys": [
       "Yes: painful dark bleeding, a rigid uterus, fetal compromise and chronic hypertension fit early separation of a normally placed placenta.",
       "No: previa causes painless bright red bleeding with a soft uterus, and her anatomy scan showed a fundal placenta.",
       "No: bloody show is scant, pink and mucus-like; it does not cause a board-like uterus or a pad saturated in an hour."
      ]
     },
     ". The fetal heart rate pattern reflects ",
     {
      "opts": [
       "uteroplacental insufficiency",
       "fetal head compression",
       "a normal response to contractions"
      ],
      "ans": 0,
      "whys": [
       "Yes: late decelerations with minimal variability mean the fetus is not getting enough oxygen across a placenta that is partly detached.",
       "No: head compression causes early decelerations that mirror contractions and are benign. The trap is confusing early with late timing.",
       "No: minimal variability with recurrent late decelerations is an abnormal category II pattern that calls for intrauterine resuscitation and prompt evaluation."
      ]
     },
     ". The maternal complication the nurse should monitor for most closely is ",
     {
      "opts": [
       "disseminated intravascular coagulation",
       "chorioamnionitis",
       "uterine inversion"
      ],
      "ans": 0,
      "whys": [
       "Yes: the retroplacental clot consumes fibrinogen and releases tissue factor into her circulation, making abruption a leading obstetric cause of DIC.",
       "No: chorioamnionitis follows prolonged rupture of membranes with fever; she is afebrile and her membranes are intact.",
       "No: uterine inversion is a third-stage complication of traction on the cord, not a risk before birth."
      ]
     },
     "."
    ],
    "why": "Her presentation is placental abruption. The partly detached placenta cannot fully oxygenate the fetus, which shows as late decelerations with lost variability. For the mother, the danger is hemorrhage and consumptive coagulopathy, so clotting labs are watched closely.",
    "tip": "Name the condition first, then ask what it threatens for each patient: the fetus and the mother.",
    "cn": "health",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-abruption-4",
    "step": "solve",
    "type": "sata",
    "q": "Which orders should the nurse anticipate for this client? Select all that apply.",
    "opts": [
     {
      "t": "Type and crossmatch 2 units of packed red blood cells",
      "ok": true,
      "why": "Yes: her hemoglobin has dropped to 9.4 g/dL with ongoing bleeding and surgery ahead, so blood must be ready before it is needed."
     },
     {
      "t": "Prepare the client for cesarean birth",
      "ok": true,
      "why": "Yes: late decelerations with minimal variability plus early coagulopathy make prompt surgical birth the definitive treatment at 34 weeks."
     },
     {
      "t": "Repeat fibrinogen, platelets and coagulation studies",
      "ok": true,
      "why": "Yes: a fibrinogen of 180 mg/dL is low for pregnancy, and falling values signal developing DIC that may need cryoprecipitate or plasma."
     },
     {
      "t": "Insert an indwelling urinary catheter and measure output hourly",
      "ok": true,
      "why": "Yes: urine output is a sensitive marker of perfusion during hemorrhage, and the bladder must be drained before cesarean birth."
     },
     {
      "t": "Send a Kleihauer-Betke test",
      "ok": true,
      "why": "Yes: she is Rh negative and fetal blood may have entered her circulation; the test measures how much, which sets the Rh immune globulin dose."
     },
     {
      "t": "Give terbutaline 0.25 mg subcutaneously to slow the contractions",
      "ok": false,
      "why": "No: tocolysis is contraindicated in abruption with fetal compromise. Relaxing the uterus does not stop the separation and delays a needed birth."
     },
     {
      "t": "Avoid all vaginal exams for the rest of the pregnancy because of the bleeding",
      "ok": false,
      "why": "No: that rule belongs to placenta previa, where a digital exam can tear the placenta. Ultrasound has already ruled out previa here."
     },
     {
      "t": "Encourage clear oral fluids to replace lost volume",
      "ok": false,
      "why": "No: she is going to surgery and stays NPO. Volume is replaced with IV fluids and blood products, not oral intake."
     }
    ],
    "why": "Abruption with fetal compromise and early coagulopathy calls for blood on hand, serial clotting labs, urine output monitoring and prompt cesarean birth. Because she is Rh negative, the Kleihauer-Betke test guides her Rh immune globulin dose. Tocolysis is contraindicated, and the no-vaginal-exam rule applies to previa, which ultrasound excluded.",
    "tip": "When a diagnosis threatens both mother and fetus, choose options that prepare for hemorrhage and birth, and reject any that delay delivery.",
    "cn": "health",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-abruption-5",
    "step": "act",
    "type": "matrix",
    "q": "For each nursing action, indicate whether the nurse should do it now or should not do it.",
    "cols": [
     "Do now",
     "Do not do"
    ],
    "rows": [
     {
      "t": "Turn the client onto her left side",
      "ans": 0,
      "why": "lateral positioning lifts the uterus off the vena cava and aorta, improving venous return and placental blood flow; she has been supine since the ultrasound."
     },
     {
      "t": "Start the lactated Ringer's bolus and insert the second large-bore IV",
      "ans": 0,
      "why": "volume supports maternal perfusion and placental flow, and a second line is needed for blood products during surgery."
     },
     {
      "t": "Report the tracing, the BP change and the lab results to the obstetrician using SBAR",
      "ans": 0,
      "why": "a BP drop from 158/98 to 132/84 with HR 124 signals hypovolemia hidden by her hypertension, and the team needs this before surgery."
     },
     {
      "t": "Give the scheduled labetalol 200 mg PO with a sip of water",
      "ans": 1,
      "why": "she is NPO for surgery and her BP is falling as she bleeds. A beta blocker would also blunt the tachycardia that is compensating for blood loss."
     },
     {
      "t": "Place her flat on her back with her legs elevated",
      "ans": 1,
      "why": "the supine position compresses the vena cava and worsens fetal oxygenation. The trap is applying a general shock position to a pregnant client."
     },
     {
      "t": "Delay transfer to the OR until the Kleihauer-Betke result returns",
      "ans": 1,
      "why": "the test guides Rh immune globulin dosing after birth; it never delays an emergency cesarean for fetal compromise."
     }
    ],
    "why": "Intrauterine resuscitation means lateral positioning, IV fluid and fixing the cause, which here only birth can do. Her BP looks normal but is 26 points below her baseline with a rising heart rate, so she is losing volume. Hold oral medications she cannot take and that would mask compensation.",
    "tip": "For a pregnant client in distress, think left side, fluids, report and prepare for birth; avoid anything that puts her flat on her back or delays surgery.",
    "cn": "health",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-abruption-6",
    "step": "eval",
    "type": "sata",
    "trend": true,
    "q": "Which findings indicate that the client's condition is improving? Select all that apply.",
    "opts": [
     {
      "t": "Heart rate 96, down from 124 before surgery",
      "ok": true,
      "why": "Yes: a falling heart rate shows less need to compensate for blood loss now that the bleeding source is removed and blood has been replaced."
     },
     {
      "t": "Fibrinogen 260 mg/dL, up from 180 mg/dL",
      "ok": true,
      "why": "Yes: rising fibrinogen after cryoprecipitate shows clotting factors are being restored and consumption slowed once the placenta was delivered."
     },
     {
      "t": "INR 1.1, down from 1.3",
      "ok": true,
      "why": "Yes: a normalizing INR means clotting function is recovering, which lowers the risk of ongoing uterine and incisional bleeding."
     },
     {
      "t": "Fundus firm, midline, 1 cm below the umbilicus with moderate lochia",
      "ok": true,
      "why": "Yes: a firm, midline fundus with moderate flow means the uterus is contracting well and is not a source of new hemorrhage."
     },
     {
      "t": "Urine output 50 mL/h for 2 hours",
      "ok": true,
      "why": "Yes: output above 30 mL/h shows the kidneys are perfused, a key sign that circulating volume has been restored."
     },
     {
      "t": "Platelets 88,000/mm³, down from 96,000/mm³",
      "ok": false,
      "why": "No: the platelet count is still falling from dilution and consumption. It needs follow-up and repeat testing, not reassurance."
     },
     {
      "t": "New oozing of blood around the IV site in the left hand",
      "ok": false,
      "why": "No: bleeding from puncture sites can signal ongoing DIC and must be reported even when other clotting tests are improving."
     }
    ],
    "why": "Delivering the placenta removes the source of clotting factor consumption, and transfusion restores volume and fibrinogen. Her heart rate, urine output, fundus and clotting tests are moving the right way, but falling platelets and new oozing need follow-up. Because she is Rh negative and the newborn is Rh positive, she needs Rh immune globulin within 72 hours, dosed by the Kleihauer-Betke result.",
    "tip": "In a trend item, compare each value with its earlier value and ask whether it moved toward normal or away from it.",
    "cn": "health",
    "stem": "Refer to the chart."
   }
  ],
  "sys": "maternal"
 },
 {
  "id": "cs-preterm",
  "title": "Preterm labor at 31 weeks",
  "sp": "ob",
  "topic": "Preterm labor at 31 weeks",
  "client": "24-year-old G1P0 at 31 weeks 1 day arrives at labor and delivery triage at 07:30 with cramping and low back pain that started last night",
  "record": [
   {
    "tab": "Admission Notes",
    "at": 0,
    "time": "",
    "text": "A 24-year-old G1P0 at 31 weeks 1 day arrives at labor and delivery triage at 07:30 with cramping and low back pain that started last night. She drove herself in from work. You are the triage nurse."
   },
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "",
    "text": "G1P0 at 31 weeks 1 day by first-trimester ultrasound. Uncomplicated pregnancy to date. No chronic illness. Group B strep status unknown; culture planned at 36 to 37 weeks. Blood type A positive, rubella immune. Takes a prenatal vitamin daily. No known drug allergies. Weight 64 kg (141 lb). Works as a restaurant server, on her feet for 10-hour shifts."
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "07:40",
    "text": "Reports dull low back ache since last night that comes and goes, and menstrual-like cramping. Feels pelvic pressure, 'like the baby is pushing down.' Increase in watery, mucus-like vaginal discharge since yesterday. Burning with urination for 3 days. Denies a gush of fluid or vaginal bleeding. Fetal movement active. Fetal fibronectin swab collected before any vaginal exam; no intercourse in the past 48 hours."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "07:40",
    "text": "T 37.1 °C (98.8 °F), HR 92, RR 18, BP 118/72, SpO₂ 99% on room air"
   },
   {
    "tab": "Flowsheet",
    "at": 0,
    "time": "07:45",
    "text": "FHR baseline 140, moderate variability, accelerations present, no decelerations. Contractions every 5 to 7 minutes, lasting 30 to 45 seconds, mild to moderate by palpation."
   },
   {
    "tab": "Orders",
    "at": 0,
    "time": "07:45",
    "text": "Continuous electronic fetal monitoring. Sterile speculum exam, then cervical exam by provider. Fetal fibronectin. Transvaginal cervical length. Urinalysis with culture. CBC."
   },
   {
    "tab": "Flowsheet",
    "at": 1,
    "time": "08:15",
    "text": "Sterile speculum exam: no pooling, nitrazine negative, no ferning. Cervix 2 cm dilated, 60% effaced, station minus 2."
   },
   {
    "tab": "Diagnostic Results",
    "at": 1,
    "time": "08:30",
    "text": "Transvaginal cervical length 18 mm (expected at this gestation: 30 mm or more)."
   },
   {
    "tab": "Laboratory Results",
    "at": 1,
    "time": "09:00",
    "text": "Fetal fibronectin positive. Urinalysis: nitrite positive, leukocyte esterase positive, WBC 25/hpf (0 to 5); culture pending. CBC: WBC 10,800/mm³ (5,000 to 15,000 in pregnancy), hemoglobin 11.6 g/dL (11 to 15), platelets 232,000/mm³ (150,000 to 400,000)."
   },
   {
    "tab": "Flowsheet",
    "at": 1,
    "time": "10:00",
    "text": "Cervix 3 cm dilated, 80% effaced, station minus 1. Contractions every 4 to 5 minutes. FHR baseline 140, moderate variability, accelerations present."
   },
   {
    "tab": "Orders",
    "at": 3,
    "time": "10:15",
    "text": "Admit to labor and delivery. Betamethasone 12 mg IM now; repeat once in 24 hours. Magnesium sulfate 4 g IV over 20 minutes, then 1 g/h for fetal neuroprotection, maximum 24 hours. Nifedipine 20 mg PO now, then 10 mg PO every 6 hours for 48 hours; hold for SBP under 90. Rectovaginal group B strep culture, then penicillin G 5 million units IV, then 2.5 million units IV every 4 hours. Cephalexin 500 mg PO every 6 hours. Lactated Ringer's at 75 mL/h; total IV intake not to exceed 125 mL/h. Strict intake and output."
   },
   {
    "tab": "Medication Administration Record",
    "at": 4,
    "time": "10:30",
    "text": "Betamethasone 12 mg IM given 10:20, right ventrogluteal; next dose due 10:20 tomorrow. Group B strep culture collected 10:22. Penicillin G 5 million units IV given 10:25. Magnesium sulfate 4 g IV load started 10:30, then 1 g/h. Nifedipine 20 mg PO given 10:30; next dose due 16:30."
   },
   {
    "tab": "Vital Signs",
    "at": 4,
    "time": "11:00",
    "text": "T 37 °C (98.6 °F), HR 118, RR 18, BP 86/50, SpO₂ 98% on room air"
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "11:00",
    "text": "Client reports feeling warm, flushed and lightheaded, with a mild headache. Lying supine. Patellar reflexes 2+. Alert and oriented. Contractions every 6 to 8 minutes. FHR baseline 145, moderate variability."
   },
   {
    "tab": "Flowsheet",
    "at": 5,
    "time": "18:00",
    "text": "Magnesium checks. 14:00: RR 18, patellar reflexes 2+, alert, urine output 45 mL/h. 16:00: RR 14, reflexes 1+, drowsy but easy to rouse, urine output 25 mL/h. 18:00: RR 11, reflexes absent, difficult to rouse, urine output 15 mL/h. Contractions 1 to 2 per hour since 16:00. FHR baseline 140, minimal to moderate variability."
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "18:00",
    "text": "T 37 °C (98.6 °F), HR 96, RR 11, BP 108/64, SpO₂ 93% on room air"
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "18:05",
    "text": "Serum magnesium 9.6 mg/dL (target for this protocol 4 to 7). Creatinine 1.2 mg/dL (0.4 to 0.8 in pregnancy)."
   }
  ],
  "items": [
   {
    "id": "cs-preterm-1",
    "step": "cues",
    "type": "highlight",
    "q": "Highlight the findings in the 07:40 nurses' note that require follow-up.",
    "parts": [
     {
      "t": "Reports dull low back ache since last night that comes and goes,",
      "ok": true,
      "why": "Yes: an intermittent low back ache is a common, easily dismissed sign of preterm contractions, especially in a first pregnancy."
     },
     {
      "t": "and menstrual-like cramping.",
      "ok": true,
      "why": "Yes: period-like cramping at 31 weeks can be uterine contractions that are changing the cervix, so it must be assessed."
     },
     {
      "t": "Feels pelvic pressure, 'like the baby is pushing down.'",
      "ok": true,
      "why": "Yes: pelvic pressure suggests the presenting part is descending or the cervix is changing, both signs of preterm labor."
     },
     {
      "t": "Increase in watery, mucus-like vaginal discharge since yesterday.",
      "ok": true,
      "why": "Yes: a change in discharge can reflect cervical change or ruptured membranes, so it needs a sterile speculum exam and testing."
     },
     {
      "t": "Burning with urination for 3 days.",
      "ok": true,
      "why": "Yes: a urinary tract infection is a known trigger for preterm contractions and needs a urinalysis, culture and treatment."
     },
     {
      "t": "Denies a gush of fluid or vaginal bleeding.",
      "ok": false,
      "why": "No: this pertinent negative lowers concern for ruptured membranes or abruption. It is useful history, not a finding to act on."
     },
     {
      "t": "Fetal movement active.",
      "ok": false,
      "why": "No: active fetal movement is reassuring for fetal well-being and needs no follow-up right now."
     },
     {
      "t": "Fetal fibronectin swab collected before any vaginal exam.",
      "ok": false,
      "why": "No: collecting the swab before a digital exam or lubricant is correct technique, so the result will be valid. Nothing needs correcting."
     }
    ],
    "why": "Preterm labor often starts quietly: back ache, cramping, pressure and a change in discharge. Each needs follow-up at 31 weeks, and so do urinary symptoms because infection can trigger contractions. Correct specimen technique and reassuring negatives do not.",
    "tip": "Before 37 weeks, treat any symptom that sounds like mild labor as possible preterm labor until the cervix says otherwise.",
    "cn": "pharm",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-preterm-2",
    "step": "analyze",
    "type": "matrix",
    "q": "For each finding, indicate whether it supports a diagnosis of preterm labor or its cause, or is reassuring.",
    "cols": [
     "Supports preterm labor or its cause",
     "Reassuring"
    ],
    "rows": [
     {
      "t": "Cervix 2 cm and 60% effaced at 08:15, then 3 cm and 80% effaced at 10:00",
      "ans": 0,
      "why": "documented cervical change with regular contractions is the defining finding of preterm labor; contractions alone are not enough to make the diagnosis."
     },
     {
      "t": "Positive fetal fibronectin",
      "ans": 0,
      "why": "fibronectin leaking past the membranes signals disruption at the placental interface. A negative result is the more useful one because it makes birth within 14 days unlikely."
     },
     {
      "t": "Cervical length 18 mm",
      "ans": 0,
      "why": "a cervix shorter than 25 mm before 34 weeks greatly raises the risk of preterm birth."
     },
     {
      "t": "Urinalysis positive for nitrite and leukocyte esterase",
      "ans": 0,
      "why": "these suggest a urinary tract infection, which releases inflammatory mediators that can trigger contractions."
     },
     {
      "t": "Nitrazine negative, no ferning and no pooling",
      "ans": 1,
      "why": "these show the membranes are intact, so this is preterm labor without prelabor rupture, which changes antibiotic and delivery planning."
     },
     {
      "t": "FHR baseline 140 with moderate variability and accelerations",
      "ans": 1,
      "why": "a category I tracing means the fetus is well oxygenated now, so there is time to give corticosteroids and magnesium."
     }
    ],
    "why": "Preterm labor is regular contractions with cervical change before 37 weeks, and she has both. The short cervix and positive fibronectin add risk, and the urinary infection is a likely trigger. Intact membranes and a category I tracing are reassuring and buy time for treatment.",
    "tip": "Find the one finding that defines the diagnosis, here cervical change, then sort the rest into risk, cause and reassurance.",
    "cn": "pharm",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-preterm-3",
    "step": "hypo",
    "type": "cloze",
    "q": "Complete the sentences.",
    "parts": [
     "The client's most likely problem is ",
     {
      "opts": [
       "preterm labor",
       "Braxton Hicks contractions",
       "preterm prelabor rupture of membranes"
      ],
      "ans": 0,
      "whys": [
       "Yes: regular contractions with cervical change from 2 cm to 3 cm before 37 weeks meet the definition of preterm labor.",
       "No: Braxton Hicks contractions are irregular and do not change the cervix; hers changed within 2 hours.",
       "No: nitrazine, ferning and pooling are all negative, so her membranes are intact."
      ]
     },
     ". Because she is less than 32 weeks, the priority goal of care is to ",
     {
      "opts": [
       "give antenatal corticosteroids and magnesium sulfate before birth",
       "stop labor until she reaches 37 weeks",
       "induce birth before the infection worsens"
      ],
      "ans": 0,
      "whys": [
       "Yes: corticosteroids reduce newborn respiratory distress and brain bleeding, and magnesium before 32 weeks lowers the risk of cerebral palsy.",
       "No: no medication reliably stops preterm labor for weeks. The trap is expecting tocolysis to carry the pregnancy to term.",
       "No: a urinary tract infection is treated with antibiotics; it is not a reason to deliver a 31-week fetus with a reassuring tracing."
      ]
     },
     ". Tocolytic medication is used to delay birth for about ",
     {
      "opts": [
       "48 hours",
       "2 weeks",
       "4 weeks"
      ],
      "ans": 0,
      "whys": [
       "Yes: short-term tocolysis buys about 48 hours so the corticosteroid course can be completed and the client transferred if needed.",
       "No: tocolytics have not been shown to improve newborn outcomes beyond 48 hours, and longer use adds maternal risk.",
       "No: maintenance tocolysis for weeks is not recommended; it does not prevent preterm birth and exposes her to side effects."
      ]
     },
     "."
    ],
    "why": "She is in preterm labor at 31 weeks. The realistic goal is not to stop labor for good but to prepare the fetus for birth: corticosteroids for the lungs and brain, and magnesium for neuroprotection. Tocolysis buys the 48 hours the steroids need.",
    "tip": "In preterm labor questions, choose answers that prepare the baby for early birth over answers that promise to stop labor.",
    "cn": "pharm",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-preterm-4",
    "step": "solve",
    "type": "sata",
    "q": "Which actions should the nurse include in the plan of care? Select all that apply.",
    "opts": [
     {
      "t": "Collect the group B strep culture before the first dose of penicillin",
      "ok": true,
      "why": "Yes: her status is unknown and she is in preterm labor, so the culture is collected first and prophylaxis starts right away."
     },
     {
      "t": "Assess patellar reflexes, respiratory rate, level of consciousness and urine output every hour during the magnesium infusion",
      "ok": true,
      "why": "Yes: magnesium is cleared by the kidneys, and loss of patellar reflexes is the earliest sign of toxicity, before respiratory depression."
     },
     {
      "t": "Keep calcium gluconate 1 g at the bedside",
      "ok": true,
      "why": "Yes: calcium gluconate is the antidote for magnesium toxicity and must be ready if reflexes disappear or breathing slows."
     },
     {
      "t": "Check the blood pressure before each nifedipine dose",
      "ok": true,
      "why": "Yes: nifedipine lowers blood pressure, and the drop can be greater when it is given with magnesium; the order holds for SBP under 90."
     },
     {
      "t": "Schedule the second betamethasone dose for 24 hours after the first",
      "ok": true,
      "why": "Yes: the two doses are given 24 hours apart, and the full fetal benefit begins about 24 hours after the second dose."
     },
     {
      "t": "Teach the client she will need strict bed rest at home after discharge",
      "ok": false,
      "why": "No: bed rest does not prevent preterm birth and raises the risk of blood clots, bone loss and deconditioning."
     },
     {
      "t": "Add terbutaline to the nifedipine to strengthen tocolysis",
      "ok": false,
      "why": "No: combining tocolytics adds cardiovascular risk without proven benefit, and terbutaline carries a warning against prolonged use for preterm labor."
     },
     {
      "t": "Encourage her to drink at least 3 L of fluid a day during the magnesium infusion",
      "ok": false,
      "why": "No: magnesium therapy raises the risk of pulmonary edema, so total fluids are limited. The trap is the old idea that hydration stops contractions."
     }
    ],
    "why": "The plan protects the fetus with corticosteroids, magnesium and group B strep prophylaxis, and protects the mother from the medications' risks. Magnesium needs hourly checks of reflexes, breathing, mental status and urine output with the antidote ready. Nifedipine needs a BP check before each dose. Bed rest, extra fluids and stacked tocolytics do not help.",
    "tip": "For every high-alert medication in the plan, pair it with its monitoring and its antidote or hold parameter.",
    "cn": "pharm",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-preterm-5",
    "step": "act",
    "type": "matrix",
    "q": "For each nursing action, indicate whether it is indicated or not indicated at this time.",
    "cols": [
     "Indicated",
     "Not indicated"
    ],
    "rows": [
     {
      "t": "Turn the client onto her side and recheck the BP in 15 minutes",
      "ans": 0,
      "why": "side-lying improves venous return and uteroplacental flow, and a prompt recheck shows whether the drop is resolving."
     },
     {
      "t": "Report the BP and heart rate to the provider",
      "ans": 0,
      "why": "SBP 86 is below the hold parameter, and nifedipine with magnesium can cause marked hypotension, so the provider needs to adjust the plan."
     },
     {
      "t": "Plan to hold the 16:30 nifedipine dose if the SBP is still under 90",
      "ans": 0,
      "why": "the order includes a hold parameter, and checking the BP before each dose prevents a second, deeper drop."
     },
     {
      "t": "Stop the magnesium infusion because she feels warm and flushed",
      "ans": 1,
      "why": "warmth and flushing are expected from vasodilation and are not toxicity while reflexes are 2+, breathing is normal and she is alert."
     },
     {
      "t": "Explain that warmth, flushing and drowsiness are expected with magnesium and to report trouble breathing or heavy weakness",
      "ans": 0,
      "why": "teaching lowers anxiety and helps her recognize and report the early symptoms of toxicity."
     },
     {
      "t": "Give a 1,000 mL lactated Ringer's bolus to raise her BP",
      "ans": 1,
      "why": "a bolus needs a provider order, and large volumes during magnesium therapy raise the risk of pulmonary edema."
     }
    ],
    "why": "Hypotension and tachycardia after nifedipine, on top of magnesium, call for repositioning, a recheck, a report and a hold on the next dose if it persists. Flushing and warmth are expected magnesium effects, so the response is teaching, not stopping the infusion. Fluids need an order and are limited during magnesium therapy.",
    "tip": "Separate expected side effects, which need teaching, from adverse effects that cross a parameter, which need a hold and a report.",
    "cn": "pharm",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-preterm-6",
    "step": "eval",
    "type": "matrix",
    "trend": true,
    "q": "For each finding at 18:00, indicate whether it shows a desired response to treatment or requires immediate follow-up.",
    "cols": [
     "Desired response",
     "Requires immediate follow-up"
    ],
    "rows": [
     {
      "t": "Contractions 1 to 2 per hour, down from every 4 to 5 minutes",
      "ans": 0,
      "why": "fewer contractions show tocolysis is working, buying time to complete the betamethasone course."
     },
     {
      "t": "BP 108/64, up from 86/50 at 11:00",
      "ans": 0,
      "why": "her pressure recovered after repositioning and the dose hold, so placental perfusion is better supported."
     },
     {
      "t": "Patellar reflexes absent, 2+ at 14:00",
      "ans": 1,
      "why": "loss of deep tendon reflexes is the earliest clinical sign of magnesium toxicity, so the infusion is stopped and the provider notified."
     },
     {
      "t": "RR 11, down from 18 at 14:00",
      "ans": 1,
      "why": "a respiratory rate under 12 signals respiratory depression from rising magnesium and calls for stopping the infusion and readying calcium gluconate."
     },
     {
      "t": "Urine output 15 mL/h, down from 45 mL/h",
      "ans": 1,
      "why": "magnesium is cleared by the kidneys, so falling output lets it build up. Output under 30 mL/h needs prompt action."
     },
     {
      "t": "Serum magnesium 9.6 mg/dL",
      "ans": 1,
      "why": "this is above the target range and matches her absent reflexes, slowed breathing and sedation."
     }
    ],
    "why": "The tocolysis and BP goals are met, but magnesium has accumulated as her urine output fell. Absent reflexes, a respiratory rate of 11, sedation and a level of 9.6 mg/dL mean toxicity. The nurse stops the infusion, calls the provider and prepares calcium gluconate as ordered.",
    "tip": "When reflexes, breathing and urine output fall together over time, suspect drug accumulation and act before the next value drops.",
    "cn": "pharm",
    "stem": "Refer to the chart."
   }
  ],
  "sys": "maternal"
 },
 {
  "id": "cs-meningitis",
  "title": "Bacterial meningitis in a preschooler",
  "sp": "peds",
  "topic": "Bacterial meningitis in a preschooler",
  "client": "4-year-old boy is brought to the pediatric emergency department at 13:30 by his mother for fever, vomiting and increasing sleepiness since this morning",
  "record": [
   {
    "tab": "Admission Notes",
    "at": 0,
    "time": "",
    "text": "A 4-year-old boy is brought to the pediatric emergency department at 13:30 by his mother for fever, vomiting and increasing sleepiness since this morning. He attends a full-time daycare. You are the pediatric emergency nurse."
   },
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "",
    "text": "4-year-old male, weight 16 kg (35 lb). Healthy, born at term. Immunizations up to date for age, including Hib and pneumococcal conjugate vaccines; meningococcal vaccine not yet due at this age. Mild cold symptoms 3 days ago. Fever to 39.4 °C (102.9 °F) since 05:00, vomited 4 times, refused breakfast and lunch. Last void about 07:00. No known drug allergies. Lives with his mother, father and 7-year-old sister; attends daycare 5 days a week."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "13:35",
    "text": "T 39.6 °C (103.3 °F), HR 148, RR 30, BP 94/56, SpO₂ 97% on room air, capillary refill 3 seconds. Normal for age: HR 80 to 120, RR 22 to 34, SBP 90 to 110."
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "13:40",
    "text": "Irritable and cries when moved; wants the lights off. Says his head and neck hurt. Resists bending his neck forward; nuchal rigidity present. Flexing his neck causes his hips and knees to bend. Pain and resistance when the knee is extended with the hip flexed. Small purple-red spots on both legs and the lower abdomen that do not blanch, new since noon per mother. Mucous membranes dry. Clear runny nose. Opens eyes to voice. Pupils equal and reactive. No seizure activity."
   },
   {
    "tab": "Orders",
    "at": 0,
    "time": "13:45",
    "text": "IV access. Blood culture, CBC, comprehensive metabolic panel, CRP, coagulation panel, lactate. 0.9% sodium chloride 20 mL/kg (320 mL) IV bolus. Ceftriaxone 800 mg IV every 12 hours and vancomycin 240 mg IV every 6 hours, first doses immediately after the blood culture; do not delay for lumbar puncture. Acetaminophen 240 mg PR every 6 hours as needed for fever."
   },
   {
    "tab": "Medication Administration Record",
    "at": 3,
    "time": "14:15",
    "text": "Blood culture drawn 13:52. Ceftriaxone 800 mg IV given 13:58. Vancomycin 240 mg IV started 14:05. Acetaminophen 240 mg PR given 14:00. 0.9% sodium chloride 320 mL bolus completed 14:15."
   },
   {
    "tab": "Vital Signs",
    "at": 3,
    "time": "14:20",
    "text": "T 39.1 °C (102.4 °F), HR 132, RR 28, BP 98/60, SpO₂ 98% on room air, capillary refill 2 seconds"
   },
   {
    "tab": "Orders",
    "at": 3,
    "time": "14:25",
    "text": "Lumbar puncture at bedside at 14:30: cell count, glucose, protein, Gram stain and culture. Admit to the pediatric unit. Neuro checks every hour. Dextrose 5% in 0.9% sodium chloride at 54 mL/h. Strict intake and output; daily weight. Serum sodium every 12 hours. Lorazepam 1.6 mg IV for a seizure lasting 5 minutes or longer."
   },
   {
    "tab": "Laboratory Results",
    "at": 4,
    "time": "15:30",
    "text": "CSF: cloudy. WBC 2,400/mm³ (0 to 5) with 92% neutrophils. Protein 210 mg/dL (15 to 45). Glucose 20 mg/dL (40 to 70); serum glucose 96 mg/dL. Gram stain: gram-negative diplococci. Blood: WBC 22,400/mm³ (5,500 to 15,500), platelets 168,000/mm³ (150,000 to 400,000), sodium 136 mEq/L (135 to 145), CRP 18 mg/dL (under 1)."
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "16:10",
    "text": "On the pediatric unit. At 16:05 a generalized tonic-clonic seizure began; still seizing at 16:10. Lying on his back. SpO₂ 90% on room air. Mother at the bedside."
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "08:00",
    "text": "Hospital day 2: T 37.8 °C (100 °F), HR 112, RR 24, BP 100/62, SpO₂ 98% on room air. Day 1 at 14:20: T 39.1 °C (102.4 °F), HR 132, RR 28, BP 98/60."
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "06:00",
    "text": "Sodium 128 mEq/L (135 to 145); 136 at 15:30 yesterday. Serum osmolality 262 mOsm/kg (275 to 295). Urine specific gravity 1.028 (1.005 to 1.030)."
   },
   {
    "tab": "Flowsheet",
    "at": 5,
    "time": "08:00",
    "text": "Last 24 hours: intake 1,450 mL, urine output 290 mL (about 0.75 mL/kg/h). Weight 16.6 kg (16 kg on admission). Petechiae unchanged in size and number, no new lesions. No seizures since 16:12 yesterday. Alert and talking with his mother; still uncomfortable with neck flexion."
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "08:30",
    "text": "Mother says, 'He doesn't turn around when I call him from the doorway anymore. He always used to.'"
   }
  ],
  "items": [
   {
    "id": "cs-meningitis-1",
    "step": "cues",
    "type": "highlight",
    "q": "Highlight the findings in the 13:40 nurses' note that require immediate follow-up.",
    "parts": [
     {
      "t": "Irritable and cries when moved; wants the lights off.",
      "ok": true,
      "why": "Yes: irritability that worsens with handling and photophobia are meningeal signs in a young child, because movement stretches inflamed meninges."
     },
     {
      "t": "Resists bending his neck forward; nuchal rigidity present.",
      "ok": true,
      "why": "Yes: neck stiffness is a hallmark of meningeal irritation and, with high fever, points strongly to meningitis."
     },
     {
      "t": "Flexing his neck causes his hips and knees to bend.",
      "ok": true,
      "why": "Yes: this is a positive Brudzinski sign, a reflex response to stretching inflamed meninges along the spinal cord."
     },
     {
      "t": "Small purple-red spots on both legs and the lower abdomen that do not blanch, new since noon.",
      "ok": true,
      "why": "Yes: a spreading nonblanching rash with fever suggests meningococcal infection with possible septicemia, which can progress to shock within hours."
     },
     {
      "t": "Clear runny nose.",
      "ok": false,
      "why": "No: rhinorrhea fits his recent cold and does not change the urgency. The trap is blaming the whole illness on a viral upper respiratory infection."
     },
     {
      "t": "Pupils equal and reactive.",
      "ok": false,
      "why": "No: equal, reactive pupils are a reassuring neurologic finding right now, though they are rechecked often."
     },
     {
      "t": "No seizure activity.",
      "ok": false,
      "why": "No: this pertinent negative needs no action itself, although seizure precautions are still planned because of the meningeal inflammation."
     }
    ],
    "why": "Fever with photophobia, irritability, nuchal rigidity and a positive Brudzinski sign points to meningitis. A new nonblanching petechial rash raises concern for meningococcal disease, which can cause shock within hours. The cold symptoms, reactive pupils and absence of seizures do not change the urgency.",
    "tip": "In a febrile child, a rash that does not blanch is an emergency until proven otherwise; flag it first.",
    "cn": "safety",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-meningitis-2",
    "step": "analyze",
    "type": "matrix",
    "q": "For each finding, indicate the process it most likely reflects.",
    "cols": [
     "Meningeal irritation",
     "Increased intracranial pressure",
     "Sepsis or poor perfusion"
    ],
    "rows": [
     {
      "t": "Pain and resistance when the knee is extended with the hip flexed",
      "ans": 0,
      "why": "this is a positive Kernig sign; extending the knee stretches the inflamed lumbar meninges and nerve roots."
     },
     {
      "t": "Photophobia and neck pain",
      "ans": 0,
      "why": "inflamed meninges make light and neck movement painful, which is why he wants the lights off and resists neck flexion."
     },
     {
      "t": "Repeated vomiting with worsening headache and increasing sleepiness",
      "ans": 1,
      "why": "rising pressure inside the skull causes headache, vomiting and a falling level of consciousness. The trap is blaming the vomiting on a stomach virus."
     },
     {
      "t": "HR 148 and capillary refill 3 seconds",
      "ans": 2,
      "why": "a heart rate well above the normal 80 to 120 with delayed refill shows the circulation is compensating for sepsis and volume loss."
     },
     {
      "t": "Nonblanching petechiae spreading on the legs and abdomen",
      "ans": 2,
      "why": "meningococcal petechiae reflect damaged capillaries and early clotting abnormalities in the bloodstream, a warning that septic shock can follow."
     },
     {
      "t": "No urine since 07:00 with dry mucous membranes",
      "ans": 2,
      "why": "low output and dry membranes reflect volume loss from fever and vomiting, which worsens perfusion and supports the ordered fluid bolus."
     }
    ],
    "why": "His findings come from three processes. Kernig sign, neck pain and photophobia show meningeal irritation. Headache, vomiting and sleepiness can reflect rising intracranial pressure. Tachycardia, slow refill, no urine and spreading petechiae show a systemic infection affecting perfusion, so fluids and antibiotics cannot wait.",
    "tip": "Group findings by the process that causes them; each group leads to its own set of nursing actions.",
    "cn": "safety",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-meningitis-3",
    "step": "hypo",
    "type": "cloze",
    "q": "Complete the sentences.",
    "parts": [
     "The client's most likely condition is ",
     {
      "opts": [
       "bacterial meningitis",
       "viral meningitis",
       "influenza with dehydration"
      ],
      "ans": 0,
      "whys": [
       "Yes: high fever, meningeal signs, a falling level of consciousness and a nonblanching rash fit a bacterial infection that can kill or disable within hours.",
       "No: viral meningitis is usually milder, without a petechial rash or poor perfusion, and is diagnosed only after bacterial causes are excluded.",
       "No: influenza does not cause nuchal rigidity or positive Kernig and Brudzinski signs. The trap is explaining away meningeal signs as dehydration."
      ]
     },
     ". The rash makes the most likely organism ",
     {
      "opts": [
       "Neisseria meningitidis",
       "Haemophilus influenzae type b",
       "herpes simplex virus"
      ],
      "ans": 0,
      "whys": [
       "Yes: petechiae and purpura with meningitis are classic for meningococcus, which spreads by respiratory droplets and can cause rapid septic shock.",
       "No: Hib meningitis is now rare because of vaccination, he is fully immunized, and it does not usually cause a petechial rash.",
       "No: herpes simplex causes encephalitis with seizures and behavior change, not a nonblanching rash with meningeal signs."
      ]
     },
     ". The priority for the nurse is to ",
     {
      "opts": [
       "give the first antibiotic doses right after the blood culture is drawn",
       "wait for the lumbar puncture results before giving antibiotics",
       "give acetaminophen and recheck the temperature in 1 hour"
      ],
      "ans": 0,
      "whys": [
       "Yes: every hour of delay in antibiotics worsens outcomes; the blood culture is drawn first, but antibiotics never wait for the lumbar puncture.",
       "No: waiting for CSF results is a dangerous trap. The CSF can still be diagnostic after the first antibiotic dose, so treatment starts now.",
       "No: treating fever is comfort care, and rechecking in an hour delays the treatment that addresses the infection itself."
      ]
     },
     "."
    ],
    "why": "This is bacterial meningitis, and the rash points to meningococcus. The top nursing priority is getting antibiotics in fast, right after the blood culture. A lumbar puncture is still useful after antibiotics, so it never justifies waiting.",
    "tip": "When a question asks for the priority in a time-critical infection, choose the option that starts definitive treatment soonest.",
    "cn": "safety",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-meningitis-4",
    "step": "solve",
    "type": "sata",
    "q": "The nurse is planning care for the next several hours. Which actions should the nurse include? Select all that apply.",
    "opts": [
     {
      "t": "Place the child on droplet precautions in a private room",
      "ok": true,
      "why": "Yes: meningococcus spreads by respiratory droplets, so staff wear a mask for close contact until he has had 24 hours of effective antibiotics."
     },
     {
      "t": "For the lumbar puncture, hold him side-lying with his knees drawn up and chin tucked toward his chest",
      "ok": true,
      "why": "Yes: this curled position widens the spaces between the lumbar vertebrae so the needle can reach the subarachnoid space safely."
     },
     {
      "t": "Pad the side rails and keep suction and oxygen at the bedside",
      "ok": true,
      "why": "Yes: inflamed meninges irritate the brain, so seizures are a real risk; padding and working suction protect him and his airway."
     },
     {
      "t": "Keep the room dark and quiet and cluster care",
      "ok": true,
      "why": "Yes: less light and noise eases photophobia and irritability and limits stimulation that can raise intracranial pressure."
     },
     {
      "t": "Monitor intake and output, daily weight and serum sodium for fluid retention",
      "ok": true,
      "why": "Yes: meningitis can trigger SIADH, with water retention, low sodium and seizures; early detection lets the provider adjust fluids."
     },
     {
      "t": "Place him in airborne precautions in a negative-pressure room",
      "ok": false,
      "why": "No: meningococcus spreads by droplets, not airborne particles. Airborne isolation is for measles, varicella and tuberculosis."
     },
     {
      "t": "Lay him flat with a pillow under his head to flex his neck forward",
      "ok": false,
      "why": "No: neck flexion is painful with meningeal irritation. A side-lying position with the head slightly raised and the neck neutral is more comfortable."
     }
    ],
    "why": "The plan addresses spread, the lumbar puncture, seizures, comfort and fluid balance. Droplet precautions continue until 24 hours of effective antibiotics. The curled side-lying position opens the lumbar spaces. Seizure precautions, a quiet room and close tracking of sodium and fluids protect the brain.",
    "tip": "Match each precaution to the organism's route of spread: droplet for meningococcus, airborne only for measles, varicella and tuberculosis.",
    "cn": "safety",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-meningitis-5",
    "step": "act",
    "type": "matrix",
    "q": "For each action, indicate whether it is indicated or not indicated.",
    "cols": [
     "Indicated",
     "Not indicated"
    ],
    "rows": [
     {
      "t": "Turn him onto his side and move objects away from him",
      "ans": 0,
      "why": "side-lying lets secretions drain and protects the airway, and clearing the area prevents injury while he is seizing."
     },
     {
      "t": "Give lorazepam 1.6 mg IV as ordered",
      "ans": 0,
      "why": "the seizure has lasted 5 minutes, which meets the order and the threshold for status epilepticus that needs a benzodiazepine."
     },
     {
      "t": "Insert a padded tongue blade so he does not bite his tongue",
      "ans": 1,
      "why": "objects in the mouth can break teeth, cause aspiration or block the airway; nothing goes in the mouth during a seizure."
     },
     {
      "t": "Hold his arms and legs down to prevent injury",
      "ans": 1,
      "why": "restraining a seizing child can cause fractures and soft tissue injury; padding and clearing the area protect him instead."
     },
     {
      "t": "Once the seizure is controlled, notify infection prevention of the Gram stain so household and daycare contacts can receive prophylaxis",
      "ans": 0,
      "why": "gram-negative diplococci point to meningococcus, and close contacts need prompt antibiotic prophylaxis, such as rifampin, ceftriaxone or ciprofloxacin."
     },
     {
      "t": "Arrange prophylaxis for every nurse who cared for him in the emergency department",
      "ans": 1,
      "why": "health care workers need prophylaxis only after unprotected exposure to oral secretions, such as suctioning or intubation without a mask."
     }
    ],
    "why": "During a seizure the nurse protects the airway and body, applies oxygen and suctions as needed, and gives the ordered benzodiazepine at 5 minutes. Nothing goes in the mouth and limbs are not restrained. The CSF shows bacterial meningitis with gram-negative diplococci, so prophylaxis for close contacts starts promptly.",
    "tip": "For seizure care, choose actions that protect the airway and prevent injury; reject anything placed in the mouth or used to hold the child down.",
    "cn": "safety",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-meningitis-6",
    "step": "eval",
    "type": "matrix",
    "trend": true,
    "q": "For each finding, indicate whether it shows improvement or requires follow-up.",
    "cols": [
     "Improving",
     "Requires follow-up"
    ],
    "rows": [
     {
      "t": "T 37.8 °C (100 °F) and HR 112, down from 39.1 °C (102.4 °F) and HR 132",
      "ans": 0,
      "why": "a falling fever and a heart rate back within the normal 80 to 120 show the infection is responding to antibiotics."
     },
     {
      "t": "Petechiae unchanged, with no new lesions",
      "ans": 0,
      "why": "a rash that is no longer spreading suggests the bloodstream infection and clotting abnormality are not progressing."
     },
     {
      "t": "Alert and talking, with no seizures since 16:12 yesterday",
      "ans": 0,
      "why": "a better level of consciousness and no further seizures reflect less brain irritation and stable intracranial pressure."
     },
     {
      "t": "Sodium 128 mEq/L, down from 136, with serum osmolality 262 mOsm/kg",
      "ans": 1,
      "why": "falling sodium and osmolality suggest SIADH; hyponatremia worsens cerebral edema and can cause seizures, so fluids must be adjusted."
     },
     {
      "t": "Weight 16.6 kg, up from 16 kg, with urine output about 0.75 mL/kg/h and specific gravity 1.028",
      "ans": 1,
      "why": "weight gain with low output and concentrated urine points to water retention from SIADH, not better hydration."
     },
     {
      "t": "Mother reports he no longer turns when called from the doorway",
      "ans": 1,
      "why": "sensorineural hearing loss is the most common lasting complication of bacterial meningitis, so he needs a formal hearing evaluation before discharge."
     }
    ],
    "why": "The infection is responding: fever, heart rate, rash and mental status are all better. Fluid balance is not; falling sodium with weight gain and concentrated urine points to SIADH and needs a change in the fluid plan. A new hearing concern is common after bacterial meningitis and calls for audiology testing before discharge.",
    "tip": "In an evaluation trend, check each system separately; improvement in the infection does not cancel a new problem in fluids or hearing.",
    "cn": "safety",
    "stem": "Refer to the chart."
   }
  ],
  "sys": "neuro"
 },
 {
  "id": "cs-nms",
  "title": "Fever and rigidity on haloperidol",
  "sp": "psy",
  "topic": "Fever and rigidity on haloperidol",
  "client": "29-year-old man with schizophrenia is on day 7 of an admission to an adult inpatient psychiatric unit",
  "record": [
   {
    "tab": "Admission Notes",
    "at": 0,
    "time": "",
    "text": "A 29-year-old man with schizophrenia is on day 7 of an admission to an adult inpatient psychiatric unit. His haloperidol dose was increased 3 days ago. At 07:15 the day nurse finds him in bed, stiff and unable to get up."
   },
   {
    "tab": "History and Physical",
    "at": 0,
    "time": "",
    "text": "29-year-old man with schizophrenia, admitted 7 days ago on an involuntary hold for command auditory hallucinations, paranoia, and not eating or bathing. Stopped his outpatient antipsychotic 4 months ago. No other medical history. No known allergies. Urine drug screen negative. Weight 76 kg (168 lb). Admission labs normal, including CK 140 units/L (30 to 200) and creatinine 0.9 mg/dL (0.6 to 1.2)."
   },
   {
    "tab": "Medication Administration Record",
    "at": 0,
    "time": "07:00",
    "text": "Haloperidol 5 mg PO twice daily on days 1 to 3, increased to 10 mg PO twice daily on day 4; last dose 21:00 last night. Haloperidol 5 mg IM PRN severe agitation: given day 4 at 18:30 and day 5 at 22:40, each with lorazepam 2 mg IM. Benztropine 1 mg PO twice daily since day 4. Next haloperidol 10 mg PO due 09:00."
   },
   {
    "tab": "Flowsheet",
    "at": 0,
    "time": "07:00",
    "text": "Intake day 5: about 600 mL of fluid, ate 25% of meals. Day 6: about 400 mL of fluid, ate less than 25% of meals. No recorded void since 22:00."
   },
   {
    "tab": "Vital Signs",
    "at": 0,
    "time": "07:35",
    "text": "Day 4, 08:00: T 36.9 °C (98.4 °F), HR 82, RR 16, BP 124/78. Day 6, 20:00: T 37.7 °C (99.9 °F), HR 104, RR 18, BP 148/92. Day 7, 07:15: T 39.4 °C (102.9 °F), HR 126, RR 26, BP 168/102, SpO₂ 94% on room air. Day 7, 07:35 recheck: HR 118, BP 112/64."
   },
   {
    "tab": "Nurses' Notes",
    "at": 0,
    "time": "07:15",
    "text": "Lying stiffly in bed, staring at the ceiling. Responds to his name only with a groan; does not follow commands. Heavily diaphoretic, skin hot. Both arms resist passive movement steadily through the whole range, like bending a lead pipe. Drooling; coughed on sips of water. Incontinent of a small amount of dark, tea-colored urine. Pupils 4 mm and reactive. No clonus at either ankle. Bowel sounds hypoactive. A peer says he has not gotten out of bed since yesterday afternoon."
   },
   {
    "tab": "Laboratory Results",
    "at": 1,
    "time": "08:00",
    "text": "CK 9,800 units/L (30 to 200). WBC 15,400/mm³ (5,000 to 10,000). Sodium 149 mEq/L (135 to 145). Potassium 5.2 mEq/L (3.5 to 5). BUN 36 mg/dL (7 to 20). Creatinine 1.9 mg/dL (0.6 to 1.2). AST 156 units/L (10 to 40). Urinalysis: dipstick large blood; microscopy 0 to 2 RBCs/hpf."
   },
   {
    "tab": "Vital Signs",
    "at": 3,
    "time": "08:00",
    "text": "T 39.8 °C (103.6 °F), HR 130, RR 28, BP 98/58, SpO₂ 93% on room air."
   },
   {
    "tab": "Nurses' Notes",
    "at": 3,
    "time": "08:05",
    "text": "Rapid response team called to the unit. Psychiatrist and rapid response provider at the bedside; working diagnosis suspected neuroleptic malignant syndrome. Medical intensive care unit consulted for transfer."
   },
   {
    "tab": "Orders",
    "at": 4,
    "time": "08:30",
    "text": "Hold all antipsychotics. NPO. Second IV. 0.9% sodium chloride 1,000 mL IV bolus, then 200 mL/h. Cooling blanket and ice packs to groin and axillae; target core temperature below 38 °C (100.4 °F). Continuous core temperature and cardiac monitoring. Lorazepam 1 mg IV now and every 4 hours PRN agitation. Indwelling urinary catheter with hourly urine output. Repeat CK and basic metabolic panel in 6 hours. Transfer to the medical intensive care unit; bed ready at 09:30."
   },
   {
    "tab": "Nurses' Notes",
    "at": 4,
    "time": "08:35",
    "text": "Intermittently thrashing against the side rails and grabbing at the new IV. T 39.9 °C (103.8 °F), HR 132, BP 154/96, then 96/56 five minutes later. Haloperidol 10 mg PO due at 09:00 still active on the MAR."
   },
   {
    "tab": "Laboratory Results",
    "at": 5,
    "time": "06:00",
    "text": "Day 10. CK: day 7 08:00, 9,800; day 7 14:00, 18,600; day 8 06:00, 12,400; day 10 06:00, 1,900 units/L (30 to 200). Creatinine: day 7 08:00, 1.9; day 7 14:00, 2.1; day 8, 1.6; day 10, 1 mg/dL (0.6 to 1.2)."
   },
   {
    "tab": "Vital Signs",
    "at": 5,
    "time": "08:00",
    "text": "Day 8, 08:00: T 38.1 °C (100.6 °F), HR 108, RR 20, BP 138/84. Day 10, 08:00: T 37 °C (98.6 °F), HR 84, RR 16, BP 126/78, SpO₂ 98% on room air."
   },
   {
    "tab": "Nurses' Notes",
    "at": 5,
    "time": "09:00",
    "text": "Day 10, medical intensive care transfer note. Dantrolene given for 48 hours, stopped day 9. Rigidity resolved. Alert, oriented to person and place, follows commands. Passed bedside swallow screen. Urine output 60 to 90 mL/h, clear yellow. Still voices paranoid thoughts about staff. Plan: return to psychiatry when medically cleared; no antipsychotic ordered yet."
   }
  ],
  "items": [
   {
    "id": "cs-nms-1",
    "step": "cues",
    "type": "highlight",
    "q": "Highlight the findings in the 07:15 nurses' note that require immediate follow-up.",
    "parts": [
     {
      "t": "Responds to his name only with a groan; does not follow commands.",
      "ok": true,
      "why": "Yes: a sharp drop in level of consciousness is altered mental status, a core feature of neuroleptic malignant syndrome. The trap is calling it negative symptoms of schizophrenia."
     },
     {
      "t": "Heavily diaphoretic, skin hot.",
      "ok": true,
      "why": "Yes: with a temperature of 39.4 °C (102.9 °F), this is hyperthermia with autonomic instability, not a minor fever to treat later."
     },
     {
      "t": "Both arms resist passive movement steadily through the whole range, like bending a lead pipe.",
      "ok": true,
      "why": "Yes: uniform lead-pipe rigidity is the hallmark muscle finding of neuroleptic malignant syndrome and drives heat production and muscle breakdown."
     },
     {
      "t": "Drooling; coughed on sips of water.",
      "ok": true,
      "why": "Yes: he cannot swallow safely and is at high risk for aspiration. Nothing more by mouth until he is assessed."
     },
     {
      "t": "Incontinent of a small amount of dark, tea-colored urine.",
      "ok": true,
      "why": "Yes: tea-colored urine suggests myoglobin from muscle breakdown, and a small amount after poor intake signals risk for acute kidney injury."
     },
     {
      "t": "Pupils 4 mm and reactive.",
      "ok": false,
      "why": "No: normal pupils are reassuring. They also help, because dilated pupils would point more toward serotonin syndrome."
     },
     {
      "t": "Bowel sounds hypoactive.",
      "ok": false,
      "why": "No: slowed bowels are common with antipsychotics and anticholinergics. Serotonin syndrome would cause hyperactive bowel sounds and diarrhea instead."
     }
    ],
    "why": "Fever, rigidity, unstable blood pressure and pulse, and altered mental status days after a dose increase of a high-potency antipsychotic is the pattern of neuroleptic malignant syndrome. Dysphagia threatens his airway and dark urine points to muscle breakdown. Normal pupils and quiet bowel sounds are useful details but do not need action.",
    "tip": "Highlight findings that are new and that threaten the airway, temperature control, circulation or the kidneys.",
    "cn": "physio",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-nms-2",
    "step": "analyze",
    "type": "matrix",
    "q": "For each finding, indicate whether it is more consistent with neuroleptic malignant syndrome, serotonin syndrome, or catatonia.",
    "cols": [
     "Neuroleptic malignant syndrome",
     "Serotonin syndrome",
     "Catatonia"
    ],
    "rows": [
     {
      "t": "Lead-pipe rigidity with a CK of 9,800 units/L after a haloperidol dose increase",
      "ans": 0,
      "why": "severe generalized rigidity with a very high CK, days after a dopamine blocker is increased, is the classic picture of neuroleptic malignant syndrome."
     },
     {
      "t": "Gradual onset over 1 to 3 days, with normal or slowed reflexes",
      "ans": 0,
      "why": "neuroleptic malignant syndrome evolves over days. Its muscles are rigid and slow rather than jerky and hyperreflexic."
     },
     {
      "t": "Hyperreflexia with ankle clonus, worse in the legs",
      "ans": 1,
      "why": "clonus and hyperreflexia are the hallmark neuromuscular signs of serotonin toxicity. The trap is calling any abnormal muscle tone rigidity."
     },
     {
      "t": "Dilated pupils, diarrhea and hyperactive bowel sounds within hours of adding a serotonergic drug",
      "ans": 1,
      "why": "serotonin syndrome comes on fast after a new or higher serotonergic dose and overstimulates the gut and pupils."
     },
     {
      "t": "Mutism, posturing and waxy flexibility with normal temperature and vital signs",
      "ans": 2,
      "why": "catatonia can look like neuroleptic malignant syndrome, but without fever, autonomic instability or a very high CK it is not the medical emergency."
     },
     {
      "t": "Holds a fixed posture for hours, then loosens after a lorazepam challenge dose",
      "ans": 2,
      "why": "rapid improvement with a benzodiazepine challenge supports catatonia. It is also why catatonia must be identified before more antipsychotic is given."
     }
    ],
    "why": "Neuroleptic malignant syndrome, serotonin syndrome and catatonia can all cause altered mental status and abnormal muscle tone, so the details matter. Neuroleptic malignant syndrome evolves over days after a dopamine blocker and causes lead-pipe rigidity, hyperthermia and a very high CK. Serotonin syndrome comes on within hours with clonus, dilated pupils and diarrhea; catatonia causes mutism and posturing without fever or autonomic instability.",
    "tip": "Anchor each syndrome to its trigger drug, its speed of onset and its signature muscle finding: rigidity, clonus or posturing.",
    "cn": "pharm",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-nms-3",
    "step": "hypo",
    "type": "cloze",
    "q": "Complete the sentences.",
    "parts": [
     "The client's findings are most consistent with ",
     {
      "opts": [
       "neuroleptic malignant syndrome",
       "serotonin syndrome",
       "worsening psychosis"
      ],
      "ans": 0,
      "whys": [
       "Yes: hyperthermia, lead-pipe rigidity, autonomic instability, altered mental status and a CK of 9,800 units/L after a haloperidol increase meet the classic picture.",
       "No: he takes no serotonergic drug, and he has rigidity with no clonus, normal pupils and slow bowels. The trap is treating every drug-related fever the same.",
       "No: psychosis does not cause a fever of 39.4 °C (102.9 °F), rigidity or a high CK. The trap is reading a medical emergency as psychiatric."
      ]
     },
     " caused by ",
     {
      "opts": [
       "dopamine blockade from the higher haloperidol dose",
       "anticholinergic toxicity from benztropine",
       "excess serotonin activity"
      ],
      "ans": 0,
      "whys": [
       "Yes: sudden, strong dopamine blockade disrupts temperature control in the hypothalamus and muscle tone in the basal ganglia. Dose increases and IM doses raise the risk.",
       "No: anticholinergic toxicity causes hot, dry skin and dilated pupils. He is drenched in sweat with normal pupils.",
       "No: excess serotonin causes clonus, agitation and diarrhea, none of which he has."
      ]
     },
     ". The complication the nurse should monitor most closely is ",
     {
      "opts": [
       "acute kidney injury from myoglobin and dehydration",
       "tardive dyskinesia",
       "weight gain"
      ],
      "ans": 0,
      "whys": [
       "Yes: muscle breakdown releases myoglobin that injures the kidneys, and his poor intake makes it worse. His creatinine has already doubled.",
       "No: tardive dyskinesia develops over months to years of treatment and is not an acute threat.",
       "No: weight gain is a long-term metabolic effect of antipsychotics, not a concern during this emergency."
      ]
     },
     "."
    ],
    "why": "The pattern fits neuroleptic malignant syndrome, a rare but potentially fatal reaction to dopamine blockade. Recent dose increases, IM doses, dehydration and agitation all raise the risk. Rhabdomyolysis with acute kidney injury, aspiration and hyperthermia are the threats that kill.",
    "tip": "Name the condition, link it to the drug that caused it, then pick the complication already showing in the labs.",
    "cn": "pharm",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-nms-4",
    "step": "solve",
    "type": "sata",
    "q": "The nurse plans care while the client waits for transfer to the medical intensive care unit. Which interventions should the nurse anticipate? Select all that apply.",
    "opts": [
     {
      "t": "Hold all scheduled and PRN antipsychotics",
      "ok": true,
      "why": "Yes: the antipsychotic is the cause. Stopping every dopamine blocker, including PRN doses, is the first and most important treatment."
     },
     {
      "t": "Begin active cooling with a cooling blanket and ice packs to the groin and axillae",
      "ok": true,
      "why": "Yes: the fever comes from rigid muscles and a disrupted hypothalamus, so external cooling works better than relying on an antipyretic."
     },
     {
      "t": "Give IV 0.9% sodium chloride",
      "ok": true,
      "why": "Yes: fluids correct his dehydration and keep urine flowing to flush myoglobin and protect the kidneys."
     },
     {
      "t": "Keep the client NPO",
      "ok": true,
      "why": "Yes: drooling and coughing on sips mean an unsafe swallow, so fluids and medications go IV until his swallow is assessed."
     },
     {
      "t": "Prepare for dantrolene or bromocriptine if the provider orders them",
      "ok": true,
      "why": "Yes: in severe cases, providers may add dantrolene to relax muscle or bromocriptine to restore dopamine activity, usually in an intensive care setting."
     },
     {
      "t": "Give cyproheptadine",
      "ok": false,
      "why": "No: cyproheptadine is a serotonin antagonist used for serotonin syndrome. The trap is confusing the two conditions."
     },
     {
      "t": "Increase the benztropine to relieve the rigidity",
      "ok": false,
      "why": "No: anticholinergics do not treat this rigidity and reduce sweating, which can worsen hyperthermia. The trap is treating it like acute dystonia."
     },
     {
      "t": "Switch to a different antipsychotic now to control his psychosis",
      "ok": false,
      "why": "No: any antipsychotic can worsen the syndrome. Antipsychotics are restarted only after full recovery, cautiously and at a low dose."
     }
    ],
    "why": "Treatment is to remove the cause and support the body: stop all antipsychotics, cool, give IV fluids, protect the airway, and move to a higher level of care. Dantrolene and bromocriptine are added for severe cases. Benzodiazepines may help agitation and rigidity, but anticholinergics, serotonin antagonists and other antipsychotics do not belong here.",
    "tip": "Pick interventions that remove the trigger and support temperature, airway, fluids and kidneys; reject treatments borrowed from look-alike conditions.",
    "cn": "pharm",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-nms-5",
    "step": "act",
    "type": "matrix",
    "q": "For each action, indicate whether the nurse should do it now or avoid it.",
    "cols": [
     "Do now",
     "Avoid"
    ],
    "rows": [
     {
      "t": "Mark the 09:00 haloperidol as held and confirm the order is discontinued",
      "ans": 0,
      "why": "the drug that caused the reaction has to stop, and a scheduled dose still showing on the MAR is an error waiting to happen during a busy transfer."
     },
     {
      "t": "Give haloperidol 5 mg IM PRN for the thrashing",
      "ans": 1,
      "why": "more dopamine blockade will worsen the syndrome. His agitation is part of the medical emergency, and the ordered lorazepam is the safer choice."
     },
     {
      "t": "Apply four-point restraints so he cannot pull out his IV",
      "ans": 1,
      "why": "struggling against restraints increases heat production and muscle breakdown. Secure the IV, stay with him and use the ordered benzodiazepine."
     },
     {
      "t": "Give oral acetaminophen with a sip of water for the fever",
      "ans": 1,
      "why": "he cannot swallow safely, and antipyretics do little for this centrally driven fever. Physical cooling is the priority."
     },
     {
      "t": "Start the saline bolus and the cooling blanket",
      "ans": 0,
      "why": "fluids protect the kidneys from myoglobin and correct dehydration, and active cooling limits brain and organ injury from hyperthermia."
     },
     {
      "t": "Give the intensive care nurse a handoff that includes the haloperidol timeline, CK, creatinine and intake",
      "ans": 0,
      "why": "a structured handoff with the drug history and labs lets the receiving team trend the CK and kidney function and avoid repeating the trigger."
     }
    ],
    "why": "The nurse's actions remove the trigger, treat hyperthermia and dehydration, and keep him safe without adding heat or more dopamine blockade. Restraints, PRN antipsychotics and oral medications all add harm in this situation. A clear handoff carries the medication timeline to the team that will continue care.",
    "tip": "Before any action, ask whether it adds heat, adds dopamine blockade or risks aspiration; if it does, avoid it.",
    "cn": "pharm",
    "stem": "Refer to the chart."
   },
   {
    "id": "cs-nms-6",
    "step": "eval",
    "type": "cloze",
    "trend": true,
    "q": "Complete the sentences.",
    "parts": [
     "Compared with day 7, the client's condition is ",
     {
      "opts": [
       "improving",
       "worsening",
       "unchanged"
      ],
      "ans": 0,
      "whys": [
       "Yes: his temperature, heart rate, rigidity, mental status, CK and creatinine are all moving back toward normal.",
       "No: only the first hours of day 7 showed rising values; every measure since then has improved.",
       "No: nearly every measure is different from day 7, and all of them have moved in the right direction."
      ]
     },
     ", as shown by ",
     {
      "opts": [
       "a falling CK and creatinine with a normal temperature",
       "the CK rise between 08:00 and 14:00 on day 7",
       "his ongoing paranoid thoughts"
      ],
      "ans": 0,
      "whys": [
       "Yes: CK and creatinine trend down and fever is gone, which shows muscle breakdown has stopped and the kidneys are recovering.",
       "No: CK often keeps rising for a day as muscle breakdown peaks. The trap is judging a trend from its first two points.",
       "No: his psychosis is untreated and expected to persist. It does not measure recovery from the syndrome."
      ]
     },
     ". Before any antipsychotic is restarted, the nurse expects the team to wait ",
     {
      "opts": [
       "at least 2 weeks after symptoms resolve, then start at a low dose",
       "until his temperature has been normal for 24 hours",
       "no time at all, because the psychosis needs treatment now"
      ],
      "ans": 0,
      "whys": [
       "Yes: standard teaching is to wait at least 2 weeks after recovery, then restart cautiously, often with a lower-potency drug at a low dose and close monitoring.",
       "No: a normal temperature for one day is too soon. Early rechallenge carries a high risk of recurrence.",
       "No: restarting now risks a second episode. The trap is letting the psychiatric symptoms override medical safety."
      ]
     },
     "."
    ],
    "why": "Trending each measure over several days shows recovery: fever, rigidity, mental status, CK and creatinine have all improved. An early CK rise is common and does not mean treatment failed. Ongoing psychosis is expected, and antipsychotics are restarted only after a waiting period, at a low dose, with close watching for recurrence.",
    "tip": "Judge a trend by its direction across all time points, not by a single early value.",
    "cn": "pharm",
    "stem": "Refer to the chart."
   }
  ],
  "sys": "mental health"
 }
];
