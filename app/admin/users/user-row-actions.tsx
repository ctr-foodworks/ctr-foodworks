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
            className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)] transition-colors hover:text-[var(--primary)]"
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
            className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)] transition-colors hover:text-[var(--primary)]"
          >
            Delete
          </button>
        </form>
      )}
    </div>
  );
}
