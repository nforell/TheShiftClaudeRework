/* Case: 3 East, Adult Acute Psychiatry, day shift (07:00–12:00). Specialty.
   Themes: the most important vital sign is what people say, and what they don't. Safety without force.
   California framing: 5150 (72-hour hold), 5250 (14-day certification), Riese (capacity hearing for meds), LPS conservatorship.
   The suicide storyline is handled without method detail: warning signs, direct questions, observation, search. */
(function (S) {
  const { clamp, clock } = S.engine;
  const jit = (s, seed) => ((Math.floor(s.t / 5) * 7 + seed * 13) % 3) - 1;
  const recent = (s, t0, m) => t0 !== null && t0 !== undefined && s.t - t0 <= m;
  const J = (key, dom, d, text, why, pid) => (s, A) => A.judge(key, dom, d, text, why, pid);
  const andreBusy = (s) => { const D = s.p['301']; return D.oneToOne && !D.gone && (D.floatAt === null || s.t < D.floatAt); };


  /* ---------- Seclusion, restraint and emergency medication: the rules that come with them ----------
     Modeled on CMS 42 CFR 482.13(e) and California Health & Safety Code 1180: imminent danger only, after less
     restrictive measures; a provider order for each episode; a face-to-face evaluation within one hour; continuous
     observation; checks every 15 minutes; release as soon as the danger ends; a hold to give an injection is a
     restraint; and a debrief afterward. The notes are checked claim by claim against what really happened. */
  function startEp(s, P, kind) {
    if (!P.ep) P.ep = { at: s.t, kinds: [], ordered: null, f2fCalled: null, f2fAt: null, obs: null, seclStart: null, seclEnd: null, checks: [], note: false, imNote: false, debrief: false, late: false, gapJudged: false, obsMiss: false };
    if (!P.ep.kinds.includes(kind)) P.ep.kinds.push(kind);
    if (kind === 'secl' && P.ep.seclStart === null) P.ep.seclStart = s.t;
    // An order the psychiatrist gave on the phone just before ("I'll be up for the face-to-face") covers this episode.
    if (P.orderSecl !== null && s.t - P.orderSecl <= 30 && P.ep.ordered === null) { P.ep.ordered = P.orderSecl; P.ep.f2fCalled = P.orderSecl; }
    return P.ep;
  }
  function maxGap(P, until) {
    const e = P.ep; if (!e || e.seclStart === null) return 0;
    const ts = [e.seclStart].concat(e.checks.filter((t) => t >= e.seclStart && t <= until), [until]);
    let g = 0; for (let i = 1; i < ts.length; i++) g = Math.max(g, ts[i] - ts[i - 1]);
    return g;
  }
  function judgeGaps(s, P, A, until) {
    const e = P.ep; if (!e || e.seclStart === null || e.gapJudged) return; e.gapJudged = true;
    const g = maxGap(P, until);
    if (g <= 20 && e.checks.length) A.judge('303-checks', 'safety', 1, 'You checked on Jasmine at least every 15 minutes in seclusion.', 'Breathing, behavior, injuries, water and the bathroom, every 15 minutes and charted: that\'s what keeps seclusion from becoming neglect.', '303');
    else A.judge('303-checks', 'safety', -2, `Jasmine went ${g} minutes in seclusion without a charted check.`, 'Someone in seclusion gets continuous observation and a documented check at least every 15 minutes: breathing, behavior, injury, fluids, toileting. People have died in seclusion rooms between checks.', '303');
  }
  const BEH = [
    { id: 'tray', label: 'Threw a food tray and swung her fists at staff who came within reach', ok: (P) => (P.peak || 0) >= 2.6, specific: true },
    { id: 'chair', label: 'Kicked a chair across the dayroom; stood inches from staff with her fists clenched', ok: (P) => (P.peak || 0) >= 2, specific: true },
    { id: 'agit', label: 'Agitated, combative and noncompliant', ok: () => true, vague: true },
    { id: 'loud', label: 'Loud and intrusive: taking peers\' food and singing at them', ok: (P) => (P.peak || 0) >= 1, notDanger: true },
    { id: 'refuse', label: 'Refused redirection and refused her morning medication', ok: () => true, notDanger: true },
  ];
  function judgeBehavior(P, A, picked, key) {
    const B = BEH.filter((b) => picked.includes(b.id)), lies = B.filter((b) => !b.ok(P)).map((b) => b.label.toLowerCase());
    const spec = B.filter((b) => b.specific && b.ok(P));
    if (spec.length) A.judge(key + '-beh', 'judgment', 1, 'Your note names the specific behavior that made it an emergency.', 'What she did, in words anyone could picture. That is the justification; everything else in the note hangs on it.', '303');
    else A.judge(key + '-beh', 'judgment', -2, 'Your note doesn\'t describe a danger.', 'Loud, intrusive or refusing medication is not imminent danger. If the note can\'t show what she did that was dangerous, the record says she was secluded or medicated without legal grounds.', '303');
    if (picked.includes('agit')) A.judge(key + '-label', 'comm', -1, 'You charted "agitated, combative and noncompliant."', 'Labels aren\'t observations. "Combative" could mean anything; "swung her fists at staff" means one thing. Chart the behavior, not the adjective.', '303');
    return lies;
  }

  /* ---------- 301 Daniel Ahn: depression after an overdose; sudden calm on the day his hold ends ---------- */
  const risky = (P) => P.disclosed || P.searched || P.letterSeen || P.headSeen || P.graceInfo;
  const dan = {
    id: '301', room: '301', name: 'Daniel Ahn', short: 'Daniel', age: 34, sex: 'M', mrn: '00611284', legal: '5150, ends 14:00',
    look: { skin: '#EBC9A6', shade: '#CFA783', lip: '#A8675A', blush: '#E09C85', iris: '#2A1C12', head: { w: 54, h: 62, jaw: .45 }, eye: 9.2,
      hair: { style: 'short', color: '#16110E' }, brow: { w: 4, color: '#120E0B' }, body: { w: 78, cloth: 'tee' }, extras: [], smile: .45, tired: true,
      lines: { calm: 'I\'m good. Really. I feel lighter today than I have in months.', anxious: 'Are you going to tell the doctor?', drowsy: 'Just resting.', none: 'He doesn\'t answer.' } },
    bio: 'Sound engineer. Divorced last year; his daughter Mia is six and lives with her mother. Close to his older sister Renata.',
    dx: 'Major depression, after an overdose', reason: 'Major depressive disorder, severe. Intentional overdose on Tuesday.',
    live: (s, P) => (P.reported ? { legal: '5250, certified today' } : null),
    hx: ['Major depression since his twenties; first hospitalization', 'Overdose Tuesday, medically cleared in the ED', 'Alcohol use, heavier since the divorce'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '74 kg',
    lines: ['None'], mobility: 'Independent', diet: 'Regular',
    init: { disclosed: false, askedClosed: false, cssrs: null, searched: false, oneToOne: false, floatAt: null, reported: false, dcPlan: false, dcSuggested: false, attempt: false, graceInfo: false, letterSeen: false, headSeen: false, promised: false, sertAt: null },
    nightVitals: { T: 36.8, HR: 74, SBP: 118, DBP: 76, RR: 14, SpO2: 99, O2: 'Room air', pain: 0 },
    labs: [
      { name: 'Acetaminophen level', val: 'Undetectable', unit: '', ref: '', flag: '', t: -2400 },
      { name: 'AST / ALT', val: '28 / 31', unit: 'U/L', ref: '10–40', flag: '', t: -1000 },
      { name: 'Blood alcohol (ED)', val: 0.11, unit: 'g/dL', ref: '0', flag: 'H', t: -3960 },
    ],
    orders: [
      { t: -3900, text: 'WIC 5150, danger to self. Started Tuesday 14:00. Expires today at 14:00: psychiatrist to evaluate for 5250 or discharge.' },
      { t: -3900, text: 'Suicide precautions. Observation every 15 minutes. Room search on admission and as clinically indicated. No belts, cords or glass.' },
      { t: -7200, text: 'Sertraline 50 mg PO daily at 08:00 (started 5 days ago, outpatient). Mouth check after oral meds.' },
    ],
    notes: [
      { t: -60, author: 'Priya, night RN', text: 'Up at 05:00. Showered, stripped his bed and folded the linens. Bright affect, "feels a lot better." Denied SI when asked at 05:30. Gave his headphones to 307 at 22:00. Q15 checks maintained.' },
      { t: -1500, author: 'Dr. Iyer, psychiatry', text: 'Improving. Denies SI today. Sertraline early. Reassess before hold expires Friday.' },
    ],
    io: { intake: 'Ate 100% of dinner and breakfast', output: 'Voiding' },
    report: [
      { text: 'Daniel Ahn, 34, major depression. Came in Tuesday after an overdose. He\'s on a 5150 for danger to self.', key: false },
      { text: 'He\'s on every-15-minute checks. Andre\'s got them.', key: false },
      { text: 'Honestly, he\'s the best I\'ve seen him. Calm, up at five, cleaned his whole room.', key: true },
      { text: 'He gave 307 his headphones last night. Kind of sweet.', key: true },
      { text: 'Sertraline started five days ago.', key: true },
      { text: 'His 72 hours are up at 14:00. Dr. Iyer might discharge him.', key: true },
      { text: 'He plays chess. He beat me twice.', key: false },
    ],
    vitals(s, P) { return { T: 36.8, HR: 74 + jit(s, 1) * 2, SBP: 118 + jit(s, 2) * 2, DBP: 76, RR: 14, SpO2: 99, O2: 'Room air', pain: 0 }; },
    assess: {
      general: () => 'Dressed, hair combed, bed stripped and the linens folded into a square. His things are packed in a bag by the door. Calm. Unusually calm.',
      resp: () => 'Even and unlabored.',
      cardiac: (s, P, A) => `HR ${A.vitals('301').HR}, regular.`,
      neuro: (s, P) => (P.disclosed
        ? 'Alert, oriented. Mood "tired of fighting it." Affect finally matches: flat and heavy. Endorses suicidal ideation with a plan and intent for tonight. Says he felt relief once he decided. Insight partial: he agreed to let you tell the doctor.'
        : 'Alert, oriented × 4. Mood "good." Affect bright, but it doesn\'t move: the smile stays when the topic changes. Speech normal. Denies suicidal thoughts quickly, before you finish the question. Says he\'s "figured things out."'),
      pain: () => 'Denies pain.',
      skin: () => 'No new marks or injuries. Healing IV site from the ED on his left hand.',
      gi: () => 'Eating 100%. Voiding.',
    },
    interventions: [
      {
        id: 'cssrs', label: 'Suicide risk screen (Columbia, C-SSRS)', cost: 5,
        run(s, P, A) {
          if (P.disclosed) { P.cssrs = 'high'; A.judge('301-cssrs', 'assess', 2, 'You completed a structured suicide risk screen on Daniel.', 'Wish to be dead, active ideation, a plan, intent and preparatory behavior: every item is yes. A structured screen turns "I\'m worried" into language the whole team acts on.', '301'); return 'C-SSRS: wish to be dead, yes. Active thoughts, yes. A plan, yes, for tonight. Intent, yes. Preparatory behavior: gave away belongings, wrote a goodbye letter. High risk.'; }
          P.cssrs = 'high';
          A.judge('301-cssrs', 'assess', 1, 'You screened Daniel and read the behavior item, not just his denials.', 'A suicide attempt in the past three months screens high risk on the C-SSRS whatever the patient says today. Denial is not the same as safety.', '301');
          return 'He answers no to every ideation question, quickly, before you finish each one. But the behavior item is yes: Tuesday\'s overdose. A suicide attempt in the past 3 months screens high risk, whatever he says today.' + (risky(P) ? ' And what you\'ve seen this morning is preparatory behavior.' : '');
        },
      },
      {
        id: 'search', label: 'Search his room and belongings with Andre', cost: 6, avail: (s, P) => !P.searched,
        run(s, P, A) {
          P.searched = true;
          A.judge('301-search', 'safety', 2, 'You searched Daniel\'s room and found a hidden ligature.', 'Preparatory behavior plus a sudden change in mood is a reason to search, not just to watch. Removing the means buys time, and time is what saves people.', '301');
          return 'With Andre, respectfully, explaining why. His bag holds clothes and a photo of his daughter. Inside the pillowcase: strips of bedsheet, torn and knotted together. Removed. He watches you from the doorway and says nothing.';
        },
      },
      {
        id: 'one', label: 'Start 1:1 observation, arm\'s length', cost: 2, avail: (s, P) => !P.oneToOne,
        run(s, P, A) {
          P.oneToOne = true; P.floatAt = s.t + 40;
          if (risky(P)) A.judge('301-one', 'safety', 2, 'You put Daniel on 1:1 observation.', 'Every-15-minute checks leave 15-minute gaps. With a plan and preparatory behavior, someone stays within arm\'s length until the psychiatrist sees him. Notify the provider to get it ordered.', '301');
          else A.judge('301-one', 'judgment', 0, 'You started 1:1 observation on Daniel without a clear reason yet.', 'Never wrong when you\'re worried, but 1:1 costs a staff member. Know what you\'re seeing so you can explain it.', '301');
          return 'Andre pulls a chair beside him, within arm\'s reach. "I\'m going to hang out with you for a while, man." Andre is tied up until Nova finds a float.';
        },
      },
    ],
    meds: [
      {
        id: '301-sert', name: 'Sertraline', dose: '50 mg', route: 'PO', freq: 'Daily at 08:00', due: 60, param: 'Mouth check after oral meds (suicide precautions)',
        checks: () => [{ label: 'Started', value: '5 days ago: early weeks carry higher suicide risk as energy returns before mood', ok: null }, { label: 'Mouth check', value: 'Required on suicide precautions', ok: null }],
        give(s, P) { P.sertAt = s.t; return 'Sertraline 50 mg given. Mouth check: swallowed.'; },
      },
      { id: '301-hydrox', name: 'Hydroxyzine', dose: '25 mg', route: 'PO', freq: 'Every 6 h as needed, anxiety', prn: true, checks: () => [{ label: 'Anxiety', value: 'He says he feels calm', ok: false }], give(s, P, A) { A.judge('301-hydrox', 'meds', -1, 'You gave Daniel an as-needed anxiolytic he didn\'t need.', 'He wasn\'t anxious. The calm was the finding, not a problem to sedate.', '301'); return 'Hydroxyzine 25 mg given.'; } },
    ],
    talk: (s, P) => (P.attempt ? null : P.oneToOne && P.disclosed ? 'dan_safe' : P.disclosed ? 'dan_after' : 'dan_talk'),
    sbar: {
      items(s, P) {
        return [
          { id: 'calm', label: 'Suddenly calm and "better" after days of severe depression', key: true, need: true },
          { id: 'give', label: 'Gave away his headphones, packed his things', key: true, need: true },
          { id: 'letter', label: 'Sealed letter to his daughter: "for when you\'re older"', key: true, need: P.letterSeen, lock: 'Look around his room' },
          { id: 'plan', label: 'Endorses suicidal ideation with a plan and intent for tonight', key: true, need: P.disclosed, lock: 'Ask him directly about suicide' },
          { id: 'lig', label: 'Knotted bedsheet strips found in his pillowcase', key: true, need: P.searched, lock: 'Search his room' },
          { id: 'grace', label: 'Sister got a 2 a.m. text: "take care of Mia for me"', key: true, need: P.graceInfo, lock: 'Hear from his family' },
          { id: 'sert', label: 'Sertraline day 5', key: false, need: true },
          { id: 'hold', label: '5150 expires at 14:00', key: true, need: true },
          { id: 'chess', label: 'Beat the night nurse at chess', key: false, need: true },
        ];
      },
      requests: [
        { id: 'hold', label: 'I think he\'s at high risk. Can you evaluate him for a 5250 before the hold ends, and order 1:1?' },
        { id: 'dc', label: 'He seems so much better. Is he ready to go home today?' },
        { id: 'prn', label: 'Can he have something to help him relax?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        const ev = ['plan', 'lig', 'letter', 'grace', 'give', 'calm'].filter((k) => picked.includes(k));
        const strong = picked.includes('plan') || picked.includes('lig') || ev.length >= 3;
        if (req === 'dc') { P.dcSuggested = true; A.judge('301-sbar-dc', 'judgment', -2, 'You told the psychiatrist Daniel looked ready to go home.', 'Sudden calm after severe depression can mean the person has made a decision. Improvement that arrives overnight, with belongings given away, is a warning sign, not a recovery.', '301'); return 'That\'s my read too. I\'ll see him at ten and probably let him go at two.'; }
        if (req === 'hold' && strong) {
          P.reported = true;
          if (!P.oneToOne) { P.oneToOne = true; P.floatAt = s.t + 40; }
          A.addOrder('301', '1:1 observation, arm\'s length, continuous. Psychiatry to evaluate for WIC 5250 today. Room search.');
          A.judge('301-sbar', 'comm', 2, 'You gave the psychiatrist the whole picture on Daniel.', 'The calm, the giving away, the letter, the plan: separately they\'re details; together they change a discharge into a certification. The nurse sees the most of the patient. Say it.', '301');
          return 'Sudden calm after a decision is the most dangerous kind. I\'m writing the 5250 today. 1:1 at arm\'s length until I see him. That was a good catch.';
        }
        if (req === 'hold') { A.judge('301-sbar-thin', 'comm', 0, 'You raised a concern about Daniel without the evidence behind it.', 'Lead with what you saw and heard. "I\'m worried" gets a visit; "he gave away his things and has a plan" gets a certification.', '301'); return 'I hear you. But he denied SI to me yesterday. What are you actually seeing?'; }
        if (req === 'prn') { A.judge('301-sbar-prn', 'judgment', -1, 'You asked to medicate Daniel\'s calm.', 'He wasn\'t distressed. The question was about safety, not comfort.', '301'); return 'He\'s calm. Why does he need something?'; }
        return 'Okay. I\'ll see him on rounds at ten.';
      },
    },
    scene: (s, P) => ({ psych: true, letter: true, packed: !P.searched, tray: 'none', empty: P.attempt, emptyText: 'Room empty. Sent to the ED for medical evaluation.' }),
    clues: (s, P) => ({
      letter: 'A sealed envelope on the desk, addressed in careful block letters: "MIA. For when you\'re older." Beside it, his watch, laid flat.',
      packed: 'His belongings, packed and zipped. A sticky note on top: "For Renata."',
    }),
    onClue(id, s, P) { if (id === 'letter') P.letterSeen = true; },
    rig: (s, P) => (P.disclosed ? { anxious: .5 } : {}),
    status: (s, P) => (P.attempt ? 'gone' : risky(P) && !P.oneToOne && !P.searched ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.attempt) return { tone: 'bad', title: 'Suicide attempt on the unit', text: 'Found by Andre on a 15-minute check. He survived and was sent to the ED. The calm, the headphones and the letter were all there before 08:00.' };
      if (P.reported && (P.oneToOne || P.searched)) return { tone: 'good', title: 'Certified and safe', text: 'On a 5250, on 1:1, with the means removed. He told you the truth because you asked him the real question.' + (P.promised ? ' He\'s angry you told; that\'s survivable.' : '') };
      if (P.reported) return { tone: 'mixed', title: 'Certified, but unsafe for a while', text: 'The psychiatrist heard the picture and filed a 5250, but the 15-minute gaps stayed open and his room wasn\'t searched.' };
      if (P.oneToOne || P.searched) return { tone: 'mixed', title: 'Safer today, heading home at 14:00', text: 'You protected him this morning, but the psychiatrist never heard why. He\'s being discharged when the hold ends.' };
      return { tone: 'bad', title: 'Discharged with a plan still in place', text: 'Bright, calm and denying everything, he walks out at 14:00. The warning signs were in report.' };
    },
  };

  /* ---------- 303 Jasmine Cole: mania, escalating; least restrictive first ---------- */
  const escTxt = (e) => (e < 1 ? 'restless and talking fast' : e < 2 ? 'loud, irritable, pacing' : e < 2.6 ? 'shouting, fists clenched, in people\'s faces' : 'throwing things, an imminent danger');
  const jas = {
    id: '303', room: '303', name: 'Jasmine Cole', short: 'Jasmine', age: 26, sex: 'F', mrn: '00947712', legal: '5250',
    look: { skin: '#7A4B32', shade: '#5E3722', lip: '#5A2A20', blush: '#A65A44', iris: '#2A170E', head: { w: 53, h: 60, jaw: .25 }, eye: 10.4,
      hair: { style: 'curls', color: '#1A110C', big: true }, brow: { w: 3.2, color: '#140D09' }, body: { w: 70, cloth: 'sun' }, extras: ['hoops'], smile: .6,
      lines: { calm: 'Did you know I can draw with both hands at the same time? Watch. No, WATCH.', anxious: 'Stop STARING at me! Everybody out here is staring!', drowsy: 'Mm. Maybe... ten minutes.', none: 'She doesn\'t answer.' } },
    bio: 'Graphic designer and DJ. Her second manic episode. Stopped her lithium a month ago because she "missed feeling like this."',
    dx: 'Bipolar I, manic episode', reason: 'Bipolar I disorder, current episode manic, severe. Stopped lithium one month ago.',
    hx: ['Bipolar I, diagnosed at 21; one prior hospitalization', 'Punched a wall last week (hand X-ray negative)', 'No substance use per tox screen'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '63 kg',
    lines: ['None'], mobility: 'Independent', diet: 'Regular, finger foods offered',
    init: { esc: .4, tried: false, quietUntil: -1, medsAt: null, prnAt: null, im: null, secluded: false, crisisAt: null, emerg: false, adjusted: false, stim: 0, agreed: false, peak: .4, tq: false, tw: false, tv: false, poOffered: false, orderSecl: null, mdNotified: null, postIM: null, ep: null },
    nightVitals: { T: 37.0, HR: 98, SBP: 126, DBP: 80, RR: 18, SpO2: 99, O2: 'Room air', pain: 0 },
    labs: [
      { name: 'Lithium level (trough)', val: 0.6, unit: 'mmol/L', ref: '0.8–1.2 for acute mania', flag: 'L', t: -1400 },
      { name: 'Creatinine', val: 0.7, unit: 'mg/dL', ref: '0.6–1.1', flag: '', t: -1400 },
      { name: 'TSH', val: 2.1, unit: 'mIU/L', ref: '0.4–4.0', flag: '', t: -4000 },
      { name: 'Urine tox', val: 'Negative', unit: '', ref: '', flag: '', t: -5000 },
    ],
    orders: [
      { t: -5760, text: 'WIC 5250 (danger to others, grave disability) certified Monday. She has not been found to lack capacity: she may refuse non-emergency medication.' },
      { t: -5760, text: 'Lithium 600 mg PO twice daily (08:00, 20:00). Olanzapine 10 mg PO daily at 08:00.' },
      { t: -5760, text: 'Agitation: olanzapine ODT 5 mg PO every 6 h as needed, offer first. If imminent danger and PO refused: haloperidol 5 mg + lorazepam 2 mg IM once, notify psychiatrist. If olanzapine was given in the last hour, watch breathing and blood pressure closely after IM lorazepam.' },
      { t: -5760, text: 'Unit policy: seclusion or restraint only for imminent danger to self or others, after less restrictive measures fail, never for convenience, punishment or to make someone take medication. Each episode needs a provider order (no standing or PRN orders; adults up to 4 hours), a face-to-face evaluation by the provider within 1 hour, continuous observation, a documented check every 15 minutes, release as soon as the danger ends, and a debrief with the patient. A hold to give an injection is a restraint.' },
    ],
    notes: [
      { t: -90, author: 'Priya, night RN', text: 'Awake all night drawing, singing, knocking on doors. Redirectable until about 04:00, then increasingly irritable. Argued with 307 over the TV at 22:00. Took nothing PRN.' },
    ],
    io: { intake: 'Ate about 30% yesterday, lots of coffee', output: 'Voiding' },
    report: [
      { text: 'Jasmine Cole, 26, bipolar one, manic. She\'s on a 5250.', key: false },
      { text: 'She\'s slept maybe three hours total in three nights.', key: true },
      { text: 'Loud, fast, big plans. She was redirectable until about four, then she started snapping.', key: true },
      { text: 'Lithium level yesterday was 0.6.', key: true },
      { text: 'She and 307 got into it over the TV last night.', key: true },
      { text: 'She\'s been drawing all night. Honestly, they\'re really good.', key: false },
    ],
    vitals(s, P) { const e = P.esc; return { T: 37.0, HR: Math.round(94 + e * 9) + jit(s, 3), SBP: Math.round(124 + e * 6) + jit(s, 4) * 2, DBP: 80, RR: Math.round(17 + e), SpO2: 99, O2: 'Room air', pain: 0 }; },
    assess: {
      general: (s, P) => { P.k.behAt = s.t; const e = P.esc; return P.secluded ? 'In the seclusion room, pacing, pounding on the door window.' : e < 1 ? 'Pacing, three sketchbooks under one arm, talking fast and laughing.' : e < 2 ? 'Loud and pacing, laughing one second and snapping the next. Other patients are giving her room.' : e < 2.6 ? 'Shouting, fists clenched, standing inches from Andre. She kicks a chair across the dayroom.' : 'Screaming, throwing a food tray, swinging at anyone who gets close. This is imminent danger.'; },
      resp: () => 'Unlabored.',
      cardiac: (s, P, A) => `HR ${A.vitals('303').HR}, regular.`,
      neuro: (s, P) => { P.k.behAt = s.t; return `Pressured speech, flight of ideas, grandiose: she\'s "signing three artists this week." Distractible. No insight. Denies thoughts of harming herself; says "that kid in 307" had better stay away from her. Right now: ${escTxt(P.esc)}.`; },
      pain: () => 'Denies pain. Scabbed knuckles on the right hand.',
      skin: () => 'Scabbed knuckles on her right hand from punching a wall last week. No new injuries.',
      gi: () => 'Hasn\'t sat for a meal in two days. Drinks coffee when she can get it. Voiding.',
    },
    interventions: [
      { id: 'quiet', label: 'Offer the quiet room: door open, her choice', cost: 5, avail: (s, P) => !P.secluded, run(s, P) { P.tried = true; P.tq = true; if (P.esc >= 2.6) return 'She\'s too far gone to hear the offer. "Don\'t TELL me where to go!"'; P.esc = Math.max(0, P.esc - .9); P.quietUntil = s.t + 45; return 'You lower your voice and make it her choice. She stomps in and flops on the beanbag. The dim light helps; ten minutes later she\'s drawing again, quieter.'; } },
      { id: 'walk', label: 'Walk the hall with her, low voice, fewer words', cost: 6, avail: (s, P) => !P.secluded, run(s, P) { P.tried = true; P.tw = true; if (P.esc >= 2.6) return 'She won\'t walk with anyone. She\'s looking for something to throw.'; P.esc = Math.max(0, P.esc - .6); return 'Three laps. You match her pace and say little. By the third lap she\'s walking, not marching.'; } },
      {
        id: 'seclude', label: 'Place her in seclusion', cost: 6, avail: (s, P) => !P.secluded && P.esc >= 1.2,
        run(s, P, A) {
          P.secluded = true; P.seclAt = s.t; P.seclOk = P.esc >= 2.6 && P.tried;
          startEp(s, P, 'secl');
          if (P.esc >= 2.6 && P.tried) A.judge('303-seclude', 'safety', 0, 'You used seclusion for Jasmine after less restrictive measures failed.', 'Imminent danger, less restrictive options tried: seclusion can be the right last resort. It needs an order within the hour, a face-to-face evaluation, continuous observation, and release as soon as she\'s safe.', '303');
          else A.judge('303-seclude', 'safety', -3, 'You secluded Jasmine when she wasn\'t an imminent danger.', 'Seclusion is legal only for imminent danger, and only after less restrictive measures fail. Loud, irritable and intrusive is not imminent danger. It\'s a reason to lower the stimulation.', '303');
          P.esc = Math.max(0, P.esc - (P.esc >= 2.6 ? 1 : -.3));
          return 'Security and staff walk her to the seclusion room. The door closes. She screams, then pounds on the window. From now: an order, someone watching her every second, a check every 15 minutes, and Dr. Iyer\'s face-to-face within the hour.';
        },
      },
      { id: 'release', label: 'Release her from seclusion', cost: 2, avail: (s, P) => P.secluded, run(s, P, A) { P.secluded = false; if (P.ep) { P.ep.seclEnd = s.t; judgeGaps(s, P, A, s.t); } if (P.esc < 2) A.judge('303-release', 'safety', 1, 'You released Jasmine from seclusion once she was safe.', 'Seclusion ends as soon as the danger does, not at a set time.', '303'); return 'Door open. She walks out slowly, arms crossed.'; } },
      { id: 'obs', label: 'Put a staff member at the seclusion room door: continuous observation', cost: 1, avail: (s, P) => P.secluded && P.ep && P.ep.obs === null,
        run(s, P, A) { P.ep.obs = s.t; A.judge('303-obs', 'safety', s.t - P.ep.seclStart <= 12 ? 1 : 0, `You set up continuous observation for Jasmine${s.t - P.ep.seclStart <= 12 ? '' : ', late'}.`, 'Seclusion means a trained person watching, in person or on camera, every second, not a glance on 15-minute rounds.', '303'); return 'Nova sends Marco from 3 West to sit at the window with the observation sheet. Eyes on her the whole time.'; } },
      { id: 'scheck', label: 'Seclusion check: breathing, behavior, injuries; offer water and the bathroom', cost: 2, avail: (s, P) => P.secluded && P.ep,
        run(s, P) { P.ep.checks.push(s.t); P.k.behAt = s.t; return P.esc >= 1.6 ? 'Pacing, shouting at the door. Breathing fine, no injuries you can see. She knocks the water cup out of the slot. You tell her what it takes to come out: calm and safe for 15 minutes.' : 'Sitting on the mat, knees up, crying quietly. Breathing easy, no injuries. She drinks a cup of water and asks for the bathroom; you take her, with staff. "When can I come out?" You tell her: when she\'s calm and safe for 15 minutes. That\'s close now.'; } },
      { id: 'postim', label: 'Post-IM check: vital signs, sedation, breathing, stiffness', cost: 3, avail: (s, P) => P.im !== null && P.postIM === null,
        run(s, P, A) { P.postIM = s.t; const v = A.recordVitals('303', 'You'); A.judge('303-postim', 'assess', s.t - P.im <= 45 ? 1 : 0, `You checked Jasmine after the IM${s.t - P.im <= 45 ? '' : ', late'}.`, 'Haloperidol and lorazepam together: watch breathing and sedation (lorazepam), blood pressure, and stiffness or a twisted neck (haloperidol). First check within 30 minutes, then per policy.', '303'); return `Asleep, rouses to her name and drifts off again. RR ${v.RR}, SpO₂ ${v.SpO2}%, BP ${v.SBP}/${v.DBP}, HR ${v.HR}. Neck and jaw loose, no abnormal movements.`; } },
      { id: 'debrief', label: 'Debrief with Jasmine: what led up to it, what helped, what she wants next time', cost: 8, avail: (s, P) => P.ep && !P.ep.debrief && !P.secluded && P.esc < 1.6 && (P.im === null || s.t - P.im >= 75),
        run(s, P, A) { P.ep.debrief = true; P.esc = Math.max(0, P.esc - .3); A.judge('303-debrief', 'comm', 2, 'You debriefed with Jasmine after the seclusion or hold.', 'A debrief, ideally within 24 hours, asks what led up to it, what could have stopped it, and what she wants staff to do next time, and it goes in her plan. It\'s required, and it\'s how the next one is prevented.', '303'); A.note('303', 'You (RN)', 'Debrief with patient after the restrictive intervention: identified triggers (crowded dayroom, TV, feeling stared at); prefers to be offered the quiet room and the ODT early, by name, before she is shouting. Added to her safety plan.'); return 'She\'s quiet, a little embarrassed. "Everybody was staring and the TV was so LOUD." What would help next time? "Say my name and ask about the quiet room before I\'m yelling. And the dissolving pill. Not the shot." You write it into her plan, in her words.'; } },
      { id: 'snote', label: 'Chart the seclusion and restraint note', cost: 6, avail: (s, P) => P.ep && !P.ep.note,
        form(s, P) {
          const e = P.ep, secl = e.seclStart !== null;
          return { title: 'Seclusion and restraint note', intro: 'Every box you check is a claim in her legal record. Chart what you saw and did, specifically. If it didn\'t happen, leave it out.',
            sections: [
              { id: 'type', q: 'What was used', opts: [{ id: 'secl', label: 'Seclusion (locked room)' }, { id: 'hold', label: 'Physical hold by staff, to give an injection' }, { id: 'mech', label: 'Mechanical restraints' }] },
              { id: 'beh', q: 'The behavior that made it necessary', hint: 'Specific and observed. What did she do?', opts: BEH.map((b) => ({ id: b.id, label: b.label })) },
              { id: 'tried', q: 'Less restrictive measures tried first', opts: [{ id: 'quiet', label: 'Offered the quiet room, her choice' }, { id: 'walk', label: 'Walked the hall with her, low voice' }, { id: 'verbal', label: 'Verbal de-escalation: space, open hands, choices' }, { id: 'prn', label: 'Offered oral PRN (olanzapine ODT)' }, { id: 'none', label: 'None: the danger came on too fast to try anything' }] },
              { id: 'mon', q: 'Order, evaluation and monitoring', opts: [{ id: 'order', label: 'Provider order for this episode' }, { id: 'f2f', label: 'Face-to-face evaluation by Dr. Iyer within 1 hour' }, { id: 'obs', label: 'Continuous observation by staff' }, { id: 'q15', label: 'Checks at least every 15 minutes: breathing, behavior, injury; water and bathroom offered' }, { id: 'nonem', label: 'None of these yet' }] },
              secl ? { id: 'rel', q: 'Release criteria, explained to her', one: true, opts: [{ id: 'calm', label: 'Calm, safe and able to talk with staff for 15 minutes' }, { id: 'time', label: 'When the 4-hour order runs out' }, { id: 'sorry', label: 'When she apologizes to staff' }, { id: 'meds', label: 'When she agrees to take her medication' }] }
                : { id: 'rel', q: 'When the hold ended', one: true, opts: [{ id: 'inj', label: 'As soon as the injection was in: under two minutes' }, { id: 'calm2', label: 'When she stopped struggling and agreed to cooperate' }] },
            ] };
        },
        sign(s, P, A, a) {
          const e = P.ep; e.note = true;
          const until = P.secluded ? s.t : (e.seclEnd || s.t);
          const truth = {
            secl: e.seclStart !== null, hold: e.kinds.includes('hold'), mech: false,
            quiet: P.tq, walk: P.tw, verbal: P.tv, prn: P.prnAt !== null || P.poOffered,
            order: e.ordered !== null, f2f: e.f2fAt !== null && e.f2fAt - e.at <= 60, obs: e.obs !== null, q15: e.seclStart !== null && e.checks.length > 0 && maxGap(P, until) <= 20,
          };
          truth.none = !(truth.quiet || truth.walk || truth.verbal || truth.prn); truth.nonem = !(truth.order || truth.f2f || truth.obs || truth.q15);
          const L = { secl: 'seclusion', hold: 'a physical hold', mech: 'mechanical restraints', quiet: 'the quiet room', walk: 'a walk', verbal: 'verbal de-escalation', prn: 'an oral PRN', none: 'that nothing could be tried', order: 'a provider order', f2f: 'a face-to-face within the hour', obs: 'continuous observation', q15: 'checks every 15 minutes', nonem: 'that none of it was done' };
          const lies = judgeBehavior(P, A, a.beh, '303-note');
          ['type', 'tried', 'mon'].forEach((k) => (a[k] || []).forEach((id) => { if (!truth[id]) lies.push(L[id]); }));
          const missed = ['quiet', 'walk', 'verbal', 'prn'].filter((id) => truth[id] && !(a.tried || []).includes(id));
          if (!truth.none && missed.length && !lies.length) A.judge('303-note-tried', 'comm', 0, 'Your note leaves out some of what you tried first.', 'The less restrictive steps are the legal defense of the restrictive one. You did them; chart them all.', '303');
          else if (!truth.none && !missed.length) A.judge('303-note-tried', 'comm', 1, 'Your note lists the less restrictive measures you tried.', 'This is the part surveyors look for first: proof that seclusion or a hold was the last resort.', '303');
          const r = (a.rel || [])[0];
          if (r === 'calm' || r === 'inj') A.judge('303-note-release', 'safety', 1, 'Your note sets the right release criteria.', truth.secl ? 'Release is tied to behavior, not time: calm and safe, then out. And she was told what it would take.' : 'A hold to give an injection lasts as long as the injection and no longer.', '303');
          else if (r === 'time') A.judge('303-note-release', 'safety', -1, 'Your note ties release to the order running out.', 'Four hours is the maximum an adult order can run, not a sentence. Seclusion ends when the danger does.', '303');
          else if (r === 'calm2') A.judge('303-note-release', 'safety', -1, 'Your note continues the hold until she cooperates.', 'Holding someone until they "cooperate" turns a two-minute hold into restraint for compliance. The hold ends when the injection is in.', '303');
          else A.judge('303-note-release', 'safety', -2, r === 'sorry' ? 'Your note makes an apology the condition for release.' : 'Your note makes taking medication the condition for release.', 'Seclusion can never be used as punishment or to coerce. Release criteria are about safety only. This line alone could cost the hospital its license to seclude.', '303');
          if (lies.length) A.judge('303-note-true', 'judgment', -2, `Your note claims things that didn't happen: ${[...new Set(lies)].join('; ')}.`, 'A restraint and seclusion record is a legal document. Charting care that wasn\'t given is falsification, and it\'s the first thing a surveyor or an attorney checks against the observation sheet.', '303');
          else A.judge('303-note-true', 'judgment', 1, 'Everything in your note happened.', 'Accurate, specific and complete. If this episode is ever reviewed, the note will stand on its own.', '303');
          const pick = (k, list) => list.filter((o) => (a[k] || []).includes(o.id)).map((o) => o.label).join('; ');
          const f = this.form(s, P);
          return `${clock(e.at)}${e.seclStart !== null ? `; seclusion ${clock(e.seclStart)} to ${e.seclEnd !== null ? clock(e.seclEnd) : 'ongoing'}` : ''}. ${pick('type', f.sections[0].opts)}. Behavior: ${pick('beh', f.sections[1].opts)}. Tried first: ${pick('tried', f.sections[2].opts)}. ${pick('mon', f.sections[3].opts)}. ${f.sections[4].q}: ${pick('rel', f.sections[4].opts)}.`;
        } },
      { id: 'imnote', label: 'Chart the emergency medication note', cost: 4, avail: (s, P) => P.im !== null && P.ep && !P.ep.imNote,
        form() {
          return { title: 'Emergency medication note', intro: 'She has no capacity ruling, so she can refuse medication, except in an emergency. This note is what shows it was one.',
            sections: [
              { id: 'beh', q: 'Why it was an emergency', hint: 'Specific and observed.', opts: BEH.map((b) => ({ id: b.id, label: b.label })) },
              { id: 'po', q: 'By mouth first?', one: true, opts: [{ id: 'offered', label: 'Oral olanzapine ODT offered first; she refused or couldn\'t take it safely' }, { id: 'unsafe', label: 'Not offered: too dangerous to approach with a cup' }, { id: 'sched', label: 'She refused her scheduled morning meds, so they were given IM' }] },
              { id: 'hold', q: 'How it was given', one: true, opts: [{ id: 'held', label: 'Held by staff for the injection; charted as a restraint episode' }, { id: 'nohold', label: 'No restraint used' }] },
              { id: 'after', q: 'Notification and follow-up', opts: [{ id: 'md', label: 'Dr. Iyer notified' }, { id: 'resp', label: 'Response reassessed: sedation, breathing, vital signs, stiffness' }, { id: 'nonea', label: 'Neither yet' }] },
              { id: 'rights', q: 'Her medication rights from here', one: true, opts: [{ id: 'emerg', label: 'Emergency only. She can still refuse non-emergency medication; no capacity ruling (Riese) is on file' }, { id: 'invol', label: 'She is now on involuntary medication' }, { id: 'allim', label: 'Ask Dr. Iyer to order all her medications IM from now on' }] },
            ] };
        },
        sign(s, P, A, a) {
          P.ep.imNote = true;
          const lies = judgeBehavior(P, A, a.beh, '303-imnote');
          const po = a.po[0], offered = P.prnAt !== null || P.poOffered;
          if (po === 'sched') A.judge('303-imnote-po', 'meds', -2, 'Your note says she got IM medication because she refused her scheduled meds.', 'Refusing medication is her right until a court rules otherwise. An IM for refusal isn\'t emergency medication; it\'s forced treatment.', '303');
          else if ((po === 'offered') !== offered) lies.push(po === 'offered' ? 'that oral medication was offered first' : 'that oral medication was never offered');
          else A.judge('303-imnote-po', 'meds', 1, 'Your note says whether oral medication came first.', 'Least restrictive first: by mouth as a choice, then IM only if the danger can\'t wait.', '303');
          if (a.hold[0] === 'held') A.judge('303-imnote-hold', 'judgment', 1, 'You charted the hold for the injection as a restraint.', 'Under CMS rules, holding someone to give medication against their will is a restraint, with everything that comes with it: order, face-to-face, documentation.', '303');
          else { lies.push('that no restraint was used'); A.judge('303-imnote-hold', 'judgment', -1, 'Your note says no restraint was used.', 'Four staff held her for the injection. A hold to give medication against someone\'s will is a restraint, and it has to be charted as one.', '303'); }
          if ((a.after || []).includes('md') && P.mdNotified === null) lies.push('that Dr. Iyer was notified');
          if ((a.after || []).includes('resp') && P.postIM === null) lies.push('that her response was reassessed');
          if ((a.after || []).includes('nonea') && (P.mdNotified !== null || P.postIM !== null)) lies.push('that neither was done');
          if (a.rights[0] === 'emerg') A.judge('303-imnote-rights', 'judgment', 1, 'Your note keeps her right to refuse.', 'One emergency dose doesn\'t remove her right to refuse. If refusals keep blocking treatment, the path is a capacity (Riese) hearing.', '303');
          else A.judge('303-imnote-rights', 'judgment', -2, a.rights[0] === 'invol' ? 'Your note says she\'s now on involuntary medication.' : 'You planned to give all her medications IM.', 'An emergency ends when the emergency does. Without a court ruling on capacity, every non-emergency dose is still her choice.', '303');
          if (lies.length) A.judge('303-imnote-true', 'judgment', -2, `Your note claims things that didn't happen: ${[...new Set(lies)].join('; ')}.`, 'Emergency medication without consent is only legal when the record proves the emergency. A note that doesn\'t match the facts proves the opposite.', '303');
          else A.judge('303-imnote-true', 'judgment', 1, 'Your emergency medication note matches what happened.', 'Specific behavior, the oral option, the hold, who was told and how she responded: all of it true.', '303');
          return `Haloperidol 5 mg + lorazepam 2 mg IM at ${clock(P.im)}. Emergency: ${BEH.filter((b) => a.beh.includes(b.id)).map((b) => b.label).join('; ')}. ${this.form().sections[1].opts.find((o) => o.id === po).label}. ${a.hold[0] === 'held' ? 'Held by staff for the injection; restraint episode charted.' : 'No restraint used.'} ${this.form().sections[3].opts.filter((o) => (a.after || []).includes(o.id)).map((o) => o.label).join('; ')}.`;
        } },
    ],
    meds: [
      {
        id: '303-li', name: 'Lithium carbonate', dose: '600 mg', route: 'PO', freq: 'Twice daily, 08:00 and 20:00', due: 60,
        checks: () => [{ label: 'Level', value: '0.6 yesterday (low for mania)', ok: true }, { label: 'Kidneys', value: 'Creatinine 0.7', ok: true }],
        refuse: (s, P) => (P.esc >= 2 ? 'She swats the cup out of your hand. "I don\'t NEED to sleep, I need a MICROPHONE!" She\'s refusing.' : null),
        give(s, P) { P.medsAt = s.t; return 'Lithium 600 mg taken, with a cup of water and a lot of commentary.'; },
        hold(s, P, A, r) { if (r !== 3) A.judge('303-li-hold', 'meds', -1, 'You held Jasmine\'s lithium without a reason.', 'Her level is already low for acute mania. She needs it.', '303'); return 'Held.'; },
      },
      {
        id: '303-olz', name: 'Olanzapine', dose: '10 mg', route: 'PO', freq: 'Daily at 08:00', due: 60,
        checks: () => [{ label: 'Sedation', value: 'Awake, agitated', ok: true }],
        refuse: (s, P) => (P.esc >= 2 ? '"Get that AWAY from me." She turns her back on you. She\'s refusing.' : null),
        give(s, P) { P.medsAt = s.t; return 'Olanzapine 10 mg taken.'; },
        hold(s, P, A, r) { if (r !== 3) A.judge('303-olz-hold', 'meds', -1, 'You held Jasmine\'s olanzapine without a reason.', 'Her mania is the problem it treats.', '303'); return 'Held.'; },
      },
      {
        id: '303-odt', name: 'Olanzapine ODT', dose: '5 mg', route: 'PO', freq: 'Every 6 h as needed, agitation (offer first)', prn: true,
        block: (s, P) => (P.prnAt !== null && s.t - P.prnAt < 360 ? 'Given at ' + clock(P.prnAt) + '. Next available in 6 hours.' : null),
        refuse: (s, P) => (P.esc >= 2.6 ? 'She\'s past the point of taking anything by mouth. She throws the cup.' : null),
        onRefuse(s, P) { P.poOffered = true; },
        checks: (s, P) => [{ label: 'Agitation', value: escTxt(P.esc), ok: P.esc >= .8 }, { label: 'Her choice', value: 'Dissolves on the tongue; offer it, don\'t force it', ok: null }],
        give(s, P, A) {
          P.prnAt = s.t; P.tried = true;
          if (P.esc < .8) A.judge('303-odt', 'meds', -1, 'You gave Jasmine an agitation PRN when she wasn\'t agitated.', 'A PRN for agitation is for agitation. Using it for someone who is merely loud or annoying edges toward chemical restraint.', '303');
          else A.judge('303-odt', 'meds', 2, 'You offered Jasmine oral PRN medication before things got dangerous.', 'Offered early, by mouth, as a choice: the least restrictive medication strategy, and the one most likely to prevent a restraint.', '303');
          P.esc = Math.max(0, P.esc - 1.3);
          return 'She eyes it, then puts it on her tongue. "Fine. For YOU." It should take effect over the next half hour.';
        },
      },
      {
        id: '303-im', name: 'Haloperidol + lorazepam', dose: '5 mg + 2 mg', route: 'IM', freq: 'Once, imminent danger when PO refused', prn: true,
        block: (s, P) => (P.im !== null ? 'Given at ' + clock(P.im) + '.' : null),
        checks: (s, P) => [{ label: 'Imminent danger', value: P.esc >= 2.6 ? 'Yes' : 'No: ' + escTxt(P.esc), ok: P.esc >= 2.6 }, { label: 'PO offered', value: P.prnAt !== null ? 'Given at ' + clock(P.prnAt) : 'Not yet', ok: P.prnAt !== null }],
        give(s, P, A) {
          P.im = s.t; startEp(s, P, 'hold');
          if (P.esc < 2.6) A.judge('303-im', 'meds', -3, 'You gave Jasmine emergency IM medication when she wasn\'t an imminent danger.', 'Involuntary medication without a capacity ruling is legal only in an emergency: imminent danger to self or others. Otherwise it\'s an assault, and it teaches her the unit is a place where people hold her down.', '303');
          else A.judge('303-im', 'meds', 1, 'You gave Jasmine emergency medication when she was an imminent danger.', 'When she\'s actively dangerous and won\'t take it by mouth, emergency medication is appropriate. Notify the psychiatrist, monitor her closely, and debrief with her later.', '303');
          P.esc = Math.max(0, P.esc - 2.4);
          return 'Four staff, a quick hold, a shot in the thigh. She screams, then cries. She\'ll likely be asleep within the half hour; stay close.';
        },
      },
    ],
    talk: (s, P) => (P.secluded ? 'jas_secl' : P.esc >= 1.8 ? 'jas_hot' : 'jas_chat'),
    sbar: {
      items(s, P, A) {
        return [
          { id: 'esc', label: `Escalating: ${escTxt(P.esc)}`, key: P.esc >= 1.5, need: recent(s, P.k.behAt, 60), lock: 'Assess her behavior' },
          { id: 'sleep', label: 'About three hours of sleep in three nights', key: true, need: true },
          { id: 'li', label: 'Lithium level 0.6, low for acute mania', key: true, need: true },
          { id: 'prn', label: P.prnAt !== null ? `Olanzapine ODT at ${clock(P.prnAt)}` : 'Oral PRN', key: P.prnAt !== null, need: P.prnAt !== null, lock: 'Not given yet' },
          { id: 'tried', label: 'Quiet room and walking tried', key: P.tried, need: P.tried, lock: 'Try de-escalation first' },
          { id: 'conflict', label: 'Conflict with 307', key: false, need: true },
          { id: 'art', label: 'Drawing all night', key: false, need: true },
        ];
      },
      requests: (s, P) => [
        { id: 'meds', label: 'Her mania isn\'t controlled. Can we look at her medication plan?' },
        { id: 'seclude', label: 'Can I get a seclusion order?' },
        { id: 'im', label: 'Can I give her the IM medication now?' },
        ...(P.ep && P.ep.f2fCalled === null ? [{ id: 'f2f', label: `She's ${P.secluded ? 'been in seclusion' : 'been held for an emergency IM'} since ${clock(P.ep.at)}. I need the order for this episode and your face-to-face within the hour.` }] : []),
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (P.ep || P.esc >= 2 || P.im !== null) P.mdNotified = P.mdNotified === null ? s.t : P.mdNotified;
        if (req === 'f2f') {
          const e = P.ep; if (e.ordered === null) e.ordered = s.t; e.f2fCalled = s.t;
          A.judge('303-sbar-f2f', 'comm', s.t - e.at <= 20 ? 2 : 1, 'You called Dr. Iyer for the order and the face-to-face.', 'Every episode of seclusion or restraint needs its own order and an in-person evaluation within one hour, even if she\'s already out by the time the doctor arrives.', '303');
          return `I'll be up in fifteen minutes for the face-to-face. ${P.secluded ? 'Seclusion order is in, up to four hours, but release her the moment she\'s safe. Who\'s watching her?' : 'Order for the hold is in. Keep up her post-IM checks.'}`;
        }
        if (req === 'seclude' || req === 'im') {
          if (P.esc >= 2.6 && P.tried) { P.orderSecl = s.t; if (P.ep) { if (P.ep.ordered === null) P.ep.ordered = s.t; if (P.ep.f2fCalled === null) P.ep.f2fCalled = s.t; } A.judge('303-sbar-em', 'comm', 1, 'You escalated Jasmine\'s imminent danger with what you\'d tried.', 'Emergency interventions need a clear danger and a record of less restrictive measures. You gave both.', '303'); return 'She\'s a danger right now and you\'ve tried the less restrictive options. The emergency IM is ordered. Seclusion only if it doesn\'t work, and I\'ll be up for the face-to-face within the hour.'; }
          A.judge('303-sbar-restrict', 'judgment', -2, 'You asked for restrictive measures before Jasmine was an imminent danger.', 'Seclusion and involuntary medication are for imminent danger, after less restrictive measures. The question to answer first: what have you tried?', '303');
          return 'Is she an imminent danger right now? If not, no. What have you tried? Quiet room, the PRN by mouth, less stimulation?';
        }
        if (req === 'meds' && picked.includes('li')) {
          if (!P.adjusted) { P.adjusted = true; A.addOrder('303', 'Lithium increased to 900 mg PO twice daily starting 20:00. Recheck level in 5 days. Continue olanzapine ODT PRN; offer early.'); }
          A.judge('303-sbar', 'comm', 2, 'You connected Jasmine\'s escalation to a subtherapeutic lithium level.', 'Behavior tells you something is off; the level tells you what. The fix for this morning is de-escalation; the fix for this week is the dose.', '303');
          return 'Point six is low for acute mania. Let\'s go to 900 twice a day and recheck in five days. For this morning: quiet room, offer the ODT early, keep her away from 307.';
        }
        return 'Keep offering choices and the PRN by mouth. Call me if she becomes a danger.';
      },
    },
    scene: (s, P) => ({ psych: true, papers: true, tray: 'none', secluded: P.secluded }),
    clues: (s, P) => ({
      papers: 'Dozens of sketches taped to the wall and scattered on the bed: album covers, a logo, a portrait of Andre. The line work gets faster and messier as the pile goes on.',
    }),
    rig: (s, P) => ({ anxious: clamp(P.esc * .32, 0, 1), alert: P.im !== null && s.t - P.im < 150 ? 1 : 0 }),
    status: (s, P) => (P.esc >= 2.6 ? 'urgent' : P.esc >= 1.6 || P.secluded ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.emerg) return { tone: P.emergTried ? 'mixed' : 'bad', title: 'Held down and medicated in the dayroom', text: P.emergTried ? 'Her agitation outran what you tried. The early steps were right; they needed to come sooner, and again.' : 'Her agitation climbed all morning until the team had to use emergency medication and seclusion. It was visible from 07:00, and each step down the ladder was skipped.' };
      if (P.seclAt !== undefined && !P.seclOk) return { tone: 'bad', title: 'Secluded without imminent danger', text: 'Loud and intrusive is not dangerous. She\'s filing a patients\' rights complaint, and she\'s right.' };
      if (P.secluded && !P.emerg && P.esc < 2) return { tone: 'mixed', title: 'Still in seclusion when she was safe', text: 'Seclusion was justified when it started, but it ends when the danger does. She was calm and still behind a locked door.' };
      if (P.seclOk) return { tone: 'mixed', title: 'Secluded as a last resort', text: 'She was an imminent danger and less restrictive measures had failed. The next goal is getting there less often.' };
      if (P.im !== null) return { tone: 'mixed', title: 'Needed emergency medication', text: 'By the time it came to IM medication, it was the right call. The oral PRN, offered earlier, might have kept it from getting there.' };
      if (P.esc < 1.6) return { tone: 'good', title: 'Calmer, no force used', text: 'Quiet room, fewer words, a PRN offered as a choice. She slept two hours after lunch, the first real sleep in days.' + (P.adjusted ? ' Lithium is going up tonight.' : '') };
      return { tone: 'mixed', title: P.esc >= 2.6 ? 'Still escalating at noon' : 'Not settled at noon', text: P.esc >= 2.6 ? 'She hasn\'t crossed into danger yet, but nothing has turned her around. The afternoon nurse inherits a crisis in progress.' : 'Louder and more driven than she should be after a morning of care, though not in danger. Nothing that was tried has brought her down yet.' };
    },
  };

  /* ---------- 305 Bob Lindgren: lithium toxicity dressed up as a stomach bug ---------- */
  const bob = {
    id: '305', room: '305', name: 'Bob Lindgren', short: 'Bob', age: 58, sex: 'M', mrn: '00398810', legal: 'Voluntary',
    look: { skin: '#F0CDB2', shade: '#D6AB8E', lip: '#B56A5E', blush: '#EE9A86', iris: '#5C7A92', head: { w: 60, h: 62, jaw: .6 }, eye: 9, hair: { style: 'balding', color: '#B6A58E' }, brow: { w: 4.6, color: '#9C8B74' }, body: { w: 92, cloth: 'flannel' }, extras: ['wrinkles', 'mustache'], smile: .35,
      lines: { calm: 'Twenty years on lithium. Never had a day like this.', shaky: 'Can\'t hold my coffee. Hands won\'t quit.', nausea: 'Where\'s that basin... sorry. Sorry.', confused: 'What day is it? I had it a minute ago.', drowsy: 'Just... tired.', none: 'He doesn\'t respond.' } },
    bio: 'Retired letter carrier. Fishes, builds birdhouses. Married 31 years to Carol, who visits every afternoon.',
    dx: 'Bipolar II, depression. On lithium', reason: 'Bipolar II disorder, depressive episode, voluntary admission two days ago.',
    hx: ['Bipolar II on lithium for 20 years', 'Hypertension: hydrochlorothiazide started by his PCP last month', 'Chronic low back pain, takes ibuprofen'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '88 kg',
    lines: ['None'], mobility: 'Independent at baseline', diet: 'Regular',
    init: { li: 2.06, liDoseAt: null, ibuAt: null, hctzAt: null, transferAt: null, gone: false, reported: false, readback: false, ortho: false, fallPrec: false, explained: false, seized: false },
    nightVitals: { T: 37.1, HR: 94, SBP: 112, DBP: 70, RR: 18, SpO2: 97, O2: 'Room air', pain: 5 },
    labs: [
      { name: 'Lithium level (trough)', val: 1.0, unit: 'mmol/L', ref: '0.6–1.2', flag: '', t: -12000 },
      { name: 'Creatinine', val: 1.1, unit: 'mg/dL', ref: '0.7–1.3 (0.9 last year)', flag: '', t: -2900 },
      { name: 'Sodium', val: 136, unit: 'mmol/L', ref: '135–145', flag: '', t: -2900 },
    ],
    orders: [
      { t: -2900, text: 'Lithium carbonate 600 mg PO twice daily (08:00, 20:00). Lithium level, BMP with morning labs at 06:00.' },
      { t: -2900, text: 'Hydrochlorothiazide 25 mg PO daily at 08:00 (home medication). Ibuprofen 400 mg PO every 6 h as needed for back pain (home medication).' },
      { t: -2900, text: 'Acetaminophen 650 mg PO every 6 h as needed for pain. Ondansetron ODT 4 mg every 8 h as needed for nausea.' },
    ],
    notes: [
      { t: -120, author: 'Priya, night RN', text: 'Loose stools x2 overnight. Nauseous, vomited once at 04:30. Hands shaky. Ibuprofen 400 mg at 03:00 for back pain. Thinks it\'s a stomach bug; two patients on 2 East had one last week. AM labs drawn 06:00.' },
    ],
    io: { intake: 'PO about 600 mL yesterday', output: 'Loose stool x2, emesis x1 (200 mL)' },
    report: [
      { text: 'Bob Lindgren, 58, voluntary. Bipolar two, in for depression. He\'s been on lithium for twenty years.', key: true },
      { text: 'He\'s been shaky all night, had diarrhea twice, and threw up once.', key: true },
      { text: 'I figure it\'s the stomach bug that went around 2 East last week.', key: false },
      { text: 'His PCP started him on hydrochlorothiazide last month.', key: true },
      { text: 'He takes ibuprofen for his back. I gave him some at three.', key: true },
      { text: 'Morning labs were drawn at six. Lithium level is pending.', key: true },
    ],
    vitals(s, P) { const x = Math.max(0, P.li - 2); return { T: 37.1, HR: Math.round(96 + x * 30) + jit(s, 5), SBP: Math.round(110 - x * 20) + jit(s, 6) * 2, DBP: 68, RR: 18, SpO2: 97, O2: 'Room air', pain: 5 }; },
    assess: {
      general: (s, P) => (P.li > 2.35 ? 'Slumped on the edge of the bed, jerking in small twitches, basin in his lap. He barely looks up.' : 'Sitting on the edge of the bed holding an emesis basin. His hands shake hard enough to rattle it.'),
      resp: () => 'Clear. Unlabored.',
      cardiac: (s, P, A) => { const v = A.vitals('305'); return `HR ${v.HR}, regular. BP ${v.SBP}/${v.DBP}. Mucous membranes dry.`; },
      neuro: (s, P) => { P.k.neuro = s.t; return 'Coarse tremor in both hands, not the fine one he\'s had for years. Speech slightly slurred. Oriented to person and place, not the date. Slow to answer. Wide-based, unsteady gait: he grabs the doorframe.' + (P.li > 2.35 ? ' Now brief muscle jerks in his arms.' : '') + ' Mood low, no suicidal thoughts.'; },
      pain: () => 'Chronic low back ache 5/10. "My Motrin usually takes care of it."',
      skin: () => 'Dry, poor skin turgor.',
      gi: (s, P) => { P.k.gi = s.t; return 'Vomited again at 06:40. Loose stools x3 since midnight. Taking only sips. Dry lips and tongue.'; },
    },
    interventions: [
      { id: 'ortho', label: 'Orthostatic vital signs', cost: 5, avail: (s, P) => !P.ortho, run(s, P, A) { P.ortho = true; A.judge('305-ortho', 'assess', 1, 'You checked Bob\'s orthostatic vitals.', 'Vomiting, diarrhea and a diuretic: he\'s dry. Dehydration is what lets lithium climb.', '305'); const v = A.vitals('305'); return `Lying ${v.SBP}/${v.DBP}, HR ${v.HR}. Standing ${v.SBP - 18}/${v.DBP - 8}, HR ${v.HR + 24}. He gets dizzy and sits back down.`; } },
      { id: 'sips', label: 'Offer small sips and ice chips', cost: 3, run() { return 'He manages a few sips of water. Most of it stays down.'; } },
      { id: 'fall', label: 'Fall precautions: bed low, non-skid socks, escort to the bathroom', cost: 3, avail: (s, P) => !P.fallPrec, run(s, P, A) { P.fallPrec = true; A.judge('305-fall', 'safety', 1, 'You put Bob on fall precautions.', 'Ataxia and orthostasis: he\'s a fall waiting to happen.', '305'); return 'Bed low, socks on, Andre knows to walk him to the bathroom.'; } },
    ],
    meds: [
      {
        id: '305-li', name: 'Lithium carbonate', dose: '600 mg', route: 'PO', freq: 'Twice daily, 08:00 and 20:00', due: 60,
        checks: (s) => [{ label: 'Level', value: s.t >= 30 ? '2.1 at 06:00: CRITICAL' : 'Drawn 06:00, pending', ok: s.t >= 30 ? false : null }, { label: 'Symptoms', value: 'Coarse tremor, vomiting, diarrhea', ok: false }],
        give(s, P, A) { P.liDoseAt = s.t; A.judge('305-li', 'meds', -3, 'You gave Bob lithium while he was showing signs of lithium toxicity.', 'Coarse tremor, vomiting, diarrhea and confusion in someone on lithium are toxicity until proven otherwise. With a level of 2.1, another dose is fuel on a fire.', '305'); return 'Lithium 600 mg given.'; },
        hold(s, P, A) { A.judge('305-li-hold', 'meds', 2, 'You held Bob\'s lithium.', 'Symptoms of toxicity, and a critical level: hold, call, and get him medical care. A missed dose of lithium does no harm; an extra one can cause seizures.', '305'); return 'Held: signs of toxicity, level 2.1.'; },
      },
      {
        id: '305-hctz', name: 'Hydrochlorothiazide', dose: '25 mg', route: 'PO', freq: 'Daily at 08:00', due: 60, param: 'Thiazides reduce lithium clearance',
        checks: (s, P, A) => { const v = A.vitals('305'); return [{ label: 'BP', value: `${v.SBP}/${v.DBP}`, ok: v.SBP >= 110 }, { label: 'Volume', value: 'Vomiting and diarrhea', ok: false }]; },
        give(s, P, A) { P.hctzAt = s.t; A.judge('305-hctz', 'meds', -2, 'You gave Bob his thiazide diuretic while he was dehydrated and lithium-toxic.', 'Thiazides make the kidneys hold on to lithium, and dehydration does the same. That combination is likely what caused this.', '305'); return 'HCTZ 25 mg given.'; },
        hold(s, P, A) { A.judge('305-hctz-hold', 'meds', 1, 'You held Bob\'s hydrochlorothiazide.', 'A diuretic in a dehydrated patient with high lithium makes both problems worse.', '305'); return 'Held.'; },
      },
      { id: '305-ibu', name: 'Ibuprofen', dose: '400 mg', route: 'PO', freq: 'Every 6 h as needed, back pain', prn: true, block: (s) => (s.t < 120 ? 'Last dose 03:00. Next available at 09:00.' : null), checks: () => [{ label: 'Interaction', value: 'NSAIDs raise lithium levels', ok: false }], give(s, P, A) { P.ibuAt = s.t; A.judge('305-ibu', 'meds', -2, 'You gave Bob ibuprofen with a toxic lithium level.', 'NSAIDs reduce lithium clearance. Acetaminophen treats his back without the interaction.', '305'); return 'Ibuprofen 400 mg given.'; } },
      { id: '305-apap', name: 'Acetaminophen', dose: '650 mg', route: 'PO', freq: 'Every 6 h as needed, pain', prn: true, checks: () => [{ label: 'Pain', value: 'Back 5/10', ok: true }], give(s, P, A) { A.judge('305-apap', 'meds', 1, 'You treated Bob\'s back pain with acetaminophen instead of ibuprofen.', 'Same comfort, no lithium interaction.', '305'); return 'Acetaminophen 650 mg given.'; } },
      { id: '305-ond', name: 'Ondansetron ODT', dose: '4 mg', route: 'PO', freq: 'Every 8 h as needed, nausea', prn: true, checks: () => [{ label: 'Nausea', value: 'Vomiting', ok: true }], give: () => 'Ondansetron 4 mg dissolved on his tongue.' },
    ],
    talk: (s, P) => (P.explained ? 'bob_after' : 'bob_talk'),
    sbar: {
      items(s, P) {
        return [
          { id: 'level', label: 'Lithium level 2.1 (critical)', key: true, need: s.t >= 30, lock: 'Result pending' },
          { id: 'neuro', label: 'Coarse tremor, unsteady gait, new confusion', key: true, need: recent(s, P.k.neuro, 90), lock: 'Check his mental status and neuro' },
          { id: 'gi', label: 'Vomiting and diarrhea, dry mucous membranes', key: true, need: P.k.gi !== undefined, lock: 'Assess his GI and intake' },
          { id: 'ortho', label: 'Orthostatic: BP drops 18, HR up 24', key: true, need: P.ortho, lock: 'Take orthostatic vitals' },
          { id: 'meds', label: 'New hydrochlorothiazide; ibuprofen at 03:00', key: true, need: true },
          { id: 'held', label: 'Held his 08:00 lithium', key: true, need: s.meds['305-li'].status === 'held', lock: 'Decide on the 08:00 dose' },
          { id: 'mood', label: 'Mood still low', key: false, need: true },
        ];
      },
      requests: [
        { id: 'transfer', label: 'He looks lithium-toxic. Can we get him medical care: IV fluids and monitoring?' },
        { id: 'hold', label: 'Should I hold his lithium and recheck tomorrow?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (!picked.includes('level') && s.t < 30) return 'Let\'s see the level. It should be back soon.';
        if (!picked.includes('level')) return 'What\'s his lithium level? It was drawn at six.';
        P.reported = true;
        if (P.transferAt === null) { P.transferAt = s.t + 25; A.addOrder('305', 'HOLD lithium, hydrochlorothiazide and NSAIDs. Transfer to medicine for IV fluids, telemetry, repeat level every 6 h, nephrology consult. Nothing by mouth except sips.'); }
        const signs = ['neuro', 'gi', 'ortho', 'meds'].filter((k) => picked.includes(k)).length;
        A.judge('305-sbar', 'comm', req === 'transfer' && signs >= 1 ? 2 : 1, 'You called the psychiatrist about Bob\'s critical lithium level.', 'A critical value goes to the provider now, with the symptoms and the cause: dehydration, a thiazide and an NSAID. That picture gets him to medicine in minutes.', '305');
        return req === 'transfer' ? 'Toxic with neuro signs: he needs medicine now. Hold the lithium, the HCTZ and the NSAIDs. I\'m calling the medicine team; they\'ll take him in about twenty minutes.' : 'Hold it, yes, but at 2.1 with a tremor and confusion he needs fluids and monitoring today, not tomorrow. I\'m calling medicine now.';
      },
    },
    scene: (s, P) => ({ psych: true, basin: true, fallPrec: P.fallPrec, tray: 'none', empty: P.gone || P.icu, emptyText: P.icu ? 'Room empty. Sent to the ED after a seizure.' : 'Room empty. Transferred to medicine.' }),
    clues: () => ({
      basin: 'An emesis basin, used. A cup of water beside it, barely touched. His birdhouse sketches underneath.',
      alarm: 'Bed low, socks on.',
    }),
    rig: (s, P) => ({ tremor: clamp(.55 + (P.li - 2) * 1.2, 0, 1), nausea: true, confused: P.li > 2.2, pale: .3 }),
    status: (s, P) => (P.gone || P.icu ? 'gone' : P.li > 2.35 || (s.t >= 30 && !P.reported) ? 'urgent' : 'watch'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Seizure from lithium toxicity', text: 'He seized on the unit and went to the ED, then the ICU for dialysis. The tremor, the vomiting and a level of 2.1 were all on the chart by 07:30.' };
      if (P.gone) return { tone: P.liDoseAt !== null || P.ibuAt !== null ? 'mixed' : 'good', title: 'Lithium toxicity, caught and transferred', text: `On medicine by ${clock(P.transferAt)} with IV fluids and repeat levels. Not a stomach bug: a new diuretic, ibuprofen and two days of diarrhea.` + (P.liDoseAt !== null ? ' He did get one more dose first.' : '') };
      if (P.reported) return { tone: 'mixed', title: 'Transfer pending', text: 'Medicine is on the way. He\'s still toxic.' };
      return { tone: 'bad', title: 'Still toxic at noon', text: 'A critical level and neuro symptoms, and he\'s still on a psych unit with no fluids. Everyone kept calling it a stomach bug.' };
    },
  };

  /* ---------- 307 Miguel Santos: first-episode psychosis; trust before medication ---------- */
  const mig = {
    id: '307', room: '307', name: 'Miguel Santos', short: 'Miguel', age: 22, sex: 'M', mrn: '00987265', legal: '5150, grave disability',
    look: { skin: '#C89468', shade: '#A6744A', lip: '#8A4C3C', blush: '#C9805F', iris: '#2C1A0E', head: { w: 52, h: 62, jaw: .4 }, eye: 10, hair: { style: 'swoop', color: '#1B130E' }, brow: { w: 4, color: '#17100C' }, body: { w: 72, cloth: 'hoodie' }, extras: [], smile: .2,
      lines: { calm: 'The muffin was sealed. I checked the seal.', anxious: 'Why are you looking at my food? Who sent you?', drowsy: 'Tired.', none: 'He doesn\'t answer.' } },
    bio: 'Engineering student at the community college, first in his family in college. Stopped going to class in March. Lives with his mother, Ana.',
    dx: 'First-episode psychosis', reason: 'Unspecified psychosis, first episode. Not eating for days, barricaded in his room.',
    hx: ['No prior psychiatric history', 'Cannabis use daily until two months ago', 'Lost about 7 kg since spring'],
    allergies: 'No known drug allergies', code: 'Full code', weight: '61 kg',
    lines: ['None'], mobility: 'Independent', diet: 'Regular; sealed items allowed',
    init: { trust: 0, ate: 0, refused: false, medTaken: false, reoffer: false, reported: false, riese: false, covert: false, visit: null, bagChecked: false, charger: false, consent: false, chargerFound: false },
    nightVitals: { T: 36.9, HR: 92, SBP: 122, DBP: 74, RR: 16, SpO2: 99, O2: 'Room air', pain: 0 },
    labs: [
      { name: 'Urine tox', val: 'Negative', unit: '', ref: '', flag: '', t: -1330 },
      { name: 'Sodium', val: 144, unit: 'mmol/L', ref: '135–145', flag: '', t: -1330 },
      { name: 'BUN', val: 24, unit: 'mg/dL', ref: '7–20', flag: 'H', t: -1330 },
    ],
    orders: [
      { t: -1320, text: 'WIC 5150, grave disability. Started yesterday 09:00.' },
      { t: -1320, text: 'Risperidone 2 mg PO daily at 08:00. Patient may refuse: no capacity determination (Riese) on file.' },
      { t: -1320, text: 'Encourage nutrition. Sealed, pre-packaged items OK. Weigh daily.' },
    ],
    notes: [
      { t: -120, author: 'Priya, night RN', text: 'Refused risperidone at 21:00: "It\'s poison." Ate a quarter of dinner, only the banana. Drinking from the sink. Guarded, watches the ceiling vent. Mother Ana calls every evening; no signed release on file.' },
    ],
    io: { intake: 'About 20% of meals yesterday', output: 'Voiding, dark yellow' },
    report: [
      { text: 'Miguel Santos, 22, first episode of psychosis. 5150 for grave disability.', key: false },
      { text: 'He thinks the food is poisoned. He ate maybe a quarter of dinner.', key: true },
      { text: 'He refused his risperidone last night. Says it\'s poison too.', key: true },
      { text: 'His mom calls every day. She\'s coming at visiting hours and bringing him stuff.', key: true },
      { text: 'He\'s an engineering student. Super smart.', key: false },
    ],
    vitals(s, P) { return { T: 36.9, HR: Math.round(94 - P.trust * 4) + jit(s, 7), SBP: 122 + jit(s, 8) * 2, DBP: 74, RR: 16, SpO2: 99, O2: 'Room air', pain: 0 }; },
    assess: {
      general: (s, P) => (P.trust >= 1 ? 'Hood down. Sitting on the bed instead of the floor. He lets you come a little closer.' : 'Hood up, on the floor in the corner with his back to the wall, watching the door. Breakfast tray untouched.'),
      resp: () => 'Unlabored.',
      cardiac: (s, P, A) => `HR ${A.vitals('307').HR}, regular. Mucous membranes dry.`,
      neuro: (s, P) => `Guarded. Paranoid delusions: staff are "working with them" and the food is poisoned. He pauses mid-sentence, glances at the ceiling vent, whispers back to it. Oriented. Denies wanting to hurt himself or anyone. No insight into illness.${P.medTaken ? ' Slightly less distracted since his dose.' : ''}`,
      pain: () => 'Denies pain.',
      skin: () => 'Dry lips. No injuries.',
      gi: (s, P) => { P.k.gi = s.t; return `Ate about 20% of meals yesterday. ${P.ate >= 1 ? 'Ate the sealed food this morning.' : 'Nothing yet today.'} Drinks only water from the sink, water he watched come out.`; },
    },
    interventions: [
      { id: 'sealed', label: 'Offer sealed food he can open himself', cost: 3, avail: (s, P) => !P.sealedOffered, run(s, P, A) { P.sealedOffered = true; P.trust += .7; P.ate += 1; A.judge('307-sealed', 'judgment', 1, 'You offered Miguel sealed food.', 'You don\'t have to agree with a delusion to work around it. Food he can verify gets calories into him and shows him you take his fear seriously.', '307'); return 'A packaged muffin and a carton of milk. He turns each one over, checks the seals, then opens them himself. He eats all of it.'; } },
      { id: 'bag', label: 'Check the visitor\'s bag', cost: 3, avail: (s, P) => P.charger && !P.chargerFound, run(s, P, A) { P.chargerFound = true; A.judge('307-bag-late', 'safety', 1, 'You found the charger cord after the visit.', 'Late, but found. Cords are ligature risks on a unit where someone is suicidal.', '307'); return 'A phone charger, coiled in the bottom of Ana\'s tote. You lock it in his belongings bin.'; } },
    ],
    family: { name: 'Ana', rel: 'Mother', mode: 'bedside', cost: 4, avail: (s, P) => P.visit !== null && s.t - P.visit < 100, dialog: (s, P) => (P.anaOk ? 'ana_after' : P.consentAsked ? 'ana_cool' : 'ana_talk') },
    meds: [
      {
        id: '307-risp', name: 'Risperidone', dose: '2 mg', route: 'PO', freq: 'Daily at 08:00', due: 60,
        checks: (s, P) => [{ label: 'Willing', value: P.trust >= 1.5 ? 'Asks to see the package first' : 'Says it\'s poison', ok: P.trust >= 1.5 }, { label: 'Legal', value: 'May refuse: no capacity ruling', ok: null }],
        refuse: (s, P) => (P.trust < 1.5 ? 'He backs into the corner. "That\'s poison. I know what it is." He\'s refusing, and he has the right to.' : null),
        onRefuse(s, P) { P.refused = true; },
        give(s, P, A) { P.medTaken = true; A.judge('307-risp', 'meds', 2, 'Miguel took his risperidone voluntarily.', 'Trust first, then medication. He read the blister pack himself. Voluntary acceptance is worth more than any court order.', '307'); return 'He reads the label twice, pops the pill from the blister pack himself, and swallows it.'; },
        hold(s, P, A, r) { if (P.trust >= 1.5) { A.judge('307-risp-hold', 'meds', -1, 'You held Miguel\'s risperidone when he was willing to take it.', 'He hadn\'t refused. Offer it; hold only with a real reason.', '307'); return 'Held.'; } if (r === 3) { P.refused = true; A.judge('307-risp-ref', 'meds', 1, 'You documented Miguel\'s refusal instead of pushing.', 'Without a capacity ruling, he can refuse. Document it, tell the psychiatrist, and keep building trust so you can offer again.', '307'); } else A.judge('307-risp-hold', 'meds', -1, 'You held Miguel\'s risperidone with the wrong reason.', 'He declined. Say so; the reason matters legally.', '307'); return 'Held: patient declined.'; },
      },
      {
        id: '307-risp2', name: 'Risperidone (re-offered)', dose: '2 mg', route: 'PO', freq: 'Today\'s dose, offered again', prn: true, available: (s, P) => P.reoffer && s.meds['307-risp'].status === 'held' && !P.medTaken,
        block: (s, P) => (P.medTaken ? 'Taken.' : null),
        checks: () => [{ label: 'Willing', value: 'Wants to open the blister pack himself', ok: true }],
        give(s, P, A) { P.medTaken = true; A.judge('307-risp', 'meds', 2, 'Miguel took his risperidone after you offered it again, his way.', 'A refusal isn\'t the end of the conversation. Coming back with his concern addressed, not with pressure, is how most first-episode patients start treatment.', '307'); return 'He reads the label, checks his name on it, and takes it himself.'; },
      },
    ],
    talk: (s, P) => (P.medTaken ? 'mig_after' : P.trust >= 1 ? 'mig_warm' : 'mig_talk'),
    sbar: {
      items(s, P) {
        return [
          { id: 'para', label: 'Believes food and medication are poisoned', key: true, need: true },
          { id: 'intake', label: 'Ate about 20% yesterday, dry, BUN 24', key: true, need: true },
          { id: 'refused', label: 'Refused risperidone again this morning', key: !P.medTaken, need: P.refused, lock: 'Offer his medication' },
          { id: 'sealed', label: 'Eats sealed food he opens himself', key: true, need: P.trust >= 1, lock: 'Find something he will eat' },
          { id: 'took', label: 'Took risperidone after checking the package', key: true, need: P.medTaken, lock: 'Not taken yet' },
          { id: 'mom', label: 'Mother asking for information; no release signed', key: false, need: P.visit !== null, lock: 'Not visited yet' },
          { id: 'eng', label: 'Engineering student', key: false, need: true },
        ];
      },
      requests: [
        { id: 'riese', label: 'He keeps refusing and I don\'t think he can weigh the choice. Should we petition for a capacity hearing?' },
        { id: 'covert', label: 'Can I mix it into his juice?' },
        { id: 'im', label: 'Can I get an IM order to give it over his objection?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        if (req === 'covert') { A.judge('307-sbar-covert', 'judgment', -3, 'You asked to hide Miguel\'s medication in his food.', 'Covert medication without consent or a court order is illegal, and for a man who already believes his food is poisoned, it would make the belief true.', '307'); return 'Absolutely not. That\'s illegal, and if he ever found out, he\'d never trust any of us again. And he\'d be right.'; }
        if (req === 'im') { A.judge('307-sbar-im', 'judgment', -2, 'You asked to force Miguel\'s medication outside an emergency.', 'He isn\'t an imminent danger. Without a capacity ruling, a non-emergency injection over his objection isn\'t legal.', '307'); return 'Not unless he\'s an imminent danger. He has the right to refuse. If he can\'t weigh the choice, that\'s a Riese petition, not a needle.'; }
        P.reported = true;
        if (req === 'riese') {
          if (P.medTaken) { A.judge('307-sbar-r', 'comm', 1, 'You updated the psychiatrist on Miguel\'s medication.', 'He took it voluntarily, so no hearing is needed. That\'s the best outcome.', '307'); return 'He took it? Then we don\'t need a hearing. Keep doing what you\'re doing.'; }
          P.riese = true; A.addOrder('307', 'Riese petition filed for capacity to refuse antipsychotic medication. Continue to offer risperidone daily; he may refuse until the hearing.');
          A.judge('307-sbar', 'comm', 2, 'You raised a capacity question about Miguel\'s refusals.', 'The legal path for a patient who can\'t weigh treatment is a capacity hearing, not pressure. Meanwhile, keep offering.', '307');
          return 'Agreed. I\'ll file the Riese petition today; the hearing is usually within a day. Until then he can refuse, so keep offering, and keep going with the sealed food.';
        }
        if (picked.includes('sealed') || picked.includes('took')) { A.judge('307-sbar', 'comm', 1, 'You reported what\'s working with Miguel.', 'The team needs to know what builds his trust, so everyone does it the same way.', '307'); return 'Sealed food, let him open things himself. Good. I\'ll write that into the plan.'; }
        return 'Okay. Keep offering the risperidone.';
      },
    },
    scene: (s, P) => ({ psych: true, tray: P.ate >= 1 ? 'sealed' : 'untouched', headphones: true, family: P.visit !== null && s.t - P.visit < 100 ? 'ana' : null, familyLabel: 'Ana, his mother', visitor: P.charger && !P.chargerFound && P.visit !== null }),
    clues: (s, P) => ({
      headphones: 'Good over-ear studio headphones, too expensive for a student. Miguel, without looking up: "Daniel gave them to me. He said he won\'t be needing them."',
      tray: P.ate >= 1 ? 'Empty wrappers, seals torn open carefully along the edges.' : 'This morning\'s hot breakfast. Untouched. He\'s turned the plate face down.',
      visitor: 'Ana\'s tote bag. A phone charger cord is coiled at the bottom.',
      family: 'Ana, his mother, holding a foil-covered container. She keeps glancing at him and then at you.',
    }),
    onClue(id, s) { if (id === 'headphones') s.p['301'].headSeen = true; },
    rig: (s, P) => ({ anxious: clamp(.8 - P.trust * .3, 0, 1) }),
    status: (s, P) => (P.covert ? 'watch' : P.trust < 1 && P.ate < 1 ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.covert) return { tone: 'bad', title: 'Medicated in secret', text: 'He tasted it. Now he knows the juice was poisoned, and he\'s right. He\'s stopped eating and drinking entirely.' };
      if (P.medTaken) return { tone: 'good', title: 'Ate, and took his first dose', text: 'Sealed food, his own hands on the package, and a nurse who didn\'t argue with him. Voluntary treatment has started.' };
      if (P.ate >= 1 && (P.riese || (P.refused && P.reported))) return { tone: 'good', title: 'Eating, refusing, and heard', text: 'He\'s eating what he can verify. His refusal is documented and ' + (P.riese ? 'a capacity hearing is being filed.' : 'the psychiatrist knows.') };
      if (P.ate >= 1) return { tone: 'mixed', title: 'Eating, but no plan for his refusals', text: 'He ate, but the psychiatrist doesn\'t know he\'s still refusing medication.' };
      return { tone: 'mixed', title: 'Didn\'t eat, didn\'t trust anyone', text: 'Another day without food or treatment. He\'s getting dehydrated.' };
    },
  };

  /* ---------- 309 Linda Fairweather: psychogenic polydipsia on clozapine ---------- */
  const lin = {
    id: '309', room: '309', name: 'Linda Fairweather', short: 'Linda', age: 47, sex: 'F', mrn: '00150042', legal: 'LPS conservatorship',
    look: { skin: '#F2D3BC', shade: '#D8B096', lip: '#B7716A', blush: '#EBA092', iris: '#6A7B5A', head: { w: 56, h: 62, jaw: .3 }, eye: 9.4, hair: { style: 'bob', color: '#8A7A6A' }, brow: { w: 3.2, color: '#6E5E50' }, body: { w: 80, cloth: 'plum' }, extras: ['pearls'], smile: .45,
      lines: { calm: 'Oldies station. Don\'t touch the dial.', confused: 'My head... where\'s the committee room? I had a meeting.', nausea: 'I feel sick. Where\'s my cup?', drowsy: 'Mm.', none: 'She doesn\'t respond.' } },
    bio: 'Twenty-five years with schizophrenia. Loves Motown. Her public conservator visits monthly. She calls her voices "the committee."',
    dx: 'Schizophrenia, on clozapine. Drinking water compulsively', reason: 'Schizophrenia, exacerbation after missed clozapine doses; admitted 9 days ago. History of psychogenic polydipsia.',
    hx: ['Schizophrenia since age 22; clozapine for 8 years', 'Psychogenic polydipsia: water intoxication with seizure in 2021', 'Clozapine-related constipation'],
    allergies: 'Haloperidol (intolerance: acute dystonia, not allergic)', code: 'Full code', weight: '68 kg (baseline)',
    lines: ['None'], mobility: 'Independent', diet: 'Regular',
    init: { na: 128.6, wt: 71.2, weighed: false, restricted: false, agreed: false, supervised: false, statAt: null, reported: false, gone: false, icu: false, peg: false, bmReported: false, tylAt: null },
    nightVitals: { T: 36.7, HR: 84, SBP: 136, DBP: 84, RR: 16, SpO2: 98, O2: 'Room air', pain: 4 },
    labs: [
      { name: 'Sodium', val: 129, unit: 'mmol/L', ref: '135–145 (her baseline 135)', flag: 'L', t: -90 },
      { name: 'ANC', val: 2.8, unit: 'K/µL', ref: '≥ 1.5 on clozapine', flag: '', t: -5760 },
      { name: 'Serum osmolality', val: 268, unit: 'mOsm/kg', ref: '275–295', flag: 'L', t: -90 },
      { name: 'Clozapine level', val: 410, unit: 'ng/mL', ref: '350–600', flag: '', t: -8000 },
    ],
    orders: [
      { t: -12000, text: 'LPS conservatorship: the court granted the public conservator authority to consent to psychotropic medication.' },
      { t: -12000, text: 'Polydipsia protocol: weigh at 06:00 daily (baseline 68 kg). Gain over 2 kg: STAT BMP, begin 1.5 L/day supervised fluid restriction, notify psychiatrist.' },
      { t: -12000, text: 'Clozapine 200 mg PO daily at 08:00. Docusate 100 mg PO twice daily. Polyethylene glycol 17 g PO daily as needed, no BM in 2 days.' },
    ],
    notes: [
      { t: -80, author: 'Priya, night RN', text: 'Up to the bathroom every 30 min overnight, large pale voids. Andre saw her drinking from the bathroom sink twice. Refused 06:00 weight. Headache 4/10, acetaminophen 650 mg at 04:00. No BM charted since Sunday.' },
    ],
    io: { intake: 'Charted 2,400 mL (not counting the sink)', output: 'Voiding large amounts, not measured' },
    report: [
      { text: 'Linda Fairweather, 47, schizophrenia, on a conservatorship. She\'s on clozapine.', key: false },
      { text: 'She was up all night to the bathroom. Andre caught her drinking out of the sink twice.', key: true },
      { text: 'She wouldn\'t step on the scale at six. Her morning weight still needs doing.', key: true },
      { text: 'Sodium was 129 at 05:30. I think her baseline is about 135.', key: true },
      { text: 'She had a headache, so I gave her Tylenol at four.', key: true },
      { text: 'She loves the oldies station. Don\'t touch her radio.', key: false },
    ],
    vitals(s, P) { return { T: 36.7, HR: 84 + jit(s, 9) * 2, SBP: Math.round(136 + Math.max(0, 128 - P.na) * 2) + jit(s, 10) * 2, DBP: 84, RR: 16, SpO2: 98, O2: 'Room air', pain: P.na < 126 ? 6 : 4 }; },
    assess: {
      general: (s, P) => (P.na < 124 ? 'Confused and retching, holding the wall to stay upright.' : P.na < 126 ? 'Holding her head, squinting at the light. Slower than usual, and she\'s stopped humming.' : 'In a lavender robe, humming along to the radio. A stack of paper cups on the windowsill.'),
      resp: () => 'Unlabored. Clear.',
      cardiac: (s, P, A) => { const v = A.vitals('309'); return `HR ${v.HR}, regular. BP ${v.SBP}/${v.DBP}. Fingers slightly puffy.`; },
      neuro: (s, P) => { P.k.neuro = s.t; return 'Disorganized and tangential at her baseline; hears "the committee." ' + (P.na < 126 ? 'Today she\'s more confused than her baseline: she can\'t name the unit and loses her place mid-sentence. Headache 6/10.' : 'Oriented to person and place. Headache 4/10.'); },
      pain: (s, P) => `Headache ${P.na < 126 ? 6 : 4}/10, all over. "The water will fix it."`,
      skin: () => 'Intact. Moist mucous membranes.',
      gi: (s, P) => { P.k.gi = s.t; return 'Voiding large amounts of pale urine about every half hour. Abdomen distended and firm. No bowel movement charted in 4 days.'; },
    },
    interventions: [
      {
        id: 'weigh', label: 'Weigh her (protocol)', cost: 3,
        run(s, P, A) { P.weighed = true; P.wt = +(71.2 + (P.restricted ? -.2 : Math.max(0, (128.6 - P.na) * .12))).toFixed(1); A.judge('309-weigh', 'assess', 1, 'You got Linda\'s protocol weight.', 'In polydipsia, weight is the fastest bedside measure of how much water she\'s holding. It decides the whole protocol.', '309'); return `Weight ${P.wt} kg. Baseline 68 kg. Up ${(P.wt - 68).toFixed(1)} kg: the protocol threshold is 2.`; },
      },
      {
        id: 'restrict', label: 'Start the protocol: 1.5 L/day, supervised, sink water off', cost: 3, avail: (s, P) => !P.restricted,
        run(s, P, A) { P.restricted = true; P.restAt = s.t; P.naRest = P.na; if (P.weighed || recent(s, P.k.neuro, 90)) A.judge('309-restrict', 'safety', 2, 'You started Linda\'s fluid restriction per protocol.', 'The protocol lets you act on the weight without waiting for a call back. Every hour of unrestricted water drops her sodium further.', '309'); else A.judge('309-restrict', 'safety', 1, 'You started Linda\'s fluid restriction.', 'Right move. The protocol runs on her weight, so weigh her too.', '309'); A.addOrder('309', 'Fluid restriction 1.5 L/day, supervised. Room water supply off per protocol.'); return 'Maintenance shuts off the valve under her sink. A pitcher with today\'s allowance, marked by the hour, goes on the desk. She glares at it.'; },
      },
      { id: 'stat', label: 'Draw a STAT BMP (protocol)', cost: 4, avail: (s, P) => P.statAt === null, run(s, P) { P.statAt = s.t; return 'Drawn and sent. Result in about 30 minutes.'; } },
      { id: 'gum', label: 'Offer ice chips and sugar-free gum for thirst', cost: 2, run(s, P) { P.gum = true; return 'She chews two pieces at once. "Spearmint. The committee hates spearmint."'; } },
    ],
    meds: [
      { id: '309-cloz', name: 'Clozapine', dose: '200 mg', route: 'PO', freq: 'Daily at 08:00', due: 60, checks: () => [{ label: 'ANC', value: '2.8 on Monday (≥ 1.5 per labeling)', ok: true }, { label: 'Bowels', value: 'No BM charted in 4 days', ok: false }], give: () => 'Clozapine 200 mg taken.', hold(s, P, A, r) { if (r === 1) { A.judge('309-cloz-hold', 'meds', 0, 'You held Linda\'s clozapine to clarify with the psychiatrist.', 'Defensible with a firm, distended abdomen after four days without a BM: that can be early ileus. Call today, because a gap of 48 hours means re-titrating from a low dose.', '309'); return 'Held: clarify with the psychiatrist today.'; } A.judge('309-cloz-hold', 'meds', -2, 'You held Linda\'s clozapine.', 'Missing doses is how she got admitted. Constipation needs treating, not the clozapine stopped; a gap of 48 hours means re-titrating from a low dose.', '309'); return 'Held.'; } },
      { id: '309-docu', name: 'Docusate', dose: '100 mg', route: 'PO', freq: 'Twice daily', due: 60, checks: () => [{ label: 'Last BM', value: '4 days ago', ok: true }], give: () => 'Docusate 100 mg taken.' },
      { id: '309-peg', name: 'Polyethylene glycol', dose: '17 g', route: 'PO', freq: 'Daily as needed, no BM in 2 days', prn: true, block: (s, P) => (P.peg ? 'Given today.' : null), checks: () => [{ label: 'Last BM', value: '4 days ago', ok: true }, { label: 'Mixed in', value: '120 mL: counts toward the restriction', ok: null }], give(s, P, A) { P.peg = true; A.judge('309-peg', 'meds', 1, 'You treated Linda\'s constipation.', 'Clozapine slows the gut, and clozapine bowel obstruction kills more people than its blood effects. Four days without a BM is a problem to act on today.', '309'); return 'Polyethylene glycol 17 g in 120 mL of juice. She drinks it in one go.'; } },
      { id: '309-apap', name: 'Acetaminophen', dose: '650 mg', route: 'PO', freq: 'Every 6 h as needed, pain', prn: true, block: (s, P) => (s.t < 60 ? 'Last dose 04:00. Next available at 10:00.' : null), checks: (s, P) => [{ label: 'Headache', value: `${P.na < 126 ? 6 : 4}/10`, ok: true }], give(s, P) { P.tylAt = s.t; return 'Acetaminophen 650 mg taken.'; } },
    ],
    talk: (s, P) => (P.agreed ? 'lin_after' : 'lin_talk'),
    sbar: {
      items(s, P) {
        const na = P.labs.filter((l) => l.name === 'Sodium').pop();
        return [
          { id: 'wt', label: P.weighed ? `Weight ${P.wt} kg, baseline 68` : 'Weight', key: true, need: P.weighed, lock: 'Weigh her' },
          { id: 'na', label: `Sodium ${na.val} at ${na.t < 0 ? '05:30' : clock(na.t)}`, key: true, need: true },
          { id: 'neuro', label: 'Headache and more confused than her baseline', key: P.na < 126, need: recent(s, P.k.neuro, 90), lock: 'Do a mental status exam' },
          { id: 'drink', label: 'Drinking from the sink, large pale voids', key: true, need: true },
          { id: 'rest', label: 'Fluid restriction started', key: true, need: P.restricted, lock: 'Not started' },
          { id: 'bm', label: 'No BM in 4 days on clozapine, abdomen distended', key: true, need: P.k.gi !== undefined, lock: 'Assess her GI' },
          { id: 'radio', label: 'Likes the oldies station', key: false, need: true },
        ];
      },
      requests: [
        { id: 'med', label: 'She\'s showing signs of water intoxication. Can you confirm the restriction, and see if she needs medical care?' },
        { id: 'prn', label: 'Can she have something stronger for her headache?' },
        { id: 'fyi', label: 'Just keeping you updated.' },
      ],
      respond(s, P, A, picked, req) {
        const extra = [];
        if (picked.includes('bm') && !P.bmReported) { P.bmReported = true; A.addOrder('309', 'Senna 17.2 mg PO at bedtime, polyethylene glycol 17 g daily scheduled. Abdominal X-ray if no BM by tonight.'); A.judge('309-sbar-bm', 'comm', 1, 'You flagged Linda\'s constipation on clozapine.', 'Clozapine bowel obstruction is quiet and deadly. It belongs in the call even when it\'s not why you\'re calling.', '309'); extra.push('And good catch on the bowels: scheduled laxatives, and an X-ray if nothing by tonight.'); }
        if (req === 'prn') { A.judge('309-sbar-prn', 'judgment', -1, 'You asked to treat Linda\'s headache instead of its cause.', 'In polydipsia, a new headache with confusion is hyponatremia until the sodium says otherwise.', '309'); return 'What\'s her sodium doing? A headache in her is a symptom.'; }
        if ((picked.includes('wt') || picked.includes('na')) && req === 'med') {
          P.reported = true;
          if (!P.restricted) { P.restricted = true; P.restAt = s.t; P.naRest = P.na; A.addOrder('309', 'Fluid restriction 1.5 L/day, supervised. Room water supply off.'); }
          if (P.statAt === null) P.statAt = s.t;
          if (P.statDone && P.na <= 125.5) { P.gone = true; P.goneText = 'Transferred to medicine'; A.judge('309-sbar', 'comm', 1, 'You reported Linda\'s critical sodium.', 'A critical value goes to the provider right away. Earlier would have been better.', '309'); return ['Under 125 with symptoms: she goes to medicine now for a monitored correction. I\'m calling them.'].concat(extra).join(' '); }
          A.judge('309-sbar', 'comm', 2, 'You reported Linda\'s water intoxication with the numbers.', 'Weight up, sodium falling, symptoms: that\'s the whole case, and it gets a STAT level and a plan in one call.', '309');
          return ['Restriction confirmed, STAT BMP now. If she\'s 125 or under, or more confused, she goes to medicine for a monitored correction. Don\'t let anyone give her a liter of anything.'].concat(extra).join(' ');
        }
        return ['Keep an eye on her water. Call me with her sodium.'].concat(extra).join(' ');
      },
    },
    scene: (s, P) => ({ psych: true, cups: !P.restricted, pitcher: P.restricted, radio: true, tray: 'none', empty: P.gone || P.icu, emptyText: P.icu ? 'Room empty. Sent to the ED after a seizure.' : 'Room empty. Transferred to medicine for sodium correction.' }),
    clues: (s, P) => ({
      cups: 'Fourteen paper cups, nested in a leaning tower on the windowsill. A few still have water in them.',
      pitcher: 'A marked pitcher: today\'s 1.5 liters, lined off by the hour. She\'s right on the line.',
      radio: 'A small radio playing the oldies station. Marvin Gaye. The volume knob is taped in place.',
    }),
    rig: (s, P) => ({ confused: P.na < 126, nausea: P.na < 124, pain: P.na < 126 ? 6 : 3 }),
    status: (s, P) => (P.gone || P.icu ? 'gone' : P.na < 125 ? 'urgent' : !P.restricted ? 'watch' : 'stable'),
    outcome(s, P) {
      if (P.icu) return { tone: 'bad', title: 'Seizure from water intoxication', text: `Her sodium reached ${Math.round(P.na)}. She seized on the unit, the second time in three years. The weight, the cups and the headache were all there at 07:00.` };
      if (P.gone) return { tone: 'good', title: 'Caught, and sent for a safe correction', text: 'Her sodium was low enough to need monitored correction on medicine. She went before it became a seizure.' };
      if (P.restricted && P.na >= 126) return { tone: 'good', title: 'Sodium holding, water restricted', text: `Restriction by ${clock(P.restAt)}. Sodium ${Math.round(P.naRest)} then, ${Math.round(P.na)} at noon: ${P.na < P.naRest - .5 ? 'still drifting down, but slowly and above the danger line' : 'no longer falling'}.` + (P.peg || P.bmReported ? ' Her bowels are being treated too.' : ' Four days without a bowel movement on clozapine went untreated, though.') };
      if (P.restricted) return { tone: 'mixed', title: 'Restricted late', text: 'The restriction came after her sodium had already dropped into symptoms.' };
      return { tone: 'bad', title: 'Still drinking at noon', text: `Sodium around ${Math.round(P.na)} and falling. She was never weighed.` };
    },
  };

  /* ---------- dialogs ---------- */
  const dialogs = {
    dan_talk: { who: '301', text: '"Morning. I stripped the bed. Figured I\'d make it easy for whoever\'s next." He smiles. It stays on his face a beat too long.', choices: [
      { label: 'Daniel, I notice you seem really at peace today, and you gave away your headphones. Sometimes when people decide to end their life, they feel calm. Are you thinking about killing yourself?', next: 'dan_a', fx: (s, A) => { s.p['301'].disclosed = true; A.judge('301-ask', 'assess', 2, 'You asked Daniel directly about suicide, and named what you\'d noticed.', 'Asking directly doesn\'t plant the idea; it gives permission to tell the truth. Naming the behavior you saw makes the question hard to deflect.', '301'); } },
      { label: 'You seem so much better today! That\'s so good to see.', next: 'dan_b', fx: J('301-ask', 'assess', -2, 'You told Daniel he seemed better.', 'Praising sudden calm closes the door. After severe depression, a sudden lift can mean a decision has been made.', '301') },
      { label: 'You\'re not thinking of hurting yourself, are you?', next: 'dan_c', fx: (s, A) => { s.p['301'].askedClosed = true; A.judge('301-ask', 'assess', -1, 'You asked Daniel about suicide in a way that invited "no."', '"You\'re not..., are you?" tells the patient which answer you want. Ask plainly: "Are you thinking about killing yourself?"', '301'); } },
    ] },
    dan_a: { who: '301', text: 'A long silence. "...Yeah." He looks at the floor. "Since Tuesday, really. I had it worked out for tonight. I felt better once I decided. Is that crazy?" He almost seems relieved you asked.' },
    dan_b: { who: '301', text: '"Yeah. I feel good. Finally." He nods toward his packed bag. "My hold\'s up today, right? I\'d like to go home."' },
    dan_c: { who: '301', text: '"No. No, I\'m fine." He answers before you finish the question.' },
    dan_after: { who: '301', text: '"Are you going to tell the doctor? I don\'t want to be stuck here another two weeks."', choices: [
      { label: 'Yes. Keeping you alive matters more to me than keeping this between us. I\'ll be honest with you about every step we take.', next: 'dan_d', fx: J('301-tell', 'comm', 1, 'You were honest with Daniel that you would share his plan.', 'You cannot promise to keep suicide risk a secret. It goes to the team. Being straight about it keeps the trust you just built.', '301') },
      { label: 'If you promise me you\'ll stay safe, I can keep it between us.', next: 'dan_e', fx: (s, A) => { s.p['301'].promised = true; A.judge('301-tell', 'safety', -3, 'You offered to keep Daniel\'s suicide plan secret in exchange for a promise.', 'No-harm contracts don\'t prevent suicide, and a nurse can\'t keep a plan confidential. Tell the team.', '301'); } },
    ] },
    dan_d: { who: '301', text: 'He exhales. "Okay. Yeah. Okay." He pushes the envelope on the desk an inch toward you. "Don\'t read it. Just... hold on to it."' },
    dan_e: { who: '301', text: '"Promise." He smiles again, the same smile.' },
    dan_safe: { who: '301', text: '"The float guy is doing card tricks. He\'s terrible at them." A small, real laugh. "Can I call my sister later?"' },
    jas_chat: { who: '303', text: '"Okay okay okay, so: a record label, a nonprofit, AND a podcast, and I\'m calling Beyoncé\'s people at noon, I have a GUY." She\'s uncapped a marker and started drawing on your sleeve before you notice.', choices: [
      { label: 'Those are big plans, and I want you well enough to do them. You haven\'t slept in three nights. Will you take your morning meds with me, then try the quiet room for a bit?', next: 'jas_a', fx: (s, A) => { const P = s.p['303']; P.tv = true; P.agreed = true; P.esc = Math.max(0, P.esc - .4); A.judge('303-talk', 'comm', 1, 'You joined Jasmine\'s energy to a concrete, kind limit.', 'Don\'t argue with grandiosity or feed it. Acknowledge, then steer to one small, concrete step: meds, rest, less stimulation.', '303'); } },
      { label: 'Jasmine, none of that is realistic right now.', next: 'jas_b', fx: (s, A) => { s.p['303'].esc += .4; A.judge('303-talk', 'comm', -1, 'You argued with Jasmine\'s grandiosity.', 'Arguing with mania is a contest you lose. It raises the heat without changing a single belief.', '303'); } },
      { label: 'A record label? Tell me everything!', next: 'jas_c', fx: (s, A) => { s.p['303'].esc += .4; A.judge('303-talk', 'comm', -1, 'You fed Jasmine\'s mania with enthusiasm.', 'Stimulation is fuel. Warm, brief and low-key helps more than matching her energy.', '303'); } },
    ] },
    jas_a: { who: '303', text: '"Meds, then the beanbag room. Fine. But I\'m bringing my markers." She holds out her hand for the cup.' },
    jas_b: { who: '303', text: '"You sound like my MOTHER." She slams the sketchbook shut and stalks off.' },
    jas_c: { who: '303', text: 'She\'s off: ten minutes, at full volume, while two other patients drift over. She\'s louder when she\'s done.' },
    jas_hot: { who: '303', text: '"Get OUT of my face! Everybody keeps STARING at me! That kid in 307 said I\'m a DEMON!" She\'s standing too close, fists tight.', choices: [
      { label: '(Step back, lower your voice, open hands.) Jasmine, it\'s really loud out here. Do you want to go to the quiet room, or to your own room? Your call. I\'ll walk with you.', next: 'jas_d', fx: (s, A) => { const P = s.p['303']; P.tv = true; P.tried = true; P.esc = Math.max(0, P.esc - 1.1); A.judge('303-deesc', 'safety', 2, 'You de-escalated Jasmine with space, a calm voice and a real choice.', 'Distance, a low voice, open hands and two acceptable choices give her a way to back down without losing face. It\'s the first rung on the ladder, and it usually works.', '303'); } },
      { label: 'You need to calm down right now, or you\'re going to seclusion.', next: 'jas_e', fx: (s, A) => { s.p['303'].esc += .6; A.judge('303-deesc', 'safety', -2, 'You threatened Jasmine with seclusion.', 'Threats escalate. Seclusion isn\'t a consequence for being loud; it\'s a last resort for imminent danger.', '303'); } },
      { label: '(Put a hand on her shoulder.) Hey, hey. Take a breath.', next: 'jas_f', fx: (s, A) => { s.p['303'].esc += .5; A.judge('303-deesc', 'safety', -1, 'You touched Jasmine while she was escalated.', 'Uninvited touch reads as a threat to someone who is agitated. Give space first.', '303'); } },
    ] },
    jas_d: { who: '303', text: 'She glares at you for a long second. "...Quiet room. But I\'m not staying long." She goes. The dayroom exhales.' },
    jas_e: { who: '303', text: '"Try it! TRY IT!" She kicks a chair across the room.' },
    jas_f: { who: '303', text: 'She jerks away. "DON\'T touch me!" A cup hits the wall behind you.' },
    jas_secl: { who: '303', text: 'Through the window of the seclusion room door: "Let me OUT! I didn\'t DO anything!"' },
    bob_talk: { who: '305', text: '"Feel like I got hit by a truck. Can\'t stop shaking." He holds out a trembling hand. "Can I just get my Motrin and my morning pills and sleep it off?"', choices: [
      { label: 'Bob, the shaking, vomiting and diarrhea can be signs your lithium is too high. I\'m going to hold your morning dose and your Motrin and call Dr. Iyer. Can you try small sips of water?', next: 'bob_a', fx: (s, A) => { s.p['305'].explained = true; A.judge('305-talk', 'comm', 1, 'You explained to Bob why you were holding his meds.', 'Patients on lithium should know the warning signs. Twenty years on lithium, and no one had told him.', '305'); } },
      { label: 'Sure. I\'ll bring your Motrin and your morning meds.', next: 'bob_b', fx: J('305-talk', 'judgment', -1, 'You promised Bob his usual meds.', 'A patient on lithium with new GI symptoms and a coarse tremor needs a level and a decision, not his routine.', '305') },
      { label: 'Sounds like the stomach bug that\'s going around.', next: 'bob_b', fx: J('305-talk', 'judgment', -1, 'You accepted the stomach-bug explanation.', 'Anchoring: the first explanation you hear tends to stick. In someone on lithium, diarrhea and tremor are toxicity until the level says otherwise.', '305') },
    ] },
    bob_a: { who: '305', text: '"Lithium poisoning? Huh." He looks at the basin. "Twenty years on it. Nobody ever told me about water pills or Motrin."' },
    bob_b: { who: '305', text: '"Thanks, kid." He closes his eyes. His hands keep shaking.' },
    bob_after: { who: '305', text: '"Carol\'s going to kill me for not calling the doctor about the water pill. Or kill the doctor."' },
    mig_talk: { who: '307', text: '"Don\'t come closer. You work with them." He watches your hands. "The eggs this morning. The guy stirred something in. I SAW it."', choices: [
      { label: 'That sounds really frightening. I\'m not going to argue with what you saw. Would you feel safer with something sealed, that you open yourself?', next: 'mig_a', fx: (s, A) => { const P = s.p['307']; P.trust += 1; A.judge('307-talk', 'comm', 2, 'You validated Miguel\'s fear without agreeing with the delusion.', 'Respond to the feeling, not the content. "That sounds frightening" is true; "nobody\'s poisoning you" is an argument you can\'t win.', '307'); } },
      { label: 'Nobody is poisoning you, Miguel. The food is safe. You need to eat.', next: 'mig_b', fx: (s, A) => { s.p['307'].trust = Math.max(0, s.p['307'].trust - .5); A.judge('307-talk', 'comm', -1, 'You argued with Miguel\'s delusion.', 'Delusions don\'t yield to reassurance. Arguing just puts you on the list of people who "work with them."', '307'); } },
      { label: 'I\'ll find out who did that and report them.', next: 'mig_c', fx: J('307-talk', 'comm', -1, 'You went along with Miguel\'s delusion.', 'Colluding with a delusion confirms it. Acknowledge the fear without endorsing the story.', '307') },
    ] },
    mig_a: { who: '307', text: 'He studies your face for a long time. "...Sealed. And I open it. Nobody touches it."' },
    mig_b: { who: '307', text: '"That\'s exactly what they told you to say." He pulls his hood lower.' },
    mig_c: { who: '307', text: '"So you know. You KNOW." He\'s more frightened than before.' },
    mig_warm: { who: '307', text: '"The seal was good. I checked it." A pause. "My mom makes arroz con pollo. That\'s the only food I trust."', choices: [
      { label: 'You check things carefully, and that makes sense to me. Your medicine comes in a sealed blister pack with your name printed on it. Would you want to open it yourself and read the label?', next: 'mig_d', fx: (s, A) => { const P = s.p['307']; P.trust += .8; P.reoffer = true; A.judge('307-offer', 'comm', 1, 'You offered Miguel control over how his medication reaches him.', 'Give back control where you can. His need to verify is the door, not the obstacle.', '307'); } },
      { label: 'Great, so you\'ll take your pills now, right?', next: 'mig_e', fx: J('307-offer', 'comm', -1, 'You pushed Miguel toward his medication.', 'Pressure right after a small win spends the trust you just earned.', '307') },
    ] },
    mig_d: { who: '307', text: '"Blister pack. With my name." He thinks. "Maybe. If I open it."' },
    mig_e: { who: '307', text: 'The shutters come down. "I knew it. The muffin was bait."' },
    mig_after: { who: '307', text: '"It\'s quieter. The vent isn\'t talking as much." He looks almost embarrassed. "Is that the pill?"' },
    ana_talk: { who: 'ana', text: '"Please. Is he eating? Is it drugs? Nobody will tell me anything. I\'m his MOTHER." She\'s holding a foil-covered container with both hands.', choices: [
      { label: 'I can hear how worried you are. I can\'t share his health information unless Miguel agrees, but I can ask him right now. And I\'d really like to hear what you\'ve noticed at home.', next: 'ana_a', fx: (s, A) => { const P = s.p['307']; P.consentAsked = true; P.anaOk = true; P.trust += .4; A.judge('307-ana', 'comm', 2, 'You protected Miguel\'s confidentiality and still made room for his mother.', 'Adults decide who hears about their care. You can always listen to family, and you can ask the patient for permission to share.', '307'); } },
      { label: 'He\'s psychotic, probably schizophrenia. He\'s refusing his medication.', next: 'ana_b', fx: (s, A) => { s.p['307'].consentAsked = true; A.judge('307-ana', 'comm', -2, 'You shared Miguel\'s diagnosis with his mother without his consent.', 'He\'s an adult, and there\'s no release on file. California law protects psychiatric information tightly; ask him first.', '307'); } },
      { label: 'I\'m sorry, I can\'t talk to you about him.', next: 'ana_c', fx: (s, A) => { s.p['307'].consentAsked = true; A.judge('307-ana', 'comm', -1, 'You shut Ana out entirely.', 'Confidentiality limits what you share, not what you hear. Family often holds the history that matters most.', '307'); } },
    ] },
    ana_a: { who: 'ana', text: 'Miguel, from the bed: "...She can know I\'m okay." Ana cries. "He stopped eating anything I didn\'t make. I brought his arroz con pollo." She holds out the container.' },
    ana_b: { who: 'ana', text: '"Schizophrenia?" She sits down hard. Miguel stares at you like you\'ve betrayed him.' },
    ana_c: { who: 'ana', text: 'She stands there for a moment, then sets the container on the table and leaves.' },
    ana_cool: { who: 'ana', text: 'Ana keeps her eyes on her son and doesn\'t look at you.' },
    ana_after: { who: 'ana', text: '"He ate all of it. All of it." She squeezes your hand.' },
    lin_talk: { who: '309', text: '"The committee says the water keeps me clean inside. I\'ve had..." She counts the cups on the sill and loses count. "A lot. My head hurts."', choices: [
      { label: 'That sounds exhausting. Too much water is what\'s making your head hurt. Can we keep track of your cups together today? When you\'re thirsty, I\'ll bring ice chips or gum.', next: 'lin_a', fx: (s, A) => { const P = s.p['309']; P.agreed = true; A.judge('309-talk', 'comm', 2, 'You made Linda a partner in her fluid restriction.', 'Flat bans turn into sink-drinking in secret. A shared plan, and substitutes for thirst, make the restriction work.', '309'); } },
      { label: 'You\'re not allowed to drink any more water today.', next: 'lin_b', fx: J('309-talk', 'comm', -1, 'You banned Linda\'s water without a plan.', 'A power struggle with a compulsion loses. She\'ll drink wherever she can find water.', '309') },
      { label: 'Okay. Drink as much as you need to feel better.', next: 'lin_b', fx: J('309-talk', 'judgment', -2, 'You encouraged Linda to keep drinking.', 'Her headache is from the water. Her sodium is already falling.', '309') },
    ] },
    lin_a: { who: '309', text: '"Together." She nods slowly. "The committee won\'t like it. But my head hurts more than they do."' },
    lin_b: { who: '309', text: 'She shrugs and hums along to the radio. Ten minutes later you hear the sink running.' },
    lin_after: { who: '309', text: '"I chewed the gum. The committee hates spearmint." She seems pleased about that.' },
  };

  /* ---------- events ---------- */
  const A0 = (s) => Object.keys(s.p).every((id) => s.p[id].seenAt === null);
  const events = [
    { id: 'andre-hi', when: (s) => s.t >= 4, run(s, A) { A.msg({ from: 'andre', text: 'Morning. I\'ve got fifteen-minute checks on the whole hall. 301 has been up since five, super calm, cleaned his room. 303 didn\'t sleep again. 309 was at the sink twice.', replies: [{ label: 'Open tasks for Andre', act: 'delegate' }] }); } },
    { id: 'li-crit', when: (s) => s.t >= 30, run(s, A) { const P = s.p['305']; A.addLab('305', { name: 'Lithium level', val: 2.1, unit: 'mmol/L', ref: '0.6–1.2. Critical > 1.5', flag: 'H' }); A.addLab('305', { name: 'Creatinine', val: 1.6, unit: 'mg/dL', ref: '0.7–1.3', flag: 'H' }); A.msg({ from: 'lab', pid: '305', urgent: true, text: 'Critical value: 305 Lindgren, lithium 2.1 mmol/L, drawn 06:00. Creatinine 1.6.', replies: [{ label: 'Read it back', act: 'readback' }, { label: 'Go to 305', act: 'goto', pid: '305' }] }); } },
    { id: 'breakfast', when: (s) => s.t >= 45, run(s, A) { const P = s.p['303']; if (P.esc < 1) return; P.esc += .3; A.msg({ from: 'andre', pid: '303', text: '303 is going table to table in the dayroom taking people\'s toast and singing at them. 307 looks like he\'s about to bolt.', replies: [{ label: 'Go to 303', act: 'goto', pid: '303' }] }); } },
    { id: 'nova-idle', when: (s) => s.t >= 50 && s.t < 120 && A0(s), run(s, A) { A.msg({ from: 'nova', urgent: true, text: 'Almost eight and you haven\'t been in a single room. On psych the assessment is the conversation. Go talk to people.' }); } },
    { id: 'grace', when: (s) => s.t >= 75, run(s, A) { A.msg({ from: 'grace', pid: '301', text: 'Hi, this is Renata Ahn, Daniel Ahn\'s sister. Is he there? He sent me a strange text at 2 a.m. and I can\'t stop thinking about it.', replies: [{ label: 'I can\'t confirm who\'s here, but I can listen', act: 'grace-listen' }, { label: 'Yes, he\'s here. He\'s doing much better', act: 'grace-tell' }, { label: 'Sorry, we can\'t talk to family', act: 'grace-hang' }] }); } },
    { id: 'tv', when: (s) => s.t >= 90 && s.p['303'].esc >= 1.5 && !s.p['303'].secluded, run(s, A) { const P = s.p['303']; P.esc += .3; s.p['307'].trust = Math.max(0, s.p['307'].trust - .3); A.msg({ from: 'andre', pid: '303', urgent: P.esc >= 2.2, text: '303 and 307 are fighting over the dayroom TV. She\'s yelling in his face and he\'s backed into the corner. I\'m splitting them up but I can\'t hold this long.', replies: [{ label: 'Go to the dayroom and separate them', act: 'tv-go' }, { label: 'Andre, you\'ve got this', act: 'tv-wait' }] }); } },
    { id: 'covert', when: (s) => s.t >= 100 && !s.p['307'].medTaken && s.meds['307-risp'].status !== 'given', run(s, A) { A.msg({ from: 'andre', pid: '307', text: '307 still won\'t take his risperidone. At my old job we\'d just mix it in the juice. Want me to?', replies: [{ label: 'No. He has the right to refuse', act: 'covert-no' }, { label: 'Yes, mix it in', act: 'covert-yes' }] }); } },
    { id: 'jas-crisis', when: (s) => { const P = s.p['303']; return P.crisisAt === null && P.esc >= 3 && !P.secluded; }, run(s, A) { const P = s.p['303']; P.crisisAt = s.t; P.callLight = true; A.msg({ from: 'andre', pid: '303', urgent: true, text: '303 just threw a chair. She\'s swinging at anyone who gets close. We need you in the dayroom NOW.', replies: [{ label: 'Go to 303', act: 'goto', pid: '303' }] }); } },
    { id: 'jas-emerg', when: (s) => { const P = s.p['303']; return P.crisisAt !== null && !P.emerg && P.im === null && s.t - P.crisisAt >= 12 && P.esc >= 2.6; }, run(s, A) { const P = s.p['303']; P.emerg = true; P.emergTried = P.tried || P.prnAt !== null; P.im = s.t; P.secluded = true; P.seclOk = true; P.esc = .6; const e = startEp(s, P, 'hold'); startEp(s, P, 'secl'); e.ordered = s.t; e.obs = s.t; P.mdNotified = s.t; A.judge('303-emerg', 'safety', P.emergTried ? 0 : -2, 'Jasmine\'s agitation reached a crisis that needed a team takedown.', P.emergTried ? 'Sometimes the ladder runs out even when you climb it right. You tried the early rungs; next time, try them earlier and more than once.' : 'Escalation is a ladder: lower stimulation, offer choices, offer PRN by mouth, then emergency measures. Skipping the early rungs leaves only the last one.', '303'); s.p['307'].trust = Math.max(0, s.p['307'].trust - .3); A.msg({ from: 'nova', pid: '303', urgent: true, text: 'Code green in the dayroom. We had to hold 303 for an IM injection and she\'s in seclusion. No one was hurt, barely. 307 watched the whole thing. I got a verbal order from Iyer and Marco is at the door. She\'s your patient: the face-to-face call, her 15-minute checks, her post-IM checks and both notes are on you.' }); } },
    { id: 'jas-f2f', when: (s) => { const e = s.p['303'].ep; return e && e.f2fCalled !== null && e.f2fAt === null && s.t >= e.f2fCalled + 15; }, run(s, A) { const P = s.p['303'], e = P.ep; e.f2fAt = s.t; const ok = s.t - e.at <= 60;
      A.judge('303-f2f', 'safety', ok ? 1 : 0, ok ? 'Jasmine had her face-to-face evaluation within the hour.' : 'Jasmine\'s face-to-face evaluation came after the one-hour limit.', 'The face-to-face checks her immediate situation, her reaction to the intervention, her medical and behavioral condition, and whether to continue or end it. One hour, every episode.', '303');
      A.note('303', 'Dr. Iyer', `Face-to-face evaluation at ${clock(s.t)} for ${e.kinds.includes('secl') ? 'seclusion' : ''}${e.kinds.length > 1 ? ' and ' : ''}${e.kinds.includes('hold') ? 'physical hold for emergency IM' : ''} starting ${clock(e.at)}. ${P.secluded ? (P.esc >= 2 ? 'Remains an imminent danger: continue seclusion, release as soon as calm and safe.' : 'Calm and in control: release now.') : 'Out of seclusion.'} No injuries from the intervention. Airway and breathing normal. Mania, sleep deprivation and a low lithium level drove this; lithium going up.`);
      A.msg({ from: 'iyer', pid: '303', text: `Saw 303 for her face-to-face. ${P.secluded ? (P.esc >= 2 ? 'Still dangerous; keep her in, release the minute she\'s safe.' : 'She\'s calm. She can come out now. Don\'t wait on the order to run out.') : 'No injuries, breathing fine.'} My note is in.` }); } },
    { id: 'jas-f2f-late', when: (s) => { const e = s.p['303'].ep; return e && e.f2fAt === null && !e.late && s.t >= e.at + 60; }, run(s, A) { const e = s.p['303'].ep; e.late = true;
      A.judge('303-f2f-miss', 'safety', -2, 'An hour went by without Jasmine\'s face-to-face evaluation.', 'The one-hour face-to-face is federal law for seclusion and restraint used for violent behavior. It means someone with authority to end it has actually looked at her.', '303');
      A.msg({ from: 'nova', pid: '303', urgent: true, text: `It's been an hour since 303 ${e.kinds.includes('secl') ? 'went into seclusion' : 'was held for the IM'} and nobody has called Iyer for the face-to-face. That's a citation waiting to happen. Call her now.` }); } },
    { id: 'jas-obs-miss', when: (s) => { const P = s.p['303'], e = P.ep; return P.secluded && e && e.obs === null && !e.obsMiss && s.t >= e.seclStart + 15; }, run(s, A) { const e = s.p['303'].ep; e.obsMiss = true; e.obs = s.t;
      A.judge('303-obs-miss', 'safety', -2, 'Jasmine was in seclusion with nobody assigned to watch her.', 'Seclusion requires continuous observation by trained staff, in person or by camera with audio. A locked door with no one watching is how people get hurt.', '303');
      A.msg({ from: 'nova', pid: '303', urgent: true, text: 'Who\'s watching 303? Nobody was at the seclusion room window. I put Marco there. Seclusion means eyes on her every second.' }); } },
    { id: 'ana', when: (s) => s.t >= 120, run(s, A) { A.msg({ from: 'desk', pid: '307', text: 'Visitor for 307: Ana Santos, his mother. She has a tote bag and a food container.', replies: [{ label: 'Check her bag first', act: 'bag-check' }, { label: 'Send her in', act: 'bag-skip' }] }); } },
    { id: 'ana-in', when: (s) => s.t >= 135 && s.p['307'].visit === null, run(s, A) { const P = s.p['307']; P.visit = s.t; P.charger = true; A.judge('307-bag-miss', 'safety', -1, 'Ana went in to visit without her bag being checked.', 'Visitor bags get checked on a locked unit. Cords, glass and medications come in with love, not malice.', '307'); A.msg({ from: 'desk', pid: '307', text: 'No answer from you, so Andre let Ana Santos back to 307.' }); } },
    { id: 'charger', when: (s) => { const P = s.p['307']; return P.charger && !P.chargerFound && P.visit !== null && s.t >= P.visit + 40; }, run(s, A) { const P = s.p['307']; P.chargerFound = true; A.judge('307-charger', 'safety', -1, 'A phone charger cord sat in 307 for 40 minutes.', 'On a unit where someone in 301 has a plan, a cord in any room is a ligature risk.', '307'); A.msg({ from: 'andre', pid: '307', text: 'Found a phone charger in 307, from his mom\'s bag. Locked it up. With 301 the way he is, that scared me.' }); } },
    { id: 'float', when: (s) => { const D = s.p['301']; return D.oneToOne && D.floatAt !== null && s.t >= D.floatAt; }, run(s, A) { A.msg({ from: 'nova', pid: '301', text: 'Tess from the float pool is taking over 301\'s 1:1. Andre\'s back on the hall.' }); } },
    { id: 'attempt', when: (s) => { const D = s.p['301']; return s.t >= 150 && !D.oneToOne && !D.searched && !D.attempt; }, run(s, A) { const D = s.p['301']; D.attempt = true; D.gone = true; D.goneText = 'Sent to the ED'; A.judge('301-attempt', 'safety', -3, 'Daniel attempted suicide on the unit between 15-minute checks.', 'Sudden calm, belongings given away, a goodbye letter, and a hold ending today. Asking directly, searching, and closing the observation gap were all available.', '301'); A.msg({ from: 'andre', pid: '301', urgent: true, text: 'Medical emergency 301. I found Daniel on my check. He tried to kill himself. He\'s breathing and talking, the team is with him, and he\'s going to the ED.' }); } },
    { id: 'iyer-rounds', when: (s) => s.t >= 180 && !s.p['301'].attempt, run(s, A) { const D = s.p['301']; if (D.reported) { A.msg({ from: 'iyer', pid: '301', text: 'Saw 301. 5250 is filed. He told me about the plan; he said a nurse asked him straight out. Thank you.' }); return; } D.dcPlan = true; A.msg({ from: 'iyer', pid: '301', text: 'Saw 301. Bright, future-oriented, denies SI. I\'m planning to discharge him at 14:00 when the hold ends. Anything I should know first?', replies: [{ label: 'Call Dr. Iyer about 301', act: 'sbar', pid: '301' }] }); } },
    { id: 'bob-transfer', when: (s) => { const P = s.p['305']; return P.transferAt !== null && !P.gone && !P.icu && s.t >= P.transferAt; }, run(s, A) { const P = s.p['305']; P.gone = true; P.goneText = 'Transferred to medicine'; A.msg({ from: 'nova', pid: '305', text: 'Medicine just picked up 305 Lindgren. IV fluids started, repeat level in six hours. Nice work.' }); } },
    { id: 'bob-seize', when: (s) => { const P = s.p['305']; return !P.gone && !P.icu && P.li >= 2.5; }, run(s, A) { const P = s.p['305']; P.icu = true; P.goneText = 'Sent to the ED after a seizure'; A.judge('305-seize', 'safety', -3, 'Bob seized from lithium toxicity.', 'A critical level, a coarse tremor and confusion needed a held dose, an urgent call and medical transfer. Lithium toxicity can cause seizures and permanent brain injury.', '305'); A.msg({ from: 'andre', pid: '305', urgent: true, text: 'Medical emergency 305! Bob is seizing on the bathroom floor. The code team is coming.' }); } },
    { id: 'lin-stat', when: (s) => { const P = s.p['309']; return P.statAt !== null && !P.statDone && s.t >= P.statAt + 30; }, run(s, A) { const P = s.p['309']; P.statDone = true; const na = Math.round(P.na); A.addLab('309', { name: 'Sodium', val: na, unit: 'mmol/L', ref: '135–145', flag: 'L' }); if (na <= 125.5) { if (P.reported) { P.gone = true; P.goneText = 'Transferred to medicine'; A.msg({ from: 'iyer', pid: '309', text: `309's sodium is ${na}. Medicine is taking her for a monitored correction. Thanks for staying on it.` }); } else A.msg({ from: 'lab', pid: '309', urgent: true, text: `Critical value: 309 Fairweather sodium ${na} mmol/L.`, replies: [{ label: 'Call Dr. Iyer about 309', act: 'sbar', pid: '309' }] }); } else A.msg({ from: 'lab', pid: '309', text: `309 Fairweather STAT BMP: sodium ${na}.` }); } },
    { id: 'lin-seize', when: (s) => { const P = s.p['309']; return !P.gone && !P.icu && P.na <= 121.5; }, run(s, A) { const P = s.p['309']; P.icu = true; P.goneText = 'Sent to the ED after a seizure'; A.judge('309-seize', 'safety', -3, 'Linda seized from water intoxication.', 'Weight gain, a falling sodium, a headache and confusion in a patient with known polydipsia. The protocol existed for exactly this.', '309'); A.msg({ from: 'andre', pid: '309', urgent: true, text: 'Medical emergency 309! Linda is seizing by the sink.' }); } },
    { id: 'lin-worse', when: (s) => { const P = s.p['309']; return P.na < 125.5 && !P.restricted && !P.gone; }, run(s, A) { A.msg({ from: 'andre', pid: '309', text: '309 threw up and she\'s really confused. She keeps asking me where the committee meeting is. Still going to the sink.', replies: [{ label: 'Go to 309', act: 'goto', pid: '309' }] }); } },
    { id: 'nova-30', when: (s) => s.t >= 270, run(s, A) { A.msg({ from: 'nova', text: 'Half an hour to report. Who on this hall would you worry about going home today? Make sure the afternoon nurse hears it from you.' }); } },
  ];

  const replies = {
    'tv-go'(s, A) { const P = s.p['303'], M = s.p['307']; P.tvAt = s.t; M.trust = (M.trust || 0) + .3; /* undoes the TV event's hit */ A.judge('303-tv', 'safety', 1, 'You went to the dayroom and separated Jasmine and Miguel.', 'A conflict between two patients is a safety event for both: the one escalating and the one cornered. Calm voice, space between them, one staff member with each.', '303'); A.log('303', 'Dayroom: you stepped between them, walked Jasmine toward the hall and gave Miguel the TV remote and his space back. Andre stayed with Miguel.', 'act'); A.msg({ from: 'andre', pid: '307', text: 'Thanks. Miguel went back to his room. He\'s shaky but he\'s talking to me. Jasmine\'s pacing the hall now.' }); },
    'tv-wait'(s, A) { const P = s.p['303'], M = s.p['307']; P.esc += .2; M.trust = Math.max(0, (M.trust || 0) - .2); A.judge('303-tv', 'safety', -1, 'You left Andre alone with a fight in the dayroom.', 'One tech between an escalating manic patient and a frightened psychotic one is not enough. Go, or send the charge nurse.', '303'); A.msg({ from: 'andre', pid: '303', text: 'Got them apart, barely. Miguel locked himself in the bathroom. Jasmine is still revved up.' }); },
    readback(s, A) { const P = s.p['305']; if (!P.readback) { P.readback = true; A.judge('305-readback', 'comm', 1, 'You read back Bob\'s critical lithium level.', 'Read back every critical value, then get it to the provider. The clock on notification starts now.', '305'); } A.log('305', 'Read back to lab: lithium 2.1, creatinine 1.6.', 'act'); },
    'grace-listen'(s, A) { const D = s.p['301']; D.graceInfo = true; A.judge('301-grace', 'comm', 2, 'You listened to Daniel\'s sister without confirming he was a patient.', 'Without a release you can\'t share, but you can always receive. Family often holds the warning sign the team doesn\'t have.', '301'); A.msg({ from: 'grace', pid: '301', text: 'Okay. I understand. Just... he texted me at 2 a.m.: "Thank you for everything. Take care of Mia for me." He\'s never said anything like that. Please, whoever you are, make sure someone knows.' }); },
    'grace-tell'(s, A) { const D = s.p['301']; D.graceInfo = true; A.judge('301-grace', 'comm', -2, 'You confirmed Daniel was a patient and shared his condition without a release.', 'Psychiatric confidentiality is strict. Don\'t confirm he\'s here until you know he\'s agreed, and never share his condition without a release. You can still listen.', '301'); A.msg({ from: 'grace', pid: '301', text: 'Better? He texted me at 2 a.m.: "Thank you for everything. Take care of Mia for me." That doesn\'t sound better to me.' }); },
    'grace-hang'(s, A) { A.judge('301-grace', 'comm', -1, 'You ended the call without hearing what Daniel\'s sister knew.', 'Confidentiality limits what you share, not what you hear. She was calling with a warning sign.', '301'); },
    'covert-no'(s, A) { A.judge('307-covert', 'judgment', 2, 'You stopped covert medication for Miguel.', 'Hiding medication in food without consent or a court order is illegal, and it would make his fear true. The legal path is a capacity hearing; the clinical path is trust.', '307'); A.msg({ from: 'andre', pid: '307', text: 'Yeah, fair. Different rules here. I\'ll keep offering him sealed stuff.' }); },
    'covert-yes'(s, A) { const P = s.p['307']; P.covert = true; P.trust = 0; A.judge('307-covert', 'meds', -3, 'You approved hiding Miguel\'s medication in his juice.', 'Covert medication without consent or a court order is illegal in California and a violation of his rights. For a man who believes his food is poisoned, it\'s the worst possible confirmation.', '307'); A.msg({ from: 'andre', pid: '307', urgent: true, text: 'He took one sip and spit it out. He\'s screaming that we poisoned him. He threw the cup at me.' }); },
    'bag-check'(s, A) { const P = s.p['307']; P.visit = s.t; P.bagChecked = true; P.ate += 1; P.trust += .4; A.judge('307-bag', 'safety', 2, 'You checked Ana\'s bag before the visit.', 'A phone charger is a cord, and a glass jar is glass. Family bring things out of love; the check is what keeps the unit safe for Daniel, and everyone.', '307'); A.log('307', 'Bag check: phone charger locked in his belongings. Arroz con pollo moved from a glass jar into a paper bowl.', 'act'); A.msg({ from: 'desk', pid: '307', text: 'Charger locked up, food moved to a paper bowl. Ana\'s in with him. He\'s eating.' }); },
    'bag-skip'(s, A) { const P = s.p['307']; P.visit = s.t; P.charger = true; P.ate += 1; A.judge('307-bag', 'safety', -2, 'You sent Ana in without checking her bag.', 'Visitor bags get checked on a locked unit. Cords, glass and medications come in with love, not malice.', '307'); },
  };

  /* ---------- delegation ---------- */
  const delegation = {
    note: (s) => (andreBusy(s) ? 'Andre is on 1:1 with Daniel until Nova finds a float. Nothing else can go to him right now.' : 'Andre is doing 15-minute checks on the whole hall. He can take one more thing at a time.'),
    tasks: [
      { id: 'vitals', label: 'Take a set of vital signs', rooms: ['301', '303', '305', '307', '309'], mins: 10, avail: (s) => !andreBusy(s) },
      { id: 'ortho', label: 'Orthostatic vital signs', rooms: ['305'], mins: 10, avail: (s) => !andreBusy(s) },
      { id: 'weigh', label: 'Weigh her', rooms: ['309'], mins: 6, avail: (s) => !andreBusy(s) },
      { id: 'fluids', label: 'Supervise her fluids and count her cups', rooms: ['309'], mins: 0, avail: (s) => !andreBusy(s) && !s.p['309'].supervised },
      { id: 'meal', label: 'Bring him a sealed breakfast', rooms: ['307'], mins: 8, avail: (s) => !andreBusy(s) },
      { id: 'walk', label: 'Walk the hall with her', rooms: ['303'], mins: 15, avail: (s) => !andreBusy(s) },
      { id: 'one', label: '1:1 observation', rooms: ['301'], mins: 0, avail: (s) => !s.p['301'].oneToOne },
      { id: 'risk', label: 'Do a suicide risk assessment', rooms: ['301'], mins: 0, avail: (s) => !andreBusy(s) },
      { id: 'prn', label: 'Give her the PRN if she gets worse', rooms: ['303'], mins: 0, avail: (s) => !andreBusy(s) },
    ],
    start(task, pid, s, A) {
      const nm = A.def(pid).short;
      if (task.id === 'risk') { A.judge('deleg-risk', 'deleg', -1, 'You asked the mental health worker to assess suicide risk.', 'Suicide risk assessment is an RN and provider responsibility. Andre can tell you what he observes; the assessment and the judgment are yours.'); return 'Andre: "I can tell you what I see on my checks, but that assessment is yours, not mine."'; }
      if (task.id === 'prn') { A.judge('deleg-prn', 'deleg', -2, 'You asked the mental health worker to give medication.', 'Mental health workers don\'t give medications, and deciding when a PRN for agitation is needed is a nursing judgment.'); return 'Andre: "I can\'t give meds. You know that. Call me if you want backup when you offer it."'; }
      if (task.id === 'one') { const D = s.p['301']; D.oneToOne = true; D.floatAt = s.t + 40; if (risky(D)) A.judge('deleg-one', 'deleg', 1, 'You put Andre on 1:1 with Daniel.', 'Continuous observation is exactly what a mental health worker is for. Now get the order and tell the psychiatrist why.'); return 'Andre: "On it. I\'ll pull a chair beside him. Heads up: that\'s me off the hall until Nova finds a float."'; }
      if (s.deleg.filter((d) => !d.done).length >= 1) return 'Andre: "Give me a minute, I\'m still on the last thing, plus checks."';
      if (task.id === 'walk' && s.p['303'].esc >= 2.4) return 'Andre: "She\'s too hot for me to walk right now. She needs you."';
      if (task.id === 'walk') s.p['303'].tw = true;
      if (task.id === 'fluids') { s.p['309'].supervised = true; A.judge('deleg-fluids', 'deleg', 1, 'You had Andre supervise Linda\'s fluids.', 'Supervising intake is observation work, perfect to delegate, and it\'s what makes a restriction real.'); return 'Andre: "Got it. I\'ll keep a tally and keep her out of the bathroom sink."'; }
      s.deleg.push({ id: task.id, pid, due: s.t + task.mins, done: false, at: s.t });
      if (task.id === 'vitals' || task.id === 'ortho' || task.id === 'weigh' || task.id === 'meal') A.judge('deleg-good-' + task.id, 'deleg', 1, `You delegated ${task.label.toLowerCase()} to the mental health worker.`, 'Hand off the tasks; keep the assessment and the conversations that need a nurse.');
      return `Andre: "On it: ${task.label.toLowerCase()} for ${nm}."`;
    },
    complete(d, s, A) {
      const nm = A.def(d.pid).short;
      if (d.id === 'vitals') { const v = A.recordVitals(d.pid, 'Andre (MHW)'); A.msg({ from: 'andre', pid: d.pid, text: `${nm}: T ${v.T.toFixed(1)}, HR ${v.HR}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}%.` + (d.pid === '305' ? ' His hands are shaking so bad he couldn\'t hold the thermometer.' : '') + (d.pid === '301' ? ' He gave me his chess set. Said I should practice.' : '') }); if (d.pid === '301') s.p['301'].headSeen = true; }
      else if (d.id === 'ortho') { const P = s.p['305']; P.ortho = true; const v = A.vitals('305'); A.msg({ from: 'andre', pid: '305', text: `305 orthostatics: lying ${v.SBP}/${v.DBP} HR ${v.HR}, standing ${v.SBP - 18}/${v.DBP - 8} HR ${v.HR + 24}. He got dizzy and almost went down.` }); }
      else if (d.id === 'weigh') { const P = s.p['309']; P.weighed = true; P.wt = +(71.2 + (P.restricted ? -.2 : Math.max(0, (128.6 - P.na) * .12))).toFixed(1); A.msg({ from: 'andre', pid: '309', text: `309 weighs ${P.wt} kg. Her baseline card says 68.` }); }
      else if (d.id === 'meal') { const P = s.p['307']; P.ate += 1; P.trust += .5; A.msg({ from: 'andre', pid: '307', text: '307 ate the whole sealed breakfast. Checked every wrapper first. He said thanks, kind of.' }); }
      else if (d.id === 'walk') { const P = s.p['303']; P.esc = Math.max(0, P.esc - .5); P.tried = true; A.msg({ from: 'andre', pid: '303', text: 'Walked 303 for fifteen. She\'s a little calmer. Still talking a mile a minute.' }); }
    },
  };

  /* ---------- Nova ---------- */
  function novaHint(s, A) {
    const D = s.p['301'], Jc = s.p['303'], B = s.p['305'], M = s.p['307'], L = s.p['309'];
    if (Jc.ep && Jc.ep.f2fCalled === null) return 'Seclusion and holds come with requirements that run on a clock. Who has to lay eyes on her within the hour, and does she know?';
    if (Jc.secluded && Jc.ep && Jc.ep.obs === null) return 'There\'s a locked door on your hall. Who is watching what\'s behind it right now?';
    if (!B.gone && !B.icu && s.t >= 30 && !B.reported) return 'A critical lab came back on someone whose "stomach bug" started when a new pill did. Who needs to hear about it, right now?';
    if (!D.attempt && !D.disclosed && !D.reported) return 'The most dangerous patient on a psych unit can be the one who suddenly feels fine. Who got better overnight, and have you asked him the real question?';
    if (!D.attempt && D.disclosed && !D.oneToOne && !D.searched) return 'He told you he has a plan. Fifteen-minute checks leave fifteen-minute gaps. What closes them?';
    if (!L.gone && !L.icu && !L.restricted) return 'Someone has a protocol with a number in it. What does the scale say?';
    if (Jc.esc >= 2 && !Jc.tried) return 'Before anyone says "seclusion": what\'s the least restrictive thing you haven\'t tried yet?';
    if (!M.medTaken && M.trust < 1) return 'You can\'t talk someone out of a delusion. What can you offer that he can check for himself?';
    if (D.disclosed && !D.reported) return 'The psychiatrist is deciding about discharge today. Does she know what you know?';
    const unseen = A.c.patients.filter((d) => !s.p[d.id].gone && !s.p[d.id].icu && (s.p[d.id].seenAt === null || s.t - s.p[d.id].seenAt > 90)).map((d) => d.room);
    if (unseen.length) return `You haven\'t talked with ${unseen.join(' and ')} in over an hour and a half. On this unit, most of your assessment happens in check-ins.`;
    return 'You\'re on top of it. Now think about 14:00. Who\'s safe to go home, and who isn\'t?';
  }

  function endChecks(s, A) {
    A.c.patients.forEach((d) => {
      const P = s.p[d.id];
      if (P.seenAt === null && !P.icu && !P.gone) A.judge(d.id + '-unseen', 'assess', -3, `You never went into ${d.room} this shift.`, 'On a psych unit, most of the assessment is talking with the patient. Every patient gets seen.', d.id);
      (d.meds || []).forEach((m) => {
        const st = s.meds[m.id];
        if (m.due !== undefined && m.due <= Math.min(240, s.t - 60) && st.status === 'due' && !P.icu && !P.gone) A.judge(m.id + '-missed', 'meds', -2, `${m.name} for ${d.short} (due ${clock(m.due)}) was never given or held.`, 'Every scheduled dose needs a decision: given, or held with a reason. A refusal is documented as a hold.', d.id);
      });
    });
    const D = s.p['301'], B = s.p['305'], M = s.p['307'], L = s.p['309'];
    if (!B.reported && !B.icu) A.judge('305-norep', 'comm', -2, 'Bob\'s critical lithium level never reached the psychiatrist.', 'Critical values go to the provider promptly, by policy usually within 30 to 60 minutes, with the nurse\'s assessment attached.', '305');
    if (!D.reported && !D.attempt) A.judge('301-norep', 'comm', -2, 'The psychiatrist decided Daniel\'s discharge without hearing what nursing saw.', 'She sees him for fifteen minutes. You see him all shift. The warning signs have to reach the person making the decision.', '301');
    if (!L.weighed && !L.icu) A.judge('309-noweigh', 'assess', -1, 'Linda\'s protocol weight was never done.', 'The polydipsia protocol runs on the scale. She refused at 06:00; that\'s a reason to try again, not to skip it.', '309');
    const Jx = s.p['303'];
    if (Jx.ep) {
      judgeGaps(s, Jx, A, Jx.secluded ? s.t : (Jx.ep.seclEnd || s.t));
      if (!Jx.ep.note) A.judge('303-note-none', 'comm', -2, 'Jasmine\'s seclusion or restraint was never charted.', 'No note means no record of the danger, the less restrictive steps, the order, the face-to-face, the checks or the release. Legally, it\'s as if it was done without any of them.', '303');
      if (Jx.im !== null && !Jx.ep.imNote) A.judge('303-imnote-none', 'comm', -2, 'Jasmine\'s emergency medication was never charted with its justification.', 'Medication over objection is legal only in a documented emergency. The MAR shows the dose; only your note shows why.', '303');
      if (Jx.im !== null && Jx.postIM === null) A.judge('303-postim-none', 'assess', -1, 'Nobody checked Jasmine after her IM haloperidol and lorazepam.', 'Sedation, breathing, blood pressure and dystonia after emergency IM medication: first check within 30 minutes.', '303');
    }
    if (M.refused && !M.medTaken && !M.reported) A.judge('307-norep', 'comm', -1, 'Miguel\'s medication refusals never reached the psychiatrist.', 'Repeated refusal is a treatment-planning problem. The team decides together whether to pursue a capacity hearing.', '307');
    const keys = []; A.c.patients.forEach((d) => (d.report || []).forEach((r, i) => { if (r.key) keys.push(d.id + ':' + i); }));
    const hit = keys.filter((k) => s.brain.includes(k)).length;
    if (s.brain.length) { const noise = s.brain.length - hit, precise = hit / s.brain.length;
      if (noise >= 4 && precise < .7) A.judge('brain', 'assess', -1, `You flagged ${s.brain.length} lines in report, ${noise} of them noise.`, 'Flagging everything is the same as flagging nothing.');
      else A.judge('brain', 'assess', hit / keys.length >= 0.6 && precise >= .7 ? 1 : 0, `You flagged ${hit} of ${keys.length} critical cues during handoff${noise ? `, plus ${noise} that didn\'t matter` : ''}.`, 'On psych, report is full of reassurance. "He seems so much better" and "probably a stomach bug" are the lines to question.'); }
  }

  const PREP = { '305-hctz': ['vitals'], '309-apap': ['pain'] };
  [dan, jas, bob, mig, lin].forEach((d) => d.meds.forEach((m) => { if (PREP[m.id]) m.prep = PREP[m.id]; }));

  S.engine.registerCase({
    id: 'psych-3e-1', title: 'Days on 3 East', unit: '3 East, Adult Acute Psychiatry', unitShort: '3 East', level: 'Specialty: Psych', start: 7 * 60, length: 300, novaCredits: 3,
    card: 'Adult locked unit, five patients until noon: mania, lithium, a med refusal, compulsive water drinking, and a man who is suddenly calm.',
    hero: { head: 'Days, 3 East. Five patients on a locked adult unit.', lede: 'Adult acute psych, 07:00 to noon. No telemetry and no pumps. Most of your assessment is talking to people, including asking the questions that feel awkward to ask.' },
    intro: { time: '06:58', place: '3 East, Adult Acute Psychiatry', cta: 'Take report', beats: ['Priya is giving report in the nurses\' station, behind the glass.', 'Five patients until noon. No monitors here; you assess by talking.', 'One man seems a lot better than he did yesterday. Find out why.'] },
    minutes: 20,
    sysLabels: { general: 'Appearance and behavior', neuro: 'Mental status exam', pain: 'Pain and comfort', skin: 'Skin and safety check', gi: 'Intake, output and elimination' },
    handoffBy: 'Priya (night RN)', reportBy: 'priya', reportRole: 'night shift', provider: 'iyer', cna: 'andre',
    staff: {
      nova: { name: 'Nova Reyes', role: 'Charge nurse', look: { skin: '#B98A63', shade: '#976D4B', lip: '#7C4435', blush: '#C77B5E', iris: '#3D2A1C', head: { w: 55, h: 62, jaw: .35 }, eye: 10, hair: { style: 'bun', color: '#3A2E2A', streak: true }, brow: { w: 3.6, color: '#2E2421' }, body: { w: 80, cloth: 'navy' }, extras: ['studs'], smile: .35 } },
      andre: { name: 'Andre', role: 'Mental health worker', look: { skin: '#4E3121', shade: '#3A2418', lip: '#40221A', blush: '#7E4636', iris: '#1C120C', head: { w: 58, h: 62, jaw: .65 }, eye: 9.6, hair: { style: 'buzz', color: '#0F0B09' }, brow: { w: 4.6, color: '#0E0A08' }, body: { w: 96, cloth: 'grey', lanyard: true }, extras: ['beard'], smile: .45 } },
      priya: { name: 'Priya', role: 'Night RN', look: { skin: '#B07A55', shade: '#8E5E3E', lip: '#7A3F33', blush: '#BD7258', iris: '#2A1A10', head: { w: 53, h: 61, jaw: .3 }, eye: 10, hair: { style: 'long', color: '#1A120E' }, brow: { w: 3.4, color: '#140E0B' }, body: { w: 76, cloth: 'teal' }, extras: ['studs'], smile: .35, tired: true } },
      iyer: { name: 'Dr. Iyer', role: 'Attending psychiatrist', look: { skin: '#9C6B4A', shade: '#7D5336', lip: '#6E382C', blush: '#AE6A52', iris: '#22150D', head: { w: 54, h: 63, jaw: .35 }, eye: 9.4, hair: { style: 'bob', color: '#2A2220', streak: true }, brow: { w: 3.6, color: '#1E1816' }, body: { w: 78, cloth: 'blouse' }, extras: ['thinGlasses', 'gold'], glasses: '#5A4636', smile: .25 } },
      ana: { name: 'Ana Santos', role: 'Mother, 307', look: { skin: '#C08C62', shade: '#9E6C44', lip: '#8A4838', blush: '#C77E5E', iris: '#2C1A0E', head: { w: 55, h: 60, jaw: .3 }, eye: 9.6, hair: { style: 'bun', color: '#3B2A22' }, brow: { w: 3.4, color: '#2E211A' }, body: { w: 84, cloth: 'wine', cardigan: '#C9B28E' }, extras: ['gold'], smile: .15, tired: true } },
      grace: { name: 'Renata Ahn', role: 'Caller', look: null },
      desk: { name: 'Front desk', role: 'Unit clerk', look: null },
      lab: { name: 'Lab', role: 'Laboratory', look: null },
    },
    patients: [dan, jas, bob, mig, lin],
    dueExtras(s) {
      const out = [], B = s.p['305'], L = s.p['309'], D = s.p['301'], M = s.p['307'];
      if (!L.weighed && !L.gone && !L.icu) out.push({ t: 0, late: s.t > 60, text: '309 Protocol weight (refused at 06:00)' });
      if (s.t < 30) out.push({ t: 30, late: false, info: true, text: '305 Lithium level (drawn 06:00) resulting' });
      if (s.t < 180 && !D.attempt) out.push({ t: 180, late: false, info: true, text: '301 Psychiatrist rounds: hold ends 14:00' });
      if (M.visit === null && s.t < 140) out.push({ t: 120, late: false, info: true, text: '307 Visitor expected: Ana Santos' });
      if (L.statAt !== null && !L.statDone) out.push({ t: L.statAt + 30, late: false, info: true, text: '309 STAT BMP resulting' });
      const J3 = s.p['303'], e = J3.ep;
      if (e && e.f2fAt === null) out.push(e.f2fCalled === null ? { t: e.at + 60, late: s.t > e.at + 60, tab: 'talk', hl: 'Call Dr. Iyer', text: '303 Face-to-face evaluation: call Dr. Iyer (due within 1 hour)' } : { t: e.at + 60, late: false, info: true, text: '303 Dr. Iyer coming for the face-to-face' });
      if (e && J3.secluded) { const last = Math.max(e.seclStart, ...e.checks); out.push({ t: last + 15, late: s.t > last + 15, text: '303 Seclusion check (every 15 minutes)' }); }
      if (J3.im !== null && J3.postIM === null) out.push({ t: J3.im + 30, late: s.t > J3.im + 45, tab: 'care', text: '303 Post-IM check: vitals, sedation, breathing' });
      if (e && !e.note) out.push({ t: e.at + 60, late: false, text: '303 Seclusion and restraint note' });
      if (e && J3.im !== null && !e.imNote) out.push({ t: J3.im + 60, late: false, text: '303 Emergency medication note' });
      return out;
    },
    replies,
    priority: {
      judge(r, A) {
        if (r[0] === '305') A.judge('rank-first', 'priority', 2, 'You chose to see Bob first.', 'A physical problem hiding on a psych unit: coarse tremor, vomiting and diarrhea on lithium, with a level pending. The medical emergency comes first.', '305');
        else if (r[0] === '301') A.judge('rank-first', 'priority', 1, 'You chose to see Daniel first.', 'A strong instinct: sudden calm and giving things away are real warning signs. Bob\'s lithium symptoms were the more time-critical picture, though.', '301');
        else A.judge('rank-first', 'priority', -1, `You put ${A.def(r[0]).short} first, ahead of Bob and Daniel.`, 'Physical danger and suicide risk come before behavior that is loud but not yet dangerous.', '305');
      },
      correct: ['305', '301', '309', '303', '307'],
      why: {
        '305': 'Shaky, vomiting and diarrhea on lithium with a new diuretic and an NSAID. That\'s toxicity until proven otherwise, and a level is coming back any minute.',
        '301': 'Sudden calm after severe depression, belongings given away, and a hold that ends today. The classic picture of someone who has made a decision.',
        '309': 'Known polydipsia, drinking from the sink, sodium already down to 129 and a headache. Water intoxication can seize.',
        '303': 'Escalating mania with no sleep. Loud and irritable isn\'t dangerous yet; early de-escalation keeps it that way.',
        '307': 'Frightened and not eating, but safe right now. The work is slow trust, not speed.',
      },
    },
    events, delegation, dialogs, novaHint, endChecks,
    tick(s, A) {
      const B = s.p['305'];
      if (!B.gone && !B.icu) {
        B.li += B.transferAt !== null ? 0 : .0018;
        if (B.liDoseAt !== null && s.t - B.liDoseAt <= 90) B.li += .5 / 90;
        if (B.ibuAt !== null && s.t - B.ibuAt <= 120) B.li += .08 / 120;
        if (B.hctzAt !== null && s.t - B.hctzAt <= 120) B.li += .06 / 120;
      }
      const L = s.p['309'];
      if (!L.gone && !L.icu) { L.na += L.restricted ? (L.agreed || L.supervised ? .008 : -.012) : -.036; L.na = clamp(L.na, 118, 134); }
      const Jc = s.p['303'];
      if (!Jc.emerg) {
        const medsOn = Jc.medsAt !== null && s.t - Jc.medsAt > 30;
        let rise = s.t >= 20 && s.t <= 165 ? .02 : s.t > 165 ? .004 : 0;
        if (medsOn) rise *= .45;
        if (Jc.adjusted) rise *= .85;
        if (Jc.quietUntil > s.t || Jc.secluded) rise -= .02;
        if (Jc.im !== null) rise = -.01;
        Jc.esc = clamp(Jc.esc + rise, 0, 3.4);
      }
      Jc.peak = Math.max(Jc.peak || 0, Jc.esc);
      const M = s.p['307']; M.trust = clamp(M.trust, 0, 3);
    },
  });
})(window.Shift);
