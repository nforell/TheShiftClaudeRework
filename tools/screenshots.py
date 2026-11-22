"""Landing-page screenshots (site/assets/*.jpg) from the current build, so the marketing page always shows the real game.
Usage: python3 build.py && python3 tools/screenshots.py && python3 build.py"""
import sys, pathlib, io
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
from PIL import Image
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); OUT = ROOT / 'site' / 'assets'
PROF = "localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1,'coach:room':1,'tour':1}}))"
def save(pg, name):
    png = pg.screenshot(); Image.open(io.BytesIO(png)).convert('RGB').resize((1600, 1000), Image.LANCZOS).save(OUT / name, quality=84, optimize=True); print('wrote', name)
with sync_playwright() as p:
    b = p.chromium.launch()
    def start(case):
        pg = b.new_page(viewport={'width': 1280, 'height': 800}, device_scale_factor=1.25); fontroute(pg); pg.goto(GAME); pg.evaluate(PROF); pg.reload(); pg.wait_for_timeout(300)
        H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
        H('pick-case', id=case); H('new')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        return pg, H
    def close(pg, H):
        for _ in range(4):
            ov = pg.evaluate("Shift.ui._ui.ov")
            if ov == 'crit': H('crit-x')
            elif ov == 'result': H('res-close')
            elif ov: H('close')
            else: break
    # Report, with a few lines flagged onto the brain sheet.
    pg, H = start('medsurg-4w-1')
    for k in ('412:2', '412:3', '412:4'): H('flag', k=k)
    H('h-go', i='1'); H('flag', k='414:1'); H('flag', k='414:2'); H('h-go', i='0'); pg.wait_for_timeout(600); save(pg, 'report.jpg')
    # Ranking.
    H('h-done'); pg.evaluate("Shift.ui._ui.rank=['416','412','418','414']"); pg.wait_for_timeout(400); save(pg, 'triage.jpg')
    H('rank-submit'); H('rank-go'); close(pg, H)
    # A room, after vitals.
    pg.evaluate("Shift.ui._ui.toasts=[]"); H('goto', pid='412'); H('assess', sys='vitals'); close(pg, H); pg.evaluate("Shift.ui._ui.toasts=[]"); H('dock', id='assess'); pg.wait_for_timeout(900); save(pg, 'room.jpg'); pg.close()
    # Psych room.
    pg, H = start('psych-3e-1'); H('h-done'); H('rank-submit'); H('rank-go'); close(pg, H)
    pid = pg.evaluate("Shift.ui._state().answers.rank[0]"); pg.evaluate("Shift.ui._ui.toasts=[]"); H('goto', pid=pid); H('dock', id='talk'); pg.wait_for_timeout(900); save(pg, 'psych.jpg'); pg.close()
    # Debrief from a careful teen-psych run (same path as tests/teen.py).
    pg, H = start('psych-4n-1')
    st = lambda e: pg.evaluate("(()=>{const s=Shift.ui._state();return " + e + "})()")
    def go(pid): close(pg, H); H('goto', pid=pid); close(pg, H)
    def act(pid, iid): go(pid); H('int', id=iid); close(pg, H)
    def talk(pid, *ch):
        go(pid); H('talk')
        for c in ch:
            if pg.evaluate("Shift.ui._ui.ov") != 'dialog': break
            H('dlg', i=str(c))
        close(pg, H)
    def sbar(pid, picks, req):
        close(pg, H); H('sbar', pid=pid)
        for k in picks: H('sbar-pick', id=k)
        H('sbar-req', id=req); H('sbar-send'); close(pg, H)
    def give(pid, mid): go(pid); H('med', id=mid); H('med-give'); close(pg, H)
    def reply(label):
        r = pg.evaluate("(l)=>{const s=Shift.ui._state();for(const m of s.inbox){if(!m.replies||m.done)continue;const i=m.replies.findIndex(x=>x.label.indexOf(l)>=0);if(i>=0)return [m.id,i]}return null}", label)
        if r: H('reply', m=str(r[0]), i=str(r[1])); close(pg, H)
    def until(t):
        for _ in range(40):
            if st('s.ended') or st('s.t') >= t: break
            close(pg, H); H('back'); close(pg, H); H('skip'); pg.wait_for_timeout(20)
        close(pg, H)
    H('h-done'); pg.evaluate("Shift.ui._ui.rank=['405','403','401','407']"); H('rank-submit'); H('rank-go')
    act('405', 'postim'); talk('403', 0); act('403', 'skin'); act('403', 'wound'); until(40)
    talk('405', 0); act('405', 'airway'); give('405', '405-dph')
    until(46); act('409', 'admit'); talk('409', 0); sbar('409', ['admits', 'bottle', 'ruq', 'nolevel'], 'tox')
    act('405', 'reassess'); sbar('405', ['dys', 'halo', 'dph', 'better'], 'eps')
    act('403', 'search'); act('403', 'one'); sbar('403', ['cuts', 'shard', 'call'], 'obs'); reply('safety update')
    until(60); act('401', 'labs'); act('401', 'ortho'); sbar('401', ['labs', 'trend', 'hr', 'edema'], 'replace'); give('401', '401-repl')
    until(st("s.p['409'].labsAt") + 36); sbar('409', ['results', 'admits'], 'tox')
    act('401', 'redirect'); talk('401', 0); talk('407', 0, 0); act('407', 'cps'); sbar('407', ['disc', 'cps', 'visit'], 'restrict')
    until(120); reply('Tasha, sit with her'); give('401', '401-kphos'); reply('safety update')
    act('407', 'checkback'); act('403', 'plan'); until(st("s.p['401'].recheckAt") + 1); act('401', 'recheck'); reply('privately'); reply('safety update')
    until(300)
    if not st('s.ended'): H('endask'); H('end-yes')
    close(pg, H); pg.wait_for_timeout(4500); pg.evaluate("scrollTo(0,0)"); save(pg, 'debrief.jpg')
    # Drills: one card each, mid-decision, at a column width that fills the frame.
    def drill(kind, cid, steps, name, y=0, phone=False):
        pg = b.new_page(viewport={'width': 390, 'height': 780} if phone else {'width': 800, 'height': 500}, device_scale_factor=2 if phone else 2); fontroute(pg); pg.goto(GAME); pg.evaluate(PROF.replace("seen:{", "terms:'9999',seen:{")); pg.reload(); pg.wait_for_timeout(300)
        pg.evaluate(f"Shift.drill.start('{kind}', [{{kind:'{kind}', id:'{cid}'}}]); Shift.ui._render(true)"); pg.wait_for_timeout(250)
        for a, i in steps:
            pg.evaluate("([a,i])=>Shift.ui._handlers[a]({dataset:{i:String(i)}})", [a, i]); pg.wait_for_timeout(120)
        pg.wait_for_timeout(900); pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(300)
        if phone: Image.open(io.BytesIO(pg.screenshot())).convert('RGB').save(OUT / name, quality=84, optimize=True); print('wrote', name)
        else: save(pg, name)
        pg.close()
    # Home: the front door a new player sees (quick round beside full shifts, the four skills below).
    pg = b.new_page(viewport={'width': 960, 'height': 600}, device_scale_factor=2); fontroute(pg); pg.goto(GAME); pg.evaluate(PROF.replace("seen:{", "terms:'9999',seen:{")); pg.reload(); pg.wait_for_timeout(900); save(pg, 'home.jpg'); pg.close()
    # A finished quick round: right and wrong answers, each with what happened (the same fixed deck every time).
    pg = b.new_page(viewport={'width': 800, 'height': 500}, device_scale_factor=2); fontroute(pg); pg.goto(GAME); pg.evaluate(PROF.replace("seen:{", "terms:'9999',seen:{")); pg.reload(); pg.wait_for_timeout(300)
    pg.evaluate("Shift.drill.start('mix', [{kind:'first',id:'wf-sepsis'},{kind:'med',id:'mp-metoprolol'},{kind:'sbar',id:'sb-sepsis'},{kind:'calm',id:'de-ed-wait'}]); Shift.ui._render(true)")
    # Right on every step but the second card's: a realistic first round, one miss to learn from.
    BEST = """(()=>{const r=Shift.ui._ui.dr,c=r.deck[r.i],k=Shift.drillData[c.kind].find(x=>x.id===c.id),s=r.c,wrong=r.i===1;
      const pick=(arr,good)=>{const i=arr.findIndex(good);return wrong?arr.findIndex((o,j)=>j!==i):i};
      if(c.kind==='med')return s.stage==='check'?['dr-check',pick(k.check,o=>o.ok)]:['dr-pick',pick(k.pick,o=>o.ok)];
      if(c.kind==='first')return ['dr-pick',pick(k.pts,o=>o.ok)];
      if(c.kind==='sbar')return ['dr-say',k.steps[s.step].o.findIndex(o=>o.ok)];
      const t=k.turns[s.turn].o.map(o=>o.d);return ['dr-calm',t.indexOf(Math.min(...t))]})()"""
    for k in range(80):
        if pg.evaluate("Shift.ui._ui.dr.done"): break
        n = pg.locator('[data-act="dr-next"]:visible, [data-act="dr-fix"]:visible')
        if n.count(): n.first.click(); pg.wait_for_timeout(150); continue
        a, i = pg.evaluate(BEST)
        pg.evaluate("([a,i])=>Shift.ui._handlers[a]({dataset:{i:String(i)}})", [a, i]); pg.wait_for_timeout(150)
    pg.wait_for_timeout(1400); pg.evaluate("scrollTo(0,250)"); pg.wait_for_timeout(300); save(pg, 'round.jpg'); pg.close()
    q = b.new_page(); q.goto(GAME); idx = lambda js: q.evaluate(js)
    mi = idx("(()=>{const k=Shift.drillData.med.find(c=>c.id==='mp-metoprolol');return k.check.findIndex(o=>o.ok)})()")
    drill('med', 'mp-metoprolol', [('dr-check', mi)], 'drill-med.jpg')
    fi = idx("(()=>{const k=Shift.drillData.first.find(c=>c.id==='wf-sepsis');return k.pts.findIndex(o=>o.ok)})()")
    drill('first', 'wf-sepsis', [('dr-pick', fi)], 'drill-first.jpg')
    sb = idx("(()=>{const k=Shift.drillData.sbar.find(c=>c.id==='sb-sepsis');return k.steps.slice(0,2).map(s=>s.o.findIndex(o=>o.ok))})()")
    drill('sbar', 'sb-sepsis', [('dr-say', i) for i in sb], 'drill-sbar.jpg')
    ca = idx("(()=>{const k=Shift.drillData.calm.find(c=>c.id==='de-ed-wait');const t=k.turns[0].o.map(o=>o.d);return t.indexOf(Math.min(...t))})()")
    drill('calm', 'de-ed-wait', [('dr-calm', ca)], 'drill-calm.jpg')
    drill('med', 'mp-metoprolol', [('dr-check', mi)], 'drill-phone.jpg', phone=True)
    q.close()
    b.close()
