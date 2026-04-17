import Link from "next/link";
import { redirect } from "next/navigation";
import { hasPaidAccess } from "@/lib/auth";
import { PaywallGate } from "@/components/PaywallGate";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const paid = await hasPaidAccess();

  if (!paid) {
    return (
      <main className="min-h-screen bg-[#0d1117] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-100">Blind Dev Assistant Dashboard</h1>
            <p className="mt-2 text-slate-300">
              Unlock pro access to generate your personalized coding environment package.
            </p>
          </div>
          <PaywallGate />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d1117] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-xl border border-slate-700 bg-slate-900/60 p-8">
        <h1 className="text-3xl font-semibold text-slate-100">Access Active</h1>
        <p className="mt-3 text-slate-300">
          Your paid access is active. Start the assessment and generate your custom VS Code and terminal setup package.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/assessment">
            <Button size="lg">Open Accessibility Assessment</Button>
          </Link>
          <form
            action={async () => {
              "use server";
              const { cookies } = await import("next/headers");
              const cookieStore = await cookies();
              cookieStore.delete("bda_access");
              redirect("/dashboard");
            }}
          >
            <Button type="submit" variant="outline" size="lg">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
