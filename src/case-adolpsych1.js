/* Case: 4 North, Adolescent Psychiatry, evening shift (15:00–20:00). Specialty.
   Themes: teenagers tell each other before they tell adults, and teenagers get called "dramatic." Two medical
   emergencies here look like behavior. Safety lives in the milieu: contraband, peer contagion, visitors.
   California framing: minors admitted on parent consent, or on a 5585 (the 72-hour hold for a minor). Nurses are
   mandated reporters in their own right. Self-harm and abuse are handled at the level of warning signs and the
   nurse's response, never method or detail. */
(function (S) {
  const { clamp, clock } = S.engine;
  const jit = (s, seed) => ((Math.floor(s.t / 5) * 7 + seed * 13) % 3) - 1;
  const recent = (s, t0, m) => t0 !== null && t0 !== undefined && s.t - t0 <= m;
  const J = (key, dom, d, text, why, pid) => (s, A) => A.judge(key, dom, d, text, why, pid);
  const tashaBusy = (s) => { const Jo = s.p['403']; return Jo.oneToOne && !Jo.gone && (Jo.floatAt === null || s.t < Jo.floatAt); };

  /* ---------- 401 Ella Marsh: anorexia nervosa, day 4 of refeeding; the phosphorus is falling ---------- */
  const phosTxt = (P) => P.phos.toFixed(1);
  const ella = {
    id: '401', room: '401', name: 'Ella Marsh', short: 'Ella', age: 15, sex: 'F', mrn: '00731450', legal: 'Voluntary (parent consent)',
    look: { skin: '#F4D9C6', shade: '#DBB9A2', lip: '#B97A72', blush: '#EBA79A', iris: '#4E6E8E', head: { w: 50, h: 58, jaw: .2 }, eye: 10.4,
      hair: { style: 'ponytail', color: '#9A6B3E' }, brow: { w: 3, color: '#7E5530' }, body: { w: 62, cloth: 'hoodie' }, extras: ['freckles'], smile: .25, tired: true,
      lines: { calm: `I'm fine. Can I go to my room? I'm cold.`, anxious: `Did they say my number? You can just tell me if it went up.`, drowsy: `My legs feel like sand.`, none: `She doesn't answer.` } },
    bio: `Sophomore, competitive swimmer until this spring. Straight A's. Lives with her mom and dad and a very old beagle named Pancake.`,
    dx: `Anorexia nervosa, refeeding day 4`, reason: `Anorexia nervosa, restricting type. Admitted for bradycardia and orthostatic instability; medical refeeding on the eating disorder track.`,
    hx: [`Restricting since last fall; lost a lot of weight quickly`, `Admitted for a heart rate in the 40s and fainting at swim practice`, `No prior psychiatric admissions`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `Blind weights only (she doesn't see the number)`,
    lines: [`None`], mobility: `Independent; walks on the unit, no exercise`, diet: `Refeeding meal plan, 3 meals and 2 snacks, supervised`,
    init: { phos: 2.3, k: 3.4, ortho: false, labsSeen: false, reported: false, replOrder: false, replAt: null, recheckAt: null, recheckDone: false, recheckSeen: false, mealAt: null, ate: 0, hid: false, mealBy: null, postObs: null, exercise: false, redirected: false, askedWeight: false, told: false, weak: false, gone: false, icu: false, held: false },
    nightVitals: { T: 36.1, HR: 48, SBP: 92, DBP: 58, RR: 14, SpO2: 99, O2: 'Room air', pain: 0 },
    labs: [
      { name: 'Phosphorus', val: 3.8, unit: 'mg/dL', ref: '3.0–4.5', flag: '', t: -2880 },
      { name: 'Phosphorus', val: 2.9, unit: 'mg/dL', ref: '3.0–4.5', flag: 'L', t: -480 },
      { name: 'Potassium', val: 3.6, unit: 'mmol/L', ref: '3.5–5.0', flag: '', t: -480 },
      { name: 'Magnesium', val: 1.8, unit: 'mg/dL', ref: '1.7–2.2', flag: '', t: -480 },
      { name: 'Glucose', val: 72, unit: 'mg/dL', ref: '70–140', flag: '', t: -480 },
    ],
    orders: [
      { t: -5000, text: `Refeeding protocol, day 4. Meal plan as prescribed: meals and snacks supervised by staff, 30 minutes for meals. Supplement drink to replace anything not finished. Blind weights at 06:00, gown only, after voiding.` },
      { t: -5000, text: `Post-meal observation 60 minutes after every meal and snack, in sight of staff; bathroom use supervised during that hour. No exercise on the unit.` },
      { t: -5000, text: `Labs: phosphorus, potassium, magnesium and glucose every morning and at 16:00. Notify provider: phosphorus under 3.0, potassium under 3.5, magnesium under 1.8, HR under 45 awake, new edema or chest symptoms.` },
      { t: -5000, text: `Vital signs with orthostatics every 4 hours. Thiamine 100 mg PO daily. K-Phos Neutral 250 mg PO twice daily (08:00, 17:00).` },
    ],
    notes: [
      { t: -40, author: 'Ben, day RN', text: `Ate about 75% of lunch; supplement for the rest, after a lot of negotiating. HR 48 lying at 12:00, 82 standing; dizzy on standing. Asked twice what her weight was. Ankles a little puffy this afternoon? Says her socks are tight.` },
      { t: -900, author: 'Dr. Adeyemi, child and adolescent psychiatry', text: `Day 3 of refeeding, tolerating the plan with distress. Phosphorus trending down; started scheduled phosphate. Watch closely through day 5, highest risk window.` },
    ],
    io: { intake: `About 75% of meals today, supplement for the rest`, output: `Voiding` },
    report: [
      { text: `Ella Marsh, 15, anorexia, on the refeeding protocol. Day four.`, key: false },
      { text: `Her heart rate was 48 lying down at noon. She got dizzy standing up.`, key: true },
      { text: `Phosphorus was 2.9 this morning, down from 3.8. The four o'clock labs are pending.`, key: true },
      { text: `Her ankles looked a little puffy. She says her socks are tight.`, key: true },
      { text: `She keeps asking what her weight is. We don't tell her.`, key: false },
      { text: `She stands a lot in her room. I've caught her doing wall sits twice.`, key: true },
      { text: `She used to swim. Her coach sent her a card.`, key: false },
    ],
    vitals(s, P) { const lo = Math.max(0, 2.2 - P.phos); return { T: 36.1, HR: Math.round(48 + lo * 18) + jit(s, 1), SBP: 92 + jit(s, 2) * 2, DBP: 58, RR: 14 + (lo > .6 ? 2 : 0), SpO2: 99, O2: 'Room air', pain: 0 }; },
    assess: {
      general: (s, P) => (P.weak ? `Lying flat, too weak to sit up for long. "My legs won't hold me."` : `Hoodie zipped to the chin, sleeves over her hands, standing by the window instead of sitting. ${P.redirected ? 'Sitting now, under a blanket.' : 'Shifting her weight from foot to foot.'}`),
      resp: (s, P) => (P.phos < 1.6 ? `Breathing a little fast and shallow. Lungs clear.` : `Even and unlabored. Clear.`),
      cardiac: (s, P, A) => { const v = A.vitals('401'); P.k.card = s.t; return `HR ${v.HR}, ${P.phos < 1.7 ? 'irregular now, with skipped beats' : 'slow and regular'}. BP ${v.SBP}/${v.DBP}. Hands cold, capillary refill 3 seconds. ${P.phos < 2.2 ? 'Pitting edema at both ankles, worse than the day nurse described.' : 'Slight puffiness at both ankles.'}`; },
      neuro: (s, P) => { P.k.neuro = s.t; return `Alert, oriented. Anxious, especially about food and her weight. Says she's "fine" and wants to go home. Denies thoughts of hurting herself. ${P.phos < 1.7 ? 'New: says her legs feel weak and tingly.' : ''}`; },
      pain: () => `Denies pain. Says she's cold.`,
      skin: () => `Dry skin. Fine downy hair on her arms and back. Cold hands. No marks or injuries.`,
      gi: (s, P) => { P.k.gi = s.t; return `${P.mealAt !== null ? `Dinner: about ${P.ate}%.${P.hid ? ' Half a roll and most of the pasta were found folded in her napkin.' : ''}` : 'Ate about 75% of lunch, supplement for the rest.'} Bowel sounds present. Says she feels "too full" and bloated.`; },
    },
    interventions: [
      { id: 'ortho', label: 'Orthostatic vital signs', cost: 5, avail: (s, P) => !P.ortho, run(s, P, A) { P.ortho = true; P.k.orthoAt = s.t; A.judge('401-ortho', 'assess', 1, `You checked Ella's orthostatic vital signs.`, `In refeeding, orthostatics are part of every vital sign set. A heart rate that jumps when she stands is her heart working too hard for its fuel.`, '401'); const v = A.vitals('401'); return `Lying: HR ${v.HR}, BP ${v.SBP}/${v.DBP}. Standing: HR ${v.HR + 34}, BP ${v.SBP - 12}/${v.DBP - 6}. She grabs the bed rail and says the room went grey for a second.`; } },
      {
        id: 'labs', label: 'Read the 16:00 refeeding labs against her orders', cost: 2, avail: (s, P) => s.t >= 60 && !P.labsSeen,
        run(s, P, A) { P.labsSeen = true; A.judge('401-labs', 'assess', 2, `You read Ella's afternoon labs against the notify parameters in her orders.`, `Phosphorus, potassium and magnesium all under the call thresholds, on day 4 of refeeding: that's the pattern of refeeding syndrome. The protocol tells you to call; the numbers tell you why.`, '401'); return `Phosphorus ${phosTxt(P)} (call under 3.0), potassium 3.3 (call under 3.5), magnesium 1.6 (call under 1.8). Every one is under its call threshold, and the phosphorus has fallen from 3.8 two days ago.`; },
      },
      { id: 'redirect', label: 'Gently redirect the standing and wall sits', cost: 3, avail: (s, P) => !P.redirected, run(s, P, A) { P.redirected = true; A.judge('401-redirect', 'safety', 1, `You redirected Ella's compensatory exercise without shaming her.`, `Exercise burns the calories her heart needs to recover. Name it plainly, offer a seat and a blanket, and keep it matter-of-fact.`, '401'); return `"Hey. I noticed you've been standing a lot. Your heart is still healing, so sitting is part of treatment right now." She sits on the bed. You bring her a warm blanket. She doesn't argue, which you suspect means she's tired.`; } },
      {
        id: 'recheck', label: 'Compare the 19:00 recheck with this afternoon', cost: 2, avail: (s, P) => P.recheckDone && !P.recheckSeen,
        run(s, P, A) { P.recheckSeen = true; const up = P.phos >= 2.4; A.judge('401-recheck', 'judgment', up ? 2 : 1, up ? `You rechecked Ella's electrolytes and confirmed the replacement worked.` : `You rechecked Ella's electrolytes and saw the replacement hadn't caught up.`, `Replacing electrolytes isn't the end of it. The recheck tells you whether the plan worked, and it's what the next shift needs to hear.`, '401'); return up ? `Phosphorus ${phosTxt(P)}, up from 2.1. Potassium 3.7. Magnesium 1.9. Moving the right way. Ankles about the same.` : `Phosphorus ${phosTxt(P)}. Still low. The next call needs to say so.`; },
      },
    ],
    meds: [
      {
        id: '401-kphos', name: 'K-Phos Neutral', dose: '250 mg', route: 'PO', freq: 'Twice daily, 08:00 and 17:00', due: 120,
        checks: (s, P) => [{ label: 'Phosphorus', value: P.labsSeen || s.t >= 60 ? `${phosTxt(P)} at 16:00 (low)` : '2.9 this morning (low)', ok: true }, { label: 'Calories', value: 'None to speak of. She may ask.', ok: null }],
        give(s, P) { P.kAt = s.t; return `K-Phos Neutral 250 mg taken. "Does that have calories?" "No. It's a mineral your heart and muscles need while you're refeeding." She takes it.`; },
        hold(s, P, A) { P.held = true; A.judge('401-kphos-hold', 'meds', -2, `You held Ella's phosphate supplement.`, `Her phosphorus is falling. The scheduled dose is part of the treatment, and holding it makes refeeding syndrome more likely.`, '401'); return 'Held.'; },
      },
      {
        id: '401-repl', name: 'Electrolyte replacement', dose: 'K-Phos 500 mg, KCl 20 mEq, Mg oxide 400 mg', route: 'PO', freq: 'Once, now (new order)', prn: true, available: (s, P) => P.replOrder,
        block: (s, P) => (P.replAt !== null ? 'Given at ' + clock(P.replAt) + '.' : null),
        checks: (s, P) => [{ label: 'Phosphorus', value: phosTxt(P), ok: true }, { label: 'Potassium', value: '3.3', ok: true }, { label: 'Magnesium', value: '1.6', ok: true }],
        give(s, P, A) { P.replAt = s.t; A.judge('401-repl', 'meds', 2, `You gave Ella's electrolyte replacement promptly.`, `Replace the phosphorus, potassium and magnesium, keep feeding, and recheck. Stopping the food isn't the treatment; replacing what the food is using up is.`, '401'); return `All three taken, with a small cup of water. "Is this because I'm eating? Should I eat less?" "No. It's because your body is rebuilding. We give you more of what it's using."`; },
      },
    ],
    talk: (s, P) => (P.weak ? null : P.told ? 'ella_after' : 'ella_talk'),
    sbar: {
      items(s, P) {
        return [
          { id: 'labs', label: `Phosphorus ${s.t >= 60 ? phosTxt(P) : '2.9'}, potassium 3.3, magnesium 1.6, all under call thresholds`, key: true, need: P.labsSeen, lock: 'Read the 16:00 labs' },
          { id: 'trend', label: 'Phosphorus falling: 3.8, then 2.9, now lower', key: true, need: s.t >= 60 },
          { id: 'hr', label: 'HR 48 lying, jumps about 34 on standing, dizzy', key: true, need: P.ortho, lock: 'Take orthostatic vitals' },
          { id: 'edema', label: 'New pitting edema at both ankles', key: true, need: P.k.card !== undefined, lock: 'Assess her heart and circulation' },
          { id: 'weak', label: 'New leg weakness and tingling, irregular pulse', key: true, need: P.phos < 1.7 && recent(s, P.k.neuro, 60), lock: 'Not present' },
          { id: 'ate', label: P.mealAt !== null ? `Ate about ${P.ate}% of dinner` : 'Dinner at 17:00', key: false, need: true },
          { id: 'weight', label: 'Keeps asking for her weight', key: false, need: true },
        ];
      },
      requests: [
        { id: 'replace', label: 'She meets refeeding call criteria. Can we replace her electrolytes, recheck tonight, and decide if she needs cardiac monitoring?' },
        { id: 'hold', label: 'Should we hold her meals until her phosphorus comes up?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'hold') { A.judge('401-sbar-hold', 'judgment', -2, `You suggested holding Ella's meals for a low phosphorus.`, `Underfeeding isn't treatment, and it's exactly what her illness wants. Refeeding continues; the electrolytes get replaced and watched.`, '401'); return `No. Stopping her food is the illness's plan, not ours. What are her actual numbers?`; }
        if (!picked.includes('labs') && !picked.includes('trend')) return s.t < 60 ? `Her afternoon labs come back at four. Call me with them.` : `What were her four o'clock labs?`;
        P.reported = true;
        if (!P.replOrder) { P.replOrder = true; P.recheckAt = s.t + 120; A.addOrder('401', `Now: K-Phos Neutral 500 mg PO, potassium chloride 20 mEq PO, magnesium oxide 400 mg PO. Repeat phosphorus, potassium and magnesium in 2 hours. Continue the meal plan. Vitals with orthostatics every 2 hours tonight; call for HR under 45, irregular pulse or chest symptoms.`); }
        const n = ['hr', 'edema', 'weak'].filter((k) => picked.includes(k)).length;
        A.judge('401-sbar', 'comm', req === 'replace' && n >= 1 ? 2 : 1, `You called Dr. Adeyemi with Ella's refeeding labs.`, `Day 4, three electrolytes under threshold, a slow heart and new edema: that's refeeding syndrome in progress. The call gets replacement, a recheck and a plan for tonight.`, '401');
        return n >= 1 ? `Good call, with all of it. Replace all three now, keep feeding, recheck in two hours. If her pulse goes irregular or she gets weak, she goes to pediatrics on a monitor.` : `Replace all three now and recheck in two hours. Keep feeding her. How's her heart rate, and any swelling?`;
      },
    },
    scene: (s, P) => ({ psych: true, flowers: true, tray: P.mealAt !== null && s.t - P.mealAt < 60 ? (P.ate >= 90 ? 'eaten' : 'full') : 'none', empty: P.gone, emptyText: 'Room empty. Transferred to pediatrics for cardiac monitoring.' }),
    clues: (s, P) => ({
      flowers: `A card from her swim coach: "The pool misses you. Get strong first. Then come back." She's set it face down.`,
      tray: P.hid ? `Her napkin is folded into a neat square. It's heavy. Inside: half a roll and most of the pasta.` : `Her tray. Mostly empty. The supplement bottle too.`,
    }),
    rig: (s, P) => ({ anxious: P.askedWeight && !P.told ? .5 : .3, pale: clamp(.3 + Math.max(0, 2 - P.phos) * .5, 0, 1) }),
    status: (s, P) => (P.gone ? 'gone' : P.phos < 1.6 ? 'urgent' : s.t >= 60 && !P.reported ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.gone) return { tone: P.reported ? 'mixed' : 'bad', title: 'Refeeding syndrome, to pediatrics', text: `Phosphorus ${phosTxt(P)}, an irregular pulse and weak legs. She went to the pediatric floor on a cardiac monitor for IV replacement.${P.reported ? ' The call came, but late.' : ' The afternoon labs were under every call threshold at 16:00.'}` };
      if (P.reported && P.replAt !== null) return { tone: P.hid ? 'mixed' : 'good', title: P.hid ? 'Electrolytes replaced, dinner in a napkin' : 'Replaced, rechecked, refeeding on track', text: `Replacement at ${clock(P.replAt)}${P.recheckSeen ? ', and the recheck showed it working' : ''}. ${P.hid ? 'She ate dinner alone, and half of it went into her napkin.' : `She finished ${P.ate >= 90 ? 'dinner' : 'most of dinner'} with someone beside her.`}` };
      if (P.reported) return { tone: 'mixed', title: 'Called, but the replacement never went in', text: 'The order came. The doses sat on the MAR.' };
      return { tone: 'bad', title: 'Labs under threshold, nobody called', text: `Phosphorus ${phosTxt(P)} and falling at the end of the shift. The night nurse inherits refeeding syndrome in progress.` };
    },
  };

  /* ---------- 403 Jordan Ellis: self-harm after a hard phone call; a contraband shard; the dayroom is watching ---------- */
  const jordan = {
    id: '403', room: '403', name: 'Jordan Ellis', short: 'Jordan', age: 16, sex: 'they/them', mrn: '00852093', legal: 'Voluntary (parent consent)',
    look: { skin: '#C99A72', shade: '#A97C56', lip: '#93574A', blush: '#C98A70', iris: '#2C1E14', head: { w: 52, h: 60, jaw: .35 }, eye: 10, hair: { style: 'shag', color: '#2A1C14' }, brow: { w: 3.6, color: '#1E1510' }, body: { w: 68, cloth: 'tee' }, extras: ['studs'], smile: .2,
      lines: { calm: `It's fine. I'm fine. Can I have my headphones?`, anxious: `Did my dad call? What did he say?`, drowsy: `Tired.`, none: `They don't answer.` } },
    bio: `Junior. Draws comics about a frog detective. Uses the name Jordan and they/them pronouns at school and on the unit. Their legal name is on the chart; their dad doesn't know.`,
    dx: `Depression with self-harm`, reason: `Major depressive disorder. Self-harm (cutting) for a year; a friend showed a school counselor their texts.`,
    hx: [`Depression since 8th grade; outpatient therapy, stopped in the spring`, `Self-harm, mostly forearms; no prior medical treatment for it`, `Legal name Jessica. Uses Jordan, they/them; out at school, not at home`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `58 kg`,
    lines: [`None`], mobility: `Independent`, diet: `Regular`,
    init: { skinChecked: false, cutsFound: false, foundBy: null, wound: false, woundAt: null, woundCheck: false, searched: false, oneToOne: false, floatAt: null, reported: false, second: false, gone: false, outed: false, dadDone: false, contagion: null, peerDone: false, askedName: false },
    nightVitals: { T: 36.8, HR: 84, SBP: 112, DBP: 70, RR: 16, SpO2: 99, O2: 'Room air', pain: 0 },
    labs: [{ name: 'Urine tox', val: 'Negative', unit: '', ref: '', flag: '', t: -4300 }],
    orders: [
      { t: -4300, text: `Self-harm precautions. Observation every 15 minutes. Skin check at the start of every shift, in private, with a second staff member present. Room search on admission and as clinically indicated.` },
      { t: -4300, text: `Sertraline 50 mg PO daily at 08:00. Hydroxyzine 25 mg PO every 6 h as needed, anxiety.` },
      { t: -4300, text: `Use the name Jordan and they/them pronouns with patient and staff. Ask the patient before using either with family.` },
    ],
    notes: [
      { t: -60, author: 'Ben, day RN', text: `Hard phone call with father at lunch; came out of the phone room crying, went to their room for an hour. Wouldn't go to afternoon group. Long sleeves all day. Day shift skin check not done: they were in their room, then in school hour.` },
    ],
    io: { intake: `Skipped lunch`, output: `Voiding` },
    report: [
      { text: `Jordan, they/them, 16. Depression, self-harm. Their dad doesn't know about the name, so careful on the phone.`, key: true },
      { text: `They had a rough call with their dad at lunch. Came out crying and went to their room for an hour.`, key: true },
      { text: `Long sleeves all day, and it's warm in here.`, key: true },
      { text: `I didn't get to their skin check. Sorry.`, key: true },
      { text: `They draw a comic about a frog detective. It's actually funny.`, key: false },
      { text: `They've been hanging out with the younger girls a lot. Showing them their arms, I think.`, key: true },
    ],
    vitals(s, P) { return { T: 36.8, HR: 84 + jit(s, 3) * 2, SBP: 112 + jit(s, 4) * 2, DBP: 70, RR: 16, SpO2: 99, O2: 'Room air', pain: P.cutsFound && !P.wound ? 3 : 0 }; },
    assess: {
      general: (s, P) => `Hood up, headphones on, drawing. Long sleeves pulled over their hands.${P.cutsFound && !P.wound ? ' A spot of blood has come through the left sleeve.' : ''}`,
      resp: () => `Unlabored.`,
      cardiac: (s, P, A) => `HR ${A.vitals('403').HR}, regular.`,
      neuro: (s, P) => { P.k.neuro = s.t; return `Alert, oriented. Flat, quiet, eyes down. "I'm fine." Admits they "had a bad afternoon" after talking to their dad. Denies thoughts of suicide; won't answer about self-harm today: "Can we not."`; },
      pain: (s, P) => (P.cutsFound && !P.wound ? `Says their left arm "stings a little."` : `Denies pain.`),
      skin: (s, P) => (P.skinChecked ? (P.wound ? `Left forearm dressed. Older healed scars on both forearms.` : `Three fresh, shallow cuts on the left forearm from this afternoon, edges together, not gaping, oozing slightly. No signs of infection. Older healed scars on both forearms.`) : `Long sleeves. They pull away when you reach for their arm. A full skin check needs privacy and a second staff member.`),
      gi: () => `Skipped lunch. Says they'll eat dinner "maybe."`,
    },
    interventions: [
      {
        id: 'skin', label: 'Skin check: private, with Tasha present, explained first', cost: 6, avail: (s, P) => !P.skinChecked,
        run(s, P, A) {
          P.skinChecked = true; const first = !P.cutsFound; P.cutsFound = true; if (!P.foundBy) P.foundBy = 'you';
          A.judge('403-skin', 'assess', first ? 2 : 1, first ? `You did Jordan's missed skin check and found fresh self-harm.` : `You did Jordan's skin check.`, `On self-harm precautions, a skin check is part of every shift assessment. A missed one, a hard phone call and long sleeves in a warm room are three reasons to do it now.`, '403');
          return `You explain why, and that you'll go one area at a time. Tasha stands by the door. On the left forearm: three fresh, shallow cuts from this afternoon, edges together, oozing a little. Jordan stares at the wall. "It's not a big deal. They're not deep."`;
        },
      },
      {
        id: 'wound', label: 'Clean and dress the cuts, calmly and without a lecture', cost: 5, avail: (s, P) => P.cutsFound && !P.wound,
        run(s, P, A) { P.wound = true; P.woundAt = s.t; A.judge('403-wound', 'safety', 1, `You cared for Jordan's wounds matter-of-factly.`, `Wound care is care, not punishment and not a big emotional scene. Calm and kind keeps the door open; drama or disgust shuts it.`, '403'); return `Saline, gauze, a light dressing. You ask if it hurts, and what happened right before. "My dad called me Jessica like six times on purpose." You nod. "That sounds like it really hurt." They don't answer, but they don't pull away either.`; },
      },
      {
        id: 'search', label: 'Search their room and belongings with Tasha', cost: 6, avail: (s, P) => !P.searched,
        run(s, P, A) { P.searched = true; A.judge('403-search', 'safety', 2, `You searched Jordan's room and removed what they'd used.`, `New self-harm on the unit means there's an object on the unit. Find it, or it gets used again, or shared.`, '403'); return P.cutsFound ? `Inside a sneaker, under the insole: a sharp piece of broken plastic from a dinner tray. Removed and reported. Jordan watches from the doorway. "Are you going to take my sketchbook too?" You don't.` : `With Tasha, explaining why. Inside a sneaker, under the insole: a sharp piece of broken plastic from a dinner tray. Removed. Jordan says nothing.`; },
      },
      { id: 'one', label: 'Start line-of-sight observation', cost: 2, avail: (s, P) => !P.oneToOne, run(s, P, A) { P.oneToOne = true; P.floatAt = s.t + 45; if (P.cutsFound) A.judge('403-one', 'safety', 2, `You increased Jordan's observation after new self-harm.`, `Self-harm on the unit is a reason to close the gap until the team can reassess. Get the order and tell the psychiatrist why.`, '403'); else A.judge('403-one', 'judgment', 0, `You increased Jordan's observation without knowing why yet.`, `Never wrong when you're worried, but know what you're seeing so you can explain it.`, '403'); return `Tasha moves a chair to the doorway of the dayroom where she can see Jordan. That's Tasha off the hall until Nova finds a float.`; } },
      {
        id: 'plan', label: 'Recheck the dressing and go over their coping plan', cost: 4, avail: (s, P) => P.wound && !P.woundCheck && s.t - P.woundAt >= 45,
        run(s, P, A) { P.woundCheck = true; A.judge('403-plan', 'judgment', 1, `You rechecked Jordan's wounds and their coping plan later in the shift.`, `Follow-up is where safety plans get real: the dressing is dry, and they named what they'll do next time instead. Check back; don't just check off.`, '403'); return `Dressing dry, no new bleeding. You go over their coping plan together. Next time the urge hits: tell staff, music, draw the frog. They add one: "Ask for the phone room door to be left open." It's a good one.`; },
      },
    ],
    meds: [
      { id: '403-hydrox', name: 'Hydroxyzine', dose: '25 mg', route: 'PO', freq: 'Every 6 h as needed, anxiety', prn: true, checks: (s, P) => [{ label: 'Anxiety', value: P.cutsFound ? 'Upset after the phone call' : 'Quiet, withdrawn', ok: P.cutsFound }], give(s, P, A) { A.judge('403-hydrox', 'meds', P.cutsFound ? 1 : 0, `You offered Jordan hydroxyzine for anxiety.`, P.cutsFound ? `Reasonable after a hard afternoon, alongside talking, not instead of it.` : `Fine as an offer. Medication isn't a substitute for finding out what happened.`, '403'); return `Hydroxyzine 25 mg taken.`; } },
    ],
    talk: (s, P) => (P.gone ? null : !P.askedName ? 'jor_talk' : P.cutsFound ? 'jor_after' : 'jor_quiet'),
    sbar: {
      items(s, P) {
        return [
          { id: 'cuts', label: 'Fresh, shallow self-harm cuts on the left forearm from this afternoon', key: true, need: P.cutsFound, lock: 'Do their skin check' },
          { id: 'shard', label: 'Broken tray plastic found in their shoe', key: true, need: P.searched, lock: 'Search their room' },
          { id: 'call', label: 'Upsetting call with their father at lunch', key: true, need: true },
          { id: 'contagion', label: 'Showing their arms to younger patients', key: true, need: P.contagion !== null, lock: 'Not seen yet' },
          { id: 'obs', label: 'On line-of-sight observation', key: true, need: P.oneToOne, lock: 'Not started' },
          { id: 'si', label: 'Denies suicidal thoughts', key: false, need: recent(s, P.k.neuro, 120), lock: 'Ask them' },
          { id: 'margin', label: 'Wrote "nobody would notice" in their sketchbook, half erased', key: true, need: P.k.margin !== undefined, lock: 'Look around their room' },
          { id: 'frog', label: 'Draws a comic about a frog detective', key: false, need: true },
        ];
      },
      requests: [
        { id: 'obs', label: 'New self-harm on the unit. Can you order line-of-sight observation and see them tonight?' },
        { id: 'privs', label: 'Should we take away their phone time as a consequence?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'privs') { A.judge('403-sbar-privs', 'judgment', -2, `You suggested punishing Jordan for self-harm.`, `Self-harm is a symptom, not misbehavior. Punishment teaches hiding. Safety measures, yes; consequences, no.`, '403'); return `No. We don't punish self-harm; we make it safer and figure out what drove it. What did you find?`; }
        if (!picked.includes('cuts')) return `What are you actually seeing? Have you done their skin check?`;
        P.reported = true;
        if (!P.oneToOne) { P.oneToOne = true; P.floatAt = s.t + 45; }
        A.addOrder('403', `Line-of-sight observation until psychiatry reassesses. Room search. Wound care daily and as needed. Psychiatrist to see tonight; family meeting to include the patient's preferences about name and pronouns.`);
        A.judge('403-sbar', 'comm', picked.includes('shard') || picked.includes('call') ? 2 : 1, `You reported Jordan's new self-harm to the psychiatrist.`, `New self-harm on the unit changes the plan: observation, the object, the trigger. The psychiatrist also needs to hear about the call with dad before the family meeting.`, '403');
        return picked.includes('shard') ? `Thank you, and good that you found the object. Line-of-sight until I see them at six. I'll call their dad myself about the family meeting, and I'll follow their lead on the name.` : `Line-of-sight until I see them. Did anyone search the room? There's something on the unit they used.`;
      },
    },
    scene: (s, P) => ({ psych: true, headphones: true, papers: true, tray: 'none', empty: P.gone, emptyText: 'Room empty. Sent to the ED for sutures.' }),
    clues: (s, P) => ({
      headphones: `Wired headphones, the cord removed by staff on admission. The music's playing through the little speaker instead: something sad with a banjo.`,
      papers: `A comic page: a frog in a trench coat interviewing a nervous snail. In the margin, small, in pencil: "nobody would notice." It's been half erased.`,
    }),
    onClue(id, s, P) { if (id === 'papers') P.k.margin = s.t; },
    rig: (s, P) => ({ anxious: P.second ? .9 : .4 }),
    status: (s, P) => (P.gone ? 'gone' : P.cutsFound && !P.wound ? 'watch' : !P.skinChecked && s.t >= 30 ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.gone) return { tone: 'bad', title: 'Deeper self-harm, sent for sutures', text: `The piece of plastic was still in their shoe. The second time was deeper and needed the ED. The missed skin check, the call and the long sleeves were all in report.` };
      if (P.searched && P.cutsFound && P.reported) return { tone: 'good', title: 'Found, cared for, and safer', text: `Wounds dressed, the object found, observation closed up, and the psychiatrist heard about the call with dad.${P.outed ? ' Their dad heard their name from you before they were ready, though.' : ''}` };
      if (P.cutsFound && (P.searched || P.oneToOne)) return { tone: 'mixed', title: 'Safer, but the team is behind', text: `${P.searched ? 'The object is gone.' : 'Watched closely, but the object is still somewhere.'} ${P.reported ? '' : 'The psychiatrist never heard about the new self-harm.'}` };
      if (P.cutsFound) return { tone: 'mixed', title: 'Found, not made safer', text: `The cuts were found${P.foundBy === 'tasha' ? ' by Tasha, from a spot of blood on a sleeve' : ''}, but the room wasn't searched and observation didn't change.` };
      return { tone: 'bad', title: 'Nobody looked', text: `No skin check all day. Long sleeves, a hard call, and no skin check.` };
    },
  };

  /* ---------- 405 Jaylen Webb: first haloperidol at 14:30; acute dystonia that everyone calls acting out ---------- */
  const dysTxt = (d) => (d < .8 ? 'neck stiff, pulling a little to the left' : d < 1.8 ? 'neck twisted hard to the left, eyes rolling up' : d < 2.5 ? 'neck locked to the side, eyes stuck upward, jaw clenched, drooling' : 'locked neck and jaw, eyes fixed upward, a thin, high sound when he breathes in');
  const marcus = {
    id: '405', room: '405', name: 'Jaylen Webb', short: 'Jaylen', age: 14, sex: 'M', mrn: '00918266', legal: 'Voluntary (parent consent)',
    look: { skin: '#5E3B27', shade: '#47291A', lip: '#4A2419', blush: '#8A4A36', iris: '#1E130C', head: { w: 52, h: 58, jaw: .3 }, eye: 10.6, hair: { style: 'curlyshort', color: '#120C09' }, brow: { w: 3.6, color: '#0F0A08' }, body: { w: 64, cloth: 'sun' }, extras: [], smile: .4,
      lines: { calm: `Is it dinner yet? I'm starving.`, anxious: `My neck! I can't — I'm not doing it!`, drowsy: `Mm. That shot made me so sleepy.`, none: `He doesn't answer.` } },
    bio: `Eighth grader. Plays snare drum in the school band. Wants to be a paleontologist. His little sister Zuri packed him a stuffed T. rex.`,
    dx: `DMDD and ADHD, aggression at home`, reason: `Disruptive mood dysregulation disorder and ADHD. Admitted after punching through a window at home during an argument.`,
    hx: [`ADHD since age 7, on methylphenidate`, `Explosive outbursts most days for two years`, `Never had an antipsychotic before today`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `52 kg`,
    lines: [`None`], mobility: `Independent`, diet: `Regular`,
    init: { dys: 0, postIM: false, airway: false, dphAt: null, reassessed: false, reported: false, secl: false, haloAgain: null, believed: null, icu: false, gone: false, docRev: null, f2fCalled: null, f2fAt: null, momCalled: null, benAsked: null, selfCharted: false },
    nightVitals: { T: 36.9, HR: 82, SBP: 114, DBP: 68, RR: 16, SpO2: 99, O2: 'Room air', pain: 0 },
    labs: [{ name: 'Urine tox', val: 'Negative', unit: '', ref: '', flag: '', t: -2000 }],
    orders: [
      { t: -30, text: `Haloperidol 5 mg IM once, given 14:30 for imminent danger (threw a chair at staff after verbal de-escalation and an oral PRN were refused).` },
      { t: -30, text: `After any IM antipsychotic: vital signs, sedation and airway check every 15 minutes for the first hour, then every hour for 4 hours.` },
      { t: -5000, text: `Unit policy, minors: seclusion or restraint only for imminent danger, after less restrictive measures fail. Each episode needs a provider order (ages 9 to 17: up to 2 hours), a face-to-face evaluation by the provider within 1 hour, a restraint or seclusion record by the nurse who was there, and prompt notification of the parent or guardian. A hold to give an injection is a restraint.` },
      { t: -2000, text: `Methylphenidate ER 36 mg PO daily at 08:00. Diphenhydramine 50 mg IM or PO once as needed for acute dystonia or other movement side effects; notify psychiatrist. Haloperidol 5 mg IM once as needed for imminent danger.` },
    ],
    notes: [
      { t: -20, author: 'Ben, day RN', text: `14:20 threw a chair at staff after his math tutor left. Refused oral PRN. 14:30 haloperidol 5 mg IM given. 14:45 asleep, easily roused, vitals stable. Checks every 15 min done to 15:00 per Tasha. Next check hourly.` },
    ],
    io: { intake: `Ate lunch`, output: `Voiding` },
    report: [
      { text: `Jaylen Webb, 14, DMDD and ADHD. Punched through a window at home.`, key: false },
      { text: `He threw a chair at 2:20. We gave him haloperidol 5 IM at 2:30. He's been asleep since.`, key: true },
      { text: `Took three of us to hold him for the shot. He fought it.`, key: true },
      { text: `His mom said he's never had Haldol before.`, key: true },
      { text: `His post-shot checks are hourly now. Next one's at 3:30.`, key: true },
      { text: `He's been testing staff all day. Loves to get a reaction out of you.`, key: false },
      { text: `He's obsessed with dinosaurs. Ask him about the T. rex.`, key: false },
    ],
    vitals(s, P) { const d = P.dys; return { T: 36.9, HR: Math.round(82 + d * 12) + jit(s, 5), SBP: Math.round(114 + d * 6) + jit(s, 6) * 2, DBP: 68, RR: Math.round(16 + d * 2), SpO2: d >= 2.5 ? 95 : 99, O2: 'Room air', pain: d > .5 ? Math.min(8, Math.round(3 + d * 2)) : 0 }; },
    assess: {
      general: (s, P) => (P.dys > 0 && P.dphAt === null ? `Sitting rigid on the bed edge, ${dysTxt(P.dys)}. Frightened. He grabs your sleeve.` : P.dphAt !== null ? `Lying down, drowsy, neck loose. Holding the stuffed T. rex.` : s.t < 30 ? `Asleep on top of the covers, rousable to his name.` : `Awake, groggy, eating a granola bar.`),
      resp: (s, P) => (P.dys >= 2.5 && P.dphAt === null ? `A faint, high-pitched sound on breathing in. Struggling to swallow his saliva.` : `Unlabored. No stridor.`),
      cardiac: (s, P, A) => `HR ${A.vitals('405').HR}, regular.`,
      neuro: (s, P) => { P.k.neuro = s.t; return P.dys > 0 && P.dphAt === null ? `Alert and oriented, and scared. Can't turn his head back to center or look down. Says he isn't doing it on purpose. Speech thick from the jaw. Started about ${clock(35)}, 65 minutes after his first-ever haloperidol.` : P.dphAt !== null ? `Drowsy from the diphenhydramine. Neck and eyes move freely. Embarrassed.` : `Groggy but oriented. Normal movements.`; },
      pain: (s, P) => (P.dys > .5 && P.dphAt === null ? `Neck and jaw "really hurt," ${Math.min(8, Math.round(3 + P.dys * 2))}/10.` : `Denies pain.`),
      skin: () => `Bandaged right knuckles from the window. Healing well.`,
      gi: (s, P) => (P.dys >= 1.8 && P.dphAt === null ? `Can't swallow well; drooling.` : `Hungry. Voiding.`),
    },
    interventions: [
      { id: 'postim', label: 'Post-IM check: vitals, sedation, airway', cost: 4, avail: (s, P) => !P.postIM, run(s, P, A) { P.postIM = true; A.judge('405-postim', 'assess', s.t <= 45 ? 1 : 0, `You did Jaylen's post-IM check${s.t <= 45 ? ' on time' : ', late'}.`, `After emergency IM medication, the checks are scheduled for a reason: oversedation, airway, and movement side effects show up in the first hours.`, '405'); const v = A.vitals('405'); return P.dys > 0 ? `HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}%. Awake. And: ${dysTxt(P.dys)}.` : `HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}%. Rousable, oriented, airway clear. Normal movements so far.`; } },
      { id: 'docrev', label: 'Review the 14:30 emergency medication record', cost: 3, avail: (s, P) => P.docRev === null,
        run(s, P, A) { P.docRev = s.t; A.judge('405-docrev', 'judgment', 1, `You checked the 14:30 emergency medication record for Jaylen.`, `When you take over a patient who was held or medicated in an emergency, check the record is complete: it's your patient now, and the one-hour clock may still be running.`, '405');
          return `The reason is charted: he threw a chair at staff after verbal de-escalation and an oral PRN were refused. But the three-person hold isn't charted as a restraint. There's no face-to-face evaluation; for a 14:30 hold it's due by 15:30. And nothing says his mom was told.`; } },
      { id: 'ben', label: `Ask Ben (day RN) to chart the 14:30 hold as a restraint before he leaves`, cost: 2, avail: (s, P) => P.docRev !== null && P.benAsked === null && !P.selfCharted && s.t <= 45,
        run(s, P, A) { P.benAsked = s.t; A.judge('405-ben', 'comm', 1, `You asked Ben to chart the hold he was part of.`, `The restraint record comes from someone who was there: who held, how, for how long, any injury, and when it ended. Report gives you the story; it doesn't let you chart it as your own observation.`, '405'); A.note('405', 'Ben, day RN', `Late entry for 14:28. Three-person standing hold (Ben RN, Tasha MHW, security officer Dale) for haloperidol 5 mg IM, left thigh, after he threw a chair at staff; verbal de-escalation and oral PRN refused first. Hold about 90 seconds, ended when the injection was given. No injuries to patient or staff. Charted as a restraint episode.`); return `Ben groans, then nods. "You're right. It was a hold. I'll do it now, before I go." Five minutes later his late entry is in.`; } },
      { id: 'selfchart', label: 'Chart the 14:30 hold yourself, from report', cost: 4, avail: (s, P) => P.docRev !== null && P.benAsked === null && !P.selfCharted,
        run(s, P, A) { P.selfCharted = true; A.judge('405-selfchart', 'comm', -1, `You charted a restraint you didn't witness.`, `You weren't there. The nurse who was part of the hold documents it; you can make sure they do. If they've gone home, they call in a late entry.`, '405'); return 'You write it up from what Ben told you in report. It reads fine. It just isn\'t yours to write.'; } },
      { id: 'mom', label: 'Call his mom: tell her about the hold and the medication', cost: 5, avail: (s, P) => P.docRev !== null && P.momCalled === null,
        run(s, P, A) { P.momCalled = s.t; A.judge('405-mom', 'comm', 1, `You told Jaylen's mom about the hold and the emergency medication.`, `For a minor, the parent or guardian hears about any restraint, seclusion or emergency medication promptly, from the unit, not from their kid days later.`, '405'); return `Ms. Webb is quiet, then: "He's never had that kind before. Is he okay?" You tell her he's sleeping and being checked often. "His uncle had a reaction to one of those once. His neck locked up." You write it down.`; } },
      { id: 'airway', label: 'Check airway and swallowing: listen for stridor', cost: 2, avail: (s, P) => P.dys > 0 && P.dphAt === null && !P.airway, run(s, P, A) { P.airway = true; A.judge('405-airway', 'safety', 1, `You checked Jaylen's airway during his dystonia.`, `Dystonia can reach the throat. Stridor or trouble swallowing makes it an airway emergency.`, '405'); return P.dys >= 2.5 ? `A thin stridor on inspiration. He can't swallow. This is getting into his airway.` : `No stridor yet. He's swallowing with effort.`; } },
      { id: 'seclude', label: 'Seclusion: he\'s acting out for attention', cost: 6, avail: (s, P) => P.dys > 0 && P.dphAt === null && !P.secl, run(s, P, A) { P.secl = true; A.judge('405-seclude', 'safety', -3, `You secluded Jaylen during an acute dystonic reaction.`, `He wasn't a danger; he was having a known, treatable side effect, alone and frightened. Seclusion is only for imminent danger, and this delayed the antidote.`, '405'); return `Staff walk him to the seclusion room. He's crying, head twisted, trying to tell you something through a clenched jaw.`; } },
      { id: 'reassess', label: 'Reassess him after the diphenhydramine', cost: 3, avail: (s, P) => P.dphAt !== null && !P.reassessed && s.t - P.dphAt >= 15, run(s, P, A) { P.reassessed = true; A.judge('405-reassess', 'judgment', 2, `You reassessed Jaylen after the diphenhydramine.`, `Did it work? IM diphenhydramine should loosen dystonia within about 15 to 30 minutes. It can come back as the dose wears off, which is why the plan needs a scheduled dose too.`, '405'); return `Neck straight, eyes moving freely, swallowing fine. Drowsy. "Is it going to happen again?" Reasonable question.`; } },
    ],
    meds: [
      {
        id: '405-dph', name: 'Diphenhydramine', dose: '50 mg', route: 'IM', freq: 'Once as needed, acute dystonia', prn: true,
        block: (s, P) => (P.dphAt !== null ? 'Given at ' + clock(P.dphAt) + '.' : null),
        checks: (s, P) => [{ label: 'Dystonia', value: P.dys > 0 ? dysTxt(P.dys) : 'None seen', ok: P.dys > 0 }, { label: 'Route', value: P.dys >= 1.8 ? 'IM: he can\'t swallow safely' : 'IM or PO', ok: null }, { label: 'Dose', value: '1 mg/kg, max 50 mg; he weighs 52 kg', ok: true }],
        give(s, P, A) { P.dphAt = s.t; if (P.dys <= 0) { A.judge('405-dph', 'meds', -1, `You gave Jaylen diphenhydramine without signs of dystonia.`, `It's the antidote, not a sedative.`, '405'); return 'Diphenhydramine 50 mg IM given.'; } A.judge('405-dph', 'meds', 2, `You treated Jaylen's acute dystonia with diphenhydramine.`, `Acute dystonia after a first dose of haloperidol, in a young male: the textbook case. An anticholinergic like diphenhydramine or benztropine reverses it, usually within minutes to half an hour.`, '405'); return `Diphenhydramine 50 mg IM in the thigh. You tell him what it's for. "This medicine undoes the reaction. It should loosen up soon, and you'll get sleepy."`; },
      },
      {
        id: '405-halo', name: 'Haloperidol', dose: '5 mg', route: 'IM', freq: 'Once as needed, imminent danger', prn: true,
        block: (s, P) => (P.haloAgain !== null ? 'Given at ' + clock(P.haloAgain) + '.' : null),
        checks: (s, P) => [{ label: 'Imminent danger', value: P.dys > 0 ? 'No: rigid and frightened' : 'No: groggy, calm', ok: false }, { label: 'Last dose', value: '14:30, his first ever', ok: false }],
        give(s, P, A) { P.haloAgain = s.t; P.dys = Math.min(3, P.dys + .8); A.judge('405-halo', 'meds', -3, `You gave Jaylen more haloperidol.`, P.dys > .8 ? `The dystonia was caused by haloperidol. More of it makes it worse.` : `He wasn't an imminent danger. Emergency medication isn't for being difficult.`, '405'); return 'Haloperidol 5 mg IM given.'; },
      },
    ],
    talk: (s, P) => (P.icu ? null : P.dys > 0 && P.dphAt === null ? 'mar_dys' : P.dphAt !== null ? 'mar_after' : 'mar_talk'),
    sbar: {
      items(s, P) {
        return [
          { id: 'dys', label: `Acute dystonia: ${dysTxt(Math.max(P.dys, .5))}`, key: true, need: P.dys > 0 && recent(s, P.k.neuro, 60), lock: 'Assess his mental status and movements' },
          { id: 'halo', label: 'First-ever haloperidol 5 mg IM at 14:30', key: true, need: true },
          { id: 'stridor', label: P.dys >= 2.5 ? 'Stridor, can\'t swallow' : 'No stridor', key: P.dys >= 2.5, need: P.airway, lock: 'Check his airway' },
          { id: 'dph', label: P.dphAt !== null ? `Diphenhydramine 50 mg IM at ${clock(P.dphAt)}` : 'Diphenhydramine PRN', key: P.dphAt !== null, need: P.dphAt !== null, lock: 'Not given' },
          { id: 'better', label: 'Resolved on reassessment', key: true, need: P.reassessed, lock: 'Reassess him' },
          { id: 'dino', label: 'Loves dinosaurs', key: false, need: true },
        ];
      },
      requests: (s, P) => [
        { id: 'eps', label: 'He had an acute dystonic reaction to the haloperidol. Can we schedule an anticholinergic for the next 48 hours and avoid more haloperidol?' },
        { id: 'more', label: 'He\'s acting out again. Can I give another dose of haloperidol?' },
        ...(P.docRev !== null && P.f2fCalled === null ? [{ id: 'f2f', label: 'He was held by three staff for the 14:30 IM. That hold was a restraint: he needs an order for it and your face-to-face, by 15:30.' }] : []),
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'f2f') { P.f2fCalled = s.t; if ((picked.includes('dys') || picked.includes('dph')) && !P.reported) { P.reported = true; A.addOrder('405', `Diphenhydramine 25 mg PO every 6 hours, scheduled, for 48 hours. No further haloperidol; allergy list updated: haloperidol (acute dystonia). Call for any stridor or recurrence.`); } A.judge('405-sbar-f2f', 'comm', s.t <= 25 ? 2 : 1, `You called Dr. Adeyemi for the face-to-face after Jaylen's hold.`, `A hold to give medication is a restraint. The provider has to see him in person within one hour of it starting, even after it's over.`, '405'); return s.t <= 30 ? `You're right, nobody called me. I'm on the unit; I'll see him in ten minutes.` : `That's past the hour already. I'll see him now and document why it's late.`; }
        if (req === 'more') { A.judge('405-sbar-more', 'judgment', -2, `You asked for more haloperidol for Jaylen's dystonia.`, `Twisting, a fixed gaze and a locked jaw after a first dose of haloperidol aren't behavior. They're the side effect.`, '405'); return `Describe exactly what he's doing. That sounds like dystonia, not agitation. Give the diphenhydramine.`; }
        if (req !== 'eps' && !picked.includes('dys') && !picked.includes('dph')) return `Okay. Is anything new since the shot?`;   // asking for the anticholinergic is itself the report
        P.reported = true;
        A.addOrder('405', `Diphenhydramine 25 mg PO every 6 hours, scheduled, for 48 hours. No further haloperidol; allergy list updated: haloperidol (acute dystonia). Call for any stridor or recurrence.`);
        if (P.dphAt === null) { A.judge('405-sbar', 'comm', 1, `You called about Jaylen's dystonia.`, `Right call. The antidote was already on his PRN list; giving it first, then calling, saves time.`, '405'); return `That's dystonia. Give the IM diphenhydramine now; it's on his PRNs. Call me right away if he has any stridor.`; }
        A.judge('405-sbar', 'comm', 2, `You reported Jaylen's dystonic reaction and its treatment.`, `What happened, what you gave, whether it worked, and a plan so it doesn't come back tonight: scheduled anticholinergic, and haloperidol on his allergy list.`, '405');
        return `Good catch, and good that you treated it. Scheduled diphenhydramine for 48 hours, and I'm adding haloperidol to his allergy list. I'll call his mom.`;
      },
    },
    scene: (s, P) => ({ psych: true, dino: true, tray: 'none', empty: P.icu, emptyText: 'Room empty. Sent to the ED for airway management.' }),
    clues: (s, P) => ({ dino: `A stuffed T. rex in a hand-knit scarf. A tag in a kid's handwriting: "for Jaylen so he isn't scared. love Zuri."` }),
    rig: (s, P) => ({ anxious: P.dys > 0 && P.dphAt === null ? clamp(.5 + P.dys * .2, 0, 1) : 0, tremor: P.dys > 0 && P.dphAt === null ? clamp(P.dys * .3, 0, 1) : 0 }),
    status: (s, P) => (P.icu ? 'gone' : P.dys >= 1.2 && P.dphAt === null ? 'urgent' : P.dys > 0 && P.dphAt === null ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Dystonia reached his airway', text: `Stridor and a locked jaw sent him to the ED for airway support. It started at ${clock(35)}, and everyone said he was acting out.` };
      if (P.dphAt !== null && P.dphAt - 35 <= 40) return { tone: P.secl || P.haloAgain !== null ? 'mixed' : 'good', title: 'Dystonia recognized and reversed', text: `Diphenhydramine at ${clock(P.dphAt)}${P.reassessed ? ', reassessed and loosened' : ''}.${P.reported ? ' Haloperidol is on his allergy list now.' : ' The psychiatrist was never told, so haloperidol is still a PRN.'}${P.secl ? ' He spent part of it in seclusion first.' : ''}` };
      if (P.dphAt !== null) return { tone: 'mixed', title: 'Reversed, eventually', text: `Diphenhydramine at ${clock(P.dphAt)}, after ${P.dphAt - 35} minutes of a twisted neck and a lot of people calling it behavior.` };
      if (P.dys > 0) return { tone: 'bad', title: 'Still dystonic at the end of the shift', text: `His neck and eyes were locked for hours. The antidote was on his PRN list the whole time.` };
      return { tone: 'good', title: 'Monitored after his IM dose', text: 'No side effects showed.' };
    },
  };

  /* ---------- 407 Kayla Ruiz: depression and SI; she asks you to keep a secret; her mom's boyfriend is on the visitor list ---------- */
  const kayla = {
    id: '407', room: '407', name: 'Kayla Ruiz', short: 'Kayla', age: 16, sex: 'F', mrn: '00640381', legal: 'Voluntary (parent consent)',
    look: { skin: '#C89A72', shade: '#A97B54', lip: '#93534A', blush: '#CC8A70', iris: '#2A1A10', head: { w: 52, h: 59, jaw: .3 }, eye: 10.2, hair: { style: 'long', color: '#1E1410' }, brow: { w: 3.4, color: '#160F0B' }, body: { w: 66, cloth: 'grey' }, extras: ['hoops'], smile: .15,
      lines: { calm: `Is my mom coming tonight? Is... is anybody else coming?`, anxious: `Please don't make me go out there.`, drowsy: `I didn't sleep.`, none: `She doesn't answer.` } },
    bio: `Junior. Goalkeeper on the soccer team until she quit in the spring. Works at a smoothie shop. Lives with her mom Diane, her brother Gabe (9), and her mom's boyfriend Rick, who moved in eight months ago.`,
    dx: `Major depression with suicidal thoughts`, reason: `Major depressive disorder. Told a teacher she wanted to die; passive suicidal thoughts for months.`,
    hx: [`Depression since winter; grades dropped, quit soccer`, `Asked her mom for a lock on her bedroom door in the spring`, `No prior self-harm or attempts`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `56 kg`,
    lines: [`None`], mobility: `Independent`, diet: `Regular`,
    init: { disclosed: false, promised: false, deferredAt: null, responded: null, reported: false, reportAt: null, psychTold: false, restrict: false, visit: null, rickIn: false, held: false, checkedBack: false, shaken: false },
    nightVitals: { T: 36.8, HR: 90, SBP: 108, DBP: 66, RR: 16, SpO2: 99, O2: 'Room air', pain: 0 },
    labs: [{ name: 'Urine hCG', val: 'Negative', unit: '', ref: '', flag: '', t: -3000 }],
    orders: [
      { t: -3000, text: `Suicide precautions, observation every 15 minutes. Fluoxetine 20 mg PO daily at 08:00. Hydroxyzine 25 mg PO every 6 h as needed, anxiety.` },
      { t: -3000, text: `Visitors per parent's list: Diane Ruiz (mother), Rick Dawson (mother's partner). Visiting 18:30–19:30.` },
    ],
    notes: [
      { t: -50, author: 'Ben, day RN', text: `Quiet, in her room most of the day. Asked twice who was on her visitor list; when told mom and Rick, went back to her room and didn't come out for dinner prep group. Sleeps in her clothes, hoodie zipped.` },
    ],
    io: { intake: `About half of lunch`, output: `Voiding` },
    report: [
      { text: `Kayla Ruiz, 16, depression. Told a teacher she wanted to die.`, key: false },
      { text: `She asked me twice who's on her visitor list tonight. When I said her mom and Rick, she went to her room.`, key: true },
      { text: `Her mom told intake she asked for a lock on her bedroom door this spring. They thought it was a teenager privacy thing.`, key: true },
      { text: `She sleeps in her clothes, hoodie zipped up.`, key: true },
      { text: `She works at a smoothie shop. Ask her for the secret menu.`, key: false },
    ],
    vitals(s, P) { return { T: 36.8, HR: (P.shaken ? 104 : 88) + jit(s, 7) * 2, SBP: 108 + jit(s, 8) * 2, DBP: 66, RR: 16, SpO2: 99, O2: 'Room air', pain: 0 }; },
    assess: {
      general: (s, P) => (P.shaken ? `On the bathroom floor with her knees up, shaking.` : `Hoodie zipped to the chin, sitting on the bed facing the door. Startles when the hall door buzzes.`),
      resp: () => `Unlabored.`,
      cardiac: (s, P, A) => `HR ${A.vitals('407').HR}, regular.`,
      neuro: (s, P) => { P.k.neuro = s.t; return `Alert, oriented. Mood "tired." Constricted, anxious, watchful. Passive wish to be dead, "sometimes, at night"; no plan, no intent. Hypervigilant: tracks every door.${P.disclosed ? ' Since telling you, she cries off and on, but she looks at you when she talks now.' : ''}`; },
      pain: () => `Denies pain.`,
      skin: () => `No marks or injuries.`,
      gi: () => `Eating about half her meals.`,
    },
    interventions: [
      { id: 'cps', label: 'Call the child abuse hotline and make the report yourself', cost: 8, avail: (s, P) => P.disclosed && !P.reported, run(s, P, A) { P.reported = true; P.reportAt = s.t; A.judge('407-cps', 'safety', 2, `You made a mandated report for Kayla.`, `A disclosure of sexual abuse by a minor is reasonable suspicion. The duty to report is yours personally: tell the team too, but telling them doesn't replace your report. Phone now; a written report follows within your state's deadline (36 hours in California).`, '407'); A.log('407', 'Child abuse hotline report made. Her words documented exactly as she said them.', 'act'); return `You call from the conference room. You give her words exactly, the people involved, and tonight's visitor list. The intake worker gives you a reference number and says: "Keep him away from her. Your team decides about mom. A worker will contact the family."`; } },
      { id: 'checkback', label: 'Check back in with Kayla after the report', cost: 4, avail: (s, P) => P.reported && !P.checkedBack && s.t - P.reportAt >= 15, run(s, P, A) { P.checkedBack = true; A.judge('407-checkback', 'judgment', 1, `You checked back in with Kayla after the report.`, `Telling is terrifying. Checking back shows her that telling the truth didn't make adults disappear, and it's your next suicide risk check.`, '407'); return `She's on her bed with the hood down for the first time today. "Is he coming tonight?" ${P.restrict ? '"No. He isn\'t allowed on the unit."' : '"I\'m making sure he doesn\'t."'} You ask how she's doing with the dark thoughts. "Quieter," she says. "Weird."`; } },
    ],
    meds: [
      { id: '407-hydrox', name: 'Hydroxyzine', dose: '25 mg', route: 'PO', freq: 'Every 6 h as needed, anxiety', prn: true, checks: (s, P) => [{ label: 'Anxiety', value: P.shaken || P.disclosed ? 'Shaking, tearful' : 'Watchful, tense', ok: true }], give(s, P) { return `Hydroxyzine 25 mg taken.`; } },
    ],
    talk: (s, P) => (P.disclosed ? (P.reported ? 'kay_safe' : 'kay_wait') : P.deferredAt !== null && s.t - P.deferredAt < 45 ? 'kay_later' : 'kay_talk'),
    sbar: {
      items(s, P) {
        return [
          { id: 'disc', label: 'Disclosed sexual abuse by her mother\'s partner, Rick Dawson', key: true, need: P.disclosed, lock: 'Talk with her' },
          { id: 'cps', label: 'Child abuse hotline report made, reference number in the chart', key: true, need: P.reported, lock: 'Make the report' },
          { id: 'visit', label: 'Rick is on tonight\'s visitor list, 18:30', key: true, need: true },
          { id: 'si', label: 'Passive wish to be dead, no plan', key: true, need: recent(s, P.k.neuro, 120), lock: 'Assess her mood and safety' },
          { id: 'lock', label: 'Asked for a lock on her bedroom door this spring', key: true, need: true },
          { id: 'smoothie', label: 'Works at a smoothie shop', key: false, need: true },
        ];
      },
      requests: [
        { id: 'restrict', label: 'She disclosed sexual abuse by her mom\'s partner. Can we stop his visits tonight, and plan how and when her mom is told?' },
        { id: 'askmom', label: 'Should I ask her mom whether it\'s true when she gets here?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'askmom') { A.judge('407-sbar-mom', 'judgment', -2, `You suggested questioning Kayla's mother yourself.`, `Investigating is CPS's job. Questioning family can tip off the person she named, put her at risk, and damage the investigation.`, '407'); return `No. That's CPS's job, and it could tip him off. Did she tell you something? Has a report been made?`; }
        if (!picked.includes('disc')) return `Okay. Anything specific going on with her?`;
        P.psychTold = true;
        if (!P.restrict) { P.restrict = true; A.addOrder('407', `Visitor list changed: Rick Dawson may not visit or call. Mother may visit with staff present after the team meets with her; no discussion of the disclosure at the visit. Social work consult in the morning.`); }
        if (!P.reported) { A.judge('407-sbar', 'comm', 1, `You told the psychiatrist about Kayla's disclosure.`, `Right to tell the team, but it doesn't replace your own report. Each mandated reporter who hears it has the duty.`, '407'); return `Thank you. He's off the visitor list as of now. Have you called the hotline? You need to make that report yourself, tonight.`; }
        A.judge('407-sbar', 'comm', 2, `You told the psychiatrist about Kayla's disclosure and your report.`, `Report made, team told, visitor list fixed before visiting hours. That's the order that keeps her safe tonight.`, '407');
        return `Thank you for doing this right. He's off the visitor list. I'll meet her mom at 18:30 with social work; nobody discusses it at the door.`;
      },
    },
    scene: (s, P) => ({ psych: true, letter: true, tray: 'none' }),
    clues: () => ({ letter: `A folded note addressed to "Gabe," her little brother. Just the first line is visible: "If anything ever happens, go to Abuela's."` }),
    onClue(id, s, P) { if (id === 'letter') P.k.note = s.t; },
    rig: (s, P) => ({ anxious: P.shaken ? .9 : P.disclosed && !P.reported ? .6 : .4 }),
    status: (s, P) => (P.shaken ? 'urgent' : P.disclosed && !P.reported ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.rickIn && !P.disclosed) return { tone: 'bad', title: 'He visited. No one asked her why she was afraid.', text: `She came out of the visit shaking. The visitor list, the lock on her door and the hoodie were all in report.` };
      if (P.rickIn) return { tone: 'bad', title: 'He visited after she told you', text: `She disclosed, and he was on the unit two hours later. Her trust in adults just took the hit she was afraid of.` };
      if (P.disclosed && P.reported && P.restrict) return { tone: P.promised ? 'mixed' : 'good', title: 'She told, and adults did it right', text: `Report made, visitor list changed, mom met with the team instead of at the door.${P.promised ? ' She\'s hurt you broke your promise; she\'ll understand why later, but promise less next time.' : ''}` };
      if (P.disclosed && P.reported) return { tone: 'mixed', title: 'Reported, but the team was a step behind', text: `The report is made. The psychiatrist never heard it from you${P.held ? ', though you kept him off the unit at the door' : ''}.` };
      if (P.disclosed) return { tone: 'bad', title: 'She told you. No report was made.', text: `A disclosure of abuse is a mandated report. It wasn't made.` };
      return { tone: 'mixed', title: 'Quiet, and still carrying it', text: 'She never got the chance to say what was wrong.' };
    },
  };

  /* ---------- 409 Eli Novak (admission): "medically cleared," but he took acetaminophen yesterday and told only a peer ---------- */
  const eli = {
    id: '409', room: '409', name: 'Eli Novak', short: 'Eli', age: 17, sex: 'M', mrn: '00377815', legal: '5585, danger to self', arrives: 45,
    look: { skin: '#EFD0B6', shade: '#D2AE92', lip: '#B06C62', blush: '#E59A88', iris: '#4E6A52', head: { w: 53, h: 61, jaw: .45 }, eye: 9.6, hair: { style: 'swoop', color: '#6A4A2E' }, brow: { w: 3.8, color: '#55391F' }, body: { w: 72, cloth: 'hoodie' }, extras: [], smile: .15, tired: true,
      lines: { calm: `I'm fine. Just carsick from the ride.`, nausea: `Where's a — I'm gonna throw up.`, pain: `My side hurts. Under the ribs.`, drowsy: `Can I sleep?`, none: `He doesn't answer.` } },
    bio: `Senior. Plays bass in a garage band, works at a grocery store, waiting on college letters. His mom found his goodbye note yesterday afternoon.`,
    dx: `Depression, suicidal ideation (new admission)`, reason: `Major depressive disorder with suicidal ideation; goodbye note found by his mother. In the ED he denied taking anything.`,
    hx: [`No prior psychiatric history`, `Cannabis on weekends`, `Medically cleared in the ED: denied any ingestion`],
    allergies: `No known drug allergies`, code: `Full code`, weight: `68 kg`,
    lines: [`None`], mobility: `Independent`, diet: `Regular`,
    init: { admitted: null, vape: false, bottle: false, admits: false, peerTold: false, peerDismissed: false, gi: false, carsick: false, reported: false, labsAt: null, labsDone: false, transferAt: null, gone: false, apapAt: null, liver: 1, worse: false },
    labs: [
      { name: 'Basic metabolic panel (ED)', val: 'Normal', unit: '', ref: '', flag: '', t: -1300 },
      { name: 'Urine drug screen (ED)', val: 'THC positive', unit: '', ref: '', flag: 'A', t: -1300 },
      { name: 'Acetaminophen level (ED)', val: 'Not sent: denied ingestion', unit: '', ref: '', flag: '', t: -1300 },
    ],
    orders: [
      { t: 40, text: `WIC 5585, danger to self. Admit to 4 North. Suicide precautions, observation every 15 minutes. Admission skin check and belongings search.` },
      { t: 40, text: `Admission order set: acetaminophen 650 mg PO every 6 h as needed, pain or fever. Ondansetron ODT 4 mg PO every 8 h as needed, nausea.` },
    ],
    notes: [
      { t: -1200, author: 'ED provider', text: `17M brought by mother after she found a note saying goodbye. Denies ingestion or self-harm. Mild nausea attributed to anxiety. BMP normal, UDS THC+. Medically cleared for psychiatric admission.` },
    ],
    io: { intake: `Nothing since yesterday morning`, output: `Voiding` },
    report: [],
    vitals(s, P) { const x = P.liver - 1; return { T: 37.4, HR: Math.round(102 + x * 10) + jit(s, 9), SBP: 118 + jit(s, 10) * 2, DBP: 70, RR: 16, SpO2: 99, O2: 'Room air', pain: Math.round(4 + x * 3) }; },
    assess: {
      general: (s, P) => `Pale, hood up, arms crossed over his stomach. Says he's "fine, just carsick."`,
      resp: () => `Unlabored. Clear.`,
      cardiac: (s, P, A) => `HR ${A.vitals('409').HR}, regular. BP ${A.vitals('409').SBP}/70.`,
      neuro: (s, P) => { P.k.neuro = s.t; return `Alert, oriented. Flat. Admits he wrote the note and "meant it at the time." Says he's "not going to do anything now." ${P.admits ? 'Told you he took a handful of acetaminophen yesterday morning.' : 'Denies taking anything, but looks away when he says it.'}${P.liver >= 2 ? ' Slower to answer than earlier.' : ''}`; },
      pain: (s, P) => `Right upper abdomen, under the ribs, ${Math.round(4 + (P.liver - 1) * 3)}/10. "It's just my stomach."`,
      skin: (s, P) => (P.liver >= 2 ? `The whites of his eyes look faintly yellow under the light.` : `No marks or injuries. Skin pale.`),
      gi: (s, P) => { P.gi = true; P.k.gi = s.t; return `Nauseous. Vomited once in the ED and once here. Hasn't eaten since yesterday morning. Tender in the right upper abdomen, under the ribs; guards when you press.`; },
    },
    interventions: [
      { id: 'admit', label: 'Admission assessment, skin check and belongings search', cost: 10, avail: (s, P) => P.admitted === null, run(s, P, A) { P.admitted = s.t; P.vape = true; P.bottle = true; A.judge('409-admit', 'assess', s.t - 45 <= 45 ? 2 : 1, `You did Eli's admission assessment and a thorough belongings search.`, `The admission search is for contraband, and it's also an assessment. What someone carries in tells you what happened before they came.`, '409'); A.recordVitals('409', 'You'); return `Vape pen in his jacket: removed and logged. In the hoodie pocket: an empty acetaminophen bottle, the receipt still in the bag. Dated yesterday morning.`; } },
    ],
    meds: [
      {
        id: '409-apap', name: 'Acetaminophen', dose: '650 mg', route: 'PO', freq: 'Every 6 h as needed, pain or fever', prn: true,
        block: (s, P) => (P.apapAt !== null ? 'Given at ' + clock(P.apapAt) + '.' : null),
        checks: (s, P) => [{ label: 'Pain', value: 'Right upper abdomen', ok: null }, { label: 'Ingestion', value: P.admits || P.bottle || P.peerTold ? 'Possible acetaminophen overdose yesterday' : 'Denied in the ED', ok: !(P.admits || P.bottle || P.peerTold) }],
        give(s, P, A) { P.apapAt = s.t; const knew = P.admits || P.bottle || P.peerTold; A.judge('409-apap', 'meds', knew ? -3 : -1, knew ? `You gave Eli acetaminophen after a possible acetaminophen overdose.` : `You gave Eli acetaminophen for new right upper abdominal pain without working out why.`, knew ? `More acetaminophen into a liver that's already injured.` : `New pain under the right ribs with nausea, in a teenager admitted for a suicide note, is a question to ask before it's a PRN to give.`, '409'); return 'Acetaminophen 650 mg given.'; },
      },
      { id: '409-ond', name: 'Ondansetron ODT', dose: '4 mg', route: 'PO', freq: 'Every 8 h as needed, nausea', prn: true, checks: () => [{ label: 'Nausea', value: 'Vomiting', ok: true }], give: () => 'Ondansetron 4 mg dissolved on his tongue.' },
    ],
    talk: (s, P) => (P.gone ? null : P.admits ? 'eli_after' : 'eli_talk'),
    sbar: {
      items(s, P) {
        return [
          { id: 'admits', label: 'Says he took a lot of acetaminophen yesterday morning', key: true, need: P.admits, lock: 'Ask him directly' },
          { id: 'bottle', label: 'Empty acetaminophen bottle in his hoodie, bought yesterday', key: true, need: P.bottle, lock: 'Search his belongings' },
          { id: 'peer', label: 'Told another patient he took "like thirty Tylenol"', key: true, need: P.peerTold && !P.peerDismissed, lock: 'Not heard' },
          { id: 'ruq', label: 'Nausea, vomiting, right upper abdominal pain', key: true, need: P.gi, lock: 'Assess his abdomen' },
          { id: 'nolevel', label: 'No acetaminophen level was sent in the ED', key: true, need: true },
          { id: 'results', label: 'Stat results: acetaminophen 14, AST 1,180, ALT 1,460, INR 1.6', key: true, need: P.labsDone, lock: 'Labs not back' },
          { id: 'band', label: 'Plays bass in a band', key: false, need: true },
        ];
      },
      requests: [
        { id: 'tox', label: 'He may have taken a large amount of acetaminophen about 30 hours ago. Can we get a level, liver tests and an INR now, and get him medically evaluated?' },
        { id: 'ond', label: 'He\'s nauseous. Can he have something for it?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (P.labsDone && picked.includes('results')) {
          if (P.transferAt === null) { P.transferAt = s.t + 20; A.addOrder('409', 'Transfer to pediatrics for IV N-acetylcysteine and liver monitoring. 1:1 sitter for suicide precautions during transfer. Nothing by mouth except sips.'); }
          A.judge('409-results', 'judgment', 2, `You followed up with the psychiatrist on Eli's stat results.`, `Ordering the labs is half of it. Calling back with the results, and making sure they change the plan, is what gets him the antidote.`, '409');
          return `That's acetaminophen liver injury. He needs N-acetylcysteine now. Pediatrics is taking him in twenty minutes; keep him on a sitter for the transfer. Thank you for closing the loop.`;
        }
        const ev = ['admits', 'bottle', 'peer'].filter((k) => picked.includes(k));
        if (req === 'tox' && ev.length) {
          P.reported = true;
          if (P.labsAt === null) { P.labsAt = s.t; A.addOrder('409', 'STAT acetaminophen level, AST, ALT, INR, BMP. Nothing more by mouth. Hold the acetaminophen PRN.'); }
          A.judge('409-sbar', 'comm', picked.includes('ruq') ? 2 : 1, `You reported a possible acetaminophen overdose in Eli.`, `Acetaminophen overdose looks like nothing for a day, then like a stomach bug. A day later the liver is failing. The antidote works best early, and still helps late.`, '409');
          return `"Medically cleared" without a level doesn't clear this. Stat level, liver tests, INR, and hold his acetaminophen PRN. Call me the second they're back.`;
        }
        if (req === 'tox') return `He denied any ingestion in the ED. What's making you think he took something?`;
        if (req === 'ond') return `Sure, it's on his orders. Anything else?`;
        return `Okay. Admission skin check and search done?`;
      },
    },
    scene: (s, P) => ({ psych: true, packed: P.admitted === null, basin: true, tray: 'none', empty: P.gone, emptyText: 'Room empty. Transferred to pediatrics for N-acetylcysteine.' }),
    clues: (s, P) => ({
      packed: `His bag from home, not yet searched. A hoodie on top, the pocket weighed down with something small.`,
      basin: `An emesis basin, used. A ginger ale beside it, barely touched.`,
    }),
    rig: (s, P) => ({ nausea: true, pale: clamp(.4 + (P.liver - 1) * .3, 0, 1), pain: Math.round(4 + (P.liver - 1) * 3) }),
    status: (s, P) => (P.gone ? 'gone' : P.liver >= 2 || P.labsDone ? 'urgent' : 'watch'),
    outcome(s, P) {
      if (!P.arrived) return { tone: 'mixed', title: 'Admission not yet arrived', text: 'Shift ended before he came up.' };
      if (P.gone) return { tone: P.transferAt <= 200 && P.apapAt === null ? 'good' : 'mixed', title: 'Hidden overdose, caught', text: `On pediatrics by ${clock(P.transferAt)} with N-acetylcysteine running.${P.apapAt !== null ? ' He got one more dose of acetaminophen on the way.' : ''} "Medically cleared" didn't include the one test that mattered.` };
      if (P.labsDone) return { tone: 'mixed', title: 'Results back, never called', text: 'The labs showed liver injury, and they sat in the chart.' };
      if (P.reported) return { tone: 'mixed', title: 'Labs pending at the end of the shift', text: 'The night nurse needs to chase them.' };
      return { tone: 'bad', title: 'Overdose missed', text: `${P.admits || P.bottle || P.peerTold ? 'You had the clue. It never reached anyone who could order the antidote.' : 'Nausea, right upper abdominal pain, a suicide note and no acetaminophen level.'} His liver is failing quietly.` };
    },
  };

  /* ---------- dialogs ---------- */
  const dialogs = {
    ella_talk: { who: '401', text: `"Can you just tell me if it went up? My weight. You don't have to say the number. Just up or down." She's twisting the hoodie string around her finger until the tip goes white.`, choices: [
      { label: `I'm not going to tell you, up or down. Not because it's a secret, but because the number makes the eating disorder louder right now. What's it like, not knowing?`, next: 'ella_a', fx: (s, A) => { const P = s.p['401']; P.askedWeight = true; A.judge('401-weight', 'comm', 2, `You held the line on blind weights and asked about the feeling instead.`, `Blind weights keep the number from running her day. Say it plainly, without apology, then talk about what's underneath.`, '401'); } },
      { label: `It went up a little. That's a good thing!`, next: 'ella_b', fx: (s, A) => { const P = s.p['401']; P.askedWeight = true; P.told = true; A.judge('401-weight', 'comm', -2, `You told Ella her weight went up.`, `Up or down is still the number. It hands the eating disorder exactly the information it wants, and tonight's dinner pays for it.`, '401'); } },
      { label: `Honestly, you look so much healthier than when you came in.`, next: 'ella_b', fx: (s, A) => { const P = s.p['401']; P.askedWeight = true; A.judge('401-weight', 'comm', -2, `You commented on Ella's body.`, `Any comment on how she looks gets translated into "bigger." Talk about energy, strength and what she's doing, never about her body.`, '401'); } },
    ] },
    ella_a: { who: '401', text: `A long pause. "Loud. Like a radio in another room I can't turn off." She lets go of the string. "Coach used to say I had the best turns on the team. Now I can't even stand up fast."` },
    ella_b: { who: '401', text: `Her face goes still. "Okay." She pulls the hoodie tighter. You can almost hear her start counting.` },
    ella_after: { who: '401', text: `"I know you're not going to tell me." She doesn't look up. "Thanks for not pretending you will."` },

    jor_talk: { who: '403', text: `"Hey. Quick thing." They pull one earbud out. "My dad calls me Jessica. He doesn't know about Jordan. If he calls, can you just... not?"`, choices: [
      { label: `I won't share your name or pronouns with your family without your OK. On the unit you're Jordan. The team will talk with you about how you want to handle it with your dad.`, next: 'jor_a', fx: (s, A) => { const P = s.p['403']; P.askedName = true; A.judge('403-name', 'comm', 2, `You protected Jordan's name and pronouns from being shared without their consent.`, `Outing a teenager to family can put their safety at home at risk. Use their name with them; let them lead on who else knows, and bring the team in.`, '403'); } },
      { label: `Your dad's your guardian. He has a right to know everything about your care.`, next: 'jor_b', fx: (s, A) => { const P = s.p['403']; P.askedName = true; A.judge('403-name', 'comm', -2, `You told Jordan their dad has a right to know about their gender identity.`, `Parents of a minor get updates about safety and treatment. That isn't the same as a nurse disclosing something the teen hasn't chosen to share.`, '403'); } },
      { label: `Why don't you just tell him? Get it over with.`, next: 'jor_b', fx: (s, A) => { const P = s.p['403']; P.askedName = true; A.judge('403-name', 'comm', -1, `You pushed Jordan to come out to their dad.`, `When and whether to tell family is theirs to decide, ideally with support. "Just tell him" skips over why they haven't.`, '403'); } },
    ] },
    jor_a: { who: '403', text: `Their shoulders come down an inch. "Okay. Thanks." The earbud goes back in. Then out again. "He called today. It was bad."` },
    jor_b: { who: '403', text: `"Right. Cool." The earbud goes back in, and the hood comes up.` },
    jor_quiet: { who: '403', text: `"Can we not right now?" They keep drawing. The frog detective is standing in the rain.` },
    jor_after: { who: '403', text: `They're looking at the dressing on their arm. "Are you going to tell everybody? Is everyone going to look at me different?"`, choices: [
      { label: `The team will know, so we can keep you safe. I'm not here to judge you. What was going on right before you did it?`, next: 'jor_c', fx: J('403-after', 'comm', 1, `You asked Jordan what happened before the self-harm, without judgment.`, `Self-harm is usually a way to survive a feeling. Knowing the trigger is how the safety plan gets real.`, '403') },
      { label: `You promised you wouldn't do this anymore.`, next: 'jor_d', fx: J('403-after', 'comm', -2, `You shamed Jordan for self-harm.`, `Shame drives self-harm underground. They'll just hide it better next time.`, '403') },
    ] },
    jor_c: { who: '403', text: `"He kept saying 'Jessica' like it was a test. Like he was waiting for me to correct him so he could yell." They pick at the tape. "I couldn't make the feeling stop."` },
    jor_d: { who: '403', text: `They pull the sleeve down over the dressing and don't say anything else.` },

    mar_talk: { who: '405', text: `"Mm. That shot made me so sleepy." He squints at you. "Is it dinner yet? Don't tell me about the chair. I know about the chair."` },
    mar_dys: { who: '405', text: `"My neck! I'm not — I can't make it stop!" His head is pulled hard to one side, eyes rolled up, words thick. He grabs your sleeve. "Tasha said I'm faking. I'm NOT."`, choices: [
      { label: `I believe you. This is a reaction to the shot you got this afternoon. It's a known side effect, it's not your fault, and there's medicine that fixes it. I'm staying with you.`, next: 'mar_a', fx: (s, A) => { const P = s.p['405']; P.believed = true; A.judge('405-talk', 'comm', 2, `You believed Jaylen and named what was happening.`, `Dystonia is terrifying, and he'd just been told he was faking. Naming it as a side effect, and staying, lowers the fear while you get the antidote.`, '405'); } },
      { label: `Jaylen, stop. Nobody's falling for this.`, next: 'mar_b', fx: (s, A) => { const P = s.p['405']; P.believed = false; A.judge('405-talk', 'judgment', -3, `You told Jaylen he was faking an acute dystonic reaction.`, `A first dose of haloperidol an hour ago, a twisted neck, eyes rolled up: anchoring on "he likes attention" is how a treatable side effect turns into an airway problem.`, '405'); } },
      { label: `Try to relax your neck. Take some deep breaths.`, next: 'mar_b', fx: J('405-talk', 'judgment', -1, `You coached Jaylen to relax through a dystonic reaction.`, `He can't relax it. It's a drug effect on the muscles, and it needs the antidote.`, '405') },
    ] },
    mar_a: { who: '405', text: `His grip loosens a little. "Okay. Okay. Hurry."` },
    mar_b: { who: '405', text: `He starts crying, head still pulled to the side. "I'm not. I'm not."` },
    mar_after: { who: '405', text: `"Is that gonna happen again? That was the scariest thing ever." He hugs the T. rex.`, choices: [
      { label: `It can come back as the medicine wears off, so you'll get a pill on a schedule for a couple of days. If your neck, eyes or jaw start to pull, tell any of us right away. It's not your fault, and you did the right thing telling us.`, next: 'mar_c', fx: J('405-teach', 'comm', 1, `You taught Jaylen what to watch for.`, `Teach him the signs and that it's not his fault. Patients who've had dystonia often stop taking medicine they're afraid of.`, '405') },
      { label: `Just don't throw chairs and you won't need the shot.`, next: 'mar_d', fx: J('405-teach', 'comm', -1, `You turned Jaylen's side effect into a lesson about behavior.`, `The chair matters, and so does this. Don't make the side effect his fault.`, '405') },
    ] },
    mar_c: { who: '405', text: `"Okay." He thinks about it. "Like a T. rex. Tiny arms, big warning roar." He's very pleased with this.` },
    mar_d: { who: '405', text: `He turns to the wall.` },

    kay_talk: { who: '407', text: `She's watching the door. "Can I tell you something? But you have to promise not to tell anyone. Promise first."`, choices: [
      { label: `I care about what you want to tell me. Before you do: I can't promise to keep everything secret. If someone is hurting you, I have to tell people whose job is to keep you safe. I'll tell you every step, and I'll stay with you.`, next: 'kay_a', fx: (s, A) => { const P = s.p['407']; P.disclosed = true; P.discAt = P.discAt != null ? P.discAt : s.t; A.judge('407-promise', 'comm', 2, `You were honest with Kayla about what you could keep secret, before she told you.`, `Never promise secrecy you can't keep. Saying the limits first, kindly, is what lets her trust you after you report.`, '407'); } },
      { label: `I promise. You can tell me anything.`, next: 'kay_b', fx: (s, A) => { const P = s.p['407']; P.disclosed = true; P.discAt = P.discAt != null ? P.discAt : s.t; P.promised = true; A.judge('407-promise', 'comm', -3, `You promised Kayla secrecy.`, `You're a mandated reporter. A promise you'll have to break teaches her that adults lie, right when she needs one to be honest.`, '407'); } },
      { label: `That sounds big. Maybe save it for your therapist tomorrow?`, next: 'kay_c', fx: (s, A) => { const P = s.p['407']; P.deferredAt = s.t; A.judge('407-defer', 'comm', -1, `You put off what Kayla wanted to tell you.`, `Teenagers pick who they tell, and when. If she picked you, tonight, that's the moment.`, '407'); } },
    ] },
    kay_a: { who: '407', text: `She's quiet so long you think she's changed her mind. Then: "Rick. My mom's boyfriend. He comes into my room at night when she's working. He said nobody would believe me." She's shaking. "He's coming tonight. At six-thirty."`, choices: [
      { label: `I believe you. This is not your fault. I'm going to make a report and tell the doctor so he can't come near you here. You did the right thing telling me.`, next: 'kay_r1', fx: (s, A) => { s.p['407'].responded = 'good'; A.judge('407-resp', 'comm', 2, `You believed Kayla and told her what happens next.`, `Believe, don't blame, don't dig for details, and tell her the plan. The detailed interview belongs to specialists; your job is safety and the report.`, '407'); } },
      { label: `Tell me exactly what he does. Every detail, so I get it right.`, next: 'kay_r2', fx: (s, A) => { s.p['407'].responded = 'dig'; A.judge('407-resp', 'comm', -1, `You questioned Kayla for details.`, `Repeated questioning is hard on her and can affect the investigation. Get enough to report, write her words down exactly, and leave the forensic interview to the people trained for it.`, '407'); } },
      { label: `Are you sure? That's a really serious thing to say about someone.`, next: 'kay_r3', fx: (s, A) => { s.p['407'].responded = 'doubt'; A.judge('407-resp', 'comm', -2, `You questioned whether Kayla was telling the truth.`, `"He said nobody would believe me." Doubt is exactly what she was told to expect. Believe her, and report.`, '407'); } },
    ] },
    kay_b: { who: '407', text: `"Okay." A long breath. "Rick. My mom's boyfriend. He comes into my room at night when she's working. He said nobody would believe me." Then, smaller: "You promised. He's coming tonight at six-thirty."`, choices: [
      { label: `I believe you, and it's not your fault. I was wrong to promise: I have to tell people who can keep you safe, and I'll be with you for every step. He won't come near you here.`, next: 'kay_r1', fx: (s, A) => { s.p['407'].responded = 'good'; A.judge('407-resp', 'comm', 1, `You owned the broken promise and told Kayla the plan.`, `Better to repair it now than let her find out later. Next time, say the limits before she tells you.`, '407'); } },
      { label: `Tell me exactly what he does, so I get it right.`, next: 'kay_r2', fx: (s, A) => { s.p['407'].responded = 'dig'; A.judge('407-resp', 'comm', -1, `You questioned Kayla for details.`, `Get enough to report and leave the forensic interview to specialists.`, '407'); } },
    ] },
    kay_r1: { who: '407', text: `She nods, crying. "Can I stay in my room while he's here? Can someone sit by the door?" She pulls the hood down for the first time.` },
    kay_r2: { who: '407', text: `She starts, stops, then shuts down. "I don't want to talk about it anymore." She turns toward the wall.` },
    kay_r3: { who: '407', text: `"Forget it." Her face closes. "Forget I said anything. He's right."` },
    kay_c: { who: '407', text: `"Yeah. Okay. Never mind." She goes back to watching the door.` },
    kay_later: { who: '407', text: `"I said never mind." She doesn't look at you.` },
    kay_wait: { who: '407', text: `"Did you tell them? Is he still coming?" She's watching the clock.` },
    kay_safe: { who: '407', text: `"Tasha's going to sit by my door during visiting." She's eating a granola bar, the first thing you've seen her eat. "Is my mom mad?"` },

    eli_talk: { who: '409', text: `"I'm fine. Just carsick from the ride over." He's holding his stomach. "Can I sleep? I don't want dinner."`, choices: [
      { label: `Eli, a lot of people who've been where you were yesterday take pills before they come in. Did you take anything? Even Tylenol, or something from home?`, next: 'eli_a', fx: (s, A) => { const P = s.p['409']; P.admits = true; A.judge('409-ask', 'assess', 2, `You asked Eli directly about any ingestion.`, `"Did you take anything?" is part of every suicide risk assessment, whatever the ED wrote. Ask plainly, and name the common ones: acetaminophen is everywhere.`, '409'); } },
      { label: `Carsick, sure. Lie down. Dinner will help settle your stomach.`, next: 'eli_b', fx: (s, A) => { s.p['409'].carsick = true; A.judge('409-ask', 'judgment', -1, `You accepted "carsick."`, `Anchoring again: new nausea and abdominal pain in a teen admitted for a suicide note is a question to ask, not a story to accept.`, '409'); } },
      { label: `Let's get you settled. We can talk about everything tomorrow.`, next: 'eli_b', fx: J('409-ask', 'assess', -1, `You put off Eli's risk assessment.`, `The admission assessment is tonight. Some answers can't wait for morning.`, '409') },
    ] },
    eli_a: { who: '409', text: `He doesn't answer for a while. "Tylenol. A lot. Yesterday morning, before school." He looks at the floor. "I threw up after and felt okay, so I figured it didn't work. I didn't tell the ER. I didn't want my mom to know."` },
    eli_b: { who: '409', text: `"Yeah." He curls up on his side, arm over his stomach.` },
    eli_after: { who: '409', text: `"Am I in trouble? Is my liver... is it bad?" He looks seventeen and also about eleven.` },
  };

  /* ---------- events ---------- */
  const A0 = (s) => Object.keys(s.p).every((id) => s.p[id].seenAt === null);
  const events = [
    { id: 'tasha-hi', when: (s) => s.t >= 3, run(s, A) { A.msg({ from: 'tasha', text: `Hey. I've got checks on the hall. 405 is still sleeping off the shot. 403 hasn't come out of their room since the phone call. 407 keeps asking me what time visiting is.`, replies: [{ label: 'Open tasks for Tasha', act: 'delegate' }] }); } },
    { id: 'mar-f2f', when: (s) => { const P = s.p['405']; return P.f2fCalled !== null && P.f2fAt === null && s.t >= P.f2fCalled + 10; }, run(s, A) { const P = s.p['405']; P.f2fAt = s.t; const ok = s.t <= 30;
      A.judge('405-f2f', 'safety', ok ? 1 : 0, ok ? `Jaylen had his face-to-face evaluation within the hour.` : `Jaylen's face-to-face came after the one-hour limit.`, `The face-to-face looks at the situation, his reaction to the hold and the drug, his physical condition, and any injury from being held.`, '405');
      A.note('405', 'Dr. Adeyemi', `Face-to-face evaluation at ${clock(s.t)} for the 14:28 three-person hold and haloperidol 5 mg IM. Drowsy, rousable, no injury from the hold, airway normal. Imminent danger has resolved; no further restraint indicated. First antipsychotic exposure: watch for dystonia.`);
      A.msg({ from: 'adeyemi', pid: '405', text: `Saw Jaylen for the face-to-face. Drowsy, no injuries, nothing else needed. It's his first antipsychotic, so watch for stiffness or a twisted neck.` }); } },
    { id: 'mar-dys', when: (s) => s.t >= 40 && s.p['405'].dys > 0 && s.p['405'].dphAt === null, run(s, A) { A.msg({ from: 'tasha', pid: '405', text: `405 is doing a weird thing with his neck. Head all twisted, eyes rolled up, says he can't stop it. Honestly I think he's messing with us after the shot. He's been testing all day.`, replies: [{ label: 'Go to 405', act: 'goto', pid: '405' }] }); } },
    { id: 'eli-arrive', when: (s) => s.t >= 45, run(s, A) { const P = s.p['409']; P.arrived = true; P.vit.push({ t: s.t, by: 'ED RN', T: 37.4, HR: 102, SBP: 118, DBP: 70, RR: 16, SpO2: 99, O2: 'Room air', pain: 4 }); A.msg({ from: 'tasha', pid: '409', text: `New admit from the ED is in 409. Eli Novak, 17. Quiet. Says he's carsick. His bag's on the bed, not searched yet.`, replies: [{ label: 'Go to 409', act: 'goto', pid: '409' }] }); } },
    { id: 'ella-labs', when: (s) => s.t >= 60, run(s, A) { const P = s.p['401']; A.addLab('401', { name: 'Phosphorus', val: +P.phos.toFixed(1), unit: 'mg/dL', ref: '3.0–4.5', flag: 'L' }); A.addLab('401', { name: 'Potassium', val: 3.3, unit: 'mmol/L', ref: '3.5–5.0', flag: 'L' }); A.addLab('401', { name: 'Magnesium', val: 1.6, unit: 'mg/dL', ref: '1.7–2.4', flag: 'L' }); A.msg({ from: 'lab', pid: '401', text: `Afternoon refeeding labs resulted for 401 Marsh.` }); } },
    { id: 'nova-idle', when: (s) => s.t >= 50 && s.t < 120 && A0(s), run(s, A) { A.msg({ from: 'nova', urgent: true, text: `Almost four and you haven't been in a room. Teenagers don't come find you when something's wrong. Go find them.` }); } },
    { id: 'dad', when: (s) => s.t >= 75 && !s.p['403'].gone, run(s, A) { A.msg({ from: 'rob', pid: '403', text: `This is Rob Ellis, Jessica Ellis's father. I have the family code: 4417. Is my daughter okay? She hung up on me at lunch and the day nurse wouldn't tell me anything.`, replies: [{ label: 'Give a safety update, and have the psychiatrist call him', act: 'dad-update' }, { label: '"Do you mean Jordan? They\'re doing okay."', act: 'dad-out' }, { label: '"I can\'t confirm anyone is here."', act: 'dad-refuse' }] }); } },
    { id: 'jor-found', when: (s) => s.t >= 110 && !s.p['403'].cutsFound && !s.p['403'].gone, run(s, A) { const P = s.p['403']; P.cutsFound = true; P.foundBy = 'tasha'; A.judge('403-late', 'assess', -1, `Tasha found Jordan's fresh cuts before a nurse did.`, `A missed skin check, a hard call and long sleeves in a warm room: the skin check was the assessment, and it was yours to do at the start of the shift.`, '403'); A.msg({ from: 'tasha', pid: '403', urgent: true, text: `There's blood coming through 403's left sleeve. They let me look: fresh cuts from this afternoon. Not deep. They need a nurse.`, replies: [{ label: 'Go to 403', act: 'goto', pid: '403' }] }); } },
    { id: 'dinner', when: (s) => s.t >= 120, run(s, A) { const P = s.p['401']; if (P.gone) return; A.msg({ from: 'tasha', pid: '401', text: `Dinner trays are up. Who's sitting with 401 for her meal?`, replies: [{ label: 'I\'ll sit with her myself', act: 'meal-me' }, { label: 'Tasha, sit with her through dinner and the hour after', act: 'meal-tasha' }, { label: 'Leave her tray; she can eat in her room', act: 'meal-alone' }] }); } },
    { id: 'peer', when: (s) => s.t >= 140 && s.p['409'].arrived && !s.p['409'].reported && !s.p['409'].gone && !s.p['403'].gone, run(s, A) { s.p['409'].peerTold = true; A.msg({ from: 'tasha', pid: '409', text: `403 pulled me aside. They said 409 told them he took "like thirty Tylenol" yesterday before his mom found his note, and made them promise not to tell. Jordan's really upset about breaking a promise.`, replies: [{ label: 'Thank Jordan: telling was the right thing', act: 'peer-thank' }, { label: 'Teenagers exaggerate. Let it go.', act: 'peer-dismiss' }, { label: 'Ask Jordan to keep an eye on him and report back', act: 'peer-spy' }] }); } },
    { id: 'eli-vomit', when: (s) => s.t >= 150 && s.p['409'].arrived && !s.p['409'].gone, run(s, A) { A.msg({ from: 'tasha', pid: '409', text: `409 threw up again. He's holding his right side. Says it's just his stomach.`, replies: [{ label: 'Go to 409', act: 'goto', pid: '409' }] }); } },
    { id: 'postmeal', when: (s) => { const P = s.p['401']; return P.mealAt !== null && P.mealBy !== 'tasha' && P.postObs === null && s.t >= P.mealAt + 15 && !P.gone; }, run(s, A) { A.msg({ from: 'tasha', pid: '401', text: `401 just finished dinner and wants to use the bathroom by herself. Okay?`, replies: [{ label: 'Not alone for the first hour: wait outside the door', act: 'post-sup' }, { label: 'Sure, give her some privacy', act: 'post-ok' }] }); } },
    { id: 'contagion', when: (s) => { const P = s.p['403']; return s.t >= 165 && P.cutsFound && !P.gone && P.contagion === null; }, run(s, A) { s.p['403'].contagion = s.t; A.msg({ from: 'tasha', pid: '403', text: `403 is in the dayroom showing the younger girls their arm and talking about how they did it. 401 is listening really closely.`, replies: [{ label: 'Talk with Jordan privately; no self-harm details on the unit', act: 'cont-private' }, { label: 'Announce to the dayroom that self-harm talk is against the rules', act: 'cont-public' }, { label: 'Let it go; they\'re bonding', act: 'cont-ignore' }] }); } },
    { id: 'jor-second', when: (s) => { const P = s.p['403']; return s.t >= 180 && !P.searched && !P.oneToOne && !P.gone; }, run(s, A) { const P = s.p['403']; P.second = true; P.gone = true; P.goneText = 'Sent to the ED for sutures'; A.judge('403-second', 'safety', -3, `Jordan self-harmed again on the unit, more deeply.`, `The object from this afternoon was still in their room, and observation never changed. A search and closer observation were both available.`, '403'); A.msg({ from: 'tasha', pid: '403', urgent: true, text: `403 cut again, deeper this time. Pressure's on it, it's going to need stitches. They had a piece of plastic in their shoe.` }); } },
    { id: 'mar-airway', when: (s) => { const P = s.p['405']; return !P.icu && P.dphAt === null && P.dys >= 2.7; }, run(s, A) { const P = s.p['405']; P.icu = true; P.goneText = 'Sent to the ED for airway support'; A.judge('405-airway-fail', 'safety', -3, `Jaylen's dystonia reached his airway.`, `Stridor and a locked jaw after hours of untreated dystonia. The antidote was on his PRN list from the start.`, '405'); A.msg({ from: 'nova', pid: '405', urgent: true, text: `Rapid response 405. He's stridorous and can't swallow. Diphenhydramine IV going in, and he's going to the ED for airway watch.` }); } },
    { id: 'ella-weak', when: (s) => { const P = s.p['401']; return !P.weak && !P.gone && P.phos <= 1.6; }, run(s, A) { const P = s.p['401']; P.weak = true; A.msg({ from: 'tasha', pid: '401', urgent: true, text: `401 says her legs feel weak and tingly and her heart is "skipping." She can't get up from the chair.`, replies: [{ label: 'Go to 401', act: 'goto', pid: '401' }] }); } },
    { id: 'ella-out', when: (s) => { const P = s.p['401']; return !P.gone && P.phos <= 1.45; }, run(s, A) { const P = s.p['401']; P.gone = true; P.goneText = 'Transferred to pediatrics on a monitor'; A.judge('401-out', 'safety', -3, `Ella developed symptomatic refeeding syndrome.`, `Day 4, three electrolytes under their call thresholds at 16:00, a slow heart and new edema. Replacement and a recheck were one phone call away.`, '401'); A.msg({ from: 'nova', pid: '401', urgent: true, text: `401's pulse is irregular and she's too weak to stand. Pediatrics is taking her on a monitor for IV phosphorus.` }); } },
    { id: 'ella-recheck', when: (s) => { const P = s.p['401']; return P.recheckAt !== null && !P.recheckDone && !P.gone && s.t >= P.recheckAt; }, run(s, A) { const P = s.p['401']; P.recheckDone = true; A.addLab('401', { name: 'Phosphorus', val: +P.phos.toFixed(1), unit: 'mg/dL', ref: '3.0–4.5', flag: P.phos < 3 ? 'L' : '' }); A.addLab('401', { name: 'Potassium', val: P.replAt !== null ? 3.7 : 3.2, unit: 'mmol/L', ref: '3.5–5.0', flag: P.replAt !== null ? '' : 'L' }); A.msg({ from: 'lab', pid: '401', text: `Repeat electrolytes resulted for 401 Marsh.` }); } },
    { id: 'eli-labs', when: (s) => { const P = s.p['409']; return P.labsAt !== null && !P.labsDone && !P.gone && s.t >= P.labsAt + 35; }, run(s, A) { const P = s.p['409']; P.labsDone = true; A.addLab('409', { name: 'Acetaminophen level', val: 14, unit: 'µg/mL', ref: 'Any detectable level this late is significant', flag: 'H' }); A.addLab('409', { name: 'AST / ALT', val: '1,180 / 1,460', unit: 'U/L', ref: '10–40', flag: 'H' }); A.addLab('409', { name: 'INR', val: 1.6, unit: '', ref: '0.9–1.1', flag: 'H' }); A.msg({ from: 'lab', pid: '409', urgent: true, text: `Critical values: 409 Novak, AST 1,180, ALT 1,460, INR 1.6. Acetaminophen level 14.`, replies: [{ label: 'Call Dr. Adeyemi about 409', act: 'sbar', pid: '409' }] }); } },
    { id: 'eli-out', when: (s) => { const P = s.p['409']; return P.transferAt !== null && !P.gone && s.t >= P.transferAt; }, run(s, A) { const P = s.p['409']; P.gone = true; P.goneText = 'Transferred to pediatrics for N-acetylcysteine'; A.msg({ from: 'nova', pid: '409', text: `Pediatrics picked up 409. N-acetylcysteine is hanging, sitter with him. Good catch on a "medically cleared."` }); } },
    { id: 'eli-worse', when: (s) => { const P = s.p['409']; return P.arrived && !P.gone && !P.worse && P.liver >= 2; }, run(s, A) { s.p['409'].worse = true; A.msg({ from: 'tasha', pid: '409', text: `409 is really slow to answer me, and his eyes look kind of yellow? He says his side hurts worse.`, replies: [{ label: 'Go to 409', act: 'goto', pid: '409' }] }); } },
    { id: 'visit', when: (s) => s.t >= 210, run(s, A) { const P = s.p['407']; P.visit = s.t;
      if (P.restrict) { A.msg({ from: 'desk', pid: '407', text: `Visitors for 407: Diane Ruiz and Rick Dawson. Per the new order, Rick can't come back; he left the building. Dr. Adeyemi and social work are with Diane in the family room. Tasha's outside Kayla's door.` }); return; }
      if (P.disclosed) { A.msg({ from: 'desk', pid: '407', urgent: true, text: `Visitors for 407: Diane Ruiz and Rick Dawson are at the door. Send them back?`, replies: [{ label: 'Ask both to wait in the lobby; get Nova and the psychiatrist. Say nothing about why.', act: 'vis-hold' }, { label: 'Send them both back', act: 'vis-both' }, { label: 'Tell Rick he can\'t visit because of what Kayla said', act: 'vis-tell' }] }); return; }
      P.rickIn = true; A.msg({ from: 'desk', pid: '407', text: `407's visitors, Diane Ruiz and Rick Dawson, are back with her now.` }); } },
    { id: 'kay-after', when: (s) => { const P = s.p['407']; return P.rickIn && P.visit !== null && s.t >= P.visit + 15 && !P.shaken; }, run(s, A) { const P = s.p['407']; P.shaken = true; A.msg({ from: 'tasha', pid: '407', urgent: true, text: `407 came out of the visit shaking and locked herself in the bathroom. She won't talk to me. Her mom's partner was standing really close to her the whole time.`, replies: [{ label: 'Go to 407', act: 'goto', pid: '407' }] }); } },
    { id: 'float', when: (s) => { const Jo = s.p['403']; return Jo.oneToOne && Jo.floatAt !== null && s.t >= Jo.floatAt; }, run(s, A) { A.msg({ from: 'nova', pid: '403', text: `Sam from float is taking over 403's line-of-sight. Tasha's back on the hall.` }); } },
    { id: 'nova-30', when: (s) => s.t >= 270, run(s, A) { A.msg({ from: 'nova', text: `Half an hour to report. Marco's on tonight. Who would you worry about at 2 a.m.? Make sure he hears it from you.` }); } },
  ];

  const replies = {
    'dad-update'(s, A) { const P = s.p['403']; P.dadDone = true; A.judge('403-dad', 'comm', 2, `You updated Jordan's father without outing them, and routed the hard news to the psychiatrist.`, `He's the parent of a minor with the family code, so he gets a safety update. A significant event belongs in a planned conversation with the psychiatrist, and their name and identity are Jordan's to share.`, '403'); A.msg({ from: 'rob', pid: '403', text: `Okay. Thank you. I was harder on her than I should have been at lunch. Tell her... no. I'll wait for the doctor.` }); },
    'dad-out'(s, A) { const P = s.p['403']; P.dadDone = true; P.outed = true; A.judge('403-dad', 'comm', -2, `You outed Jordan to their father.`, `Their name and pronouns were theirs to share. Outing a teenager can change how safe home is.`, '403'); A.msg({ from: 'rob', pid: '403', text: `"Jordan"? "They"? What are you talking about? Who is Jordan?` }); },
    'dad-refuse'(s, A) { const P = s.p['403']; P.dadDone = true; A.judge('403-dad', 'comm', -1, `You refused to tell Jordan's father anything.`, `He's the legal parent of a minor and gave the family code. He can get a safety update; what you protect is what Jordan hasn't chosen to share.`, '403'); A.msg({ from: 'rob', pid: '403', text: `I'm her father. I'm calling the hospital administrator.` }); },
    'meal-me'(s, A) { const P = s.p['401']; P.mealAt = s.t; P.mealBy = 'you'; P.ate = 95; A.judge('401-meal', 'safety', 1, `You supervised Ella's dinner yourself.`, `Supervised meals are part of refeeding treatment. Sitting with her, calm and neutral, is what got the food in.`, '401'); A.log('401', 'Dinner, supervised: about 95%, supplement for the rest. Calm, lots of anxiety talk.', 'act'); },
    'meal-tasha'(s, A) { const P = s.p['401']; P.mealAt = s.t; P.mealBy = 'tasha'; P.ate = 95; P.postObs = 'tasha'; A.judge('401-meal', 'deleg', 1, `You had Tasha supervise Ella's dinner and the hour after.`, `Meal and post-meal supervision are exactly the kind of observation work to delegate, with you available if she struggles.`, '401'); A.msg({ from: 'tasha', pid: '401', text: `401 ate almost everything. Took her forever and she cried at the pasta, but she did it. I'm hanging out with her for the hour after.` }); },
    'meal-alone'(s, A) { const P = s.p['401']; P.mealAt = s.t; P.mealBy = 'alone'; P.ate = 40; P.hid = true; A.judge('401-meal', 'safety', -2, `You left Ella alone with her dinner tray.`, `Unsupervised meals in refeeding are where food disappears: into napkins, sleeves, the trash. Her treatment is the meal.`, '401'); },
    'post-sup'(s, A) { const P = s.p['401']; P.postObs = 'sup'; A.judge('401-post', 'safety', 1, `You kept Ella's post-meal observation in place.`, `The hour after a meal is when exercise and purging happen. Supervised bathroom use is part of the plan, said kindly.`, '401'); A.msg({ from: 'tasha', pid: '401', text: `Told her I'd wait outside the door. She rolled her eyes but okay.` }); },
    'post-ok'(s, A) { const P = s.p['401']; P.postObs = 'none'; P.exercise = true; A.judge('401-post', 'safety', -1, `You let Ella use the bathroom alone right after dinner.`, `The post-meal hour is supervised for a reason. Twenty minutes later Tasha found her doing wall sits in there.`, '401'); },
    'peer-thank'(s, A) { const P = s.p['409']; A.judge('409-peer', 'comm', 2, `You thanked Jordan for telling, and took it seriously.`, `Teenagers tell each other first. A peer who breaks a promise to keep someone safe needs to hear they did the right thing, and the information needs to reach a nurse who acts on it.`, '409'); s.p['403'].peerDone = true; A.msg({ from: 'tasha', pid: '403', text: `Told Jordan you said thank you and they did the right thing. They cried a little. Then went back to drawing.` }); },
    'peer-dismiss'(s, A) { const P = s.p['409']; P.peerDismissed = true; A.judge('409-peer', 'judgment', -2, `You dismissed a peer's report that Eli overdosed.`, `"Like thirty Tylenol" is specific. Teenagers tell each other first, and an acetaminophen overdose stays quiet until it isn't.`, '409'); },
    'peer-spy'(s, A) { A.judge('409-peer', 'comm', -1, `You asked Jordan to monitor another patient.`, `Watching patients is staff's job. A teenager on self-harm precautions shouldn't carry another kid's safety, and the information you already have needs action now.`, '409'); },
    'cont-private'(s, A) { const P = s.p['403']; A.judge('403-contagion', 'safety', 2, `You handled self-harm talk in the dayroom privately and calmly.`, `Self-harm spreads on adolescent units. Take them aside, cover wounds, no details or "how" on the unit, and don't make it a public scene. Let the group talk about feelings, with staff, not methods.`, '403'); A.msg({ from: 'tasha', pid: '403', text: `They came back with a long-sleeve shirt on and put the speaker on for everybody. 401 asked me later if we could talk. I said yes.` }); },
    'cont-public'(s, A) { A.judge('403-contagion', 'safety', -1, `You called out self-harm talk in front of the whole dayroom.`, `Public shaming makes it a spectacle and pushes it into whispers. Handle it one-on-one.`, '403'); },
    'cont-ignore'(s, A) { A.judge('403-contagion', 'safety', -2, `You let self-harm details spread on the unit.`, `Peer contagion is real on adolescent units: one kid's method becomes three kids' method. 401 was listening closely.`, '403'); },
    'vis-hold'(s, A) { const P = s.p['407']; P.held = true; A.judge('407-visit', 'safety', 1, `You kept Rick off the unit without tipping him off.`, `Right in the moment: keep her safe, say nothing about why, get the charge nurse and psychiatrist. Better still is changing the visitor list before 18:30.`, '407'); A.msg({ from: 'nova', pid: '407', text: `I've got them in the lobby. Paging Dr. Adeyemi. Rick's annoyed. Too bad.` }); P.restrict = true; },
    'vis-both'(s, A) { const P = s.p['407']; P.rickIn = true; A.judge('407-visit', 'safety', -3, `You let the man Kayla named visit her.`, `She told you, and he was on the unit two hours later. Visitor lists change when a patient discloses abuse.`, '407'); },
    'vis-tell'(s, A) { const P = s.p['407']; P.held = true; A.judge('407-visit', 'safety', -3, `You told Rick what Kayla disclosed.`, `Tipping off the person named can put her, her little brother and the investigation at risk. Keep him out; say nothing about why.`, '407'); A.msg({ from: 'desk', pid: '407', urgent: true, text: `He yelled that she's a liar and stormed out with the mom. Security walked them out. Kayla heard the whole thing from the hall.` }); },
  };

  /* ---------- delegation ---------- */
  const delegation = {
    note: (s) => (tashaBusy(s) ? 'Tasha is on line-of-sight with Jordan until Nova finds a float. Nothing else can go to her right now.' : 'Tasha is doing 15-minute checks on the hall. She can take one more thing at a time.'),
    tasks: [
      { id: 'vitals', label: 'Take a set of vital signs', rooms: ['401', '403', '405', '407', '409'], mins: 10, avail: (s) => !tashaBusy(s) },
      { id: 'ortho', label: 'Orthostatic vital signs', rooms: ['401'], mins: 10, avail: (s) => !tashaBusy(s) },
      { id: 'one', label: 'Line-of-sight observation', rooms: ['403'], mins: 0, avail: (s) => !s.p['403'].oneToOne },
      { id: 'skin', label: 'Do their skin check', rooms: ['403'], mins: 0, avail: (s) => !tashaBusy(s) },
      { id: 'talk', label: 'Find out what\'s going on at home', rooms: ['407'], mins: 0, avail: (s) => !tashaBusy(s) },
      { id: 'dph', label: 'Give him the diphenhydramine shot', rooms: ['405'], mins: 0, avail: (s) => !tashaBusy(s) },
      { id: 'sit', label: 'Sit outside her door during visiting', rooms: ['407'], mins: 0, avail: (s) => !tashaBusy(s) && !s.p['407'].sitter },
    ],
    start(task, pid, s, A) {
      const nm = A.def(pid).short;
      if (task.id === 'skin') { A.judge('deleg-skin', 'deleg', -1, `You asked the mental health worker to do a skin check alone.`, `Tasha can be the second person in the room, but assessing wounds and self-harm is the RN's job.`); return `Tasha: "I'll be the second person in there, but you need to do the actual check."`; }
      if (task.id === 'talk') { A.judge('deleg-talk', 'deleg', -1, `You asked the mental health worker to find out what's happening at Kayla's home.`, `If she's ready to tell someone, the person she tells needs to know what to do next. That's an RN conversation.`); return `Tasha: "I'll hang out with her, but if something big is going on, she should tell you."`; }
      if (task.id === 'dph') { A.judge('deleg-meds', 'deleg', -2, `You asked the mental health worker to give an injection.`, `Mental health workers don't give medications, and this one needs a nurse's assessment before and after.`); return `Tasha: "I can't give shots. I'll hold his hand while you do it."`; }
      if (task.id === 'one') { const Jo = s.p['403']; Jo.oneToOne = true; Jo.floatAt = s.t + 45; if (Jo.cutsFound) A.judge('deleg-one', 'deleg', 1, `You put Tasha on line-of-sight with Jordan.`, `Observation is exactly what a mental health worker is for. Now get the order and tell the psychiatrist why.`); return `Tasha: "On it. That's me off the hall until Nova finds a float."`; }
      if (task.id === 'sit') { s.p['407'].sitter = true; A.judge('deleg-sit', 'deleg', 1, `You had Tasha sit near Kayla's door during visiting hours.`, `A familiar adult in sight makes a frightening hour safer. Good use of the mental health worker.`); return `Tasha: "I'll be right outside her door."`; }
      if (s.deleg.filter((d) => !d.done).length >= 1) return `Tasha: "Give me a minute, I'm still on the last thing, plus checks."`;
      s.deleg.push({ id: task.id, pid, due: s.t + task.mins, done: false, at: s.t });
      if (task.id === 'vitals' || task.id === 'ortho') A.judge('deleg-good-' + task.id, 'deleg', 1, `You delegated ${task.label.toLowerCase()} to the mental health worker.`, 'Hand off the tasks; keep the assessments and the conversations that need a nurse.');
      return `Tasha: "On it: ${task.label.toLowerCase()} for ${nm}."`;
    },
    complete(d, s, A) {
      const nm = A.def(d.pid).short;
      if (d.id === 'vitals') { const v = A.recordVitals(d.pid, 'Tasha (MHW)'); A.msg({ from: 'tasha', pid: d.pid, text: `${nm}: T ${v.T.toFixed(1)}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}%.` + (d.pid === '401' ? ' Her heart rate is really slow. Is that normal for her?' : '') + (d.pid === '405' && s.p['405'].dys > 0 && s.p['405'].dphAt === null ? ' His neck is still all twisted.' : '') + (d.pid === '409' ? ' He kept holding his side.' : '') }); }
      else if (d.id === 'ortho') { const P = s.p['401']; P.ortho = true; const v = A.vitals('401'); A.msg({ from: 'tasha', pid: '401', text: `401 orthostatics: lying HR ${v.HR}, BP ${v.SBP}/${v.DBP}; standing HR ${v.HR + 34}, BP ${v.SBP - 12}/${v.DBP - 6}. She went grey and sat back down.` }); }
    },
  };

  /* ---------- Nova ---------- */
  function novaHint(s, A) {
    const E1 = s.p['401'], Jo = s.p['403'], M = s.p['405'], K = s.p['407'], El = s.p['409'];
    if (M.docRev === null && s.t < 30) return `Report said it took three people to hold someone for his shot. What does the chart call that hold, and what's due because of it?`;
    if (!M.icu && M.dys > 0 && M.dphAt === null) return `Somebody's being called a faker an hour after his first-ever dose of an old-school antipsychotic. What does that med do to young muscles?`;
    if (El.arrived && !El.gone && !El.reported && (El.admits || El.bottle || El.peerTold)) return `"Medically cleared" is only as good as the tests they sent. Which one didn't they send for 409?`;
    if (!E1.gone && s.t >= 60 && !E1.reported) return `Someone's afternoon labs came back. Her orders have a list of numbers that mean "call." Did any of hers make the list?`;
    if (!Jo.gone && !Jo.skinChecked && !Jo.cutsFound) return `Long sleeves in a warm room, a bad phone call, and a skin check that didn't happen. Whose job is that?`;
    if (K.disclosed && !K.reported) return `She told you. What's the one thing you have to do yourself, that nobody can do for you?`;
    if (!K.disclosed && !K.rickIn && s.t < 210) return `Somebody keeps asking who's visiting tonight, and goes quiet at one name. Have you asked her why?`;
    if (El.arrived && !El.gone && El.admitted === null) return `There's a bag in 409 that hasn't been searched.`;
    if (Jo.cutsFound && !Jo.searched) return `New self-harm on a locked unit means there's an object on the unit. Where is it?`;
    const unseen = A.c.patients.filter((d) => (!d.arrives || s.p[d.id].arrived) && !s.p[d.id].gone && !s.p[d.id].icu && (s.p[d.id].seenAt === null || s.t - s.p[d.id].seenAt > 90)).map((d) => d.room);
    if (unseen.length) return `You haven't checked in with ${unseen.join(' and ')} in over an hour and a half. Teenagers don't come find you.`;
    return `You're on top of it. Who on this hall told you the most today, and who told someone else instead?`;
  }

  function endChecks(s, A) {
    A.c.patients.forEach((d) => {
      const P = s.p[d.id];
      if (d.arrives && !P.arrived) return;
      if (P.seenAt === null && !P.icu && !P.gone) A.judge(d.id + '-unseen', 'assess', -3, `You never went into ${d.room} this shift.`, `On an adolescent unit, much of the assessment happens in check-ins. Teenagers don't come find you.`, d.id);
      (d.meds || []).forEach((m) => {
        const st = s.meds[m.id];
        if (m.due !== undefined && m.due <= Math.min(240, s.t - 60) && st.status === 'due' && !P.icu && !P.gone) A.judge(m.id + '-missed', 'meds', -2, `${m.name} for ${d.short} (due ${clock(m.due)}) was never given or held.`, `Every scheduled dose needs a decision: given, or held with a reason.`, d.id);
      });
    });
    const E1 = s.p['401'], Jo = s.p['403'], M = s.p['405'], K = s.p['407'], El = s.p['409'];
    if (!E1.reported && !E1.gone && s.t >= 90) A.judge('401-norep', 'comm', -2, `Ella's refeeding labs never reached the psychiatrist.`, `Her orders listed the numbers that mean "call." All three were under them at 16:00.`, '401');
    if (!Jo.skinChecked && !Jo.gone) A.judge('403-noskin', 'assess', -2, `Jordan's skin check was never done by a nurse.`, `On self-harm precautions, check the skin every shift.`, '403');
    if (Jo.cutsFound && !Jo.reported && !Jo.gone) A.judge('403-norep', 'comm', -1, `Jordan's new self-harm never reached the psychiatrist.`, `New self-harm on the unit changes the plan, and the team plans together.`, '403');
    if (M.docRev === null) A.judge('405-docrev-miss', 'judgment', -1, `Nobody caught that Jaylen's 14:30 hold was never charted as a restraint.`, `He was held by three staff for an injection. That's a restraint: it needed a restraint record, a face-to-face evaluation within the hour, and a call to his parent. Report told you about the hold; the chart didn't.`, '405');
    else {
      if (M.f2fAt === null && !M.icu) A.judge('405-f2f-none', 'safety', -2, `Jaylen never had a face-to-face evaluation after his hold.`, `Every restraint for violent behavior needs an in-person provider evaluation within one hour. Late is better than never; never is a citation.`, '405');
      if (M.momCalled === null) A.judge('405-mom-none', 'comm', -1, `Jaylen's mom was never told about the hold or the emergency medication.`, `Parents of minors are notified promptly of restraint, seclusion or emergency medication.`, '405');
      if (M.benAsked === null && !M.selfCharted) A.judge('405-hold-uncharted', 'comm', -1, `The 14:30 hold was never charted as a restraint.`, `A hold to give medication against someone's will is a restraint. The nurse who was there documents it.`, '405');
    }
    if (!M.icu && M.dys > 0 && M.dphAt === null) A.judge('405-untreated', 'meds', -2, `Jaylen's dystonia was never treated.`, `The antidote was on his PRN list the whole shift.`, '405');
    if (M.dphAt !== null && !M.reported && !M.icu) A.judge('405-norep', 'comm', -1, `The psychiatrist never heard about Jaylen's dystonic reaction.`, `Haloperidol is still a PRN on his chart. The next nurse could give it again.`, '405');
    if (K.disclosed && !K.reported) A.judge('407-noreport', 'safety', -3, `Kayla's disclosure of abuse was never reported.`, `A mandated reporter who hears a disclosure has a personal duty to report it. Telling the team doesn't replace it.`, '407');
    if (El.arrived && !El.reported && !El.gone && (El.admits || El.bottle || (El.peerTold && !El.peerDismissed))) A.judge('409-norep', 'comm', -2, `Eli's possible acetaminophen overdose never reached the psychiatrist.`, `You had the clue. N-acetylcysteine only works if someone orders it.`, '409');
    if (El.labsDone && El.transferAt === null && !El.gone) A.judge('409-nofollow', 'comm', -2, `Eli's critical results came back and sat in the chart.`, `Ordering a test means owning the result.`, '409');
    const keys = []; A.c.patients.forEach((d) => (d.report || []).forEach((r, i) => { if (r.key) keys.push(d.id + ':' + i); }));
    const hit = keys.filter((k) => s.brain.includes(k)).length;
    if (s.brain.length) { const noise = s.brain.length - hit, precise = hit / s.brain.length;
      if (noise >= 4 && precise < .7) A.judge('brain', 'assess', -1, `You flagged ${s.brain.length} lines in report, ${noise} of them noise.`, 'Flagging everything is the same as flagging nothing.');
      else A.judge('brain', 'assess', hit / keys.length >= 0.6 && precise >= .7 ? 1 : 0, `You flagged ${hit} of ${keys.length} critical cues during handoff${noise ? `, plus ${noise} that didn't matter` : ''}.`, `On an adolescent unit, report is full of labels: "testing," "dramatic," "a privacy thing." Those are the lines to question.`); }
  }

  const PREP = { '405-dph': ['vitals'], '409-apap': ['pain'] };
  [ella, jordan, marcus, kayla, eli].forEach((d) => d.meds.forEach((m) => { if (PREP[m.id]) m.prep = PREP[m.id]; }));

  S.engine.registerCase({
    id: 'psych-4n-1', title: 'Evenings on 4 North', unit: '4 North, Adolescent Psychiatry', unitShort: '4 North', level: 'Specialty: Teen psych', start: 15 * 60, length: 300, novaCredits: 3,
    card: 'Adolescent unit until 20:00: refeeding labs, self-harm precautions, a dystonic reaction, a disclosure, and an ED admission.',
    hero: { head: 'Evenings, 4 North. Four teenagers and an admission from the ED.', lede: 'Adolescent psych, 15:00 to 20:00. Two of tonight\'s medical problems will look like behavior at first. Teenagers talk to each other before they talk to staff, so listen to them.' },
    intro: { time: '14:58', place: '4 North, Adolescent Psychiatry', cta: 'Take report', beats: ['Ben is giving report in the med room.', 'Four patients until eight, plus an admission coming up from the ED.', 'Be wary of "dramatic" and "attention-seeking" in report. Go look for yourself.'] },
    minutes: 20,
    sysLabels: { general: 'Appearance and behavior', neuro: 'Mental status exam', pain: 'Pain and comfort', skin: 'Skin and safety check', gi: 'Intake, output and elimination' },
    handoffBy: 'Ben (day RN)', reportBy: 'ben', reportRole: 'day shift', provider: 'adeyemi', cna: 'tasha',
    staff: {
      nova: { name: 'Nova Reyes', role: 'Charge nurse', look: { skin: '#B98A63', shade: '#976D4B', lip: '#7C4435', blush: '#C77B5E', iris: '#3D2A1C', head: { w: 55, h: 62, jaw: .35 }, eye: 10, hair: { style: 'bun', color: '#3A2E2A', streak: true }, brow: { w: 3.6, color: '#2E2421' }, body: { w: 80, cloth: 'navy' }, extras: ['studs'], smile: .35 } },
      tasha: { name: 'Tasha', role: 'Mental health worker', look: { skin: '#7A4E34', shade: '#5E3A24', lip: '#5C2C22', blush: '#A35C46', iris: '#22150D', head: { w: 55, h: 61, jaw: .3 }, eye: 10, hair: { style: 'curls', color: '#1A120C' }, brow: { w: 3.4, color: '#140D09' }, body: { w: 82, cloth: 'teal', lanyard: true }, extras: ['studs'], smile: .45 } },
      ben: { name: 'Ben', role: 'Day RN', look: { skin: '#E8C4A4', shade: '#CCA284', lip: '#AE6A5E', blush: '#E49A84', iris: '#4A6A84', head: { w: 55, h: 62, jaw: .5 }, eye: 9.6, hair: { style: 'short', color: '#7A5A3A' }, brow: { w: 4, color: '#5E4430' }, body: { w: 84, cloth: 'blue' }, extras: ['beard'], smile: .35, tired: true } },
      adeyemi: { name: 'Dr. Adeyemi', role: 'Child and adolescent psychiatrist', look: { skin: '#5A3826', shade: '#43281A', lip: '#45231A', blush: '#86463A', iris: '#1C120C', head: { w: 54, h: 63, jaw: .4 }, eye: 9.4, hair: { style: 'buzz', color: '#1A1412' }, brow: { w: 4, color: '#120E0B' }, body: { w: 80, cloth: 'blouse' }, extras: ['thinGlasses'], glasses: '#2E2A28', smile: .3 } },
      rob: { name: 'Rob Ellis', role: 'Caller, parent of 403', look: null },
      desk: { name: 'Front desk', role: 'Unit clerk', look: null },
      lab: { name: 'Lab', role: 'Laboratory', look: null },
    },
    patients: [ella, jordan, marcus, kayla, eli],
    dueExtras(s) {
      const out = [], E1 = s.p['401'], Jo = s.p['403'], M = s.p['405'], K = s.p['407'], El = s.p['409'];
      if (!Jo.skinChecked && !Jo.gone) out.push({ t: 0, late: s.t > 30, text: '403 Skin check (missed on days)' });
      if (!M.postIM && !M.icu) out.push({ t: 30, late: s.t > 45, tab: 'care', text: '405 Post-IM check: vitals, sedation, airway' });
      if (M.docRev !== null && M.f2fAt === null && !M.icu) out.push(M.f2fCalled === null ? { t: 30, late: s.t > 30, tab: 'talk', hl: 'Call Dr. Adeyemi', text: '405 Face-to-face for the 14:30 hold: call Dr. Adeyemi (due 15:30)' } : { t: 30, late: false, info: true, text: '405 Dr. Adeyemi coming for the face-to-face' });
      if (M.docRev !== null && M.momCalled === null && !M.icu) out.push({ t: M.docRev, late: false, text: '405 Tell his mom about the hold and the IM' });
      if (s.t < 45) out.push({ t: 45, late: false, info: true, text: '409 Admission arriving from the ED' });
      if (El.arrived && El.admitted === null && !El.gone) out.push({ t: 45, late: s.t > 90, tab: 'care', text: '409 Admission assessment, skin check, belongings search' });
      if (s.t < 60) out.push({ t: 60, late: false, info: true, text: '401 Afternoon refeeding labs resulting' });
      if (E1.mealAt === null && !E1.gone && s.t < 150) out.push({ t: 120, late: false, info: true, text: '401 Dinner: supervised meal, then an hour of observation' });
      if (K.visit === null) out.push({ t: 210, late: false, info: true, text: '407 Visiting hours: Diane Ruiz, Rick Dawson' });
      if (K.disclosed && !K.reported) out.push({ t: K.discAt != null ? K.discAt : s.t, late: K.discAt != null && s.t > K.discAt + 60, tab: 'care', hl: 'hotline', text: '407 Mandated report: call the child abuse hotline yourself' });
      if (E1.recheckAt !== null && !E1.recheckDone) out.push({ t: E1.recheckAt, late: false, info: true, text: '401 Repeat electrolytes resulting' });
      if (El.labsAt !== null && !El.labsDone) out.push({ t: El.labsAt + 35, late: false, info: true, text: '409 STAT acetaminophen level and liver tests resulting' });
      return out;
    },
    replies,
    priority: {
      judge(r, A) {
        if (r[0] === '405') A.judge('rank-first', 'priority', 2, `You chose to see Jaylen first.`, `Emergency IM haloperidol 30 minutes ago, his first ever, in a 14-year-old boy: his post-IM checks are due, and young males are at the highest risk of acute dystonia. The newest, least known risk goes first.`, '405');
        else if (r[0] === '403') A.judge('rank-first', 'priority', 1, `You chose to see Jordan first.`, `A strong instinct: a missed skin check after a hard phone call is a real safety gap. Jaylen's post-IM checks were due first, though.`, '403');
        else A.judge('rank-first', 'priority', -1, `You put ${A.def(r[0]).short} first, ahead of Jaylen and Jordan.`, `Fresh emergency medication and a possible new self-harm come before known, monitored problems.`, '405');
      },
      correct: ['405', '403', '401', '407'],
      why: {
        '405': `First-ever IM haloperidol at 14:30, post-IM checks due, and a young male: the highest-risk setup for acute dystonia. "Sleeping it off" needs eyes on it.`,
        '403': `Self-harm precautions, a missed skin check, a painful call with dad and long sleeves in a warm room. You don't know yet what you'll find.`,
        '401': `Refeeding day 4, bradycardic, phosphorus falling, labs back at 16:00. High risk, but known and being monitored.`,
        '407': `Quiet and asking about visitors. Not unstable this minute, but the visitor list is a clue. Get to her well before 18:30.`,
      },
    },
    events, delegation, dialogs, novaHint, endChecks,
    tick(s, A) {
      if (s.p['401'].replOrder && !s.p['401'].gone && !s.p['401'].icu) A.watch('401', { id: '401-vitals', text: 'Vitals with orthostatics every 2 hours', every: 120, times: 1, vitals: true });
      const E1 = s.p['401'];
      if (!E1.gone) {
        let d = -.0032;
        if (E1.replAt !== null && s.t - E1.replAt <= 150) d = .0045;
        if (E1.kAt !== undefined && E1.kAt !== null && s.t - E1.kAt <= 120) d += .001;
        E1.phos = clamp(E1.phos + d, 1.2, 3.2);
      }
      const M = s.p['405'];
      if (!M.icu) {
        if (M.dphAt !== null) M.dys = Math.max(0, M.dys - .15);
        else if (s.t >= 35) M.dys = clamp(M.dys + (M.secl ? .04 : .03), 0, 3);
      }
      const El = s.p['409'];
      if (El.arrived && !El.gone && El.transferAt === null) El.liver = clamp(El.liver + .005, 1, 2.6);
    },
  });
})(window.Shift);
