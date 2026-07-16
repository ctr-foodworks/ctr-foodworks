import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { ROLE_LABELS } from "@/lib/roles";
import { ProfileForm } from "./profile-form";
import { AccountForm } from "./account-form";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/dashboard/login");

  return (
    <main className="mx-auto max-w-[760px] px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
        Your Profile
      </h1>
      <p className="mb-8 mt-1 text-sm text-[#828b9e]">
        Signed in as{" "}
        <span className="font-medium text-[#1c2130]">{me.email}</span> ·{" "}
        {ROLE_LABELS[me.role]}
      </p>

      <ProfileForm name={me.name} email={me.email} imageUrl={me.imageUrl} />

      <div className="my-10 h-px bg-[#eef1f7]" />

      <h2 className="mb-6 text-lg font-semibold tracking-tight text-[#1c2130]">
        Change Password
      </h2>
      <AccountForm />
    </main>
  );
}
