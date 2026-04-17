"use client";

import { useState } from "react";
import { AccessibilityAssessment, type AssessmentFormData } from "@/components/AccessibilityAssessment";
import { ConfigGenerator } from "@/components/ConfigGenerator";

export function AssessmentWorkspace() {
  const [assessmentData, setAssessmentData] = useState<AssessmentFormData | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (data: AssessmentFormData) => {
    setSubmitting(true);
    setAssessmentData(data);
    setTimeout(() => setSubmitting(false), 300);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AccessibilityAssessment onSubmit={handleSubmit} loading={submitting} />
      <ConfigGenerator assessmentData={assessmentData} />
    </div>
  );
}
