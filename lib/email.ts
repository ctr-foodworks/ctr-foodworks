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
  /** Override the sender. Defaults to MAIL_FROM. Used by the relay to send
   *  customer-facing replies from a support address instead of notifications@. */
  from?: string;
}): Promise<{ ok: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const from = opts.from || process.env.MAIL_FROM;
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

/** Branded wrapper for transactional emails (PNG logo — SVG won't render in
 *  most mail clients). */
export function emailLayout(title: string, bodyHtml: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ctrfoodworks.com";
  const logo = `${base}/email/ctr-logo.png`;
  return `<div style="margin:0;padding:32px 16px;background:#f5f0eb;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e7e1d9;border-radius:8px;overflow:hidden">
    <div style="padding:28px 32px 22px;text-align:center;border-bottom:3px solid #c43725">
      <img src="${logo}" alt="CTR Food Works" width="170" style="display:inline-block;width:170px;max-width:70%;height:auto" />
    </div>
    <div style="padding:32px">
      <h1 style="margin:0 0 16px;font-size:19px;line-height:1.3;font-weight:800;color:#1a1a1a">${escapeHtml(title)}</h1>
      ${bodyHtml}
    </div>
    <div style="padding:16px 32px;background:#faf8f6;border-top:1px solid #efe9e2;text-align:center">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a938b">CTR Food Works &middot; Downtown Atlanta</div>
    </div>
  </div>
</div>`;
}

export { escapeHtml };
