"use client";

import { useEffect, useState } from "react";

interface AudioFeedbackProps {
  announcement: string;
  assertive?: boolean;
  speak?: boolean;
}

export function AudioFeedback({ announcement, assertive = false, speak = true }: AudioFeedbackProps) {
  const [liveMessage, setLiveMessage] = useState(announcement);

  useEffect(() => {
    setLiveMessage(announcement);

    if (!speak || !announcement || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(announcement);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [announcement, speak]);

  return (
    <p
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      className="sr-only"
      role={assertive ? "alert" : "status"}
    >
      {liveMessage}
    </p>
  );
}
