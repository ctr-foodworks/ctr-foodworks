import { auth } from "@/auth";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AccountForm } from "./account-form";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();

  return (
    <main className="mx-auto max-w-[760px] px-6 py-12">
      <Eyebrow tone="primary">Account</Eyebrow>
      <h1 className="mt-3 font-display text-[36px] font-black uppercase leading-[1] tracking-[-0.5px]">
        Change Password
      </h1>
      <div className="mt-3 h-[2px] w-12 bg-[var(--primary)]" />
      <p className="mb-8 mt-5 text-[14px] font-light text-[var(--text-muted-dark)]">
        Signed in as{" "}
        <span className="font-medium text-[var(--text-dark)]">
          {session?.user?.email}
        </span>
        .
      </p>
      <AccountForm />
    </main>
  );
}
