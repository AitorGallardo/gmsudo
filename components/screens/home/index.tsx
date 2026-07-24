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
    pill: "chrome",
    icon: "/images/xsaved-icon.png",
    href: "/projects/xsaved",
  },
  {
    title: "XSaved for iOS",
    description: "Your whole library, native in your pocket",
    pill: "ios",
    icon: "/images/xsaved-ios-icon.png",
    href: "/projects/xsaved-ios",
  },
  {
    title: "XSaved for Mac",
    description: "Room to spread out, browse, and rediscover",
    pill: "macos",
    icon: "/images/xsaved-mac-icon.png",
    href: "/projects/xsaved-mac",
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
    title: "XSaved MCP",
    description: "Your bookmark library as tools for Claude & agents",
    pill: "mcp",
    initials: "Mc",
    href: "https://github.com/AitorGallardo/xsaved-mcp",
    external: true,
  },
  {
    title: "XSaved RAG",
    description: "Hybrid retrieval over a bookmark corpus, with eval harness",
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
    description: "Interactive network topology for Megaport services",
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
  {
    title: "Artsurround",
    description: "A little world with art as its theme",
    pill: "web",
    initials: "Ar",
    href: "https://github.com/AitorGallardo/artsurround",
    external: true,
  },
];

export default function Home() {
  return (
    <div className="stagger">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-a3 font-medium text-gray-11">ag</div>
        <div className="text-muted text-small">
          <AppThemeSwitcher />
        </div>
      </div>

      <p className="mt-8">
        <span className="font-medium">Aitor Gallardo</span> <span className="text-muted">·</span>{" "}
        <a
          href="https://x.com/gmsudo"
          className="text-muted underline decoration-gray-a6 underline-offset-2 transition-colors hover:text-foreground hover:opacity-100"
        >
          @gmsudo
        </a>{" "}
        <span className="text-muted">·</span> full-stack &amp; AI engineer.
      </p>

      <p className="mt-5">I ship products end-to-end — product design, frontend, serverless backends, and the applied AI in between.</p>

      <p className="mt-4">
        Right now I&apos;m building{" "}
        <a href="https://xsaved.com" className="underline decoration-gray-a6 underline-offset-2 transition-colors hover:decoration-gray-a10 hover:opacity-100">
          XSaved
        </a>{" "}
        solo: a local-first, AI-organized bookmark manager for X — a Chrome extension, native iOS and Mac apps, and the sync spine behind them.
      </p>

      <p className="mt-4">By day I build at Apartool. By night I build for myself.</p>

      <Socials />

      <Section title="work">
        {work.map((item) => (
          <Row key={item.title} {...item} />
        ))}
      </Section>

      <Section title="projects">
        {projects.map((item) => (
          <Row key={item.title} {...item} />
        ))}
        <a href="https://xsaved.com" className="mt-3 flex items-center gap-2.5 text-muted text-small transition-colors hover:text-foreground hover:opacity-100">
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

      <footer className="mt-14 flex items-center justify-between text-muted text-small">
        <p>© 2026 Aitor Gallardo · @gmsudo</p>
        <p className="flex gap-3">
          <a href="https://aitorgallardo.github.io/portfolio-v0/" className="transition-colors hover:text-foreground hover:opacity-100">
            v0
          </a>
          <a href="https://aitorgallardo.github.io/portfolio-v1/" className="transition-colors hover:text-foreground hover:opacity-100">
            v1
          </a>
        </p>
      </footer>
    </div>
  );
}
