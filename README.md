# ✦ Core Leonis — Health monitoring for astronauts (and the rest of us)

**NASA Space Apps Challenge 2026 · Health Monitoring Software**

*Cor Leonis* — “the heart of the lion” — is the old name of Regulus, the brightest star in Leo. **Core Leonis** is a health-monitoring app with light gamification: crews log their own health data, follow science-based daily countermeasures and get step-by-step help in emergencies. Pick an environment — **Earth, Low Earth Orbit, Moon, Mars or Deep Space** — and the missions, risks, radiation tools and emergency trees adapt.

> **Space ↔ Earth.** Weightlessness produces effects similar to accelerated aging and a sedentary lifestyle ([CSA](https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp)). In Earth mode, inactivity replaces microgravity and the Sun's UV replaces space radiation (with a sunscreen streak).

## ▶ Try it (no install)

- **GitHub Pages:** *Settings → Pages → Deploy from branch → `main` / root*. The site will be at `https://<user>.github.io/<repo>/`.
- **Locally:** double-click `index.html`. No server, no build, no dependencies.

## What's inside

| Page | What the user does |
|---|---|
| **✦ Today** | A daily path of mission protocols (exercise, fluid-shift check, nutrition, sleep, vitals, dosimeter…). Each mission has steps with **built-in timers**, **equipment how-to guides** and the science behind it. Completed missions light up as stars in a constellation. |
| **🧍 Body** | A clickable body (mind, heart, nutrition, muscles & bones, radiation shield) that changes color with the care it gets and fades without it. It suggests a focus mission for the weakest region. |
| **❤️ Health** | Log heart rate, blood pressure, SpO₂, blood sugar, temperature, sleep and mood. Color status, trend charts, **how-to-measure guides** for each device. An alert opens the matching SOS tree. |
| **🆘 SOS** | Emergency **decision trees** shown as a growing tree: answer quick questions until you reach the recommended action, then tick the actions off. You can view the full tree, open equipment guides (CPR in microgravity, AED, oxygen, bleeding control) and log the related vital. |
| **☢️ Radiation** | The user **enters the observed value** (dosimeter µSv/h in space, UV index on Earth). It shows a gauge, status, actions and history, plus a mission-dose estimate (space) or a sunscreen streak with a reapply reminder (Earth). **? Help** explains the measuring devices: personal dosimeter, bubble detectors and CANS (in development). |

**Gamification without turning it into a game:** daily streaks, per-mission streaks, constellation progress and milestones. There are no XP points, levels or quizzes.

**Experience:** smooth transitions, spring animations, synthesized sound effects (Web Audio, can be muted in the menu) and haptics on mobile. Reduced-motion settings are respected.

**Less clutter:** explanations sit behind the small (i) buttons, and all sources are on one **Science & sources** page (tap the logo).

## Project structure

```
index.html        page shell
css/style.css     visual identity & animations
js/app.js         app logic (rarely needs editing)
js/sound.js       synthesized sound effects
data/content.js   ALL content: missions, equipment guides, vitals, SOS trees, radiation levels, sources
assets/logo.svg   logo / favicon
```

## Adding content (no coding needed)

Open `data/content.js`, copy an entry, edit it, save and refresh the page.

- **Mission:** `tasks.space`, `tasks.earth` or `envTasks.<env>`. Steps are `["text", seconds]`; adding seconds gives that step a timer.
- **Equipment guide:** `gear.<key>`, then reference it with `gear:["key"]` from a mission, vital, SOS result or radiation device list.
- **Vital sign:** `vitals` (with `ok` / `watch` ranges and an optional `sos` tree to open on alert).
- **SOS tree:** `sos.space` / `sos.earth`. Question nodes `{q, o:[[label,nextId]]}` and result nodes `{r:{sev,t,steps,gear,vital}}`.
- **Radiation thresholds:** `radiation.space.levels` / `radiation.earth.levels`.

## Science & sources

- NASA HRP: [5 Hazards](https://www.nasa.gov/hrp/hazards/) · [Risks](https://www.nasa.gov/hrp/risks/) · [Ongoing Research](https://www.nasa.gov/hrp/ongoing-hrp-research/) (Standard Measures, ARCHeR, Tempus Pro, Zero T2, Thigh Cuff, B-Complex, Food Acceptability, Space Gardening, manual piloting)
- CSA: [Monitoring radiation for astronaut health (2026)](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp) (CANS, bubble detectors, ~30% neutron dose) · [Why do we conduct science experiments in space?](https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp)
- WHO: [Physical activity fact sheet](https://www.who.int/news-room/fact-sheets/detail/physical-activity)

## Disclaimer

Educational prototype. Reference ranges, radiation thresholds and SOS steps are simplified for demonstration and are **not medical advice**. Real crews follow flight-surgeon procedures. All data stays in the browser (`localStorage`).
