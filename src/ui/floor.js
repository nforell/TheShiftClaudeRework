/* The Shift — UI: The nurses' station: the command bar, the patient list, the phone, floor calls, follow-up after transfers, and report to the oncoming nurse. */
import { reduced, stamp } from './actions.js';
import { aideSuggest, spend } from './core.js';
import { A, A_, C, E, F, FL, FX, G, ICON, RW, admWord, ageSex, cna, cnaAway, def, esc, face, faceOf, fmtN, fromOf, gone, goneText, here, legal, liveDef, pface, prov, pts, staff, ui, who } from './ctx.js';
import { render } from './render.js';
import { awayShort, brainRows, fbNow, flowRows, ghostList, liveGhosts, oncoming, reviewHTML, stName, stRank, trend } from './room.js';
import { sheet } from './sheets.js';

/* ------------ station ------------ */
export function dueList() {
  const out = [];
  pts().forEach((d) => {
    const P = G.s.p[d.id]; if (gone(P)) return;
    (d.meds || []).forEach((m) => {
      const st = G.s.meds[m.id];
      if (m.available && !m.available(G.s, P)) return;   // a discontinued or replaced order is nobody's task
      if (m.due !== undefined && (st.status === 'due' || st.status === 'verify') && m.due <= G.s.t + 75) out.push({ pid: d.id, t: m.due, late: G.s.t > m.due + 60, text: `${d.room} ${m.name} ${m.dose}${st.status === 'verify' ? ', awaiting pharmacy' : ''}` });
    });
  });
  if (C().dueExtras) C().dueExtras(G.s, A()).forEach((x) => { if (!x.info) out.push(Object.assign({ pid: (x.text.match(/^\d{2,3}(?=\s)/) || [])[0] }, x)); });
  G.s.deleg.filter((x) => !x.done).forEach((x) => out.push({ pid: x.pid, t: x.due, late: false, text: `${cna().name}: ${C().delegation.tasks.find((t) => t.id === x.id).label.toLowerCase()}, ${x.pid}` }));
  pts().forEach((d) => { const P = G.s.p[d.id]; (gone(P) ? F.awayRows(G.s, A(), d, P) : flowRows(d, P)).filter((r) => !r.done && r.t !== null && (r.late || r.t <= G.s.t + 75)).forEach((r) => out.push({ pid: d.id, t: r.t, late: r.late, text: `${d.room} ${r.text}`, act: r.key === 'rp' ? 'report' : null })); });
  return out.sort((a, b) => a.t - b.t);
}
/* Your priority order: set at triage, re-rankable any time, shown everywhere. */
export function prioList() { const base = (G.s.prio || G.s.answers.rank || []).filter((id) => def(id) && here(def(id))); pts().forEach((d) => { if (!base.includes(d.id)) base.push(d.id); }); return base; }
export const prioN = (pid) => { if (!G.s.prio && !G.s.answers.rank) return null; const i = prioList().indexOf(pid); return i < 0 ? null : i + 1; };
export const ordinal = (n) => n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');
export const flagsFor = (pid) => G.s.brain.filter((k) => k.startsWith(pid + ':')).map((k) => def(pid).report[+k.split(':')[1]].text);
export const shortAllergy = (d) => (/No known/.test(liveDef(d).allergies) ? '' : `<span class="chip alert">Allergy: ${esc(liveDef(d).allergies.split(',')[0].split('(')[0].trim())}</span>`);
export const codeChip = (d) => (/^Full code/.test(liveDef(d).code) ? '' : `<span class="chip alert">${esc(liveDef(d).code.split(',')[0])}</span>`);

/* The roster: who is who, why they're here, what you noted, where they sit on your list. */
export function ovRoster() {
  const inShift = ui.view === 'station' || ui.view === 'room', list = G.s.prio || G.s.answers.rank ? prioList() : C().patients.filter((d) => !d.arrives).map((d) => d.id);
  const pend = C().patients.filter((d) => !here(d));
  const card = (pid, i) => {
    const d = def(pid), P = G.s.p[pid], g = gone(P), fl = flagsFor(pid), n = prioN(pid);
    const due = inShift && !g ? brainRows(d, P).filter((r) => !r.done && !r.prog && r.t !== null && (r.late || r.t <= G.s.t + 30)) : [];
    return `<article class="ro ${g ? 'gone' : ''}">
      <div class="ro-h">${n ? `<span class="ro-n" title="Your priority">${n}<small>${ordinal(n)}</small></span>` : ''}${pface(pid)}<div class="ro-who"><b>${d.room} ${esc(d.name)}</b> <small>${ageSex(d)}</small><span>${esc(liveDef(d).dx)}</span></div>
        ${G.s.prio && inShift && !g ? `<span class="ro-mv"><button class="btn" data-act="prio" data-pid="${pid}" data-d="-1" aria-label="Move ${esc(d.short)} up" ${i === 0 ? 'disabled data-why="Already first."' : ''}>${ICON.up}</button><button class="btn" data-act="prio" data-pid="${pid}" data-d="1" aria-label="Move ${esc(d.short)} down" ${i === list.length - 1 ? 'disabled data-why="Already last."' : ''}>${ICON.down}</button></span>` : ''}</div>
      <p class="ro-why"><b>Here for</b> ${esc(d.reason)}</p>
      <div class="facts">${legal(d)}<span class="chip">${esc(liveDef(d).code.split(',')[0])}</span>${shortAllergy(d)}${inShift ? `<span class="chip ${P.seenAt === null ? 'warn' : ''}">${g ? esc(goneText(P)) : lastSeen(P)}</span>` : ''}${P.read && !g ? `<span class="chip read st-${P.read.st}">${esc(stName(P.read.st))}${trend(P)}</span>` : ''}${due.length ? `<span class="chip ${due.some((r) => r.late) ? 'alert' : 'warn'}">${due.length} due</span>` : ''}</div>
      ${fl.length ? `<ul class="ro-fl">${fl.map((f) => { const k = inShift ? flagNear(f) : ''; return `<li class="${k ? 'pin-' + k : ''}"><i class="flag-ic on" aria-hidden="true"></i>${esc(f)}${k ? `<span class="sr"> (${k === 'near' ? 'coming up' : 'time passed'})</span>` : ''}</li>`; }).join('')}</ul>` : `<p class="ro-none">${ui.view === 'handoff' ? 'Nothing flagged yet.' : 'You flagged nothing from report.'}</p>`}
      ${inShift && g ? `<div class="ro-f"><button class="btn btn-primary" data-act="away" data-pid="${pid}">Follow up</button><button class="btn" data-act="chart" data-pid="${pid}">${ICON.chart}Chart</button></div>` : ''}
      ${inShift && !g ? `<div class="ro-f"><button class="btn btn-primary" data-act="goto" data-pid="${pid}">Go to ${d.room}</button><button class="btn" data-act="chart" data-pid="${pid}">${ICON.chart}Chart</button></div>` : ''}
    </article>`;
  };
  const body = `<p class="muted" style="margin-top:0">${G.s.prio ? 'In your priority order. Move patients up or down as the shift changes; this list isn\'t scored.' : 'Everyone you have today, with what you flagged in report.'}</p>
    <div class="ro-list">${list.map(card).join('')}${pend.map((d) => `<article class="ro pend"><div class="ro-h"><div class="pend-dot" aria-hidden="true"></div><div class="ro-who"><b>${d.room} ${esc(admWord(d))}</b><span>From ${esc(fromOf(d))}, about ${E.clock(d.arrives)}</span></div></div><p class="ro-why"><b>Coming for</b> ${esc(d.reason)}</p></article>`).join('')}</div>`;
  return sheet('Your patients', body, `<button class="btn btn-primary" data-act="close">Done</button>`, { wide: true, label: 'Your patients' });
}

export function ptStrip() {
  const cur = ui.view === 'room' ? G.s.loc : 'station';
  return `<nav class="pstrip ${cur === 'station' ? 'at-st' : ''}" aria-label="Station and patients"><div class="pstrip-in">
    ${(() => { const unread = G.s.inbox.filter((m) => !m.read).length, calls = (FL.open(G.s) || []).length, n = unread + calls; return `<button class="ps ps-st ${cur === 'station' ? 'on' : ''}" data-act="${cur === 'station' ? 'here' : 'back'}" ${cur === 'station' ? 'aria-current="page"' : ''} aria-label="Nurses' station${n ? `, ${unread ? unread + ' unread' : ''}${unread && calls ? ', ' : ''}${calls ? calls + ' call' + (calls > 1 ? 's' : '') + ' waiting' : ''}` : ''}"><span class="ps-top">${ICON.station}<b><span class="ps-wide">Nurses' station</span><span class="ps-narrow">Station</span></b>${n ? `<em class="${calls ? 'late' : ''}">${n}</em>` : ''}</span><small>Plan, phone, help</small></button>`; })()}<div class="ps-pts">
    ${C().patients.map((d) => {
      if (!here(d)) return `<button class="ps pend" data-act="pending" data-pid="${d.id}"><span class="ps-top"><b>${d.room}</b></span><small>Arriving ${E.clock(d.arrives)}</small></button>`;
      const P = G.s.p[d.id], g = gone(P), light = !g && (P.callLight || !!P.bell || G.s.inbox.some((m) => m.pid === d.id && m.urgent && !m.read));
      const rows = (g ? F.awayRows(G.s, A(), d, P) : brainRows(d, P)).filter((r) => !r.done && !r.prog && r.t !== null), late = rows.filter((r) => r.late).length, due = rows.filter((r) => !r.late && r.t <= G.s.t + 30).length;
      const tk = liveGhosts(d.id).length;
      const pn = prioN(d.id);
      return `<button class="ps ${cur === d.id ? 'on' : ''} ${light ? 'alert' : ''} ${g ? 'gone' : ''} ${tk ? 'ticked' : ''}" data-act="${g ? 'away' : cur === d.id ? 'here' : 'goto'}" data-pid="${d.id}" ${cur === d.id ? 'aria-current="page"' : ''} aria-label="Room ${d.room}, ${esc(d.name)}${g ? ', ' + esc(goneText(P)) + ', follow up' : ''}${late ? `, ${late} overdue` : due ? `, ${due} due` : ''}${light ? ', needs attention' : ''}"><span class="ps-top">${pn ? `<span class="ps-n" title="Your priority">${pn}</span>` : ''}<b>${d.room}</b>${P.read && !g ? `<i class="dot st-${P.read.st}" aria-hidden="true"></i>` : ''}${late ? `<em class="late">${late}</em>` : due ? `<em>${due}</em>` : ''}${tk ? `<span class="ps-tick" aria-hidden="true">✓</span>` : ''}</span><small>${esc(d.short)}</small><small class="ps-dx">${g ? esc(awayShort(P)) : esc(liveDef(d).dx)}</small></button>`;
    }).join('')}</div></div></nav>`;
}
export function dueGroups(due) {
  const li = (x) => { const ok = x.pid && def(x.pid) && here(def(x.pid)), aw = ok && gone(G.s.p[x.pid]); return `<li class="${x.late ? 'late' : ''} ${ok ? 'tap' : ''}"${ok ? ` data-act="${aw ? 'away' : x.act || 'goto'}" data-pid="${x.pid}" role="button" tabindex="0" aria-label="${aw ? 'Follow up on' : 'Go to'} ${x.pid}: ${esc(x.text)}"` : ''}><span class="tm">${E.clock(Math.max(0, x.t))}</span><span>${esc(x.text)}</span></li>`; };
  const over = due.filter((x) => x.late), now = due.filter((x) => !x.late && x.t <= G.s.t + 30), soon = due.filter((x) => !x.late && x.t > G.s.t + 30);
  const g = (t, l, c) => (l.length ? `<h4 class="due-h ${c}">${t}<span>${l.length}</span></h4><ul class="due">${l.map(li).join('')}</ul>` : '');
  const gh = ghostList(null);
  return (gh ? `<div class="due-ghosts">${gh}</div>` : '') + g('Overdue', over, 'over') + g('Due now', now, 'now') + g('Coming up', soon, 'soon');
}
export function lastSeen(P) { return P.seenAt === null ? 'Not seen yet' : `Seen ${E.clock(P.seenAt)}`; }

/* ------------ the command bar: what needs you, what's next, and a way to let time pass ------------ */
export function nowRows() {
  const out = [];
  const acu = {};
  pts().forEach((d) => { const P = G.s.p[d.id], aw = gone(P); acu[d.id] = aw ? 0 : stRank(d.status(G.s, P, A())); (aw ? F.awayRows(G.s, A(), d, P) : brainRows(d, P)).forEach((r) => { if (!r.done && !r.prog && !r.info && r.t !== null && r.t <= G.s.t) out.push({ pid: d.id, key: r.key, text: r.text + (r.blocked ? ' (awaiting pharmacy)' : ''), late: !!r.late, t: r.t, away: aw, rp: r.key === 'rp', blocked: !!r.blocked, stat: !!r.stat }); }); });
  const pr = prioList(), now = (r) => (r.stat || acu[r.pid] >= 2 ? 1 : 0);
  // What the orientation teaches: something you can act on before something you're waiting on; new orders and
  // a patient who needs you now before anything routine; then overdue work, then the sicker patient, then the clock.
  return out.sort((a, b) => a.blocked - b.blocked || now(b) - now(a) || b.late - a.late || acu[b.pid] - acu[a.pid] || a.t - b.t || pr.indexOf(a.pid) - pr.indexOf(b.pid));
}
export function nextKnown() {
  let best = null; const put = (t, text) => { if (t > G.s.t && (!best || t < best.t)) best = { t, text }; };
  pts().forEach((d) => { const P = G.s.p[d.id]; (gone(P) ? F.awayRows(G.s, A(), d, P) : brainRows(d, P)).forEach((r) => { if (!r.done && r.t !== null) put(r.t, r.prog ? r.text : `${d.room} ${r.text}`); }); });
  C().patients.forEach((d) => { if (!here(d)) put(d.arrives, `${d.room} ${admWord(d).toLowerCase()} from ${fromOf(d)}`); });
  put(C().length - 60, 'Report hour begins'); put(C().length, 'End of shift');
  return best;
}
/* The one next thing for a patient: what their To-do list would put first (overdue, then due now). */
export function nextFor(pid) {
  const d = def(pid), P = G.s.p[pid]; if (!d || !here(d) || gone(P)) return null;
  const open = brainRows(d, P).filter((r) => !r.done && !r.prog && !r.info && !r.notBefore && r.t !== null && r.t <= G.s.t + 30);
  open.sort((a, b) => !!a.blocked - !!b.blocked || !!b.stat - !!a.stat || !!b.late - !!a.late || a.t - b.t);
  return open[0] || null;
}
export const goData = (r) => (r && r.go ? ` data-act="${r.go.act}" data-id="${r.go.id}"${r.go.act === 'dock' ? ` data-hl="${esc(r.hl || r.text)}"${r.sys ? ` data-sys="${esc(r.sys)}"` : ''}` : ''}` : '');
export const rowLabel = (r) => (r.away ? `${def(r.pid).short}: ` : `${def(r.pid).room} `) + r.text;
export const FLAVOR = {
  med: ['Charting vitals and I&Os', 'Restocking the supply cart', 'Returning pages', 'Checking tomorrow\'s lab orders', 'A sip of cold coffee', 'Scanning the telemetry board'],
  psych: ['Charting behavior checks', 'A walk through the milieu', 'Returning a call from a board-and-care', 'Updating the treatment plan', 'A sip of cold coffee', 'Counting sharps with the tech'],
  ob: ['Charting fundal checks and lochia', 'Restocking pads and peri bottles', 'Answering the infant security alarm test', 'Logging feeds and diapers', 'A sip of cold coffee', 'Calling the lactation consultant back'],
  ed: ['Charting triage notes', 'Restocking the trauma bay', 'Returning a call from radiology', 'Checking the lobby board', 'A sip of cold coffee', 'Cleaning a stretcher for the next patient'],
  peds: ['Charting intake and output', 'Restocking syringes and diapers', 'Returning a page from pharmacy', 'Weighing diapers', 'A sip of cold coffee', 'Checking pump volumes'],
};
export function goalSub(x) {
  const L = C().length;
  if (x.st === 'done') return x.id === 'meds' ? 'None late' : x.id === 'calls' ? 'All answered' : 'Done';
  if (x.st === 'fail') return x.id === 'meds' ? `${x.n} late` : x.id === 'calls' ? `${x.n} missed` : x.id === 'eyes' ? `${x.n} of ${x.of} in time` : `${x.n} of ${x.of} given`;
  if (x.id === 'eyes') return `${x.n} of ${x.of} seen, due by ${E.clock(90)}`;
  if (x.id === 'report') return G.s.t >= L - 60 ? `${x.n} of ${x.of} given` : `Opens ${E.clock(L - 60)}`;
  return 'So far, so good';
}
export function goalsHTML(g, cls) { return `<div class="goals ${cls || ''}" role="list" aria-label="Shift goals">${g.map((x) => `<span role="listitem" class="goal ${x.st}" title="${esc(x.sub)}"><i aria-hidden="true">${x.st === 'done' ? '✓' : x.st === 'fail' ? '✕' : ''}</i><span><b>${esc(x.label)}</b><small>${esc(goalSub(x))}</small></span></span>`).join('')}</div>`; }
export function armIdle() { if (ui.stuck) { ui.stuck = false; } clearTimeout(G.idleT); G.idleT = setTimeout(idleCheck, 45000); }
export function idleCheck() {
  if (!G.s || G.s.ended || ui.ov || document.hidden || (ui.view !== 'station' && ui.view !== 'room') || !nowRows().length) return;
  ui.stuck = true; render();
  const g = document.querySelector('.cmd-go'); if (g && !reduced()) g.classList.add('nudge');
}
export function stuckTip(where) {
  if (!ui.stuck || !G.s || G.s.ended) return '';
  const rows = nowRows(), top = (where === 'room' && rows.find((r) => r.pid === G.s.loc && !r.blocked)) || rows[0]; if (!top) return '';
  if (where === 'station') return `<div class="stuck-tip" role="status"><p><b>Not sure where to start?</b> Tap the task above. It walks you to ${top.away ? 'the follow-up' : 'the room'} and the right tab.${G.s.nova ? ' Nova can also point you somewhere.' : ''}</p>${G.s.nova ? '<button class="btn" data-act="nova">Ask Nova</button>' : ''}</div>`;
  const d = def(G.s.loc), mine = top.pid === d.id;
  return `<div class="stuck-tip" role="status"><p>${mine ? `<b>Next here:</b> ${esc(top.text)}. ${ui.dock === 'brain' ? 'Tap it in the list below.' : 'Open To do: it lists this patient\'s tasks, overdue first.'}` : `<b>Done in here?</b> ${esc(def(top.pid).room)} needs you next: ${esc(top.text)}.`}</p>${mine ? (ui.dock === 'brain' ? '' : '<button class="btn" data-act="dock" data-id="brain">To do</button>') : `<button class="btn" data-act="${top.away ? 'away' : top.rp ? 'report' : 'goto'}" data-pid="${top.pid}">Go</button>`}</div>`;
}
export function stuckCheck() {
  if (!G.s || G.s.ended || (ui.view !== 'station' && ui.view !== 'room')) return;
  const late = nowRows().filter((r) => r.late && !r.blocked);
  G.s.help = G.s.help || { n: 0, at: -999, skips: 0 };
  const H = G.s.help, behind = late.length >= 3 || (late.length >= 1 && H.skips >= 2);
  if (!behind || H.n >= 2 || G.s.t - H.at < 40 || G.s.t < 40 || G.s.t > C().length - 25) return;
  H.n += 1; H.at = G.s.t; H.skips = 0;
  let tip = ''; try { tip = C().novaHint ? C().novaHint(G.s, A()) : ''; } catch (e) { tip = ''; }
  const first = late[0], d = def(first.pid);
  const lead = late.length >= 3 ? `${late.length} tasks are overdue. It happens to everyone. Pick one room and finish it before you move on.` : 'Skipping ahead won\'t make the overdue work go away. Deal with it first.';
  A().msg({ from: 'nova', pid: first.away ? undefined : first.pid, help: true, text: `${lead} I'd start with ${d.room}: ${first.text.toLowerCase()}.${tip ? ' One more thing to keep in mind: ' + tip : ''} (This one's free. It doesn't use one of your tips.)`, replies: [{ label: `Go to ${d.room}`, act: first.away ? 'away' : 'goto', pid: first.pid }] });
}
// Caught up: point at the patient nobody has looked at for longest. Quiet time is reassessment time.
export function suggestIdle() {
  let best = null;
  pts().forEach((d) => { const P = G.s.p[d.id]; if (gone(P)) return; const last = Math.max(P.seenAt === null ? -999 : P.seenAt, P.touchAt === undefined ? -999 : P.touchAt); if (G.s.t - last >= 45 && (!best || last < best.last)) best = { pid: d.id, last, d }; });
  if (!best) return null;
  const d = best.d, P = G.s.p[d.id];
  return { pid: d.id, text: P.seenAt === null ? `Nobody's waiting on you. You haven't seen ${d.short} yet.` : `Nobody's waiting on you. ${d.short} hasn't seen you since ${E.clock(best.last)}: a good time to look again.`, go: `Go to ${d.room}` };
}
export function cmdBar() {
  const now = nowRows(), nx = nextKnown(), open = FL.open(G.s), top = now[0];
  // One next step, and a count you can live with: rooms waiting, not every line item.
  const rooms = new Set(now.map((r) => r.pid)).size, lateN = now.filter((r) => r.late && !r.blocked).length;
  const head = now.length === 1 ? 'One thing needs you' : rooms === 1 ? `${now.length} things in one room` : `Work waiting in ${rooms} rooms`;
  const tail = now.length > 1 ? `<small class="cmd-sub">${now.length} tasks due${lateN ? ` · <em>${lateN} overdue</em>` : ''}. Start with this one:</small>` : '';
  const idle = suggestIdle();
  // One big card: who, what, and a button that walks you there and opens the right tab.
  const status = top ? `<div class="cmd-st busy nx ${lateN ? 'late' : ''} ${lateN >= 3 ? 'behind' : ''}"><p class="nx-h"><span class="cmd-n" aria-hidden="true">${now.length === 1 ? 1 : rooms}</span><b>${head}</b>${now.length > 1 ? `<small>${now.length} tasks${lateN ? ` · <em>${lateN} overdue</em>` : ''}</small>` : ''}</p><button class="cmd-go" data-act="do-next" data-pid="${top.pid}">${top.rp || top.away ? '' : pface(top.pid)}<span class="nx-t"><small>${top.late && !top.blocked ? '<em>Overdue</em> · ' : 'Next · '}${top.rp ? 'Report' : esc(def(top.pid).room + ' ' + def(top.pid).short)}</small><b>${esc(top.text)}</b></span><span class="nx-go" aria-hidden="true">Go ›</span></button></div>`
    : `<div class="cmd-st clear"><span class="cmd-ok" aria-hidden="true">${ICON.tick}</span><div><b>You're caught up</b>${idle ? `<small>${esc(idle.text)}</small><button class="cmd-go" data-act="goto" data-pid="${idle.pid}">${esc(idle.go)} <span aria-hidden="true">›</span></button>` : '<small>Skip ahead. The clock runs until something needs you.</small>'}</div></div>`;
  const calls = open.map((x) => { const v = FL.view(G.s, C(), x.id), w = who(v.from), left = Math.max(0, x.exp - G.s.t), pct = left / Math.max(1, x.exp - x.at); return `<button class="fcall ${pct < .4 ? 'hurry' : ''}" data-act="floor" data-id="${x.id}">${faceOf(v.from)}<span class="fc-l"><b>${esc(v.title)}</b><small>${esc(w.name)}${w.role ? ', ' + esc(w.role) : ''}</small></span><span class="fc-ring" style="--p:${pct.toFixed(2)}" aria-label="${left} minutes left"><i>${left}</i><small>min</small></span></button>`; }).join('');
  const skip = `<button class="btn skip ${top ? '' : 'ready'}" data-act="skip" title="Moves the clock forward. It stops the moment a message, task or patient needs you.">${ICON.ff}<span><b>Skip ahead in time</b><small>${nx ? `Fast-forward to ${E.clock(nx.t)}: ${esc(nx.text)}` : 'Fast-forward up to 30 min; stops if anything needs you'}</small></span></button>`;
  return `<section class="cmd" aria-label="Right now"><div class="cmd-row">${status}${skip}</div>${stuckTip('station')}${calls ? `<div class="fcalls"><h4>Floor calls <span>Someone on the unit needs you</span></h4>${calls}</div>` : ''}</section>`;
}
/* Let time pass: the clock runs minute by minute and stops the moment something needs you. */
export function skipAhead() {
  if (!G.s || G.s.ended) return;
  G.s.help = G.s.help || { n: 0, at: -999, skips: 0 };
  if (nowRows().some((r) => r.late && !r.blocked)) G.s.help.skips += 1; else G.s.help.skips = 0;
  const t0 = G.s.t, f0 = G.s.fresh.length, base = new Set(nowRows().map((r) => r.pid + '|' + r.key)), arr = pts().length, dl = G.s.deleg.filter((x) => x.done).length, L = C().length;
  const why = spend(Math.min(30, L - G.s.t), null, (ss) => {
    if (ss.fresh.length > f0) { const m = ss.inbox.find((x) => x.id === ss.fresh[ss.fresh.length - 1]); if (m) return { pid: m.pid, from: m.from, text: m.text, urgent: m.urgent }; }
    if (pts().length > arr) { const d = pts()[pts().length - 1]; return { pid: d.id, text: d.arrivedText || `${d.room} ${d.name} is up from the ED.` }; }
    if (!cnaAway() && ss.deleg.filter((x) => x.done && !x.dropped).length > dl) return { from: C().cna || 'luis', text: `${cna().name} is back and free.` };
    const nk = nowRows().find((r) => !base.has(r.pid + '|' + r.key)); if (nk) return { pid: nk.pid, text: `${rowLabel(nk)}: due now` };
    if (ss.t === L - 60 && !handedOff(ss)) return { from: 'nova', text: 'One hour left. Start thinking about report.' };
    if (ss.t === L - 30 && !handedOff(ss)) return { from: 'nova', text: 'Thirty minutes to handoff.' };
    return null;
  });
  // Near the end, say why the clock stopped short of handoff: report is still owed, and End shift is how to finish.
  const owed = !G.s.ended && L - G.s.t <= 10 && nowRows().some((r) => r.rp);
  const endWhy = owed ? ' Report to the oncoming nurse is still waiting. Give it, then End shift when you\'re done.' : '';
  ui.ff = { t0, t1: G.s.t, why: endWhy ? Object.assign({}, why || { text: 'The clock stopped short of handoff.' }, { text: ((why && why.text) || 'The clock stopped short of handoff.') + endWhy, urgent: true }) : why || (G.s.ended ? { text: 'That\'s the shift.' } : (nowRows().some((r) => r.late && !r.blocked) ? { text: 'Half an hour went by. The overdue work is still waiting for you.', urgent: true } : { text: 'A quiet half hour. Nothing new came up.' })) };
  if (!G.s.ended) render();
  ffPlay();
}
export function ffPlay() {
  const f = ui.ff; ui.ff = null; if (!f) return;
  const mins = f.t1 - f.t0; document.querySelectorAll('.ff').forEach((n) => n.remove());
  const fl = FLAVOR[F.kindOf(C())] || FLAVOR.med, pick = [fl[(f.t0 * 7) % fl.length], fl[(f.t0 * 7 + 3) % fl.length]];
  const el = document.createElement('div'); el.className = 'ff' + (f.why.urgent ? ' urgent' : ''); el.setAttribute('role', 'status');
  el.innerHTML = `<div class="ff-card"><svg class="ff-clock" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" class="ff-face"/>${Array.from({ length: 12 }, (_, i) => `<line x1="50" y1="10" x2="50" y2="${i % 3 ? 15 : 18}" transform="rotate(${i * 30} 50 50)"/>`).join('')}<line class="ff-hh" x1="50" y1="50" x2="50" y2="28"/><line class="ff-mh" x1="50" y1="50" x2="50" y2="16"/><circle cx="50" cy="50" r="3.2" class="ff-hub"/></svg>
    <div class="ff-t"><b class="ff-now">${E.clock(f.t0)}</b><small>+<span class="ff-m">0</span> min</small></div>
    <p class="ff-sub">${esc(pick[0])} · ${esc(pick[1].toLowerCase())}</p>
    <p class="ff-why"><span>${esc(f.why.text)}</span></p></div>`;
  document.body.appendChild(el);
  const dur = reduced() ? 120 : Math.min(1500, 420 + mins * 20), T0 = performance.now(), st = C().start || 420;
  const mh = el.querySelector('.ff-mh'), hh = el.querySelector('.ff-hh'), now = el.querySelector('.ff-now'), mm = el.querySelector('.ff-m');
  const done = () => { if (el.classList.contains('out')) return; el.classList.add('out'); setTimeout(() => el.remove(), 300); };
  if (mins > 0) FX.play('whoosh');
  const step = (n) => {
    const p = Math.min(1, (n - T0) / dur), e = 1 - Math.pow(1 - p, 2.4), tt = f.t0 + mins * e, abs = st + tt;
    mh.setAttribute('transform', `rotate(${(abs % 60) * 6} 50 50)`); hh.setAttribute('transform', `rotate(${(abs % 720) * 0.5} 50 50)`);
    now.textContent = E.clock(Math.round(tt)); mm.textContent = Math.round(mins * e);
    if (p < 1) requestAnimationFrame(step); else { el.classList.add('woke'); setTimeout(done, f.why.urgent ? 1500 : 1150); }
  };
  requestAnimationFrame(step); el.addEventListener('click', done);
}
/* Competing priorities a nurse can see from the hall, without the debrief's verdict: a PRN given in that room whose
   "did it work?" check is due (a sticky note on the door, amber when it's late), and on the patient list, a line she
   flagged in report whose time is close or just passed. */
export function prnDue(d, P) { const r = brainRows(d, P).filter((x) => x.key && x.key.startsWith('rx:') && !x.done && x.t !== null && x.t <= G.s.t).sort((a, b) => a.t - b.t)[0]; return r ? { late: !!r.late, t: r.t } : null; }
const HHMM = /\b([01]\d|2[0-3]):([0-5]\d)\b/;
export function flagTime(text) {   // minutes from now to the first clock time in a flagged report line (negative: passed)
  const m = HHMM.exec(text); if (!m) return null;
  const at = +m[1] * 60 + +m[2], now = E.abs(G.s.t) % 1440;
  return ((at - now + 720 + 1440) % 1440) - 720;
}
export const flagNear = (text) => { const d = flagTime(text); return d === null ? '' : d >= 0 && d <= 15 ? 'near' : d < 0 && d >= -30 ? 'past' : ''; };
export function vStation() {
  const doors = C().patients.map((d) => { const P = G.s.p[d.id]; if (!here(d)) return { pid: d.id, room: d.room, pending: true, eta: E.clock(d.arrives), label: admWord(d) }; const light = !gone(P) && (P.callLight || !!P.bell || G.s.inbox.some((m) => m.pid === d.id && m.urgent && !m.read)); const prn = gone(P) ? null : prnDue(d, P); return { pid: d.id, room: d.room, name: d.name, light, gone: gone(P), prn, alert: [light ? 'needs attention' : '', prn ? (prn.late ? 'PRN reassessment overdue' : 'PRN reassessment due') : ''].filter(Boolean).join(', ') }; });
  const pending = C().patients.filter((d) => !here(d));
  const due = dueList();
  return `<main>
    <div class="st-intro"><h1>Nurses' station</h1>${G.prof.runs.length ? '' : `<p>Your home base between rooms.<span class="long"> Plan who's next, read the phone, ask ${esc(cna().name)} or the doctor for help, and skip ahead when nothing needs you.</span> <b>Tap the blue Next card, or any patient, to walk to their room.</b></p>`}</div>
    ${cmdBar()}
    <div class="hall-wrap">${A_.hallway(G.s, doors)}</div>
    <div class="station">
      <section class="board" aria-labelledby="bh">
        <div class="board-h"><h2 id="bh">Your patients</h2>${G.s.prio ? `<button class="btn btn-quiet" data-act="roster" style="font-size:.85rem">Change order</button>` : ''}</div>
        ${prioList().map(def).map((d) => { const P = G.s.p[d.id], n = prioN(d.id); const v = A().lastVitals(d.id); const flags = G.s.brain.filter((k) => k.startsWith(d.id + ':')).length; return `<div class="pt-row tap ${gone(P) ? 'gone' : ''}" data-act="${gone(P) ? 'away' : 'goto'}" data-pid="${d.id}">
          <span class="pr-n" aria-label="Your priority ${n || ''}">${n || ''}</span>${pface(d.id)}
          <div><div class="nm">${d.room} ${esc(d.name)}<small>${ageSex(d)}</small></div><div class="dx">${esc(liveDef(d).dx)}</div>${(() => { if (gone(P)) return ''; const r = nextFor(d.id); return r ? `<div class="pt-next ${r.late && !r.blocked ? 'late' : r.stat ? 'stat' : ''}"><span>${r.late && !r.blocked ? 'Overdue' : r.stat ? 'Now' : r.t > G.s.t ? 'Next, ' + E.clock(r.t) : 'Next'}</span>${esc(r.text)}</div>` : `<div class="pt-next ok"><span>Caught up</span>Nothing due in the next 30 min</div>`; })()}
          <div class="facts">${legal(d)}${/^Full code/.test(liveDef(d).code) ? '' : `<span class="chip alert">${esc(liveDef(d).code.split(',')[0])}</span>`}${gone(P) ? `<span class="chip">${esc(goneText(P))}</span>` : P.seenAt === null ? '' : `<span class="chip">${lastSeen(P)}</span>`}${gone(P) && P.out ? `<span class="chip af-${P.out.spec.course[P.out.known].st}">${esc(awayShort(P))}</span>` : ''}${P.bell && !gone(P) ? '<span class="chip alert">Call light</span>' : ''}${P.read && !gone(P) ? `<span class="chip read st-${P.read.st}">${esc(stName(P.read.st))}${trend(P)}</span>` : ''}${flags ? (() => { const near = flagsFor(d.id).map((t) => ({ t, k: flagNear(t), m: HHMM.exec(t) })).filter((x) => x.k).sort((a, b) => (a.k === 'past' ? -1 : 1) - (b.k === 'past' ? -1 : 1))[0]; return near ? `<span class="chip pin-${near.k}" title="${esc(near.t)}">Flagged ${near.m[0]}${near.k === 'past' ? ', passed' : ', soon'}</span>` : `<span class="chip">${flags} flagged</span>`; })() : ''}</div></div>
          <div class="go">${gone(P) ? (() => { const n = F.awayRows(G.s, A(), d, P).filter((r) => !r.done).length; return `<button class="btn ${n ? 'btn-primary' : ''}" data-act="away" data-pid="${d.id}">Follow up${n ? ` (${n})` : ''}</button>`; })() : `<button class="btn btn-primary" data-act="goto" data-pid="${d.id}">Go to ${d.room}</button>`}<button class="btn" data-act="chart" data-pid="${d.id}">${ICON.chart}Chart</button></div>
        </div>`; }).join('')}
        ${pending.map((d) => `<div class="pt-row pending tap" data-act="pending" data-pid="${d.id}"><div class="pend-dot" aria-hidden="true"></div><div><div class="nm">${d.room} ${esc(admWord(d))}</div><div class="dx">From ${esc(fromOf(d))}, expected about ${E.clock(d.arrives)}. ${esc(d.reason)}.</div></div></div>`).join('')}
        <details class="timeline" ${ui.tlOpen ? 'open' : ''}><summary data-act="tl"><b>Everything due</b><span>${due.length ? `${due.length} task${due.length === 1 ? '' : 's'}, by time` : 'Nothing in the next hour'}</span></summary>
        ${due.length ? dueGroups(due) : '<p class="empty">Nothing due in the next hour.</p>'}</details>
      </section>
      <aside class="side">
        ${(() => { const g = RW.goals(G.s, C(), A()), dn = g.filter((x) => x.st === 'done').length; return `<details class="goals-fold" ${ui.goalsOpen ? 'open' : ''}><summary data-act="goals-t"><b>Shift goals</b><span>${dn} of ${g.length} done</span></summary>${goalsHTML(g)}</details>`; })()}
        ${phone(8)}
        <div class="tools">
          ${(() => { const n = aideSuggest().length; return `<button class="btn ${n ? 'has-sug' : ''}" data-act="delegate"><b>${cnaAway() ? esc(cna().name) : `Ask ${esc(cna().name)}`}</b><small>${cnaAway() ? esc(cnaAway()) : n ? `${n} thing${n === 1 ? '' : 's'} ${esc(cna().name)} can take now` : `Delegate to the ${esc(/^[A-Z]{2,}/.test(cna().role) ? cna().role : cna().role.toLowerCase())}`}</small></button>`; })()}
          <button class="btn" data-act="callpick"><b>Call ${esc(prov().name)}</b><small>${prov().role ? esc(prov().role) + ", " : ""}SBAR, 6 min</small></button>
          ${G.s.t >= C().length - 60 ? (() => { const L = pts().filter((x) => !gone(G.s.p[x.id])), n = L.filter((x) => G.s.report && G.s.report[x.id]).length; if (!L.length) return ''; return `<button class="btn ${n < L.length ? 'btn-primary' : ''}" data-act="report" style="grid-column:1/-1"><b>${n < L.length ? `Give report to ${esc(oncoming().name)}` : `Report given to ${esc(oncoming().name)}`}</b><small>${n} of ${L.length} patients · 2 min each</small></button>`; })() : ''}
          ${G.s.t >= C().length - 30 ? `<button class="btn ${pts().filter((x) => !gone(G.s.p[x.id])).every((x) => G.s.report && G.s.report[x.id]) ? 'btn-primary' : ''}" data-act="endask" style="grid-column:1/-1"><b>End shift</b><small>Handoff at ${E.clock(C().length)}</small></button>` : ''}
        </div>
      </aside>
    </div></main>`;
}

export function msgHTML(m) {
  const w = who(m.from);
  return `<div class="msg tap ${m.read ? '' : 'unread'} ${m.urgent ? 'urgent' : ''} ${m.id > (ui.msgSeen || 0) ? 'fresh' : ''}" data-act="msg" data-m="${m.id}">${faceOf(m.from)}
    <div><div class="from"><b>${esc(w.name)}</b> ${esc(w.role)} <span aria-hidden="true">at</span> ${E.clock(m.t)}${m.urgent ? ' <b style="color:var(--red)">Urgent</b>' : ''}</div>
    <p class="tx">${esc(m.text)}</p>
    ${m.replies && !m.done ? `<div class="rep">${m.replies.map((r, i) => `<button class="btn" data-act="reply" data-m="${m.id}" data-i="${i}">${esc(r.label)}</button>`).join('')}</div>` : m.pid && def(m.pid) && here(def(m.pid)) && !(ui.view === 'room' && G.s.loc === m.pid) ? `<span class="msg-go" aria-hidden="true">${gone(G.s.p[m.pid]) ? 'Follow up on' : 'Go to'} ${esc(def(m.pid).room)} ›</span>` : ''}</div></div>`;
}
export function phone(n) {
  const list = G.s.inbox.slice(0, n);
  const urgent = G.s.inbox.filter((m) => !m.read && m.urgent).length;
  return `<section class="phone ${urgent ? 'ringing' : ''}" aria-labelledby="ph"><div class="phone-h"><b id="ph">Unit phone</b><span style="font-size:.8rem">${urgent ? `<b class="ph-urg">${urgent} urgent</b> · ` : ''}${G.s.inbox.filter((m) => !m.read).length} unread</span></div>
    <div class="msgs">${list.length ? list.map(msgHTML).join('') : '<p class="empty">Quiet so far.</p>'}</div>
    ${G.s.inbox.length > n ? `<div style="padding:.4rem;border-top:1px solid var(--line)"><button class="btn btn-quiet" data-act="inbox" style="width:100%">All ${G.s.inbox.length} messages</button></div>` : ''}</section>`;
}

/* ------------ follow-up: patients who left the unit are still yours to close out ------------ */
export const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
export function openAway(pid) { ui.away = { pid, mode: null, picked: [], reply: null, review: null }; ui.ov = 'away'; ui.chart = null; render(); }
export function ovAway() {
  const a = ui.away, d = def(a.pid), P = G.s.p[a.pid], o = P.out;
  if (!o) return sheet(esc(d.short), `<p>${esc(goneText(P))}.</p>`, `<button class="btn btn-primary" data-act="close">Close</button>`);
  const sp = o.spec, nu = staff(sp.nurse), Ax = A(), rows = F.awayRows(G.s, Ax, d, P), cur = sp.course[o.known];
  const tl = sp.course.slice(0, o.known + 1).map((e, i) => `<li class="${i === o.known ? 'now' : ''}"><span class="aw-tm">${E.clock(o.at + e.at)}</span><span class="pill af-${e.st}">${F.ST[e.st]}</span><p>${esc(e.text)}</p></li>`).join('');
  const hasNew = F.entryAt(P, G.s.t - o.at) > o.known;
  let body = `<div class="aw-top">${face(sp.nurse)}<div><span class="aw-k">Now in ${esc(F.where(sp.unit))} since ${E.clock(o.at)}</span><b>${esc(nu.name)}</b> <span class="muted">${esc(nu.role)}</span></div><span class="pill af-${cur.st}">${F.ST[cur.st]}</span></div>
    <p class="aw-ev"><b>What happened.</b> ${esc(sp.event)}</p>`;
  if (a.noteText) body += `<div class="aw-note"><span class="res-cl">Signed ${E.clock(o.note)}</span><p>${esc(a.noteText)}</p></div>`;
  if (a.reply) body += `<div class="reply">${face(a.replyFrom || sp.nurse)}<p class="voice" style="margin:0">${esc(a.reply)}</p></div>${reviewHTML(a.review, 'Your follow-up, reviewed')}`;
  if (a.mode === 'ho') {
    const items = F.handoffItems(G.s, Ax, d, P);
    body += `<fieldset class="sbar-sec" style="border:0;padding:0"><legend><h3>What goes in your report to ${esc(nu.name)}?</h3></legend><p class="muted" style="margin:.2rem 0 .5rem">Pick what ${esc(F.where(sp.unit))} needs. Skip what they don't.</p>${items.map((it) => `<label class="opt"><input type="checkbox" data-act="away-pick" data-id="${it.id}" ${a.picked.includes(it.id) ? 'checked' : ''}><span>${esc(it.label)}</span></label>`).join('')}</fieldset>`;
    return sheet(`Report to ${esc(F.where(sp.unit))}`, body, `<button class="btn" data-act="away-back">Back</button><button class="btn btn-primary" data-act="away-ho-send" ${a.picked.length ? '' : 'disabled data-why="Pick what you\'ll tell them first."'}>Call report <span style="font-weight:400;opacity:.8">4 min</span></button>`, { wide: true, label: 'Call report' });
  }
  if (a.mode === 'fam') {
    const f = sp.family;
    body += `<h3 style="margin:.6rem 0 .3rem">${f.phone ? 'Calling' : 'Finding'} ${esc(f.name)}, ${esc(d.short)}'s ${esc(f.rel)}</h3><p class="muted" style="margin:.2rem 0 .5rem">What do you say?</p>${F.famChoices(P).map((c) => `<button class="choice" data-act="away-fam-pick" data-id="${c.id}">${esc(c.label)}</button>`).join('')}`;
    return sheet(`Update ${esc(f.name)}`, body, `<button class="btn" data-act="away-back">Back</button>`, { wide: true, label: 'Update family' });
  }
  body += `<h3 class="aw-h3">What you've heard</h3><ol class="aw-tl">${tl}</ol>${hasNew ? `<p class="aw-new">${esc(cap(F.where(sp.unit)))} has news since your last update.</p>` : ''}`;
  const item = (act, label, sub, c, done, cls) => `<li><button class="fs-row ${cls || ''} ${done ? 'has' : ''}" data-act="${act}" data-id="${d.id}" ${done ? `disabled data-why="Done at ${E.clock(done)}."` : ''}><span class="fs-l"><b>${label}</b><small>${sub}</small></span><span class="fs-t">${done ? `${ICON.tick}${E.clock(done)}` : ''}</span><span class="fs-c">${c}</span></button></li>`;
  const late = (k) => (rows.find((r) => r.key === k) || {}).late ? 'urgent' : '';
  body += `<h3 class="aw-h3">Close the loop</h3><ul class="fs">
    ${sp.handoff ? item('away-ho', `Call report to ${esc(nu.name)}`, o.handoff !== null ? 'Report given' : `${esc(cap(F.where(sp.unit)))} is waiting on what you know`, '4 min', o.handoff, late('aw:ho')) : ''}
    ${sp.family ? item('away-fam', `Update ${esc(sp.family.name)} (${esc(sp.family.rel)})`, o.fam !== null ? 'Updated' : `${sp.family.phone ? 'By phone' : 'In the waiting room'}${sp.family.interp ? `, needs a ${esc(sp.family.interp)} interpreter` : ''}`, '4 min', o.fam, late('aw:fam')) : ''}
    ${sp.note ? item('away-note', sp.emergent ? 'Write the event note' : 'Write the transfer note', o.note !== null ? 'In the chart' : 'What you saw, what you did, who you told', '3 min', o.note, late('aw:note')) : ''}
    ${item('away-upd', `Call ${esc(F.where(sp.unit))} for an update`, hasNew ? 'There\'s news' : o.calls.length ? `Last called ${E.clock(o.calls[o.calls.length - 1])}` : 'How are they doing now?', '3 min', null, hasNew ? 'due' : '')}</ul>`;
  return sheet(`${d.room} ${esc(d.short)}: follow-up`, body, `<button class="btn" data-act="chart" data-pid="${d.id}">${ICON.chart}Chart</button><button class="btn btn-primary" data-act="close">Done</button>`, { wide: true, face: pface(d.id), label: `Follow up on ${d.short}` });
}
/* ------------ report to the oncoming nurse ------------ */
export function reportPending(d, P) { return brainRows(d, P).filter((r) => !r.done && !r.prog && r.t !== null && !/^(rp|rd:)/.test(r.key || '') && (r.late || r.t <= C().length + 60)); }
export function reportItems(d, P) { return F.reportItems(G.s, A(), d, P, reportPending(d, P), stName); }
export function openReport(pid) { const list = pts().filter((x) => !gone(G.s.p[x.id])); const first = pid || (prioList().find((id) => list.some((x) => x.id === id) && !(G.s.report && G.s.report[id])) || (list[0] || {}).id); if (!first || !def(first)) { stamp('Nobody left on the unit to report on'); return render(); } ui.rep = { pid: first, picked: [], reply: null, review: null }; ui.ov = 'give'; ui.chart = null; render(); }
export function ovGive() {
  const r = ui.rep, on = oncoming(), list = prioList().map(def).filter((x) => x && !gone(G.s.p[x.id])), d = def(r.pid);
  if (!d) { ui.ov = null; ui.rep = null; return ''; }
  const _d = d, P = G.s.p[r.pid], done = G.s.report && G.s.report[r.pid];
  const tabs = `<div class="seg rep-tabs" role="group" aria-label="Patient">${list.map((x) => `<button data-act="rep-go" data-pid="${x.id}" aria-pressed="${x.id === r.pid}">${G.s.report && G.s.report[x.id] ? '✓ ' : ''}${x.room}</button>`).join('')}</div>`;
  let body = `<p class="muted" style="margin-top:0">${esc(on.name)} is taking your patients. For each one, pick what ${esc(on.name)} needs to hear. Unfinished work is fine to hand off; unmentioned work isn't.</p>${tabs}
    <div class="rep-who">${pface(d.id)}<div><b>${d.room} ${esc(d.name)}</b> <small class="muted">${ageSex(d)}</small><br><span class="muted">${esc(liveDef(d).dx)}</span></div></div>`;
  if (r.reply && r.replyPid === r.pid) body += `<div class="reply">${face(F.oncoming(C()))}<p class="voice" style="margin:0">${esc(r.reply)}</p></div>${reviewHTML(r.review, 'Your report, reviewed')}`;
  else if (done) body += `<div class="warnbox">Report given at ${E.clock(done.t)}.</div>`;
  else body += `<fieldset class="sbar-sec" style="border:0;padding:0"><legend class="sr">What goes in report</legend>${reportItems(d, P).map((it) => `<label class="opt"><input type="checkbox" data-act="rep-pick" data-id="${it.id}" ${r.picked.includes(it.id) ? 'checked' : ''}><span>${esc(it.label)}</span></label>`).join('')}</fieldset>`;
  const nextUp = list.find((x) => !(G.s.report && G.s.report[x.id]) && x.id !== r.pid);
  const foot = done ? `${nextUp ? `<button class="btn btn-primary" data-act="rep-go" data-pid="${nextUp.id}">Next: ${nextUp.room}</button>` : ''}<button class="btn ${nextUp ? '' : 'btn-primary'}" data-act="close">${nextUp ? 'Later' : 'Done'}</button>` : `<button class="btn" data-act="close">Later</button><button class="btn btn-primary" data-act="rep-send" ${r.picked.length ? '' : 'disabled data-why="Pick what you\'ll tell them first."'}>Give report on ${esc(d.short)} <span style="font-weight:400;opacity:.8">2 min</span></button>`;
  return sheet(`Report to ${esc(on.name)}`, body, foot, { wide: true, face: face(F.oncoming(C())), label: `Give report to ${on.name}` });
}

export function ovReview() { return sheet('Your reply, reviewed', `<p class="muted" style="margin-top:0">${esc(ui.review.title)}</p>${reviewHTML(ui.review.list, 'Why it matters')}`, `<button class="btn btn-primary" data-act="close">Continue</button>`, { label: 'Decision review' }); }
export function ovCalls() {
  const list = G.s.judg.filter((j) => !j.superseded).reverse(), m = RW.mult(G.s.streak || 0);
  const good = G.s.judg.filter((j) => j.delta > 0).length, bad = G.s.judg.filter((j) => j.delta < 0).length;
  const top = `<div class="prog-top"><div class="pg-xp">${ICON.xp}<b>${fmtN(G.s.xp || 0)}</b><small>care XP this shift</small></div><div class="pg-st ${m > 1 ? 'hot' : ''}">${ICON.flame}<b>${G.s.streak || 0}</b><small>in a row${m > 1 ? ` · ×${m} XP` : ''} · best ${G.s.bestStreak || 0}</small></div></div>
    <p class="muted pg-how">On-time tasks and good calls build your streak; the streak multiplies XP (×1.5 at 3, ×2 at 5, ×2.5 at 8, ×3 at 12). Anything going overdue, or a call to rethink, resets it.</p>
    <h3 class="pg-h">Shift goals</h3>${goalsHTML(RW.goals(G.s, C(), A()), 'wide')}`;
  const dec = fbNow() ? `<h3 class="pg-h">Decisions <span class="muted">${good} good, ${bad} to rethink</span></h3>${list.length ? list.map((j) => `<div class="calls-t">${E.clock(j.t)}${j.pid ? ' · ' + esc(j.pid) : ''}</div>${reviewHTML([j], ' ').replace('<span class="res-cl"> </span>', '')}`).join('') : '<p class="empty">No decisions scored yet.</p>'}` : '<p class="muted">Decision feedback is set to show at the debrief.</p>';
  return sheet('Your shift so far', top + dec, `<button class="btn btn-primary" data-act="close">Close</button>`, { label: 'Your shift so far', wide: true });
}
/* ------------ floor calls ------------ */
/* A floor call that's waiting stays on screen, at the top of the station and every room, until it's answered or
   someone else takes it. A call only counts against the player once this bar has actually been in front of them. */
export const handedOff = (ss) => !!ss.report && C().patients.every((d) => { const P = ss.p[d.id]; return !P || (d.arrives && !P.arrived) || P.gone || P.icu || ss.report[d.id]; });   // report already given on everyone still here
export function callBar() {
  const q = FL && G.s && G.s.floor && G.s.floor.q.find((x) => !x.done); if (!q) return '';
  const v = FL.view(G.s, C(), q.id), left = Math.max(0, q.exp - G.s.t);
  if (!ui.ov) q.shown = true;
  return `<button class="callbar ${left <= 3 ? 'hurry' : ''}" data-act="floor" data-id="${q.id}">${faceOf(v.from)}<span class="callbar-t"><b>Call waiting: ${esc(v.title)}</b><small>${esc(who(v.from).name)} · ${left} min before someone else takes it</small></span><span class="callbar-go">Take the call</span></button>`;
}
export function openFloor(id) { ui.fl = { id }; ui.ov = 'floor'; ui.chart = null; render(); }
export function ovFloor() {
  const v = FL.view(G.s, C(), ui.fl.id), w = who(v.from), left = Math.max(0, v.exp - G.s.t), answered = v.done === 'answered', missed = v.done === 'missed';
  let body = `<p class="fl-from"><b>${esc(w.name)}</b>${w.role ? `, ${esc(w.role)}` : ''} · ${E.clock(v.at)}${!v.done ? ` · <span class="fl-left ${left <= 3 ? 'hurry' : ''}">${left} min to respond</span>` : ''}</p><p class="dlg-text fl-text">${esc(v.text)}</p><h3 class="fl-q">${esc(v.q)}</h3>`;
  if (missed) body += `<div class="warnbox">Nova took this one while you were busy.</div>`;
  const show = answered && fbNow();
  body += `<div class="fl-opts">${v.opts.map((o) => {
    if (!v.done) return `<button class="choice fl-opt" data-act="floor-pick" data-i="${o.i}">${esc(o.t)}</button>`;
    const me = answered && o.i === v.pick, cls = show ? (me ? (o.v === 2 ? 'right' : o.v === 1 ? 'ok' : 'wrong') + ' picked' : o.v === 2 ? 'right' : 'dim') : me ? 'picked' : 'dim';
    return `<div class="choice fl-opt ${cls}">${show && (me || o.v === 2) ? `<span class="fl-tag">${me ? (o.v === 2 ? 'Your answer · best' : o.v === 1 ? 'Your answer · acceptable' : 'Your answer') : 'Best answer'}</span>` : me ? '<span class="fl-tag">Your answer</span>' : ''}${esc(o.t)}${show && (me || o.v === 2) ? `<small>${esc(o.fb)}</small>` : ''}</div>`;
  }).join('')}</div>`;
  if (show || missed) body += `<div class="fl-teach"><span class="res-cl">Keep this</span><p>${esc(v.teach)}</p></div>`;
  else if (answered) body += '<p class="muted">Logged. You\'ll see how it went at the debrief.</p>';
  const foot = v.done ? `<button class="btn btn-primary" data-act="close">Back to work</button>` : `<span class="muted fl-cost">Answering takes ${v.cost} min</span>`;
  return sheet(esc(v.title), body, foot, { face: faceOf(v.from), label: `Floor call: ${v.title}`, noScrimClose: !!v.done && false });
}
export function ovInbox() { return sheet('Unit phone', G.s.inbox.length ? G.s.inbox.map(msgHTML).join('') : '<p class="empty">No messages yet.</p>', `<button class="btn" data-act="readall">Mark all read</button><button class="btn btn-primary" data-act="close">Close</button>`); }
