/* The Shift — UI: Stars, XP, the career ladder, badges and achievements. */
import { CASES, E, FL, G, ICON, RW, diffLabel, esc, fmtN, specOf, ui } from './ctx.js';
import { goalsHTML } from './floor.js';
import { DOM } from './room.js';

/* ------------ rewards: stars, XP, the career ladder, badges ------------ */
export const GLYPH = {
  badge: '<path d="M12 3.2l2.3 1.7 2.8-.2.9 2.7 2.3 1.7-.9 2.7.9 2.7-2.3 1.7-.9 2.7-2.8-.2L12 20.4l-2.3-1.7-2.8.2-.9-2.7-2.3-1.7.9-2.7-.9-2.7 2.3-1.7.9-2.7 2.8.2z"/><path d="M9.2 12.2l2 2 3.8-4.2"/>',
  star: '<path d="M12 3.6l2.5 5.2 5.7.7-4.2 3.9 1.1 5.7L12 16.3l-5.1 2.8 1.1-5.7-4.2-3.9 5.7-.7z"/>',
  check: '<circle cx="12" cy="12" r="8.2"/><path d="M8 12.4l2.8 2.8 5.3-5.8"/>',
  flame: '<path d="M12 3c1 3.3 5 5.2 5 9.9a5 5 0 0 1-10 0c0-2.4 1.4-3.7 2.4-4.9.3 1.5 1 2.5 2 3 .1-2.9-1-5.3.6-8z"/>',
  eye: '<path d="M2.8 12s3.4-5.8 9.2-5.8 9.2 5.8 9.2 5.8-3.4 5.8-9.2 5.8S2.8 12 2.8 12z"/><circle cx="12" cy="12" r="2.7"/>',
  heart: '<path d="M12 19.6s-7-4.4-7-9.8a4 4 0 0 1 7-2.6 4 4 0 0 1 7 2.6c0 5.4-7 9.8-7 9.8z"/><path d="M5.6 12h3l1.4-2.4 2 4.6 1.5-2.2h4.8"/>',
  solo: '<circle cx="12" cy="8" r="3.4"/><path d="M5.5 19.5c.8-3.8 3.4-5.8 6.5-5.8s5.7 2 6.5 5.8"/>',
  bell: '<path d="M6.5 15.8V11a5.5 5.5 0 0 1 11 0v4.8l1.6 2H4.9z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  map: '<path d="M12 20.8s-5.8-5.4-5.8-10.6a5.8 5.8 0 0 1 11.6 0c0 5.2-5.8 10.6-5.8 10.6z"/><circle cx="12" cy="10.2" r="2.3"/>',
  crown: '<path d="M4.5 17l-1.3-8.6 4.9 3.7L12 5.3l3.9 6.8 4.9-3.7-1.3 8.6z"/><path d="M4.8 20h14.4"/>',
  home: '<path d="M4 11.2L12 4.5l8 6.7"/><path d="M6.3 9.6V19h11.4V9.6"/><path d="M10.3 19v-4.6h3.4V19"/>',
  shield: '<path d="M12 3.5l7 2.8v5.2c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6.3z"/><path d="M9 12l2.2 2.2L15.3 10"/>',
  up: '<path d="M4 18l5.5-5.5 3.5 3.5L20 9"/><path d="M14.5 9H20v5.5"/>',
  redo: '<path d="M18.5 8.5A7 7 0 1 0 19 14"/><path d="M19 4v4.8h-4.8"/>',
  chat: '<path d="M4.5 6.5h15v9h-8l-4 3.5v-3.5h-3z"/><path d="M12 13.2s-2.8-1.6-2.8-3.3a1.5 1.5 0 0 1 2.8-.8 1.5 1.5 0 0 1 2.8.8c0 1.7-2.8 3.3-2.8 3.3z"/>',
  book: '<path d="M4.5 5.5c2.6-.8 5.1-.5 7.5 1 2.4-1.5 4.9-1.8 7.5-1v12.6c-2.6-.8-5.1-.5-7.5 1-2.4-1.5-4.9-1.8-7.5-1z"/><path d="M12 6.5v12.6"/>',
};
export function badgeHTML(id, locked, tag) {
  const b = RW.BADGES.find((x) => x.id === id);
  return `<${tag || 'button'} class="bdg ${locked ? 'lock' : ''} g-${b.g}" ${tag ? '' : `data-act="badge" data-id="${b.id}"`} aria-label="${esc(b.label)}${locked ? ', locked' : ''}: ${esc(b.how)}"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" class="bd-rim"/><circle cx="24" cy="24" r="16.5" class="bd-in"/><g transform="translate(12 12)" class="bd-g">${GLYPH[b.g]}</g></svg><small>${esc(b.label)}</small></${tag || 'button'}>`;
}
export const starSvg = (on, i, cls) => `<svg class="${cls || 'st'} ${on ? 'on' : ''}" style="--i:${i}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>`;
export function lvHTML(lv, xp, from, up) {
  return `<div class="rw-lv"><span class="lv-n" aria-hidden="true">${lv.n}</span><div class="lv-b"><b>${esc(lv.title)}${up ? ' <em class="lvup">Level up</em>' : ''}</b><div class="lv-bar" aria-hidden="true"><i style="--from:${(from * 100).toFixed(1)}%;--to:${(lv.pct * 100).toFixed(1)}%"></i></div><small>Level ${lv.n}, ${fmtN(xp)} XP.${lv.hi ? ` ${fmtN(lv.hi - xp)} more to ${esc(lv.next)}.` : ' Top of the ladder.'}</small></div></div>`;
}
export function rewardHTML() {
  const r = G.s.reward; if (!r) return '';
  const up = r.lvAfter.n > r.lvBefore.n, from = up ? 0 : r.lvBefore.pct;
  const nextStar = r.stars < 3 ? `${RW.STARS[r.stars]} for ${r.stars ? 'the next' : 'a'} star` : 'Three stars';
  return `<section class="reward ${ui.debDone ? 'shown' : 'play'}" aria-label="Rewards">
    <div class="rw-stars" aria-label="${r.stars} of 3 stars">${[0, 1, 2].map((i) => starSvg(i < r.stars, i)).join('')}<small>${esc(nextStar)}${r.prevStars > r.stars ? `. Your best is ${r.prevStars}` : r.stars > r.prevStars && r.prevStars ? '. New best' : ''}</small></div>
    <div class="rw-mid"><h3>Shift goals</h3>${goalsHTML(r.goals, 'wide')}</div>
    <div class="rw-xp"><ul><li class="tot" style="--i:0"><span>This shift</span><b>+${fmtN(r.total)} XP</b></li></ul><details class="rw-more"><summary>Where it came from</summary><ul>${r.lines.map((l) => `<li><span>${esc(l.k)}</span><b>+${fmtN(l.v)}</b></li>`).join('')}</ul></details>
      ${lvHTML(r.lvAfter, r.after, from, up)}</div>
    ${r.earned.length ? `<div class="rw-badges"><h3>New badge${r.earned.length > 1 ? 's' : ''}</h3><div>${r.earned.map((b) => badgeHTML(b, false, 'span')).join('')}</div></div>` : ''}
  </section>`;
}
export function careerHTML() {
  const xp = G.prof.xp || 0, lv = RW.level(xp), have = G.prof.badges || {}, n = Object.keys(have).length;
  const les = Object.values(G.prof.lessons || {}), open = les.filter((l) => !l.fixed).length, fixed = les.length - open;
  return `<section class="career" aria-label="Your progress">${lvHTML(lv, xp, 0, false)}<div class="cr-links">${les.length ? `<button class="cr-les" data-act="awards" data-k="lessons">${open} open lesson${open === 1 ? '' : 's'}, ${fixed} fixed</button>` : ''}<button class="cr-les" data-act="awards">Badges: ${n} of ${RW.BADGES.length}</button></div></section>`;
}

/* ------------ achievements: tracks, milestones, units, the lesson log, the floor-call collection ------------ */
export const MEDAL = ['none', 'bronze', 'silver', 'gold'];
export function medalHTML(tier, g) { return `<svg class="medal m-${MEDAL[tier]}" viewBox="0 0 48 48" aria-hidden="true"><path d="M15 3h7l2 9-6 2zM33 3h-7l-2 9 6 2z" class="md-rib"/><circle cx="24" cy="29" r="15" class="md-rim"/><circle cx="24" cy="29" r="11" class="md-in"/><g transform="translate(12 17)" class="md-g">${GLYPH[g] || GLYPH.star}</g></svg>`; }
export const TRACKG = { safety: 'shield', priority: 'up', assess: 'eye', meds: 'check', deleg: 'solo', comm: 'bell', judgment: 'heart', time: 'flame', lessons: 'book', stories: 'chat', floor: 'badge', shifts: 'map', stars: 'star' };
export const caseTitle = (id) => { const k = E.caseMeta(id); return k ? `${k.title} (${specOf(id).name})` : 'Floor calls'; };
export const ago = (ms) => { const d = Math.round((Date.now() - ms) / 86400000); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`; };
export function trackRow(tr) {
  const v = tr.val(G.prof), tier = RW.tierOf(tr, v), next = tr.tiers[tier], lo = tier ? tr.tiers[tier - 1] : 0, pct = next ? Math.min(1, (v - lo) / (next - lo)) : 1;
  return `<li class="trk t-${MEDAL[tier]}">${medalHTML(tier, TRACKG[tr.dom || tr.id])}<div class="trk-b"><b>${esc(tr.label)}<span class="trk-t">${RW.TIER[tier]}</span></b><small>${esc(tr.how)}</small><div class="trk-bar" aria-hidden="true"><i style="width:${(pct * 100).toFixed(0)}%"></i></div><small class="trk-n">${v}${next ? ` of ${next} for ${RW.TIER[tier + 1].toLowerCase()}` : ' · maxed'}</small></div></li>`;
}
export function lessonsHTML(filter) {
  const L = Object.entries(G.prof.lessons || {}).map(([k, l]) => Object.assign({ k }, l));
  const list = L.filter((l) => (filter === 'fixed' ? l.fixed : !l.fixed)).sort((a, b) => (b.last || b.first) - (a.last || a.first));
  if (!L.length) return '<p class="empty">No lessons yet. Finish a shift: every call to rethink lands here, and it\'s marked fixed when you replay that shift and don\'t repeat it.</p>';
  const groups = {}; list.forEach((l) => { const g = l.caseId || 'floor'; (groups[g] = groups[g] || []).push(l); });
  const order = CASES.concat('floor').filter((g) => groups[g]);
  return (order.length ? order.map((g) => `<div class="les-g"><h4>${esc(g === 'floor' ? 'Floor calls' : caseTitle(g))}${g !== 'floor' && filter !== 'fixed' ? `<button class="btn btn-quiet les-play" data-act="pick-case" data-id="${g}">Replay to fix ›</button>` : ''}</h4><ul class="les">${groups[g].map((l) => `<li class="${l.fixed ? 'fixed' : ''}"><details><summary><span class="les-ic" aria-hidden="true">${l.fixed ? '✓' : '!'}</span><span class="les-t"><b>${esc(l.text)}</b><small>${esc((DOM[l.dom] || '') + (l.pid ? ' · ' + l.pid : ''))} · ${l.fixed ? `fixed ${ago(l.fixed)}` : l.times > 1 ? `happened ${l.times} times` : `first seen ${ago(l.first)}`}</small></span></summary><p>${esc(l.why)}</p></details></li>`).join('')}</ul></div>`).join('') : `<p class="empty">${filter === 'fixed' ? 'Nothing fixed yet. Replay a shift and avoid a mistake you made before.' : 'No open lessons. Every mistake you\'ve made, you\'ve fixed.'}</p>`);
}
export function floorHTML() {
  const seen = G.prof.floorSeen || {}, P = FL.POOL, KIND = { med: 'Med-surg', psych: 'Psych', peds: 'Peds', ob: 'Maternity and L&D', ed: 'Emergency', icu: 'ICU', sd: 'Step-down', ld: 'Labor and delivery' };
  return `<p class="muted ach-note">Floor calls come at random. Answer one with the best choice to collect it; anything less can be collected on a later shift.</p><div class="fcol">${P.map((x) => { const v = seen[x.id]; return `<div class="fc-t ${v || 'unseen'}" title="${esc(v ? x.title : 'Not seen yet')}"><span class="fc-g" aria-hidden="true">${v === 'best' ? '★' : v ? '◐' : '?'}</span><b>${v ? esc(x.title) : 'Not seen yet'}</b><small>${x.k.length > 1 ? 'Any unit' : esc(KIND[x.k[0]] || 'One unit')}${v && v !== 'best' ? ' · try again' : ''}</small></div>`; }).join('')}</div>`;
}
export function vAwards() {
  const have = G.prof.badges || {}, tr = RW.TRACKS, tiers = RW.tiers(G.prof), medals = Object.values(tiers).reduce((n, x) => n + x, 0);
  const les = Object.values(G.prof.lessons || {}), open = les.filter((l) => !l.fixed).length, fixed = les.length - open;
  const col = Object.values(G.prof.floorSeen || {}).filter((v) => v === 'best').length, lv = RW.level(G.prof.xp || 0);
  const tab = ui.awTab || 'all', tabs = [['all', 'Overview'], ['lessons', `Lesson log${open ? ` (${open})` : ''}`], ['floor', 'Floor calls'], ['units', 'Units']];
  let body = '';
  if (tab === 'all') body = `<section class="ach-sec"><h2>Skill tracks</h2><p class="muted ach-note">Every good call counts toward its skill for good. Bronze, silver, gold.</p><ul class="trks">${tr.map(trackRow).join('')}</ul></section>
    <section class="ach-sec"><h2>Milestones <span class="muted">${Object.keys(have).length} of ${RW.BADGES.length}</span></h2><div class="ach-badges">${RW.BADGES.map((b) => `<div class="ach-b ${have[b.id] ? '' : 'lock'}">${badgeHTML(b.id, !have[b.id], 'span')}<div><b>${esc(b.label)}</b><small>${esc(b.how)}</small>${have[b.id] ? `<small class="ach-when">Earned ${ago(have[b.id])}</small>` : ''}</div></div>`).join('')}</div></section>`;
  if (tab === 'lessons') body = `<section class="ach-sec"><h2>Lesson log</h2><p class="muted ach-note">Every call to rethink from a finished shift is kept here with the reason. Replay that shift and don't repeat it, and the lesson is marked fixed (+60 XP). Floor-call lessons are fixed when you meet that call again and choose the best answer.</p>
    <div class="filter" role="group" aria-label="Lessons">${[['open', `Still to fix (${open})`], ['fixed', `Fixed (${fixed})`]].map(([k, l]) => `<button class="btn ${(ui.lesF || 'open') === k ? 'btn-primary' : ''}" data-act="les-f" data-k="${k}" aria-pressed="${(ui.lesF || 'open') === k}">${l}</button>`).join('')}</div>${lessonsHTML(ui.lesF || 'open')}</section>`;
  if (tab === 'floor') body = `<section class="ach-sec"><h2>Floor-call collection <span class="muted">${col} of ${FL.POOL.length}</span></h2>${floorHTML()}</section>`;
  if (tab === 'units') body = `<section class="ach-sec"><h2>Units</h2><div class="ach-units">${CASES.map((id) => { const k = E.caseMeta(id), st = (G.prof.stars || {})[id] || 0, n = (G.prof.done || {})[id] || G.prof.runs.filter((r) => r.caseId === id).length, best = (G.prof.best || {})[id] || (G.prof.runs.filter((r) => r.caseId === id).map((r) => r.score).sort((a, b) => b - a)[0]), ol = les.filter((l) => l.caseId === id && !l.fixed).length; return `<div class="ach-u"><span class="rung-st">${[0, 1, 2].map((i) => starSvg(i < st, i, 'rs')).join('')}</span><b>${esc(k.title)}</b><small>${esc(specOf(id).name)} · ${esc(diffLabel(id))}</small><dl><dt>Best</dt><dd>${best !== undefined ? best : '–'}</dd><dt>Played</dt><dd>${n || 0}</dd><dt>Open lessons</dt><dd>${ol}</dd></dl><button class="btn ${n ? '' : 'btn-primary'}" data-act="pick-case" data-id="${id}">${n ? 'Play again' : 'Play'}</button></div>`; }).join('')}</div></section>`;
  return `<header class="top"><button class="mark" data-act="aw-back">The Shift</button><div class="where">Achievements</div><button class="btn btn-quiet" data-act="aw-back">${ICON.back}Back</button></header><main><div class="ach">
    <section class="ach-hero"><div class="ach-lv">${lvHTML(lv, G.prof.xp || 0, 0, false)}</div><div class="ach-sum"><div><b>${medals}</b><small>track medals</small></div><div><b>${Object.keys(have).length}</b><small>milestones</small></div><div><b>${fixed}</b><small>lessons fixed</small></div><div><b>${col}</b><small>floor calls collected</small></div></div></section>
    <nav class="ach-tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" data-act="aw-tab" data-k="${k}" aria-selected="${tab === k}">${l}</button>`).join('')}</nav>${body}</div></main>`;
}
export function learnHTML() {
  const r = G.s.reward, L = r && r.learn; if (!L) return '';
  const fx = L.fixed.map((k) => G.prof.lessons[k]).filter(Boolean), ag = L.again.map((k) => G.prof.lessons[k]).filter(Boolean);
  const ups = L.ups.map((u) => { const tr = RW.TRACKS.find((x) => x.id === u.id); return `<span class="up">${medalHTML(u.tier, TRACKG[tr.dom || tr.id])}<span><b>${esc(tr.label)}</b><small>${RW.TIER[u.tier]}</small></span></span>`; }).join('');
  if (!fx.length && !L.added.length && !ups && !ag.length) return `<section class="learn learn-empty"><p class="muted">Every call to rethink from a finished shift goes into your lesson log.</p><button class="btn btn-quiet" data-act="awards">Achievements ›</button></section>`;
  return `<section class="learn" aria-label="What you learned">
    ${fx.length ? `<div class="ln-fix"><h3>Lessons you fixed <span>${fx.length}</span></h3><ul>${fx.slice(0, 6).map((l) => `<li><span class="les-ic" aria-hidden="true">✓</span><span>${esc(l.text)}</span></li>`).join('')}${fx.length > 6 ? `<li class="muted">and ${fx.length - 6} more</li>` : ''}</ul><p class="muted">Mistakes from last time that you didn't repeat.</p></div>` : ''}
    ${ag.length ? `<div class="ln-ag"><h3>Came back <span>${ag.length}</span></h3><ul>${ag.slice(0, 4).map((l) => `<li><span class="les-ic" aria-hidden="true">!</span><span>${esc(l.text)}</span></li>`).join('')}</ul></div>` : ''}
    ${ups ? `<div class="ln-ups"><h3>Track medals</h3><div>${ups}</div></div>` : ''}
    <div class="ln-f">${L.added.length ? `<p><b>${L.added.length} new lesson${L.added.length === 1 ? '' : 's'}</b> in your log. Replay this shift and avoid ${L.added.length === 1 ? 'it' : 'them'} to mark ${L.added.length === 1 ? 'it' : 'them'} fixed.</p>` : ''}<button class="btn" data-act="awards" data-k="lessons">Open lesson log ›</button><button class="btn btn-quiet" data-act="awards">All achievements</button></div>
  </section>`;
}
