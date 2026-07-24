interface DownloadIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const DownloadIcon = ({ width = 24, height = 24, className = "" }: DownloadIconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      focusable="false"
      role="img"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      className={className}
    >
      <title>DocumentDownload icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 10v6m0 0-3-3m3 3 3-3m2 8H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"
      />
    </svg>
  );
};
