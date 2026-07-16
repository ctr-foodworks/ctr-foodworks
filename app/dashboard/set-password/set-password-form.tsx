"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { setPasswordAction } from "./actions";
import { PasswordChecklist } from "@/components/admin/password-checklist";
import { validatePassword } from "@/lib/validation";

const inputClass =
  "h-10 w-full rounded-xl border border-[#e4e8f1] bg-white px-3.5 text-sm text-[#1c2130] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25";
const labelClass =
  "mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#828b9e]";

export function SetPasswordForm({ defaultName }: { defaultName: string }) {
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setError(undefined);
    try {
      const res = await fetch(
        `/api/admin/upload?filename=${encodeURIComponent(file.name)}`,
        { method: "POST", body: file },
      );
      if (!res.ok) throw new Error("upload failed");
      const data = (await res.json()) as { url: string };
      setImageUrl(data.url);
    } catch {
      setError("Photo upload failed. Try again.");
      setPreview("");
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    if (uploading) {
      e.preventDefault();
      setError("Hold on — your photo is still uploading.");
      return;
    }
    const pwError = validatePassword(next);
    if (pwError) {
      e.preventDefault();
      setError(pwError);
      return;
    }
    if (next !== confirm) {
      e.preventDefault();
      setError("Passwords don't match.");
      return;
    }
    setError(undefined);
    setSubmitting(true);
  }

  const initial = (defaultName || "?").charAt(0).toUpperCase();

  return (
    <form
      action={setPasswordAction}
      onSubmit={onSubmit}
      className="flex flex-col gap-5"
    >
      <input type="hidden" name="imageUrl" value={imageUrl} />

      {/* Profile photo */}
      <div className="flex items-center gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Profile"
            className="h-14 w-14 rounded-full border border-[#e4e8f1] object-cover"
          />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef1f7] text-[18px] font-semibold text-[#1c2130]">
            {initial}
          </span>
        )}
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#e4e8f1] bg-white px-4 text-[13px] font-medium text-[#1c2130] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]">
          {uploading ? "Uploading…" : preview ? "Change photo" : "Add photo"}
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            className="hidden"
          />
        </label>
      </div>

      <label className="flex flex-col">
        <span className={labelClass}>Display name</span>
        <input name="name" defaultValue={defaultName} className={inputClass} />
      </label>

      <label className="flex flex-col">
        <span className={labelClass}>New password</span>
        <input
          type="password"
          name="next"
          required
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={inputClass}
        />
      </label>

      <PasswordChecklist value={next} />

      <label className="flex flex-col">
        <span className={labelClass}>Confirm new password</span>
        <input
          type="password"
          name="confirm"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
        />
      </label>

      {error && (
        <p className="text-[13px] text-[#e4524e]" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Finish setup"}
      </button>
    </form>
  );
}
