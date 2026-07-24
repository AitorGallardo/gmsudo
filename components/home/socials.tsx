const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const XLogo = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GitHubLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.67.41.35.78 1.05.78 2.12v3.14c0 .3.2.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" />
    <path d="M14 2v6h6" />
  </svg>
);

const links = [
  { label: "@gmsudo on X", href: "https://x.com/gmsudo", icon: <XLogo /> },
  {
    label: "GitHub",
    href: "https://github.com/aitorgallardo",
    icon: <GitHubLogo />,
  },
  { label: "Email", href: "mailto:aitorgamu@gmail.com", icon: <MailIcon /> },
  {
    label: "CV",
    href: `${basePath}/documents/cv.pdf`,
    icon: <FileIcon />,
    download: true,
  },
];

export const Socials = () => (
  <div className="mt-6 flex items-center gap-5 text-gray-9">
    {links.map((link) => (
      <a
        key={link.label}
        href={link.href}
        aria-label={link.label}
        title={link.label}
        download={link.download}
        className="transition-colors duration-150 hover:text-foreground hover:opacity-100"
      >
        {link.icon}
      </a>
    ))}
  </div>
);
