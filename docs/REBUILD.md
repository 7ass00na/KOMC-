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
