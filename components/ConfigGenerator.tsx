"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AssessmentFormData } from "@/components/AccessibilityAssessment";
import { AudioFeedback } from "@/components/AudioFeedback";

type ConfigGeneratorProps = {
  assessmentData: AssessmentFormData | null;
};

export function ConfigGenerator({ assessmentData }: ConfigGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Complete the assessment to generate your personalized package.");

  const handleGenerate = async () => {
    if (!assessmentData) {
      setStatus("Assessment is required before config generation.");
      return;
    }

    setLoading(true);
    setStatus("Generating your VS Code and terminal configuration archive.");

    try {
      const response = await fetch("/api/generate-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(assessmentData)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error.error || "Unable to generate configuration package");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "blind-dev-assistant-config.zip";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setStatus(
        "Download complete. Unzip the package and run install.sh to apply settings, keybindings, and recommended extensions."
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unexpected generation error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration Generator</CardTitle>
        <CardDescription>
          Build your install-ready bundle with tuned VS Code settings, keybindings, terminal profile, and extension list.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>ZIP Package</Badge>
          <Badge variant="secondary">settings.json + keybindings.json</Badge>
          <Badge variant="secondary">Install Script Included</Badge>
        </div>

        <AudioFeedback message={status} />

        <Button type="button" className="w-full" onClick={handleGenerate} disabled={loading || !assessmentData}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Building Package
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Config Package
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
