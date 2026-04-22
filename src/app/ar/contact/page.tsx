import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import ContactHero from "@/components/ContactHero";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata = {
  alternates: {
    canonical: "/ar/contact-us",
    languages: { en: "/en/contact-us", ar: "/ar/contact-us" },
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
        <Reveal>
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
                    <Image src="/images/Services/Insurance/1.jpg" alt="استشارة قانونية" fill sizes="100vw" className="object-cover" priority />
                    <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/10 dark:bg-[var(--brand-accent)]/10 backdrop-blur-lg px-4 py-3 text-white dark:text-[var(--brand-accent)] border border-white/20">
                      <span className="insight-badge inline-flex items-center rounded-full bg-black/35 px-3 py-1 text-xs text-white dark:bg-[var(--brand-accent)] dark:text-black">
                        سرية وثقة في كل خطوة
                      </span>
                      <div className="mt-2 text-sm text-zinc-200 dark:text-[var(--brand-accent)]">إرشاد واضح من محامين متمرسين يركزون على النتائج.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-full">
                <ContactForm lang="ar" />
              </div>
            </div>
          </section>
        </Reveal>
        <Reveal>
          <section className="section no-section-bg mx-auto max-w-7xl px-5 pb-16" dir="rtl">
            <div className="rounded-2xl surface p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[var(--brand-accent)]">موقع المكتب</div>
                <a
                  href="https://maps.app.goo.gl/RZuXxXvr5b4uVrY56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[var(--brand-accent)] hover:underline"
                >
                  فتح على خرائط Google
                </a>
              </div>
              <div className="mt-3 relative h-72 md:h-80 overflow-hidden rounded-xl border border-[var(--panel-border)] bg-black/20">
                <iframe
                  title="موقع مكتب KOMC"
                  src="https://www.google.com/maps?q=%D8%A7%D9%84%D8%B7%D8%A7%D8%A8%D9%82%20%D8%A7%D9%84%D8%AB%D8%A7%D9%84%D8%AB%D8%8C%20%D9%85%D8%A8%D9%86%D9%89%20%D8%A7%D9%84%D9%86%D9%88%D8%AE%D8%B0%D8%A9%D8%8C%20%D9%85%D9%8A%D9%86%D8%A7%D8%A1%20%D8%A7%D9%84%D8%AD%D9%85%D8%B1%D9%8A%D8%A9%D8%8C%20%D8%AF%D8%A8%D9%8A%D8%8C%20%D8%A7%D9%84%D8%A5%D9%85%D8%A7%D8%B1%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%AA%D8%AD%D8%AF%D8%A9&output=embed"
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen={true}
                />
              </div>
            </div>
          </section>
        </Reveal>
        
      </main>
      <Footer />
    </div>
  );
}
