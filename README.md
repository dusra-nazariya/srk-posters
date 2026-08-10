# SRK: A Poster Palette

A data-viz essay by **Dusra Nazariya** tracing the color identity of Shah Rukh Khan's filmography through CIELAB K-Means palettes extracted from all 69 poster artworks (1992–2026).

![hero](static/images/SRK_Posters.png)

## What it shows

- A **timeline** of each film's top-5 palette colors, ordered by year
- **Average palettes per era** (1992–99, 2000–05, 2006–10, 2011–17, 2018–26)
- **Hue distribution** stacking across the years
- **Lightness & saturation** drift, film by film
- A **color wheel heatmap** mapping every extracted color (distance = saturation, dot size = lightness)
- An index of **all 69 palettes**, each with its own `/films/[slug]` page

Every film page offers palette copy (clipboard), download-as-text, and share-by-URL (copy link, native Share, X, WhatsApp, Telegram, Email).

## Tech stack

- [SvelteKit 2](https://kit.svelte.dev) (Svelte 5 runes) + Vite
- [Tailwind CSS v4](https://tailwindcss.com) (`@tailwindcss/vite`, CSS-first `@theme`)
- [d3](https://d3js.org) for the charts
- `@sveltejs/adapter-static` — fully prerendered, no server

## Getting started

```bash
npm install
npm run dev        # dev server
npm run build      # static site → build/
npm run preview    # serve the built site
```

## Project structure

```
src/
  app.html               # shell + no-flash theme script
  app.css                # Tailwind theme tokens (light/dark), fonts, utilities
  lib/
    config.js            # SITE_URL, author, meta constants
    data/
      palettes.json      # 69 films, each with a 5-color palette
      colors.js          # palette math + derived series (era/trend aggregates)
      slugs.js           # slugify + share/download text helpers
    components/
      Navbar.svelte      # sticky nav + theme toggle
      Footer.svelte      # site links, socials, copyright
      Seo.svelte         # canonical/OG/Twitter + JSON-LD helper
      Tooltip.svelte     # shared hover tooltip (poster + palette)
      Section.svelte     # scrollytelling wrapper per heading
      ...chart components
  routes/
    +page.svelte         # landing page (hero + timeline/eras/trends)
    wheel/+page.svelte   # color wheel heatmap
    palettes/+page.svelte# index of all 69 palettes
    films/[slug]/+page.* # per-film pages (copy/download/share)
static/
  images/SRK_Posters/    # source posters
  images/SRK_Posters.png # hero backdrop
```

## Data pipeline

Palettes were extracted from poster images outside this repo (see `extract_palette.py` in the parent project) using CIELAB space and K-Means clustering, then exported as `src/lib/data/palettes.json`.

## Themes

Dark and light are both built from the same CSS variables defined in `src/app.css` (`:root` = light, `.dark` = dark). The default follows the OS preference; the navbar toggle persists your choice to `localStorage`.

## SEO

Every page emits canonical, Open Graph, and Twitter cards, plus JSON-LD — `WebSite` (home), `WebPage` (wheel, palettes), `ItemList` of all 69 films (palettes), and `Movie` structured data on each film route.

## License

Content and code by Dusra Nazariya. Posters remain the property of their respective studios.