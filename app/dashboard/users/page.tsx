import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { listUsers, purgeExpiredDeactivated } from "@/lib/users-db";
import { canManageUsers, creatableRoles, canManageTarget, ROLE_LABELS } from "@/lib/roles";
import { CreateUserForm } from "./create-user-form";
import { UserRowActions } from "./user-row-actions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/dashboard/login");
  if (!canManageUsers(me.role)) redirect("/dashboard");

  // Best-effort GDPR retention sweep: purge accounts deactivated past the
  // retention window. Runs opportunistically on each Users page load.
  await purgeExpiredDeactivated().catch(() => {});

  const users = await listUsers();

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
          Users
          <span className="ml-3 align-middle text-base font-medium text-[#828b9e]">
            {users.length}
          </span>
        </h1>
        <p className="mt-1 text-sm text-[#828b9e]">Team</p>
      </div>

      <div className="mb-8">
        <CreateUserForm allowedRoles={creatableRoles(me.role)} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e4e8f1] bg-white">
        <ul className="flex flex-col">
          {users.map((u, i) => {
            const isSelf = u.id === me.id;
            const active = !u.deactivatedAt;
            return (
              <li
                key={u.id}
                className={`flex flex-wrap items-center gap-4 px-5 py-3.5 ${
                  i > 0 ? "border-t border-[#eef1f7]" : ""
                } ${active ? "" : "bg-[#faf5f4]"}`}
              >
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    u.role === "super_admin" || u.role === "admin"
                      ? "bg-[#fbeeeb] text-[var(--primary)]"
                      : "bg-[#eef1f7] text-[#828b9e]"
                  }`}
                >
                  {ROLE_LABELS[u.role]}
                </span>
                <span className="min-w-[200px] flex-1 text-sm font-medium text-[#1c2130]">
                  {u.name || "—"}{" "}
                  <span className="font-normal text-[#828b9e]">
                    · {u.email}
                  </span>
                  {isSelf && (
                    <span className="ml-2 text-[11px] font-medium text-[#828b9e]">
                      (you)
                    </span>
                  )}
                  {!active && (
                    <span className="ml-2 rounded-full bg-[#fdf1e3] px-2 py-0.5 text-[10px] font-semibold text-[#b45309]">
                      Deactivated
                    </span>
                  )}
                </span>
                <UserRowActions
                  id={u.id}
                  email={u.email}
                  active={active}
                  canManage={!isSelf && canManageTarget(me.role, u.role)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
