/* Core Leonis sound effects — synthesized with Web Audio (no audio files). */
const Sound = (() => {
  let ctx, on = true;
  try { on = localStorage.getItem("coreleonis.sound") !== "0"; } catch (e) {}
  const ac = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  // one soft note with a quick attack and smooth decay
  function tone(freq, at, dur, type = "sine", vol = 0.12, slideTo) {
    const a = ac(), t = a.currentTime + at, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  const fx = {
    tap:      () => tone(740, 0, 0.05, "triangle", 0.05),
    tab:      () => tone(480, 0, 0.12, "sine", 0.07, 720),
    open:     () => tone(320, 0, 0.18, "sine", 0.05, 560),
    close:    () => tone(560, 0, 0.14, "sine", 0.04, 320),
    check:    () => { tone(988, 0, 0.12, "sine", 0.1); tone(1480, 0.06, 0.2, "sine", 0.08); },
    uncheck:  () => tone(520, 0, 0.1, "sine", 0.05, 400),
    save:     () => { tone(660, 0, 0.1, "sine", 0.09); tone(990, 0.08, 0.18, "sine", 0.08); },
    complete: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.07, 0.3, "triangle", 0.1)),
    stellar:  () => [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => { tone(f, i * 0.09, 0.5, "triangle", 0.09); tone(f * 2, i * 0.09 + 0.02, 0.4, "sine", 0.03); }),
    warn:     () => { tone(560, 0, 0.16, "triangle", 0.08); tone(420, 0.17, 0.22, "triangle", 0.08); },
    alarm:    () => [0, 0.22, 0.44].forEach(t => tone(880, t, 0.16, "square", 0.04, 620)),
    timer:    () => [0, 0.15, 0.3].forEach(t => tone(1175, t, 0.1, "sine", 0.1)),
    whoosh:   () => tone(200, 0, 0.3, "sine", 0.05, 900)
  };
  const buzz = { complete: 25, stellar: [30, 40, 30], alarm: [80, 60, 80], timer: [40, 40, 40] };
  return {
    play(name) {
      if (!on) return;
      try { fx[name] && fx[name](); } catch (e) {}
      try { if (buzz[name] && navigator.vibrate) navigator.vibrate(buzz[name]); } catch (e) {}
    },
    toggle() { on = !on; try { localStorage.setItem("coreleonis.sound", on ? "1" : "0"); } catch (e) {} return on; },
    get on() { return on; }
  };
})();
