/* The Shift — NCLEX question bank: standalone items in every NCLEX-RN Client Needs category (cn) and every clinical
   judgment step, with per-option rationale inline and a tip. Formats as in ngn.js plus mc (single best answer), order
   (ordered response, all-or-nothing) and num (calculation). Written to current US standards; not yet clinically reviewed, needs nurse
   review before launch (see docs/CLINICAL-UPDATES.md). */
window.Shift = window.Shift || {};
window.Shift.ngnBank = [
 {
  "id": "qb-mgmt-1",
  "type": "mc",
  "step": "hypo",
  "cn": "mgmt",
  "sp": "ms",
  "topic": "Prioritizing a client group",
  "stem": "A new graduate nurse on a medical-surgical unit receives report at 07:30 on four clients. Client A: 72 years old, post-op day 1 after a bowel resection, pain 6/10, scheduled IV pain medication due at 08:00. Client B: 58 years old with pneumonia, newly confused, RR 28, SpO₂ 89% on 2 L by nasal cannula (was 95% at 04:00). Client C: 45 years old with type 2 diabetes, fingerstick glucose 248 mg/dL, breakfast tray arriving. Client D: 80 years old, discharge planned today, asking when the paperwork will be ready.",
  "q": "Which client should the nurse see first?",
  "opts": [
   {
    "t": "Client B, with pneumonia and new confusion",
    "ok": true,
    "why": "Yes: new confusion with a rising respiratory rate and falling SpO₂ signals worsening hypoxemia. This is an acute change in airway and breathing, which comes before every other need on the list."
   },
   {
    "t": "Client A, with post-op pain of 6/10",
    "ok": false,
    "why": "No: pain is real and the dose is due soon, but it is an expected post-op finding. The trap is choosing the most uncomfortable client over the most unstable one."
   },
   {
    "t": "Client C, with a glucose of 248 mg/dL",
    "ok": false,
    "why": "No: hyperglycemia before breakfast needs coverage per orders, but 248 mg/dL in an alert client is not immediately life-threatening and can wait a few minutes."
   },
   {
    "t": "Client D, who is waiting for discharge",
    "ok": false,
    "why": "No: discharge is a stable, predictable task. Seeing this client first to clear a bed is a common new-graduate trap that delays care of the unstable client."
   }
  ],
  "why": "Prioritize by airway, breathing and circulation, then by acute change versus expected findings. Client B has an unexpected change in mental status and oxygenation that points to hypoxemia and possible sepsis. The others have expected or stable problems that can safely wait a few minutes.",
  "tip": "Look for the client whose condition has changed from the last assessment, especially new confusion or a falling SpO₂."
 },
 {
  "id": "qb-mgmt-2",
  "type": "mc",
  "step": "solve",
  "cn": "mgmt",
  "sp": "ms",
  "topic": "Delegation to UAP",
  "stem": "A nurse is working with an unlicensed assistive personnel (UAP) on a busy medical-surgical unit. Several tasks need to be done in the next hour.",
  "q": "Which task is appropriate for the nurse to delegate to the UAP?",
  "opts": [
   {
    "t": "Walk a client in the hallway who is 3 days post knee replacement and has walked twice today with physical therapy",
    "ok": true,
    "why": "Yes: ambulating a stable client with a predictable response is a routine task within UAP training. The nurse still tells the UAP what to report, such as dizziness or pain."
   },
   {
    "t": "Take the first set of vital signs and check the groin site of a client just back from cardiac catheterization",
    "ok": false,
    "why": "No: the client is in the immediate post-procedure period and could bleed or lose a pulse. Checking the site is assessment, which the RN cannot delegate."
   },
   {
    "t": "Feed lunch to a client who coughed and choked on thin liquids at breakfast",
    "ok": false,
    "why": "No: this client has a new, unpredictable aspiration risk. The nurse needs to assess swallowing and get a swallow evaluation before anyone feeds the client."
   },
   {
    "t": "Teach a client how to use an incentive spirometer",
    "ok": false,
    "why": "No: initial teaching requires nursing judgment and is never delegated to UAP. The UAP can remind a client to use the device after the nurse has taught it."
   }
  ],
  "why": "Under the NCSBN and ANA delegation guidelines, the RN delegates tasks that are routine, have predictable outcomes and do not require assessment, teaching or judgment. Clients who are unstable or newly changed stay with the RN. The RN remains accountable and must give clear instructions and follow up.",
  "tip": "Delegate tasks for stable clients with predictable outcomes, and keep assessment, teaching, evaluation and unstable clients for the RN."
 },
 {
  "id": "qb-mgmt-3",
  "type": "sata",
  "step": "solve",
  "cn": "mgmt",
  "sp": "sd",
  "topic": "Assignment to the LPN",
  "stem": "A charge nurse on a cardiac step-down unit is making assignments for an RN and a licensed practical nurse (LPN). The LPN is experienced and oriented to the unit. LPN scope of practice varies by state; assume this state follows common practice.",
  "q": "Which clients are appropriate to assign to the LPN? Select all that apply.",
  "opts": [
   {
    "t": "A 66-year-old with heart failure, stable for 2 days, who needs scheduled oral medications and a daily weight before discharge tomorrow",
    "ok": true,
    "why": "Yes: this client is stable with predictable needs. Giving oral medications and collecting data such as weights are within LPN scope."
   },
   {
    "t": "A 72-year-old with rate-controlled chronic atrial fibrillation who needs scheduled subcutaneous enoxaparin and oral metoprolol",
    "ok": true,
    "why": "Yes: the condition is chronic and stable, and subcutaneous and oral medications are routinely given by LPNs. The LPN reports heart rate or bleeding changes to the RN."
   },
   {
    "t": "A 70-year-old on day 1 after a stent placement who needs a radial site dressing change and reinforcement of the cardiac diet teaching the RN gave yesterday",
    "ok": true,
    "why": "Yes: reinforcing teaching the RN has already done and caring for a stable site fit the LPN role. Initial teaching would stay with the RN."
   },
   {
    "t": "A 59-year-old admitted 30 minutes ago with chest pain and a troponin result pending",
    "ok": false,
    "why": "No: a new admission with possible acute coronary syndrome needs an RN admission assessment and is not yet stable or predictable."
   },
   {
    "t": "An 81-year-old with new third-degree heart block, HR 38, awaiting pacemaker placement",
    "ok": false,
    "why": "No: this client is unstable and could deteriorate suddenly. The trap is thinking the client only needs monitoring; it needs RN assessment and judgment."
   },
   {
    "t": "A 64-year-old starting a continuous heparin infusion that is titrated by protocol to aPTT results",
    "ok": false,
    "why": "No: titrating a high-alert IV anticoagulant requires ongoing RN assessment and judgment. In many states LPNs also may not manage this kind of IV therapy."
   },
   {
    "t": "A 55-year-old who needs first-time discharge teaching on a new warfarin prescription",
    "ok": false,
    "why": "No: initial teaching and evaluating the client's understanding are RN responsibilities. The LPN may reinforce the teaching afterward."
   }
  ],
  "why": "Assign the LPN stable clients with predictable outcomes whose care involves established procedures, oral and subcutaneous medications, and reinforcement of RN teaching. New admissions, unstable clients, initial teaching and high-alert IV titrations stay with the RN. Because LPN IV scope differs by state, the charge nurse must know the state practice act and facility policy.",
  "tip": "Ask whether the client is stable and predictable and whether the task requires initial assessment, initial teaching or evaluation; if so, it stays with the RN."
 },
 {
  "id": "qb-mgmt-4",
  "type": "matrix",
  "step": "solve",
  "cn": "mgmt",
  "sp": "ob",
  "topic": "Postpartum delegation",
  "stem": "A postpartum unit is staffed with an RN, an LPN and a UAP. The RN is planning the morning workload. LPN scope of practice varies by state; assume this state follows common practice.",
  "q": "For each task, indicate the staff member who is most appropriate to perform it.",
  "cols": [
   "UAP",
   "LPN",
   "RN"
  ],
  "rows": [
   {
    "t": "Take vital signs on a client 24 hours after an uncomplicated vaginal birth",
    "ans": 0,
    "why": "routine vital signs on a stable client are within UAP training. The RN tells the UAP which values to report right away."
   },
   {
    "t": "Help a stable client on postpartum day 1 take a shower",
    "ans": 0,
    "why": "hygiene help for a stable, ambulating client is a basic care task the UAP can perform."
   },
   {
    "t": "Give scheduled oral ibuprofen to a stable client on postpartum day 1",
    "ans": 1,
    "why": "giving oral medications to a stable client is within LPN scope; UAP cannot give medications."
   },
   {
    "t": "Reinforce the perineal care teaching the RN gave earlier",
    "ans": 1,
    "why": "the LPN may reinforce teaching the RN has already done. Initial teaching would stay with the RN."
   },
   {
    "t": "Admit a client just transferred from labor and delivery after a cesarean birth",
    "ans": 2,
    "why": "a fresh post-op client is unstable and needs an RN admission assessment of fundus, bleeding, incision and vital signs."
   },
   {
    "t": "Evaluate a client who reports soaking a pad in 30 minutes",
    "ans": 2,
    "why": "possible postpartum hemorrhage needs immediate RN assessment and judgment. The trap is sending the UAP to weigh the pad first."
   }
  ],
  "why": "Match each task to the lowest level of staff who can do it safely. UAP handle routine care for stable clients, the LPN gives medications and reinforces teaching for stable clients, and the RN keeps admissions, assessments of change and anything requiring judgment. Bleeding concerns after birth are always an RN assessment.",
  "tip": "First pull out anything involving assessment, new admission or a possible complication for the RN, then sort the remaining tasks by whether a license is required."
 },
 {
  "id": "qb-mgmt-5",
  "type": "mc",
  "step": "act",
  "cn": "mgmt",
  "sp": "ms",
  "topic": "Supervising delegated care",
  "stem": "A 71-year-old was admitted 3 hours ago with an acute ischemic stroke and left-sided weakness. The orders say NPO until a bedside swallow screen is completed. The nurse walks into the room and sees the UAP raising the head of the bed and setting up a breakfast tray to feed the client.",
  "q": "What is the nurse's best action?",
  "opts": [
   {
    "t": "Stop the UAP now, remove the tray, and explain that the client stays NPO until the swallow screen is done",
    "ok": true,
    "why": "Yes: the client is at high risk of aspiration, so the unsafe task must be stopped immediately. Clear, specific direction to the UAP is part of supervising delegated care."
   },
   {
    "t": "Let the UAP feed small bites of soft food while the nurse watches for coughing",
    "ok": false,
    "why": "No: watching for coughing does not replace a swallow screen, and silent aspiration is common after stroke. This also violates the NPO order."
   },
   {
    "t": "Let the UAP continue, then complete the swallow screen after breakfast",
    "ok": false,
    "why": "No: the screen must come before any food, fluid or oral medication. Doing it afterward defeats its purpose of preventing aspiration."
   },
   {
    "t": "Leave the room and report the UAP to the nurse manager",
    "ok": false,
    "why": "No: the client's safety comes first, and the nurse must intervene now. Coaching the UAP afterward, privately, is more useful than an immediate report."
   }
  ],
  "why": "The RN who delegates remains accountable for supervising the task and stepping in when care is unsafe. Feeding a client with a new stroke before a swallow screen risks aspiration pneumonia. After stopping the task, the nurse should check that the UAP knows which clients are NPO and why.",
  "tip": "When a delegated task is putting a client in danger, the first action is to stop it; teaching and reporting come after."
 },
 {
  "id": "qb-mgmt-6",
  "type": "sata",
  "step": "cues",
  "cn": "mgmt",
  "sp": "periop",
  "topic": "Witnessing informed consent",
  "stem": "At 07:15 in the preoperative holding area, a surgeon asks the nurse to witness a 54-year-old client's signature on the consent form for a laparoscopic cholecystectomy. The surgeon reviewed the procedure with the client yesterday in clinic.",
  "q": "Which findings require the nurse to hold the signature and notify the surgeon? Select all that apply.",
  "opts": [
   {
    "t": "The client says, \"I thought they were only taking out the stones, not the whole gallbladder.\"",
    "ok": true,
    "why": "Yes: the client does not understand the procedure, so consent is not informed. Explaining the procedure is the surgeon's duty; the nurse stops the process and notifies the surgeon."
   },
   {
    "t": "The client received midazolam 2 mg IV 10 minutes ago",
    "ok": true,
    "why": "Yes: a client under the effect of a sedative may not be able to give valid consent. Consent should be obtained before sedating premedication is given."
   },
   {
    "t": "The client asks, \"Is it true this might turn into a big open surgery?\"",
    "ok": true,
    "why": "Yes: an unanswered question about risks or alternatives means the surgeon needs to return. The trap is answering it yourself; the nurse does not provide the informed consent discussion."
   },
   {
    "t": "The client says, \"I'm nervous, but I want to get this done.\"",
    "ok": false,
    "why": "No: some anxiety before surgery is expected and does not make consent invalid. The nurse acknowledges the feeling and continues if the client understands the procedure."
   },
   {
    "t": "The client's spouse has not arrived yet",
    "ok": false,
    "why": "No: an alert adult with decision-making capacity consents for their own care. A spouse's presence or signature is not required."
   },
   {
    "t": "The client states a name and date of birth that match the wristband and the form",
    "ok": false,
    "why": "No: matching identifiers are what the nurse should confirm as a witness. This finding supports proceeding."
   },
   {
    "t": "The client put on reading glasses to read the form",
    "ok": false,
    "why": "No: using glasses shows the client could read the form. Vision aids help consent; they do not threaten it."
   }
  ],
  "why": "When the nurse witnesses consent, the nurse confirms the client's identity, that the client signed voluntarily, and that the client appears competent and not impaired. The provider performing the procedure is responsible for explaining it, its risks, benefits and alternatives. If the client lacks understanding, has questions or has been sedated, the nurse stops and notifies the provider.",
  "tip": "The nurse witnesses the signature; the provider informs. Any sign the client does not understand or cannot decide means stop and call the provider."
 },
 {
  "id": "qb-mgmt-7",
  "type": "mc",
  "step": "act",
  "cn": "mgmt",
  "sp": "comm",
  "topic": "Advocacy and interpreters",
  "stem": "A 68-year-old client who speaks Vietnamese and limited English is at a clinic visit to hear the results of a lung biopsy. Her 14-year-old grandson, who speaks both languages, says, \"I can just translate for her. I do it all the time.\" The provider is about to come in.",
  "q": "What is the nurse's best action?",
  "opts": [
   {
    "t": "Arrange a qualified medical interpreter in person, by phone or by video before the provider discusses the results",
    "ok": true,
    "why": "Yes: a trained medical interpreter conveys complex information accurately and protects the client's right to understand her diagnosis. Federal civil rights law requires most health care facilities to provide language access."
   },
   {
    "t": "Let the grandson interpret because the client trusts him",
    "ok": false,
    "why": "No: a minor family member may omit, soften or misunderstand serious news and should not carry that burden. Family interpreting risks errors and breaches the client's privacy."
   },
   {
    "t": "Have the provider speak slowly in simple English and ask the client to nod if she understands",
    "ok": false,
    "why": "No: nodding does not show understanding, especially across a language barrier. This approach invites the client to agree without comprehending."
   },
   {
    "t": "Give the client written results in English and have the grandson read them to her at home",
    "ok": false,
    "why": "No: this withholds a timely, accurate explanation from the client. It still relies on a child to translate a possible cancer diagnosis."
   }
  ],
  "why": "Advocacy means making sure the client can understand and take part in her own care. Clients with limited English proficiency have the right to a qualified interpreter at no cost. Family members, and especially minors, should not interpret medical discussions except in an emergency when no other option exists.",
  "tip": "When a stem offers a family member as an interpreter, look for the option that uses a qualified medical interpreter instead."
 },
 {
  "id": "qb-mgmt-8",
  "type": "mc",
  "step": "act",
  "cn": "mgmt",
  "sp": "ed",
  "topic": "POLST and code status",
  "stem": "An 84-year-old client from a skilled nursing facility arrives in the emergency department with respiratory distress. She is now unresponsive. Her POLST form, signed by her and her provider, states do not resuscitate, limited interventions, and no intubation. Her son, the named health care agent, agrees with the form. Her daughter arrives and says, \"Do everything. Put her on a breathing machine.\"",
  "q": "What is the nurse's best action?",
  "opts": [
   {
    "t": "Follow the POLST orders, notify the provider of the daughter's request, and stay with the daughter to offer support",
    "ok": true,
    "why": "Yes: a valid POLST is an actionable medical order reflecting the client's own wishes. The nurse honors it, involves the provider, and supports the distressed family member."
   },
   {
    "t": "Prepare for intubation because a family member has requested it",
    "ok": false,
    "why": "No: a family member who is not the decision-maker cannot override the client's documented wishes. Intubating against a valid POLST violates the client's autonomy."
   },
   {
    "t": "Begin full resuscitation measures until the family agrees",
    "ok": false,
    "why": "No: treatment the client refused should not be started to settle a family disagreement. The trap is treating the loudest voice as the decision-maker."
   },
   {
    "t": "Ask the daughter to sign a form requesting full treatment",
    "ok": false,
    "why": "No: the daughter is not the health care agent, and her signature cannot revoke the client's POLST. Only the client or her legal decision-maker can change it."
   }
  ],
  "why": "A POLST, or similar state form such as a MOLST, translates a seriously ill client's wishes into portable medical orders. The nurse follows the orders, notifies the provider, and involves the legal decision-maker and, if needed, an ethics consult. Supporting the grieving daughter is part of the nurse's role, but her wishes do not override the client's. Names and details of these forms vary by state.",
  "tip": "Advance directives and POLST orders reflect the client's wishes, so honor them unless the client or the legal decision-maker changes them."
 },
 {
  "id": "qb-mgmt-9",
  "type": "cloze",
  "step": "analyze",
  "cn": "mgmt",
  "sp": "ms",
  "topic": "Elements of negligence",
  "stem": "A new graduate nurse is caring for a 79-year-old with a high fall risk score and an order for a bed alarm at all times. After helping the client back from the bathroom at 02:00, the nurse does not turn the bed alarm back on. At 02:40 the client gets up alone, falls, and fractures her hip.",
  "q": "Complete the sentences.",
  "parts": [
   "The nurse established a duty to this client when the nurse ",
   {
    "opts": [
     "accepted the client assignment",
     "completed the incident report",
     "read the fall risk policy"
    ],
    "ans": 0,
    "whys": [
     "Yes: duty arises from the nurse-client relationship, which begins when the nurse accepts responsibility for the client's care.",
     "No: the incident report is written after the event and has nothing to do with when the duty of care began.",
     "No: knowing a policy defines the standard of care, but the duty to this client comes from the assignment."
    ]
   },
   ". Leaving the ordered bed alarm off is ",
   {
    "opts": [
     "a breach of the standard of care",
     "battery",
     "an intentional tort"
    ],
    "ans": 0,
    "whys": [
     "Yes: a reasonably prudent nurse would have followed the order to keep the alarm on, so failing to do so falls below the standard.",
     "No: battery is touching a client without consent. Nothing in this scenario involves unconsented contact.",
     "No: negligence is unintentional. The nurse forgot the alarm; there is no evidence of intent to cause harm."
    ]
   },
   ". The client's hip fracture supplies the element of ",
   {
    "opts": [
     "damages",
     "duty",
     "causation"
    ],
    "ans": 0,
    "whys": [
     "Yes: negligence requires actual harm. The fracture is the injury, and it must also be shown to have been caused by the breach.",
     "No: duty is the relationship established by the assignment, not the injury that followed.",
     "No: causation is the link showing the breach led to the injury. The fracture itself is the harm, which is the element of damages."
    ]
   },
   "."
  ],
  "why": "Negligence, called malpractice when a professional is involved, requires four elements: duty, breach of duty, causation, and damages. The nurse had a duty from the assignment, breached it by not following the bed alarm order, and the client was harmed. Accurate documentation and following fall precautions are the nurse's best protection.",
  "tip": "Remember the four elements of negligence in order: duty, breach, causation, damages."
 },
 {
  "id": "qb-mgmt-10",
  "type": "mc",
  "step": "eval",
  "cn": "mgmt",
  "sp": "psy",
  "topic": "Right to refuse medication",
  "stem": "A 34-year-old client was admitted involuntarily to an adult psychiatric unit 2 days ago. At 09:00 he is calm, eating breakfast, and says, \"I don't want that pill. It makes me feel like a zombie.\" He is not threatening anyone. A nurse in orientation is giving his scheduled oral antipsychotic while the preceptor observes.",
  "q": "Which action by the orienting nurse requires the preceptor to intervene?",
  "opts": [
   {
    "t": "Telling the client, \"You are here involuntarily, so you have to take your medication.\"",
    "ok": true,
    "why": "Yes: involuntary admission does not remove the right to refuse medication. Coercing a calm client is a rights violation; medicating over objection requires an emergency or a legal process."
   },
   {
    "t": "Asking the client what the medication makes him feel like",
    "ok": false,
    "why": "No: exploring the reason for refusal is appropriate. Side effects can often be managed, which may change the client's decision."
   },
   {
    "t": "Documenting the refusal and the client's reason, then notifying the provider",
    "ok": false,
    "why": "No: this is correct. The provider needs to know about the refusal and the side effect so the plan can be reviewed."
   },
   {
    "t": "Offering to bring the medication back later if the client changes his mind",
    "ok": false,
    "why": "No: this respects the client's choice and keeps the door open. It is an appropriate, nonthreatening response."
   }
  ],
  "why": "Clients admitted involuntarily keep most of their rights, including the right to refuse treatment. Medication may be given over objection only in an emergency where the client is an imminent danger, or after a legal process such as a court order; the exact process varies by state. Threatening a client to gain compliance can be considered coercion.",
  "tip": "Involuntary admission is not the same as incompetence; the client keeps the right to refuse unless an emergency or court order applies."
 },
 {
  "id": "qb-mgmt-11",
  "type": "sata",
  "step": "cues",
  "cn": "mgmt",
  "sp": "peds",
  "topic": "Confidentiality and social media",
  "stem": "A pediatric unit educator is reviewing confidentiality with nurses in their first year of practice. She describes several actions taken by nurses on the unit.",
  "q": "Which actions violate client confidentiality? Select all that apply.",
  "opts": [
   {
    "t": "Posting a photo of the unit's holiday decorations in which a child's name is visible on a door sign",
    "ok": true,
    "why": "Yes: a visible name on a pediatric unit identifies a client and discloses that the child is hospitalized. Removing the face is not enough if any identifier remains."
   },
   {
    "t": "Posting \"Rough night, lost a little one in room 12\" on a personal account with no name",
    "ok": true,
    "why": "Yes: the date, unit and room number can identify the child to family and community. The trap is believing that leaving out the name makes a post private."
   },
   {
    "t": "Opening the chart of a classmate's child admitted to another unit to see how she is doing",
    "ok": true,
    "why": "Yes: accessing a record without a care-related need is a privacy violation even if the nurse never shares it. Access is limited to what the nurse's role requires."
   },
   {
    "t": "Telling a coworker in the cafeteria the diagnosis of a well-known local child",
    "ok": true,
    "why": "Yes: discussing a client in a public area with someone not involved in care is a breach. Care discussions belong in private areas among the care team."
   },
   {
    "t": "Reviewing the care plan with the child's parents, who are the legal guardians",
    "ok": false,
    "why": "No: parents of a minor child generally have the right to the child's health information as the legal decision-makers."
   },
   {
    "t": "Giving bedside handoff to the oncoming nurse in a quiet voice",
    "ok": false,
    "why": "No: sharing information with the care team for treatment is permitted under HIPAA. Bedside handoff also lets the family take part."
   },
   {
    "t": "Sending records to the rehabilitation facility receiving the child on transfer",
    "ok": false,
    "why": "No: sharing information for treatment and continuity of care is allowed. The nurse sends only what the receiving team needs."
   }
  ],
  "why": "HIPAA permits sharing health information for treatment, payment and operations, but any other disclosure, or access without a care need, is a violation. On social media, any detail that could identify a client, such as a name, room, date or unique situation, makes a post a breach. Nurses can face discipline from the employer and the state board of nursing.",
  "tip": "Ask two questions: does this person need the information to care for the client, and could anyone identify the client from it."
 },
 {
  "id": "qb-mgmt-12",
  "type": "matrix",
  "step": "analyze",
  "cn": "mgmt",
  "sp": "icu",
  "topic": "Ethical principles",
  "stem": "During ethics rounds in the intensive care unit, the clinical nurse specialist describes several nursing actions and asks new nurses to name the ethical principle each one best demonstrates.",
  "q": "For each nursing action, indicate the ethical principle it best demonstrates.",
  "cols": [
   "Autonomy",
   "Beneficence",
   "Justice"
  ],
  "rows": [
   {
    "t": "Supports a client with capacity who decides to stop dialysis after a full discussion of the consequences",
    "ans": 0,
    "why": "autonomy is the right of a competent client to make decisions about their own care, even ones the team disagrees with."
   },
   {
    "t": "Confirms that a client understands he may refuse a bronchoscopy before he agrees to it",
    "ans": 0,
    "why": "making sure the client knows he can say no protects his right to self-determination."
   },
   {
    "t": "Calls the provider to get better pain control for a client grimacing after chest tube placement",
    "ans": 1,
    "why": "beneficence is acting to do good for the client; advocating for pain relief is a direct example."
   },
   {
    "t": "Stays with a frightened client and holds her hand during a painful dressing change",
    "ans": 1,
    "why": "comforting a frightened client during a painful procedure is an act of doing good and promoting well-being."
   },
   {
    "t": "Assigns the last ICU bed by acuity rather than by insurance status",
    "ans": 2,
    "why": "justice is the fair distribution of care and resources based on need, not on ability to pay."
   },
   {
    "t": "Gives an uninsured client the same post-op monitoring as every other client",
    "ans": 2,
    "why": "treating clients equally regardless of social or financial status reflects justice."
   }
  ],
  "why": "Autonomy is respect for the client's right to decide. Beneficence is acting in the client's best interest. Justice is fairness in how care and resources are distributed. Naming the principle helps nurses explain their reasoning when values conflict.",
  "tip": "Ask who the action serves: the client's choice (autonomy), the client's welfare (beneficence), or fairness between clients (justice)."
 },
 {
  "id": "qb-mgmt-13",
  "type": "highlight",
  "step": "cues",
  "cn": "mgmt",
  "sp": "sd",
  "topic": "Documenting a fall",
  "stem": "A charge nurse reviews this progress note written by a new graduate nurse on a telemetry unit after a client fell.",
  "q": "Highlight the statements in the note that are inappropriate and should be corrected by the nurse.",
  "parts": [
   {
    "t": "03:10 Client found sitting on floor beside bed.",
    "ok": false,
    "why": "No: this is an objective description of exactly what the nurse saw, with the time. It is appropriate."
   },
   {
    "t": "Client fell because the UAP left the bed rails down.",
    "ok": true,
    "why": "Yes: the nurse did not witness the fall, so this is an assumption that also blames a coworker. Notes should record facts, not opinions or blame."
   },
   {
    "t": "Alert and oriented x4; states \"I tried to get to the bathroom by myself.\"",
    "ok": false,
    "why": "No: the client's own words in quotation marks and an objective mental status are good documentation."
   },
   {
    "t": "2 cm abrasion on right elbow; no other injuries noted.",
    "ok": false,
    "why": "No: this is a specific, measurable assessment finding. It is appropriate."
   },
   {
    "t": "BP 132/78, HR 88, telemetry sinus rhythm.",
    "ok": false,
    "why": "No: post-fall vital signs and rhythm are expected objective data. They belong in the note."
   },
   {
    "t": "Dr. Lee notified at 03:20; no new orders.",
    "ok": false,
    "why": "No: naming who was notified, when, and the response is complete documentation of communication."
   },
   {
    "t": "Incident report completed and placed in chart.",
    "ok": true,
    "why": "Yes: an incident report is an internal quality document and is never filed in or mentioned in the medical record. Referring to it can make it discoverable in a lawsuit; protection rules vary by state and facility policy."
   },
   {
    "t": "Seems fine now, will keep an eye on him.",
    "ok": true,
    "why": "Yes: this is vague and subjective. The note should state the specific reassessment plan, such as neurological checks at set intervals."
   }
  ],
  "why": "Legal documentation is factual, objective, timely and specific. The nurse records what was seen, heard and done, including the client's own words and who was notified. Assumptions, blame, vague wording and any mention of the incident report do not belong in the medical record.",
  "tip": "Read each statement and ask whether the nurse directly observed or did it; opinions, blame and references to incident reports should be flagged."
 },
 {
  "id": "qb-mgmt-14",
  "type": "sata",
  "step": "eval",
  "cn": "mgmt",
  "sp": "ms",
  "topic": "Medication error reporting",
  "stem": "A nurse in her third month of practice realizes at 10:15 that she gave a client metoprolol tartrate 50 mg by mouth at 09:00 instead of the ordered 25 mg. She tells her preceptor what she plans to do next.",
  "q": "Which statements by the nurse indicate an appropriate plan? Select all that apply.",
  "opts": [
   {
    "t": "\"I'll check his heart rate and blood pressure now and notify the provider.\"",
    "ok": true,
    "why": "Yes: client safety comes first. A double dose of a beta blocker can cause bradycardia and hypotension, so the nurse assesses and tells the provider."
   },
   {
    "t": "\"I'll fill out a safety report describing the facts of what happened.\"",
    "ok": true,
    "why": "Yes: an incident or safety report is required for medication errors so the organization can find and fix system causes."
   },
   {
    "t": "\"I'll chart the dose I actually gave and his response, without mentioning the safety report.\"",
    "ok": true,
    "why": "Yes: the medical record must accurately show what was given and how the client responded. The report itself is not referenced in the chart."
   },
   {
    "t": "\"The report helps find what made the error possible; it is not a punishment.\"",
    "ok": true,
    "why": "Yes: in a just culture, reporting supports learning and system fixes. Understanding this encourages reporting of errors and near misses."
   },
   {
    "t": "\"I'll write 'incident report filed' in my note so the next shift knows.\"",
    "ok": false,
    "why": "No: mentioning the incident report in the medical record is inappropriate. The facts of the event and the client's response are what get charted."
   },
   {
    "t": "\"His vital signs are fine, so I don't need to tell anyone.\"",
    "ok": false,
    "why": "No: all medication errors are reported, even without harm. Effects of a beta blocker can appear later, and hiding an error is unethical."
   },
   {
    "t": "\"The safety report goes in his medical record.\"",
    "ok": false,
    "why": "No: incident reports are internal quality documents kept separate from the medical record."
   }
  ],
  "why": "After a medication error, the nurse first assesses the client and notifies the provider, then documents the facts in the record and completes an incident report. The report is kept out of the chart and is never referenced there. Reporting supports a just culture focused on fixing systems rather than blaming individuals.",
  "tip": "Order your thinking: protect the client, tell the provider, document the facts, and report the event outside the chart."
 },
 {
  "id": "qb-mgmt-15",
  "type": "mc",
  "step": "solve",
  "cn": "mgmt",
  "sp": "psy",
  "topic": "Conflict resolution",
  "stem": "A nurse in her first year of practice is acting as relief charge nurse on an adult psychiatric unit. Two experienced nurses begin arguing loudly at the nursing station about who should take a new admission. Several clients in the day room are watching.",
  "q": "What is the charge nurse's best action?",
  "opts": [
   {
    "t": "Ask both nurses to step into the office and have each explain their concerns before working out the assignment together",
    "ok": true,
    "why": "Yes: moving the discussion out of client view protects the milieu, and hearing both sides supports a collaborative solution both nurses can accept."
   },
   {
    "t": "Tell them to settle it between themselves and walk away",
    "ok": false,
    "why": "No: avoidance leaves the conflict unresolved in front of clients and the new admission without a nurse. The charge nurse has authority to act."
   },
   {
    "t": "Assign the admission to the nurse who spoke first without discussion",
    "ok": false,
    "why": "No: deciding without hearing the concerns may ignore a real workload problem and breed resentment. It also leaves the argument unaddressed."
   },
   {
    "t": "Call the nurse manager at home to report both nurses",
    "ok": false,
    "why": "No: escalation is premature for a conflict the charge nurse can address now. Going up the chain of command comes after a first attempt to resolve it."
   }
  ],
  "why": "Conflict in front of clients is especially harmful on a psychiatric unit, where a calm milieu is part of treatment. The charge nurse should first move the conversation to a private place, then use collaboration: hear each person, identify the real issue, and agree on a solution. Escalation is used if the conflict cannot be resolved at the unit level.",
  "tip": "For conflict questions, choose the option that addresses the problem privately and directly with the people involved before escalating."
 },
 {
  "id": "qb-mgmt-16",
  "type": "bowtie",
  "step": "hypo",
  "cn": "mgmt",
  "sp": "peds",
  "topic": "Suspected child abuse",
  "stem": "A 2-month-old is brought to the pediatric emergency area by a parent, who says the infant's leg got caught in the crib slats 2 days ago. X-ray shows a spiral fracture of the femur. The nurse notes bruises of different colors on the chest and back. Sclerae are white. Coagulation studies are normal. The parent becomes irritable when asked for details and gives a different story to the provider.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters the nurse should monitor.",
  "cond": {
   "opts": [
    "Suspected physical abuse",
    "Accidental crib injury",
    "Osteogenesis imperfecta",
    "Bleeding disorder"
   ],
   "ans": 0
  },
  "actions": {
   "opts": [
    "Report the suspected abuse to child protective services as required by law, and notify the provider",
    "Document the injuries objectively and record the parent's explanations in their exact words",
    "Confront the parent and ask directly whether they hurt the infant",
    "Wait to report until the investigation proves abuse occurred",
    "Discharge the infant home with an orthopedic follow-up appointment"
   ],
   "ans": [
    0,
    1
   ]
  },
  "params": {
   "opts": [
    "Interaction between the infant and the caregivers during visits",
    "Pain and neurovascular status of the injured leg",
    "Serum calcium level",
    "Number of wet diapers per week at home",
    "Height compared with siblings"
   ],
   "ans": [
    0,
    1
   ]
  },
  "whys": {
   "cond": [
    "Yes: a spiral femur fracture in a nonmobile infant, bruises of different ages, a delay in care and a changing story are classic warning signs of abuse.",
    "No: a 2-month-old cannot move enough to twist a femur in crib slats. The mechanism does not match the infant's development.",
    "No: this bone disorder often causes blue sclerae and many fractures; white sclerae and a story that keeps changing point to abuse instead.",
    "No: normal coagulation studies make a bleeding disorder unlikely as the cause of the bruising."
   ],
   "actions": [
    "Yes: nurses are mandated reporters; reasonable suspicion is enough to report, and good-faith reports are legally protected.",
    "Yes: objective descriptions of injuries and caregivers' exact words are key evidence and support the investigation.",
    "No: confronting the parent can escalate the situation and endanger the infant. Investigation is the role of child protective services and law enforcement.",
    "No: the law requires reporting on suspicion, not proof. Waiting can leave the infant in danger.",
    "No: discharging the infant to a possibly unsafe home before a protective assessment could lead to further injury."
   ],
   "params": [
    "Yes: how caregivers respond to the infant and how the infant responds to them gives information the protective team needs.",
    "Yes: the fracture needs ongoing pain control and checks of circulation, sensation and movement in the leg.",
    "No: calcium does not explain this injury pattern and is not a key ongoing parameter here.",
    "No: home diaper counts cannot be monitored while the infant is in the hospital and do not address safety.",
    "No: comparing height with siblings does not help assess abuse or the current injury."
   ]
  },
  "why": "Injuries that do not match the history or the child's developmental stage, bruises of different ages and a delay in seeking care are red flags for abuse. Nurses must report reasonable suspicion to child protective services; they do not need proof, and good-faith reporters are protected from liability. The nurse documents objectively and keeps the infant safe while treating the injury.",
  "tip": "Check whether the injury fits the child's age and the story; when it does not, report the suspicion rather than investigating it yourself."
 },
 {
  "id": "qb-mgmt-17",
  "type": "mc",
  "step": "act",
  "cn": "mgmt",
  "sp": "icu",
  "topic": "Impaired colleague",
  "stem": "At 19:00 shift change, a new graduate nurse in the ICU notices that a coworker arriving for the night shift smells of alcohol, has slurred speech, and stumbles against the medication cart. The coworker is about to take report on two critically ill clients.",
  "q": "What is the nurse's best action?",
  "opts": [
   {
    "t": "Report the observations immediately to the charge nurse so the coworker can be removed from client care",
    "ok": true,
    "why": "Yes: the priority is protecting clients from an impaired nurse. The charge nurse or supervisor can remove the coworker and start the facility's fitness-for-duty process."
   },
   {
    "t": "Talk privately with the coworker after the shift about getting help",
    "ok": false,
    "why": "No: waiting until after the shift lets an impaired nurse care for critically ill clients for 12 hours. Client safety cannot wait."
   },
   {
    "t": "Confront the coworker at the nursing station in front of the team",
    "ok": false,
    "why": "No: public confrontation is unprofessional, may escalate, and does not reliably remove the coworker from care. Use the chain of command."
   },
   {
    "t": "Call the state board of nursing before telling anyone on the unit",
    "ok": false,
    "why": "No: the board may need to be notified later depending on state law, but the immediate danger is handled through the supervisor now."
   }
  ],
  "why": "A nurse who suspects a colleague is impaired must act to protect clients by reporting through the chain of command right away. The facility then handles fitness-for-duty testing and referral. Many states offer peer assistance or alternative-to-discipline programs, and reporting requirements to the board vary by state.",
  "tip": "When a coworker's impairment puts clients at risk, choose the option that removes them from client care now through the supervisor."
 },
 {
  "id": "qb-mgmt-18",
  "type": "order",
  "step": "act",
  "cn": "mgmt",
  "sp": "sd",
  "topic": "SBAR to the provider",
  "stem": "At 02:00 a 76-year-old client admitted yesterday with heart failure exacerbation is short of breath. RR 28, SpO₂ 88% on 2 L, crackles halfway up both lungs. He received furosemide 40 mg IV at 18:00, and urine output since then is 60 mL. The nurse is going to call the provider.",
  "q": "Place the nurse's actions in the order they should occur.",
  "opts": [
   "Gather the chart, current vital signs, recent labs, intake and output and active orders before calling",
   "State her name, unit, the client's name, and that he is short of breath with an SpO₂ of 88% on 2 L",
   "Explain that he is 76, was admitted with heart failure, and received furosemide 40 mg IV at 18:00",
   "Report crackles halfway up both lungs, RR 28 and only 60 mL of urine, and say she is concerned about worsening fluid overload",
   "Recommend that the provider see the client now and ask for another diuretic dose and a chest x-ray",
   "Read back any new orders and confirm them with the provider"
  ],
  "whys": [
   "Yes: having the data in hand before calling makes the call efficient and lets the nurse answer the provider's questions.",
   "Yes: Situation comes first: who is calling, about whom, and the immediate problem, so the provider knows the urgency right away.",
   "Yes: Background gives the context the provider needs, including the diagnosis and the treatment already given.",
   "Yes: Assessment shares the current findings and the nurse's interpretation of the problem, which a new graduate should state clearly.",
   "Yes: Recommendation tells the provider what the nurse thinks is needed, so the call ends with a plan.",
   "Yes: reading back telephone or verbal orders is a Joint Commission safety practice that prevents communication errors."
  ],
  "why": "SBAR (Situation, Background, Assessment, Recommendation) is a structured format that makes urgent communication clear and complete. Preparation comes before the call, and a read-back of any orders closes it. New graduates often leave out the assessment and recommendation, which are the parts that drive the provider's decision.",
  "tip": "Prepare first, then follow S, B, A, R, and finish with a read-back of new orders."
 },
 {
  "id": "qb-mgmt-19",
  "type": "cloze",
  "step": "eval",
  "cn": "mgmt",
  "sp": "periop",
  "topic": "I-PASS handoff",
  "stem": "A new graduate nurse in the PACU gives handoff by phone to the surgical unit nurse: \"Mrs. K is a watcher. She's 70, 2 hours after a right hip replacement under spinal anesthesia, on PCA morphine, pain 3/10. To do: hemoglobin at 18:00 and first ambulation tonight. If her systolic drops below 90 or the dressing saturates, call the surgeon.\" The receiving nurse says, \"Okay, thanks,\" and hangs up. The preceptor reviews the handoff with the new nurse.",
  "q": "Complete the sentences.",
  "parts": [
   "The handoff correctly included illness severity, a patient summary, an action list, and ",
   {
    "opts": [
     "situation awareness and contingency planning",
     "a full review of systems",
     "the client's insurance information"
    ],
    "ans": 0,
    "whys": [
     "Yes: telling the receiver what to watch for and what to do if it happens, such as a systolic below 90, is situation awareness and contingency planning.",
     "No: I-PASS is meant to be concise and focused on what the receiver needs, not a complete head-to-toe recitation.",
     "No: insurance information is not part of a clinical handoff and does not affect immediate safety."
    ]
   },
   ". The handoff was incomplete because it lacked ",
   {
    "opts": [
     "synthesis by the receiver",
     "the client's room number",
     "a list of home medications"
    ],
    "ans": 0,
    "whys": [
     "Yes: the final I-PASS step is the receiver summarizing key points and asking questions. Saying \"okay, thanks\" does not confirm understanding.",
     "No: the room number may help logistics, but its absence is not the key gap in this handoff.",
     "No: home medications are in the record and are not a required I-PASS element for this transfer."
    ]
   },
   ". The best way to close the handoff is for the receiving nurse to ",
   {
    "opts": [
     "restate the key points and action items and ask any questions",
     "read the PACU record later when time allows",
     "sign the transfer form without comment"
    ],
    "ans": 0,
    "whys": [
     "Yes: a read-back of key points and to-do items closes the loop and catches misunderstandings before responsibility transfers.",
     "No: reading the record later leaves a window when the receiver may miss the 18:00 hemoglobin or the call parameters.",
     "No: signing a form does not verify that the information was understood."
    ]
   },
   "."
  ],
  "why": "I-PASS stands for Illness severity, Patient summary, Action list, Situation awareness and contingency planning, and Synthesis by receiver. Handoffs are a leading point of communication failure, and the synthesis step closes the loop. The sending nurse should invite and expect a read-back before ending the call.",
  "tip": "A handoff is not complete until the receiver has repeated back the key information and had a chance to ask questions."
 },
 {
  "id": "qb-mgmt-20",
  "type": "sata",
  "step": "solve",
  "cn": "mgmt",
  "sp": "comm",
  "topic": "Referrals and case management",
  "stem": "A home health nurse visits an 82-year-old client with heart failure who lives alone. He uses a new walker and has throw rugs in every room. He says, \"I take my water pill every other day so it lasts until my check comes,\" and \"I mostly eat crackers and canned soup since I can't stand at the stove very long.\" He wants to stay in his home.",
  "q": "Which referrals should the nurse request? Select all that apply.",
  "opts": [
   {
    "t": "Social worker or case manager to explore medication cost assistance",
    "ok": true,
    "why": "Yes: skipping diuretic doses because of cost risks readmission for fluid overload. A social worker can connect him with assistance programs and benefits."
   },
   {
    "t": "Pharmacist review for lower-cost alternatives and a full medication list",
    "ok": true,
    "why": "Yes: a pharmacist can identify cheaper equivalents and reconcile medications, which supports adherence on a fixed income."
   },
   {
    "t": "Physical or occupational therapy for a home safety evaluation",
    "ok": true,
    "why": "Yes: throw rugs and a new walker are a high fall risk. Therapy can assess the home, train him with the walker and suggest changes."
   },
   {
    "t": "Home-delivered meals program",
    "ok": true,
    "why": "Yes: he cannot cook safely, and canned soup is very high in sodium, which worsens heart failure. Delivered meals improve nutrition and can be low in sodium."
   },
   {
    "t": "Hospice for end-of-life care",
    "ok": false,
    "why": "No: nothing suggests he has a terminal prognosis or wants comfort-focused care. His problems are practical and can be addressed."
   },
   {
    "t": "Nursing home placement arranged by the nurse today",
    "ok": false,
    "why": "No: he has decision-making capacity and wants to stay home. Arranging placement against his wishes violates his autonomy when supports have not been tried."
   },
   {
    "t": "Inpatient psychiatric evaluation",
    "ok": false,
    "why": "No: nothing in the stem suggests a psychiatric emergency. His choices reflect cost and physical limits, not mental illness."
   }
  ],
  "why": "Case management connects the client with the services that address the root causes of poor outcomes. This client's risks are medication cost, falls and high-sodium nutrition, each of which has a matching referral. Respecting his wish to stay at home guides the plan.",
  "tip": "Match each specific problem in the stem to the discipline or service that fixes it, and avoid options that override the client's wishes."
 },
 {
  "id": "qb-mgmt-21",
  "type": "mc",
  "step": "eval",
  "cn": "mgmt",
  "sp": "ms",
  "topic": "Performance improvement",
  "stem": "A medical-surgical unit had a fall rate of 4.1 falls per 1,000 patient days last year. The unit practice council started a plan-do-study-act cycle that added hourly rounding focused on pain, toileting and position. The council is reviewing data 3 months later.",
  "q": "Which finding best shows that the change was effective?",
  "opts": [
   {
    "t": "The fall rate decreased to 2.3 per 1,000 patient days, and audits show rounding was done 92% of the time",
    "ok": true,
    "why": "Yes: an outcome measure improved while a process measure shows the intervention was actually carried out, linking the change to the result."
   },
   {
    "t": "Staff say in a survey that they like hourly rounding",
    "ok": false,
    "why": "No: staff satisfaction does not show that clients fell less. The trap is confusing acceptance of a change with its effect on outcomes."
   },
   {
    "t": "The number of fall incident reports increased",
    "ok": false,
    "why": "No: more reports could mean more falls or better reporting, so this alone cannot show improvement."
   },
   {
    "t": "The unit bought 10 more bed alarms",
    "ok": false,
    "why": "No: buying equipment is an input, not an outcome, and bed alarms were not the intervention being tested."
   }
  ],
  "why": "Performance improvement measures whether a change led to a better outcome. The strongest evidence pairs an outcome measure, such as the fall rate per 1,000 patient days, with a process measure showing the intervention was done. In a PDSA cycle, this study step decides whether to adopt, adapt or abandon the change.",
  "tip": "For evaluation questions in quality improvement, pick the option with a measurable client outcome compared with the baseline."
 },
 {
  "id": "qb-mgmt-22",
  "type": "matrix",
  "step": "hypo",
  "cn": "mgmt",
  "sp": "ed",
  "topic": "Mass casualty triage",
  "stem": "A bus crash brings many injured people to the scene outside a rural emergency department. The nurse is helping triage with the START system: anyone who can walk is tagged minor; then respirations, perfusion and mental status are checked.",
  "q": "For each person, indicate the triage category the nurse should assign.",
  "cols": [
   "Immediate (red)",
   "Delayed (yellow)",
   "Minor (green)"
  ],
  "rows": [
   {
    "t": "Walking, with a forearm laceration and controlled bleeding",
    "ans": 2,
    "why": "anyone who can walk to the collection point is tagged minor at first and reassessed later."
   },
   {
    "t": "Cannot walk, RR 34, follows commands",
    "ans": 0,
    "why": "a respiratory rate over 30 meets START criteria for immediate care because it signals respiratory compromise."
   },
   {
    "t": "Cannot walk, RR 20, radial pulse absent, capillary refill 4 seconds",
    "ans": 0,
    "why": "no radial pulse or capillary refill over 2 seconds shows poor perfusion and possible shock, which is immediate."
   },
   {
    "t": "Cannot walk, RR 24, radial pulse present, does not follow simple commands",
    "ans": 0,
    "why": "not following simple commands suggests a head injury or shock, so this person is tagged immediate."
   },
   {
    "t": "Open lower leg fracture, cannot walk, RR 22, radial pulse present, follows commands",
    "ans": 1,
    "why": "breathing, perfusion and mental status are adequate, so this serious but stable injury can wait. The trap is tagging the most dramatic injury red."
   },
   {
    "t": "Walking, crying and anxious, with a swollen wrist",
    "ans": 2,
    "why": "emotional distress and a likely wrist fracture in a walking person are minor; this person can help others or wait."
   }
  ],
  "why": "In a mass casualty event the goal shifts to doing the greatest good for the greatest number. START sorts people quickly by ability to walk, then breathing rate, perfusion and ability to follow commands. Dramatic injuries with stable vital functions are delayed, while subtle signs of compromise are immediate.",
  "tip": "In disaster triage, use the criteria (RPM: respirations, perfusion, mental status), not how bad the injury looks."
 },
 {
  "id": "qb-mgmt-23",
  "type": "order",
  "step": "act",
  "cn": "mgmt",
  "sp": "peds",
  "topic": "Chain of command",
  "stem": "A nurse on a pediatric unit receives a new order for acetaminophen 800 mg by mouth every 6 hours for an 8 kg infant. The usual dose is 10 to 15 mg/kg. The nurse calls the prescriber, who says, \"Just give it, it's fine,\" and hangs up.",
  "q": "Place the nurse's actions in the order they should occur, from the time she first reads the order.",
  "opts": [
   "Hold the dose and check the order against a pediatric drug reference",
   "Call the prescriber, state the weight-based safe range, and ask for clarification",
   "Notify the charge nurse that the prescriber will not change an unsafe order",
   "Escalate through the nursing supervisor to the prescriber's supervising physician per facility policy",
   "Document the communication factually and complete a safety report"
  ],
  "whys": [
   "Yes: the safe dose for 8 kg is 80 to 120 mg, so 800 mg is a tenfold error. The nurse never gives a dose she believes is unsafe.",
   "Yes: the prescriber is the first person to contact, and giving the specific safe range helps the prescriber see the error.",
   "Yes: when the prescriber does not resolve the concern, the next step in the chain of command is the charge nurse.",
   "Yes: if the issue is still unresolved, it moves up the chain through nursing administration to medical leadership.",
   "Yes: factual documentation of who was contacted and when, plus a safety report, supports follow-up and system learning."
  ],
  "why": "Nurses are legally accountable for every medication they give, even with an order. When an order is unsafe, the nurse holds it, clarifies with the prescriber, and if needed goes up the chain of command until it is resolved. A pharmacist can also be involved, but the nurse must not give the dose while the concern stands.",
  "tip": "Never give a dose you believe is unsafe; clarify with the prescriber first, then move up the chain of command one level at a time."
 },
 {
  "id": "qb-mgmt-24",
  "type": "sata",
  "step": "solve",
  "cn": "mgmt",
  "sp": "icu",
  "topic": "Unsafe float assignment",
  "stem": "A nurse with 4 months of experience on a medical-surgical unit is floated to the ICU. The charge nurse assigns her two clients on ventilators who are receiving vasopressor infusions. She has had no ICU orientation and has never titrated a vasopressor.",
  "q": "Which actions are appropriate for the nurse? Select all that apply.",
  "opts": [
   {
    "t": "Tell the charge nurse right away that she is not competent to care for these clients",
    "ok": true,
    "why": "Yes: nurses must accept only assignments they are competent to perform. Speaking up before taking report gives the charge nurse time to adjust."
   },
   {
    "t": "Suggest an alternative, such as taking the most stable clients or working as a helper to an ICU nurse",
    "ok": true,
    "why": "Yes: offering what she can safely do helps solve the staffing problem while keeping clients safe."
   },
   {
    "t": "If the assignment stands, complete an assignment despite objection form per facility policy",
    "ok": true,
    "why": "Yes: this form notifies management of the safety concern in writing. Policies and the name of the form vary by facility and state."
   },
   {
    "t": "Ask an ICU nurse for help before performing any unfamiliar skill",
    "ok": true,
    "why": "Yes: asking for help with unfamiliar skills is safe practice, especially for a new graduate in an unfamiliar setting."
   },
   {
    "t": "Titrate the vasopressors after quickly reading the drip protocol online",
    "ok": false,
    "why": "No: reading a protocol does not create competence with a high-alert infusion. Practicing beyond her competence puts clients at risk and the nurse at legal risk."
   },
   {
    "t": "Leave the hospital after receiving report because the assignment is unsafe",
    "ok": false,
    "why": "No: once a nurse accepts report, leaving without handing off care can be client abandonment. The concern is handled through the chain of command."
   },
   {
    "t": "Write her objection to the assignment in each client's medical record",
    "ok": false,
    "why": "No: staffing disputes do not belong in the client's chart. The objection goes on the facility form to management."
   }
  ],
  "why": "A nurse may object to an assignment beyond her competence and should do so before accepting report, proposing safe alternatives. If the assignment stands, she documents the objection on the facility's form, practices only within her competence, and asks for help. Walking away after accepting report risks abandonment, and objections are not charted in the medical record.",
  "tip": "For unsafe assignments, the pattern is: speak up early, offer alternatives, document on the facility form, and never abandon clients."
 },
 {
  "id": "qb-mgmt-25",
  "type": "mc",
  "step": "act",
  "cn": "mgmt",
  "sp": "ms",
  "topic": "Barcode scanning alerts",
  "stem": "A nurse scans a client's wristband and then a vial of hydromorphone 2 mg for a scheduled pain dose. The barcode system displays: \"Medication does not match an active order.\" A coworker says, \"Just override it. The scanner glitches all the time.\"",
  "q": "What is the nurse's best action?",
  "opts": [
   {
    "t": "Hold the dose and compare the vial with the active order, then clarify with pharmacy or the prescriber",
    "ok": true,
    "why": "Yes: the alert may be catching a wrong drug, wrong dose or discontinued order. The nurse investigates the cause before giving a high-alert opioid."
   },
   {
    "t": "Override the alert because the client is in pain and the dose is due",
    "ok": false,
    "why": "No: overriding without finding the cause defeats the safety system. Overrides are a known source of serious medication errors with high-alert drugs."
   },
   {
    "t": "Ask the coworker to scan the vial on a different device",
    "ok": false,
    "why": "No: rescanning on another device is a workaround that ignores what the alert means and may not catch a true mismatch."
   },
   {
    "t": "Give the dose and document the scanner problem in the client's chart",
    "ok": false,
    "why": "No: giving the dose first exposes the client to the error the alert may be warning about. Equipment problems are reported to IT, not charted."
   }
  ],
  "why": "Barcode medication administration alerts are designed to stop errors at the bedside. When an alert fires, the nurse stops and finds the reason, such as a changed order, a different concentration or the wrong drug, before giving anything. New nurses often learn workarounds from coworkers; the safe choice is to resolve the alert and report true system problems.",
  "tip": "Treat every barcode alert as a real error until you prove otherwise; options that override or bypass the system are traps."
 },
 {
  "id": "qb-mgmt-26",
  "type": "matrix",
  "step": "solve",
  "cn": "mgmt",
  "sp": "ed",
  "topic": "EHR downtime",
  "stem": "At 14:00 the electronic health record goes down without warning in a busy emergency department. The charge nurse announces that downtime procedures are in effect.",
  "q": "For each action, indicate whether it is appropriate or not appropriate during the downtime.",
  "cols": [
   "Appropriate",
   "Not appropriate"
  ],
  "rows": [
   {
    "t": "Use the paper downtime forms and the most recent downtime medication report to give scheduled medications",
    "ans": 0,
    "why": "downtime reports and paper forms keep a reliable record of what is due and what was given."
   },
   {
    "t": "Give medications based on what the nurse remembers was due",
    "ans": 1,
    "why": "memory is unreliable and risks missed or double doses. The nurse uses the printed downtime medication record."
   },
   {
    "t": "Write telephone orders on the paper order form and read them back to the prescriber",
    "ans": 0,
    "why": "orders still need to be written and verified with a read-back; only the method of recording changes."
   },
   {
    "t": "Text photos of client information to the provider from a personal phone",
    "ans": 1,
    "why": "personal phones and texting are not secure and can breach client confidentiality. Use approved communication methods."
   },
   {
    "t": "Hold all lab draws until the system is back up",
    "ans": 1,
    "why": "care cannot stop during downtime. Paper requisitions and downtime labels allow labs to continue."
   },
   {
    "t": "Enter the paper documentation into the EHR after it is restored, per facility policy",
    "ans": 0,
    "why": "back-entering paper records keeps the electronic record complete and accurate, with the actual times of care."
   }
  ],
  "why": "During EHR downtime, care continues using the facility's paper forms and printed downtime reports. Usual safety practices, such as read-back of orders and protecting confidentiality, still apply. When the system returns, staff enter the paper documentation according to policy.",
  "tip": "During downtime, keep every safety practice the same and change only the tool used to record care."
 },
 {
  "id": "qb-safe-1",
  "type": "mc",
  "step": "eval",
  "cn": "safety",
  "sp": "ms",
  "topic": "C. difficile precautions",
  "stem": "A 74-year-old on the medical unit has had six loose, foul-smelling stools since 06:00. A stool test is positive for Clostridioides difficile, and the client is on contact precautions. The nurse observes a UAP caring for the client.",
  "q": "Which action by the UAP requires the nurse to intervene?",
  "opts": [
   {
    "t": "Cleans her hands with alcohol-based hand rub after removing her gloves and leaving the room",
    "ok": true,
    "why": "Yes: alcohol does not kill C. difficile spores. Hands must be washed with soap and running water so friction physically removes the spores."
   },
   {
    "t": "Puts on a gown and gloves before entering the room",
    "ok": false,
    "why": "No: gown and gloves on entry are required for contact precautions because spores contaminate the client, linens and surfaces."
   },
   {
    "t": "Uses the stethoscope and blood pressure cuff kept in the client's room",
    "ok": false,
    "why": "No: dedicated equipment stays in the room so spores are not carried to other clients. This is correct practice."
   },
   {
    "t": "Wipes the bedside table with the bleach-based disinfectant wipes from the isolation cart",
    "ok": false,
    "why": "No: a sporicidal agent such as a bleach-based product is needed to kill C. difficile spores on surfaces. This is correct."
   }
  ],
  "why": "C. difficile forms spores that survive on surfaces and resist alcohol. Contact precautions, dedicated equipment and sporicidal cleaning are all correct. Hand hygiene must be soap and water, because alcohol rub does not remove or kill spores.",
  "tip": "When a question asks what requires intervention, look for the one action that is unsafe for this specific organism, not for infection control in general."
 },
 {
  "id": "qb-safe-2",
  "type": "order",
  "step": "act",
  "cn": "safety",
  "sp": "icu",
  "topic": "PPE doffing sequence",
  "stem": "A nurse in the ICU is finishing care for a 61-year-old with influenza and a MRSA-infected wound. The client is on droplet and contact precautions. The nurse is wearing gloves, a gown, a surgical mask and goggles.",
  "q": "Place the steps for removing PPE in the correct order, following the CDC sequence.",
  "opts": [
   "Remove the gloves",
   "Remove the goggles by handling the ear pieces or headband",
   "Unfasten the gown and pull it away from the body, rolling it inside out",
   "Remove the mask by the ties or ear loops without touching the front",
   "Perform hand hygiene"
  ],
  "whys": [
   "Yes: gloves are the most contaminated item, so they come off first to keep dirty hands from touching the face or clean areas.",
   "Yes: the outside of the goggles is contaminated, so they are removed next by the parts that sat behind the head and ears.",
   "Yes: the front and sleeves of the gown are contaminated; rolling it inside out contains the organisms as it comes off.",
   "Yes: the mask comes off last because it protects the nose and mouth until all other contaminated items are removed.",
   "Yes: hands may have been contaminated during removal, so hand hygiene immediately after removing all PPE completes the process."
  ],
  "why": "The CDC removal sequence goes from most contaminated to least: gloves, goggles or face shield, gown, then mask or respirator, followed by hand hygiene. The face protection stays on until the end so the nurse's mucous membranes are protected. If a respirator is worn, it is removed after leaving the room and closing the door.",
  "tip": "For doffing, think dirtiest first and face last; for donning, think the reverse, with gloves going on last."
 },
 {
  "id": "qb-safe-3",
  "type": "order",
  "step": "act",
  "cn": "safety",
  "sp": "psy",
  "topic": "Fire response RACE",
  "stem": "On the adult psych unit at 21:30, a nurse smells smoke and finds a small fire burning in a wastebasket in a client's room. The 34-year-old client is standing next to the wastebasket holding a lighter he hid after a family visit.",
  "q": "Place the nurse's actions in the correct order.",
  "opts": [
   "Move the client out of the room and away from the fire",
   "Activate the fire alarm and call the facility emergency number",
   "Close the door to the room",
   "Extinguish the fire with an extinguisher if it is small and safe to do so, using the PASS technique"
  ],
  "whys": [
   "Yes: R is rescue. The first priority is removing anyone in immediate danger, and this client is standing beside the fire.",
   "Yes: A is alarm. Pulling the alarm brings help and alerts the rest of the unit so others can protect clients.",
   "Yes: C is contain. Closing the door limits smoke and oxygen and slows the spread of fire to the hallway.",
   "Yes: E is extinguish or evacuate. Use PASS: pull the pin, aim at the base, squeeze the handle and sweep side to side."
  ],
  "why": "The RACE sequence guides fire response: rescue, alarm, contain, then extinguish or evacuate. Clients come before property, so rescue is first. A small fire may be extinguished only after help is called and the area is contained; otherwise the unit evacuates, starting with clients closest to the fire.",
  "tip": "Learn RACE and PASS as fixed sequences; in fire questions, client safety always comes before fighting the fire."
 },
 {
  "id": "qb-safe-4",
  "type": "mc",
  "step": "solve",
  "cn": "safety",
  "sp": "ed",
  "topic": "Airborne precautions for TB",
  "stem": "A 46-year-old comes to the emergency department with a productive cough for 4 weeks, night sweats, a 6 kg (13 lb) weight loss and blood-streaked sputum. He has been staying in a shelter. T 38.1 °C (100.6 °F), HR 98, RR 20, SpO₂ 95% on room air.",
  "q": "Which isolation plan is most appropriate for this client?",
  "opts": [
   {
    "t": "Place a surgical mask on the client, move him to an airborne infection isolation room, and have staff wear fit-tested N95 respirators",
    "ok": true,
    "why": "Yes: suspected pulmonary TB requires a negative-pressure room and N95 respirators for staff. A surgical mask on the client contains droplet nuclei until he is in the room."
   },
   {
    "t": "Place the client in a private room with the door open and have staff wear surgical masks",
    "ok": false,
    "why": "No: this is droplet precautions. TB spreads by tiny airborne particles that stay suspended, so staff need N95 respirators and negative-pressure air handling."
   },
   {
    "t": "Keep the client in the waiting room with a surgical mask until his sputum results return",
    "ok": false,
    "why": "No: waiting for results exposes everyone in the waiting room. Isolation starts on suspicion, not confirmation."
   },
   {
    "t": "Place the client on contact precautions and have staff wear a gown and gloves",
    "ok": false,
    "why": "No: TB is not spread by touch. The trap is choosing the most common isolation type instead of matching the route of transmission."
   }
  ],
  "why": "Cough lasting weeks with night sweats, weight loss and hemoptysis in a client from a congregate setting suggests pulmonary TB. Airborne precautions require an airborne infection isolation room with negative pressure, the door closed, and fit-tested N95 respirators for staff. The client wears a surgical mask whenever he is outside that room.",
  "tip": "Match the precaution to the route: measles, varicella and TB are the classic airborne diseases that need a negative-pressure room and an N95."
 },
 {
  "id": "qb-safe-5",
  "type": "sata",
  "step": "solve",
  "cn": "safety",
  "sp": "peds",
  "topic": "Droplet precautions",
  "stem": "A 7-year-old is admitted to the pediatric unit with fever, a stiff neck and a purple, non-blanching rash on the legs. Bacterial meningitis caused by Neisseria meningitidis is suspected, and IV antibiotics have just been started.",
  "q": "Which actions should the nurse include in the plan of care? Select all that apply.",
  "opts": [
   {
    "t": "Place the child in a private room",
    "ok": true,
    "why": "Yes: droplet precautions call for a private room, or cohorting with a child who has the same infection, to limit close contact."
   },
   {
    "t": "Wear a surgical mask when entering the room",
    "ok": true,
    "why": "Yes: meningococcus spreads in large respiratory droplets, and a surgical mask protects the nurse's nose and mouth during close contact."
   },
   {
    "t": "Place a surgical mask on the child if she must leave the room for a test",
    "ok": true,
    "why": "Yes: masking the source contains droplets during transport and protects others in hallways and imaging areas."
   },
   {
    "t": "Continue droplet precautions until she has received 24 hours of effective antibiotic therapy",
    "ok": true,
    "why": "Yes: after 24 hours of effective therapy the child is no longer considered infectious, so precautions can then be discontinued."
   },
   {
    "t": "Wear a fit-tested N95 respirator and request a negative-pressure room",
    "ok": false,
    "why": "No: these are airborne precautions. Droplets fall within a short distance, so special air handling is not needed for meningococcal disease."
   },
   {
    "t": "Keep the room door closed at all times",
    "ok": false,
    "why": "No: a closed door is required for airborne precautions, not droplet. Large droplets do not travel through room air into the hallway."
   }
  ],
  "why": "Meningococcal meningitis is spread by large respiratory droplets, so the child needs droplet precautions: a private room, a surgical mask for anyone entering, and a mask on the child during transport. Precautions continue until 24 hours of effective antibiotics. Close contacts are usually referred for preventive antibiotics.",
  "tip": "Know the airborne list cold; anything spread by large droplets, such as meningococcus, pertussis and influenza, needs only a surgical mask and a private room."
 },
 {
  "id": "qb-safe-6",
  "type": "matrix",
  "step": "analyze",
  "cn": "safety",
  "sp": "ms",
  "topic": "Transmission-based precautions",
  "stem": "The charge nurse on a medical unit is assigning rooms for six new admissions. Each client has a confirmed or suspected infection, and all clients receive standard precautions.",
  "q": "For each condition, indicate the transmission-based precaution the client needs.",
  "cols": [
   "Airborne",
   "Droplet",
   "Contact"
  ],
  "rows": [
   {
    "t": "Measles (rubeola)",
    "ans": 0,
    "why": "the measles virus stays suspended in air for up to 2 hours, so it needs a negative-pressure room and N95 respirators."
   },
   {
    "t": "Suspected pulmonary tuberculosis",
    "ans": 0,
    "why": "TB spreads by droplet nuclei that hang in the air; isolation starts on suspicion, before results confirm the diagnosis."
   },
   {
    "t": "Pertussis",
    "ans": 1,
    "why": "pertussis spreads in large droplets from coughing, so a surgical mask on entering the room and a private room are enough."
   },
   {
    "t": "Influenza",
    "ans": 1,
    "why": "influenza spreads mainly by large respiratory droplets; staff wear a surgical mask when entering the room."
   },
   {
    "t": "MRSA in a draining wound",
    "ans": 2,
    "why": "MRSA spreads by direct contact with the wound and contaminated surfaces, so gown and gloves are required."
   },
   {
    "t": "Clostridioides difficile diarrhea",
    "ans": 2,
    "why": "spores spread by touch and survive on surfaces; this needs contact precautions with soap and water hand washing."
   }
  ],
  "why": "Transmission-based precautions are added to standard precautions according to how the organism spreads. Airborne diseases such as measles, varicella and TB need a negative-pressure room and an N95. Droplet diseases need a surgical mask. Organisms spread by touch, such as MRSA and C. difficile, need gown and gloves.",
  "tip": "Use a memory list for airborne (measles, varicella, TB) and sort everything else by whether it spreads by coughing or by touching."
 },
 {
  "id": "qb-safe-7",
  "type": "mc",
  "step": "eval",
  "cn": "safety",
  "sp": "periop",
  "topic": "Sterile field maintenance",
  "stem": "In the operating room, a nurse is orienting a new circulating nurse during setup for a 55-year-old's laparoscopic cholecystectomy. The sterile field has been opened on the back table.",
  "q": "Which action by the new circulating nurse requires the precepting nurse to intervene?",
  "opts": [
   {
    "t": "Reaches across the sterile field to drop a suture packet onto the far side of the table",
    "ok": true,
    "why": "Yes: an unsterile person must never reach over a sterile field, because particles from the arm and gown can fall onto it. The field is now contaminated."
   },
   {
    "t": "Opens the first flap of a sterile package away from her body",
    "ok": false,
    "why": "No: opening the first flap away from the body keeps her arm from passing over the sterile contents. This is correct technique."
   },
   {
    "t": "Considers the outer 2.5 cm (1 inch) border of the sterile drape contaminated",
    "ok": false,
    "why": "No: the edge of a sterile field is considered unsterile, so items placed there are treated as contaminated. This is correct."
   },
   {
    "t": "Keeps the sterile field in view and never turns her back to it",
    "ok": false,
    "why": "No: a sterile field that is out of sight cannot be confirmed as sterile. Facing the field is correct practice."
   }
  ],
  "why": "Sterile technique depends on a few fixed rules: unsterile people do not reach over a sterile field, the edges are considered contaminated, and the field must stay in view. Reaching across the table breaks sterility, so the item and any affected area must be replaced before the case continues.",
  "tip": "If you are unsure whether an item is sterile, treat it as contaminated; the rule on the exam is the same as in the operating room."
 },
 {
  "id": "qb-safe-8",
  "type": "mc",
  "step": "act",
  "cn": "safety",
  "sp": "periop",
  "topic": "Wrong-site surgery prevention",
  "stem": "A 62-year-old is in the preoperative holding area for a scheduled right total knee arthroplasty. The signed consent says right knee, and the surgeon's initials are on the right knee. While the nurse completes the checklist, the client says, \"I'm glad they're finally fixing my left knee. That's the one that hurts.\"",
  "q": "Which action should the nurse take?",
  "opts": [
   {
    "t": "Stop the preoperative process and notify the surgeon so the correct site can be verified before the client goes to the operating room",
    "ok": true,
    "why": "Yes: any discrepancy in the procedure site must be resolved before the procedure. Any team member can and should stop the process to prevent wrong-site surgery."
   },
   {
    "t": "Continue the checklist, because the signed consent and site marking both say right knee",
    "ok": false,
    "why": "No: the client's own statement is a key verification source. Proceeding despite a conflict is exactly how wrong-site surgery happens."
   },
   {
    "t": "Ask the client to initial the left knee to show the correct site",
    "ok": false,
    "why": "No: the site is marked by the person performing the procedure after verification, not changed by the client or nurse. This adds a second conflicting mark."
   },
   {
    "t": "Document the client's statement and let the surgical team address it during the time-out",
    "ok": false,
    "why": "No: the time-out is a final check, not the place to first resolve a known conflict. The client may be sedated by then and unable to confirm."
   }
  ],
  "why": "The Joint Commission Universal Protocol includes preprocedure verification, site marking and a time-out. Verification uses the client's statement, the consent, the history and imaging, and all must match. When they do not, the nurse stops the process and involves the surgeon before anything else happens.",
  "tip": "On surgical safety questions, any mismatch means stop and verify; never pick an answer that lets the procedure continue with an unresolved discrepancy."
 },
 {
  "id": "qb-safe-9",
  "type": "highlight",
  "step": "cues",
  "cn": "safety",
  "sp": "comm",
  "topic": "Fall risk at home",
  "stem": "A home health nurse visits an 84-year-old who lives alone after a hospital stay for pneumonia. Nurse's note from the first home visit.",
  "q": "Highlight the findings that increase the client's risk of falling.",
  "parts": [
   {
    "t": "Takes lorazepam 1 mg at bedtime for sleep.",
    "ok": true,
    "why": "Yes: benzodiazepines cause sedation, slowed reactions and unsteady gait in older adults and are a leading medication cause of falls."
   },
   {
    "t": "Gets up twice each night to urinate.",
    "ok": true,
    "why": "Yes: nocturia means walking in the dark while drowsy, often in a hurry, which sharply raises the risk of falling."
   },
   {
    "t": "Throw rugs line the hallway between the bedroom and bathroom.",
    "ok": true,
    "why": "Yes: loose rugs are a common trip hazard, and this one sits on the exact path she walks at night."
   },
   {
    "t": "Hallway night-light burned out last month and has not been replaced.",
    "ok": true,
    "why": "Yes: poor lighting on a nighttime route to the bathroom makes it hard to see rugs and thresholds."
   },
   {
    "t": "Grab bars were installed in the shower last year.",
    "ok": false,
    "why": "No: grab bars are a protective measure that lowers fall risk in the bathroom. They are a strength, not a risk factor."
   },
   {
    "t": "Drinks one cup of coffee each morning.",
    "ok": false,
    "why": "No: a single morning cup of coffee has little effect on fall risk and does not explain nighttime trips to the bathroom."
   },
   {
    "t": "Smoke detector was tested last week and works.",
    "ok": false,
    "why": "No: a working smoke detector is good fire safety. It is unrelated to falls; the trap is selecting any safety finding."
   }
  ],
  "why": "Falls in older adults usually come from several risks combined: sedating medications, nocturia, poor lighting and trip hazards. This client has all four on the same nighttime route. The nurse should plan to remove rugs, replace the night-light and review the lorazepam with the provider.",
  "tip": "Picture the client's actual path through the home, especially at night, and highlight anything that makes that path more dangerous."
 },
 {
  "id": "qb-safe-10",
  "type": "sata",
  "step": "eval",
  "cn": "safety",
  "sp": "icu",
  "topic": "Restraint safety",
  "stem": "A 70-year-old in the ICU is intubated and on a ventilator. He pulled at his endotracheal tube twice despite family presence, frequent reorientation and mitts. Soft wrist restraints were ordered and applied 4 hours ago. The nurse checks the restraints and reviews the record.",
  "q": "Which findings indicate the restraints are being used safely? Select all that apply.",
  "opts": [
   {
    "t": "The straps are tied to the bed frame with a quick-release knot",
    "ok": true,
    "why": "Yes: the bed frame moves with the client, and a quick-release knot allows fast removal in an emergency."
   },
   {
    "t": "Two fingers fit between each restraint and the client's wrist",
    "ok": true,
    "why": "Yes: this confirms the restraint is snug enough to work but loose enough to protect circulation and skin."
   },
   {
    "t": "Fingers are warm and pink with brisk capillary refill",
    "ok": true,
    "why": "Yes: these findings show circulation distal to the restraints is intact, which is checked at each assessment."
   },
   {
    "t": "The flowsheet shows the restraints were released, the skin checked and range of motion done every 2 hours",
    "ok": true,
    "why": "Yes: regular release, skin checks and range of motion prevent skin injury, contractures and circulation problems while restraints are in place."
   },
   {
    "t": "The straps are tied to the side rails",
    "ok": false,
    "why": "No: lowering a side rail can pull the wrist or cause injury. Restraints are secured to the bed frame, never to the rails."
   },
   {
    "t": "The order reads soft wrist restraints as needed for agitation",
    "ok": false,
    "why": "No: restraint orders cannot be written as PRN. Each order must be time-limited and renewed according to policy and regulation."
   }
  ],
  "why": "Restraints are a last resort after less restrictive alternatives fail, as they did here. Safe use means a time-limited order, attachment to the bed frame with a quick-release knot, a two-finger fit, circulation checks, and regular release with skin care and range of motion. The need for restraints is reassessed continually so they are removed as soon as possible.",
  "tip": "For restraint questions, rule out any answer with side rails, PRN orders or tight fits, then confirm frequent monitoring."
 },
 {
  "id": "qb-safe-11",
  "type": "mc",
  "step": "act",
  "cn": "safety",
  "sp": "ms",
  "topic": "Medication error response",
  "stem": "At 09:00 a nurse on the medical-surgical unit gives metoprolol tartrate 50 mg PO to a client in room 412. Five minutes later she realizes the medication was ordered for a client with a similar name in room 414. She had checked only the client's name and room number. The client who received it is 81 years old and was admitted for a urinary tract infection.",
  "q": "Which action should the nurse take first?",
  "opts": [
   {
    "t": "Assess the client's heart rate, blood pressure and level of consciousness",
    "ok": true,
    "why": "Yes: the client's safety comes first. Metoprolol can cause bradycardia and hypotension, so the nurse needs current data before calling the provider."
   },
   {
    "t": "Complete an incident report",
    "ok": false,
    "why": "No: the report is required, but it comes after the client is assessed and treated. Paperwork never comes before client safety."
   },
   {
    "t": "Notify the provider of the error",
    "ok": false,
    "why": "No: the provider must be told promptly, but the nurse should first assess so she can report the client's current heart rate and blood pressure."
   },
   {
    "t": "Check the second client's armband using his name and date of birth",
    "ok": false,
    "why": "No: the other client still needs his dose, but the immediate risk is to the client who received a beta blocker he was not prescribed."
   }
  ],
  "why": "After a medication error, the first action is to assess the client for harm, then notify the provider, then follow facility policy for reporting. The incident report is not mentioned in the medical record. This error happened because a room number was used as an identifier; the Joint Commission requires two identifiers such as full name and date of birth, checked against the armband.",
  "tip": "When an error has already happened, choose the assessment of the client before notifying, documenting or reporting."
 },
 {
  "id": "qb-safe-12",
  "type": "mc",
  "step": "act",
  "cn": "safety",
  "sp": "ed",
  "topic": "Needlestick exposure",
  "stem": "An emergency department nurse gives an IM injection to a 38-year-old with unknown HIV and hepatitis status. While activating the safety device, she sticks her finger with the used needle. The wound is bleeding slightly.",
  "q": "Which action should the nurse take first?",
  "opts": [
   {
    "t": "Wash the puncture site with soap and water",
    "ok": true,
    "why": "Yes: immediate washing with soap and water is the first step after a percutaneous exposure. It reduces the amount of blood and virus at the site."
   },
   {
    "t": "Squeeze the finger to make the wound bleed more",
    "ok": false,
    "why": "No: squeezing has no proven benefit and may damage tissue. The trap is a common folk practice that is not recommended."
   },
   {
    "t": "Soak the finger in bleach solution",
    "ok": false,
    "why": "No: caustic agents such as bleach are not recommended for skin; they injure tissue without lowering infection risk."
   },
   {
    "t": "Ask the provider to order HIV and hepatitis tests on the client",
    "ok": false,
    "why": "No: source testing is part of the follow-up, but first aid to the wound comes first, then reporting the exposure right away."
   }
  ],
  "why": "After a needlestick, the nurse washes the site with soap and water, then reports the exposure immediately to the supervisor and employee health. Source testing and evaluation for postexposure prophylaxis follow. HIV prophylaxis works best when started as soon as possible, ideally within hours.",
  "tip": "For exposure questions, first aid to the site comes first, then report, then testing and treatment."
 },
 {
  "id": "qb-safe-14",
  "type": "sata",
  "step": "solve",
  "cn": "safety",
  "sp": "comm",
  "topic": "Safe chemotherapy handling",
  "stem": "A nurse in an outpatient infusion center is preparing to give an IV chemotherapy drug to a 57-year-old with breast cancer. The drug was prepared by pharmacy in a biological safety cabinet.",
  "q": "Which actions should the nurse plan to take to protect staff and others from hazardous drug exposure? Select all that apply.",
  "opts": [
   {
    "t": "Wear two pairs of chemotherapy-tested gloves",
    "ok": true,
    "why": "Yes: double gloving with gloves tested for use with chemotherapy reduces skin absorption if the outer glove is contaminated or torn."
   },
   {
    "t": "Wear a disposable, impermeable gown that closes in the back",
    "ok": true,
    "why": "Yes: a back-closing, low-permeability gown keeps hazardous drug off the nurse's clothing and skin during administration."
   },
   {
    "t": "Discard gloves, gown and tubing in a designated hazardous drug waste container",
    "ok": true,
    "why": "Yes: contaminated items go into labeled hazardous drug waste so housekeeping and others are not exposed."
   },
   {
    "t": "Wear gloves when handling the client's urine or emesis for at least 48 hours after the infusion",
    "ok": true,
    "why": "Yes: many chemotherapy drugs are excreted in body fluids for about 48 hours, so contact with them is an exposure risk."
   },
   {
    "t": "Prime the IV tubing with the chemotherapy drug at the chair before connecting it",
    "ok": false,
    "why": "No: priming with the drug at the bedside risks spraying or dripping it. Tubing is primed with a compatible fluid without drug or in the safety cabinet."
   },
   {
    "t": "Reuse the gown for the next client if it is not visibly soiled",
    "ok": false,
    "why": "No: hazardous drug residue can be invisible. Gowns are single-use and discarded after each client or after contamination."
   },
   {
    "t": "Wipe a small drip of the drug with paper towels and discard them in the regular trash",
    "ok": false,
    "why": "No: any spill is cleaned with a spill kit while wearing PPE, and the waste goes in hazardous drug waste, never the regular trash."
   }
  ],
  "why": "Chemotherapy drugs are hazardous to the people who handle them, with risks that include skin injury, reproductive harm and cancer. Protection includes double chemotherapy gloves, an impermeable gown, safe priming, a spill kit and hazardous waste disposal. Body fluids are treated as contaminated for about 48 hours after the dose.",
  "tip": "For hazardous drug questions, choose every option that keeps the drug contained, and reject anything that reuses PPE or sends waste to regular trash."
 },
 {
  "id": "qb-safe-15",
  "type": "mc",
  "step": "hypo",
  "cn": "safety",
  "sp": "ms",
  "topic": "Radiation implant safety",
  "stem": "A 49-year-old on the gynecologic oncology unit has a sealed radioactive implant in place for cervical cancer. She is on bed rest in a private room with a lead shield at the bedside and a lead container with long-handled forceps in the room.",
  "q": "Which finding requires the nurse's immediate action?",
  "opts": [
   {
    "t": "A small metal source is seen lying in the bed linens",
    "ok": true,
    "why": "Yes: a dislodged source exposes everyone nearby. The nurse uses long-handled forceps to place it in the lead container and notifies radiation safety at once."
   },
   {
    "t": "The client reports mild lower abdominal cramping",
    "ok": false,
    "why": "No: mild cramping is expected with a cervical implant and can be managed with ordered analgesics. It is not the most urgent finding."
   },
   {
    "t": "Her adult son is sitting 2 meters (6 feet) from the bed and plans to stay for 20 minutes",
    "ok": false,
    "why": "No: this visit respects distance and time limits. Visitors who are not pregnant may stay briefly at a distance per facility policy."
   },
   {
    "t": "She is lying flat with an indwelling urinary catheter draining clear urine",
    "ok": false,
    "why": "No: bed rest and a catheter are expected; they keep the implant from moving and avoid trips to the bathroom."
   }
  ],
  "why": "Radiation protection rests on time, distance and shielding. A dislodged source is a radiation hazard that the nurse handles only with long-handled forceps, never with hands, placing it in the lead container and calling the radiation safety officer. Expected findings such as cramping, bed rest and a catheter are not urgent.",
  "tip": "When one option describes a hazard to everyone in the room and the others are expected findings, the hazard comes first."
 },
 {
  "id": "qb-safe-16",
  "type": "cloze",
  "step": "solve",
  "cn": "safety",
  "sp": "ms",
  "topic": "Safe patient handling",
  "stem": "A 68-year-old on the medical-surgical unit had a stroke 3 days ago. She weighs 98 kg (216 lb), cannot bear weight on either leg, and follows commands only some of the time. The nurse is planning her transfer from bed to chair and her repositioning in bed.",
  "q": "Complete the sentences.",
  "parts": [
   "For the transfer from bed to chair, the nurse should plan to use ",
   {
    "opts": [
     "a full-body mechanical lift",
     "a two-person manual lift",
     "a gait belt and a one-person pivot transfer"
    ],
    "ans": 0,
    "whys": [
     "Yes: a client who cannot bear weight or reliably cooperate needs a mechanical lift. Manual lifting of her weight exceeds safe limits for staff.",
     "No: manual lifting of most adult clients exceeds the safe lifting limit for caregivers and is a leading cause of nurse back injuries.",
     "No: a pivot transfer requires the client to bear weight on at least one leg, which she cannot do."
    ]
   },
   ". Before repositioning her in bed, the nurse should raise the bed to ",
   {
    "opts": [
     "about the caregiver's waist height",
     "the lowest position",
     "the highest position"
    ],
    "ans": 0,
    "whys": [
     "Yes: working at waist height keeps the load close to the body and the back straight, which lowers strain on the spine.",
     "No: the low position is for safety when the client is resting; working at that height forces the nurse to bend at the waist.",
     "No: working too high makes the nurse reach and lift with the arms and shoulders, increasing strain and injury risk."
    ]
   },
   ", and to move her up in bed the nurse should use ",
   {
    "opts": [
     "a friction-reducing device with enough staff",
     "the client's arms to pull her up",
     "one nurse pushing from the foot of the bed"
    ],
    "ans": 0,
    "whys": [
     "Yes: friction-reducing sheets let staff slide rather than lift the client, protecting both her skin and their backs.",
     "No: pulling under or on the arms can dislocate a weak shoulder, a known risk after stroke.",
     "No: one person cannot safely move a dependent adult of this size, and pushing from the foot gives poor control."
    ]
   },
   "."
  ],
  "why": "Safe patient handling programs replace manual lifting with equipment whenever a client cannot bear weight or cooperate. Working at waist height, keeping the load close and using friction-reducing devices protect the nurse's back. Pulling on the arms of a client after stroke can injure a weak shoulder.",
  "tip": "If a client cannot bear weight, choose the mechanical lift; NCLEX treats manual lifting of dependent adults as unsafe for staff."
 },
 {
  "id": "qb-hp-1",
  "type": "mc",
  "step": "cues",
  "cn": "health",
  "sp": "peds",
  "topic": "Infant developmental milestones",
  "stem": "A parent brings a 9-month-old to the pediatric clinic for a well-child visit. The infant was born at term and is growing along the 50th percentile for weight and length.",
  "q": "Which finding reported by the parent requires follow-up?",
  "opts": [
   {
    "t": "He cannot sit up without support",
    "ok": true,
    "why": "Yes: most infants sit without support by 9 months. Not doing so suggests a motor delay that needs developmental screening and possible referral."
   },
   {
    "t": "He is not walking yet",
    "ok": false,
    "why": "No: independent walking usually begins around 12 months and can be later. It is not expected at 9 months."
   },
   {
    "t": "He cries when his parent leaves the room",
    "ok": false,
    "why": "No: separation and stranger anxiety are expected at this age and show attachment to caregivers."
   },
   {
    "t": "He babbles \"mamama\" without using it for a specific person",
    "ok": false,
    "why": "No: repetitive babbling is expected at 9 months; meaningful words such as mama for a parent come around 12 months."
   }
  ],
  "why": "At 9 months, infants are expected to sit without support, babble repeated sounds and show separation anxiety. Walking is a later milestone. A term infant who cannot sit unsupported at this age needs further screening for a motor delay.",
  "tip": "Know one or two anchor milestones for each age, then pick the finding that falls behind the expected timeline, not one that is simply not yet due."
 },
 {
  "id": "qb-hp-2",
  "type": "matrix",
  "step": "act",
  "cn": "health",
  "sp": "comm",
  "topic": "Vaccine contraindications",
  "stem": "A nurse in a community health clinic reviews the charts of clients due for vaccines today. The clinic follows the CDC immunization schedule.",
  "q": "For each client, indicate whether the nurse should give the vaccine as scheduled or hold it and consult the provider.",
  "cols": [
   "Give as scheduled",
   "Hold and consult the provider"
  ],
  "rows": [
   {
    "t": "12-month-old due for MMR; an older sibling at home is receiving chemotherapy",
    "ans": 0,
    "why": "the MMR vaccine viruses are not spread to household contacts, and vaccinating family members helps protect the immunocompromised sibling."
   },
   {
    "t": "4-year-old due for varicella vaccine who has taken prednisone 2 mg/kg/day for the past 3 weeks",
    "ans": 1,
    "why": "high-dose steroids for 14 days or longer suppress the immune system, so a live vaccine is delayed until at least 1 month after the steroid course ends."
   },
   {
    "t": "4-month-old with a runny nose and temperature of 37.8 °C (100 °F) due for routine vaccines",
    "ans": 0,
    "why": "a mild illness with or without low-grade fever is not a reason to delay vaccines; delaying leaves the infant unprotected."
   },
   {
    "t": "28-year-old who is 10 weeks pregnant, not immune to rubella, and asks for the MMR vaccine",
    "ans": 1,
    "why": "live vaccines are contraindicated in pregnancy because of a theoretical risk to the fetus; MMR is given after birth."
   },
   {
    "t": "15-month-old due for MMR who had anaphylaxis to neomycin",
    "ans": 1,
    "why": "MMR contains trace neomycin, and a severe allergic reaction to a vaccine component is a contraindication."
   },
   {
    "t": "6-year-old with an egg allergy that causes hives, due for the inactivated influenza vaccine",
    "ans": 0,
    "why": "current CDC guidance says egg allergy of any severity needs no extra precautions for influenza vaccine beyond those for any vaccine."
   }
  ],
  "why": "Live vaccines such as MMR and varicella are held in pregnancy and in clients whose immune system is suppressed, including by high-dose steroids. Anaphylaxis to a vaccine component is a contraindication. Mild illness, egg allergy for flu vaccine, and an immunocompromised household member are not reasons to hold vaccines.",
  "tip": "Identify which vaccines are live first, then hold them only for pregnancy, immunosuppression or a true severe allergy to a component."
 },
 {
  "id": "qb-hp-3",
  "type": "mc",
  "step": "solve",
  "cn": "health",
  "sp": "psy",
  "topic": "Lung cancer screening",
  "stem": "A 58-year-old with schizophrenia is preparing for discharge from the adult psych unit. He has smoked one pack of cigarettes a day for 35 years and still smokes. He says, \"My uncle died of lung cancer. Is there any way to check my lungs before I get sick?\"",
  "q": "Which response by the nurse is most appropriate?",
  "opts": [
   {
    "t": "\"Based on your age and smoking history, you meet the criteria for a yearly low-dose CT scan of the chest. Let's also talk about support to help you quit.\"",
    "ok": true,
    "why": "Yes: USPSTF recommends yearly low-dose CT for adults 50 to 80 with at least a 20 pack-year history who smoke now or quit within 15 years. Pairing it with cessation support addresses the main risk."
   },
   {
    "t": "\"A yearly chest x-ray is the recommended screening test for people who smoke.\"",
    "ok": false,
    "why": "No: chest x-rays have not been shown to reduce deaths from lung cancer. Low-dose CT is the recommended screening test."
   },
   {
    "t": "\"Screening is only needed if you start to have a cough or lose weight.\"",
    "ok": false,
    "why": "No: screening is for people without symptoms. A new cough or weight loss calls for a diagnostic workup, not screening."
   },
   {
    "t": "\"If you quit smoking now, you will not need any screening.\"",
    "ok": false,
    "why": "No: quitting lowers risk over time, but a long smoking history still qualifies him for screening for years after quitting."
   }
  ],
  "why": "This client qualifies for lung cancer screening: he is 58, has 35 pack-years and still smokes. Low-dose CT is the recommended test. People with serious mental illness smoke at much higher rates than the general population, so discharge is a good time to offer both screening and cessation support.",
  "tip": "For screening questions, separate screening (no symptoms, eligible by risk) from diagnosis (symptoms present), and favor answers that also address the risk behavior."
 },
 {
  "id": "qb-hp-4",
  "type": "sata",
  "step": "eval",
  "cn": "health",
  "sp": "ob",
  "topic": "Prenatal danger signs",
  "stem": "A 26-year-old, G1P0, at 30 weeks' gestation is seen in the prenatal clinic. Her pregnancy has been uncomplicated, BP 116/72. The nurse has just taught her the warning signs to report before her next visit.",
  "q": "Which statements by the client indicate understanding of the teaching? Select all that apply.",
  "opts": [
   {
    "t": "\"I'll call if I get a headache that doesn't go away with acetaminophen or if I see spots.\"",
    "ok": true,
    "why": "Yes: persistent headache and visual changes can signal preeclampsia with severe features and need prompt evaluation."
   },
   {
    "t": "\"If the baby is moving less than usual, I'll call right away instead of waiting for my next visit.\"",
    "ok": true,
    "why": "Yes: decreased fetal movement can be an early sign of fetal compromise and needs same-day assessment."
   },
   {
    "t": "\"Fluid leaking or gushing from my vagina is a reason to call, even without contractions.\"",
    "ok": true,
    "why": "Yes: this may be preterm rupture of membranes, which raises the risk of infection and preterm birth."
   },
   {
    "t": "\"Tightening every 10 minutes or more often for an hour means I need to be checked.\"",
    "ok": true,
    "why": "Yes: regular contractions before 37 weeks may be preterm labor, which can sometimes be slowed if caught early."
   },
   {
    "t": "\"Swelling in my ankles at the end of the day means I should go to the hospital.\"",
    "ok": false,
    "why": "No: dependent ankle edema that improves with rest is common late in pregnancy. Swelling of the face or hands is the concern."
   },
   {
    "t": "\"A little bright red bleeding is normal now, so I can wait until my next appointment.\"",
    "ok": false,
    "why": "No: vaginal bleeding in the third trimester may mean placenta previa or abruption and must be reported immediately."
   },
   {
    "t": "\"I should rest flat on my back so more blood flows to the baby.\"",
    "ok": false,
    "why": "No: lying supine lets the uterus compress the vena cava and can lower blood flow to the placenta. Side-lying is preferred."
   }
  ],
  "why": "Prenatal teaching focuses on signs of preeclampsia, preterm labor, rupture of membranes, bleeding and fetal compromise. Dependent ankle edema is a common discomfort, while bleeding is never normal late in pregnancy. Lying on the back can reduce placental blood flow.",
  "tip": "Sort each statement into common discomfort or warning sign; anything involving bleeding, fluid, vision, headache or fetal movement belongs in warning signs."
 },
 {
  "id": "qb-hp-5",
  "type": "bowtie",
  "step": "hypo",
  "cn": "health",
  "sp": "ob",
  "topic": "Postpartum fundal assessment",
  "stem": "A 29-year-old, G2P2, gave birth vaginally 4 hours ago. During the postpartum assessment, the fundus is boggy, 2 cm above the umbilicus and deviated to the right. Lochia rubra is moderate, up from scant an hour ago. A rounded swelling is felt above the symphysis pubis. She has not voided since the birth. BP 118/72, HR 84.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Bladder distention displacing the uterus",
    "Retained placental fragments",
    "Postpartum preeclampsia",
    "Normal uterine involution"
   ],
   "ans": 0
  },
  "actions": {
   "opts": [
    "Massage the fundus until it is firm",
    "Assist her to the bathroom to void, and catheterize as ordered if she cannot",
    "Give methylergonovine IM before reassessing",
    "Place her in Trendelenburg position",
    "Encourage her to wait to void until the next scheduled assessment"
   ],
   "ans": [
    0,
    1
   ]
  },
  "params": {
   "opts": [
    "Fundal tone, height and position after she voids",
    "Amount of lochia by pad count or weight",
    "Deep tendon reflexes",
    "Breast fullness",
    "Blood glucose"
   ],
   "ans": [
    0,
    1
   ]
  },
  "whys": {
   "cond": [
    "Yes: a full bladder pushes the uterus up and to the side and keeps it from contracting, which explains the boggy, displaced fundus and increasing lochia.",
    "No: retained fragments cause a boggy uterus and bleeding, but they do not explain the displaced fundus and the full bladder.",
    "No: preeclampsia causes elevated blood pressure, headache or visual changes, and her BP is normal.",
    "No: normally the fundus is firm and midline at or near the umbilicus after birth; boggy and deviated is not normal."
   ],
   "actions": [
    "Yes: massaging a boggy fundus stimulates the uterus to contract and compress open blood vessels at the placental site.",
    "Yes: emptying the bladder lets the uterus return to midline and contract; it is the fix for the underlying cause.",
    "No: a uterotonic is not the first step when a full bladder is the cause, and it needs an order based on ongoing atony.",
    "No: Trendelenburg is not used for postpartum bleeding and does not address the full bladder.",
    "No: delaying voiding keeps the uterus displaced and boggy and increases the risk of postpartum hemorrhage."
   ],
   "params": [
    "Yes: a firm, midline fundus at or below the umbilicus after voiding confirms the bladder was the cause.",
    "Yes: lochia that returns to a small to moderate amount shows bleeding is controlled; heavy flow needs escalation.",
    "No: reflexes are monitored for magnesium therapy or preeclampsia, not for a displaced uterus.",
    "No: breast fullness is part of the postpartum assessment but does not show whether this problem is resolving.",
    "No: glucose is not affected by bladder distention and does not reflect uterine tone or bleeding."
   ]
  },
  "why": "A fundus that is boggy, high and deviated to one side with a palpable bladder points to bladder distention, a common and preventable cause of uterine atony and bleeding. The nurse massages the fundus and helps the client empty her bladder. The fundus and lochia are then reassessed using the BUBBLE-HE approach.",
  "tip": "A fundus deviated to the side is a full bladder until proven otherwise; fix the cause before reaching for medications."
 },
 {
  "id": "qb-hp-6",
  "type": "matrix",
  "step": "analyze",
  "cn": "health",
  "sp": "ob",
  "topic": "Fetal heart rate decelerations",
  "stem": "A labor and delivery nurse is reviewing fetal heart rate tracing patterns with a nursing student. The client is a 31-year-old, G2P1, at 39 weeks in active labor with continuous electronic fetal monitoring.",
  "q": "For each description, indicate the type of deceleration it represents.",
  "cols": [
   "Early deceleration",
   "Variable deceleration",
   "Late deceleration"
  ],
  "rows": [
   {
    "t": "Gradual decrease that begins with the contraction, with its lowest point at the peak of the contraction",
    "ans": 0,
    "why": "early decelerations mirror the contraction, starting, peaking and ending with it."
   },
   {
    "t": "Abrupt, V-shaped drop that varies in timing from one contraction to the next",
    "ans": 1,
    "why": "variable decelerations fall abruptly and their timing is unrelated to the shape of the contraction."
   },
   {
    "t": "Gradual decrease with its lowest point after the peak of the contraction, returning to baseline after the contraction ends",
    "ans": 2,
    "why": "late decelerations are offset from the contraction, lagging behind it from start to finish."
   },
   {
    "t": "Caused by compression of the fetal head during descent",
    "ans": 0,
    "why": "head compression triggers a vagal response; early decelerations are benign and need no intervention."
   },
   {
    "t": "Caused by compression of the umbilical cord",
    "ans": 1,
    "why": "cord compression briefly cuts off blood flow, producing the sudden drop seen in variable decelerations."
   },
   {
    "t": "Caused by uteroplacental insufficiency",
    "ans": 2,
    "why": "reduced blood flow through the placenta during contractions lowers fetal oxygen and causes late decelerations."
   }
  ],
  "why": "Decelerations are classified by their shape and their timing relative to contractions. Early decelerations mirror the contraction and come from head compression. Variable decelerations are abrupt and come from cord compression. Late decelerations follow the contraction and signal uteroplacental insufficiency, which needs prompt intervention.",
  "tip": "Use VEAL CHOP: variable is cord, early is head, accelerations are okay, late is placenta."
 },
 {
  "id": "qb-hp-7",
  "type": "sata",
  "step": "act",
  "cn": "health",
  "sp": "ob",
  "topic": "Late deceleration response",
  "stem": "A 33-year-old, G1P0, at 40 weeks is 6 cm dilated and receiving an oxytocin infusion. Contractions are every 2 minutes, lasting 70 seconds. For the past 30 minutes the fetal heart rate tracing shows recurrent late decelerations with minimal variability. BP 102/60, HR 92.",
  "q": "Which actions should the nurse take? Select all that apply.",
  "opts": [
   {
    "t": "Stop the oxytocin infusion",
    "ok": true,
    "why": "Yes: oxytocin increases contraction frequency and strength, which further cuts placental blood flow. Stopping it gives the fetus more recovery time between contractions."
   },
   {
    "t": "Turn the client onto her side",
    "ok": true,
    "why": "Yes: a lateral position takes pressure off the vena cava and improves blood return and placental perfusion."
   },
   {
    "t": "Give an IV fluid bolus as ordered",
    "ok": true,
    "why": "Yes: increasing circulating volume raises maternal blood pressure and improves blood flow to the placenta, especially with a soft BP."
   },
   {
    "t": "Notify the provider of the tracing",
    "ok": true,
    "why": "Yes: recurrent late decelerations with minimal variability suggest fetal compromise and need provider evaluation and a plan."
   },
   {
    "t": "Increase the oxytocin to speed delivery",
    "ok": false,
    "why": "No: more oxytocin means more frequent contractions and less oxygen to the fetus. The trap is thinking faster birth helps."
   },
   {
    "t": "Place the client supine with her legs elevated",
    "ok": false,
    "why": "No: supine positioning compresses the vena cava, lowering cardiac output and placental blood flow even further."
   },
   {
    "t": "Continue to observe and document at the next routine check",
    "ok": false,
    "why": "No: recurrent late decelerations require immediate intrauterine resuscitation, not watchful waiting."
   }
  ],
  "why": "Recurrent late decelerations reflect uteroplacental insufficiency. Intrauterine resuscitation aims to improve blood flow to the placenta: stop oxytocin, reposition to the side, correct hypotension with IV fluids and notify the provider. The nurse then evaluates the tracing to see whether the decelerations resolve.",
  "tip": "For late decelerations, choose actions that increase blood flow to the placenta and remove anything that adds uterine stress."
 },
 {
  "id": "qb-hp-8",
  "type": "cloze",
  "step": "analyze",
  "cn": "health",
  "sp": "ed",
  "topic": "Stages of labor",
  "stem": "A 24-year-old, G2P1, at 39 weeks arrives at the emergency department saying she needs to push. Contractions are every 2 minutes, lasting 60 seconds. Her membranes ruptured 1 hour ago with clear fluid. The provider's exam shows the cervix is 10 cm dilated and the fetal head is visible with pushing.",
  "q": "Complete the sentences.",
  "parts": [
   "The client is in the ",
   {
    "opts": [
     "second stage",
     "first stage",
     "third stage"
    ],
    "ans": 0,
    "whys": [
     "Yes: the second stage begins at full cervical dilation of 10 cm, which matches her exam and her urge to push.",
     "No: the first stage is cervical dilation from onset of labor to 10 cm; she is already fully dilated.",
     "No: the third stage begins after the newborn is born, and her baby has not been born yet."
    ]
   },
   " of labor. This stage ends with ",
   {
    "opts": [
     "the birth of the newborn",
     "delivery of the placenta",
     "full cervical dilation"
    ],
    "ans": 0,
    "whys": [
     "Yes: the second stage is the pushing and birth stage; it ends when the newborn is delivered.",
     "No: delivery of the placenta ends the third stage, which follows the birth.",
     "No: full cervical dilation ends the first stage and is where the second stage begins."
    ]
   },
   ". The first hours after the placenta is delivered, when the nurse closely checks the fundus, lochia and vital signs, are called the ",
   {
    "opts": [
     "fourth stage",
     "third stage",
     "latent phase"
    ],
    "ans": 0,
    "whys": [
     "Yes: the fourth stage is the immediate recovery period, when the risk of postpartum hemorrhage is highest and assessment is frequent.",
     "No: the third stage ends when the placenta is delivered, so the recovery period that follows is not part of it.",
     "No: the latent phase is the early part of the first stage, with slow cervical change before active labor."
    ]
   },
   "."
  ],
  "why": "Labor has four stages. The first stage is cervical dilation to 10 cm, the second ends with birth, the third ends with delivery of the placenta, and the fourth is the first hours of recovery. This client is fully dilated and pushing, so birth may be imminent and the nurse prepares for delivery in the ED.",
  "tip": "Anchor each stage to the event that ends it: 10 cm, baby, placenta, then recovery."
 },
 {
  "id": "qb-hp-9",
  "type": "mc",
  "step": "eval",
  "cn": "health",
  "sp": "ob",
  "topic": "Newborn vitamin K and eye prophylaxis",
  "stem": "A 31-year-old gave birth to a healthy term newborn 1 hour ago and plans to breastfeed exclusively. The nurse has taught her about the vitamin K injection and erythromycin eye ointment ordered for the newborn.",
  "q": "Which statement by the parent indicates understanding of the teaching?",
  "opts": [
   {
    "t": "\"The vitamin K shot helps my baby's blood clot, because babies are born with low levels.\"",
    "ok": true,
    "why": "Yes: newborns have little vitamin K and lack the gut bacteria that make it, so a single dose prevents vitamin K deficiency bleeding."
   },
   {
    "t": "\"Since I'm breastfeeding, my milk will give the baby enough vitamin K.\"",
    "ok": false,
    "why": "No: breast milk is low in vitamin K, so exclusively breastfed infants are at higher risk of bleeding without the injection."
   },
   {
    "t": "\"Vitamin K is only needed if my baby has a circumcision.\"",
    "ok": false,
    "why": "No: vitamin K deficiency bleeding can occur in the brain or gut without any procedure, so every newborn should receive it."
   },
   {
    "t": "\"The eye ointment is given to prevent jaundice.\"",
    "ok": false,
    "why": "No: erythromycin eye ointment prevents gonococcal eye infection acquired during birth. It has no effect on jaundice."
   }
  ],
  "why": "Newborns are born with low vitamin K and a sterile gut, so they cannot make enough clotting factors at first. A single IM dose prevents vitamin K deficiency bleeding, which can cause brain hemorrhage, and it matters most for breastfed infants. Erythromycin eye ointment prevents gonococcal ophthalmia neonatorum.",
  "tip": "On teaching questions, the correct statement usually gives the accurate reason for the treatment, not a limiting condition or a mixed-up purpose."
 },
 {
  "id": "qb-hp-10",
  "type": "highlight",
  "step": "cues",
  "cn": "health",
  "sp": "peds",
  "topic": "Safe infant sleep",
  "stem": "A 2-month-old is seen in the pediatric clinic for a well-child visit. The nurse documents the parent's description of the infant's sleep routine.",
  "q": "Highlight the findings that require follow-up.",
  "parts": [
   {
    "t": "Sleeps on her back for naps and at night.",
    "ok": false,
    "why": "No: the supine position for every sleep is the single most important way to reduce the risk of sudden infant death."
   },
   {
    "t": "The crib has bumper pads and a soft quilt to keep her warm.",
    "ok": true,
    "why": "Yes: bumpers and soft bedding raise the risk of suffocation and entrapment; the crib should hold only a firm, flat mattress and fitted sheet."
   },
   {
    "t": "Sleeps in her own bassinet in her parents' room.",
    "ok": false,
    "why": "No: room-sharing without bed-sharing is recommended, ideally for at least the first 6 months."
   },
   {
    "t": "On weekends she sleeps in our bed between us.",
    "ok": true,
    "why": "Yes: bed-sharing raises the risk of suffocation and sudden unexpected infant death, especially for infants this young."
   },
   {
    "t": "Takes a pacifier at bedtime.",
    "ok": false,
    "why": "No: offering a pacifier at sleep time is associated with a lower risk of sudden infant death."
   },
   {
    "t": "Often falls asleep in her car seat and stays in it in the crib overnight because she spits up.",
    "ok": true,
    "why": "Yes: sitting devices are not safe for routine sleep because the head can fall forward and block the airway. Spitting up is not a reason to change position."
   },
   {
    "t": "No one smokes in the home.",
    "ok": false,
    "why": "No: a smoke-free home lowers the risk of sudden infant death. This is a protective finding."
   }
  ],
  "why": "AAP safe sleep guidance is: back to sleep for every sleep, on a firm flat surface with no soft bedding or bumpers, in the parents' room but not in their bed. Car seats and other sitting devices are not for routine sleep. Pacifiers and a smoke-free home are protective.",
  "tip": "Picture the ideal sleep space (alone, on the back, in a bare crib) and highlight everything that differs from it."
 },
 {
  "id": "qb-hp-11",
  "type": "sata",
  "step": "solve",
  "cn": "health",
  "sp": "comm",
  "topic": "Breastfeeding teaching",
  "stem": "A home health nurse visits a 27-year-old first-time parent 3 days after an uncomplicated vaginal birth. She is breastfeeding and says, \"I'm not sure the baby is getting enough, and my nipples are getting sore.\"",
  "q": "Which instructions should the nurse include in the teaching? Select all that apply.",
  "opts": [
   {
    "t": "Feed the baby 8 to 12 times in 24 hours, whenever she shows hunger cues",
    "ok": true,
    "why": "Yes: frequent feeding on cue builds milk supply and meets a newborn's small stomach capacity."
   },
   {
    "t": "Bring the baby to the breast when her mouth is open wide so she takes in much of the areola",
    "ok": true,
    "why": "Yes: a deep latch compresses the milk ducts behind the nipple and prevents the friction that causes sore nipples."
   },
   {
    "t": "Slide a clean finger into the corner of the baby's mouth to break the suction before removing her",
    "ok": true,
    "why": "Yes: breaking suction first prevents nipple trauma when the baby comes off the breast or needs to be repositioned."
   },
   {
    "t": "Expect at least 6 wet diapers a day once your milk is in, around day 5",
    "ok": true,
    "why": "Yes: wet diaper count is a practical sign that the baby is getting enough milk; fewer should be reported."
   },
   {
    "t": "Give the baby water between feedings if the weather is hot",
    "ok": false,
    "why": "No: breast milk meets all fluid needs, and water fills the stomach, reduces feeding and can cause low sodium in infants."
   },
   {
    "t": "Limit each feeding to 5 minutes per breast to prevent soreness",
    "ok": false,
    "why": "No: limiting time reduces milk intake and supply. Soreness comes from a poor latch, not from feeding length."
   },
   {
    "t": "Pain that lasts through the whole feeding is normal for the first month",
    "ok": false,
    "why": "No: brief tenderness at latch-on can occur, but pain throughout a feeding signals a poor latch that needs correction."
   }
  ],
  "why": "Breastfeeding teaching focuses on frequent feeding on cue, a deep latch and simple signs of adequate intake such as wet diapers and weight gain. Persistent nipple pain points to a latch problem rather than something to endure. Healthy breastfed infants do not need water.",
  "tip": "For breastfeeding questions, favor answers that support frequent, unrestricted feeding with a good latch, and reject anything that adds water or limits feeding."
 },
 {
  "id": "qb-hp-12",
  "type": "mc",
  "step": "cues",
  "cn": "health",
  "sp": "ms",
  "topic": "Normal aging changes",
  "stem": "A 79-year-old is recovering from pneumonia on the medical unit and is now alert and oriented. Her daughter asks which of her mother's recent changes are a normal part of aging.",
  "q": "Which change reported by the daughter is not expected with normal aging and requires follow-up?",
  "opts": [
   {
    "t": "Over the past 6 months, she has gotten lost twice driving to the grocery store she has used for 20 years",
    "ok": true,
    "why": "Yes: getting lost on a familiar route reflects a decline in memory and spatial function that interferes with daily life. It suggests dementia and needs a cognitive evaluation."
   },
   {
    "t": "She needs brighter light and reading glasses to read",
    "ok": false,
    "why": "No: presbyopia and the need for more light are expected as the lens stiffens and the pupil gets smaller with age."
   },
   {
    "t": "She takes longer to recall names but remembers them later",
    "ok": false,
    "why": "No: slower retrieval of names with later recall is a normal age-related change and does not affect independence."
   },
   {
    "t": "She wakes earlier in the morning and naps in the afternoon",
    "ok": false,
    "why": "No: older adults often have lighter, shorter nighttime sleep and earlier waking. This is expected with aging."
   }
  ],
  "why": "Normal aging brings slower recall, presbyopia and lighter sleep, none of which stop a person from living independently. Getting lost on a familiar route over months is a functional decline that points to a neurocognitive disorder. The nurse should share this with the provider for cognitive screening and address driving safety.",
  "tip": "Ask whether the change interferes with daily function; slowing is normal aging, but loss of everyday abilities needs follow-up."
 },
 {
  "id": "qb-pharm-1",
  "type": "num",
  "step": "solve",
  "cn": "pharm",
  "sp": "sd",
  "topic": "Oral tablet dosage",
  "stem": "A 70-year-old with new-onset atrial fibrillation has an order for metoprolol tartrate 12.5 mg PO every 12 hours. Apical pulse is 84 and BP is 132/80. The pharmacy supplies metoprolol tartrate 25 mg scored tablets.",
  "q": "How many tablets should the nurse give?",
  "ans": 0.5,
  "tol": 0,
  "unit": "tablet",
  "round": "Round to the nearest tenth.",
  "work": [
   "Desired ÷ have × quantity = 12.5 mg ÷ 25 mg × 1 tablet",
   "= 0.5 tablet (half of one scored tablet)"
  ],
  "why": "Use desired over have times quantity. Only scored tablets should be split, and the client's apical pulse and blood pressure are checked first because metoprolol slows the heart and lowers blood pressure.",
  "tip": "Estimate first: the dose is half the tablet strength, so the answer must be less than one tablet."
 },
 {
  "id": "qb-pharm-2",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "IV infusion rate",
  "stem": "A 58-year-old with an infected diabetic foot ulcer has an order for vancomycin 1,000 mg in 250 mL 0.9% sodium chloride IV to infuse over 120 minutes. The infusion will run on an electronic pump.",
  "q": "At what rate should the nurse set the pump?",
  "ans": 125,
  "tol": 0,
  "unit": "mL/h",
  "round": "Round to the nearest whole number.",
  "work": [
   "120 minutes = 2 hours",
   "250 mL ÷ 2 h = 125 mL/h"
  ],
  "why": "Divide the total volume by the infusion time in hours. Vancomycin runs over at least 60 minutes and no faster than 10 mg/min, so 1,000 mg needs at least 100 minutes; a fast rate causes the flushing and itching of a vancomycin infusion reaction.",
  "tip": "Convert minutes to hours before dividing whenever the answer must be in mL/h."
 },
 {
  "id": "qb-pharm-3",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "icu",
  "topic": "Norepinephrine mcg/kg/min",
  "stem": "A 64-year-old in septic shock weighs 80 kg. After 30 mL/kg of crystalloid, MAP is 58 mm Hg. The provider orders norepinephrine 0.05 mcg/kg/min through the central line. The premixed bag contains norepinephrine 4 mg in 250 mL D5W.",
  "q": "At what rate should the nurse set the pump?",
  "ans": 15,
  "tol": 0.1,
  "unit": "mL/h",
  "round": "Round to the nearest tenth.",
  "work": [
   "Concentration: 4 mg = 4,000 mcg; 4,000 mcg ÷ 250 mL = 16 mcg/mL",
   "Dose: 0.05 mcg/kg/min × 80 kg = 4 mcg/min; 4 mcg/min × 60 min = 240 mcg/h",
   "Rate: 240 mcg/h ÷ 16 mcg/mL = 15 mL/h"
  ],
  "why": "Convert the drug to mcg per mL, find the hourly dose for this client's weight, then divide by the concentration. Norepinephrine is a high-alert vasopressor, so the pump uses the drug library and a second nurse checks the setting.",
  "tip": "Write the units on every line; mg must become mcg and minutes must become hours before the units cancel to mL/h."
 },
 {
  "id": "qb-pharm-4",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "sd",
  "topic": "Heparin units to mL/h",
  "stem": "A 52-year-old with a new deep vein thrombosis weighs 90 kg. After the bolus, the weight-based protocol calls for a continuous heparin infusion of 18 units/kg/h. The premixed bag contains heparin 25,000 units in 500 mL D5W.",
  "q": "At what rate should the nurse set the pump?",
  "ans": 32.4,
  "tol": 0.1,
  "unit": "mL/h",
  "round": "Round to the nearest tenth.",
  "work": [
   "Concentration: 25,000 units ÷ 500 mL = 50 units/mL",
   "Dose: 18 units/kg/h × 90 kg = 1,620 units/h",
   "Rate: 1,620 units/h ÷ 50 units/mL = 32.4 mL/h"
  ],
  "why": "Find the hourly dose from the weight, then divide by the bag concentration. Heparin is a high-alert medication: an independent double check of the order, weight, concentration and pump setting is required, and the aPTT or anti-Xa is drawn on the protocol schedule.",
  "tip": "Check that the bag concentration on the label matches the one in your math; heparin comes in more than one premixed strength."
 },
 {
  "id": "qb-pharm-5",
  "type": "num",
  "step": "solve",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Drops per minute",
  "stem": "A 46-year-old admitted with dehydration has an order for lactated Ringer's 1,000 mL IV over 8 hours. No pump is available, so the infusion will run by gravity. The administration set delivers 15 gtt/mL.",
  "q": "How many drops per minute should the nurse regulate the infusion to?",
  "ans": 31,
  "tol": 0,
  "unit": "gtt/min",
  "round": "Round to the nearest whole number.",
  "work": [
   "mL/h: 1,000 mL ÷ 8 h = 125 mL/h",
   "gtt/min: 125 mL/h × 15 gtt/mL ÷ 60 min = 31.25 gtt/min",
   "Round to the nearest whole drop: 31 gtt/min"
  ],
  "why": "Drops per minute equals volume times drop factor divided by time in minutes. You cannot count part of a drop, so round to a whole number. Gravity infusions drift, so recheck the rate often.",
  "tip": "Remember the shortcut: with a 15 gtt/mL set, divide the mL/h rate by 4."
 },
 {
  "id": "qb-pharm-6",
  "type": "num",
  "step": "analyze",
  "cn": "pharm",
  "sp": "peds",
  "topic": "Pediatric safe dose",
  "stem": "A 4-year-old weighing 16 kg has a fever of 38.9 °C (102 °F). The order is acetaminophen 240 mg PO every 6 hours as needed. The safe dose range is 10 to 15 mg/kg/dose. The bottle is labeled acetaminophen oral suspension 160 mg/5 mL.",
  "q": "After confirming the dose is within the safe range, how many mL should the nurse give?",
  "ans": 7.5,
  "tol": 0,
  "unit": "mL",
  "round": "Round to the nearest tenth.",
  "work": [
   "Safe range: 10 mg/kg × 16 kg = 160 mg; 15 mg/kg × 16 kg = 240 mg",
   "Ordered dose 240 mg is within 160 to 240 mg, so it is safe to give",
   "Volume: 240 mg ÷ 160 mg × 5 mL = 7.5 mL"
  ],
  "why": "Always check a pediatric dose against the weight-based range before calculating the volume. This order sits at the top of the range, so it is safe. Measure the liquid with an oral syringe, not a household spoon.",
  "tip": "If a pediatric dose falls outside the safe range, the correct action is to hold and clarify, not to calculate."
 },
 {
  "id": "qb-pharm-7",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ob",
  "topic": "IV push volume",
  "stem": "A 31-year-old at 36 weeks with preeclampsia has BP 166/112 on two readings 15 minutes apart. The provider orders labetalol 20 mg IV push over 2 minutes. The vial is labeled labetalol 5 mg/mL.",
  "q": "How many mL should the nurse draw up?",
  "ans": 4,
  "tol": 0,
  "unit": "mL",
  "round": "Round to the nearest tenth.",
  "work": [
   "Desired ÷ have × quantity = 20 mg ÷ 5 mg × 1 mL",
   "= 4 mL, given slowly over 2 minutes"
  ],
  "why": "Desired over have times volume gives the IV push amount. Labetalol is a first-line drug for severe hypertension in pregnancy; it is avoided in clients with asthma, and blood pressure and heart rate are rechecked after each dose.",
  "tip": "Estimate first: each mL holds 5 mg, so 20 mg must be 4 mL; if your answer is far from the estimate, recheck the setup."
 },
 {
  "id": "qb-pharm-8",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "icu",
  "topic": "Insulin infusion rate",
  "stem": "A 24-year-old with type 1 diabetes is admitted in diabetic ketoacidosis and weighs 72 kg. Glucose is 486 mg/dL and potassium is 4.2 mEq/L. The order is regular insulin infusion at 0.1 units/kg/h. The bag contains regular insulin 100 units in 100 mL 0.9% sodium chloride.",
  "q": "At what rate should the nurse set the pump?",
  "ans": 7.2,
  "tol": 0,
  "unit": "mL/h",
  "round": "Round to the nearest tenth.",
  "work": [
   "Concentration: 100 units ÷ 100 mL = 1 unit/mL",
   "Dose: 0.1 units/kg/h × 72 kg = 7.2 units/h",
   "Rate: 7.2 units/h ÷ 1 unit/mL = 7.2 mL/h"
  ],
  "why": "Multiply the weight by the ordered units per kg, then divide by the concentration. Potassium must be at least 3.5 mEq/L before insulin starts, because insulin drives potassium into the cells. Insulin is high alert, so a second nurse verifies the rate.",
  "tip": "With a 1 unit/mL bag, units/h and mL/h are the same number, which makes a quick check easy."
 },
 {
  "id": "qb-pharm-9",
  "type": "mc",
  "step": "cues",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Potassium chloride safety",
  "stem": "A 67-year-old with heart failure has a potassium level of 3.1 mEq/L. The nurse reviews the new orders entered during the night on the medication administration record.",
  "q": "Which order should the nurse clarify with the provider before giving any dose?",
  "opts": [
   {
    "t": "Potassium chloride 20 mEq IV push now",
    "ok": true,
    "why": "Yes: Concentrated potassium is never given IV push; a bolus can cause fatal dysrhythmias and cardiac arrest. It must be diluted and given on a pump."
   },
   {
    "t": "Potassium chloride 10 mEq in 100 mL IV over 1 hour through the peripheral line",
    "ok": false,
    "why": "No: 10 mEq/h through a peripheral line on a pump is a standard, safe rate for replacement, with cardiac monitoring per policy."
   },
   {
    "t": "Metoprolol succinate 25 mg PO daily; hold for apical pulse below 60 or systolic BP below 100",
    "ok": false,
    "why": "No: A low starting dose of a heart failure beta blocker with clear hold parameters is a complete, safe order that needs no clarification."
   },
   {
    "t": "Enoxaparin 40 mg subcut daily",
    "ok": false,
    "why": "No: This is a standard prophylactic dose for venous thromboembolism. Nothing in the order is unsafe for this client."
   }
  ],
  "why": "ISMP lists IV potassium chloride as a high-alert medication. It is never given IV push or IV bolus; it is diluted and infused on a pump, usually no faster than 10 mEq/h on a peripheral line. Any order for IV push potassium must be clarified.",
  "tip": "Memorize the short list of drugs that are never pushed IV, and potassium chloride is the first one on it."
 },
 {
  "id": "qb-pharm-10",
  "type": "mc",
  "step": "solve",
  "cn": "pharm",
  "sp": "comm",
  "topic": "Warfarin and high INR",
  "stem": "A 72-year-old with atrial fibrillation takes warfarin 5 mg daily, with an INR goal of 2 to 3. At the anticoagulation clinic today, the INR is 5.4. She has no bleeding, bruising or dark stools. She recently finished a course of an antibiotic.",
  "q": "Which order should the nurse anticipate?",
  "opts": [
   {
    "t": "Hold warfarin and recheck the INR in 1 to 2 days",
    "ok": true,
    "why": "Yes: For an INR between 4.5 and 10 without bleeding, the usual plan is to hold warfarin and recheck, then resume at an adjusted dose."
   },
   {
    "t": "Give vitamin K 10 mg IV now",
    "ok": false,
    "why": "No: High-dose IV vitamin K is reserved for major bleeding. Giving it here can overcorrect the INR and expose her to a stroke from atrial fibrillation."
   },
   {
    "t": "Give protamine sulfate IV now",
    "ok": false,
    "why": "No: Protamine reverses heparin, not warfarin. The trap is mixing up the two antidotes."
   },
   {
    "t": "Take the usual dose and recheck the INR in 4 weeks",
    "ok": false,
    "why": "No: An INR of 5.4 is well above goal and raises the risk of bleeding; continuing the same dose is unsafe."
   }
  ],
  "why": "An elevated INR without bleeding is managed by holding warfarin and rechecking closely. Vitamin K is added for higher INRs or bleeding, and IV vitamin K with clotting factors is for major bleeding. Many antibiotics raise the INR, so the nurse also reviews new medications.",
  "tip": "Match the antidote to the drug: vitamin K for warfarin, protamine for heparin."
 },
 {
  "id": "qb-pharm-11",
  "type": "mc",
  "step": "hypo",
  "cn": "pharm",
  "sp": "sd",
  "topic": "Digoxin toxicity",
  "stem": "A 78-year-old with heart failure takes digoxin 0.125 mg and furosemide 40 mg daily. He reports 2 days of nausea and poor appetite and says the lights look like they have yellow halos. Apical pulse is 52 and irregular. Potassium is 3.0 mEq/L; digoxin level is 2.4 ng/mL.",
  "q": "Which explanation is most likely?",
  "opts": [
   {
    "t": "Digoxin toxicity made more likely by low potassium",
    "ok": true,
    "why": "Yes: Nausea, visual halos and bradycardia with a high digoxin level point to toxicity. Hypokalemia from the diuretic increases digoxin's effect on the heart."
   },
   {
    "t": "Viral gastroenteritis",
    "ok": false,
    "why": "No: A virus does not explain yellow halos, a slow irregular pulse or a high drug level. The trap is stopping at the GI symptoms."
   },
   {
    "t": "Expected slowing of the heart rate from a therapeutic dose",
    "ok": false,
    "why": "No: A level of 2.4 ng/mL is above the therapeutic range, and visual changes are never an expected effect."
   },
   {
    "t": "Worsening heart failure from too little digoxin",
    "ok": false,
    "why": "No: The level is high, not low, and the findings are classic toxicity rather than fluid overload."
   }
  ],
  "why": "Early digoxin toxicity shows up as GI upset, visual changes and new bradycardia or dysrhythmias. Low potassium, often caused by loop diuretics, makes toxicity more likely. Hold the dose, notify the provider and expect potassium replacement and cardiac monitoring.",
  "tip": "When a client takes digoxin with a loop diuretic, always look at the potassium level alongside the digoxin level."
 },
 {
  "id": "qb-pharm-12",
  "type": "mc",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Hypoglycemia rule of 15",
  "stem": "A 58-year-old with type 2 diabetes receives insulin glargine at bedtime and insulin lispro with meals. At 11:00 she is shaky and sweaty. Capillary glucose is 58 mg/dL. She is alert, follows commands and swallows normally. Lunch arrives in 1 hour.",
  "q": "Which action should the nurse take first?",
  "opts": [
   {
    "t": "Give 4 oz (120 mL) of fruit juice and recheck glucose in 15 minutes",
    "ok": true,
    "why": "Yes: An alert client who can swallow gets 15 g of fast-acting carbohydrate, then a recheck in 15 minutes. Repeat if glucose is still below 70 mg/dL."
   },
   {
    "t": "Give 50% dextrose IV push",
    "ok": false,
    "why": "No: IV dextrose is for a client who cannot safely swallow. She can take oral carbohydrate, which is faster to give and safer."
   },
   {
    "t": "Give glucagon 1 mg IM",
    "ok": false,
    "why": "No: Glucagon is for a client who is unconscious or cannot swallow and has no IV access. It is not first line here."
   },
   {
    "t": "Give cheese and crackers with a glass of whole milk",
    "ok": false,
    "why": "No: Fat and protein slow glucose absorption. A snack with protein is useful after the glucose recovers, not as the first treatment."
   }
  ],
  "why": "The rule of 15 treats mild to moderate hypoglycemia: 15 g of fast-acting carbohydrate, recheck in 15 minutes, and repeat until glucose is at least 70 mg/dL. Then give a snack or meal to prevent a repeat drop, and report the episode.",
  "tip": "Pick the least invasive treatment that matches the client's ability to swallow."
 },
 {
  "id": "qb-pharm-13",
  "type": "mc",
  "step": "hypo",
  "cn": "pharm",
  "sp": "comm",
  "topic": "ACE inhibitor angioedema",
  "stem": "A 61-year-old started lisinopril 10 mg daily 3 weeks ago. At a clinic visit he reports a dry, tickling cough, feeling lightheaded when he stands quickly, and that his lips and tongue felt puffy this morning. His voice sounds hoarse. BP is 128/78.",
  "q": "Which finding is the priority for the nurse to act on?",
  "opts": [
   {
    "t": "Lip and tongue swelling with a hoarse voice",
    "ok": true,
    "why": "Yes: This is angioedema, a life-threatening ACE inhibitor reaction. Hoarseness suggests the larynx is involved, so the airway is at risk right now."
   },
   {
    "t": "Dry, tickling cough",
    "ok": false,
    "why": "No: A dry cough is a common ACE inhibitor effect from bradykinin. It is reported and may lead to a drug change, but it does not threaten the airway."
   },
   {
    "t": "Lightheaded when standing quickly",
    "ok": false,
    "why": "No: Orthostatic dizziness is expected early in therapy; teach him to rise slowly. It is not the most urgent problem."
   },
   {
    "t": "BP 128/78",
    "ok": false,
    "why": "No: This blood pressure is at goal and shows the drug is working, so it needs no action."
   }
  ],
  "why": "Angioedema can occur at any point during ACE inhibitor therapy, even after weeks. Swelling of the lips, tongue or throat is an airway emergency: stop the drug, activate emergency response and monitor the airway. The client should not take any ACE inhibitor again.",
  "tip": "When several findings are listed, an airway threat outranks bothersome but stable adverse effects."
 },
 {
  "id": "qb-pharm-14",
  "type": "mc",
  "step": "eval",
  "cn": "pharm",
  "sp": "periop",
  "topic": "Naloxone and renarcotization",
  "stem": "In the PACU, a 70-year-old who received IV hydromorphone after hip surgery had RR 6 and SpO₂ 84% and responded only to a sternal rub. Naloxone 0.04 mg IV was given per protocol. Two minutes later he was awake with RR 14 and SpO₂ 95% on 2 L.",
  "q": "Forty-five minutes later, which finding requires the nurse's immediate follow-up?",
  "opts": [
   {
    "t": "RR 9 and he falls asleep in the middle of a sentence",
    "ok": true,
    "why": "Yes: Naloxone wears off in 30 to 90 minutes, often before the opioid does, so respiratory depression can return. This needs repeat assessment and treatment now."
   },
   {
    "t": "He rates his hip pain 6 on a 0 to 10 scale",
    "ok": false,
    "why": "No: Some pain is expected when an opioid is reversed. It needs a careful plan, but it is not the immediate safety threat."
   },
   {
    "t": "BP 142/86 and HR 96",
    "ok": false,
    "why": "No: A modest rise in blood pressure and heart rate is common after reversal and pain return. It is not the priority here."
   },
   {
    "t": "He reports mild nausea",
    "ok": false,
    "why": "No: Nausea is common after anesthesia and opioid reversal. It deserves treatment, but it does not threaten breathing."
   }
  ],
  "why": "Naloxone has a shorter duration than most opioids, so clients are monitored closely for at least the expected duration of the opioid. Small, titrated doses restore breathing without causing severe pain or withdrawal. Sedation usually comes before respiratory depression, so increasing sleepiness is an early warning.",
  "tip": "After giving an antidote, ask which lasts longer, the drug or the antidote, and watch for the problem to come back."
 },
 {
  "id": "qb-pharm-15",
  "type": "mc",
  "step": "analyze",
  "cn": "pharm",
  "sp": "ed",
  "topic": "Lithium toxicity",
  "stem": "A 34-year-old with bipolar disorder takes lithium 300 mg three times daily. After 3 days of vomiting and diarrhea she arrives at the ED with a coarse hand tremor, an unsteady gait, slurred speech and confusion. Her lithium level is 2.2 mEq/L.",
  "q": "The nurse recognizes that these findings are most consistent with which condition?",
  "opts": [
   {
    "t": "Lithium toxicity",
    "ok": true,
    "why": "Yes: The level is well above the usual maintenance range of 0.6 to 1.2 mEq/L, and coarse tremor, ataxia, slurred speech and confusion are classic toxicity signs."
   },
   {
    "t": "Expected adverse effects at a therapeutic level",
    "ok": false,
    "why": "No: A fine hand tremor can occur at therapeutic levels, but a coarse tremor, ataxia and confusion cannot. The level is also clearly high."
   },
   {
    "t": "An acute manic episode",
    "ok": false,
    "why": "No: Mania causes racing thoughts and high energy, not ataxia, slurred speech and a lithium level of 2.2 mEq/L."
   },
   {
    "t": "Serotonin syndrome",
    "ok": false,
    "why": "No: Serotonin syndrome follows serotonergic drugs and causes hyperthermia, clonus and agitation. Nothing in the stem suggests it."
   }
  ],
  "why": "Lithium has a narrow therapeutic range and is cleared by the kidneys along with sodium. Vomiting and diarrhea cause dehydration and sodium loss, so the kidneys hold onto lithium and the level rises. Hold lithium, notify the provider and expect IV fluids; severe cases may need dialysis.",
  "tip": "For lithium, connect any cause of fluid or sodium loss to a rising level."
 },
 {
  "id": "qb-pharm-16",
  "type": "mc",
  "step": "eval",
  "cn": "pharm",
  "sp": "psy",
  "topic": "MAOI and tyramine",
  "stem": "A 48-year-old with treatment-resistant depression is starting phenelzine. After diet teaching, the nurse asks him to choose a lunch from the hospital menu.",
  "q": "Which choice indicates the client understands the teaching?",
  "opts": [
   {
    "t": "Fresh grilled chicken, a baked potato and steamed carrots",
    "ok": true,
    "why": "Yes: Fresh meat and fresh vegetables are low in tyramine and safe with an MAOI."
   },
   {
    "t": "A salami sandwich with aged cheddar cheese",
    "ok": false,
    "why": "No: Cured meats and aged cheese are high in tyramine and can trigger a hypertensive crisis with an MAOI."
   },
   {
    "t": "Stir-fried tofu with soy sauce and a bowl of miso soup",
    "ok": false,
    "why": "No: Soy sauce and miso are fermented soy products high in tyramine. The trap is thinking only of cheese and wine."
   },
   {
    "t": "Smoked herring with sauerkraut",
    "ok": false,
    "why": "No: Smoked or pickled fish and fermented cabbage are high in tyramine and are avoided while taking an MAOI."
   }
  ],
  "why": "MAOIs block the breakdown of tyramine, so tyramine-rich foods can cause a sudden, severe rise in blood pressure with an occipital headache. Avoid aged, cured, fermented, smoked or spoiled foods and tap beer. The restriction continues for 2 weeks after stopping the drug.",
  "tip": "For MAOI diet items, look for words such as aged, cured, smoked, pickled or fermented; fresh is safe."
 },
 {
  "id": "qb-pharm-17",
  "type": "mc",
  "step": "analyze",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Vancomycin infusion reaction",
  "stem": "A 45-year-old with cellulitis is 20 minutes into the first dose of IV vancomycin. He reports itching, and his face, neck and upper chest are flushed red. BP is 118/74 (baseline 122/78), HR 92, SpO₂ 97% on room air. Lungs are clear and he denies throat tightness.",
  "q": "The nurse recognizes these findings are most consistent with which problem?",
  "opts": [
   {
    "t": "Vancomycin infusion reaction",
    "ok": true,
    "why": "Yes: Flushing and itching of the face, neck and upper body during a vancomycin infusion is a histamine release reaction linked to a fast rate. It is not a true allergy."
   },
   {
    "t": "Anaphylaxis",
    "ok": false,
    "why": "No: Anaphylaxis involves the airway or circulation, such as wheezing, throat tightness or hypotension. His vital signs and breathing are stable."
   },
   {
    "t": "Stevens-Johnson syndrome",
    "ok": false,
    "why": "No: This severe skin reaction develops days into therapy with blistering and mucosal sores, not flushing minutes into an infusion."
   },
   {
    "t": "Clostridioides difficile infection",
    "ok": false,
    "why": "No: C. difficile causes watery diarrhea after antibiotic exposure, not flushing during an infusion."
   }
  ],
  "why": "Vancomycin infusion reaction, formerly called red man syndrome, is caused by histamine release when the drug runs too fast. Stop the infusion, notify the provider, give an antihistamine as ordered and restart at a slower rate. Watch for signs that would point instead to anaphylaxis.",
  "tip": "Separate a rate-related reaction from anaphylaxis by checking the airway, breathing and blood pressure."
 },
 {
  "id": "qb-pharm-18",
  "type": "sata",
  "step": "act",
  "cn": "pharm",
  "sp": "sd",
  "topic": "Heparin and bleeding",
  "stem": "A 66-year-old with a pulmonary embolism is on a continuous heparin infusion. The 14:00 aPTT is 152 seconds; the protocol goal is 60 to 100 seconds. Blood is oozing from her IV site and she has new bruises on her arms. BP is 104/64 (earlier 124/78) and HR 108 (earlier 88).",
  "q": "Which actions should the nurse take? Select all that apply.",
  "opts": [
   {
    "t": "Stop the heparin infusion",
    "ok": true,
    "why": "Yes: The aPTT is far above goal and she shows signs of active bleeding, so the infusion stops now."
   },
   {
    "t": "Notify the provider of the aPTT, bleeding and vital sign changes",
    "ok": true,
    "why": "Yes: A falling blood pressure and rising heart rate with bleeding need prompt provider evaluation and new orders."
   },
   {
    "t": "Apply pressure to the oozing IV site",
    "ok": true,
    "why": "Yes: Direct pressure controls local bleeding while the anticoagulant effect wears off."
   },
   {
    "t": "Assess for black stools, blood in the urine and changes in level of consciousness",
    "ok": true,
    "why": "Yes: Hidden bleeding in the gut, urinary tract or brain is the main danger, and the vital signs suggest blood loss."
   },
   {
    "t": "Prepare to give protamine sulfate if prescribed",
    "ok": true,
    "why": "Yes: Protamine is the antidote for heparin and may be ordered when bleeding is significant."
   },
   {
    "t": "Give vitamin K as the antidote",
    "ok": false,
    "why": "No: Vitamin K reverses warfarin, not heparin. The trap is confusing the two antidotes."
   },
   {
    "t": "Restart the infusion at half the rate in 1 hour without contacting the provider",
    "ok": false,
    "why": "No: Protocol rate changes do not cover active bleeding with hemodynamic changes; the provider must decide whether and how to resume."
   }
  ],
  "why": "Heparin's short half-life means stopping the infusion begins reversal within hours. With active bleeding, low blood pressure and a very high aPTT, the nurse stops the drug, controls bleeding, searches for hidden bleeding and notifies the provider. Protamine is given for significant bleeding.",
  "tip": "When an anticoagulant client is bleeding, stop the drug first, then assess and escalate."
 },
 {
  "id": "qb-pharm-19",
  "type": "sata",
  "step": "eval",
  "cn": "pharm",
  "sp": "comm",
  "topic": "DOAC teaching",
  "stem": "A 69-year-old with atrial fibrillation is starting apixaban 5 mg twice daily. The home health nurse reviews the medication teaching at the next visit.",
  "q": "Which statements indicate the client understands the teaching? Select all that apply.",
  "opts": [
   {
    "t": "I will tell my dentist and any other provider that I take a blood thinner.",
    "ok": true,
    "why": "Yes: Procedures may need planning around apixaban because of bleeding risk, so every provider should know."
   },
   {
    "t": "If my stool turns black or my urine looks pink, I will call right away.",
    "ok": true,
    "why": "Yes: These are signs of internal bleeding, the most serious adverse effect of a DOAC."
   },
   {
    "t": "I will not stop taking this medicine unless my provider tells me to.",
    "ok": true,
    "why": "Yes: Stopping a DOAC suddenly raises the risk of stroke in atrial fibrillation."
   },
   {
    "t": "I will ask the pharmacist before taking an over-the-counter pain reliever.",
    "ok": true,
    "why": "Yes: NSAIDs such as ibuprofen and naproxen add to bleeding risk with anticoagulants."
   },
   {
    "t": "I will need monthly INR blood tests to adjust my dose.",
    "ok": false,
    "why": "No: Apixaban does not require INR monitoring. The trap is applying warfarin teaching to a DOAC."
   },
   {
    "t": "I should avoid spinach and other green leafy vegetables.",
    "ok": false,
    "why": "No: Vitamin K foods matter with warfarin, not apixaban. Consistent vitamin K intake is warfarin teaching."
   },
   {
    "t": "If I miss a dose, I will take two at the next dose time.",
    "ok": false,
    "why": "No: A missed dose is taken as soon as remembered the same day; doubling the dose increases bleeding risk."
   }
  ],
  "why": "DOACs such as apixaban do not need routine INR checks and have no vitamin K diet restriction, which sets them apart from warfarin. Teaching focuses on taking every dose, never doubling, recognizing bleeding, avoiding NSAIDs and telling every provider.",
  "tip": "When you see a DOAC, cross off any option that belongs to warfarin, such as INR checks or vitamin K diet."
 },
 {
  "id": "qb-pharm-20",
  "type": "sata",
  "step": "solve",
  "cn": "pharm",
  "sp": "ob",
  "topic": "Blood transfusion safety",
  "stem": "A 29-year-old had a postpartum hemorrhage after a vaginal birth. Hemoglobin is 6.8 g/dL. She has consented to 2 units of packed red blood cells. Lactated Ringer's with oxytocin is infusing through her 18-gauge IV.",
  "q": "Which actions should the nurse include in the plan for the transfusion? Select all that apply.",
  "opts": [
   {
    "t": "Verify the client and the blood unit at the bedside with a second qualified licensed staff member using two identifiers",
    "ok": true,
    "why": "Yes: Bedside two-person verification is the key safeguard against giving the wrong blood, the main cause of acute hemolytic reactions."
   },
   {
    "t": "Prime a filtered blood administration set with 0.9% sodium chloride only",
    "ok": true,
    "why": "Yes: Normal saline is the only solution compatible with red cells; the filter removes clots and debris."
   },
   {
    "t": "Take baseline vital signs and stay with the client for the first 15 minutes",
    "ok": true,
    "why": "Yes: Most severe reactions begin early, so close observation and a slow start during the first 15 minutes are standard."
   },
   {
    "t": "Complete each unit within 4 hours of leaving the blood bank",
    "ok": true,
    "why": "Yes: After 4 hours at room temperature, bacterial growth in the unit becomes a risk."
   },
   {
    "t": "Run the blood through the lactated Ringer's line to save time",
    "ok": false,
    "why": "No: The calcium in lactated Ringer's can clot the blood in the tubing; use saline only."
   },
   {
    "t": "Warm the blood in a microwave if she feels cold",
    "ok": false,
    "why": "No: Microwaving damages red cells and causes hemolysis. Only an approved blood warmer is used."
   },
   {
    "t": "Prime the tubing with D5W",
    "ok": false,
    "why": "No: Dextrose solutions make red cells swell and break apart."
   }
  ],
  "why": "Safe transfusion depends on correct identification, the right tubing and solution, and close early monitoring. Blood is given only with 0.9% sodium chloride, through a filter, within 4 hours, with the nurse watching the client closely during the first 15 minutes.",
  "tip": "For blood questions, remember: two people, two identifiers, saline only, stay 15 minutes, finish in 4 hours."
 },
 {
  "id": "qb-pharm-21",
  "type": "sata",
  "step": "cues",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Aminoglycosides and C. difficile",
  "stem": "A 70-year-old weighing 60 kg is on day 6 of IV gentamicin and ceftriaxone for sepsis from pyelonephritis. Today: T 37.0 °C (98.6 °F), down from 38.9 °C (102 °F) on admission; BP 124/76; WBC 9,800/mm³, down from 16,000. Creatinine is 1.8 mg/dL (admission 1.0). Urine output has been 20 mL/h for 3 hours. She says her ears are ringing and she has had 4 watery stools with cramping since yesterday.",
  "q": "Which findings require follow-up? Select all that apply.",
  "opts": [
   {
    "t": "Creatinine 1.8 mg/dL, up from 1.0",
    "ok": true,
    "why": "Yes: A rising creatinine signals kidney injury, a classic aminoglycoside toxicity; the dose or drug may need to change."
   },
   {
    "t": "Urine output 20 mL/h for 3 hours",
    "ok": true,
    "why": "Yes: Output below 0.5 mL/kg/h (30 mL/h for 60 kg) supports acute kidney injury and needs prompt reporting."
   },
   {
    "t": "Ringing in her ears",
    "ok": true,
    "why": "Yes: Tinnitus signals ototoxicity, which can become permanent hearing loss if the drug continues."
   },
   {
    "t": "Four watery stools with cramping since yesterday",
    "ok": true,
    "why": "Yes: New diarrhea during antibiotic therapy raises concern for C. difficile; she needs testing and contact precautions."
   },
   {
    "t": "Temperature 37.0 °C (98.6 °F)",
    "ok": false,
    "why": "No: The fever has resolved, which shows the infection is responding to treatment."
   },
   {
    "t": "WBC 9,800/mm³",
    "ok": false,
    "why": "No: The white count is now normal and falling from 16,000, an expected response to treatment."
   },
   {
    "t": "BP 124/76",
    "ok": false,
    "why": "No: Blood pressure is stable and within normal limits, so it needs no follow-up."
   }
  ],
  "why": "Aminoglycosides such as gentamicin can damage the kidneys and the inner ear, so creatinine, urine output, trough levels, hearing and balance are monitored. Any broad antibiotic course also raises the risk of C. difficile. Improving fever and white count show the infection is responding.",
  "tip": "For aminoglycosides, think kidneys and ears; for any antibiotic, think C. difficile when diarrhea appears."
 },
 {
  "id": "qb-pharm-22",
  "type": "sata",
  "step": "cues",
  "cn": "pharm",
  "sp": "psy",
  "topic": "Neuroleptic malignant syndrome",
  "stem": "A 42-year-old with schizophrenia started haloperidol 3 days ago. This morning: T 39.4 °C (102.9 °F), BP 168/98 and 30 minutes later 104/62, HR 124, heavy sweating. His arms resist movement evenly through the full range. He is newly confused about where he is. He also has a dry mouth and slept 9 hours last night.",
  "q": "Which findings require immediate follow-up? Select all that apply.",
  "opts": [
   {
    "t": "Temperature 39.4 °C (102.9 °F)",
    "ok": true,
    "why": "Yes: High fever with an antipsychotic is a cardinal sign of neuroleptic malignant syndrome, a medical emergency."
   },
   {
    "t": "Lead-pipe rigidity of the arms",
    "ok": true,
    "why": "Yes: Severe, even muscle rigidity is a defining feature of neuroleptic malignant syndrome and drives a rising CK and kidney injury."
   },
   {
    "t": "Blood pressure swinging from 168/98 to 104/62 with heavy sweating",
    "ok": true,
    "why": "Yes: Autonomic instability, with labile blood pressure, tachycardia and diaphoresis, is part of the syndrome."
   },
   {
    "t": "New confusion about where he is",
    "ok": true,
    "why": "Yes: An altered level of consciousness is a core sign and shows the syndrome is affecting the brain."
   },
   {
    "t": "Dry mouth",
    "ok": false,
    "why": "No: Dry mouth is a common, mild anticholinergic effect treated with sips of water and sugar-free gum."
   },
   {
    "t": "Slept 9 hours last night",
    "ok": false,
    "why": "No: Sedation and longer sleep are common with antipsychotics and are not a sign of an emergency."
   }
  ],
  "why": "Neuroleptic malignant syndrome presents with fever, rigidity, autonomic instability and altered mental status, usually early in therapy or after a dose increase. Stop the antipsychotic, notify the provider, cool the client and expect labs such as CK. Mild anticholinergic effects and sedation are expected.",
  "tip": "For any antipsychotic client with fever, check for rigidity and confusion before calling it an infection."
 },
 {
  "id": "qb-pharm-23",
  "type": "matrix",
  "step": "analyze",
  "cn": "pharm",
  "sp": "icu",
  "topic": "IV site complications",
  "stem": "The nurse assesses the peripheral IV sites of several clients in the ICU at the start of the shift.",
  "q": "For each finding, indicate whether it is most consistent with infiltration, phlebitis or extravasation.",
  "cols": [
   "Infiltration",
   "Phlebitis",
   "Extravasation"
  ],
  "rows": [
   {
    "t": "Forearm site with 0.9% sodium chloride: skin cool, pale and swollen; the infusion has slowed",
    "ans": 0,
    "why": "a nonvesicant fluid leaking into the tissue causes cool, pale swelling and a slowing flow."
   },
   {
    "t": "Red streak running up the vein from the site, warm and tender, with a firm cord",
    "ans": 1,
    "why": "inflammation of the vein wall causes redness, warmth and tenderness along its path."
   },
   {
    "t": "Hand site with norepinephrine: skin blanched and cold, client reports burning",
    "ans": 2,
    "why": "norepinephrine is a vesicant; leaking into tissue causes vasoconstriction and can lead to tissue necrosis."
   },
   {
    "t": "Antecubital site with lactated Ringer's: puffy, tight skin, no pain, blood return absent",
    "ans": 0,
    "why": "a nonirritating fluid in the tissue causes swelling without much pain. The trap is calling all leaking fluid extravasation."
   },
   {
    "t": "Site used for IV vancomycin for 3 days: redness and tenderness along the vein",
    "ans": 1,
    "why": "vancomycin irritates the vein wall, and the signs follow the vein rather than spreading into the tissue."
   },
   {
    "t": "Blisters and darkening skin near a site where dopamine was infusing",
    "ans": 2,
    "why": "dopamine is a vesicant, and blistering and dark skin show tissue damage from extravasation."
   }
  ],
  "why": "Infiltration is leakage of a nonvesicant fluid into the tissue. Extravasation is leakage of a vesicant, such as vasopressors or some chemotherapy, and can destroy tissue. Phlebitis is inflammation of the vein itself. For any of them, stop the infusion; for extravasation, follow the antidote protocol, such as phentolamine for norepinephrine.",
  "tip": "Ask what is leaking: a vesicant makes it extravasation, a plain fluid makes it infiltration, and no leak with a red vein is phlebitis."
 },
 {
  "id": "qb-pharm-24",
  "type": "matrix",
  "step": "act",
  "cn": "pharm",
  "sp": "sd",
  "topic": "Antihypertensive hold parameters",
  "stem": "It is 09:00 on the telemetry unit. Orders state: hold metoprolol for apical pulse below 60 or systolic BP below 100. The nurse reviews data for several clients before giving scheduled medications.",
  "q": "For each medication, indicate whether the nurse should give it as scheduled or hold it and notify the provider.",
  "cols": [
   "Give as scheduled",
   "Hold and notify the provider"
  ],
  "rows": [
   {
    "t": "Metoprolol tartrate 25 mg PO: apical pulse 52, BP 102/64",
    "ans": 1,
    "why": "the pulse is below the hold parameter, and a beta blocker would slow it further."
   },
   {
    "t": "Metoprolol tartrate 25 mg PO: apical pulse 76, BP 138/84",
    "ans": 0,
    "why": "both values are above the hold parameters, so the dose is safe and needed."
   },
   {
    "t": "Lisinopril 10 mg PO: potassium 5.8 mEq/L",
    "ans": 1,
    "why": "ACE inhibitors raise potassium, and a level of 5.8 mEq/L risks dysrhythmias."
   },
   {
    "t": "Lisinopril 10 mg PO: BP 134/82, potassium 4.4 mEq/L, creatinine unchanged",
    "ans": 0,
    "why": "blood pressure, potassium and kidney function are all acceptable."
   },
   {
    "t": "Furosemide 40 mg PO: potassium 3.0 mEq/L",
    "ans": 1,
    "why": "a loop diuretic wastes potassium, so it is held until the provider addresses the low level. The trap is giving it because the client is edematous."
   },
   {
    "t": "Furosemide 40 mg PO: potassium 4.1 mEq/L, BP 128/76, weight up 1.5 kg",
    "ans": 0,
    "why": "the electrolytes and blood pressure are safe, and the weight gain is the reason the diuretic is needed."
   }
  ],
  "why": "Before each cardiovascular drug, check the value that drug affects most: heart rate and blood pressure for beta blockers, potassium and kidney function for ACE inhibitors, and potassium and blood pressure for loop diuretics. Hold and report when a value crosses a safety limit.",
  "tip": "Link each drug to the lab or vital sign it changes, then check that value before giving it."
 },
 {
  "id": "qb-pharm-25",
  "type": "matrix",
  "step": "solve",
  "cn": "pharm",
  "sp": "comm",
  "topic": "TPN safety",
  "stem": "A 55-year-old with short bowel syndrome receives home total parenteral nutrition (TPN) through a tunneled central venous catheter. The home health nurse reviews the plan of care with the client and his spouse.",
  "q": "For each action, indicate whether it is appropriate or not appropriate for this client.",
  "cols": [
   "Appropriate",
   "Not appropriate"
  ],
  "rows": [
   {
    "t": "Check fingerstick glucose on the schedule ordered by the provider",
    "ans": 0,
    "why": "the high dextrose load can cause hyperglycemia, so glucose is monitored, especially when the formula or rate changes."
   },
   {
    "t": "Use a dedicated lumen for TPN and give no other medications through it",
    "ans": 0,
    "why": "a dedicated lumen lowers the risk of central line infection and drug incompatibility."
   },
   {
    "t": "Run the infusion faster to catch up after it was paused for 2 hours",
    "ans": 1,
    "why": "speeding up the rate can cause hyperglycemia and fluid overload; the infusion continues at the prescribed rate."
   },
   {
    "t": "Stop the infusion suddenly when the bag runs out and no new bag is available",
    "ans": 1,
    "why": "abrupt stopping can cause rebound hypoglycemia; 10% dextrose is hung at the same rate until the next bag arrives."
   },
   {
    "t": "Hang 10% dextrose at the same rate if the next TPN bag is delayed",
    "ans": 0,
    "why": "this maintains a steady glucose supply and prevents rebound hypoglycemia."
   },
   {
    "t": "Weigh at the same time each day and record the result",
    "ans": 0,
    "why": "daily weights track nutritional progress and detect fluid overload."
   }
  ],
  "why": "TPN is a concentrated dextrose solution, so the main pharmacologic risks are hyperglycemia during the infusion and rebound hypoglycemia if it stops suddenly. It runs at a constant rate through a dedicated lumen with strict aseptic technique, and glucose and weight are monitored.",
  "tip": "For TPN, never catch up and never stop suddenly; both errors cause a glucose problem."
 },
 {
  "id": "qb-pharm-26",
  "type": "cloze",
  "step": "hypo",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Insulin types and timing",
  "stem": "A 63-year-old with type 2 diabetes receives insulin lispro 6 units subcut at 07:45 when his breakfast tray arrives, and insulin glargine 20 units subcut at 21:00.",
  "q": "Complete the sentences.",
  "parts": [
   "Insulin lispro begins to act within about ",
   {
    "opts": [
     "15 minutes",
     "1 hour",
     "4 hours"
    ],
    "ans": 0,
    "whys": [
     "Yes: Rapid-acting insulin starts within about 15 minutes, which is why it is given with the meal.",
     "No: An onset near 30 to 60 minutes fits regular insulin, not a rapid-acting analog.",
     "No: An onset of several hours fits long-acting insulin, not lispro."
    ]
   },
   ". He is at greatest risk for hypoglycemia from the lispro about ",
   {
    "opts": [
     "1 to 2 hours after the injection",
     "6 to 8 hours after the injection",
     "16 to 20 hours after the injection"
    ],
    "ans": 0,
    "whys": [
     "Yes: Lispro peaks about 1 to 2 hours after injection, so watch for hypoglycemia mid-morning.",
     "No: A peak several hours after injection fits NPH, an intermediate-acting insulin.",
     "No: Lispro is gone long before this point; its total duration is about 3 to 5 hours."
    ]
   },
   ". The nurse knows that insulin glargine ",
   {
    "opts": [
     "has no pronounced peak and is not mixed with other insulins",
     "peaks about 2 hours after injection",
     "can be given IV to treat high glucose"
    ],
    "ans": 0,
    "whys": [
     "Yes: Glargine provides steady basal coverage for about 24 hours and must never be mixed in a syringe with another insulin.",
     "No: A 2-hour peak describes rapid-acting insulin. The trap is assuming every insulin has a peak.",
     "No: Glargine is for subcut use only; IV insulin infusions use regular insulin."
    ]
   },
   "."
  ],
  "why": "Hypoglycemia risk is greatest when an insulin peaks. Rapid-acting lispro starts in about 15 minutes and peaks in 1 to 2 hours, so it is given with meals. Long-acting glargine has no real peak and is never mixed, and IV infusions use regular insulin.",
  "tip": "Learn onset, peak and duration for each insulin class, then time your hypoglycemia checks to the peak."
 },
 {
  "id": "qb-pharm-27",
  "type": "cloze",
  "step": "cues",
  "cn": "pharm",
  "sp": "periop",
  "topic": "Medication reconciliation",
  "stem": "At a preoperative visit, a 68-year-old is scheduled for a knee replacement. The record lists warfarin 5 mg daily (to be held before surgery per the surgeon), metoprolol and atorvastatin. When asked about other medicines, he says, \"I take two ibuprofen tablets three times a day for my knee. I didn't think that counted.\"",
  "q": "Complete the sentences.",
  "parts": [
   "The most reliable way to complete the reconciliation is ",
   {
    "opts": [
     "to review each drug, dose and time with the client, compared with his bottles and pharmacy records",
     "to copy the list from his discharge summary from last year",
     "to use the surgeon's preoperative order set"
    ],
    "ans": 0,
    "whys": [
     "Yes: A best possible medication history uses the client's own account checked against bottles and pharmacy fill data, including over-the-counter and herbal products.",
     "No: An old discharge list is likely out of date and misses medications started since then.",
     "No: An order set shows what is planned, not what the client actually takes at home."
    ]
   },
   ". Taking ibuprofen with warfarin raises his risk of ",
   {
    "opts": [
     "bleeding",
     "blood clots",
     "low blood sugar"
    ],
    "ans": 0,
    "whys": [
     "Yes: NSAIDs impair platelets and can irritate the stomach, adding to warfarin's bleeding risk, especially around surgery.",
     "No: Ibuprofen does not increase clotting; the combination increases bleeding.",
     "No: Neither drug commonly causes hypoglycemia, so this is not the concern."
    ]
   },
   ". The nurse should ",
   {
    "opts": [
     "add the ibuprofen to the list and report it to the surgical team",
     "leave it off the list because it is sold over the counter",
     "tell the client to stop his warfarin today"
    ],
    "ans": 0,
    "whys": [
     "Yes: The discrepancy must be documented and communicated so the provider can decide when to stop the NSAID before surgery.",
     "No: Over-the-counter drugs cause real interactions and must be on the list. This is the trap the client fell into.",
     "No: Changing the warfarin schedule is a provider decision; the nurse reports the finding instead."
    ]
   },
   "."
  ],
  "why": "Medication reconciliation compares what the client actually takes with what is ordered and resolves every discrepancy with the provider. Clients often leave out over-the-counter drugs and supplements, so ask about them directly. Here an NSAID with warfarin raises bleeding risk before surgery.",
  "tip": "Ask every client specifically about over-the-counter drugs, vitamins and herbal products; they rarely volunteer them."
 },
 {
  "id": "qb-pharm-28",
  "type": "bowtie",
  "step": "hypo",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Transfusion reaction",
  "stem": "A 54-year-old is 10 minutes into a unit of packed red blood cells. She reports chills and low back pain. T 38.6 °C (101.5 °F), up from 36.9 °C (98.4 °F); BP 88/50, down from 124/76; HR 122. The urine in her catheter bag has turned dark red.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Acute hemolytic transfusion reaction",
    "Febrile nonhemolytic reaction",
    "Transfusion-associated circulatory overload",
    "Mild allergic reaction"
   ],
   "ans": 0
  },
  "actions": {
   "opts": [
    "Stop the transfusion and keep the IV open with 0.9% sodium chloride through new tubing",
    "Notify the provider and blood bank and send the bag and tubing to the blood bank",
    "Slow the transfusion and give acetaminophen",
    "Give diphenhydramine and resume the unit when symptoms fade",
    "Flush the existing blood tubing with saline to keep the vein open"
   ],
   "ans": [
    0,
    1
   ]
  },
  "params": {
   "opts": [
    "Urine output and color",
    "Blood pressure and heart rate",
    "Capillary blood glucose",
    "Deep tendon reflexes",
    "Peak expiratory flow"
   ],
   "ans": [
    0,
    1
   ]
  },
  "whys": {
   "cond": [
    "Yes: Fever, chills, back pain, hypotension and dark urine early in a transfusion signal destruction of incompatible red cells.",
    "No: A febrile reaction causes fever and chills but not hypotension, back pain or blood in the urine.",
    "No: Circulatory overload causes hypertension, dyspnea and crackles, not hypotension with dark urine.",
    "No: An allergic reaction causes hives and itching with stable blood pressure."
   ],
   "actions": [
    "Yes: Stopping at once limits how much incompatible blood she receives; new tubing keeps IV access without giving more blood.",
    "Yes: The provider must treat shock and kidney risk, and the blood bank investigates the unit and repeats compatibility testing.",
    "No: Any continued infusion delivers more incompatible blood. The trap is treating this like a simple fever.",
    "No: An antihistamine treats mild allergy, and a unit is never restarted after a hemolytic reaction.",
    "No: Flushing the old tubing pushes the remaining incompatible blood into the client."
   ],
   "params": [
    "Yes: Free hemoglobin can injure the kidneys, so hourly output and urine color show kidney perfusion and ongoing hemolysis.",
    "Yes: Hypotension and tachycardia show shock; trends guide fluids and vasopressor support.",
    "No: Blood glucose is not affected by hemolysis and does not guide treatment.",
    "No: Reflexes are tracked for magnesium therapy, not transfusion reactions.",
    "No: Peak flow tracks asthma control and does not reflect hemolysis or shock."
   ]
  },
  "why": "An acute hemolytic reaction is usually caused by ABO incompatibility and starts within minutes. Stop the transfusion, keep the vein open with saline through new tubing, support blood pressure and protect the kidneys. The provider and blood bank are notified and the unit is returned for testing.",
  "tip": "For any suspected transfusion reaction, the first action is always to stop the transfusion."
 },
 {
  "id": "qb-risk-1",
  "type": "mc",
  "step": "hypo",
  "cn": "risk",
  "sp": "sd",
  "topic": "Hypokalemia with digoxin",
  "stem": "A 74-year-old with heart failure and atrial fibrillation is admitted to the telemetry unit. Home medications include furosemide 40 mg twice daily and digoxin 0.125 mg daily. Morning labs: potassium 3.1 mEq/L, sodium 138 mEq/L, creatinine 1.0 mg/dL. Apical pulse 64 and irregular.",
  "q": "Which risk is the nurse's priority concern based on these findings?",
  "opts": [
   {
    "t": "Digoxin toxicity and ventricular dysrhythmias",
    "ok": true,
    "why": "Yes: Low potassium lets digoxin bind more strongly to heart muscle, raising the risk of toxicity and dangerous dysrhythmias even when the digoxin dose is unchanged."
   },
   {
    "t": "Fluid volume excess from sodium retention",
    "ok": false,
    "why": "No: The sodium is normal and furosemide removes sodium and water. The trap is assuming every heart failure lab change means fluid overload."
   },
   {
    "t": "Acute kidney injury from the diuretic",
    "ok": false,
    "why": "No: A creatinine of 1.0 mg/dL is within the usual adult range, so there is no current sign of kidney injury."
   },
   {
    "t": "Metabolic acidosis from diuretic therapy",
    "ok": false,
    "why": "No: Loop diuretics tend to cause metabolic alkalosis through loss of hydrogen and chloride, not acidosis."
   }
  ],
  "why": "Potassium below 3.5 mEq/L is low. Hypokalemia increases the heart's sensitivity to digoxin, so a client taking both a loop diuretic and digoxin is at high risk for toxicity and dysrhythmias. The nurse reports the potassium, checks for signs of toxicity and anticipates replacement.",
  "tip": "When a stem pairs a lab value with a medication, ask how that lab changes the drug's effect."
 },
 {
  "id": "qb-risk-2",
  "type": "order",
  "step": "analyze",
  "cn": "risk",
  "sp": "icu",
  "topic": "ABG stepwise interpretation",
  "stem": "A 58-year-old in the ICU after abdominal surgery received IV hydromorphone 1 hour ago. He is drowsy with RR 8 and shallow. ABG: pH 7.30, PaCO₂ 54 mm Hg, HCO₃ 25 mEq/L, PaO₂ 70 mm Hg.",
  "q": "Place the steps for interpreting this ABG in the correct order.",
  "opts": [
   "Check the pH: 7.30 is below 7.35, so the client is acidotic",
   "Check the PaCO₂ and HCO₃: PaCO₂ 54 mm Hg is above 45 (acid direction); HCO₃ 25 mEq/L is within 22 to 26 (normal)",
   "Name the primary disorder from the value that explains the pH: a PaCO₂ of 54 mm Hg is acidic and matches the low pH, so this is respiratory acidosis",
   "Check for compensation: the HCO₃ has not risen and the pH is still abnormal, so the acidosis is uncompensated"
  ],
  "whys": [
   "Yes: The pH comes first because it tells you whether the problem is acidosis or alkalosis; every later step is read against it.",
   "Yes: Both values are read next: the PaCO₂ shows the lungs' part, since retained carbon dioxide acts as an acid, and the HCO₃ shows the metabolic part, which is normal here.",
   "Yes: Only after both values are known can you name the primary disorder: the one that matches the pH is the cause.",
   "Yes: Compensation is judged last, by looking at the opposite system. Kidney compensation takes days, so an acute problem like this is uncompensated."
  ],
  "why": "A consistent order prevents errors: pH, then PaCO₂ and HCO₃, then match the cause to the pH, then judge compensation. This client has uncompensated respiratory acidosis from opioid-induced hypoventilation. The priority is to stimulate breathing, support ventilation and anticipate naloxone.",
  "tip": "Always read the pH first; it is the anchor that tells you which abnormal value is the cause."
 },
 {
  "id": "qb-risk-3",
  "type": "mc",
  "step": "act",
  "cn": "risk",
  "sp": "ms",
  "topic": "Hyponatremia safety",
  "stem": "A 70-year-old admitted with pneumonia has new confusion. Serum sodium is 122 mEq/L (136 mEq/L two days ago). The provider diagnosed SIADH and ordered a fluid restriction. BP 132/78, HR 84, crackles in the right lung base.",
  "q": "Which nursing action is most appropriate at this time?",
  "opts": [
   {
    "t": "Implement seizure precautions",
    "ok": true,
    "why": "Yes: A rapid drop to 122 mEq/L with new confusion means brain cells are swelling. Seizures are a real risk, so the nurse protects the client while treatment starts."
   },
   {
    "t": "Encourage 2 to 3 L of oral fluid daily to thin secretions",
    "ok": false,
    "why": "No: Extra free water dilutes the sodium further in SIADH. The trap is applying routine pneumonia teaching to a client on fluid restriction."
   },
   {
    "t": "Hang 0.45% sodium chloride at 100 mL/h",
    "ok": false,
    "why": "No: Half-normal saline is hypotonic and would lower the sodium further and worsen cerebral swelling."
   },
   {
    "t": "Restrict dietary sodium to 2 g daily",
    "ok": false,
    "why": "No: The problem is too much water, not too much sodium. Restricting sodium would make the hyponatremia worse."
   }
  ],
  "why": "Sodium below 135 mEq/L is low, and a fall to 122 mEq/L with confusion is significant. In SIADH the body retains water, so treatment is fluid restriction, not sodium restriction. The nurse protects the client from seizures and falls and monitors neurologic status and sodium closely.",
  "tip": "For electrolyte items, ask what organ the imbalance threatens, then choose the action that protects that organ."
 },
 {
  "id": "qb-risk-4",
  "type": "matrix",
  "step": "cues",
  "cn": "risk",
  "sp": "comm",
  "topic": "Laboratory value follow-up",
  "stem": "A 66-year-old man at a primary care clinic takes warfarin for atrial fibrillation and metformin for type 2 diabetes. His target INR is 2 to 3. The nurse reviews today's results before he leaves.",
  "q": "For each result, indicate whether it is within the expected range or requires follow-up.",
  "cols": [
   "Within expected range",
   "Requires follow-up"
  ],
  "rows": [
   {
    "t": "Potassium 4.3 mEq/L",
    "ans": 0,
    "why": "the usual adult range is 3.5 to 5.0 mEq/L, so no action is needed."
   },
   {
    "t": "Sodium 139 mEq/L",
    "ans": 0,
    "why": "the usual adult range is 135 to 145 mEq/L."
   },
   {
    "t": "Hemoglobin 14.6 g/dL",
    "ans": 0,
    "why": "this is normal for an adult male and argues against hidden bleeding from the warfarin."
   },
   {
    "t": "INR 4.6",
    "ans": 1,
    "why": "this is well above his target of 2 to 3 and raises the risk of bleeding; the provider needs to adjust the dose and he needs bleeding teaching."
   },
   {
    "t": "Platelets 88,000/mm³",
    "ans": 1,
    "why": "the usual range is 150,000 to 400,000/mm³. Low platelets plus a high INR compound his bleeding risk."
   },
   {
    "t": "Fasting glucose 172 mg/dL",
    "ans": 1,
    "why": "this is above the normal fasting range of 70 to 99 mg/dL and above the usual diabetes target, so his plan needs review."
   }
  ],
  "why": "Compare each result to the usual adult range and to the client's own target. His electrolytes and hemoglobin are normal, but an INR far above target with thrombocytopenia places him at high risk for bleeding, and his fasting glucose shows poor control. All three need the provider's attention before he leaves.",
  "tip": "For anticoagulated clients, read the INR against the client's target range, not the range for someone who is not on warfarin."
 },
 {
  "id": "qb-risk-5",
  "type": "cloze",
  "step": "solve",
  "cn": "risk",
  "sp": "ed",
  "topic": "Contrast CT and metformin",
  "stem": "A 64-year-old in the emergency department is scheduled for a CT of the abdomen with IV iodinated contrast. She takes metformin 1,000 mg twice daily; her last dose was at 08:00. Her creatinine today is 1.5 mg/dL, up from 0.9 mg/dL 3 days ago, and her eGFR is 38 mL/min/1.73 m².",
  "q": "Complete the sentences.",
  "parts": [
   "Before the scan, the nurse should ",
   {
    "opts": [
     "notify the provider about the metformin and the eGFR so further doses are held",
     "give the evening metformin dose early so it clears before the scan",
     "cancel the scan because metformin is a contraindication to contrast"
    ],
    "ans": 0,
    "whys": [
     "Yes: With reduced and worsening kidney function, metformin is held at the time of the contrast study, and the provider must write the order and plan.",
     "No: Giving more metformin before contrast is the opposite of what is needed when kidney function is already reduced.",
     "No: Metformin does not rule out the scan; it is held. The nurse does not cancel a provider's diagnostic order."
    ]
   },
   " because contrast can reduce kidney function and let metformin build up, causing ",
   {
    "opts": [
     "lactic acidosis",
     "hyperkalemia",
     "hypoglycemia"
    ],
    "ans": 0,
    "whys": [
     "Yes: Metformin is cleared by the kidneys; if contrast injures them, the drug accumulates and can cause lactic acidosis, a rare but often fatal complication.",
     "No: Contrast can worsen kidney function, but the specific danger of combining it with metformin is lactic acidosis.",
     "No: Metformin alone rarely causes hypoglycemia; the trap is linking every diabetes drug to low blood sugar."
    ]
   },
   ". Metformin is usually restarted ",
   {
    "opts": [
     "48 hours after the scan if repeat kidney function is stable",
     "the same evening once she is eating",
     "after 7 days regardless of lab results"
    ],
    "ans": 0,
    "whys": [
     "Yes: Kidney function is rechecked about 48 hours after contrast, and metformin resumes only if it is stable.",
     "No: Restarting before kidney function is rechecked could cause metformin buildup if the contrast caused injury.",
     "No: The restart depends on kidney function, not a fixed waiting period."
    ]
   },
   "."
  ],
  "why": "Iodinated contrast can cause acute kidney injury, and metformin is cleared by the kidneys. In a client with an eGFR below 45 or acute kidney injury, metformin is held at the time of the study and restarted after kidney function is rechecked and stable, usually 48 hours later. The nurse also checks for contrast allergy and supports hydration as ordered.",
  "tip": "When a drug is cleared by the kidneys, look for any test or treatment that could injure the kidneys."
 },
 {
  "id": "qb-risk-6",
  "type": "mc",
  "step": "act",
  "cn": "risk",
  "sp": "sd",
  "topic": "Cardiac catheterization bleeding",
  "stem": "A 61-year-old returned to the telemetry unit 2 hours ago after a cardiac catheterization through the right femoral artery. He says his groin feels warm and wet. The dressing is soaked with blood and a firm swelling at the site has grown since the last check. BP 118/72, HR 92.",
  "q": "Which action should the nurse take first?",
  "opts": [
   {
    "t": "Apply firm manual pressure just above the puncture site",
    "ok": true,
    "why": "Yes: Direct pressure above the arterial puncture compresses the vessel and stops the bleeding. The nurse calls for help while holding pressure."
   },
   {
    "t": "Raise the head of the bed to 45 degrees for comfort",
    "ok": false,
    "why": "No: Flexing the hip strains the femoral puncture and can increase bleeding. The leg stays straight and the head of the bed low per protocol."
   },
   {
    "t": "Call the provider and wait at the bedside for orders",
    "ok": false,
    "why": "No: The provider must be notified, but bleeding continues while the nurse waits. Pressure comes first, then notification."
   },
   {
    "t": "Check the right pedal pulse and compare it with the left",
    "ok": false,
    "why": "No: Neurovascular checks matter, but active arterial bleeding must be controlled first. The trap is assessing when the problem is already clear."
   }
  ],
  "why": "Bleeding and hematoma at the femoral site are the most common complications after a femoral catheterization. Firm manual pressure just above the puncture controls arterial bleeding. Once bleeding is controlled, the nurse checks distal pulses, vital signs and the size of the hematoma and notifies the provider.",
  "tip": "When the problem is obvious and ongoing, choose the action that stops the harm before more assessment or a phone call."
 },
 {
  "id": "qb-risk-7",
  "type": "sata",
  "step": "solve",
  "cn": "risk",
  "sp": "ms",
  "topic": "Paracentesis preparation",
  "stem": "A 55-year-old with cirrhosis and tense ascites is scheduled for a bedside paracentesis this afternoon. He is short of breath when lying flat. BP 112/70, HR 88. Consent has been signed.",
  "q": "Which actions should the nurse include in the plan? Select all that apply.",
  "opts": [
   {
    "t": "Ask him to empty his bladder right before the procedure",
    "ok": true,
    "why": "Yes: A full bladder can be punctured by the needle, so the client voids just before the procedure."
   },
   {
    "t": "Measure his weight and abdominal girth before and after",
    "ok": true,
    "why": "Yes: Before and after measurements show how much fluid was removed and give a baseline for tracking reaccumulation."
   },
   {
    "t": "Position him sitting upright at the edge of the bed or in high Fowler's",
    "ok": true,
    "why": "Yes: Upright positioning pools fluid in the lower abdomen for easier removal and eases his breathing."
   },
   {
    "t": "Monitor BP and HR closely after fluid is removed",
    "ok": true,
    "why": "Yes: Removing a large volume shifts fluid out of the bloodstream into the abdomen, which can cause hypotension and tachycardia."
   },
   {
    "t": "Place him in Trendelenburg position during the procedure",
    "ok": false,
    "why": "No: Head-down positioning pushes ascites against the diaphragm and worsens his breathing; it also moves fluid away from the needle site."
   },
   {
    "t": "Insert an indwelling urinary catheter to keep the bladder empty",
    "ok": false,
    "why": "No: Voiding before the procedure is enough. A catheter adds infection risk without benefit."
   },
   {
    "t": "Keep him lying flat for 6 hours afterward",
    "ok": false,
    "why": "No: Lying flat after a procedure is linked to lumbar puncture teaching. The trap is mixing up procedures; he may sit up as tolerated."
   }
  ],
  "why": "Paracentesis preparation centers on preventing bladder puncture, positioning for fluid drainage and breathing, and recording baseline weight and girth. After a large-volume removal, fluid shifts can cause hypotension, so vital signs are monitored closely. Albumin may be ordered after large volumes.",
  "tip": "For procedure items, think through before, during and after, and match each option to the procedure in the stem."
 },
 {
  "id": "qb-risk-8",
  "type": "mc",
  "step": "eval",
  "cn": "risk",
  "sp": "ed",
  "topic": "Thoracentesis complications",
  "stem": "A 68-year-old had 1,000 mL of fluid removed from the right pleural space by thoracentesis 30 minutes ago in the emergency department. Before the procedure: RR 26, SpO₂ 91% on 2 L nasal cannula.",
  "q": "Which finding indicates a complication that requires immediate follow-up?",
  "opts": [
   {
    "t": "Sudden sharp right chest pain with absent breath sounds on the right",
    "ok": true,
    "why": "Yes: These are signs of pneumothorax from the needle entering the lung. It needs immediate provider notification and a chest X-ray."
   },
   {
    "t": "RR 20 and SpO₂ 95% on 2 L",
    "ok": false,
    "why": "No: Breathing and oxygenation improved after fluid removal, which is the expected outcome of the procedure."
   },
   {
    "t": "A small amount of serous drainage on the dressing",
    "ok": false,
    "why": "No: Scant clear drainage at the puncture site is expected. Report bloody or increasing drainage."
   },
   {
    "t": "Mild soreness at the puncture site rated 2/10",
    "ok": false,
    "why": "No: Mild local soreness is expected after a needle procedure and does not signal a complication."
   }
  ],
  "why": "After thoracentesis, the nurse compares findings to the pre-procedure baseline. Improved breathing and oxygenation show the procedure worked. Sudden pain with absent breath sounds on the procedure side suggests pneumothorax, which is the key complication to watch for, along with bleeding and re-expansion pulmonary edema.",
  "tip": "When evaluating a procedure, separate the expected effects from the new, sudden finding that signals a complication."
 },
 {
  "id": "qb-risk-9",
  "type": "highlight",
  "step": "cues",
  "cn": "risk",
  "sp": "icu",
  "topic": "Increased intracranial pressure",
  "stem": "A 34-year-old is in the neuro ICU after a traumatic brain injury from a motorcycle crash. Nurse's note at 03:00.",
  "q": "Highlight the findings that require immediate follow-up.",
  "parts": [
   {
    "t": "Opens eyes only to pain; was opening eyes to voice at 01:00.",
    "ok": true,
    "why": "Yes: A decline in level of consciousness is the earliest and most sensitive sign of rising intracranial pressure."
   },
   {
    "t": "Right pupil 6 mm and sluggish; left pupil 3 mm and brisk.",
    "ok": true,
    "why": "Yes: A new unequal, sluggish pupil signals pressure on the third cranial nerve and possible herniation."
   },
   {
    "t": "BP 178/62, up from 136/78.",
    "ok": true,
    "why": "Yes: Rising systolic pressure with a widening pulse pressure is part of Cushing triad, a late sign of increased ICP."
   },
   {
    "t": "HR 52, down from 88.",
    "ok": true,
    "why": "Yes: New bradycardia alongside rising blood pressure completes the picture of Cushing response and needs urgent action."
   },
   {
    "t": "Head of bed at 30 degrees, head midline.",
    "ok": false,
    "why": "No: This positioning is correct; it promotes venous drainage from the brain and helps lower intracranial pressure."
   },
   {
    "t": "Temperature 37.2 °C (99.0 °F).",
    "ok": false,
    "why": "No: This is normal. Fever would need treatment because it raises brain metabolism, but it is not present."
   },
   {
    "t": "Urinary catheter draining clear yellow urine at 60 mL/h.",
    "ok": false,
    "why": "No: Urine output is adequate and normal in appearance, so it needs no follow-up."
   }
  ],
  "why": "Decreasing level of consciousness is the earliest sign of increased ICP. A new dilated, sluggish pupil, rising systolic pressure with a widening pulse pressure, and bradycardia point to brain herniation, a neurologic emergency. The provider is notified immediately while the nurse maintains measures that lower ICP.",
  "tip": "In neuro items, a change in level of consciousness is the first cue to flag, and vital sign changes are late."
 },
 {
  "id": "qb-risk-10",
  "type": "bowtie",
  "step": "hypo",
  "cn": "risk",
  "sp": "ms",
  "topic": "Compartment syndrome",
  "stem": "A 24-year-old had a closed tibial fracture placed in a long leg cast 10 hours ago. He rates his pain 9/10 despite IV morphine 1 hour ago and says his foot feels like pins and needles. Pain increases sharply when the nurse gently moves his toes. His toes are pale and cool with capillary refill of 4 seconds.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Acute compartment syndrome",
    "Deep vein thrombosis",
    "Fat embolism syndrome",
    "Expected fracture pain"
   ],
   "ans": 0
  },
  "actions": {
   "opts": [
    "Notify the provider immediately",
    "Keep the leg at the level of the heart",
    "Elevate the leg on pillows well above the heart",
    "Apply ice packs over the cast",
    "Give the next opioid dose early and reassess in 1 hour"
   ],
   "ans": [
    0,
    1
   ]
  },
  "params": {
   "opts": [
    "Pain with passive stretch of the toes",
    "Capillary refill, sensation and movement of the toes",
    "Blood glucose",
    "Bowel sounds",
    "Oral temperature"
   ],
   "ans": [
    0,
    1
   ]
  },
  "whys": {
   "cond": [
    "Yes: Pain out of proportion that opioids do not relieve, pain on passive stretch, paresthesia and poor perfusion are classic signs of rising pressure inside a muscle compartment.",
    "No: DVT causes calf swelling and aching, not pain on passive stretch with paresthesia and pale, cool toes 10 hours after injury.",
    "No: Fat embolism usually appears 24 to 72 hours after a long bone fracture with respiratory distress, confusion and petechiae.",
    "No: Expected fracture pain responds to opioids. The trap is treating unrelieved pain with neurovascular changes as normal."
   ],
   "actions": [
    "Yes: Compartment syndrome can cause permanent muscle and nerve death within hours; the cast may need to be split and a fasciotomy may be needed.",
    "Yes: Heart level balances venous drainage with arterial inflow. Elevating higher lowers arterial pressure into the compartment.",
    "No: In suspected compartment syndrome, elevation above the heart reduces arterial flow and worsens tissue ischemia.",
    "No: Cold causes vasoconstriction and further reduces blood flow to tissue that is already ischemic.",
    "No: More opioid masks the key symptom and delays treatment. Unrelieved pain is the warning, not the problem to sedate."
   ],
   "params": [
    "Yes: Pain on passive stretch is one of the earliest and most reliable signs, so it shows whether pressure is rising or falling.",
    "Yes: Neurovascular checks track perfusion and nerve function distal to the injury and show whether treatment is working.",
    "No: Glucose is not related to compartment pressure or limb perfusion.",
    "No: Bowel sounds are unrelated to the limb and do not help track this problem.",
    "No: Temperature does not reflect compartment pressure or distal perfusion in this client."
   ]
  },
  "why": "Pain out of proportion to the injury, pain on passive stretch, paresthesia, pallor and slow capillary refill point to acute compartment syndrome. It is a surgical emergency: notify the provider, keep the limb at heart level, and avoid ice and elevation. Frequent neurovascular checks track the response.",
  "tip": "Pain that opioids do not touch in a casted limb is compartment syndrome until proven otherwise."
 },
 {
  "id": "qb-risk-11",
  "type": "sata",
  "step": "cues",
  "cn": "risk",
  "sp": "periop",
  "topic": "Moderate sedation monitoring",
  "stem": "A 50-year-old is having a colonoscopy under moderate sedation with IV midazolam and fentanyl. Baseline: BP 128/80, HR 76, RR 16, SpO₂ 98% on room air. The nurse assesses the client 10 minutes after the last dose.",
  "q": "Which findings require immediate intervention? Select all that apply.",
  "opts": [
   {
    "t": "RR 7 with shallow breaths",
    "ok": true,
    "why": "Yes: Opioids and benzodiazepines together depress breathing. A rate this low means the client is hypoventilating and needs stimulation and airway support."
   },
   {
    "t": "SpO₂ 88%",
    "ok": true,
    "why": "Yes: A drop from 98% to 88% shows inadequate oxygenation from hypoventilation and needs prompt action."
   },
   {
    "t": "Responds only to a firm sternal rub",
    "ok": true,
    "why": "Yes: Responding only to painful stimulus means deep sedation, beyond the moderate level, where airway reflexes may be lost."
   },
   {
    "t": "Snoring sounds with each breath",
    "ok": true,
    "why": "Yes: Snoring signals partial airway obstruction from the relaxed tongue; a head tilt or jaw thrust is needed."
   },
   {
    "t": "Eyes closed but answers questions when spoken to",
    "ok": false,
    "why": "No: Purposeful response to voice is the goal of moderate sedation and is expected."
   },
   {
    "t": "BP 118/74",
    "ok": false,
    "why": "No: A small drop from baseline is common with sedation and is still within a safe range."
   },
   {
    "t": "HR 70 and regular",
    "ok": false,
    "why": "No: The heart rate is close to baseline and normal, so it needs no intervention."
   }
  ],
  "why": "Under moderate sedation the client should respond purposefully to voice and keep breathing adequately on their own. Slow, shallow breathing, falling oxygen saturation, snoring and response only to pain mean the client has drifted into deeper sedation. The nurse stimulates the client, opens the airway, gives oxygen and prepares reversal agents as ordered.",
  "tip": "For sedation items, check airway and breathing first, then the level of response compared with the target sedation level."
 },
 {
  "id": "qb-risk-12",
  "type": "matrix",
  "step": "solve",
  "cn": "risk",
  "sp": "sd",
  "topic": "Chest tube management",
  "stem": "A 45-year-old has a right chest tube for a pneumothorax, connected to a wet suction drainage system at 20 cm H₂O suction. The nurse is planning care for the shift.",
  "q": "For each nursing action, indicate whether it is appropriate or inappropriate.",
  "cols": [
   "Appropriate",
   "Inappropriate"
  ],
  "rows": [
   {
    "t": "Keep the drainage unit upright and below the level of the chest",
    "ans": 0,
    "why": "gravity keeps drainage and air flowing out of the chest and prevents backflow into the pleural space."
   },
   {
    "t": "Expect gentle, continuous bubbling in the suction control chamber",
    "ans": 0,
    "why": "in a wet suction system this shows suction is working. Vigorous bubbling only evaporates the water faster."
   },
   {
    "t": "Expect the water in the water seal chamber to rise and fall with breathing",
    "ans": 0,
    "why": "this tidaling shows the tube is open and connected to the pleural space."
   },
   {
    "t": "Treat continuous bubbling in the water seal chamber as expected",
    "ans": 1,
    "why": "continuous bubbling in the water seal signals an air leak in the system or the client. The nurse assesses the client and checks connections."
   },
   {
    "t": "If the tube disconnects from the unit, submerge its end 2 to 3 cm in sterile water",
    "ans": 0,
    "why": "this creates a temporary water seal so air cannot enter the chest while a new system is set up."
   },
   {
    "t": "Clamp the tube whenever the client walks to the bathroom",
    "ans": 1,
    "why": "clamping traps air in the chest and can cause a tension pneumothorax. The unit is carried below chest level instead."
   }
  ],
  "why": "Bubbling has a meaning that depends on the chamber. Gentle bubbling in the suction control chamber is expected with wet suction, and tidaling in the water seal shows patency. Continuous bubbling in the water seal means an air leak. If the tube disconnects, the end goes into sterile water; routine clamping is unsafe.",
  "tip": "Learn each chamber's job, and read every bubbling pattern by asking which chamber it is in."
 },
 {
  "id": "qb-risk-13",
  "type": "mc",
  "step": "cues",
  "cn": "risk",
  "sp": "comm",
  "topic": "MRI safety screening",
  "stem": "A 57-year-old arrives at an outpatient imaging center for a brain MRI without contrast to evaluate headaches. The nurse completes the safety screening questionnaire with her.",
  "q": "Which finding must the nurse report before the scan can proceed?",
  "opts": [
   {
    "t": "A cardiac pacemaker placed 4 years ago",
    "ok": true,
    "why": "Yes: The magnetic field can affect a pacemaker and its leads. The device type must be confirmed and a special protocol arranged, or the scan cannot be done."
   },
   {
    "t": "A porcelain crown on a back tooth",
    "ok": false,
    "why": "No: Porcelain is not magnetic and dental crowns do not create a safety risk in the scanner."
   },
   {
    "t": "Ate breakfast 2 hours ago",
    "ok": false,
    "why": "No: A non-contrast MRI without sedation does not require fasting."
   },
   {
    "t": "Takes levothyroxine every morning",
    "ok": false,
    "why": "No: Oral medications have no interaction with the magnetic field and do not need to be held."
   }
  ],
  "why": "MRI screening looks for anything that the strong magnet could move, heat or disrupt: implanted electronic devices, ferromagnetic clips, metal fragments and some implants. A pacemaker must be identified and cleared by the radiology team before the scan. Also remove all metal objects and ask about claustrophobia.",
  "tip": "For MRI items, scan the options for anything metal or electronic inside the body."
 },
 {
  "id": "qb-risk-14",
  "type": "mc",
  "step": "eval",
  "cn": "risk",
  "sp": "peds",
  "topic": "NG tube placement",
  "stem": "A 7-year-old (22 kg) on the pediatric unit has a new nasogastric tube placed for continuous feedings after a head injury. The tube was measured and inserted to the marked length and taped in place.",
  "q": "Which finding confirms correct placement before the first feeding is started?",
  "opts": [
   {
    "t": "An X-ray report showing the tube tip in the stomach",
    "ok": true,
    "why": "Yes: Radiographic confirmation is the standard for verifying a newly placed feeding tube before anything is put through it."
   },
   {
    "t": "A whooshing sound over the stomach when air is injected",
    "ok": false,
    "why": "No: Auscultation is unreliable because air injected into the lung or esophagus can sound the same over the abdomen."
   },
   {
    "t": "No coughing or distress during insertion",
    "ok": false,
    "why": "No: A tube can enter the airway without coughing, especially in a child with reduced level of consciousness."
   },
   {
    "t": "Clear fluid aspirated from the tube",
    "ok": false,
    "why": "No: Appearance alone cannot tell gastric fluid from respiratory or pleural fluid. pH testing can support placement checks later but does not replace X-ray initially."
   }
  ],
  "why": "A misplaced feeding tube can deliver formula into the lungs. Initial placement of a feeding tube is confirmed by X-ray before first use. Afterward, the nurse checks the external mark and follows facility policy, such as aspirate pH, before each feeding or medication.",
  "tip": "When asked what confirms tube placement, choose the most reliable method, not the quickest bedside one."
 },
 {
  "id": "qb-risk-15",
  "type": "sata",
  "step": "act",
  "cn": "risk",
  "sp": "ms",
  "topic": "Wound evisceration",
  "stem": "A 63-year-old with obesity and diabetes is on post-op day 6 after an open bowel resection. After a coughing spell she says, \"Something just gave way.\" The nurse sees a loop of bowel protruding through the separated incision.",
  "q": "Which actions should the nurse take? Select all that apply.",
  "opts": [
   {
    "t": "Cover the bowel with sterile dressings moistened with sterile normal saline",
    "ok": true,
    "why": "Yes: Moist sterile dressings keep the exposed bowel from drying out and lower the risk of infection and tissue death."
   },
   {
    "t": "Place her in low Fowler's position with her knees bent",
    "ok": true,
    "why": "Yes: This position relaxes the abdominal muscles and reduces tension on the wound."
   },
   {
    "t": "Stay with her and have another staff member notify the surgeon",
    "ok": true,
    "why": "Yes: Evisceration is a surgical emergency; the nurse remains to monitor for shock and keep her calm while help is called."
   },
   {
    "t": "Keep her NPO",
    "ok": true,
    "why": "Yes: She will likely return to surgery for closure, so nothing is given by mouth."
   },
   {
    "t": "Gently push the bowel back into the abdomen",
    "ok": false,
    "why": "No: Reinserting the bowel can injure it and introduce infection. Only the surgeon replaces organs."
   },
   {
    "t": "Cover the bowel with dry sterile gauze",
    "ok": false,
    "why": "No: Dry gauze sticks to and dries the bowel. The dressing must be moist with sterile saline."
   },
   {
    "t": "Raise the head of the bed fully and ask her to cough",
    "ok": false,
    "why": "No: Sitting fully upright and coughing increase abdominal pressure and can push out more bowel."
   }
  ],
  "why": "Evisceration usually follows dehiscence in clients with risk factors such as obesity, diabetes and coughing. The nurse protects the exposed organs with sterile saline-moistened dressings, reduces abdominal tension, keeps the client NPO and stays with her while the surgeon is notified, watching for shock.",
  "tip": "In surgical emergencies, choose actions that protect tissue and prepare for surgery; never pick an option where the nurse repairs or replaces anatomy."
 },
 {
  "id": "qb-risk-16",
  "type": "mc",
  "step": "hypo",
  "cn": "risk",
  "sp": "ms",
  "topic": "Rapid response criteria",
  "stem": "The nurse is caring for four clients on a medical-surgical unit.",
  "q": "For which client should the nurse call the rapid response team?",
  "opts": [
   {
    "t": "A 52-year-old 4 hours after abdominal hysterectomy who is restless with HR 132 (was 84), BP 84/50 and cool, clammy skin",
    "ok": true,
    "why": "Yes: A new tachycardia, systolic pressure under 90 and restlessness point to hemorrhage and shock. These meet common rapid response criteria and need immediate help."
   },
   {
    "t": "A 70-year-old on post-op day 2 with temperature 37.8 °C (100.0 °F) and diminished breath sounds in both bases",
    "ok": false,
    "why": "No: This suggests atelectasis. The nurse encourages incentive spirometry, deep breathing and walking, and reports it, but it is not an emergency."
   },
   {
    "t": "A 45-year-old on post-op day 3 after bowel surgery with mild abdominal distention and no flatus yet",
    "ok": false,
    "why": "No: This fits a postoperative ileus, which is managed with walking, NPO status as ordered and monitoring, not a rapid response."
   },
   {
    "t": "A 38-year-old 6 hours after a lumbar puncture with a mild headache when sitting up, rated 3/10",
    "ok": false,
    "why": "No: A mild positional headache after lumbar puncture is a known minor complication; report it and encourage fluids if allowed."
   }
  ],
  "why": "Rapid response teams are called for acute changes such as a heart rate over about 130, systolic BP under 90, a big change in respiratory rate or new confusion, or when the nurse is worried. Early post-op hemorrhage shows up as tachycardia, hypotension, restlessness and cool skin. The other clients have expected or minor complications.",
  "tip": "Pick the client whose findings show an acute change in airway, breathing, circulation or mental status."
 },
 {
  "id": "qb-basic-1",
  "type": "cloze",
  "step": "analyze",
  "cn": "basic",
  "sp": "comm",
  "topic": "Pressure injury staging",
  "stem": "A home health nurse assesses the skin of an 82-year-old who spends most of the day in a wheelchair.",
  "q": "Complete the sentences.",
  "parts": [
   "The sacrum has intact skin with a 3 cm area of redness that does not blanch when pressed. This is a ",
   {
    "opts": [
     "stage 1 pressure injury",
     "stage 2 pressure injury",
     "deep tissue pressure injury"
    ],
    "ans": 0,
    "whys": [
     "Yes: Intact skin with nonblanchable redness over a bony prominence is the definition of a stage 1 pressure injury.",
     "No: Stage 2 requires an open, partial-thickness wound or a blister; this skin is intact.",
     "No: A deep tissue injury is a deep red, maroon or purple area or a blood-filled blister, not simple nonblanchable redness."
    ]
   },
   ". The right ischial area has a shallow open wound with a pink, moist wound bed and no slough. This is a ",
   {
    "opts": [
     "stage 2 pressure injury",
     "stage 3 pressure injury",
     "unstageable pressure injury"
    ],
    "ans": 0,
    "whys": [
     "Yes: Partial-thickness loss with a pink or red moist bed and no slough is stage 2.",
     "No: Stage 3 is full-thickness loss with visible fat; this wound is shallow with exposed dermis.",
     "No: Unstageable means the base is hidden by slough or eschar, and this base is fully visible."
    ]
   },
   ". The left heel has a wound covered completely by dry black eschar, so its depth cannot be seen. This is ",
   {
    "opts": [
     "an unstageable pressure injury",
     "a stage 4 pressure injury",
     "a stage 3 pressure injury"
    ],
    "ans": 0,
    "whys": [
     "Yes: When eschar or slough hides the wound base, the depth is unknown and the injury is called unstageable.",
     "No: Stage 4 requires visible bone, tendon or muscle; the trap is assuming black tissue means the deepest stage.",
     "No: The depth cannot be seen, so the nurse cannot assign stage 3."
    ]
   },
   "."
  ],
  "why": "Staging depends on what the nurse can see: intact skin with nonblanchable redness is stage 1, partial-thickness loss with exposed dermis is stage 2, and a base hidden by eschar or slough is unstageable. Stable, dry eschar on the heel is usually left in place because it acts as a natural cover.",
  "tip": "Stage only what you can see; if the wound base is hidden, the answer is unstageable."
 },
 {
  "id": "qb-basic-2",
  "type": "sata",
  "step": "solve",
  "cn": "basic",
  "sp": "ms",
  "topic": "Pressure injury prevention",
  "stem": "A 79-year-old who had a stroke is on bed rest on the med-surg unit. His Braden score is 12. He is sometimes incontinent of urine and eats about half of each meal.",
  "q": "Which interventions should the nurse include in his plan of care? Select all that apply.",
  "opts": [
   {
    "t": "Reposition him at least every 2 hours on a written turning schedule",
    "ok": true,
    "why": "Yes: Regular repositioning relieves pressure over bony prominences before tissue damage begins."
   },
   {
    "t": "Float his heels off the bed with a pillow under his calves",
    "ok": true,
    "why": "Yes: Heels are a common site of pressure injury; lifting them off the mattress removes the pressure entirely."
   },
   {
    "t": "Keep the head of the bed at or below 30 degrees except during meals",
    "ok": true,
    "why": "Yes: Higher angles cause sliding and shear over the sacrum; raising the head for meals still protects him from aspiration."
   },
   {
    "t": "Clean his skin promptly after incontinence and apply a moisture barrier",
    "ok": true,
    "why": "Yes: Moisture softens skin and makes it break down faster; gentle cleansing and a barrier protect it."
   },
   {
    "t": "Request a dietitian consult for protein and calorie intake",
    "ok": true,
    "why": "Yes: Eating half of meals puts him at nutritional risk, and adequate protein is needed to keep skin intact."
   },
   {
    "t": "Massage reddened areas over bony prominences",
    "ok": false,
    "why": "No: Massage can damage fragile tissue and capillaries that are already injured. The trap is thinking it improves circulation."
   },
   {
    "t": "Place a donut-shaped cushion under his sacrum",
    "ok": false,
    "why": "No: Ring cushions concentrate pressure on the surrounding tissue and reduce blood flow to the center."
   }
  ],
  "why": "A Braden score of 12 indicates high risk; lower scores mean higher risk, and 18 or less signals risk. Prevention targets each subscale: relieve pressure, reduce shear, manage moisture and support nutrition. Massage over reddened bony prominences and donut cushions are outdated and harmful.",
  "tip": "Match interventions to the Braden subscales the stem describes: mobility, moisture, nutrition, and friction and shear."
 },
 {
  "id": "qb-basic-3",
  "type": "mc",
  "step": "hypo",
  "cn": "basic",
  "sp": "icu",
  "topic": "Aspiration during tube feeding",
  "stem": "The ICU nurse receives report on four clients receiving continuous enteral feedings.",
  "q": "Which client should the nurse assess first?",
  "opts": [
   {
    "t": "A client receiving feeding at 60 mL/h who is now coughing, with new gurgling breath sounds and SpO₂ 89% (was 96%)",
    "ok": true,
    "why": "Yes: New coughing, gurgling and falling oxygen saturation during a feeding suggest aspiration, an airway and breathing problem that needs action now."
   },
   {
    "t": "A client with a gastric residual volume of 150 mL, within the unit's policy",
    "ok": false,
    "why": "No: A residual within policy does not require holding the feeding; it can be reassessed on schedule."
   },
   {
    "t": "A client with the head of the bed at 35 degrees who is resting comfortably",
    "ok": false,
    "why": "No: Head of bed at 30 degrees or higher is correct aspiration prevention, and the client is stable."
   },
   {
    "t": "A client with two loose stools in the last 8 hours",
    "ok": false,
    "why": "No: Diarrhea is a common feeding problem that needs follow-up, but it is not as urgent as a threatened airway."
   }
  ],
  "why": "Aspiration is the most dangerous complication of enteral feeding. A client with new coughing, gurgling and dropping oxygen saturation during a feeding needs immediate assessment: stop the feeding, suction as needed and notify the provider. The other clients are stable or have expected findings.",
  "tip": "When prioritizing, the client with a new airway or breathing change comes before clients with stable or chronic problems."
 },
 {
  "id": "qb-basic-4",
  "type": "order",
  "step": "act",
  "cn": "basic",
  "sp": "comm",
  "topic": "Bolus gastrostomy feeding",
  "stem": "A home health nurse is teaching the spouse of a 70-year-old how to give an intermittent bolus feeding through a gastrostomy tube that was placed 3 months ago.",
  "q": "Place the steps in the order the spouse should perform them.",
  "opts": [
   "Sit the client upright at 30 to 45 degrees or higher, then check that the external mark on the tube is at its usual position at the skin",
   "Flush the tube with 30 mL of water",
   "Give the feeding slowly by gravity, raising or lowering the syringe to control the flow",
   "Flush the tube with water and keep the client upright for 30 to 60 minutes"
  ],
  "whys": [
   "Yes: Positioning protects the airway during every later step, and placement is confirmed before anything enters the tube; a mark that has moved means the tube may have migrated.",
   "Yes: A water flush checks that the tube is open before formula is given.",
   "Yes: Slow gravity flow lowers the risk of cramping, nausea and reflux that can lead to aspiration.",
   "Yes: The final flush clears formula from the tube to prevent clogs, and staying upright lets the stomach empty, lowering aspiration risk."
  ],
  "why": "Safe bolus feeding follows a fixed sequence: position upright, confirm placement, flush, feed slowly, then flush and keep the client upright. Each step either protects the airway or keeps the tube working. If the agency's policy calls for residual checks, they happen after placement is confirmed.",
  "tip": "For tube feeding sequences, positioning and placement checks always come before anything goes into the tube."
 },
 {
  "id": "qb-basic-5",
  "type": "matrix",
  "step": "eval",
  "cn": "basic",
  "sp": "ms",
  "topic": "Dysphagia precautions",
  "stem": "A 72-year-old had a stroke 4 days ago. The speech-language pathologist ordered mildly thick liquids, a minced and moist diet, and aspiration precautions, including a chin tuck when swallowing. The nurse observes a UAP assisting her with lunch.",
  "q": "For each UAP action, indicate whether it is appropriate or requires the nurse to intervene.",
  "cols": [
   "Appropriate",
   "Requires intervention"
  ],
  "rows": [
   {
    "t": "Sits the client fully upright in a chair for the meal",
    "ans": 0,
    "why": "upright positioning helps food move down the esophagus and protects the airway."
   },
   {
    "t": "Offers small bites and waits for each swallow",
    "ans": 0,
    "why": "small amounts with time to swallow lower the risk that food enters the airway."
   },
   {
    "t": "Reminds her to tuck her chin when she swallows",
    "ans": 0,
    "why": "the chin tuck ordered by the speech-language pathologist narrows the airway entrance during the swallow."
   },
   {
    "t": "Gives her thin water through a straw because she is thirsty",
    "ans": 1,
    "why": "thin liquids move too fast for a weak swallow, and straws increase the volume and speed. All liquids must be thickened as ordered."
   },
   {
    "t": "Checks her weak cheek for pocketed food after the meal",
    "ans": 0,
    "why": "food can collect on the weak side after a stroke and be aspirated later."
   },
   {
    "t": "Lays the bed flat 10 minutes after the meal so she can nap",
    "ans": 1,
    "why": "she should stay upright for about 30 minutes after eating to prevent reflux and aspiration."
   }
  ],
  "why": "Dysphagia precautions keep food and fluid out of the airway: upright positioning, small bites, ordered swallowing techniques, prescribed consistencies and checking for pocketing. Thin liquids, straws and lying flat soon after eating all raise aspiration risk and require the nurse to step in.",
  "tip": "For each action, ask whether it speeds food toward the airway or slows it; anything that speeds it requires intervention."
 },
 {
  "id": "qb-basic-6",
  "type": "sata",
  "step": "analyze",
  "cn": "basic",
  "sp": "ob",
  "topic": "Postpartum urinary retention",
  "stem": "A 29-year-old is 7 hours postpartum after a vaginal birth with epidural anesthesia. Since the birth she has voided twice, 40 mL and 50 mL. She says she still feels like she needs to go.",
  "q": "Which findings are consistent with urinary retention? Select all that apply.",
  "opts": [
   {
    "t": "Fundus 2 cm above the umbilicus and displaced to the right",
    "ok": true,
    "why": "Yes: A full bladder pushes the uterus up and to one side, which also keeps it from contracting well."
   },
   {
    "t": "Palpable fullness above the symphysis pubis",
    "ok": true,
    "why": "Yes: A distended bladder rises above the pubic bone and can be felt on palpation."
   },
   {
    "t": "Bladder scan volume of 700 mL",
    "ok": true,
    "why": "Yes: This volume after small voids shows she is not emptying her bladder."
   },
   {
    "t": "Small, frequent voids of 40 to 50 mL",
    "ok": true,
    "why": "Yes: Repeated small voids suggest overflow from a full bladder. The trap is reading any voiding as adequate emptying."
   },
   {
    "t": "Lochia rubra, moderate amount",
    "ok": false,
    "why": "No: Moderate red lochia is expected in the first days after birth."
   },
   {
    "t": "BP 118/72, HR 78",
    "ok": false,
    "why": "No: These vital signs are normal and do not point to retention."
   },
   {
    "t": "Breasts soft with colostrum expressible",
    "ok": false,
    "why": "No: This is a normal early postpartum breast finding unrelated to bladder emptying."
   }
  ],
  "why": "Epidural anesthesia, birth trauma and perineal swelling put postpartum clients at risk for urinary retention. A high, displaced fundus, suprapubic fullness, small frequent voids and a large bladder scan volume all point to retention. A full bladder also raises the risk of postpartum hemorrhage by keeping the uterus from contracting.",
  "tip": "In postpartum items, a fundus that is high and off to one side should make you think of the bladder first."
 },
 {
  "id": "qb-basic-7",
  "type": "mc",
  "step": "eval",
  "cn": "basic",
  "sp": "ms",
  "topic": "CAUTI prevention",
  "stem": "A 68-year-old has an indwelling urinary catheter after hip surgery. The nurse observes a UAP providing her morning care.",
  "q": "Which action by the UAP requires the nurse to intervene?",
  "opts": [
   {
    "t": "Places the drainage bag on the client's abdomen while turning her",
    "ok": true,
    "why": "Yes: Raising the bag above bladder level lets urine flow back into the bladder and increases the risk of infection."
   },
   {
    "t": "Secures the catheter tubing to the client's upper thigh",
    "ok": false,
    "why": "No: Securing the tubing prevents pulling and movement that can injure the urethra and introduce bacteria."
   },
   {
    "t": "Cleans the perineum and the catheter near the meatus with soap and water",
    "ok": false,
    "why": "No: Routine cleaning with soap and water during hygiene is the recommended practice."
   },
   {
    "t": "Empties the bag into a container used only for this client, without letting the spout touch it",
    "ok": false,
    "why": "No: A separate container and a clean spout prevent cross-contamination, which is correct technique."
   }
  ],
  "why": "CAUTI prevention keeps urine flowing one way and the system closed and clean: bag below the bladder and off the floor, tubing secured without kinks, daily hygiene and clean emptying technique. Most important, the nurse asks each day whether the catheter is still needed and gets it removed as soon as possible.",
  "tip": "In observe-and-intervene items, look for the action that breaks a basic principle such as gravity, asepsis or safety."
 },
 {
  "id": "qb-basic-8",
  "type": "highlight",
  "step": "cues",
  "cn": "basic",
  "sp": "ms",
  "topic": "Sleep disruption in hospital",
  "stem": "Nurse's note at 06:00 for a 76-year-old admitted 2 days ago with left leg cellulitis. She says she slept about 2 hours and feels exhausted.",
  "q": "Highlight the factors likely disrupting her sleep that the nurse can address.",
  "parts": [
   {
    "t": "Vital signs taken at 00:00, 02:00 and 04:00 while stable for 36 hours.",
    "ok": true,
    "why": "Yes: Frequent overnight checks on a stable client break up sleep; the nurse can ask the provider to adjust the frequency."
   },
   {
    "t": "Furosemide 40 mg IV given at 21:00.",
    "ok": true,
    "why": "Yes: A diuretic given late in the evening causes nighttime urination. The nurse can request an earlier scheduled time."
   },
   {
    "t": "Drank two cups of coffee with dinner at 18:00.",
    "ok": true,
    "why": "Yes: Caffeine in the evening delays sleep; the nurse can offer decaffeinated drinks after midday."
   },
   {
    "t": "Door left open with hall lights on overnight.",
    "ok": true,
    "why": "Yes: Light and noise from the hallway disrupt sleep; closing the door or dimming lights is a simple fix."
   },
   {
    "t": "Says she usually reads for 20 minutes before bed at home.",
    "ok": false,
    "why": "No: A familiar bedtime routine supports sleep, so the nurse should encourage it rather than treat it as a problem."
   },
   {
    "t": "Leg pain rated 2/10, redness fading.",
    "ok": false,
    "why": "No: Her pain is well controlled and the infection is improving, so pain is not the cause of her poor sleep."
   }
  ],
  "why": "Hospital routines are a common cause of poor sleep. Unnecessary overnight vital signs, late diuretic doses, evening caffeine and light and noise can all be changed by the nurse or with a quick request to the provider. Supporting the client's usual bedtime routine helps.",
  "tip": "Look for factors the care team itself controls; those are the easiest and most effective to change."
 },
 {
  "id": "qb-basic-9",
  "type": "matrix",
  "step": "cues",
  "cn": "basic",
  "sp": "ms",
  "topic": "Pain assessment scales",
  "stem": "A float nurse is assigned to several clients across the hospital and must choose the right pain assessment tool for each.",
  "q": "For each client, indicate the most appropriate pain assessment tool.",
  "cols": [
   "FLACC scale",
   "Critical-Care Pain Observation Tool (CPOT)",
   "Numeric rating scale (0 to 10)"
  ],
  "rows": [
   {
    "t": "A 2-year-old after a tonsillectomy",
    "ans": 0,
    "why": "FLACC scores face, legs, activity, cry and consolability for children too young to rate their own pain."
   },
   {
    "t": "A 6-month-old after a hernia repair",
    "ans": 0,
    "why": "FLACC is validated for infants and young children who cannot describe pain in words."
   },
   {
    "t": "An intubated, sedated adult in the ICU after abdominal surgery",
    "ans": 1,
    "why": "CPOT uses facial expression, body movement, muscle tension and ventilator tolerance in critically ill adults who cannot self-report."
   },
   {
    "t": "An alert 45-year-old after a knee replacement",
    "ans": 2,
    "why": "self-report is the most reliable measure of pain, and an alert adult can rate it on a 0 to 10 scale."
   },
   {
    "t": "An alert 14-year-old after an appendectomy",
    "ans": 2,
    "why": "school-age children and adolescents who understand numbers can reliably use the numeric scale."
   }
  ],
  "why": "Self-report is the gold standard whenever the client can give it, so alert adults and older children use a numeric scale. When a client cannot self-report, the nurse uses a validated behavioral tool: FLACC for infants and young children, and CPOT for critically ill adults such as those on a ventilator.",
  "tip": "First ask whether the client can self-report; only if they cannot, choose the behavioral tool that fits their age and setting."
 },
 {
  "id": "qb-basic-10",
  "type": "sata",
  "step": "act",
  "cn": "basic",
  "sp": "comm",
  "topic": "End-of-life comfort care",
  "stem": "A home hospice nurse visits an 84-year-old with end-stage heart failure who is actively dying. He is unresponsive, with noisy, gurgling respirations, a dry mouth and cool, mottled knees. His daughter asks what she can do to keep him comfortable.",
  "q": "Which actions should the nurse take or teach? Select all that apply.",
  "opts": [
   {
    "t": "Provide mouth care with moist swabs and apply lip balm",
    "ok": true,
    "why": "Yes: Mouth breathing dries the mouth and lips; frequent moist care relieves discomfort without the risk of giving fluids."
   },
   {
    "t": "Turn him onto his side with the head slightly raised",
    "ok": true,
    "why": "Yes: Side-lying lets secretions drain from the throat and quiets noisy breathing."
   },
   {
    "t": "Encourage his daughter to talk to him and hold his hand",
    "ok": true,
    "why": "Yes: Hearing may remain near the end of life, and presence and touch comfort both the client and family."
   },
   {
    "t": "Continue the scheduled comfort medications as ordered",
    "ok": true,
    "why": "Yes: Medications for breathlessness and pain remain important when the client cannot report symptoms, and they are not stopped because death is near."
   },
   {
    "t": "Suction deep in his throat every hour to clear the gurgling",
    "ok": false,
    "why": "No: Deep suctioning is distressing and stimulates more secretions. Positioning and ordered medications are preferred, with gentle oral suction only if needed."
   },
   {
    "t": "Have his daughter give him sips of water to prevent dehydration",
    "ok": false,
    "why": "No: An unresponsive client cannot swallow safely, and fluids can cause choking. Mouth care treats the dry mouth instead."
   },
   {
    "t": "Place heated blankets on his knees to reverse the mottling",
    "ok": false,
    "why": "No: Mottling is an expected sign as circulation slows. Heat can burn fragile skin; a light blanket is enough."
   }
  ],
  "why": "At the end of life, care shifts fully to comfort. Mouth care, positioning, continued comfort medications and family presence ease symptoms. Noisy respirations and mottling are expected signs of dying; the nurse explains them to the family and avoids interventions such as deep suctioning or oral fluids that add distress.",
  "tip": "For end-of-life items, choose actions that ease symptoms and support the family, not ones aimed at reversing the dying process."
 },
 {
  "id": "qb-basic-11",
  "type": "mc",
  "step": "eval",
  "cn": "basic",
  "sp": "comm",
  "topic": "Cane teaching",
  "stem": "A 71-year-old with osteoarthritis of the left knee is learning to walk with a single-point cane at a clinic visit.",
  "q": "Which statement by the client indicates correct understanding of the teaching?",
  "opts": [
   {
    "t": "\"I will hold the cane in my right hand and move it forward with my left leg.\"",
    "ok": true,
    "why": "Yes: The cane goes on the stronger side and moves with the weak leg, so it shares the load and gives a wider base of support."
   },
   {
    "t": "\"I will hold the cane in my left hand so it supports my sore knee.\"",
    "ok": false,
    "why": "No: Holding the cane on the weak side makes the client lean toward the painful leg. This is the most common cane teaching trap."
   },
   {
    "t": "\"I will step forward with my right leg first, then bring the cane and my left leg.\"",
    "ok": false,
    "why": "No: The cane and the weak leg move forward together first, then the strong leg steps through."
   },
   {
    "t": "\"The cane should be tall enough that my elbow is straight when I hold it.\"",
    "ok": false,
    "why": "No: The handle should be at the hip or wrist crease so the elbow bends about 15 to 30 degrees."
   }
  ],
  "why": "A cane is held on the stronger side, opposite the affected leg. The cane and weak leg advance together, then the strong leg follows. The correct height leaves the elbow slightly bent, which lets the arm push down and bear weight.",
  "tip": "For cane questions, remember the cane goes on the strong side and moves with the weak leg."
 },
 {
  "id": "qb-basic-12",
  "type": "mc",
  "step": "solve",
  "cn": "basic",
  "sp": "comm",
  "topic": "Bowel program after SCI",
  "stem": "A 32-year-old with a T10 spinal cord injury is home with home health support and is setting up a bowel program to prevent constipation and accidents. He eats breakfast every day at 07:30.",
  "q": "When should the nurse recommend he do his daily bowel program?",
  "opts": [
   {
    "t": "About 30 minutes after breakfast each day",
    "ok": true,
    "why": "Yes: Eating triggers the gastrocolic reflex, which moves stool toward the rectum, and doing it at the same time daily trains the bowel."
   },
   {
    "t": "Whenever he feels the urge to have a bowel movement",
    "ok": false,
    "why": "No: Spinal cord injury often reduces sensation, so he may not feel the urge. A program depends on a planned time."
   },
   {
    "t": "Before breakfast, on an empty stomach",
    "ok": false,
    "why": "No: Without a meal there is no gastrocolic reflex to help move stool, so the program works less well."
   },
   {
    "t": "At a different time each day depending on his schedule",
    "ok": false,
    "why": "No: Consistency is the core of a bowel program; changing times makes it harder to train the bowel and prevent accidents."
   }
  ],
  "why": "A bowel program uses the same time every day, usually after a meal to take advantage of the gastrocolic reflex. It also includes adequate fiber and fluid, activity, and techniques such as digital stimulation or a suppository as ordered. Consistency prevents both constipation and accidents.",
  "tip": "For bowel training items, look for the answer that builds a consistent routine around a natural reflex."
 },
 {
  "id": "qb-phys-1",
  "type": "mc",
  "step": "solve",
  "cn": "physio",
  "sp": "ed",
  "topic": "Status epilepticus",
  "stem": "A 34-year-old with a seizure disorder is brought to the emergency department having a generalized tonic-clonic seizure. The paramedics report it started 7 minutes ago and has not stopped. The client is on her side with oxygen by nonrebreather mask, and an IV is in place. Fingerstick glucose is 104 mg/dL.",
  "q": "Which medication should the nurse prepare to give first?",
  "opts": [
   {
    "t": "Lorazepam IV",
    "ok": true,
    "why": "Yes: a seizure lasting 5 minutes or longer is status epilepticus, and an IV benzodiazepine is first-line therapy to stop it."
   },
   {
    "t": "Fosphenytoin IV",
    "ok": false,
    "why": "No: fosphenytoin is a second-line drug given after a benzodiazepine to prevent recurrence. The trap is choosing a seizure drug that is not the fastest to act."
   },
   {
    "t": "Dextrose 50% IV",
    "ok": false,
    "why": "No: the glucose is 104 mg/dL, so hypoglycemia is not causing the seizure and dextrose will not stop it."
   },
   {
    "t": "Haloperidol IM",
    "ok": false,
    "why": "No: haloperidol is an antipsychotic that can lower the seizure threshold; it has no role in stopping a seizure."
   }
  ],
  "why": "A seizure that lasts 5 minutes or longer, or repeated seizures without recovery between them, is status epilepticus. Prolonged seizure activity causes hypoxia and brain injury, so it is treated as an emergency. An IV benzodiazepine such as lorazepam comes first, followed by a longer-acting antiseizure drug.",
  "tip": "For drug-sequence questions, ask which drug acts fastest on the immediate threat, then which one prevents it from coming back."
 },
 {
  "id": "qb-phys-2",
  "type": "sata",
  "step": "solve",
  "cn": "physio",
  "sp": "sd",
  "topic": "Symptomatic bradycardia",
  "stem": "A 71-year-old on the telemetry unit calls the nurse and says he feels dizzy and weak. The monitor shows sinus bradycardia at 36. BP 78/44, RR 18, SpO₂ 95% on room air. His skin is cool and he is slow to answer questions.",
  "q": "Which interventions should the nurse anticipate? Select all that apply.",
  "opts": [
   {
    "t": "Atropine 1 mg IV",
    "ok": true,
    "why": "Yes: atropine is the first-line drug for symptomatic bradycardia and may be repeated every 3 to 5 minutes to a total of 3 mg."
   },
   {
    "t": "Prepare for transcutaneous pacing",
    "ok": true,
    "why": "Yes: pacing is the next step if atropine does not work, so pads and the pacer should be ready now in a client this unstable."
   },
   {
    "t": "Obtain a 12-lead ECG",
    "ok": true,
    "why": "Yes: a 12-lead shows the rhythm in detail and can reveal heart block or an inferior MI causing the slow rate."
   },
   {
    "t": "Adenosine 6 mg rapid IV push",
    "ok": false,
    "why": "No: adenosine briefly stops conduction through the AV node and is used for SVT. Giving it to a client with bradycardia could cause asystole."
   },
   {
    "t": "Synchronized cardioversion",
    "ok": false,
    "why": "No: cardioversion treats unstable fast rhythms. The trap is reacting to instability without noticing the rate is slow."
   },
   {
    "t": "Ask the client to bear down as if having a bowel movement",
    "ok": false,
    "why": "No: bearing down stimulates the vagus nerve and slows the heart further, which is the opposite of what he needs."
   }
  ],
  "why": "A slow rate is treated when it causes symptoms such as hypotension, altered mental status or signs of shock. Atropine is the first drug. If it fails, transcutaneous pacing or an epinephrine or dopamine infusion follows. A 12-lead helps find the cause.",
  "tip": "Decide first whether the rhythm is too fast or too slow, then eliminate every option that treats the opposite problem."
 },
 {
  "id": "qb-phys-3",
  "type": "mc",
  "step": "act",
  "cn": "physio",
  "sp": "ed",
  "topic": "Stable SVT",
  "stem": "A 27-year-old comes to the emergency department with a pounding heartbeat that started suddenly 30 minutes ago. The monitor shows a regular narrow-complex tachycardia at 192. BP 122/78, RR 18, SpO₂ 98% on room air. She is alert, oriented and denies chest pain or shortness of breath. An IV is in place.",
  "q": "Which action should the nurse take first?",
  "opts": [
   {
    "t": "Coach her to perform a vagal maneuver, such as bearing down as if having a bowel movement",
    "ok": true,
    "why": "Yes: she is stable, so vagal maneuvers are tried first. Vagal stimulation slows AV node conduction and can end the rhythm without drugs."
   },
   {
    "t": "Give adenosine 6 mg rapid IV push followed by a saline flush",
    "ok": false,
    "why": "No: adenosine is the next step if vagal maneuvers fail. It is correct therapy but not the first action for a stable client."
   },
   {
    "t": "Prepare for synchronized cardioversion",
    "ok": false,
    "why": "No: cardioversion is for SVT with instability such as hypotension, chest pain or altered mental status. Her BP and mental status are normal."
   },
   {
    "t": "Prepare to defibrillate",
    "ok": false,
    "why": "No: defibrillation is only for pulseless VT or VF. Shocking an organized rhythm with a pulse without synchronization can cause VF."
   }
  ],
  "why": "Treatment of SVT depends on stability. A stable client gets vagal maneuvers first, then adenosine 6 mg rapid IV push, then 12 mg if needed. An unstable client gets synchronized cardioversion. Her normal BP and mental status make her stable.",
  "tip": "With any tachycardia, decide stable or unstable first; the least invasive effective step goes first for a stable client."
 },
 {
  "id": "qb-phys-4",
  "type": "matrix",
  "step": "analyze",
  "cn": "physio",
  "sp": "icu",
  "topic": "Ventilator alarms",
  "stem": "A 60-year-old in the ICU is intubated and on mechanical ventilation for pneumonia. The nurse is reviewing possible causes of ventilator alarms with a new graduate.",
  "q": "For each cause, indicate whether it would trigger a high-pressure alarm or a low-pressure alarm.",
  "cols": [
   "High-pressure alarm",
   "Low-pressure alarm"
  ],
  "rows": [
   {
    "t": "Thick secretions in the airway that need suctioning",
    "ans": 0,
    "why": "secretions narrow the airway, so the ventilator needs more pressure to deliver each breath."
   },
   {
    "t": "Client biting down on the endotracheal tube",
    "ans": 0,
    "why": "biting partly blocks the tube, which raises resistance and airway pressure. A bite block may be needed."
   },
   {
    "t": "Client coughing or fighting the ventilator",
    "ans": 0,
    "why": "coughing against a delivered breath raises airway pressure. The nurse looks for causes such as pain, anxiety or hypoxemia."
   },
   {
    "t": "Ventilator tubing disconnected from the endotracheal tube",
    "ans": 1,
    "why": "air escapes into the room instead of the lungs, so pressure falls. This is the first thing to check at the bedside."
   },
   {
    "t": "Leak around a deflated endotracheal tube cuff",
    "ans": 1,
    "why": "air escapes around the tube, so the circuit cannot hold pressure. The client may be able to make sounds around the tube."
   },
   {
    "t": "Water collected in a kinked section of tubing",
    "ans": 0,
    "why": "a kink or pooled water obstructs flow and raises pressure; the trap is assuming any tubing problem causes a low-pressure alarm."
   }
  ],
  "why": "High-pressure alarms mean something is blocking or resisting airflow: secretions, biting, coughing, kinks or bronchospasm. Low-pressure alarms mean air is escaping: a disconnection or a cuff leak. If the cause cannot be found quickly, the nurse removes the client from the ventilator and bags with 100% oxygen.",
  "tip": "Think high pressure means blocked and low pressure means leaking, then sort each cause by which one it produces."
 },
 {
  "id": "qb-phys-5",
  "type": "bowtie",
  "step": "hypo",
  "cn": "physio",
  "sp": "ed",
  "topic": "Diabetic ketoacidosis",
  "stem": "A 22-year-old with type 1 diabetes comes to the emergency department after 2 days of vomiting. She ran out of insulin 3 days ago. Breathing is deep and rapid, and her breath smells fruity. HR 124, BP 98/60, RR 30. Labs: glucose 486 mg/dL, pH 7.16, bicarbonate 9 mEq/L, potassium 5.2 mEq/L, serum ketones positive.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Diabetic ketoacidosis",
    "Hyperosmolar hyperglycemic state",
    "Hypoglycemia",
    "Thyroid storm"
   ],
   "ans": 0
  },
  "actions": {
   "opts": [
    "Infuse 0.9% sodium chloride IV as ordered",
    "Start a continuous IV regular insulin infusion as ordered once potassium is confirmed at 3.5 mEq/L or higher",
    "Give sodium bicarbonate IV push",
    "Give insulin glargine subcutaneously as the only insulin",
    "Give 50 mL of 50% dextrose IV"
   ],
   "ans": [
    0,
    1
   ]
  },
  "params": {
   "opts": [
    "Serum potassium",
    "Blood glucose every hour",
    "Hemoglobin A1C",
    "Serum lipase",
    "Peak expiratory flow"
   ],
   "ans": [
    0,
    1
   ]
  },
  "whys": {
   "cond": [
    "Yes: high glucose with acidosis, low bicarbonate, ketones and Kussmaul breathing in a client with type 1 diabetes who missed insulin is DKA.",
    "No: HHS usually occurs in type 2 diabetes with glucose often above 600 mg/dL and little or no ketosis or acidosis.",
    "No: her glucose is 486 mg/dL. Hypoglycemia causes shakiness and sweating, not ketones and acidosis.",
    "No: thyroid storm causes fever, tachycardia and agitation, but not ketoacidosis with a glucose of 486 mg/dL."
   ],
   "actions": [
    "Yes: DKA causes severe fluid loss from osmotic diuresis and vomiting, so isotonic fluid replacement comes first to restore perfusion.",
    "Yes: IV regular insulin stops ketone production. Potassium is checked first because insulin drives potassium into cells and can cause dangerous hypokalemia.",
    "No: bicarbonate is not routine in DKA and is reserved for very severe acidosis, about pH below 7.0. Insulin and fluids correct the acidosis.",
    "No: long-acting subcutaneous insulin alone is absorbed too slowly and unpredictably to treat DKA in a client who is volume depleted.",
    "No: her glucose is already very high. Dextrose is added to the IV fluid later, when glucose falls toward 250 mg/dL, not given as a bolus now."
   ],
   "params": [
    "Yes: potassium shifts into cells as insulin and fluids work, so a normal or high level can fall fast and cause dysrhythmias.",
    "Yes: hourly glucose guides the insulin rate and tells the team when to add dextrose so the glucose does not drop too quickly.",
    "No: A1C shows control over the past 3 months; it does not change minute-to-minute management of DKA.",
    "No: lipase is used to evaluate pancreatitis and is not a marker of DKA treatment response.",
    "No: peak flow measures airflow in asthma; her rapid breathing is a compensation for metabolic acidosis, not airway obstruction."
   ]
  },
  "why": "Missed insulin, hyperglycemia, ketones, low bicarbonate and Kussmaul respirations make this DKA. Treatment is IV isotonic fluid, then an IV regular insulin infusion once potassium is at least 3.5 mEq/L, with potassium replaced as it falls. Glucose and potassium are checked often because both change quickly with treatment.",
  "tip": "In DKA, remember that insulin lowers potassium; any answer about starting insulin must account for the potassium level."
 },
 {
  "id": "qb-phys-6",
  "type": "matrix",
  "step": "analyze",
  "cn": "physio",
  "sp": "icu",
  "topic": "SIADH versus diabetes insipidus",
  "stem": "The ICU nurse is caring for two clients after neurosurgery. Each develops a disorder of antidiuretic hormone (ADH): one has too much ADH and one has too little.",
  "q": "For each finding, indicate whether it is more consistent with SIADH or with diabetes insipidus.",
  "cols": [
   "SIADH",
   "Diabetes insipidus"
  ],
  "rows": [
   {
    "t": "Serum sodium 124 mEq/L",
    "ans": 0,
    "why": "excess ADH makes the kidneys hold water, which dilutes the sodium in the blood."
   },
   {
    "t": "Urine specific gravity 1.032 with low urine output",
    "ans": 0,
    "why": "the kidneys keep reabsorbing water, so the small amount of urine made is very concentrated."
   },
   {
    "t": "Urine output 400 mL/h of pale, dilute urine",
    "ans": 1,
    "why": "without ADH the kidneys cannot concentrate urine, so large volumes of dilute urine are lost."
   },
   {
    "t": "Serum sodium 152 mEq/L with intense thirst",
    "ans": 1,
    "why": "losing free water concentrates the blood, raising sodium and triggering thirst."
   },
   {
    "t": "Treated with fluid restriction",
    "ans": 0,
    "why": "limiting water intake lets sodium rise back toward normal when the body is holding too much water."
   },
   {
    "t": "Treated with desmopressin",
    "ans": 1,
    "why": "desmopressin replaces the missing ADH. The trap is giving it in SIADH, which would worsen water retention."
   }
  ],
  "why": "SIADH and diabetes insipidus are mirror images. Too much ADH holds water, so urine is scant and concentrated and sodium falls. Too little ADH loses water, so urine is large and dilute and sodium rises. Fluid restriction treats SIADH; desmopressin and fluid replacement treat DI.",
  "tip": "Picture what ADH does to water, then decide whether each finding shows water held or water lost."
 },
 {
  "id": "qb-phys-7",
  "type": "mc",
  "step": "cues",
  "cn": "physio",
  "sp": "icu",
  "topic": "Increased intracranial pressure",
  "stem": "A 45-year-old is in the ICU after a traumatic brain injury from a fall. The nurse reviews the trends over the past 4 hours.",
  "q": "Which set of findings requires the nurse to notify the provider immediately?",
  "opts": [
   {
    "t": "BP 184/62, HR 50, irregular respirations",
    "ok": true,
    "why": "Yes: a widening pulse pressure, bradycardia and irregular breathing are Cushing's triad, a late sign that the brainstem is being compressed."
   },
   {
    "t": "BP 128/76, HR 84, RR 16 and regular",
    "ok": false,
    "why": "No: these are normal vital signs with a normal pulse pressure and no sign of brainstem compression."
   },
   {
    "t": "ICP 13 mm Hg with cerebral perfusion pressure 74 mm Hg",
    "ok": false,
    "why": "No: an ICP under 15 mm Hg and a CPP of 60 mm Hg or higher are within target ranges."
   },
   {
    "t": "Temperature 37.6 °C (99.7 °F) and GCS 14, unchanged",
    "ok": false,
    "why": "No: a stable GCS and a minimally raised temperature need monitoring but do not signal acute deterioration."
   }
  ],
  "why": "Cushing's triad is rising systolic pressure with a widening pulse pressure, bradycardia and an irregular breathing pattern. It is a late sign of increased intracranial pressure and can mean impending herniation. The earliest sign is usually a change in level of consciousness.",
  "tip": "When one option shows a combination of abnormal findings that make a named syndrome, that option usually carries the urgent cue."
 },
 {
  "id": "qb-phys-8",
  "type": "mc",
  "step": "act",
  "cn": "physio",
  "sp": "ms",
  "topic": "Autonomic dysreflexia",
  "stem": "A 30-year-old with a complete T4 spinal cord injury is lying in bed on the rehabilitation unit. He suddenly reports a pounding headache. BP 202/108, HR 52. His face and neck are flushed and sweaty, and his legs are cool and pale.",
  "q": "Which action should the nurse take first?",
  "opts": [
   {
    "t": "Raise the head of the bed and sit him upright with his legs lowered",
    "ok": true,
    "why": "Yes: sitting upright pools blood in the legs and lowers blood pressure right away, buying time to find the trigger."
   },
   {
    "t": "Check his bladder for distention and his catheter for kinks",
    "ok": false,
    "why": "No: a full bladder is the most common trigger and is checked next, but the BP is lowered by positioning first."
   },
   {
    "t": "Give the PRN antihypertensive",
    "ok": false,
    "why": "No: medication is used if BP stays high after positioning and removing the trigger. The trap is skipping fast, nondrug steps."
   },
   {
    "t": "Lay him flat and elevate his legs",
    "ok": false,
    "why": "No: this increases venous return and raises blood pressure further, which can lead to stroke or seizure."
   }
  ],
  "why": "Autonomic dysreflexia happens in injuries at T6 or above when a stimulus below the injury, most often a full bladder or bowel, triggers uncontrolled sympathetic activity. BP can reach stroke levels. The nurse sits the client up, loosens tight clothing, then finds and removes the trigger, and gives an antihypertensive if BP stays high.",
  "tip": "When two options are both correct, choose the one that works fastest to reduce the immediate danger."
 },
 {
  "id": "qb-phys-9",
  "type": "order",
  "step": "act",
  "cn": "physio",
  "sp": "sd",
  "topic": "Ventricular fibrillation",
  "stem": "A 66-year-old on the telemetry unit is found slumped in bed. The monitor shows ventricular fibrillation. A manual defibrillator is on the crash cart in the hallway.",
  "q": "Place the nurse's actions in the order they should be performed.",
  "opts": [
   "Check for responsiveness and shout for help to activate the emergency response team",
   "Check for breathing and a carotid pulse for no more than 10 seconds",
   "Begin high-quality chest compressions",
   "Place defibrillator pads on the chest while compressions continue",
   "Deliver one shock when the defibrillator is charged and everyone is clear",
   "Resume chest compressions immediately for 2 minutes before the next rhythm check"
  ],
  "whys": [
   "Yes: the monitor can be wrong because of a loose lead, so the nurse confirms the client is unresponsive and calls for help and the defibrillator at once.",
   "Yes: a quick check of breathing and pulse confirms cardiac arrest; limiting it to 10 seconds avoids delaying CPR.",
   "Yes: compressions start right away to circulate oxygen to the brain and heart until the defibrillator arrives.",
   "Yes: pads go on while a second rescuer keeps compressing, so pauses in compressions are kept as short as possible.",
   "Yes: VF is a shockable rhythm, and early defibrillation is the treatment most likely to restore an organized rhythm.",
   "Yes: compressions resume right after the shock without a pulse check, because the heart rarely pumps well in the first seconds after a shock."
  ],
  "why": "For in-hospital VF arrest, the nurse confirms unresponsiveness, calls for help, checks breathing and pulse briefly, then starts compressions until the defibrillator is ready. One shock is followed immediately by 2 minutes of CPR. Minimizing pauses in compressions and defibrillating early are the keys to survival.",
  "tip": "For arrest sequences, recall the pattern: confirm, call, compress, shock, then go right back to compressions."
 },
 {
  "id": "qb-phys-10",
  "type": "sata",
  "step": "cues",
  "cn": "physio",
  "sp": "ms",
  "topic": "Early hypovolemic shock",
  "stem": "A 58-year-old is 4 hours out from a bowel resection. Preoperative HR was 78 and BP 132/80. The nurse is assessing for early signs of hypovolemic shock.",
  "q": "Which findings are early signs of hypovolemic shock? Select all that apply.",
  "opts": [
   {
    "t": "HR 112, up from 78",
    "ok": true,
    "why": "Yes: tachycardia is one of the first compensations for lost volume, as the heart beats faster to keep cardiac output up."
   },
   {
    "t": "New restlessness and anxiety",
    "ok": true,
    "why": "Yes: subtle changes in mental status reflect reduced brain perfusion and often appear before the blood pressure falls."
   },
   {
    "t": "Cool, pale skin with capillary refill of 4 seconds",
    "ok": true,
    "why": "Yes: blood is shunted away from the skin to vital organs, so the skin cools and refill slows."
   },
   {
    "t": "Urine output 20 mL/h for the past 2 hours",
    "ok": true,
    "why": "Yes: the kidneys receive less blood flow and hormones conserve water, so urine output drops below 0.5 mL/kg/h."
   },
   {
    "t": "BP 118/96, a narrowed pulse pressure",
    "ok": true,
    "why": "Yes: vasoconstriction raises the diastolic pressure while stroke volume falls, so the pulse pressure narrows before the systolic drops."
   },
   {
    "t": "Systolic BP 82",
    "ok": false,
    "why": "No: hypotension is a late sign that shows compensation has failed. The trap is waiting for low BP to recognize shock."
   },
   {
    "t": "Warm, flushed skin",
    "ok": false,
    "why": "No: warm, flushed skin fits early septic or anaphylactic shock from vasodilation, not volume loss."
   }
  ],
  "why": "In early hypovolemic shock the body compensates with sympathetic activity: the heart rate rises, vessels constrict, the skin cools and urine output falls, while the systolic BP is often still normal. Restlessness can be the first clue. A falling systolic BP means compensation is failing.",
  "tip": "When a question asks for early signs, exclude the dramatic late findings such as hypotension, even though they also need action."
 },
 {
  "id": "qb-phys-11",
  "type": "highlight",
  "step": "cues",
  "cn": "physio",
  "sp": "sd",
  "topic": "Acute myocardial infarction",
  "stem": "A 62-year-old was admitted to the telemetry unit for observation after a syncopal episode. Nurse's note, 06:15.",
  "q": "Highlight the findings that require immediate follow-up.",
  "parts": [
   {
    "t": "Woke up with crushing chest pressure that spreads to his jaw, rated 8 of 10.",
    "ok": true,
    "why": "Yes: chest pressure radiating to the jaw is classic for myocardial ischemia and needs an ECG within 10 minutes."
   },
   {
    "t": "Skin cool and diaphoretic.",
    "ok": true,
    "why": "Yes: sweating and cool skin reflect a sympathetic response to reduced cardiac output, a sign of a serious cardiac event."
   },
   {
    "t": "12-lead ECG shows ST elevation in leads II, III and aVF.",
    "ok": true,
    "why": "Yes: ST elevation in the inferior leads indicates an inferior STEMI, which needs urgent reperfusion."
   },
   {
    "t": "HR 48, BP 88/56.",
    "ok": true,
    "why": "Yes: inferior MI often involves the right coronary artery, which supplies the SA and AV nodes, causing bradycardia and hypotension."
   },
   {
    "t": "Takes atorvastatin daily for high cholesterol.",
    "ok": false,
    "why": "No: this is a risk factor and part of the history; it does not change what must be done right now."
   },
   {
    "t": "Wife is at the bedside.",
    "ok": false,
    "why": "No: this is a social detail. It is not a clinical cue that needs follow-up."
   }
  ],
  "why": "Chest pressure radiating to the jaw with diaphoresis and ST elevation in II, III and aVF is an inferior STEMI. The bradycardia and hypotension suggest right coronary artery involvement and possible right ventricular infarction, so nitrates must be used with caution. The goal is rapid reperfusion.",
  "tip": "Highlight findings that point to an active, dangerous process; leave history and social details unselected."
 },
 {
  "id": "qb-phys-12",
  "type": "mc",
  "step": "hypo",
  "cn": "physio",
  "sp": "ms",
  "topic": "Acute pancreatitis",
  "stem": "A 49-year-old with a history of heavy alcohol use is admitted with acute pancreatitis. He is NPO with IV fluids running. The nurse reviews his 14:00 assessment.",
  "q": "Which finding is the priority for the nurse to address?",
  "opts": [
   {
    "t": "BP 84/50 and HR 126",
    "ok": true,
    "why": "Yes: pancreatitis causes large fluid shifts into the abdomen, and hypotension with tachycardia signals hypovolemic shock that threatens perfusion."
   },
   {
    "t": "Serum lipase 1,450 units/L",
    "ok": false,
    "why": "No: a high lipase confirms the diagnosis and is expected. Its level does not reflect how sick the client is right now."
   },
   {
    "t": "Epigastric pain radiating to the back, rated 7 of 10",
    "ok": false,
    "why": "No: pain is expected and must be treated, but circulation problems come before pain in priority."
   },
   {
    "t": "Nausea with two episodes of vomiting",
    "ok": false,
    "why": "No: nausea is common and is managed with NPO status and antiemetics; it is not an immediate threat to life."
   }
  ],
  "why": "Acute pancreatitis releases inflammatory mediators that make capillaries leak, shifting large volumes of fluid out of the vessels. Hypotension and tachycardia mean shock and need aggressive fluid resuscitation. Expected findings such as a high lipase and pain are important but lower priority.",
  "tip": "Separate expected findings of the diagnosis from findings that show a complication; the complication is usually the priority."
 },
 {
  "id": "qb-phys-13",
  "type": "cloze",
  "step": "analyze",
  "cn": "physio",
  "sp": "ms",
  "topic": "COPD and acid-base",
  "stem": "A 70-year-old with COPD is admitted with an exacerbation. She is drowsy and using accessory muscles. Arterial blood gas: pH 7.31, PaCO₂ 64 mm Hg, HCO₃ 31 mEq/L, PaO₂ 54 mm Hg.",
  "q": "Complete the sentences.",
  "parts": [
   "The blood gas shows ",
   {
    "opts": [
     "respiratory acidosis",
     "metabolic acidosis",
     "respiratory alkalosis"
    ],
    "ans": 0,
    "whys": [
     "Yes: the pH is below 7.35 and the PaCO₂ is above 45 mm Hg, so retained carbon dioxide is causing the acidosis.",
     "No: in metabolic acidosis the bicarbonate is low. Her bicarbonate is high, which points to a respiratory cause.",
     "No: the pH is below 7.35, which is acidosis, not alkalosis."
    ]
   },
   " that is ",
   {
    "opts": [
     "partially compensated",
     "uncompensated",
     "fully compensated"
    ],
    "ans": 0,
    "whys": [
     "Yes: the kidneys are retaining bicarbonate, which is above 26 mEq/L, but the pH is still abnormal.",
     "No: uncompensated would mean a normal bicarbonate. Hers is elevated, so the kidneys are already compensating.",
     "No: full compensation would bring the pH back to between 7.35 and 7.45. Her pH of 7.31 is still low."
    ]
   },
   ". The nurse should titrate oxygen to keep her SpO₂ at ",
   {
    "opts": [
     "88% to 92%",
     "98% to 100%",
     "80% to 84%"
    ],
    "ans": 0,
    "whys": [
     "Yes: this target corrects dangerous hypoxemia while limiting the rise in carbon dioxide that high oxygen can cause in COPD.",
     "No: aiming this high in a client who retains carbon dioxide can worsen hypercapnia and drowsiness.",
     "No: this range leaves her hypoxemic. Oxygen should never be withheld from a hypoxemic client because of COPD."
    ]
   },
   "."
  ],
  "why": "A low pH with a high PaCO₂ is respiratory acidosis, and a high bicarbonate shows the kidneys are partly compensating. Drowsiness suggests the carbon dioxide is affecting her level of consciousness. Oxygen is titrated to 88% to 92% in COPD, and worsening drowsiness may mean she needs noninvasive ventilation.",
  "tip": "Read the pH first, then match the PaCO₂ or bicarbonate that moves in the same direction as the problem."
 },
 {
  "id": "qb-phys-14",
  "type": "mc",
  "step": "eval",
  "cn": "physio",
  "sp": "ms",
  "topic": "Pneumothorax and chest tube",
  "stem": "A 24-year-old had a right chest tube placed yesterday for a spontaneous pneumothorax. The tube is connected to a water-seal drainage system with suction.",
  "q": "Which finding indicates the treatment is effective?",
  "opts": [
   {
    "t": "Breath sounds are now heard in the right upper lobe and SpO₂ is 97% on room air",
    "ok": true,
    "why": "Yes: returning breath sounds and normal oxygenation show the lung has re-expanded, which is the goal of the chest tube."
   },
   {
    "t": "Continuous bubbling in the water-seal chamber",
    "ok": false,
    "why": "No: continuous bubbling in the water-seal chamber suggests an air leak in the system or a persistent leak from the lung. Intermittent bubbling with exhalation or coughing can be expected while air is still leaving the pleural space."
   },
   {
    "t": "Trachea shifted toward the left side",
    "ok": false,
    "why": "No: tracheal shift away from the affected side suggests a tension pneumothorax, an emergency."
   },
   {
    "t": "Crackling under the skin that has spread from the insertion site to the neck",
    "ok": false,
    "why": "No: spreading subcutaneous emphysema means air is leaking into tissue and needs to be reported."
   }
  ],
  "why": "A chest tube for pneumothorax works by removing air so the lung can re-expand. Restored breath sounds on the affected side, easier breathing and normal oxygen saturation show it is working. Continuous water-seal bubbling, tracheal shift and spreading crepitus are signs of problems.",
  "tip": "For evaluate questions, name the goal of the treatment, then pick the finding that shows that goal was met."
 },
 {
  "id": "qb-phys-15",
  "type": "matrix",
  "step": "solve",
  "cn": "physio",
  "sp": "ed",
  "topic": "Acute asthma exacerbation",
  "stem": "An 8-year-old with asthma is brought to the emergency department with an exacerbation after a cold. She is sitting upright, speaking in short phrases, with intercostal retractions and expiratory wheezes. RR 36, HR 132, SpO₂ 90% on room air. She is frightened and crying.",
  "q": "For each potential intervention, indicate whether it is indicated or not indicated for this client.",
  "cols": [
   "Indicated",
   "Not indicated"
  ],
  "rows": [
   {
    "t": "Inhaled albuterol by nebulizer",
    "ans": 0,
    "why": "a short-acting beta-2 agonist quickly relaxes airway smooth muscle and is first-line treatment for an acute exacerbation."
   },
   {
    "t": "Systemic corticosteroid, such as oral prednisolone",
    "ans": 0,
    "why": "steroids reduce the airway inflammation that drives the attack; benefit starts within hours, so they are given early."
   },
   {
    "t": "Supplemental oxygen to correct her SpO₂",
    "ans": 0,
    "why": "her saturation is 90%, and hypoxemia worsens anxiety and work of breathing."
   },
   {
    "t": "Lorazepam to reduce her anxiety",
    "ans": 1,
    "why": "sedatives depress the respiratory drive; anxiety here comes from air hunger and improves as breathing improves."
   },
   {
    "t": "Position her flat in bed to rest",
    "ans": 1,
    "why": "lying flat limits chest expansion. She chose to sit upright because it eases breathing."
   },
   {
    "t": "Ipratropium nebulized with the albuterol",
    "ans": 0,
    "why": "adding an anticholinergic to albuterol improves bronchodilation in moderate to severe exacerbations treated in the emergency department."
   }
  ],
  "why": "Treatment of an acute asthma exacerbation targets bronchospasm and inflammation: inhaled short-acting bronchodilators, ipratropium for moderate to severe attacks, systemic corticosteroids and oxygen. Sedatives are avoided because they suppress breathing. Upright positioning helps the client breathe.",
  "tip": "Rule out any intervention that suppresses breathing or limits chest expansion for a client in respiratory distress."
 },
 {
  "id": "qb-phys-16",
  "type": "sata",
  "step": "eval",
  "cn": "physio",
  "sp": "peds",
  "topic": "Sickle cell crisis",
  "stem": "A 12-year-old with sickle cell disease was admitted 24 hours ago for a vaso-occlusive crisis with severe pain in both legs. She is receiving IV fluids and scheduled IV opioid analgesia. The nurse is evaluating her response.",
  "q": "Which findings indicate the plan of care is effective? Select all that apply.",
  "opts": [
   {
    "t": "Pain rated 3 of 10, down from 9 of 10 on admission",
    "ok": true,
    "why": "Yes: relief of pain shows that hydration and analgesia are breaking the cycle of sickling and ischemia."
   },
   {
    "t": "Urine output 1.2 mL/kg/h",
    "ok": true,
    "why": "Yes: adequate urine output shows the IV fluids have restored hydration, which reduces blood viscosity and sickling."
   },
   {
    "t": "SpO₂ 97% on room air with clear breath sounds",
    "ok": true,
    "why": "Yes: normal oxygenation and clear lungs show no sign of acute chest syndrome, a major complication."
   },
   {
    "t": "Walking to the bathroom with assistance",
    "ok": true,
    "why": "Yes: improved mobility reflects less pain and lowers the risk of complications such as atelectasis."
   },
   {
    "t": "New chest pain with a temperature of 38.6 °C (101.5 °F)",
    "ok": false,
    "why": "No: new chest pain and fever suggest acute chest syndrome, a life-threatening complication that needs immediate reporting."
   },
   {
    "t": "Hemoglobin 6.1 g/dL, down from 8.0 g/dL on admission",
    "ok": false,
    "why": "No: a sharp drop in hemoglobin can mean splenic sequestration or aplastic crisis and requires urgent follow-up."
   }
  ],
  "why": "Vaso-occlusive crisis is treated with hydration, prompt and adequate opioid analgesia, and oxygen if hypoxemic. Success shows up as less pain, good urine output, normal oxygenation and returning mobility. New chest symptoms or a falling hemoglobin signal complications, not improvement.",
  "tip": "Match each option to a goal of the plan; findings that show a new problem cannot show the plan is working."
 },
 {
  "id": "qb-phys-17",
  "type": "bowtie",
  "step": "hypo",
  "cn": "physio",
  "sp": "ms",
  "topic": "Adrenal crisis",
  "stem": "A 54-year-old who has taken prednisone 20 mg daily for 2 years for rheumatoid arthritis ran out of her medication 5 days ago. She is admitted with 2 days of vomiting and abdominal pain. She is confused and weak. T 37.2 °C (99 °F), BP 78/46, HR 118. Labs: sodium 127 mEq/L, potassium 4.6 mEq/L, glucose 54 mg/dL.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Acute adrenal crisis",
    "Septic shock",
    "Thyroid storm",
    "SIADH"
   ],
   "ans": 0
  },
  "actions": {
   "opts": [
    "Give IV hydrocortisone as ordered",
    "Infuse 0.9% sodium chloride with dextrose rapidly as ordered",
    "Restrict fluids to 1 liter per day",
    "Apply a cooling blanket",
    "Give spironolactone as ordered for blood pressure"
   ],
   "ans": [
    0,
    1
   ]
  },
  "params": {
   "opts": [
    "Blood pressure",
    "Blood glucose",
    "Thyroid stimulating hormone",
    "Hemoglobin A1C",
    "Peak expiratory flow"
   ],
   "ans": [
    0,
    1
   ]
  },
  "whys": {
   "cond": [
    "Yes: abruptly stopping long-term steroids plus illness causes cortisol deficiency, with hypotension, hyponatremia and hypoglycemia.",
    "No: sepsis can cause hypotension, but her normal temperature, low glucose and abrupt steroid stop point to adrenal failure.",
    "No: thyroid storm causes high fever, agitation and often hyperglycemia, not hypoglycemia with hyponatremia.",
    "No: SIADH causes low sodium from water retention, but not hypotension, volume loss or low glucose."
   ],
   "actions": [
    "Yes: IV hydrocortisone replaces the missing cortisol and is lifesaving; it also helps correct the sodium, glucose and blood pressure.",
    "Yes: large volumes of isotonic fluid with dextrose restore circulating volume and treat the hypoglycemia.",
    "No: she is in shock from volume loss. Fluid restriction treats SIADH and would worsen her hypotension.",
    "No: she is not febrile. Cooling is used for hyperthermia such as thyroid storm.",
    "No: spironolactone is a diuretic and aldosterone blocker; it would worsen her volume loss, hypotension and hyponatremia."
   ],
   "params": [
    "Yes: blood pressure shows whether fluids and hydrocortisone are reversing the shock.",
    "Yes: cortisol deficiency causes hypoglycemia, so glucose is checked often until it is stable.",
    "No: TSH evaluates thyroid function and does not guide treatment of adrenal crisis.",
    "No: A1C reflects 3 months of glucose control and does not help in an acute crisis.",
    "No: peak flow measures airway obstruction in asthma, which is not part of this picture."
   ]
  },
  "why": "Stopping long-term glucocorticoids suppresses the body's own cortisol production, and an illness can then tip the client into adrenal crisis. Hypotension, hyponatremia and hypoglycemia are the classic pattern; hyperkalemia is typical of primary adrenal insufficiency (Addison disease) but uncommon after steroid withdrawal, because aldosterone is still made. Treatment is IV hydrocortisone and rapid isotonic fluid with dextrose, with close monitoring of BP, glucose and electrolytes.",
  "tip": "When the stem mentions long-term steroids that were stopped suddenly, think adrenal crisis before other causes of shock."
 },
 {
  "id": "qb-phys-18",
  "type": "mc",
  "step": "act",
  "cn": "physio",
  "sp": "ob",
  "topic": "Anaphylaxis",
  "stem": "A 31-year-old who is 2 days postpartum is receiving her first dose of IV ampicillin for endometritis. Ten minutes into the infusion she says her throat feels tight. She has hives on her chest, audible stridor and BP 84/48, HR 128. The nurse has stopped the infusion and called the rapid response team.",
  "q": "Which action should the nurse take next?",
  "opts": [
   {
    "t": "Give epinephrine 0.5 mg IM into the mid-outer thigh as ordered",
    "ok": true,
    "why": "Yes: IM epinephrine is the first-line treatment for anaphylaxis; it reverses airway swelling, bronchospasm and vasodilation within minutes."
   },
   {
    "t": "Give diphenhydramine IV as ordered",
    "ok": false,
    "why": "No: antihistamines help hives and itching but do not treat airway swelling or shock. The trap is choosing the familiar allergy drug first."
   },
   {
    "t": "Give methylprednisolone IV as ordered",
    "ok": false,
    "why": "No: corticosteroids take hours to work and are an adjunct; they do not reverse the immediate threat."
   },
   {
    "t": "Give albuterol by nebulizer",
    "ok": false,
    "why": "No: albuterol may help residual wheezing but does not treat upper airway swelling or hypotension."
   }
  ],
  "why": "Anaphylaxis with stridor and hypotension is life threatening. After stopping the trigger and calling for help, IM epinephrine in the thigh is the priority because it treats every dangerous part of the reaction. Antihistamines, steroids and bronchodilators are adjuncts that follow.",
  "tip": "In anaphylaxis, choose epinephrine over any adjunct drug; it is the only one that treats the airway and the blood pressure."
 },
 {
  "id": "qb-psy-1",
  "type": "mc",
  "step": "cues",
  "cn": "psychosocial",
  "sp": "teen",
  "topic": "Suicide risk communication",
  "stem": "A 16-year-old admitted to the adolescent unit for depression has stayed in his room most of the day. When the nurse sits with him, he looks down and says, \"Nobody would even notice if I was gone.\"",
  "q": "Which response by the nurse is best?",
  "opts": [
   {
    "t": "\"Are you thinking about killing yourself?\"",
    "ok": true,
    "why": "Yes: asking directly and clearly about suicide is the standard of care. It does not plant the idea and opens the door to a risk assessment."
   },
   {
    "t": "\"Of course people would notice. Your parents visit you every day.\"",
    "ok": false,
    "why": "No: this argues with his feelings and gives false reassurance, which can shut down the conversation."
   },
   {
    "t": "\"Why would you say something like that?\"",
    "ok": false,
    "why": "No: why questions sound judgmental and make clients defensive. They do not assess suicide risk."
   },
   {
    "t": "\"Let's talk about something more positive, like your plans for after discharge.\"",
    "ok": false,
    "why": "No: changing the subject dismisses a possible warning sign and misses the chance to assess his safety."
   }
  ],
  "why": "A statement like \"nobody would notice if I was gone\" is an indirect suicide cue. The nurse should ask directly whether the client is thinking of suicide, then assess plan, intent and means. Direct questions do not increase risk and show the nurse can handle the answer.",
  "tip": "When a client hints at suicide, the best answer asks about it directly using the word suicide or killing yourself."
 },
 {
  "id": "qb-psy-2",
  "type": "sata",
  "step": "act",
  "cn": "psychosocial",
  "sp": "psy",
  "topic": "Suicide precautions",
  "stem": "A 42-year-old is admitted to the adult psych unit after telling her therapist she plans to hang herself. She says she still has thoughts of dying. The provider orders suicide precautions with continuous observation.",
  "q": "Which actions should the nurse take? Select all that apply.",
  "opts": [
   {
    "t": "Assign a staff member to keep her in sight at all times, including in the bathroom",
    "ok": true,
    "why": "Yes: continuous one-to-one observation is the order and means she is never out of view of the assigned staff member."
   },
   {
    "t": "Search her belongings and remove belts, shoelaces, cords and plastic bags",
    "ok": true,
    "why": "Yes: these are ligature and suffocation risks, which matter most because her stated plan is hanging."
   },
   {
    "t": "Check meal trays and count utensils when they are returned",
    "ok": true,
    "why": "Yes: utensils and other tray items can be used for self-harm, so they are accounted for after every meal."
   },
   {
    "t": "Ask her about suicidal thoughts at least every shift",
    "ok": true,
    "why": "Yes: risk changes over time, and regular direct assessment guides the level of observation."
   },
   {
    "t": "Have her sign a no-suicide contract",
    "ok": false,
    "why": "No: no-suicide contracts do not prevent suicide and can create false reassurance. A collaborative safety plan is used instead."
   },
   {
    "t": "Assign her a private room at the end of the hall so she can rest",
    "ok": false,
    "why": "No: a room near the nurses' station is safer. Isolation away from staff increases the risk of a suicide attempt."
   }
  ],
  "why": "Suicide precautions combine close observation, a safe environment and ongoing assessment. A client with a plan for hanging needs ligature risks removed and continuous observation. No-suicide contracts are not evidence based and are not a substitute for observation and safety planning.",
  "tip": "For suicide safety questions, choose actions that increase observation and remove means; reject anything that relies on a promise."
 },
 {
  "id": "qb-psy-3",
  "type": "mc",
  "step": "act",
  "cn": "psychosocial",
  "sp": "ob",
  "topic": "Intimate partner violence screening",
  "stem": "A 26-year-old at 24 weeks of pregnancy comes to the prenatal clinic with her partner, who answers most of the nurse's questions for her. She has missed two appointments. The nurse notes bruises in different stages of healing on both upper arms.",
  "q": "Which action should the nurse take first?",
  "opts": [
   {
    "t": "Ask the partner to step out for part of the visit, then ask her privately about her safety at home",
    "ok": true,
    "why": "Yes: screening for abuse must be done in private. Many clinics routinely see clients alone for part of each visit, which avoids alerting the partner."
   },
   {
    "t": "Ask both of them how she got the bruises on her arms",
    "ok": false,
    "why": "No: asking in front of a possible abuser is unsafe and unlikely to get an honest answer. It may put her at greater risk."
   },
   {
    "t": "Tell her she needs to leave the relationship for the baby's safety",
    "ok": false,
    "why": "No: leaving is the most dangerous time, and the decision belongs to her. The nurse supports her and helps with a safety plan."
   },
   {
    "t": "Give the partner a pamphlet about local domestic violence resources",
    "ok": false,
    "why": "No: giving resources to the possible abuser could provoke violence. Information is shared privately and safely with the client."
   }
  ],
  "why": "Pregnancy is a time of increased risk for intimate partner violence. A controlling partner, missed visits and bruises in different stages of healing are warning signs. The first step is private screening, followed by safety planning, resources and documentation, with reporting as required by state law.",
  "tip": "In abuse questions, the safest first action almost always involves separating the client from the suspected abuser."
 },
 {
  "id": "qb-psy-4",
  "type": "mc",
  "step": "solve",
  "cn": "psychosocial",
  "sp": "peds",
  "topic": "Suspected child abuse",
  "stem": "An 8-month-old is admitted to the pediatric unit with a spiral fracture of the femur. The parent says the infant rolled off the couch. The infant is not yet crawling or pulling to stand. The nurse also notes bruises on the infant's back.",
  "q": "Which plan by the nurse is best?",
  "opts": [
   {
    "t": "Report the suspected abuse to child protective services and document the injuries and the parent's exact words",
    "ok": true,
    "why": "Yes: nurses are mandated reporters, and reasonable suspicion is enough to report. Objective documentation supports the investigation."
   },
   {
    "t": "Wait until the skeletal survey results are back before deciding whether to report",
    "ok": false,
    "why": "No: the law requires a report based on reasonable suspicion, not proof. Waiting can leave the infant in danger."
   },
   {
    "t": "Ask the parent to explain how the fracture could have happened from a short fall",
    "ok": false,
    "why": "No: confronting the parent can make them defensive and may lead them to remove the child. Investigation is the role of the agency."
   },
   {
    "t": "Ask the provider whether a report is needed",
    "ok": false,
    "why": "No: each mandated reporter has a personal duty to report. The nurse can involve the provider, but in most states cannot hand off the obligation; follow state law and facility policy."
   }
  ],
  "why": "A spiral fracture and back bruises in an infant who cannot yet crawl do not fit a short fall from a couch. An injury that does not match the child's developmental stage is a red flag for abuse. Nurses must report reasonable suspicion and document objectively; they do not need proof. Reporting procedures vary by state and facility.",
  "tip": "Compare the injury to the child's developmental abilities; when the story does not fit, the answer is to report."
 },
 {
  "id": "qb-psy-5",
  "type": "matrix",
  "step": "analyze",
  "cn": "psychosocial",
  "sp": "ms",
  "topic": "Delirium, dementia, depression",
  "stem": "The med-surg nurse is caring for three older adults with confusion or memory complaints. The nurse is sorting the findings to decide which condition each one suggests.",
  "q": "For each finding, indicate whether it is most consistent with delirium, dementia or depression.",
  "cols": [
   "Delirium",
   "Dementia",
   "Depression"
  ],
  "rows": [
   {
    "t": "Confusion began suddenly the night after surgery, with attention that comes and goes",
    "ans": 0,
    "why": "acute onset over hours to days with a fluctuating level of attention is the hallmark of delirium."
   },
   {
    "t": "Sees bugs crawling on the wall and is worse at night",
    "ans": 0,
    "why": "visual hallucinations and evening worsening are common in delirium, which often reverses when the cause is treated."
   },
   {
    "t": "Memory has slowly declined over 3 years, and she now gets lost in her own neighborhood",
    "ans": 1,
    "why": "gradual, progressive loss of memory and orientation over years with a normal level of alertness fits dementia."
   },
   {
    "t": "Tries hard to answer memory questions and makes up details to fill gaps",
    "ans": 1,
    "why": "confabulation covers memory loss in dementia; the client tries to hide deficits rather than point them out."
   },
   {
    "t": "Answers most memory questions with \"I don't know\" and makes little effort",
    "ans": 2,
    "why": "low effort and quick \"I don't know\" answers suggest depression, which can look like dementia in older adults."
   },
   {
    "t": "Sad mood, poor appetite and early morning waking for the past 2 months",
    "ans": 2,
    "why": "a persistent low mood with changes in sleep and appetite over weeks points to depression."
   }
  ],
  "why": "Delirium is sudden, fluctuating and often reversible, with impaired attention. Dementia is gradual and progressive, with clients often trying to hide deficits. Depression in older adults can look like memory loss, but clients tend to report deficits and give low effort. A client can have more than one at the same time.",
  "tip": "Use onset and course first: sudden means delirium, slow over years means dementia, and weeks of low mood means depression."
 },
 {
  "id": "qb-psy-6",
  "type": "highlight",
  "step": "cues",
  "cn": "psychosocial",
  "sp": "ed",
  "topic": "Escalating agitation",
  "stem": "A 35-year-old is in the emergency department waiting for a psychiatric evaluation. Nurse's note, 15:20.",
  "q": "Highlight the findings that indicate the client's agitation is escalating.",
  "parts": [
   {
    "t": "Pacing the hallway and refusing to sit down.",
    "ok": true,
    "why": "Yes: increased motor activity such as pacing is an early sign of rising tension that calls for de-escalation."
   },
   {
    "t": "Voice getting louder, swearing at staff.",
    "ok": true,
    "why": "Yes: a rising voice and verbal hostility show escalating agitation and can come before physical aggression."
   },
   {
    "t": "Fists clenched and jaw tight.",
    "ok": true,
    "why": "Yes: clenched fists and muscle tension are physical signs that the client may be preparing to act out."
   },
   {
    "t": "Has been waiting for 3 hours.",
    "ok": false,
    "why": "No: a long wait may explain his frustration, but it is a context detail, not a sign of escalation."
   },
   {
    "t": "Ate a sandwich at 12:00.",
    "ok": false,
    "why": "No: eating is a routine detail and does not describe his current behavior."
   },
   {
    "t": "Oriented to person, place and time.",
    "ok": false,
    "why": "No: orientation is a normal finding and does not indicate rising agitation."
   }
  ],
  "why": "Escalation is usually visible before violence: pacing, a rising voice, swearing, clenched fists and a tense posture. Recognizing these cues early lets the nurse use verbal de-escalation, reduce stimulation and offer choices before restraint or medication is needed.",
  "tip": "Highlight what the client is doing now that shows tension rising; leave out background facts that only explain why."
 },
 {
  "id": "qb-psy-7",
  "type": "sata",
  "step": "eval",
  "cn": "psychosocial",
  "sp": "teen",
  "topic": "Safety plan teaching",
  "stem": "A 15-year-old is being discharged from the adolescent unit after an admission for suicidal thoughts. The nurse reviewed her written safety plan with her and her mother.",
  "q": "Which statements indicate the teaching was effective? Select all that apply.",
  "opts": [
   {
    "t": "Teen: \"My warning sign is when I stop answering texts and stay in my room all day.\"",
    "ok": true,
    "why": "Yes: recognizing her own warning signs is the first step of a safety plan, so she knows when to use it."
   },
   {
    "t": "Teen: \"If I can't stay safe, I'll call or text 988 or go to the emergency room.\"",
    "ok": true,
    "why": "Yes: she knows how to reach crisis help, including the 988 Suicide and Crisis Lifeline, when her coping steps are not enough."
   },
   {
    "t": "Mother: \"I locked up all the medications, and the gun is now stored out of the house.\"",
    "ok": true,
    "why": "Yes: limiting access to lethal means, especially firearms, is one of the most effective ways to prevent suicide."
   },
   {
    "t": "Teen: \"When my coping list isn't enough, I'll call my aunt.\"",
    "ok": true,
    "why": "Yes: naming a specific trusted person to contact shows she understands the plan's support steps."
   },
   {
    "t": "Teen: \"I promised I won't hurt myself, so I don't really need the plan.\"",
    "ok": false,
    "why": "No: a promise is not a safety strategy. This statement shows she may not use the plan when she needs it."
   },
   {
    "t": "Teen: \"I should keep these thoughts to myself so my parents don't worry.\"",
    "ok": false,
    "why": "No: the plan depends on reaching out. Hiding suicidal thoughts increases risk and shows a need for more teaching."
   }
  ],
  "why": "A safety plan lists personal warning signs, coping strategies, people to contact, crisis lines such as 988 and steps to limit access to lethal means. Effective teaching shows up as the teen and family describing each part and planning to use it. Statements that rely on promises or secrecy need more teaching.",
  "tip": "For evaluation of teaching, choose statements that show the person will take a safe action, and reject those that avoid help."
 },
 {
  "id": "qb-psy-8",
  "type": "sata",
  "step": "solve",
  "cn": "psychosocial",
  "sp": "ob",
  "topic": "Perinatal loss",
  "stem": "A 29-year-old has just given birth to a stillborn son at 36 weeks. She and her husband named him Elijah. They are crying quietly and holding hands. The couple is Catholic.",
  "q": "Which interventions should the nurse include in the plan of care? Select all that apply.",
  "opts": [
   {
    "t": "Offer the parents the chance to see and hold Elijah, without pressure",
    "ok": true,
    "why": "Yes: many parents find that seeing and holding their baby helps them grieve. The choice is offered, not forced, and can be revisited later."
   },
   {
    "t": "Offer mementos such as footprints, a lock of hair and photographs",
    "ok": true,
    "why": "Yes: keepsakes validate the baby's life and give parents something to hold onto as they grieve."
   },
   {
    "t": "Refer to the baby by his name",
    "ok": true,
    "why": "Yes: using the name acknowledges him as their son and shows respect for their loss."
   },
   {
    "t": "Ask whether they would like a priest or the chaplain, or a blessing or baptism",
    "ok": true,
    "why": "Yes: asking about spiritual and cultural wishes lets the nurse support rituals that may be important to them."
   },
   {
    "t": "Tell them they are young and can have another baby",
    "ok": false,
    "why": "No: this minimizes the loss and implies the baby can be replaced. It is a common but hurtful nontherapeutic response."
   },
   {
    "t": "Place her in a postpartum room next to the newborn nursery",
    "ok": false,
    "why": "No: hearing other newborns can be very painful. A room away from crying babies is offered, with her preference respected."
   }
  ],
  "why": "After a perinatal loss, nurses support grief by acknowledging the baby as a person, offering contact and keepsakes, and respecting spiritual and cultural practices. Parents should be offered choices rather than told what to do. Statements that minimize the loss and environments full of reminders add to their distress.",
  "tip": "In grief questions, choose actions that acknowledge the loss and offer choices; reject anything that minimizes or rushes the grief."
 },
 {
  "id": "qb-psy-9",
  "type": "cloze",
  "step": "hypo",
  "cn": "psychosocial",
  "sp": "ed",
  "topic": "Opioid withdrawal",
  "stem": "A 31-year-old comes to the emergency department asking for help to stop using fentanyl. He last used 14 hours ago. He is yawning, has a runny nose and watery eyes, and reports stomach cramps and diarrhea. Pupils are 6 mm. Goosebumps are visible on his arms. HR 104, BP 142/88, T 37.3 °C (99.1 °F).",
  "q": "Complete the sentences.",
  "parts": [
   "These findings are most consistent with ",
   {
    "opts": [
     "opioid withdrawal",
     "alcohol withdrawal",
     "stimulant intoxication"
    ],
    "ans": 0,
    "whys": [
     "Yes: yawning, runny nose, tearing, dilated pupils, goosebumps and GI cramping after stopping fentanyl are classic opioid withdrawal.",
     "No: alcohol withdrawal causes tremor, sweating and agitation, and he reports fentanyl, not alcohol use.",
     "No: stimulants can dilate pupils and raise HR, but they do not cause yawning, tearing, goosebumps and diarrhea."
    ]
   },
   ". This condition is ",
   {
    "opts": [
     "very uncomfortable but rarely life threatening in a healthy adult",
     "the withdrawal most likely to cause seizures and delirium tremens",
     "not treatable until all symptoms have resolved"
    ],
    "ans": 0,
    "whys": [
     "Yes: opioid withdrawal is distressing, but in an otherwise healthy adult it is rarely fatal unless dehydration becomes severe.",
     "No: seizures and delirium tremens are risks of alcohol or benzodiazepine withdrawal, not opioid withdrawal.",
     "No: symptoms are treatable now; untreated withdrawal raises the chance he returns to use and overdoses."
    ]
   },
   ". The nurse should anticipate an order for ",
   {
    "opts": [
     "buprenorphine",
     "naloxone",
     "lorazepam"
    ],
    "ans": 0,
    "whys": [
     "Yes: buprenorphine relieves withdrawal and starts treatment for opioid use disorder. It is given per prescriber protocol once withdrawal is objectively moderate; after fentanyl, starting too early can precipitate withdrawal.",
     "No: naloxone reverses opioids and would make his withdrawal much worse. It is used for overdose, not withdrawal.",
     "No: benzodiazepines are the treatment for alcohol withdrawal; they do not treat opioid withdrawal and add sedation risk."
    ]
   },
   "."
  ],
  "why": "Opioid withdrawal looks like a bad flu: yawning, runny nose, tearing, dilated pupils, goosebumps, cramps and diarrhea. It is miserable but rarely fatal, unlike alcohol withdrawal. Buprenorphine is started per prescriber protocol once withdrawal is objectively moderate (for example by a COWS score), because fentanyl lingers in tissue and an early dose can precipitate sudden, severe withdrawal. Buprenorphine also begins treatment for opioid use disorder and lowers overdose risk.",
  "tip": "Link withdrawal symptoms to the opposite of the drug's effects: opioids constrict pupils and slow the gut, so withdrawal does the reverse."
 },
 {
  "id": "qb-psy-10",
  "type": "matrix",
  "step": "eval",
  "cn": "psychosocial",
  "sp": "ms",
  "topic": "Therapeutic communication",
  "stem": "A 58-year-old on the med-surg unit was just told he has metastatic lung cancer. He says to the nurse, \"I don't know how I'm going to tell my kids.\" The charge nurse is evaluating a new nurse's responses.",
  "q": "For each response, indicate whether it is therapeutic or nontherapeutic.",
  "cols": [
   "Therapeutic",
   "Nontherapeutic"
  ],
  "rows": [
   {
    "t": "\"You're worried about how to tell your children.\"",
    "ans": 0,
    "why": "reflecting his feelings shows he was heard and invites him to keep talking."
   },
   {
    "t": "\"Tell me more about what you're thinking.\"",
    "ans": 0,
    "why": "an open-ended prompt lets him lead and share what matters most to him."
   },
   {
    "t": "\"I'll sit with you for a while.\"",
    "ans": 0,
    "why": "offering self conveys presence and support without forcing him to talk."
   },
   {
    "t": "\"Don't worry, your kids will handle it fine.\"",
    "ans": 1,
    "why": "this is false reassurance that dismisses his concern and closes the conversation."
   },
   {
    "t": "\"Why haven't you told them yet?\"",
    "ans": 1,
    "why": "why questions sound judgmental and put the client on the defensive."
   },
   {
    "t": "\"If I were you, I would tell them tonight.\"",
    "ans": 1,
    "why": "giving advice takes the decision away from the client and puts the nurse's values first."
   }
  ],
  "why": "Therapeutic communication keeps the focus on the client's feelings. Reflection, open-ended questions and offering self encourage him to express his concerns. False reassurance, why questions and advice block communication because they dismiss feelings, judge or take over decisions.",
  "tip": "Ask whether each response keeps the focus on the client's feelings; if it shifts to the nurse's opinion or reassurance, it is nontherapeutic."
 },
 {
  "id": "qb-psy-11",
  "type": "mc",
  "step": "hypo",
  "cn": "psychosocial",
  "sp": "psy",
  "topic": "Command hallucinations",
  "stem": "The nurse on the adult psych unit receives report on four clients at 07:00.",
  "q": "Which client should the nurse see first?",
  "opts": [
   {
    "t": "A 28-year-old with schizophrenia who says the voices are telling him to hurt his roommate",
    "ok": true,
    "why": "Yes: command hallucinations to harm someone are an immediate safety risk to others and need assessment and intervention now."
   },
   {
    "t": "A 50-year-old with major depression who is asking for her PRN sleep medication",
    "ok": false,
    "why": "No: a request for a sleep aid is a comfort need. It can wait briefly while the nurse addresses a safety threat."
   },
   {
    "t": "A 33-year-old with bipolar mania who is talking rapidly in the day room and ate half of breakfast",
    "ok": false,
    "why": "No: these findings are expected in mania and need monitoring, but there is no immediate danger described."
   },
   {
    "t": "A 41-year-old with generalized anxiety who wants to know her discharge date",
    "ok": false,
    "why": "No: this is an information request and is the least urgent of the four."
   }
  ],
  "why": "Safety comes first on a psych unit. Command hallucinations directing harm to self or others are a psychiatric emergency because the client may act on them. The nurse assesses the content of the voices and the client's intent, ensures the safety of the roommate and others, and notifies the provider.",
  "tip": "In psych priority questions, look for any risk of harm to self or others; that client comes before comfort or information needs."
 },
 {
  "id": "qb-psy-12",
  "type": "mc",
  "step": "act",
  "cn": "psychosocial",
  "sp": "comm",
  "topic": "Elder neglect",
  "stem": "A home health nurse visits an 82-year-old with mild cognitive impairment who lives with her adult daughter. The client has lost 5 kg (11 lb) in a month, has a new stage 2 pressure injury on her sacrum and is lying on soiled sheets. The daughter controls her money and says she leaves her alone most of the day. The client says, \"I don't want to be a bother.\"",
  "q": "Which action should the nurse take?",
  "opts": [
   {
    "t": "Report suspected neglect to Adult Protective Services and document the objective findings",
    "ok": true,
    "why": "Yes: weight loss, a new pressure injury and poor hygiene in a dependent adult are signs of neglect; nurses report suspected elder abuse as required by state law."
   },
   {
    "t": "Teach the daughter how to reposition her mother and check again next week",
    "ok": false,
    "why": "No: teaching may help, but it does not address the pattern of neglect and delays protection for a vulnerable adult."
   },
   {
    "t": "Tell the daughter that she is neglecting her mother and must do better",
    "ok": false,
    "why": "No: confronting the caregiver can increase risk to the client and may lead to the nurse being denied access."
   },
   {
    "t": "Respect the client's wish not to be a bother and take no further action",
    "ok": false,
    "why": "No: her statement reflects dependence and fear, not a choice to be neglected. The nurse still has a duty to report."
   }
  ],
  "why": "Neglect is the most common form of elder mistreatment. Unexplained weight loss, pressure injuries, poor hygiene and a caregiver who controls finances and leaves the client alone are red flags. The nurse documents objective findings and reports to Adult Protective Services per state law; investigation is the agency's job.",
  "tip": "When a dependent client shows physical signs of neglect, choose reporting over teaching or confronting the caregiver."
 },
 {
  "id": "sa-mgmt-1",
  "type": "cloze",
  "step": "hypo",
  "sp": "ms",
  "sys": "leadership",
  "topic": "Prioritizing a possible PE",
  "stem": "At 0700 a med-surg nurse receives report on four clients. A 66-year-old on post-op day 2 after a right total knee replacement is newly restless: HR 118, RR 28, SpO₂ 89% on room air (96% yesterday). A 58-year-old with type 2 diabetes has a fingerstick glucose of 248 mg/dL before breakfast. A 74-year-old with COPD has an SpO₂ of 89% on 2 L, her documented baseline. A 40-year-old with pancreatitis reports pain 6/10; his PRN opioid is due in 1 hour.",
  "q": "Complete the sentences.",
  "parts": [
   "The nurse should see the client ",
   {
    "opts": [
     "with pancreatitis",
     "after the knee replacement",
     "with COPD"
    ],
    "ans": 1,
    "whys": [
     "No: pain 6/10 matters, but his medication is not due yet and pain is not life threatening. Comfort comes after a possible airway or circulation problem.",
     "Yes: new restlessness, tachycardia, tachypnea and a drop in SpO₂ two days after joint surgery is an unstable, unexpected change. This client could die without fast action.",
     "No: an SpO₂ of 89% is her documented baseline. Stable findings that are expected for the client are a lower priority than a new change."
    ]
   },
   " first, because the findings most strongly suggest ",
   {
    "opts": [
     "expected postoperative pain",
     "anxiety about discharge",
     "pulmonary embolism"
    ],
    "ans": 2,
    "whys": [
     "No: pain does not explain a new oxygen drop. Calling it pain is the trap that delays care for a clot.",
     "No: anxiety is a diagnosis of exclusion. Restlessness with hypoxemia is a sign of low oxygen until proven otherwise.",
     "Yes: orthopedic surgery of the leg plus immobility is a classic setup for a clot. Sudden hypoxemia, tachycardia and tachypnea fit a pulmonary embolism."
    ]
   },
   ". The client who can most safely be seen last is the client ",
   {
    "opts": [
     "with COPD at her baseline SpO₂",
     "with a glucose of 248 mg/dL",
     "with pancreatitis pain"
    ],
    "ans": 0,
    "whys": [
     "Yes: her findings are chronic, expected and unchanged. A stable client with an expected finding can wait while others are assessed.",
     "No: she needs her insulin dose before breakfast arrives, which is time sensitive. She should be seen before the stable client.",
     "No: his pain needs reassessment and nondrug comfort measures. Untreated acute pain ranks above a stable chronic finding."
    ]
   },
   "."
  ],
  "why": "Prioritize an unexpected, acute change over a stable or expected finding. New hypoxemia, tachycardia and restlessness after knee surgery point to a pulmonary embolism, an airway and breathing problem that can be fatal. A client with COPD sitting at her own baseline is the most stable.",
  "tip": "Ask which finding is new and unexpected for that client, then rank it with ABCs; a baseline value is not an emergency.",
  "cn": "mgmt"
 },
 {
  "id": "sa-mgmt-2",
  "type": "sata",
  "step": "solve",
  "sp": "sd",
  "sys": "leadership",
  "topic": "Delegating tasks on step-down",
  "stem": "An RN on a step-down unit is working with an LPN and an unlicensed assistive personnel (UAP). The clients include a client 2 days after an uncomplicated MI, a client 1 day after a stroke awaiting a swallow evaluation, a client newly prescribed enoxaparin, a client with a urinary catheter, and a client on bed rest.",
  "q": "Which tasks can the RN delegate to the UAP? Select all that apply.",
  "opts": [
   {
    "t": "Obtain and record vital signs on the stable client 2 days after the MI",
    "ok": true,
    "why": "Yes: routine vital signs on a stable client are within the UAP role. The RN still interprets the values and acts on any abnormal result."
   },
   {
    "t": "Measure and record urine output from the indwelling catheter",
    "ok": true,
    "why": "Yes: measuring and recording output is a standard, predictable task. The RN reviews the numbers and decides what they mean."
   },
   {
    "t": "Reposition the client on bed rest every 2 hours",
    "ok": true,
    "why": "Yes: turning and repositioning a stable client is a routine UAP skill. The RN still assesses the skin for early pressure injury."
   },
   {
    "t": "Feed breakfast to the client who had a stroke yesterday",
    "ok": false,
    "why": "No: he has not passed a swallow screen, so he must stay NPO. Feeding him risks aspiration, and the trap is treating feeding as always delegable."
   },
   {
    "t": "Teach the client newly prescribed enoxaparin how to self-inject",
    "ok": false,
    "why": "No: initial teaching requires RN knowledge and judgment. A UAP may reinforce nothing that has not first been taught and evaluated by the RN."
   },
   {
    "t": "Assess the client's pain 30 minutes after IV morphine",
    "ok": false,
    "why": "No: evaluating the response to a medication is assessment, which stays with the licensed nurse. A UAP can report a pain number but cannot judge the response."
   },
   {
    "t": "Ambulate the client after the MI to the bathroom with the walker he has used safely since yesterday",
    "ok": true,
    "why": "Yes: assisting a stable client with a known, routine activity is appropriate. The RN gives clear instructions on what to report, such as chest pain or dizziness."
   }
  ],
  "why": "UAPs can do routine, predictable tasks for stable clients: vital signs, intake and output, turning and helping with walking. Assessment, teaching, evaluation and any task with an unpredictable outcome stay with the RN. Feeding a client with an unknown swallow is a safety risk, not a routine task.",
  "tip": "For each task, ask whether it needs assessment, teaching, evaluation or judgment; if it does, the RN keeps it.",
  "cn": "mgmt"
 },
 {
  "id": "sa-mgmt-4",
  "type": "matrix",
  "step": "act",
  "sp": "icu",
  "sys": "ethics",
  "topic": "Honoring an advance directive",
  "stem": "An 81-year-old in the ICU with end-stage COPD has a signed advance directive declining intubation and a DNR order. She is alert, oriented and has decision-making capacity. Her son, who is her health care power of attorney, arrives and demands that \"everything be done,\" including a breathing tube.",
  "q": "For each action, indicate whether it is appropriate or inappropriate.",
  "cols": [
   "Appropriate",
   "Inappropriate"
  ],
  "rows": [
   {
    "t": "Continue to follow the DNR order unless the client herself changes it",
    "ans": 0,
    "why": "A competent adult's own decision guides care. Her advance directive and DNR order stand until she changes them."
   },
   {
    "t": "Ask the client privately whether her wishes have changed",
    "ans": 0,
    "why": "Asking her directly, away from family pressure, confirms her current wishes and respects her autonomy."
   },
   {
    "t": "Change her code status to full code because the son is her power of attorney",
    "ans": 1,
    "why": "A health care power of attorney only decides when the client lacks capacity. She can speak for herself, so the son cannot override her."
   },
   {
    "t": "Request a family meeting with the provider and offer an ethics consult",
    "ans": 0,
    "why": "Conflict between family and a client's documented wishes is a classic reason for a family meeting and ethics support."
   },
   {
    "t": "Stop her nebulizer treatments and oxygen because she is DNR",
    "ans": 1,
    "why": "DNR means no CPR if her heart stops; it does not mean no treatment. She still receives every other ordered therapy and comfort care."
   }
  ],
  "why": "A competent client's own choice outranks any surrogate. A power of attorney becomes active only when the client loses capacity. DNR limits resuscitation, not ordinary care, and conflict with family calls for communication and ethics support, not a change in orders.",
  "tip": "When family and client disagree, check capacity first; if the client has it, the client decides.",
  "cn": "mgmt"
 },
 {
  "id": "sa-mgmt-5",
  "type": "bowtie",
  "step": "act",
  "sp": "ms",
  "sys": "leadership",
  "topic": "Escalating postoperative hemorrhage",
  "trend": true,
  "stem": "A 56-year-old is 4 hours after an open bowel resection. At 1600: HR 88, BP 128/76. At 1700: HR 106, BP 108/66. At 1800: HR 122, BP 92/58, skin cool and clammy, abdominal dressing saturated with bright red blood, and 250 mL of bloody drainage in the surgical drain in the last hour. The nurse paged the surgeon at 1715 and 1745 with no response.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Expected tachycardia from postoperative pain",
    "Hypovolemic shock from postoperative bleeding",
    "Sepsis from an anastomotic leak",
    "Fluid volume overload"
   ],
   "ans": 1
  },
  "actions": {
   "opts": [
    "Page the surgeon again and wait 30 more minutes",
    "Remove the dressing and pack the wound",
    "Call the rapid response team",
    "Notify the charge nurse and escalate up the chain of command now",
    "File an incident report about the surgeon before calling anyone else"
   ],
   "ans": [
    2,
    3
   ]
  },
  "params": {
   "opts": [
    "Heart rate and blood pressure",
    "Blood glucose",
    "Bowel sounds",
    "Drain output and dressing saturation",
    "Temperature"
   ],
   "ans": [
    0,
    3
   ]
  },
  "whys": {
   "cond": [
    "No: pain raises the heart rate but does not drop the blood pressure or soak a dressing with blood. Blaming pain is the trap.",
    "Yes: rising heart rate, falling pressure, cool clammy skin and heavy bright red drainage over 2 hours is hemorrhage progressing to shock.",
    "No: sepsis from a leak usually appears days later with fever, not 4 hours after surgery with frank bleeding.",
    "No: overload raises blood pressure and causes crackles and edema. This client's pressure is falling."
   ],
   "actions": [
    "No: two unanswered pages with a client in shock means waiting is unsafe. The nurse must escalate now.",
    "No: packing a fresh surgical wound is outside nursing scope and does not stop internal bleeding. Reinforce the dressing instead.",
    "Yes: the rapid response team brings immediate bedside help for a deteriorating client while the surgeon is reached.",
    "Yes: when the provider does not respond, the nurse follows the chain of command: charge nurse, then supervisor or another physician, until someone acts.",
    "No: an incident report may be filed later, but it never comes before getting the client help."
   ],
   "params": [
    "Yes: trending heart rate and blood pressure shows whether bleeding and shock are worsening or responding to treatment.",
    "No: glucose is not a priority marker of bleeding. It does not change the immediate plan.",
    "No: bowel sounds return slowly after bowel surgery and say nothing about active bleeding.",
    "Yes: measured drain output and dressing saturation show how fast the client is losing blood.",
    "No: temperature does not track blood loss. It matters later for infection, not now."
   ]
  },
  "why": "The vital signs trend shows compensated shock turning into uncompensated shock from bleeding. A nurse who cannot reach the provider has a duty to escalate through the chain of command and to call for rapid response help. Monitor the vital signs and the measured blood loss to judge whether interventions are working.",
  "tip": "When a client is deteriorating and the provider does not answer, the correct answer is escalation, never waiting.",
  "cn": "mgmt"
 },
 {
  "id": "sa-mgmt-6",
  "type": "sata",
  "step": "eval",
  "sp": "ms",
  "sys": "legal",
  "topic": "Incident reports and fall charting",
  "stem": "At 0215 a new graduate nurse found a 79-year-old client on the bathroom floor on a med-surg unit. She assessed him, found no injury, and notified the provider. The charge nurse reviews her plan for documentation.",
  "q": "Which statements by the new nurse indicate correct understanding of documentation and incident reporting? Select all that apply.",
  "opts": [
   {
    "t": "\"I'll chart that I found him on the floor next to the toilet, plus my assessment findings.\"",
    "ok": true,
    "why": "Yes: the chart should hold objective facts: what was seen, where, and the assessment. She did not see the fall, so she documents what she found."
   },
   {
    "t": "\"I'll complete an incident report and send it to risk management according to policy.\"",
    "ok": true,
    "why": "Yes: incident reports go to risk management for quality improvement. They are an internal document, separate from the medical record."
   },
   {
    "t": "\"I'll write 'incident report filed' in my progress note so the record is complete.\"",
    "ok": false,
    "why": "No: mentioning the incident report in the chart can make it discoverable in a lawsuit. Chart the event and care, not the report."
   },
   {
    "t": "\"I'll document that he fell because the UAP didn't answer his call light.\"",
    "ok": false,
    "why": "No: the chart is not the place for blame or speculation about cause. Document only objective facts the nurse observed."
   },
   {
    "t": "\"I'll chart the time I notified the provider and the orders I received.\"",
    "ok": true,
    "why": "Yes: notification time and new orders show that the nurse acted promptly and followed through. This protects the client and the nurse."
   },
   {
    "t": "\"I'll put a copy of the incident report in his chart.\"",
    "ok": false,
    "why": "No: the incident report never goes in the medical record. Copying it into the chart defeats its confidential purpose."
   },
   {
    "t": "\"If I forget something, I'll add a late entry labeled with the current date and time.\"",
    "ok": true,
    "why": "Yes: a clearly labeled late entry is the legal way to add missed information. Backdating an entry is falsifying the record."
   }
  ],
  "why": "Chart objective facts, assessments, notifications and orders. The incident report is a separate quality document: it is filed with risk management, never copied into the chart and never mentioned in it. Blame and guesses about cause do not belong in documentation.",
  "tip": "Ask whether each statement is objective and belongs in the legal record; blame and references to the incident report do not.",
  "cn": "mgmt"
 },
 {
  "id": "sa-safety-5",
  "type": "bowtie",
  "step": "analyze",
  "sp": "sd",
  "sys": "medication safety",
  "topic": "Wrong-patient opioid error",
  "trend": true,
  "stem": "A 74-year-old opioid-naive client admitted for heart failure has no opioid orders. At 1300 he was given hydromorphone 2 mg IV that was meant for the client in the next room. Before the dose: RR 16, SpO₂ 95% on 2 L, alert and talking. At 1320, when the nurse discovers the error: RR 8 and shallow, SpO₂ 88% on 2 L, difficult to arouse, pupils pinpoint.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Acute decompensated heart failure",
    "Acute ischemic stroke",
    "Opioid-induced respiratory depression",
    "Hypoglycemia"
   ],
   "ans": 2
  },
  "actions": {
   "opts": [
    "Stay with the client, stimulate him, and call the rapid response team or provider",
    "Let him sleep and recheck vital signs at 1400",
    "Give his scheduled furosemide early",
    "Give naloxone as ordered or per protocol",
    "Complete the incident report before treating the client"
   ],
   "ans": [
    0,
    3
   ]
  },
  "params": {
   "opts": [
    "Daily weight",
    "Respiratory rate and depth",
    "Serum potassium",
    "Level of sedation",
    "Urine output"
   ],
   "ans": [
    1,
    3
   ]
  },
  "whys": {
   "cond": [
    "No: heart failure worsens over hours with crackles and dyspnea, not sudden sedation and pinpoint pupils right after an opioid.",
    "No: a stroke causes focal deficits such as facial droop or weakness. Pinpoint pupils and slow breathing point to an opioid.",
    "Yes: sedation, an RR of 8, falling SpO₂ and pinpoint pupils 20 minutes after an opioid in an opioid-naive client is opioid toxicity.",
    "No: hypoglycemia causes sweating and tachycardia, not pinpoint pupils and slow breathing. Check glucose, but it does not explain this picture."
   ],
   "actions": [
    "Yes: a client with respiratory depression is not left alone. Stimulating him to breathe and bringing help fast protects his airway.",
    "No: sleeping through an RR of 8 is how opioid deaths happen. Waiting is the trap.",
    "No: the diuretic treats fluid, not this problem. It distracts from the life threat.",
    "Yes: naloxone reverses opioid respiratory depression. Small titrated doses restore breathing while limiting pain and withdrawal.",
    "No: the incident report is required but comes after the client is safe. Treat first, report second."
   ],
   "params": [
    "No: daily weight tracks heart failure fluid, not the effect of the opioid.",
    "Yes: breathing is what the opioid is suppressing. Naloxone wears off sooner than hydromorphone, so watch for depression returning.",
    "No: potassium matters for his diuretic, but it does not show whether the opioid effect is resolving.",
    "Yes: sedation level worsens before breathing does, so it is the early warning sign of re-sedation.",
    "No: urine output is useful in heart failure but does not track opioid toxicity."
   ]
  },
  "why": "The change from alert with an RR of 16 to barely arousable with an RR of 8 after a wrong-patient opioid is respiratory depression caused by a medication error. Stay, support breathing, get help and give naloxone. Naloxone is shorter acting than hydromorphone, so keep monitoring sedation and respirations; then disclose and report the error.",
  "tip": "When an error harms a client, the first actions always treat the client; the reporting comes after.",
  "cn": "safety"
 },
 {
  "id": "sa-health-1",
  "type": "matrix",
  "step": "cues",
  "sp": "comm",
  "sys": "peds",
  "topic": "Growth at 12 months",
  "trend": true,
  "stem": "A 12-month-old girl is seen for a well-child visit. Birth weight 3.4 kg (7 lb 8 oz). Weight at 6 months: 6.8 kg (15 lb). Weight today: 7.4 kg (16 lb 5 oz). The parent says she pulls to stand and cruises along furniture, picks up cereal with her thumb and finger, and is not walking alone yet. The parent also says she does not turn when her name is called and does not babble.",
  "q": "For each finding, indicate whether it is expected for her age or requires follow-up.",
  "cols": [
   "Expected",
   "Requires follow-up"
  ],
  "rows": [
   {
    "t": "Weight at 6 months compared with birth weight",
    "ans": 0,
    "why": "Birth weight usually doubles by about 5 to 6 months. Going from 3.4 kg to 6.8 kg is right on track."
   },
   {
    "t": "Weight today compared with birth weight",
    "ans": 1,
    "why": "Birth weight should roughly triple by 12 months, to about 10 kg here. Gaining only 0.6 kg in 6 months is a sharp slowdown that needs evaluation."
   },
   {
    "t": "Not walking alone yet",
    "ans": 0,
    "why": "Most children walk alone between 12 and 15 months. Pulling to stand and cruising are the expected steps before that."
   },
   {
    "t": "Uses a pincer grasp to pick up cereal",
    "ans": 0,
    "why": "A neat pincer grasp develops by about 9 to 12 months. This is a normal fine motor milestone."
   },
   {
    "t": "Does not respond to her name and does not babble",
    "ans": 1,
    "why": "Babbling by 6 months and responding to her name by about 9 months are expected. Their absence suggests hearing loss or a developmental disorder and needs screening."
   }
  ],
  "why": "Compare each finding with the milestone timeline. Her weight doubled on time, then nearly stalled, which raises concern for poor growth. Motor skills are on track, but missing language and social milestones at 12 months need hearing and developmental evaluation.",
  "tip": "For growth trend items, compare each time point with the rule: double birth weight by 6 months, triple by 12 months.",
  "cn": "health"
 },
 {
  "id": "sa-health-2",
  "type": "sata",
  "step": "solve",
  "sp": "ob",
  "sys": "maternal",
  "topic": "Vaccines during pregnancy",
  "stem": "A 27-year-old at 28 weeks of gestation is seen in October for a routine prenatal visit. Her labs show she is not immune to rubella, and she has no history of varicella or varicella vaccine. She has never received Tdap.",
  "q": "Which vaccines should the nurse anticipate giving during this pregnancy? Select all that apply.",
  "opts": [
   {
    "t": "Tdap",
    "ok": true,
    "why": "Yes: Tdap is recommended in every pregnancy, ideally at 27 to 36 weeks. Maternal antibodies protect the newborn from pertussis before infant vaccines take effect."
   },
   {
    "t": "Inactivated influenza vaccine by injection",
    "ok": true,
    "why": "Yes: the inactivated flu shot is recommended in any trimester during flu season. Pregnancy increases the risk of severe influenza."
   },
   {
    "t": "Measles, mumps and rubella (MMR)",
    "ok": false,
    "why": "No: MMR is a live vaccine and is not given in pregnancy. She should receive it postpartum, before discharge."
   },
   {
    "t": "Varicella vaccine",
    "ok": false,
    "why": "No: varicella is a live vaccine and is contraindicated in pregnancy. It is given after delivery."
   },
   {
    "t": "Live attenuated influenza vaccine by nasal spray",
    "ok": false,
    "why": "No: the nasal flu vaccine is live and not used in pregnancy. The trap is thinking any flu vaccine is fine."
   },
   {
    "t": "Human papillomavirus (HPV) vaccine",
    "ok": false,
    "why": "No: HPV vaccination is postponed until after pregnancy. It is not live, but it is not recommended during pregnancy."
   }
  ],
  "why": "Inactivated vaccines that protect mother and baby, such as Tdap and the flu shot, are given during pregnancy. Live vaccines (MMR, varicella, nasal flu) are avoided until after delivery. A rubella nonimmune client receives MMR postpartum.",
  "tip": "In pregnancy, rule out every live vaccine first, then choose the inactivated ones that protect the newborn.",
  "cn": "health"
 },
 {
  "id": "sa-health-3",
  "type": "bowtie",
  "step": "hypo",
  "sp": "ob",
  "sys": "maternal",
  "topic": "Placenta previa",
  "stem": "A 33-year-old, G3 P2, at 32 weeks of gestation comes to labor and delivery with bright red vaginal bleeding that started while she was sitting on the couch. She has no pain or contractions. The uterus is soft and nontender. She has had two cesarean births. BP 118/72, HR 96. Fetal heart rate 140 with moderate variability.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Placental abruption",
    "Preterm labor",
    "Uterine rupture",
    "Placenta previa"
   ],
   "ans": 3
  },
  "actions": {
   "opts": [
    "Avoid any digital vaginal examination",
    "Perform a sterile vaginal exam to check dilation",
    "Start continuous electronic fetal monitoring",
    "Position her flat on her back",
    "Encourage her to walk to stimulate labor"
   ],
   "ans": [
    0,
    2
   ]
  },
  "params": {
   "opts": [
    "Deep tendon reflexes",
    "Amount of vaginal bleeding",
    "Fetal heart rate pattern",
    "Fundal height",
    "Blood glucose"
   ],
   "ans": [
    1,
    2
   ]
  },
  "whys": {
   "cond": [
    "No: abruption usually causes pain and a firm, tender uterus, often with dark bleeding. This client has none of these.",
    "No: preterm labor causes contractions and cervical change. Painless bright red bleeding without contractions points elsewhere.",
    "No: uterine rupture causes sudden severe pain and signs of shock or fetal distress, usually during labor.",
    "Yes: painless bright red bleeding with a soft uterus in the third trimester is placenta previa. Prior cesarean births are a major risk factor."
   ],
   "actions": [
    "Yes: a vaginal exam can tear the low-lying placenta and cause massive hemorrhage. Nothing goes in the vagina until previa is ruled out by ultrasound.",
    "No: this is the trap. A digital exam is contraindicated with suspected previa.",
    "Yes: continuous monitoring detects fetal compromise from blood loss early.",
    "No: lying flat compresses the vena cava and reduces placental blood flow. A side-lying position is preferred.",
    "No: walking may increase bleeding. Activity is limited while she is bleeding."
   ],
   "params": [
    "No: reflexes are monitored for magnesium sulfate and preeclampsia, not previa.",
    "Yes: pad counts or weighed pads quantify blood loss and guide decisions about delivery.",
    "Yes: the fetal heart rate shows whether placental blood flow is adequate.",
    "No: fundal height is a routine growth measure and does not change acute management.",
    "No: glucose is not affected by this condition."
   ]
  },
  "why": "Painless bright red bleeding in the third trimester is placenta previa until ultrasound shows otherwise. Never perform a vaginal exam, monitor the fetus continuously and quantify the bleeding. Abruption is the main alternative, and it usually comes with pain and a rigid uterus.",
  "tip": "Use pain to split the two big third-trimester bleeds: painless and bright red is previa; painful with a firm uterus is abruption.",
  "cn": "health"
 },
 {
  "id": "sa-health-4",
  "type": "highlight",
  "step": "eval",
  "sp": "ob",
  "sys": "newborn",
  "topic": "Newborn discharge teaching",
  "stem": "Before discharge, the nurse asks the parents of a healthy 2-day-old term newborn to describe how they will care for him at home.",
  "q": "Highlight the statements that indicate a need for more teaching.",
  "parts": [
   {
    "t": "\"We'll lay him on his back in his own crib to sleep.\"",
    "ok": false,
    "why": "No: back to sleep, alone, in a crib is correct safe sleep practice. It lowers the risk of sudden infant death."
   },
   {
    "t": "\"We bought soft bumpers and a blanket so he's cozy in the crib.\"",
    "ok": true,
    "why": "Yes: bumpers and loose bedding raise suffocation and SIDS risk. The crib should hold only a firm mattress and a fitted sheet."
   },
   {
    "t": "\"We'll fold his diaper below the cord stump and let it fall off on its own.\"",
    "ok": false,
    "why": "No: keeping the stump clean, dry and uncovered lets it dry and separate naturally in 1 to 2 weeks."
   },
   {
    "t": "\"His car seat will face forward in the back seat so we can see him in the mirror.\"",
    "ok": true,
    "why": "Yes: infants ride rear-facing in the back seat. Rear-facing protects the head and neck in a crash."
   },
   {
    "t": "\"If his rectal temperature is 38 °C (100.4 °F) or higher, we'll call the pediatrician right away.\"",
    "ok": false,
    "why": "No: fever in a newborn under 3 months needs prompt evaluation. This shows correct understanding."
   },
   {
    "t": "\"We'll give him some water between feedings when it's hot outside.\"",
    "ok": true,
    "why": "Yes: young infants should not get plain water. It can cause low sodium and seizures; breast milk or formula meets fluid needs."
   },
   {
    "t": "\"By the end of the first week we expect at least 6 wet diapers a day.\"",
    "ok": false,
    "why": "No: 6 or more wet diapers a day after the first several days shows adequate intake. This is correct."
   }
  ],
  "why": "Discharge teaching is evaluated by listening for unsafe plans. Soft bedding, a forward-facing car seat and water for a newborn are all dangerous. Back to sleep, dry cord care, calling for fever and counting wet diapers are correct.",
  "tip": "In eval items about teaching, look for the statements that would harm the client if acted on.",
  "cn": "health"
 },
 {
  "id": "sa-health-5",
  "type": "cloze",
  "step": "act",
  "sp": "comm",
  "sys": "screening",
  "topic": "Adult cancer screening schedule",
  "stem": "A 46-year-old woman at average risk for cancer has never had colorectal cancer screening. Her last cervical cancer screening, 2 years ago, was a negative primary HPV test. She asks the clinic nurse what screening she is due for.",
  "q": "Complete the sentences.",
  "parts": [
   "The nurse explains that average-risk adults should begin colorectal cancer screening at age ",
   {
    "opts": [
     "50",
     "45",
     "55"
    ],
    "ans": 1,
    "whys": [
     "No: 50 was the older starting age. Current USPSTF and ACS guidance lowered it because of rising colorectal cancer in younger adults.",
     "Yes: average-risk adults begin colorectal screening at 45. At 46, she is already due.",
     "No: starting at 55 would miss years of screening. No current guideline uses this age."
    ]
   },
   ". If her colonoscopy is normal, it is repeated every ",
   {
    "opts": [
     "3 years",
     "5 years",
     "10 years"
    ],
    "ans": 2,
    "whys": [
     "No: a 3-year interval is used for some stool DNA tests, not a normal colonoscopy.",
     "No: 5 years applies to CT colonography or flexible sigmoidoscopy, not a normal colonoscopy. This is a common mix-up.",
     "Yes: a normal colonoscopy in an average-risk adult is repeated every 10 years."
    ]
   },
   ". Her next cervical cancer screening is due in ",
   {
    "opts": [
     "3 years",
     "1 year",
     "8 years"
    ],
    "ans": 0,
    "whys": [
     "Yes: primary HPV testing for ages 30 to 65 is repeated every 5 years. Her last test was 2 years ago, so she is due in 3 years.",
     "No: annual cervical screening is no longer recommended for average-risk adults. It leads to unnecessary procedures.",
     "No: waiting 8 years would exceed the 5-year interval for primary HPV testing."
    ]
   },
   "."
  ],
  "why": "Average-risk colorectal screening starts at 45, and a normal colonoscopy is repeated every 10 years. For ages 30 to 65, cervical screening is primary HPV testing every 5 years, HPV with cytology every 5 years, or cytology alone every 3 years.",
  "tip": "Learn the anchor numbers: colorectal screening starts at 45, colonoscopy every 10 years, HPV testing every 5 years.",
  "cn": "health"
 },
 {
  "id": "sa-health-6",
  "type": "matrix",
  "step": "analyze",
  "sp": "ms",
  "sys": "aging",
  "topic": "Aging versus acute change",
  "stem": "An 84-year-old woman is admitted for observation after a fall at home with no fracture. Her daughter says she lives alone and was \"sharp as a tack\" last week. The nurse completes the admission assessment.",
  "q": "For each finding, indicate whether it is an expected age-related change or requires further evaluation.",
  "cols": [
   "Expected age-related change",
   "Requires further evaluation"
  ],
  "rows": [
   {
    "t": "Needs reading glasses to read the menu",
    "ans": 0,
    "why": "Presbyopia, the loss of near focus as the lens stiffens, is a normal change of aging."
   },
   {
    "t": "Gets up once a night to urinate",
    "ans": 0,
    "why": "Bladder capacity falls and nighttime urine production rises with age, so one episode of nocturia is common."
   },
   {
    "t": "Confused about where she is since yesterday",
    "ans": 1,
    "why": "A sudden change in mental status is delirium until proven otherwise. Confusion is never a normal part of aging."
   },
   {
    "t": "Thin, dry skin that bruises easily",
    "ans": 0,
    "why": "The skin loses collagen, fat and oil glands with age. Thin, fragile skin is expected, though it raises injury risk."
   },
   {
    "t": "New urinary incontinence and burning on urination",
    "ans": 1,
    "why": "New incontinence with dysuria suggests a urinary tract infection. In older adults a UTI can also cause sudden confusion and falls."
   },
   {
    "t": "Takes longer to answer questions but answers correctly",
    "ans": 0,
    "why": "Processing speed slows with age, but accuracy and judgment stay intact. This is expected."
   }
  ],
  "why": "Normal aging slows the body but does not cause sudden change. Presbyopia, mild nocturia, fragile skin and slower responses are expected. New confusion, new incontinence and dysuria point to an acute problem such as infection, which may also explain the fall.",
  "tip": "Ask whether a finding is gradual or sudden; sudden change in an older adult is never just aging.",
  "cn": "health"
 },
 {
  "id": "sa-psych-1",
  "type": "matrix",
  "step": "act",
  "sp": "teen",
  "sys": "mental health",
  "topic": "Responding to adolescent self-harm",
  "stem": "A 16-year-old on the adolescent psych unit, admitted after cutting her forearms, tells the nurse, \"Nobody gets it. My parents think I'm doing this for attention.\"",
  "q": "For each nurse response, indicate whether it is therapeutic or nontherapeutic.",
  "cols": [
   "Therapeutic",
   "Nontherapeutic"
  ],
  "rows": [
   {
    "t": "\"It sounds like you feel your parents don't understand what you're going through.\"",
    "ans": 0,
    "why": "Reflecting her feelings shows the nurse is listening and invites her to say more."
   },
   {
    "t": "\"Why do you cut yourself?\"",
    "ans": 1,
    "why": "Why questions demand a justification and make clients defensive. An open-ended question about the experience works better."
   },
   {
    "t": "\"Tell me what usually happens right before you cut.\"",
    "ans": 0,
    "why": "This broad opening explores triggers and feelings without judgment, which guides safety planning."
   },
   {
    "t": "\"I'm sure your parents love you and want what's best for you.\"",
    "ans": 1,
    "why": "False reassurance dismisses her feelings and takes the parents' side. It shuts down the conversation."
   },
   {
    "t": "\"When I was your age, I felt the same way about my parents.\"",
    "ans": 1,
    "why": "This shifts the focus to the nurse. Self-disclosure that moves attention away from the client is nontherapeutic."
   },
   {
    "t": "\"I'd like to sit with you for a while.\"",
    "ans": 0,
    "why": "Offering self conveys acceptance and presence, which builds trust with a client who feels unheard."
   }
  ],
  "why": "Therapeutic responses keep the focus on the client's feelings: reflecting, open-ended exploring and offering presence. Why questions, false reassurance and self-focused stories block communication. With self-harm, understanding triggers is also part of the safety assessment.",
  "tip": "Pick the response that keeps the focus on the client's feelings and invites more talk; avoid why, reassurance and advice.",
  "cn": "psychosocial"
 },
 {
  "id": "sa-psych-2",
  "type": "bowtie",
  "step": "hypo",
  "sp": "ms",
  "sys": "mental health",
  "topic": "Depression in an older widower",
  "trend": true,
  "stem": "A 78-year-old man on a med-surg unit is recovering from surgical repair of a hip fracture. His wife died 3 months ago. On post-op day 2 he said, \"What's the point of rehab? There's nothing to go home to,\" ate 25% of his meals and slept poorly. On post-op day 6 he is calm and smiling, says he \"finally feels at peace,\" and has asked his son to bring his will and to give his dog to a neighbor.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Depression improving with physical recovery",
    "High risk for suicide",
    "Postoperative delirium",
    "Uncomplicated grief"
   ],
   "ans": 1
  },
  "actions": {
   "opts": [
    "Ask him directly whether he is thinking about killing himself",
    "Tell him things will look better once he is home",
    "Wait for the psychiatry consult in the morning before discussing suicide",
    "Ask him to sign a no-suicide contract",
    "Notify the provider and start continuous observation per policy"
   ],
   "ans": [
    0,
    4
   ]
  },
  "params": {
   "opts": [
    "Suicidal thoughts, plan and intent on each reassessment",
    "Incision appearance",
    "Serum sodium",
    "Mood and behavior, including hopeless statements",
    "Bowel sounds"
   ],
   "ans": [
    0,
    3
   ]
  },
  "whys": {
   "cond": [
    "No: this is the trap. A sudden lift in mood after hopelessness, with putting affairs in order, can mean he has decided on a plan.",
    "Yes: an older widowed man with hopelessness, recent loss and illness who suddenly feels at peace and gives away a pet has several high-risk warning signs.",
    "No: delirium causes fluctuating attention and confusion. He is calm, clear and purposeful.",
    "No: grief includes sadness but not hopelessness about living plus giving away possessions. Those are suicide warning signs."
   ],
   "actions": [
    "Yes: asking directly about suicide does not plant the idea. It opens the conversation and is the only way to assess plan and intent.",
    "No: false reassurance dismisses his feelings and misses the risk. It closes the conversation.",
    "No: delaying assessment leaves a high-risk client unprotected overnight. The nurse assesses and acts now.",
    "No: no-suicide contracts do not prevent suicide and can give false comfort. A safety plan with observation is used instead.",
    "Yes: high risk requires a safe environment and close observation. The provider needs to know for a psychiatric evaluation."
   ],
   "params": [
    "Yes: ideation, plan and intent show how imminent the risk is and guide the level of observation.",
    "No: the incision matters for healing but not for suicide risk.",
    "No: sodium does not reflect his current risk.",
    "Yes: changes in mood and hopeless statements, along with behaviors like giving things away, track whether risk is rising or falling.",
    "No: bowel sounds are a routine post-op check unrelated to this concern."
   ]
  },
  "why": "Older men who are widowed and newly ill have one of the highest suicide rates. The trend from hopelessness to sudden calm, with a will and a pet being given away, signals a possible decision to die. Ask directly, keep him safe with close observation, and involve the provider.",
  "tip": "A sudden improvement in mood in a depressed client is a red flag, not a sign of recovery.",
  "cn": "psychosocial"
 },
 {
  "id": "sa-psych-3",
  "type": "highlight",
  "step": "cues",
  "sp": "ed",
  "sys": "abuse",
  "topic": "Elder abuse cues",
  "stem": "Emergency department triage note for an 82-year-old woman with moderate dementia, brought in by her adult grandson, who is her live-in caregiver.",
  "q": "Highlight the findings that suggest possible elder abuse or neglect.",
  "parts": [
   {
    "t": "Grandson answers every question for her and refuses to leave the room.",
    "ok": true,
    "why": "Yes: a controlling caregiver who will not let the client speak alone is a common warning sign. The nurse should find a way to interview her privately."
   },
   {
    "t": "Bruises in different stages of healing on both upper inner arms.",
    "ok": true,
    "why": "Yes: bruises of different ages on the inner arms suggest repeated grabbing. Accidental falls usually injure bony areas."
   },
   {
    "t": "She says she fell \"a few days ago\"; the grandson says she fell this morning.",
    "ok": true,
    "why": "Yes: a history that changes or does not match is a red flag for abuse. Document both accounts in their own words."
   },
   {
    "t": "Stage 3 pressure injury on the sacrum; clothing soiled with dried urine.",
    "ok": true,
    "why": "Yes: an advanced pressure injury and poor hygiene in a dependent adult suggest caregiver neglect."
   },
   {
    "t": "History of osteoarthritis in both knees.",
    "ok": false,
    "why": "No: osteoarthritis is common at her age. It explains joint pain and fall risk but is not a sign of abuse."
   },
   {
    "t": "Takes donepezil daily for dementia.",
    "ok": false,
    "why": "No: this is standard dementia treatment and not a warning sign by itself."
   },
   {
    "t": "Uses a walker at home.",
    "ok": false,
    "why": "No: a walker is an expected mobility aid for an older adult with arthritis."
   }
  ],
  "why": "Elder abuse cues include a controlling caregiver, injuries in unusual places or different stages of healing, inconsistent histories and signs of neglect. Dependence from dementia raises her risk. Nurses must report suspected elder abuse according to state law; proof is not required.",
  "tip": "Look for mismatches: injuries that do not fit the story, and a caregiver who controls the conversation.",
  "cn": "psychosocial"
 },
 {
  "id": "sa-psych-4",
  "type": "cloze",
  "step": "analyze",
  "sp": "ms",
  "sys": "grief",
  "topic": "Denial and anger in grief",
  "stem": "A 54-year-old on a med-surg unit learned yesterday that his liver biopsy shows metastatic pancreatic cancer. Today he tells the nurse, \"The lab must have mixed up my sample. I'll be back at work next week.\" An hour later he yells at the dietary aide because his coffee is cold.",
  "q": "Complete the sentences.",
  "parts": [
   "The client's statement about the lab is an example of ",
   {
    "opts": [
     "projection",
     "denial",
     "rationalization"
    ],
    "ans": 1,
    "whys": [
     "No: projection is blaming others for one's own unacceptable feelings. He is not attributing his feelings to anyone.",
     "Yes: refusing to accept a painful reality, such as a new cancer diagnosis, is denial. It is a common first response to bad news.",
     "No: rationalization is making up a logical-sounding excuse for behavior. He is rejecting the diagnosis itself."
    ]
   },
   ", which the nurse recognizes as ",
   {
    "opts": [
     "an expected early response to a major loss",
     "a sign of psychosis that needs medication",
     "a refusal of treatment to document"
    ],
    "ans": 0,
    "whys": [
     "Yes: denial buffers shocking news and usually fades as the person absorbs it. The nurse accepts it without arguing or reinforcing it.",
     "No: denial is not a break from reality like a delusion. Labeling it psychosis is the trap.",
     "No: he has not refused any care. Disbelief about a diagnosis is not a refusal of treatment."
    ]
   },
   ". His shouting at the dietary aide is most consistent with ",
   {
    "opts": [
     "sublimation",
     "regression",
     "displacement"
    ],
    "ans": 2,
    "whys": [
     "No: sublimation channels feelings into a socially acceptable activity, such as exercise or art. Yelling is not that.",
     "No: regression is a return to earlier developmental behavior, such as bedwetting or thumb-sucking. This is anger aimed at a safe target.",
     "Yes: he is moving anger about his diagnosis onto a less threatening person. This is displacement and also fits the anger stage of grief."
    ]
   },
   "."
  ],
  "why": "Shock at a terminal diagnosis often shows up first as denial, then anger. Denial is protective early on and is not challenged harshly. Displaced anger at staff is common; the nurse responds calmly and does not take it personally.",
  "tip": "Name the defense mechanism by asking what feeling is being handled and where it is directed.",
  "cn": "psychosocial"
 },
 {
  "id": "sa-psych-6",
  "type": "sata",
  "step": "eval",
  "sp": "ed",
  "sys": "substance use",
  "topic": "Naloxone and buprenorphine teaching",
  "stem": "A 31-year-old was treated in the emergency department for an opioid overdose and is ready for discharge with a naloxone nasal spray kit and a referral for buprenorphine treatment. The nurse evaluates the client's understanding of the teaching.",
  "q": "Which statements by the client indicate understanding of the teaching? Select all that apply.",
  "opts": [
   {
    "t": "\"If I won't wake up, my roommate should spray the naloxone in my nose and call 911.\"",
    "ok": true,
    "why": "Yes: naloxone is given by the person nearby, and emergency help is always called. This shows correct understanding."
   },
   {
    "t": "\"If I don't wake up in 2 to 3 minutes, a second spray can go in the other nostril.\"",
    "ok": true,
    "why": "Yes: repeat doses are given every 2 to 3 minutes, alternating nostrils, until breathing improves or help arrives. Strong opioids such as fentanyl may need more than one."
   },
   {
    "t": "\"Once I wake up after naloxone, I'm safe to stay home alone.\"",
    "ok": false,
    "why": "No: naloxone wears off before many opioids do, so breathing can slow again. Someone must stay with the client and get medical care."
   },
   {
    "t": "\"My tolerance is lower after a few days without using, so my usual amount could kill me.\"",
    "ok": true,
    "why": "Yes: tolerance falls quickly after a period without use. Overdose risk is very high when someone returns to a previous dose."
   },
   {
    "t": "\"I should never use alone.\"",
    "ok": true,
    "why": "Yes: having another person present means someone can give naloxone and call for help. This is a key harm reduction step."
   },
   {
    "t": "\"Buprenorphine just swaps one addiction for another, so I'll quit cold turkey instead.\"",
    "ok": false,
    "why": "No: medication for opioid use disorder lowers overdose death and relapse. Stopping without treatment carries high relapse and overdose risk."
   }
  ],
  "why": "Effective teaching after an overdose covers how bystanders give naloxone, repeat doses, calling 911 and staying with the person. It also covers the risk of lost tolerance and never using alone. Medication for opioid use disorder is evidence-based treatment, not a substitute addiction.",
  "tip": "In teaching evaluation items, choose the statements that would keep the client alive if acted on.",
  "cn": "psychosocial"
 },
 {
  "id": "sa-basic-1",
  "type": "highlight",
  "step": "cues",
  "sp": "ms",
  "sys": "gi",
  "topic": "Enteral feeding safety",
  "stem": "A 76-year-old with dysphagia after a stroke receives a continuous enteral feeding at 55 mL/h through a small-bore nasogastric tube. Placement was confirmed by x-ray on admission. The nurse reviews the 0400 note.",
  "q": "Highlight the findings that require follow-up.",
  "parts": [
   {
    "t": "Head of bed at 15 degrees after a linen change at 0315.",
    "ok": true,
    "why": "Yes: a continuous feeding needs the head of bed at 30 to 45 degrees; lying flatter lets formula reflux and be aspirated."
   },
   {
    "t": "External tube mark at the nare is 8 cm longer than the mark documented after x-ray confirmation.",
    "ok": true,
    "why": "Yes: a longer external length means the tube has pulled back and the tip may sit in the esophagus. Stop the feeding and verify placement."
   },
   {
    "t": "Coughing with a wet, gurgling voice since 0330.",
    "ok": true,
    "why": "Yes: new coughing and a wet voice during a feeding suggest aspiration. Stop the feeding and assess the lungs and oxygen saturation."
   },
   {
    "t": "Gastric residual volume 90 mL, returned to the stomach.",
    "ok": false,
    "why": "No: 90 mL is well under the usual hold threshold of 250 to 500 mL, and returning it preserves fluid and electrolytes. The trap is treating any residual as a problem."
   },
   {
    "t": "Skin at the nare intact; tube secured with a fixation device.",
    "ok": false,
    "why": "No: intact skin and a secured tube are the goal. Keep checking the nare for pressure injury each shift."
   },
   {
    "t": "Bowel sounds present in all four quadrants.",
    "ok": false,
    "why": "No: active bowel sounds support continuing the feeding. Absent sounds with distension would be the concern."
   }
  ],
  "why": "Three findings point the same way: the head of the bed is low, the tube has migrated out, and the client is coughing with a wet voice. Together they suggest aspiration of formula. The nurse stops the feeding, raises the head of the bed, and verifies tube position before restarting.",
  "tip": "For tube feeding items, check position, placement and tolerance in that order; any sign the tip moved comes before a residual number.",
  "cn": "basic"
 },
 {
  "id": "sa-basic-2",
  "type": "matrix",
  "step": "eval",
  "sp": "comm",
  "sys": "musculoskeletal",
  "topic": "Non-weight-bearing crutch gait",
  "stem": "A 16-year-old with a fractured left ankle is ordered non-weight-bearing on the left leg with axillary crutches. After teaching, the nurse watches her demonstrate crutch walking in the clinic hallway and on the practice stairs.",
  "q": "For each observation, indicate whether it shows correct technique or a need for more teaching.",
  "cols": [
   "Correct technique",
   "Needs more teaching"
  ],
  "rows": [
   {
    "t": "Leans on the axillary pads with her armpits to rest while standing.",
    "ans": 1,
    "why": "Weight on the axillary pads compresses the brachial plexus and can cause crutch palsy. Weight belongs on the hands, with the pads 2 to 3 finger widths below the axilla."
   },
   {
    "t": "Elbows flexed about 30 degrees with her hands on the grips.",
    "ans": 0,
    "why": "About 20 to 30 degrees of elbow flexion lets the arms bear weight and extend through each step. This is correct fit."
   },
   {
    "t": "Moves both crutches and the left leg forward together, then swings the right leg through.",
    "ans": 0,
    "why": "This is the correct three-point gait for non-weight-bearing: the crutches carry the load the injured leg cannot."
   },
   {
    "t": "Going up the stairs, places the crutches on the higher step first.",
    "ans": 1,
    "why": "Going up, the strong leg leads, then the crutches and injured leg follow. Remember: up with the good, down with the bad."
   },
   {
    "t": "Going down the stairs, places the crutches and left leg on the lower step first, then the right leg.",
    "ans": 0,
    "why": "Going down, the crutches and injured leg lead so the strong leg lowers the body. This is correct."
   },
   {
    "t": "Plans to remove the throw rugs in her bedroom before she goes home.",
    "ans": 0,
    "why": "Loose rugs catch crutch tips and cause falls. Clearing walkways is correct home safety teaching."
   }
  ],
  "why": "Safe crutch use depends on fit, gait and stairs. Weight goes through the hands, never the armpits. On stairs the strong leg leads going up and the crutches with the injured leg lead going down.",
  "tip": "For assistive device items, picture the injured leg and ask which leg is doing the lifting at each step.",
  "cn": "basic"
 },
 {
  "id": "sa-basic-3",
  "type": "cloze",
  "step": "analyze",
  "sp": "icu",
  "sys": "integumentary",
  "topic": "Stage 3 pressure injury",
  "stem": "A 68-year-old on day 9 of mechanical ventilation has a sacral wound. It is 4 cm by 3 cm with full-thickness skin loss. Subcutaneous fat is visible in the base. No bone, tendon or muscle is visible. The base is red with a small amount of yellow slough that does not hide the depth. Braden score is 11.",
  "q": "Complete the sentences.",
  "parts": [
   "The nurse documents this wound as a ",
   {
    "opts": [
     "stage 3 pressure injury",
     "stage 2 pressure injury",
     "deep tissue pressure injury"
    ],
    "ans": 0,
    "whys": [
     "Yes: full-thickness loss with visible fat but no exposed bone, tendon or muscle is stage 3. Slough that does not hide the base does not change the stage.",
     "No: stage 2 is partial-thickness loss with exposed dermis; fat is never visible. Visible fat moves the wound past stage 2.",
     "No: deep tissue injury is intact or non-intact skin with persistent deep red, maroon or purple discoloration, not an open wound with visible fat."
    ]
   },
   ". The wound would instead be called unstageable if ",
   {
    "opts": [
     "slough or eschar covered the base so the depth could not be seen",
     "it produced moderate serous drainage",
     "the surrounding skin had blanchable redness"
    ],
    "ans": 0,
    "whys": [
     "Yes: unstageable means the depth is hidden by slough or eschar, so the true stage cannot be confirmed until the base is seen.",
     "No: drainage amount is documented but does not change the stage. Staging is based on tissue depth.",
     "No: blanchable redness around a wound is common and does not obscure the base. Nonblanchable redness on intact skin is stage 1."
    ]
   },
   ". The most important measure to prevent new pressure injuries in this client is ",
   {
    "opts": [
     "repositioning at least every 2 hours with offloading of bony prominences",
     "massaging reddened areas over bony prominences",
     "placing a ring-shaped cushion under the sacrum"
    ],
    "ans": 0,
    "whys": [
     "Yes: a Braden score of 11 means high risk. Regular turning and offloading relieve the pressure that causes tissue ischemia.",
     "No: massage over reddened bony areas damages fragile capillaries and deeper tissue. It is a classic trap.",
     "No: ring or donut cushions concentrate pressure on the surrounding tissue and reduce blood flow. They are not recommended."
    ]
   },
   "."
  ],
  "why": "Pressure injuries are staged by the deepest tissue visible. Visible fat without bone, tendon or muscle is stage 3. If slough or eschar hides the base, the wound is unstageable. Prevention rests on pressure relief, moisture control and nutrition.",
  "tip": "Stage by the deepest layer you can see; if you cannot see the base, it is unstageable.",
  "cn": "basic"
 },
 {
  "id": "sa-basic-4",
  "type": "bowtie",
  "step": "hypo",
  "sp": "ms",
  "sys": "gi",
  "topic": "Fecal impaction on opioids",
  "stem": "An 84-year-old is on post-op day 4 after hip fracture repair and takes oxycodone every 4 hours. She has had no formed stool for 6 days. Since this morning she has leaked small amounts of liquid brown stool. Her abdomen is distended and she has cramping and no appetite. Bowel sounds are hypoactive. T 37 °C (98.6 °F), WBC 8,200/mm³. Loperamide is ordered as needed for diarrhea.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Fecal impaction",
    "Clostridioides difficile infection",
    "Paralytic ileus",
    "Lower gastrointestinal bleeding"
   ],
   "ans": 0
  },
  "actions": {
   "opts": [
    "Withhold the loperamide and report the stool pattern to the provider",
    "Give an oil-retention enema as prescribed",
    "Give loperamide after each liquid stool",
    "Increase the oxycodone dose for the cramping",
    "Limit fluids to reduce the stool leakage"
   ],
   "ans": [
    0,
    1
   ]
  },
  "params": {
   "opts": [
    "Passage and character of stool",
    "Abdominal distension and girth",
    "Hemoglobin A1c",
    "Serum calcium",
    "Urine specific gravity"
   ],
   "ans": [
    0,
    1
   ]
  },
  "whys": {
   "cond": [
    "Yes: no formed stool for 6 days on an opioid, with immobility, followed by liquid seepage, is classic impaction. Liquid stool leaks around the hard mass.",
    "No: C. difficile causes frequent watery stools, often with fever and a high WBC. This client has a long stool-free stretch, normal temperature and a normal WBC.",
    "No: ileus causes absent bowel sounds and no stool at all. This client still has bowel sounds and is passing liquid stool.",
    "No: GI bleeding produces black or bloody stool and may drop the blood pressure. The stool here is brown."
   ],
   "actions": [
    "Yes: an antidiarrheal would worsen the impaction. Reporting the pattern gets the right treatment ordered.",
    "Yes: an oil-retention enema softens the hardened stool so it can pass or be removed.",
    "No: loperamide slows the bowel further. Treating the leakage as diarrhea is the trap.",
    "No: opioids caused the slowed bowel. More opioid worsens constipation; a bowel regimen is needed.",
    "No: fluid restriction hardens stool. Adequate fluids are part of preventing and treating impaction."
   ],
   "params": [
    "Yes: passage of formed stool shows the impaction is clearing. Continued seepage means it is not.",
    "Yes: distension and girth show whether stool and gas are building up or relieved.",
    "No: A1c reflects glucose control over 3 months. It has no role here.",
    "No: calcium imbalances can affect the bowel, but nothing here points to them.",
    "No: specific gravity reflects hydration and kidney concentrating ability, not bowel function."
   ]
  },
  "why": "Immobility, opioids and older age slow the colon until stool hardens into an impaction. Liquid stool then leaks around the mass and is easily mistaken for diarrhea. The nurse holds the antidiarrheal, treats the impaction as prescribed, and starts a bowel regimen to prevent recurrence.",
  "tip": "When liquid stool follows days of no stool, think impaction before diarrhea.",
  "cn": "basic"
 },
 {
  "id": "sa-basic-5",
  "type": "sata",
  "step": "act",
  "sp": "ms",
  "sys": "gi",
  "topic": "Colostomy pouch change",
  "stem": "A 62-year-old is on post-op day 5 after a descending colostomy for colon cancer. The stoma is moist and red. The nurse is changing the pouching system and teaching the client at the same time.",
  "q": "Which actions should the nurse take? Select all that apply.",
  "opts": [
   {
    "t": "Cut the skin barrier opening about 1/16 to 1/8 inch (2 to 3 mm) larger than the stoma.",
    "ok": true,
    "why": "Yes: a close fit keeps stool off the peristomal skin while leaving room so the barrier does not cut into the stoma."
   },
   {
    "t": "Clean the skin around the stoma with warm water and pat it dry.",
    "ok": true,
    "why": "Yes: plain water cleans without leaving residue, and dry skin lets the barrier seal."
   },
   {
    "t": "Measure the stoma at each change during the first several weeks.",
    "ok": true,
    "why": "Yes: a new stoma shrinks as swelling goes down over about 6 to 8 weeks, so the opening size changes."
   },
   {
    "t": "Teach the client to empty the pouch when it is one-third to one-half full.",
    "ok": true,
    "why": "Yes: a heavy pouch pulls the seal loose and leaks. Emptying early protects the skin and the seal."
   },
   {
    "t": "Clean the skin with an alcohol wipe to remove oils before applying the barrier.",
    "ok": false,
    "why": "No: alcohol dries and irritates peristomal skin and stings any broken areas. Water is preferred."
   },
   {
    "t": "Apply a moisturizing lotion around the stoma before placing the barrier.",
    "ok": false,
    "why": "No: lotion leaves a film that keeps the barrier from adhering, causing leaks and skin breakdown."
   },
   {
    "t": "Cut the barrier opening about 1/2 inch (13 mm) larger than the stoma to avoid pressure.",
    "ok": false,
    "why": "No: a wide gap exposes skin to stool, which causes irritation and breakdown. The trap is overcorrecting for stoma pressure."
   }
  ],
  "why": "A good pouch change protects the peristomal skin. The opening fits closely, the skin is clean and dry with no residue, and the pouch is emptied before it gets heavy. A new stoma shrinks for several weeks, so it is measured each time.",
  "tip": "For ostomy care, choose options that protect the skin and the seal; anything that leaves residue or exposed skin is wrong.",
  "cn": "basic"
 },
 {
  "id": "sa-basic-6",
  "type": "matrix",
  "step": "eval",
  "sp": "ms",
  "sys": "comfort",
  "topic": "PAINAD reassessment",
  "trend": true,
  "stem": "An 88-year-old with advanced dementia is on post-op day 1 after hip repair and cannot rate her pain. At 0200 the nurse scored the Pain Assessment in Advanced Dementia (PAINAD) scale at 8 and gave the prescribed oxycodone, then repositioned her with pillows supporting the operative leg. The nurse reassesses at 0300.",
  "q": "For each finding, indicate whether it has improved, is unchanged, or has worsened since 0200.",
  "cols": [
   "Improved",
   "Unchanged",
   "Worsened"
  ],
  "rows": [
   {
    "t": "Breathing: 0200 labored, RR 26; 0300 unlabored, RR 18.",
    "ans": 0,
    "why": "Labored, rapid breathing is a pain behavior on the PAINAD. Easy breathing at 18 is improvement, and the rate is not low enough to suggest oversedation."
   },
   {
    "t": "Vocalization: 0200 repeatedly calling out; 0300 occasional soft moan.",
    "ans": 0,
    "why": "Repeated calling out scores higher than an occasional moan. This is improvement, though not complete relief."
   },
   {
    "t": "Facial expression: 0200 grimacing; 0300 grimacing.",
    "ans": 1,
    "why": "Persistent grimacing is unchanged and suggests pain is not fully controlled. It needs further assessment."
   },
   {
    "t": "Body language: 0200 rigid with fists clenched; 0300 relaxed hands and limbs.",
    "ans": 0,
    "why": "Rigid posture and clenched fists are high-scoring pain behaviors. A relaxed body is improvement."
   },
   {
    "t": "Consolability: 0200 could not be consoled; 0300 calms with touch and voice.",
    "ans": 0,
    "why": "Being consolable with touch and voice shows distress has eased. This is improvement."
   },
   {
    "t": "Sacral skin: 0200 blanchable redness; 0300 redness that does not blanch.",
    "ans": 2,
    "why": "Redness that no longer blanches is a stage 1 pressure injury. Skin has worsened and needs pressure relief now."
   }
  ],
  "why": "Behavioral pain scales are the right tool when a client cannot self-report. Most behaviors improved after the opioid and repositioning, but persistent grimacing means pain is not fully relieved. The new nonblanchable redness is a separate problem that needs offloading right away.",
  "tip": "In trend items, compare each finding to its own baseline before deciding what the overall picture means.",
  "cn": "basic"
 },
 {
  "id": "sa-pharm-3",
  "type": "cloze",
  "step": "analyze",
  "sp": "peds",
  "sys": "endocrine",
  "topic": "Insulin with a missed meal",
  "stem": "A 13-year-old with type 1 diabetes is admitted to the pediatric unit for diabetes education. At 0730 her glucose is 142 mg/dL. Her orders are NPH insulin 12 units subcutaneous at breakfast and insulin lispro by carbohydrate count with each meal. Breakfast trays arrive at 0745.",
  "q": "Complete the sentences.",
  "parts": [
   "The nurse should give the lispro ",
   {
    "opts": [
     "within 15 minutes before she starts eating",
     "30 to 60 minutes before the meal",
     "only if her glucose is above 250 mg/dL"
    ],
    "ans": 0,
    "whys": [
     "Yes: rapid-acting insulin starts working in about 15 minutes, so it is given right before the meal and only when the food is there.",
     "No: 30 to 60 minutes before a meal fits regular insulin. Giving lispro that early risks hypoglycemia before food arrives.",
     "No: mealtime insulin covers the carbohydrate she eats, not just high readings. Holding it would cause a post-meal spike."
    ]
   },
   ". The NPH dose places her at the highest risk for hypoglycemia in the ",
   {
    "opts": [
     "mid-afternoon",
     "first 15 minutes after the injection",
     "next morning before breakfast"
    ],
    "ans": 0,
    "whys": [
     "Yes: NPH is intermediate-acting and peaks about 4 to 12 hours after injection, so a morning dose peaks in the afternoon.",
     "No: NPH begins acting in 1 to 2 hours and does not peak right away. Fast onset belongs to rapid-acting insulin.",
     "No: a morning NPH dose has mostly worn off by the next morning. Overnight lows relate to an evening dose."
    ]
   },
   ". If insulin glargine is later prescribed at bedtime, the nurse would expect it to ",
   {
    "opts": [
     "provide steady basal coverage without a pronounced peak",
     "peak about 2 hours after injection",
     "be mixed with lispro in the same syringe"
    ],
    "ans": 0,
    "whys": [
     "Yes: glargine is long-acting and releases at a fairly constant rate over about 24 hours, mimicking basal insulin.",
     "No: a 2-hour peak describes rapid or short-acting insulin, not glargine.",
     "No: glargine should not be mixed with other insulins because mixing changes its absorption."
    ]
   },
   "."
  ],
  "why": "Matching insulin timing to food prevents both highs and lows. Rapid-acting insulin goes in right before eating. Intermediate-acting NPH peaks hours later, so the nurse watches for lows and makes sure snacks and meals are on time. Long-acting glargine provides a flat background level and is not mixed.",
  "tip": "Learn each insulin by onset, peak and duration; the peak tells you when to watch for hypoglycemia.",
  "cn": "pharm"
 },
 {
  "id": "sa-pharm-4",
  "type": "sata",
  "step": "act",
  "sp": "ms",
  "sys": "infection",
  "topic": "Managing vancomycin infusion reaction",
  "stem": "A 54-year-old with cellulitis is receiving the first dose of vancomycin 1.5 g IV. Twenty minutes into the infusion, his face, neck and upper chest are flushed red and itchy. BP 104/68, down from 128/76. HR 98. No wheezing, no lip or tongue swelling, and SpO₂ is 97% on room air.",
  "q": "Which actions should the nurse take? Select all that apply.",
  "opts": [
   {
    "t": "Stop the vancomycin infusion.",
    "ok": true,
    "why": "Yes: this is vancomycin infusion reaction, caused by histamine release when the drug runs in too fast. Stopping the infusion removes the trigger."
   },
   {
    "t": "Notify the provider.",
    "ok": true,
    "why": "Yes: the provider needs to know about the reaction to order an antihistamine and a new infusion rate."
   },
   {
    "t": "Give diphenhydramine as prescribed.",
    "ok": true,
    "why": "Yes: an antihistamine relieves the flushing and itching caused by histamine release."
   },
   {
    "t": "Recheck the blood pressure and monitor breathing every few minutes until stable.",
    "ok": true,
    "why": "Yes: the reaction can lower the blood pressure. Close monitoring also catches any sign that this is actually anaphylaxis."
   },
   {
    "t": "Expect to restart the infusion at a slower rate if the prescriber orders it.",
    "ok": true,
    "why": "Yes: once symptoms settle, vancomycin is usually continued over a longer time, at least 60 minutes and often 2 hours."
   },
   {
    "t": "Give epinephrine 0.3 mg IM now.",
    "ok": false,
    "why": "No: there is no airway swelling, wheezing or severe hypotension. Epinephrine is for anaphylaxis; mistaking this rate-related reaction for anaphylaxis is the trap."
   },
   {
    "t": "Increase the rate to finish the dose before the reaction gets worse.",
    "ok": false,
    "why": "No: the reaction is caused by a fast infusion rate. Speeding up makes it worse."
   },
   {
    "t": "Document a permanent vancomycin allergy on the chart.",
    "ok": false,
    "why": "No: this is a rate-related reaction, not a true allergy. Labeling it as an allergy can remove a needed antibiotic from future use."
   }
  ],
  "why": "Flushing and itching of the upper body during a vancomycin infusion point to an infusion reaction from histamine release, not an allergy. Stop the infusion, give an antihistamine, and monitor the blood pressure. The drug is usually continued at a slower rate.",
  "tip": "Look for airway findings before choosing epinephrine; without them, think infusion rate.",
  "cn": "pharm"
 },
 {
  "id": "sa-pharm-6",
  "type": "bowtie",
  "step": "act",
  "sp": "icu",
  "sys": "respiratory",
  "topic": "Venous air embolism",
  "stem": "The nurse is changing the IV tubing on a 58-year-old's right internal jugular central venous catheter. The client suddenly sits up and coughs while the catheter hub is open. Within seconds he is short of breath and reports chest pain. HR 128, BP 86/50, RR 32, SpO₂ 84%. He is anxious and confused.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take first, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Air embolism",
    "Catheter-related bloodstream infection",
    "Fluid volume overload",
    "Catheter occlusion"
   ],
   "ans": 0
  },
  "actions": {
   "opts": [
    "Clamp the catheter immediately",
    "Place the client on the left side with the head lower than the feet",
    "Flush the catheter with 10 mL normal saline",
    "Raise the head of the bed to high Fowler's",
    "Remove the catheter and hold pressure"
   ],
   "ans": [
    0,
    1
   ]
  },
  "params": {
   "opts": [
    "Oxygen saturation and respiratory effort",
    "Blood pressure and heart rate",
    "Temperature",
    "Blood glucose",
    "Serum magnesium"
   ],
   "ans": [
    0,
    1
   ]
  },
  "whys": {
   "cond": [
    "Yes: an open central line during a cough or deep breath can draw air into the vein. Sudden dyspnea, chest pain, hypotension and hypoxia follow within seconds.",
    "No: line infection develops over days with fever and chills, not within seconds of opening the hub.",
    "No: overload builds gradually with crackles and edema. Nothing here was infused rapidly.",
    "No: occlusion stops the line from flushing or infusing. It does not cause sudden cardiopulmonary collapse."
   ],
   "actions": [
    "Yes: clamping stops more air from entering. It is the first action.",
    "Yes: left side lying with the head down is the standard teaching to trap air in the right atrium and away from the pulmonary artery.",
    "No: flushing the line could push more air into the circulation. The line should be clamped.",
    "No: sitting upright lets air travel to the brain and lungs more easily. It is the opposite of the needed position.",
    "No: removing the catheter can let more air in through the open tract. It is not a first action."
   ],
   "params": [
    "Yes: air blocking pulmonary blood flow causes hypoxemia, so oxygenation and work of breathing show whether the client is stabilizing.",
    "Yes: air lock in the heart drops cardiac output. Blood pressure and heart rate reflect perfusion.",
    "No: temperature reflects infection, which is not the issue in the first minutes.",
    "No: glucose is unrelated to this emergency.",
    "No: magnesium is not affected by air embolism and does not guide treatment."
   ]
  },
  "why": "Air can enter a central vein whenever the system is open and intrathoracic pressure drops, as with a cough or deep breath. Clamp the line, position the client on the left side with the head down, and give oxygen. Prevention is clamping and having the client hold the breath or perform a Valsalva maneuver during tubing changes.",
  "tip": "For sudden collapse during central line care, think air first, then stop the entry and position to trap the air.",
  "cn": "pharm"
 },
 {
  "id": "sa-risk-1",
  "type": "matrix",
  "step": "eval",
  "sp": "ms",
  "sys": "gi",
  "topic": "Post-paracentesis hypotension",
  "trend": true,
  "stem": "A 57-year-old with cirrhosis and tense ascites had a paracentesis that removed 5.5 L of fluid. Before the procedure: HR 86, BP 124/72, RR 26, SpO₂ 92% on room air, abdominal girth 112 cm. One hour after: HR 116, BP 92/54, RR 18, SpO₂ 96% on room air, abdominal girth 101 cm. She says she feels dizzy when she sits up.",
  "q": "For each finding, indicate whether it is an expected response or requires follow-up.",
  "cols": [
   "Expected response",
   "Requires follow-up"
  ],
  "rows": [
   {
    "t": "Respiratory rate from 26 to 18.",
    "ans": 0,
    "why": "Removing ascites lets the diaphragm move down, so breathing slows and eases. This is the goal of the procedure."
   },
   {
    "t": "SpO₂ from 92% to 96%.",
    "ans": 0,
    "why": "Better lung expansion improves oxygenation. This is expected."
   },
   {
    "t": "Abdominal girth from 112 cm to 101 cm.",
    "ans": 0,
    "why": "A smaller girth reflects the fluid removed. This is expected."
   },
   {
    "t": "Heart rate from 86 to 116.",
    "ans": 1,
    "why": "Tachycardia after large-volume removal suggests fluid shifting back into the abdomen and low circulating volume."
   },
   {
    "t": "Blood pressure from 124/72 to 92/54.",
    "ans": 1,
    "why": "Hypotension after removing more than 5 L signals circulatory dysfunction. The nurse reports it and anticipates IV albumin."
   },
   {
    "t": "Dizziness when she sits up.",
    "ans": 1,
    "why": "Orthostatic dizziness is another sign of low volume and a fall risk. Keep her in bed and report it."
   }
  ],
  "why": "Paracentesis should make breathing easier, and here it did. But removing a large volume can drop the circulating volume as fluid shifts back into the abdomen. Rising heart rate, falling blood pressure and dizziness need prompt reporting, and albumin is commonly given after large-volume taps.",
  "tip": "In post-procedure trend items, split the changes into what the procedure was meant to do and what it was not supposed to do.",
  "cn": "risk"
 },
 {
  "id": "sa-risk-2",
  "type": "highlight",
  "step": "cues",
  "sp": "sd",
  "sys": "respiratory",
  "topic": "Post-bronchoscopy monitoring",
  "stem": "A 66-year-old had a flexible bronchoscopy with transbronchial biopsy of the right lower lobe under moderate sedation 2 hours ago. Topical lidocaine was sprayed in the throat. The nurse completes a post-procedure assessment.",
  "q": "Highlight the findings that require follow-up.",
  "parts": [
   {
    "t": "Asks for a cup of water; gag reflex still absent.",
    "ok": true,
    "why": "Yes: without a gag reflex the client can aspirate. Keep NPO and recheck the gag reflex before giving anything by mouth."
   },
   {
    "t": "Sputum with small streaks of blood.",
    "ok": false,
    "why": "No: blood-streaked sputum is expected for a short time after a biopsy. Frank bleeding or clots would need follow-up."
   },
   {
    "t": "Mild sore throat.",
    "ok": false,
    "why": "No: a scratchy throat is expected after the scope passes through the airway. Lozenges help once the gag reflex returns."
   },
   {
    "t": "New high-pitched sound on inspiration.",
    "ok": true,
    "why": "Yes: inspiratory stridor suggests laryngeal edema or spasm, an airway emergency. Notify the provider right away."
   },
   {
    "t": "Sharp right-sided chest pain on inspiration with diminished breath sounds on the right.",
    "ok": true,
    "why": "Yes: pleuritic pain and reduced breath sounds on the biopsy side suggest a pneumothorax. A chest x-ray is needed."
   },
   {
    "t": "SpO₂ 95% on 2 L nasal cannula, unchanged from before the procedure.",
    "ok": false,
    "why": "No: oxygenation is stable at the pre-procedure baseline. This is reassuring."
   }
  ],
  "why": "After bronchoscopy, the risks are aspiration, airway swelling, bleeding and pneumothorax. Blood-tinged sputum and a sore throat are expected. An absent gag reflex, stridor and one-sided chest pain with diminished breath sounds are not.",
  "tip": "After airway procedures, sort findings by expected irritation versus signs of airway, lung or aspiration complications.",
  "cn": "risk"
 },
 {
  "id": "sa-risk-4",
  "type": "sata",
  "step": "act",
  "sp": "icu",
  "sys": "respiratory",
  "topic": "Chest tube disconnection",
  "stem": "A 47-year-old has a right chest tube connected to a water-seal drainage system for a pneumothorax. While the client is being turned, the chest tube separates from the drainage tubing at the connector. The client is awake. RR 24, SpO₂ 93% on 2 L nasal cannula.",
  "q": "Which actions should the nurse take? Select all that apply.",
  "opts": [
   {
    "t": "Place the end of the chest tube 2.5 cm (1 inch) below the surface of a bottle of sterile water.",
    "ok": true,
    "why": "Yes: submerging the end creates a temporary water seal, letting air escape from the chest while preventing air from being drawn in."
   },
   {
    "t": "Assess respiratory rate, effort, breath sounds and SpO₂.",
    "ok": true,
    "why": "Yes: air entering the pleural space can enlarge the pneumothorax. Assessment shows whether the client is getting worse."
   },
   {
    "t": "Notify the provider of the disconnection.",
    "ok": true,
    "why": "Yes: the provider needs to know and may order a chest x-ray to check lung reexpansion."
   },
   {
    "t": "Set up a new sterile drainage system and connect it as soon as possible.",
    "ok": true,
    "why": "Yes: the disconnected tubing end is contaminated, so a new sterile system restores drainage and the seal."
   },
   {
    "t": "Clamp the chest tube until the provider arrives.",
    "ok": false,
    "why": "No: prolonged clamping traps air in the chest and can cause a tension pneumothorax. Clamping is only brief and only per order."
   },
   {
    "t": "Remove the chest tube and cover the site with a gauze dressing.",
    "ok": false,
    "why": "No: the tube is still needed to drain air. Removal is done by the provider, not as a response to disconnection."
   },
   {
    "t": "Strip the chest tube to clear any clots.",
    "ok": false,
    "why": "No: stripping creates very high negative pressure and can damage lung tissue. It does nothing for a disconnection."
   }
  ],
  "why": "A disconnected chest tube lets air enter the pleural space. Submerging the tube end in sterile water restores a one-way seal right away. The nurse then assesses breathing, notifies the provider and reconnects to a new sterile system.",
  "tip": "For chest tube emergencies, pick the action that restores a water seal; avoid prolonged clamping.",
  "cn": "risk"
 },
 {
  "id": "sa-risk-5",
  "type": "cloze",
  "step": "analyze",
  "sp": "ms",
  "sys": "gi",
  "topic": "Metabolic alkalosis from NG suction",
  "trend": true,
  "stem": "A 72-year-old has had a nasogastric tube to low intermittent suction for 3 days for a postoperative ileus. NG output averages 1,200 mL per day. IV fluid is D5 0.45% sodium chloride without potassium. Day 1 labs: K 4.1 mEq/L, Cl 102 mEq/L, HCO₃ 24 mEq/L, pH 7.40, PaCO₂ 40 mm Hg. Day 3 labs: K 3 mEq/L, Cl 92 mEq/L, HCO₃ 33 mEq/L, pH 7.51, PaCO₂ 45 mm Hg.",
  "q": "Complete the sentences.",
  "parts": [
   "The day 3 results show ",
   {
    "opts": [
     "metabolic alkalosis",
     "respiratory alkalosis",
     "metabolic acidosis"
    ],
    "ans": 0,
    "whys": [
     "Yes: pH above 7.45 with a high bicarbonate is metabolic alkalosis. The slightly higher PaCO₂ is the lungs partly compensating.",
     "No: respiratory alkalosis would show a low PaCO₂. Here PaCO₂ is rising, not falling.",
     "No: acidosis would show a pH below 7.35. This pH is 7.51."
    ]
   },
   ", most likely caused by ",
   {
    "opts": [
     "loss of hydrochloric acid through gastric suction",
     "hyperventilation from incisional pain",
     "loss of bicarbonate through the bowel"
    ],
    "ans": 0,
    "whys": [
     "Yes: gastric fluid is rich in hydrochloric acid. Removing it lowers chloride and hydrogen ions, leaving excess bicarbonate.",
     "No: hyperventilation would lower PaCO₂ and cause respiratory alkalosis. The PaCO₂ is up, not down.",
     "No: losing bicarbonate through diarrhea or fistulas causes metabolic acidosis, the opposite of this picture."
    ]
   },
   ". The finding of greatest concern is ",
   {
    "opts": [
     "the potassium of 3 mEq/L, which raises the risk of dysrhythmias",
     "the PaCO₂ of 45 mm Hg, which signals respiratory failure",
     "the chloride of 92 mEq/L, which causes seizures"
    ],
    "ans": 0,
    "whys": [
     "Yes: hypokalemia from gastric losses, alkalosis and potassium-free fluids can cause dangerous dysrhythmias. The nurse reports it and anticipates replacement.",
     "No: a PaCO₂ of 45 is compensation for the alkalosis, not respiratory failure. The trap is reading compensation as a new problem.",
     "No: low chloride drives the alkalosis but does not cause seizures. Potassium is the immediate cardiac danger."
    ]
   },
   "."
  ],
  "why": "Prolonged gastric suction removes acid, chloride and potassium. Over 3 days the bicarbonate climbed and the pH followed, while potassium fell with no replacement in the IV fluid. Hypokalemia is the immediate threat because of its effect on the heart.",
  "tip": "Match the fluid lost to the acid-base result: gastric losses cause alkalosis, lower GI losses cause acidosis.",
  "cn": "risk"
 },
 {
  "id": "sa-risk-6",
  "type": "matrix",
  "step": "solve",
  "sp": "sd",
  "sys": "cardiac",
  "topic": "Pre-catheterization contrast risks",
  "stem": "A 63-year-old with type 2 diabetes is scheduled for a left heart catheterization through the right radial artery at 1000. She takes metformin 1,000 mg twice daily. Her eGFR is 38 mL/min/1.73 m². Two years ago she developed hives after a CT scan with contrast. The nurse prepares her at 0700.",
  "q": "For each action, indicate whether it is indicated or not indicated before the procedure.",
  "cols": [
   "Indicated",
   "Not indicated"
  ],
  "rows": [
   {
    "t": "Withhold the morning metformin dose per the procedure protocol.",
    "ans": 0,
    "why": "Metformin is held around iodinated contrast, especially with reduced kidney function, because of the risk of lactic acidosis."
   },
   {
    "t": "Report the previous contrast reaction to the provider.",
    "ans": 0,
    "why": "A prior contrast reaction is a risk for another. The provider may order premedication with a corticosteroid and an antihistamine."
   },
   {
    "t": "Start the IV 0.9% sodium chloride infusion as prescribed.",
    "ans": 0,
    "why": "IV hydration helps protect the kidneys from contrast injury, which matters with an eGFR of 38."
   },
   {
    "t": "Document baseline pulses, color and sensation in the right hand.",
    "ans": 0,
    "why": "A baseline lets the nurse detect radial artery occlusion or poor circulation after the procedure."
   },
   {
    "t": "Insert the IV catheter in the right forearm.",
    "ans": 1,
    "why": "The right arm is the access site. IV lines belong in the other arm so the access site stays free."
   },
   {
    "t": "Give a full breakfast so her glucose does not drop.",
    "ans": 1,
    "why": "The client is NPO per protocol before the procedure. Glucose is managed with monitoring and IV fluids as ordered, not a full meal."
   }
  ],
  "why": "Preparing for a cardiac catheterization means protecting the kidneys, preventing a contrast reaction, and setting a baseline for the access limb. Metformin is held, hydration is started, prior reactions are reported, and the access arm is left free.",
  "tip": "For contrast procedures, check three things: kidney function, metformin and prior contrast reactions.",
  "cn": "risk"
 },
 {
  "id": "sa-phys-1",
  "type": "bowtie",
  "step": "hypo",
  "sp": "ed",
  "sys": "endocrine",
  "topic": "Hyperosmolar hyperglycemic state",
  "stem": "An 81-year-old with type 2 diabetes is brought from a nursing home with 4 days of increasing thirst and new confusion. HR 118, BP 94/56, mucous membranes dry. Glucose 940 mg/dL, serum osmolality 352 mOsm/kg, pH 7.37, HCO₃ 23 mEq/L, urine ketones negative, K 4.2 mEq/L, BUN 52 mg/dL, creatinine 2.1 mg/dL.",
  "q": "Complete the diagram: the condition the client is most likely experiencing, two actions the nurse should take, and two parameters to monitor.",
  "cond": {
   "opts": [
    "Hyperosmolar hyperglycemic state",
    "Diabetic ketoacidosis",
    "Diabetes insipidus",
    "Hypoglycemia"
   ],
   "ans": 0
  },
  "actions": {
   "opts": [
    "Begin IV 0.9% sodium chloride as prescribed",
    "Start a continuous IV regular insulin infusion as prescribed after fluids are underway",
    "Give insulin glargine subcutaneously now",
    "Give sodium bicarbonate IV",
    "Restrict fluids to prevent cerebral edema"
   ],
   "ans": [
    0,
    1
   ]
  },
  "params": {
   "opts": [
    "Blood glucose",
    "Serum potassium",
    "Hemoglobin A1c",
    "Serum amylase",
    "Serum calcium"
   ],
   "ans": [
    0,
    1
   ]
  },
  "whys": {
   "cond": [
    "Yes: extreme glucose, high osmolality, a normal pH and no ketones in an older adult with type 2 diabetes is HHS.",
    "No: DKA causes a pH under 7.3, a low bicarbonate and ketones. This pH and bicarbonate are normal.",
    "No: diabetes insipidus causes dilute urine and high sodium, but the glucose is normal.",
    "No: the glucose is 940 mg/dL. Confusion here comes from hyperosmolality, not a low glucose."
   ],
   "actions": [
    "Yes: severe dehydration is the main problem in HHS. Isotonic fluid restores volume and lowers glucose by itself.",
    "Yes: an IV regular insulin infusion lowers glucose gradually once fluid replacement has started.",
    "No: subcutaneous long-acting insulin absorbs poorly in a dehydrated client and cannot be titrated.",
    "No: the pH is normal. Bicarbonate is not indicated.",
    "No: this client is profoundly dehydrated. Fluid restriction would worsen shock and kidney injury."
   ],
   "params": [
    "Yes: glucose is checked hourly and lowered gradually to prevent rapid shifts in osmolality.",
    "Yes: insulin moves potassium into cells, so potassium can drop fast and cause dysrhythmias.",
    "No: A1c reflects long-term control and does not guide acute treatment.",
    "No: amylase reflects pancreatic injury and is not part of this picture.",
    "No: calcium is not a key monitoring value in HHS treatment."
   ]
  },
  "why": "HHS develops slowly in older adults with type 2 diabetes who still make enough insulin to prevent ketosis. The result is extreme hyperglycemia, hyperosmolality and severe dehydration. Treatment is aggressive isotonic fluid, then an insulin infusion, with close glucose, potassium and neurologic monitoring.",
  "tip": "To separate DKA from HHS, look at the pH and ketones; a normal pH with no ketones and a sky-high glucose is HHS.",
  "cn": "physio"
 },
 {
  "id": "sa-phys-2",
  "type": "matrix",
  "step": "eval",
  "sp": "ms",
  "sys": "endocrine",
  "topic": "SIADH response to treatment",
  "trend": true,
  "stem": "A 70-year-old with small cell lung cancer has syndrome of inappropriate antidiuretic hormone (SIADH) and is on a 1,000 mL daily fluid restriction. Day 1: Na 121 mEq/L, weight 72.4 kg (159.6 lb), urine output 600 mL per 24 hours, urine specific gravity 1.032, confused to time and place, headache 6/10. Day 3: Na 129 mEq/L, weight 71 kg (156.5 lb), urine output 1,300 mL per 24 hours, urine specific gravity 1.018, oriented to person, place and time, headache 6/10.",
  "q": "For each finding, indicate whether it has improved, is unchanged, or has worsened.",
  "cols": [
   "Improved",
   "Unchanged",
   "Worsened"
  ],
  "rows": [
   {
    "t": "Serum sodium",
    "ans": 0,
    "why": "Sodium rose from 121 to 129 at a gradual rate. As excess water is lost, the sodium concentration rises."
   },
   {
    "t": "Weight",
    "ans": 0,
    "why": "In SIADH, weight gain reflects retained water. A 1.4 kg loss shows the extra water is leaving."
   },
   {
    "t": "Urine output",
    "ans": 0,
    "why": "More urine means the kidneys are excreting the retained water. This is the expected response to fluid restriction."
   },
   {
    "t": "Urine specific gravity",
    "ans": 0,
    "why": "Very concentrated urine is a hallmark of SIADH. A lower specific gravity shows the urine is becoming less concentrated."
   },
   {
    "t": "Mental status",
    "ans": 0,
    "why": "Confusion from hyponatremia improves as sodium rises. Full orientation is improvement."
   },
   {
    "t": "Headache",
    "ans": 1,
    "why": "The headache rating is unchanged. It still needs assessment, since hyponatremia and brain metastases can both cause headache."
   }
  ],
  "why": "SIADH causes the body to hold water, diluting the sodium. Fluid restriction lets the extra water leave. Rising sodium, falling weight, more dilute urine and clearer thinking show the treatment is working. The persistent headache needs its own follow-up.",
  "tip": "In SIADH, think water, not salt: the client is holding too much water, so improvement looks like weight loss and rising sodium.",
  "cn": "physio"
 },
 {
  "id": "sa-phys-3",
  "type": "highlight",
  "step": "cues",
  "sp": "ed",
  "sys": "endocrine",
  "topic": "Adrenal crisis cues",
  "stem": "A 45-year-old with rheumatoid arthritis has taken prednisone 20 mg daily for a year. She comes to the emergency department with 2 days of vomiting, abdominal pain and weakness. The nurse reviews the triage note.",
  "q": "Highlight the findings that require follow-up.",
  "parts": [
   {
    "t": "Stopped prednisone 4 days ago when the prescription ran out.",
    "ok": true,
    "why": "Yes: stopping long-term steroids suddenly leaves the suppressed adrenal glands unable to respond to stress, causing adrenal crisis."
   },
   {
    "t": "BP 78/46, HR 124.",
    "ok": true,
    "why": "Yes: hypotension with tachycardia signals shock. Adrenal crisis causes vasodilation and volume loss."
   },
   {
    "t": "Fingerstick glucose 52 mg/dL.",
    "ok": true,
    "why": "Yes: cortisol supports glucose levels. Its absence causes hypoglycemia, which needs prompt treatment."
   },
   {
    "t": "Na 128 mEq/L, K 4.8 mEq/L.",
    "ok": true,
    "why": "Yes: Low sodium fits adrenal insufficiency and needs correction with IV saline and hydrocortisone. Potassium usually stays normal after steroid withdrawal because aldosterone is still made."
   },
   {
    "t": "Morning stiffness in both hands.",
    "ok": false,
    "why": "No: morning stiffness is part of her known rheumatoid arthritis. It is not new."
   },
   {
    "t": "Round face and thin skin on her forearms.",
    "ok": false,
    "why": "No: these are expected effects of long-term steroid use. They reflect past therapy, not the current emergency."
   },
   {
    "t": "Temperature 37.2 °C (99 °F).",
    "ok": false,
    "why": "No: this temperature is within normal limits and does not need follow-up."
   }
  ],
  "why": "Long-term steroid use suppresses the adrenal glands. Stopping suddenly causes adrenal crisis: shock, hypoglycemia and hyponatremia. Hyperkalemia is typical of primary adrenal insufficiency (Addison disease), not steroid withdrawal. The nurse anticipates IV hydrocortisone, IV fluids and glucose.",
  "tip": "When a client on long-term steroids presents in shock, ask when the last dose was taken.",
  "cn": "physio"
 },
 {
  "id": "sa-phys-4",
  "type": "cloze",
  "step": "analyze",
  "sp": "ms",
  "sys": "renal",
  "topic": "Metabolic acidosis from diarrhea",
  "stem": "A 48-year-old is admitted after 4 days of profuse watery diarrhea. Breathing is deep and rapid at 28 per minute. Arterial blood gas: pH 7.29, PaCO₂ 30 mm Hg, HCO₃ 14 mEq/L.",
  "q": "Complete the sentences.",
  "parts": [
   "The blood gas shows ",
   {
    "opts": [
     "metabolic acidosis",
     "respiratory acidosis",
     "metabolic alkalosis"
    ],
    "ans": 0,
    "whys": [
     "Yes: pH under 7.35 with a low bicarbonate points to a metabolic cause of acidosis.",
     "No: respiratory acidosis has a high PaCO₂. Here PaCO₂ is low.",
     "No: alkalosis has a pH above 7.45. This pH is 7.29."
    ]
   },
   " that is ",
   {
    "opts": [
     "partially compensated",
     "uncompensated",
     "fully compensated"
    ],
    "ans": 0,
    "whys": [
     "Yes: the low PaCO₂ shows the lungs are blowing off CO₂ to compensate, but the pH is still abnormal.",
     "No: uncompensated would show a normal PaCO₂. The PaCO₂ is already low.",
     "No: full compensation brings the pH back into the normal range. The pH is still 7.29."
    ]
   },
   ". The most likely cause is ",
   {
    "opts": [
     "loss of bicarbonate in the stool",
     "loss of acid in the stool",
     "retention of carbon dioxide"
    ],
    "ans": 0,
    "whys": [
     "Yes: intestinal fluid is rich in bicarbonate. Profuse diarrhea removes base and leaves acid behind.",
     "No: losing acid would cause alkalosis. Acid loss happens with vomiting or gastric suction.",
     "No: CO₂ is being blown off, not retained. CO₂ retention causes respiratory acidosis."
    ]
   },
   "."
  ],
  "why": "Profuse diarrhea removes bicarbonate, causing metabolic acidosis. The lungs respond with deep, rapid breathing to blow off CO₂, which partly corrects the pH. Treatment is replacing fluid and electrolytes and addressing the cause.",
  "tip": "Read the pH first, then match the abnormal value moving in the same direction to name the cause, then check the other value for compensation.",
  "cn": "physio"
 },
 {
  "id": "sa-phys-5",
  "type": "sata",
  "step": "solve",
  "sp": "ed",
  "sys": "neuro",
  "topic": "Neurogenic shock",
  "stem": "A 24-year-old is in the emergency department after a motorcycle crash with a complete spinal cord injury at T2. HR 46, BP 78/40. Skin is warm, dry and flushed below the level of injury. Hemoglobin 14.1 g/dL. A focused abdominal ultrasound shows no internal bleeding.",
  "q": "Which interventions should the nurse anticipate? Select all that apply.",
  "opts": [
   {
    "t": "IV isotonic crystalloid fluids",
    "ok": true,
    "why": "Yes: loss of sympathetic tone dilates the vessels. Fluids help fill the expanded vascular space."
   },
   {
    "t": "A vasopressor such as norepinephrine",
    "ok": true,
    "why": "Yes: fluids alone often cannot restore tone in neurogenic shock. A vasopressor constricts vessels and raises the blood pressure."
   },
   {
    "t": "IV atropine for symptomatic bradycardia",
    "ok": true,
    "why": "Yes: unopposed vagal tone slows the heart. Atropine blocks vagal effects and raises the heart rate."
   },
   {
    "t": "Maintaining spinal alignment and log-rolling for turns",
    "ok": true,
    "why": "Yes: the spine must stay stable to prevent further cord injury."
   },
   {
    "t": "Activating the massive transfusion protocol",
    "ok": false,
    "why": "No: the hemoglobin is normal and the scan shows no bleeding. This is neurogenic, not hemorrhagic, shock."
   },
   {
    "t": "Applying a cooling blanket because the skin is warm",
    "ok": false,
    "why": "No: the skin is warm from vasodilation, not fever. These clients lose heat easily and need protection from hypothermia."
   },
   {
    "t": "Raising the head of the bed to high Fowler's",
    "ok": false,
    "why": "No: sitting up drops the blood pressure further in neurogenic shock and can disturb an unstable spine."
   }
  ],
  "why": "A cord injury at T6 or above can cut off sympathetic outflow. The result is neurogenic shock: hypotension, bradycardia, and warm, dry skin. Treatment is fluids, vasopressors and atropine, while protecting the spine and preventing heat loss.",
  "tip": "Shock with a slow heart rate and warm skin after a high spinal injury is neurogenic, not hypovolemic.",
  "cn": "physio"
 },
 {
  "id": "sa-phys-6",
  "type": "sata",
  "step": "solve",
  "sp": "sd",
  "sys": "endocrine",
  "topic": "Hypocalcemia after thyroidectomy",
  "trend": true,
  "stem": "A 52-year-old is on post-op day 1 after a total thyroidectomy. At 2200 her calcium was 8.9 mg/dL and QTc 440 ms. At 0600 her calcium is 7.1 mg/dL and QTc 492 ms. She reports tingling around her mouth and in her fingertips, and tapping over the facial nerve causes twitching of her upper lip.",
  "q": "Which interventions should the nurse anticipate? Select all that apply.",
  "opts": [
   {
    "t": "IV calcium gluconate as prescribed",
    "ok": true,
    "why": "Yes: symptomatic hypocalcemia with tetany signs and a lengthening QTc is treated with IV calcium."
   },
   {
    "t": "Continuous cardiac monitoring",
    "ok": true,
    "why": "Yes: low calcium prolongs the QT interval, which can lead to dangerous dysrhythmias."
   },
   {
    "t": "Seizure precautions",
    "ok": true,
    "why": "Yes: severe hypocalcemia increases nerve excitability and can cause seizures."
   },
   {
    "t": "Emergency tracheostomy equipment at the bedside",
    "ok": true,
    "why": "Yes: hypocalcemia can cause laryngospasm, and neck swelling after thyroidectomy can block the airway."
   },
   {
    "t": "Coaching her to take deep, rapid breaths to relieve the tingling",
    "ok": false,
    "why": "No: hyperventilation causes alkalosis, which lowers ionized calcium and worsens tetany."
   },
   {
    "t": "IV levothyroxine given now",
    "ok": false,
    "why": "No: thyroid hormone does not correct calcium. The problem is parathyroid injury, not thyroid replacement."
   },
   {
    "t": "IV potassium chloride by rapid push",
    "ok": false,
    "why": "No: potassium is never given by IV push, and potassium is not the problem here."
   }
  ],
  "why": "The parathyroid glands sit next to the thyroid and can be injured or removed in surgery, causing calcium to fall within 24 to 48 hours. Tingling, a positive Chvostek sign and a lengthening QTc show symptomatic hypocalcemia. IV calcium, monitoring and airway readiness are the priorities.",
  "tip": "After neck surgery, connect any new tingling or twitching to the parathyroid glands and check the calcium trend.",
  "cn": "physio"
 },
 {
  "id": "calc-1",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Gabapentin capsules per dose",
  "stem": "A 64-year-old client with postherpetic neuralgia has an order for gabapentin 600 mg PO three times daily. The pharmacy supplies gabapentin 300 mg capsules.",
  "q": "How many capsules should the nurse give for each dose?",
  "ans": 2,
  "tol": 0,
  "unit": "capsules",
  "round": "Round to the nearest whole number.",
  "work": [
   "Formula: desired / have x quantity.",
   "600 mg / 300 mg x 1 capsule",
   "= 2",
   "Answer: 2 capsules"
  ],
  "why": "Capsules cannot be split, so the answer must be a whole number; a fractional result means a math error or a dose that needs clarification. Gabapentin causes dizziness and sedation, so assess fall risk in an older client.",
  "tip": "If a capsule calculation gives a fraction, stop and recheck before you look for a way to divide it.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-2",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Levothyroxine mg to mcg tablets",
  "stem": "A 58-year-old client with hypothyroidism has an order for levothyroxine 0.15 mg PO daily before breakfast. On hand: levothyroxine 75 mcg tablets.",
  "q": "How many tablets should the nurse give?",
  "ans": 2,
  "tol": 0,
  "unit": "tablets",
  "round": "Round to the nearest whole number.",
  "work": [
   "Convert: 0.15 mg x 1,000 mcg/mg = 150 mcg.",
   "Desired / have: 150 mcg / 75 mcg x 1 tablet",
   "= 2",
   "Answer: 2 tablets"
  ],
  "why": "The order and the label use different units, so convert before you divide. Levothyroxine is given on an empty stomach, 30 to 60 minutes before breakfast, and separate from calcium or iron, which block absorption.",
  "tip": "Convert to the unit on the label first; mg to mcg means move the decimal three places to the right.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-3",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Digoxin half tablet",
  "stem": "A 79-year-old client with heart failure and atrial fibrillation has an order for digoxin 0.125 mg PO daily. On hand: digoxin 250 mcg scored tablets. Apical pulse is 74, counted for 1 full minute.",
  "q": "How many tablets should the nurse give?",
  "ans": 0.5,
  "tol": 0,
  "unit": "tablets",
  "round": "Round to the nearest tenth.",
  "work": [
   "Convert: 0.125 mg x 1,000 = 125 mcg.",
   "Desired / have: 125 mcg / 250 mcg x 1 tablet",
   "= 0.5",
   "Answer: 0.5 tablet"
  ],
  "why": "Only a scored tablet may be split, and half a tablet is the most a nurse should split. Before any digoxin dose, count an apical pulse for 1 full minute and hold for a rate under 60 in an adult; check the potassium, since low potassium raises the risk of toxicity.",
  "tip": "Sanity check: if the dose is smaller than the tablet strength, the answer must be less than 1.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-4",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Amoxicillin oral suspension volume",
  "stem": "A 72-year-old client with dysphagia after a stroke has an order for amoxicillin 500 mg PO every 12 hours. The pharmacy sends amoxicillin oral suspension 400 mg/5 mL.",
  "q": "How many mL should the nurse give?",
  "ans": 6.3,
  "tol": 0,
  "unit": "mL",
  "round": "Round to the nearest tenth.",
  "work": [
   "Formula: desired / have x volume.",
   "500 mg / 400 mg x 5 mL",
   "= 6.25 mL",
   "Answer: 6.3 mL"
  ],
  "why": "Oral liquids are measured in an oral syringe, never a household spoon, so the volume must be exact. A client with dysphagia also needs the consistency the speech therapist ordered and an upright position to prevent aspiration.",
  "tip": "Write the concentration as a fraction (400 mg per 5 mL) and let the mg cancel; only mL should remain.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-5",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Subcutaneous heparin volume",
  "stem": "A 46-year-old client with a BMI of 44 is on post-op day 1 after a hernia repair. The order reads heparin 7,500 units subcutaneous every 8 hours. On hand: heparin 10,000 units/mL vial.",
  "q": "How many mL should the nurse draw up?",
  "ans": 0.75,
  "tol": 0,
  "unit": "mL",
  "round": "Round to the nearest hundredth.",
  "work": [
   "Formula: desired / have x volume.",
   "7,500 units / 10,000 units x 1 mL",
   "= 0.75 mL",
   "Answer: 0.75 mL"
  ],
  "why": "Heparin is a high-alert medication, and heparin vials come in several concentrations that look alike. Read the concentration on the label against the order, use a 1 mL syringe for a volume under 1 mL, and follow the facility policy for an independent double check.",
  "tip": "Volumes under 1 mL go to the hundredth and into a 1 mL syringe; always keep the leading zero (0.75 mL).",
  "sys": "pharm calc"
 },
 {
  "id": "calc-6",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Enoxaparin weight-based dose",
  "stem": "A 61-year-old client with a new deep vein thrombosis weighs 176 lb. The order reads enoxaparin 1 mg/kg subcutaneous every 12 hours. On hand: enoxaparin 100 mg/mL prefilled syringe (1 mL). Creatinine clearance is 78 mL/min.",
  "q": "How many mL should the nurse give?",
  "ans": 0.8,
  "tol": 0,
  "unit": "mL",
  "round": "Round to the nearest hundredth.",
  "work": [
   "Weight: 176 lb / 2.2 = 80 kg.",
   "Dose: 1 mg/kg x 80 kg = 80 mg.",
   "Volume: 80 mg / 100 mg x 1 mL = 0.8 mL.",
   "Answer: 0.8 mL (expel the extra 0.2 mL before injecting)"
  ],
  "why": "Weight-based enoxaparin needs an accurate current weight, and the dose is reduced when creatinine clearance falls under 30 mL/min, so check renal function first. Expel the excess from the prefilled syringe, leave the air bubble in, and inject into the abdomen without rubbing.",
  "tip": "For weight-based doses, find the kg first, then the mg, then the mL: three short steps beat one long one.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-7",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ed",
  "topic": "Reconstituted ceftriaxone IM",
  "stem": "A 24-year-old client needs ceftriaxone 500 mg IM once. The vial contains ceftriaxone 1 g powder. The label reads: for IM use, add 2.1 mL of 1% lidocaine to yield 350 mg/mL.",
  "q": "After reconstitution, how many mL should the nurse give?",
  "ans": 1.4,
  "tol": 0,
  "unit": "mL",
  "round": "Round to the nearest tenth.",
  "work": [
   "Reconstituted concentration: 350 mg/mL (from the label).",
   "Desired / have: 500 mg / 350 mg x 1 mL",
   "= 1.43 mL",
   "Answer: 1.4 mL"
  ],
  "why": "After reconstitution, use the final concentration printed on the label, not the powder amount divided by the diluent volume, because the powder adds volume. Confirm there is no lidocaine allergy, and label any remaining solution with the date, time, concentration, and your initials, or discard it per policy.",
  "tip": "In reconstitution problems, the label concentration after mixing is the only \"have\" that matters.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-8",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Pump rate over 8 hours",
  "stem": "A 70-year-old client with dehydration has an order for 0.9% sodium chloride 1,000 mL IV over 8 hours by infusion pump.",
  "q": "At what rate should the nurse set the pump?",
  "ans": 125,
  "tol": 0,
  "unit": "mL/h",
  "round": "Round to the nearest whole number.",
  "work": [
   "Formula: total volume / time in hours.",
   "1,000 mL / 8 h",
   "= 125 mL/h",
   "Answer: 125 mL/h"
  ],
  "why": "Infusion pumps are programmed in mL/h, so the time must be in hours. In an older client, watch for fluid overload during rehydration: crackles, rising respiratory rate, distended neck veins, and a drop in oxygen saturation.",
  "tip": "Pump rate is simply mL divided by hours; convert minutes to hours before you divide.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-9",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Pump rate over 12 hours",
  "stem": "A 35-year-old client with acute pancreatitis has an order for lactated Ringer's 1,000 mL IV over 12 hours by infusion pump.",
  "q": "At what rate should the nurse set the pump?",
  "ans": 83.3,
  "tol": 0,
  "unit": "mL/h",
  "round": "Round to the nearest tenth.",
  "work": [
   "Formula: total volume / time in hours.",
   "1,000 mL / 12 h",
   "= 83.33 mL/h",
   "Answer: 83.3 mL/h"
  ],
  "why": "Many pumps accept tenths, and the question tells you to round to the tenth, so 83 is marked wrong. Fluid resuscitation is a core treatment in pancreatitis; track urine output and vital signs to judge whether the volume is enough.",
  "tip": "Read the rounding instruction last, after the math, and round only once at the very end.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-11",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Drip rate with a 10 gtt/mL set",
  "stem": "A 47-year-old client has an order for 5% dextrose in 0.45% sodium chloride 500 mL IV over 4 hours by gravity. The macrodrip tubing delivers 10 gtt/mL.",
  "q": "At how many drops per minute should the nurse set the infusion?",
  "ans": 21,
  "tol": 0,
  "unit": "gtt/min",
  "round": "Round to the nearest whole number.",
  "work": [
   "Formula: (volume x drop factor) / time in minutes.",
   "Time: 4 h x 60 = 240 min.",
   "(500 mL x 10 gtt/mL) / 240 min = 20.83",
   "Answer: 21 gtt/min"
  ],
  "why": "The drop factor is printed on the tubing package and changes the answer, so confirm it before calculating. With 10 gtt/mL tubing, a shortcut is mL/h divided by 6, which is a good way to check your work.",
  "tip": "Shortcut check: mL/h divided by (60 / drop factor) gives gtt/min; for 10 gtt/mL, divide mL/h by 6.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-12",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "IV piggyback drip rate",
  "stem": "A 66-year-old client has an order for cefazolin 2 g in 100 mL 0.9% sodium chloride IV piggyback to infuse over 30 minutes. The secondary gravity tubing has a drop factor of 20 gtt/mL.",
  "q": "At how many drops per minute should the nurse set the infusion?",
  "ans": 67,
  "tol": 0,
  "unit": "gtt/min",
  "round": "Round to the nearest whole number.",
  "work": [
   "Formula: (volume x drop factor) / time in minutes.",
   "(100 mL x 20 gtt/mL) / 30 min",
   "= 66.67",
   "Answer: 67 gtt/min"
  ],
  "why": "When the time is already in minutes, there is no conversion step, which is where many test takers make an extra error. Before hanging a cephalosporin, confirm allergies, including the type of any penicillin reaction, and stay alert for signs of anaphylaxis during the first minutes of the infusion.",
  "tip": "Check the time unit first: minutes go straight into the formula, hours get multiplied by 60.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-13",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "peds",
  "topic": "Microdrip rate for a child",
  "stem": "A 6-year-old client has an order for IV fluid at 75 mL/h. The pump has failed, and the nurse sets up microdrip tubing with a drop factor of 60 gtt/mL while a replacement pump is obtained.",
  "q": "At how many drops per minute should the nurse set the infusion?",
  "ans": 75,
  "tol": 0,
  "unit": "gtt/min",
  "round": "Round to the nearest whole number.",
  "work": [
   "Formula: (mL/h x drop factor) / 60 min.",
   "(75 mL x 60 gtt/mL) / 60 min",
   "= 75",
   "Answer: 75 gtt/min"
  ],
  "why": "With microdrip tubing, the drop factor of 60 cancels the 60 minutes, so gtt/min equals mL/h. Children are at higher risk of fluid overload, which is why microdrip tubing and a pump are preferred, and the gravity line needs close monitoring until a pump is back.",
  "tip": "With a 60 gtt/mL drop factor, the gtt/min equals the mL/h; use it as a quick check.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-14",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Infusion time remaining",
  "stem": "At 1430, the nurse finds 750 mL remaining in a client's IV bag of 0.9% sodium chloride infusing at 100 mL/h by pump.",
  "q": "How many hours will the remaining fluid take to infuse?",
  "ans": 7.5,
  "tol": 0,
  "unit": "hours",
  "round": "Round to the nearest tenth.",
  "work": [
   "Formula: volume remaining / rate.",
   "750 mL / 100 mL/h",
   "= 7.5 h (7 hours 30 minutes)",
   "Answer: 7.5 hours; the bag will finish at 2200"
  ],
  "why": "Knowing when a bag will run dry lets the nurse hang the next bag on time and avoid an occluded line or a gap in therapy. To get a clock time, convert the decimal: 0.5 h is 30 minutes, not 50.",
  "tip": "Convert decimal hours to minutes by multiplying the decimal by 60 before adding to the clock.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-15",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Gentamicin mg/kg dose",
  "stem": "A 69-year-old client with gram-negative sepsis weighs 172 lb. The order reads gentamicin 5 mg/kg IV once daily.",
  "q": "How many mg should the client receive?",
  "ans": 391,
  "tol": 0,
  "unit": "mg",
  "round": "Round to the nearest whole number.",
  "work": [
   "Weight: 172 lb / 2.2 = 78.18 kg (keep the full value until the last step).",
   "Dose: 5 mg/kg x 78.18 kg = 390.9 mg, rounded to 391 mg",
   "= 391 mg",
   "Answer: 391 mg"
  ],
  "why": "Aminoglycosides are dosed by weight and are toxic to the kidneys and the eighth cranial nerve. Before giving the dose, check creatinine and the ordered drug level, and ask about ringing in the ears or hearing loss.",
  "tip": "When the question tells you to round the weight, round it first, then calculate with that rounded weight.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-16",
  "type": "num",
  "step": "solve",
  "cn": "pharm",
  "sp": "peds",
  "topic": "Pediatric maximum daily dose",
  "stem": "A 3-year-old client with acute otitis media weighs 33 lb. The provider orders amoxicillin 875 mg PO every 12 hours. The pediatric reference lists high-dose amoxicillin as 80 to 90 mg/kg/day divided every 12 hours.",
  "q": "What is the maximum safe daily dose for this child in mg?",
  "ans": 1350,
  "tol": 0,
  "unit": "mg/day",
  "round": "Round to the nearest whole number.",
  "work": [
   "Weight: 33 lb / 2.2 = 15 kg.",
   "Maximum: 90 mg/kg/day x 15 kg = 1,350 mg/day.",
   "Ordered: 875 mg x 2 doses = 1,750 mg/day.",
   "Answer: 1,350 mg/day; the order exceeds the maximum, so hold and clarify"
  ],
  "why": "Children have narrow safety margins and doses are written per kg, so the nurse checks every pediatric order against the safe range before giving it. Here the daily total is above the maximum, so the nurse holds the dose and contacts the prescriber rather than giving it or adjusting it on their own.",
  "tip": "Compare like with like: convert the order to a daily total before checking it against a mg/kg/day range.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-17",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "peds",
  "topic": "Pediatric acetaminophen suspension volume",
  "stem": "A 2-year-old client with a fever of 38.9 °C (102 °F) weighs 22 lb. The order reads acetaminophen 15 mg/kg PO every 6 hours as needed for fever. On hand: acetaminophen oral suspension 160 mg/5 mL.",
  "q": "How many mL should the nurse give?",
  "ans": 4.7,
  "tol": 0,
  "unit": "mL",
  "round": "Round to the nearest tenth.",
  "work": [
   "Weight: 22 lb / 2.2 = 10 kg.",
   "Dose: 15 mg/kg x 10 kg = 150 mg.",
   "Volume: 150 mg / 160 mg x 5 mL = 4.69 mL.",
   "Answer: 4.7 mL"
  ],
  "why": "Acetaminophen overdose causes liver injury, and children are often given it from more than one product at home. Calculate from the current weight, use the oral syringe that matches the concentration, and confirm the total daily amount stays within the limit.",
  "tip": "Carry full decimals through the steps and round only the final mL, or a small early rounding error can change the answer.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-18",
  "type": "num",
  "step": "solve",
  "cn": "pharm",
  "sp": "peds",
  "topic": "Pediatric ibuprofen maximum dose",
  "stem": "A 5-year-old client weighs 41 lb. The provider orders ibuprofen 200 mg PO every 6 hours as needed for pain. The reference dose is ibuprofen 10 mg/kg per dose.",
  "q": "What is the maximum single dose for this child in mg?",
  "ans": 186,
  "tol": 0,
  "unit": "mg",
  "round": "Round to the nearest whole number.",
  "work": [
   "Weight: 41 lb / 2.2 = 18.64 kg (keep the full value until the last step).",
   "Maximum single dose: 10 mg/kg x 18.64 kg = 186.4 mg, rounded to 186 mg.",
   "Compare: ordered 200 mg is more than 186 mg.",
   "Answer: 186 mg; the order exceeds the safe dose, so hold and clarify"
  ],
  "why": "The safe dose check is the nurse's last barrier before a pediatric dosing error reaches the child. An ordered dose above the calculated maximum is not given; the nurse contacts the prescriber and documents the clarification.",
  "tip": "In a safe dose item, finish by comparing the order with your number and decide: give, or hold and clarify.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-19",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "icu",
  "topic": "Dopamine mcg/kg/min to mL/h",
  "stem": "A 67-year-old client in cardiogenic shock weighs 80 kg. The order reads dopamine 5 mcg/kg/min IV. The pharmacy sends dopamine 400 mg in 250 mL 5% dextrose.",
  "q": "At what rate should the nurse set the pump in mL/h?",
  "ans": 15,
  "tol": 0,
  "unit": "mL/h",
  "round": "Round to the nearest tenth.",
  "work": [
   "Concentration: 400 mg / 250 mL = 1.6 mg/mL = 1,600 mcg/mL.",
   "Dose per hour: 5 mcg/kg/min x 80 kg x 60 min = 24,000 mcg/h.",
   "Rate: 24,000 mcg/h / 1,600 mcg/mL = 15 mL/h.",
   "Answer: 15 mL/h"
  ],
  "why": "Vasoactive drips are high-alert medications titrated to blood pressure and perfusion, so an error in rate quickly changes hemodynamics. Run them on a dedicated line through a pump, preferably a central line, and check the site often for extravasation.",
  "tip": "For mcg/kg/min: multiply dose x kg x 60 to get mcg/h, then divide by the concentration in mcg/mL.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-21",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "icu",
  "topic": "Amiodarone mg/min to mL/h",
  "stem": "A 63-year-old client with recurrent ventricular tachycardia finished an amiodarone loading infusion. The order now reads amiodarone 1 mg/min IV for 6 hours. The premixed bag is amiodarone 360 mg in 200 mL.",
  "q": "At what rate should the nurse set the pump in mL/h?",
  "ans": 33.3,
  "tol": 0,
  "unit": "mL/h",
  "round": "Round to the nearest tenth.",
  "work": [
   "Concentration: 360 mg / 200 mL = 1.8 mg/mL.",
   "Dose per hour: 1 mg/min x 60 min = 60 mg/h.",
   "Rate: 60 mg/h / 1.8 mg/mL = 33.33 mL/h.",
   "Answer: 33.3 mL/h"
  ],
  "why": "Amiodarone can cause hypotension and bradycardia during infusion, so continuous cardiac monitoring and frequent blood pressure checks are needed. It is irritating to veins, which is why concentrated infusions are given through a central line when possible.",
  "tip": "For mg/min drips: mg/min x 60 = mg/h, then divide by mg/mL.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-22",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "icu",
  "topic": "Lidocaine mg/min to mL/h",
  "stem": "A 70-year-old client on telemetry has an order for lidocaine 2 mg/min IV continuous infusion. The premixed bag is lidocaine 2 g in 500 mL 5% dextrose.",
  "q": "At what rate should the nurse set the pump in mL/h?",
  "ans": 30,
  "tol": 0,
  "unit": "mL/h",
  "round": "Round to the nearest whole number.",
  "work": [
   "Concentration: 2 g = 2,000 mg; 2,000 mg / 500 mL = 4 mg/mL.",
   "Dose per hour: 2 mg/min x 60 min = 120 mg/h.",
   "Rate: 120 mg/h / 4 mg/mL = 30 mL/h.",
   "Answer: 30 mL/h"
  ],
  "why": "Lidocaine toxicity shows up first in the nervous system: confusion, slurred speech, perioral numbness, and then seizures. Older clients and those with liver impairment clear the drug more slowly, so the nurse assesses neuro status often during the infusion.",
  "tip": "Convert grams to milligrams in the bag before dividing; 2 g is 2,000 mg.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-23",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Heparin bolus volume",
  "stem": "A 54-year-old client with a pulmonary embolism weighs 187 lb. The weight-based heparin protocol orders a bolus of 80 units/kg IV. On hand: heparin 1,000 units/mL vial.",
  "q": "How many mL should the nurse give for the bolus?",
  "ans": 6.8,
  "tol": 0,
  "unit": "mL",
  "round": "Round to the nearest tenth.",
  "work": [
   "Weight: 187 lb / 2.2 = 85 kg.",
   "Bolus: 80 units/kg x 85 kg = 6,800 units.",
   "Volume: 6,800 units / 1,000 units/mL = 6.8 mL.",
   "Answer: 6.8 mL"
  ],
  "why": "Heparin is a high-alert medication, and most facilities require an independent double check by a second nurse of the weight, dose, concentration, and pump settings because errors cause serious bleeding or clotting. Use the weight in kg recorded at admission, not a stated or estimated weight.",
  "tip": "Write units as a word, never \"U\"; a \"U\" can be misread as a zero and turn 6,800 into 68,000.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-26",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "peds",
  "topic": "Holliday-Segar daily maintenance fluid",
  "stem": "A 7-year-old client who is NPO before surgery weighs 23 kg. The provider orders maintenance IV fluids by the Holliday-Segar method: 100 mL/kg for the first 10 kg, 50 mL/kg for the next 10 kg, and 20 mL/kg for each kg over 20.",
  "q": "What is the child's maintenance fluid requirement for 24 hours?",
  "ans": 1560,
  "tol": 0,
  "unit": "mL/day",
  "round": "Round to the nearest whole number.",
  "work": [
   "First 10 kg: 10 x 100 = 1,000 mL.",
   "Next 10 kg: 10 x 50 = 500 mL.",
   "Remaining 3 kg: 3 x 20 = 60 mL.",
   "Total: 1,000 + 500 + 60 = 1,560 mL/day",
   "Answer: 1,560 mL/day"
  ],
  "why": "Maintenance needs are higher per kg in small children because of their higher metabolic rate and body surface area. The nurse checks the ordered rate against this calculation and monitors urine output, at least 1 mL/kg/h in a child, to judge hydration.",
  "tip": "Split the weight into buckets of 10, 10, and the rest; the per-kg amount drops in each bucket.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-27",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "peds",
  "topic": "Hourly maintenance by 4-2-1 rule",
  "stem": "A 2-year-old client with gastroenteritis weighs 14 kg. The order reads maintenance IV fluids by the 4-2-1 rule: 4 mL/kg/h for the first 10 kg, 2 mL/kg/h for the next 10 kg, and 1 mL/kg/h for each kg over 20.",
  "q": "At what rate should the nurse set the pump?",
  "ans": 48,
  "tol": 0,
  "unit": "mL/h",
  "round": "Round to the nearest whole number.",
  "work": [
   "First 10 kg: 10 x 4 = 40 mL/h.",
   "Remaining 4 kg: 4 x 2 = 8 mL/h.",
   "Total: 40 + 8 = 48 mL/h.",
   "Answer: 48 mL/h"
  ],
  "why": "The 4-2-1 rule is the hourly form of the Holliday-Segar method, so it gives a pump rate directly. A toddler with gastroenteritis can lose fluid quickly, so the nurse compares intake and output and weighs the child daily on the same scale.",
  "tip": "Use 4-2-1 when you need mL/h and 100-50-20 when you need mL/day; do not mix the two.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-28",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ed",
  "topic": "Parkland first 8 hours volume",
  "stem": "A 34-year-old client weighing 70 kg has partial-thickness and full-thickness burns over 40% of the total body surface area. The provider orders lactated Ringer's by the Parkland formula: 4 mL x kg x %TBSA over 24 hours, half in the first 8 hours from the time of the burn.",
  "q": "How many mL should the client receive in the first 8 hours?",
  "ans": 5600,
  "tol": 0,
  "unit": "mL",
  "round": "Round to the nearest whole number.",
  "work": [
   "24-hour total: 4 mL x 70 kg x 40 = 11,200 mL.",
   "First 8 hours: 11,200 / 2 = 5,600 mL.",
   "Answer: 5,600 mL"
  ],
  "why": "Burn injury causes a massive capillary leak in the first hours, which is why half the 24-hour volume is given in the first 8 hours. The formula is a starting point; the nurse titrates to urine output of 0.5 mL/kg/h in an adult.",
  "tip": "Use %TBSA as a whole number (40, not 0.4) in the Parkland formula.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-29",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ed",
  "topic": "Parkland rate after delayed start",
  "stem": "A 41-year-old client weighing 80 kg has partial-thickness and full-thickness burns over 30% of the total body surface area. The client arrives 2 hours after the burn and has received no IV fluid. The order reads lactated Ringer's by the Parkland formula (4 mL x kg x %TBSA over 24 hours, half in the first 8 hours from the time of the burn).",
  "q": "At what rate should the nurse set the pump to complete the first half on schedule?",
  "ans": 800,
  "tol": 0,
  "unit": "mL/h",
  "round": "Round to the nearest whole number.",
  "work": [
   "24-hour total: 4 mL x 80 kg x 30 = 9,600 mL.",
   "First half: 9,600 / 2 = 4,800 mL.",
   "Time left in the first 8 hours: 8 - 2 = 6 h.",
   "Rate: 4,800 mL / 6 h = 800 mL/h",
   "Answer: 800 mL/h"
  ],
  "why": "The 8-hour clock starts at the time of the burn, not at arrival, so a delay means the same volume must run over less time. The nurse monitors urine output hourly with an indwelling catheter and watches for signs of over-resuscitation such as crackles and rising airway pressures.",
  "tip": "Subtract the time already elapsed since the injury before dividing; that is the trap in delayed-arrival burn items.",
  "sys": "pharm calc"
 },
 {
  "id": "calc-30",
  "type": "num",
  "step": "act",
  "cn": "pharm",
  "sp": "ms",
  "topic": "Shift intake total",
  "stem": "During a 0700 to 1500 shift, a client drank 6 oz of orange juice and 8 oz of coffee and ate 1 cup (240 mL) of ice chips. An IV infused at 75 mL/h for the full 8 hours, and a 100 mL IV antibiotic piggyback was given. Use 1 oz = 30 mL and count ice chips as half their volume.",
  "q": "What is the client's total intake for the shift in mL?",
  "ans": 1240,
  "tol": 0,
  "unit": "mL",
  "round": "Round to the nearest whole number.",
  "work": [
   "Oral: 6 oz x 30 = 180 mL; 8 oz x 30 = 240 mL; ice chips 240 / 2 = 120 mL.",
   "IV: 75 mL/h x 8 h = 600 mL; piggyback 100 mL.",
   "Total: 180 + 240 + 120 + 600 + 100 = 1,240 mL",
   "Answer: 1,240 mL"
  ],
  "why": "Accurate intake and output reveal fluid imbalance before vital signs change, especially in clients with heart failure or kidney disease. Intake includes every fluid route: oral, IV, piggybacks, tube feedings, and flushes.",
  "tip": "List every source on scratch paper by route, convert each to mL, then add once.",
  "sys": "pharm calc"
 }
];
