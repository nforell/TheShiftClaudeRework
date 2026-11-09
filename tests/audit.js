(() => {
  const W = innerWidth, H = innerHeight, out = { overflow: null, off: [], overlap: [], covered: [], small: [], clipped: [] };
  const label = (el) => { const a = el.dataset && el.dataset.act; const t = (el.getAttribute && (el.getAttribute('aria-label') || '')) || (el.textContent || ''); return (a ? '[' + a + '] ' : '') + (el.tagName || '') + '.' + (typeof el.className === 'string' ? el.className.split(' ').slice(0, 2).join('.') : '') + ' "' + t.trim().replace(/\s+/g, ' ').slice(0, 50) + '"'; };
  const vis = (el) => { if (el.checkVisibility && !el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })) return false; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false; const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  if (document.documentElement.scrollWidth > W + 1) out.overflow = document.documentElement.scrollWidth;
  const inScroller = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (/(auto|scroll|hidden)/.test(cs.overflowX) && p.scrollWidth > p.clientWidth + 1) return true; } return false; };
  const all = [...document.querySelectorAll('body *')].filter((e) => !(e.closest('svg') && e.tagName.toLowerCase() !== 'svg'));
  all.forEach((el) => { if (!vis(el)) return; const r = el.getBoundingClientRect(); if ((r.right > W + 2 || r.left < -2) && !inScroller(el) && !el.closest('.xpop,.zap,.pop-tip')) out.off.push(label(el) + ` ${Math.round(r.left)}-${Math.round(r.right)}`); });
  // Text overlap among visible text leaves
  const leaves = [];
  all.forEach((el) => {
    if (el.closest('.xpop,.zap,.pop-tip,.stamp,.toast,.coach,.ff')) return;
    const txt = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()); if (!txt.length || !vis(el)) return;
    const cs0 = getComputedStyle(el); if (cs0.textOverflow === 'ellipsis' || (el.parentElement && getComputedStyle(el.parentElement).textOverflow === 'ellipsis')) return;
    txt.forEach((n) => { const rg = document.createRange(); rg.selectNodeContents(n); [...rg.getClientRects()].forEach((r) => { if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > H) return; const hit = document.elementFromPoint(Math.min(W - 1, Math.max(0, r.left + r.width / 2)), Math.min(H - 1, Math.max(0, r.top + r.height / 2))); if (hit && (hit === el || el.contains(hit) || hit.contains(el))) leaves.push({ el, r }); }); });
  });
  for (let i = 0; i < leaves.length; i++) for (let j = i + 1; j < leaves.length; j++) {
    const a = leaves[i], b = leaves[j]; if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const x = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), y = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (x > 3 && y > 3) out.overlap.push(label(a.el) + '  ×  ' + label(b.el) + ` (${Math.round(x)}×${Math.round(y)})`);
  }
  // Clickables: covered, too small
  const modal = document.querySelector('.crit, .oops, .sheet, .drawer, .res, .intro, .orient, .ff');
  document.querySelectorAll('[data-act]').forEach((el) => {
    if (el.dataset.scrim || !el.dataset.act) return; if (!vis(el) || el.closest('[inert]')) return;
    if (modal && !modal.contains(el) && !(modal.classList.contains('drawer') && el.closest('.drawer'))) return;
    const r = el.getBoundingClientRect(); if (r.top + r.height / 2 < 0 || r.top + r.height / 2 >= H || r.left + r.width / 2 < 0 || r.left + r.width / 2 >= W) return;   // center off screen: not reachable here
    // clipped by a scrolling/clipping ancestor: not reachable at this scroll position, not a bug
    let clip = false; for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.overflowY !== 'visible') { const q = p.getBoundingClientRect(), mx = r.left + r.width / 2, my = r.top + r.height / 2; if (mx < q.left + 4 || mx > q.right - 4 || my < q.top + 4 || my > q.bottom - 4) { clip = true; break; } } }
    if (clip) return;
    const cx = Math.min(W - 1, Math.max(0, r.left + r.width / 2)), cy = Math.min(H - 1, Math.max(0, r.top + r.height / 2));
    let hit = document.elementFromPoint(cx, cy);
    // SVG objects: a tap anywhere on the drawn shape counts, so try a grid of points before calling it covered
    if (el instanceof SVGElement && hit && !(el === hit || el.contains(hit))) { for (let gx = 1; gx < 6 && !(el === hit || el.contains(hit)); gx++) for (let gy = 1; gy < 6; gy++) { const h2 = document.elementFromPoint(r.left + r.width * gx / 6, r.top + r.height * gy / 6); if (h2 && (el === h2 || el.contains(h2))) { hit = h2; break; } } }
    if (hit && hit.closest('.toast')) return;
    if (el.classList && el.classList.contains('clue') && document.querySelector(`.lookaround .look[data-id="${el.dataset.id}"]`) && getComputedStyle(document.querySelector('.lookaround')).display !== 'none') return;   // reachable from the Look at chips   // messages pass by; they aren't layout
    if (hit && hit.closest('.top,.pstrip,.rail,.dr-top') && !el.closest('.top,.pstrip,.rail,.dr-top')) return;   // passing under the sticky header while scrolled
    if (hit && !(el === hit || el.contains(hit) || (hit.closest('[data-act]') === el))) { const hc = hit.closest('[data-act]'); if (!(hc && hc !== el && el.contains(hc))) out.covered.push(label(el) + ' under ' + label(hit)); }
    // Target size. WCAG 2.5.8 (AA): every control at least 24×24. On phones (≤480px wide) a thumb needs a 44px-tall box (2.5.5)
    // and at least 24px across. Documented exceptions: scene hotspots inside the room SVG (each one has a full-size "Look at" chip),
    // a native input inside its label (the label is the target), and links inside running text (WCAG's inline exception).
    const minH = W <= 480 ? 44 : 24, inlineLink = el.tagName === 'A' && !!el.closest('p, small, .set-sub');
    if ((r.width < 23.5 || r.height < minH - 0.5) && el.tagName !== 'INPUT' && !el.closest('svg') && !inlineLink) out.small.push(label(el) + ` ${Math.round(r.width)}×${Math.round(r.height)}`);
  });
  // Clipped text without ellipsis
  all.forEach((el) => { if (!vis(el) || el.closest('.xpop')) return; const cs = getComputedStyle(el); if (cs.overflow !== 'hidden' && cs.overflowX !== 'hidden') return; if (el.scrollWidth > el.clientWidth + 2 && cs.textOverflow !== 'ellipsis' && el.textContent.trim() && el.clientWidth > 0 && !el.closest('.pstrip-in') && !/bar|ring|trk-bar|lv-bar|res-bar|shiftbar|meter/.test(el.className)) out.clipped.push(label(el) + ` ${el.scrollWidth}>${el.clientWidth}`); });
  return out;
})()
