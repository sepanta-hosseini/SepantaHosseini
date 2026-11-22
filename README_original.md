# SCORPION — Interactive AI Identity Card

A single-page bilingual digital business card built with HTML, CSS, and vanilla JavaScript. Includes theme switch, Persian/English, canvas particles, cursor spotlight, card tilt, magnetic contact tiles, animated Saturn-like portrait rings, scanner, clock, touch trail, click waves, scorpion mascot Easter egg, Konami Code, and downloadable VCard.

## Personalize
1. Add Sepanta's portrait as `assets/sepanta.jpg` (square crop works best).
2. Edit `js/profile.js` with real phone, Telegram, Instagram, GitHub and email values.
3. Update the text in `index.html` if desired.

## Run locally
Because the project loads a profile script locally, open it through a local server rather than `file://`:

```bash
cd scorpion-card
python3 -m http.server 8000
```
Then visit http://localhost:8000

## Notes
- No server-side code and no contact information is sent to a backend.
- Theme and language preference are stored in localStorage.
- Five clicks on the scorpion unlock a small hidden mode.
- Konami Code: Up Up Down Down Left Right Left Right B A.
- Accessibility: reduced-motion disables most motion effects.
