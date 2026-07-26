<div align="center">

# gmsudo

**The personal site of [Aitor Gallardo](https://x.com/gmsudo) — full-stack & AI engineer.**

[![Live](https://img.shields.io/badge/Live-gmsudo.com-000000?style=for-the-badge)](https://gmsudo.com/)
[![X](https://img.shields.io/badge/@gmsudo-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/gmsudo)

<br/>

<img src=".github/assets/home-dark.jpg" alt="gmsudo — dark theme" width="800" />

<sub>…and it's just as comfortable in the light.</sub>

<img src=".github/assets/home-light.jpg" alt="gmsudo — light theme" width="800" />

</div>

## What this is

One narrow column. Who I am, what I've shipped, what I'm playing with — no navigation to learn, nothing to wait for. Projects link to short case pages written in MDX.

## How it's built

- **Next.js** (App Router, static export) — every page is prerendered HTML
- **MDX** case pages with view transitions between home and project
- **Radix Colors** for a theme that works in both light and dark
- **CSS-only stagger reveal** — content paints before JavaScript arrives, and respects `prefers-reduced-motion`
- **Bun** for install / dev / build

```bash
bun install
bun run dev      # local dev
bun run build    # lint + static export to out/
bun run deploy   # publish out/ to gh-pages
```

## Details

- **⌘K command palette** — jump to sections and projects without touching the mouse
- **Terminal** — click the monogram to drop into a small interactive shell
- **Lab section** — small side experiments and tools live on the home page, with a few more toys (typefall, primordia, cardstock) on the way

## Lineage

This is the third life of this site: [v0](https://aitorgallardo.github.io/portfolio-v0/) (Astro) → [v1](https://aitorgallardo.github.io/portfolio-v1/) (first Next.js take) → this one, now live at **gmsudo.com**.

---

<div align="center">
<sub>© 2026 Aitor Gallardo · <a href="https://x.com/gmsudo">@gmsudo</a></sub>
</div>
