import clsx from "clsx";

interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
  text?: string;
  underline?: boolean;
  className?: string;
}

const Link = ({ text, href, underline, className, children }: LinkProps) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={clsx(className, {
        "underline decoration-1 decoration-gray-a6 underline-offset-2 transition-colors hover:decoration-gray-a10": underline,
      })}
      href={href}
    >
      {text || children}
    </a>
  );
};

export default Link;
