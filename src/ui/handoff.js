/* The Shift — UI: Report at the start of a shift, the cold open and who-first ranking. */
import { C, E, G, ICON, ageSex, def, esc, fT, face, legal, liveDef, pface, staff, ui } from './ctx.js';
import { codeChip, flagsFor, shortAllergy } from './floor.js';
import { sheet } from './sheets.js';

/* ------------ handoff ------------ */
export function vHandoff() {
  const pts = C().patients.filter((x) => !x.arrives), d = pts[ui.hIdx], P = G.s.p[d.id], rb = staff(C().reportBy);
  const nv = P.vit[0];
  const brain = G.s.brain.map((k) => { const [pid, i] = k.split(':'); return { k, pid, text: def(pid).report[+i].text }; });
  return `<main><div class="handoff">
    <section class="report" aria-labelledby="rh">
      <div class="dana">${face(C().reportBy)}<span><b>${esc(rb.name)}</b>, ${esc(C().reportRole)}, is giving you report. <b class="flag-cue">Tap to flag</b> anything worth remembering. Some of it is noise.</span></div>
      <div class="report-head">${pface(d.id)}<div class="who"><h2 id="rh">${esc(d.name)} <small class="muted" style="font-weight:500">${ageSex(d)}, room ${d.room}</small></h2>
        <div class="muted">${esc(liveDef(d).dx)}</div>
        <div class="meta">${legal(d)}<span class="chip">${esc(liveDef(d).code)}</span><span class="chip ${/No known/.test(liveDef(d).allergies) ? '' : 'alert'}">Allergy: ${esc(liveDef(d).allergies.split(',')[0].split('(')[0])}</span><span class="chip">${E.clock(nv.t)}: T ${fT(nv.T)}, HR ${nv.HR}, BP ${nv.SBP}/${nv.DBP}, SpO₂ ${nv.SpO2}%</span></div></div></div>
      <ul class="lines ${ui.hFresh ? 'fresh' : ''}">${d.report.map((r, i) => { const k = d.id + ':' + i; return `<li style="--i:${i}"><button class="line" data-act="flag" data-k="${k}" aria-pressed="${G.s.brain.includes(k)}"><i class="flag-ic" aria-hidden="true"></i><span>${esc(r.text)}</span></button></li>`; }).join('')}</ul>
      <div class="tabsrow" role="tablist" aria-label="Patients in report">
        ${pts.map((p, i) => `<button class="pt-tab rich" role="tab" data-act="h-go" data-i="${i}" aria-current="${i === ui.hIdx}">${pface(p.id)}<span><b>${p.room}</b><small>${esc(p.short)}</small></span></button>`).join('')}
        <span class="sp"></span>
        ${ui.hIdx < pts.length - 1 ? `<button class="btn btn-primary" data-act="h-go" data-i="${ui.hIdx + 1}">Next: ${pts[ui.hIdx + 1].room}</button>` : `<button class="btn btn-primary" data-act="h-done">Finish report</button>`}
      </div>
    </section>
    <aside class="brain" aria-label="Your brain sheet">
      <h2>Your brain sheet${brain.length ? ` <span class="count">${brain.length}</span>` : ''}</h2><p class="hint">Everyone you have today. What you flag lands under their name and stays with you all shift.</p>
      <ol class="bs">${pts.map((p, i) => { const fl = brain.filter((b) => b.pid === p.id); const cur = i === ui.hIdx, heard = i < ui.hIdx || G.s.hHeard && G.s.hHeard.includes(p.id); return `<li class="bs-p ${cur ? 'cur' : heard ? 'heard' : 'next'}">
        <button class="bs-h" data-act="h-go" data-i="${i}" aria-current="${cur}">${pface(p.id)}<span class="bs-who"><b>${p.room} ${esc(p.short)}</b><small>${esc(ageSex(p))}, ${esc(p.dx)}</small></span><span class="bs-st">${cur ? 'Reporting' : heard ? 'Heard' : 'Up next'}</span></button>
        ${fl.length ? `<ul>${fl.map((b) => `<li class="tap" data-act="flag" data-k="${b.k}" role="button" tabindex="0" title="Tap to unflag">${esc(b.text)}</li>`).join('')}</ul>` : ''}</li>`; }).join('')}</ol>
      ${ui.hIdx < pts.length - 1 ? `<p style="margin-top:1rem"><button class="btn btn-quiet" data-act="h-done">Skip to triage</button></p>` : ''}
    </aside></div></main>`;
}

/* Cold open: a few beats that set the stakes before report. Tap to hurry it; it plays once per shift. */
export function ovIntro() {
  const c = C(), I = c.intro;
  return `<div class="intro ${ui.introAll ? 'all' : ''}" data-act="intro-tap" role="dialog" aria-modal="true" aria-label="${esc(c.title)}">
    <button class="intro-skip" data-act="intro-go">Skip</button>
    <svg class="intro-ecg" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70 H420 l18 -6 12 6 h30 l10 -48 14 86 12 -52 10 14 h60 l22 -10 18 10 H1200"/></svg>
    <div class="intro-body">
      <p class="intro-time">${esc(I.time)}</p>
      <p class="intro-place">${esc(I.place)}</p>
      ${I.beats.map((b, i) => `<p class="intro-beat" style="--d:${1.1 + i * 1.5}s">${esc(b)}</p>`).join('')}
      <button class="btn btn-primary btn-go intro-cta" data-act="intro-go" style="--d:${1.1 + I.beats.length * 1.5}s">${esc(I.cta || 'Take report')} <span aria-hidden="true">→</span></button>
    </div></div>`;
}

export function ovRank() {
  const r = ui.rank, pr = C().priority;
  const done = ui.rankDone;
  const body = `<div class="nova-card">${face('nova')}<p class="dlg-text" style="margin:0">${done ? `"${r.every((p, i) => pr.correct[i] === p) ? 'Same order I\'d pick, top to bottom. Now go prove it.' : r[0] === pr.correct[0] ? 'Same first stop as me. We differ after that. I\'ll tell you where at the debrief.' : 'I\'d have started somewhere else. Keep your eyes open, and I\'ll show you my order at the debrief.'}"` : '"Before you move: who are you seeing first? Drag them into order. Don\'t overthink it. Think about who could get hurt fastest."'}</p></div>
    ${done ? '' : '<p class="rank-guide"><span><b>1</b> = see first</span><span class="rank-guide-line" aria-hidden="true"></span><span><b>' + r.length + '</b> = see last</span></p><p class="rank-how">Drag a card by its handle to move it. You can also use the arrows.</p>'}
    <ol class="rank ${done ? 'done' : ''}" data-sort="rank" aria-describedby="rank-live">${r.map((pid, i) => { const d = def(pid); const right = pr.correct[i] === pid; const ord = ['1st', '2nd', '3rd', '4th', '5th', '6th'][i]; return `<li data-pid="${pid}" data-key="${pid}" class="${done ? (i === 0 ? (right ? 'right' : 'wrong') : 'settled') : ''} ${ui.rankMoved === pid ? 'moved' : ''}">${done ? '' : `<span class="grip" aria-hidden="true" title="Drag to reorder"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg></span>`}<span class="n" aria-label="${ord}"><b>${i + 1}</b><small>${i === 0 ? 'first' : i === r.length - 1 ? 'last' : ord}</small></span>${pface(pid)}<span class="rk-who"><b>${d.room} ${esc(d.short)}</b> <small class="muted">${ageSex(d)}</small><br><small class="muted">${esc(liveDef(d).dx)}</small>${(() => { const fl = flagsFor(pid); return `<span class="rk-facts">${codeChip(d)}${shortAllergy(d)}${legal(d)}</span>${fl.length ? `<span class="rk-fl">${fl.map((f) => `<i>${esc(f)}</i>`).join('')}</span>` : ''}<button class="rk-peek" data-act="rank-peek" data-pid="${pid}" aria-expanded="${ui.peek === pid}">${ui.peek === pid ? 'Hide report' : 'Show report'}</button>${ui.peek === pid ? `<span class="rk-rep">${d.report.map((r, k) => `<span class="${G.s.brain.includes(pid + ':' + k) ? 'on' : ''}">${esc(r.text)}</span>`).join('')}</span>` : ''}`; })()}</span>${done ? '' : `<span class="mv"><button class="btn mv-up" data-act="rk" data-i="${i}" data-d="-1" aria-label="${i === 0 ? `${d.short} is already first` : `Move ${d.short} up to number ${i}`}" ${i === 0 ? 'disabled data-why="Already first."' : ''}>${ICON.up}</button><button class="btn mv-dn" data-act="rk" data-i="${i}" data-d="1" aria-label="${i === r.length - 1 ? `${d.short} is already last` : `Move ${d.short} down to number ${i + 2}`}" ${i === r.length - 1 ? 'disabled data-why="Already last."' : ''}>${ICON.down}</button></span>`}</li>`; }).join('')}</ol><p class="sr" id="rank-live" aria-live="polite"></p>`;
  return sheet('Who first?', body, done ? `<button class="btn btn-primary" data-act="rank-go">Start the shift</button>` : `<button class="btn btn-primary" data-act="rank-submit">Lock in my order</button>`, { noClose: true, noScrimClose: true, wide: true });
}
