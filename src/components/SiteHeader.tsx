"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mark } from "./Mark";
import { NAV } from "@/lib/site";

// Sticky top nav. Transparent at the top of the page, frosts on scroll.
// Desktop: inline links + gold active underline. Mobile: a slide-down menu.
// `authed` is read server-side from the httpOnly JWT cookie (see layout.tsx)
// and decides whether the CTA reads "Log in" or "My Profile".
export function SiteHeader({ authed }: { authed: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background,border-color] duration-[400ms] ease-lumen ${
        scrolled || open
          ? "border-b border-line bg-bg/90 backdrop-blur-md supports-[backdrop-filter]:bg-bg/80"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-site items-center justify-between px-5 py-3.5 sm:px-8 md:px-12">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Anubhav 2026 home">
          <Mark size={32} />
          <span className="font-serif text-[22px] font-semibold tracking-[-0.01em] text-ink sm:text-[23px]">
            Anubhav<span className="text-gold">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`group relative py-1 font-sans text-[15px] font-medium transition-colors ${
                  active ? "text-ink" : "text-sub hover:text-ink"
                }`}
              >
                {n.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-gold transition-[width] duration-[400ms] ease-lumen ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={authed ? "/me" : "/login"}
            className="cta-primary whitespace-nowrap rounded-full bg-violet px-5 py-2.5 font-sans text-[14.5px] font-semibold text-paper transition-transform duration-300 ease-lumen hover:-translate-y-0.5"
          >
            {authed ? "My Profile" : "Log in"}
          </Link>
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-full text-ink md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-line bg-bg/95 px-5 pb-5 pt-2 backdrop-blur-md md:hidden"
        >
          {NAV.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[48px] items-center border-b border-lineSoft font-sans text-[17px] font-medium last:border-b-0 ${
                  active ? "text-ink" : "text-sub"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
