// Clinical review of the practice content: every drill card and NCLEX item, written out as plain text with the key and
// the reason for every option, grouped into packs of 20 to 30 a reviewer can finish in one sitting.
// Each item carries a fingerprint of its source, so an edit after sign-off shows up as "changed since review".
// build.py runs this (node tools/review_items.js) and turns the JSON on stdout into /review/practice/ pages.
const path = require('path'), crypto = require('crypto');
const SRC = path.join(__dirname, '..', 'src');
global.window = {}; global.document = {}; global.localStorage = { getItem() {}, setItem() {} };
['drills-content.js', 'drills-more-1.js', 'drills-more-2.js', 'drills-nclex-1.js', 'drills-nclex-2.js',
  'cjmm.js', 'ngn-challenge.js', 'ngn-why.js', 'ngn-bank.js', 'ngn-cases.js', 'ngn.js'].forEach((f) => require(path.join(SRC, f)));
const S = window.Shift, D = S.drillData, N = S.ngn;

// Fingerprint the source object itself (not the text below), so wording changes in this tool don't reset reviews.
const fp = (o) => crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0, 10);
const ok = (L) => L.find((o) => o.ok) || {};
const wrong = (L) => L.filter((o) => !o.ok).map((o) => `- ✗ ${o.t}${o.w ? `\n  Why not: ${o.w}` : ''}`);
const LV = (c) => (c.lv >= 2 ? ' · NCLEX level' : '');
const SP = { ms: 'Medical-surgical', sd: 'Cardiac and step-down', icu: 'Critical care', ed: 'Emergency', ob: 'Obstetrics and newborn', peds: 'Pediatrics', psy: 'Psychiatric', teen: 'Psychiatric', periop: 'Perioperative', comm: 'Community and fundamentals' };
const STEP = Object.fromEntries((S.cjmm && S.cjmm.STEPS) || []);

/* ---------- drills ---------- */
const drill = {
  med: (c) => ({ title: `${c.med}: ${c.p.n}, ${c.p.a}${LV(c)}`, body: [c.for ? `For: ${c.for}` : '', c.line, '',
    `✓ Check first: ${ok(c.check).t} → ${ok(c.check).v}`, ...c.check.filter((o) => !o.ok).map((o) => `- ✗ ${o.t}${o.v ? ` (${o.v})` : ''}${o.w ? `\n  Why not: ${o.w}` : ''}`), '',
    `✓ Then: ${ok(c.pick).t}`, ...wrong(c.pick), '', `Why: ${c.why || ''}`, c.pearl ? `Pearl: ${c.pearl}` : ''] }),
  first: (c) => ({ title: `${c.where}${LV(c)}`, body: [c.q || 'Who do you see first?', '',
    ...c.pts.map((x) => `${x.ok ? '✓ FIRST' : '-'} ${x.p.n}, ${x.p.a}: ${x.line}${!x.ok && x.w ? `\n  Not first: ${x.w}` : ''}`), '',
    `Why: ${c.why || ''}`, c.pearl ? `Pearl: ${c.pearl}` : ''] }),
  sbar: (c) => ({ title: `${c.p.n}, calling ${c.to}${LV(c)}`, body: [c.setup, '',
    ...c.steps.flatMap((s) => [`✓ ${s.k}: ${ok(s.o).t}`, ...wrong(s.o), s.say ? `  Provider: ${s.say}` : '']),
    c.order ? `Order to read back: ${c.order}` : '', `Why: ${c.why || ''}`, c.pearl ? `Pearl: ${c.pearl}` : ''] }),
  calm: (c) => ({ title: `${c.p.n}, ${c.where}${LV(c)} (agitation starts at ${c.m}/10)`, body: [c.setup, '',
    ...c.turns.flatMap((t, i) => { const lo = Math.min(...t.o.map((o) => o.d)); return [`Turn ${i + 1}: ${t.say}`, ...t.o.map((o) => `${o.d === lo ? '✓' : '-'} (${o.d > 0 ? '+' : ''}${o.d}) ${o.t}${o.r ? `\n  Reaction: ${o.r}` : ''}`)]; }),
    '', `Why: ${c.why || ''}`, c.pearl ? `Pearl: ${c.pearl}` : ''] }),
};

/* ---------- NCLEX items (every format), rationales inline or from ngn-why ---------- */
function ngnBody(it) {
  const W = it.whys && !Array.isArray(it.whys) ? it.whys : (N.whys ? N.whys(it) || {} : {}), L = [];
  const why = (arr, i, o) => (o && o.why) || (arr && arr[i]) || '';
  if (it.stem) L.push(it.stem); if (it.q) L.push('', it.q, '');
  if (it.type === 'mc' || it.type === 'sata') (it.opts || []).forEach((o, i) => L.push(`${o.ok ? '✓' : '-'} ${o.t}`, `  ${why(W.opts, i, o)}`));
  if (it.type === 'highlight') (it.parts || []).forEach((o, i) => { if (typeof o === 'string') return; L.push(`${o.ok ? '✓ highlight' : '-'} ${o.t}`, `  ${why(W.parts, i, o)}`); });
  if (it.type === 'matrix') (it.rows || []).forEach((r, i) => L.push(`- ${r.t} → ${[].concat(r.ans).map((a) => it.cols[a]).join(', ')}`, r.why ? `  ${r.why}` : (W.rows && W.rows[i] ? `  ${W.rows[i]}` : '')));
  if (it.type === 'cloze') it.parts.filter((x) => typeof x !== 'string').forEach((x, b) => { L.push(`Blank ${b + 1}:`); x.opts.forEach((o, i) => L.push(`${i === x.ans ? '✓' : '-'} ${o}`, `  ${(x.whys || (W.blanks || [])[b] || [])[i] || ''}`)); });
  if (it.type === 'bowtie') ['cond', 'actions', 'params'].forEach((k) => { const a = [].concat(it[k].ans); L.push(`${{ cond: 'Condition', actions: 'Actions to take', params: 'Parameters to monitor' }[k]}:`); it[k].opts.forEach((o, i) => L.push(`${a.includes(i) ? '✓' : '-'} ${o}`, `  ${(it[k].whys || (W[k] || []))[i] || ''}`)); });
  if (it.type === 'order') { L.push('Correct order:'); (it.opts || []).forEach((o, i) => L.push(`${i + 1}. ${typeof o === 'string' ? o : o.t}`, `  ${(it.whys || [])[i] || (o && o.why) || ''}`)); }
  if (it.type === 'num') L.push(`Answer: ${it.ans} ${it.unit || ''}${it.tol ? ` (± ${it.tol})` : ''}${it.round ? `. ${it.round}` : ''}`, ...(it.work || []).map((w) => `  ${w}`));
  if (it.why) L.push('', `Why: ${it.why}`);
  if (it.tip || W.tip) L.push(`Tip: ${it.tip || W.tip}`);
  return L.filter((x, i, a) => !(x === '' && a[i - 1] === ''));
}
const ngnTitle = (it) => `${it.topic || ({ mc: 'Multiple choice', sata: 'Select all', matrix: 'Matrix', cloze: 'Drop-down', highlight: 'Highlight', bowtie: 'Bowtie', order: 'Ordered response', num: 'Calculation' }[it.type] || it.type)}${it.ch ? ' · NCLEX challenge' : ''} · ${STEP[it.step] || it.step || ''}`;

const rows = (R) => (Array.isArray(R) ? R.map((x) => (Array.isArray(x) ? `${x[0]} ${x[1]}${x[2] ? ` (${x[2]})` : ''}` : typeof x === 'string' ? x : JSON.stringify(x))).join('; ') : R ? String(R) : '');

/* ---------- packs ---------- */
const packs = [];
const pack = (id, title, sub, list) => {
  const chunks = list.length > 30 ? Math.ceil(list.length / 25) : 1, n = Math.ceil(list.length / chunks);
  for (let k = 0; k < chunks; k++) {
    const items = list.slice(k * n, (k + 1) * n);
    packs.push({ id: chunks > 1 ? `${id}-${k + 1}` : id, title: chunks > 1 ? `${title}, part ${k + 1} of ${chunks}` : title, sub, items });
  }
};
const dr = (kind, name, sub) => pack(`drill-${kind}`, `Drills: ${name}`, sub, D[kind].map((c) => Object.assign({ id: `drill:${c.id}`, hash: fp(c) }, drill[kind](c))));
dr('med', 'Med Pass', 'What to check before a medication, then give, hold or call. A pharmacist is especially welcome.');
dr('first', "Who's First", 'Four patients, one nurse: who do you see first, and why not the others.');
dr('sbar', 'SBAR', 'Building a call to the provider line by line, and the order that comes back.');
dr('calm', 'De-escalation', 'What to say to an agitated patient, turn by turn. Psych or ED experience fits best.');

// Questions after each shift (three regular, two NCLEX challenge per shift).
const shiftItems = Object.entries(N.ITEMS).flatMap(([cid, L]) => L.map((it) => Object.assign({ id: `ngn:${it.id}`, hash: fp(it), title: `${cid} · ${ngnTitle(it)}`, body: ngnBody(it) })));
pack('ngn-shift', 'NCLEX questions after each shift', 'Five per shift, including the two harder NCLEX challenge items.', shiftItems);

// The question bank, by specialty.
const bySp = {}; S.ngnBank.forEach((it) => { const k = it.sp === 'teen' ? 'psy' : it.sp; (bySp[k] = bySp[k] || []).push(it); });
Object.entries(bySp).sort((a, b) => b[1].length - a[1].length).forEach(([sp, L]) => pack(`bank-${sp}`, `NCLEX question bank: ${SP[sp] || sp}`, `${L.length} standalone practice questions.`, L.map((it) => ({ id: `ngn:${it.id}`, hash: fp(it), title: ngnTitle(it), body: ngnBody(it) }))));

// Unfolding case studies: the chart, then six items each. Two or three cases per pack.
const cs = S.ngnCases.map((c) => ({ c, items: c.items.map((it, i) => ({ id: `ngn:${it.id}`, hash: fp({ it, record: c.record }), title: `${c.title} · item ${i + 1} · ${ngnTitle(it)}`, body: (i === 0 ? [`Client: ${c.client}`, ...(c.record || []).map((r) => `${typeof r === 'string' ? r : [`${r.tab || r.title || 'Chart'}${r.time ? ` ${r.time}` : ''}${r.at ? ` (shown from item ${r.at + 1})` : ''}:`, r.t || r.text || rows(r.rows || r.lines)].join(' ')}`), ''] : []).concat(ngnBody(it)) })) }));
for (let k = 0; k < cs.length; k += 3) { const g = cs.slice(k, k + 3); packs.push({ id: `cases-${k / 3 + 1}`, title: `Case studies: ${g.map((x) => x.c.title).join('; ')}`, sub: 'Unfolding case studies: one client, six questions in clinical judgment order.', items: g.flatMap((x) => x.items) }); }

packs.forEach((p) => p.items.forEach((it) => { it.body = it.body.flatMap((l) => String(l).split('\n')); }));
process.stdout.write(JSON.stringify({ packs }));
