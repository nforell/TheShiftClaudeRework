/* The Shift — UI: The end-of-shift debrief, its working, and the NCLEX review tab. */
import { reduced } from './actions.js';
import { learnHTML, rewardHTML } from './awards.js';
import { C, CASES, CJ, E, F, FX, G, NG, RW, STY, def, diffLabel, esc, meta, pface, specOf, ui } from './ctx.js';
import { SPC, SPN, STEPNAME, lastOf, ngnHTML } from './practice.js';
import { trustDots } from './room.js';
import { fbCard } from './sheets.js';

/* ------------ debrief ------------ */
export function storyHTML(o) {
  if (!STY) return ''; const e = STY.epilogue(G.s, C(), def(o.id), G.s.p[o.id], o.tone); if (!e) return '';
  const more = e.total - e.heard;
  return `<div class="st-epi"><div class="st-eh"><span class="st-k">Their story</span>${trustDots(e.trust)}</div><p>${esc(e.text)}</p>${e.learned.length ? `<details><summary>What you learned about them <span class="muted">${e.heard} of ${e.total}</span></summary><ul>${e.learned.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}${more && e.heard ? `<small class="muted">${more} more thing${more === 1 ? '' : 's'} to learn about them on another shift.</small>` : ''}</div>`;
}
/* ------------ debrief: showing the working ------------ */
export const STARS_AT = () => (RW && RW.STARS) || [58, 72, 85];
// Focus practice: the two lowest NCLEX steps under 72 (or the lowest, as a stretch, when none is), two items each.
export function focusPlan(cj) {
  if (!NG || !NG.focus || !cj) return null;
  const key = G.s.caseId + ':' + G.s.t + ':' + G.s.judg.length; if (ui.fx && ui.fx.key === key) return ui.fx;
  const tested = cj.filter((x) => x.score !== null).sort((a, b) => a.score - b.score);
  let weak = tested.filter((x) => x.score < STARS_AT()[1]).slice(0, 2), stretch = false;
  if (!weak.length && tested.length) { weak = tested.slice(0, 1); stretch = true; }
  const its = NG.focus(weak.map((x) => x.id), G.s.caseId, G.prof.ngn, 2, meta(G.s.caseId).sp);
  return (ui.fx = { key, weak: weak.map((x) => ({ id: x.id, label: x.label, score: x.score })), stretch, ids: its.map((x) => x.id) });
}
export const ngnList = () => {
  const q = ui.ngn; if (!q) return [];
  if (q.list === 'focus' && ui.fx) return ui.fx.ids.map((id) => NG.byId(id)).filter(Boolean);
  if (q.list === 'bank' && ui.pset) return ui.pset.ids.map((id) => NG.byId(id)).filter(Boolean);
  if (q.list === 'case') { const c = NG.caseById(q.cs); return c ? c.items : []; }
  return G.s ? NG.items(G.s.caseId) : [];
};
// Ordered-response items start shuffled (never already in order), the same way each time for a given item.
export function orderStart(it) {
  let h = 0; for (const ch of it.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const o = it.opts.map((_, i) => i); for (let i = o.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [o[i], o[j]] = [o[j], o[i]]; }
  if (o.every((x, i) => x === i)) o.push(o.shift());
  return o;
}
export function ngnStart(list, i, extra) {
  ui.ngn = Object.assign({ list, i, a: {}, checked: false }, extra || {});
  const it = ngnList()[i]; if (it && it.type === 'order') ui.ngn.a.o = orderStart(it);
}
export const fmt1 = (n) => (Math.round(n * 10) / 10).toString();
// Under the big number: which skills were averaged, and where the star lines sit.
export function scoreWhyHTML(d) {
  const open = !!ui.scWhy, sc = d.dom.filter((x) => x.score !== null), ST = STARS_AT(), nst = ST.filter((x) => d.overall >= x).length;
  const names = ['Rough shift', 'Getting there', 'Safe, solid shift', 'Charge-nurse material'], harmed = d.outcomes.some((o) => o.tone === 'bad');
  const body = !open ? '' : `<div class="sw-b">
    <p>Your score is the average of the <b>${sc.length} skill area${sc.length === 1 ? '' : 's'}</b> this shift tested. An area is tested when at least one of your decisions falls in it; areas with none are left out so they can't drag you up or down.</p>
    <ul class="sw-sk">${sc.map((x) => `<li><span>${esc(x.label)}</span><b>${x.score}</b></li>`).join('')}</ul>
    <p class="sw-eq">(${sc.map((x) => x.score).join(' + ')}) ÷ ${sc.length} = <b>${d.overall}</b></p>
    <div class="sw-bands" aria-hidden="true"><i class="sw-m" style="left:${Math.max(0, Math.min(100, d.overall))}%"></i>${ST.map((x) => `<span class="sw-t" style="left:${x}%"><b>${x}</b></span>`).join('')}</div>
    <ul class="sw-key">${[0, 1, 2, 3].map((n) => `<li class="${n === nst ? 'on' : ''}"><span>${n ? `${'★'.repeat(n)} ${ST[n - 1]}+` : `Under ${ST[0]}`}</span><b>${names[n]}</b></li>`).join('')}</ul>
    <p>${nst < 3 ? `<b>${ST[nst] - d.overall} more point${ST[nst] - d.overall === 1 ? '' : 's'}</b> would have earned ${nst ? 'the next star' : 'a star'}.` : 'Three stars: the top band.'}${harmed && d.overall >= ST[1] ? ' A patient had a poor outcome, so the title is "Solid, with a miss that mattered" instead.' : !harmed && nst === 0 && d.overall >= 45 ? ' With no patient harmed, a score from 45 is still called "Getting there".' : ''}</p>
    <p>Each skill starts at 60. Strong calls add 6 per point and misses take off 9 per point, then 4.5 per point after the first three. Open any skill or NCLEX step below to see every decision behind its number.</p>
    <p class="muted">The NCLEX steps re-sort the same decisions by clinical judgment step; they don't change this score. The real NCLEX is pass or fail and doesn't report step scores, so treat these as a map of what to study.</p></div>`;
  return `<div class="sc-why"><button class="sw-btn" data-act="sc-why" aria-expanded="${open}">How your ${d.overall} was worked out <span aria-hidden="true">${open ? '▴' : '▾'}</span></button>${body}</div>`;
}
// One skill or step, opened: start at 60, every decision that moved it, and the sum.
export function workHTML(T) {
  const K = E.SCORE, row = (j, cls, val, how) => `<li class="wk ${cls}"><span class="wk-t">${E.clock(j.t)}${j.pid ? ' · ' + esc(j.pid) : ''}</span><span class="wk-x">${esc(j.text)}</span><span class="wk-p"><b>${val}</b><small>${how}</small></span></li>`;
  const pt = (n) => `${fmt1(n)} pt${n === 1 ? '' : 's'}`;
  const minusHow = (m) => m.half && m.full ? `${pt(m.full)} × ${K.BAD} + ${pt(m.half)} × ${K.BAD_AFTER}` : m.full ? `${pt(m.full)} × ${K.BAD}` : `${pt(m.half)} × ${K.BAD_AFTER}, past the first ${K.BAD_FULL}`;
  const rounded = Math.round(T.raw), adj = T.score !== rounded ? (T.score === 100 ? 'capped at 100' : 'raised to the minimum of 5') : T.raw !== rounded ? 'rounded' : '';
  return `<ol class="wk-list"><li class="wk base"><span class="wk-t"></span><span class="wk-x">Everyone starts here</span><span class="wk-p"><b>${K.BASE}</b></span></li>
    ${T.plus.map((x) => row(x.j, 'good', '+' + fmt1(x.add), `${pt(x.pts)} × ${K.GOOD}`)).join('')}
    ${T.minus.map((x) => row(x.j, 'bad', '−' + fmt1(x.sub), minusHow(x))).join('')}
    ${T.notes.map((j) => row(j, 'note', '0', 'noted, not scored')).join('')}</ol>
    <p class="wk-eq">${K.BASE}${T.gain ? ` + ${fmt1(T.gain)}` : ''}${T.pen ? ` − ${fmt1(T.pen)}` : ''} = ${fmt1(T.raw)}${T.raw !== T.score ? ` → <b>${T.score}</b> (${adj})` : ''}</p>
    ${T.badPts > K.BAD_FULL ? `<p class="wk-n muted">Misses past the first ${K.BAD_FULL} points count half, so one bad stretch can't zero a whole area.</p>` : ''}`;
}
export function guideHTML(id) {
  const g = CJ && CJ.GUIDE && CJ.GUIDE[id]; if (!g) return '';
  const fxi = ui.fx ? ui.fx.ids.findIndex((x) => { const it = NG.byId(x); return it && it.step === id; }) : -1;
  return `<div class="gd"><h4>On the NCLEX</h4><p>${esc(g.exam)}</p><h4>Ask yourself</h4><ul>${g.ask.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><h4>Common traps</h4><ul>${g.traps.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>${fxi >= 0 ? `<button class="btn gd-go" data-act="ngn-open" data-list="focus" data-i="${fxi}">Practice this step <span aria-hidden="true">›</span></button>` : ''}</div>`;
}
export function meterHTML(x, T, step, d) {
  ui.mOpen = ui.mOpen || {}; const k = (step ? 'c:' : 'k:') + x.id, open = !!ui.mOpen[k];
  const head = `<div class="l"><span>${x.label}</span><b>${x.score === null ? 'Not tested' : x.score}</b></div><div class="bar" aria-hidden="true"><i style="width:${x.score || 0}%"></i></div><small class="muted">${x.score === null ? 'No decisions fell here this shift' : `${x.good} strong, ${x.bad} missed`}<span class="mt-how">${open ? 'Hide' : x.score === null ? (step ? 'What it means' : '') : 'How it was scored'}</span></small>`;
  if (x.score === null && !step) return `<div class="meter">${head}</div>`;
  return `<div class="meter ${open ? 'open' : ''}"><button class="meter-b" data-act="meter" data-k="${k}" aria-expanded="${open}"${x.what ? ` title="${esc(x.what)}"` : ''}>${head}</button>${open ? `<div class="meter-w">${step && x.what ? `<p class="mw-what">${esc(x.what)}</p>` : ''}${x.score !== null ? workHTML(T) : ''}${step ? guideHTML(x.id) : ''}</div>` : ''}</div>`;
}
export function vDebrief() {
  const d = E.debrief(G.s), cj = CJ ? CJ.score(d.judg) : null; focusPlan(cj);
  if (!ui.mOpen || ui.mOpenFor !== (ui.fx && ui.fx.key)) {   // first look: open the weakest area in each view
    ui.mOpen = {}; ui.mOpenFor = ui.fx && ui.fx.key; ui.debMore = false;
    const low = (L) => L.filter((x) => x.score !== null).sort((a, b) => a.score - b.score)[0];
    const a = low(d.dom), b = cj && low(cj); if (a) ui.mOpen['k:' + a.id] = 1; if (b) ui.mOpen['c:' + b.id] = 1;
  }
  const prior = G.prof.runs.filter((r) => r.caseId === G.s.caseId).slice(1), best = prior.length ? Math.max(...prior.map((r) => r.score)) : null;
  const nextId = CASES[CASES.indexOf(G.s.caseId) + 1], next = nextId ? E.getCase(nextId) : null;
  const items = d.judg.filter((j) => ui.filter === 'all' || (ui.filter === 'good' ? j.delta > 0 : j.delta < 0));
  const nx = NG && CJ && cj ? nclexSummary(cj) : null, tab = nx && ui.dtab === 'nclex' ? 'nclex' : 'shift';
  const tabs = nx ? `<div class="dtabs" role="tablist" aria-label="Debrief">${[['shift', 'Your shift', `${d.outcomes.length} patients`], ['nclex', 'NCLEX review', nx.left ? `${nx.left} question${nx.left === 1 ? '' : 's'} waiting` : 'All answered']].map(([k, l, sub]) => `<button role="tab" id="dt-${k}" class="dtab dt-${k}" aria-selected="${tab === k}" aria-controls="dp" data-act="dtab" data-v="${k}"><b>${l}</b><small>${sub}</small></button>`).join('')}</div>` : '';
  const hero = `<section class="deb-hero"><div><p class="muted" style="margin:0">${esc(C().title)} debrief, ${E.clock(0)} to ${E.clock(G.s.t)}</p><h1>${esc(d.rating)}</h1><p class="muted" style="max-width:52ch">${G.s.t < C().length - 30 ? `You ended the shift early, at ${E.clock(G.s.t)}. ` : ''}What happened to your patients, and the calls behind it.</p></div>
    <div class="deb-score"><span class="num" data-to="${d.overall}">${d.overall}</span><small>out of 100${best !== null ? `. Your best: ${best}` : ''}</small></div></section>`;
  if (tab === 'nclex') return `<main><div class="deb">${hero}${tabs}<div id="dp" role="tabpanel" aria-labelledby="dt-nclex">${nclexTab(d, cj, nx, next, nextId)}</div>${fbCard()}</div></main>`;
  return `<main><div class="deb">
    ${hero}${tabs}<div id="dp" role="tabpanel" aria-labelledby="dt-shift">
    ${(() => { const hurt = (j) => (d.outcomes.find((o) => o.id === j.pid) || {}).tone === 'bad' ? 0 : 1, neg = d.judg.filter((j) => j.delta < 0), real = neg.filter((j) => !/-unseen$/.test(j.key || '')), w = (real.length ? real : neg).sort((a, b) => hurt(a) - hurt(b) || a.delta - b.delta || a.t - b.t)[0], pos = d.judg.filter((j) => j.delta > 0 && !(j.pid && (d.outcomes.find((o) => o.id === j.pid) || {}).tone === 'bad')), g = pos.sort((a, b) => (a.domain === 'priority') - (b.domain === 'priority') || b.delta - a.delta || a.t - b.t)[0]; return w || g ? `<section class="keyline">${w ? `<div class="kl bad"><span class="mk">The decision that mattered most</span><b>${esc(w.text)}</b><p>${esc(w.why)}</p></div>` : ''}${g ? `<div class="kl good"><span class="mk">Your best call</span><b>${esc(g.text)}</b></div>` : ''}</section>` : ''; })()}
    ${(() => { if (!STY) return ''; const n = d.outcomes.filter((o) => { const e = STY.epilogue(G.s, C(), def(o.id), G.s.p[o.id], o.tone); return e && !e.heard && e.total && !e.trust; }).length; return n ? `<p class="muted st-note">You didn't get time to sit and talk with ${n === d.outcomes.length ? 'your patients' : n === 1 ? 'one of your patients' : n + ' of your patients'} this shift, so ${n === 1 ? 'that story stays' : 'their stories stay'} short. "Sit and talk" in a room, once they're stable, fills them in.</p>` : ''; })()}
    <section class="outs" aria-label="Patient outcomes">${d.outcomes.map((o) => `<div class="out">${pface(o.id)}<div><span class="tone ${o.tone}">${{ good: 'Good outcome', mixed: 'Mixed outcome', bad: 'Poor outcome' }[o.tone]}</span><h3>${def(o.id).room} ${esc(def(o.id).short)}: ${esc(o.title)}</h3><p>${esc(o.text)}</p>${storyHTML(o)}${o.next ? `<details class="nx"><summary>What happened next in ${esc(F.where(o.next.unit))}</summary><ol class="aw-tl">${o.next.entries.map((e) => `<li class="${e.after ? 'after' : ''}"><span class="aw-tm">${e.after ? 'After your shift' : E.clock(e.t)}</span><span class="pill af-${e.st}">${F.ST[e.st]}</span><p>${esc(e.text)}</p></li>`).join('')}${o.next.later ? `<li class="after"><span class="aw-tm">Later</span><span></span><p>${esc(o.next.later)}</p></li>` : ''}</ol></details>` : ''}</div></div>`).join('')}</section>
    <div class="deb-acts">${nx ? `<button class="btn btn-nx" data-act="dtab" data-v="nclex"><span><b>NCLEX review</b><small>${nx.left ? `${nx.left} question${nx.left === 1 ? '' : 's'} from this shift and your weakest steps` : 'Your steps, step by step'}</small></span> <span aria-hidden="true">→</span></button>` : ''}${next && d.overall >= 58 ? `<button class="btn btn-primary btn-go btn-next" data-act="next-case" data-id="${nextId}"><span><b>Next: ${esc(next.title)}</b><small>${esc(specOf(nextId).name)} · ${esc(diffLabel(nextId))}</small></span> <span aria-hidden="true">→</span></button><button class="btn" data-act="new">Play this shift again</button>` : `<button class="btn btn-primary btn-go" data-act="new">Play the shift again <span aria-hidden="true">→</span></button>${next ? `<button class="btn btn-next" data-act="next-case" data-id="${nextId}"><span><b>Or try ${esc(next.title)}</b><small>${esc(specOf(nextId).name)} · ${esc(diffLabel(nextId))}</small></span></button>` : ''}`}<button class="btn btn-quiet" data-act="home">Home</button></div>
    ${nx ? nclexCta(nx) : ''}
    <button class="deb-more-b" data-act="deb-more" aria-expanded="${!!ui.debMore}"><span><b>${ui.debMore ? 'Hide the detail' : `Every moment that mattered${d.judg && d.judg.length ? ` (${d.judg.length})` : ''}`}</b><small>Each decision with the time and the evidence, plus how the score was built, your skills, XP and lessons</small></span><span class="deb-more-c" aria-hidden="true">${ui.debMore ? '−' : '+'}</span></button>
    ${!ui.debMore ? '' : `<div class="deb-more">
    ${scoreWhyHTML(d)}
    ${rewardHTML()}${learnHTML()}
    <div class="deb-grid">
      <section aria-labelledby="dh"><div class="by-h"><h2 id="dh">By skill</h2>${nx ? `<button class="btn btn-quiet by-nx" data-act="dtab" data-v="nclex">By NCLEX step <span aria-hidden="true">›</span></button>` : ''}</div>
        <p class="muted by-n">Tap a skill to see every decision behind its number.</p>
        ${d.dom.map((x) => meterHTML(x, E.tally(d.judg.filter((j) => j.domain === x.id)), false, d)).join('')}
        <p class="muted" style="font-size:.85rem">Nova hints used: ${(C().novaCredits || 3) - G.s.nova} of ${C().novaCredits || 3}.</p>
        
      </section>
      <section aria-labelledby="mh"><h2 id="mh">Moments that mattered</h2>
        <div class="filter" role="group" aria-label="Filter moments">${[['all', 'All'], ['good', 'What went well'], ['bad', 'What to rethink']].map(([k, l]) => `<button class="btn ${ui.filter === k ? 'btn-primary' : ''}" data-act="filter" data-k="${k}" aria-pressed="${ui.filter === k}">${l}</button>`).join('')}</div>
        <ul class="moments">${items.map((j) => `<li class="${j.delta > 0 ? 'good' : j.delta < 0 ? 'bad' : 'neutral'}"><span class="tm">${E.clock(j.t)}${j.pid ? '<br>' + j.pid : ''}</span><div><span class="mk">${j.delta > 0 ? 'Strong' : j.delta < 0 ? 'Rethink' : 'Note'}${CJ ? `<span class="cj-tag"> · ${esc(CJ.STEPS.find((x) => x[0] === CJ.step(j))[1])}</span>` : ''}</span><b>${esc(j.text)}</b><p>${esc(j.why)}</p><button class="rpt-btn" data-act="rpt" data-k="${esc(j.key || '')}" data-t="${j.t}" aria-label="Report a problem with this feedback">Report a problem</button></div></li>`).join('') || '<li><span></span><span class="muted">Nothing here.</span></li>'}</ul>
      </section>
    </div></div>`}${nx ? '' : ngnHTML()}</div>${fbCard()}</div></main>`;
}

/* ------------ debrief: the NCLEX review tab ------------ */
// What's waiting: this shift's items and focus items not yet answered, and the weakest step.
export function nclexSummary(cj) {
  const done = G.prof.ngn || {}, shiftIts = NG.items(G.s.caseId), fx = ui.fx, fits = fx ? fx.ids.map((id) => NG.byId(id)).filter(Boolean) : [];
  const tested = cj.filter((x) => x.score !== null).sort((a, b) => a.score - b.score);
  const all = shiftIts.concat(fits), left = all.filter((x) => !done[x.id]).length;
  const got = all.reduce((n, x) => n + (done[x.id] ? lastOf(done[x.id]) : 0), 0), mx = all.reduce((n, x) => n + NG.max(x), 0);
  const cases = NG.cases ? NG.cases().filter((c) => c.sp === meta(G.s.caseId).sp) : [];
  return { shiftIts, fits, all, left, got, mx, weak: tested[0] || null, strong: tested.length > 1 ? tested[tested.length - 1] : null, tested, cases };
}
export const cjTone = (sc) => (sc === null ? 'na' : sc >= STARS_AT()[1] ? 'hi' : sc >= STARS_AT()[0] ? 'mid' : 'lo');
export function cjStrip(cj, nx, act) {
  return `<ol class="cj-strip">${cj.map((x, i) => `<li><button class="cj-c t-${cjTone(x.score)} ${nx.weak && nx.weak.id === x.id ? 'weak' : ''}" ${act ? `data-act="cj-go" data-v="${x.id}"` : 'data-act="dtab" data-v="nclex"'} aria-label="${esc(x.label)}: ${x.score === null ? 'not tested' : x.score + ' of 100'}"><span class="cj-n">${i + 1}</span><span class="cj-l">${esc(x.label)}</span><b class="cj-s">${x.score === null ? '–' : x.score}</b><span class="cj-b" aria-hidden="true"><i style="width:${x.score || 0}%"></i></span>${nx.weak && nx.weak.id === x.id ? '<span class="cj-w">Weakest</span>' : ''}</button></li>`).join('')}</ol>`;
}
export function nclexCta(nx) {
  const w = nx.weak;
  return `<section class="nx-cta" aria-labelledby="nxh"><div class="nx-ct"><p class="nx-k">NCLEX review</p><h2 id="nxh">${w ? `Your weakest NCLEX step this shift: ${esc(w.label)} (${w.score}).` : 'See this shift through the NCLEX lens.'}</h2><p>${nx.left ? `${nx.left} practice question${nx.left === 1 ? '' : 's'} in Next Generation NCLEX formats are waiting: ${nx.shiftIts.length} from this shift${nx.fits.length ? ` and ${nx.fits.length} aimed at your weakest step${nx.fits.length > 2 ? 's' : ''}` : ''}.` : `You've answered every question for this shift: ${nx.got} of ${nx.mx} points.`}</p></div>
    ${cjStrip(CJ.score(E.debrief(G.s).judg), nx, false)}
    <button class="btn btn-primary btn-go nx-go" data-act="dtab" data-v="nclex">Open NCLEX review <span aria-hidden="true">→</span></button></section>`;
}
export function nclexTab(d, cj, nx, next, nextId) {
  const done = G.prof.ngn || {}, fx = ui.fx;
  const why = fx && fx.weak.length ? (fx.stretch ? `None of your steps fell below ${STARS_AT()[1]}. These stretch questions aim at your lowest, <b>${esc(fx.weak[0].label)}</b> (${fx.weak[0].score}).` : `Aimed at ${fx.weak.map((w) => `<b>${esc(w.label)}</b> (${w.score})`).join(' and ')}, using clients from other units so you practice the thinking, not the patient.`) : '';
  const qcard = (it, i, list) => { const r = done[it.id]; return `<li><button class="nq ${r ? (lastOf(r) === r.max ? 'full' : 'part') : ''}" data-act="ngn-open" data-list="${list}" data-i="${i}"><span class="nq-n">${i + 1}</span><span class="nq-t"><b>${esc(NG.TYPE[it.type])}${it.ch ? ' <span class="ng-ch">NCLEX challenge</span>' : ''}</b><small>Tests ${esc(STEPNAME(it.step))}${it.cn && NG.CN ? ` · ${esc((NG.CN.find((c) => c[0] === it.cn) || [])[1] || '')}` : ''}</small></span><span class="nq-s">${r ? `${lastOf(r)} of ${r.max}` : 'Start'} <span aria-hidden="true">›</span></span></button></li>`; };
  const pct = nx.mx ? Math.round(nx.got / nx.mx * 100) : 0, answered = nx.all.length - nx.left;
  const misses = nx.tested.filter((x) => x.bad).slice(0, 3);
  const cs = nx.cases.map((c) => ({ c, a: c.items.filter((x) => done[x.id]).length })).sort((a, b) => (a.a === 6) - (b.a === 6) || b.a - a.a).slice(0, 3);
  return `<section class="nx-tab">
    <div class="nx-head"><h2>This shift, the way the NCLEX thinks</h2><p class="muted">The Next Generation NCLEX is built on the NCSBN Clinical Judgment Measurement Model: six steps from noticing cues to checking whether it worked. Every decision you made this shift is filed under one of them. These step scores are a study map, not a pass prediction; the real exam is pass or fail.</p></div>
    ${cjStrip(cj, nx, true)}
    <div class="nx-plan"><h3>Your NCLEX plan for this shift</h3><ol>
      <li class="${nx.shiftIts.every((x) => done[x.id]) ? 'done' : ''}"><b>Answer this shift's ${nx.shiftIts.length} questions.</b> Same patients, exam format.</li>
      ${nx.fits.length ? `<li class="${nx.fits.every((x) => done[x.id]) ? 'done' : ''}"><b>Focus on ${fx && fx.weak.length ? esc(fx.weak.map((w) => w.label).join(' and ')) : 'your weakest step'}.</b> ${nx.fits.length} questions from other units.</li>` : ''}
      <li><b>Read how each step works below</b>, especially the traps.</li>
      ${cs.length ? `<li><b>Then try a ${esc(SPN[nx.cases[0].sp] || '')} case study</b>, one client through all six steps.</li>` : ''}
    </ol><div class="nx-prog"><span><b>${answered} of ${nx.all.length}</b> answered</span><span class="nx-pb" aria-hidden="true"><i style="width:${nx.all.length ? answered / nx.all.length * 100 : 0}%"></i></span><span>${answered ? `${pct}% of points` : ''}</span></div></div>
    <div class="nx-qs">
      <section><h3 class="nx-h">From this shift</h3><p class="muted nx-sub">Built on the patients you just cared for.</p><ol class="nq-list">${nx.shiftIts.map((it, i) => qcard(it, i, 'shift')).join('')}</ol></section>
      ${nx.fits.length ? `<section><h3 class="nx-h">Focus practice</h3><p class="muted nx-sub ngn-fx">${why}</p><ol class="nq-list">${nx.fits.map((it, i) => qcard(it, i, 'focus')).join('')}</ol></section>` : ''}
    </div>
    ${misses.length ? `<section class="nx-miss"><h3 class="nx-h">Where your thinking slipped</h3><ul>${misses.map((x) => { const j = x.js.filter((y) => y.delta < 0).sort((a, b) => a.delta - b.delta)[0]; return j ? `<li><span class="nm-s t-${cjTone(x.score)}">${esc(x.label)}</span><b>${esc(j.text)}</b><p>${esc(j.why)}</p></li>` : ''; }).join('')}</ul></section>` : ''}
    <section class="nx-steps" id="nx-steps"><h3 class="nx-h">Step by step</h3><p class="muted nx-sub">Tap a step to see every decision behind its number, how the exam tests it, the questions to ask yourself and the common traps.</p>
      ${cj.map((x) => meterHTML(x, E.tally(x.js), true, d)).join('')}</section>
    <section class="nx-more"><h3 class="nx-h">Keep going</h3><div class="nx-mg">
      ${cs.map(({ c, a }) => `<button class="pc sp-${SPC[c.sp] || 'ms'}" data-act="cs-open" data-id="${c.id}"><span class="pc-u">Case study · ${esc(SPN[c.sp] || '')}</span><b class="pc-t">${esc(c.title)}</b><span class="pc-c">${esc(c.client)}</span><span class="pc-f"><span>${a ? (a === 6 ? 'Finished' : `${a} of 6 answered`) : '6 questions'}</span><span class="pc-go">${a === 6 ? 'Retry' : a ? 'Continue' : 'Start'} ›</span></span></button>`).join('')}
      ${NG.bank ? `<button class="pc nx-hub" data-act="practice"><span class="pc-u">NCLEX practice</span><b class="pc-t">${NG.count.cases()} case studies, ${NG.count.bank()} questions</b><span class="pc-c">Filter by Client Needs, judgment step and format, and see your readiness by category.</span><span class="pc-f"><span></span><span class="pc-go">Open ›</span></span></button>` : ''}
    </div></section>
    <div class="nx-nav"><button class="btn" data-act="dtab" data-v="shift"><span aria-hidden="true">←</span> Back to your shift</button>${next ? `<button class="btn" data-act="next-case" data-id="${nextId}">Next: ${esc(next.title)}</button>` : ''}<button class="btn btn-quiet" data-act="home">Home</button></div>
  </section>`;
}

/* Debrief pays off: score counts up, meters fill, outcomes land one by one. */
export function debriefAnim(root) {
  if (ui.view !== 'debrief' || ui.debDone) return; ui.debDone = true;
  const n = root.querySelector('.deb-score .num'); if (!n) return;
  const to = +n.dataset.to, t0 = performance.now(), dur = reduced() ? 1 : 1100;
  root.querySelectorAll('.meter .bar i').forEach((b) => { const w = b.style.width; b.style.width = '0'; requestAnimationFrame(() => requestAnimationFrame(() => { b.style.width = w; })); });
  // The score lands as itself: a counting number passes through values that look like a different score ("82... 83").
  const tick = () => { n.textContent = to; n.classList.remove('pop'); void n.offsetWidth; n.classList.add('pop'); setTimeout(() => FX.play(to >= 72 ? 'right' : 'commit'), reduced() ? 0 : 420); };
  const r = G.s && G.s.reward; if (r && !reduced()) { for (let i = 0; i < r.stars; i++) setTimeout(() => FX.play('star'), 1300 + i * 380); if (r.lvAfter.n > r.lvBefore.n) setTimeout(() => FX.play('levelup'), 2900); else if (r.earned.length) setTimeout(() => FX.play('right'), 2900); }
  requestAnimationFrame(tick); setTimeout(() => { n.textContent = to; }, dur + 120);   // rAF can stall in a background tab; never leave the count short
}
