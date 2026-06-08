"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, AlertCircle, X } from "lucide-react";

type Tone = "success" | "error";
type Toast = { id: number; message: string; tone: Tone };
type ShowFn = (message: string, tone?: Tone) => void;

const ToastContext = createContext<ShowFn>(() => {});
export const useToast = () => useContext(ToastContext);

const TIMEOUT_MS = 3500;

/**
 * Bottom-right toast provider for the admin. Call `useToast()` to push a toast
 * from any client component, or use flash params (see FlashToasts) for feedback
 * after a server action that redirects.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const show = useCallback<ShowFn>((message, tone = "success") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, tone }]);
    window.setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      TIMEOUT_MS,
    );
  }, []);

  const dismiss = (id: number) =>
    setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[200] flex w-[320px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex animate-[fadeUp_0.3s_ease-out] items-center gap-3 border border-[var(--text-dark)]/10 bg-white px-4 py-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]"
          >
            <span
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white ${
                t.tone === "success"
                  ? "bg-[#16a34a]"
                  : "bg-[var(--primary)]"
              }`}
            >
              {t.tone === "success" ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5" />
              )}
            </span>
            <span className="flex-1 text-[13px] font-medium text-[var(--text-dark)]">
              {t.message}
            </span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="text-[var(--text-muted-dark)] transition-colors hover:text-[var(--text-dark)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const FLASH_MESSAGES: Record<string, string> = {
  "event-created": "Event created.",
  "event-updated": "Event updated.",
  "event-deleted": "Event deleted.",
  "password-updated": "Password updated.",
};

/**
 * Reads a `?flash=...` param (set by server actions that redirect) and turns it
 * into a toast, then strips the param from the URL. Wrap in <Suspense> because
 * it uses useSearchParams.
 */
export function FlashToasts() {
  const show = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const flash = searchParams.get("flash");
    if (!flash) return;
    show(FLASH_MESSAGES[flash] ?? "Done.", "success");
    router.replace(pathname);
  }, [searchParams, pathname, router, show]);

  return null;
}
