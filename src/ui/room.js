/* The Shift — UI: The patient's room: the task timeline, assessment, care, meds, talking, delegation, critical moments and consequence cards. */
import { aideSuggest } from './core.js';
import { A, A_, C, CJ, E, F, FX, G, ICON, R, STY, abn, ageSex, clip, cna, cnaAway, def, esc, fT, face, faceOf, gone, goneText, here, lcFirst, legal, liveDef, medDose, norm, pface, prov, rigV, staff, sysL, ui, who } from './ctx.js';
import { goData, nextFor, nowRows, prioN, stuckTip } from './floor.js';
import { PAST } from './sbar.js';
import { sheet } from './sheets.js';

/* ------------ room ------------ */
export const SYS = [['vitals', 'Vital signs', 4], ['general', 'General look', 1], ['resp', 'Lung sounds and breathing', 3], ['cardiac', 'Heart and circulation', 3], ['neuro', 'Neuro and mental status', 3], ['pain', 'Pain and sedation', 2], ['skin', 'Skin and wound', 3], ['gi', 'GI, GU and intake/output', 3], ['full', 'Full head-to-toe', 12]];
export function medStatus(m) {
  const st = G.s.meds[m.id];
  if (m.later) return { cls: '', text: 'At ' + m.later };
  if (m.initStatus === 'given' && st.at === null) return { cls: 'done', text: m.givenNote || 'Given' };
  if (st.status === 'given' && !m.prn) return { cls: 'done', text: 'Given ' + E.clock(st.at) };
  if (st.status === 'held') return { cls: 'done', text: 'Held ' + E.clock(st.at) };
  if (st.status === 'verify') return { cls: '', text: 'Pharmacy hold' };
  if (m.ordered && !st.given.length) return { cls: 'due', text: 'New order' };
  if (m.ordered) return { cls: 'done', text: 'Given ' + E.clock(st.given[0]) };
  if (m.prn) return { cls: '', text: st.given.length ? 'Last ' + E.clock(st.given[st.given.length - 1]) : 'As needed' };
  if (m.initStatus === 'given') return { cls: 'done', text: m.givenNote || 'Given' };
  const late = G.s.t > m.due + 60; return { cls: late ? 'late' : G.s.t >= m.due - 30 ? 'due' : '', text: (late ? 'Late, due ' : 'Due ') + E.clock(m.due) };
}
/* ------------ decision review: the why, right after the decision ------------ */
export const fbNow = () => (G.prof.settings.feedback || 'now') === 'now';
export const DOM = Object.fromEntries(E.DOMAINS);
export const judgSince = (n0, pid) => G.s.judg.slice(n0).filter((j) => pid === undefined || !j.pid || j.pid === pid);
export function reviewHTML(list, title) {
  if (!fbNow() || !list || !list.length) return '';
  return `<div class="rv"><span class="res-cl">${title || 'Why it matters'}</span>${list.map((j, i) => `<div class="rv-i ${j.delta > 0 ? 'good' : j.delta < 0 ? 'bad' : 'neutral'}" style="--i:${i}"><span class="rv-ic" aria-hidden="true">${j.delta > 0 ? '✓' : j.delta < 0 ? '!' : '•'}</span><div><span class="rv-k">${j.delta > 0 ? 'Good call' : j.delta < 0 ? 'Rethink' : 'Note'} · ${esc(DOM[j.domain] || j.domain)}${CJ ? `<span class="rv-cj" title="The NCLEX clinical judgment step this decision tests">NCLEX: ${esc((CJ.STEPS.find((x) => x[0] === CJ.step(j)) || [])[1] || '')}</span>` : ''}</span><b>${esc(j.text)}</b><p>${esc(j.why)}</p></div>${j.delta ? `<span class="rv-pts ${j.delta > 0 ? 'up' : 'dn'}">${j.delta > 0 ? '+' : ''}${j.delta}</span>` : '<span></span>'}</div>`).join('')}</div>`;
}
// A short sting when a decision is judged: never subtle about a serious miss.
export function reviewSound(list) { if (!fbNow() || !list || !list.length) return; const worst = Math.min(...list.map((j) => j.delta)), best = Math.max(...list.map((j) => j.delta)); setTimeout(() => FX.play(worst <= -1 ? 'miss' : best > 0 ? 'right' : 'tap'), 520); }

/* ------------ condition reads: what the nurse sees after acting ------------ */
export const ST = { stable: ['Looks settled', 0], watch: ['Concerning', 1], urgent: ['Needs you now', 2], gone: ['Off the unit', -1] };
export const stName = (k) => (ST[k] || ST.stable)[0];
export const stRank = (k) => (ST[k] || ST.stable)[1];
export function markRead(pid, st) { const P = G.s.p[pid]; P.read = { t: G.s.t, st }; P.reads = (P.reads || []).concat(st).slice(-6); }
export const trend = (P) => (P.reads && P.reads.length ? `<span class="trend" aria-hidden="true">${P.reads.map((r) => `<i class="st-${r}"></i>`).join('')}</span>` : '');

/* ------------ the brain: an Epic-style task timeline for one patient ------------ */
export const AI = {
  brain: '<svg class="ai" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  assess: '<svg class="ai" viewBox="0 0 24 24"><path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M10 13v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="2"/></svg>',
  care: '<svg class="ai" viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  meds: '<svg class="ai" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)"/><path d="M9.5 8.6l5 7"/></svg>',
  talk: '<svg class="ai" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg>',
  chart: '<svg class="ai" viewBox="0 0 24 24"><path d="M4 20V4M4 20h16M8 16l4-5 3 3 4-6"/></svg>',
};
export const tabFor = (text) => (/glucose|BG\b/i.test(text) ? 'care' : /weigh|weight|scan/i.test(text) ? 'care' : /neuro|POSS|sedation|vital|mental|assess/i.test(text) ? 'assess' : null);
// A task the case didn't route: send it to the tab whose action shares the most words with it, so every due task is tappable.
export function paneFor(d, P, text) {
  const w = text.toLowerCase().split(/[^a-z]+/).filter((x) => x.length > 3), Ax = A();
  const score = (label) => w.filter((x) => label.toLowerCase().includes(x)).length;
  let best = null, bs = 0;
  // The action whose name best matches the task wins; a care action wins a tie, since it's usually the one written for that task.
  (d.interventions || []).filter((x) => !x.avail || x.avail(G.s, P, Ax)).forEach((x) => { const n = score(x.label); if (n > bs) { bs = n; best = 'care'; } });
  SYS.forEach(([id, label]) => { if (id === 'full') return; const n = score(sysL(id, label)); if (n > bs) { bs = n; best = 'assess'; } });
  (d.comms || []).filter((x) => !x.avail || x.avail(G.s, P, Ax)).forEach((x) => { const n = score(x.label); if (n > bs) { bs = n; best = 'talk'; } });
  (d.meds || []).filter((m) => !m.available || m.available(G.s, P)).forEach((m) => { const n = score(m.name); if (n > bs) { bs = n; best = 'meds'; } });
  if (best) return best;
  return tabFor(text) || (/call|page|notify|update|family|provider|SBAR/i.test(text) ? 'talk' : /med|dose|give/i.test(text) ? 'meds' : 'care');
}
/* Completion tracking: every task that leaves the to-do list gets a visible check-off. */
ui.ghosts = [];
export function openSnap() {
  const o = {};
  C().patients.forEach((d) => { if (!here(d)) return; const P = G.s.p[d.id]; (gone(P) ? F.awayRows(G.s, A(), d, P) : brainRows(d, P)).forEach((r) => { if (!r.done && r.key && r.t !== null) o[d.id + '|' + r.key] = { pid: d.id, key: r.key, t: r.t, text: r.text, prog: !!r.prog, late: !!r.late }; }); });
  return o;
}
export const GHOST_MS = 2600;
export function liveGhosts(pid) { const n = Date.now(); return ui.ghosts.filter((g) => !g.held && n - g.born < GHOST_MS && (pid === null || g.pid === pid)); }
export function ghostList(pid) {
  const gs = liveGhosts(pid); if (!gs.length) return '';
  const n = Date.now();
  return `<div class="b-grp ghosts"><h4>Just completed<span>${gs.length}</span></h4><ul>${gs.map((g) => `<li class="ghost" style="--gd:-${n - g.born}ms"><div class="b-row gdone"><span class="b-tm">${E.clock(G.s.t)}</span><span class="b-tx"><b>${pid === null ? esc(g.pid) + ' · ' : ''}${esc(g.text)}</b><small>Done${g.by ? ' by ' + esc(g.by) : ''}</small></span><span class="gcheck" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5"/><path d="M7 12.5l3.2 3.2L17.2 8.6"/></svg></span><span></span></div></li>`).join('')}</ul></div>`;
}
// Systems documented this shift, counted the same way everywhere: each body system, plus vitals you took yourself.
export const sysCount = (P) => Object.keys(P.assessAt || {}).length + (P.vit.some((v) => v.by === 'You') ? 1 : 0);
export function brainRows(d, P) {
  if (G.RC && G.RC.has(d.id)) return G.RC.get(d.id);
  const out = brainRows0(d, P); if (G.RC) G.RC.set(d.id, out); return out;
}
export function brainRows0(d, P) {
  const rows = [];
  // Shift assessment: every patient needs one, early.
  const sysDone = sysCount(P);
  rows.push({ key: 'sa', t: 0, late: G.s.t > 90 && sysDone < 3, done: sysDone >= 3, sys: 'full', text: 'Shift assessment', sub: sysDone >= 3 ? `${sysDone} systems documented` : sysDone ? `${sysDone} of 3+ systems documented` : 'Nothing documented yet', go: { act: 'dock', id: 'assess' } });
  const off = gone(P);   // transferred: their scheduled work went with them
  if (off) rows.pop();
  // A patient who needs you now always has something on the list, even when nothing is scheduled: look, then act.
  if (!off && d.status(G.s, P, A()) === 'urgent') {
    const mine = [P.vit.filter((v) => v.by === 'You').map((v) => v.t), Object.values(P.assessAt || {})].flat(), lastLook = mine.length ? Math.max(...mine) : -999;
    const alert = G.s.inbox.find((m) => m.pid === d.id && m.urgent && m.stale === undefined && G.s.t - m.t <= 60), fresh = G.s.t - lastLook <= 15;
    rows.push({ key: 'urg', t: G.s.t, late: false, stat: true, text: fresh ? `Needs you now: you assessed at ${E.clock(lastLook)}. Act on it` : 'Needs you now: assess and act', sub: fresh ? 'Treat what you can at the bedside (Care), and call for what you can\'t (Talk & call).' : alert ? clip(alert.text, 110) : 'Look at the patient, take vital signs, then decide what to do and who to call.', ...(() => { if (!fresh) return { go: { act: 'dock', id: 'assess' }, sys: 'vitals', hl: 'Vital signs' }; const Ax = A(), u = (d.interventions || []).find((x) => (!x.avail || x.avail(G.s, P, Ax)) && (x.urgent || /juice|d50|brady/.test(x.id))); return u ? { go: { act: 'dock', id: 'care' }, hl: u.label } : { go: { act: 'dock', id: 'talk' }, hl: 'Call SBAR' }; })() });
  }
  (d.meds || []).forEach((m) => {
    const st = G.s.meds[m.id];
    if (m.available && !m.available(G.s, P)) return;
    if (off && st.status !== 'given' && st.status !== 'held') return;
    if (m.later) { rows.push({ t: null, later: m.later, text: `${m.name} ${m.dose} ${m.route}`, sub: `Due at ${m.later}` }); return; }
    // A one-time order that just came in ("KCl 40 now", a verbal order): a task until it's given or held.
    if (m.ordered && !off) {
      if (st.avAt === undefined) st.avAt = G.s.t;
      const doneAt = st.status === 'held' ? st.at : (st.given && st.given.length ? st.given[0] : null);
      if (doneAt !== null) rows.push({ key: 'n:' + m.id, t: doneAt, done: true, text: `${m.name} ${m.dose} ${m.route}`, sub: `${st.status === 'held' ? 'Held' : 'Given'} ${E.clock(doneAt)}` });
      else { const nb = m.notBefore ? m.notBefore(G.s, P) : null;   // a scheduled order whose first dose comes later
        if (nb !== null && nb > G.s.t) { if (nb < C().length) rows.push({ key: 'n:' + m.id, t: nb, notBefore: true, text: `${m.name} ${m.dose} ${m.route}`, sub: `New order, first dose ${E.clock(nb)}` }); else rows.push({ t: null, later: E.clock(nb), text: `${m.name} ${m.dose} ${m.route}`, sub: `New order, first dose ${E.clock(nb)}: the next shift's, so put it in report` }); }
        else rows.push({ key: 'n:' + m.id, t: Math.max(st.avAt, nb === null ? st.avAt : nb), stat: true, late: G.s.t > Math.max(st.avAt, nb || 0) + (m.urgent ? 10 : 30), text: `${m.name} ${m.dose} ${m.route}`, sub: 'New order: give it, or hold it with a reason', go: { act: 'med', id: m.id } }); }
      return;
    }
    if (m.due === undefined || m.prn) return;
    if (st.status === 'given' || st.status === 'held') rows.push({ key: 'm:' + m.id, t: st.at, done: true, text: `${m.name} ${m.dose} ${m.route}`, sub: `${st.status === 'given' ? 'Given' : 'Held'} ${E.clock(st.at)}` });
    else if (m.initStatus === 'given') return;
    else rows.push({ key: 'm:' + m.id, t: m.due, late: G.s.t > m.due + 60, text: `${m.name} ${m.dose} ${m.route}`, sub: st.status === 'verify' ? 'Awaiting pharmacy: it can\'t be given until it\'s released' : m.freq, blocked: st.status === 'verify', go: { act: 'med', id: m.id } });
  });
  if (C().dueExtras) C().dueExtras(G.s, A()).forEach((x) => { if ((x.text.match(/^\d{2,3}(?=\s)/) || [])[0] !== d.id) return; if (!x.info && x.t >= C().length) return;   // due after handoff: the oncoming nurse's task
    const tx = x.text.replace(/^\d{2,3}\s*/, ''); if (x.info) { rows.push({ key: 'x:' + tx, t: x.t, late: false, info: true, text: tx, sub: 'Heads-up: nothing to do yet' }); return; } const tab = x.tab || (x.sys ? 'assess' : paneFor(d, P, tx)), early = x.notBefore && x.t > G.s.t; rows.push({ key: 'x:' + tx, t: x.t, late: x.late, text: tx, sys: x.sys, hl: x.hl, notBefore: early, sub: early ? `Not before ${E.clock(x.t)}: doing it early is a different decision` : x.sub, go: tab ? { act: 'dock', id: tab } : null }); });
  // Anything a provider ordered that the nurse carries out ("Draw blood cultures × 2 (ordered)") is a task, not just a button.
  if (!off) {
    const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(), have = rows.map((r) => norm(r.text || '')), Ax = A();
    const ordT = (P.orders || []).filter((o) => o.isNew).reduce((m, o) => Math.max(m, o.t), -Infinity);
    (d.interventions || []).filter((x) => /\(ordered\)$/.test(x.label) && (!x.avail || x.avail(G.s, P, Ax))).forEach((x) => {
      const tx = x.label.replace(/\s*\(ordered\)$/, ''), n = norm(tx); if (have.some((h) => h === n || h.startsWith(n.slice(0, 14)) || n.startsWith(h.slice(0, 14)))) return;
      const t = Number.isFinite(ordT) ? Math.max(0, ordT) : 0;
      rows.push({ key: 'o:' + x.id, t, stat: true, late: G.s.t > t + (x.urgent ? 10 : 30), text: tx, sub: 'Ordered: yours to do', hl: x.label, go: { act: 'dock', id: 'care' } });
    });
  }
  G.s.deleg.filter((x) => !x.done && x.pid === d.id).forEach((x) => rows.push({ key: 'd:' + x.id + ':' + x.at, at: x.at, t: x.due, prog: true, text: `${cna().name}: ${C().delegation.tasks.find((t) => t.id === x.id).label.toLowerCase()}`, sub: `In progress, back about ${E.clock(x.due)}` }));
  return rows.concat(flowRows(d, P));
}
/* Unit-wide work every patient generates: call lights, rounds, PRN follow-up, report. */
export function flowRows(d, P) {
  if (gone(P)) return [];
  const rows = [], Ax = A();
  if (P.bell) rows.push({ key: 'bell:' + P.bell.at, t: P.bell.at, late: G.s.t > P.bell.at + 10, text: `Call light: ${P.bell.who} ${F.kindOf(C()) === 'psych' ? 'is asking ' : ''}${P.bell.text}`, sub: P.bell.cnaAt ? `${cna().name} is on it` : P.bell.cna ? `${cna().name} could take this` : 'Needs a nurse', go: { act: 'bell', id: d.id }, prog: !!P.bell.cnaAt });
  F.prnRows(G.s, Ax, d, P).forEach((r) => rows.push(r));
  F.watchRows(G.s, Ax, d, P).forEach((r) => rows.push(r));
  F.errRows(G.s, Ax, d, P, prov(d.id).name).forEach((r) => rows.push(r));
  const rd = F.roundRow(G.s, Ax, d, P); if (rd && !P.bell) rows.push(rd);
  if (G.s.t >= C().length - 45) { const rp = G.s.report && G.s.report[d.id]; rows.push({ key: 'rp', t: C().length - 30, late: G.s.t > C().length - 10 && !rp, done: !!rp, text: `Give report to ${oncoming().name}`, sub: rp ? `Given ${E.clock(rp.t)}` : 'At the station', go: { act: 'report', id: d.id } }); }
  return rows;
}
export const oncoming = () => staff(F.oncoming(C()));
export function awayShort(P) { const o = P.out; if (!o) return goneText(P); const e = o.spec.course[o.known]; return `${o.spec.unit} · ${F.ST[e.st]}`; }
export function paneBrain(d, P) {
  const rows = brainRows(d, P);
  const open = rows.filter((r) => !r.done && !r.prog && r.t !== null);
  const ord = (L) => L.sort((a, b) => !!a.blocked - !!b.blocked || !!b.stat - !!a.stat || a.t - b.t);
  const over = ord(open.filter((r) => r.late && !r.info)), now = ord(open.filter((r) => !r.late && !r.info && r.t <= G.s.t + 30)), soon = open.filter((r) => r.info || (!r.late && r.t > G.s.t + 30));
  const later = rows.filter((r) => r.t === null), prog = rows.filter((r) => r.prog);
  const doneLog = G.s.log.filter((l) => l.pid === d.id && (l.kind === 'find' || l.kind === 'act') && !/^You: "/.test(l.text)).slice().reverse();
  const shown = ui.brainAll ? doneLog : doneLog.slice(0, 5);
  const row = (r, cls) => { const inner = `${cls === 'prog' ? `<span class="b-prog" aria-hidden="true"><i style="width:${Math.min(100, Math.max(4, (G.s.t - r.at) / Math.max(1, r.t - r.at) * 100)).toFixed(0)}%"></i></span>` : ''}<span class="b-tm">${r.t === null ? esc(r.later) : E.clock(Math.max(r.t, 0))}</span><span class="b-tx"><b>${esc(r.text)}</b>${r.sub ? `<small>${esc(r.sub)}</small>` : ''}</span><span class="b-st">${cls === 'over' ? 'Overdue' : cls === 'now' ? (r.t > G.s.t ? `In ${Math.round(r.t - G.s.t)} min` : 'Due') : cls === 'soon' ? 'Upcoming' : cls === 'prog' ? 'In progress' : cls === 'later' ? 'Later' : ''}</span>${r.go ? '<span class="b-go" aria-hidden="true">›</span>' : '<span></span>'}`;
    return r.go ? `<li><button class="b-row ${cls}" data-act="${r.go.act}" data-id="${r.go.id}"${r.go.act === 'dock' ? ` data-hl="${esc(r.hl || r.text)}"${r.sys ? ` data-sys="${esc(r.sys)}"` : ''}` : ''}>${inner}</button></li>` : `<li><div class="b-row ${cls} static">${inner}</div></li>`; };
  // A PRN whose "did it work?" check is overdue reads as an acute trigger, not one more line of work.
  const grp = (title, list, cls) => (list.length ? `<div class="b-grp ${cls}"><h4>${title}<span>${list.length}</span></h4><ul>${list.map((r) => row(r, cls + (cls === 'over' && r.key && r.key.startsWith('rx:') ? ' acute' : ''))).join('')}</ul></div>` : '');
  const flags = G.s.brain.filter((k) => k.startsWith(d.id + ':')).map((k) => d.report[+k.split(':')[1]].text);
  let h = ghostList(d.id);
  if (!over.length && !now.length) h += '<p class="b-clear">Nothing overdue or due right now for this patient.</p>';
  h += grp('Overdue', over, 'over') + grp(now.some((r) => r.t > G.s.t) ? 'Due now or in the next 30 min' : 'Due now', now, 'now') + grp('In progress', prog, 'prog') + grp('Coming up', soon, 'soon') + grp('Later today', later, 'later');
  if (flags.length) h += `<div class="b-grp flags"><h4>From report<span>${flags.length}</span></h4><ul>${flags.map((f) => `<li><div class="b-flag"><i class="flag-ic on" aria-hidden="true"></i><span>${esc(f)}</span></div></li>`).join('')}</ul></div>`;
  h += `<div class="b-grp done"><h4>Done this shift<span>${doneLog.length}</span></h4>${doneLog.length ? `<ul>${shown.map((l) => `<li><div class="b-row done static"><span class="b-tm">${E.clock(l.t)}</span><span class="b-tx"><b>${esc(l.label || clip(l.text.split(/[.:](?=\s|$)/)[0], 70))}</b>${l.label ? `<small>${esc(clip(l.text, 110))}</small>` : ''}</span><span class="b-st">${ICON.tick}</span><span></span></div></li>`).join('')}</ul>${doneLog.length > 5 ? `<button class="btn btn-quiet b-more" data-act="brain-all">${ui.brainAll ? 'Show fewer' : `Show all ${doneLog.length}`}</button>` : ''}` : '<p class="b-empty">Nothing yet. Start with what you see.</p>'}</div>`;
  return h;
}
export const stamped = (label) => !!(ui.stampRow && ui.stampRow.label === label && Date.now() - ui.stampRow.born < 2200);
export const lastFind = (pid, label) => { const l = G.s.log.slice().reverse().find((x) => x.pid === pid && x.label === label); return l || null; };
export function paneAssess(d, P) {
  // Keep it simple: vital signs and the full head-to-toe lead; the single systems sit one tap away, and stay open
  // once you've used one on this patient.
  const row = ([id, label, c]) => {
    const L = sysL(id, label), at = id === 'vitals' ? (P.vit.filter((v) => v.by === 'You').pop() || {}).t : id === 'full' ? null : P.assessAt[id];
    const lf = id === 'full' ? null : lastFind(d.id, id === 'vitals' ? 'Vital signs' : L);
    return `<li><button class="fs-row ${at !== undefined && at !== null ? 'has' : ''} ${stamped(L) ? 'stamped' : ''}" style="${stamped(L) ? `--gd:-${Date.now() - ui.stampRow.born}ms` : ''}" data-act="assess" data-sys="${id}"><span class="fs-l"><b>${esc(L)}</b>${lf ? `<small>${esc(clip(lf.text, 120))}</small>` : `<small>${id === 'full' ? 'Every system, one after another' : 'Not documented this shift'}</small>`}</span><span class="fs-t">${at !== undefined && at !== null ? `${ICON.tick}${E.clock(at)}` : ''}</span><span class="fs-c">${c} min</span></button></li>`;
  };
  const lead = SYS.filter((x) => x[0] === 'vitals' || x[0] === 'full'), foc = SYS.filter((x) => x[0] !== 'vitals' && x[0] !== 'full');
  const used = foc.filter((x) => P.assessAt[x[0]] !== undefined && P.assessAt[x[0]] !== null).length, open = ui.focOpen === undefined ? used > 0 : ui.focOpen;
  return `<ul class="fs">${lead.map(row).join('')}</ul><details class="fs-fold" ${open ? 'open' : ''}><summary data-act="foc-t"><b>Focused assessment</b><span>${used ? `${used} of ${foc.length} done` : 'One system at a time'}</span></summary><ul class="fs">${foc.map(row).join('')}</ul></details>`;
}
export const RISKY = /restrain|seclu|stop the (insulin|pca)|stop the infusion|straight cath|massage|search his room|1:1|pause the insulin|release/i;
export const ROUND = { ld: ['Labor round', 'Strip through a few contractions, position, comfort, ice chips, partner'], med: ['Hourly round', 'Pain, position, bathroom, things in reach'], psych: ['Check-in round', 'Face to face, room safety scan, needs'], peds: ['Hourly round', 'Comfort, IV site, rails, parent needs'], ob: ['Hourly round', 'Fundus, pad, pain, bathroom, baby on their back'], ed: ['Hourly round', 'Pain, what they\'re waiting on, things in reach'] };
export function paneCare(d, P) {
  const Ax = A(), list = (d.interventions || []).filter((x) => !x.avail || x.avail(G.s, P, Ax)), rd = ROUND[F.kindOf(C())], last = F.roundRow(G.s, Ax, d, P);
  const top = `${P.bell ? `<li><button class="fs-row urgent" data-act="bell" data-id="${d.id}"><span class="fs-l"><b>Answer the call light</b><small>${esc(P.bell.who)} ${F.kindOf(C()) === 'psych' ? 'is asking ' : ''}${esc(P.bell.text)} · since ${E.clock(P.bell.at)}</small></span><span class="fs-t"></span><span class="fs-c">2 min</span></button></li>` : ''}<li><button class="fs-row ${last && last.late ? 'due' : ''} ${stamped(rd[0]) ? 'stamped' : ''}" style="${stamped(rd[0]) ? `--gd:-${Date.now() - ui.stampRow.born}ms` : ''}" data-act="round" data-id="${d.id}"><span class="fs-l"><b>${rd[0]}</b><small>${rd[1]}${P.roundAt !== undefined ? ` · last ${E.clock(P.roundAt)}` : ''}</small></span><span class="fs-t">${P.roundAt !== undefined ? `${ICON.tick}${E.clock(P.roundAt)}` : ''}</span><span class="fs-c">2 min</span></button></li>`;
  if (!list.length) return `<ul class="fs">${top}</ul>`;
  return `<ul class="fs">${top}${list.map((x) => { const lf = lastFind(d.id, x.label), risky = RISKY.test(x.label + ' ' + x.id); return `<li><button ${risky ? `data-hold="1" data-hk="int:${x.id}"` : ''} class="${risky ? 'holdbtn ' : ''}fs-row ${x.urgent || /juice|d50|brady/.test(x.id) ? 'urgent' : ''} ${lf ? 'has' : ''} ${stamped(x.label) ? 'stamped' : ''}" style="${stamped(x.label) ? `--gd:-${Date.now() - ui.stampRow.born}ms` : ''}" data-act="int" data-id="${x.id}"> ${risky ? '<i class="hold-fill" aria-hidden="true"></i>' : ''}<span class="fs-l"><b>${esc(x.label)}</b>${risky ? '<small class="hold-note">Press and hold, or tap twice, to commit</small>' : ''}${lf ? `<small>Last: ${esc(clip(lf.text, 100))}</small>` : ''}</span><span class="fs-t">${lf ? `${ICON.tick}${E.clock(lf.t)}` : ''}</span><span class="fs-c">${x.cost} min</span></button></li>`; }).join('')}</ul>`;
}
export function paneMeds(d, P) {
  const meds = (d.meds || []).filter((m) => !m.available || m.available(G.s, P));
  const sched = meds.filter((m) => !m.prn), prn = meds.filter((m) => m.prn);
  const row = (m) => { const st = medStatus(m), off = m.later || m.initStatus === 'given'; return `<li><button class="mar-row ${st.cls}" data-act="med" data-id="${m.id}" ${off ? `disabled data-why="${esc(m.later ? 'Not due until ' + m.later + '.' : (m.givenNote || 'Already given') + '. Nothing to do now.')}"` : ''}><span class="mar-n"><b>${esc(m.name)}</b> ${esc(medDose(m))} ${m.route}<small>${esc(m.freq)}${m.param ? ' · ' + esc(m.param) : ''}</small></span><span class="pill ${st.cls}">${st.text}</span></button></li>`; };
  return `${sched.length ? `<div class="b-grp"><h4>Scheduled<span>${sched.length}</span></h4><ul class="mar">${sched.map(row).join('')}</ul></div>` : ''}${prn.length ? `<div class="b-grp"><h4>As needed (PRN)<span>${prn.length}</span></h4><ul class="mar">${prn.map(row).join('')}</ul></div>` : ''}`;
}
export function paneTalk(d, P) {
  const Ax = A();
  const item = (act, label, c, extra, cls) => `<li><button class="fs-row ${cls || ''}" data-act="${act}" ${extra || ''}><span class="fs-l"><b>${label}</b></span><span class="fs-t"></span><span class="fs-c">${c}</span></button></li>`;
  const wants = STY && STY.waiting(G.s, C(), d, P, Ax);
  let h = `<div class="b-grp"><h4>At the bedside</h4><ul class="fs">${item('talk', `${esc(d.talkLabel || 'Talk with ' + d.short)}${wants ? ' <span class="st-tag">Wants to talk</span>' : ''}`, '3 min')}`;
  if (d.family && (!d.family.avail || d.family.avail(G.s, P, Ax))) h += item('family', `${d.family.mode === 'phone' ? 'Call' : 'Talk with'} ${esc(d.family.name)} (${esc(d.family.rel.toLowerCase())})`, d.family.cost + ' min');
  h += `</ul></div><div class="b-grp"><h4>Call and escalate</h4><ul class="fs">${item('sbar', `Call ${esc(prov(d.id).name)} with an SBAR`, '6 min', `data-pid="${d.id}"`)}`;
  (d.comms || []).filter((x) => !x.avail || x.avail(G.s, P, Ax)).forEach((x) => { h += item('comm', esc(x.label), x.cost + ' min', `data-id="${x.id}"`, x.id === 'rrt' ? 'urgent' : ''); });
  if (!(d.comms || []).some((x) => x.id === 'rrt')) h += item('rrt-generic', 'Call a rapid response', '3 min');
  h += `</ul></div><div class="b-grp"><h4>Get help</h4><ul class="fs">${F.errsFor(G.s, d.id, 'charge').length ? item('err-charge', `Tell ${esc(staff('nova').name.split(' ')[0])} (charge nurse) about your error`, '2 min', '', 'urgent') : ''}${(cnaAway() ? '' : item('delegate', `Ask ${esc(cna().name)} (${esc(cna().role)})`, '1 min'))}</ul></div>`;
  return h;
}
export const PANES = [
  ['brain', 'To do', 'This patient\'s tasks, overdue first. Tap one to do it.'],
  ['assess', 'Assess', 'Document an assessment. Each one takes time; the finding goes in the chart.'],
  ['care', 'Care', 'Hands-on care at the bedside.'],
  ['meds', 'MAR', 'Medication administration record. Give or hold each scheduled dose.'],
  ['talk', 'Talk & call', 'Talk with the patient and family, call the provider, or get help.'],
];
export function railCounts(d, P) {
  const rows = brainRows(d, P).filter((r) => !r.done && !r.prog && r.t !== null);
  const late = rows.filter((r) => r.late).length, due = rows.filter((r) => !r.late && r.t <= G.s.t + 30).length;
  const meds = (d.meds || []).filter((m) => !m.prn && m.due !== undefined && !m.later && G.s.meds[m.id].status === 'due' && m.initStatus !== 'given' && (!m.available || m.available(G.s, P)));
  const medLate = meds.filter((m) => G.s.t > m.due + 60).length, medDue = meds.filter((m) => m.due <= G.s.t + 30).length;
  const Ax = A(), ints = (d.interventions || []).filter((x) => !x.avail || x.avail(G.s, P, Ax)).length;
  return {
    brain: late ? [`${late} overdue`, 'late'] : due ? [`${due} due`, 'due'] : ['Up to date', ''],
    assess: [sysCount(P) ? `${sysCount(P)} documented` : 'Start here', sysCount(P) ? '' : 'due'],
    care: P.bell ? ['Call light on', 'late'] : [`${ints + 1} option${ints === 0 ? '' : 's'}`, ''],
    meds: medLate ? [`${medLate} late`, 'late'] : medDue ? [`${medDue} due`, 'due'] : ['Nothing due', ''],
    talk: STY && STY.waiting(G.s, C(), d, P, Ax) ? ['Wants to talk', 'due'] : ['Patient, family, provider', ''],
  };
}
/* ------------ talking in the room ------------
   The patient (or the family member beside them) speaks in a speech bubble by their head. Your replies are
   speech bubbles under the scene; tap one to say it. Speech is plain; what people do is in italics. */
/* One look for everything a character says or does, wherever it appears: the words as written, spoken words in
   quotation marks, what people do in plain text around them. A line that is only speech (an idle line) gets its
   quotation marks here; a line in parentheses is a description, shown without them. */
export function sayText(t, spoken) {
  t = String(t == null ? '' : t).trim();
  if (/^\(.*\)$/.test(t)) return t.slice(1, -1).trim();
  if (spoken && !t.includes('"')) return `"${t}"`;
  if (spoken && !/^"/.test(t)) return `"${t.replace(/"([^"]*)"/g, "'$1'")}"`;
  return t;
}
export const speechHTML = (t, spoken) => esc(sayText(t, spoken));
export const isPt = (key) => !!def(key);
export function dlgLine() {
  if (ui.dlg.id === '__review') return ui.dlgLast || null;
  const node = C().dialogs[ui.dlg.id]; if (!node) return null;
  return { who: node.who, text: typeof node.text === 'function' ? node.text(G.s) : node.text, story: node.story || null };
}
export function sayNow(d) { const l = R.say(d.id, rigV(d.id)), q = liveDef(d).quiet; return l && l.quiet && q ? { quiet: true, text: q } : l; }
export function speech(d, P, fl) {
  const Ax = A();
  if (ui.ov === 'dialog' && ui.dlg) {
    const L = dlgLine(); if (!L) return '';
    const pt = isPt(L.who), fam = !pt && fl.family === L.who, nm = pt ? def(L.who).short : who(L.who).name;
    const st = L.story && STY ? trustDots(STY.trust(G.s.p[L.story.pid])) : '';
    return `<div class="sb talking" data-anchor="${fam ? 'fam' : pt ? 'pt' : 'side'}" role="status" aria-live="polite">
      <p class="sb-who"><b>${esc(nm)}</b>${st ? `<span class="sb-st">Getting to know ${esc(pt ? d.short : nm.split(' ')[0])} ${st}</span>` : ''}</p>
      <p class="sb-tx">${speechHTML(L.text, false)}</p><i class="sb-tail" aria-hidden="true"></i></div>`;
  }
  if (fl.empty || gone(P)) return '';
  const cid = d.talk(G.s, P, Ax), node = cid && C().dialogs[cid];
  const line = ui.captionPoke && ui.caption ? { text: ui.captionRaw, quiet: ui.captionQuiet } : sayNow(d);
  let h = '';
  if (cid || line) {
    const story = !!(STY && STY.waiting(G.s, C(), d, P, Ax)), fresh = !!(node && node.choices && !(G.s.seenDlg || {})[cid]);
    // Someone who can't speak (intubated, GCS 3, a newborn) never "wants to talk"; if their story is told by family, the family does.
    const arcWho = STY && STY._arcs && (STY._arcs[C().id] || {})[d.id] && STY._arcs[C().id][d.id].who, famVoice = arcWho && d.family && d.family.name.toLowerCase().startsWith(String(arcWho).toLowerCase());
    const mute = d.newborn || liveDef(d).vented || d.unresponsive;
    const wants = cid && (story || fresh), label = wants && !mute ? `${d.short} wants to talk` : wants && famVoice ? `${d.family.name} wants to talk` : (d.talkLabel || `Talk with ${d.short}`);
    h += `<div class="sb idle ${wants ? 'wants' : ''} ${ui.captionPoke ? 'fresh' : ''}" data-anchor="pt">${line ? `<p class="sb-tx">${speechHTML(line.text, !line.quiet)}</p>` : ''}${cid ? `<button class="sb-go" data-act="talk">${wants ? '<i class="ping" aria-hidden="true"></i>' : ''}<span>${esc(label)}</span><small>3 min</small></button>` : ''}<i class="sb-tail" aria-hidden="true"></i></div>`;
  }
  if (d.family && fl.family && (!d.family.avail || d.family.avail(G.s, P, Ax))) h += `<div class="sb idle fam" data-anchor="fam"><button class="sb-go" data-act="family"><span>Talk with ${esc(d.family.name)}</span><small>${d.family.cost} min</small></button><i class="sb-tail" aria-hidden="true"></i></div>`;
  return h;
}
export function convoTray(d) {
  const rev = ui.dlg.id === '__review', node = rev ? null : C().dialogs[ui.dlg.id];
  const L = dlgLine(), nm = L ? (isPt(L.who) ? def(L.who).short : who(L.who).name) : d.short;
  let h = `<section class="convo" aria-label="Conversation with ${esc(nm)}">`;
  if (ui.said) h += `<p class="said"><span class="said-b">${esc(ui.said)}</span><span class="said-k">You</span></p>`;
  if (node && node.choices) h += `<div class="replies" role="group" aria-label="Your reply"><p class="replies-k">Your reply<button class="cv-away" data-act="close">Step away</button></p>${mixOrder(node.choices.length, ui.dlg.id).map((i, k) => `<button class="cv-reply" data-act="dlg" data-i="${i}"><kbd aria-hidden="true">${k + 1}</kbd><span>${esc(node.choices[i].label)}</span></button>`).join('')}</div>`;
  else h += `${ui.dlgReview ? reviewHTML(ui.dlgReview, rev ? 'Why it matters' : undefined) : ''}<div class="convo-f"><button class="btn btn-primary" data-act="close">Continue</button></div>`;
  return h + '</section>';
}
/* Bubbles point at whoever is speaking: map the speaker's head from scene coordinates to the screen. */
export function placeBubbles(root) {
  const rt = (root || document).querySelector('.room-top'), sv = rt && rt.querySelector('svg.scene'); if (!sv || !G.s || !G.s.loc) return;
  const d = def(G.s.loc); if (!d) return;
  const M = sv.getScreenCTM(), R0 = rt.getBoundingClientRect(); if (!M || !R0.width) return;
  const narrow = innerWidth <= 760, sm = d.look.small || 0;
  const pt = (x, y) => { const q = sv.createSVGPoint(); q.x = x; q.y = y; const o = q.matrixTransform(M); return { x: o.x - R0.left, y: o.y - R0.top }; };
  const blockers = [...rt.querySelectorAll('.nameplate .plate, .plate-btns')].map((e) => e.getBoundingClientRect()).filter((z) => z.width).map((z) => ({ l: z.left - R0.left, r: z.right - R0.left, t: z.top - R0.top, b: z.bottom - R0.top }));
  rt.querySelectorAll('.sb').forEach((b) => {
    const fam = b.dataset.anchor === 'fam', talking = b.classList.contains('talking');
    const hx = fam ? 963 : 515, hy = fam ? 250 : (sm ? 150 + (1 - sm) * 330 : 150), hr = fam ? 38 : d.look.head.h * (sm || 1);
    const c = pt(hx, hy), r = Math.abs(pt(hx + hr, hy).x - c.x);
    b.style.cssText = ''; b.dataset.side = '';
    if (narrow) {
      // Phones: the conversation bubble sits under the scene (tail up); the idle one floats at the top (tail down).
      // Idle: over the bed when the head is high in the frame, at the top when it's low (a baby in a crib).
      b.style.setProperty('--tx', Math.max(26, Math.min(R0.width - 26, c.x)) + 'px');
      // The family's button goes on the opposite edge from the patient's bubble.
      const SH = sv.getBoundingClientRect().height, low = pt(515, sm ? 150 + (1 - sm) * 330 : 150).y > SH * .5;
      b.dataset.side = talking ? 'up' : fam ? (low ? 'famlo' : 'fam') : low ? 'down' : 'below';
      if (!talking) { const atTop = fam ? !low : low; b.style.top = Math.max(10, atTop ? 10 : SH - b.offsetHeight - 10) + 'px'; }
      return;
    }
    if (b.dataset.anchor === 'side') { b.dataset.side = 'none'; b.style.left = '50%'; b.style.top = '12px'; b.style.transform = 'translateX(-50%)'; b.style.width = Math.min(440, R0.width - 40) + 'px'; return; }
    const maxW = talking ? 420 : fam ? 230 : 300;
    let P = { x: c.x - r * (fam ? 1.15 : .95), y: c.y + r * .25 }, side = 'l', avail = P.x - 16 - 12;
    if (avail < 220 && !fam) { P = { x: c.x + r * .95, y: P.y }; side = 'r'; avail = R0.width - P.x - 16 - 12; }
    const w = Math.max(150, Math.min(maxW, avail));
    b.style.width = w + 'px';
    const left = side === 'l' ? P.x - 16 - w : P.x + 16, h = b.offsetHeight;
    let top = P.y - h * .62, minTop = 10;
    blockers.forEach((z) => { if (left < z.r && left + w > z.l) minTop = Math.max(minTop, z.b + 8); });
    top = Math.max(minTop, Math.min(top, R0.height - h - 10)); if (top < 10) top = 10;
    Object.assign(b.style, { left: left + 'px', top: top + 'px' });
    b.style.setProperty('--ty', Math.max(16, Math.min(h - 16, P.y - top)) + 'px');
    b.dataset.side = side;
  });
}
addEventListener('resize', () => { if (ui.view === 'room') placeBubbles(); });

export function receiptHTML(d) {
  if (ui.receipt && ui.receipt.at !== undefined && G.s && G.s.t !== ui.receipt.at) ui.receipt = null;   // the clock has moved since: it's stale
  const r = ui.receipt; if (!r || r.pid !== d.id) return '';
  return `<div class="receipt" role="status"><div class="rc-h"><b>${esc(r.label)}</b><span class="rc-t">${E.clock(r.t0)} → ${E.clock(r.t1)} · +${r.t1 - r.t0} min</span><button class="rc-x" data-act="rc-x" aria-label="Dismiss">${ICON.close}</button></div>${r.text ? `<p class="rc-tx">${esc(r.text)}</p>` : ''}${vitDelta(r, d)}</div>`;
}
export function vRoom() {
  const d = def(G.s.loc), P = G.s.p[d.id], Ax = A();
  const v = Ax.lastVitals(d.id), fl = d.scene(G.s, P, Ax), st = d.status(G.s, P, Ax);
  let sceneSvg = A_.room(d, G.s, P, fl, rigV(d.id), P.callLight || !!P.bell, st === 'urgent');
  if (ui.ov === 'dialog' && ui.dlg) sceneSvg = sceneSvg.replace('<svg class="scene', '<svg inert class="scene');   // the room holds still while you talk
  const looks = [...sceneSvg.matchAll(/data-act="clue" data-id="([^"]+)" tabindex="0" role="button" aria-label="([^"]+)"/g)].map((x) => [x[1], x[2]]);
  if (!PANES.some((p) => p[0] === ui.dock)) ui.dock = 'brain';
  const pane = PANES.find((p) => p[0] === ui.dock), cnt = railCounts(d, P);
  const logs = G.s.log.filter((l) => l.pid === d.id).slice().reverse();
  const ab = { T: abn(d, 'T', v.T), HR: abn(d, 'HR', v.HR), BP: abn(d, 'SBP', v.SBP), RR: abn(d, 'RR', v.RR), SpO2: abn(d, 'SpO2', v.SpO2) };
  // An acute trigger outranks the chart: a low SpO₂ that is lower than the reading before it is an alarm, not a number.
  const pv = P.vit.length > 1 ? P.vit[P.vit.length - 2] : null, falling = !!(ab.SpO2 && pv && v.SpO2 < pv.SpO2);
  const alarm = (k) => (k === 'SpO2' && falling ? ' alarm' : '');
  const bg = P.bgs && P.bgs.length ? P.bgs[P.bgs.length - 1] : null;
  const body = ui.dock === 'brain' ? paneBrain(d, P) : ui.dock === 'assess' ? paneAssess(d, P) : ui.dock === 'care' ? paneCare(d, P) : ui.dock === 'meds' ? paneMeds(d, P) : paneTalk(d, P);
  const talking = ui.ov === 'dialog' && !!ui.dlg;
  return `<main class="roomv ${talking ? 'talking' : ''}">
    <div class="room-top ${/\bmon-2\b/.test(sceneSvg.slice(0, 200)) ? 'alarming' : ''} ${ui.enter ? 'enter' : ''} ${ui.flash ? 'flash-' + ui.flash : ''} ${talking ? 'talking' : ''}">
      ${sceneSvg}
      ${speech(d, P, fl)}
      <div class="nameplate"><div class="plate"><h2>${esc(d.name)} <small>${ageSex(d)}, ${d.room}</small></h2><div class="muted" style="font-size:.88rem">${esc(liveDef(d).dx)}</div>
        <button class="vmini" data-act="chart" data-pid="${d.id}" data-tab="vitals" aria-label="Last vitals at ${E.clock(v.t)}. Open the flowsheet.">${[['T', fT(v.T), ab.T], ['HR', v.HR, ab.HR], ['BP', `${v.SBP}/${v.DBP}`, ab.BP], ['RR', v.RR, ab.RR], ['SpO₂', v.SpO2 + '%', ab.SpO2, 'SpO2']].map(([k, x, a, id]) => `<span class="${a ? 'ab' : ''}${alarm(id)}"><i>${k}</i>${x}${alarm(id) ? '<b class="fall" aria-label="falling">↓</b>' : ''}</span>`).join('')}<small>${E.clock(v.t)}</small></button>
        <div class="facts">${prioN(d.id) ? `<button class="chip prio-chip" data-act="roster" title="Your priority list">#${prioN(d.id)} on your list</button>` : ''}${legal(d)}<span class="chip">${esc(liveDef(d).code)}</span><span class="chip ${/No known/.test(liveDef(d).allergies) ? '' : 'alert'}">${esc(liveDef(d).allergies.split('.')[0])}</span>${P.read ? `<span class="chip read st-${P.read.st}" title="How ${esc(d.short)} looked after your last action">${esc(stName(P.read.st))}${trend(P)}</span>` : ''}</div></div>
        <div class="plate-btns"><button class="btn" data-act="chart" data-pid="${d.id}">${ICON.chart}Chart</button><button class="btn" data-act="back">${ICON.back}Back to station</button></div></div>
      ${ui.caption && !ui.captionPoke && !talking ? `<div class="caption ${ui.captionQuiet ? 'quiet' : ''}" role="status">${esc(ui.caption)}</div>` : ''}
    </div>
    ${talking ? '' : nextHere(d, P)}
    ${talking ? convoTray(d) : ''}
    ${looks.length && !talking ? `<div class="lookaround" role="group" aria-label="Look around the room"><span>Look at</span>${looks.map(([id, l]) => `<button class="look" data-act="clue" data-id="${id}" aria-label="${l}">${esc(l.replace(/^(Meal|Bedside|Cardiac|Oxygen) /, '').replace(/ and pump$| on the table$/, ''))}</button>`).join('')}</div>` : ''}
    <div class="ws" ${talking ? 'inert' : ''}>
      <nav class="rail" role="tablist" aria-label="Activities for ${esc(d.short)}">
        ${PANES.map(([id, l]) => `<button role="tab" class="rt ${cnt[id][1]}" data-act="dock" data-id="${id}" aria-selected="${ui.dock === id}">${AI[id]}<span class="rt-l">${l}</span><span class="rt-s">${esc(cnt[id][0])}</span></button>`).join('')}
        <button class="rt rt-chart" data-act="chart" data-pid="${d.id}">${AI.chart}<span class="rt-l">Chart</span><span class="rt-s">Labs, orders, notes</span></button>
      </nav>
      <section class="pane" role="tabpanel" aria-label="${pane[1]}">
        <header class="pane-h"><h3>${pane[1]}<span> · ${esc(d.short)}, ${d.room}</span></h3><p>${pane[2]}</p>${stuckTip('room')}</header>
        <div class="pane-b">${receiptHTML(d)}${body}</div>
      </section>
      <aside class="doc" aria-label="Vitals and documentation">
        <div class="vstrip tap" aria-label="Last recorded vitals, ${E.clock(v.t)}: temperature ${fT(v.T)}, heart rate ${v.HR}, blood pressure ${v.SBP} over ${v.DBP}, respiratory rate ${v.RR}, SpO₂ ${v.SpO2}%${bg ? `, glucose ${bg.val}` : ''}. Open the vitals flowsheet." data-act="chart" data-pid="${d.id}" data-tab="vitals" role="button" tabindex="0">
          <div class="${ab.T ? 'ab' : ''}"><span>Temp</span><b>${fT(v.T)}</b></div><div class="${ab.HR ? 'ab' : ''}"><span>HR</span><b>${v.HR}</b></div><div class="${ab.BP ? 'ab' : ''}"><span>BP</span><b>${v.SBP}/${v.DBP}</b></div><div class="${ab.RR ? 'ab' : ''}"><span>RR</span><b>${v.RR}</b></div><div class="${ab.SpO2 ? 'ab' : ''}${alarm('SpO2')}"><span>SpO₂${falling ? ` <em class="fall">falling, was ${pv.SpO2}%</em>` : ''}</span><b>${v.SpO2}%</b></div>${bg ? `<div class="${bg.val < 70 || bg.val > 250 ? 'ab' : ''}"><span>Glucose</span><b>${bg.val}</b></div>` : ''}
        </div>
        <div class="vcap">Recorded ${E.clock(v.t)} by ${esc(v.by)}${G.s.t - v.t > 60 ? ', <b>over an hour ago</b>' : ''}</div>
        <h4 class="doc-h">Shift documentation</h4>
        <ul class="feed" aria-live="polite">${logs.length ? logs.map((l) => `<li class="k-${l.kind} ${l.id > ui.newLogSeen ? 'new' : ''}"><span class="tm">${E.clock(l.t)}</span><span class="tx">${l.kind === 'find' ? `<b>${esc(l.label || '')}</b>` : ''}${esc(l.text)}</span></li>`).join('') : `<li><span class="tm"></span><span class="tx muted">You're at the bedside. Start with what you see.</span></li>`}</ul>
      </aside>
    </div></main>`;
}

/* A decision already made in a conversation isn't offered again word for word: talking again gets a short
   follow-up instead (the choice, its score and its consequences stay with the first answer). */
export function again(d, cid, fam) {
  const node = cid && C().dialogs[cid], rec = (G.s.doneDlg || {})[cid];
  if (!node || !node.choices || node.repeat || !rec || rec.bad) return cid;   // a conversation that went badly can be tried again
  const id = `again:${cid}`, nm = fam ? d.family.name : d.short, L = !fam && d.look && d.look.lines;
  if (!C().dialogs[id]) C().dialogs[id] = { who: node.who, pid: d.id, text: `You've already talked this through with ${nm}. ${L && L.calm ? `"${L.calm}"` : `${nm} nods. Nothing new since you last spoke.`}` };
  return id;
}
/* What to do in this room, right now: the top of the To-do list as one button. Done here? Point at the next room. */
export function nextHere(d, P) {
  const r = nextFor(d.id);
  if (r) return `<div class="nh ${r.late && !r.blocked ? 'late' : r.stat ? 'stat' : ''}"><span class="nh-k">${r.late && !r.blocked ? 'Overdue here' : r.stat ? 'Needs you now' : 'Next here'}</span>${r.go ? (() => { const dsys = r.go.act === 'dock' && r.go.id === 'assess' && r.sys && !r.blocked ? SYS.find((x) => x[0] === r.sys) : null;   // an assessment is one tap: the bar does it, and says what it costs
    return `<button class="nh-go"${dsys ? ` data-act="nh-assess" data-sys="${esc(r.sys)}"` : goData(r)}><b>${esc(r.text)}</b><small>${dsys ? `${esc(dsys[1])} now · ${dsys[2]} min` : r.sub ? esc(clip(r.sub, 90)) : ''}</small><span aria-hidden="true">›</span></button>`; })() : `<p class="nh-go static"><b>${esc(r.text)}</b>${r.sub ? `<small>${esc(clip(r.sub, 90))}</small>` : ''}</p>`}</div>`;
  const o = nowRows().find((x) => x.pid !== d.id && !x.blocked);
  return `<div class="nh ok"><span class="nh-k">Caught up here</span>${o ? `<button class="nh-go" data-act="do-next" data-pid="${o.pid}"><b>${o.rp ? 'Give report' : `${esc(def(o.pid).room)} ${esc(def(o.pid).short)} needs you next`}</b><small>${esc(o.text)}</small><span aria-hidden="true">›</span></button>` : `<button class="nh-go" data-act="back"><b>Back to the station</b><small>Nothing due anywhere right now. You can skip ahead from there.</small><span aria-hidden="true">›</span></button>`}</div>`;
}

/* ------------ critical moment: the screen goes dark and the patient comes forward ------------ */
export function ovCrit() {
  const m = G.s.inbox.find((x) => x.id === ui.crit), d = def(m.pid), P = G.s.p[d.id], w = who(m.from), g = gone(P), inRoom = ui.view === 'room' && G.s.loc === d.id;
  return `<div class="crit" role="alertdialog" aria-modal="true" aria-labelledby="crit-h" aria-describedby="crit-tx">
    <div class="crit-dim" aria-hidden="true"></div>
    <div class="crit-stage">
      <div class="crit-spot"><span class="crit-ring"></span><span class="crit-ring r2"></span>${R.bust(d.id, rigV(d.id), 'crit-bust')}</div>
      <svg class="crit-ecg" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 34 H210 l10 -4 8 4 h16 l8 -28 10 50 8 -30 7 8 h40 l12 -6 10 6 H600"/></svg>
      <p class="crit-k">${g ? 'Critical event' : 'Urgent'} · ${E.clock(m.t)}</p>
      <h2 id="crit-h">${d.room} ${esc(d.short)}</h2>
      <p class="crit-tx" id="crit-tx">${esc(m.text)}</p>
      <p class="crit-from">${faceOf(m.from)}<span><b>${esc(w.name)}</b> ${esc(w.role)}</span></p>
      ${(() => { if (!fbNow()) return ''; const why = G.s.judg.filter((j) => j.pid === d.id && j.delta < 0 && Math.abs(j.t - m.t) <= 1); return why.length ? `<div class="crit-why">${why.map((j) => `<span class="rv-k">Why this happened</span><b>${esc(j.text)}</b><p>${esc(j.why)}</p>`).join('')}</div>` : ''; })()}
      <div class="crit-f">${g ? `<button class="btn btn-crit" data-act="crit-x">Continue</button><button class="btn crit-later" data-act="chart" data-pid="${d.id}">Open chart</button>` : inRoom ? `<button class="btn btn-crit" data-act="crit-x">Back to the bedside</button>` : `<button class="btn btn-crit" data-act="crit-go" data-pid="${d.id}">Go to ${d.room} now <span aria-hidden="true">→</span></button><button class="btn crit-later" data-act="crit-x">Not now</button>`}</div>
    </div></div>`;
}

/* ------------ consequence card ------------ */
export function vitDelta(r, d) {
  const V = r.vNew, Vp = r.vPrev;
  const dlt = (k, lab, fmt, hi, lo) => { const a = V[k], b = Vp ? Vp[k] : null; const diff = b === null || b === undefined ? 0 : a - b; const ab = a > hi || a < lo; return `<div class="${ab ? 'ab' : ''}"><span>${lab}</span><b>${fmt(a)}</b>${diff ? `<em class="${diff > 0 ? 'up' : 'dn'}" aria-label="${diff > 0 ? 'up' : 'down'} from ${fmt(b)}">${diff > 0 ? '▲' : '▼'} ${fmt(Math.abs(diff))} <small>from ${fmt(b)}</small></em>` : Vp ? `<em>same as before</em>` : ''}</div>`; };
  return V ? `<div class="res-vit">${dlt('T', 'Temp', (x) => (+x).toFixed(1), norm(d, 'T')[1], norm(d, 'T')[0])}${dlt('HR', 'HR', (x) => Math.round(x), norm(d, 'HR')[1], norm(d, 'HR')[0])}${dlt('SBP', 'Systolic', (x) => Math.round(x), norm(d, 'SBP')[1], norm(d, 'SBP')[0])}${dlt('RR', 'RR', (x) => Math.round(x), norm(d, 'RR')[1], norm(d, 'RR')[0])}${dlt('SpO2', 'SpO₂', (x) => Math.round(x) + '%', 101, norm(d, 'SpO2')[0] - 1)}</div>${Vp ? `<p class="res-since">Compared with ${E.clock(Vp.t)} (${esc(Vp.by)})</p>` : ''}` : '';
}
export function ovResult() {
  const r = ui.res, d = def(r.pid), changed = r.st0 !== r.st1, dir = !changed ? 0 : r.st1 === 'gone' ? 0 : stRank(r.st1) > stRank(r.st0) ? 1 : -1;
  const vit = vitDelta(r, d);
  const mins = r.t1 - r.t0;
  const intro = r.crit ? `<div class="res-intro ${r.crit}" aria-hidden="true"><div class="crit-spot"><span class="crit-ring"></span><span class="crit-ring r2"></span>${R.bust(r.pid, rigV(r.pid), 'crit-bust')}</div><b>${r.crit === 'worse' ? (r.st1 === 'urgent' || r.alerts.length ? 'Needs you now' : 'Getting worse') : 'Turning point'}</b><span>${esc(d.room)} ${esc(d.short)}${changed ? `: ${esc(stName(r.st0))} → ${esc(stName(r.st1))}` : ''}</span></div>` : '';
  const alerts = (r.alerts || []).map((a) => `<div class="res-alert">${faceOf(a.from)}<p><b>${esc(who(a.from).name)}</b>${esc(a.text)}</p></div>`).join('');
  return `<div class="scrim res-scrim ${r.crit ? 'crit-' + r.crit : ''}" data-act="${r.crit ? '' : 'res-close'}" data-scrim="1">${intro}<div class="res ${dir > 0 || r.crit === 'worse' || (fbNow() && (r.review || []).some((j) => j.delta <= -2)) ? 'worse' : dir < 0 ? 'better' : ''} ${r.crit ? 'late-in' : ''}" role="dialog" aria-modal="true" aria-label="${esc(r.label)}" data-k="${r.id}">
    <div class="res-top">${pface(r.pid)}<div><span class="res-k">${esc(d.room)} ${esc(d.short)}</span><h2>${esc(r.label)}</h2></div>
      <div class="res-clock" aria-label="${mins} minutes, ${E.clock(r.t0)} to ${E.clock(r.t1)}"><span>${E.clock(r.t0)}</span><i aria-hidden="true"></i><b>${E.clock(r.t1)}</b><small>+${mins} min</small></div></div>
    <div class="res-bar" aria-hidden="true"><i style="--from:${(r.t0 / C().length * 100).toFixed(1)}%;--to:${(r.t1 / C().length * 100).toFixed(1)}%"></i></div>
    ${r.text ? `<p class="res-text">${esc(r.text)}</p>` : ''}
    ${reviewHTML(r.review)}
    ${alerts}
    ${(r.done || []).length ? `<div class="res-done"><span class="res-cl">Checked off</span><ul>${r.done.map((x, i) => `<li style="--i:${i}"><span class="gcheck" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5"/><path d="M7 12.5l3.2 3.2L17.2 8.6"/></svg></span><s>${esc(x)}</s></li>`).join('')}</ul></div>` : ''}
    ${vit}
    ${changed ? `<div class="res-cond chg"><span class="res-cl">Overall, since you came in</span><span class="pill st-${r.st0} was">${esc(stName(r.st0))}</span><span class="res-arrow" aria-hidden="true">→</span><span class="pill st-${r.st1} now">${esc(stName(r.st1))}</span></div>` : ''}
    ${(r.meanwhile || []).length ? `<div class="res-mw"><span class="res-cl">Meanwhile, while you were here</span><ul>${r.meanwhile.map((x) => `<li><b>${esc(x.pid)} ${esc(def(x.pid).short)}</b> ${esc(x.text)} is now overdue</li>`).join('')}</ul></div>` : ''}
    ${r.msgs ? `<button class="res-msgs" data-act="res-inbox">${ICON.msg}<span>While you were busy: <b>${r.msgs} new message${r.msgs === 1 ? '' : 's'}</b></span><span aria-hidden="true">›</span></button>` : ''}
    <div class="res-f"><button class="btn btn-primary" data-act="res-close">Continue</button></div>
  </div></div>`;
}

export const PREP = { vitals: ['Take vital signs', 4], apical: ['Count apical pulse and BP', 2], pain: ['Assess pain and sedation', 2], bg: ['Check glucose', 3], intake: ['Check breakfast tray', 1], ciwa: ['Score CIWA-Ar', 4], strip: ['Look at the monitor strip', 1], labs: ['Review the morning labs', 2] };
/* PRN safety net for orders that don't define their own limit: the frequency on the order is the limit, the way
   a dispensing cabinet enforces it. "Every 6 h" waits 6 hours, "every 5 min ×3" stops after three, "Once" is once. */
export function prnLimit(m, st) {
  if (!m.prn || m.infusion || !st || !st.given || !st.given.length) return null;
  const f = String(m.freq || ''), last = st.given[st.given.length - 1], n = st.given.length;
  if (/^\s*once\b/i.test(f) || /\bonce,/i.test(f)) return `Given at ${E.clock(last)}. This is a one-time order.`;
  const x = /(?:×|x)\s*(\d+)/i.exec(f); if (x && n >= +x[1]) return `Given ${n} times (last ${E.clock(last)}). The order allows ${x[1]}. Call the provider for more.`;
  const e = /every\s+(\d+(?:\.\d+)?)(?:\s*(?:to|–|-)\s*\d+)?\s*(min|minutes|h|hr|hours?)\b/i.exec(f); if (!e) return null;
  const gap = +e[1] * (/^m/i.test(e[2]) ? 1 : 60);
  return G.s.t - last < gap ? `Given at ${E.clock(last)}. Next dose available at ${E.clock(last + gap)} (${f.split(/[,;]/)[0].toLowerCase()}).` : null;
}
export function ovMed() {
  const d = def(G.s.loc), P = G.s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id), st = G.s.meds[m.id], Ax = A();
  const checks = m.checks ? m.checks(G.s, P, Ax) : [];
  const block = m.block ? m.block(G.s, P, Ax) : prnLimit(m, st);
  const done = (!m.prn && (st.status === 'given' || st.status === 'held')) || (m.ordered && st.status === 'held');
  const verify = st.status === 'verify';
  const refuse = !done && !block && !verify && m.refuse ? m.refuse(G.s, P, Ax) : null;
  let body = `<div class="order"><b>${esc(m.name)} ${esc(medDose(m))} ${m.route}</b>, ${esc(m.freq)}${m.indication ? `<br><span class="muted">${esc(m.indication)}</span>` : ''}${m.param ? `<br><b>${esc(m.param)}</b>` : ''}</div>
    <p class="muted" style="margin:.2rem 0">Allergies: ${esc(liveDef(d).allergies)}</p>
    <ul class="checks">${checks.map((c) => `<li><span class="g ${c.ok === true ? 'ok' : c.ok === false ? 'bad' : 'na'}" aria-hidden="true">${c.ok === true ? '✓' : c.ok === false ? '!' : '•'}</span><span>${esc(c.label)}<small>${esc(c.value)}</small></span></li>`).join('')}</ul>`;
  if (m.prep && m.prep.length && !done) body += `<p class="muted" style="margin:.6rem 0 0;font-size:.88rem">Get what you need before deciding:</p><div class="prep">${m.prep.map((p) => { const x = (def(G.s.loc).interventions || []).find((i) => i.id === p), lab = PREP[p] || (x ? [x.label, x.cost] : null); if (!lab) return ''; const lf = G.s.log.slice().reverse().find((l) => l.pid === d.id && l.kind === 'find' && [lab[0], x && x.label, p === 'vitals' && 'Vital signs', p === 'pain' && sysL('pain', (SYS.find((y) => y[0] === 'pain') || [])[1] || '')].includes(l.label) && G.s.t - l.t <= 30); return lf ? `<button class="btn prep-done" data-act="prep" data-p="${p}" aria-label="${esc(lab[0])}: done at ${E.clock(lf.t)}. Again, ${lab[1]} minutes">${ICON.tick}${esc(lab[0])} <span class="muted">done ${E.clock(lf.t)} · again ${lab[1]} min</span></button>` : `<button class="btn" data-act="prep" data-p="${p}">${esc(lab[0])} <span class="muted">${lab[1]} min</span></button>`; }).join('')}</div>`;
  if (ui.med.note) body += `<div class="warnbox" role="status">${esc(ui.med.note)}</div>`;
  if (block) body += `<div class="warnbox">${esc(block)}</div>`;
  if (refuse) body += `<div class="warnbox">${esc(refuse)}</div>${m.prn ? '' : '<p class="muted" style="margin:.4rem 0 0;font-size:.88rem">You can come back and offer it again, or hold it and document the refusal.</p>'}`;
  if (verify) { const ph = (d.interventions || []).concat(d.comms || []).find((x) => /pharmac/i.test(x.label) && (!x.avail || x.avail(G.s, P, Ax))), tab = ph && (d.interventions || []).includes(ph) ? 'Care' : 'Talk & call'; const eta = m.eta ? m.eta(G.s, P) : null;   // a case can say when pharmacy will release it
    body += eta !== null && eta !== undefined ? `<div class="warnbox">Pharmacy is verifying this order now. Expect it to be released about ${E.clock(eta)}; you'll get a message when it is.</div>` : `<div class="warnbox">On hold at pharmacy: they haven't verified this order, so it can't be dispensed, and it stays on hold until they get what they need.${ph ? ` To find out what they need, use <b>${esc(ph.label)}</b> on the ${tab} tab.` : ' Check your messages: pharmacy usually says what they need to release it.'}</div>`; }
  if (done) body += `<div class="warnbox">${st.status === 'given' ? 'Given' : 'Held'} at ${E.clock(st.at)}.${st.note ? ' ' + esc(st.note) : ''}</div>`;
  if (m.doses && !block && !verify && !refuse) body += `<fieldset style="border:0;padding:0;margin:.6rem 0"><legend style="font-weight:600;margin-bottom:.2rem">Dose</legend>${m.doses.map((x) => `<label class="opt"><input type="radio" name="dose" value="${x.id}" ${ui.med.dose == x.id ? 'checked' : ''} data-act="dose" data-v="${x.id}"><span>${esc(x.label)}</span></label>`).join('')}</fieldset>`;
  // Before the reason: say plainly when nothing on the checks meets the order's hold criteria.
  if (ui.med.holding && m.param && !ui.med.paramOk) { const ck = checks.filter((c) => c.ok === true || c.ok === false); if (ck.length && ck.every((c) => c.ok === true)) body += `<div class="warnbox" role="alert"><b>Nothing here meets the hold criteria.</b> ${esc(m.param.replace(/\.$/, ''))}. ${esc(ck.map((c) => `${c.label} ${c.value}`).join(', '))}. By the order, this dose is given. Hold only for a reason you can name.</div>`; }
  if (ui.med.holding) body += `<fieldset style="border:0;padding:0;margin:.6rem 0"><legend style="font-weight:600;margin-bottom:.2rem">Reason for holding</legend>${['Meets the hold parameter', 'Condition changed, clarify with provider', 'Not enough intake', 'Patient declined'].map((r, i) => `<label class="opt"><input type="radio" name="hr" data-act="hreason" data-v="${i}" ${ui.med.reason == i ? 'checked' : ''}><span>${r}</span></label>`).join('')}</fieldset>`;
  let foot = '';
  if (done && st.status === 'held' && !block) foot += `<button class="btn" data-act="med-unhold">Undo the hold <span style="font-weight:400;opacity:.8">so you can give it</span></button>`;
  if (!done && !block && !verify) {
    if (ui.med.holding) foot += `<button class="btn btn-primary" data-act="med-hold" ${ui.med.reason == null ? 'disabled data-why="Choose a reason for holding first."' : ''}>Hold this dose</button>`;
    else {
      if (!m.prn || m.ordered) foot += `<button class="btn" data-act="med-holdask">Hold</button>`;
      if (refuse) foot += `<button class="btn btn-primary" data-act="med-declined">Offer again later <span style="font-weight:400;opacity:.8">2 min</span></button>`;
      else { const dl = m.doses && ui.med.dose != null ? m.doses.find((x) => x.id == ui.med.dose) : null, dshort = dl ? dl.label.split(/ \(|: /)[0] : '', what = m.infusion ? (dshort ? `Set the pump: ${dshort}` : 'Set the pump') : `Give ${esc(m.name)}${dshort ? ' ' + dshort : ''}`;
        foot += `<button class="btn btn-primary holdbtn" data-act="med-give" data-hold="1" data-hk="med-give:${m.id}" ${m.doses && ui.med.dose == null ? 'disabled data-why="Choose a dose first."' : ''}><i class="hold-fill" aria-hidden="true"></i><span class="hold-l">${esc(what)}<small class="hold-how">Press and hold, or tap twice</small></span> <span style="font-weight:400;opacity:.8">${P.medPassAt !== undefined && G.s.t - P.medPassAt <= 6 ? '2 min, same med pass' : '5 min'}</span></button>`; }
    }
  }
  return sheet(esc(m.name), body, foot, { label: 'Medication ' + m.name });
}

// Medications given to this patient this shift, newest first: what the nurse could report as a possible error.
export function givenList(d) {
  const out = [];
  (d.meds || []).forEach((m) => { const st = G.s.meds[m.id]; if (!st) return; (m.prn ? st.given : st.status === 'given' && st.at !== null ? [st.at] : []).forEach((t) => out.push({ mid: m.id, t, name: lcFirst(m.name) })); });
  return out.sort((a, b) => b.t - a.t).slice(0, 8);
}
/* SBAR: what the nurse has already done for this patient, from the shift log, so a call always reflects the
   latest actions even where the case's own findings list doesn't. Skips anything a case item already says. */
export function doneFor(pid, items) {
  const latest = new Map();
  G.s.log.forEach((l) => { if (l.pid === pid && l.label && (l.kind === 'act' || l.kind === 'find')) latest.set(l.label, l); });
  const have = items.filter((i) => i.need).map((i) => i.label.toLowerCase());
  return [...latest.values()].filter((l) => {
    const m = l.label.match(/^(.+?) (given|held|declined|offered, declined)$/); if (!m) return true;
    const k = m[1].toLowerCase().split(/[ ,(]/)[0];
    return !have.some((h) => h.includes(k) && (m[2] === 'given' ? /\b(gave|given|after)\b/.test(h) : /\b(held|hold|declin|refus)/.test(h)));
  }).sort((a, b) => b.t - a.t).slice(0, 8);
}
export function didText(l) {
  const m = l.label.match(/^(.+?) (given|held|declined|offered, declined)$/), c = lcFirst;
  const inf = l.label.match(/^(.+?) (stopped|rate changed|checked, no change)$/);
  if (inf) return inf[2] === 'stopped' ? `Stopped the ${c(inf[1])}` : inf[2] === 'rate changed' ? `Changed the ${c(inf[1])} rate` : `Checked the ${c(inf[1])}: no change`;
  if (m) return m[2] === 'given' ? `Gave ${c(m[1])}` : m[2] === 'held' ? `Held ${c(m[1])}` : `${m[1]}: offered, patient declined`;
  const x = l.label.replace(/ \((ordered|protocol[^)]*|new order)\)$/i, ''), w = x.split(' ')[0], past = PAST[w];
  return past ? past + x.slice(w.length) : `Done: ${c(x)}`;
}

export function ovDeleg() {
  const tasks = C().delegation.tasks.filter((t) => !t.avail || t.avail(G.s));
  const active = G.s.deleg.filter((x) => !x.done), sug = aideSuggest(), nm = esc(cna().name);
  const note = C().delegation.note ? C().delegation.note(G.s) : '';
  const lab = (x) => C().delegation.tasks.find((t) => t.id === x.id).label;
  const fin = G.s.deleg.filter((x) => x.done).slice(-3).reverse();
  const board = active.length || fin.length ? `<div class="dl-board">${active.length ? `<h4>${nm} is working on</h4><ul>${active.map((x) => `<li class="dl-row ${ui.delegNew === x.id + ':' + x.pid + ':' + x.at ? 'sent' : ''}"><span class="dl-l"><b>${esc(lab(x))}</b><small>${x.pid} ${esc(def(x.pid).short)} · back about ${E.clock(x.due)}</small></span><span class="dl-bar" aria-hidden="true"><i style="width:${Math.min(100, Math.max(6, (G.s.t - x.at) / Math.max(1, x.due - x.at) * 100)).toFixed(0)}%"></i></span></li>`).join('')}</ul>` : ''}${fin.length ? `<h4>Finished</h4><ul>${fin.map((x) => `<li class="dl-row fin"><span class="gcheck" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5"/><path d="M7 12.5l3.2 3.2L17.2 8.6"/></svg></span><span class="dl-l"><s>${esc(lab(x))}</s><small>${x.pid} ${esc(def(x.pid).short)} · done ${E.clock(x.due)}</small></span></li>`).join('')}</ul>` : ''}</div>` : '';
  const offer = sug.length ? `<div class="dl-sug"><h4>${nm} suggests</h4>${sug.map((x) => `<button class="dl-s" data-act="deleg" data-t="${x.t.id}" data-pid="${x.pid}"><span class="dl-l"><b>${esc(x.t.label)}</b><small>${x.pid} ${esc(def(x.pid).short)} · ${esc(x.why)}</small></span><span class="dl-go">Ask</span></button>`).join('')}<p class="dl-fine">${nm} offers what's coming due. You decide who's stable enough to hand off.</p></div>`
    : `<p class="dl-fine" style="margin-top:0">"Nothing coming due that I can take. Need something?"</p>`;
  const all = `<details class="dl-all" ${sug.length ? '' : 'open'}><summary>Ask ${nm} for something else <small>${tasks.length} options</small></summary>${tasks.map((t) => `<div class="dl-task"><div class="dl-tl">${esc(t.label)}</div><div class="prep">${t.rooms.filter((r) => here(def(r)) && !gone(G.s.p[r])).map((r) => `<button class="btn" data-act="deleg" data-t="${t.id}" data-pid="${r}">${r} ${esc(def(r).short)}</button>`).join('')}</div></div>`).join('')}</details>`;
  const body = `${ui.delegMsg ? `<div class="reply" style="margin-bottom:1rem">${face(C().cna)}<p class="voice" style="margin:0">${esc(ui.delegMsg)}</p></div>${reviewHTML(ui.delegReview, 'Delegation, reviewed')}` : `<p class="dl-who">${nm} is your ${esc(/^[A-Z]{2,}/.test(cna().role) ? cna().role : cna().role.toLowerCase())}: collecting data and helping with care, like vitals, weights, walks and baths. Assessing, teaching, meds and judgment calls stay with you.</p>`}
    ${note ? `<p class="deleg-note">${esc(note)}</p>` : ''}${board}${tasks.length ? offer + all : '<p class="empty" style="padding:0">Nothing to hand off right now.</p>'}`;
  return sheet(`Ask ${nm}`, body, `<button class="btn btn-primary" data-act="close">Done</button>`, { face: face(C().cna), label: `Delegate to ${cna().name}, ${cna().role}` });
}

/* Charting a restrictive intervention: a structured note the nurse signs. Every box is a claim; the case checks
   each claim against what actually happened this shift, so the note has to be specific, complete and true. */
export function ovDoc() {
  const q = ui.doc, d = def(q.pid), P = G.s.p[q.pid], x = d.interventions.find((i) => i.id === q.id);
  if (q.done) return sheet(q.done.title, `<div class="doc-paper"><div class="doc-hd"><b>${esc(q.done.title)}</b><span>${esc(d.name)} · ${d.room} · ${E.clock(q.done.t)} · signed: you, RN</span></div><p>${esc(q.done.text)}</p></div>${reviewHTML(q.done.review, 'Your note, reviewed')}`,
    `<button class="btn btn-primary" data-act="close">Done</button>`, { label: q.done.title, wide: true });
  const f = x.form(G.s, P, A());
  const body = `${f.intro ? `<p class="doc-intro">${esc(f.intro)}</p>` : ''}${f.sections.map((sec) => { const pick = q.a[sec.id] || []; const o = mixOrder(sec.opts.length, q.id + sec.id); return `<fieldset class="doc-sec"><legend>${esc(sec.q)}</legend>${sec.hint ? `<p class="doc-hint">${esc(sec.hint)}</p>` : ''}${o.map((i) => sec.opts[i]).map((op) => `<label class="opt"><input type="${sec.one ? 'radio' : 'checkbox'}" name="doc-${sec.id}" data-act="doc-pick" data-s="${sec.id}" data-o="${op.id}" ${pick.includes(op.id) ? 'checked' : ''}><span>${esc(op.label)}</span></label>`).join('')}</fieldset>`; }).join('')}`;
  const ready = f.sections.every((sec) => (q.a[sec.id] || []).length);
  return sheet(f.title, body, `<button class="btn" data-act="close">Not yet</button><button class="btn btn-primary" data-act="doc-sign" ${ready ? '' : 'aria-disabled="true" data-why="Answer every section first."'}>Sign the note <span style="font-weight:400;opacity:.8">${x.cost} min</span></button>`, { label: f.title, wide: true });
}

export function ovNova() {
  const body = `<div class="nova-card">${face('nova')}<div>
    ${ui.nova ? `<p class="dlg-text">"${esc(ui.nova)}"</p>` : `<p class="nova-what"><b>Nova is your charge nurse.</b> Stuck, or not sure what matters most right now? Ask her for a tip. She looks at your whole assignment and tells you where she'd look next: which patient, and what to check. She won't make the call for you. Tips don't lower your score.</p>
    <p class="dlg-text">"${G.s.nova ? `You've got ${G.s.nova} tip${G.s.nova === 1 ? '' : 's'} left on me today. Use them when you're stuck.` : 'That\'s all my tips for today. You\'ve got this.'}"</p>`}
    ${G.s.novaLog.length > (ui.nova ? 1 : 0) ? `<details><summary class="muted">Earlier from Nova</summary>${G.s.novaLog.slice(0, ui.nova ? -1 : undefined).map((n) => `<p class="voice muted">${E.clock(n.t)}: ${esc(n.text)}</p>`).join('')}</details>` : ''}
  </div></div>`;
  const foot = `<button class="btn" data-act="close">Close</button>${!ui.nova && G.s.nova > 0 ? `<button class="btn btn-primary" data-act="nova-ask">Get a tip <span style="font-weight:400;opacity:.8">${G.s.nova} left</span></button>` : ''}`;
  return sheet('Nova Reyes, charge nurse', body, foot, { label: 'Ask Nova' });
}

export const trustDots = (t) => `<span class="st-tr" role="img" aria-label="Trust ${t} of ${STY.MAXR}: ${STY.TRUST[t]}">${Array.from({ length: STY.MAXR }, (_, i) => `<i class="${i < t ? 'on' : ''}"></i>`).join('')}<small>${STY.TRUST[t]}</small></span>`;
/* Choices show in a stable shuffled order per shift, so the best answer isn't always on top. */
export function mixOrder(n, key) {
  let h = 2166136261 ^ (G.s.seed || 0); for (const ch of String(key)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  const o = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { h ^= h >>> 13; h = Math.imul(h, 1540483477); const j = (h >>> 0) % (i + 1); [o[i], o[j]] = [o[j], o[i]]; }
  return o;
}
export function ovDialog() {
  if (ui.view === 'room') return '';
  if (ui.dlg.id === '__review') return sheet('Your choice', reviewHTML(ui.dlgReview, 'Why it matters'), `<button class="btn btn-primary" data-act="close">Continue</button>`, { label: 'Decision review' });
  const node = C().dialogs[ui.dlg.id];
  const w = who(node.who);
  const text = typeof node.text === 'function' ? node.text(G.s) : node.text;
  const stHead = node.story && STY ? (() => { const P = G.s.p[node.story.pid], t = STY.trust(P), nm = /^\d+$/.test(node.who) ? def(node.story.pid).short : w.name.split(' ')[0]; return `<div class="st-head"><span class="st-k">Getting to know ${esc(nm)}</span>${trustDots(t)}</div>`; })() : '';
  const body = `${stHead}<p class="dlg-text">${esc(text)}</p>${!node.choices && ui.dlgReview ? reviewHTML(ui.dlgReview) : ''}${node.choices ? mixOrder(node.choices.length, ui.dlg.id).map((i) => `<button class="choice" data-act="dlg" data-i="${i}">${esc(node.choices[i].label)}</button>`).join('') : ''}`;
  return sheet(esc(w.name), body, node.choices ? '' : `<button class="btn btn-primary" data-act="close">Continue</button>`, { face: faceOf(node.who), noScrimClose: !!node.choices });
}
