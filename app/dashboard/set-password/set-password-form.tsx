"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { setPasswordAction } from "./actions";
import { PasswordChecklist } from "@/components/admin/password-checklist";
import { validatePassword } from "@/lib/validation";

const inputClass =
  "h-12 w-full rounded-lg border border-[var(--border-light)] bg-white px-4 text-[14px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]";
const labelClass =
  "text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)]";

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
        `/api/admin/upload/?filename=${encodeURIComponent(file.name)}`,
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
            className="h-14 w-14 rounded-full border border-[var(--border-light)] object-cover"
          />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--text-dark)]/10 text-[18px] font-semibold text-[var(--text-dark)]">
            {initial}
          </span>
        )}
        <label className="inline-flex cursor-pointer items-center rounded-lg border border-[var(--text-dark)] px-4 py-2 text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white">
          {uploading ? "Uploading…" : preview ? "Change photo" : "Add photo"}
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            className="hidden"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Display name</span>
        <input name="name" defaultValue={defaultName} className={inputClass} />
      </label>

      <label className="flex flex-col gap-2">
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

      <label className="flex flex-col gap-2">
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
        <p className="text-[13px] font-light text-[var(--primary)]" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="mt-1 inline-flex h-12 items-center justify-center rounded-lg bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d] disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Finish setup"}
      </button>
    </form>
  );
}
