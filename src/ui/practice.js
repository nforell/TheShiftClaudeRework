/* The Shift — UI: NCLEX-style practice: items after the shift, case studies, the question bank, and the pocket reference. */
import { CJ, G, NG, S, TEL, TERMS, buildTag, esc, ui } from './ctx.js';
import { STARS_AT, ngnList, ngnStart } from './debrief.js';
import { sheet } from './sheets.js';

/* ------------ NCLEX-style practice items ------------ */
export const STEPNAME = (id) => (CJ ? (CJ.STEPS.find((x) => x[0] === id) || [])[1] : '') || '';
export function ngnRow(it, i, list) {
  const dn = (G.prof.ngn || {})[it.id];
  return `<li><button class="ngn-row" data-act="ngn-open" data-list="${list}" data-i="${i}"><span class="ngn-n">${i + 1}</span><span class="ngn-t"><b>${esc(NG.TYPE[it.type])}${it.ch ? ' <span class="ng-ch">NCLEX challenge</span>' : ''}</b><small>${esc(STEPNAME(it.step))}</small></span><span class="ngn-sc ${dn ? '' : 'ngn-go'}">${dn ? `${dn.score} of ${dn.max}` : 'Start'} <span aria-hidden="true">›</span></span></button></li>`;
}
export function ngnHTML() {
  if (!NG || !G.s) return ''; const its = NG.items(G.s.caseId); if (!its.length) return '';
  const fx = ui.fx, fits = fx ? fx.ids.map((id) => NG.byId(id)).filter(Boolean) : [];
  const why = fx && fx.weak.length ? (fx.stretch ? `None of your NCLEX steps fell below ${STARS_AT()[1]} this shift. These stretch questions aim at your lowest, <b>${esc(fx.weak[0].label)}</b> (${fx.weak[0].score}).` : `Your lowest NCLEX step${fx.weak.length > 1 ? 's' : ''} this shift: ${fx.weak.map((w) => `<b>${esc(w.label)}</b> (${w.score})`).join(' and ')}. These questions, from other units, practice the same thinking.`) : '';
  return `<section class="ngn-sec" aria-labelledby="ngh"><div class="ngn-h"><h2 id="ngh">Practice questions</h2><p class="muted">In the formats the Next Generation NCLEX uses, scored the way NCSBN scores them. Every answer comes with the reasoning behind each option.</p></div>
    <h3 class="ngn-sub">From this shift</h3><ol class="ngn-list">${its.map((it, i) => ngnRow(it, i, 'shift')).join('')}</ol>
    ${fits.length ? `<h3 class="ngn-sub">Focus practice</h3><p class="ngn-fx">${why}</p><ol class="ngn-list">${fits.map((it, i) => ngnRow(it, i, 'focus')).join('')}</ol>` : ''}</section>`;
}
export function ovNgn() {
  const its = ngnList(), q = ui.ngn, it = its[q.i], a = q.a, ck = q.checked, W = NG.whys(it);
  if (!it) { ui.ov = null; return ''; }
  const mark = (ok, on) => (!ck ? '' : ok ? ' right' : on ? ' wrong' : '');
  // After checking: the reason for an option, styled by whether you chose it and whether it was right.
  const rw = (txt, ok, on) => (!ck || !txt ? '' : `<small class="nb-why ${ok ? 'y' : 'n'}${on ? ' you' : ''}">${on ? '<i>Your choice</i>' : ok ? '<i>You missed this</i>' : ''}${esc(txt.replace(/^(Yes|No):\s*/, '').replace(/^[a-z]/, (c) => c.toUpperCase()))}</small>`);
  const stp = CJ ? CJ.STEPS.find((x) => x[0] === it.step) : null;
  const cnl = it.cn && NG.CN ? (NG.CN.find((x) => x[0] === it.cn) || [])[1] : '';
  let body = `<p class="ngn-tag">${it.ch ? '<span class="ng-ch">NCLEX challenge</span> ' : ''}${esc(NG.TYPE[it.type])}${stp ? ` · Tests <b>${esc(stp[1])}</b>` : ''}${cnl ? ` · ${esc(cnl)}` : ''}${q.list === 'focus' ? ' · Focus practice' : ''}</p>${it.update ? `<p class="cs-up">${esc(it.update)}</p>` : ''}<p class="ngn-stem">${esc(it.stem)}</p><p class="ngn-q"><b>${esc(it.q)}</b></p>`;
  if (it.type === 'mc') {
    body += `<div class="ngn-opts" role="radiogroup">${it.opts.map((o, i) => { const on = a.m === i; return `<div class="nb-w"><button class="nb-opt rd${on ? ' on' : ''}${mark(o.ok, on)}" data-act="ngn-pick" data-k="m" data-v="${i}" role="radio" aria-checked="${on}" ${ck ? 'disabled' : ''}>${esc(o.t)}</button>${rw(W.opts[i], o.ok, on)}</div>`; }).join('')}</div>`;
  } else if (it.type === 'order') {
    const o = a.o || [];
    body += `<p class="muted ord-h">${ck ? 'Your order, with the correct position for anything out of place:' : 'Put the steps in order, first at the top. Use the arrows to move a step.'}</p><ol class="ord">${o.map((x, k) => `<li class="${ck ? (x === k ? 'right' : 'wrong') : ''}"><span class="ord-n">${k + 1}</span><span class="ord-t">${esc(it.opts[x])}${ck && x !== k ? `<small>Belongs at step ${x + 1}</small>` : ''}</span>${ck ? '' : `<span class="ord-b"><button class="icon-btn" data-act="ngn-move" data-k="${k}" data-d="-1" aria-label="Move up" ${k ? '' : 'disabled'}>▲</button><button class="icon-btn" data-act="ngn-move" data-k="${k}" data-d="1" aria-label="Move down" ${k < o.length - 1 ? '' : 'disabled'}>▼</button></span>`}</li>`).join('')}</ol>`;
    if (ck) body += `<h4 class="ord-c">The correct order</h4><ol class="nb-whys">${it.opts.map((t, i) => `<li><b>${esc(t)}</b>${rw(W.steps[i], true, true).replace('<i>Your choice</i>', '')}</li>`).join('')}</ol>`;
  } else if (it.type === 'num') {
    body += `<div class="num-in"><label for="ngn-num" class="sr">Your answer in ${esc(it.unit)}</label><input id="ngn-num" class="fb-t" inputmode="decimal" autocomplete="off" data-bind="ngn.n" value="${esc(a.n || '')}" ${ck ? 'disabled' : ''} placeholder="Answer"><span class="num-u">${esc(it.unit)}</span></div><p class="muted num-r">${esc(it.round || '')}</p>`;
    if (ck) body += `<h4 class="ord-c">Working it out</h4><ol class="num-w">${(it.work || []).map((w) => `<li>${esc(w)}</li>`).join('')}</ol>`;
  }
  if (it.type === 'bowtie') {
    const wk = { a: 'actions', c: 'cond', p: 'params' };
    const col = (k, lab, g, multi) => `<div class="bt-col bt-${k}"><h4>${lab}</h4>${g.opts.map((o, i) => { const on = multi ? (a[k] || []).includes(i) : a[k] === i, ok = multi ? g.ans.includes(i) : g.ans === i; return `<div class="nb-w"><button class="nb-opt${on ? ' on' : ''}${mark(ok, on)}" data-act="ngn-pick" data-k="${k}" data-v="${i}" aria-pressed="${on}" ${ck ? 'disabled' : ''}>${esc(o)}</button>${rw((W[wk[k]] || [])[i], ok, on)}</div>`; }).join('')}</div>`;
    body += `<div class="bowtie">${col('a', 'Actions to take (choose 2)', it.actions, true)}${col('c', 'Most likely condition (choose 1)', it.cond, false)}${col('p', 'Parameters to monitor (choose 2)', it.params, true)}</div>`;
  } else if (it.type === 'matrix') {
    body += `<div class="tbl-wrap"><table class="ngn-mx"><thead><tr><th></th>${it.cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${it.rows.map((r, ri) => `<tr><td class="wrap">${esc(r.t)}${ck ? `<small class="muted ngn-why">${esc(r.why)}</small>` : ''}</td>${it.cols.map((c, ci) => { const on = (a.r || [])[ri] === ci; return `<td><button class="nb-cell${on ? ' on' : ''}${mark(r.ans === ci, on)}" data-act="ngn-pick" data-k="r" data-row="${ri}" data-v="${ci}" aria-pressed="${on}" aria-label="${esc(c)}" ${ck ? 'disabled' : ''}>${on ? '●' : ''}</button></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`;
  } else if (it.type === 'sata') {
    body += `<div class="ngn-opts">${it.opts.map((o, i) => { const on = (a.s || []).includes(i); return `<div class="nb-w"><button class="nb-opt sq${on ? ' on' : ''}${mark(o.ok, on)}" data-act="ngn-pick" data-k="s" data-v="${i}" aria-pressed="${on}" ${ck ? 'disabled' : ''}>${esc(o.t)}</button>${rw(W.opts[i], o.ok, on)}</div>`; }).join('')}</div>`;
  } else if (it.type === 'highlight') {
    body += `<p class="ngn-note">${it.parts.map((o, i) => { const on = (a.s || []).includes(i); return `<button class="nb-hl${on ? ' on' : ''}${mark(o.ok, on)}" data-act="ngn-pick" data-k="s" data-v="${i}" aria-pressed="${on}" ${ck ? 'disabled' : ''}>${esc(o.t)}</button>`; }).join(' ')}</p>`;
    if (ck) body += `<ol class="nb-whys">${it.parts.map((o, i) => { const on = (a.s || []).includes(i); return `<li><b>${esc(o.t)}</b>${rw(W.parts[i], o.ok, on)}</li>`; }).join('')}</ol>`;
  } else if (it.type === 'cloze') {
    let k = 0; body += `<p class="ngn-cloze">${it.parts.map((p) => { if (typeof p === 'string') return esc(p); const bi = k++; return `<span class="ngn-blank">${p.opts.map((o, oi) => { const on = (a.d || [])[bi] === oi; return `<button class="nb-chip${on ? ' on' : ''}${mark(p.ans === oi, on)}" data-act="ngn-pick" data-k="d" data-row="${bi}" data-v="${oi}" aria-pressed="${on}" ${ck ? 'disabled' : ''}>${esc(o)}</button>`; }).join('')}</span>`; }).join('')}</p>`;
    if (ck) { let bi = 0; body += `<ol class="nb-whys">${it.parts.filter((p) => typeof p !== 'string').map((p) => { const k2 = bi++, v = (a.d || [])[k2]; return `<li><b>Blank ${k2 + 1}</b>${p.opts.map((o, oi) => (oi === p.ans || oi === v) ? `<span class="nb-bl"><em>${esc(o)}</em>${rw((W.blanks[k2] || [])[oi], oi === p.ans, oi === v)}</span>` : '').join('')}</li>`; }).join('')}</ol>`; }
  }
  if (ck) {
    const B = NG.breakdown(it, a), sc = B.score, mx = B.max;
    const pts = (n) => (n > 0 ? '+' + n : n < 0 ? '−' + -n : '0');
    const brows = B.rows.map((r) => `<tr class="${r.pts > 0 ? 'y' : r.pts < 0 ? 'n' : r.missed ? 'm' : 'z'}"><td>${esc(r.part)}</td><td>${B.pm ? (r.missed ? 'Not chosen (correct)' : r.ok ? 'Chosen, correct' : 'Chosen, incorrect') : `${esc(r.pick || '—')}${!r.ok && r.want ? `<small>Correct: ${esc(r.want)}</small>` : ''}`}</td><td class="n">${pts(r.pts)}</td></tr>`).join('');
    body += `<div class="ngn-res ${sc === mx ? 'full' : sc ? 'part' : 'none'}">
      <div class="nr-h"><b>${sc} of ${mx} points</b><span>${esc(B.math)}${B.pm && B.rows.some((r) => r.missed) ? `; ${B.rows.filter((r) => r.missed).length} correct option${B.rows.filter((r) => r.missed).length === 1 ? '' : 's'} not chosen` : ''}</span></div>
      ${B.all ? '' : `<div class="tbl-wrap"><table class="nr-t"><thead><tr><th>${it.type === 'matrix' ? 'Row' : B.pm ? 'Option' : 'Part'}</th><th>${B.pm ? 'Your answer' : 'You chose'}</th><th class="n">Points</th></tr></thead><tbody>${brows || `<tr><td colspan="3" class="muted">Nothing chosen.</td></tr>`}</tbody></table></div>`}
      <p class="nr-rule">${esc(B.rule)}</p>
      <h4>The reasoning</h4><p>${esc(it.why)}</p>
      ${W.tip ? `<p class="nr-tip"><b>Test-taking tip.</b> ${esc(W.tip)}</p>` : ''}
      ${stp ? `<p class="nr-step muted">This question tests <b>${esc(stp[1])}</b>: ${esc(stp[2])}</p>` : ''}</div>`;
  }
  const last = q.i === its.length - 1;
  const done = q.list === 'case' ? `<button class="btn btn-primary" data-act="cs-done">See how you did</button>` : q.list === 'bank' ? `<button class="btn btn-primary" data-act="pset-done">See your set</button>` : `<button class="btn btn-primary" data-act="close">Done</button>`;
  const foot = !ck ? `<button class="btn btn-primary" data-act="ngn-check" ${NG.complete(it, a) ? '' : `aria-disabled="true" data-why="${it.type === 'num' ? 'Type a number first.' : 'Answer every part first.'}"`}>Check answer</button>` : last ? done : `<button class="btn btn-primary" data-act="ngn-go" data-list="${q.list || 'shift'}" data-i="${q.i + 1}">Next question</button>`;
  if (q.list === 'case') {
    const c = NG.caseById(q.cs);
    return sheet(`${esc(c.title)} · ${q.i + 1} of 6`, `<div class="cs-wrap">${recordHTML(c, q.i)}<div class="cs-q">${body}</div></div>`, foot, { wide: true, label: 'Case study question', cls: 'cs-sheet' });
  }
  body += `<p class="ngn-rpt"><button class="rpt-btn" data-act="rpt" data-q="${esc(it.id)}">Report a problem with this question</button></p>`;
  return sheet(`Question ${q.i + 1} of ${its.length}: ${esc(NG.TYPE[it.type])}`, body, foot, { wide: true, label: 'Practice question' });
}

/* ------------ NCLEX practice: case studies, question bank, readiness ------------ */
export const CNL = (id) => (NG && NG.CN ? (NG.CN.find((x) => x[0] === id) || [])[1] : '') || '';
export const SPN = { ms: 'Med-surg', sd: 'Step-down', icu: 'ICU', ld: 'Labor and delivery', ed: 'Emergency', ob: 'Maternity', peds: 'Pediatrics', psy: 'Adult psych', teen: 'Teen psych', comm: 'Community', periop: 'Perioperative' };
export const SPC = { ms: 'ms', sd: 'sd', icu: 'icu', ld: 'ld', ed: 'ed', ob: 'ob', peds: 'peds', psy: 'psy', teen: 'teen', comm: 'ms', periop: 'ms' };
// The chart for a case-study item: every entry that has appeared by now, by tab; what just appeared is marked New.
export function recordHTML(c, i) {
  const vis = c.record.filter((r) => r.at <= i), tabs = []; vis.forEach((r) => { if (!tabs.includes(r.tab)) tabs.push(r.tab); });
  const fresh = vis.filter((r) => r.at === i && i > 0), pick = (ui.ngn && ui.ngn.tab && tabs.includes(ui.ngn.tab)) ? ui.ngn.tab : (fresh[0] || vis[vis.length - 1]).tab;
  const ent = vis.filter((r) => r.tab === pick);
  const one = (r) => `<div class="rec-e${r.at === i && i > 0 ? ' new' : ''}"><div class="rec-t">${esc(r.time)}${r.at === i && i > 0 ? '<span class="rec-new">New</span>' : ''}</div>${r.text ? `<p>${esc(r.text)}</p>` : ''}${r.rows ? `<table class="rec-tb"><tbody>${r.rows.map((x) => `<tr class="${x[2] ? 'ab' : ''}"><th>${esc(x[0])}</th><td>${esc(x[1])}${x[2] ? ` <small>${esc(x[2])}</small>` : ''}</td></tr>`).join('')}</tbody></table>` : ''}</div>`;
  return `<aside class="cs-rec" aria-label="Medical record"><p class="rec-who"><b>${esc(c.client)}</b></p><div class="rec-tabs" role="tablist">${tabs.map((t) => `<button role="tab" aria-selected="${t === pick}" data-act="cs-tab" data-v="${esc(t)}">${esc(t)}${fresh.some((r) => r.tab === t) ? '<i aria-label="new"></i>' : ''}</button>`).join('')}</div><div class="rec-b">${ent.slice().reverse().map(one).join('')}</div></aside>`;
}
export const pRec = (id) => (G.prof.ngn || {})[id];
export const lastOf = (r) => (r.last != null ? r.last : r.score);
export function pStats() {
  const by = { cn: {}, step: {} }; let pts = 0, max = 0, n = 0;
  Object.entries(G.prof.ngn || {}).forEach(([id, r]) => { const it = NG.byId(id); if (!it) return; const l = lastOf(r); n++; pts += l; max += r.max;
    [['cn', it.cn], ['step', it.step]].forEach(([k, v]) => { if (!v) return; const o = (by[k][v] = by[k][v] || { pts: 0, max: 0, n: 0 }); o.pts += l; o.max += r.max; o.n++; }); });
  return { by, pts, max, n };
}
export function qTitle(x) {
  if (!G.qtDup) { const n = {}; NG.bank().forEach((q) => { const k = q.topic || ''; n[k] = (n[k] || 0) + 1; }); G.qtDup = n; }
  const t = x.topic || NG.TYPE[x.type]; if (!x.topic || G.qtDup[x.topic] < 2) return t;
  const st = String(x.stem || x.q || '').replace(/<[^>]+>/g, ''), m = /^(?:An?|The)\s+([^,.;:]{4,48}?)(?:\s+(?:is|was|has|who|with|in|on|at|comes|arrives|returns)\b|[,.;:])/i.exec(st);
  return `${t}: ${m ? m[1].replace(/\s+$/, '') : NG.TYPE[x.type]}`;
}
export function bankFiltered() {
  const f = ui.pf || {}, done = G.prof.ngn || {};
  return NG.bank().filter((x) => (!f.cn || x.cn === f.cn) && (!f.step || x.step === f.step) && (!f.type || x.type === f.type)
    && (!f.st || (f.st === 'new' ? !done[x.id] : f.st === 'missed' ? done[x.id] && lastOf(done[x.id]) < done[x.id].max : f.st === 'done' ? !!done[x.id] : true)));
}
export function startSet(list, label) {
  const done = G.prof.ngn || {}, rank = (x) => (!done[x.id] ? 0 : lastOf(done[x.id]) < done[x.id].max ? 1 : 2);
  let h = Date.now() % 997; const r = () => { h = (h * 9301 + 49297) % 233280; return h / 233280; };
  const ids = list.map((x) => [x, rank(x), r()]).sort((a, b) => a[1] - b[1] || a[2] - b[2]).slice(0, 10).map((x) => x[0].id);
  if (!ids.length) return;
  ui.pset = { ids, label, at: Date.now() }; ngnStart('bank', 0); ui.ov = 'ngn'; TEL.track('practice_set', { n: ids.length, label });
}
export function chips(key, opts, all) {
  const f = ui.pf || {}; return `<div class="pf-row" role="group" aria-label="${esc(all)}"><span class="pf-l">${esc(all)}</span><div class="pf-c">${[['', 'All']].concat(opts).map(([v, l]) => `<button class="chip ${(f[key] || '') === v ? 'on' : ''}" data-act="pf" data-k="${key}" data-v="${v}" aria-pressed="${(f[key] || '') === v}">${esc(l)}</button>`).join('')}</div></div>`;
}
export function vPractice() {
  const tab = ui.pTab || 'cases', St = pStats(), cs = NG.cases(), bank = NG.bank(), done = G.prof.ngn || {};
  const csDone = cs.filter((c) => c.items.every((x) => done[x.id])).length, pct = St.max ? Math.round(St.pts / St.max * 100) : null;
  const head = `<div class="pr-top"><button class="mark" data-act="home">The Shift</button><span class="pr-nav"><button class="btn btn-quiet" data-act="home">Shifts</button><button class="btn btn-quiet" data-act="ref">Pocket reference</button><button class="btn btn-quiet" data-act="settings">Settings</button><button class="btn btn-quiet hn-menu" data-act="menu" aria-label="Menu: settings, how it plays, pocket reference and more">Menu</button></span></div>
    <section class="pr-hero"><div><p class="pr-k">NCLEX practice</p><h1>Think like the exam. Then like the nurse.</h1><p class="lede">Unfolding case studies in the Next Generation NCLEX format, a question bank across every NCLEX-RN Client Needs category, and the reasoning behind every option.</p></div>
      <div class="pr-stats"><div><b>${St.n}</b><span>of ${bank.length + cs.length * 6} questions answered</span></div><div><b>${pct === null ? '–' : pct + '%'}</b><span>of points on your latest tries</span></div><div><b>${csDone} of ${cs.length}</b><span>case studies finished</span></div></div></section>
    <div class="pr-tabs" role="tablist">${[['cases', `Case studies <small>${cs.length}</small>`], ['bank', `Question bank <small>${bank.length}</small>`], ['ready', 'Readiness']].map(([k, l]) => `<button role="tab" aria-selected="${tab === k}" data-act="ptab" data-v="${k}">${l}</button>`).join('')}</div>`;
  let body = '';
  if (tab === 'cases') {
    body = `<p class="pr-note">Each case follows one client through six questions, one for each step of the clinical judgment model. The chart grows as the case unfolds, the way it does on the exam.</p><div class="pc-grid">${cs.map((c) => {
      const a = c.items.filter((x) => done[x.id]).length, p = c.items.reduce((n, x) => n + (done[x.id] ? lastOf(done[x.id]) : 0), 0), m = c.items.reduce((n, x) => n + NG.max(x), 0);
      return `<button class="pc sp-${SPC[c.sp] || 'ms'}" data-act="cs-open" data-id="${c.id}"><span class="pc-u">${esc(SPN[c.sp] || '')}</span><b class="pc-t">${esc(c.title)}</b><span class="pc-c">${esc(c.client)}</span><span class="pc-f"><span>${a ? (a === 6 ? `Finished · ${p} of ${m} points` : `${a} of 6 answered`) : '6 questions'}</span><span class="pc-go">${a === 6 ? 'Retry' : a ? 'Continue' : 'Start'} ›</span></span></button>`; }).join('')}</div>`;
  } else if (tab === 'bank') {
    const L = bankFiltered(), shown = ui.pAll ? L : L.slice(0, 40), types = [...new Set(bank.map((x) => x.type))];
    body = `<div class="pf">${chips('cn', NG.CN.map((x) => [x[0], x[1]]), 'Client Needs')}${chips('step', CJ.STEPS.map((x) => [x[0], x[1]]), 'Judgment step')}${chips('type', types.map((t) => [t, NG.TYPE[t]]), 'Format')}${chips('st', [['new', 'Not tried'], ['missed', 'Missed'], ['done', 'Tried']], 'Status')}</div>
      <div class="pr-go"><span><b>${L.length}</b> question${L.length === 1 ? '' : 's'} match</span><button class="btn btn-primary btn-go" data-act="pset" ${L.length ? '' : 'aria-disabled="true" data-why="Nothing matches these filters."'}>Start ${Math.min(10, L.length) || ''} question${Math.min(10, L.length) === 1 ? '' : 's'} <span aria-hidden="true">→</span></button></div>
      <p class="pr-note">Sets take up to ten, questions you haven't tried first, then ones you missed.</p>
      <ol class="qb-list">${shown.map((x) => { const r = done[x.id]; return `<li><button class="qb-row" data-act="qb-one" data-id="${x.id}"><span class="qb-t"><b>${esc(qTitle(x))}</b><small>${esc(CNL(x.cn))} · ${esc(NG.TYPE[x.type])} · ${esc(STEPNAME(x.step))}</small></span><span class="qb-s ${r ? (lastOf(r) === r.max ? 'ok' : 'miss') : ''}">${r ? `${lastOf(r)} of ${r.max}` : 'New'}</span></button></li>`; }).join('')}</ol>
      ${L.length > shown.length ? `<button class="btn" data-act="pall">Show all ${L.length}</button>` : ''}`;
  } else {
    const bar = (o, lab, sub, act) => { const p = o && o.max ? Math.round(o.pts / o.max * 100) : null; return `<div class="rd"><div class="rd-l"><b>${esc(lab)}</b><small>${esc(sub)}</small></div><div class="rd-b"><div class="bar" aria-hidden="true"><i style="width:${p || 0}%" class="${p === null ? '' : p >= 80 ? 'hi' : p >= 60 ? 'mid' : 'lo'}"></i></div><span>${p === null ? 'Not tried' : `${p}% · ${o.n} question${o.n === 1 ? '' : 's'}`}</span></div>${act}</div>`; };
    body = `<p class="pr-note">Your share of points on your latest try at each question, by NCLEX-RN Client Needs category and by clinical judgment step. It shows where to study; it isn't a pass prediction. The real exam is adaptive and scored pass or fail.</p>
      <h3 class="pr-h">By Client Needs category</h3>${NG.CN.map(([id, lab, w]) => bar(St.by.cn[id], lab, `${w} of the exam`, `<button class="btn btn-quiet rd-go" data-act="pset-cn" data-v="${id}">Practice ›</button>`)).join('')}
      <h3 class="pr-h">By clinical judgment step</h3>${CJ.STEPS.map(([id, lab, what]) => bar(St.by.step[id], lab, what, `<button class="btn btn-quiet rd-go" data-act="pset-step" data-v="${id}">Practice ›</button>`)).join('')}`;
  }
  return `<div class="home prac">${head}<section class="pr-body">${body}</section><div class="homefoot"><span>Written to current US nursing standards. Not yet checked by a clinical reviewer: see Menu, Clinical review. Practice varies by state and facility: follow your program and your policies.</span><span>${TERMS ? '<button class="acct-link" data-act="terms">Terms</button>' : ''} <span class="buildtag">${esc(buildTag())}</span></span></div></div>`;
}
export function ovPres() {
  const P = ui.pset; if (!P) return '';
  const its = P.ids.map((id) => NG.byId(id)).filter(Boolean), done = G.prof.ngn || {};
  const got = its.reduce((n, x) => n + (done[x.id] ? lastOf(done[x.id]) : 0), 0), mx = its.reduce((n, x) => n + NG.max(x), 0);
  return sheet('Your set', `<p class="pres-h"><b>${got} of ${mx} points</b> on ${its.length} question${its.length === 1 ? '' : 's'}${P.label ? ` · ${esc(P.label)}` : ''}</p><ol class="qb-list">${its.map((x, i) => { const r = done[x.id]; return `<li><button class="qb-row" data-act="ngn-go" data-list="bank" data-i="${i}" data-review="1"><span class="qb-t"><b>${esc(qTitle(x))}</b><small>${esc(CNL(x.cn))} · ${esc(STEPNAME(x.step))}</small></span><span class="qb-s ${r ? (lastOf(r) === r.max ? 'ok' : 'miss') : ''}">${r ? `${lastOf(r)} of ${r.max}` : '–'}</span></button></li>`; }).join('')}</ol><p class="muted">Tap a question to see it and its reasoning again.</p>`,
    `<button class="btn" data-act="close">Done</button><button class="btn btn-primary" data-act="pset">Another set</button>`, { label: 'Set results' });
}
export function ovCsres() {
  const c = NG.caseById(ui.csres); if (!c) return '';
  const done = G.prof.ngn || {}, got = c.items.reduce((n, x) => n + (done[x.id] ? lastOf(done[x.id]) : 0), 0), mx = c.items.reduce((n, x) => n + NG.max(x), 0);
  return sheet(esc(c.title), `<p class="pres-h"><b>${got} of ${mx} points</b> across the six steps of clinical judgment.</p><ol class="cs-steps">${c.items.map((x, i) => { const r = done[x.id], p = r ? lastOf(r) : 0, m = NG.max(x); return `<li class="${p === m ? 'ok' : p ? 'part' : 'miss'}"><span class="cs-sn">${i + 1}</span><span class="qb-t"><b>${esc(STEPNAME(x.step))}</b><small>${esc(NG.TYPE[x.type])}</small></span><span class="qb-s">${p} of ${m}</span><button class="btn btn-quiet" data-act="cs-open" data-id="${c.id}" data-i="${i}" data-review="1">Review ›</button></li>`; }).join('')}</ol>
    <p class="muted">On the Next Generation NCLEX, each case study works the same way: one client, six questions, one per step. Where you lost points tells you which step of your thinking to practice.</p>`,
    `<button class="btn" data-act="cs-retry" data-id="${c.id}">Try it again</button><button class="btn btn-primary" data-act="close">Back to case studies</button>`, { label: 'Case study results' });
}
/* ------------ pocket reference ------------ */
export function ovRef() {
  const R = S.ref || [], c = ui.refCard && R.find((x) => x.id === ui.refCard);
  if (c) {
    const blk = (b) => `<section class="rf-b"><h3>${esc(b.h)}</h3>${b.rows ? `<table class="rf-t"><tbody>${b.rows.map((r) => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}${r[2] ? `<small>${esc(r[2])}</small>` : ''}</td></tr>`).join('')}</tbody></table>` : b.list ? `<ul>${b.list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : `<p>${esc(b.text)}</p>`}</section>`;
    return sheet(esc(c.title), `<p class="rf-blurb">${esc(c.blurb)}</p>${c.blocks.map(blk).join('')}<p class="rf-src muted">${esc(c.src || '')}</p>`, `<button class="btn" data-act="ref-back">All cards</button><button class="btn btn-primary" data-act="close">Done</button>`, { wide: true, label: c.title });
  }
  const groups = []; R.forEach((x) => { if (!groups.includes(x.group)) groups.push(x.group); });
  return sheet('Pocket reference', `<p class="muted" style="margin-top:0">Quick facts for the floor and the exam. Ranges vary by lab and facility; your policies win.</p>${groups.map((g) => `<h3 class="rf-g">${esc(g)}</h3><div class="rf-list">${R.filter((x) => x.group === g).map((x) => `<button class="rf-row" data-act="ref-card" data-id="${x.id}"><b>${esc(x.title)}</b><small>${esc(x.blurb)}</small></button>`).join('')}</div>`).join('')}`, `<button class="btn btn-primary" data-act="close">Done</button>`, { wide: true, label: 'Pocket reference' });
}
