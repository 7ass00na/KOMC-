import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CasesOverview from "@/components/CasesOverview";
import { Suspense } from "react";
import CasesHero from "@/components/CasesHero";

export const metadata = {
  alternates: {
    canonical: "/en/cases",
    languages: { en: "/en/cases", ar: "/ar/cases" },
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
    pageDown = ps?.cases?.active === false;
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
    <div className="min-h-screen hero-bg site-content" style={style}>
      <Header />
       <main>
        <div className="about-hero-scope">
          <CasesHero overlay="medium" />
        </div>
        <div className="pt-[32px] md:pt-[48px] lg:pt-[64px]">
          <Suspense
            fallback={
              <section className="section mx-auto max-w-7xl px-5 py-20">
                <div className="h-10 w-48 rounded bg-white/5 border border-zinc-700/40 animate-pulse" />
                <div className="mt-6 h-64 rounded-2xl bg-white/5 border border-zinc-700/40 animate-pulse" />
              </section>
            }
          >
            <CasesOverview variant="page" />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
