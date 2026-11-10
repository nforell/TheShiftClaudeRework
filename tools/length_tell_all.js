/* Answer-length check for everything outside the drills: any list of 3+ options where exactly one is marked right
   (ok / correct / good), in the NCLEX files, shift cases, floor calls and stories. Run: node tools/length_tell_all.js
   It reads the source text for option lists, so it is a survey, not a gate: use it to find the worst files. */
const fs = require('fs'), path = require('path'), SRC = path.join(__dirname, '..', 'src');
const files = fs.readdirSync(SRC).filter((f) => /^(ngn|case-|floor|orient)/.test(f) && f.endsWith('.js')).concat(fs.existsSync(path.join(SRC, 'stories')) ? fs.readdirSync(path.join(SRC, 'stories')).map((f) => 'stories/' + f) : []);
const rows = [];
for (const f of files) {
  const s = fs.readFileSync(path.join(SRC, f), 'utf8'); let n = 0, longest = 0, ratio = 0;
  // option lists: [ { ... t|text|label: '...' ... }, ... ] with one ok/correct/good flag
  const re = /\[\s*(\{[^\[\]]{0,1200}?\}\s*,?\s*){3,6}\]/g; let m;
  while ((m = re.exec(s))) {
    const objs = m[0].match(/\{[^{}]*\}/g) || []; if (objs.length < 3) continue;
    const text = (o) => { const x = o.match(/["']?(?:t|text|label)["']?\s*:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`([^`]*)`)/); return x ? (x[1] || x[2] || x[3] || '') : null; };
    const T = objs.map(text); if (T.some((x) => x === null)) continue;
    const R = objs.map((o) => /["']?(?:ok|correct|good)["']?\s*:\s*(?:true|1)\b/.test(o)); if (R.filter(Boolean).length !== 1) continue;
    const L = T.map((x) => x.length), g = L[R.indexOf(true)], others = L.filter((_, i) => !R[i]);
    n++; if (g > Math.max(...others)) longest++; ratio += g / (others.reduce((a, b) => a + b) / others.length);
  }
  if (n >= 5) rows.push([f, n, Math.round(100 * longest / n), +(ratio / n).toFixed(2)]);
}
rows.sort((a, b) => b[2] - a[2]);
for (const r of rows) console.log(r[0].padEnd(28), String(r[1]).padStart(4), 'lists   right is longest', String(r[2]).padStart(3) + '%   length right/wrong', r[3]);
