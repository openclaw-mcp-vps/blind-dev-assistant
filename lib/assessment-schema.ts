import { z } from "zod";

export const developmentFocusOptions = [
  "Frontend web apps",
  "Backend services",
  "Data engineering",
  "DevOps and infrastructure",
  "Mobile apps",
  "Open source maintenance"
] as const;

export const assessmentSchema = z.object({
  fullName: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter the same email used during checkout."),
  operatingSystem: z.enum(["macos", "windows", "linux"]),
  screenReader: z.enum(["voiceover", "nvda", "jaws", "orca", "narrator"]),
  terminalShell: z.enum(["zsh", "bash", "powershell", "fish"]),
  codingLevel: z.enum(["early-career", "mid-level", "senior"]),
  developmentFocus: z
    .array(z.enum(developmentFocusOptions))
    .min(1, "Choose at least one development focus area."),
  troubleAreas: z
    .string()
    .min(20, "Describe at least one specific workflow challenge."),
  prefersAudioCues: z.boolean(),
  highContrast: z.boolean(),
  reducedMotion: z.boolean(),
  wantsVimBindings: z.boolean(),
  fontSize: z.coerce.number().min(13).max(28),
  debugFeedback: z.enum(["speech", "earcons", "both"]),
  needsPairProgrammingHints: z.boolean(),
  remoteFirst: z.boolean()
});

export type AssessmentInput = z.infer<typeof assessmentSchema>;
