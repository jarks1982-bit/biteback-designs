# BITEBACK — Eleventy Design System

## What Is This?

This is your BiteBack design mockup system, rebuilt with [Eleventy (11ty)](https://www.11ty.dev/) — a simple static site generator. Instead of 40 standalone HTML files that each duplicate the same CSS, fonts, phone frames, and base64 avatars, you now have:

- **One CSS file** (`biteback.css`) with every design token
- **Reusable layouts** (phone frame, onboarding, dashboard) that wrap your content
- **Reusable partials** (tab bar, status bar, coach bubble, challenge card) you `{% include %}` anywhere
- **Data files** (`coaches.json`, `tokens.json`) that power loops and avoid duplication
- **Tiny screen files** (~50-100 lines each) that contain only the unique content for that screen

Eleventy takes all of this and builds it into a `_site/` folder of plain HTML files — exactly like your current ones, but generated from clean, modular source files.

---

## Quick Start (5 Minutes)

### 1. Install Node.js (if you don't have it)
```bash
# Check if you have it
node --version

# If not, download from https://nodejs.org (LTS version)
# Or on Mac with Homebrew:
brew install node
```

### 2. Install Dependencies
```bash
cd biteback-designs
npm install
```
This installs Eleventy. That's the only dependency.

### 3. Run the Dev Server
```bash
npm run dev
```
This does two things:
- Builds all your `.njk` files into HTML in a `_site/` folder
- Starts a local server at `http://localhost:8080` with **live reload**

Open that URL in your browser. You'll see the design gallery.

### 4. Edit and See Changes Instantly
Change any file → save → browser auto-refreshes. That's it.

### 5. Build for Production
```bash
npm run build
```
Generates the `_site/` folder. Every file in there is a standalone HTML page you can open in any browser or deploy anywhere.

---

## How Eleventy Works (The Mental Model)

Think of it like a mail merge:

```
DATA (coaches.json)     +     TEMPLATE (05-coach.njk)     =     HTML output
─────────────────             ─────────────────────              ────────────
{ "bri": { ... },             {% for key, c in coaches %}        <div>Bri...</div>
  "jay": { ... },              <div>{{ c.name }}</div>           <div>Jay...</div>
  "kenji": { ... } }          {% endfor %}                      <div>Kenji...</div>
```

### The 4 Key Concepts

**1. Layouts** (`src/_layouts/`)
Templates that wrap your content. Think of them as reusable page shells.

```
base.njk          ← bare HTML skeleton (head, body)
  └── phone.njk   ← adds phone frame, tab bar, status bar, coach header
  └── onboarding.njk ← adds step dots, back button, CTA button
  └── dashboard.njk  ← adds sidebar navigation
```

Layouts chain: `onboarding.njk` extends `base.njk`. Your screen file says `layout: onboarding.njk` and gets both.

**2. Front Matter** (the `---` block at the top of each file)
YAML metadata that configures the layout:

```yaml
---
layout: phone.njk       # Which layout to use
title: Home              # Page title
theme: dark              # dark or light
coach: bri               # Which coach to show
activeTab: home          # Which tab is active
showCoachHeader: true    # Show coach bar at top
heatLevel: 3             # How many heat dots to fill
---
```

Change `coach: bri` to `coach: kenji` → the whole page updates with Kenji's colors and avatar.

**3. Partials** (`src/_includes/partials/`)
Reusable chunks of HTML you include anywhere:

```njk
{# Set variables, then include the partial #}
{% set challengeName = "Aligner Wear" %}
{% set challengeStreak = 12 %}
{% include "partials/challenge-card.njk" %}
```

One partial, used in every screen that needs a challenge card. Change the card design once → every screen updates.

**4. Data Files** (`src/_data/`)
JSON files that are automatically available in every template:

```
coaches.json  → {{ coaches.bri.name }}         → "BRI"
              → {{ coaches.bri.color.dark }}    → "#FF6B9D"
              → {{ coaches.bri.sampleRoast }}   → "bestie you forgot..."

tokens.json   → {{ tokens.dark.clutch }}        → "#BFFF00"
              → {{ tokens.tiers[0].name }}       → "Snagglefang"

site.json     → {{ site.title }}                → "BiteBack Designs"
```

---

## Project Structure

```
biteback-designs/
├── .eleventy.js              ← Config file (dirs, plugins, shortcodes)
├── package.json              ← Dependencies (just Eleventy)
├── src/                      ← SOURCE FILES (you edit these)
│   ├── _data/                ← Global data (available in all templates)
│   │   ├── coaches.json      ← All 5 coaches: names, colors, roasts, avatars
│   │   ├── tokens.json       ← Design tokens: colors, tiers, heat levels
│   │   └── site.json         ← Site-wide metadata
│   ├── _includes/            ← Partials (reusable HTML chunks)
│   │   └── partials/
│   │       ├── status-bar.njk
│   │       ├── tab-bar.njk
│   │       ├── coach-bubble.njk
│   │       └── challenge-card.njk
│   ├── _layouts/             ← Page layouts (shells that wrap content)
│   │   ├── base.njk          ← HTML skeleton
│   │   ├── phone.njk         ← Phone frame + tab bar + coach header
│   │   ├── onboarding.njk    ← Step dots + back button + CTA
│   │   └── dashboard.njk     ← Sidebar nav for practice dashboard
│   ├── assets/               ← Static files (copied as-is)
│   │   ├── css/
│   │   │   └── biteback.css  ← THE design system (one file, all tokens)
│   │   └── img/
│   │       └── avatars/      ← Coach PNGs go here (not base64!)
│   ├── screens/              ← ACTUAL SCREEN FILES (your content)
│   │   ├── onboarding/
│   │   │   ├── 01-splash.njk
│   │   │   └── 05-coach.njk
│   │   ├── app/
│   │   │   └── home.njk
│   │   └── dashboard/        ← (future: dashboard pages)
│   └── index.njk             ← Design gallery / homepage
└── _site/                    ← BUILD OUTPUT (generated, don't edit)
```

---

## How to Migrate Your Existing HTML Files

### Step 1: Extract Avatar Images

Your current HTML files have coach avatars as base64 strings embedded inline. Extract them:

1. Open `biteback-coach-preview.html` in a browser
2. Right-click each coach avatar → "Save Image As..."
3. Save as: `src/assets/img/avatars/bri-face.png`, `jay-face.png`, etc.
4. Do the same for full-body versions from `biteback-final-roster.html`

Now every screen references `/assets/img/avatars/bri-face.png` instead of a 80KB base64 string.

### Step 2: Extract Tab Bar SVGs

1. Open `biteback-3d-tabs-v2.html`
2. Copy each SVG icon from the source
3. Paste into `src/_includes/partials/tab-bar.njk` (replacing the placeholder SVGs)

### Step 3: Migrate a Screen

Take any existing HTML file. Here's the process:

**Before (standalone HTML — 800+ lines):**
```html
<!DOCTYPE html>
<html>
<head>
  <!-- 50 lines of fonts, meta tags -->
  <style>
    /* 200 lines of duplicated CSS */
  </style>
</head>
<body>
  <!-- 30 lines of phone frame wrapper -->
  <!-- 20 lines of status bar -->
  <!-- 15 lines of coach header -->

  <!-- === YOUR ACTUAL CONTENT (maybe 100 lines) === -->

  <!-- 40 lines of tab bar -->
  <!-- 80KB of base64 avatar -->
</body>
</html>
```

**After (Eleventy — ~50 lines):**
```njk
---
layout: phone.njk
title: Leaderboard
theme: dark
coach: bri
activeTab: rank
---

<style>
  /* Only styles unique to THIS screen */
</style>

<!-- Just the content. Phone frame, tab bar, CSS, fonts = automatic -->
```

### Step 4: Repeat for Each Screen

Work through the screens one at a time. The gallery index page (`src/index.njk`) tracks what's migrated vs TODO.

---

## Nunjucks Cheat Sheet

Nunjucks is the templating language (file extension `.njk`). Here's everything you'll use:

### Variables
```njk
{{ coaches.bri.name }}              → BRI
{{ tokens.dark.clutch }}            → #BFFF00
{{ title }}                         → (from front matter)
```

### Conditionals
```njk
{% if coach == "bri" %}
  Pink theme!
{% elif coach == "kenji" %}
  Red theme!
{% else %}
  Default theme
{% endif %}
```

### Loops
```njk
{% for key, c in coaches %}
  <div style="color: {{ c.color.dark }}">{{ c.name }}</div>
{% endfor %}

{% for tier in tokens.tiers %}
  <span>{{ tier.name }} — {{ tier.days }} days</span>
{% endfor %}
```

### Includes (partials)
```njk
{% set challengeName = "Aligner Wear" %}
{% set challengeStreak = 12 %}
{% include "partials/challenge-card.njk" %}
```

### Filters
```njk
{{ "hello" | upper }}               → HELLO
{{ coaches | length }}              → 5
{{ "bri" | coachGradient }}         → linear-gradient(135deg, #FF6B9D, #FF2E6C)
```

### Comments
```njk
{# This is a comment — won't appear in output HTML #}
```

### Raw (output Nunjucks syntax without processing)
```njk
{% raw %}
  This {{ won't }} be processed
{% endraw %}
```

---

## Common Tasks

### Add a New Screen
1. Create `src/screens/app/leaderboard.njk`
2. Add front matter with the layout you want
3. Write only the unique content
4. Add a link to it in `src/index.njk`
5. Run `npm run dev` — it's live

### Add a New Coach
1. Add their data to `src/_data/coaches.json`
2. Add their avatar PNGs to `src/assets/img/avatars/`
3. Every screen that loops over `coaches` automatically includes them

### Change a Design Token
1. Edit `src/assets/css/biteback.css`
2. Change the CSS variable (e.g., `--clutch: #BFFF00`)
3. Every screen updates

### Create a Dark + Light Mode Pair
```njk
{# Dark version #}
---
layout: phone.njk
theme: dark
---

{# Light version — same file, different theme #}
---
layout: phone.njk
theme: light
---
```

Or show both side by side:
```njk
<div class="side-by-side">
  <div class="phone-frame" data-theme="dark">...</div>
  <div class="phone-frame" data-theme="light">...</div>
</div>
```

---

## What You Gain vs Standalone HTML

| Metric | Before (40 HTML files) | After (Eleventy) |
|--------|----------------------|-------------------|
| CSS duplication | 200 lines × 40 files | 1 file, 0 duplication |
| Avatar storage | ~80KB base64 × N files | 1 PNG file, referenced |
| Change coach color | Find/replace across 40 files | Change 1 line in coaches.json |
| Add a new screen | Copy 800-line file, edit | Write ~50 lines of content |
| Tab bar update | Edit 40 files | Edit 1 partial |
| Build step required | No | Yes (`npm run dev`) |
| Browser-openable output | Yes | Yes (`_site/` folder) |

---

## FAQ

**Q: Can I still open files directly in a browser?**
A: The source `.njk` files — no. But after `npm run build`, every file in `_site/` is plain HTML you can open directly. Same result, cleaner source.

**Q: Do I need to learn Nunjucks?**
A: The cheat sheet above covers 95% of what you'll use. It's `{{ variable }}` for output, `{% if %}` for logic, `{% include %}` for partials. That's basically it.

**Q: What if I need a one-off standalone HTML?**
A: Put a plain `.html` file in `src/` — Eleventy passes it through unchanged. You can mix and match.

**Q: Where do the files end up?**
A: `src/screens/app/home.njk` → `_site/screens/app/home/index.html` (accessible at `/screens/app/home/`)

**Q: Can I use this with my React Native app?**
A: These are design mockups only. Your production app is React Native (Expo) + Next.js — completely separate. This Eleventy site replaces your design reference files, not your production code.
