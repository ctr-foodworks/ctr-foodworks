import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export function DetailRow({ icon: Icon, title, body }: Props) {
  return (
    <div className="flex items-start gap-5 border-b border-[var(--border-light)] py-6 last:border-b-0">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-[var(--bg-dark)] text-white">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h4 className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)]">
          {title}
        </h4>
        <p className="text-[14px] font-light leading-[1.7] text-[var(--text-muted-dark)]">
          {body}
        </p>
      </div>
    </div>
  );
}
