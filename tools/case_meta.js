/* What the game needs to know about every shift before any of them is loaded: titles, cards, the cold open, staff,
   and each patient's name, room and look (for the shift picker's portraits). build.py ships this as JSON; the full
   case (and its stories) is parsed the first time a shift is opened. Usage: node tools/case_meta.js > meta.json */
const fs = require('fs'), vm = require('vm'), path = require('path');
const SRC = path.join(__dirname, '..', 'src');
const win = { Shift: {} };
const ctx = vm.createContext({ window: win, console, localStorage: { getItem() { return null; }, setItem() {} }, navigator: {}, location: { href: '' } });
for (const f of ['engine.js', 'story.js']) vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), ctx, { filename: f });
for (const f of fs.readdirSync(SRC).filter((x) => /^case-.*\.js$/.test(x)).sort()) vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), ctx, { filename: f });
const KEEP = new Set(['hero', 'intro', 'sysLabels', 'staff']);   // small objects the picker, report and chrome read
const PT = new Set(['id', 'room', 'name', 'short', 'age', 'sex', 'arrives', 'dx', 'provider', 'arriveAs', 'from']);   // patient fields the picker and chrome read
const plain = (v) => ['string', 'number', 'boolean'].includes(typeof v);
const out = {};
for (const [id, c] of Object.entries(win.Shift.engine.cases).sort()) {
  const m = {};
  for (const [k, v] of Object.entries(c)) if (plain(v) || KEEP.has(k)) m[k] = JSON.parse(JSON.stringify(v));
  m.patients = c.patients.map((p) => { const o = {}; for (const [k, v] of Object.entries(p)) if ((plain(v) && PT.has(k)) || k === 'look') o[k] = JSON.parse(JSON.stringify(v)); return o; });
  out[id] = m;
}
process.stdout.write(JSON.stringify(out));
