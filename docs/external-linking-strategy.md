# External Linking Strategy (Security + Accessibility)

## Goals
- Prevent tabnapping and referrer leakage for outbound links.
- Make external destinations clearly identifiable visually and programmatically.
- Keep link experiences accessible (WCAG 2.1 AA) for keyboard, screen readers, and touch.
- Control external resource loading via CSP and enforce HTTPS.
- Monitor external link behavior and detect broken/malicious references.

## Link Classification
External link:
- Any absolute URL starting with https:// (or http:// which must be upgraded to https://) and not pointing to this site origin.
Internal link:
- Any relative path (starts with /) and same-origin absolute URLs.
Special schemes:
- mailto:, tel: are treated as non-external for rel/target rules but must remain accessible.

## Security Requirements
### Prevent Tabnapping
When opening in a new tab:
- target=\"_blank\"
- rel=\"noopener noreferrer\"

### HTTPS Enforcement
- Upgrade http:// to https:// for any outbound URL when the https variant is available.
- Block unknown or unsafe protocols (javascript:, data:).

### Referrer Policy
- For external links: referrerPolicy=\"no-referrer\" (or strict-origin-when-cross-origin if analytics requires).

### Content Security Policy (CSP)
Use a CSP header to restrict third-party loads:
- default-src 'self'
- connect-src 'self' https:
- img-src 'self' data: https:
- media-src 'self' https:
- frame-src https:
- script-src 'self' (optionally 'nonce-…' if strict)
- style-src 'self' 'unsafe-inline' (Next.js requires inline styles in many cases)

Recommended rollout:
- Start with Content-Security-Policy-Report-Only in production.
- Collect violation reports and tighten gradually.

### SPF/DKIM/DMARC (Email Deliverability)
Outbound emails must be authenticated at the DNS level:
- SPF: authorize your SMTP provider IPs/senders.
- DKIM: enable signing for your sending domain.
- DMARC: policy + reporting.

## Accessibility Requirements (WCAG 2.1 AA)
### Accessible Link Text
- Link text must describe the destination/action (avoid \"Click here\").
- For external links that open new tabs, announce it via:
  - aria-label suffix (e.g., \"(opens in a new tab)\" / \"(يفتح في علامة تبويب جديدة)\").

### Keyboard Support
- Links must be reachable via Tab.
- Focus indicators must be visible (use theme focus ring styles).

### Visual Indicators for External Links
Provide a small external-link icon:
- Must not be color-only; include an icon and accessible label.
- Keep spacing consistent across RTL/LTR.

## Implementation (Code)
### ExternalLink Component
Use a dedicated component to standardize behavior:
- Adds rel=\"noopener noreferrer\" automatically for external target=\"_blank\".
- Upgrades http:// to https://.
- Adds referrerPolicy for external.
- Adds external icon indicator.
- Emits analytics events for monitoring.

Location:
- src/components/ExternalLink.tsx

Usage:
```tsx
import ExternalLink from \"@/components/ExternalLink\";

<ExternalLink href=\"https://example.com\">
  Example Partner
</ExternalLink>
```

## Validation & Monitoring
### Link Validation (Build-Time / CI)
- Ensure all outbound links use https://.
- Reject javascript: and data: protocols in content sources.
- Maintain an allowlist for high-risk categories (payments, auth, file downloads).

### Runtime Monitoring
- Track outbound clicks (href + language + page path).
- Periodically check for broken links (HEAD/GET) using a scheduled job.

### Unsafe Destination Warning
For high-risk external targets:
- Display a modal: \"You are leaving KOMC…\"
- Provide Continue/Cancel, keyboard focus trap, and screen-reader announcement.

## Testing Protocols
### Security Checklist
- Verify rel=\"noopener noreferrer\" on all external target=\"_blank\" links.
- Verify CSP report-only is present and does not block essential resources.
- Verify referrer policy is applied for external URLs.

### Accessibility Audit
- Screen reader: external links announce destination and new-tab behavior.
- Keyboard: tab order includes links; focus ring visible.
- RTL: icon and text order is correct.

### Cross-Browser
- iOS Safari, Chrome Android, Samsung Internet, Chrome/Edge desktop.

# Multilingual Routing Strategy (/en/home and /ar/home)

## URL Structure
- English home: /en/home
- Arabic home: /ar/home
- /en redirects to /en/home
- /ar redirects to /ar/home
- / redirects to /ar/home by default unless the site_lang cookie is set to en
 - Default site origin: https://DN.com (set as metadataBase; use this for canonical link generation)

## Language Detection
Decision sources, in order:
1) site_lang cookie set by the welcome decision buttons
2) Stored preference (optional localStorage mirror for client UI)
3) Default fallback: Arabic

## Implementation Notes
- Middleware handles /, /en, /ar redirects early to avoid duplicate content.
- Metadata on /en/home and /ar/home defines canonicals and alternates for SEO.
- Welcome card decision buttons set site_lang and route to the correct localized home.

## SEO
- Use canonical for each language home route.
- Provide alternates with hreflang mapping en ↔ ar.
- Avoid duplicate content by redirecting /en and /ar to their /home equivalents.
