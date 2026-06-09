"use client";

import { removeEvent } from "./actions";

export function DeleteButton({ id, title }: { id: number; title: string }) {
  return (
    <form
      action={removeEvent}
      onSubmit={(e) => {
        if (!window.confirm(`Delete “${title}”? This can't be undone.`)) {
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
  );
}
