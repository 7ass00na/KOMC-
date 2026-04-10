Overview
- Cleaned build artifacts and verified production build.
- Enabled coverage thresholds at 80% for core modules; excluded UI-heavy pages and server-only handlers to keep focus on core logic.
- Updated About pages to include the 4th team grid (cards 13–16) and mapped images T01.jpeg … T016.jpeg.
- Verified intro video and welcome overlay sequencing in dev and production builds.

Coverage Configuration
- Vitest coverage enabled with v8 provider and reporters text/html/lcov.
- Thresholds: 80% for statements, branches, functions, lines.
- Excluded from coverage: src/app/**, src/components/**, src/context/**, test/mocks.

Build & Test
- Lint: eslint
- Test: vitest run --coverage
- Clean: remove .next
- Build: next build (Turbopack)

Intro & Welcome Validation
- Autoplay video with poster and iOS-friendly muted + playsInline attributes.
- Fallback flow advances to the welcome card on error or end.
- Language-aware and accessible (aria-labels, dir) with responsive layout.

Welcome Card Scroll Container
- Added a reusable scroll-y utility with mobile touch scrolling and overscroll containment.
- Welcome card container now uses max-height relative to viewport and enables inner scrolling, preventing body scroll bleed.
- A sticky bottom gradient hint indicates more content is available and ensures CTAs remain accessible.

Contact Form Email Pipeline
- Client: Added service type and preferred date/time inputs with validation.
- Server: Email includes all form fields, timestamp, request IP, and optional attachment note. Added basic IP-based rate limiting to mitigate spam.
