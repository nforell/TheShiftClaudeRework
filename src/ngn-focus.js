/* The Shift — focus practice: NCLEX-style items aimed at one clinical judgment step each, offered after the
   debrief for the player's weakest steps. Same formats and scoring as ngn.js, with the per-option rationale
   inline (why on sata opts / highlight parts / matrix rows; whys on cloze blanks; whys{} on bowtie) and a tip.
   sp is the unit the stem is set on. Needs clinical review like every other item. */
window.Shift = window.Shift || {};
window.Shift.ngnFocus = [
 {
  "id": "fx-analyze-1",
  "type": "matrix",
  "step": "analyze",
  "sp": "sd",
  "stem": "A 68-year-old with heart failure, EF 25%, is admitted to the step-down unit after gaining 6 lb in 4 days. BP 148/88, HR 104, RR 26, SpO₂ 90% on 2 L. He says he has slept sitting in his recliner for three nights.",
  "q": "For each finding, indicate whether it is more consistent with left-sided or right-sided heart failure.",
  "cols": [
   "Left-sided heart failure",
   "Right-sided heart failure"
  ],
  "rows": [
   {
    "t": "Crackles in both lung bases",
    "ans": 0,
    "why": "the left ventricle cannot empty, so pressure backs up into the pulmonary veins and fluid leaks into the alveoli."
   },
   {
    "t": "Needs three pillows or a recliner to breathe at night",
    "ans": 0,
    "why": "orthopnea comes from pulmonary congestion; lying flat returns more blood to a left ventricle that cannot handle it."
   },
   {
    "t": "Pink, frothy sputum",
    "ans": 0,
    "why": "this is pulmonary edema, the most severe form of left-sided backup into the lungs."
   },
   {
    "t": "Jugular veins distended at 45 degrees",
    "ans": 1,
    "why": "the right ventricle cannot empty, so blood backs up into the systemic veins, visible first in the neck."
   },
   {
    "t": "3+ pitting edema of both lower legs",
    "ans": 1,
    "why": "systemic venous congestion pushes fluid into dependent tissues. The trap is linking edema to the lungs; leg edema is a right-sided sign."
   },
   {
    "t": "Enlarged, tender liver and poor appetite",
    "ans": 1,
    "why": "venous backup congests the liver and gut, causing right upper quadrant tenderness, early fullness and nausea."
   }
  ],
  "why": "Sort heart failure findings by where the blood backs up. Left-sided failure backs up into the lungs, causing crackles, orthopnea and frothy sputum. Right-sided failure backs up into the body, causing neck vein distention, leg edema and liver congestion. Most clients with long-standing failure have both.",
  "tip": "Remember left means lungs and right means rest of the body, then trace each finding back to the organ where fluid is collecting."
 },
 {
  "id": "fx-analyze-2",
  "type": "matrix",
  "step": "analyze",
  "sp": "teen",
  "stem": "A 16-year-old is admitted to the adolescent unit for an eating disorder. She is 5 ft 4 in and 98 lb. HR 44, BP 88/54, temperature 35.9 °C (96.6 °F). Labs: potassium 3.0 mEq/L, bicarbonate 32 mEq/L. She says she is always cold.",
  "q": "For each finding, indicate whether it is consistent with self-induced vomiting, consistent with starvation, or not related to the eating disorder.",
  "cols": [
   "Consistent with self-induced vomiting",
   "Consistent with starvation",
   "Not related"
  ],
  "rows": [
   {
    "t": "Calluses and small scars on the backs of her knuckles",
    "ans": 0,
    "why": "these form when the teeth rub the hand during repeated self-induced vomiting (Russell sign)."
   },
   {
    "t": "Swollen glands in front of both ears",
    "ans": 0,
    "why": "repeated vomiting enlarges the parotid glands, giving the cheeks a puffy look that is easy to mistake for weight gain."
   },
   {
    "t": "Potassium 3.0 mEq/L with bicarbonate 32 mEq/L",
    "ans": 0,
    "why": "vomiting loses stomach acid and potassium, producing hypokalemia with metabolic alkalosis, which raises the risk of dysrhythmias."
   },
   {
    "t": "Fine, downy hair on her back and arms",
    "ans": 1,
    "why": "lanugo grows when body fat is too low to hold heat; it reflects starvation, not purging."
   },
   {
    "t": "HR 44 and cold intolerance",
    "ans": 1,
    "why": "the body slows its metabolism to save energy in starvation. The trap is calling a resting rate of 44 athletic in a malnourished teen."
   },
   {
    "t": "Has worn glasses for nearsightedness since age 10",
    "ans": 2,
    "why": "nearsightedness that started years before the illness has no link to vomiting or starvation."
   }
  ],
  "why": "Purging and restriction leave different footprints. Vomiting shows up on the hands, the parotid glands and the electrolytes as low potassium with alkalosis. Starvation shows up as the body conserving energy and heat: bradycardia, hypothermia and lanugo. A client can have both patterns at once.",
  "tip": "For each finding, ask what physical process would cause it, then match that process to the behavior."
 },
 {
  "id": "fx-analyze-3",
  "type": "cloze",
  "step": "analyze",
  "sp": "ob",
  "stem": "An 18-hour-old breastfed newborn has yellow skin on the face and chest. The birthing parent's blood type is O positive; the newborn's is A positive. The newborn's direct Coombs test is positive, and the transcutaneous bilirubin is above the 95th percentile for age.",
  "q": "Complete the sentences.",
  "parts": [
   "Jaundice that appears at 18 hours of age is ",
   {
    "opts": [
     "pathologic",
     "physiologic",
     "expected with breastfeeding"
    ],
    "ans": 0,
    "whys": [
     "Yes: normal red cell breakdown takes more than 24 hours to show, so earlier jaundice signals a disease process such as hemolysis.",
     "No: physiologic jaundice appears after 24 hours, peaks around day 3 to 5, and does not come with a positive Coombs test.",
     "No: breastfeeding-related jaundice develops after the first days of life; it does not explain jaundice at 18 hours."
    ]
   },
   ". The blood types point to ",
   {
    "opts": [
     "ABO incompatibility",
     "Rh incompatibility",
     "breast milk jaundice"
    ],
    "ans": 0,
    "whys": [
     "Yes: a type O parent carries anti-A antibodies that can cross the placenta and attack a type A newborn's red cells.",
     "No: both parent and newborn are Rh positive, so there is no Rh antigen mismatch to cause antibody formation.",
     "No: breast milk jaundice appears after the first week and would not produce a positive Coombs test."
    ]
   },
   " as the cause. The positive direct Coombs test shows that ",
   {
    "opts": [
     "maternal antibodies are coating and breaking down the newborn's red blood cells",
     "the newborn's liver is too immature to process bilirubin",
     "the newborn is dehydrated from poor feeding"
    ],
    "ans": 0,
    "whys": [
     "Yes: the direct Coombs test detects antibodies attached to the newborn's red cells, confirming immune-mediated hemolysis.",
     "No: liver immaturity explains physiologic jaundice, but the Coombs test does not measure liver function.",
     "No: dehydration can worsen jaundice, but it does not cause a positive Coombs test."
    ]
   },
   "."
  ],
  "why": "Any visible jaundice in the first 24 hours is pathologic until proven otherwise, because normal red cell breakdown takes longer to show. A type O parent can carry anti-A antibodies that cross the placenta and destroy the type A newborn's cells. The positive Coombs test confirms that antibodies are attached to the newborn's red cells.",
  "tip": "Anchor on timing first: jaundice under 24 hours points to hemolysis, and then look for the lab or blood type that explains it."
 },
 {
  "id": "fx-analyze-4",
  "type": "sata",
  "step": "analyze",
  "sp": "ms",
  "stem": "A 67-year-old is on post-op day 2 after a left total hip replacement. At 14:00 she suddenly says she can't catch her breath and that something is wrong. HR 118 (was 82), RR 30, BP 126/78, SpO₂ 89% on room air (was 97%).",
  "q": "Which findings are consistent with a pulmonary embolism? Select all that apply.",
  "opts": [
   {
    "t": "Sudden shortness of breath at rest",
    "ok": true,
    "why": "Yes: a clot blocking pulmonary blood flow causes abrupt dyspnea, the most common presenting sign of pulmonary embolism."
   },
   {
    "t": "Sharp chest pain that worsens when she breathes in",
    "ok": true,
    "why": "Yes: pleuritic pain occurs when the blocked area of lung irritates the pleura; it fits embolism, not a cardiac cause."
   },
   {
    "t": "Heart rate rising from 82 to 118",
    "ok": true,
    "why": "Yes: tachycardia is the heart compensating for poor oxygenation and increased strain on the right ventricle."
   },
   {
    "t": "SpO₂ falling from 97% to 89% on room air",
    "ok": true,
    "why": "Yes: blood flows past lung tissue that is ventilated but not perfused, so oxygen levels drop suddenly."
   },
   {
    "t": "Productive cough with thick green sputum",
    "ok": false,
    "why": "No: purulent sputum points to pneumonia, which develops gradually with fever, not as a sudden change at rest."
   },
   {
    "t": "Bowel sounds present in all four quadrants",
    "ok": false,
    "why": "No: Active bowel sounds are an expected post-op finding; they say nothing about the lungs or circulation and do not explain a sudden change in breathing."
   },
   {
    "t": "Incision edges together with scant serous drainage",
    "ok": false,
    "why": "No: this is normal healing on day 2 and has no link to her breathing. The trap is selecting a finding just because it is post-op."
   }
  ],
  "why": "Recent hip surgery and immobility place her at high risk for venous thromboembolism. A sudden cluster of dyspnea, pleuritic pain, tachycardia and falling oxygen saturation fits a clot in the pulmonary arteries. Baseline findings and normal wound healing do not explain an abrupt change.",
  "tip": "When a client changes suddenly, pick the findings that are new and fit one mechanism, and leave out baseline or expected findings."
 },
 {
  "id": "fx-eval-1",
  "type": "matrix",
  "step": "eval",
  "sp": "ms",
  "stem": "A 72-year-old was admitted 3 days ago with right lower lobe pneumonia and started on IV ceftriaxone and azithromycin. On admission: temperature 39.2 °C (102.6 °F), WBC 18,500/mm3, RR 28, SpO₂ 91% on 2 L, alert and oriented to person, place, time and situation.",
  "q": "Today's findings are listed below. For each, indicate whether it shows the client has improved, has not changed, or has declined.",
  "cols": [
   "Improved",
   "No change",
   "Declined"
  ],
  "rows": [
   {
    "t": "Temperature 37.3 °C (99.1 °F)",
    "ans": 0,
    "why": "the fever is resolving, which shows the infection is responding to the antibiotics."
   },
   {
    "t": "WBC 10,200/mm3",
    "ans": 0,
    "why": "a falling white count toward normal means the immune response to infection is settling."
   },
   {
    "t": "RR 20, speaking in full sentences",
    "ans": 0,
    "why": "work of breathing has eased, a key sign that the lung is clearing."
   },
   {
    "t": "SpO₂ 91% on 2 L",
    "ans": 1,
    "why": "oxygenation is the same as admission. The trap is calling a stable number improved; it has not moved after 3 days."
   },
   {
    "t": "Oriented to person only",
    "ans": 2,
    "why": "new confusion in an older adult is a decline that can signal hypoxia, sepsis or delirium and must be reported."
   }
  ],
  "why": "Evaluate each finding against the client's own baseline, not against normal ranges alone. Fever, white count and breathing rate show the antibiotics are working, but oxygenation has stalled and mental status has declined. One worsening finding means the plan needs review even when most numbers improve.",
  "tip": "Compare every finding to the admission value before deciding, and treat any new change in mental status as a decline."
 },
 {
  "id": "fx-eval-2",
  "type": "highlight",
  "step": "eval",
  "sp": "ed",
  "stem": "A 28-year-old was brought to the emergency department after being found unresponsive with RR 6 and SpO₂ 78%. The nurse gave naloxone 0.4 mg IV as ordered. Nurse's note, 5 minutes later.",
  "q": "Highlight the findings that show the naloxone was effective.",
  "parts": [
   {
    "t": "Respirations 16 and regular, up from 6.",
    "ok": true,
    "why": "Yes: restoring adequate breathing is the purpose of naloxone, so a normal rate shows the opioid effect was reversed."
   },
   {
    "t": "SpO₂ 96% on room air.",
    "ok": true,
    "why": "Yes: oxygen saturation recovered once ventilation returned, confirming effective reversal."
   },
   {
    "t": "Opens eyes to voice and states his name and where he is.",
    "ok": true,
    "why": "Yes: a return of consciousness and orientation shows the central nervous system depression has reversed."
   },
   {
    "t": "Vomited once; airway clear.",
    "ok": false,
    "why": "No: vomiting is an adverse effect of rapid reversal, not a sign of benefit. It is a reason to protect the airway."
   },
   {
    "t": "Restless, sweating and asking to leave.",
    "ok": false,
    "why": "No: these are opioid withdrawal symptoms caused by reversal. The trap is reading them as success; they are side effects to manage."
   },
   {
    "t": "Needle marks on both forearms.",
    "ok": false,
    "why": "No: this is history that explains the overdose, not an outcome of the treatment."
   }
  ],
  "why": "Naloxone is given to restore breathing and level of consciousness, so those are the findings that show it worked. Vomiting and withdrawal symptoms are adverse effects. Naloxone can wear off before the opioid does, so he still needs close monitoring for repeat respiratory depression.",
  "tip": "Name the goal of the drug first, then highlight only the findings that show that goal was met."
 },
 {
  "id": "fx-eval-3",
  "type": "cloze",
  "step": "eval",
  "sp": "psy",
  "stem": "A 52-year-old admitted to the adult psych unit is in alcohol withdrawal. At 10:00 his CIWA-Ar score was 18, with HR 112, a coarse tremor, sweating and anxiety, and he received lorazepam 2 mg PO. The protocol says give lorazepam for a CIWA-Ar score of 10 or higher and reassess 1 hour after each dose. At 11:00 his score is 7, HR 88, with a fine tremor.",
  "q": "Complete the sentences.",
  "parts": [
   "The 11:00 findings show that his withdrawal symptoms have ",
   {
    "opts": [
     "improved",
     "not changed",
     "worsened"
    ],
    "ans": 0,
    "whys": [
     "Yes: the score fell from 18 to 7 and his heart rate and tremor improved, showing the lorazepam controlled the symptoms.",
     "No: an 11-point drop with a slower heart rate is a clear change, not a stable picture.",
     "No: every measure moved toward normal; worsening would show a rising score or new symptoms."
    ]
   },
   ". The nurse should ",
   {
    "opts": [
     "withhold lorazepam for now and continue CIWA-Ar assessments per protocol",
     "give another 2 mg now to prevent seizures",
     "stop the CIWA-Ar assessments because withdrawal has resolved"
    ],
    "ans": 0,
    "whys": [
     "Yes: a score of 7 is below the dosing threshold of 10, and withdrawal can return, so scheduled reassessment continues.",
     "No: extra doses beyond the protocol risk oversedation and respiratory depression; the score does not call for medication.",
     "No: withdrawal can escalate for 2 to 3 days after the last drink, so stopping assessments would miss a return of symptoms."
    ]
   },
   ". A later finding that would mean the treatment is no longer controlling his withdrawal is ",
   {
    "opts": [
     "new tactile hallucinations and disorientation",
     "sleeping but easy to wake",
     "HR 82 with no tremor"
    ],
    "ans": 0,
    "whys": [
     "Yes: new hallucinations with disorientation signal severe withdrawal or developing delirium tremens and need prompt provider notification.",
     "No: sleeping but easy to wake is an expected, safe effect of benzodiazepine treatment.",
     "No: a normal heart rate without tremor shows withdrawal is still controlled."
    ]
   },
   "."
  ],
  "why": "The score dropped from 18 to 7 and his heart rate and tremor improved, so the dose worked. A score under 10 does not meet the protocol threshold, but withdrawal can escalate over the next 2 to 3 days, so monitoring continues. New hallucinations and disorientation point toward severe withdrawal or delirium tremens.",
  "tip": "Compare the reassessment to both the earlier score and the protocol threshold before choosing the next action."
 },
 {
  "id": "fx-eval-4",
  "type": "matrix",
  "step": "eval",
  "sp": "peds",
  "stem": "A 2-year-old weighing 12 kg (26.4 lb) has gastroenteritis with moderate dehydration: HR 162, capillary refill 4 seconds, no wet diaper in 8 hours, and lethargic. She received a 20 mL/kg normal saline bolus. The nurse reassesses 1 hour later.",
  "q": "For each finding, indicate whether it shows the fluid bolus was effective or ineffective.",
  "cols": [
   "Effective",
   "Ineffective"
  ],
  "rows": [
   {
    "t": "HR 124 while awake",
    "ans": 0,
    "why": "the heart rate fell into the normal range for a toddler as circulating volume was restored."
   },
   {
    "t": "Capillary refill under 2 seconds",
    "ans": 0,
    "why": "brisk refill shows improved perfusion to the skin and extremities."
   },
   {
    "t": "Wet diaper weighing 30 g",
    "ans": 0,
    "why": "about 30 mL in an hour is 2.5 mL/kg/h, above the 1 mL/kg/h goal, so the kidneys are perfused again."
   },
   {
    "t": "Cries with tears",
    "ans": 0,
    "why": "tears return when hydration improves, a simple bedside sign of restored fluid volume."
   },
   {
    "t": "Responds only when her heel is rubbed",
    "ans": 1,
    "why": "she is still responding only to pain, so brain perfusion or another cause such as low glucose needs urgent follow-up."
   }
  ],
  "why": "A fluid bolus is effective when heart rate, perfusion, urine output and mental status move back toward normal. Four findings improved, but a toddler who responds only to pain has not recovered and needs prompt reassessment and provider notification. Weighing diapers (1 g = 1 mL) gives an accurate output.",
  "tip": "Check each finding against the original abnormal value, and remember that mental status is one of the most important outcomes in a child."
 },
 {
  "id": "fx-cues-1",
  "type": "highlight",
  "step": "cues",
  "sp": "teen",
  "stem": "Nurse's note for a 15-year-old admitted to the adolescent unit for depression after telling a school counselor she wanted to die. Day 3.",
  "q": "Highlight the findings that require follow-up.",
  "parts": [
   {
    "t": "Attended morning school group and completed her worksheet.",
    "ok": false,
    "why": "No: participating in programming is expected and does not signal new risk."
   },
   {
    "t": "Ate 75% of lunch.",
    "ok": false,
    "why": "No: adequate intake for a hospitalized teen with depression is not a concern today."
   },
   {
    "t": "During vital signs, three fresh linear scratches noted on her left forearm.",
    "ok": true,
    "why": "Yes: new self-injury on the unit means she has found something sharp and her risk has changed."
   },
   {
    "t": "Gave her journal to her roommate, saying she won't need it anymore.",
    "ok": true,
    "why": "Yes: giving away meaningful belongings with a final-sounding statement is a classic warning sign of suicidal planning."
   },
   {
    "t": "Rates her mood 4/10, unchanged from yesterday.",
    "ok": false,
    "why": "No: a stable low mood is her current baseline; the trap is flagging it over the new behaviors."
   },
   {
    "t": "Slept 7 hours overnight.",
    "ok": false,
    "why": "No: sleep is adequate and unchanged, so it does not need follow-up."
   },
   {
    "t": "Asked staff how many of her pills are kept at the nursing station.",
    "ok": true,
    "why": "Yes: asking about medication supply may signal a plan for overdose and needs direct questions about suicidal intent."
   }
  ],
  "why": "Recognizing cues means separating new or changed findings from the client's baseline. Fresh self-injury, giving away belongings and asking about pill supply are each warning signs, and together they suggest rising suicide risk. Routine participation, intake, sleep and a stable mood rating do not need follow-up.",
  "tip": "Look for what is new or different from baseline, and give extra weight to any behavior that could signal a plan or means for self-harm."
 },
 {
  "id": "fx-cues-2",
  "type": "sata",
  "step": "cues",
  "sp": "ob",
  "stem": "A 12-hour-old term newborn is rooming in with the birthing parent. The nurse completes a routine assessment. The newborn is breastfeeding every 2 to 3 hours.",
  "q": "Which findings require follow-up? Select all that apply.",
  "opts": [
   {
    "t": "Bluish hands and feet with a pink trunk",
    "ok": false,
    "why": "No: acrocyanosis is expected in the first 24 to 48 hours because of immature peripheral circulation."
   },
   {
    "t": "RR 72 with grunting on exhalation",
    "ok": true,
    "why": "Yes: a rate above 60 with grunting signals respiratory distress and needs prompt evaluation."
   },
   {
    "t": "Axillary temperature 36.1 °C (97.0 °F)",
    "ok": true,
    "why": "Yes: A newborn axillary temperature should be about 36.5 to 37.5 °C (97.7 to 99.5 °F); cold stress raises oxygen and glucose use."
   },
   {
    "t": "Tiny white bumps across the nose and chin",
    "ok": false,
    "why": "No: milia are blocked oil glands that are harmless and clear on their own."
   },
   {
    "t": "Yellow skin on the face and chest",
    "ok": true,
    "why": "Yes: visible jaundice before 24 hours of age is pathologic until proven otherwise and needs a bilirubin level."
   },
   {
    "t": "Has not yet passed meconium",
    "ok": false,
    "why": "No: meconium is expected within 24 to 48 hours, so none at 12 hours is still normal."
   },
   {
    "t": "HR 140 while quiet and alert",
    "ok": false,
    "why": "No: 110 to 160 is normal for a newborn, so this rate needs no follow-up."
   }
  ],
  "why": "Many newborn findings that look alarming are normal, so the skill is knowing the expected ranges and timing. Respiratory distress, a low temperature and jaundice in the first 24 hours fall outside normal and need follow-up. Acrocyanosis, milia, a normal heart rate and no meconium yet at 12 hours are expected.",
  "tip": "For each finding, ask whether it is normal for this age in hours, since timing often decides whether a newborn finding is expected."
 },
 {
  "id": "fx-act-1",
  "type": "sata",
  "step": "act",
  "sp": "ed",
  "stem": "A 27-year-old is brought in after friends found him unresponsive in a bathroom with a syringe nearby. RR 6 and shallow, SpO₂ 82% on room air, pupils pinpoint, HR 58, BP 100/62. He has a carotid pulse. Naloxone is ordered.",
  "q": "Which actions should the nurse take now? Select all that apply.",
  "opts": [
   {
    "t": "Open the airway and ventilate with a bag-valve mask and oxygen",
    "ok": true,
    "why": "Yes: He is barely breathing, and hypoxia is what kills in an overdose. Rescue breaths restore oxygen while the naloxone takes effect."
   },
   {
    "t": "Give naloxone IV or intranasal as ordered",
    "ok": true,
    "why": "Yes: Pinpoint pupils, a slow respiratory rate and a syringe point to opioids; naloxone reverses the respiratory depression."
   },
   {
    "t": "Place him on continuous pulse oximetry and cardiac monitoring",
    "ok": true,
    "why": "Yes: Continuous monitoring shows right away whether oxygenation improves and catches arrhythmias from hypoxia."
   },
   {
    "t": "Repeat naloxone every 2 to 3 minutes if his breathing does not improve",
    "ok": true,
    "why": "Yes: One dose may not be enough for potent opioids such as fentanyl, so repeat doses are standard until he breathes adequately."
   },
   {
    "t": "Start chest compressions",
    "ok": false,
    "why": "No: He has a pulse. Compressions are for cardiac arrest; with a pulse, the priority is ventilation and naloxone."
   },
   {
    "t": "Give flumazenil to reverse the sedation",
    "ok": false,
    "why": "No: Flumazenil reverses benzodiazepines, not opioids, and can trigger seizures in people who use sedatives regularly. The trap is treating sedation in general."
   },
   {
    "t": "Turn him on his side and let him sleep it off",
    "ok": false,
    "why": "No: Positioning protects against aspiration but does nothing for an RR of 6. Waiting lets the hypoxia worsen toward arrest."
   }
  ],
  "why": "An unresponsive client with pinpoint pupils and an RR of 6 needs breathing support and naloxone at the same time. Ventilate first if needed, give naloxone, monitor, and repeat the dose if breathing stays inadequate. Compressions are only for a client without a pulse.",
  "tip": "When a stem gives you a pulse, rule out CPR options and look for the actions that fix the airway and breathing."
 },
 {
  "id": "fx-act-2",
  "type": "matrix",
  "step": "act",
  "sp": "ob",
  "stem": "A client at 38 weeks in active labor has spontaneous rupture of membranes. The nurse sees a loop of umbilical cord at the vaginal opening, and the fetal heart rate falls from 140 to 70 bpm. Oxytocin is infusing at 6 milliunits/min.",
  "q": "For each action, indicate whether it is indicated, contraindicated, or non-essential right now.",
  "cols": [
   "Indicated",
   "Contraindicated",
   "Non-essential"
  ],
  "rows": [
   {
    "t": "Insert a gloved hand and lift the presenting part off the cord",
    "ans": 0,
    "why": "Relieving pressure on the cord restores blood flow to the fetus; the hand stays in place until the cesarean birth."
   },
   {
    "t": "Place the client in knee-chest or steep Trendelenburg position",
    "ans": 0,
    "why": "Gravity moves the presenting part away from the cord and reduces compression."
   },
   {
    "t": "Push the cord back into the vagina",
    "ans": 1,
    "why": "Handling the cord causes vasospasm and more compression. Leave it and cover any exposed cord with sterile saline-moistened gauze."
   },
   {
    "t": "Increase the oxytocin to speed the delivery",
    "ans": 1,
    "why": "Contractions compress the cord further. The oxytocin should be stopped, not increased."
   },
   {
    "t": "Call for help and prepare for an emergency cesarean birth",
    "ans": 0,
    "why": "Prolapsed cord with fetal bradycardia needs the fastest possible delivery, usually by cesarean."
   },
   {
    "t": "Review her prenatal record for rubella immunity",
    "ans": 2,
    "why": "Rubella status matters for postpartum vaccination, not for the next few minutes of this emergency."
   }
  ],
  "why": "A prolapsed cord is compressed between the presenting part and the pelvis, cutting off fetal oxygen. Lift the presenting part, reposition the client, stop the oxytocin and get help for an immediate birth. Anything that does not relieve cord pressure waits.",
  "tip": "In an emergency matrix, ask of each row: does this change the outcome in the next few minutes? If not, it is non-essential."
 },
 {
  "id": "fx-act-3",
  "type": "cloze",
  "step": "act",
  "sp": "sd",
  "stem": "A 68-year-old on post-op day 3 after coronary artery bypass grafting is suddenly in atrial fibrillation with a rate of 148. BP 86/50 (124/72 an hour ago); he is dizzy and pale. The nurse calls the provider using SBAR.",
  "q": "Complete the sentences.",
  "parts": [
   "The nurse opens with the Situation: ",
   {
    "opts": [
     "this is the step-down nurse calling about the client in room 12, who is in new atrial fibrillation at 148 with a BP of 86/50 and is dizzy",
     "he had bypass surgery 3 days ago and has a history of hypertension and diabetes",
     "I think he might need something for his heart rate when you have a chance"
    ],
    "ans": 0,
    "whys": [
     "Yes: The Situation states who is calling, which client, and the current problem with the key numbers, so the provider grasps urgency in one sentence.",
     "No: Surgical history is Background. Opening with it buries the new rhythm and low blood pressure the provider needs to hear first.",
     "No: A vague, low-urgency request hides an unstable client and invites a delayed response."
    ]
   },
   ". For the Assessment, the nurse says: ",
   {
    "opts": [
     "I think he is becoming unstable from the rapid rate",
     "his pain is controlled and he ate most of his breakfast",
     "he is probably anxious about going home"
    ],
    "ans": 0,
    "whys": [
     "Yes: The Assessment is the nurse's interpretation: a rapid rate with hypotension and dizziness means he is becoming unstable.",
     "No: True but irrelevant to the problem; it distracts from the hemodynamic change.",
     "No: Attributing new hypotension and dizziness to anxiety is premature closure and misses an unstable rhythm."
    ]
   },
   ". The nurse ends with the Recommendation: ",
   {
    "opts": [
     "please come see him now; should I bring the defibrillator for synchronized cardioversion?",
     "could you order something to help him sleep tonight?",
     "I will recheck his vital signs in 4 hours and call if anything changes"
    ],
    "ans": 0,
    "whys": [
     "Yes: The Recommendation is a specific request: bedside evaluation now, and readiness for synchronized cardioversion, the ACLS treatment for unstable tachycardia.",
     "No: A sleep aid could lower his blood pressure further and does not address the rhythm.",
     "No: A 4-hour recheck is far too long for a hypotensive client in rapid atrial fibrillation; this is a plan to wait, not a recommendation."
    ]
   }
  ],
  "why": "SBAR puts the most important information first: who is calling, about whom, and what is wrong now. New rapid atrial fibrillation with low blood pressure and dizziness is unstable, so the assessment names that and the recommendation asks for bedside evaluation and prepares for cardioversion.",
  "tip": "In SBAR items, the Situation is the current problem in one sentence; history belongs in Background, and the Recommendation must be a specific request."
 },
 {
  "id": "fx-act-4",
  "type": "sata",
  "step": "act",
  "sp": "psy",
  "stem": "A 35-year-old with schizophrenia is pacing the dayroom with clenched fists, shouting that staff are poisoning his food. He has not hit anyone. Two other clients are watching nearby. He has an order for PRN oral olanzapine for agitation.",
  "q": "Which actions should the nurse take? Select all that apply.",
  "opts": [
   {
    "t": "Speak in a calm, low voice using short, simple sentences",
    "ok": true,
    "why": "Yes: A calm tone and simple words are easier to process when someone is agitated and paranoid, and they model the control you want."
   },
   {
    "t": "Stand at an angle, more than an arm's length away, with a clear path to the exit",
    "ok": true,
    "why": "Yes: Space feels less threatening to him and keeps the nurse safe; never let the client block your way out."
   },
   {
    "t": "Ask the other clients to move to another area",
    "ok": true,
    "why": "Yes: Fewer onlookers lowers stimulation for him and protects the peers if he escalates."
   },
   {
    "t": "Offer the PRN oral medication as a choice",
    "ok": true,
    "why": "Yes: Offering oral medication voluntarily is a less restrictive step that respects his autonomy and often works."
   },
   {
    "t": "Touch his shoulder to reassure him",
    "ok": false,
    "why": "No: Touch can feel like an attack to a paranoid, agitated client and may provoke the assault you are trying to prevent."
   },
   {
    "t": "Explain why his belief about the food is false",
    "ok": false,
    "why": "No: Arguing with a delusion increases defensiveness. Acknowledge his fear without agreeing or debating the content."
   },
   {
    "t": "Place him in seclusion now to prevent an assault",
    "ok": false,
    "why": "No: Seclusion is for imminent danger after less restrictive measures fail. He has not hurt anyone, so de-escalation comes first."
   }
  ],
  "why": "Escalating agitation without violence calls for verbal de-escalation and the least restrictive option. Keep a safe distance, lower the stimulation, use simple calm statements and offer medication as a choice. Touch, argument and premature seclusion all escalate.",
  "tip": "For psych safety items, choose the least restrictive action that still keeps everyone safe."
 },
 {
  "id": "fx-solve-1",
  "type": "matrix",
  "step": "solve",
  "sp": "ms",
  "stem": "On a busy med-surg day shift, an RN is working with an LPN and an unlicensed assistive personnel (UAP). All clients on the list except the new admission have been stable for at least 24 hours.",
  "q": "For each task, indicate the most appropriate team member to perform it.",
  "cols": [
   "RN",
   "LPN",
   "UAP"
  ],
  "rows": [
   {
    "t": "Admission assessment of a client just arrived from the ED with pneumonia",
    "ans": 0,
    "why": "Initial assessment of a new, not-yet-stable client is an RN responsibility that cannot be delegated."
   },
   {
    "t": "Discharge teaching for a client going home on a new insulin regimen",
    "ans": 0,
    "why": "Initial teaching requires assessing learning needs and evaluating understanding, which belong to the RN. LPNs reinforce teaching."
   },
   {
    "t": "Give scheduled oral medications to a stable client with chronic heart failure",
    "ans": 1,
    "why": "Giving routine medications to a stable client with predictable outcomes is within LPN scope."
   },
   {
    "t": "Change the dressing on a stable client's healing surgical incision",
    "ans": 1,
    "why": "A routine dressing change on a stable wound is an LPN skill; it is a sterile procedure, so it is beyond UAP scope."
   },
   {
    "t": "Measure and record intake and output for a stable client",
    "ans": 2,
    "why": "Measuring and recording is a routine task the UAP can do; the RN interprets the numbers."
   },
   {
    "t": "Help a stable post-op day 3 client walk in the hall",
    "ans": 2,
    "why": "Ambulating a stable client who has already walked safely is a standard UAP task."
   }
  ],
  "why": "Under NCSBN delegation guidelines, the RN keeps assessment, initial teaching, evaluation and any unstable client. LPNs care for stable clients with predictable outcomes, including medications and routine procedures. UAPs perform routine care such as vital signs on stable clients, intake and output, hygiene and ambulation.",
  "tip": "Remember that the RN cannot delegate the parts of the nursing process that require judgment: assess, teach, evaluate, and anything unstable."
 },
 {
  "id": "fx-solve-2",
  "type": "matrix",
  "step": "solve",
  "sp": "peds",
  "stem": "A 9-year-old (30 kg) is on post-op day 1 after a laparoscopic appendectomy for a ruptured appendix. At 10:00 he falls asleep mid-sentence (POSS 3), RR 12 and shallow, SpO₂ 95% on room air. Urine output is 0.4 mL/kg/h over the last 4 hours. He rates his pain 4/10 when roused, denies nausea and has no allergies.",
  "q": "For each medication due or available at 10:00, indicate whether the nurse should give it or hold it.",
  "cols": [
   "Give",
   "Hold"
  ],
  "rows": [
   {
    "t": "Morphine 1.5 mg IV every 3 hours PRN pain",
    "ans": 1,
    "why": "A POSS of 3 with a slow, shallow RR means too much opioid already. Hold it, stay with him, and notify the provider."
   },
   {
    "t": "Acetaminophen 450 mg IV every 6 hours, scheduled; last dose at 04:00",
    "ans": 0,
    "why": "It is due, the dose is 15 mg/kg, and it treats pain without depressing breathing."
   },
   {
    "t": "Ibuprofen 300 mg PO every 6 hours PRN pain (hold for urine output under 1 mL/kg/h)",
    "ans": 1,
    "why": "His urine output of 0.4 mL/kg/h is below the hold parameter, and NSAIDs can worsen kidney injury when perfusion is low."
   },
   {
    "t": "Piperacillin-tazobactam IV every 8 hours, due at 10:00",
    "ans": 0,
    "why": "A ruptured appendix needs on-time antibiotics, and he has no allergies. Report the low urine output since dosing may need review."
   },
   {
    "t": "Ondansetron 3 mg IV every 8 hours PRN nausea",
    "ans": 1,
    "why": "He denies nausea, so the PRN is not indicated right now; giving it would add a drug without a reason."
   }
  ],
  "why": "Check every medication against the client's current condition and the exact hold parameter. Sedation comes before respiratory depression, so a POSS of 3 means no more opioid. Low urine output rules out the NSAID, while scheduled non-sedating analgesia and antibiotics continue.",
  "tip": "Compare each order's parameter to the stem's numbers before deciding; PRN medications are given only when their indication is present."
 },
 {
  "id": "fx-solve-3",
  "type": "sata",
  "step": "solve",
  "sp": "teen",
  "stem": "A 15-year-old is admitted to the adolescent unit after an intentional acetaminophen overdose and is now medically cleared. She says she does not care either way about being alive, and asks the nurse not to tell her parents anything she shares. Orders include safety checks every 15 minutes.",
  "q": "Which interventions belong in her plan of care? Select all that apply.",
  "opts": [
   {
    "t": "Search her room and belongings and remove ligature risks and sharps",
    "ok": true,
    "why": "Yes: Removing the means is one of the most effective ways to prevent suicide on a unit. Her ambivalence about living means risk is ongoing."
   },
   {
    "t": "Ask her directly about suicidal thoughts, plan and intent every shift",
    "ok": true,
    "why": "Yes: Asking directly does not plant the idea; it is how risk is tracked and how changes are caught early."
   },
   {
    "t": "Explain that her privacy is respected but safety concerns will be shared with the team and her parents",
    "ok": true,
    "why": "Yes: Honest limits of confidentiality build trust. A minor's safety information has to be shared with the team and guardians."
   },
   {
    "t": "Before discharge, teach her parents to lock up medications and remove firearms at home",
    "ok": true,
    "why": "Yes: Means restriction at home is a core part of discharge safety planning, especially after an overdose."
   },
   {
    "t": "Have her sign a no-suicide contract as the main safety measure",
    "ok": false,
    "why": "No: No-suicide contracts have no proven protective value and can give staff false reassurance. Assessment and a safety plan replace them."
   },
   {
    "t": "Let her keep her belt and phone charger because she seems calm",
    "ok": false,
    "why": "No: Calm behavior does not lower risk after an attempt; these are ligature risks. Appearing calm can even mean a decision has been made."
   },
   {
    "t": "Promise to keep what she says secret so she keeps talking",
    "ok": false,
    "why": "No: A promise you cannot keep breaks trust later and may delay sharing a safety concern that protects her life."
   }
  ],
  "why": "The plan for an adolescent after a suicide attempt centers on environmental safety, frequent direct assessment, honest limits of confidentiality and means restriction at home. No-suicide contracts and secrecy are common traps because they feel supportive but do not protect the client.",
  "tip": "For suicide-risk plans, favor options that remove means and keep the team informed over options that rely on the client's promise."
 },
 {
  "id": "fx-hypo-1",
  "type": "bowtie",
  "step": "hypo",
  "sp": "peds",
  "stem": "A 10-month-old has had episodes of sudden, inconsolable crying with his knees drawn to his chest every 15 to 20 minutes, and is calm between episodes. He has vomited three times today and just passed a stool that looks like red currant jelly. A sausage-shaped mass is felt in the right upper abdomen. T 37.5 °C (99.5 °F).",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Intussusception",
    "Acute gastroenteritis",
    "Infant colic",
    "Pyloric stenosis"
   ],
   "ans": 0
  },
  "actions": {
   "opts": [
    "Notify the provider and prepare for an image-guided air or contrast enema",
    "Keep him NPO and start IV fluids as ordered",
    "Give oral rehydration solution in small, frequent sips",
    "Give a glycerin suppository to clear the stool",
    "Teach the parents soothing techniques for colic"
   ],
   "ans": [
    0,
    1
   ]
  },
  "params": {
   "opts": [
    "Passage of a normal brown stool",
    "Signs of peritonitis such as a rigid abdomen, fever or lethargy",
    "Head circumference",
    "Serum lipase",
    "Developmental milestones"
   ],
   "ans": [
    0,
    1
   ]
  },
  "whys": {
   "cond": [
    "Yes: Colicky pain with knees drawn up, vomiting, currant jelly stool and a sausage-shaped mass is the classic triad and picture of intussusception.",
    "No: Gastroenteritis causes watery diarrhea, not a palpable mass and currant jelly stool. Calling it a stomach bug is the trap that delays reduction.",
    "No: Colic does not cause bloody mucus stools, vomiting or an abdominal mass, and it usually ends by 3 to 4 months of age.",
    "No: Pyloric stenosis presents at 2 to 8 weeks with projectile nonbilious vomiting and an olive-shaped mass, not bloody stools."
   ],
   "actions": [
    "Yes: An air or contrast enema both confirms and often reduces the intussusception, so the provider needs to know now.",
    "Yes: Vomiting and possible bowel obstruction mean nothing by mouth; IV fluids correct losses and prepare him for the procedure or surgery.",
    "No: Oral fluids are contraindicated with a suspected obstruction and vomiting. The trap is treating this like routine dehydration.",
    "No: Laxatives and suppositories are not given for a suspected obstruction and can raise the risk of perforation.",
    "No: Labeling this colic misses a surgical emergency in which the bowel can lose its blood supply."
   ],
   "params": [
    "Yes: A normal brown stool before the procedure can mean the bowel reduced on its own, so report it right away.",
    "Yes: Perforation and bowel necrosis are the dangerous complications; fever, a rigid abdomen or worsening lethargy need immediate escalation.",
    "No: Head circumference tracks brain growth and hydrocephalus, which are unrelated to this problem.",
    "No: Lipase is a pancreatitis marker and does not help track an intussusception.",
    "No: Milestones are a routine well-child measure, not a parameter that shows whether this emergency is improving."
   ]
  },
  "why": "Intermittent severe pain, vomiting, currant jelly stool and a sausage-shaped mass make intussusception the most likely and most urgent problem. The bowel can become ischemic, so the child is kept NPO with IV fluids while the team prepares for reduction. Watch for spontaneous reduction and for signs of perforation.",
  "tip": "When a stem lists a classic cluster of findings, pick the condition that explains all of them, not just the most common one."
 },
 {
  "id": "fx-hypo-2",
  "type": "cloze",
  "step": "hypo",
  "sp": "ed",
  "stem": "Four clients check in at the ED triage desk within 5 minutes: a 45-year-old with an oozing forearm laceration, BP 132/80; a 30-year-old with ankle swelling after a fall who can bear weight; a 58-year-old with diabetes who has had epigastric discomfort and nausea for 40 minutes, is diaphoretic, HR 108; and a 22-year-old with a sore throat, T 38.4 °C (101.2 °F), swallowing normally.",
  "q": "Complete the sentence.",
  "parts": [
   "The client the nurse should see first is the ",
   {
    "opts": [
     "58-year-old with epigastric discomfort",
     "45-year-old with the forearm laceration",
     "22-year-old with a fever and sore throat"
    ],
    "ans": 0,
    "whys": [
     "Yes: Epigastric discomfort, nausea, sweating and tachycardia in a 58-year-old with diabetes may be a myocardial infarction, the most time-critical problem here.",
     "No: An oozing laceration with a normal BP is controlled bleeding; direct pressure can be applied while the nurse sees the cardiac client.",
     "No: A fever with normal swallowing and no airway signs is uncomfortable but stable, so it can wait for routine triage."
    ]
   },
   " because ",
   {
    "opts": [
     "the symptoms may be an atypical acute coronary syndrome, which needs an ECG within 10 minutes",
     "any bleeding wound is the highest priority",
     "a fever over 38.3 °C (101 °F) means the client is septic"
    ],
    "ans": 0,
    "whys": [
     "Yes: Clients with diabetes often have atypical MI symptoms, and an ECG within 10 minutes of arrival is the standard for possible acute coronary syndrome.",
     "No: Only uncontrolled or major bleeding is a top priority; oozing from a forearm wound with stable vitals is not.",
     "No: Fever alone does not equal sepsis. The trap is reacting to the number instead of the overall picture."
    ]
   },
   "."
  ],
  "why": "Clients with diabetes, especially women and older adults, often present with acute coronary syndrome as epigastric pain, nausea and sweating rather than chest pain. A possible MI is time-critical, so it outranks a controlled laceration, a stable ankle injury and a fever with a normal airway.",
  "tip": "When ranking clients, look for the one whose problem could kill or cause permanent harm fastest, even if the complaint sounds minor."
 },
 {
  "id": "fx-hypo-3",
  "type": "cloze",
  "step": "hypo",
  "sp": "teen",
  "stem": "At 07:00 on an adolescent psych unit, the nurse gets report on three clients: a 16-year-old with anorexia nervosa whose HR is 38 lying down and who nearly fainted standing up for her weigh-in; a 14-year-old who yelled at staff and threw a pillow after a phone call with her father and is now sitting in her room; and a 15-year-old with depression who rates her self-harm urges 5/10, down from 8/10 yesterday, with no new injuries.",
  "q": "Complete the sentence.",
  "parts": [
   "The client most at risk right now is the ",
   {
    "opts": [
     "16-year-old with anorexia nervosa",
     "14-year-old who threw a pillow",
     "15-year-old with self-harm urges"
    ],
    "ans": 0,
    "whys": [
     "Yes: Her heart rate of 38 with near-fainting makes her medically unstable, the most immediate threat to life on this list.",
     "No: She is now calm and in her room. The outburst needs follow-up, but it is not an active danger.",
     "No: Her urges are decreasing and there are no new injuries; she needs reassessment but is improving."
    ]
   },
   " because ",
   {
    "opts": [
     "a heart rate under 40 with near-fainting signals medical instability that can progress to a fatal arrhythmia",
     "a slow heart rate is expected in clients who restrict food and exercise",
     "throwing an object predicts an imminent assault on staff"
    ],
    "ans": 0,
    "whys": [
     "Yes: Severe bradycardia and orthostatic symptoms in anorexia nervosa reflect cardiac compromise and can lead to arrhythmia and sudden death.",
     "No: A low resting rate can be normal in trained athletes, but under 40 with near-syncope is never expected. This is the normalization trap.",
     "No: One thrown pillow after a stressful call that has since settled does not predict imminent assault."
    ]
   },
   "."
  ],
  "why": "Severe bradycardia with orthostatic near-syncope in anorexia nervosa is a sign of medical instability and a criterion for medical admission. The angry client has already calmed in her room, and the client with self-harm urges is improving with no new injuries, so both can be seen after the medically unstable client.",
  "tip": "On psych units, a physiological threat usually outranks a behavioral one that has already settled."
 }
];
