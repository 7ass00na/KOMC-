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
  const teamPrimary = [
    { name: "خالد عمر", role: "شريك إداري", focus: "بحري، استراتيجية، منازعات معقدة", bio: "قانون بحري واستراتيجية ومنازعات معقدة.", src: withV("/images/team/khaled-omer.png"), tags: ["بحري", "تنفيذ"], mobileFocal: "50% 22%" },
    { name: "محمد دفع الله", role: "مدير المكتب", focus: "أميرالية، بضائع، حجز سفن", bio: "الأميرالية والبضائع وحجز السفن.", src: withV("/images/team/Mohamed Dafallah.png"), tags: ["إدارة", "تنفيذ"], mobileFocal: "50% 22%" },
    { name: "مالك عمر", role: "مستشار شركات", focus: "شركات، امتثال، معاملات", bio: "العقود والامتثال والمعاملات.", src: withV("/images/team/Malik Omer.png"), tags: ["إدارة", "بحري"], mobileFocal: "50% 22%" },
    { name: "ابراهيم حسن", role: "محامية دعاوى", focus: "تقاضي، دعم التحكيم", bio: "إجراءات مدنية ودعم التحكيم.", src: withV("/images/team/nour-hassan.jpg"), tags: ["منازعات", "تحكيم"] },
  ];
  const teamSecondary = [
    { name: "Hazim Abdallah", role: "محامٍ مساعد", focus: "شحن، امتثال", bio: "عمليات الشحن ودعم الامتثال.", src: withV("/images/team/T05.jpeg"), tags: ["شحن", "امتثال"], mobileFocal: "50% 22%" },
    { name: "Mohamed Yousif", role: "محامٍ مساعد", focus: "بضائع، منازعات", bio: "تنسيق منازعات البضائع وإدارتها.", src: withV("/images/team/T06.jpeg"), tags: ["بضائع", "منازعات"], mobileFocal: "50% 22%" },
    { name: "Mohamed Babiker", role: "محامٍ مساعد", focus: "معاملات، دعم", bio: "دعم المعاملات القانونية وإجراءات الفحص.", src: withV("/images/team/T07.jpeg"), tags: ["معاملات", "دعم"], mobileFocal: "50% 22%" },
    { name: "Jayantah Chariminar", role: "محامٍ مساعد", focus: "شحن، مطالبات", bio: "تنسيق مطالبات الشحن وحلّها.", src: withV("/images/team/T08.jpeg"), tags: ["شحن", "مطالبات"], mobileFocal: "50% 22%" },
  ];
  const teamTertiary = [
    { name: "Somia Khider", role: "محامٍ مساعد", focus: "عقود، حوكمة", bio: "مراجعات العقود وإجراءات الحوكمة.", src: withV("/images/team/T09.jpeg"), tags: ["عقود", "حوكمة"], mobileFocal: "50% 22%" },
    { name: "Ahmed Omer", role: "محامٍ مساعد", focus: "شركات، معاملات", bio: "دعم الشركات والمعاملات القانونية.", src: withV("/images/team/T010.jpeg"), tags: ["شركات", "معاملات"] },
    { name: "Mohamed Sobihi", role: "محامٍ مساعد", focus: "امتثال، توثيق", bio: "توثيق امتثال وإعداد مستندات قانونية.", src: withV("/images/team/T011.jpeg"), tags: ["امتثال", "توثيق"], mobileFocal: "50% 22%" },
    { name: "Nadia Ali", role: "محامٍ مساعد", focus: "تحكيم، تجارة", bio: "تنسيق تحكيم التجارة ودعم القضايا.", src: withV("/images/team/T012.jpeg"), tags: ["تحكيم", "تجارة"], mobileFocal: "50% 22%" },
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
        <Reveal>
          <section className="section no-section-bg mx-auto max-w-7xl px-5 py-20">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]">عن شركة KOMC</h1>
            <p className="mt-4 text-zinc-300 max-w-3xl text-base md:text-lg leading-7">
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
        </Reveal>

        <Reveal>
          <AboutApproachZill isRTL heading="المنهج" />
        </Reveal>

        <Reveal>
          <section className="section no-section-bg mx-auto max-w-7xl px-5 pb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]">فريقنا القانوني</h2>
          <p className="mt-1 text-zinc-300 leading-6">
            <span>إرشاد قانوني قائم على الاستراتيجية وتواصل واضح ونتائج قابلة للقياس.</span><br/>
            <span>تحضير مبني على الأدلة ومراجعة دقيقة للوثائق في كل مرحلة.</span><br/>
            <span>تنفيذ منضبط في الأميرالية والمنازعات التجارية وأعمال التنفيذ.</span>
          </p>
          <AboutTeamGrid team={teamPrimary} isRTL startIndex={0} />
          <div className="mt-8">
            <AboutTeamGrid team={teamSecondary} isRTL startIndex={4} />
          </div>
          <div className="mt-8">
            <AboutTeamGrid team={teamTertiary} isRTL startIndex={8} />
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
