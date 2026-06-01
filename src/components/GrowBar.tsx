"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// Horizontal fill that grows to `pct` when scrolled into view. Render inside a
// track element (the parent provides the track background + height + radius).
// Used in the home stats preview and the stats page.
export function GrowBar({
  pct,
  delay = 0,
  rounded = false,
}: {
  pct: number;
  delay?: number;
  rounded?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const target = `${Math.max(0, Math.min(100, pct))}%`;
  const fill = `h-full bg-gradient-to-r from-violet to-gold ${rounded ? "rounded-full" : ""}`;

  return (
    // Full-width sentinel so useInView fires regardless of the fill width.
    <div ref={ref} className="h-full w-full">
      {reduce ? (
        <div className={fill} style={{ width: target }} />
      ) : (
        <motion.div
          className={fill}
          initial={{ width: "0%" }}
          animate={{ width: inView ? target : "0%" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay }}
        />
      )}
    </div>
  );
}
