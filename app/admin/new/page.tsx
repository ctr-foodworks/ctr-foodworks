import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EventForm } from "../event-form";

export default function NewEventPage() {
  return (
    <main className="mx-auto max-w-[760px] px-6 py-12">
      <Link
        href="/admin"
        className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)] hover:text-[var(--primary)]"
      >
        ← Back
      </Link>
      <div className="mb-8 mt-4">
        <Eyebrow tone="primary">New</Eyebrow>
        <h1 className="mt-3 font-display text-[36px] font-black uppercase leading-[1] tracking-[-0.5px]">
          Create Event
        </h1>
        <div className="mt-3 h-[2px] w-12 bg-[var(--primary)]" />
      </div>
      <EventForm />
    </main>
  );
}
