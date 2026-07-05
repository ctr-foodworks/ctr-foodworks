import { randomBytes } from "crypto";

/**
 * Pure helpers for the inbound-email relay (Model A). No DB access, so they're
 * easy to reason about and unit-test. The webhook route (app/api/inbound/resend)
 * wires these to Resend's payload; the contact form uses them to stamp a token.
 */

/** The subdomain Resend receives inbound mail on. Unset ⇒ relay disabled, and
 *  the contact form falls back to a direct reply-to (legacy behavior). */
export function inboundDomain(): string | null {
  return process.env.INBOUND_DOMAIN?.trim() || null;
}

/** A unique, email-safe token tying a reply thread back to a contact row. */
export function newReplyToken(): string {
  return randomBytes(12).toString("base64url"); // ~16 url-safe chars
}

/** The plus-address staff and customers reply to, e.g.
 *  `reply+<token>@inbound.ctrfoodworks.com`. Null if the relay is disabled. */
export function replyAddress(token: string): string | null {
  const domain = inboundDomain();
  return domain ? `reply+${token}@${domain}` : null;
}

/** Pull the token out of whichever recipient address is the relay's. */
export function extractToken(recipients: string[]): string | null {
  for (const r of recipients) {
    const m = /reply\+([A-Za-z0-9_-]+)@/i.exec(r);
    if (m) return m[1];
  }
  return null;
}

/** Normalize an address for comparison: bare, lowercased, no display name. */
export function normalizeEmail(input: string): string {
  const m = /<([^>]+)>/.exec(input);
  return (m ? m[1] : input).trim().toLowerCase();
}

/** Best-effort: an auto-reply / bounce / out-of-office we should NOT relay. */
export function isAutoReply(
  from: string,
  headers: Record<string, string>,
): boolean {
  const f = normalizeEmail(from);
  if (/mailer-daemon|postmaster|no-?reply|do-?not-?reply/i.test(f)) return true;
  if (/auto-(replied|generated|notified)/i.test(headers["auto-submitted"] ?? ""))
    return true;
  if (/bulk|auto_reply|junk|list/i.test(headers["precedence"] ?? "")) return true;
  if (headers["x-autoreply"] || headers["x-autorespond"]) return true;
  return false;
}

/** Strip quoted history + signatures so only the new reply text remains.
 *  Heuristic — falls back to the full text if it would strip everything. */
export function stripQuoted(text: string): string {
  if (!text) return "";
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Gmail attribution "On <date>, <name> <email> wrote:" — it commonly wraps
    // across 2–3 lines, so look ahead for the "wrote:" tail before cutting.
    if (/^\s*On\b/.test(line) && /\bwrote:/.test(lines.slice(i, i + 3).join(" "))) {
      break;
    }
    if (/^\s*-{2,}\s*Original Message\s*-{2,}/i.test(line)) break;
    if (/^\s*_{5,}\s*$/.test(line)) break; // Outlook underline separator
    if (out.length && /^\s*From:\s.+/i.test(line)) break; // forwarded header block
    if (/^\s*>/.test(line)) continue; // drop quoted lines
    out.push(line);
  }
  return out.join("\n").trim() || text.trim();
}
