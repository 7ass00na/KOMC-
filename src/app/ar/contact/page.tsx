import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import ContactHero from "@/components/ContactHero";
import Image from "next/image";

export const metadata = {
  alternates: {
    canonical: "/ar/contact",
    languages: { en: "/en/contact", ar: "/ar/contact" },
  },
};

export default function Page() {
  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main>
        <div className="about-hero-scope">
          <ContactHero isRTL title="ابدأ استشارة سرية" subtitle="أخبرنا عن قضيتك. سنرد بسرعة وبسرية." kicker="تواصل مع KOMC" overlay="medium" />
        </div>
        <section className="section no-section-bg mx-auto max-w-7xl px-5 py-16 mb-10" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
            <div>
              <h1 className="text-4xl font-extrabold text-[var(--ink-primary)] text-right">
                <span className="text-[var(--brand-accent)]">احجز</span> استشارة مهنية اليوم
              </h1>
              <p className="mt-3 text-sm text-[var(--text-secondary)] text-right">
                زوّدنا بخلاصة قضيتك وسيقوم محامٍ بمراجعتها سريعًا لتقديم التوصية والاستراتيجية المناسبة بسرية تامة.
              </p>
              <div className="mt-6 rounded-2xl surface p-6 md:p-8">
                <div className="relative h-80 md:h-96 overflow-hidden rounded-xl border border-[var(--panel-border)] bg-black/20">
                  <Image src="/images/Services/Insurance.jpg" alt="استشارة قانونية" fill sizes="100vw" className="object-cover" priority />
                  <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/10 dark:bg-[var(--brand-accent)]/10 backdrop-blur-lg px-4 py-3 text-white dark:text-[var(--brand-accent)] border border-white/20">
                    <div className="text-sm font-semibold dark:text-[var(--brand-accent)]">سرية وثقة في كل خطوة</div>
                    <div className="text-[12px] text-zinc-300 dark:text-[var(--brand-accent)]">إرشاد واضح من محامين متمرسين يركزون على النتائج.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full">
              <ContactForm lang="ar" />
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-20" dir="rtl">
          <div className="rounded-2xl surface p-6 md:p-8">
            <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-[var(--panel-border)] bg-black/25 group">
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(120%_120%_at_50%_100%,rgba(0,0,0,0.6),transparent_60%)] opacity-80 transition-opacity duration-500 group-hover:opacity-20 dark:opacity-60" />
              <div className="pointer-events-none absolute top-4 right-4 rounded-md bg-black/50 dark:bg-black/40 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15">
                خريطة تفاعلية
              </div>
              <iframe title="خريطة المكتب" src="https://www.google.com/maps?q=Dubai&output=embed" className="h-full w-full" loading="lazy" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
