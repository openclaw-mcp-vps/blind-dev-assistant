import Link from "next/link";
import { redirect } from "next/navigation";
import { hasPaidAccess } from "@/lib/auth";
import { AssessmentWorkspace } from "@/components/AssessmentWorkspace";

export default async function AssessmentPage() {
  const paid = await hasPaidAccess();

  if (!paid) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#0d1117] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <Link href="/dashboard" className="text-sm text-cyan-300 underline-offset-2 hover:underline">
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold text-slate-100">Generate Your Accessible Dev Setup</h1>
          <p className="max-w-3xl text-slate-300">
            Complete the assessment and download a ready-to-install package with VS Code settings, keybindings,
            extensions, terminal profile, and guided setup notes.
          </p>
        </div>

        <AssessmentWorkspace />
      </div>
    </main>
  );
}
