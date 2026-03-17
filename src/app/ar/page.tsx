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

export const metadata = {
  alternates: {
    canonical: "/ar",
    languages: {
      en: "/en",
      ar: "/ar",
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
    ["--content-font-ar" as any]: theme?.fonts?.ar || undefined,
  };
  if (pageDown) {
    return (
      <div className="min-h-screen hero-bg site-content" style={style}>
        <Header />
        <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
          <section className="section mx-auto max-w-4xl px-5 py-20">
            <h1 className="text-4xl font-bold text-[var(--brand-accent)]">عذرًا، الموقع يخضع حاليًا لأعمال الصيانة.</h1>
            <p className="mt-4 text-zinc-300">نعمل على تحسين تجربتكم. من المتوقع أن يعود الموقع للعمل خلال ساعة. شكرًا لتفهمكم.</p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen hero-bg home site-content" style={style}>
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
