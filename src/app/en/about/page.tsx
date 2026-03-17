import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/AboutHero";
import AboutMissionValuesSection from "@/components/AboutMissionValuesSection";
import AboutApproachZill from "@/components/AboutApproachZill";
import AboutTeamGrid from "@/components/AboutTeamGrid";
import AboutTrustBand from "@/components/AboutTrustBand";

export const metadata = {
  alternates: {
    canonical: "/en/about",
    languages: { en: "/en/about", ar: "/ar/about" },
  },
};

export default async function Page() {
  const v = process.env.NEXT_PUBLIC_ASSET_VERSION;
  const withV = (p: string) => (v ? `${p}?v=${v}` : p);
  let pageDown = false;
  let theme: any = null;
  try {
    const [psRes, thRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/page-states`, { cache: "no-store" }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/theme`, { cache: "no-store" }),
    ]);
    const ps = await psRes.json();
    pageDown = ps?.about?.active === false;
    theme = await thRes.json();
  } catch {}
  const style: React.CSSProperties = {
    ["--brand-primary" as any]: theme?.colors?.primary || undefined,
    ["--brand-accent" as any]: theme?.colors?.secondary || undefined,
    ["--heading-size" as any]: theme?.sizes?.heading || undefined,
    ["--subheading-size" as any]: theme?.sizes?.subheading || undefined,
    ["--content-font-en" as any]: theme?.fonts?.en || undefined,
  };
  const team = [
    { name: "Khaled Omer", role: "Managing Partner", focus: "Maritime, Strategy, Complex Disputes", bio: "Maritime law, strategy, complex disputes.", src: withV("/images/team/khaled-omer..png") },
    { name: "Sara Mohamed", role: "Maritime Attorney", focus: "Admiralty, Cargo, Vessel Arrests", bio: "Admiralty, cargo, vessel arrests.", src: withV("/images/team/sara-mohamed.jpg") },
    { name: "Ahmed Ali", role: "Corporate Counsel", focus: "Corporate, Compliance, Transactions", bio: "Contracts, compliance, transactions.", src: withV("/images/team/ahmed-ali.jpg") },
    { name: "Nour Hassan", role: "Litigation Associate", focus: "Litigation, Arbitration Support", bio: "Civil procedure, arbitration support.", src: withV("/images/team/nour-hassan.jpg") },
    { name: "Mina Saad", role: "Associate", focus: "Contracts, Risk Review", bio: "Drafting and reviewing commercial contracts.", src: withV("/person.svg") },
    { name: "Fatima Aziz", role: "Paralegal", focus: "Research, Filings", bio: "Legal research and regulatory filings.", src: withV("/person.svg") },
    { name: "Omar Youssef", role: "Of Counsel", focus: "Arbitration, Enforcement", bio: "Arbitration and award enforcement.", src: withV("/person.svg") },
    { name: "Layla Karim", role: "Client Relations", focus: "Intake, Communication", bio: "Intake and client communications.", src: withV("/person.svg") },
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
        <AboutHero
          title="Our Story, Team, and Purpose"
          subtitle="A focused maritime practice — strategy first, clear communication, and measurable outcomes."
          sources={[
            { src: "/videos/about-hero.webm", type: "video/webm" },
            { src: "/videos/about-hero.mp4", type: "video/mp4" },
          ]}
          poster="/images/about-hero-poster.jpg"
          overlay="medium"
          kicker="Since 2010"
        />
        </div>
        <div className="about-scope pt-[32px] md:pt-[48px] lg:pt-[64px]">
        <section className="section no-section-bg mx-auto max-w-7xl px-5 py-20">
          <h1 className="text-4xl font-bold text-[var(--brand-accent)]">About KOMC</h1>
          <p className="mt-4 text-zinc-300 max-w-3xl">
            KO Maritime Consultancy provides strategic legal guidance across admiralty, corporate advisory,
            and dispute resolution for maritime businesses in the UAE and globally.
          </p>
          <AboutMissionValuesSection
            image="/images/about/about-hero-poster.jpg"
            imageAlt="Lawyers collaborating at a maritime boardroom"
            mission={{ title: "Mission", body: "Protect clients’ interests with precise, commercially‑savvy legal solutions." }}
            values={{ title: "Values", body: "Integrity, accountability, clarity, and measurable outcomes." }}
            badges={["Since 2010", "Maritime Focus", "Global Reach"]}
            accentStripe
            stats={[
              { value: "14+", label: "Years" },
              { value: "48h", label: "Vessel Arrest" },
              { value: "85%", label: "Early Settlements" },
            ]}
            stacked
            missionSteps={["Purpose", "Principles", "Impact"]}
            valuesSteps={["Integrity", "Transparency", "Client‑centric", "Accountability", "Clarity", "Outcomes"]}
            missionRepLines={["Trusted legal representation in maritime and commercial contexts."]}
            valuesRepLines={["Trusted legal representation in maritime and commercial contexts."]}
          />
        </section>

        <AboutApproachZill heading="Approach" />

        <section className="section no-section-bg mx-auto max-w-7xl px-5 pb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]">Our Team of Experts</h2>
          <AboutTeamGrid team={team} />
        </section>

        <AboutTrustBand className="no-section-bg" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
