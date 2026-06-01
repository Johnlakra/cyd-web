"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Scroll-reveal: fades + rises children into view once. The signature Lumen entry.
// Respects prefers-reduced-motion (renders immediately, no transform).
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{
        opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
        y: { duration: 1, ease: [0.22, 1, 0.36, 1], delay },
      }}
    >
      {children}
    </MotionTag>
  );
}
