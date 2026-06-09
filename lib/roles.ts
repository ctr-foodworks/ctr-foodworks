import type { UserRole } from "@/lib/db/schema";

/**
 * Role rules (pure — safe to import on the client for UI gating):
 *   super_admin — full access; can create admins and users; can manage anyone but other super_admins.
 *   admin       — full access; can create/manage normal users only.
 *   user        — full feature access; cannot manage users.
 */

export function canManageUsers(role?: UserRole | null): boolean {
  return role === "super_admin" || role === "admin";
}

/** Roles a given role is allowed to create. */
export function creatableRoles(role?: UserRole | null): UserRole[] {
  if (role === "super_admin") return ["admin", "user"];
  if (role === "admin") return ["user"];
  return [];
}

/** Whether `actor` may delete / reset a user with `target` role. */
export function canManageTarget(
  actor: UserRole | null | undefined,
  target: UserRole,
): boolean {
  if (actor === "super_admin") return target !== "super_admin";
  if (actor === "admin") return target === "user";
  return false;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  user: "User",
};
