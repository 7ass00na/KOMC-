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
      <EasyblocksEditor pageId="home" lang="en" exitHref="/ar/admin?section=homepage">
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
    <EditorShell pageId={id as any} lang="en" exitHref="/ar/admin?section=homepage">
      <div className="min-h-screen hero-bg">
        <Header />
        {id === "about" ? (
          <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
            <AboutHero
              title="فريق قانوني موثوق"
              subtitle="استشارات استراتيجية في القانون البحري والشركات والنزاعات العابرة للحدود."
              overlay="strong"
              kicker="من نحن"
              kickerVariant="filled"
              isRTL
              sources={[
                { src: "/videos/about-hero.webm", type: "video/webm" },
                { src: "/videos/about-hero.mp4", type: "video/mp4" },
              ]}
              poster="/images/about-hero-poster.jpg"
            />
            <AboutMissionValuesSection
              isRTL
              image="/images/about-hero-poster.jpg"
              imageAlt="فريق KOMC القانوني"
              mission={{ title: "مهمتنا", body: "تقديم استشارات استراتيجية موجهة للنتائج في القضايا البحرية والشركات." }}
              values={{ title: "قيمنا", body: "الدقة، النزاهة، سرعة الاستجابة، ونتائج قابلة للقياس." }}
              badges={["الأميرالية", "العقود", "النزاعات"]}
              stats={[
                { value: "١٥+ سنة", label: "خبرة" },
                { value: "الإمارات والخليج", label: "نطاق العمل" },
              ]}
              missionSteps={["الاستلام", "الوقائع", "الاستراتيجية", "الإجراء", "النتيجة"]}
              valuesSteps={["وضوح", "امتثال", "تنفيذ", "مراجعة"]}
              stacked
            />
            <AboutApproachZill />
            <AboutTeamGrid
              isRTL
              team={[
                { name: "خالد عمر", role: "مستشار رئيسي", focus: "الأميرالية", bio: "استشارات استراتيجية في القضايا البحرية والتجارية.", src: "/images/about-hero-poster.jpg" },
                { name: "أ. رحمن", role: "مستشار أول", focus: "العقود", bio: "صياغة وتفاوض للاتفاقيات المعقدة.", src: "/images/about-hero-poster.jpg" },
                { name: "س. نور", role: "قائد التقاضي", focus: "النزاعات", bio: "حل نزاعات عابرة للحدود والتنفيذ.", src: "/images/about-hero-poster.jpg" },
                { name: "ل. عزيز", role: "مستشار امتثال", focus: "تنظيمي", bio: "أطر امتثال عملية وتنفيذ فعّال.", src: "/images/about-hero-poster.jpg" },
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
              <NewsHero isRTL title="مقالات وتحديثات قانونية" subtitle="ملخصات تنفيذية للقيادات القانونية والبحرية." kicker="المقالات" overlay="medium" />
            </div>
            <NewsPageContent
              posts={[
                { slug: "marpol-enforcement-trends", title: "اتجاهات إنفاذ MARPOL", desc: "يزداد نشاط رقابة الدول على الموانئ.", tag: "امتثال", date: "2026-02-01", readTime: "٤ دقائق", image: "/images/post1.jpg", body: "", bullets: [] },
                { slug: "charterparty-risk-controls", title: "ضبط مخاطر عقود الإيجار", desc: "صياغة بنود لتخفيف النزاعات.", tag: "عقود", date: "2026-01-20", readTime: "٦ دقائق", image: "/images/post2.jpg", body: "", bullets: [] },
                { slug: "vessel-arrest-essentials", title: "أساسيات حجز السفن", desc: "جهّز الحقائق والوثائق قبل الأزمات.", tag: "تقاضي", date: "2025-12-10", readTime: "٥ دقائق", image: "/images/post3.jpg", body: "", bullets: [] },
              ]}
              locale="ar"
              title="معرفة قانونية وتحديثات"
              subtitle="ابقَ على اطلاع بتحليلات الخبراء في القانون البحري والامتثال وأفضل الممارسات."
              detailsEmptyLabel="اختر مقالًا لعرض التفاصيل هنا."
              isRTL
            />
          </main>
        ) : null}
        <Footer />
      </div>
    </EditorShell>
  );
}
