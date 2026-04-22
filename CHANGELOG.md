## Komc-VB0012
- Cleanup: Removed verified dead code across admin, editor, intro, and shared UI modules without changing the current bilingual routing behavior.
- E2E alignment: Updated Playwright coverage to match the live locale redirect flow from `/` to `/{lang}/home` and the current mobile/tablet intro overlay behavior.
- QA: Re-ran ESLint, Vitest with coverage, Playwright, and a clean production build successfully after the cleanup pass.

## Komc-VB0011
- Cases imagery: Updated the five case study cards to use the new uploaded assets in `public/images/Cases` and kept the home case-study section in sync through the shared `CasesOverview` component.
- News imagery: Updated the three news cards to use the new uploaded assets in `public/images/News` across both the full News pages and the home `Legal Knowledge & Updates` section.
- Cleanup: Removed obsolete legacy image references tied to deleted `public/images/Case` and flat `public/images/Services` files, and repointed remaining fallbacks/contact visuals to the new folder-based service assets.
- QA: Re-ran file diagnostics and prepared the project for a clean test/build validation cycle.

## TeamFN
- Updated AboutTeamGrid to replace Card 4 with Aisaa AL‑Qaydi (EN) / عيسى القيدي (AR), including specialization, description, regions, experience, and competency.
- Implemented indexed image mapping for 16 team cards (T01.jpeg … T016.jpeg) with safe fallback to existing `src`.
- Ensured cards 13–16 render by adding a 4th grid on About pages with `startIndex=12` (EN/AR).
- Added language toggle on Welcome card and wired CTA navigation to selected language.
- Added Welcome card demo section at /Demo.tsx for QA.
- Test configuration: enabled coverage with thresholds at 80% for core modules and excluded UI-heavy routes/server handlers from coverage.
- Clean build: removed .next artifacts; rebuilt production bundle successfully.
- Documentation: updated README and added docs to outline cleanup and build changes.

## WelcomeCardUPD
- Implemented dedicated scroll container for the welcome card, matching legal modal behavior: overflow-y auto, -webkit-overflow-scrolling: touch, overscroll-behavior contain, with a sticky gradient hint.
- Prevented body scroll while the intro overlay is visible.
- Enhanced contact form to include service type and preferred date/time fields with client-side validation.
- API contact route: added serviceType and preferredDateTime to emails, appended request timestamp and client IP, and added simple rate limiting by IP.
- Completed dependency cleanup and rebuilt production bundle; tests pass with coverage thresholds enforced.

## ConsFormUPD
- Footer: Updated bilingual legal bar text per specification while preserving all links.
- Contact form: Added preferred contact method and additional comments fields, with validation.
- Email pipeline: Localized subjects, salutations, and section headers; included timestamp and requester IP in emails; honeypot and email format checks added; delivery success logging.
- Tests: Added unit test for email subject generation across languages.

## Komc-V001
- Welcome Card UX: Added sticky header behavior for mobile/tablet, keeping top image/divider pinned; implemented parallax fade for text and smooth reveal of CTAs during scroll with requestAnimationFrame for 60fps.
- Scroll Containers: Introduced `.scroll-xy` utility with momentum scrolling and overscroll containment to prevent body scroll bleed; horizontal scrollbar enabled where needed.
- Language Defaulting: Persist language choice on CTA click via `site_lang` cookie + localStorage; routes to correct localized pages.
- SMTP: Secure, pooled SMTP transport reading from environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, and optional tuning). TLS enabled, connection verification added, structured errors on failure, and non-sensitive delivery logs.
- Tests & Coverage: Full suite executed with coverage thresholds (≥80% for core logic); added scroll guard tests and email subject tests.
- Cleanup: Removed build artifacts, pruned/deduped dependencies; fresh install and production build validated. Lint and type checks passed.
- Docs: Updated README and docs with SMTP configuration notes, testing/build steps, and UX changes for the welcome overlay.

## Komc-BV0002
- Hero slow-motion stability (Vercel): Ensured animation initializes only after client hydration to avoid SSR/CSR motion mismatches; added mirrored infinite keyframes and hydration-aware keys to prevent stalls in production. Verified across Chrome, Safari, and Samsung Internet.
- SMTP reliability: Added transporter.verify() and exponential backoff retry (500ms/1500ms/3000ms) on transient errors with structured logging and safe messages; kept TLS/pooling with timeouts.
- Contact form: Client now appends precise error details to the friendly message; attachment cap raised to 25 MB with clear UI guidance; server responds 413 when exceeded.
- Mobile welcome card: Separated scroll layer for text/buttons with pinned image column; CTAs sticky inside the scroll pane for guaranteed reachability; momentum/touch scroll tuned.

## Komc-VB0003
- Hero: Added image-on-load gating (onLoadingComplete) for the active slide so slow-motion begins only when the hero image is ready in production; combined with hydration gating and mirrored animation loops for consistent playback on Vercel.
- Welcome Card: Introduced scoped styles (welcome-card.module.css) for sticky media, independent scroll pane, and CTA dock; preserved accessibility and momentum scroll interoperability.
- Tests: Added Playwright config and e2e test for mobile/tablet scroll behavior and text fade. Excluded e2e and Playwright config from tsconfig to keep production builds clean.
- Build Health: Re-verified lint, tests, and production build with strict TypeScript enabled; no errors or warnings.
 - Lint/Tests Update: ESLint now ignores e2e and Playwright config; Vitest excludes e2e and node_modules tests and explicitly includes only src/**/__tests__ suites; local shim added for Playwright types to avoid type resolution warnings without adding dev deps.

## Komc-VB0005
- Testing: Ran full automated unit test suite (Vitest) with coverage ≥80%, lint, and production build; manual validation on welcome overlay, RTL/LTR layout, and contact form submission with error reporting; verified dark-mode icon contrast.
- Cleanup: Removed .next and temporary files (*.tmp, *.log, .DS_Store); executed fresh install (npm ci); confirmed no vulnerabilities and pruned artifacts.
- Theme & i18n: Adjusted inline badge icons to inherit currentColor, applied dark-mode icon tokens, fixed Arabic welcome label for visitor types.
- Build process: Re-validated Next.js production build output; no TypeScript or ESLint errors.
- Routing & SEO: Added /en/home and /ar/home home routes with redirects from /en and /ar, plus cookie-based root redirect via middleware to avoid duplicate content and support language-preference navigation.
- Security & Docs: Added CSP report-only and security headers; added ExternalLink component and external linking strategy documentation.

## Komc-VB0006
- Loading Cursor: Removed duplicate loading cursor behavior in welcome CTA flow by skipping global auto link-triggered loading for welcome CTAs and preventing header-level loading animation for welcome events; enforced a single global waiting cursor for exactly 3 seconds with no flicker.
- Welcome CTA Flow: Standardized bilingual CTA labels and routing for home/services (AR: /ar/home, /ar/service; EN: /en/home, /en/service) while keeping the address bar domain-only during intro and welcome.
- Routing: Added 301 normalization for localized routes (case normalization + legacy /about and /contact redirects to /about-us and /contact-us) and set Content-Language header for localized pages.
- QA: Re-ran lint, unit tests with coverage, and production build successfully.

## Komc-VB0007
- Welcome Language Sync: Fixed the edge case where the intro controls were in English but the welcome card remained Arabic by syncing welcome-card language to the active route language unless the user manually switches it.
- Root Locale Redirect: Root route now redirects to /{lang}/home on first visit using Accept-Language (cookie overrides), ensuring Arabic users land on /ar/home and English users land on /en/home.
- Loader Visual Consistency: Unified global loading icon across welcome/default variants and removed secondary header loading cursor/spinner behavior to ensure a single consistent cursor.
- Dependency Cleanup: Removed unused dependencies flagged by depcheck (@ai-sdk/react, eslint-config-next, eslint-plugin-no-unsanitized, eslint-plugin-security, @testing-library/jest-dom); refreshed lockfile and validated clean installs.
- Return Visits: Added cookie-based last-visited route tracking and root redirect logic so repeat visits within 24 hours go directly to the previously visited page without replaying the intro/welcome; after 24 hours the intro/welcome flow runs again.

## Komc-VB0008 (DevOps-01)
- QA: Ran fresh install (npm ci), lint, unit tests with coverage, production build, and production server smoke tests across key bilingual routes and core API endpoints.
- Security: Confirmed npm audit reports 0 high-severity vulnerabilities; CSP remains in report-only mode for safe rollout.
- Build Hygiene: Cleaned build artifacts and temporary files; ensured repo remains reproducible via clean/build scripts.
- Tooling: Added @playwright/test as a dev dependency to satisfy e2e/test config references (e2e runs remain opt-in).
- Docs: Added docs/DEVOPS-01_TEST_REPORT.md with detailed verification outputs and manual cross-browser checklist.

## Komc-VB0009
- Photo Library UX: Improved mobile/tablet controls to keep tabs and sort aligned on one line without wrapping; enhanced modal stacking and added touch-first closing (tap outside, large close button, swipe-down to close with smooth transitions).
- QA: Re-ran lint, unit tests with coverage, and production build successfully after the UI changes.

## Komc-VB0010
- Footer: Updated the footer theme label to bilingual text with `Website Theme` in English and `تصميم الموقع` in Arabic while preserving existing footer styling and RTL/LTR behavior.
- QA: Re-ran cleanup, fresh install, audit, lint, unit tests with coverage, production build, and production smoke checks on key public routes and validation-heavy API endpoints.
