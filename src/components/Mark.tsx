// Leaping-figure brand mark — a tasteful, original gesture (not a trace of the poster).
export function Mark({
  size = 26,
  color = "#5A3E8C",
  gold = "#B0822B",
}: {
  size?: number;
  color?: string;
  gold?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="17.5" cy="6" r="3" fill={color} />
      <path d="M4 22C8 13 12.5 10 21 9.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M9.5 22C12 17 14.5 15 19 14.5" stroke={gold} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
