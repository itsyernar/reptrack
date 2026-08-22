# RepTrack

A mobile-friendly gym progress tracker built as a private Progressive Web App.

## Included

- English and Russian interface with an instant language switch in the header and a saved preference in Settings
- Localized routines, muscle groups, exercise names, PR notes, dates, guidance, confirmations, and status messages
- Stable canonical exercise keys so changing language does not break workout history or PR calculations
- Personalized PPL split:
  - Tuesday: Push · Chest + Triceps
  - Thursday: Pull · Back + Biceps + lateral raises
  - Saturday: Legs + Shoulders + weighted pull-ups
- Imported reference PR library from the 14 July 2026 training notes
- Hard, Hard PR, Easy, and transition-week calendar through 4 October 2026
- Personalized progression rules: +2.5 kg upper body and +5 kg lower body after a clean 3 × 12
- Workout logging by set, weight, reps, and RIR
- Session duration, readiness, and notes
- Workout history and progress charts
- Estimated 1RM tracking when reps are available
- Heaviest-weight baselines from imported PRs without invented repetitions
- Weekly training volume and bodyweight tracking
- JSON export/import, local browser storage, and offline support

## Language behavior

Use the EN/RU selector in the header for an immediate change, or select the language in Settings and save preferences. The selected language is stored in the local backup. Exercise identifiers remain language-neutral internally, so the same workout history appears in both languages.

## Data behavior

The imported PR list is reference data, not fabricated workout history. A PR with an explicit rep count can establish an estimated-1RM baseline. Weight-only records appear in the reference library and the heaviest-weight progress view.

Existing browser data is preserved while the new language preference defaults to English until changed.

## Run locally

Open `index.html` in a desktop browser.

For full PWA installation and offline behavior, serve the folder over HTTPS or localhost.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Put it on your iPhone

1. Enable GitHub Pages or upload the folder to another HTTPS host.
2. Open the hosted URL in Safari.
3. Tap Share.
4. Tap **Add to Home Screen**.

## Privacy

Workout data is stored in the browser on the current device. Use **Settings → Export data** before changing phones, browsers, or clearing website data.

