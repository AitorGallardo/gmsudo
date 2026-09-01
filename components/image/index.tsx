"use client";

import type { ImageProps } from "next/image";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

interface MDXImageProps extends ImageProps {
  alt: string;
  caption?: string;
}

/**
 * Case-page figure: a bordered frame with a blur-up reveal.
 *
 * The above-the-fold hero is often already loaded from the static HTML by the
 * time React hydrates, so its `onLoad` never fires and the "loading" blur would
 * stay pinned; on mount we check `img.complete` and clear the state ourselves.
 * Once loaded, the filter property is dropped (not set to `none`) and only
 * `filter` transitions, so no stale composited layer lingers.
 *
 * Testing note: these images are `loading="lazy"` (next/image default), and
 * Chrome does not fetch lazy images in a hidden tab — automation tabs report
 * `visibilityState === "hidden"`, so screenshots there show empty frames until
 * a scroll is injected. Real, foreground tabs are unaffected.
 */
export default function MDXImage({ caption, alt, ...props }: MDXImageProps) {
  const [isImageLoading, setImageLoading] = React.useState(true);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const href = props.src.toString();

  React.useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setImageLoading(false);
  }, []);

  return (
    <motion.a className="my-6 flex cursor-pointer flex-col justify-end gap-2" href={href} whileHover={{ scale: 0.975, opacity: 0.9 }}>
      <div className="relative max-h-96 w-full overflow-hidden rounded-large border border-border">
        <Image
          ref={imgRef}
          unoptimized
          alt={alt}
          width={1000}
          height={1000}
          sizes="100vw"
          style={{
            objectFit: "contain",
            width: "100%",
            height: "auto",
            objectPosition: "center",
            ...(isImageLoading ? { filter: "blur(8px)" } : {}),
            transition: "filter 0.5s ease",
          }}
          onLoad={() => setImageLoading(false)}
          {...props}
        />
      </div>
      {caption && <sub className="pt-2 text-center">{caption}</sub>}
    </motion.a>
  );
}
