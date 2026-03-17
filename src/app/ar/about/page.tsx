import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/AboutHero";
import AboutMissionValuesSection from "@/components/AboutMissionValuesSection";
import AboutApproachZill from "@/components/AboutApproachZill";
import AboutTeamGrid from "@/components/AboutTeamGrid";
import AboutTrustBand from "@/components/AboutTrustBand";

export const metadata = {
  alternates: {
    canonical: "/ar/about",
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
    ["--content-font-ar" as any]: theme?.fonts?.ar || undefined,
  };
  const team = [
    { name: "خالد عمر", role: "شريك إداري", focus: "بحري، استراتيجية، منازعات معقدة", bio: "قانون بحري واستراتيجية ومنازعات معقدة.", src: withV("/images/team/khaled-omer..png") },
    { name: "سارة محمد", role: "محامية بحرية", focus: "أميرالية، بضائع، حجز سفن", bio: "الأميرالية والبضائع وحجز السفن.", src: withV("/images/team/sara-mohamed.jpg") },
    { name: "أحمد علي", role: "مستشار شركات", focus: "شركات، امتثال، معاملات", bio: "العقود والامتثال والمعاملات.", src: withV("/images/team/ahmed-ali.jpg") },
    { name: "نور حسن", role: "محامية دعاوى", focus: "تقاضي، دعم التحكيم", bio: "إجراءات مدنية ودعم التحكيم.", src: withV("/images/team/nour-hassan.jpg") },
    { name: "مينا سعد", role: "محامٍ مساعد", focus: "عقود، مراجعة مخاطر", bio: "صياغة ومراجعة العقود التجارية.", src: withV("/person.svg") },
    { name: "فاطمة عزيز", role: "مساعدة قانونية", focus: "أبحاث، إيداعات", bio: "أبحاث قانونية وإيداعات تنظيمية.", src: withV("/person.svg") },
    { name: "عمر يوسف", role: "مستشار", focus: "تحكيم، تنفيذ", bio: "تحكيم وتنفيذ الأحكام.", src: withV("/person.svg") },
    { name: "ليلى كريم", role: "علاقات العملاء", focus: "الاستقبال، التواصل", bio: "الاستقبال والتواصل مع العملاء.", src: withV("/person.svg") },
  ];
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
    <div className="min-h-screen hero-bg site-content" style={style}>
      <Header />
      <main>
        <div className="about-hero-scope">
        <AboutHero
          title="قصتنا وفريقنا ورسالتنا"
          subtitle="ممارسة قانونية بحرية مركّزة — استراتيجية أولاً وتواصل واضح ونتائج قابلة للقياس."
          sources={[
            { src: "/videos/about-hero.webm", type: "video/webm" },
            { src: "/videos/about-hero.mp4", type: "video/mp4" },
          ]}
          poster="/images/about-hero-poster.jpg"
          isRTL
          kicker="منذ 2010"
        />
        </div>
        <div className="about-scope pt-[32px] md:pt-[48px] lg:pt-[64px]">
        <section className="section no-section-bg mx-auto max-w-7xl px-5 py-20">
          <h1 className="text-4xl font-bold text-[var(--brand-accent)]">عن شركة KOMC</h1>
          <p className="mt-4 text-zinc-300 max-w-3xl">
            نقدم إرشادًا قانونيًا استراتيجيًا في الأميرالية والاستشارات الشركاتية
            وتسوية المنازعات لقطاع الأعمال البحري في الإمارات وحول العالم.
          </p>
          <AboutMissionValuesSection
            isRTL
            image="/images/about/about-hero-poster.jpg"
            imageAlt="لقطة لفريق قانوني بحري يعمل معًا"
            mission={{ title: "الرسالة", body: "حماية مصالح العملاء بحلول قانونية دقيقة وذات جدوى تجارية." }}
            values={{ title: "القيم", body: "النزاهة والمسؤولية والوضوح والنتائج القابلة للقياس." }}
            badges={["منذ 2010", "تركيز بحري", "حضور عالمي"]}
            accentStripe
            stats={[
              { value: "14+", label: "سنوات" },
              { value: "48س", label: "حجز سفينة" },
              { value: "85%", label: "تسويات مبكرة" },
            ]}
            stacked
            missionSteps={["الغاية", "المبادئ", "الأثر"]}
            valuesSteps={["النزاهة", "الشفافية", "التركيز على العميل", "المسؤولية", "الوضوح", "النتائج"]}
            missionRepLines={["تمثيل قانوني موثوق في السياقات البحرية والتجارية."]}
            valuesRepLines={["تمثيل قانوني موثوق في السياقات البحرية والتجارية."]}
          />
        </section>

        <AboutApproachZill isRTL heading="المنهج" />

        <section className="section no-section-bg mx-auto max-w-7xl px-5 pb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]">فريقنا من الخبراء</h2>
          <AboutTeamGrid team={team} isRTL />
        </section>

        <AboutTrustBand className="no-section-bg" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
