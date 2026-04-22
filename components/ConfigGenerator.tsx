"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCcw } from "lucide-react";

import { assessmentSchema, type AssessmentInput } from "@/lib/assessment-schema";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export function ConfigGenerator() {
  const [assessment, setAssessment] = useState<AssessmentInput | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bda-assessment");
      if (!raw) {
        return;
      }

      const parsed = assessmentSchema.safeParse(JSON.parse(raw));
      if (parsed.success) {
        setAssessment(parsed.data);
      }
    } catch {
      setStatusMessage("Stored assessment could not be read. Re-run the assessment.");
    }
  }, []);

  const summary = useMemo(() => {
    if (!assessment) {
      return [] as string[];
    }

    return [
      `${assessment.operatingSystem} + ${assessment.screenReader}`,
      `${assessment.terminalShell} shell profile`,
      `${assessment.developmentFocus.length} focus areas`,
      `Debug feedback: ${assessment.debugFeedback}`
    ];
  }, [assessment]);

  const handleGenerate = async (): Promise<void> => {
    if (!assessment) {
      setStatusMessage("Complete the assessment before generating your configuration package.");
      return;
    }

    setIsGenerating(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/generate-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(assessment)
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setStatusMessage(data?.error ?? "Config generation failed.");
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = "blind-dev-assistant-config.zip";
      anchor.click();
      URL.revokeObjectURL(objectUrl);
      setStatusMessage("Package generated successfully. Your download should begin now.");
    } catch {
      setStatusMessage("Network error while generating package. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Personalized Setup Package</CardTitle>
        <CardDescription>
          Create a zip package with tuned VS Code settings, keybindings, shell profile,
          and an onboarding guide for your team.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {assessment ? (
          <ul className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
            {summary.map((item) => (
              <li key={item} className="rounded-md border border-slate-700 p-3">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            No saved assessment was found for this browser session.
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={handleGenerate} disabled={isGenerating}>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            {isGenerating ? "Generating package..." : "Generate Config Package"}
          </Button>
          <Link
            href="/assessment"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "inline-flex items-center"
            )}
          >
            <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            Update Assessment
          </Link>
        </div>

        {statusMessage ? <p className="text-sm text-cyan-200">{statusMessage}</p> : null}
      </CardContent>
    </Card>
  );
}
