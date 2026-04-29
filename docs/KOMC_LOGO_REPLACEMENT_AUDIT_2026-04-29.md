# KOMC Logo Replacement Audit

Date: 2026-04-29

## Source Asset

- Canonical input: `public/KOMC Logo.jpeg`
- Legacy hardcoded UI path removed: `/KOMC%20Logo.png`
- Shared app logo constants: `src/lib/brandAssets.ts`
- Shared UI logo renderer: `src/components/BrandMark.tsx`

## Generated Logo Assets

Generated from `public/KOMC Logo.jpeg` via `npm run generate:logo` using `scripts/generate-logo-assets.mjs`.

- `public/brand/komc-logo-16.png`
- `public/brand/komc-logo-16.svg`
- `public/brand/komc-logo-16.webp`
- `public/brand/komc-logo-32.png`
- `public/brand/komc-logo-32.svg`
- `public/brand/komc-logo-32.webp`
- `public/brand/komc-logo-64.png`
- `public/brand/komc-logo-64.svg`
- `public/brand/komc-logo-64.webp`
- `public/brand/komc-logo-128.png`
- `public/brand/komc-logo-128.svg`
- `public/brand/komc-logo-128.webp`
- `public/brand/komc-logo-256.png`
- `public/brand/komc-logo-256.svg`
- `public/brand/komc-logo-256.webp`
- `public/brand/komc-logo-512.png`
- `public/brand/komc-logo-512.svg`
- `public/brand/komc-logo-512.webp`
- `public/favicon.ico`
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`
- `public/apple-touch-icon.png`
- `public/main_logo.svg`

## Detected And Replaced References

The following live project references were audited and updated to the shared logo system:

- `src/app/layout.tsx:61` icons metadata
- `src/app/layout.tsx:70` Open Graph image metadata
- `src/app/layout.tsx:87` Twitter image metadata
- `src/components/Header.tsx:195` header brand mark
- `src/components/Header.tsx:530` mobile drawer brand mark fallback
- `src/components/Footer.tsx:353` footer logo
- `src/components/AboutTrustBand.tsx:44` "Trusted Maritime Legal Partner" logo
- `src/components/IntroOverlay.tsx:253` intro overlay logo
- `src/components/IntroPreview.tsx:88` intro preview logo
- `src/components/WelcomingMessage.tsx:68` welcome card logo
- `src/lib/brandAssets.ts:1` canonical brand asset paths
- `src/components/BrandMark.tsx:13` shared curved-square logo container renderer
- `next.config.ts:31` immutable cache headers for `/brand/*`
- `next.config.ts:37` immutable cache headers for favicon and app icon files
- `package.json:20` reproducible `generate:logo` script
- `src/__tests__/main_logo.svg.spec.ts:5` SVG asset verification

## Audit Result

- No remaining source references to `/KOMC%20Logo.png` were found in `src/`.
- All generated logo and favicon assets resolved successfully with HTTP `200`.
- All generated logo and favicon assets returned `Cache-Control: public, max-age=31536000, immutable`.
- Rendered `/en/home` HTML includes `rel="icon"`, `rel="shortcut icon"`, `rel="apple-touch-icon"`, `property="og:image"`, and `name="twitter:image"`.

## QA Summary

- `npm run generate:logo`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Browser smoke coverage executed with Playwright across mobile, tablet, Chrome, Firefox, and Safari project targets against local production output.
- Firefox execution in the Trae sandbox hit environment file-access restrictions after test execution, so the cross-browser run is partially environment-constrained rather than code-blocked.

## Modified Files

- `docs/KOMC_LOGO_REPLACEMENT_AUDIT_2026-04-29.md`
- `next.config.ts`
- `package.json`
- `public/KOMC Logo.jpeg`
- `public/apple-touch-icon.png`
- `public/brand/*`
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`
- `public/favicon.ico`
- `public/main_logo.svg`
- `scripts/generate-logo-assets.mjs`
- `src/__tests__/main_logo.svg.spec.ts`
- `src/app/layout.tsx`
- `src/components/AboutTrustBand.tsx`
- `src/components/BrandMark.tsx`
- `src/components/Footer.tsx`
- `src/components/Header.tsx`
- `src/components/IntroOverlay.tsx`
- `src/components/IntroPreview.tsx`
- `src/components/WelcomingMessage.tsx`
- `src/lib/brandAssets.ts`
