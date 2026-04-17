import Link from "next/link";
import { ArrowRight, Ear, Keyboard, TerminalSquare, ShieldCheck, Users, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const faq = [
  {
    q: "What does the generated package include?",
    a: "You get VS Code settings, keybindings, terminal profile presets, extension recommendations, and a guided install script with spoken status cues."
  },
  {
    q: "Can teams standardize setups across multiple developers?",
    a: "Yes. Accessibility and engineering managers can run assessments for each developer and distribute consistent, screen reader-friendly environment baselines."
  },
  {
    q: "Does this replace a screen reader?",
    a: "No. Blind Dev Assistant optimizes your coding tools so your existing screen reader workflow is faster, clearer, and less fragile."
  },
  {
    q: "How fast is onboarding?",
    a: "Most developers complete assessment + install in under 20 minutes instead of manually tuning settings over multiple weeks."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d1117]">
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-8 lg:p-12">
          <Badge className="mb-4">Screen Reader Optimized Coding Environment Setup</Badge>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-slate-100 sm:text-4xl lg:text-5xl">
            Build a production coding setup for blind developers in one guided workflow
          </h1>
          <p className="mt-5 max-w-3xl text-base text-slate-300 sm:text-lg">
            Blind Dev Assistant generates personalized VS Code settings, terminal profiles, keyboard-first shortcuts,
            and extension bundles tuned for NVDA, JAWS, VoiceOver, and Orca workflows.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Start Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#pricing" className="sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">
                View Pricing
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-slate-100">Why this exists</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Ear className="h-4 w-4 text-cyan-300" />
                Accessibility debt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Blind developers lose weeks tuning editors and terminals because defaults are visual-first and bury
                critical spoken cues.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-4 w-4 text-cyan-300" />
                Team inconsistency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Managers want inclusive onboarding but lack accessibility specialists to configure tools at scale across
                machines and operating systems.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-4 w-4 text-cyan-300" />
                Remote-first pressure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Distributed teams need reproducible setup packs that keep blind engineers productive without waiting for
                ad-hoc IT intervention.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-slate-100">What you get</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Keyboard className="h-4 w-4 text-cyan-300" />
                Keyboard-first navigation
              </CardTitle>
              <CardDescription>Pre-mapped shortcuts for diagnostics, symbol movement, and context history.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TerminalSquare className="h-4 w-4 text-cyan-300" />
                Audible terminal workflows
              </CardTitle>
              <CardDescription>Profiles tuned for spoken confirmation, bell behavior, and shell ergonomics.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                Reusable setup package
              </CardTitle>
              <CardDescription>Downloadable ZIP with settings, keybindings, install script, and documentation.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-cyan-700/40 bg-cyan-950/10">
          <CardHeader>
            <CardTitle className="text-2xl">Pricing</CardTitle>
            <CardDescription>
              Built for individual blind developers and teams delivering inclusive engineering environments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-slate-100">
              $19<span className="text-lg font-medium text-slate-300">/month</span>
            </p>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Unlimited assessments, personalized config generation, workflow-specific extension sets, and ongoing setup
              updates as your stack evolves.
            </p>
            <Link href="/dashboard" className="mt-5 inline-block">
              <Button size="lg">Continue to Checkout</Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-slate-100">FAQ</h2>
        <div className="mt-5 space-y-3">
          {faq.map((item) => (
            <Card key={item.q}>
              <CardHeader>
                <CardTitle className="text-base">{item.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">{item.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
