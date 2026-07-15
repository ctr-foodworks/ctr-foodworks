import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb, schema } from "@/lib/db";
import { xlsxFromTable } from "@/lib/xlsx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function metaCategory(meta: unknown): string {
  if (meta && typeof meta === "object" && "category" in meta) {
    const c = (meta as { category?: unknown }).category;
    if (typeof c === "string") return c;
  }
  return "";
}

/**
 * Contact messages → branded Excel download. Also guarded by middleware (matcher
 * /api/admin/:path*); the auth() check here is defense-in-depth.
 */
export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(schema.contactMessages)
    .orderBy(desc(schema.contactMessages.createdAt));

  return xlsxFromTable("contacts", "Contacts", "Contact messages",
    [
      "ID",
      "Created At",
      "Name",
      "Email",
      "Phone",
      "Category",
      "Message",
      "Read",
      "Responded",
      "Responded At",
    ],
    rows.map((r) => [
      r.id,
      r.createdAt.toISOString(),
      r.name ?? "",
      r.email,
      r.phone ?? "",
      metaCategory(r.meta),
      r.message ?? "",
      r.read ? "yes" : "no",
      r.responded ? "yes" : "no",
      r.respondedAt ? r.respondedAt.toISOString() : "",
    ]),
  );

}
