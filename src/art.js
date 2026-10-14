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
  function wallArt(kind, s, tele) {
    if (kind === 'psych') return `<g opacity=".9" transform="translate(-20 44)"><rect x="808" y="64" width="190" height="104" rx="52" fill="#E8D7BC" opacity=".55"/><path d="M816 150 q40 -46 82 -18 q38 -40 92 -6 V168 H816 Z" fill="#9DBF9C" opacity=".7"/><circle cx="954" cy="96" r="14" fill="#F2C46B" opacity=".85"/><path d="M842 120 q8 -8 16 0 M872 108 q7 -7 14 0" stroke="#7A8C9A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/></g>`;
    const k = S.engine.getCase(s.caseId) || {}, aide = ((k.staff || {})[k.cna] || {}).name || '', blue = '#2B4C8C', red = '#B83A2E', green = '#2E7B4E';
    const H = 'font-family="Kalam, Segoe Print, cursive"';
    const head = kind === 'peds' ? `<text x="826" y="84" ${H} font-size="17" font-weight="700" fill="${red}">Hi! I'm your nurse</text><path d="M968 66 l5 10 11 2 -8 8 2 11 -10 -5 -10 5 2 -11 -8 -8 11 -2 Z" fill="none" stroke="#D9A21E" stroke-width="2"/>` : `<text x="826" y="84" ${H} font-size="16" font-weight="700" fill="${blue}">Your care team</text>`;
    return `<g transform="${tele ? 'translate(150 62) scale(.8)' : 'translate(-24 48) scale(.92)'}"><rect x="812" y="58" width="184" height="124" rx="3" fill="#FCFCFA" stroke="#B8BCC0" stroke-width="4"/><rect x="812" y="176" width="184" height="8" rx="2" fill="#9EA4AA"/><rect x="900" y="172" width="22" height="6" rx="2" fill="${blue}"/>
      ${head}<text x="826" y="110" ${H} font-size="14" fill="${blue}">RN: you</text>${aide ? `<text x="826" y="132" ${H} font-size="14" fill="${blue}">${kind === 'icu' || kind === 'ld' ? 'Tech' : 'CNA'}: ${aide}</text>` : ''}
      <text x="826" y="${aide ? 156 : 134}" ${H} font-size="14" fill="${green}">${kind === 'peds' ? 'Mom/Dad can stay!' : kind === 'ob' ? 'Feeds: every 2-3 h' : kind === 'ed' ? 'Waiting on: results' : kind === 'icu' ? 'Visiting: open' : kind === 'ld' ? 'Birth plan: ask me' : 'Goal: home soon'}</text><path d="M828 ${aide ? 162 : 140} q40 4 92 -1" stroke="${green}" stroke-width="1.6" fill="none" opacity=".7"/>
      <path d="M940 120 q8 -12 22 -4 q-6 14 -18 10" stroke="#C9CDD1" stroke-width="5" fill="none" opacity=".5" stroke-linecap="round"/></g>`;
  }
  const hot = (id, label, inner) => `<g class="clue" data-act="clue" data-id="${id}" tabindex="0" role="button" aria-label="${label}">${inner}</g>`;

  /* Room scene. The patient is a live rig character centered at x 515; f = scene flags from the case; v = rig inputs. */
  function room(def, s, P, f, v, callLight, tension) {
    const [s1, s2] = sky(s.t), gid = 'r' + (++uid), X = 515, R = S.rig, [lc, ls] = lamp(s.t), night = isNight(s.t), kind = kindOf(s), acc = ACCENT[kind];
    const Hc = def.look.head.h, B = 150 + Hc * 1.2 + 100;       // blanket top in room coordinates
    let back = '', front = '';
    // headwall with outlets and oxygen flowmeter
    const psy = !!f.psych, wood = '#A9825C', woodD = '#8A6644';
    if (psy) back += `<rect x="438" y="66" width="154" height="22" rx="6" fill="var(--scene-panel)" opacity=".7"/>`;
    if (!psy || f.o2) back += `<rect x="404" y="58" width="222" height="34" rx="7" fill="var(--scene-panel)"/><circle cx="426" cy="75" r="6.5" fill="#6FA785"/><circle cx="446" cy="75" r="6.5" fill="var(--scene-frame)" stroke="#9AA9A6"/><rect x="592" y="67" width="22" height="16" rx="3" fill="var(--scene-frame)" stroke="#9AA9A6"/>`;
    if (!psy || f.o2) back += hot('o2', 'Oxygen flowmeter', `<rect x="562" y="62" width="16" height="36" rx="4" fill="#DCE8E5" stroke="#86A39C"/><circle cx="570" cy="${f.o2 ? 92 - Math.min(+f.o2 || 2, 10) * 2.4 : 90}" r="3.5" fill="${+f.o2 >= 5 ? '#D9822B' : '#2F8F6B'}"/>${f.o2 ? `<path d="M570 98 C 572 140 590 160 576 172" stroke="#BFE2E8" stroke-width="3" fill="none"/>` : ''}`);
    if (f.tele) {
      const vv = S.engine.api(s).vitals(def.id), hr = vv.HR;
      // Labor rooms: the bedside screen is the fetal monitor, so it shows the baby's heart rate under the mother's.
      const fm = /FHR\D*?(\d+)(s)?/.exec(vv.extra || ''), fhr = fm ? +fm[1] + (fm[2] ? 5 : 0) : 0;
      back += hot('monitor', `${fhr ? 'Bedside and fetal monitor' : 'Cardiac monitor'}: heart rate ${hr}, ${fhr ? `fetal heart rate ${fhr}` : `SpO₂ ${vv.SpO2}%`}`, `<rect x="648" y="112" width="124" height="74" rx="7" fill="#0f1b1f" stroke="#2b3a3f" stroke-width="3"/>
        <polyline points="${f.teleWave === 'afib' ? '656,152 660,150 664,153 668,151 671,152 674,138 677,160 680,152 684,150 688,153 692,151 696,152 699,136 702,161 705,152 711,151 716,153 719,152 722,137 725,160 728,152 734,150 739,153 744,151 750,152 753,138 756,160 759,152 764,151' : f.teleWave === 'tors' ? '656,152 660,140 664,166 668,134 672,170 676,130 680,174 684,132 688,170 692,140 696,162 700,146 704,158 708,144 712,162 716,134 720,172 724,128 728,176 732,130 736,170 740,138 744,164 748,146 752,158 756,150 764,152' : f.teleWave === 'stemi' ? '656,152 668,152 672,156 676,128 680,158 684,142 690,138 698,140 704,152 722,152 726,156 730,128 734,158 738,142 744,138 752,140 758,152 764,152' : f.teleWave === 'peaked' ? '656,152 666,152 670,144 674,160 678,152 686,152 693,122 700,152 712,152 716,144 720,160 724,152 732,152 739,122 746,152 764,152' : '656,152 670,152 674,140 678,162 682,152 706,152 710,136 714,164 718,152 740,152 746,144 750,158 754,152 764,152'}" stroke="#58d68d" stroke-width="1.8" fill="none" class="ecg"/>
        <text x="764" y="132" text-anchor="end" fill="${hr < 50 ? '#ff6b5f' : '#58d68d'}" font-size="16" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">${hr}</text>
        <text x="656" y="132" fill="#58d68d" font-size="9" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">HR</text><text x="656" y="180" fill="#7fc8e8" font-size="9" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">${fhr ? 'FHR' : 'SpO₂'}</text><text x="764" y="180" text-anchor="end" fill="${fhr && (fhr < 110 || fhr > 160) ? '#ff6b5f' : '#7fc8e8'}" font-size="13" font-weight="700" font-family="Atkinson Hyperlegible Mono, monospace">${fhr || S.engine.api(s).vitals(def.id).SpO2}</text><path d="M710 186 V 250" stroke="#8F9A98" stroke-width="4"/>`);
    }
    // IV pole, pump and line
    const ivOn = f.iv && f.iv !== 'lock', blood = f.iv === 'blood', bag = blood ? '#9E1B22' : '#E8F2F6', line = blood ? '#B3262D' : '#BCD7E0';
    if (!psy || f.iv) back += hot('iv', 'IV site and pump', `<rect x="236" y="50" width="56" height="350" fill="#fff" fill-opacity="0"/><path d="M262 52 V400" stroke="#8F9A98" stroke-width="4.5"/><path d="M246 52 h32" stroke="#8F9A98" stroke-width="4"/>
      ${ivOn ? `<path d="M250 58 q-8 30 8 48 q14 -18 6 -48 Z" fill="${bag}" stroke="#9FB6C1" stroke-width="1.5"/>` : ''}${f.bloodHung && !blood ? `<path d="M272 60 q-6 22 6 36 q10 -14 4 -36 Z" fill="#9E1B22" opacity=".8"/><path d="M278 96 v10" stroke="#555" stroke-width="4"/>` : ''}
      <rect x="247" y="160" width="32" height="44" rx="5" fill="#E4EBE9" stroke="#8A9A96" opacity="${ivOn ? 1 : .55}"/><rect x="252" y="167" width="22" height="11" rx="2" fill="${f.iv === 'bolus' ? '#F3C35B' : ivOn ? '#9FE0B8' : '#C9D2CF'}" class="${f.iv === 'bolus' ? 'blink' : ''}"/>
      ${ivOn ? `<path d="M263 204 C 262 280 360 300 ${X - 50} ${B + 16}" stroke="${line}" stroke-width="${blood ? 3 : 2.4}" fill="none"/>` : ''}`);
    if (f.pca) back += hot('pca', 'PCA pump', `<rect x="244" y="212" width="36" height="40" rx="5" fill="#EFE6D2" stroke="#9A8E72"/><rect x="250" y="218" width="24" height="10" rx="2" fill="#2F6B5A"/><circle cx="262" cy="240" r="4" fill="#C84B3A"/><path d="M262 252 C 270 330 330 350 ${X - 190} 360" stroke="#6E6A60" stroke-width="2.4" fill="none"/><rect x="${X - 196}" y="352" width="16" height="28" rx="6" fill="#C84B3A" stroke="#7C2A20"/>`);
    if (f.papers) back += hot('papers', 'Sketches', `<g transform="rotate(-4 330 150)"><rect x="300" y="104" width="54" height="70" fill="#FBF8EF" stroke="#D8D0BC"/><path d="M308 150 q12 -30 28 -6 q8 12 12 -8" stroke="#3A5A8C" stroke-width="2" fill="none"/><circle cx="328" cy="124" r="9" fill="none" stroke="#C8553D" stroke-width="2"/></g><g transform="rotate(5 380 170)"><rect x="352" y="134" width="46" height="60" fill="#FBF8EF" stroke="#D8D0BC"/><path d="M358 180 l10 -24 l8 16 l10 -20" stroke="#2E7C78" stroke-width="2" fill="none"/></g><g transform="rotate(8 680 150)"><rect x="652" y="112" width="52" height="66" fill="#FBF8EF" stroke="#D8D0BC"/><path d="M660 160 q16 -34 34 0 M664 130 h28" stroke="#8C3A7A" stroke-width="2" fill="none"/></g><g transform="rotate(-7 740 190)"><rect x="716" y="160" width="48" height="60" fill="#FBF8EF" stroke="#D8D0BC"/><path d="M722 200 c8 -18 16 8 24 -10 s10 6 12 -4" stroke="#C8553D" stroke-width="2" fill="none"/></g>`);
    back += `<rect x="409" y="112" width="212" height="170" rx="26" fill="${psy ? wood : 'var(--scene-headboard)'}"/><ellipse cx="${X}" cy="238" rx="122" ry="46" fill="var(--scene-pillow)"/>`;
    if (f.commode) back += hot('commode', 'Bedside commode', `<g transform="translate(140 318)"><rect x="0" y="0" width="70" height="12" rx="4" fill="#9AA6A9"/><path d="M6 12 L2 62 M64 12 L68 62" stroke="#9AA6A9" stroke-width="5"/><rect x="12" y="14" width="46" height="26" rx="5" fill="#E6EBEA" stroke="#9AA6A9"/></g>`);
    if (f.bipap) back += hot('bipap', 'BiPAP machine', `<rect x="300" y="330" width="66" height="44" rx="7" fill="#DDE4E6" stroke="#8B979A"/><rect x="310" y="338" width="30" height="14" rx="2" fill="#1d2b30"/><path d="M366 346 C 420 330 440 240 ${X - 26} 205" stroke="#B9C6CA" stroke-width="7" fill="none"/>`);
    if (f.cpap) back += hot('cpap', 'CPAP machine', `<rect x="150" y="352" width="54" height="34" rx="7" fill="#DFE3E3" stroke="#9AA4A4"/><circle cx="189" cy="369" r="7" fill="#BCC4C4"/><path d="M170 352 C 170 330 200 326 214 312" stroke="#BCC4C4" stroke-width="3" fill="none"/>`);
    // patient
    const person = f.empty
      ? `<rect x="${X - 236}" y="${B}" width="472" height="140" rx="10" fill="var(--scene-blanket)" opacity=".8"/><rect x="${X - 90}" y="${B - 20}" width="180" height="26" rx="10" fill="var(--scene-sheet)"/><text x="${X}" y="${B + 70}" text-anchor="middle" fill="var(--ink-2)" font-size="18" font-family="Atkinson Hyperlegible Next, sans-serif" font-style="italic">${f.emptyText || 'Bed stripped. Transferred to ICU.'}</text>`
      : `<g class="pt" data-act="poke" tabindex="0" role="button" aria-label="Speak to ${def.name}">${def.look.small ? `<rect x="${X - 236}" y="${B + 4}" width="472" height="140" rx="10" fill="var(--scene-blanket)" opacity=".55"/>` : ''}${R.place(def.id, 'bed', v, def.look.small ? `translate(${X} ${150 + (1 - def.look.small) * 330}) scale(${def.look.small})` : `translate(${X} 150)`, 'room:' + def.id)}</g>`;
    if (f.elevated && !f.empty) front += hot('leg', 'Elevated left leg', `<rect x="${X + 70}" y="${B + 4}" width="160" height="58" rx="20" fill="#fff" opacity="0"/><path d="M${X + 96} ${B + 22} q 44 -10 96 2" stroke="#D8918A" stroke-width="4" stroke-dasharray="3 4" fill="none" opacity=".75"/>`);
    // foley
    if (f.groin && !f.empty) front += hot('groin', 'Right groin dressing', `<g transform="translate(${X + 44} ${B + 46})"><rect x="-22" y="-12" width="44" height="26" rx="5" fill="#fff" opacity="0"/><rect x="-16" y="-8" width="32" height="18" rx="4" fill="#F4F1EA" stroke="#C9C2B4" stroke-width="1.5"/><path d="M-10 -2 h20 M-10 4 h20" stroke="#D9D2C4" stroke-width="1.5"/></g>`);
    if (f.foley) front += hot('foley', 'Foley bag', `<g transform="translate(${X + 170} 392)"><path d="M0 0 q-8 16 4 30" stroke="#E7D98F" stroke-width="3" fill="none"/><rect x="-14" y="26" width="36" height="40" rx="6" fill="#F7EBA4" stroke="#B9AD6A"/></g>`);
    // bed frame and alarm
    front += psy ? `<rect x="${X - 244}" y="400" width="488" height="40" rx="8" fill="${wood}"/><path d="M${X - 244} 412 H${X + 244}" stroke="${woodD}" stroke-width="2" opacity=".6"/>` : `<rect x="${X - 242}" y="402" width="484" height="14" rx="5" fill="var(--scene-bedframe)"/><rect x="${X - 224}" y="416" width="9" height="22" fill="var(--scene-bedframe)"/><rect x="${X + 215}" y="416" width="9" height="22" fill="var(--scene-bedframe)"/>`;
    let alarm = '';
    if (f.fallPrec) alarm = hot('alarm', 'Fall precautions', `<rect x="${X - 230}" y="398" width="46" height="8" rx="3" fill="#F0B64A" class="alarm-lamp"/><rect x="${X - 180}" y="420" width="140" height="10" rx="3" fill="#6B8F9A" opacity=".6"/>`);
    else if (def.id === '416' && !f.empty) alarm = hot('alarm', 'Bed rails and alarm', `<rect x="${X - 232}" y="300" width="18" height="90" rx="4" fill="#fff" fill-opacity="0" stroke="#A7B3B2" stroke-width="2" stroke-dasharray="4 4"/>`);
    // overbed table and its contents
    let tbl = '';
    if (f.tray && f.tray !== 'none') tbl += hot('tray', 'Meal tray', `<rect x="776" y="278" width="66" height="14" rx="3" fill="#DFE4E2"/>${f.tray === 'full' || f.tray === 'untouched' ? `<ellipse cx="796" cy="277" rx="14" ry="6" fill="#F5E7C8"/><ellipse cx="824" cy="277" rx="10" ry="5" fill="#E9C77F"/>` : f.tray === 'barely' ? `<ellipse cx="796" cy="277" rx="14" ry="6" fill="#F5E7C8"/><ellipse cx="824" cy="277" rx="5" ry="3" fill="#E9C77F"/>` : f.tray === 'soup' ? `<rect x="786" y="248" width="22" height="30" rx="5" fill="#B4453B"/><rect x="786" y="244" width="22" height="6" rx="2" fill="#7C2F28"/>` : f.tray === 'sealed' ? `<path d="M784 276 l6 -14 h16 l6 14 Z" fill="#E6D2A8" opacity=".55"/><rect x="816" y="262" width="14" height="14" rx="1" fill="#F2F0EA" stroke="#B9B6AD" opacity=".7"/><path d="M800 278 h26" stroke="#C9C3B5" stroke-width="2" stroke-dasharray="3 3"/>` : f.tray === 'renal' ? `<path d="M782 272 q14 -14 30 -4 q-14 2 -30 4Z" fill="#F2CF4A" stroke="#B8962A"/><rect x="818" y="256" width="14" height="20" rx="2" fill="#F5A031" opacity=".9"/><ellipse cx="800" cy="277" rx="12" ry="4" fill="#E9D7B0"/>` : `<rect x="784" y="262" width="14" height="16" rx="2" fill="#F2B85B" opacity=".85"/><rect x="804" y="266" width="16" height="10" rx="2" fill="#D85F60" opacity=".75"/>`}`);
    if (f.soda) tbl += hot('soda', 'Large soda cup', `<path d="M850 240 L872 240 L868 292 L854 292Z" fill="#E24B3F"/><rect x="848" y="236" width="26" height="6" rx="2" fill="#fff"/><path d="M864 236 L870 216" stroke="#fff" stroke-width="3"/>`);
    if (f.is) tbl += hot('is', 'Incentive spirometer', `<rect x="850" y="248" width="24" height="44" rx="4" fill="${f.isUsed ? '#DFF1F7' : '#E6EEF1'}" stroke="#7EA9B8"/><circle cx="862" cy="${f.isUsed ? 262 : 284}" r="4.5" fill="#3D86A3"/>${f.isUsed ? '' : `<path d="M846 246 L878 294" stroke="#C5CED1" stroke-width="1.3"/>`}`);
    if (f.aids) tbl += hot('aids', 'Glasses and hearing aids', `<rect x="778" y="280" width="34" height="12" rx="5" fill="#6D4A63"/><circle cx="824" cy="284" r="7" fill="none" stroke="#3A3A3E" stroke-width="2.2"/><circle cx="842" cy="284" r="7" fill="none" stroke="#3A3A3E" stroke-width="2.2"/><path d="M831 284 h4" stroke="#3A3A3E" stroke-width="2"/>`);
    if (f.tablet) tbl += hot('tablet', 'Tablet', `<rect x="776" y="${f.tray && f.tray !== 'none' ? 270 : 286}" width="46" height="6" rx="2" fill="#2D3438"/><rect x="780" y="${f.tray && f.tray !== 'none' ? 267 : 283}" width="38" height="3" fill="#6FA0C4"/>`);
    if (f.gingerale) tbl += hot('gingerale', 'Ginger ale', `<rect x="852" y="266" width="14" height="26" rx="3" fill="#7BB070"/><rect x="852" y="270" width="14" height="6" fill="#E8E0B8"/>`);
    if (f.letter) tbl += hot('letter', 'Envelope on the desk', `<rect x="780" y="278" width="40" height="14" rx="1" fill="#FBF7EC" stroke="#CFC6B2" transform="rotate(-3 800 285)"/><path d="M781 279 l19 7 l19 -7" stroke="#CFC6B2" stroke-width="1.2" fill="none" transform="rotate(-3 800 285)"/><circle cx="846" cy="286" r="6" fill="none" stroke="#6B5A48" stroke-width="2"/><path d="M846 283 v3 h2" stroke="#6B5A48" stroke-width="1.2"/>`);
    if (f.basin) tbl += hot('basin', 'Emesis basin', `<path d="M780 280 q4 12 22 12 q14 0 16 -8 q10 8 22 -2 q2 -6 -4 -8 Z" fill="#F2B9C2" stroke="#C98794"/><rect x="848" y="266" width="12" height="26" rx="2" fill="#E7F1F4" stroke="#9CB8C1"/>`);
    if (f.headphones) tbl += hot('headphones', 'Headphones', `<path d="M836 286 q0 -26 22 -26 q22 0 22 26" stroke="#2D3438" stroke-width="4" fill="none"/><rect x="830" y="278" width="12" height="16" rx="4" fill="#2D3438"/><rect x="874" y="278" width="12" height="16" rx="4" fill="#2D3438"/>`);
    if (f.cups) tbl += hot('cups', 'Paper cups', `<g transform="translate(118 196)">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${-9 + (i % 2) * 2} ${-i * 5} l18 0 l-3 -12 l-12 0 Z" fill="#F5F5F0" stroke="#BDB9AE"/>`).join('')}</g><rect x="98" y="150" width="44" height="50" fill="#fff" fill-opacity="0"/>`);
    if (f.pitcher) tbl += hot('pitcher', 'Marked water pitcher', `<path d="M782 292 l2 -34 h20 l3 34 Z" fill="#DDEFF5" stroke="#8FB4C1"/><path d="M786 270 h18 M786 278 h18 M786 286 h18" stroke="#3D86A3" stroke-width="1.2"/><path d="M804 262 q10 2 6 14" stroke="#8FB4C1" stroke-width="2" fill="none"/>`);
    if (f.radio) tbl += hot('radio', 'Radio', `<rect x="836" y="266" width="44" height="26" rx="4" fill="#7A5A48" stroke="#4E3A2E"/><circle cx="848" cy="279" r="6" fill="#3A2A20"/><rect x="858" y="272" width="16" height="5" rx="1" fill="#E8D9A0"/><path d="M842 266 l14 -14" stroke="#555" stroke-width="1.5"/>`);
    if (f.neb) tbl += hot('neb', 'Nebulizer', `<rect x="778" y="266" width="40" height="26" rx="5" fill="#E4ECEF" stroke="#8FA6AE"/><circle cx="790" cy="279" r="4" fill="#3D86A3"/><path d="M818 276 q18 -4 26 -20" stroke="#BFD6DE" stroke-width="3" fill="none"/><path d="M836 250 q10 -8 20 0 l-3 14 h-14 Z" fill="#D9ECF2" stroke="#8FB4C1"/>`);
    if (f.dino) tbl += hot('dino', 'Plush dinosaur', `<path d="M846 290 q-2 -18 12 -24 q6 -14 18 -10 q8 4 2 12 q10 6 6 22 Z" fill="#6DAA5C" stroke="#4E8040"/><circle cx="866" cy="260" r="1.8" fill="#1E2A18"/><path d="M852 290 v4 M866 290 v4" stroke="#4E8040" stroke-width="3"/>`);
    if (f.bottle) tbl += hot('bottle', 'Baby bottle', `<rect x="852" y="258" width="16" height="34" rx="4" fill="#F7F4EA" stroke="#BDB6A2"/><rect x="852" y="270" width="16" height="22" rx="3" fill="#F3E3B5" opacity=".9"/><path d="M855 258 q5 -12 10 0 Z" fill="#E8B77A"/>`);
    if (f.flowers) tbl += hot('flowers', 'Card on the table', `<path d="M850 264 L876 264 L876 292 L850 292Z" fill="#FFF6E8" stroke="#D5C7AD"/><path d="M856 274 q6 -6 12 0" stroke="#E07A5F" stroke-width="2" fill="none"/>`);
    front += psy ? `<g><rect x="760" y="292" width="132" height="12" rx="3" fill="${wood}"/><rect x="768" y="304" width="116" height="98" rx="4" fill="${woodD}"/><path d="M780 350 h92" stroke="${wood}" stroke-width="2"/>${tbl}</g>` : `<g><rect x="764" y="292" width="124" height="11" rx="3" fill="var(--scene-table)"/><rect x="820" y="303" width="9" height="100" fill="#8A8F91"/><rect x="796" y="400" width="56" height="8" rx="3" fill="#6F7577"/>${tbl}</g>`;
    if (f.consent) tbl += hot('consent', 'Clipboard', `<rect x="840" y="262" width="30" height="30" rx="3" fill="#C7A57A"/><rect x="844" y="266" width="22" height="24" fill="#FAFAF7"/><path d="M848 272 h14 M848 277 h14 M848 282 h9" stroke="#9AA" stroke-width="1.3"/>`);
    if (f.thermos) tbl += hot('thermos', 'Thermos', `<rect x="784" y="248" width="16" height="44" rx="5" fill="#3E7C6E"/><rect x="782" y="244" width="20" height="8" rx="3" fill="#2C5A50"/>`);
    if (f.packed) front += hot('packed', 'Packed bag by the door', `<g transform="translate(920 318)"><rect x="0" y="16" width="86" height="64" rx="10" fill="#4A5A6A" stroke="#33404C"/><path d="M22 16 q21 -26 42 0" stroke="#33404C" stroke-width="5" fill="none"/><rect x="30" y="30" width="26" height="16" fill="#F7E27A"/></g>`);
    if (f.visitor) front += hot('visitor', 'Visitor\'s tote bag', `<g transform="translate(792 336)"><path d="M0 14 h70 l-6 56 h-58 Z" fill="#C88E5A" stroke="#8E6038"/><path d="M16 14 q19 -24 38 0" stroke="#8E6038" stroke-width="4" fill="none"/><path d="M40 12 q14 -16 4 -26 q-10 -8 -2 -18" stroke="#EDEDED" stroke-width="3" fill="none"/></g>`);
    // Crib: rails in front of a small child.
    if (f.crib && !f.empty) front += hot('crib', 'Crib rails', `<rect x="${X - 244}" y="286" width="488" height="120" fill="#fff" fill-opacity="0"/><rect x="${X - 246}" y="284" width="492" height="9" rx="4" fill="#E8E2D6" stroke="#B9B1A0"/>${Array.from({ length: 19 }, (_, i) => `<rect x="${X - 236 + i * 26}" y="292" width="5" height="110" rx="2" fill="#EFEAE0" stroke="#C9C1B0" stroke-width=".8"/>`).join('')}<rect x="${X - 250}" y="250" width="12" height="160" rx="5" fill="#E8E2D6" stroke="#B9B1A0"/><rect x="${X + 238}" y="250" width="12" height="160" rx="5" fill="#E8E2D6" stroke="#B9B1A0"/>`);
    if (f.walker) front += hot('walker', 'Walker', `<g transform="translate(930 250)"><rect x="-6" y="-6" width="62" height="168" fill="#fff" fill-opacity="0"/><path d="M0 0 L10 150 M50 0 L40 150 M0 0 H50 M4 60 H46" stroke="#9AA6A9" stroke-width="5" fill="none"/><circle cx="10" cy="152" r="5" fill="#555"/><circle cx="40" cy="152" r="5" fill="#555"/></g>`);
    if (f.family) front += hot('family', f.familyLabel || 'Family at the bedside', `<rect x="900" y="286" width="126" height="116" rx="14" fill="#8B6F5A"/><rect x="908" y="240" width="110" height="60" rx="14" fill="#9C7F69"/>${R.place(f.family, 'bust', null, 'translate(963 250) scale(.62)', 'room:' + f.family)}<rect x="900" y="330" width="126" height="72" rx="12" fill="#8B6F5A"/>`);
    front += alarm;
    const light = callLight ? `<circle cx="1004" cy="30" r="10" fill="#F0B64A" class="blink"/>` : '';
    return `<svg class="scene" viewBox="0 30 1030 410" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Room ${def.room}. ${def.name} in bed. Select objects in the room to inspect them, or ${def.short} to speak with them.">
      <defs><linearGradient id="${gid}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s2}"/><stop offset="1" stop-color="${s1}"/></linearGradient>
      <radialGradient id="${gid}v" cx=".5" cy=".5" r=".75"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="${tension ? '#5a0f0a' : '#000'}" stop-opacity="${tension ? '.38' : '.07'}"/></radialGradient>
      <radialGradient id="${gid}l" cx="${X}" cy="36" r="430" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${lc}" stop-opacity="${ls}"/><stop offset=".55" stop-color="${lc}" stop-opacity="${ls * .35}"/><stop offset="1" stop-color="${lc}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${gid}p"><stop offset="0" stop-color="${lc}" stop-opacity="${night ? .2 : .14}"/><stop offset="1" stop-color="${lc}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${gid}n" cx="${X}" cy="250" r="560" gradientUnits="userSpaceOnUse"><stop offset=".4" stop-color="#0a1230" stop-opacity="0"/><stop offset="1" stop-color="#0a1230" stop-opacity=".42"/></radialGradient>
      <linearGradient id="${gid}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${gid}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#000" stop-opacity=".06"/></linearGradient></defs>
      <rect width="1030" height="440" fill="var(--scene-wall)"/><rect width="1030" height="378" fill="url(#${gid}w)"/>
      <rect y="292" width="1030" height="86" fill="${acc}" opacity=".2"/><path d="M0 292 H1030" stroke="${acc}" stroke-width="4" opacity=".55"/><rect y="378" width="1030" height="62" fill="var(--scene-floor)"/><path d="M0 378 H1030" stroke="var(--scene-trim)" stroke-width="5"/><rect y="381" width="1030" height="59" fill="url(#${gid}f)"/>
      <rect width="1030" height="440" fill="url(#${gid}l)" pointer-events="none"/>
      <g><rect x="${X - 74}" y="30" width="148" height="9" rx="4" fill="#FFF9EC" stroke="var(--scene-trim)" stroke-width="1.5"/><rect x="${X - 60}" y="36" width="120" height="3" rx="1.5" fill="${lc}" opacity=".9"/></g>
      ${wallArt(kind, s, !!f.tele)}
      <polygon points="40,212 222,212 470,440 0,440" fill="${night ? '#9FB4E0' : s1}" opacity="${night ? .08 : .24}"/>
      <g><rect x="40" y="42" width="182" height="170" rx="5" fill="url(#${gid}s)" stroke="var(--scene-frame)" stroke-width="9"/><path d="M40 176 q44 -26 90 -8 q44 14 92 -12 V212 H40Z" fill="#8AA99A" opacity=".55"/>${isNight(s.t) ? '<circle cx="178" cy="78" r="13" fill="#F4EBD0" opacity=".9"/><circle cx="184" cy="74" r="11" fill="#2a3558" opacity=".9"/><circle cx="70" cy="64" r="1.6" fill="#fff"/><circle cx="104" cy="96" r="1.2" fill="#fff"/><circle cx="200" cy="112" r="1.2" fill="#fff"/>' : ''}<path d="M131 42 V212 M40 127 H222" stroke="var(--scene-frame)" stroke-width="5"/>${f.psych ? `<g stroke="var(--scene-frame)" stroke-width="1.1" opacity=".55">${Array.from({ length: 12 }, (_, i) => `<path d="M${40 + i * 16} 42 V212"/>`).join('')}${Array.from({ length: 11 }, (_, i) => `<path d="M40 ${42 + i * 16} H222"/>`).join('')}</g>` : ''}</g>
      <ellipse cx="${X}" cy="250" rx="360" ry="190" fill="url(#${gid}p)" pointer-events="none"/>${back}${person}${front}${light}
      ${night ? `<rect width="1030" height="440" fill="url(#${gid}n)" pointer-events="none"/>` : ''}<rect width="1030" height="440" fill="url(#${gid}v)" pointer-events="none"/>
    </svg>`;
  }

  /* Hallway with four doors. */
  function hallway(s, doors) {
    const gid = 'h' + (++uid);
    const n = doors.length, x0 = 170, span = 1060 - x0 - 20, dw = Math.min(150, (span - (n - 1) * 30) / n), gap = n > 1 ? (span - n * dw) / (n - 1) : 0;
    const d = doors.map((o, i) => {
      const x = x0 + i * (dw + gap);
      if (o.pending) return `<g class="door pending" aria-label="Room ${o.room}, admission arriving">
        <rect x="${x - 10}" y="58" width="${dw + 20}" height="232" rx="4" fill="var(--scene-trim)"/><rect x="${x}" y="68" width="${dw}" height="222" rx="2" fill="var(--door)" opacity=".45"/>
        <rect x="${x + dw / 2 - 30}" y="24" width="60" height="22" rx="3" fill="var(--scene-panel)"/>
        <text x="${x + dw / 2}" y="40" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)" font-family="Atkinson Hyperlegible Mono, monospace">${o.room}</text>
        <text x="${x + dw / 2}" y="170" text-anchor="middle" font-size="13" fill="var(--ink)" font-family="Atkinson Hyperlegible Mono, monospace">${o.label || 'Admission'}</text>
        <text x="${x + dw / 2}" y="188" text-anchor="middle" font-size="13" fill="var(--ink)" font-family="Atkinson Hyperlegible Mono, monospace">${o.eta}</text></g>`;
      return `<g class="door ${o.state || ''}" data-act="goto" data-pid="${o.pid}" tabindex="0" role="button" aria-label="Enter room ${o.room}, ${o.name}${o.alert ? ', ' + o.alert : ''}">
        <rect x="${x - 10}" y="58" width="${dw + 20}" height="232" rx="4" fill="var(--scene-trim)"/>
        <rect x="${x}" y="68" width="${dw}" height="222" rx="2" fill="var(--door)"/>
        <rect x="${x + dw - 46}" y="92" width="30" height="80" rx="2" fill="${o.gone ? 'var(--scene-wall)' : 'var(--door-glass)'}" opacity=".85"/>
        <rect x="${x + 16}" y="176" width="10" height="26" rx="3" fill="#a3aaa8"/>
        <rect x="${x + dw / 2 - 30}" y="24" width="60" height="22" rx="3" fill="var(--scene-panel)"/>
        <text x="${x + dw / 2}" y="40" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)" font-family="Atkinson Hyperlegible Mono, monospace">${o.room}</text>
        <circle cx="${x + dw / 2 + 44}" cy="35" r="7" fill="${o.light ? '#f0b64a' : 'var(--line)'}" class="${o.light ? 'blink' : ''}"/>
        <rect class="door-hi" x="${x}" y="68" width="${dw}" height="222" rx="2" fill="#fff" opacity="0"/>
      </g>`;
    }).join('');
    const warm = sky(s.t)[0], kc = S.engine.getCase(s.caseId), unit = (kc && kc.unitShort) || '4 West', rn = doors.map((o) => o.room);
    return `<svg class="hall" viewBox="0 0 1060 300" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Hallway. Rooms ${rn[0]} to ${rn[rn.length - 1]}.">
      <defs><linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="-400" x2="530" y1="0" y2="0"><stop offset="0" stop-color="${warm}" stop-opacity=".45"/><stop offset="1" stop-color="${warm}" stop-opacity="0"/></linearGradient></defs>
      <rect x="-2000" width="5060" height="300" fill="var(--scene-wall)"/><rect x="-2000" y="290" width="5060" height="10" fill="var(--scene-floor)"/>
      <rect x="-2000" y="206" width="5060" height="6" fill="var(--scene-trim)"/>
      <rect x="18" y="80" width="112" height="200" rx="4" fill="var(--scene-panel)"/><rect x="30" y="92" width="88" height="54" rx="3" fill="#0f1b1f"/>
      <text x="74" y="126" text-anchor="middle" font-size="16" font-weight="700" fill="#9fe0b8" font-family="Atkinson Hyperlegible Mono, monospace">${S.engine.clock(s.t)}</text>
      <text x="74" y="176" text-anchor="middle" font-size="12" fill="var(--ink-2)" font-family="Atkinson Hyperlegible Mono, monospace">${unit}</text>
      ${d}
      <rect x="-2000" width="5060" height="300" fill="url(#${gid})" pointer-events="none"/>
    </svg>`;
  }

  S.art = { room, hallway };
})(window.Shift);
