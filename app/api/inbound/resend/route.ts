import { NextResponse } from "next/server";
import { verifyResendWebhook } from "@/lib/resend-webhook";
import { sendMail, emailLayout, escapeHtml } from "@/lib/email";
import { routeFor } from "@/lib/contact-routing";
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
 * `reply+<token>@INBOUND_DOMAIN` and POSTs it here. We:
 *   1. verify the signature,
 *   2. map the token back to a contact thread,
 *   3. record the message + flag "responded" when a staff reply arrives,
 *   4. relay the reply on to the other party (staff → customer, customer → team).
 *
 * We always ACK 200 for anything we can't act on (bad token, no match,
 * auto-reply, duplicate) so Resend doesn't retry a delivery that will never
 * succeed. Only a bad signature returns 400.
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

  const parsed = normalizeInbound(evt);
  if (!parsed) {
    console.warn("[inbound] unparseable payload; top-level keys:", topKeys(evt));
    return NextResponse.json({ ok: true });
  }

  const token = extractToken(parsed.to);
  if (!token) return NextResponse.json({ ok: true });

  const msg = await getContactByToken(token).catch(() => null);
  if (!msg) return NextResponse.json({ ok: true });

  // Retry-safe: Resend re-delivers webhooks until it gets a 2xx.
  if (
    parsed.providerId &&
    (await hasSeenInbound(parsed.providerId).catch(() => false))
  ) {
    return NextResponse.json({ ok: true });
  }

  if (isAutoReply(parsed.from, parsed.headers)) {
    return NextResponse.json({ ok: true });
  }

  const body = stripQuoted(parsed.text);
  // The only two parties in a thread are the stored customer and staff. So if
  // the sender isn't the customer, it's a staff reply.
  const fromCustomer = normalizeEmail(parsed.from) === normalizeEmail(msg.email);
  const direction: "staff" | "customer" = fromCustomer ? "customer" : "staff";

  await addContactReply({
    messageId: msg.id,
    direction,
    fromAddr: normalizeEmail(parsed.from),
    body,
    providerId: parsed.providerId,
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
    // Customer replied — loop it back to the team so they can answer again.
    const to = routeFor(category);
    if (to) {
      await sendMail({
        to,
        replyTo: relay,
        subject: `Customer reply — ${msg.name || msg.email}`,
        html: emailLayout(
          "Customer reply",
          `<p style="margin:0 0 8px"><strong>From:</strong> ${escapeHtml(
            msg.name || msg.email,
          )} (${escapeHtml(msg.email)})</p>
           <p style="margin:16px 0 4px"><strong>Message</strong></p>
           <p style="margin:0;white-space:pre-wrap">${escapeHtml(body)}</p>`,
        ),
      });
    }
  }

  return NextResponse.json({ ok: true });
}

// ── Payload normalization ────────────────────────────────────────────────────
// Resend wraps events as { type, created_at, data }. Inbound field names can
// vary, so we read defensively with fallbacks. If Resend's shape differs, the
// `topKeys` log above shows what actually arrived.

type Parsed = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  headers: Record<string, string>;
  providerId: string | null;
};

function normalizeInbound(evt: unknown): Parsed | null {
  const root = asRecord(evt);
  if (!root) return null;
  const data = asRecord(root.data) ?? root; // some webhooks are flat

  const from = extractAddr(data.from ?? data.sender);
  const toRaw = data.to ?? data.recipient ?? data.recipients ?? [];
  const to = (Array.isArray(toRaw) ? toRaw : [toRaw])
    .map(extractAddr)
    .filter(Boolean);
  if (!from && to.length === 0) return null;

  const headers = normalizeHeaders(data.headers);
  const text =
    typeof data.text === "string"
      ? data.text
      : typeof data.plain === "string"
        ? data.plain
        : typeof data.html === "string"
          ? htmlToText(data.html)
          : "";

  const providerId =
    str(data.email_id) ??
    str(data.message_id) ??
    str(data.id) ??
    (headers["message-id"] || null);

  return {
    from,
    to,
    subject: str(data.subject) ?? "",
    text,
    headers,
    providerId,
  };
}

/** Extract a bare email from a string ("Name <e@x>") or an object shape. */
function extractAddr(v: unknown): string {
  if (typeof v === "string") return v;
  const r = asRecord(v);
  if (r) {
    const a = str(r.address) ?? str(r.email);
    if (a) return a;
  }
  return "";
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

function topKeys(evt: unknown): string[] {
  const r = asRecord(evt);
  return r ? Object.keys(r) : [];
}
