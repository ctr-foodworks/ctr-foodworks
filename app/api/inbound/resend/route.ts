import { NextResponse } from "next/server";
import { verifyResendWebhook } from "@/lib/resend-webhook";
import { sendMail, emailLayout, escapeHtml } from "@/lib/email";
import { routeFor, notifyRecipients } from "@/lib/contact-routing";
import {
  extractToken,
  normalizeEmail,
  isAutoReply,
  stripQuoted,
  replyAddress,
} from "@/lib/inbound";
import {
  getContactByToken,
  markResponded,
  addContactReply,
  hasSeenInbound,
} from "@/lib/submissions-db";

// Node runtime: uses `crypto` for signature verification. This route is public
// (not behind the auth middleware) — Resend can't hold a session, so it's
// authenticated by the Svix signature instead.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Inbound email relay (Model A). Resend receives a reply sent to
 * `reply+<token>@INBOUND_DOMAIN` and POSTs an `email.received` event here.
 *
 * Two-step, per Resend's design: the webhook carries **metadata only**
 * (email_id, from, to, subject…), so we fetch the actual body/headers from the
 * Received Emails API (GET /emails/receiving/{id}) before acting.
 *
 * Then we map the token → contact thread, record the message, flag "responded"
 * on a staff reply, and relay it on (staff → customer, customer → team).
 *
 * We ACK 200 for anything we can't act on (bad token, no match, auto-reply,
 * duplicate) so Resend stops retrying. A bad signature is 400; a transient
 * fetch failure is 500 so Resend retries later.
 */
export async function POST(req: Request): Promise<Response> {
  const raw = await req.text();

  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (secret) {
    if (!verifyResendWebhook(raw, req.headers, secret)) {
      return NextResponse.json({ error: "bad signature" }, { status: 400 });
    }
  } else {
    console.warn("[inbound] RESEND_WEBHOOK_SECRET not set — signature unchecked");
  }

  let evt: unknown;
  try {
    evt = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true });
  }

  const root = asRecord(evt);
  if (root?.type !== "email.received") return NextResponse.json({ ok: true });

  const data = asRecord(root.data) ?? {};
  const emailId = str(data.email_id);
  // The reply's envelope recipients — the reply+<token>@ address is here.
  const recipients = [...toArray(data.to), ...toArray(data.received_for)];
  const token = extractToken(recipients);
  if (!token || !emailId) return NextResponse.json({ ok: true });

  const msg = await getContactByToken(token).catch(() => null);
  if (!msg) return NextResponse.json({ ok: true });

  // Retry-safe: Resend re-delivers until it gets a 2xx.
  if (await hasSeenInbound(emailId).catch(() => false)) {
    return NextResponse.json({ ok: true });
  }

  // Webhook is metadata-only — fetch the real body + headers.
  const full = await fetchReceivedEmail(emailId).catch(() => null);
  if (!full) {
    // Transient (API hiccup / not-yet-available). 500 → Resend retries.
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }

  const from = str(data.from) ?? full.from;
  if (isAutoReply(from, full.headers)) return NextResponse.json({ ok: true });

  const body = stripQuoted(full.text || htmlToText(full.html));
  // The only two parties in a thread are the stored customer and staff — so if
  // the sender isn't the customer, treat it as a staff reply.
  const fromCustomer = normalizeEmail(from) === normalizeEmail(msg.email);
  const direction: "staff" | "customer" = fromCustomer ? "customer" : "staff";

  await addContactReply({
    messageId: msg.id,
    direction,
    fromAddr: normalizeEmail(from),
    body,
    providerId: emailId,
  });

  const relay = replyAddress(token) ?? undefined;
  const category = metaCategory(msg.meta);

  if (direction === "staff") {
    await markResponded(msg.id);
    // Relay the staff reply out to the customer. From a support address (falls
    // back to MAIL_FROM); reply-to stays the token so the customer's reply loops
    // back here too.
    await sendMail({
      to: msg.email,
      from: process.env.SUPPORT_FROM,
      replyTo: relay,
      subject: "Re: your message to CTR Food Works",
      html: emailLayout(
        "Re: your message to CTR Food Works",
        `<p style="margin:0;white-space:pre-wrap">${escapeHtml(body)}</p>`,
      ),
    });
  } else {
    // Customer replied — loop it back to the team (and observers) so they can
    // answer again.
    const subject = `Customer reply — ${msg.name || msg.email}`;
    const html = emailLayout(
      "Customer reply",
      `<p style="margin:0 0 8px"><strong>From:</strong> ${escapeHtml(
        msg.name || msg.email,
      )} (${escapeHtml(msg.email)})</p>
       <p style="margin:16px 0 4px"><strong>Message</strong></p>
       <p style="margin:0;white-space:pre-wrap">${escapeHtml(body)}</p>`,
    );
    const to = routeFor(category);
    if (to) {
      await sendMail({ to, replyTo: relay, subject, html });
    }
    const observers = notifyRecipients().filter((addr) => addr !== to);
    if (observers.length) {
      await sendMail({ to: observers, replyTo: relay, subject, html });
    }
  }

  return NextResponse.json({ ok: true });
}

// ── Received Emails API ──────────────────────────────────────────────────────

type ReceivedEmail = {
  from: string;
  subject: string;
  text: string;
  html: string;
  headers: Record<string, string>;
};

/** Fetch the full inbound email by id (webhook only gives metadata). */
async function fetchReceivedEmail(id: string): Promise<ReceivedEmail | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  const res = await fetch(
    `https://api.resend.com/emails/receiving/${encodeURIComponent(id)}`,
    { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" },
  );
  if (!res.ok) return null;
  const j = asRecord(await res.json());
  if (!j) return null;
  return {
    from: str(j.from) ?? "",
    subject: str(j.subject) ?? "",
    text: typeof j.text === "string" ? j.text : "",
    html: typeof j.html === "string" ? j.html : "",
    headers: normalizeHeaders(j.headers),
  };
}

// ── Small parsing helpers ────────────────────────────────────────────────────

function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  return typeof v === "string" ? [v] : [];
}

/** Headers may arrive as an object or an array of {name,value}. Lowercase keys. */
function normalizeHeaders(v: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (Array.isArray(v)) {
    for (const h of v) {
      const r = asRecord(h);
      const name = r && str(r.name);
      const value = r && str(r.value);
      if (name && value) out[name.toLowerCase()] = value;
    }
  } else {
    const r = asRecord(v);
    if (r) {
      for (const [k, val] of Object.entries(r)) {
        if (typeof val === "string") out[k.toLowerCase()] = val;
      }
    }
  }
  return out;
}

function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.length ? v : null;
}

function metaCategory(meta: unknown): string | null {
  const r = asRecord(meta);
  return r && typeof r.category === "string" ? r.category : null;
}
