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
