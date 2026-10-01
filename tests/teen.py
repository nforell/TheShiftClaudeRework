"""Evenings on 4 North (adolescent psych): plays the shift twice. A careful nurse should get every patient to a good outcome;
a nurse who only skips ahead should see every emergency play out. Checks outcomes, key scoring and the NCLEX
Evaluate step, and that nothing throws. Usage: python tests/teen.py   (exit 1 on any failure)"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)

with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    def start():
        pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced',feedback:'debrief'},seen:{'coach:station':1,'coach:room':1}}))"); pg.reload(); pg.wait_for_timeout(300)
        return pg
    for run in ('careful', 'skipper'):
        pg = start()
        H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
        st = lambda e: pg.evaluate("(()=>{const s=Shift.ui._state();return " + e + "})()")
        def close():
            for _ in range(4):
                ov = pg.evaluate("Shift.ui._ui.ov")
                if ov == 'crit': H('crit-x')
                elif ov == 'result': H('res-close')
                elif ov: H('close')
                else: break
        def go(pid): close(); H('goto', pid=pid); close()
        def act(pid, iid): go(pid); H('int', id=iid); close()
        def talk(pid, *choices):
            go(pid); H('talk')
            for c in choices:
                if pg.evaluate("Shift.ui._ui.ov") != 'dialog': break
                H('dlg', i=str(c))
            close()
        def sbar(pid, picks, req):
            close(); H('sbar', pid=pid)
            for k in picks: H('sbar-pick', id=k)
            H('sbar-req', id=req); H('sbar-send'); r = pg.evaluate("Shift.ui._ui.sbar && Shift.ui._ui.sbar.reply"); close(); return r or ''
        def give(pid, mid): go(pid); H('med', id=mid); H('med-give'); close()
        def reply(label):
            r = pg.evaluate("(l)=>{const s=Shift.ui._state();for(const m of s.inbox){if(!m.replies||m.done)continue;const i=m.replies.findIndex(x=>x.label.indexOf(l)>=0);if(i>=0)return [m.id,i]}return null}", label)
            if r: H('reply', m=str(r[0]), i=str(r[1])); close()
            return bool(r)
        def until(t):
            for _ in range(40):
                if st('s.ended') or st('s.t') >= t: break
                close(); H('back'); close(); H('skip'); pg.wait_for_timeout(30)
            close()
        judg = lambda key: st(f"(s.judg.find(j=>j.key==='{key}')||{{}}).delta")

        H('pick-case', id='psych-4n-1'); H('new')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        H('h-done')
        if run == 'careful':
            pg.evaluate("Shift.ui._ui.rank=['405','403','401','407']"); H('rank-submit'); H('rank-go')
            check(judg('rank-first') == 2, 'ranking Marcus first scores best')
            act('405', 'postim')
            talk('403', 0); act('403', 'skin'); act('403', 'wound')
            until(40)
            check(st("s.p['405'].dys") > 0, 'Marcus develops dystonia after his first haloperidol')
            talk('405', 0); act('405', 'airway'); give('405', '405-dph')
            until(46); act('409', 'admit'); talk('409', 0); sbar('409', ['admits', 'bottle', 'ruq', 'nolevel'], 'tox')
            act('405', 'reassess'); sbar('405', ['dys', 'halo', 'dph', 'better'], 'eps')
            act('403', 'search'); act('403', 'one'); sbar('403', ['cuts', 'shard', 'call'], 'obs')
            reply('safety update')
            until(60); act('401', 'labs'); act('401', 'ortho'); sbar('401', ['labs', 'trend', 'hr', 'edema'], 'replace'); give('401', '401-repl')
            until(st("s.p['409'].labsAt") + 36); r = sbar('409', ['results', 'admits'], 'tox')
            check('N-acetylcysteine' in r, 'calling back with Eli\'s results gets the antidote')
            act('401', 'redirect'); talk('401', 0)
            talk('407', 0, 0); act('407', 'cps'); sbar('407', ['disc', 'cps', 'visit'], 'restrict')
            until(120); reply('Tasha, sit with her'); give('401', '401-kphos'); reply('safety update')
            act('407', 'checkback'); act('403', 'plan')
            until(st("s.p['401'].recheckAt") + 1); act('401', 'recheck')
            reply('privately'); reply('safety update')
        else:
            H('rank-submit'); H('rank-go')
        until(300)
        if not st('s.ended'): H('endask'); H('end-yes')
        close()
        out = pg.evaluate("(()=>{const s=Shift.ui._state();const d=Shift.engine.debrief(s);return {score:d.overall,o:Object.fromEntries(d.outcomes.map(o=>[o.id,[o.tone,o.title]])),steps:Shift.cjmm.score(d.judg).map(x=>[x.id,x.score])}})()")
        print(run, out['score'], out['o'])
        if run == 'careful': print('  misses:', pg.evaluate("Shift.ui._state().judg.filter(j=>j.delta<=0).map(j=>j.key+' '+j.delta+' '+j.text)")); print('  domains:', pg.evaluate("Shift.engine.debrief(Shift.ui._state()).dom.map(d=>d.id+':'+d.score)"))
        if run == 'careful':
            for pid in ['401', '403', '405', '407', '409']:
                check(out['o'][pid][0] == 'good', f'careful: {pid} has a good outcome ({out["o"][pid][1]})')
            check(out['score'] >= 85, f'careful: overall score is high ({out["score"]})')
            ev = dict(out['steps']).get('eval')
            check(ev is not None and ev >= 80, f'careful: Evaluate outcomes is scored and strong ({ev})')
        else:
            check(out['o']['405'][0] == 'bad' and 'airway' in out['o']['405'][1], 'skipper: Marcus\'s dystonia reaches his airway')
            check(out['o']['403'][0] == 'bad', 'skipper: Jordan self-harms again')
            check(out['o']['407'][0] == 'bad', 'skipper: Kayla\'s visitor gets in')
            check(out['o']['409'][0] == 'bad', 'skipper: Eli\'s overdose is missed')
            check(out['o']['401'][0] == 'bad', 'skipper: Ella\'s refeeding syndrome progresses')
            check(out['score'] <= 40, f'skipper: overall score is low ({out["score"]})')
        pg.close()
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('TEEN ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
