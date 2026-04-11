"use client";

import { useLanguage } from "@/context/LanguageContext";
import { track } from "@/lib/welcomeLabels";
import { useMemo } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: "_blank" | "_self";
  showIcon?: boolean;
  "aria-label"?: string;
};

function normalizeHttps(url: string) {
  try {
    if (url.startsWith("http://")) return "https://" + url.slice("http://".length);
  } catch {}
  return url;
}

function isExternalUrl(url: string) {
  try {
    if (url.startsWith("mailto:") || url.startsWith("tel:")) return false;
    if (!url.startsWith("http://") && !url.startsWith("https://")) return false;
    return true;
  } catch {}
  return false;
}

export default function ExternalLink({ href, children, className, target = "_blank", showIcon = true, ...rest }: Props) {
  const { lang } = useLanguage();
  const external = useMemo(() => isExternalUrl(href), [href]);
  const safeHref = useMemo(() => (external ? normalizeHttps(href) : href), [href, external]);
  const rel = external && target === "_blank" ? "noopener noreferrer" : undefined;
  const labelSuffix = lang === "ar" ? " (يفتح في علامة تبويب جديدة)" : " (opens in a new tab)";
  const ariaLabel = rest["aria-label"] ? rest["aria-label"] : external ? labelSuffix : undefined;

  return (
    <a
      href={safeHref}
      className={className}
      target={external ? target : undefined}
      rel={rel}
      referrerPolicy={external ? "no-referrer" : undefined}
      aria-label={ariaLabel}
      data-external={external ? "true" : "false"}
      onClick={() => {
        try {
          if (external) track("external_link_click", { href: safeHref, lang });
        } catch {}
      }}
    >
      <span className="inline-flex items-center gap-1.5">
        <span>{children}</span>
        {external && showIcon ? (
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 3h7v7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 14 21 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
    </a>
  );
}

