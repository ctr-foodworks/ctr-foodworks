import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { listUsers } from "@/lib/users-db";
import { canManageUsers, creatableRoles, canManageTarget, ROLE_LABELS } from "@/lib/roles";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CreateUserForm } from "./create-user-form";
import { UserRowActions } from "./user-row-actions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/dashboard/login");
  if (!canManageUsers(me.role)) redirect("/dashboard");

  const users = await listUsers();

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12">
      <div className="mb-8">
        <Eyebrow tone="primary">Team</Eyebrow>
        <h1 className="mt-3 font-display text-[36px] font-black uppercase leading-[1] tracking-[-0.5px]">
          Users
          <span className="ml-3 align-middle text-[16px] font-medium text-[var(--text-muted-dark)]">
            {users.length}
          </span>
        </h1>
        <div className="mt-3 h-[2px] w-12 bg-[var(--primary)]" />
      </div>

      <div className="mb-10">
        <CreateUserForm allowedRoles={creatableRoles(me.role)} />
      </div>

      <ul className="flex flex-col border-t border-[var(--text-dark)]/10">
        {users.map((u) => {
          const isSelf = u.id === me.id;
          return (
            <li
              key={u.id}
              className="flex flex-wrap items-center gap-4 border-b border-[var(--text-dark)]/10 py-4"
            >
              <span
                className={`shrink-0 px-2 py-1 text-[9px] font-semibold tracking-[2px] uppercase ${
                  u.role === "super_admin"
                    ? "bg-[var(--primary)] text-white"
                    : u.role === "admin"
                      ? "bg-[var(--text-dark)] text-white"
                      : "bg-[var(--text-dark)]/10 text-[var(--text-dark)]"
                }`}
              >
                {ROLE_LABELS[u.role]}
              </span>
              <span className="min-w-[200px] flex-1 text-[14px] font-medium text-[var(--text-dark)]">
                {u.name || "—"}{" "}
                <span className="font-light text-[var(--text-muted-dark)]">
                  · {u.email}
                </span>
                {isSelf && (
                  <span className="ml-2 text-[10px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)]">
                    (you)
                  </span>
                )}
              </span>
              <UserRowActions
                id={u.id}
                email={u.email}
                canManage={!isSelf && canManageTarget(me.role, u.role)}
                canDelete={!isSelf && canManageTarget(me.role, u.role)}
              />
            </li>
          );
        })}
      </ul>
    </main>
  );
}
