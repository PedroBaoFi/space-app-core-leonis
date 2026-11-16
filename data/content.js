/* =====================================================================
   CORE LEONIS — all editable content lives in this file.
   Copy an existing entry, change the text, save, refresh. No build step.

     • daily mission      -> CONTENT.tasks.space / .earth  or  CONTENT.envTasks.<envId>
     • equipment guide    -> CONTENT.gear          (reference it with gear:["key"])
     • vital sign         -> CONTENT.vitals
     • SOS decision tree  -> CONTENT.sos.space / .earth
     • radiation levels   -> CONTENT.radiation.space / .earth
     • research / sources -> CONTENT.science / CONTENT.sources  (shown only on the Science page)
   ===================================================================== */

const CONTENT = {
  app: { name: "Core Leonis", tagline: "The heart of the crew." },

  /* ---------- Info texts behind the (i) buttons ---------- */
  info: {
    today:  { t: "Daily missions", d: "Each mission is a short protocol based on NASA countermeasures. Tick the steps (some have built-in timers) — the mission completes when every step is done. Completed missions light up as stars and strengthen the matching body region." },
    body:   { t: "Body status", d: "Each region reflects the missions and measurements you completed. Regions fade a little every day without care — just like real deconditioning in microgravity or a sedentary routine. Green ≥ 70% · Amber 35–69% · Red < 35%." },
    health: { t: "Reading the indicators", d: "Tap an indicator to log a measurement. Green = typical, amber = watch, red = alert. Reference ranges are typical adult values for demonstration only — not medical advice. An alert offers the matching SOS decision tree." },
    sos:    { t: "About SOS", d: "Each scenario is a decision tree: answer quick yes/no questions to reach the recommended action. Educational prototype — real crews follow flight-surgeon procedures and this does not replace medical training." },
    rad:    { t: "Logging radiation", d: "Enter the value shown by your measuring device. Core Leonis classifies it, gives the recommended actions and keeps your history. Thresholds are simplified demo values." }
  },

  /* ---------- Sources (listed ONLY on the Science page) ---------- */
  sources: {
    hazards:   { label: "NASA HRP – 5 Hazards of Human Spaceflight", url: "https://www.nasa.gov/hrp/hazards/" },
    risks:     { label: "NASA HRP – Risks of Human Spaceflight", url: "https://www.nasa.gov/hrp/risks/" },
    research:  { label: "NASA HRP – Ongoing HRP Research", url: "https://www.nasa.gov/hrp/ongoing-hrp-research/" },
    csaRad:    { label: "CSA – Monitoring radiation for astronaut health (2026)", url: "https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp" },
    csaSci:    { label: "CSA – Why do we conduct science experiments in space?", url: "https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp" },
    who:       { label: "WHO – Physical activity fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity" },
    challenge: { label: "NASA Space Apps 2026 – Health Monitoring Software", url: "https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=details" }
  },

  /* ---------- Environments ---------- */
  environments: [
    { id: "earth", kind: "earth", icon: "🌍", name: "Earth", gravity: "1 g", delay: "None",
      brief: "Weightlessness produces effects similar to accelerated aging and a sedentary lifestyle. On Earth we fight the same enemies: inactivity (about 1 in 3 adults) and UV radiation from the Sun.",
      focus: ["Sedentary lifestyle", "Sun (UV) radiation", "Sleep & stress"] },
    { id: "leo", kind: "space", icon: "🛰️", name: "Low Earth Orbit", gravity: "Microgravity", delay: "Near real-time",
      brief: "On the ISS, muscles, bones, heart and eyes adapt to weightlessness. Daily exercise on dedicated hardware, nutrition and standard measures keep the crew healthy.",
      focus: ["Bone & muscle loss", "Fluid shift & vision (SANS)", "Neutron radiation (~30% of ISS dose)"] },
    { id: "moon", kind: "space", icon: "🌙", name: "Moon", gravity: "~1/6 g", delay: "~1.3 s one way",
      brief: "About three days from Earth, but with a new gravity level, surface spacewalks and no atmosphere to shield radiation.",
      focus: ["Gravity transitions", "Spacewalk (EVA) risks", "Solar particle events"] },
    { id: "mars", kind: "space", icon: "🔴", name: "Mars", gravity: "3/8 g", delay: "~3–22 min one way",
      brief: "About 140 million miles away on average. Crews live in three-eighths of Earth's gravity for up to two years and must be medically self-sufficient.",
      focus: ["Communication delay", "Isolation & confinement", "Long-term radiation"] },
    { id: "deep", kind: "space", icon: "🚀", name: "Deep Space", gravity: "Microgravity", delay: "Grows with distance",
      brief: "Beyond Earth's magnetic field: galactic cosmic rays, long isolation and less ability to rely on Earth for food, materials or emergency medical help.",
      focus: ["Galactic cosmic rays", "Isolation", "Medical self-reliance"] }
  ],

  /* ---------- Body regions ---------- */
  regions: {
    mind:   { name: "Mind & Sleep", icon: "🧠",
      space: "Isolation, distance and chronic sleep loss affect mood and performance. Irregular schedules disturb the body clock.",
      earth: "Poor sleep, stress and loneliness hurt performance and mood — the same stressors crews manage in orbit." },
    heart:  { name: "Heart & Circulation", icon: "❤️",
      space: "Weightlessness shifts fluids toward the head and changes how the heart and vessels work; it can also change the eyes and brain (SANS).",
      earth: "Inactivity weakens the cardiovascular system. Tracking heart rate and blood pressure catches problems early." },
    gut:    { name: "Nutrition", icon: "🍎",
      space: "Inadequate food and nutrition is a tracked spaceflight risk; food also loses appeal on long missions.",
      earth: "Balanced meals and hydration fuel recovery, sleep and immunity." },
    muscle: { name: "Muscles & Bones", icon: "💪",
      space: "Without gravity, bones lose density and muscles weaken. Daily resistive and aerobic exercise is the main countermeasure.",
      earth: "Inactivity causes similar losses. WHO recommends 150 min of moderate activity per week plus strength training twice a week." },
    shield: { name: "Skin & Radiation", icon: "🛡️",
      space: "Space radiation is invisible and one of the most hazardous parts of spaceflight, raising long-term cancer risk.",
      earth: "UV from the Sun is Earth's everyday radiation hazard. Daily protection builds a lifelong habit." }
  },

  /* ---------- Equipment guides (how to use the tools) ---------- */
  gear: {
    ared:     { icon: "🏋️", name: "Resistive exercise device (ISS)", what: "Vacuum cylinders create a load that replaces free weights in microgravity.",
      steps: ["Lock your feet onto the platform and fasten the shoulder harness.", "Set the load on the arm — start with your last logged value.", "Lift with a neutral spine; move slowly in both directions.", "Unload the bar before unclipping.", "Log the load used so the next session can progress."] },
    compact:  { icon: "🪢", name: "Compact flywheel / cable device", what: "Small cable devices are used where there is no room for big machines — NASA's Zero T2 study looks at exercising without a treadmill for deep-space missions.",
      steps: ["Anchor the device and strap your feet in.", "Attach the handle or harness to the cable.", "Pull in a smooth, controlled motion; resist on the way back.", "Keep each set under control rather than fast.", "Stow the cable to avoid floating loose parts."] },
    treadmill:{ icon: "🏃", name: "Treadmill with harness", what: "Bungees attached to a harness pull you onto the belt so your feet stay in contact.",
      steps: ["Put on the harness and tighten waist and shoulder straps.", "Clip the bungees to both sides — equal length.", "Increase the load until your feet stay planted comfortably.", "Start slow; increase speed gradually.", "Keep the emergency stop within reach."] },
    cycle:    { icon: "🚴", name: "Cycle ergometer", what: "A stationary bike that needs no seat in microgravity — you clip in and hold on.",
      steps: ["Clip your shoes into the pedals.", "Use the waist strap or handholds to stay in place.", "Set the workload for the planned intensity.", "Wear the heart-rate monitor and watch your zone.", "Wipe sweat — droplets float in microgravity."] },
    hrm:      { icon: "⌚", name: "Heart-rate monitor", what: "A chest strap or wrist sensor that shows heart rate in real time.",
      steps: ["Moisten the chest-strap electrodes.", "Place the strap just below the chest, snug.", "Pair it and wait for a steady reading before starting."] },
    actigraph:{ icon: "⌚", name: "Wrist actigraphy device", what: "Measures motion, sleep and light exposure — like the ARCHeR device worn on Artemis II.",
      steps: ["Wear it on the non-dominant wrist, snug but comfortable.", "Wear it day and night; remove only to charge.", "Press the event button at lights-out and on waking.", "Sync daily so sleep data is stored."] },
    thighcuff:{ icon: "🦵", name: "Thigh cuffs", what: "Tight cuffs keep more fluid in the legs; NASA tests whether they help prevent eye changes in space.",
      steps: ["Place one cuff high on each thigh.", "Tighten until snug — one finger should still fit underneath.", "Wear for the prescribed period.", "Remove at once if you feel numbness, tingling or colour changes in the legs."] },
    bpcuff:   { icon: "🩺", name: "Automatic blood-pressure cuff", what: "Measures systolic and diastolic pressure.",
      steps: ["Rest 5 minutes, feet flat (or restrained in microgravity).", "Wrap the cuff on the bare upper arm, at heart level.", "Support the arm and don't talk during the reading.", "Take two readings 1 minute apart and log the average."] },
    pulseox:  { icon: "☝️", name: "Pulse oximeter", what: "Clips on a finger and reads oxygen saturation (SpO₂) and pulse.",
      steps: ["Warm the hand; remove nail polish.", "Clip it on the index or middle finger.", "Keep the hand still at heart level.", "Wait ~30 s for a stable reading."] },
    thermo:   { icon: "🌡️", name: "Thermometer", what: "Oral or forehead digital thermometer.",
      steps: ["Oral: wait 15 min after eating or drinking.", "Place under the tongue, lips closed, until it beeps.", "Forehead: hold at the centre of the forehead and press once."] },
    glucometer:{ icon: "🩸", name: "Glucometer", what: "Reads blood sugar from a drop of blood.",
      steps: ["Wash and dry your hands.", "Insert a test strip.", "Prick the side of a fingertip with the lancet.", "Touch the drop to the strip and wait for the reading.", "Dispose of the lancet safely (sharps container)."] },
    tempus:   { icon: "📟", name: "Telemedicine monitor", what: "NASA tested Tempus Pro, a commercial telemedicine device that collects health data and enables remote diagnosis.",
      steps: ["Connect the sensors you need (BP cuff, oximeter, ECG).", "Start a session and follow the on-screen order.", "Review values, then send the record to the flight surgeon."] },
    dosimeter:{ icon: "📛", name: "Personal dosimeter", what: "A badge-sized device worn on the body that records your radiation dose.",
      steps: ["Wear it on the torso at all times, including during sleep.", "Read the dose rate on the display (or download it).", "Log the value in Core Leonis once a day — more often during space-weather alerts.", "Never leave it near shielding you are not sitting behind."] },
    bubble:   { icon: "🫧", name: "Bubble detectors", what: "Used on the ISS by CSA astronaut David Saint-Jacques: each bubble formed in the gel marks a neutron hit. They preceded CANS.",
      steps: ["Activate the detector and place it where you work.", "After the exposure period, count the bubbles.", "Convert the count with the detector's calibration factor.", "Reset (re-pressurise) the detector for reuse."] },
    cans:     { icon: "🛰️", name: "CANS — Canadian Active Neutron Spectrometer", what: "In development (CSA contract, 2026): a compact instrument that measures neutron radiation continuously and autonomously. Neutrons are about 30% of the ISS dose.",
      steps: ["No action needed — it measures automatically.", "Read its latest neutron dose from the station display.", "Log it here alongside your personal dosimeter."] },
    uv:       { icon: "☀️", name: "Finding the UV index", what: "The UV index (0–11+) describes the strength of the Sun's UV radiation.",
      steps: ["Check your weather app or local forecast for today's UV index.", "Or use a handheld UV meter pointed at the sky.", "No device? Shadow rule: if your shadow is shorter than you, UV is high."] },
    sunscreen:{ icon: "🧴", name: "Applying sunscreen right", what: "Most people apply too little.",
      steps: ["Use broad-spectrum SPF 30 or higher.", "Apply 15 minutes before going out.", "Use about a shot-glass amount for the whole body.", "Don't forget ears, neck, feet and the back of the hands.", "Reapply every 2 hours and after swimming or sweating."] },
    cpr:      { icon: "🫀", name: "CPR (incl. microgravity)", what: "Chest compressions keep blood moving to the brain.",
      steps: ["Place the patient on a firm surface (in space: strap them to a rigid restraint).", "Hands stacked at the centre of the chest.", "Push 5–6 cm deep at 100–120 per minute.", "Microgravity: brace your feet on the ceiling above the patient (handstand method) or wrap your legs around their torso.", "Let the chest fully rise between compressions."] },
    aed:      { icon: "⚡", name: "Defibrillator (AED)", what: "Analyses heart rhythm and delivers a shock if needed.",
      steps: ["Turn it on and follow the voice prompts.", "Bare chest; dry the skin.", "Pads: one below the right collarbone, one on the left side under the armpit.", "Nobody touches the patient during analysis and shock.", "Resume CPR immediately after the shock."] },
    oxygen:   { icon: "😷", name: "Oxygen mask / breathing apparatus", what: "Supplies clean oxygen during smoke, toxic air or breathing problems.",
      steps: ["Grab the nearest portable breathing apparatus.", "Open the valve and check flow.", "Place the mask over nose and mouth; tighten the straps.", "Put yours on before helping others."] },
    bleed:    { icon: "🩹", name: "Bleeding control", what: "Direct pressure stops most bleeding.",
      steps: ["Put on gloves.", "Press firmly on the wound with a dressing.", "Don't lift it to check — add layers on top.", "Severe limb bleeding: tourniquet 5–8 cm above the wound, tighten until bleeding stops, note the time.", "In microgravity, capture floating blood with absorbent wipes."] }
  },

  /* ---------- Daily missions ----------
     region: mind|heart|gut|muscle|shield • dur: shown time • gear: equipment guide keys
     gearBy: {envId:[...], default:[...]} when the gear depends on the environment
     steps: [text, seconds?] — seconds adds a timer to that step
     auto: 'vitals' | 'radiation' | 'sunscreen' -> completed from another page */
  tasks: {
    space: [
      { id: "sp-res", region: "muscle", icon: "🏋️", title: "Resistive training", dur: "40 min", gain: 18,
        gearBy: { leo: ["ared"], default: ["compact"] },
        steps: [["Warm-up: arm circles, light squats", 300], ["Squats — 3 × 10, 2 s down / 1 s up"], ["Deadlifts — 3 × 8, neutral spine"], ["Heel raises — 3 × 15 (protects shin bones)"], ["Cool-down stretch", 300], ["Log the load you used"]],
        why: "Without gravity, bones lose density and become brittle and muscles weaken. Heavy, loaded movements through hips, spine and legs are the best signal to keep bone. NASA's Zero T2 study looks at how to exercise without a treadmill for deep-space missions." },
      { id: "sp-aer", region: "heart", icon: "🚴", title: "Aerobic intervals", dur: "30 min",
        gearBy: { leo: ["treadmill", "cycle", "hrm"], default: ["cycle", "hrm"] },
        steps: [["Put on the heart-rate monitor"], ["Easy warm-up", 300], ["4 rounds: 4 min hard (can't hold a conversation) / 3 min easy", 1680], ["Easy cool-down", 180]],
        why: "All astronauts exercise to counteract losses in heart and blood-vessel performance. Short hard intervals train the heart efficiently in limited exercise time." },
      { id: "sp-fluid", region: "heart", icon: "👁️", title: "Fluid shift & vision check", dur: "10 min", gear: ["thighcuff"],
        steps: [["Put on thigh cuffs for the prescribed period"], ["Read a near-vision card at arm's length with each eye"], ["Note any blurred vision, headache or head fullness"], ["Report changes to the flight surgeon"]],
        why: "Spaceflight shifts fluids toward the head and can change the eyes and brain (SANS). NASA is testing thigh cuffs and a daily B-vitamin supplement (B-Complex study) as countermeasures." },
      { id: "sp-meals", region: "gut", icon: "🍽️", title: "Nutrition & hydration", dur: "all day",
        steps: [["Eat every planned meal — log anything skipped"], ["Drink the planned fluid volume"], ["Take prescribed supplements (e.g., vitamin D, B-complex)"], ["Rate today's food appeal 1–5"]],
        why: "Inadequate food and nutrition is a tracked spaceflight risk. NASA's Food Acceptability study found food can lose appeal on long missions — rating it helps the team adjust the menu." },
      { id: "sp-sleep", region: "mind", icon: "😴", title: "Sleep routine", dur: "8 h", gear: ["actigraph"],
        steps: [["Wear the actigraphy device"], ["Dim cabin lights 1 h before sleep"], ["Press the event button at lights-out"], ["Sleep 7+ h in a secured sleeping bag"]],
        why: "Chronic sleep loss and an irregular body clock are major crew stressors. Artemis II astronauts wore wrist actigraphy (ARCHeR) to record motion, sleep and light exposure." },
      { id: "sp-connect", region: "mind", icon: "🌱", title: "Crew connection", dur: "20 min",
        steps: [["Share a meal or a break with a crewmate"], ["Tend the plant garden or a hobby"], ["Rate your mood in the Health page"]],
        why: "Isolation and confinement change behavior and mood. NASA's Space Gardening study looked at whether growing fresh vegetables eases that feeling." },
      { id: "sp-vitals", region: "heart", icon: "📟", title: "Morning vitals", dur: "5 min", gear: ["tempus", "bpcuff", "pulseox"], auto: "vitals",
        steps: [["Log heart rate, blood pressure and SpO₂ in Health"]],
        why: "NASA's Standard Measures collect a consistent set of physiological and psychological data from every crew member, so changes can be spotted early." },
      { id: "sp-rad", region: "shield", icon: "☢️", title: "Dosimeter check", dur: "2 min", gear: ["dosimeter"], auto: "radiation",
        steps: [["Read your dosimeter and log it in Radiation"]],
        why: "Space radiation is invisible. Regular logging builds your exposure history and catches space-weather events early." }
    ],
    earth: [
      { id: "ea-move", region: "heart", icon: "🚶", title: "Brisk movement", dur: "30 min",
        steps: [["Easy warm-up walk", 300], ["Brisk pace — you can talk, not sing", 1200], ["Slow cool-down", 300]],
        why: "Weightlessness mimics a sedentary lifestyle. WHO recommends at least 150 min of moderate activity per week; about 31% of adults worldwide don't reach it. 30 min × 5 days does it." },
      { id: "ea-strength", region: "muscle", icon: "💪", title: "Strength circuit", dur: "20 min",
        steps: [["Squats — 3 × 12"], ["Push-ups (knees OK) — 3 × 8"], ["Glute bridges — 3 × 12"], ["Plank", 45], ["Calf raises — 3 × 15"]],
        why: "WHO recommends muscle-strengthening activity at least 2 days a week. Loaded movements protect bones and muscles — the same reason astronauts lift every day." },
      { id: "ea-breaks", region: "muscle", icon: "🧍", title: "Break up sitting", dur: "4 × 2 min",
        steps: [["Break 1: stand, walk, stretch", 120], ["Break 2", 120], ["Break 3", 120], ["Break 4", 120]],
        why: "WHO: limit sedentary time — any activity is better than none. Breaking up long sitting periods is the Earth version of fighting microgravity deconditioning." },
      { id: "ea-spf", region: "shield", icon: "🧴", title: "Sun protection", dur: "2 min", gear: ["sunscreen", "uv"], auto: "sunscreen",
        steps: [["Check today's UV index and log it in Radiation"], ["Apply SPF 30+ and tap “I applied sunscreen”"]],
        why: "UV is Earth's everyday radiation hazard. Like shielding for astronauts, protection only works if it's consistent — keep the streak alive." },
      { id: "ea-meals", region: "gut", icon: "🥗", title: "Balanced meals", dur: "all day",
        steps: [["Half the plate vegetables or fruit"], ["Drink water through the day"], ["Limit ultra-processed snacks"]],
        why: "Good nutrition is essential for health and performance — on Earth and in space." },
      { id: "ea-sleep", region: "mind", icon: "😴", title: "Sleep routine", dur: "8 h",
        steps: [["Screens off 1 h before bed"], ["Same bedtime as yesterday (±30 min)"], ["Sleep 7+ h"]],
        why: "Chronic sleep loss and irregular schedules are major stressors for crews — and for everyone else." },
      { id: "ea-vitals", region: "heart", icon: "📟", title: "Check your vitals", dur: "5 min", gear: ["bpcuff"], auto: "vitals",
        steps: [["Log at least one measurement in Health"]],
        why: "Regular self-monitoring catches changes early — the idea behind NASA's Standard Measures." },
      { id: "ea-connect", region: "mind", icon: "💬", title: "Connect", dur: "15 min",
        steps: [["Talk to someone you care about"], ["Rate your mood in Health"]],
        why: "Isolation affects mood and behavior. Staying connected is a countermeasure on Earth too." }
    ]
  },
  envTasks: {
    moon: [
      { id: "mn-balance", region: "muscle", icon: "⚖️", title: "Balance & gaze drill", dur: "8 min",
        steps: [["Stand on one foot, eyes open", 30], ["Switch foot", 30], ["Walk heel-to-toe 10 steps, turning your head left/right"], ["Repeat with eyes closed (hold on)", 60]],
        why: "Gravity transitions cause dizziness and loss of coordination. NASA simulates manual piloting for Moon landings to understand these effects." },
      { id: "mn-eva", region: "heart", icon: "🧑‍🚀", title: "Pre-spacewalk health check", dur: "15 min", gear: ["pulseox"],
        steps: [["Log heart rate and SpO₂"], ["Confirm suit O₂ and CO₂ readings are nominal"], ["Complete the oxygen pre-breathe protocol"], ["Report any joint pain before going out"]],
        why: "Spacewalks add risks such as decompression sickness, low oxygen and high CO₂." }
    ],
    mars: [
      { id: "mr-balance", region: "muscle", icon: "⚖️", title: "Balance & gaze drill", dur: "8 min",
        steps: [["Stand on one foot, eyes open", 30], ["Switch foot", 30], ["Walk heel-to-toe 10 steps, turning your head"], ["Repeat with eyes closed (hold on)", 60]],
        why: "After months in microgravity, crews must adapt to 3/8 g on arrival — with no ground team to help in real time." },
      { id: "mr-comms", region: "mind", icon: "📡", title: "Autonomy planning", dur: "15 min",
        steps: [["Batch tomorrow's questions to Earth (replies take minutes)"], ["Review the medical kit inventory"], ["Run one SOS tree as a drill"]],
        why: "The farther from Earth, the harder it is to receive instructions, supplies and medical care in time — crews must be self-sufficient." }
    ],
    deep: [
      { id: "dp-shelter", region: "shield", icon: "🛡️", title: "Radiation-shelter drill", dur: "10 min",
        steps: [["Walk the route to the most shielded area"], ["Time how long it takes", 120], ["Check shelter supplies (water, food, lights)"], ["Review the Radiation-alarm SOS tree"]],
        why: "Beyond Earth's magnetic field, solar particle events can arrive quickly. Knowing the shelter route saves minutes." }
    ]
  },

  /* ---------- Vital signs ----------
     ok = typical range • watch = caution range • outside both = alert (demo values)
     pair: second value (e.g., diastolic) • gear: how-to guides • sos: tree offered on alert */
  vitals: [
    { id: "hr", name: "Heart rate", icon: "❤️", unit: "bpm", min: 30, max: 220, ok: [50, 100], watch: [40, 120], region: "heart", gear: ["hrm", "pulseox"], sos: "air",
      why: "Weightlessness alters how the heart and blood vessels function." },
    { id: "bp", name: "Blood pressure", icon: "🩺", unit: "mmHg", min: 60, max: 240, ok: [90, 129], watch: [80, 139], region: "heart", gear: ["bpcuff"], sos: "air",
      pair: { label: "Diastolic", min: 30, max: 150, ok: [60, 84], watch: [50, 89] },
      why: "Cardiovascular changes in flight can raise the risk of cardiovascular events." },
    { id: "spo2", name: "Oxygen (SpO₂)", icon: "🫁", unit: "%", min: 70, max: 100, ok: [95, 100], watch: [92, 100], region: "heart", gear: ["pulseox"], sos: "air",
      why: "Low oxygen can come from cabin-air problems, lung issues or spacesuit faults." },
    { id: "glu", name: "Blood sugar", icon: "🍬", unit: "mg/dL", min: 30, max: 400, ok: [70, 125], watch: [60, 180], region: "gut", gear: ["glucometer"], sos: "dizzy",
      why: "Metabolism matters on long missions; space research also informs Type-2 diabetes on Earth." },
    { id: "temp", name: "Temperature", icon: "🌡️", unit: "°C", min: 33, max: 42, ok: [36.0, 37.5], watch: [35.0, 38.0], region: "heart", gear: ["thermo"],
      why: "Fever can signal infection; spaceflight stress can alter immunity." },
    { id: "sleep", name: "Sleep", icon: "😴", unit: "h", min: 0, max: 16, ok: [7, 10], watch: [6, 12], region: "mind", gear: ["actigraph"],
      why: "Chronic sleep loss is a tracked spaceflight risk." },
    { id: "mood", name: "Mood", icon: "🙂", unit: "/5", min: 1, max: 5, ok: [3, 5], watch: [2, 5], region: "mind", scale: true, sos: "mental",
      why: "Behavioral health is monitored throughout long missions." }
  ],

  /* ---------- SOS decision trees ----------
     node: { q, o:[[label, nextId], ...] }
     or    { r: { sev:'critical'|'caution'|'ok', t, steps:[...], gear:[...], vital:'hr' } } */
  sos: {
    space: [
      { id: "unresp", icon: "🚨", title: "Crewmate unresponsive", start: "a", n: {
        a: { q: "Do they respond when you call their name and tap their shoulders?", o: [["Yes, responding", "ok"], ["No response", "b"]] },
        ok: { r: { sev: "caution", t: "Awake but unwell", vital: "hr", steps: ["Stay with them, keep them still and secured.", "Ask what happened; measure pulse, SpO₂ and temperature.", "Alert the crew medical officer and ground.", "Re-check every few minutes."] } },
        b: { q: "Are they breathing normally?", o: [["Yes", "c"], ["No / only gasping", "d"]] },
        c: { q: "Are cabin air alarms active?", o: [["Yes", "c1"], ["No", "c2"]] },
        c1: { r: { sev: "critical", t: "Possible toxic air or low O₂", gear: ["oxygen"], steps: ["Put on your own breathing apparatus first.", "Give the patient oxygen and move them to good air.", "Alert all crew and ground.", "Monitor breathing continuously."] } },
        c2: { r: { sev: "caution", t: "Unresponsive but breathing", vital: "spo2", steps: ["Alert the crew and ground now.", "Secure the patient, keep the airway open.", "Measure SpO₂, pulse and blood sugar.", "Monitor until the medical officer takes over."] } },
        d: { r: { sev: "critical", t: "Not breathing — start CPR", gear: ["cpr", "aed"], steps: ["Alert the whole crew and ground immediately.", "Restrain the patient on a rigid surface.", "Start compressions — brace against the ceiling or wrap your legs around them.", "Attach the defibrillator as soon as it arrives.", "Continue until the medical officer takes over."] } }
      }},
      { id: "air", icon: "🫁", title: "Chest pain / can't breathe", start: "a", n: {
        a: { q: "Are cabin air alarms active, or others feeling the same?", o: [["Yes", "x"], ["No, only one person", "y"]] },
        x: { r: { sev: "critical", t: "Possible low O₂ or high CO₂", gear: ["oxygen"], steps: ["Alert everyone; follow the cabin-air emergency procedure.", "Don breathing apparatus or move to known-good air.", "Check each crew member for confusion or blue lips.", "Report to ground and isolate the fault."] } },
        y: { q: "Is the pain crushing, spreading to the arm/jaw, or with sweating?", o: [["Yes", "y1"], ["No", "y2"]] },
        y1: { r: { sev: "critical", t: "Possible cardiac event", gear: ["aed", "oxygen"], vital: "bp", steps: ["Stop all activity; secure them at rest.", "Give oxygen if SpO₂ is low; log pulse and BP.", "Alert the medical officer and ground now.", "Have the defibrillator ready."] } },
        y2: { r: { sev: "caution", t: "Monitor closely", vital: "spo2", steps: ["Rest and measure SpO₂, pulse and BP.", "Note what triggered it (exercise, eating, position).", "Report to the medical officer.", "Escalate if it worsens."] } }
      }},
      { id: "dcs", icon: "🧑‍🚀", title: "Joint pain after spacewalk", start: "a", n: {
        a: { q: "Did symptoms start within hours of a spacewalk or pressure change?", o: [["Yes", "b"], ["No", "y"]] },
        b: { q: "Any numbness, weakness, confusion or breathing trouble?", o: [["Yes", "x2"], ["Only joint pain", "x1"]] },
        x1: { r: { sev: "critical", t: "Possible decompression sickness", gear: ["oxygen"], steps: ["Return to the pressurised area and rest.", "Start 100% oxygen.", "Alert ground at once.", "Follow the repressurisation treatment procedure."] } },
        x2: { r: { sev: "critical", t: "Serious decompression sickness", gear: ["oxygen"], steps: ["100% oxygen immediately.", "Lay them flat and secured.", "Alert ground — prepare treatment procedure.", "Monitor breathing and consciousness continuously."] } },
        y: { r: { sev: "ok", t: "Likely strain or overuse", steps: ["Rest the area and note which joints hurt.", "Review exercise load and posture.", "Tell the medical officer if it persists."] } }
      }},
      { id: "dizzy", icon: "💫", title: "Dizzy or off-balance", start: "a", n: {
        a: { q: "Did it start after a gravity change (launch, landing, new surface)?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "caution", t: "Likely sensorimotor adaptation", steps: ["Move slowly; keep handholds nearby.", "No piloting, driving or spacewalks until it settles.", "Hydrate and rest.", "Do the balance drill daily."] } },
        y: { r: { sev: "caution", t: "Unexplained dizziness", vital: "glu", steps: ["Secure yourself and measure vitals, incl. blood sugar.", "Ask about head impact, illness or air alarms.", "Contact the medical officer if it lasts."] } }
      }},
      { id: "bleed", icon: "🩹", title: "Bleeding / injury", start: "a", n: {
        a: { q: "Is blood spurting or soaking through dressings?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "critical", t: "Severe bleeding", gear: ["bleed"], steps: ["Gloves on; firm direct pressure.", "Limb: apply tourniquet above the wound and note the time.", "Capture floating blood with absorbent wipes.", "Alert the medical officer and ground."] } },
        y: { r: { sev: "ok", t: "Minor wound", gear: ["bleed"], steps: ["Clean with sterile water.", "Cover with a dressing.", "Watch for redness or fever over the next days."] } }
      }},
      { id: "mental", icon: "🫂", title: "Crewmate withdrawn", start: "a", n: {
        a: { q: "Are they talking about harming themselves or others?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "critical", t: "Safety concern", steps: ["Stay with them; don't leave them alone.", "Calmly remove hazards.", "Alert the commander and ground behavioral health now."] } },
        y: { r: { sev: "caution", t: "Isolation stress", vital: "mood", steps: ["Listen without judging.", "Encourage sleep, exercise and connection.", "Schedule a private call with ground behavioral health.", "Adjust workload where possible."] } }
      }},
      { id: "spe", icon: "☢️", title: "Radiation alarm", start: "a", n: {
        a: { q: "Is a solar particle event alert active, or your dosimeter in alert?", o: [["Yes", "x"], ["Not sure", "y"]] },
        x: { r: { sev: "critical", t: "Go to the radiation shelter", steps: ["Move everyone to the most shielded area.", "Recall any crew on a spacewalk.", "Stay until the all-clear; keep logging the dose.", "Report nausea or fatigue to the medical officer."] } },
        y: { r: { sev: "caution", t: "Verify the status", gear: ["dosimeter"], steps: ["Read your dosimeter and log it in Radiation.", "Check the space-weather feed.", "Postpone spacewalks until confirmed."] } }
      }}
    ],
    earth: [
      { id: "unresp", icon: "🚨", title: "Person unresponsive", start: "a", n: {
        a: { q: "Do they respond when you shout and tap their shoulders?", o: [["Yes", "ok"], ["No", "b"]] },
        ok: { r: { sev: "caution", t: "Awake but unwell", steps: ["Stay with them and ask what happened.", "Call your local emergency number if symptoms are serious.", "Keep them comfortable and monitor."] } },
        b: { q: "Are they breathing normally?", o: [["Yes", "c"], ["No / only gasping", "d"]] },
        c: { r: { sev: "caution", t: "Unresponsive but breathing", steps: ["Call your local emergency number (e.g., 112, 911, 192).", "Roll them onto their side to keep the airway open.", "Stay until help arrives."] } },
        d: { r: { sev: "critical", t: "Not breathing — start CPR", gear: ["cpr", "aed"], steps: ["Call your emergency number and put it on speaker.", "Push hard and fast in the centre of the chest.", "Send someone for an AED.", "Continue until help arrives."] } }
      }},
      { id: "air", icon: "🫀", title: "Chest pain / can't breathe", start: "a", n: {
        a: { q: "Crushing pain, spreading to arm/jaw, sweating or severe breathlessness?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "critical", t: "Treat as an emergency", gear: ["aed"], steps: ["Call your emergency number immediately.", "Sit them down and loosen tight clothes.", "Be ready to start CPR."] } },
        y: { r: { sev: "caution", t: "Monitor and seek care", vital: "hr", steps: ["Rest and measure heart rate and BP.", "Contact a doctor today.", "Call emergency services if it worsens."] } }
      }},
      { id: "sun", icon: "🥵", title: "Sunburn / heat illness", start: "a", n: {
        a: { q: "Confused, vomiting, very hot skin or fainting?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "critical", t: "Possible heat stroke", steps: ["Call your emergency number.", "Move to shade; cool the body with wet cloths and a fan.", "Don't leave them alone."] } },
        y: { r: { sev: "caution", t: "Sunburn or heat exhaustion", gear: ["sunscreen"], steps: ["Move to shade and drink water.", "Cool the skin with a damp cloth.", "Avoid more sun; protect tomorrow."] } }
      }},
      { id: "dizzy", icon: "💫", title: "Dizzy or faint", start: "a", n: {
        a: { q: "Did they lose consciousness or have chest pain?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "critical", t: "Seek emergency care", steps: ["Call your emergency number.", "Lay them down and keep them still."] } },
        y: { r: { sev: "ok", t: "Likely mild", vital: "glu", steps: ["Sit or lie down; drink water, eat something.", "Rise slowly.", "See a doctor if it keeps happening."] } }
      }},
      { id: "bleed", icon: "🩹", title: "Bleeding / injury", start: "a", n: {
        a: { q: "Is blood spurting or soaking through dressings?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "critical", t: "Severe bleeding", gear: ["bleed"], steps: ["Call your emergency number.", "Firm direct pressure; don't lift to check.", "Tourniquet on a limb if pressure fails."] } },
        y: { r: { sev: "ok", t: "Minor wound", gear: ["bleed"], steps: ["Rinse with clean water.", "Cover with a clean dressing.", "Watch for signs of infection."] } }
      }},
      { id: "mental", icon: "🫂", title: "Someone feels very low", start: "a", n: {
        a: { q: "Are they talking about harming themselves?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "critical", t: "Get help now", steps: ["Stay with them and remove hazards.", "Call your emergency number or a crisis line.", "Don't leave them alone."] } },
        y: { r: { sev: "caution", t: "Support them", vital: "mood", steps: ["Listen without judging.", "Encourage sleep, movement and connection.", "Suggest talking to a health professional."] } }
      }}
    ]
  },
  sosGear: ["cpr", "aed", "oxygen", "bleed"],

  /* ---------- Radiation: the user logs what the device shows ----------
     levels: checked in order, first with value <= max wins (demo thresholds) */
  radiation: {
    space: {
      title: "Radiation dose", unit: "µSv/h", label: "Dose rate on your dosimeter", step: "0.1", max: 100000,
      ref: "Typical ISS dose rate ≈ 20–40 µSv/h (demo reference).",
      devices: ["dosimeter", "bubble", "cans"],
      levels: [
        { max: 50, name: "Nominal", cls: "good", advice: ["Normal operations.", "Keep wearing your dosimeter.", "Log again tomorrow."] },
        { max: 500, name: "Elevated", cls: "watch", advice: ["Space weather may be active — log every hour.", "Postpone non-essential spacewalks.", "Stay close to the shielded area."] },
        { max: Infinity, name: "Solar particle event", cls: "alert", sos: "spe", advice: ["Go to the radiation shelter now.", "Recall any crew outside.", "Stay until the all-clear."] }
      ],
      research: "Canada's radiation experiments on the ISS include bubble detectors, MOSFET, EVARM and Radi-N/Radi-N2. The next step, CANS, will measure neutrons continuously — and could help cancer therapy, aircrew protection and public safety on Earth."
    },
    earth: {
      title: "UV index", unit: "UV", label: "UV index you observed", step: "1", max: 20,
      ref: "UV index from your weather app or a UV meter.",
      devices: ["uv", "sunscreen"],
      levels: [
        { max: 2, name: "Low", cls: "good", advice: ["Low risk; sunglasses on bright days.", "Keep the sunscreen habit."] },
        { max: 5, name: "Moderate", cls: "watch", advice: ["Apply SPF 30+.", "Seek shade around midday."] },
        { max: 7, name: "High", cls: "watch", advice: ["SPF 30+, reapply every 2 h.", "Hat and sunglasses."] },
        { max: 10, name: "Very high", cls: "alert", advice: ["Avoid the midday sun.", "Cover up and stay in shade."] },
        { max: Infinity, name: "Extreme", cls: "alert", sos: "sun", advice: ["Stay in shade as much as possible.", "Full protection: sunscreen, hat, long sleeves."] }
      ],
      research: "Radiation-monitoring technology developed for astronauts also has Earth uses: cancer therapy, aircrew protection and public safety."
    }
  },

  /* ---------- Milestones (gamification without XP or levels) ---------- */
  milestones: [
    { id: "first", icon: "✦", name: "First light", desc: "Complete a mission" },
    { id: "s3", icon: "🔥", name: "3-day streak", desc: "3 days in a row" },
    { id: "s7", icon: "☄️", name: "7-day streak", desc: "7 days in a row" },
    { id: "full", icon: "🌟", name: "Full constellation", desc: "All missions in a day" },
    { id: "green", icon: "💚", name: "Fully fit", desc: "Every body region green" },
    { id: "vit10", icon: "📈", name: "Data driven", desc: "Log 10 measurements" },
    { id: "rad5", icon: "📛", name: "Dose aware", desc: "Log radiation 5 times" },
    { id: "spf7", icon: "🧴", name: "Sun shield", desc: "7-day sunscreen streak" }
  ],

  /* ---------- Science page: how features map to research ---------- */
  science: [
    { n: "Standard Measures", d: "A consistent set of physiological and psychological measurements from every crew member.", used: "Health page", src: "research" },
    { n: "ARCHeR (Artemis II)", d: "Wrist actigraphy recording motion, sleep and light exposure.", used: "Sleep missions & sleep indicator", src: "research" },
    { n: "Tempus Pro", d: "Commercial telemedicine device collecting health data for remote diagnosis.", used: "Morning vitals, SOS", src: "research" },
    { n: "Zero T2", d: "Exercise without a treadmill for deep-space missions.", used: "Resistive & aerobic missions", src: "research" },
    { n: "Thigh Cuff · B-Complex", d: "Countermeasures for eye and brain changes (SANS).", used: "Fluid shift & vision check", src: "research" },
    { n: "Food Acceptability · Space Gardening", d: "Food appeal over long missions; gardening against isolation.", used: "Nutrition & connection missions", src: "research" },
    { n: "Manual piloting for Moon landings", d: "Effects of gravity transitions on piloting skills.", used: "Balance & gaze drill", src: "research" },
    { n: "CANS & bubble detectors", d: "Neutron measurement on the ISS (~30% of the dose).", used: "Radiation page & device guides", src: "csaRad" },
    { n: "5 hazards & risks", d: "Radiation, isolation, distance, gravity, hostile environments.", used: "Environments, body regions, SOS", src: "hazards" },
    { n: "Space ↔ Earth", d: "Weightlessness resembles accelerated aging and inactivity.", used: "Earth mode", src: "csaSci" },
    { n: "WHO physical activity", d: "150 min/week + strength twice weekly; 31% of adults insufficiently active.", used: "Earth missions", src: "who" }
  ]
};
