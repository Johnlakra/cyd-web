import Link from "next/link";
import { Mark } from "./Mark";
import { NAV, SITE } from "@/lib/site";

// Shared footer — deep violet, Lumen credit line at the bottom.
export function SiteFooter() {
  return (
    <footer className="bg-violetDeep text-[#E9E2F0]">
      <div className="mx-auto max-w-site px-5 pb-10 pt-16 sm:px-8 md:px-12">
        <div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <Mark size={26} color="#fff" gold="#C99A3F" />
              <span className="font-serif text-[26px] font-semibold text-white">
                Anubhav<span className="text-goldSoft">.</span>
              </span>
            </div>
            <p className="m-0 max-w-[340px] font-serif text-xl italic leading-relaxed text-[#CDBFE0]">
              An encounter for the youth of Punjab. {SITE.year}.
            </p>
          </div>

          <div>
            <div className="mb-4 font-sans text-[12.5px] font-semibold uppercase tracking-[0.16em] text-goldSoft">
              Explore
            </div>
            <div className="flex flex-col gap-3">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="font-sans text-[15px] text-[#D9CFE8] transition-colors hover:text-white"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 font-sans text-[12.5px] font-semibold uppercase tracking-[0.16em] text-goldSoft">
              Contact
            </div>
            <div className="flex flex-col gap-3 font-sans text-[15px] text-[#D9CFE8]">
              <span>{SITE.org}</span>
              <span>{SITE.commission}</span>
              <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-white">
                {SITE.email}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <span className="font-sans text-[13px] text-[#B6A8CC]">
            © {SITE.year} {SITE.org} · {SITE.commission}
          </span>
          <span className="font-sans text-[13px] text-[#B6A8CC]">
            {SITE.credit} ·{" "}
            <a
              href={`https://${SITE.creditUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              {SITE.creditUrl}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
