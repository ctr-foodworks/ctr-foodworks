"use client";

import { Check } from "lucide-react";
import { PASSWORD_RULES } from "@/lib/validation";

/** Live password requirements — each turns green (animated) as it's satisfied. */
export function PasswordChecklist({ value }: { value: string }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(value);
        return (
          <li
            key={rule.label}
            className={`flex items-center gap-2 text-[12px] transition-colors duration-200 ${
              ok ? "text-[#16a34a]" : "text-[var(--text-muted-dark)]"
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-200 ${
                ok
                  ? "border-[#16a34a] bg-[#16a34a] text-white"
                  : "border-[var(--text-dark)]/25 text-transparent"
              }`}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
