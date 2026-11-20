/* The Shift — UI: Actions: every data-act handler, taps, holds, keys, drag to reorder, and boot. */
import { applySettings, closeOrient, endShift, firstTimer, frameMon, gain, logHere, markSeen, openOrient, resume, save, seen, spend, startNew } from './core.js';
import { A, C, CASES, CL, DR, E, F, FL, FX, G, GAMEVIEW, NG, OR, ORK, PACK, R, RW, S, STY, TEL, TERMS, TERMS_FREE, admWord, cna, cnaAway, def, esc, fT, fromOf, gone, here, inGame, lcFirst, locked, o2txt, orLoad, orSave, prov, pts, staff, sysL, termsOk, ui } from './ctx.js';
import { ngnList, ngnStart } from './debrief.js';
import { armIdle, nextFor, nowRows, openAway, openFloor, openReport, prioList, reportItems, skipAhead } from './floor.js';
import { CNL, STEPNAME, bankFiltered, startSet } from './practice.js';
import { keyOf, render } from './render.js';
import { ROUND, SYS, again, brainRows, didText, fbNow, isPt, judgSince, lastFind, markRead, oncoming, prnLimit, reviewSound, sayNow, sayText, stRank } from './room.js';
import { coachFor, coachPlace, fbAny, fbWhere, fromCloud, packPoll, standalone } from './sheets.js';

/* ------------ actions ------------ */
export function enterRoom(pid) {
  if (here(def(pid)) && gone(G.s.p[pid])) return openAway(pid);
  if (!here(def(pid))) { ui.ov = null; render(); return; }
  const move = ui.view === 'room' && G.s.loc === pid ? 0 : 1;
  spend(move, () => {});
  if (G.s.ended) return;
  if (G.s.loc !== pid) { ui.dock = 'brain'; ui.brainAll = false; }
  G.s.loc = pid; G.s.lastRoom = pid; G.s.p[pid].seenAt = G.s.t; if (G.s.p[pid].firstSeen === undefined) G.s.p[pid].firstSeen = G.s.t; G.s.p[pid].callLight = false; ui.res = null; ui.receipt = null; ui.flash = null;
  ui.view = 'room'; G.s.view = 'room'; ui.ov = null; ui.enter = true; ui.caption = null; ui.chart = null; ui.lastFind = null;
  G.s.inbox.forEach((m) => { if (m.pid === pid) m.read = true; });
  save(); render(true);
}

/* Every object in a room answers when tapped, even when the case has nothing special to say about it. */
export function genericClue(id, d, P, el) {
  const f = d.scene(G.s, P, A()), v = A().vitals(d.id);
  const g = {
    o2: () => f.bipap ? 'BiPAP running. The flowmeter is off.' : f.o2 ? `Oxygen flowmeter set to ${f.o2} L by nasal cannula.` : 'Oxygen flowmeter on the headwall, turned off. No oxygen ordered.',
    iv: () => f.iv === 'lock' ? 'Saline lock. Site clean and dry, no redness.' : 'IV running on the pump. Site clean, no redness or swelling.',
    monitor: () => `Monitor: ${v.rhythm || 'sinus rhythm'}, rate ${v.HR}. SpO₂ ${v.SpO2}%.`,
    tray: () => 'A meal tray.', alarm: () => 'Bed low and locked.',
  }[id];
  return g ? g() : `${el.getAttribute('aria-label') || 'Nothing'}. Nothing out of the ordinary.`;
}
export function doAssess(sys, card) {
  const d = def(G.s.loc), P = G.s.p[d.id];
  const run = (k) => {
    if (k === 'vitals') {
      const pv = P.vit.filter((x) => x.by === 'You').pop();
      const ordered = (G.s.watch || []).some((w) => { if (w.pid !== d.id || !w.vitals) return false; const h = P.vit.filter((x) => x.t > w.from); return h.length < w.times && G.s.t >= (h.length ? h[h.length - 1].t + w.every : w.from) - 5; });   // a check the order asks for now
      if (pv && !ordered && G.s.t - pv.t <= 8 && d.status(G.s, P, A()) === 'stable') { const nv = A().vitals(d.id); if (['HR', 'SBP', 'RR', 'SpO2'].every((q) => Math.abs(nv[q] - pv[q]) <= 3)) A().judge(d.id + '-repeat', 'time', -1, `You re-took ${d.short}'s vitals minutes after the last set, with nothing changed.`, 'Recheck vitals when you expect a change: after a med, an intervention, or a new symptom. Otherwise the time goes to someone who needs it.', d.id); }
      const v = A().recordVitals(d.id, 'You'); P.k.hrAt = G.s.t; P.k.hr = v.HR; if (v.poss) P.k.possAt = G.s.t;
      const txt = `T ${fT(v.T)} °C, HR ${v.HR}${v.rhythm ? ' (' + v.rhythm + ')' : ''}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}% on ${o2txt(v.O2)}${v.poss ? ', sedation ' + v.poss.split(',')[0] : ''}. Pain ${v.pain}/10.`;
      logHere(d.id, txt, 'find'); G.s.log[G.s.log.length - 1].label = 'Vital signs'; return txt;
    }
    const L0 = sysL(k, SYS.find((x) => x[0] === k)[1]), prev = lastFind(d.id, L0), prevAt = P.assessAt[k];
    const txt = d.assess[k](G.s, P, A());
    if (prev && prevAt !== undefined && G.s.t - prevAt <= 10 && prev.text === txt && d.status(G.s, P, A()) === 'stable') A().judge(d.id + '-repeat', 'time', -1, `You repeated ${d.short}'s ${L0.toLowerCase()} with nothing new to find.`, 'Every assessment costs minutes another patient is waiting for. Reassess when something has changed, after an intervention, or when a recheck is due.', d.id);
    P.assessAt[k] = G.s.t; if (k === 'pain') P.k.painAt = G.s.t;
    logHere(d.id, txt, 'find'); G.s.log[G.s.log.length - 1].label = sysL(k, SYS.find((x) => x[0] === k)[1]); return txt;
  };
  const cost = SYS.find((x) => x[0] === sys)[2];
  const fn = () => { if (sys === 'full') { ['vitals', 'general', 'resp', 'cardiac', 'neuro', 'pain', 'skin', 'gi'].forEach(run); return 'Every system documented. Each finding is in the shift documentation.'; } return run(sys); };
  if (card === false) return spend(cost, fn);
  doAct(sys === 'full' ? 'Full head-to-toe' : sysL(sys, SYS.find((x) => x[0] === sys)[1]), cost, fn, sys === 'vitals' || sys === 'full' ? 'vitals' : '');
}
export function doAct(label, mins, fn, kind) {
  const d = def(G.s.loc), P = G.s.p[d.id], Ax0 = A();
  const st0 = gone(P) ? 'gone' : d.status(G.s, P, Ax0), t0 = G.s.t, inb0 = G.s.inbox.length, vPrev = kind === 'vitals' ? Object.assign({}, Ax0.lastVitals(d.id)) : null;
  let text = '';
  const lateKey = () => { const o = new Set(); pts().forEach((dd) => { if (dd.id === d.id || gone(G.s.p[dd.id])) return; brainRows(dd, G.s.p[dd.id]).forEach((r) => { if (r.late && !r.done && !r.prog && r.key) o.add(dd.id + '|' + r.key + '|' + r.text); }); }); return o; };
  const late0 = lateKey(), j0 = G.s.judg.length;
  const g0 = ui.ghosts.length; ui.actPid = d.id;
  // Working at the bedside answers a call light: you're in the room, and they ask you. Only the bell's own
  // action skips this (it already answers), and only when the light's need is something a nurse in the room meets.
  let bellTx = '';
  if (P && P.bell && G.s.loc === d.id && label !== 'Answered the call light' && !gone(P)) { const Ax1 = A(); bellTx = F.answerBell(G.s, Ax1, d.id); if (bellTx) { logHere(d.id, bellTx, 'find'); G.s.log[G.s.log.length - 1].label = 'Call light'; } }
  spend(mins, (Ax) => { text = fn(Ax) || ''; });
  if (bellTx) text = `${text}${text ? ' ' : ''}(While you were in the room: ${bellTx.replace(/^Call light: /, '').replace(/^Request: /, '')})`;
  ui.actPid = null; if (G.s.p[d.id]) G.s.p[d.id].touchAt = G.s.t;
  if (G.s.ended) return;
  const doneNow = ui.ghosts.slice(g0).filter((g) => g.pid === d.id); doneNow.forEach((g) => { g.held = true; });
  const review = judgSince(j0, d.id).filter((j) => !/-unseen$/.test(j.key || ''));
  const late1 = lateKey(), meanwhile = [...late1].filter((k) => !late0.has(k)).map((k) => { const [pid, , tx] = k.split('|'); return { pid, text: tx }; });
  const P2 = G.s.p[d.id], st1 = gone(P2) ? 'gone' : d.status(G.s, P2, A());
  markRead(d.id, st1);
  const dir = st0 === st1 || st1 === 'gone' ? 0 : stRank(st1) > stRank(st0) ? 1 : -1;
  const here = (ui.critQ || []).filter((id) => (G.s.inbox.find((x) => x.id === id) || {}).pid === d.id);
  ui.critQ = (ui.critQ || []).filter((id) => !here.includes(id));
  const alerts = here.map((id) => { const m = G.s.inbox.find((x) => x.id === id); m.read = true; return { from: m.from, text: m.text }; });
  const crit = (st1 === 'urgent' && st0 !== 'urgent') || alerts.length ? 'worse' : st0 === 'urgent' && st1 !== 'urgent' && st1 !== 'gone' ? 'better' : null;
  ui.res = { id: ++G.resSeq, pid: d.id, label, text, t0, t1: G.s.t, st0, st1, vPrev, vNew: kind === 'vitals' ? A().lastVitals(d.id) : null, msgs: G.s.inbox.length - inb0 - alerts.length, alerts, crit, done: doneNow.map((g) => g.text), review, meanwhile };
  if (!crit) reviewSound(review);
  // A routine result (nothing changed, nothing to learn from, nothing new) doesn't need a modal: it shows at the top of the panel.
  const routine = !crit && !alerts.length && st0 === st1 && !meanwhile.length && ui.res.msgs <= 0 && !(fbNow() && review.length) && !(G.prof.settings.results === 'card');
  if (routine) { const r = Object.assign({ born: Date.now(), at: G.s.t }, ui.res); handlers['res-close'](); ui.receipt = r; render(); save(); return; }
  ui.receipt = null;
  ui.ov = 'result'; ui.caption = null; ui.flash = dir > 0 ? 'worse' : dir < 0 ? 'better' : null;
  if (crit === 'worse') setTimeout(() => FX.play('crit'), 100); else if (dir) setTimeout(() => FX.play(dir > 0 ? 'worse' : 'better'), 380);
  save();
}

export function onReply(m, r) {
  const Ax = A();
  if (r.act === 'goto') { m.done = true; m.read = true; return enterRoom(r.pid); }   // the choice is made: the other replies are gone
  if (r.act === 'delegate') { ui.ov = 'deleg'; ui.delegMsg = null; m.done = true; }
  if (r.act === 'sbar') { ui.ov = 'sbar'; ui.sbar = { pid: r.pid, picked: [], req: null, reply: null, msg: m.id }; }
  if (r.act === 'chart') { ui.ov = 'chart'; ui.chart = { pid: r.pid, tab: r.tab || 'overview' }; }
  if (r.act === 'away') { m.read = true; return openAway(r.pid); }
  if (r.act === 'floor') { m.read = true; return openFloor(r.id); }
  if (r.act === 'bell-cna') { m.done = true; m.read = true; const j0 = G.s.judg.length; spend(1, (Ax2) => F.bellToCna(G.s, Ax2, r.pid)); if (G.s.ended) return; const rv = judgSince(j0, r.pid); if (rv.length && fbNow()) { ui.review = { title: `You replied: "${r.label}"`, list: rv }; ui.ov = 'review'; reviewSound(rv); } else if (G.s.p[r.pid].bell && G.s.p[r.pid].bell.cnaAt) stamp(`${cna().name} is on it`, 1); return render(); }
  const rx = C().replies && C().replies[r.act];
  if (rx) { m.done = true; const j0 = G.s.judg.length; spend(1, (Ax2) => rx(G.s, Ax2, m, r)); if (G.s.ended) return; const rv = judgSince(j0).filter((j) => !j.pid || j.pid === m.pid); if (rv.length && fbNow()) { ui.review = { title: `You replied: "${r.label}"`, list: rv }; ui.ov = 'review'; reviewSound(rv); } }
  m.read = true;
  render();
}

export const stamp = (text, mins) => { ui.stamp = { text, sub: mins ? `${E.clock(G.s.t - mins)} · ${mins} min` : E.clock(G.s.t) }; };
export const handlers = {
  // Debrief to drill: start the round for a skill the shift caught you out on.
  'deb-drill'(el) { TEL.track('debrief_drill', { kind: el.dataset.k, skills: el.dataset.dom || '', case: G.s && G.s.caseId }); handlers['dr-start']({ dataset: { k: el.dataset.k } }); },
  'pick-case'(el) { G.caseId = el.dataset.id; E.useCase(G.caseId); if (G.s && G.s.ended) G.s = null; ui.view = 'shifts'; ui.ov = null; render(); },
  shifts() { if (G.s && !G.s.ended && GAMEVIEW[ui.view]) save(); ui.view = 'shifts'; ui.ov = null; TEL.track('shifts_open', {}); render(true); },
  new() { if (locked(G.caseId)) return startNew(); if (firstTimer()) { openOrient(true); return; } if (E.store.load() && (ui.view === 'home' || ui.view === 'shifts')) { ui.confirm = { title: 'Start over?', text: 'Your saved shift will be replaced.', ok: 'Start a new shift', act: 'new-yes', danger: true }; ui.ov = 'confirm'; return render(); } startNew(); },
  'new-yes'() { E.store.clear(); startNew(); },
  'last-debrief'() { const L = E.store.loadLast(); if (!L) return render(); G.s = L; G.caseId = L.caseId; E.useCase(G.caseId); ui.view = 'debrief'; ui.ov = null; ui.debDone = true; ui.filter = 'all'; ui.dtab = 'shift'; render(true); },
  resume, home() { if (G.s && !G.s.ended) save(); if (G.s) G.caseId = G.s.caseId; ui.view = 'home'; ui.ov = null; render(true); },
  restart() { ui.confirm = { title: 'Restart this shift?', text: `You'll go back to ${E.clock(0)} report. Progress in this shift is lost.`, ok: 'Restart', act: 'new-yes', danger: true }; ui.ov = 'confirm'; render(); },
  menu() { ui.ov = 'menu'; render(); }, help() { openOrient(false); }, 'help-ref'() { ui.ov = 'help'; render(); },
  'or-open'() { if (ui.or) { ui.ov = 'orient'; render(true); } else openOrient(false); },
  or(el) { const o = ui.or; if (!o) return; const i0 = o.i, r = OR.act(o, el.dataset); if (r === 'done') return closeOrient(true); if (r === 'skip') return closeOrient(false); orSave(); if (r === 'ref') { ui.ov = 'help'; return render(); } render(); if (o.i !== i0) { const st = document.querySelector('.or-body'); if (st) st.scrollTop = 0; window.scrollTo(0, 0); const h2 = document.querySelector('.or-head h2'); if (h2) h2.focus({ preventScroll: true }); } else if (document.activeElement && document.activeElement.closest && document.activeElement.closest('.or-list')) document.activeElement.blur(); }, settings() { ui.ov = 'settings'; render(); },
  terms() { ui.ov = 'terms'; render(); },
  'terms-ok'() { G.prof.terms = TERMS.version; G.prof.termsAt = new Date().toISOString(); E.store.saveProfile(G.prof); TEL.track('terms_accept', { version: TERMS.version }); ui.ov = null; ui.termsAsk = false; const go = ui.afterTerms; ui.afterTerms = null; render(); if (go && handlers[go.a]) handlers[go.a]({ dataset: go.ds, closest: () => null, getAttribute: () => null }); },
  set(el) { G.prof.settings[el.dataset.k] = el.dataset.v; E.store.saveProfile(G.prof); render(); },
  close() { if (ui.ov === 'report' && ui.rp && ui.rp.back === 'ngn' && ui.ngn) { ui.rp = null; ui.ov = 'ngn'; return render(); } if (ui.ov === 'report') ui.rp = null; if (ui.ov === 'dialog') { ui.dlg = null; ui.dlgReview = null; ui.said = null; } if (ui.ov === 'rank') return; ui.ov = null; ui.chart = null; ui.med = null; ui.sbar = null; ui.nova = null; render(); },
  flag(el) { const k = el.dataset.k; const i = G.s.brain.indexOf(k); if (i >= 0) G.s.brain.splice(i, 1); else G.s.brain.push(k); save(); render(); },
  'h-go'(el) { if (ui.hIdx === +el.dataset.i) return render(); G.s.hHeard = Array.from(new Set((G.s.hHeard || []).concat(C().patients.filter((x) => !x.arrives)[ui.hIdx].id))); ui.hIdx = +el.dataset.i; ui.hFresh = true; render(true); },
  'h-done'() { if (!G.s) return; TEL.track('report_done', { case: G.caseId, flags: G.s.brain.length, heard: ui.hIdx + 1 }); ui.rankMoved = null; ui.rank = C().patients.filter((p) => !p.arrives).map((p) => p.id); ui.rankDone = false; ui.ov = 'rank'; render(); },
  rk(el) {
    const i = +el.dataset.i, j = i + +el.dataset.d; const r = ui.rank;
    const before = {}; document.querySelectorAll('.rank li[data-pid]').forEach((li) => { before[li.dataset.pid] = li.getBoundingClientRect().top; });
    [r[i], r[j]] = [r[j], r[i]]; ui.rankMoved = r[j]; render();
    document.querySelectorAll('.rank li[data-pid]').forEach((li) => {
      const dy = (before[li.dataset.pid] || 0) - li.getBoundingClientRect().top; if (!dy || reduced()) return;
      li.style.transition = 'none'; li.style.transform = `translateY(${dy}px)`;
      requestAnimationFrame(() => { li.style.transition = 'transform .28s cubic-bezier(.2,.8,.2,1)'; li.style.transform = ''; });
    });
    const btn = document.querySelector(`.rank li[data-pid="${r[j]}"] [data-act="rk"][data-d="${j < i ? -1 : 1}"]:not([aria-disabled="true"])`) || document.querySelector(`.rank li[data-pid="${r[j]}"] [data-act="rk"]:not([aria-disabled="true"])`); if (btn) btn.focus({ preventScroll: true });
    clearTimeout(ui.rankT); ui.rankT = setTimeout(() => { ui.rankMoved = null; const m = document.querySelector('.rank li.moved'); if (m) m.classList.remove('moved'); }, 900);
  },
  'rank-peek'(el) { ui.peek = ui.peek === el.dataset.pid ? null : el.dataset.pid; render(); },
  roster() { ui.ov = 'roster'; render(); },
  prio(el) { const L = prioList(), i = L.indexOf(el.dataset.pid), j = i + +el.dataset.d; if (i < 0 || j < 0 || j >= L.length) return; [L[i], L[j]] = [L[j], L[i]]; G.s.prio = L; save(); render(); },
  'rank-submit'() {
    const pr = C().priority, r = ui.rank, Ax = A(); G.s.answers.rank = r.slice(); G.s.prio = r.slice();
    const hits = r.filter((p, i) => pr.correct[i] === p).length;
    if (pr.judge) pr.judge(r, Ax);
    if (hits === r.length) Ax.judge('rank-all', 'priority', 1, 'Your first-round priorities matched an experienced charge nurse\'s.', 'Unstable or unknown first, time-critical second, stable and predictable last.');
    ui.rankDone = true; TEL.track('triage_ranked', { case: G.caseId, matched: hits, of: r.length }); render();
  },
  'rank-go'() { ui.ov = null; spend(15, () => {}); ui.view = 'station'; G.s.view = 'station'; save(); render(true); },
  goto(el) { enterRoom(el.dataset.pid); },
  /* The Next button: walk to the room and open whatever that task needs. */
  'do-next'(el) {
    const pid = el.dataset.pid, top = nowRows().find((r) => r.pid === pid);
    if (top && top.rp) return openReport(pid);
    if (top && top.away) return openAway(pid);
    if (!(ui.view === 'room' && G.s.loc === pid)) enterRoom(pid);
    if (G.s.ended || ui.ov || ui.view !== 'room' || G.s.loc !== pid) return;
    const r = nextFor(pid); if (!r || !r.go || r.go.act === 'bell' || r.go.act === 'round') return;
    const h = handlers[r.go.act]; if (h) h({ dataset: { id: r.go.id, pid, hl: r.go.act === 'dock' ? (r.hl || r.text) : undefined, sys: r.go.act === 'dock' ? r.sys : undefined } });
  },
  tl() { ui.tlOpen = !ui.tlOpen; render(); },
  'goals-t'() { ui.goalsOpen = !ui.goalsOpen; render(); },
  'foc-t'(el) { const dt = el.closest && el.closest('details'); ui.focOpen = !(dt && dt.open); render(); },
  back() { ui.ov = null; ui.receipt = null; spend(1, () => {}); if (G.s.ended) return; ui.view = 'station'; G.s.view = 'station'; G.s.loc = 'station'; ui.caption = null; save(); render(true); },
  dock(el) {
    if (ui.receipt && ui.dock !== el.dataset.id && Date.now() - ui.receipt.born > 4000) ui.receipt = null;
    ui.dock = el.dataset.id; render();
    // Coming from a task in the brain: point at the action that does it.
    if (el.dataset.hl) {
      const w = el.dataset.hl.toLowerCase().split(/[^a-z]+/).filter((x) => x.length > 3); let best = el.dataset.sys ? document.querySelector(`.pane .fs-row[data-sys="${el.dataset.sys}"]`) : null, bs = best ? 99 : 0;
      document.querySelectorAll('.pane .fs-row, .pane .mar-row').forEach((b) => { const l = (b.querySelector('b') || b).textContent.toLowerCase(), n = w.filter((x) => l.includes(x)).length; if (n > bs) { bs = n; best = b; } });
      if (best) {
        const fold = best.closest('details'); if (fold && !fold.open) { fold.open = true; ui.focOpen = true; }
        best.classList.add('hl');
        if (innerWidth <= 760) {
          // Land with the panel's heading just under the pinned header and tabs, so the rows above the pointed-at
          // one (vital signs first) stay in sight; if the panel is too tall, put that row at the bottom of the view.
          const pn = document.querySelector('.pane'), pin = pinned(), b = best.getBoundingClientRect();
          let top = pn ? scrollY + pn.getBoundingClientRect().top - pin : null;
          if (top === null || b.bottom - (top - scrollY) > innerHeight - 24) top = b.height > innerHeight - pin - 24 ? scrollY + b.top - pin : scrollY + b.bottom - (innerHeight - 24);
          window.scrollTo({ top: Math.max(0, top), behavior: reduced() ? 'auto' : 'smooth' });
        }
        return;
      }
    }
    // On a phone the panel sits below the scene: bring the chosen tab's content into view.
    const pn = document.querySelector('.pane'); if (pn && innerWidth <= 760) { const y = pn.getBoundingClientRect().top; if (y > innerHeight * .55 || y < pinned()) window.scrollTo({ top: scrollY + y - pinned(), behavior: reduced() ? 'auto' : 'smooth' }); }
  },
  assess(el) { doAssess(el.dataset.sys); if (!G.s.ended) render(); },
  'nh-assess'(el) { ui.dock = 'assess'; doAssess(el.dataset.sys); if (!G.s.ended) render(); },
  int(el) { const d = def(G.s.loc), P = G.s.p[d.id], x = d.interventions.find((i) => i.id === el.dataset.id); if (x.form) { ui.doc = { pid: d.id, id: x.id, a: {} }; ui.ov = 'doc'; TEL.track('doc_open', { case: G.s.caseId, doc: x.id }); return render(); } doAct(x.label, x.cost, (Ax) => { const k0 = G.s.judg.length; const t = x.run(G.s, P, Ax); F.recordErrors(G.s, Ax, d, `${lcFirst(x.label)} at ${E.clock(G.s.t)}`, k0, false, fbNow()); logHere(d.id, t || x.label, 'find'); G.s.log[G.s.log.length - 1].label = x.label; return t; }); if (!G.s.ended) render(); },
  poke() { const d = def(G.s.loc), line = sayNow(d); R.poke('room:' + d.id); if (line) { ui.captionPoke = true; ui.captionRaw = line.text; ui.caption = sayText(line.text, !line.quiet); ui.captionQuiet = !!line.quiet; } render(); },
  clue(el) { const d = def(G.s.loc), P = G.s.p[d.id]; if (d.onClue) d.onClue(el.dataset.id, G.s, P, A()); const cl = d.clues(G.s, P, A()); const t = cl[el.dataset.id] || genericClue(el.dataset.id, d, P, el); if (t) { ui.caption = t; ui.captionQuiet = false; ui.captionPoke = false; if (!G.s.log.some((l) => l.pid === d.id && l.text === t)) { logHere(d.id, t, 'clue'); } save(); } render(); },
  med(el) { ui.med = { id: el.dataset.id, dose: null, holding: false, reason: null, note: null }; ui.ov = 'med'; ui.chart = null; render(); },
  dose(el) { ui.med.dose = +el.dataset.v; render(); },
  hreason(el) { ui.med.reason = +el.dataset.v; ui.med.paramOk = false; if (ui.med.note && /hold criteria/.test(ui.med.note)) ui.med.note = null; render(); },
  'med-unhold'() { const d = def(G.s.loc), m = d.meds.find((x) => x.id === ui.med.id), st = G.s.meds[m.id]; const at = st.at; st.status = 'due'; st.at = null; st.note = ''; A().log(d.id, `${m.name}: hold reversed (held at ${E.clock(at)}).`, 'act'); G.s.log[G.s.log.length - 1].label = `${m.name} hold reversed`; ui.med.holding = false; ui.med.reason = null; save(); render(); },
  'med-holdask'() { ui.med.holding = true; render(); },
  'ngn-open'(el) { ngnStart(el.dataset.list || 'shift', +el.dataset.i || 0); ui.ov = 'ngn'; render(); },
  'ngn-go'(el) { const cs = ui.ngn && ui.ngn.cs; ngnStart(el.dataset.list || 'shift', +el.dataset.i, cs ? { cs } : null);
    // From set results: reopen the question as answered, with your answer and every option's reasoning showing.
    if (el.dataset.review) { const it = ngnList()[ui.ngn.i], r = it && (G.prof.ngn || {})[it.id]; if (r && r.a && NG.complete(it, r.a)) { ui.ngn.a = JSON.parse(JSON.stringify(r.a)); ui.ngn.checked = true; ui.ngn.review = true; } }
    ui.ov = 'ngn'; render(); const sb = document.querySelector('.sheet-b'); if (sb) sb.scrollTop = 0; },
  'ngn-move'(el) { const q = ui.ngn, o = q && q.a.o; if (!o || q.checked) return; const k = +el.dataset.k, j = k + +el.dataset.d; if (j < 0 || j >= o.length) return; [o[k], o[j]] = [o[j], o[k]]; render(); },
  practice() { ui.view = 'practice'; ui.ov = null; window.scrollTo(0, 0); TEL.track('practice_open', {}); render(); },
  ptab(el) { ui.pTab = el.dataset.v; ui.pAll = false; render(); },
  pf(el) { ui.pf = ui.pf || {}; ui.pf[el.dataset.k] = el.dataset.v || ''; ui.pAll = false; render(); },
  pall() { ui.pAll = true; render(); },
  pset() { const f = ui.pf || {}; startSet(bankFiltered(), [f.cn && CNL(f.cn), f.step && STEPNAME(f.step)].filter(Boolean).join(', ')); render(); },
  'pset-cn'(el) { ui.pf = { cn: el.dataset.v }; startSet(bankFiltered(), CNL(el.dataset.v)); render(); },
  'pset-step'(el) { ui.pf = { step: el.dataset.v }; startSet(bankFiltered(), STEPNAME(el.dataset.v)); render(); },
  'pset-done'() { ui.ov = 'pres'; render(); },
  'qb-one'(el) { ui.pset = { ids: [el.dataset.id], label: '' }; ngnStart('bank', 0); ui.ov = 'ngn'; render(); },
  'cs-open'(el) {
    const c = NG.caseById(el.dataset.id); if (!c) return; const done = G.prof.ngn || {};
    const i = el.dataset.i !== undefined ? +el.dataset.i : Math.max(0, c.items.findIndex((x) => !done[x.id]));
    ngnStart('case', i === -1 ? 0 : i, { cs: c.id }); ui.ov = 'ngn'; TEL.track('case_study_open', { id: c.id }); render();
  },
  'cs-retry'(el) { ngnStart('case', 0, { cs: el.dataset.id }); ui.ov = 'ngn'; render(); },
  'cs-tab'(el) { if (ui.ngn) ui.ngn.tab = el.dataset.v; render(); },
  'cs-done'() { ui.csres = ui.ngn && ui.ngn.cs; ui.ov = 'csres'; render(); },
  ref() { ui.refCard = null; ui.ov = 'ref'; render(); },
  'ref-card'(el) { ui.refCard = el.dataset.id; TEL.track('ref_card', { id: el.dataset.id }); render(); const sb = document.querySelector('.sheet-b'); if (sb) sb.scrollTop = 0; },
  'ref-back'() { ui.refCard = null; render(); },
  'deb-more'() { ui.debMore = !ui.debMore; render(); },
  meter(el) { ui.debMore = true; ui.mOpen = ui.mOpen || {}; const k = el.dataset.k; if (ui.mOpen[k]) delete ui.mOpen[k]; else ui.mOpen[k] = 1; render(); },
  'sc-why'() { ui.debMore = true; ui.scWhy = !ui.scWhy; if (ui.scWhy) TEL.track('debrief_score_why', { case: G.s ? G.s.caseId : G.caseId }); render(); },
  'ngn-pick'(el) {
    const q = ui.ngn, it = ngnList()[q.i], k = el.dataset.k, v = +el.dataset.v; if (q.checked) return;
    if (k === 'c' || k === 'm') q.a[k] = v;
    else if (k === 'a' || k === 'p') { const L = q.a[k] = q.a[k] || []; const at = L.indexOf(v); if (at >= 0) L.splice(at, 1); else { L.push(v); if (L.length > 2) L.shift(); } }
    else if (k === 'r' || k === 'd') { const L = q.a[k] = q.a[k] || []; L[+el.dataset.row] = v; }
    else { const L = q.a.s = q.a.s || []; const at = L.indexOf(v); if (at >= 0) L.splice(at, 1); else L.push(v); }
    render();
  },
  'ngn-check'() {
    const q = ui.ngn, it = ngnList()[q.i]; if (!NG.complete(it, q.a)) { const n = document.getElementById('ngn-num'); if (n) n.focus(); return; } q.checked = true;
    const where = G.s && q.list !== 'case' && q.list !== 'bank' ? G.s.caseId : q.list === 'case' ? q.cs : 'practice';
    const sc = NG.score(it, q.a), mx = NG.max(it); G.prof.ngn = G.prof.ngn || {}; const prev = G.prof.ngn[it.id];
    G.prof.ngn[it.id] = { score: Math.max(sc, prev ? prev.score : 0), max: mx, last: sc, at: Date.now(), a: JSON.parse(JSON.stringify(q.a)) }; E.store.saveProfile(G.prof);   // the answer, so review can show it
    TEL.track('ngn_item', { case: where, item: it.id, type: it.type, step: it.step, cn: it.cn || null, score: sc, max: mx, focus: q.list === 'focus', list: q.list });
    if (CL) CL.recordNgn(where, it, sc, mx);
    render();
  },
  prep(el) {
    const d = def(G.s.loc), P = G.s.p[d.id], p = el.dataset.p;
    if (p === 'vitals') doAssess('vitals', false);
    else if (p === 'pain') doAssess('pain', false);
    else { const x = d.interventions.find((i) => i.id === p); spend(x.cost, (Ax) => { const t = x.run(G.s, P, Ax); logHere(d.id, t, 'find'); G.s.log[G.s.log.length - 1].label = x.label; ui.med.note = t; }); }
    if (p === 'vitals' || p === 'pain') ui.med.note = G.s.log[G.s.log.length - 1].text;
    if (!G.s.ended) render();
  },
  'med-give'() {
    const d = def(G.s.loc), P = G.s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id), st = G.s.meds[m.id];
    if (!m.block && prnLimit(m, st)) return render();
    const dose = ui.med.dose; ui.ov = null; ui.med = null;
    // A med pass: once you're at the bedside with the cart, each further dose for the same patient takes less time.
    const pass = P.medPassAt !== undefined && G.s.t - P.medPassAt <= 6 && G.s.loc === d.id; P.medPassAt = G.s.t;
    doAct(m.infusion ? `${m.name}: pump set` : `${m.name} given`, pass ? 2 : 5, (Ax) => { P.medPassAt = G.s.t + (pass ? 2 : 5); const k0 = G.s.judg.length; const t = m.give(G.s, P, Ax, dose); const dl = (m.doses || []).find((x) => x.id === dose); F.recordErrors(G.s, Ax, d, `${m.name} ${dl ? dl.label.split(' (')[0] : m.dose} at ${E.clock(G.s.t)}`, k0, true, fbNow(), m.id); if (m.prn) st.given.push(G.s.t); else { st.status = 'given'; st.at = G.s.t; } logHere(d.id, `${m.name}: ${t}`, 'act'); G.s.log[G.s.log.length - 1].label = m.infusion ? (/\b(stopped|off|clamped)\b/i.test(t) ? `${m.name} stopped` : /^no change/i.test(t) || dose != null && dl && /no change|continue/i.test(dl.label) ? `${m.name} checked, no change` : `${m.name} rate changed`) : `${m.name} given`; return t; }); if (!G.s.ended) render();
  },
  'med-declined'() {
    const d = def(G.s.loc), P = G.s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id);
    ui.ov = null; ui.med = null;
    doAct(`${m.name} offered, declined`, 2, (Ax) => { const why = m.refuse(G.s, P, Ax); if (m.onRefuse) m.onRefuse(G.s, P, Ax); logHere(d.id, `${m.name} offered and declined. ${why || ''}`.trim(), 'act'); G.s.log[G.s.log.length - 1].label = `${m.name} declined`; return why; }); if (!G.s.ended) render();
  },
  'med-hold'() {
    const d = def(G.s.loc), P = G.s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id), st = G.s.meds[m.id];
    const reasons = ['Meets the hold parameter', 'Condition changed, clarify with provider', 'Not enough intake', 'Patient declined'];
    // Check the reason against the numbers before accepting it: a hold "for the parameter" when every check is inside it gets one warning.
    if (ui.med.reason === 0 && m.param && !ui.med.paramOk) { const ck = (m.checks ? m.checks(G.s, P, A()) : []).filter((c) => c.ok === true || c.ok === false); if (ck.length && ck.every((c) => c.ok === true)) { ui.med.paramOk = true; ui.med.note = `None of these meet the hold criteria (${m.param.replace(/\.$/, '')}): ${ck.map((c) => `${c.label} ${c.value}`).join(', ')}. By the order, this dose should be given. If you're holding for another reason, pick it; if you're sure, press Hold again.`; FX.play('nope'); return render(); } }
    const reason = ui.med.reason; ui.ov = null; ui.med = null;
    doAct(`${m.name} held`, 2, (Ax) => { let t; if (typeof m.hold === 'function') t = m.hold(G.s, P, Ax, reason); else { Ax.judge(m.id + '-hold', 'meds', -1, `You held ${d.short}'s ${m.name} without a clear clinical reason.`, 'Holding a scheduled dose is a decision with consequences. It needs a parameter or a change in condition behind it, and a notification.', d.id); t = 'Held.'; } st.status = 'held'; st.at = G.s.t; st.note = reasons[reason]; logHere(d.id, `${m.name} held (${reasons[reason].toLowerCase()}). ${t}`, 'act'); G.s.log[G.s.log.length - 1].label = `${m.name} held`; return `Held: ${reasons[reason].toLowerCase()}. ${t === 'Held.' ? '' : t}`.trim(); }); if (!G.s.ended) render();
  },
  talk(el) {
    const d = def(G.s.loc), P = G.s.p[d.id], Ax = A(), cid = d.talk(G.s, P, Ax), sid = cid && STY ? STY.pick(G.s, C(), d, P, Ax, cid) : null, id = sid || cid;
    if (!id) { hint(el, `${d.short} can't talk with you right now.`); return; }
    if (!sid) { G.s.seenDlg = G.s.seenDlg || {}; G.s.seenDlg[cid] = 1; }
    spend(3, () => {}); if (G.s.ended) return; G.s.p[d.id].touchAt = G.s.t; ui.dlgReview = null; ui.said = null; ui.captionPoke = false; ui.caption = null; ui.dlg = { id: sid ? id : again(d, cid) }; ui.ov = 'dialog'; ui.convoIn = true; R.poke('room:' + d.id); render(); },
  family() { const d = def(G.s.loc); spend(d.family.cost, () => {}); if (G.s.ended) return; G.s.p[d.id].touchAt = G.s.t; ui.dlgReview = null; ui.said = null; ui.convoIn = true; ui.dlg = { id: again(d, d.family.dialog(G.s, G.s.p[d.id], A()), true) }; ui.ov = 'dialog'; render(); },
  dlg(el) {
    const node = C().dialogs[ui.dlg.id], c = node.choices[+el.dataset.i];
    const Ax = A(), j0 = G.s.judg.length; if (c.fx) c.fx(G.s, Ax);
    G.s.doneDlg = G.s.doneDlg || {}; if (!node.story && !node.repeat) G.s.doneDlg[ui.dlg.id] = { t: G.s.t, bad: judgSince(j0).some((j) => j.delta < 0) };
    const rv = judgSince(j0); ui.dlgReview = rv.length ? rv : null; reviewSound(rv);
    const text = typeof node.text === 'function' ? node.text(G.s) : node.text;
    const pid = node.pid || (/^\d+$/.test(node.who) ? node.who : G.s.loc);
    if (STY && node.story) { const f = G.s.storyFresh; G.s.storyFresh = null; if (f && f.d > 0) { gain(25, f.why === 'presence' ? 'Presence' : 'Connection', 'bond'); ui.bondSound = true; } else if (f && f.d < 0) ui.pops.push({ text: 'Trust', label: `${def(f.pid).short} pulls back`, cls: 'lost' }); }
    else if (STY && G.s.p[pid]) STY.fromDialog(G.s, pid, rv.filter((j) => j.pid === pid));
    logHere(pid, `You: "${c.label}"`, 'act'); ui.said = c.label; ui.dlgLast = { who: node.who, text, story: node.story || null }; ui.convoIn = true;
    if (c.next) { const nx = C().dialogs[c.next]; logHere(pid, typeof nx.text === 'function' ? nx.text(G.s) : nx.text, 'info'); ui.dlg = { id: c.next }; if (isPt(nx.who)) setTimeout(() => R.poke('room:' + nx.who), 60); }
    else if (ui.dlgReview && fbNow()) { ui.dlg = { id: '__review' }; }
    else { ui.dlg = null; ui.ov = null; ui.said = null; }
    save(); render();
  },
  comm(el) { const d = def(G.s.loc), x = d.comms.find((c) => c.id === el.dataset.id); doAct(x.label, x.cost, (Ax) => { const t = x.run(G.s, G.s.p[d.id], Ax); logHere(d.id, t, 'act'); G.s.log[G.s.log.length - 1].label = x.label; return t; }); if (!G.s.ended) render(); },
  'err-charge'() {
    const d = def(G.s.loc), es = F.errsFor(G.s, d.id, 'charge'); if (!es.length) return;
    const toldMD = es.every((e) => e.md !== null), nm = staff('nova').name.split(' ')[0];
    doAct(`Told ${nm} about the error`, 2, (Ax) => { es.forEach((e) => F.tellCharge(G.s, Ax, d, e)); return `${nm}: "Thank you for telling me. ${toldMD ? 'Good that the doctor already knows.' : `Check on ${d.short}, then call ${prov(d.id).name} with an SBAR right now.`} I'll watch your other rooms for ten minutes, and we'll write the safety report together before you leave. Everyone makes one of these eventually. Telling fast is what keeps patients safe."`; });
    if (!G.s.ended) render();
  },
  'rrt-generic'() { const d = def(G.s.loc); doAct('Rapid response called', 3, (Ax) => { Ax.judge(d.id + '-rrt', 'judgment', 0, `You called a rapid response for ${d.short}.`, 'Calling for help when worried is always allowed. The team found a patient who didn\'t yet meet criteria. Next time, pair the call with an SBAR to the provider.', d.id); const t = `The rapid response nurse checks in, reviews vitals, and suggests calling ${prov().name} with an update. "Always call if you're worried."`; logHere(d.id, t, 'act'); G.s.log[G.s.log.length - 1].label = 'Rapid response'; return t; }); if (!G.s.ended) render(); },
  sbar(el) { ui.sbar = { pid: el.dataset.pid || null, picked: [], req: null, reply: null }; ui.ov = 'sbar'; render(); },
  callpick() { ui.sbar = { pid: null, picked: [], req: null, reply: null }; ui.ov = 'sbar'; render(); },
  'sbar-pick'(el) { const id = el.dataset.id, p = ui.sbar.picked; const i = p.indexOf(id); if (i >= 0) p.splice(i, 1); else p.push(id); render(); },
  'sbar-req'(el) { ui.sbar.req = el.dataset.id; render(); },
  'sbar-send'() {
    const pid = ui.sbar.pid, d = def(pid), P = G.s.p[pid]; let reply = ''; const j0 = G.s.judg.length;
    // The call is placed: a message that asked for it no longer offers to make it.
    G.s.inbox.forEach((m) => { if (m.replies && !m.done && (m.id === ui.sbar.msg || (m.pid === pid && m.replies.every((r) => ['sbar', 'goto', 'chart'].includes(r.act) && (!r.pid || r.pid === pid))))) { m.done = true; m.read = true; } });
    spend(6, (Ax) => {
      const rx = ui.sbar.picked.filter((id) => id.startsWith('rx:')).map((id) => { const [, mid, t] = id.split(':'); return { mid, t: +t, e: (G.s.errors || []).find((e) => e.pid === pid && e.medId === mid && e.t === +t) }; });
      const errs = ui.sbar.picked.filter((id) => id.startsWith('err:')).map((id) => (G.s.errors || []).find((e) => 'err:' + e.id === id)).concat(rx.map((r) => r.e)).filter(Boolean);
      const fine = rx.filter((r) => !r.e).map((r) => `The ${d.meds.find((m) => m.id === r.mid).name.toLowerCase()} at ${E.clock(r.t)} was ordered and appropriate. Thanks for double-checking.`);
      const held = ui.sbar.picked.filter((id) => id.startsWith('hd:')).map((id) => d.meds.find((m) => m.id === id.slice(3))).filter(Boolean).map((m) => { const st = G.s.meds[m.id], hAt = st.at, nm = m.name.toLowerCase(); if (m.param) { const ck = (m.checks ? m.checks(G.s, P, Ax) : []).filter((c) => c.ok === true || c.ok === false), bad = ck.filter((c) => c.ok === false); if (ck.length && !bad.length) { st.status = 'due'; st.at = null; st.note = ''; return `You held the ${nm} at ${E.clock(hAt)}? ${ck.map((c) => `${c.label} ${c.value}`).join(', ')}. None of that meets "${m.param}", so the order says give it. Give it now, and thanks for flagging it.`; } return `Holding the ${nm} was right: ${bad.map((c) => `${c.label.toLowerCase()} ${c.value}`).join(', ')}. Keep it held and recheck before the next dose.`; } return `Thanks for telling me about the ${nm}. Hold it for now; I'll review it.`; });
      const picked = ui.sbar.picked.filter((id) => !/^(err|rx|did|hd):/.test(id));
      const did = ui.sbar.picked.filter((id) => id.startsWith('did:')).map((id) => G.s.log.find((l) => 'did:' + l.id === id)).filter(Boolean);
      const noted = did.length ? `Good to know: ${did.slice(0, 3).map((l) => { const x = didText(l); return lcFirst(x); }).join('; ')}${did.length > 3 ? `, and ${did.length - 3} more` : ''}.` : '';
      const items = d.sbar.items(G.s, P, Ax); const keys = picked.filter((id) => (items.find((i) => i.id === id) || {}).key);
      const noise = picked.filter((id) => { const it = items.find((i) => i.id === id); return it && !it.key; });
      const fix = errs.map((e) => F.tellMD(G.s, Ax, d, e, prov(pid).name));
      reply = [errs.length ? `Thank you for telling me. ${[...new Set(fix)].join(' ')}` : '', ...fine, ...held, picked.length && ui.sbar.req ? d.sbar.respond.call(d.sbar, G.s, P, Ax, picked, ui.sbar.req) : '', noted].filter(Boolean).join(' ');
      if (!keys.length && !errs.length && !fine.length && !did.length) Ax.judge(pid + '-sbar-empty-' + G.s.t, 'comm', -1, `Your call about ${d.short} had no clinically significant data in it.`, 'Providers act on findings. Lead with what changed and what you measured.', pid);
      if (noise.length >= 2) Ax.judge(pid + '-sbar-noise', 'comm', 0, `Your SBAR on ${d.short} included details that didn't change the picture.`, 'Keep it short. Include what the provider needs to make a decision.', pid);
      P.k.calledAt = G.s.t; Ax.log(pid, `Called ${prov(pid).name}. "${reply}"`, 'info');
    });
    if (G.s.ended) return; ui.sbar.reply = reply; ui.sbar.review = judgSince(j0, pid); reviewSound(ui.sbar.review); stamp(`Called ${prov(pid).name}`, 6); render();
  },
  'doc-pick'(el) {
    const q = ui.doc; if (!q || q.done) return; const d = def(q.pid), x = d.interventions.find((i) => i.id === q.id), sec = x.form(G.s, G.s.p[q.pid], A()).sections.find((z) => z.id === el.dataset.s);
    const L = q.a[sec.id] = q.a[sec.id] || [], o = el.dataset.o;
    if (sec.one) q.a[sec.id] = [o]; else { const i = L.indexOf(o); if (i >= 0) L.splice(i, 1); else L.push(o); }
    render();
  },
  'doc-sign'() {
    const q = ui.doc; if (!q || q.done) return; const d = def(q.pid), P = G.s.p[q.pid], x = d.interventions.find((i) => i.id === q.id), f = x.form(G.s, P, A());
    if (!f.sections.every((sec) => (q.a[sec.id] || []).length)) return;
    const j0 = G.s.judg.length, t0 = G.s.t; let text = '';
    doAct(x.label, x.cost, (Ax) => { text = x.sign(G.s, P, Ax, q.a) || ''; Ax.note(q.pid, 'You (RN)', text); return f.title + ' signed.'; });
    if (G.s.ended) return;
    ui.doc = { pid: q.pid, id: q.id, done: { title: f.title, text, t: t0, review: judgSince(j0).filter((j) => /note/.test(j.key || '')) } };
    reviewSound(ui.doc.done.review); TEL.track('doc_sign', { case: G.s.caseId, doc: q.id }); ui.ov = 'doc'; render();
  },
  delegate(el) { if (cnaAway()) { hint((el && el.nodeType ? el : document.querySelector('[data-act=delegate]')) || document.body, `${cna().name} isn't on the unit: ${cnaAway().charAt(0).toLowerCase() + cnaAway().slice(1)}. Ask Nova if you need hands.`); return; } ui.ov = 'deleg'; ui.delegMsg = null; ui.delegReview = null; render(); },
  deleg(el) { const t = C().delegation.tasks.find((x) => x.id === el.dataset.t); let msg = ''; const n0 = G.s.deleg.length, j0 = G.s.judg.length; spend(1, (Ax) => { msg = C().delegation.start(t, el.dataset.pid, G.s, Ax); }); if (G.s.ended) return; ui.delegMsg = msg; ui.delegReview = judgSince(j0).filter((j) => /^deleg/.test(j.key || '')); reviewSound(ui.delegReview); const nx = G.s.deleg[G.s.deleg.length - 1]; ui.delegNew = G.s.deleg.length > n0 ? nx.id + ':' + nx.pid + ':' + nx.at : null; ui.ov = 'deleg'; stamp(`${cna().name} is on it`, 1); render(); },
  nova() { ui.nova = null; ui.ov = 'nova'; render(); },
  'nova-ask'() { if (G.s.nova <= 0) return; G.s.nova -= 1; ui.nova = C().novaHint(G.s, A()); G.s.novaLog.push({ t: G.s.t, text: ui.nova }); save(); render(); },
  inbox() { ui.ov = 'inbox'; render(); G.s.inbox.forEach((m) => { m.read = true; }); save(); },
  readall() { G.s.inbox.forEach((m) => { m.read = true; }); ui.toasts = ui.toasts.filter((id) => { const m = G.s.inbox.find((x) => x.id === id); return m && (m.urgent || (m.replies && !m.done)); }); if (ui.ov === 'inbox') ui.ov = null; save(); render(); },
  reply(el) { const m = G.s.inbox.find((x) => x.id === +el.dataset.m); if (!m || !m.replies) return; ui.toasts = ui.toasts.filter((x) => x !== m.id); ui.ov = null; onReply(m, m.replies[+el.dataset.i]); },
  'toast-x'(el) { const id = +el.dataset.m; ui.toasts = ui.toasts.filter((x) => x !== id); const m = G.s.inbox.find((x) => x.id === id); if (m) m.read = true; render(); },
  chart(el) { ui.guideChart = true; ui.chart = { pid: el.dataset.pid, tab: el.dataset.tab || (ui.chart && ui.chart.pid !== el.dataset.pid ? ui.chart.tab : 'overview') }; if (!el.dataset.tab && !(ui.ov === 'chart')) ui.chart.tab = 'overview'; ui.ov = 'chart'; render(); },
  catchup() { spend(10, (Ax) => Ax.log(null, 'Charted and caught up.', 'act')); if (!G.s.ended) render(); },   // test harness only; players skip ahead
  skip() { skipAhead(); },
  floor(el) { if (!G.s || G.s.ended) return; openFloor(el.dataset.id); },
  'floor-pick'(el) {
    const id = ui.fl.id, v0 = FL.view(G.s, C(), id); if (v0.done) return render();
    let r = null; spend(v0.cost, (Ax) => { r = FL.answer(G.s, Ax, id, +el.dataset.i); });
    if (G.s.ended) return; if (!r) return render();
    if (fbNow()) { if (r.v === 2) gain(40, 'Floor call bonus', 'good'); FX.play(r.v === 2 ? 'right' : r.v === 1 ? 'commit' : 'miss'); } else FX.play('commit');
    ui.ov = 'floor'; render();
  },
  health() { ui.ov = 'health'; render(); },
  install() { const ev = ui.installEvt; if (!ev) return; ui.installEvt = null; ui.ov = null; render(); try { ev.prompt(); ev.userChoice.then((c) => TEL.track('install_prompt', { outcome: c && c.outcome })).catch(() => {}); } catch (e) { /* prompt already used */ } },
  'install-ios'(el) { TEL.track('install_prompt', { outcome: 'ios_help' }); hint(el, 'In Safari, tap the Share button, then Add to Home Screen.'); },
  by(el) { ui.byCj = el.dataset.v === 'cj'; ui.dtab = ui.byCj ? 'nclex' : 'shift'; if (ui.byCj && !ui.byCjSeen) { ui.byCjSeen = true; TEL.track('debrief_steps_view', { case: G.s ? G.s.caseId : G.caseId }); } render(); },
  dtab(el) { const v = el.dataset.v === 'nclex' ? 'nclex' : 'shift'; if (ui.dtab === v) return; ui.dtab = v; ui.byCj = v === 'nclex'; TEL.track('debrief_tab', { case: G.s ? G.s.caseId : G.caseId, tab: v }); render(); const tb = document.querySelector('.dtabs'); if (tb && tb.getBoundingClientRect().top < 0) window.scrollTo(0, window.scrollY + tb.getBoundingClientRect().top - 64); },
  'cj-go'(el) { ui.mOpen = ui.mOpen || {}; Object.keys(ui.mOpen).forEach((k) => { if (k.startsWith('c:')) delete ui.mOpen[k]; }); ui.mOpen['c:' + el.dataset.v] = 1; render(); const m = document.querySelector('.nx-steps .meter.open'); if (m) m.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); },
  review() { ui.ov = 'review'; TEL.track('review_info', { case: G.caseId }); render(); },
  pack() { ui.ov = 'pack'; TEL.track('pack_view', { case: G.caseId, from: 'home' }); render(); },
  'pack-buy'() {
    const u = CL && CL.user(); if (!u || !PACK.checkoutUrl) return;
    TEL.track('pack_checkout', { case: G.caseId });
    const url = new URL(PACK.checkoutUrl); url.searchParams.set('client_reference_id', u.id); if (u.email) url.searchParams.set('prefilled_email', u.email);
    location.href = url.toString();
  },
  'pack-check'() { if (!CL) return; ui.packWait = ui.packWait || 'checking'; render(); packPoll(1); },
  cls() { ui.cls = { code: '', name: (ui.cls && ui.cls.name) || '' }; ui.ov = 'class'; TEL.track('class_open', {}); render(); },
  'cls-join'() {
    const c = ui.cls || (ui.cls = {}), code = (c.code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, ''), name = (c.name || '').trim();
    c.ok = null;
    if (code.length < 4) { c.err = 'Enter the class code from your instructor.'; return render(); }
    if (!name) { c.err = 'Add your name, so your instructor knows who you are.'; return render(); }
    c.err = null; c.busy = true; render();
    CL.join(code, name).then((k) => { c.busy = false; c.code = ''; c.list = null; c.ok = `You're in ${k && k.name ? k.name : 'the class'}.${k && k.pack ? ' Every shift is open to you.' : ''}`; render(); })
      .catch((e) => { c.busy = false; c.err = /no class/i.test(e.message) ? 'No class with that code. Check it with your instructor.' : /too many/i.test(e.message) ? e.message : 'Couldn\'t join. Check your connection and try again.'; render(); });
  },
  'cls-leave'(el) { const c = ui.cls || (ui.cls = {}); CL.leave(el.dataset.id).then(() => { c.list = null; c.ok = 'You left the class.'; render(); }).catch(() => { c.err = 'Couldn\'t leave the class. Try again.'; render(); }); },
  account() { ui.acct = { email: (ui.acct && ui.acct.email) || '' }; ui.ov = 'account'; render(); },
  'acct-send'() {
    const a = ui.acct || (ui.acct = {}), email = (a.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { a.err = 'That email doesn\'t look right.'; return render(); }
    a.err = null; a.busy = true; render();
    CL.sendLink(email).then(() => { a.busy = false; a.sent = email; render(); }).catch((e) => { a.busy = false; a.err = CL.why(e); render(); });
  },
  'acct-again'() { ui.acct = { email: '' }; render(); },
  'acct-sync'() { CL.sync().then(fromCloud).catch(() => {}); render(); },
  'acct-del-ask'() { ui.confirm = { title: 'Delete your account?', text: 'Your account, your saved progress and results, your class memberships (your instructor stops seeing your results), any classes you run, and any shift pack you bought are deleted for good. Progress on this device stays until you reset it. This can\'t be undone.', ok: 'Delete my account', act: 'acct-del-yes', danger: true }; ui.ov = 'confirm'; render(); },
  'acct-del-yes'() { const a = ui.acct || (ui.acct = {}); a.delErr = null; ui.ov = null; render();
    CL.deleteAccount().then(() => { render(); hint(document.querySelector('.top .mark') || document.body, 'Account deleted. Progress on this device stays until you reset it.'); })
      .catch((e) => { a.delErr = (e && e.message) || 'check your connection and try again'; ui.ov = 'account'; render(); }); },
  'acct-out'() { CL.signOut(); ui.ov = null; render(); hint(document.querySelector('.top .mark') || document.body, 'Signed out. Your progress stays on this device.'); },
  tel(el) { TEL.setOptOut(el.dataset.v === 'off'); render(); },
  'fb-pay'(el) { ui.fb = ui.fb || {}; ui.fb.pay = ui.fb.pay === el.dataset.v ? null : el.dataset.v; render(); },
  'fb-q'(el) { ui.fb = ui.fb || {}; const k = el.dataset.k; ui.fb[k] = ui.fb[k] === el.dataset.v ? null : el.dataset.v; render(); },
  'fb-send'() { const f = ui.fb || {}; if (!fbAny(f)) return; const d = G.s && G.s.ended ? E.debrief(G.s) : null; f.sent = TEL.feedback('debrief', Object.assign(fbWhere(), { difficulty: f.level || '', helps_nclex: f.nclex || '', would_pay: f.pay || '', note: (f.note || '').trim(), score: d ? d.overall : null })); render(); },
  rpt(el) { const k = el && el.dataset && el.dataset.k, tt = el && el.dataset && el.dataset.t, qid = el && el.dataset && el.dataset.q; const j = k !== undefined && G.s ? G.s.judg.find((x) => (x.key || '') === k && String(x.t) === String(tt)) || null : null; const q = qid && NG ? NG.byId(qid) : null; ui.rp = { j, q, back: q && ui.ov === 'ngn' ? 'ngn' : null, why: null, note: '' }; ui.ov = 'report'; render(); },
  'rpt-why'(el) { ui.rp.why = ui.rp.why === el.dataset.v ? null : el.dataset.v; render(); },
  'rpt-send'() { const r = ui.rp; if (!r || (!r.why && !r.note)) return; r.sent = TEL.feedback(r.j ? 'decision' : r.q ? 'question' : 'general', Object.assign(fbWhere(), { problem: r.why || '', note: (r.note || '').trim(), decision_key: r.j ? r.j.key || '' : '', decision_text: r.j ? r.j.text : '', patient: r.j ? r.j.pid || '' : '', question_id: r.q ? r.q.id : '', question_type: r.q ? r.q.type : '', question_step: r.q ? r.q.step || '' : '', question_stem: r.q ? String(r.q.stem || r.q.q || '').slice(0, 300) : '' })); render(); },
  'health-copy'(el) { copyText(ui.healthText || '').then((ok) => { if (ok) hint(el, 'Copied'); else hint(el, 'Copy blocked here. Select the text instead.'); }); },
  badge(el) { const b = RW.BADGES.find((x) => x.id === el.dataset.id); if (b) hint(el, `${b.label}: ${b.how}${G.prof.badges && G.prof.badges[b.id] ? ' ✓' : ''}`); },
  endask() { const late = G.s.t >= C().length - 30, left = pts().filter((x) => !gone(G.s.p[x.id]) && !(G.s.report && G.s.report[x.id])).map((x) => x.room); ui.confirm = { title: late ? 'End the shift?' : 'End the shift early?', text: late ? (left.length ? `You haven't given ${oncoming().name} report on ${left.join(', ')}. The next nurse starts blind on them.` : `${oncoming().name} has report on everyone. You'll see your debrief.`) : 'Unfinished work will count as missed in your debrief.', ok: late && left.length ? 'End without report' : 'End shift', act: 'end-yes' }; ui.ov = 'confirm'; render(); },
  'end-yes'() { ui.ov = null; endShift(); },
  filter(el) {
    ui.filter = el.dataset.k;
    if (el.dataset.k === 'bad' && G.s && !ui.reflected) { ui.reflected = true; G.prof.reflect = (G.prof.reflect || 0) + 1; G.prof.badges = G.prof.badges || {}; if (G.prof.reflect >= 3 && !G.prof.badges.reflect) { G.prof.badges.reflect = Date.now(); setTimeout(() => { const b = document.querySelector('.filter [data-k="bad"]'); if (b) hint(b, 'New badge: Reflective practice, for going back over your misses.'); FX.play('star'); }, 120); } E.store.saveProfile(G.prof); }
    render();
  },
  awards(el) { ui.awFrom = ui.view === 'debrief' ? 'debrief' : 'home'; ui.view = 'awards'; ui.awTab = (el && el.dataset.k) || ui.awTab || 'all'; ui.ov = null; render(true); },
  'aw-tab'(el) { ui.awTab = el.dataset.k; render(); },
  'les-f'(el) { ui.lesF = el.dataset.k; render(); },
  'aw-back'() { ui.view = ui.awFrom === 'debrief' && G.s && G.s.ended ? 'debrief' : 'home'; render(true); },
  'next-case'(el) { G.caseId = el.dataset.id; E.useCase(G.caseId); E.store.clear(); startNew(); },
  'reset-ask'() { const signed = CL && CL.user && CL.user(); ui.confirm = { title: 'Reset all progress?', text: `Every finished shift, star, XP point, badge, lesson and practice result on this device will be cleared, and any shift in progress ends. This can't be undone.${signed ? ' You\'re signed in: your account keeps its copy and will sync it back. Sign out first to start fresh here.' : ''}`, ok: 'Reset everything', act: 'reset-yes', danger: true }; ui.ov = 'confirm'; render(); },
  'reset-yes'() { E.store.clear(); E.store.clearLast(); G.s = null; ui.or = null; try { localStorage.removeItem(ORK); } catch (e) { /* storage off */ } ['runs', 'seen', 'ngn', 'stars', 'best', 'done', 'badges', 'floorSeen', 'lessons', 'life', 'badOut', 'reflect', 'xp', 'drills'].forEach((k) => { delete G.prof[k]; }); Object.assign(G.prof, { runs: [], seen: {} }); E.store.saveProfile(G.prof); G.prof = E.store.profile(); ui.coachStep = {}; ui.ov = null; ui.view = 'home'; TEL.track('progress_reset', {}); render(true); hint(document.querySelector('.top .mark') || document.body, 'Progress reset. Your next shift starts with the walkthrough.'); },
  'reset-tips'(el) { G.prof.seen = {}; E.store.saveProfile(G.prof); ui.coachStep = {}; render(); hint(document.querySelector('[data-act="reset-tips"]') || el, 'The intro and tips will show again.'); },
  'lastfind-x'() { ui.lastFind = null; render(); },
  'res-close'() { const c = ui.res && ui.res.crit, lab = ui.res && ui.res.label; ui.ov = null; ui.res = null; ui.flash = null; if (c) ui.spot = G.s.loc; const n = Date.now(); if (ui.ghosts.some((g) => g.held)) setTimeout(() => FX.play('check'), 300); ui.ghosts.forEach((g) => { if (g.held) { g.held = false; g.born = n; } }); ui.stampRow = lab ? { label: lab, born: n } : null; render(); },
  'crit-go'(el) { const m = G.s.inbox.find((x) => x.id === ui.crit); if (m) m.read = true; ui.ov = null; ui.crit = null; ui.spot = el.dataset.pid; enterRoom(el.dataset.pid); },
  'crit-x'() { const m = G.s.inbox.find((x) => x.id === ui.crit); if (m) m.read = true; const inRoom = m && ui.view === 'room' && G.s.loc === m.pid; ui.ov = null; ui.crit = null; if (inRoom) ui.spot = m.pid; render(); },
  'rc-x'() { ui.receipt = null; render(); },
  'res-inbox'() { ui.res = null; ui.flash = null; const n = Date.now(); ui.ghosts.forEach((g) => { if (g.held) { g.held = false; g.born = n; } }); handlers.inbox(); },
  'brain-all'() { ui.brainAll = !ui.brainAll; render(); },
  away(el) { if (!G.s || G.s.ended) return; openAway(el.dataset.pid || el.dataset.id); },
  'away-back'() { ui.away.mode = null; ui.away.picked = []; render(); },
  'away-ho'() { ui.away.noteText = null; ui.away.mode = 'ho'; ui.away.picked = []; ui.away.reply = null; ui.away.review = null; render(); },
  'away-pick'(el) { const p = ui.away.picked, i = p.indexOf(el.dataset.id); if (i >= 0) p.splice(i, 1); else p.push(el.dataset.id); render(); },
  'away-ho-send'() { const a = ui.away, j0 = G.s.judg.length; let rep = ''; spend(4, (Ax) => { rep = F.giveHandoff(G.s, Ax, a.pid, a.picked); }); if (G.s.ended) return; if (!ui.away) return render(); a.mode = null; a.reply = rep; a.replyFrom = G.s.p[a.pid].out.spec.nurse; a.review = judgSince(j0, a.pid); reviewSound(a.review); stamp('Report called', 4); render(); },
  'away-fam'() { if (!ui.away || !G.s.p[ui.away.pid].out || !G.s.p[ui.away.pid].out.spec.family) return render(); ui.away.noteText = null; ui.away.mode = 'fam'; ui.away.reply = null; ui.away.review = null; render(); },
  'away-fam-pick'(el) { const a = ui.away, j0 = G.s.judg.length; let rep = ''; spend(4, (Ax) => { rep = F.famUpdate(G.s, Ax, a.pid, el.dataset.id); }); if (G.s.ended) return; if (!ui.away) return render(); a.mode = null; a.reply = rep; a.replyFrom = (G.s.p[a.pid].out.spec.family.name || '').toLowerCase().normalize('NFD').replace(/[^a-z]/g, ''); a.review = judgSince(j0, a.pid); reviewSound(a.review); render(); },
  'away-note'() { const a = ui.away; let tx = ''; spend(3, (Ax) => { tx = F.writeNote(G.s, Ax, a.pid); }); if (G.s.ended) return; if (!ui.away) return render(); a.reply = null; a.review = null; stamp('Note signed', 3); a.noteText = tx; render(); },
  'away-upd'() { const a = ui.away; a.noteText = null; let r = null; spend(3, (Ax) => { r = F.callUpdate(G.s, Ax, a.pid); }); if (G.s.ended) return; if (!ui.away) return render(); a.mode = null; a.reply = `${staff(G.s.p[a.pid].out.spec.nurse).name}: "${r.text}"`; a.replyFrom = G.s.p[a.pid].out.spec.nurse; a.review = null; FX.play(r.st === 'crit' ? 'worse' : r.st === 'improving' || r.st === 'stable' ? 'better' : 'msg'); render(); },
  bell(el) { const d = def(G.s.loc); if (!G.s.p[d.id].bell) return render(); doAct('Answered the call light', 2, (Ax) => { const tx = F.answerBell(G.s, Ax, d.id); logHere(d.id, tx, 'find'); G.s.log[G.s.log.length - 1].label = 'Call light'; return tx; }); if (STY && !G.s.ended) STY.fromBell(G.s, d.id); if (!G.s.ended) render(); },
  round(el) { const d = def(G.s.loc), lab = ROUND[F.kindOf(C())][0]; doAct(lab, 2, (Ax) => { const tx = F.round(G.s, Ax, d.id); logHere(d.id, tx, 'find'); G.s.log[G.s.log.length - 1].label = lab; return tx; }); if (!G.s.ended) render(); },
  report(el) { if (!G.s || G.s.ended || !inGame()) return; openReport(el.dataset.pid || el.dataset.id || null); },
  'rep-go'(el) { ui.rep = { pid: el.dataset.pid, picked: [], reply: null, review: null }; render(); },
  'rep-pick'(el) { const p = ui.rep.picked, i = p.indexOf(el.dataset.id); if (i >= 0) p.splice(i, 1); else p.push(el.dataset.id); render(); },
  'rep-send'() { const r = ui.rep, d = def(r.pid), P = G.s.p[r.pid], items = reportItems(d, P), j0 = G.s.judg.length; let rep = ''; spend(2, (Ax) => { rep = F.giveReport(G.s, Ax, r.pid, r.picked, items); }); if (G.s.ended) return; if (!ui.rep) return render(); r.reply = rep; r.replyPid = r.pid; r.review = judgSince(j0, r.pid); reviewSound(r.review); stamp(`Report on ${d.short}`, 2); render(); },
  calls() { ui.ov = 'calls'; render(); },
  here() { render(); window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }); },
  'intro-tap'() { if (!ui.introAll) { ui.introAll = true; render(); } },
  'intro-go'() { markSeen('intro:' + G.caseId); ui.intro = null; ui.introAll = false; render(); },
  'coach-next'() { const c = coachFor(); if (!c) return; ui.coachStep[c.key] = c.i + 1; if (c.i + 1 >= c.n) { markSeen('coach:' + c.key); if (c.key === 'room') TEL.track('tour_done', { case: G.s.caseId }); } coachPlace(); },
  'coach-skip'() { if (ui.view === 'room' && !seen('coach:room')) TEL.track('tour_skip', { step: (ui.coachStep && ui.coachStep.room) || 0, case: G.s && G.s.caseId }); markSeen('coach:station'); markSeen('coach:room'); coachPlace(); },
  msg(el) {
    const m = G.s.inbox.find((x) => x.id === +el.dataset.m); if (!m) return;
    m.read = true; ui.toasts = ui.toasts.filter((x) => x !== m.id);
    if (m.replies && !m.done && m.replies.length > 1 && !m.bell) { ui.ov = 'inbox'; ui.msgFocus = m.id; save(); return render(); }   // a question with choices opens where the choices are
    if (m.pid && def(m.pid) && here(def(m.pid)) && gone(G.s.p[m.pid]) && m.away) return openAway(m.pid);
    if (m.pid && def(m.pid) && here(def(m.pid)) && !gone(G.s.p[m.pid]) && !(ui.view === 'room' && G.s.loc === m.pid)) return enterRoom(m.pid);
    save(); render();
  },
  pending(el) { const d = def(el.dataset.pid); hint(el, `${d.room} is ${/^[AEIOU]/i.test(admWord(d)) ? 'an' : 'a'} ${admWord(d).toLowerCase()} from ${fromOf(d)}, arriving about ${E.clock(d.arrives)}.`); },
  cast(el) {
    const id = el.dataset.id; R.poke(id + ':bust');
    const d = C().patients.find((p) => p.id === id), look = d ? d.look : (C().staff[id] || {}).look;
    const text = id === 'nova' ? sayText('Go see the sickest one first.', true) : look && look.lines ? sayText(look.lines.calm, true) : null;
    ui.castSay = text ? { id, text } : null; render();
    clearTimeout(ui.castT); ui.castT = setTimeout(() => { if (ui.castSay && ui.castSay.id === id && ui.view === 'home') { ui.castSay = null; render(); } }, 3200);
  },
};

/* Feedback. Answers get a pop and a moment to register; commitments get a chime and a stamp.
   None of it says whether the choice was right: that stays in the debrief. */
export const SELECT = new Set(['deb-more', 'dtab', 'cj-go', 'ptab', 'pf', 'cs-tab', 'ngn-move', 'ref-card', 'meter', 'sc-why', 'aw-tab', 'les-f', 'awards', 'aw-back', 'away', 'away-ho', 'away-fam', 'away-back', 'report', 'rep-go', 'roster', 'prio', 'rank-peek', 'calls', 'brain-all', 'here', 'sbar-req', 'dose', 'hreason', 'pick-case', 'rk', 'filter', 'set', 'assess', 'prep', 'h-go', 'dock', 'poke', 'clue', 'cast', 'msg']);
export const TOGGLE = new Set(['sbar-pick', 'flag', 'away-pick', 'rep-pick']);
export const COMMIT = new Set(['reset-yes', 'doc-sign', 'away-ho-send', 'away-note', 'away-upd', 'rep-send', 'bell', 'round', 'crit-x', 'reset-tips', 'med-give', 'med-hold', 'med-declined', 'sbar-send', 'int', 'comm', 'rrt-generic', 'nova-ask', 'rank-go', 'end-yes', 'new-yes', 'catchup']);
export const NAV = new Set(['crit-go', 'goto', 'do-next', 'back', 'msg', 'rank-go', 'h-done', 'new', 'new-yes', 'resume', 'home', 'end-yes', 'next-case', 'intro-go']);
export const CHOOSE = { dlg: 'select', reply: 'select', deleg: 'commit', 'away-fam-pick': 'select' };           // answers that advance the scene
export const JUST = new Set(['ngn-pick', 'pf', 'away-pick', 'rep-pick', 'rep-go', 'sbar-req', 'dose', 'hreason', 'pick-case', 'sbar-pick', 'flag', 'set', 'filter', 'h-go', 'dock', 'chart']);
export const reduced = () => G.prof.settings.motion === 'reduced' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
/* Punch: a flash ring and a ripple from the tap point, drawn outside #app so it survives re-render. */
export function zap(el, e, kind) {
  if (!el || !el.getBoundingClientRect || el.dataset.scrim || reduced()) return;
  const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
  const big = r.width * r.height > innerWidth * innerHeight * .45;
  const z = document.createElement('div'); z.className = 'zap' + (kind ? ' ' + kind : '') + (big ? ' big' : '');
  const rad = el instanceof SVGElement ? '14px' : getComputedStyle(el).borderRadius || '8px';
  Object.assign(z.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: rad });
  const x = e && e.clientX ? e.clientX - r.left : r.width / 2, y = e && e.clientY ? e.clientY - r.top : r.height / 2;
  const d = Math.min(900, Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2.1);
  const i = document.createElement('i'); Object.assign(i.style, { left: x + 'px', top: y + 'px', width: d + 'px', height: d + 'px' }); z.appendChild(i);
  document.body.appendChild(z); setTimeout(() => z.remove(), 650);
}
/* A short note next to the thing that was tapped: why it can't be done, or what it is. */
export function hint(el, text, kind) {
  document.querySelectorAll('.pop-tip').forEach((n) => n.remove());
  if (!text) return;
  const r = el.getBoundingClientRect(), n = document.createElement('div'); n.className = 'pop-tip' + (kind ? ' ' + kind : ''); n.setAttribute('role', 'status'); n.textContent = text;
  document.body.appendChild(n);
  const w = n.offsetWidth, h = n.offsetHeight, below = r.bottom + h + 12 < innerHeight;
  n.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px';
  n.style.top = (below ? r.bottom + 8 : Math.max(8, r.top - h - 8)) + 'px';
  setTimeout(() => { n.classList.add('out'); setTimeout(() => n.remove(), 250); }, 2200);
}
/* Crash guard: an error never leaves a dead screen. The player can carry on, and the details are kept to report. */
export function safe(act, fn) { try { fn(); return true; } catch (err) { crashed(err, act); return false; } }
export function crashed(err, act) {
  ui.busy = false; G.RC = null;
  const info = { at: new Date().toISOString(), act: act || '', msg: String(err && err.message || err), stack: String(err && err.stack || '').split('\n').slice(0, 6).join('\n'), view: ui.view, ov: ui.ov, t: G.s ? G.s.t : null, caseId: G.s ? G.s.caseId : G.caseId, ua: navigator.userAgent };
  try { localStorage.setItem('theshift.lastError', JSON.stringify(info)); } catch (e) { /* storage off */ }
  try { TEL.track('error', { msg: info.msg.slice(0, 200), act: info.act, view: info.view, ov: info.ov || '', case: info.caseId, game_min: info.t === null ? null : Math.round(info.t), stack: info.stack.slice(0, 500) }); } catch (e) { /* never let reporting crash */ }
  try { console.error('The Shift error', info); } catch (e) { /* no console */ }
  if (document.querySelector('.oops')) return;
  const n = document.createElement('div'); n.className = 'oops'; n.setAttribute('role', 'alertdialog');
  const detail = `${info.msg}\n[${info.act || 'render'} · ${info.view}${info.ov ? '/' + info.ov : ''} · t=${info.t} · ${info.caseId}]\n${info.stack}`;
  n.innerHTML = `<div class="oops-c"><h2>Something went wrong</h2><p>Your shift is saved. You can keep playing, or go home and resume.</p><pre>${esc(detail)}</pre><div class="oops-f"><button class="btn" data-x="copy">Copy details</button><button class="btn" data-x="home">Home</button><button class="btn btn-primary" data-x="go">Keep playing</button></div></div>`;
  document.body.appendChild(n);
  n.addEventListener('click', (e) => {
    const x = e.target.closest('[data-x]'); if (!x) return; e.stopPropagation();
    if (x.dataset.x === 'copy') { copyText(detail).then((ok) => { x.textContent = ok ? 'Copied' : 'Select the text above'; }); return; }
    n.remove(); document.querySelectorAll('.ff,.xpop,.coach,.coach-ring').forEach((q) => q.remove());
    if (x.dataset.x === 'home') { if (G.s && !G.s.ended) save(); ui.view = 'home'; }
    ui.ov = null; ui.ff = null; ui.pops = []; ui.critQ = [];
    try { render(true); } catch (e2) { ui.view = 'home'; try { render(true); } catch (e3) { /* truly stuck */ } }
  });
}
/* A thrown error in the game's own code shows the crash card. Errors from browser extensions don't. A rejected
   promise is never game logic (the game's state code is synchronous): it's the browser declining something
   (audio, clipboard, a network call, the install prompt), so it's logged quietly instead of blanking the game. */
addEventListener('error', (e) => { if (!e.error) return; const f = String(e.filename || ''); if (f && !f.startsWith(location.href.split('#')[0].split('?')[0]) && !f.startsWith(location.origin)) return; crashed(e.error, 'async'); });
addEventListener('unhandledrejection', (e) => {
  try { e.preventDefault(); } catch (er) { /* old browsers */ }
  const r = e.reason, info = { at: new Date().toISOString(), act: 'promise', msg: String((r && r.message) || r), name: String((r && r.name) || ''), view: ui.view, ov: ui.ov || '', caseId: G.s ? G.s.caseId : G.caseId };
  try { localStorage.setItem('theshift.lastAsync', JSON.stringify(info)); } catch (er) { /* storage off */ }
  try { TEL.track('error_async', { msg: info.msg.slice(0, 200), name: info.name, view: info.view, ov: info.ov, case: info.caseId }); } catch (er) { /* never let reporting crash */ }
});
// Copy text: the clipboard API where allowed, a hidden textarea where it isn't. Resolves true or false, never rejects.
export function copyText(text) {
  const legacy = () => { try { const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok; } catch (e) { return false; } };
  try { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(() => true, () => legacy()); } catch (e) { /* fall through */ }
  return Promise.resolve(legacy());
}
export function onClick(e) {
  armIdle();
  if (ui.dragJust) { ui.dragJust = false; return; }
  const el = e.target.closest('[data-act]');
  if (!el) return;
  if (el.dataset.scrim && e.target !== el) return; // clicks inside sheet don't close
  const a = el.dataset.act; if (!a) return;
  const h = handlers[a]; if (!h) return;
  e.preventDefault();
  if (ui.busy) return;
  if (TERMS && !termsOk() && ui.view === 'home' && !ui.ov && !ui.termsAsk && !TERMS_FREE.has(a)) { ui.termsAsk = true; ui.afterTerms = { a, ds: Object.assign({}, el.dataset) }; return render(); }
  if (el.getAttribute('aria-disabled') === 'true') {
    // Nope: shake, a low double thud, and the reason.
    const tgt = el.tagName === 'INPUT' ? el.closest('.opt') || el : el;
    zap(tgt, e, 'no'); FX.play('nope'); hint(tgt, el.dataset.why || 'Not available right now.', 'no');
    return;
  }
  if (el.dataset.hold) {
    if (ui.holdDone) { ui.holdDone = false; return; }
    // A plain tap arms the button; a second tap within a few seconds commits. Keyboard activation commits at once.
    const hk = el.dataset.hk || a;
    if (e.detail !== 0 && e.clientX !== undefined && !(ui.armed && ui.armed.k === hk && Date.now() - ui.armed.at < 4000)) { ui.armed = { k: hk, at: Date.now() }; el.classList.add('armed'); hint(el, 'Tap again to confirm, or press and hold.', ''); FX.play('tap'); clearTimeout(ui.armT); ui.armT = setTimeout(() => { ui.armed = null; document.querySelectorAll('.holdbtn.armed').forEach((b) => b.classList.remove('armed')); }, 4000); return; }
    ui.armed = null; cancelHold();
  }
  if (!a.startsWith('dr-') || a === 'dr-start') zap(el.tagName === 'INPUT' ? el.closest('.opt') || el : el, e, COMMIT.has(a) ? 'strong' : '');   // drills animate their own answers
  if (NAV.has(a)) {
    // Screen changes: show the press first, then move.
    ui.busy = true; FX.play(COMMIT.has(a) ? 'commit' : a === 'msg' ? 'select' : 'tap');
    setTimeout(() => { ui.busy = false; document.querySelectorAll('.zap').forEach((z) => z.remove()); safe(a, () => h(el)); }, reduced() ? 40 : 130);
    return;
  }
  const choose = CHOOSE[a] || (a === 'sbar' && el.classList.contains('choice') ? 'select' : null);
  if (choose) {
    // Let the pick land: mark it, sound it, then move on.
    ui.busy = true; el.classList.add('chosen'); const box = el.closest('.sheet, .toast, .msg'); if (box) box.classList.add('choosing');
    FX.play(choose);
    setTimeout(() => { ui.busy = false; safe(a, () => h(el)); }, reduced() ? 60 : 280);
    return;
  }
  if (a === 'set' && el.dataset.k === 'sound') FX.setOn(el.dataset.v !== 'off');
  if (JUST.has(a)) ui.justKey = keyOf(el);
  if (!safe(a, () => h(el))) return;
  if (a === 'rank-submit') { const pr = C().priority; FX.play(ui.rank.every((p, i) => pr.correct[i] === p) ? 'right' : 'commit'); }
  else if (a === 'ngn-pick') { const now = [...document.querySelectorAll('[data-act="ngn-pick"]')].find((x) => keyOf(x) === keyOf(el)); FX.play(now && now.classList.contains('on') ? 'select' : 'deselect'); }
  else if (TOGGLE.has(a)) FX.play((a === 'flag' ? G.s.brain.includes(el.dataset.k) : a === 'away-pick' ? ui.away.picked.includes(el.dataset.id) : a === 'rep-pick' ? ui.rep.picked.includes(el.dataset.id) : ui.sbar && ui.sbar.picked.includes(el.dataset.id)) ? 'select' : 'deselect');
  else FX.play(COMMIT.has(a) ? 'commit' : SELECT.has(a) ? 'select' : 'tap');
}
/* Press-and-hold: a committing action takes a deliberate beat (HOLD_MS, the same everywhere).
   The hold is tracked by key, not by element, so a re-render under the finger (a toast, the clock) doesn't
   cancel it or hide its progress; only lifting the finger or sliding well off the button does. */
export const HOLD_MS = 600;
export function holdKey(el) { return el.dataset.hk || el.dataset.act; }
export function holdEls(k) { return [...document.querySelectorAll('[data-hold]')].filter((x) => holdKey(x) === k); }
export function startHold(e) {
  if (e.button > 0) return;
  const el = e.target.closest && e.target.closest('[data-hold]'); if (!el || el.getAttribute('aria-disabled') === 'true' || ui.busy) return;
  cancelHold(); const k = holdKey(el);
  ui.hold = { k, act: el.dataset.act, ds: Object.assign({}, el.dataset), t0: performance.now(), x: e.clientX, y: e.clientY, id: e.pointerId };
  el.classList.add('holding'); FX.play('tap');
  const step = () => {
    const h = ui.hold; if (!h || h.k !== k) return;
    const f = Math.min(1, (performance.now() - h.t0) / HOLD_MS);
    holdEls(k).forEach((b) => { b.classList.add('holding'); b.style.setProperty('--hp', f.toFixed(3)); });
    if (f < 1) { h.raf = requestAnimationFrame(step); return; }
    ui.hold = null; holdEls(k).forEach((b) => { b.classList.remove('holding', 'armed'); b.style.removeProperty('--hp'); });
    ui.holdDone = true; setTimeout(() => { ui.holdDone = false; }, 600); ui.armed = null;
    const cur = holdEls(k)[0] || el; zap(cur, null, 'strong'); FX.play('commit');
    const fn = handlers[h.act]; if (fn) safe(h.act, () => fn(cur.isConnected ? cur : { dataset: h.ds }));
  };
  ui.hold.raf = requestAnimationFrame(step);
}
export function moveHold(e) {
  const h = ui.hold; if (!h || (h.id !== undefined && e.pointerId !== h.id)) return;
  // Sliding off the button cancels; a jitter, or the button being redrawn underneath, doesn't.
  const b = holdEls(h.k)[0], r = b && b.getBoundingClientRect();
  const off = r ? (e.clientX < r.left - 16 || e.clientX > r.right + 16 || e.clientY < r.top - 16 || e.clientY > r.bottom + 16) : Math.hypot(e.clientX - h.x, e.clientY - h.y) > 40;
  if (off) cancelHold();
}
export function cancelHold() {
  const h = ui.hold; ui.hold = null;
  if (h) { cancelAnimationFrame(h.raf); holdEls(h.k).forEach((b) => { b.classList.remove('holding'); b.style.removeProperty('--hp'); }); }
}
// How much of the top of the screen the pinned header, patient strip and room tabs cover on a phone.
export function pinned() {
  let b = 0;
  document.querySelectorAll('.top, .pstrip, .rail').forEach((x) => { const cs = getComputedStyle(x); if (cs.position === 'sticky' || cs.position === 'fixed') b = Math.max(b, (parseFloat(cs.top) || 0) + x.offsetHeight); });
  return (b || 60) + 8;
}
// Keep Tab inside an open modal: the screen behind it is covered, so focus must not wander there.
export function trapTab(e) {
  const vis = (x) => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(x).visibility !== 'hidden'; };
  const m = [...document.querySelectorAll('[role="dialog"][aria-modal="true"],[role="alertdialog"]')].filter(vis).pop(); if (!m) return false;
  const f = [...m.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select,textarea,summary,[tabindex]:not([tabindex="-1"])')].filter((x) => vis(x) && !x.closest('[inert]'));
  if (!f.length) return false;
  const a = document.activeElement, first = f[0], last = f[f.length - 1];
  if (!m.contains(a)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return true; }
  if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); return true; }
  if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); return true; }
  return false;
}
export function onKey(e) {
  if (e.key === 'Tab' && trapTab(e)) return;
  if (ui.view === 'drill' && DR && !ui.ov && !/INPUT|TEXTAREA/.test((e.target && e.target.tagName) || '') && DR.key(e)) return;
  if (e.key === 'Escape' && ui.ov === 'crit') { handlers['crit-x'](); return; }
  if (e.key === 'Escape' && ui.ov === 'result') { handlers['res-close'](); return; }
  if (ui.ov === 'orient' && ui.or && !/INPUT|TEXTAREA/.test((e.target && e.target.tagName) || '')) { if (e.key === 'Escape') { closeOrient(false); return; } if (e.key === 'ArrowRight' && !(e.target.closest && e.target.closest('.or-board'))) { handlers.or({ dataset: { do: ui.or.i === OR.CH.length - 1 ? 'done' : 'next' } }); return; } if (e.key === 'ArrowLeft' && !(e.target.closest && e.target.closest('.or-board'))) { handlers.or({ dataset: { do: 'back' } }); return; } }
  if (ui.ov === 'dialog' && ui.view === 'room' && /^[1-9]$/.test(e.key) && !/INPUT|TEXTAREA/.test((e.target && e.target.tagName) || '')) { const b = document.querySelectorAll('.convo .cv-reply')[+e.key - 1]; if (b) { e.preventDefault(); b.click(); return; } }
  if (e.key === 'Escape' && ui.ov && ui.ov !== 'rank') { handlers.close(); return; }
  if (e.key === 'Escape' && !ui.ov && G.s && !G.s.ended && ui.view === 'room') { handlers.back(); return; }
  const el = e.target;
  if ((e.key === 'Enter' || e.key === ' ') && el && el.getAttribute && el.getAttribute('role') === 'button' && el.tagName !== 'BUTTON') { e.preventDefault(); onClick({ target: el, preventDefault() {} }); }
}
export function sortDown(e) {
  if (e.button > 0 || ui.busy) return;
  const li = e.target.closest && e.target.closest('[data-sort] > [data-key]'); if (!li) return;
  const list = li.parentElement; if (list.classList.contains('done')) return;
  if (!e.target.closest('.grip') && (e.pointerType === 'touch' || e.target.closest('button, a, input, textarea, select, summary'))) return;
  const items = [...list.children].filter((x) => x.dataset.key);
  if (items.length < 2) return;
  const tops = items.map((x) => x.offsetTop), hs = items.map((x) => x.offsetHeight);
  const gap = Math.max(0, tops[1] - tops[0] - hs[0]);
  const sc = list.closest('.sheet-b, .or-body') || document.scrollingElement;
  G.SD = { li, list, items, tops, hs, gap, idx: items.indexOf(li), to: items.indexOf(li), y0: e.clientY, s0: sc.scrollTop, sc, id: e.pointerId, moved: false };
  try { li.setPointerCapture(e.pointerId); } catch (er) { /* fine */ }
  e.preventDefault();
}
export function sortMove(e) {
  if (!G.SD || e.pointerId !== G.SD.id) return;
  const d = G.SD, dy0 = e.clientY - d.y0 + (d.sc.scrollTop - d.s0);
  if (!d.moved) { if (Math.abs(dy0) < 4) return; d.moved = true; d.li.classList.add('dragging'); d.list.classList.add('sorting'); FX.play('tap'); }
  const lo = d.tops[0] - d.tops[d.idx], hi = d.tops[d.items.length - 1] + d.hs[d.items.length - 1] - d.tops[d.idx] - d.hs[d.idx];
  const dy = Math.max(lo - 12, Math.min(hi + 12, dy0));
  d.li.style.transform = `translateY(${dy}px) scale(1.02)`;
  // Cards differ in height: going up, the dragged card's top edge decides; going down, its bottom edge.
  const top = d.tops[d.idx] + dy, bot = top + d.hs[d.idx];
  let to = d.idx; d.items.forEach((x, j) => { const mid = d.tops[j] + d.hs[j] / 2; if (j < d.idx && top < mid) to = Math.min(to, j); if (j > d.idx && bot > mid) to = Math.max(to, j); });
  const step = d.hs[d.idx] + d.gap;
  d.items.forEach((x, j) => { if (j === d.idx) return; const sh = j > d.idx && j <= to ? -step : j < d.idx && j >= to ? step : 0; x.style.transform = sh ? `translateY(${sh}px)` : ''; });
  if (to !== d.to) {
    d.to = to; FX.play('tap');
    const ord = d.items.map((x, j) => j).filter((j) => j !== d.idx); ord.splice(to, 0, d.idx);
    const L = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
    ord.forEach((j, pos) => { const n = d.items[j].querySelector('.n'); if (!n) return; const bb = n.querySelector('b'), sm = n.querySelector('small'); if (bb) bb.textContent = pos + 1; if (sm) sm.textContent = pos === 0 ? 'first' : pos === ord.length - 1 ? 'last' : L[pos]; n.classList.toggle('lead', pos === 0); }); const live = document.getElementById('rank-live'); if (live) live.textContent = `Moved to position ${to + 1} of ${d.items.length}.`; }
  const r = d.sc === document.scrollingElement ? { top: 0, bottom: innerHeight } : d.sc.getBoundingClientRect();
  if (e.clientY < r.top + 48) d.sc.scrollTop -= 10; else if (e.clientY > r.bottom - 48) d.sc.scrollTop += 10;
}
export function sortUp(e) {
  if (!G.SD || e.pointerId !== G.SD.id) return;
  const d = G.SD; G.SD = null;
  if (!d.moved) return;
  ui.dragJust = true; setTimeout(() => { ui.dragJust = false; }, 60);
  const keys = d.items.map((x) => x.dataset.key), k = keys.splice(d.idx, 1)[0]; keys.splice(d.to, 0, k);
  const from = d.li.getBoundingClientRect().top;
  d.items.forEach((x) => { x.style.transform = ''; }); d.list.classList.remove('sorting');
  onSorted(d.list.dataset.sort, keys, k);
  const n = document.querySelector(`[data-sort="${d.list.dataset.sort}"] > [data-key="${k}"]`);
  if (n && !reduced()) { const dy = from - n.getBoundingClientRect().top; n.style.transition = 'none'; n.style.transform = `translateY(${dy}px) scale(1.02)`; requestAnimationFrame(() => { n.style.transition = 'transform .22s cubic-bezier(.2,.8,.2,1)'; n.style.transform = ''; }); }
  FX.play('commit');
}
export function onSorted(name, keys, moved) {
  if (name === 'rank' && ui.rank && !ui.rankDone) {
    ui.rank = keys; ui.rankMoved = moved; ui.rankDragged = true; render();
    clearTimeout(ui.rankT); ui.rankT = setTimeout(() => { ui.rankMoved = null; const m = document.querySelector('.rank li.moved'); if (m) m.classList.remove('moved'); }, 900);
    const f = document.querySelector(`.rank li[data-key="${moved}"] .grip`); if (f) f.focus && f.focus({ preventScroll: true });
  } else if (S.orient && S.orient.sorted(name, keys, moved)) render();
}

export function boot() {
  applySettings();
  // Shifts load on demand (E.lazy): boot works from each shift's metadata, and a shift's own script is parsed the
  // first time it's opened. Staff from the flow and the floor, and the oncoming nurse, join every shift's staff list;
  // every patient's and staff member's look is defined now, so the picker can draw them without loading anything.
  const all = CASES.map((id) => E.caseMeta(id)).filter(Boolean);
  all.forEach((k) => { const add = Object.assign(F.staffFor(k, all), FL.staffFor()); Object.keys(add).forEach((key) => { if (!k.staff[key]) k.staff[key] = add[key]; }); });
  CASES.forEach((id) => { const k = E.caseMeta(id); if (!k) return; k.patients.forEach((p) => R.define(p.id, p.look)); Object.entries(k.staff).forEach(([key, v]) => { if (v.look) R.define(key, v.look); }); });
  // When a shift's script arrives: the merged staff and its patient stories.
  E.onCaseLoad((k) => { const m = E.caseMeta(k.id); if (m && m !== k) Object.keys(m.staff).forEach((key) => { if (!k.staff[key]) k.staff[key] = m.staff[key]; }); if (STY) STY.install(k); });
  document.addEventListener('click', onClick);
  document.addEventListener('pointerdown', startHold); document.addEventListener('pointermove', moveHold);
  document.addEventListener('pointerdown', sortDown); document.addEventListener('pointermove', sortMove);
  ['pointerup', 'pointercancel'].forEach((ev) => document.addEventListener(ev, sortUp));
  ['pointerup', 'pointercancel'].forEach((ev) => document.addEventListener(ev, cancelHold, true));
  document.addEventListener('contextmenu', (e) => { if (e.target.closest && e.target.closest('[data-hold]')) e.preventDefault(); });
  document.addEventListener('keydown', onKey); document.addEventListener('keydown', armIdle);
  document.addEventListener('input', (e) => { const b = e.target && e.target.dataset && e.target.dataset.bind; if (!b) return; const v = e.target.value; if (b === 'ngn.n' && ui.ngn) { ui.ngn.a.n = v; const bt = document.querySelector('[data-act="ngn-check"]'); if (bt) { if (NG.numOf(v) !== null) { bt.removeAttribute('aria-disabled'); bt.classList.remove('off'); } else { bt.setAttribute('aria-disabled', 'true'); } } }
    else if (b === 'note') { ui.fb = ui.fb || {}; ui.fb.note = v; } else if (b === 'rp.note' && ui.rp) ui.rp.note = v; else if (b === 'acct.email') { ui.acct = ui.acct || {}; ui.acct.email = v; return; } else if (b === 'cls.code' || b === 'cls.name') { ui.cls = ui.cls || {}; ui.cls[b.slice(4)] = v; return; } const btn = document.querySelector(b === 'note' ? '[data-act="fb-send"]' : '[data-act="rpt-send"]'); if (btn) { const ok = b === 'note' ? fbAny(ui.fb) : !!(v.trim() || (ui.rp && ui.rp.why)); if (ok) { btn.removeAttribute('aria-disabled'); btn.removeAttribute('data-why'); } else { btn.setAttribute('aria-disabled', 'true'); btn.dataset.why = b === 'note' ? 'Answer one question first.' : 'Pick what kind of problem, or describe it.'; } } });
  requestAnimationFrame(frameMon);
  if (/[?&#]health\b/.test(location.href)) setTimeout(() => { ui.ov = 'health'; render(); }, 400);
  const g = E.store.load(); if (g && !g.ended && E.caseMeta(g.caseId)) { G.s = g; G.caseId = g.caseId; E.useCase(G.caseId); }
  // A link to one shift (/play/?shift=icu-3w-1, from the landing page's shift cards) picks that shift on the home
  // screen. A shift already in progress wins: the link never throws away someone's game.
  { const want = new URLSearchParams(location.search).get('shift');
    if (want && CASES.includes(want) && !(G.s && !G.s.ended)) { G.caseId = want; E.useCase(G.caseId); ui.deep = want; TEL.track('deep_link', { case: want }); }
    if (want) { const q = new URLSearchParams(location.search); q.delete('shift'); history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash); } }
  ui.view = ui.deep ? 'shifts' : 'home'; safe('boot', () => render(true));
  if (ui.deep) { const id = ui.deep; ui.deep = null; requestAnimationFrame(() => { const b = document.querySelector(`.sc-pick[data-id="${id}"]`); if (b && b.scrollIntoView) b.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); }); }
  // A walkthrough interrupted by a reload picks up where it stopped (finishing it from Start still starts that shift).
  const wasOr = !seen('orient') && OR && orLoad();
  if (wasOr) safe('orient-resume', () => { if (!G.s && wasOr.caseId && E.caseMeta(wasOr.caseId)) G.caseId = wasOr.caseId; openOrient(wasOr.start); });
  if (CL) { CL.onChange(() => { if (ui.ov === 'account' || ui.ov === 'class' || ui.ov === 'pack' || ui.view === 'home') render(); }); CL.ready.then((ok) => { const linked = CL.linked(); if (ok) fromCloud(); if (/[?&]pack=thanks/.test(location.search)) { history.replaceState(null, '', location.pathname); if (CL.user()) { ui.packWait = 'checking'; ui.ov = 'pack'; render(); packPoll(8); } } if (linked && CL.user()) setTimeout(() => hint(document.querySelector('[data-act=account].acct-link') || document.querySelector('.top .mark') || document.body, `Signed in as ${CL.user().email}. Your progress is saved to your account.`), 300); else if (linked) { ui.ov = 'account'; render(); } }).catch(() => {}); }
  addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); ui.installEvt = e; });
  addEventListener('appinstalled', () => { ui.installEvt = null; TEL.track('app_installed', {}); });
  TEL.track('app_open', { has_save: !!(G.s && !G.s.ended), shifts_done: G.prof.runs.length, standalone: standalone() });
  // Where people stop: the last screen of an unfinished shift when the page goes away.
  addEventListener('pagehide', () => { if (G.s && !G.s.ended && ui.view !== 'home') TEL.track('shift_left', { case: G.s.caseId, game_min: Math.round(G.s.t), view: ui.view, ov: ui.ov || '', wall_min: G.s.wall0 ? Math.round((Date.now() - G.s.wall0) / 60000) : null }); TEL.flush(true); });
}
