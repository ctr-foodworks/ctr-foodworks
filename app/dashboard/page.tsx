import { redirect } from "next/navigation";

/** The dashboard home is the analytics overview — Reports & Analytics. */
export default function AdminDashboard() {
  redirect("/dashboard/reports");
}
