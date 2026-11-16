"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Fade-and-rise when the element scrolls into view. */
export default function Reveal({ delay = 0, y = 34, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: [0.22, 0.8, 0.2, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
