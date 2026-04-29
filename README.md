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
- End-to-end coverage uses Playwright against the locale-aware home flow, intro overlay, WhatsApp CTA, contact metadata, responsive floating-action visibility, and header scroll recovery on mobile/tablet breakpoints.
- WhatsApp QA includes localized floating-button link validation on Arabic/English routes and verification of the updated global `wa.me/971543456591` destination.
- Mobile floating-action QA verifies that the AI chat and WhatsApp icons stay hidden initially, fade in after the scroll threshold, hide again when the footer enters the viewport, and reappear when the visitor scrolls back above the footer boundary.
- Playwright runs with `workers: 1` in `playwright.config.ts` to keep the local cross-project matrix stable while the suite exercises hydrated bilingual UI flows.
- Playwright includes `Mobile Android Chrome` in addition to iPhone, iPad, and desktop browser coverage for the current responsive CTA flows.
- Coverage thresholds set to 80% (statements/branches/functions/lines) for covered modules.
- UI-heavy routes and server-only handlers are excluded from coverage to focus on core logic.
- ESLint ignores generated `coverage/` and `test-results/` artifacts so lint only evaluates source files.
- Latest cleanup and validation details are recorded in `docs/KOMC-VB00020_TEST_REPORT.md`.
- File-level cleanup notes and reasons are recorded in `docs/KOMC-VB00020_CHANGELOG.md`.

## SMTP Setup (Vercel)
- Set the following Env Vars in Vercel Project Settings:
  - Primary consultation mailbox:
    - `CONTACT_PRIMARY_SMTP_HOST=smtp.hostinger.com`
    - `CONTACT_PRIMARY_SMTP_PORT=465`
    - `CONTACT_PRIMARY_SMTP_SECURE=true`
    - `CONTACT_PRIMARY_SMTP_USER=info@khaledomer.com`
    - `CONTACT_PRIMARY_SMTP_PASS=<hostinger-mailbox-password>`
    - `CONTACT_PRIMARY_SMTP_FROM=info@khaledomer.com`
  - BCC consultation mailbox:
    - `CONTACT_BCC_SMTP_HOST=smtp.gmail.com`
    - `CONTACT_BCC_SMTP_PORT=465`
    - `CONTACT_BCC_SMTP_SECURE=true`
    - `CONTACT_BCC_SMTP_USER=ahmedhussano68@gmail.com`
    - `CONTACT_BCC_SMTP_PASS=<gmail-app-password>`
    - `CONTACT_BCC_SMTP_FROM=ahmedhussano68@gmail.com`
  - Routing overrides:
    - `CONTACT_TO_EMAIL=info@khaledomer.com`
    - `CONTACT_BCC_EMAIL=ahmedhussano68@gmail.com`
  - Newsletter mailbox:
    - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
  - Optional tuning:
    - `SMTP_SECURE`, `SMTP_MAX_CONNECTIONS`, `SMTP_MAX_MESSAGES`, `SMTP_TLS_REJECT_UNAUTH`, `SMTP_CONN_TIMEOUT`, `SMTP_GREET_TIMEOUT`, `SMTP_SOCKET_TIMEOUT`
- The contact endpoint verifies both SMTP connections before sending, logs delivery attempts without exposing secrets, and suppresses duplicate submissions for a short in-memory window.
- Default routing for the current maintenance baseline:
  - Newsletter submissions send to `info@khaledomer.ae`
  - Contact/consultation submissions send to `info@khaledomer.com` and mirror a secure blind copy to `ahmedhussano68@gmail.com`
- Shared header and footer social links now render in this order: Facebook, Instagram, TikTok, Email, with secure external-link attributes.

## Notes
- Intro video and welcome overlay are verified in both dev and prod builds.
- Intro overlay and mobile header now expose hydration-ready markers used by E2E coverage before triggering interactive controls.
- Header mobile/tablet navigation is validated against touch-scroll recovery after opening and closing the hamburger menu.
- Floating AI chat and WhatsApp actions now share a footer-aware visibility controller tuned for responsive phone and tablet layouts.
- Root visits to `/` redirect to `/{lang}/home` using cookie or `Accept-Language` detection in `src/app/page.tsx`.
- RTL/LTR handled via LanguageContext with route-based detection and toggles.
- Shared notification templates in `src/lib/notificationTemplates.ts` centralize Arabic/English WhatsApp and email copy, preserving proper URL encoding for Arabic text and official `wa.me` formatting.
- Team grid supports 16 members with indexed image mapping (T01.jpeg … T016.jpeg).
- About page Photo Library is driven by `src/data/photo-library.json` and serves assets from `public/images/Library`.
- Strict unused-code cleanup is verified with `npx tsc --noEmit --noUnusedLocals --noUnusedParameters`; the latest pass removed the unused `next/image` import from `src/components/Footer.tsx`.
