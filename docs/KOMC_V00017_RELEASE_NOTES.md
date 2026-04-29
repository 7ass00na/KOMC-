# KOMC V00017 Release Notes

## Logo Container Sizing

- `src/components/Header.tsx`: `32px x 32px` in the main header, `48px x 48px` in the mobile contact card.
- `src/components/Footer.tsx`: `40px x 40px`.
- `src/components/AboutTrustBand.tsx`: `48px x 48px`.
- `src/components/IntroOverlay.tsx`: `32px x 32px`.
- `src/components/IntroPreview.tsx`: `40px x 40px` on phone, `48px x 48px` on tablet, `56px x 56px` on desktop.
- `src/components/WelcomingMessage.tsx`: `40px x 40px`.

`src/components/BrandMark.tsx` now renders the image inside a dedicated `.logo-media` wrapper with a shared `.logo-image` rule using:

```css
width: 100%;
height: auto;
max-width: 100%;
max-height: 100%;
object-fit: contain;
object-position: center;
```

This keeps the logo proportional inside any container size, prevents overflow, and avoids distortion when the container changes.

## Animated Border Lighting

- `src/app/globals.css` adds a theme-driven animated border highlight around `.logo-bg`.
- The effect uses `conic-gradient(...)` with `var(--brand-accent)` and a `logoBorderOrbit` keyframe for continuous motion.
- `prefers-reduced-motion: reduce` disables the orbit animation and keeps a static accent treatment for lower-performance or accessibility-sensitive environments.

## Mobile Lightbox Positioning

- `src/components/AboutPhotoLibrary.tsx` captures the thumbnail tap point from pointer events and passes it into the modal.
- `src/lib/lightboxPosition.ts` clamps the lightbox frame inside the viewport with a `16px` safe padding.
- Anchored positioning applies only on phone and tablet widths (`<= 1024px`); desktop keeps the existing centered presentation.
- The modal container uses `z-index: 2147483647` to ensure it stays above the tapped thumbnail and the rest of the page.
- The final top/left reposition uses a `200ms ease-out` transition.

## AI Chat FAB Cleanup

- Removed the export button and the `exportTranscript()` handler from `src/components/AIChatFab.tsx`.
- Existing chat actions remain intact, including send and clear confirmation behavior.

## Verification

- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed
- `Invoke-WebRequest http://localhost:3000/en/about-us`: returned `200` after production start
- `Invoke-WebRequest http://localhost:3000/ar/about-us`: returned `200` after production start

## Runtime Note

- `output: "standalone"` is enabled in `next.config.ts` for production packaging.
- On this Windows environment, running `.next/standalone/server.js` surfaced a `sharp` native runtime loading issue. The standard production build itself succeeds, and the regular production server path responds successfully. If standalone deployment is required on the target host, verify the platform-specific `sharp` runtime is available there.
