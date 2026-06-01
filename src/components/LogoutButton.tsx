"use client";

import { useEffect, useRef, useState } from "react";

// "Log out" trigger + confirmation dialog. The confirm action is a plain <a>
// to /logout (a Route Handler) so the browser does a full navigation and
// applies the redirect + cookie-clearing Set-Cookie header. <Link> would
// soft-navigate and no-op.
//
// Mobile-first: the dialog is a bottom sheet on phones (full-width, slides up
// from the bottom, rounded top, safe-area aware) and a centered modal at sm+.
// All interactive targets are >=44px tall per touch-target guidance.
export function LogoutButton() {
  const [open, setOpen] = useState(false);
  const confirmRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Lock background scroll while the dialog is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="-mr-2 inline-flex min-h-[44px] items-center px-2 font-sans text-sm font-semibold text-sub underline transition-colors hover:text-ink"
      >
        Log out
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:px-5"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            aria-describedby="logout-desc"
            className="w-full max-w-sm rounded-t-[20px] border border-line bg-paper p-6 shadow-xl sm:rounded-[18px] sm:p-7"
            style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="logout-title" className="m-0 font-serif text-xl font-semibold text-ink">
              Log out?
            </h2>
            <p id="logout-desc" className="mt-2 font-sans text-sm leading-relaxed text-sub">
              You&rsquo;ll need to sign in again to see your retreat details.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full px-5 font-sans text-sm font-semibold text-sub transition-colors hover:text-ink"
              >
                Cancel
              </button>
              <a
                ref={confirmRef}
                href="/logout"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-ink px-5 font-sans text-sm font-semibold text-paper transition-transform duration-300 ease-lumen hover:-translate-y-0.5"
              >
                Log out
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
