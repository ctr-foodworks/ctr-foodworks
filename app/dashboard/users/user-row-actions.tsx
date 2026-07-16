"use client";

import { deleteUserAction, resetUserPasswordAction } from "./actions";

export function UserRowActions({
  id,
  email,
  canManage,
  canDelete,
}: {
  id: number;
  email: string;
  canManage: boolean;
  canDelete: boolean;
}) {
  if (!canManage && !canDelete) return null;
  return (
    <div className="flex items-center gap-4">
      {canManage && (
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
      )}
      {canDelete && (
        <form
          action={deleteUserAction}
          onSubmit={(e) => {
            if (!window.confirm(`Delete ${email}? This can't be undone.`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="rounded-lg px-2 py-1 text-[13px] font-medium text-[#e4524e] transition-colors hover:bg-[#fdeceb]"
          >
            Delete
          </button>
        </form>
      )}
    </div>
  );
}
