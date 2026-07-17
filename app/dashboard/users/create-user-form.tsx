"use client";

import { useActionState, useEffect, useRef } from "react";
import { createUserAction, type CreateUserState } from "./actions";
import { useToast } from "@/components/admin/toast";
import { ROLE_LABELS } from "@/lib/roles";
import type { UserRole } from "@/lib/db/schema";

const inputClass =
  "h-10 w-full rounded-xl border border-[#e4e8f1] bg-white px-3.5 text-sm text-[#1c2130] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25";
const labelClass =
  "mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#828b9e]";

export function CreateUserForm({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const [state, formAction, isPending] = useActionState<
    CreateUserState,
    FormData
  >(createUserAction, undefined);

  const show = useToast();
  const lastToast = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (state?.success && state.success !== lastToast.current) {
      lastToast.current = state.success;
      show("User created and invited.", "success");
    }
  }, [state, show]);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-[#e4e8f1] bg-white p-5"
    >
      <span className="text-sm font-semibold text-[#1c2130]">
        Invite a user
      </span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col">
          <span className={labelClass}>Email *</span>
          <input type="email" name="email" required className={inputClass} />
        </label>
        <label className="flex flex-col">
          <span className={labelClass}>Name</span>
          <input name="name" className={inputClass} />
        </label>
        <label className="flex flex-col">
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
        <p className="text-[13px] text-[#e4524e]" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && (
        <div
          className="rounded-xl border border-[#35b57c]/30 bg-[#e7f6ef] p-3 text-[13px] text-[#1c2130]"
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
        className="inline-flex h-10 w-fit items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Creating…" : "Create user"}
      </button>
    </form>
  );
}
