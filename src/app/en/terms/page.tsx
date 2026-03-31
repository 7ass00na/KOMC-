import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata = {
  alternates: {
    canonical: "/en/terms",
    languages: { en: "/en/terms", ar: "/ar/terms" },
  },
};

export default function Page() {
  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
        <Reveal>
          <section className="section mx-auto max-w-4xl px-5 py-20">
            <h1 className="text-4xl font-bold text-[var(--brand-accent)]">Terms of Service</h1>
            <div className="mt-4 text-zinc-300">
              Information on this site is general and does not constitute legal advice. Engagements require a written agreement. We limit liability to the maximum extent permitted by law. By using this site, you agree to these terms.
            </div>
          </section>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
