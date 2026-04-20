"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssessmentStore } from "@/store/assessment-store";
import {
  accessibilityAssessmentSchema,
  experienceLevels,
  languageOptions,
  operatingSystems,
  screenReaders,
  terminalTypes,
  type AccessibilityAssessment
} from "@/types/accessibility";

const defaultAssessment: AccessibilityAssessment = {
  fullName: "",
  email: "",
  operatingSystem: "macos",
  screenReader: "nvda",
  experienceLevel: "intermediate",
  terminalPreference: "both",
  primaryLanguages: ["TypeScript"],
  usesBrailleDisplay: false,
  enableAudioDebugCues: true,
  prefersVimBindings: false,
  reduceAuditoryNoise: true,
  needsHighContrastTerminal: true,
  biggestPainPoint: ""
};

interface AccessibilityAssessmentProps {
  ctaLabel?: string;
  onComplete?: (assessment: AccessibilityAssessment) => void;
  redirectTo?: string;
}

export function AccessibilityAssessment({
  ctaLabel = "Save Accessibility Profile",
  onComplete,
  redirectTo
}: AccessibilityAssessmentProps) {
  const [form, setForm] = useState<AccessibilityAssessment>(defaultAssessment);
  const [submitting, setSubmitting] = useState(false);
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const { setDraft } = useAssessmentStore();
  const router = useRouter();

  const languageList = useMemo(() => Array.from(languageOptions), []);

  const setField = <K extends keyof AccessibilityAssessment>(key: K, value: AccessibilityAssessment[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const toggleLanguage = (language: (typeof languageOptions)[number]) => {
    setForm((previous) => {
      const included = previous.primaryLanguages.includes(language);
      const next = included
        ? previous.primaryLanguages.filter((entry) => entry !== language)
        : [...previous.primaryLanguages, language];

      return {
        ...previous,
        primaryLanguages: next.length ? next : previous.primaryLanguages
      };
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const parsed = accessibilityAssessmentSchema.safeParse(form);

    if (!parsed.success) {
      const fieldErrors = parsed.error.issues.reduce<Record<string, string>>((acc, issue) => {
        const key = issue.path[0];
        if (typeof key === "string" && !acc[key]) {
          acc[key] = issue.message;
        }

        return acc;
      }, {});

      setErrorMap(fieldErrors);
      setSubmitting(false);
      return;
    }

    setErrorMap({});
    setDraft(parsed.data);
    onComplete?.(parsed.data);
    if (redirectTo) {
      router.push(redirectTo);
    }
    setSubmitting(false);
  };

  return (
    <Card className="border-[#30363d] bg-[#111827]">
      <CardHeader>
        <CardTitle>Accessibility Assessment</CardTitle>
        <CardDescription>
          Answer a practical setup profile so we can produce usable keybindings, terminal defaults, and extension bundles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={(event) => setField("fullName", event.target.value)}
              className="h-10 rounded-md border border-[#30363d] bg-[#0b1220] px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="name"
              required
            />
            {errorMap.fullName ? <p className="text-sm text-red-300">{errorMap.fullName}</p> : null}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="email">
              Work email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              className="h-10 rounded-md border border-[#30363d] bg-[#0b1220] px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="email"
              required
            />
            {errorMap.email ? <p className="text-sm text-red-300">{errorMap.email}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Operating system</label>
              <Select value={form.operatingSystem} onValueChange={(value) => setField("operatingSystem", value as AccessibilityAssessment["operatingSystem"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an OS" />
                </SelectTrigger>
                <SelectContent>
                  {operatingSystems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item === "macos" ? "macOS" : item === "windows" ? "Windows" : "Linux"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Screen reader</label>
              <Select value={form.screenReader} onValueChange={(value) => setField("screenReader", value as AccessibilityAssessment["screenReader"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a screen reader" />
                </SelectTrigger>
                <SelectContent>
                  {screenReaders.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Coding experience</label>
              <Select
                value={form.experienceLevel}
                onValueChange={(value) => setField("experienceLevel", value as AccessibilityAssessment["experienceLevel"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose your level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item === "new" ? "New to professional coding" : item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Terminal preference</label>
              <Select
                value={form.terminalPreference}
                onValueChange={(value) => setField("terminalPreference", value as AccessibilityAssessment["terminalPreference"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose terminal workflow" />
                </SelectTrigger>
                <SelectContent>
                  {terminalTypes.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item === "integrated"
                        ? "Integrated terminal"
                        : item === "external"
                          ? "External terminal"
                          : "Both"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <fieldset className="grid gap-2 rounded-md border border-[#30363d] p-4">
            <legend className="px-2 text-sm font-medium text-slate-200">Primary languages</legend>
            <p className="text-sm text-slate-300">Extensions and snippets are selected from this list.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {languageList.map((language) => {
                const checked = form.primaryLanguages.includes(language);
                return (
                  <label key={language} className="inline-flex items-center gap-2 text-sm text-slate-100">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleLanguage(language)}
                      className="h-4 w-4 rounded border-[#30363d] bg-[#0b1220]"
                    />
                    {language}
                  </label>
                );
              })}
            </div>
            {errorMap.primaryLanguages ? <p className="text-sm text-red-300">{errorMap.primaryLanguages}</p> : null}
          </fieldset>

          <fieldset className="grid gap-2 rounded-md border border-[#30363d] p-4">
            <legend className="px-2 text-sm font-medium text-slate-200">Accessibility priorities</legend>
            <div className="grid gap-2">
              <label className="inline-flex items-center gap-2 text-sm text-slate-100">
                <input
                  type="checkbox"
                  checked={form.enableAudioDebugCues}
                  onChange={(event) => setField("enableAudioDebugCues", event.target.checked)}
                  className="h-4 w-4 rounded border-[#30363d] bg-[#0b1220]"
                />
                Enable audio cues for debug pass/fail states
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-100">
                <input
                  type="checkbox"
                  checked={form.reduceAuditoryNoise}
                  onChange={(event) => setField("reduceAuditoryNoise", event.target.checked)}
                  className="h-4 w-4 rounded border-[#30363d] bg-[#0b1220]"
                />
                Reduce repeated spoken hints and notification noise
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-100">
                <input
                  type="checkbox"
                  checked={form.needsHighContrastTerminal}
                  onChange={(event) => setField("needsHighContrastTerminal", event.target.checked)}
                  className="h-4 w-4 rounded border-[#30363d] bg-[#0b1220]"
                />
                Use high-contrast terminal palette and wide cursor
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-100">
                <input
                  type="checkbox"
                  checked={form.usesBrailleDisplay}
                  onChange={(event) => setField("usesBrailleDisplay", event.target.checked)}
                  className="h-4 w-4 rounded border-[#30363d] bg-[#0b1220]"
                />
                I use a braille display and need predictable output formatting
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-100">
                <input
                  type="checkbox"
                  checked={form.prefersVimBindings}
                  onChange={(event) => setField("prefersVimBindings", event.target.checked)}
                  className="h-4 w-4 rounded border-[#30363d] bg-[#0b1220]"
                />
                Include ergonomic Vim-style escape helper keybinding
              </label>
            </div>
          </fieldset>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="painPoint">
              Biggest blocker in your current environment
            </label>
            <textarea
              id="painPoint"
              value={form.biggestPainPoint}
              onChange={(event) => setField("biggestPainPoint", event.target.value)}
              className="min-h-28 rounded-md border border-[#30363d] bg-[#0b1220] px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Example: VS Code reads line numbers but misses symbol context when moving between errors, so debugging takes too long."
              required
            />
            {errorMap.biggestPainPoint ? <p className="text-sm text-red-300">{errorMap.biggestPainPoint}</p> : null}
          </div>

          <Button size="lg" type="submit" disabled={submitting}>
            {submitting ? "Saving profile..." : ctaLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
