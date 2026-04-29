# KOMC-VB00018 Change Log

## Summary

- Updated newsletter and consultation email delivery to `info@khaledomer.ae`.
- Kept consultation BCC delivery to `ahmedhussan068@gmail.com`.
- Refined the consultation email copy and metadata to improve follow-up clarity.
- Removed one confirmed unused frontend import after a strict unused-code audit.
- Restored the root locale redirect in `src/app/page.tsx` for the current Next.js 16 setup.
- Stabilized intro-overlay and mobile-header hydration so automated and manual interactions hit live client handlers instead of SSR-only markup.
- Updated Playwright coverage and runner configuration to reflect the shipped intro flow and stable local execution strategy.
- Included the existing team-card content edits already present in the worktree.

## Root Cause Analysis

- Email routing
  - Root cause: the subscribe API route, contact API route, shared social email link, and related tests/docs still referenced the old `info.komc23@gmail.com` address.

- Consultation email message
  - Root cause: the message body did not clearly instruct the receiving team how to follow up and did not expose a normalized lead-source label or submitted-at row inside the rendered email.

- Unused-code cleanup
  - Root cause: the active ESLint setup passed clean, but a stricter TypeScript unused-code pass still detected an unused `Image` import in `src/components/Footer.tsx`.

- Root redirect behavior
  - Root cause: the codebase previously relied on `middleware.ts`, but the active Next.js 16 stack no longer used that file convention in this project layout; `/` therefore needed an app-layer redirect implementation to preserve the documented locale-routing behavior.

- E2E flakiness after cleanup
  - Root cause: several Playwright interactions targeted visible SSR markup before React hydration completed, and one responsive WhatsApp spec reused a page across two locale states, causing navigation interference in the mobile/tablet run.

## File-Level Changes

- `src/app/api/subscribe/route.ts`
  - Updated the default newsletter recipient to `info@khaledomer.ae`.
  - Removed the unused caught error variable in the failure branch.
  - Reason: align newsletter delivery with the requested address and keep the route clean under strict unused-code checks.

- `src/app/api/contact/route.ts`
  - Updated the primary consultation recipient to `info@khaledomer.ae`.
  - Kept BCC delivery to `ahmedhussan068@gmail.com`.
  - Refined the bilingual intro copy and footer note.
  - Added explicit `Lead Source` and `Submitted At` rows to both text and HTML emails.
  - Reason: satisfy the new routing requirement and make the follow-up email clearer for the receiving team.

- `src/lib/socialLinks.ts`
  - Updated the shared `mailto:` destination to `info@khaledomer.ae`.
  - Reason: keep public header/footer email links aligned with the backend delivery target.

- `src/app/page.tsx`
  - Replaced the root intro-rendering page behavior with a server-side redirect to the correct localized home page.
  - Preserved cookie-aware behavior for `site_lang`, `komc_intro_ts`, and `komc_last_path`.
  - Reason: restore the documented `/ -> /{lang}/home` routing flow in a way that works with the current Next.js runtime.

- `src/context/LanguageContext.tsx`
  - Changed initial language detection to prefer the current localized pathname before any injected fallback language.
  - Reason: keep `/en/*` and `/ar/*` pages consistent from the first client render and avoid intro/header locale mismatches.

- `src/components/IntroOverlay.tsx`
  - Removed the unstable `"pre"` startup branch and derived the initial mode from persisted intro state.
  - Made the overlay language follow the active route until the visitor explicitly switches languages in the welcome card.
  - Added a hydration-ready marker used by Playwright before muting/skipping intro controls.
  - Reason: stabilize the bilingual intro flow and remove false-negative E2E interactions against pre-hydration UI.

- `src/components/Header.tsx`
  - Raised the mobile header/menu stack order and added a header-ready marker before enabling the hamburger button.
  - Reason: prevent false-negative mobile-menu interactions during hydration and keep scroll-recovery coverage deterministic.

- `playwright.config.ts`
  - Set Playwright to use a single worker for the local project matrix.
  - Reason: keep the bilingual E2E suite reproducible in the current Windows validation environment.

- `src/components/Footer.tsx`
  - Removed the unused `next/image` import.
  - Reason: resolve the only confirmed unused import reported by the strict TypeScript cleanup pass.

- `src/__tests__/contact.route.spec.ts`
- `src/__tests__/subscribe.route.spec.ts`
- `src/__tests__/socialLinks.spec.ts`
- `src/__tests__/footer-social-links.spec.tsx`
- `src/__tests__/header-social-links.spec.tsx`
- `src/__tests__/whatsapp-floating-button.spec.tsx`
- `e2e/social-links.spec.ts`
  - `e2e/landing-routing.spec.ts`
  - `e2e/welcome-card.spec.ts`
  - `e2e/header-mobile-scroll.spec.ts`
  - `e2e/whatsapp-floating-button.spec.ts`
  - Updated expectations to the new `info@khaledomer.ae` destination.
  - Added assertions for the refreshed consultation email copy and metadata.
  - Updated hydration-sensitive E2E flows to wait for interactive readiness and separated Arabic WhatsApp validation into its own fresh page context.
  - Reason: keep automated validation aligned with the changed behavior and with the live client interaction model.

- `src/components/AboutTeamGrid.tsx`
  - Included the existing worktree edit for card 4 content, updating the English and Arabic display text for Dr. Eisa Salim AL-Qaydi.
  - Reason: the user explicitly requested that the existing uncommitted component updates be included in this release scope.

- `src/components/TeamOverview.tsx`
  - Included the existing worktree text correction for the Arabic Ibrahim Abu Rouis card.
  - Reason: the user explicitly requested that the existing uncommitted component updates be included in this release scope.

- `middleware.ts`
  - Removed from the repository.
  - Reason: the final root redirect implementation now lives in `src/app/page.tsx`, and keeping the stale middleware file would no longer reflect the active routing path used in this pass.

- `README.md`
- `CHANGELOG.md`
  - Updated routing, email, cleanup, and validation notes.
  - Reason: keep the repository-level documentation aligned with the current codebase.

## Removed Or Corrected Dead Code

- Removed the unused `Image` import from `src/components/Footer.tsx`.
- Removed the obsolete `middleware.ts` file after replacing its active responsibility with app-layer redirect logic.

## Notes

- The strict TypeScript cleanup command used for this pass was:

```bash
npx tsc --noEmit --noUnusedLocals --noUnusedParameters
```

- Full details of test and rebuild execution are recorded in `docs/KOMC-VB00018_TEST_REPORT.md`.
