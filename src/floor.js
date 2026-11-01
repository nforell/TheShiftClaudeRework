/* The Shift — floor calls. The unit doesn't stop for your four patients: a colleague needs a hand, the lab has a
   critical value, a visitor is at the desk. Each call is a short, real decision with a clock on it. Which calls come,
   and in what order, changes every time you play. */
(function (S) {
  const L = (skin, shade, lip, blush, iris, hair, hcol, cloth, extra) => ({ skin, shade, lip, blush, iris, head: { w: 55, h: 61, jaw: .42 }, eye: 9.8, hair: { style: hair, color: hcol }, brow: { w: 3.6, color: hcol }, body: { w: 81, cloth }, extras: extra || [], smile: .35, tired: true });
  const kindOf = (c) => (/^psych/.test(c.id) ? 'psych' : /^peds/.test(c.id) ? 'peds' : /^ob/.test(c.id) || /^ld/.test(c.id) ? 'ob' : /^ed/.test(c.id) ? 'ed' : /^icu/.test(c.id) ? 'icu' : 'med');
  const RN = { med: 'Bri', psych: 'Noor', peds: 'Hana', ob: 'Lucy', ed: 'Sid', icu: 'Dee' };
  const STAFF = {
    'fl-rn-med': { name: 'Bri', role: 'RN, next pod', look: L('#8A5A3C', '#6E4530', '#6A3A2C', '#A8604A', '#1E130C', 'bun', '#140E0A', 'wine') },
    'fl-rn-psych': { name: 'Noor', role: 'RN, B hall', look: L('#C99A74', '#AA7C58', '#8E5246', '#C8866C', '#2A1B10', 'long', '#1A120C', 'grey') },
    'fl-rn-peds': { name: 'Hana', role: 'RN, next pod', look: L('#E8C0A0', '#CC9E7E', '#AE6258', '#E4927C', '#2A1C12', 'long', '#1A1410', 'teal') },
    'fl-rn-ob': { name: 'Lucy', role: 'RN, next pod', look: L('#B98460', '#9A6846', '#7E4535', '#BE7A5E', '#20140C', 'bun', '#2A1C14', 'rose') },
    'fl-rn-ed': { name: 'Sid', role: 'RN, triage', look: L('#C99A72', '#A97B54', '#8E5246', '#CC8A70', '#2A1A10', 'short', '#201A16', 'navy', ['beard']) },
    'fl-rn-icu': { name: 'Dee', role: 'RN, bed 715', look: L('#E2B48E', '#C49670', '#A0594C', '#DC8E74', '#3A2616', 'ponytail', '#2A1C14', 'teal') },
    'fl-sec': { name: 'Officer Dale', role: 'Security', look: L('#8A5A3C', '#6E4530', '#6A3A2C', '#A8604A', '#1E130C', 'buzz', '#140E0A', 'grey') },
    'fl-pharm': { name: 'Rene', role: 'Pharmacist', look: L('#C08A64', '#A06E4C', '#86483A', '#C27C60', '#20140C', 'short', '#2A2A2A', 'grey', ['glasses']) },
    'fl-clerk': { name: 'Pat', role: 'Unit clerk', look: L('#F2D6BE', '#D8B49A', '#B87068', '#EEA090', '#5A7A9A', 'bob', '#9A9A9A', 'blue', ['glasses']) },
    'fl-tele': { name: 'Kim', role: 'Monitor tech', look: L('#E6C29C', '#C79E76', '#A8625A', '#DE9380', '#241810', 'ponytail', '#121012', 'navy', ['headset']) },
    'fl-lab': { name: 'Lab', role: 'Core laboratory', look: null },
  };
  function staffFor() { const o = {}; Object.keys(STAFF).forEach((k) => { o[k] = STAFF[k]; }); return o; }

  /* v: 2 best, 1 acceptable, 0 wrong, -1 unsafe. */
  const POOL = [
    { id: 'crit', k: ['med', 'psych', 'peds', 'ob', 'ed'], from: 'fl-lab', title: 'Critical value', dom: 'comm', cost: 3, exp: 15, must: true,
      ping: 'Lab, calling with a critical value on {rn}\'s patient. {rn} is scrubbed in for a sterile dressing change.',
      text: 'Potassium 6.4 on the patient in the next pod, drawn 20 minutes ago. The lab tech is waiting on the line.',
      q: 'What do you do?',
      opts: [
        { t: 'Write it down, read back the name, value and time, then call the provider now and tell {rn}', v: 2, fb: 'Read-back closes the loop, and a critical value goes to someone who can act on it now, not when {rn} is free.' },
        { t: 'Take the result and leave {rn} a note', v: 0, fb: 'Once you take it, it\'s yours. A note isn\'t notification, and a potassium of 6.4 can\'t wait for a dressing change.' },
        { t: 'Ask the lab to call back when {rn} is out', v: -1, fb: 'Critical values run on a notification clock. With a potassium of 6.4, that wait is time for an arrhythmia.' },
        { t: 'Take it, read it back, and have {rn} call the provider when she\'s done', v: 1, fb: 'Read-back was right. But whoever takes a critical value owns getting it to a provider promptly. Waiting for {rn} adds delay.' },
      ],
      teach: 'Critical results are read back, then reported to the responsible provider within a set time (a Joint Commission safety goal). Whoever takes the call owns it until a provider has it.',
      miss: { text: 'A critical potassium sat on the line until Nova picked it up.', why: 'Critical values can\'t wait for someone to be free. If you can\'t take it, hand it to someone who can, right away.' } },
    { id: 'privacy', k: ['med', 'psych', 'peds', 'ob', 'ed'], from: 'fl-clerk', title: 'Phone call', dom: 'comm', cost: 2, exp: 20,
      ping: 'A caller at the desk is asking about one of your patients.',
      text: { med: '"I\'m his sister. Is he there? How\'s he doing?" He hasn\'t listed her, and there\'s no privacy code on file.', psych: '"I\'m his sister. Is he on your unit? How\'s he doing?" He hasn\'t listed her, and there\'s no privacy code on file. On a psychiatric unit, even saying someone is a patient needs his consent.', peds: '"I\'m her aunt. Is she there? How\'s she doing?" Her parents haven\'t listed an aunt, and there\'s no privacy code on file.', ob: '"I\'m her cousin. Did she have the baby? Is it a boy or a girl?" She hasn\'t listed a cousin, and there\'s no privacy code on file.', ed: '"I\'m his brother. Did an ambulance bring him in? Is he okay?" He hasn\'t listed a brother, and there\'s no privacy code on file.' },
      q: 'What do you say?',
      opts: [
        { t: 'Don\'t confirm or deny anything. Offer to take a message', v: 2, fb: 'Privacy starts with whether they\'re here at all. A message lets the patient, or the parents, decide.' },
        { t: 'Give a general update. She\'s family', v: 0, fb: 'Family isn\'t automatically authorized. Without permission or a privacy code, you can\'t share anything.' },
        { t: 'Confirm they\'re here, but say you can\'t share details', v: 0, fb: 'Confirming someone is a patient is itself a disclosure, and psych and substance-use units have even stricter rules.' },
        { t: 'Ask her for the date of birth, then give an update', v: 0, fb: 'Knowing a birthday doesn\'t make someone authorized. Identity isn\'t permission.' },
      ],
      teach: 'Share health information only with people the patient (or a minor\'s parent or guardian) has authorized. Many hospitals use a privacy code. When in doubt, take a message.' },
    { id: 'stick', k: ['med', 'psych', 'peds', 'ob', 'ed'], from: 'fl-rn', title: 'Needlestick', dom: 'safety', cost: 3, exp: 20,
      ping: '{rn} just stuck herself with a used needle and wants to know what to do.',
      text: 'It was a used insulin pen needle from her patient. She\'s pressing gauze on her finger. "I\'m fine. I\'ll report it at the end of the shift."',
      q: 'What do you tell her?',
      opts: [
        { t: 'Wash it with soap and water now, report to employee health right away, and let Nova cover her patients', v: 2, fb: 'HIV post-exposure prophylaxis works best within hours. Reporting now also gets the source patient tested.' },
        { t: 'Squeeze it to make it bleed, then clean it with bleach', v: 0, fb: 'Squeezing and harsh chemicals don\'t lower the risk and can damage tissue. Soap and water.' },
        { t: 'Finish the shift and report it tomorrow', v: -1, fb: 'PEP should start as soon as possible, ideally within 2 hours and no later than 72. Waiting uses up the window.' },
        { t: 'Wash it and report it before she leaves today', v: 1, fb: 'Washing is right. Report now, not at the end of the shift: the evaluation and any PEP decision are time-sensitive.' },
      ],
      teach: 'Needlestick: wash with soap and water, report immediately, test the source patient, and get an employee health evaluation. HIV PEP starts as soon as possible, ideally within 2 hours and no later than 72.' },
    { id: 'fire', k: ['med', 'psych', 'peds', 'ob', 'ed'], from: 'fl-clerk', title: 'Smoke', dom: 'safety', cost: 3, exp: 10,
      ping: 'Pat, from the desk: "There\'s smoke coming out of the family lounge!"',
      text: 'A trash can by the microwave is smoldering. A visitor is dozing in the recliner right next to it.',
      q: 'What\'s your first move?',
      opts: [
        { t: 'Get the visitor out of the lounge', v: 2, fb: 'RACE: Rescue first. Anyone in immediate danger comes before anything else.' },
        { t: 'Pull the fire alarm', v: 1, fb: 'Alarm is step two. She\'s right next to the fire: get her out first, or have Pat pull the alarm while you do.' },
        { t: 'Grab the extinguisher and put it out', v: 0, fb: 'Extinguishing comes last, after rescue, alarm and containment.' },
        { t: 'Close the doors to every patient room', v: 0, fb: 'Containment matters, after rescue and the alarm.' },
      ],
      teach: 'RACE: Rescue, Alarm, Contain, Extinguish or evacuate. For an extinguisher, PASS: pull, aim, squeeze, sweep.' },
    { id: 'cosign', k: ['med', 'psych', 'peds', 'ob', 'ed'], from: 'fl-rn', title: 'Co-sign', dom: 'meds', cost: 1, exp: 20,
      ping: '{rn} needs a second-nurse signature on an insulin dose.',
      text: '"I already gave it. Can you co-sign it in the MAR? It was 8 units, I promise. I\'m drowning."',
      q: 'What do you do?',
      opts: [
        { t: 'Decline: you didn\'t see it. Offer to take one of her tasks instead', v: 2, fb: 'A co-signature says you independently checked the dose. Signing afterward makes the record false and the check meaningless.' },
        { t: 'Sign it. She\'s reliable, and it\'s only 8 units', v: -1, fb: 'Insulin is a high-alert drug. Signing a check you didn\'t do falsifies the record, and the check exists because reliable people make errors.' },
        { t: 'Sign it, and tell her to wait for you next time', v: 0, fb: 'Kind, but it\'s still a false record. Help her some other way.' },
      ],
      teach: 'An independent double check means a second nurse verifies the order, drug, dose and syringe or pump before the drug is given. You can\'t verify something after the fact.' },
    { id: 'impaired', k: ['med', 'psych', 'peds', 'ob', 'ed'], from: 'fl-clerk', title: 'A colleague', dom: 'safety', cost: 2, exp: 18,
      ping: 'Pat: "Can you come to the desk? Something\'s off with Craig."',
      text: 'Craig, a nurse just in for a four-hour add-on shift, is slurring his words and smells of alcohol. He\'s about to take two patients.',
      q: 'What do you do?',
      opts: [
        { t: 'Tell Nova now, so Craig is kept away from patients', v: 2, fb: 'Patients first. The charge nurse or supervisor removes him from care and follows policy; most states offer a path to treatment.' },
        { t: 'Talk to him privately after the shift', v: 0, fb: 'Too late: he\'d have patients for four hours. Speak up now.' },
        { t: 'Keep an eye on his patients yourself', v: 0, fb: 'You can\'t watch two extra patients on top of yours. Covering for impairment puts patients at risk.' },
        { t: 'Call the board of nursing yourself, right now', v: 1, fb: 'A report may come later. The first step is getting him away from patients, through the chain of command.' },
      ],
      teach: 'Suspected impairment: remove the person from patient care right away through the charge nurse or supervisor, then follow policy on reporting.' },
    { id: 'label', k: ['med', 'psych', 'peds', 'ob', 'ed'], from: 'fl-rn', title: 'Specimen labels', dom: 'safety', cost: 2, exp: 18,
      ping: '{rn} is labeling two patients\' blood tubes at the station.',
      text: 'She drew two patients back to back. Four unlabeled tubes on the counter, two label printouts. "Just catching up."',
      q: 'What do you do?',
      opts: [
        { t: 'Stop her. If she can\'t be certain which tubes are whose, both get redrawn, labeled at the bedside', v: 2, fb: 'Label at the bedside, in front of the patient, with two identifiers. Unlabeled tubes away from the patient are how wrong-blood-in-tube errors happen.' },
        { t: 'Help her match the tubes to the labels', v: 0, fb: 'Matching from memory is the error. If it isn\'t certain, it\'s a redraw.' },
        { t: 'Let her. The lab catches mismatches', v: -1, fb: 'The lab can\'t catch a correctly labeled tube holding the wrong patient\'s blood. That\'s how transfusion reactions start.' },
      ],
      teach: 'Two identifiers, labeled at the bedside, in front of the patient, before you leave the room.' },
    { id: 'fall', k: ['med', 'psych', 'ed'], from: 'fl-rn', title: 'Patient on the floor', dom: 'safety', cost: 4, exp: 14,
      ping: '{rn}: "My patient is on the floor in the hall. Can you come?"',
      text: 'Mr. Castellanos, 76, on apixaban, is sitting on the hallway floor by his door. He\'s awake and says he slid down. "Just help me up."',
      q: 'What first?',
      opts: [
        { t: 'Stay with him, call for help, and check for injury (head strike, pain, new weakness) before moving him', v: 2, fb: 'Assess before you move. On an anticoagulant, any head strike needs neuro checks and usually a CT.' },
        { t: 'Help him up into a wheelchair', v: 0, fb: 'Moving him before you assess can worsen a hip or spine injury, and one person lifting risks two injuries.' },
        { t: 'Put a pillow under his head and go find the provider', v: 0, fb: 'Don\'t leave him. Call for help and stay.' },
        { t: 'Get the lift, then assess him once he\'s in bed', v: 1, fb: 'The lift is right, but assess for injury first, on the floor.' },
      ],
      teach: 'After a fall: stay, call for help, assess for injury, move with a lift or enough staff, notify the provider, and start neuro checks if a head strike is possible, especially on anticoagulants.' },

    // Medical-surgical
    { id: 'hit', k: ['med'], from: 'fl-pharm', title: 'Platelets', dom: 'meds', cost: 2, exp: 20,
      ping: 'Pharmacy is calling about heparin on a patient you\'re covering.',
      text: 'You\'re covering {rn}\'s patients while she\'s on break. Rene: "Mr. Kessler\'s platelets went from 230 to 88 since Monday. He\'s on day 6 of subcutaneous heparin, and it\'s due now."',
      q: 'What do you do?',
      opts: [
        { t: 'Hold the heparin and call the provider about possible HIT', v: 2, fb: 'A platelet drop of 50% or more, 5 to 10 days into heparin, is the classic pattern of heparin-induced thrombocytopenia. Stop the exposure and get the team involved.' },
        { t: 'Give it. Low platelets are common in hospital patients', v: -1, fb: 'HIT causes clots, not bleeding. More heparin can trigger a thrombosis.' },
        { t: 'Switch him to enoxaparin instead', v: 0, fb: 'Low-molecular-weight heparin cross-reacts with HIT antibodies. Suspected HIT means no heparin products at all; the provider chooses a non-heparin anticoagulant.' },
      ],
      teach: 'HIT: platelets fall by half or more, usually on days 5–10 of heparin. Stop all heparin, including flushes, notify the provider, and expect a non-heparin anticoagulant such as argatroban.' },
    { id: 'afib', k: ['med'], from: 'fl-tele', title: 'Rhythm change', dom: 'assess', cost: 4, exp: 14,
      ping: 'Monitor tech: a rhythm change on {rn}\'s patient in 406. You\'re covering.',
      text: 'New atrial fibrillation, rate in the 140s. Mrs. Adler, 64, is two days after a hip replacement. {rn} is on break.',
      q: 'What do you do?',
      opts: [
        { t: 'Go assess her now (symptoms, full vitals), then call the provider', v: 2, fb: 'Treat the patient, not the monitor. Stable or unstable decides everything that follows.' },
        { t: 'Ask the tech to keep watching and call if it gets worse', v: 0, fb: 'A new rhythm at 140 needs eyes on the patient now.' },
        { t: 'Give her scheduled metoprolol early', v: 0, fb: 'Not before you assess. Rate control depends on her blood pressure and symptoms, and a new rhythm needs the provider.' },
        { t: 'Call a rapid response right away', v: 1, fb: 'Right if she\'s unstable, but you don\'t know that yet. A thirty-second look tells you.' },
      ],
      teach: 'New arrhythmia: assess the patient first (symptoms, BP, perfusion). Unstable means an emergency; stable means the provider, a 12-lead and a plan.' },
    { id: 'blood', k: ['med'], from: 'fl-rn', title: 'Blood check', dom: 'safety', cost: 3, exp: 20,
      ping: '{rn} needs a second nurse at the bedside to check a unit of blood.',
      text: 'At the bedside, the patient\'s ID band is gone. It was cut off to start a new IV. Everything on the unit tag matches the paperwork.',
      q: 'What do you do?',
      opts: [
        { t: 'Stop. Get him re-banded per policy before the check: no band, no blood', v: 2, fb: 'The band links this patient to the blood bank\'s crossmatch. Without it, the check can\'t happen.' },
        { t: 'Ask his name and date of birth: that\'s two identifiers', v: 0, fb: 'Spoken identifiers alone aren\'t enough for blood. The check matches the band to the unit and the paperwork, and confused or sedated patients answer wrong.' },
        { t: 'Tape the old band to the bed rail', v: -1, fb: 'A band on the bed identifies the bed, not the patient.' },
      ],
      teach: 'Blood: two qualified people check at the bedside, matching the patient\'s ID band, the unit tag and the order. ABO mismatch is one of the deadliest preventable errors.' },
    { id: 'thyroid', k: ['med'], from: 'fl-rn', title: 'Tingling lips', dom: 'assess', cost: 4, exp: 15,
      ping: '{rn}\'s post-op patient says her lips are tingling. {rn} is in another room.',
      text: 'Ms. Halvorsen, 51, is 6 hours after a total thyroidectomy. Her lips and fingertips are tingling. You tap in front of her ear and her upper lip twitches.',
      q: 'What do you do?',
      opts: [
        { t: 'Suspect low calcium: vitals, call the surgeon, and have IV calcium gluconate ready', v: 2, fb: 'Chvostek\'s sign after thyroid surgery points to low calcium from parathyroid injury. It can progress to tetany and laryngospasm.' },
        { t: 'Reassure her: it\'s post-op anxiety', v: -1, fb: 'Tingling around the mouth after a thyroidectomy is low calcium until proven otherwise.' },
        { t: 'Check her airway and the incision for swelling', v: 1, fb: 'Worth doing, since a neck hematoma can threaten the airway, but this picture is calcium. Do both, and call.' },
      ],
      teach: 'After thyroidectomy: watch for low calcium (tingling, Chvostek\'s and Trousseau\'s signs, tetany) and neck hematoma. Keep calcium gluconate and a trach tray close.' },
    { id: 'hypo', k: ['med'], from: '@cna', title: 'Low glucose', dom: 'judgment', cost: 3, exp: 15,
      ping: '{cna}: "A fingerstick of 52 on {rn}\'s patient in 406."',
      text: 'Mr. Banerjee, 67, type 2 diabetes. Awake, a little sweaty, sitting up in bed. Lunch trays are 40 minutes out. {rn} is on break.',
      q: 'What do you do?',
      opts: [
        { t: 'Give 15 g of fast sugar (4 oz of juice), recheck in 15 minutes', v: 2, fb: 'The rule of 15. He\'s awake and can swallow, so oral is right. Recheck, and repeat if he\'s still under 70.' },
        { t: 'Wait for his lunch tray', v: -1, fb: 'Forty minutes at 52 can become a glucose of 30. Treat it now.' },
        { t: 'Give D50 IV push', v: 0, fb: 'D50 is for patients who can\'t safely swallow. He can; juice is faster to give and gentler on his veins.' },
        { t: 'Give his mealtime insulin with the juice', v: -1, fb: 'No insulin into a low blood sugar.' },
      ],
      teach: 'Glucose under 70: 15 g of fast carbs if alert and able to swallow, recheck in 15 minutes, repeat as needed, then a snack with protein. Can\'t swallow: IV dextrose or glucagon.' },
    { id: 'kcl', k: ['med'], from: 'fl-rn', title: 'Potassium', dom: 'meds', cost: 2, exp: 18,
      ping: '{rn}, from the doorway: "Can you grab something from the med room for me?"',
      text: '"The doc said give 20 of potassium IV push. It\'s in the med room. Can you draw it up?"',
      q: 'What do you do?',
      opts: [
        { t: 'Don\'t push it. Clarify the order: IV potassium is diluted and runs on a pump', v: 2, fb: 'IV push potassium can stop the heart. Peripheral infusions usually run no faster than 10 mEq an hour.' },
        { t: 'Push it slowly, over 5 minutes', v: -1, fb: 'A slow push is still a push. Potassium never goes IV push.' },
        { t: 'Dilute it in a 10 mL flush, then push', v: -1, fb: 'Still a bolus to the heart.' },
      ],
      teach: 'Potassium chloride is never given IV push. It comes premixed and runs on a pump, typically 10 mEq an hour peripherally, faster only through a central line with monitoring per policy.' },
    { id: 'evisc', k: ['med'], from: 'fl-rn', title: '"Something popped"', dom: 'safety', cost: 4, exp: 10,
      ping: '{rn}: "My patient just yelled that something popped. I\'m stuck in isolation, can you go?"',
      text: 'Mr. Okonkwo, 58, is four days after abdominal surgery. He coughed hard. His dressing is soaked, and you can see bowel through the wound.',
      q: 'What do you do?',
      opts: [
        { t: 'Cover the bowel with sterile saline-soaked dressings, lower the head of the bed, bend his knees, stay and call the surgeon', v: 2, fb: 'Evisceration is a surgical emergency. Moist sterile cover protects the bowel; the position takes tension off the wound.' },
        { t: 'Gently push the bowel back in and tape the dressing', v: -1, fb: 'Never put it back. It risks injury and infection.' },
        { t: 'Cover it with dry gauze and go call the surgeon', v: 0, fb: 'Dry gauze sticks to and dries the bowel, and you shouldn\'t leave him.' },
      ],
      teach: 'Evisceration: stay, call for help, cover with sterile saline-soaked dressings, low Fowler\'s with knees bent, NPO, watch for shock, surgeon now.' },
    { id: 'chest', k: ['med'], from: '@cna', title: 'Chest tightness', dom: 'judgment', cost: 4, exp: 14,
      ping: '{cna}: "{rn}\'s patient in 406 says her chest feels tight."',
      text: 'Mrs. Garza, 71, admitted for cellulitis. Pale, with pressure in the middle of her chest for 10 minutes, going into her jaw. BP 150/88, HR 98, SpO₂ 95%.',
      q: 'What do you do?',
      opts: [
        { t: 'Stay, get a 12-lead ECG now, and call the provider or a rapid response', v: 2, fb: 'Chest pressure spreading to the jaw: an ECG within 10 minutes is the standard. Time is heart muscle.' },
        { t: 'Give her an antacid and recheck in 30 minutes', v: -1, fb: 'Assuming indigestion delays an MI diagnosis. Women often have less typical symptoms.' },
        { t: 'Put her on 4 L of oxygen and wait for the provider', v: 0, fb: 'Her SpO₂ is 95%. Routine oxygen doesn\'t help a normal saturation. The ECG is what changes her care.' },
        { t: 'Give sublingual nitroglycerin', v: 0, fb: 'Not without an order, and not before an ECG: a right-sided MI or low blood pressure makes nitro dangerous.' },
      ],
      teach: 'Possible ACS: 12-lead ECG within 10 minutes, vitals, provider or rapid response, then aspirin and nitro per order. Oxygen only if SpO₂ is under 90%.' },

    // Psychiatry
    { id: 'escalate', k: ['psych'], from: '@cna', title: 'Rising voices', dom: 'safety', cost: 4, exp: 14,
      ping: '{cna}: "A patient on B hall is getting loud with another patient."',
      text: 'Terrell, 29, is pacing by the TV, fists clenched, voice rising at an older patient who changed the channel. Other patients are watching.',
      q: 'What do you do?',
      opts: [
        { t: 'Approach calmly with space and an exit, speak low and slow, and offer choices: a walk, a quiet room, or his PRN', v: 2, fb: 'Verbal de-escalation first. Choices give back a sense of control; space keeps everyone safe.' },
        { t: 'Call a show of force and get restraints ready', v: 0, fb: 'Restraint is the last resort, for imminent danger. He hasn\'t hurt anyone; there\'s time to talk him down.' },
        { t: 'Tell him firmly to sit down or lose his privileges', v: 0, fb: 'Threats escalate. Lead with respect and options.' },
        { t: 'Move the other patients out of the room first', v: 1, fb: 'Clearing the audience helps. {cna} can do that while you talk with Terrell.' },
      ],
      teach: 'Least restrictive first: calm voice, space, validation, choices, a PRN offered rather than forced. Seclusion or restraint only for imminent danger, with an order and close monitoring.' },
    { id: 'lithium', k: ['psych'], from: 'fl-lab', title: 'Lithium level', dom: 'meds', cost: 3, exp: 18,
      ping: 'Lab: a high lithium level on B hall. Her nurse is off the unit.',
      text: 'Lithium 1.9 on Ms. Varga, 44. {cna} says she vomited twice this morning and her hands are shaking badly.',
      q: 'What do you do?',
      opts: [
        { t: 'Hold the next dose, call the psychiatrist now, and assess her: neuro, hydration, vitals', v: 2, fb: 'The usual range is about 0.6 to 1.2. At 1.9 with vomiting and a coarse tremor she\'s toxic, and vomiting dehydrates her, which pushes the level higher.' },
        { t: 'Give the next dose with food to settle her stomach', v: -1, fb: 'More lithium into toxicity.' },
        { t: 'Push fluids and recheck the level tomorrow', v: 0, fb: 'Fluids help, but a level of 1.9 with symptoms needs the prescriber today and the dose held.' },
      ],
      teach: 'Lithium toxicity: vomiting and diarrhea, coarse tremor, confusion, unsteady gait. Hold, notify, check electrolytes and kidney function. Dehydration, NSAIDs, ACE inhibitors and thiazides raise the level.' },
    { id: 'nms', k: ['psych'], from: '@cna', title: 'Stiff and hot', dom: 'judgment', cost: 3, exp: 14,
      ping: '{cna}: "Mr. Obi on B hall looks sick. He\'s really stiff, and he\'s burning up."',
      text: 'He started haloperidol three days ago. Temp 39.4 °C, rigid arms, confused, sweating. BP 168/102, then 124/70 ten minutes later.',
      q: 'What do you do?',
      opts: [
        { t: 'Hold the antipsychotic, call the psychiatrist urgently, start cooling, and get labs including CK', v: 2, fb: 'Fever, rigidity, confusion and swinging vitals after an antipsychotic: neuroleptic malignant syndrome. It\'s a medical emergency.' },
        { t: 'Give acetaminophen and his scheduled haloperidol', v: -1, fb: 'More antipsychotic makes NMS worse.' },
        { t: 'Give PRN lorazepam for agitation', v: 0, fb: 'He\'s confused because he\'s medically sick, not agitated. Get the medical team.' },
      ],
      teach: 'NMS: high fever, lead-pipe rigidity, altered mental status, unstable vitals, high CK. Stop the drug, supportive care, usually a medical transfer; dantrolene or bromocriptine per provider.' },
    { id: 'contraband', k: ['psych'], from: 'fl-clerk', title: 'A bag for a patient', dom: 'safety', cost: 2, exp: 18,
      ping: 'The front desk: a visitor wants to drop off a bag for one of your patients.',
      text: 'Inside: a hoodie with a drawstring, a phone charger, a sealed bag of chips and a paperback.',
      q: 'What do you do?',
      opts: [
        { t: 'Check it against policy: hold the charger and the drawstring, give the rest', v: 2, fb: 'Cords and strings are ligature risks. Most units store them and return them at discharge.' },
        { t: 'Give it all to him. It\'s his stuff', v: -1, fb: 'Unchecked items on a locked unit are how ligatures and contraband get in.' },
        { t: 'Refuse the whole bag', v: 1, fb: 'Safe, but more restrictive than it needs to be. Patients do better with their own clothes and books.' },
      ],
      teach: 'Everything coming onto a locked unit is checked: cords, strings, belts, glass, sharps, medications and plastic bags are held.' },
    { id: 'leave', k: ['psych'], from: 'fl-rn', title: 'At the door', dom: 'judgment', cost: 3, exp: 15,
      ping: '{rn}: "A voluntary patient of mine is at the door asking to leave, and I\'m in a family meeting. Can you?"',
      text: 'Mr. Hale, 38, admitted voluntarily for depression, says he\'s done and wants to go home now.',
      q: 'What do you do?',
      opts: [
        { t: 'Take it seriously: stay with him, get the psychiatrist to evaluate him before he goes, and document his request', v: 2, fb: 'A voluntary patient can ask to leave. The team evaluates promptly; if he meets criteria, a hold can be started. If not, he goes, with a safety plan.' },
        { t: 'Tell him he can\'t leave until tomorrow', v: 0, fb: 'Holding a voluntary patient without legal grounds is false imprisonment.' },
        { t: 'Unlock the door and let him go', v: 0, fb: 'He may leave, but not without an evaluation. His risk may have changed.' },
      ],
      teach: 'Voluntary patients may request discharge. The psychiatrist evaluates promptly; a hold is started only if the person meets criteria (danger to self or others, grave disability). Otherwise, discharge with a safety plan.' },
    { id: 'ligature', k: ['psych'], from: '@cna', title: 'Under the mattress', dom: 'safety', cost: 3, exp: 14,
      ping: '{cna} found something under a mattress on B hall.',
      text: 'A shoelace tied into a loop, under the mattress of Ms. Delaney, 19, admitted two days ago after an overdose. She\'s in her room.',
      q: 'What do you do?',
      opts: [
        { t: 'Remove it, stay with her, ask her directly about suicidal thoughts, and get her nurse and the psychiatrist', v: 2, fb: 'A prepared ligature is a plan. Asking directly doesn\'t plant the idea; it opens the door.' },
        { t: 'Remove it and tell her nurse at the end of the shift', v: -1, fb: 'A plan in progress needs action now, and closer observation until she\'s reassessed.' },
        { t: 'Leave it where it is and watch her', v: -1, fb: 'Never leave the means in place.' },
      ],
      teach: 'Found means: remove it, keep direct observation, assess suicide risk (C-SSRS), notify the provider, and search the room per policy.' },

    // Pediatrics
    { id: 'apap', k: ['peds'], from: 'fl-rn', title: 'A dose to check', dom: 'meds', cost: 2, exp: 18,
      ping: '{rn}: "Can you give my patient\'s Tylenol? I\'m stuck in a room."',
      text: '"She\'s 12 kg. The order says acetaminophen 480 mg by mouth. It\'s drawn up on the counter."',
      q: 'What do you do?',
      opts: [
        { t: 'Don\'t give it: about 40 mg/kg is too much. Hold it and clarify with the provider', v: 2, fb: 'Acetaminophen is 10 to 15 mg/kg per dose: 120 to 180 mg for 12 kg. 480 mg looks like an adult-sized error.' },
        { t: 'Give it. Pharmacy verified it', v: -1, fb: 'Pharmacy isn\'t the last check. You are. Check every weight-based dose yourself.' },
        { t: 'Give half: 240 mg', v: 0, fb: 'Changing a dose on your own is out of scope, and 240 mg is still too high.' },
      ],
      teach: 'Pediatric doses are weight-based: check mg/kg every time. Acetaminophen is 10–15 mg/kg every 4–6 hours, no more than 75 mg/kg a day or the adult maximum.' },
    { id: 'epiglottis', k: ['peds'], from: 'fl-rn', title: 'Drooling and quiet', dom: 'judgment', cost: 3, exp: 10,
      ping: '{rn}: "New admission in 511. Can you look at him with me?"',
      text: 'Ravi, 4, came up with a high fever. He\'s sitting forward with his chin out, drooling, his voice muffled, and he won\'t lie down. His mom wants you to look at his throat.',
      q: 'What do you do?',
      opts: [
        { t: 'Don\'t look in his throat. Keep him calm on mom\'s lap, get airway equipment ready, and call the provider now', v: 2, fb: 'Tripod position, drooling, a muffled voice and high fever suggest epiglottitis. A tongue depressor can trigger complete obstruction.' },
        { t: 'Lay him flat to get a good look', v: -1, fb: 'Lying flat can close a swollen airway.' },
        { t: 'Swab his throat for a culture', v: 0, fb: 'Not until the airway is secure.' },
      ],
      teach: 'Possible epiglottitis: keep the child calm and upright, nothing in the mouth, the airway team and equipment at the bedside, no throat exam until the airway is secured.' },
    { id: 'sleep', k: ['peds'], from: '@cna', title: 'Asleep together', dom: 'safety', cost: 2, exp: 15,
      ping: '{cna}: "Mom in 511 fell asleep in the recliner with the baby on her chest."',
      text: 'The baby is 3 months old, face down on her chest, a blanket over both of them. Mom has been up for two days.',
      q: 'What do you do?',
      opts: [
        { t: 'Gently wake her, put the baby on his back in the crib, and ask how you can help her rest', v: 2, fb: 'Safe sleep: alone, on the back, in a crib with nothing else in it. An exhausted parent in a recliner is a real suffocation risk.' },
        { t: 'Let them sleep. Skin to skin is good for bonding', v: -1, fb: 'Skin to skin is great while mom is awake. Asleep, it\'s a suffocation and fall risk.' },
        { t: 'Move the blanket off his face and leave them', v: 0, fb: 'Better, but a baby face down on a sleeping adult is still unsafe.' },
      ],
      teach: 'The ABCs of safe sleep: Alone, on the Back, in a Crib, with no soft bedding, bumpers or adults. Model it in the hospital; this is where families learn it.' },
    { id: 'infiltrate', k: ['peds'], from: '@cna', title: 'A puffy hand', dom: 'assess', cost: 3, exp: 15,
      ping: '{cna}: "The IV in 511\'s hand looks puffy."',
      text: 'An 11-month-old on maintenance fluids. The hand around the site is swollen, cool, pale and tight. The pump hasn\'t alarmed.',
      q: 'What do you do?',
      opts: [
        { t: 'Stop the infusion, take out the IV, elevate the hand, notify the provider and document', v: 2, fb: 'Infiltration. Pumps push past it without alarming, and in a baby a small space fills fast. Stop, remove, elevate, assess.' },
        { t: 'Flush it to check that it\'s patent', v: 0, fb: 'Flushing pushes more fluid into the tissue.' },
        { t: 'Slow the rate and recheck in an hour', v: -1, fb: 'Fluid is still going into the tissue. This needs action now.' },
      ],
      teach: 'Check pediatric IV sites at least hourly: look, touch, compare sides. Infiltration is cool, pale, swollen and tight. Stop, remove, elevate. Some drugs need an antidote per policy.' },
    { id: 'report', k: ['peds'], from: 'fl-rn', title: 'Bruises', dom: 'judgment', cost: 3, exp: 18,
      ping: '{rn} wants a second opinion on a new admission.',
      text: 'A 4-month-old admitted with vomiting. {rn} found bruises on his chest and back, in different colors. Dad says he rolled off the couch. He can\'t roll over yet.',
      q: 'What do you do?',
      opts: [
        { t: 'Document exactly what you see, tell the provider, and report to child protective services per policy', v: 2, fb: 'Nurses are mandated reporters: you report reasonable suspicion, and investigating is CPS\'s job. Bruises on a baby who can\'t move himself, with a story that doesn\'t fit, are red flags.' },
        { t: 'Ask dad more questions until the story makes sense', v: 0, fb: 'Investigating isn\'t your role, and it can make the child less safe.' },
        { t: 'Wait for the skeletal survey before reporting', v: 0, fb: 'Suspicion is enough. Waiting for proof delays protection.' },
      ],
      teach: 'Mandated reporting runs on suspicion, not proof. Document objectively, with quotes, and report per state law and hospital policy, usually with social work.' },
    { id: 'norms', k: ['peds'], from: '@cna', title: 'Is this normal?', dom: 'assess', cost: 1, exp: 15,
      ping: '{cna}: "Quick question about the 6-month-old in 511."',
      text: '"Heart rate 150, breathing 40. He\'s crying his head off. Is that normal?"',
      q: 'What do you say?',
      opts: [
        { t: 'Normal for his age while crying. Recheck when he\'s calm', v: 2, fb: 'For an infant, a heart rate of about 100–160 and breathing at 30–60 are normal, and crying pushes both up.' },
        { t: 'Call a rapid response', v: 0, fb: 'Those numbers are normal for a 6-month-old.' },
        { t: 'Give acetaminophen for the heart rate', v: 0, fb: 'There\'s nothing to treat here.' },
      ],
      teach: 'Know pediatric norms by age. Babies breathe and beat fast; an adult\'s "normal" breathing rate of 16 would be alarming in an infant.' },
    /* ---------- mother-baby ---------- */
    { id: 'pink', k: ['ob'], from: 'fl-clerk', title: 'A baby in the hall', dom: 'safety', cost: 3, exp: 10,
      ping: 'Pat, from the desk: "Someone in scrubs just walked past with a baby in her arms, heading for the stairs."',
      text: 'A woman in blue scrubs, no badge you can see, a newborn in a hospital blanket held against her chest, not in a bassinet. She\'s walking fast toward the stairwell.',
      q: 'What do you do?',
      opts: [
        { t: 'Call the infant security code now, stay with her, and ask to see her badge and the baby\'s band', v: 2, fb: 'Babies move in bassinets, not in arms in the hall, and staff wear badges. Call the code first; it locks the exits. Then stay with her and verify.' },
        { t: 'Follow her and ask where she\'s going', v: 1, fb: 'Staying with her is right, but the code goes out first. Every second matters once she reaches the stairs.' },
        { t: 'Let her go. She\'s in scrubs, she\'s probably staff', v: -1, fb: 'Scrubs are easy to buy. Most infant abductions are by a woman posing as staff.' },
        { t: 'Check the census to see whose baby it might be', v: 0, fb: 'By the time you look, she\'s gone. Act first.' },
      ],
      teach: 'Infant security: babies travel in bassinets, staff wear visible photo badges, mothers are taught to hand their baby only to someone wearing the unit\'s badge. A suspected abduction is a code (often Code Pink) that locks the unit down.',
      miss: { text: 'A possible infant abduction call sat unanswered until Nova took it.', why: 'An abduction call can\'t wait. Call the code first; it locks the exits.' } },
    { id: 'blues', k: ['ob'], from: 'fl-rn', title: 'Tearful', dom: 'judgment', cost: 3, exp: 18,
      ping: '{rn} wants to run something by you about her patient.',
      text: 'A first-time mother, day 2 after a vaginal birth. She\'s been crying on and off since this morning, says she feels "weepy and overwhelmed," but she\'s feeding the baby, sleeping when he sleeps, and laughing with her partner between tears. No thoughts of harming herself or the baby. Her screen this morning was low.',
      q: 'What should {rn} do?',
      opts: [
        { t: 'Reassure her this is common around day 2 to 3, help her rest and get support, and teach the signs that mean call: lasting past two weeks, not sleeping when she could, or thoughts of harm', v: 2, fb: 'This is the picture of the baby blues: common, mild, and gone by about two weeks. Support and clear warning signs are the treatment.' },
        { t: 'Ask for a psychiatry consult today', v: 0, fb: 'Nothing here needs psychiatry today. Save escalation for persistent symptoms, a high screen, or any thought of harm.' },
        { t: 'Tell her every new mom feels this way and it\'s nothing', v: 0, fb: 'True in part, but "nothing" closes the door. Teach the signs that would make it something.' },
        { t: 'Keep the baby in the nursery so she can rest', v: 1, fb: 'Rest helps, but separating them isn\'t the plan for the blues. Rooming-in with help, and a partner who takes a feed, works better.' },
      ],
      teach: 'Baby blues: tearfulness and mood swings starting around day 2 to 3, gone within about two weeks. Postpartum depression lasts longer and interferes with function; postpartum psychosis (confusion, hallucinations, not sleeping at all) is an emergency.' },
    { id: 'cold', k: ['ob'], from: '@cna', title: 'A cool baby', dom: 'assess', cost: 2, exp: 15,
      ping: '{cna}: "The baby in 222 is 36.1 after his bath. Is that okay?"',
      text: 'A full-term baby, 8 hours old, bathed 30 minutes ago. Axillary temperature 36.1 °C. He\'s a little mottled on his feet and sleepy, but woke to feed an hour ago.',
      q: 'What do you tell {cna}?',
      opts: [
        { t: 'Skin to skin with mom under a warm blanket, hat on, recheck the temperature in 30 minutes, and check a glucose if he\'s still cool or not feeding', v: 2, fb: 'Cold stress burns glucose. Rewarm skin to skin, then recheck, and think about his sugar.' },
        { t: 'Normal for a newborn. Recheck at the next vitals', v: 0, fb: 'Normal axillary is about 36.5 to 37.5. A newborn under 36.5 needs warming now.' },
        { t: 'Put him under the radiant warmer, unwrapped, with no recheck', v: 0, fb: 'A warmer works, with a probe and a recheck. Skin to skin works just as well and keeps him with mom.' },
      ],
      teach: 'Newborns lose heat fast (evaporation after a bath, a cold surface, a draft). Cold stress raises oxygen and glucose use and can lead to hypoglycemia. Dry, hat, skin to skin, recheck.' },
    { id: 'sleep-ob', k: ['ob'], from: '@cna', title: 'Asleep together', dom: 'safety', cost: 2, exp: 15,
      ping: '{cna}: "The mom in 224 fell asleep in bed with the baby on her chest."',
      text: 'The baby is a day old, face down on her chest under the blanket. Mom had a long labor and finally fell asleep mid-feed. The side rail is down.',
      q: 'What do you do?',
      opts: [
        { t: 'Gently move the baby to the bassinet on his back, raise the rail, and help her rest', v: 2, fb: 'Skin to skin is great while mom is awake. Asleep, an exhausted mother in a hospital bed is a fall and suffocation risk.' },
        { t: 'Let them sleep. Skin to skin is good for breastfeeding', v: -1, fb: 'In-hospital newborn falls and suffocation events happen exactly like this: a sleeping, exhausted mother.' },
        { t: 'Move the blanket off the baby\'s face and leave them', v: 0, fb: 'Better, but a baby face down on a sleeping adult is still unsafe.' },
      ],
      teach: 'Safe sleep starts on the first day: Alone, on the Back, in a Crib (or bassinet), with nothing soft. Encourage skin to skin when mom is awake and alert, and check on her during the night.' },
    /* ---------- emergency department ---------- */
    { id: 'lobby', k: ['ed'], from: 'fl-rn', title: 'In the lobby', dom: 'priority', cost: 3, exp: 12,
      ping: '{rn}, from triage: "Can you look at someone in the lobby? I\'m swamped."',
      text: 'A 58-year-old man checked in for "heartburn" an hour ago. He\'s gray and sweaty, rubbing his jaw. HR 104, BP 152/94, SpO₂ 95%. His ESI on the board says 3.',
      q: 'What do you do?',
      opts: [
        { t: 'Bring him back to a bed now, get a 12-lead ECG within 10 minutes, and upgrade him to ESI 2', v: 2, fb: 'Possible ACS is high-risk: ESI 2, ECG within 10 minutes of arrival. "Heartburn" with sweating and jaw pain is the classic disguise.' },
        { t: 'Give him an antacid and recheck in an hour', v: -1, fb: 'If this is an MI, an hour is heart muscle. ECG first.' },
        { t: 'Tell the triage nurse to recheck his vitals', v: 0, fb: 'Rechecking doesn\'t change the risk. He needs an ECG and a bed.' },
        { t: 'Get an ECG in the lobby, then decide', v: 1, fb: 'The ECG is right, but a sweaty man with chest symptoms belongs on a monitor in a bed.' },
      ],
      teach: 'Emergency Severity Index: ESI 2 is a high-risk situation, new confusion or lethargy, or severe pain or distress. Chest pain that could be ACS gets an ECG within 10 minutes of arrival.',
      miss: { text: 'A possible MI waited in the lobby until Nova pulled him back.', why: 'Someone gray and sweaty with "heartburn" needs an ECG within 10 minutes. Re-triage when the picture changes.' } },
    { id: 'ama', k: ['ed'], from: 'fl-rn', title: 'Leaving', dom: 'comm', cost: 3, exp: 15,
      ping: '{rn}: "My guy in bay 9 is pulling his IV out. He wants to leave."',
      text: 'A 44-year-old with abdominal pain, CT pending. He\'s alert, oriented, sober, and angry about the wait. "I\'ve got kids to pick up. I\'m going."',
      q: 'What do you advise?',
      opts: [
        { t: 'Hear him out, explain what the CT is looking for and the risk of leaving, get the provider to talk with him, and if he still goes, document and tell him he can come back anytime', v: 2, fb: 'An adult with capacity can refuse care. Your job is an informed refusal: the risks, a provider conversation, a clear door back.' },
        { t: 'Tell him he can\'t leave until the doctor clears him', v: -1, fb: 'Holding a competent adult against his will is false imprisonment. Persuade, don\'t threaten.' },
        { t: 'Let him go; it\'s his choice', v: 0, fb: 'It is his choice, but an informed one. Without the risks and a provider conversation, it isn\'t.' },
        { t: 'Call security to sit with him', v: 0, fb: 'Security is for danger, not for disagreement.' },
      ],
      teach: 'Leaving against medical advice: assess capacity, explain specific risks in plain words, involve the provider, address the reason (childcare, cost, the wait), document, and invite them back.' },
    { id: 'emtala', k: ['ed'], from: 'fl-clerk', title: 'At registration', dom: 'judgment', cost: 2, exp: 15,
      ping: 'Pat, at registration: "This patient doesn\'t have insurance. Should I send her to the clinic down the street?"',
      text: 'A 31-year-old with a headache she calls "the worst of my life," started an hour ago. She\'s asking what the visit will cost.',
      q: 'What do you tell Pat?',
      opts: [
        { t: 'No. Everyone who comes in gets a medical screening exam regardless of ability to pay. Bring her to triage now; billing can talk with her later', v: 2, fb: 'EMTALA: every patient gets a screening exam and stabilizing care, regardless of insurance. And a sudden worst-headache-of-my-life is a subarachnoid bleed until proven otherwise.' },
        { t: 'Yes, the clinic is cheaper for her', v: -1, fb: 'Sending her away before a screening exam violates EMTALA, and a thunderclap headache can be a bleeding aneurysm.' },
        { t: 'Have her talk to a financial counselor first', v: 0, fb: 'Financial questions can\'t delay the screening exam.' },
      ],
      teach: 'Under EMTALA, any person who comes to an emergency department gets a medical screening exam and stabilizing treatment, without delay for insurance or payment questions.' },
    { id: 'escalate-ed', k: ['ed'], from: 'fl-sec', title: 'At the desk', dom: 'safety', cost: 3, exp: 12,
      ping: 'Officer Dale: "A visitor at the nurses\' station is getting loud about the wait."',
      text: 'A man whose mother has been waiting four hours. He\'s red-faced, pacing, voice rising, and has started slapping the counter. Nothing in his hands.',
      q: 'What do you do?',
      opts: [
        { t: 'Calm voice, open posture, a safe distance and a clear exit; acknowledge the wait, tell him what you can do, and keep security close by', v: 2, fb: 'De-escalation works early. Validate the feeling, offer something real (an update on his mother), and never get cornered.' },
        { t: 'Tell him to calm down or he\'ll be removed', v: 0, fb: 'Threats escalate. Lead with listening; security is the backup.' },
        { t: 'Ignore him until he settles', v: 0, fb: 'Escalation fills the silence. Engage early.' },
        { t: 'Walk him into an empty room to talk privately', v: -1, fb: 'Never isolate yourself with an escalating person. Stay in the open, with your exit clear.' },
      ],
      teach: 'Workplace violence is common in the ED. Recognize escalation (pacing, raised voice, clenched fists), de-escalate early, keep your exit, and call security before you need them.' },
  ];

  // Seeded randomness: the same run replays the same calls; a new run gets a different set.
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  // While the aide is floated off the unit (Nights: Dee goes to the ED at 01:00), her calls come from the charge nurse.
  let cur = null;
  const cnaKey = (c) => (cur && c.delegation && c.delegation.away && c.delegation.away(cur) ? 'nova' : c.cna || 'luis');
  const fromKey = (c, it) => (it.from === '@cna' ? cnaKey(c) : it.from === 'fl-rn' ? 'fl-rn-' + kindOf(c) : it.from);
  function fill(c, x) { const cn = (c.staff[cnaKey(c)] || {}).name || 'Your aide'; return String(x).replace(/\{rn\}/g, RN[kindOf(c)]).replace(/\{cna\}/g, cn); }
  const item = (id) => POOL.find((x) => x.id === id);
  const MAX = 5;

  function init(s, c) {
    const r = rng((s.seed || 1) ^ 0x5eed), k = kindOf(c);
    const pool = POOL.filter((x) => x.k.includes(k) || (k === 'icu' && x.k.includes('med') && !x.noIcu)).map((x) => [x.id, r()]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
    // Each shift gets at least one call from its own specialty in the first two.
    const own = pool.findIndex((id) => item(id).k.length === 1 && item(id).k[0] === k); if (own > 1) { const [x] = pool.splice(own, 1); pool.splice(1, 0, x); }
    s.floor = { order: pool.slice(0, MAX), n: 0, next: 70 + Math.floor(r() * 25), q: [] };
  }
  function busy(s, A, c) { return c.patients.some((d) => { const P = s.p[d.id]; return P && (!d.arrives || P.arrived) && !P.icu && !P.gone && d.status(s, P, A) === 'urgent'; }); }

  function tick(s, A, c) {
    cur = s;
    if (!s.floor) init(s, c);
    const F = s.floor;
    F.q.forEach((x) => {
      if (x.done || s.t < x.exp) return;
      x.done = 'missed';
      const it = item(x.id), m = s.inbox.find((mm) => mm.floor === x.id); if (m) { m.done = true; m.read = true; }
      // Close the loop the call opened ("two admissions are coming"), so nobody waits for something that won't happen.
      A.msg({ from: 'nova', floorMiss: x.id, text: `I took the ${it.title.toLowerCase()} call from ${(c.staff[fromKey(c, it)] || {}).name || 'the desk'}. It's handled.${it.after ? ' ' + fill(c, it.after.replace(/^Nova:\s*/, '').replace(/^"|"$/g, '')) : ''}` });
      if (it.miss) A.judge('floor-' + x.id, it.dom, -0.5, `Floor call you didn't get to${where(it)}: ${fill(c, it.miss.text)}`, fill(c, it.miss.why));
    });
    if (F.n >= F.order.length || s.t < F.next || s.t > c.length - 25) return;
    if (F.q.some((x) => !x.done) || busy(s, A, c)) { F.next = s.t + 6; return; }
    const it = item(F.order[F.n]), r = rng((s.seed || 1) + F.n * 7919);
    F.q.push({ id: it.id, at: s.t, exp: s.t + it.exp, done: false });
    F.n += 1; F.next = s.t + 30 + Math.floor(r() * 16);
    A.msg({ from: fromKey(c, it), floor: it.id, text: fill(c, it.ping), replies: [{ label: 'Take the call', act: 'floor', id: it.id }] });
  }

  // What the player sees: options in a stable, shuffled order.
  function view(s, c, id) {
    cur = s;
    const it = item(id), r = rng((s.seed || 1) + id.length * 131 + id.charCodeAt(0));
    const opts = it.opts.map((o, i) => ({ i, t: fill(c, o.t), v: o.v, fb: fill(c, o.fb), key: r() })).sort((a, b) => a.key - b.key);
    const tx = typeof it.text === 'string' ? it.text : it.text[kindOf(c)] || it.text.med;
    const x = (s.floor && s.floor.q.find((q) => q.id === id)) || {};
    return { id, title: it.title, from: fromKey(c, it), text: fill(c, tx), q: fill(c, it.q), opts, teach: fill(c, it.teach), cost: it.cost, exp: x.exp, at: x.at, done: x.done, pick: x.pick, dom: it.dom };
  }
  const DELTA = { 2: 0.5, 1: 0, 0: -0.5, '-1': -1 };
  // Floor calls are about the rest of the unit, not the player's own patients: the debrief says whose bed it was.
  const where = (it) => { const m = /\b(bed|room)\s+(\d{2,4})\b/i.exec(it.ping || ''); return m ? ` (${m[1].toLowerCase()} ${m[2]}, not your patient)` : ''; };
  function answer(s, A, id, i) {
    cur = s;
    const c = A.c, it = item(id), x = s.floor.q.find((q) => q.id === id); if (!x || x.done) return null;
    const o = it.opts[i]; x.done = 'answered'; x.pick = i; x.v = o.v; x.t = s.t;
    const m = s.inbox.find((mm) => mm.floor === id); if (m) { m.done = true; m.read = true; }
    const best = it.opts.find((z) => z.v === 2);
    A.judge('floor-' + id, it.dom, DELTA[o.v], `Floor call${where(it)}, ${it.title.replace(/^[A-Z](?![A-Z0-9])/, (ch) => ch.toLowerCase())}: ${fill(c, o.t).replace(/^[A-Z](?![A-Z0-9])/, (ch) => ch.toLowerCase())}.`, fill(c, o.fb) + (o.v < 2 ? ` Best: ${fill(c, best.t).replace(/^[A-Z](?![A-Z0-9])/, (ch) => ch.toLowerCase())}.` : ''));
    if (it.after) A.msg({ from: 'nova', text: fill(c, it.after.replace(/^Nova:\s*/, '').replace(/^"|"$/g, '')) });   // say how a hypothetical resolved, so nothing seems to vanish
    return { v: o.v };
  }
  function open(s) { return s.floor ? s.floor.q.filter((x) => !x.done) : []; }
  function stats(s) { const q = s.floor ? s.floor.q : []; return { total: q.length, best: q.filter((x) => x.v === 2).length, answered: q.filter((x) => x.done === 'answered').length, missed: q.filter((x) => x.done === 'missed').length }; }
  function endChecks() {}

  S.floor = { tick, view, answer, open, stats, endChecks, staffFor, STAFF, POOL, kindOf };
})(window.Shift);
