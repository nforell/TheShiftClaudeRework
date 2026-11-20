/* The Shift — UI: Game flow: starting and resuming a shift, spending time, care XP, the aide, first-run flags. */
import { hint, reduced } from './actions.js';
import { A, AIDE_DUE, AIDE_ROUTINE, C, CASES, CJ, CL, E, FM, FX, G, OR, ORK, R, RW, TEL, cna, cnaAway, def, esc, face, gone, here, locked, orLoad, orSave, ui } from './ctx.js';
import { dueList, prioList, stuckCheck } from './floor.js';
import { render } from './render.js';
import { GHOST_MS, openSnap } from './room.js';

try { document.documentElement.classList.toggle('hov', !window.matchMedia || window.matchMedia('(hover: hover)').matches); } catch (e) { document.documentElement.classList.add('hov'); }
// Focus rings follow the input: a key that moves focus turns them on (html.kbd), a pointer or touch turns them off.
// Focus is restored after every redraw, so without this a tapped button (the menu, a reply) keeps a stray outline.
addEventListener('keydown', (e) => { if (/^(Tab|Arrow|Enter$| $|Escape$|Home$|End$|Page)/.test(e.key) && !e.metaKey && !e.ctrlKey) document.documentElement.classList.add('kbd'); }, true);
addEventListener('pointerdown', () => document.documentElement.classList.remove('kbd'), true);
export function frameMon(ts) {
  if (!document.hidden && FM.last) { const d = ts - FM.last; if (d < 1000) FM.dts.push(d); }
  FM.last = ts;
  if (FM.dts.length >= 90) {
    const a = FM.dts.slice().sort((x, y) => x - y), med = a[a.length >> 1]; FM.fps = Math.round(1000 / med); FM.dts = [];
    FM.bad = med > 34 ? FM.bad + 1 : 0;
    if (FM.bad >= 2 && !FM.lite && (G.prof.settings.gfx || 'auto') === 'auto') { FM.lite = true; applySettings(); const n = document.querySelector('.top .mark') || document.body; hint(n, 'Switched to lighter graphics to keep things smooth. Change it in Settings.'); }
  }
  requestAnimationFrame(frameMon);
}
export function applySettings() {
  const r = document.documentElement, st = G.prof.settings;
  if (st.theme === 'system') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', st.theme);
  r.setAttribute('data-text', st.text); r.setAttribute('data-motion', st.motion);
  const lite = st.gfx === 'lite' || ((st.gfx || 'auto') === 'auto' && FM.lite);
  if (lite) r.setAttribute('data-lite', ''); else r.removeAttribute('data-lite');
  if (R && R.setPower) R.setPower(lite ? 'lite' : 'full');
  FX.setOn(st.sound !== 'off'); FX.setMusic(st.music !== 'off');
}

/* ------------ game flow ------------ */
export function save() { if (G.s && !G.s.ended) E.store.save(G.s); }
/* Orientation: offered automatically to a brand-new player the first time they start a shift; always available
   from How it plays. Finishing it from Start goes straight into that shift. */
export const firstTimer = () => !seen('orient') && !(G.prof.runs || []).length && !Object.keys(G.prof.seen || {}).length;
export function openOrient(start) {
  if (!OR) return start ? startNew() : (ui.ov = 'help', render());
  const was = orLoad();
  ui.or = was && was.start === !!start ? Object.assign(OR.fresh(start), was) : OR.fresh(start); delete ui.or.caseId;
  OR._o = ui.or; ui.ov = 'orient'; orSave(); TEL.track('orient_open', { from: start ? 'start' : 'help', resumed: !!(was && ui.or.i) }); render(true);
}
export function closeOrient(finished) {
  // Finishing the walkthrough already taught the station and the room; don't repeat it as a second tour on top of
  // the first real shift. Skipping it keeps the tours as the fallback.
  const o = ui.or; markSeen('orient'); if (finished) { markSeen('coach:station'); markSeen('coach:room'); } try { localStorage.removeItem(ORK); } catch (e) { /* storage off */ } TEL.track(finished ? 'orient_done' : 'orient_skip', { step: o ? o.i : 0 });
  ui.or = null; ui.ov = null;
  if (o && o.start) return startNew();
  render(true);
}
export function startNew() { if (locked(G.caseId)) { ui.ov = 'pack'; TEL.track('pack_view', { case: G.caseId, from: 'start' }); return render(); } G.s = E.newGame(G.caseId); G.s.wall0 = Date.now(); TEL.track('shift_start', { case: G.caseId, attempt: ((G.prof.done || {})[G.caseId] || 0) + 1, shifts_done: G.prof.runs.length }); ui.view = 'handoff'; ui.hFresh = true; ui.intro = C().intro && !seen('intro:' + G.caseId) ? 0 : null; ui.hIdx = 0; ui.rank = null; ui.rankDone = false; ui.ov = null; ui.toasts = []; ui.caption = null; save(); render(true); }
export function resume() { const g = E.store.load(); if (!g) return startNew(); G.s = g; G.caseId = g.caseId; E.useCase(G.caseId); TEL.track('shift_resume', { case: G.caseId, game_min: Math.round(G.s.t), view: G.s.view || 'station' }); ui.view = G.s.view || 'station'; ui.ov = null; render(true); }
export function goView(v) { ui.view = v; G.s.view = v; ui.caption = null; save(); render(true); }

/* Spend time; collect new messages into toasts; end shift if the clock runs out. */
export function spend(mins, fn, until) {
  const track = G.s && !G.s.ended && (ui.view === 'station' || ui.view === 'room');
  const before = track ? openSnap() : null, pendingDeleg = G.s.deleg.filter((x) => !x.done).map((x) => x), t0 = G.s.t;
  const why = E.perform(G.s, mins, fn, until);
  if (track) {
    pendingDeleg.filter((x) => x.done && !x.dropped).forEach((x) => { const tk = C().delegation.tasks.find((k) => k.id === x.id); A().log(x.pid, `${cna().name} finished: ${tk.label.toLowerCase()}.`, 'act'); G.s.log[G.s.log.length - 1].label = `${cna().name}: ${tk.label.toLowerCase()}`; });
    const after = G.s.ended ? {} : openSnap(), nowMs = Date.now();
    Object.keys(before).forEach((k) => {
      const r = before[k], a = after[k], P = G.s.p[r.pid];
      if (gone(P) && !r.key.startsWith('aw:')) return;
      const doneNow = r.prog ? !a : r.key.startsWith('x:') ? (a ? a.t - r.t >= 30 : ui.actPid === r.pid) : !a;
      if (doneNow && !ui.actPid && !ui.chimeQ) { ui.chimeQ = true; setTimeout(() => { ui.chimeQ = false; FX.play('check'); }, 250); }
      if (doneNow) ui.ghosts.push({ pid: r.pid, text: ((x) => x.charAt(0).toUpperCase() + x.slice(1))(r.text.replace(new RegExp('^' + cna().name + ': '), '')), by: r.prog ? cna().name : 'you', born: nowMs, held: false, id: k + nowMs });
      if (doneNow) earnTask(r);
    });
    // Something slipped past its time while you were busy: the streak ends.
    const slipped = Object.keys(after).filter((k) => after[k].late && !(before[k] && before[k].late) && !after[k].prog);
    if (slipped.length) breakStreak('Overdue: ' + after[slipped[0]].text.toLowerCase());
    ui.ghosts = ui.ghosts.filter((g) => g.held || nowMs - g.born < GHOST_MS);
  }
  if (G.s.t > t0) ui.adv = G.s.t - t0;
  if (track && G.s.t > t0) stuckCheck();
  const fresh = G.s.fresh.splice(0);
  const isCrit = (m) => m && m.urgent && m.pid && def(m.pid);
  if (fresh.length) { const ms = fresh.map((id) => G.s.inbox.find((x) => x.id === id)); const crit = ms.some(isCrit), urgent = ms.some((m) => m && m.urgent); setTimeout(() => FX.play(crit ? 'crit' : urgent ? 'urgent' : 'msg'), crit ? 120 : 420); }
  fresh.forEach((id) => {
    const m = G.s.inbox.find((x) => x.id === id); if (!m) return;
    if (isCrit(m)) { ui.critQ = (ui.critQ || []).concat(m.id); return; }   // a critical event gets the whole screen, not a toast
    ui.toasts.push(m.id);
    // Routine messages step aside after a few seconds (they stay in the phone); urgent ones wait for the player.
  });
  // One banner at a time, but a message still waiting for an answer (a call light, a question) isn't pushed out by
  // routine news: it stays until answered or dismissed, and the newest answer-needed one wins.
  { const ask = (id) => { const m = G.s.inbox.find((x) => x.id === id); return m && (m.urgent || (m.replies && !m.done)); }; ui.toasts = ui.toasts.filter((id) => { const m = G.s.inbox.find((x) => x.id === id); return m && !(m.replies && m.done && !m.urgent); }); const keep = ui.toasts.filter(ask); ui.toasts = keep.length ? keep.slice(-1) : ui.toasts.slice(-1); }
  if (G.s.ended) { endShift(); return why; }
  save();
  return why;
}
export function logHere(pid, text, kind) { A().log(pid, text, kind); ui.newLog = G.s.seq; if (kind !== 'clue') ui.lastFind = G.s.seq; }

/* ------------ care XP: finished work and good calls pay; a run of them multiplies the pay ------------ */
ui.pops = [];
export function gain(n, label, cls) { G.s.xp = (G.s.xp || 0) + n; ui.pops.push({ text: '+' + n, label, cls: cls || '' }); }
export function bump() {
  const pm = RW.mult(G.s.streak || 0); G.s.streak = (G.s.streak || 0) + 1; G.s.bestStreak = Math.max(G.s.bestStreak || 0, G.s.streak);
  const m = RW.mult(G.s.streak); if (m > pm) { ui.pops.push({ text: '×' + m, label: `${G.s.streak} in a row`, cls: 'combo' }); ui.combo = true; }
}
export function breakStreak(why) { if ((G.s.streak || 0) >= 3) ui.pops.push({ text: 'Streak over', label: why, cls: 'lost' }); G.s.streak = 0; }
export function earnTask(r) {
  if (r.prog) { gain(10, `${cna().name} finished`, 'cna'); return; }
  if (r.late) { gain(5, 'Done, but late', 'late'); return; }
  const n = RW.round5(20 * RW.mult(G.s.streak || 0)); gain(n, 'On time'); bump();
}
// Judgments pay out when they land, or at the debrief if feedback waits until then.
export function tallyJudg(quiet) {
  const L = G.s.judg; let i = G.s.xpSeen || 0;
  for (; i < L.length; i++) {
    const j = L[i];
    if (j.delta > 0) { const n = RW.round5(60 * j.delta * RW.mult(G.s.streak || 0)); G.s.xp = (G.s.xp || 0) + n; if (!quiet) ui.pops.push({ text: '+' + n, label: /^floor-/.test(j.key || '') ? 'Floor call' : 'Good call', cls: 'good' }); bump(); }
    else if (j.delta < 0) { if (quiet) G.s.streak = 0; else breakStreak('A call to rethink'); }
  }
  G.s.xpSeen = i;
}
// Goals flip as the shift goes: a little ceremony when one lands or slips away.
export function goalWatch() {
  const g = RW.goals(G.s, C(), A()); G.s.goalSeen = G.s.goalSeen || {};
  g.forEach((x) => { const was = G.s.goalSeen[x.id]; if (x.st !== 'open' && was !== x.st && !G.s.ended) { ui.pops.push(x.st === 'done' ? { text: 'Goal met', label: x.label, cls: 'goal' } : { text: 'Goal missed', label: x.label, cls: 'lost' }); if (x.st === 'done') ui.goalSound = true; } G.s.goalSeen[x.id] = x.st; });
}
/* Floating rewards, drawn outside the app so a re-render doesn't cut them off. */
export function flushPops() {
  const P = ui.pops.splice(0); if (!P.length) return;
  const pill = document.querySelector('.xp'); if (!pill || reduced()) return;
  const r = pill.getBoundingClientRect();
  P.slice(-4).forEach((p, i) => setTimeout(() => {
    const n = document.createElement('div'); n.className = 'xpop ' + p.cls; n.innerHTML = `<b>${esc(p.text)}</b>${p.label ? `<small>${esc(p.label)}</small>` : ''}`;
    n.style.left = Math.min(innerWidth - 150, Math.max(8, r.left + r.width / 2 - 60)) + 'px'; n.style.top = r.bottom + 6 + 'px';
    document.body.appendChild(n); setTimeout(() => n.remove(), 1700);
    const pl = document.querySelector('.xp'); if (pl) { pl.classList.remove('bump'); void pl.offsetWidth; pl.classList.add('bump'); }
  }, i * 260));
  if (ui.combo) { ui.combo = false; setTimeout(() => FX.play('combo'), 200); }
  if (ui.goalSound) { ui.goalSound = false; setTimeout(() => FX.play('star'), 350); }
  if (ui.bondSound) { ui.bondSound = false; setTimeout(() => FX.play('star'), 250); }
}

export function endShift() {
  if (G.s.reward) { ui.view = 'debrief'; G.s.view = 'debrief'; ui.ov = null; render(true); return; }   // already settled
  E.finish(G.s); tallyJudg(true); const d = E.debrief(G.s);
  G.s.reward = RW.settle(G.s, C(), A(), d, G.prof, CASES);
  G.prof.xp = G.s.reward.after; G.prof.stars = G.s.reward.starsAfter; G.prof.badges = G.prof.badges || {}; G.s.reward.earned.forEach((b) => { G.prof.badges[b] = Date.now(); });
  G.prof.done = G.prof.done || {}; G.prof.done[G.s.caseId] = (G.prof.done[G.s.caseId] || 0) + 1;
  G.prof.best = G.prof.best || {}; G.prof.best[G.s.caseId] = Math.max(G.prof.best[G.s.caseId] || 0, d.overall);
  const L = RW.record(G.prof, G.s, C(), d), R0 = G.s.reward; G.s.reward.learn = L;
  if (L.fixed.length) R0.lines.push({ k: `Lessons fixed, ${L.fixed.length}`, v: L.fixed.length * 60 });
  L.ups.forEach((u) => R0.lines.push({ k: `${RW.TRACKS.find((x) => x.id === u.id).label}: ${RW.TIER[u.tier]}`, v: u.tier * 100 }));
  R0.earned = R0.earned.concat(L.badges);
  if (L.xp) { R0.total += L.xp; R0.after += L.xp; R0.lvAfter = RW.level(R0.after); G.prof.xp = R0.after; }
  G.prof.runs.unshift({ at: Date.now(), score: d.overall, rating: d.rating, caseId: G.s.caseId });
  TEL.track('shift_complete', { case: G.s.caseId, score: d.overall, rating: d.rating, stars: G.s.reward.stars, ended_early: G.s.t < C().length - 30, game_min: Math.round(G.s.t), wall_min: G.s.wall0 ? Math.round((Date.now() - G.s.wall0) / 60000) : null, good_calls: d.judg.filter((j) => j.delta > 0).length, misses: d.judg.filter((j) => j.delta < 0).length, poor_outcomes: d.outcomes.filter((o) => o.tone === 'bad').length, hints_used: (C().novaCredits || 3) - G.s.nova, attempt: G.prof.done[G.s.caseId] });
  if (CL) CL.recordRun({ case_id: G.s.caseId, score: d.overall, stars: G.s.reward.stars, minutes: G.s.t,
    domains: d.dom.filter((x) => x.score !== null).map((x) => ({ id: x.id, score: x.score })),
    steps: CJ.score(d.judg).filter((x) => x.score !== null).map((x) => ({ id: x.id, score: x.score })),
    misses: d.judg.filter((j) => j.delta < 0).map((j) => ({ key: j.key, text: j.text, step: CJ.step(j), pid: j.pid || null })),
    outcomes: d.outcomes.map((o) => ({ id: o.id, tone: o.tone })) });
  G.prof.runs = G.prof.runs.slice(0, 20); E.store.saveProfile(G.prof); E.store.clear(); E.store.saveLast(G.s);
  ui.view = 'debrief'; G.s.view = 'debrief'; ui.ov = null; ui.chart = null; ui.toasts = []; ui.debDone = false; ui.filter = 'all'; ui.dtab = 'shift'; ui.byCj = false; ui.reflected = false; ui.fb = {}; render(true);
}

/* Your helpers, always one tap away: Nova (tips) and the aide (delegation). Faces, so they read as people. */
export function helpers() {
  const busy = G.s.deleg.filter((x) => !x.done).length, sug = aideSuggest().length;
  return `<span class="helpers" role="group" aria-label="Your team">
    <button class="hb" data-act="nova" aria-label="Ask Nova, your charge nurse, for a tip. ${G.s.nova} tip${G.s.nova === 1 ? '' : 's'} left"><span class="hb-f">${face('nova')}<i class="hb-n">${G.s.nova}</i></span><span class="hb-t"><b>Ask Nova</b><small>${G.s.nova ? `Tips · ${G.s.nova} left` : 'No tips left'}</small></span></button>
    <button class="hb" data-act="delegate" aria-label="${cnaAway() ? `${esc(cna().name)}: ${esc(cnaAway())}` : `Ask ${esc(cna().name)}, your ${esc(cna().role)}.`} ${busy ? `${busy} task${busy === 1 ? '' : 's'} in progress` : 'Free'}${sug ? `, ${sug} suggestion${sug === 1 ? '' : 's'}` : ''}"><span class="hb-f">${face(C().cna)}<i class="hb-n ${busy ? 'busy' : 'free'}">${busy || ''}</i></span><span class="hb-t"><b>${cnaAway() ? esc(cna().name) : `Ask ${esc(cna().name)}`}</b><small>${cnaAway() ? esc(cnaAway()) : busy ? `Busy · ${busy} task${busy === 1 ? '' : 's'}` : sug ? `Free · ${sug} idea${sug === 1 ? '' : 's'}` : 'Free'}</small></span></button>
  </span>`;
}
export function aideSuggest() {
  if (cnaAway()) return [];
  if (!G.s || G.s.ended || !C().delegation) return [];
  const key = [G.s.caseId, G.s.t, G.s.deleg.length, G.s.judg.length, G.s.seq, (G.s.prio || []).join()].join('|');
  if (G.aideCache && G.aideCache.key === key) return G.aideCache.out;
  const tasks = C().delegation.tasks.filter((t) => !t.avail || t.avail(G.s));
  const busy = (id, pid) => G.s.deleg.some((x) => !x.done && x.id === id && x.pid === pid);
  const ok = (t, pid) => t.rooms.includes(pid) && here(def(pid)) && !gone(G.s.p[pid]) && !busy(t.id, pid);
  const cand = [], seen = new Set(), add = (t, pid, why, rank) => { const k = t.id + ':' + pid; if (seen.has(k) || !ok(t, pid)) return; seen.add(k); cand.push({ t, pid, why, rank }); };
  // 1. Due soon, and the aide's to do.
  dueList().filter((x) => x.pid && x.t <= G.s.t + 60 && !x.text.startsWith(cna().name + ':')).forEach((x) => tasks.forEach((t) => { if (AIDE_DUE[t.id] && AIDE_DUE[t.id].test(x.text)) add(t, x.pid, `${x.late ? 'Overdue' : 'Due'} ${E.clock(x.t)}`, x.t); }));
  // 2. The vitals round: an hour into the shift, then every four hours. Lower-priority patients first: you see your sickest yourself.
  const vt = tasks.find((t) => t.id === 'vitals');
  if (vt) {
    const round = 60 + Math.max(0, Math.ceil((G.s.t - 60 - 45) / 240)) * 240;
    if (G.s.t >= round - 45 && round < C().length) {
      const order = prioList().slice().reverse();
      order.forEach((pid, i) => { const v = A().lastVitals(pid); if (!v || v.t < round - 60) add(vt, pid, `Vitals round, ${E.clock(round)}`, round + i); });
    }
  }
  // 3. Routine care.
  tasks.filter((t) => AIDE_ROUTINE[t.id]).forEach((t) => t.rooms.forEach((pid, i) => {
    const last = G.s.deleg.filter((d) => d.id === t.id && d.pid === pid).map((d) => d.at).pop();
    if (t.id === 'turn' && last !== undefined && G.s.t - last < 110) return;
    if (t.id !== 'turn' && last !== undefined) return;
    add(t, pid, AIDE_ROUTINE[t.id], (t.id === 'bath' ? 10000 : 5000) + i);
  }));
  // Try each on a copy of the shift; drop what would be scored as a mistake.
  const tryIt = (c) => {
    try {
      const cl = JSON.parse(JSON.stringify(G.s)); cl.deleg = cl.deleg.filter((x) => x.done); const j0 = cl.judg.length;
      C().delegation.start(c.t, c.pid, cl, E.api(cl));
      return !cl.judg.slice(j0).some((j) => j.delta < 0);
    } catch (e) { return false; }
  };
  const out = [], per = {};
  for (const c of cand.sort((a, b) => a.rank - b.rank)) {
    if (out.length >= 3) break;
    if ((per[c.t.id] || 0) >= 2 || !tryIt(c)) continue;
    per[c.t.id] = (per[c.t.id] || 0) + 1; out.push(c);
  }
  G.aideCache = { key, out };
  return out;
}

/* ------------ first-run: seen flags ------------ */
export function seen(k) { return !!(G.prof.seen && G.prof.seen[k]); }
export function markSeen(k) { G.prof.seen = G.prof.seen || {}; G.prof.seen[k] = 1; E.store.saveProfile(G.prof); }
