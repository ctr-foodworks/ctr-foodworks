"use server";

import { createResetToken } from "@/lib/password-reset";
import { sendMail, emailLayout } from "@/lib/email";

export type ForgotState = { done?: boolean; error?: string } | undefined;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Request a password-reset link. Always returns the same "done" response
 * regardless of whether the email exists, so the form can't be used to probe
 * which addresses have accounts (no account enumeration). The email send is
 * best-effort and never surfaces its outcome to the caller.
 */
export async function requestResetAction(
  _prev: ForgotState,
  formData: FormData,
): Promise<ForgotState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email." };

  try {
    const result = await createResetToken(email);
    if (result) {
      const base =
        process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ctrfoodworks.com";
      const link = `${base}/dashboard/reset-password?token=${result.token}`;
      await sendMail({
        to: result.user.email,
        subject: "Reset your CTR Food Works password",
        html: emailLayout(
          "Reset your password",
          `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#555">
             We got a request to reset the password for
             <strong>${result.user.email}</strong>. Click below to choose a new
             one. This link expires in one hour and can only be used once.
           </p>
           <p style="margin:0 0 24px">
             <a href="${link}" style="display:inline-block;background:#c43725;color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:14px 26px;border-radius:8px">
               Reset password
             </a>
           </p>
           <p style="margin:0;font-size:12px;line-height:1.6;color:#999">
             If you didn't request this, you can safely ignore this email — your
             password won't change.
           </p>`,
        ),
      });
    }
  } catch {
    // Swallow — never leak whether the address exists or the send failed.
  }

  return { done: true };
}
