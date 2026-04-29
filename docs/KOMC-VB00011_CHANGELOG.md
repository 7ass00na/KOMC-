# KOMC-VB00011 Change Log

## Summary

- Fixed the mobile/tablet header scroll freeze after closing the hamburger menu.
- Stabilized loading and intro interactions so transient overlays do not block visible controls.
- Revalidated the codebase cleanup state and kept the repo free of generated QA artifacts.

## File-Level Changes

- `src/lib/bodyScrollLock.ts`
  - Added a shared scroll-lock helper with lock counting.
  - Reason: prevent conflicting `overflow` mutations across independent overlays.

- `src/components/Header.tsx`
  - Replaced direct body overflow writes with the shared scroll-lock helper.
  - Aligned mobile/tablet navigation breakpoints to keep the hamburger path active through tablet widths.
  - Reason: restore reliable touch scrolling after menu close and remove breakpoint inconsistency.

- `src/components/IntroOverlay.tsx`
  - Switched intro overlay scroll locking to the shared helper.
  - Reason: keep intro behavior consistent with the header and avoid mismatched unlock timing.

- `src/components/AboutPhotoLibrary.tsx`
  - Switched modal/photo-library scroll locking to the shared helper.
  - Reason: centralize page scroll locking and avoid regressions when overlays overlap.

- `src/components/GlobalLoadingOverlay.tsx`
  - Added `pointer-events-none` to the visual loading overlay.
  - Reason: keep the loading feedback visible without intercepting taps or clicks on active controls.

- `src/lib/scrollGuard.ts`
  - Kept scroll-guard coordination aligned with the active intro overlay markers.
  - Reason: preserve touch and overlay behavior during intro/welcome flows.

- `e2e/header-mobile-scroll.spec.ts`
  - Added end-to-end regression coverage for phone and tablet scroll recovery after hamburger close.
  - Reason: protect the fixed mobile/tablet bug from reappearing.

- `src/__tests__/bodyScrollLock.spec.ts`
  - Added bookkeeping tests for shared scroll-lock lock/unlock behavior.
  - Reason: verify nested lock handling and safe restoration of page overflow styles.

- `src/__tests__/header.mobile-menu.spec.tsx`
  - Added component-level regression coverage for restoring page scroll after closing the mobile menu.
  - Reason: catch header scroll-lock regressions earlier than E2E.

- `eslint.config.mjs`
  - Ignored `coverage/**` and `test-results/**`.
  - Reason: keep lint scoped to source files and avoid failures caused by generated artifacts.

- `src/app/api/contact/route.ts`
- `src/app/api/subscribe/route.ts`
- `src/components/Footer.tsx`
- `src/components/forms/ContactForm.tsx`
- `src/context/LanguageContext.tsx`
- `src/__tests__/contact.email.spec.ts`
- `src/__tests__/contact.route.spec.ts`
- `src/__tests__/subscribe.route.spec.ts`
  - Retained and synchronized the in-progress contact, subscription, footer, and language-loading updates already present in the working tree.
  - Reason: include the full requested cleanup/documentation pass without discarding active product changes.

## Removed Or Excluded Artifacts

- `test-results/`
  - Removed generated Playwright output before sync.
  - Reason: keep the repository clean and source-only.

## Validation

- `npm run lint` -> passed
- `npm test` -> passed, `30/30` tests, `92.70%` statements
- `$env:PLAYWRIGHT_BASE_URL='http://localhost:3002'; npx playwright test` -> passed, `10/10` tests
- `npm run build` -> passed
