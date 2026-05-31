# Name That Canadian 🍁

A live-hosted trivia game show. Identify famous Canadians (and Canadian icons) through four progressive hints before time runs out.

## Quick Start

**For players / audience** — share the main link:
- `https://name-that-canadian.vercel.app/` (or `index.html`)

Open it on a TV, projector, or cast to a screen. This page shows only the game — hints, timer, reveals, and scoreboard.

**For hosts** — use the host link on your phone or laptop:
- `https://name-that-canadian.vercel.app/host.html`
- Legacy alias: `admin.html` redirects here

Run rounds from the host page. Changes sync live to the audience display (same browser origin, two tabs or two devices on the same Wi‑Fi).

### Local development

```bash
npx serve .
# or: python -m http.server 8080
```

Then visit `http://localhost:3000` for the show and `http://localhost:3000/host.html` for controls.

## Game Structure

Each category pack has **11 questions**:
- Round 1: 5 questions
- Round 2: 5 questions
- Final Showstopper: 1 question

## Category Packs

| Pack | Key |
|------|-----|
| Celebrity Stars | `celebrities` |
| Historical Legends | `historical_legends` |
| Culture & Landmarks | `culture_geography` |
| Sports Heroes | `sports_heroes` |
| Science & Innovation | `science_innovation` |

Questions live in [`data/categories.json`](data/categories.json) — edit that file to add or change content.

## Host Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start / pause timer |
| `N` | Next hint |
| `R` | Reveal answer |
| `←` `→` | Previous / next question |
| `1`–`4` | Soundboard |
| `Enter` | Dismiss round overlay |

## Features

- Separate show and host URLs
- Live sync between host controls and audience display
- Configurable timer (30 / 40 / 60 s)
- Team scoreboard with quick award buttons
- Round transition screens + final podium
- Shuffle question order per round
- Three visual themes + large text mode
- PWA / offline shell (installable on show page)
- Web Audio soundboard (plays on the display)

## Deploy to Vercel

```bash
vercel
```

Static files only — no backend required. Show and host must be on the **same origin** for sync to work.

## Adding Questions

Edit `data/categories.json`. Each question:

```json
{
  "id": 1,
  "roundName": "Round 1: Cultural Icons",
  "roundNum": 1,
  "qNum": 1,
  "canadian": "Terry Fox",
  "facts": ["Fact 1…", "Fact 2…", "Fact 3…", "Fact 4…"],
  "notes": "Host talking points…"
}
```

Optional `imageUrl` overrides Wikipedia lookup for the reveal screen.
