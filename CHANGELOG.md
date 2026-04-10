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

## TeamFN
- Intro video + welcome overlay: re-verified in dev and production builds; ensured autoplay, fallback, localization, and responsive behavior across viewports.
- Global test run: executed unit/component tests with coverage thresholds enforced (80% on core logic). Verified major user paths and API endpoints with local builds.
- Codebase cleanup: removed stale dependencies earlier; cleared `.next` before fresh production builds; confirmed no orphaned or temp files in repo (logs/tmp ignored by .gitignore).
- Consultation form: removed “Service Type” and “Additional Comments” fields; preserved validations and submission. Added icons before labels and themed date/time icon aligned with RTL/LTR and accessibility requirements.
- Documentation: updated rebuild notes; preserved README summary and changelog entries.
