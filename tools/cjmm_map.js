/* Writes docs/cjmm-map.csv: every scored decision in the game, the skill area it scores, and the NCSBN clinical
   judgment step it's filed under, for clinical review. Fix a wrong step by adding the key to OVERRIDE in
   src/cjmm.js, then run: node tools/cjmm_map.js */
const fs = require('fs'), path = require('path');
global.window = {}; require('../src/cjmm.js'); const C = window.Shift.cjmm;
const ROOT = path.join(__dirname, '..'), files = fs.readdirSync(path.join(ROOT, 'src')).filter((f) => f.endsWith('.js')).map((f) => 'src/' + f)
  .concat(fs.readdirSync(path.join(ROOT, 'src/stories')).map((f) => 'src/stories/' + f)).sort();
const str = String.raw`'((?:[^'\\]|\\.)*)'|\x60((?:[^\x60\\]|\\.)*)\x60`;
const re = new RegExp(String.raw`judge\(\s*(?:` + str + String.raw`|([^,]+?))\s*,\s*'([a-z]+)'\s*,\s*([^,]+?)\s*,\s*(?:` + str + ')', 'g');
const rows = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  let m; while ((m = re.exec(src))) {
    const key = (m[1] || m[2] || m[3] || '').replace(/\\'/g, "'"), domain = m[4], delta = m[5], text = (m[6] !== undefined ? m[6] : m[7] || '').replace(/\\'/g, "'");
    const line = src.slice(0, m.index).split('\n').length, d = Number(delta);
    rows.push({ file: f + ':' + line, key, domain, delta: isNaN(d) ? 'varies' : d, text, step: C.step({ key, domain, delta: d, text }) });
  }
}
const q = (x) => '"' + String(x).replace(/"/g, '""') + '"', label = Object.fromEntries(C.STEPS.map(([id, l]) => [id, l]));
const csv = ['step,skill_area,points,decision,key,where'].concat(rows.map((r) => [q(label[r.step]), r.domain, r.delta, q(r.text), q(r.key), r.file].join(','))).join('\n') + '\n';
fs.writeFileSync(path.join(ROOT, 'docs/cjmm-map.csv'), csv);
const n = {}; rows.forEach((r) => { n[r.step] = (n[r.step] || 0) + 1; });
console.log(rows.length + ' decisions: ' + C.STEPS.map(([id, l]) => `${l} ${n[id] || 0}`).join(', '));
