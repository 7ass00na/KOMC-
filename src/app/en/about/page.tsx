import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/AboutHero";
import AboutMissionValuesSection from "@/components/AboutMissionValuesSection";
import AboutApproachZill from "@/components/AboutApproachZill";
import AboutTeamGrid from "@/components/AboutTeamGrid";
import AboutTrustBand from "@/components/AboutTrustBand";
import Reveal from "@/components/Reveal";

export const metadata = {
  alternates: {
    canonical: "/en/about-us",
    languages: { en: "/en/about-us", ar: "/ar/about-us" },
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
  const teamPrimary = [
    { name: "Khaled Omer", role: "Managing Partner & Maritime Attorney", focus: "Maritime, Strategy, Vessel Arrests", bio: "Maritime law, strategy, vessel arrests.", src: withV("/images/team/khaled-omer.png"), tags: ["Maritime", "Enforcement"], mobileFocal: "50% 22%" },
    { name: "Mohamed Dafallah", role: "Managing Attorney", focus: "Manage, Cargo, Complex Disputes", bio: "Admiralty, cargo, complex disputes.", src: withV("/images/team/Mohamed Dafallah.png"), tags: ["Legal advisor", "Manage"], mobileFocal: "50% 22%" },
    { name: "Malik Omer", role: "Maritime Captain", focus: "Shipping, Compliance, Transactions", bio: "Contracts, compliance, transactions.", src: withV("/images/team/Malik Omer.png"), tags: ["Manage", "Maritime"], mobileFocal: "50% 22%" },
    { name: "Ibrahim Hassan", role: "Litigation Associate", focus: "Litigation, Arbitration Support", bio: "Civil procedure, arbitration support.", src: withV("/images/team/nour-hassan.jpg"), tags: ["Disputes", "Arbitration"] },
  ];
  const teamSecondary = [
    { name: "Hazim Abdallah", role: "Associate Attorney", focus: "Shipping, Compliance", bio: "Shipping operations and compliance support.", src: withV("/images/team/T05.jpeg"), tags: ["Shipping", "Compliance"], mobileFocal: "50% 22%" },
    { name: "Mohamed Yousif", role: "Associate Attorney", focus: "Cargo, Disputes", bio: "Cargo handling and dispute coordination.", src: withV("/images/team/T06.jpeg"), tags: ["Cargo", "Disputes"], mobileFocal: "50% 22%" },
    { name: "Mohamed Babiker", role: "Associate", focus: "Transactions, Support", bio: "Transactional support and diligence.", src: withV("/images/team/T07.jpeg"), tags: ["Transactions", "Support"], mobileFocal: "50% 22%" },
    { name: "Jayantah Chariminar", role: "Associate Attorney", focus: "Shipping, Claims", bio: "Shipping claims coordination and resolution.", src: withV("/images/team/T08.jpeg"), tags: ["Shipping", "Claims"], mobileFocal: "50% 22%" },
  ];
  const teamTertiary = [
    { name: "Somia Khider", role: "Associate", focus: "Contracts, Governance", bio: "Contract reviews and governance processes.", src: withV("/images/team/T09.jpeg"), tags: ["Contracts", "Governance"], mobileFocal: "50% 22%" },
    { name: "Ahmed Omer", role: "Associate", focus: "Corporate, Transactions", bio: "Corporate support and transactional diligence.", src: withV("/images/team/T010.jpeg"), tags: ["Corporate", "Transactions"] },
    { name: "Mohamed Sobihi", role: "Associate", focus: "Compliance, Documentation", bio: "Compliance documentation and legal drafting.", src: withV("/images/team/T011.jpeg"), tags: ["Compliance", "Drafting"], mobileFocal: "50% 22%" },
    { name: "Nadia Ali", role: "Associate", focus: "Arbitration, Trade", bio: "Trade arbitration coordination and case support.", src: withV("/images/team/T012.jpeg"), tags: ["Arbitration", "Trade"], mobileFocal: "50% 22%" },
  ];
  const teamQuaternary = [
    { name: "Member 13", role: "Associate", focus: "Various", bio: "Placeholder", src: withV("/images/team/T05.jpeg"), tags: ["Legal"], mobileFocal: "50% 22%" },
    { name: "Member 14", role: "Associate", focus: "Various", bio: "Placeholder", src: withV("/images/team/T06.jpeg"), tags: ["Legal"], mobileFocal: "50% 22%" },
    { name: "Member 15", role: "Associate", focus: "Various", bio: "Placeholder", src: withV("/images/team/T07.jpeg"), tags: ["Legal"], mobileFocal: "50% 22%" },
    { name: "Member 16", role: "Associate", focus: "Various", bio: "Placeholder", src: withV("/images/team/T08.jpeg"), tags: ["Legal"], mobileFocal: "50% 22%" },
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
        <Reveal>
          <section className="section no-section-bg mx-auto max-w-7xl px-5 py-20">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]">About KOMC</h1>
            <p className="mt-4 text-zinc-300 max-w-3xl text-base md:text-lg leading-7">
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
        </Reveal>

        <Reveal>
          <AboutApproachZill heading="Approach" />
        </Reveal>

        <Reveal>
          <section className="section no-section-bg mx-auto max-w-7xl px-5 pb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]">Our Legal Team</h2>
            <p className="mt-1 text-zinc-300 leading-6">
              <span>Strategy‑first counsel with clear communication and measurable outcomes.</span><br/>
              <span>Evidence‑led preparation and rigorous documentation at every step.</span><br/>
              <span>Disciplined execution across admiralty, commercial disputes, and enforcement.</span>
            </p>
            <AboutTeamGrid team={teamPrimary} startIndex={0} />
            <div className="mt-8">
              <AboutTeamGrid team={teamSecondary} startIndex={4} />
            </div>
            <div className="mt-8">
              <AboutTeamGrid team={teamTertiary} startIndex={8} />
            </div>
            <div className="mt-8">
              <AboutTeamGrid team={teamQuaternary} startIndex={12} />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <AboutTrustBand className="no-section-bg" />
        </Reveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
