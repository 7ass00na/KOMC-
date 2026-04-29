import Header from "@/components/Header";
import HomeHero from "@/components/MainHomeHero";
import Footer from "@/components/Footer";
import ServicesOverview from "@/components/ServicesOverview";
import CasesOverview from "@/components/CasesOverview";
import TeamOverview from "@/components/TeamOverview";
import NewsOverview from "@/components/NewsOverview";
import AboutTrustBand from "@/components/AboutTrustBand";
import TrustedUAE from "@/components/TrustedUAE";
import { Suspense } from "react";
import Reveal from "@/components/Reveal";
import IntroOverlay from "@/components/IntroOverlay";

export const metadata = {
  alternates: {
    canonical: "/en/home",
    languages: {
      en: "/en/home",
      ar: "/ar/home",
    },
  },
};

export default async function Page() {
  let pageDown = false;
  let theme: any = null;
  try {
    const [psRes, thRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/page-states`, { cache: "no-store" }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/theme`, { cache: "no-store" }),
    ]);
    const ps = await psRes.json();
    pageDown = ps?.home?.active === false;
    theme = await thRes.json();
  } catch {}
  const style: React.CSSProperties = {
    ["--brand-primary" as any]: theme?.colors?.primary || undefined,
    ["--brand-accent" as any]: theme?.colors?.secondary || undefined,
    ["--heading-size" as any]: theme?.sizes?.heading || undefined,
    ["--subheading-size" as any]: theme?.sizes?.subheading || undefined,
    ["--content-font-en" as any]: theme?.fonts?.en || undefined,
  };
  if (pageDown) {
    return (
      <div className="min-h-screen hero-bg site-content" style={style}>
        <Header />
        <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
          <section className="section mx-auto max-w-4xl px-5 py-20">
            <h1 className="text-4xl font-bold text-[var(--brand-accent)]">Sorry, the website is currently undergoing maintenance.</h1>
            <p className="mt-4 text-zinc-300">We are working to improve your experience. The website is expected to be back online within an hour. Thank you for your understanding.</p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen hero-bg home site-content" style={style}>
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
