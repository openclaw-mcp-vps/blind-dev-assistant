import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardWorkspace } from "@/components/DashboardWorkspace";
import { hasPaidCookie, paywallCookieName } from "@/lib/lemonsqueezy";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasAccess = hasPaidCookie(cookieStore.get(paywallCookieName)?.value);

  if (!hasAccess) {
    redirect("/#pricing");
  }

  return (
    <main className="section-shell py-10 md:py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[var(--font-heading)] text-3xl text-slate-100 md:text-4xl">Setup Dashboard</h1>
          <p className="mt-2 text-sm text-slate-300 md:text-base">
            Build and download your personalized VS Code configuration package.
          </p>
        </div>
        <Link className="text-sm text-blue-300 underline" href="/assessment">
          Edit assessment
        </Link>
      </div>

      <DashboardWorkspace />
    </main>
  );
}
