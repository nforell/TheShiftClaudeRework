"""Serve the game's two Google Fonts from tests/fonts/ so every run (local or CI) renders identically, offline.
Files are the variable Latin subsets from @fontsource-variable (OFL-licensed, licenses alongside)."""
import pathlib
DIR = pathlib.Path(__file__).resolve().parent / 'fonts'
CSS = """
@font-face{font-family:'Public Sans';font-style:normal;font-weight:100 900;font-display:block;src:url(https://fonts.gstatic.com/shift/public-sans-latin-wght-normal.woff2) format('woff2')}
@font-face{font-family:'Public Sans';font-style:italic;font-weight:100 900;font-display:block;src:url(https://fonts.gstatic.com/shift/public-sans-latin-wght-italic.woff2) format('woff2')}
@font-face{font-family:'Source Serif 4';font-style:normal;font-weight:200 900;font-display:block;src:url(https://fonts.gstatic.com/shift/source-serif-4-latin-wght-normal.woff2) format('woff2')}
@font-face{font-family:'Source Serif 4';font-style:italic;font-weight:200 900;font-display:block;src:url(https://fonts.gstatic.com/shift/source-serif-4-latin-wght-italic.woff2) format('woff2')}
"""
def fontroute(pg):
    pg.route('**/fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=CSS))
    pg.route('**/fonts.gstatic.com/shift/**', lambda r: r.fulfill(status=200, content_type='font/woff2', body=(DIR / r.request.url.rsplit('/', 1)[1]).read_bytes()))
def ready(pg):
    pg.evaluate("document.fonts.ready.then(()=>1)")
