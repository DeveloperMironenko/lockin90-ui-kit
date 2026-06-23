# Reuse recipes — compose these, don't add new kit exports

During the web+mobile rebuild-gap pass (2026-06-23) four requested "primitives" were
**deliberately NOT added** as new exports: an existing primitive already covers them.
Compose them in the app from what the kit already ships. This keeps the kit lean
(per the build docs' own "verify first" guidance). Each recipe is identical on web
(`@lockin90/ui`) and native (`@lockin90/ui-native`).

## ConfidenceMeter → `Meter`
`Meter` already takes `value`/`min`/`max`/`label`/`showValue`/`unit`/`tone`. A confidence
meter is just a labelled fill meter:
```tsx
<Meter value={0.82} min={0} max={1} label="Confidence" showValue unit="" tone="accent" />
```

## ConversationRow → `ListRow`
A thread/conversation row = `ListRow` with an `Avatar` leading slot and a small
time + unread trailing column:
```tsx
<ListRow
  leading={<Avatar name="Sofia" src={a.avatar} />}
  title="Sofia"
  subtitle="See you at the gym 💪"
  trailing={<div style={{ textAlign: 'right' }}><Mono>8:02a</Mono><Badge tone="accent">3</Badge></div>}
/>
```
(native: same props; trailing is a small `View` with a `Text` time + `Badge`.)

## E2EEBadge → `Chip` + lock `Icon`
An "encrypted" pill is a `Chip` with a leading lock glyph:
```tsx
<Chip tone="accent"><Icon name="lock" size={12} /> Encrypted</Chip>
```
(native `Chip` takes a `label` string, so render the lock inline in the label area or
use a small `Badge` + `Icon` row.)

## GlycemicCurve → `PkChart` (samples) or band-`LineChart`
A blood-sugar response curve is a concentration-over-time curve — feed glucose samples
straight into `PkChart` (raw `samples` mode, which bypasses the Bateman dose model):
```tsx
<PkChart samples={glucoseSamples} unit="mg/dL" threshold={{ value: 140, label: 'Spike' }}
         axis={['0h','1h','2h','3h']} color="var(--warn)" />
```
Or, for an "optimal band" behind a trend line, use the now-extended `LineChart`:
```tsx
<LineChart data={glucose} band={{ upper: optimalHi, lower: optimalLo }} markers={[{ index: peakIdx, label: 'peak' }]} />
```

---
See the full primitive list in [COMPONENT-INVENTORY.md](./COMPONENT-INVENTORY.md).
