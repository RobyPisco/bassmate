# Bassmate 🎸

> **Free interactive fretboard explorer for bass guitar** — works in the browser, installs as a PWA, no sign-up required.

**[→ Open the app](https://bassmate.it)** · [Donate ☕](https://bassmate.it/donate.html) · [Report a bug](https://github.com/RobyPisco/bassmate/issues)

---

## What is Bassmate?

A browser-based practice tool built by a bassist, for bassists. Pick a root note and a scale, and the fretboard lights up instantly. Play the audio, run the quiz, tap the metronome — all without leaving your browser, even offline.

No account. No ads. No framework. Just a single HTML/CSS/JS app that loads in under a second.

---

## Features

| Feature | Details |
|---|---|
| **Interactive fretboard** | 4 / 5 / 6 strings, frets 0–24, zoomable |
| **Scale & arpeggio generator** | 20+ types: Major, Minor, Modes, Blues, Harmonic, Melodic, Pentatonic… |
| **Alternate tunings** | Standard, Drop D, Drop A, Open G/E, and more |
| **Audio playback** | Hear the scale ascending/descending |
| **Chromatic tuner** | Microphone-based, works on mobile |
| **Metronome** | BPM trainer + groove presets (Rock, Funk, Jazz, Bossa, Shuffle) |
| **Drum backing tracks** | Practice with a full drum loop |
| **Fretboard quiz** | Note recognition trainer with score tracking |
| **Chord library** | Shapes with PDF export |
| **Blank grids** | Printable blank fretboard templates for teachers |
| **Favorites** | Save scale/tuning combos locally |
| **PWA / offline** | Installable on iOS and Android, works without internet |
| **Bilingual** | Full Italian (solfeggio) and English (scientific notation) |

---

## Tech Stack

- **Vanilla JavaScript** — zero dependencies, no build step
- **Web Audio API** — audio playback and tuner (autocorrelation algorithm)
- **Service Worker** — cache-first offline strategy with user-controlled update banner
- **CSS custom properties** — dark theme, responsive across mobile/desktop
- **SVG** — mathematical fretboard rendering and PDF export via `print()`

---

## Getting Started (local dev)

```bash
git clone https://github.com/RobyPisco/bassmate.git
cd bassmate
# Serve with any static server — e.g.:
npx serve .
# or open index.html directly (some audio features need a real server)
```

No build step, no `npm install`. Open and go.

---

## Who is this for?

- Bassists learning scales and positions on the fretboard
- Teachers who need printable blank grid templates
- Players who want a quick metronome or tuner without installing an app
- Anyone who prefers tools that are fast, free, and work offline

---

## Contributing

Issues and pull requests are welcome. The codebase is intentionally dependency-free — please keep it that way.

---

## Support

If Bassmate helped your practice, consider buying me a coffee:  
[☕ Donate via PayPal](https://bassmate.it/donate.html)

---

*Built with love in Italy by [Roberto Pisconti](https://github.com/RobyPisco) · Happy grooving! 🤘*
