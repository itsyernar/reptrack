# RepTrack

A mobile-friendly gym progress tracker built as a private Progressive Web App.

## Included

- Preloaded split:
  - Tuesday: Chest + Triceps
  - Thursday: Legs + Shoulders
  - Saturday: Back + Biceps
- Workout logging by set, weight, reps, and RIR
- Session duration, readiness, and notes
- Workout history
- Exercise progress charts
- Estimated 1RM tracking
- Personal-record tracking
- Weekly training volume
- Bodyweight tracking
- JSON export/import
- Local browser storage
- Offline support after installation

## Run locally

Open `index.html` in a desktop browser.

For full PWA installation and offline behavior, serve the folder over HTTPS or localhost.

Example with Python:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Put it on your iPhone

1. Upload this folder to GitHub Pages, Netlify, or Vercel.
2. Open the hosted URL in Safari.
3. Tap Share.
4. Tap **Add to Home Screen**.

## Privacy

Workout data is stored in the browser on the current device. Use **Settings → Export data** before changing phones, browsers, or clearing website data.
