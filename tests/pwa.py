"""Installable app: serves dist/ on localhost, checks the manifest and icons, waits for the service worker, then
goes offline and reloads the game from cache. Usage: python tests/pwa.py   (exit 1 on any failure)"""
import sys, json, pathlib, threading, functools, http.server, socketserver
ROOT = pathlib.Path(__file__).resolve().parent.parent
from playwright.sync_api import sync_playwright
fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)
class Quiet(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.webmanifest': 'application/manifest+json', '.js': 'text/javascript'}
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist')))
port = srv.server_address[1]; threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f'http://localhost:{port}'
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(); pg = ctx.new_page()
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(status=200, body='', content_type='text/css'))
    pg.goto(BASE + '/play/')
    href = pg.get_attribute('link[rel=manifest]', 'href')
    check(href == '/manifest.webmanifest', 'game links the manifest')
    m = json.loads(pg.request.get(BASE + href).text())
    check(m.get('display') == 'standalone' and m.get('start_url', '').startswith('/play/'), 'manifest: standalone, starts at /play/')
    sizes = {i['sizes'] for i in m['icons']}; check({'192x192', '512x512'} <= sizes and any(i.get('purpose') == 'maskable' for i in m['icons']), 'manifest: 192, 512 and maskable icons')
    for i in m['icons']: check(pg.request.get(BASE + i['src']).status == 200, 'icon served: ' + i['src'])
    check(pg.request.get(BASE + '/icons/apple-touch-icon.png').status == 200, 'apple touch icon served')
    sw = pg.request.get(BASE + '/sw.js').text(); check('__VERSION__' not in sw and 'theshift-' in sw, 'service worker built with the app version')
    pg.evaluate("navigator.serviceWorker.ready.then(()=>1)"); pg.reload(); pg.wait_for_timeout(500)
    check(pg.evaluate("!!navigator.serviceWorker.controller"), 'service worker controls the game')
    ctx.set_offline(True); pg.reload(); pg.wait_for_timeout(800)
    check(pg.evaluate("!!(window.Shift && Shift.ui && document.querySelector('#app').children.length)"), 'game loads offline')
    ctx.set_offline(False)
    check(not errs, 'no page errors' + (': ' + errs[0][:200] if errs else ''))
    b.close()
srv.shutdown()
print('PWA ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
