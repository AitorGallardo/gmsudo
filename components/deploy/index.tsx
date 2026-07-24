"use client";

import { motion } from "framer-motion";

export const DeployButton = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        bottom: -32,
      }}
      animate={{
        opacity: 1,
        bottom: 24,
      }}
      exit={{
        opacity: 0,
        bottom: -32,
      }}
      transition={{
        ease: [0.19, 1, 0.22, 1],
        duration: 0.4,
        delay: 1,
      }}
      className="-translate-x-1/2 fixed left-1/2 transform text-small"
    />
  );
};
