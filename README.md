# Artax Dev — Sepanta Hosseini 3D Digital Card
Pure HTML / CSS / JS (no build step). This profile presents Sepanta as a mechanical engineering student exploring Python, AI, and machine learning for engineering applications. It avoids claiming a specific AI specialization or professional expertise not demonstrated by the public portfolio. Works on GitHub Pages as-is.

## Deploy
Repo -> Settings -> Pages -> Deploy from branch `main` / root. Done.
Local test: `python -m http.server` then open http://localhost:8000
(double-clicking index.html will not work - the card loads JSON through AJAX.)

## Profiles
- `/`            -> Sepanta Hosseini (data/sepanta.json)
- `/?p=kiyan`    -> Kiyan Rahmati   (data/kiyan.json)
Add a new person: copy a JSON file in `data/`, open `/?p=filename`.

## Photos
Put `assets/img/sepanta.jpg` and `assets/img/kiyan.jpg` (square, 600x600+). A placeholder shows until then.

## Edit
Profile text, links, tags, phone -> `data/*.json` | UI texts -> `lang/*.json` | Neural net + liquid -> `js/bg.js`, end of `css/style.css`
