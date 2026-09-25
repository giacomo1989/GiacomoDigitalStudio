# Giacomo Digital Studio — v2

Static boutique-studio website based on the latest approved visual direction.

## Run locally
Use a local HTTP server because translations are loaded via `fetch()`.

```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

## Structure
- `index.html` — homepage
- `css/style.css` — responsive visual system
- `js/app.js` — pricing configurator + language switcher
- `i18n/it.json`, `en.json`, `es.json` — translations
- `images/design-reference.png` — latest render used as visual reference

## Before publishing
Replace `hello@example.com`, add real project imagery/links, and finalize prices.
