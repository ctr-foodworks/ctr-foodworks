import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { ROLE_LABELS } from "@/lib/roles";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProfileForm } from "./profile-form";
import { AccountForm } from "./account-form";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/login");

  return (
    <main className="mx-auto max-w-[760px] px-6 py-12">
      <Eyebrow tone="primary">Account</Eyebrow>
      <h1 className="mt-3 font-display text-[36px] font-black uppercase leading-[1] tracking-[-0.5px]">
        Your Profile
      </h1>
      <div className="mt-3 h-[2px] w-12 bg-[var(--primary)]" />
      <p className="mb-8 mt-5 text-[14px] font-light text-[var(--text-muted-dark)]">
        Signed in as{" "}
        <span className="font-medium text-[var(--text-dark)]">{me.email}</span> ·{" "}
        {ROLE_LABELS[me.role]}
      </p>

      <ProfileForm name={me.name} email={me.email} imageUrl={me.imageUrl} />

      <div className="my-10 h-px bg-[var(--text-dark)]/10" />

      <h2 className="mb-6 font-display text-[24px] font-black uppercase leading-[1] tracking-[-0.5px]">
        Change Password
      </h2>
      <AccountForm />
    </main>
  );
}
