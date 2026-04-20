import type { AccessibilityAssessment } from "@/types/accessibility";

const screenReaderSpeechRates: Record<AccessibilityAssessment["screenReader"], number> = {
  nvda: 60,
  jaws: 55,
  voiceover: 52,
  orca: 58,
  narrator: 54
};

const screenReaderAnnouncementStyles: Record<AccessibilityAssessment["screenReader"], string> = {
  nvda: "Use short announcements and avoid repeated non-actionable alerts.",
  jaws: "Provide explicit context labels for commands and focused element changes.",
  voiceover: "Prefer concise phrase announcements with punctuation to improve rotor navigation.",
  orca: "Prioritize terminal line-change cues and structural heading navigation.",
  narrator: "Keep status updates limited to state-change events to reduce verbosity fatigue."
};

export function recommendedSpeechRate(reader: AccessibilityAssessment["screenReader"]): number {
  return screenReaderSpeechRates[reader] ?? 55;
}

export function buildAccessibilityNotes(assessment: AccessibilityAssessment): string[] {
  const notes: string[] = [];
  notes.push(screenReaderAnnouncementStyles[assessment.screenReader]);

  if (assessment.usesBrailleDisplay) {
    notes.push("Enable terminal bracketed paste mode and persistent command history for braille review.");
  }

  if (assessment.reduceAuditoryNoise) {
    notes.push("Suppress repetitive hints and disable decorative notification sounds by default.");
  }

  if (assessment.needsHighContrastTerminal) {
    notes.push("Use high-contrast ANSI palette and increase terminal cursor width for orientation.");
  }

  if (assessment.enableAudioDebugCues) {
    notes.push("Add debug task chimes for pass/fail events and breakpoint transitions.");
  }

  return notes;
}

export function getScreenReaderExtension(assessment: AccessibilityAssessment): string[] {
  const base = [
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker",
    "usernamehw.errorlens"
  ];

  const languageExtensions: Record<string, string> = {
    TypeScript: "dbaeumer.vscode-eslint",
    JavaScript: "esbenp.prettier-vscode",
    Python: "ms-python.python",
    Go: "golang.go",
    Rust: "rust-lang.rust-analyzer",
    Java: "redhat.java",
    "C#": "ms-dotnettools.csharp",
    "C++": "ms-vscode.cpptools"
  };

  const chosen = assessment.primaryLanguages
    .map((language) => languageExtensions[language])
    .filter((value): value is string => Boolean(value));

  const screenReaderSpecific: Record<AccessibilityAssessment["screenReader"], string[]> = {
    nvda: ["christian-kohler.path-intellisense"],
    jaws: ["gruntfuggly.todo-tree"],
    voiceover: ["aaron-bond.better-comments"],
    orca: ["ms-vscode.live-server"],
    narrator: ["oderwat.indent-rainbow"]
  };

  return Array.from(new Set([...base, ...chosen, ...screenReaderSpecific[assessment.screenReader]]));
}
