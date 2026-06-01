"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Count-up numeral — eases to value when scrolled into view. Reduced-motion shows
// the final value immediately.
export function CountUp({
  value,
  duration = 1600,
  className = "",
  format = true,
}: {
  value: number;
  duration?: number;
  className?: string;
  format?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    let raf = 0;
    let start: number | undefined;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (ts: number) => {
      if (start === undefined) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setN(Math.round(ease(p) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className}>
      {format ? n.toLocaleString() : n}
    </span>
  );
}
