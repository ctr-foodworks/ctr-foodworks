import { NextResponse } from "next/server";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { sendMail, emailLayout, escapeHtml } from "@/lib/email";
import { routeFor, notifyRecipients } from "@/lib/contact-routing";
import { newReplyToken, replyAddress } from "@/lib/inbound";

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

  // Token for the inbound relay (Model A). Stored now, embedded in the reply-to
  // below so a staff reply can be traced back to this thread.
  const token = newReplyToken();

  if (isDbConfigured()) {
    try {
      await getDb()
        .insert(schema.contactMessages)
        .values({
          name: name || null,
          email,
          message,
          replyToken: token,
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

  // Notify the routed inbox + any always-on observers (e.g. COO). Best-effort;
  // never blocks the response. If the relay is enabled (INBOUND_DOMAIN set),
  // replies go to the token address so we capture them; otherwise reply-to is
  // the customer directly (legacy behavior).
  const relay = replyAddress(token);
  const subject = `New ${category ?? "General"} inquiry — ${name || email}`;
  const html = emailLayout(
    `New ${category ?? "General"} inquiry`,
    `<p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(name || "—")}</p>
     <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(email)}</p>
     <p style="margin:0 0 8px"><strong>Category:</strong> ${escapeHtml(category ?? "General")}</p>
     <p style="margin:16px 0 4px"><strong>Message</strong></p>
     <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>`,
  );

  const to = routeFor(category);
  if (to) {
    await sendMail({ to, replyTo: relay ?? email, subject, html });
  }
  // Observers get every inquiry regardless of category. Separate send so their
  // address isn't exposed to an external routed inbox (e.g. PR).
  const observers = notifyRecipients().filter((addr) => addr !== to);
  if (observers.length) {
    await sendMail({ to: observers, replyTo: relay ?? email, subject, html });
  }

  return NextResponse.json({ ok: true });
}
