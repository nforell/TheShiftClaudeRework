/* How often is the right answer the longest option? Run: node tools/length_tell.js [--json]
   Chance is 25 to 33%. A drill where it is much higher can be passed by tapping the longest line. */
const fs = require('fs'), path = require('path'), SRC = path.join(__dirname, '..', 'src');
global.window = { Shift: {} };
const files = fs.readdirSync(SRC).filter((f) => /^drills-.*\.js$/.test(f)).sort((a, b) => (a === 'drills-content.js' ? -1 : b === 'drills-content.js' ? 1 : a.localeCompare(b)));
const before = {}, per = {};
function lists(card, kind) {
  const out = [];
  if (kind === 'med') { out.push(['med.check', card.check]); out.push(['med.pick', card.pick]); }
  else if (kind === 'first') out.push(['first', card.pts]);
  else if (kind === 'sbar') (card.steps || card.s || Object.values(card).find(Array.isArray) || []).forEach((st) => st && st.o && out.push(['sbar', st.o]));
  else if (kind === 'calm') (card.turns || card.t || Object.values(card).find(Array.isArray) || []).forEach((st) => st && st.o && out.push(['calm', st.o]));
  return out.filter((x) => Array.isArray(x[1]) && x[1].length > 1);
}
const txt = (o) => o.t || o.line || '';
function right(o) { if (o.some((x) => 'd' in x)) { const m = Math.min(...o.map((x) => x.d)); return o.filter((x) => x.d === m); } return o.filter((x) => x.ok); }
function add(bucket, key, o) {
  const g = right(o); if (g.length !== 1) return;
  const L = o.map((x) => txt(x).length), n = txt(g[0]).length, s = (bucket[key] = bucket[key] || { n: 0, longest: 0, ratio: 0 });
  s.n++; if (n === Math.max(...L) && L.filter((x) => x === n).length === 1) s.longest++; s.ratio += n / ((L.reduce((a, b) => a + b) - n) / (o.length - 1));
}
const total = {};
for (const f of files) {
  const seen = {}; for (const k in (window.Shift.drillData || {})) seen[k] = window.Shift.drillData[k].length;
  eval(fs.readFileSync(path.join(SRC, f), 'utf8'));
  const D = window.Shift.drillData || {}; per[f] = {};
  for (const k in D) D[k].slice(seen[k] || 0).forEach((c) => lists(c, k).forEach(([key, o]) => { add(per[f], key, o); add(total, key, o); }));
}
const row = (s) => ({ lists: s.n, longestPct: Math.round(100 * s.longest / s.n), ratio: +(s.ratio / s.n).toFixed(2) });
const out = { total: Object.fromEntries(Object.entries(total).map(([k, s]) => [k, row(s)])), files: Object.fromEntries(Object.entries(per).map(([f, b]) => [f, Object.fromEntries(Object.entries(b).map(([k, s]) => [k, row(s)]))])) };
if (process.argv.includes('--json')) console.log(JSON.stringify(out));
else { for (const [f, b] of [['ALL', out.total], ...Object.entries(out.files)]) { console.log(f); for (const [k, r] of Object.entries(b)) console.log('  ' + k.padEnd(10), String(r.lists).padStart(4), 'lists   right is longest', String(r.longestPct).padStart(3) + '%   length right/wrong', r.ratio); } }
