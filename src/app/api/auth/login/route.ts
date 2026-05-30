import { NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/auth";

// Forwards to the REAL backend login: POST /auth/login (NOT /api/auth/login —
// the backend mounts authRoutes at /auth). Stores the JWT in an httpOnly cookie.
export async function POST(req: Request) {
  let credentials: { username?: string; password?: string };
  try {
    credentials = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }
  if (!credentials.username || !credentials.password) {
    return NextResponse.json(
      { success: false, message: "username and password are required" },
      { status: 400 }
    );
  }

  const upstream = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const json = await upstream.json().catch(() => ({}));

  if (!upstream.ok || !json?.success) {
    return NextResponse.json(
      { success: false, message: json?.message ?? "Invalid credentials" },
      { status: 401 }
    );
  }

  const token: string | undefined = json.data?.token ?? json.token;
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Login succeeded but no token returned" },
      { status: 502 }
    );
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
