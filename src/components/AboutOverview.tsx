"use client";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function AboutOverview() {
  const { t, lang } = useLanguage();
  return (
    <section id="trust" className="section mx-auto max-w-7xl px-5 py-20">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]">
        {t("trustTitle")}
      </h2>
      <p className="mt-3 text-zinc-300 max-w-3xl">
        {t("aboutIntro")}
      </p>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[t("aboutBullets1"), t("aboutBullets2"), t("aboutBullets3"), t("aboutBullets4")].map((b) => (
          <div key={b} className="rounded-lg surface p-3 text-sm">
            {b}
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href={`/${lang}/about`}
          className="rounded-lg bg-[var(--brand-accent)] text-black px-5 py-2.5 font-semibold hover:opacity-90 transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow-md"
        >
          {t("aboutRead")}
        </Link>
      </div>
    </section>
  );
}
