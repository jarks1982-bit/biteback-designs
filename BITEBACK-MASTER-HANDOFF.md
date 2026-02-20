# BITEBACK â€” MASTER PROJECT HANDOFF

**Consolidated from all sessions through February 20, 2026**
**Upload this document + all HTML design files + PRD to a new Claude chat to resume.**

---

## 1. WHAT IS BITEBACK

A gamified orthodontic compliance app for teens (12â€“18). AI coach characters roast and hype patients to keep them following treatment instructions (rubber bands, brushing, retainer wear, etc). Built by an orthodontist who noticed teen patients respond better to peer pressure and humor than clinical reminders.

**B2B:** Practices pay for dashboard access (two-tier pricing â€” see Section 13)
**B2C:** App is free for patients. Premium tier ($4.99/mo or $34.99/yr) unlocks extra coaches, enhanced features, profile customization
**No HIPAA risk:** Code-based system â€” practice gives patient a code, no PHI stored

**Core technology:** A Projected Finish Date Engine (PFDE) â€” referred to as "Treatment Forecast" in the practice dashboard â€” that uses rolling compliance data to forecast treatment end dates. The forecast is the brain. The coach is the mouth. Teens see roasts. Orthodontists see projections, manage challenges, verify compliance, and adjust timelines.

**Distribution:** QR codes through orthodontic practices. Free for patients at baseline.

---

## 2. LOCKED DESIGN SYSTEM

### 2a. Patient App â€” Dark Mode (Primary)

| Element | Color | Usage |
|---------|-------|-------|
| Background | `#0A0A0A` | App background |
| Cards | `#111` + `#1A1A1A` border | Challenge cards, containers |
| Primary / Clutch | `#BFFF00` | Toxic Lime â€” check-ins, streaks, CTAs |
| Fumble | `#FF1744` | Electric Crimson â€” missed days, stamps |
| Redemption | `#FFB800` | Amber â€” recovery challenges |
| Tier Gold | `#FFD700` | Achievement badges, milestones |
| Text Primary | `#FFFFFF` | Main text on dark bg |
| Text Secondary | `#AAAAAA` | Subtitles, descriptions, coach dialogue |
| Text Tertiary / Hint | `#777777` | Hints, metadata, tier labels |
| Text Disabled Min | `#555555` | Absolute minimum for any readable text |

**NEVER use below #555 for any readable text on #0A0A0A.**

### 2b. Patient App â€” Light Mode

| Element | Color | Usage |
|---------|-------|-------|
| Background | `#F5F5F0` | Warm off-white (not pure white) |
| Cards | `#FFF` + `#E5E5E0` border | Shadow: 0 1px 3px rgba(0,0,0,0.04) |
| Primary / Clutch | `#4A8500` | Deep green (lime unreadable on white) |
| Fumble | `#DC1E3C` | Deeper crimson for contrast |
| Redemption | `#D4A017` | Darkened amber |
| Tier Gold | `#B8860B` | Darkened for readability |
| Text | `#1A1A1A` / `#333` / `#888` | Primary / body / secondary |

### 2c. Practice Dashboard â€” Light Mode

| Element | Color | Usage |
|---------|-------|-------|
| Background | `#F5F5F0` | Same warm off-white as patient light mode |
| Cards | `#FFFFFF` + `#E5E5E0` border | Shadow: 0 1px 3px rgba(0,0,0,0.03) |
| Card inner bg | `#FAFAF7` + `#EEEEE8` border | Nested elements within cards |
| Primary / On Track | `#4A8500` | Green â€” compliance, CTAs, active states |
| At Risk / Amber | `#D4A017` | Warning states |
| High Risk / Red | `#DC1E3C` | Critical alerts, fumble overrides |
| Orange | `#E07000` | Push Back timeline action |
| Gold / Tier | `#B8860B` | Tier badges, Pro plan accent |
| Sidebar active | `#4A8500` bg tint | Right border accent |
| Text primary | `#1A1A1A` | Headings, bold values |
| Text secondary | `#444` | Body text |
| Text muted | `#888` / `#999` | Labels, descriptions |
| Text faint | `#bbb` / `#ccc` | Hints, metadata, disabled |

### 2d. Founder Dashboard â€” Dark Top Bar

| Element | Color | Usage |
|---------|-------|-------|
| Top bar background | `#0A0A0A` | Nav bar (matches app dark mode) |
| Top bar accent | `#BFFF00` | Lime green border, active tab, FOUNDER badge |
| Page background | `#F5F5F0` | Same as practice dashboard |
| All other tokens | Same as practice | Green, amber, red, gold, card styles |

Layout: Sticky dark top bar (not sidebar), horizontal 5-tab nav, max-width 1400px centered content, pulsing green "live" indicator.

### 2e. Typography

| Usage | Font | Details |
|-------|------|---------|
| Logo | Rajdhani 700 | 3px letter-spacing. BITE white/dark, BACK lime/green |
| Display / Headers | Rajdhani 700 | Section titles, card headers, stat values, countdown numbers |
| Section titles | Rajdhani 600 | 18â€“20px (dashboard context) |
| Body | Outfit 500â€“700 | Coach dialogue, descriptions, table text, card names |
| Data / Mono | DM Mono 400â€“600 | Streaks, timers, labels, metadata, codes, column headers, badges |

### 2f. Coach Colors

| Coach | Dark Mode (gradient) | Light Mode |
|-------|---------------------|------------|
| Bri (Toxic Bestie) | `#FF6B9D` â†’ `#FF2E6C` | `#D4507A` |
| Jay (Mean Older Brother) | `#64748B` â†’ `#334155` | `#475569` |
| Kenji (Anime Rival) | `#EF4444` â†’ `#991B1B` | `#DC2626` |
| Claire (Toxic Overachiever) | `#C4B5FD` â†’ `#7C3AED` | `#6D28D9` |
| Mason (Chaotic Class Clown) | `#34D399` â†’ `#059669` | `#059669` |

### 2g. Dashboard Component Patterns

- **Cards**: 14px border-radius, 24px padding, white bg, `#E5E5E0` border
- **Stat cards**: 12px border-radius, 14â€“16px padding, DM Mono label + Rajdhani value
- **Buttons**: 8px border-radius, DM Mono 14px, 10px 18px padding
  - Primary: `#4A8500` bg, white text
  - Outline: white bg, `#888` text, `#E5E5E0` border
  - Danger: white bg, `#DC1E3C` text, red-tint border
  - Upgrade: gradient `#4A8500` â†’ `#7BC62D`, white text
- **Filter chips**: 6px border-radius, DM Mono 13px, active = green tint + green text
- **Risk badges**: 4px border-radius, DM Mono 12px, colored bg tint + matching text
- **Track badges**: 4px border-radius, DM Mono 12px, Aligners = green, Braces = amber
- **Tables**: White bg card, DM Mono headers, Outfit body, hover `#FAFAF7`
- **Dashed add buttons**: 2px dashed `#E5E5E0`, hover green tint
- **Progress bars**: 5px height, `#EEEEE8` track, colored fill, 2px radius

### 2h. Patient App UI Components

- **Tab bar**: Multicolor 3D vinyl toy icons (Home, Trophy, Gift, Profile). Active tab gets lime-tinted background square. Cream/orange/dark gray palette on icons.
- **Heat dots**: Yellow-to-red gradient (`#FFD600` â†’ `#FFAB00` â†’ `#FF6D00`) with fire emoji
- **Challenge cards**: Streak indicator (fire + bold days) + treat progress ring (1.5px stroke, lime for normal, amber for redemption)
- **Countdown card**: Compact number (80px Rajdhani), treatment progress bar below (lime gradient, start/end dates)
- **Coach header**: Avatar icon + name + roast level + heat dots
- **Buttons**: Ghost style with colored borders and tinted backgrounds. Clutch = lime. Fumble = red.

---

## 3. FIVE COACHES

| Name | Archetype | Color | Access | Roast Style |
|------|-----------|-------|--------|-------------|
| BRI | Toxic bestie, TikTok energy | `#FF6B9D` | Free | Passive-aggressive, dramatic, "bestie" energy |
| JAY | Mean older brother, deadpan | `#64748B` | Free | Zero impressed, monotone, stone face energy |
| KENJI | Anime rival, dramatic | `#EF4444` | Premium | ALL CAPS, intense, secretly cares |
| CLAIRE | Toxic overachiever, snark | `#7C3AED` | Premium | Data-driven roasts, raised eyebrow |
| MASON | Chaotic class clown | `#34D399` | Premium | Hype man, unhinged, "this is fine" energy |

All 5 coach avatars to be generated in 2D illustrated sketch style (Midjourney). Exaggerated proportions (big head, thin legs), sketchy line work, bold saturated colors, sassy and personality-forward. Each has unique character with distinct silhouette. Face and full-body versions. Background-removed PNGs. See `biteback-avatar-regeneration-plan.md` for complete spec.

### Roast Levels (Heat)

| Level | Tone | Example | Access |
|-------|------|---------|--------|
| 1 | Gentle encouragement | Tomorrow's a new day. You got this. | Free |
| 2 | Light teasing | Really? Today of all days? | Free |
| 3 | Real talk | +1 day. Your orthodontist is gonna notice. | Free |
| 4 | Blunt + spicy | Was Netflix worth an extra day in braces? | Premium |
| 5 | Nuclear roast | Your braces work harder than you. And they're metal. | Premium |

Heat level selected during onboarding (Step 6), changeable anytime in settings.

---

## 4. IDENTITY TIERS

| Days | Tier | Unlock |
|------|------|--------|
| 0 | Snagglefang | Starting tier |
| 3 | Wire Warrior | First badge |
| 7 | Elastic Elite | Coach reaction |
| 14 | Retainer Royalty | Sharecard |
| 30 | Smile Soldier | Level 4 preview |
| 60 | Arch Nemesis | Exclusive lines |
| 90 | Titanium | Final form |

**Tier colors:** Gray (Snagglefang) â†’ Bronze (Wire Warrior) â†’ Silver (Retainer Royalty) â†’ Gold (Smile Soldier) â†’ Diamond (Titanium)

### Redemption Quest

3-day recovery challenge after fumble spiral. Free users: 50% day earn-back. Premium users: 65% earn-back + can trigger redemption proactively. Coach personality drives the arc: Day 1 tough love, Day 2 encouragement, Day 3 celebration.

---

## 5. PROJECTED FINISH DATE ENGINE (PFDE)

Rule-based behavioral forecasting. Replaces arbitrary penalties. Upgradeable to ML.

**Dashboard label:** "Treatment Forecast" (staff don't need internal acronyms)
**Dashboard field renames:** RCS â†’ "Compliance Score", VM â†’ "Volatility"

### Two Phases

**Phase 1 â€” Simple Countdown (Days 1â€“14):** Not enough data. Simple countdown. Silently collecting compliance data.

**Phase 2 â€” PFDE Active (Day 15+):** Rolling compliance data powers forecasts. Recalculated daily. Coach translates changes into roasts/hype.

### Core Model

Treatment Velocity = Planned Velocity Ã— Compliance Modifier

- **Rolling Compliance Score (RCS):** weighted 14-day average. Aligner wear: 0.5, Rubber bands: 0.3, Other: 0.2
- **Velocity Modifier (VM):** interpolated from RCS. 95%â†’1.00, 85%â†’1.02, 75%â†’1.05, 60%â†’1.10, <60%â†’1.15+
- **Volatility Multiplier:** penalizes inconsistent clutch/fumble alternation
- **Recovery Adjustment:** redemption completion temporarily improves VM by 1â€“2%
- Remaining Days Ã— VM = Adjusted Remaining Days. Recalculated daily.

### Confidence Bands (Dashboard Only)

Teens never see confidence bands or probability â€” only the projected date through coach voice. Stable compliance = narrow band. Chaotic compliance = wide band.

### Sensitivity Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| Low | Slow forecast movement, wide bands | Young patients, anxious parents |
| Moderate | Balanced (default) | Most patients |
| Strict | Fast movement, narrow bands | Non-compliant teens, tight timelines |

### Office-Side Compliance Verification

- Dashboard shows each patient's daily check-ins with a 'Log Fumble' button per challenge
- When office logs a fumble: overrides patient's self-reported clutch for that day
- PFDE recalculates immediately with corrected data
- Patient receives notification. Coach reacts based on personality.
- Office can also verify clutch days with 'Confirm Compliance' button
- Verified check-ins carry slightly more PFDE weight than self-reported ones

### Doctor Timeline Adjustments

| Action | Color | Description |
|--------|-------|-------------|
| Pull Forward | Green (`#4A8500`) | Reward compliance. Triggers celebration card. |
| Push Back | Orange (`#E07000`) | Clinical reality (broken bracket, missed appts). More impactful than app penalties. |
| Reset Timeline | Red (`#DC1E3C`) | Treatment plan fundamentally changed. Wipes old PFDE baseline. Coach tone neutral/encouraging. |

---

## 6. TEEN-FACING UX

PFDE, office overrides, and timeline adjustments all filtered through the coach. Teens never see clinical data, graphs, or confidence bands.

**Home Screen:**
- Big number: '247 DAYS' in lime green (PFDE projected)
- Small trend arrow: up (slipping) or down (improving)
- Tap to expand: coach one-liner on trajectory
- Treatment progress bar below countdown
- Challenge cards with streak indicators and treat progress rings

---

## 7. ONBOARDING FLOW â€” 10 STEPS

Target: under 90 seconds. Every step has personality. No step feels medical. The app feels like a game loading, not a form.

**Step 1 â€” Splash:** Dark screen. BITEBACK logo animates in (BITE white, BACK lime). Inline layout with letter-spacing reveal. Tagline: 'YOUR SMILE Â· YOUR RULES Â· YOUR ROAST'. Subtitle: 'Brace Yourself' (no period). Scanline overlay, subtle flicker, noise texture. POWERED BY ATTITUDE footer.

**Step 2 â€” Scan or Skip:** 'Got a code?' QR viewfinder with animated scan line and corner brackets. Big 'SCAN QR CODE' button. 'TYPE CODE MANUALLY' secondary. 'skip for now' link. Confetti + practice name on scan.

**Step 3 â€” Pick Your Name:** 'WHAT SHOULD WE CALL YOU?' Live profile card preview showing avatar placeholder, name (displayed in user's original case), tier badge (SNAGGLEFANG), rank indicator. Input with lime border. Max 16 chars, no real names. Profanity filter roasts bad names.

**Step 4 â€” Pick Your Avatar:** 'PICK YOUR LOOK' with hero avatar display. Large selected avatar (80px) centered. 4Ã—3 grid of emoji avatars (placeholder for illustrated presets). Selected state: lime border + glow.

**Step 5 â€” Pick Your Coach:** 'PICK YOUR COACH â€” They'll roast you into compliance.' List of all 5 coaches as cards. Free coaches selectable with info button. Pro coaches dimmed at 50% opacity with lock icon and PRO badge. No audio preview. Lime border signals selection (no checkmark).

**Step 6 â€” Set Your Heat:** 'HOW HARD SHOULD [COACH] GO?' Five numbered heat level buttons (1â€“5). Selected level shows large fire emoji, level name, sample roast preview. Levels 4â€“5 locked with PRO badge.

**Step 7 â€” Your Challenges:** Two paths: QR Scanned (practice name badge, pre-populated challenges, toggle on/off, max 3) or Standalone (pick track first â€” Aligners/Braces â€” then toggle relevant challenges, max 3).

**Step 8 â€” The Countdown Reveal (QR users only):** 'YOUR TREATMENT' fades in. Countdown number slams onto screen with scale + blur animation and radial lime glow. 'DAYS TO GO' fades in below. Coach bubble with opening line.

**Step 9 â€” Set Reminder:** 'WHEN SHOULD [COACH] BUG YOU?' Large time display with 'Tap to change'. Notification preview card showing what the push will look like.

**Step 10 â€” First Check-in:** 'DAY 1' badge. Coach bubble with opening line. Centered challenge question. Large CLUTCH and FUMBLE buttons with colored icons (âœ” lime, âœ˜ red). '+1 more after this' indicator. One challenge at a time.

---

## 8. PRACTICE DASHBOARD (B2B) â€” COMPLETE

Desktop/tablet web app at biteback.app/practice. Next.js. Light mode only. Two-tier pricing: Starter $99/mo, Pro $199/mo (see Section 13).

### Sidebar Navigation

OVERVIEW, MANAGE (Patients, Challenges, Treats, QR Codes), SETTINGS (Branding, Staff, Billing)

### 9 Dashboard Pages â€” All Designed & Built

| File | Page | Description |
|------|------|-------------|
| `biteback-dashboard.html` | **Overview** | Stat cards, forecast distribution histogram, risk flags, patient summary table |
| `biteback-dashboard-patients.html` | **Patients List** | Full roster table with 11 columns, search, filter chips, track badges, sort arrows, bulk actions |
| `biteback-dashboard-patient.html` | **Individual Patient** | Treatment forecast + timeline actions side-by-side, 30-day trend, check-in heatmap, challenges with confirm/fumble/disable + add, treats eligibility, redemption history, activity log |
| `biteback-dashboard-challenges.html` | **Challenges** | Aligners + Braces track cards with per-track "Add Challenge" buttons, fumble penalty config table, patient assignment summary, recent changes log |
| `biteback-dashboard-treats.html` | **Treats** | Stat cards, active treat cards in grid + ghost "new treat" card, eligible patients table (label/nickname/code), default templates, fulfillment log, create treat modal |
| `biteback-dashboard-qrcodes.html` | **QR Codes** | Generate form (label, track, challenges, duration, sensitivity), live QR preview with encoded data breakdown, print-ready card preview, all codes table |
| `biteback-dashboard-branding.html` | **Branding** | Logo upload, practice name + CTA editor, share card previews (dark/light/leaderboard), "Why Branding Matters" value props |
| `biteback-dashboard-staff.html` | **Staff** | Staff member cards (Owner/Admin/Viewer/Pending), invite ghost card, roles & permissions table, 7-day activity log with action type badges |
| `biteback-dashboard-billing.html` | **Billing** | Two-tier plan comparison (Starter $99/Pro $199), upgrade CTA banner, usage bar with patient limit, payment details, ROI snapshot, invoice history |

### HIPAA Avoidance â€” Staff Labels (CRITICAL)

**Problem:** Showing real patient names in the dashboard would make BiteBack store PHI, triggering HIPAA requirements.

**Solution:** Staff-assigned freeform labels replace real names everywhere.
- When generating a QR code, staff enters a label: "Tues 3pm aligner", "Dr P chair 4", "Sibling pair #1"
- Dashboard shows: **LABEL â†’ NICKNAME â†’ CODE** (never real names)
- BiteBack ToS explicitly prohibits entering PHI in labels
- If staff enters a real name anyway, that's a practice policy violation, not a system design flaw
- Result: Zero PHI in BiteBack database. HIPAA does not apply.

Applied to all 9 dashboard pages.

### Staff Roles

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **Owner** | Everything | Cannot be removed |
| **Admin** | Patients, challenges, treats, QR codes, timeline, branding | Staff management, billing |
| **Viewer** | View patients, fulfill treats | Everything else |

Auth via email magic link. No passwords stored. All actions logged with staff name + timestamp.

### Dashboard Audit â€” 6 Minor Gaps (Polish Items)

1. **Risk flags: "reviewed" / "contacted" states** â€” Flag cards only show "REVIEW" button. Need toggled states.
2. **Timeline actions: date picker + reason** â€” Push back/pull forward/reset should have date picker and reason field. Current buttons have no expanded form.
3. **High volatility flag** â€” 4 auto-flag triggers in PRD; we show 3 of 4. Missing a volatility example.
4. **Leaderboard view** â€” PRD mentions practice leaderboard view. Preview on Branding page but no dedicated section.
5. **Redemption tracking overview** â€” Individual patient has redemption history. No practice-wide redemption summary.
6. **Aggregate stats over time** â€” Overview has current stat cards but no month-over-month trends.

---

## 9. FOUNDER DASHBOARD â€” COMPLETE

Internal command center â€” god-view of entire BiteBack platform across all practices, patients, and revenue. Separate from practice-facing dashboard.

### 5 Founder Dashboard Pages â€” All Designed & Built

| File | Tab | Description |
|------|-----|-------------|
| `biteback-founder-dashboard.html` | **Overview** | 6 hero KPIs, MRR chart, conversion funnel, revenue breakdown, practices table, engagement stats, coach popularity, virality, founder alerts, GTM milestones, platform health |
| `biteback-founder-practices.html` | **Practices** | 5 KPIs, distribution charts (by plan, health, patient count), retention cohort heatmap, churn risk cards with outreach actions, upgrade opportunity cards, full practices table |
| `biteback-founder-patients.html` | **Patients** | 6 KPIs, streak distribution histogram, tier distribution bars, compliance decay curve, track split donut, fumble heatmap by hour/day, platform leaderboard |
| `biteback-founder-engagement.html` | **Engagement** | 6 KPIs, 30-day DAU bar chart, share card breakdown, push notification performance grid, feature adoption bars, treats stats, redemption quest funnel, K-factor card |
| `biteback-founder-revenue.html` | **Revenue** | 5 KPIs, 6-month MRR growth chart, revenue waterfall, plan mix over time, monthly revenue history, unit economics (LTV/CAC/ARPU/churn), expenses, profitability, 12-month projections |

### Key Founder Metrics (Sample Data)

**Business:** MRR $2,891 (+26% MoM), ARR run rate $34,692, 37 practices (21 Pro, 16 Starter, 8 in trial), 2.7% monthly churn, 68% trialâ†’paid conversion, $158 blended ARPU, $5,846 practice LTV, $2,391 net monthly profit (83% margin)

**Revenue Split:** Starter 16 Ã— $49 = $784 (22%), Pro 21 Ã— $99 = $2,079 (59%), Patient Premium 284 Ã— $2.99 = $849 (19%)

**Platform:** 2,847 total patients, 87% platform compliance, 71% DAU/MAU, 18.4 avg streak, 12% fumble rate, 65% share-through rate, 0.31 K-factor, 62% notification open rate, 10% premium patient conversion

### Data Insights Surfaced

1. Compliance decays from 94% (month 1) to 72% (month 18), biggest drop at months 4â€“6. Treat milestones at 30d and 60d flatten the curve.
2. Titanium tier patients average 94% compliance vs 71% for Snagglefang.
3. Peak fumbles Fridayâ€“Saturday 8â€“11PM. Lowest: weekday mornings.
4. 26% fewer DAU on weekends.
5. Fumble Roast share cards (28% of shares) drive the most virality despite being "negative."
6. Doctor Adjustment notifications (94% open rate) and Treat Unlocked (91%) highest-performing. Leaderboard (55%) weakest.
7. Accountability Partner at 19% adoption is the weakest feature. Selfie Capture at 28%.
8. Redemption quest 64% completion rate; biggest drop is at quest initiation.
9. 57% of paid practices are on Pro. Revenue shifting toward Pro over time.
10. $0 CAC with +8 practices/month organic growth.

### Projection Targets

| Milestone | Practices | MRR | ARR |
|-----------|-----------|-----|-----|
| Current (Feb '26) | 37 | $5,846 | $70.2K |
| Feb '27 (12 months) | 120 | $18,960 | $228K |
| 500 practices | 500 | $79,000 | $948K |
| 1,000 practices | 1,000 | $158,000 | $1.9M |

---

## 10. COMPLETE DESIGN FILE CATALOG

All files are self-contained HTML mockups. Open in any browser. Coach avatar images embedded as base64.

### 10a. Onboarding (10 Screens) â€” Dark Mode

| File | Screen |
|------|--------|
| `biteback-onboarding-01-splash.html` | Welcome / splash with logo reveal |
| `biteback-onboarding-02-scan.html` | QR code scan + manual code entry |
| `biteback-onboarding-03-name.html` | Nickname entry with profanity filter |
| `biteback-onboarding-04-avatar.html` | Preset avatar grid picker |
| `biteback-onboarding-05-coach.html` | Coach selection (5 options with previews) |
| `biteback-onboarding-06-heat.html` | Roast level slider (1â€“5) |
| `biteback-onboarding-07-challenges.html` | Challenge confirmation (practice-assigned) |
| `biteback-onboarding-08-countdown.html` | Treatment countdown dramatic reveal |
| `biteback-onboarding-09-reminder.html` | Daily reminder time picker |
| `biteback-onboarding-10-checkin.html` | First check-in prompt |

Navigation: â† BACK button on screens 02â€“10. Step dots on all. CTA button on each.

### 10b. Home Screen

| File | Contents |
|------|----------|
| `biteback-home-daily.html` | Home screen with Bri avatar, countdown, challenge cards â€” dark mode |
| `biteback-home-dark-vs-light.html` | Side-by-side dark vs light comparison |

### 10c. Check-In Results (4 States)

| File | Contents |
|------|----------|
| `biteback-checkin-results.html` | Dark mode: clutch, clutch milestone, fumble, fumble + redemption quest |
| `biteback-all-light-mode.html` | Light mode: clutch, fumble, leaderboard, treats, profile |

### 10d. Main Tabs

| File | Contents |
|------|----------|
| `biteback-leaderboard.html` | Rank tab â€” practice + global leaderboard, podium top 3 |
| `biteback-treats.html` | Treats tab â€” locked / unlocked / claimed states with progress bars |
| `biteback-profile.html` | Profile + 6 stat cards + tier progression + settings screen |

### 10e. Coach Bio Pages

| File | Contents |
|------|----------|
| `biteback-coach-bios.html` | 5 coach bio pages with body art, sample roasts, personality â€” dark |
| `biteback-coach-bios-light.html` | 5 coach bio pages â€” light mode |
| `biteback-coach-preview.html` | All 5 face avatars on white background (QA check) |

### 10f. Share Cards (6 Types)

| File | Contents |
|------|----------|
| `biteback-share-cards.html` | 6 types at 9:16: streak, fumble, tier-up, countdown, rank, doctor â€” dark |
| `biteback-share-cards-light.html` | 6 card types â€” light mode |

Card types: Streak Milestone, Fumble Roast, Tier-Up, Countdown, Leaderboard Rank, Doctor Update. All include BiteBack logo + practice branding footer.

### 10g. Photo Mode Share Cards (3 Modes)

| File | Contents |
|------|----------|
| `biteback-share-photo-modes.html` | Clutch HUD overlay, Fumble cinema bars, Noir poster â€” dark |
| `biteback-share-photo-light.html` | 3 photo modes â€” light mode |

### 10h. Navigation Map

| File | Contents |
|------|----------|
| `biteback-nav-map.html` | Master nav overview showing all screens with navigation patterns |

### 10i. Practice Dashboard (9 Pages) â€” Light Mode

| File | Contents |
|------|----------|
| `biteback-dashboard.html` | Overview: stat cards, forecast distribution, risk flags, patient table |
| `biteback-dashboard-patients.html` | Full patient roster with 11 columns, search, filters |
| `biteback-dashboard-patient.html` | Individual patient: forecast, challenges, check-ins, timeline, treats, log |
| `biteback-dashboard-challenges.html` | Two tracks, penalty config, assignment summary, change log |
| `biteback-dashboard-treats.html` | Treats grid, eligible patients, templates, fulfillment log |
| `biteback-dashboard-qrcodes.html` | Generate form, live preview, print-ready card, all codes table |
| `biteback-dashboard-branding.html` | Logo upload, share card previews, value props |
| `biteback-dashboard-staff.html` | Staff cards, roles/permissions, activity log |
| `biteback-dashboard-billing.html` | Two-tier plan comparison, usage, ROI, invoices |

### 10j. Founder Dashboard (5 Pages) â€” Dark Top Bar + Light Body

| File | Contents |
|------|----------|
| `biteback-founder-dashboard.html` | Overview: KPIs, MRR, funnel, revenue, practices, alerts |
| `biteback-founder-practices.html` | Practice distribution, retention, churn risk, upgrade opportunities |
| `biteback-founder-patients.html` | Streak/tier distribution, compliance decay, fumble heatmap, leaderboard |
| `biteback-founder-engagement.html` | DAU, share cards, notifications, feature adoption, K-factor |
| `biteback-founder-revenue.html` | MRR growth, waterfall, unit economics, expenses, projections |

### 10k. Other Assets

| File | Contents |
|------|----------|
| `biteback-final-roster.html` | All 5 coach characters, full body + face |
| `biteback-3d-tabs-v2.html` | Multicolor vinyl toy tab icons (dark + light mode) |
| `biteback-poster.html` | Marketing poster with slogan |
| `biteback-bri-bio.html` | Coach bio page template |

### Screen Count Summary

| Category | Screens | Files |
|----------|---------|-------|
| Onboarding | 10 | 10 (dark only) |
| Home | 2 | 2 (dark + light) |
| Check-in Results | 4 states | 2 files |
| Tabs (Leaderboard, Treats, Profile) | 3 | Dark + light in combined files |
| Coach Bio Pages | 5 | 3 files (dark + light + preview) |
| Share Cards | 6 types | 2 files (dark + light) |
| Photo Mode Cards | 3 modes | 2 files (dark + light) |
| Navigation Map | 1 | 1 (dark only) |
| Practice Dashboard | 9 | 9 (light only) |
| Founder Dashboard | 5 | 5 (dark bar + light body) |
| Other (roster, tabs, poster, bio template) | 4 | 4 |
| **TOTAL** | **~52 unique screens** | **~40 HTML files** |

---

## 11. NAVIGATION PATTERNS

**Onboarding:** â† BACK (screens 2â€“10) + step dots + CTA button. Linear flow.
**Main App:** Bottom tab bar (Home, Rank, Treats, Profile). 4 tabs.
**Check-in Results:** Modal overlay. DONE/GOT IT dismiss button + optional SHARE.
**Coach Bios:** â† BACK + SELECT [coach] button. Accessed from Profile or Onboarding.
**Settings:** â† BACK to Profile.
**Share Cards:** No in-app nav. 9:16 export format for native share sheet.
**Practice Dashboard:** Persistent sidebar. â† BACK TO PATIENTS on detail views.
**Founder Dashboard:** Horizontal top bar tabs. 5 tabs.

---

## 12. DATA ASSET STRATEGY

BiteBack captures a unique longitudinal behavioral compliance dataset:

**Per patient:** Check-in patterns, streak lengths, fumble frequency/recovery, coach preferences, share card activity, treat motivation effectiveness, sensitivity correlation to outcomes

**Per practice:** Avg compliance, penalty config effectiveness, treat structures, staff engagement, patient volume trends

**Aggregate:** Compliance curves by treatment type, decay patterns over treatment duration, regional variations, coach persona engagement by demographic, optimal penalty ranges

**Three value paths:**
1. **Product intelligence** â€” Improve PFDE accuracy, tune defaults, recommend configs
2. **Industry benchmarking** â€” "National Teen Compliance Index" (v2 roadmap), content marketing engine
3. **Research partnerships** â€” Publishable data for orthodontic journals, AAO, dental schools

---

## 13. MONETIZATION â€” TWO-TIER PRICING

### Free (Patient)

2 coaches (Bri + Jay), heat levels 1â€“3, all challenges, PFDE, redemption (50% earn-back), tiers, leaderboard, treats, notifications, all share cards including photo modes, basic stats, weekly recap, accountability partners

### Premium â€” $4.99/mo or $34.99/yr

All 5 coaches, heat levels 4â€“5, - All 5 coaches (adds Kenji, Claire, Mason)
- Heat levels 4–5
- Profile customization (frames, animated avatars, coach-themed styles)
- Advanced stats and compliance history (calendar heatmap, per-challenge breakdown, personal bests)
- “Ask your coach” anytime tap (contextual coach line on demand)
- Enhanced redemption (65% earn-back instead of 50%, proactive trigger option)
- Seasonal exclusive content (holiday roasts, limited-time share card designs)
- Custom notification timing per challenge
- Custom challenges

### Practice Dashboard â€” Two Tiers

**Starter ($99/mo):**
- Up to 25 active patients
- All core features (patients, challenges, compliance tracking, QR codes)
- 1 staff seat
- Basic treats (default templates only)
- Basic risk flags (inactive patients)
- BiteBack branding on share cards (no practice logo)

**Pro ($199/mo):**
- Unlimited patients
- Everything in Starter
- Treatment forecasting + risk flags + confidence bands
- Timeline adjustments (push back / pull forward / reset)
- Practice branding on share cards (practice logo + name)
- Custom treats (create your own milestones + rewards)
- Unlimited staff seats with Owner/Admin/Viewer roles
- Exportable reports
- Fumble sensitivity controls per patient
- Priority support

**14-day free trial on all plans. No free tier for practices.**

**Upgrade triggers:** Hit 25-patient limit, or need forecasting/branding/timeline features.

### Revenue Math

50 practices × $158 blended ARPU = $94,800/yr. 10% patient premium at $4.99 adds ~$59,880/yr. Combined: ~$155K ARR. At 500 practices: ~$948K+. At 1,000 practices: ~$1.9M+.

---

## 14. HIPAA & PRIVACY

- Anonymous codes. No name, DOB, diagnosis stored in BiteBack.
- Practice maps codes to patients in their PMS. BiteBack never knows identity.
- Staff-assigned labels (not real names) used throughout dashboard. ToS prohibits PHI in labels.
- PFDE data is behavioral, not medical. Selfies local-only.
- Office-logged fumbles reference patient codes, never real names.
- Disclaimer: 'Based on self-reported adherence. Timing determined by orthodontist.'

---

## 15. TECHNICAL ARCHITECTURE

- **Mobile:** React Native (Expo) â€” expo-camera, expo-haptics, expo-notifications, expo-av, reanimated
- **Backend:** Supabase (Postgres + Auth + Realtime + Edge Functions)
- **PFDE:** Daily Edge Function per patient. Office overrides trigger immediate recalc.
- **Tables:** patients, practices, check_ins, overrides, forecasts, challenges, treats, partners
- **Practice Dashboard:** Next.js at biteback.app/practice. Stripe for billing.
- **Founder Dashboard:** Internal, same stack.

---

## 16. GO-TO-MARKET

1. **Phase 1:** Your practice, 20â€“30 patients. Test PFDE + office overrides against clinical reality.
2. **Phase 2:** 10 pilot practices. Free dashboard. Calibrate sensitivity defaults.
3. **Phase 3:** AAO, ortho Facebook groups. Lead with behavioral forecasting + office control.
4. **Phase 4:** Expand beyond ortho.

---

## 17. WHAT REMAINS

### Patient App â€” Design
- Weekly recap card â€” Sunday summary, shareable
- Push notification examples â€” coach-voiced, all 11 types
- Accountability partner screens

### Dashboard Polish (6 audit items from Section 8)

### Development
- React Native (Expo) build from scaffold
- Supabase backend setup (Postgres + Auth + Realtime + Edge Functions)
- PFDE engine implementation (rule-based, upgradeable to ML)
- Coach dialogue database (all 5 coaches, 5 roast levels, all contexts)
- Push notification system (11 types, max 2/day, coach voice)
- Next.js practice dashboard build
- Stripe integration for billing ($99/$199 practice tiers + $4.99/$34.99 patient premium)
- Premium feature implementation: profile customization, advanced stats, “Ask your coach” tap, enhanced redemption, seasonal content system, per-challenge notification timing
- App Store submission prep

### v2 Roadmap
- Aura System (parallel prestige track)
- Co-op Shields for accountability partners
- Practice ROI Engine
- Regional / school leagues
- Enterprise DSO multi-location dashboard
- ML-powered predictions

---

## 18. TEN-PHASE BUILD PLAN

1. Single Challenge Flow â€” One challenge, full clutch/fumble, coach dialogue, check-in
2. Multi-Challenge â€” Challenge picker, multiple active challenges
3. Treatment Timer + PFDE â€” Countdown, projected finish date engine
4. Treats System â€” Practice-created treats, progress rings, unlock flow
5. Share Cards â€” Photo + no-photo modes, coach-branded
6. Onboarding â€” Practice code entry, coach selection, challenge setup
7. Settings & Profile â€” Preferences, coach switching, notification controls
8. Push Notifications â€” Coach-voice notifications, priority queue
9. Practice Dashboard â€” B2B portal for orthodontists
10. Polish & Launch â€” Performance, accessibility, App Store prep

---

## 19. MVP SCOPE

### v1 â€” Ships:
- 10-step onboarding with QR scan
- 5 coaches (2 free, 3 premium) with PFDE-aware + office-aware lines
- PFDE: simple days 1â€“14, forecast day 15+. Confidence bands on dashboard.
- Office-side fumble logging + compliance verification
- Practice challenge management: add/remove mid-treatment
- Doctor timeline adjustments: pull forward / push back / reset
- Practice branding on share cards
- Tiers: Snagglefang â†’ Titanium
- Redemption Quest (3-day, 50% earn-back)
- Leaderboards, accountability partners, treats
- Push notifications in coach voice, max 2/day
- Haptics + sounds + animations
- Settings, delete data, feedback

---

## 20. PROJECT HISTORY

This project evolved from a general habit tracking app called "LockedIn" through several name changes (Deadbolt â†’ Forged â†’ Fumble â†’ Fumbler) before pivoting to orthodontic vertical as "BiteBack" in Session 29. The full LockedIn PRD is at LockedIn_PRD_v1.docx. Previous prototype code exists but the BiteBack scaffold is a fresh build.

**Session 34:** Home screen design locked (dark + light), fumble color, heat dots, challenge cards, light mode palette, coach avatar style direction, Bri avatar generated.

**Session 35:** 10-screen onboarding, home with Bri rendered, 4 check-in result states, leaderboard, treats, profile + settings, all 5 coach avatars (faces + bodies), background removal, 5 coach bio pages, 6 share card types, 3 photo modes, navigation map, practice dashboard (3 initial screens), all dark + light mode variants.

**Sessions 35+:** Practice dashboard expanded to 9 complete pages (all sidebar nav items). Founder dashboard built â€” 5 tabbed pages. Two-tier pricing model finalized. Updated Feb 20, 2026: Starter $99 / Pro $199. Patient premium updated to $4.99/mo or $34.99/yr with expanded feature set (profile customization, advanced stats, ask your coach, enhanced redemption, seasonal content, custom notification timing). Staff label system for HIPAA avoidance designed and applied across all dashboard pages.

---

## 21. KEY REFERENCE DOCUMENTS

- **BiteBack_PRD_Updated.docx** â€” THE canonical PRD. PFDE integration, all features, coach specs, monetization, technical architecture.
- **bri-avatar-prompt.md** â€” ChatGPT prompt template used for generating coach avatars
- **biteback-v1-scaffold.tar.gz** â€” 16 files, 3,161 lines, React Native/Expo scaffold (types, design system, PFDE engine, state management, partial dialogue DB)

---

## 22. HOW TO RESUME THIS PROJECT

1. Start a new Claude chat or project
2. Upload this document + all HTML design files + the PRD
3. Say: "Read the handoff doc. I want to continue building BiteBack." followed by your next request
4. Claude will have full context to continue where you left off

**For specific areas:**
- Dashboard polish: "Continue BiteBack â€” address the 6 dashboard audit items."
- Patient app screens: "Continue BiteBack â€” build the weekly recap / push notifications / accountability partner screens."
- Development: "Continue BiteBack â€” start building Phase 1 of the ten-phase build plan."
