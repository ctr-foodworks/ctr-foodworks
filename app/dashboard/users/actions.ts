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

function inviteHtml(email: string, tempPw: string): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
    : "/dashboard";
  return emailLayout(
    "You've been invited to CTR Food Works",
    `<p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#4a4038;text-align:center">An account was created for you. Sign in with the email and temporary password below &mdash; you&rsquo;ll set your own password on first login.</p>
     <div style="margin:0 0 26px;padding:18px 20px;background:#faf4ef;border:1px solid #eadfd6;border-radius:12px;text-align:center">
       <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#a89a8e;margin-bottom:6px">Email</div>
       <div style="font-size:15px;font-weight:600;color:#1a1a1a;margin-bottom:16px">${escapeHtml(email)}</div>
       <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#a89a8e;margin-bottom:6px">Temporary password</div>
       <div style="font-family:Menlo,Consolas,monospace;font-size:17px;font-weight:700;letter-spacing:1px;color:#c43725">${escapeHtml(tempPw)}</div>
     </div>
     <div style="text-align:center">
       <a href="${escapeHtml(url)}" style="display:inline-block;background-color:#c43725;background-image:linear-gradient(180deg,#d84a35,#c43725);color:#ffffff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:14px 32px;border-radius:10px">Sign In to the Dashboard</a>
     </div>`,
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
    html: inviteHtml(email, pw),
  });

  revalidatePath("/dashboard/users");
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
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users?flash=user-deleted");
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
    html: inviteHtml(target.email, pw),
  });
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users?flash=password-reset");
}
