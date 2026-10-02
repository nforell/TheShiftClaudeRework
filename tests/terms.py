"""Terms of use: a first visit gets the agreement sheet on the home screen; agreeing saves it and it stays gone;
a new terms version asks again; the menu and the /terms/ page both show the terms."""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri()
fails = []
def check(ok, msg): print(('ok   ' if ok else 'FAIL ') + msg); ok or fails.append(msg)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844}); fontroute(pg)
    pg.goto(GAME); pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(300)
    check(pg.locator('[data-act="terms-ok"]').count() == 1, 'first visit shows the agreement')
    check('NCSBN' in pg.inner_text('.sheet') and '988' in pg.inner_text('.sheet'), 'agreement names NCSBN and 988')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
    check(pg.locator('[data-act="terms-ok"]').count() == 1, 'agreement cannot be dismissed without agreeing')
    pg.click('[data-act="terms-ok"]'); pg.wait_for_timeout(150)
    check(pg.locator('.sheet').count() == 0, 'agreeing closes it')
    v = pg.evaluate("JSON.parse(localStorage.getItem('theshift.profile.v1')).terms")
    check(v == pg.evaluate("Shift.terms.version"), 'agreement saved with the terms version')
    pg.reload(); pg.wait_for_timeout(300)
    check(pg.locator('[data-act="terms-ok"]').count() == 0, 'stays agreed after reload')
    pg.click('.homefoot [data-act="terms"]'); pg.wait_for_timeout(150)
    check(pg.locator('.terms-full').count() == 1 and pg.locator('[data-act="terms-ok"]').count() == 0, 'footer link opens the terms to read')
    pg.evaluate("(()=>{const x=JSON.parse(localStorage.getItem('theshift.profile.v1'));x.terms='2000-01-01';localStorage.setItem('theshift.profile.v1',JSON.stringify(x))})()"); pg.reload(); pg.wait_for_timeout(300)
    check(pg.locator('[data-act="terms-ok"]').count() == 1, 'an older agreement asks again')
    page = (ROOT / 'dist' / 'terms' / 'index.html').read_text()
    check('Limitation of liability' in page and 'NCLEX' in page, '/terms/ page built')
print('TERMS ' + ('CLEAN' if not fails else 'FAILED'))
sys.exit(1 if fails else 0)
