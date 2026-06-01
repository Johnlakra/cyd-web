"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// Gold underline that draws in when scrolled into view — Lumen's signature motion.
export function DrawUnderline({
  children,
  thickness = 2,
  className = "",
}: {
  children: ReactNode;
  thickness?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      <motion.span
        aria-hidden="true"
        className="absolute left-0 -bottom-1 rounded-full bg-gold"
        style={{ height: thickness }}
        initial={{ width: reduce ? "100%" : "0%" }}
        animate={{ width: inView || reduce ? "100%" : "0%" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      />
    </span>
  );
}
