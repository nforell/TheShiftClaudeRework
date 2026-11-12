/* Case: Labor and Delivery, 2 South, day shift (07:00 to 12:00). Specialty: Labor and delivery.
   Themes: the fetal monitor tells you how the baby is coping, in a language you have to read. Every patient is on
   continuous electronic fetal monitoring; the tracing is described in words, and reading it is a decision.
   221: Oxytocin induction for gestational hypertension. Six contractions in 10 minutes since report (tachysystole);
        late decelerations start if nothing changes, then minimal variability, then a Category III tracing and an
        emergency cesarean. The order set says go up, and the resident asks to. Stop, turn, bolus, reassess, restart low.
   222: Epidural at 06:40. At about 07:25 her pressure falls to 82/44 with nausea and a prolonged deceleration to 90. Her
        bladder is full. At 10:20 the head is crowning and Dr. Adeyemi is in a cesarean: the nurse catches the baby.
   223: Trial of labor after one low transverse cesarean, no IV yet. Variable decelerations from 09:15, then at 09:20 a
        uterine rupture: constant pain, contractions gone, station lost, FHR 70. Not breakthrough pain: STAT cesarean.
   224: GBS positive, membranes ruptured 19 hours, penicillin due at 07:00. From 08:45 a fever, maternal and fetal
        tachycardia and a tender uterus: intraamniotic infection. Penicillin doesn't cover it; a cooler doesn't either. */
(function (S) {
  const { clamp, clock } = S.engine;
  const jit = (s, seed) => ((Math.floor(s.t / 5) * 7 + seed * 13) % 3) - 1;
  const LK = (skin, shade, lip, blush, iris, hair, hcol, cloth, extras, smile) => ({ skin, shade, lip, blush, iris, head: { w: 55, h: 61, jaw: .4 }, eye: 9.8, hair: { style: hair, color: hcol }, brow: { w: 3.6, color: hcol }, body: { w: 82, cloth }, extras: extras || [], smile: smile === undefined ? .3 : smile });
  const fF = (c) => (c * 9 / 5 + 32).toFixed(1);

  /* The tracing in words: what a nurse reads off the screen, without the interpretation. */
  const VAR = { moderate: 'moderate (the line wiggles 6 to 25 bpm)', minimal: 'minimal (5 bpm or less; the line looks smooth)', absent: 'absent (a flat line)' };
  const stripLine = (o) => `Baseline ${o.base} bpm. Variability ${VAR[o.varb]}. ${o.accel ? 'Accelerations: rises of 15 bpm lasting 15 seconds or more.' : 'No accelerations.'} ${o.decel} Contractions: ${o.n} in 10 minutes, averaged over the last 30 minutes${o.tone ? ', ' + o.tone : ''}.`;

  /* ---------- 221 Daniela Fuentes: oxytocin, tachysystole, late decelerations ---------- */
  // ctx: contractions per 10 min (a lagging 30-minute average). fs: fetal stress, 0 well to 1 failing.
  const alN = (P) => Math.round(P.ctx);
  const alTachy = (P) => alN(P) > 5;
  const alCat = (P) => (P.fs >= .85 ? 3 : P.fs >= .25 ? 2 : 1);
  const alVar = (P) => (P.fs >= .8 ? 'absent' : P.fs >= .45 ? 'minimal' : 'moderate');
  const alBase = (P) => (P.fs >= .6 ? 150 : 140);
  const alBad = (P) => alTachy(P) || alCat(P) >= 2;
  function alStrip(s, P) {
    const fs = P.fs, n = alN(P);
    const decel = fs >= .85 ? 'Recurrent late decelerations with every contraction: slow, shallow drops, the low point well after each peak.'
      : fs >= .45 ? 'Recurrent late decelerations with more than half the contractions: gradual, symmetric drops of 15 to 20 bpm that bottom out 20 to 30 seconds after the contraction peaks and recover only after it ends.'
      : fs >= .25 ? 'Late decelerations with a few of the contractions: gradual drops of about 15 bpm, the low point after the peak of the contraction.'
      : 'No decelerations.';
    return stripLine({ base: alBase(P), varb: alVar(P), accel: fs < .2, decel, n, tone: n > 5 ? 'each 60 to 80 seconds long, with 30 to 60 seconds of rest between them' : 'each 60 to 70 seconds, the uterus soft between them' }) + ` Oxytocin ${P.oxy ? P.oxy + ' milliunits/min' : 'off'}.`;
  }
  const alicia = {
    id: '221', room: '221', name: 'Daniela Fuentes', short: 'Ms. Fuentes', age: 29, sex: 'F', mrn: '00740213', provider: 'adeyemi',
    look: { skin: '#D9A982', shade: '#BC8B64', lip: '#A0594C', blush: '#DC8E74', iris: '#3A2616', head: { w: 55, h: 61, jaw: .3 }, eye: 9.8,
      hair: { style: 'ponytail', color: '#2A1C14' }, brow: { w: 3.4, color: '#2A1C14' }, body: { w: 84, cloth: 'gown' }, extras: ['studs'], smile: .3,
      lines: { calm: `Is that one still going? I can't tell where one ends anymore.`, pain: `They don't stop. There's no break between them.`, anxious: `Why does the monitor keep beeping? Is she okay?`, drowsy: `I'm so tired. I didn't sleep at all.`, none: `(She's breathing through a contraction and doesn't answer.)` } },
    bio: `Dental hygienist. First baby, a girl; they're naming her Lucía after Rafael's grandmother. Rafael, her husband, made a playlist for labor and has been DJing since midnight.`,
    dx: `Induction of labor for gestational hypertension`, reason: `First baby at 39 weeks 2 days. Induction for gestational hypertension without severe features (BP 142/92, no proteinuria, labs normal). Oxytocin since 23:00, increased overnight per the order set to 8 milliunits/min. Membranes artificially ruptured at 03:00, clear fluid.`,
    hx: [`Gestational hypertension, diagnosed at 37 weeks`, `G1 P0`, `No other medical problems`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `78 kg`,
    lines: [`PIV 18g left forearm: oxytocin 30 units/500 mL on a pump, LR maintenance at 125 mL/h`, `External fetal monitor and tocodynamometer`],
    mobility: `In bed or rocking chair, on continuous monitoring`, diet: `Clear liquids`,
    init: { oxy: 8, ctx: 6, fs: 0, lateral: false, bolus: false, o2: false, offAt: null, decAt: null, prevRate: 8, restartAt: null, restartBad: false, upBad: 0, upOk: 0, terbAt: null, efmAt: null, efmN: 0, actFs: null, recoveredAt: null, reassessed: false, called: null, declined: null, gone: false, goneAt: null, sve: false, resUp: false },
    nightVitals: { T: 37.0, HR: 86, SBP: 142, DBP: 92, RR: 18, SpO2: 98, O2: 'Room air', pain: 5 },
    labs: [
      { name: 'Platelets', val: 212, unit: 'K/µL', ref: '150 to 400', flag: '', t: -500 },
      { name: 'AST / ALT', val: '22 / 18', unit: 'U/L', ref: 'under 40', flag: '', t: -500 },
      { name: 'Creatinine', val: 0.6, unit: 'mg/dL', ref: '0.4 to 0.9 in pregnancy', flag: '', t: -500 },
      { name: 'Urine protein/creatinine ratio', val: 0.12, unit: '', ref: 'under 0.3', flag: '', t: -500 },
      { name: 'Blood type', val: 'O positive, antibody screen negative', unit: '', ref: '', flag: '', t: -500 },
    ],
    orders: [
      { t: -480, text: `Oxytocin 30 units in 500 mL LR. Start at 2 milliunits/min. Increase by 2 milliunits/min every 30 minutes until adequate contractions (3 to 5 in 10 minutes) or a maximum of 20 milliunits/min.` },
      { t: -480, text: `Oxytocin safety protocol (nurse-initiated): for tachysystole (more than 5 contractions in 10 minutes, averaged over 30 minutes) or a Category II or III tracing: reduce the oxytocin by half or stop it, turn her to her side, give lactated Ringer's 500 mL IV, and notify the provider. Terbutaline 0.25 mg SC once for tachysystole with a Category II or III tracing that persists after the oxytocin is stopped (hold for maternal HR over 120). Restart only after 30 minutes or more of a Category I tracing with normal contractions, at half the last rate.` },
      { t: -480, text: `Continuous EFM. BP every hour; notify for SBP 160 or more or DBP 110 or more, headache, visual changes or right upper quadrant pain. Clear liquids.` },
    ],
    notes: [
      { t: -30, author: 'Tasha, night RN', text: `Oxytocin up by 2 every 30 min overnight per order set, now 8. Contracting q1.5 to 2 min, coping with breathing. Cervix 4/70/-2 at 03:00 after AROM, clear fluid. BP 138 to 146 / 88 to 94, no headache. Husband at bedside.` },
    ],
    io: { intake: `IV 125 mL/h plus oxytocin; clear liquids`, output: `Voided 300 mL at 06:30` },
    report: [
      { text: `Daniela Fuentes, 29, first baby, 39 and 2. Induction for gestational hypertension, no severe features. Pit's at 8.`, key: true },
      { text: `I went up by 2 every half hour overnight per the order set. She's contracting a lot now, every minute and a half or so.`, key: true },
      { text: `Pressures 140s over 90s. No headache, no vision changes.`, key: true },
      { text: `She was 4 at three o'clock. The resident wants to see change.`, key: false },
      { text: `Her husband has a playlist going. It's mostly Selena.`, key: false },
      { text: `She's on clears and really wants a popsicle.`, key: false },
    ],
    vitals(s, P) {
      const terb = P.terbAt !== null && s.t - P.terbAt < 60;
      return { T: 37.0, HR: 86 + (terb ? 18 : 0) + (alTachy(P) ? 6 : 0) + jit(s, 1) * 2, SBP: 142 + jit(s, 2) * 2, DBP: 92, RR: 18, SpO2: 98, O2: P.o2 ? '10 L nonrebreather' : 'Room air', pain: alTachy(P) ? 8 : 5, extra: P.gone ? '' : `FHR baseline ${alBase(P)}. Oxytocin ${P.oxy ? P.oxy + ' milliunits/min' : 'off'}.` };
    },
    assess: {
      general: (s, P) => (P.gone ? `She's in the OR.` : alTachy(P) ? `Gripping the bed rail through one contraction after another, barely catching her breath before the next. "There's no break."` : `Breathing through contractions with Rafael counting, resting and talking between them.`),
      resp: () => `RR 18, unlabored. Lungs clear.`,
      cardiac: (s, P, A) => { const v = A.vitals('221'); return `HR ${v.HR}, regular. BP ${v.SBP}/${v.DBP}. 1+ ankle edema. Capillary refill brisk.`; },
      neuro: () => `Alert, oriented. No headache, no visual changes, no right upper quadrant pain. Reflexes 2+, no clonus.`,
      pain: (s, P) => (alTachy(P) ? `Contractions 8/10 and close together. She says she can't get on top of them.` : `Contractions 5/10, coping with breathing and Rafael's counting.`),
      skin: () => `Warm, dry. IV site clean, no swelling.`,
      gi: (s, P) => { P.k.palp = s.t; return alTachy(P) ? `Uterus firm with each contraction and barely soft before the next one starts. Fluid clear. Voided at 06:30.` : `Uterus firm with contractions, soft between them. Fluid clear. Voided at 06:30.`; },
    },
    interventions: [
      { id: 'efm', label: 'Review the fetal monitor tracing (last 30 minutes)', cost: 2, avail: (s, P) => !P.gone,
        run(s, P, A) {
          P.efmAt = s.t; P.efmN += 1;
          if (P.efmN === 1) { if (alBad(P)) A.judge('221-efm', 'assess', 2, `You checked Ms. Fuentes's tracing and counted ${alN(P)} contractions in 10 minutes${alCat(P) >= 2 ? ', with late decelerations' : ''}.`, `Read the whole strip, not just the heart rate. More than 5 contractions in 10 minutes, averaged over 30 minutes, is tachysystole: the baby has too little time between squeezes to get oxygen back.`, '221'); else A.judge('221-efm', 'assess', 1, `You checked Ms. Fuentes's tracing.`, `On oxytocin, the tracing and the contraction pattern are checked at least every 15 minutes in active labor.`, '221'); }
          return alStrip(s, P);
        } },
      { id: 'lateral', label: 'Turn her onto her left side', cost: 1, avail: (s, P) => !P.gone && !P.lateral,
        run(s, P, A) { P.lateral = true; if (alBad(P)) A.judge('221-lateral', 'safety', 1, `You turned Ms. Fuentes onto her side.`, `Lying on her back, the uterus presses on the vena cava and less blood reaches the placenta. A side-lying position is a first step of intrauterine resuscitation.`, '221'); return `On her left side, a peanut ball between her knees. The monitor picks up the heart rate again after a minute of adjusting.`; } },
      { id: 'bolus', label: 'IV fluid bolus: lactated Ringer\'s 500 mL', cost: 2, avail: (s, P) => !P.gone && !P.bolus,
        run(s, P, A) { P.bolus = true; A.judge('221-bolus', 'safety', alBad(P) ? 1 : 0, alBad(P) ? `You gave Ms. Fuentes a 500 mL bolus per the safety protocol.` : `You gave a fluid bolus without a reason on the strip.`, alBad(P) ? `A bolus improves blood flow to the placenta. Keep it to 500 mL with gestational hypertension; she's at risk for fluid overload.` : `Fluid is part of intrauterine resuscitation, not routine care. With hypertension, extra fluid isn't free.`, '221'); return `LR 500 mL running wide open through the 18g.`; } },
      { id: 'o2', label: 'Oxygen 10 L by nonrebreather mask', cost: 1, avail: (s, P) => !P.gone && !P.o2,
        run(s, P, A) { P.o2 = true; A.judge('221-o2', 'judgment', 0, `You put Ms. Fuentes on oxygen for the tracing.`, `Not wrong, but not the fix. Current ACOG guidance doesn't support routine maternal oxygen for a Category II tracing when the mother's own oxygen level is normal; it hasn't been shown to help the baby. The fix here is fewer contractions: the oxytocin.`, '221'); return `Nonrebreather on at 10 L. SpO₂ was 98% on room air. She pushes the mask off during the next contraction.`; } },
      { id: 'sve', label: 'Sterile vaginal exam', cost: 3, avail: (s, P) => !P.gone,
        run(s, P) { P.sve = true; return P.restartAt !== null && s.t - P.restartAt >= 40 ? `5 cm, 80% effaced, -1 station. Some change since 03:00.` : `4 cm, 70% effaced, -2 station. Unchanged since 03:00. Fluid clear.`; } },
      { id: 'reassess', label: 'Recheck the tracing after intrauterine resuscitation', cost: 2, avail: (s, P) => !P.gone && !P.reassessed && (P.offAt !== null || P.decAt !== null) && s.t - (P.offAt !== null ? P.offAt : P.decAt) >= 15,
        run(s, P, A) {
          P.reassessed = true; const ok = !alBad(P);
          A.judge('221-reassess', 'judgment', ok ? 2 : 1, ok ? `You rechecked Ms. Fuentes's tracing and saw it recover.` : `You rechecked Ms. Fuentes's tracing: not recovered yet.`, ok ? `Did it work? Contractions back to 5 or fewer in 10 minutes, moderate variability, no late decelerations. That's what the provider needs to hear, and it starts the 30-minute clock before any restart.` : `Still abnormal after the first steps. If the oxytocin is off and the contractions haven't spaced out, the protocol's next step is terbutaline, and the provider at the bedside.`, '221');
          return alStrip(s, P) + (ok ? ' The strip has recovered.' : '');
        } },
    ],
    meds: [
      { id: '221-oxy', name: 'Oxytocin infusion', dose: 'per order set', route: 'IV', freq: 'Titrate per order set and safety protocol', prn: true, infusion: true,
        param: 'Increase by 2 milliunits/min every 30 minutes to 3 to 5 contractions in 10 minutes. Reduce or stop for tachysystole or a Category II or III tracing.',
        block: (s, P) => (P.gone ? 'She\'s in the OR.' : null),
        checks: (s, P) => [{ label: 'Contractions', value: `${alN(P)} in 10 minutes (30-minute average)`, ok: !alTachy(P) }, { label: 'Tracing', value: P.efmAt === null ? 'Not reviewed this shift' : `Last reviewed ${clock(P.efmAt)}`, ok: P.efmAt !== null && s.t - P.efmAt <= 30 }, { label: 'Current rate', value: P.oxy ? `${P.oxy} milliunits/min` : `Off since ${clock(P.offAt)}`, ok: null }],
        doses: [{ id: 1, label: 'Increase by 2 milliunits/min (order set)' }, { id: 2, label: 'Decrease to half the current rate' }, { id: 3, label: 'Stop the infusion' }, { id: 4, label: 'Restart at half the last rate (after 30 minutes of a Category I tracing)' }, { id: 5, label: 'No change' }],
        give(s, P, A, dose) {
          const n = alN(P), cat = alCat(P), bad = alBad(P);
          if (dose === 1) {
            if (!P.oxy) return `It's off. A restart comes first, at half the last rate.`;
            if (bad) { P.upBad += 1; A.judge('221-oxy-up', 'safety', -3, `You increased Ms. Fuentes's oxytocin with ${n > 5 ? n + ' contractions in 10 minutes' : 'a Category ' + cat + ' tracing'}.`, `The order set says go up until contractions are adequate; it never says go up into tachysystole. More oxytocin means more contractions and less time for the baby to recover between them. The safety protocol overrides the titration order.`, '221'); }
            else { P.upOk += 1; A.judge('221-oxy-titrate', 'meds', 1, `You titrated Ms. Fuentes's oxytocin on a Category I tracing with ${n} contractions in 10 minutes.`, `Up by 2 every 30 minutes is fine while the strip is Category I and contractions are 5 or fewer in 10 minutes. Recheck the strip before every change.`, '221'); }
            P.oxy = Math.min(20, P.oxy + 2); return `Oxytocin up to ${P.oxy} milliunits/min.`;
          }
          if (dose === 2) {
            if (!P.oxy) return `It's already off.`;
            if (bad) A.judge('221-oxy-down', 'safety', cat >= 2 ? 1 : 2, `You cut Ms. Fuentes's oxytocin in half for ${cat >= 2 ? 'a Category II tracing' : 'tachysystole'}.`, cat >= 2 ? `Halving it helps. With late decelerations as well as tachysystole, stopping it is the stronger move: the uterus needs to rest now.` : `For tachysystole with a Category I tracing, halving the rate is one of the protocol's options. Watch that the contractions space out.`, '221');
            else A.judge('221-oxy-down', 'meds', -1, `You lowered Ms. Fuentes's oxytocin without a reason on the strip.`, `Contractions and tracing were normal. Without tachysystole or an abnormal tracing, the order is to titrate, not to cut back.`, '221');
            P.prevRate = P.oxy; P.oxy = Math.max(1, Math.floor(P.oxy / 2)); if (P.decAt === null) P.decAt = s.t; if (P.actFs === null) P.actFs = P.fs;
            return `Oxytocin down to ${P.oxy} milliunits/min.`;
          }
          if (dose === 3) {
            if (!P.oxy) return `It's already off.`;
            if (bad) A.judge('221-oxy-stop', 'safety', 2, `You stopped Ms. Fuentes's oxytocin for ${n > 5 ? 'tachysystole' : 'a Category ' + cat + ' tracing'}${cat >= 2 && n > 5 ? ' with late decelerations' : ''}.`, `Oxytocin has a half-life of minutes; stopping it is the fastest way to give the uterus, and the baby, a rest. Then turn her, bolus, tell the provider, and recheck the strip.`, '221');
            else A.judge('221-oxy-stop', 'judgment', 0, `You stopped Ms. Fuentes's oxytocin with a normal strip.`, `Nothing on the strip called for it. Her labor will slow down.`, '221');
            P.prevRate = P.oxy; P.oxy = 0; P.offAt = s.t; if (P.actFs === null) P.actFs = P.fs;
            return `Oxytocin stopped at ${clock(s.t)}. The line is flushed and capped at the port; the maintenance fluid keeps running.`;
          }
          if (dose === 4) {
            if (P.oxy) return `It's running at ${P.oxy} milliunits/min.`;
            const ready = P.offAt !== null && s.t - P.offAt >= 30 && cat === 1 && n <= 5 && P.recoveredAt !== null;
            if (ready) A.judge('221-restart', 'meds', 2, `You restarted Ms. Fuentes's oxytocin at half the last rate after the strip recovered.`, `After 30 minutes or more of a Category I tracing with normal contractions, the protocol restarts at half the last rate and titrates again from there.`, '221');
            else { P.restartBad = true; A.judge('221-restart', 'safety', -2, `You restarted Ms. Fuentes's oxytocin before the strip had recovered for 30 minutes.`, `Restarting into tachysystole or an abnormal tracing undoes the rest you just gave the baby. The protocol waits for 30 minutes of a Category I tracing with normal contractions.`, '221'); }
            P.oxy = Math.max(2, Math.floor(P.prevRate / 2)); P.restartAt = s.t;
            return `Oxytocin restarted at ${P.oxy} milliunits/min.`;
          }
          if (bad && P.oxy) A.judge('221-oxy-nochange', 'safety', -2, `You left Ms. Fuentes's oxytocin running unchanged with ${n > 5 ? 'tachysystole' : 'a Category ' + cat + ' tracing'}.`, `The safety protocol is nurse-initiated: reduce or stop. You don't need to wait for an order to give the baby a rest.`, '221');
          return `No change. ${P.oxy ? P.oxy + ' milliunits/min.' : 'Still off.'}`;
        } },
      { id: '221-terb', name: 'Terbutaline', dose: '0.25 mg', route: 'SC', freq: 'Once, per the oxytocin safety protocol', prn: true, param: 'For tachysystole with a Category II or III tracing that persists after the oxytocin is stopped. Hold for maternal HR over 120.',
        block: (s, P) => (P.gone ? 'She\'s in the OR.' : P.terbAt !== null ? `Given at ${clock(P.terbAt)}.` : null),
        checks: (s, P, A) => [{ label: 'Oxytocin', value: P.oxy ? `Running at ${P.oxy}` : 'Off', ok: !P.oxy }, { label: 'Contractions', value: `${alN(P)} in 10 minutes`, ok: alTachy(P) }, { label: 'Maternal HR', value: `${A.vitals('221').HR}`, ok: A.vitals('221').HR <= 120 }],
        give(s, P, A) {
          P.terbAt = s.t;
          if (P.oxy) A.judge('221-terb', 'meds', -1, `You gave terbutaline with the oxytocin still running.`, `Stop the drug causing the contractions before giving a drug to stop them. Terbutaline is for tachysystole that persists after the oxytocin is off.`, '221');
          else if (alTachy(P)) A.judge('221-terb', 'meds', 2, `You gave terbutaline for tachysystole that persisted after stopping the oxytocin.`, `A beta-2 agonist relaxes the uterus within minutes. Expect her heart rate to rise; hold it for a maternal HR over 120.`, '221');
          else A.judge('221-terb', 'meds', 0, `You gave terbutaline when contractions had already spaced out.`, `Not indicated: the contractions were 5 or fewer in 10 minutes. It will make her tachycardic and shaky for no gain.`, '221');
          return `Terbutaline 0.25 mg SC in her upper arm. "My heart's racing." Contractions space out over the next 10 minutes.`;
        } },
    ],
    talk: (s, P) => (P.gone ? null : P.k.talked ? 'al_after' : 'al_talk'),
    family: { name: 'Rafael', rel: 'Husband', mode: 'bedside', cost: 3, avail: (s, P) => !P.gone, dialog: (s, P) => (P.k.raf ? 'raf_after' : 'raf_talk') },
    sbar: {
      items(s, P, A) {
        const v = A.vitals('221');
        return [
          { id: 'ctx', label: `${alN(P)} contractions in 10 minutes on oxytocin ${P.oxy ? P.oxy : '(now off)'}`, key: alTachy(P) || P.offAt !== null, need: P.efmAt !== null, lock: 'Review the tracing' },
          { id: 'strip', label: `Tracing: baseline ${alBase(P)}, ${alVar(P)} variability, ${alCat(P) >= 2 ? 'late decelerations' : 'no decelerations'}`, key: alCat(P) >= 2, need: P.efmAt !== null, lock: 'Review the tracing' },
          { id: 'done', label: `Done: ${[P.offAt !== null ? 'oxytocin stopped' : P.decAt !== null ? 'oxytocin halved' : null, P.lateral ? 'left side' : null, P.bolus ? 'LR 500 mL' : null].filter(Boolean).join(', ') || 'nothing yet'}`, key: P.offAt !== null || P.decAt !== null, need: true },
          { id: 'bp', label: `BP ${v.SBP}/${v.DBP}, no headache or visual changes`, key: false, need: true },
          { id: 'cx', label: 'Cervix 4/70/-2, unchanged since 03:00', key: false, need: true },
          { id: 'song', label: 'Husband playing Selena', key: false, need: true },
        ];
      },
      requests: [
        { id: 'tachy', label: 'She has tachysystole on oxytocin with a changing tracing. I\'ve stopped the oxytocin, turned her and given 500 mL. Can you come look at the strip? Do you want terbutaline if it persists?' },
        { id: 'restart', label: 'She\'s had more than 30 minutes of a Category I tracing with normal contractions. I\'d like to restart the oxytocin at half the last rate per protocol.' },
        { id: 'up', label: 'The order set says to keep going up. Okay to increase to 10?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'up') { P.resUp = true; A.judge('221-sbar-up', 'judgment', alBad(P) ? -2 : 0, alBad(P) ? `You asked to increase Ms. Fuentes's oxytocin with an abnormal strip.` : `You asked permission for a titration the order already allows.`, alBad(P) ? `With tachysystole or late decelerations the protocol is to reduce or stop, not to ask about going up.` : `The order covers routine titration on a normal strip; the call is for when something's wrong.`, '221'); return alBad(P) ? `How many contractions is she having? Send me the strip before anyone touches that pump.` : `If the strip is Category I and she's 5 or fewer in 10, go ahead per the order set.`; }
        if (req === 'tachy') {
          if (!picked.includes('ctx') && !picked.includes('strip')) return `What does the strip show? How many contractions?`;
          P.called = s.t;
          A.judge('221-sbar', 'comm', picked.includes('done') ? 2 : 1, `You called Dr. Adeyemi about Ms. Fuentes's tachysystole.`, `Lead with the contraction count and the tracing, then what you've already done under the protocol. The provider decides on terbutaline and the plan for labor.`, '221');
          return `Good. Keep it off. Terbutaline per protocol if she's still over 5 in 10 with the oxytocin off. Thirty minutes of a Category I strip, then restart at half. I'll tell the resident.`;
        }
        if (req === 'restart') {
          const ok = P.offAt !== null && s.t - P.offAt >= 30 && !alBad(P);
          A.judge('221-sbar-restart', 'comm', ok ? 1 : -1, ok ? `You told Dr. Adeyemi you were restarting at half rate after recovery.` : `You asked to restart Ms. Fuentes's oxytocin before she met the protocol.`, ok ? `A restart after tachysystole is worth a heads-up: the provider will want the strip watched closely.` : `Thirty minutes of a Category I tracing with normal contractions comes first.`, '221');
          return ok ? `Agreed. Half rate, recheck in 30 minutes, call me if she's over 5 in 10 again.` : `Not yet. Give her the full 30 minutes of a normal strip first.`;
        }
        A.judge('221-sbar-fyi', 'comm', 0, `You called with an update on Ms. Fuentes.`, `Lead with what changed and what you need.`, '221');
        return `Thanks. Keep an eye on the contraction count.`;
      },
    },
    scene: (s, P) => ({ tele: true, iv: 'running', o2: P.o2 ? 10 : 0, family: P.gone ? null : 'rafael', familyLabel: 'Rafael, her husband, with a speaker playing Selena', flowers: false, empty: P.gone, emptyText: 'Bed empty, monitor straps on the floor. Emergency cesarean for a Category III tracing.' }),
    clues: (s, P) => ({ monitor: P.gone ? 'Monitor off.' : `Fetal monitor: heart rate around ${alBase(P)}. The contraction line ${alTachy(P) ? 'hardly comes back to baseline before the next hill starts' : 'shows hills with flat stretches between them'}.`, iv: `Pump 1: oxytocin ${P.oxy ? P.oxy + ' milliunits/min' : 'stopped'}. Pump 2: LR at 125 mL/h${P.bolus ? ', plus a 500 mL bolus bag' : ''}.`, family: `Rafael with a phone speaker and a printed playlist titled "Lucía's Birthday." He's mouthing the count for her.` }),
    rig: (s, P) => ({ anxious: alTachy(P) ? .5 : 0, pain: alTachy(P) ? 8 : 5 }),
    status: (s, P) => (P.gone ? 'gone' : alCat(P) >= 3 || (alCat(P) >= 2 && alTachy(P)) ? 'urgent' : alCat(P) >= 2 || alTachy(P) ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.gone) return { tone: 'bad', title: 'Emergency cesarean for a Category III tracing', text: `Tachysystole on oxytocin ran on until the variability went flat with late decelerations at ${clock(P.goneAt)}. ${P.upBad ? 'The oxytocin was turned up into it. ' : ''}Lucía was born by emergency cesarean with APGARs of 3 and 7 and a cord pH of 7.08; she went to the NICU for observation.` };
      const acted = P.offAt !== null || P.decAt !== null;
      const misses = [!acted && 'the oxytocin was never reduced or stopped', P.upBad && 'the oxytocin was turned up into tachysystole', P.restartBad && 'a restart before 30 minutes of a normal strip', acted && P.actFs >= .45 && 'action came only after the variability went minimal', !P.reassessed && acted && 'the tracing was never rechecked after resuscitation', P.efmAt === null && 'the tracing was never reviewed'].filter(Boolean);
      if (acted && !misses.length) return { tone: 'good', title: 'Tachysystole caught, labor back on track', text: `Oxytocin ${P.offAt !== null ? 'stopped' : 'halved'} at ${clock(P.offAt !== null ? P.offAt : P.decAt)}, side-lying${P.bolus ? ', a bolus' : ''}; the strip recovered by ${P.recoveredAt !== null ? clock(P.recoveredAt) : 'late morning'}. ${P.restartAt !== null ? `Restarted at ${clock(P.restartAt)} at half the rate.` : 'Still off at noon, waiting on a restart.'} Category I at handoff.` };
      return { tone: alCat(P) >= 2 ? 'bad' : 'mixed', title: alCat(P) >= 2 ? 'Abnormal tracing at handoff' : 'Recovered, with gaps', text: `${misses.length ? 'Missed: ' + misses.join('; ') + '.' : ''} Strip at noon: Category ${alCat(P)}, ${alN(P)} contractions in 10 minutes.` };
    },
  };

  /* ---------- 222 Brianna Scott: epidural hypotension, a full bladder, then a fast second stage ---------- */
  const brSBP = (P) => Math.round(124 - 42 * P.hypo);
  const brDBP = (P) => Math.round(72 - 28 * P.hypo);
  const brDil = (s) => (s.t < 60 ? 6 : s.t < 130 ? 7 : s.t < 185 ? 8 : s.t < 200 ? 10 : 10);
  const brStation = (s) => (s.t < 60 ? '-1' : s.t < 130 ? '0' : s.t < 185 ? '+1' : '+2');
  const brBorn = (P) => P.bornAt !== null;
  const brAtony = (s, P) => { if (P.placentaAt === null) return 0; let a = (P.bladder ? 1 : 0) + (P.ppOxy === null ? 1 : 0) + (P.pulledCord ? .5 : 0); if (P.massAt !== null && s.t - P.massAt < 10) a *= .4; return a; };
  const brVig = (P) => !P.slow && !P.fetalHit && !P.pulledHead;
  function brStrip(s, P) {
    if (brBorn(P)) return `The baby is born. The fetal monitor is off.`;
    if (P.hypo >= .5) return stripLine({ base: 135, varb: 'minimal', accel: false, decel: `Prolonged deceleration: the FHR dropped from 135 to 90 at ${clock(P.hypoAt)} and has stayed near 90 for ${s.t - P.hypoAt} minutes.`, n: 3, tone: 'the uterus soft between them' });
    if (P.hypo >= .2) return stripLine({ base: 125, varb: 'minimal', accel: false, decel: `Coming back up after a prolonged deceleration: now in the 120s.`, n: 3, tone: 'the uterus soft between them' });
    if (P.crown) return stripLine({ base: 140, varb: 'moderate', accel: false, decel: `Variable decelerations to about 100 with each push, abrupt, back to baseline within 30 seconds.`, n: 5, tone: 'each 60 to 90 seconds' });
    if (s.t >= 185) return stripLine({ base: 135, varb: 'moderate', accel: false, decel: `Early decelerations: gradual, shallow dips that mirror each contraction, the low point at the peak.`, n: 4, tone: 'each 60 to 80 seconds' });
    return stripLine({ base: 135, varb: 'moderate', accel: true, decel: `No decelerations.`, n: s.t < 90 ? 3 : 4, tone: 'each 60 to 70 seconds' });
  }
  const brianna = {
    id: '222', room: '222', name: 'Brianna Scott', short: 'Ms. Scott', age: 24, sex: 'F', mrn: '00740288', provider: 'adeyemi',
    look: { skin: '#7A4E36', shade: '#5E3A27', lip: '#5A3024', blush: '#A0604A', iris: '#24160D', head: { w: 55, h: 60, jaw: .3 }, eye: 10, hair: { style: 'curls', color: '#1A120E' }, brow: { w: 3.2, color: '#140E0A' }, body: { w: 82, cloth: 'gown' }, extras: ['hoops'], smile: .45,
      lines: { calm: `Okay, I can't feel a thing. This is so much better than last time.`, dizzy: `I feel weird. Hot. Like I'm going to throw up.`, anxious: `Why's everybody looking at the monitor?`, pain: `Pressure. So much pressure. I have to push!`, drowsy: `I might sleep a little.`, none: `(She doesn't answer.)` } },
    bio: `Works the front desk at a veterinary clinic. Second baby, a girl. Her son Mason is three; he came in five hours, start to finish. Jordan, her partner, drives for a delivery company and came straight from a double shift.`,
    dx: `Active labor with an epidural`, reason: `Second baby at 40 weeks 1 day. Spontaneous labor since 01:00. 6 cm at 06:30. Epidural placed at 06:40 by Dr. Kwan.`,
    hx: [`G2 P1. First birth: vaginal, 5-hour labor, no complications`, `Iron deficiency anemia, on iron`, `No other medical problems`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `74 kg`,
    lines: [`PIV 18g right forearm: LR at 125 mL/h`, `Lumbar epidural: continuous infusion and patient-controlled boluses`, `External fetal monitor and tocodynamometer`],
    mobility: `Bed rest with epidural; turn side to side every hour`, diet: `Clear liquids`,
    init: { hypo: 0, hypoAt: null, hypoMin: 0, lateral: false, bolus: false, pressAt: null, anesAt: null, kwanCame: false, ondanAt: null, rescued: false, fetalHit: false, bladder: true, cathAt: null, sveAt: null, complete: false, setup: false, warned: null, crown: false, crownAt: null, held: false, help: false, stage: 0, headAt: null, nuchal: null, slow: false, pulledHead: false, bornAt: null, bornBy: null, dried: null, cord: null, placentaAt: null, placentaBy: null, pulledCord: false, ppOxy: null, fundusAt: null, massAt: null, massN: 0, qbl: 0, apgar1: null, apgar5: null, efmAt: null, efmN: 0, called: null },
    nightVitals: { T: 36.9, HR: 92, SBP: 124, DBP: 72, RR: 18, SpO2: 99, O2: 'Room air', pain: 1 },
    labs: [
      { name: 'Hemoglobin', val: 11.2, unit: 'g/dL', ref: '11.0 or more in the third trimester', flag: '', t: -300 },
      { name: 'Platelets', val: 196, unit: 'K/µL', ref: '150 to 400', flag: '', t: -300 },
      { name: 'Blood type', val: 'A positive, antibody screen negative', unit: '', ref: '', flag: '', t: -300 },
      { name: 'GBS', val: 'Negative at 36 weeks', unit: '', ref: '', flag: '', t: -30000 },
    ],
    orders: [
      { t: -20, text: `Epidural (Dr. Kwan, placed 06:40): BP every 5 minutes for 15 minutes after placement or any bolus, then every 15 minutes. For SBP under 90 or a drop of 20% or more from baseline: left lateral position, LR 500 mL IV bolus, phenylephrine 100 mcg IV (may repeat every 2 minutes, up to 3 doses), and notify anesthesia.` },
      { t: -20, text: `Bladder: palpate every 2 hours. Bladder scan and straight catheterize for a distended bladder or no void in 3 to 4 hours. Ondansetron 4 mg IV every 6 hours as needed for nausea.` },
      { t: -300, text: `After birth: oxytocin 30 units in 500 mL LR, 10 units over the first 30 minutes, then 125 mL/h. Quantitative blood loss. Delayed cord clamping 30 to 60 seconds and skin to skin for a vigorous term newborn (unit policy and her birth plan).` },
    ],
    notes: [
      { t: -15, author: 'Tasha, night RN', text: `6/90/-1 at 06:30. Epidural by Dr. Kwan at 06:40, test dose negative, comfortable. BP 124/72 after placement. Last void about 04:00. Partner asleep in recliner. G2, first labor 5 h.` },
    ],
    io: { intake: `LR 125 mL/h; 500 mL preload before the epidural`, output: `Last void about 04:00` },
    report: [
      { text: `Brianna Scott, 24, second baby, 40 and 1, spontaneous labor. Epidural went in at six-forty.`, key: true },
      { text: `Her first baby came in five hours, start to finish.`, key: true },
      { text: `She hasn't peed since about four. I haven't cathed her yet.`, key: true },
      { text: `She was 6 at six-thirty.`, key: false },
      { text: `Her partner Jordan's asleep in the chair. He worked a double.`, key: false },
      { text: `Birth plan says delayed cord clamping and skin to skin. Pretty standard.`, key: false },
    ],
    vitals(s, P) {
      return { T: 36.9, HR: Math.round(92 + 22 * P.hypo + (P.crown && !brBorn(P) ? 14 : 0)) + jit(s, 3), SBP: brSBP(P) + jit(s, 4), DBP: brDBP(P), RR: P.crown && !brBorn(P) ? 24 : 18, SpO2: 99, O2: 'Room air', pain: P.crown && !brBorn(P) ? 6 : brBorn(P) ? 2 : 1,
        extra: brBorn(P) ? `QBL ${Math.round(P.qbl)} mL.` : `FHR ${P.hypo >= .5 ? '90 (prolonged deceleration)' : P.hypo >= .2 ? '120s, recovering' : 'baseline 135'}.` };
    },
    assess: {
      general: (s, P) => (P.hypo >= .4 ? `Pale, sweaty, a basin in her hands. "I'm going to be sick."` : P.crown && !brBorn(P) ? `Up on her elbows, bearing down without being told. "She's coming!"` : brBorn(P) ? `Laughing and crying, the baby on her chest.` : `Comfortable, scrolling her phone, legs heavy under the blanket.`),
      resp: () => `RR 18, clear.`,
      cardiac: (s, P, A) => { const v = A.vitals('222'); return `HR ${v.HR}. BP ${v.SBP}/${v.DBP}${P.hypo >= .3 ? ', down from 124/72 before the epidural' : ''}. ${P.hypo >= .4 ? 'Cool, clammy hands.' : 'Warm hands.'}`; },
      neuro: (s, P) => (P.hypo >= .4 ? `Lightheaded. Sensory level to T10 bilaterally. Can't lift either leg.` : `Alert. Sensory level T10. Legs heavy; she can bend her knees a little.`),
      pain: (s, P) => (brBorn(P) ? `Cramping 2/10. Perineum numb from the epidural.` : P.crown ? `Intense rectal pressure through the epidural.` : s.t >= 185 ? `Pressure 3/10 with contractions, "like I need to push."` : `1/10. Feels contractions as tightening only.`),
      skin: (s, P) => (brBorn(P) ? `Warm. Small perineal tear, oozing. IV site clean.` : `Warm, dry. Epidural dressing dry and intact. IV site clean.`),
      gi: (s, P) => { P.k.gi = s.t; if (brBorn(P)) return P.placentaAt === null ? `Uterus firm at the umbilicus, the cord still trailing. Waiting on the placenta.` : `Fundus ${brAtony(s, P) >= 1 ? 'boggy, 2 cm above the umbilicus' + (P.bladder ? ', pushed to the right by a full bladder' : '') : 'firm at the umbilicus, midline'}. ${P.bladder ? 'Bladder full above the pubic bone.' : 'Bladder empty.'}`; return P.bladder ? `A firm, rounded fullness above the pubic bone: a full bladder. No void since about 04:00; she can't feel the urge with the epidural.` : `Bladder not palpable after the catheter. Uterus contracting every 3 to 4 minutes.`; },
    },
    interventions: [
      { id: 'efm', label: 'Review the fetal monitor tracing (last 30 minutes)', cost: 2, avail: (s, P) => !brBorn(P),
        run(s, P, A) {
          P.efmAt = s.t; P.efmN += 1;
          if (P.hypo >= .5) A.judge('222-efm', 'assess', 2, `You checked Ms. Scott's tracing and found a prolonged deceleration.`, `A drop of 15 bpm or more lasting 2 to 10 minutes is a prolonged deceleration. Right after an epidural, with nausea, think maternal hypotension first: less pressure, less blood to the placenta.`, '222');
          else if (P.efmN === 1) A.judge('222-efm-1', 'assess', 1, `You checked Ms. Scott's tracing.`, `After a new epidural, watch the mother's pressure and the baby's heart rate together.`, '222');
          return brStrip(s, P);
        } },
      { id: 'lateral', label: 'Turn her onto her left side, a wedge under her hip', cost: 1, avail: (s, P) => !P.lateral && !brBorn(P) && !P.crown,
        run(s, P, A) { P.lateral = true; A.judge('222-lateral', 'safety', P.hypo >= .3 ? 1 : 0, P.hypo >= .3 ? `You turned Ms. Scott onto her side for hypotension.` : `You turned Ms. Scott onto her side.`, P.hypo >= .3 ? `Off her back, the uterus stops pressing on the vena cava and more blood returns to her heart and the placenta. It's the first step, not the only one.` : `With an epidural she can't turn herself; side to side every hour protects her skin and helps the baby rotate.`, '222'); return `On her left side with a wedge and the peanut ball. Monitor straps adjusted.`; } },
      { id: 'bolus', label: 'IV fluid bolus: lactated Ringer\'s 500 mL', cost: 2, avail: (s, P) => !P.bolus && !brBorn(P),
        run(s, P, A) { P.bolus = true; A.judge('222-bolus', 'safety', P.hypo >= .3 ? 1 : 0, P.hypo >= .3 ? `You gave Ms. Scott a fluid bolus for epidural hypotension.` : `You gave a bolus she didn't need yet.`, P.hypo >= .3 ? `The epidural relaxes her blood vessels; fluid refills them. It works over minutes, so a vasopressor goes in alongside it when the baby is already showing it.` : `The epidural order gives fluid for hypotension.`, '222'); return `LR 500 mL running wide open.`; } },
      { id: 'anes', label: 'Call anesthesia (Dr. Kwan) to the bedside', cost: 1, avail: (s, P) => P.anesAt === null && !brBorn(P),
        run(s, P, A) { P.anesAt = s.t; A.judge('222-anes', 'comm', P.hypo >= .3 ? 2 : 0, P.hypo >= .3 ? `You called anesthesia about Ms. Scott's hypotension.` : `You called anesthesia with no problem to report.`, P.hypo >= .3 ? `The epidural order says notify anesthesia. They may change the infusion, and they own the epidural.` : `Call when there's something to act on.`, '222'); return P.hypo >= .3 ? `Dr. Kwan: "Turn her, bolus, phenylephrine 100 per the order. I'm two rooms away; I'll be there in a few minutes."` : `Dr. Kwan: "Okay. Anything wrong?"`; } },
      { id: 'cath', label: 'Bladder scan, then straight catheterize per order', cost: 5, avail: (s, P) => P.bladder && !(P.crown && !brBorn(P)),
        run(s, P, A) {
          P.bladder = false; P.cathAt = s.t;
          A.judge('222-cath', 'safety', brBorn(P) ? 1 : 2, brBorn(P) ? `You emptied Ms. Scott's bladder after the birth.` : `You noticed Ms. Scott's full bladder and catheterized her.`, `With an epidural she can't feel a full bladder. A distended bladder takes up room the baby's head needs to descend and, after birth, keeps the uterus from clamping down: a setup for hemorrhage.`, '222');
          return `Bladder scan: 690 mL. Straight catheter, sterile technique: 680 mL of clear yellow urine.${brBorn(P) ? ' The fundus firms and moves to the midline.' : ' On the next contraction the head feels lower under your hand.'}`;
        } },
      { id: 'sve', label: 'Sterile vaginal exam', cost: 3, avail: (s, P) => !brBorn(P) && !P.crown,
        run(s, P, A) { P.sveAt = s.t; const d = brDil(s); if (d >= 10) { P.complete = true; A.judge('222-sve', 'assess', 1, `You checked Ms. Scott's cervix and found her complete.`, `Fully dilated with the head at +2 in a woman whose first labor was five hours: this baby is coming soon. Get the room and the team ready.`, '222'); }
          return d >= 10 ? `Complete, 100% effaced, +2 station, head well applied. She feels pressure with every contraction.` : `${d} cm, 100% effaced, ${brStation(s)} station. Membranes ruptured, clear fluid.`; } },
      { id: 'setup', label: 'Get ready early: open the delivery table, warm the infant warmer, check the newborn resuscitation equipment, tell Nova', cost: 3, avail: (s, P) => !P.setup && !brBorn(P) && s.t >= 120,
        run(s, P, A) { P.setup = true; A.judge('222-setup', 'safety', brDil(s) >= 8 ? 1 : 0, brDil(s) >= 8 ? `You set up for Ms. Scott's delivery before it was urgent.` : `You set up for delivery early.`, `A second baby after a fast first labor can come quickly once she's complete. A warm warmer, a checked bag-mask and an open table save the minutes you won't have.`, '222'); return `Delivery table open, infant warmer on and warming, bag-mask and suction checked. Nova knows 222 might go fast.`; } },
      { id: 'help', label: 'Call for help: Nova to the room, page Dr. Adeyemi and the pediatric team, open the delivery kit', cost: 1, avail: (s, P) => P.crown && !P.help && !brBorn(P),
        run(s, P, A) { P.help = true; A.judge('222-help', 'safety', 2, `You called for help as Ms. Scott's baby crowned.`, `An unplanned birth is a two-nurse event: one for the mother, one for the baby. Call first, then stay with her.`, '222'); return `Emergency bell pressed. Nova: "Coming!" Dr. Adeyemi paged; the pediatric team is on the way. Delivery kit open on the bed: gloves, towels, two clamps, scissors, a bulb syringe.`; } },
      { id: 'head', label: 'Support the head with gentle pressure; coach her to pant so it delivers slowly', cost: 2, avail: (s, P) => P.crown && P.stage === 0 && !brBorn(P),
        run(s, P, A) { P.stage = 1; P.headAt = s.t; A.judge('222-head', 'safety', 2, `You supported the baby's head as it delivered.`, `Gentle pressure with a flat hand keeps the head from popping out and tearing the perineum. You're controlling the speed, not stopping it. Panting instead of pushing slows things down.`, '222'); return `The head delivers slowly under your hand, face down, then turns to her right thigh. Brianna pants. Jordan is holding her hand and making a sound you've never heard a person make.`; } },
      { id: 'nuchal', label: 'Feel for a cord around the baby\'s neck', cost: 1, avail: (s, P) => P.stage === 1 && P.nuchal === null && !brBorn(P),
        run(s, P, A) { P.nuchal = 'slipped'; A.judge('222-nuchal', 'assess', 1, `You checked for a nuchal cord.`, `A loose loop is common and is slipped over the head. A tight one that won't slip can be delivered through, or clamped and cut, by the provider.`, '222'); return `One loose loop of cord around the neck. You hook a finger under it and slip it over the head.`; } },
      { id: 'shoulders', label: 'Let the shoulders deliver with the next contraction: gentle guidance down for the front shoulder, then up for the back', cost: 2, avail: (s, P) => P.stage === 1 && !brBorn(P),
        run(s, P, A) {
          if (P.nuchal === null) { P.nuchal = 'missed'; P.slow = true; A.judge('222-nuchal', 'assess', -1, `You delivered the body without checking for a nuchal cord.`, `A loop around the neck tightens as the body delivers. Feel for it after the head is out: slip it over if it's loose.`, '222'); }
          P.stage = 2; P.bornAt = s.t; P.bornBy = 'you'; P.qbl = 200;
          return `With the next contraction the front shoulder slides under the pubic bone, then the back one, and she's out: a girl, at ${clock(s.t)}. ${P.nuchal === 'missed' ? 'A loop of cord was snug around her neck; she\'s slower to cry.' : 'She cries before her feet are out.'}`;
        } },
      { id: 'pullhead', label: 'Pull on the head to get the shoulders out quickly', cost: 1, avail: (s, P) => P.stage === 1 && !brBorn(P),
        run(s, P, A) { P.pulledHead = true; P.stage = 2; P.bornAt = s.t; P.bornBy = 'you'; P.qbl = 250; if (P.nuchal === null) P.nuchal = 'missed';
          A.judge('222-pullhead', 'safety', -2, `You pulled on the baby's head to deliver the shoulders.`, `Traction on the head stretches the brachial plexus. The shoulders come with the next contraction and gentle guidance; there's no hurry once the head is out and the cord is checked.`, '222');
          return `She delivers with a jerk at ${clock(s.t)}. Her right arm hangs limp at her side.`; } },
      { id: 'dry', label: 'Dry and stimulate her on her mother\'s chest, skin to skin, warm blankets, a hat; note the time of birth', cost: 2, avail: (s, P) => brBorn(P) && P.dried === null,
        run(s, P, A) { P.dried = s.t; const fast = s.t - P.bornAt <= 2; A.judge('222-dry', 'safety', fast ? 2 : 1, fast ? `You dried and stimulated the baby skin to skin right away.` : `You dried the baby, a few minutes late.`, `NRP's first steps: warm, dry, stimulate, position the airway. A wet newborn loses heat fast; skin to skin is the best warmer there is.`, '222'); return `Rubbed dry with warm towels, wet towels off, a hat on, skin to skin on Brianna's chest under a warm blanket. Time of birth on the whiteboard: ${clock(P.bornAt)}. She's pinking up and yelling.`; } },
      { id: 'cordwait', label: 'Wait 30 to 60 seconds, then clamp and cut the cord', cost: 1, avail: (s, P) => brBorn(P) && P.cord === null,
        run(s, P, A) { P.cord = 'late'; A.judge('222-cord', 'judgment', 1, `You delayed cord clamping for a vigorous baby.`, `Delayed clamping for 30 to 60 seconds in a vigorous term baby moves blood from the placenta and raises iron stores for months. It's also on her birth plan.`, '222'); return `You wait a full minute, the cord still pulsing, then clamp twice and Jordan cuts between the clamps.`; } },
      { id: 'cordnow', label: 'Clamp and cut the cord now and take her to the warmer', cost: 1, avail: (s, P) => brBorn(P) && P.cord === null,
        run(s, P, A) { P.cord = 'early'; A.judge('222-cord', 'judgment', -1, `You clamped the cord right away and separated a vigorous baby from her mother.`, `A crying, vigorous term baby needs warmth and her mother's chest, not the warmer. Delayed clamping is recommended for vigorous term babies.`, '222'); return `Clamped and cut. She screams on the warmer until Nova brings her back to Brianna.`; } },
      { id: 'placenta', label: 'Wait for the placenta: watch for separation (a gush of blood, the cord lengthening, the uterus rising), then let her push it out', cost: 3, avail: (s, P) => brBorn(P) && P.placentaAt === null && s.t >= P.bornAt + 4,
        run(s, P, A) { P.placentaAt = s.t; P.placentaBy = 'you'; P.qbl += 150; A.judge('222-placenta', 'safety', 1, `You waited for signs of separation and let the placenta deliver.`, `Signs of separation: a gush of blood, the cord lengthening, the uterus rising and becoming globe-shaped. Then gentle guidance only, never traction on a cord that hasn't separated.`, '222'); return `A small gush, the cord lengthens, the uterus rises. One push and the placenta delivers at ${clock(s.t)}, intact, three-vessel cord. Into the basin for Dr. Adeyemi to inspect.`; } },
      { id: 'pullcord', label: 'Pull on the cord to deliver the placenta now', cost: 1, avail: (s, P) => brBorn(P) && P.placentaAt === null,
        run(s, P, A) { P.pulledCord = true; P.placentaAt = s.t; P.placentaBy = 'pulled'; P.qbl += 650;
          A.judge('222-pullcord', 'safety', -3, `You pulled on the cord before the placenta separated.`, `Traction on a cord that hasn't separated can tear it or turn the uterus inside out (uterine inversion), a hemorrhage emergency. Wait for the signs of separation.`, '222');
          return `The placenta comes with a rush of blood and the fundus disappears from under your hand. Nova pushes the call bell twice. Dr. Adeyemi, arriving, replaces the uterus by hand: a partial inversion.`; } },
      { id: 'fundus', label: 'Check her fundus and bleeding; weigh the pads (QBL)', cost: 2, avail: (s, P) => P.placentaAt !== null,
        run(s, P, A) { const first = P.fundusAt === null; P.fundusAt = s.t; const at = brAtony(s, P);
          if (first) A.judge('222-fundus', 'assess', at >= 1 ? 2 : 1, at >= 1 ? `You checked Ms. Scott's fundus and found it boggy.` : `You checked Ms. Scott's fundus after the placenta.`, `Every 15 minutes for the first hour after birth: tone, height, position, bleeding. Boggy and off to one side means atony, and a full bladder is the usual reason.`, '222');
          return `Fundus ${at >= 1 ? 'boggy, 2 cm above the umbilicus' + (P.bladder ? ', deviated to the right' : '') : 'firm, at the umbilicus, midline'}. ${at >= 1 ? 'Steady trickle of dark blood, small clots.' : 'Bleeding light.'} QBL ${Math.round(P.qbl)} mL.`; } },
      { id: 'massage', label: 'Fundal massage, supporting the lower segment', cost: 2, avail: (s, P) => P.placentaAt !== null && brAtony(s, P) > 0,
        run(s, P, A) { P.massAt = s.t; P.massN += 1; A.judge('222-massage', 'judgment', 1, `You massaged Ms. Scott's fundus.`, `Massage contracts the uterus for minutes. Then fix the cause: an empty bladder and the oxytocin.`, '222'); return `Firm under your hand after a minute. 80 mL of clots expressed.${P.bladder ? ' It drifts up and to the right again: the bladder.' : ''}`; } },
    ],
    meds: [
      { id: '222-phenyl', name: 'Phenylephrine', dose: '100 mcg', route: 'IV push', freq: 'Per epidural order: SBP under 90 or a 20% drop; may repeat every 2 minutes, up to 3 doses', prn: true, available: (s, P) => !brBorn(P),
        checks: (s, P) => [{ label: 'BP', value: `${brSBP(P)}/${brDBP(P)} (baseline 124/72)`, ok: P.hypo >= .3 }, { label: 'FHR', value: P.hypo >= .5 ? '90, prolonged deceleration' : 'Baseline', ok: null }, { label: 'Anesthesia', value: P.anesAt !== null ? 'Notified' : 'Not yet notified', ok: P.anesAt !== null }],
        give(s, P, A) {
          if (P.hypo >= .3) { P.pressAt = s.t; A.judge('222-phenyl', 'meds', 2, `You gave phenylephrine for Ms. Scott's epidural hypotension.`, `An alpha agonist tightens the vessels the epidural relaxed. Her pressure comes up in a minute or two, and the baby's heart rate follows. Recheck the BP every 2 to 5 minutes.`, '222'); return `Phenylephrine 100 mcg IV push, flushed. BP ${brSBP(P)}/${brDBP(P)} two minutes later and climbing.`; }
          A.judge('222-phenyl', 'meds', -1, `You gave phenylephrine without hypotension.`, `Her order is for SBP under 90 or a 20% drop. Without it, you're raising a normal pressure.`, '222'); return `Phenylephrine 100 mcg IV. BP 146/88.`;
        } },
      { id: '222-ondan', name: 'Ondansetron', dose: '4 mg', route: 'IV', freq: 'Every 6 hours as needed, nausea', prn: true,
        checks: (s, P) => [{ label: 'BP', value: `${brSBP(P)}/${brDBP(P)}`, ok: P.hypo < .3 }, { label: 'Nausea', value: P.hypo >= .4 ? 'Yes, with lightheadedness' : 'No', ok: null }],
        give(s, P, A) { P.ondanAt = s.t; if (P.hypo >= .4 && P.pressAt === null) A.judge('222-ondan', 'judgment', -1, `You treated Ms. Scott's nausea while her pressure was ${brSBP(P)}/${brDBP(P)}.`, `Sudden nausea after an epidural is often the first sign of hypotension. Treat the pressure; the nausea usually goes with it.`, '222'); return `Ondansetron 4 mg IV over 2 minutes.`; } },
      { id: '222-oxypp', name: 'Oxytocin (postpartum)', dose: '30 units in 500 mL LR', route: 'IV', freq: 'After birth: 10 units over the first 30 minutes, then 125 mL/h', prn: true, available: (s, P) => brBorn(P),
        block: (s, P) => (P.ppOxy !== null ? `Running since ${clock(P.ppOxy)}.` : null),
        checks: (s, P) => [{ label: 'Birth', value: P.bornAt !== null ? clock(P.bornAt) : 'Not yet', ok: P.bornAt !== null }, { label: 'Placenta', value: P.placentaAt !== null ? 'Delivered' : 'Not yet', ok: null }],
        give(s, P, A) { P.ppOxy = s.t; A.judge('222-oxypp', 'meds', 2, `You started Ms. Scott's postpartum oxytocin.`, `Oxytocin after birth (after the anterior shoulder or the placenta, by unit policy) is the single best prevention for postpartum hemorrhage.`, '222'); return `Oxytocin running on the pump: 10 units over 30 minutes, then 125 mL/h.`; } },
    ],
    talk: (s, P) => (P.crown && !brBorn(P) ? 'br_push' : brBorn(P) ? 'br_baby' : P.hypo >= .4 ? 'br_sick' : P.k.talked ? 'br_after' : 'br_talk'),
    family: { name: 'Jordan', rel: 'Partner', mode: 'bedside', cost: 3, dialog: (s, P) => (brBorn(P) ? 'jor_after' : P.hypo >= .3 ? 'jor_scared' : 'jor_talk') },
    sbar: {
      items(s, P, A) {
        return [
          { id: 'bp', label: `BP ${brSBP(P)}/${brDBP(P)} after the epidural, nauseated`, key: P.hypo >= .3, need: P.hypoAt !== null },
          { id: 'fhr', label: P.hypo >= .5 ? `Prolonged deceleration to 90 since ${clock(P.hypoAt)}` : 'FHR baseline 135, moderate variability', key: P.hypo >= .5, need: P.efmAt !== null, lock: 'Review the tracing' },
          { id: 'done', label: `Done: ${[P.lateral ? 'left side' : null, P.bolus ? 'LR 500 mL' : null, P.pressAt !== null ? 'phenylephrine' : null, P.anesAt !== null ? 'anesthesia called' : null].filter(Boolean).join(', ') || 'nothing yet'}`, key: P.pressAt !== null || P.lateral, need: true },
          { id: 'cx', label: P.complete ? 'Complete, +2 station' : `${brDil(s)} cm at last check`, key: P.complete, need: P.sveAt !== null, lock: 'Check her cervix' },
          { id: 'fast', label: 'First labor was 5 hours', key: P.complete, need: true },
          { id: 'bladder', label: P.bladder ? 'Full bladder, no void since 04:00' : 'Straight cath for 680 mL', key: false, need: true },
          { id: 'vet', label: 'Works at a veterinary clinic', key: false, need: true },
        ];
      },
      requests: [
        { id: 'hypo', label: 'Her pressure dropped after the epidural with a prolonged deceleration. I turned her, gave a bolus and phenylephrine per the order, and called anesthesia. Can you look at the strip?' },
        { id: 'complete', label: 'She\'s complete and +2, and her first labor was five hours. Can you come now? I\'ve set up the room.' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'hypo') {
          if (P.hypoAt === null) return `Her pressure's fine on the last set, isn't it?`;
          P.called = s.t; A.judge('222-sbar', 'comm', picked.includes('fhr') && picked.includes('bp') ? 2 : 1, `You called Dr. Adeyemi about Ms. Scott's hypotension and deceleration.`, `Pressure, baby, what you've done. The OB needs to know a prolonged deceleration happened, even when it recovers.`, '222');
          return P.hypo < .5 ? `Good, sounds like it's coming back. Keep her tilted, and call me if the baby's not back to baseline in a few minutes.` : `I'm coming to look. Keep going with the phenylephrine per Kwan's order.`;
        }
        if (req === 'complete') {
          if (!P.complete) return `What was her last exam?`;
          P.warned = s.t; A.judge('222-sbar-complete', 'comm', picked.includes('fast') ? 2 : 1, `You warned Dr. Adeyemi that Ms. Scott was complete with a fast history.`, `A second baby after a five-hour first labor, complete at +2: the provider needs to know now, not when the head is out.`, '222');
          return `I'm scrubbed in a section in 226 for at least 20 minutes. Labor her down if she has no urge, get Nova, call peds if it moves. You know what to do if she goes.`;
        }
        A.judge('222-sbar-fyi', 'comm', 0, `You called with an update on Ms. Scott.`, `Lead with what changed.`, '222');
        return `Okay. Call me when she's complete.`;
      },
    },
    scene: (s, P) => ({ tele: true, iv: 'running', foley: false, crib: brBorn(P), family: 'jordan', familyLabel: brBorn(P) ? 'Jordan, holding the baby\'s foot' : 'Jordan, her partner, in a delivery company polo', flowers: false }),
    clues: (s, P) => ({ monitor: brBorn(P) ? 'Monitor off. The baby\'s first footprints are on the whiteboard.' : `Fetal monitor: ${P.hypo >= .5 ? 'heart rate 90 and flat for minutes. The maternal cuff blinks 82/44.' : P.crown ? 'heart rate dipping with each push, popping back up.' : 'heart rate in the 130s, contractions every 3 to 4 minutes.'}`, iv: `LR at 125 mL/h${P.bolus ? ', a bolus bag open' : ''}. Epidural pump at 10 mL/h.${P.ppOxy !== null ? ' Postpartum oxytocin running.' : ''}`, family: `Jordan, in a delivery company polo, asleep with his phone on his chest${brBorn(P) ? '; now very awake' : ''}. A car seat by the door, still in its box.`, crib: brBorn(P) ? `Infant warmer, on. A tiny hat, a blanket, an ID band waiting.` : `Infant warmer, ${P.setup ? 'on and warm' : 'off'}.` }),
    rig: (s, P) => ({ sbp: brSBP(P), anxious: P.hypo >= .4 ? .5 : P.crown && !brBorn(P) ? .7 : 0, pain: P.crown && !brBorn(P) ? 6 : 1 }),
    // Labor going normally is stable; the tag moves for hypotension, crowning, the third stage, or a uterus at risk of atony.
    status: (s, P) => (P.hypo >= .4 || (P.crown && !brBorn(P)) || (P.placentaAt !== null && brAtony(s, P) >= 1.5) ? 'urgent' : P.hypo >= .15 || (brBorn(P) && (P.placentaAt === null || brAtony(s, P) >= .5)) ? 'watch' : 'stable'),
    live: (s, P) => (brBorn(P) ? { dx: P.placentaAt !== null ? `Delivered ${clock(P.bornAt)}: fourth stage, epidural` : `Delivered ${clock(P.bornAt)}: placenta not out yet` } : P.crown ? { dx: `Complete and crowning, with an epidural` } : null),
    outcome(s, P) {
      const bad = P.held && P.bornBy !== 'you' || P.qbl >= 1000 || P.pulledCord;
      const misses = [P.rescued && 'Nova had to treat the hypotension', !P.rescued && P.hypoMin >= 15 && 'the hypotension took too long to correct', P.bladder && 'her bladder was never emptied', P.bornBy === 'nova' && 'you weren\'t there for the birth', P.held && 'she was told to hold the baby back', P.bornBy === 'you' && !P.help && 'no help called for the birth', P.nuchal === 'missed' && 'no check for a nuchal cord', P.pulledHead && 'traction on the head', P.cord === 'early' && 'immediate cord clamping', P.ppOxy === null && P.bornAt !== null && 'no postpartum oxytocin'].filter(Boolean);
      const born = P.bornAt !== null ? `Baby girl born at ${clock(P.bornAt)}${P.bornBy === 'nova' ? ', caught by Nova' : ''}${P.pulledHead ? ', a weak right arm (brachial plexus stretch)' : ''}. ` : 'Still laboring at noon. ';
      if (bad) return { tone: 'bad', title: P.pulledCord ? 'Uterine inversion and hemorrhage' : P.qbl >= 1000 ? 'Postpartum hemorrhage' : 'A birth held back', text: `${born}${P.pulledCord ? 'Traction on the cord before separation inverted her uterus; Dr. Adeyemi replaced it. ' : ''}QBL ${Math.round(P.qbl)} mL. ${misses.length ? 'Gaps: ' + misses.join('; ') + '.' : ''}` };
      if (!misses.length && P.bornAt !== null) return { tone: 'good', title: 'Hypotension fixed, a baby caught well', text: `${born}Pressure back up within minutes of the drop; bladder emptied before the birth. Head controlled, cord checked, skin to skin, delayed clamping, placenta on its own, fundus firm. QBL ${Math.round(P.qbl)} mL.` };
      return { tone: 'mixed', title: P.bornAt !== null ? 'Healthy baby, with gaps' : 'Still laboring, with gaps', text: `${born}${misses.length ? 'Gaps: ' + misses.join('; ') + '.' : ''} QBL ${Math.round(P.qbl)} mL.` };
    },
  };

  /* ---------- 223 Fatima Haddad: TOLAC, then a uterine rupture ---------- */
  const faM = (s, P) => (P.rupt ? s.t - P.ruptAt : 0);
  function faStrip(s, P) {
    if (P.rupt) { const m = faM(s, P); return `FHR ${m < 1 ? 'falling fast' : 'about 70'}: a deceleration that began at ${clock(P.ruptAt)} and hasn't recovered (${m} minutes). Variability absent. No accelerations. The contraction line, which showed a contraction every 3 minutes, has been flat since ${clock(P.ruptAt)}.`; }
    if (s.t >= 115) return stripLine({ base: 135, varb: 'moderate', accel: false, decel: `Variable decelerations with most contractions: abrupt drops to 90 to 100, lasting 40 to 60 seconds, quick return to baseline. Deeper over the last 15 minutes.`, n: 5, tone: 'each 60 to 80 seconds' });
    return stripLine({ base: 135, varb: 'moderate', accel: true, decel: 'No decelerations.', n: s.t < 60 ? 3 : 4, tone: 'the uterus soft between them' });
  }
  const fatima = {
    id: '223', room: '223', name: 'Fatima Haddad', short: 'Ms. Haddad', age: 33, sex: 'F', mrn: '00740301', provider: 'adeyemi',
    look: { skin: '#C99A74', shade: '#AA7C58', lip: '#8E5246', blush: '#C8866C', iris: '#2A1B10', head: { w: 55, h: 61, jaw: .35 }, eye: 9.8, hair: { style: 'hijab', color: '#3E5A6A' }, brow: { w: 3.6, color: '#2A1C14' }, body: { w: 84, cloth: 'gown' }, extras: [], smile: .35,
      lines: { calm: `I want to walk while I still can. Is that allowed?`, pain: `That one was strong. I'm breathing. I'm breathing.`, anxious: `Something's wrong. It's not a contraction. It's not stopping.`, dizzy: `I feel faint.`, none: `(She doesn't answer.)` } },
    bio: `Pharmacist at a children's hospital. Second baby. Her son Yusuf, now four, was born by cesarean in Michigan because he was breech; she has wanted this birth for four years. Her husband Omar is an accountant who brings food for everyone.`,
    dx: `Trial of labor after cesarean (TOLAC)`, reason: `Second baby at 38 weeks 4 days. One prior cesarean (2022, breech). Spontaneous labor since 04:00; 4 cm at 06:00. Counseled and consented for TOLAC in clinic.`,
    hx: [`One prior cesarean, 2022, for breech presentation (records from Michigan in the chart)`, `G2 P1`, `No other medical problems`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `70 kg`,
    lines: [`No IV yet`, `External fetal monitor and tocodynamometer (wireless)`],
    mobility: `Up walking with wireless monitoring`, diet: `Clear liquids`,
    init: { iv: false, ts: false, opnote: false, team: false, epiReq: false, epiAt: null, fentAt: null, varSeen: false, varCalled: null, mdNear: false, rupt: false, ruptAt: null, statAt: null, statBy: null, ivs: false, prep: false, citrate: false, orAt: null, gone: false, goneAt: null, fentAfter: false, waited: false, station: false, efmAt: null, efmN: 0, toldOmar: null },
    nightVitals: { T: 36.8, HR: 84, SBP: 122, DBP: 74, RR: 18, SpO2: 99, O2: 'Room air', pain: 5 },
    labs: [
      { name: 'Hemoglobin', val: 12.1, unit: 'g/dL', ref: '11.0 or more', flag: '', t: -1500 },
      { name: 'Platelets', val: 240, unit: 'K/µL', ref: '150 to 400', flag: '', t: -1500 },
      { name: 'Type and screen', val: 'Not sent this admission', unit: '', ref: '', flag: '', t: -60 },
      { name: 'GBS', val: 'Negative at 36 weeks', unit: '', ref: '', flag: '', t: -20000 },
    ],
    orders: [
      { t: -60, text: `Trial of labor after cesarean (one prior cesarean). Continuous EFM. On admission: IV access, 18 gauge, and type and screen. Anesthesia and OR team immediately available. No prostaglandins. Notify OB for a Category II or III tracing, new or unusual pain, or vaginal bleeding.` },
      { t: -60, text: `Fentanyl 50 to 100 mcg IV every hour as needed for labor pain. Epidural on request. Clear liquids. Up with wireless monitoring.` },
    ],
    notes: [
      { t: -40, author: 'Tasha, night RN', text: `Admitted 05:30 in early labor, 4/80/0. Category I tracing on wireless monitor, walking the halls. Wants to wait on IV until she decides about epidural. Outside records (Michigan) scanned to chart, not reviewed.` },
    ],
    io: { intake: `Clear liquids`, output: `Voided at 06:15` },
    report: [
      { text: `Fatima Haddad, 33, TOLAC. One prior cesarean, for breech. Spontaneous labor, 4 centimeters.`, key: true },
      { text: `She doesn't have an IV yet. She asked to wait until she decides about the epidural.`, key: true },
      { text: `Category I all night on the wireless monitor. She's walking.`, key: false },
      { text: `Her records came over from Michigan. I didn't get to look at them.`, key: true },
      { text: `Her husband Omar brought dates for the whole desk.`, key: false },
      { text: `She's a pharmacist. She'll ask about every drug.`, key: false },
    ],
    vitals(s, P) {
      const m = faM(s, P);
      return { T: 36.8, HR: P.rupt ? 118 + Math.min(22, m) : 84 + jit(s, 5) * 2, SBP: P.rupt ? 112 - Math.min(32, m * 2) : 122 + jit(s, 6) * 2, DBP: P.rupt ? 70 - Math.min(22, m) : 74, RR: P.rupt ? 26 : 18, SpO2: 99, O2: 'Room air', pain: P.rupt ? 9 : P.epiAt !== null && s.t >= P.epiAt ? 2 : s.t >= 90 ? 7 : 5, extra: P.gone ? '' : `FHR ${P.rupt ? 'about 70' : 'baseline 135'}.` };
    },
    assess: {
      general: (s, P) => (P.gone ? `She's in the OR.` : P.rupt ? `Curled on her side, gray, both hands pressed to her lower belly. "Something tore. It's not stopping."` : s.t >= 90 ? `Back in bed, swaying on hands and knees through contractions, Omar rubbing her back.` : `Walking the hall with Omar, stopping to lean on the rail through contractions.`),
      resp: (s, P) => `RR ${P.rupt ? 26 : 18}. Clear.`,
      cardiac: (s, P, A) => { const v = A.vitals('223'); return `HR ${v.HR}. BP ${v.SBP}/${v.DBP}.${P.rupt ? ' Cool, clammy hands, capillary refill 3 seconds.' : ' Warm.'}`; },
      neuro: (s, P) => (P.rupt ? `Anxious, restless, oriented. "Please, something's wrong."` : `Alert, calm, focused.`),
      pain: (s, P) => (P.rupt ? `Constant 9/10 pain low in the abdomen, sharp and tearing, different from contractions. It doesn't let up. Pain in her right shoulder too.` : P.epiAt !== null && s.t >= P.epiAt ? `Comfortable with the epidural. Feels pressure.` : `Contractions ${s.t >= 90 ? '7' : '5'}/10, comes and goes, coping with breathing.`),
      skin: (s, P) => (P.rupt ? `Pale, sweaty. A small amount of bright red bleeding on the pad.` : `Warm, dry. Low transverse scar, well healed, nontender.`),
      gi: (s, P) => { P.k.gi = s.t; return P.rupt ? `Abdomen tender everywhere, guarding. You can't feel contractions anymore. The baby's parts feel strangely easy to feel under the skin.` : `Uterus contracting every ${s.t >= 115 ? 2 : 3} minutes, soft between. Scar area nontender. Voided at 06:15.`; },
    },
    interventions: [
      { id: 'efm', label: 'Review the fetal monitor tracing (last 30 minutes)', cost: 2, avail: (s, P) => !P.gone,
        run(s, P, A) {
          P.efmAt = s.t; P.efmN += 1;
          if (P.rupt) A.judge('223-efm-rupt', 'assess', 1, `You checked Ms. Haddad's tracing after the pain changed.`, `A sudden prolonged deceleration or bradycardia is the most common sign of uterine rupture. A contraction line that goes flat in labor isn't the toco slipping until you've proved it.`, '223');
          else if (s.t >= 115) { if (!P.varSeen) { P.varSeen = true; A.judge('223-efm-var', 'assess', 2, `You checked Ms. Haddad's tracing and found recurrent variable decelerations.`, `In a TOLAC, a new or worsening FHR pattern is often the first sign of a uterine scar starting to give. It's a reason to bring the obstetrician to the bedside.`, '223'); } }
          else if (P.efmN === 1) A.judge('223-efm-1', 'assess', 1, `You checked Ms. Haddad's tracing.`, `TOLAC requires continuous EFM: the tracing is the earliest warning of rupture.`, '223');
          return faStrip(s, P);
        } },
      { id: 'ivts', label: 'Start an 18-gauge IV and send a type and screen (TOLAC orders)', cost: 4, avail: (s, P) => !P.iv && !P.gone,
        run(s, P, A) { P.iv = true; P.ts = true; A.addLab('223', { name: 'Type and screen', val: 'A positive, antibody screen negative', unit: '', ref: '', flag: '' });
          A.judge('223-iv', 'safety', P.rupt ? 1 : 2, P.rupt ? `You started Ms. Haddad's IV after the rupture.` : `You noticed Ms. Haddad had no IV and placed one with a type and screen.`, `TOLAC is safe because the team can move in minutes: a working IV and blood typed in the bank are part of being ready. It's ordered on admission for a reason.`, '223');
          return `18g in the left forearm, saline locked so she can keep walking. Type and screen sent: A positive, antibody screen negative.`; } },
      { id: 'opnote', label: 'Read her prior operative report (Michigan records)', cost: 2, avail: (s, P) => !P.opnote && !P.gone,
        run(s, P, A) { P.opnote = true; A.judge('223-opnote', 'assess', 1, `You read Ms. Haddad's prior operative report.`, `The uterine incision decides whether labor is safe. A low transverse incision carries a rupture risk under 1%; a classical (vertical) incision is a contraindication to TOLAC. The skin scar doesn't tell you which.`, '223'); return `Cesarean 2022, Michigan, for breech at 39 weeks. "Low transverse uterine incision, two-layer closure, no extensions." No other uterine surgery.`; } },
      { id: 'team', label: 'Confirm TOLAC readiness: Dr. Adeyemi in house, anesthesia and the OR know she\'s in active labor', cost: 2, avail: (s, P) => !P.team && !P.rupt && !P.gone,
        run(s, P, A) { P.team = true; A.judge('223-team', 'safety', 1, `You made sure the team knew a TOLAC was in active labor.`, `ACOG: TOLAC should be in a facility where emergency cesarean is immediately available. Readiness is people who know, not just a policy.`, '223'); return `Dr. Adeyemi: in house all day. Dr. Kwan: "Got it, tell me if she wants the epidural." OR 2 is open and the board says TOLAC in 223.`; } },
      { id: 'epidural', label: 'Ask anesthesia to place the epidural she wants', cost: 1, avail: (s, P) => P.epiReq && P.epiAt === null && !P.rupt && !P.gone,
        run(s, P, A) { P.epiAt = s.t + 15; A.judge('223-epidural', 'comm', 1, `You arranged the epidural Ms. Haddad asked for.`, `An epidural is fine in a TOLAC and makes an emergency cesarean easier. It doesn't hide a rupture: pain that breaks through a working epidural is a warning sign.`, '223'); return `Dr. Kwan will place it in about 15 minutes.${P.iv ? '' : ' "She needs an IV first."'}`; } },
      { id: 'station', label: 'Abdominal and vaginal exam: contractions, station, bleeding', cost: 3, avail: (s, P) => !P.gone,
        run(s, P, A) { if (!P.rupt) return `${s.t >= 90 ? 6 : 4} cm, 90% effaced, 0 station. Head well applied. No bleeding. Scar nontender.`;
          P.station = true; A.judge('223-station', 'assess', 2, `You noticed Ms. Haddad's baby had lost station.`, `A presenting part that was at 0 and is now high and floating means the baby is leaving the uterus through the tear. Loss of station is a classic sign of rupture.`, '223');
          return `The head, at 0 station an hour ago, is now at -3 and floats away from your fingers. Bright red bleeding on your glove. Her abdomen is rigid and tender; no contractions to feel.`; } },
      { id: 'stat', label: 'Call a STAT obstetric emergency: suspected uterine rupture. Dr. Adeyemi, anesthesia, the OR team, the neonatal team', cost: 1, avail: (s, P) => P.rupt && P.statAt === null && !P.gone,
        run(s, P, A) { P.statAt = s.t; P.statBy = 'you'; const d = s.t - P.ruptAt;
          A.judge('223-stat', 'safety', d <= 5 ? 3 : d <= 10 ? 2 : 1, `You called a STAT cesarean for suspected uterine rupture ${d} minutes after it started.`, `Sudden constant pain, contractions stopping, loss of station, bleeding and fetal bradycardia in a TOLAC: rupture until proven otherwise. The baby has minutes; the call comes before anything else.`, '223');
          A.addOrder('223', `STAT cesarean for suspected uterine rupture. To OR 2 now. Two large-bore IVs, type and crossmatch 4 units, massive transfusion protocol on standby. Sodium citrate 30 mL PO. Neonatal team to the OR.`);
          return `Overhead: "Obstetric emergency, room 223." Dr. Adeyemi is running down the hall from 226. Anesthesia and the OR are opening OR 2. NICU is on the way.`; } },
      { id: 'ivs', label: 'Second large-bore IV, type and crossmatch 4 units, CBC; blood to the OR', cost: 3, avail: (s, P) => P.rupt && !P.ivs && !P.gone,
        run(s, P, A) { P.ivs = true; A.judge('223-ivs', 'safety', P.statAt !== null ? 2 : 1, `You placed a second large-bore IV and sent crossmatch for Ms. Haddad.`, `Rupture bleeds into the abdomen, where you can't see it. Two large lines and blood moving before she's on the table.`, '223'); return `16g in the right antecubital. Crossmatch for 4 units sent${P.ts ? '; the type and screen from this morning saves 30 minutes' : ', starting from nothing: no type and screen this morning'}.`; } },
      { id: 'prep', label: 'Get her moving: Foley, monitors on transport, bed unlocked, Omar told where to wait', cost: 3, avail: (s, P) => P.statAt !== null && !P.prep && !P.gone,
        run(s, P, A) { P.prep = true; A.judge('223-prep', 'safety', 1, `You prepared Ms. Haddad for the OR.`, `In a STAT cesarean, the nurse runs the room: lines, catheter, transport, and the family told where to go.`, '223'); return `Foley in, monitors on the transport box, the bed rolling. Omar is walked to the family waiting room by Renee.`; } },
      { id: 'resus', label: 'Turn her, give a fluid bolus, and wait for the tracing to recover', cost: 3, avail: (s, P) => P.rupt && P.statAt === null && !P.waited && !P.gone,
        run(s, P, A) { P.waited = true; A.judge('223-wait', 'judgment', -2, `You treated Ms. Haddad's bradycardia as something that might recover.`, `Intrauterine resuscitation helps when the cause is reversible. A torn uterus isn't. With her signs, every minute waiting is a minute the baby isn't getting oxygen.`, '223'); return `She's on her side, the bolus running. The FHR stays at 70. Her pain doesn't change.`; } },
    ],
    meds: [
      { id: '223-fent', name: 'Fentanyl', dose: '50 to 100 mcg', route: 'IV', freq: 'Every hour as needed, labor pain', prn: true, available: (s, P) => !P.gone,
        block: (s, P) => (!P.iv ? 'No IV access.' : null),
        checks: (s, P) => [{ label: 'Pain', value: P.rupt ? 'Constant, tearing, 9/10' : 'Contractions, comes and goes', ok: !P.rupt }, { label: 'FHR', value: P.rupt ? 'About 70' : 'Baseline 135', ok: !P.rupt }],
        give(s, P, A) { P.fentAt = s.t; if (P.rupt) { P.fentAfter = true; A.judge('223-fent-rupt', 'judgment', -3, `You gave Ms. Haddad fentanyl for the new constant pain.`, `Pain that is constant, different from contractions, with a flat contraction line and a falling FHR, isn't labor pain in a TOLAC: it's rupture. Treating it as breakthrough pain loses minutes the baby doesn't have.`, '223'); return `Fentanyl 100 mcg IV. Her pain doesn't change. The FHR doesn't either.`; }
          A.judge('223-fent', 'meds', 1, `You gave Ms. Haddad fentanyl for labor pain on request.`, `Pain relief in a TOLAC is the same as any labor. Watch for pain that changes character.`, '223'); return `Fentanyl 50 mcg IV. Contractions take the edge off in a few minutes.`; } },
      { id: '223-citrate', name: 'Sodium citrate', dose: '30 mL', route: 'PO', freq: 'Once, before cesarean', prn: true, available: (s, P) => P.statAt !== null && !P.gone,
        block: (s, P) => (P.citrate ? 'Given.' : null),
        checks: () => [{ label: 'Indication', value: 'Aspiration prophylaxis before general anesthesia', ok: true }],
        give(s, P, A) { P.citrate = true; A.judge('223-citrate', 'meds', 1, `You gave sodium citrate before Ms. Haddad's emergency cesarean.`, `A nonparticulate antacid neutralizes stomach acid in case she needs general anesthesia.`, '223'); return `Sodium citrate 30 mL, swallowed in one go.`; } },
    ],
    talk: (s, P) => (P.gone ? null : P.rupt ? 'fa_rupt' : s.t >= 80 && !P.epiReq ? 'fa_epi' : P.k.talked ? 'fa_after' : 'fa_talk'),
    family: { name: 'Omar', rel: 'Husband', mode: 'bedside', cost: 3, avail: (s, P) => !P.gone, dialog: (s, P) => (P.rupt ? 'om_rupt' : P.k.om ? 'om_after' : 'om_talk') },
    sbar: {
      items(s, P, A) {
        const v = A.vitals('223');
        return [
          { id: 'tolac', label: 'TOLAC, one prior cesarean', key: true, need: true },
          { id: 'var', label: P.rupt ? `FHR about 70 since ${clock(P.ruptAt)}` : 'Recurrent variable decelerations, deepening', key: P.rupt || s.t >= 115, need: P.efmAt !== null && s.t >= 115, lock: 'Review the tracing' },
          { id: 'pain', label: 'Sudden constant pain, different from contractions; contractions stopped on the toco', key: P.rupt, need: P.rupt },
          { id: 'station', label: 'Lost station: head from 0 to -3, vaginal bleeding', key: P.rupt, need: P.station, lock: 'Examine her' },
          { id: 'vs', label: `HR ${v.HR}, BP ${v.SBP}/${v.DBP}`, key: P.rupt, need: true },
          { id: 'inc', label: P.opnote ? 'Prior incision: low transverse' : 'Prior incision type not yet confirmed', key: false, need: true },
          { id: 'rx', label: 'She\'s a pharmacist', key: false, need: true },
        ];
      },
      requests: [
        { id: 'var', label: 'She\'s a TOLAC with new recurrent variable decelerations that are getting deeper. Can you come evaluate her now?' },
        { id: 'rupt', label: 'I think she\'s rupturing: constant pain, contractions stopped, lost station, bleeding and an FHR of 70. I need you for a STAT cesarean now.' },
        { id: 'pain', label: 'She\'s having a lot more pain. Can she have more fentanyl or an epidural?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'pain') { if (P.rupt) { A.judge('223-sbar-pain', 'judgment', -2, `You called about Ms. Haddad's rupture as a pain problem.`, `The provider hears what you lead with. Lead with the findings.`, '223'); return picked.includes('var') || picked.includes('pain') ? `Pain and an FHR of 70 in a TOLAC? That's a rupture until proven otherwise. Call the STAT, I'm coming.` : `Sure, epidural's fine. What's the strip doing?`; } return `Epidural's fine in a TOLAC. Call Kwan.`; }
        if (req === 'rupt') {
          if (!P.rupt) { A.judge('223-sbar-early', 'comm', 0, `You called a rupture without the signs of one.`, `Know the signs, but the call needs findings.`, '223'); return `Her strip's fine and she's coping. What are you seeing?`; }
          if (P.statAt === null) { P.statAt = s.t; P.statBy = 'call'; A.addOrder('223', `STAT cesarean for suspected uterine rupture. To OR 2 now. Two large-bore IVs, type and crossmatch 4 units, massive transfusion protocol on standby. Sodium citrate 30 mL PO. Neonatal team to the OR.`); }
          const d = P.statAt - P.ruptAt;
          A.judge('223-sbar-rupt', 'comm', d <= 5 ? 2 : 1, `You called Dr. Adeyemi with the signs of uterine rupture.`, `Name it, give the findings, ask for what you need: a STAT cesarean. Closed-loop: she repeats it back and moves.`, '223');
          return `I'm coming. Call it overhead, OR 2, get her moving.`;
        }
        if (req === 'var') {
          if (P.rupt) return `Variables? She's bradycardic. Is she rupturing?`;
          if (s.t < 115) return `Her strip's been Category I. Call me if it changes.`;
          P.varCalled = s.t; P.mdNear = true;
          A.judge('223-sbar-var', 'comm', picked.includes('tolac') ? 2 : 1, `You called Dr. Adeyemi about new variable decelerations in a TOLAC.`, `New, deepening decelerations can be the first sign of rupture. Bringing the obstetrician to the bedside early cuts minutes off an emergency.`, '223');
          return `Thanks for calling. I'll come examine her after this delivery, ten minutes. Keep her on her side, make sure she has an IV and blood typed.`;
        }
        A.judge('223-sbar-fyi', 'comm', 0, `You called with an update on Ms. Haddad.`, `Lead with what changed.`, '223');
        return `Okay. She's a TOLAC; call me with any change in the strip or her pain.`;
      },
    },
    scene: (s, P) => ({ tele: true, iv: P.iv ? (P.rupt ? 'running' : 'lock') : null, foley: P.prep, family: P.gone ? null : 'omar', familyLabel: 'Omar, her husband, with a tin of dates', empty: P.gone, emptyText: 'Bed gone, monitor cables hanging. STAT cesarean for uterine rupture in OR 2.' }),
    clues: (s, P) => ({ monitor: P.rupt ? `Fetal monitor: heart rate 70, steady and flat. The contraction line is a flat line. The alarm is sounding.` : `Fetal monitor: heart rate 135${s.t >= 115 ? ', dropping sharply with contractions and bouncing back' : ''}.`, iv: P.iv ? `18g saline lock, left forearm.` : `No IV. Her arms are bare.`, family: `Omar, with a tin of dates and a phone open to a VBAC article. A drawing from Yusuf taped to the bed: "big brother."` }),
    rig: (s, P) => ({ anxious: P.rupt ? .9 : 0, sweat: P.rupt ? .5 : 0, pain: P.rupt ? 9 : 5 }),
    status: (s, P) => (P.gone ? 'gone' : P.rupt ? 'urgent' : s.t >= 115 || !P.iv ? 'watch' : 'stable'),
    outcome(s, P) {
      if (!P.rupt) return { tone: 'good', title: 'Laboring safely', text: 'Still in labor at noon.' };
      const d = P.statAt !== null ? P.statAt - P.ruptAt : 99;
      const misses = [!P.iv && !P.ivs && 'no IV access', P.fentAfter && 'opioids for the rupture pain', P.waited && 'waiting for the strip to recover', !P.ts && 'no type and screen until the emergency'].filter(Boolean);
      // Same three tiers, and the same numbers, as her OR course in flow.js.
      const gaps = misses.length ? ' Gaps: ' + misses.join('; ') + '.' : '';
      if (P.statBy === 'nova' || d > 10) return { tone: 'bad', title: 'Uterine rupture, recognized late', text: `Her uterus ruptured at ${clock(P.ruptAt)}; the STAT call came ${d} minutes later${P.statBy === 'nova' ? ', from Nova' : ''}. Yusuf's sister was born with a cord pH of 6.91 and went to the NICU for cooling. Fatima lost her uterus and needed six units of blood${!P.ts ? ', with no type and screen on file' : ''}.${gaps}` };
      if (d <= 5) return { tone: misses.length ? 'mixed' : 'good', title: misses.length ? 'Uterine rupture, caught fast, with gaps' : 'Uterine rupture, caught in minutes', text: `Rupture at ${clock(P.ruptAt)}, STAT call ${d === 0 ? 'the same minute' : d + ' minutes later'}, baby out 11 minutes after the rupture with APGARs of 4 and 8. The tear along the old scar was repaired; she kept her uterus and needed two units of blood.${gaps}` };
      return { tone: 'mixed', title: 'Uterine rupture, a slower start', text: `STAT call ${d} minutes after the rupture. Baby born with APGARs of 2 and 6 and admitted to the NICU for observation. The uterus was repaired; she needed three units of blood.${gaps}` };
    },
  };

  /* ---------- 224 Claire Donnelly: GBS positive, prolonged rupture, then intraamniotic infection ---------- */
  const clApap = (s, P) => (P.apapAt !== null && s.t >= P.apapAt + 20 ? Math.min(1, (s.t - P.apapAt - 20) / 40) : 0);
  const clT = (s, P) => +(37.2 + P.inf * 1.9 - .7 * clApap(s, P)).toFixed(1);
  const clFHR = (s, P) => Math.round(Math.min(180, 140 + P.inf * 42 - 8 * clApap(s, P)) / 5) * 5;
  const clFever = (s, P) => clT(s, P) >= 38;
  /* The temperature on paper: the last one somebody took (within the hour), else the one Renee reported. Screens quote
     this, so the message, the task, the MAR check and the SBAR all show the same number until someone retakes it. */
  const chT = (s, P) => { const v = P.vit.filter((x) => x.T !== undefined && s.t - x.t <= 60).pop(); return v ? +v.T : P.feverT !== undefined ? P.feverT : clT(s, P); };
  function clStrip(s, P) {
    const b = clFHR(s, P), varb = P.inf >= .6 ? 'minimal' : 'moderate';
    return stripLine({ base: b, varb, accel: P.inf < .5, decel: 'No decelerations.', n: s.t < 120 ? 3 : 4, tone: 'each 50 to 70 seconds' });
  }
  const claire = {
    id: '224', room: '224', name: 'Claire Donnelly', short: 'Ms. Donnelly', age: 31, sex: 'F', mrn: '00740317', provider: 'adeyemi',
    look: { skin: '#F2D6BE', shade: '#D8B49A', lip: '#B87068', blush: '#EEA090', iris: '#5A7A9A', head: { w: 55, h: 61, jaw: .3 }, eye: 9.8, hair: { style: 'long', color: '#B07A40' }, brow: { w: 3.2, color: '#8A5A30' }, body: { w: 84, cloth: 'gown' }, extras: ['freckles'], smile: .4,
      lines: { calm: `We've been practicing the breathing for months. I can do this.`, anxious: `I feel hot and shaky. Is the baby's heart rate supposed to be that fast?`, pain: `That one hurt. It's sore even between them.`, drowsy: `I'm so tired.`, none: `(She doesn't answer.)` } },
    bio: `Landscape architect. First baby. She and her wife Jess spent the spring writing a birth plan: unmedicated, lights low, moving freely, no IV if she can help it. Jess teaches kindergarten and has a playlist of whale sounds.`,
    dx: `Prolonged rupture of membranes, GBS positive`, reason: `First baby at 39 weeks 5 days. Membranes ruptured at home at 11:30 yesterday morning; she waited for labor to start (19 hours at 06:30). GBS positive at 36 weeks. Arrived at 06:30 in early labor, 3 cm. Wants an unmedicated birth.`,
    hx: [`GBS positive rectovaginal culture at 36 weeks`, `G1 P0`, `No other medical problems`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `72 kg`,
    lines: [`PIV 20g right hand, placed 06:45, saline locked`, `External fetal monitor and tocodynamometer`],
    mobility: `Up as desired with wireless monitoring`, diet: `Clear liquids`,
    init: { inf: .2, pcnAt: null, feverAt: null, gbsChecked: false, tender: false, called: null, ampOrdered: false, ampAt: null, gentAt: null, apapAt: null, peds: false, gone: false, goneAt: null, coveredAsked: false, wash: false, reassessed: false, saline: false, efmAt: null, efmN: 0, feverStripSeen: false },
    nightVitals: { T: 37.6, HR: 90, SBP: 118, DBP: 72, RR: 18, SpO2: 99, O2: 'Room air', pain: 4 },
    labs: [
      { name: 'GBS culture (36 weeks)', val: 'Positive', unit: '', ref: '', flag: 'A', t: -25000 },
      { name: 'WBC', val: 13.8, unit: 'K/µL', ref: 'up to 15 is common in labor', flag: '', t: -20 },
      { name: 'Hemoglobin', val: 12.6, unit: 'g/dL', ref: '11.0 or more', flag: '', t: -20 },
      { name: 'Blood type', val: 'B positive, antibody screen negative', unit: '', ref: '', flag: '', t: -20 },
    ],
    orders: [
      { t: -25, text: `Penicillin G 5 million units IV now, then 2.5 to 3 million units IV every 4 hours until birth (GBS positive). First dose due 07:00.` },
      { t: -25, text: `Continuous EFM. Temperature every 2 hours with ruptured membranes, every hour if 37.8 or higher. Notify for temperature 38.0 or higher, maternal HR over 110, FHR baseline over 160, or cloudy or foul-smelling fluid. Acetaminophen 1 g PO every 6 hours as needed for temperature 38.0 or higher or pain.` },
      { t: -25, text: `Saline lock and wireless monitoring acceptable per patient preference. Clear liquids. Up as desired.` },
    ],
    notes: [
      { t: -20, author: 'Tasha, night RN', text: `Arrived 06:30, SROM at home 11:30 yesterday, clear fluid then. 3/80/-1. GBS+, no PCN allergy. 20g placed and locked. Pharmacy sending PCN. Birth plan on file: unmedicated, intermittent monitoring preferred (explained continuous EFM needed for now). T 37.6.` },
    ],
    io: { intake: `Clear liquids, a smoothie Jess brought`, output: `Voided at 06:40` },
    report: [
      { text: `Claire Donnelly, 31, first baby, 39 and 5. Water broke at home yesterday at eleven-thirty in the morning. She waited for contractions, so it's been about nineteen hours.`, key: true },
      { text: `She's GBS positive. The penicillin's due; pharmacy just sent it up.`, key: true },
      { text: `Temp was 37.6 when she got here.`, key: true },
      { text: `She has a birth plan: no epidural, no IV if she can help it, lights low.`, key: false },
      { text: `Her wife Jess is a kindergarten teacher. Very calm.`, key: false },
      { text: `She's 3 centimeters, contracting every four to five minutes.`, key: false },
    ],
    vitals(s, P) {
      const a = clApap(s, P);
      return { T: P.gone ? 38.9 : clT(s, P), HR: Math.round(84 + P.inf * 38 - 6 * a) + jit(s, 7) * 2, SBP: Math.round(118 - (P.inf > 1.2 ? (P.inf - 1.2) * 60 : 0)) + jit(s, 8), DBP: Math.round(72 - (P.inf > 1.2 ? (P.inf - 1.2) * 30 : 0)), RR: P.inf > 1 ? 22 : 18, SpO2: 99, O2: 'Room air', pain: P.inf >= .6 ? 6 : 4, extra: P.gone ? '' : `FHR baseline ${clFHR(s, P)}. Temp ${clT(s, P).toFixed(1)} °C (${fF(clT(s, P))} °F).` };
    },
    assess: {
      general: (s, P) => (P.gone ? `She's in the OR.` : P.inf >= 1 ? `Flushed, shivering, eyes glassy. "I feel awful."` : P.inf >= .6 ? `Flushed and restless between contractions, kicking off the blanket.` : `On the birth ball, eyes closed, Jess's hands on her lower back.`),
      resp: (s, P) => `RR ${P.inf > 1 ? 22 : 18}. Clear.`,
      cardiac: (s, P, A) => { const v = A.vitals('224'); return `HR ${v.HR}${v.HR > 110 ? ', tachycardic' : ''}. BP ${v.SBP}/${v.DBP}. Warm.`; },
      neuro: () => `Alert, oriented, focused inward through contractions.`,
      pain: (s, P) => (P.inf >= .6 ? `Contractions 6/10, and sore across her lower belly even between them.` : `Contractions 4/10, coping well with breathing and movement.`),
      skin: (s, P) => (P.inf >= .6 ? `Hot, flushed, damp. IV site clean.` : `Warm, dry. IV site clean.`),
      gi: (s, P) => { P.k.gi = s.t; if (P.inf >= .6) P.tender = true; return P.inf >= .6 ? `Uterus tender to touch over the fundus, even between contractions. Fluid on the pad cloudy, yellow-tinged, with a foul smell.` : `Uterus soft and nontender between contractions. Fluid clear, a small steady leak.`; },
    },
    interventions: [
      { id: 'efm', label: 'Review the fetal monitor tracing (last 30 minutes)', cost: 2, avail: (s, P) => !P.gone,
        run(s, P, A) {
          P.efmAt = s.t; P.efmN += 1;
          if (P.inf >= .6 && !P.feverStripSeen) { P.feverStripSeen = true; A.judge('224-efm', 'assess', 2, `You checked Ms. Donnelly's tracing and noticed a baseline of ${clFHR(s, P)}.`, `A baseline over 160 for 10 minutes is fetal tachycardia. With a maternal fever after a long rupture, the baby's heart rate is often the first to climb in intraamniotic infection.`, '224'); }
          else if (P.efmN === 1) A.judge('224-efm-1', 'assess', 1, `You checked Ms. Donnelly's tracing.`, `Read the baseline as a number and watch its trend. A slow climb is a finding.`, '224');
          return clStrip(s, P);
        } },
      { id: 'gbs', label: 'Check her GBS result, allergies, and when her membranes ruptured', cost: 1, avail: (s, P) => !P.gbsChecked && !P.gone,
        run(s, P, A) { P.gbsChecked = true; A.judge('224-gbs', 'assess', 1, `You checked Ms. Donnelly's GBS status, allergies and rupture time.`, `GBS positive, no penicillin allergy, membranes ruptured over 18 hours: all three point to giving penicillin now. Adequate prophylaxis needs at least 4 hours before birth.`, '224'); return `GBS positive at 36 weeks. No drug allergies, no penicillin reaction ever. Ruptured at 11:30 yesterday: ${Math.round(19.5 + s.t / 60)} hours ago.`; } },
      { id: 'tender', label: 'Feel her uterus between contractions; look at the fluid', cost: 2, avail: (s, P) => !P.gone,
        run(s, P, A) { if (P.inf >= .6) { P.tender = true; A.judge('224-tender', 'assess', 2, `You noticed Ms. Donnelly's uterine tenderness and cloudy fluid.`, `Fever plus fundal tenderness, foul or cloudy fluid, maternal or fetal tachycardia: the picture of intraamniotic infection.`, '224'); return `Tender over the fundus even between contractions; she pulls away from your hand. The fluid on the pad is cloudy and yellow, and it smells foul.`; } return `Soft and nontender between contractions. Fluid clear, no odor.`; } },
      { id: 'peds', label: 'Notify the pediatric team: suspected intraamniotic infection, GBS positive, rupture over 18 hours. They\'ll need to be at the birth', cost: 1, avail: (s, P) => !P.peds && P.feverAt !== null && !P.gone,
        run(s, P, A) { P.peds = true; A.judge('224-peds', 'comm', 1, `You told the pediatric team about Ms. Donnelly's infection.`, `A baby born to a mother with intraamniotic infection needs a sepsis evaluation. The pediatric team should be at the birth and know the timing of antibiotics.`, '224'); return `Dr. Osei, pediatrics: "Thanks. Page us when she's complete; we'll be at the delivery. Tell me when the antibiotics went in."`; } },
      { id: 'saline', label: 'Keep her moving: wireless monitor, IV saline-locked between doses, birth ball and shower', cost: 2, avail: (s, P) => !P.saline && !P.gone,
        run(s, P, A) { P.saline = true; A.judge('224-saline', 'comm', 1, `You adapted the plan so Ms. Donnelly could keep moving.`, `Honoring a birth plan isn't all or nothing. Continuous monitoring and IV antibiotics can still be wireless and saline-locked, so she keeps the parts of the plan that matter to her.`, '224'); return `Wireless monitor on, IV locked between doses. She's on the birth ball by the window. "Okay. That I can do."`; } },
      { id: 'cool', label: 'Cool washcloth, a fan, a lighter blanket', cost: 1, avail: (s, P) => !P.gone,
        run(s, P) { P.k.cool = s.t; return `Cool cloth on her neck, the fan on low. "That feels good." It doesn't change her temperature much.`; } },
      { id: 'reassess', label: 'Recheck her temperature, heart rate and the tracing after treatment', cost: 3, avail: (s, P) => P.ampAt !== null && !P.reassessed && s.t >= P.ampAt + 45 && !P.gone,
        run(s, P, A) { P.reassessed = true; const ok = clT(s, P) < 38.3 && clFHR(s, P) <= 165; A.judge('224-reassess', 'judgment', 2, `You reassessed Ms. Donnelly after antibiotics and acetaminophen.`, `Did it work? Temperature coming down, maternal heart rate under 110, FHR baseline drifting back toward normal. ${ok ? 'It is turning.' : 'Not yet; tell the provider what you see.'}`, '224'); return `T ${clT(s, P).toFixed(1)} °C (${fF(clT(s, P))} °F), HR ${A.vitals('224').HR}. ${clStrip(s, P)}`; } },
    ],
    meds: [
      { id: '224-pcn', name: 'Penicillin G (GBS prophylaxis)', dose: '5 million units, then 2.5 to 3 million every 4 hours', route: 'IV', freq: 'Now, then every 4 hours until birth', due: 0, available: (s, P) => !P.gone,
        checks: () => [{ label: 'GBS', value: 'Positive at 36 weeks', ok: true }, { label: 'Allergies', value: 'None', ok: true }, { label: 'Membranes', value: 'Ruptured at 11:30 yesterday', ok: null }],
        give(s, P, A) { P.pcnAt = s.t;
          if (P.feverAt !== null) A.judge('224-pcn', 'meds', 0, `You gave Ms. Donnelly's penicillin after the fever started.`, `Late, and it isn't treatment for intraamniotic infection: penicillin covers GBS, not the mix of organisms in an infected uterus. She needs broad-spectrum antibiotics.`, '224');
          else A.judge('224-pcn', 'meds', s.t <= 30 ? 2 : s.t <= 60 ? 1 : 0, s.t <= 30 ? `You gave Ms. Donnelly's GBS prophylaxis on time.` : `You gave Ms. Donnelly's GBS prophylaxis late.`, `Prophylaxis is adequate only if it starts at least 4 hours before birth. In a first labor that seems slow, that window still closes faster than you think.`, '224');
          return `Penicillin G 5 million units IV over 30 minutes.`; },
        hold(s, P, A) { A.judge('224-pcn-hold', 'meds', -3, `You held Ms. Donnelly's GBS prophylaxis.`, `GBS positive in labor with rupture over 18 hours: penicillin protects the baby from early-onset GBS sepsis. Her birth plan preference about IVs is a conversation, not a reason to skip it.`, '224'); return 'Held.'; } },
      { id: '224-amp', name: 'Ampicillin', dose: '2 g', route: 'IV', freq: 'Every 6 hours', prn: true, available: (s, P) => P.ampOrdered && !P.gone,
        block: (s, P) => (P.ampAt !== null ? `Given at ${clock(P.ampAt)}.` : null),
        checks: (s, P) => [{ label: 'Temperature', value: `${chT(s, P).toFixed(1)} °C (${fF(chT(s, P))} °F)`, ok: chT(s, P) >= 38 }, { label: 'Allergies', value: 'None', ok: true }],
        give(s, P, A) { P.ampAt = s.t; const d = P.feverAt !== null ? s.t - P.feverAt : 0; A.judge('224-amp', 'meds', d <= 45 ? 2 : 1, `You started ampicillin for Ms. Donnelly's intraamniotic infection${d <= 45 ? ' promptly' : ', after a delay'}.`, `ACOG: treat intraamniotic infection with broad-spectrum antibiotics as soon as it's suspected. Ampicillin covers GBS and many gut organisms; gentamicin covers the gram-negatives.`, '224'); return `Ampicillin 2 g IV over 15 minutes.`; } },
      { id: '224-gent', name: 'Gentamicin', dose: '5 mg/kg (360 mg)', route: 'IV', freq: 'Every 24 hours', prn: true, available: (s, P) => P.ampOrdered && !P.gone,
        block: (s, P) => (P.gentAt !== null ? `Given at ${clock(P.gentAt)}.` : null),
        checks: () => [{ label: 'Weight', value: '72 kg', ok: true }, { label: 'Creatinine', value: '0.6', ok: true }],
        give(s, P, A) { P.gentAt = s.t; A.judge('224-gent', 'meds', 1, `You gave gentamicin with the ampicillin.`, `Weight-based, once daily. The combination is the standard first-line regimen for intraamniotic infection.`, '224'); return `Gentamicin 360 mg IV over 30 minutes.`; } },
      { id: '224-apap', name: 'Acetaminophen', dose: '1 g', route: 'PO', freq: 'Every 6 hours as needed, temperature 38.0 or higher or pain', prn: true, available: (s, P) => !P.gone,
        checks: (s, P) => [{ label: 'Temperature', value: `${chT(s, P).toFixed(1)} °C (${fF(chT(s, P))} °F)`, ok: chT(s, P) >= 38 }],
        give(s, P, A) { P.apapAt = s.t;
          if (P.feverAt !== null && P.called === null) A.judge('224-apap', 'judgment', -1, `You treated Ms. Donnelly's fever before telling the provider.`, `Acetaminophen is right for a laboring fever, but it treats the number, not the infection. The call and the antibiotics come first.`, '224');
          else if (P.feverAt !== null) A.judge('224-apap', 'meds', 1, `You gave acetaminophen for Ms. Donnelly's fever.`, `Maternal fever raises the baby's oxygen demand and is linked to newborn encephalopathy. Treat it along with the infection.`, '224');
          return `Acetaminophen 1 g PO with a sip of water.`; } },
    ],
    talk: (s, P) => (P.gone ? null : P.feverAt !== null && !P.k.fev ? 'cl_fever' : P.pcnAt === null && !P.k.talked ? 'cl_talk' : 'cl_after'),
    family: { name: 'Jess', rel: 'Wife', mode: 'bedside', cost: 3, avail: (s, P) => !P.gone, dialog: (s, P) => (P.feverAt !== null && !P.k.jessF ? 'jess_fever' : P.k.jess ? 'jess_after' : 'jess_talk') },
    sbar: {
      items(s, P, A) {
        const v = A.vitals('224');
        return [
          { id: 'temp', label: `Temp ${chT(s, P).toFixed(1)} °C (${fF(chT(s, P))} °F)`, key: chT(s, P) >= 38, need: true },
          { id: 'hr', label: `Maternal HR ${v.HR}`, key: v.HR > 110, need: true },
          { id: 'fhr', label: `FHR baseline ${clFHR(s, P)}, ${P.inf >= .6 ? 'minimal' : 'moderate'} variability`, key: clFHR(s, P) > 160, need: P.efmAt !== null, lock: 'Review the tracing' },
          { id: 'tender', label: 'Tender uterus between contractions, cloudy foul fluid', key: true, need: P.tender, lock: 'Feel her uterus' },
          { id: 'rom', label: `Ruptured ${Math.round(19.5 + s.t / 60)} hours, GBS positive`, key: true, need: true },
          { id: 'pcn', label: P.pcnAt !== null ? `Penicillin G given at ${clock(P.pcnAt)}` : 'Penicillin G not yet given', key: false, need: true },
          { id: 'plan', label: 'Wants an unmedicated birth', key: false, need: true },
        ];
      },
      requests: [
        { id: 'chorio', label: 'I\'m worried about intraamniotic infection: fever, maternal and fetal tachycardia, a tender uterus, cloudy fluid, long rupture. Can I start broad-spectrum antibiotics and acetaminophen, and let peds know?' },
        { id: 'covered', label: 'She has a temperature, but she\'s already getting penicillin for GBS. Is acetaminophen enough?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (!clFever(s, P) && P.feverAt === null) { if (req !== 'fyi') A.judge('224-sbar-early', 'comm', 0, `You called about infection before Ms. Donnelly had a fever.`, `Good instinct to watch her, but the signs aren't there yet. Keep the hourly temps and the strip coming.`, '224'); return `She's afebrile? Keep checking her temperature and call me at 38.`; }
        const cues = ['temp', 'hr', 'fhr', 'tender'].filter((k) => picked.includes(k)).length;
        if (req === 'covered') { P.coveredAsked = true; A.judge('224-sbar-covered', 'judgment', -2, `You suggested penicillin already covered Ms. Donnelly's fever.`, `GBS prophylaxis isn't treatment for intraamniotic infection. Fever with a long rupture is infection until proven otherwise, and needs broad-spectrum antibiotics.`, '224'); if (cues < 2) return `Penicillin is for GBS, it's not treatment. What's her heart rate, and the baby's? Is she tender? Call me back with that.`; }
        if (cues < 2) return `What else? Her heart rate, the baby's, her uterus?`;
        if (P.called === null) { P.called = s.t; P.ampOrdered = true; A.addOrder('224', `Intraamniotic infection: ampicillin 2 g IV every 6 hours plus gentamicin 5 mg/kg (360 mg) IV every 24 hours. Stop penicillin G. Acetaminophen 1 g PO now. Notify pediatrics for the birth. Continuous EFM.`); }
        if (req === 'chorio') A.judge('224-sbar', 'comm', cues >= 3 ? 2 : 1, `You called Dr. Adeyemi about intraamniotic infection in Ms. Donnelly.`, `Fever plus the supporting signs, and what you're asking for. ACOG: start antibiotics when it's suspected; don't wait for delivery or cultures.`, '224');
        return `Agreed, that's triple I. Ampicillin and gentamicin now, acetaminophen, peds to the delivery. Labor continues; this isn't a reason for a cesarean on its own.`;
      },
    },
    scene: (s, P) => ({ tele: true, iv: P.ampAt !== null && s.t - P.ampAt < 30 ? 'running' : 'lock', family: P.gone ? null : 'jess', familyLabel: 'Jess, her wife, with a playlist of whale sounds', flowers: true, empty: P.gone, emptyText: 'Bed empty, the birth ball in the corner. Cesarean for maternal sepsis and fetal tachycardia.' }),
    clues: (s, P) => ({ monitor: `Fetal monitor: heart rate ${clFHR(s, P)}${clFHR(s, P) > 160 ? ', and the line looks smooth' : ''}.`, iv: `20g saline lock, right hand.${P.ampAt !== null ? ' Ampicillin bag hanging.' : ''}`, family: `Jess with a laminated birth plan, a speaker playing whale sounds, and a cooler of frozen grapes.`, flowers: `Flowers from Claire's landscape team: "Grow, baby, grow."` }),
    rig: (s, P) => ({ temp: clT(s, P), anxious: P.inf >= .6 ? .4 : 0, sweat: P.inf >= .8 ? .4 : 0, pain: P.inf >= .6 ? 6 : 4 }),
    status: (s, P) => (P.gone ? 'gone' : P.inf >= 1 ? 'urgent' : clFever(s, P) || P.pcnAt === null ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.gone) return { tone: 'bad', title: 'Maternal sepsis, emergency cesarean', text: `A fever at ${clock(P.feverAt)} with a tender uterus and fetal tachycardia went untreated until her pressure fell at ${clock(P.goneAt)}. Cesarean for a worsening tracing; her daughter went to the NICU on antibiotics with a positive blood culture. ${P.coveredAsked ? 'Someone thought the penicillin covered it.' : ''}` };
      const misses = [P.pcnAt === null && 'GBS prophylaxis never given', P.pcnAt !== null && P.pcnAt > 60 && P.feverAt === null && 'GBS prophylaxis given late', P.feverAt !== null && P.ampAt === null && 'no broad-spectrum antibiotics for the infection', P.ampAt !== null && P.feverAt !== null && P.ampAt - P.feverAt > 45 && 'antibiotics more than 45 minutes after the fever', P.ampAt !== null && P.gentAt === null && 'gentamicin never given', P.feverAt !== null && !P.peds && 'the pediatric team never told', P.coveredAsked && 'the penicillin mistaken for treatment', P.wash && 'the fever brushed off as the room'].filter(Boolean);
      if (!misses.length && P.ampAt !== null) return { tone: 'good', title: 'Infection caught and treated', text: `Penicillin at ${clock(P.pcnAt)}; fever at ${clock(P.feverAt)}; ampicillin at ${clock(P.ampAt)}${P.gentAt !== null ? ' and gentamicin' : ''}. Temperature ${clT(s, P).toFixed(1)} °C (${fF(clT(s, P))} °F) and FHR ${clFHR(s, P)} at noon, 7 cm, still moving on the birth ball. Pediatrics will be at the birth.` };
      return { tone: 'mixed', title: 'Infection, with gaps', text: `${misses.length ? 'Gaps: ' + misses.join('; ') + '.' : ''} Temperature ${clT(s, P).toFixed(1)} °C (${fF(clT(s, P))} °F) at noon, FHR ${clFHR(s, P)}.` };
    },
  };

  /* ---------- dialogs ---------- */
  const dialogs = {
    al_talk: { who: '221', text: `Between contractions Daniela grabs your sleeve. "The resident said they want to go up on the Pitocin again because I'm not changing. But they're already on top of each other. Do I have to?"`, choices: [
      { label: `You're right to notice that. Your contractions are coming too close together for the baby to rest between them. I'm not going to turn it up; I'm going to give your body and the baby a break first, and the team will make the plan with that in mind.`, next: 'al_a', fx: (s, A) => { s.p['221'].k.talked = s.t; A.judge('221-talk', 'comm', 1, `You took Ms. Fuentes's report of her contractions seriously.`, `Patients often notice tachysystole before anyone counts it. Validate what she feels, explain the plan in plain words.`, '221'); } },
      { label: `The order says to go up every 30 minutes until your contractions are strong enough, so that's what we'll do. The doctors look at the whole picture, and the sooner your labor gets going the sooner you'll meet your baby. Try to trust the plan, and let me worry about the monitor.`, next: 'al_b', fx: (s, A) => { s.p['221'].k.talked = s.t; A.judge('221-talk', 'judgment', -1, `You told Ms. Fuentes the order meant the oxytocin would go up.`, `Titration orders sit under a safety protocol. What she's describing is the reason to stop, not to go up.`, '221'); } },
      { label: `Don't worry about the medicine. Focus on your breathing.`, next: 'al_c', fx: (s, A) => { s.p['221'].k.talked = s.t; A.judge('221-talk', 'comm', -1, `You brushed off Ms. Fuentes's question.`, `She asked a real question about her own care. She deserves a real answer.`, '221'); } },
    ] },
    al_a: { who: '221', text: `She exhales. "Okay. Okay. A break sounds amazing." Rafael turns the music down a notch.` },
    al_b: { who: '221', text: `She nods, then grips the rail as the next one starts before the last one is gone.` },
    al_c: { who: '221', text: `"Okay." She doesn't look okay.` },
    al_after: { who: '221', text: (s) => (alTachy(s.p['221']) ? `"They're still right on top of each other."` : `"I can actually breathe between them now." Rafael queues up the next song.`) },
    raf_talk: { who: 'rafael', pid: '221', text: `Rafael pulls you aside. "The doctor said they'd keep turning it up. You turned it off? Did something go wrong? Is Lucía okay?"`, choices: [
      { label: `Her heart rate was showing that the contractions were too close together, so I turned the medicine off to give the uterus a rest. That's what our safety rules say to do, and it usually works within minutes. I'm watching her monitor closely, and I'll tell you when we restart.`, next: 'raf_a', fx: (s, A) => { s.p['221'].k.raf = s.t; A.judge('221-raf', 'comm', 1, `You explained the change in plan to Rafael honestly.`, `Families notice when a plan changes. A plain explanation of why, and what you're watching for, turns fear into something they can help with.`, '221'); } },
      { label: `Everything's fine. Don't worry.`, next: 'raf_b', fx: (s, A) => { s.p['221'].k.raf = s.t; A.judge('221-raf', 'comm', -1, `You told Rafael everything was fine.`, `If it were fine, you wouldn't have changed the plan. False reassurance erodes trust when they find out.`, '221'); } },
      { label: `You'll have to ask the doctor.`, next: 'raf_c', fx: (s, A) => { s.p['221'].k.raf = s.t; A.judge('221-raf', 'comm', -1, `You deflected Rafael's question.`, `You made the change; explaining it is your job.`, '221'); } },
    ] },
    raf_a: { who: 'rafael', pid: '221', text: `He nods. "So less is more, sometimes." He changes the playlist to something slower.` },
    raf_b: { who: 'rafael', pid: '221', text: `"Then why'd you turn it off?" He goes back to staring at the monitor.` },
    raf_c: { who: 'rafael', pid: '221', text: `"The doctor isn't here. You are."` },
    raf_after: { who: 'rafael', pid: '221', text: `"She's named the contractions. That one was Gerald." He's grinning.` },

    br_talk: { who: '222', text: `"My legs feel like logs. Is that normal? And I can't tell if I need to pee."`, choices: [
      { label: `Heavy legs are normal with the epidural. It also numbs the feeling of a full bladder, so I'll check it and empty it with a catheter if it's full; a full bladder can slow the baby down. I'll help you turn every hour too.`, next: 'br_a', fx: (s, A) => { s.p['222'].k.talked = s.t; A.judge('222-talk', 'comm', 1, `You explained the epidural's effects to Ms. Scott.`, `What she can't feel, you check for her: bladder, skin, position.`, '222'); } },
      { label: `That's just the epidural. Get some rest.`, next: 'br_b', fx: (s, A) => { s.p['222'].k.talked = s.t; A.judge('222-talk', 'assess', -1, `You let Ms. Scott's bladder question go.`, `She just told you she can't tell if her bladder is full. With no void since 04:00, the answer is to check.`, '222'); } },
    ] },
    br_a: { who: '222', text: `"Do what you need to. Last time I peed on the doctor." She laughs.` },
    br_b: { who: '222', text: `"Okay." She goes back to her phone.` },
    br_sick: { who: '222', text: `"I don't feel good. Hot. Like I'm going to throw up. Why is it beeping?" Her hand is clammy in yours.` },
    br_after: { who: '222', text: `"Mason was a five-hour baby. Mom says this one'll be faster." She doesn't seem worried. You are, a little.` },
    br_push: { who: '222', text: `"I have to push! I can't stop it!" The head is crowning.`, choices: [
      { label: `You're doing it. Little breaths now: pant, pant, blow. Let your body ease her out slowly. I've got her.`, next: 'br_p1', fx: (s, A) => { A.judge('222-coach', 'safety', 1, `You coached Ms. Scott to pant as the head crowned.`, `Panting through the urge slows the delivery of the head and protects the perineum while you control it.`, '222'); } },
      { label: `Push as hard as you can!`, next: 'br_p2', fx: (s, A) => { A.judge('222-coach', 'safety', -1, `You told Ms. Scott to push hard as the head crowned.`, `A head that delivers explosively tears the perineum and can injure the baby. Slow is safe now.`, '222'); } },
      { label: `I know it's hard, but don't push! Squeeze your legs together and hold on until the doctor gets here; she's only a minute away.`, next: 'br_p3', fx: (s, A) => { s.p['222'].held = true; A.judge('222-legs', 'safety', -3, `You told Ms. Scott to hold the baby in.`, `Holding back a crowning baby can cause fetal hypoxia and injury. You can't stop a birth; you can make it controlled.`, '222'); } },
    ] },
    br_p1: { who: '222', text: `She pants, eyes locked on yours. Jordan pants too.` },
    br_p2: { who: '222', text: `She bears down hard. The head comes fast.` },
    br_p3: { who: '222', text: `She screams. "I can't!" The head keeps coming anyway.` },
    br_baby: { who: '222', text: (s) => `Brianna can't stop looking at her. "Hi. Hi, baby. You were in a hurry." ${s.p['222'].dried !== null ? 'The baby roots at her chest.' : 'The baby is wet and starting to shiver.'}` },
    jor_talk: { who: 'jordan', pid: '222', text: `Jordan wakes up and rubs his face. "Sorry. Double shift. Did I miss anything? Last time it went from fine to baby in like ten minutes."`, choices: [
      { label: `You didn't miss anything. You're right to remember that: second babies often come faster. If she says she feels pressure or like she needs to push, hit the call light right away, even if it seems early.`, next: 'jor_a', fx: (s, A) => { s.p['222'].k.jor = s.t; A.judge('222-jor', 'comm', 1, `You taught Jordan what to watch for.`, `Partners are a second pair of eyes. Tell them exactly what to call you for.`, '222'); } },
      { label: `Go back to sleep, we'll wake you.`, next: 'jor_b', fx: (s, A) => { s.p['222'].k.jor = s.t; } },
    ] },
    jor_a: { who: 'jordan', pid: '222', text: `"Pressure, call light. Got it." He sets an alarm on his phone for no reason and sits up straight.` },
    jor_b: { who: 'jordan', pid: '222', text: `He's asleep again before you reach the door.` },
    jor_scared: { who: 'jordan', pid: '222', text: `Jordan is on his feet. "Her lips are white. Is the baby okay? Why's it beeping?"`, choices: [
      { label: `The epidural dropped her blood pressure, and the baby's heart rate dropped with it. I'm treating her pressure now, and the baby's heart rate should come back up with it. Help me keep her on her side.`, next: 'jor_c', fx: (s, A) => { s.p['222'].k.jorS = s.t; A.judge('222-jor-scared', 'comm', 1, `You told Jordan what was happening and gave him a job.`, `A frightened partner with a task is a help. Plain words, honest, with what you're doing about it.`, '222'); } },
      { label: `Please step out so we can work.`, next: 'jor_d', fx: (s, A) => { s.p['222'].k.jorS = s.t; A.judge('222-jor-scared', 'comm', -1, `You sent Jordan out without an explanation.`, `There was room for him and a reason to keep him: he can hold her on her side and keep her calm.`, '222'); } },
    ] },
    jor_c: { who: 'jordan', pid: '222', text: `He holds her hip steady with both hands. "I got you, Bri."` },
    jor_d: { who: 'jordan', pid: '222', text: `He backs into the hallway, staring through the door.` },
    jor_after: { who: 'jordan', pid: '222', text: `"Mason's going to lose his mind. He wanted a dog." He's holding the baby's foot like it's made of glass.` },

    fa_talk: { who: '223', text: `"I've read every VBAC paper there is. I know the numbers. What I want to know is what you'll be watching for."`, choices: [
      { label: `Mostly the baby's heart rate: a change in the pattern is often the first sign the scar is under strain. And you: pain that's constant or different from contractions, bleeding, or contractions that suddenly stop. If any of that happens, the team moves fast. We'll start an IV now so we're ready.`, next: 'fa_a', fx: (s, A) => { s.p['223'].k.talked = s.t; A.judge('223-talk', 'comm', 1, `You explained the warning signs of rupture to Ms. Haddad.`, `An informed TOLAC patient is part of the safety net: she'll tell you when pain changes character.`, '223'); } },
      { label: `Don't worry, ruptures almost never happen.`, next: 'fa_b', fx: (s, A) => { s.p['223'].k.talked = s.t; A.judge('223-talk', 'comm', -1, `You answered Ms. Haddad with reassurance instead of information.`, `She asked what to watch for. The risk is small; the signs still matter.`, '223'); } },
    ] },
    fa_a: { who: '223', text: `"Different pain, bleeding, contractions stopping. And the strip." She holds out her arm for the IV. "Fine. Put it in."` },
    fa_b: { who: '223', text: `"Almost never is a number. I'm a pharmacist. I like numbers." She doesn't look reassured.` },
    fa_epi: { who: '223', text: `"Okay. I've walked enough. I want the epidural. Is that okay with a VBAC? Someone online said it can hide a rupture."`, choices: [
      { label: `It's fine, and it's a good idea: if you ever needed a cesarean, it can be used for that. It doesn't hide a rupture; pain that breaks through a working epidural is one of the signs we watch for. I'll call anesthesia.`, next: 'fa_c', fx: (s, A) => { const P = s.p['223']; P.epiReq = true; A.judge('223-epi', 'comm', 1, `You answered Ms. Haddad's epidural question accurately.`, `ACOG: epidural analgesia is appropriate in TOLAC and doesn't mask rupture.`, '223'); } },
      { label: `Better to avoid it with a VBAC, just in case.`, next: 'fa_d', fx: (s, A) => { const P = s.p['223']; P.epiReq = true; A.judge('223-epi', 'judgment', -1, `You told Ms. Haddad to avoid an epidural in TOLAC.`, `There's no reason to withhold it; it may even make an emergency faster.`, '223'); } },
    ] },
    fa_c: { who: '223', text: `"Good. Call them."` },
    fa_d: { who: '223', text: `She frowns. "That's not what the guidelines say." She's right.` },
    fa_after: { who: '223', text: `"Yusuf wants to know if the baby will come out the same door he did. I said no, this time she takes the stairs."` },
    fa_rupt: { who: '223', text: `"Something tore. It's not a contraction. It's not stopping. Please." She's gray and grabbing your wrist.`, choices: [
      { label: `I believe you. Something is wrong and we're going to the operating room right now to get the baby out. I'm calling the team and I'm staying with you.`, next: 'fa_e', fx: (s, A) => { s.p['223'].k.ruptTalk = s.t; A.judge('223-rupt-talk', 'comm', 1, `You told Ms. Haddad the truth and stayed with her.`, `In an emergency: one sentence of what's happening, then act. Don't leave her alone.`, '223'); } },
      { label: `You're probably in transition. That's the hardest part. I'll get you something for the pain.`, next: 'fa_f', fx: (s, A) => { s.p['223'].k.ruptTalk = s.t; A.judge('223-rupt-talk', 'judgment', -2, `You called Ms. Haddad's rupture pain transition.`, `Transition comes and goes with contractions. Constant pain with no contractions on the toco and a falling FHR in a TOLAC is rupture.`, '223'); } },
    ] },
    fa_e: { who: '223', text: `She nods, eyes shut. "Okay. Okay. Get her out."` },
    fa_f: { who: '223', text: `"It's not like that. It's not." Her voice is getting quieter.` },
    om_talk: { who: 'omar', pid: '223', text: `Omar holds out his phone. "They gave us her records from Michigan. It says 'low transverse.' Is that the scar on her belly? Does it matter?"`, choices: [
      { label: `It matters a lot, and that's the good kind. The scar on the skin doesn't always match the one on the uterus. "Low transverse" means the uterine cut was low and side to side, which is the kind that makes trying for a vaginal birth reasonable. I'll read the full report too.`, next: 'om_a', fx: (s, A) => { s.p['223'].k.om = s.t; A.judge('223-om', 'comm', 1, `You explained what Ms. Haddad's incision type means.`, `Skin and uterine incisions can differ. The uterine incision type determines TOLAC eligibility.`, '223'); } },
      { label: `It's just the scar on her skin. Doesn't matter.`, next: 'om_b', fx: (s, A) => { s.p['223'].k.om = s.t; A.judge('223-om', 'judgment', -1, `You told Omar the incision type didn't matter.`, `The uterine incision type is the key question in a TOLAC.`, '223'); } },
    ] },
    om_a: { who: 'omar', pid: '223', text: `"Okay. Good kind." He offers you a date. "Please, take two. They're from my mother."` },
    om_b: { who: 'omar', pid: '223', text: `"Oh. Okay." He puts the phone away.` },
    om_after: { who: 'omar', pid: '223', text: `"Yusuf called. He wants to know if the baby can hear his drum." Omar plays a voice memo of very loud drumming.` },
    om_rupt: { who: 'omar', pid: '223', text: `Omar is backed against the wall. "What's happening? Is she dying? Is the baby dying?"`, choices: [
      { label: `Her uterus may have torn where the old scar was. She needs surgery right now to get the baby out and stop the bleeding. The whole team is coming. Renee will take you to where you can wait, and someone will come to you as soon as we know.`, next: 'om_c', fx: (s, A) => { s.p['223'].toldOmar = true; A.judge('223-om-rupt', 'comm', 1, `You told Omar what was happening in plain words.`, `Even in a STAT, the family gets one honest sentence and a person to stay with them.`, '223'); } },
      { label: `I can't talk right now.`, next: 'om_d', fx: (s, A) => { s.p['223'].toldOmar = false; A.judge('223-om-rupt', 'comm', -1, `You left Omar without an answer.`, `Ten seconds and a person to walk him out is all it takes.`, '223'); } },
    ] },
    om_c: { who: 'omar', pid: '223', text: `He kisses her forehead. "I'm right outside." Renee takes his arm.` },
    om_d: { who: 'omar', pid: '223', text: `He stands frozen in the hallway as the bed rushes past.` },

    cl_talk: { who: '224', text: `Claire points at the IV bag pharmacy sent up. "My birth plan says no IV. Do I really need the antibiotic? I feel totally fine."`, choices: [
      { label: `You do, and I'll keep the rest of your plan as close as we can. You carry GBS, and your water's been broken for 19 hours; penicillin now protects the baby from a serious infection, and it works best if it's in at least 4 hours before birth. It runs for 30 minutes, then I lock the IV and you're free to move.`, next: 'cl_a', fx: (s, A) => { s.p['224'].k.talked = s.t; A.judge('224-talk', 'comm', 2, `You explained why Ms. Donnelly needs GBS prophylaxis, and kept her plan in view.`, `Informed refusal is her right, but most refusals are really questions. Explain the why, the timing, and what she keeps.`, '224'); } },
      { label: `It's hospital policy.`, next: 'cl_b', fx: (s, A) => { s.p['224'].k.talked = s.t; A.judge('224-talk', 'comm', -1, `You answered "policy."`, `She asked why. Policy isn't a reason she can weigh.`, '224'); } },
      { label: `It's your choice. We can skip it if you want.`, next: 'cl_c', fx: (s, A) => { s.p['224'].k.talked = s.t; A.judge('224-talk', 'judgment', -2, `You offered to skip Ms. Donnelly's GBS prophylaxis without explaining the risk.`, `It is her choice, but an informed one. Early-onset GBS sepsis can kill a newborn; she needs to hear that before deciding.`, '224'); } },
    ] },
    cl_a: { who: '224', text: `She thinks about it. "Thirty minutes, then I can move?" She holds out her hand. "Okay. For the baby."` },
    cl_b: { who: '224', text: `"That's not a reason." Jess squeezes her hand. She lets you hang it anyway, looking unhappy.` },
    cl_c: { who: '224', text: `"Really?" She hesitates. "What would you do?"` },
    cl_fever: { who: '224', text: `"I'm burning up. Is the baby okay? Does this mean my whole plan is gone?"`, choices: [
      { label: `You have a fever and the baby's heart rate is up too; I think there's an infection in the uterus, which happens after a long time with your water broken. We treat it with antibiotics now, and the baby's team will be at the birth. A lot of your plan can still happen: moving, lights low, no epidural unless you want one.`, next: 'cl_d', fx: (s, A) => { s.p['224'].k.fev = s.t; A.judge('224-fever-talk', 'comm', 1, `You told Ms. Donnelly about the infection honestly and kept her plan in the room.`, `Changing the plan for safety doesn't mean taking away her choices. Say what has to change and what doesn't.`, '224'); } },
      { label: `It's probably nothing. Women get warm in labor.`, next: 'cl_e', fx: (s, A) => { s.p['224'].k.fev = s.t; A.judge('224-fever-talk', 'judgment', -2, `You told Ms. Donnelly her fever was probably nothing.`, `Fever after a long rupture with fetal tachycardia is infection until proven otherwise.`, '224'); } },
    ] },
    cl_d: { who: '224', text: `She lets out a long breath. "Okay. Treat it. Keep the lights low." Jess turns the whale sounds back on.` },
    cl_e: { who: '224', text: `"Okay." She shivers under the blanket.` },
    cl_after: { who: '224', text: (s) => (s.p['224'].inf >= .6 ? `"I'm so hot." She kicks off the blanket.` : `"Jess says the whale sounds are for her, not me." Jess doesn't deny it.`) },
    jess_talk: { who: 'jess', pid: '224', text: `Jess shows you a laminated card. "Our plan. Intermittent monitoring, no IV, no epidural. The night nurse said the monitor has to stay on. Why?"`, choices: [
      { label: `Because her water's been broken a long time and she carries GBS, the baby's heart rate is our earliest warning of infection, so we watch it continuously for now. It can be wireless so she can still walk, shower and use the ball.`, next: 'jess_a', fx: (s, A) => { s.p['224'].k.jess = s.t; A.judge('224-jess', 'comm', 1, `You explained the monitoring to Jess and offered what's still possible.`, `Explain the reason, then offer what's still possible.`, '224'); } },
      { label: `Everyone gets continuous monitoring here.`, next: 'jess_b', fx: (s, A) => { s.p['224'].k.jess = s.t; A.judge('224-jess', 'comm', -1, `You answered Jess with a rule instead of a reason.`, `There's a real clinical reason; share it.`, '224'); } },
    ] },
    jess_a: { who: 'jess', pid: '224', text: `"Wireless works." She crosses something off the card and writes something else in.` },
    jess_b: { who: 'jess', pid: '224', text: `"Okay." She puts the card face down on the table.` },
    jess_fever: { who: 'jess', pid: '224', text: `Jess catches you in the doorway. "She's shaking and the baby's monitor says 170. Is the baby in danger? Should we be doing a C-section?"`, choices: [
      { label: `The baby's heart rate is up because Claire has a fever, likely an infection in the uterus. The treatment is antibiotics now, and the baby's team at the birth; an infection alone isn't a reason for a cesarean. I'm watching the baby's heart rate closely.`, next: 'jess_c', fx: (s, A) => { s.p['224'].k.jessF = s.t; A.judge('224-jess-fever', 'comm', 1, `You answered Jess's question about a cesarean accurately.`, `ACOG: intraamniotic infection alone isn't an indication for cesarean; antibiotics and close monitoring are.`, '224'); } },
      { label: `Probably. I'll ask the doctor.`, next: 'jess_d', fx: (s, A) => { s.p['224'].k.jessF = s.t; A.judge('224-jess-fever', 'comm', -1, `You suggested a cesarean was likely.`, `Infection isn't, by itself, a reason for a cesarean. Say what you know.`, '224'); } },
    ] },
    jess_c: { who: 'jess', pid: '224', text: `"Antibiotics. Okay." She goes back to holding Claire's hand and counting with her.` },
    jess_d: { who: 'jess', pid: '224', text: `She goes pale and starts texting her mother.` },
    jess_after: { who: 'jess', pid: '224', text: `"Twenty-two kindergartners made her a card. Half of them drew the baby as a dinosaur."` },
  };

  /* ---------- events ---------- */
  const A0 = (s) => Object.keys(s.p).every((id) => s.p[id].seenAt === null);
  const events = [
    { id: 'tech-hi', when: (s) => s.t >= 3, run(s, A) { A.msg({ from: 'renee', text: `Morning! I've got 221 to 224 with you. I can do vitals on whoever's stable, stock rooms, ice chips, set up warmers, and transport. 224's penicillin just came up from pharmacy.`, replies: [{ label: 'Open tasks for Renee', act: 'delegate' }] }); } },
    { id: 'l-strip', when: (s) => { const P = s.p['221']; return P.efmAt !== null && !P.gone; }, run(s, A) { const P = s.p['221']; P.stripAsk = { cat: alCat(P), tachy: alTachy(P) }; A.msg({ from: 'nova', pid: '221', text: `Strip check before the huddle. You just looked at 221: how are you reading it?`, replies: [{ label: 'Category I, but tachysystole: more than 5 in 10. The oxytocin has to come down', act: 'l-cat-1t' }, { label: 'Category II: tachysystole with late decelerations. Intrauterine resuscitation now', act: 'l-cat-2' }, { label: 'Category I with adequate contractions. Keep titrating up', act: 'l-cat-1' }, { label: 'Category III. Call for an emergency cesarean', act: 'l-cat-3' }] }); } },
    { id: 'l-res', when: (s) => s.t >= 30 && !s.p['221'].gone, run(s, A) { const P = s.p['221']; const off = P.oxy === 0 || P.decAt !== null; A.msg({ from: 'lindqvist', pid: '221', text: off ? `Hi, Dr. Lindqvist, OB resident. I see 221's oxytocin was turned down. She's been 4 since three o'clock. Can we go back up, 2 every 30 per the order set? I'd like to see some change by rounds.` : `Hi, Dr. Lindqvist, OB resident. 221 hasn't changed since three o'clock. Can you go up on her oxytocin per the order set? I'd like to see some change by rounds.`, replies: [{ label: off ? 'Not yet. She had tachysystole with a changing strip. She needs 30 minutes of a Category I tracing first, then I\'ll restart at half per protocol' : 'No. She\'s having more than 5 contractions in 10 minutes. I\'m stopping the oxytocin and starting resuscitation. Please come look at the strip', act: 'l-up-no' }, { label: 'Okay, going up by 2 per the order set', act: 'l-up-yes' }, { label: 'Let me look at her strip first and call you back', act: 'l-up-wait' }] }); } },
    { id: 'l-cat3', when: (s) => { const P = s.p['221']; return !P.gone && P.fs >= .85; }, run(s, A) { const P = s.p['221']; P.gone = true; P.goneAt = s.t; P.goneText = 'Emergency cesarean for a Category III tracing'; P.oxy = 0; A.judge('221-cat3', 'safety', -3, `Ms. Fuentes's tracing became Category III.`, `Tachysystole was on the strip from report. Late decelerations, then minimal, then absent variability: the baby ran out of reserve. Stopping the oxytocin early was the fix.`, '221'); A.msg({ from: 'adeyemi', pid: '221', urgent: true, text: `221 has absent variability with recurrent lates. Category III. We're going to the OR now for a STAT section.` }); } },

    { id: 'b-hypo', when: (s) => s.t >= 24, run(s, A) { const P = s.p['222']; P.hypo = 1; P.hypoAt = s.t; A.msg({ from: 'renee', pid: '222', urgent: true, text: `222's BP is 82/44 and she says she's going to throw up. The baby's monitor is beeping, heart rate's in the 90s.`, replies: [{ label: 'Go to 222', act: 'goto', pid: '222' }, { label: 'Give her an emesis bag and recheck the BP in 15 minutes', act: 'b-later' }] }); } },
    { id: 'b-strip', when: (s) => { const P = s.p['222']; return P.hypoAt !== null && P.efmAt !== null && P.efmAt >= P.hypoAt && P.hypo >= .3; }, run(s, A) { A.msg({ from: 'nova', pid: '222', text: `I see 222's strip from the desk. What are you calling it?`, replies: [{ label: 'Category II: a prolonged deceleration with maternal hypotension. Side, bolus, phenylephrine, anesthesia', act: 'b-cat-2' }, { label: 'Category I. She\'s just nauseated from the epidural', act: 'b-cat-1' }, { label: 'Category III. Emergency cesarean now', act: 'b-cat-3' }] }); } },
    { id: 'b-rescue', when: (s) => { const P = s.p['222']; return P.hypoAt !== null && s.t >= P.hypoAt + 15 && P.hypo >= .5 && !P.lateral && P.pressAt === null && !P.rescued; }, run(s, A) { const P = s.p['222']; P.rescued = true; P.lateral = true; P.bolus = true; P.pressAt = s.t; P.anesAt = P.anesAt === null ? s.t : P.anesAt; A.judge('222-rescue', 'safety', -3, `Ms. Scott's hypotension and prolonged deceleration went untreated for 15 minutes.`, `A pressure of 82/44 and an FHR of 90 after an epidural: turn her, bolus, phenylephrine per the order, call anesthesia. All of it was on the order and nurse-initiated.`, '222'); A.msg({ from: 'nova', pid: '222', urgent: true, text: `I'm in 222. FHR was 90 for 15 minutes and her pressure 80 over 40s. Turned her, bolus, phenylephrine, Kwan's on his way. Where were you?` }); } },
    { id: 'b-kwan', when: (s) => { const P = s.p['222']; return P.anesAt !== null && s.t >= P.anesAt + 8 && !P.kwanCame; }, run(s, A) { const P = s.p['222']; P.kwanCame = true; let gave = false; if (P.hypo >= .3 && P.pressAt === null) { P.pressAt = s.t; gave = true; } A.msg({ from: 'kwan', pid: '222', text: gave ? `In 222. Her pressure was still low, so I gave phenylephrine myself. That's on the order for you to give: don't wait for me. Turning the epidural rate down a little.` : `In 222. Pressure's back up, baby looks better. I've turned the epidural rate down a little. Call me if she drops again.` }); } },
    { id: 'b-crown', when: (s) => s.t >= 200 && s.p['222'].bornAt === null, run(s, A) { const P = s.p['222']; P.crown = true; P.crownAt = s.t; P.complete = true; A.msg({ from: 'renee', pid: '222', urgent: true, text: `222 says she has to push NOW and I can see the head! Dr. Adeyemi's in a section in 226.${P.setup ? ' The warmer\'s on.' : ''}`, replies: [{ label: 'Go to 222', act: 'goto', pid: '222' }, { label: 'Tell her to cross her legs and hold it until Dr. Adeyemi gets here', act: 'b-hold' }] }); } },
    { id: 'b-auto', when: (s) => { const P = s.p['222']; return P.crown && P.bornAt === null && P.stage === 0 && s.t >= P.crownAt + 10; }, run(s, A) { const P = s.p['222']; P.bornAt = s.t; P.bornBy = 'nova'; P.stage = 2; P.dried = s.t; P.cord = 'late'; P.ppOxy = s.t; P.nuchal = 'slipped'; P.qbl = 250; A.judge('222-absent', 'priority', -2, `You weren't there when Ms. Scott's baby was born.`, `A crowning head is the most time-critical thing on the unit. Everything else could wait ten minutes.`, '222'); A.msg({ from: 'nova', pid: '222', urgent: true, text: `I caught 222's baby. Girl, born ${clock(s.t)}, crying, skin to skin. I started the postpartum oxytocin. I need you in here for the placenta and her fundus.` }); } },
    { id: 'b-apgar1', when: (s) => { const P = s.p['222']; return P.bornAt !== null && s.t >= P.bornAt + 1; }, run(s, A) { const P = s.p['222']; const vig = brVig(P); P.apgarTrue1 = vig ? 8 : 6;
      A.msg({ from: 'nova', pid: '222', text: vig ? `One minute. I see heart rate about 150, a strong cry, arms and legs flexed and moving, crying when I rub her back, body pink but hands and feet blue. What's her one-minute APGAR?` : `One minute. Heart rate about 120, a weak, irregular cry, some flexion but floppy arms, a grimace when I rub her back, body pink, hands and feet blue. What's her one-minute APGAR?`,
        replies: [{ label: '8. Vigorous: keep her skin to skin, keep drying, score again at 5 minutes', act: 'apgar1-8' }, { label: '6. Keep drying and stimulating, keep her warm, clear the airway if needed, pediatric team to assess', act: 'apgar1-6' }, { label: '10. Perfect: pink all over', act: 'apgar1-10' }, { label: '4. Start positive-pressure ventilation now', act: 'apgar1-4' }] }); } },
    { id: 'b-apgar5', when: (s) => { const P = s.p['222']; return P.bornAt !== null && s.t >= P.bornAt + 5; }, run(s, A) { const P = s.p['222']; const vig = brVig(P) && P.dried !== null && P.dried - P.bornAt <= 3; P.apgarTrue5 = vig ? 9 : 7;
      A.msg({ from: 'nova', pid: '222', text: vig ? `Five minutes. Heart rate 145, crying loudly, well flexed and kicking, sneezes when I touch her nose, pink except her hands and feet. Five-minute APGAR?` : `Five minutes. Heart rate 140, a good cry now, some flexion, a grimace to stimulation, pink except her hands and feet. Five-minute APGAR?`,
        replies: [{ label: '9. Normal: keep her skin to skin and help with the first feed', act: 'apgar5-9' }, { label: '7. Reassuring (7 to 10 is normal): keep her warm and skin to skin, pediatric team to look at her', act: 'apgar5-7' }, { label: '10. Perfect', act: 'apgar5-10' }, { label: '5. Start positive-pressure ventilation', act: 'apgar5-5' }] }); } },
    { id: 'b-ad', when: (s) => { const P = s.p['222']; return P.bornAt !== null && s.t >= P.bornAt + 15; }, run(s, A) { const P = s.p['222']; const took = P.placentaAt === null; if (took) { P.placentaAt = s.t; P.placentaBy = 'adeyemi'; P.qbl += 150; } A.msg({ from: 'adeyemi', pid: '222', text: `I'm here. ${P.bornBy === 'you' ? 'Nice catch.' : 'Thanks, Nova.'} ${took ? 'Placenta\'s out, intact.' : P.pulledCord ? 'We need to talk about that cord.' : 'Placenta looks intact.'} Small second-degree tear, I'll repair it. ${P.ppOxy === null ? 'Is the postpartum oxytocin running? Hang it now.' : 'Keep an eye on her fundus.'}` }); } },

    { id: 'tl-var', when: (s) => { const P = s.p['223']; return s.t >= 125 && !P.rupt && (P.efmAt === null || P.efmAt < 115); }, run(s, A) { A.msg({ from: 'renee', pid: '223', text: `223's monitor keeps alarming. The baby's heart rate drops with her contractions and pops back up. Is that okay?`, replies: [{ label: 'I\'ll come look at her strip now', act: 'goto', pid: '223' }, { label: 'That\'s normal in labor. Silence it', act: 'tl-var-ok' }] }); } },
    { id: 'tl-strip', when: (s) => { const P = s.p['223']; return !P.rupt && P.efmAt !== null && P.efmAt >= 115; }, run(s, A) { A.msg({ from: 'nova', pid: '223', text: `You're in 223, the TOLAC. What's her strip doing?`, replies: [{ label: 'Category II: recurrent variable decelerations, getting deeper. In a TOLAC that can be the first sign of rupture. Telling Dr. Adeyemi now', act: 'tl-cat-2' }, { label: 'Category I: variables are cord compression. I\'ll reposition her', act: 'tl-cat-1' }, { label: 'Category III. Emergency cesarean', act: 'tl-cat-3' }] }); } },
    { id: 'tl-rupt', when: (s) => s.t >= 140, run(s, A) { const P = s.p['223']; P.rupt = true; P.ruptAt = s.t; A.msg({ from: 'renee', pid: '223', urgent: true, text: `223 says something "popped" and the pain is constant now, not coming and going. The baby's heart rate is in the 70s and the contraction line went flat.`, replies: [{ label: 'Go to 223', act: 'goto', pid: '223' }, { label: 'She\'s probably in transition. Tell her I\'ll bring her pain medicine', act: 'tl-pain' }, { label: 'The toco probably slipped. Can you adjust the belts?', act: 'tl-toco' }] }); } },
    { id: 'tl-nova', when: (s) => { const P = s.p['223']; return P.rupt && P.statAt === null && s.t >= P.ruptAt + 15; }, run(s, A) { const P = s.p['223']; P.statAt = s.t; P.statBy = 'nova'; A.judge('223-late', 'safety', -3, `Ms. Haddad's uterine rupture went 15 minutes without a STAT call.`, `Constant pain, contractions stopping, loss of station and fetal bradycardia in a TOLAC: rupture. Decision to delivery needs to be minutes.`, '223'); A.msg({ from: 'nova', pid: '223', urgent: true, text: `I called the STAT on 223. FHR 70 for 15 minutes in a TOLAC with constant pain. That's a rupture. We're running to OR 2.` }); } },
    { id: 'tl-or', when: (s) => { const P = s.p['223']; return P.statAt !== null && !P.gone && s.t >= P.statAt + (P.mdNear ? 4 : 7); }, run(s, A) { const P = s.p['223']; P.gone = true; P.goneAt = s.t; P.orAt = s.t; P.goneText = 'STAT cesarean for uterine rupture'; A.msg({ from: 'adeyemi', pid: '223', urgent: true, text: `Taking 223 back to OR 2 now. General anesthesia. NICU's coming.` }); } },
    { id: 'tl-baby', when: (s) => { const P = s.p['223']; return P.orAt !== null && s.t >= P.orAt + 12; }, run(s, A) { const P = s.p['223']; const d = P.statAt - P.ruptAt; A.msg({ from: 'adeyemi', pid: '223', text: d <= 5 && P.statBy !== 'nova' ? `Baby girl out of 223's uterus, through a tear along the old scar. APGARs 4 and 8, cord gas okay. I repaired the uterus; she's lost about a liter. Thank you for calling it fast.` : d <= 10 && P.statBy !== 'nova' ? `223's baby is out: APGARs 2 and 6, to the NICU for observation. The tear was along the old scar; she needed 2 units.` : `223's baby is out: APGARs 1 and 3, cord pH 6.94. NICU is starting cooling. Fatima needed a hysterectomy and 4 units.` }); } },

    // A fever someone charts first (you, or Renee on a vitals round) is the fever's time; Renee's call then never comes.
    { id: 'g-found', when: (s) => { const P = s.p['224']; return P.feverAt === null && !P.gone && P.vit.some((v) => v.t > 0 && +v.T >= 38); }, run(s, A) { const P = s.p['224'], v = P.vit.find((x) => x.t > 0 && +x.T >= 38); P.feverAt = v.t; P.feverT = +v.T; } },
    { id: 'g-fever', when: (s) => s.t >= 105 && !s.p['224'].gone && s.p['224'].feverAt === null, run(s, A) { const P = s.p['224']; P.feverAt = s.t; P.feverT = clT(s, P); A.msg({ from: 'renee', pid: '224', text: `224's temp is ${P.feverT.toFixed(1)} (${fF(P.feverT)}) and her heart rate's ${A.vitals('224').HR}. She asked for a cold washcloth. Anything else?`, replies: [{ label: 'I\'m coming to assess her now', act: 'goto', pid: '224' }, { label: 'A washcloth is fine. It\'s probably the room', act: 'g-wash' }] }); } },
    { id: 'g-strip', when: (s) => { const P = s.p['224']; return P.feverAt !== null && P.efmAt !== null && P.efmAt >= P.feverAt && !P.gone; }, run(s, A) { A.msg({ from: 'nova', pid: '224', text: `How's 224's strip with that fever?`, replies: [{ label: 'Category II: fetal tachycardia around 170 with minimal variability. With her fever, that\'s intraamniotic infection until proven otherwise', act: 'g-cat-2' }, { label: 'Category I: 170 is the high end of normal', act: 'g-cat-1' }, { label: 'Category III. She needs a cesarean now', act: 'g-cat-3' }] }); } },
    { id: 'g-sepsis', when: (s) => { const P = s.p['224']; return !P.gone && P.ampAt === null && P.inf >= 1.4; }, run(s, A) { const P = s.p['224']; P.gone = true; P.goneAt = s.t; P.goneText = 'Cesarean for maternal sepsis'; A.judge('224-sepsis', 'safety', -3, `Ms. Donnelly's intraamniotic infection progressed to sepsis.`, `Fever with a long rupture, maternal and fetal tachycardia and a tender uterus was treatable with antibiotics at 08:45. It needed a call.`, '224'); A.msg({ from: 'adeyemi', pid: '224', urgent: true, text: `224 is septic: temp 39.4, pressure 88/46, FHR 180 with no variability. Starting ampicillin and gentamicin and taking her for a cesarean. Who was watching her?` }); } },

    { id: 'nova-idle', when: (s) => s.t >= 40 && s.t < 120 && A0(s), run(s, A) { A.msg({ from: 'nova', urgent: true, text: `It's almost eight and you haven't been in a room. Four monitors, four babies. Go read a strip.` }); } },
    { id: 'nova-30', when: (s) => s.t >= 270, run(s, A) { A.msg({ from: 'nova', text: `Thirty minutes to handoff. Every oxytocin rate, every strip category, and who's going where.` }); } },
  ];

  const replies = {
    'l-cat-1t'(s, A) { const P = s.p['221'], q = P.stripAsk || { cat: alCat(P), tachy: alTachy(P) }; const right = q.cat === 1 && q.tachy; A.judge('221-read', 'judgment', right ? 2 : -1, right ? `You read Ms. Fuentes's strip as Category I with tachysystole.` : `You read Ms. Fuentes's strip as Category I with tachysystole.`, right ? `Baseline normal, moderate variability, no decelerations: Category I. But tachysystole is about the uterus, not the category, and on oxytocin it still means reduce or stop. It's the setup for what comes next.` : `Not quite: ${q.cat >= 2 ? 'there were late decelerations, so it was Category ' + q.cat + '.' : 'the contractions were 5 or fewer.'}`, '221'); },
    'l-cat-2'(s, A) { const P = s.p['221'], q = P.stripAsk || { cat: alCat(P), tachy: alTachy(P) }; const right = q.cat === 2; A.judge('221-read', 'judgment', right ? 2 : -1, `You read Ms. Fuentes's strip as Category II.`, right ? `Late decelerations make it Category II even with moderate variability. With tachysystole on oxytocin: stop or reduce it, turn her, bolus, tell the provider.` : `${q.cat === 1 ? 'There were no late decelerations yet: Category I, with tachysystole. The oxytocin still has to come down.' : 'Absent variability with recurrent lates is Category III.'}`, '221'); },
    'l-cat-1'(s, A) { A.judge('221-read', 'judgment', -2, `You read Ms. Fuentes's contractions as adequate and planned to keep titrating.`, `Adequate is 3 to 5 in 10 minutes. ${alN(s.p['221'])} in 10 is tachysystole, whatever the heart rate looks like right now.`, '221'); },
    'l-cat-3'(s, A) { const P = s.p['221'], q = P.stripAsk || { cat: alCat(P) }; A.judge('221-read', 'judgment', q.cat === 3 ? 2 : -1, `You called Ms. Fuentes's strip Category III.`, q.cat === 3 ? `Absent variability with recurrent late decelerations: Category III. Prepare for delivery.` : `Category III needs absent variability with recurrent lates or bradycardia, or a sinusoidal pattern. This wasn't that yet.`, '221'); },
    'l-up-no'(s, A) { const P = s.p['221']; P.declined = true; A.judge('221-res', 'judgment', P.efmAt !== null ? 2 : 1, `You declined to increase Ms. Fuentes's oxytocin${P.efmAt !== null ? ' because of what was on the strip' : ''}.`, `The titration order assumes a normal strip and normal contractions. With tachysystole, the safety protocol wins, and saying so to the resident is part of the job.${P.efmAt === null ? ' Look at the strip before you answer next time.' : ''}`, '221'); A.msg({ from: 'lindqvist', pid: '221', text: `Fair. I didn't look at the toco. I'll come see the strip with you.` }); },
    'l-up-yes'(s, A) { const P = s.p['221']; P.oxy = P.oxy ? Math.min(20, P.oxy + 2) : Math.max(2, Math.floor(P.prevRate / 2)); if (P.oxy && P.offAt !== null && P.restartAt === null) { P.restartAt = s.t; P.restartBad = alBad(P) || s.t - P.offAt < 30; } P.upBad += alBad(P) ? 1 : 0; A.judge('221-res', 'safety', alBad(P) ? -3 : -1, `You agreed to increase Ms. Fuentes's oxytocin because the resident asked.`, `The order set says go up until contractions are adequate. She was already past adequate. A request isn't an assessment: look at the strip and the contraction count first.`, '221'); },
    'l-up-wait'(s, A) { A.judge('221-res', 'judgment', 1, `You held off on the oxytocin until you'd looked at the strip.`, `Deciding after you look is safe. The strip has the answer.`, '221'); },

    'b-later'(s, A) { const P = s.p['222']; P.laterAt = s.t; A.judge('222-later', 'judgment', -2, `You planned to recheck Ms. Scott's 82/44 in 15 minutes.`, `Nausea after an epidural with a pressure of 82/44 and an FHR in the 90s is happening now. The epidural order is nurse-initiated: side, bolus, phenylephrine, anesthesia.`, '222'); },
    'b-cat-2'(s, A) { A.judge('222-read', 'judgment', 2, `You read Ms. Scott's strip as Category II from maternal hypotension.`, `A prolonged deceleration (2 to 10 minutes) is Category II. The cause is in the mother: fix her pressure and the baby recovers.`, '222'); },
    'b-cat-1'(s, A) { A.judge('222-read', 'judgment', -2, `You read Ms. Scott's prolonged deceleration as Category I.`, `A drop to 90 for minutes isn't Category I. And her nausea is a symptom of the same problem: hypotension.`, '222'); },
    'b-cat-3'(s, A) { A.judge('222-read', 'judgment', -1, `You called Ms. Scott's strip Category III.`, `A prolonged deceleration with a clear, reversible cause is Category II. Treat the cause first; most recover within minutes.`, '222'); },
    'b-hold'(s, A) { const P = s.p['222']; P.held = true; A.judge('222-legs', 'safety', -3, `You told Ms. Scott to hold the baby in.`, `Holding back a crowning baby risks fetal hypoxia and injury. You can't stop a birth; you can make it controlled. Go, call for help, and catch.`, '222'); A.msg({ from: 'renee', pid: '222', urgent: true, text: `I told her. She's screaming that she can't. The head's still coming. Please come!`, replies: [{ label: 'Go to 222', act: 'goto', pid: '222' }] }); },
    'apgar1-8'(s, A) { apgar(s, A, 1, 8); }, 'apgar1-6'(s, A) { apgar(s, A, 1, 6); }, 'apgar1-10'(s, A) { apgar(s, A, 1, 10); }, 'apgar1-4'(s, A) { apgar(s, A, 1, 4); },
    'apgar5-9'(s, A) { apgar(s, A, 5, 9); }, 'apgar5-7'(s, A) { apgar(s, A, 5, 7); }, 'apgar5-10'(s, A) { apgar(s, A, 5, 10); }, 'apgar5-5'(s, A) { apgar(s, A, 5, 5); },

    'tl-var-ok'(s, A) { A.judge('223-var-ok', 'judgment', -2, `You had Ms. Haddad's monitor alarm silenced as normal labor.`, `New, recurrent decelerations in a TOLAC need eyes on the strip. They can be the first sign of rupture.`, '223'); },
    'tl-cat-2'(s, A) { A.judge('223-read', 'judgment', 2, `You read Ms. Haddad's strip as Category II and planned to call.`, `Recurrent variables with moderate variability are Category II. In a TOLAC, a new pattern like this is a reason to bring the obstetrician to the bedside: it can precede rupture.`, '223'); },
    'tl-cat-1'(s, A) { A.judge('223-read', 'judgment', -2, `You read recurrent variable decelerations as Category I.`, `Recurrent variables are Category II. Repositioning helps cord compression, but in a TOLAC the obstetrician needs to know.`, '223'); },
    'tl-cat-3'(s, A) { A.judge('223-read', 'judgment', -1, `You called Ms. Haddad's strip Category III.`, `Variability is still moderate: Category II. Report it and watch closely.`, '223'); },
    'tl-pain'(s, A) { A.judge('223-pain', 'judgment', -2, `You read Ms. Haddad's sudden constant pain as transition.`, `Transition comes in waves with contractions. Constant pain, a flat contraction line and an FHR of 70 in a TOLAC is uterine rupture.`, '223'); },
    'tl-toco'(s, A) { A.judge('223-toco', 'judgment', -2, `You blamed the flat contraction line on the toco.`, `Contractions that suddenly stop with constant pain and a falling FHR is a sign of rupture, not equipment. Look at the patient.`, '223'); },

    'g-wash'(s, A) { s.p['224'].wash = true; A.judge('224-wash', 'judgment', -2, `You put Ms. Donnelly's fever down to the room.`, `A temperature of 38.6 with a maternal heart rate over 110 after 21 hours of ruptured membranes is intraamniotic infection until proven otherwise. A washcloth isn't a plan.`, '224'); },
    'g-cat-2'(s, A) { A.judge('224-read', 'judgment', 2, `You read Ms. Donnelly's strip as Category II with fetal tachycardia.`, `Baseline over 160 is tachycardia, and tachycardia or minimal variability makes it Category II. With a maternal fever, the baby is telling you about the infection.`, '224'); },
    'g-cat-1'(s, A) { A.judge('224-read', 'judgment', -2, `You called a baseline of 170 normal.`, `Normal is 110 to 160. Over 160 for 10 minutes is fetal tachycardia: Category II.`, '224'); },
    'g-cat-3'(s, A) { A.judge('224-read', 'judgment', -1, `You called Ms. Donnelly's strip Category III.`, `Tachycardia with minimal variability is Category II. Treat the infection and watch it closely.`, '224'); },
  };
  function apgar(s, A, min, said) {
    const P = s.p['222'], truth = min === 1 ? P.apgarTrue1 : P.apgarTrue5;
    if (min === 1) P.apgar1 = said; else P.apgar5 = said;
    const right = said === truth, far = Math.abs(said - truth) >= 3;
    A.judge(`222-apgar${min}`, 'judgment', right ? 2 : far ? -2 : -1, right ? `You scored the ${min}-minute APGAR correctly: ${truth}.` : `You scored the ${min}-minute APGAR as ${said}; it was ${truth}.`,
      `Heart rate (over 100 is 2), breathing and cry (strong is 2), tone (active flexion is 2), reflex irritability (a cry or sneeze is 2, a grimace is 1), color (blue hands and feet is 1; almost every newborn loses that point). ${min === 1 ? 'APGAR doesn\'t decide whether to resuscitate; that starts before the 1-minute mark. It tells you how she\'s responding.' : 'A 5-minute score of 7 to 10 is reassuring.'}`, '222');
  }

  /* ---------- delegation (OB tech) ---------- */
  const delegation = {
    note: () => `Renee is the OB tech: vital signs on stable patients, stocking, ice chips, warmers, transport. She doesn't interpret fetal monitor tracings, do cervical exams or touch the pumps.`,
    tasks: [
      { id: 'vitals', label: 'Take a set of maternal vital signs', rooms: ['221', '222', '223', '224'], mins: 5 },
      { id: 'ice', label: 'Bring ice chips and a peanut ball', rooms: ['221', '222', '223', '224'], mins: 5 },
      { id: 'warmer', label: 'Turn on the infant warmer and check the newborn resuscitation equipment', rooms: ['221', '222', '223', '224'], mins: 5 },
      { id: 'stock', label: 'Stock the room for delivery: delivery table, cord clamps, pads, scale', rooms: ['221', '222', '223', '224'], mins: 10 },
      { id: 'turn', label: 'Help her turn side to side and reposition the peanut ball', rooms: ['222'], mins: 5 },
      { id: 'temp', label: 'Recheck her temperature', rooms: ['224'], mins: 5 },
      { id: 'transport', label: 'Help move the bed and monitors to the OR', rooms: ['223'], mins: 3 },
      { id: 'strip', label: 'Watch the fetal monitor and tell me if the strip looks okay', rooms: ['221', '222', '223', '224'], mins: 0 },
      { id: 'sve', label: 'Check her cervix', rooms: ['221', '222', '223', '224'], mins: 0 },
      { id: 'oxy', label: 'Turn the oxytocin up by 2 at the half hour', rooms: ['221'], mins: 0 },
    ],
    start(task, pid, s, A) {
      const nm = A.def(pid).short, P = s.p[pid];
      if (task.id === 'strip') { A.judge('deleg-strip', 'deleg', -2, `You asked the OB tech to interpret a fetal monitor tracing.`, `Reading a tracing and deciding what it means is an RN assessment. A tech can tell you an alarm is sounding; the strip is yours.`); return `Renee: "I'm not trained to read strips. I'll tell you if it alarms, but you need to look."`; }
      if (task.id === 'sve') { A.judge('deleg-sve', 'deleg', -2, `You asked the OB tech to check a cervix.`, `Cervical exams are an RN or provider skill. They're an assessment, not a task.`); return `Renee: "I can't do cervical exams. That's you."`; }
      if (task.id === 'oxy') { A.judge('deleg-oxy', 'deleg', -2, `You asked the OB tech to titrate oxytocin.`, `Oxytocin is a high-alert drug; every change needs an RN's look at the strip and the contractions.`); return `Renee: "I don't touch the pumps. Especially that one."`; }
      if (task.id === 'transport' && (P.statAt === null || P.gone)) return `Renee: "She's not going anywhere yet. Want me to stock her room?"`;
      const unstable = (pid === '222' && (P.hypo >= .3 || (P.crown && P.bornAt === null))) || (pid === '223' && P.rupt) || (pid === '221' && alCat(P) >= 2) || (pid === '224' && P.inf >= 1);
      if (task.id === 'vitals' && unstable) { A.judge('deleg-vitals-' + pid, 'deleg', -1, `You delegated vital signs on ${nm}, who isn't stable.`, `When a patient is changing, the vital signs are part of your assessment. The tech can help; she can't replace you.`); return `Renee: "I'll grab a set, but you should see her yourself."`; }
      if (P.gone) return `Renee: "${nm}'s in the OR."`;
      if (s.deleg.filter((d) => !d.done).length >= 2) return `Renee: "I've got two going. Give me a few minutes."`;
      s.deleg.push({ id: task.id, pid, due: s.t + task.mins, done: false, at: s.t });
      A.judge('deleg-good-' + task.id + '-' + pid, 'deleg', 1, `You delegated ${task.label.toLowerCase()} for ${A.def(pid).short} to the OB tech.`, 'Hand off the measurements, supplies and routine care on stable patients; keep the strips, the exams and the drips.');
      return `Renee: "On it: ${task.label.toLowerCase()} for ${nm}."`;
    },
    complete(d, s, A) {
      const nm = A.def(d.pid).short, P = s.p[d.pid];
      if (d.id === 'vitals') { const v = A.recordVitals(d.pid, 'Renee (OB tech)'); A.msg({ from: 'renee', pid: d.pid, text: `${nm}: T ${v.T}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}%.${d.pid === '224' && v.T >= 38 ? ' She feels hot.' : ''}` }); }
      else if (d.id === 'temp') { const v = A.recordVitals(d.pid, 'Renee (OB tech)'); A.msg({ from: 'renee', pid: d.pid, text: `224's temp is ${v.T} (${fF(v.T)}), HR ${v.HR}.` }); }
      else if (d.id === 'warmer') { if (d.pid === '222') P.setup = true; A.msg({ from: 'renee', pid: d.pid, text: `Warmer's on in ${A.def(d.pid).room}. Bag-mask, suction, hat and blankets checked.` }); }
      else if (d.id === 'stock') A.msg({ from: 'renee', pid: d.pid, text: `${A.def(d.pid).room} is stocked for delivery.` });
      else if (d.id === 'ice') A.msg({ from: 'renee', pid: d.pid, text: `Ice chips and a peanut ball in ${A.def(d.pid).room}.` });
      else if (d.id === 'turn') { P.lateral = true; A.msg({ from: 'renee', pid: d.pid, text: `Turned 222 to her other side with the peanut ball.` }); }
      else if (d.id === 'transport') A.msg({ from: 'renee', pid: d.pid, text: `Bed's in OR 2. I walked Omar to the family room.` });
    },
  };

  /* ---------- Nova ---------- */
  function novaHint(s, A) {
    const L = s.p['221'], B = s.p['222'], F = s.p['223'], C = s.p['224'];
    if (F.rupt && F.statAt === null) return `A TOLAC with constant pain, a flat contraction line and an FHR of 70. What's the one diagnosis you can't miss?`;
    if (B.crown && B.bornAt === null) return `A head is crowning in 222 and the doctor is scrubbed. Who catches this baby?`;
    if (B.hypo >= .4) return `Pressure 82 over 44 and a baby at 90, twenty minutes after an epidural. Her epidural order tells you exactly what to do.`;
    if (!L.gone && L.oxy && alTachy(L)) return `Count 221's contractions over the last 30 minutes. What does her safety protocol say about that number?`;
    if (C.feverAt !== null && C.ampAt === null && !C.gone) return `A fever after 21 hours of ruptured membranes, a fast mom and a fast baby. Is penicillin for GBS enough?`;
    if (C.pcnAt === null && !C.gone) return `224 has a dose due at seven that only works if it's in four hours before the baby is.`;
    if (!F.iv && !F.gone) return `223 is trying for a vaginal birth after a cesarean. What has to be in place in case she can't?`;
    if (B.bladder && B.bornAt === null) return `222 can't feel her bladder with the epidural. When did she last void?`;
    if (L.offAt !== null && L.restartAt === null && !L.gone) return `221's strip has been quiet a while. What's the protocol for getting her labor going again?`;
    return `You're on top of it. Which strip haven't you read in the last half hour?`;
  }

  function endChecks(s, A) {
    A.c.patients.forEach((d) => {
      const P = s.p[d.id];
      if (P.seenAt === null && !P.gone) A.judge(d.id + '-unseen', 'assess', -3, `You never went into ${d.room} this shift.`, `In labor and delivery the monitor is a second patient in the room. Neither gets assessed from the desk.`, d.id);
      if (P.efmAt === null && !P.gone) A.judge(d.id + '-nostrip', 'assess', -1, `You never reviewed ${d.short}'s fetal monitor tracing yourself.`, `Every patient on continuous EFM needs her tracing reviewed and documented at set intervals: every 15 to 30 minutes in active labor.`, d.id);
      (d.meds || []).forEach((m) => { const st = s.meds[m.id]; if (m.due !== undefined && m.due <= Math.min(240, s.t - 60) && st.status === 'due' && !P.gone) A.judge(m.id + '-missed', 'meds', -2, `${m.name} for ${d.short} (due ${clock(m.due)}) was never given or held.`, `Every scheduled dose needs a decision: given, or held with a reason.`, d.id); });
    });
    const L = s.p['221'], B = s.p['222'], F = s.p['223'], C = s.p['224'];
    if (!L.gone && L.offAt === null && L.decAt === null) A.judge('221-never', 'safety', -2, `Ms. Fuentes's oxytocin was never reduced or stopped for tachysystole.`, `More than 5 contractions in 10 minutes on oxytocin: the safety protocol is nurse-initiated.`, '221');
    if (!L.gone && L.called === null && (L.offAt !== null || L.decAt !== null)) A.judge('221-norep', 'comm', -1, `Dr. Adeyemi never heard about Ms. Fuentes's tachysystole.`, `The protocol lets you act; it also says notify the provider.`, '221');
    if (B.bladder) A.judge('222-nocath', 'safety', -1, `Ms. Scott's bladder was never emptied.`, `No void since 04:00 with an epidural and a palpable bladder: scan and catheterize per order.`, '222');
    if (B.bornAt !== null && B.ppOxy === null) A.judge('222-nooxy', 'meds', -2, `Ms. Scott's postpartum oxytocin never went in.`, `Oxytocin after birth is the main prevention for postpartum hemorrhage.`, '222');
    if (B.placentaAt !== null && B.fundusAt === null) A.judge('222-nofundus', 'assess', -2, `You never checked Ms. Scott's fundus after the placenta.`, `Every 15 minutes for the first hour: tone, height, bleeding.`, '222');
    if (!F.gone && !F.iv) A.judge('223-noiv', 'safety', -1, `Ms. Haddad never had IV access.`, `TOLAC orders: IV and type and screen on admission.`, '223');
    if (C.feverAt !== null && C.called === null && !C.gone) A.judge('224-norep', 'comm', -3, `Ms. Donnelly's fever never reached the provider.`, `Fever with a long rupture and fetal tachycardia is a call: it needs broad-spectrum antibiotics.`, '224');
    if (C.feverAt !== null && !C.peds && !C.gone) A.judge('224-nopeds', 'comm', -1, `The pediatric team never heard about Ms. Donnelly's infection.`, `The baby will need an evaluation at birth.`, '224');
    const keys = []; A.c.patients.forEach((d) => (d.report || []).forEach((r, i) => { if (r.key) keys.push(d.id + ':' + i); }));
    const hit = keys.filter((k) => s.brain.includes(k)).length;
    if (s.brain.length) { const noise = s.brain.length - hit, precise = hit / s.brain.length;
      if (noise >= 4 && precise < .7) A.judge('brain', 'assess', -1, `You flagged ${s.brain.length} lines in report, ${noise} of them noise.`, 'Flagging everything is the same as flagging nothing.');
      else A.judge('brain', 'assess', hit / keys.length >= 0.6 && precise >= .7 ? 1 : 0, `You flagged ${hit} of ${keys.length} critical cues during handoff${noise ? `, plus ${noise} that didn't matter` : ''}.`, `In labor and delivery, report is drips, strips, risk factors and what's due. The lines that matter change what you do in the first hour.`); }
  }

  const PREP = { '221-oxy': ['efm'], '221-terb': ['vitals'], '222-phenyl': ['vitals'], '222-oxypp': ['fundus'], '223-fent': ['pain'], '224-apap': ['vitals'], '224-amp': ['vitals'] };
  [alicia, brianna, fatima, claire].forEach((d) => d.meds.forEach((m) => { if (PREP[m.id]) m.prep = PREP[m.id]; }));

  S.engine.registerCase({
    id: 'ld-2s-1', title: 'Days in Labor and Delivery', unit: 'Labor and Delivery, 2 South', unitShort: 'L&D', level: 'Specialty: Labor and delivery', start: 7 * 60, length: 300, novaCredits: 3,
    card: 'Labor and delivery until noon: an induction that\'s going too well, an epidural that drops a pressure, a scar that gives, and a fever after a long rupture.',
    hero: { head: 'Days, L&D 2 South. Four women in labor, four babies on the monitor.', lede: 'Labor and delivery, 07:00 to noon. Every room has two patients, and one of them can only talk through a tracing. Read it, or it reads you.' },
    intro: { time: '06:58', place: 'Labor and Delivery, 2 South', cta: 'Take report', beats: ['Tasha is finishing nights and giving report at the central monitor, four strips scrolling behind her.', 'Four women in labor until noon: an induction, a fresh epidural, a trial of labor after a cesarean, and a long rupture.', 'In L&D, the order that says go up and the strip that says stop are both true. Only one of them is about the baby.'] },
    minutes: 20,
    sysLabels: { gi: 'Uterus, bladder and fluid', skin: 'Skin, IV and perineum', pain: 'Pain and coping' },
    handoffBy: 'Tasha (night RN)', reportBy: 'tasha', reportRole: 'night shift', provider: 'adeyemi', providerLabel: 'a provider', cna: 'renee',
    staff: {
      nova: { name: 'Nova Reyes', role: 'Charge nurse', look: { skin: '#B98A63', shade: '#976D4B', lip: '#7C4435', blush: '#C77B5E', iris: '#3D2A1C', head: { w: 55, h: 62, jaw: .35 }, eye: 10, hair: { style: 'bun', color: '#3A2E2A', streak: true }, brow: { w: 3.6, color: '#2E2421' }, body: { w: 80, cloth: 'navy' }, extras: ['studs'], smile: .35 } },
      renee: { name: 'Renee', role: 'OB tech', look: LK('#E2B48E', '#C49670', '#A0594C', '#DC8E74', '#3A2616', 'bob', '#5A3A22', 'wine', ['studs'], .5) },
      tasha: { name: 'Tasha', role: 'Night RN', look: Object.assign(LK('#8A5A3C', '#6E4530', '#6A3A2C', '#A8604A', '#1E130C', 'curlyshort', '#140E0A', 'navy', ['gold']), { tired: true }) },
      adeyemi: { name: 'Dr. Adeyemi', role: 'OB attending', look: LK('#6A4330', '#4F301F', '#4D2A20', '#9C5642', '#1A100A', 'buzz', '#140E0A', 'teal', ['thinGlasses']) },
      kwan: { name: 'Dr. Kwan', role: 'Anesthesiologist', look: LK('#EBC6A2', '#CFA582', '#AE6A5C', '#E3967E', '#1E140C', 'short', '#1A1410', 'blue', []) },
      lindqvist: { name: 'Dr. Lindqvist', role: 'OB resident', look: LK('#F2D6BE', '#D8B49A', '#B87068', '#EEA090', '#5A7A9A', 'shag', '#C8A060', 'teal', []) },
      osei: { name: 'Dr. Osei', role: 'Pediatrics', look: LK('#5E3A27', '#47291B', '#4A2418', '#86493A', '#1A100A', 'short', '#140E0A', 'coat', ['glasses']) },
      rafael: { name: 'Rafael', role: 'Husband, 221', look: LK('#D6A47E', '#B88660', '#9A5648', '#D48A70', '#2A1C12', 'short', '#1A1310', 'tee', ['goatee']) },
      jordan: { name: 'Jordan', role: 'Partner, 222', look: LK('#5E3A27', '#47291B', '#4A2418', '#86493A', '#1A100A', 'buzz', '#140E0A', 'navy', ['beard']) },
      omar: { name: 'Omar', role: 'Husband, 223', look: LK('#C08A64', '#A06E4C', '#86483A', '#C27C60', '#20140C', 'short', '#1E1712', 'flannel', ['beard', 'glasses']) },
      jess: { name: 'Jess', role: 'Wife, 224', look: LK('#E8C0A0', '#CC9E7E', '#AE6258', '#E4927C', '#2A1C12', 'shag', '#3A2618', 'sun', ['freckles']) },
      lab: { name: 'Lab', role: 'Laboratory', look: null },
      bb: { name: 'Blood bank', role: 'Transfusion service', look: null },
    },
    patients: [alicia, brianna, fatima, claire],
    // Questions whose moment is over: the baby is out, the pressure is back, the rupture has gone to the OR.
    staleMsg(s, m) {
      const P = s.p[m.pid]; if (!P) return false;
      if (m.pid === '222') return (/push NOW/.test(m.text) && P.bornAt !== null) || (/BP is 82/.test(m.text) && P.hypo < .15 && s.t - m.t >= 10);
      if (m.pid === '223') return (/keeps alarming/.test(m.text) && P.rupt) || P.gone || P.statAt !== null;
      if (m.pid === '224') return P.gone || P.called !== null;
      return false;
    },
    dueExtras(s) {
      const out = [], L = s.p['221'], B = s.p['222'], F = s.p['223'], C = s.p['224'];
      [['221', L], ['222', B], ['223', F], ['224', C]].forEach(([id, P]) => { if (P.gone || (id === '222' && B.bornAt !== null)) return; const nx = (P.efmAt === null ? -15 : P.efmAt) + 30; out.push({ t: Math.max(0, nx), late: s.t > nx + 15, tab: 'care', hl: 'fetal monitor', text: `${id} Review the fetal monitor tracing (every 30 minutes)` }); });
      if (!L.gone) {
        if (L.oxy && alTachy(L) && L.efmAt !== null) out.push({ t: L.efmAt, late: s.t > L.efmAt + 10, tab: 'meds', hl: 'Oxytocin', text: '221 Tachysystole on oxytocin: safety protocol' });
        if (L.offAt !== null && L.restartAt === null && s.t >= L.offAt + 30) out.push({ t: L.offAt + 30, late: false, info: true, text: '221 Oxytocin off since ' + clock(L.offAt) + ': restart at half rate after 30 minutes of a Category I tracing' });
        if ((L.offAt !== null || L.decAt !== null) && !L.reassessed) { const t0 = (L.offAt !== null ? L.offAt : L.decAt) + 15; out.push({ t: t0, late: s.t > t0 + 15, tab: 'care', hl: 'Recheck the tracing', text: '221 Recheck the tracing after resuscitation' }); }
      }
      if (B.hypoAt !== null && B.hypo >= .3) out.push({ t: B.hypoAt, late: s.t > B.hypoAt + 5, tab: 'meds', hl: 'Phenylephrine', text: '222 BP 82/44 after the epidural, FHR 90: epidural order' });
      if (B.bladder && B.bornAt === null && !B.crown) out.push({ t: 0, late: s.t > 60, tab: 'care', hl: 'Bladder scan', text: '222 No void since 04:00 with an epidural: bladder' });
      if (B.crown && B.bornAt === null) out.push({ t: B.crownAt, late: true, tab: 'care', hl: 'Call for help', text: '222 Crowning: catch the baby' });
      if (B.bornAt !== null && B.ppOxy === null) out.push({ t: B.bornAt, late: s.t > B.bornAt + 10, tab: 'meds', hl: 'Oxytocin', text: '222 Postpartum oxytocin' });
      if (B.placentaAt !== null) { const nx = (B.fundusAt === null ? B.placentaAt : B.fundusAt) + 15; if (nx <= B.placentaAt + 60 || B.fundusAt === null) out.push({ t: nx, late: s.t > nx + 10, tab: 'care', hl: 'fundus', text: '222 Fundus and bleeding every 15 minutes' }); }
      if (!F.gone) {
        if (!F.iv) out.push({ t: 0, late: s.t > 60, tab: 'care', hl: '18-gauge IV', text: '223 TOLAC: IV access and type and screen (admission orders)' });
        if (F.rupt && F.statAt === null) out.push({ t: F.ruptAt, late: true, tab: 'care', hl: 'STAT', text: '223 Constant pain, FHR 70, contractions gone' });
      }
      if (!C.gone) {
        if (C.pcnAt === null && C.feverAt === null) out.push({ t: 0, late: s.t > 30, tab: 'meds', hl: 'Penicillin', text: '224 GBS prophylaxis due 07:00' });
        if (C.feverAt !== null && C.called === null) out.push({ t: C.feverAt, late: s.t > C.feverAt + 20, tab: 'care', hl: 'fetal monitor', text: '224 Fever ' + (C.feverT !== undefined ? C.feverT : clT(s, C)).toFixed(1) + ' °C (' + fF(C.feverT !== undefined ? C.feverT : clT(s, C)) + ' °F) after a long rupture: assess and call' });
        if (C.ampOrdered && C.ampAt === null) out.push({ t: C.called, late: s.t > C.called + 20, tab: 'meds', hl: 'Ampicillin', text: '224 Ampicillin and gentamicin ordered' });
      }
      return out;
    },
    replies,
    priority: {
      judge(r, A) {
        if (r[0] === '221') A.judge('rank-first', 'priority', 2, `You chose to see Ms. Fuentes first.`, `A high-alert drug causing harm right now: six contractions in 10 minutes on oxytocin. Every minute it runs, the baby has less reserve. It's also the one problem you can fix in a minute.`, '221');
        else if (r[0] === '222') A.judge('rank-first', 'priority', 1, `You chose to see Ms. Scott first.`, `Reasonable: a new epidural is the window for hypotension. But she's stable right now, and 221's oxytocin is doing harm on every contraction.`, '221');
        else A.judge('rank-first', 'priority', -1, `You put ${A.def(r[0]).short} first, ahead of the oxytocin causing tachysystole.`, `Active harm first (221), then the patient most likely to drop in the next 20 minutes (222), then the time-critical antibiotic (224), then the stable TOLAC (223).`, '221');
      },
      correct: ['221', '222', '224', '223'],
      why: {
        '221': `Oxytocin at 8 with contractions every minute and a half: tachysystole in report. The drug is the problem, and the fix is in your hands.`,
        '222': `An epidural placed 20 minutes ago in a woman whose first labor was five hours, with a full bladder. Hypotension and a fast birth are both coming.`,
        '224': `GBS positive with 19 hours of rupture and the penicillin due now. Not unstable, but the 4-hour window started at report.`,
        '223': `TOLAC, early labor, Category I. She needs an IV and a plan, not rescue, right now.`,
      },
    },
    // Debrief claims checked against the record (engine.js, checkClaims): blood given matches her OR course in flow.js.
    claims: [{ pid: '223', rx: /\b(one|two|three|four|six|\d+) units? of blood/i, ok: (s, P, A, m) => { const d = P.statAt !== null ? P.statAt - P.ruptAt : 99, want = P.statBy === 'nova' || d > 10 ? 'six' : d <= 5 ? 'two' : 'three'; return m[1].toLowerCase() === want; } }],
    events, delegation, dialogs, novaHint, endChecks,
    tick(s, A) {
      const L = s.p['221'];
      if (!L.gone) {
        const terb = L.terbAt !== null && s.t - L.terbAt < 60;
        const tgt = terb ? 2.5 : L.oxy >= 10 ? 7 : L.oxy >= 8 ? 6 : L.oxy >= 6 ? 5 : L.oxy >= 4 ? 4 : L.oxy >= 2 ? 3.5 : 3;
        L.ctx += (tgt - L.ctx) * (terb ? .1 : .03);
        if (alTachy(L)) L.fs = clamp(L.fs + .005 + (L.lateral ? 0 : .002) + (L.bolus ? 0 : .001) + (L.oxy >= 10 ? .002 : 0), 0, 1.2);
        else L.fs = clamp(L.fs - (.004 + (L.lateral ? .003 : 0) + (L.bolus ? .003 : 0)), 0, 1.2);
        if ((L.offAt !== null || L.decAt !== null) && L.recoveredAt === null && alCat(L) === 1 && !alTachy(L)) L.recoveredAt = s.t;
      }
      const B = s.p['222'];
      if (B.hypo > 0) {
        const dec = (B.lateral ? .02 : 0) + (B.bolus ? .02 : 0) + (B.pressAt !== null && s.t - B.pressAt < 20 ? .07 : 0);
        B.hypo = Math.max(0, B.hypo - dec);
        if (B.hypo >= .5) { B.hypoMin += 1; if (B.hypoMin >= 15 && !B.fetalHit) B.fetalHit = true; }
      }
      if (B.placentaAt !== null) B.qbl += brAtony(s, B) * 6;
      const C = s.p['224'];
      if (!C.gone) { if (C.ampAt === null) { if (s.t >= 40) C.inf += .008; } else C.inf = Math.max(.25, C.inf - (.005 + (C.gentAt !== null ? .002 : 0))); }
    },
  });
})(window.Shift);
