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
 *  most mail clients). Modern CTR treatment: red gradient accent strip, logo,
 *  eyebrow + divider matching the site's design language, and a dark footer.
 *  All styles inline (email-client safe). */
export function emailLayout(title: string, bodyHtml: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ctrfoodworks.com";
  const logo = `${base}/email/ctr-logo.png`;
  return `<div style="margin:0;padding:40px 16px;background:#f7f2ee;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #eadfd6;border-radius:16px;overflow:hidden">
    <div style="height:6px;background-color:#c43725;background-image:linear-gradient(90deg,#c43725,#e05b45)"></div>
    <div style="padding:36px 40px 6px;text-align:center">
      <img src="${logo}" alt="CTR Food Works" width="150" style="display:inline-block;width:150px;max-width:60%;height:auto" />
    </div>
    <div style="padding:18px 40px 36px">
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c43725;font-weight:700;margin-bottom:10px;text-align:center">CTR Food Works</div>
      <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;font-weight:800;color:#1a1a1a;text-align:center">${escapeHtml(title)}</h1>
      <div style="width:48px;height:2px;background:#c43725;margin:0 auto 26px"></div>
      <div style="font-size:15px;line-height:1.7;color:#4a4038">${bodyHtml}</div>
    </div>
    <div style="padding:26px 40px;background:#221712;text-align:center">
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#ffffff;font-weight:700;margin-bottom:8px">CTR Food Works</div>
      <div style="font-size:12px;line-height:1.7;color:rgba(255,255,255,0.55)">Downtown Atlanta</div>
      <a href="${base}" style="display:inline-block;margin-top:8px;font-size:12px;color:#e8a89d;text-decoration:none;font-weight:600">ctrfoodworks.com</a>
    </div>
  </div>
</div>`;
}

export { escapeHtml };
