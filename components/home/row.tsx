import { Link as NextViewTransition } from "next-view-transitions";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface RowProps {
  title: string;
  description?: string;
  href?: string;
  external?: boolean;
  icon?: string;
  initials?: string;
  meta?: string;
  pill?: string;
  pills?: string[];
}

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="shrink-0 rounded-full bg-gray-a3 px-2 py-0.5 text-gray-10 text-small">{children}</span>
);

const Tile = ({ icon, initials, title }: Pick<RowProps, "icon" | "initials" | "title">) => {
  if (icon) {
    return (
      <img
        src={`${basePath}${icon}`}
        alt={`${title} icon`}
        width={32}
        height={32}
        loading="lazy"
        className="h-8 w-8 shrink-0 rounded-[8px] ring-1 ring-gray-a4 transition-transform duration-200 ease-out group-hover:scale-[1.06]"
      />
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-gray-a3 font-medium text-gray-10 text-small transition-transform duration-200 ease-out group-hover:scale-[1.06]">
      {initials}
    </div>
  );
};

const RowBody = ({ title, description, meta, pill, pills, icon, initials, external }: RowProps) => (
  <>
    <Tile icon={icon} initials={initials} title={title} />
    <div className="min-w-0 flex-1">
      <p className="flex items-center gap-1 truncate">
        {title}
        {external && (
          <span className="-translate-x-0.5 text-gray-8 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">↗</span>
        )}
      </p>
      {description && <p className="mt-0 truncate text-muted">{description}</p>}
    </div>
    {meta && <p className="mt-0 shrink-0 text-muted text-small">{meta}</p>}
    {pills ? (
      <span className="flex shrink-0 gap-1">
        {pills.map((p) => (
          <Pill key={p}>{p}</Pill>
        ))}
      </span>
    ) : (
      pill && <Pill>{pill}</Pill>
    )}
  </>
);

export const Row = (props: RowProps) => {
  const className = "group -mx-3 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-gray-a2";

  if (!props.href) {
    return (
      <div className={className}>
        <RowBody {...props} />
      </div>
    );
  }

  if (props.external) {
    return (
      <a href={props.href} target="_blank" rel="noreferrer" className={className}>
        <RowBody {...props} />
      </a>
    );
  }

  return (
    <NextViewTransition href={props.href} className={className}>
      <RowBody {...props} />
    </NextViewTransition>
  );
};

export const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mt-10">
    <h2 className="mb-1 text-muted lowercase">{title}</h2>
    <div className="flex flex-col">{children}</div>
  </section>
);
