"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const assessmentSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  workEmail: z.string().email("Enter a valid work email"),
  screenReader: z.enum(["nvda", "jaws", "voiceover", "orca", "other"]),
  operatingSystem: z.enum(["windows", "macos", "linux"]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  codingFocus: z.string().min(3, "Describe your coding workflow"),
  audioCues: z.boolean(),
  highVerbosity: z.boolean(),
  customNeeds: z.string().optional().default("")
});

export type AssessmentFormData = z.infer<typeof assessmentSchema>;

type AccessibilityAssessmentProps = {
  onSubmit: (values: AssessmentFormData) => void;
  loading?: boolean;
};

export function AccessibilityAssessment({ onSubmit, loading = false }: AccessibilityAssessmentProps) {
  const defaultValues = useMemo<AssessmentFormData>(
    () => ({
      fullName: "",
      workEmail: "",
      screenReader: "nvda",
      operatingSystem: "windows",
      experienceLevel: "intermediate",
      codingFocus: "Backend TypeScript development with frequent debug sessions",
      audioCues: true,
      highVerbosity: false,
      customNeeds: ""
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Accessibility Assessment</CardTitle>
        <CardDescription>
          Tell us how you code so we can generate settings, keybindings, and scripts that match your daily workflow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-label="Accessibility assessment form">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-200">
              Full name
            </label>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName ? <p className="text-sm text-rose-300">{errors.fullName.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="workEmail" className="text-sm font-medium text-slate-200">
              Work email
            </label>
            <Input id="workEmail" type="email" {...register("workEmail")} />
            {errors.workEmail ? <p className="text-sm text-rose-300">{errors.workEmail.message}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="screenReader" className="text-sm font-medium text-slate-200">
                Screen reader
              </label>
              <select
                id="screenReader"
                {...register("screenReader")}
                className="h-11 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <option value="nvda">NVDA</option>
                <option value="jaws">JAWS</option>
                <option value="voiceover">VoiceOver</option>
                <option value="orca">Orca</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="operatingSystem" className="text-sm font-medium text-slate-200">
                Operating system
              </label>
              <select
                id="operatingSystem"
                {...register("operatingSystem")}
                className="h-11 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <option value="windows">Windows</option>
                <option value="macos">macOS</option>
                <option value="linux">Linux</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="experienceLevel" className="text-sm font-medium text-slate-200">
                Experience level
              </label>
              <select
                id="experienceLevel"
                {...register("experienceLevel")}
                className="h-11 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="codingFocus" className="text-sm font-medium text-slate-200">
              Primary coding focus
            </label>
            <Input id="codingFocus" {...register("codingFocus")} />
            {errors.codingFocus ? <p className="text-sm text-rose-300">{errors.codingFocus.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="customNeeds" className="text-sm font-medium text-slate-200">
              Additional accessibility requirements
            </label>
            <Textarea
              id="customNeeds"
              {...register("customNeeds")}
              placeholder="Example: I need fast error navigation and speech cues for failed tests"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
              <input type="checkbox" {...register("audioCues")} className="h-4 w-4 accent-cyan-400" />
              Enable audio cues and audible terminal bell
            </label>
            <label className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
              <input type="checkbox" {...register("highVerbosity")} className="h-4 w-4 accent-cyan-400" />
              Use high-verbosity speech guidance
            </label>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Generating config package..." : "Generate My Configuration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
