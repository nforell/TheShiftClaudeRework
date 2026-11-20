/* The Shift — UI: Shared context: the engine and content modules, constants, small helpers and the mutable state (G). Imports nothing, so every view module can read it while loading. */

export const S = window.Shift;
export const E = S.engine, OR = S.orient, A_ = S.art, R = S.rig, FX = S.fx, F = S.flow, FL = S.floor, RW = S.reward, STY = S.story, CJ = S.cjmm, NG = S.ngn, RV = S.review, DR = S.drill, CL = S.cloud && S.cloud.on() ? S.cloud : null;
export const TEL = S.tel || { track() { return false; }, flush() {}, feedback() { return 'email'; }, status: () => 'Not loaded', recent: [], optedOut: () => false, setOptOut() {} };
export const CASES = ['medsurg-4w-1', 'medsurg-4w-2', 'medsurg-4w-3', 'stepdown-6e-1', 'icu-3w-1', 'ed-podb-1', 'ld-2s-1', 'ob-2n-1', 'psych-3e-1', 'psych-4n-1', 'peds-5s-1'];
/* Mutable state shared by every module. */
export const G = { caseId: CASES[0], s: null, prof: E.store.profile(), _A: null, _As: null, RC: null, aideCache: null, idleT: null, qtDup: null, resSeq: 0, SD: null };
/* Psych law: the content is written to California law (5150, 5250, Riese, LPS). "General US" swaps those for
   plain descriptions that hold in most states. Applied to everything the game shows, at display time. */
export const LAW = [
  [/\bWIC 5150\b/g, '72-hour involuntary hold'], [/\bWIC 5250\b/g, 'extended involuntary certification'],
  [/\ba 5150\b/g, 'a 72-hour hold'], [/\b5150 hold\b/g, '72-hour hold'], [/\b5150\b/g, '72-hour hold'],
  [/\ba 5250\b/g, 'an extended certification'], [/\bthe 5250\b/g, 'the extended certification'], [/^5250\b/g, 'Extended certification'], [/\b5250\b/g, 'extended certification'],
  [/\bthe hearing is usually within a day\b/g, 'the hearing timeline depends on the state'],
  [/\bRiese petition\b/g, 'petition for court-ordered medication'], [/ ?\(Riese\)/g, ''], [/\bRiese\b/g, 'capacity hearing'],
  [/\bLPS conservatorship\b/g, 'mental health conservatorship'], [/\bWIC 5585\b/g, '72-hour involuntary hold for a minor'], [/\b5585\b/g, '72-hour hold (minor)'],
  [/\billegal in California\b/g, 'illegal in most states'], [/\bCalifornia law protects\b/g, 'Privacy law protects'], [/ \(36 hours in California\)/g, ' (the deadline varies by state)'],
];
export const LAWHIT = /5150|5250|5585|Riese|LPS|California/;
export const lawText = (x) => { if (!LAWHIT.test(x) || ((G.prof && G.prof.settings) || {}).law !== 'general') return x; LAW.forEach(([re, to]) => { x = x.replace(re, to); }); return x; };
export const esc = (x) => lawText(String(x == null ? '' : x)).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const $ = (sel) => document.querySelector(sel);
export const ICON = {
  msg: '<svg class="ico" viewBox="0 0 24 24"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 18.5h4"/></svg>',
  menu: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chart: '<svg class="ico" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3M8.5 10h7M8.5 14h7M8.5 18h4"/></svg>',
  back: '<svg class="ico" viewBox="0 0 24 24"><path d="M14 6l-6 6 6 6"/></svg>',
  station: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 11.2L12 4.5l8 6.7"/><path d="M6.3 9.6V19h11.4V9.6"/><path d="M10.3 19v-4.6h3.4V19"/></svg>',
  up: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>',
  down: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  tick: '<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5"/><path d="M7 12.5l3.2 3.2L17.2 8.6"/></svg>',
  ff: '<svg class="ico ff-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6l8 6-8 6zM12 6l8 6-8 6z"/></svg>',
  xp: '<svg class="ico xp-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>',
  flame: '<svg class="fl-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c1.2 3.6 5.5 5.6 5.5 10.7a5.5 5.5 0 0 1-11 0c0-2.7 1.5-4.1 2.6-5.4.3 1.7 1.1 2.8 2.2 3.3.1-3.2-1.1-5.8.7-8.6z"/></svg>',
};
export const ui = { view: 'home', ov: null, chart: null, dock: 'assess', caption: null, toasts: [], rank: null, rankDone: false, dlg: null, med: null, sbar: null, delegMsg: null, nova: null, hIdx: 0, newLog: 0, filter: 'all', confirm: null, adv: null, stamp: null, justKey: null, busy: false };

/* The home screen's selected card (caseId) can differ from the shift in progress (s.caseId) while a game is
   saved. Everywhere except home, the shift in progress wins, so game code never mixes one shift's patients
   with another's case. */
export const GAMEVIEW = { handoff: 1, station: 1, room: 1, debrief: 1 };
export const inGame = () => !!(G.s && GAMEVIEW[ui.view]);
export const C = () => E.getCase(G.s && ui.view !== 'home' && ui.view !== 'shifts' && E.getCase(G.s.caseId) ? G.s.caseId : G.caseId);
/* Shift picker: which specialty each shift belongs to and how hard it is (1–5), with the reason in one line. */
export const SPEC = {
  ms: { name: 'Medical-surgical', unit: '4 West', blurb: 'Adult general floor: post-op care, diabetes, infection, heart failure. Start here.' },
  sd: { name: 'Cardiac step-down', unit: '6 East', blurb: 'Telemetry, drips and protocols that run on numbers. Best after med-surg.' },
  psy: { name: 'Adult psychiatry', unit: '3 East', blurb: 'Locked adult unit: holds, seclusion, the right to refuse, and medical problems hiding behind psych diagnoses.' },
  teen: { name: 'Adolescent psychiatry', unit: '4 North', blurb: 'Teens 14 to 17: consent, privacy, restraint charting and mandated reporting.' },
  icu: { name: 'Critical care', unit: '3 West ICU', blurb: 'Two to four patients who can die this hour: vasopressors, ventilators, fresh hearts, and families deciding. Best after step-down.' },
  ed: { name: 'Emergency', unit: 'ED Pod B', blurb: 'Patients arrive with clocks running: stroke windows, door-to-balloon times, an airway that is closing.' },
  ld: { name: 'Labor and delivery', unit: 'L&D, 2 South', blurb: 'Every patient is two patients: fetal monitoring, oxytocin, an epidural, a trial of labor after cesarean, fever in labor, and a birth you catch yourself.' },
  ob: { name: 'Mother-baby', unit: '2 North', blurb: 'The first day after birth: fundus checks, magnesium, newborn glucose, and the screens that catch what doesn\'t show.' },
  peds: { name: 'Pediatrics', unit: '5 South', blurb: 'Infants to teens: age-based vital signs, weight-based doses, and their families.' },
};
export const DIFF = ['', 'Orientation', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
export const META = {
  'medsurg-4w-1': { sp: 'ms', d: 1, why: 'Four patients and three hints. One of them is quietly getting worse. The best place to learn how the game works.' },
  'medsurg-4w-2': { sp: 'ms', d: 2, why: 'A fifth patient arrives from the ED, a unit of blood, a critical lab call, and other people changing orders on you.' },
  'medsurg-4w-3': { sp: 'ms', d: 3, why: 'Nights: nobody calls you when someone changes, your aide is floated at 01:00, and you only get two hints.' },
  'stepdown-6e-1': { sp: 'sd', d: 4, why: 'Every patient is on a drip, a nomogram or a protocol, and new results that should change them. Assumes med-surg basics.' },
  'psych-3e-1': { sp: 'psy', d: 4, why: 'Legal holds and seclusion charted step by step, plus a medical emergency on a psych unit. Uses California law (switch in Settings).' },
  'psych-4n-1': { sp: 'teen', d: 5, why: 'Minors: parents, privacy and mandated reports, restraint charting, refeeding labs and a hidden overdose. The hardest shift.' },
  'ed-podb-1': { sp: 'ed', d: 4, why: 'Five patients, two arriving mid-shift, each with a time-critical treatment that depends on a fact someone has to ask for. Assumes med-surg basics.' },
  'icu-3w-1': { sp: 'icu', d: 5, why: 'Septic shock on a vasopressor, a ventilator alarm, a tamponade that looks like the bleeding stopped, and a family meeting about stopping life support. Assumes step-down basics.' },
  'ld-2s-1': { sp: 'ld', d: 4, why: 'Four women in labor and four babies on the monitor: tachysystole on an oxytocin order that says go up, epidural hypotension, a uterine rupture, fever in labor, and a delivery before the doctor arrives. Assumes mother-baby basics.' },
  'ob-2n-1': { sp: 'ob', d: 3, why: 'Mothers and a newborn at once: bleeding, a high-alert drip, weight-based newborn dosing and a mental health screen. Assumes med-surg basics.' },
  'peds-5s-1': { sp: 'peds', d: 4, why: 'Normal vital signs change with age and every dose depends on weight. Parents, an interpreter and a safeguarding concern.' },
};
export const meta = (id) => META[id] || { sp: 'ms', d: 1, why: '' };
export const specOf = (id) => SPEC[meta(id).sp];
export const diffLabel = (id) => DIFF[meta(id).d];
export const diffPips = (id, cls) => { const d = meta(id).d; return `<span class="diff d${d} ${cls || ''}" role="img" aria-label="Difficulty ${d} of 5, ${DIFF[d]}"><span class="pips" aria-hidden="true">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= d ? 'on' : ''}"></i>`).join('')}</span><b aria-hidden="true">${DIFF[d]}</b></span>`; };
export const shiftFacts = (k) => { const n = k.patients.filter((x) => !x.arrives).length, a = k.patients.length - n; return `${n} patients${a ? ` + ${a} ${k.arrivalNoun || 'admission'}${a > 1 ? 's' : ''}` : ''} · ${k.novaCredits || 3} hints · about ${k.minutes || 15} min`; };
/* Terms of use: the game asks once, and again whenever src/terms.json gets a new version. */
export const TERMS = S.terms || null;
export const buildTag = () => { const c = S.config || {}; return `v${c.version || '?'} · build ${c.build || 'dev'}`; };
export const termsOk = () => !TERMS || String(G.prof.terms || '') >= TERMS.version;
export const TERMS_FREE = new Set(['terms', 'terms-ok', 'settings', 'account', 'menu', 'theme', 'set', 'close', 'x']);   // readable before agreeing
// The engine API only closes over the game state, so one object per game is enough (it was rebuilt on every call).
export const A = () => (G._As === G.s && G._A ? G._A : (G._As = G.s, G._A = E.api(G.s)));
export const def = (id) => C().patients.find((p) => p.id === id);
// What changes about a patient as the shift goes on (code status after a family meeting, the problem after a birth): d.live(s, P) overrides.
export const liveDef = (d) => { if (!d || !d.live || !G.s || !G.s.p[d.id]) return d; const o = d.live(G.s, G.s.p[d.id]); return o ? Object.assign({}, d, o) : d; };
export const staff = (k) => C().staff[k] || { name: k, role: '', look: null };
/* Rig inputs for a patient: what their body is doing right now, not what was last charted. */
export function rigV(id) {
  const d = def(id), P = G.s.p[id], Ax = A(), vt = d.vitals(G.s, P, Ax);
  return Object.assign({ rr: vt.RR, spo2: vt.SpO2, hr: vt.HR, sbp: vt.SBP, temp: vt.T, pain: vt.pain }, d.rig ? d.rig(G.s, P, Ax) : {});
}
export const face = (k) => R.icon(k);
export const pface = (id) => R.icon(id, G.s ? rigV(id) : null);
export const faceOf = (k) => (def(k) ? pface(k) : face(k));
export const who = (k) => (def(k) ? { name: def(k).name, role: 'Room ' + k } : staff(k));
export const fromOf = (d) => d.from || 'the ED', admWord = (d) => d.arriveAs || 'Admission';
export const here = (d) => !d.arrives || (G.s && G.s.p[d.id].arrived);          // admitted patients appear mid-shift
export const pts = () => C().patients.filter(here);
export const gone = (P) => !P || P.icu || P.gone;                                 // off the unit (ICU, OR)
export const goneText = (P) => P.goneText || 'Transferred to ICU';
/* A case can give patients their own provider (an OB for the mother, a pediatrician for the baby). */
export const provKey = (pid) => ((pid && def(pid) && def(pid).provider) || C().provider || 'chen');
export const prov = (pid) => (pid === undefined && C().patients.some((x) => x.provider) ? { name: C().providerLabel || 'a provider', role: '', look: null } : staff(provKey(pid)));
export const cna = () => staff(C().cna || 'luis');
export const cnaAway = () => (G.s && C().delegation && C().delegation.away ? C().delegation.away(G.s) : null);   // floated, on break: who isn't there now
export const unitS = () => esc(C().unitShort || '4 West');
export const sysL = (id, l) => (C().sysLabels && C().sysLabels[id]) || l;
export const legal = (d0) => { const d = liveDef(d0); return d.legal ? `<span class="chip legal">${esc(d.legal)}</span>` : ''; };
/* Normal ranges are per patient: a heart rate of 150 is normal at four months and alarming at forty. */
export const NORM = { T: [36, 37.9], HR: [55, 100], RR: [12, 22], SBP: [100, 160], SpO2: [92, 101] };
export const norm = (d, k) => (d && d.norms && d.norms[k]) || NORM[k];
export const abn = (d, k, v) => { const [lo, hi] = norm(d, k); return v < lo || v > hi; };
export const ageSex = (d) => (typeof d.age === 'number' && String(d.sex).length === 1 ? (d.age < 18 ? `${d.age} yr, ${d.sex}` : `${d.age}${d.sex}`) : `${d.age}, ${d.sex}`);   // "3M" reads like three months
// Shorten text at a word boundary so a number is never cut in half ("Pain 9 out of 1…").
export const clip = (t, n) => { t = String(t || ''); if (t.length <= n) return t; const c = t.slice(0, n + 1), i = c.lastIndexOf(' '); return (i > n * .6 ? c.slice(0, i) : t.slice(0, n)).replace(/[\s,;:.(]+$/, '') + '…'; };
export const lcFirst = (t) => (/^[A-Z][A-Z0-9]/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));   // "UTI, ..." stays "UTI"
// A drip's dose is whatever the pump says now ("Stopped 09:12", "1 g/h"), not the admission order.
export const medDose = (m) => { const st = G.s && G.s.meds[m.id]; return m.doseNow && st ? m.doseNow(G.s, G.s.p[st.pid]) || m.dose : m.dose; };
export const fT = (t) => (typeof t === 'number' ? t.toFixed(1) : t);
export const fLab = (l) => (typeof l.val === 'number' && Number.isInteger(l.val) && /\d\.\d/.test(l.ref || '') ? l.val.toFixed(1) : l.val);
export const o2txt = (o) => (o === 'Room air' ? 'room air' : o);
export const hhmm = (c, t) => { const m = (c.start || 420) + Math.round(t); return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };

/* Frame monitor: if this device can't keep up (under ~30 fps for a few seconds), switch to lighter graphics on Auto. */
export const FM = { dts: [], last: 0, lite: false, bad: 0, fps: 60 };
/* The shift pack. Locked shifts can be picked and previewed; starting one offers the pack instead. */
export const PACK = (S.config || {}).pack || {};
export const owned = () => !!(CL && CL.owns && CL.owns('pack'));
export const locked = (id) => !!PACK.on && !(PACK.free || []).includes(id) && !owned();
/* Where the player is in the orientation survives a reload or a closed tab (a phone that locks mid-walkthrough):
   it reopens at the same step with the same answers, and is forgotten once finished, skipped or reset. */
export const ORK = 'theshift.orient.v1';
export const orSave = () => { try { if (ui.or) localStorage.setItem(ORK, JSON.stringify(Object.assign({}, ui.or, { caseId: G.caseId }))); else localStorage.removeItem(ORK); } catch (e) { /* storage off */ } };
export const orLoad = () => { try { const o = JSON.parse(localStorage.getItem(ORK) || 'null'); return o && typeof o.i === 'number' && o.i >= 0 && OR && o.i < OR.CH.length ? o : null; } catch (e) { return null; } };
export const fmtN = (n) => Math.round(n).toLocaleString('en-US');
/* What the aide offers to take, the way a good aide would: things on the unit's due list that are theirs to do,
   the vitals round, and routine care (walks, turns, I&O, baths). Each offer is tried on a copy of the shift first,
   and anything the game would score as a delegation mistake is left out: an aide doesn't offer to walk a confused
   fall risk. One-off judgment calls (a sitter, keeping someone flat) are never offered; they stay in the full list
   with everything an aide can't do, so delegation is still a decision. */
export const AIDE_DUE = { vitals: /vital/i, bg: /glucose|sugar|\bBG\b|fingerstick/i, intake: /intake|breakfast|lunch|dinner tray/i, io: /intake and output|\bI&O\b|diaper/i, weigh: /weigh|weight/i, turn: /turn|reposition/i, walk: /walk|ambulat/i, ortho: /orthostatic/i, tray: /tray|renal diet/i, blood: /transfus|PRBC|blood bank/i };
export const AIDE_ROUTINE = { walk: 'Up and walking', turn: 'Due every 2 hours', io: 'Diapers and intake this shift', bath: 'When there\'s time' };
/* Stuck players. Real time: 45 seconds with no input while work is waiting shows a pointer to the next step.
   Game time: falling well behind brings a free check-in from Nova (it doesn't use up a tip). */
/* Bank rows are titled by topic; two different questions on one topic get the client who's in each, so the list
   never shows two identical titles ("Ventilator alarms" twice). */

/* Every action in a room runs through here: the clock moves, then the nurse sees what happened to the patient. */

/* ------------ drag to reorder: any [data-sort] list whose children carry data-key ------------
   Mouse and pen drag the whole card; on touch, drag from the handle so the page still scrolls.
   While dragging, the card follows the pointer and the others slide out of the way; on drop the new
   order goes to onSorted() and the page re-renders with the card easing into its slot. */
