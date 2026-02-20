# BITEBACK — Coach Avatar Regeneration Plan

**Upgrading from static single-expression avatars to high-res reaction-based avatar system.**

---

## 1. WHY REGENERATE

The current avatars were generated for HTML mockups where the largest display size was ~256px. The production app needs:

- **512px share cards** — current renders may look soft or show artifacts at this size
- **Reaction expressions** — one static face per coach doesn't match the emotional range of 66 contexts
- **Consistent style across all 5 coaches** — regenerating as a batch ensures style cohesion

---

## 2. WHAT TO GENERATE

### 2a. Expressions (5 per coach)

| Expression ID | Emotion | Used In (Context Categories) | Visual Direction |
|---|---|---|---|
| `neutral` | Default resting face | `push` (daily reminder), `idle`, `pfde_date_unchanged`, `onboarding_welcome` | Personality-forward default. Bri = slight smirk. Jay = stone face. Kenji = focused. Claire = raised eyebrow. Mason = grin. |
| `hype` | Excited, celebrating | `checkin_clutch`, `checkin_clutch_streak_*`, `checkin_all_clutch`, `tier_up_*`, `treat_unlocked`, `pfde_date_improved`, `redemption_day3`, `share_streak`, `share_tier_up` | Big energy. Eyes wide, mouth open or big smile. Coach-specific celebration style. |
| `disappointed` | Let down, disapproval | `checkin_fumble`, `tier_down`, `pfde_date_worsened`, `redemption_failed`, `idle_3day`, `idle_7day` | Each coach's version of disappointment. Bri = dramatic eye roll. Jay = flat stare. Kenji = clenched jaw. Claire = pursed lips. Mason = exaggerated sad. |
| `roast` | Savage, smirking | `checkin_fumble_after_streak`, `checkin_all_fumble`, `office_fumble_logged`, `push_fumble_roast`, `share_fumble` | The money expression. Smug, confident, about to destroy you. Peak personality moment. |
| `impressed` | Genuinely proud | `checkin_clutch_streak_60`, `checkin_clutch_streak_90`, `tier_up_titanium`, `pfde_milestone_final_week`, `office_compliance_confirmed` | Reserved for big achievements. Rarer than hype — feels earned. Subtle awe or genuine respect. |

### 2b. Crops (2 per expression)

| Crop | Usage | Source Resolution | Export Sizes |
|---|---|---|---|
| **Face** | Coach bar, dialogue bubbles, notifications, selection UI | 1024×1024px | 48px, 64px, 128px |
| **Body** | Bio page, share cards | 1024×1536px (2:3) | 256px, 512px |

### 2c. Which Expressions Need Body Renders?

Not all 5 expressions need full-body renders. Body images appear in two places:

| Placement | Expression Needed | Why |
|---|---|---|
| Bio page | `neutral` only | Static character showcase — one pose is enough |
| Share cards | `hype`, `roast` | Streak/tier cards use hype body. Fumble cards use roast body. |

**Body render matrix:**

| Coach | `neutral` body | `hype` body | `roast` body | Total bodies |
|---|---|---|---|---|
| Each coach | ✅ | ✅ | ✅ | 3 |
| **5 coaches** | | | | **15 body renders** |

### 2d. Total Asset Count

| Asset Type | Count | Calculation |
|---|---|---|
| Face renders (source) | 25 | 5 expressions × 5 coaches |
| Body renders (source) | 15 | 3 expressions × 5 coaches |
| **Source images total** | **40** | |
| Face exports (sized) | 75 | 25 faces × 3 sizes (48, 64, 128) |
| Body exports (sized) | 30 | 15 bodies × 2 sizes (256, 512) |
| **Export files total** | **105** | |

---

## 3. STYLE SPEC — Locked

Carry forward from existing avatars. Do not deviate.

**Style:** 3D illustrated vinyl toy / Makeship collectible
**Finish:** Bold, matte
**Pose:** Front-facing (face crops), slight angle OK for body
**Personality:** Sassy, personality-forward
**Silhouette:** Each coach must have a distinct, recognizable silhouette
**Background:** Transparent (background-removed PNGs)
**Lighting:** Soft studio lighting, consistent across all coaches
**Resolution:** Generate at 1024px minimum, scale down for exports

---

## 4. PER-COACH EXPRESSION DIRECTION

### BRI (Toxic Bestie — #FF6B9D)

| Expression | Direction |
|---|---|
| `neutral` | Slight smirk, one hand on hip, "I know something you don't" energy |
| `hype` | Both hands up, open mouth smile, TikTok-celebration energy |
| `disappointed` | Dramatic eye roll, hand on chest, "the audacity" |
| `roast` | One eyebrow raised, closed-mouth smirk, head slightly tilted, savage |
| `impressed` | Genuine wide eyes, hands together, "ok I see you bestie" |

### JAY (Mean Older Brother — #64748B)

| Expression | Direction |
|---|---|
| `neutral` | Dead stare, arms crossed, zero effort. The 🗿 face. |
| `hype` | Slight nod, one corner of mouth barely up. Jay's version of excited. |
| `disappointed` | Same dead stare but slower blink energy. Somehow more disappointed than neutral. |
| `roast` | One eyebrow slightly raised. That's it. Devastating. |
| `impressed` | Both eyebrows slightly up. For Jay, this is a standing ovation. |

### KENJI (Anime Rival — #EF4444)

| Expression | Direction |
|---|---|
| `neutral` | Focused, intense eyes, slight frown, arms crossed, ready to fight |
| `hype` | Fist pump, teeth showing, fire in eyes, full anime celebration |
| `disappointed` | Eyes closed, head turned slightly away, "you have failed me" |
| `roast` | Pointing directly at camera, open mouth mid-yell, ALL CAPS energy |
| `impressed` | Genuine shock, wide eyes, taken aback — then a grudging nod of respect |

### CLAIRE (Toxic Overachiever — #7C3AED)

| Expression | Direction |
|---|---|
| `neutral` | Slight smile, glasses adjusted, clipboard or tablet in hand, composed |
| `hype` | Controlled excitement — clapping, polished smile, "the data supports celebration" |
| `disappointed` | Looking over glasses, lips pursed, making a note on her clipboard |
| `roast` | Full raised eyebrow, slight head tilt, "your metrics are tragic" face |
| `impressed` | Glasses slightly lowered, genuine surprise, "statistically significant" energy |

### MASON (Chaotic Class Clown — #34D399)

| Expression | Direction |
|---|---|
| `neutral` | Big goofy grin, relaxed posture, finger guns or peace sign |
| `hype` | Full chaos — both arms up, tongue out, maximum hype man energy |
| `disappointed` | Exaggerated sad face, bottom lip out, puppy eyes, comedic |
| `roast` | Laughing, pointing, can't contain himself, "BRO" energy |
| `impressed` | Jaw dropped, hands on head, genuinely stunned, "NO WAY" |

---

## 5. GENERATION APPROACH

### 5a. Tool: ChatGPT (DALL-E 3) or Midjourney

Use whichever tool generated the original 5 coaches. Consistency with existing style is more important than which tool is used.

### 5b. Prompt Template

Base prompt (adapt per coach + expression):

```
3D illustrated vinyl toy character, Makeship collectible style.
Bold matte finish, front-facing, studio lighting, transparent background.
[COACH DESCRIPTION — physical appearance, outfit, accessories].
Expression: [EXPRESSION DIRECTION from Section 4].
High resolution, clean edges for background removal.
No text, no watermark, no background elements.
```

### 5c. Generation Order

**Batch 1 — Neutral faces + bodies (all 5 coaches)**
Start here because neutral is the baseline. Get style consistency locked across all 5 coaches before adding expressions. These also replace the current static avatars.

**Batch 2 — Hype + Roast faces (all 5 coaches)**
The two most common reaction expressions. Hype covers all clutch/milestone moments. Roast covers all fumble moments. Together with neutral, these three expressions cover ~80% of all coach appearances.

**Batch 3 — Disappointed + Impressed faces (all 5 coaches)**
Lower frequency expressions. Disappointed for fumbles without the roast energy. Impressed for rare big achievements.

**Batch 4 — Hype + Roast bodies (all 5 coaches)**
Full-body versions for share cards. Only needed for the two share card expression states.

### 5d. QA Per Batch

After each batch:
- [ ] All 5 coaches are style-consistent (same lighting, finish, proportion)
- [ ] Expression is clearly distinct from neutral at 48px (smallest render size)
- [ ] Character silhouette is recognizable at 48px
- [ ] Background is fully transparent (no halo artifacts)
- [ ] Colors match coach palette (skin/hair/outfit tones carry across expressions)

---

## 6. POST-PROCESSING

### 6a. Background Removal
If the generation tool doesn't produce clean transparency, use remove.bg or equivalent. Verify no halo/fringe around edges.

### 6b. Export Pipeline

From each 1024px source:

```
source/bri-face-neutral-1024.png
  → exports/coach-bri-face-neutral-48.png
  → exports/coach-bri-face-neutral-64.png
  → exports/coach-bri-face-neutral-128.png

source/bri-body-neutral-1024.png
  → exports/coach-bri-body-neutral-256.png
  → exports/coach-bri-body-neutral-512.png
```

Use sharp, Photoshop, or Figma batch export. Bicubic downscaling. PNG format, optimized.

### 6c. File Naming Convention

Updated from current convention to include expression:

```
coach-{id}-{crop}-{expression}-{size}.png
```

Examples:
- `coach-bri-face-neutral-64.png`
- `coach-bri-face-hype-128.png`
- `coach-kenji-body-roast-512.png`
- `coach-jay-face-disappointed-48.png`

---

## 7. ARCHITECTURE UPDATES

### 7a. `coach_assets` table — No schema change needed

The existing schema handles this perfectly:

```sql
-- asset_type distinguishes face vs body
-- asset_key now includes expression
INSERT INTO coach_assets (coach_id, asset_type, asset_key, storage_path, public_url, width, height)
VALUES
  ('bri', 'face', 'face-neutral-64',  'coach-assets/coach-bri-face-neutral-64.png',  '...', 64, 64),
  ('bri', 'face', 'face-hype-64',     'coach-assets/coach-bri-face-hype-64.png',     '...', 64, 64),
  ('bri', 'face', 'face-roast-128',   'coach-assets/coach-bri-face-roast-128.png',   '...', 128, 128),
  ('bri', 'body', 'body-neutral-512', 'coach-assets/coach-bri-body-neutral-512.png', '...', 512, 768);
```

### 7b. Expression-to-Context Mapping

Add a new table that maps context categories to expressions:

```sql
CREATE TABLE coach_expression_map (
  id              TEXT PRIMARY KEY,           -- matches coach_contexts.category
  expression_id   TEXT NOT NULL,              -- 'neutral', 'hype', 'disappointed', 'roast', 'impressed'
  override_contexts JSONB                    -- optional per-context overrides: {"checkin_all_fumble": "roast"}
);
```

**v1 seed data:**

| Category | Default Expression | Context Overrides |
|---|---|---|
| `checkin` | `hype` | `checkin_fumble` → `disappointed`, `checkin_fumble_after_streak` → `roast`, `checkin_all_fumble` → `roast` |
| `redemption` | `disappointed` | `redemption_day3` → `hype`, `redemption_offered` → `neutral` |
| `office` | `neutral` | `office_fumble_logged` → `roast`, `office_compliance_confirmed` → `hype`, `office_timeline_pull_forward` → `hype` |
| `pfde` | `neutral` | `pfde_date_improved` → `hype`, `pfde_date_worsened` → `disappointed` |
| `push` | `neutral` | `push_streak_milestone` → `hype`, `push_fumble_roast` → `roast`, `push_treat_unlocked` → `hype` |
| `tier` | `hype` | `tier_down` → `disappointed`, `tier_up_titanium` → `impressed` |
| `treat` | `hype` | — |
| `onboarding` | `neutral` | `onboarding_first_clutch` → `hype` |
| `idle` | `disappointed` | `idle_welcome_back` → `hype` |
| `share` | `hype` | `share_fumble` → `roast` |
| `partner` | `neutral` | `partner_streak_passed` → `roast` |

### 7c. `getCoachLine()` Update

The `LineResult` interface gets an expression-aware avatar:

```typescript
interface LineResult {
  lineId: string;
  text: string;
  emoji?: string;
  coachColor: string;
  coachAvatar: string;       // Now returns expression-specific avatar URL
  coachAvatarExpression: string;  // 'neutral', 'hype', 'disappointed', 'roast', 'impressed'
}
```

The function resolves the expression from `coach_expression_map` using the context's category, checks for per-context overrides, then looks up the correct asset from `coach_assets`.

**Fallback chain for expressions:**
1. Per-context override in `coach_expression_map.override_contexts`
2. Category default in `coach_expression_map.expression_id`
3. `neutral` (always exists)

---

## 8. TIMELINE ESTIMATE

| Batch | What | Images | Est. Time |
|---|---|---|---|
| Batch 1 | Neutral faces + bodies (5 coaches) | 10 source → 25 exports | 2–3 hours (generation + QA + export) |
| Batch 2 | Hype + Roast faces (5 coaches) | 10 source → 30 exports | 2–3 hours |
| Batch 3 | Disappointed + Impressed faces (5 coaches) | 10 source → 30 exports | 2–3 hours |
| Batch 4 | Hype + Roast bodies (5 coaches) | 10 source → 20 exports | 2–3 hours |
| **Total** | | **40 source → 105 exports** | **8–12 hours** |

This can be spread across multiple sessions. Batch 1 + 2 cover launch needs. Batches 3 + 4 can come before public launch.

---

## 9. PRIORITY FOR BUILD

**P0 — Launch blockers (Batch 1 + 2):**
- Neutral face (all sizes) — default everywhere
- Hype face (all sizes) — clutch moments
- Roast face (all sizes) — fumble moments
- Neutral body (all sizes) — bio page, default share cards

**P1 — Before public launch (Batch 3 + 4):**
- Disappointed + Impressed faces
- Hype + Roast bodies for share cards

**P2 — Post-launch (seasonal):**
- Holiday expressions (Santa hat, etc.)
- Uses the existing seasonal content system (`available_from`/`available_until` on `coach_assets`)

---

## 10. ASSET TRACKING CHECKLIST

Check off each asset as it's generated, background-removed, and exported. This is the complete list of 40 source images.

### Batch 1 — Neutral (P0)

| Coach | Face 1024 | Face 48 | Face 64 | Face 128 | Body 1024 | Body 256 | Body 512 |
|---|---|---|---|---|---|---|---|
| BRI neutral | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| JAY neutral | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| KENJI neutral | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CLAIRE neutral | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| MASON neutral | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

### Batch 2 — Hype + Roast Faces (P0)

| Coach | Hype 1024 | Hype 48 | Hype 64 | Hype 128 | Roast 1024 | Roast 48 | Roast 64 | Roast 128 |
|---|---|---|---|---|---|---|---|---|
| BRI | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| JAY | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| KENJI | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CLAIRE | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| MASON | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

### Batch 3 — Disappointed + Impressed Faces (P1)

| Coach | Disappointed 1024 | Dis. 48 | Dis. 64 | Dis. 128 | Impressed 1024 | Imp. 48 | Imp. 64 | Imp. 128 |
|---|---|---|---|---|---|---|---|---|
| BRI | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| JAY | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| KENJI | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CLAIRE | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| MASON | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

### Batch 4 — Hype + Roast Bodies (P1)

| Coach | Hype Body 1024 | Hype 256 | Hype 512 | Roast Body 1024 | Roast 256 | Roast 512 |
|---|---|---|---|---|---|---|
| BRI | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| JAY | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| KENJI | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CLAIRE | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| MASON | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

### QA Checklist (run after each batch)

- [ ] All 5 coaches style-consistent (lighting, finish, proportion)
- [ ] Expression clearly distinct from neutral at 48px
- [ ] Character silhouette recognizable at 48px
- [ ] Background fully transparent (no halo)
- [ ] Colors match coach palette across expressions
- [ ] Uploaded to Supabase Storage `coach-assets/` bucket
- [ ] `coach_assets` table rows inserted

### Adding a New Coach's Avatars

When coach #6 is added, copy any coach's section from each batch above and fill in:
1. Generate neutral face + body first (match existing style)
2. Generate hype + roast faces
3. Generate disappointed + impressed faces
4. Generate hype + roast bodies
5. Export all sizes, upload, insert `coach_assets` rows
