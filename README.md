# Maria–Eleni Konsta · Online CV

Responsive English CV and a downloadable one-page A4, with a burgundy/rose identity and self-hosted fonts.

- [Website](https://geofeid.github.io/marialena-cv/)
- [Download A4 CV](https://geofeid.github.io/marialena-cv/Maria-Eleni-Konsta-CV.pdf)

## Build locally

Requires Node.js 24, Python 3.12+ and Google Chrome or Microsoft Edge. There are no npm dependencies.

```sh
python -m pip install -r requirements.txt
npm run build:pdf
npm run check
npm run serve
```

Open `http://127.0.0.1:5500/`. Set `CHROME_PATH` if the browser is installed elsewhere, or `PYTHON_PATH` to select a Python executable.

`npm run build` generates the HTML and assets. `npm run build:pdf` also regenerates the downloadable CV. The build publishes a new PDF only after its checks pass.

## Edit content and design

- `content.json`: shared content, including short print descriptions.
- `render-cv.mjs`: identity/sidebar and main CV column, shared by online and print output.
- `cv.css`: responsive layout, technical-skill bars and A4 print styles.
- `assets/marialena-portrait-clean.png`: cleaned portrait used online and in print.
- `fonts/`: self-hosted Manrope and Geom, including their SIL Open Font Licenses.
- `scripts/optimise-pdf.py`: image compression, embedded TrueType checks, text-reading order and keyword checks.

The layout follows the `zab-cv` and `Online_CV` projects. Skill bars show documented scope (Profile / Hands-on / Lead), without numeric proficiency scores. Soft skills remain text labels. The online About and work descriptions are concise; the A4 uses shorter text while retaining the same visual identity. There is one CV edition.

The portrait received AI-assisted cleanup using the built-in image tool: a clean neutral background and subtle clarity improvements, preserving facial identity, expression, hair and clothing. No source documents, local browser profiles or QA screenshots are included in this repository.

## PDF quality

The build enforces a single A4 page with selectable, tagged text, embedded static TrueType font subsets, contact links and a compact file size. Date/title/company order and key skill phrases are checked in exported text. These checks improve compatibility within the existing two-column design; they do not constitute a vendor-specific ATS score.

Static print faces are included. To recreate them from the variable fonts:

```sh
python -m pip install fonttools brotli
python scripts/prepare-print-fonts.py
```

Course completion dates are added only when supplied. Photoshop CC 2018 denotes the software version, not a completion year.

## Publish

Pushing to `main` runs `.github/workflows/deploy.yml`: install PDF tooling, build, validate and publish `dist/` with GitHub Pages. The generated site and PDF are deployment artifacts; `dist/` is not committed. Pages uses **GitHub Actions** as its publishing source.
