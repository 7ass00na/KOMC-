import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import ContactHero from "@/components/ContactHero";
import Image from "next/image";

export const metadata = {
  alternates: {
    canonical: "/en/contact",
    languages: { en: "/en/contact", ar: "/ar/contact" },
  },
};

export default function Page() {
  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main>
        <div className="about-hero-scope">
          <ContactHero overlay="medium" />
        </div>
        <section className="section no-section-bg mx-auto max-w-7xl px-5 py-16 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
            <div>
              <h1 className="text-4xl font-extrabold text-[var(--ink-primary)]">
                <span className="text-[var(--brand-accent)]">Schedule</span> a Professional Consultation Today
              </h1>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Share the essentials of your matter and a lawyer will review promptly to advise on strategy, timing, and next steps. Your information is handled confidentially.
              </p>
              <div className="mt-6 rounded-2xl surface p-6 md:p-8">
                <div className="relative h-80 md:h-96 overflow-hidden rounded-xl border border-[var(--panel-border)] bg-black/20">
                  <Image src="/images/Services/Insurance.jpg" alt="Lawyer consultation" fill sizes="100vw" className="object-cover" priority />
                  <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/10 dark:bg-[var(--brand-accent)]/10 backdrop-blur-lg px-4 py-3 text-white dark:text-[var(--brand-accent)] border border-white/20">
                    <div className="text-sm font-semibold dark:text-[var(--brand-accent)]">Confidential legal support you can trust</div>
                    <div className="text-[12px] text-zinc-300 dark:text-[var(--brand-accent)]">Clear guidance from experienced counsel, focused on outcomes.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full">
              <ContactForm lang="en" />
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-20">
          <div className="rounded-2xl surface p-6 md:p-8">
            <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-[var(--panel-border)] bg-black/25 group">
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(120%_120%_at_50%_100%,rgba(0,0,0,0.6),transparent_60%)] opacity-80 transition-opacity duration-500 group-hover:opacity-20 dark:opacity-60" />
              <div className="pointer-events-none absolute top-4 left-4 rounded-md bg-black/50 dark:bg-black/40 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15">
                Interactive Map
              </div>
              <iframe title="Office Map" src="https://www.google.com/maps?q=Dubai&output=embed" className="h-full w-full" loading="lazy" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
