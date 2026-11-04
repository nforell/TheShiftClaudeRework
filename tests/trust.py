"""Trust and reliability fixes from the November audit (Days on 4 West played as a new student at 390px):
- clinical review covers drills and NCLEX practice item by item: pages, honest status in the game, a sign-off tool
  that only records the version a reviewer saw, and no claim that unreviewed content was reviewed;
- keyboard focus stays inside an open dialog;
- the orientation's report-line markers aren't drawn as the logo;
- on a phone, the Next card lands in the room with the first assessment rows in view;
- Mrs. Whitfield's bladder scan agrees with her urine output, and her first conversation isn't a two-option gimme;
- reorder arrows say where a patient goes.
Usage: python tests/trust.py"""
import sys, json, re, pathlib, subprocess, tempfile, shutil
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)
PROF = "localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],terms:'9999',settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:%s}))"

# ---- practice review: the generated items, the pages, the sign-off tool ----
RI = json.loads(subprocess.run(['node', str(ROOT / 'tools' / 'review_items.js')], capture_output=True, check=True).stdout)['packs']
items = [i for p in RI for i in p['items']]
check(len(items) == len({i['id'] for i in items}), f'every practice item has its own id ({len(items)} items)')
check(sum(i['id'].startswith('drill:') for i in items) >= 128, 'every drill card is in a review pack')
check(all(len(p['items']) <= 30 for p in RI), 'no review pack is longer than 30 items')
check(all(re.fullmatch(r'[0-9a-f]{10}', i['hash']) for i in items), 'every item has a version fingerprint')
check(not any(re.search(r'undefined|\[object |\["', '\n'.join(i['body'])) for i in items), 'no item prints undefined or raw data')
check(all(any(l.startswith('✓') or re.match(r'\d+\. ', l) or l.startswith('Answer:') or (l.startswith('- ') and ' → ' in l) for l in i['body']) for i in items), 'every item shows its key')
for p in RI:
    f = ROOT / 'dist' / 'review' / 'practice' / p['id'] / 'index.html'
    if not f.exists(): check(False, f'review page for {p["id"]}'); break
else: check(True, f'a review page for each of the {len(RI)} packs')
check((ROOT / 'dist' / 'review' / 'practice' / 'index.html').exists(), '/review/practice/ lists the packs')
check('/review/practice/' in (ROOT / 'dist' / 'review' / 'index.html').read_text(), 'the shift review index links to practice review')

tmp = pathlib.Path(tempfile.mkdtemp()); reg = tmp / 'reg.json'; shutil.copy(ROOT / 'src' / 'review-items.json', reg)
a, b, c = items[0], items[1], items[2]
(tmp / 'sub.txt').write_text(f"[ACCURATE] {a['id']} (version {a['hash']})\n[ACCURATE] {b['id']} (version 0000000000)\n[NEEDS CHANGE] {c['id']} (version {c['hash']})\n  → wrong dose\n")
out = subprocess.run(['node', str(ROOT / 'tools' / 'record_review.js'), '--reviewer', 'Test Reviewer, RN', '--date', '2026-11-03', '--registry', str(reg), str(tmp / 'sub.txt')], capture_output=True, text=True).stdout
R = json.loads(reg.read_text())['items']
check(list(R) == [a['id']] and R[a['id']]['hash'] == a['hash'], 'the sign-off tool records an Accurate item at the version the reviewer saw')
check(b['id'] not in R and 'Changed since the reviewer saw it' in out, 'an item reviewed at an older version is not recorded, and is listed')
check(c['id'] not in R and 'wrong dose' in out, 'an item marked Needs change is not recorded, and its note is listed')
shutil.rmtree(tmp)

with sync_playwright() as p:
    br = p.chromium.launch(); errs = []
    # ---- the review page works: verdicts count, copy-as-text carries each item's version ----
    pg = br.new_page(viewport={'width': 390, 'height': 844}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    pg.goto((ROOT / 'dist' / 'review' / 'practice' / 'drill-med-1' / 'index.html').as_uri()); pg.wait_for_timeout(200)
    pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(200)
    pg.click('.verdict button[data-v=ok]'); pg.locator('.verdict button[data-v=fix]').nth(1).click(); pg.keyboard.type('Check this')
    check(pg.inner_text('#count').startswith('2 of '), 'review page: verdicts are counted')
    pg.fill('#rv-name', 'Test'); pg.fill('#rv-cred', 'RN'); pg.click('#rv-copy'); txt = pg.inner_text('#rv-text')
    first = RI[0]['items'][0]
    check(f"[ACCURATE] {first['id']} (version {first['hash']})" in txt and 'Check this' in txt, 'review page: the copied review names each item and its version')
    check(pg.evaluate('document.documentElement.scrollWidth') <= 390, 'review page: no sideways scroll at 390px')
    pg.close()

    # ---- the game: honest status, no "reviewed" claim for unreviewed practice ----
    pg = br.new_page(viewport={'width': 390, 'height': 844}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    pg.goto(GAME); pg.evaluate(PROF % "{orient:1,'coach:station':1,'coach:room':1,tour:1}"); pg.reload(); pg.wait_for_timeout(300)
    H('review'); pg.wait_for_timeout(150); sheet = pg.evaluate("(document.querySelector('[role=dialog]')||{}).innerText||''")
    check(all(x in sheet for x in ('Drills', 'NCLEX question bank', 'NCLEX case studies')) and 'Awaiting clinical review' in sheet, 'Clinical review sheet lists the practice content as awaiting review')
    H('close'); H('practice'); pg.wait_for_timeout(200)
    body = pg.inner_text('#app')
    check('reviewed for accuracy' not in body and 'Not yet checked by a clinical reviewer' in body, 'NCLEX practice no longer claims it was reviewed')

    # ---- focus stays inside an open dialog ----
    H('home'); H('review'); pg.wait_for_timeout(150)
    inside = []
    for k in range(25): pg.keyboard.press('Tab'); inside.append(pg.evaluate("!!document.activeElement.closest('[role=dialog]')"))
    for k in range(5): pg.keyboard.press('Shift+Tab'); inside.append(pg.evaluate("!!document.activeElement.closest('[role=dialog]')"))
    check(all(inside), 'Tab and Shift+Tab stay inside an open dialog')
    H('close')

    # ---- orientation markers aren't drawn as the logo ----
    pg.evaluate(PROF % '{}'); pg.reload(); pg.wait_for_timeout(300)
    H('pick-case', id='medsurg-4w-1'); H('new'); pg.wait_for_timeout(200); H('or', do='next'); pg.wait_for_timeout(200)
    mk = pg.evaluate("(()=>{const m=document.querySelector('.or-line .or-mk');if(!m)return null;const r=m.getBoundingClientRect(),cs=getComputedStyle(m);return [Math.round(r.width),Math.round(r.height),cs.backgroundColor]})()")
    check(bool(mk) and mk[0] <= 20 and mk[1] <= 20 and mk[2] in ('rgba(0, 0, 0, 0)', 'transparent'), f'orientation: an unflagged report line has a small empty marker ({mk})')
    trapped = []
    for k in range(20): pg.keyboard.press('Tab'); trapped.append(pg.evaluate("!!document.activeElement.closest('.orient')"))
    check(all(trapped), 'orientation: Tab stays inside the walkthrough')
    H('or', do='skip'); pg.wait_for_timeout(200)

    # ---- the first shift: arrows, the Next card on a phone, Whitfield ----
    pg.evaluate(PROF % "{orient:1,'coach:station':1,'coach:room':1,tour:1}"); pg.reload(); pg.wait_for_timeout(300)
    H('pick-case', id='medsurg-4w-1'); H('new')
    if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
    H('h-done'); pg.wait_for_timeout(200)
    labels = pg.evaluate("[...document.querySelectorAll('[data-act=rk]')].map(b=>b.getAttribute('aria-label'))")
    check(labels and not any(re.search(r'up to 0|down to 5', l) for l in labels) and 'already first' in labels[0], f'reorder arrows say where the patient goes ({labels[:2]})')
    H('rank-submit'); H('rank-go')
    if pg.evaluate("Shift.ui._ui.ov"): H('close')
    pg.wait_for_timeout(200); pg.click('[data-act=do-next]'); pg.wait_for_timeout(500)
    vis = pg.evaluate("(()=>{const pin=Math.max(...[...document.querySelectorAll('.top,.pstrip,.rail')].map(e=>e.getBoundingClientRect().bottom));return [...document.querySelectorAll('.pane .fs-row')].filter(r=>{const b=r.getBoundingClientRect();return b.top>=pin-2&&b.bottom<=innerHeight}).map(r=>r.dataset.sys)})()")
    check('vitals' in vis, f'phone: the Next card lands with vital signs in view below the pinned tabs ({vis})')

    s = pg.evaluate("(()=>{const S=Shift.ui._state();const c=Shift.engine.getCase(S.caseId);const d=c.patients.find(x=>x.id==='416');return Object.keys(d)})()")
    H('goto', pid='416'); pg.wait_for_timeout(200); H('dock', id='assess'); H('assess', sys='gi'); pg.wait_for_timeout(200)
    gi = pg.evaluate("(()=>{const S=Shift.ui._state();const l=S.log.filter(x=>/Bladder scan/.test(x.text)).pop();return l?[l.text,S.t]:null})()")
    ok_gi = False
    if gi:
        m = re.search(r'Bladder scan shows (\d+) mL.*?about (\d+) mL/h', gi[0])
        if m:
            done_t = gi[1] - 3; made = int(m.group(1)) / ((120 + done_t) / 60)
            ok_gi = abs(made - int(m.group(2))) <= 6 and int(m.group(2)) < 29
    check(ok_gi, f'416: bladder scan volume agrees with the urine output it reports ({gi and gi[0][:120]})')
    if pg.evaluate("Shift.ui._ui.ov"): H('close')
    H('talk'); pg.wait_for_timeout(250)
    opts = pg.evaluate("[...document.querySelectorAll('.cv-reply')].map(b=>b.innerText.trim())")
    check(len(opts) >= 4 and not opts[0].startswith("It's Wednesday"), f'416: her first conversation offers four replies and the best one isn\'t always first ({len(opts)})')
    pg.close(); br.close()
    check(not errs, f'no page errors {errs[:3]}')

print('TRUST ' + ('CLEAN' if not fails else f'FAILED {len(fails)}'))
for f in fails: print('::error title=trust.py::' + f)
sys.exit(1 if fails else 0)
