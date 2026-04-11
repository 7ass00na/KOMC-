import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import ContactHero from "@/components/ContactHero";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata = {
  alternates: {
    canonical: "/en/contact-us",
    languages: { en: "/en/contact-us", ar: "/ar/contact-us" },
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
        <Reveal>
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
                      <span className="insight-badge inline-flex items-center rounded-full bg-black/35 px-3 py-1 text-xs text-white dark:bg-[var(--brand-accent)] dark:text-black">
                        Confidential legal support you can trust
                      </span>
                      <div className="mt-2 text-sm text-zinc-200 dark:text-[var(--brand-accent)]">Clear guidance from experienced counsel, focused on outcomes.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-full">
                <ContactForm lang="en" />
              </div>
            </div>
          </section>
        </Reveal>
        <Reveal>
          <section className="section no-section-bg mx-auto max-w-7xl px-5 pb-16">
            <div className="rounded-2xl surface p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[var(--brand-accent)]">Visit Our Office</div>
                <a
                  href="https://maps.app.goo.gl/RZuXxXvr5b4uVrY56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[var(--brand-accent)] hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
              <div className="mt-3 relative h-72 md:h-80 overflow-hidden rounded-xl border border-[var(--panel-border)] bg-black/20">
                <iframe
                  title="KOMC Office Location"
                  src="https://www.google.com/maps?q=Al%20Nokhatha%20Building%20Hamriya%20Port%20Dubai%20UAE&output=embed"
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
