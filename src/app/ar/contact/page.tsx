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
                    <Image src="/images/Services/Insurance.jpg" alt="استشارة قانونية" fill sizes="100vw" className="object-cover" priority />
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
        
      </main>
      <Footer />
    </div>
  );
}
