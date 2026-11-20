"""Psych law setting: with General US on, no California-specific legal term (5150, 5250, Riese, LPS, California)
reaches the screen, whether in report, orders, chips, dialogs, provider replies or the debrief. With California on,
the original wording stays. Checks every string literal in the content, then plays the psych shift.
Usage: python tests/law.py"""
import sys, re, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
TOK = re.compile(r'\b(5150|5250|5585|Riese|LPS)\b|California')
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)
lits = []
for f in ['src/case-psych1.js', 'src/stories/psych1.js', 'src/case-adolpsych1.js', 'src/stories/adolpsych1.js', 'src/flow.js', 'src/case-peds1.js', 'src/stories/peds1.js']:
    src = (ROOT / f).read_text()
    body = src.split('*/', 1)[1] if src.lstrip().startswith('/*') else src   # skip the header comment
    for m in re.finditer(r"'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`", body):
        s = (m.group(1) if m.group(1) is not None else m.group(2)).replace("\\'", "'")
        if TOK.search(s): lits.append(s)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced',law:'general'},seen:{'coach:station':1,'coach:room':1}}))"); pg.reload(); pg.wait_for_timeout(300)
    # The phrases are data (src/law.js); each case that leans on California law lists the rows it uses, and those rows
    # alone must clear every California-specific string in that case and its stories.
    rows = pg.evaluate("Shift.law.TERMS.map(t=>t.id)")
    check(len(rows) == len(set(rows)) and pg.evaluate("Shift.law.TERMS.every(t=>t.ca && typeof t.us==='string')"), f'law rows are well formed ({len(rows)} rows, unique ids)')
    for cid, fs in [('psych-3e-1', ['src/case-psych1.js', 'src/stories/psych1.js']), ('psych-4n-1', ['src/case-adolpsych1.js', 'src/stories/adolpsych1.js']), ('peds-5s-1', ['src/case-peds1.js', 'src/stories/peds1.js'])]:
        L = pg.evaluate(f"(Shift.engine.cases['{cid}'].law||{{}}).terms||null")
        check(bool(L) and all(x in rows for x in L), f'{cid} declares the law rows it uses ({len(L or [])})')
        mine = [x for x in lits if any(x in (ROOT / f).read_text() or x.replace("'", "\\'") in (ROOT / f).read_text() for f in fs)]
        rest = pg.evaluate("([xs, only]) => xs.map(x => Shift.law.general(x, only))", [mine, L or []])
        left = [o for o in rest if TOK.search(o)]
        check(not left, f'{cid}: its own rows cover all {len(mine)} of its California strings' + (f': still "{left[0][:100]}"' if left else ''))
    out = pg.evaluate("(xs)=>xs.map(x=>Shift.ui._law(x))", lits)
    left = [(a, o) for a, o in zip(lits, out) if TOK.search(o)]
    check(len(lits) >= 20 and not left, f'all {len(lits)} California-specific strings rewritten' + (f': still "{left[0][1][:120]}"' if left else ''))
    sample = dict(zip(lits, out))
    for src_s, want in [("He's on a 5150 for danger to self.", '72-hour hold'), ("She's on a 5250.", 'extended certification'), ('LPS conservatorship', 'mental health conservatorship')]:
        hit = next((o for a, o in sample.items() if src_s in a), None)
        check(hit is not None and want in hit, f'reads naturally: "{(hit or "")[:90]}"')
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    seen = []
    def look(tag): txt = pg.evaluate("document.body.innerText"); m = TOK.search(txt); seen.append(tag) if m else None; return m
    H('pick-case', id='psych-3e-1'); H('new')
    if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
    for i in range(5): H('h-go', i=str(i)); look(f'report {i}')
    H('h-done'); look('rank'); H('rank-submit'); H('rank-go'); look('station')
    for pid in ['301', '303', '305', '307', '309']:
        H('goto', pid=pid); look('room ' + pid)
        for tab in ['overview', 'orders', 'mar', 'notes']: H('chart', pid=pid, tab=tab); look(f'chart {pid} {tab}')
        H('close'); H('back')
    H('endask'); H('end-yes'); look('debrief')
    check(not seen, 'no California terms on any screen in General US' + (f' (found on {seen[0]})' if seen else ''))
    pg.evaluate("(()=>{const p=JSON.parse(localStorage.getItem('theshift.profile.v1'));p.settings.law='ca';localStorage.setItem('theshift.profile.v1',JSON.stringify(p))})()"); pg.reload(); pg.wait_for_timeout(300)
    H('pick-case', id='psych-3e-1'); H('new')
    if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
    check('5150' in pg.evaluate("document.body.innerText"), 'California setting keeps the original wording')
    check(not errs, 'no page errors' + (': ' + errs[0][:200] if errs else ''))
    b.close()
print('LAW ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
