import Image from "next/image";

// Image slot — consistent warm-tinted crop. Renders a real photo when a URL is
// supplied, otherwise a tasteful placeholder (user supplies photos later).
export function PhotoSlot({
  src,
  alt = "",
  label = "Photo",
  ratio = "4 / 5",
  className = "",
  sizes = "(max-width: 768px) 50vw, 240px",
}: {
  src?: string | null;
  alt?: string;
  label?: string;
  ratio?: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[14px] border border-line ${className}`}
      style={{
        aspectRatio: ratio,
        background: "linear-gradient(150deg, #F2EADB, #EADFC9)",
      }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(135deg, transparent, transparent 13px, rgba(176,130,43,0.05) 13px, rgba(176,130,43,0.05) 14px)",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-faint">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="8.5" cy="9" r="1.8" stroke="currentColor" strokeWidth="1.4" />
              <path
                d="M21 15l-5-4-7 6"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.08em]">
              {label}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
