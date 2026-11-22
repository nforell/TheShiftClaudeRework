/* The Shift — UI: General sheets: feedback, account, class, shift pack, coach tips, menu, settings, help, terms, health check. */
import { reduced } from './actions.js';
import { applySettings, markSeen, seen } from './core.js';
import { C, CASES, CL, E, FM, G, ICON, NG, PACK, R, RV, S, TEL, TERMS, cna, def, diffLabel, esc, faceOf, hhmm, owned, prov, pts, specOf, ui, who } from './ctx.js';
import { PERF, render } from './render.js';

/* ------------ beta feedback ------------ */
export const PAY = [['yes', 'Yes'], ['maybe', 'Maybe'], ['no', 'No']];
/* Three one-tap questions, then an optional note. Every answer lands as a row Nick can export (supabase/feedback.sql). */
export const FBQ = [
  ['level', 'How hard was this shift?', [['easy', 'Too easy'], ['right', 'About right'], ['hard', 'Too hard']]],
  ['nclex', 'Did it help you think like the NCLEX asks?', [['yes', 'Yes'], ['some', 'A little'], ['no', 'Not really']]],
];
export const fbAny = (f) => !!(f && (String(f.note || '').trim() || f.pay || f.level || f.nclex));
export const fbSeg = (k, label, opts, cur, act) => `<div class="fb-row"><span class="fb-l" id="fb-${k}-l">${label}</span><div class="seg" role="group" aria-labelledby="fb-${k}-l">${opts.map(([v, l]) => `<button data-act="${act}" data-k="${k}" data-v="${v}" aria-pressed="${cur === v}">${l}</button>`).join('')}</div></div>`;
export function fbCard() {
  const f = ui.fb || (ui.fb = {});
  if (f.sent) return `<section class="fbk sent" aria-live="polite"><h2>Thanks. I read every one of these.</h2><p class="muted">${f.sent === 'email' ? 'Your email app should have opened with it filled in. Hit send there.' : 'Every report gets read, and clinical problems get fixed first.'}</p></section>`;
  return `<section class="fbk" aria-labelledby="fbh"><h2 id="fbh">Help shape the beta</h2><p class="muted">Three taps and you're done. Clinical problems get fixed first.</p>
    ${FBQ.map(([k, label, opts]) => fbSeg(k, label, opts, f[k], 'fb-q')).join('')}
    ${fbSeg('pay', 'Would you pay for more shifts like this?', PAY, f.pay, 'fb-pay')}
    <label class="fb-l" for="fb-note">Anything clinically off, confusing, or missing? <span class="muted">(optional)</span></label>
    <textarea id="fb-note" class="fb-t" data-bind="note" rows="3" maxlength="2000" placeholder="Room, moment, what you'd expect instead">${esc(f.note || '')}</textarea>
    <div class="fb-f"><button class="btn btn-primary" data-act="fb-send" ${fbAny(f) ? '' : 'aria-disabled="true" data-why="Answer one question first."'}>Send feedback</button></div></section>`;
}
export const RPT = [['clinical', 'Clinically wrong'], ['unclear', 'Confusing'], ['scoring', 'Unfair scoring'], ['bug', 'Something broke'], ['other', 'Other']];
export function ovReport() {
  const r = ui.rp || {}, j = r.j;
  if (r.sent) return sheet('Report sent', `<p>${r.sent === 'email' ? 'Your email app should have opened with the report filled in. Hit send there.' : 'Thank you. Clinical reports get looked at first.'}</p>`, `<button class="btn btn-primary" data-act="close">Done</button>`, { label: 'Report sent' });
  const qq = r.q;
  return sheet(j ? 'Report a problem with this' : qq ? 'Report a problem with this question' : 'Send feedback', `${j ? `<blockquote class="rp-q"><b>${esc(j.text)}</b><span>${esc(j.why)}</span></blockquote>` : qq ? `<blockquote class="rp-q"><b>${esc(NG.TYPE[qq.type] || 'Question')} · ${esc(qq.id)}</b><span>${esc(String(qq.stem || qq.q || '').slice(0, 240))}</span></blockquote>` : '<p class="muted" style="margin-top:0">Something wrong, confusing, or missing? Tell me what you saw.</p>'}
    <div class="rp-why" role="group" aria-label="What kind of problem">${RPT.map(([v, l]) => `<button class="btn ${r.why === v ? 'btn-primary' : ''}" data-act="rpt-why" data-v="${v}" aria-pressed="${r.why === v}">${l}</button>`).join('')}</div>
    <label class="fb-l" for="rp-note">What would you expect instead?</label>
    <textarea id="rp-note" class="fb-t" data-bind="rp.note" rows="4" maxlength="2000" placeholder="Optional, but the more specific the better">${esc(r.note || '')}</textarea>`,
    `<button class="btn" data-act="close">Cancel</button><button class="btn btn-primary" data-act="rpt-send" ${r.why || r.note ? '' : 'aria-disabled="true" data-why="Pick what kind of problem, or describe it."'}>Send</button>`, { label: j ? 'Report a problem' : 'Send feedback' });
}
export const standalone = () => !!((window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone);
export const iosInstallable = () => /iPhone|iPad|iPod/.test(navigator.userAgent) && /^https:/.test(location.protocol) && !standalone();
/* Who checked the clinical content of each shift, and against which version. */
export function ovReviewInfo() {
  const web = /^https?:$/.test(location.protocol);
  const rows = CASES.map((id) => { const k = E.caseMeta(id), st = RV.status(id), r = st.r;
    return `<div class="rv-row"><div class="rv-h"><b>${esc(k.title)}</b><span class="chip ${st.state === 'reviewed' ? 'ok' : st.state === 'changed' ? 'alert' : 'warn'}">${esc(st.label)}</span></div>
      ${r.reviewers.length ? `<p>${r.reviewers.map((x) => `${esc(x.name)}, ${esc(x.credentials)}${x.role ? ` (${esc(x.role)})` : ''}${x.date ? `, ${esc(x.date)}` : ''}`).join('; ')}</p>` : ''}
      ${r.references.length ? `<ul class="rv-refs">${r.references.map((x) => `<li>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.text)}</a>` : esc(x.text)}</li>`).join('')}</ul>` : ''}
      ${web ? `<a class="rv-go" href="/review/${id}/" target="_blank" rel="noopener">${st.state === 'reviewed' ? 'See what was reviewed' : 'Review this shift'}</a>` : ''}</div>`; }).join('');
  // Drills and NCLEX practice: reviewed item by item, against each item's version, in packs.
  const PK = S.reviewPacks || [], pk = (L) => L.reduce((a, p) => ({ n: a.n + p.n, r: a.r + p.reviewed, c: a.c + p.changed }), { n: 0, r: 0, c: 0 });
  const grp = (label, f) => { const L = PK.filter(f); if (!L.length) return ''; const t = pk(L);
    return `<div class="rv-row rv-pk"><div class="rv-h"><b>${esc(label)}</b><span class="chip ${t.r === t.n ? 'ok' : 'warn'}">${t.r === t.n ? 'Clinically reviewed' : t.r ? `${t.r} of ${t.n} items reviewed` : 'Awaiting clinical review'}</span></div>
      ${t.c ? `<p>${t.c} item${t.c === 1 ? '' : 's'} changed since review and need${t.c === 1 ? 's' : ''} another look.</p>` : ''}<p class="muted" style="margin:.2rem 0 0">${t.n} items, reviewed one by one.</p></div>`; };
  const prac = grp('Drills', (p) => p.id.startsWith('drill-')) + grp('NCLEX questions after each shift', (p) => p.id.startsWith('ngn-shift')) + grp('NCLEX question bank', (p) => p.id.startsWith('bank-')) + grp('NCLEX case studies', (p) => p.id.startsWith('cases-'));
  return sheet('Clinical review', `<p style="margin-top:0">Every shift is written by a working psych RN. Before a shift is marked reviewed, a licensed clinician checks every patient, order and scored decision in it, and signs off on that exact version. If the content changes later, it says so here until it's checked again.</p>
    ${web ? '<p class="muted">Are you a nurse, educator or pharmacist? You can review a shift: it takes about an hour, and reviewers are credited here.</p>' : ''}${rows}
    ${prac ? `<h3 class="rv-sub">Drills and NCLEX practice</h3><p class="muted" style="margin-top:0">Every drill card and practice question is checked on its own, so an edit to one card sends only that card back for review.</p>${prac}${web ? '<a class="rv-go rv-pgo" href="/review/practice/" target="_blank" rel="noopener">Review drills or practice questions</a>' : ''}` : ''}`,
    `<button class="btn btn-primary" data-act="close">Done</button>`, { label: 'Clinical review', wide: true });
}
export function ovAccount() {
  const st = CL.status() || {}, a = ui.acct || (ui.acct = {});
  if (st.state === 'in') {
    const ago = st.at ? Math.round((Date.now() - st.at) / 60000) : null;
    return sheet('Your account', `<p style="margin-top:0">Signed in as <b>${esc(st.email || '')}</b>. Your progress saves to your account and follows you to any device where you sign in.</p>
      <p class="muted">${st.busy ? 'Syncing…' : st.err ? `Last sync didn't go through: ${esc(st.err)}. It will try again.` : ago === null ? 'Not synced yet.' : ago < 1 ? 'Synced just now.' : `Synced ${ago} minute${ago === 1 ? '' : 's'} ago.`}</p>
      <p class="muted" style="margin-bottom:0">${a.delErr ? `Couldn't delete the account: ${esc(a.delErr)}` : 'Done with The Shift? <button class="acct-link" data-act="acct-del-ask">Delete your account</button> and everything saved to it.'}</p>`,
      `<button class="btn" data-act="acct-out">Sign out</button><button class="btn btn-primary" data-act="acct-sync">Sync now</button>`, { label: 'Your account' });
  }
  if (a.sent) return sheet('Check your email', `<p style="margin-top:0">We sent a sign-in link to <b>${esc(a.sent)}</b>. Open it on this device and you'll come back here signed in, with your progress saved.</p><p class="muted">No email in a few minutes? Check spam, or send it again.</p>`,
    `<button class="btn" data-act="acct-again">Use a different email</button><button class="btn btn-primary" data-act="close">Done</button>`, { label: 'Check your email' });
  return sheet('Save your progress', `<p style="margin-top:0">Sign in with your email to keep your shifts, stars and badges safe, and pick up on another device. No password: we email you a link.</p>
    ${st.err ? `<p class="acct-err">${esc(st.err)}</p>` : ''}
    <label class="fb-l" for="acct-email">Email</label>
    <input id="acct-email" class="fb-t acct-in" type="email" autocomplete="email" inputmode="email" data-bind="acct.email" value="${esc(a.email || '')}" placeholder="you@example.com">
    ${a.err ? `<p class="acct-err" role="alert">${esc(a.err)}</p>` : ''}
    <p class="muted" style="font-size:.85rem">Your email is used only to sign you in. <a href="/privacy/" target="_blank" rel="noopener">Privacy</a></p>`,
    `<button class="btn" data-act="close">Not now</button><button class="btn btn-primary" data-act="acct-send" ${a.busy ? 'aria-disabled="true" data-why="Sending…"' : ''}>${a.busy ? 'Sending…' : 'Email me a link'}</button>`, { label: 'Save your progress' });
}
/* Your class: a student joins an instructor's class with a code, so the instructor sees their results. */
export function ovClass() {
  const st = CL.status() || {}, c = ui.cls || (ui.cls = {});
  const teach = location.protocol.startsWith('http') ? '<p class="muted" style="font-size:.85rem">Teaching? <a href="/teach/" target="_blank" rel="noopener">Open the instructor dashboard</a> to make a class and get a code.</p>' : '';
  if (st.state !== 'in') return sheet('Your class', `<p style="margin-top:0">If your instructor gave you a class code, join here and they'll see how your shifts and practice questions go: scores by skill and NCLEX step, and the decisions to rethink. Nobody else sees them.</p>
    <p>Sign in first, so your results are tied to you and not to this device.</p>${teach}`,
    `<button class="btn" data-act="close">Not now</button><button class="btn btn-primary" data-act="account">Sign in</button>`, { label: 'Your class' });
  if (!c.list && !c.loading) { c.loading = true; CL.myClasses().then((L) => { c.list = L; c.loading = false; render(); }).catch((e) => { c.list = []; c.loading = false; c.err = e.message; render(); }); }
  const L = c.list || [];
  const rows = c.loading ? '<p class="muted">Loading your classes…</p>' : L.length ? `<ul class="cls-list">${L.map((k) => `<li><span><b>${esc(k.name || 'Class')}</b><br><small class="muted">Code ${esc(k.code || '')} · your instructor sees you as ${esc(k.as)}${k.pack ? ' · all shifts included' : ''}</small></span><button class="btn" data-act="cls-leave" data-id="${esc(k.id)}">Leave</button></li>`).join('')}</ul>` : '';
  return sheet('Your class', `${L.length ? '' : '<p style="margin-top:0">Join with the code your instructor gave you. They\'ll see your shift scores by skill and NCLEX step, the decisions to rethink, and your practice-question results. Nobody else sees them.</p>'}${rows}
    <label class="fb-l" for="cls-code">${L.length ? 'Join another class' : 'Class code'}</label>
    <input id="cls-code" class="fb-t acct-in cls-code" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="8" data-bind="cls.code" value="${esc(c.code || '')}" placeholder="ABC234">
    <label class="fb-l" for="cls-name">Your name, as your instructor should see it</label>
    <input id="cls-name" class="fb-t acct-in" autocomplete="name" maxlength="60" data-bind="cls.name" value="${esc(c.name || '')}" placeholder="First and last name">
    ${c.err ? `<p class="acct-err" role="alert">${esc(c.err)}</p>` : ''}${c.ok ? `<p class="cls-ok" role="status">${esc(c.ok)}</p>` : ''}
    <p class="muted" style="font-size:.85rem">Results from shifts you've already played on this device go too.</p>${teach}`,
    `<button class="btn" data-act="close">Done</button><button class="btn btn-primary" data-act="cls-join" ${c.busy ? 'aria-disabled="true" data-why="Joining…"' : ''}>${c.busy ? 'Joining…' : 'Join class'}</button>`, { label: 'Your class' });
}
export function ovPack() {
  const lockedIds = CASES.filter((id) => !(PACK.free || []).includes(id)), freeN = CASES.length - lockedIds.length;
  const st = CL ? CL.status() || {} : {}, w = ui.packWait;
  if (owned()) return sheet('Shift pack unlocked', `<p style="margin-top:0">Every shift is open${CL.owns('pack') === 'class' ? ', through your class' : ''}. Thanks for supporting The Shift.</p>`, `<button class="btn btn-primary" data-act="close">Play</button>`, { label: 'Shift pack' });
  if (w) return sheet('Finishing your purchase', `<p style="margin-top:0">${w === 'slow' ? 'Your payment went through, but the unlock hasn\'t reached your account yet. It usually takes a few seconds. Check again in a minute; if it still doesn\'t show, email us and we\'ll sort it out.' : 'Checking with your account…'}</p>`,
    `<button class="btn" data-act="close">Close</button><button class="btn btn-primary" data-act="pack-check">Check again</button>`, { label: 'Shift pack' });
  const list = `<ul class="pack-list">${lockedIds.map((id) => { const k = E.caseMeta(id); return `<li><b>${esc(k.title)}</b><small>${esc(specOf(id).name)} · ${esc(diffLabel(id))} · ${esc(k.card)}</small></li>`; }).join('')}</ul>`;
  const intro = `<p style="margin-top:0">${freeN} shifts are free to play as much as you like. The shift pack opens the other ${lockedIds.length}, and every shift we add after this, for one payment of <b>${esc(PACK.price || '')}</b>. No subscription.</p>${list}`;
  const school = CL ? '<p class="muted" style="font-size:.9rem">Is your school paying? <button class="acct-link" data-act="cls">Join your class</button> with the code from your instructor and every shift opens.</p>' : '';
  if (!CL) return sheet('The shift pack', intro + '<p class="muted">Buying the pack needs the online version of The Shift.</p>', `<button class="btn btn-primary" data-act="close">Close</button>`, { label: 'Shift pack' });
  if (st.state !== 'in') return sheet('The shift pack', intro + '<p>Sign in first, so the pack belongs to your account and opens on every device you use.</p>' + school,
    `<button class="btn" data-act="close">Not now</button><button class="btn btn-primary" data-act="account">Sign in to buy</button>`, { label: 'Shift pack' });
  return sheet('The shift pack', intro + school + `<p class="muted" style="font-size:.85rem">Payment is handled by Stripe. Already bought it? <button class="acct-link" data-act="pack-check">Check again</button></p>`,
    `<button class="btn" data-act="close">Not now</button>${PACK.checkoutUrl ? `<button class="btn btn-primary" data-act="pack-buy">Unlock for ${esc(PACK.price || '')}</button>` : '<button class="btn btn-primary" aria-disabled="true" data-why="Purchases open soon.">Coming soon</button>'}`, { label: 'Shift pack' });
}
/* After a cloud sync, pick up the merged progress (and a newer shift from another device, if this one has none open). */
/* Back from Stripe: the webhook writes the purchase; poll the account until it shows. */
export function packPoll(n) {
  CL.checkOwns().catch(() => {}).then(() => {
    if (owned()) { ui.packWait = null; TEL.track('pack_unlocked', {}); if (ui.ov === 'pack' || !ui.ov) ui.ov = 'pack'; render(); return; }
    if (n > 1) return setTimeout(() => packPoll(n - 1), 2000);
    ui.packWait = 'slow'; ui.ov = 'pack'; render();
  });
}
export function fromCloud() {
  G.prof = E.store.profile(); applySettings();
  if (!G.s || G.s.ended) { const g = E.store.load(); if (g && !g.ended && E.caseMeta(g.caseId)) { G.s = g; G.caseId = g.caseId; E.useCase(G.caseId); } }
  if (ui.view === 'home' || ui.ov === 'account') render();
}
export function fbWhere() { return G.s ? { case: G.s.caseId, game_min: Math.round(G.s.t), view: ui.view } : { case: G.caseId, view: ui.view }; }

/* Coach tips: shown once, anchored to the thing they describe. */
export const COACH = {
  station: [
    { sel: '.st-intro', text: 'This is the nurses\' station, your home base. You start here and come back here between rooms to plan, read the phone and get help.' },
    { sel: '.cmd-go', alt: '.pt-row', text: 'This card always shows the one thing to do next, and who it\'s for. Tap it and you walk straight to that room, with the right tab open. The clock only moves when you act.' },
    { sel: '.top [data-act="inbox"]', alt: '.phone', text: () => `Your unit phone. ${cna().name}, the lab, pharmacy and the doctors reach you here. Some messages need an answer.` },
    { sel: '.helpers', text: () => `Your team, always up here. Nova gives tips when you're stuck. ${cna().name}, your ${/^[A-Z]{2,}/.test(cna().role) ? cna().role : cna().role.toLowerCase()}, can take routine work like vitals off your plate: tap ${cna().name} to see what's worth handing off.` },
    { sel: '.skip', text: 'Caught up? Skip ahead. The clock runs until something needs you, then stops.' },
  ],
  /* The first room is a guided walk: each "do" step waits for the player to actually do it. */
  room: [
    { sel: '.pt', text: () => `Meet ${def(G.s.loc).short}. Tap the patient to see how they look and hear what they say. Looking and listening are free: the clock doesn't move.`, until: () => !!ui.caption, try: true },
    { sel: '[data-act="dock"][data-id="assess"]', text: 'Open Assess. Vital signs and body-system checks live here.', until: () => ui.dock === 'assess', try: true },
    { sel: '[data-act="assess"][data-sys="vitals"]', text: 'Take a set of vital signs. Every check shows what it costs in minutes, and the clock moves when you commit.', until: () => youVitals() > (ui.guide0 || 0), try: true },
    { sel: '.vstrip', alt: '.feed', text: 'Your findings land here, with the time you got them. Compare them with what you heard in report, and look at the trend, not just this set.' },
    { sel: '.plate-btns [data-act="chart"]', alt: '.rt-chart', text: 'Before you give or hold anything, check the chart: labs, orders and the medication record (MAR). Open it now.', until: () => ui.ov === 'chart' || !!ui.guideChart, try: true },
    { sel: '[data-act="dock"][data-id="care"]', alt: '[data-act="dock"]', text: () => `Care, meds and talking work the same way: pick it, see the cost, commit. To talk with ${def(G.s.loc).short}, tap their speech bubble. When this room is handled, go back to the station: ${Math.max(0, pts().length - 1)} more patients are waiting.` },
    { sel: '[data-act="nova"]', text: 'Stuck? Nova, your charge nurse, gives a few nudges a shift. She points; she won\'t answer for you.' },
  ],
};
export const youVitals = () => { const P = G.s && G.s.loc && G.s.p[G.s.loc]; return P && P.vit ? P.vit.filter((x) => x.by === 'You').length : 0; };
export function coachFor() {
  if (!G.s || G.s.ended || (ui.intro !== null && ui.intro !== undefined)) return null;
  const key = ui.view === 'station' ? 'station' : ui.view === 'room' ? 'room' : null;
  if (!key || seen('coach:' + key)) return null;
  ui.coachStep = ui.coachStep || {};
  if (key === 'room' && ui.guidePid !== G.s.loc) { ui.guidePid = G.s.loc; ui.guide0 = youVitals(); ui.guideChart = false; if (!ui.coachStep.room) TEL.track('tour_start', { case: G.s.caseId }); }
  // Steps the player completes by doing them advance on their own, even behind an open sheet.
  let i = ui.coachStep[key] || 0;
  while (COACH[key][i] && COACH[key][i].until && COACH[key][i].until()) { i += 1; ui.coachStep[key] = i; if (key === 'room') TEL.track('tour_step', { step: i, case: G.s.caseId }); }
  if (!COACH[key][i]) { markSeen('coach:' + key); if (key === 'room') TEL.track('tour_done', { case: G.s.caseId }); return null; }
  if (ui.ov) return null;
  const step = COACH[key][i];
  return step ? { key, i, step, n: COACH[key].length } : null;
}
export function coachPlace() {
  const c = coachFor(), id = c ? c.key + ':' + c.i : '';
  let card = document.querySelector('.coach'), ring = document.querySelector('.coach-ring');
  if (!c) { if (card) card.remove(); if (ring) ring.remove(); return; }
  const shown = (q) => { const e = q && document.querySelector(q); return e && e.getBoundingClientRect().width ? e : null; };   // a target that's hidden at this width doesn't count
  const a = shown(typeof c.step.sel === 'function' ? c.step.sel() : c.step.sel) || shown(c.step.alt); if (!a) return;
  let r = a.getBoundingClientRect(); if (!r.width) return;
  if (!card || card.dataset.id !== id) {
    if (card) card.remove(); if (ring) ring.remove();
    if (r.top < 60 || r.bottom > innerHeight - 40) { a.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); }
    ring = document.createElement('div'); ring.className = 'coach-ring';
    card = document.createElement('div'); card.className = 'coach'; card.dataset.id = id; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Tip');
    card.innerHTML = `<p>${esc(typeof c.step.text === 'function' ? c.step.text() : c.step.text)}</p><div class="coach-f"><span class="dots">${Array.from({ length: c.n }, (_, k) => `<i class="${k === c.i ? 'on' : ''}"></i>`).join('')}</span><button class="btn btn-quiet" data-act="coach-skip">${c.key === 'room' ? 'Skip tour' : 'Skip tips'}</button>${c.step.try ? '<span class="coach-try">Tap the highlighted spot</span>' : `<button class="btn btn-primary" data-act="coach-next">${c.i === c.n - 1 ? 'Got it' : 'Next'}</button>`}</div>`;
    document.body.append(ring, card);
  }
  r = a.getBoundingClientRect();
  Object.assign(ring.style, { left: r.left - 6 + 'px', top: r.top - 6 + 'px', width: r.width + 12 + 'px', height: r.height + 12 + 'px' });
  const w = card.offsetWidth, h = card.offsetHeight, below = r.bottom + h + 20 < innerHeight;
  card.style.left = Math.max(10, Math.min(innerWidth - w - 10, r.left + r.width / 2 - w / 2)) + 'px';
  card.style.top = (below ? r.bottom + 14 : Math.max(10, r.top - h - 14)) + 'px';
}
addEventListener('resize', () => coachPlace()); addEventListener('scroll', () => { if (document.querySelector('.coach')) coachPlace(); }, { passive: true });

/* ------------ overlays ------------ */
export function sheet(title, body, foot, opts) {
  opts = opts || {};
  return `<div class="scrim" data-act="${opts.noScrimClose ? '' : 'close'}" data-scrim="1"><div class="sheet ${opts.wide ? 'wide' : ''} ${opts.cls || ''}" role="dialog" aria-modal="true" aria-label="${esc(opts.label || title)}">
    <div class="sheet-h">${opts.face || ''}<h2>${title}</h2>${opts.noClose ? '' : `<button class="icon-btn" data-act="close" aria-label="Close">${ICON.close}</button>`}</div>
    <div class="sheet-b">${body}</div>${foot ? `<div class="sheet-f">${foot}</div>` : ''}</div></div>`;
}

export function ovMenu() {
  const inShift = G.s && !G.s.ended && ui.view !== 'home' && ui.view !== 'debrief';
  return sheet('Menu', `<div class="menu-list">
    <button class="btn" data-act="help">How it plays</button><button class="btn" data-act="settings">Settings</button>
    ${S.ref ? '<button class="btn" data-act="ref">Pocket reference</button>' : ''}${NG && NG.bank ? `<button class="btn" data-act="practice">NCLEX practice${inShift ? ' (your shift is saved)' : ''}</button>` : ''}
    ${CL ? `<button class="btn" data-act="account">${CL.user() ? 'Your account' : 'Save your progress across devices'}</button><button class="btn" data-act="cls">Your class</button>` : ''}
    <button class="btn" data-act="rpt">Send feedback or report a problem</button>
    ${TERMS ? '<button class="btn" data-act="terms">Terms and disclaimer</button>' : ''}
    ${RV ? '<button class="btn" data-act="review">Clinical review</button>' : ''}
    ${ui.installEvt ? '<button class="btn" data-act="install">Install The Shift on this device</button>' : iosInstallable() ? '<button class="btn" data-act="install-ios">Add The Shift to your home screen</button>' : ''}
    ${inShift && G.s.t >= 15 ? '<button class="btn" data-act="endask">End the shift early and see debrief</button>' : ''}
    ${inShift ? '<button class="btn btn-danger" data-act="restart">Restart this shift</button>' : ''}
    ${ui.view !== 'shifts' && !inShift ? '<button class="btn" data-act="shifts">Full shifts</button>' : ''}
    <button class="btn" data-act="home">Home${inShift ? ' (your shift is saved)' : ''}</button></div>`, '');
}
export function ovSettings() {
  const st = G.prof.settings;
  const seg = (key, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button data-act="set" data-k="${key}" data-v="${v}" aria-pressed="${(st[key] || opts[0][0]) === v}">${l}</button>`).join('')}</div>`;
  return sheet('Settings', `<div class="setrow"><span>Theme</span>${seg('theme', [['system', 'System'], ['light', 'Day'], ['dark', 'Night']])}</div>
    <div class="setrow"><span>Text size</span>${seg('text', [['normal', 'Standard'], ['large', 'Large']])}</div>
    <div class="setrow"><span>Motion</span>${seg('motion', [['full', 'Full'], ['reduced', 'Reduced']])}</div>
    <div class="setrow"><span>Graphics<small class="set-sub">${FM.lite && (st.gfx || 'auto') === 'auto' ? 'Auto switched to Lite on this device' : 'Lite keeps things smooth on older computers'}</small></span>${seg('gfx', [['auto', 'Auto'], ['full', 'Full'], ['lite', 'Lite']])}</div>
    <div class="setrow"><span>Health check<small class="set-sub">Speed, memory and the last error, for troubleshooting</small></span><button class="btn" data-act="health">Open</button></div>
    <div class="setrow"><span>Psych law<small class="set-sub">The psych shift is written to California law. General US uses plain terms that hold in most states.</small></span>${seg('law', [['ca', 'California'], ['general', 'General US']])}</div>
    <div class="setrow"><span>Decision feedback</span>${seg('feedback', [['now', 'Right away'], ['debrief', 'At the debrief']])}</div>
    <div class="setrow"><span>Routine results<small class="set-sub">Where a finding shows when nothing changed. Important ones always get a card.</small></span>${seg('results', [['inline', 'In the panel'], ['card', 'Pop-up card']])}</div>
    <div class="setrow"><span>Music</span>${seg('music', [['on', 'On'], ['off', 'Off']])}</div>
    <div class="setrow"><span>Sound effects and haptics</span>${seg('sound', [['on', 'On'], ['off', 'Off']])}</div>
    <div class="setrow"><span>Share anonymous usage<small class="set-sub">Which screens people reach and where they stop. No names, nothing you type. <a href="/privacy/" target="_blank" rel="noopener">Privacy</a></small></span><div class="seg" role="group">${[['on', 'On'], ['off', 'Off']].map(([v, l]) => `<button data-act="tel" data-v="${v}" aria-pressed="${(TEL.optedOut() ? 'off' : 'on') === v}">${l}</button>`).join('')}</div></div>
    <div class="setrow"><span>Intro and tips</span><button class="btn" data-act="reset-tips">${G.prof.seen && Object.keys(G.prof.seen).length ? 'Show them again' : 'On for your next shift'}</button></div>
    <div class="setrow"><span>Start over<small class="set-sub">Clears your shifts, stars, XP, badges and lessons on this device, and replays the first-time walkthrough. Settings stay.</small></span><button class="btn btn-danger" data-act="reset-ask">Reset progress</button></div>`, `<button class="btn btn-primary" data-act="close">Done</button>`);
}
export function ovHelp() {
  return sheet('How it plays', `<div class="help">
    <p><b>You are the nurse.</b> This shift runs ${hhmm(C(), 0)} to ${hhmm(C(), C().length)}. The clock moves when you act (assessing, giving meds, calling, walking between rooms), and each action shows its cost. When you're caught up, <b>Skip ahead</b> at the station: the clock runs until something needs you, then stops.</p>
    <p><b>Report.</b> The outgoing nurse gives you report. Flag the lines that matter; they stay on your brain sheet all shift. Flagging everything counts against you.</p>
    <p><b>Who first.</b> After report you rank your patients. Nova tells you how her order compares, and explains why at the debrief.</p>
    <p><b>The hallway.</b> Doors with an amber light need attention. Go into a room to assess, intervene, give or hold medications, and talk with patients and families. Tap objects in the room to inspect them.</p>
    <p><b>The phone.</b> ${esc(cna().name)} (your ${esc(cna().role)}), pharmacy, the lab${C().unitShort ? '' : ', telemetry'} and ${esc(prov().name)} will reach you here. Some messages ask for a reply.</p>
    <p><b>Charts.</b> Vitals, labs, orders, MAR, notes. Open them from the station or any room. They don't cost time.</p>
    <p><b>Nova.</b> Your charge nurse gives ${C().novaCredits || 3} nudges per shift. She points; she doesn't answer for you.</p>
    <p><b>Rounds and call lights.</b> Patients you haven't checked on in a while start asking for things. An hourly round heads that off. Some requests your ${esc(cna().role.toLowerCase())} can take; some need you.</p>
    <p><b>Follow-up.</b> When a patient leaves for the ICU, ED or OR, they're still on your list: call report, update the family, write the note, and call for updates on how they're doing.</p>
    <p><b>Floor calls.</b> The rest of the unit needs you too: a critical lab, a colleague's question, a visitor at the desk. Each is a quick decision on a clock. Let it run out and Nova takes it.</p>
    <p><b>XP, streaks and goals.</b> On-time work and good calls earn care XP. A run of them builds a streak that multiplies it; anything going overdue resets it. Four shift goals, three stars and badges carry across shifts on your career ladder.</p>
    <p><b>People, not just patients.</b> Once someone is stable, talking with them again opens up their story. Trust grows when you listen, answer their call light yourself, or just sit with them, and some of what they tell you matters clinically. The debrief tells you what became of them.</p>
    <p><b>Report.</b> In the last hour, give report to the oncoming nurse on everyone still on the unit. What's pending matters more than what's done.</p>
    <p><b>Consequences.</b> Patients get better or worse based on what you do, and what you don't. The debrief at the end explains why.</p></div>`, `${ui.or ? '<button class="btn" data-act="or-open">Back to orientation</button>' : '<button class="btn" data-act="or-open">Walk me through it</button>'}<button class="btn btn-primary" data-act="close">Got it</button>`);
}
export function ovTerms(gate) {
  const web = /^https?:/.test(location.protocol);
  const sum = `<ul class="terms-sum">${TERMS.summary.map(([h, x]) => `<li><b>${esc(h)}</b> ${esc(x)}</li>`).join('')}</ul>`;
  const full = `<details class="terms-full"><summary>Read the full terms of use</summary>${TERMS.sections.map((sec) => `<h3>${esc(sec.h)}</h3>${sec.p.map((x) => `<p>${esc(x)}</p>`).join('')}`).join('')}<p class="muted">Updated ${esc(TERMS.updated)}. Questions: ${esc(TERMS.contact)}.</p></details>`;
  const links = web ? `<p class="terms-links"><a href="/terms/" target="_blank" rel="noopener">Terms of use</a> · <a href="/privacy/" target="_blank" rel="noopener">Privacy</a></p>` : '';
  const lead = gate ? '<p class="terms-lead">The Shift is a game for practicing nursing judgment. Before you play your first round or shift, please read and agree to the following.</p>' : '<p class="terms-lead">The Shift is a game for practicing nursing judgment, not a guide to caring for real patients.</p>';
  return sheet(gate ? 'Before you play' : 'Terms and disclaimer', `<div class="terms">${lead}${sum}${full}${links}</div>`,
    gate ? `<p class="terms-ok-note">By continuing you confirm you're 18 or older (or playing under an educator's supervision) and agree to the terms of use.</p><button class="btn btn-primary" data-act="terms-ok">I understand and agree</button>` : `<button class="btn btn-primary" data-act="close">Close</button>`,
    gate ? { noClose: true, noScrimClose: true, wide: true, label: 'Before you play: terms of use' } : { wide: true });
}
export function ovHealth() {
  const pm = performance.memory, rs = R.stats ? R.stats() : {}, last = PERF.last || {};
  let err = null; try { err = JSON.parse(localStorage.getItem('theshift.lastError') || 'null'); } catch (e) { /* storage off */ }
  let asy = null; try { asy = JSON.parse(localStorage.getItem('theshift.lastAsync') || 'null'); } catch (e) { /* storage off */ }
  const nodes = document.getElementsByTagName('*').length, save = (() => { try { return Math.round(((localStorage.getItem('theshift.save.v1') || '').length + (localStorage.getItem('theshift.profile.v1') || '').length) / 1024); } catch (e) { return null; } })();
  const row = (k, v, ok) => `<tr><th>${k}</th><td class="${ok === false ? 'ab' : ''}">${v}</td></tr>`;
  const lines = [
    row('Version', esc(String((S.config || {}).version || 'unknown'))),
    row('Frame rate', `${FM.fps} fps${FM.lite ? ' (auto lite)' : ''}`, FM.fps >= 30),
    row('Redraw, last', `${last.total || 0} ms (${last.view || ''}${last.ov ? '/' + last.ov : ''})`, (last.total || 0) < 50),
    row('Redraw, average / worst', `${PERF.avg.toFixed(1)} / ${PERF.worst.toFixed(0)} ms · ${PERF.slow} slow of ${PERF.n}`, PERF.n < 10 || PERF.avg < 30),
    row('Page elements', nodes, nodes < 3000),
    row('Animated characters', `${rs.onscreen || 0} on screen of ${rs.live || 0} · ${rs.fps || 30} fps`),
    row('Memory', pm ? `${(pm.usedJSHeapSize / 1e6).toFixed(1)} MB of ${(pm.jsHeapSizeLimit / 1e6).toFixed(0)} MB` : 'Not reported by this browser', pm ? pm.usedJSHeapSize < 100e6 : undefined),
    row('Saved data', save === null ? 'Storage blocked' : `${save} KB`, save === null ? false : save < 2000),
    row('Browser', esc(navigator.userAgent.replace(/^Mozilla\/5.0 /, '').slice(0, 90))),
    row('Usage data', esc(TEL.status())),
  ];
  const tel = TEL.recent.slice(-8).reverse();
  const detail = `fps ${FM.fps} · redraw avg ${PERF.avg.toFixed(1)} worst ${PERF.worst.toFixed(0)} ms · nodes ${nodes} · heap ${pm ? (pm.usedJSHeapSize / 1e6).toFixed(1) + 'MB' : 'n/a'} · save ${save}KB · ${navigator.userAgent}${err ? `\nlast error ${err.at}: ${err.msg} [${err.act} ${err.view} t=${err.t} ${err.caseId}]\n${err.stack}` : ''}${asy ? `\nlast browser refusal ${asy.at}: ${asy.name} ${asy.msg} [${asy.view}${asy.ov ? '/' + asy.ov : ''} ${asy.caseId}]` : ''}`;
  ui.healthText = detail;
  return sheet('Health check', `<table class="health">${lines.join('')}</table>${err ? `<h3 style="margin:1rem 0 .3rem">Last error</h3><pre class="h-err">${esc(err.at + '\n' + err.msg + '\n' + err.stack)}</pre>` : '<p class="muted">No errors recorded.</p>'}${asy ? `<h3 style="margin:1rem 0 .3rem">Last browser refusal (handled)</h3><pre class="h-err">${esc(asy.at + '\n' + asy.name + ' ' + asy.msg)}</pre>` : ''}${tel.length ? `<h3 style="margin:1rem 0 .3rem">Recent events</h3><pre class="h-err">${esc(tel.map((x) => `${x.at} ${x.event} ${JSON.stringify(x.p).slice(0, 90)}`).join('\n'))}</pre>` : ''}`, `<button class="btn" data-act="health-copy">Copy details</button><button class="btn btn-primary" data-act="close">Close</button>`, { label: 'Health check' });
}
export function ovConfirm() {
  const c = ui.confirm;
  return sheet(c.title, `<p>${esc(c.text)}</p>`, `<button class="btn" data-act="close">Cancel</button><button class="btn ${c.danger ? 'btn-danger' : 'btn-primary'}" data-act="${c.act}">${esc(c.ok)}</button>`);
}

export function toasts() {
  if (!ui.toasts.length || !G.s) return '';
  // One thing at a time: while a tour tip is up, routine messages wait in the phone. Urgent ones still interrupt.
  const touring = (ui.view === 'station' && !seen('coach:station')) || (ui.view === 'room' && !seen('coach:room'));
  // A waiting floor call has its own bar at the top, and a routine message more than 20 minutes old has had its
  // moment: both stay in the phone, neither keeps a toast on screen.
  return `<div class="toasts" aria-live="assertive">${ui.toasts.map((id) => { const m = G.s.inbox.find((x) => x.id === id); if (!m || (m.floor && !m.done) || (!m.urgent && G.s.t - m.t > 20) || (!m.urgent && ui.view === 'station' && window.innerWidth > 700) ||
      (!m.urgent && ui.view === 'room' && (m.pid ? m.pid !== G.s.loc : G.s.t - m.t > 3)) ||   /* in a room, only what's about this patient or just arrived */   /* at the station on a wide screen the phone panel already shows it */
      ((ui.ov || touring) && !m.urgent) || (ui.view === 'station' && !m.urgent && !(m.replies && !m.done))) return '';
    // Routine messages step aside after a few seconds of being seen (they stay in the phone); urgent ones wait for the player.
    if (!m.urgent && !m.toastAt && !(m.replies && !m.done)) { m.toastAt = Date.now(); const expire = () => { if (ui.hold) { setTimeout(expire, 700); return; } if (ui.toasts.includes(m.id)) { ui.toasts = ui.toasts.filter((x) => x !== m.id); if (G.s && ui.view !== 'home' && ui.view !== 'debrief') render(); } }; setTimeout(expire, 7000); }
    const w = who(m.from); const go = m.replies && !m.done ? m.replies[0] : null; return `<div class="toast tap ${m.urgent ? 'urgent' : ''}" role="alert" data-act="msg" data-m="${m.id}">${faceOf(m.from)}<p><b>${esc(w.name)}, ${E.clock(m.t)}</b>${esc(m.text)}</p><span class="tb">${m.bell && go ? m.replies.map((r, i) => `<button class="btn sm" data-act="reply" data-m="${m.id}" data-i="${i}">${esc(r.act === 'bell-cna' ? 'Ask ' + cna().name : r.label)}</button>`).join('') : go && m.replies.length > 1 ? `<button class="btn" data-act="msg" data-m="${m.id}">See replies</button>` : go ? `<button class="btn" data-act="reply" data-m="${m.id}" data-i="0">${esc(go.label.length > 22 ? 'Respond' : go.label)}</button>` : ''}<button class="btn" data-act="toast-x" data-m="${m.id}" aria-label="Dismiss">${ICON.close}</button></span></div>`; }).join('')}</div>`;
}
