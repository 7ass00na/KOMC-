'use client';
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

type Props = {
  className?: string;
  title?: string;
  subtitle?: string;
  badges?: string[];
  ctaHref?: string;
  ctaLabel?: string;
};

export default function AboutTrustBand({
  className,
  title,
  subtitle,
  badges,
  ctaHref,
  ctaLabel,
}: Props) {
  const { lang } = useLanguage();
  const isRTL = lang === "ar";

  const tTitle =
    title ??
    (isRTL ? "شريككم القانوني البحري الموثوق" : "Trusted Maritime Legal Partner");
  const tSubtitle =
    subtitle ??
    (isRTL
      ? "استشارة قائمة على الاستراتيجية وتواصل واضح ونتائج قابلة للقياس."
      : "Strategy-first counsel, clear communication, measurable outcomes.");
  const tBadges =
    badges ??
    (isRTL ? ["منذ 2010", "تركيز بحري", "حضور عالمي"] : ["Since 2010", "Maritime Focus", "Global Reach"]);
  const tCtaHref = ctaHref ?? (isRTL ? "/ar/contact" : "/en/contact");
  const tCtaLabel = ctaLabel ?? (isRTL ? "تواصل معنا" : "Work with us");

  return (
    <section className={`section mx-auto max-w-7xl px-5 pb-24 ${className ?? ""}`} dir={isRTL ? "rtl" : "ltr"} lang={isRTL ? "ar" : "en"}>
      <div className={`flex flex-col items-center md:flex-row md:items-center gap-6 rounded-2xl surface border border-zinc-700/40 p-6`}>
        <div className={`h-12 w-12 rounded-full brand-gradient ${isRTL ? "md:order-4" : "md:order-1"}`} />
        <div className={`flex-1 text-center ${isRTL ? "md:text-right md:order-1" : "md:text-left md:order-2"}`}>
          <div className="text-xl font-semibold text-[var(--brand-accent)]" data-edit-key="about-trustband-title">{tTitle}</div>
          <p className="mt-1 text-sm text-zinc-300" data-edit-key="about-trustband-subtitle">{tSubtitle}</p>
        </div>
        <div className={`flex items-center gap-2 ${isRTL ? "md:order-2" : "md:order-3"}`}>
          {tBadges.map((b) => (
            <span
              key={b}
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/30"
              data-edit-key={`about-trustband-badge-${String(b).toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-")}`}
            >
              {b}
            </span>
          ))}
        </div>
        <Link
          href={tCtaHref}
          className={`${isRTL ? "md:order-3" : "md:order-4"} rounded-lg bg-[var(--brand-accent)] text-black px-4 py-2 text-sm font-semibold transition ring-1 ring-[var(--brand-accent)]/40 hover:bg-[color-mix(in oklab,var(--brand-accent),black_12%)] active:bg-[color-mix(in oklab,var(--brand-accent),black_22%)] active:translate-y-[1px]`}
        >
          <span data-edit-key="about-trustband-cta-label">{tCtaLabel}</span>
        </Link>
      </div>
    </section>
  );
}
