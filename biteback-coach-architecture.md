# BITEBACK — Coach Content Architecture

**Future-proofing the character system for scalable coach additions, line management, and AI upgrade path.**

---

## 1. DESIGN PRINCIPLES

1. **Zero coach knowledge in app code.** The app knows there are coaches with lines, colors, and avatars. It never knows *who* they are or *what* they say.
2. **Every coach is a config row + content rows.** Adding coach #6 = insert rows + upload assets. No deploy required.
3. **Every moment a coach speaks is a named context.** New contexts (e.g., seasonal events) = new rows, not new code.
4. **Lines are data, not code.** Killable, A/B testable, addable without deploys.
5. **AI-ready.** Each coach has a `personality_prompt` field. When you swap from "pick a random line" to "generate a line," the calling code doesn't change.

---

## 2. SUPABASE SCHEMA

### 2a. `coaches` table — Coach definitions

```sql
CREATE TABLE coaches (
  id            TEXT PRIMARY KEY,           -- 'bri', 'jay', 'kenji', 'claire', 'mason'
  display_name  TEXT NOT NULL,              -- 'BRI', 'JAY', etc.
  archetype     TEXT NOT NULL,              -- 'Toxic bestie, Gen Z chaos'
  tagline       TEXT NOT NULL,              -- Short label shown on coach card
  bio           TEXT NOT NULL,              -- Full bio text for coach bio page
  tier          TEXT NOT NULL DEFAULT 'free', -- 'free' or 'premium'
  
  -- Colors
  color_primary    TEXT NOT NULL,           -- '#FF6B9D' (start of gradient, dark mode)
  color_secondary  TEXT NOT NULL,           -- '#FF2E6C' (end of gradient, dark mode)
  color_light      TEXT NOT NULL,           -- '#D4507A' (light mode solid)
  
  -- Avatar assets (Supabase Storage URLs)
  avatar_face_url  TEXT NOT NULL,           -- Face icon (used in coach bar, bubbles, tab bar)
  avatar_body_url  TEXT NOT NULL,           -- Full body (used in bio page, share cards)
  avatar_face_b64  TEXT,                    -- Base64 fallback for offline/initial load
  
  -- Personality (for future AI generation)
  personality_prompt TEXT,                  -- System prompt capturing voice, rules, vocabulary
  sample_roasts      JSONB,                -- Array of sample lines for preview UI
  
  -- Voice rules
  uses_caps       BOOLEAN DEFAULT FALSE,   -- Kenji = true (ALL CAPS style)
  uses_emoji      BOOLEAN DEFAULT TRUE,    -- All coaches currently true
  signature_emoji TEXT,                     -- '💅' for Bri, '🗿' for Jay, etc.
  vocabulary      JSONB,                   -- Coach-specific words: {"catchphrases": ["bestie", "slay"], "never_says": ["dude"]}
  
  -- Ordering & state
  sort_order    INT NOT NULL DEFAULT 0,    -- Display order in selection UI
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

**v1 seed data:**

| id | display_name | tier | color_primary | sort_order |
|----|-------------|------|---------------|------------|
| bri | BRI | free | #FF6B9D | 1 |
| jay | JAY | free | #64748B | 2 |
| kenji | KENJI | premium | #EF4444 | 3 |
| claire | CLAIRE | premium | #C4B5FD | 4 |
| mason | MASON | premium | #34D399 | 5 |

---

### 2b. `coach_contexts` table — The taxonomy of every moment a coach speaks

```sql
CREATE TABLE coach_contexts (
  id            TEXT PRIMARY KEY,           -- 'checkin_clutch', 'office_fumble_logged', etc.
  category      TEXT NOT NULL,              -- 'checkin', 'office', 'pfde', 'push', 'tier', 'treat', 'onboarding', 'idle'
  display_name  TEXT NOT NULL,              -- Human-readable: 'Check-in: Clutch'
  description   TEXT,                       -- When this context fires
  
  -- Template variables available in this context
  -- Lines can use {streak}, {days_added}, {treat_name}, etc.
  available_vars JSONB,                     -- ["streak", "days_remaining", "coach_name"]
  
  -- Requirements
  min_lines_per_heat INT DEFAULT 3,         -- Minimum variants needed per heat level
  requires_all_heats BOOLEAN DEFAULT TRUE,  -- Some contexts (onboarding) are heat-independent
  
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2c. `coach_lines` table — Every line every coach can say

```sql
CREATE TABLE coach_lines (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id      TEXT NOT NULL REFERENCES coaches(id),
  context_id    TEXT NOT NULL REFERENCES coach_contexts(id),
  heat_level    INT NOT NULL CHECK (heat_level BETWEEN 1 AND 5),
  variant       INT NOT NULL DEFAULT 1,     -- For randomization (multiple lines per combo)
  
  line_text     TEXT NOT NULL,              -- The actual roast/hype. Supports {var} templates.
  emoji         TEXT,                       -- Optional trailing emoji (overrides coach default)
  
  -- Conditional lines (optional — most lines have no conditions)
  -- Uses shared condition schema — see biteback-systems-architecture.md Section 4a-ii
  conditions    JSONB,                      -- {"min_streak": 7, "tier": "titanium", "day_of_week": "friday"}
  
  -- Management
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  priority      INT DEFAULT 0,             -- Higher = more likely to be selected
  
  -- Analytics (populated by app telemetry)
  times_shown   INT DEFAULT 0,
  share_rate    FLOAT,                     -- % of times this line led to a share card
  
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(coach_id, context_id, heat_level, variant)
);

-- Performance index: this is the hot query path
CREATE INDEX idx_coach_lines_lookup 
  ON coach_lines(coach_id, context_id, heat_level) 
  WHERE active = TRUE;
```

---

### 2d. `coach_assets` table — All visual assets per coach

```sql
CREATE TABLE coach_assets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id      TEXT NOT NULL REFERENCES coaches(id),
  asset_type    TEXT NOT NULL,              -- 'face', 'body', 'share_card_bg', 'notification_icon', 'seasonal'
  asset_key     TEXT NOT NULL,              -- 'face-64', 'body-256', 'halloween-face-64'
  storage_path  TEXT NOT NULL,              -- Supabase Storage path
  public_url    TEXT NOT NULL,              -- CDN URL
  base64        TEXT,                       -- Optional embedded fallback
  width         INT,
  height        INT,
  format        TEXT DEFAULT 'png',         -- 'png', 'webp', 'svg'
  active        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(coach_id, asset_key)
);
```

**Naming convention:** `coach-{id}-{crop}-{expression}-{size}.{format}`
- `coach-bri-face-neutral-64.png` — 64px neutral face for coach bar, bubbles
- `coach-bri-face-hype-128.png` — 128px hype face for clutch moments
- `coach-bri-face-roast-64.png` — 64px roast face for fumble moments
- `coach-bri-body-neutral-256.png` — Full body for bio page
- `coach-bri-body-hype-512.png` — Full body hype for streak share cards
- `coach-bri-body-roast-512.png` — Full body roast for fumble share cards

See `biteback-avatar-regeneration-plan.md` for the complete expression system, generation approach, and context-to-expression mapping.

---

### 2e. Relationships diagram

```
coaches (1) ──────< coach_lines (many)
   │                     │
   │                     └── coach_contexts (1)
   │
   └──────< coach_assets (many)

patients.coach_id ──> coaches.id
patients.heat_level ──> 1-5
```

---

## 3. CONTEXT TAXONOMY — Complete

Every moment a coach speaks, organized by category. This is the `coach_contexts` seed data.

### 3a. CHECK-IN RESPONSES (category: `checkin`)

| Context ID | Fires When | Available Variables | Notes |
|---|---|---|---|
| `checkin_clutch` | Patient reports clutch on any challenge | `{challenge_name}`, `{streak}` | Most common line. Needs high variant count. |
| `checkin_fumble` | Patient reports fumble on any challenge | `{challenge_name}`, `{streak_lost}` | Core roast moment. |
| `checkin_clutch_streak_7` | Clutch and streak hits 7 | `{streak}`, `{tier_name}` | Milestone hype |
| `checkin_clutch_streak_14` | Clutch and streak hits 14 | `{streak}`, `{tier_name}` | |
| `checkin_clutch_streak_30` | Clutch and streak hits 30 | `{streak}`, `{tier_name}` | |
| `checkin_clutch_streak_60` | Clutch and streak hits 60 | `{streak}`, `{tier_name}` | |
| `checkin_clutch_streak_90` | Clutch and streak hits 90 | `{streak}`, `{tier_name}` | |
| `checkin_fumble_after_streak` | Fumble after 7+ day streak | `{streak_lost}`, `{days_added}` | Extra painful roast. |
| `checkin_all_clutch` | All challenges clutched in one session | `{challenge_count}` | Perfect day. |
| `checkin_all_fumble` | All challenges fumbled in one session | `{challenge_count}` | Nuclear roast moment. |

### 3b. REDEMPTION ARC (category: `redemption`)

| Context ID | Fires When | Available Variables | Notes |
|---|---|---|---|
| `redemption_offered` | Player enters fumble spiral, quest offered | `{days_recoverable}` | Coach personality sets the tone for the whole arc. |
| `redemption_day1` | Day 1 of redemption quest completed | `{days_remaining}` | Tough love. |
| `redemption_day2` | Day 2 of redemption quest completed | `{days_remaining}` | Encouragement. |
| `redemption_day3` | Day 3 of redemption quest completed (success) | `{days_recovered}` | Celebration. |
| `redemption_failed` | Fumbled during redemption quest | `{days_lost}` | Disappointed but not cruel. |
| `redemption_skipped` | Player declined redemption quest | — | Light nudge, not guilt trip. |

### 3c. OFFICE EVENTS (category: `office`)

| Context ID | Fires When | Available Variables | Notes |
|---|---|---|---|
| `office_fumble_logged` | Office overrides a self-reported clutch to fumble | `{challenge_name}`, `{days_added}` | Coach reacts to getting caught. Big personality moment. |
| `office_compliance_confirmed` | Office confirms a clutch day | `{challenge_name}` | Validation from authority. Coach hypes it. |
| `office_timeline_pull_forward` | Doctor pulls projected date forward | `{days_removed}`, `{new_date}` | Celebration. "The doctor noticed!" |
| `office_timeline_push_back` | Doctor pushes projected date back | `{days_added}`, `{new_date}`, `{reason}` | More impactful than app penalties. Serious tone. |
| `office_timeline_reset` | Doctor resets baseline (treatment plan change) | `{new_date}`, `{new_duration}` | Neutral/encouraging. Fresh start. |

### 3d. PFDE REACTIONS (category: `pfde`)

| Context ID | Fires When | Available Variables | Notes |
|---|---|---|---|
| `pfde_date_improved` | Daily recalc shows projected date moved earlier | `{days_improved}`, `{projected_date}` | Positive reinforcement. |
| `pfde_date_worsened` | Daily recalc shows projected date moved later | `{days_added}`, `{projected_date}` | Roast or concern depending on heat. |
| `pfde_date_unchanged` | No movement in projected date | `{projected_date}`, `{streak}` | Maintenance acknowledgment. Varies by streak context. |
| `pfde_milestone_halfway` | Patient crosses 50% of treatment | `{days_remaining}` | Halfway hype. |
| `pfde_milestone_final_month` | 30 or fewer days remaining | `{days_remaining}` | Endgame energy. |
| `pfde_milestone_final_week` | 7 or fewer days remaining | `{days_remaining}` | Maximum hype. |

### 3e. PUSH NOTIFICATIONS (category: `push`)

| Context ID | Fires When | Available Variables | Notes |
|---|---|---|---|
| `push_daily_reminder` | Scheduled daily reminder time | `{coach_name}`, `{time}` | Most frequent push. Needs tons of variants. |
| `push_streak_at_risk` | No check-in by evening, active streak | `{streak}`, `{hours_left}` | Urgency. |
| `push_fumble_roast` | After a fumble, delayed follow-up | `{challenge_name}`, `{days_added}` | Delayed burn. |
| `push_streak_milestone` | Streak hits 7/14/30/60/90 | `{streak}`, `{tier_name}` | Celebration push. |
| `push_tier_up` | Player tiers up | `{new_tier}`, `{old_tier}` | |
| `push_treat_unlocked` | Treat milestone reached | `{treat_name}` | |
| `push_treat_fulfilled` | Office marks treat as fulfilled | `{treat_name}` | |
| `push_leaderboard_overtaken` | Another player passed them | `{rival_nickname}`, `{new_rank}` | Competitive fire. |
| `push_inactive_3day` | No check-in for 3 days | `{days_missed}` | Concern, not anger. |
| `push_inactive_7day` | No check-in for 7 days | `{days_missed}` | Escalated concern. Coach-appropriate. |
| `push_welcome_back` | First check-in after 3+ day gap | `{days_missed}` | Relief + light roast. |

### 3f. TIER TRANSITIONS (category: `tier`)

| Context ID | Fires When | Available Variables | Notes |
|---|---|---|---|
| `tier_up_wire_warrior` | Hit 3-day streak | `{tier_name}` | First real achievement. |
| `tier_up_elastic_elite` | Hit 7-day streak | `{tier_name}` | |
| `tier_up_retainer_royalty` | Hit 14-day streak | `{tier_name}` | |
| `tier_up_smile_soldier` | Hit 30-day streak | `{tier_name}` | |
| `tier_up_arch_nemesis` | Hit 60-day streak | `{tier_name}` | |
| `tier_up_titanium` | Hit 90-day streak | `{tier_name}` | Maximum prestige. Coaches go all out. |
| `tier_down` | Streak broken, tier drops | `{old_tier}`, `{new_tier}` | Only on significant drops. Not every fumble. |

### 3g. TREATS (category: `treat`)

| Context ID | Fires When | Available Variables | Notes |
|---|---|---|---|
| `treat_progress_update` | Check-in moves treat progress ring | `{treat_name}`, `{progress_pct}` | Motivation nudge. |
| `treat_unlocked` | Patient hits treat milestone | `{treat_name}`, `{treat_description}` | Celebration + tell them to claim at office. |
| `treat_claimed` | Office marks treat as fulfilled | `{treat_name}` | Post-reward acknowledgment. |

### 3h. ONBOARDING (category: `onboarding`)

| Context ID | Fires When | Available Variables | Notes |
|---|---|---|---|
| `onboarding_welcome` | Coach selected, first appearance | `{patient_nickname}` | First impression line. Must nail the personality. |
| `onboarding_countdown_reveal` | Step 8 countdown reveal | `{days_remaining}` | Coach reacts to the number. |
| `onboarding_first_checkin_intro` | Step 10 first check-in | `{challenge_name}` | Sets the tone for daily check-ins. |
| `onboarding_first_clutch` | First ever clutch | `{challenge_name}` | Extra encouraging. |
| `onboarding_first_fumble` | First ever fumble | `{challenge_name}` | Gentle regardless of heat setting (overrides heat). |

**Note:** Onboarding contexts are **heat-independent** (`requires_all_heats = FALSE`). The onboarding_first_fumble is always gentle — even at heat 5 — because the relationship hasn't been established yet.

### 3i. IDLE / RETURN (category: `idle`)

| Context ID | Fires When | Available Variables | Notes |
|---|---|---|---|
| `idle_3day` | In-app message after 3 days no check-in | `{days_missed}` | Shown when they open the app. |
| `idle_7day` | In-app message after 7+ days no check-in | `{days_missed}` | |
| `idle_welcome_back` | First check-in after 3+ day absence | `{days_missed}`, `{streak}` | Different from push_welcome_back (this is in-app). |

### 3j. SHARE CARD CAPTIONS (category: `share`)

| Context ID | Fires When | Available Variables | Notes |
|---|---|---|---|
| `share_streak` | Streak milestone share card generated | `{streak}` | Short, punchy, shareable. |
| `share_fumble` | Fumble roast share card generated | `{challenge_name}` | Self-deprecating humor. Drives virality (28% of shares). |
| `share_tier_up` | Tier-up share card generated | `{tier_name}` | Achievement flex. |
| `share_countdown` | Countdown share card generated | `{days_remaining}` | |
| `share_leaderboard` | Leaderboard rank share card generated | `{rank}`, `{practice_name}` | |
| `share_doctor_update` | Doctor update share card generated | `{days_changed}`, `{direction}` | |

### 3k. ACCOUNTABILITY PARTNER (category: `partner`)

| Context ID | Fires When | Available Variables | Notes |
|---|---|---|---|
| `partner_joined` | Accountability partner paired | `{partner_nickname}` | |
| `partner_clutched` | Partner completed a check-in | `{partner_nickname}` | Competitive nudge. |
| `partner_fumbled` | Partner fumbled | `{partner_nickname}` | Schadenfreude or sympathy depending on coach. |
| `partner_streak_passed` | Partner's streak surpassed yours | `{partner_nickname}`, `{partner_streak}` | |

---

### Context Count Summary

| Category | Contexts | Notes |
|---|---|---|
| Check-in | 10 | Core daily loop |
| Redemption | 6 | 3-day arc |
| Office | 5 | B2B integration moments |
| PFDE | 6 | Forecast reactions |
| Push | 11 | Notification copy |
| Tier | 7 | Streak milestones |
| Treat | 3 | Reward loop |
| Onboarding | 5 | First impressions (heat-independent) |
| Idle/Return | 3 | Re-engagement |
| Share Card | 6 | Viral captions |
| Partner | 4 | Social features |
| **TOTAL** | **66** | |

### Lines Per Coach (v1 target)

| Calculation | Count |
|---|---|
| Heat-dependent contexts | 61 |
| × 5 heat levels | 305 combos |
| × 3 minimum variants | **915 lines** |
| + Heat-independent (onboarding: 5 × 3 variants) | **15 lines** |
| **Total per coach** | **~930 lines** |
| **× 5 coaches** | **~4,650 lines total** |

### Practical v1 Priority

You don't need all 4,650 on day one. Prioritize by frequency:

| Priority | Contexts | Why | Lines per coach |
|---|---|---|---|
| **P0 — Launch blockers** | `checkin_clutch`, `checkin_fumble`, `push_daily_reminder`, `onboarding_*` (5) | Daily loop + first experience | ~120 |
| **P1 — Week 1 needed** | `checkin_fumble_after_streak`, `checkin_clutch_streak_7`, `pfde_date_improved`, `pfde_date_worsened`, `redemption_*` (6), `office_fumble_logged` | Streak/PFDE/redemption kick in | ~180 |
| **P2 — Month 1 needed** | All remaining `push_*`, `tier_*`, `treat_*`, `share_*` | Social + notification features | ~350 |
| **P3 — Full coverage** | `partner_*`, `idle_*`, remaining streak milestones, edge cases | Complete system | ~280 |

**Ship with P0 + P1 = ~300 lines per coach, ~1,500 total.** Fill P2-P3 before public launch.

---

## 4. LINE SELECTION ENGINE

The function every component calls. No component ever queries `coach_lines` directly.

```typescript
// types
interface LineRequest {
  coachId: string;
  contextId: string;
  heatLevel: number;        // 1-5
  variables?: Record<string, string | number>;  // {streak: 14, challenge_name: "Rubber Bands"}
  conditions?: Record<string, any>;             // {tier: "titanium", day_of_week: "friday"}
}

interface LineResult {
  lineId: string;
  text: string;             // Interpolated with variables
  emoji?: string;
  coachColor: string;
  coachAvatar: string;
}

// Core function
async function getCoachLine(request: LineRequest): Promise<LineResult> {
  // 1. Query coach_lines for matching (coach_id, context_id, heat_level, active=true)
  // 2. Filter by conditions if any (e.g., min_streak, tier)
  // 3. Weight by priority, avoid recently shown (track in local state)
  // 4. Select one (weighted random)
  // 5. Interpolate {variables} into line_text
  // 6. Log selection for analytics (times_shown++)
  // 7. Return LineResult with coach metadata attached
}
```

**Fallback chain:** If no line matches the exact context + heat + conditions:
1. Try same context + heat, no conditions
2. Try same context, heat ± 1
3. Try category-level fallback (e.g., any `checkin` context)
4. Hardcoded emergency fallback: `"..."` (coach says nothing — this should never happen, but it's better than crashing)

---

## 5. ADDING A NEW COACH — Checklist

When you're ready to add coach #6 (or #7, #8...), here's exactly what you do:

### Database (no code changes)
- [ ] Insert row into `coaches` table (id, name, archetype, colors, tier, personality_prompt, vocabulary)
- [ ] Insert rows into `coach_assets` — minimum: neutral + hype + roast faces at 48/64/128, neutral body at 256/512
- [ ] Insert rows into `coach_lines` — minimum P0 contexts (~120 lines × 5 heats × 3 variants)
- [ ] Upload avatar PNGs to Supabase Storage bucket `coach-assets/`
- [ ] Expression mapping inherits from `coach_expression_map` defaults — no per-coach config needed

### App behavior (automatic)
- [ ] Coach appears in selection UI (sorted by `sort_order`)
- [ ] If `tier = 'premium'`, shows lock icon + PRO badge automatically
- [ ] Coach color theming pulls from `color_primary` / `color_secondary`
- [ ] All line delivery uses `getCoachLine()` — works immediately

### QA only
- [ ] Verify avatar renders in all placements (coach bar, bubbles, bio page, share cards, notifications)
- [ ] Verify line coverage across P0 contexts
- [ ] Verify color contrast on dark + light mode

**Zero code changes. Zero deploys for content. One deploy only if new avatar sizes or placements are needed.**

---

## 6. ADDING A NEW CONTEXT — Checklist

When a new feature needs coach reactions (e.g., "Co-op Shields" in v2):

### Database
- [ ] Insert row into `coach_contexts` (id, category, description, available_vars)
- [ ] Insert lines into `coach_lines` for all 5 coaches × relevant heat levels × 3+ variants

### App code (minimal)
- [ ] Add `getCoachLine({ contextId: 'new_context_id', ... })` call where the feature triggers
- [ ] That's it. The line selection engine handles the rest.

---

## 7. SEASONAL / EVENT CONTENT

The architecture supports time-limited content without code changes:

```sql
-- Add seasonal columns to coach_lines
ALTER TABLE coach_lines ADD COLUMN 
  available_from  DATE,      -- NULL = always available
  available_until DATE;      -- NULL = never expires

-- Halloween lines
INSERT INTO coach_lines (coach_id, context_id, heat_level, variant, line_text, available_from, available_until)
VALUES ('bri', 'checkin_fumble', 3, 99, 'bestie even ghosts wear their retainers 👻', '2026-10-25', '2026-11-01');
```

The line selection engine checks date bounds. When the window passes, lines stop appearing. No cleanup needed.

---

## 8. AI GENERATION UPGRADE PATH

When you're ready to move from pre-written lines to AI-generated responses:

### What stays the same
- Context taxonomy (all 66 contexts)
- `getCoachLine()` interface — every component still calls the same function
- Variables system (`{streak}`, `{days_added}`, etc.)
- Coach color/avatar system

### What changes
- `getCoachLine()` internals: instead of querying `coach_lines` table, it calls an LLM with:
  - The coach's `personality_prompt`
  - The context description + variables
  - The heat level instruction
  - The coach's `vocabulary` (catchphrases, never_says)
  - Recent line history (avoid repetition)
- Pre-written lines become the **fallback** (used when AI is unavailable or rate-limited)
- New table `coach_line_cache` stores generated lines for reuse/review

### `personality_prompt` example (Bri)

```
You are BRI, a Gen Z toxic bestie who roasts her friends about their
orthodontic compliance. You're dramatic, passive-aggressive, and speak
in lowercase with lots of "bestie", "literally", "slay", "the audacity".
You use 💅 emoji frequently. You secretly care deeply but express it
through chaos. You never use clinical language — you say "bands" not
"rubber bands", "braces" not "orthodontic appliances". You're 17 in
energy. Heat level {heat_level}/5 controls your intensity — 1 is gentle
encouragement, 5 is unhinged roasting.
```

---

## 9. ANALYTICS HOOKS

The line selection engine should track these metrics per line:

| Metric | How | Why |
|---|---|---|
| `times_shown` | Increment on selection | Ensure variant rotation |
| `share_rate` | Track if user shares within 60s of seeing line | Find viral lines |
| `followup_clutch_rate` | Did user clutch the next day after seeing this line? | Measure motivational effectiveness |
| `report_rate` | Did user flag/report this line? | Safety — catch lines that land wrong |

Over time this data tells you which lines actually drive compliance vs. which just entertain, and which coaches resonate with which demographics.

---

## 10. CONTENT MANAGEMENT WORKFLOW

### Writing new lines
1. Writer picks a coach + context + heat level
2. Writes 3-5 variants
3. Inserts into `coach_lines` via admin tool or direct SQL
4. Lines go live immediately (or set `active = false` for review first)

### Killing a line
```sql
UPDATE coach_lines SET active = false WHERE id = 'line-uuid';
```
Takes effect on next `getCoachLine()` call. No deploy.

### A/B testing lines
- Add new variant with `priority = 10` (higher than default 0)
- Higher priority lines get selected more often
- Compare `share_rate` and `followup_clutch_rate` between variants
- Promote winners, deactivate losers

### Reviewing coverage gaps
```sql
-- Find contexts with fewer than 3 active variants for any coach + heat combo
SELECT c.id AS coach, cx.id AS context, cl.heat_level, COUNT(*) AS variants
FROM coaches c
CROSS JOIN coach_contexts cx
LEFT JOIN coach_lines cl ON cl.coach_id = c.id AND cl.context_id = cx.id AND cl.active = true
WHERE cx.requires_all_heats = true
GROUP BY c.id, cx.id, cl.heat_level
HAVING COUNT(cl.id) < 3
ORDER BY c.id, cx.id, cl.heat_level;
```

---

## 11. MIGRATION FROM CURRENT STATE

Right now, coach lines are likely hardcoded or in a JSON file in the scaffold. Migration path:

1. Create all four tables (`coaches`, `coach_contexts`, `coach_lines`, `coach_assets`)
2. Seed `coaches` with the 5 existing coaches
3. Seed `coach_contexts` with all 66 contexts
4. Move any existing lines from code/JSON into `coach_lines` rows
5. Upload avatar assets to Supabase Storage, update `coach_assets`
6. Build `getCoachLine()` function
7. Replace all hardcoded coach references in components with `getCoachLine()` calls
8. Delete hardcoded lines from codebase

After step 8, the app has zero knowledge of coach content. Everything is data.
