/* Core Leonis — app logic. Content lives in data/content.js; you rarely need to edit this file. */
(function () {
  const C = CONTENT, KEY = "coreleonis.v1";
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, "0");
  const dkey = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const today = () => dkey(new Date());
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const dayDiff = (a, b) => Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 864e5);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mmss = s => Math.floor(s / 60) + ":" + pad(Math.floor(s % 60));
  const hhmm = ts => { const d = new Date(ts); return pad(d.getHours()) + ":" + pad(d.getMinutes()); };
  const ago = ts => { const d = dayDiff(dkey(new Date(ts)), today()); return d === 0 ? "Today " + hhmm(ts) : d === 1 ? "Yesterday" : d + " days ago"; };
  const MOODS = ["😞", "😕", "😐", "🙂", "😄"];
  const TABS = ["today", "body", "health", "sos", "rad"];

  const LOGO = `<svg class="mark" viewBox="0 0 64 64" aria-hidden="true">
    <polyline points="32,54 12,32 10,20 20,11 32,20 44,11 54,20 52,32 32,54" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" opacity=".5"/>
    ${[[12, 32], [10, 20], [20, 11], [32, 20], [44, 11], [54, 20], [52, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.8" fill="currentColor"/>`).join("")}
    <circle cx="32" cy="54" r="8" fill="#9fd3ff" opacity=".25"/>
    <path d="M32 45 L34 52 L41 54 L34 56 L32 63 L30 56 L23 54 L30 52 Z" fill="#cfeaff"/></svg>`;

  /* ---------------- state ---------------- */
  const def = () => ({
    env: "leo", streak: 0, lastActive: null, lastOpen: null, fullDays: 0,
    regions: { mind: 50, heart: 50, gut: 50, muscle: 50, shield: 50 },
    done: {}, steps: {}, history: {}, vitals: [], rad: [], spf: {}, dev: "dosimeter",
    milestones: [], tab: "today"
  });
  let S;
  try { S = Object.assign(def(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = def(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  (function dailyUpdate() { // untrained regions fade each day (deconditioning)
    const t = today();
    if (S.lastOpen && S.lastOpen !== t) {
      const gap = Math.min(dayDiff(S.lastOpen, t), 6);
      for (const r in S.regions) S.regions[r] = Math.max(0, S.regions[r] - 6 * gap);
    }
    if (S.lastActive && dayDiff(S.lastActive, t) > 1) S.streak = 0;
    S.lastOpen = t; save();
  })();

  /* ---------------- helpers ---------------- */
  const env = () => C.environments.find(e => e.id === S.env) || C.environments[1];
  const kind = () => env().kind;
  const tasks = () => [...C.tasks[kind()], ...(C.envTasks[env().id] || [])];
  const task = id => tasks().find(t => t.id === id);
  const isDone = (id, d = today()) => (S.done[d] || []).includes(id);
  const gearOf = t => t.gearBy ? (t.gearBy[env().id] || t.gearBy.default) : (t.gear || []);
  const stepsOf = id => ((S.steps[today()] || {})[id] || []);
  const stepProg = t => isDone(t.id) ? 1 : stepsOf(t.id).length / t.steps.length;
  const regColor = v => v < 35 ? "var(--coral)" : v < 70 ? "var(--amber)" : "var(--ok)";
  const bodyAvg = () => Math.round(Object.values(S.regions).reduce((a, b) => a + b, 0) / 5);
  const addRegion = (r, n) => { S.regions[r] = clamp(S.regions[r] + n, 0, 100); };
  const taskStreak = id => {
    const h = S.history[id] || []; let d = today();
    if (!h.includes(d)) d = dkey(addDays(new Date(), -1));
    let n = 0; while (h.includes(d)) { n++; d = dkey(addDays(new Date(d + "T00:00:00"), -1)); }
    return n;
  };
  const inR = (x, r) => x >= r[0] && x <= r[1];
  const st1 = (o, x) => inR(x, o.ok) ? 0 : inR(x, o.watch) ? 1 : 2;
  const vSt = (v, e) => ["good", "watch", "alert"][Math.max(st1(v, e.v), v.pair && e.v2 != null ? st1(v.pair, e.v2) : 0)];
  const vFmt = (v, e) => v.scale ? MOODS[e.v - 1] : v.pair ? `${e.v}/${e.v2}` : e.v;
  const lastV = id => { for (let i = S.vitals.length - 1; i >= 0; i--) if (S.vitals[i].id === id) return S.vitals[i]; return null; };
  const vAlerts = () => C.vitals.filter(v => { const l = lastV(v.id); return l && vSt(v, l) === "alert"; });
  const lastRad = k => { for (let i = S.rad.length - 1; i >= 0; i--) if (S.rad[i].k === k) return S.rad[i]; return null; };
  const radIdx = (k, x) => C.radiation[k].levels.findIndex(l => x <= l.max);
  const sevOf = cls => cls === "alert" ? "critical" : cls === "watch" ? "caution" : "ok";
  const gearChip = g => C.gear[g] ? `<button class="gchip" data-act="gear" data-id="${g}">${C.gear[g].icon} ${C.gear[g].name}</button>` : "";
  const ibtn = (act, id = "") => `<button class="ibtn" data-act="${act}" data-id="${id}" aria-label="More info">i</button>`;

  /* ---------------- feedback: toast, sparks, count-up ---------------- */
  const tq = [];
  function toast(msg) { tq.push(msg); if (tq.length === 1) showToast(); }
  function showToast() {
    const t = $("#toast"); if (!tq.length) return;
    t.textContent = tq[0]; t.classList.add("on");
    setTimeout(() => { t.classList.remove("on"); setTimeout(() => { tq.shift(); showToast(); }, 280); }, 2100);
  }
  let ptr = { x: innerWidth / 2, y: innerHeight / 2 };
  document.addEventListener("pointerdown", e => { ptr = { x: e.clientX, y: e.clientY }; }, true);
  function sparks(n = 14, x = ptr.x, y = ptr.y) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span"), a = Math.random() * Math.PI * 2, d = 60 + Math.random() * (n > 20 ? 260 : 130);
      s.className = "spark"; s.textContent = i % 3 ? "✦" : "★";
      s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;--r:${Math.random() * 360}deg;--s:${0.6 + Math.random() * 0.9};color:${i % 2 ? "var(--gold)" : "var(--star)"}`;
      document.body.appendChild(s); setTimeout(() => s.remove(), 1200);
    }
  }
  function countUp(root) {
    $$("[data-count]", root).forEach(el => {
      const to = parseFloat(el.dataset.count), dec = (String(to).split(".")[1] || "").length, t0 = performance.now();
      const step = t => { const p = Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - p, 3); el.textContent = (to * e).toFixed(dec); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }

  /* ---------------- streaks, milestones, missions ---------------- */
  function touchStreak() {
    const t = today(); if (S.lastActive === t) return;
    S.streak = (S.lastActive && dayDiff(S.lastActive, t) === 1) ? S.streak + 1 : 1; S.lastActive = t;
  }
  const MS = {
    first: () => Object.values(S.done).some(a => a.length), s3: () => S.streak >= 3, s7: () => S.streak >= 7,
    full: () => S.fullDays > 0, green: () => Object.values(S.regions).every(v => v >= 70),
    vit10: () => S.vitals.length >= 10, rad5: () => S.rad.length >= 5, spf7: () => taskStreak("ea-spf") >= 7
  };
  function checkMilestones() {
    C.milestones.forEach(m => { if (!S.milestones.includes(m.id) && MS[m.id] && MS[m.id]()) { S.milestones.push(m.id); toast(`${m.icon} Milestone: ${m.name}`); } });
  }
  function completeTask(t) {
    if (!t || isDone(t.id)) return;
    if (T && T.tid === t.id) { T = null; clearInterval(TI); }
    (S.done[today()] ||= []).push(t.id);
    (S.history[t.id] ||= []).push(today());
    const st = (S.steps[today()] ||= {}); st[t.id] = t.steps.map((_, i) => i);
    addRegion(t.region, t.gain || 15); touchStreak();
    if (tasks().every(x => isDone(x.id))) {
      S.fullDays++; Sound.play("stellar"); sparks(40, innerWidth / 2, innerHeight / 3);
      toast("✦ Full constellation — every mission complete!");
    } else {
      Sound.play("complete"); sparks(16);
      toast(`${t.icon} ${t.title} · ${C.regions[t.region].name} ↑`);
    }
    checkMilestones(); save(); render(); refreshSheet();
  }
  function setStep(tid, i, val) {
    const t = task(tid); if (!t || isDone(tid)) return;
    const st = (S.steps[today()] ||= {}), arr = (st[tid] ||= []), has = arr.includes(i);
    if (val === undefined) val = !has;
    if (val && !has) arr.push(i); else if (!val && has) arr.splice(arr.indexOf(i), 1); else return;
    if (arr.length === t.steps.length) return completeTask(t);
    Sound.play(val ? "check" : "uncheck"); save(); render(); refreshSheet();
  }

  /* ---------------- step timers ---------------- */
  let T = null, TI = null;
  function startTimer(tid, i, sec) {
    if (T && T.tid === tid && T.i === i) { T = null; clearInterval(TI); Sound.play("uncheck"); return paintTimers(); }
    T = { tid, i, sec, end: Date.now() + sec * 1000 }; Sound.play("tap");
    clearInterval(TI); TI = setInterval(tickTimer, 250); tickTimer();
  }
  function tickTimer() {
    if (!T) return;
    const left = Math.max(0, (T.end - Date.now()) / 1000);
    if (left <= 0) { const { tid, i } = T; T = null; clearInterval(TI); Sound.play("timer"); toast("⏱ Time! Step complete"); paintTimers(); return setStep(tid, i, true); }
    paintTimers(left);
  }
  function paintTimers(left) {
    $$("[data-tm]").forEach(el => {
      const run = T && el.dataset.tm === T.tid + "|" + T.i;
      el.classList.toggle("run", !!run);
      el.textContent = run ? "❚❚ " + mmss(Math.ceil(left)) : "▶ " + mmss(+el.dataset.sec);
      el.style.setProperty("--p", run ? 1 - left / T.sec : 0);
    });
    const p = $("#tpill"); if (!p) return;
    p.classList.toggle("on", !!T);
    if (T) { p.dataset.id = T.tid; p.querySelector("span").textContent = mmss(Math.ceil(left)); }
  }

  /* ---------------- sheets (stack with back) ---------------- */
  let stack = [];
  function sheet(fn) { stack.push(fn); drawSheet(); Sound.play("open"); }
  function drawSheet() {
    const fn = stack[stack.length - 1]; if (!fn) return closeSheet();
    const b = $("#sheetBody");
    b.innerHTML = (stack.length > 1 ? `<button class="back" data-act="sback">‹ Back</button>` : "") + fn();
    b.classList.remove("swap"); void b.offsetWidth; b.classList.add("swap");
    $("#sheet").classList.add("on"); paintTimers(T ? (T.end - Date.now()) / 1000 : 0);
  }
  function refreshSheet() { if (stack.length) { const b = $("#sheetBody"), y = b.parentElement.scrollTop; drawSheet(); b.classList.remove("swap"); b.parentElement.scrollTop = y; } }
  function closeSheet(silent) { if (stack.length && !silent) Sound.play("close"); stack = []; $("#sheet").classList.remove("on"); }
  const infoSheet = (t, d) => () => `<h2>${t}</h2><p class="lead">${d}</p>`;

  const gearSheet = g => () => { const x = C.gear[g]; return `<div class="shead"><span class="big">${x.icon}</span><div><small class="kick">HOW TO USE</small><h2>${x.name}</h2></div></div>
    <p class="lead">${x.what}</p><ol class="howto">${x.steps.map((s, i) => `<li style="--i:${i}"><span class="n">${i + 1}</span><span>${s}</span></li>`).join("")}</ol>`; };

  function taskSheet(id) {
    return () => {
      const t = task(id); if (!t) return "<p>Mission not available in this environment.</p>";
      const done = isDone(id), st = stepsOf(id), streak = taskStreak(id), g = C.regions[t.region], p = stepProg(t);
      const autoBtn = { vitals: ["health", "Open Health"], radiation: ["rad", "Open Radiation"], sunscreen: ["rad", "Open Radiation"] }[t.auto];
      const steps = t.steps.map(([txt, sec], i) => {
        const on = done || st.includes(i);
        return `<div class="step ${on ? "on" : ""}" style="--i:${i}">
          <button class="sbody" data-act="${t.auto ? "noop" : "step"}" data-id="${id}|${i}"><span class="cb"></span><span class="st">${txt}</span></button>
          ${sec && !on ? `<button class="tm" data-act="timer" data-id="${id}|${i}|${sec}" data-tm="${id}|${i}" data-sec="${sec}">▶ ${mmss(sec)}</button>` : ""}</div>`;
      }).join("");
      const gear = gearOf(t);
      return `<div class="shead"><span class="big">${t.icon}</span><div><h2>${t.title}</h2>
          <div class="meta">⏱ ${t.dur} · ${g.icon} ${g.name}${streak ? ` · 🔥 ${streak}` : ""}</div></div>${ibtn("whyt", id)}</div>
        ${gear.length ? `<div class="gearrow">${gear.map(gearChip).join("")}</div>` : ""}
        <div class="bar thin"><i style="width:${p * 100}%"></i></div>
        <div class="steps">${steps}</div>
        ${done ? `<button class="btn done" disabled>✦ Completed today</button>`
          : autoBtn ? `<button class="btn" data-act="tab" data-id="${autoBtn[0]}">${autoBtn[1]} ›</button>`
          : `<button class="btn" data-act="complete" data-id="${id}">Complete all steps</button>`}`;
    };
  }

  function regionSheet(r) {
    return () => {
      const g = C.regions[r], v = Math.round(S.regions[r]);
      const ts = tasks().filter(t => t.region === r), vs = C.vitals.filter(x => x.region === r);
      const row = (act, id, icon, name, right) => `<button class="row" data-act="${act}" data-id="${id}"><span>${icon}</span><b>${name}</b><span class="rt">${right}</span></button>`;
      return `<div class="shead"><span class="big">${g.icon}</span><div><h2>${g.name}</h2><div class="meta">${v}% ready</div></div></div>
        <div class="bar"><i style="width:${v}%;background:${regColor(v)}"></i></div>
        <p class="lead">${g[kind()]}</p>
        ${ts.length ? `<h3>Missions</h3>${ts.map(t => row("task", t.id, t.icon, t.title, isDone(t.id) ? "✦" : "›")).join("")}` : ""}
        ${vs.length ? `<h3>Measurements</h3>${vs.map(x => { const l = lastV(x.id); return row("vital", x.id, x.icon, x.name, l ? vFmt(x, l) + " " + (x.scale ? "" : x.unit) : "›"); }).join("")}` : ""}
        ${r === "shield" ? `<h3>Radiation</h3>${row("tab", "rad", "☢️", C.radiation[kind()].title + " log", "›")}` : ""}`;
    };
  }

  function chart(v) {
    const pts = S.vitals.filter(x => x.id === v.id).slice(-14); if (pts.length < 2) return "";
    const W = 300, H = 110, vals = pts.map(p => p.v).concat(v.ok);
    const lo = Math.min(...vals), hi = Math.max(...vals), pd = (hi - lo) * 0.15 || 1, mn = lo - pd, mx = hi + pd;
    const X = i => 10 + i / (pts.length - 1) * (W - 20), Y = y => H - 8 - (y - mn) / (mx - mn) * (H - 16);
    const line = pts.map((p, i) => `${X(i).toFixed(1)},${Y(p.v).toFixed(1)}`).join(" ");
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}"><rect x="0" y="${Y(v.ok[1])}" width="${W}" height="${Y(v.ok[0]) - Y(v.ok[1])}" class="band"/>
      <polyline points="${line}" class="ln"/>${pts.map((p, i) => `<circle cx="${X(i)}" cy="${Y(p.v)}" r="4" class="pt ${vSt(v, p)}" style="--i:${i}"/>`).join("")}</svg>
      <div class="cap"><span>Last ${pts.length}</span><span class="band-l">Typical range</span></div></div>`;
  }

  function vitalSheet(id) {
    return () => {
      const v = C.vitals.find(x => x.id === id), l = lastV(id), hist = S.vitals.filter(x => x.id === id).slice(-4).reverse();
      const input = v.scale
        ? `<div class="moods">${MOODS.map((m, i) => `<button data-act="mood" data-id="${i + 1}">${m}</button>`).join("")}</div><input type="hidden" id="vin">`
        : v.pair
          ? `<div class="pairin"><input class="field" id="vin" type="number" inputmode="numeric" placeholder="SYS" value="${l ? l.v : ""}"><span>/</span><input class="field" id="vin2" type="number" inputmode="numeric" placeholder="DIA" value="${l ? l.v2 : ""}"></div>`
          : `<div class="stepper"><button data-act="nudge" data-id="-1">−</button><input class="field" id="vin" type="number" inputmode="decimal" step="any" placeholder="${v.unit}" value="${l ? l.v : ""}"><button data-act="nudge" data-id="1">+</button></div>`;
      const typ = v.scale ? "3–5 typical" : `Typical ${v.ok[0]}–${v.ok[1]}${v.pair ? " / " + v.pair.ok[0] + "–" + v.pair.ok[1] : ""} ${v.unit}`;
      return `<div class="shead"><span class="big">${v.icon}</span><div><h2>${v.name}</h2><div class="meta">${typ}</div></div>${ibtn("whyv", id)}</div>
        ${input}<button class="btn" data-act="savevital" data-id="${id}">Save measurement</button>
        <div class="gearrow">${v.gear.map(gearChip).join("")}</div>
        ${chart(v)}
        ${hist.length ? `<div class="hist">${hist.map(h => `<div><span class="dot ${vSt(v, h)}"></span><b>${vFmt(v, h)}</b> <span class="mute">${v.scale ? "" : v.unit} · ${ago(h.ts)}</span></div>`).join("")}</div>` : ""}`;
    };
  }
  function saveVital(id) {
    const v = C.vitals.find(x => x.id === id), x = parseFloat($("#vin").value), y = v.pair ? parseFloat($("#vin2").value) : null;
    if (isNaN(x) || x < v.min || x > v.max) { Sound.play("warn"); return toast(v.scale ? "Pick a mood" : `Enter ${v.min}–${v.max} ${v.unit}`); }
    if (v.pair && (isNaN(y) || y < v.pair.min || y > v.pair.max)) { Sound.play("warn"); return toast(`Diastolic: ${v.pair.min}–${v.pair.max}`); }
    const e = { id, v: x, day: today(), ts: Date.now() }; if (v.pair) e.v2 = y;
    S.vitals.push(e); if (S.vitals.length > 800) S.vitals.shift();
    const st = vSt(v, e);
    addRegion(v.region, st === "good" ? 6 : st === "watch" ? 2 : 0);
    const auto = tasks().find(t => t.auto === "vitals");
    checkMilestones(); save();
    if (st === "alert") {
      Sound.play("alarm"); stack = [];
      sheet(() => `<div class="alertbox"><div class="pulse">⚠️</div><h2>${v.name}: ${vFmt(v, e)} ${v.scale ? "" : v.unit}</h2>
        <p class="lead">Outside the typical range. Re-measure to confirm${v.sos ? ", then follow the decision tree." : " and contact your medical officer if it persists."}</p>
        ${v.sos ? `<button class="btn red" data-act="sosgo" data-id="${v.sos}">Open SOS decision tree</button>` : ""}
        <button class="btn ghost" data-act="vitalgo" data-id="${id}">Re-measure</button></div>`);
    } else {
      Sound.play(st === "good" ? "save" : "warn"); closeSheet(true);
      toast(st === "good" ? `${v.icon} Saved · typical range` : `${v.icon} Saved · slightly outside — re-check later`);
      if (st === "good") sparks(10);
    }
    if (auto && !isDone(auto.id)) completeTask(auto); else render();
  }

  /* ---------------- SOS ---------------- */
  let F = null;
  const scen = id => C.sos[kind()].find(s => s.id === id);
  function startSOS(id) { const s = scen(id); if (!s) return; F = { id, node: s.start, path: [], checked: [] }; Sound.play("whoosh"); render("r"); }
  function sosNext(i) {
    const s = scen(F.id), n = s.n[F.node], o = n.o[i];
    F.path.push({ node: F.node, pick: o[0] }); F.node = o[1]; F.checked = [];
    const r = s.n[F.node].r;
    Sound.play(!r ? "tap" : r.sev === "critical" ? "alarm" : r.sev === "caution" ? "warn" : "check");
    render(); const c = $(".tn.cur, .tn.res"); if (c) c.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function treeSheet() {
    const s = scen(F.id), onP = id => F.node === id || F.path.some(p => p.node === id);
    const node = id => {
      const n = s.n[id];
      if (n.r) return `<div class="tnode r ${n.r.sev} ${onP(id) ? "on" : ""}">${n.r.sev === "critical" ? "🚨" : n.r.sev === "caution" ? "⚠️" : "✅"} ${n.r.t}</div>`;
      return `<div class="tnode q ${onP(id) ? "on" : ""}">${n.q}</div><ul>${n.o.map(o => `<li><span class="tlab">${o[0]}</span>${node(o[1])}</li>`).join("")}</ul>`;
    };
    return `<h2>${s.icon} ${s.title}</h2><p class="mute small">Full decision tree · your path is highlighted</p><div class="tree">${node(s.start)}</div>`;
  }
  function renderSOS() {
    const list = C.sos[kind()];
    if (!F) return `<div class="sec"><h2>Emergency</h2>${ibtn("info", "sos")}</div>
      <div class="sosgrid">${list.map(s => `<button class="sc" data-act="sos" data-id="${s.id}"><span class="si">${s.icon}</span><b>${s.title}</b></button>`).join("")}</div>
      <div class="sec"><h2>Equipment guides</h2></div><div class="gearrow">${C.sosGear.map(gearChip).join("")}</div>`;
    const s = scen(F.id), n = s.n[F.node];
    const trail = F.path.map((p, i) => `<div class="tn past" style="--i:${i}"><div class="tq">${s.n[p.node].q}</div><div class="ta">↳ ${p.pick}</div></div>`).join("");
    let cur;
    if (n.q) cur = `<div class="tn cur"><div class="tq">${n.q}</div><div class="branches">${n.o.map((o, i) => `<button class="br" data-act="sosnext" data-id="${i}">${o[0]}</button>`).join("")}</div></div>`;
    else {
      const r = n.r, all = F.checked.length === r.steps.length, vt = r.vital && C.vitals.find(v => v.id === r.vital);
      cur = `<div class="tn res ${r.sev}"><div class="sevtag">${r.sev === "critical" ? "🚨 CRITICAL" : r.sev === "caution" ? "⚠️ CAUTION" : "✅ LOW RISK"}</div><h3>${r.t}</h3>
        <div class="steps">${r.steps.map((x, i) => `<div class="step ${F.checked.includes(i) ? "on" : ""}" style="--i:${i}"><button class="sbody" data-act="sosstep" data-id="${i}"><span class="cb"></span><span class="st">${x}</span></button></div>`).join("")}</div>
        ${all ? `<p class="okmsg">All actions done — keep monitoring.</p>` : ""}
        ${(r.gear || []).length ? `<div class="gearrow">${r.gear.map(gearChip).join("")}</div>` : ""}
        ${vt ? `<button class="btn ghost" data-act="vitalgo" data-id="${vt.id}">${vt.icon} Log ${vt.name}</button>` : ""}</div>`;
    }
    return `<div class="sosbar"><button class="back" data-act="sosback">‹ All</button><b>${s.icon} ${s.title}</b><button class="back" data-act="tree">🌳 Tree</button></div>
      <div class="trail">${trail}${cur}</div>
      ${F.path.length ? `<button class="btn ghost" data-act="sos" data-id="${s.id}">Restart</button>` : ""}`;
  }

  /* ---------------- RADIATION ---------------- */
  function gauge(k, idx) {
    const L = C.radiation[k].levels, n = L.length, seg = 180 / n, R = 80, cx = 100, cy = 100;
    const pt = a => [cx + R * Math.cos(Math.PI * (1 - a / 180)), cy - R * Math.sin(Math.PI * (1 - a / 180))];
    const arcs = L.map((l, i) => { const [x1, y1] = pt(i * seg + 2), [x2, y2] = pt((i + 1) * seg - 2); return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" class="arc ${l.cls} ${i === idx ? "on" : ""}"/>`; }).join("");
    const rot = idx < 0 ? -90 : -90 + (idx + 0.5) * seg;
    return `<svg class="gauge" viewBox="0 0 200 112">${arcs}<g class="needle" style="--rot:${rot}deg"><line x1="100" y1="100" x2="100" y2="34"/><circle cx="100" cy="100" r="7"/></g></svg>`;
  }
  function spfInfo() {
    const d = S.spf[today()] || [], st = taskStreak("ea-spf");
    const next = d.length ? d[d.length - 1] + 2 * 3600e3 : null;
    return { d, st, next };
  }
  function renderRad() {
    const k = kind(), R = C.radiation[k], last = lastRad(k), idx = last ? radIdx(k, last.v) : -1, lv = idx >= 0 ? R.levels[idx] : null;
    const devs = k === "space" ? `<div class="devs">${R.devices.map(d => `<button class="dev ${S.dev === d ? "on" : ""}" data-act="dev" data-id="${d}">${C.gear[d].icon} ${C.gear[d].name.split(/ [—(]/)[0]}</button>`).join("")}</div>` : "";
    let extra = "";
    if (k === "space") {
      const days = {}; S.rad.filter(r => r.k === "space").forEach(r => days[r.day] = r.v);
      const dose = Object.values(days).reduce((a, v) => a + v * 24 / 1000, 0);
      extra = `<section class="card"><div class="kv"><span>Estimated mission dose</span><b><span data-count="${dose.toFixed(2)}">${dose.toFixed(2)}</span> mSv</b></div>
        <div class="kv"><span>Days logged</span><b>${Object.keys(days).length}</b></div>${radSpark("space")}</section>`;
    } else {
      const { d, st, next } = spfInfo();
      extra = `<section class="card spf"><div class="kv"><span>🧴 Sunscreen streak</span><b><span data-count="${st}">${st}</span> day${st === 1 ? "" : "s"}</b></div>
        <div class="kv"><span>Applied today</span><b>${d.length ? d.length + "× · last " + hhmm(d[d.length - 1]) : "not yet"}</b></div>
        ${next ? `<div class="kv"><span>Reapply at</span><b>${hhmm(next)}</b></div>` : ""}
        <button class="btn" data-act="spf">🧴 I applied sunscreen</button></section>`;
    }
    return `<div class="sec"><h2>${k === "space" ? "☢️" : "☀️"} ${R.title}</h2>${ibtn("info", "rad")}</div>
      <section class="gcard">${gauge(k, idx)}
        <div class="gval">${last ? `<b data-count="${last.v}">${last.v}</b> <small>${R.unit}</small>` : "<b>—</b>"}</div>
        <div class="glab ${lv ? lv.cls : ""}">${lv ? lv.name : "No reading yet"}</div>${last ? `<div class="ago">${ago(last.ts)}</div>` : ""}</section>
      <section class="card logc"><div class="lrow"><label for="rin">${R.label}</label><button class="help" data-act="radhelp">? Help</button></div>
        <div class="stepper"><button data-act="rnudge" data-id="-1">−</button><input class="field" id="rin" type="number" step="${R.step}" min="0" inputmode="decimal" placeholder="${R.unit}"><button data-act="rnudge" data-id="1">+</button></div>
        ${devs}<button class="btn" data-act="saverad">Log reading</button></section>
      ${lv ? `<section class="res ${sevOf(lv.cls)}"><h3>${lv.name}</h3><ol>${lv.advice.map(a => `<li>${a}</li>`).join("")}</ol>
        ${lv.sos ? `<button class="btn red" data-act="sosgo" data-id="${lv.sos}">Open SOS decision tree</button>` : ""}</section>` : ""}
      ${extra}`;
  }
  function radSpark(k) {
    const pts = S.rad.filter(r => r.k === k).slice(-12); if (pts.length < 2) return "";
    const vs = pts.map(p => p.v), mn = Math.min(...vs), mx = Math.max(...vs), rg = (mx - mn) || 1;
    return `<svg class="spark-l" viewBox="0 0 100 30" preserveAspectRatio="none"><polyline points="${pts.map((p, i) => `${(i / (pts.length - 1) * 100).toFixed(1)},${(27 - (p.v - mn) / rg * 24).toFixed(1)}`).join(" ")}"/></svg>`;
  }
  function radHelpSheet() {
    const k = kind(), R = C.radiation[k];
    return `<div class="shead"><span class="big">${k === "space" ? "📛" : "☀️"}</span><div><small class="kick">HELP</small><h2>How to measure</h2></div></div>
      <p class="lead">${R.ref}</p>
      ${R.devices.map(d => `<button class="row" data-act="gear" data-id="${d}"><span>${C.gear[d].icon}</span><b>${C.gear[d].name}</b><span class="rt">›</span></button>`).join("")}
      <div class="note">🔬 ${R.research}</div>`;
  }
  function saveRad() {
    const k = kind(), R = C.radiation[k], x = parseFloat($("#rin").value);
    if (isNaN(x) || x < 0 || x > R.max) { Sound.play("warn"); return toast(`Enter a value between 0 and ${R.max}`); }
    S.rad.push({ k, v: x, dev: k === "space" ? S.dev : "uv", day: today(), ts: Date.now() }); if (S.rad.length > 800) S.rad.shift();
    const lv = R.levels[radIdx(k, x)];
    addRegion("shield", lv.cls === "good" ? 5 : 2);
    checkMilestones(); save();
    Sound.play(lv.cls === "alert" ? "alarm" : lv.cls === "watch" ? "warn" : "save");
    toast(`${R.title}: ${lv.name}`);
    if (k === "space") { const t = tasks().find(t => t.auto === "radiation"); if (t && !isDone(t.id)) return completeTask(t); }
    else if (!isDone("ea-spf")) return setStep("ea-spf", 0, true);
    render();
  }
  function applySpf() {
    (S.spf[today()] ||= []).push(Date.now());
    const t = task("ea-spf"); save();
    if (t && !isDone(t.id)) { completeTask(t); checkMilestones(); save(); }
    else { Sound.play("save"); sparks(10); toast("🧴 Reapplied — next in 2 h"); render(); }
  }

  /* ---------------- views ---------------- */
  const OFFS = [0, 62, 92, 62, 0, -62, -92, -62], NH = 134, PW = 320;
  function renderToday() {
    const e = env(), ts = tasks(), n = ts.filter(t => isDone(t.id)).length, RC = 2 * Math.PI * 42;
    const avg = bodyAvg(), al = vAlerts().length, anyV = S.vitals.length > 0, lr = lastRad(kind()), rl = lr ? C.radiation[kind()].levels[radIdx(kind(), lr.v)] : null;
    const pos = ts.map((t, i) => ({ x: PW / 2 + OFFS[i % 8], y: i * NH + 52 })), next = ts.findIndex(t => !isDone(t.id));
    let lines = "";
    for (let i = 1; i < pos.length; i++) lines += `<line x1="${pos[i - 1].x}" y1="${pos[i - 1].y}" x2="${pos[i].x}" y2="${pos[i].y}" class="${isDone(ts[i - 1].id) && isDone(ts[i].id) ? "lit" : ""}"/>`;
    const nodes = ts.map((t, i) => {
      const d = isDone(t.id), st = taskStreak(t.id), p = stepProg(t);
      return `<button class="node ${d ? "done" : ""} ${i === next ? "next" : ""}" style="left:${pos[i].x}px;top:${pos[i].y}px;--d:${i * 60}ms" data-act="task" data-id="${t.id}">
        ${i === next ? `<span class="go">${p > 0 ? "CONTINUE" : "NEXT"}</span>` : ""}
        <span class="c">${p > 0 && !d ? `<svg class="np" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" style="stroke-dashoffset:${295 * (1 - p)}"/></svg>` : ""}<span class="ic">${t.icon}</span>
        ${d ? `<span class="star">✦</span>` : ""}${st >= 2 ? `<span class="fl">🔥${st}</span>` : ""}</span>
        <span class="t">${t.title}</span><span class="du">${t.dur}</span></button>`;
    }).join("");
    const H = ts.length * NH + 10;
    return `<section class="hero">
        <div class="ring"><svg viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="42"/><circle class="val" cx="50" cy="50" r="42" style="--c:${RC};stroke-dasharray:${RC};stroke-dashoffset:${RC * (1 - n / ts.length)}"/></svg>
          <div class="rc"><b data-count="${n}">${n}</b><small>of ${ts.length}</small></div></div>
        <div class="hinfo"><small class="kick">${e.kind === "earth" ? "EARTH MODE" : "MISSION · " + e.name.toUpperCase()}</small>
          <h1>${n === ts.length ? "All stars lit ✦" : n ? "Keep going" : "Today's missions"}</h1><div class="meta">${e.icon} ${e.gravity} · 🔥 ${S.streak}-day streak</div></div>
        ${ibtn("brief")}</section>
      <div class="chips">
        <button class="chip" data-act="tab" data-id="body"><span class="cdot" style="background:${regColor(avg)}"></span><span><b data-count="${avg}">${avg}</b>% body</span></button>
        <button class="chip" data-act="tab" data-id="health"><span class="cdot ${!anyV ? "none" : al ? "alert" : "good"}"></span>${!anyV ? "No vitals yet" : al ? al + " alert" + (al > 1 ? "s" : "") : "Vitals OK"}</button>
        <button class="chip" data-act="tab" data-id="rad"><span class="cdot ${rl ? rl.cls : "none"}"></span>${rl ? rl.name : kind() === "earth" ? "Log UV" : "Log dose"}</button></div>
      <div class="sec"><h2>Missions</h2>${ibtn("info", "today")}</div>
      <div class="path" style="height:${H}px"><svg class="lines" width="${PW}" height="${H}" viewBox="0 0 ${PW} ${H}">${lines}</svg>${nodes}</div>`;
  }

  function renderBody() {
    const R = S.regions, col = r => regColor(R[r]), avg = bodyAvg();
    const g = (r, inner, ic, x, y) => `<g class="reg" data-act="region" data-id="${r}" style="--col:${col(r)}">${inner}${ic ? `<text x="${x}" y="${y}">${ic}</text>` : ""}</g>`;
    const svg = `<svg class="bodysvg" viewBox="0 0 220 370">
      ${g("shield", `<rect class="aura" x="6" y="4" width="208" height="362" rx="104"/>`, "🛡️", 196, 30)}
      ${g("muscle", `<rect x="34" y="96" width="28" height="124" rx="14" transform="rotate(9 48 96)"/><rect x="158" y="96" width="28" height="124" rx="14" transform="rotate(-9 172 96)"/><rect x="74" y="226" width="32" height="128" rx="16"/><rect x="114" y="226" width="32" height="128" rx="16"/>`, "💪", 90, 290)}
      ${g("mind", `<circle cx="110" cy="52" r="32"/>`, "🧠", 110, 52)}
      ${g("heart", `<rect x="68" y="92" width="84" height="70" rx="26"/>`, "❤️", 110, 127)}
      ${g("gut", `<rect x="72" y="166" width="76" height="56" rx="22"/>`, "🍎", 110, 194)}
    </svg>`;
    const weakest = Object.keys(R).sort((a, b) => R[a] - R[b])[0], wt = tasks().find(t => t.region === weakest && !isDone(t.id));
    const leg = Object.keys(R).map((r, i) => `<button class="lg" data-act="region" data-id="${r}" style="--i:${i}"><span class="li">${C.regions[r].icon}</span><div><b>${C.regions[r].name}</b><div class="bar thin"><i style="width:${R[r]}%;background:${regColor(R[r])}"></i></div></div><span class="pc">${Math.round(R[r])}%</span></button>`).join("");
    return `<div class="sec"><h2>Body status</h2>${ibtn("info", "body")}</div>
      <div class="bodywrap">${svg}<div class="ready"><b data-count="${avg}">${avg}</b><small>% ready</small></div></div>
      ${wt ? `<button class="focus" data-act="task" data-id="${wt.id}"><small class="kick">FOCUS · ${C.regions[weakest].name.toUpperCase()}</small><b>${wt.icon} ${wt.title}</b><span>›</span></button>` : ""}
      <div class="legend">${leg}</div>`;
  }

  function renderHealth() {
    const al = vAlerts();
    const cards = C.vitals.map((v, i) => {
      const l = lastV(v.id), st = l ? vSt(v, l) : "none";
      const pts = S.vitals.filter(x => x.id === v.id).slice(-8);
      let sp = "";
      if (pts.length > 1) { const vs = pts.map(p => p.v), mn = Math.min(...vs), rg = (Math.max(...vs) - mn) || 1; sp = `<svg class="spark-l" viewBox="0 0 100 30" preserveAspectRatio="none"><polyline points="${pts.map((p, j) => `${(j / (pts.length - 1) * 100).toFixed(1)},${(27 - (p.v - mn) / rg * 24).toFixed(1)}`).join(" ")}"/></svg>`; }
      return `<button class="vit ${st}" data-act="vital" data-id="${v.id}" style="--i:${i}"><div class="n">${v.icon} ${v.name}</div>
        <div class="v"><span class="dot"></span>${l ? vFmt(v, l) : "—"}${l && !v.scale ? `<small>${v.unit}</small>` : ""}</div>${sp}<div class="ago">${l ? ago(l.ts) : "Tap to log"}</div></button>`;
    }).join("");
    const gear = [...new Set(C.vitals.flatMap(v => v.gear))];
    return `<div class="sec"><h2>Health</h2>${ibtn("info", "health")}</div>
      ${al.map(v => `<button class="alertbar" data-act="${v.sos ? "sosgo" : "vital"}" data-id="${v.sos || v.id}"><span class="pulse">⚠️</span><b>${v.name}</b> in alert<span class="rt">${v.sos ? "Open SOS ›" : "Re-measure ›"}</span></button>`).join("")}
      <div class="grid">${cards}</div>
      <div class="sec"><h2>Measurement guides</h2></div><div class="gearrow">${gear.map(gearChip).join("")}</div>`;
  }

  /* ---------------- menu & other sheets ---------------- */
  const menuSheet = () => `<div class="brand">${LOGO}<div><h2>Core <b>Leonis</b></h2><small>${C.app.tagline}</small></div></div>
    <button class="row" data-act="sound"><span>${Sound.on ? "🔊" : "🔈"}</span><b>Sound effects</b><span class="tog ${Sound.on ? "on" : ""}"></span></button>
    <button class="row" data-act="milestones"><span>🏅</span><b>Milestones</b><span class="rt">${S.milestones.length}/${C.milestones.length}</span></button>
    <button class="row" data-act="science"><span>🔬</span><b>Science & sources</b><span class="rt">›</span></button>
    <button class="row" data-act="about"><span>✦</span><b>About Core Leonis</b><span class="rt">›</span></button>
    <button class="row danger" data-act="reset"><span>↺</span><b>Reset all data</b></button>`;
  const milestonesSheet = () => `<h2>🏅 Milestones</h2><div class="badges">${C.milestones.map((m, i) => `<div class="badge ${S.milestones.includes(m.id) ? "on" : ""}" style="--i:${i}"><span>${m.icon}</span><b>${m.name}</b><small>${m.desc}</small></div>`).join("")}</div>`;
  const scienceSheet = () => `<h2>🔬 Science & sources</h2><p class="mute small">How each feature maps to NASA and CSA research.</p>
    ${C.science.map(s => `<div class="sci"><b>${s.n}</b><div class="small">${s.d}</div><div class="used">In the app: ${s.used}</div></div>`).join("")}
    <h3>Sources</h3>${Object.values(C.sources).map(s => `<a class="srcl" target="_blank" rel="noopener" href="${s.url}">${s.label} ↗</a>`).join("")}`;
  const aboutSheet = () => `<div class="brand big">${LOGO}<div><h2>Core <b>Leonis</b></h2><small>${C.app.tagline}</small></div></div>
    <p class="lead"><b>Cor Leonis</b> — “the heart of the lion” — is the old name of Regulus, the brightest star of Leo. Core Leonis keeps the crew's heart, body and mind on track with science-based daily missions, health logs, radiation tracking and emergency decision trees.</p>
    <p class="mute small">Built for NASA Space Apps 2026 · Health Monitoring Software. Educational prototype — not a medical device. Data stays on this device.</p>`;
  const envSheet = () => `<h2>Environment</h2>${C.environments.map((e, i) => `<button class="envc ${e.id === S.env ? "on" : ""}" data-act="setenv" data-id="${e.id}" style="--i:${i}"><span class="ei">${e.icon}</span><div><b>${e.name}</b><small>${e.gravity} · delay ${e.delay}</small></div></button>`).join("")}`;
  const briefSheet = () => { const e = env(); return `<div class="shead"><span class="big">${e.icon}</span><div><small class="kick">BRIEFING</small><h2>${e.name}</h2></div></div>
    <div class="kvs"><div><small>Gravity</small><b>${e.gravity}</b></div><div><small>Comms delay</small><b>${e.delay}</b></div></div>
    <p class="lead">${e.brief}</p><h3>Health focus</h3><div class="tags">${e.focus.map(f => `<span>${f}</span>`).join("")}</div>`; };

  /* ---------------- render & navigation ---------------- */
  function renderTop() {
    const e = env();
    $("#top").innerHTML = `<button class="logo" data-act="menu" aria-label="Menu">${LOGO}<span class="wm">Core <b>Leonis</b></span></button>
      <button class="env" data-act="envs">${e.icon} <span>${e.name}</span><i>▾</i></button>
      <button class="tpill ${T ? "on" : ""}" id="tpill" data-act="task" data-id="${T ? T.tid : ""}">⏱ <span></span></button>
      <button class="pill" data-act="streak">🔥 <b>${S.streak}</b></button>`;
    const i = TABS.indexOf(S.tab);
    $$("#nav button").forEach(b => b.classList.toggle("on", b.dataset.id === S.tab));
    $("#nav .ind").style.transform = `translateX(${i * 100}%)`;
  }
  const VIEWS = { today: renderToday, body: renderBody, health: renderHealth, sos: renderSOS, rad: renderRad };
  function render(dir) {
    renderTop();
    const v = $("#view");
    v.innerHTML = VIEWS[S.tab]();
    if (dir) {
      v.classList.remove("in-r", "in-l", "stag"); void v.offsetWidth; v.classList.add("in-" + dir, "stag");
      [...v.children].forEach((el, i) => el.style.setProperty("--i", i));
      countUp(v); clearTimeout(render.t); render.t = setTimeout(() => v.classList.remove("stag", "in-r", "in-l"), 900);
    }
    paintTimers(T ? (T.end - Date.now()) / 1000 : 0);
  }
  function go(t) {
    const from = TABS.indexOf(S.tab), to = TABS.indexOf(t);
    if (t !== S.tab) Sound.play("tab");
    S.tab = t; if (t !== "sos") F = null; save(); closeSheet(true);
    render(to >= from ? "r" : "l"); $("#view").scrollTop = 0;
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const id = b.dataset.id, act = b.dataset.act;
    switch (act) {
      case "tab": go(id); break;
      case "close": closeSheet(); break;
      case "sback": stack.pop(); Sound.play("close"); drawSheet(); break;
      case "menu": sheet(menuSheet); break;
      case "science": sheet(scienceSheet); break;
      case "about": sheet(aboutSheet); break;
      case "milestones": sheet(milestonesSheet); break;
      case "streak": sheet(() => `<h2>🔥 ${S.streak}-day streak</h2><p class="lead">Complete at least one mission every day to keep your streak. Consistency is the real countermeasure — in orbit and on Earth.</p>` + milestonesSheet().replace("<h2>🏅 Milestones</h2>", "<h3>Milestones</h3>")); break;
      case "sound": Sound.toggle(); Sound.play("check"); refreshSheet(); break;
      case "reset": if (confirm("Erase all data on this device?")) { localStorage.removeItem(KEY); location.reload(); } break;
      case "envs": sheet(envSheet); break;
      case "setenv": if (id !== S.env) { S.env = id; F = null; Sound.play("whoosh"); save(); toast(`${env().icon} ${env().name}`); } closeSheet(true); render("r"); break;
      case "brief": sheet(briefSheet); break;
      case "info": sheet(infoSheet(C.info[id].t, C.info[id].d)); break;
      case "whyt": { const t = task(id); sheet(infoSheet("Why it matters", t.why) ); break; }
      case "whyv": { const v = C.vitals.find(x => x.id === id); sheet(infoSheet("Why measure " + v.name.toLowerCase(), v.why)); break; }
      case "gear": sheet(gearSheet(id)); break;
      case "task": if (id) sheet(taskSheet(id)); break;
      case "step": { const [t, i] = id.split("|"); setStep(t, +i); break; }
      case "timer": { const [t, i, s] = id.split("|"); startTimer(t, +i, +s); break; }
      case "complete": { const t = task(id); completeTask(t); break; }
      case "region": sheet(regionSheet(id)); break;
      case "vital": sheet(vitalSheet(id)); break;
      case "vitalgo": stack = []; if (S.tab !== "health") go("health"); sheet(vitalSheet(id)); break;
      case "nudge": { const inp = $("#vin"), sb = $(".btn[data-act=savevital]"), v = sb && C.vitals.find(x => x.id === sb.dataset.id); const stp = v && v.unit === "°C" ? 0.1 : 1; inp.value = Math.round(((parseFloat(inp.value) || (v ? v.ok[0] : 0)) + stp * id) * 10) / 10; Sound.play("tap"); break; }
      case "mood": $("#vin").value = id; $$(".moods button").forEach(x => x.classList.toggle("sel", x.dataset.id === id)); Sound.play("tap"); break;
      case "savevital": saveVital(id); break;
      case "sos": startSOS(id); break;
      case "sosgo": closeSheet(true); go("sos"); startSOS(id); break;
      case "sosnext": sosNext(+id); break;
      case "sosstep": { const i = +id, c = F.checked; c.includes(i) ? c.splice(c.indexOf(i), 1) : c.push(i); Sound.play(c.includes(i) ? "check" : "uncheck"); if (c.length === scen(F.id).n[F.node].r.steps.length) sparks(12); render(); break; }
      case "sosback": F = null; Sound.play("close"); render("l"); break;
      case "tree": sheet(treeSheet); break;
      case "dev": S.dev = id; save(); Sound.play("tap"); $$(".dev").forEach(x => x.classList.toggle("on", x.dataset.id === id)); break;
      case "rnudge": { const inp = $("#rin"), s = parseFloat(C.radiation[kind()].step); inp.value = Math.max(0, Math.round(((parseFloat(inp.value) || 0) + s * id) * 10) / 10); Sound.play("tap"); break; }
      case "saverad": saveRad(); break;
      case "radhelp": sheet(radHelpSheet); break;
      case "spf": applySpf(); break;
    }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && stack.length) closeSheet();
    if (e.key !== "Enter" || !e.target.classList.contains("field")) return;
    const s = $(".btn[data-act=savevital]") || $(".btn[data-act=saverad]"); if (s) s.click();
  });

  checkMilestones(); save(); render("r");
})();
