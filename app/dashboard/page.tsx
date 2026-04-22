import Link from "next/link";
import { cookies } from "next/headers";

import { AudioGuide } from "@/components/AudioGuide";
import { ConfigGenerator } from "@/components/ConfigGenerator";
import { PAID_ACCESS_COOKIE, verifyPaidAccessToken } from "@/lib/auth";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const paidCookie = cookieStore.get(PAID_ACCESS_COOKIE)?.value;
  const session = verifyPaidAccessToken(paidCookie);

  if (!session.isValid) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-14 md:px-10">
        <div className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-8">
          <h1 className="text-2xl font-semibold text-white">Dashboard locked</h1>
          <p className="mt-3 text-slate-300">
            This workspace is behind a paid access gate. Subscribe on the home page and
            unlock with your purchase email.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800"
          >
            Go to home page
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-12 md:px-10 md:py-16">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Step 2 of 2</p>
        <h1 className="text-3xl font-semibold text-white">Generate and deploy your setup package</h1>
        <p className="max-w-3xl text-slate-300">
          Generate personalized configuration files, download them as a zip, and apply
          the audio walkthrough while setting up your machine.
        </p>
      </header>
      <ConfigGenerator />
      <AudioGuide />
    </main>
  );
}
