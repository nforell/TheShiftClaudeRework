/* The Shift — feedback. Small synthesized sounds and haptics, no audio files.
   Every sound is built from oscillators so the game stays one self-contained file.
   Sounds confirm that an action registered. They never hint at right or wrong,
   except where the game already shows the answer (Nova's triage reveal). */
(function (S) {
  let ctx = null, master = null, on = true;

  function audio() {
    if (!on) return null;
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) { on = false; return null; }
        ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.42;
        const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (e) { on = false; return null; }
  }

  /* One voice: a pitched tone with a fast attack and an exponential tail. */
  function tone(f, at, dur, o) {
    o = o || {};
    const c = ctx, t = c.currentTime + at;
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + (o.glide || dur * 0.6));
    const peak = o.gain || 0.2;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + (o.attack || 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = osc;
    if (o.lp) { const f2 = c.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = o.lp; osc.connect(f2); node = f2; }
    node.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + dur + 0.02);
  }
  /* A short filtered noise burst: the "tick" of a physical switch. */
  function click(at, o) {
    o = o || {};
    const c = ctx, t = c.currentTime + at, len = Math.floor(c.sampleRate * 0.018);
    const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const src = c.createBufferSource(); src.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = o.f || 3200; bp.Q.value = o.q || 1.4;
    const g = c.createGain(); g.gain.value = o.gain || 0.22;
    src.connect(bp); bp.connect(g); g.connect(master); src.start(t);
  }

  // A low body under every click: the "thock" that makes it feel physical.
  const thock = (g) => tone(165, 0, .075, { to: 85, glide: .05, gain: g || .24, type: 'sine' });
  const SOUNDS = {
    // Plain buttons, tabs, navigation: a crisp switch with body.
    tap() { thock(.1); click(0, { f: 2600, q: 1.1, gain: .16 }); },
    // Choosing an answer or toggling an option: switch plus a round, upward pop.
    select() { thock(.1); click(0, { f: 3000, gain: .16 }); tone(560, .005, .13, { to: 940, glide: .045, gain: .13, type: 'triangle', lp: 2800 }); },
    // Unchecking: the same pop, falling.
    deselect() { thock(.08); click(0, { f: 2200, gain: .13 }); tone(780, 0, .1, { to: 460, glide: .05, gain: .12, type: 'triangle', lp: 2200 }); },
    // Committing (give, hold, call, delegate, lock in): a heavy press and a bright two-note confirm.
    commit() {
      thock(.16); click(0, { f: 2600, gain: .18 });
      tone(659.3, .01, .32, { gain: .15, type: 'triangle', lp: 3200 });
      tone(987.8, .085, .5, { gain: .14, type: 'sine' });
      tone(1975.5, .085, .25, { gain: .03, type: 'sine' });
    },
    // Something that can't be done: two low, dull knocks.
    nope() { tone(210, 0, .08, { gain: .12, type: 'square', lp: 700 }); tone(170, .09, .11, { gain: .11, type: 'square', lp: 600 }); click(0, { f: 900, gain: .12 }); },
    // Time passing on the clock: a soft woodblock.
    time() { tone(1180, 0, .06, { gain: .05, type: 'sine', to: 900, glide: .04 }); },
    // A new message on the unit phone.
    msg() { tone(1318.5, 0, .16, { gain: .08 }); tone(1760, .09, .26, { gain: .07 }); },
    // An urgent message: three insistent pulses, not harsh.
    urgent() { [0, .16, .32].forEach((t) => tone(740, t, .12, { gain: .11, type: 'square', lp: 1400 })); },
    // Triage reveal only, where the game already shows the answer.
    right() { [523.3, 659.3, 784].forEach((f, i) => tone(f, i * .07, .35, { gain: .12, type: 'triangle', lp: 3000 })); },
    miss() { tone(392, 0, .22, { gain: .08, type: 'triangle', lp: 1600 }); tone(329.6, .11, .3, { gain: .07, type: 'triangle', lp: 1400 }); },
    // The patient's condition changed after what you did. Worse: a low, falling pair. Better: a soft, rising pair.
    worse() { tone(311, 0, .32, { gain: .1, type: 'triangle', lp: 1200, to: 262, glide: .25 }); tone(196, .16, .5, { gain: .09, type: 'sine' }); },
    better() { tone(523.3, 0, .28, { gain: .08, type: 'sine' }); tone(784, .1, .42, { gain: .07, type: 'sine' }); },
    open() { tone(420, 0, .12, { to: 620, glide: .08, gain: .05, type: 'sine' }); },
  };
  const BUZZ = { worse: [40, 60, 40], better: 10, select: 6, deselect: 4, commit: [14, 40, 18], nope: [18, 50, 18], urgent: [30, 60, 30, 60, 30], right: 12, miss: [8, 30, 8] };

  let last = 0;
  function play(name) {
    const now = performance.now();
    if (name === 'tap' && now - last < 40) return; // don't stack a tap on top of a richer sound
    last = now;
    if (on && navigator.vibrate && BUZZ[name]) { try { navigator.vibrate(BUZZ[name]); } catch (e) { /* not supported */ } }
    const c = audio(); if (!c || !SOUNDS[name]) return;
    try { SOUNDS[name](); } catch (e) { /* audio is best-effort */ }
  }

  S.fx = { play, setOn(v) { on = !!v; }, isOn: () => on, unlock() { audio(); } };
})(window.Shift = window.Shift || {});
