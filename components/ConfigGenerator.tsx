"use client";

import { useMemo, useState } from "react";
import { Download, Lock, Terminal } from "lucide-react";

import { AudioFeedback } from "@/components/AudioFeedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { buildAccessibilityNotes, getScreenReaderExtension } from "@/lib/screen-reader-utils";
import type { AccessibilityAssessment } from "@/types/accessibility";

interface ConfigGeneratorProps {
  assessment: AccessibilityAssessment | null;
}

function parseChecklistHeader(raw: string | null): string[] {
  if (!raw || typeof window === "undefined") {
    return [];
  }

  try {
    const decoded = window.atob(raw);
    const parsed = JSON.parse(decoded);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function ConfigGenerator({ assessment }: ConfigGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checklist, setChecklist] = useState<string[]>([]);

  const notes = useMemo(() => {
    if (!assessment) {
      return [];
    }

    return buildAccessibilityNotes(assessment);
  }, [assessment]);

  const extensions = useMemo(() => {
    if (!assessment) {
      return [];
    }

    return getScreenReaderExtension(assessment);
  }, [assessment]);

  const generateConfig = async () => {
    if (!assessment) {
      setError("Complete the accessibility assessment first.");
      setAnnouncement("Complete the accessibility assessment before generating a package.");
      return;
    }

    setError(null);
    setIsGenerating(true);
    setAnnouncement("Generating your configuration package.");

    try {
      const response = await fetch("/api/generate-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(assessment)
      });

      if (response.status === 402) {
        setError("Purchase is required before downloading configuration bundles.");
        setAnnouncement("Purchase is required before downloading configuration bundles.");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Generation failed.");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") ?? "attachment; filename=blind-dev-assistant-config.zip";
      const filenameMatch = disposition.match(/filename="?([^";]+)"?/i);
      const filename = filenameMatch?.[1] ?? "blind-dev-assistant-config.zip";

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setChecklist(parseChecklistHeader(response.headers.get("x-setup-checklist")));
      setDialogOpen(true);
      setAnnouncement("Configuration package downloaded. Follow the installation checklist.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to generate config package.");
      setAnnouncement("Generation failed. Review the error message and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!assessment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Accessibility Profile Found</CardTitle>
          <CardDescription>
            Complete the assessment to unlock a tailored VS Code and terminal setup package.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-300">
            The generator needs your screen reader, OS, and workflow preferences to build useful keybindings and scripts.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <AudioFeedback announcement={announcement} speak />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-blue-300" />
            Personalized Config Generator
          </CardTitle>
          <CardDescription>
            Generates downloadable `.vscode` settings, language extensions, and setup scripts tuned for your assistive workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <section className="grid gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Accessibility notes included</h3>
            <ul className="grid gap-2 text-sm text-slate-200">
              {notes.map((note) => (
                <li key={note} className="rounded-md border border-[#30363d] bg-[#0b1220] px-3 py-2">
                  {note}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Preselected extension profile</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {extensions.map((extension) => (
                <li key={extension} className="rounded-md border border-[#30363d] bg-[#0b1220] px-3 py-2 text-sm text-slate-200">
                  {extension}
                </li>
              ))}
            </ul>
          </section>

          {error ? (
            <div className="inline-flex items-center gap-2 rounded-md border border-red-400/40 bg-red-950/30 px-3 py-2 text-sm text-red-200">
              <Lock className="h-4 w-4" />
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={generateConfig} disabled={isGenerating}>
              <Download className="h-4 w-4" />
              {isGenerating ? "Generating package..." : "Download Config Package"}
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="lg">
                  View Setup Checklist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Installation Checklist</DialogTitle>
                  <DialogDescription>
                    Follow these steps after downloading to get your environment working in one pass.
                  </DialogDescription>
                </DialogHeader>
                <ol className="mt-4 grid list-decimal gap-2 pl-5 text-sm text-slate-200">
                  {(checklist.length
                    ? checklist
                    : [
                        "Run the setup script included in the downloaded bundle.",
                        "Restart VS Code and verify keybindings using command palette.",
                        "Run a build task and confirm audio cues announce pass/fail states."
                      ]
                  ).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
