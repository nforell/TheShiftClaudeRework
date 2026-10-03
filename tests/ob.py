"""Days on 2 North (mother-baby): plays the shift twice. A careful nurse should get every patient to a good outcome;
a nurse who only skips ahead should see every emergency play out. Usage: python tests/ob.py"""
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
        pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced',feedback:'debrief'},seen:{'coach:station':1,'coach:room':1,tour:1}}))"); pg.reload(); pg.wait_for_timeout(300)
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
        def give(pid, mid, dose=None):
            go(pid); H('med', id=mid)
            if dose is not None: H('dose', v=str(dose))
            H('med-give'); close()
        def hold(pid, mid):
            go(pid); H('med', id=mid); H('med-holdask'); H('hreason', v='1'); H('med-hold'); close()
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

        def fam(pid, *choices):
            go(pid); H('family')
            for c in choices:
                if pg.evaluate("Shift.ui._ui.ov") != 'dialog': break
                H('dlg', i=str(c))
            close()

        H('pick-case', id='ob-2n-1'); H('new')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        H('h-done')
        if run == 'careful':
            pg.evaluate("Shift.ui._ui.rank=['214','212','216','218']"); H('rank-submit'); H('rank-go')
            check(judg('rank-first') == 2, 'ranking Ms. Kealoha first scores best')
            H('deleg', t='glucose', pid='216'); close()
            act('214', 'mgcheck'); go('214'); H('assess', sys='gi'); close()
            r = sbar('214', ['uo', 'cr', 'dtr', 'mg'], 'mg'); check('1 gram' in r or 'down' in r.lower(), 'the magnesium call gets a lower rate'); give('214', '214-mag', 2)
            fam('216', 0); print('  216 at', st('s.t'), st("s.p['216'].checkVals")); give('216', '216-gel', 1); act('216', 'skin'); act('216', 'feed')
            act('212', 'fundus'); act('212', 'bladder'); act('212', 'qbl'); act('212', 'fundus')
            if st("s.p['212'].tone") > .45: act('212', 'massage')
            give('212', '212-meth'); r = sbar('212', ['fundus', 'qbl', 'vs', 'bladder', 'asthma'], 'pph'); check('Hemabate' in r, 'the hemorrhage call names the asthma')
            give('212', '212-txa'); give('212', '212-oxy', 1); hold('212', '212-carbo'); act('212', 'ivs')
            print('  after 212 at', st('s.t'))
            act('218', 'epds'); talk('218', 0, 0, 0)
            r = sbar('218', ['epds', 'item10', 'si', 'hx', 'dc'], 'psych'); check('psychiatry' in r.lower(), 'the screen call gets psychiatry'); act('218', 'safety')
            print('  after 218 at', st('s.t'))
            go('214'); H('assess', sys='neuro'); close(); act('214', 'bp'); give('214', '214-lab'); print('  bp med at', st("s.p['214'].firstBpMed"), 'sev', st("s.p['214'].sevAt"))
            sbar('214', ['bp', 'dtr', 'uo'], 'bp'); act('214', 'bpre')
            until(64); act('216', 'glu'); act('216', 'donor'); act('218', 'itm'); give('212', '212-ibu'); give('218', '218-ibu'); act('214', 'mgcheck'); act('214', 'reassess'); act('212', 'reassess')
            talk('214', 0); fam('214', 0); talk('212', 0)
            print('  216 glucoses:', st("s.p['216'].checkVals"), 'temp', st("s.p['216'].temp"), 't', st('s.t'))
            act('214', 'mgcheck')
            until(118); give('216', '216-hepb', 1); give('218', '218-rhig', 1); act('216', 'glu'); act('212', 'fundus')
            until(176); act('218', 'itm'); act('214', 'mgcheck'); act('212', 'qbl'); act('216', 'glu')
            until(240); act('214', 'mgcheck'); act('212', 'fundus')
            print('  state:', st("[s.p['212'].qbl|0, s.p['212'].tone.toFixed(2), s.p['214'].mg.toFixed(2), s.p['214'].uo.toFixed(1), s.p['216'].glu.toFixed(1)]"))
        else:
            H('rank-submit'); H('rank-go')
        until(300)
        if not st('s.ended'): H('endask'); H('end-yes')
        close()
        out = pg.evaluate("(()=>{const s=Shift.ui._state();const d=Shift.engine.debrief(s);return {score:d.overall,o:Object.fromEntries(d.outcomes.map(o=>[o.id,[o.tone,o.title]])),steps:Shift.cjmm.score(d.judg).map(x=>[x.id,x.score])}})()")
        print(run, out['score'], out['o'])
        if run == 'careful':
            print('  misses:', pg.evaluate("Shift.ui._state().judg.filter(j=>j.delta<=0).map(j=>j.key+' '+j.delta+' '+j.text)"))
            for pid in ['212', '214', '216', '218']:
                check(out['o'][pid][0] == 'good', f'careful: {pid} has a good outcome ({out["o"][pid][1]})')
            check(out['score'] >= 85, f'careful: overall score is high ({out["score"]})')
            ev = dict(out['steps']).get('eval')
            check(ev is not None and ev >= 70, f'careful: Evaluate outcomes is scored ({ev})')
        else:
            for pid, word in (('212', 'L&D'), ('214', 'Magnesium'), ('216', 'seizure'), ('218', 'never')):
                check(out['o'][pid][0] == 'bad' and word in out['o'][pid][1], f'skipper: {pid} goes badly ({out["o"][pid][1]})')
            check(out['score'] <= 40, f'skipper: overall score is low ({out["score"]})')
        pg.close()
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('MOTHER-BABY ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
