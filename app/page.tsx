import Link from "next/link";
import { ArrowRight, CheckCircle2, Keyboard, TerminalSquare, Volume2 } from "lucide-react";

import { UnlockAccessForm } from "@/components/UnlockAccessForm";

const faqs = [
  {
    question: "How do I unlock the tool after paying?",
    answer:
      "Complete checkout, then return to this page and enter the same email you used in Stripe. Once the payment webhook is received, access is unlocked and stored in a secure cookie."
  },
  {
    question: "What does the generated package include?",
    answer:
      "You get VS Code settings, keyboard shortcuts, extension recommendations, terminal profile scripts, and team onboarding docs tailored to your assessment."
  },
  {
    question: "Can engineering managers use this for team onboarding?",
    answer:
      "Yes. The generated package includes a manager guide and a pair-programming checklist so teams can standardize accessible workflows."
  },
  {
    question: "Will this work for remote pair programming?",
    answer:
      "Yes. The setup focuses on keyboard-first commands, structured terminal output, and audio-friendly debugging that translates well to remote collaboration."
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
      <header className="mb-16 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Blind Dev Assistant
        </p>
        <Link
          href="/dashboard"
          className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800"
        >
          Open Dashboard
        </Link>
      </header>

      <section className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
            Accessibility-tools niche
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
            Screen reader optimized coding environment setup
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Configure VS Code, terminal behavior, keyboard navigation, and audio-first
            debugging in one guided workflow. Stop spending weeks wrestling visual-first
            defaults and ship code with an environment that works on day one.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
              className="inline-flex items-center rounded-md bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Buy access for $19/mo
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href="/assessment"
              className="inline-flex items-center rounded-md border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800"
            >
              Start accessibility assessment
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold text-white">Why teams pay for this</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-300" aria-hidden="true" />
              Blind engineers get a productive environment in hours instead of weeks.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-300" aria-hidden="true" />
              Managers onboard developers with a repeatable, auditable setup standard.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-300" aria-hidden="true" />
              Accessibility teams finally have a practical rollout tool instead of docs alone.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">
          <Keyboard className="h-6 w-6 text-cyan-300" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-semibold text-white">Problem</h3>
          <p className="mt-2 text-sm text-slate-300">
            Most developer tools assume visual workflows. Blind engineers lose time
            deciphering keyboard conflicts, inaccessible panels, and noisy diagnostics.
          </p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">
          <TerminalSquare className="h-6 w-6 text-cyan-300" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-semibold text-white">Solution</h3>
          <p className="mt-2 text-sm text-slate-300">
            Assessment-driven templates generate real settings and shell profiles for your
            OS, screen reader, coding stack, and debugging preferences.
          </p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">
          <Volume2 className="h-6 w-6 text-cyan-300" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-semibold text-white">Outcome</h3>
          <p className="mt-2 text-sm text-slate-300">
            Teams get consistent, inclusive tooling with guided audio walkthroughs and
            onboarding artifacts that scale across remote engineering groups.
          </p>
        </article>
      </section>

      <section className="mt-20 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-2xl font-semibold text-white">Pricing</h2>
          <p className="mt-2 text-slate-300">
            Straightforward subscription for individual developers and teams.
          </p>
          <p className="mt-6 text-4xl font-bold text-white">$19<span className="text-xl text-slate-300">/mo</span></p>
          <ul className="mt-6 space-y-2 text-sm text-slate-300">
            <li>Personalized config package generation</li>
            <li>Screen reader-first keyboard and debugging defaults</li>
            <li>Terminal profile templates for macOS, Linux, and Windows</li>
            <li>Audio setup walkthrough and manager onboarding documents</li>
          </ul>
          <a
            href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
            className="mt-6 inline-flex rounded-md bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Subscribe via Stripe
          </a>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-2xl font-semibold text-white">Unlock your workspace</h2>
          <p className="mt-2 text-sm text-slate-300">
            After checkout, enter the same email to activate your assessment and dashboard.
          </p>
          <div className="mt-6">
            <UnlockAccessForm />
          </div>
        </div>
      </section>

      <section className="mt-20 space-y-5">
        <h2 className="text-2xl font-semibold text-white">FAQ</h2>
        <div className="grid gap-4">
          {faqs.map((item) => (
            <article
              key={item.question}
              className="rounded-xl border border-slate-800 bg-slate-950/60 p-5"
            >
              <h3 className="text-base font-semibold text-white">{item.question}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
