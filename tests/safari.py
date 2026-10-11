"""Safari-like refusals don't crash the game: AudioContext resume/suspend reject, the clipboard is blocked, the tab
goes to the background and comes back. None of that may show the crash card; a real error in game code still does."""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
def check(ok, msg): print(('ok   ' if ok else 'FAIL ') + msg); ok or fails.append(msg)
REFUSE = """(()=>{const no=()=>Promise.reject(Object.assign(new Error('The request is not allowed by the user agent'),{name:'NotAllowedError'}));
  const AC=window.AudioContext||window.webkitAudioContext; if(AC){AC.prototype.resume=no;AC.prototype.suspend=no;}
  try{Object.defineProperty(navigator,'clipboard',{value:{writeText:no},configurable:true})}catch(e){}
  document.execCommand=()=>false;})()"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844}); fontroute(pg)
    pg.add_init_script(REFUSE)
    pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({terms:'9999',runs:[],settings:{theme:'light',sound:'on',music:'on',motion:'reduced'},seen:{'coach:station':1,'coach:room':1,tour:1}}))"); pg.reload(); pg.wait_for_timeout(300)
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    oops = lambda: pg.locator('.oops').count() > 0
    pg.click('body'); H('pick-case', id='medsurg-4w-1'); H('new')
    if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
    H('h-done'); H('rank-submit'); H('rank-go'); pg.wait_for_timeout(300)
    for _ in range(3):
        ov = pg.evaluate("Shift.ui._ui.ov")
        if ov == 'crit': H('crit-x')
        elif ov == 'result': H('res-close')
        elif ov: H('close')
    H('goto', pid='412'); H('assess', sys='resp'); pg.wait_for_timeout(400)
    check(not oops(), 'sound with a refused audio resume: no crash card')
    for hidden in (True, False, True, False):
        pg.evaluate(f"Object.defineProperty(document,'hidden',{{value:{str(hidden).lower()},configurable:true}});document.dispatchEvent(new Event('visibilitychange'))"); pg.wait_for_timeout(150)
    check(not oops(), 'backgrounding and returning to the tab: no crash card')
    H('settings'); H('health'); pg.click('[data-act="health-copy"]'); pg.wait_for_timeout(300)
    check(not oops(), 'copy with the clipboard blocked: no crash card')
    check('blocked' in pg.inner_text('body').lower(), 'the copy button says the copy was blocked')
    pg.evaluate("setTimeout(()=>{Promise.reject(new Error('network down'))},0)"); pg.wait_for_timeout(200)
    check(not oops(), 'an unhandled rejected promise: logged, no crash card')
    check(pg.evaluate("!!localStorage.getItem('theshift.lastAsync')"), 'the refusal is saved for the health check')
    H('close'); H('close')
    pg.evaluate("setTimeout(()=>{throw new Error('game bug')},0)"); pg.wait_for_timeout(200)
    check(oops(), 'a real error in game code still shows the crash card')
print('SAFARI ' + ('CLEAN' if not fails else 'FAILED'))
sys.exit(1 if fails else 0)
