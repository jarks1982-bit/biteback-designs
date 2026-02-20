# BITEBACK

*The orthodontic compliance app that roasts teens into better habits.*

**Product Requirements Document — Updated February 2026 (v2)**

---

## 1. Vision

BiteBack is a mobile app that turns orthodontic compliance into a game teenagers actually want to play. AI coaches roast patients when they skip their rubber bands, miss brushing, or forget their aligners — and hype them when they stay on track.

The core technology: a Projected Finish Date Engine (PFDE) that uses rolling compliance data to forecast treatment end dates. The forecast is the brain. The coach is the mouth. Teens see roasts. Orthodontists see projections, manage challenges, verify compliance, and adjust timelines. Both see results.

Distributed through orthodontic practices via QR code. Practices pay $99–$199/month for the dashboard — full control over patient challenges, compliance verification, treatment timeline adjustments, and branded rewards. Free for patients at baseline. Premium unlocks for teens who want more heat.

---

## 2. The Problem

- Patient compliance averages 50–60%. Non-compliance extends treatment 3–6 months.
- The #1 question: *'When do I get my braces off?'* — no tool connects compliance to that answer
- Self-reported compliance is unreliable — patients lie about wearing rubber bands
- Treatment plans change mid-course (rubber bands added, appliances changed) with no digital reflection
- Practices have no way to reward good compliance beyond verbal praise
- Existing tools don't resonate with Gen Z / Gen Alpha

---

## 3. The Solution

- Daily check-ins with AI coach reactions
- Projected Finish Date Engine — behavioral forecasting, not arbitrary penalties
- Practice-side compliance verification — offices can override self-reported check-ins
- Practice-managed challenges — add/remove challenges as treatment evolves
- Doctor timeline adjustments — pull forward to reward, push back for clinical reality, reset for plan changes
- Practice-created treats with real-world rewards
- Practice branding on share cards — every teen post is a mini-ad for the office
- Selfie check-ins, leaderboards, accountability partners, push notifications in coach voice

---

## 4. User Types

### 4a. Patient (Teen, 12–18)

- Downloads app, scans QR from practice, picks nickname/avatar/coach
- Daily check-ins with optional selfie. Coach reacts.
- Sees projected finish date — powered by PFDE, delivered by coach
- If office overrides a check-in: patient sees it, coach reacts
- If office adjusts timeline: patient gets celebration or warning
- Competes on leaderboard, unlocks treats, pairs with accountability partner

### 4b. Practice ($99–$199/month)

- Signs up at biteback.app/practice
- Generates QR codes — sets track, duration, start date, sensitivity, clinical buffer
- Manages individual patient challenges: add/remove mid-treatment
- Logs fumbles from office side: override self-reported check-ins
- Adjusts treatment timeline: pull forward / push back / reset
- Creates treats: rewards patients earn at milestones
- Uploads practice logo for share card branding
- Views forecast dashboard: PFDE distribution, risk flags, compliance intelligence

---

## 5. Projected Finish Date Engine (PFDE)

Rule-based behavioral forecasting. Replaces arbitrary penalties. Upgradeable to ML.

### 5a. Two Phases

**Phase 1 — Simple Countdown (Days 1–14):**
Not enough data. Simple countdown. Silently collecting compliance data.

**Phase 2 — PFDE Active (Day 15+):**
Rolling compliance data powers forecasts. Recalculated daily. Coach translates changes into roasts/hype.

### 5b. Core Model

Treatment Velocity = Planned Velocity × Compliance Modifier

- Rolling Compliance Score (RCS): weighted 14-day average. Aligner wear: 0.5, Rubber bands: 0.3, Other: 0.2
- Velocity Modifier (VM): interpolated from RCS. 95%→1.00, 85%→1.02, 75%→1.05, 60%→1.10, <60%→1.15+
- Volatility Multiplier: penalizes inconsistent clutch/fumble alternation
- Recovery Adjustment: redemption completion temporarily improves VM by 1–2%
- Remaining Days × VM = Adjusted Remaining Days. Recalculated daily.

### 5c. Confidence Bands (Dashboard Only)

- Teens never see confidence bands or probability — only the projected date through coach voice
- Stable compliance = narrow band. Chaotic compliance = wide band.

### 5d. Sensitivity Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| Low | Slow forecast movement, wide bands | Young patients, anxious parents |
| Moderate | Balanced (default) | Most patients |
| Strict | Fast movement, narrow bands | Non-compliant teens, tight timelines |

### 5e. Office-Side Compliance Verification

- Dashboard shows each patient's daily check-ins with a 'Log Fumble' button per challenge
- When office logs a fumble: overrides patient's self-reported clutch for that day
- PFDE recalculates immediately with corrected data
- Patient receives notification. Coach reacts based on personality.
- Office can also verify clutch days with 'Confirm Compliance' button
- Verified check-ins carry slightly more PFDE weight than self-reported ones

### 5f. Doctor Timeline Adjustments

**1. Pull Forward — Reward Compliance**
Patient at 95% compliance, teeth tracking ahead. Doctor pulls projected date forward. Triggers Doctor Update Card (celebration).

**2. Push Back — Clinical Reality**
Broken bracket, missed appointments. Doctor pushes date back. More impactful than app penalties — comes from authority figure.

**3. Reset Baseline — Treatment Plan Change**
Treatment plan fundamentally changed. Doctor sets new projected finish date. Wipes old PFDE baseline. Coach tone is neutral/encouraging.

---

## 6. Coach System

### 6a. Five Coaches

| Name | Vibe | Tier | Sample Roast |
|------|------|------|--------------|
| BRI | Toxic bestie, Gen Z chaos | Free | "bestie you forgot your bands AGAIN?" 💅 |
| JAY | Deadpan, dry humor | Free | "wow. you fumbled. shocking." 🗿 |
| KENJI | Anime drill sergeant | Premium | "SOLDIER!! RUBBER BANDS!! NOW!!" 🔥 |
| CLAIRE | Intellectual snark | Premium | "your compliance is 43%. tragic." 📊 |
| MASON | Chaotic wholesome bro | Premium | "BRO 3 DAYS STRAIGHT LETS GOO" 🎉 |

### 6b. Coach Colors

- Bri: #FF6B9D → #FF2E6C (pink gradient)
- Jay: #64748B → #334155 (slate gradient)
- Kenji: #EF4444 → #991B1B (red gradient)
- Claire: #C4B5FD → #7C3AED (purple gradient)
- Mason: #34D399 → #059669 (green gradient)

### 6c. Avatar Style

Locked: 2D illustrated sketch style (Midjourney). Exaggerated proportions (big head, thin legs), sketchy line work, bold saturated colors. Sassy and personality-forward. Each coach has a unique character with distinct silhouette. See `biteback-avatar-regeneration-plan.md` for complete generation spec, expression system, and tracking checklist.

### 6d. Roast Levels (Heat)

| Level | Tone | Example | Access |
|-------|------|---------|--------|
| 1 | Gentle encouragement | Tomorrow's a new day. You got this. | Free |
| 2 | Light teasing | Really? Today of all days? | Free |
| 3 | Real talk | +1 day. Your orthodontist is gonna notice. | Free |
| 4 | Blunt + spicy | Was Netflix worth an extra day in braces? | Premium |
| 5 | Nuclear roast | Your braces work harder than you. And they're metal. | Premium |

Heat level is selected during onboarding (Step 6) and can be changed anytime in settings.

### 6e. Coach Content Architecture

Coach lines, contexts, and assets are fully data-driven. See biteback-coach-architecture.md for the complete schema, 66-context taxonomy, line selection engine, and AI upgrade path.

---

## 7. Teen-Facing UX

PFDE, office overrides, and timeline adjustments are all filtered through the coach. Teens never see clinical data, graphs, or confidence bands.

**Home Screen:**

- Big number: '247 DAYS' in lime green (PFDE projected)
- Small trend arrow: up (slipping) or down (improving)
- Tap to expand: coach one-liner on trajectory
- Treatment progress bar below countdown
- Challenge cards with streak indicators and treat progress rings

---

## 8. Practice Dashboard ($99–$199/month)

- Patient list: label, nickname, code, streak, RCS, projected finish, risk status (color-coded)
- Individual patient view: check-in history, Log Fumble, Confirm Compliance, challenge management
- PFDE detail: projected finish, RCS, VM, confidence band, 30-day trend
- Timeline actions: Pull Forward / Push Back / Reset Baseline
- Forecast distribution: histogram of ahead/on-track/delayed/high-risk
- Risk flags: auto-flag RCS <70% for 14+ days, high volatility, inactive 7+ days
- Treats management: create, track eligibility, mark fulfilled
- Practice branding: logo upload, name on share cards
- QR code generation: individual or bulk, encodes anonymous code + track + challenges
- Multi-staff access via email magic link

*Staff-assigned labels* (not real names) used throughout dashboard. BiteBack ToS prohibits PHI in labels. See HIPAA section.

---

## 9. Identity System

### 9a. Tiers

| Tier | Streak | Color | Vibe |
|------|--------|-------|------|
| Snagglefang | 0 | Gray | Starting tier |
| Wire Warrior | 3+ | Bronze | First badge |
| Elastic Elite | 7+ | Bronze | Coach reaction |
| Retainer Royalty | 14+ | Silver | Sharecard unlock |
| Smile Soldier | 30+ | Gold | Level 4 preview |
| Arch Nemesis | 60+ | Gold | Exclusive lines |
| Titanium | 90+ | Diamond | Final form / Legend |

### 9b. Redemption Quest

3-day recovery challenge after fumble spiral. Free users earn back 50% of lost days. Premium users earn back 65% and can trigger redemption proactively (not just after fumble spiral). Coach personality drives the arc: Day 1 tough love, Day 2 encouragement, Day 3 celebration.

---

## 10. Onboarding Flow — 10 Steps

Target: under 90 seconds. Every step has personality. No step feels medical. The app feels like a game loading, not a form.

**Step 1 — Splash**
Dark screen. BITEBACK logo animates in (BITE white, BACK lime). Inline layout with letter-spacing reveal animation. Tagline: 'YOUR SMILE · YOUR RULES · YOUR ROAST' in white. Subtitle: 'Brace Yourself' (no period). Scanline overlay, subtle flicker, noise texture. POWERED BY ATTITUDE footer.

**Step 2 — Scan or Skip**
'Got a code?' QR viewfinder with animated scan line and corner brackets. Big 'SCAN QR CODE' button. 'TYPE CODE MANUALLY' secondary. 'skip for now' link at bottom. If scanned: confetti + practice name appears.

**Step 3 — Pick Your Name**
'WHAT SHOULD WE CALL YOU?' Live profile card preview showing avatar placeholder, name (displayed in user's original case), tier badge (SNAGGLEFANG), and rank indicator. Input with lime border. Hint: 'Max 16 characters · No real names'. Text below card: 'You'll choose an avatar next'. Profanity filter roasts bad names via coach.

**Step 4 — Pick Your Avatar**
'PICK YOUR LOOK' with hero avatar display. Large selected avatar (80px) centered with name below. 4×3 grid of emoji avatars (placeholder for illustrated presets). Selected state: lime border + glow. Tap to select, avatar updates in hero display.

**Step 5 — Pick Your Coach**
'PICK YOUR COACH — They'll roast you into compliance.' List of all 5 coaches as cards with avatar, name (in coach color), tag, and sample roast. Free coaches (Bri, Jay) selectable with info button for bio page. Pro coaches (Kenji, Claire, Mason) dimmed at 50% opacity with lock icon and PRO badge. 'Upgrade anytime in settings' note. No audio preview — written roast sample is sufficient for v1. No checkmark on selected card — lime border alone signals selection.

**Step 6 — Set Your Heat**
'HOW HARD SHOULD [COACH] GO?' Five numbered heat level buttons (1–5). Selected level shows large fire emoji, level name, and sample roast preview bubble. Levels 4–5 locked with PRO badge. 'Lvl 4–5 unlock with Pro · Change anytime' note.

**Step 7 — Your Challenges**
Two paths based on QR scan status:

**QR Scanned:** Practice name badge at top (just the office name, no checkmark). Challenges pre-populated. Toggle on/off. Max 3 active.

**Standalone:** Pick track first (Aligners / Braces — no subtitle descriptions under buttons). Then see relevant challenges to toggle. Max 3 active.

**Step 8 — The Countdown Reveal (QR users only)**
'YOUR TREATMENT' fades in first. Then countdown number (e.g. 247) slams onto screen with scale + blur animation and radial lime glow. 'DAYS TO GO' fades in below. Coach bubble fades in with opening line. Standalone users skip this step.

**Step 9 — Set Reminder**
'WHEN SHOULD [COACH] BUG YOU?' Large time display (9:00 PM / EVERY DAY) with 'Tap to change'. Notification preview card showing what the push will look like: app name, time, and coach-voice message. 'You can change this anytime' note. Premium users can set different reminder times per challenge.

**Step 10 — First Check-in**
'DAY 1' badge. Coach bubble with opening line. Centered challenge question: 'DID YOU WEAR YOUR ALIGNERS?' (20+ hours today). Large CLUTCH and FUMBLE buttons with colored icons (✔ lime green, ✘ red). '+1 more after this' indicator. One challenge at a time.

---

## 11. Design System — Locked

### 11a. Colors (Dark Mode — Primary)

| Element | Color | Usage |
|---------|-------|-------|
| Background | #0A0A0A | App background |
| Cards | #111 + #1A1A1A border | Challenge cards, containers |
| Primary / Clutch | #BFFF00 | Toxic Lime — CTAs, streaks, active states |
| Fumble | #FF1744 | Electric Crimson — missed days, fumble stamps |
| Redemption | #FFB800 | Amber — recovery challenges |
| Tier Gold | #FFD700 | Achievement badges, milestones |

### 11b. Text Contrast Rules (on #0A0A0A)

| Level | Color | Usage |
|-------|-------|-------|
| Primary text | #FFFFFF | Headings, names, main content |
| Secondary text | #AAAAAA | Subtitles, descriptions, coach dialogue |
| Tertiary / Hint | #777777 | Hints, metadata, tier labels |
| Disabled minimum | #555555 | Absolute minimum for any readable text |

**NEVER use below #555 for any readable text on #0A0A0A.**

### 11c. Light Mode Colors

| Element | Color | Usage |
|---------|-------|-------|
| Background | #F5F5F0 | Warm off-white (not pure white) |
| Cards | #FFFFFF + #E5E5E0 border | Subtle shadow |
| Primary / Clutch | #4A8500 | Deep green (lime unreadable on white) |
| Fumble | #DC1E3C | Deeper crimson |
| Text | #1A1A1A / #333 / #888 | Primary / body / secondary |

### 11d. Typography

| Usage | Font | Details |
|-------|------|---------|
| Logo | Rajdhani 700 | BITE in white, BACK in lime. 3px letter-spacing. |
| Display / Headers | Rajdhani 700 | Section titles, card headers, countdown numbers |
| Body | Outfit 500 | Coach dialogue, descriptions, body copy |
| Data / Mono | DM Mono 400 | Streaks, timers, labels, metadata, hints |

### 11e. UI Components

- Tab bar: Multicolor 3D vinyl toy icons (Home, Trophy, Gift, Profile). Active tab gets lime-tinted background square. Cream/orange/dark gray palette on icons.
- Heat dots: Yellow-to-red gradient (#FFD600 → #FFAB00 → #FF6D00) with fire emoji
- Challenge cards: Streak indicator (fire + bold days) + treat progress ring (1.5px stroke, lime for normal, amber for redemption)
- Countdown card: Compact number (80px Rajdhani), treatment progress bar below (lime gradient, start/end dates)
- Coach header: Avatar icon + name + roast level + heat dots
- Buttons: Ghost style with colored borders and tinted backgrounds. Clutch = lime. Fumble = red.

---

## 12. Monetization

### Free (Patient):

2 coaches (Bri + Jay), heat levels 1–3, all challenges, PFDE, redemption (50% earn-back), tiers, leaderboard, treats, notifications, all share cards including photo modes, basic stats, weekly recap, accountability partners

### Premium — $4.99/mo or $34.99/year:

- All 5 coaches (adds Kenji, Claire, Mason)
- Heat levels 4–5
- Profile customization (frames, animated avatars, coach-themed styles)
- Advanced stats and compliance history (calendar heatmap, per-challenge breakdown, personal bests)
- "Ask your coach" anytime tap (contextual coach line on demand)
- Enhanced redemption (65% earn-back instead of 50%, proactive trigger option)
- Seasonal exclusive content (holiday roasts, limited-time share card designs)
- Custom notification timing per challenge
- Custom challenges

### Practice Dashboard — Two Tiers:

**Starter ($99/mo):** Up to 25 active patients. All core features (patients, challenges, compliance tracking, QR codes). 1 staff seat. Basic treats (default templates only). Basic risk flags (inactive patients). BiteBack branding on share cards (no practice logo).

**Pro ($199/mo):** Unlimited patients. Everything in Starter. Treatment forecasting + risk flags + confidence bands. Timeline adjustments (push back / pull forward / reset). Practice branding on share cards (practice logo + name). Custom treats. Unlimited staff seats with Owner/Admin/Viewer roles. Exportable reports. Fumble sensitivity controls per patient. Priority support.

14-day free trial on all plans. No free tier for practices.

### Revenue Math:

50 practices × $158 blended ARPU = $94,800/yr. 10% patient premium at $4.99 adds ~$59,880/yr. Combined: ~$155K ARR. At 500 practices: ~$948K+. At 1,000 practices: ~$1.9M+.

---

## 13. HIPAA & Privacy

- Anonymous codes. No name, DOB, diagnosis stored in BiteBack.
- Practice maps codes to patients in their PMS. BiteBack never knows identity.
- Staff-assigned labels (not real names) used throughout dashboard. ToS prohibits PHI in labels.
- PFDE data is behavioral, not medical. Selfies local-only.
- Office-logged fumbles reference patient codes, never real names.
- Disclaimer: 'Based on self-reported adherence. Timing determined by orthodontist.'

---

## 14. Technical Architecture

- Mobile: React Native (Expo) — expo-camera, expo-haptics, expo-notifications, expo-av, reanimated
- Backend: Supabase (Postgres + Auth + Realtime + Edge Functions)
- PFDE: daily Edge Function per patient. Office overrides trigger immediate recalc.
- Database: ~20 tables. All content-bearing tables (coaches, contexts, lines, challenges, treats, notifications, tiers) are config-driven. See architecture docs for complete schema.
- Dashboard: Next.js at biteback.app/practice. Stripe for billing.

---

## 15. Go-to-Market

- Phase 1: Your practice, 20–30 patients. Test PFDE + office overrides against clinical reality.
- Phase 2: 10 pilot practices. Free dashboard. Calibrate sensitivity defaults.
- Phase 3: AAO, ortho Facebook groups. Lead with behavioral forecasting + office control.
- Phase 4: Expand beyond ortho.

---

## 16. MVP Scope

### v1 — Ships:

- 10-step onboarding with QR scan (splash, scan, name, avatar, coach, heat, challenges, countdown, reminder, first check-in)
- 5 coaches (2 free, 3 premium) with PFDE-aware + office-aware lines
- PFDE: simple days 1–14, forecast day 15+. Confidence bands on dashboard.
- Office-side fumble logging + compliance verification
- Practice challenge management: add/remove mid-treatment
- Doctor timeline adjustments: pull forward / push back / reset
- Practice branding on share cards
- Tiers: Snagglefang → Titanium (7 tiers)
- Redemption Quest (3-day; 50% earn-back free, 65% premium)
- Leaderboards, accountability partners, treats
- All share cards including photo modes (free for all patients)
- Push notifications in coach voice, max 2/day
- Haptics + sounds + animations
- Settings, delete data, feedback

### Premium features (v1):

- 3 additional coaches (Kenji, Claire, Mason) + heat levels 4–5
- Profile customization (frames, animated avatars, coach-themed styles)
- Advanced stats and compliance history
- "Ask your coach" anytime tap
- Enhanced redemption (65% earn-back, proactive trigger)
- Custom notification timing per challenge
- Custom challenges

### Premium features (early updates, post-launch):

- Seasonal exclusive content (holiday roasts, limited-time share card designs)

### v2 Roadmap:

- Aura System (parallel prestige track)
- Co-op Shields for accountability partners
- Practice ROI Engine
- Regional / school leagues
- Enterprise DSO multi-location dashboard
- ML-powered predictions

---

## 17. Design Assets — Completed

All design files are standalone HTML, viewable in any browser. Migrated to Eleventy static site.

**Onboarding (10 screens):**
biteback-onboarding-01-splash.html through biteback-onboarding-10-checkin.html

**Core App:**
- biteback-home-with-avatars.html — Home screen with coach avatars integrated
- biteback-final-roster.html — All 5 coach characters, full body + face
- biteback-3d-tabs-v2.html — Multicolor vinyl toy tab icons (dark + light mode)
- biteback-poster.html — Marketing poster with slogan
- biteback-bri-bio.html — Coach bio page template

**v1 is not a prototype. It's the complete product with behavioral forecasting, office control, social competition, real rewards, practice branding, and clinical credibility. Day one.**
