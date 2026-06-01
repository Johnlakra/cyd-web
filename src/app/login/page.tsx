"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mark } from "@/components/Mark";
import { Reveal } from "@/components/Reveal";

// Posts to the Next.js route handler /api/auth/login, which forwards to the
// backend POST /auth/login and sets the httpOnly cookie. JWT never touches client JS.
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
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

  const inputClass =
    "mt-2 w-full rounded-[10px] border border-line bg-bg px-4 py-3 font-sans text-[15px] text-ink outline-none transition-colors focus:border-violet";

  return (
    <div className="flex min-h-[78vh] items-center justify-center bg-bg px-5 py-14 sm:px-8">
      <Reveal>
        <div className="w-[420px] max-w-full text-center">
          <div className="flex justify-center">
            <Mark size={34} />
          </div>
          <h1 className="mb-2 mt-5 font-serif text-4xl font-medium tracking-[-0.02em] text-ink">
            Welcome back
          </h1>
          <p className="mb-9 font-sans text-base leading-relaxed text-sub">
            Log in to view your venue, room, and personal timetable.
          </p>

          <form
            onSubmit={onSubmit}
            className="rounded-[18px] border border-line bg-paper p-7 text-left sm:p-8"
          >
            <label className="block">
              <span className="font-sans text-[13.5px] font-semibold text-ink">Username</span>
              <input
                name="username"
                required
                autoComplete="username"
                placeholder="Your registered username"
                className={inputClass}
              />
            </label>
            <label className="mt-5 block">
              <span className="font-sans text-[13.5px] font-semibold text-ink">Password</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={inputClass}
              />
            </label>

            {error && (
              <p className="mt-4 font-sans text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-violet px-5 py-3.5 font-sans text-base font-semibold text-paper transition-transform duration-300 ease-lumen hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="mt-6 font-sans text-[13.5px] leading-relaxed text-faint">
            Registration is handled by your parish. Not registered? Speak to your Parish Youth
            Coordinator.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block font-sans text-[14.5px] font-semibold text-ink"
          >
            ← Back to home
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
