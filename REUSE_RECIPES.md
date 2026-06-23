# Reuse recipes — compose these in the app, don't add them to the kit

During the web+mobile rebuild-gap pass (2026-06-23) several requested "components" are
**not shipped as kit exports** — an existing primitive already covers them, or they're
page-specific layouts better assembled in the app. This keeps the kit to genuinely
shared atoms + reused molecules (per the build docs: *"compositions … are app-level
layouts, not kit gaps — build them in the page"*). Each recipe is identical on web
(`@lockin90/ui`) and native (`@lockin90/ui-native`).

## A. Covered by an existing primitive (verify-first items)

### ConfidenceMeter → `Meter`
`Meter` already takes `value`/`min`/`max`/`label`/`showValue`/`unit`/`tone` — a confidence meter is a labelled fill meter:
```tsx
<Meter value={0.82} min={0} max={1} label="Confidence" showValue tone="accent" />
```

### ConversationRow → `ListRow`
Avatar leading slot + time/unread trailing column:
```tsx
<ListRow leading={<Avatar name="Sofia" src={a.avatar} />} title="Sofia" subtitle="See you at the gym 💪"
  trailing={<div style={{textAlign:'right'}}><Mono>8:02a</Mono><Badge tone="accent">3</Badge></div>} />
```

### E2EEBadge → `Chip` + lock `Icon`
```tsx
<Chip tone="accent"><Icon name="lock" size={12} /> Encrypted</Chip>
```

### GlycemicCurve → `PkChart` (samples) or band-`LineChart`
Feed glucose samples to `PkChart` (raw `samples` mode bypasses the Bateman dose model), or use the band-extended `LineChart` for an "optimal band":
```tsx
<PkChart samples={glucose} unit="mg/dL" threshold={{ value: 140, label: 'Spike' }} color="var(--warn)" />
<LineChart data={glucose} band={{ upper: optimalHi, lower: optimalLo }} markers={[{ index: peakIdx, label: 'peak' }]} />
```

## B. Page-specific layouts (assemble from kit primitives)

These were prototyped but pulled back out of the kit — they're page sections, not shared
atoms. Compose them in the screen from the primitives the kit ships.

### SocialPost → `Card` + `Avatar` + `EngagementBar`
```tsx
<Card>
  <div className="head"><Avatar name={author.name} src={author.avatar} />
    <div><b>{author.name}</b> <Mono>@{author.handle} · {time}</Mono></div></div>
  <p>{body}</p>
  {media}
  <EngagementBar like={…} comment={…} share={…} save={…} />   {/* EngagementBar IS in the kit */}
</Card>
```

### ProfileHeader → cover + overlapping `Avatar` + `Stat` row
```tsx
<div className="cover" style={{ background: 'var(--grad-flux)' }}>{cover && <img src={cover} />}</div>
<Avatar name={name} src={avatar} size={84} />            {/* pulled up over the cover */}
<h2>{name} {verified && <Icon name="checkCircle" />}</h2><Mono>@{handle}</Mono>
<p>{bio}</p>
<div className="stats">{stats.map(s => <Stat key={s.label} label={s.label} value={s.value} />)}</div>
```

### ShareCard → gradient panel + `Ring` + `BrandMark` + device `Icon`
```tsx
<div style={{ background: 'var(--grad-flux)', aspectRatio: 1 }}>
  <Eyebrow>{title}</Eyebrow>
  <Ring value={ring} size={160}><span className="big">{value}</span></Ring>
  {subtitle}
  <footer>data from <Icon name="oura" /> · <BrandMark variant="lockup" /></footer>
</div>
```
(native: `expo-linear-gradient`, or `react-native-svg` `RadialGradient` for the mesh.)

---
Kept in the kit (reused enough, fixed shape): `InsightCard`, `PendingPatternCard`,
`ReauthDialog`, `PricingTierCard`, `AchievementBadge`, `EngagementBar`, `FollowButton`,
`LeaderboardRow`. Full list in [COMPONENT-INVENTORY.md](./COMPONENT-INVENTORY.md).
