import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsHero from "@/components/NewsHero";
import NewsPageContent from "@/components/NewsPageContent";
import Reveal from "@/components/Reveal";

export const metadata = {
  alternates: {
    canonical: "/en/news",
    languages: { en: "/en/news", ar: "/ar/news" },
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
    pageDown = ps?.news?.active === false;
    theme = await thRes.json();
  } catch {}
  const style: React.CSSProperties = {
    ["--brand-primary" as any]: theme?.colors?.primary || undefined,
    ["--brand-accent" as any]: theme?.colors?.secondary || undefined,
    ["--heading-size" as any]: theme?.sizes?.heading || undefined,
    ["--subheading-size" as any]: theme?.sizes?.subheading || undefined,
    ["--content-font-en" as any]: theme?.fonts?.en || undefined,
  };
  const posts = [
    {
      slug: "maritime-insurance-claims",
      title: "Understanding Maritime Insurance Claims: A Complete Guide",
      desc: "Coverage maps, common pitfalls, and how to recover faster.",
      tag: "Maritime Law",
      date: "2026-02-01",
      readTime: "8 min read",
      image: "/images/Case/shiping%20cont.jpg",
      body: "Maritime claims move fast. Insurers evaluate documentation, causation, and mitigation within tight windows. A structured response plan protects coverage and accelerates recovery.",
      bullets: [
        "Document incident timelines and vessel logs within 24 hours.",
        "Align survey reports with policy wording and trading limits.",
        "Quantify losses early to support reserves and settlement cadence.",
      ],
    },
    {
      slug: "corporate-compliance-2026",
      title: "Corporate Compliance in 2026: Key Changes",
      desc: "How regulatory updates affect contracts and governance.",
      tag: "Compliance",
      date: "2026-01-20",
      readTime: "5 min read",
      image: "/images/Services/Trade1.jpg",
      body: "New disclosure rules and board accountability standards require better audit trails. Teams need clearer approval workflows and contract playbooks to stay compliant.",
      bullets: [
        "Refresh delegation matrices and contract authority limits.",
        "Centralize compliance evidence with stakeholder sign-offs.",
        "Update vendor clauses to align with new reporting duties.",
      ],
    },
    {
      slug: "international-trade-disputes",
      title: "Resolving International Trade Disputes",
      desc: "Actionable steps to reduce exposure and settle faster.",
      tag: "Arbitration",
      date: "2026-01-05",
      readTime: "6 min read",
      image: "/images/Services/Insurance.jpg",
      body: "Early dispute assessment improves leverage and reduces cost. A clear evidence map plus jurisdiction analysis streamlines settlement strategy.",
      bullets: [
        "Map governing law, forum, and interim relief options.",
        "Secure trade documentation and payment trails quickly.",
        "Prioritize settlement parameters before escalation.",
      ],
    },
  ];
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
          <NewsHero overlay="medium" />
        </div>
        <Reveal>
          <NewsPageContent
            posts={posts}
            locale="en"
            title="Legal Knowledge & Updates"
            subtitle="Stay informed with expert analysis on maritime law, corporate regulations, and legal best practices."
            detailsEmptyLabel="Select a news article to view details."
          />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
