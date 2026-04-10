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

## Testing & Coverage
- Unit and component tests use Vitest with jsdom.
- Coverage thresholds set to 80% (statements/branches/functions/lines) for covered modules.
- UI-heavy routes and server-only handlers are excluded from coverage to focus on core logic.

## Notes
- Intro video and welcome overlay are verified in both dev and prod builds.
- RTL/LTR handled via LanguageContext with route-based detection and toggles.
- Team grid supports 16 members with indexed image mapping (T01.jpeg … T016.jpeg).
