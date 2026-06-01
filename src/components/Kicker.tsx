import type { ReactNode } from "react";

// Eyebrow / kicker text — uppercase, wide-tracked, small.
export function Kicker({
  children,
  className = "",
  tone = "violet",
}: {
  children: ReactNode;
  className?: string;
  tone?: "violet" | "gold";
}) {
  const color = tone === "gold" ? "text-gold" : "text-violet";
  return (
    <div
      className={`font-sans text-[13px] font-semibold uppercase tracking-kicker ${color} ${className}`}
    >
      {children}
    </div>
  );
}
