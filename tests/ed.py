"""Evenings in the ED (Pod B): plays the shift twice. A careful nurse should get every patient to a good outcome;
a nurse who only skips ahead should see every emergency play out. Usage: python tests/ed.py"""
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

        H('pick-case', id='ed-podb-1'); H('new')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        H('h-done')
        if run == 'careful':
            pg.evaluate("Shift.ui._ui.rank=['22','21','23']"); H('rank-submit'); H('rank-go')
            check(judg('rank-first') == 2, 'ranking the stroke alert first scores best')
            T=lambda tag: print('   ', tag, st('s.t'))
            fam('22', 0); T('fam'); go('22'); H('assess', sys='neuro'); close(); T('neuro'); give('22', '22-lab'); T('lab'); act('22', 'swallow'); T('swallow'); act('22', 'reassess')
            r = sbar('22', ['lkw', 'nih', 'bp', 'ct'], 'tx'); check('IR' in r or 'thrombectomy' in r.lower(), 'the last-known-well call gets a thrombectomy')
            T('sbar22'); give('21', '21-asa'); T('asa'); talk('21', 0); T('talk21')
            talk('23', 0); T('talk23'); act('23', 'private'); T('priv'); talk('23', 0); T('talk23b')
            print('  t after opening', st('s.t'), 'isch', st("s.p['21'].isch"), 'hemo', st("s.p['23'].hemo"))
            until(40); reply('Yes, now'); act('21', 'ecg'); act('21', 'v4r')
            r = sbar('21', ['stemi', 'v4r', 'pain', 'vs', 'asa'], 'cath'); check('Cath lab' in r or 'cath' in r.lower(), 'the STEMI call activates the cath lab')
            until(71); print('  at 24', st('s.t')); go('24'); act('24', 'flat'); give('24', '24-epi', 1); give('24', '24-ns'); give('24', '24-adj')
            if not st("s.p['21'].gone"): give('21', '21-hep', 1)
            go('23'); H('assess', sys='pain'); close(); go('23'); H('assess', sys='gi'); close()
            r = sbar('23', ['hcg', 'shoulder', 'vs', 'abd'], 'ectopic'); check('OR' in r, 'the ectopic call goes to the OR'); act('23', 'ivs'); give('23', '23-ns'); act('23', 'reassess')
            print('  t after 23', st('s.t'))
            until(84); act('24', 'reassess'); give('24', '24-epi', 1); act('24', 'airway'); print('  24 sev', st("s.p['24'].sev"))
            until(141); talk('24', 0); sbar('24', ['airway', 'vs', 'epi'], 'obs')
            until(152); talk('25', 0); act('25', 'gcs'); fam('25', 0); hold('25', '25-warf')
            until(187); act('25', 'gcs'); print('  25 at', st('s.t'), 'bleed', st("s.p['25'].bleed"), 'declined', st("s.p['25'].declinedAt"))
            if st("s.p['25'].declinedAt") is None:
                until(192); act('25', 'gcs')
            sbar('25', ['ct', 'inr', 'gcs'], 'rev'); give('25', '25-pcc'); give('25', '25-vitk', 1)
            until(230); act('25', 'gcs')
        else:
            H('rank-submit'); H('rank-go')
        until(300)
        if not st('s.ended'): H('endask'); H('end-yes')
        close()
        out = pg.evaluate("(()=>{const s=Shift.ui._state();const d=Shift.engine.debrief(s);return {score:d.overall,o:Object.fromEntries(d.outcomes.map(o=>[o.id,[o.tone,o.title]])),steps:Shift.cjmm.score(d.judg).map(x=>[x.id,x.score])}})()")
        print(run, out['score'], out['o'])
        if run == 'careful':
            print('  misses:', pg.evaluate("Shift.ui._state().judg.filter(j=>j.delta<=0).map(j=>j.key+' '+j.delta+' '+j.text)"))
            for pid in ['21', '22', '23', '24', '25']:
                check(out['o'][pid][0] == 'good', f'careful: {pid} has a good outcome ({out["o"][pid][1]})')
            check(out['score'] >= 85, f'careful: overall score is high ({out["score"]})')
            ev = dict(out['steps']).get('eval')
            check(ev is not None and ev >= 70, f'careful: Evaluate outcomes is scored ({ev})')
        else:
            for pid, word in (('21', 'fibrillation'), ('22', 'reperfusion'), ('23', 'shock'), ('24', 'Airway'), ('25', 'craniotomy')):
                check(out['o'][pid][0] == 'bad' and word in out['o'][pid][1], f'skipper: {pid} goes badly ({out["o"][pid][1]})')
            check(out['score'] <= 40, f'skipper: overall score is low ({out["score"]})')
        pg.close()
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('ED ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
