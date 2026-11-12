/* The Shift — orientation. A first-day walkthrough on a practice unit (rooms 101–107, so nothing collides with a real shift's rooms) with three practice patients, before the first real
   shift. Every chapter is something the player does: commit actions and watch the clock, highlight report, drag
   patients into order, answer the phone, hold a medication, build an SBAR call, delegate, and read a debrief.
   The wall clock is the throughline: it only moves by what each action costs.
   ui.js owns rendering and routing: it calls view(o) for the HTML, act(o, data) on taps (data-act="or"),
   and sorted(...) when the practice board is dragged. State lives in ui.or; ui.js keeps a copy so a reload resumes it. */
(function (S) {
  const R = S.rig, ART = S.art, FX = S.fx || { play() {} };
  const esc = (x) => String(x == null ? '' : x).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hhmm = (m) => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(Math.round(m) % 60).padStart(2, '0');

  /* ---------- practice patients ---------- */
  const PT = {
    'or-a': { name: 'Esther Alvarez', short: 'Mrs. Alvarez', room: '101', age: '82F', dx: 'Urinary tract infection, new confusion',
      look: { skin: '#D6A684', shade: '#B88864', lip: '#A0594C', blush: '#DC8E74', iris: '#3A2616', head: { w: 55, h: 60, jaw: .2 }, eye: 9.2, hair: { style: 'bun', color: '#D9D2CB' }, brow: { w: 2.8, color: '#B8B0A8' }, body: { w: 78, cloth: 'gown' }, extras: ['wrinkles', 'gold'], smile: .1 } },
    'or-b': { name: 'Henry Ostrowski', short: 'Mr. Ostrowski', room: '103', age: '71M', dx: 'Heart failure, metoprolol due',
      look: { skin: '#EBC9AE', shade: '#CFA88C', lip: '#A9655B', blush: '#E2958A', iris: '#4E6E8E', head: { w: 57, h: 63, jaw: .55 }, eye: 9, hair: { style: 'balding', color: '#BDB6AE' }, brow: { w: 4, color: '#9E968E' }, body: { w: 84, cloth: 'gown' }, extras: ['glasses', 'wrinkles'], glasses: '#2E2A28', smile: .35 } },
    'or-c': { name: 'Lorraine Abernathy', short: 'Ms. Abernathy', room: '105', age: '45F', dx: 'Day 2 after a knee replacement',
      look: { skin: '#EBC6A2', shade: '#CFA582', lip: '#B06A5E', blush: '#E8977F', iris: '#1E140C', head: { w: 54, h: 60, jaw: .25 }, eye: 9.8, hair: { style: 'bob', color: '#1A1410' }, brow: { w: 3.2, color: '#140E0A' }, body: { w: 78, cloth: 'gown' }, extras: [], smile: .45 } },
  };
  Object.keys(PT).forEach((k) => R.define(k, PT[k].look));
  const bust = (k) => R.bust(k, null, 'portrait');
  const icon = (k, v) => R.icon(k, v);

  /* ---------- chapters ---------- */
  // t: the clock when the chapter opens (minutes after midnight). step: what goes on the clipboard.
  const CH = [
    { id: 'clock', t: 6 * 60 + 58, step: 'How time works', title: 'You\'re the nurse.' },
    { id: 'report', t: 7 * 60, step: 'Take report', title: 'Take report.' },
    { id: 'rank', t: 7 * 60 + 14, step: 'Decide who\'s first', title: 'Decide who\'s first.' },
    { id: 'station', t: 7 * 60 + 15, step: 'The station and the phone', title: 'Home base.' },
    { id: 'room', t: 7 * 60 + 20, step: 'In the room', title: 'In the room.' },
    { id: 'sbar', t: 7 * 60 + 41, step: 'Call the provider', title: 'Call for help.' },
    { id: 'team', t: 8 * 60 + 5, step: 'Work with your aide', title: 'You\'re not alone.' },
    { id: 'debrief', t: 11 * 60 + 58, step: 'Hand off and debrief', title: 'See what happened.' },
  ];

  function fresh(start) {
    return { i: 0, start: !!start, seen: [0], extra: 0, log: [], hl: [], hlChecked: false, order: ['or-c', 'or-b', 'or-a'], rankChecked: false, dragged: false,
      phone: {}, tab: 'assess', apical: false, med: null, sbar: { picked: [], req: null, sent: false }, deleg: {}, delegChecked: false, deb: false };
  }
  const clockOf = (o) => CH[o.i].t + (o.i === 0 ? o.extra : 0) + (o.i === 4 ? o.roomMin || 0 : 0);

  /* ---------- the wall clock ---------- */
  function wallClock(t) {
    const h = (t / 60) % 12, m = t % 60;
    const nums = Array.from({ length: 12 }, (_, k) => { const a = (k + 1) * Math.PI / 6; return `<text x="${Math.sin(a) * 37}" y="${-Math.cos(a) * 37 + 4.5}" text-anchor="middle">${k + 1}</text>`; }).join('');
    const ticks = Array.from({ length: 60 }, (_, k) => { const a = k * Math.PI / 30, r0 = k % 5 ? 44 : 41.5; return `<line x1="${Math.sin(a) * r0}" y1="${-Math.cos(a) * r0}" x2="${Math.sin(a) * 46}" y2="${-Math.cos(a) * 46}" stroke-width="${k % 5 ? .8 : 1.8}"/>`; }).join('');
    // Hands are drawn in absolute coordinates (center 54,54) so CSS can rotate them about a fixed point and animate.
    return `<figure class="or-clock" aria-label="Clock: ${hhmm(t)}"><svg viewBox="0 0 108 108" aria-hidden="true">
      <g transform="translate(54 54)"><circle r="52" class="rim"/><circle r="48" class="face"/><g class="ticks">${ticks}</g><g class="nums">${nums}</g></g>
      <line class="hand hr" x1="54" y1="60" x2="54" y2="30" style="transform:rotate(${h * 30}deg)"/>
      <line class="hand mn" x1="54" y1="62" x2="54" y2="16" style="transform:rotate(${m * 6 + Math.floor(t / 60) * 360}deg)"/>
      <circle cx="54" cy="54" r="3" class="pin"/></svg><figcaption>${hhmm(t)}</figcaption></figure>`;
  }

  /* ---------- chapter stages ---------- */
  const ACTIONS = [
    { id: 'look', label: 'Look at the patient', min: 0, out: 'Mrs. Alvarez is picking at her blanket and calls you by her daughter\'s name.' },
    { id: 'vitals', label: 'Take vital signs', min: 4, out: 'T 38.6, HR 112, BP 98/58, RR 22, SpO₂ 95%.' },
    { id: 'chart', label: 'Read the chart', min: 2, out: 'Ceftriaxone ordered at 04:00. Not given yet.' },
    { id: 'med', label: 'Give a medication', min: 5, out: 'Ceftriaxone 1 g IV started.' },
    { id: 'call', label: 'Call the provider', min: 6, out: 'Dr. Chen is on her way, with orders for cultures and fluids.' },
    { id: 'walk', label: 'Walk to another room', min: 1, out: 'You\'re in 103.' },
  ];
  const REPORT = [
    { t: 'Esther Alvarez, 82, here for a UTI. Day 1 of antibiotics.', key: false },
    { t: 'She got confused around three. She\'s usually sharp as a tack.', key: true, why: 'New confusion in an older adult with an infection is an early sign of sepsis.' },
    { t: 'She spiked to 38.6 at six.', key: true, why: 'Fever with a fast heart rate fits the same picture.' },
    { t: 'Her first ceftriaxone dose didn\'t get hung. Pharmacy was slow.', key: true, why: 'An antibiotic delay matters most in the first hours of sepsis.' },
    { t: 'Her daughter Dena visits at noon.', key: false, why: 'Nice to know. It won\'t change your first hour.' },
    { t: 'Only 30 mL of urine since midnight.', key: true, why: 'Low urine output means her kidneys aren\'t getting enough blood flow.' },
    { t: 'She likes her coffee black.', key: false, why: 'Noise. Report is full of it.' },
  ];
  const BOARD = {
    'or-a': 'New confusion, fever, HR 112, soft pressure, antibiotic late',
    'or-b': 'Heart failure. Metoprolol due at 09:00; ask for an apical pulse first',
    'or-c': 'Pain 3 out of 10, walking with physical therapy, stable all night',
  };
  const RIGHT = ['or-a', 'or-b', 'or-c'];
  const PHONE = [
    { id: 'lab', from: 'Lab', who: null, text: 'Calling a critical value: 101 Alvarez, lactate 4.2.', opts: [{ id: 'read', t: 'Read it back: 101 Alvarez, lactate 4.2', v: 2, fb: 'Read-back closes the loop on a critical value. Now it\'s yours to act on: this one goes straight to the provider.' }, { id: 'later', t: 'Thanks, I\'ll look at it later', v: 0, fb: 'Critical values can\'t wait, and you never repeated it back. Read back, then act.' }] },
    { id: 'aide', from: 'Luis (aide)', who: 'luis', text: '103 wants to walk to the bathroom. Okay to help him?', opts: [{ id: 'yes', t: 'Yes, he\'s stable. Thanks, Luis.', v: 2, fb: 'Walking a stable patient is a perfect aide task. You keep the assessments.' }, { id: 'wait', t: 'No, wait for me', v: 0, fb: 'He\'d have waited for nothing. Hand off what\'s safe to hand off.' }] },
  ];
  const TABS = {
    assess: { label: 'Assess', text: 'Vital signs and a body-system check, one system at a time. Each one shows its cost in minutes.', rows: [['Vital signs', 4], ['Heart and lungs', 2], ['Neuro', 2], ['Pain', 1]] },
    care: { label: 'Care', text: 'Things you do with your hands: reposition, start an IV, check a site, apply oxygen. Some only appear when they\'re needed.', rows: [['Reposition and pad his heels', 3], ['Count an apical pulse', 1], ['Daily weight', 2]] },
    meds: { label: 'Meds', text: 'The medication record. Every dose is a decision: give it, or hold it with a reason. Read the checks first.', rows: [['Metoprolol 25 mg PO, due 09:00', 5], ['Furosemide 40 mg IV, due 09:00', 5]] },
    talk: { label: 'Talk', text: 'Talk with the patient and family, call the provider, or ask for help. Patients tell you things the chart doesn\'t.', rows: [['Talk with Mr. Ostrowski', 3], ['Call Dr. Chen (SBAR)', 6], ['Call a rapid response', 3]] },
  };
  const SB = [
    { id: 'conf', t: 'New confusion since 03:00', key: true },
    { id: 'vs', t: 'T 38.6, HR 112, BP 98/58', key: true },
    { id: 'uo', t: '30 mL of urine since midnight', key: true },
    { id: 'abx', t: 'First antibiotic dose never given', key: true },
    { id: 'lac', t: 'Lactate 4.2', key: true },
    { id: 'cof', t: 'Likes her coffee black', key: false },
    { id: 'ruth', t: 'Daughter visits at noon', key: false },
  ];
  const SBREQ = [
    { id: 'sepsis', t: 'I think she\'s septic. Can you see her now, and can I get blood cultures, a fluid bolus and the antibiotic in?' },
    { id: 'fyi', t: 'Just keeping you updated.' },
  ];
  const TASKS = [
    { id: 'v', t: 'Vital signs on Ms. Abernathy (stable, walking)', ok: 'aide', why: 'Measuring is an aide task when the patient is stable. You interpret the numbers.' },
    { id: 'a', t: 'Assess Mrs. Alvarez\'s new confusion', ok: 'me', why: 'Assessment and judgment stay with the RN. A new change always does.' },
    { id: 'w', t: 'Walk Mr. Ostrowski to the bathroom', ok: 'aide', why: 'Helping a stable patient move is within the aide\'s scope.' },
    { id: 'm', t: 'Give Mr. Ostrowski his 09:00 metoprolol', ok: 'me', why: 'Medications are yours, after you check his pulse.' },
  ];

  function stage(o) {
    const c = CH[o.i];
    if (c.id === 'clock') {
      return `<div class="or-scene or-s-clock">
        <div class="or-bed">${bust('or-a')}<p class="or-cap">101 Mrs. Alvarez</p></div>
        <div class="or-acts" role="group" aria-label="Practice actions">${ACTIONS.map((a) => { const did = o.log.some((l) => l.id === a.id); return `<button class="or-act ${did ? 'did' : ''}" data-act="or" data-do="act" data-id="${a.id}"><span>${esc(a.label)}</span><b class="${a.min ? '' : 'free'}">${a.min ? a.min + ' min' : 'Free'}</b></button>`; }).join('')}</div>
        <ol class="or-log" aria-live="polite">${o.log.length ? o.log.slice().reverse().map((l) => `<li><time>${hhmm(l.at)}</time>${esc(l.out)}</li>`).join('') : '<li class="empty">Tap an action. Watch the clock.</li>'}</ol>
      </div>`;
    }
    if (c.id === 'report') {
      const hits = REPORT.filter((r, k) => r.key && o.hl.includes(k)).length, keys = REPORT.filter((r) => r.key).length, noise = o.hl.filter((k) => !REPORT[k].key).length;
      return `<div class="or-scene or-s-report">
        <div class="or-giver">${icon('dana')}<p><b>Dana</b>, night RN, giving report on 101</p></div>
        <div class="or-brain" role="group" aria-label="Report lines">${REPORT.map((r, k) => { const on = o.hl.includes(k); const st = o.hlChecked ? (r.key ? (on ? 'hit' : 'miss') : on ? 'noise' : '') : ''; return `<button class="or-line ${on ? 'on' : ''} ${st}" data-act="or" data-do="hl" data-k="${k}" aria-pressed="${on}"><span class="or-mk" aria-hidden="true"></span><span class="txt">${esc(r.t)}</span>${o.hlChecked && (r.key || on) ? `<small class="why">${esc(r.why || '')}</small>` : ''}</button>`; }).join('')}</div>
        ${o.hlChecked ? `<p class="or-verdict ${hits === keys && !noise ? 'good' : ''}">You flagged ${hits} of ${keys} that matter${noise ? `, and ${noise} that don't` : ''}. ${hits === keys && !noise ? 'That\'s a sepsis picture, and you heard it in report.' : 'Together they add up to sepsis. Flag what would change your first hour.'}</p>` : `<button class="btn or-check" data-act="or" data-do="hlcheck" ${o.hl.length ? '' : 'disabled data-why="Tap a line or two first."'}>Check my highlights</button>`}
      </div>`;
    }
    if (c.id === 'rank') {
      const right = o.order.every((k, i) => RIGHT[i] === k);
      return `<div class="or-scene or-s-rank">
        <div class="or-wb"><p class="or-wb-h">Assignment, practice unit</p>
          <ol class="or-board ${o.rankChecked ? 'done' : ''}" data-sort="or-board">${o.order.map((k, i) => `<li data-key="${k}" class="${o.rankChecked ? (RIGHT[i] === k ? 'hit' : 'miss') : ''}">${o.rankChecked ? '' : '<span class="grip" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg></span>'}<span class="mag" aria-label="Number ${i + 1}">${i + 1}</span>${icon(k)}<span class="who"><b>${PT[k].room} ${esc(PT[k].short)}</b><small>${esc(BOARD[k])}</small></span>${o.rankChecked ? '' : `<span class="mv"><button class="btn" data-act="or" data-do="mv" data-k="${k}" data-d="-1" aria-label="Move ${esc(PT[k].short)} up" ${i === 0 ? 'disabled data-why="Already first."' : ''}><svg class="ico" viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg></button><button class="btn" data-act="or" data-do="mv" data-k="${k}" data-d="1" aria-label="Move ${esc(PT[k].short)} down" ${i === o.order.length - 1 ? 'disabled data-why="Already last."' : ''}><svg class="ico" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button></span>`}</li>`).join('')}</ol>
        </div>
        ${o.rankChecked ? `<p class="or-verdict ${right ? 'good' : ''}">${right ? 'Same order as Nova.' : 'Nova\'s order: Mrs. Alvarez, Mr. Ostrowski, Ms. Abernathy.'} Unstable first, a time-sensitive decision second, stable last. In a real shift she tells you her order at the debrief, not before.</p>` : `<p class="or-hint">${o.dragged ? 'Good. Lock it in when you\'re happy.' : 'Drag a magnet by its handle, or use the arrows.'}</p><button class="btn or-check" data-act="or" data-do="rankcheck">Lock in my order</button>`}
      </div>`;
    }
    if (c.id === 'station') {
      const hall = ART.hallway({ t: 15, caseId: 'medsurg-4w-1' }, [
        { pid: 'or-a', room: '101', name: 'Mrs. Alvarez', light: false }, { pid: 'or-b', room: '103', name: 'Mr. Ostrowski', light: true }, { pid: 'or-c', room: '105', name: 'Ms. Abernathy', light: false }, { pid: 'x', room: '107', pending: true, eta: '09:30', label: 'Admission' },
      ]).replace(/data-act="goto"/g, 'data-act="or" data-do="door"');
      return `<div class="or-scene or-s-station">
        <div class="or-hall">${hall}${o.door ? `<p class="or-cap or-door-msg">${esc(o.door)}</p>` : ''}</div>
        <div class="or-phone" aria-label="Unit phone"><p class="or-phone-h">Unit phone</p>${PHONE.map((m) => { const a = o.phone[m.id]; const pick = a && m.opts.find((x) => x.id === a); return `<div class="or-msg ${pick ? 'done' : ''}"><p><b>${esc(m.from)}</b> ${esc(m.text)}</p>${pick ? `<p class="or-fb ${pick.v === 2 ? 'good' : ''}">${esc(pick.fb)}</p>` : `<div class="or-rep">${m.opts.map((x) => `<button class="btn" data-act="or" data-do="phone" data-m="${m.id}" data-x="${x.id}">${esc(x.t)}</button>`).join('')}</div>`}</div>`; }).join('')}</div>
        <div class="or-team"><div>${icon('nova')}<p><b>Ask Nova</b> Three tips a shift. She points; she won\'t answer for you.</p></div><div>${icon('luis')}<p><b>Ask Luis</b> Your aide. He takes vitals, walks, turns and errands.</p></div><div class="or-skip"><span aria-hidden="true">▶▶</span><p><b>Skip ahead</b> When you\'re caught up, the clock runs until something needs you.</p></div></div>
      </div>`;
    }
    if (c.id === 'room') {
      const T = TABS[o.tab];
      return `<div class="or-scene or-s-room">
        <div class="or-roomtop">${bust('or-b')}<div class="or-plate"><b>Henry Ostrowski</b> 71M, 103<br><small>Heart failure</small><span class="chip">Full code</span> <span class="chip alert">Allergy: penicillin</span></div></div>
        <div class="or-dock" role="tablist">${Object.entries(TABS).map(([k, t]) => `<button role="tab" aria-selected="${o.tab === k}" class="${o.tab === k ? 'on' : ''}" data-act="or" data-do="tab" data-k="${k}">${esc(t.label)}</button>`).join('')}</div>
        <div class="or-pane"><p>${esc(T.text)}</p><ul>${T.rows.map(([l, m]) => `<li><span>${esc(l)}</span><b>${m} min</b></li>`).join('')}</ul></div>
        <div class="or-med"><p class="or-med-h"><b>Metoprolol tartrate 25 mg PO</b>, due 09:00. <span class="or-param">Hold for apical pulse under 55.</span></p>
          <ul class="or-checks"><li><span>Apical pulse</span><b>${o.apical ? '52, counted for a full minute' : '?'}</b>${o.apical ? '<i class="bad">under 55</i>' : ''}</li><li><span>Blood pressure</span><b>108/66</b><i class="ok">ok</i></li></ul>
          ${o.med ? `<p class="or-fb ${o.med === 'hold' ? 'good' : ''}">${o.med === 'hold' ? 'Held, with a reason, and you\'ll tell the provider. The order said what to do; you checked the number first.' : o.apical ? 'The pulse was 52. The hold parameter says under 55: this dose could drop him lower.' : 'You gave it without the number the order asks for. Check the apical pulse first, every time.'}</p>` : `<div class="or-rep">${o.apical ? '' : '<button class="btn" data-act="or" data-do="apical">Count an apical pulse <small>1 min</small></button>'}<button class="btn" data-act="or" data-do="med" data-v="give">Give it</button><button class="btn" data-act="or" data-do="med" data-v="hold">Hold it</button></div>`}
        </div>
      </div>`;
    }
    if (c.id === 'sbar') {
      const sb = o.sbar, keys = SB.filter((x) => x.key && sb.picked.includes(x.id)).length, noise = SB.filter((x) => !x.key && sb.picked.includes(x.id)).length;
      const reply = !sb.sent ? '' : sb.req === 'fyi' ? 'Okay, thanks. Call me if anything changes.' : keys >= 4 ? 'I\'m coming up. Cultures, 30 mL/kg of fluid, and hang the ceftriaxone now. Recheck the lactate in two hours.' : 'Septic? What are her vitals, and what\'s her lactate?';
      return `<div class="or-scene or-s-sbar">
        <div class="or-sbar"><p class="or-sbar-h"><span>S</span><span>B</span><span>A</span><span>R</span> Calling Dr. Chen about 101</p>
          <p class="or-lab">Pick what she needs to hear:</p>
          <div class="or-chips">${SB.map((x) => { const on = sb.picked.includes(x.id); return `<button class="or-chip ${on ? 'on' : ''} ${sb.sent ? (x.key ? (on ? 'hit' : 'miss') : on ? 'noise' : '') : ''}" data-act="or" data-do="sb" data-k="${x.id}" aria-pressed="${on}" ${sb.sent ? 'disabled' : ''}>${esc(x.t)}</button>`; }).join('')}</div>
          <p class="or-lab">And what you want:</p>
          <div class="or-reqs">${SBREQ.map((x) => `<button class="or-req ${sb.req === x.id ? 'on' : ''}" data-act="or" data-do="sbreq" data-k="${x.id}" aria-pressed="${sb.req === x.id}" ${sb.sent ? 'disabled' : ''}>${esc(x.t)}</button>`).join('')}</div>
          ${sb.sent ? `<div class="or-reply">${icon('chen')}<p>"${esc(reply)}"</p></div><p class="or-verdict ${keys >= 4 && !noise && sb.req === 'sepsis' ? 'good' : ''}">${keys} of 5 key findings${noise ? `, ${noise} that didn't matter` : ''}. Lead with what changed and what you measured, then say what you need.</p>` : `<button class="btn btn-primary or-check" data-act="or" data-do="sbsend" ${sb.picked.length && sb.req ? '' : `disabled data-why="${sb.picked.length ? 'Choose what you want from her.' : 'Pick at least one finding.'}"`}>Call <small>6 min</small></button>`}
        </div>
      </div>`;
    }
    if (c.id === 'team') {
      return `<div class="or-scene or-s-team">
        <div class="or-deleg">${TASKS.map((x) => { const a = o.deleg[x.id]; const st = o.delegChecked ? (a === x.ok ? 'hit' : 'miss') : ''; return `<div class="or-task ${st}"><p>${esc(x.t)}</p><div class="seg" role="group">${[['aide', 'Luis'], ['me', 'Me']].map(([v, l]) => `<button data-act="or" data-do="dg" data-k="${x.id}" data-v="${v}" aria-pressed="${a === v}" ${o.delegChecked ? 'disabled' : ''}>${v === 'aide' ? icon('luis') : ''}${l}</button>`).join('')}</div>${o.delegChecked ? `<small class="why">${esc(x.why)}</small>` : ''}</div>`; }).join('')}</div>
        ${o.delegChecked ? '<p class="or-verdict good">Hand off the measurements and the routine care. Keep the assessment, the meds, and anything that\'s changing.</p>' : `<button class="btn or-check" data-act="or" data-do="dgcheck" ${Object.keys(o.deleg).length === TASKS.length ? '' : 'disabled data-why="Assign all four first."'}>Check my calls</button>`}
      </div>`;
    }
    // debrief
    const met = [['Patient safety', 88], ['Prioritization', 92], ['Assessment', 84], ['Medication safety', 76], ['Communication', 90], ['Delegation', 80]];
    const steps = [['Recognize cues', 90], ['Analyze cues', 78], ['Prioritize hypotheses', 92], ['Generate solutions', 74], ['Take action', 86], ['Evaluate outcomes', 70]];
    return `<div class="or-scene or-s-deb ${o.deb ? 'go' : ''}">
      <div class="or-deb-top"><p class="or-score"><b>86</b><small>Safe, solid shift</small></p><p class="or-stars" aria-label="Three stars"><i></i><i></i><i></i></p></div>
      <div class="or-meters"><div><h4>By skill</h4>${met.map(([l, v], k) => `<p class="or-m" style="--v:${v}%;--k:${k}"><span>${l}</span><i></i><b>${v}</b></p>`).join('')}</div><div><h4>By NCLEX clinical judgment step</h4>${steps.map(([l, v], k) => `<p class="or-m" style="--v:${v}%;--k:${k + 6}"><span>${l}</span><i></i><b>${v}</b></p>`).join('')}</div></div>
      <div class="or-outs"><div class="or-out good">${icon('or-a')}<p><b>Sepsis caught early</b> Antibiotic in by 07:40, fluids, lactate clearing. Home on day 5 with Dena.</p></div><div class="or-out good">${icon('or-b')}<p><b>Metoprolol held, rate recovered</b> Dose lowered by cardiology.</p></div><div class="or-out mixed">${icon('or-c')}<p><b>Pain under control, call light late</b> She waited 25 minutes at 10:40.</p></div></div>
    </div>`;
  }

  /* Nova's narration for each chapter. */
  const SAY = {
    clock: (o) => `I'm Nova, your charge nurse. The clock only moves when you do something: looking is free, and everything else costs minutes you see before you commit. Try a few actions on Mrs. Alvarez.${o.log.length >= 3 ? ' See it? Minutes are what you spend. Spend them on what matters most.' : ''}`,
    report: () => `Every shift starts with report from the nurse going home. It's long and most of it is noise. Tap the lines that would change what you do in your first hour. They go on your brain sheet in highlighter, and the game tracks what you caught.`,
    rank: () => `Before you leave report, decide who you'll see first. Ask yourself who could get hurt fastest. Unstable beats scheduled, and scheduled beats stable. Drag the magnets on the board into order.`,
    station: () => `This is your home base between rooms. Doors show who's waiting; a yellow light is a call light. The phone is how the lab, pharmacy, doctors and your aide reach you, and some messages need an answer. Try answering these two. You can also tap a door.`,
    room: () => `In a room, look at the patient first, then work through the tabs: assess, care, meds, talk. Before you give anything, check what the order asks you to check. Mr. Ostrowski's metoprolol is due. Decide.`,
    sbar: () => `When something's wrong, you call the provider with an SBAR: situation, background, assessment, recommendation. Pick only what she needs to make a decision, then ask for what you want. Mrs. Alvarez can't wait.`,
    team: () => `You have an aide, Luis. He can measure and help patients move. He can't assess, decide, or give meds. Assign each task: Luis or you.`,
    debrief: () => `At the end of the shift you give report to the next nurse, then see what happened to every patient, scored by skill and by the six NCLEX clinical judgment steps. Every decision has a reason you can read. Patients have stories too: the more time you spend with them, the more they tell you. That's it. You're ready.`,
  };

  function view(o) {
    const c = CH[o.i], last = o.i === CH.length - 1;
    return `<div class="orient" role="dialog" aria-modal="true" aria-label="Orientation: how to play">
      <aside class="or-clip" aria-label="Orientation checklist">
        <div class="or-clamp" aria-hidden="true"></div>
        <p class="or-clip-h">Orientation<small>Practice unit, your first day</small></p>
        <ol class="or-list">${CH.map((x, k) => `<li class="${k === o.i ? 'now' : ''} ${o.seen.includes(k) && k !== o.i ? 'done' : ''}"><button data-act="or" data-do="go" data-i="${k}" ${o.seen.includes(k) || k === o.i + 1 ? '' : 'disabled data-why="One step at a time."'}><span class="box" aria-hidden="true"></span><span class="t">${hhmm(x.t)}</span><span class="s">${esc(x.step)}</span></button></li>`).join('')}</ol>
        <button class="or-skipall" data-act="or" data-do="skip">${o.start ? 'Skip, I\'ve played before' : 'Close'}</button>
      </aside>
      <section class="or-stage" aria-live="polite"><div class="or-body">
        <div class="or-ticks" aria-hidden="true">${CH.map((x, k) => `<i class="${k <= o.i ? 'on' : ''}"></i>`).join('')}</div>
        <header class="or-head"><div><p class="or-k">Step ${o.i + 1} of ${CH.length}<button class="or-skip-m" data-act="or" data-do="skip">${o.start ? 'Skip' : 'Close'}</button></p><h2 tabindex="-1">${esc(c.title)}</h2></div>${wallClock(clockOf(o))}</header>
        <div class="or-nova">${R.bust('nova', null, 'portrait')}<p>${esc(SAY[c.id](o))}</p></div>
        ${stage(o)}
        </div><nav class="or-nav"><button class="btn" data-act="or" data-do="back" ${o.i ? '' : 'disabled data-why="This is the first step."'}>Back</button>${last ? `<button class="btn btn-quiet" data-act="or" data-do="ref">Quick reference</button>` : ''}<button class="btn btn-primary" data-act="or" data-do="${last ? 'done' : 'next'}">${last ? (o.start ? 'Start my first shift' : 'Done') : 'Next'}</button></nav>
      </section>
    </div>`;
  }

  /* Returns 'done' when the orientation should close (and start the shift if it was opened from Start). */
  function act(o, d) {
    const c = CH[o.i];
    switch (d.do) {
      case 'next': if (o.i < CH.length - 1) { o.i += 1; if (!o.seen.includes(o.i)) o.seen.push(o.i); FX.play('tap'); } break;
      case 'back': if (o.i > 0) o.i -= 1; break;
      case 'go': { const k = +d.i; if (o.seen.includes(k) || k === o.i + 1) { o.i = k; if (!o.seen.includes(k)) o.seen.push(k); } break; }
      case 'skip': return 'skip';
      case 'done': return 'done';
      case 'ref': return 'ref';
      case 'act': { const a = ACTIONS.find((x) => x.id === d.id); if (!a) break; o.extra += a.min; o.log.push({ id: a.id, at: c.t + o.extra, out: `${a.label}${a.min ? ` (${a.min} min)` : ' (free)'}: ${a.out}` }); FX.play(a.min ? 'commit' : 'tap'); break; }
      case 'hl': { if (o.hlChecked) break; const k = +d.k, i = o.hl.indexOf(k); if (i >= 0) o.hl.splice(i, 1); else o.hl.push(k); FX.play('tap'); break; }
      case 'hlcheck': o.hlChecked = true; FX.play(REPORT.every((r, k) => r.key === o.hl.includes(k)) ? 'right' : 'commit'); break;
      case 'mv': { const i = o.order.indexOf(d.k), j = i + +d.d; if (i < 0 || j < 0 || j >= o.order.length) break; [o.order[i], o.order[j]] = [o.order[j], o.order[i]]; o.dragged = true; break; }
      case 'rankcheck': o.rankChecked = true; FX.play(o.order.every((k, i) => RIGHT[i] === k) ? 'right' : 'commit'); break;
      case 'phone': { const m = PHONE.find((x) => x.id === d.m); if (!m || o.phone[m.id]) break; o.phone[m.id] = d.x; FX.play(m.opts.find((x) => x.id === d.x).v === 2 ? 'right' : 'nope'); break; }
      case 'door': { const p = PT[d.pid]; o.door = p ? `You'd walk into ${p.room}${p === PT['or-b'] ? ', where Mr. Ostrowski has his call light on' : ''}. Walking between rooms takes a minute.` : 'That room is waiting for an admission at 09:30.'; FX.play('tap'); break; }
      case 'tab': o.tab = d.k; FX.play('tap'); break;
      case 'apical': o.apical = true; o.roomMin = (o.roomMin || 0) + 1; FX.play('commit'); break;
      case 'med': o.med = d.v; o.roomMin = (o.roomMin || 0) + 5; FX.play(d.v === 'hold' && o.apical ? 'right' : 'nope'); break;
      case 'sb': { const sb = o.sbar; if (sb.sent) break; const i = sb.picked.indexOf(d.k); if (i >= 0) sb.picked.splice(i, 1); else sb.picked.push(d.k); FX.play('tap'); break; }
      case 'sbreq': if (!o.sbar.sent) { o.sbar.req = d.k; FX.play('tap'); } break;
      case 'sbsend': o.sbar.sent = true; FX.play(o.sbar.req === 'sepsis' ? 'right' : 'commit'); break;
      case 'dg': if (!o.delegChecked) { o.deleg[d.k] = d.v; FX.play('tap'); } break;
      case 'dgcheck': o.delegChecked = true; FX.play(TASKS.every((x) => o.deleg[x.id] === x.ok) ? 'right' : 'commit'); break;
      default: break;
    }
    if (CH[o.i].id === 'debrief') o.deb = true;
    return null;
  }
  function sorted(o, name, keys) { if (!o || name !== 'or-board' || o.rankChecked) return false; o.order = keys; o.dragged = true; return true; }

  S.orient = { fresh, view, act, sorted: (name, keys) => sorted(S.orient._o, name, keys), CH, _o: null };
})(window.Shift = window.Shift || {});
