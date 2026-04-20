import Link from "next/link";

import { AccessibilityAssessment } from "@/components/AccessibilityAssessment";

export default function AssessmentPage() {
  return (
    <main className="section-shell py-10 md:py-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-[var(--font-heading)] text-3xl text-slate-100 md:text-4xl">Accessibility Assessment</h1>
        <Link className="text-sm text-blue-300 underline" href="/">
          Back to landing page
        </Link>
      </div>

      <p className="mb-8 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
        This guided profile maps your actual screen reader and coding workflow into concrete VS Code settings and setup scripts. When
        you submit, your profile is saved locally in this browser and used in your dashboard generator.
      </p>

      <AccessibilityAssessment ctaLabel="Save Profile and Continue" redirectTo="/dashboard" />
    </main>
  );
}
