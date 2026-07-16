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
 *  most mail clients). Ghostline treatment matching the admin dashboard:
 *  soft gray canvas, white card with a hairline border and 16px radius,
 *  left-aligned semibold title, muted footer. All styles inline. */
export function emailLayout(title: string, bodyHtml: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ctrfoodworks.com";
  const logo = `${base}/email/ctr-logo.png`;
  return `<div style="margin:0;padding:40px 16px;background:#f4f6fa;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c2130">
  <div style="max-width:540px;margin:0 auto;background:#ffffff;border:1px solid #e4e8f1;border-radius:16px;overflow:hidden">
    <div style="padding:32px 36px 0">
      <img src="${logo}" alt="CTR Food Works" width="150" style="display:block;width:150px;max-width:60%;height:auto" />
      <div style="margin-top:20px;font-size:13px;color:#828b9e">CTR Food Works</div>
      <h1 style="margin:6px 0 0;font-size:22px;line-height:1.35;font-weight:600;letter-spacing:-0.2px;color:#1c2130">${escapeHtml(title)}</h1>
    </div>
    <div style="padding:18px 36px 30px;font-size:15px;line-height:1.7;color:#4a5264">${bodyHtml}</div>
    <div style="border-top:1px solid #eef1f7;padding:20px 36px 26px">
      <div style="font-size:13px;font-weight:600;color:#1c2130">CTR Food Works</div>
      <div style="margin-top:4px;font-size:12px;line-height:1.6;color:#828b9e">Downtown Atlanta</div>
      <a href="${base}" style="display:inline-block;margin-top:6px;font-size:12px;font-weight:600;color:#c43725;text-decoration:none">ctrfoodworks.com</a>
    </div>
  </div>
</div>`;
}

export { escapeHtml };
