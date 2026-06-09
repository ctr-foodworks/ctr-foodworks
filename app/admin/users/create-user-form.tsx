"use client";

import { useActionState } from "react";
import { createUserAction, type CreateUserState } from "./actions";
import { ROLE_LABELS } from "@/lib/roles";
import type { UserRole } from "@/lib/db/schema";

const inputClass =
  "h-[44px] w-full border border-[var(--border-light)] bg-white px-3 text-[14px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]";
const labelClass =
  "text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)]";

export function CreateUserForm({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const [state, formAction, isPending] = useActionState<
    CreateUserState,
    FormData
  >(createUserAction, undefined);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 border border-[var(--text-dark)]/10 bg-[#faf8f6] p-5"
    >
      <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)]">
        Invite a user
      </span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Email *</span>
          <input type="email" name="email" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Name</span>
          <input name="name" className={inputClass} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Role *</span>
          <select name="role" required defaultValue={allowedRoles[0]} className={inputClass}>
            {allowedRoles.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {state?.error && (
        <p className="text-[13px] font-light text-[var(--primary)]" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && (
        <div
          className="border border-[#16a34a]/30 bg-[#16a34a]/8 p-3 text-[13px] text-[var(--text-dark)]"
          role="status"
        >
          {state.success}
          {state.tempPassword && (
            <>
              {" "}
              <span className="font-medium">Temporary password:</span>{" "}
              <code className="rounded bg-white px-1.5 py-0.5 font-mono">
                {state.tempPassword}
              </code>
            </>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-[44px] w-fit items-center justify-center bg-[var(--primary)] px-6 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d] disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Creating…" : "Create user"}
      </button>
    </form>
  );
}
