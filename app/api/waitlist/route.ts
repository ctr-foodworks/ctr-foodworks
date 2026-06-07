import { NextResponse } from "next/server";
import { getDb, isDbConfigured, schema } from "@/lib/db";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Waitlist signup capture (replaces Netlify Forms). POST JSON
 * `{ email, source?, botField? }`. Stores into waitlist_signups.
 */
export async function POST(request: Request): Promise<Response> {
  let body: { email?: string; source?: string; botField?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — silently accept (don't tip off bots) but store nothing.
  if (body.botField) return NextResponse.json({ ok: true });

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }
  const source =
    typeof body.source === "string" ? body.source.slice(0, 80) : null;

  if (isDbConfigured()) {
    try {
      await getDb().insert(schema.waitlistSignups).values({ email, source });
    } catch {
      return NextResponse.json(
        { error: "Could not save right now. Please try again." },
        { status: 500 },
      );
    }
  } else {
    // Dev convenience: keep the form UX working before Neon is provisioned.
    console.warn("[waitlist] DATABASE_URL not set — not stored:", email);
  }

  return NextResponse.json({ ok: true });
}
