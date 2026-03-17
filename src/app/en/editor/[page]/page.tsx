import { notFound } from "next/navigation";
import EditorShell from "@/components/editor/EditorShell";
import EasyblocksEditor from "@/components/editor/EasyblocksEditor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeHero from "@/components/MainHomeHero";
import ServicesOverview from "@/components/ServicesOverview";
import CasesOverview from "@/components/CasesOverview";
import TeamOverview from "@/components/TeamOverview";
import NewsOverview from "@/components/NewsOverview";
import AboutTrustBand from "@/components/AboutTrustBand";
import TrustedUAE from "@/components/TrustedUAE";
import AboutHero from "@/components/AboutHero";
import AboutMissionValuesSection from "@/components/AboutMissionValuesSection";
import AboutApproachZill from "@/components/AboutApproachZill";
import AboutTeamGrid from "@/components/AboutTeamGrid";
import NewsHero from "@/components/NewsHero";
import NewsPageContent from "@/components/NewsPageContent";
import ServicesHero from "@/components/ServicesHero";
import { Suspense } from "react";

export default function Page({ params }: { params: { page: string } }) {
  const raw = params.page;
  const id = (["home", "about", "services", "cases", "news"].includes(raw) ? raw : "home") as "home" | "about" | "services" | "cases" | "news";
  if (id === "home") {
    return (
      <EasyblocksEditor pageId="home" lang="en" exitHref="/en/admin?section=homepage">
        <div className="min-h-screen hero-bg">
          <Header />
          <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
            <section id="hero" className="section mx-auto max-w-7xl px-5">
              <HomeHero />
            </section>
            <section id="services">
              <Suspense fallback={<div className="section mx-auto max-w-7xl px-5 py-10" />}>
                <ServicesOverview />
              </Suspense>
            </section>
            <section id="cases">
              <Suspense fallback={<div className="section mx-auto max-w-7xl px-5 py-10" />}>
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
              <AboutTrustBand />
            </section>
            <section id="partners">
              <TrustedUAE />
            </section>
          </main>
          <Footer />
        </div>
      </EasyblocksEditor>
    );
  }
  return (
    <EditorShell pageId={id as any} lang="en" exitHref="/en/admin?section=homepage">
      <div className="min-h-screen hero-bg">
        <Header />
        {id === "about" ? (
          <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
            <AboutHero
              title="Trusted Legal Team"
              subtitle="Strategic counsel across maritime, corporate, and cross‑border disputes."
              overlay="strong"
              kicker="About KOMC"
              kickerVariant="filled"
              sources={[
                { src: "/videos/about-hero.webm", type: "video/webm" },
                { src: "/videos/about-hero.mp4", type: "video/mp4" },
              ]}
              poster="/images/about-hero-poster.jpg"
            />
            <AboutMissionValuesSection
              image="/images/about-hero-poster.jpg"
              imageAlt="KOMC legal team"
              mission={{ title: "Our Mission", body: "Deliver strategic, outcome‑focused counsel across maritime and corporate matters." }}
              values={{ title: "Our Values", body: "Precision, integrity, responsiveness, and measurable results." }}
              badges={["Admiralty", "Contracts", "Disputes"]}
              stats={[
                { value: "15+ yrs", label: "Experience" },
                { value: "UAE & GCC", label: "Coverage" },
              ]}
              missionSteps={["Intake", "Facts", "Strategy", "Action", "Resolution"]}
              valuesSteps={["Clarity", "Compliance", "Execution", "Review"]}
              stacked
            />
            <AboutApproachZill />
            <AboutTeamGrid
              team={[
                { name: "Khaled Omer", role: "Principal Consultant", focus: "Admiralty", bio: "Strategic counsel in maritime and commercial matters.", src: "/images/about-hero-poster.jpg" },
                { name: "A. Rahman", role: "Senior Counsel", focus: "Contracts", bio: "Drafting and negotiation for complex agreements.", src: "/images/about-hero-poster.jpg" },
                { name: "S. Noor", role: "Litigation Lead", focus: "Disputes", bio: "Cross‑border dispute resolution and enforcement.", src: "/images/about-hero-poster.jpg" },
                { name: "L. Aziz", role: "Compliance Advisor", focus: "Regulatory", bio: "Practical compliance frameworks and implementation.", src: "/images/about-hero-poster.jpg" },
              ]}
            />
            <AboutTrustBand />
          </main>
        ) : null}
        {id === "services" ? (
          <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
            <ServicesHero />
            <Suspense fallback={<div className="section mx-auto max-w-7xl px-5 py-10" />}>
              <ServicesOverview variant="page" />
            </Suspense>
          </main>
        ) : null}
        {id === "cases" ? (
          <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
            <Suspense fallback={<div className="section mx-auto max-w-7xl px-5 py-10" />}>
              <CasesOverview variant="page" />
            </Suspense>
          </main>
        ) : null}
        {id === "news" ? (
          <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
            <div className="section mx-auto max-w-7xl px-5">
              <NewsHero title="Legal Articles & Updates" subtitle="Executive briefs for maritime and legal leaders." kicker="Articles" overlay="medium" />
            </div>
            <NewsPageContent
              posts={[
                { slug: "marpol-enforcement-trends", title: "MARPOL Enforcement Trends", desc: "Port State Control activity continues to rise.", tag: "Compliance", date: "2026-02-01", readTime: "4 min", image: "/images/post1.jpg", body: "", bullets: [] },
                { slug: "charterparty-risk-controls", title: "Charterparty Risk Controls", desc: "Drafting clauses to mitigate disputes.", tag: "Contracts", date: "2026-01-20", readTime: "6 min", image: "/images/post2.jpg", body: "", bullets: [] },
                { slug: "vessel-arrest-essentials", title: "Vessel Arrest Essentials", desc: "Prepare facts and documents ahead of crisis.", tag: "Litigation", date: "2025-12-10", readTime: "5 min", image: "/images/post3.jpg", body: "", bullets: [] },
              ]}
              locale="en"
              title="Legal Knowledge & Updates"
              subtitle="Stay current with expert analysis on maritime law and compliance best practices."
              detailsEmptyLabel="Select an article to view details here."
            />
          </main>
        ) : null}
        <Footer />
      </div>
    </EditorShell>
  );
}
