import { z } from "zod";

export const operatingSystems = ["macos", "windows", "linux"] as const;
export const screenReaders = ["nvda", "jaws", "voiceover", "orca", "narrator"] as const;
export const experienceLevels = ["new", "intermediate", "advanced"] as const;
export const terminalTypes = ["integrated", "external", "both"] as const;

export const languageOptions = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C#",
  "C++"
] as const;

export const accessibilityAssessmentSchema = z.object({
  fullName: z.string().min(2, "Tell us your name so we can personalize setup notes."),
  email: z.string().email("Enter a valid email address for release notes and updates."),
  operatingSystem: z.enum(operatingSystems),
  screenReader: z.enum(screenReaders),
  experienceLevel: z.enum(experienceLevels),
  terminalPreference: z.enum(terminalTypes),
  primaryLanguages: z
    .array(z.enum(languageOptions))
    .min(1, "Pick at least one primary language so extensions are preconfigured."),
  usesBrailleDisplay: z.boolean(),
  enableAudioDebugCues: z.boolean(),
  prefersVimBindings: z.boolean(),
  reduceAuditoryNoise: z.boolean(),
  needsHighContrastTerminal: z.boolean(),
  biggestPainPoint: z
    .string()
    .min(10, "Describe at least one challenge so the generated guide targets real blockers.")
    .max(400)
});

export type AccessibilityAssessment = z.infer<typeof accessibilityAssessmentSchema>;

export interface GeneratedConfigFile {
  path: string;
  content: string;
}

export interface GenerationResult {
  filename: string;
  files: GeneratedConfigFile[];
  setupChecklist: string[];
  preview: {
    extensions: string[];
    keybindings: string[];
    notes: string[];
  };
}
