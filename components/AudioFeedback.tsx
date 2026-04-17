"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

type AudioFeedbackProps = {
  message: string;
  autoSpeak?: boolean;
};

export function AudioFeedback({ message, autoSpeak = true }: AudioFeedbackProps) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!autoSpeak || !enabled || !message || typeof window === "undefined") {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [message, autoSpeak, enabled]);

  const handleToggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      if (!next && typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-4" aria-live="polite">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-300">{message}</p>
        <Button type="button" variant="secondary" onClick={handleToggle} aria-pressed={enabled}>
          {enabled ? <Volume2 className="h-4 w-4" aria-hidden="true" /> : <VolumeX className="h-4 w-4" aria-hidden="true" />}
          <span className="ml-2 text-xs">{enabled ? "Audio On" : "Audio Off"}</span>
        </Button>
      </div>
    </div>
  );
}
