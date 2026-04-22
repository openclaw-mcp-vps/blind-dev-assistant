import Link from "next/link";
import { cookies } from "next/headers";

import { AssessmentForm } from "@/components/AssessmentForm";
import { PAID_ACCESS_COOKIE, verifyPaidAccessToken } from "@/lib/auth";

export default async function AssessmentPage() {
  const cookieStore = await cookies();
  const paidCookie = cookieStore.get(PAID_ACCESS_COOKIE)?.value;
  const session = verifyPaidAccessToken(paidCookie);

  if (!session.isValid) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-14 md:px-10">
        <div className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-8">
          <h1 className="text-2xl font-semibold text-white">Purchase required</h1>
          <p className="mt-3 text-slate-300">
            The accessibility assessment is available after checkout. Complete payment,
            unlock your access on the home page, then return here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
      <header className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Step 1 of 2</p>
        <h1 className="text-3xl font-semibold text-white">Complete your accessibility assessment</h1>
        <p className="max-w-2xl text-slate-300">
          Your answers drive all generated configuration files, audio instructions, and
          team onboarding documents.
        </p>
      </header>
      <AssessmentForm />
    </main>
  );
}
