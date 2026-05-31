# Name That Canadian 🍁

A mobile-first live trivia game show. Identify famous Canadians (and Canadian icons) through four progressive hints before time runs out — all from one phone or tablet.

## Quick Start

1. Open the app in a browser (use a local server or deploy — see below).
2. Start on the **Control** tab — pick a category, add teams, and run each round.
3. Tap **Show** to flip the screen toward your audience between hints and reveals.
4. Use the sticky bottom dock for quick round controls while hosting.

### Local development

```bash
npx serve .
# or: python -m http.server 8080
```

Then visit `http://localhost:3000` (or `:8080`).

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

## Host Keyboard Shortcuts (optional, with external keyboard)

| Key | Action |
|-----|--------|
| `Space` | Start / pause timer |
| `N` | Next hint |
| `R` | Reveal answer |
| `←` `→` | Previous / next question |
| `1`–`4` | Soundboard |
| `Enter` | Dismiss round overlay |

## Features

- Single-device mobile workflow (Control + Show tabs)
- Configurable timer (30 / 40 / 60 s)
- Team scoreboard with quick award buttons
- Round transition screens + final podium
- Shuffle question order per round
- Three visual themes + large text mode
- PWA / offline shell (installable)
- Web Audio soundboard

## Deploy to Vercel

```bash
vercel
```

Static files only — no backend required.

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
