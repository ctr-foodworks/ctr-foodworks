"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * "Live" indicator that re-fetches the current server component tree every
 * 60 seconds via router.refresh(). The interval pauses while the tab is
 * hidden and resumes (immediately re-arming) when it becomes visible again.
 */
export function AutoRefresh({ intervalMs = 60_000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (id === null) {
        id = setInterval(() => router.refresh(), intervalMs);
      }
    };
    const stop = () => {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [router, intervalMs]);

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 ring-1 ring-white/10">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="a-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[2px] text-emerald-300">
        Live
      </span>
      <span className="hidden text-[10px] text-white/40 sm:inline">
        updates every 60s
      </span>
    </span>
  );
}
