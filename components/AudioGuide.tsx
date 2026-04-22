"use client";

import { useMemo, useState } from "react";
import { PauseCircle, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export function AudioGuide() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const steps = useMemo(
    () => [
      "Open your downloaded zip and keep README_SETUP.md open in one editor tab.",
      "Apply settings.json first, then keybindings.json to ensure shortcut references stay valid.",
      "Install extensions from extensions.txt and restart VS Code.",
      "Load your shell profile and run a test command to validate terminal accessibility.",
      "Start a debug run and cycle through errors with Alt Shift N and Alt Shift P.",
      "Share manager-onboarding.md with your team lead so your workflow remains consistent."
    ],
    []
  );

  const narration = useMemo(
    () =>
      `Blind Dev Assistant guided setup. ${steps
        .map((step, index) => `Step ${index + 1}. ${step}`)
        .join(" ")}`,
    [steps]
  );

  const startNarration = (): void => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopNarration = (): void => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Setup Walkthrough</CardTitle>
        <CardDescription>
          Use built-in narration for a hands-free setup flow when switching between VS Code,
          terminal, and documentation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <ol className="space-y-3 text-sm text-slate-300">
          {steps.map((step, index) => (
            <li key={step} className="rounded-md border border-slate-700 p-3">
              <span className="font-medium text-slate-100">Step {index + 1}:</span> {step}
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={startNarration} disabled={isSpeaking}>
            <PlayCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            Start narration
          </Button>
          <Button type="button" variant="outline" onClick={stopNarration}>
            <PauseCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            Stop narration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
