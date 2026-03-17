"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type NewsPost = {
  slug: string;
  title: string;
  desc: string;
  tag: string;
  date: string;
  readTime: string;
  image: string;
  body: string;
  bullets: string[];
};

type NewsPageContentProps = {
  posts: NewsPost[];
  locale: string;
  title: string;
  subtitle: string;
  detailsEmptyLabel: string;
  isRTL?: boolean;
};

export default function NewsPageContent({
  posts,
  locale,
  title,
  subtitle,
  detailsEmptyLabel,
  isRTL,
}: NewsPageContentProps) {
  const rtl = isRTL ?? locale.startsWith("ar");
  const lang = rtl ? "ar" : "en";
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [taxonomy, setTaxonomy] = useState<any>(null);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  useEffect(() => { fetch("/api/admin/taxonomy", { cache: "no-store" }).then((r) => r.json()).then((d) => setTaxonomy(d)).catch(() => {}); }, []);
  const filtered = useMemo(() => {
    if (!selectedCat) return posts;
    return posts.filter((p) => p.tag === selectedCat);
  }, [posts, selectedCat]);
  const selectedPost = selectedSlug ? posts.find((post) => post.slug === selectedSlug) : undefined;
  const fmt = (iso?: string) =>
    iso
      ? new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(new Date(iso))
      : null;
  const formatReadTime = (value: string) => {
    const match = value.match(/\d+/);
    if (!match) return value;
    if (/hour|hours|hr|h/i.test(value)) {
      const minutes = Number(match[0]) * 60;
      return rtl ? `${minutes} دقيقة قراءة` : `${minutes} min read`;
    }
    return value;
  };
  const nextStepsLabel = rtl ? "الخطوات التالية" : "Next steps";
  const attachmentsLabel = rtl ? "ملفات مرفقة" : "Attached documents";
  const stickyLabel = rtl
    ? "ابقَ على اطلاع — نحول التعقيد إلى خطوات قانونية واضحة."
    : "Stay informed — we turn complexity into clear legal next steps.";
  const viewLabel = rtl ? "عرض" : "View";
  const downloadLabel = rtl ? "تحميل" : "Download";
  const copyLabel = rtl ? "نسخ الرابط" : "Copy link";
  const emailLabel = rtl ? "إرسال بريد" : "Email";
  const whatsappLabel = rtl ? "واتساب" : "WhatsApp";
  const contactLabel = rtl ? "اطلب استشارة" : "Request consultation";
  const servicesLabel = rtl ? "استكشف الخدمات" : "Explore services";
  const contactHref = `/${lang}/contact`;
  const servicesHref = `/${lang}/services`;
  const attachments = rtl
    ? [{ name: "تقرير الحادث.pdf", size: "2.4 MB" }]
    : [{ name: "Incident report.pdf", size: "2.4 MB" }];
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
  };
  const handleSelect = (slug: string) => {
    setSelectedSlug(slug);
  };
  return (
    <section className="section mx-auto max-w-7xl px-5 py-20 pt-[32px] md:pt-[48px] lg:pt-[64px]" dir={rtl ? "rtl" : "ltr"}>
      <div className={`relative rounded-3xl surface p-6 md:p-10 ${rtl ? "text-right" : "text-left"}`}>
        <div
          className={`pointer-events-none absolute inset-0 rounded-3xl opacity-70 dark:opacity-25 ${
            rtl
              ? "bg-[radial-gradient(120%_120%_at_88%_0%,rgba(225,188,137,0.28),transparent_60%)]"
              : "bg-[radial-gradient(120%_120%_at_12%_0%,rgba(225,188,137,0.28),transparent_60%)]"
          }`}
        />
        <div className="relative z-10">
          <div className={`flex flex-wrap items-center justify-between gap-4 ${rtl ? "flex-row-reverse" : "flex-row"}`}>
            <h1 className={`text-3xl md:text-4xl font-extrabold text-[var(--ink-primary)] ${rtl ? "text-right ml-auto" : "text-left"}`} data-edit-key="news-page-title">
              {title}
            </h1>
          </div>
          <p className={`mt-3 text-sm text-[var(--text-secondary)] ${rtl ? "text-right ml-auto" : "text-left"}`} data-edit-key="news-page-subtitle">{subtitle}</p>
        </div>
        <div className={`mt-6 -mx-4 px-4 ${rtl ? "text-right" : "text-left"}`}>
          <div className={`inline-flex gap-2 pb-1 whitespace-nowrap`}>
            <button
              onClick={() => { setSelectedCat(null); setSelectedSlug(filtered[0]?.slug || null); }}
              className={`rounded-lg border px-3 py-1 text-xs ${!selectedCat ? "border-[var(--brand-accent)] text-[var(--brand-accent)]" : "border-zinc-600 text-zinc-300 hover:border-zinc-500"}`}
              aria-pressed={!selectedCat ? "true" : "false"}
              data-edit-key="news-filter-chip-all"
            >
              {rtl ? "الكل" : "All"}
            </button>
            {(taxonomy?.categories?.news || []).map((cat: string) => (
              <button
                key={cat}
                onClick={() => { setSelectedCat(cat); const first = posts.find((p) => p.tag === cat); setSelectedSlug(first?.slug || null); }}
                className={`rounded-lg border px-3 py-1 text-xs ${selectedCat === cat ? "border-[var(--brand-accent)] text-[var(--brand-accent)]" : "border-zinc-600 text-zinc-300 hover:border-zinc-500"}`}
                aria-pressed={selectedCat === cat ? "true" : "false"}
                data-edit-key={`news-filter-chip-${String(cat).toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-")}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="relative z-10 mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <button
            type="button"
            onClick={() => handleSelect(filtered[0].slug)}
            aria-pressed={selectedSlug === filtered[0].slug ? "true" : "false"}
            className={`group relative flex min-h-[320px] lg:min-h-[504px] flex-col justify-end overflow-hidden rounded-2xl surface p-6 md:p-8 ring-1 text-left ${
              selectedSlug === filtered[0].slug ? "ring-[var(--brand-accent)]/60" : "ring-transparent"
            } ${rtl ? "text-right" : "text-left"}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
              style={{ backgroundImage: `url('${filtered[0].image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1326]/95 via-[#0a1326]/45 to-transparent" />
            <div className="relative z-10">
              <div className="insight-badge inline-flex items-center rounded-full bg-black/35 px-3 py-1 text-xs text-white dark:bg-[var(--brand-accent)] dark:text-black">
                {filtered[0].tag}
              </div>
              <div className={`mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-300 ${rtl ? "justify-end flex-row-reverse" : "justify-start"}`}>
                <span>{fmt(filtered[0].date)}</span>
                <span>•</span>
                <span>{formatReadTime(filtered[0].readTime)}</span>
              </div>
              <div className="insight-title mt-3 text-2xl font-semibold text-white" data-edit-key="news-page-featured-title">{filtered[0].title}</div>
              <div className="mt-3 text-sm text-slate-200" data-edit-key="news-page-featured-desc">{filtered[0].desc}</div>
            </div>
          </button>
          <div className="grid gap-6">
            {filtered.slice(1).map((p, i) => (
              <button
                key={p.title}
                type="button"
                onClick={() => handleSelect(p.slug)}
                aria-pressed={selectedSlug === p.slug ? "true" : "false"}
                className={`group relative flex min-h-[220px] lg:min-h-[240px] flex-col justify-end overflow-hidden rounded-2xl surface p-5 ring-1 ${
                  selectedSlug === p.slug ? "ring-[var(--brand-accent)]/60" : "ring-transparent"
                } ${rtl ? "text-right" : "text-left"}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url('${p.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1326]/95 via-[#0a1326]/50 to-transparent" />
                <div className="relative z-10">
                  <div className="insight-badge inline-flex items-center rounded-full bg-black/35 px-3 py-1 text-[10px] text-white dark:bg-[var(--brand-accent)] dark:text-black">
                    {p.tag}
                  </div>
                  <div className={`mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-300 ${rtl ? "justify-end flex-row-reverse" : "justify-start"}`}>
                    <span>{fmt(p.date)}</span>
                    <span>•</span>
                    <span>{formatReadTime(p.readTime)}</span>
                  </div>
                  <div className="insight-title mt-3 text-lg font-semibold text-white" data-edit-key={`news-page-card-title-${i+1}`}>{p.title}</div>
                  <div className="mt-2 text-xs text-slate-200" data-edit-key={`news-page-card-desc-${i+1}`}>{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <article
          id="news-detail"
          dir={rtl ? "rtl" : "ltr"}
          className={`mt-10 rounded-3xl surface p-6 md:p-10 ${rtl ? "text-right" : "text-left"} flex flex-col`}
        >
          {selectedPost ? (
            <>
              <div className={`flex flex-wrap items-center gap-3 ${rtl ? "justify-end flex-row-reverse" : "justify-start"}`}>
                <div className="insight-badge inline-flex items-center rounded-full bg-black/35 px-3 py-1 text-xs text-white dark:bg-[var(--brand-accent)] dark:text-black" data-edit-key="news-detail-tag">
                  {selectedPost.tag}
                </div>
                <div className="text-xs text-[var(--text-secondary)]" data-edit-key="news-detail-date">{fmt(selectedPost.date)}</div>
                <span className="text-xs text-[var(--text-secondary)]">•</span>
                <div className="text-xs text-[var(--text-secondary)]" data-edit-key="news-detail-read-time">{formatReadTime(selectedPost.readTime)}</div>
              </div>
              <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                <h2 className={`text-2xl md:text-3xl font-semibold text-[var(--ink-primary)] ${rtl ? "text-right" : "text-left"}`} data-edit-key="news-detail-title">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label={copyLabel}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--panel-border)] text-[var(--ink-primary)] transition hover:border-[var(--brand-accent)]"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 9h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </button>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(selectedPost.title)}`}
                    aria-label={emailLabel}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--panel-border)] text-[var(--ink-primary)] transition hover:border-[var(--brand-accent)]"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M22 8 12 13 2 8" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(selectedPost.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={whatsappLabel}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--panel-border)] text-[var(--ink-primary)] transition hover:border-[var(--brand-accent)]"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.2 3.8A10 10 0 0 0 3.8 20.2L2 22l1.9-1.8A10 10 0 0 0 20.2 3.8z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M8.5 7.5c.4-.4 1-.4 1.4 0l1.2 1.2c.4.4.4 1 0 1.4l-.6.6a6.5 6.5 0 0 0 3.7 3.7l.6-.6c.4-.4 1-.4 1.4 0l1.2 1.2c.4.4.4 1 0 1.4l-.7.7c-.6.6-1.6.8-2.4.5-1.9-.6-3.8-1.6-5.4-3.2S6.4 10.8 5.8 8.9c-.3-.8 0-1.8.5-2.4l.7-.7z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </a>
                </div>
              </div>
              <p className={`mt-3 text-sm md:text-base text-[var(--text-secondary)] ${rtl ? "text-right" : "text-left"}`} data-edit-key="news-detail-body">
                {selectedPost.body}
              </p>
              <ul className={`mt-5 list-disc space-y-2 text-sm text-[var(--text-secondary)] marker:text-[var(--brand-accent)] ${rtl ? "text-right" : "text-left"} ${rtl ? "pr-5" : "pl-5"}`}>
                {selectedPost.bullets.map((b, i) => (
                  <li key={b} data-edit-key={`news-detail-bullet-${i+1}`}>{b}</li>
                ))}
              </ul>
              <div className="mt-6 grid gap-4 lg:grid-cols-1">
                <div className="rounded-2xl surface p-5">
                  <div className="text-xs tracking-widest uppercase font-semibold text-[var(--brand-accent)]" data-edit-key="news-detail-attachments-label">{attachmentsLabel}</div>
                  <div className="mt-4 space-y-3">
                    {attachments.map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--panel-border)]/60 bg-black/10 p-3">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--panel-muted-bg)] text-[var(--brand-accent)]">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                              <path d="M14 3v5h5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                              <path d="M8 15h8M8 11h5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                            </svg>
                          </span>
                          <div>
                            <div className="text-sm font-semibold text-[var(--ink-primary)]" data-edit-key={`news-detail-attachment-name-${String(doc.name).toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-")}`}>{doc.name}</div>
                            <div className="text-xs text-[var(--text-secondary)]" data-edit-key={`news-detail-attachment-size-${String(doc.name).toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-")}`}>{doc.size}</div>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 ${rtl ? "flex-row-reverse" : "flex-row"}`}>
                          <button
                            type="button"
                            aria-label={viewLabel}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--panel-border)] text-[var(--ink-primary)] transition hover:border-[var(--brand-accent)]"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                              <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            aria-label={downloadLabel}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--panel-border)] text-[var(--ink-primary)] transition hover:border-[var(--brand-accent)]"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M12 3v11m0 0 4-4m-4 4-4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M4 20h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl surface p-5">
                <div className="text-xs tracking-widest uppercase font-semibold text-[var(--brand-accent)]" data-edit-key="news-detail-next-steps-label">{nextStepsLabel}</div>
                <ul className={`mt-3 list-disc space-y-2 text-sm text-[var(--text-secondary)] marker:text-[var(--brand-accent)] ${rtl ? "pr-5 text-right" : "pl-5 text-left"}`}>
                  {(rtl
                    ? ["تحديد المستندات الداعمة الرئيسية.", "مراجعة نطاق التغطية والالتزامات.", "جدولة استشارة لتقدير المخاطر."]
                    : ["Identify key supporting documents.", "Review coverage scope and obligations.", "Book a consultation to scope exposure."]).map((step, i) => (
                    <li key={step} data-edit-key={`news-detail-next-step-${i+1}`}>{step}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-6 -mx-6 -mb-6 md:-mx-10 md:-mb-10">
                <div className="border-t border-[var(--panel-border)] bg-black/10 dark:bg-black/40 backdrop-blur-lg px-6 md:px-10 py-4 rounded-b-2xl">
                  <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-white" data-edit-key="news-detail-sticky-text">
                      {stickyLabel}
                    </div>
                    <div className={`flex flex-wrap gap-2 ${rtl ? "mr-auto justify-start" : "ml-auto justify-end"}`}>
                      <Link
                        href={servicesHref}
                        className="inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-3 py-1.5 text-xs font-semibold transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow lg:px-4 lg:py-2 lg:text-sm"
                      >
                        <span data-edit-key="news-detail-sticky-services-label">{servicesLabel}</span>
                      </Link>
                      <Link
                        href={contactHref}
                        className="inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-3 py-1.5 text-xs font-semibold transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow lg:px-4 lg:py-2 lg:text-sm"
                      >
                        <span data-edit-key="news-detail-sticky-contact-label">{contactLabel}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={`rounded-2xl border border-dashed border-[var(--panel-border)] bg-[var(--panel-muted-bg)] p-6 ${rtl ? "text-right" : "text-center"}`}>
              <span className="font-semibold text-[var(--brand-accent)]">{detailsEmptyLabel}</span>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
