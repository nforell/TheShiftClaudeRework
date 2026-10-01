"""Serve the game's Google Fonts from tests/fonts/ so every run (local or CI) renders identically, offline.
Files are the variable Latin subsets from @fontsource-variable (OFL-licensed, licenses alongside)."""
import pathlib
DIR = pathlib.Path(__file__).resolve().parent / 'fonts'
CSS = """
@font-face{font-family:'Atkinson Hyperlegible Next';font-style:normal;font-weight:200 800;font-display:block;src:url(https://fonts.gstatic.com/shift/atkinson-hyperlegible-next-latin-wght-normal.woff2) format('woff2')}
@font-face{font-family:'Atkinson Hyperlegible Next';font-style:italic;font-weight:200 800;font-display:block;src:url(https://fonts.gstatic.com/shift/atkinson-hyperlegible-next-latin-wght-italic.woff2) format('woff2')}
@font-face{font-family:'Atkinson Hyperlegible Mono';font-style:normal;font-weight:200 800;font-display:block;src:url(https://fonts.gstatic.com/shift/atkinson-hyperlegible-mono-latin-wght-normal.woff2) format('woff2')}
@font-face{font-family:'Barlow Condensed';font-style:normal;font-weight:500;font-display:block;src:url(https://fonts.gstatic.com/shift/barlow-condensed-latin-500-normal.woff2) format('woff2')}
@font-face{font-family:'Barlow Condensed';font-style:normal;font-weight:600;font-display:block;src:url(https://fonts.gstatic.com/shift/barlow-condensed-latin-600-normal.woff2) format('woff2')}
@font-face{font-family:'Barlow Condensed';font-style:normal;font-weight:700;font-display:block;src:url(https://fonts.gstatic.com/shift/barlow-condensed-latin-700-normal.woff2) format('woff2')}
@font-face{font-family:'Kalam';font-style:normal;font-weight:400;font-display:block;src:url(https://fonts.gstatic.com/shift/kalam-latin-400-normal.woff2) format('woff2')}
@font-face{font-family:'Kalam';font-style:normal;font-weight:700;font-display:block;src:url(https://fonts.gstatic.com/shift/kalam-latin-700-normal.woff2) format('woff2')}
"""
def fontroute(pg):
    pg.route('**/fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=CSS))
    pg.route('**/fonts.gstatic.com/shift/**', lambda r: r.fulfill(status=200, content_type='font/woff2', body=(DIR / r.request.url.rsplit('/', 1)[1]).read_bytes()))
def ready(pg):
    pg.evaluate("document.fonts.ready.then(()=>1)")
