# BITEBACK — Systems Config Architecture

**Data-driven configuration for challenges, treat templates, notification routing, and tiers.**
**Companion to `biteback-coach-architecture.md` (coaches, lines, contexts, AI path).**

---

## 1. DESIGN PRINCIPLES

Same as the coach architecture — repeated here because they apply to every system:

1. **Zero content knowledge in app code.** The app knows there are challenges, tiers, treat templates, and notification types. It never knows *which ones* or *what they say*.
2. **Every content item is a config row.** Adding a new challenge, tier, treat template, or notification type = insert rows. No deploy.
3. **Practices customize from a master catalog.** BiteBack maintains the catalog. Practices pick, toggle, and configure from it.
4. **Coach integration via context IDs.** Every system event that triggers coach dialogue references a `coach_contexts.id` — it never contains dialogue text itself. See `biteback-coach-architecture.md` for the full context taxonomy.

---

## 2. CHALLENGES

### The Problem

The PRD lists a handful of challenges (aligner wear, rubber bands, brushing) but:
- Practices add/remove challenges mid-treatment
- Phase 4 expands beyond ortho (retainers, sleep apnea appliances, post-surgical)
- Each challenge has unique check-in questions, PFDE weights, icons, and coach-specific reactions
- If challenge definitions live in code, every new challenge type requires a deploy

### 2a. `challenge_catalog` table — Master list of all possible challenges

```sql
CREATE TABLE challenge_catalog (
  id              TEXT PRIMARY KEY,           -- 'aligner_wear', 'rubber_bands', 'brushing', etc.
  display_name    TEXT NOT NULL,              -- 'Aligner Wear'
  short_name      TEXT NOT NULL,              -- 'Aligners' (for compact UI: cards, badges)
  description     TEXT,                       -- 'Wear your aligners 20+ hours per day'
  
  -- Track assignment
  track           TEXT NOT NULL,              -- 'aligners', 'braces', 'universal', 'custom'
  
  -- Check-in configuration
  checkin_question TEXT NOT NULL,             -- 'DID YOU WEAR YOUR ALIGNERS?'
  checkin_detail   TEXT,                      -- '20+ hours today' (subtitle under question)
  clutch_label     TEXT DEFAULT 'CLUTCH',     -- Button label (could be customized per challenge)
  fumble_label     TEXT DEFAULT 'FUMBLE',     -- Button label
  
  -- PFDE integration
  pfde_weight     FLOAT NOT NULL DEFAULT 0.2, -- Weight in Rolling Compliance Score calculation
  default_fumble_penalty_days FLOAT DEFAULT 0.5, -- Default days added per fumble
  
  -- Visual
  icon_emoji      TEXT,                       -- '🦷' fallback
  icon_url        TEXT,                       -- Supabase Storage URL for custom icon
  color           TEXT,                       -- Optional accent color (defaults to challenge track color)
  
  -- Behavior
  requires_selfie  BOOLEAN DEFAULT FALSE,     -- Can this challenge use selfie verification?
  allows_partial   BOOLEAN DEFAULT FALSE,     -- Future: partial compliance (e.g., wore aligners 15/20 hours)
  
  -- State
  sort_order      INT NOT NULL DEFAULT 0,
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**v1 seed data:**

| id | display_name | track | pfde_weight | checkin_question |
|---|---|---|---|---|
| `aligner_wear` | Aligner Wear | aligners | 0.5 | DID YOU WEAR YOUR ALIGNERS? |
| `rubber_bands` | Rubber Bands | braces | 0.3 | DID YOU WEAR YOUR RUBBER BANDS? |
| `brushing` | Brushing | universal | 0.2 | DID YOU BRUSH AFTER EVERY MEAL? |
| `retainer_wear` | Retainer Wear | aligners | 0.5 | DID YOU WEAR YOUR RETAINER? |
| `wax_application` | Wax Application | braces | 0.1 | DID YOU APPLY WAX WHERE NEEDED? |
| `mouthguard` | Mouthguard | universal | 0.3 | DID YOU WEAR YOUR MOUTHGUARD? |
| `flossing` | Flossing | universal | 0.15 | DID YOU FLOSS TODAY? |
| `headgear` | Headgear | braces | 0.4 | DID YOU WEAR YOUR HEADGEAR? |

### 2b. `patient_challenges` table — What each patient is actually tracking

**Append-only model.** Deactivating a challenge closes the current row (`active_until` set) and
re-activating inserts a new row. This preserves gap history so the PFDE knows exactly which
windows a challenge was active during — critical for accurate compliance scoring when practices
add/remove challenges mid-treatment.

```sql
CREATE TABLE patient_challenges (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES patients(id),
  challenge_id    TEXT NOT NULL REFERENCES challenge_catalog(id),
  
  -- Practice overrides (NULL = use catalog defaults)
  custom_question  TEXT,                     -- Practice can customize the question text
  custom_detail    TEXT,                     -- Custom subtitle
  fumble_penalty_days FLOAT,                -- Override default penalty
  pfde_weight_override FLOAT,               -- Override default PFDE weight
  
  -- Activation window (append-only — deactivation closes the row, reactivation inserts a new row)
  active_from     TIMESTAMPTZ NOT NULL DEFAULT NOW(),  -- When this assignment became active
  active_until    TIMESTAMPTZ,              -- When deactivated (NULL = currently active)
  sort_order      INT DEFAULT 0,
  assigned_by     TEXT,                      -- Staff member who assigned it
  deactivated_by  TEXT,                      -- Staff member who deactivated it
  
  -- Streak tracking (denormalized for performance — applies to current active window)
  current_streak  INT DEFAULT 0,
  best_streak     INT DEFAULT 0,
  total_clutches  INT DEFAULT 0,
  total_fumbles   INT DEFAULT 0
);

-- Active challenges for a patient (hot query path)
CREATE INDEX idx_patient_challenges_active 
  ON patient_challenges(patient_id) 
  WHERE active_until IS NULL;

-- History lookup for PFDE: all windows for a patient + challenge
CREATE INDEX idx_patient_challenges_history
  ON patient_challenges(patient_id, challenge_id, active_from);
```

### 2c. PFDE Weight Normalization

When a practice assigns challenges to a patient, the PFDE weights need to sum to 1.0. Two approaches:

**Option A — Auto-normalize (recommended for v1):**
```
Patient has: aligner_wear (0.5), rubber_bands (0.3), brushing (0.2) → sum = 1.0 ✓
Patient has: aligner_wear (0.5), brushing (0.2) → normalize to 0.71, 0.29
```
The PFDE Edge Function normalizes at calculation time using only challenges where `active_until IS NULL`.
Practices don't think about weights. Historical windows (closed rows) are used for past-period PFDE
accuracy but don't affect current normalization.

**Option B — Manual weights (v2):**
Pro-tier practices can override weights per patient. Dashboard shows a weight slider per challenge.

### 2d. Adding a New Challenge — Checklist

**Catalog level (available to all practices):**
- [ ] Insert row into `challenge_catalog`
- [ ] Upload icon to Supabase Storage (if not using emoji fallback)
- [ ] Ensure coach lines exist for `checkin_clutch` and `checkin_fumble` contexts that can handle the new `{challenge_name}` variable
- [ ] No code changes needed — challenge appears in dashboard challenge management

**Practice level (assigning to a patient):**
- [ ] Staff selects from catalog in dashboard → inserts `patient_challenges` row
- [ ] Patient sees new challenge card on next app open
- [ ] PFDE auto-normalizes weights

**Beyond ortho (Phase 4):**
- [ ] Add new track value (e.g., `'sleep_apnea'`, `'post_surgical'`)
- [ ] Add catalog entries for that track
- [ ] Dashboard challenge picker groups by track automatically
- [ ] Coach lines use `{challenge_name}` variable — no new lines needed unless you want challenge-specific roasts

---

## 3. TREAT TEMPLATES

### The Problem

The dashboard has "default templates" for treats plus custom creation. Without a template catalog:
- Every practice reinvents the same rewards
- Seasonal or promotional treats require code changes
- No data on which reward types drive the most compliance

### 3a. `treat_templates` table — Master catalog of reward ideas

```sql
CREATE TABLE treat_templates (
  id              TEXT PRIMARY KEY,           -- 'free_smoothie_30d', 'extra_color_change', etc.
  display_name    TEXT NOT NULL,              -- 'Free Smoothie'
  description     TEXT NOT NULL,              -- 'Earn a free smoothie from the office drink bar'
  
  -- Milestone configuration
  suggested_milestone_type TEXT NOT NULL,     -- 'streak_days', 'total_clutches', 'compliance_pct', 'tier'
  suggested_milestone_value INT NOT NULL,     -- 30 (days), 50 (clutches), 90 (percent), etc.
  
  -- Visual
  icon_emoji      TEXT NOT NULL,              -- '🥤'
  icon_url        TEXT,                       -- Optional custom icon
  category        TEXT NOT NULL,              -- 'food_drink', 'ortho_perk', 'swag', 'experience', 'digital'
  
  -- Seasonal / promotional
  available_from  DATE,                       -- NULL = always available
  available_until DATE,                       -- NULL = never expires
  is_seasonal     BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  estimated_cost  FLOAT,                     -- Suggested cost to practice (for ROI calculations)
  popularity      INT DEFAULT 0,             -- How many practices have used this template
  
  -- State
  sort_order      INT DEFAULT 0,
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**v1 seed data:**

| id | display_name | category | milestone_type | milestone_value | icon |
|---|---|---|---|---|---|
| `free_smoothie_30d` | Free Smoothie | food_drink | streak_days | 30 | 🥤 |
| `extra_color_change` | Extra Color Change | ortho_perk | streak_days | 14 | 🎨 |
| `gift_card_5` | $5 Gift Card | swag | streak_days | 60 | 🎁 |
| `skip_brushing_lecture` | Skip the Brushing Lecture | experience | compliance_pct | 90 | 😎 |
| `phone_charging_cable` | Phone Charging Cable | swag | total_clutches | 50 | 🔌 |
| `early_band_removal` | Early Band Color Swap | ortho_perk | streak_days | 21 | ✨ |
| `candy_bag_holiday` | Holiday Candy Bag | food_drink | streak_days | 7 | 🍬 |
| `custom_retainer_case` | Custom Retainer Case | swag | streak_days | 90 | 💎 |

### 3b. `practice_treats` table — What each practice actually offers

```sql
CREATE TABLE practice_treats (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id     UUID NOT NULL REFERENCES practices(id),
  
  -- Source (one of these will be set)
  template_id     TEXT REFERENCES treat_templates(id),  -- From catalog
  -- If template_id is NULL, this is a custom treat:
  custom_name     TEXT,
  custom_description TEXT,
  custom_icon_emoji TEXT,
  custom_category TEXT,
  
  -- Milestone (can override template defaults)
  milestone_type  TEXT NOT NULL,              -- 'streak_days', 'total_clutches', 'compliance_pct', 'tier'
  milestone_value INT NOT NULL,
  
  -- Practice-specific
  reward_details  TEXT,                       -- 'Redeemable at front desk, mention BiteBack'
  max_claims      INT,                        -- NULL = unlimited, or cap total redemptions
  claims_remaining INT,                       -- Decremented on fulfillment
  
  -- State
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3c. `treat_claims` table — Fulfillment tracking

```sql
CREATE TABLE treat_claims (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES patients(id),
  treat_id        UUID NOT NULL REFERENCES practice_treats(id),
  
  status          TEXT NOT NULL DEFAULT 'eligible',  -- 'eligible', 'unlocked', 'claimed', 'fulfilled', 'expired'
  unlocked_at     TIMESTAMPTZ,               -- When patient hit the milestone
  claimed_at      TIMESTAMPTZ,               -- When patient claimed in-app
  fulfilled_at    TIMESTAMPTZ,               -- When office marked as fulfilled
  fulfilled_by    TEXT,                       -- Staff member who fulfilled
  expired_at      TIMESTAMPTZ,               -- When treat was expired/cancelled
  expired_reason  TEXT,                       -- 'treat_deactivated', 'practice_cancelled', 'claims_exhausted'
  
  -- Coach integration
  coach_context_used TEXT,                   -- 'treat_unlocked', 'treat_claimed' — for analytics
  
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3d. Adding a New Treat Template — Checklist

**Catalog level:**
- [ ] Insert row into `treat_templates`
- [ ] Coach lines for `treat_unlocked` and `treat_claimed` contexts already use `{treat_name}` variable — no new lines needed

**Seasonal treat:**
- [ ] Set `available_from` and `available_until` dates
- [ ] Set `is_seasonal = true`
- [ ] Template appears in dashboard catalog during the window, disappears after
- [ ] Active practice treats based on expired templates continue working (the template just stops being offered to new practices)

**Practice level:**
- [ ] Staff picks from catalog or creates custom → inserts `practice_treats` row
- [ ] Eligible patients see progress ring on challenge cards automatically
- [ ] Coach reacts via `treat_progress_update`, `treat_unlocked`, `treat_claimed` contexts

---

## 4. NOTIFICATION ROUTING

### The Problem

The PRD defines 11 push notification types with a max 2/day rule. Without config-driven routing:
- Adding a new notification type requires code changes to the priority queue
- Tuning frequency, cooldowns, and suppression rules requires deploys
- No way to A/B test notification timing or priority

### 4a. `notification_types` table — Routing configuration

```sql
CREATE TABLE notification_types (
  id                TEXT PRIMARY KEY,         -- 'daily_reminder', 'streak_at_risk', etc.
  display_name      TEXT NOT NULL,            -- 'Daily Reminder'
  description       TEXT,                     -- 'Scheduled daily check-in reminder'
  
  -- Trigger
  trigger_type      TEXT NOT NULL,            -- 'scheduled', 'event', 'condition'
  trigger_event     TEXT,                     -- Event name: 'fumble_logged', 'streak_milestone', etc.
  trigger_condition JSONB,                    -- For condition type: {"inactive_days": 3}
  
  -- Scheduling (for scheduled type)
  uses_patient_time BOOLEAN DEFAULT FALSE,    -- TRUE = fire at patient's chosen reminder time
  default_delay_minutes INT DEFAULT 0,        -- For event type: delay after trigger (e.g., fumble roast = 30 min later)
  
  -- Priority & limits
  priority          INT NOT NULL DEFAULT 5,   -- 1 = highest. Used for 2/day cap selection.
  cooldown_hours    INT DEFAULT 0,            -- Min hours between sends of this type
  max_per_day       INT DEFAULT 1,            -- Max sends of this type per patient per day
  
  -- Suppression rules
  suppress_if       JSONB,                    -- Uses condition schema (see 4a-ii below)
  requires          JSONB,                    -- Uses condition schema (see 4a-ii below)
  
  -- Coach integration
  coach_context_id  TEXT NOT NULL REFERENCES coach_contexts(id),  -- Which context to pull lines from
  
  -- Channel
  channel           TEXT DEFAULT 'push',      -- 'push', 'in_app', 'both'
  
  -- State
  active            BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order        INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### 4a-ii. Condition Schema Specification

The JSONB `suppress_if`, `requires` (on `notification_types`), and `conditions` (on `coach_lines`) fields
all use the same flat key-value schema. This keeps a single evaluator function for all three use cases.

**Supported condition keys (v1):**

| Key | Type | Description | Example |
|---|---|---|---|
| `has_checked_in_today` | boolean | Patient has at least one check-in today | `true` |
| `has_active_streak` | boolean | Current streak ≥ 1 | `true` |
| `min_streak` | int | Minimum current streak | `7` |
| `max_streak` | int | Maximum current streak | `30` |
| `min_treatment_day` | int | Minimum days since treatment start | `3` |
| `inactive_days_gt` | int | Days since last check-in exceeds N | `14` |
| `tier` | string | Patient's current tier ID | `"titanium"` |
| `tier_min_sort` | int | Tier sort_order minimum (tier hierarchy) | `4` |
| `day_of_week` | string | Lowercase day name | `"friday"` |
| `challenge_id` | string | Specific challenge is active | `"rubber_bands"` |
| `is_premium` | boolean | Patient has premium subscription | `true` |

**Evaluation rules:**
- All keys in the object are AND'd together (all must be true)
- Unknown keys are ignored (forward-compatible — new keys can be added without breaking old rows)
- NULL JSONB = no conditions (always passes)
- A single shared function `evaluateConditions(conditions: JSONB, patientState: PatientState): boolean` is used across notifications, coach lines, and any future system that needs conditional logic

**Adding a new condition key:**
1. Add the key to this spec
2. Add the resolver to `evaluateConditions()`
3. Existing rows with only old keys continue working — no migration needed

**v1 seed data:**

| id | trigger_type | priority | cooldown_hours | coach_context_id | key rules |
|---|---|---|---|---|---|
| `daily_reminder` | scheduled | 3 | 20 | `push_daily_reminder` | Uses patient's chosen time. Suppressed if already checked in. |
| `streak_at_risk` | condition | 1 | 12 | `push_streak_at_risk` | Fires if no check-in by 8 PM and streak ≥ 3. |
| `fumble_roast` | event | 5 | 0 | `push_fumble_roast` | 30-min delay after fumble. Max 1/day. |
| `streak_milestone` | event | 2 | 0 | `push_streak_milestone` | Fires on 7/14/30/60/90. No cooldown (rare event). |
| `tier_up` | event | 2 | 0 | `push_tier_up` | Fires on tier transition. |
| `treat_unlocked` | event | 1 | 0 | `push_treat_unlocked` | High priority — reward moment. |
| `treat_fulfilled` | event | 2 | 0 | `push_treat_fulfilled` | After office marks fulfilled. |
| `leaderboard_overtaken` | event | 7 | 24 | `push_leaderboard_overtaken` | Low priority. Max 1/day. 24h cooldown. |
| `inactive_3day` | condition | 4 | 72 | `push_inactive_3day` | Fires once after 3 days. 72h cooldown prevents spam. |
| `inactive_7day` | condition | 3 | 168 | `push_inactive_7day` | Fires once after 7 days. Won't re-fire for a week. |
| `welcome_back` | event | 2 | 0 | `push_welcome_back` | Fires on first check-in after 3+ day gap. |

### 4b. Notification Priority Queue Logic

The Edge Function that processes notifications runs this logic (config-driven, not hardcoded):

```
1. Gather all pending notifications for patient
2. For each, check:
   a. Is notification_type.active?
   b. Does patient meet notification_type.requires conditions?
   c. Is any notification_type.suppress_if condition true?
   d. Has cooldown_hours elapsed since last send of this type?
   e. Has max_per_day been reached for this type?
3. Filter to eligible notifications
4. Sort by priority (ascending = highest priority first)
5. Take top 2 (global max 2/day cap)
6. For each, call getCoachLine(coach_context_id) to get copy
7. Send via push + log to notification_log
```

### 4c. `notification_log` table — Delivery tracking

```sql
CREATE TABLE notification_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID NOT NULL REFERENCES patients(id),
  notification_type TEXT NOT NULL REFERENCES notification_types(id),
  
  -- Content
  coach_id          TEXT NOT NULL REFERENCES coaches(id),
  line_id           UUID REFERENCES coach_lines(id),
  line_text         TEXT NOT NULL,            -- The actual text sent (snapshot)
  
  -- Delivery
  sent_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  channel           TEXT NOT NULL,            -- 'push', 'in_app'
  
  -- Engagement
  opened            BOOLEAN DEFAULT FALSE,
  opened_at         TIMESTAMPTZ,
  led_to_checkin    BOOLEAN DEFAULT FALSE,    -- Did patient check in within 2 hours?
  checkin_at        TIMESTAMPTZ,
  
  -- Debug
  trigger_event     TEXT,                     -- What triggered this notification
  priority_rank     INT                       -- Where it ranked in the queue (1 = highest that day)
);

CREATE INDEX idx_notification_log_patient_day 
  ON notification_log(patient_id, sent_at);
```

### 4d. Adding a New Notification Type — Checklist

- [ ] Define the coach context in `coach_contexts` table (see coach architecture doc)
- [ ] Write coach lines for all 5 coaches × relevant heat levels for that context
- [ ] Insert row into `notification_types` with trigger, priority, cooldown, suppression rules
- [ ] If trigger_type = 'event': ensure the event is emitted by the relevant system (check-in flow, PFDE recalc, office action, etc.)
- [ ] If trigger_type = 'condition': ensure the notification Edge Function checks for it
- [ ] No app code changes — the priority queue picks it up automatically

**The only code change scenario:** A new `trigger_type` value beyond 'scheduled', 'event', and 'condition'. This is unlikely in v1-v2.

---

## 5. TIERS

### The Problem

7 tiers with streak thresholds, colors, names, and badge assets. Referenced in: profile, leaderboard, share cards, coach reactions (tier-up contexts), treat milestones, onboarding default. If thresholds or names change, you don't want to hunt through components.

### 5a. `tiers` table — Tier definitions

```sql
CREATE TABLE tiers (
  id              TEXT PRIMARY KEY,           -- 'snagglefang', 'wire_warrior', etc.
  display_name    TEXT NOT NULL,              -- 'SNAGGLEFANG', 'WIRE WARRIOR'
  
  -- Threshold
  streak_threshold INT NOT NULL,             -- Minimum consecutive days to reach this tier
  
  -- Visual
  color_hex       TEXT NOT NULL,              -- Badge/accent color
  color_name      TEXT NOT NULL,              -- 'Gray', 'Bronze', 'Silver', 'Gold', 'Diamond'
  badge_icon_url  TEXT,                       -- Supabase Storage URL
  badge_icon_emoji TEXT,                      -- Fallback emoji
  
  -- Vibe
  vibe_label      TEXT,                       -- 'Rookie', 'Getting there', 'Legend'
  
  -- Coach integration
  tier_up_context_id TEXT REFERENCES coach_contexts(id),  -- Which coach context fires on tier-up
  
  -- Unlocks (what reaching this tier grants)
  unlocks         JSONB,                     -- {"share_card": true, "coach_lines_exclusive": true, "heat_4_preview": true}
  
  -- State
  sort_order      INT NOT NULL,              -- Display order (also determines hierarchy)
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**v1 seed data:**

| id | display_name | streak_threshold | color_hex | color_name | sort_order | tier_up_context_id |
|---|---|---|---|---|---|---|
| `snagglefang` | SNAGGLEFANG | 0 | #9CA3AF | Gray | 1 | — (starting tier) |
| `wire_warrior` | WIRE WARRIOR | 3 | #CD7F32 | Bronze | 2 | `tier_up_wire_warrior` |
| `elastic_elite` | ELASTIC ELITE | 7 | #CD7F32 | Bronze | 3 | `tier_up_elastic_elite` |
| `retainer_royalty` | RETAINER ROYALTY | 14 | #C0C0C0 | Silver | 4 | `tier_up_retainer_royalty` |
| `smile_soldier` | SMILE SOLDIER | 30 | #FFD700 | Gold | 5 | `tier_up_smile_soldier` |
| `arch_nemesis` | ARCH NEMESIS | 60 | #FFD700 | Gold | 6 | `tier_up_arch_nemesis` |
| `titanium` | TITANIUM | 90 | #B9F2FF | Diamond | 7 | `tier_up_titanium` |

**Note:** The handoff doc (Section 4) and PRD (Section 9) have slightly different tier lists. The handoff has 7 tiers (Snagglefang, Wire Warrior, Elastic Elite, Retainer Royalty, Smile Soldier, Arch Nemesis, Titanium). The PRD has 5 (Snagglefang, Wired, Straightened, Platinum Grill, Titanium). **The handoff doc version is the latest** — use those 7 tiers as canonical.

### 5b. Tier resolution function

```typescript
interface TierInfo {
  id: string;
  displayName: string;
  colorHex: string;
  colorName: string;
  badgeUrl: string;
  vibeLabel: string;
  unlocks: Record<string, boolean>;
}

// Called everywhere tier info is needed
async function getTierForStreak(streak: number): Promise<TierInfo> {
  // Query tiers table, ordered by streak_threshold DESC
  // Return first tier where streak >= streak_threshold
}

// Called on check-in to detect tier transitions
async function checkTierTransition(
  oldStreak: number, 
  newStreak: number
): Promise<{ tieredUp: boolean; newTier?: TierInfo; oldTier?: TierInfo }> {
  const oldTier = await getTierForStreak(oldStreak);
  const newTier = await getTierForStreak(newStreak);
  if (newTier.id !== oldTier.id && newTier.sortOrder > oldTier.sortOrder) {
    return { tieredUp: true, newTier, oldTier };
  }
  return { tieredUp: false };
}
```

### 5c. Adding a New Tier — Checklist

- [ ] Insert row into `tiers` table with threshold, colors, badge
- [ ] Create coach context in `coach_contexts` (e.g., `tier_up_new_tier`)
- [ ] Write coach lines for all 5 coaches × heat levels for that context
- [ ] Upload badge asset to Supabase Storage
- [ ] No app code changes — `getTierForStreak()` picks it up, `checkTierTransition()` fires the coach context

### 5d. Tier-Down Logic

Tier-down on streak break is handled by the same `checkTierTransition()` function — if `newTier.sortOrder < oldTier.sortOrder`, fire the `tier_down` coach context. The app doesn't need to know which specific tier was lost.

---

## 6. CROSS-SYSTEM RELATIONSHIPS

Here's how everything connects:

```
challenge_catalog
  └──> patient_challenges (assigned per patient)
        └──> check_ins (daily clutch/fumble per challenge)
              ├──> coach_lines via getCoachLine('checkin_clutch' or 'checkin_fumble')
              ├──> tiers via checkTierTransition(streak)
              │     └──> coach_lines via getCoachLine('tier_up_*')
              ├──> practice_treats via milestone check
              │     └──> coach_lines via getCoachLine('treat_unlocked')
              ├──> notification_types (event triggers)
              │     └──> coach_lines via getCoachLine(notification_type.coach_context_id)
              └──> PFDE recalculation (uses challenge pfde_weight)

treat_templates
  └──> practice_treats (configured per practice)
        └──> treat_claims (per patient)

notification_types
  └──> notification_log (delivery history)

tiers
  └──> resolved per patient via getTierForStreak()
```

**The single integration point for all systems is `getCoachLine()`.** No system generates its own copy. Every user-facing text moment routes through the coach content layer.

---

## 7. COMPLETE SUPABASE TABLE LIST

Combining both architecture docs, here's every table in BiteBack:

### Core (from PRD)
| Table | Purpose |
|---|---|
| `patients` | Patient records (anonymous code, nickname, avatar, coach_id, heat_level) |
| `practices` | Practice accounts (name, plan, branding, Stripe customer) |
| `check_ins` | Daily check-in records (patient, challenge, clutch/fumble, selfie flag, verified) |
| `overrides` | Office-logged fumbles and compliance confirmations |
| `forecasts` | PFDE daily snapshots (projected date, RCS, VM, confidence bands) |
| `partners` | Accountability partner pairings |

### Coach System (from coach architecture doc)
| Table | Purpose |
|---|---|
| `coaches` | Coach definitions (5 rows v1) |
| `coach_contexts` | Taxonomy of every moment a coach speaks (66 rows v1) |
| `coach_lines` | Every line every coach can say (~4,650 rows full coverage) |
| `coach_assets` | Avatar images and visual assets per coach |

### Challenges (this doc)
| Table | Purpose |
|---|---|
| `challenge_catalog` | Master list of all possible challenge types (~8 rows v1) |
| `patient_challenges` | Challenge assignments per patient (append-only — tracks active windows for PFDE accuracy) |

### Treats (this doc)
| Table | Purpose |
|---|---|
| `treat_templates` | Reward template catalog (~8 rows v1) |
| `practice_treats` | Treats configured per practice (from template or custom) |
| `treat_claims` | Per-patient fulfillment tracking (eligible → unlocked → claimed → fulfilled, or expired) |

### Notifications (this doc)
| Table | Purpose |
|---|---|
| `notification_types` | Routing config for all notification types (11 rows v1) |
| `notification_log` | Delivery and engagement history |

### Tiers (this doc)
| Table | Purpose |
|---|---|
| `tiers` | Tier definitions (7 rows v1) |

### Staff & Auth (from handoff doc)
| Table | Purpose |
|---|---|
| `staff` | Practice staff members (roles, magic link auth) |
| `staff_activity_log` | All staff actions with timestamps |

**Total: ~20 tables.** All content-bearing tables (coaches, contexts, lines, challenges, treats, notifications, tiers) are config-driven. Adding content = inserting rows.

---

## 8. DISCREPANCY FLAG: TIER NAMES

During this doc's creation, a discrepancy was found between the PRD and handoff doc:

**PRD (Section 9) lists 5 tiers:**
Snagglefang (0-6) → Wired (7-13) → Straightened (14-29) → Platinum Grill (30-59) → Titanium (60+)

**Handoff doc (Section 4) lists 7 tiers:**
Snagglefang (0) → Wire Warrior (3) → Elastic Elite (7) → Retainer Royalty (14) → Smile Soldier (30) → Arch Nemesis (60) → Titanium (90)

The handoff doc is newer and more granular. **Recommend updating the PRD to match the handoff doc's 7-tier system** and making the handoff version canonical. This schema uses the 7-tier version.

---

## 9. MIGRATION NOTES

If any of these systems currently have hardcoded values in the scaffold:

1. Create all tables from this doc + the coach architecture doc
2. Seed with v1 data listed in each section
3. Build shared `evaluateConditions()` function (used by notification queue, coach line selection, and any future conditional logic)
4. Build resolver functions: `getTierForStreak()`, notification priority queue, treat milestone checker
5. Replace hardcoded references with config lookups
6. Verify PFDE weight normalization works with dynamic challenge assignments (uses `active_until IS NULL` filter)
7. Test notification priority queue with all 11 types competing for 2/day slots
8. Verify `patient_challenges` append-only model: deactivation closes row, reactivation inserts new row, PFDE reads historical windows correctly
9. Verify `treat_claims` expired flow: practice deactivating a treat moves unclaimed claims to `expired` status

After migration, adding a new challenge type, treat template, notification type, or tier is a database operation — no code, no deploy, no app store update.
