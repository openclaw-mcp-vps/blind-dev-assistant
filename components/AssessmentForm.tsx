"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  assessmentSchema,
  developmentFocusOptions,
  type AssessmentInput
} from "@/lib/assessment-schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const defaultValues: AssessmentInput = {
  fullName: "",
  email: "",
  operatingSystem: "macos",
  screenReader: "voiceover",
  terminalShell: "zsh",
  codingLevel: "mid-level",
  developmentFocus: ["Frontend web apps"],
  troubleAreas: "",
  prefersAudioCues: true,
  highContrast: true,
  reducedMotion: true,
  wantsVimBindings: false,
  fontSize: 16,
  debugFeedback: "both",
  needsPairProgrammingHints: true,
  remoteFirst: true
};

export function AssessmentForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<AssessmentInput>({
    resolver: zodResolver(assessmentSchema),
    defaultValues
  });

  const selectedFocus = watch("developmentFocus");

  const focusSelectionSet = useMemo(() => new Set(selectedFocus), [selectedFocus]);

  const onSubmit = async (values: AssessmentInput): Promise<void> => {
    try {
      localStorage.setItem("bda-assessment", JSON.stringify(values));
      localStorage.setItem("bda-assessment-updated-at", new Date().toISOString());
      router.push("/dashboard");
    } catch {
      setSubmitError(
        "Your browser blocked local storage. Disable strict privacy mode and try again."
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accessibility Assessment</CardTitle>
        <CardDescription>
          This assessment tailors VS Code settings, terminal defaults, and debugging
          cues to your real workflow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName ? (
                <p className="text-sm text-rose-400">{errors.fullName.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Checkout email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email ? (
                <p className="text-sm text-rose-400">{errors.email.message}</p>
              ) : null}
            </div>
          </fieldset>

          <fieldset className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="operatingSystem">Operating system</Label>
              <Select id="operatingSystem" {...register("operatingSystem")}>
                <option value="macos">macOS</option>
                <option value="windows">Windows</option>
                <option value="linux">Linux</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="screenReader">Screen reader</Label>
              <Select id="screenReader" {...register("screenReader")}>
                <option value="voiceover">VoiceOver</option>
                <option value="nvda">NVDA</option>
                <option value="jaws">JAWS</option>
                <option value="orca">Orca</option>
                <option value="narrator">Narrator</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="terminalShell">Terminal shell</Label>
              <Select id="terminalShell" {...register("terminalShell")}>
                <option value="zsh">zsh</option>
                <option value="bash">bash</option>
                <option value="powershell">PowerShell</option>
                <option value="fish">fish</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="codingLevel">Experience level</Label>
              <Select id="codingLevel" {...register("codingLevel")}>
                <option value="early-career">Early career</option>
                <option value="mid-level">Mid-level</option>
                <option value="senior">Senior</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fontSize">Preferred editor font size</Label>
              <Input id="fontSize" type="number" min={13} max={28} {...register("fontSize")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="debugFeedback">Debug feedback style</Label>
              <Select id="debugFeedback" {...register("debugFeedback")}>
                <option value="speech">Speech announcements</option>
                <option value="earcons">Audio earcons</option>
                <option value="both">Both speech and earcons</option>
              </Select>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <Label>Development focus</Label>
            <div className="grid gap-3 md:grid-cols-2">
              {developmentFocusOptions.map((focus) => {
                const selected = focusSelectionSet.has(focus);
                return (
                  <label
                    key={focus}
                    className="flex items-center gap-3 rounded-md border border-slate-700 p-3"
                  >
                    <Checkbox
                      checked={selected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setValue("developmentFocus", [...selectedFocus, focus], {
                            shouldValidate: true
                          });
                          return;
                        }

                        setValue(
                          "developmentFocus",
                          selectedFocus.filter((item) => item !== focus),
                          { shouldValidate: true }
                        );
                      }}
                    />
                    <span className="text-sm text-slate-200">{focus}</span>
                  </label>
                );
              })}
            </div>
            {errors.developmentFocus ? (
              <p className="text-sm text-rose-400">{errors.developmentFocus.message}</p>
            ) : null}
          </fieldset>

          <fieldset className="space-y-2">
            <Label htmlFor="troubleAreas">Most painful workflow obstacles</Label>
            <Textarea
              id="troubleAreas"
              {...register("troubleAreas")}
              placeholder="Example: Finding the first failing test quickly in large output and tracking related files while pair programming remotely."
            />
            {errors.troubleAreas ? (
              <p className="text-sm text-rose-400">{errors.troubleAreas.message}</p>
            ) : null}
          </fieldset>

          <fieldset className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-md border border-slate-700 p-3">
              <Checkbox {...register("prefersAudioCues")} />
              <span className="text-sm text-slate-200">Enable editor audio cues</span>
            </label>
            <label className="flex items-center gap-3 rounded-md border border-slate-700 p-3">
              <Checkbox {...register("highContrast")} />
              <span className="text-sm text-slate-200">Use high-contrast theme defaults</span>
            </label>
            <label className="flex items-center gap-3 rounded-md border border-slate-700 p-3">
              <Checkbox {...register("reducedMotion")} />
              <span className="text-sm text-slate-200">Reduce motion and animation</span>
            </label>
            <label className="flex items-center gap-3 rounded-md border border-slate-700 p-3">
              <Checkbox {...register("wantsVimBindings")} />
              <span className="text-sm text-slate-200">Add Vim-style navigation helpers</span>
            </label>
            <label className="flex items-center gap-3 rounded-md border border-slate-700 p-3">
              <Checkbox {...register("needsPairProgrammingHints")} />
              <span className="text-sm text-slate-200">Include pair-programming checklist</span>
            </label>
            <label className="flex items-center gap-3 rounded-md border border-slate-700 p-3">
              <Checkbox {...register("remoteFirst")} />
              <span className="text-sm text-slate-200">Prioritize remote-first collaboration setup</span>
            </label>
          </fieldset>

          {submitError ? <p className="text-sm text-rose-400">{submitError}</p> : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving assessment..." : "Save Assessment and Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
