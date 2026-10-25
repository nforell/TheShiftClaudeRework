"""NCLEX practice hub: every item in the bank and the case studies is well-formed (the key scores full marks, every
option has a rationale, every item has a step, a Client Needs category and a tip), case studies unfold in clinical
judgment order with a chart that grows, calculation items score by rounding, and the hub, a case study, a set, the
readiness view and the pocket reference all play with real clicks on phone and desktop. Usage: python tests/practice.py"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)
PROF = "localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],terms:'9999',settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{tour:1,orient:1}}))"
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    pg.goto(GAME); pg.evaluate(PROF); pg.reload(); pg.wait_for_timeout(300)
    bad = pg.evaluate("""()=>{const N=Shift.ngn,bad=[],STEPS=['cues','analyze','hypo','solve','act','eval'],CN=N.CN.map(x=>x[0]);
      const key=(it)=>it.type==='bowtie'?{c:it.cond.ans,a:it.actions.ans,p:it.params.ans}:it.type==='matrix'?{r:it.rows.map(r=>r.ans)}:it.type==='cloze'?{d:it.parts.filter(p=>typeof p!=='string').map(p=>p.ans)}:it.type==='mc'?{m:it.opts.findIndex(o=>o.ok)}:it.type==='order'?{o:it.opts.map((_,i)=>i)}:it.type==='num'?{n:String(it.ans)}:{s:(it.opts||it.parts).map((o,i)=>o.ok?i:-1).filter(i=>i>=0)};
      const ids=new Set();
      for(const it of N.all()){if(ids.has(it.id))bad.push(it.id+' duplicate id');ids.add(it.id);
        try{const k=key(it);if(N.score(it,k)!==N.max(it)||!N.complete(it,k))bad.push(it.id+' key');}catch(e){bad.push(it.id+' '+e.message)}
        const w=N.whys(it);if(!w.tip||!it.why||!STEPS.includes(it.step)||!CN.includes(it.cn))bad.push(it.id+' metadata');
        const L=it.type==='bowtie'?['cond','actions','params'].map(k=>[w[k],it[k].opts.length]):it.type==='sata'||it.type==='mc'?[[w.opts,it.opts.length]]:it.type==='highlight'?[[w.parts,it.parts.length]]:it.type==='order'?[[w.steps,it.opts.length]]:it.type==='cloze'?it.parts.filter(p=>typeof p!=='string').map((p,b)=>[w.blanks[b],p.opts.length]):it.type==='matrix'?[[it.rows.map(r=>r.why),it.rows.length]]:[[it.work,1]];
        L.forEach(([x,n])=>{if(!x||x.length<n||x.some(y=>!y))bad.push(it.id+' option rationale')});
        if(/[\\u2013\\u2014]/.test(JSON.stringify(it)))bad.push(it.id+' dash');}
      for(const c of N.cases()){if(c.items.length!==6||c.items.some((x,i)=>x.step!==STEPS[i]))bad.push(c.id+' step order');
        if(!c.record.some(r=>r.at===0)||!c.record.some(r=>r.at>=3))bad.push(c.id+' chart does not unfold');}
      return bad}""")
    check(not bad, 'every bank and case-study item is well-formed with a rationale for every option' + (': ' + ', '.join(bad[:6]) if bad else ''))
    n = pg.evaluate("({bank:Shift.ngn.bank().length,cases:Shift.ngn.cases().length,cn:[...new Set(Shift.ngn.all().map(x=>x.cn))].length,num:Shift.ngn.bank().filter(x=>x.type==='num').length})")
    check(n['bank'] >= 200 and n['cases'] >= 15 and n['cn'] == 8 and n['num'] >= 20, f"the bank covers every Client Needs category ({n})")
    calc = pg.evaluate("(()=>{const it=Shift.ngn.bank().find(x=>x.type==='num'&&x.ans%1!==0);return [Shift.ngn.score(it,{n:String(it.ans)}),Shift.ngn.score(it,{n:String(it.ans+0.04)}),it.id]})()")
    check(calc[0] == 1 and calc[1] == 0, f'a calculation scores only the correctly rounded answer ({calc[2]})')
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    for W in (1280, 390):
        pg.set_viewport_size({'width': W, 'height': 900 if W > 600 else 844}); pg.evaluate(PROF); pg.reload(); pg.wait_for_timeout(300)
        pg.locator('.hn-px').first.click(); pg.wait_for_timeout(200)
        check(pg.locator('.pc').count() >= 15, f'{W}px: the hub lists the case studies')
        pg.locator('.pc[data-id="cs-tbi"]').click(); pg.wait_for_timeout(200)
        n0 = pg.locator('.rec-e').count(); check(pg.locator('.cs-rec').count() == 1 and n0 >= 1, f'{W}px: a case study opens with its chart')
        for i in range(6):
            it = pg.evaluate("(()=>{const q=Shift.ui._ui.ngn;return Shift.ngn.caseById(q.cs).items[q.i]})()")
            t = it['type']
            if t == 'matrix':
                for r, row in enumerate(it['rows']): H('ngn-pick', k='r', row=str(r), v=str(row['ans']))
            elif t == 'cloze':
                for r, q in enumerate([q for q in it['parts'] if not isinstance(q, str)]): H('ngn-pick', k='d', row=str(r), v=str(q['ans']))
            else:
                for j, o in enumerate(it.get('opts') or it.get('parts')):
                    if o['ok']: H('ngn-pick', k='s', v=str(j))
            pg.locator('.sheet-f .btn-primary, .sheet .btn-primary').last.click(); pg.wait_for_timeout(120)
            if i == 3: check(pg.locator('.rec-new').count() >= 1, f'{W}px: the chart adds new entries as the case unfolds')
            pg.locator('.sheet .btn-primary').last.click(); pg.wait_for_timeout(120)
        check(pg.evaluate("Shift.ui._ui.ov") == 'csres' and '30 of' not in '' , f'{W}px: finishing a case shows the results by step')
        txt = pg.inner_text('.sheet'); check('of' in txt and 'points' in txt, f'{W}px: case results show points')
        H('close'); H('ptab', v='bank'); pg.wait_for_timeout(150)
        check(pg.locator('.qb-row').count() >= 20, f'{W}px: the question bank lists questions')
        H('pf', k='cn', v='pharm'); pg.wait_for_timeout(100)
        H('pset'); pg.wait_for_timeout(150); check(pg.evaluate("Shift.ui._ui.ov") == 'ngn', f'{W}px: a filtered set starts')
        H('close'); H('ptab', v='ready'); pg.wait_for_timeout(150)
        check(pg.locator('.rd').count() >= 14, f'{W}px: readiness shows every category and step')
        H('ref'); pg.wait_for_timeout(150); check(pg.evaluate("Shift.ui._ui.ov") == 'ref', f'{W}px: the pocket reference opens')
        sw = pg.evaluate("document.documentElement.scrollWidth"); check(sw <= W, f'{W}px: no sideways scroll ({sw})')
        H('close')
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('PRACTICE ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
