# Build Task: blind-dev-assistant

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: blind-dev-assistant
HEADLINE: Screen reader optimized coding environment setup
WHAT: A coding environment configurator that automatically sets up VS Code, terminal, and development tools with optimal screen reader settings. Includes pre-configured extensions, keyboard shortcuts, and audio feedback for debugging and code navigation.
WHY: Blind developers spend weeks configuring accessible dev environments and constantly fight tools built for visual workflows. With remote work growing, companies need inclusive tooling but lack accessibility expertise to set it up properly.
WHO PAYS: Blind and visually impaired software engineers at tech companies, plus engineering managers and accessibility teams responsible for inclusive developer experience. Also coding bootcamps and CS programs teaching accessible programming.
NICHE: accessibility-tools
PRICE: $$19/mo

ARCHITECTURE SPEC:
A Next.js web app that generates personalized VS Code configuration packages and setup scripts for blind developers. Users complete an accessibility assessment, receive a custom config bundle with extensions/settings/shortcuts, and get guided installation with audio feedback.

PLANNED FILES:
- app/page.tsx
- app/assessment/page.tsx
- app/dashboard/page.tsx
- app/api/generate-config/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- components/AccessibilityAssessment.tsx
- components/ConfigGenerator.tsx
- components/AudioFeedback.tsx
- lib/config-templates.ts
- lib/lemonsqueezy.ts
- lib/auth.ts

DEPENDENCIES: next, tailwindcss, @lemonsqueezy/lemonsqueezy.js, next-auth, prisma, @prisma/client, archiver, react-hook-form, zod, lucide-react

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Lemon Squeezy checkout overlay for payments
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}
- NO HEAVY ORMs: Do NOT use Prisma, Drizzle, TypeORM, Sequelize, or Mongoose. If the tool needs persistence, use direct SQL via `pg` (Postgres) or `better-sqlite3` (local), or just filesystem JSON. Reason: these ORMs require schema files and codegen steps that fail on Vercel when misconfigured.
- INTERNAL FILE DISCIPLINE: Every internal import (paths starting with `@/`, `./`, or `../`) MUST refer to a file you actually create in this build. If you write `import { Card } from "@/components/ui/card"`, then `components/ui/card.tsx` MUST exist with a real `export const Card` (or `export default Card`). Before finishing, scan all internal imports and verify every target file exists. Do NOT use shadcn/ui patterns unless you create every component from scratch — easier path: write all UI inline in the page that uses it.
- DEPENDENCY DISCIPLINE: Every package imported in any .ts, .tsx, .js, or .jsx file MUST be
  listed in package.json dependencies (or devDependencies for build-only). Before finishing,
  scan all source files for `import` statements and verify every external package (anything
  not starting with `.` or `@/`) appears in package.json. Common shadcn/ui peers that MUST
  be added if used:
  - lucide-react, clsx, tailwind-merge, class-variance-authority
  - react-hook-form, zod, @hookform/resolvers
  - @radix-ui/* (for any shadcn component)
- After running `npm run build`, if you see "Module not found: Can't resolve 'X'", add 'X'
  to package.json dependencies and re-run npm install + npm run build until it passes.

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.
