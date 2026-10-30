# 物理图志 · Atlas of Physics

A Next.js App Router physics field journal, in Simplified Chinese and English. The visual
theme combines warm paper, botanical teal, vermilion annotations, serif typography and
interactive scientific diagrams.

## Run the application

Requires Node.js 20.9 or later and npm.

```sh
npm install
npm run dev
# http://localhost:3000 — opens the Chinese overview
```

```sh
npm run build
npm start
```

No API keys, database or account setup is required. Lesson completion is stored in this
browser's local storage; it is shared between languages, not synced between devices.
The primary curriculum works without WebGL. Fonts and Three.js are served locally,
without Google Fonts or CDN requests at runtime.

## Learning experience

- `/zh` and `/en`: overview, interactive projectile diagram and learning progress.
- `/[lang]/courses/middle`: 12 lessons, suggested grades 8–9.
- `/[lang]/courses/high`: 14 lessons, suggested grades 10–12.
- `/[lang]/learn/[slug]`: three guided conceptual steps, assumptions and units, a worked
  solution, a self-check with feedback, and previous/next lesson navigation.
- `/[lang]/equations`: bilingual relationships and their conditions, linked to lessons.
- `/[lang]/explore`: the original 15 English AP enrichment chapters, integrated in the
  new navigation. Their original physics models, 3D interactions and practice are retained.

The curriculum follows common Chinese secondary-school physics topics, not a particular
textbook edition or a claim of exhaustive examination coverage. Grade groupings are a
suggested learning order; regional and school schedules differ. English AP chapters,
including calculus-based material, are explicitly labelled as optional enrichment.

`lib/curriculum.js` contains both translations, worked examples and quiz answers.
`lib/i18n.js` contains interface translations. Adding a lesson there automatically adds
its static pages, learning-path entry and handbook entry. Locale switching keeps the
current lesson or page. The default language is Chinese.

## GitHub Pages

The public repository is [huangyingting/physics-field-journal](https://github.com/huangyingting/physics-field-journal).
The deployed site is [huangyingting.github.io/physics-field-journal](https://huangyingting.github.io/physics-field-journal/).
Pushing to `main` runs `.github/workflows/pages.yml`: validate, export static pages,
upload the artifact, and deploy to GitHub Pages using the workflow's short-lived token.
In repository **Settings → Pages**, the build source must be **GitHub Actions**.

To reproduce the Pages export locally:

```sh
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/physics-field-journal npm run build
```

Upload the resulting `out/` directory to the matching repository subpath. The Pages
build uses directory-style URLs, unoptimized static images, repository-prefixed assets
and HTML redirects for the overview and original chapter links. The normal `npm run dev`
and `npm start` server workflows remain supported without these environment variables.

`tools/prepare-assets.mjs` runs before development and production builds. It copies the
original chapter assets to ignored `public/legacy/` and `public/img/` directories, adds
stable base URLs, serves Three.js locally, and omits the old external fonts and
hosting-specific analytics script. Original chapter
URLs redirect to the new exploration pages; numeric page hashes remain supported.

## Validation

```sh
npm run lint       # Next.js / React ESLint rules
npm test           # Bilingual curriculum integrity and interactive-diagram physics
npm run check      # Original chapter models and 361 equation links
npm run build     # Production generation of all localized routes
npm start         # Keep running in another terminal for browser tests
npm run test:ui    # Headless Chrome: routes, locales, quizzes, progress, mobile and 3D
```

Browser tests use `/usr/bin/google-chrome` by default. Override with `CHROME=/path/to/chrome`
and optionally `BASE_URL=http://localhost:3000`. Set `SCREENSHOTS=/absolute/output/path`
to save desktop and mobile screenshots. The 3D browser check requires WebGL support.

## Original interactive textbook

An interactive textbook. Each chapter is one simple motion drawn in 3D like a textbook diagram
(paper solids, ink edges, one lit thing). No apparatus: only the
moving object, its vectors, axes and graphs. Scroll turns the pages and moves the camera; hover
lights a thing; click breaks it down (a vector into components, a graph into slope and area).

```
index.html              contents (chapter cards)
atlas.css               shared tokens (Anatomy light theme)
engine/
  render.js             renderer: paper shading + normal/depth ink edges, picking, explode, camera
  parts.js              paper materials, solid arrows, line helpers
kinematics/
  model.js              the physics (a ball thrown up; a projectile): every motion and number
  checks.mjs            invariants of the model — node <chapter>/checks.mjs (every chapter has one)
  world.js              the figure: ball, axis, arrows, strobe, graphs, projectile and shadow
  pages.js              chapter text (after the AP Physics graphic organizers), cameras, breakdowns
  practice.js           AP-style questions per page ({ pageIndex: [{ q, choices, answer, why } | { q, solution }] })
  main.js               scroll → page turn + camera; hover / click / Esc
newton/ circular/ energy/ momentum/ oscillations/ rotation/ fluids/
                        AP Physics 1 + Physics C: Mechanics, chapters 2–8 (Physics C pages tagged in their kicker)
electrostatics/ gauss/ potential/ capacitors/ circuits/ magnetism/ induction/
                        AP Physics C E&M, chapters 9–15
                        every chapter: model, checks, world, pages, main, index.html
engine/book.js          the shared book: scroll → page turn + camera, hover / click / tap, labels,
                        practice, deep links (<chapter>/#<page index>), pager on small screens
engine/xrefs.js         "Compare" analogies between chapters, shown on both pages
equations/              the AP equation sheets, each equation linked to the pages that show it
tools/shoot.mjs         headless screenshots of every page and a few opened parts
tools/uitest.mjs        one page by deep link: practice, compare links, overflow (any viewport, touch)
tools/taptest.mjs       phone viewport: a tap opens a breakdown
tools/perf.mjs          per-chapter load time, fps, script and layout cost
tools/allpages.mjs      every page by deep link: practice present, no console errors
tools/dumptext.mjs      the rendered text of every page of a chapter, for proofreading
tools/prof.mjs          CPU profile of one chapter; tools/loadprof.mjs the same for page load
tools/picktest.mjs      hover near a moving part, then click: does it open?
tools/scrolltest.mjs    scroll an overflowing left page to the bottom and screenshot it
```

Tools need `npm install` (puppeteer-core) and Chrome (set `CHROME` to its path if not at the macOS default). Screenshots: `CHAPTER=newton PARTS=rest:0,car:5 node tools/shoot.mjs shots/newton` (PARTS = key or key:page)

For the original standalone static version: `python3 -m http.server 8137`
(three.js loads from jsDelivr) and open http://127.0.0.1:8137/.
For the migrated application, use the Next.js commands above.
Keys: ← → turn pages, Esc puts a part back. Links: `newton/#4` opens page 2.4.
Phones and tablets: the figure stacks over the text, swipes snap to whole pages, a tap breaks a part down;
resolution steps down by itself if frames run slow.

AP® is a trademark of the College Board, which does not endorse this site. The equation sheet follows the published AP Physics equation tables.

MIT licensed.
