import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventRow } from "@/lib/events-db";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EventForm } from "../../event-form";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getEventRow(Number(id));
  if (!row) notFound();

  return (
    <main className="mx-auto max-w-[760px] px-6 py-12">
      <Link
        href="/dashboard/events"
        className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)] hover:text-[var(--primary)]"
      >
        ← Back
      </Link>
      <div className="mb-8 mt-4">
        <Eyebrow tone="primary">Edit</Eyebrow>
        <h1 className="mt-3 font-display text-[36px] font-black uppercase leading-[1] tracking-[-0.5px]">
          {row.title}
        </h1>
        <div className="mt-3 h-[2px] w-12 bg-[var(--primary)]" />
      </div>
      <EventForm event={row} />
    </main>
  );
}
