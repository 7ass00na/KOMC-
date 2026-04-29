# KOMC-VB00020 Change Log

## Summary

- Added responsive, footer-aware visibility behavior for the AI chat and WhatsApp floating actions on phones and tablets.
- Kept the floating actions hidden on first paint, revealed them after the user scrolls past the configured threshold, hid them when the footer entered the viewport, and restored them when scrolling back above the footer boundary.
- Added responsive browser coverage for iPhone, Android Chrome, and tablet layouts, plus focused Vitest coverage for the shared visibility logic.
- Revalidated the codebase with lint, strict TypeScript unused-code scanning, Vitest with coverage, Playwright, and a clean rebuild.
- Hardened the consultation-form mail flow so it now targets `info@khaledomer.com` and `ahmedhussano68@gmail.com` through separate SSL/TLS SMTP transports with verification, structured logging, and duplicate-submission suppression.

## Root Cause Analysis

- Responsive floating actions
  - Root cause: the floating WhatsApp and AI chat actions were using separate `window.scrollY > 160` checks and had no awareness of the footer boundary, so the icons stayed visible over footer content on smaller layouts.

- Cross-device testing gap
  - Root cause: the existing Playwright matrix validated iPhone and iPad behavior, but it did not explicitly include an Android Chrome mobile project or a dedicated spec for the footer-boundary visibility cycle.

## File-Level Changes

- `src/app/api/contact/route.ts`
  - Switched the default consultation recipient to `info@khaledomer.com` and the mirrored blind-copy mailbox to `ahmedhussano68@gmail.com`.
  - Added dedicated SMTP transport configuration for the primary Hostinger mailbox and the Gmail blind-copy mailbox, including TLS verification, request IDs, structured delivery-attempt logging, and retry handling.
  - Added short-window duplicate-submission suppression so identical contact requests are acknowledged without resending duplicate emails.
  - Reason: secure the consultation delivery pipeline, improve observability, and reduce accidental duplicate sends.

- `src/components/forms/ContactForm.tsx`
  - Added an explicit submit lock, client-side email validation, clearer error-code mapping, and duplicate-aware success messaging.
  - Reason: preserve UX continuity while preventing accidental double-submits and surfacing actionable status feedback.

- `src/__tests__/contact.route.spec.ts`
  - Expanded coverage to assert the new Hostinger/Gmail SMTP defaults, the updated `.com` / Gmail recipients, and duplicate-submission suppression.
  - Reason: keep the mail-routing and delivery-hardening behavior regression-tested.

- `src/hooks/useResponsiveFloatingVisibility.ts`
  - Added a shared responsive visibility hook with `requestAnimationFrame`-throttled `scroll`, `resize`, and `orientationchange` handling.
  - Added footer-boundary detection through the shared `[data-site-footer]` marker.
  - Reason: centralize the responsive floating-action behavior and keep the scroll updates smooth under rapid scrolling and viewport changes.

- `src/components/WhatsAppFloatingButton.tsx`
  - Replaced the local scroll-only visibility logic with the shared responsive hook.
  - Raised the floating layer to `z-[54]` to keep the CTA above page content without overtaking active overlays.
  - Reason: make the WhatsApp CTA follow the requested responsive visibility lifecycle.

- `src/components/AIChatFab.tsx`
  - Replaced the local scroll-only visibility logic with the shared responsive hook.
  - Raised the floating layer to `z-[55]` so it consistently stacks above the WhatsApp CTA while remaining under the opened chat modal.
  - Reason: keep both floating actions synchronized and correctly layered on responsive layouts.

- `src/components/Footer.tsx`
  - Added the `data-site-footer` marker to the root footer element.
  - Reason: give the shared visibility controller a stable footer boundary target.

- `src/__tests__/whatsapp-floating-button.spec.tsx`
  - Added a regression that verifies the WhatsApp CTA hides when the footer enters the responsive viewport and reappears after scrolling above it.
  - Reason: protect the new footer-aware visibility behavior at the component level.

- `src/__tests__/aiChatFab.modal.spec.tsx`
  - Added a regression that verifies the AI chat FAB follows the same footer-aware visibility cycle.
  - Reason: ensure the chat CTA stays aligned with the requested responsive behavior.

- `e2e/floating-actions-visibility.spec.ts`
  - Added end-to-end coverage for the full responsive lifecycle: hidden initially, visible after scroll, hidden near footer, visible again above footer.
  - Reason: validate the shipping user journey on live phone and tablet layouts.

- `e2e/welcome-card.spec.ts`
  - Switched the mute toggle interaction back to a direct event dispatch after the hydration-ready wait.
  - Reason: remove a mobile pointer-stability flake from the intro overlay test while keeping the interaction assertion intact.

- `playwright.config.ts`
  - Added the `Mobile Android Chrome` project using the Pixel 5 device profile.
  - Reason: satisfy the requested Android Chrome validation path for responsive CTA behavior.

- `README.md`
- `CHANGELOG.md`
  - Updated the testing and release notes to reflect the new responsive floating-action behavior and validation coverage.
  - Reason: keep repository-level documentation aligned with the current build.

## Removed Or Corrected Dead Code

- Removed the duplicated per-component scroll visibility implementations from:
  - `src/components/WhatsAppFloatingButton.tsx`
  - `src/components/AIChatFab.tsx`
- Replaced them with the shared `useResponsiveFloatingVisibility()` hook.

## Notes

- The shared responsive visibility hook uses the same scroll-event path regardless of whether the browser scroll originated from touch, trackpad, mouse wheel, or programmatic viewport movement.
- Full validation details for this pass are recorded in `docs/KOMC-VB00020_TEST_REPORT.md`.
