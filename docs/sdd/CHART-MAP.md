# CHART-MAP — catalog ID → kit component + variant

Ask-by-ID contract: `<ID>` → `<Component variant="<name>">` (+ SELECT options as props).
Source spec per ID: the CFG entry in the catalog page (lockin90-design/charts/) — config = spec.

## area-charts → AreaChart (new)
- **AR-01** `variant="stack"` — SELECT 2–4 SERIES · stacked fading areas + edge lines + legend
- **AR-03** `variant="percent-stack"` — normalized to a full column — shares, not amounts
- **AR-04** `variant="stream-center"` — streamgraph — stack centered on the midline, organic silhouette
- **AR-05** `variant="effect-stack"` — trio stack + chip labels INSIDE their bands + NOW rule — the effect-pipeline chart
- **AR-06** `variant="fade-stack"` — each band fades 55%→12% vertically — lighter look
- **AR-07** `variant="mini-multiples"` — 3 small duo-stacks side by side + day captions

## bar-charts → BarChart (extend)
- **BC-01** `variant="bars"` — rounded bars rx3 · SELECT COLOR: any token / vertical gradient / glass 14% · SELECT DENSITY: 7 wide blocks → 12 default → 24 thin sticks
- **BC-04** `variant="spectrum-bars"` — each bar hued by x-position (lime→…→magenta spectrum)
- **BC-05** `variant="zone-bars"` — bar color = value zone (≥62 mint · ≥38 amber · else coral)
- **BC-08** `variant="lollipop"` — stem 2px + 3.4px head dot · --cyan
- **BC-11** `variant="diverging-tide"` — ± around 50% midline · above --mint / below --zone-low
- **BC-12** `variant="stacked"` — SELECT 2–3 SEGMENTS (60/40 · 45/33/22) · outer corners rounded, seams square
- **BC-14** `variant="grouped-pair"` — two series side-by-side · --mint vs --violet 85%
- **BC-15** `variant="value-caps"` — mono value labels above every 2nd bar · n≤10
- **BC-16** `variant="fade-history"` — opacity ramps 25%→100% toward newest
- **BC-17** `variant="today-pulse"` — all bars 30% except today 100% + pulse dot above
- **BC-18** `variant="rank-rows"` — horizontal ranked pills · spectrum order · mono row labels
- **BC-19** `variant="waterfall"` — floating +/− steps (mint gain / coral loss) + connector ticks
- **BC-20** `variant="goal-bars"` — bars + dashed --zone-mid GOAL rule at 68%
- **BC-22** `variant="sparkbar-micro"` — no grid · 16 micro bars · fits inside stat cards
- **BC-24** `variant="forecast-bars"` — past solid · future outlined dashed · NOW rule between

## beeswarm-charts → BeeswarmChart (new)
- **BW-01** `variant="history-swarm"` — 60 sessions as a swarm along the duration axis · colored by type (strength violet / cardio cyan / mobility lime) · this week ringed white · legend
- **BW-02** `variant="score-swarm"` — daily scores swarmed on a 0–100 axis, zone-colored · TODAY pulses with a pill — you vs your own history
- **BW-03** `variant="pr-swarm"` — all sessions as faint white dots · the PR glows mint + pill — one hero dot
- **BW-04** `variant="month-swarm"` — two swarms stacked on a shared axis (this month mint / last faint) + mean ticks + delta pill

## biomarker-charts → BiomarkerRange (promote from admin ReferenceRangeBar)
- **BR-01** `variant="panel-rows"` — 4 marker rows: faint scale + mint reference band + value dot (mint in-range / coral out) + LOW/HIGH flag above out-of-range dots
- **BR-02** `variant="single-marker"` — one large row with the anatomy labeled: LOW/OPTIMAL/HIGH zones, range numbers, pulsing value dot + big result
- **BR-03** `variant="marker-trend"` — rows + last-4-tests spark and direction arrow per marker (improving mint / worsening coral / flat dim)
- **BR-04** `variant="panel-grid"` — 2×3 tiles: name + OK/LOW/HIGH verdict + mini range row + value; out-of-range tiles get a coral border
- **BR-05** `variant="range-history"` — one marker over 5 test dates: dots + connecting line crossing INTO the shaded reference band — the recovery story

## body-battery-charts → BodyBattery (new)
- **BB-01** `variant="battery-day"` — zone-stroked % curve over 24h · violet sleep shading + CHARGING bolt · NOW pulse + % pill · day axis
- **BB-02** `variant="battery-glyph"` — big battery glyph (rounded body + terminal), zone-colored fill · SELECT STATE: level + empty-ETA / charging bolt + full-ETA / low warning + advice pil
- **BB-05** `variant="drain-events"` — day curve + coral event pills at the dips (MEETING −8% …)
- **BB-06** `variant="battery-week"` — 7 mini vertical batteries, end-level fill + % + day letters
- **BB-07** `variant="battery-vs"` — today zone curve + dashed white-30% yesterday + pills

## bullet-charts → BulletChart (new)
- **BL-01** `variant="bullets"` — range bands + slim value bar + white target tick · SELECT: rows, density (16px / 13px compact), metric tokens or attainment-zone coloring · over-targe
- **BL-02** `variant="single-bullet"` — one large bullet with the anatomy labeled: LOW/OK/GOOD bands + TARGET pill + value
- **BL-05** `variant="over-bullets"` — the over-limit story: magenta overflow segment past the scale end + OVER pills

## caffeine-charts → CaffeineClock (new)
- **CF-01** `variant="decay-curve"` — exponential half-life decay (t½ 5.7h) from the dose spike · amber dashed 50MG sleep threshold + crossing dot · violet dashed bedtime rule with verdict
- **CF-02** `variant="stacked-doses"` — each dose decays as its own faint curve + bold white TOTAL curve · the late 14:00 dose leaves 54MG at bed → coral verdict
- **CF-03** `variant="safe-window"` — day strip with mint→amber→magenta gradient + computed LAST SAFE COFFEE tick (one half-life before bed) + NOW pulse + past cups

## combo-charts → ComboChart (new)
- **CB-01** `variant="bars-line"` — bars metric + line metric on one canvas · SELECT METRIC PAIR (workouts×energy · sleep×HRV · kcal×weight …) + a token per metric · stacked legend pills
- **CB-04** `variant="area-line"` — mint energy area + amber strain line — strain spikes where energy dips
- **CB-05** `variant="bars-plan"` — mint volume bars + dashed white stepped plan line (progressive overload ramp)

## compare-charts → CompareChart (new)
- **CP-01** `variant="slope-panel"` — 2 columns · one slope per metric · up = own hue, down = coral · deltas at right
- **CP-02** `variant="dumbbell-rows"` — horizontal dot-pairs (dim start → solid end) + connector + signed deltas
- **CP-03** `variant="bump-ranks"` — rank lanes 1-4 · smooth rank lines + dots (big at latest) + #rank labels
- **CP-04** `variant="delta-arrows"` — center zero-line · 5px arrow bars, length = change, mint/coral + % labels
- **CP-05** `variant="mirror-bars"` — mirrored bars around a center spine — before left (dim), after right (hued)
- **CP-06** `variant="cohort-slopes"` — your mint slope 3.5px over 8 faint cohort slopes
- **CP-07** `variant="ladder-steps"` — 4 milestone dots climbing · done mint-60% · NOW pulse · ahead dashed

## composite-charts → CompositeChart (new)
- **CM-01** `variant="treemap"` — nested rounded rects, 28% fills + tinted borders · SELECT COLORING: time share / zone verdicts
- **CM-03** `variant="horizon-rows"` — folded 2-layer bands, 4 metrics × 40 days · SELECT MODE: absolute / |deviation| vs baseline
- **CM-05** `variant="calendar-micro"` — month grid where every day is a micro-chart · SELECT CELL: sparkline / bars
- **CM-07** `variant="goal-tree"` — root goal ring (74) + 3 child habit rings with % + bezier connectors + pills

## cycle-charts → PhaseWheel (extend)
- **CW-01** `variant="phase-wheel"` — 4 phase arcs (coral/cyan/lime/violet, round caps, gaps) · D-labels · today pulse + center day/phase + legend · optional FOCUS state (others 20% + days
- **CW-04** `variant="coach-wheel"` — wheel + violet recommendation pill under ("lower intensity, more sleep")
- **CW-05** `variant="phase-strip"` — the wheel unrolled: 4 phase pills on a 28-day strip + TODAY rule + D-ticks

## distribution-charts → DistributionChart (new)
- **DS-01** `variant="histogram"` — 14 bins · --mint bars, opacity scales with count · rx3
- **DS-02** `variant="bell-percentile"` — cyan bell + veil fill · mint YOU rule + "P82" pill
- **DS-03** `variant="cohort-bells"` — violet your-curve vs text-35% dashed cohort curve + pills
- **DS-04** `variant="box-rows"` — 4 horizontal box-whisker rows · IQR box 30% fill + median 2px + whisker caps
- **DS-05** `variant="violin"` — symmetric violet→cyan violin (bimodal visible) + MEDIAN rule + pill
- **DS-07** `variant="ridgeline"` — 4 stacked week-curves, opacity ramps to newest + drift pill

## donut-charts → Ring / Gauge / DonutChart (extend)
- **DN-01** `variant="score-ring"` — r52 ring, 11px round-cap arc + center stat · SELECT ARC: any token / gradient (lime→mint→cyan)
- **DN-03** `variant="zone-ring"` — arc + number colored by value zone (36 → coral)
- **DN-04** `variant="dual-ring"` — concentric r52 mint + r38 violet · shared center stat
- **DN-05** `variant="triple-ring"` — activity-style: r52 mint 82% · r39 cyan 64% · r26 violet 45%
- **DN-06** `variant="thin-halo"` — 4px thin ring — quiet, avatar-badge scale
- **DN-07** `variant="dashed-track"` — dotted 2-5 track · solid round-cap arc on top
- **DN-08** `variant="pulse-ring"` — pulsing dot rides the arc end (reduced-motion safe)
- **DN-09** `variant="delta-ring"` — score ring + mint delta chip under center
- **DN-13** `variant="gauge-270"` — 270° gauge (opens down) · red→amber→green arc · 5 ticks
- **DN-14** `variant="half-gauge"` — 180° semicircle · round caps · stat under the arc

## environment-charts → EnvironmentChart (new)
- **EN-01** `variant="sun-uv-arc"` — the sun path arc sunrise→sunset, segments colored by UV (cyan low / amber mid / coral high) + NOW pulse on the arc + horizon with times + PEAK pill
- **EN-02** `variant="pollen-rows"` — 3 hourly cell rows (tree/grass/weed), brightness+color = load, worst window flagged
- **EN-03** `variant="aqi-day"` — stepped AQI curve + area, dashed MODERATE rule + NOW pulse with verdict pill
- **EN-04** `variant="outdoor-window"` — UV + pollen + air rows stacked + computed mint BEST WINDOW box where all three are low

## funnel-charts → FunnelChart (promote cross-platform)
- **FN-01** `variant="band-funnel"` — centered trapezoid bands + stage labels · SELECT FILL: tokens / glass 16%
- **FN-03** `variant="bar-funnel"` — left-aligned stage bars + % + coral per-stage drop labels at right
- **FN-04** `variant="zone-funnel"` — bar funnel, stage color = conversion zone (good/warn/bad)
- **FN-05** `variant="compare-funnel"` — thin bars over white-14% ghost bars (previous period)

## heatmap-charts → Heatmap (extend)
- **HM-01** `variant="heat-grid"` — 7×16 day cells · SELECT SCALE: zone verdicts / single-hue mint / spectrum (indigo→violet→cyan→mint)
- **HM-03** `variant="streak-year"` — 30×7 micro cells (GitHub-style) · mint scale
- **HM-04** `variant="month-cal"` — 5×7 month grid · day numerals in-cell · weekday letters
- **HM-06** `variant="dot-matrix"` — circles sized AND opacified by value (double encoding)
- **HM-07** `variant="glass-grid"` — glass 5% cells · mint border opacity carries the value
- **HM-08** `variant="gap-aware"` — missing slots render as dashed empty cells — never fake zeros
- **HM-09** `variant="hour-day"` — 24h × 7d · hour labels top · spectrum scale
- **HM-10** `variant="week-strips"` — five week rows × 7 day pills · rounded 6px
- **HM-11** `variant="corr-matrix"` — 5×5 diverging matrix (mint + / coral −) · signed values in cells
- **HM-12** `variant="diverge-heat"` — diverging: above baseline mint / below coral, opacity = magnitude
- **HM-13** `variant="focus-row"` — one row full strength · others dimmed to 22%
- **HM-14** `variant="value-cells"` — big cells with mono values inside (dark text on hot cells)
- **HM-15** `variant="today-ring"` — month-cal + white ring around today + pulse above

## line-charts → LineChart (extend)
- **LC-01** `variant="solid"` — stroke 2.5px · smooth (monotone) · no fill · SELECT COLOR: any token below
- **LC-09** `variant="gradient"` — gradient stroke 3px · SELECT GRADIENT: --grad-flux (signature) / --grad-cta / --grad-mint / --grad-violet / --grad-warm / lime→mint
- **LC-15** `variant="veil"` — line + 26%→2% vertical-fade area · SELECT COLOR or gradient (spectrum veil = the today-screen hero)
- **LC-19** `variant="tide-split"` — baseline 50% · above: --mint line+fill · below: --zone-low line+fill · dashed baseline
- **LC-20** `variant="glass-fill"` — stroke --text-dim 2.5px · flat --glass-2 fill · quietest fill variant
- **LC-21** `variant="curve-styles"` — SELECT CURVE: monotone smooth (default, no overshoot) / sharp-linear (labs, weights) / step-after (doses, tiers)
- **LC-24** `variant="dash-dot"` — SELECT PATTERN: dashed 7-5 (planned / projected) / dotted round-cap 3px (reference lines)
- **LC-26** `variant="stroke-weight"` — SELECT WEIGHT: 1px hairline (context) / 2.5px default / 4.5px bold hero · any color
- **LC-28** `variant="neon"` — glow drop-shadow 7–8px behind the stroke · SELECT COLOR: any token or gradient
- **LC-30** `variant="aurora-halo"` — stroke --grad-flux 3px · wide soft halo 12px accent-55%
- **LC-32** `variant="ghost-echo"` — main --cyan 2.5px + 2 echoes offset +7px/+14px at 19%/10% opacity
- **LC-33** `variant="bead-chain"` — --mint 2.5px · 2.6px dot at every datum · n≤16 only
- **LC-34** `variant="comet-head"` — --mint 2.5px · end dot 3.6px + SVG pulse ring (reduced-motion safe)
- **LC-35** `variant="peak-flag"` — --cyan 2.5px · auto PEAK (mint) + DIP (coral) dots & mono labels
- **LC-36** `variant="now-split"` — --accent 2.5px · vertical NOW rule · past solid / future dashed 5-5 75%
- **LC-37** `variant="goal-line"` — --cyan 2.5px · dashed --zone-mid GOAL rule at 72% · mint dots above goal
- **LC-38** `variant="event-pins"` — --mint 2.5px · accent pin flags at event times (stem 16px + glow dot)
- **LC-39** `variant="multi-compare"` — SELECT 2–3 SERIES · mint vs violet (+ lime for trio) · smooth · shared axis
- **LC-41** `variant="you-vs-cohort"` — YOU --mint 2.5px solid · COHORT text-35% 1.8px dashed
- **LC-42** `variant="ghost-prev"` — current --cyan 2.5px · previous period same hue at 28%
- **LC-43** `variant="calibrating-taper"` — --zone-mid 2.5px · solid→dashed at 55% + CALIBRATING mono tag
- **LC-44** `variant="delta-ribbon"` — A mint / B violet + accent-12% ribbon fill between them
- **LC-45** `variant="confidence-veil"` — --cyan 2.5px · ±9% CI band cyan 16%→3% + 25% edge
- **LC-46** `variant="forecast-fan"` — --accent 2.5px · NOW rule at 60% · widening accent-20% fan + dashed future
- **LC-47** `variant="range-band"` — median --violet 2.5px · min/max violet-14% band + 30% edge lines
- **LC-48** `variant="raw-vs-avg"` — raw linear text-16% 1px · 5-pt moving avg --cyan 2.6px smooth
- **LC-49** `variant="anomaly-spark"` — line text-40% 1.5px · outliers >|0.14| from 5-pt avg → coral dot + ring
- **LC-50** `variant="zone-ribbon"` — stroke = vertical zone gradient (high mint / mid amber / low coral) userSpaceOnUse · 3px
- **LC-51** `variant="day-fade"` — stroke = TIME gradient (x-axis): mint 6am → lime noon → amber 6pm → coral 11pm · 3px · color = time cue, NOT value (contrast LC-50)
- **LC-52** `variant="forecast-horizon"` — past --mint solid 2.5px · NOW rule + mint pulse dot at current position · future --violet dashed 5-5 + violet fan 20%→2% · inline mono labels ACTUAL (
- **LC-54** `variant="zone-forecast"` — stroke = VALUE gradient y-mapped userSpaceOnUse (green --zone-high = 100 → amber --zone-mid = 50 → red --zone-low = 0) 3px · past solid / future dashe
- **LC-56** `variant="coach-forecast"` — LC-54 zone-forecast + two SUBDUED context lines: WITHOUT CAFFEINE CRASH — full-day counterfactual, text-30% 1.6px dashed 3-4 · RECOMMENDED — coach pat

## metaphor-charts → MetaphorWidget (new)
- **MT-01** `variant="thermometer"` — glass tube + bulb · liquid column = value (cyan→amber→coral) · SELECT: metric, TARGET tick, bulb glow
- **MT-03** `variant="fasting-hourglass"` — hourglass frame · amber sand top = remaining, bottom = elapsed + falling stream · countdown + pill
- **MT-05** `variant="habit-garden"` — 6 plants: growth stage = streak weeks (sprout→bloom w/ lime glow), wilted coral = broken · name + streak under each
- **MT-06** `variant="plant-stages"` — 5 growth stages in a row (SPROUT → WK 8+ bloom) + your-plant pill
- **MT-07** `variant="mountain-route"` — indigo mountain profile + veil fill · camp flags D30/D60 + lime SUMMIT D90 · YOU pulse at day 56
- **MT-09** `variant="hydration-bottle"` — bottle vessel fills UP through the day · cyan liquid + wave + bubbles · 8 glass ticks (done = cyan) + next-glass pill
- **MT-10** `variant="meal-plates"` — day strip with plate rings at meal times — each plate = mini macro donut + kcal above + time under + legend
- **MT-11** `variant="breath-pacer"` — guide rings + cyan orb that GROWS on inhale, holds, shrinks on exhale (19s SVG loop) + phase timings
- **MT-12** `variant="breath-session"` — breaths-per-minute curve slowing 14→7 into the shaded CALM ZONE + calm-reached pill

## pie-charts → DonutChart (extend, share-arc variants)
- **PC-01** `variant="duo-split"` — 2 round-cap arc segments · --mint + glass remainder · center stat + legend
- **PC-02** `variant="split-arcs"` — SELECT 2–5 SEGMENTS · spectrum-ordered colors · real gaps · center stat + legend
- **PC-04** `variant="zone-share"` — segments = zone verdicts · center day count + legend
- **PC-05** `variant="hero-arc"` — hero segment +4px & shine · others 30% — the arc "explode"
- **PC-07** `variant="callout-arcs"` — leader lines + chip-pill labels around the ring + center stat
- **PC-09** `variant="thin-share"` — slim 6px segments at r48 — halo weight + legend
- **PC-11** `variant="mini-multiples"` — 3 small arc rings (r26, 8px) + lead-share center + day labels + palette key
- **PC-13** `variant="nested-arcs"` — TWO concentric rings (pie-nest): inner coarse split (sleep/train/other) + outer breakdown shaded by family + leader-line chip labels around the outer 

## progress-charts → ProgressBar (extend)
- **PL-01** `variant="progress"` — title+%+sub row · SELECT COLOR or gradient · SELECT HEIGHT: 3px hairline / 8px default / 18px thick
- **PL-04** `variant="zone-progress"` — fill + % colored by value zone (mint/amber/coral)
- **PL-08** `variant="step-cells"` — 10 cells · filled = done · counter under
- **PL-09** `variant="milestone-line"` — ticks + dots at 25/50/75 — lit when passed
- **PL-11** `variant="ghost-compare"` — white-16% ghost layer under = previous period
- **PL-13** `variant="overflow-badge"` — fill caps at 100% + lime "+12 OVER" pill
- **PL-14** `variant="head-pill"` — chip-pill with % rides the fill head
- **PL-16** `variant="countdown-drain"` — coral fill drains right→left — time remaining

## pyramid-charts → ZonePyramid (new)
- **PY-01** `variant="zone-pyramid"` — 5 centered bars Z5→Z1 (coral/amber/lime/mint/cyan), width = time · % left, h:mm right, zone letter inside · base-heavy shape reads as healthy
- **PY-02** `variant="target-pyramid"` — PY-01 + dashed white target outline per zone (80/20 plan) + amber OVER pill where you exceed
- **PY-03** `variant="mirror-pyramid"` — population-pyramid layout: this week right (solid) vs last week left (32%), zone labels on the spine + delta pill

## radar-charts → RadarChart (new)
- **RD-01** `variant="balance-radar"` — 5 axes, pentagon grid, fill+edge+vertex dots · SELECT FILL: mint / gradient
- **RD-02** `variant="target-overlay"` — mint shape over dashed violet target pentagon (80%) + YOU/TARGET pills
- **RD-03** `variant="cohort-ghost"` — mint shape + text-35% dashed cohort ghost + pills
- **RD-04** `variant="zone-vertices"` — neutral shape · vertex dots colored by value zone (mint/amber/coral)
- **RD-06** `variant="weeks-trail"` — 3 overlays W1→W3, opacity 30→100% — the shape expanding
- **RD-07** `variant="mini-triples"` — 3 small radars (R30, no labels) + day captions

## radial-charts → DayWheel (new)
- **RA-01** `variant="clock-events"` — 24h tick ring (bold 6h) + glowing event dots on the rim + NOW hand + pulse + digital center
- **RA-03** `variant="radial-bars"` — 24 radiating 4.5px round bars, length = value, color = zone
- **RA-05** `variant="zone-wheel"` — 24 arc segments · zone color + opacity by value · center score
- **RA-06** `variant="radial-heat"` — 7 concentric day-rings × 24 mint segments, opacity = value

## rose-charts → RoseChart (new)
- **RS-01** `variant="balance-rose"` — 6 petals (train/sleep/food/mind/social/recover), petal length = score, spectrum colors + ring guides + labels — the weak petal is obvious
- **RS-02** `variant="week-rose"` — 7 day-petals, mint opacity by score, today solid + day letters around
- **RS-03** `variant="rose-compare"` — violet filled petals (this week) over white dashed outlines (last week)

## sankey-charts → SankeyChart (new)
- **SK-01** `variant="duo-flow"` — 2 sources → 2 targets · ribbons 40% src-colored · 8px rounded nodes
- **SK-02** `variant="source-split"` — one accent source fans into 3 targets
- **SK-03** `variant="merge-flow"` — 3 inputs merge into one mint outcome
- **SK-05** `variant="zone-outcomes"` — inputs flow into good/ok/bad zone-colored outcomes
- **SK-06** `variant="three-stage"` — sources → stages → outcomes (3 columns)
- **SK-09** `variant="highlight-path"` — one ribbon 85% · rest dimmed to 14%
- **SK-10** `variant="labeled-nodes"` — chip-pill labels on both node columns
- **SK-11** `variant="thin-streams"` — many small sources stream into 2 outcomes · 4 hues
- **SK-13** `variant="chord-factors"` — 5 factor nodes on a circle u00b7 chords through the center, width = link strength, source-colored 30% + glow dots + chip labels

## scatter-charts → ScatterChart (new)
- **SC-01** `variant="mint-scatter"` — 3px --mint dots 85% · axis captions · grid
- **SC-02** `variant="trend-fit"` — dots + dashed --cyan least-squares line + R² pill
- **SC-03** `variant="bubble-dose"` — bubble r 2-8px = third variable (dose) + size key + dark rims
- **SC-04** `variant="quadrant-map"` — dashed midlines + 4 quadrant captions (SWEET SPOT mint / DANGER coral)
- **SC-05** `variant="zone-dots"` — dot color = y-value zone (mint/amber/coral)
- **SC-06** `variant="today-marker"` — history dots 28% · TODAY lime pulse + pill
- **SC-07** `variant="density-cloud"` — 90 small dots 40% + dashed --cyan centroid ring "TYPICAL YOU"

## session-charts → SessionChart (new)
- **SN-01** `variant="hr-zones-session"` — 5 HR zone bands (Z1 indigo → Z5 coral, 6% fills + Z labels) · trace stroked by zone height · time axis
- **SN-02** `variant="hr-intervals"` — zone bands + 5 coral-shaded work blocks · square-ish HR swings between Z2 and Z5
- **SN-03** `variant="time-in-zones"` — 5 zone rows · rounded bars sized by minutes + MIN labels
- **SN-04** `variant="hr-recovery"` — zone session + pulse at peak + dashed 60s bracket + mint recovery tag
- **SN-05** `variant="sauna-rounds"` — 3 amber round blocks (ROUND pills) + PLUNGE tags · TEMP amber solid + HR coral dotted + legend
- **SN-06** `variant="sauna-heat-ramp"` — temp ramp stroked cyan→amber→coral by height · dashed TARGET 90°C rule · live pulse + state tag
- **SN-07** `variant="night-recovery"` — violet night canvas · HRV mint rising + RHR violet dashed falling · delta tags · clock axis
- **SN-09** `variant="glucose-response"` — meal-anchored curve (-30mu2026+2h) u00b7 mint baseline band 80-110 u00b7 MEAL rule + peak dot + return-time pill
- **SN-10** `variant="response-overlay"` — 3 faint white-18% single-meal curves + bold cyan mean u00b7 baseline band + MEAL rule

## sleep-charts → Hypnogram (extend) + StackedBar/Ring per CHART-MAP
- **SL-01** `variant="hypnogram"` — 4 stage rows (AWAKE amber · REM cyan · LIGHT indigo · DEEP violet) · 6px round segments + faint jump connectors · violet night canvas · clock axis
- **SL-02** `variant="stage-summary"` — 100% stacked stage bar + stage names, H:M under each + in-bed/asleep/up line
- **SL-03** `variant="sleep-score"` — violet→mint ring (84) + 4 stage mini-bars with minutes on the right
- **SL-04** `variant="efficiency-bars"` — violet asleep bars up / amber awake bars down from the midline · ASLEEP/AWAKE tags · clock axis
- **SL-05** `variant="sleep-week"` — 7 duration bars (violet ≥ target−30m, amber under) + dashed mint TARGET 8H rule + day letters
- **SL-06** `variant="bedtime-drift"` — BED (violet, coral when late) + WAKE (amber) dots joined per day · mint CONSISTENT WINDOW band
- **SL-07** `variant="night-coach"` — hypnogram + wake-window rule · SELECT: with mint recommendation pill / data-only

## state-charts → ChartState (new)
- **SV-01** `variant="skeleton-chart"` — gray placeholder bars + title/legend stubs at the real chart geometry — no layout shift when data lands
- **SV-02** `variant="loading-ring"` — small spinner arc + what is actually loading ("SYNCING WHOOP + OURA")
- **SV-03** `variant="empty-cta"` — dashed ghost bars + one-line reason + filled mint CTA pill
- **SV-04** `variant="locked-forecast"` — dashed ghost curve + "unlocks at 7 days" + 3/7 progress dots — progress toward the feature
- **SV-05** `variant="error-retry"` — coral warning triangle + plain-words reason + RETRY pill
- **SV-06** `variant="partial-sync"` — line solid until last synced point, dashed ghost after + shaded pending region + amber SYNC PENDING pill

## supplement-charts → SupplementChart (new)
- **SP-01** `variant="saturation-story"` — level line builds to SATURATED band (5 doses) → coral MISSED×3 window, level decays but holds → rebuilds · dose dots under (filled taken / dashed miss
- **SP-02** `variant="active-stack"` — 4 rows: name + level bar + % + status pill (SATURATED / OK / TAKE TODAY / DEPLETED)
- **SP-03** `variant="half-life"` — exponential decay from dose tag · NOW rule + pulse + "STILL ACTIVE · 84 MG" pill · 0h→+12h axis
- **SP-04** `variant="dose-level"` — dose dots + faint intake stems + resulting level line + key pill
- **SP-05** `variant="depletion-forecast"` — solid past · dashed decay projection after NOW · coral pulse where it crosses LOW + restock pill
- **SP-06** `variant="adherence-level"` — taken/missed day cells strip on top + resulting cyan level line under + level pill
- **SP-07** `variant="stack-levels"` — 3 level curves: creatine slow-build mint · magnesium mid cyan · caffeine sawtooth amber dashed + pills
- **SP-09** `variant="liquid-batteries"` — 5 battery vessels in a bar-chart row: glass body + cap · wavy liquid fill, gradient 90%u219245% + surface highlight + bubbles u00b7 liquid color = lev
- **SP-10** `variant="battery-hero"` — one large 56px vessel with bubbles + liquid shine u00b7 FULL/LOW ticks on the side u00b7 right stats: 78% u00b7 SATURATED pill u00b7 "holds ~9 days of

## timeline-charts → TimelineChart (new)
- **TL-01** `variant="event-line"` — events on a time rail · SELECT MARKERS: plain dots / icon pins with glow heads / chip pills alternating
- **TL-04** `variant="now-strip"` — past dots 100% · future 35% · NOW rule + pulse
- **TL-05** `variant="planned-hollow"` — past = filled dots · planned = dashed hollow rings
- **TL-06** `variant="zone-strip"` — 10px zone band under the axis (energy by hour) + events
- **TL-07** `variant="spark-under"` — faint white-10% energy sparkline behind the strip
- **TL-08** `variant="heat-ticks"` — 25 vertical ticks colored by hourly value zone
- **TL-09** `variant="range-blocks"` — rounded 16px span pills on one lane + dark inline labels
- **TL-10** `variant="multi-lane"` — 3 named lanes (BODY/MIND/LIFE) · 14px span pills
- **TL-11** `variant="gantt-mini"` — 3 phase bars + dashed dependency elbows
- **TL-12** `variant="duration-brackets"` — bracket outlines + chip labels over the axis
- **TL-13** `variant="cluster-bubbles"` — bubbles sized by event count · count numeral inside
- **TL-14** `variant="ticks-24h"` — 24 hour-ticks (bold every 6h) + hour labels + events
- **TL-15** `variant="feed"` — vertical event feed · SELECT LAYOUT: single-side / alternating
- **TL-17** `variant="milestone-flags"` — flag pennants on stems + chip labels under the axis
- **TL-18** `variant="journey-line"` — 6px lime→mint progress rail · milestone rings · DAY pill + pulse at position
- **TL-20** `variant="now-zone-strip"` — zone band + past/future dots + NOW pulse — the full day widget

## unit-charts → UnitChart (new)
- **UN-01** `variant="waffle-90"` — 90 dots (15×6) · filled mint ramps toward today · lime TODAY pulse + caption
- **UN-02** `variant="waffle-share"` — 10×10 squares partitioned by zone colors + dot legend
- **UN-03** `variant="pictogram-rows"` — icon rows (dumbbell/moon/cup glyphs) · done 100% vs remaining 18% + counts
- **UN-04** `variant="day-dots"` — 7 big 10px dots · done = mint + dark check · pending outline + day letters + pill
- **UN-05** `variant="habit-grid"` — 3 habit rows × 7 day dots, each row its own hue

## vitals-charts → VitalsStrip (new)
- **VT-01** `variant="ecg-strip"` — PQRST beats (sharp polyline, no smoothing) on faint ECG-paper verticals · big mono BPM readout · pulse on the latest R peak
- **VT-02** `variant="hrv-rhythm"` — cyan ECG with visibly uneven beat spacing + RR bracket ruler underneath (ms per gap) + HRV pill — variability is the story
- **VT-03** `variant="monitor"` — two traces (ECG mint + slow respiration cyan) + right stat column HR/HRV/RESP big mono
- **VT-04** `variant="night-hr"` — compressed full-night HR curve (indigo) in a shaded sleep window · LOW pill at the dip · WAKE spike amber · 11PM/3AM/7AM ticks
- **VT-05** `variant="anomaly-beat"` — normal strip with ONE premature beat re-drawn coral + dashed ring + IRREGULAR pill

## watch-charts → WatchComplication (new)
- **WC-01** `variant="ring-score"` — graphic-circular complication: 82% mint ring on a faint track + big value + label (drawn 2× for the catalog)
- **WC-02** `variant="battery-gauge"` — 270° gauge, zone-colored + bolt glyph + % — body battery at a glance
- **WC-04** `variant="micro-spark"` — big value + 10-point micro sparkline + end dot inside the circle
- **WC-05** `variant="corner-gauge"` — square face with 4 corner micro-widgets — featured TL: half-arc gauge + tiny value (UV 6); others show text/dots/ring fits
- **WC-06** `variant="inline-pill"` — wide pill: mini ring + mono text + progress bar — one-line data
- **WC-07** `variant="rings-trio"` — three concentric rings (move mint / train cyan / sleep violet) with round caps

## stat-tiles → StatTile (new)
- **ST-01** `variant="stat-tile"` — big number + delta · SELECT ACCESSORY: none / 16-pt spark / micro bars / goal ring / progress bar · optional verdict glow-dot
- **ST-06** `variant="hero-number"` — centered 52px number + delta + insight line
- **ST-07** `variant="duo-tile"` — two stats split by a hairline, each with own delta
- **ST-10** `variant="stat-list"` — 3 rows: label + bold value + colored mini-spark each
