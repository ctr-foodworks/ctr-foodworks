import "server-only";
import { Resend } from "resend";

/**
 * Thin Resend wrapper. Reads RESEND_API_KEY + MAIL_FROM from env; no-ops with a
 * warning if they're unset (so local dev / pre-config doesn't crash). Never
 * throws — email is best-effort and must not block the request that triggered it.
 */
export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) {
    console.warn("[email] RESEND_API_KEY / MAIL_FROM not set — skipping send");
    return { ok: false };
  }
  try {
    const resend = new Resend(key);
    await resend.emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { ok: false };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Simple branded wrapper for transactional emails. */
export function emailLayout(title: string, bodyHtml: string): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
  <div style="background:#c43725;padding:18px 24px"><span style="color:#fff;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-size:13px">CTR Food Works</span></div>
  <div style="padding:24px">
    <h1 style="font-size:18px;margin:0 0 12px">${escapeHtml(title)}</h1>
    ${bodyHtml}
  </div>
</div>`;
}

export { escapeHtml };
