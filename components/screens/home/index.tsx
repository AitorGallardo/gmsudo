import { Monogram } from "@/components/home/monogram";
import { PaletteTrigger } from "@/components/home/palette-trigger";
import { Row, Section } from "@/components/home/row";
import { Socials } from "@/components/home/socials";
import { AppThemeSwitcher } from "@/components/theme";

const work = [
  {
    title: "Apartool",
    description: "Full-Stack Engineer",
    meta: "2023 — Now",
    initials: "Ap",
    href: "https://apartool.com",
    external: true,
  },
  {
    title: "Freelance",
    description: "Product Engineer",
    meta: "2023",
    initials: "Fr",
  },
  {
    title: "2Shapes",
    description: "Software Engineer",
    meta: "2017 — 2022",
    initials: "2S",
    href: "https://2shapes.com",
    external: true,
  },
];

const projects = [
  {
    title: "XSaved",
    description: "The bookmark manager X never built",
    pills: ["chrome", "ios", "macos"],
    icon: "/images/xsaved-icon.png",
    href: "/projects/xsaved",
  },
  {
    title: "TabKnight",
    description: "Keyboard-first tab manager — ⌘K for your tabs",
    pill: "chrome",
    icon: "/images/tabknight-icon.png",
    href: "/projects/tabknight",
  },
];

const lab = [
  {
    title: "Typefall",
    description: "A monkeytype-style typing test — rendered in 3D",
    pill: "three.js",
    initials: "Tf",
    href: "/projects/typefall",
  },
  {
    title: "Primordia",
    description: "A pond that thinks — tiny open-source minds in your browser",
    pill: "ai",
    initials: "Pr",
    href: "/projects/primordia",
  },
  {
    title: "Cardstock",
    description: "Physical HTML cards — the engine behind this site's play mode",
    pill: "canvas",
    initials: "Cs",
    href: "/projects/cardstock",
  },
  {
    title: "XSaved MCP",
    description: "Your bookmark library as tools for Claude & agents",
    pill: "mcp",
    initials: "Mc",
    href: "https://github.com/AitorGallardo/xsaved-mcp",
    external: true,
  },
  {
    title: "XSaved RAG",
    description: "Hybrid retrieval over my bookmarks, kept honest by an eval harness",
    pill: "ai",
    initials: "Rg",
    href: "https://github.com/AitorGallardo/xsaved-rag",
    external: true,
  },
  {
    title: "XSaved Topics",
    description: "Semantic tagging CLI built on the Claude API",
    pill: "cli",
    initials: "Tp",
    href: "https://github.com/AitorGallardo/xsaved-topics",
    external: true,
  },
  {
    title: "Megaport Visualizer",
    description: "A live map of ports, links and cloud on-ramps",
    pill: "web",
    initials: "Mg",
    href: "https://github.com/AitorGallardo/megaport-network-visualizer",
    external: true,
  },
];

const earlier = [
  {
    title: "BBBookmarks",
    description: "First take on X bookmarks — grew into XSaved",
    pill: "chrome",
    icon: "/images/bbbookmarks-icon-128x128.png",
    href: "/projects/bbbookmarks",
  },
];

export default function Home() {
  return (
    <div className="stagger">
      <div className="flex items-start justify-between">
        <Monogram />
        <div className="flex items-center gap-3 text-muted text-small">
          <PaletteTrigger />
          <AppThemeSwitcher />
        </div>
      </div>

      <p className="mt-8">
        <span className="font-medium">Aitor Gallardo</span> <span className="text-muted">·</span>{" "}
        <a href="https://x.com/gmsudo" className="text-muted underline decoration-gray-a6 underline-offset-2 transition-colors hover:text-foreground">
          @gmsudo
        </a>{" "}
        <span className="text-muted">·</span> full-stack &amp; AI engineer.
      </p>

      <p className="mt-5">I ship products end-to-end — design, frontend, backend, and the AI in between.</p>

      <p className="mt-4">
        Right now I&apos;m building{" "}
        <a href="https://xsaved.com" className="underline decoration-gray-a6 underline-offset-2 transition-colors hover:decoration-gray-a10">
          XSaved
        </a>{" "}
        solo: a local-first, AI-organized bookmark manager for X — a Chrome extension, native iOS and Mac apps, and the sync spine behind them.
      </p>

      <p className="mt-4">
        AI is moving faster than anything I&apos;ve seen, and I&apos;m having a great time keeping up — trying things the week they land, keeping what actually
        works. The rest is taste: small details, fast interfaces, things that feel right. If that&apos;s your thing too,{" "}
        <a href="https://x.com/gmsudo" className="underline decoration-gray-a6 underline-offset-2 transition-colors hover:decoration-gray-a10">
          say hi
        </a>
        .
      </p>

      <Socials />

      <Section title="projects">
        {projects.map((item) => (
          <Row key={item.title} {...item} />
        ))}
        <a href="https://xsaved.com" className="mt-3 flex items-center gap-2.5 text-muted text-small transition-colors hover:text-foreground">
          <span className="live-dot" />
          XSaved is live on the Chrome Web Store — try it
        </a>
      </Section>

      <Section title="lab">
        {lab.map((item) => (
          <Row key={item.title} {...item} />
        ))}
      </Section>

      <Section title="earlier">
        {earlier.map((item) => (
          <Row key={item.title} {...item} />
        ))}
      </Section>

      <Section title="work">
        {work.map((item) => (
          <Row key={item.title} {...item} />
        ))}
      </Section>

      <footer className="mt-14 text-muted text-small">
        <p>© {new Date().getFullYear()} Aitor Gallardo · @gmsudo</p>
      </footer>
    </div>
  );
}
