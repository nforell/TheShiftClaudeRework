"""NCLEX-style practice items: every shift has three, every item is well-formed and scores correctly (full marks for
the key, NCSBN +/- for select-all and highlight), and the debrief can play all three. Usage: python tests/ngn.py"""
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
    pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1,'coach:room':1,tour:1}}))"); pg.reload(); pg.wait_for_timeout(300)
    res = pg.evaluate("""()=>{const N=Shift.ngn,out=[];const cases=Object.keys(Shift.engine.cases);
      for(const c of cases){const its=N.items(c);out.push(['count',c,its.length]);out.push(['ch',c,its.slice(3).length===2&&its.slice(3).every(x=>x.ch)&&its.slice(0,3).every(x=>!x.ch)]);
        for(const it of its){let key={};
          if(it.type==='bowtie')key={c:it.cond.ans,a:it.actions.ans.slice(),p:it.params.ans.slice()};
          if(it.type==='matrix')key={r:it.rows.map(r=>r.ans)};
          if(it.type==='cloze')key={d:it.parts.filter(x=>typeof x!=='string').map(x=>x.ans)};
          if(it.type==='sata')key={s:it.opts.map((o,i)=>o.ok?i:-1).filter(i=>i>=0)};
          if(it.type==='highlight')key={s:it.parts.map((o,i)=>o.ok?i:-1).filter(i=>i>=0)};
          out.push(['key',it.id,N.score(it,key)===N.max(it)&&N.complete(it,key)]);
          if(it.type==='sata'||it.type==='highlight'){const L=it.type==='sata'?it.opts:it.parts;const all={s:L.map((_,i)=>i)};out.push(['pm',it.id,N.score(it,all)===Math.max(0,L.filter(o=>o.ok).length-L.filter(o=>!o.ok).length)]);}
          out.push(['why',it.id,!!it.why&&!!it.stem&&!!it.q&&!!it.step]);
          if(it.type==='bowtie')out.push(['bt',it.id,it.actions.ans.length===2&&it.params.ans.length===2&&it.cond.opts.length>=4]);}}
      return out}""")
    for r in res:
        if r[0] == 'count': check(r[2] == 5, f'{r[1]} has five items (three plus two NCLEX challenge items)')
        elif not r[2]: check(False, f'{r[0]} {r[1]}')
    check(all(r[2] for r in res if r[0] != 'count'), 'every item is well-formed and the key scores full marks')
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    H('pick-case', id='stepdown-6e-1'); H('new')
    if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
    H('h-done'); H('rank-submit'); H('rank-go'); H('endask'); H('end-yes'); pg.wait_for_timeout(300)
    check(pg.locator('.dtab').count() == 2 and pg.locator('.nx-cta .cj-strip .cj-c').count() == 6, 'the debrief opens with an NCLEX review card showing all six steps')
    check(pg.locator('.cj-c.weak').count() == 1, 'the weakest step is marked')
    H('dtab', v='nclex'); pg.wait_for_timeout(100)
    check(pg.locator('.nx-tab').count() == 1 and pg.locator('.nq-list .nq').count() >= 3 and pg.locator('.nx-steps .meter').count() == 6, 'the NCLEX review tab has the questions and all six steps')
    check(pg.locator('.nx-more .pc').count() >= 2, 'the NCLEX review tab suggests matching case studies and the practice hub')
    wk = pg.evaluate("document.querySelector('.nx-tab .cj-c.weak').dataset.v")
    H('cj-go', v='act'); H('cj-go', v=wk); check(pg.locator('.nx-steps .meter.open').count() == 1, 'tapping a step opens just that step')
    H('dtab', v='shift'); check(pg.locator('.nx-tab').count() == 0 and pg.locator('.outs').count() == 1, 'back to the shift tab')
    H('ngn-open', i='0'); check(pg.locator('.bowtie').count() == 1, 'question 1 is a bowtie')
    bw = pg.evaluate("Shift.ngn.items('stepdown-6e-1')[0]")   # the key, wherever the shuffle put it
    for k, v in [('c', bw['cond']['ans'])] + [('a', x) for x in bw['actions']['ans']] + [('p', x) for x in bw['params']['ans']]: H('ngn-pick', k=k, v=str(v))
    H('ngn-check'); check('5 of 5' in pg.inner_text('.ngn-res'), 'a correct bowtie scores 5 of 5')
    H('ngn-go', i='1'); check(pg.locator('.ngn-mx').count() == 1, 'question 2 is a matrix')
    for ri in range(6): H('ngn-pick', k='r', row=str(ri), v='1')
    H('ngn-check'); txt = pg.inner_text('.ngn-res'); check('3 of 6' in txt, f'a half-right matrix scores 3 of 6 ({txt.splitlines()[0]})')
    H('ngn-go', i='2')
    for v in range(6): H('ngn-pick', k='s', v=str(v))
    H('ngn-check'); txt = pg.inner_text('.ngn-res'); check('0 of 3' in txt, f'selecting everything scores zero under +/- ({txt.splitlines()[0]})')
    saved = pg.evaluate("Object.keys(JSON.parse(localStorage.getItem('theshift.profile.v1')).ngn||{}).length")
    check(saved == 3, 'results are saved to the profile')
    # Robust rationale: every option of every item (shift and focus) has a reason that agrees with the key, plus a tip.
    bad = pg.evaluate("""()=>{const N=Shift.ngn,bad=[];const yes=(t)=>/^Yes:/.test(t||''),no=(t)=>/^No:/.test(t||'');
      for(const it of N.all()){const w=N.whys(it);if(!w.tip)bad.push(it.id+' tip');
        const chk=(txt,ok,lab)=>{if(!(ok?yes(txt):no(txt)))bad.push(it.id+' '+lab)};
        if(it.type==='bowtie')['cond','actions','params'].forEach(k=>it[k].opts.forEach((o,i)=>chk(w[k][i],Array.isArray(it[k].ans)?it[k].ans.includes(i):it[k].ans===i,k+i)));
        if(it.type==='sata')it.opts.forEach((o,i)=>chk(w.opts[i],o.ok,'opt'+i));
        if(it.type==='highlight')it.parts.forEach((o,i)=>chk(w.parts[i],o.ok,'part'+i));
        if(it.type==='cloze')it.parts.filter(x=>typeof x!=='string').forEach((x,b)=>x.opts.forEach((o,i)=>chk((w.blanks[b]||[])[i],i===x.ans,'blank'+b+'.'+i)));
        if(it.type==='matrix')it.rows.forEach((r,i)=>{if(!r.why)bad.push(it.id+' row'+i)});}
      return bad}""")
    pos = pg.evaluate("""(()=>{const N=Shift.ngn;let first=0,n=0;for(const it of N.all()){if(it.type==='mc'||it.type==='sata'){n++;if(it.opts[0].ok)first++;}if(it.type==='bowtie'){n++;if(it.cond.ans===0)first++;}if(it.type==='cloze')it.parts.filter(x=>typeof x!=='string').forEach(x=>{n++;if(x.ans===0)first++;});}return [first,n]})()""")
    check(pos[0] / pos[1] < .5, f'the key is no longer usually the first option ({pos[0]} of {pos[1]} first)')
    check(not bad, 'every option of every practice item has a rationale that agrees with the key' + (': ' + ', '.join(bad[:5]) if bad else ''))
    nfx = pg.evaluate("Shift.ngn.all().filter(x=>/^fx-/.test(x.id)).length"); steps = pg.evaluate("[...new Set(Shift.ngn.all().map(x=>x.step))].sort().join(',')")
    check(nfx >= 18 and steps == 'act,analyze,cues,eval,hypo,solve', f'focus items cover all six steps ({nfx} items; steps {steps})')
    check(pg.locator('.nr-t tbody tr').count() >= 1 and pg.locator('.nb-why').count() >= 6, 'a checked answer shows the points table and a reason for each option')
    check('minus' in pg.inner_text('.nr-h') and '= 0' in pg.inner_text('.nr-h'), 'select-all working shows the plus-minus arithmetic')
    H('close')
    # The debrief shows its working: the score explainer, an opened meter with every decision, and focus practice.
    H('sc-why'); txt = pg.inner_text('.sc-why'); check('average of the' in txt and '÷' in txt and '58' in txt, 'the score explainer shows the average and the star lines')
    H('by', v='cj'); check(pg.locator('.meter.open .wk-list').count() >= 1 and pg.locator('.meter.open .gd').count() >= 1, 'the weakest NCLEX step opens with its decisions and how to think it through')
    eq = pg.inner_text('.meter.open .wk-eq'); sc = pg.inner_text('.meter.open .l b')
    check(eq.strip().split(' ')[-1].strip('()') == sc.strip() or ('→ ' + sc.strip()) in eq, f'the shown working lands on the shown score ({eq} vs {sc})')
    fx = pg.evaluate("Shift.ui._ui.fx")
    check(fx and len(fx['ids']) >= 2 and pg.locator('.ngn-fx').count() == 1, 'focus practice targets the weakest steps')
    H('ngn-open', list='focus', i='0'); check('Focus practice' in pg.inner_text('.ngn-tag'), 'a focus question opens, labeled with its step')
    H('close')
    pg.screenshot(path=str(ROOT / 'tests' / 'out' / 'ngn.png'))
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('NGN ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
