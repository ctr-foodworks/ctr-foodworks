import Link from "next/link";
import { EventForm } from "../event-form";

export default function NewEventPage() {
  return (
    <main className="mx-auto max-w-[760px] px-6 py-8">
      <Link
        href="/dashboard/events"
        className="text-[13px] font-medium text-[#828b9e] transition-colors hover:text-[var(--primary)]"
      >
        ← Back
      </Link>
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
          Create Event
        </h1>
        <p className="mt-1 text-sm text-[#828b9e]">New</p>
      </div>
      <EventForm />
    </main>
  );
}
