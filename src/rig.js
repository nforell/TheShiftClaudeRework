/* The Shift — character rig. Draws people as layered SVG and animates them from clinical inputs
   (RR, SpO2, HR, SBP, temp, pain, glucose, alertness, confusion, nausea). Generic: designs come from the case. */
(function (S) {
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const hx = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const toHex = (r, g, b) => '#' + [r, g, b].map((x) => Math.round(clamp(x, 0, 255)).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const A = hx(a), B = hx(b); return toHex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)); };
  const shade = (a, amt) => { const A = hx(a); return toHex(A[0] + amt, A[1] + amt, A[2] + amt); };
  const rand = (a, b) => a + Math.random() * (b - a);
  const BASE = { rr: 16, spo2: 97, hr: 80, sbp: 124, temp: 37, pain: 0, glu: 110, alert: 0, confused: false, nausea: false, lean: 0 };
  const CH = {};
  let UID = 0, live = [], cache = {}, reduced = false, running = false;
  const osReduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- drawing ----------
     One light, upper left. Every form gets three things: a lit side, a warm core shadow, and a thin cool rim on the
     far edge. Hair is drawn as volume (a silhouette that stands off the skull), then clumps, then one gloss band.
     Nothing here uses SVG filters: characters breathe and blink every frame, and a filter would repaint each time. */
  function faceD(w, h, jaw) { const j = .42 + .3 * jaw, k = .5 + .34 * jaw; return `M ${-w} 0 C ${-w} ${-h * .56} ${-w * .56} ${-h} 0 ${-h} C ${w * .56} ${-h} ${w} ${-h * .56} ${w} 0 C ${w} ${h * j} ${w * k} ${h} 0 ${h} C ${-w * k} ${h} ${-w} ${h * j} ${-w} 0 Z`; }
  // Shadows on skin run warmer and a little redder than the skin itself; a grey shadow reads as dirt.
  const warmShadow = (skin, sh) => mix(sh, mix(skin, '#9A2F1E', .55), .32);
  // The lit lower half of an iris: same hue, pushed up toward a fixed brightness so dark eyes still read as brown.
  const irisGlow = (iris) => { const A = hx(iris), f = Math.min(4, 205 / Math.max(1, Math.max(A[0], A[1], A[2]))); return toHex(A[0] * f, A[1] * f, A[2] * f); };
  /* Paths are written on a unit head (x from -1 to 1 at the cheeks, y from -1 at the crown to 1 at the chin) and
     scaled to the character, so one drawing fits every head shape. */
  const unit = (w, h) => (d) => { let i = 0; return d.replace(/-?\d*\.?\d+/g, (m) => { const v = +m * (i++ % 2 ? h : w); return Math.round(v * 100) / 100; }); };

  /* Every character gets a face of their own. The case sets the big things (skin, head shape, hair); these smaller
     traits are picked from the character's key, so the same person always looks the same and no two neighbours match.
     A case can pin any of them with look.face = { nose: 2, tilt: 5, ... }. */
  const hash = (t) => { let n = 2166136261; for (let i = 0; i < t.length; i++) { n ^= t.charCodeAt(i); n = Math.imul(n, 16777619); } return n >>> 0; };
  function traits(c) {
    if (c.__f) return c.__f;
    const n = hash(String(c.__key || '') + c.skin + c.hair.color + c.hair.style), pick = (m, sh) => (n >>> sh) % m, ex = c.extras || [];
    const fem = c.brow.w < 4, elder = ex.includes('wrinkles'), kid = !!c.small;
    return (c.__f = Object.assign({
      fem, elder, kid,
      eyeR: kid ? 1.16 : [1.12, 1.0, 1.07, .95][pick(4, 0)],          // eye height : width, round to almond
      tilt: [0, 3, 6, -2][pick(4, 3)] + (fem ? 2 : 0) - (elder ? 3 : 0), // outer corner up, degrees
      gap: [.4, .385, .415][pick(3, 6)],                                // eye spacing
      hood: elder ? .46 : [0, 0, .28][pick(3, 24)],                     // how far the upper lid folds over the eye
      nose: kid ? 0 : pick(4, 8), brow: pick(3, 11),
      lip: fem ? [3, 3.5, 2.8][pick(3, 13)] : [2.2, 2.6, 2.4][pick(3, 13)],
      mark: pick(8, 16) === 0, stubble: !fem && !kid && !ex.includes('beard') && pick(3, 19) === 0,
      v: pick(2, 22),
    }, c.face || {}));
  }

  function hair(c, uid) {
    const { w, h } = c.head, col = c.hair.color, U = unit(w, h);
    const lum = hx(col).reduce((a, b) => a + b, 0) / 3, light = lum > 150;
    const dk = light ? mix(col, '#6E6A74', .34) : shade(col, -20), lt = light ? mix(col, '#FFFFFF', .6) : mix(col, '#FFE7C4', .26), gl = light ? '#FFFFFF' : mix(col, '#FFF4E0', .62);
    const G = `url(#rhg${uid})`;
    const defs = `<linearGradient id="rhg${uid}" gradientUnits="userSpaceOnUse" x1="${-w * .5}" y1="${-h * 1.25}" x2="${w * .45}" y2="${h * 1.1}"><stop offset="0" stop-color="${lt}"/><stop offset=".42" stop-color="${col}"/><stop offset="1" stop-color="${dk}"/></linearGradient>`;
    const fill = (d, extra) => `<path d="${U(d)}" fill="${G}"${extra || ''}/>`;
    const gloss = (d, o) => `<path d="${U(d)}" fill="${gl}" opacity="${o || (light ? .7 : .26)}"/>`;
    const strand = (d, o, sw) => `<path d="${U(d)}" stroke="${dk}" stroke-width="${sw || 1.5}" fill="none" stroke-linecap="round" opacity="${o || .5}"/>`;
    const shine = (d, o, sw) => `<path d="${U(d)}" stroke="${gl}" stroke-width="${sw || 1.6}" fill="none" stroke-linecap="round" opacity="${o || (light ? .8 : .34)}"/>`;
    let back = '', front = '';
    const F = traits(c);
    switch (c.hair.style) {
      case 'buzz':
        // A tight fade with a clean line-up: the hair sits on the scalp, so it takes the head's own shading.
        front = `<path d="${U('M -1 .08 C -1.05 -.62 -.6 -1.06 0 -1.06 C .6 -1.06 1.05 -.62 1 .08 L .9 .02 C .9 -.2 .86 -.36 .76 -.5 L .66 -.6 C .3 -.67 -.3 -.67 -.66 -.6 L -.76 -.5 C -.86 -.36 -.9 -.2 -.9 .02 Z')}" fill="${G}" opacity=".94"/>`
          + `<path d="${U('M -.9 .02 C -.9 -.2 -.86 -.36 -.76 -.5 L -.66 -.6 C -.3 -.67 .3 -.67 .66 -.6 L .76 -.5 C .86 -.36 .9 -.2 .9 .02')}" stroke="${c.skin}" stroke-width="3" fill="none" opacity=".35"/>`
          + gloss('M -.62 -.8 C -.34 -1.0 .1 -1.04 .4 -.92 C .1 -.94 -.3 -.9 -.62 -.8 Z', light ? .6 : .2);
        break;
      case 'bun':
        back = `<path d="${U('M -.34 -1.0 C -.5 -1.34 -.22 -1.58 .06 -1.58 C .36 -1.58 .6 -1.34 .46 -1.0 Z')}" fill="${G}"/>`
          + strand('M -.2 -1.3 C -.04 -1.44 .2 -1.44 .34 -1.28', .55) + strand('M -.12 -1.14 C .04 -1.26 .2 -1.24 .3 -1.12', .45)
          + gloss('M -.26 -1.36 C -.12 -1.52 .12 -1.54 .26 -1.44 C .1 -1.48 -.1 -1.46 -.26 -1.36 Z');
        if (c.hair.pencil) back = `<g><path d="M ${-w * .72} ${-h * 1.4} L ${w * .5} ${-h * .86}" stroke="#E7B63B" stroke-width="6"/><path d="M ${-w * .72} ${-h * 1.4} l -7 -3" stroke="#E58C98" stroke-width="6"/><path d="M ${w * .5} ${-h * .86} l 7 3.2" stroke="#E9CFA4" stroke-width="5"/><path d="M ${w * .5 + 6} ${-h * .86 + 2.8} l 3 1.3" stroke="#333" stroke-width="3"/></g>` + back;
        // Pulled back off the face: a smooth hairline with a soft widow's peak, strands running to the bun.
        front = fill('M -1.04 .14 C -1.1 -.62 -.66 -1.12 0 -1.12 C .66 -1.12 1.1 -.62 1.04 .14 L .9 .12 C .9 -.2 .8 -.42 .6 -.55 C .36 -.68 .14 -.64 0 -.57 C -.14 -.64 -.36 -.68 -.6 -.55 C -.8 -.42 -.9 -.2 -.9 .12 Z')
          + strand('M -.46 -.62 C -.4 -.84 -.26 -1 -.08 -1.08', .4) + strand('M .46 -.62 C .4 -.84 .26 -1 .08 -1.08', .4) + strand('M -.8 -.36 C -.76 -.7 -.5 -.98 -.2 -1.08', .32) + strand('M .8 -.36 C .76 -.7 .5 -.98 .2 -1.08', .32)
          + gloss('M -.74 -.62 C -.56 -.9 -.3 -1.04 -.06 -1.06 C -.3 -.98 -.5 -.82 -.62 -.6 Z');
        if (c.hair.streak) front += `<path d="${U('M .1 -1.08 C .34 -.98 .56 -.78 .7 -.5')}" stroke="#D8D2CC" stroke-width="5" fill="none" stroke-linecap="round"/>`;
        break;
      case 'curls': {
        // Set curls: a soft cloud with each curl turned by one crescent, not a ring of outlined circles.
        const P = [[-.98, .1, .24], [-1.02, -.3, .27], [-.84, -.7, .3], [-.5, -.98, .31], [-.1, -1.1, .32], [.32, -1.06, .31], [.68, -.84, .3], [.96, -.48, .28], [1.02, -.08, .25], [.96, .26, .19], [-.94, .4, .18]];
        P.forEach(([x, y, r]) => { back += `<circle cx="${x * w}" cy="${y * h}" r="${r * h}" fill="${G}"/>`; });
        front = fill('M -1.0 -.1 C -1.02 -.78 -.56 -1.04 0 -1.04 C .56 -1.04 1.02 -.78 1.0 -.1 C .84 -.42 .56 -.56 .3 -.5 C .12 -.62 -.14 -.62 -.3 -.5 C -.58 -.56 -.84 -.42 -1.0 -.1 Z');
        [[-.62, -.6, .2], [-.3, -.68, .21], [.04, -.7, .21], [.38, -.66, .2], [.68, -.54, .19]].forEach(([x, y, r]) => { front += `<circle cx="${x * w}" cy="${y * h}" r="${r * h}" fill="${G}"/>`; });
        [[-.84, -.7, .3], [-.5, -.98, .31], [-.1, -1.1, .32], [.32, -1.06, .31], [.68, -.84, .3], [-.62, -.6, .2], [-.3, -.68, .21], [.04, -.7, .21], [.38, -.66, .2], [.68, -.54, .19], [.96, -.48, .28], [-1.02, -.3, .27]].forEach(([x, y, r]) => {
          const cx = x * w, cy = y * h, R = r * h;
          front += `<path d="M ${cx - R * .55} ${cy + R * .32} A ${R * .62} ${R * .62} 0 0 0 ${cx + R * .58} ${cy + R * .2}" stroke="${dk}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".42"/><path d="M ${cx - R * .5} ${cy - R * .3} A ${R * .6} ${R * .6} 0 0 1 ${cx + R * .2} ${cy - R * .58}" stroke="${gl}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="${light ? .9 : .3}"/>`;
        });
        break;
      }
      case 'balding':
        // What's left sits close to the head: a band from the temple round to behind the ear, and a few wisps on top.
        front = [-1, 1].map((d) => `<path d="${U(`M ${d * .84} -.5 C ${d * .98} -.5 ${d * 1.07} -.26 ${d * 1.04} .02 C ${d * 1.02} .14 ${d * .93} .12 ${d * .93} -.02 C ${d * .93} -.2 ${d * .9} -.36 ${d * .84} -.5 Z`)}" fill="${G}"/><path d="${U(`M ${d * .93} -.36 C ${d * .99} -.26 ${d * 1.0} -.12 ${d * .98} 0`)}" stroke="${dk}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".45"/>`).join('')
          + (F.v ? `<g stroke="${col}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".7"><path d="${U('M -.5 -.9 C -.2 -1.04 .2 -1.04 .5 -.9')}"/><path d="${U('M -.6 -.8 C -.24 -.96 .24 -.96 .6 -.8')}"/><path d="${U('M -.36 -.98 C -.12 -1.06 .14 -1.06 .36 -.98')}"/></g>` : '')
          + `<ellipse cx="${-w * .3}" cy="${-h * .72}" rx="${w * .3}" ry="${h * .1}" transform="rotate(-22 ${-w * .3} ${-h * .72})" fill="#fff" opacity=".3"/>`;
        break;
      case 'swoop':
        // A quiff: the front stands up and rolls to one side.
        front = fill('M -1.03 .12 C -1.1 -.4 -.94 -.86 -.66 -1.06 C -.42 -1.36 .5 -1.44 .86 -1.0 C 1.08 -.74 1.08 -.3 1.03 .12 L .9 .1 C .9 -.14 .86 -.34 .76 -.5 C .5 -.5 .16 -.6 -.08 -.74 C -.3 -.6 -.62 -.5 -.76 -.46 C -.86 -.32 -.9 -.14 -.9 .1 Z')
          + strand('M -.5 -1.06 C -.2 -1.2 .3 -1.18 .64 -.9', .42) + strand('M -.7 -.82 C -.4 -1.0 .06 -1.0 .44 -.78', .36) + strand('M -.08 -.74 C .14 -.84 .4 -.84 .62 -.72', .3)
          + gloss('M -.56 -1.1 C -.2 -1.34 .4 -1.34 .72 -1.04 C .4 -1.22 -.16 -1.22 -.56 -1.1 Z');
        break;
      case 'long': {
        // Falls over the shoulders and thins to soft points; straight for some, a loose wave for others. The front
        // parts to one side and frames the face.
        const fall = F.v
          ? 'M -1.06 -.3 C -1.2 -1.26 1.2 -1.26 1.06 -.3 C 1.3 .0 1.1 .3 1.22 .58 C 1.34 .86 1.1 1.08 1.16 1.34 C 1.08 1.56 .84 1.58 .7 1.46 C .82 1.22 .7 1.02 .76 .8 L .6 .3 L -.6 .3 L -.76 .8 C -.7 1.02 -.82 1.22 -.7 1.46 C -.84 1.58 -1.08 1.56 -1.16 1.34 C -1.1 1.08 -1.34 .86 -1.22 .58 C -1.1 .3 -1.3 .0 -1.06 -.3 Z'
          : 'M -1.06 -.3 C -1.2 -1.26 1.2 -1.26 1.06 -.3 C 1.18 .2 1.24 .8 1.12 1.3 C 1.06 1.5 .88 1.62 .68 1.58 C .78 1.32 .8 1.04 .74 .8 L .6 .3 L -.6 .3 L -.74 .8 C -.8 1.04 -.78 1.32 -.68 1.58 C -.88 1.62 -1.06 1.5 -1.12 1.3 C -1.24 .8 -1.18 .2 -1.06 -.3 Z';
        back = fill(fall)
          + [-1, 1].map((d) => strand(`M ${d * .96} .2 C ${d * 1.04} .6 ${d * 1.04} 1.0 ${d * .92} 1.4`, .45) + strand(`M ${d * .84} .78 C ${d * .9} 1.0 ${d * .88} 1.26 ${d * .8} 1.48`, .32)
            + `<path d="${U(`M ${d * 1.04} .0 C ${d * 1.16} .4 ${d * 1.16} .8 ${d * 1.06} 1.16 C ${d * 1.1} .8 ${d * 1.08} .4 ${d * 1.0} .04 Z`)}" fill="${gl}" opacity="${light ? .6 : .2}"/>`).join('');
        front = fill('M -1.04 .18 C -1.1 -.8 -.58 -1.12 0 -1.12 C .58 -1.12 1.1 -.8 1.04 .18 C .98 .0 .94 -.18 .9 -.3 C .8 -.46 .6 -.56 .36 -.6 C .12 -.64 -.12 -.74 -.28 -.86 C -.44 -.66 -.78 -.5 -.9 -.26 C -.94 -.14 -.98 .02 -1.04 .18 Z')
          + strand('M -.26 -1.08 C -.3 -1 -.3 -.92 -.28 -.86', .6) + strand('M -.1 -1.0 C .22 -.94 .52 -.82 .74 -.56', .34) + strand('M -.44 -1.0 C -.64 -.86 -.8 -.62 -.88 -.34', .34)
          + gloss('M .0 -1.04 C .34 -1.0 .66 -.84 .84 -.56 C .6 -.78 .32 -.9 .0 -.94 Z') + gloss('M -.5 -.98 C -.7 -.84 -.84 -.64 -.9 -.42 C -.8 -.66 -.66 -.82 -.5 -.9 Z', light ? .6 : .2);
        break;
      }
      case 'bob':
        back = fill('M -1.12 -.2 C -1.24 -1.26 1.24 -1.26 1.12 -.2 C 1.2 .2 1.22 .5 1.16 .7 C 1.02 .84 .84 .78 .78 .62 L -.78 .62 C -.84 .78 -1.02 .84 -1.16 .7 C -1.22 .5 -1.2 .2 -1.12 -.2 Z')
          + [-1, 1].map((s) => strand(`M ${s * 1.0} .1 C ${s * 1.06} .34 ${s * 1.06} .54 ${s * .98} .7`, .45)).join('');
        front = fill('M -1.05 .22 C -1.1 -.82 -.52 -1.12 .1 -1.1 C .72 -1.06 1.1 -.7 1.05 .22 C 1.0 .02 .96 -.14 .9 -.26 C .82 -.44 .6 -.54 .24 -.58 C -.1 -.5 -.6 -.5 -.84 -.2 C -.94 -.08 -1.0 .06 -1.05 .22 Z')
          + strand('M .18 -1.06 C .08 -.86 -.26 -.66 -.58 -.56', .4) + strand('M .3 -1.04 C .5 -.94 .74 -.74 .86 -.46', .32)
          + gloss('M -.6 -.92 C -.34 -1.08 .04 -1.1 .3 -1.02 C .02 -1.02 -.32 -.98 -.6 -.92 Z') + shine('M 1.02 -.2 C 1.1 .1 1.1 .36 1.04 .56', light ? .7 : .28);
        break;
      case 'short':
        // Tight at the sides, longer on top. Half the cast wear a side part, the other half a textured crop.
        front = F.v
          ? fill('M -1.0 -.02 C -1.08 -.56 -.84 -1.14 -.12 -1.17 C .62 -1.2 1.08 -.6 1.0 -.02 L .915 -.04 C .9 -.2 .86 -.34 .78 -.46 C .52 -.6 .16 -.68 -.16 -.6 C -.38 -.54 -.6 -.5 -.78 -.44 C -.86 -.32 -.9 -.2 -.915 -.04 Z')
            + strand('M -.56 -.9 C -.24 -1.02 .2 -1.0 .56 -.8', .38) + strand('M -.66 -.66 C -.36 -.78 .0 -.8 .3 -.72', .32) + strand('M -.4 -1.06 C -.5 -.92 -.56 -.74 -.58 -.56', .4)
            + gloss('M -.3 -1.06 C .06 -1.12 .5 -1.02 .76 -.76 C .46 -.94 .08 -1.0 -.3 -.98 Z')
          : fill('M -1.0 -.02 C -1.08 -.6 -.8 -1.16 0 -1.18 C .8 -1.16 1.08 -.6 1.0 -.02 L .915 -.04 C .9 -.2 .86 -.36 .78 -.48 Q .7 -.6 .6 -.52 Q .5 -.7 .36 -.56 Q .24 -.74 .08 -.58 Q -.06 -.76 -.2 -.58 Q -.34 -.72 -.46 -.56 Q -.6 -.66 -.78 -.48 C -.86 -.36 -.9 -.2 -.915 -.04 Z')
            + strand('M .36 -.56 C .34 -.8 .22 -.98 .06 -1.08', .34) + strand('M -.2 -.58 C -.22 -.8 -.14 -.98 0 -1.1', .34) + strand('M -.46 -.56 C -.54 -.76 -.5 -.94 -.4 -1.04', .3) + strand('M .6 -.52 C .64 -.72 .58 -.9 .46 -1.0', .3)
            + gloss('M -.5 -1.0 C -.2 -1.14 .24 -1.14 .54 -.98 C .22 -1.06 -.2 -1.06 -.5 -1.0 Z');
        break;
      case 'curlyshort': {
        // Tight natural curls: a rounded shape with a scalloped edge and small coils catching the light.
        const big = c.hair.big ? 1.12 : 1;
        back = fill(`M -1.06 .1 C ${-1.2 * big} -.5 ${-.96 * big} ${-1.2 * big} 0 ${-1.24 * big} C ${.96 * big} ${-1.2 * big} ${1.2 * big} -.5 1.06 .1 Z`);
        for (let a = 188; a <= 352; a += 14.9) { const r = a * Math.PI / 180; back += `<circle cx="${Math.cos(r) * w * 1.07 * big}" cy="${Math.sin(r) * h * 1.08 * big + h * .04}" r="${h * .14}" fill="${G}"/>`; }
        front = fill('M -1.02 .06 C -1.04 -.78 -.56 -1.06 0 -1.06 C .56 -1.06 1.04 -.78 1.02 .06 L .9 .04 C .88 -.24 .8 -.44 .64 -.56 C .3 -.68 -.3 -.68 -.64 -.56 C -.8 -.44 -.88 -.24 -.9 .04 Z');
        [[-.62, -.7], [-.34, -.9], [-.02, -.98], [.3, -.92], [.6, -.74], [-.8, -.42], [.8, -.44], [-.2, -.72], [.16, -.74], [.44, -.62], [-.46, -.6], [-.06, -1.14 * big], [.4, -1.08 * big], [-.5, -1.06 * big], [.78, -.86 * big], [-.84, -.84 * big]].forEach(([x, y], i) => {
          const cx = x * w, cy = y * h, R = h * .075;
          front += i % 2 ? `<path d="M ${cx - R} ${cy} A ${R} ${R} 0 1 1 ${cx + R * .6} ${cy + R * .8}" stroke="${gl}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="${light ? .8 : .3}"/>` : `<path d="M ${cx - R} ${cy} A ${R} ${R} 0 1 0 ${cx + R * .6} ${cy - R * .8}" stroke="${dk}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".5"/>`;
        });
        break;
      }
      case 'hijab': {
        // A wrapped scarf: it covers the whole crown and the ears, frames the face in an oval from the forehead to just
        // under the chin, then drapes over the shoulders. Drawn as an outer shape with a face-shaped opening (evenodd).
        const dk2 = shade(col, -24), lt2 = mix(col, '#FFFFFF', .3);
        const outer = `M 0 ${-h * 1.17} C ${w * .78} ${-h * 1.17} ${w * 1.21} ${-h * .7} ${w * 1.21} ${h * .05} C ${w * 1.21} ${h * .72} ${w * 1.02} ${h * 1.16} ${w * .72} ${h * 1.36} L ${-w * .72} ${h * 1.36} C ${-w * 1.02} ${h * 1.16} ${-w * 1.21} ${h * .72} ${-w * 1.21} ${h * .05} C ${-w * 1.21} ${-h * .7} ${-w * .78} ${-h * 1.17} 0 ${-h * 1.17} Z`;
        const hole = `M 0 ${-h * .68} C ${w * .62} ${-h * .68} ${w * .9} ${-h * .32} ${w * .89} ${h * .14} C ${w * .87} ${h * .6} ${w * .5} ${h * 1.07} 0 ${h * 1.07} C ${-w * .5} ${h * 1.07} ${-w * .87} ${h * .6} ${-w * .89} ${h * .14} C ${-w * .9} ${-h * .32} ${-w * .62} ${-h * .68} 0 ${-h * .68} Z`;
        back = `<path d="M ${-w * 1.24} ${h * .1} C ${-w * 1.24} ${-h * 1.24} ${w * 1.24} ${-h * 1.24} ${w * 1.24} ${h * .1} L ${w * 1.34} ${h * 1.8} L ${-w * 1.34} ${h * 1.8} Z" fill="${dk2}"/>`;
        front = `<path d="${outer} ${hole}" fill="${G}" fill-rule="evenodd"/>`
          + `<path d="M ${-w * .86} ${h * 1.18} C ${-w * .4} ${h * 1.42} ${w * .4} ${h * 1.42} ${w * .86} ${h * 1.18} L ${w * 1.3} ${h * 1.86} Q 0 ${h * 2.1} ${-w * 1.3} ${h * 1.86} Z" fill="${G}"/>`
          + `<path d="${hole}" fill="none" stroke="${dk2}" stroke-width="3" opacity=".3"/>`
          + `<path d="${U('M -.7 -.66 C -.3 -.86 .3 -.86 .7 -.66 C .3 -.78 -.3 -.78 -.7 -.66 Z')}" fill="${dk2}" opacity=".5"/>`
          + `<path d="${U('M -.8 -.84 C -.4 -1.1 .2 -1.12 .56 -.96 C .2 -1.04 -.36 -1.0 -.8 -.84 Z')}" fill="${lt2}" opacity=".5"/>`
          + `<path d="${U('M 1.06 .3 C 1.02 .8 .82 1.12 .5 1.3')}" stroke="${dk2}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>`
          + `<path d="${U('M -1.08 .2 C -1.06 .7 -.9 1.06 -.66 1.26')}" stroke="${lt2}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".45"/>`
          + `<path d="${U('M -.36 1.42 Q .3 1.6 .9 1.78')}" stroke="${dk2}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".55"/>`
          + `<path d="${U('M -.7 1.5 Q -.2 1.7 .3 1.84')}" stroke="${dk2}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".35"/>`;
        break;
      }
      case 'shag':
        // Choppy layers: pointed pieces across the forehead and flicks over the ears.
        back = fill('M -1.1 -.2 C -1.2 -1.22 1.2 -1.22 1.1 -.2 C 1.18 .1 1.16 .34 1.06 .5 C 1.02 .36 .98 .28 .92 .24 L -.92 .24 C -.98 .28 -1.02 .36 -1.06 .5 C -1.16 .34 -1.18 .1 -1.1 -.2 Z');
        front = fill('M -1.04 .16 C -1.1 -.8 -.58 -1.14 0 -1.14 C .58 -1.14 1.1 -.8 1.04 .16 C .98 0 .94 -.12 .88 -.22 Q .8 -.36 .74 -.56 Q .62 -.3 .46 -.24 Q .44 -.44 .36 -.6 Q .2 -.3 0 -.22 Q -.02 -.44 -.1 -.6 Q -.26 -.3 -.46 -.24 Q -.48 -.44 -.56 -.58 Q -.7 -.34 -.88 -.22 C -.94 -.12 -.98 0 -1.04 .16 Z')
          + strand('M -.1 -.6 C -.14 -.82 -.08 -.98 .02 -1.08', .38) + strand('M .36 -.6 C .38 -.8 .46 -.94 .58 -1.0', .34) + strand('M -.56 -.58 C -.62 -.76 -.56 -.92 -.44 -1.02', .34)
          + gloss('M -.6 -.94 C -.3 -1.1 .14 -1.1 .44 -1.0 C .12 -1.02 -.3 -1.0 -.6 -.94 Z');
        break;
      case 'ponytail':
        // The tail swings out behind one shoulder with a soft curl at the end.
        back = fill('M .6 -.86 C 1.06 -.9 1.4 -.5 1.38 .0 C 1.36 .4 1.2 .76 .98 .9 C .92 .94 .86 .88 .9 .8 C 1.0 .56 .98 .2 .86 -.1 C .8 -.3 .7 -.5 .56 -.62 Z')
          + strand('M .86 -.7 C 1.14 -.5 1.22 -.1 1.14 .3', .45) + shine('M 1.0 -.74 C 1.26 -.5 1.32 -.1 1.24 .26', light ? .7 : .28)
          + `<ellipse cx="${w * .78}" cy="${-h * .72}" rx="8" ry="6.5" transform="rotate(34 ${w * .78} ${-h * .72})" fill="#6F97C9"/><ellipse cx="${w * .76}" cy="${-h * .74}" rx="4" ry="2.4" transform="rotate(34 ${w * .76} ${-h * .74})" fill="#fff" opacity=".35"/>`;
        front = fill('M -1.04 .14 C -1.1 -.62 -.66 -1.12 0 -1.12 C .66 -1.12 1.1 -.62 1.04 .14 L .9 .12 C .9 -.14 .84 -.34 .72 -.48 C .4 -.44 -.1 -.58 -.44 -.88 C -.54 -.68 -.74 -.5 -.84 -.34 C -.88 -.2 -.9 -.06 -.9 .12 Z')
          + strand('M -.44 -.88 C -.2 -.74 .2 -.6 .6 -.58', .36) + strand('M -.3 -1.0 C .06 -.9 .44 -.78 .7 -.6', .3) + strand('M -.5 -.98 C -.64 -.84 -.76 -.64 -.84 -.4', .32)
          + gloss('M -.7 -.68 C -.5 -.94 -.2 -1.06 .12 -1.06 C -.2 -1.0 -.44 -.86 -.6 -.64 Z');
        break;
    }
    return { back, front, defs };
  }
  function eyeSVG(c, uid, s) {
    const { w, h } = c.head, F = traits(c), ex = s * w * F.gap, ey = h * .1, rx = c.eye, ry = rx * F.eyeR, ir = rx * .86, ws = warmShadow(c.skin, c.shade);
    return `<g transform="translate(${ex} ${ey}) rotate(${-s * F.tilt})"><clipPath id="rec${uid}${s}"><ellipse rx="${rx}" ry="${ry}"/></clipPath>
      <g clip-path="url(#rec${uid}${s})"><ellipse rx="${rx}" ry="${ry}" fill="#FDFBF8"/>
      <ellipse cy="${-ry * .82}" rx="${rx * 1.2}" ry="${ry * .62}" fill="#4B3A4E" opacity=".2"/>
      <g class="r-iris"><circle r="${ir}" fill="url(#rir${uid})"/><ellipse cy="${ir * .44}" rx="${ir * .64}" ry="${ir * .38}" fill="${mix(irisGlow(c.iris), c.iris, .2)}" opacity=".62"/><circle r="${ir * .93}" fill="none" stroke="${shade(c.iris, -34)}" stroke-width="${Math.max(1, ir * .15)}" opacity=".9"/><circle class="r-pupil" r="${ir * .46}" fill="#0F0908"/><circle class="r-hl" cx="${-ir * .38}" cy="${-ir * .42}" r="${ir * .32}" fill="#fff"/><circle cx="${ir * .42}" cy="${ir * .4}" r="${ir * .15}" fill="#fff" opacity=".9"/></g>
      ${F.hood ? `<path d="M ${-rx - 2} ${-ry - 2} L ${rx + 2} ${-ry - 2} L ${rx + 2} ${-ry * (1 - F.hood * 1.5) * (s > 0 ? 1 : .55)} Q 0 ${-ry * (1 - F.hood * .3)} ${-rx - 2} ${-ry * (1 - F.hood * 1.5) * (s > 0 ? .55 : 1)} Z" fill="${c.skin}"/>` : ''}
      <rect class="r-lid" x="${-rx - 3}" y="${-ry - 3}" width="${2 * rx + 6}" height="0" fill="${c.skin}"/><rect class="r-low" x="${-rx - 3}" y="${ry + 3}" width="${2 * rx + 6}" height="0" fill="${c.skin}"/></g>
      <path class="r-lash" fill="none" stroke="#1A100E" stroke-width="${F.fem ? 3 : 2.3}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M ${-rx * .8} ${-ry - 4.6} Q 0 ${-ry - 9.4} ${rx * .86} ${-ry - 4.2}" stroke="${ws}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="${F.hood ? .3 : .55}"/>
      <path d="M ${-rx * .7} ${ry + 2.8} Q 0 ${ry + 4.8} ${rx * .7} ${ry + 2.8}" stroke="${ws}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="${F.elder ? .6 : .32}"/>
      ${F.elder ? `<path d="M ${-rx * .5} ${ry + 6} Q ${s * 2} ${ry + 8.6} ${rx * .6} ${ry + 5.6}" stroke="${ws}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".42"/>` : ''}</g>`;
  }
  function headSVG(c, uid) {
    const { w, h } = c.head, F = traits(c), face = faceD(w, h, c.head.jaw), H = hair(c, uid), ex = c.extras || [], ws = warmShadow(c.skin, c.shade), hi = mix(c.skin, '#FFF6E8', .5); let s = `<g class="r-head">`;
    s += H.defs
      + `<radialGradient id="rsk${uid}" cx=".36" cy=".3" r=".86"><stop offset="0" stop-color="${hi}"/><stop offset=".42" stop-color="${c.skin}"/><stop offset="1" stop-color="${mix(c.skin, ws, .62)}"/></radialGradient>`
      + `<radialGradient id="rbl${uid}"><stop offset="0" stop-color="${c.blush}" stop-opacity=".95"/><stop offset=".55" stop-color="${c.blush}" stop-opacity=".5"/><stop offset="1" stop-color="${c.blush}" stop-opacity="0"/></radialGradient>`
      + `<radialGradient id="rsd${uid}"><stop offset="0" stop-color="${ws}" stop-opacity=".95"/><stop offset=".5" stop-color="${ws}" stop-opacity=".5"/><stop offset="1" stop-color="${ws}" stop-opacity="0"/></radialGradient>`
      + `<radialGradient id="rsl${uid}"><stop offset="0" stop-color="#FFF8EC" stop-opacity=".95"/><stop offset=".5" stop-color="#FFF8EC" stop-opacity=".4"/><stop offset="1" stop-color="#FFF8EC" stop-opacity="0"/></radialGradient>`
      + `<linearGradient id="rir${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c.iris, -26)}"/><stop offset=".55" stop-color="${c.iris}"/><stop offset="1" stop-color="${mix(c.iris, irisGlow(c.iris), .5)}"/></linearGradient>`;
    s += H.back;
    if (c.hair.style !== 'hijab') [-1, 1].forEach((d) => {
      s += `<ellipse cx="${d * w * .97}" cy="${h * .14}" rx="8.8" ry="12.8" fill="${d < 0 ? c.skin : mix(c.skin, ws, .3)}" stroke="${ws}" stroke-width="1.1"/><path d="M ${d * w * .99} ${h * .04} q ${d * 5} 7 ${d * .6} 15 q ${-d * 2.4} -3 ${-d * 1.6} -7 Z" fill="${ws}" opacity=".5"/>`;
      if (ex.includes('hoops')) s += `<circle cx="${d * w * .99}" cy="${h * .42}" r="6.4" fill="none" stroke="#B8892B" stroke-width="2.4"/><path d="M ${d * w * .99 - 5} ${h * .42 - 3} a 6.4 6.4 0 0 1 6 -3.2" stroke="#F6DC8C" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
      if (ex.includes('gold')) s += `<circle cx="${d * w * .99}" cy="${h * .36}" r="3.3" fill="#D4A941"/><circle cx="${d * w * .99 - 1}" cy="${h * .36 - 1}" r="1.1" fill="#FFF1B8"/>`;
      if (ex.includes('pearls')) s += `<circle cx="${d * w * .99}" cy="${h * .34}" r="3.8" fill="#F7F3EA" stroke="#CFC7B8"/><circle cx="${d * w * .99 - 1.2}" cy="${h * .34 - 1.2}" r="1.2" fill="#fff"/>`;
      if (ex.includes('studs')) s += `<circle cx="${d * w * .99}" cy="${h * .34}" r="2.6" fill="#9FC7D6"/><circle cx="${d * w * .99 - .8}" cy="${h * .34 - .8}" r=".9" fill="#fff"/>`;
    });
    s += `<clipPath id="rfc${uid}"><path d="${face}"/></clipPath><path d="${face}" fill="url(#rsk${uid})" stroke="${ws}" stroke-width="1.1" stroke-opacity=".7"/>`;
    // Inside the face: core shadow down the far cheek and under the jaw, the shadow the hair throws on the forehead,
    // a soft light on the near brow bone, and the rim.
    s += `<g clip-path="url(#rfc${uid})"><ellipse cx="${w * 1.04}" cy="${h * .3}" rx="${w * .8}" ry="${h * 1.2}" fill="url(#rsd${uid})" opacity=".62"/><ellipse cx="${w * .1}" cy="${h * 1.16}" rx="${w * 1.0}" ry="${h * .46}" fill="url(#rsd${uid})" opacity=".6"/>`
      + `<ellipse class="r-fh" cx="0" cy="${-h * .5}" rx="${w * .75}" ry="${h * .32}" fill="#E0503F" opacity="0"/><path class="r-pallor" d="${face}" fill="#CDD6D3" opacity="0"/><path class="r-green" d="${face}" fill="#A5C58B" opacity="0"/>`
      + (c.hair.style !== 'balding' ? `<ellipse cx="${w * .06}" cy="${-h * .74}" rx="${w * 1.2}" ry="${h * .42}" fill="url(#rsd${uid})" opacity=".7"/>` : '')
      + `<ellipse cx="${-w * .36}" cy="${-h * .22}" rx="${w * .42}" ry="${h * .26}" fill="url(#rsl${uid})" opacity=".32"/>`
      + `<ellipse cx="${-w * .56}" cy="${h * .56}" rx="${w * .3}" ry="${h * .26}" fill="url(#rsl${uid})" opacity=".22"/>`
      + (F.stubble ? `<radialGradient id="rst${uid}"><stop offset="0" stop-color="${c.hair.color}" stop-opacity=".17"/><stop offset=".6" stop-color="${c.hair.color}" stop-opacity=".11"/><stop offset="1" stop-color="${c.hair.color}" stop-opacity="0"/></radialGradient><ellipse cx="0" cy="${h * .86}" rx="${w * .95}" ry="${h * .5}" fill="url(#rst${uid})"/>` : '') + `</g>`;
    if (F.mark) s += `<circle cx="${(F.v ? 1 : -1) * w * .46}" cy="${h * .55}" r="1.5" fill="${shade(c.shade, -50)}" opacity=".8"/>`;
    s += `<g class="r-cheeks"><ellipse cx="${-w * .58}" cy="${h * .4}" rx="${w * .27}" ry="${h * .16}" fill="url(#rbl${uid})"/><ellipse cx="${w * .58}" cy="${h * .4}" rx="${w * .27}" ry="${h * .16}" fill="url(#rbl${uid})"/></g>`;
    if (ex.includes('freckles')) [[-.55, .28], [-.45, .36], [-.64, .36], [.55, .28], [.45, .36], [.64, .36], [-.1, .3], [.1, .3], [-.36, .27], [.36, .27]].forEach(([x, y]) => { s += `<circle cx="${x * w}" cy="${y * h}" r="1.25" fill="${ws}" opacity=".8"/>`; });
    if (ex.includes('wrinkles')) s += `<g stroke="${ws}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".62"><path d="M ${-w * .35} ${-h * .5} q ${w * .35} -5 ${w * .7} 0"/><path d="M ${-w * .25} ${-h * .4} q ${w * .25} -4 ${w * .5} 0"/><path d="M ${-w * .32} ${h * .36} q -5 8 -2 16"/><path d="M ${w * .32} ${h * .36} q 5 8 2 16"/><path d="M ${-w * .66} ${h * .1} l -6 -2 M ${-w * .66} ${h * .16} l -6 1 M ${w * .66} ${h * .1} l 6 -2 M ${w * .66} ${h * .16} l 6 1"/></g>`;
    // Nose: a lit bulb, its shadow underneath, and the far side of the bridge.
    { const ny = h * .31, sd = `url(#rsd${uid})`, sl = `url(#rsl${uid})`, ln = (d, sw, o) => `<path d="${d}" stroke="${ws}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${o}"/>`;
      if (F.nose === 1) // broad: soft wings either side of a wide tip
        s += `<ellipse cx="1.5" cy="${ny + 7}" rx="12" ry="5" fill="${sd}" opacity=".8"/><ellipse cx="-1" cy="${ny}" rx="9.4" ry="7" fill="${sl}" opacity=".5"/>` + ln(`M -9.6 ${ny + 2} C -11.6 ${ny + 6} -7.6 ${ny + 8.4} -4.4 ${ny + 6.6} Q 0 ${ny + 9.4} 4.4 ${ny + 6.6} C 7.6 ${ny + 8.4} 11.6 ${ny + 6} 9.6 ${ny + 2}`, 1.8, .78);
      else if (F.nose === 2) // long: the bridge shows down the shadow side and the tip turns under
        s += `<ellipse cx="2" cy="${ny + 8}" rx="8" ry="4.2" fill="${sd}" opacity=".8"/><ellipse cx="-1.4" cy="${ny + 1}" rx="6" ry="7.4" fill="${sl}" opacity=".5"/>` + ln(`M 3.6 ${ny - 15} C 5.6 ${ny - 6} 7.4 ${ny + 2} 5.6 ${ny + 6} C 3.6 ${ny + 9.4} -2.6 ${ny + 9} -4.6 ${ny + 5.6}`, 1.8, .7);
      else if (F.nose === 3) // upturned: a round tip and two small nostrils
        s += `<ellipse cx="1" cy="${ny + 6}" rx="8" ry="4" fill="${sd}" opacity=".7"/><ellipse cx="-1.2" cy="${ny}" rx="6.6" ry="6" fill="${sl}" opacity=".6"/>` + ln(`M -3.6 ${ny + 4.4} Q 0 ${ny + 7.4} 3.8 ${ny + 4.2}`, 1.7, .7) + `<ellipse cx="-3.4" cy="${ny + 3.6}" rx="1.5" ry="1" fill="${ws}" opacity=".7"/><ellipse cx="3.6" cy="${ny + 3.4}" rx="1.5" ry="1" fill="${ws}" opacity=".7"/>`;
      else // button
        s += `<ellipse cx="1.5" cy="${h * .4}" rx="9" ry="4.6" fill="${sd}" opacity=".8"/><ellipse cx="-1.2" cy="${ny}" rx="7.4" ry="6.4" fill="${sl}" opacity=".55"/>` + ln(`M -4.4 ${h * .376} Q .4 ${h * .425} 5 ${h * .37}`, 1.9, .8) + ln(`M 4.4 ${h * .2} Q 6.6 ${h * .29} 5.4 ${h * .35}`, 1.5, .32);
    }
    s += `<ellipse class="r-cyan" cx="0" cy="${h * .6}" rx="17" ry="10" fill="#7487C0" opacity="0"/>`;
    if (ex.includes('beard')) s += `<path d="M ${-w * .95} 0 C ${-w * .95} ${h * .92} ${-w * .42} ${h * 1.12} 0 ${h * 1.12} C ${w * .42} ${h * 1.12} ${w * .95} ${h * .92} ${w * .95} 0 C ${w * .82} ${h * .55} ${w * .42} ${h * .76} 0 ${h * .76} C ${-w * .42} ${h * .76} ${-w * .82} ${h * .55} ${-w * .95} 0 Z" fill="url(#rhg${uid})"/><path d="M ${-w * .5} ${h * .98} Q 0 ${h * 1.1} ${w * .5} ${h * .98}" stroke="${shade(c.hair.color, -18)}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".4"/>`;
    // Lower lip: a touch of colour and a light under the mouth so it has volume when closed.
    s += `<ellipse cx="0" cy="${h * .6 + 9}" rx="11" ry="4.6" fill="url(#rsd${uid})" opacity=".55"/>`;
    s += `<g transform="translate(0 ${h * .6})"><path class="r-lip" fill="${c.lip}" opacity="${F.fem ? .5 : .26}"/><path class="r-mouth" fill="#4A1F1E" stroke="${c.lip}" stroke-width="${F.lip}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
    if (ex.includes('goatee')) s += `<path d="M -13 ${h * .5} Q 0 ${h * .43} 13 ${h * .5}" stroke="${c.hair.color}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M -9 ${h * .78} Q 0 ${h * 1.02} 9 ${h * .78} Q 0 ${h * .86} -9 ${h * .78} Z" fill="${c.hair.color}"/>`;
    if (ex.includes('mustache')) s += `<path d="M 0 ${h * .46} C -8 ${h * .37} -24 ${h * .4} -27 ${h * .55} C -18 ${h * .52} -9 ${h * .54} 0 ${h * .52} C 9 ${h * .54} 18 ${h * .52} 27 ${h * .55} C 24 ${h * .4} 8 ${h * .37} 0 ${h * .46} Z" fill="url(#rhg${uid})"/><path d="M -20 ${h * .46} Q -10 ${h * .42} -2 ${h * .47}" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".3"/>`;
    if (ex.includes('beard')) s += `<path d="M 0 ${h * .47} C -7 ${h * .4} -18 ${h * .43} -20 ${h * .53} C -12 ${h * .51} -6 ${h * .52} 0 ${h * .51} C 6 ${h * .52} 12 ${h * .51} 20 ${h * .53} C 18 ${h * .43} 7 ${h * .4} 0 ${h * .47} Z" fill="${c.hair.color}"/>`;
    s += eyeSVG(c, uid, -1) + eyeSVG(c, uid, 1);
    // Brows taper from the nose out, like a brush stroke.
    [-1, 1].forEach((d) => {
      const t = c.brow.w + (F.elder ? .7 : 0), [px, py, oy] = [[-1, -3.8, 1.4], [0, -1.6, .2], [3, -5.6, 2.6]][F.brow];   // soft arch, straight, high arch
      s += `<g class="r-brow" data-s="${d}"><path d="M ${-d * 9.8} ${1.6 - t * .42} Q ${d * px} ${py - t * .5} ${d * 11.4} ${oy} Q ${d * px} ${py + .2 + t * .42} ${-d * 9.8} ${1.6 + t * .46} Z" fill="${c.brow.color}" stroke="${c.brow.color}" stroke-width="1" stroke-linejoin="round"/></g>`;
    });
    const sweatFirst = c.hair.style === 'hijab';
    let sweat = `<ellipse class="r-sheen" cx="${-w * .1}" cy="${-h * .55}" rx="${w * .4}" ry="${h * .12}" fill="#fff" opacity="0"/>`;
    [[-.34, -.5], [.36, -.4], [.66, -.08]].forEach(([x, y]) => { const yy = sweatFirst ? y + .38 : y; sweat += `<path class="r-drop" data-x="${x * w * (sweatFirst ? .8 : 1)}" data-y="${yy * h}" d="M 0 -4.5 C 2.8 -.6 3.4 1.8 0 3.6 C -3.4 1.8 -2.8 -.6 0 -4.5 Z" fill="#D4ECF5" stroke="#86B6CC" stroke-width=".9" opacity="0"/>`; });
    if (sweatFirst) s += sweat;
    s += H.front;
    const gx = w * F.gap, gy = h * .1, gr = c.eye * Math.max(1.02, F.eyeR) + 4.5;
    if (ex.includes('glasses') || ex.includes('thinGlasses')) { const sw = ex.includes('glasses') ? 2.8 : 1.6; s += `<g fill="none" stroke="${c.glasses || '#3A3A3E'}" stroke-width="${sw}"><circle cx="${-gx}" cy="${gy}" r="${gr}" fill="#DFF1FF" fill-opacity=".12"/><circle cx="${gx}" cy="${gy}" r="${gr}" fill="#DFF1FF" fill-opacity=".12"/><path d="M ${-gx + gr} ${gy - 1} Q 0 ${gy - 6} ${gx - gr} ${gy - 1}"/><path d="M ${-gx - gr} ${gy - 2} L ${-w * .98} ${gy - 4} M ${gx + gr} ${gy - 2} L ${w * .98} ${gy - 4}"/></g><path d="M ${-gx - gr * .62} ${gy - gr * .5} l ${gr * .5} ${-gr * .34} M ${gx - gr * .62} ${gy - gr * .5} l ${gr * .5} ${-gr * .34}" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".6"/>`; }
    if (ex.includes('headset')) s += `<path d="M ${-w * 1.02} ${h * .05} C ${-w * 1.1} ${-h * 1.2} ${w * 1.1} ${-h * 1.2} ${w * 1.02} ${h * .05}" stroke="#3A3F44" stroke-width="4" fill="none"/><rect x="${-w * 1.1}" y="${-h * .08}" width="12" height="20" rx="5" fill="#3A3F44"/><path d="M ${-w * 1.02} ${h * .2} Q ${-w * .8} ${h * .62} ${-w * .3} ${h * .6}" stroke="#3A3F44" stroke-width="2.4" fill="none"/><circle cx="${-w * .3}" cy="${h * .6}" r="3.4" fill="#3A3F44"/>`;
    // Endotracheal tube: taped at the corner of the mouth, running down to the ventilator circuit.
    if (ex.includes('ett')) s += `<g stroke-linecap="round" fill="none"><path d="M ${w * .08} ${h * .6} C ${w * .3} ${h * .78} ${w * .62} ${h * .98} ${w * .9} ${h * 1.36}" stroke="#93A7B2" stroke-width="13"/><path d="M ${w * .08} ${h * .6} C ${w * .3} ${h * .78} ${w * .62} ${h * .98} ${w * .9} ${h * 1.36}" stroke="#EDF3F5" stroke-width="9"/><path d="M ${w * .16} ${h * .67} C ${w * .34} ${h * .8} ${w * .6} ${h * .98} ${w * .84} ${h * 1.3}" stroke="#FFFFFF" stroke-width="2" opacity=".8"/></g><rect x="${-w * .66}" y="${h * .54}" width="${w * 1.32}" height="10" rx="3" fill="#FBF8F0" stroke="#D6CFBF" stroke-width="1.2"/><rect x="${w * .02}" y="${h * .5}" width="15" height="18" rx="3" fill="#F2F5F7" stroke="#93A7B2" stroke-width="1.5"/><rect x="${w * .74}" y="${h * 1.18}" width="18" height="12" rx="3" transform="rotate(52 ${w * .83} ${h * 1.24})" fill="#5B8DB8"/>`;
    if (ex.includes('cannula')) s += `<g fill="none" stroke-linecap="round"><path d="M ${-w * .98} ${h * .2} Q ${-w * .5} ${h * .5} -6 ${h * .42} L 6 ${h * .42} Q ${w * .5} ${h * .5} ${w * .98} ${h * .2}" stroke="#8FC3CC" stroke-width="4.4"/><path d="M ${-w * .98} ${h * .2} Q ${-w * .5} ${h * .5} -6 ${h * .42} L 6 ${h * .42} Q ${w * .5} ${h * .5} ${w * .98} ${h * .2}" stroke="#E6F7FA" stroke-width="2.4"/></g><path d="M -3 ${h * .42} v -4 M 3 ${h * .42} v -4" stroke="#C9EAF0" stroke-width="2.4" stroke-linecap="round"/>`;
    if (!sweatFirst) s += sweat;
    return s + `</g>`;
  }
  const CLOTH = { gown: ['#C9DEE6', '#93B6C6'], navy: ['#2F4A73', '#1F3454'], teal: ['#2F8580', '#216460'], grey: ['#6F7A80', '#525C61'], blue: ['#4275B2', '#2F588A'], wine: ['#84324A', '#632436'], coat: ['#F7F8F5', '#D3D9D4'], blouse: ['#EEDCC8', '#D2BCA4'], plum: ['#765069', '#5A3C50'], tee: ['#73889B', '#58697A'], sun: ['#E8B043', '#C08D2C'], hoodie: ['#39485F', '#283448'], flannel: ['#829FBE', '#607D9C'], onesie: ['#F5DD92', '#D9BF6A'], onesie2: ['#AFD8EC', '#86B8D2'], rose: ['#D06C85', '#A85168'] };
  function bodySVG(c, uid) {
    const { w, h } = c.head, T = h * 1.2, bw = c.body.w, [cl, cd] = CLOTH[c.body.cloth] || CLOTH.gown, ws = warmShadow(c.skin, c.shade); let s = '';
    const torso = `M ${-bw} ${T + 34} C ${-bw} ${T + 8} ${-bw * .58} ${T + 1} ${-w * .32} ${T} L ${w * .32} ${T} C ${bw * .58} ${T + 1} ${bw} ${T + 8} ${bw} ${T + 34} L ${bw + 4} ${T + 240} L ${-bw - 4} ${T + 240} Z`;
    const k = c.body.cloth, gown = k === 'gown';
    // Cloth: the weave (gowns only), then light from above, then the form turning away at both sides.
    if (gown) s += `<pattern id="rgp${uid}" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="${cl}"/><path d="M9 5.6 l2.3 3.4 -2.3 3.4 -2.3 -3.4z" fill="${cd}" opacity=".36"/></pattern>`;
    s += `<clipPath id="rtc${uid}"><path d="${torso}"/></clipPath><path d="${torso}" fill="${gown ? `url(#rgp${uid})` : cl}" stroke="${shade(cd, -18)}" stroke-width="1.1"/>`;
    s += `<linearGradient id="rtg${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#0B1830" stop-opacity=".2"/></linearGradient>`
      + `<linearGradient id="rts${uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0B1830" stop-opacity=".12"/><stop offset=".2" stop-color="#0B1830" stop-opacity="0"/><stop offset=".68" stop-color="#0B1830" stop-opacity="0"/><stop offset="1" stop-color="#0B1830" stop-opacity=".3"/></linearGradient>`
      + `<g clip-path="url(#rtc${uid})"><path d="${torso}" fill="url(#rtg${uid})"/><path d="${torso}" fill="url(#rts${uid})"/>`
      + `<radialGradient id="rsn${uid}"><stop offset="0" stop-color="#0B1830" stop-opacity=".5"/><stop offset="1" stop-color="#0B1830" stop-opacity="0"/></radialGradient><ellipse cx="${w * .1}" cy="${T + 6}" rx="${w * .9}" ry="20" fill="url(#rsn${uid})" opacity=".6"/>`
      + `<path d="M ${-bw * .7} ${T + 26} C ${-bw * .62} ${T + 70} ${-bw * .66} ${T + 110} ${-bw * .74} ${T + 150}" stroke="${cd}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".55"/><path d="M ${bw * .7} ${T + 26} C ${bw * .62} ${T + 70} ${bw * .66} ${T + 110} ${bw * .74} ${T + 150}" stroke="${cd}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>`
      + `<path d="M ${-bw * .92} ${T + 30} C ${-bw * .8} ${T + 13} ${-bw * .5} ${T + 9} ${-w * .42} ${T + 7}" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".34"/></g>`;
    // Neck: a column in the head's shadow, with the jaw's cast shadow across the top.
    s += `<linearGradient id="rng${uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.skin}"/><stop offset=".55" stop-color="${mix(c.skin, ws, .35)}"/><stop offset="1" stop-color="${mix(c.skin, ws, .7)}"/></linearGradient>`
      + `<path d="M ${-w * .28} ${h * .55} L ${-w * .31} ${T + 3} L ${w * .31} ${T + 3} L ${w * .28} ${h * .55} Z" fill="url(#rng${uid})"/><linearGradient id="rnc${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(ws, -16)}" stop-opacity=".8"/><stop offset=".6" stop-color="${shade(ws, -16)}" stop-opacity=".36"/><stop offset="1" stop-color="${shade(ws, -16)}" stop-opacity="0"/></linearGradient><path d="M ${-w * .28} ${h * .55} L ${-w * .31} ${T + 3} L ${w * .31} ${T + 3} L ${w * .28} ${h * .55} Z" fill="url(#rnc${uid})"/>`;
    s += `<g class="r-strain" opacity="0" stroke="${ws}" stroke-width="2.2" stroke-linecap="round"><path d="M ${-w * .2} ${h * .9} L ${-w * .3} ${T + 2}"/><path d="M ${w * .2} ${h * .9} L ${w * .3} ${T + 2}"/></g>`;
    if (k === 'coat') s += `<path d="M ${-w * .46} ${T} L 0 ${T + 64} L ${w * .46} ${T} Z" fill="#A9C8E0"/><path d="M ${-w * .3} ${T} L 0 ${T + 26} L ${w * .3} ${T} Z" fill="${mix(c.skin, ws, .3)}"/><path d="M ${-w * .46} ${T} L -3 ${T + 66} L ${-w * .62} ${T + 80} L ${-w * .74} ${T + 8} Z" fill="${cl}" stroke="${cd}" stroke-width="1.4" stroke-linejoin="round"/><path d="M ${w * .46} ${T} L 3 ${T + 66} L ${w * .62} ${T + 80} L ${w * .74} ${T + 8} Z" fill="${cd}" stroke="${shade(cd, -16)}" stroke-width="1.4" stroke-linejoin="round"/><rect x="${bw * .3}" y="${T + 76}" width="22" height="28" rx="4" fill="#fff" stroke="#9BB0BC"/><rect x="${bw * .3 + 4}" y="${T + 80}" width="14" height="8" rx="2" fill="#7AA8C4"/>`;
    else if (k === 'navy' || k === 'teal' || k === 'grey' || k === 'blue' || k === 'wine') s += `<path d="M ${-w * .34} ${T - 1} L 0 ${T + 34} L ${w * .34} ${T - 1}" fill="${mix(c.skin, ws, .3)}" stroke="${cd}" stroke-width="6" stroke-linejoin="round"/><path d="M ${-w * .36} ${T - 1} L -1 ${T + 33}" stroke="${shade(cl, 26)}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/><rect x="${-bw * .62}" y="${T + 56}" width="30" height="24" rx="4" fill="${cd}"/><path d="M ${-bw * .62 + 2} ${T + 58} h 26" stroke="${shade(cl, 26)}" stroke-width="1.2" opacity=".5"/><rect x="${bw * .3}" y="${T + 54}" width="20" height="27" rx="4" fill="#fff"/><rect x="${bw * .3 + 3}" y="${T + 58}" width="14" height="8" rx="2" fill="${cl}"/><path d="M ${bw * .3 + 4} ${T + 71} h 12 M ${bw * .3 + 4} ${T + 75} h 8" stroke="#B7C4CC" stroke-width="1.4" stroke-linecap="round"/><path d="M ${-bw * .62 + 7} ${T + 56} v -9" stroke="#3B3B40" stroke-width="3" stroke-linecap="round"/><path d="M ${-bw * .62 + 14} ${T + 56} v -7" stroke="#C2493D" stroke-width="3" stroke-linecap="round"/>`;
    else if (gown) s += `<path d="M ${-w * .33} ${T - 1} Q 0 ${T + 30} ${w * .33} ${T - 1} Z" fill="${mix(c.skin, ws, .3)}"/><path d="M ${-w * .35} ${T - 1} Q 0 ${T + 32} ${w * .35} ${T - 1}" stroke="${cd}" stroke-width="5.5" fill="none" stroke-linecap="round"/><path d="M ${-w * .35} ${T - 2} Q 0 ${T + 30} ${w * .35} ${T - 2}" stroke="#fff" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".55"/>`
      + [-1, 1].map((d) => [.58, .8].map((f) => `<circle cx="${d * bw * f}" cy="${T + 9 + (f - .58) * 30}" r="2.1" fill="#F4F8FA" stroke="${cd}" stroke-width="1"/>`).join('')).join('');
    else s += `<path d="M ${-w * .32} ${T - 1} Q 0 ${T + 26} ${w * .32} ${T - 1} Z" fill="${mix(c.skin, ws, .3)}"/><path d="M ${-w * .34} ${T - 1} Q 0 ${T + 28} ${w * .34} ${T - 1}" stroke="${cd}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    if (c.body.lanyard) s += `<path d="M ${-w * .32} ${T} L -4 ${T + 70} M ${w * .32} ${T} L 4 ${T + 70}" stroke="#2E7C78" stroke-width="3"/><rect x="-11" y="${T + 70}" width="22" height="28" rx="4" fill="#fff" stroke="#9BB0BC"/><rect x="-7" y="${T + 75}" width="14" height="9" rx="2" fill="#8FB7CF"/>`;
    if (c.body.steth) s += `<g fill="none" stroke-linecap="round"><path d="M ${-w * .34} ${T + 2} C ${-w * .5} ${T + 62} ${-w * .1} ${T + 72} ${-w * .1} ${T + 104}" stroke="#3E464E" stroke-width="3.8"/><path d="M ${w * .34} ${T + 2} C ${w * .52} ${T + 40} ${w * .46} ${T + 60} ${w * .4} ${T + 74}" stroke="#3E464E" stroke-width="3.8"/><path d="M ${-w * .36} ${T + 6} C ${-w * .5} ${T + 56} ${-w * .16} ${T + 70} ${-w * .13} ${T + 96}" stroke="#8C98A2" stroke-width="1.1" opacity=".8"/></g><circle cx="${-w * .1}" cy="${T + 110}" r="7.5" fill="#B4BDC4" stroke="#3E464E" stroke-width="2"/><circle cx="${-w * .1 - 2}" cy="${T + 108}" r="2.2" fill="#fff" opacity=".7"/>`;
    if (c.body.cardigan) { const cc = c.body.cardigan; [-1, 1].forEach((d) => { s += `<path d="M ${d * bw} ${T + 34} C ${d * bw} ${T + 8} ${d * bw * .58} ${T + 1} ${d * w * .34} ${T} L ${d * 12} ${T + 240} L ${d * (bw + 4)} ${T + 240} Z" fill="${d < 0 ? cc : shade(cc, -14)}" stroke="${shade(cc, -34)}" stroke-width="1.2"/><path d="M ${d * w * .36} ${T + 4} L ${d * 15} ${T + 236}" stroke="${shade(cc, 30)}" stroke-width="2" opacity=".5"/>`; for (let i = 0; i < 3; i++) s += `<circle cx="${d * (w * .3 - (w * .3 - 14) * ((i * 34 + 40) / 240))}" cy="${T + 40 + i * 34}" r="3" fill="${shade(cc, -44)}"/>`; }); }
    if ((c.extras || []).includes('pearls')) s += `<path d="M ${-w * .3} ${T + 2} Q 0 ${T + 26} ${w * .3} ${T + 2}" stroke="#F8F4EA" stroke-width="4" stroke-dasharray=".1 6.4" stroke-linecap="round" fill="none"/>`;
    return s;
  }
  function armSVG(c) {
    const [cl, cd] = CLOTH[c.body.cloth] || CLOTH.gown, ws = warmShadow(c.skin, c.shade); let s = '';
    [-1, 1].forEach((d) => { s += `<g class="r-arm" data-s="${d}"><path class="r-skin" fill="none" stroke="${d < 0 ? c.skin : mix(c.skin, ws, .22)}" stroke-width="22" stroke-linecap="round"/><path class="r-mot" fill="none" stroke="#86679C" stroke-width="12" stroke-dasharray="2 6" stroke-linecap="round" opacity="0"/><path class="r-sleeve" fill="none" stroke="${c.body.cardigan || (d < 0 ? cl : mix(cl, cd, .45))}" stroke-width="30" stroke-linecap="round"/>`
      + `<g class="r-hand"><path d="M -13 -3 C -13 -11 -6 -13 0 -12.5 C 7 -13 13.5 -10 13.5 -2 C 13.5 5 11 10.5 5 11.5 C -1 12.5 -9 11 -12 6 C -13 4 -13 0 -13 -3 Z" fill="${c.skin}" stroke="${ws}" stroke-width="1.1"/><ellipse cx="${-d * 10.5}" cy="-5" rx="5" ry="7.8" transform="rotate(${d * 14} ${-d * 10.5} -5)" fill="${c.skin}" stroke="${ws}" stroke-width="1.1"/><path d="M -5.5 4 q -.6 4 .4 6.6 M .4 4.6 q -.2 4 .4 6.8 M 6 3.6 q .6 3.6 -.2 6.4" stroke="${ws}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".8"/><ellipse cx="-3" cy="-6" rx="5.5" ry="2.6" fill="#fff" opacity=".2"/></g></g>`; });
    return s;
  }
  function blanketSVG(c) {
    const B = c.head.h * 1.2 + 100;
    let s = `<g class="r-blanket"><path d="M -236 ${B + 10} C -140 ${B - 6} 140 ${B - 6} 236 ${B + 10} L 244 300 L -244 300 Z" style="fill:var(--scene-blanket)"/>`;
    if (c.legUp) s += `<path d="M 70 ${B + 34} C 110 ${B + 6} 190 ${B + 8} 226 ${B + 26} L 230 ${B + 60} L 72 ${B + 60} Z" style="fill:var(--scene-blanket)"/><path d="M 84 ${B + 30} C 120 ${B + 12} 180 ${B + 14} 214 ${B + 26}" style="stroke:var(--scene-blanket-2)" stroke-width="2" fill="none"/>`;
    s += `<path d="M -236 ${B + 10} C -140 ${B - 6} 140 ${B - 6} 236 ${B + 10}" style="stroke:var(--scene-sheet)" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M -150 ${B + 56} C -80 ${B + 46} -20 ${B + 62} 40 ${B + 54}" style="stroke:var(--scene-blanket-2)" stroke-width="2.4" fill="none"/><path d="M 60 ${B + 90} C 110 ${B + 82} 160 ${B + 92} 210 ${B + 84}" style="stroke:var(--scene-blanket-2)" stroke-width="2.4" fill="none"/></g>`;
    return s;
  }

  /* ---------- clinical inputs → expression ---------- */
  function derive(v, c) {
    const painF = clamp((v.pain - 3) / 6), splint = c.guard ? clamp((v.pain - 5) / 3) : 0, fever = clamp((v.temp - 37.7) / 1.3), rigors = (v.temp >= 39.2 || v.chills) ? 1 : 0;
    const tremorIn = clamp(v.tremor || 0), pale = clamp(v.pale || 0), anx = clamp(v.anxious || 0), sweatIn = clamp(v.sweat || 0);
    const lowBP = clamp((96 - v.sbp) / 24), mottle = clamp((80 - v.sbp) / 12), cyan = clamp((92 - v.spo2) / 8), hypoG = clamp((72 - v.glu) / 28);
    const dys = clamp(Math.max(clamp((v.rr - 22) / 12), cyan * .9)), lean = clamp(Math.max(v.lean || 0, Math.min((v.rr - 25) / 6, (93 - v.spo2) / 5)));
    const alertEff = Math.max(v.alert || 0, v.glu < 45 ? 2 : v.glu < 56 ? 1 : 0, v.sbp < 72 ? 2 : v.sbp < 84 ? 1 : 0, v.spo2 < 83 ? 1 : 0, v.rr < 10 ? (v.rr < 8 ? 2 : 1) : 0);
    const confused = (v.confused || v.glu < 56) && alertEff < 2, dizzy = (v.hr < 52 && v.sbp < 96 && alertEff < 2) ? 1 : 0, nausea = v.nausea ? 1 : 0;
    const comfort = 1 - clamp(painF + dys + hypoG + fever * .6 + lowBP + nausea + (confused ? .6 : 0) + dizzy + alertEff * .5 + lean + anx * .8 + tremorIn * .5 + rigors * .6);
    return { painF, splint, fever, rigors, lowBP, mottle, cyan, hypoG, dys, lean, alertEff, confused, dizzy, nausea, comfort, tremorIn, pale, anx, sweatIn };
  }
  function targets(c, d) {
    const T = {};
    T.smile = clamp((c.smile || 0) * d.comfort + d.comfort * .2 - d.painF * .75 - d.dys * .45 - d.hypoG * .45 - d.nausea * .4 - d.dizzy * .3 - (d.confused ? .15 : 0) - d.anx * .45 - d.rigors * .3, -.8, 1);
    T.open = (d.alertEff === 2 ? .22 : 0) + d.painF * .1;
    T.worry = clamp(d.painF * .9 + d.hypoG * .75 + (d.confused ? .55 : 0) + d.dys * .7 + d.dizzy * .6 + d.nausea * .5 + d.anx * .75 + d.rigors * .4 - (d.alertEff === 2 ? .7 : 0));
    T.raise = d.confused ? .25 : 0;
    T.squint = clamp(d.painF * .6 + Math.max(0, T.smile) * .4 + d.nausea * .2);
    T.eye = [1, .5, .1][d.alertEff] * (1 - d.painF * .18) * (d.dizzy ? .78 : 1) * (c.tired ? .72 : 1);
    T.dil = clamp(d.hypoG + d.dys * .3 + d.anx * .35); T.flush = d.fever; T.pallor = clamp(Math.max(d.lowBP * .85, d.hypoG * .6, d.nausea * .3, d.cyan * .35, d.pale * .75));
    T.cyan = d.cyan; T.sweat = clamp(Math.max(d.hypoG, d.dys * .75, d.rigors * .5, d.painF > .8 ? .4 : 0, d.mottle * .85, d.fever > .7 ? .3 : 0, d.lean * .8, d.sweatIn));
    T.mottle = d.mottle; T.green = d.nausea; T.lean = d.lean; T.droop = [0, .3, 1][d.alertEff]; T.guard = d.splint; T.guard2 = c.guard && d.painF > .85 ? 1 : 0;
    T.pick = d.confused ? 1 : 0; T.tremor = Math.max(d.hypoG > .15 ? d.hypoG : 0, d.tremorIn); T.glassy = d.fever; T.strain = clamp(d.lean * .9 + d.dys * .35);
    return T;
  }
  const breathCurve = (p) => (p < .42 ? .5 - .5 * Math.cos(Math.PI * p / .42) : .5 + .5 * Math.cos(Math.PI * (p - .42) / .58));

  /* ---------- instances ---------- */
  function build(el, c, mode, ck, v) {
    const uid = ++UID;
    let s = '';
    if (mode === 'bed') s = `<g class="r-torso">${bodySVG(c, uid)}</g><g>${headSVG(c, uid)}</g>${blanketSVG(c)}<g>${armSVG(c)}</g>`;
    else if (mode === 'bust') s = `<g class="r-torso">${bodySVG(c, uid)}</g><g>${headSVG(c, uid)}</g>`;
    else s = `<g>${headSVG(c, uid)}</g>`;
    el.innerHTML = s;
    const q = (x) => el.querySelector(x), qa = (x) => [...el.querySelectorAll(x)];
    const { w, h } = c.head, T0 = h * 1.2;
    const I = {
      c, mode, ck, el, v: Object.assign({}, BASE, v || {}), w, h, T: T0, B: T0 + 100,
      eyes: qa('.r-iris').map((ir, i) => { const g = ir.parentNode.parentNode; return { s: i ? 1 : -1, iris: ir, pupil: g.querySelector('.r-pupil'), hl: g.querySelector('.r-hl'), lid: g.querySelector('.r-lid'), low: g.querySelector('.r-low'), lash: g.querySelector('.r-lash'), rx: c.eye, ry: c.eye * traits(c).eyeR, wing: traits(c).fem ? 2.6 : 0 }; }),
      brows: qa('.r-brow'), mouth: q('.r-mouth'), lip: q('.r-lip'), gap: traits(c).gap, eyeR: traits(c).eyeR, head: q('.r-head'), cheeks: q('.r-cheeks'), fh: q('.r-fh'), pallor: q('.r-pallor'), green: q('.r-green'), cyan: q('.r-cyan'), sheen: q('.r-sheen'), drops: qa('.r-drop'),
      torso: q('.r-torso'), strain: q('.r-strain'), blanket: q('.r-blanket'),
      arms: qa('.r-arm').map((a) => ({ s: +a.dataset.s, skin: a.querySelector('.r-skin'), mot: a.querySelector('.r-mot'), sleeve: a.querySelector('.r-sleeve'), hand: a.querySelector('.r-hand'), x: 0, y: 0 })),
      cur: null, micro: { next: now() + rand(3, 7), start: -9, kind: 0 }, sac: { x: 0, y: 0, next: 0 }, gaze: { x: 0, y: 0, tx: 0, ty: 0, next: 0 }, blink: { next: now() + rand(.5, 3), start: -9, dur: .15 }, phase: Math.random(), poke: -9, hover: false, seed: Math.random() * 10, yawn: { next: now() + rand(5, 10), start: -9 },
    };
    const prev = cache[ck];
    if (prev && prev.key === c.__key) {
      I.cur = Object.assign({}, prev.cur); I.phase = prev.phase; I.gaze = Object.assign({}, prev.gaze); I.blink = Object.assign({}, prev.blink); I.poke = prev.poke; I.yawn = Object.assign({}, prev.yawn);
      I.arms.forEach((a, i) => { if (prev.arms[i]) { a.x = prev.arms[i].x; a.y = prev.arms[i].y; } });
    } else {
      I.cur = targets(c, derive(I.v, c));
      I.arms.forEach((a) => { a.x = a.s * c.body.w * .64; a.y = I.B + 26; });
    }
    return I;
  }
  function remember(I) { cache[I.ck] = { key: I.c.__key, cur: I.cur, phase: I.phase, gaze: I.gaze, blink: I.blink, poke: I.poke, yawn: I.yawn, arms: I.arms.map((a) => ({ x: a.x, y: a.y })) }; }
  const now = () => performance.now() / 1000;
  let pointer = { x: 0, y: 0, t: -99 };
  if (typeof addEventListener === 'function') addEventListener('pointermove', (e) => { pointer = { x: e.clientX, y: e.clientY, t: now() }; }, { passive: true });

  function step(I, t, dt, frame) {
    const c = I.c, v = I.v, d = derive(v, c), T = targets(c, d), cur = I.cur, k = 1 - Math.exp(-dt * 5);
    const calm = reduced ? 0 : 1;
    const pe = Math.max(0, 1 - (t - I.poke) / 1.6);
    if (I.hover) { T.smile = Math.min(1, T.smile + .4); T.raise += .35; }
    if (pe > 0) { if (d.alertEff < 2) { T.raise += pe * .7; if (d.painF > .5) { T.squint += pe * .3; T.worry = clamp(T.worry + pe * .3); } else T.smile = Math.min(1, T.smile + pe * .35); } else T.eye += pe * .18; }
    let yawn = 0;
    if (c.tired && calm) { if (t > I.yawn.next) { I.yawn.start = t; I.yawn.next = t + rand(9, 15); } const yt = t - I.yawn.start; if (yt >= 0 && yt < 2.2) yawn = Math.sin(Math.PI * yt / 2.2); }
    // Small, human moments when they're comfortable: a brief smile, a raised brow, a glance.
    let micro = 0;
    if (calm && d.comfort > .55 && d.alertEff === 0) { const m = I.micro; if (t > m.next) { m.start = t; m.kind = Math.random() < .55 ? 0 : 1; m.next = t + rand(5, 11); } const mt = t - m.start; if (mt >= 0 && mt < 1.6) micro = Math.sin(Math.PI * mt / 1.6); if (micro) { if (I.micro.kind === 0) T.smile = Math.min(1, T.smile + micro * .3); else { T.raise += micro * .45; } } }
    if (yawn) { T.open += yawn * .95; T.eye *= 1 - yawn; T.raise += yawn * .5; T.smile = lerp(T.smile, 0, yawn); }
    for (const key in T) cur[key] = lerp(cur[key], T[key], k);
    I.phase = (I.phase + dt * Math.max(4, v.rr) / 60) % 1; const b = breathCurve(I.phase);
    const depth = (d.alertEff === 2 ? 1.2 : 1) * (1 - cur.guard * .55) * (v.rr > 26 ? .8 : 1) * (reduced ? .6 : 1);
    // gaze
    const g = I.gaze, attentive = d.alertEff === 0 && !d.confused && !d.dizzy;
    if (attentive && (now() - pointer.t < 3 || I.hover)) {
      if (frame % 6 === 0 || !I.hc) { const r = I.head.getBoundingClientRect(); I.hc = [r.left + r.width / 2, r.top + r.height / 2]; }
      let dx = (pointer.x - I.hc[0]) / 260, dy = (pointer.y - I.hc[1]) / 260; const L = Math.hypot(dx, dy); if (L > 1) { dx /= L; dy /= L; } g.tx = dx; g.ty = dy;
    } else if (t > g.next) {
      if (d.confused) { g.tx = rand(-1, 1); g.ty = rand(-.6, .6); g.next = t + rand(.35, 1); }
      else if (d.alertEff >= 1 || d.dizzy) { g.tx = rand(-.3, .3); g.ty = rand(.3, .8); g.next = t + rand(2, 4); }
      else { if (Math.random() < .35) { g.tx = 0; g.ty = 0; } else { g.tx = rand(-.7, .7); g.ty = rand(-.35, .35); } g.next = t + rand(1.2, 3.6); }
    }
    if (pe > 0 && d.alertEff < 2) { g.tx = 0; g.ty = 0; }
    const gk = 1 - Math.exp(-dt * (reduced ? 6 : 16)); g.x = lerp(g.x, g.tx, gk); g.y = lerp(g.y, g.ty, gk);
    const sc = I.sac; if (calm && t > sc.next) { sc.x = rand(-.08, .08); sc.y = rand(-.06, .06); sc.next = t + rand(.4, 1.1); }
    // blink
    const bl = I.blink, drowsy = d.alertEff >= 1 || c.tired;
    if (t > bl.next) { bl.start = t; bl.dur = drowsy ? .4 : .15; bl.next = t + (drowsy ? rand(1.4, 3) : d.confused ? rand(1, 2.5) : rand(2.4, 6)); if (Math.random() < .14) bl.next = t + .3; }
    const bt = t - bl.start, blink = bt >= 0 && bt < bl.dur ? Math.sin(Math.PI * bt / bl.dur) : 0;
    const openAmt = clamp(cur.eye * (1 - blink) * (1 - Math.max(0, g.y) * .14)), maxOff = 2.8 + (c.eye - 9.5) * .3;
    I.eyes.forEach((e) => {
      const { rx, ry } = e, lidY = lerp(-ry * 1.02, ry * .94, 1 - openAmt), lowY = ry - cur.squint * ry * .7;
      e.lid.setAttribute('height', Math.max(0, lidY + ry + 3));
      e.low.setAttribute('y', lowY); e.low.setAttribute('height', Math.max(0, ry + 3 - lowY));
      const cy = Math.max(-ry * .08, lidY), hw = lidY < -ry * .08 ? rx + 1.2 : rx * Math.sqrt(Math.max(0, 1 - (cy / ry) ** 2)) + 1.4;
      const apex = lidY + (openAmt < .3 ? 3.2 * (1 - openAmt / .3) : 0);
      e.lash.setAttribute('d', `M ${-e.s * hw} ${cy} Q 0 ${2 * apex - cy} ${e.s * hw} ${cy}` + (e.wing ? ` L ${e.s * (hw + e.wing)} ${cy - 2.2}` : ''));
      e.iris.setAttribute('transform', `translate(${(g.x + I.sac.x) * maxOff} ${(g.y + I.sac.y) * maxOff * .8 + cur.droop * 1.5})`);
      const ir = rx * .76; e.pupil.setAttribute('r', ir * .46 * (1 + cur.dil * .42)); e.hl.setAttribute('r', ir * .29 * (1 + cur.glassy * .35));
    });
    const by = I.h * .1 - c.eye * I.eyeR - 8;
    I.brows.forEach((br) => { const s = +br.dataset.s, ang = cur.worry * 20 - cur.smile * 2; br.setAttribute('transform', `translate(${s * I.w * I.gap - s * cur.worry * 2.4} ${by - cur.raise * 4 + cur.worry * 1.8}) rotate(${s * ang})`); });
    // mouth
    const gasp = cur.strain > .05 || v.rr > 24 ? clamp(cur.strain * .8 + (v.rr - 24) / 20) * (.35 + .65 * b) : 0;
    const chatter = d.rigors && d.alertEff < 2 && calm ? (Math.sin(t * 38) > 0 ? .1 : 0) : 0;
    const open = clamp(cur.open + gasp + chatter), sm = cur.smile, mw = 18 + Math.max(0, sm) * 6 + cur.guard * 5 + open * 3;
    const my = -sm * 4.6, up = sm * 5.6 - open * 2, lo = sm * 5.6 + open * 17;
    const fd = clamp(v.facial || 0);   // facial droop: the patient's right corner (viewer's left) sags
    I.mouth.setAttribute('d', `M ${-mw / 2} ${my + fd * 7} Q 0 ${up + fd * 2.5} ${mw / 2} ${my} Q 0 ${lo + fd * 2.5} ${-mw / 2} ${my + fd * 7} Z`);
    I.mouth.setAttribute('stroke', mix(c.lip, '#5D6FA6', cur.cyan * .8));
    if (I.lip) { const lw = mw * .36, ly = Math.max(lo, my * .4) + fd * 2.5; I.lip.setAttribute('d', `M ${-lw} ${ly + 1.2} Q 0 ${ly + 7.4 - Math.min(0, sm) * 2} ${lw} ${ly + 1.2} Q 0 ${ly + 2.6} ${-lw} ${ly + 1.2} Z`); I.lip.setAttribute('fill', mix(c.lip, '#5D6FA6', cur.cyan * .8)); }
    I.cheeks.setAttribute('opacity', .5 + cur.flush * .45); I.fh.setAttribute('opacity', cur.flush * .18);
    I.pallor.setAttribute('opacity', cur.pallor * .55); I.green.setAttribute('opacity', cur.green * .24); I.cyan.setAttribute('opacity', cur.cyan * .5);
    I.sheen.setAttribute('opacity', cur.sweat * .32);
    I.drops.forEach((dr, i) => { const f = ((t * .22 + i * .37) % 1); dr.setAttribute('opacity', cur.sweat > .08 ? cur.sweat * (1 - f * .7) : 0); dr.setAttribute('transform', `translate(${dr.dataset.x} ${+dr.dataset.y + f * 12 * calm})`); });
    // motion
    const shiv = d.rigors && d.alertEff < 2 ? calm : 0, jx = shiv * Math.sin(t * 47) * 1.3, jy = shiv * Math.cos(t * 53) * .8, trem = cur.tremor * calm;
    const idle = calm * (1 - cur.droop * .6), sway = d.dizzy * calm;
    const rot = Math.sin(t * .45 + I.seed) * 1.6 * idle + g.x * 3 * idle + cur.droop * 9 + sway * Math.sin(t * 1.25) * 6 - yawn * 5;
    const hxp = Math.sin(t * .6 + I.seed) * 1.2 * idle + g.x * 2.2 * idle + sway * Math.sin(t * 1.25) * 4 + jx + trem * Math.sin(t * 61) * .6;
    const P = I.B + 40, gain = I.mode === 'bed' ? .032 : .018, riseAmt = (P - I.T) * gain * b * depth;
    const hyp = -riseAmt + cur.droop * 8 + cur.lean * 13 + jy - pe * (d.alertEff < 2 ? 3 : 0) - yawn * 3;
    I.head.setAttribute('transform', `translate(${hxp} ${hyp}) rotate(${rot} 0 ${I.h * .8}) scale(${1 + cur.lean * .06})`);
    if (I.torso) { const sy = 1 + gain * b * depth + cur.lean * .04, sx = 1 + .015 * b * depth + cur.lean * .03; I.torso.setAttribute('transform', `translate(${jx} ${jy}) translate(0 ${P}) scale(${sx} ${sy}) translate(0 ${-P})`); }
    if (I.strain) I.strain.setAttribute('opacity', cur.strain * (.6 + .4 * b));
    if (I.blanket) I.blanket.setAttribute('transform', `translate(0 ${-b * depth * 1.4})`);
    if (I.arms.length) {
      const bw = c.body.w, B = I.B, T0 = I.T;
      I.arms.forEach((a) => {
        const s = a.s; let tx = s * bw * .64, ty = B + 26;
        if (s === 1) { tx = lerp(tx, bw * .12, cur.guard); ty = lerp(ty, B + 16, cur.guard); }
        if (s === -1) {
          tx = lerp(tx, -bw * .2, cur.guard2); ty = lerp(ty, B + 22, cur.guard2);
          if (cur.pick > .02) { tx = lerp(tx, -bw * .74 + Math.sin(t * 3.1) * 9 * calm, cur.pick); ty = lerp(ty, B + 22 - Math.abs(Math.sin(t * 6.2)) * 5 * calm, cur.pick); }
        }
        tx = lerp(tx, s * bw * .42, cur.lean); ty = lerp(ty, B + 40, cur.lean);
        if (s === -1 && v.facial) { tx = lerp(tx, -bw * .72, clamp(v.facial)); ty = lerp(ty, B + 38, clamp(v.facial)); }   // weak right arm lies still
        const ak = 1 - Math.exp(-dt * 4); a.x = lerp(a.x, tx, ak); a.y = lerp(a.y, ty, ak);
        const hxh = a.x + trem * Math.sin(t * 57 + s) * 1.8 + jx, hyh = a.y + trem * Math.cos(t * 63 + s) * 1.4 + jy;
        const Sx = s * bw * .84, Sy = T0 + 24 - riseAmt - cur.lean * 7, Ex = (Sx + hxh) / 2 + s * 24, Ey = (Sy + hyh) / 2 + 8;
        const tt = .38, mx1 = lerp(Sx, Ex, tt), my1 = lerp(Sy, Ey, tt), mx2 = lerp(Ex, hxh, tt), my2 = lerp(Ey, hyh, tt), px = lerp(mx1, mx2, tt), py = lerp(my1, my2, tt);
        const dd = `M ${Sx} ${Sy} Q ${Ex} ${Ey} ${hxh} ${hyh}`; a.skin.setAttribute('d', dd); a.mot.setAttribute('d', dd); a.mot.setAttribute('opacity', cur.mottle * .75);
        a.sleeve.setAttribute('d', `M ${Sx} ${Sy} Q ${mx1} ${my1} ${px} ${py}`);
        a.hand.setAttribute('transform', `translate(${hxh} ${hyh})`);
      });
    }
  }

  /* ---------- public API ---------- */
  const VB = { icon: '-78 -96 156 160', bust: '-110 -112 220 232' };
  const enc = (v) => (v ? encodeURIComponent(JSON.stringify(v)) : '');
  function define(key, spec) { spec.__key = key; CH[key] = spec; Object.keys(stills).forEach((k) => { if (k.startsWith(key + '|')) delete stills[k]; }); }
  function has(key) { return !!CH[key]; }
  /* Placeholder markup; hydrate() turns it into a live character. */
  function icon(key, v, cls) {
    if (!CH[key]) return `<svg class="${cls || 'portrait'}" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="30" fill="var(--line)"/><path d="M42 34h16M44 34v14l-9 16h30l-9-16V34" stroke="var(--ink-2)" stroke-width="3.5" fill="none" stroke-linejoin="round"/></svg>`;
    return `<svg class="${cls || 'portrait'}" viewBox="${VB.icon}" aria-hidden="true" data-rig="${key}" data-mode="icon" data-v="${enc(v)}"></svg>`;
  }
  /* A portrait that never moves (shift-picker cards): drawn once, then reused as plain markup, so a screen full of
     faces costs nothing per frame and almost nothing per redraw. */
  const stills = {};
  function still(key, cls, vb) {
    const k = key + '|' + (vb || VB.bust), head = `<svg class="${cls || 'portrait'}" viewBox="${vb || VB.bust}" preserveAspectRatio="xMidYMax meet" aria-hidden="true"`;
    return stills[k] ? `<img class="${cls || 'portrait'}" src="${stills[k]}" alt="" aria-hidden="true" decoding="async">` : `${head} data-rig="${key}" data-mode="bust" data-still="${k}"></svg>`;
  }
  function bust(key, v, cls, vb) { return `<svg class="${cls || 'portrait'}" viewBox="${vb || VB.bust}" preserveAspectRatio="xMidYMax meet" aria-hidden="true" data-rig="${key}" data-mode="bust" data-v="${enc(v)}"></svg>`; }
  function place(key, mode, v, transform, ck) { return `<g data-rig="${key}" data-mode="${mode}" data-v="${enc(v)}" transform="${transform}"${ck ? ` data-ck="${ck}"` : ''}></g>`; }
  /* Stills below the fold wait until they're about to scroll into view, so the first screen draws only the faces
     you can see. Once drawn, a still is plain markup for the rest of the visit. */
  let io = null;
  function one(el, seen) {
    const key = el.dataset.rig, mode = el.dataset.mode || 'icon', c = CH[key]; if (!c) return;
    let ck = el.dataset.ck || key + ':' + mode; seen[ck] = (seen[ck] || 0) + 1; if (seen[ck] > 1) ck += ':' + seen[ck];
    let target = el; if (el.tagName.toLowerCase() === 'svg') { target = document.createElementNS('http://www.w3.org/2000/svg', 'g'); el.appendChild(target); }
    let v = {}; try { v = el.dataset.v ? JSON.parse(decodeURIComponent(el.dataset.v)) : {}; } catch (e) {}
    const I = build(target, c, mode, ck, v);
    step(I, now(), 1 / 60, 0);
    if (el.dataset.still) { const x = el.cloneNode(true); x.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); x.removeAttribute('class'); x.removeAttribute('data-rig'); x.removeAttribute('data-still'); stills[el.dataset.still] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(x)); el.removeAttribute('data-rig'); return; }
    live.push(I);
  }
  function hydrate(root) {
    live.forEach(remember); live = [];
    if (io) { io.disconnect(); io = null; }
    const seen = {}, vh = window.innerHeight || 800, lazy = typeof IntersectionObserver === 'function';
    root.querySelectorAll('[data-rig]').forEach((el) => {
      if (lazy && el.dataset.still && !stills[el.dataset.still] && el.getBoundingClientRect().top > vh * 1.4) {
        if (!io) io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && e.target.dataset.rig) { io.unobserve(e.target); one(e.target, {}); } }), { rootMargin: '500px 0px' });
        io.observe(el); return;
      }
      one(el, seen);
    });
    if (!running && live.length) { running = true; last = now(); requestAnimationFrame(loop); }
  }
  /* Budget: characters step at 30 fps (12 in lite mode), and only the ones on screen. Breathing and blinking
     read the same at 30 as at 60, at half the cost. */
  let last = 0, frame = 0, fps = 30;
  function loop() {
    if (!live.length) { running = false; return; }
    const t = now();
    if (t - last >= 1 / fps - .003) {
      const dt = Math.min(.12, t - last); last = t; frame++;
      if (frame % 12 === 1) live.forEach((I) => { if (!I.el.isConnected) { I.vis = false; return; } const r = I.el.getBoundingClientRect(); I.vis = r.width > 0 && r.bottom > -40 && r.top < innerHeight + 40 && r.right > -40 && r.left < innerWidth + 40; });
      for (const I of live) { if (I.vis !== false && I.el.isConnected) step(I, t, dt, frame); }
    }
    requestAnimationFrame(loop);
  }
  function setPower(p) { fps = p === 'lite' ? 12 : 30; }
  const stats = () => ({ live: live.length, onscreen: live.filter((I) => I.vis !== false && I.el.isConnected).length, fps });
  function find(ck) { return live.find((I) => I.ck === ck || I.ck.startsWith(ck + ':')); }
  function poke(ck) { const I = find(ck); if (I) { I.poke = now(); remember(I); } }
  function hover(ck, on) { const I = find(ck); if (I) I.hover = on; }
  /* What a character says when you speak to them, chosen from their current state. */
  function say(key, v) {
    const c = CH[key]; if (!c || !c.lines) return null;
    const d = derive(Object.assign({}, BASE, v || {}), c), L = c.lines;
    if (d.alertEff === 2) return { quiet: true, text: L.none };
    const pick = (k) => L[k] && { text: L[k] };
    return (d.dys > .5 && pick('dys')) || (d.hypoG > .15 && pick('hypo')) || (d.rigors && pick('chills')) || (d.anx > .4 && pick('anxious')) || (d.tremorIn > .3 && pick('shaky')) || (d.dizzy && pick('dizzy')) || (d.confused && pick('confused')) || (d.painF > .4 && pick('pain')) || (d.nausea && pick('nausea')) || (d.fever > .4 && pick('fever')) || (d.alertEff === 1 && pick('drowsy')) || (d.dys > .3 && pick('dys')) || { text: L.calm };
  }
  function setReduced(on) { reduced = !!on || osReduced; }
  setReduced(false);
  S.rig = { define, has, icon, bust, still, place, hydrate, poke, hover, say, setReduced, setPower, stats, derive, BASE };
})(window.Shift);
