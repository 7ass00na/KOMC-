KOMC site is a bilingual (Arabic/English) Next.js application using the App Router, Tailwind CSS, and Framer Motion. It includes a language/theme context, an intro video with a welcome overlay, and optimized, responsive pages.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Key routes:
- /en and /ar
- /en/about and /ar/about (team grid with 16 cards)
- /Demo.tsx (intro/welcome demo section)

## Scripts
- dev: Start local dev server with HMR
- build: Production build
- start: Run the production server
- lint: ESLint
- test: Vitest with coverage
- clean-build: Remove `.next` and rebuild production output
- e2e: Run with `npx playwright test`

## Testing & Coverage
- Unit and component tests use Vitest with jsdom.
- Integration-style component and route behavior checks run inside the Vitest suite alongside unit coverage.
- End-to-end coverage uses Playwright against the locale-aware home flow, intro overlay, and header scroll recovery on mobile/tablet breakpoints.
- Coverage thresholds set to 80% (statements/branches/functions/lines) for covered modules.
- UI-heavy routes and server-only handlers are excluded from coverage to focus on core logic.
- ESLint ignores generated `coverage/` and `test-results/` artifacts so lint only evaluates source files.
- Latest cleanup and validation details are recorded in `docs/KOMC-VB00011_TEST_REPORT.md`.
- File-level cleanup notes and reasons are recorded in `docs/KOMC-VB00011_CHANGELOG.md`.

## SMTP Setup (Vercel)
- Set the following Env Vars in Vercel Project Settings:
  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
  - Optional routing overrides: CONTACT_TO_EMAIL, CONTACT_BCC_EMAIL
  - Optional: SMTP_SECURE, SMTP_MAX_CONNECTIONS, SMTP_MAX_MESSAGES, SMTP_TLS_REJECT_UNAUTH, SMTP_CONN_TIMEOUT, SMTP_GREET_TIMEOUT, SMTP_SOCKET_TIMEOUT
- The contact endpoint verifies connection before sending and logs delivery status without exposing secrets.
- Default routing for the current maintenance baseline:
  - Newsletter submissions send to `info.khaledomer.adv2@khaledomer.ae`
  - Contact/consultation submissions send to `info.khaledomer.adv2@khaledomer.ae` with BCC to `ahmedhussan068@gmail.com`

## Notes
- Intro video and welcome overlay are verified in both dev and prod builds.
- Header mobile/tablet navigation is validated against touch-scroll recovery after opening and closing the hamburger menu.
- Root visits to `/` redirect to `/{lang}/home` using cookie or `Accept-Language` detection.
- RTL/LTR handled via LanguageContext with route-based detection and toggles.
- Team grid supports 16 members with indexed image mapping (T01.jpeg … T016.jpeg).
- About page Photo Library is driven by `src/data/photo-library.json` and serves assets from `public/images/Library`.
