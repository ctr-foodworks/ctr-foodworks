"use client";

import {
  activateUserAction,
  deactivateUserAction,
  resetUserPasswordAction,
} from "./actions";

export function UserRowActions({
  id,
  email,
  active,
  canManage,
}: {
  id: number;
  email: string;
  active: boolean;
  canManage: boolean;
}) {
  if (!canManage) return null;
  return (
    <div className="flex items-center gap-3">
      <form
        action={resetUserPasswordAction}
        onSubmit={(e) => {
          if (!window.confirm(`Email a new temporary password to ${email}?`)) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="text-[13px] font-medium text-[var(--primary)] hover:underline"
        >
          Reset password
        </button>
      </form>

      {active ? (
        <form
          action={deactivateUserAction}
          onSubmit={(e) => {
            if (
              !window.confirm(
                `Deactivate ${email}? They won't be able to sign in until reactivated.`,
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="rounded-lg px-2 py-1 text-[13px] font-medium text-[#e4524e] transition-colors hover:bg-[#fdeceb]"
          >
            Deactivate
          </button>
        </form>
      ) : (
        <form action={activateUserAction}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="rounded-lg px-2 py-1 text-[13px] font-medium text-[#35b57c] transition-colors hover:bg-[#e7f6ef]"
          >
            Activate
          </button>
        </form>
      )}
    </div>
  );
}
