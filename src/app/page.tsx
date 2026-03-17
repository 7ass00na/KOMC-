import Header from "@/components/Header";
import HomeHero from "@/components/MainHomeHero";
import Footer from "@/components/Footer";
import ServicesOverview from "@/components/ServicesOverview";
import CasesOverview from "@/components/CasesOverview";
import TeamOverview from "@/components/TeamOverview";
import NewsOverview from "@/components/NewsOverview";
import TrustedUAE from "@/components/TrustedUAE";
import { Suspense } from "react";
import AboutTrustBand from "@/components/AboutTrustBand";

export const metadata = {
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      ar: "/ar",
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen hero-bg home">
      <Header />
      <main>
        <section id="hero">
          <HomeHero />
        </section>
        <section id="partners">
          <TrustedUAE />
        </section>
        <section id="services">
          <Suspense fallback={<div className="section mx-auto max-w-7xl px-5 py-10"><div className="h-48 rounded-2xl bg-white/5 border border-zinc-700/40 animate-pulse" /></div>}>
            <ServicesOverview />
          </Suspense>
        </section>
        <section id="cases">
          <Suspense fallback={<div className="section mx-auto max-w-7xl px-5 py-10"><div className="h-48 rounded-2xl bg-white/5 border border-zinc-700/40 animate-pulse" /></div>}>
            <CasesOverview />
          </Suspense>
        </section>
        <section id="team">
          <TeamOverview />
        </section>
        <section id="news">
          <NewsOverview />
        </section>
        <section id="trusted">
          <AboutTrustBand className="no-section-bg" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
