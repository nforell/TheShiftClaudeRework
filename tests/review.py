"""Clinical review: the reviewer pages load for every shift with every scored decision, a review round-trips to the
analytics host with the content version, drafts survive a reload, and the in-game status follows the sign-off
record (awaiting, reviewed, updated since review). Usage: python tests/review.py  (exit 1 on failure)"""
import sys, json, pathlib, mimetypes
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests')); sys.path.insert(0, str(ROOT / 'tools'))
from fonts import fontroute
import decisions as DEC
from playwright.sync_api import sync_playwright

DIST = ROOT / 'dist'; SITE, PH = 'https://play.theshift.test', 'https://ph.theshift.test'
sent, fails = [], []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)
def serve(route):
    path = route.request.url.split(SITE, 1)[1].split('?')[0].split('#')[0]
    f = DIST / path.lstrip('/')
    if f.is_dir() or path.endswith('/'): f = f / 'index.html'
    if not f.exists(): return route.fulfill(status=404, body='')
    route.fulfill(status=200, body=f.read_bytes(), content_type=mimetypes.guess_type(str(f))[0] or 'text/html')
def capture(route):
    sent.extend(json.loads(route.request.post_data or '{}').get('batch', []))
    route.fulfill(status=200, body='{}', headers={'Access-Control-Allow-Origin': '*'})

CF = DEC.case_files()
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    ctx = b.new_context(viewport={'width': 390, 'height': 844})
    ctx.add_init_script(f"window.Shift={{config:{{posthogKey:'phc_test',posthogHost:'{PH}'}}}};")
    ctx.route(SITE + '/**', serve); ctx.route(PH + '/**', capture)
    pg = ctx.new_page(); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(SITE + '/review/'); pg.wait_for_timeout(300)
    check(pg.locator('.shifts .card').count() == len(CF), 'index lists every shift')
    for cid, fs in CF.items():
        pg.goto(SITE + f'/review/{cid}/'); pg.wait_for_timeout(300)
        n = len(DEC.find(fs))
        check(pg.locator('.dec').count() >= n and pg.locator('details.pt').count() >= 4, f'{cid}: all {n} decisions and the patients shown')
        check(not pg.evaluate('document.documentElement.scrollWidth>innerWidth'), f'{cid}: no sideways scroll on a phone')
    # A review, end to end.
    cid = 'psych-3e-1'; pg.goto(SITE + f'/review/{cid}/'); pg.wait_for_timeout(300)
    pg.click('#rv-send'); check('name' in pg.inner_text('#rv-msg'), 'asks for name and credentials first')
    pg.fill('#rv-name', 'Test Reviewer'); pg.fill('#rv-cred', 'RN, BSN')
    pg.locator('.dec').nth(0).locator('button[data-v=ok]').click()
    pg.locator('.dec').nth(1).locator('button[data-v=fix]').click()
    pg.locator('.dec').nth(1).locator('textarea').fill('Should mention C-SSRS screener timing')
    pg.reload(); pg.wait_for_timeout(300)
    check(pg.locator('.dec').nth(1).locator('button[data-v=fix]').get_attribute('aria-pressed') == 'true' and pg.input_value('#rv-name') == 'Test Reviewer', 'draft survives a reload')
    check('2 of' in pg.inner_text('#count'), 'progress counts marked items')
    pg.check('#rv-ok'); pg.click('#rv-send'); pg.wait_for_timeout(700)
    rv = next((e for e in sent if e['event'] == 'feedback' and e['properties'].get('kind') == 'clinical_review'), None)
    hashes = pg.evaluate('Shift.reviewHashes')
    check(bool(rv) and rv['properties']['case'] == cid and rv['properties']['content_hash'] == hashes[cid], 'review sent with the shift and its content version')
    check(bool(rv) and rv['properties']['signoff'] is True and 'C-SSRS' in rv['properties']['flagged'], 'review carries the sign-off and flagged notes')
    # In-game status follows the sign-off record.
    g = ctx.new_page(); fontroute(g); g.on('pageerror', lambda e: errs.append(str(e))); g.goto(SITE + '/play/'); g.wait_for_timeout(300)
    H = lambda a, **kw: g.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    check(g.evaluate("Shift.review.status('psych-3e-1').state") == 'awaiting', 'unreviewed shift shows awaiting review')
    g.evaluate("Shift.review.CASES['psych-3e-1'].reviewers=[{name:'A',credentials:'RN'}];Shift.review.CASES['psych-3e-1'].hash=Shift.reviewHashes['psych-3e-1']")
    check(g.evaluate("Shift.review.status('psych-3e-1').state") == 'reviewed', 'signed off on this version shows reviewed')
    g.evaluate("Shift.review.CASES['psych-3e-1'].hash='0000000000'")
    check(g.evaluate("Shift.review.status('psych-3e-1').state") == 'changed', 'content changed after sign-off shows updated since review')
    H('review'); g.wait_for_timeout(150)
    check(g.locator('.rv-row:not(.rv-pk)').count() == len(CF) and g.locator('.rv-go:not(.rv-pgo)').count() == len(CF), 'in-game sheet lists every shift with a review link')
    check(len(set(hashes.values())) == len(CF), 'each shift has its own content hash')
    check(not errs, 'no page errors' + (': ' + errs[0][:200] if errs else ''))
    b.close()
print('REVIEW ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
