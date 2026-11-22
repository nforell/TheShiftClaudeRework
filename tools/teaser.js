/* The landing page's playable card: one Med Pass card from the game, with its patient's look, so the patient on the
   front door is the same reviewed card and the same face as in the drill. build.py ships this as JSON.
   Usage: node tools/teaser.js [card id] > teaser.json */
const fs = require('fs'), vm = require('vm'), path = require('path');
const SRC = path.join(__dirname, '..', 'src');
const ID = process.argv[2] || 'mp-metoprolol';
const win = { Shift: {} };
const ctx = vm.createContext({ window: win, console });
for (const f of ['drills-content.js', 'drill.js']) vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), ctx, { filename: f });
const S = win.Shift, c = S.drillData.med.find((x) => x.id === ID);
if (!c) { process.stderr.write('no Med Pass card ' + ID + '\n'); process.exit(1); }
const keep = ['id', 'p', 'med', 'for', 'line', 'check', 'pick', 'why', 'pearl', 'v', 'good', 'bad', 'goodLine', 'badLine'];
const card = Object.fromEntries(keep.map((k) => [k, c[k]]));
process.stdout.write(JSON.stringify({ card, look: S.drill._lookOf(c.p) }));
