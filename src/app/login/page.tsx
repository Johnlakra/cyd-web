"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Mark } from "@/components/Mark";
import { Reveal } from "@/components/Reveal";

// Login, redesigned for youth clarity (Lumen "Welcome back").
// The username rule is cryptic — first 4 letters of name + DDMM of birthday —
// so we BUILD it live from name + birthday and show the formula visually.
// The password is simply the registered phone number, stated plainly.
//
// Submission keeps the real wiring: POST /api/auth/login with the built (or
// typed) username and the phone number as the password. The route handler
// forwards to the backend and sets the httpOnly cookie — JWT never touches JS.

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const FAINT = "#9A8E7C";
const LINE = "rgba(36,27,46,0.12)";

type Tint = { fg: string; bg: string; bd: string };
const NAME_TINT: Tint = { fg: "#5A3E8C", bg: "rgba(90,62,140,0.10)", bd: "rgba(90,62,140,0.22)" };
const DAY_TINT: Tint = { fg: "#B0822B", bg: "rgba(176,130,43,0.12)", bd: "rgba(176,130,43,0.28)" };
const MONTH_TINT: Tint = { fg: "#A35A2A", bg: "rgba(163,90,42,0.12)", bd: "rgba(163,90,42,0.26)" };

const INPUT_CLASS =
  "w-full rounded-[11px] border border-line bg-bg px-[15px] py-[13px] font-sans text-[16px] text-ink outline-none transition-colors focus:border-violet";

// A coloured chip in the live username formula.
function Chip({
  children,
  tint,
  sub,
  filled,
}: {
  children: ReactNode;
  tint: Tint;
  sub: string;
  filled: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="min-w-[44px] rounded-[10px] border px-3 py-[9px] text-center font-sans text-[18px] font-bold tracking-[0.02em] transition-all duration-300 ease-lumen"
        style={{
          color: filled ? tint.fg : FAINT,
          background: filled ? tint.bg : "rgba(36,27,46,0.04)",
          borderColor: filled ? tint.bd : LINE,
        }}
      >
        {children}
      </div>
      <span className="font-sans text-[11px] font-semibold tracking-[0.04em] text-faint">{sub}</span>
    </div>
  );
}

const Plus = () => <span className="pb-[18px] text-[20px] font-light text-faint">+</span>;

export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [manual, setManual] = useState(false); // type username directly
  const [typedUser, setTypedUser] = useState("");
  const [phone, setPhone] = useState("");
  const [showPw, setShowPw] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- username pieces ---
  const letters = name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 4);
  const lettersPadded = letters ? (letters + "xxxx").slice(0, 4) : "";
  const dd = day ? String(day).padStart(2, "0") : "";
  const mm = month
    ? String(MONTHS.indexOf(month as (typeof MONTHS)[number]) + 1).padStart(2, "0")
    : "";
  const builtUser = lettersPadded && dd && mm ? lettersPadded + dd + mm : "";
  const username = manual ? typedUser.trim() : builtUser;

  const ready = Boolean(username) && phone.replace(/\D/g, "").length >= 6;

  function copyUser() {
    if (!username) return;
    try {
      void navigator.clipboard.writeText(username);
    } catch {
      // clipboard unavailable — silently ignore, the username is still visible
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready || loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: phone }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message ?? "Invalid credentials");
        return;
      }
      router.push("/me");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full items-start justify-center bg-bg px-4 pb-[90px] pt-10 sm:px-6 sm:pt-12">
      <Reveal className="w-full max-w-[560px]">
        <div className="w-full text-center">
          <div className="flex justify-center">
            <Mark size={32} />
          </div>
          <h1 className="mb-2 mt-[18px] font-serif text-[32px] font-medium tracking-[-0.02em] text-ink sm:text-[42px]">
            Welcome back
          </h1>
          <p className="mb-[26px] font-sans text-[15px] leading-[1.55] text-sub sm:mb-[30px] sm:text-[16.5px]">
            Two things to log in: your <strong className="text-ink">username</strong> and your{" "}
            <strong className="text-ink">phone number</strong>. We&apos;ll help you find them.
          </p>

          <form
            onSubmit={onSubmit}
            className="rounded-[20px] border border-line bg-paper px-5 pb-7 pt-6 text-left shadow-[0_18px_50px_rgba(36,27,46,0.06)] sm:px-[30px] sm:pb-8 sm:pt-[30px]"
          >
            {/* STEP 1 — USERNAME */}
            <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="whitespace-nowrap font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-gold">
                Step 1 · Username
              </span>
              <button
                type="button"
                onClick={() => setManual(!manual)}
                className="whitespace-nowrap font-sans text-[13px] font-semibold text-violet"
              >
                {manual ? "↺ Build from my name" : "I already know it →"}
              </button>
            </div>

            {!manual ? (
              <>
                <p className="mb-[18px] font-sans text-[13px] leading-[1.5] text-sub">
                  Your username is the{" "}
                  <strong className="text-ink">first 4 letters of your name</strong> + the{" "}
                  <strong className="text-ink">day</strong> and{" "}
                  <strong className="text-ink">month</strong> you were born. Fill these in and
                  we&apos;ll build it for you.
                </p>

                <div className="mb-5 grid grid-cols-1 gap-[14px]">
                  <div>
                    <label className="mb-[7px] block font-sans text-[13px] font-bold tracking-[0.01em] text-ink">
                      Your first name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John"
                      autoComplete="given-name"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-[1fr_1.3fr] sm:gap-3">
                    <div>
                      <label className="mb-[7px] block font-sans text-[13px] font-bold tracking-[0.01em] text-ink">
                        Birth day
                      </label>
                      <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className={`${INPUT_CLASS} cursor-pointer appearance-none`}
                      >
                        <option value="">Day</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-[7px] block font-sans text-[13px] font-bold tracking-[0.01em] text-ink">
                        Birth month
                      </label>
                      <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className={`${INPUT_CLASS} cursor-pointer appearance-none`}
                      >
                        <option value="">Month</option>
                        {MONTHS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* live formula */}
                <div className="rounded-[14px] border border-dashed border-line bg-bg px-3 pb-4 pt-[18px] sm:px-4">
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2.5 sm:gap-2.5">
                    <Chip tint={NAME_TINT} sub="name" filled={!!lettersPadded}>
                      {lettersPadded || "john"}
                    </Chip>
                    <Plus />
                    <Chip tint={DAY_TINT} sub="day" filled={!!dd}>
                      {dd || "DD"}
                    </Chip>
                    <Plus />
                    <Chip tint={MONTH_TINT} sub="month" filled={!!mm}>
                      {mm || "MM"}
                    </Chip>
                    <span className="pb-[18px] text-[20px] font-light text-faint">=</span>
                    <div className="flex flex-col items-center gap-1.5">
                      <button
                        type="button"
                        onClick={copyUser}
                        disabled={!username}
                        className="flex items-center gap-2 rounded-[10px] border-none px-[14px] py-[9px] font-sans text-[19px] font-bold tracking-[0.01em] transition-all duration-300 ease-lumen"
                        style={{
                          cursor: username ? "pointer" : "default",
                          color: username ? "#FFFFFF" : FAINT,
                          background: username ? "#5A3E8C" : "rgba(36,27,46,0.05)",
                        }}
                      >
                        {username || "john0903"}
                        {username && (
                          <span className="text-[12px] font-semibold opacity-85">
                            {copied ? "✓ copied" : "⧉ copy"}
                          </span>
                        )}
                      </button>
                      <span
                        className="font-sans text-[11px] font-bold tracking-[0.04em]"
                        style={{ color: username ? "#5A3E8C" : FAINT }}
                      >
                        your username
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="mb-[14px] mt-1 font-sans text-[13px] leading-[1.5] text-sub">
                  Type the username printed on your ID card (or the one your Parish Youth Coordinator
                  gave you).
                </p>
                <input
                  value={typedUser}
                  onChange={(e) => setTypedUser(e.target.value)}
                  placeholder="e.g. john0903"
                  autoComplete="username"
                  autoFocus
                  className={INPUT_CLASS}
                />
              </>
            )}

            {/* divider */}
            <div className="mb-6 mt-[26px] h-px bg-line" />

            {/* STEP 2 — PASSWORD */}
            <span className="font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-gold">
              Step 2 · Password
            </span>
            <p className="mb-[14px] mt-1.5 font-sans text-[13px] leading-[1.5] text-sub">
              Your password is your <strong className="text-ink">phone number</strong> — all 10
              digits, no spaces or +91.
            </p>
            <div className="relative">
              <span
                className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px]"
                aria-hidden="true"
              >
                📱
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                type={showPw ? "text" : "password"}
                inputMode="numeric"
                autoComplete="current-password"
                placeholder="9876543210"
                className={`${INPUT_CLASS} pl-[42px] pr-[58px] ${showPw ? "tracking-[0.04em]" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 font-sans text-[12.5px] font-semibold text-violet"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <p className="mt-4 font-sans text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            {/* LOG IN */}
            <button
              type="submit"
              disabled={!ready || loading}
              className="mt-6 w-full rounded-full border-none px-4 py-4 font-sans text-[17px] font-semibold text-paper transition-colors duration-300 ease-lumen"
              style={{
                cursor: ready && !loading ? "pointer" : "default",
                background: ready ? "#5A3E8C" : "rgba(90,62,140,0.45)",
              }}
            >
              {loading ? "Logging in…" : ready ? `Log in as ${username}` : "Log in"}
            </button>

            <div className="mt-4 text-center">
              <Link href="/" className="font-sans text-[14px] text-sub">
                Forgot your phone number? Ask your coordinator
              </Link>
            </div>
          </form>

          {/* reassurance */}
          <div className="mt-[22px] flex items-center justify-center gap-2 text-faint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            <p className="m-0 font-sans text-[13px] leading-[1.5] text-faint">
              Your username &amp; ID card come from your parish. Not registered? Speak to your Parish
              Youth Coordinator.
            </p>
          </div>
          <Link
            href="/"
            className="mt-[18px] inline-block font-sans text-[14.5px] font-semibold text-ink"
          >
            ← Back to home
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
