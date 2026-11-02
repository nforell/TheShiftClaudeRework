"""Debrief truth: plays every shift several ways and fails if any debrief sentence contradicts the shift's own record
(engine.js checkClaims: case `claims` plus shared lab-value checks). Usage: python tests/debrief_truth.py [case ...]"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from bot import play
from playwright.sync_api import sync_playwright
CASES = [a for a in sys.argv[1:] if not a.startswith('--')] or ['medsurg-4w-1', 'medsurg-4w-2', 'medsurg-4w-3', 'stepdown-6e-1', 'icu-3w-1', 'ed-podb-1', 'ld-2s-1', 'ob-2n-1', 'psych-3e-1', 'psych-4n-1', 'peds-5s-1']
STYLES = ['doer', 'idle', 'random1']
bad = []
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    for c in CASES:
        for sty in STYLES:
            pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
            play(pg, c, sty)
            v = pg.evaluate("(()=>{const s=Shift.ui._state();return Shift.engine.finish(s).violations||[]})()")
            for x in v: bad.append(f"{c} {sty} {x['pid']}: \"{x['text']}\"")
            print(c, sty, len(v), flush=True); pg.close()
    b.close()
for x in bad: print('FAIL debrief says', x)
for e in errs[:10]: print('FAIL js error', e)
print('DEBRIEF TRUTH FAILED' if bad or errs else 'DEBRIEF TRUTH CLEAN', len(bad) + len(errs))
sys.exit(1 if bad or errs else 0)
