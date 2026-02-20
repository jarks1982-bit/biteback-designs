# BITEBACK — Coach Avatar Regeneration Plan

**Upgrading from static single-expression avatars to high-res reaction-based avatar system.**

---

## 1. WHY REGENERATE

The original avatars were generated in a 3D vinyl toy style for HTML mockups. After exploration, the style direction has been **pivoted to 2D illustrated sketch style** (generated in Midjourney) which better fits:

- **Teen personality** — the sketchy, exaggerated style reads as more relatable and less corporate than 3D renders
- **Expression range** — 2D illustration handles facial expression variety more naturally across 5 distinct emotions
- **512px share cards** — the bold line work and saturated colors hold up better at large sizes than 3D renders
- **Consistent batch generation** — Midjourney produces more reliable style consistency across a batch than 3D prompts

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

**Updated from original 3D vinyl toy direction to 2D illustrated sketch style based on Midjourney exploration.**

**Style:** 2D illustrated cartoon character, exaggerated proportions, sketch-style line work
**Proportions:** Big head, expressive oversized eyes, thin body/legs — cartoon chibi-adjacent but edgier
**Line work:** Visible sketchy outlines with slight roughness, not clean vector. Adds personality.
**Color:** Bold, saturated fills with minimal shading. Each coach's palette is immediately recognizable.
**Personality:** Sassy, attitude-forward, teen energy. Every pose tells you who this character is.
**Silhouette:** Each coach must have a distinct, instantly recognizable silhouette at 48px
**Background:** White or transparent (background-removed PNGs for production)
**Clothing:** Modern teen fashion — hoodies, sneakers, accessories that match personality
**Resolution:** Generate at 1024px minimum, scale down for exports
**Reference:** Bri reference image (Midjourney) — pink hoodie with star, blue/pink messy ponytail, gold hoops, black leggings, attitude-forward stance, hands in hoodie pocket

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

### 5a. Tool: Midjourney

Midjourney produced the locked style reference (Bri). All coaches must be generated in Midjourney to maintain style consistency. Use `--style raw` to reduce artistic interpretation and stay close to the prompt.

### 5b. Prompt Template

Base prompt (adapt per coach + expression):

```
Full body cartoon character illustration, teenage [GENDER], [COACH DESCRIPTION — physical appearance, outfit, accessories, personality cues].
Expression: [EXPRESSION DIRECTION from Section 4].
Exaggerated proportions, big expressive head, thin legs, sketchy line work, bold saturated colors, white background.
Modern teen fashion, attitude-forward pose, sassy personality.
No text, no watermark.
--style raw --ar 2:3
```

**Face crop variant** (for 1:1 face renders):
```
[Same prompt but replace "Full body" with "Portrait close-up, head and shoulders"]
--style raw --ar 1:1
```

### 5b-ii. Per-Coach Physical Description Seeds

Use these as the `[COACH DESCRIPTION]` in prompts. Adapt per expression.

**BRI:** Teenage girl, blue hair with pink streaks in messy ponytail, gold hoop earrings, oversized pink hoodie with star, black leggings, pink-accent sneakers. Sassy, hands-in-pocket energy.

**JAY:** Teenage boy, short dark hair buzzed on sides, deadpan expression, gray hoodie with hood half-up, dark jeans, white sneakers. Arms crossed, zero-effort cool energy.

**KENJI:** Teenage boy, spiky black hair with red tips, intense eyes, red track jacket with black stripe, black joggers, red high-tops. Athletic, ready-to-fight stance.

**CLAIRE:** Teenage girl, neat dark hair with purple highlights in a low ponytail, round glasses, purple cardigan over white shirt, plaid skirt, oxford shoes, holds tablet or clipboard. Composed, judging-you energy.

**MASON:** Teenage boy, messy curly brown hair, big goofy grin, green graphic tee with funny print, cargo shorts, mismatched socks, beat-up sneakers. Relaxed, chaotic energy, finger guns or peace sign.

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
- [ ] All 5 coaches are style-consistent (same line weight, proportion ratio, color saturation)
- [ ] Expression is clearly distinct from neutral at 48px (smallest render size)
- [ ] Character silhouette is recognizable at 48px
- [ ] Background is cleanly removable (no complex overlap with character edges)
- [ ] Colors match coach palette (hair/outfit tones carry across expressions)
- [ ] Proportions match reference (big head, thin legs, exaggerated features)

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
