/* The Shift — the rest of the shift. Unit-wide work that every case gets for free:
   following patients after they leave, hourly rounding, call lights, PRN reassessment,
   and giving report to the next nurse. Cases can opt out per patient; content that has
   to be clinically specific (what happened in the ICU) lives in AFTER below. */
window.Shift = window.Shift || {};
(function (S) {
  const kindOf = (c) => (/^psych/.test(c.id) ? 'psych' : /^peds/.test(c.id) ? 'peds' : /^ob/.test(c.id) ? 'ob' : /^ld/.test(c.id) ? 'ld' : /^ed/.test(c.id) ? 'ed' : 'med');
  const seed = (str) => [...String(str)].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const ageNum = (d) => (typeof d.age === 'number' ? d.age : /mo/.test(d.age) ? 0 : parseFloat(d.age) || 0);

  /* ---------- people who only exist off the unit or after the shift ---------- */
  const L = (skin, shade, lip, blush, iris, hair, hcol, cloth, extra) => ({ skin, shade, lip, blush, iris, head: { w: 55, h: 61, jaw: .4 }, eye: 9.8, hair: { style: hair, color: hcol }, brow: { w: 3.6, color: hcol }, body: { w: 82, cloth }, extras: extra || [], smile: .3, tired: true });
  const STAFF = {
    icu: { name: 'Sam Okoye', role: 'ICU RN', look: L('#6A4430', '#4F3122', '#502A1E', '#94503E', '#1E130C', 'buzz', '#120D0A', 'teal') },
    picu: { name: 'Jess Moreno', role: 'PICU RN', look: L('#D9A982', '#BC8B64', '#A0594C', '#DC8E74', '#3A2616', 'ponytail', '#3B2718', 'teal') },
    ed: { name: 'Tom Baird', role: 'ED RN', look: L('#EDCBAE', '#D2AA8B', '#AE665C', '#E69A86', '#43607A', 'short', '#6B4B2E', 'navy', ['beard']) },
    med: { name: 'Ines Carvalho', role: 'Medicine RN', look: L('#E4B894', '#C79A74', '#A45D50', '#DE9378', '#3E2A1A', 'bob', '#2A1C14', 'blue') },
    cath: { name: 'Imani Ferreira', role: 'Cath lab RN', look: L('#D9A982', '#BC8B64', '#A0594C', '#DC8E74', '#3A2616', 'bun', '#2A1C14', 'teal') },
    or: { name: 'Mike Dunn', role: 'OR circulating RN', look: L('#EDCBAE', '#D2AA8B', '#AE665C', '#E69A86', '#43607A', 'buzz', '#6B4B2E', 'blue') },
    ld: { name: 'Carmen Ruiz', role: 'L&D RN', look: L('#C99A74', '#AA7C58', '#8E5246', '#C8866C', '#2A1B10', 'bun', '#2A1C14', 'rose') },
    nicu: { name: 'Priya Shah', role: 'NICU RN', look: L('#A7714C', '#875634', '#6E3E2E', '#B7735A', '#20140C', 'long', '#140E0A', 'teal') },
    pacu: { name: 'Dev Patel', role: 'PACU RN', look: L('#B98460', '#9A6846', '#7E4535', '#BE7A5E', '#20140C', 'short', '#15100D', 'grey') },
  };
  const ONCOMING = {
    'medsurg-4w-1': { key: 'tess', name: 'Tess', role: 'Oncoming RN', look: L('#F2D2B8', '#D8B094', '#BA6A62', '#EE9A8C', '#5A7A9A', 'bun', '#B07A40', 'navy', ['freckles']) },
    'medsurg-4w-2': { key: 'dana' },
    'medsurg-4w-3': { key: 'kai', name: 'Kai', role: 'Oncoming RN', look: L('#D8A37C', '#BA855E', '#9A564A', '#D68A70', '#2C1D12', 'short', '#1B1410', 'teal') },
    'psych-3e-1': { key: 'owen', name: 'Owen', role: 'Oncoming RN', look: L('#C79470', '#A87652', '#8E5244', '#C98468', '#2A1B10', 'curls', '#20150F', 'grey', ['beard']) },
    'psych-4n-1': { key: 'marco', name: 'Marco', role: 'Night RN', look: L('#D6A47E', '#B88660', '#9A5648', '#D48A70', '#2A1C12', 'short', '#1A1310', 'navy', ['goatee']) },
    'stepdown-6e-1': { key: 'ari', name: 'Ari', role: 'Oncoming RN', look: L('#E2B48E', '#C49670', '#A0594C', '#DC8E74', '#3A2616', 'short', '#2A1C14', 'teal', ['studs']) },
    'icu-3w-1': { key: 'rosa', name: 'Rosa', role: 'Oncoming ICU RN', look: L('#C08A64', '#A06E4C', '#86483A', '#C27C60', '#20140C', 'bun', '#1E1712', 'teal', ['studs']) },
    'ld-2s-1': { key: 'gina', name: 'Gina', role: 'Oncoming L&D RN', look: L('#D9A982', '#BC8B64', '#A0594C', '#DC8E74', '#3A2616', 'bob', '#2A1C14', 'rose', ['studs']) },
    'ed-podb-1': { key: 'jo', name: 'Jo', role: 'Night RN', look: L('#8A5A3C', '#6E4530', '#6A3A2C', '#A8604A', '#1E130C', 'curlyshort', '#140E0A', 'navy', ['studs']) },
    'ob-2n-1': { key: 'maya', name: 'Maya', role: 'Oncoming RN', look: L('#E8C0A0', '#CC9E7E', '#AE6258', '#E4927C', '#2A1C12', 'bob', '#3A2618', 'rose', ['studs']) },
    'peds-5s-1': { key: 'june', name: 'June', role: 'Night RN', look: L('#EFCCAF', '#D4AA8C', '#B66A60', '#EE9C88', '#3C2A1E', 'long', '#1E1712', 'wine') },
  };
  // Staff for a case: receiving units, plus the oncoming nurse (reusing a character from another shift if we have one).
  function staffFor(c, all) {
    const out = Object.assign({}, STAFF), o = ONCOMING[c.id];
    if (o) {
      if (o.name) out[o.key] = { name: o.name, role: o.role, look: o.look };
      else { const src = all.map((k) => k.staff && k.staff[o.key]).find(Boolean); if (src) out[o.key] = { name: src.name, role: 'Oncoming RN', look: src.look }; }
    }
    return out;
  }
  const oncoming = (c) => (ONCOMING[c.id] || {}).key || 'nova';

  /* ---------- after the transfer: what happened next, per case and patient ---------- */
  const ST = { crit: 'Critical', serious: 'Serious', improving: 'Improving', stable: 'Stable', surgery: 'In surgery' };
  const AFTER = {
    'medsurg-4w-1': {
      '416': (s, P, A, at) => ({
        unit: 'ICU', nurse: 'icu', emergent: true, push: 45,
        event: `Septic shock. Drowsy with a systolic of 74 after a liter of fluid, lactate 4.6. Rapid response at ${A.clock(at)}; norepinephrine started.`,
        extra: [{ label: s.meds['416-cef'].status === 'given' ? `Ceftriaxone given at ${A.clock(s.meds['416-cef'].at)}` : 'Her first antibiotic dose never went in on the floor', key: true }, { label: 'High fall risk, new confusion, pulling at lines', key: false }],
        family: { name: 'Ruth', rel: 'daughter', phone: true },
        course: [
          { at: 0, st: 'crit', text: 'Arrived in the ICU. Mean pressure 58 on norepinephrine. Arterial and central lines going in; second liter of fluid running.' },
          { at: 40, st: 'crit', text: 'Norepinephrine up to 12 mcg/min. 10 mL of urine in the last hour. Still confused, not following commands every time.' },
          { at: 100, st: 'serious', text: 'Mean pressure holding in the mid-60s. Repeat lactate 3.1, down from 4.6. Blood cultures growing gram-negative rods; urine is the likely source.' },
          { at: 180, st: 'improving', text: 'Norepinephrine weaned to 4. She squeezed Ruth\'s hand and asked who was feeding Biscuit.' },
        ],
        later: 'Four days in the ICU and nine in the hospital. She went home with Ruth and home physical therapy, weaker than when she came in. Fever, a fast heart rate, new confusion and low urine output were all there at 07:00; connecting them early is what keeps sepsis out of the ICU.',
      }),
    },
    'medsurg-4w-2': {
      '421': (s, P, A, at) => ({
        unit: 'ICU', nurse: 'icu', emergent: true,
        event: `Hypercapnic respiratory failure. Hard to rouse on 6 L; CO₂ in the 80s. Rapid response at ${A.clock(at)}, to the ICU for BiPAP.`,
        extra: [{ label: 'Known CO₂ retainer: SpO₂ goal 88–92%, baseline PaCO₂ about 52', key: true }, { label: 'Her oxygen was turned up to 6 L earlier this shift', key: true }],
        course: [
          { at: 0, st: 'crit', text: 'On BiPAP 14/6 with oxygen dialed down to 28%. First blood gas: pH 7.18, PaCO₂ 86.' },
          { at: 45, st: 'serious', text: 'Repeat gas pH 7.26, PaCO₂ 71. Opens her eyes to her name.' },
          { at: 120, st: 'improving', text: 'pH 7.32, PaCO₂ 62. Awake, annoyed by the mask, asking for her glasses. SpO₂ 90%.' },
        ],
        later: 'Two nights on BiPAP, then back to 2 L and a medical floor. For a CO₂ retainer, the dangerous number is the one the monitor doesn\'t show; oxygen kept at her 88–92% goal would likely have kept her off BiPAP.',
      }),
      '425': (s, P, A, at) => ({
        unit: 'ICU', nurse: 'icu', emergent: true,
        event: `Acute hemolytic transfusion reaction: shock and dark urine during the PRBC unit. Rapid response at ${A.clock(at)}.`,
        extra: [{ label: P.bankSent ? 'Bag, tubing and samples sent to blood bank for the reaction workup' : 'Bag and tubing not yet sent to blood bank: save them for the workup', key: true }, { label: 'Gastric ulcer clipped this morning; apixaban on hold', key: true }],
        course: [
          { at: 0, st: 'crit', text: 'BP 72/40. She stays DNR, but she agreed to pressors: DNR means no CPR, not no treatment. Norepinephrine started. Urine is dark red. Transfusion reaction workup and a DIC panel sent.' },
          { at: 50, st: 'crit', text: 'Platelets and fibrinogen falling, oozing at her IV sites: DIC. Nephrology consulted for a rising creatinine.' },
          { at: 130, st: 'serious', text: 'Pressure better on low-dose norepinephrine. Blood bank confirmed an ABO-incompatible unit. Risk management has asked for your written account.' },
        ],
        later: 'She survived, but needed dialysis for two weeks while her kidneys recovered. A wrong-blood transfusion is a never event. The two-person bedside check of the unit against the band is the barrier that catches a transposed MRN.',
      }),
      '427': (s, P, A, at) => ({
        unit: 'ICU', nurse: 'icu', emergent: true,
        event: `Cardiac arrest from hyperkalemia, potassium near 7 with no calcium on board. Code blue at ${A.clock(at)}; pulse back after CPR.`,
        extra: [{ label: 'CKD stage 4; critical potassium was called early in the shift', key: true }, { label: 'Renal diet, strict I&O', key: false }],
        course: [
          { at: 0, st: 'crit', text: 'Pulse back after calcium, bicarbonate and two rounds of CPR. Intubated. Potassium 7.1; a dialysis catheter is going in.' },
          { at: 50, st: 'crit', text: 'On continuous dialysis. Potassium 6.0. Sedated on the ventilator, on one pressor.' },
          { at: 130, st: 'serious', text: 'Potassium 5.0. Pressor off. They lightened sedation: he opens his eyes and follows commands.' },
        ],
        later: 'Extubated on day three with no lasting neurologic damage; a short downtime saved him. A critical potassium with peaked T waves gets treated before the code: calcium to protect the heart, insulin with dextrose to shift the potassium, then binders or dialysis to remove it.',
      }),
      '429': (s, P, A, at) => (P.icu ? {
        unit: 'ICU', nurse: 'icu', emergent: true,
        event: `Anaphylaxis to a penicillin-class antibiotic. Airway swelling; rapid response at ${A.clock(at)}, intubated.`,
        extra: [{ label: 'Penicillin allergy with anaphylaxis', key: true }, { label: 'Appendicitis still untreated; surgery needs rescheduling', key: true }, { label: 'Her mother speaks Somali: use an interpreter', key: true }],
        family: { name: 'Hodan', rel: 'mother', interp: 'Somali' },
        course: [
          { at: 0, st: 'crit', text: 'Intubated for airway swelling. On an epinephrine infusion. Surgery postponed.' },
          { at: 60, st: 'serious', text: 'Epinephrine weaned off. Staying on the ventilator while the swelling settles. The allergy is now flagged on the OR checklist.' },
          { at: 150, st: 'serious', text: 'Cuff leak present. Plan: extubate in the morning, then surgery with a non-penicillin antibiotic.' },
        ],
        later: 'Extubated the next morning; appendectomy on day two. The allergy band was on her wrist the whole time.',
      } : {
        unit: 'PACU', nurse: 'pacu', emergent: false, handoff: false, note: false, push: 55,
        event: 'To the OR for laparoscopic appendectomy.',
        course: [
          { at: 0, st: 'surgery', text: 'In the OR. Laparoscopic appendectomy under way.' },
          { at: 55, st: 'stable', text: 'In recovery. Appendix out, not perforated. Pain 3 out of 10, off oxygen.' },
          { at: 110, st: 'stable', text: 'Going to a surgical bed for the night. Her mother is with her, and a Somali interpreter is booked for discharge teaching.' },
        ],
        later: 'Home the next afternoon. The small checks finished early (bands, NPO, consent with an interpreter, a safe antibiotic timed to incision) are why she went on time.',
      }),
    },
    'medsurg-4w-3': {
      '433': (s, P, A, at) => ({
        unit: 'ICU', nurse: 'icu', emergent: true,
        event: `Massive PE: sudden chest pain and dyspnea, then hypotension and hypoxia. Rapid response at ${A.clock(at)}.`,
        extra: [{ label: P.hepAt !== null ? `Heparin started at ${A.clock(P.hepAt)}` : 'No anticoagulation was started on the floor', key: true }, { label: 'Metastatic pancreatic cancer on chemotherapy; goals of care not yet discussed', key: true }],
        course: [
          { at: 0, st: 'crit', text: 'Systolic 78 on norepinephrine, 15 L by non-rebreather. Bedside echo shows a strained right ventricle. Heparin bolus and drip running.' },
          { at: 45, st: 'crit', text: 'Interventional radiology is doing catheter-directed therapy. The ICU team and his oncologist are talking with him about goals of care.' },
          { at: 120, st: 'serious', text: 'Off norepinephrine. Down to 4 L. Right heart still strained but recovering.' },
        ],
        later: 'He survived the PE and went home on a blood thinner, with the hospice information he asked for. His warm, swollen, tender calf in the evening was the earliest warning.',
      }),
      '439': (s, P, A, at) => ({
        unit: 'ICU', nurse: 'icu', emergent: true,
        event: `Opioid-induced respiratory arrest on the hydromorphone PCA. Needed bag-mask breaths and naloxone. Rapid response at ${A.clock(at)}.`,
        extra: [{ label: 'Obstructive sleep apnea; no CPAP with her', key: true }, { label: 'Opioid-naive; PCA stopped', key: true }, { label: 'Her husband was pressing the PCA button for her (PCA by proxy)', key: true }],
        family: { name: 'Carl', rel: 'husband' },
        course: [
          { at: 0, st: 'crit', text: 'Two doses of naloxone and bag-mask breaths. Breathing on her own now, on a naloxone infusion. PCA discontinued.' },
          { at: 45, st: 'serious', text: 'RR 12, SpO₂ 94% on 2 L. Waking up. PaCO₂ 54.' },
          { at: 120, st: 'improving', text: 'Awake, asking what happened. The pain service switched her to a non-opioid plan with a low oral opioid dose, and she\'s on hospital CPAP to sleep.' },
        ],
        later: 'Home on day five. Sedation rises before breathing falls: a POSS of 3 means cut the opioid back and call; a 4 means stop it. Only the patient presses a PCA button.',
      }),
    },
    'peds-5s-1': {
      '501': (s, P, A, at) => (P.icu ? {
        unit: 'PICU', nurse: 'picu', emergent: true,
        event: `Apnea with bradycardia after hours of rising work of breathing. Needed stimulation and bag-mask breaths at ${A.clock(at)}.`,
        extra: [{ label: 'Mom (Lucía) speaks Spanish: use the interpreter line', key: true }, { label: 'When he last fed, and how (bottle or NG)', key: true }],
        course: [
          { at: 0, st: 'crit', text: 'Apnea with a heart rate in the 60s, reversed with bag-mask breaths. On CPAP with 60% oxygen; intubation equipment at the bedside.' },
          { at: 50, st: 'crit', text: 'A second apnea. Intubated.' },
          { at: 140, st: 'serious', text: 'Stable on the ventilator. Lucía has an interpreter and the chaplain with her.' },
        ],
        later: 'Intubated for three days, home on day nine. His work of breathing had been climbing for hours; escalating early is the difference between CPAP and a breathing tube.',
      } : {
        unit: 'PICU', nurse: 'picu', emergent: false,
        event: `Work of breathing still climbing on high-flow. ${P.escBy === 'call' ? 'Escalated by phone to the provider' : 'Rapid response'}, then to the PICU for CPAP at ${A.clock(at)}.`,
        extra: [{ label: 'Mom (Lucía) speaks Spanish: use the interpreter line', key: true }, { label: 'When he last fed, and how (bottle or NG)', key: true }],
        course: [
          { at: 0, st: 'serious', text: 'On CPAP 6 with 40% oxygen. Retractions easing. Lucía is at the bedside with a video interpreter.' },
          { at: 60, st: 'improving', text: `RR 48, down from ${Math.max(Math.round(40 + P.work * 12), ...P.vit.map((v) => v.RR))} on the floor. Slow NG feeds running. SpO₂ 95%.` },
          { at: 150, st: 'improving', text: 'Settled and sleeping. They\'ll try him off CPAP tomorrow.' },
        ],
        later: 'Two days on CPAP, home on day five. Bronchiolitis gets worse before it gets better; calling when the work of breathing climbed kept this a planned move instead of a rescue.',
      }),
      '503': (s, P, A, at) => ({
        unit: 'PICU', nurse: 'picu', emergent: true,
        event: `Acute chest syndrome: fever, chest pain and falling sats. Transferred to the PICU at ${A.clock(at)}.`,
        extra: [{ label: 'Sickle cell (HbSS) on hydroxyurea; acute chest once before, at 12', key: true }, { label: 'Morphine PCA: settings and last bolus', key: true }],
        course: [
          { at: 0, st: 'crit', text: 'SpO₂ 86% on 4 L. New right lower lobe infiltrate. Ceftriaxone and azithromycin in. Hematology is arranging an exchange transfusion.' },
          { at: 60, st: 'serious', text: 'On BiPAP. A simple transfusion is running while the exchange is set up.' },
          { at: 150, st: 'serious', text: 'Exchange transfusion done. SpO₂ 94% on BiPAP. Still in a lot of pain; the pain team is adjusting her PCA.' },
        ],
        later: 'Six days in the hospital, two in the PICU. Incentive spirometry, and taking new chest pain and fever seriously, are how acute chest gets caught on the floor.',
      }),
      '505': (s, P, A, at) => ({
        unit: 'PICU', nurse: 'picu', emergent: true,
        event: `Opioid overdose: morphine dosed to a charted weight of 31 kg; he weighs 14.1 kg. Unrousable with shallow breathing at ${A.clock(at)}.`,
        extra: [{ label: 'Weight error: 31 kg charted, 14.1 kg actual. Every weight-based order is wrong', key: true }],
        course: [
          { at: 0, st: 'crit', text: 'Naloxone given; now on a naloxone infusion. Needed a few bag-mask breaths. Weighed on arrival: 14.1 kg.' },
          { at: 50, st: 'serious', text: 'Breathing on his own, SpO₂ 96% on 1 L. Pharmacy is rewriting every weight-based order.' },
          { at: 140, st: 'improving', text: 'Awake and asking for his dinosaur. Naloxone infusion weaning.' },
        ],
        later: 'Back to himself by the next morning. The safety report traced 31 kg to an error carried forward from the ED. Weighing a child on arrival is the check that catches it.',
      }),
      '507': (s, P, A, at) => (P.icu ? {
        unit: 'PICU', nurse: 'picu', emergent: true,
        event: `Seizure on the floor at ${A.clock(at)}, after hours of vomiting, irritability and a high-pitched cry.`,
        extra: [{ label: P.bruises ? (P.cps ? 'Bruising found on skin assessment; CPS report made, provider not yet told' : 'Bruising found on skin assessment; not yet reported to the provider or CPS') : 'No full skin check was done on the floor', key: true }],
        course: [
          { at: 0, st: 'crit', text: 'Seized for seven minutes; stopped after lorazepam. Intubated for a head CT: bleeding over both sides of the brain.' },
          { at: 60, st: 'crit', text: 'Neurosurgery is taking him to the OR to relieve the pressure.' },
          { at: 150, st: 'serious', text: 'Back from the OR, sedated on the ventilator. The child abuse team is involved and CPS has been called.' },
        ],
        later: 'He survived, with a long road ahead: seizure medicine and therapy for months. Bruising on a baby who can\'t roll yet is a sentinel injury; reporting it is how the next injury is prevented.',
      } : {
        unit: 'PICU', nurse: 'picu', emergent: false,
        event: 'Head CT after you escalated your findings as possible abusive head trauma.',
        extra: [{ label: P.cps ? 'CPS report made. Social work and CPS set the visiting rules' : 'No CPS report yet: as a mandated reporter, you still need to make it', key: true }, { label: P.documented ? 'Your objective documentation: where the bruises are, fontanelle, head circumference' : 'Bruise locations and sizes (not yet charted)', key: true }],
        course: [
          { at: 0, st: 'serious', text: 'CT: an acute subdural bleed on the left, no midline shift. Neurosurgery is watching closely; no surgery for now.' },
          { at: 60, st: 'serious', text: 'Eye exam and skeletal survey done. The child abuse pediatrics team and CPS are involved. Neuro checks every hour.' },
          { at: 150, st: 'serious', text: 'Neuro checks stable. Social work has a safety plan in place; visits are supervised for now.' },
        ],
        later: `Noah recovered without surgery and went home under a CPS safety plan. ${P.cps ? 'The bruises you described plainly, and the report you made, started that protection.' : 'The report still had to be made; a nurse\'s duty to report doesn\'t pass to the team.'}`,
      }),
      '509': (s, P, A, at) => ({
        unit: 'PICU', nurse: 'picu', emergent: true,
        event: `Respiratory failure from status asthmaticus: silent chest and sleepy at ${A.clock(at)}.`,
        extra: [{ label: 'Albuterol and steroid: what she got, and when', key: true }, { label: 'Peanut-free diet', key: false }],
        course: [
          { at: 0, st: 'crit', text: 'On BiPAP with continuous albuterol. IV magnesium given. Blood gas pH 7.22, CO₂ 58: she\'s tiring.' },
          { at: 50, st: 'serious', text: 'Terbutaline infusion started. Air moving on both sides now. CO₂ 49.' },
          { at: 140, st: 'improving', text: 'Off BiPAP to high-flow. Asking Rachel to put on her show.' },
        ],
        later: 'Two days in the PICU. A quiet chest in a child who was wheezing is failure, not improvement; her sleepiness said so too.',
      }),
    },
    'psych-3e-1': {
      '301': (s, P, A, at) => ({
        unit: 'ED', nurse: 'ed', emergent: true,
        event: `Suicide attempt on the unit at ${A.clock(at)}. Found by staff; sent to the ED for medical evaluation.`,
        extra: [{ label: '5150 hold ends at 14:00: the paperwork goes with him, and psychiatry must act before it lapses', key: true }, { label: P.cssrs === 'high' ? 'High risk on the C-SSRS; attempted on the unit today; needs 1:1' : 'Attempted on the unit today; no structured risk screen done; needs 1:1', key: true }],
        course: [
          { at: 0, st: 'serious', text: 'Arrived in the ED. Awake and talking. On 1:1 with a sitter while he\'s evaluated.' },
          { at: 60, st: 'serious', text: 'Medically stable. Staying overnight for observation before he can come back to 3 East.' },
          { at: 160, st: 'stable', text: 'Resting. Still in the ED for observation; 3 East will take him back on 1:1 once he\'s medically cleared.' },
        ],
        later: 'He survived and came back to 3 East two days later, on 1:1. Sudden calm days after an overdose, belongings given away and a goodbye letter are warnings: precautions go up, not down.',
      }),
      '305': (s, P, A, at) => (P.icu ? {
        unit: 'ED', nurse: 'ed', emergent: true,
        event: `Seizure from lithium toxicity at ${A.clock(at)}. Sent to the ED.`,
        extra: [{ label: 'Lithium 2.1 this morning; hydrochlorothiazide and ibuprofen at home', key: true }],
        course: [
          { at: 0, st: 'crit', text: 'Seizure stopped with lorazepam. Lithium level 2.7. Emergent dialysis being set up.' },
          { at: 60, st: 'serious', text: 'On dialysis in the ICU.' },
          { at: 150, st: 'serious', text: 'Level 1.1 after dialysis, but it can rebound; a second run is likely. Confused but safe.' },
        ],
        later: 'Two dialysis runs and a week between the ICU and medicine. A coarse tremor, confusion and a level of 2.1 were the time to act.',
      } : {
        unit: 'Medicine', nurse: 'med', emergent: false,
        event: `Lithium toxicity, level 2.1 with symptoms. Transferred to medicine at ${A.clock(at)}.`,
        extra: [{ label: 'Lithium held. Hydrochlorothiazide and ibuprofen are the likely cause', key: true }, { label: 'Voluntary; psychiatry will follow on consult', key: false }],
        course: [
          { at: 0, st: 'serious', text: 'On medicine: IV fluids, lithium held, levels every 6 hours. Nephrology is weighing dialysis.' },
          { at: 90, st: 'improving', text: 'Lithium 1.7 and falling without dialysis. Tremor a little better.' },
          { at: 170, st: 'improving', text: 'Level 1.3. Asking when he can go back upstairs.' },
        ],
        later: 'Back on 3 East by day three, lithium restarted at a lower dose, hydrochlorothiazide and ibuprofen stopped. A new thiazide plus an NSAID is a classic setup for lithium toxicity.',
      }),
      '309': (s, P, A, at) => (P.icu ? {
        unit: 'ED', nurse: 'ed', emergent: true,
        event: `Seizure from water intoxication at ${A.clock(at)}. Sodium critically low. Sent to the ED.`,
        extra: [{ label: 'Drinks from any source (sink, shower); needs close watching', key: true }, { label: 'Clozapine for 8 years: lowers the seizure threshold, needs ANC monitoring, don\'t let doses lapse', key: true }],
        course: [
          { at: 0, st: 'crit', text: 'Seizure stopped with lorazepam. Sodium 119. 100 mL of 3% saline given.' },
          { at: 60, st: 'serious', text: 'Admitted to the ICU. Sodium 122. Checks every 2 hours so it doesn\'t correct too fast.' },
          { at: 150, st: 'serious', text: 'Sodium 124. Sleepy, but answering questions.' },
        ],
        later: 'A week in the hospital. She had seized from water intoxication before, in 2021; weights, watching her and a fluid restriction are what prevent the next one. Correction is capped at about 8 a day; once the drinking stops, polydipsic patients can overcorrect fast.',
      } : {
        unit: 'Medicine', nurse: 'med', emergent: false,
        event: `Hyponatremia, sodium ${Math.round(P.na)}, from psychogenic polydipsia. Transferred to medicine at ${A.clock(at)}.`,
        extra: [{ label: 'Drinks from any source (sink, shower); needs close watching', key: true }, { label: 'Clozapine for 8 years: lowers the seizure threshold, needs ANC monitoring, don\'t let doses lapse', key: true }],
        course: [
          { at: 0, st: 'serious', text: 'On medicine with a sitter. Fluid restricted. Sodium every 4 hours.' },
          { at: 90, st: 'improving', text: 'Sodium up 2. Correcting on target, not too fast.' },
          { at: 170, st: 'improving', text: 'Sodium 128. Calmer. Asked for ice chips; the sitter redirected her.' },
        ],
        later: 'Back on 3 East after three days with a normal sodium, daily weights and a fluid plan. Correcting slowly (about 8 a day at most) protects the brain; once the drinking stops, polydipsic patients can overcorrect fast. So does catching the drinking before a seizure.',
      }),
    },
  };
  AFTER['psych-4n-1'] = {
    '401': (s, P, A, at) => ({
      unit: 'Pediatrics', nurse: 'med', emergent: true,
      event: `Refeeding syndrome: phosphorus ${P.phos.toFixed(1)}, irregular pulse, leg weakness. Transferred to the pediatric floor at ${A.clock(at)} for a cardiac monitor and IV phosphorus.`,
      extra: [{ label: 'Anorexia nervosa, refeeding day 4: keep feeding, replace electrolytes, labs every 6 hours', key: true }, { label: 'Blind weights; supervised meals and an hour after; no exercise', key: true }],
      course: [
        { at: 0, st: 'serious', text: 'On a monitor. IV sodium phosphate running. Frequent PVCs, no runs.' },
        { at: 80, st: 'serious', text: 'Phosphorus 1.9. Fewer extra beats. Still weak standing.' },
        { at: 170, st: 'improving', text: 'Phosphorus 2.4. Ate most of a supervised snack, crying.' },
      ],
      later: 'Four days on pediatrics. Refeeding syndrome peaks in the first week: the protocol checks phosphorus, potassium and magnesium twice a day so the call comes before the heart notices.',
    }),
    '403': (s, P, A, at) => ({
      unit: 'ED', nurse: 'ed', emergent: true,
      event: `Self-harm on the unit at ${A.clock(at)}, deeper than this afternoon's. Sent to the ED for sutures.`,
      extra: [{ label: 'On self-harm precautions; second episode today; object was a piece of tray plastic', key: true }, { label: 'Uses Jordan, they/them; father does not know: do not share with family', key: true }],
      course: [
        { at: 0, st: 'stable', text: 'In the ED with a sitter. Laceration being irrigated.' },
        { at: 60, st: 'stable', text: 'Eleven sutures. Psychiatry will take them back to 4 North on 1:1.' },
      ],
      later: 'Back on 4 North that night on 1:1. A skin check at 15:00 and a room search would have found the object before it was used twice.',
    }),
    '405': (s, P, A, at) => ({
      unit: 'ED', nurse: 'ed', emergent: true,
      event: `Acute dystonia reaching his airway: stridor and a locked jaw at ${A.clock(at)}, after first-ever haloperidol at 14:30.`,
      extra: [{ label: 'Haloperidol 5 mg IM at 14:30, no anticholinergic given', key: true }, { label: 'Allergy: haloperidol (acute dystonia)', key: true }],
      course: [
        { at: 0, st: 'serious', text: 'IV diphenhydramine given. Stridor easing. Airway watched closely.' },
        { at: 60, st: 'stable', text: 'Neck and jaw loose. Drowsy. Scheduled anticholinergic started.' },
      ],
      later: 'Back on 4 North by morning. Dystonia after a first dose of haloperidol in a young male is common and reversible; left untreated, it can reach the airway.',
    }),
    '409': (s, P, A, at) => ({
      unit: 'Pediatrics', nurse: 'med', emergent: false,
      event: `Acetaminophen hepatotoxicity from an ingestion yesterday morning, not disclosed in the ED. AST 1,180, INR 1.6. Transferred at ${A.clock(at)} for IV N-acetylcysteine.`,
      extra: [{ label: 'On a 5585 for suicide risk: sitter at all times, belongings searched', key: true }, { label: 'Disclosed the ingestion to a peer and then to his nurse', key: false }],
      course: [
        { at: 0, st: 'serious', text: 'N-acetylcysteine running. Sitter at the bedside. Nauseous.' },
        { at: 90, st: 'serious', text: 'AST 1,420, INR 1.7. Still rising, as expected on the first day.' },
        { at: 170, st: 'improving', text: 'INR steady. Ate crackers. Asked if his mom could bring his bass.' },
      ],
      later: 'Three days on pediatrics until his liver tests turned around, then back to 4 North. A suicide attempt with an unknown ingestion should get an acetaminophen level, whatever the patient says.',
    }),
  };
  AFTER['ld-2s-1'] = {
    '221': (s, P, A, at) => ({
      unit: 'OR', nurse: 'or', emergent: true,
      event: `Emergency cesarean at ${A.clock(at)} for a Category III tracing: absent variability with recurrent late decelerations. Oxytocin induction for gestational hypertension; tachysystole on the strip from report.`,
      extra: [{ label: 'Oxytocin was still running at the time of the decision', key: true }, { label: 'Gestational hypertension, no severe features', key: true }, { label: 'First baby', key: false }],
      course: [
        { at: 0, st: 'crit', text: 'Spinal anesthesia, skin to delivery in 9 minutes. Baby girl, APGARs 3 and 7, cord arterial pH 7.09. To the NICU for observation.' },
        { at: 70, st: 'serious', text: 'Mother in recovery, BP 150/96. Baby on room air in the NICU, glucose normal, feeding planned.' },
        { at: 180, st: 'improving', text: 'Baby back in the room for skin-to-skin. Mother asking why the oxytocin "didn\'t just get turned down."' },
      ],
      later: 'Tachysystole (more than 5 contractions in 10 minutes, averaged over 30) cuts the time the placenta has to refill between contractions. With late decelerations, the first move is to stop or reduce the oxytocin, reposition, and give fluid, before the baby runs out of reserve.',
    }),
    '223': (s, P, A, at) => {
      const dt = P.ruptAt !== null && P.statAt !== null ? P.statAt - P.ruptAt : 99, fast = dt <= 5;
      return {
        unit: 'OR', nurse: 'or', emergent: true,
        event: `STAT cesarean at ${A.clock(at)} for uterine rupture during a trial of labor after cesarean: sudden constant pain, contractions stopped, loss of station, fetal bradycardia${fast ? '' : `, ${dt} minutes from the rupture to the STAT call`}.`,
        extra: [{ label: 'Prior low transverse cesarean (operative report confirmed)', key: true }, { label: 'Fetal bradycardia 70 since the rupture', key: true }, { label: 'Two large-bore IVs, type and crossmatch', key: !!P.ivs }],
        course: fast ? [
          { at: 0, st: 'crit', text: 'General anesthesia. Baby girl delivered from the abdomen 11 minutes after the rupture: APGARs 4 and 8, intubated briefly, extubated in the NICU.' },
          { at: 80, st: 'serious', text: 'Uterus repaired; 1,400 mL blood loss, two units given. Mother extubated, stable.' },
          { at: 200, st: 'improving', text: 'Baby on room air, cooling not needed. Mother asking to see her.' },
        ] : [
          { at: 0, st: 'crit', text: 'General anesthesia. Baby girl delivered limp: APGARs 1 and 3, resuscitated, cord pH 6.91. Therapeutic hypothermia started in the NICU.' },
          { at: 90, st: 'crit', text: 'Hysterectomy for uncontrolled bleeding. Massive transfusion protocol, six units.' },
          { at: 220, st: 'serious', text: 'Mother in the ICU, stable. Baby cooling for 72 hours; the outcome will take weeks to know.' },
        ],
        later: 'During a trial of labor after cesarean, sudden constant pain, contractions that stop, loss of station and fetal bradycardia mean uterine rupture until proven otherwise. Every minute from rupture to delivery matters; the call is STAT, to the OR.',
      };
    },
    '224': (s, P, A, at) => ({
      unit: 'OR', nurse: 'or', emergent: true,
      event: `Cesarean at ${A.clock(at)} for maternal sepsis from intraamniotic infection: temperature 39.4 °C, BP 88/46, fetal heart rate 180 with no variability. Ruptured 19 hours before arrival, GBS positive; fever since ${P.feverAt !== null ? A.clock(P.feverAt) : 'mid-morning'} without broad-spectrum antibiotics.`,
      extra: [{ label: 'No ampicillin or gentamicin given before sepsis', key: true }, { label: 'GBS positive; penicillin ' + (P.pcnAt !== null ? 'given' : 'never given'), key: true }],
      course: [
        { at: 0, st: 'crit', text: 'Antibiotics and a fluid bolus in the OR. Baby girl, APGARs 5 and 7, to the NICU for a sepsis evaluation and antibiotics.' },
        { at: 90, st: 'crit', text: 'Mother on norepinephrine in the ICU after delivery, lactate 4.1.' },
        { at: 220, st: 'serious', text: 'Pressor off. Baby\'s blood culture pending, on antibiotics for at least 48 hours.' },
      ],
      later: 'Fever in labor with maternal and fetal tachycardia and a tender uterus is intraamniotic infection until proven otherwise. Penicillin for GBS does not treat it: broad-spectrum antibiotics, the provider and the pediatric team, fast.',
    }),
  };
  AFTER['icu-3w-1'] = {
    '713': (s, P, A, at) => ({
      unit: 'OR', nurse: 'or', emergent: true,
      event: `Cardiac arrest from tamponade at ${A.clock(at)}: chest tubes clotted off at 08:15, then rising HR and CVP, a narrowing pressure and muffled heart sounds. Emergency resternotomy at the bedside, then the OR.`,
      extra: [{ label: 'CABG x3 yesterday: sternal wires, epicardial pacing wires', key: true }, { label: 'Chest tube output stopped at 08:15', key: true }, { label: 'Retired children\'s librarian', key: false }],
      course: [
        { at: 0, st: 'crit', text: 'Chest opened in the ICU, 600 mL of clot evacuated, rhythm back after 6 minutes. To the OR for bleeding control.' },
        { at: 90, st: 'crit', text: 'Back from the OR: a bleeding vein graft branch tied off. Two vasopressors, intubated, cooling not needed.' },
        { at: 200, st: 'serious', text: 'Pressors weaning. Sedation lightened; she squeezed her daughter\'s hand.' },
      ],
      later: 'Four extra ICU days and a slow recovery. After heart surgery, chest tube output that suddenly stops while the heart rate and CVP climb and the pressure narrows is tamponade until proven otherwise. It needs the surgeon at the bedside, not a note that the bleeding stopped.',
    }),
  };
  AFTER['stepdown-6e-1'] = {
    '601': (s, P, A, at) => ({
      unit: 'CCU', nurse: 'icu', emergent: true,
      event: `Flash pulmonary edema at ${A.clock(at)}: SpO₂ 82%, crackles to the apices. New EF 25% on this morning's echo; diltiazem ran until the rapid response.`,
      extra: [{ label: 'LVEF 25%: no diltiazem or verapamil', key: true }, { label: `Diltiazem ${P.dilt} mg/h until the rapid response`, key: true }, { label: 'On apixaban for new AF', key: false }],
      course: [
        { at: 0, st: 'crit', text: 'BiPAP 12/6, FiO₂ 60%. Furosemide 80 mg IV. Amiodarone bolus going in.' },
        { at: 70, st: 'serious', text: 'Off BiPAP to 4 L. 1.4 L of urine. Rate 108, still in AF.' },
        { at: 170, st: 'improving', text: 'Rate in the 90s on amiodarone. Asked whether her son can visit tonight.' },
      ],
      later: 'Two days in the CCU, a week in the hospital, home on rate control, a heart failure regimen and anticoagulation. Diltiazem is a negative inotrope; with an EF of 25% it made her failure worse. The echo was the cue.',
    }),
    '603': (s, P, A, at) => ({
      unit: 'IR', nurse: 'icu', emergent: true,
      event: `Hemorrhagic shock from a right retroperitoneal bleed at ${A.clock(at)}: BP 72/40, HR 132. Femoral access at 04:30 with a high first stick.`,
      extra: [{ label: 'Drug-eluting stent to the RCA at 04:30: aspirin and ticagrelor', key: true }, { label: 'Groin site soft with no hematoma: the bleed is behind it', key: true }, { label: 'Drives the 51 bus', key: false }],
      course: [
        { at: 0, st: 'crit', text: 'Two units of blood running. CT: large right retroperitoneal hematoma with active extravasation.' },
        { at: 60, st: 'serious', text: 'Covered stent placed in the right external iliac. Pressure 104/62 after a third unit.' },
        { at: 150, st: 'improving', text: 'In the CCU, HR 88. Asked whether the bus company will hold his route.' },
      ],
      later: 'Four days in the hospital and three units of blood. A retroperitoneal bleed after femoral access shows up as back or flank pain, a rising heart rate and a falling pressure, usually with a normal-looking groin.',
    }),
    '605': (s, P, A, at) => ({
      unit: 'IR', nurse: 'icu', emergent: true,
      event: `Acute left lower-limb ischemia at ${A.clock(at)}: white, pulseless foot. Platelets 98 from 230 on day 5 of heparin; heparin still running.`,
      extra: [{ label: 'Suspected HIT: no heparin of any kind, including flushes', key: true }, { label: 'Bilateral PEs, needs a non-heparin anticoagulant', key: true }],
      course: [
        { at: 0, st: 'serious', text: 'In IR. Heparin stopped, argatroban started. Catheter-directed thrombectomy of the popliteal artery.' },
        { at: 80, st: 'serious', text: 'Foot pink, pulses by Doppler. PF4 antibody strongly positive.' },
        { at: 170, st: 'improving', text: 'Back on the floor tomorrow. Asked for her crossword.' },
      ],
      later: 'She kept her foot. Heparin went on her allergy list for life. HIT causes clots, not bleeding: a platelet drop of more than half, 5 to 10 days into heparin, means stop all heparin and start something else.',
    }),
    '607': (s, P, A, at) => ({
      unit: 'CCU', nurse: 'icu', emergent: true,
      event: `Torsades de pointes at ${A.clock(at)}, pulseless, defibrillated once. QTc ${Math.round(452 + (4 - P.kv) * 45 + (2.1 - P.mg) * 45 + (P.cital ? 25 : 0) + (P.ond ? 15 : 0))}, K ${P.kv.toFixed(1)}, Mg ${P.mg.toFixed(1)}.`,
      extra: [{ label: 'No QT-prolonging drugs: citalopram, ondansetron', key: true }, { label: 'Keep K over 4 and Mg over 2', key: true }],
      course: [
        { at: 0, st: 'crit', text: 'Magnesium 2 g given in the code, another 2 g running. Potassium being replaced IV.' },
        { at: 90, st: 'serious', text: 'No more runs. QTc 488. Temporary pacing pads on.' },
        { at: 170, st: 'improving', text: 'Sang a few bars for the CCU nurse. QTc 470.' },
      ],
      later: 'Three days in the CCU. Low potassium and magnesium, a doubled SSRI and an antiemetic each lengthened his QT a little; together they were enough. The electrolyte protocol and two held doses were all available at 09:00.',
    }),
  };
  AFTER['ob-2n-1'] = {
    '212': (s, P, A, at) => ({
      unit: 'L&D', nurse: 'ld', emergent: true,
      event: `Postpartum hemorrhage from uterine atony, QBL over 1,600 mL at ${A.clock(at)}.${P.bladder ? ' Bladder still full, never emptied.' : ''}`,
      extra: [{ label: 'Asthma: no carboprost', key: true }, { label: [P.methAt !== null && `methylergonovine ${A.clock(P.methAt)}`, P.txaAt !== null && `TXA ${A.clock(P.txaAt)}`, P.misoAt !== null && `misoprostol ${A.clock(P.misoAt)}`, P.oxyUp && 'oxytocin at 250 mL/h'].filter(Boolean).join(', ') || 'No uterotonics given beyond the oxytocin infusion', key: true }, { label: 'Baby boy rooming in, breastfeeding', key: false }],
      family: { name: 'Andre', rel: 'husband', phone: true },
      course: [
        { at: 0, st: 'crit', text: 'In the L&D OR. Bimanual massage, bladder catheterized (900 mL), a Bakri balloon placed. Two units of blood running. Fibrinogen 180.' },
        { at: 50, st: 'serious', text: 'Bleeding slowed with the balloon. Cryoprecipitate given. HR 104, BP 102/60. Total blood loss 2,300 mL.' },
        { at: 130, st: 'improving', text: 'Stable. Balloon stays in for 12 hours. Desmond and the baby are with her; she\'s breastfeeding in the recovery bay.' },
      ],
      later: 'Balloon out the next morning, home on day three with iron and a hemoglobin of 7.6. Atony is the most common cause of postpartum hemorrhage, and a full bladder is one of its most fixable causes. Feeling the fundus and weighing the pads finds it early.',
    }),
    '214': (s, P, A, at) => ({
      unit: 'ICU', nurse: 'icu', emergent: true,
      event: `Respiratory depression from magnesium toxicity at ${A.clock(at)}: RR 6, unresponsive. Magnesium about ${P.mg.toFixed(1)} with oliguria since 04:00.`,
      extra: [{ label: 'Preeclampsia with severe features; seizure prophylaxis still needed once the level falls', key: true }, { label: 'Creatinine 1.4 and rising; urine under 30 mL/h since 04:00', key: true }, { label: P.firstBpMed !== null ? `Severe BP treated at ${A.clock(P.firstBpMed)}` : (P.sevAt !== null ? 'Severe-range BP not yet treated' : 'BP 140s–150s/90s'), key: P.sevAt !== null }],
      family: { name: 'Kainoa', rel: 'partner' },
      course: [
        { at: 0, st: 'crit', text: 'Bag-mask breaths, calcium gluconate 1 g given twice. Breathing on her own again, RR 12. Magnesium off. Level 13.4.' },
        { at: 60, st: 'serious', text: 'RR 14, more awake. Furosemide given; urine picking up. Level 10.8. Nephrology consulted.' },
        { at: 150, st: 'improving', text: 'Level 7.0. Awake and asking for Mālia. Restarting magnesium at 1 g/h for the rest of her 24 hours, with hourly checks.' },
      ],
      later: 'Two days in the ICU, home on day five with a blood pressure cuff and a plan for daily checks. Magnesium leaves the body through the kidneys; when the urine slows, the level climbs. Reflexes fade before breathing does, which is why the checks are hourly.',
    }),
    '216': (s, P, A, at) => (P.nicu ? {
      unit: 'NICU', nurse: 'nicu', emergent: true,
      event: `Hypoglycemic seizure at ${A.clock(at)}, glucose 18. Infant of a diabetic mother, last fed 04:00${P.checks.length ? '' : ', no glucose this shift'}.`,
      extra: [{ label: `Glucose checks this shift: ${(P.checkVals || []).join(', ') || 'none'}`, key: true }, { label: 'Mother wants exclusive breastfeeding; pumping', key: true }],
      family: { name: 'Bảo', rel: 'father', phone: true },
      course: [
        { at: 0, st: 'crit', text: 'D10 bolus and an infusion through a UVC. Seizure stopped. Glucose 52 at 30 minutes. Phenobarbital given once.' },
        { at: 60, st: 'serious', text: 'Glucose 60s on the infusion. No more seizures. An EEG and head MRI are planned.' },
        { at: 150, st: 'serious', text: 'Stable. Linh is with him, pumping. Neurology will follow up on the MRI.' },
      ],
      later: 'Seven days in the NICU. His MRI showed changes in the back of the brain typical of neonatal hypoglycemia; he\'ll be followed for development. The glucose check before a feed is how the low is found before the brain is hurt.',
    } : {
      unit: 'NICU', nurse: 'nicu', emergent: false, push: 45,
      event: `To the NICU for IV dextrose before any seizure: ${P.symAt !== null ? 'jittery' : 'glucose under 45 after gel'} at ${A.clock(at)}.`,
      extra: [{ label: `Glucose checks: ${(P.checkVals || []).join(', ')}`, key: true }, { label: `Dextrose gel ×${P.gels.length}`, key: true }, { label: 'Mother wants exclusive breastfeeding; donor milk okay', key: true }],
      family: { name: 'Bảo', rel: 'father', phone: true },
      course: [
        { at: 0, st: 'serious', text: 'Peripheral IV in, D10 at 80 mL/kg/day. Glucose 58 at 30 minutes. No more jitteriness.' },
        { at: 70, st: 'improving', text: 'Glucose 60s. Breastfeeding in the NICU with Linh. Weaning the infusion as feeds improve.' },
        { at: 150, st: 'stable', text: 'Infusion off overnight; glucoses stable on feeds. Back to 2 North with Linh tomorrow.' },
      ],
      later: 'Two nights in the NICU, then home breastfeeding. Escalating when he was symptomatic is what kept this from becoming a seizure.',
    }),
  };
  AFTER['ed-podb-1'] = {
    '21': (s, P, A, at) => ({
      unit: 'Cath lab', nurse: 'cath', emergent: !!P.arrest, push: 40,
      event: P.arrest ? `VF arrest at ${A.clock(at)} from an inferior STEMI; ROSC after three shocks.` : `Inferior STEMI with right ventricular involvement; cath lab activated at ${A.clock(P.called)}.`,
      extra: [{ label: P.asa !== null ? `Aspirin 324 mg at ${A.clock(P.asa)}` : 'No aspirin given in the ED', key: true }, { label: P.hep !== null ? `Heparin bolus at ${A.clock(P.hep)}` : 'No heparin given yet', key: true }, { label: 'RV involvement: no nitrates, preload-dependent', key: P.v4r !== null }],
      family: { name: 'Bev', rel: 'sister' },
      course: [
        { at: 0, st: P.arrest ? 'crit' : 'serious', text: 'On the table. Right coronary artery 100% occluded proximally. Wire across.' },
        { at: 40, st: 'serious', text: 'Drug-eluting stent to the proximal RCA, flow restored. Pressure held with fluids. To the CCU.' },
        { at: 140, st: 'improving', text: 'In the CCU, pain-free. Heart rate back to the 70s. Echo shows the right ventricle recovering.' },
      ],
      later: P.arrest ? 'She survived with a weaker heart than she needed to have. Diabetic women often present with fatigue, nausea and "indigestion"; a repeat ECG is how the evolving MI is caught before it fibrillates.' : 'Home on day three. In an atypical presentation, serial ECGs and a nurse who says "STEMI" out loud are how door-to-balloon stays under 90 minutes.',
    }),
    '22': (s, P, A, at) => (P.ich ? {
      unit: 'Neuro ICU', nurse: 'icu', emergent: true,
      event: `Symptomatic intracranial hemorrhage after tenecteplase at ${A.clock(P.tpaGiven)}. True last known well 10:00.`,
      extra: [{ label: 'Tenecteplase given; cryoprecipitate and tranexamic acid ordered', key: true }, { label: 'Last known well 10:00, found at 14:30', key: true }],
      family: { name: 'Joan', rel: 'wife' },
      course: [
        { at: 0, st: 'crit', text: 'Intubated. Cryoprecipitate and TXA running. Repeat CT: 40 mL hemorrhage in the stroke territory.' },
        { at: 90, st: 'crit', text: 'External ventricular drain placed. Pupils equal now.' },
        { at: 200, st: 'serious', text: 'Stable but unresponsive off sedation. Family meeting tomorrow.' },
      ],
      later: 'Thrombolytics (tenecteplase or alteplase) work up to 4.5 hours after a patient was last known well, not after they were found. Outside that window the bleeding risk outweighs the benefit, and a large-vessel clot goes to thrombectomy instead.',
    } : {
      unit: 'IR', nurse: 'icu', emergent: false, push: 40,
      event: `Left M1 occlusion; last known well 10:00, so no thrombolytic. To neurointerventional radiology for thrombectomy.`,
      extra: [{ label: 'Last known well 10:00, found at 14:30', key: true }, { label: 'NPO; failed swallow screen' + (P.swallow ? '' : ' not yet done'), key: true }, { label: `BP goal 185/110 or less${P.lab !== null ? '; labetalol given' : ''}`, key: true }],
      family: { name: 'Joan', rel: 'wife' },
      course: [
        { at: 0, st: 'serious', text: 'Under conscious sedation. Clot retrieved in one pass, full flow restored to the left middle cerebral artery.' },
        { at: 60, st: 'serious', text: 'In the neuro ICU. Moving his right arm against gravity. Said "yes" and "Joan."' },
        { at: 180, st: 'improving', text: 'NIHSS 5, down from 14. Swallow evaluation tomorrow.' },
      ],
      later: 'Thrombectomy works up to 24 hours from last known well for the right patient. One question to his wife, "When was he last normal?", moved him from the wrong treatment to the right one.',
    }),
    '23': (s, P, A, at) => ({
      unit: 'OR', nurse: 'or', emergent: !!P.rupture, push: 50,
      event: P.rupture ? `Ruptured ectopic, hemorrhagic shock at ${A.clock(at)}; massive transfusion protocol.` : `Possible ruptured ectopic, free fluid on bedside ultrasound. To the OR for laparoscopy.`,
      extra: [{ label: 'O negative: Rh immune globulin after surgery', key: true }, { label: P.disclosed ? 'Disclosed partner violence; boyfriend not to be given information' : 'Partner present and controlling; safety not yet assessed', key: true }],
      family: { name: 'Her mother', rel: 'mother', phone: true },
      course: [
        { at: 0, st: P.rupture ? 'crit' : 'surgery', text: P.rupture ? 'In the OR, two units in. Left tubal rupture, 1.8 L of blood in the abdomen.' : 'Laparoscopy: left tubal ectopic, ruptured, 600 mL in the pelvis. Salpingectomy.' },
        { at: 60, st: 'serious', text: 'In recovery. Hemoglobin 9.2. Rh immune globulin given.' },
        { at: 150, st: 'stable', text: 'On the gynecology floor with her mother. Social work and an advocate have met with her.' },
      ],
      later: 'A positive pregnancy test with abdominal pain is an ectopic until an ultrasound shows a pregnancy in the uterus. Shoulder pain and a climbing heart rate mean it is bleeding.',
    }),
    '24': (s, P, A, at) => ({
      unit: 'ICU', nurse: 'icu', emergent: true,
      event: `Anaphylaxis with airway obstruction at ${A.clock(at)}; intubated. Epinephrine ${P.epi.length ? 'first given at ' + A.clock(P.epi[0]) : 'not given before the airway closed'}.`,
      extra: [{ label: 'Peanut anaphylaxis; diphenhydramine from EMS, no epinephrine', key: true }, { label: 'Mild asthma', key: false }],
      family: { name: 'His mother', rel: 'mother', phone: true },
      course: [
        { at: 0, st: 'crit', text: 'Intubated with a small tube through a swollen airway. Epinephrine infusion running.' },
        { at: 90, st: 'serious', text: 'Epinephrine weaned off. Swelling going down; cuff leak test tomorrow.' },
        { at: 200, st: 'improving', text: 'Cuff leak present. Plan to extubate in the morning.' },
      ],
      later: 'Epinephrine IM is the first and most important treatment for anaphylaxis. Antihistamines treat the hives, not the airway or the shock.',
    }),
    '25': (s, P, A, at) => ({
      unit: 'OR', nurse: 'or', emergent: true,
      event: `Expanding left subdural, GCS ${P.bleed >= 1 ? 7 : 11} with a dilated left pupil at ${A.clock(at)}. INR 3.6 on warfarin${P.pcc !== null ? '; PCC given at ' + A.clock(P.pcc) : ', not reversed'}.`,
      extra: [{ label: 'Warfarin for AF; INR 3.6', key: true }, { label: P.warf === 'given' ? 'Warfarin 5 mg given at 18:00' : 'Warfarin held tonight', key: true }],
      family: { name: 'Karen', rel: 'daughter' },
      course: [
        { at: 0, st: 'crit', text: 'Emergency craniotomy. PCC and vitamin K given in the OR.' },
        { at: 90, st: 'crit', text: 'Hematoma evacuated. To the neuro ICU, sedated on the ventilator.' },
        { at: 200, st: 'serious', text: 'Pupils equal. Following simple commands with his left hand.' },
      ],
      later: 'Older patients on anticoagulants can bleed slowly for hours after a head strike while looking fine. Scheduled neuro checks find the decline, and fast reversal stops it.',
    }),
  };
  function spec(s, A, d, P, at) {
    const f = (AFTER[s.caseId] || {})[d.id];
    const base = f ? f(s, P, A, at) : { unit: P.icu ? 'ICU' : 'another unit', nurse: 'icu', emergent: !!P.icu, event: P.goneText || 'Transferred off the unit.', course: [{ at: 0, st: P.icu ? 'crit' : 'stable', text: P.goneText || 'Transferred.' }], later: '' };
    return Object.assign({ handoff: true, note: true, push: 50, extra: [], family: null }, base);
  }
  const outOf = (P) => P.icu || P.gone;
  const where = (u) => ({ 'Cath lab': 'the cath lab', OR: 'the OR', 'Neuro ICU': 'the neuro ICU', 'L&D': 'Labor and Delivery', NICU: 'the NICU', CCU: 'the CCU', IR: 'interventional radiology', ICU: 'the ICU', PICU: 'the PICU', ED: 'the ED', Medicine: 'the medicine floor', Pediatrics: 'the pediatric floor', PACU: 'PACU' }[u] || 'the ' + u);
  function entryAt(P, dt) { const c = P.out.spec.course; let i = 0; c.forEach((e, k) => { if (e.at <= dt) i = k; }); return i; }

  /* ---------- unit flavor: rounding, call lights, report noise ---------- */
  const NEEDS = {
    med: [
      { id: 'bath', text: 'needs help to the bathroom', cna: true, fix: 'Walked to the bathroom and back. Bed low, call light in reach.', ok: (d) => !/bed rest/i.test(d.mobility) },
      { id: 'water', text: 'wants fresh ice water', cna: true, fix: 'Fresh ice water at the bedside.', ok: (d) => !/NPO|restrict|clear/i.test(d.diet) },
      { id: 'turn', text: 'is uncomfortable and wants help changing position', cna: true, fix: 'Repositioned with pillows; heels floated.' },
      { id: 'cold', text: 'is cold and wants another blanket', cna: true, fix: 'Warm blanket on.', ok: (d, P, v) => v.T < 38 },
      { id: 'pump', text: 'says the IV pump is beeping', cna: false, fix: 'Pump alarm: occlusion. The tubing was kinked under the arm. Straightened it, the line flushes easily, infusion restarted.', ok: (d, P, v, f) => f.iv === 'running' },
      { id: 'pain', text: 'is asking for something for pain', cna: false, fix: (v) => `Rates pain ${v.pain} out of 10 and wants medicine. Check the MAR for what's ordered and when it was last given.`, ok: (d, P, v) => v.pain >= 4 },
    ],
    psych: [
      { id: 'phone', text: 'to use the patient phone', cna: true, fix: 'Set up on the patient phone in the dayroom, within staff sight.' },
      { id: 'snack', text: 'for a snack', cna: true, fix: 'Crackers and cheese from the unit fridge.', ok: (d, P) => !P.restricted },
      { id: 'talk', text: 'to talk with a nurse', cna: false, fix: 'You sit down for five minutes. Mostly they want to know when the doctor is coming and when they can leave. You say the team meets after rounds and you\'ll pass the question on.' },
      { id: 'anx', text: 'for something to help with anxiety', cna: false, fix: 'Talked it through first, then checked the MAR for what\'s ordered and when it was last given.' },
      { id: 'laundry', text: 'for help with laundry', cna: true, fix: 'Laundry started; clothes back by lunch.' },
    ],
    ob: [
      { id: 'pads', text: 'needs more pads and a fresh peri bottle', cna: true, fix: 'Pads, mesh underwear, ice pack and a filled peri bottle at the bedside.', ok: (d) => !d.newborn },
      { id: 'latch', text: 'wants help getting the baby to latch', cna: false, fix: 'You watch a feed: wide mouth, chin in, lips flanged out. Audible swallows after a minute. Showed her the football hold to keep off her incision or stitches.', ok: (d) => !d.newborn || !!d.family },
      { id: 'water', text: 'wants a big cup of ice water', cna: true, fix: 'Fresh ice water at the bedside. Breastfeeding makes you thirsty.', ok: (d) => !d.newborn && !/NPO|restrict|clear/i.test(d.diet) },
      { id: 'bath', text: 'needs help to the bathroom', cna: true, fix: 'Walked to the bathroom with help, peri bottle used, pad changed. Back in bed with the rail up and the call light in reach.', ok: (d) => !d.newborn && !/bed rest/i.test(d.mobility) },
      { id: 'pain', text: 'is asking for something for pain', cna: false, fix: (v) => `Rates pain ${v.pain} out of 10 and wants medicine. Check the MAR for what's ordered and when it was last given.`, ok: (d, P, v) => !d.newborn && v.pain >= 3 },
      { id: 'diaper', text: 'needs diapers and wants help with the first bath', cna: true, fix: 'Diapers, wipes and a bath demo at the bedside. Cord left dry.', ok: (d) => !!d.newborn },
    ],
    ld: [
      { id: 'ice', text: 'is asking for ice chips', cna: true, fix: 'Ice chips at the bedside. Clear liquids and ice chips are fine in labor for most women; check the diet order first.', ok: (d) => !/NPO/i.test(d.diet) },
      { id: 'position', text: 'wants help changing position', cna: true, fix: 'Turned to her other side with the peanut ball between her knees. Changing position every 30 to 60 minutes helps the baby rotate and descend.' },
      { id: 'monitor', text: 'says the monitor keeps losing the baby\'s heartbeat', cna: false, fix: 'Repositioned the ultrasound transducer, confirmed the fetal heart rate is distinct from her pulse, and watched the strip until it was continuous again.' },
      { id: 'pain', text: 'is asking for something for the pain', cna: false, fix: (v) => `Rates pain ${v.pain} out of 10 with contractions. Talked through her options and her birth plan, then checked what's ordered.`, ok: (d, P, v) => v.pain >= 4 },
      { id: 'partner', text: 'and her partner want to know how much longer', cna: false, fix: 'Gave an honest answer: where she is, how labor usually goes from here, and what would change the plan.' },
      { id: 'cold', text: 'is shaking and asks for a warm blanket', cna: true, fix: 'Warm blanket. Shaking is common in transition and after an epidural; you checked her temperature too.' },
    ],
    ed: [
      { id: 'water', text: 'is asking for something to drink', cna: false, fix: 'Checked the orders first: still waiting on results, so nothing by mouth yet. Explained why and offered a mouth swab.', ok: (d) => !d.newborn },
      { id: 'cold', text: 'is cold and wants a warm blanket', cna: true, fix: 'Warm blanket from the warmer.', ok: (d, P, v) => v.T < 38 },
      { id: 'wait', text: 'wants to know how much longer', cna: false, fix: 'You give a straight answer: what you\'re waiting on, roughly how long, and what happens next. "Nobody\'s told me anything" is the most common ED complaint.' },
      { id: 'bath', text: 'needs to use the bathroom', cna: true, fix: 'Helped to the bathroom and back, call light in reach.', ok: (d) => !/bed rest|flat|stretcher/i.test(d.mobility) },
      { id: 'pump', text: 'says the IV pump is beeping', cna: false, fix: 'Pump alarm: air in line. Cleared it, the site looks good, infusion restarted.', ok: (d, P, v, f) => f.iv === 'running' },
    ],
    peds: [
      { id: 'diaper', text: 'needs more diapers and wipes', cna: true, fix: 'Diapers and wipes at the bedside, and a scale to weigh diapers for output.', ok: (d) => ageNum(d) < 3 },
      { id: 'pump', text: 'says the IV pump is beeping', cna: false, fix: 'Pump alarm: occlusion. The tubing was pinched in the crib rail. Freed it, the site looks good, infusion restarted.', ok: (d, P, v, f) => f.iv === 'running' },
      { id: 'pain', text: 'says their child needs something for pain', cna: false, fix: (v, d) => `Pain ${v.pain} out of 10 on the ${ageNum(d) >= 8 ? 'numeric' : 'faces'} scale. Check the MAR for what's ordered and when it was last given.`, ok: (d, P, v) => v.pain >= 4 && ageNum(d) >= 3 },
      { id: 'play', text: 'says their child is bored and wants something to do', cna: true, fix: 'Games and a movie from child life.', ok: (d) => ageNum(d) >= 3 },
      { id: 'break', text: 'asks if someone can sit with their child while they grab food', cna: true, fix: 'Sat in for fifteen minutes while the parent got something to eat.', ok: (d) => !!d.family && d.family.mode === 'bedside' },
      { id: 'cold', text: 'wants a warm blanket', cna: true, fix: 'Warm blanket from the warmer.' },
    ],
  };
  const NOISE = {
    med: ['What they had for breakfast', 'Every vital sign since the start of the shift, in order', 'That the TV remote doesn\'t work', 'The last nurse\'s opinion of the family'],
    psych: ['What was on TV in the dayroom', 'Every q15 check since the start of the shift, one by one', 'What they ate for breakfast', 'That they seem "manipulative"'],
    ob: ['What she named the baby', 'Every vital sign since delivery, in order', 'How many visitors came last night', 'The last nurse\'s opinion of her birth plan'],
    ld: ['Her playlist for the birth', 'Every contraction since midnight, one by one', 'How many visitors are in the waiting room', 'The last nurse\'s opinion of her birth plan'],
    ed: ['How long they waited in the lobby', 'Every vital sign since arrival, in order', 'That the TV in the bay is broken', 'A guess about whether they\'re drug-seeking'],
    peds: ['Their favorite cartoon', 'Every vital sign since the start of the shift, in order', 'Which popsicle flavor they picked', 'A guess about how the parents get along'],
  };
  const NOBELL = { 'peds-5s-1': ['507'], 'psych-3e-1': ['301'], 'psych-4n-1': ['409'] };
  const noBell = (s, d, P) => (NOBELL[s.caseId] || []).includes(d.id) || P.oneToOne || P.secluded || P.restrained || P.callLight;
  const touched = (P) => Math.max(P.touchAt === undefined ? -999 : P.touchAt, P.roundAt === undefined ? -999 : P.roundAt, -30);
  const cnaKey = (c) => c.cna || 'luis';
  const bellDone = (s, pid) => s.inbox.forEach((m) => { if (m.bell && m.pid === pid) m.done = true; });

  function roundText(c, d, P, A) {
    const v = A.vitals(d.id), f = d.scene(A.s, P, A), k = kindOf(c);
    if (k === 'psych') return `Checked in face to face; ${d.short} is ${v.pain >= 4 ? 'uncomfortable, pain ' + v.pain + ' out of 10' : 'up and settled'}. Room scanned: nothing new that could be used for harm. Offered ${P.restricted ? 'a chance to talk' : 'a snack and a chance to talk'}.`;
    if (k === 'ob' && d.newborn) return `Swaddled skin to skin or in the bassinet, breathing easy, color pink. Diaper checked, last feed noted, ID band matches ${d.family ? d.family.name + '\'s' : 'the mother\'s'} band, security tag on.`;
    if (k === 'ob') return `Pain ${v.pain} out of 10. Fundus checked by feel through the blanket, pad looked at, bathroom offered, water and call light in reach. The baby is asleep in the bassinet beside her, on their back.`;
    if (k === 'ld') return `Pain ${v.pain} out of 10 with contractions. Strip watched through a few contractions, position changed, ice chips and the call light in reach, partner offered water.`;
    if (k === 'peds') return `Rails up, ${f.iv === 'running' ? 'IV site clean and the pump running, ' : ''}${ageNum(d) < 3 ? 'diaper checked' : 'bathroom offered'}, ${d.family ? 'parent offered a break and water' : 'call light in reach'}. Pain ${v.pain} out of 10.`;
    return `Pain ${v.pain} out of 10. Repositioned, offered the bathroom${/NPO|restrict/i.test(d.diet) ? '' : ' and water'}, call light and table within reach. Bed low and locked.`;
  }

  /* ---------- per-minute: transfers, updates, call lights ---------- */
  function tick(s, A, c) {
    const k = kindOf(c);
    c.patients.forEach((d) => {
      const P = s.p[d.id]; if (!P || (d.arrives && !P.arrived)) return;
      // Transfer out: start following them.
      if (outOf(P) && !P.out) { P.out = { at: s.t, spec: spec(s, A, d, P, s.t), known: 0, handoff: null, note: null, fam: null, calls: [] }; P.bell = null; }
      if (P.out) {
        const o = P.out, dt = s.t - o.at, pushAt = o.spec.push;
        if (!o.pushed && dt >= pushAt && s.t < c.length - 3) {
          o.pushed = true; const i = entryAt(P, dt);
          if (i > o.known) { o.known = i; const e = o.spec.course[i]; A.msg({ from: o.spec.nurse, pid: d.id, away: true, text: `Update on ${d.short} from ${where(o.spec.unit)}: ${e.text}`, replies: [{ label: 'Open follow-up', act: 'away', pid: d.id }] }); }
        }
        return;
      }
      // Call lights: a patient nobody has checked on in a while asks for something.
      if (P.bell) {
        const b = P.bell;
        if (b.cnaAt !== undefined && b.cnaAt !== null && s.t >= b.cnaAt) { P.bell = null; bellDone(s, d.id); P.touchAt = s.t; A.msg({ from: cnaKey(c), pid: d.id, text: `Got ${k === 'psych' ? d.short + '\'s request' : d.room + '\'s call light'}: ${typeof b.fix === 'string' ? b.fix.charAt(0).toLowerCase() + b.fix.slice(1) : 'all set.'}` }); A.log(d.id, `${(c.staff[cnaKey(c)] || {}).name || 'CNA'} answered ${b.who}'s ${k === 'psych' ? 'request' : 'call light'}. ${b.fix}`, 'act'); return; }
        if (!b.cnaAt && s.t - b.at >= 25) {
          const busy = c.patients.some((x) => x.id !== d.id && s.p[x.id] && !outOf(s.p[x.id]) && (!x.arrives || s.p[x.id].arrived) && x.status(s, s.p[x.id], A) === 'urgent');
          if (busy) A.judge(`${d.id}-bell-${b.at}`, 'priority', 0, `${k === 'psych' ? d.short + '\'s request' : d.room + '\'s call light'} waited 25 minutes while you handled an emergency.`, `Right priority. A request for ${b.id === 'pain' || b.id === 'pump' || b.id === 'anx' || b.id === 'talk' ? 'something only a nurse can do can still get a quick "I\'ll be there in ten" from your aide' : 'this is exactly what your aide can take while you stay with the sicker patient'}.`, d.id);
          else if (k === 'psych') A.judge(`${d.id}-bell-${b.at}`, 'priority', -1, `${d.short} waited 25 minutes at the station with no answer.`, 'A patient asking for help is also giving you a chance to assess. Answer it, or send someone who can.', d.id);
          else A.judge(`${d.id}-bell-${b.at}`, 'priority', -1, `${d.room}'s call light rang for 25 minutes with no answer.`, 'A call light is a patient asking for help. Answer it, or send someone who can. Patients who wait get up on their own, and falls start that way.', d.id);
          P.bell = null; bellDone(s, d.id); P.touchAt = s.t; A.msg({ from: aideAway(s, c) ? 'nova' : cnaKey(c), pid: d.id, text: `I finally got to ${k === 'psych' ? d.short : d.room + '\'s call light'}. ${d.short} had been waiting a long time.` });
        }
        return;
      }
      if (noBell(s, d, P) || s.t < 60 || s.t > c.length - 20) return;
      if (s.t - touched(P) < 80 || s.t - (P.lastBell === undefined ? -999 : P.lastBell) < 70) return;
      if (s.t - (s.lastBell === undefined ? -999 : s.lastBell) < 22) return;
      if (d.status(s, P, A) === 'urgent') return;
      const v = A.vitals(d.id), f = d.scene(s, P, A);
      const opts = NEEDS[k].filter((n) => !n.ok || n.ok(d, P, v, f)); if (!opts.length) return;
      const n = opts[seed(d.id + ':' + Math.floor(s.t / 10)) % opts.length];
      const fix = typeof n.fix === 'function' ? n.fix(v, d) : n.fix;
      const who = (k === 'peds' || d.newborn) && d.family ? d.family.name : d.short;
      P.bell = { at: s.t, id: n.id, text: n.text, cna: n.cna, fix, who }; P.lastBell = s.t; s.lastBell = s.t;
      const text = k === 'psych' ? `${d.short} is at the nurses' station asking ${n.text}.` : `Call light in ${d.room}: ${who} ${n.text}.`;
      const cn = (c.staff[cnaKey(c)] || {}).name || 'your aide', gone = aideAway(s, c);
      A.msg({ from: gone ? 'nova' : cnaKey(c), pid: d.id, bell: true, text, replies: gone ? [{ label: `I'll go`, act: 'goto', pid: d.id }] : [{ label: `I'll go`, act: 'goto', pid: d.id }, { label: `${cn}, can you take it?`, act: 'bell-cna', pid: d.id }] });
    });
  }

  /* ---------- player actions ---------- */
  const liveDef = (s, d) => { if (!d || !d.live || !s.p[d.id]) return d; const o = d.live(s, s.p[d.id]); return o ? Object.assign({}, d, o) : d; };
  const aideAway = (s, c) => (c.delegation && c.delegation.away ? c.delegation.away(s) : null);
  function answerBell(s, A, pid) {
    const P = s.p[pid], b = P.bell; if (!b) return '';
    P.bell = null; P.touchAt = s.t; bellDone(s, pid);
    return kindOf(A.c) === 'psych' ? `Request: ${b.who} asked ${b.text}. ${b.fix}` : `Call light: ${b.who} ${b.text}. ${b.fix}`;
  }
  function bellToCna(s, A, pid) {
    const c = A.c, P = s.p[pid], d = A.def(pid), b = P.bell, cn = (c.staff[cnaKey(c)] || {}).name || 'The aide';
    if (!b) return `${cn}: "Looks like someone already got it."`;
    if (aideAway(s, c)) return `${cn} isn't on the unit: ${aideAway(s, c).charAt(0).toLowerCase() + aideAway(s, c).slice(1)}.`;
    if (!b.cna) {
      A.judge(`${pid}-bell-deleg-${b.id}`, 'deleg', -1, `You asked ${cn} to handle a call light that needed a nurse.`, b.id === 'pump' ? 'Troubleshooting an IV pump and assessing the site are nursing tasks. The aide can tell you it\'s alarming; the pump is yours.' : b.id === 'pain' || b.id === 'anx' ? 'Assessing pain or distress and deciding on a PRN are nursing work. The aide can tell them you\'re coming.' : 'Some requests are really an assessment. That part stays with the nurse.', pid);
      A.msg({ from: cnaKey(c), pid, text: `${kindOf(c) === 'psych' ? 'I checked' : 'I popped in'}, but ${b.who} ${kindOf(c) === 'psych' ? 'is asking ' : ''}${b.text}. That one's yours; I told them you're coming.` });
      b.told = true; return '';
    }
    b.cnaAt = s.t + 8; bellDone(s, pid);
    return '';
  }
  function round(s, A, pid) {
    const d = A.def(pid), P = s.p[pid], bell = P.bell ? answerBell(s, A, pid) : '';
    P.roundAt = s.t; P.touchAt = s.t;
    return (bell ? bell + ' ' : '') + roundText(A.c, d, P, A);
  }
  function callUpdate(s, A, pid) {
    const P = s.p[pid], o = P.out, i = entryAt(P, s.t - o.at), e = o.spec.course[i];
    o.calls.push(s.t);
    if (i > o.known || !o.calledOnce) { o.known = Math.max(o.known, i); o.calledOnce = true; return { fresh: true, text: e.text, st: e.st }; }
    // Calling again with nothing new ties up two nurses; once is a note, not a lesson.
    if (o.calls.length >= 2 && s.t - o.calls[o.calls.length - 2] < 30) A.judge(`${pid}-upd-again`, 'time', -0.5, `You called ${where(o.spec.unit)} again about ${A.def(pid).short} with nothing new to learn.`, 'The receiving nurse will call you when something changes, and their time is the patient\'s time. Check in after a real interval, or when you have something to pass on.', pid);
    return { fresh: false, text: `No change since the last update. ${e.text}`, st: e.st };
  }
  /* Report to the receiving nurse: the essentials travel with the patient. */
  function handoffItems(s, A, d, P) {
    const o = P.out, sp = o.spec, items = [{ id: 'what', label: `What happened: ${sp.event}`, key: true }];
    if (!/No known/.test(liveDef(s, d).allergies)) items.push({ id: 'allergy', label: `Allergy: ${liveDef(s, d).allergies.split('.')[0]}`, key: true });
    items.push({ id: 'code', label: `Code status: ${liveDef(s, d).code.split(',')[0]}`, key: !/^Full code/.test(liveDef(s, d).code) });
    if (liveDef(s, d).legal && !/^Interpreter/.test(liveDef(s, d).legal)) items.push({ id: 'legal', label: `Legal status: ${liveDef(s, d).legal}`, key: true });
    const recent = [];
    (d.meds || []).forEach((m) => { const st = s.meds[m.id]; if (!st) return; const ts = m.prn ? st.given : st.status === 'given' && st.at !== null ? [st.at] : []; ts.filter((t) => t >= o.at - 180 && t <= o.at).forEach((t) => recent.push([t, m.name])); });
    if (recent.length) items.push({ id: 'meds', label: `Last doses: ${recent.sort((a, b) => b[0] - a[0]).slice(0, 3).map(([t, n]) => `${n} at ${A.clock(t)}`).join(', ')}`, key: true });
    sp.extra.forEach((x, i) => items.push({ id: 'x' + i, label: x.label, key: !!x.key }));
    if (d.family) items.push({ id: 'fam', label: `Family: ${d.family.name} (${d.family.rel.toLowerCase()})`, key: false });
    const nz = NOISE[kindOf(A.c)], a = seed(d.id) % nz.length;
    items.push({ id: 'n1', label: nz[a], noise: true }, { id: 'n2', label: nz[(a + 2) % nz.length], noise: true });
    return items.sort((x, y) => seed(d.id + x.id) % 7 - seed(d.id + y.id) % 7);
  }
  function giveHandoff(s, A, pid, picked) {
    const d = A.def(pid), P = s.p[pid], o = P.out, items = handoffItems(s, A, d, P), nurse = (STAFF[o.spec.nurse] || {}).name || 'the receiving nurse';
    const miss = items.filter((x) => x.key && !picked.includes(x.id)), noise = items.filter((x) => x.noise && picked.includes(x.id));
    o.handoff = s.t; P.touchAt = s.t;
    const late = s.t - o.at > 35;
    const nameOf = (x) => ({ what: 'what happened', allergy: 'the allergy', code: 'code status', legal: 'legal status', meds: 'the recent doses' }[x.id] || `"${x.label}"`);
    if (miss.length) A.judge(`${pid}-xfer-report`, 'comm', -1, `Your report to ${nurse} in ${where(o.spec.unit)} left out ${miss.slice(0, 2).map(nameOf).join(' and ')}.`, 'The receiving nurse only knows what you tell them. What happened, allergies, code status, legal status and recent doses travel with the patient every time.', pid);
    else A.judge(`${pid}-xfer-report`, 'comm', late ? 0 : 1, late ? `Complete report to ${where(o.spec.unit)}, but ${s.t - o.at} minutes after ${d.short} left.` : `Clean, complete report to ${nurse} in ${where(o.spec.unit)}.`, late ? 'The first half hour after a transfer is when the receiving team makes its decisions. Call report as soon as the patient leaves.' : 'What happened, what was given, and what makes this patient different. That\'s a handoff the next team can act on.', pid);
    if (noise.length >= 2) A.judge(`${pid}-xfer-noise`, 'comm', 0, `Your report to ${where(o.spec.unit)} included details that didn't matter.`, 'In an emergency handoff, every sentence should change what the next nurse does.', pid);
    return `${nurse}: "${miss.length ? 'Got it. ' + (miss.some((x) => x.id === 'allergy') ? `Wait, does ${d.short} have allergies?` : 'Anything else I should know?') : 'Thanks, that\'s everything I need.'}"`;
  }
  const FAM = [
    { id: 'honest', label: (f, sp) => `${f.interp ? `Call the ${f.interp} interpreter line, then tell` : 'Tell'} ${f.name} what happened, that the ${sp.unit} team is caring for them now, and give the ${sp.unit} number`, d: 1 },
    { id: 'fine', label: (f) => `Tell ${f.name} everything is going to be fine, that they're in good hands`, d: -1 },
    { id: 'none', label: (f, sp) => `Tell ${f.name} you can't discuss it and they'll have to call ${where(sp.unit)}`, d: -1 },
  ];
  function famChoices(P) { const f = P.out.spec.family, sp = P.out.spec; const list = FAM.map((x) => ({ id: x.id, label: x.label(f, sp) })); if (f.interp) list.push({ id: 'english', label: `Explain it slowly in English; ${f.name} seems to understand some` }); return list.sort((a, b) => seed(a.id + P.out.at) % 5 - seed(b.id + P.out.at) % 5); }
  function famUpdate(s, A, pid, choice) {
    const d = A.def(pid), P = s.p[pid], o = P.out, f = o.spec.family; o.fam = s.t; P.touchAt = s.t;
    if (choice === 'honest') { A.judge(`${pid}-xfer-fam`, 'comm', 1, `You told ${f.name} what happened and where ${d.short} is now.`, 'Families remember who told them, and how. Honest, specific, with a next step and a number to call. Leave prognosis to the team that will know it.', pid); return `${f.name} is quiet for a moment, then asks for the ${o.spec.unit} number. "Thank you for calling me yourself."`; }
    if (choice === 'fine') { A.judge(`${pid}-xfer-fam`, 'comm', -1, `You told ${f.name} everything would be fine.`, 'False reassurance feels kind and breaks trust when it turns out not to be true. Say what you know, and who will know more.', pid); return `${f.name}: "Oh thank God." ${where(o.spec.unit).replace(/^t/, 'T')} calls ${f.name} an hour later with a very different picture.`; }
    if (choice === 'english') { A.judge(`${pid}-xfer-fam`, 'comm', -1, `You updated ${f.name} in English without an interpreter.`, 'A frightened family member deserves a qualified interpreter, especially for bad news. "Understands some" isn\'t consent to guess.', pid); return `${f.name} nods and says "OK, OK." You're not sure what landed.`; }
    A.judge(`${pid}-xfer-fam`, 'comm', -1, `You told ${f.name} you couldn't discuss it.`, `${f.name} is the family contact you'd call anyway. Brushing them off after an emergency leaves them to imagine the worst. Tell them what happened and who to call.`, pid);
    return `${f.name}: "What do you mean you can't tell me? Is ${d.short} alive?"`;
  }
  function writeNote(s, A, pid) {
    const d = A.def(pid), P = s.p[pid], o = P.out; o.note = s.t; P.touchAt = s.t;
    const acts = s.log.filter((l) => l.pid === pid && (l.kind === 'act' || l.kind === 'find') && l.t >= o.at - 90 && l.t <= o.at).slice(-3).map((l) => (l.label || l.text.split('.')[0]).toLowerCase());
    const txt = `${o.spec.emergent ? 'Event' : 'Transfer'} note, ${A.clock(o.at)}: ${o.spec.event}${acts.length ? ' Nursing actions before transfer: ' + acts.join('; ') + '.' : ''} Report ${o.handoff !== null ? 'given' : 'pending'} to ${where(o.spec.unit)}.`;
    A.note(pid, 'You', txt);
    return txt;
  }

  /* ---------- to-do rows the brain shows ---------- */
  function awayRows(s, A, d, P) {
    const o = P.out; if (!o) return [];
    const sp = o.spec, rows = [], nurse = STAFF[sp.nurse] || { name: 'the receiving nurse' };
    if (sp.handoff) rows.push({ key: 'aw:ho', t: o.at + 3, late: s.t > o.at + 35, done: o.handoff !== null, text: `Call report to ${nurse.name}, ${sp.unit}`, go: { act: 'away', id: d.id } });
    if (sp.family) rows.push({ key: 'aw:fam', t: o.at + 10, late: s.t > o.at + 50, done: o.fam !== null, text: `Update ${sp.family.name} (${sp.family.rel})`, go: { act: 'away', id: d.id } });
    if (sp.note) rows.push({ key: 'aw:note', t: o.at + 15, late: s.t > o.at + 75, done: o.note !== null, text: sp.emergent ? 'Write the event note' : 'Write the transfer note', go: { act: 'away', id: d.id } });
    const i = entryAt(P, s.t - o.at);
    if (i > o.known) rows.push({ key: 'aw:upd:' + i, t: o.at + sp.course[i].at, late: false, text: `New update available from ${where(sp.unit)}`, go: { act: 'away', id: d.id } });
    return rows;
  }
  // PRN reassessment: every as-needed dose earns a look at whether it worked.
  const REASS = [[/morphine|hydromorph|oxycod|fentanyl|acetaminophen|ibuprofen|ketorolac|PCA|tylenol/i, 'pain'], [/ondansetron|prometh|metoclop/i, 'gi'], [/albuterol|ipratrop|neb/i, 'resp'], [/lorazepam|haloperidol|olanzapine|diphenhyd|hydroxyz|chlordiaz|ziprasid/i, 'neuro'], [/naloxone/i, 'resp'], [/epinephrine/i, 'resp'], [/furosemide/i, 'resp'], [/labetalol|hydralazine|nifedipine|nitroglycerin|diltiazem|amiodarone|saline bolus/i, 'vitals']];
  const reassessed = (s, pid, after) => s.log.some((l) => l.pid === pid && l.kind === 'find' && l.t >= after && (l.label === 'Vital signs' || /assess|score|pain|breath|lung|neuro|mental|sedation|CIWA|POSS|check|count|look|GI/i.test(l.label || '')));
  function prnRows(s, A, d, P) {
    const rows = [];
    (d.meds || []).filter((m) => m.prn).forEach((m) => {
      const st = s.meds[m.id]; if (!st || !st.given.length || !REASS.some(([rx]) => rx.test(m.name))) return;
      const g = st.given[st.given.length - 1], fast = /IV|IM|SC|SQ|neb|inh/i.test(m.route), due = g + (fast ? 30 : 60), gap = fast ? 10 : 20;
      const sys = (REASS.find(([rx]) => rx.test(m.name)) || [null, 'vitals'])[1];
      rows.push({ key: 'rx:' + m.id + ':' + g, t: due, late: s.t > due + 30, done: reassessed(s, d.id, g + gap), text: `Reassess after ${m.name}`, sub: `Given ${A.clock(g)}. Did it work?`, go: { act: 'dock', id: 'assess' }, sys });
    });
    return rows;
  }
  /* ---------- owning an error ----------
     A medication or treatment the game scores as unsafe is logged as an error. The nurse can tell the provider
     (an item in the SBAR) and the charge nurse (Talk & call). Telling fast is scored; never telling is scored too. */
  const FIX = {
    '21-ntg-rv': 'Lay her flat with her legs up and open the saline: 500 mL now. No more nitro. Call me if her systolic stays under 90.',
    '24-epi-iv': 'That was ten times the IV dose. Twelve-lead and a troponin, keep him on the monitor, and tell me about any chest pain. I\'m coming.',
    '22-tpa': 'It\'s in, so we manage it. Neuro checks and BP every 15 minutes, pressure under 180/105. Any headache, vomiting or neuro change, stat CT and call me.',
    '22-tpa-bp': 'Get his pressure under 180/105 now with labetalol, and recheck it every 15 minutes. Any neuro change, stat CT.',
    '22-tpa-dose': 'I\'ll talk to pharmacy and neurology about the dose. Neuro checks every 15 minutes and watch for bleeding.',
    '22-asa': 'Nothing else by mouth. Head up, suction at the bedside, and watch for coughing or a wet voice. Swallow screen before anything more.',
    '25-warf': 'That works against everything we\'re doing. Recheck his INR, and he gets the PCC and vitamin K now. Neuro checks every 15 minutes.',
    '412-oxy-blind': 'Check his sedation and breathing now and again in 30 minutes. Naloxone is on his orders if he\'s hard to wake.',
    '414-corr-blind': 'Check her glucose now and every 30 minutes for two hours. Get carbs into her, and treat anything under 70 per protocol.',
    '414-prand-blind': 'Check her glucose now and every 30 minutes for two hours. Get carbs into her, and treat anything under 70 per protocol.',
    '414-prand-bad': 'Check her glucose now and every 30 minutes for two hours. Get carbs into her, and treat anything under 70 per protocol.',
    '416-lis': 'Hold the next dose. Keep her in bed, recheck her pressure in 30 minutes, and call me if her systolic is under 90.',
    '418-meto-blind': 'Hold any more beta-blocker. Vitals every 15 minutes and atropine to the bedside. Call me if his rate is under 40 or his systolic under 85.',
    '418-meto-low': 'Hold any more beta-blocker. Vitals every 15 minutes and atropine to the bedside. Call me if his rate is under 40 or his systolic under 85.',
    '418-los': 'Hold the next dose, keep him in bed, and recheck his pressure in 30 minutes.',
    '421-loraz': 'No more sedatives. Keep her sat 88 to 92, watch how awake she is, and get a gas if she\'s drowsier.',
    '425-ibu': 'No NSAIDs at all now. Watch for melena or a falling pressure, and repeat her hemoglobin in four hours.',
    '425-start-known': 'Stop the blood now if it\'s running. Saline through new tubing, vitals now and every 15 minutes, and send the bag back to blood bank.',
    '425-nocheck': 'Stop and do the two-person check now. If anything doesn\'t match, clamp it and call blood bank. Vitals every 15 minutes.',
    '427-spiro': 'Off his list for good. Repeat potassium now, keep him on the monitor, and call me with any ECG change.',
    '429-pcn': 'Stop anything still running and watch her airway. Epinephrine at the bedside. I\'m coming now.',
    '431-diph': 'That can deepen her delirium. No more anticholinergics. Fall precautions, someone close by, and call me if she\'s more confused.',
    '433-loraz': 'His oxygen is the problem, not his nerves. Oxygen up, sit him up, and watch his breathing closely after that dose.',
    '433-massage': 'No more massage. Watch for chest pain or shortness of breath. We need that duplex now.',
    '437-po': 'Nothing more by mouth. Head up, suction at the bedside, and a swallow screen before anything else. Call me if he coughs or desats.',
    '212-carbo': 'Watch her breathing: albuterol now, oxygen, and call me if she wheezes. No more carboprost.',
    '212-oxy-off': 'Restart the oxytocin now and check her fundus.',
    '214-continue': 'Stop the magnesium now. Calcium gluconate if her breathing is down, stat level, reflexes every 15 minutes.',
    '505-morph-od': 'Stay with him. Naloxone 0.02 mg at the bedside, continuous sats and respiratory rate. No opioids until I re-order by weight.',
    '505-apap-od': 'That one dose is under the toxic range for him, but no more acetaminophen today. I\'ll re-order everything for his real weight.',
    '501-feed': 'Stop the bottle, suction him and keep him NPO. Feeds by NG from here.',
    '303-im': 'She needs a post-IM check now: vitals, sedation, breathing, stiffness. Chart exactly what happened, and I\'ll see her.',
    '305-li': 'Hold the lithium, the HCTZ and the NSAIDs. He needs fluids, a repeat level and the medicine team now.',
    '305-hctz': 'Hold the lithium, the HCTZ and the NSAIDs. He needs fluids, a repeat level and the medicine team now.',
    '305-ibu': 'Hold the lithium, the HCTZ and the NSAIDs. He needs fluids, a repeat level and the medicine team now.',
    '603-meto': 'Hold the rest of his beta-blocker. Keep him flat, vitals every 15 minutes, and call me if his pressure falls further.',
    '605-nomo': 'Stop the infusion for now and recheck the aPTT in an hour. Watch her for bleeding.',
    '605-arga-hep': 'Stop the heparin now; argatroban alone. Watch her for bleeding.',
    '605-flush': 'No more heparin in any form, flushes included. Saline only.',
    '607-cital': 'No more QT drugs. Keep him on the monitor, finish his potassium and magnesium, and call me with any run.',
    '607-ond': 'No more QT drugs. Keep him on the monitor, finish his potassium and magnesium, and call me with any run.',
    '607-lasix': 'Replace his potassium now per protocol and recheck it. Keep him on the monitor.',
    '405-halo': 'Diphenhydramine now, watch his airway, and haloperidol goes on his allergy list.',
    '409-apap': 'No more acetaminophen. That changes his level, so I need the stat level and liver tests now.',
  };
  const ERR_RX = (j) => (j.domain === 'meds' && j.delta <= -1) || ((j.domain === 'safety' || j.domain === 'judgment') && j.delta <= -2);
  // Called right after a medication or treatment runs: anything it was scored as unsafe becomes an error the nurse can own.
  function recordErrors(s, A, d, what, j0, isMed, known, medId) {
    s.errors = s.errors || [];
    // One error per action, however many ways it was wrong; the worst one leads.
    const js = s.judg.slice(j0).filter((j) => j.pid === d.id && ERR_RX(j) && (isMed || j.domain !== 'judgment') && !/-sbar|-missed$|-hold/.test(j.key || '')).sort((x, y) => x.delta - y.delta);
    const bases = [...new Set(js.map((j) => (j.key || '').replace(/-\d+$/, '')))].filter((b) => !s.errors.some((e) => e.pid === d.id && e.bases.includes(b)));
    if (!bases.length) return;
    const lead = js.find((j) => (j.key || '').replace(/-\d+$/, '') === bases[0]);
    s.errors.push({ id: ++s.seq, pid: d.id, t: s.t, what, medId: medId || null, known: !!known, base: bases[0], bases, key: lead.key, text: lead.text, md: null, charge: null });
  }
  const errsFor = (s, pid, who) => (s.errors || []).filter((e) => e.pid === pid && e.known && e[who] === null);
  const firstPerson = (t) => t.replace(/^You /, 'I ').replace(/\byou\b/g, 'I').replace(/\bYou\b/g, 'I').replace(/\byour\b/g, 'my');
  function errLabel(e) { return firstPerson(e.text); }
  function tellMD(s, A, d, e, provName) {
    e.md = s.t; e.known = true; const fast = s.t - e.t <= 30;
    A.judge(`${d.id}-err-md-${e.base}`, 'comm', fast ? 2 : 1, fast ? `You told ${provName} about your error right away.` : `You told ${provName} about your error, after a delay.`, `Owning an error fast lets the team treat what it caused: an antidote, closer monitoring, a changed plan. Hiding it is what hurts people. ${fast ? '' : 'Every minute before the call is a minute nobody is watching for the harm.'}`.trim(), d.id);
    const fx = [...new Set(e.bases.map((b) => FIX[b]).filter(Boolean))];
    return fx.length ? fx.join(' ') : 'Watch closely for any change: vitals now and in 30 minutes, and call me with anything. We\'ll file a safety report.';
  }
  function tellCharge(s, A, d, e) {
    e.charge = s.t;
    A.judge(`${d.id}-err-charge-${e.base}`, 'comm', 1, `You told the charge nurse about your error.`, 'The charge nurse can cover your other patients while you deal with it and helps with the safety report. Errors handled in the open are how units get safer.', d.id);
  }
  function errRows(s, A, d, P, provName) {
    return errsFor(s, d.id, 'md').map((e) => ({ key: 'err:' + e.id, t: e.t, late: s.t > e.t + 15, text: `Tell ${provName} about the error: ${e.what}`, sub: 'Use the SBAR. Say what was given, when, and how the patient is now.', go: { act: 'dock', id: 'talk' }, hl: 'Call ' + provName }));
  }
  // Ordered checks (A.watch): each one stays on the list until it's done the ordered number of times.
  function watchHits(s, d, P, w) {
    if (w.vitals) return P.vit.filter((v) => v.t > w.from).map((v) => v.t);
    const rx = new RegExp(w.rx, 'i');
    return s.log.filter((l) => l.pid === d.id && l.kind === 'find' && l.t > w.from && rx.test(l.label || '')).map((l) => l.t);
  }
  function watchRows(s, A, d, P) {
    return (s.watch || []).filter((w) => w.pid === d.id).map((w) => {
      const hits = watchHits(s, d, P, w), n = hits.length, done = n >= w.times;
      const t = n ? hits[n - 1] + w.every : w.from + (w.first !== undefined ? w.first : w.every);
      return { key: 'w:' + w.id + ':' + Math.min(n, w.times), t, late: !done && s.t > t + Math.max(10, Math.round(w.every / 2)), done, text: w.times > 1 ? `${w.text}: ${Math.min(n + 1, w.times)} of ${w.times}` : w.text, sub: done ? 'Done' : `Ordered ${A.clock(w.from)}`, go: { act: 'dock', id: w.tab || 'assess' }, sys: w.sys || (w.vitals ? 'vitals' : undefined) };
    });
  }
  function roundRow(s, A, d, P) {
    if (outOf(P) || s.t < 55 || (NOBELL[s.caseId] || []).includes(d.id) || P.oneToOne || P.secluded) return null;
    const last = Math.max(touched(P), 0);
    if (s.t - last < 55) return null;
    const k = kindOf(A.c);
    return { key: 'rd:' + last, t: last + 60, late: s.t > last + 90, text: k === 'psych' ? 'Check-in round' : 'Hourly round', sub: `Last checked ${last <= 0 ? 'in report' : A.clock(last)}${P.bell ? ' · call light on' : ''}`, go: { act: 'round', id: d.id } };
  }

  /* ---------- report to the oncoming nurse ---------- */
  function reportItems(s, A, d, P, pending, stName) {
    const items = [], v = A.lastVitals(d.id), st = d.status(s, P, A);
    items.push({ id: 'now', label: `Right now: ${stName(st).toLowerCase()}. Last vitals ${A.clock(v.t)}: HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}%`, key: st !== 'stable' });
    pending.slice(0, 3).forEach((r, i) => items.push({ id: 'p' + i, label: `Still to do: ${r.text}${r.late ? ' (overdue)' : ''}`, key: true }));
    const nw = P.orders.filter((o) => o.isNew).slice(-2);
    if (nw.length) items.push({ id: 'orders', label: `New this shift: ${nw.map((o) => o.text.split('.')[0]).join('; ')}`, key: true });
    const prn = [];
    (d.meds || []).filter((m) => m.prn).forEach((m) => { const g = s.meds[m.id].given; if (g.length && g[g.length - 1] >= s.t - 150) prn.push(`${m.name} at ${A.clock(g[g.length - 1])}`); });
    if (prn.length) items.push({ id: 'prn', label: `PRNs given: ${prn.join(', ')}`, key: true });
    const next = (d.meds || []).filter((m) => !m.prn && m.due !== undefined && s.meds[m.id].status === 'due' && m.due > s.t - 60 && (!m.available || m.available(s, s.p[d.id]))).map((m) => `${m.name} ${A.clock(m.due)}`);
    if (next.length) items.push({ id: 'next', label: `Meds still due: ${next.join(', ')}`, key: true });
    if (!/No known/.test(liveDef(s, d).allergies)) items.push({ id: 'allergy', label: `Allergy: ${liveDef(s, d).allergies.split('.')[0]}`, key: true });
    if (!/^Full code/.test(liveDef(s, d).code)) items.push({ id: 'code', label: `Code status: ${liveDef(s, d).code.split(',')[0]}`, key: true });
    if (liveDef(s, d).legal && !/^Interpreter/.test(liveDef(s, d).legal)) items.push({ id: 'legal', label: `Legal status: ${liveDef(s, d).legal}`, key: true });
    if (P.bell) items.push({ id: 'bell', label: `Still waiting: ${P.bell.who} ${kindOf(A.c) === 'psych' ? 'asked ' : ''}${P.bell.text}`, key: true });
    items.push({ id: 'dx', label: `Here for: ${d.reason}`, key: false });
    const nz = NOISE[kindOf(A.c)], a = seed(d.id + 'r') % nz.length;
    items.push({ id: 'n1', label: nz[a], noise: true }, { id: 'n2', label: nz[(a + 1) % nz.length], noise: true });
    return items.sort((x, y) => seed(d.id + x.id + 'r') % 9 - seed(d.id + y.id + 'r') % 9);
  }
  function giveReport(s, A, pid, picked, items) {
    const d = A.def(pid), P = s.p[pid], who = (A.c.staff[oncoming(A.c)] || {}).name || 'The oncoming nurse';
    const miss = items.filter((x) => x.key && !picked.includes(x.id)), noise = items.filter((x) => x.noise && picked.includes(x.id));
    s.report = s.report || {}; s.report[pid] = { t: s.t, miss: miss.length };
    const pend = miss.filter((x) => /^p\d|next|bell|prn/.test(x.id));
    const nameOf = (x) => ({ now: 'how they look right now', allergy: 'the allergy', code: 'code status', legal: 'legal status', orders: 'the new orders', prn: 'the PRNs you gave', next: 'the meds still due', bell: 'the call light that\'s on' }[x.id] || x.label.replace(/^Still to do: /, '').replace(/ \(overdue\)$/, ' (overdue)'));
    if (miss.length) A.judge(`${pid}-report`, 'comm', pend.length ? -1 : -0.5, `Your report on ${d.short} left out ${miss.slice(0, 2).map(nameOf).join(' and ')}.`, pend.length ? 'Unfinished work is safe to hand off. Unfinished work nobody mentions is how things get missed for a second shift in a row.' : 'Allergies, code status, legal status and what changed today are the lines the next nurse needs before anything else.', pid);
    else A.judge(`${pid}-report`, 'comm', .5, `Clean report on ${d.short}.`, 'What changed, what\'s pending, what makes this patient different. The next nurse can walk in and act.', pid);
    if (noise.length >= 2) A.judge(`${pid}-report-noise`, 'comm', 0, `Your report on ${d.short} had filler in it.`, noise.some((x) => /manipulat|parents get along|opinion/i.test(x.label)) ? 'Labels and guesses about families travel with a patient and color every nurse after you. Report what you saw, not a verdict.' : 'Report is a handoff, not a replay. Trends and changes, not every number.', pid);
    return `${who}: "${miss.length ? (pend.length ? 'Is there anything still outstanding on ' + d.short + '?' : 'OK. What about ' + nameOf(miss[0]) + '?') : 'Got it. Thanks, that\'s clear.'}"`;
  }

  /* ---------- end of shift ---------- */
  function endChecks(s, A) {
    const c = A.c;
    c.patients.forEach((d) => {
      const P = s.p[d.id]; if (!P || (d.arrives && !P.arrived)) return;
      // Errors the provider never heard about.
      errsFor(s, d.id, 'md').slice(0, 1).forEach((e) => A.judge(`${d.id}-err-hidden-${e.base}`, 'comm', -2, `You never told the provider about your error with ${d.short}: ${e.what}.`, 'A medication error nobody reports goes untreated. Tell the provider right away, then the charge nurse, then file a safety report.', d.id));
      if (P.out) {
        const o = P.out, sp = o.spec, left = s.t - o.at;
        if (sp.handoff && o.handoff === null && left >= 30) A.judge(`${d.id}-xfer-report`, 'comm', -1, `You never called report to ${where(sp.unit)} on ${d.short}.`, 'The patient left; your responsibility for what the next team knows didn\'t. Call report as soon as they\'re gone.', d.id);
        if (sp.note && o.note === null && left >= 45 && sp.emergent) A.judge(`${d.id}-xfer-note`, 'comm', -0.5, `No event note for ${d.short}'s transfer.`, 'After an emergency, the note is the record of what you saw, what you did and who you told, while it\'s fresh.', d.id);
        if (sp.family && o.fam === null && left >= 45) A.judge(`${d.id}-xfer-fam`, 'comm', -0.5, `${sp.family.name} never heard from you about ${d.short}'s transfer.`, 'After a transfer, families often hear nothing for hours. A two-minute call from the nurse who was there matters.', d.id);
        return;
      }
      // Ordered checks that were never finished.
      watchRows(s, A, d, P).filter((r) => !r.done && r.t <= s.t - 20).slice(0, 1).forEach((r) => A.judge(`${d.id}-watch-${r.key.split(':')[1]}`, 'assess', -1, `${d.short}'s ordered checks weren't finished: ${r.text.replace(/: \d+ of \d+$/, '').toLowerCase()}.`, 'An order for repeated checks is how the team finds out whether the treatment worked. Each one is a task with a time on it.', d.id));
      // PRNs nobody went back to check.
      if (!s.judg.some((j) => j.pid === d.id && /reassess/.test(j.key || ''))) {
        const miss = prnRows(s, A, d, P).filter((r) => !r.done && r.t <= s.t - 15);
        if (miss.length) A.judge(`${d.id}-prn-reassess`, 'meds', -1, `You didn't reassess ${d.short} after the ${miss[0].text.replace('Reassess after ', '').toLowerCase()}.`, 'Every PRN gets a follow-up: 30 minutes for IV, about an hour for oral. It\'s how you know whether to give more, give something else, or call.', d.id);
      }
    });
    if (s.t >= c.length - 30) {
      const left = c.patients.filter((d) => { const P = s.p[d.id]; return P && (!d.arrives || P.arrived) && !outOf(P) && !(s.report && s.report[d.id]); });
      if (left.length) A.judge('report-missing', 'comm', left.length >= 3 ? -2 : -1, `You left without giving report on ${left.map((d) => d.room).join(', ')}.`, 'The next nurse walks in blind. Report is the last safety check of your shift.');
    }
  }
  /* For the debrief: the rest of the story. */
  function nextFor(s, A, d, P) {
    if (!P.out) return null;
    const o = P.out, sp = o.spec, end = A.c.length;
    return { unit: sp.unit, at: o.at, entries: sp.course.map((e) => ({ t: o.at + e.at, st: e.st, text: e.text, after: o.at + e.at > end })), later: sp.later };
  }

  S.flow = { where, tick, endChecks, staffFor, oncoming, kindOf, ST, answerBell, bellToCna, round, roundText, callUpdate, handoffItems, giveHandoff, famChoices, famUpdate, writeNote, awayRows, prnRows, watchRows, roundRow, recordErrors, errsFor, errLabel, tellMD, tellCharge, errRows, reportItems, giveReport, nextFor, entryAt, STAFF };
})(window.Shift);
