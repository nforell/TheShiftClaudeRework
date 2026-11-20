/* The Shift — UI: The header, the home screen and the full-shift picker. */
import { careerHTML, starSvg } from './awards.js';
import { helpers } from './core.js';
import { C, CASES, CL, DIFF, DR, E, G, ICON, NG, R, RV, RW, S, SPEC, TERMS, buildTag, def, diffPips, esc, fmtN, hhmm, locked, meta, shiftFacts, specOf, ui, unitS } from './ctx.js';

/* ------------ header ------------ */
export function header() {
  const unread = G.s.inbox.filter((m) => !m.read).length;
  const loc = ui.view === 'room' ? `${unitS()} <span aria-hidden="true">/</span> <b>${G.s.loc} ${esc(def(G.s.loc).short)}</b>` : ui.view === 'handoff' ? `${unitS()} <span aria-hidden="true">/</span> <b>Shift report</b>` : `${unitS()} <span aria-hidden="true">/</span> <b>Nurses' station</b>`;
  return `<header class="top">
    <button class="mark" data-act="menu" aria-label="The Shift menu">The Shift</button>
    <div class="where">${loc}</div>
    <button class="icon-btn roster-btn" data-act="roster" aria-label="Your patients: who is who"><svg class="ico" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2c2.4 0 4.3 1.4 5 4.3"/></svg><span class="nova-l">Patients</span></button>
    ${ui.view !== 'handoff' ? `${helpers()}
    ${(() => { const m = RW.mult(G.s.streak || 0); return `<button class="xp ${m > 1 ? 'hot' : ''}" data-act="calls" aria-label="Care XP ${fmtN(G.s.xp || 0)}${m > 1 ? `, streak times ${m}` : ''}. Your shift so far">${ICON.xp}<b>${fmtN(G.s.xp || 0)}</b><b class="xp-k">${(G.s.xp || 0) >= 10000 ? ((G.s.xp || 0) / 1000).toFixed(0) + 'k' : fmtN(G.s.xp || 0)}</b>${m > 1 ? `<span class="fl">${ICON.flame}×${m}</span>` : ''}</button>`; })()}
    <button class="icon-btn" data-act="inbox" aria-label="Messages, ${unread} unread">${ICON.msg}${unread ? `<span class="badge">${unread}</span>` : ''}</button>` : ''}
    <div class="clock ${ui.adv ? 'bump' : ''}" role="timer" aria-live="off" aria-label="Shift time ${E.clock(G.s.t)}">${E.clock(G.s.t)}<small>ends ${E.clock(C().length)}</small>${ui.adv ? `<span class="adv" aria-hidden="true">+${ui.adv} min</span>` : ''}</div>
    <button class="icon-btn" data-act="menu" aria-label="Menu">${ICON.menu}</button>
    <div class="shiftbar" aria-hidden="true"><i style="width:${Math.min(100, G.s.t / C().length * 100).toFixed(1)}%"></i></div>
  </header>`;
}

/* ------------ home ------------ */
export function specHead(sp) { const x = SPEC[sp]; return `<div class="spec-h sp-${sp}"><b>${esc(x.name)}</b><span class="spec-u">${esc(x.unit)}</span><span class="spec-b">${esc(x.blurb)}</span></div>`; }
export function diffKey() { return `<span class="diff-scale" aria-hidden="true">${[1, 2, 3, 4, 5].map((d) => `<span class="dk diff d${d}"><span class="pips">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= d ? 'on' : ''}"></i>`).join('')}</span>${DIFF[d]}</span>`).join('')}</span>`; }
/* ------------ home ------------
   The front door. Keep it simple: one big Play, four skills, then the deeper modes. Everything else is in the menu. */
export const DICON = {
  med: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="11" width="22" height="10" rx="5" transform="rotate(-35 16 16)"/><path d="M12.2 10.6l7.6 10.8" /></svg>',
  first: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="9" cy="9" r="4"/><circle cx="23" cy="9" r="4"/><circle cx="9" cy="23" r="4"/><circle cx="23" cy="23" r="4" class="hi"/></svg>',
  sbar: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 4.5h4l2 6-3 2a15 15 0 0 0 7.5 7.5l2-3 6 2v4a2.5 2.5 0 0 1-2.5 2.5C14.5 25.5 6.5 17.5 6.5 7A2.5 2.5 0 0 1 9 4.5z"/></svg>',
  calm: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 13c3-4 6-4 9 0s6 4 9 0 6-4 8-1"/><path d="M3 21c3-3 6-3 9 0s6 3 9 0 6-3 8-1" class="hi"/></svg>',
  shift: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="11.5"/><path d="M16 16V8.5M16 16l5 4"/></svg>',
  ngn: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="4.5" width="20" height="23" rx="2.5"/><path d="M11 11.5l2 2 4-4M11 20h10"/></svg>',
  ref: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 5.5h14a4 4 0 0 1 4 4v17H11a4 4 0 0 1-4-4z"/><path d="M7 22.5a4 4 0 0 1 4-4h14"/></svg>',
};
export function vHome() {
  const DS = DR ? DR.summary() : null, g = E.store.load(), saved = g && !g.ended ? E.getCase(g.caseId) : null;
  const newbie = DS && !DS.rounds && !G.prof.runs.length;
  const nShifts = CASES.length, nUnits = new Set(CASES.map((id) => meta(id).sp)).size;
  const day = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
  // The front door is the unit whiteboard (the same board as the station): two assignments side by side, so a full
  // shift is as plain a choice as a quick round. Skills below are badge buddies, the cards nurses clip behind their ID.
  const badge = (x) => `<button class="h2-tile bb k-${x.color}" data-act="dr-start" data-k="${x.k}">
      <span class="bb-slot" aria-hidden="true"></span>
      <span class="bb-ic" aria-hidden="true">${DICON[x.k]}</span>
      <span class="bb-tt"><b>${esc(x.name)}</b><small>${esc(x.verb)}</small></span>
      <span class="bb-m"><span class="bb-bar" aria-hidden="true"><i style="--p:${x.all ? x.got / x.all : 0}"></i></span><small>${x.got ? `${x.got} of ${x.all} mastered` : `${x.all} cards`}</small></span></button>`;
  const more = (act, title, sub, cls) => `<button class="h2-row ${cls || ''}" data-act="${act}"><span><b>${esc(title)}</b><small>${esc(sub)}</small></span><span class="h2-chev" aria-hidden="true">›</span></button>`;
  return `<div class="home h2">
    <header class="h2-top"><span class="mark" style="cursor:default">The Shift</span><span class="sp"></span>
      ${DS && DS.streak ? `<span class="h2-streak ${DS.today ? 'lit' : ''}" title="${DS.streak} day${DS.streak === 1 ? '' : 's'} in a row">${ICON.flame}<b>${DS.streak}</b><span class="sr"> day${DS.streak === 1 ? '' : 's'} in a row${DS.today ? ', played today' : ', play today to keep it'}</span></span>` : ''}
      <button class="btn btn-quiet hn-menu" data-act="menu" aria-label="Menu: settings, how it plays and more">${ICON.menu}</button></header>
    <section class="wb" aria-labelledby="wb-h">
      <div class="wb-head"><h1 id="wb-h">${newbie ? 'Pick your assignment' : DS && DS.today ? 'Back for more?' : 'Pick your assignment'}</h1><span class="wb-date" aria-hidden="true">${esc(day)}</span></div>
      <div class="wb-cols">
        ${DS ? `<div class="wb-col wb-round">
          <span class="wb-mag" aria-hidden="true"></span>
          <h2>Quick round</h2>
          <div class="wb-faces" aria-hidden="true">${DR.cast()}</div>
          <p>Five patients, one decision each: a med, two who's-firsts, a call and a hard conversation. Every answer explained.</p>
          <p class="wb-time">About 3 minutes</p>
          <button class="btn btn-primary h2-play" data-act="dr-start" data-k="mix"><span class="h2-pi" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg></span><b>${DS.today ? 'Play another round' : newbie ? 'Play a round' : 'Play today\'s round'}</b></button>
          ${newbie ? '' : `<button class="wb-alt" data-act="dr-start" data-k="hard"><b>NCLEX-level round</b><span>Five cards drawn from ${DS.hard} where every option is plausible</span></button>`}
        </div>` : ''}
        <div class="wb-col wb-shift">
          <span class="wb-mag" aria-hidden="true"></span>
          <h2>Full shift</h2>
          <ol class="wb-tl" aria-label="What happens in a shift">
            <li><b>Report</b></li><li><b>Assess</b></li><li><b>Meds</b></li><li><b>Calls</b></li><li><b>Debrief</b></li>
          </ol>
          <p>Run a whole shift on one unit: four or five patients, things changing by the minute, then see what happened to each of them.</p>
          <p class="wb-time">${nShifts} shifts on ${nUnits} units, 15 to 25 minutes each</p>
          ${saved ? `<button class="btn h2-shift" data-act="resume"><span class="h2-pi" aria-hidden="true">${DICON.shift}</span><span class="h2-rs"><b>Resume your shift</b><small>${esc(saved.title)}, at ${hhmm(saved, g.t)}</small></span></button>
          <button class="wb-alt" data-act="shifts"><b>Choose a different shift</b></button>`
          : `<button class="btn h2-shift" data-act="shifts"><span class="h2-pi" aria-hidden="true">${DICON.shift}</span><b>Choose a shift</b></button>`}
        </div>
      </div>
      <div class="wb-tray" aria-hidden="true"><i></i><i></i><i></i></div>
    </section>
    ${DS ? `<section class="h2-sec"><h2>Practice one skill</h2><div class="h2-grid">${DS.kinds.map(badge).join('')}</div></section>` : ''}
    ${(NG && NG.bank) || S.ref ? `<section class="h2-sec"><h2>Study</h2><div class="h2-deep">
      ${NG && NG.bank ? more('practice', 'NCLEX practice', `${NG.count.cases()} case studies and ${NG.count.bank()} questions, every answer explained`, 'hn-px') : ''}
      ${S.ref ? more('ref', 'Pocket reference', 'Quick cards for the floor and the exam') : ''}
    </div></section>` : ''}
    <div class="homefoot"><span>${G.prof.runs.length ? `Shifts completed: ${G.prof.runs.length}.` : ''}${CL ? ` <button class="acct-link" data-act="account">${CL.user() ? 'Saved to your account' : 'Save your progress'}</button>` : ''}</span><span>An educational game, not clinical advice. Never use it for real patient care.${TERMS ? ' <button class="acct-link" data-act="terms">Terms</button>' : ''} <span class="buildtag">${esc(buildTag())}</span></span></div>
  </div>`;
}
/* ------------ full shifts: the shift picker ------------ */
export function vShifts() {
  E.useCase(G.caseId);
  const g = E.store.load(), c = C(), done = (id) => G.prof.runs.filter((r) => r.caseId === id);
  const start = hhmm(c, 0), initial = c.patients.filter((d) => !d.arrives), adm = c.patients.filter((d) => d.arrives);
  const cols = Math.ceil(initial.length / 2) + (adm.length ? 1 : 0) - (initial.length % 2 && adm.length ? 1 : 0);
  const saved = g && !g.ended ? E.getCase(g.caseId) : null;
  // Shift picker card: an illustrated header (the shift's sky, its start time and its real patients), the facts, and,
  // once picked, a bold ring and its own start button so choosing never depends on the hero scrolled out of view.
  const tod = (k) => { const h = Math.floor(((k.start || 420) % 1440) / 60); return h >= 21 || h < 5 ? 'night' : h >= 13 ? 'eve' : 'day'; };
  const TOD = { day: 'Day shift', eve: 'Evening shift', night: 'Night shift' };
  const rung = (id, i) => {
    const k = E.getCase(id), runs = done(id), best = runs.length ? Math.max(...runs.map((r) => r.score)) : null;
    const prev = i ? done(CASES[i - 1]).length : 1, on = id === G.caseId, lk = locked(id);
    const stn = (G.prof.stars || {})[id] || 0, tm = tod(k);
    const pts = k.patients.filter((x) => !x.arrives), shown = pts.slice(0, 3), more = k.patients.length - shown.length;
    const status = lk ? `<span class="rg-lock"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>Shift pack</span>` : best !== null ? `Best ${best}` : prev ? 'Not played' : 'Best after ' + esc(E.getCase(CASES[i - 1]).title);
    const cta = saved && g.caseId === id ? `<button class="btn btn-primary btn-go sc-go" data-act="resume">Resume at ${hhmm(saved, g.t)} <span aria-hidden="true">→</span></button>`
      : lk ? `<button class="btn btn-primary btn-go sc-go" data-act="pack">Unlock with the shift pack <span aria-hidden="true">→</span></button>`
      : `<button class="btn btn-primary btn-go sc-go" data-act="new">Start this shift <span aria-hidden="true">→</span></button>`;
    return `<article class="sc sp-${meta(id).sp} tod-${tm} ${on ? 'on' : ''} ${lk ? 'in-pack' : ''}">
      <button class="sc-pick ${lk ? 'in-pack' : ''}" data-act="pick-case" data-id="${id}" aria-pressed="${on}">
        <span class="sc-art" aria-hidden="true">
          <span class="sc-sky"></span>
          <span class="sc-time"><b>${hhmm(k, 0)}</b><small>${TOD[tm]}</small><small>to ${hhmm(k, k.length)}</small></span>
          ${on ? `<span class="sc-sel">${ICON.tick}Selected</span>` : ''}
          <span class="sc-cast">${shown.map((d) => R.still(d.id, 'sc-bust')).join('')}${more > 0 ? `<span class="sc-more">+${more}</span>` : ''}</span>
          <span class="sc-floor"></span>
        </span>
        <span class="sc-body">
          <span class="sc-unit"><span class="sc-dot"></span>${esc(specOf(id).name)} · ${esc(specOf(id).unit)}</span>
          <b class="sc-title"><span class="sr">${esc(specOf(id).name)}: </span>${esc(k.title)}</b>
          <span class="sc-card">${esc(k.card)}</span>
          <small class="rg-facts">${esc(shiftFacts(k))}</small>
          ${NG ? (() => { const nq = NG.items(id).length, nc = NG.count ? NG.count.cases(meta(id).sp) : 0; return nq || nc ? `<small class="sc-nx"><b>NCLEX</b>${nq ? `${nq} questions after the shift` : ''}${nq && nc ? ' · ' : ''}${nc ? `${nc} matching case stud${nc === 1 ? 'y' : 'ies'}` : ''}</small>` : ''; })() : ''}
          <span class="sc-foot">${diffPips(id)}<span class="sc-st"><span class="rung-st" aria-label="${stn} of 3 stars">${[0, 1, 2].map((j) => starSvg(j < stn, j, 'rs')).join('')}</span><small>${status}</small></span></span>
        </span>
      </button>
      ${on ? `<div class="sc-cta">${cta}</div>` : ''}
    </article>`;
  };
  return `<div class="home shifts">
    <header class="sh-top"><button class="btn btn-quiet sh-back" data-act="home">${ICON.back}<span>Home</span></button><span class="mark" style="cursor:default">The Shift</span><button class="btn btn-quiet hn-menu" data-act="menu" aria-label="Menu">${ICON.menu}</button></header>
    <section class="sh-intro">
      <p class="h2-k">Full shifts</p>
      <h1>Put it all together.</h1>
      <p class="lede">A whole shift on one unit: take report, decide who's first, give and hold meds, call the provider, and see what happened in the debrief. ${CASES.length} shifts, 15 to 25 minutes each.</p>
      ${saved ? `<div class="cta"><button class="btn btn-primary btn-go" data-act="resume">Resume ${esc(saved.title)} at ${hhmm(saved, g.t)} <span aria-hidden="true">→</span></button></div>` : ''}
      ${(() => { if (G.s && !G.s.ended) return ''; const L = E.store.loadLast(); if (!L) return ''; const k = E.getCase(L.caseId), d0 = E.debrief(L); return `<button class="btn btn-quiet last-deb" data-act="last-debrief">See your last debrief: ${esc(k.title)}, ${d0.overall} <span aria-hidden="true">→</span></button>`; })()}
    </section>
    <div>
      <div class="sched-top"><h2 class="sched-h">Choose a shift</h2><p class="diff-key" aria-label="Difficulty runs from 1, Orientation, to 5, Expert">Difficulty ${diffKey()}</p></div>
      <p class="sched-sub">Tap a shift to see who you'll have, then start it from its card. ${CASES.length} shifts across ${new Set(CASES.map((id) => meta(id).sp)).size} units.</p>
      <div class="ladder sc-grid" role="group" aria-label="Choose a shift">
        ${CASES.map((id, i) => rung(id, i)).join('')}
        <article class="sc sc-soon"><div class="sc-pick"><span class="sc-art" aria-hidden="true"><span class="sc-sky"></span><span class="sc-time"><b>Soon</b></span><span class="sc-floor"></span></span><span class="sc-body"><span class="sc-unit">Coming later</span><b class="sc-title">In the works</b><span class="sc-card">More shifts on every unit.</span></span></div></article>
      </div>
      ${careerHTML()}
      <div class="homefoot"><span>${G.prof.runs.length ? `Shifts completed: ${G.prof.runs.length}.` : 'No shifts completed yet.'}${CL ? ` <button class="acct-link" data-act="account">${CL.user() ? 'Saved to your account' : 'Save your progress'}</button>` : ''}</span><span>An educational game, not clinical advice. Never use it for real patient care.${TERMS ? ' <button class="acct-link" data-act="terms">Terms</button>' : ''}${RV ? ` <button class="acct-link rv-${RV.status(G.caseId).state}" data-act="review">${esc(RV.status(G.caseId).label)}</button>` : ''} <span class="buildtag">${esc(buildTag())}</span></span></div>
    </div>
  </div>`;
}
