import Link from "next/link";
import { ArrowRight, Check, Ear, Keyboard, ShieldCheck, Terminal, Zap } from "lucide-react";

import { LemonCheckoutButton } from "@/components/LemonCheckoutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCheckoutUrlFromEnv, sdkLoaded } from "@/lib/lemonsqueezy";

const faqs = [
  {
    question: "Will this work with enterprise-managed laptops?",
    answer:
      "Yes. The generated bundle separates editor settings from extension installation. If your company blocks specific marketplace extensions, remove only those lines in setup script and keep accessibility defaults intact."
  },
  {
    question: "Do I need to know VS Code JSON settings to use this?",
    answer:
      "No. The assessment translates your workflow into ready-to-use files, then gives a step-by-step checklist with spoken guidance cues."
  },
  {
    question: "Can engineering managers use this for new hires?",
    answer:
      "Yes. Managers can run assessments with incoming teammates and standardize accessible baseline environments across teams and bootcamp cohorts."
  }
];

export default function HomePage() {
  const checkoutUrl = getCheckoutUrlFromEnv();

  return (
    <main>
      <header className="border-b border-[#30363d] bg-[#0d1117]/85 backdrop-blur">
        <div className="section-shell flex h-16 items-center justify-between">
          <p className="text-sm font-semibold tracking-wide text-blue-200">Blind Dev Assistant</p>
          <nav className="flex items-center gap-3 text-sm">
            <Link className="text-slate-300 hover:text-slate-100" href="/assessment">
              Assessment
            </Link>
            <Link className="text-slate-300 hover:text-slate-100" href="/dashboard">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <section className="section-shell py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
              Screen Reader Optimized Coding Environment Setup
            </p>
            <h1 className="font-[var(--font-heading)] text-4xl leading-tight text-slate-100 md:text-5xl">
              Ship code faster with a development setup that actually speaks your workflow.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              Blind Dev Assistant generates a custom VS Code profile, keyboard-first navigation map, and terminal defaults tuned to
              your screen reader, language stack, and debugging habits. Teams stop spending weeks on manual setup and start coding
              with reliable accessibility from day one.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/assessment">
                  Start Accessibility Assessment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {checkoutUrl ? (
                <LemonCheckoutButton checkoutUrl={checkoutUrl} label="Unlock Pro Generator - $19/mo" />
              ) : (
                <p className="rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                  Add `NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID` to enable checkout overlay.
                </p>
              )}
            </div>
            <p className="text-sm text-slate-400">
              Purchase redirect target: <span className="kbd">/api/checkout/claim?order_id={"{order_id}"}</span>
            </p>
          </div>

          <Card className="border-blue-400/30 bg-[#0f172a]">
            <CardHeader>
              <CardTitle>What you get immediately</CardTitle>
              <CardDescription>Practical setup assets you can run in under 15 minutes.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-200">
              <p className="inline-flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-green-300" />
                VS Code `settings.json` with accessibility defaults for navigation, terminal output, and debug cues.
              </p>
              <p className="inline-flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-green-300" />
                Curated extension profile mapped to your primary languages and screen reader behavior.
              </p>
              <p className="inline-flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-green-300" />
                OS-specific setup script plus checklist for high-confidence installation.
              </p>
              <p className="inline-flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-green-300" />
                Audio-guided status feedback for generation and debugging milestones.
              </p>
              <p className="rounded-md border border-[#30363d] bg-[#0b1220] px-3 py-2 text-xs text-slate-400">
                Lemon Squeezy SDK loaded: {sdkLoaded() ? "yes" : "no"}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="pricing" className="section-shell py-12">
        <h2 className="font-[var(--font-heading)] text-3xl text-slate-100">The problem teams keep repeating</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weeks lost to manual setup</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Blind engineers often rebuild keybindings, terminal themes, and extension stacks from scratch for each new machine.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visual-first defaults break flow</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Tooling assumes mouse-driven workflows and noisy UI hints, slowing down keyboard-first debugging and code navigation.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Managers lack setup expertise</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Accessibility teams want inclusive onboarding, but practical implementation details are spread across forums and trial-and-error.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-shell py-12">
        <h2 className="font-[var(--font-heading)] text-3xl text-slate-100">How Blind Dev Assistant solves it</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Ear className="h-4 w-4 text-blue-300" />
                Reader-specific defaults
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              NVDA, JAWS, VoiceOver, Orca, and Narrator tuned output profiles.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Keyboard className="h-4 w-4 text-blue-300" />
                Keyboard-first shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Faster symbol jumps, error cycling, terminal focus shifts, and debug console access.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Terminal className="h-4 w-4 text-blue-300" />
                Terminal contrast controls
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              High-contrast ANSI palettes and readable cursor options for low-friction command line use.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4 text-blue-300" />
                Audio feedback loop
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Spoken status updates for generation outcomes and debugging checkpoints.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-shell py-12">
        <Card className="border-green-400/30 bg-[#0f172a]">
          <CardHeader>
            <CardTitle className="text-2xl">Pricing</CardTitle>
            <CardDescription>One straightforward plan for individuals and teams.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-4xl font-bold text-slate-100">
              $19<span className="text-lg font-normal text-slate-300">/month</span>
            </p>
            <ul className="grid gap-2 text-sm text-slate-200">
              <li className="inline-flex gap-2">
                <ShieldCheck className="h-4 w-4 text-green-300" />
                Unlimited config bundle generation for your workflows
              </li>
              <li className="inline-flex gap-2">
                <ShieldCheck className="h-4 w-4 text-green-300" />
                Ongoing extension profile updates as tools evolve
              </li>
              <li className="inline-flex gap-2">
                <ShieldCheck className="h-4 w-4 text-green-300" />
                Checkout-based access unlock and guided setup dashboard
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              {checkoutUrl ? <LemonCheckoutButton checkoutUrl={checkoutUrl} label="Subscribe via Lemon Squeezy" /> : null}
              <Button asChild variant="secondary" size="lg">
                <Link href="/assessment">Preview your setup profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="section-shell py-12">
        <h2 className="font-[var(--font-heading)] text-3xl text-slate-100">FAQ</h2>
        <div className="mt-6 grid gap-4">
          {faqs.map((faq) => (
            <Card key={faq.question}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-slate-300">{faq.answer}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
