# Name That Canadian 🍁

A live-hosted trivia game show. Identify famous Canadians (and Canadian icons) through four progressive hints before time runs out.

## Quick Start

1. Open `index.html` in a browser (use a local server or deploy — see below).
2. **Presenter Screen** → drag to projector/TV → fullscreen.
3. **Admin Controller** (`admin.html`) → host controls on laptop.
4. Both tabs sync automatically via BroadcastChannel.

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

## Host Keyboard Shortcuts (Admin / Solo)

| Key | Action |
|-----|--------|
| `Space` | Start / pause timer |
| `N` | Next hint |
| `R` | Reveal answer |
| `←` `→` | Previous / next question |
| `1`–`4` | Soundboard |
| `Enter` | Dismiss round overlay |

## Features

- Dual-screen sync (presenter + admin)
- Solo split-screen mode
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

Static files only — no backend required. Presenter and admin must be on the **same origin** for sync to work.

## Adding Questions

Edit `data/categories.json`. Each question:

```json
{
  "id": 1,
  "roundName": "Round 1: Cultural Icons",
  "roundNum": 1,
  "qNum": 1,
  "canadian": "Name Here",
  "facts": ["Hint 1", "Hint 2", "Hint 3", "Hint 4"],
  "notes": "Host discussion notes.",
  "imageUrl": "https://optional-image.jpg"
}
```

Final round uses `"roundNum": 3`.

## License

MIT — use freely for events, classrooms, and pub nights.
