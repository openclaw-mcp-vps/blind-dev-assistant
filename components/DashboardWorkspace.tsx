"use client";

import Link from "next/link";

import { AccessibilityAssessment } from "@/components/AccessibilityAssessment";
import { ConfigGenerator } from "@/components/ConfigGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/assessment-store";

export function DashboardWorkspace() {
  const draft = useAssessmentStore((state) => state.draft);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Saved Accessibility Profile</CardTitle>
            <CardDescription>
              Update this profile any time your screen reader or development workflow changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300">
              Need to rerun onboarding first? Use the guided form in the <Link className="underline" href="/assessment">assessment flow</Link>.
            </p>
          </CardContent>
        </Card>
        <AccessibilityAssessment ctaLabel="Update Profile" />
      </div>

      <div className="grid gap-6">
        <ConfigGenerator assessment={draft} />
      </div>
    </div>
  );
}
