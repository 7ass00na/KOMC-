import Header from "@/components/Header";
import HomeHero from "@/components/MainHomeHero";
import Footer from "@/components/Footer";
import IntroOverlay from "@/components/IntroOverlay";
import ServicesOverview from "@/components/ServicesOverview";
import CasesOverview from "@/components/CasesOverview";
import TeamOverview from "@/components/TeamOverview";
import NewsOverview from "@/components/NewsOverview";
import TrustedUAE from "@/components/TrustedUAE";
import { Suspense } from "react";
import AboutTrustBand from "@/components/AboutTrustBand";
import Reveal from "@/components/Reveal";
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/next';


  function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

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
      <IntroOverlay />
      <Header />
      <main>
        <section id="hero">
          <HomeHero />
        </section>
        <section id="partners">
          <Reveal>
            <TrustedUAE />
          </Reveal>
        </section>
        <section id="services">
          <Reveal>
            <Suspense fallback={<div className="section mx-auto max-w-7xl px-5 py-10"><div className="h-48 rounded-2xl bg-white/5 border border-zinc-700/40 animate-pulse" /></div>}>
              <ServicesOverview />
            </Suspense>
          </Reveal>
        </section>
        <section id="cases">
          <Reveal>
            <Suspense fallback={<div className="section mx-auto max-w-7xl px-5 py-10"><div className="h-48 rounded-2xl bg-white/5 border border-zinc-700/40 animate-pulse" /></div>}>
              <CasesOverview />
            </Suspense>
          </Reveal>
        </section>
        <section id="team">
          <Reveal>
            <TeamOverview />
          </Reveal>
        </section>
        <section id="news">
          <Reveal>
            <NewsOverview />
          </Reveal>
        </section>
        <section id="trusted">
          <Reveal>
            <AboutTrustBand className="no-section-bg" />
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
