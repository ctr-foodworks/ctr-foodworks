"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/current-user";
import {
  createUser,
  getUserById,
  deleteUser,
  resetUserPassword,
} from "@/lib/users-db";
import { canManageUsers, creatableRoles, canManageTarget } from "@/lib/roles";
import { sendMail, emailLayout, escapeHtml } from "@/lib/email";
import type { UserRole } from "@/lib/db/schema";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type CreateUserState =
  | { error?: string; success?: string; tempPassword?: string }
  | undefined;

function tempPassword(): string {
  // ~12 url-safe chars
  return randomBytes(9).toString("base64url");
}

function str(fd: FormData, k: string): string {
  return String(fd.get(k) ?? "").trim();
}

function inviteHtml(tempPw: string): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin`
    : "/admin";
  return emailLayout(
    "You've been invited to CTR Food Works",
    `<p style="margin:0 0 20px;font-size:14px;line-height:1.65;color:#444">An account was created for you. Use the temporary password below to sign in — you'll set your own on first login.</p>
     <div style="margin:0 0 24px;padding:14px 16px;background:#f5f0eb;border:1px solid #e7e1d9;border-radius:6px">
       <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9a938b;margin-bottom:6px">Temporary password</div>
       <div style="font-family:Menlo,Consolas,monospace;font-size:16px;font-weight:700;color:#1a1a1a">${escapeHtml(tempPw)}</div>
     </div>
     <a href="${escapeHtml(url)}" style="display:inline-block;background:#c43725;color:#ffffff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 24px;border-radius:6px">Sign In</a>`,
  );
}

export async function createUserAction(
  _prev: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const me = await getCurrentUser();
  if (!me || !canManageUsers(me.role)) return { error: "Not authorized." };

  const email = str(formData, "email").toLowerCase();
  const name = str(formData, "name") || null;
  const role = str(formData, "role") as UserRole;

  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email." };
  if (!creatableRoles(me.role).includes(role)) {
    return { error: "You can't create that role." };
  }

  const pw = tempPassword();
  try {
    await createUser({
      email,
      name,
      role,
      passwordHash: bcrypt.hashSync(pw, 12),
    });
  } catch (err) {
    if (err instanceof Error && /unique|duplicate/i.test(err.message)) {
      return { error: "A user with that email already exists." };
    }
    return { error: "Could not create the user." };
  }

  await sendMail({
    to: email,
    subject: "Your CTR Food Works admin access",
    html: inviteHtml(pw),
  });

  revalidatePath("/admin/users");
  return {
    success: "User created and emailed their temporary password.",
    tempPassword: pw,
  };
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const me = await getCurrentUser();
  if (!me || !canManageUsers(me.role)) return;
  const id = Number(str(formData, "id"));
  if (!Number.isFinite(id) || id === me.id) return; // never delete self
  const target = await getUserById(id);
  if (!target || !canManageTarget(me.role, target.role)) return;
  await deleteUser(id);
  revalidatePath("/admin/users");
  redirect("/admin/users?flash=user-deleted");
}

export async function resetUserPasswordAction(
  formData: FormData,
): Promise<void> {
  const me = await getCurrentUser();
  if (!me || !canManageUsers(me.role)) return;
  const id = Number(str(formData, "id"));
  if (!Number.isFinite(id)) return;
  const target = await getUserById(id);
  if (!target || !canManageTarget(me.role, target.role)) return;

  const pw = tempPassword();
  await resetUserPassword(id, bcrypt.hashSync(pw, 12));
  await sendMail({
    to: target.email,
    subject: "Your CTR Food Works password was reset",
    html: inviteHtml(pw),
  });
  revalidatePath("/admin/users");
  redirect("/admin/users?flash=password-reset");
}
