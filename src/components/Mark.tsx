import Image from "next/image";

// Brand mark — the official Catholic Yuva Dhara / Diocese of Jalandhar emblem.
// A self-contained circular badge, so it reads on both light and dark chrome.
export function Mark({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/anubhav-logo.png"
      alt="Catholic Yuva Dhara — Diocese of Jalandhar"
      width={size}
      height={size}
      priority
      className={`shrink-0 rounded-full ${className}`}
    />
  );
}
