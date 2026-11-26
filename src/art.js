/* The Shift — procedural editorial illustration (SVG). */
(function (S) {
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  let uid = 0;
  /* Time-of-day window light. */
  const isNight = (t) => { const a = ((S.engine.abs(t) % 1440) + 1440) % 1440; return a >= 1260 || a < 300; };
  function sky(t) {
    const a = ((S.engine.abs(t) % 1440) + 1440) % 1440; // minutes after midnight
    if (isNight(t)) return ['#2a3558', '#0b1026'];   // night
    if (a < 480) return ['#f3c9a8', '#9fb7cf'];      // dawn
    if (a < 600) return ['#f6e2c4', '#a9c7dc'];      // morning
    if (a < 1050) return ['#e8f1f6', '#8fb8d6'];     // day
    if (a < 1140) return ['#f5c48e', '#b9a9c6'];     // golden hour
    return ['#e59a78', '#3f4d7a'];                   // dusk
  }
  /* Interior light by time of day: [warm light color, strength]. Rooms are lit; night just dims the edges. */
  function lamp(t) {
    const a = ((S.engine.abs(t) % 1440) + 1440) % 1440;
    if (isNight(t)) return ['#FFD9A0', .42];
    if (a < 600) return ['#FFE6C2', .34];
    if (a < 1050) return ['#FFF3DC', .3];
    return ['#FFDDB0', .38];
  }
  const ACCENT = { med: '#93AFC7', psych: '#D2A877', peds: '#F2C35A', ob: '#D9A3B0', ed: '#8FB0A0' };
  const kindOf = (s) => { const id = (s && s.caseId) || ''; return /^psych/.test(id) ? 'psych' : /^peds/.test(id) ? 'peds' : /^ob/.test(id) ? 'ob' : /^ed/.test(id) ? 'ed' : /^icu/.test(id) ? 'icu' : /^ld/.test(id) ? 'ld' : 'med'; };
  /* Something on the wall that makes it a room someone lives in for a few days. Psych walls have nothing that can be
     pulled down or broken, so they get a painted mural; med and peds get the patient whiteboard. */
  const INK = 'var(--scene-ink, #2B2620)';
  function wallArt(kind, s, tele) {
    if (kind === 'psych') return `<g opacity=".92" transform="translate(-20 44)"><rect x="808" y="64" width="190" height="104" rx="52" fill="#E8D7BC" stroke="${INK}" stroke-width="1.5" stroke-opacity=".45" opacity=".75"/><path d="M816 150 q40 -46 82 -18 q38 -40 92 -6 V168 H816 Z" fill="#8FB094" opacity=".78"/><circle cx="954" cy="96" r="14" fill="#EBBF66" opacity=".9"/><path d="M842 120 q8 -8 16 0 M872 108 q7 -7 14 0" stroke="#5A6C7A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".75"/></g>`;
    const k = S.engine.getCase(s.caseId) || {}, aide = k.delegation && k.delegation.away && k.delegation.away(s) ? '' : ((k.staff || {})[k.cna] || {}).name || '', blue = '#214B7A', red = '#B22E24', green = '#1F6644';
    const H = 'font-family="Kalam, Segoe Print, cursive"';
    const head = kind === 'peds' ? `<text x="826" y="84" ${H} font-size="17" font-weight="700" fill="${red}">Hi! I'm your nurse</text><path d="M968 66 l5 10 11 2 -8 8 2 11 -10 -5 -10 5 2 -11 -8 -8 11 -2 Z" fill="none" stroke="#D9A21E" stroke-width="2"/>` : `<text x="826" y="84" ${H} font-size="16" font-weight="700" fill="${blue}">Your care team</text>`;
    return `<g transform="${tele ? 'translate(150 62) scale(.8)' : 'translate(-24 48) scale(.92)'}"><rect x="812" y="58" width="184" height="124" rx="4" fill="#FFFEFA" stroke="${INK}" stroke-width="2.2" stroke-opacity=".78"/><rect x="812" y="176" width="184" height="8" rx="2" fill="#BDB5A6" stroke="${INK}" stroke-width="1.6" stroke-opacity=".78"/><rect x="900" y="171" width="24" height="6" rx="2" fill="${blue}" stroke="${INK}" stroke-width="1.2"/>
      ${head}<text x="826" y="110" ${H} font-size="14" fill="${blue}">RN: you</text>${aide ? `<text x="826" y="132" ${H} font-size="14" fill="${blue}">${kind === 'icu' || kind === 'ld' ? 'Tech' : 'CNA'}: ${aide}</text>` : ''}
      <text x="826" y="${aide ? 156 : 134}" ${H} font-size="14" fill="${green}">${kind === 'peds' ? 'Mom/Dad can stay!' : kind === 'ob' ? 'Feeds: every 2-3 h' : kind === 'ed' ? 'Waiting on: results' : kind === 'icu' ? 'Visiting: open' : kind === 'ld' ? 'Birth plan: ask me' : 'Goal: home soon'}</text><path d="M828 ${aide ? 162 : 140} q40 4 92 -1" stroke="${green}" stroke-width="1.6" fill="none" opacity=".7"/>
      <path d="M940 120 q8 -12 22 -4 q-6 14 -18 10" stroke="#C9C3B6" stroke-width="5" fill="none" opacity=".55" stroke-linecap="round"/></g>`;
  }
  const hot = (id, label, inner) => `<g class="clue" data-act="clue" data-id="${id}" tabindex="0" role="button" aria-label="${label}">${inner}</g>`;

  /* Room scene. The patient is a live rig character centered at x 515; f = scene flags from the case; v = rig inputs. */
  function room(def, s, P, f, v, callLight, tension) {
    const [s1, s2] = sky(s.t), gid = 'r' + (++uid), X = 515, R = S.rig, [lc, ls] = lamp(s.t), night = isNight(s.t), kind = kindOf(s), acc = ACCENT[kind];
    const Hc = def.look.head.h, B = 150 + Hc * 1.2 + 100;       // blanket top in room coordinates
    let back = '', front = '', mon = 0;   // mon: the bedside monitor's alarm level (0 quiet, 1 out of range, 2 needs someone now)
    // headwall with recessed clinical gas ports and oxygen flowmeter
    const psy = !!f.psych, wood = '#B3885E', woodD = '#8D6641';
    if (psy) back += `<rect x="438" y="66" width="154" height="22" rx="6" fill="var(--scene-panel)" stroke="${INK}" stroke-width="1.5" stroke-opacity=".55" opacity=".82"/>`;
    if (!psy || f.o2) back += `<rect x="402" y="56" width="226" height="38" rx="6" fill="var(--scene-panel)" stroke="${INK}" stroke-width="1.8" stroke-opacity=".76"/><rect x="412" y="63" width="28" height="24" rx="3" fill="#E3EDE6" stroke="${INK}" stroke-width="1.3" stroke-opacity=".65"/><circle cx="426" cy="75" r="6" fill="#5D9E75" stroke="${INK}" stroke-width="1.3"/><rect x="446" y="63" width="26" height="24" rx="3" fill="#F3E8CE" stroke="${INK}" stroke-width="1.3" stroke-opacity=".65"/><circle cx="459" cy="75" r="5.5" fill="#D9A234" stroke="${INK}" stroke-width="1.3"/><rect x="590" y="64" width="26" height="22" rx="3" fill="var(--scene-frame)" stroke="${INK}" stroke-width="1.3" stroke-opacity=".65"/><circle cx="598" cy="75" r="2.2" fill="${INK}" opacity=".5"/><circle cx="608" cy="75" r="2.2" fill="${INK}" opacity=".5"/>`;
    if (!psy || f.o2) back += hot('o2', 'Oxygen flowmeter', `<rect x="562" y="61" width="17" height="37" rx="4" fill="#E1ECE8" stroke="${INK}" stroke-width="1.6"/><path d="M570.5 66 v27" stroke="${INK}" stroke-width=".9" opacity=".35"/><circle cx="570.5" cy="${f.o2 ? 91 - Math.min(+f.o2 || 2, 10) * 2.4 : 89}" r="3.5" fill="${+f.o2 >= 5 ? '#D9822B' : '#268462'}" stroke="${INK}" stroke-width="1"/>${f.o2 ? `<path d="M570.5 98 C 572 140 590 160 576 172" stroke="#9FC7D0" stroke-width="3.2" fill="none"/><rect x="538" y="100" width="36" height="16" rx="4" fill="#FFFEFA" stroke="${INK}" stroke-width="1.4"/><text x="556" y="111.5" text-anchor="middle" font-size="10" font-weight="700" fill="${+f.o2 >= 5 ? '#87510B' : '#1F6644'}" font-family="Atkinson Hyperlegible Mono, monospace">${+f.o2 || 2} L</text>` : ''}`);
    if (f.tele) {
      const vv = S.engine.api(s).vitals(def.id), hr = vv.HR, o2 = +vv.SpO2 || 98;
      // Age-appropriate monitor alarm thresholds: a 4-month-old infant at HR 148 is normal, not a code alarm.
      const hrNorm = (def.norms && def.norms.HR) || [55, 100], o2Lo = (def.norms && def.norms.SpO2 && def.norms.SpO2[0]) || 92;
      const hrCrit = hr < Math.max(35, hrNorm[0] - 15) || hr > hrNorm[1] + 40;
      const hrWarn = hr < Math.max(45, hrNorm[0] - 5) || hr > hrNorm[1] + 20;
      const o2Crit = o2 < o2Lo - 4, o2Warn = o2 < o2Lo;
      let lvl = o2Crit || hrCrit ? 2 : o2Warn || hrWarn ? 1 : 0;
      const efm = f.efm || null;
      if (efm) {
        if (efm.cat >= 3 || efm.fhr < 100) lvl = 2;
        else if (efm.cat === 2 || efm.fhr < 110 || efm.fhr > 160 || efm.toco === 'tachy') lvl = Math.max(lvl, 1);
      }
      if (f.ventAlarm) lvl = 2;
      mon = lvl; const ALC = ['#DED8CA', '#E5AE32', '#E55B50'][lvl];
      if (efm) {
        // Live 2-channel SVG Fetal Monitor Strip: upper FHR trace (baseline + variability + decels), lower TOCO trace.
        const fy = (bpm) => Math.max(118, Math.min(162, 166 - ((bpm - 60) / 140) * 46));
        const baseY = fy(efm.fhr);
        const ampV = efm.var === 'absent' ? 0.6 : efm.var === 'min' ? 1.8 : 4.2;
        const fhrPts = Array.from({ length: 28 }, (_, i) => {
          const x = 648 + i * 4.7;
          let dip = 0;
          if (efm.decel === 'late' && ((i >= 8 && i <= 14) || (i >= 20 && i <= 26))) dip = 16 * Math.sin(((i % 12) - 8 + 12) % 12 / 6 * Math.PI);
          else if (efm.decel === 'var' && (i === 9 || i === 10 || i === 21 || i === 22)) dip = 18;
          else if (efm.decel === 'prolonged' && i >= 6) dip = Math.min(22, (i - 5) * 3.5);
          const jitter = Math.sin(i * 2.7) * ampV + Math.cos(i * 4.1) * (ampV * 0.5);
          return `${x.toFixed(1)},${Math.max(117, Math.min(163, baseY + Math.max(0, dip) + jitter)).toFixed(1)}`;
        }).join(' ');
        const tocoPts = Array.from({ length: 28 }, (_, i) => {
          const x = 648 + i * 4.7;
          let h = 0;
          if (efm.toco === 'flat') h = 0.6;
          else if (efm.toco === 'tachy') h = Math.max(0, Math.sin(i * 0.95)) * 18 + 3;
          else h = Math.max(0, Math.sin((i - 3) * 0.52) - 0.18) * 21;
          return `${x.toFixed(1)},${(197 - h).toFixed(1)}`;
        }).join(' ');
        const fhrCol = efm.fhr < 110 || efm.fhr > 160 ? '#ff6b5f' : '#7fc8e8';
        const tocoCol = efm.toco === 'flat' ? '#ff6b5f' : efm.toco === 'tachy' ? '#F2C12E' : '#85D6A3';
        back += hot('monitor', `Fetal monitor strip: FHR ${efm.fhr}, maternal HR ${hr}, ${efm.toco === 'flat' ? 'loss of uterine tone' : efm.toco === 'tachy' ? 'tachysystole' : 'regular contractions'}`,
          `<rect x="634" y="100" width="154" height="114" rx="10" fill="${ALC}" stroke="${INK}" stroke-width="2.2"/>
          <rect x="640" y="106" width="142" height="100" rx="5" fill="#132127" stroke="${INK}" stroke-width="1.4"/>
          <rect x="644" y="114" width="134" height="52" rx="3" fill="#172930"/>
          <path d="M644 127 h134 M644 140 h134 M644 153 h134" stroke="#253f48" stroke-width=".75"/>
          <rect x="644" y="170" width="134" height="32" rx="3" fill="#172930"/>
          <path d="M644 181 h134 M644 192 h134" stroke="#253f48" stroke-width=".75"/>
          <polyline points="${fhrPts}" fill="none" stroke="${fhrCol}" stroke-width="1.9"/>
          <polyline points="${tocoPts}" fill="none" stroke="${tocoCol}" stroke-width="1.9"/>
          ${lvl === 2 ? `<path d="M711 107 l6 10 h-12 Z" fill="#ff6b5f" class="blink"/>` : ''}
          <text x="647" y="124" fill="${fhrCol}" font-size="8.5" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">FHR</text>
          <text x="774" y="125" text-anchor="end" fill="${fhrCol}" font-size="13" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">${efm.fhr}</text>
          <text x="647" y="179" fill="${tocoCol}" font-size="8" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">TOCO${efm.toco === 'tachy' ? ' · TACHY' : efm.toco === 'flat' ? ' · FLAT' : ''}</text>
          <text x="774" y="179" text-anchor="end" fill="#58d68d" font-size="9.5" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">MHR ${hr}</text>
          <rect x="706" y="214" width="10" height="44" rx="2" fill="#9A968C" stroke="${INK}" stroke-width="1.6"/>`);
      } else {
        // Multi-parameter bedside monitor: framed editorial casing with ECG + HR, pleth + SpO2, NIBP/MAP + RR.
        const amp = Math.max(2, Math.min(9, (o2 - 80) * .55));
        const pleth = Array.from({ length: 14 }, (_, i) => `${648 + i * 7.5},${162 - (i % 3 === 1 ? amp : i % 3 === 2 ? amp * .35 : 0)}`).join(' ');
        const mapVal = Math.round((vv.SBP + 2 * vv.DBP) / 3);
        const bpStr = kind === 'icu' ? `${vv.SBP}/${vv.DBP} (${mapVal})` : `${vv.SBP}/${vv.DBP}`;
        back += hot('monitor', `Bedside monitor: heart rate ${hr}, SpO₂ ${vv.SpO2}%, BP ${vv.SBP}/${vv.DBP}, RR ${vv.RR}`, `<rect x="635" y="101" width="154" height="106" rx="10" fill="${ALC}" stroke="${INK}" stroke-width="2.2"/><rect x="641" y="107" width="142" height="92" rx="5" fill="#132127" stroke="${INK}" stroke-width="1.4"/><path d="M645 130 h134 M645 154 h134 M645 178 h134" stroke="#223740" stroke-width=".7"/>${lvl === 2 ? `<path d="M712 110 l6.5 11 h-13 Z" fill="#ff6b5f" class="blink"/>` : ''}
          <polyline points="${f.teleWave === 'afib' ? '648,140 652,138 656,141 660,139 663,140 666,127 669,147 672,140 676,138 680,141 684,139 688,140 691,125 694,148 697,140 703,139 708,141 711,140 714,126 717,147 720,140 726,138 731,141 736,139 742,140 745,127 748,147 751,140 756,139' : f.teleWave === 'tors' ? '648,140 652,128 656,154 660,122 664,158 668,120 672,160 676,122 680,158 684,128 688,150 692,134 696,146 700,132 704,150 708,122 712,158 716,120 720,160 724,122 728,156 732,126 736,152 740,134 744,146 748,138 756,140' : f.teleWave === 'stemi' ? '648,140 660,140 664,144 668,118 672,146 676,130 682,126 690,128 696,140 714,140 718,144 722,118 726,146 730,130 736,126 744,128 750,140 756,140' : f.teleWave === 'peaked' ? '648,140 658,140 662,132 666,148 670,140 678,140 685,112 692,140 704,140 708,132 712,148 716,140 724,140 731,112 738,140 756,140' : '648,140 662,140 666,128 670,150 674,140 698,140 702,125 706,151 710,140 732,140 738,132 742,146 746,140 756,140'}" stroke="#58d68d" stroke-width="1.8" fill="none" class="ecg"/>
          <polyline points="${pleth}" fill="none" stroke="${o2Warn ? '#E0A526' : '#7fc8e8'}" stroke-width="1.6" opacity=".9"/>
          <text x="648" y="122" fill="#58d68d" font-size="8.5" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">HR</text>
          <text x="776" y="126" text-anchor="end" fill="${hrCrit ? '#ff6b5f' : hrWarn ? '#F2C12E' : '#58d68d'}" font-size="16" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">${hr}</text>
          <text x="648" y="175" fill="#7fc8e8" font-size="8.5" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">SpO₂</text>
          <text x="776" y="176" text-anchor="end" fill="${o2Crit ? '#ff6b5f' : o2Warn ? '#F2C12E' : '#7fc8e8'}" font-size="13.5" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">${vv.SpO2}%</text>
          <line x1="646" y1="181" x2="778" y2="181" stroke="#22363d" stroke-width="1"/>
          <text x="648" y="194" fill="#d9e4e8" font-size="9" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">${bpStr}</text>
          <text x="776" y="194" text-anchor="end" fill="#F2C12E" font-size="9" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">RR ${vv.RR}</text>
          <circle cx="772" cy="203" r="2.2" fill="${lvl === 2 ? '#ff6b5f' : lvl === 1 ? '#F2C12E' : '#58d68d'}" stroke="${INK}" stroke-width=".8"/>
          <rect x="707" y="207" width="10" height="47" rx="2" fill="#9A968C" stroke="${INK}" stroke-width="1.6"/>`);
      }
    }
    // IV pole, editorial smart pump (and ICU vasopressor stack when f.pressor is active)
    const ivOn = f.iv && f.iv !== 'lock', blood = f.iv === 'blood', bag = blood ? '#9E1B22' : '#EBF3F5', line = blood ? '#B3262D' : '#A9C4CE';
    if (!psy || f.iv) back += hot('iv', f.pressor ? `Vasopressor pump: ${f.pressor.drug} ${f.pressor.rate} mcg/min` : 'IV site and pump', `<rect x="234" y="50" width="60" height="350" fill="#fff" fill-opacity="0"/><rect x="259" y="52" width="6" height="348" fill="#A6A39A" stroke="${INK}" stroke-width="1.4"/><path d="M244 52 h36" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>
      ${ivOn ? `<path d="M250 58 q-8 30 8 48 q14 -18 6 -48 Z" fill="${bag}" stroke="${INK}" stroke-width="1.6"/><rect x="255" y="106" width="6" height="12" rx="2" fill="#F6F8F9" stroke="${INK}" stroke-width="1.2"/>` : ''}${f.pressor ? `<path d="M272 58 q-6 26 6 42 q10 -16 4 -42 Z" fill="#F7E1B5" stroke="${INK}" stroke-width="1.5"/>` : ''}${f.bloodHung && !blood ? `<path d="M272 60 q-6 22 6 36 q10 -14 4 -36 Z" fill="#9E1B22" stroke="${INK}" stroke-width="1.4" opacity=".88"/><path d="M278 96 v10" stroke="${INK}" stroke-width="3.6"/>` : ''}
      <rect x="242" y="152" width="42" height="50" rx="6" fill="#E8E3D8" stroke="${INK}" stroke-width="1.8" opacity="${ivOn ? 1 : .65}"/><rect x="248" y="159" width="30" height="13" rx="2.5" fill="${f.iv === 'bolus' ? '#F3C35B' : ivOn ? '#9CE0B6' : '#C9D0CC'}" stroke="${INK}" stroke-width="1.1" class="${f.iv === 'bolus' ? 'blink' : ''}"/><circle cx="253" cy="180" r="1.6" fill="${INK}" opacity=".55"/><circle cx="260" cy="180" r="1.6" fill="${INK}" opacity=".55"/><circle cx="267" cy="180" r="1.6" fill="${INK}" opacity=".55"/><circle cx="274" cy="180" r="1.6" fill="${INK}" opacity=".55"/><text x="263" y="196" text-anchor="middle" font-size="7.5" font-weight="700" fill="${INK}" font-family="Atkinson Hyperlegible Mono, monospace">${f.iv === 'bolus' ? 'BOLUS' : blood ? 'BLOOD' : ivOn ? 'RUN' : 'LOCK'}</text>
      ${f.pressor ? `<rect x="241" y="206" width="44" height="49" rx="6" fill="#18262B" stroke="${f.pressor.map < 65 ? '#E5AE32' : INK}" stroke-width="2"/><text x="263" y="219" text-anchor="middle" font-size="7.5" font-weight="700" fill="#F2C12E" font-family="Atkinson Hyperlegible Mono, monospace">${f.pressor.drug} ${f.pressor.rate}</text><text x="263" y="231" text-anchor="middle" font-size="6.8" fill="#a8c3cb" font-family="Atkinson Hyperlegible Mono, monospace">mcg/min</text><text x="263" y="246" text-anchor="middle" font-size="7.5" font-weight="700" fill="${f.pressor.map < 65 ? '#ff6b5f' : '#58d68d'}" font-family="Atkinson Hyperlegible Mono, monospace">MAP ${f.pressor.map}</text>` : ''}
      ${ivOn ? `<path d="M263 ${f.pressor ? 255 : 202} C 262 280 360 300 ${X - 50} ${B + 16}" stroke="${INK}" stroke-width="${blood ? 4.2 : 3.4}" stroke-opacity=".35" fill="none"/><path d="M263 ${f.pressor ? 255 : 202} C 262 280 360 300 ${X - 50} ${B + 16}" stroke="${line}" stroke-width="${blood ? 2.6 : 2}" fill="none"/>` : ''}`);
    if (f.pca) back += hot('pca', 'PCA pump', `<rect x="244" y="212" width="36" height="40" rx="5" fill="#EFE6D2" stroke="${INK}" stroke-width="1.6"/><rect x="250" y="218" width="24" height="10" rx="2" fill="#236658" stroke="${INK}" stroke-width="1"/><circle cx="262" cy="240" r="4" fill="#C84B3A" stroke="${INK}" stroke-width="1.1"/><path d="M262 252 C 270 330 330 350 ${X - 190} 360" stroke="${INK}" stroke-width="2.4" fill="none" opacity=".7"/><rect x="${X - 196}" y="352" width="16" height="28" rx="6" fill="#C84B3A" stroke="${INK}" stroke-width="1.6"/>`);
    // ICU Mechanical Ventilator tower + corrugated breathing circuit to ETT
    if (f.vent && !f.empty) {
      const vm = f.ventMeta || { tv: 400, peep: 8, fio2: 40, peak: 26 }, al = !!f.ventAlarm;
      const vWave = al ? '122,222 132,222 138,196 144,196 148,222 162,222 168,194 174,194 178,222 194,222 200,196 206,196 210,222' : '122,222 132,222 140,206 152,208 158,222 174,222 182,206 194,208 200,222 214,222';
      back += hot('vent', `Mechanical ventilator${al ? ': HIGH PRESSURE alarm' : ''}`, `<g>
        <rect x="148" y="274" width="38" height="114" rx="5" fill="#E1DDD2" stroke="${INK}" stroke-width="2"/>
        <rect x="130" y="384" width="74" height="12" rx="4" fill="#8C8980" stroke="${INK}" stroke-width="1.6"/>
        <circle cx="140" cy="398" r="5" fill="#465256" stroke="${INK}" stroke-width="1.3"/><circle cx="194" cy="398" r="5" fill="#465256" stroke="${INK}" stroke-width="1.3"/>
        <rect x="112" y="174" width="112" height="102" rx="9" fill="${al ? '#E55B50' : '#DED8CA'}" stroke="${INK}" stroke-width="2.2"/>
        <rect x="117" y="179" width="102" height="92" rx="5" fill="#132127" stroke="${INK}" stroke-width="1.3"/>
        ${al ? `<rect x="120" y="182" width="96" height="13" rx="3" fill="#ff6b5f" class="blink"/><text x="168" y="191.5" text-anchor="middle" font-size="8" font-weight="700" fill="#fff" font-family="Atkinson Hyperlegible Mono, monospace">HIGH PRESSURE</text>` : `<text x="122" y="192" fill="#88A9B3" font-size="8" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">VENT · AC/VC</text>`}
        <polyline points="${vWave}" fill="none" stroke="${al ? '#ff6b5f' : '#7fc8e8'}" stroke-width="1.8"/>
        <text x="122" y="244" fill="#d9e6ea" font-size="8.5" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">VT ${vm.tv}</text>
        <text x="214" y="244" text-anchor="end" fill="${al ? '#ff6b5f' : '#F2C12E'}" font-size="8.5" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">Pk ${vm.peak}</text>
        <text x="122" y="262" fill="#85D6A3" font-size="8.5" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">PEEP ${vm.peep}</text>
        <text x="214" y="262" text-anchor="end" fill="#7fc8e8" font-size="8.5" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">FiO₂ ${vm.fio2}%</text>
        <path d="M222 252 C 296 254 358 238 ${X - 24} 206" stroke="${INK}" stroke-width="8.5" stroke-opacity=".55" fill="none" stroke-linecap="round"/>
        <path d="M222 252 C 296 254 358 238 ${X - 24} 206" stroke="#B6CDD4" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M222 252 C 296 254 358 238 ${X - 24} 206" stroke="#7E9BA4" stroke-width="6" stroke-dasharray="3 5" fill="none"/>
      </g>`);
    }
    if (f.papers) back += hot('papers', 'Sketches', `<g transform="rotate(-4 330 150)"><rect x="300" y="104" width="54" height="70" fill="#FBF8EF" stroke="${INK}" stroke-width="1.5"/><path d="M308 150 q12 -30 28 -6 q8 12 12 -8" stroke="#3A5A8C" stroke-width="2" fill="none"/><circle cx="328" cy="124" r="9" fill="none" stroke="#C8553D" stroke-width="2"/></g><g transform="rotate(5 380 170)"><rect x="352" y="134" width="46" height="60" fill="#FBF8EF" stroke="${INK}" stroke-width="1.5"/><path d="M358 180 l10 -24 l8 16 l10 -20" stroke="#2E7C78" stroke-width="2" fill="none"/></g><g transform="rotate(8 680 150)"><rect x="652" y="112" width="52" height="66" fill="#FBF8EF" stroke="${INK}" stroke-width="1.5"/><path d="M660 160 q16 -34 34 0 M664 130 h28" stroke="#8C3A7A" stroke-width="2" fill="none"/></g><g transform="rotate(-7 740 190)"><rect x="716" y="160" width="48" height="60" fill="#FBF8EF" stroke="${INK}" stroke-width="1.5"/><path d="M722 200 c8 -18 16 8 24 -10 s10 6 12 -4" stroke="#C8553D" stroke-width="2" fill="none"/></g>`);
    // Headboard & pillow: safe-sleep infant cribs apply only when the patient is an infant (def.look.small);
    // adult postpartum/L&D rooms with f.crib get a separate rolling bedside bassinet instead.
    const inCrib = !!(f.crib && def.look.small);
    if (inCrib) {
      back += `<rect x="${X - 246}" y="220" width="492" height="176" rx="14" fill="#ECE6D9" stroke="${INK}" stroke-width="2.2"/><rect x="${X - 234}" y="294" width="468" height="96" rx="8" fill="#F8F5EE" stroke="${INK}" stroke-width="1.4" stroke-opacity=".5"/>`;
      if (!f.empty) back += `<g aria-hidden="true" opacity=".92"><path d="M${X - 180} 222 C ${X - 180} 152 ${X - 70} 142 ${X - 20} 156" stroke="${INK}" stroke-width="2.6" fill="none" stroke-opacity=".75"/><path d="M${X - 60} 150 h80" stroke="${INK}" stroke-width="1.8" stroke-opacity=".75"/><line x1="${X - 54}" y1="150" x2="${X - 54}" y2="176" stroke="${INK}" stroke-width="1.2" opacity=".55"/><line x1="${X - 18}" y1="150" x2="${X - 18}" y2="184" stroke="${INK}" stroke-width="1.2" opacity=".55"/><line x1="${X + 16}" y1="150" x2="${X + 16}" y2="174" stroke="${INK}" stroke-width="1.2" opacity=".55"/><ellipse cx="${X - 54}" cy="180" rx="14" ry="7" fill="#DCE9F2" stroke="${INK}" stroke-width="1.3"/><ellipse cx="${X - 18}" cy="188" rx="15" ry="7.5" fill="#F6E2B3" stroke="${INK}" stroke-width="1.3"/><ellipse cx="${X + 16}" cy="178" rx="13" ry="6.5" fill="#E3EFE4" stroke="${INK}" stroke-width="1.3"/></g>`;
    } else {
      back += `<rect x="405" y="110" width="220" height="174" rx="22" fill="${psy ? wood : 'var(--scene-headboard)'}" stroke="${INK}" stroke-width="2.2" stroke-opacity=".82"/><path d="M416 128 H614" stroke="${INK}" stroke-width="1.4" opacity=".28"/>`;
      if (!psy) back += `<g pointer-events="none"><path d="M${X - 246} 296 L${X - 236} 234 Q${X - 232} 222 ${X - 216} 224 L${X - 200} 228 L${X - 204} 302 Z" fill="var(--scene-headboard)" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><rect x="${X - 234} " y="246" width="22" height="34" rx="5" fill="#B5C4CE" stroke="${INK}" stroke-width="1.3"/><path d="M${X + 246} 296 L${X + 236} 234 Q${X + 232} 222 ${X + 216} 224 L${X + 200} 228 L${X + 204} 302 Z" fill="var(--scene-headboard)" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><rect x="${X + 212}" y="246" width="22" height="34" rx="5" fill="#B5C4CE" stroke="${INK}" stroke-width="1.3"/></g>`;
      back += `<ellipse cx="${X}" cy="238" rx="124" ry="47" fill="var(--scene-pillow)" stroke="${INK}" stroke-width="1.8" stroke-opacity=".82"/><path d="M${X - 96} 230 q22 10 38 6 M${X + 96} 230 q-22 10 -38 6" stroke="${INK}" stroke-width="1.2" fill="none" opacity=".28" stroke-linecap="round"/>`;
    }
    if (f.commode) back += hot('commode', 'Bedside commode', `<g transform="translate(140 318)"><rect x="0" y="0" width="70" height="12" rx="4" fill="#A9A59B" stroke="${INK}" stroke-width="1.6"/><path d="M6 12 L2 62 M64 12 L68 62" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/><rect x="12" y="14" width="46" height="26" rx="5" fill="#ECEAE3" stroke="${INK}" stroke-width="1.5"/></g>`);
    if (f.bipap) back += hot('bipap', 'BiPAP machine', `<rect x="300" y="330" width="66" height="44" rx="7" fill="#E3DFD6" stroke="${INK}" stroke-width="1.8"/><rect x="310" y="338" width="30" height="14" rx="2" fill="#18272c" stroke="${INK}" stroke-width="1.1"/><path d="M366 346 C 420 330 440 240 ${X - 26} 205" stroke="${INK}" stroke-width="8.5" stroke-opacity=".4" fill="none"/><path d="M366 346 C 420 330 440 240 ${X - 26} 205" stroke="#B9C6CA" stroke-width="6" fill="none"/>`);
    if (f.cpap) back += hot('cpap', 'CPAP machine', `<rect x="150" y="352" width="54" height="34" rx="7" fill="#E3DFD6" stroke="${INK}" stroke-width="1.8"/><circle cx="189" cy="369" r="7" fill="#C4BFB4" stroke="${INK}" stroke-width="1.3"/><path d="M170 352 C 170 330 200 326 214 312" stroke="${INK}" stroke-width="3.2" stroke-opacity=".55" fill="none"/>`);
    // patient
    const person = f.empty
      ? `<rect x="${X - 236}" y="${B}" width="472" height="140" rx="10" fill="var(--scene-blanket)" stroke="${INK}" stroke-width="2" opacity=".9"/><rect x="${X - 90}" y="${B - 20}" width="180" height="26" rx="10" fill="var(--scene-sheet)" stroke="${INK}" stroke-width="1.6"/><text x="${X}" y="${B + 70}" text-anchor="middle" fill="var(--ink-2)" font-size="18" font-family="Atkinson Hyperlegible Next, sans-serif" font-style="italic">${f.emptyText || 'Bed stripped. Transferred to ICU.'}</text>`
      : `<g class="pt" data-act="poke" tabindex="0" role="button" aria-label="Speak to ${def.name}">${def.look.small ? `<rect x="${X - 236}" y="${B + 4}" width="472" height="140" rx="10" fill="var(--scene-blanket)" opacity="${inCrib ? .35 : .55}"/>` : ''}${R.place(def.id, 'bed', v, def.look.small ? `translate(${X} ${150 + (1 - def.look.small) * 330}) scale(${def.look.small})` : `translate(${X} 150)`, 'room:' + def.id)}</g>`;
    if (f.elevated && !f.empty) front += hot('leg', 'Elevated left leg', `<rect x="${X + 70}" y="${B + 4}" width="160" height="58" rx="20" fill="#fff" opacity="0"/><path d="M${X + 96} ${B + 22} q 44 -10 96 2" stroke="#D8918A" stroke-width="4" stroke-dasharray="3 4" fill="none" opacity=".75"/>`);
    // Chest tube drainage system (Pleur-Evac / Atrium 3-chamber unit)
    if (f.ctube && !f.empty) {
      const lv = Math.max(0.15, Math.min(0.88, f.ctLevel || 0.5)), fh = Math.round(lv * 54), fy = 394 - fh;
      front += hot('ctube', `Chest tube drainage system${f.ctClot ? ' (clots visible in tubing)' : ''}`, `<g>
        <path d="M${X - 72} ${B + 18} C ${X - 120} ${B + 32} 364 316 350 326" stroke="${INK}" stroke-width="6.5" stroke-opacity=".45" fill="none"/>
        <path d="M${X - 72} ${B + 18} C ${X - 120} ${B + 32} 364 316 350 326" stroke="${f.ctClot ? '#5E1117' : '#A43A3E'}" stroke-width="4.2" fill="none"/>
        ${f.ctClot ? `<path d="M${X - 88} ${B + 22} l-18 6 M368 318 l-12 5" stroke="#2D070A" stroke-width="5.5" stroke-linecap="round"/>` : ''}
        <rect x="306" y="324" width="68" height="76" rx="6" fill="#F2EFE8" stroke="${INK}" stroke-width="2"/>
        <rect x="312" y="334" width="14" height="60" rx="2" fill="#DCE9EE" stroke="${INK}" stroke-width="1.1"/>
        <rect x="313" y="376" width="12" height="17" fill="#77B8D1" opacity=".78"/>
        <rect x="329" y="334" width="16" height="60" rx="2" fill="#FFFEFA" stroke="${INK}" stroke-width="1.1"/>
        <rect x="330" y="${fy}" width="14" height="${fh}" fill="#A6282E" opacity=".9"/>
        <rect x="348" y="334" width="18" height="60" rx="2" fill="#FFFEFA" stroke="${INK}" stroke-width="1.1"/>
        <rect x="349" y="${fy + 6}" width="16" height="${Math.max(8, fh - 6)}" fill="#A6282E" opacity=".76"/>
        <path d="M329 348 h16 M329 362 h16 M329 376 h16 M348 348 h18 M348 362 h18 M348 376 h18" stroke="${INK}" stroke-width=".9" opacity=".6"/>
        ${f.ctClot ? `<circle cx="364" cy="330" r="4.5" fill="#ff6b5f" stroke="${INK}" stroke-width="1" class="blink"/>` : ''}
      </g>`);
    }
    // foley & groin dressing
    if (f.groin && !f.empty) front += hot('groin', 'Right groin dressing', `<g transform="translate(${X + 44} ${B + 46})"><rect x="-22" y="-12" width="44" height="26" rx="5" fill="#fff" opacity="0"/><rect x="-16" y="-8" width="32" height="18" rx="4" fill="#FAF7F0" stroke="${INK}" stroke-width="1.5"/><path d="M-10 -2 h20 M-10 4 h20" stroke="${INK}" stroke-width="1.2" opacity=".35"/></g>`);
    if (f.foley) front += hot('foley', 'Foley bag', `<g transform="translate(${X + 170} 392)"><path d="M0 0 q-8 16 4 30" stroke="#D9C86E" stroke-width="3.2" fill="none"/><rect x="-14" y="26" width="36" height="40" rx="6" fill="#F5E592" stroke="${INK}" stroke-width="1.7"/></g>`);
    // bed frame and alarm
    front += psy ? `<rect x="${X - 244}" y="400" width="488" height="40" rx="8" fill="${wood}" stroke="${INK}" stroke-width="2"/><path d="M${X - 244} 412 H${X + 244}" stroke="${woodD}" stroke-width="2" opacity=".6"/>` : `<rect x="${X - 244}" y="400" width="488" height="16" rx="5" fill="var(--scene-bedframe)" stroke="${INK}" stroke-width="2"/><rect x="${X - 224}" y="416" width="10" height="22" fill="var(--scene-bedframe)" stroke="${INK}" stroke-width="1.6"/><rect x="${X + 214}" y="416" width="10" height="22" fill="var(--scene-bedframe)" stroke="${INK}" stroke-width="1.6"/>`;
    let alarm = '';
    if (f.fallPrec) alarm = hot('alarm', 'Fall precautions', `<rect x="${X - 230}" y="396" width="46" height="9" rx="3" fill="#F0B64A" stroke="${INK}" stroke-width="1.4" class="alarm-lamp"/><rect x="${X - 180}" y="420" width="140" height="10" rx="3" fill="#6B8F9A" stroke="${INK}" stroke-width="1.2" opacity=".72"/>`);
    else if (def.id === '416' && !f.empty) alarm = hot('alarm', 'Bed rails and alarm', `<rect x="${X - 232}" y="300" width="18" height="90" rx="4" fill="#fff" fill-opacity="0" stroke="${INK}" stroke-width="2" stroke-dasharray="4 4" stroke-opacity=".55"/>`);
    // overbed table and its contents (editorial ink contours on every interactive clue)
    let tbl = '';
    if (f.tray && f.tray !== 'none') tbl += hot('tray', 'Meal tray', `<rect x="776" y="278" width="66" height="14" rx="3" fill="#E8E4DA" stroke="${INK}" stroke-width="1.5"/>${f.tray === 'full' || f.tray === 'untouched' ? `<ellipse cx="796" cy="277" rx="14" ry="6" fill="#F5E7C8" stroke="${INK}" stroke-width="1.2"/><ellipse cx="824" cy="277" rx="10" ry="5" fill="#E9C77F" stroke="${INK}" stroke-width="1.2"/>` : f.tray === 'barely' ? `<ellipse cx="796" cy="277" rx="14" ry="6" fill="#F5E7C8" stroke="${INK}" stroke-width="1.2"/><ellipse cx="824" cy="277" rx="5" ry="3" fill="#E9C77F" stroke="${INK}" stroke-width="1.1"/>` : f.tray === 'soup' ? `<rect x="786" y="248" width="22" height="30" rx="5" fill="#B4453B" stroke="${INK}" stroke-width="1.4"/><rect x="786" y="244" width="22" height="6" rx="2" fill="#7C2F28" stroke="${INK}" stroke-width="1.2"/>` : f.tray === 'sealed' ? `<path d="M784 276 l6 -14 h16 l6 14 Z" fill="#E6D2A8" stroke="${INK}" stroke-width="1.2" opacity=".75"/><rect x="816" y="262" width="14" height="14" rx="1" fill="#F2F0EA" stroke="${INK}" stroke-width="1.1" opacity=".8"/><path d="M800 278 h26" stroke="${INK}" stroke-width="1.6" stroke-dasharray="3 3" opacity=".45"/>` : f.tray === 'renal' ? `<path d="M782 272 q14 -14 30 -4 q-14 2 -30 4Z" fill="#F2CF4A" stroke="${INK}" stroke-width="1.3"/><rect x="818" y="256" width="14" height="20" rx="2" fill="#F5A031" stroke="${INK}" stroke-width="1.3" opacity=".95"/><ellipse cx="800" cy="277" rx="12" ry="4" fill="#E9D7B0" stroke="${INK}" stroke-width="1.1"/>` : `<rect x="784" y="262" width="14" height="16" rx="2" fill="#F2B85B" stroke="${INK}" stroke-width="1.2" opacity=".9"/><rect x="804" y="266" width="16" height="10" rx="2" fill="#D85F60" stroke="${INK}" stroke-width="1.2" opacity=".85"/>`}`);
    if (f.soda) tbl += hot('soda', 'Large soda cup', `<path d="M850 240 L872 240 L868 292 L854 292Z" fill="#DC4B3F" stroke="${INK}" stroke-width="1.5"/><rect x="848" y="236" width="26" height="6" rx="2" fill="#FFFEFA" stroke="${INK}" stroke-width="1.3"/><path d="M864 236 L870 216" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><path d="M864 236 L870 216" stroke="#FFFEFA" stroke-width="1.8" stroke-linecap="round"/>`);
    if (f.is) tbl += hot('is', 'Incentive spirometer', `<rect x="850" y="248" width="24" height="44" rx="4" fill="${f.isUsed ? '#DFF1F7' : '#EAEFE9'}" stroke="${INK}" stroke-width="1.5"/><circle cx="862" cy="${f.isUsed ? 262 : 284}" r="4.5" fill="#2D7896" stroke="${INK}" stroke-width="1.1"/>${f.isUsed ? '' : `<path d="M846 246 L878 294" stroke="${INK}" stroke-width="1.3" opacity=".35"/>`}`);
    if (f.aids) tbl += hot('aids', 'Glasses and hearing aids', `<rect x="778" y="280" width="34" height="12" rx="5" fill="#6D4A63" stroke="${INK}" stroke-width="1.3"/><circle cx="824" cy="284" r="7" fill="none" stroke="${INK}" stroke-width="2.2"/><circle cx="842" cy="284" r="7" fill="none" stroke="${INK}" stroke-width="2.2"/><path d="M831 284 h4" stroke="${INK}" stroke-width="2"/>`);
    if (f.tablet) tbl += hot('tablet', 'Tablet', `<rect x="776" y="${f.tray && f.tray !== 'none' ? 270 : 286}" width="46" height="6" rx="2" fill="#2D3438" stroke="${INK}" stroke-width="1.1"/><rect x="780" y="${f.tray && f.tray !== 'none' ? 267 : 283}" width="38" height="3" fill="#6FA0C4"/>`);
    if (f.gingerale) tbl += hot('gingerale', 'Ginger ale', `<rect x="852" y="266" width="14" height="26" rx="3" fill="#74A868" stroke="${INK}" stroke-width="1.4"/><rect x="852" y="270" width="14" height="6" fill="#EFE6BE"/>`);
    if (f.letter) tbl += hot('letter', 'Envelope on the desk', `<rect x="780" y="278" width="40" height="14" rx="1" fill="#FBF7EC" stroke="${INK}" stroke-width="1.3" transform="rotate(-3 800 285)"/><path d="M781 279 l19 7 l19 -7" stroke="${INK}" stroke-width="1.1" fill="none" opacity=".6" transform="rotate(-3 800 285)"/><circle cx="846" cy="286" r="6" fill="#FFFEFA" stroke="${INK}" stroke-width="1.8"/><path d="M846 283 v3 h2" stroke="${INK}" stroke-width="1.2"/>`);
    if (f.basin) tbl += hot('basin', 'Emesis basin', `<path d="M780 280 q4 12 22 12 q14 0 16 -8 q10 8 22 -2 q2 -6 -4 -8 Z" fill="#F0B7C0" stroke="${INK}" stroke-width="1.5"/><rect x="848" y="266" width="12" height="26" rx="2" fill="#E7F1F4" stroke="${INK}" stroke-width="1.4"/>`);
    if (f.headphones) tbl += hot('headphones', 'Headphones', `<path d="M836 286 q0 -26 22 -26 q22 0 22 26" stroke="${INK}" stroke-width="4" fill="none"/><rect x="830" y="278" width="12" height="16" rx="4" fill="#32383D" stroke="${INK}" stroke-width="1.3"/><rect x="874" y="278" width="12" height="16" rx="4" fill="#32383D" stroke="${INK}" stroke-width="1.3"/>`);
    if (f.cups) tbl += hot('cups', 'Paper cups', `<g transform="translate(118 196)">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${-9 + (i % 2) * 2} ${-i * 5} l18 0 l-3 -12 l-12 0 Z" fill="#F8F6F0" stroke="${INK}" stroke-width="1.2"/>`).join('')}</g><rect x="98" y="150" width="44" height="50" fill="#fff" fill-opacity="0"/>`);
    if (f.pitcher) tbl += hot('pitcher', 'Marked water pitcher', `<path d="M782 292 l2 -34 h20 l3 34 Z" fill="#DDEFF5" stroke="${INK}" stroke-width="1.5"/><path d="M786 270 h18 M786 278 h18 M786 286 h18" stroke="#2D7896" stroke-width="1.2"/><path d="M804 262 q10 2 6 14" stroke="${INK}" stroke-width="1.8" fill="none"/>`);
    if (f.radio) tbl += hot('radio', 'Radio', `<rect x="836" y="266" width="44" height="26" rx="4" fill="#7D5C48" stroke="${INK}" stroke-width="1.6"/><circle cx="848" cy="279" r="6" fill="#3A2A20" stroke="${INK}" stroke-width="1.1"/><rect x="858" y="272" width="16" height="5" rx="1" fill="#E8D9A0" stroke="${INK}" stroke-width="1"/><path d="M842 266 l14 -14" stroke="${INK}" stroke-width="1.6"/>`);
    if (f.neb) tbl += hot('neb', 'Nebulizer', `<rect x="778" y="266" width="40" height="26" rx="5" fill="#E6EAE7" stroke="${INK}" stroke-width="1.6"/><circle cx="790" cy="279" r="4" fill="#2D7896" stroke="${INK}" stroke-width="1"/><path d="M818 276 q18 -4 26 -20" stroke="#9FC2CD" stroke-width="3" fill="none"/><path d="M836 250 q10 -8 20 0 l-3 14 h-14 Z" fill="#D9ECF2" stroke="${INK}" stroke-width="1.4"/>`);
    if (f.dino) tbl += hot('dino', 'Plush dinosaur', `<path d="M846 290 q-2 -18 12 -24 q6 -14 18 -10 q8 4 2 12 q10 6 6 22 Z" fill="#6DAA5C" stroke="${INK}" stroke-width="1.5"/><circle cx="866" cy="260" r="1.8" fill="${INK}"/><path d="M852 290 v4 M866 290 v4" stroke="${INK}" stroke-width="2.6"/>`);
    if (f.bottle) tbl += hot('bottle', 'Baby bottle', `<rect x="852" y="258" width="16" height="34" rx="4" fill="#F9F6EE" stroke="${INK}" stroke-width="1.5"/><rect x="852" y="270" width="16" height="22" rx="3" fill="#F3E3B5" opacity=".92"/><path d="M855 258 q5 -12 10 0 Z" fill="#E8B77A" stroke="${INK}" stroke-width="1.2"/>`);
    if (f.flowers) tbl += hot('flowers', 'Card on the table', `<path d="M850 264 L876 264 L876 292 L850 292Z" fill="#FFF8EB" stroke="${INK}" stroke-width="1.5"/><path d="M856 274 q6 -6 12 0" stroke="#D96E52" stroke-width="2" fill="none"/>`);
    if (f.consent) { const cx = f.flowers && !f.tele ? 650 : 840, cy = f.flowers && !f.tele ? 152 : 260; tbl += hot('consent', 'Consent clipboard', `<rect x="${cx}" y="${cy}" width="32" height="32" rx="3" fill="#C7A274" stroke="${INK}" stroke-width="1.5"/><rect x="${cx + 4}" y="${cy + 4}" width="24" height="25" fill="#FFFEFA" stroke="${INK}" stroke-width=".9" stroke-opacity=".5"/><rect x="${cx + 10}" y="${cy - 2}" width="12" height="5" rx="1.5" fill="#7D8284" stroke="${INK}" stroke-width="1.1"/><path d="M${cx + 8} ${cy + 11} h16 M${cx + 8} ${cy + 16} h16 M${cx + 8} ${cy + 21} h10" stroke="#6E787C" stroke-width="1.3"/>`); }
    if (f.thermos) tbl += hot('thermos', 'Water thermos', `<rect x="784" y="248" width="18" height="44" rx="5" fill="#3B7A6C" stroke="${INK}" stroke-width="1.6"/><rect x="782" y="244" width="22" height="8" rx="3" fill="#2A584E" stroke="${INK}" stroke-width="1.4"/><path d="M788 260 h10" stroke="#A6D4C9" stroke-width="1.4" opacity=".75"/>`);
    front += psy ? `<g><rect x="760" y="292" width="132" height="12" rx="3" fill="${wood}" stroke="${INK}" stroke-width="1.8"/><rect x="768" y="304" width="116" height="98" rx="4" fill="${woodD}" stroke="${INK}" stroke-width="1.8"/><path d="M780 350 h92" stroke="${INK}" stroke-width="1.6" opacity=".45"/>${tbl}</g>` : `<g><rect x="764" y="292" width="124" height="12" rx="3" fill="var(--scene-table)" stroke="${INK}" stroke-width="1.9"/><rect x="820" y="304" width="9" height="98" fill="#9E9A90" stroke="${INK}" stroke-width="1.6"/><rect x="796" y="400" width="56" height="8" rx="3" fill="#7C7870" stroke="${INK}" stroke-width="1.6"/>${tbl}</g>`;
    if (f.packed) front += hot('packed', 'Packed bag by the door', `<g transform="translate(920 318)"><rect x="0" y="16" width="86" height="64" rx="10" fill="#4A5A6A" stroke="${INK}" stroke-width="1.8"/><path d="M22 16 q21 -26 42 0" stroke="${INK}" stroke-width="4.5" fill="none"/><rect x="30" y="30" width="26" height="16" fill="#F2D76B" stroke="${INK}" stroke-width="1.3"/></g>`);
    if (f.visitor) front += hot('visitor', 'Visitor\'s tote bag', `<g transform="translate(792 336)"><path d="M0 14 h70 l-6 56 h-58 Z" fill="#C88E5A" stroke="${INK}" stroke-width="1.8"/><path d="M16 14 q19 -24 38 0" stroke="${INK}" stroke-width="3.8" fill="none"/><path d="M40 12 q14 -16 4 -26 q-10 -8 -2 -18" stroke="#EDEDED" stroke-width="3" fill="none"/></g>`);
    // Safe-sleep crib rails for infant patients; rolling acrylic bedside bassinet for adult postpartum/L&D mothers.
    if (inCrib && !f.empty) front += hot('crib', 'Crib rails', `<rect x="${X - 244}" y="286" width="488" height="120" fill="#fff" fill-opacity="0"/><rect x="${X - 246}" y="284" width="492" height="10" rx="5" fill="#ECE6D9" stroke="${INK}" stroke-width="1.8"/>${Array.from({ length: 19 }, (_, i) => `<rect x="${X - 236 + i * 26}" y="294" width="5" height="108" rx="2" fill="#F5F1E7" stroke="${INK}" stroke-width="1.1" stroke-opacity=".7"/>`).join('')}<rect x="${X - 250}" y="236" width="12" height="174" rx="5" fill="#ECE6D9" stroke="${INK}" stroke-width="1.8"/><rect x="${X + 238}" y="236" width="12" height="174" rx="5" fill="#ECE6D9" stroke="${INK}" stroke-width="1.8"/>`);
    else if (f.crib && !f.empty) front += hot('crib', 'Bassinet', `<g><rect x="148" y="286" width="78" height="36" rx="7" fill="#EBF4F7" fill-opacity=".8" stroke="${INK}" stroke-width="1.8"/><rect x="154" y="308" width="66" height="11" rx="4" fill="#FAF7F0" stroke="${INK}" stroke-width="1.1" stroke-opacity=".5"/><ellipse cx="184" cy="306" rx="18" ry="8" fill="#DCE9F5" stroke="${INK}" stroke-width="1.2"/><circle cx="170" cy="304" r="6" fill="#E8C2A2" stroke="${INK}" stroke-width="1.2"/><rect x="152" y="322" width="70" height="6" rx="2" fill="#A9B3B6" stroke="${INK}" stroke-width="1.4"/><rect x="160" y="328" width="54" height="58" rx="4" fill="#EAECE9" stroke="${INK}" stroke-width="1.7"/><rect x="166" y="336" width="42" height="18" rx="2" fill="#FFFEFA" stroke="${INK}" stroke-width="1.2"/><path d="M164 386 v14 M210 386 v14" stroke="${INK}" stroke-width="3"/><circle cx="164" cy="402" r="4" fill="#465256" stroke="${INK}" stroke-width="1.2"/><circle cx="210" cy="402" r="4" fill="#465256" stroke="${INK}" stroke-width="1.2"/></g>`);
    if (f.walker) front += hot('walker', 'Walker', `<g transform="translate(930 250)"><rect x="-6" y="-6" width="62" height="168" fill="#fff" fill-opacity="0"/><path d="M0 0 L10 150 M50 0 L40 150 M0 0 H50 M4 60 H46" stroke="${INK}" stroke-width="6.5" stroke-opacity=".5" fill="none" stroke-linecap="round"/><path d="M0 0 L10 150 M50 0 L40 150 M0 0 H50 M4 60 H46" stroke="#B5B2A8" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="10" cy="152" r="5" fill="#4E4C48" stroke="${INK}" stroke-width="1.3"/><circle cx="40" cy="152" r="5" fill="#4E4C48" stroke="${INK}" stroke-width="1.3"/></g>`);
    // Hospital visitor recliner with rounded back, armrests, and crisp editorial ink contours
    if (f.family) front += hot('family', f.familyLabel || 'Family at the bedside', `<g>
      <path d="M904 268 Q904 234 934 234 H992 Q1022 234 1022 268 V340 H904 Z" fill="#6F868F" stroke="${INK}" stroke-width="2"/>
      <rect x="914" y="242" width="98" height="58" rx="18" fill="#8199A2" stroke="${INK}" stroke-width="1.2" stroke-opacity=".4" opacity=".75"/>
      ${R.place(f.family, 'bust', null, 'translate(963 250) scale(.62)', 'room:' + f.family)}
      <rect x="896" y="316" width="22" height="84" rx="10" fill="#647B84" stroke="${INK}" stroke-width="1.8"/>
      <rect x="1008" y="316" width="22" height="84" rx="10" fill="#647B84" stroke="${INK}" stroke-width="1.8"/>
      <rect x="914" y="336" width="98" height="66" rx="12" fill="#6F868F" stroke="${INK}" stroke-width="1.8"/>
    </g>`);
    front += alarm;
    const light = callLight ? `<circle cx="1004" cy="30" r="10" fill="#F0B64A" class="blink"/>` : '';
    // Room atmosphere (--scene-alarm, --scene-glow): a monitor alarming tints the edges of the room; at night the
    // screen is the brightest thing in it.
    const atmos = (mon === 2 ? `<rect class="scene-alarm" width="1030" height="440" fill="url(#${gid}a)" pointer-events="none"/>` : '') + (night && f.tele ? `<ellipse cx="710" cy="150" rx="120" ry="70" fill="url(#${gid}g)" pointer-events="none"/>` : '');
    return `<svg class="scene ${night ? 'tod-night' : 'tod-day'} ${mon ? 'mon-' + mon : ''}" viewBox="0 30 1030 410" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Room ${def.room}. ${def.name} in bed. Select objects in the room to inspect them, or ${def.short} to speak with them.">
      <defs><linearGradient id="${gid}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s2}"/><stop offset="1" stop-color="${s1}"/></linearGradient>
      <radialGradient id="${gid}v" cx=".5" cy=".5" r=".75"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="${tension ? '#5a0f0a' : '#000'}" stop-opacity="${tension ? '.38' : '.07'}"/></radialGradient>
      <radialGradient id="${gid}l" cx="${X}" cy="36" r="430" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${lc}" stop-opacity="${ls}"/><stop offset=".55" stop-color="${lc}" stop-opacity="${ls * .35}"/><stop offset="1" stop-color="${lc}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${gid}p"><stop offset="0" stop-color="${lc}" stop-opacity="${night ? .2 : .14}"/><stop offset="1" stop-color="${lc}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${gid}n" cx="${X}" cy="250" r="560" gradientUnits="userSpaceOnUse"><stop offset=".4" stop-color="#0a1230" stop-opacity="0"/><stop offset="1" stop-color="#0a1230" stop-opacity=".42"/></radialGradient>
      <linearGradient id="${gid}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${gid}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#000" stop-opacity=".06"/></linearGradient>
      <radialGradient id="${gid}a" cx=".5" cy=".5" r=".72"><stop offset=".55" style="stop-color:var(--scene-alarm);stop-opacity:0"/><stop offset="1" style="stop-color:var(--scene-alarm);stop-opacity:.34"/></radialGradient>
      <radialGradient id="${gid}g"><stop offset="0" style="stop-color:var(--scene-glow);stop-opacity:.28"/><stop offset="1" style="stop-color:var(--scene-glow);stop-opacity:0"/></radialGradient></defs>
      <rect width="1030" height="440" fill="var(--scene-wall)"/><rect width="1030" height="378" fill="url(#${gid}w)"/>
      <rect y="292" width="1030" height="86" fill="${acc}" opacity=".16"/><path d="M0 292 H1030" stroke="${INK}" stroke-width="1.6" opacity=".32"/><path d="M0 296 H1030" stroke="${acc}" stroke-width="3" opacity=".48"/><rect y="378" width="1030" height="62" fill="var(--scene-floor)"/><path d="M0 378 H1030" stroke="var(--scene-trim)" stroke-width="5"/><path d="M0 376 H1030 M0 381 H1030" stroke="${INK}" stroke-width="1.3" opacity=".42"/><rect y="381" width="1030" height="59" fill="url(#${gid}f)"/>
      <rect width="1030" height="440" fill="url(#${gid}l)" pointer-events="none"/>
      <g><rect x="${X - 78}" y="30" width="156" height="11" rx="4" fill="#FBF5E6" stroke="${INK}" stroke-width="1.6" stroke-opacity=".75"/><rect x="${X - 62}" y="37" width="124" height="3.5" rx="1.5" fill="${lc}" opacity=".95"/></g>
      ${!psy ? `<g pointer-events="none" opacity="${night ? .55 : .88}"><rect x="976" y="30" width="54" height="350" fill="#6F94A2" stroke="${INK}" stroke-width="1.8"/><path d="M990 30 V380 M1006 30 V380 M1020 30 V380" stroke="${INK}" stroke-width="1.3" opacity=".38"/></g>` : ''}
      ${wallArt(kind, s, !!f.tele)}
      <polygon points="40,212 222,212 470,440 0,440" fill="${night ? '#9FB4E0' : s1}" opacity="${night ? .08 : .26}" pointer-events="none"/>
      <g><rect x="40" y="42" width="182" height="170" rx="4" fill="url(#${gid}s)" stroke="var(--scene-frame)" stroke-width="9"/><rect x="35.5" y="37.5" width="191" height="179" rx="5" fill="none" stroke="${INK}" stroke-width="2" stroke-opacity=".78"/><path d="M40 176 q44 -26 90 -8 q44 14 92 -12 V212 H40Z" fill="#8AA99A" opacity=".52"/>${isNight(s.t) ? '<circle cx="178" cy="78" r="13" fill="#F4EBD0" opacity=".9"/><circle cx="184" cy="74" r="11" fill="#2a3558" opacity=".9"/><circle cx="70" cy="64" r="1.6" fill="#fff"/><circle cx="104" cy="96" r="1.2" fill="#fff"/><circle cx="200" cy="112" r="1.2" fill="#fff"/>' : ''}<path d="M131 42 V212 M40 127 H222" stroke="var(--scene-frame)" stroke-width="5"/><path d="M128.5 42 V212 M133.5 42 V212 M40 124.5 H222 M40 129.5 H222" stroke="${INK}" stroke-width="1" opacity=".45"/><rect x="30" y="211" width="202" height="9" rx="2.5" fill="var(--scene-frame)" stroke="${INK}" stroke-width="1.8" stroke-opacity=".8"/>${f.psych ? `<g stroke="${INK}" stroke-width="1.1" opacity=".45">${Array.from({ length: 12 }, (_, i) => `<path d="M${40 + i * 16} 42 V212"/>`).join('')}${Array.from({ length: 11 }, (_, i) => `<path d="M40 ${42 + i * 16} H222"/>`).join('')}</g>` : ''}</g>
      <ellipse cx="${X}" cy="250" rx="360" ry="190" fill="url(#${gid}p)" pointer-events="none"/>${back}${person}${front}${light}
      ${night ? `<rect width="1030" height="440" fill="url(#${gid}n)" pointer-events="none"/>` : ''}<rect width="1030" height="440" fill="url(#${gid}v)" pointer-events="none"/>${atmos}
    </svg>`;
  }

  /* Hallway with four doors. */
  function hallway(s, doors) {
    const gid = 'h' + (++uid);
    const n = doors.length, x0 = 170, span = 1060 - x0 - 20, dw = Math.min(150, (span - (n - 1) * 30) / n), gap = n > 1 ? (span - n * dw) / (n - 1) : 0;
    const d = doors.map((o, i) => {
      const x = x0 + i * (dw + gap);
      if (o.pending) return `<g class="door pending" aria-label="Room ${o.room}, admission arriving">
        <rect x="${x - 10}" y="58" width="${dw + 20}" height="232" rx="4" fill="var(--scene-trim)" stroke="${INK}" stroke-width="1.8" stroke-opacity=".7"/><rect x="${x}" y="68" width="${dw}" height="222" rx="2" fill="var(--door)" stroke="${INK}" stroke-width="1.4" stroke-opacity=".55" opacity=".48"/>
        <rect x="${x + dw / 2 - 30}" y="24" width="60" height="22" rx="4" fill="var(--scene-panel)" stroke="${INK}" stroke-width="1.5" stroke-opacity=".72"/>
        <text x="${x + dw / 2}" y="40" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)" font-family="Atkinson Hyperlegible Mono, monospace">${o.room}</text>
        <text x="${x + dw / 2}" y="170" text-anchor="middle" font-size="13" fill="var(--ink)" font-family="Atkinson Hyperlegible Mono, monospace">${o.label || 'Admission'}</text>
        <text x="${x + dw / 2}" y="188" text-anchor="middle" font-size="13" fill="var(--ink)" font-family="Atkinson Hyperlegible Mono, monospace">${o.eta}</text></g>`;
      return `<g class="door ${o.state || ''}" data-act="goto" data-pid="${o.pid}" tabindex="0" role="button" aria-label="Enter room ${o.room}, ${o.name}${o.alert ? ', ' + o.alert : ''}">
        <rect x="${x - 10}" y="58" width="${dw + 20}" height="232" rx="4" fill="var(--scene-trim)" stroke="${INK}" stroke-width="1.8" stroke-opacity=".78"/>
        <rect x="${x}" y="68" width="${dw}" height="222" rx="2" fill="var(--door)" stroke="${INK}" stroke-width="1.6" stroke-opacity=".8"/>
        <rect x="${x + dw - 46}" y="92" width="30" height="80" rx="2" fill="${o.gone ? 'var(--scene-wall)' : 'var(--door-glass)'}" stroke="${INK}" stroke-width="1.5" stroke-opacity=".75" opacity=".9"/>
        <rect x="${x + 16}" y="176" width="10" height="26" rx="3" fill="#B5B1A6" stroke="${INK}" stroke-width="1.4"/>
        <rect x="${x + dw / 2 - 30}" y="24" width="60" height="22" rx="4" fill="var(--scene-panel)" stroke="${INK}" stroke-width="1.5" stroke-opacity=".78"/>
        <text x="${x + dw / 2}" y="40" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)" font-family="Atkinson Hyperlegible Mono, monospace">${o.room}</text>
        <circle cx="${x + dw / 2 + 44}" cy="35" r="7" fill="${o.light ? '#f0b64a' : 'var(--line)'}" stroke="${INK}" stroke-width="1.4" stroke-opacity=".75" class="${o.light ? 'blink' : ''}"/>
        ${o.prn ? `<g class="door-note ${o.prn.late ? 'late' : ''}" transform="translate(${x + 10} 98)" aria-hidden="true"><rect width="62" height="30" rx="6" fill="${o.prn.late ? '#F2C12E' : '#FCEBB4'}" stroke="${INK}" stroke-width="1.5"/><text x="31" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="#3B2700" font-family="Atkinson Hyperlegible Next, sans-serif">PRN ↺</text></g>` : ''}
        <rect class="door-hi" x="${x}" y="68" width="${dw}" height="222" rx="2" fill="#fff" opacity="0"/>
      </g>`;
    }).join('');
    const warm = sky(s.t)[0], kc = s.unit ? null : S.engine.getCase(s.caseId), unit = s.unit || (kc && kc.unitShort) || '4 West', rn = doors.map((o) => o.room);
    return `<svg class="hall" viewBox="0 0 1060 300" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Hallway. Rooms ${rn[0]} to ${rn[rn.length - 1]}.">
      <defs><linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="-400" x2="530" y1="0" y2="0"><stop offset="0" stop-color="${warm}" stop-opacity=".42"/><stop offset="1" stop-color="${warm}" stop-opacity="0"/></linearGradient></defs>
      <rect x="-2000" width="5060" height="300" fill="var(--scene-wall)"/><rect x="-2000" y="290" width="5060" height="10" fill="var(--scene-floor)"/>
      <rect x="-2000" y="206" width="5060" height="6" fill="var(--scene-trim)"/><path d="M-2000 206 H3060 M-2000 212 H3060 M-2000 290 H3060" stroke="${INK}" stroke-width="1.3" opacity=".36"/>
      <rect x="18" y="80" width="112" height="200" rx="5" fill="var(--scene-panel)" stroke="${INK}" stroke-width="1.8" stroke-opacity=".78"/><rect x="30" y="92" width="88" height="54" rx="4" fill="#132127" stroke="${INK}" stroke-width="1.5"/>
      <text x="74" y="126" text-anchor="middle" font-size="16" font-weight="700" fill="#9fe0b8" font-family="Atkinson Hyperlegible Mono, monospace">${S.engine.clock(s.t)}</text>
      <text x="74" y="176" text-anchor="middle" font-size="12" fill="var(--ink-2)" font-family="Atkinson Hyperlegible Mono, monospace">${unit}</text>
      ${d}
      <rect x="-2000" width="5060" height="300" fill="url(#${gid})" pointer-events="none"/>
    </svg>`;
  }

  S.art = { room, hallway };
})(window.Shift);
