# BITEBACK — Master Build Roadmap

**Complete ordered task list. Reference this at the start of every session.**
**Last updated: February 20, 2026**

---

## STATUS KEY

- `[ ]` Not started
- `[~]` In progress
- `[✓]` Complete

---

## PRE-BUILD (Content & Assets)

### 1. Seed Script `[ ]`
Single `seed.sql` — all ~20 tables + v1 data (8 challenges, 8 treat templates, 11 notification types, 7 tiers, 5 coaches, 66 contexts, expression map, `evaluateConditions` schema). Run once against Supabase.

### 2. Avatar Generation — Batch 1 + 2 `[ ]`
Neutral faces + bodies for all 5 coaches (style lock), then hype + roast faces. 20 source images → 55 exports. Covers launch. See `biteback-avatar-regeneration-plan.md` for full spec and tracking checklist.

### 3. Coach Lines — P1 `[ ]`
P0 is done (300 lines in speech matrix). Write P1: `checkin_fumble_after_streak`, `checkin_clutch_streak_7`, `pfde_date_improved`, `pfde_date_worsened`, all 6 redemption contexts, `office_fumble_logged`. ~180 lines/coach, ~900 total. Working file: `biteback-coach-speech-matrix.xlsx`

### 4. Remaining Design Mockups (3 screens) `[ ]`
Build in Eleventy before building in React Native:
- Weekly recap card — Sunday summary, shareable
- Push notification examples — all 11 types, coach-voiced
- Accountability partner screens

---

## BUILD — Patient App (React Native + Expo)

### 5. Supabase Project Setup `[ ]`
Create project, run seed script, upload avatars to Storage, configure Auth (anonymous codes for patients, magic links for staff), verify config lookups work.

### 6. Phase 1 — Single Challenge Flow `[ ]`
One challenge, full clutch/fumble, coach dialogue via `getCoachLine()`, check-in recording, streak tracking.

### 7. Phase 2 — Multi-Challenge `[ ]`
Challenge picker, multiple active challenges, per-challenge streak tracking, PFDE weight normalization.

### 8. Phase 3 — Treatment Timer + PFDE `[ ]`
Countdown display, PFDE engine (simple days 1–14, forecast day 15+), daily Edge Function recalculation, sensitivity modes.

### 9. Phase 4 — Treats System `[ ]`
Practice-created treats, progress rings on challenge cards, unlock flow, claim flow, fulfillment tracking.

### 10. Phase 5 — Share Cards `[ ]`
6 share card types (streak, fumble, tier-up, countdown, rank, doctor update) + 3 photo modes. 9:16 format. Practice branding. Dark + light.

### 11. Phase 6 — Onboarding `[ ]`
10-step flow: splash, QR scan, nickname, avatar, coach selection, heat level, challenges, countdown reveal, reminder, first check-in.

### 12. Phase 7 — Settings & Profile `[ ]`
Profile screen (6 stat cards, tier progression), coach switching, heat level change, notification controls, delete data, feedback.

### 13. Phase 8 — Push Notifications `[ ]`
11 notification types, priority queue Edge Function, max 2/day cap, cooldowns, suppression rules, coach-voiced copy. Expo push integration.

---

## BUILD — Premium Features (v1)

### 14. Premium Feature Implementation `[ ]`
- 3 additional coaches (Kenji, Claire, Mason) + heat levels 4–5
- Profile customization (frames, animated avatars, coach-themed styles)
- Advanced stats and compliance history (calendar heatmap, per-challenge breakdown, personal bests)
- "Ask your coach" anytime tap (contextual coach line on demand)
- Enhanced redemption (65% earn-back, proactive trigger)
- Custom notification timing per challenge
- Custom challenges
- Stripe integration for patient premium ($4.99/mo or $34.99/yr)

---

## BUILD — Practice Dashboard (Next.js)

### 15. Phase 9a — Practice Dashboard `[ ]`
Next.js at biteback.app/practice. 9 pages:
- Overview (stat cards, forecast distribution, risk flags, patient table)
- Patients list (11 columns, search, filters, track badges, bulk actions)
- Individual patient (forecast + timeline actions + 30-day trend + check-in heatmap + challenges with confirm/fumble/disable + treats eligibility + redemption history + activity log)
- Challenges management (track cards, penalty config, assignment summary, change log)
- Treats management (active treats grid, eligible patients, templates, fulfillment log, create modal)
- QR code generation (form, live preview, print-ready card, codes table)
- Branding (logo upload, share card previews dark/light/leaderboard)
- Staff management (Owner/Admin/Viewer roles, magic link auth, invite, activity log)
- Billing (Starter $99/Pro $199, usage bar, ROI snapshot, invoices)

Stripe integration. 14-day free trial. All designs exist in Eleventy.

### 16. Dashboard Audit — 6 Polish Items `[ ]`
1. Risk flags: add "reviewed" / "contacted" toggle states
2. Timeline actions: add date picker + reason field to push back / pull forward / reset
3. High volatility flag: add missing 4th auto-flag trigger
4. Leaderboard view: dedicated practice leaderboard section
5. Redemption tracking overview: practice-wide summary
6. Aggregate stats over time: month-over-month trends on overview

---

## BUILD — Founder Dashboard (Next.js)

### 17. Phase 9b — Founder Dashboard `[ ]`
Internal command center. 5 pages:
- Overview (6 KPIs, MRR chart, conversion funnel, revenue breakdown, practices table, engagement stats, coach popularity, virality, founder alerts, GTM milestones, platform health)
- Practices (distribution charts, retention cohort heatmap, churn risk cards, upgrade opportunities, full practices table)
- Patients (streak/tier distribution, compliance decay curve, track split, fumble heatmap by hour/day, platform leaderboard)
- Engagement (DAU chart, share card breakdown, push notification performance, feature adoption, treats stats, redemption quest funnel, K-factor)
- Revenue (MRR growth, revenue waterfall, plan mix over time, unit economics LTV/CAC/ARPU/churn, expenses, profitability, 12-month projections)

All designs exist in Eleventy.

---

## CONTENT COMPLETION

### 18. Coach Lines — P2 + P3 `[ ]`
Fill remaining speech matrix before public launch. All remaining push notifications, tier-ups, treats, share captions, partner contexts, idle/return, remaining streak milestones. ~630 lines/coach, ~3,150 total.

### 19. Avatar Generation — Batch 3 + 4 `[ ]`
Disappointed + impressed faces, hype + roast bodies for share cards. 20 source images → 50 exports. See `biteback-avatar-regeneration-plan.md`.

---

## LAUNCH

### 20. Phase 10 — Polish & Launch `[ ]`
- Performance optimization
- Accessibility pass
- Haptics + sounds + animations
- App Store submission prep
- Seasonal content system (post-launch: holiday roasts, limited-time share card designs)

---

## POST-LAUNCH (v2 Roadmap)

- [ ] Aura System (parallel prestige track)
- [ ] Co-op Shields for accountability partners
- [ ] Practice ROI Engine
- [ ] Regional / school leagues
- [ ] Enterprise DSO multi-location dashboard
- [ ] ML-powered PFDE predictions

---

## REFERENCE DOCUMENTS

| Document | Purpose |
|---|---|
| `BITEBACK-MASTER-HANDOFF.md` | Full project context, design system, all specs |
| `BiteBack_PRD_Updated.md` | Canonical PRD — features, monetization, architecture |
| `biteback-systems-architecture.md` | Challenges, treats, notifications, tiers schema |
| `biteback-coach-architecture.md` | Coaches, contexts, lines, AI upgrade path |
| `biteback-avatar-regeneration-plan.md` | Expression system, generation spec, tracking checklist |
| `ELEVENTY-MIGRATION-HANDOFF.md` | Design mockup project structure and conventions |
| `CONVENTIONS.md` | Eleventy build rules |
| `biteback-raw-urls.md` | Archive repo URLs for reference HTML files |
| `biteback-coach-speech-matrix.xlsx` | Working file for writing coach lines (local, not in repo) |
