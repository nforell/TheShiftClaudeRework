/* Case: 2 North, Mother-Baby, day shift (07:00–12:00). Specialty.
   Themes: the first day after birth, when the danger is quiet and the numbers that matter are the ones you go and get.
   212: Vaginal birth at 04:40 after a 20-hour oxytocin induction, 4.3 kg baby. She hasn't voided since. A full bladder
        pushes the uterus up and to the side and it stops contracting: postpartum hemorrhage from atony. She has asthma,
        and carboprost is on the hemorrhage order set.
   214: Preeclampsia with severe features, on magnesium sulfate until 18:10. Urine output in the 20s for three hours and
        a rising creatinine: magnesium is renally cleared, and it's accumulating. Reflexes already down to 1+. Later,
        severe-range blood pressure with a headache, which has a clock on it.
   216: A 6-hour-old, 4.45 kg baby of a mother with insulin-treated gestational diabetes. His glucose check is overdue,
        he hasn't fed in three hours, and he's a little cool. Dextrose gel is dosed by weight. His mother wants to
        breastfeed only.
   218: Day 1 after a cesarean. Her depression screen at 06:30 was high and she marked the self-harm question. She
        stopped her sertraline when she got pregnant, and she wants to go home today. She's Rh negative; her baby isn't. */
(function (S) {
  const { clamp, clock } = S.engine;
  const jit = (s, seed) => ((Math.floor(s.t / 5) * 7 + seed * 13) % 3) - 1;
  const recent = (s, t0, m) => t0 !== null && t0 !== undefined && s.t - t0 <= m;
  const NEWBORN = { T: [36.5, 37.5], HR: [100, 160], RR: [30, 60], SBP: [55, 90], SpO2: [95, 101] };

  /* ---------- 212 Keisha Brown: atony behind a full bladder; asthma rules out carboprost ---------- */
  // tone: 0 firm, 1 boggy. qbl: quantitative blood loss since birth, mL.
  const kRate = (P) => (P.tone > .45 ? (P.tone - .45) * 32 : 0);
  const kHR = (P) => Math.round(86 + Math.max(0, P.qbl - 500) / 1000 * 52 + (P.bronch ? 14 : 0));
  const kSBP = (P) => Math.round(118 - Math.max(0, P.qbl - 850) / 1000 * 62);
  const kTarget = (P) => clamp((P.bladder ? 1 : .62) - P.ut * .2, .1, 1);
  const keisha = {
    id: '212', room: '212', name: 'Keisha Brown', short: 'Ms. Brown', age: 31, sex: 'F', mrn: '00731180', provider: 'brennan',
    look: { skin: '#7A4E36', shade: '#5E3A27', lip: '#5A3024', blush: '#A0604A', iris: '#24160D', head: { w: 56, h: 61, jaw: .3 }, eye: 9.8,
      hair: { style: 'bun', color: '#1A120E' }, brow: { w: 3.4, color: '#140E0A' }, body: { w: 82, cloth: 'gown' }, extras: ['studs'], smile: .45, tired: true,
      lines: { calm: `He's finally asleep. Is it bad that I just want to stare at him?`, pain: `The cramping's getting worse. Is that normal?`, anxious: `I feel kind of light-headed. And wet.`, drowsy: `I'm so tired I can't keep my eyes open.`, dys: `My chest is tight. I can't get air in.`, none: `She doesn't answer.` } },
    bio: `Middle-school math teacher. Second baby; her daughter Nia is six and has already named the baby "Pickle." Her husband Desmond went home at five to get Nia to school.`,
    dx: `Postpartum, vaginal birth 04:40`, reason: `Vaginal birth at 04:40 after a 20-hour oxytocin induction at 41 weeks. Baby boy, 4.3 kg. Second-degree laceration, repaired.`,
    hx: [`Asthma: albuterol inhaler, one ED visit for asthma two years ago`, `G2P2. First birth uncomplicated`, `Epidural in labor, removed at 05:30`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `84 kg`,
    lines: [`PIV 18g left forearm: oxytocin infusion`], mobility: `Up with assist; first time up not yet done`, diet: `Regular`,
    // The hemorrhage is what the next nurse must hear first: blood loss, what was given, who came.
    reportExtra: (s, P) => (P.qbl >= 500 || P.called !== null ? [{ label: `Postpartum hemorrhage today: QBL ${Math.round(P.qbl)} mL${P.methAt !== null ? ', methylergonovine' : ''}${P.txaAt !== null ? ', TXA' : ''}${P.misoAt !== null ? ', misoprostol' : ''}${P.rrt ? `; hemorrhage team called at ${clock(P.rrtAt)}` : ''}. Asthma: no carboprost`, key: true }] : []),
    init: { tone: .38, bladder: true, qbl: 450, ut: 0, fundusAt: null, deviated: false, qblSeen: false, qblAt: null, massages: 0, cathAt: null, voidTry: false, called: null, carboAsked: false, oxyUp: false, oxyOff: false, methAt: null, misoAt: null, txaAt: null, carbo: false, bronch: false, albAt: null, ivs: false, reassessed: false, gone: false },
    nightVitals: { T: 37.1, HR: 88, SBP: 118, DBP: 70, RR: 18, SpO2: 98, O2: 'Room air', pain: 3 },
    labs: [
      { name: 'Hemoglobin (admission)', val: 12.4, unit: 'g/dL', ref: '12.0–15.5', flag: '', t: -1500 },
      { name: 'Platelets (admission)', val: 228, unit: 'K/µL', ref: '150–400', flag: '', t: -1500 },
      { name: 'Blood type', val: 'O positive, antibody screen negative', unit: '', ref: '', flag: '', t: -1500 },
      { name: 'Quantitative blood loss at birth', val: 450, unit: 'mL', ref: 'PPH: 1,000 mL or more', flag: '', t: -140 },
    ],
    orders: [
      { t: -140, text: `Postpartum vaginal birth order set. Fundus, lochia and vital signs every 30 minutes ×2, then every hour ×2, then every 4 hours. Void within 6 hours of birth; bladder scan and straight catheterize for inability to void or a displaced fundus.` },
      { t: -140, text: `Oxytocin 30 units in 500 mL LR at 125 mL/h, continue 4 hours after birth (until 08:40). Quantitative blood loss: weigh all pads and underpads.` },
      { t: -140, text: `Postpartum hemorrhage order set (Stage 1, nurse-initiated, notify provider): fundal massage; increase oxytocin to 250 mL/h; methylergonovine 0.2 mg IM (hold for SBP over 140, DBP over 90, or hypertension); carboprost 250 mcg IM (contraindicated in asthma); misoprostol 800 mcg buccal. Tranexamic acid requires a provider order.` },
      { t: -140, text: `Ibuprofen 600 mg PO every 6 hours. Albuterol inhaler 2 puffs every 4 hours as needed, wheeze.` },
    ],
    notes: [
      { t: -75, author: 'Paloma, night RN', text: `Recovery checks done. Fundus firm at the umbilicus at 05:45, lochia moderate. Epidural out 05:30, legs back. Hasn't voided; says she doesn't feel the urge. Breastfed at 06:00 with good latch.` },
    ],
    io: { intake: `IV oxytocin at 125 mL/h; juice and toast at 06:15`, output: `No void since birth (catheterized once in labor at 02:00)` },
    report: [
      { text: `Keisha Brown, 31, second baby, delivered at four-forty. Long induction, twenty hours of Pitocin. Big boy, 4.3 kilos.`, key: true },
      { text: `QBL at delivery was 450. Fundus was firm at the umbilicus at quarter to six.`, key: false },
      { text: `She hasn't peed yet. She says she doesn't need to. The epidural came out at five-thirty.`, key: true },
      { text: `She's got asthma. Uses an inhaler.`, key: true },
      { text: `Pitocin runs until eight-forty.`, key: false },
      { text: `Her daughter named the baby Pickle. It might stick.`, key: false },
    ],
    vitals(s, P) { return { T: 37.1, HR: kHR(P) + jit(s, 1) * 2, SBP: kSBP(P) + jit(s, 2) * 2, DBP: Math.round(70 - Math.max(0, P.qbl - 850) / 1000 * 30), RR: P.bronch ? 28 : 18 + (P.qbl > 1200 ? 4 : 0), SpO2: P.bronch ? 89 : 98, O2: 'Room air', pain: Math.min(8, 3 + Math.round(P.tone * 3)) }; },
    assess: {
      general: (s, P) => (P.bronch ? `Sitting forward, wheezing, speaking in short phrases.` : P.qbl > 1100 ? `Pale and quiet, eyes closed. "I just feel so tired."` : P.tone > .6 ? `Shifting in bed, a hand on her belly. "The cramps are worse than with Nia."` : `Holding the baby, tired and happy.`),
      resp: (s, P) => (P.bronch ? `RR 28. Wheezes in all fields, tight. Using her neck muscles.` : `Unlabored. Clear.`),
      cardiac: (s, P, A) => { P.k.card = s.t; const v = A.vitals('212'); return `HR ${v.HR}, regular. BP ${v.SBP}/${v.DBP}. Shock index ${(v.HR / v.SBP).toFixed(2)}. ${P.qbl > 1000 ? 'Cool hands, cap refill 3 seconds.' : 'Warm, cap refill brisk.'}`; },
      neuro: (s, P) => (P.qbl > 1300 ? `Drowsy, slow to answer.` : `Alert, oriented. Legs fully back from the epidural.`),
      pain: (s, P) => `Cramping ${Math.min(8, 3 + Math.round(P.tone * 3))}/10. Perineum sore, 2/10.`,
      skin: (s, P) => (P.qbl > 1000 ? `Pale. Clammy.` : `Warm and dry.`),
      gi: (s, P) => { P.k.gi = s.t; return P.bladder ? `Rounded fullness above the pubic bone. Hasn't voided since birth. Says she doesn't feel the urge.` : `Bladder not palpable. Voided after the catheter.`; },
    },
    interventions: [
      {
        id: 'fundus', label: 'Check her fundus and lochia', cost: 2,
        run(s, P, A) {
          P.fundusAt = s.t; P.k.fundus = s.t; const r = kRate(P), boggy = P.tone > .55;
          if (P.bladder && P.tone > .45) P.deviated = true;
          if (boggy) A.judge('212-fundus', 'assess', 2, `You checked Ms. Brown's fundus and found it boggy.`, `The fundus is the vital sign of the postpartum uterus. Soft, high and off to one side means atony, and a full bladder is the usual reason it's off to one side.`, '212');
          else A.judge('212-fundus-ok', 'assess', 1, `You checked Ms. Brown's fundus.`, `Firm, midline, at or below the umbilicus is what you want. Check it with every set of vital signs in the first day.`, '212');
          const where = P.bladder && P.tone > .45 ? '2 cm above the umbilicus, deviated to the right' : P.tone > .45 ? '1 cm above the umbilicus, midline' : 'at the umbilicus, midline';
          const lochia = r > 12 ? 'Lochia rubra, heavy and steady: the pad is soaked, clots the size of a golf ball' : r > 5 ? 'Lochia rubra, heavy: a pad soaked in under an hour, small clots' : r > 0 ? 'Lochia rubra, moderate' : 'Lochia rubra, light to moderate';
          return `${boggy ? 'Boggy' : P.tone > .45 ? 'Firm but tends to soften' : 'Firm'}, ${where}. ${lochia}. ${P.bladder ? 'Rounded fullness over the bladder.' : ''}`;
        },
      },
      {
        id: 'massage', label: 'Fundal massage, supporting the lower segment', cost: 2, avail: (s, P) => P.fundusAt !== null && P.tone > .45,
        run(s, P, A) { P.massages += 1; P.tone = Math.max(.15, P.tone - .3); P.qbl += 60; A.judge('212-massage', 'judgment', 1, `You massaged Ms. Brown's fundus, one hand guarding the lower segment.`, `Massage contracts an atonic uterus and expresses the clots that keep it soft. Guard above the pubic bone so the uterus can't be pushed down. It works for minutes; find out why it's soft.`, '212'); return `Firm under your hand after a minute of massage. About 60 mL of clots expressed.${P.bladder ? ' It drifts back up and to the right as you let go.' : ''}`; },
      },
      {
        id: 'bladder', label: 'Bladder scan, then straight catheterize if she can\'t void', cost: 6, avail: (s, P) => P.bladder,
        run(s, P, A) {
          P.bladder = false; P.cathAt = s.t; A.judge('212-cath', 'safety', P.deviated || P.tone > .5 ? 2 : 1, `You emptied Ms. Brown's bladder.`, `A full bladder lifts the uterus and keeps it from contracting. Six hours after birth with no void, after an epidural, is the moment to scan and cath. It's often the whole fix.`, '212');
          return `Bladder scan: 780 mL. She tries on the bedpan; nothing. Straight catheter, sterile technique: 760 mL of clear yellow urine. The fundus moves down to the umbilicus and toward midline.`;
        },
      },
      { id: 'qbl', label: 'Weigh her pads and underpads (QBL)', cost: 2, run(s, P, A) { const first = P.qblAt === null, last = first ? 450 : P.qblLast; P.qblSeen = true; P.qblPrev = P.qblAt; P.qblAt = s.t; P.qblLast = Math.round(P.qbl); A.judge('212-qbl', 'assess', 1, `You measured Ms. Brown's blood loss.`, `Estimated blood loss runs low by half or more. Weighing pads (1 gram is 1 mL) turns "a lot of blood" into a number that triggers a response.`, '212'); return `Quantitative blood loss since birth: ${Math.round(P.qbl)} mL (${Math.round(P.qbl - last)} mL since ${first ? 'the delivery count' : 'your last weigh at ' + clock(P.qblPrev)}). Bleeding about ${Math.round(kRate(P) * 60)} mL an hour right now.`; } },
      { id: 'ivs', label: 'Second large-bore IV; CBC, fibrinogen, type and crossmatch', cost: 6, avail: (s, P) => P.called !== null && !P.ivs, run(s, P, A) { P.ivs = true; A.judge('212-ivs', 'safety', 1, `You placed a second large-bore IV and sent hemorrhage labs.`, `Two large-bore lines and blood in the bank before you need it. Fibrinogen under 200 predicts a hemorrhage that won't stop.`, '212'); A.addLab('212', { name: 'Fibrinogen', val: P.qbl > 1100 ? 210 : 380, unit: 'mg/dL', ref: '400–650 at term', flag: P.qbl > 1100 ? 'L' : '' }); return `18g in the right antecubital. CBC, fibrinogen, type and crossmatch for 2 units sent.`; } },
      { id: 'reassess', label: 'Reassess fundus, bleeding and vital signs', cost: 3, avail: (s, P) => (P.methAt !== null || P.misoAt !== null || P.cathAt !== null) && !P.reassessed && s.t - Math.max(P.methAt || -99, P.misoAt || -99, P.cathAt || -99) >= 15, run(s, P, A) { P.reassessed = true; A.judge('212-reassess', 'judgment', 2, `You reassessed Ms. Brown after treating the atony.`, `Firm and staying firm, bleeding slowing, heart rate coming down: that's how you know it worked, and what the provider needs to hear.`, '212'); const v = A.vitals('212'); return `Fundus ${P.tone > .55 ? 'still soft' : 'firm'}, midline, at the umbilicus. Bleeding about ${Math.round(kRate(P) * 60)} mL an hour. HR ${v.HR}, BP ${v.SBP}/${v.DBP}. QBL ${Math.round(P.qbl)} mL.`; } },
    ],
    meds: [
      {
        id: '212-oxy', name: 'Oxytocin infusion', dose: '30 units/500 mL at 125 mL/h', route: 'IV', freq: 'Continuous until 08:40', prn: true, infusion: true,
        block: (s, P) => (P.oxyOff ? 'Stopped.' : null),
        checks: (s, P) => [{ label: 'Fundus', value: P.fundusAt === null ? 'Not checked' : P.tone > .55 ? 'Boggy' : 'Firm', ok: P.fundusAt === null ? null : P.tone <= .55 }, { label: 'Current rate', value: P.oxyUp ? '250 mL/h' : '125 mL/h', ok: null }, { label: 'Order set', value: 'May increase to 250 mL/h for atony', ok: null }],
        doses: [{ id: 1, label: 'Increase to 250 mL/h (PPH order set)' }, { id: 2, label: 'Leave at 125 mL/h' }, { id: 3, label: 'Stop the infusion' }],
        give(s, P, A, dose) {
          if (dose === 3) { P.oxyOff = true; if (s.t < 100 && P.tone > .45) A.judge('212-oxy-off', 'meds', -2, `You stopped Ms. Brown's oxytocin while her uterus was soft.`, `Oxytocin is what's holding her tone. It runs at least until 08:40, and longer if she's bleeding.`, '212'); else P.ut = Math.max(0, P.ut - .5); return `Oxytocin stopped.`; }
          if (dose === 2) return `No change. 125 mL/h.`;
          if (!P.oxyUp) { P.oxyUp = true; P.ut += 1; }
          A.judge('212-oxy-up', 'meds', P.tone > .45 ? 1 : 0, `You increased Ms. Brown's oxytocin to 250 mL/h.`, P.tone > .45 ? `First-line for atony, already running: turn it up per the order set, and call.` : `Allowed by the order set, but find the reason first: check her fundus.`, '212');
          return `Oxytocin up to 250 mL/h.`;
        },
      },
      {
        id: '212-meth', name: 'Methylergonovine', dose: '0.2 mg', route: 'IM', freq: 'PPH order set; may repeat in 2 h', prn: true,
        block: (s, P) => (P.methAt !== null ? 'Given at ' + clock(P.methAt) + '.' : null),
        checks: (s, P, A) => { const v = A.vitals('212'); return [{ label: 'Blood pressure', value: `${v.SBP}/${v.DBP}`, ok: v.SBP <= 140 && v.DBP <= 90 }, { label: 'Hypertension or preeclampsia', value: 'None', ok: true }, { label: 'Fundus', value: P.fundusAt === null ? 'Not checked' : P.tone > .55 ? 'Boggy' : 'Firm', ok: P.fundusAt === null ? false : null }]; },
        give(s, P, A) {
          P.methAt = s.t; P.ut += 1;
          if (P.fundusAt === null) A.judge('212-meth', 'meds', -1, `You gave Ms. Brown methylergonovine without checking her fundus.`, `A uterotonic treats atony. Feel the fundus first; if it's firm, the bleeding is coming from somewhere else.`, '212');
          else A.judge('212-meth', 'meds', 2, `You gave methylergonovine for atony in a patient it's safe for.`, `Her pressure is normal and she has no hypertension, so methylergonovine is a good second drug. It's the asthma that rules out carboprost.`, '212');
          return `Methylergonovine 0.2 mg IM, right deltoid.`;
        },
      },
      {
        id: '212-carbo', name: 'Carboprost (Hemabate)', dose: '250 mcg', route: 'IM', freq: 'PPH order set; every 15–90 min', prn: true,
        block: (s, P) => (P.carbo ? 'Given.' : null),
        checks: () => [{ label: 'Asthma', value: 'Yes: albuterol at home, ED visit 2 years ago', ok: false }, { label: 'Order set', value: 'Contraindicated in asthma', ok: false }],
        give(s, P, A) { P.carbo = true; P.bronch = true; P.bronchAt = s.t; P.ut += 1; A.judge('212-carbo', 'meds', -3, `You gave carboprost to Ms. Brown, who has asthma.`, `Carboprost is a prostaglandin F2-alpha: it contracts bronchial smooth muscle as well as the uterus. In asthma it can cause severe bronchospasm.${P.carboAsked ? ' The provider suggested it because the call left out her asthma.' : ''} Methylergonovine or misoprostol were safe.`, '212'); return `Carboprost 250 mcg IM. Within minutes she starts to wheeze.`; },
        hold(s, P, A) { A.judge('212-carbo-hold', 'meds', P.carboAsked ? 2 : 1, P.carboAsked ? `You held the carboprost Dr. Brennan suggested, because Ms. Brown has asthma.` : `You held carboprost for Ms. Brown's asthma.`, P.carboAsked ? `A provider's suggestion doesn't override a contraindication. Hold it and call back: she has asthma, so misoprostol instead. The call left out the asthma, which is why carboprost was suggested.` : `Right drug class, wrong patient. Say so on the call so nobody orders it later.`, '212'); return P.carboAsked ? 'Held: asthma. Dr. Brennan needs to hear that before anyone gives it.' : 'Held: asthma.'; },
      },
      {
        id: '212-miso', name: 'Misoprostol', dose: '800 mcg', route: 'Buccal', freq: 'PPH order set; once', prn: true,
        block: (s, P) => (P.misoAt !== null ? 'Given at ' + clock(P.misoAt) + '.' : null),
        checks: () => [{ label: 'Asthma', value: 'Not a contraindication for misoprostol', ok: true }, { label: 'Temperature', value: '37.1 (can cause fever and shivering)', ok: true }],
        give(s, P, A) { P.misoAt = s.t; P.ut += .6; A.judge('212-miso', 'meds', P.tone > .45 ? 1 : 0, `You gave misoprostol for atony.`, `Safe in asthma and hypertension. It's slower than the injectables; expect shivering and a fever spike.`, '212'); return `Misoprostol 800 mcg buccal, between cheek and gum.`; },
      },
      {
        id: '212-txa', name: 'Tranexamic acid', dose: '1 g over 10 min', route: 'IV', freq: 'Once (new order)', prn: true, available: (s, P) => P.called !== null,
        block: (s, P) => (P.txaAt !== null ? 'Given at ' + clock(P.txaAt) + '.' : null),
        checks: (s) => [{ label: 'Time since birth', value: `${Math.floor((s.t + 140) / 60)} h ${(s.t + 140) % 60} min`, ok: s.t + 140 <= 180 }],
        give(s, P, A) { P.txaAt = s.t; const inWin = s.t + 140 <= 180; A.judge('212-txa', 'meds', inWin ? 1 : 0, inWin ? `You gave tranexamic acid within 3 hours of birth.` : `You gave tranexamic acid more than 3 hours after birth.`, inWin ? `TXA reduces death from bleeding when it's given early, within 3 hours of birth.` : `After 3 hours the benefit falls away. It's why the hemorrhage call goes out early.`, '212'); return `TXA 1 g IV over 10 minutes.`; },
      },
      { id: '212-ibu', name: 'Ibuprofen', dose: '600 mg', route: 'PO', freq: 'Every 6 h', due: 60, checks: () => [{ label: 'Creatinine', value: '0.6', ok: true }, { label: 'Asthma', value: 'Has taken ibuprofen before without wheezing', ok: true }], give: () => `Ibuprofen 600 mg with toast.` },
      { id: '212-alb', name: 'Albuterol inhaler', dose: '2 puffs', route: 'Inhaled', freq: 'Every 4 h as needed, wheeze', prn: true, checks: (s, P) => [{ label: 'Wheeze', value: P.bronch ? 'Yes, all fields' : 'None', ok: P.bronch }], give(s, P, A) { P.albAt = s.t; if (P.bronch) A.judge('212-alb', 'meds', 1, `You treated Ms. Brown's bronchospasm with albuterol.`, `Bronchodilator first, sit her up, oxygen, and call.`, '212'); return `Albuterol 2 puffs with a spacer.`; } },
    ],
    comms: [
      { id: 'rrt', label: 'Call the obstetric hemorrhage team (rapid response)', cost: 3, avail: (s, P) => !P.gone && P.qbl >= 700 && !P.rrt, run(s, P, A) { P.rrt = true; P.rrtAt = s.t; P.called = P.called === null ? s.t : P.called; P.ut += .8; A.judge('212-rrt', 'judgment', P.qbl < 1200 ? 2 : 1, `You called the obstetric hemorrhage team for Ms. Brown.`, `Ongoing bleeding past 1,000 mL, or vital signs changing, is Stage 2: more hands, blood to the bedside, the provider in the room.`, '212'); return `The team is on the way. Anesthesia and the OB hospitalist are coming; blood bank is preparing 2 units.`; } },
    ],
    talk: (s, P) => (P.gone ? null : P.bronch && P.albAt === null ? 'kei_sob' : P.tone > .6 && !P.k.talkGush ? 'kei_gush' : P.k.talked ? 'kei_after' : 'kei_talk'),
    sbar: {
      items(s, P, A) {
        const v = A.vitals('212');
        return [
          { id: 'fundus', label: P.bladder ? 'Fundus boggy, above the umbilicus, deviated right' : 'Fundus boggy, firms with massage', key: true, need: P.fundusAt !== null && P.tone > .45, lock: 'Check her fundus' },
          { id: 'qbl', label: `QBL ${P.qblLast || Math.round(P.qbl)} mL since birth, still bleeding`, key: true, need: P.qblSeen, lock: 'Weigh her pads' },
          { id: 'vs', label: `HR ${v.HR}, BP ${v.SBP}/${v.DBP}`, key: true, need: true },
          { id: 'bladder', label: P.bladder ? 'No void since birth; bladder full' : `Bladder emptied: 760 mL`, key: true, need: P.k.gi !== undefined || P.cathAt !== null, lock: 'Check her bladder' },
          { id: 'asthma', label: 'Asthma on albuterol', key: true, need: true },
          { id: 'risk', label: '20-hour oxytocin induction, 4.3 kg baby', key: false, need: true },
          { id: 'given', label: [P.oxyUp && 'oxytocin up to 250', P.methAt !== null && 'methylergonovine given', P.misoAt !== null && 'misoprostol given'].filter(Boolean).join(', ') || 'Nothing given yet beyond the oxytocin infusion', key: P.methAt !== null || P.oxyUp, need: true },
          { id: 'pickle', label: 'Her daughter named the baby Pickle', key: false, need: true },
        ];
      },
      requests: [
        { id: 'pph', label: 'I think this is atony and she\'s bleeding. Can you come evaluate? She has asthma, so no carboprost. Can I get TXA, hemorrhage labs and a crossmatch?' },
        { id: 'ok', label: 'She was a little boggy, I massaged her and she firmed up. Just letting you know.' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (!picked.includes('fundus') && !picked.includes('qbl')) return `How's her fundus? How much has she bled, weighed?`;
        if (req === 'ok' && P.tone > .45) { A.judge('212-sbar-ok', 'judgment', -2, `You reported Ms. Brown's atony as handled.`, `A uterus that firms with massage and softens again is still bleeding. "Firmed up" isn't the end of the story until it stays firm.`, '212'); return `Okay. Keep an eye on her.`; }
        if (P.called === null) P.called = s.t;
        // The asthma reaches the provider if it's in the background lines or in the request itself ("she has asthma, so no carboprost").
        const toldAsthma = picked.includes('asthma') || req === 'pph';
        if (!P.ordered) { P.ordered = true; A.addOrder('212', `Stage 1 to 2 PPH: tranexamic acid 1 g IV now. Second large-bore IV. CBC, fibrinogen, type and crossmatch 2 units. Methylergonovine 0.2 mg IM if not given. Keep oxytocin at 250 mL/h for 4 more hours. Weigh all pads every 30 minutes.${toldAsthma ? ' No carboprost: asthma.' : ''}`); }
        if (!toldAsthma && !P.carbo) P.carboAsked = true;
        if (P.mdComing === undefined) P.mdComing = s.t;
        A.judge('212-sbar', 'comm', toldAsthma ? 2 : 1, `You called about Ms. Brown's bleeding.`, `Name the cause (atony), the number (QBL), the trend (heart rate) and the contraindication (asthma). The provider can only avoid a drug they know is dangerous.`, '212');
        return toldAsthma ? `Good call, and thank you for the asthma. No Hemabate. Methergine if you haven't, TXA now, labs and crossmatch. I'm coming up.` : `Okay, sounds like atony. Methergine, TXA, labs. If she's still boggy after that, give Hemabate. I'm coming.`;
      },
    },
    scene: (s, P) => ({ iv: P.oxyOff ? 'lock' : 'running', crib: false, tray: 'eaten', flowers: true, family: null, empty: P.gone, emptyText: 'Bed stripped, soaked pads in a pile. Back to Labor and Delivery for a hemorrhage.' }),
    clues: (s, P) => ({ flowers: `A crayon card from Nia: a stick-figure family and a small green baby labeled PICKLE.`, tray: `Toast crusts and an empty juice cup. No water touched; she hasn't wanted to drink "because I'd have to get up."`, iv: P.oxyOff ? `The oxytocin is off.` : `Oxytocin 30 units/500 mL at ${P.oxyUp ? 250 : 125} mL/h.` }),
    rig: (s, P) => ({ hr: kHR(P), sbp: kSBP(P), pale: clamp((P.qbl - 700) / 900, 0, 1), sweat: P.qbl > 1200 ? .5 : 0, alert: P.qbl > 1300 ? 1 : 0, pain: Math.min(8, 3 + Math.round(P.tone * 3)), anxious: P.bronch ? .6 : 0 }),
    status: (s, P) => (P.gone ? 'gone' : P.bronch || kRate(P) > 8 || kHR(P) / kSBP(P) >= .9 ? 'urgent' : P.tone > .5 || P.bladder ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.gone) return { tone: 'bad', title: 'Postpartum hemorrhage, back to L&D', text: `QBL over 1,600 mL. Back to Labor and Delivery for a balloon tamponade and blood. ${P.bladder ? 'Her bladder was still full.' : ''}${P.carbo ? ' She also needed treatment for bronchospasm after carboprost.' : ''}` };
      const controlled = P.tone <= .55 && !P.bladder;
      if (P.carbo) return { tone: 'bad', title: 'Bronchospasm after carboprost', text: `The atony settled, but carboprost triggered an asthma attack. ${P.albAt !== null ? 'Albuterol and steroids broke it.' : 'She needed a respiratory therapist and steroids.'} Carboprost is contraindicated in asthma.` };
      if (controlled && P.qbl < 1000 && P.called !== null) return { tone: 'good', title: 'Atony caught early', text: `Bladder emptied${P.methAt !== null ? ', methylergonovine' : ''}${P.txaAt !== null ? ', TXA' : ''}${P.mdHere !== undefined ? `, Dr. Brennan at the bedside by ${clock(P.mdHere)}` : ', and the provider called'}${P.teamHere !== undefined ? ', the hemorrhage team in the room' : ''}. QBL ${Math.round(P.qbl)} mL. Firm and staying firm.${P.reassessed ? ' Reassessed and better.' : ''}` };
      if (controlled) return { tone: 'mixed', title: P.qbl >= 1000 ? 'Postpartum hemorrhage, controlled late' : 'Bleeding controlled, provider not told', text: `QBL ${Math.round(P.qbl)} mL. ${P.called === null ? 'Nobody called the provider about a soft uterus and a full bladder.' : 'It took longer than it needed to.'}` };
      return { tone: 'bad', title: 'Still boggy at handoff', text: `QBL ${Math.round(P.qbl)} mL and counting.${P.bladder ? ' Her bladder was never emptied.' : ''} The next nurse inherits an active hemorrhage.` };
    },
  };

  /* ---------- 214 Lani Kealoha: magnesium accumulating with oliguria; then severe-range blood pressure ---------- */
  const dtr = (P) => (P.mg < 7 ? '2+' : P.mg < 9 ? '1+' : P.mg < 10 ? 'trace' : 'absent');
  const lRR = (s, P) => { const base = P.mg < 10 ? 16 : P.mg < 11.5 ? 13 : P.mg < 12.5 ? 11 : 8; return recent(s, P.caAt, 60) ? Math.min(16, base + 4) : base; };
  const lSBP = (P) => Math.round((P.sevAt !== null ? 167 : 148) - P.bpDrop);
  const lDBP = (P) => Math.round((P.sevAt !== null ? 111 : 96) - P.bpDrop * .6);
  const lani = {
    id: '214', room: '214', name: 'Lani Kealoha', short: 'Ms. Kealoha', age: 27, sex: 'F', mrn: '00731422', provider: 'brennan',
    look: { skin: '#B07A54', shade: '#8F5E3C', lip: '#7E4535', blush: '#C27C60', iris: '#22150C', head: { w: 56, h: 62, jaw: .35 }, eye: 9.8,
      hair: { style: 'long', color: '#140E0A' }, brow: { w: 3.6, color: '#140E0A' }, body: { w: 84, cloth: 'gown' }, extras: [], smile: .4, tired: true,
      lines: { calm: `I feel like I've got the flu. Hot and heavy. Is that the magnesium?`, pain: `My head is pounding. Right behind my eyes.`, drowsy: `Sorry. I keep dozing off.`, anxious: `Something's wrong. I can't keep my eyes open.`, none: `She doesn't respond.` } },
    bio: `Kindergarten aide and outrigger canoe paddler. First baby, a girl named Mālia. Her partner Kainoa has been asleep in the recliner since midnight.`,
    dx: `Preeclampsia with severe features, on magnesium`, reason: `Preeclampsia with severe features at 37 weeks (BP 164/110, headache). Induced, vaginal birth yesterday at 18:10. Magnesium sulfate for 24 hours postpartum.`,
    hx: [`First pregnancy`, `No chronic hypertension before this pregnancy`, `Platelets 162 yesterday morning`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `76 kg`,
    lines: [`PIV 18g right forearm: magnesium sulfate 2 g/h`, `PIV 20g left hand: saline lock`, `Foley catheter, hourly output`], mobility: `Bed rest while on magnesium; fall precautions`, diet: `Regular`,
    init: { mg: 7.9, rate: 2, uo: 20, checkAt: null, uoSeen: false, called: null, ordered: false, reduced: null, stopped: null, offOrder: false, caAt: null, levelAt: null, sevAt: null, sevSeen: null, confirmedAt: null, bpDrop: 0, bpMeds: [], firstBpMed: null, sparkles: false, apapForHead: false, icu: false, reassessed: false, bpReassessed: false },
    nightVitals: { T: 37.0, HR: 92, SBP: 148, DBP: 96, RR: 16, SpO2: 97, O2: 'Room air', pain: 2 },
    labs: [
      { name: 'Magnesium', val: 6.2, unit: 'mg/dL', ref: 'therapeutic 4.8–8.4', flag: '', t: -1320 },
      { name: 'Creatinine', val: 0.9, unit: 'mg/dL', ref: '0.5–0.9 in pregnancy', flag: '', t: -900 },
      { name: 'Platelets', val: 118, unit: 'K/µL', ref: '150–400', flag: 'L', t: -60 },
      { name: 'AST', val: 64, unit: 'U/L', ref: '10–35', flag: 'H', t: -60 },
      { name: 'Creatinine', val: 1.4, unit: 'mg/dL', ref: '0.5–0.9 in pregnancy', flag: 'H', t: -60 },
      { name: 'Magnesium', val: 7.9, unit: 'mg/dL', ref: 'therapeutic 4.8–8.4', flag: '', t: -60 },
    ],
    orders: [
      { t: -800, text: `Magnesium sulfate 40 g in 1,000 mL: 2 g/h for 24 hours after birth (until 18:10). Magnesium checks every hour: deep tendon reflexes, respiratory rate, level of consciousness, urine output. Magnesium level every 6 hours. Calcium gluconate 1 g at the bedside.` },
      { t: -800, text: `Magnesium toxicity protocol (nurse-initiated): absent deep tendon reflexes or RR under 12, stop the infusion, give calcium gluconate 1 g IV over 3 minutes for respiratory depression, and call. Notify provider for urine output under 30 mL/h for 2 hours, magnesium level over 8.4, or diminished reflexes.` },
      { t: -800, text: `Severe hypertension protocol: SBP 160 or more, or DBP 110 or more, confirmed on a repeat within 15 minutes: treat within 60 minutes (sooner is better). Labetalol 20 mg IV over 2 min (hold for HR under 60 or asthma), recheck in 10 minutes; or hydralazine 10 mg IV, recheck in 20; or nifedipine immediate-release 10 mg PO, recheck in 20. Notify provider.` },
      { t: -800, text: `Strict intake and output. Total IV fluid 80 mL/h. Seizure precautions. Acetaminophen 1,000 mg PO every 6 h as needed, mild pain or headache.` },
    ],
    notes: [
      { t: -70, author: 'Paloma, night RN', text: `Urine 25 mL at 04:00, 20 at 05:00, 20 at 06:00. Paged the resident at 05:10; he said keep watching and recheck labs. Reflexes 1+ at 06:00 (2+ at midnight). RR 16. Sleepy but rousable. BP 140s–150s/90s.` },
    ],
    io: { intake: `IV 80 mL/h total`, output: `Foley: 25, 20, 20 mL the last three hours` },
    report: [
      { text: `Lani Kealoha, 27, first baby, preeclampsia with severe features. Delivered yesterday at six-ten in the evening. Mag runs until then.`, key: false },
      { text: `Her urine's been twenty, twenty-five an hour for three hours. I paged at five; he said keep watching.`, key: true },
      { text: `Her six a.m. creatinine went up to 1.4. Mag level was 7.9.`, key: true },
      { text: `Reflexes were 1+ at six. They were 2+ at midnight.`, key: true },
      { text: `Pressures 140s, 150s over 90s. She had a headache in labor.`, key: true },
      { text: `Her partner's been asleep in the recliner all night. Good luck waking him.`, key: false },
    ],
    vitals(s, P) { return { T: 37.0, HR: 92 - (P.bpMeds.includes('lab') ? 8 : 0) + jit(s, 3) * 2, SBP: lSBP(P) + jit(s, 4) * 2, DBP: lDBP(P) + jit(s, 5), RR: lRR(s, P), SpO2: P.mg >= 12 && !recent(s, P.caAt, 60) ? 92 : 97, O2: 'Room air', pain: P.sevAt !== null && P.bpDrop < 10 ? 7 : 2 }; },
    assess: {
      general: (s, P) => (P.mg >= 11 ? `Hard to rouse. Opens her eyes to her name, then drifts.` : P.mg >= 9.5 ? `Very drowsy, flushed, slurring a little. "So heavy."` : P.sevAt !== null && P.bpDrop < 10 ? `Eyes shut against the light, rubbing her temples.` : `Flushed and sleepy, but talks in full sentences.`),
      resp: (s, P) => `RR ${lRR(s, P)}${lRR(s, P) < 12 ? ', shallow' : ''}. Lungs clear, no crackles.`,
      cardiac: (s, P, A) => { const v = A.vitals('214'); return `HR ${v.HR}. BP ${v.SBP}/${v.DBP}. 2+ edema to the knees.`; },
      neuro: (s, P) => { P.k.neuro = s.t; P.checkAt = s.t; P.uoSeen = true; return `Patellar reflexes ${dtr(P)}${P.mg >= 9 ? ' (you have to work to find them)' : ''}, no clonus. ${P.mg >= 9.5 ? 'Drowsy, slurred speech.' : 'Sleepy, oriented.'} ${P.sevAt !== null && P.bpDrop < 10 ? `Headache 7/10, frontal.${P.sparkles ? ' "There are sparkles at the edge of my vision."' : ''}` : 'Mild headache, 2/10.'}`; },
      pain: (s, P) => (P.sevAt !== null && P.bpDrop < 10 ? `Headache 7/10, behind her eyes, worse than in labor.` : `Headache 2/10. Perineum sore.`),
      skin: () => `Flushed and warm. 2+ pitting edema of both legs.`,
      gi: (s, P) => { P.uoSeen = true; P.k.gi = s.t; return `Foley: ${Math.round(P.uo)} mL in the last hour. Last three hours: 25, 20, ${Math.round(P.uo)}. Fundus firm. Lochia moderate.`; },
    },
    interventions: [
      {
        id: 'mgcheck', label: 'Magnesium checks: reflexes, breathing, LOC and urine output', cost: 3,
        run(s, P, A) {
          P.checkAt = s.t; P.uoSeen = true; P.k.neuro = s.t; P.k.mgcheck = (P.k.mgcheck || 0) + 1;
          if (P.k.mgcheck === 1) A.judge('214-check', 'assess', 2, `You did Ms. Kealoha's magnesium checks.`, `Magnesium is cleared by the kidneys. Falling urine output means it builds up, and reflexes disappear before breathing slows. That's why the checks are hourly, and why they go together.`, '214');
          if (dtr(P) === 'absent' && !P.k.absentSeen) { P.k.absentSeen = s.t; }
          return `Patellar reflexes ${dtr(P)}, no clonus. RR ${lRR(s, P)}. ${P.mg >= 9.5 ? 'Drowsy, slurred.' : 'Sleepy but oriented.'} Urine ${Math.round(P.uo)} mL last hour (25, 20, ${Math.round(P.uo)}). Calcium gluconate is at the bedside.`;
        },
      },
      { id: 'bp', label: 'Recheck her blood pressure (manual, right-size cuff)', cost: 2, run(s, P, A) { const v = A.recordVitals('214', 'You'); if (P.sevAt !== null && P.confirmedAt === null && v.SBP >= 160) { P.confirmedAt = s.t; A.judge('214-confirm', 'assess', s.t - P.sevAt <= 15 ? 2 : 1, `You confirmed Ms. Kealoha's severe-range pressure.`, `A repeat within 15 minutes confirms it, and starts the clock: treat within 60 minutes, sooner if you can.`, '214'); } return `BP ${v.SBP}/${v.DBP}, sitting up, right arm, large cuff. HR ${v.HR}.`; } },
      { id: 'reassess', label: 'Reassess her reflexes and breathing after the change', cost: 2, avail: (s, P) => (P.reduced !== null || P.stopped !== null || P.caAt !== null) && !P.reassessed && s.t - Math.max(P.reduced || -99, P.stopped || -99, P.caAt || -99) >= 30, run(s, P, A) { P.reassessed = true; A.judge('214-reassess', 'judgment', 2, `You reassessed Ms. Kealoha after the magnesium change.`, `Did it work? Reflexes coming back, breathing steady, urine picking up. And the level, when it's back.`, '214'); return `Reflexes ${dtr(P)}. RR ${lRR(s, P)}. Urine ${Math.round(P.uo)} mL last hour. ${P.mg < 9 ? 'More awake, talking about the baby.' : 'Still drowsy.'}`; } },
      { id: 'bpre', label: 'Recheck her pressure after the antihypertensive', cost: 2, avail: (s, P) => P.firstBpMed !== null && !P.bpReassessed && s.t - P.firstBpMed >= 10, run(s, P, A) { P.bpReassessed = true; const v = A.recordVitals('214', 'You'); A.judge('214-bp-recheck', 'judgment', 1, `You rechecked Ms. Kealoha's pressure after treating it.`, `The protocol is a loop: dose, recheck at 10 or 20 minutes, next dose if still severe. The goal is out of the severe range, not normal.`, '214'); return `BP ${v.SBP}/${v.DBP}. ${v.SBP >= 160 ? 'Still severe: the next step in the protocol.' : 'Out of the severe range.'} Headache ${P.bpDrop >= 10 ? 'easing, 3/10' : 'still 7/10'}.`; } },
    ],
    meds: [
      {
        id: '214-mag', name: 'Magnesium sulfate infusion', dose: '2 g/h', doseNow: (s, P) => (P.stopped !== null ? `stopped ${clock(P.stopped)}` : `${P.rate} g/h`), route: 'IV', freq: 'Continuous until 18:10', prn: true, infusion: true,
        block: (s, P) => (P.stopped !== null ? `Stopped at ${clock(P.stopped)}.` : null),
        checks: (s, P) => [{ label: 'Reflexes', value: P.checkAt === null ? 'Not checked this shift' : dtr(P), ok: P.checkAt === null ? null : dtr(P) === '2+' }, { label: 'Respiratory rate', value: `${lRR(s, P)}`, ok: lRR(s, P) >= 12 }, { label: 'Urine output', value: P.uoSeen ? `${Math.round(P.uo)} mL/h, 3 hours under 30` : 'Not reviewed', ok: P.uoSeen ? P.uo >= 30 : null }, { label: 'Current rate', value: `${P.rate} g/h`, ok: null }],
        doses: [{ id: 1, label: 'Continue at the current rate' }, { id: 2, label: 'Decrease to 1 g/h' }, { id: 3, label: 'Stop the infusion (toxicity protocol)' }],
        give(s, P, A, dose) {
          if (dose === 3) {
            P.stopped = s.t; P.rate = 0;
            if (dtr(P) === 'absent' || lRR(s, P) < 12) A.judge('214-stop', 'meds', 2, `You stopped Ms. Kealoha's magnesium for signs of toxicity.`, `Absent reflexes or a respiratory rate under 12: the protocol is yours to start. Stop, calcium if breathing is affected, call.`, '214');
            else if (P.stopOrdered) A.judge('214-stop', 'meds', 2, `You stopped Ms. Kealoha's magnesium as ordered.`, `Still accumulating on 1 g/h with poor urine output: stopping until the level falls is the safe plan. Recheck the level and reflexes, and keep calling.`, '214');
            else if (P.ordered) A.judge('214-stop', 'meds', 0, `You stopped the magnesium when the order was to decrease it.`, `With severe preeclampsia she still needs seizure prophylaxis. Carry out the order as written, or call back to change it.`, '214');
            else { P.offOrder = true; A.judge('214-stop', 'judgment', 0, `You stopped the magnesium before toxicity and without a call.`, `Her reflexes were still there. The worry is right, but the next step is the provider: she still needs seizure prophylaxis.`, '214'); }
            return `Magnesium stopped at the pump. Line clamped and labeled.`;
          }
          if (dose === 2) {
            if (P.stopped !== null) return `It's already stopped.`;
            P.reduced = P.reduced === null ? s.t : P.reduced; P.rate = 1;
            if (P.ordered) A.judge('214-reduce', 'meds', 2, `You decreased the magnesium to 1 g/h as ordered.`, `An order isn't done until the pump says so.`, '214');
            else A.judge('214-reduce', 'meds', -1, `You changed the magnesium rate without an order.`, `The concern was right; the rate change needs an order. Call with the urine output, the creatinine and the reflexes.`, '214');
            return `Magnesium decreased to 1 g/h.`;
          }
          if (dtr(P) === 'absent' || lRR(s, P) < 12) A.judge('214-continue', 'meds', -3, `You continued magnesium with ${dtr(P) === 'absent' ? 'absent reflexes' : 'a respiratory rate of ' + lRR(s, P)}.`, `Those are the signs of toxicity the protocol names. Stop the infusion.`, '214');
          return `No change. ${P.rate} g/h.`;
        },
      },
      {
        id: '214-ca', name: 'Calcium gluconate', dose: '1 g (10 mL of 10%) over 3 min', route: 'IV', freq: 'Toxicity protocol', prn: true,
        checks: (s, P) => [{ label: 'Respiratory rate', value: `${lRR(s, P)}`, ok: lRR(s, P) < 12 }, { label: 'Reflexes', value: P.checkAt === null ? 'Not checked' : dtr(P), ok: null }, { label: 'Magnesium', value: P.stopped !== null ? 'Stopped' : `Running at ${P.rate} g/h`, ok: P.stopped !== null }],
        give(s, P, A) { P.caAt = s.t; const tox = lRR(s, P) < 12 || dtr(P) === 'absent'; A.judge('214-ca', 'meds', tox ? 2 : -1, tox ? `You gave calcium gluconate for magnesium toxicity.` : `You gave calcium gluconate without signs of toxicity.`, tox ? `Calcium antagonizes magnesium at the muscle and reverses respiratory depression for a while. It doesn't lower the level, so the infusion stays off.` : `It's the antidote for respiratory depression or arrest from magnesium. Without toxicity, it just undoes the seizure protection.`, '214'); return `Calcium gluconate 1 g IV over 3 minutes. On the monitor the whole time.`; },
      },
      {
        id: '214-lab', name: 'Labetalol', dose: '20 mg over 2 min', route: 'IV', freq: 'Severe hypertension protocol', prn: true,
        checks: (s, P, A) => { const v = A.vitals('214'); return [{ label: 'Blood pressure', value: `${v.SBP}/${v.DBP}`, ok: v.SBP >= 160 || v.DBP >= 110 }, { label: 'Confirmed', value: P.confirmedAt !== null ? `Yes, ${clock(P.confirmedAt)}` : 'Not yet', ok: P.confirmedAt !== null ? true : null }, { label: 'Heart rate', value: `${v.HR}`, ok: v.HR >= 60 }, { label: 'Asthma', value: 'No', ok: true }]; },
        give(s, P, A) { return bpMed(s, P, A, 'lab', 18, `Labetalol 20 mg IV over 2 minutes. Recheck in 10.`); },
      },
      { id: '214-hyd', name: 'Hydralazine', dose: '10 mg', route: 'IV', freq: 'Severe hypertension protocol', prn: true, checks: (s, P, A) => { const v = A.vitals('214'); return [{ label: 'Blood pressure', value: `${v.SBP}/${v.DBP}`, ok: v.SBP >= 160 || v.DBP >= 110 }]; }, give(s, P, A) { return bpMed(s, P, A, 'hyd', 20, `Hydralazine 10 mg IV. Recheck in 20.`); } },
      { id: '214-nif', name: 'Nifedipine (immediate release)', dose: '10 mg', route: 'PO', freq: 'Severe hypertension protocol', prn: true, checks: (s, P, A) => { const v = A.vitals('214'); return [{ label: 'Blood pressure', value: `${v.SBP}/${v.DBP}`, ok: v.SBP >= 160 || v.DBP >= 110 }, { label: 'Swallow', value: P.mg >= 10 ? 'Too drowsy to swallow safely' : 'Awake enough', ok: P.mg < 10 }]; }, give(s, P, A) { return bpMed(s, P, A, 'nif', 15, `Nifedipine 10 mg PO. Recheck in 20.`); } },
      {
        id: '214-apap', name: 'Acetaminophen', dose: '1,000 mg', route: 'PO', freq: 'Every 6 h as needed, headache', prn: true,
        checks: (s, P, A) => { const v = A.vitals('214'); return [{ label: 'Blood pressure', value: `${v.SBP}/${v.DBP}`, ok: v.SBP < 160 && v.DBP < 110 }, { label: 'Platelets', value: '118', ok: true }]; },
        give(s, P, A) { const v = A.vitals('214'); if (v.SBP >= 160 || v.DBP >= 110) { P.apapForHead = true; A.judge('214-apap', 'judgment', -2, `You treated Ms. Kealoha's headache with acetaminophen while her pressure was ${v.SBP}/${v.DBP}.`, `A new headache with severe-range pressure in preeclampsia is a warning sign of stroke and eclampsia. Treat the pressure; the headache is the cue, not the problem.`, '214'); } return `Acetaminophen 1,000 mg.`; },
      },
    ],
    talk: (s, P) => (P.icu ? null : P.mg >= 10.5 ? 'lani_drowsy' : P.sevAt !== null && P.bpDrop < 10 && !P.k.talkHead ? 'lani_head' : P.k.talked ? 'lani_after' : 'lani_talk'),
    family: { name: 'Kainoa', rel: 'Partner', mode: 'bedside', cost: 3, avail: (s, P) => !P.icu, dialog: (s, P) => (P.k.kainoa ? 'kai_after' : 'kai_talk') },
    sbar: {
      items(s, P, A) {
        const v = A.vitals('214');
        return [
          { id: 'uo', label: `Urine output ${Math.round(P.uo)} mL/h, under 30 for 3 hours`, key: true, need: P.uoSeen, lock: 'Review her urine output' },
          { id: 'cr', label: 'Creatinine 1.4, up from 0.9 yesterday', key: true, need: true },
          { id: 'dtr', label: `Reflexes ${dtr(P)} (2+ at midnight)`, key: true, need: P.checkAt !== null, lock: 'Check her reflexes' },
          { id: 'mg', label: P.levelAt !== null ? `Magnesium ${P.levelVal} at ${clock(P.levelAt)}` : 'Magnesium 7.9 at 06:00', key: true, need: true },
          { id: 'rr', label: `RR ${lRR(s, P)}, ${P.mg >= 9.5 ? 'very drowsy' : 'sleepy but rousable'}`, key: lRR(s, P) < 14, need: true },
          { id: 'bp', label: P.sevAt !== null ? `BP ${v.SBP}/${v.DBP}${P.confirmedAt !== null ? ', confirmed on repeat' : ''}, headache 7/10` : `BP ${v.SBP}/${v.DBP}`, key: P.sevAt !== null, need: true },
          { id: 'plt', label: 'Platelets 118, AST 64', key: false, need: true },
          { id: 'canoe', label: 'Paddles outrigger canoe', key: false, need: true },
        ];
      },
      // The rate in the request is the rate running now, so a second call after the decrease doesn't say "2 g/h".
      requests: (s, P) => [
        { id: 'mg', label: `She's oliguric with a rising creatinine and her reflexes are falling on ${P.stopped !== null ? 'magnesium (now stopped)' : (P.rate || 2) + ' g/h'}. I'm worried about magnesium toxicity. Can we ${P.stopped !== null ? 'keep it off' : P.rate < 2 ? 'stop it' : 'decrease or stop it'} and get a stat level?` },
        { id: 'bp', label: 'Severe-range pressure, confirmed, with a headache. I\'m treating per the protocol. Can you see her?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'bp') {
          if (P.sevAt === null) return `Her pressures are in the 140s. That's not severe range. What's going on with her magnesium?`;
          P.bpCalled = s.t; A.judge('214-sbar-bp', 'comm', picked.includes('bp') ? 1 : 0, `You called about Ms. Kealoha's severe pressure.`, `The protocol lets you treat; the provider still needs to know, and to see her.`, '214');
          return P.firstBpMed !== null ? `Good, keep going with the protocol. I'll be up after this delivery. ${P.mg >= 9 && !P.ordered ? 'And how is her magnesium?' : ''}` : `Treat it now per the protocol, labetalol first. Don't wait for me.`;
        }
        if (!picked.includes('uo') && !picked.includes('dtr')) return `Okay. What are her reflexes and urine output doing?`;
        if (P.called === null) P.called = s.t;
        const tox = dtr(P) === 'absent' || lRR(s, P) < 12;
        // A second call is answered from where things stand now, not with the first call's order again.
        if (P.ordered && !tox) {
          if (P.stopped !== null) return `It's off, good. Level again in two hours and keep the reflex and urine checks hourly. I'll decide on restarting when the level is under 7.`;
          if (P.rate >= 2) return `I ordered 1 gram an hour at ${clock(P.called)}. Is that running? Turn it down now, then recheck her reflexes and call me back with the level.`;
          const lvl = P.levelAt !== null ? P.levelVal : null;
          if ((lvl !== null && lvl >= 8) || P.uo < 30) { if (!P.stopOrdered) { P.stopOrdered = true; A.addOrder('214', `Stop magnesium sulfate${lvl !== null ? ` (level ${lvl} on 1 g/h)` : ''} with ongoing oliguria. Magnesium level and reflexes in 2 hours. Restart at 1 g/h only on provider order. Call for absent reflexes or RR under 12.`); A.judge('214-sbar2', 'comm', 1, `You called back when the magnesium kept accumulating on the lower rate.`, `A rate change is a plan, not an endpoint. When the number keeps moving the wrong way, call again.`, '214'); }
            return `${lvl !== null ? `${lvl} on 1 gram an hour` : 'Still oliguric on 1 gram an hour'}, so it's still accumulating. Stop the magnesium for now. Level and reflexes in two hours; I'll decide on restarting then. Calcium at the bedside, and call me for absent reflexes or a rate under 12.`; }
          return `Thanks. She's on 1 gram an hour; keep the hourly checks and call me with the next level.`;
        }
        if (!P.ordered) { P.ordered = true; P.levelDue = s.t + 30; A.addOrder('214', tox ? `Stop magnesium sulfate. Calcium gluconate 1 g IV now if RR under 12. Stat magnesium level and BMP. Restart at 1 g/h only on my order. Strict I&O; no fluid bolus.` : `Decrease magnesium sulfate to 1 g/h. Stat magnesium level and BMP. Strict I&O, Foley hourly; no fluid bolus. Call for absent reflexes, RR under 12, or urine under 30 mL/h for 2 more hours.`); }
        A.judge('214-sbar', 'comm', !tox && picked.includes('uo') && picked.includes('cr') ? 2 : 1, `You called about magnesium accumulating in Ms. Kealoha.`, `Oliguria and a rising creatinine mean magnesium isn't being cleared. Falling reflexes are the early warning; the call should come before they're gone.`, '214');
        return tox ? `Stop it now. Calcium if her breathing is down. Level stat, I'm coming.` : `Good catch. Take it down to 1 gram an hour, stat level, no bolus. Call me if her reflexes go.`;
      },
    },
    scene: (s, P) => ({ iv: P.stopped !== null ? 'lock' : 'running', foley: true, fallPrec: true, tray: 'barely', family: P.icu ? null : 'kainoa', familyLabel: 'Kainoa, her partner, asleep in the recliner', empty: P.icu, emptyText: 'Bed stripped. Rapid response; to the ICU after respiratory depression on magnesium.' }),
    clues: (s, P) => ({ foley: `Foley bag: dark amber, about ${Math.round(P.uo * 3 + 5)} mL since it was emptied at 04:00.`, family: `Kainoa, asleep with the baby's hat in his hand. A paddle-shaped keychain on his bag.`, tray: `Breakfast barely touched. "Everything tastes like metal."`, alarm: `Padded side rails up. Suction and oxygen set up at the head of the bed. A syringe of calcium gluconate labeled and taped to the pump.` }),
    rig: (s, P) => ({ rr: lRR(s, P), alert: P.mg >= 11 ? 2 : P.mg >= 9.5 ? 1 : 0, pain: P.sevAt !== null && P.bpDrop < 10 ? 7 : 2, anxious: 0, sbp: lSBP(P) }),
    status: (s, P) => (P.icu ? 'gone' : lRR(s, P) < 12 || dtr(P) === 'absent' || (P.sevAt !== null && lSBP(P) >= 160) ? 'urgent' : P.mg >= 8.4 || P.uo < 30 ? 'watch' : 'stable'),
    outcome(s, P) {
      // Quote only a level that actually resulted, with its time.
      const lv = P.labs.filter((l) => l.name === 'Magnesium').pop(), lvTx = lv ? `last magnesium level ${lv.val} at ${lv.t < 0 ? '06:00' : clock(lv.t)}` : 'no new magnesium level';
      if (P.icu) return { tone: 'bad', title: 'Magnesium toxicity, respiratory arrest', text: `Magnesium ${P.mg.toFixed(1)} with urine output in the 20s since 04:00. Bag-mask breaths, calcium, and the ICU. Reflexes had been fading all morning.` };
      const sevOk = P.sevAt === null || (P.firstBpMed !== null && P.firstBpMed - P.sevAt <= 60);
      const mgOk = (P.reduced !== null || P.stopped !== null) && P.mg < 10;
      if (mgOk && sevOk && P.called !== null && P.caAt === null) return { tone: 'good', title: 'Magnesium caught before toxicity', text: `${P.stopped !== null ? `Stopped at ${clock(P.stopped)}` : `Rate down to ${P.rate || 0} g/h`} after the ${clock(P.called)} call; ${lvTx}, reflexes ${dtr(P)}. ${P.sevAt !== null ? `Severe pressure treated in ${P.firstBpMed - P.sevAt} minutes.` : ''}` };
      if (mgOk && sevOk) return { tone: 'mixed', title: P.caAt !== null ? 'Toxicity reversed' : 'Magnesium adjusted, loop not closed', text: `${P.caAt !== null ? 'She needed calcium for respiratory depression before the infusion came off. ' : ''}${P.called === null ? 'The provider never heard about the oliguria. ' : ''}At handoff: ${lvTx}, reflexes ${dtr(P)}.` };
      if (!sevOk) return { tone: 'bad', title: 'Severe hypertension, treated late', text: `Pressures over 160 from ${clock(P.sevAt)}${P.firstBpMed !== null ? `, first dose at ${clock(P.firstBpMed)}` : ', never treated'}. Stroke is a leading cause of death in preeclampsia; the 60-minute clock exists for that reason.${P.apapForHead ? ' Acetaminophen went in for the headache instead.' : ''}` };
      return { tone: 'bad', title: 'Magnesium still accumulating', text: `Still running and accumulating at handoff: ${lvTx}, reflexes ${dtr(P)}, urine ${Math.round(P.uo)} mL/h.` };
    },
  };
  function bpMed(s, P, A, k, drop, txt) {
    const v = A.vitals('214'), severe = v.SBP >= 160 || v.DBP >= 110;
    if (!severe) { A.judge('214-bp-' + k + '-' + s.t, 'meds', -1, `You gave an antihypertensive with a pressure of ${v.SBP}/${v.DBP}.`, `The protocol is for severe range. Dropping a postpartum preeclamptic pressure too far cuts cerebral and end-organ perfusion; the goal is 140–150/90–100.`, '214'); }
    else if (P.firstBpMed === null) {
      const mins = s.t - P.sevAt;
      A.judge('214-bp-treat', 'meds', mins <= 30 ? 2 : mins <= 60 ? 1 : -1, `You treated Ms. Kealoha's severe pressure ${mins} minutes after it started.`, `Severe-range pressure in preeclampsia gets treated within 60 minutes, ideally 30. ${P.confirmedAt === null ? 'Confirm with a repeat, but don\'t let confirming become waiting.' : ''}`, '214');
    }
    if (P.firstBpMed === null) P.firstBpMed = s.t;
    P.bpMeds.push(k); P.bpDrop += severe ? drop : drop / 2;
    return txt;
  }

  /* ---------- 216 Baby Boy Nguyen: infant of a diabetic mother, glucose overdue, a little cool ---------- */
  const sym = (P) => P.glu < 33 || P.temp < 36.2;
  const bTemp = (P) => Math.round(P.temp * 10) / 10;
  const baby = {
    id: '216', room: '216', name: 'Baby Boy Nguyen', short: 'Baby Nguyen', age: '6 hours', sex: 'M', mrn: '00731508', provider: 'lin', newborn: true, talkLabel: 'Pick him up',
    norms: NEWBORN,
    look: { skin: '#EBC2A0', shade: '#D0A27E', lip: '#C47A70', blush: '#F0A08C', iris: '#1E140C', head: { w: 62, h: 58, jaw: .02 }, eye: 10.6, small: .62,
      hair: { style: 'buzz', color: '#1A1410' }, brow: { w: 1.8, color: '#4A3A2C' }, body: { w: 54, cloth: 'onesie2' }, extras: [], smile: .1,
      lines: { calm: '(Asleep, fists curled up by his face.)', shaky: '(His arms tremble in quick little jerks, then stop when you hold them.)', drowsy: '(Sleepy. He stirs when you touch his cheek, then drifts off without rooting.)', anxious: '(A thin, fussy cry.)', none: '(Limp. He doesn\'t respond.)', hypo: '(Jittery and pale. A weak, high cry.)' } },
    bio: `Born at 01:05, 39 weeks, 4.45 kg. First baby for Linh, a pharmacy tech, and her husband Bảo, who went home to sleep at four.`,
    dx: `Newborn, infant of a diabetic mother`, reason: `Term baby boy, 6 hours old. Mother has gestational diabetes treated with insulin. Large for gestational age, 4.45 kg. Hypoglycemia protocol.`,
    hx: [`Mother: gestational diabetes on insulin since 28 weeks; HbA1c 6.4`, `Apgars 8 and 9`, `Erythromycin eye ointment and vitamin K given at birth`, `Mother's hepatitis B surface antigen negative`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `4.45 kg`,
    lines: [`None`], mobility: `Rooming in, bassinet`, diet: `Breastfeeding on demand; mother prefers exclusive breastfeeding`,
    init: { glu: 39, temp: 36.4, fedAt: -180, boost: [], checks: [], lastGlu: null, gels: [], gelDose: null, fed: [], donor: false, skin: false, linhOk: false, pushed: false, called: null, nicuPlan: false, nicu: false, gone: false, symAt: null, hepb: null, recheckAt: null },
    nightVitals: { T: 36.6, HR: 136, SBP: 64, DBP: 40, RR: 48, SpO2: 98, O2: 'Room air', pain: 0 },
    labs: [
      { name: 'Glucose (heel stick), 1 h', val: 31, unit: 'mg/dL', ref: 'under 4 h: 25 or more; 4–24 h: 45 or more', flag: '', t: -296 },
      { name: 'Glucose (heel stick), 2 h', val: 42, unit: 'mg/dL', ref: 'under 4 h: 25 or more; 4–24 h: 45 or more', flag: '', t: -235 },
      { name: 'Glucose (heel stick), 5 h', val: 46, unit: 'mg/dL', ref: '4–24 h: 45 or more', flag: '', t: -55 },
    ],
    orders: [
      { t: -350, text: `Newborn hypoglycemia protocol (infant of a diabetic mother, LGA): glucose before feeds for 24 hours. Feed within the first hour and every 2–3 hours. Birth to 4 h: target 25 or more. 4–24 h: target 45 or more.` },
      { t: -350, text: `4–24 h, glucose 35–44 and no symptoms: dextrose 40% oral gel 0.5 mL/kg buccal, then feed (breast milk, donor milk or formula per parents), recheck 1 hour after. Maximum two gel doses, then notify pediatrician. Notify immediately for symptoms (jitteriness, poor feeding, lethargy, temperature under 36.5, apnea, seizure) or glucose under 35.` },
      { t: -350, text: `Hepatitis B vaccine 0.5 mL IM within 24 hours of birth (consent signed). Axillary temperature every 4 hours and as needed; skin to skin encouraged.` },
    ],
    notes: [
      { t: -60, author: 'Paloma, night RN', text: `Glucose 46 at 06:00, before a feed. Breastfed 04:00 for 10 minutes, sleepy at the breast. Mom wants to exclusively breastfeed. Due for glucose before his next feed.` },
    ],
    io: { intake: `Breastfed 01:30, 04:00 (10 min, sleepy)`, output: `1 void, 1 meconium` },
    report: [
      { text: `Baby Nguyen, born at one-oh-five. Mom's a gestational diabetic on insulin. He's big: 4.45 kilos.`, key: true },
      { text: `His sugars were 31, 42, 46. His next one's due before his feed. He's been sleeping since four, so he's due now.`, key: true },
      { text: `He was sleepy at the breast at four. Ten minutes, then out.`, key: true },
      { text: `Mom really wants to exclusively breastfeed. She's pretty firm about no formula.`, key: true },
      { text: `Hep B's due, consent's signed.`, key: false },
      { text: `Dad went home to put the car seat in. He's very proud of the car seat.`, key: false },
    ],
    vitals(s, P) { return { T: bTemp(P), HR: 134 + (sym(P) ? 18 : 0) + jit(s, 6) * 3, SBP: 64, DBP: 40, RR: sym(P) ? 62 : 48 + jit(s, 7) * 2, SpO2: P.glu < 28 ? 93 : 98, O2: 'Room air', pain: 0 }; },
    assess: {
      general: (s, P) => (P.glu < 28 ? `Limp in the bassinet, pale, a weak high-pitched cry.` : sym(P) ? `Jittery: fine tremors of both arms that stop when you hold them. Pale and sweaty at the hairline.` : P.temp < 36.5 ? `Asleep, a little mottled on his feet. Hard to rouse for a feed.` : `Asleep, pink, easy to rouse.`),
      resp: (s, P, A) => `RR ${A.vitals('216').RR}. ${sym(P) ? 'Mild tachypnea, no grunting.' : 'No grunting, flaring or retractions.'}`,
      cardiac: (s, P, A) => `HR ${A.vitals('216').HR}, regular, no murmur. Cap refill 2 seconds. Femoral pulses equal.`,
      neuro: (s, P) => { P.k.neuro = s.t; return P.glu < 28 ? `Hypotonic. Weak suck. Poor Moro.` : sym(P) ? `Jittery. Suck weak; roots, then tires.` : P.glu < 42 ? `Sleepy, rouses with stimulation. Roots a little.` : `Good tone. Roots and sucks well.`; },
      pain: () => `NIPS 0.`,
      skin: (s, P) => { P.k.temp = s.t; return `Axillary ${bTemp(P)} °C. ${P.temp < 36.5 ? 'Feet mottled, hands cool.' : 'Warm, pink.'} Mild facial plethora. No jaundice yet.`; },
      gi: (s, P) => `Last breastfeed ${P.fed.length ? clock(P.fed[P.fed.length - 1]) : '04:00, 10 minutes, sleepy'}. One void and one meconium since birth.`,
    },
    interventions: [
      {
        id: 'glu', label: 'Heel-stick glucose', cost: 3,
        run(s, P, A) { checkGlu(s, P, A, 'You'); const g = Math.round(P.glu); return `Glucose ${g} mg/dL at ${Math.floor((s.t + 355) / 60)} hours old. ${g < 35 ? 'Under 35: the protocol says notify the pediatrician.' : g < 45 ? 'Under the 45 target for 4–24 hours.' : 'At target.'} ${sym(P) ? 'He\'s jittery.' : 'No symptoms you can see.'}`; },
      },
      {
        id: 'feed', label: 'Help Linh breastfeed now; hand-express colostrum', cost: 8,
        run(s, P, A) { P.fed.push(s.t); P.fedAt = s.t; P.boost.push({ t: s.t, amt: P.glu < 30 ? 4 : 7, over: 20 }); A.judge('216-feed', 'judgment', 1, `You got Baby Nguyen fed.`, `Feeding is the treatment for low glucose and the reason for gel: gel buys time, milk keeps it up. Hand-expressed colostrum is small in volume and high in value.`, '216'); return `Skin to skin, cross-cradle hold. He roots, latches after a few tries, and nurses about 8 minutes before tiring. Linh hand-expresses 3 mL of colostrum and you give it by spoon.`; },
      },
      { id: 'donor', label: 'Supplement: pasteurized donor milk, 10 mL by cup or syringe', cost: 4, avail: (s, P) => !P.donor, run(s, P, A) { P.donor = true; P.boost.push({ t: s.t, amt: 9, over: 20 }); if (!P.linhOk) { P.pushed = true; A.judge('216-donor', 'comm', -1, `You supplemented Baby Nguyen without talking with Linh first.`, `She asked for exclusive breastfeeding. Supplementing can be the right call; it's her baby, and she gets to hear why and decide.`, '216'); } else A.judge('216-donor', 'judgment', 1, `You supplemented with donor milk, with Linh's agreement.`, `Donor milk supplements without formula, which is what she asked for, and adds volume colostrum alone may not.`, '216'); return `10 mL of donor milk by syringe along the gum while he sucks your finger. He takes it all.`; } },
      { id: 'skin', label: 'Skin to skin with Linh, warm blanket and hat', cost: 2, avail: (s, P) => !P.skin, run(s, P, A) { P.skin = true; A.judge('216-skin', 'judgment', P.temp < 36.5 ? 1 : 0, `You warmed Baby Nguyen skin to skin.`, `Cold stress burns glucose. Skin to skin warms him and helps him feed.`, '216'); return `Diaper only, on Linh's chest, warm blanket over both, hat on. He settles.`; } },
      { id: 'temp', label: 'Axillary temperature', cost: 1, run(s, P) { P.k.temp = s.t; return `Axillary ${bTemp(P)} °C.${P.temp < 36.5 ? ' Under 36.5.' : ''}`; } },
    ],
    meds: [
      {
        id: '216-gel', name: 'Dextrose 40% oral gel', dose: '0.5 mL/kg', route: 'Buccal', freq: 'Protocol: glucose 35–44, no symptoms; max 2 doses', prn: true,
        block: (s, P) => (P.gels.length >= 2 ? 'Two doses given: notify the pediatrician.' : null),
        checks: (s, P) => [{ label: 'Weight', value: '4.45 kg', ok: null }, { label: 'Last glucose', value: P.lastGlu === null ? 'Not checked this shift' : `${P.lastGlu} at ${clock(P.checks[P.checks.length - 1])}`, ok: P.lastGlu === null ? false : P.lastGlu < 45 && P.lastGlu >= 35 }, { label: 'Symptoms', value: sym(P) ? 'Jittery' : 'None', ok: !sym(P) }],
        doses: [{ id: 1, label: '2.2 mL (0.5 mL/kg, 0.9 g)' }, { id: 2, label: '0.5 mL' }, { id: 3, label: '4.5 mL (1 mL/kg)' }],
        give(s, P, A, dose) {
          P.gels.push(s.t); P.gelDose = dose; P.boost.push({ t: s.t, amt: dose === 1 ? 10 : dose === 2 ? 3 : 14, over: 15 });
          if (P.lastGlu === null || !recent(s, P.checks[P.checks.length - 1], 30)) A.judge('216-gel-' + P.gels.length, 'meds', -1, `You gave dextrose gel without a current glucose.`, `The protocol starts with a number: gel for 35 to 44, with no symptoms. Check first.`, '216');
          else if (dose === 1) A.judge('216-gel-' + P.gels.length, 'meds', 2, `You gave Baby Nguyen the right dose of dextrose gel.`, `0.5 mL/kg of 40% gel is 200 mg/kg: 2.2 mL for 4.45 kg. Rub it into the cheek, then feed.`, '216');
          else A.judge('216-gel-' + P.gels.length, 'meds', -1, `You gave the wrong dose of dextrose gel.`, `The dose is weight-based: 0.5 mL/kg, so 2.2 mL for 4.45 kg. ${dose === 2 ? 'Half a mL is a quarter of the dose.' : 'Double the dose overshoots and can rebound.'}`, '216');
          if (sym(P)) A.judge('216-gel-sym', 'judgment', -1, `You treated a symptomatic baby with gel alone.`, `Jitteriness makes this symptomatic hypoglycemia: the protocol says call the pediatrician now. Gel can bridge, but he needs an evaluation for IV dextrose.`, '216');
          return `Dextrose 40% gel ${dose === 1 ? '2.2' : dose === 2 ? '0.5' : '4.5'} mL massaged into the inside of his cheek. Feed next; recheck in an hour.`;
        },
      },
      {
        id: '216-hepb', name: 'Hepatitis B vaccine', dose: '0.5 mL', route: 'IM', freq: 'Once, within 24 h of birth', due: 120,
        checks: () => [{ label: 'Consent', value: 'Signed', ok: true }, { label: 'Mother HBsAg', value: 'Negative', ok: true }, { label: 'Weight', value: '4.45 kg (2 kg or more)', ok: true }],
        doses: [{ id: 1, label: '0.5 mL IM, vastus lateralis (anterolateral thigh)' }, { id: 2, label: '0.5 mL IM, ventrogluteal' }, { id: 3, label: '0.5 mL IM, deltoid' }, { id: 4, label: '0.5 mL subcutaneous, thigh' }],
        give(s, P, A, dose) { P.hepb = dose; A.judge('216-hepb', 'meds', dose === 1 ? 1 : -1, dose === 1 ? `You gave the hepatitis B vaccine in the vastus lateralis.` : `You gave the hepatitis B vaccine in the wrong site.`, `In a newborn, the vastus lateralis (anterolateral thigh) is the only well-developed muscle for an IM injection. The deltoid and gluteal muscles are too small; the vaccine is made for IM, not subcutaneous.`, '216'); return `Hepatitis B vaccine 0.5 mL IM, ${['', 'left anterolateral thigh', 'ventrogluteal', 'deltoid', 'subcutaneous thigh'][dose]}, 5/8-inch (16 mm) needle, 25 gauge. Linh holds him and he nurses after.`; },
        hold(s, P, A) { A.judge('216-hepb-hold', 'meds', 0, `You held Baby Nguyen's hepatitis B vaccine.`, `Fine to delay a few hours while you deal with his glucose; it needs to be in within 24 hours of birth.`, '216'); return 'Held for now; due before 01:05 tomorrow.'; },
      },
    ],
    family: { name: 'Linh', rel: 'Mother', mode: 'bedside', cost: 3, avail: (s, P) => !P.gone && !P.nicu, dialog: (s, P) => (P.k.linhTalked ? 'linh_after' : 'linh_talk') },
    talk: (s, P) => (P.gone ? null : 'baby_hold'),
    sbar: {
      items(s, P) {
        return [
          { id: 'glu', label: P.lastGlu === null ? 'Glucose due, not yet checked' : `Glucose ${P.lastGlu} at ${clock(P.checks[P.checks.length - 1])}${P.checks.length > 1 ? ` (earlier ${P.checkVals.slice(0, -1).join(', ')})` : ''}`, key: P.lastGlu !== null, need: true },
          { id: 'sym', label: 'Jittery, weak suck', key: true, need: sym(P) && P.k.neuro !== undefined, lock: 'Not seen' },
          { id: 'temp', label: `Axillary ${bTemp(P)} °C`, key: P.temp < 36.5, need: P.k.temp !== undefined, lock: 'Take his temperature' },
          { id: 'gel', label: P.gels.length ? `Dextrose gel ×${P.gels.length}, last ${clock(P.gels[P.gels.length - 1])}` : 'No gel given', key: P.gels.length > 0, need: true },
          { id: 'risk', label: 'Mother on insulin for GDM; 4.45 kg', key: true, need: true },
          { id: 'feed', label: P.fed.length ? `Breastfed ${clock(P.fed[P.fed.length - 1])}` : 'Last fed 04:00, sleepy', key: true, need: true },
          { id: 'seat', label: 'Dad installed the car seat', key: false, need: true },
        ];
      },
      requests: [
        { id: 'iv', label: 'He\'s symptomatic or still under 45 after gel. Can you evaluate him for IV dextrose?' },
        { id: 'gel', label: 'Glucose under 45 without symptoms. I\'m following the gel protocol and feeding him. Anything else you want?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (P.lastGlu === null) return `What's his glucose?`;
        if (P.called === null) P.called = s.t;
        const needIV = sym(P) || P.lastGlu < 35 || (P.gels.length >= 2 && P.lastGlu < 45);
        if (req === 'iv' || needIV) {
          if (!needIV) { A.judge('216-sbar', 'comm', 0, `You asked for IV dextrose for an asymptomatic baby at ${P.lastGlu}.`, `Reasonable to call, but the protocol covers this: gel, feed, recheck in an hour.`, '216'); return `He's asymptomatic at ${P.lastGlu}? Gel and feed per protocol, recheck in an hour. Call me if he's under 45 again or if he gets jittery.`; }
          if (!P.nicuPlan) { P.nicuPlan = true; P.nicuAt = s.t + 20; A.addOrder('216', `Admit to NICU for IV dextrose: D10W 2 mL/kg bolus, then 80 mL/kg/day. Glucose 30 minutes after. Mother may breastfeed in the NICU.`); }
          A.judge('216-sbar', 'comm', picked.includes('sym') || picked.includes('glu') ? 2 : 1, `You escalated Baby Nguyen's hypoglycemia.`, `Symptoms, a glucose under 35, or failure after two gels mean IV dextrose. Calling early keeps it from becoming a seizure.`, '216');
          return `I'm coming. He needs IV dextrose: NICU's setting up a warmer. Keep him skin to skin until they come, and let Linh go with him.`;
        }
        A.judge('216-sbar', 'comm', 1, `You updated the pediatrician on Baby Nguyen's protocol.`, `Not required by the protocol, but a clear update with a plan is never wrong.`, '216');
        return `Sounds right. Gel, feed, recheck in an hour. If he's under 45 after the second gel, or jittery, call me.`;
      },
    },
    scene: (s, P) => ({ crib: true, tray: 'none', bottle: P.donor, family: P.gone ? null : 'linh', familyLabel: P.skin ? 'Linh, holding him skin to skin' : 'Linh, his mother, in the bed beside the bassinet', empty: P.gone, emptyText: P.nicu ? 'Bassinet empty. Taken to the NICU after a seizure.' : 'Bassinet empty. In the NICU for IV dextrose; Linh went with him.' }),
    clues: (s, P) => ({ crib: `Bassinet card: "Baby Boy Nguyen, 4.45 kg, 01:05." Under it, Linh's feeding log: "01:30 15 min. 04:00 10 min (sleepy)." Nothing after.`, family: `Linh, sitting up, a breast pump flange in its wrapper on the table. A glucose meter of her own in her bag: "I'm not supposed to need it anymore."`, bottle: `A syringe of donor milk, labeled with his name and the time.` }),
    rig: (s, P) => ({ sbp: 110, glu: sym(P) ? 30 : 95, tremor: sym(P) && P.glu >= 28 ? .6 : 0, alert: P.glu < 28 ? 2 : P.glu < 40 || P.temp < 36.4 ? 1 : 0, temp: bTemp(P) }),
    status: (s, P) => (P.gone ? 'gone' : sym(P) || P.glu < 30 ? 'urgent' : P.glu < 45 || P.temp < 36.5 ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.nicu) return { tone: 'bad', title: 'Hypoglycemic seizure, NICU', text: `Glucose ${Math.round(P.glu)} with a seizure at ${clock(P.goneAt)}. His 07:00 check ${P.checks.length ? 'came late' : 'was never done'}, and he hadn't fed since 04:00.` };
      if (P.nicuPlan) return { tone: 'mixed', title: 'To the NICU for IV dextrose, before a seizure', text: `${P.symAt !== null ? `Jittery at ${clock(P.symAt)}. ` : ''}Escalated at ${clock(P.called)}. Linh went with him and is pumping for him there.` };
      if (!P.checks.length) return { tone: 'bad', title: 'Glucose never checked', text: `An infant of a diabetic mother, due for a glucose at 07:00, and nobody checked it all morning.` };
      const last = P.checkVals[P.checkVals.length - 1], rechecked = P.checks.length >= 2;
      if (last >= 45 && rechecked && P.symAt === null) return { tone: 'good', title: 'Glucose back over 45', text: `${P.gels.length ? `Gel ×${P.gels.length}, ` : ''}fed${P.donor ? ' with donor milk' : ''}, rechecked: ${P.checkVals.join(', ')}. ${P.skin ? 'Warmed skin to skin. ' : ''}Still breastfeeding, which is what Linh wanted.` };
      return { tone: 'mixed', title: rechecked ? 'Glucose still low at handoff' : 'Treated, never rechecked', text: `Checks: ${P.checkVals.join(', ')}. ${rechecked ? 'He needs the next step of the protocol.' : 'The protocol\'s recheck an hour after treatment never happened.'}` };
    },
  };
  function checkGlu(s, P, A, by) {
    const g = Math.round(P.glu); P.checks.push(s.t); P.checkVals = (P.checkVals || []).concat(g); P.lastGlu = g;
    A.addLab('216', { name: 'Glucose (heel stick)', val: g, unit: 'mg/dL', ref: '4–24 h: 45 or more', flag: g < 45 ? 'L' : '' });
    if (P.checks.length === 1) A.judge('216-glu', 'assess', s.t <= 30 ? 2 : s.t <= 60 ? 1 : -1, s.t <= 30 ? `You checked Baby Nguyen's glucose on time.` : `You checked Baby Nguyen's glucose ${s.t} minutes late.`, `He's an infant of a diabetic mother: high insulin from months of high sugar, and the supply cut off at birth. The glucose before each feed is how you find the low before he shows it.`, '216');
    else if (P.gels.length || P.fed.length) { const after = Math.max(P.gels.length ? P.gels[P.gels.length - 1] : -999, P.fed.length ? P.fed[P.fed.length - 1] : -999); if (s.t - after >= 40 && !A.hasJudg('216-recheck')) A.judge('216-recheck', 'judgment', 2, `You rechecked Baby Nguyen's glucose after treating it.`, `An hour after gel and a feed is when the protocol decides the next step. Without the recheck, nobody knows whether it worked.`, '216'); }
    if (by !== 'You') A.log('216', `${by}: glucose ${g} mg/dL.`, 'find');
  }

  /* ---------- 218 Sarah Mercer: day 1 after a cesarean; a positive depression screen; Rh negative ---------- */
  const sarah = {
    id: '218', room: '218', name: 'Sarah Mercer', short: 'Ms. Mercer', age: 36, sex: 'F', mrn: '00731377', provider: 'brennan',
    look: { skin: '#EFD0B8', shade: '#D4AE96', lip: '#B4675F', blush: '#E99A8A', iris: '#5A7A5A', head: { w: 54, h: 61, jaw: .3 }, eye: 9.6,
      hair: { style: 'ponytail', color: '#7A5638' }, brow: { w: 3, color: '#5A3E28' }, body: { w: 80, cloth: 'gown' }, extras: ['thinGlasses'], glasses: '#6A5040', smile: .05, tired: true,
      lines: { calm: `I'm fine. Is it time to go home yet?`, pain: `The incision pulls when I move.`, anxious: `I'm just tired. Everyone keeps asking.`, drowsy: `Sorry, I didn't sleep.`, none: `She doesn't answer.` } },
    bio: `Architect. First baby, Miles, after three years of trying. Her husband Tom flew back from a work trip last night; her mother is in Ohio.`,
    dx: `Day 1 after cesarean`, reason: `Scheduled cesarean yesterday at 14:00 for breech at 39 weeks. Spinal anesthesia with intrathecal morphine. Rh negative.`,
    hx: [`Depression since her 20s; sertraline 100 mg, stopped when she found out she was pregnant`, `Three years of infertility treatment`, `Rh negative; baby Miles is Rh positive`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `68 kg`,
    lines: [`PIV 20g left hand: saline lock`, `Low transverse incision, dressing dry`], mobility: `Up in the room; walked twice`, diet: `Regular`,
    // Her depression screen and safety plan travel with her in report, whatever was or wasn't done about them.
    reportExtra: (s, P) => [{ label: `EPDS 15 with item 10 marked${P.si ? '; she told you she has had thoughts her family would be better off without her' : P.asked !== null ? '; asked directly about self-harm' : '; not yet asked about it'}. ${P.safety ? 'Room made safe' : 'No safety measures yet'}${P.comp ? ', companion with her' : ''}${P.consult ? ', psychiatry consulted' : ''}${P.called !== null ? ', provider aware' : ''}. Discharge ${P.consult || P.called !== null ? 'on hold' : 'still planned for 14:00'}.`, key: true }],
    init: { epdsSeen: false, asked: null, si: false, planAsked: false, dismissed: false, called: null, consult: false, safety: false, comp: false, rhig: null, itm: [-60], disclosed: false, disclosureSeen: false, oxyAt: null, dcAsk: false },
    nightVitals: { T: 36.9, HR: 78, SBP: 112, DBP: 68, RR: 16, SpO2: 98, O2: 'Room air', pain: 3 },
    labs: [
      { name: 'Blood type', val: 'A negative, antibody screen negative', unit: '', ref: '', flag: 'A', t: -1500 },
      { name: 'Cord blood (Miles)', val: 'B positive', unit: '', ref: '', flag: 'A', t: -1000 },
      { name: 'Fetal bleed screen (rosette)', val: 'Negative', unit: '', ref: '', flag: '', t: -600 },
      { name: 'Hemoglobin', val: 10.8, unit: 'g/dL', ref: '12.0–15.5', flag: 'L', t: -60 },
      { name: 'Edinburgh Postnatal Depression Scale', val: '15 (item 10 positive)', unit: '', ref: '10 or more, or any positive item 10: further assessment', flag: 'A', t: -30 },
    ],
    orders: [
      { t: -1000, text: `Post-cesarean order set. Intrathecal morphine given 14:00: respiratory rate and sedation every 2 hours for 24 hours (until 14:00 today). Ibuprofen 600 mg every 6 h, acetaminophen 1,000 mg every 6 h, oxycodone 5 mg every 4 h as needed for moderate to severe pain.` },
      { t: -1000, text: `Rh immune globulin 300 mcg IM within 72 hours of birth (blood bank to release; two-nurse verification). Edinburgh Postnatal Depression Scale before discharge.` },
      { t: -300, text: `Anticipate discharge today, 14:00, if meeting milestones.` },
    ],
    notes: [
      { t: -30, author: 'Paloma, night RN', text: `Walked to the bathroom twice. Pain 3–4/10 on scheduled meds. Miles breastfeeding every 2–3 h. EPDS done at 06:30 per the discharge checklist: 15. Will need follow-up. Tom arriving about 10:00.` },
    ],
    io: { intake: `Eating and drinking`, output: `Voiding after Foley removal` },
    report: [
      { text: `Sarah Mercer, 36, day one after a scheduled C-section for breech. Doing well physically. She's walked twice.`, key: false },
      { text: `I did her depression screen this morning for discharge. It came out kind of high, fifteen. I didn't get to talk to her about it. She's probably just exhausted.`, key: true },
      { text: `She wants to go home today. Her husband's flying in; he'll be here around ten.`, key: true },
      { text: `She's Rh negative and the baby's positive. Her RhoGAM's coming up from blood bank.`, key: true },
      { text: `Her intrathecal morphine checks are every two hours until two. Last one was at six.`, key: true },
      { text: `She's an architect. She redesigned the whiteboard.`, key: false },
    ],
    vitals(s, P) { return { T: 36.9, HR: 78 + jit(s, 8) * 2, SBP: 112 + jit(s, 9) * 2, DBP: 68, RR: 16, SpO2: 98, O2: 'Room air', pain: 3 }; },
    assess: {
      general: (s, P) => (P.si && !P.called ? `Sitting very still, staring at the window. Miles is asleep in the bassinet, turned away from her.` : `Sitting up, tidy, polite. Flat voice. Doesn't look at the bassinet much.`),
      resp: () => `RR 16, unlabored. Clear.`,
      cardiac: () => `HR 78, regular. No calf tenderness or swelling.`,
      neuro: (s, P) => { P.k.mood = s.t; return `Alert, oriented. Affect flat, answers short. Says she's sleeping "maybe two hours, even when he sleeps." Feels "nothing" when she holds Miles. ${P.asked !== null ? '' : 'You haven\'t asked her about the screen yet.'}`; },
      pain: () => `Incision 3/10 on scheduled ibuprofen and acetaminophen.`,
      skin: () => `Incision dressing dry and intact. Fundus firm, 1 cm below the umbilicus. Lochia moderate.`,
      gi: () => `Passing gas, eating. Bowel sounds present.`,
    },
    interventions: [
      { id: 'epds', label: 'Read her depression screen, answer by answer', cost: 2, run(s, P, A) { P.epdsSeen = true; A.judge('218-epds', 'assess', 2, `You read Ms. Mercer's depression screen item by item.`, `The total tells you how much; item 10 tells you whether she's safe. Any positive answer to item 10 needs a direct conversation the same day, whatever the total.`, '218'); return `EPDS 15. Item 3 (blamed myself unnecessarily): "Yes, most of the time." Item 4 (anxious or worried): "Yes, very often." Item 8 (sad or miserable): "Yes, quite often." Item 10, "The thought of harming myself has occurred to me": "Hardly ever."`; } },
      { id: 'itm', label: 'Respiratory rate and sedation check (intrathecal morphine)', cost: 2, run(s, P, A) { const late = s.t - P.itm[P.itm.length - 1] > 150; P.itm.push(s.t); if (P.itm.length === 2) A.judge('218-itm', 'assess', late ? 0 : 1, `You did Ms. Mercer's intrathecal morphine check${late ? ', late' : ''}.`, `Intrathecal morphine can cause delayed respiratory depression up to 24 hours after the dose. Count the breaths for a full minute and score sedation.`, '218'); return `RR 16, counted a full minute. Sedation: awake and alert (POSS 1). SpO₂ 98%.`; } },
      { id: 'resources', label: 'Give her and Tom the Postpartum Support International and 988 information', cost: 4, avail: (s, P) => P.consult && !P.resources, run(s, P, A) { P.resources = true; A.judge('218-resources', 'comm', 1, `You gave Ms. Mercer and her husband the support numbers.`, `Families are often the first to notice things getting worse at home. Both of them should know who to call, day or night.`, '218'); return `You write both numbers on the whiteboard and on a card for Tom's wallet. He photographs the card. Sarah says, quietly, "Okay."`; } },
      { id: 'safety', label: 'Safety: remove cords and extra meds, arrange a companion until psychiatry sees her', cost: 4, avail: (s, P) => (P.si || P.consult) && !P.safety, run(s, P, A) { P.safety = true; A.judge('218-safety', 'safety', 2, `You made Ms. Mercer's room safer and arranged for someone to stay with her.`, `With any suicidal thought, the environment is part of the care: no cords, no stockpiled pills, and someone with her until she's been evaluated.`, '218'); return `Phone charger cords and the breast pump tubing kit moved to the station. Her bag checked with her permission: no medications. Mei will sit with her until Tom arrives.`; } },
    ],
    meds: [
      {
        id: '218-rhig', name: 'Rh immune globulin (RhoGAM)', dose: '300 mcg', route: 'IM', freq: 'Once, within 72 h of birth', due: 120,
        checks: () => [{ label: 'Mother', value: 'A negative, antibody screen negative', ok: true }, { label: 'Baby', value: 'B positive', ok: true }, { label: 'Fetal bleed screen', value: 'Negative: one 300 mcg dose is enough', ok: true }, { label: 'Blood bank release', value: 'Lot matched, second nurse verified', ok: true }],
        doses: [{ id: 1, label: '300 mcg IM, deltoid' }, { id: 2, label: '300 mcg IV push' }, { id: 3, label: 'Hold it for her 6-week visit' }],
        give(s, P, A, dose) {
          P.rhig = dose;
          if (dose === 3) { A.judge('218-rhig', 'meds', -2, `You postponed Ms. Mercer's Rh immune globulin to her 6-week visit.`, `It has to be given within 72 hours of birth to prevent sensitization. Miss the window and her next Rh-positive baby is at risk.`, '218'); return `Held.`; }
          A.judge('218-rhig', 'meds', dose === 1 ? 1 : -2, dose === 1 ? `You gave Ms. Mercer her Rh immune globulin.` : `You gave RhoGAM IV.`, dose === 1 ? `Rh negative mother, Rh positive baby, negative antibody screen: 300 mcg IM within 72 hours keeps her from making antibodies that would attack a future baby.` : `RhoGAM is for IM use only. Some Rh immune globulins can be given IV; this one can't.`, '218');
          return dose === 1 ? `RhoGAM 300 mcg IM, left deltoid, after the two-nurse check. Wallet card given.` : `RhoGAM 300 mcg IV.`;
        },
        hold(s, P, A) { A.judge('218-rhig-hold', 'meds', -1, `You held Ms. Mercer's Rh immune globulin.`, `There's a 72-hour window, and she's hoping to go home today. Give it before discharge.`, '218'); return 'Held.'; },
      },
      { id: '218-ibu', name: 'Ibuprofen', dose: '600 mg', route: 'PO', freq: 'Every 6 h', due: 60, checks: () => [{ label: 'Creatinine', value: '0.7', ok: true }], give: () => `Ibuprofen 600 mg with breakfast.` },
      { id: '218-oxy', name: 'Oxycodone', dose: '5 mg', route: 'PO', freq: 'Every 4 h as needed, moderate to severe pain', prn: true, checks: (s, P) => [{ label: 'Pain', value: '3/10', ok: false }, { label: 'Last sedation check', value: clock(P.itm[P.itm.length - 1]), ok: s.t - P.itm[P.itm.length - 1] <= 120 }], give(s, P, A) { P.oxyAt = s.t; A.judge('218-oxy', 'meds', -1, `You gave oxycodone for pain of 3/10.`, `Her pain is mild and controlled on scheduled medicines, and the intrathecal morphine is still active. Opioids on top add sedation without a reason.`, '218'); return `Oxycodone 5 mg.`; } },
    ],
    talk: (s, P) => (P.asked === null ? 'sarah_talk' : P.si && !P.planAsked ? 'sarah_si' : 'sarah_after'),
    sbar: {
      items(s, P) {
        return [
          { id: 'epds', label: 'EPDS 15 this morning', key: true, need: true },
          { id: 'item10', label: 'Item 10 positive: thoughts of harming herself "hardly ever"', key: true, need: P.epdsSeen || P.asked !== null, lock: 'Read the screen' },
          { id: 'si', label: 'Passive suicidal thoughts ("they\'d be better off without me"), no plan, no intent', key: true, need: P.si, lock: 'Ask her' },
          { id: 'hx', label: 'History of depression; stopped sertraline 100 mg in pregnancy', key: true, need: true },
          { id: 'sleep', label: 'Not sleeping when the baby sleeps; feels nothing holding him', key: false, need: P.k.mood !== undefined, lock: 'Assess her mood' },
          { id: 'dc', label: 'Planned discharge today at 14:00', key: true, need: true },
          { id: 'arch', label: 'Redesigned the unit whiteboard', key: false, need: true },
        ];
      },
      requests: [
        { id: 'psych', label: 'Positive screen with passive suicidal thoughts. Can we hold discharge, get psychiatry to see her today, and talk about restarting treatment?' },
        { id: 'dc', label: 'She\'s tearful but stable and wants to go home. Okay to discharge with the postpartum depression handout?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'dc') { A.judge('218-sbar-dc', 'judgment', P.si || P.epdsSeen ? -3 : -2, `You asked to discharge Ms. Mercer with a positive item 10.`, `A positive answer to the self-harm question needs a same-day assessment before she leaves. A handout isn't a safety plan.`, '218'); return P.si ? `Wait, she's having suicidal thoughts? No. Nobody discharges her until psychiatry sees her.` : `What was her EPDS? Did anyone ask her about item 10?`; }
        if (!picked.includes('item10') && !picked.includes('si')) return `A 15 is high. What did she say on the self-harm question? Has anyone asked her directly?`;
        if (P.called === null) P.called = s.t;
        if (!P.consult) { P.consult = true; A.addOrder('218', `Hold discharge. Psychiatry consult today. Safety companion until psychiatry has seen her. Sertraline 50 mg PO daily may start after the consult (compatible with breastfeeding). Social work. Postpartum Support International and 988 information to patient and husband.`); }
        A.judge('218-sbar', 'comm', P.si ? 2 : 1, `You called about Ms. Mercer's positive screen.`, `Screen, ask, then escalate: a positive item 10 isn't a judgment call to keep on the unit. ${P.si ? 'You brought what she actually told you.' : 'Ask her directly, too; the provider will.'}`, '218');
        return P.si ? `Thank you for asking her. Discharge is on hold; I'll call psychiatry now. Someone with her until they see her. Her history matters: she'll likely do well back on sertraline.` : `Okay. Have you asked her directly about suicidal thoughts? Do that now. I'm calling psychiatry either way; discharge is on hold.`;
      },
    },
    scene: (s, P) => ({ crib: true, iv: 'lock', tray: 'eaten', flowers: true, consent: true, family: null, empty: false }),
    clues: (s, P) => ({ flowers: `A huge bouquet from her firm. The card is unopened.`, crib: `Miles asleep in the bassinet. It's been turned so he faces the window, away from her bed.`, consent: `Discharge checklist on a clipboard. Every box ticked except "EPDS reviewed with patient."`, tray: `Breakfast, eaten neatly. Napkin folded.` }),
    rig: () => ({ anxious: .2, pain: 3 }),
    status: (s, P) => (P.si && !P.safety && P.called === null ? 'urgent' : P.asked === null || P.rhig === null ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.asked === null && !P.disclosureSeen) return { tone: 'bad', title: 'Positive screen, never discussed', text: `Her EPDS of 15 with a positive item 10 sat in the chart all morning. Discharge at 14:00 was still on.` };
      if (P.si && P.called === null) return { tone: 'bad', title: 'Suicidal thoughts, not escalated', text: `She told ${P.asked !== null ? 'you' : 'Mei'} she thought her family would be better off without her. Nobody called, and discharge at 14:00 was still on.` };
      if (P.called !== null && P.asked !== null && (P.safety || !P.si)) return { tone: P.rhig === 1 ? 'good' : 'mixed', title: 'Asked, heard, and kept safe', text: `${P.asked !== null ? 'You asked her directly. ' : ''}Discharge on hold, psychiatry seeing her this afternoon, Tom with her.${P.rhig === 1 ? ' RhoGAM given.' : ' Her RhoGAM still needs to go in.'}` };
      return { tone: 'mixed', title: 'Escalated, loose ends', text: `${P.asked === null ? 'Nobody asked her directly. ' : ''}${P.si && !P.safety ? 'No one was with her while she waited. ' : ''}${P.rhig !== 1 ? 'RhoGAM not given. ' : ''}` };
    },
  };

  /* ---------- dialogs ---------- */
  const dialogs = {
    kei_talk: { who: '212', text: `"Is it normal to cramp this much? It's way worse than with Nia." She presses a hand low on her belly.`, choices: [
      { label: `Afterpains are often stronger with a second baby, and when you breastfeed. But cramping can also mean your uterus is working to stay firm, so let me feel it and look at your bleeding.`, next: 'kei_a', fx: (s, A) => { s.p['212'].k.talked = s.t; A.judge('212-talk', 'assess', 1, `You checked before you reassured Ms. Brown about her cramping.`, `Afterpains are common. So is atony. The difference is the fundus.`, '212'); } },
      { label: `That's just afterpains. Totally normal with a second baby.`, next: 'kei_b', fx: (s, A) => { s.p['212'].k.talked = s.t; A.judge('212-talk', 'judgment', -1, `You called Ms. Brown's cramping afterpains without checking.`, `Probably right, and still a guess until you've felt her fundus.`, '212'); } },
    ] },
    kei_a: { who: '212', text: `"Okay." She lifts the blanket. "Desmond will be back by nine. He'll want to know everything you're doing."` },
    kei_b: { who: '212', text: `"Okay. If you say so." She shifts and winces.` },
    kei_gush: { who: '212', text: `"I just felt a big gush when I shifted. Like I wet myself, but warm." She looks at the blanket. "Is that a lot?"`, choices: [
      { label: `Let me look at your pad and feel your uterus right now.`, next: 'kei_c', fx: (s, A) => { const P = s.p['212']; P.k.talkGush = s.t; A.judge('212-gush', 'assess', 2, `You assessed Ms. Brown when she reported a gush.`, `A gush when she moves can be pooled blood, or it can be a hemorrhage starting. Look, feel, weigh.`, '212'); } },
      { label: `Some gushing when you move is normal after birth. Blood pools when you lie still.`, next: 'kei_d', fx: (s, A) => { const P = s.p['212']; P.k.talkGush = s.t; A.judge('212-gush', 'judgment', -2, `You told Ms. Brown the gush was normal without looking.`, `Pooling is common, and it's also what a hemorrhage sounds like at first. The pad and the fundus tell you which.`, '212'); } },
    ] },
    kei_c: { who: '212', text: `"Last time, with Nia, I told them something felt wrong and they said I was being dramatic." She watches your hands. "I'm glad you're looking."` },
    kei_d: { who: '212', text: `"Okay." She pulls the blanket back over and closes her eyes.` },
    kei_after: { who: '212', text: `"Nia wants to know if Pickle can come to show and tell." She laughs. "I said maybe in kindergarten."` },
    kei_sob: { who: '212', text: `She's sitting forward, wheezing. "Can't — get air. My inhaler — in my bag."` },

    lani_talk: { who: '214', text: `"I feel like I'm made of sand. Hot sand." She blinks slowly. "Can I hold Mālia? Kainoa won't wake up."`, choices: [
      { label: `The magnesium makes you feel hot and heavy. It's there to prevent seizures. I'll check your reflexes and breathing every hour while it runs. Let's wake Kainoa so he can bring her to you in bed.`, next: 'lani_a', fx: (s, A) => { s.p['214'].k.talked = s.t; A.judge('214-talk', 'comm', 1, `You explained the magnesium to Ms. Kealoha and kept her baby with her safely.`, `She can hold her baby in bed with someone there. Knowing why she feels awful makes it easier to tell you if it gets worse.`, '214'); } },
      { label: `That's just the medicine. Try to rest.`, next: 'lani_b', fx: (s, A) => { s.p['214'].k.talked = s.t; A.judge('214-talk', 'comm', -1, `You brushed off how Ms. Kealoha feels on magnesium.`, `How heavy and sleepy she feels is part of your magnesium assessment. Ask, and explain.`, '214'); } },
    ] },
    lani_a: { who: '214', text: `"Okay." A small smile. "She has his ears. Don't tell him."` },
    lani_b: { who: '214', text: `She closes her eyes again.` },
    lani_head: { who: '214', text: `"My head is pounding. Right behind my eyes. And the light hurts." She covers her face with her arm.`, choices: [
      { label: `A headache with your blood pressure is something I take seriously. I'm going to check your pressure right now and tell your doctor.`, next: 'lani_c', fx: (s, A) => { const P = s.p['214']; P.k.talkHead = s.t; A.judge('214-head', 'assess', 2, `You connected Ms. Kealoha's headache to her blood pressure.`, `A new or worse headache in preeclampsia is a severe feature. The pressure is the first thing to check.`, '214'); } },
      { label: `I'll get you some Tylenol and dim the lights.`, next: 'lani_d', fx: (s, A) => { const P = s.p['214']; P.k.talkHead = s.t; A.judge('214-head', 'judgment', -2, `You treated Ms. Kealoha's headache as just a headache.`, `In preeclampsia, a headache that won't quit is a warning of stroke or eclampsia. Check the pressure first.`, '214'); } },
    ] },
    lani_c: { who: '214', text: `"Okay. Thank you." She squeezes your hand weakly.` },
    lani_d: { who: '214', text: `"Thanks." She turns her face to the wall.` },
    lani_drowsy: { who: '214', text: `She opens her eyes when you say her name, then they drift closed. Her breathing is slow and shallow.` },
    lani_after: { who: '214', text: `"Kainoa says Mālia has his ears." She rolls her eyes. "She has my ears."` },
    kai_talk: { who: 'kainoa', pid: '214', text: `Kainoa sits up fast. "Sorry. Is she okay? She's so sleepy. Is that the drip?"`, choices: [
      { label: `It's the magnesium; it's protecting her from seizures and it makes her drowsy. You're my extra eyes: if she gets much harder to wake, breathes slowly, says her head is bad or her vision changes, press the call light right away.`, next: 'kai_a', fx: (s, A) => { const P = s.p['214']; P.k.kainoa = s.t; A.judge('214-kai', 'comm', 1, `You taught Kainoa what to watch for.`, `Family at the bedside see changes first. Tell them exactly what to look for and how to get you.`, '214'); } },
      { label: `She's fine. Get some more sleep while you can.`, next: 'kai_b', fx: (s, A) => { const P = s.p['214']; P.k.kainoa = s.t; A.judge('214-kai', 'comm', -1, `You told Kainoa she was fine.`, `He's in the room more than you are. False reassurance takes away your best monitor.`, '214'); } },
    ] },
    kai_a: { who: 'kainoa', pid: '214', text: `"Harder to wake, slow breathing, headache, vision. Call light." He says it back and moves the recliner closer to the bed.` },
    kai_b: { who: 'kainoa', pid: '214', text: `"Okay." He pulls the blanket back up.` },
    kai_after: { who: 'kainoa', pid: '214', text: `"I've been watching her breathing. Sixteen a minute. I counted." He shows you his phone timer.` },

    baby_hold: { who: '216', text: (s) => { const P = s.p['216']; return P.glu < 28 ? `He's floppy in your hands, pale, and doesn't root at all.` : sym(P) ? `His arms tremble against your chest in quick jerks. He roots weakly at your scrubs and gives up.` : P.temp < 36.5 ? `He's sleepy and a little cool through the blanket. His feet are mottled. He doesn't wake when you lift him.` : `He's warm and solid, and he roots at your shoulder, mouth wide.`; } },
    linh_talk: { who: 'linh', pid: '216', text: `"He's been asleep since four. He won't wake up to eat. Is that normal?" She holds up a hand before you answer. "And please. No formula. I worked so hard to get here and I read that formula ruins breastfeeding."`, choices: [
      { label: `Sleepy babies of moms with diabetes can mean low sugar, so I'm going to check it now. If he needs more than your colostrum, there's a sugar gel for his cheek, and donor breast milk, which isn't formula. We'll decide together.`, next: 'linh_a', fx: (s, A) => { const P = s.p['216']; P.k.linhTalked = s.t; P.linhOk = true; A.judge('216-linh', 'comm', 2, `You took Linh's worry seriously and planned with her.`, `She's right that he's too sleepy. A plan that protects his glucose and her breastfeeding goal is possible: gel, colostrum, donor milk.`, '216'); } },
      { label: `His sugar's probably low. He needs formula now, that's the safest thing.`, next: 'linh_b', fx: (s, A) => { const P = s.p['216']; P.k.linhTalked = s.t; A.judge('216-linh', 'comm', -1, `You told Linh her baby needed formula before you'd checked.`, `Check first. And formula isn't the only option: gel and donor milk respect what she's asked for.`, '216'); } },
      { label: `Babies are sleepy on the first day; being born is hard work. Let him sleep, he'll wake when he's hungry, and waking a baby who's finally resting just makes the next feed harder for both of you. You should sleep while he does. I'll check on you both later.`, next: 'linh_c', fx: (s, A) => { const P = s.p['216']; P.k.linhTalked = s.t; A.judge('216-linh', 'judgment', -2, `You told Linh a sleepy baby of a diabetic mother should keep sleeping.`, `Many newborns are sleepy. This one is at risk of hypoglycemia and hasn't fed in three hours: sleepiness is a symptom until his glucose says otherwise.`, '216'); } },
    ] },
    linh_a: { who: 'linh', pid: '216', text: `She lets out a breath. "Okay. Donor milk is okay. I'll pump too." She pulls the pump out of its wrapper.` },
    linh_b: { who: 'linh', pid: '216', text: `"No." She pulls him closer. "I want to talk to the pediatrician first."` },
    linh_c: { who: 'linh', pid: '216', text: `"Okay." She doesn't look convinced. She keeps glancing at him.` },
    linh_after: { who: 'linh', pid: '216', text: `"I've written down every feed." She shows you the log. "I know. I'm a pharmacy tech. I can't help it."` },

    sarah_talk: { who: '218', text: `"I'm fine. Really. Can I go home today?" She folds and refolds the edge of the blanket.`, choices: [
      { label: `I'd like to talk about the questionnaire you filled out this morning. You marked that thoughts of harming yourself have come up. Are you having thoughts of killing yourself?`, next: 'sarah_si', fx: (s, A) => { const P = s.p['218']; P.asked = s.t; P.si = true; A.judge('218-ask', 'assess', 2, `You asked Ms. Mercer directly about suicide.`, `Asking directly doesn't plant the idea. It opens the door. A positive item 10 is the reason to ask today, in plain words.`, '218'); } },
      { label: `You scored a little high on the mood screen. That's really common; it's the baby blues. You'll feel better once you're home.`, next: 'sarah_b', fx: (s, A) => { const P = s.p['218']; P.asked = s.t; P.dismissed = true; A.judge('218-ask', 'comm', -2, `You called Ms. Mercer's positive screen the baby blues.`, `A score of 15 and a positive item 10, with a history of depression, isn't the blues. The door you closed was the one she needed open.`, '218'); } },
      { label: `You're not thinking about hurting yourself, are you?`, next: 'sarah_c', fx: (s, A) => { const P = s.p['218']; P.asked = s.t; P.leading = true; A.judge('218-ask', 'comm', -1, `You asked Ms. Mercer about self-harm in a way that expected "no."`, `"You're not..., are you?" tells her the answer you want. Ask plainly and neutrally.`, '218'); } },
    ] },
    sarah_si: { who: '218', text: `She's quiet for a long time. "Not killing myself. I wouldn't. It's just... sometimes I think Tom and Miles would be better off without me. That someone else would be a better mother." She doesn't look at the bassinet.`, choices: [
      { label: `Thank you for telling me. That took courage. Have you thought about how you might hurt yourself, or made any plans?`, next: 'sarah_plan', fx: (s, A) => { const P = s.p['218']; P.planAsked = true; A.judge('218-plan', 'assess', 2, `You asked Ms. Mercer about a plan.`, `Thoughts, plan, intent, means, past attempts. The answers set how urgent the next step is.`, '218'); } },
      { label: `Miles needs you. Think about how much he needs his mom.`, next: 'sarah_d', fx: (s, A) => { const P = s.p['218']; P.planAsked = true; A.judge('218-plan', 'comm', -1, `You answered Ms. Mercer's suicidal thoughts with her baby.`, `Well meant, but it adds guilt, which is already part of what she's feeling. Thank her, then ask about a plan.`, '218'); } },
    ] },
    sarah_plan: { who: '218', text: `"No. Nothing like that. I'd never. I just can't make the thought stop." She looks at you. "Please don't tell anyone. They'll think I can't take care of him. They'll take him."`, choices: [
      { label: `I can't keep this between us, because it's about your safety. Nobody is taking Miles. This is common, it's treatable, and your history tells us what helps. I'm going to get your doctor, and someone will stay with you.`, next: 'sarah_e', fx: (s, A) => { A.judge('218-secret', 'comm', 2, `You were honest with Ms. Mercer about what happens next.`, `Never promise secrecy about safety. Say what you'll do and why, and answer the fear underneath: that she'll lose her baby.`, '218'); } },
      { label: `Okay. It can stay between us if you promise to tell your OB at your checkup.`, next: 'sarah_f', fx: (s, A) => { const P = s.p['218']; P.secret = true; A.judge('218-secret', 'safety', -3, `You promised Ms. Mercer you'd keep her suicidal thoughts secret.`, `Suicidal thoughts are never kept confidential from the team. A six-week checkup is too far away.`, '218'); } },
    ] },
    sarah_b: { who: '218', text: `"Right. The blues." She nods and looks at the window. "That's what I figured."` },
    sarah_c: { who: '218', text: `"No. Of course not." She smiles too quickly.` },
    sarah_d: { who: '218', text: `Her eyes fill. "I know. That's what makes it worse."` },
    sarah_e: { who: '218', text: `She's crying now, but she nods. "Can you call Tom? I don't want to say it on the phone again."` },
    sarah_f: { who: '218', text: `"Thank you." She wipes her eyes and picks up the discharge checklist.` },
    sarah_after: { who: '218', text: (s) => (s.p['218'].called !== null ? `"Tom's almost here. I told him." She takes a breath. "He said he's been worried for months and didn't know how to ask."` : `"Is my doctor coming? You said someone would come." She's holding the clipboard very tightly.`) },
  };

  /* ---------- events ---------- */
  const A0 = (s) => Object.keys(s.p).every((id) => s.p[id].seenAt === null);
  const events = [
    // People who say they're coming arrive: Dr. Brennan after the bleeding call, the hemorrhage team after the page.
    { id: 'brennan-here', when: (s) => { const P = s.p['212']; return P.mdComing !== undefined && !P.gone && s.t >= P.mdComing + 12; }, run(s, A) { const P = s.p['212']; P.mdHere = s.t; A.log('212', `Dr. Brennan at the bedside: bimanual exam, ${P.tone > .55 ? 'still boggy; she stays to manage it with you' : 'uterus firm now'}. Plan reviewed with you.`, 'info'); A.msg({ from: 'brennan', pid: '212', text: `I'm in 212. ${P.carboAsked && !P.carbo ? 'And I see the asthma on her chart: no Hemabate. Misoprostol if she needs a third drug.' : 'Thanks for the call.'}` }); } },
    { id: 'pph-team', when: (s) => { const P = s.p['212']; return P.rrtAt !== undefined && !P.gone && s.t >= P.rrtAt + 6; }, run(s, A) { const P = s.p['212']; P.teamHere = s.t; A.log('212', 'Obstetric hemorrhage team at the bedside: anesthesia, the OB hospitalist and 2 units of blood. A second IV is in and labs are sent.', 'info'); A.msg({ from: 'nova', pid: '212', text: `The hemorrhage team is in 212: anesthesia, the OB hospitalist, and blood at the bedside.` }); } },
    { id: 'aide-hi', when: (s) => s.t >= 3, run(s, A) { A.msg({ from: 'mei', text: `Morning! I've got your four rooms. 216's sugar is due and he's out cold. Want me to start vitals?`, replies: [{ label: 'Open tasks for Mei', act: 'delegate' }] }); } },
    { id: 'linh-sleepy', when: (s) => s.t >= 10 && !s.p['216'].checks.length, run(s, A) { A.msg({ from: 'mei', pid: '216', text: `216's mom says he won't wake up to eat and she's asking if that's normal.`, replies: [{ label: 'I\'ll go see him', act: 'goto', pid: '216' }, { label: 'First day, babies sleep. It\'s fine.', act: 'baby-fine' }] }); } },
    { id: 'kei-gush', when: (s) => { const P = s.p['212']; return s.t >= 20 && !P.gone && P.tone > .55 && P.fundusAt === null; }, run(s, A) { A.msg({ from: 'mei', pid: '212', text: `212 says she felt a big gush when she moved. Her pad's pretty full. Want me to change it?`, replies: [{ label: 'Weigh it before you toss it. I\'m coming.', act: 'kei-weigh' }, { label: 'Yes, change it, thanks', act: 'kei-change' }] }); } },
    { id: 'bb-rhig', when: (s) => s.t >= 45, run(s, A) { A.msg({ from: 'bb', pid: '218', text: `Blood bank. RhoGAM 300 mcg for 218 Mercer is ready. Pick up with a second RN to verify.` }); } },
    { id: 'kei-faint', when: (s) => { const P = s.p['212']; return !P.gone && P.qbl >= 1000 && P.called === null; }, run(s, A) { A.msg({ from: 'mei', pid: '212', urgent: true, text: `212 is really pale and says she feels faint. There's blood on the floor by the bed.`, replies: [{ label: 'Go to 212', act: 'goto', pid: '212' }] }); } },
    { id: 'kei-out', when: (s) => { const P = s.p['212']; return !P.gone && P.qbl >= 1600; }, run(s, A) { const P = s.p['212']; P.gone = true; P.goneAt = s.t; P.goneText = 'Back to Labor and Delivery for a hemorrhage'; A.judge('212-pph', 'safety', -3, `Ms. Brown hemorrhaged.`, `A full bladder, a long oxytocin induction, a big baby: the risk factors were in report. A boggy, displaced fundus is found by feeling for it.`, '212'); A.msg({ from: 'nova', pid: '212', urgent: true, text: `Obstetric hemorrhage in 212. QBL over 1,600, BP ${kSBP(P)}. She's going back to L&D for a balloon and blood.` }); } },
    { id: 'kei-wheeze', when: (s) => { const P = s.p['212']; return P.bronch && s.t >= P.bronchAt + 8 && !P.gone; }, run(s, A) { A.msg({ from: 'mei', pid: '212', urgent: true, text: `212 is wheezing really loud and her sat is 89. She says her chest is tight.`, replies: [{ label: 'Go to 212', act: 'goto', pid: '212' }] }); } },
    { id: 'lani-sev', when: (s) => s.t >= 95 && !s.p['214'].icu, run(s, A) { const P = s.p['214']; P.sevAt = s.t; A.recordVitals('214', 'Mei (CNA)'); A.msg({ from: 'mei', pid: '214', urgent: true, text: `214's pressure is ${lSBP(P)}/${lDBP(P)}. She says her head is pounding.`, replies: [{ label: 'I\'m coming to recheck it', act: 'goto', pid: '214' }, { label: 'Recheck it in 30 minutes and let me know', act: 'lani-later' }] }); } },
    { id: 'lani-sparkle', when: (s) => { const P = s.p['214']; return P.sevAt !== null && P.firstBpMed === null && s.t >= P.sevAt + 45 && !P.icu; }, run(s, A) { const P = s.p['214']; P.sparkles = true; A.msg({ from: 'mei', pid: '214', urgent: true, text: `214 says she's seeing sparkles at the edges and her head's worse.`, replies: [{ label: 'Go to 214', act: 'goto', pid: '214' }] }); } },
    { id: 'lani-level', when: (s) => { const P = s.p['214']; return P.levelDue !== undefined && s.t >= P.levelDue; }, run(s, A) { const P = s.p['214']; P.levelAt = s.t; P.levelVal = P.mg.toFixed(1); A.addLab('214', { name: 'Magnesium', val: +P.mg.toFixed(1), unit: 'mg/dL', ref: 'therapeutic 4.8–8.4', flag: P.mg > 8.4 ? 'H' : '' }); A.addLab('214', { name: 'Creatinine', val: 1.5, unit: 'mg/dL', ref: '0.5–0.9 in pregnancy', flag: 'H' }); A.msg({ from: 'lab', pid: '214', text: `Stat magnesium on 214 Kealoha: ${P.mg.toFixed(1)} mg/dL.` }); } },
    { id: 'lani-slow', when: (s) => { const P = s.p['214']; return !P.icu && lRR(s, P) < 12 && !recent(s, P.caAt, 60); }, run(s, A) { A.msg({ from: 'mei', pid: '214', urgent: true, text: `214 is really hard to wake up. She's breathing slow, like 10. Kainoa's freaking out.`, replies: [{ label: 'Go to 214', act: 'goto', pid: '214' }] }); } },
    { id: 'lani-arrest', when: (s) => { const P = s.p['214']; return !P.icu && P.mg >= 13; }, run(s, A) { const P = s.p['214']; P.icu = true; P.goneAt = s.t; P.goneText = 'To the ICU after respiratory depression'; A.judge('214-arrest', 'safety', -3, `Ms. Kealoha stopped breathing from magnesium toxicity.`, `Urine output under 30 for hours, a rising creatinine and fading reflexes: magnesium was accumulating, and every sign of it was on the hourly checks.`, '214'); A.msg({ from: 'nova', pid: '214', urgent: true, text: `Rapid response 214: RR 6, unresponsive. Bagging her, calcium in, mag off. She's going to the ICU.` }); } },
    { id: 'baby-sym', when: (s) => { const P = s.p['216']; return !P.gone && sym(P) && P.symAt === null; }, run(s, A) { const P = s.p['216']; P.symAt = s.t; A.msg({ from: 'mei', pid: '216', urgent: true, text: `216's mom says he's shaking. His arms keep trembling and he won't latch.`, replies: [{ label: 'Go to 216', act: 'goto', pid: '216' }] }); } },
    { id: 'baby-seize', when: (s) => { const P = s.p['216']; return !P.gone && P.glu < 24; }, run(s, A) { const P = s.p['216']; P.nicu = true; P.gone = true; P.goneAt = s.t; P.goneText = 'To the NICU after a seizure'; A.judge('216-seizure', 'safety', -3, `Baby Nguyen had a hypoglycemic seizure.`, `An infant of a diabetic mother, a glucose due at 07:00, no feed since 04:00: the protocol finds the low before the brain does.`, '216'); A.msg({ from: 'nova', pid: '216', urgent: true, text: `216 is seizing. Glucose 18. NICU's here; D10 bolus going in. Linh's with him.` }); } },
    { id: 'baby-nicu', when: (s) => { const P = s.p['216']; return P.nicuPlan && !P.gone && s.t >= P.nicuAt; }, run(s, A) { const P = s.p['216']; P.gone = true; P.goneAt = s.t; P.goneText = 'To the NICU for IV dextrose'; A.msg({ from: 'lin', pid: '216', text: `NICU's taking him for IV dextrose. Linh's going too. Thanks for calling early.` }); } },
    { id: 'sarah-says', when: (s) => { const P = s.p['218']; return s.t >= 140 && (P.asked === null || (!P.si && (P.dismissed || P.leading))); }, run(s, A) { const P = s.p['218']; P.disclosed = true; A.msg({ from: 'mei', pid: '218', urgent: true, text: `218 was crying when I did her vitals. She said Tom and the baby would be better off without her. I didn't know what to say.`, replies: [{ label: 'Stay with her. I\'m coming now.', act: 'sarah-go' }, { label: 'New moms get emotional. She\'ll be okay.', act: 'sarah-blues' }] }); } },
    { id: 'tom', when: (s) => s.t >= 180, run(s, A) { const P = s.p['218']; A.msg({ from: 'mei', pid: '218', text: P.called !== null ? `218's husband is here. He's sitting with her.` : `218's husband is here. He's asking when they can leave.` }); } },
    { id: 'nova-idle', when: (s) => s.t >= 45 && s.t < 120 && A0(s), run(s, A) { A.msg({ from: 'nova', urgent: true, text: `It's almost eight and you haven't been in a room. On mother-baby the dangerous things are quiet: a soft uterus, a sleepy baby. Go put your hands on them.` }); } },
    { id: 'nova-30', when: (s) => s.t >= 270 && !(s.report && Object.keys(s.report).length), run(s, A) { A.msg({ from: 'nova', text: `Thirty minutes to handoff. Maya's taking your rooms. Mothers and babies both, every number.` }); } },
  ];

  const replies = {
    'baby-fine'(s, A) { A.judge('216-sleepy', 'judgment', -2, `You told Linh it was fine that her baby wouldn't wake.`, `For an infant of a diabetic mother, a baby too sleepy to feed is a symptom until his glucose says otherwise.`, '216'); },
    'kei-weigh'(s, A) { const P = s.p['212']; P.qblSeen = true; P.qblAt = s.t; P.qblPrev = null; P.qblLast = Math.round(P.qbl); A.judge('212-weigh', 'assess', 1, `You had Ms. Brown's pad weighed before it was thrown out.`, `A pad in the trash is blood loss nobody counted.`, '212'); A.msg({ from: 'mei', pid: '212', text: `Pad and chux weighed: ${Math.round(kRate(P) * 30 + 140)} grams. QBL since birth is now about ${Math.round(P.qbl)}.` }); },
    'kei-change'(s, A) { A.judge('212-weigh', 'assess', -1, `The pad from Ms. Brown's gush went in the trash unweighed.`, `Weigh everything: 1 gram is 1 mL. Estimating by eye misses half of postpartum hemorrhages.`, '212'); },
    'lani-later'(s, A) { s.p['214'].delayed = true; A.judge('214-delay', 'judgment', -2, `You asked for Ms. Kealoha's severe pressure to be rechecked in 30 minutes.`, `Confirm within 15 minutes and treat within 60. And a severe-range pressure with a headache needs a nurse's assessment now.`, '214'); },
    'sarah-go'(s, A) { const P = s.p['218']; P.disclosureSeen = true; P.si = true; P.comp = true; A.judge('218-disclosed', 'safety', 1, `You had Mei stay with Ms. Mercer and went to her.`, `When someone says the people they love would be better off without them, that's suicidal thinking. Someone stays, and you go.`, '218'); },
    'sarah-blues'(s, A) { const P = s.p['218']; P.disclosureSeen = true; P.si = true; A.judge('218-disclosed', 'safety', -3, `You called Ms. Mercer's statement emotional.`, `"They'd be better off without me" is suicidal thinking. It needs a nurse at the bedside and a call, today.`, '218'); },
  };

  /* ---------- delegation ---------- */
  const delegation = {
    note: () => `Mei is doing vitals, glucose checks and pads on the hall. One thing at a time.`,
    tasks: [
      { id: 'vitals', label: 'Take a set of vital signs', rooms: ['212', '214', '216', '218'], mins: 8 },
      { id: 'glucose', label: 'Heel-stick glucose', rooms: ['216'], mins: 6 },
      { id: 'void', label: 'Help her to the bathroom to void and measure it', rooms: ['212'], mins: 8 },
      { id: 'pads', label: 'Weigh her pads and underpads', rooms: ['212'], mins: 5 },
      { id: 'fundus', label: 'Check her fundus', rooms: ['212', '218'], mins: 0 },
      { id: 'reflex', label: 'Do her magnesium checks (reflexes, breathing)', rooms: ['214'], mins: 0 },
      { id: 'gel', label: 'Give the dextrose gel', rooms: ['216'], mins: 0 },
      { id: 'sit', label: 'Stay with her until her husband arrives', rooms: ['218'], mins: 0 },
    ],
    start(task, pid, s, A) {
      const nm = A.def(pid).short;
      if (task.id === 'fundus') { A.judge('deleg-fundus', 'deleg', -1, `You asked the CNA to assess a fundus.`, `Fundal assessment is an RN assessment: what's firm, what's boggy, and what it means.`); return `Mei: "I can weigh her pads, but the fundus check is yours."`; }
      if (task.id === 'reflex') { A.judge('deleg-reflex', 'deleg', -2, `You asked the CNA to do magnesium checks.`, `Reflexes, respiratory effort and level of consciousness on a high-alert drip are nursing assessments.`); return `Mei: "I'm not trained on reflexes. I can get her vitals."`; }
      if (task.id === 'gel') { A.judge('deleg-gel', 'deleg', -1, `You asked the CNA to give a medication.`, `Dextrose gel is a medication: dosed by weight, given after a glucose an RN interprets.`); return `Mei: "I can't give meds. I'll do his glucose though."`; }
      if (task.id === 'sit') { const P = s.p['218']; if (P.si || P.disclosed) { P.comp = true; A.judge('deleg-sit', 'deleg', 1, `You had Mei stay with Ms. Mercer.`, `A safety companion is an appropriate task for a CNA, with clear instructions: stay in the room, call you for any change.`); return `Mei: "I'll stay with her. I'll call if anything changes."`; } return `Mei: "Sure, though she says she's fine. I'll check on her."`; }
      if (s.deleg.filter((d) => !d.done).length >= 1) return `Mei: "Give me a minute, I'm still on the last thing."`;
      s.deleg.push({ id: task.id, pid, due: s.t + task.mins, done: false, at: s.t });
      A.judge('deleg-good-' + task.id + '-' + pid, 'deleg', 1, `You delegated ${task.label.toLowerCase()} for ${A.def(pid).short} to the CNA.`, 'Hand off the measurements; keep the interpretation.');
      return `Mei: "On it: ${task.label.toLowerCase()} for ${nm}."`;
    },
    complete(d, s, A) {
      const nm = A.def(d.pid).short;
      if (d.id === 'vitals') { const v = A.recordVitals(d.pid, 'Mei (CNA)'); A.msg({ from: 'mei', pid: d.pid, text: `${nm}: T ${v.T.toFixed(1)}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}%.` + (d.pid === '212' && s.p['212'].tone > .55 ? ' She says she\'s cramping a lot.' : '') + (d.pid === '214' && s.p['214'].mg >= 9.5 ? ' She\'s really hard to keep awake.' : '') + (d.pid === '216' && s.p['216'].temp < 36.5 ? ' His feet feel cold.' : '') }); }
      else if (d.id === 'glucose') { const P = s.p['216']; checkGlu(s, P, A, 'Mei (CNA)'); A.msg({ from: 'mei', pid: '216', text: `216 glucose is ${P.lastGlu}.${sym(P) ? ' He was shaky when I did the stick.' : ''}` }); }
      else if (d.id === 'void') { const P = s.p['212']; P.voidTry = true; A.msg({ from: 'mei', pid: '212', text: P.bladder ? `212 sat on the toilet ten minutes. Nothing. She says she doesn't feel like she has to go, but her belly looks kind of full.` : `212 voided 300 mL.` }); }
      else if (d.id === 'pads') { const P = s.p['212']; P.qblSeen = true; P.qblPrev = P.qblAt; P.qblAt = s.t; P.qblLast = Math.round(P.qbl); A.msg({ from: 'mei', pid: '212', text: `212 pads and chux weighed. QBL since birth is ${Math.round(P.qbl)}.${kRate(P) > 6 ? ' The new pad was soaked through.' : ''}` }); }
    },
  };

  /* ---------- Nova ---------- */
  function novaHint(s, A) {
    const K = s.p['212'], L = s.p['214'], B = s.p['216'], W = s.p['218'];
    if (!B.gone && !B.checks.length) return `One of your patients is six hours old and had a number due at seven. He can't tell you he's low.`;
    if (!L.icu && L.checkAt === null) return `The patient on a high-alert drip has hourly checks. Which organ clears that drug, and what has it been doing overnight?`;
    if (!K.gone && K.fundusAt === null) return `Two hours after a birth, the most important vital sign isn't on the monitor. You have to put your hand on it.`;
    if (!K.gone && K.bladder && K.tone > .45) return `Soft, high and off to one side. What sits just in front of the uterus and pushes it there?`;
    if (!K.gone && K.tone > .55 && K.called === null) return `Is 212 bleeding more than she should? You can know the number, not guess it.`;
    if (!L.icu && L.uo < 30 && !L.ordered) return `Urine in the 20s for hours and a creatinine on its way up. What happens to magnesium the kidneys can't clear?`;
    if (L.sevAt !== null && L.firstBpMed === null) return `There's a 60-minute clock running in 214. Where are you on it?`;
    if (W.asked === null) return `One patient filled out a questionnaire this morning. Have you read her answers, every one?`;
    if (W.si && W.called === null) return `What she told you can't stay in this room. Who needs to know before 14:00?`;
    if (!B.gone && B.checks.length && B.lastGlu < 45 && !B.fed.length) return `Gel buys time. What actually keeps his glucose up?`;
    const unseen = A.c.patients.filter((d) => !s.p[d.id].gone && !s.p[d.id].icu && (s.p[d.id].seenAt === null || s.t - s.p[d.id].seenAt > 90)).map((d) => d.room);
    if (unseen.length) return `You haven't been into ${unseen.join(' and ')} in an hour and a half. Mothers and babies both change fast.`;
    return `You're on top of it. Who would you want rechecked before Maya takes over?`;
  }

  function endChecks(s, A) {
    A.c.patients.forEach((d) => {
      const P = s.p[d.id];
      if (P.seenAt === null && !P.icu && !P.gone) A.judge(d.id + '-unseen', 'assess', -3, `You never went into ${d.room} this shift.`, `On mother-baby, the assessment is hands on: a fundus, a reflex, a heel stick, a conversation.`, d.id);
      (d.meds || []).forEach((m) => { const st = s.meds[m.id]; if (m.due !== undefined && m.due <= Math.min(240, s.t - 60) && st.status === 'due' && !P.icu && !P.gone) A.judge(m.id + '-missed', 'meds', -2, `${m.name} for ${d.short} (due ${clock(m.due)}) was never given or held.`, `Every scheduled dose needs a decision: given, or held with a reason.`, d.id); });
    });
    const K = s.p['212'], L = s.p['214'], B = s.p['216'], W = s.p['218'];
    if (!K.gone && K.bladder && s.t >= 200) A.judge('212-novoid', 'safety', -2, `Ms. Brown's bladder was never emptied.`, `No void six hours after birth, after an epidural, with a displaced fundus: scan and catheterize.`, '212');
    if (!K.gone && K.tone > .55 && K.called === null) A.judge('212-norep', 'comm', -2, `Nobody called about Ms. Brown's boggy uterus.`, `Atony that needs treatment is a call, even when it responds.`, '212');
    if (!L.icu && L.checkAt === null) A.judge('214-nocheck', 'assess', -3, `Ms. Kealoha's magnesium checks were never done.`, `Hourly reflexes, breathing, LOC and urine output are the only way to see toxicity coming.`, '214');
    if (!L.icu && !L.ordered && L.uo < 30) A.judge('214-norep', 'comm', -2, `Ms. Kealoha's oliguria on magnesium never reached the provider.`, `Under 30 mL an hour for two hours is a call by her own orders.`, '214');
    if (!L.icu && L.ordered && L.reduced === null && L.stopped === null) A.judge('214-notdone', 'meds', -2, `The order to decrease Ms. Kealoha's magnesium was never carried out.`, `An order isn't done until the pump says so.`, '214');
    if (L.sevAt !== null && L.firstBpMed === null && !L.icu) A.judge('214-bp-never', 'meds', -3, `Ms. Kealoha's severe-range pressure was never treated.`, `Severe hypertension in preeclampsia is treated within 60 minutes. It's how strokes are prevented.`, '214');
    if (!B.gone && B.checks.length && (B.gels.length || B.fed.length) && B.checks.length < 2) A.judge('216-norecheck', 'judgment', -1, `Baby Nguyen's glucose was never rechecked after treatment.`, `Gel and a feed, then a glucose an hour later. That's how you know.`, '216');
    if (!B.gone && !B.checks.length) A.judge('216-nocheck', 'assess', -3, `Baby Nguyen's glucose was never checked.`, `An infant of a diabetic mother on a hypoglycemia protocol, due at 07:00.`, '216');
    if (W.asked === null && !W.disclosureSeen) A.judge('218-never', 'safety', -3, `Nobody talked with Ms. Mercer about her positive screen.`, `A positive item 10 means a same-day conversation, in plain words, before discharge.`, '218');
    if (W.si && W.called === null) A.judge('218-norep', 'comm', -3, `Ms. Mercer's suicidal thoughts never reached her provider.`, `Passive suicidal thoughts still need an evaluation before she goes home.`, '218');
    if (W.itm.length < 3) A.judge('218-itm-missed', 'assess', -1, `Ms. Mercer's intrathecal morphine checks fell behind.`, `Every 2 hours for 24 hours: respiratory depression can come late.`, '218');
    const keys = []; A.c.patients.forEach((d) => (d.report || []).forEach((r, i) => { if (r.key) keys.push(d.id + ':' + i); }));
    const hit = keys.filter((k) => s.brain.includes(k)).length;
    if (s.brain.length) { const noise = s.brain.length - hit, precise = hit / s.brain.length;
      if (noise >= 4 && precise < .7) A.judge('brain', 'assess', -1, `You flagged ${s.brain.length} lines in report, ${noise} of them noise.`, 'Flagging everything is the same as flagging nothing.');
      else A.judge('brain', 'assess', hit / keys.length >= 0.6 && precise >= .7 ? 1 : 0, `You flagged ${hit} of ${keys.length} critical cues during report${noise ? `, plus ${noise} that didn't matter` : ''}.`, `On mother-baby, report is risk factors: how long the labor, how big the baby, what's overdue, and what a screen showed.`); }
  }

  const PREP = { '212-meth': ['fundus', 'vitals'], '212-oxy': ['fundus'], '212-carbo': ['fundus'], '214-mag': ['mgcheck'], '214-ca': ['mgcheck'], '214-lab': ['bp'], '214-apap': ['bp'], '216-gel': ['glu'], '218-oxy': ['itm', 'pain'] };
  [keisha, lani, baby, sarah].forEach((d) => d.meds.forEach((m) => { if (PREP[m.id]) m.prep = PREP[m.id]; }));

  const LK = (skin, shade, lip, blush, iris, hair, hcol, cloth, extras, smile) => ({ skin, shade, lip, blush, iris, head: { w: 55, h: 61, jaw: .4 }, eye: 9.8, hair: { style: hair, color: hcol }, brow: { w: 3.6, color: hcol }, body: { w: 82, cloth }, extras: extras || [], smile: smile === undefined ? .35 : smile });
  S.engine.registerCase({
    id: 'ob-2n-1', title: 'Days on 2 North', unit: '2 North, Mother-Baby', unitShort: '2 North', level: 'Specialty: Mother-baby', start: 7 * 60, length: 300, novaCredits: 3,
    card: 'Mother-baby until noon: two hours postpartum, preeclampsia on magnesium, a newborn of a diabetic mother, and discharge teaching.',
    hero: { head: 'Days, 2 North. Three mothers and a baby.', lede: 'Mother-baby, 07:00 to noon. Everyone looks fine from the doorway. The numbers that matter here are the ones you go and get: a fundus, a reflex, a heel stick, an answer on a screen.' },
    intro: { time: '06:58', place: '2 North, Mother-Baby', cta: 'Take report', beats: ['Paloma is finishing nights and giving report at the desk, a coffee in each hand.', 'Three mothers and one baby until noon. Births at 01:05, 04:40 and last evening, and a cesarean yesterday.', 'The first day after birth is when the quiet emergencies happen: bleeding, a drug building up, a low sugar, a thought someone hasn\'t said out loud.'] },
    minutes: 20,
    sysLabels: { gi: 'Bladder, bowels and feeding', skin: 'Skin, fundus and incision' },
    handoffBy: 'Paloma (night RN)', reportBy: 'grace', reportRole: 'night shift', provider: 'brennan', providerLabel: 'a provider', cna: 'mei',
    staff: {
      nova: { name: 'Nova Reyes', role: 'Charge nurse', look: { skin: '#B98A63', shade: '#976D4B', lip: '#7C4435', blush: '#C77B5E', iris: '#3D2A1C', head: { w: 55, h: 62, jaw: .35 }, eye: 10, hair: { style: 'bun', color: '#3A2E2A', streak: true }, brow: { w: 3.6, color: '#2E2421' }, body: { w: 80, cloth: 'navy' }, extras: ['studs'], smile: .35 } },
      mei: { name: 'Mei', role: 'CNA', look: LK('#EDC9A6', '#D0A884', '#B06A5E', '#E8977F', '#1E140C', 'ponytail', '#140E0A', 'rose', [], .55) },
      grace: { name: 'Paloma', role: 'Night RN', look: Object.assign(LK('#5E3A27', '#47291B', '#4A2418', '#86493A', '#1A100A', 'curlyshort', '#140E0A', 'navy', ['hoops']), { tired: true }) },
      brennan: { name: 'Dr. Brennan', role: 'OB hospitalist', look: LK('#F0D2BC', '#D4AE96', '#B4675F', '#EA998A', '#4E6A84', 'bob', '#A07850', 'coat', ['thinGlasses']) },
      lin: { name: 'Dr. Lin', role: 'Pediatrician', look: LK('#EBC6A2', '#CFA582', '#AE6A5C', '#E3967E', '#1E140C', 'short', '#1A1410', 'coat', ['glasses']) },
      linh: { name: 'Linh', role: 'Mother, 216', look: LK('#EBC6A2', '#CFA582', '#B06A5E', '#E8977F', '#1E140C', 'long', '#140E0A', 'gown', [], .3) },
      kainoa: { name: 'Kainoa', role: 'Partner, 214', look: LK('#A7714C', '#875634', '#6E3E2E', '#B7735A', '#20140C', 'short', '#140E0A', 'tee', ['beard']) },
      lab: { name: 'Lab', role: 'Laboratory', look: null },
      bb: { name: 'Blood bank', role: 'Transfusion service', look: null },
    },
    patients: [keisha, lani, baby, sarah],
    dueExtras(s) {
      const out = [], K = s.p['212'], L = s.p['214'], B = s.p['216'], W = s.p['218'];
      if (!K.gone) { const nx = (K.fundusAt === null ? -75 : K.fundusAt) + 60; out.push({ t: Math.max(0, nx), late: s.t > nx + 20, tab: 'care', text: '212 Fundus, lochia and vital signs' }); if (K.bladder) out.push({ t: 0, late: s.t > 60, text: '212 No void since birth (due by 10:40)' }); }
      if (!L.icu) { const nx = (L.checkAt === null ? -60 : L.checkAt) + 60; out.push({ t: Math.max(0, nx), late: s.t > nx + 15, text: '214 Magnesium checks: reflexes, RR, LOC, urine output' }); }
      if (L.sevAt !== null && L.firstBpMed === null && !L.icu) out.push({ t: L.sevAt, late: s.t > L.sevAt + 30, text: '214 Severe-range BP: recheck within 15 min, treat within 60' });
      if (!B.gone) {
        if (!B.checks.length) out.push({ t: 0, late: s.t > 30, text: '216 Glucose due before his feed' });
        const after = Math.max(B.gels.length ? B.gels[B.gels.length - 1] : -999, B.fed.length ? B.fed[B.fed.length - 1] : -999);
        if (after > 0 && B.checks[B.checks.length - 1] < after) out.push({ t: after + 60, late: s.t > after + 80, text: '216 Recheck glucose 1 hour after treatment' });
        out.push({ t: Math.max(0, B.fedAt + 180), late: s.t > B.fedAt + 200, text: '216 Feed (every 2–3 hours)' });
      }
      const nx = W.itm[W.itm.length - 1] + 120; if (nx <= 420) out.push({ t: nx, late: s.t > nx + 20, tab: 'care', text: '218 Intrathecal morphine: RR and sedation' });
      if (W.asked === null && !W.disclosureSeen) out.push({ t: 0, late: s.t > 90, tab: 'talk', text: '218 EPDS 15, item 10 positive: talk with her' });
      return out;
    },
    replies,
    priority: {
      judge(r, A) {
        if (r[0] === '214') A.judge('rank-first', 'priority', 2, `You chose to see Ms. Kealoha first.`, `A high-alert drug that's accumulating: three hours of oliguria, a rising creatinine and reflexes already down. The next sign is her breathing.`, '214');
        else if (r[0] === '212' || r[0] === '216') A.judge('rank-first', 'priority', 1, `You chose to see ${r[0] === '212' ? 'Ms. Brown' : 'Baby Nguyen'} first.`, `Reasonable: ${r[0] === '212' ? 'a fresh postpartum patient with every risk factor for atony' : 'a glucose due on a baby at risk'}. But magnesium with failing kidneys was already showing toxicity.`, '214');
        else A.judge('rank-first', 'priority', -1, `You put Ms. Mercer first.`, `Her screen needs a conversation today, and it can wait an hour. The physical risks on the hall can't.`, '214');
      },
      correct: ['214', '212', '216', '218'],
      why: {
        '214': `Magnesium at 2 g/h with urine under 30 for three hours and creatinine up to 1.4. Reflexes already down from 2+ to 1+. Toxicity is coming.`,
        '212': `Two hours after a birth with every risk factor for atony: a long oxytocin induction, a big baby, and no void since birth.`,
        '216': `Infant of a diabetic mother with a glucose due now and no feed since 04:00. A sleepy baby is a symptom until proven otherwise.`,
        '218': `A positive depression screen that needs a real conversation today, before discharge. Physically stable.`,
      },
    },
    // Debrief claims checked against the record (engine.js, checkClaims): nobody is "at the bedside" who never came.
    claims: [{ pid: '212', rx: /(Brennan|provider) at the bedside/i, ok: (s, P) => P.mdHere !== undefined }, { pid: '212', rx: /hemorrhage team in the room/i, ok: (s, P) => P.teamHere !== undefined }],
    events, delegation, dialogs, novaHint, endChecks,
    tick(s, A) {
      const K = s.p['212'];
      if (K.called !== null && !K.gone) A.watch('212', { id: '212-qbl', text: 'Weigh pads and underpads every 30 minutes', every: 30, times: 3, rx: 'QBL|pads', tab: 'care', from: K.called });
      if (!K.gone) { K.tone += (kTarget(K) - K.tone) * .015; K.qbl += kRate(K); }
      const L = s.p['214'];
      if (!L.icu) {
        const poor = L.uo < 30 ? 1 : .35;
        if (L.stopped !== null) L.mg = Math.max(4, L.mg - .008); else if (L.rate === 1) L.mg += .004 * poor - (L.uo >= 30 ? .002 : 0); else L.mg += .024 * poor;
        if (L.stopped !== null || L.rate === 1) L.uo += (34 - L.uo) * .012; else L.uo = Math.max(15, L.uo - .01);
      }
      const B = s.p['216'];
      if (!B.gone) {
        const since = s.t - B.fedAt;
        B.glu -= since > 150 ? .065 : .02;
        if (B.temp < 36.5) B.glu -= .02;
        B.boost.forEach((b) => { if (s.t > b.t && s.t <= b.t + b.over) B.glu += b.amt / b.over; });
        if (B.skin) B.temp = Math.min(36.9, B.temp + .01); else if (B.temp > 36.15) B.temp -= .0025;
      }
    },
  });
})(window.Shift);
