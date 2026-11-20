/* The Shift — UI: The renderer: one redraw of the whole screen, and the per-render bookkeeping. */
import { reduced } from './actions.js';
import { vAwards } from './awards.js';
import { ovChart } from './chart.js';
import { applySettings, flushPops, goalWatch, tallyJudg } from './core.js';
import { $, A, C, CL, DR, E, FX, G, GAMEVIEW, ICON, NG, OR, R, RV, TERMS, buildTag, def, esc, gone, here, inGame, liveDef, termsOk, ui } from './ctx.js';
import { debriefAnim, vDebrief } from './debrief.js';
import { callBar, ovAway, ovCalls, ovFloor, ovGive, ovInbox, ovReview, ovRoster, ptStrip, vStation } from './floor.js';
import { ovIntro, ovRank, vHandoff } from './handoff.js';
import { header, vHome, vShifts } from './home.js';
import { ovCsres, ovNgn, ovPres, ovRef, vPractice } from './practice.js';
import { fbNow, ovCrit, ovDeleg, ovDialog, ovDoc, ovMed, ovNova, ovResult, placeBubbles, vRoom } from './room.js';
import { ovSbar } from './sbar.js';
import { coachPlace, ovAccount, ovClass, ovConfirm, ovHealth, ovHelp, ovMenu, ovPack, ovReport, ovReviewInfo, ovSettings, ovTerms, toasts } from './sheets.js';

/* ------------ render ------------ */
export const keyOf = (el) => JSON.stringify([el.dataset.act, el.dataset.id, el.dataset.pid, el.dataset.i, el.dataset.k, el.dataset.tab, el.dataset.p, el.dataset.t, el.dataset.m, el.dataset.v, el.dataset.row]);
/* A breathing tube that came out comes off the portrait too: look follows liveDef(d).vented. */
export const lookNow = {};
export function syncLooks() {
  if (!G.s) return;
  C().patients.forEach((d) => { if (!d.look || !(d.look.extras || []).includes('ett')) return; const off = liveDef(d).vented === false, k = d.id; if (!!lookNow[k] === off) return; lookNow[k] = off; R.define(k, off ? Object.assign({}, d.look, { extras: d.look.extras.filter((x) => x !== 'ett') }) : d.look); });
}
export function render(scrollTop) {
  syncLooks();
  const T0 = performance.now();
  if (inGame() && G.caseId !== G.s.caseId && E.getCase(G.s.caseId)) { G.caseId = G.s.caseId; E.useCase(G.caseId); }
  applySettings();
  const root = $('#app');
  const focusKey = document.activeElement && document.activeElement.dataset ? keyOf(document.activeElement) : null;
  const y = window.scrollY;
  if (G.s && !G.s.ended && (ui.view === 'station' || ui.view === 'room')) { if (fbNow()) tallyJudg(); goalWatch(); }
  G.RC = new Map();
  let h = '';
  if (ui.view === 'awards') h = vAwards();
  else if (ui.view === 'practice' && NG && NG.bank) h = vPractice();
  else if (ui.view === 'drill' && DR && ui.dr) h = DR.view();
  else if (ui.view === 'shifts') h = vShifts();
  else if (ui.view === 'home' || !G.s) h = vHome();
  else {
    h = (ui.view === 'debrief' ? '' : header());
    if (ui.view === 'debrief') h += `<header class="top"><button class="mark" data-act="home">The Shift</button><div class="where">Debrief <span class="buildtag">${esc(buildTag())}</span></div></header>`;
    if (ui.view === 'station' || ui.view === 'room') h += ptStrip() + callBar();
    h += ui.view === 'handoff' ? vHandoff() : ui.view === 'station' ? vStation() : ui.view === 'room' ? vRoom() : vDebrief();
    h += toasts();
    if (ui.stamp) h += `<div class="stamp" role="status" aria-live="polite">${ICON.tick}<span><b>${esc(ui.stamp.text)}</b>${ui.stamp.sub ? `<small>${esc(ui.stamp.sub)}</small>` : ''}</span></div>`;
  }
  if (!ui.ov && G.s && !G.s.ended && (ui.critQ || []).length && (ui.view === 'station' || ui.view === 'room')) { ui.crit = ui.critQ.shift(); ui.ov = 'crit'; }
  const ov = ui.ov;
  if (ov === 'chart' && G.s) h += ovChart();
  else if (ov === 'med') h += ovMed();
  else if (ov === 'sbar') h += ovSbar();
  else if (ov === 'deleg') h += ovDeleg();
  else if (ov === 'doc' && ui.doc) h += ovDoc();
  else if (ov === 'nova') h += ovNova();
  else if (ov === 'dialog') h += ovDialog();
  else if (ov === 'inbox') h += ovInbox();
  else if (ov === 'rank') h += ovRank();
  else if (ov === 'menu') h += ovMenu();
  else if (ov === 'settings') h += ovSettings();
  else if (ov === 'help') h += ovHelp();
  else if (ov === 'orient' && ui.or && OR) { OR._o = ui.or; h += OR.view(ui.or); }
  else if (ov === 'confirm') h += ovConfirm();
  else if (ov === 'result' && ui.res && G.s) h += ovResult();
  else if (ov === 'crit' && ui.crit && G.s) h += ovCrit();
  else if (ov === 'review' && ui.review && G.s) h += ovReview();
  else if (ov === 'calls' && G.s) h += ovCalls();
  else if (ov === 'roster' && G.s) h += ovRoster();
  else if (ov === 'away' && ui.away && G.s) h += ovAway();
  else if (ov === 'give' && ui.rep && G.s) h += ovGive();
  else if (ov === 'floor' && ui.fl && G.s) h += ovFloor();
  else if (ov === 'health') h += ovHealth();
  else if (ov === 'report') h += ovReport();
  else if (ov === 'ngn' && ui.ngn && NG) h += ovNgn();
  else if (ov === 'pres' && NG) h += ovPres();
  else if (ov === 'csres' && NG) h += ovCsres();
  else if (ov === 'ref') h += ovRef();
  else if (ov === 'account' && CL) h += ovAccount();
  else if (ov === 'class' && CL) h += ovClass();
  else if (ov === 'pack') h += ovPack();
  else if (ov === 'review' && RV) h += ovReviewInfo();
  else if (ov === 'terms' && TERMS) h += ovTerms(false);
  // The agreement waits for the first tap that starts something, so a new player sees the game before the legal sheet.
  if (!ov && TERMS && !termsOk() && (ui.termsAsk || ui.view === 'shifts' || ui.view === 'drill' || (!G.s && ui.view !== 'home'))) h += ovTerms(true);
  if (ui.intro !== null && ui.intro !== undefined && G.s && ui.view === 'handoff') h += ovIntro();
  if (!h || !h.trim()) { ui.view = 'home'; ui.ov = null; h = vHome(); }   // never a blank screen
  const T1 = performance.now(); G.RC = null;
  // The same overlay redrawn (an answer picked, a box ticked) must not look like it reopened: no fade-in, no
  // slide-up, and every scrolled panel stays where it was. Only a new overlay, or a new question, animates in.
  const ovSig = ui.ov ? `${ui.ov}|${ui.ov === 'ngn' && ui.ngn ? `${ui.ngn.list}:${ui.ngn.cs || ''}:${ui.ngn.i}` : ui.ov === 'sbar' && ui.sbar ? ui.sbar.pid : ui.ov === 'med' && ui.med ? ui.med.id : ui.ov === 'chart' && ui.chart ? ui.chart.pid + ':' + ui.chart.tab : ''}` : '';
  const steady = !!ovSig && ovSig === ui.lastOvSig, SCROLLERS = '.sheet-b, .chart-b, .rec-b, .or-body, .or-log, .msgs, .feed, .res, .crit';
  const kept = steady ? [...root.querySelectorAll(SCROLLERS)].map((el) => el.scrollTop) : null;
  ui.lastOvSig = ovSig;
  root.innerHTML = h;
  if (ui.ov === 'chart' && ui.lastOv === 'chart') root.querySelectorAll('.scrim, .drawer').forEach((el) => el.classList.add('steady'));
  ui.lastOv = ui.ov;
  if (steady) { root.querySelectorAll('.scrim, .sheet, .drawer').forEach((el) => el.classList.add('steady')); root.querySelectorAll(SCROLLERS).forEach((el, i) => { if (kept[i]) el.scrollTop = kept[i]; }); }
  const T2 = performance.now();
  if (ui.view !== ui.lastView) { const v = root.querySelector('.dr, main, .home'); if (v) v.classList.add('view-in'); ui.lastView = ui.view; }
  ui.hFresh = false;
  root.querySelectorAll('[disabled]').forEach((el) => { el.removeAttribute('disabled'); el.setAttribute('aria-disabled', 'true'); el.classList.add('off'); });
  if (ui.hold || ui.armed) root.querySelectorAll('[data-hold]').forEach((el) => { const k = el.dataset.hk || el.dataset.act; if (ui.hold && ui.hold.k === k) el.classList.add('holding'); if (ui.armed && ui.armed.k === k && Date.now() - ui.armed.at < 4000) el.classList.add('armed'); });
  R.setReduced(G.prof.settings.motion === 'reduced');
  R.hydrate(root);
  if (ui.view === 'room') placeBubbles(root);
  // Keep the patient you're with in view in the strip (the station stays pinned at its left edge).
  { const pin = root.querySelector('.ps-pts'), on = pin && pin.querySelector('.ps.on'); if (pin && on) { const l = on.offsetLeft - pin.offsetLeft; if (l < pin.scrollLeft || l + on.offsetWidth > pin.scrollLeft + pin.clientWidth) pin.scrollLeft = Math.max(0, l - 8); } }
  // A fresh inline result should be on screen.
  if (ui.receipt && !ui.receipt.shown && ui.view === 'room') { ui.receipt.shown = true; const rc = root.querySelector('.receipt'); if (rc) requestAnimationFrame(() => { if (!rc.isConnected) return; const r = rc.getBoundingClientRect(); if (r.top < 170 || r.top > innerHeight - 140) window.scrollTo({ top: Math.max(0, scrollY + r.top - 190), behavior: reduced() ? 'auto' : 'smooth' }); }); }
  if (ui.convoIn && ui.view === 'room') { ui.convoIn = false; const cv = root.querySelector('.convo'); if (cv) { requestAnimationFrame(() => { const rtEl = root.querySelector('.room-top'); if (!rtEl || !cv.isConnected) return; const r = cv.getBoundingClientRect(), rt = rtEl.getBoundingClientRect(); const sticky = Math.max(0, ...[...document.querySelectorAll('.top, .pstrip')].map((e) => e.getBoundingClientRect().bottom)); const dy = Math.min(rt.top - sticky - 8, r.bottom - innerHeight + 16); if (dy > 0 || rt.top < sticky) window.scrollBy({ top: dy, behavior: reduced() ? 'auto' : 'smooth' }); const f = cv.querySelector('.cv-reply, .btn'); if (f) f.focus({ preventScroll: true }); }); } }
  const T3 = performance.now();
  document.body.classList.toggle('tense', !!(G.s && !G.s.ended && ui.view !== 'home' && ui.view !== 'debrief' && isTense()));
  if (ui.view === 'room' && G.s) ui.newLogSeen = G.s.seq;
  ui.enter = false; ui.adv = null; if (G.s && ui.view === 'station') ui.msgSeen = G.s.seq;
  coachPlace(); debriefAnim(root); flushPops();
  FX.setMood(musicMood());
  if (ov === 'crit' || (ov === 'result' && ui.res && ui.res.crit)) { const k = ov === 'crit' ? (G.s.inbox.find((x) => x.id === ui.crit) || {}).pid : ui.res.pid; setTimeout(() => R.poke(k + ':bust'), 700); }
  if (ui.spot && ui.view === 'room') { const sp = ui.spot; ui.spot = null; const rt = root.querySelector('.room-top'); if (rt) { rt.classList.add('spot'); setTimeout(() => R.poke('room:' + sp), 350); setTimeout(() => rt.classList.remove('spot'), 2600); } }
  if (ui.flash) { const f = ui.flash; setTimeout(() => { if (ui.flash === f) { ui.flash = null; const rt = document.querySelector('.room-top'); if (rt) rt.classList.remove('flash-' + f); } }, 1600); }
  if (ui.stamp && !ui.stamp.shown) { ui.stamp.shown = true; const st = ui.stamp; setTimeout(() => { if (ui.stamp === st) { ui.stamp = null; const n = root.querySelector('.stamp'); if (n) { n.classList.add('out'); setTimeout(() => n.remove(), 250); } } }, 1500); }
  if (ui.justKey) { const jk = ui.justKey; ui.justKey = null; const el = [...root.querySelectorAll('[data-act]')].find((x) => keyOf(x) === jk && !x.dataset.scrim); if (el) { const tgt = el.tagName === 'INPUT' ? el.closest('.opt') || el : el; tgt.classList.add('just'); } }
  if (scrollTop) window.scrollTo(0, 0); else window.scrollTo(0, y);
  if (ui.view === 'drill' && DR) DR.after(root);
  // restore focus
  let target = null;
  if (focusKey) {
    const k = JSON.parse(focusKey);
    target = [...root.querySelectorAll('[data-act]')].find((el) => keyOf(el) === focusKey && !el.dataset.scrim);
  }
  const dlg = root.querySelector('[role="alertdialog"]') || root.querySelector('[role="dialog"]');
  if (dlg && (!target || !dlg.contains(target))) { const f = dlg.querySelector('button:not([aria-disabled="true"]),input:not([aria-disabled="true"])'); if (f) f.focus({ preventScroll: true }); }
  else if (target) target.focus({ preventScroll: true });
  perfNote(T0, T1, T2, T3, performance.now(), h.length);
}
/* Render budget: how long each redraw takes, kept for the health check (Settings, or ?health in the URL). */
export const PERF = { n: 0, slow: 0, worst: 0, last: null, avg: 0 };
export function perfNote(t0, t1, t2, t3, t4, len) {
  const tot = t4 - t0; PERF.n += 1; PERF.avg += (tot - PERF.avg) / Math.min(PERF.n, 30); PERF.worst = Math.max(PERF.worst, tot); if (tot > 50) { PERF.slow += 1; PERF.slowLog = (PERF.slowLog || []).concat({ ms: Math.round(tot), build: +(t1 - t0).toFixed(0), dom: +(t2 - t1).toFixed(0), hyd: +(t3 - t2).toFixed(0), after: +(t4 - t3).toFixed(0), v: ui.view + (ui.ov ? '/' + ui.ov : '') }).slice(-40); }
  PERF.last = { build: +(t1 - t0).toFixed(1), dom: +(t2 - t1).toFixed(1), hydrate: +(t3 - t2).toFixed(1), after: +(t4 - t3).toFixed(1), total: +tot.toFixed(1), kb: Math.round(len / 1024), view: ui.view, ov: ui.ov };
}
/* What the score should feel like right now: the scene, how many patients are in danger, day or night. */
export function musicMood() {
  if (ui.view === 'drill' && DR && ui.dr) return DR.mood();
  if (!G.s || !GAMEVIEW[ui.view]) return { scene: 'home', tension: 0, night: false };
  if (ui.view === 'debrief' || G.s.ended) return { scene: 'debrief', tension: 0, night: false };
  const Ax = A(); let t = 0;
  C().patients.forEach((d) => { if (!here(d)) return; const P = G.s.p[d.id]; if (gone(P)) return; const st = d.status(G.s, P, Ax); t += st === 'urgent' ? .5 : st === 'watch' ? .08 : 0; });
  if (ui.ov === 'crit' || (ui.res && ui.res.crit === 'worse')) t = Math.max(t, 1);
  const a = ((C().start || 420) + G.s.t) % 1440;
  return { scene: 'play', tension: Math.min(1, t), night: a >= 1260 || a < 300 };
}
export function isTense() {
  const Ax = A();
  const urgentMsg = G.s.inbox.some((m) => m.urgent && G.s.t - m.t <= 20);
  const here = ui.view === 'room' && def(G.s.loc).status(G.s, G.s.p[G.s.loc], Ax) === 'urgent';
  return urgentMsg || here;
}
