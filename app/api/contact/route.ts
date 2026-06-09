import { NextResponse } from "next/server";
import { getDb, isDbConfigured, schema } from "@/lib/db";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Contact form capture (replaces Netlify Forms). POST JSON
 * `{ name, email, message, category?, botField? }`. Stores into
 * contact_messages; the category lives in `meta`.
 */
export async function POST(request: Request): Promise<Response> {
  let body: {
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    message?: string;
    category?: string;
    botField?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.botField) return NextResponse.json({ ok: true });

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  // Combine for the stored display name; fall back to legacy `name`.
  const name = [firstName, lastName].filter(Boolean).join(" ") ||
    String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const message = String(body.message ?? "").trim();
  const category = String(body.category ?? "").trim() || null;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  if (isDbConfigured()) {
    try {
      await getDb()
        .insert(schema.contactMessages)
        .values({
          name: name || null,
          email,
          message,
          meta: {
            ...(category ? { category } : {}),
            ...(firstName ? { firstName } : {}),
            ...(lastName ? { lastName } : {}),
          },
        });
    } catch {
      return NextResponse.json(
        { error: "Could not send right now. Please try again." },
        { status: 500 },
      );
    }
  } else {
    console.warn("[contact] DATABASE_URL not set — not stored:", email);
  }

  return NextResponse.json({ ok: true });
}
