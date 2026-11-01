/* The Shift — more floor calls: transition to practice (pp-, every unit) and unit clinical calls (fc-). Same shape and
   scoring as the POOL in floor.js, which they join at load. Needs nurse review before launch. */
(function (S) {
  if (!S.floor) return;
  S.floor.POOL.push(...[
 { "id": "icu-aline", "k": ["icu"], "from": "fl-rn", "title": "A flat line", "dom": "assess", "cost": 3, "exp": 15,
  "ping": "{rn}, from bed 715: \"Can you look at this before I go up on the norepi?\"",
  "text": "Her arterial line reads 72/58, MAP 63, and the waveform looks rounded and flat, with no notch. A cuff pressure two minutes ago was 104/62. The order says titrate norepinephrine to MAP 65 or higher.",
  "q": "What do you tell her?",
  "opts": [
   { "t": "Don't titrate yet. Check the line: flush it, look for bubbles, clots or a kink, re-level and zero at the phlebostatic axis, then compare with the cuff", "v": 2, "fb": "A damped waveform reads falsely low systolic and narrow. Fix the line first, then treat the patient, not the number." },
   { "t": "Go up on the norepinephrine. The arterial line is more accurate than a cuff", "v": -1, "fb": "Only when the waveform is good. A damped line under-reads the pressure, and chasing it with a vasopressor gives a patient with a decent pressure too much drug." },
   { "t": "Titrate by the cuff pressure from now on and leave the arterial line alone", "v": 0, "fb": "The cuff is a useful check, but the arterial line is there for beat-to-beat pressure in shock. Troubleshoot it rather than abandon it." },
   { "t": "Recheck the cuff and call the provider about the difference", "v": 1, "fb": "A reasonable step, but troubleshooting the line is a nursing skill you can do in two minutes before calling." }
  ],
  "teach": "Before you act on an invasive pressure, check the waveform. Damped: flush, check for air, clots and kinks, level the transducer to the phlebostatic axis (4th intercostal space, mid-axillary line) and zero it, then compare with a cuff.",
  "miss": { "text": "The norepinephrine went up for a damped arterial line until Nova caught it.", "why": "A flat, rounded waveform means the line is lying, not the patient." } },
 { "id": "icu-selfext", "k": ["icu"], "from": "@cna", "title": "Reaching", "dom": "safety", "cost": 3, "exp": 10, "must": true,
  "ping": "{cna}: \"The man in 716 keeps grabbing at his breathing tube. Dee's at lunch.\"",
  "text": "He's intubated, sedation was lightened for an awakening trial an hour ago, and he has one hand on the tube. No restraint order. His RASS is +2 and he's looking around wildly.",
  "q": "What do you do?",
  "opts": [
   { "t": "Go now: hold his hand away from the tube, reorient him calmly, check the tube's position, and call his nurse's cover and the provider about sedation and delirium", "v": 2, "fb": "Presence first: an unplanned extubation can happen in seconds. Then treat the cause (pain, delirium, fear) and get the team involved." },
   { "t": "Tell {cna} to tie his wrists to the bed until Dee gets back", "v": -1, "fb": "Restraints need an order, a reason that less restrictive measures failed, and monitoring. A tech can't decide on them and you can't delegate that." },
   { "t": "Restart his sedation at the old rate", "v": 0, "fb": "Maybe, eventually, by order and protocol. But he needs someone at the bedside now, and a quick look at why he's agitated." },
   { "t": "Ask {cna} to stay with him and keep his hands down while you find Dee", "v": 1, "fb": "Better than nothing, but an RN needs to assess him now: tube position, oxygenation, pain and delirium are nursing judgments." }
  ],
  "teach": "Agitation on a ventilator is a safety emergency and a symptom. Be at the bedside, protect the airway, then look for the cause (pain, delirium, hypoxia, a full bladder) with the ABCDEF bundle. Restraints are a last resort and need an order.",
  "miss": { "text": "The patient in 716 pulled out his breathing tube.", "why": "Unplanned extubation is a preventable airway emergency; a call like this needs a nurse at the bedside right away." } },
 { "id": "icu-cvc-out", "k": ["icu"], "from": "fl-rn", "title": "Line out", "dom": "safety", "cost": 3, "exp": 20,
  "ping": "{rn}: \"Quick one. I'm pulling a central line and he wants to sit up for it. Fine?\"",
  "text": "It's an internal jugular line, no longer needed. The patient is alert, breathing comfortably, and asks to sit on the edge of the bed while it comes out.",
  "q": "What do you tell her?",
  "opts": [
   { "t": "Lie him flat or slightly head down, have him hold his breath or bear down as it comes out, then pressure and an occlusive dressing, and keep him flat for 30 minutes", "v": 2, "fb": "Positioning and a Valsalva raise the pressure in the chest so air can't be pulled into the vein. The occlusive dressing seals the tract." },
   { "t": "Sitting is fine if he's comfortable. Just put gauze on it", "v": -1, "fb": "Sitting up lowers venous pressure in the neck; a breath in as the catheter leaves can pull air in. An air embolism can be fatal." },
   { "t": "Have him take a deep breath in as you pull", "v": 0, "fb": "That's backward. Inhaling lowers intrathoracic pressure and invites air in. Exhale or bear down." },
   { "t": "Lie him flat and use an occlusive dressing", "v": 1, "fb": "Good, but add a Valsalva or a held breath at the moment of removal, and keep him lying down for a while after." }
  ],
  "teach": "Removing a central line: supine or Trendelenburg, Valsalva or exhalation at removal, firm pressure, an occlusive dressing, and a period lying flat. Watch for sudden dyspnea, chest pain or hypotension (air embolism)." },
 { "id": "icu-insulin-low", "k": ["icu", "med"], "from": "@cna", "title": "Low sugar", "dom": "meds", "cost": 2, "exp": 12,
  "ping": "{cna}: \"The man in 715 on the insulin drip just checked at 58.\"",
  "text": "He's on an IV insulin infusion by protocol, NPO, with no dextrose running. He's sweaty and a little confused. His nurse is in another room.",
  "q": "What do you do?",
  "opts": [
   { "t": "Stop the insulin infusion, give IV dextrose per the hypoglycemia protocol, recheck in 15 minutes, and tell his nurse and the provider", "v": 2, "fb": "On an infusion, the first move is to stop the source, then treat with IV dextrose because he's NPO and confused, then recheck." },
   { "t": "Give him orange juice", "v": -1, "fb": "He's NPO and confused: oral fluids risk aspiration. IV dextrose per protocol is the route here." },
   { "t": "Turn the insulin rate down by half and recheck in an hour", "v": 0, "fb": "A glucose of 58 with symptoms needs the infusion stopped and treatment now, and a recheck in 15 minutes, not an hour." },
   { "t": "Recheck the glucose to make sure it's real", "v": 1, "fb": "A quick recheck is fine if it doesn't delay treatment. With symptoms, treat first and confirm after." }
  ],
  "teach": "Hypoglycemia on an insulin infusion: stop the infusion, treat per protocol (IV dextrose if NPO or impaired), recheck in 15 minutes, notify, and find the cause (missed feeding, a stopped dextrose line, a protocol error)." },

 {
  "id": "pp-unsafe-assign",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-clerk",
  "title": "Two more",
  "dom": "judgment",
  "cost": 3,
  "exp": 20,
  "ping": "Pat: \"Nova says you're taking the next two admissions. Both are coming up now.\"",
  "after": "Nova: \"I moved both admissions to the float nurse. Your assignment stays as it is.\"",
  "text": {
   "med": "You already have a full assignment, and the hall has a heparin drip and a fresh post-op that aren't yours to hand off. Two more means two new insulin drips on top of it. Two nurses called out and no one has been called in.",
   "psych": "You already have a full assignment, and the unit has two patients on one-to-one observation with sitters due for breaks. Two more admissions, one coming in restrained from the ED. Two nurses called out.",
   "peds": "You already have a full assignment, including an infant on hourly respiratory checks. Two more means two more children under two on IV fluids. Two nurses called out.",
   "ob": "You already have a full assignment. Two more couplets means four more patients, one mom with a postpartum hemorrhage earlier today. Two nurses called out.",
   "ed": "Your beds are full, one patient on a titrating drip waiting for an ICU bed. Two more ambulances are about to roll into your section. Two nurses called out."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Tell Nova exactly what makes it unsafe and ask for changes or help. If it stands, take it, escalate to the house supervisor, and file an assignment despite objection form if your facility uses one",
    "v": 2,
    "fb": "Specific concerns give Nova something to act on. Taking the patients keeps them safe; the objection form documents the problem without leaving anyone uncovered."
   },
   {
    "t": "Take it and ask Nova for help with the admissions",
    "v": 1,
    "fb": "Taking it and asking for help is reasonable, but say what makes it unsafe and document it. If no one hears it, the staffing problem stays invisible."
   },
   {
    "t": "Take it quietly and skip your break to make it work",
    "v": 0,
    "fb": "Silence hides an unsafe assignment and burns you out. Speak up through the chain of command."
   },
   {
    "t": "Refuse it, hand your keys to Nova and leave",
    "v": -1,
    "fb": "You've already accepted patients this shift. Walking out without handoff is patient abandonment in most states, which can cost your license."
   }
  ],
  "teach": "If an assignment seems unsafe, say why specifically, use the chain of command, and document your objection (an assignment despite objection form, where your facility or union uses one). Once you've accepted patients, leaving without a proper handoff can be abandonment (ANA Code of Ethics Provision 6; how abandonment is defined varies by state board and facility)."
 },
 {
  "id": "pp-abusive-provider",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-clerk",
  "title": "At the desk",
  "dom": "comm",
  "cost": 2,
  "exp": 18,
  "ping": "Pat: \"Dr. Lowe is at the desk. He wants the nurse who paged him.\"",
  "text": "You paged about a blood pressure of 88/50. In front of the desk and two families he shouts: \"Do you even know what you're doing? Don't page me for garbage.\" He turns to leave. The patient's pressure is still 88/50.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Stay calm, say you need to finish this patient's issue, give a brief SBAR, then report his behavior to Nova and through the safety reporting system",
    "v": 2,
    "fb": "The patient's problem still needs an answer, so get it. Then report the behavior: it is a safety problem, not a personality conflict."
   },
   {
    "t": "Let him go and page the backup provider about the pressure",
    "v": 1,
    "fb": "The patient gets seen, which matters most. But unreported, the behavior will repeat with the next new nurse."
   },
   {
    "t": "Tell him off in front of everyone",
    "v": 0,
    "fb": "Understandable, but a shouting match in front of families makes things worse. Set a calm boundary and use the reporting process."
   },
   {
    "t": "Don't page him again tonight, whatever happens",
    "v": -1,
    "fb": "That is exactly how disruptive behavior harms patients: nurses stop calling. A low pressure needs a provider."
   }
  ],
  "teach": "Intimidating and disruptive behavior undermines safety, and the Joint Commission requires hospitals to have a process to address it. Stay focused on the patient, set a calm boundary, and report it through the chain of command (ANA Code of Ethics Provision 1 covers respect among colleagues)."
 },
 {
  "id": "pp-diversion",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "@cna",
  "title": "A pattern",
  "dom": "safety",
  "cost": 3,
  "exp": 20,
  "ping": "{cna} pulls you aside: \"Can I tell you something about Jordan?\"",
  "text": "\"Every patient Jordan has says their pain meds do nothing. He's pulled the max PRN on all of them, every shift. And Ms. Ortega said she never saw him waste anything, but her name is on the waste.\" You've noticed his breaks are long and he volunteers for every patient on opioids.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Tell Nova or the manager now, with the specific facts, and let them follow the diversion policy",
    "v": 2,
    "fb": "Unrelieved pain and unwitnessed wastes are classic signs of diversion. Facts to the right people protects patients, and often gets the nurse help."
   },
   {
    "t": "Ask pharmacy to quietly look at his cabinet pulls",
    "v": 1,
    "fb": "Pharmacy runs these audits, so it's a real step. But the manager needs to know too, because his patients are in pain now."
   },
   {
    "t": "Confront Jordan privately and ask what's going on",
    "v": 0,
    "fb": "Confronting him can tip him off, put you at risk, and delay protection for his patients. Let leadership handle it."
   },
   {
    "t": "Stay out of it. You don't have proof",
    "v": -1,
    "fb": "You don't need proof to report a concern. His patients are hurting and he may be impaired at the bedside."
   }
  ],
  "teach": "Diversion harms patients through untreated pain, impaired care and sometimes tampered drugs. Report suspicion to your manager per policy; don't investigate yourself. Many boards offer alternative to discipline programs (ANA Code of Ethics Provision 3; reporting rules vary by state)."
 },
 {
  "id": "pp-med-error",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-pharm",
  "title": "Twice the dose",
  "dom": "meds",
  "cost": 3,
  "exp": 15,
  "ping": "Rene, from pharmacy, about a dose you gave an hour ago.",
  "text": {
   "med": "\"You pulled two 25 mg metoprolol tabs for Mr. Petrov. The order is 25 mg, not 50.\" You check: you gave both. Your mistake.",
   "psych": "\"You pulled two 1 mg tabs of lorazepam for Mr. Pruitt. The order is 1 mg, not 2.\" You check: you gave both. Your mistake.",
   "peds": "\"You pulled 4 mg of morphine for the 20 kg boy in 511. The order is 2 mg.\" You check: you gave all of it. Your mistake.",
   "ob": "\"You pulled two 5 mg oxycodone tabs for the mom in 224. The order is 5 mg, not 10.\" You check: you gave both. Your mistake.",
   "ed": "\"You pulled 2 mg of hydromorphone for bay 6. The order is 1 mg.\" You check: you gave all of it. Your mistake."
  },
  "q": "What do you do first?",
  "opts": [
   {
    "t": "Go assess the patient now, then tell the provider and Nova, file a safety report, and follow the disclosure policy",
    "v": 2,
    "fb": "The patient comes first: check vitals and level of consciousness. Then notify, report, and be honest with the patient per policy."
   },
   {
    "t": "Call the provider and recheck vitals at the next scheduled set",
    "v": 1,
    "fb": "Notifying is right, but an extra dose of this drug can drop blood pressure or breathing in the next hour. Assess now."
   },
   {
    "t": "Watch the patient closely, and only report it if something happens",
    "v": 0,
    "fb": "Errors get reported whether or not harm follows. Reports are how the system finds out why it happened."
   },
   {
    "t": "Fix the MAR to show the ordered dose",
    "v": -1,
    "fb": "Altering the record is falsification. It hides the error from the people who need to monitor the patient."
   }
  ],
  "teach": "After a medication error: assess the patient, notify the provider, report it through the safety system, and disclose per policy. Just culture treats honest errors as system problems; hiding them is misconduct (Joint Commission; ISMP)."
 },
 {
  "id": "pp-verbal-order",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-clerk",
  "title": "Just put it in",
  "dom": "comm",
  "cost": 2,
  "exp": 18,
  "ping": "Pat: \"Dr. Ames is at the desk, about to leave, and wants you.\"",
  "text": {
   "med": "He's logged in at the workstation next to you. \"Start Mr. Petrov on furosemide 40 IV twice a day. Just put it in for me, I'm late for clinic.\" No one is in distress.",
   "psych": "He's logged in at the workstation next to you. \"Start Ms. Varga on quetiapine 50 at bedtime. Just put it in for me, I'm late for clinic.\" No one is in distress.",
   "peds": "He's logged in at the workstation next to you. \"Start the boy in 511 on ondansetron, 0.15 per kilo. Just put it in for me, I'm late for clinic.\" No one is in distress.",
   "ob": "He's logged in at the workstation next to you. \"Start 224 on ibuprofen 600 every six. Just put it in for me, I'm late for clinic.\" No one is in distress.",
   "ed": "He's logged in at the workstation next to you. \"Bay 4 can have ketorolac 15 IV. Just put it in for me, I'm heading to a trauma.\" Bay 4 is stable with a sprained ankle."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Ask him to enter it himself now. Verbal orders are for emergencies or when the prescriber can't enter them",
    "v": 2,
    "fb": "He's at a computer and nobody is unstable. Entered orders avoid sound-alike and dose mix-ups."
   },
   {
    "t": "Take it as a verbal order, write it down, read it back, and enter it per policy",
    "v": 1,
    "fb": "Read-back makes it safer, but this isn't a situation verbal orders are for. Most policies say to ask him to enter it."
   },
   {
    "t": "Remember it and enter it once your patients are settled",
    "v": 0,
    "fb": "An order from memory, entered later without read-back, is how doses and drugs get swapped."
   },
   {
    "t": "Enter it under his login since he's already signed in",
    "v": -1,
    "fb": "Using someone else's login is a falsified order and a policy and privacy violation."
   }
  ],
  "teach": "Limit verbal orders to emergencies or times the prescriber truly can't enter them. When you take one, write it down and read back the whole order, and make sure it's signed within the time your policy and state require (Joint Commission; varies by state and facility)."
 },
 {
  "id": "pp-ten-times",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-rn",
  "title": "An odd order",
  "dom": "meds",
  "cost": 3,
  "exp": 15,
  "ping": "{rn}: \"Can you look at an order with me before I give it?\"",
  "text": {
   "med": "Hydromorphone 10 mg IV every 3 hours as needed for pain, for an opioid-naive 80-year-old. Pharmacy verified it overnight. The usual starting dose is 0.2 to 1 mg.",
   "psych": "Haloperidol 50 mg IM now for agitation, for a 70 kg man. Pharmacy verified it. The usual dose is 2 to 5 mg.",
   "peds": "Morphine 1 mg/kg IV every 4 hours as needed, for a 15 kg child. Pharmacy verified it. The usual dose is about 0.05 to 0.1 mg/kg.",
   "ob": "Oxycodone 50 mg by mouth every 4 hours as needed, for a postpartum mom. Pharmacy verified it. The usual dose is 5 to 10 mg.",
   "ed": "Hydromorphone 10 mg IV now, for an opioid-naive 30-year-old with a kidney stone. Pharmacy verified it. The usual starting dose is 0.5 to 1 mg."
  },
  "q": "What do you tell {rn}?",
  "opts": [
   {
    "t": "Hold it and call the prescriber to clarify, with pharmacy looped in",
    "v": 2,
    "fb": "That is about ten times the usual dose, a classic decimal or unit error. Only the prescriber can change the order."
   },
   {
    "t": "Hold it and ask pharmacy to fix it",
    "v": 1,
    "fb": "Holding is right, and pharmacy should know. But the prescriber has to clarify and change the order."
   },
   {
    "t": "Give the usual dose. It's obviously a typo",
    "v": 0,
    "fb": "Probably a typo, but giving a dose that wasn't ordered is outside your scope. Clarify first."
   },
   {
    "t": "Give it as written. Pharmacy verified it",
    "v": -1,
    "fb": "Verification doesn't mean correct. You are the last check, and a tenfold opioid or antipsychotic dose can kill."
   }
  ],
  "teach": "If an order doesn't make sense for this patient (dose, drug, route or the patient itself), hold it and clarify with the prescriber. Following an order you know is wrong is your liability too (ISMP; state nurse practice act)."
 },
 {
  "id": "pp-consent",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-clerk",
  "title": "A witness",
  "dom": "judgment",
  "cost": 2,
  "exp": 18,
  "ping": "Pat: \"Dr. Ames needs a nurse to witness a consent. He's in the room.\"",
  "text": {
   "med": "Mr. Petrov is about to sign for a colonoscopy. As you walk in he says, \"Wait, what does perforation mean? Could I end up with a bag?\" Dr. Ames sighs. \"It's rare. Just sign, I've got five more.\"",
   "psych": "Ms. Varga is about to sign consent for ECT. As you walk in she asks, \"Will I lose my memories? Nobody told me that.\" Dr. Ames sighs. \"It's usually temporary. Just sign, we're on the schedule.\"",
   "peds": "The mother of the boy in 511 is about to sign for his surgery. She asks, \"Wait, what does general anesthesia do to a four-year-old? Could he not wake up?\" Dr. Ames sighs. \"Just sign, the OR is waiting.\"",
   "ob": "The mom in 224 is about to sign consent for a tubal ligation tomorrow. She asks, \"Is this permanent? Can it be reversed later?\" Dr. Ames sighs. \"Just sign, I've got a delivery.\"",
   "ed": "Bay 6 is about to sign consent for procedural sedation to reduce his shoulder. He asks, \"What if I stop breathing?\" Dr. Ames sighs. \"It's rare. Just sign.\""
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Don't witness yet. Tell Dr. Ames the patient still has questions and needs answers before signing",
    "v": 2,
    "fb": "Consent is the provider's job, and it isn't informed while questions are open. Your signature says the signer understood and signed freely."
   },
   {
    "t": "Step out and ask Nova how to handle it",
    "v": 1,
    "fb": "Not signing is right, but you can say this yourself, right now, before the patient signs."
   },
   {
    "t": "Answer the questions yourself so they can sign",
    "v": 0,
    "fb": "Explaining the risks and alternatives of a procedure is the provider's duty, not the witness's."
   },
   {
    "t": "Witness it. The surgeon will answer later",
    "v": -1,
    "fb": "Witnessing while the patient openly doesn't understand makes the consent invalid, and the procedure may proceed on it."
   }
  ],
  "teach": "The provider obtains informed consent: the procedure, risks, benefits and alternatives. The nurse witnesses the signature and speaks up if the patient doesn't understand or feels pressured (Joint Commission; specific rules such as sterilization waiting periods vary by state and payer)."
 },
 {
  "id": "pp-hide-dx",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-clerk",
  "title": "Don't tell him",
  "dom": "comm",
  "cost": 2,
  "exp": 18,
  "ping": "Pat: \"A family member wants to speak with the nurse, privately.\"",
  "text": {
   "med": "Mr. Petrov's son: \"The biopsy showed cancer, right? Don't tell Dad. It'll kill him. In our culture we protect our elders.\" Mr. Petrov has capacity and asked you this morning when his results would be back.",
   "psych": "Ms. Varga's daughter: \"The doctor said Mom has early dementia. Please don't tell her, she'll fall apart.\" Ms. Varga has capacity and asked you this morning why she had memory tests.",
   "peds": "The parents of a 15-year-old: \"The scan shows a tumor. Don't tell her yet. Promise us.\" Their daughter asked you this morning, \"Is something wrong with me?\"",
   "ob": "The new mom's husband: \"The pediatrician thinks the baby has a heart defect. Don't tell my wife until she's rested.\" She's awake and asked you an hour ago why the baby went for an echo.",
   "ed": "Mr. Hale's wife: \"The CT showed a mass, didn't it? Don't tell him tonight. He'll leave.\" He has capacity and just asked what the CT showed."
  },
  "q": "What do you say?",
  "opts": [
   {
    "t": "Acknowledge their fear, say you won't lie if asked, and bring in the provider to plan how and when to share it, including what the patient wants to know",
    "v": 2,
    "fb": "The patient has a right to the truth, and some people choose how much they want to hear. The team, not one nurse, plans that conversation with the family."
   },
   {
    "t": "Say you'll pass it on to the provider",
    "v": 1,
    "fb": "Getting the provider is right, but don't leave the family thinking you agreed to keep a secret."
   },
   {
    "t": "Tell the patient everything yourself right now",
    "v": 0,
    "fb": "Delivering a new diagnosis is the provider's role, and doing it in a rush ignores how the patient wants to hear it."
   },
   {
    "t": "Agree, and tell the patient the results aren't back yet",
    "v": -1,
    "fb": "Lying to a patient with capacity violates autonomy and destroys trust when the truth comes out."
   }
  ],
  "teach": "A patient with capacity has the right to information about their own health, including the right to decline it. Respect cultural values by asking the patient how they want information shared, and involve the provider (ANA Code of Ethics Provision 1; for minors, the team works with parents on assent)."
 },
 {
  "id": "pp-social",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-rn",
  "title": "A post",
  "dom": "judgment",
  "cost": 2,
  "exp": 20,
  "ping": "{rn} shows you a phone: \"Did you see what Tasha posted?\"",
  "text": {
   "med": "A coworker's public post: \"Guy in 410 thinks he's a pilot lol, longest night ever.\" A photo of the unit hallway shows the room number and a patient's name on the door.",
   "psych": "A coworker's public post: \"B hall full moon energy, our guy who thinks he's Jesus is back.\" A photo of the unit hallway shows the whiteboard with patient initials.",
   "peds": "A coworker's public post: \"Cutest baby in 511 going home today!\" with a photo of the baby and his name on the crib card.",
   "ob": "A coworker's public post: \"Delivered a 12 pounder tonight, mom was a champ!\" with a photo of the baby and the whiteboard with mom's last name.",
   "ed": "A coworker's public post: \"Guess what the guy in bay 9 had stuck where\" with a cropped X-ray. The X-ray has the date and time on it."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Ask Tasha to take it down now, and tell Nova or the manager so it's handled per policy",
    "v": 2,
    "fb": "Room numbers, photos, initials and dates can identify a patient, and screenshots last forever. It needs to come down and be reported."
   },
   {
    "t": "Ask Tasha to take it down, and leave it there",
    "v": 1,
    "fb": "Getting it down fast matters most, but a privacy breach usually has to be reported for the facility to respond."
   },
   {
    "t": "Ignore it. There's no full name",
    "v": 0,
    "fb": "No name doesn't mean no identification. Details, photos and timing are enough."
   },
   {
    "t": "Comment on it with a story of your own",
    "v": -1,
    "fb": "Now it's two breaches, one of them yours."
   }
  ],
  "teach": "Never post anything about patients, even without names: details, photos, room numbers and timing can identify them. Privacy breaches are reported per policy (HIPAA; NCSBN's social media guidelines)."
 },
 {
  "id": "pp-float",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-clerk",
  "title": "Float",
  "dom": "judgment",
  "cost": 2,
  "exp": 18,
  "ping": "Pat: \"Nova says you're floating for the rest of the shift.\"",
  "text": {
   "med": "To the ICU, which is short a nurse. You've never worked there. They want you to take two patients, one on a norepinephrine drip that's being titrated.",
   "psych": "To medical-surgical, which is short a nurse. You haven't done med-surg since school. They want you to take five patients, one on a heparin drip.",
   "peds": "To the NICU, which is short a nurse. You've never cared for preemies. They want you to take a 28-weeker on a ventilator.",
   "ob": "To labor and delivery, which is short a nurse. You've never managed labor. They want you to take a mom on oxytocin with fetal monitoring.",
   "ed": "To the ICU, which is short a nurse. You've never worked there. They want you to take two patients, one on a norepinephrine drip that's being titrated."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Go, and tell their charge nurse what you can and can't safely do. Ask for patients within your skills, a resource nurse, and help with tasks you aren't trained for",
    "v": 2,
    "fb": "Floating is part of the job, but competence is yours to protect. Say clearly what you can't do so they can assign it safely."
   },
   {
    "t": "Ask Nova if someone with that experience can go instead",
    "v": 1,
    "fb": "A fair question, and sometimes it works. If the answer is no, go and negotiate the assignment there."
   },
   {
    "t": "Go and take the assignment as given",
    "v": 0,
    "fb": "Accepting care you're not trained for, like titrating drips you've never managed, puts the patient and your license at risk."
   },
   {
    "t": "Refuse to float and go home",
    "v": -1,
    "fb": "Refusing outright and leaving mid-shift is abandonment of your current patients and usually insubordination."
   }
  ],
  "teach": "You can be floated, but you're accountable for practicing only within your competence. Accept the shift, state your limits, and ask for an assignment that fits them with a resource nurse (ANA Principles for Nurse Staffing; state nurse practice act, varies by state)."
 },
 {
  "id": "pp-chart-for-me",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-rn",
  "title": "Chart it for me",
  "dom": "comm",
  "cost": 2,
  "exp": 18,
  "ping": "{rn}: \"Huge favor. I'm locked out of the computer.\"",
  "text": "\"My login expired and IT says an hour. Can you chart that I gave 410 her 1400 meds and did her reassessment? Just put it under yours. Or I can tell you my password.\"",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Decline. Help {rn} write it down on paper with times, report the login problem, and {rn} enters a late entry once logged in",
    "v": 2,
    "fb": "Documentation belongs to the nurse who did the care. A note with times keeps the facts until {rn} can chart it as a late entry."
   },
   {
    "t": "Tell Nova and let her sort it out",
    "v": 1,
    "fb": "Nova can help with downtime options, but you can solve this now: paper notes and a late entry."
   },
   {
    "t": "Chart it under your login, since you trust {rn}",
    "v": 0,
    "fb": "Your name on the chart says you did the care. That's a false record."
   },
   {
    "t": "Use {rn}'s password",
    "v": -1,
    "fb": "Sharing logins breaks the audit trail and violates privacy rules and policy. It's grounds for discipline for both of you."
   }
  ],
  "teach": "Chart only the care you gave or saw, under your own login. Never share passwords. If you can't chart in time, keep notes and add a late entry (HIPAA access rules; state nurse practice act)."
 },
 {
  "id": "pp-late-entry",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-pharm",
  "title": "Not charted",
  "dom": "time",
  "cost": 2,
  "exp": 20,
  "ping": "Rene, from pharmacy: \"Quick documentation question about a PRN you gave.\"",
  "text": "\"You gave a PRN pain dose at 0900, but there's no pain reassessment.\" It's 1500. You did reassess, at about 1000: pain 3 of 10, resting. You remember it clearly but never charted it. {rn} says, \"Just backtime it to 1000, everyone does.\"",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Add a late entry, clearly labeled, timed now, saying you reassessed at about 1000 and what you found",
    "v": 2,
    "fb": "A late entry is honest about when it was written and when the care happened. That's what the record is for."
   },
   {
    "t": "Ask Nova how your unit does late entries before you chart it",
    "v": 1,
    "fb": "Fine to check, but don't let it slide too long. The longer you wait, the less reliable the entry."
   },
   {
    "t": "Leave it. It's too late to matter",
    "v": 0,
    "fb": "Not documented looks like not done, for audits, for the next nurse, and in court."
   },
   {
    "t": "Backtime the entry to 1000 like {rn} says",
    "v": -1,
    "fb": "Making it look like it was charted at 1000 misrepresents the record. Audit trails show when it was really typed."
   }
  ],
  "teach": "Never alter, backdate or delete documentation. Add a late entry labeled as late, with the current time and the time care was given. For a mistake in an old note, add a correction that keeps the original visible (state nurse practice act; facility policy; varies by state and facility)."
 },
 {
  "id": "pp-blood-refusal",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-rn",
  "title": "No blood",
  "dom": "judgment",
  "cost": 3,
  "exp": 15,
  "ping": "{rn}: \"I've got a patient refusing blood. Can you help me think it through?\"",
  "text": {
   "med": "Mrs. Adler, 64, hemoglobin 6.8 after surgery. A transfusion is ordered and the unit is here. She's alert and oriented: \"I'm a Jehovah's Witness. No blood. I know I could die.\"",
   "psych": "Ms. Varga, 44, admitted for depression, has a hemoglobin of 6.9 from a GI bleed. A transfusion is ordered. She's calm and clear: \"I'm a Jehovah's Witness. No blood. I understand the risk.\"",
   "peds": "A 6-year-old with a hemoglobin of 6.5 after a GI bleed. A transfusion is ordered. Her parents, Jehovah's Witnesses: \"No blood for her. Please, anything else.\"",
   "ob": "A mom 3 hours after a postpartum hemorrhage, hemoglobin 6.9, still bleeding slowly. A transfusion is ordered. She's alert: \"I'm a Jehovah's Witness. No blood. I've thought about this.\"",
   "ed": "A 50-year-old after a GI bleed, hemoglobin 6.8, alert and oriented. A transfusion is ordered: \"I'm a Jehovah's Witness. No blood. I know what that means.\""
  },
  "q": "What should {rn} do?",
  "opts": [
   {
    "t": "Don't hang it. Confirm the refusal is informed, get the provider, document it, and ask which alternatives they would accept",
    "v": 2,
    "fb": "A competent adult can refuse blood. Many patients accept some alternatives, like certain fractions or a cell saver. For a child, the provider and ethics or legal decide next steps, which can include a court order."
   },
   {
    "t": "Don't hang it, and tell the provider",
    "v": 1,
    "fb": "Right so far, but explore alternatives and document an informed refusal. Those are what keep her safe."
   },
   {
    "t": "Call her family in to change her mind",
    "v": 0,
    "fb": "Her decision is hers. Pressure from family isn't informed consent, and it may not be welcome."
   },
   {
    "t": "Hang it once she's sedated or asleep",
    "v": -1,
    "fb": "Transfusing an adult against her known refusal is battery."
   }
  ],
  "teach": "Adults with capacity can refuse any treatment, including blood. Make sure the refusal is informed, involve the provider, document, and offer acceptable alternatives. For minors, courts may order life-saving treatment (ANA Code of Ethics Provision 1; varies by state)."
 },
 {
  "id": "pp-interpreter",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "@cna",
  "title": "I can translate",
  "dom": "comm",
  "cost": 2,
  "exp": 18,
  "ping": "{cna}: \"The family in your room says the kid can translate the discharge teaching.\"",
  "text": {
   "med": "Mr. Tran speaks Vietnamese. He's going home on a new anticoagulant. His 11-year-old grandson speaks English and offers to translate.",
   "psych": "Mrs. Duarte speaks Portuguese. She's going home on a new antipsychotic and a safety plan. Her 12-year-old son offers to translate.",
   "peds": "The mother of the toddler in 511 speaks Spanish. Her son is going home on a new seizure medication. His 10-year-old sister offers to translate.",
   "ob": "The new mom in 224 speaks Arabic. She's going home after a cesarean with a new blood pressure medication. Her 12-year-old niece offers to translate.",
   "ed": "The man in bay 9 speaks Mandarin. He needs teaching about a new diagnosis of diabetes. His 11-year-old daughter offers to translate."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Thank them, and get a qualified medical interpreter by phone or video",
    "v": 2,
    "fb": "Children shouldn't interpret, and family members miss and soften medical terms. Qualified interpreters are free to the patient."
   },
   {
    "t": "Ask a bilingual coworker to help",
    "v": 1,
    "fb": "Only if they're tested and approved as an interpreter per policy. Speaking a language isn't the same as interpreting medical teaching."
   },
   {
    "t": "Use a translation app on your phone",
    "v": 0,
    "fb": "Apps get medical terms and doses wrong, and you can't check what was understood."
   },
   {
    "t": "Let the child translate. It's faster",
    "v": -1,
    "fb": "Errors in anticoagulant, seizure or diabetes teaching can be deadly, and it puts the child in an unfair position."
   }
  ],
  "teach": "Patients with limited English have the right to a qualified medical interpreter at no cost. Don't use minors, and avoid family members except in emergencies (Title VI of the Civil Rights Act; Section 1557 of the ACA; Joint Commission)."
 },
 {
  "id": "pp-restraint",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "@cna",
  "title": "Still restrained",
  "dom": "safety",
  "cost": 3,
  "exp": 15,
  "ping": "{cna}: \"Is the restraint order still good for {rn}'s patient? You're covering.\"",
  "text": {
   "med": "Mr. Novak, 82, delirious, in soft wrist restraints for pulling at his lines. The order expired an hour ago. He's calm and dozing now.",
   "psych": "Mr. Obi, 30, was placed in four-point restraints for assaulting staff. The 4-hour order expired 30 minutes ago. He's quiet and asking for water.",
   "peds": "A 7-year-old in restraints after hitting staff. The 1-hour order expired 20 minutes ago. He's crying and asking for his mom.",
   "ob": "A delirious mom 2 days after a cesarean, in soft wrist restraints for pulling at her IV. The order expired an hour ago. She's calm and dozing now.",
   "ed": "A man in four-point restraints for violence while intoxicated. The 4-hour order expired 30 minutes ago. He's calmer and asking to use the bathroom."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Assess the patient now. If the restraints are no longer needed, release them. If they are, get the provider to evaluate and renew the order per policy. Document either way",
    "v": 2,
    "fb": "Restraint needs a current order and ongoing need. A calm patient may be ready to come out, which is the goal."
   },
   {
    "t": "Release them right away since there's no order",
    "v": 1,
    "fb": "No order means no restraint, so this isn't wrong. But assess first and have enough staff close by, for the patient's safety and yours."
   },
   {
    "t": "Chart that the order was renewed. The provider will sign later",
    "v": 0,
    "fb": "You can't create or assume an order. That's a false record."
   },
   {
    "t": "Leave them on until the provider rounds in the morning",
    "v": -1,
    "fb": "Restraint without a current order violates CMS rules, and every extra hour risks injury, aspiration and death."
   }
  ],
  "teach": "Restraints need a current order, frequent monitoring and release as soon as possible. Violent-behavior restraint orders last at most 4 hours for adults, 2 hours for ages 9 to 17, and 1 hour under 9 (CMS; Joint Commission). Nonviolent order lengths, and who may order or renew, are set by state law and facility policy, so they vary."
 },
 {
  "id": "pp-override",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-rn",
  "title": "Just override it",
  "dom": "meds",
  "cost": 2,
  "exp": 18,
  "ping": "{rn}, your preceptor today: \"Come on, we're behind.\"",
  "text": {
   "med": "Mrs. Garza's ID band won't scan for her 0900 insulin. {rn}: \"Just override it. I've had her three days, I know it's her. Skip the double check too, it's just 4 units.\"",
   "psych": "Mr. Pruitt's ID band won't scan for his 0900 lithium. {rn}: \"Just override it. I've had him all week, I know it's him.\"",
   "peds": "The band on the toddler in 511 won't scan for his 0900 insulin. {rn}: \"Just override it. I know it's him. Skip the double check too, it's half a unit.\"",
   "ob": "The mom in 224's band won't scan for her 0900 insulin. {rn}: \"Just override it. I know it's her. Skip the double check too, it's just 4 units.\"",
   "ed": "The band on bay 6 won't scan for his insulin. {rn}: \"Just override it. I triaged him myself. Skip the double check too, it's just 4 units.\""
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Don't override. Get the band reprinted, scan it, do any required double check, and tell {rn} why",
    "v": 2,
    "fb": "Scanning and the double check catch the errors people are sure they won't make. A new band takes two minutes."
   },
   {
    "t": "Ask Nova if overriding is okay here",
    "v": 1,
    "fb": "Checking is better than giving it, but you already know the safe answer. Fix the band."
   },
   {
    "t": "Check two identifiers out loud, then override",
    "v": 0,
    "fb": "Better than nothing, but scanning checks the drug and dose too, and insulin still needs its second-nurse check if policy requires it."
   },
   {
    "t": "Override and give it. {rn} has years of experience",
    "v": -1,
    "fb": "Workarounds are how high-alert drugs go to the wrong patient or the wrong dose, whoever is precepting you."
   }
  ],
  "teach": "Barcode scanning and independent double checks for high-alert drugs like insulin aren't optional, even when a preceptor says so. Fix the cause (reprint the band) instead of working around it, and speak up respectfully (ISMP; Joint Commission)."
 },
 {
  "id": "pp-boundaries",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "@cna",
  "title": "Your number",
  "dom": "comm",
  "cost": 2,
  "exp": 18,
  "ping": "{cna}: \"Your patient's asking for you. Says it's personal.\"",
  "text": {
   "med": "Mr. Hale, 38, is going home tomorrow. \"You've been the best nurse here. Can I get your number? Or I'll find you on Instagram, we should get a drink.\"",
   "psych": "Terrell, 29, is going home tomorrow. \"You're the only one here who gets me. Can I have your number, just in case?\"",
   "peds": "The mother of the toddler in 511 is going home tomorrow. \"You saved us. Can I friend you so I can send you pictures as he grows?\"",
   "ob": "The mom in 224 is going home tomorrow. \"You were amazing with me. Can I get your number so I can text you baby questions?\"",
   "ed": "A man you've seen three times this month in the ED. \"You're my favorite nurse. Can I get your number, so I can ask you before I come in?\""
  },
  "q": "What do you say?",
  "opts": [
   {
    "t": "Thank them warmly, explain you can't share personal contact, and give them the right number to call for questions after discharge",
    "v": 2,
    "fb": "Kind and clear. They still get support, from the right place."
   },
   {
    "t": "Say the hospital doesn't allow it",
    "v": 1,
    "fb": "It holds the line, but owning the boundary yourself, and giving them somewhere to call, is better."
   },
   {
    "t": "Give your work email instead",
    "v": 0,
    "fb": "It's still a personal channel outside the care relationship."
   },
   {
    "t": "Give your number. They're being discharged",
    "v": -1,
    "fb": "Discharge doesn't end the power difference, especially for a psychiatric or vulnerable patient."
   }
  ],
  "teach": "Nurses are responsible for professional boundaries, not patients. Personal contact, social media connections and gifts blur them, especially with vulnerable patients (NCSBN professional boundaries guidance; ANA Code of Ethics Provision 2)."
 },
 {
  "id": "pp-threat",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-clerk",
  "title": "A threat",
  "dom": "safety",
  "cost": 3,
  "exp": 15,
  "ping": "Pat, shaken: \"A visitor told me to give you a message.\"",
  "text": "\"The son of a patient in 410, one you had yesterday. He said, 'Tell that nurse if my mother falls again I'll be waiting for her in the parking garage.' Then he walked off the unit.\" Your shift ends in an hour.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Call security now, tell Nova, write down his exact words, file a report, and get an escort to your car",
    "v": 2,
    "fb": "Treat a specific threat as real. Security and leadership can flag him, involve police per policy, and plan visitation."
   },
   {
    "t": "Ask security for an escort to your car when you leave",
    "v": 1,
    "fb": "The escort is smart, but report it now too. The threat may extend to the next nurse."
   },
   {
    "t": "Let it go. He's upset about his mom",
    "v": 0,
    "fb": "Stress explains the threat, but doesn't make it safe. Threats are reported."
   },
   {
    "t": "Go find him in the lobby to talk it out",
    "v": -1,
    "fb": "Never meet someone who threatened you alone. Let security handle contact."
   }
  ],
  "teach": "Threats of violence are reported right away, with exact words, and are never handled alone. Employers must have workplace violence prevention programs (OSHA guidelines for healthcare; Joint Commission workplace violence standards; some states require more)."
 },
 {
  "id": "pp-rapid",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "@cna",
  "title": "Something's off",
  "dom": "judgment",
  "cost": 4,
  "exp": 12,
  "ping": "{cna}: \"Can you look at your patient? Something's off.\"",
  "text": {
   "med": "Mr. Novak, 82, day 2 after a bowel resection, is newly confused. HR 118, RR 26, BP 98/60, SpO₂ 92%. You paged the surgeon 20 minutes ago. No callback. You're not sure it's \"bad enough.\"",
   "psych": "Ms. Delaney, 19, is newly confused and hard to wake. HR 120, RR 24, BP 96/58. Her roommate says she \"took something.\" You paged the psychiatrist 20 minutes ago. No callback.",
   "peds": "A 2-year-old with pneumonia is now grunting and pale. HR 170, RR 58, SpO₂ 91%. You paged the resident 20 minutes ago. No callback. You're not sure it's \"bad enough.\"",
   "ob": "A mom 6 hours postpartum is pale and anxious. HR 124, BP 92/54, her pad soaked in 30 minutes. You paged the OB 15 minutes ago. No callback.",
   "ed": "A man in the hallway waiting for a bed is newly confused. HR 122, RR 28, BP 90/58, temp 38.9 °C (102 °F). You messaged the provider 15 minutes ago. No reply."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Call a rapid response now (in the ED, get the charge nurse and attending to the bedside) and stay with the patient",
    "v": 2,
    "fb": "Changes in mental status, heart rate, breathing and pressure together are early warning signs. Worry alone is a reason to call."
   },
   {
    "t": "Page the provider again and stay with the patient",
    "v": 1,
    "fb": "Staying is right, but you've waited long enough. The rapid response team exists so you don't have to wait."
   },
   {
    "t": "Wait for the callback and recheck vitals in 30 minutes",
    "v": 0,
    "fb": "Waiting is how early deterioration becomes a code."
   },
   {
    "t": "Give a PRN for the confusion and restlessness",
    "v": -1,
    "fb": "Sedating someone who is confused from shock or low oxygen hides the problem and can stop their breathing."
   }
  ],
  "teach": "Call a rapid response for acute changes or when you're worried, and especially when a provider isn't responding. No one is in trouble for a call that turns out fine; delays cause harm (Joint Commission; facility rapid response criteria vary)."
 },
 {
  "id": "pp-late-relief",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-clerk",
  "title": "Running late",
  "dom": "time",
  "cost": 2,
  "exp": 18,
  "ping": "Pat: \"Jess just called. She'll be 45 minutes late. Your shift ended five minutes ago.\"",
  "text": "You have to pick up your kid by 7:30. Your report sheet is printed and your patients are stable. {cna} is staying for the next shift.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Tell Nova, and give face-to-face handoff to whichever RN she assigns to cover until Jess arrives",
    "v": 2,
    "fb": "Patients stay with an RN at every moment. Nova can cover or assign someone, and you can leave once a nurse has your report."
   },
   {
    "t": "Wait for Jess and call someone about your kid",
    "v": 1,
    "fb": "Safe, but Nova may be able to get you out on time. Tell her."
   },
   {
    "t": "Give your report to {cna}",
    "v": 0,
    "fb": "A nursing assistant can't take over RN responsibility for patients."
   },
   {
    "t": "Leave the printed report at the desk and go",
    "v": -1,
    "fb": "Leaving patients without an RN handoff is abandonment, even when the next nurse is late."
   }
  ],
  "teach": "You're responsible for your patients until you hand them off to another RN. Use a structured handoff (SBAR or I-PASS) and tell the charge nurse when relief is late. Leaving without handoff is abandonment (Joint Commission handoff standard; state board rules vary by state)."
 },
 {
  "id": "pp-code-status",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-rn",
  "title": "DNR?",
  "dom": "comm",
  "cost": 3,
  "exp": 15,
  "ping": "{rn}: \"I'm getting a code status question. Can you help?\"",
  "text": {
   "med": "Mr. Novak, 82, is listed as full code. His daughter says, \"Dad's DNR. He has a POLST on the fridge at home.\" He's confused and can't say. She's his health care agent.",
   "psych": "Ms. Varga, 74, is listed as full code. Her son says, \"Mom's DNR. She signed something with her doctor last year.\" She's alert and oriented.",
   "peds": "A 9-year-old with a terminal neuromuscular disease is listed as full code. His mother says, \"We signed a DNR at the other hospital last month.\" There's no copy here.",
   "ob": "A mom with heart failure is listed as full code. Her husband says, \"She has an advance directive. No CPR.\" She's alert, holding her baby.",
   "ed": "A 79-year-old from a nursing home is listed as full code. His daughter says, \"He's DNR. The POLST is with his papers.\" He's sedated, and the papers aren't in the chart."
  },
  "q": "What should {rn} do?",
  "opts": [
   {
    "t": "Treat the current order as valid, call the provider now to clarify with the patient or legal decision maker, and ask the family to bring the document",
    "v": 2,
    "fb": "Only a provider's order changes code status, so it needs to happen now, not at the next arrest. Ask the patient directly if they can answer."
   },
   {
    "t": "Tell Nova and flag it in handoff",
    "v": 1,
    "fb": "Good to flag, but it needs the provider today. A code could happen before morning."
   },
   {
    "t": "Tell the family the chart says full code, so that's final",
    "v": 0,
    "fb": "The chart may be wrong. Code status should reflect what the patient wants, so it needs clarifying."
   },
   {
    "t": "Treat them as DNR now based on what the family says",
    "v": -1,
    "fb": "Withholding CPR without an order, and without confirming the patient's wishes, is unsafe and unlawful."
   }
  ],
  "teach": "Follow the current order until a provider changes it, and get it clarified urgently with the patient or the legal decision maker. POLST and advance directive rules differ by state, so know your state's forms (ANA position on nursing care and DNR decisions; varies by state)."
 },
 {
  "id": "pp-home-meds",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "@cna",
  "title": "Pills from home",
  "dom": "meds",
  "cost": 2,
  "exp": 18,
  "ping": "{cna}: \"Your patient has a bag of meds from home on the table.\"",
  "text": {
   "med": "Mr. Petrov has his own bottles: metoprolol, an unlabeled bag of white pills, and fish oil. \"I always take mine. Your pharmacy gives the wrong brand.\" He just took one.",
   "psych": "Mr. Pruitt's sister handed him a pill bottle during the visit. It says sertraline, but the pills inside look different. He's about to take one.",
   "peds": "The mother of the boy in 511 brought his levetiracetam from home. \"I just give it at 8 like always.\" It's on the bedside table, along with gummy melatonin.",
   "ob": "The mom in 224 has her prenatal vitamins and an herbal supplement \"for milk supply\" on the tray. \"My doula said it's safe.\"",
   "ed": "The man in bay 9 is taking his own oxycodone from his pocket. \"You're making me wait. These are mine, they're prescribed.\""
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Ask what's been taken and when, secure the meds or send them home per policy, and tell the provider and pharmacy",
    "v": 2,
    "fb": "Home meds can double up with hospital doses or interact, and unlabeled pills can be anything. What's already been taken affects the plan."
   },
   {
    "t": "Ask the family to take them home",
    "v": 1,
    "fb": "Getting them out of the room is the main safety step. But find out what was taken and tell the provider."
   },
   {
    "t": "Let them keep the meds, but tell them not to take any",
    "v": 0,
    "fb": "Meds at the bedside get taken. Secure them."
   },
   {
    "t": "Let them take their own. They know their meds",
    "v": -1,
    "fb": "Unverified doses on top of hospital orders cause overdoses and interactions, and no one can track them."
   }
  ],
  "teach": "Patients' own medications are used only with a provider order, after pharmacy identifies them, and are given by the nurse per policy. Otherwise they're sent home or secured. Herbals and supplements count (Joint Commission medication management and reconciliation)."
 },
 {
  "id": "fc-vt-run",
  "k": [
   "med"
  ],
  "from": "fl-tele",
  "title": "A run of VT",
  "dom": "assess",
  "cost": 3,
  "exp": 14,
  "ping": "Kim, monitor tech: \"{rn}'s patient in 410 just had a run of VT.\" You're covering.",
  "text": "Nine beats of ventricular tachycardia, now back in sinus at 88 with frequent PVCs. Mr. Hargrove, 70, heart failure, on IV furosemide since yesterday. {rn} is on break.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Go see him now: responsiveness, pulse, full vitals, symptoms. Then call the provider and ask about a potassium, magnesium and a 12-lead",
    "v": 2,
    "fb": "Treat the patient, not the strip. Nonsustained VT in a diuresed heart failure patient points to low potassium or magnesium, and it can come back sustained."
   },
   {
    "t": "Call a rapid response before you see him",
    "v": 1,
    "fb": "Never wrong to have help, but he's back in sinus and you don't yet know how he looks. A quick assessment tells the team what they're walking into."
   },
   {
    "t": "Ask Kim to save the strip for {rn} when she's back",
    "v": 0,
    "fb": "A new run of VT needs eyes on the patient now, not after a break."
   },
   {
    "t": "Ask Kim to widen his alarm limits so it stops alarming",
    "v": -1,
    "fb": "Silencing or loosening alarms to stop the noise is how the next, sustained run gets missed. Alarm settings change only for a clinical reason."
   }
  ],
  "teach": "Nonsustained VT: assess the patient, check potassium and magnesium, get a 12-lead, notify the provider. Sustained VT with a pulse but unstable gets synchronized cardioversion; pulseless VT gets CPR and defibrillation (AHA ACLS)."
 },
 {
  "id": "fc-lead-asystole",
  "k": [
   "med"
  ],
  "from": "fl-tele",
  "title": "Flat line",
  "dom": "assess",
  "cost": 3,
  "exp": 10,
  "ping": "Kim, monitor tech: \"Asystole on 424! {rn}'s patient!\"",
  "text": "Lead II is a flat line. On the same screen, the pulse oximetry waveform is still tracing at 82. {rn} is two rooms away with an isolation patient.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Go to the room now and check him: responsive and a pulse means fix the leads; unresponsive and pulseless means call the code and start CPR",
    "v": 2,
    "fb": "The pulse ox tracing says it's probably a lead, but only the patient can confirm it. Thirty seconds at the bedside settles it either way."
   },
   {
    "t": "Call a code blue from the desk, then go",
    "v": 1,
    "fb": "Safe if he's really arrested, but the pulse ox tracing suggests he isn't. Going first takes seconds and keeps the code team free."
   },
   {
    "t": "Ask Kim to check the other leads before anyone goes in",
    "v": 0,
    "fb": "Looking at more leads is part of confirming asystole, but not instead of looking at the patient. If he's arrested, that's lost time."
   },
   {
    "t": "Assume it's a loose lead and ask {cna} to fix it when free",
    "v": -1,
    "fb": "Assuming artifact is how a real arrest goes untreated. Every flat line gets a person at the bedside now."
   }
  ],
  "teach": "Asystole on the monitor is confirmed at the bedside: check responsiveness and pulse, then leads, gain and a second lead (AHA ACLS). Treat the patient, not the monitor."
 },
 {
  "id": "fc-chest-tube",
  "k": [
   "med"
  ],
  "from": "@cna",
  "title": "Chest tube",
  "dom": "safety",
  "cost": 3,
  "exp": 12,
  "ping": "{cna}: \"The tubing on 409's chest tube came apart from the box.\"",
  "text": "Ms. Rhee, 56, has a chest tube for a pneumothorax. The tubing separated from the drainage unit when she stood up, and the open end is lying on the floor. She's breathing at 20, SpO₂ 95%, a little anxious.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Put the open end of the chest tube 2 to 3 cm into a bottle of sterile water, get a new drainage system, assess her breathing and call the provider",
    "v": 2,
    "fb": "Sterile water makes a quick water seal: air can bubble out but can't be pulled back in. The tubing touched the floor, so it gets a new system."
   },
   {
    "t": "Wipe both ends with alcohol and reconnect them",
    "v": 1,
    "fb": "Reconnecting fast limits air entry, and some policies allow it. But the end hit the floor; a new sterile system is safer."
   },
   {
    "t": "Cover the insertion site with an occlusive dressing",
    "v": 0,
    "fb": "That's for a tube pulled out of the chest. The tube is still in her chest; the break is in the tubing."
   },
   {
    "t": "Clamp the tube until the provider arrives",
    "v": -1,
    "fb": "Clamping traps air in the chest and can cause a tension pneumothorax. Clamp only briefly, with an order, for a specific reason."
   }
  ],
  "teach": "Chest tube disconnected from the drainage unit: submerge the end 2 to 3 cm in sterile water, replace the system, assess, notify. Tube out of the chest: cover the site with a sterile occlusive dressing per policy (often taped on three sides) and watch for tension pneumothorax. Don't clamp without an order (AACN Procedure Manual)."
 },
 {
  "id": "fc-transfusion-rxn",
  "k": [
   "med"
  ],
  "from": "@cna",
  "title": "During the transfusion",
  "dom": "safety",
  "cost": 4,
  "exp": 12,
  "ping": "{cna}: \"{rn}'s patient in 410 getting blood says she feels awful.\" {rn} is in a sterile procedure.",
  "text": "Fifteen minutes into a unit of red cells. Mrs. Pryce, 68, has chills and low back pain. Temp 38.6 °C (101.5 °F), up from 37.0 °C (98.6 °F). HR 118, BP 96/58.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Stop the blood, keep the IV open with normal saline through new tubing, stay with her, recheck vitals, and call the provider and the blood bank",
    "v": 2,
    "fb": "Fever, back pain and falling blood pressure early in a transfusion look like an acute hemolytic reaction. Stopping fast limits how much incompatible blood she gets."
   },
   {
    "t": "Stop the blood and call the provider, then wait for orders",
    "v": 1,
    "fb": "Stopping and calling are right. Keep the line open with saline on new tubing and notify the blood bank too; she may need fluids fast."
   },
   {
    "t": "Stop it, give her PRN acetaminophen, and restart once the fever breaks",
    "v": 0,
    "fb": "Never restart a unit after a suspected reaction. The bag goes back to the blood bank for testing."
   },
   {
    "t": "Slow the rate and give acetaminophen",
    "v": -1,
    "fb": "Slowing still gives her more of a blood product she may be reacting to. Stop it."
   }
  ],
  "teach": "Any suspected transfusion reaction: stop the transfusion, keep access with saline on new tubing, recheck the patient ID and unit labels, monitor vitals, notify the provider and blood bank, and return the bag and tubing with blood and urine samples per policy (AABB)."
 },
 {
  "id": "fc-cold-foot",
  "k": [
   "med"
  ],
  "from": "@cna",
  "title": "A cold foot",
  "dom": "assess",
  "cost": 3,
  "exp": 15,
  "ping": "{cna}: \"The lady with the broken hip in 403 says she can't feel her toes.\"",
  "text": "Mrs. Abernathy, 84, fractured her left hip this morning and is waiting for surgery. Her left foot is pale and cool, and you can't feel a pedal pulse. The right foot is warm and pink. Her pain is worse than an hour ago despite her PRN.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Compare both feet, check pulses with a Doppler, capillary refill, sensation and movement, keep the leg at heart level, and call the surgeon now",
    "v": 2,
    "fb": "A cold, pale, pulseless foot with numbness and rising pain is a vascular or compartment emergency. Minutes count to save the limb."
   },
   {
    "t": "Loosen any straps or wraps on the leg and recheck",
    "v": 1,
    "fb": "Removing anything constricting is a right first step, but this still needs the surgeon now, not after a recheck."
   },
   {
    "t": "Elevate the leg on pillows above her heart",
    "v": 0,
    "fb": "Elevating above the heart lowers arterial flow to a limb that's already short of it. Keep it at heart level."
   },
   {
    "t": "Give another dose of pain medication and recheck in an hour",
    "v": -1,
    "fb": "Pain out of proportion is an early warning sign. Masking it and waiting an hour risks losing the limb."
   }
  ],
  "teach": "Neurovascular checks: pain, pallor, pulses, paresthesia, paralysis and pressure. Pain out of proportion comes early; pulselessness is late. Keep the limb at heart level, loosen constriction, and notify the surgeon immediately (NAON)."
 },
 {
  "id": "fc-heparin-aptt",
  "k": [
   "med"
  ],
  "from": "fl-lab",
  "title": "High aPTT",
  "dom": "meds",
  "cost": 3,
  "exp": 15,
  "ping": "Lab: a critical aPTT on {rn}'s patient in 407. {rn} is at a code on another floor.",
  "text": "aPTT 142 seconds on Mr. Faber, 61, on a weight-based heparin drip for a DVT. The protocol target is 60 to 100. {cna} says he has a new bruise on his arm.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Read back the result, hold the drip per the heparin protocol, check him for bleeding, call the provider, and recheck the aPTT on schedule",
    "v": 2,
    "fb": "The nomogram tells you how long to hold and how much to lower the rate. A new bruise means you look for bleeding elsewhere too."
   },
   {
    "t": "Ask whether it was drawn from the heparin arm and redraw from the other arm before changing anything",
    "v": 1,
    "fb": "A draw near the infusion can falsely raise the aPTT, so it's a fair question. But hold the drip per protocol while you sort it out."
   },
   {
    "t": "Cut the rate in half and recheck in 6 hours",
    "v": 0,
    "fb": "Guessing at a new rate skips the protocol and the bleeding check. Use the nomogram."
   },
   {
    "t": "Leave it running. He needs anticoagulation for the clot",
    "v": -1,
    "fb": "An aPTT that high with a new bruise is a bleeding risk. Heparin is a high-alert drug for exactly this reason."
   }
  ],
  "teach": "Heparin is a high-alert medication (ISMP). Follow the weight-based nomogram: a high aPTT means hold and reduce per protocol, assess for bleeding, notify, and recheck about 6 hours after any change. Draw from the arm opposite the infusion."
 },
 {
  "id": "fc-saturated",
  "k": [
   "med"
  ],
  "from": "@cna",
  "title": "A soaked dressing",
  "dom": "priority",
  "cost": 4,
  "exp": 12,
  "ping": "{cna}: \"The dressing on 411 is soaked through, and there's blood on the sheets.\"",
  "text": "Mr. Lindqvist, 66, is 5 hours after a total knee replacement. The dressing is saturated and the sheet under his knee is wet with blood. HR 112, BP 98/60. His BP was 138/80 at noon.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Reinforce the dressing with firm pressure, stay, recheck vitals, make sure he has IV access, and call a rapid response and the surgeon",
    "v": 2,
    "fb": "A soaked dressing with a rising heart rate and falling pressure is bleeding until proven otherwise. He needs help at the bedside now."
   },
   {
    "t": "Reinforce the dressing, mark the edges of the drainage and call the surgeon",
    "v": 1,
    "fb": "Good steps, but his vitals have already turned. That's rapid response territory, and you should stay with him."
   },
   {
    "t": "Take off the dressing to look at the incision",
    "v": 0,
    "fb": "The first surgical dressing usually stays on unless the surgeon says otherwise, and taking it off removes pressure from a bleeding wound."
   },
   {
    "t": "Mark the drainage and recheck in 30 minutes",
    "v": -1,
    "fb": "His heart rate and blood pressure are already changing. Thirty minutes of bleeding can become shock."
   }
  ],
  "teach": "Post-op bleeding: reinforce, apply pressure, trend vitals, check IV access, and escalate early. A rising heart rate often comes before the blood pressure falls. Rapid response criteria exist so you call before the crash (IHI)."
 },
 {
  "id": "fc-pca-oversed",
  "k": [
   "med"
  ],
  "from": "@cna",
  "title": "Hard to wake",
  "dom": "meds",
  "cost": 4,
  "exp": 12,
  "ping": "{cna}: \"I can't really wake up 405. His daughter says she's been pressing his pain button for him.\"",
  "text": "Mr. Osei, 72, first day after a bowel resection, on a hydromorphone PCA. Respirations 7, SpO₂ 86% on 2 L, pinpoint pupils. He opens his eyes to a hard sternal rub, then drifts off. \"I didn't want him to wake up in pain.\"",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Stop the PCA, stimulate him, support his airway, call a rapid response, and give naloxone per protocol",
    "v": 2,
    "fb": "Respirations of 7 with heavy sedation is opioid-induced respiratory depression. Stop the source, reverse it, and get help."
   },
   {
    "t": "Stop the PCA and call the provider",
    "v": 1,
    "fb": "Stopping it is right. But with respirations of 7 and SpO₂ 86%, he needs naloxone and a rapid response, not a callback."
   },
   {
    "t": "Turn up his oxygen and recheck in 15 minutes",
    "v": 0,
    "fb": "Oxygen can raise the number while he keeps hypoventilating. It hides the problem instead of treating it."
   },
   {
    "t": "Let him sleep. His pain is finally controlled",
    "v": -1,
    "fb": "Sedation is the warning that comes before respiratory arrest. This is not comfortable sleep."
   }
  ],
  "teach": "Sedation comes before respiratory depression: use a sedation scale (POSS) and capnography for PCA. Only the patient presses the button; PCA by proxy is unsafe (ISMP). Naloxone is diluted and titrated in small doses per protocol."
 },
 {
  "id": "fc-water",
  "k": [
   "psych"
  ],
  "from": "@cna",
  "title": "At the sink",
  "dom": "assess",
  "cost": 3,
  "exp": 15,
  "ping": "{cna}: \"Mr. Ames on B hall keeps drinking from the bathroom sink, and now he's acting weird.\"",
  "text": "Mr. Ames, 41, schizophrenia. He's refilled his cup all morning. Now he's confused, says his head is pounding, and he vomited once. His weight is up 3 kg since this morning.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Restrict his fluids, check vitals and neuro status, put him on seizure precautions, and call the psychiatrist for a stat sodium",
    "v": 2,
    "fb": "Compulsive drinking, a quick weight gain, headache, vomiting and confusion point to water intoxication with low sodium. Seizures can follow."
   },
   {
    "t": "Restrict his fluids and ask the psychiatrist to see him today",
    "v": 1,
    "fb": "Restriction is right, but new confusion makes this urgent. He needs a sodium now and seizure precautions."
   },
   {
    "t": "Give his PRN for agitation",
    "v": 0,
    "fb": "He's confused because he's medically sick. A sedative can hide a worsening brain."
   },
   {
    "t": "Let him keep drinking. He's thirsty",
    "v": -1,
    "fb": "More water drives his sodium lower. This can end in seizures, coma or death."
   }
  ],
  "teach": "Psychogenic polydipsia: watch for rapid weight gain, headache, vomiting and confusion. Restrict fluids, check sodium urgently, and correct it slowly, usually no more than 8 to 10 mEq/L in 24 hours, to avoid osmotic demyelination (US expert panel hyponatremia recommendations)."
 },
 {
  "id": "fc-refuse",
  "k": [
   "psych"
  ],
  "from": "fl-rn",
  "title": "Refusing meds",
  "dom": "judgment",
  "cost": 3,
  "exp": 18,
  "ping": "{rn}: \"My patient on a hold won't take his olanzapine. Can I just mix it into his pudding?\"",
  "text": "Mr. Ortega, 27, on a 72-hour involuntary hold. He's calm, sitting in the dayroom, and says the pills make him \"feel like a zombie.\" There's no court order for medication and no emergency.",
  "q": "What do you tell {rn}?",
  "opts": [
   {
    "t": "No hidden meds. Ask him what bothers him about it, document the refusal, and let the psychiatrist know so they can address side effects or seek a court order if needed",
    "v": 2,
    "fb": "A hold allows him to be kept for evaluation, not medicated against his will. Side effects are often the real reason, and they can be fixed."
   },
   {
    "t": "Document the refusal and offer it again in an hour",
    "v": 1,
    "fb": "Offering again is fine, but the psychiatrist needs to know, and asking why matters most."
   },
   {
    "t": "Tell him he has to take it because he's on a hold",
    "v": 0,
    "fb": "That's not true outside an emergency or a court order, and pressure erodes trust."
   },
   {
    "t": "Mix it into his pudding without telling him",
    "v": -1,
    "fb": "Covert medication violates his rights and his trust, and it's battery. If he finds out, he may refuse everything."
   }
  ],
  "teach": "An involuntary hold is not consent to medicate. Outside an emergency (imminent danger), involuntary medication needs a capacity determination or court order under state law (in California, a Riese hearing). Covert medication is never acceptable."
 },
 {
  "id": "fc-boundary",
  "k": [
   "psych"
  ],
  "from": "@cna",
  "title": "Behind a closed door",
  "dom": "safety",
  "cost": 4,
  "exp": 12,
  "ping": "{cna}: \"I found two patients together in a room on B hall with the door shut.\"",
  "text": "Tessa, 19, and Mr. Voss, 45. Her shirt is half off and she looks frightened; he says \"she wanted to.\" Tessa was admitted yesterday for mania.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Separate them now, keep Tessa safe with a staff member, talk with each privately, increase observation, notify the charge nurse and psychiatrist, and document what you saw in their words",
    "v": 2,
    "fb": "A patient in acute mania may not be able to consent. Treat this as a possible assault: protect, assess, notify, and report per policy."
   },
   {
    "t": "Separate them and put both on closer observation",
    "v": 1,
    "fb": "Good start, but Tessa needs to be assessed and the team notified now. This may need to be reported."
   },
   {
    "t": "Remind both of them about unit rules and send them to their rooms",
    "v": 0,
    "fb": "This treats a possible assault as a rule violation. Tessa may not be able to consent."
   },
   {
    "t": "Put both of them in seclusion",
    "v": -1,
    "fb": "Seclusion is for imminent danger to others, not punishment, and secluding Tessa punishes the person who may have been harmed."
   }
  ],
  "teach": "Sexual contact on a psychiatric unit is a patient safety event: patients may lack capacity to consent. Separate, protect, assess, notify the provider, document objectively and report per policy and state law (Joint Commission sentinel event policy)."
 },
 {
  "id": "fc-cheek",
  "k": [
   "psych"
  ],
  "from": "@cna",
  "title": "In the napkin",
  "dom": "meds",
  "cost": 2,
  "exp": 18,
  "ping": "{cna}: \"I think Ms. Ford on B hall spat her pills into a napkin after med pass.\"",
  "text": "Ms. Ford, 33, admitted for depression after an overdose. {cna} found three of her sertraline tablets wrapped in a napkin by her bed.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Talk with her privately and without judgment about why, search her room per policy for a stash, tell the psychiatrist, and document",
    "v": 2,
    "fb": "Cheeking can mean side effects, ambivalence, or saving pills for an overdose. With her history, a stash is a real danger."
   },
   {
    "t": "Start mouth checks at every med pass and tell the psychiatrist",
    "v": 1,
    "fb": "Mouth checks help, but you also need to look for pills she's already saved and ask her why."
   },
   {
    "t": "Confront her about it in the dayroom",
    "v": 0,
    "fb": "Public confrontation shames her and makes honesty less likely. Talk privately."
   },
   {
    "t": "Throw the pills away and say nothing. It's only three",
    "v": -1,
    "fb": "Hidden pills after an overdose admission is a suicide risk signal. It has to be addressed and reported."
   }
  ],
  "teach": "Cheeked or hoarded meds: explore the reason, search per policy, notify the prescriber, and consider liquid or dissolving forms. For a patient at suicide risk, hoarding is a warning sign (Joint Commission NPSG 15.01.01)."
 },
 {
  "id": "fc-neofever",
  "k": [
   "peds"
  ],
  "from": "fl-rn",
  "title": "A warm newborn",
  "dom": "priority",
  "cost": 3,
  "exp": 15,
  "ping": "{rn}: \"My 18-day-old just spiked. Can you look with me?\"",
  "text": "Leo, 18 days old, admitted for poor weight gain. Rectal temp 38.2 °C (100.8 °F). He's feeding a little less but looks pink and alert. His parents ask if he can just have some Tylenol.",
  "q": "What do you advise?",
  "opts": [
   {
    "t": "Call the provider now: a fever in a baby this young means blood, urine and spinal fluid cultures and IV antibiotics",
    "v": 2,
    "fb": "At 8 to 21 days old, a fever of 38.0 °C (100.4 °F) or more needs a full sepsis workup, including a lumbar puncture, no matter how well the baby looks."
   },
   {
    "t": "Recheck the temperature in 30 minutes, then call",
    "v": 1,
    "fb": "A rectal 38.2 is already a fever. A recheck can go alongside the call, but shouldn't delay it."
   },
   {
    "t": "He looks well. Recheck at the next vitals",
    "v": 0,
    "fb": "Well-appearing newborns can still have bacteremia or meningitis. Looking well doesn't rule it out."
   },
   {
    "t": "Give acetaminophen per the PRN order and recheck",
    "v": -1,
    "fb": "Treating the fever hides it before the workup and doesn't treat an infection. This baby needs a provider now."
   }
  ],
  "teach": "Febrile infants 8 to 21 days old (38.0 °C (100.4 °F) or higher) get urine, blood and CSF studies and IV antibiotics. From 22 to 60 days the workup is guided by urinalysis and inflammatory markers, but every febrile young infant needs prompt provider evaluation; appearance doesn't rule out serious infection (AAP Febrile Infant Guideline, 2021)."
 },
 {
  "id": "fc-battery",
  "k": [
   "peds"
  ],
  "from": "fl-rn",
  "title": "A missing battery",
  "dom": "priority",
  "cost": 3,
  "exp": 12,
  "ping": "{rn}: \"Mom in 514 thinks her toddler swallowed a battery. I'm with another family.\"",
  "text": "Mia, 2, admitted for gastroenteritis. Mom found the TV remote open and its coin-sized battery missing, about 30 minutes ago. Mia is drooling a little and fussing, but breathing comfortably.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Call the provider now for a stat X-ray and urgent removal, and ask about honey per poison center guidance while she waits",
    "v": 2,
    "fb": "A button battery in the esophagus can burn through tissue in about two hours. Honey coats it and slows the damage while she waits for removal."
   },
   {
    "t": "Call the National Battery Ingestion Hotline, then tell the provider",
    "v": 1,
    "fb": "The hotline is a good resource, but the provider needs to know first. The X-ray and removal can't wait."
   },
   {
    "t": "Watch her stools for the battery",
    "v": -1,
    "fb": "Waiting without an X-ray is how an esophageal battery burns through. Watching stools is only for a battery confirmed past the esophagus."
   },
   {
    "t": "Give her a drink of water to wash it down",
    "v": 0,
    "fb": "Water doesn't move a stuck battery or protect the tissue, and she may need anesthesia soon. Nothing by mouth except honey per guidance."
   }
  ],
  "teach": "Suspected button battery: stat X-ray and urgent endoscopic removal if it's in the esophagus. For children over 1 year, within 12 hours of ingestion, honey 10 mL every 10 minutes (up to 6 doses) can limit injury, but it never delays removal and is skipped if perforation is suspected. Never induce vomiting (National Capital Poison Center, NASPGHAN)."
 },
 {
  "id": "fc-teen",
  "k": [
   "peds"
  ],
  "from": "fl-rn",
  "title": "Just between us",
  "dom": "comm",
  "cost": 2,
  "exp": 20,
  "ping": "{rn}: \"My 16-year-old asked me something while her mom stepped out. Can you help me answer?\"",
  "text": "Ava, 16, post-op day 1 after an appendectomy. \"Can I get tested for STIs while I'm here? My mom can't know.\"",
  "q": "What do you advise?",
  "opts": [
   {
    "t": "Tell her yes, she can consent to that herself, explain the limits of confidentiality, and get the provider to talk with her privately, including about the portal and the bill",
    "v": 2,
    "fb": "Minors can consent to STI testing and treatment in every US state, though some set a minimum age. Being honest about the limits builds trust; the portal and billing are where secrets leak."
   },
   {
    "t": "Tell her you'll ask the provider to come by when her mom is out",
    "v": 1,
    "fb": "Good instinct, but tell her now that she has the right to this care and what the limits are."
   },
   {
    "t": "Promise her nothing will ever be shared",
    "v": 0,
    "fb": "You can't promise that. Risk of serious harm or abuse has to be shared, and a broken promise ends trust."
   },
   {
    "t": "Tell her mom when she comes back. She's a minor",
    "v": -1,
    "fb": "That breaks a legal right to confidential care and teaches her not to ask for help again."
   }
  ],
  "teach": "Offer adolescents private time and confidential care. All states let minors consent to STI testing and treatment (some set a minimum age). Explain the limits: serious risk of harm to self or others, and abuse; reporting rules vary by state (AAP, Society for Adolescent Health and Medicine)."
 },
 {
  "id": "fc-quiet",
  "k": [
   "peds"
  ],
  "from": "@cna",
  "title": "Finally quiet",
  "dom": "assess",
  "cost": 3,
  "exp": 12,
  "ping": "{cna}: \"Good news, I think. The asthma kid in 511 stopped wheezing.\"",
  "text": "Jayden, 7, admitted for an asthma attack on albuterol every hour. He's slumped forward, quiet, and too tired to talk. SpO₂ 89%. You barely hear air moving in either lung.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Call a rapid response, sit him up, give oxygen, and get the provider for more albuterol and escalation",
    "v": 2,
    "fb": "A quiet chest with low oxygen and fatigue means so little air is moving that there's nothing left to wheeze. He's heading toward respiratory failure."
   },
   {
    "t": "Put him on oxygen and recheck in 15 minutes",
    "v": 1,
    "fb": "Oxygen is right, but this picture needs help at the bedside now, not a recheck."
   },
   {
    "t": "Recheck the SpO₂ with a new probe",
    "v": 0,
    "fb": "Trust the patient over the probe. He's tired, quiet and not moving air."
   },
   {
    "t": "Let him rest. The wheezing stopped",
    "v": -1,
    "fb": "Wheezing that stops while he looks worse is a sign of failure, not recovery."
   }
  ],
  "teach": "In asthma, a silent chest, drowsiness, being unable to speak, and falling SpO₂ mean life-threatening obstruction or exhaustion. Escalate immediately (NAEPP; GINA)."
 },
 {
  "id": "fc-ppbp",
  "k": [
   "ob"
  ],
  "from": "fl-rn",
  "title": "A bad headache",
  "dom": "priority",
  "cost": 4,
  "exp": 14,
  "ping": "{rn}: \"My postpartum mom has a bad headache and her pressure is up. Can you look?\"",
  "text": "Mrs. Tanaka, 34, day 2 after a vaginal birth, normal blood pressures during pregnancy. Severe headache not touched by acetaminophen, and spots in her vision. BP 164/108 fifteen minutes ago, 162/110 now.",
  "q": "What do you advise?",
  "opts": [
   {
    "t": "Call the provider now: severe-range pressure with a headache needs antihypertensive treatment within the hour and likely magnesium",
    "v": 2,
    "fb": "Severe-range BP lasting 15 minutes is an emergency, and headache with vision changes is a severe feature. Postpartum preeclampsia can start after a normal pregnancy."
   },
   {
    "t": "Recheck with a properly sized cuff, then call",
    "v": 1,
    "fb": "Cuff size matters, but you already have two severe readings. Call while you recheck."
   },
   {
    "t": "Mention it at the next routine provider update",
    "v": 0,
    "fb": "Severe-range pressure is treated within 30 to 60 minutes. This can't wait for an update."
   },
   {
    "t": "Dim the lights, give a PRN for the headache, and recheck in an hour",
    "v": -1,
    "fb": "This treats the symptom of a stroke and seizure risk. She needs the provider now."
   }
  ],
  "teach": "Severe-range BP (systolic 160 or more, or diastolic 110 or more) lasting 15 minutes is a hypertensive emergency: treat within 30 to 60 minutes. Postpartum preeclampsia can appear up to 6 weeks after birth (ACOG)."
 },
 {
  "id": "fc-dystocia",
  "k": [
   "ob"
  ],
  "from": "fl-rn",
  "title": "Stuck shoulders",
  "dom": "priority",
  "cost": 4,
  "exp": 10,
  "ping": "{rn} hits the emergency bell in the delivery room: \"Shoulder dystocia! I need hands!\"",
  "text": "The head is out and has pulled back tight against the perineum. The shoulders won't deliver with gentle traction. The provider is on the way.",
  "q": "What do you do first?",
  "opts": [
   {
    "t": "Call for the full team and neonatal help, flex her thighs back onto her abdomen (McRoberts), apply suprapubic pressure, and call out the time",
    "v": 2,
    "fb": "McRoberts with suprapubic pressure frees most stuck shoulders. Time matters because the baby's oxygen is limited until delivery."
   },
   {
    "t": "Help her onto her hands and knees",
    "v": 1,
    "fb": "Hands and knees is a valid maneuver, but McRoberts and suprapubic pressure come first and are faster in a bed."
   },
   {
    "t": "Tell her to keep pushing, the next contraction will do it",
    "v": 0,
    "fb": "Pushing alone wedges the shoulder harder against the pubic bone. Change the position first."
   },
   {
    "t": "Push down on the top of her belly",
    "v": -1,
    "fb": "Fundal pressure drives the shoulder further into the pubic bone and raises the risk of injury and uterine rupture."
   }
  ],
  "teach": "Shoulder dystocia (HELPERR): call for Help, Evaluate for episiotomy, Legs (McRoberts), suprapubic Pressure, Enter for internal maneuvers, Remove the posterior arm, Roll to hands and knees. No fundal pressure, no excess traction (ACOG, ALSO)."
 },
 {
  "id": "fc-rhig",
  "k": [
   "ob"
  ],
  "from": "fl-rn",
  "title": "Skipping the shot",
  "dom": "comm",
  "cost": 2,
  "exp": 20,
  "ping": "{rn}: \"My Rh-negative mom doesn't want her RhoGAM. Can you help me with this?\"",
  "text": "Ms. Bello, 29, O negative, unsensitized. Her baby is Rh positive. \"I'm not having more kids, and I don't want a blood product.\"",
  "q": "What do you advise?",
  "opts": [
   {
    "t": "Ask about her concerns, explain that it prevents antibodies that could harm a future pregnancy, let the provider talk with her, and if she still declines, document an informed refusal",
    "v": 2,
    "fb": "Plans change, and the antibodies are permanent. She may refuse, but only once she understands what she's refusing."
   },
   {
    "t": "Let the provider handle the conversation",
    "v": 1,
    "fb": "The provider should be involved, but you can start by finding out what's behind her worry."
   },
   {
    "t": "Document that she declined and move on",
    "v": 0,
    "fb": "Without education, that's not an informed refusal. And the window is only 72 hours."
   },
   {
    "t": "Tell her it's required by hospital policy",
    "v": -1,
    "fb": "That's not true, and it's coercion. A competent adult can refuse."
   }
  ],
  "teach": "An Rh(D)-negative, unsensitized mother of an Rh-positive baby gets Rh immune globulin within 72 hours of birth, with a screen for a large fetomaternal bleed to size the dose. Refusal after education is her right; document it and tell the provider (ACOG)."
 },
 {
  "id": "fc-mag",
  "k": [
   "ob"
  ],
  "from": "@cna",
  "title": "Very drowsy",
  "dom": "meds",
  "cost": 4,
  "exp": 12,
  "ping": "{cna}: \"{rn}'s patient on magnesium in 220 is really sleepy, and her breathing is slow.\" {rn} is in a delivery.",
  "text": "Mrs. Ochoa, 31, preeclampsia with severe features, on magnesium sulfate 2 g an hour. Respirations 10, hard to rouse, no patellar reflexes. Urine output 15 mL an hour for the past two hours.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Stop the magnesium, stay with her, support her breathing, call the provider, and get calcium gluconate to the bedside",
    "v": 2,
    "fb": "Lost reflexes and slow breathing are magnesium toxicity, and low urine output means her kidneys aren't clearing it. Stop it and get the antidote ready."
   },
   {
    "t": "Stop the infusion and draw a magnesium level, then decide",
    "v": 1,
    "fb": "Stopping it is right, but her breathing can't wait for a lab. Call now and have calcium gluconate ready."
   },
   {
    "t": "Cut the rate in half",
    "v": 0,
    "fb": "She's already toxic. Half the rate is still more magnesium."
   },
   {
    "t": "Leave it running. Drowsiness is expected on magnesium",
    "v": -1,
    "fb": "Some flushing and sleepiness are expected; absent reflexes and respirations of 10 are not. Next comes respiratory arrest."
   }
  ],
  "teach": "On magnesium sulfate, check reflexes, respirations, level of consciousness and urine output at least hourly. Reflexes disappear before breathing slows. The antidote is calcium gluconate IV per order (ACOG)."
 },
 {
  "id": "fc-sepsis",
  "k": [
   "ed"
  ],
  "from": "fl-rn",
  "title": "Back in the lobby",
  "dom": "priority",
  "cost": 3,
  "exp": 12,
  "ping": "{rn}, from triage: \"Can you look at someone in the waiting room? Something's off.\"",
  "text": "Mr. Keane, 78, sent from his nursing home with a UTI history. Temp 38.9 °C (102.0 °F), HR 118, BP 88/52, RR 24, newly confused per his facility. He was triaged ESI 3 and is in a waiting room chair.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Bring him back now, upgrade him, and start the sepsis pathway: lactate, blood cultures, antibiotics within an hour, and fluids for his pressure",
    "v": 2,
    "fb": "Fever, tachycardia, low blood pressure and new confusion are septic shock until proven otherwise. Every hour without antibiotics raises mortality."
   },
   {
    "t": "Draw labs in triage and keep him in the lobby until a bed opens",
    "v": 1,
    "fb": "Labs help, but a hypotensive, confused patient needs a monitored bed and treatment, not a chair."
   },
   {
    "t": "Recheck his vitals in 30 minutes",
    "v": 0,
    "fb": "His vitals already meet sepsis criteria. Rechecking doesn't change what he needs."
   },
   {
    "t": "Give acetaminophen in the lobby and let him wait",
    "v": -1,
    "fb": "That treats the fever and hides it while the infection and shock progress."
   }
  ],
  "teach": "Suspected sepsis with hypotension: lactate, blood cultures before antibiotics, antibiotics within 1 hour, and 30 mL/kg of crystalloid (Surviving Sepsis Campaign, 2021). Hypotension or new confusion means at least ESI 2."
 },
 {
  "id": "fc-si",
  "k": [
   "ed"
  ],
  "from": "fl-sec",
  "title": "Headed for the door",
  "dom": "safety",
  "cost": 4,
  "exp": 10,
  "ping": "Officer Dale: \"The guy who just told triage he wants to kill himself is walking out.\"",
  "text": "Mr. Pruitt, 35, checked in 20 minutes ago and told triage he plans to overdose tonight. Now he's at the exit doors, saying he's \"fine\" and changed his mind.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Stay with him, keep him from leaving with security's help, move him to a safe room on continuous observation, and get the provider to evaluate him for an emergency hold",
    "v": 2,
    "fb": "A stated plan makes him an imminent danger to himself. That's the legal and ethical basis to keep him for evaluation."
   },
   {
    "t": "Bring him back to a regular exam room and ask the provider to see him next",
    "v": 1,
    "fb": "Keeping him is right, but he needs continuous observation in a room cleared of ligature points and anything he could use."
   },
   {
    "t": "Have him promise not to hurt himself, then let him go",
    "v": 0,
    "fb": "A no-harm promise is not a safety plan, and it doesn't protect anyone."
   },
   {
    "t": "Let him leave. He walked in on his own",
    "v": -1,
    "fb": "How he arrived doesn't matter. A patient with a suicide plan who leaves before evaluation is at high risk of dying."
   }
  ],
  "teach": "Screen every ED patient for suicide risk. Someone at imminent risk stays under continuous observation in a ligature-resistant space and can be held for emergency evaluation under state law (Joint Commission NPSG 15.01.01)."
 },
 {
  "id": "fc-stroke",
  "k": [
   "ed"
  ],
  "from": "fl-clerk",
  "title": "Wrong words",
  "dom": "priority",
  "cost": 3,
  "exp": 12,
  "ping": "Pat, at registration: \"This man's words are coming out wrong. His wife says he was fine at breakfast.\"",
  "text": "Mr. Haddad, 67, the right side of his mouth drooping, his right hand clumsy on the pen. His wife says he was normal at 8:15. It's 9:20.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Call a stroke alert now, confirm the last known well time, check a glucose, and take him straight to CT",
    "v": 2,
    "fb": "Face droop, arm weakness and speech trouble starting an hour ago: he's in the treatment window. Every minute counts."
   },
   {
    "t": "Check his glucose first, then decide",
    "v": 1,
    "fb": "Glucose has to be checked, since low sugar mimics stroke, but it happens alongside the stroke alert, not before it."
   },
   {
    "t": "Finish registering him, then send him to triage",
    "v": 0,
    "fb": "Registration can wait. He needs a stroke alert now."
   },
   {
    "t": "Have them sit down. Triage will get to him",
    "v": -1,
    "fb": "Waiting in the lobby could cost him the window for clot-busting drugs or clot retrieval."
   }
  ],
  "teach": "BE-FAST: Balance, Eyes, Face, Arm, Speech, Time. Get the last known well time, check glucose, and aim for imaging within about 20 to 25 minutes of arrival and thrombolytics within 60 minutes when eligible (AHA/ASA)."
 },
 {
  "id": "fc-anaphylaxis",
  "k": [
   "ed"
  ],
  "from": "fl-rn",
  "title": "After the cookie",
  "dom": "meds",
  "cost": 3,
  "exp": 10,
  "ping": "{rn}, from triage: \"I've got a kid with hives and a swollen lip. Can you help?\"",
  "text": "Zoe, 9, 30 kg, peanut allergy. She ate a bakery cookie 20 minutes ago. Hives, swollen lips, a hoarse cough, and she vomited once. Her mom gave diphenhydramine at home. The ED has an anaphylaxis standing protocol.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Give IM epinephrine per protocol (0.01 mg/kg, here 0.3 mg) in the outer thigh now, bring her to a monitored bed, and call the provider",
    "v": 2,
    "fb": "Skin plus breathing and gut symptoms after a known allergen is anaphylaxis. Epinephrine first; delay is what kills."
   },
   {
    "t": "Bring her to a monitored bed and call the provider for orders",
    "v": 1,
    "fb": "Right destination, but with a standing protocol, epinephrine shouldn't wait for orders."
   },
   {
    "t": "Give albuterol for the cough",
    "v": 0,
    "fb": "Albuterol can help wheeze, but it doesn't treat airway swelling or shock. Epinephrine does."
   },
   {
    "t": "Give more diphenhydramine and watch her",
    "v": -1,
    "fb": "Antihistamines treat hives, not airway swelling or low blood pressure. Relying on them delays epinephrine."
   }
  ],
  "teach": "Anaphylaxis: IM epinephrine 0.01 mg/kg of 1 mg/mL in the anterolateral thigh (max 0.3 mg in children, 0.5 mg in adults), repeat every 5 to 15 minutes as needed. Antihistamines are add-ons, not treatment. Watch for a biphasic reaction (AAAAI/ACAAI Anaphylaxis Practice Parameter, 2023)."
 },
 {
  "id": "pp-near-miss",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-rn",
  "title": "Caught at scan",
  "dom": "safety",
  "cost": 2,
  "exp": 20,
  "ping": "{rn}: \"The scanner just saved me. Got a second?\"",
  "text": {
   "med": "\"I had 410's insulin in my hand in 408. The armband scan beeped wrong patient. Same last name, Le, rooms side by side. Nothing was given. Do I really need to write that up?\"",
   "psych": "\"I brought Mr. Lee's clozapine to Mr. Li at the med window. The scan caught it. Nothing was given. Do I really need to write that up?\"",
   "peds": "\"I had 511's antibiotic at the bedside in 513. Two toddlers named Mia. The scan caught it. Nothing was given. Do I really need to write that up?\"",
   "ob": "\"I had the wrong baby's hepatitis B vaccine in 222. Twin last names on the bassinet cards. The scan caught it. Nothing was given. Do I really need to write that up?\"",
   "ed": "\"I had bay 4's ketorolac in bay 5. Both Johnsons, both in their 60s. The scan caught it. Nothing was given. Do I really need to write that up?\""
  },
  "q": "What do you tell {rn}?",
  "opts": [
   {
    "t": "Yes: file a near-miss report, and ask Nova about a name alert or a room move",
    "v": 2,
    "fb": "A near miss is a free lesson. The same setup will catch someone else on a day the scanner is down or overridden."
   },
   {
    "t": "No harm, no report. The system worked",
    "v": 0,
    "fb": "The scanner was the last barrier. Near-miss reports show where the earlier barriers failed, and they are how look-alike names get flagged."
   },
   {
    "t": "Just tell Nova so she can warn the next shift",
    "v": 1,
    "fb": "Warning the team helps tonight. The report is what fixes it for good."
   },
   {
    "t": "Write a note in the patient's chart about the near miss",
    "v": 0,
    "fb": "Nothing happened to the patient, and the chart isn't the place for safety reporting. Use the event system."
   }
  ],
  "teach": "Report near misses through the safety event system. Two identifiers and barcode scanning are safety goals (Joint Commission NPSG), and near-miss data is how hospitals fix systems before harm happens."
 },
 {
  "id": "pp-chain-command",
  "k": [
   "med",
   "psych",
   "peds",
   "ob"
  ],
  "from": "fl-rn",
  "title": "Won't come",
  "dom": "judgment",
  "cost": 4,
  "exp": 12,
  "must": true,
  "ping": "{rn}: \"My patient is going downhill and the resident won't come. What do I do?\"",
  "text": {
   "med": "Mr. Pruitt, 70, post-op day 1. BP 84/50 from 118/70, HR 124, new confusion, no urine in 3 hours. The resident said on the phone, \"Give a 250 bolus and call me in the morning.\"",
   "psych": "Ms. Ortiz, 52, on B hall. Temp 39.1 °C, HR 128, BP 92/58, confused and breathing fast. The on-call psychiatrist said, \"Give acetaminophen and recheck in four hours.\" No medicine team has seen her.",
   "peds": "Leo, 3, with pneumonia. RR 62, retracting, SpO₂ 88% on 2 L, sleepier than an hour ago. The resident said, \"Turn up the oxygen and I'll be up after the admission.\"",
   "ob": "A mom 3 hours after a cesarean. HR 122, BP 88/52, the fundus is boggy and the pad soaked in 15 minutes. The resident said, \"Massage the fundus. I'm in a delivery.\""
  },
  "q": "What do you advise?",
  "opts": [
   {
    "t": "Call a rapid response now, tell Nova, and go up the chain to the attending if the resident still won't come",
    "v": 2,
    "fb": "Rapid response exists for exactly this: a patient meeting criteria while the team is unavailable. The chain of command is your duty, not an insult to the resident."
   },
   {
    "t": "Page the resident again with a tight SBAR and the specific numbers",
    "v": 1,
    "fb": "A sharper SBAR sometimes works, but this patient meets rapid response criteria now. Don't spend the minutes on a third try."
   },
   {
    "t": "Do what the resident said and recheck in an hour",
    "v": 0,
    "fb": "The order doesn't match the picture. Following it while the patient worsens makes you part of the delay."
   },
   {
    "t": "Document that you notified the resident and wait for morning rounds",
    "v": -1,
    "fb": "Documenting a notification doesn't treat shock. Nurses are held responsible for failure to rescue when they don't escalate."
   }
  ],
  "teach": "When a provider doesn't respond to a deteriorating patient, escalate: rapid response, charge nurse, attending, house supervisor, per your chain of command. Document times, values, who you called and what they said.",
  "miss": {
   "text": "A deteriorating patient waited until Nova called a rapid response.",
   "why": "Failure to rescue happens in the gap between noticing and escalating. If a provider won't come, go up the chain right away."
  }
 },
 {
  "id": "pp-gift",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "@cna",
  "title": "An envelope",
  "dom": "judgment",
  "cost": 2,
  "exp": 20,
  "ping": "{cna}: \"Your patient's family is at the desk asking for you. They have an envelope.\"",
  "text": {
   "med": "Mr. Ochoa's wife, at discharge, presses an envelope into your hand: $200 in cash. \"You saved his life. Please. Buy yourself something nice.\"",
   "psych": "Ms. Patel's father, at discharge, hands you an envelope with $150 in cash. \"You were the only one who got through to her.\"",
   "peds": "Jayden's grandmother, at discharge, presses an envelope into your hand: $100 in cash. \"For the nurse who held him every night.\"",
   "ob": "A new dad presses an envelope into your hand: $100 in cash. \"You got us through the worst night of our lives.\"",
   "ed": "A patient's son finds you in the hall with $100 in cash. \"You stayed with my mom when I couldn't get here.\""
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Thank them warmly, decline the cash, and suggest a card, a note to your manager, or a gift to the hospital foundation",
    "v": 2,
    "fb": "You honor the gratitude without blurring the relationship. A note to the manager often means more to you than cash would."
   },
   {
    "t": "Accept it and use it to buy the whole unit lunch",
    "v": 0,
    "fb": "Generous, but the cash still went to you. Most policies prohibit accepting money in any form."
   },
   {
    "t": "Accept it so you don't offend them",
    "v": 0,
    "fb": "A gracious no doesn't offend most people. Cash gifts create obligation and blur the line between care and payment."
   },
   {
    "t": "Tell them to give it to Nova instead",
    "v": 1,
    "fb": "Avoids taking it yourself, but it passes the problem on. Decline and offer a better way to say thanks."
   }
  ],
  "teach": "Professional boundaries: decline cash and personal gifts, warmly, and redirect gratitude to a card, a recognition program or the hospital foundation. Follow facility policy on small shared items like food (ANA Code, Provision 2)."
 },
 {
  "id": "pp-lateral",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "@cna",
  "title": "In front of him",
  "dom": "comm",
  "cost": 3,
  "exp": 18,
  "ping": "{cna}: \"Marta is in your patient's room asking where you are. She's not being nice about it.\"",
  "text": {
   "med": "You walk in. Marta, a nurse with 20 years on the unit, says in front of Mr. Ibarra: \"His IV beeped for ten minutes. Did they teach you anything in school?\" He looks at you, worried.",
   "psych": "You walk in. Marta, a nurse with 20 years on the unit, says in front of Mr. Ibarra in the dayroom: \"You let him have that? Seriously? Did they teach you anything?\" He looks at you, embarrassed.",
   "peds": "You walk in. Marta, a nurse with 20 years on the unit, says in front of Ella's mother: \"Her pump beeped for ten minutes. Did they teach you anything in school?\" Mom looks at you, frightened.",
   "ob": "You walk in. Marta, a nurse with 20 years on the unit, says in front of the new mom: \"You didn't check her fundus? Did they teach you anything in school?\" The mom looks at you, worried.",
   "ed": "You walk in. Marta, a nurse with 20 years in the ED, says in front of the patient in bay 6: \"His pump beeped for ten minutes. Did they teach you anything in school?\" He looks at you, worried."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Stay calm, deal with the patient's need, then ask Marta to talk away from the bedside and tell her directly how it landed",
    "v": 2,
    "fb": "The patient first, and never a conflict in front of them. A calm, specific conversation in private is the most effective first step; report it if it continues."
   },
   {
    "t": "Snap back at her right there",
    "v": 0,
    "fb": "Understandable, but a fight in front of the patient frightens them and makes you look like the problem."
   },
   {
    "t": "Say nothing, ever. It's how new nurses get toughened up",
    "v": 0,
    "fb": "Bullying isn't a rite of passage. It drives nurses out and makes new staff afraid to ask questions, which is unsafe."
   },
   {
    "t": "Let it go for now, and tell Nova after the shift",
    "v": 1,
    "fb": "Reporting is reasonable, especially for a pattern. But addressing it directly, privately, is usually the first step and often enough."
   }
  ],
  "teach": "Incivility and bullying undermine patient safety (Joint Commission sentinel event alert; ANA position on zero tolerance). Address it privately and directly, document specifics, and escalate if it continues."
 },
 {
  "id": "pp-harass",
  "k": [
   "med",
   "psych",
   "ed"
  ],
  "from": "@cna",
  "title": "Hands off",
  "dom": "deleg",
  "cost": 3,
  "exp": 15,
  "ping": "{cna}, quietly: \"Do I have to keep going into 410? He keeps grabbing at me.\"",
  "text": {
   "med": "Mr. Keller, 49, alert and oriented, after knee surgery. {cna} says he's made sexual comments all shift and just grabbed her hip during a bed bath. She's shaken.",
   "psych": "Mr. Keller, 49, on B hall for mania. {cna} says he's made sexual comments all shift and just grabbed her hip when she brought his tray. She's shaken.",
   "ed": "Mr. Keller, 49, in bay 8, sober and oriented. {cna} says he's made sexual comments since he arrived and just grabbed her hip during vitals. She's shaken."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Check that she's okay, go set a clear limit with him, pair staff for his care, tell Nova, and document and report it",
    "v": 2,
    "fb": "Care continues, but with limits and a plan. Behavior is documented objectively and reported, whether or not it's illness-driven."
   },
   {
    "t": "Tell her it comes with the job; just be quick in there",
    "v": -1,
    "fb": "Sexual harassment from patients is workplace violence. Brushing it off leaves her alone with him and tells everyone it's fine."
   },
   {
    "t": "Swap her for a male aide and say nothing to the patient",
    "v": 1,
    "fb": "Protecting her is good, but without a limit set and a report filed, the behavior just moves to the next person."
   },
   {
    "t": "Tell her she doesn't have to go back in, and leave his care until someone else can do it",
    "v": 0,
    "fb": "She shouldn't go alone, but his care can't stop. Pair staff and keep caring for him."
   }
  ],
  "teach": "Sexual harassment by patients is workplace violence (OSHA). Set clear limits, pair staff, document behavior objectively, report per policy, and support the staff member. Patient illness may explain behavior but doesn't mean staff absorb it."
 },
 {
  "id": "pp-double",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-clerk",
  "title": "Stay over?",
  "dom": "judgment",
  "cost": 2,
  "exp": 15,
  "ping": "Pat: \"Nova's asking if you can stay until 0700. Nights are two short.\"",
  "text": "It's 1830 at the end of your 12. You slept four hours last night and nearly mixed up two patients' meds this afternoon. You'd be on hour 24 at the end.",
  "q": "What do you say?",
  "opts": [
   {
    "t": "Tell Nova honestly you're too tired to be safe, and offer to help call people in before you leave",
    "v": 2,
    "fb": "Knowing your limit is professional, not selfish. Fatigue after 12 hours behaves like impairment, and you already had a warning this afternoon."
   },
   {
    "t": "Stay the full 12. The unit needs you",
    "v": 0,
    "fb": "A nurse on hour 24 who already had a close call isn't really adding safety. Error risk climbs sharply after 12 hours."
   },
   {
    "t": "Offer to stay two hours to bridge while she finds someone",
    "v": 1,
    "fb": "A short bridge can be reasonable if you're truly able. Be honest with yourself: you already had a close call."
   },
   {
    "t": "Say yes and lean on coffee",
    "v": 0,
    "fb": "Caffeine masks sleepiness without fixing reaction time or judgment."
   }
  ],
  "teach": "You are responsible for being fit for duty. Shifts over 12 hours and little sleep raise error rates (ANA position on fatigue). Saying no to unsafe overtime is acceptable; mandatory overtime is limited in many states."
 },
 {
  "id": "pp-witness",
  "k": [
   "med",
   "ob",
   "ed"
  ],
  "from": "@cna",
  "title": "Sign as witness",
  "dom": "judgment",
  "cost": 2,
  "exp": 20,
  "ping": "{cna}: \"Mr. Hargrove in 410 wants a nurse to witness his paperwork.\"",
  "text": "Mr. Hargrove, 74, has his will and an advance directive on the tray table. \"My lawyer said I need two witnesses. You and the aide can do it, right? Just sign under my name.\"",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Tell him you'll find out, check hospital policy, and call social work or the chaplain, who know the witness and notary rules",
    "v": 2,
    "fb": "Many hospitals bar staff from witnessing wills, and some states don't allow employees of the treating facility to witness advance directives. Policy and social work get it done right."
   },
   {
    "t": "Sign both. You're only witnessing his signature",
    "v": 0,
    "fb": "Witnessing can draw you into a legal dispute, and if your state excludes facility staff, an improper witness can invalidate the document."
   },
   {
    "t": "Tell him nurses can't help with legal paperwork",
    "v": 0,
    "fb": "Advance directives matter to his care. Shutting the door means it may never get done. Help him find the right person."
   },
   {
    "t": "Sign the advance directive but not the will",
    "v": 1,
    "fb": "Closer: health care documents are more often within reach. But witness rules vary, so check policy before you sign anything."
   }
  ],
  "teach": "Before witnessing any legal document, check facility policy. Wills are generally not witnessed by staff; advance directives have state-specific witness rules that often exclude health care providers or employees. Social work and chaplains help."
 },
 {
  "id": "pp-student-sign",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-rn",
  "title": "Student signature",
  "dom": "deleg",
  "cost": 2,
  "exp": 18,
  "ping": "A nursing student working with {rn} catches you at the station.",
  "text": "\"Can you co-sign my 1000 assessment and the med I gave in 410? My instructor is on another floor and {rn} is in a room. It was just acetaminophen.\"",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Decline kindly: you can't sign what you didn't see. Help her reach her instructor or {rn}",
    "v": 2,
    "fb": "A co-signature means you verified it. The instructor and the assigned nurse are responsible for her work; your job is to point her to them."
   },
   {
    "t": "Sign it. It's only acetaminophen",
    "v": -1,
    "fb": "Low risk doesn't make a false signature true. You'd be vouching for an assessment and a dose you never saw."
   },
   {
    "t": "Go reassess the patient yourself and then sign the assessment, not the med",
    "v": 1,
    "fb": "Your own assessment is real, but it's yours, not hers. Chart your own; leave hers for her instructor or {rn}."
   },
   {
    "t": "Tell her to leave it unsigned until the end of the shift",
    "v": 0,
    "fb": "The med and assessment need verification now, not hours later. Get her to her instructor."
   }
  ],
  "teach": "Never sign for care you didn't witness or verify. Students work under their clinical instructor and the assigned RN, who verify and co-sign their documentation per school and facility policy."
 },
 {
  "id": "pp-recording",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-sec",
  "title": "On camera",
  "dom": "comm",
  "cost": 2,
  "exp": 15,
  "ping": "Officer Dale: \"A visitor is filming on your hall. Want me to come up?\"",
  "text": {
   "med": "Mr. Webb's son is filming you on his phone while you change his father's dressing. \"I'm keeping a record. Last time this place messed up.\"",
   "psych": "A visitor in the dayroom is filming her brother, with two other patients clearly in frame behind him.",
   "peds": "A dad is filming you start an IV on his son. The camera keeps swinging to the open door and the hallway.",
   "ob": "A visitor is filming in the hallway outside the nursery, with other families' babies in view.",
   "ed": "A visitor is filming the hallway beds from the doorway of bay 4, with patients on stretchers in view."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Calmly ask them to stop, explain the policy protects other patients' and staff privacy, ask what worries them, and get Nova involved",
    "v": 2,
    "fb": "The recording is often about fear or distrust. Address the worry and the policy together; security is backup if it escalates."
   },
   {
    "t": "Take the phone and delete the video",
    "v": -1,
    "fb": "Grabbing someone's phone can turn into assault and a scene. Set the limit, don't seize property."
   },
   {
    "t": "Ignore it and keep working",
    "v": 0,
    "fb": "Other patients' privacy is your responsibility too, and ignoring it leaves the concern underneath unaddressed."
   },
   {
    "t": "Have Officer Dale come up and remove them",
    "v": 1,
    "fb": "Security may be needed, but starting there escalates fast. Try a calm conversation first."
   }
  ],
  "teach": "Follow facility policy on recording. Protect other patients' privacy, set limits calmly, explore the concern behind it, and involve the charge nurse and security only as needed."
 },
 {
  "id": "pp-bedside-report",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-rn",
  "title": "Skip the rooms?",
  "dom": "comm",
  "cost": 3,
  "exp": 15,
  "ping": "{rn}, coming on for night shift: \"Let's just do report at the station. I'm slammed.\"",
  "text": {
   "med": "Your patients: a heparin drip with a new rate, a PCA, a fresh post-op and a confused patient on a bed alarm.",
   "psych": "Your patients need a real handoff: one on 15-minute checks for suicide risk, one who refused meds, one waiting on a hold evaluation.",
   "peds": "Your patients: an infant on high-flow, a toddler with a fresh IV, a teen on a PCA and a new admission.",
   "ob": "Your patients: a mom on magnesium, a fresh cesarean with an epidural still in, and two couplets with babies due for bilirubin checks.",
   "ed": "Your beds: a patient on a nitroglycerin drip, a hip fracture going upstairs, a stroke alert back from CT and an intoxicated patient on a sitter."
  },
  "q": "What do you say?",
  "opts": [
   {
    "t": "Do the sensitive parts at the station, then walk in together to check the patient, the drips and the safety setup",
    "v": 2,
    "fb": "Bedside report catches the wrong pump rate, the missing bed alarm and the change you missed. Private details can stay at the station."
   },
   {
    "t": "Do the whole report at the station; it's faster",
    "v": 0,
    "fb": "Faster now, slower later. She'll find the pump discrepancy on her own at 2 a.m., without you there to explain."
   },
   {
    "t": "Give a quick verbal at the station and have her check the drips on her first rounds",
    "v": 1,
    "fb": "Better than nothing, but the point is checking together while you're still there to answer questions."
   },
   {
    "t": "Leave her a printed report and go",
    "v": -1,
    "fb": "A sheet of paper can't take questions. Handoff isn't complete until the oncoming nurse has accepted it."
   }
  ],
  "teach": "Handoff is a high-risk moment (Joint Commission). Use a structured tool (SBAR or I-PASS), verify drips, lines and safety equipment at the bedside, and give the patient a chance to take part. Keep sensitive details private."
 },
 {
  "id": "fc-cdiff",
  "k": [
   "med"
  ],
  "from": "fl-lab",
  "title": "C. diff positive",
  "dom": "safety",
  "cost": 3,
  "exp": 18,
  "ping": "Lab: a positive C. diff toxin on the new admission in 410. Her nurse is off the floor.",
  "text": "Mrs. Lindqvist, 79, came up from the ED three hours ago with diarrhea after a course of antibiotics. She's in a semi-private room with the curtain drawn. {cna} just came out of the room and is rubbing alcohol foam into her hands.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Contact enteric precautions now: a private room, gown and gloves, soap and water for hands, dedicated equipment, and bleach for cleaning",
    "v": 2,
    "fb": "C. diff spores survive alcohol rub and most standard cleaners. Soap and water physically removes them, and a sporicidal (bleach) cleaner kills them on surfaces."
   },
   {
    "t": "Gown and gloves for everyone going in, and keep using foam since it's faster",
    "v": 0,
    "fb": "Gown and gloves are right, but alcohol doesn't kill C. diff spores. Hands need soap and water after this room."
   },
   {
    "t": "Wait for her nurse to come back and set up the precautions",
    "v": 0,
    "fb": "Every trip in and out without precautions spreads spores, and her roommate is sharing a bathroom with her right now."
   },
   {
    "t": "Put up a contact sign and have housekeeping do a routine clean at discharge",
    "v": 1,
    "fb": "The sign is a start. C. diff also needs a private room, soap and water hand hygiene, and daily and terminal cleaning with a sporicidal agent."
   }
  ],
  "teach": "C. diff: contact precautions (often called contact enteric or contact plus), a private room or cohort, soap and water hand hygiene, dedicated equipment, and EPA-registered sporicidal cleaning such as bleach (CDC).",
  "miss": {
   "text": "A C. diff patient shared a bathroom with her roommate for another hour before Nova moved her.",
   "why": "Spores spread on hands and surfaces. Precautions start the moment the result comes in, not when the assigned nurse is free."
  }
 },
 {
  "id": "fc-tb-cough",
  "k": [
   "ed",
   "med"
  ],
  "from": "fl-rn",
  "title": "A long cough",
  "dom": "priority",
  "cost": 3,
  "exp": 15,
  "ping": "{rn}: \"I've got a cough I don't love. Can you help me sort out where he goes?\"",
  "text": {
   "ed": "A 46-year-old man in the waiting room, coughing for two months, drenching night sweats, 9 kg weight loss, and some blood in his sputum. He recently came back from a long stay with family in a country with high TB rates. He's sitting in a crowded row of chairs.",
   "med": "A new admission for pneumonia in a shared room: coughing for two months, night sweats, 9 kg weight loss, and blood-streaked sputum. He recently came back from a long stay with family in a country with high TB rates. His roommate is on chemotherapy."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Put a surgical mask on him and move him to an airborne infection isolation room now; staff wear fit-tested N95s",
    "v": 2,
    "fb": "Two months of cough, night sweats, weight loss and hemoptysis is TB until ruled out. The mask on the patient cuts what he spreads; the negative pressure room and N95s protect everyone else."
   },
   {
    "t": "Put an N95 on him and keep him where he is until the chest X-ray comes back",
    "v": 0,
    "fb": "The patient wears a surgical mask; the N95 is for staff. And he needs a negative pressure room, not a wait in a shared space."
   },
   {
    "t": "Droplet precautions in a private room with the door closed",
    "v": 1,
    "fb": "Better than where he is, but TB is airborne. The tiny particles stay in the air and drift, so it needs an airborne infection isolation room."
   },
   {
    "t": "Wait for the provider to order isolation",
    "v": 0,
    "fb": "Nurses can start transmission-based precautions on suspicion. Waiting means more exposed people to track down."
   }
  ],
  "teach": "Suspected TB: airborne precautions in a negative pressure airborne infection isolation room, fit-tested N95 respirators for staff, and a surgical mask on the patient whenever he leaves the room (CDC).",
  "miss": {
   "text": "A probable TB patient coughed in a shared space until Nova moved him. Employee health is now tracing exposures.",
   "why": "Isolate on suspicion. Every minute in a shared space is more people to screen."
  }
 },
 {
  "id": "fc-doff",
  "k": [
   "med",
   "psych",
   "peds",
   "ob",
   "ed"
  ],
  "from": "@cna",
  "title": "Taking it off",
  "dom": "deleg",
  "cost": 2,
  "exp": 18,
  "ping": "{cna}: \"Quick one. I'm done in the contact room. Does the gown or the gloves come off first?\"",
  "text": "{cna} is standing just inside the door of an MRSA contact precautions room in a gown and gloves, after changing the patient's soiled linens. She's reaching for the door handle with a gloved hand.",
  "q": "What do you tell her?",
  "opts": [
   {
    "t": "Gown off first so the gloves protect your hands while you untie it, then gloves, then wash in the hall",
    "v": 1,
    "fb": "Pulling off gown and gloves together is fine, but on their own the gloves usually come first: they're the dirtiest item. And the handle needs a clean hand, not a glove."
   },
   {
    "t": "Gloves off first, then the gown rolled inside out, both into the bin inside the room, then hand hygiene before or right as she leaves",
    "v": 2,
    "fb": "The most contaminated item comes off first, everything stays in the room, and hand hygiene comes before she touches anything outside."
   },
   {
    "t": "Keep it all on and take it off at the clean supply room so the bin in the room doesn't overflow",
    "v": -1,
    "fb": "Walking the hall in a contaminated gown and gloves carries MRSA onto every surface she touches. PPE comes off at the doorway."
   },
   {
    "t": "Order doesn't really matter as long as she washes her hands after",
    "v": 0,
    "fb": "Order matters: removing PPE in the wrong sequence is when staff contaminate their own hands, wrists and scrubs."
   }
  ],
  "teach": "CDC doffing sequence: gloves, eye protection, gown, mask or respirator, then hand hygiene (gown and gloves can come off together). Remove PPE at the doorway or in the anteroom, and clean hands right away."
 },
 {
  "id": "fc-pressure",
  "k": [
   "med"
  ],
  "from": "@cna",
  "title": "A sore spot",
  "dom": "assess",
  "cost": 3,
  "exp": 20,
  "ping": "{cna}: \"There's an open spot on the tailbone in 410. Can you look?\"",
  "text": "Mr. Ferraro, 84, mostly in bed after a stroke. Over his sacrum: a shallow, open, pink wound about 2 cm across, no slough, no tunneling. The skin around it is red and blanches. His brief is damp.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Massage the red skin around it to bring blood flow back, then a barrier cream",
    "v": 0,
    "fb": "Massaging over a pressure area damages fragile tissue. Barrier cream helps around it, not massage."
   },
   {
    "t": "Put a donut cushion under him and recheck at the end of the shift",
    "v": -1,
    "fb": "Ring cushions concentrate pressure around the wound and cut off blood flow. And a new pressure injury can't wait a shift."
   },
   {
    "t": "Stage it (stage 2), take pressure off it, get him on a pressure-redistribution surface with a turning schedule, manage the moisture, document and notify the provider and wound care",
    "v": 2,
    "fb": "Partial-thickness loss with a pink wound bed and no slough is stage 2. Offloading, moisture control and the right surface stop it from getting deeper."
   },
   {
    "t": "Tell {cna} to turn him every 2 hours and put a dressing on it",
    "v": 1,
    "fb": "Turning is right, and part of it can be delegated. But a new pressure injury needs an RN to stage it, document it, and get the provider and wound care involved."
   }
  ],
  "teach": "Stage 2 pressure injury: partial-thickness loss, shallow pink or red wound bed, no slough. Reposition, offload, manage moisture and nutrition, document, and report. CMS treats hospital-acquired stage 3 and 4 injuries as never events.",
  "miss": {
   "text": "The sacral wound sat another shift without an offloading plan until Nova saw it.",
   "why": "Stage 2 can become stage 3 within days. The aide found it; an RN needs to stage it and start the plan."
  }
 },
 {
  "id": "fc-clabsi",
  "k": [
   "med",
   "peds"
  ],
  "from": "@cna",
  "title": "Wet dressing",
  "dom": "assess",
  "cost": 3,
  "exp": 18,
  "ping": "{cna}: \"The dressing on the central line in {rn}'s patient is soaked, and she feels warm.\"",
  "text": {
   "med": "Mrs. Oyelaran, 58, with a PICC line on day 9 of IV antibiotics. The transparent dressing is wet and lifting at the edges, last changed 8 days ago. Temp 38.6, HR 104. {rn} is in a procedure.",
   "peds": "Mia, 7, with a central line for long-term IV antibiotics. The dressing is damp and lifting at one corner, last changed 8 days ago. Temp 38.6, HR 138. {rn} is in a procedure."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Reinforce the edges with tape until {rn} gets back",
    "v": 0,
    "fb": "Taping over a wet, lifting dressing seals moisture and bacteria against the insertion site."
   },
   {
    "t": "Pull the line since it's probably infected",
    "v": 0,
    "fb": "Removing a central line takes an order, and it may still be needed or may be cultured first. Call the provider."
   },
   {
    "t": "Change the dressing with sterile technique and a CHG dressing, assess the site, and call the provider about the fever and whether the line is still needed",
    "v": 2,
    "fb": "A damp, loose or overdue dressing gets changed now. A fever with a central line means the provider decides on blood cultures and whether the line stays."
   },
   {
    "t": "Give acetaminophen for the fever and change the dressing at the next scheduled time",
    "v": -1,
    "fb": "Masking a fever and leaving a wet dressing in place is how a line infection gets missed. Fever with a central line needs a provider now."
   }
  ],
  "teach": "CLABSI prevention: transparent dressings changed every 7 days and immediately if damp, loose or soiled; sterile technique with CHG; scrub the hub; and review every day whether the line is still needed (CDC). New fever with a line means notify for cultures.",
  "miss": {
   "text": "The wet central line dressing stayed on until Nova changed it. The patient now has positive blood cultures.",
   "why": "A damp dressing is an open door for bacteria straight into the bloodstream."
  }
 },
 {
  "id": "fc-foley",
  "k": [
   "med"
  ],
  "from": "fl-rn",
  "title": "Day 5 Foley",
  "dom": "judgment",
  "cost": 2,
  "exp": 22,
  "ping": "{rn}: \"Can you help me with a Foley question? I'm about to change the bag in 420.\"",
  "text": "Mr. Kowalski, 73, post-op day 5 after a colectomy. He's walking the halls and eating. The Foley went in for surgery and is still there. No retention, no strict I and O order, no comfort-care plan. The unit has a nurse-driven catheter removal protocol.",
  "q": "What do you tell {rn}?",
  "opts": [
   {
    "t": "Leave it in until the surgeon decides, since it was a surgical order",
    "v": 0,
    "fb": "Waiting on rounds keeps a catheter in without a reason. The protocol exists so nurses can act on this."
   },
   {
    "t": "Check it against the protocol's indications; none apply, so remove it per protocol and monitor for voiding, with a bladder scan if he hasn't voided in about 6 hours",
    "v": 2,
    "fb": "Every catheter day raises infection risk. A nurse-driven removal protocol lets you take it out when no approved indication remains."
   },
   {
    "t": "Keep it but switch to a new bag and catheter since it's been 5 days",
    "v": 0,
    "fb": "Routine changes don't prevent infection. The fix is removal when there's no indication."
   },
   {
    "t": "Page the surgeon now for a removal order",
    "v": 1,
    "fb": "Reasonable if there were no protocol. With one, the nurse can remove it and let the surgeon know."
   }
  ],
  "teach": "CAUTI prevention: insert only for an approved indication, review daily, and remove as soon as it's no longer needed. Nurse-driven removal protocols are one of the most effective ways to cut catheter days (CDC, CMS).",
  "miss": {
   "text": "Mr. Kowalski's Foley stayed in another day without an indication.",
   "why": "Risk of urinary infection rises with each catheter day. No indication means it comes out."
  }
 },
 {
  "id": "fc-miss-me",
  "k": [
   "med"
  ],
  "from": "@cna",
  "title": "\"Nobody would miss me\"",
  "dom": "safety",
  "cost": 3,
  "exp": 14,
  "ping": "{cna}: \"The man in 422 said something that's bugging me.\"",
  "text": "Mr. Sato, 67, admitted with a COPD flare. His wife died in the spring. While {cna} was helping him wash, he said, \"Honestly, nobody would miss me if I didn't wake up.\" He has a razor and a bag of home medications in his drawer.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Tell {cna} he's probably just tired, and mention it at report",
    "v": -1,
    "fb": "Passive death wishes are a real warning sign, especially in an older man who's grieving. It needs a screen today."
   },
   {
    "t": "Ask the provider for a psychiatry consult in the morning",
    "v": 1,
    "fb": "A consult may be the right next step, but first ask him directly and keep him safe right now."
   },
   {
    "t": "Go talk with him and ask directly about thoughts of suicide using the screening tool; if positive, start a safety sitter, remove the razor and medications, and notify the provider",
    "v": 2,
    "fb": "Asking directly doesn't plant the idea. A validated screen tells you the risk; a sitter and removing means keep him safe while the team responds."
   },
   {
    "t": "Remove the razor and the medications, but don't bring it up with him so he doesn't feel watched",
    "v": 0,
    "fb": "Removing means is right, but you can't gauge risk without asking him."
   }
  ],
  "teach": "Any statement about not wanting to live gets a direct question and a validated screen (such as the C-SSRS or ASQ), even on a medical unit. Joint Commission's suicide prevention goal calls for screening, safety precautions and an environmental check.",
  "miss": {
   "text": "Nobody followed up on what Mr. Sato said until Nova screened him. He had a plan.",
   "why": "Medical patients die by suicide in hospitals too. Statements like this get a screen now."
  }
 },
 {
  "id": "fc-elope",
  "k": [
   "med",
   "ed"
  ],
  "from": "fl-sec",
  "title": "Heading out",
  "dom": "safety",
  "cost": 3,
  "exp": 10,
  "ping": "Officer Dale: \"One of your patients is at the elevators in a gown, saying he's going home.\"",
  "text": {
   "med": "Mr. Whitfield, 81, admitted with pneumonia, mild dementia, and confused since last night. He has his IV still in and no shoes. He's pressing the elevator button and getting annoyed.",
   "ed": "Mr. Whitfield, 81, brought in by family for confusion, now at the ambulance bay doors with his IV in, saying he needs to feed his dog."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Go to him, stay with him, and gently redirect: meet him where he is (\"Let's get your dog sorted, walk with me\"), then bring him back and tell the provider and charge nurse",
    "v": 2,
    "fb": "A confused patient can't make a safe decision to leave. Calm redirection works better than arguing, and his new confusion needs a provider to look for delirium."
   },
   {
    "t": "Ask Officer Dale to hold his arms and walk him back",
    "v": 0,
    "fb": "Physical force on a confused older adult escalates him and risks injury. Security is backup if he can't be redirected."
   },
   {
    "t": "He's an adult; let him go and document that he left against advice",
    "v": -1,
    "fb": "Leaving AMA requires capacity. A confused patient doesn't have it, and a frail man in a gown on the street can die from exposure, falls or traffic."
   },
   {
    "t": "Bring him back and put him in restraints so it doesn't happen again",
    "v": 0,
    "fb": "Restraints are a last resort and need an order. Address the confusion: a sitter, orientation, family, a bed alarm, and a check for delirium."
   }
  ],
  "teach": "Elopement risk: confused patients who try to leave need calm redirection, closer observation (sitter or video monitoring, alarms), a check for delirium, and a call to the provider. If a patient leaves, follow the missing-patient code. Restraint is a last resort.",
  "miss": {
   "text": "Mr. Whitfield made it to the parking garage before security found him.",
   "why": "Confused patients who leave can get hurt in minutes. Respond right away and stay with them."
  }
 },
 {
  "id": "fc-latex",
  "k": [
   "med",
   "peds",
   "ob",
   "ed"
  ],
  "from": "fl-rn",
  "title": "Before the procedure",
  "dom": "safety",
  "cost": 2,
  "exp": 18,
  "ping": "{rn}: \"Transport's coming for my patient's procedure. Can you finish the checklist with her?\"",
  "text": {
   "med": "Ms. Voss, 39, is going for a cystoscopy. Going through the checklist, she says her lips swelled after a dental visit, she gets hives from balloons, and she can't eat bananas or kiwi. Her allergy list says \"NKDA.\"",
   "peds": "Owen, 9, with spina bifida, is going for a urology procedure. His mom says his lips swelled at a birthday party with balloons. His allergy list says \"NKDA.\"",
   "ob": "Mrs. Teo, 32, is going back for a scheduled cesarean. She mentions her hands itch and swell with dish gloves and her mouth tingles with avocado. Her allergy list says \"NKDA.\"",
   "ed": "Ms. Voss, 39, is about to have a laceration repaired and a Foley placed. She mentions her lips swelled after a dental visit and balloons give her hives. Her allergy list says \"NKDA.\""
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Note it for the team in the procedure room; they'll handle it",
    "v": 0,
    "fb": "A note can get lost. The team needs to know before the room is set up, so they can plan a latex-safe case."
   },
   {
    "t": "Add a latex allergy to the chart, put on an allergy band, call the procedure team so the room is set up latex-safe, and use latex-free supplies here",
    "v": 2,
    "fb": "Swelling after dental work or balloons, with fruit cross-reactions (banana, kiwi, avocado), is a classic latex allergy story. Exposure on mucous membranes can cause anaphylaxis."
   },
   {
    "t": "Send her as scheduled; reactions to balloons are usually just skin",
    "v": -1,
    "fb": "Lip swelling is not just skin. Procedures put latex on mucous membranes and in the bloodstream, which is where anaphylaxis happens."
   },
   {
    "t": "Tell the provider and let them decide whether to delay",
    "v": 1,
    "fb": "The provider should know, but you don't need permission to document an allergy, band her and alert the procedure team."
   }
  ],
  "teach": "Latex allergy: ask about reactions to gloves, balloons, dental work and cross-reactive foods (banana, avocado, kiwi, chestnut). Document it, band the patient, notify the procedural team, and use latex-free supplies. People with spina bifida and frequent catheterizations are at higher risk.",
  "miss": {
   "text": "A colleague's patient going for a procedure, charted \"NKDA,\" had a latex allergy story; it reached the procedure room only because Nova caught it in the hall.",
   "why": "Latex on mucous membranes can cause anaphylaxis. The time to flag it is before transport."
  }
 },
 {
  "id": "fc-mri",
  "k": [
   "med",
   "peds",
   "ed"
  ],
  "from": "fl-clerk",
  "title": "MRI ready",
  "dom": "judgment",
  "cost": 2,
  "exp": 18,
  "ping": "Pat: \"MRI says they can take {rn}'s patient right now if transport goes in five minutes.\"",
  "text": {
   "med": "Mr. Lowe, 74, for a brain MRI. You notice a pacemaker scar and he's carrying a device card in his wallet. The MRI screening form in the chart is blank.",
   "peds": "Jayden, 14, for a spine MRI. He has type 1 diabetes and wears an insulin pump and a glucose sensor on his arm. The MRI screening form is blank.",
   "ed": "Mr. Lowe, 74, for a stat brain MRI. You notice a pacemaker scar and a device card in his wallet. The MRI screening form is blank."
  },
  "q": "What do you tell Pat?",
  "opts": [
   {
    "t": "Send him; MRI does its own screening at the door",
    "v": 0,
    "fb": "MRI will screen, but finding the device at the scanner wastes the slot and sometimes doesn't happen. The safety check starts with you."
   },
   {
    "t": "Send him and just tell the tech about the device",
    "v": 1,
    "fb": "Telling the tech is good, but the screening form and the device check need to be done before he leaves, so the right plan is in place."
   },
   {
    "t": "Hold transport: complete the MRI screening form, tell radiology and the provider about the device, and get it cleared or managed before he goes",
    "v": 2,
    "fb": "Pacemakers can be MR-conditional or not, and conditional ones need reprogramming and monitoring. Insulin pumps and sensors usually have to come off, with a glucose plan."
   },
   {
    "t": "Cancel the MRI; nobody with a device can have one",
    "v": 0,
    "fb": "Many modern pacemakers are MR-conditional, and pumps can be removed. Cancel only if radiology and the provider decide it's unsafe."
   }
  ],
  "teach": "MRI safety: screen every patient before transport for implanted devices (pacemakers, defibrillators, neurostimulators), pumps, sensors, metal and medication patches. Radiology and the provider decide on conditional devices; external pumps and sensors usually come off with a glucose plan.",
  "miss": {
   "text": "The patient got to MRI with an unscreened device before the tech stopped it.",
   "why": "Magnetic fields can heat, move or reset implants. Screening happens before transport."
  }
 },
 {
  "id": "fc-site-mark",
  "k": [
   "med"
  ],
  "from": "fl-rn",
  "title": "No mark",
  "dom": "safety",
  "cost": 2,
  "exp": 15,
  "ping": "{rn}: \"OR is here for my knee. Can you check the pre-op list with them? I'm stuck in a room.\"",
  "text": "Mrs. Duval, 69, scheduled for a right total knee replacement. Consent says right knee, ID band matches, NPO since midnight. The site mark line on the checklist is blank, and there's no mark on either knee. Transport is waiting.",
  "q": "What do you do?",
  "opts": [
   {
    "t": "Hold transport and call the surgeon's team to mark the site with her involvement before she leaves",
    "v": 2,
    "fb": "Universal Protocol: the site is marked by the person doing the procedure (or a designee per policy), with the patient awake and involved, before she goes."
   },
   {
    "t": "Mark the right knee yourself since the consent is clear",
    "v": 0,
    "fb": "Nurses generally don't mark the surgical site; it's done by the surgeon or a designated licensed provider who will be present for the procedure."
   },
   {
    "t": "Send her; they'll mark it in pre-op holding",
    "v": 1,
    "fb": "Some hospitals mark in holding, and it might happen there. But a blank line on your checklist means you hand it off clearly, not assume it."
   },
   {
    "t": "Send her; the time-out in the OR will catch it",
    "v": -1,
    "fb": "The time-out is the last check, not a backup for skipped steps. Wrong-site surgery happens when every layer assumes the next one will catch it."
   }
  ],
  "teach": "Joint Commission Universal Protocol: pre-procedure verification, site marking by the person doing the procedure with the patient involved, and a time-out before the incision. Any gap in the checklist is a stop.",
  "miss": {
   "text": "Mrs. Duval left for the OR with no site mark. Holding caught it.",
   "why": "Wrong-site surgery is a never event. Every checklist gap gets fixed before transport."
  }
 },
 {
  "id": "fc-heparin-check",
  "k": [
   "med",
   "peds"
  ],
  "from": "fl-rn",
  "title": "Heparin drip",
  "dom": "meds",
  "cost": 2,
  "exp": 15,
  "ping": "{rn}: \"I'm starting a heparin drip. It's programmed. Can you just glance at it and sign?\"",
  "text": {
   "med": "The bag is hung, the pump is programmed, and her thumb is on start. Mr. Iqbal, 82 kg, new DVT. Weight-based protocol: 80 units/kg bolus, then 18 units/kg/hr.",
   "peds": "The syringe is loaded, the pump is programmed, and her thumb is on start. Leo, 15 kg, a clot after a central line. Weight-based protocol: 75 units/kg bolus, then 28 units/kg/hr."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Sign it; she's careful and the pump has a drug library",
    "v": -1,
    "fb": "Smart pumps miss errors like a wrong weight or wrong concentration. A signature without a check makes the record false."
   },
   {
    "t": "Glance at the screen and sign if the rate looks reasonable",
    "v": 0,
    "fb": "A glance is the kind of check that confirms what you expect. An independent check means you calculate it yourself."
   },
   {
    "t": "Stop before she presses start: independently check the order, weight, bag concentration, dose and rate, and the pump programming yourself, then both sign",
    "v": 2,
    "fb": "Independent means you work it out on your own from the order and the bag, not from her numbers. Heparin errors are among the most common high-alert drug errors."
   },
   {
    "t": "Tell her to start it now so there's no delay, and you'll check it in a few minutes",
    "v": 0,
    "fb": "The check exists to catch the error before it reaches the patient. After the bolus is in, it's too late."
   }
  ],
  "teach": "Heparin is a high-alert medication (ISMP). An independent double check means a second nurse separately verifies the patient, order, weight, concentration, dose, rate and pump programming before the infusion starts.",
  "miss": {
   "text": "The heparin drip started without a second check. Pharmacy caught a weight entry error an hour later.",
   "why": "The double check is the last barrier before a high-alert drug reaches the patient."
  }
 },
 {
  "id": "fc-milk",
  "k": [
   "peds",
   "ob"
  ],
  "from": "@cna",
  "title": "The wrong milk",
  "dom": "safety",
  "cost": 2,
  "exp": 15,
  "ping": "{cna}: \"I'm warming a bottle for the baby in 210. The label looks a little off.\"",
  "text": {
   "peds": "An 8-week-old admitted with bronchiolitis, feeding from bottles of his mother's pumped milk. The bag {cna} pulled from the unit fridge is labeled for a baby in 220, with a similar last name. The baby is fussing and hungry.",
   "ob": "A 2-day-old in the nursery whose mother is pumping. The bag {cna} pulled from the fridge is labeled for another baby with a similar last name. The baby is fussing and hungry."
  },
  "q": "What do you do?",
  "opts": [
   {
    "t": "Stop. Don't feed it. Return it to the right baby's bin, find the right milk with two identifiers, and report the near miss",
    "v": 2,
    "fb": "Breast milk is a body fluid and is treated like a medication: two identifiers, the baby's band against the label, every time. A near miss gets reported so the storage problem gets fixed."
   },
   {
    "t": "Feed it; breast milk is breast milk and he's hungry",
    "v": -1,
    "fb": "Another mother's milk can carry infections and medications. Feeding the wrong milk is an exposure event that needs disclosure and follow-up."
   },
   {
    "t": "Give formula for now and sort out the milk later",
    "v": 1,
    "fb": "Safe for this feed, but the mother may not want formula. The fix is finding the right milk, and reporting the mix-up."
   },
   {
    "t": "Ask the mother if she minds using it this one time",
    "v": 0,
    "fb": "Parents can't consent to another family's milk on the spot. It's an exposure question, not a preference."
   }
  ],
  "teach": "Expressed breast milk is handled like a medication: labeled with two identifiers, stored per baby, and checked against the infant's band before every feed. A wrong-milk feeding is reported, disclosed and followed up like a body fluid exposure.",
  "miss": {
   "text": "The baby got the wrong mother's milk before Nova saw the label.",
   "why": "Wrong-milk feedings need disclosure to both families and possible testing. Two identifiers prevent them."
  }
 },
 {
  "id": "fc-car-seat",
  "k": [
   "peds",
   "ob"
  ],
  "from": "@cna",
  "title": "Ride home",
  "dom": "deleg",
  "cost": 3,
  "exp": 20,
  "ping": "{cna}: \"The family in {rn}'s room is ready to go. Can I just walk them down?\"",
  "text": {
   "peds": "Sofia, 11 months and 9 kg, going home after a pneumonia stay. Dad has buckled her into a forward-facing seat in a puffy snowsuit. The harness is loose and the chest clip is down at her belly. {rn} is in another room.",
   "ob": "A 2-day-old going home. Dad has buckled him into the infant seat in a thick snowsuit. The harness is loose enough to fit a hand under, and the chest clip is down at his belly. {rn} is in another room."
  },
  "q": "What do you tell {cna}?",
  "opts": [
   {
    "t": "Walk them down; car seat use is the parents' responsibility",
    "v": -1,
    "fb": "Discharge is your last chance to fix a car seat that could fail in a crash. Teaching it is part of a safe discharge."
   },
   {
    "t": "Ask {cna} to tighten the straps and send them off",
    "v": 0,
    "fb": "A tighter strap over a puffy snowsuit still leaves slack in a crash. And teaching is an RN task, not one to delegate."
   },
   {
    "t": "Hold the discharge for a minute and go teach: snowsuit off with a blanket over the harness, harness snug with no slack at the collarbone, chest clip at armpit level, and the seat rear-facing in the back seat",
    "v": 2,
    "fb": "Bulky coats compress in a crash and leave the harness too loose. Children ride rear-facing as long as the seat allows; a child this age shouldn't be forward-facing."
   },
   {
    "t": "Give the family a car seat handout to read at home",
    "v": 1,
    "fb": "Handouts help, but they leave today in a seat set up wrong. Show them now."
   }
  ],
  "teach": "Safe transport: rear-facing in the back seat as long as the seat's limits allow (AAP), no bulky coats under the harness, harness snug (the pinch test at the collarbone), chest clip at armpit level. Teaching is an RN responsibility; refer families to a certified passenger safety technician for installation checks.",
  "miss": {
   "text": "The family left with the child in a loose harness over a snowsuit.",
   "why": "Car crashes are a leading cause of death in children. The seat is only as safe as how it's used."
  }
 }
]);
})(window.Shift);
