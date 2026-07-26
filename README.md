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
```

Pushes to `main` publish the portfolio and the three lab apps together through
GitHub Pages. The deployment workflow checks out each lab repository, builds it
with its `/lab/...` base path, and adds it to the final static export.

## Details

- **⌘K command palette** — jump to sections and projects without touching the mouse
- **Terminal** — click the monogram to drop into a small interactive shell
- **Lab section** — small side experiments and tools live alongside the portfolio at `/lab/typefall`, `/lab/primordia`, and `/lab/cardstock`

## Lineage

This is the third life of this site: [v0](https://aitorgallardo.github.io/portfolio-v0/) (Astro) → [v1](https://aitorgallardo.github.io/portfolio-v1/) (first Next.js take) → this one, now live at **gmsudo.com**.

---

<div align="center">
<sub>© 2026 Aitor Gallardo · <a href="https://x.com/gmsudo">@gmsudo</a></sub>
</div>
