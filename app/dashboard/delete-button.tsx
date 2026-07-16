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
        className="rounded-lg px-2 py-1 text-[13px] font-medium text-[#e4524e] transition-colors hover:bg-[#fdeceb]"
      >
        Delete
      </button>
    </form>
  );
}
