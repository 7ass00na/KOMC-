import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsHero from "@/components/NewsHero";
import NewsPageContent from "@/components/NewsPageContent";
import Reveal from "@/components/Reveal";

export const metadata = {
  alternates: {
    canonical: "/ar/news",
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
    ["--content-font-ar" as any]: theme?.fonts?.ar || undefined,
  };
  const posts = [
    {
      slug: "maritime-insurance-claims",
      title: "فهم مطالبات تأمين الملاحة البحرية: دليل شامل",
      desc: "خرائط للغطاء، ونقاط المطالبة الشائعة، وكيفية تقليل خسائر التعويض.",
      tag: "قانون بحري",
      date: "2026-02-01",
      readTime: "8 دقائق قراءة",
      image: "/images/News/N01.jpg",
      body: "مطالبات التأمين البحري تتطلب سرعة ودقة في جمع الأدلة وتحليل السبب المباشر. تنظيم الخطوات يحسن فرص التغطية ويختصر زمن التسوية.",
      bullets: [
        "توثيق الحادث وسجلات السفينة خلال 24 ساعة.",
        "مطابقة تقارير المسح مع شروط الوثيقة وحدودها.",
        "تقدير الخسائر مبكرًا لدعم قرارات التسوية.",
      ],
    },
    {
      slug: "corporate-compliance-2026",
      title: "الامتثال التجاري في 2026: أهم التغييرات",
      desc: "كيف تؤثر التحديثات التنظيمية على العقود والحوكمة.",
      tag: "امتثال",
      date: "2026-01-20",
      readTime: "5 دقائق قراءة",
      image: "/images/News/N02.jpg",
      body: "معايير الإفصاح الجديدة تفرض مسارات اعتماد أوضح ومراقبة أدق للوثائق. تحديث الحوكمة الداخلية يقلل المخاطر النظامية.",
      bullets: [
        "تحديث صلاحيات التوقيع وحدود التفويض.",
        "تجميع أدلة الامتثال مع موافقات أصحاب المصلحة.",
        "مراجعة بنود الموردين وفق متطلبات الإفصاح.",
      ],
    },
    {
      slug: "international-trade-disputes",
      title: "حل نزاعات التجارة الدولية",
      desc: "خطوات عملية لإدارة المخاطر وتسريع التسويات.",
      tag: "تحكيم",
      date: "2026-01-05",
      readTime: "6 دقائق قراءة",
      image: "/images/News/N03.jpg",
      body: "التقييم المبكر للنزاع يرفع فرص التسوية ويخفض التكاليف. خريطة أدلة واضحة مع تحليل الاختصاص يسرّع الحل.",
      bullets: [
        "تحديد القانون الحاكم والاختصاص وخيارات التدابير المؤقتة.",
        "حفظ المستندات ومسارات الدفع بسرعة.",
        "تحديد حدود التسوية قبل التصعيد.",
      ],
    },
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
          <NewsHero isRTL title="مقالات وتحديثات قانونية" subtitle="ملخصات تنفيذية للقيادات القانونية والبحرية." kicker="المقالات" overlay="medium" />
        </div>
        <Reveal>
          <NewsPageContent
            posts={posts}
            locale="ar"
            title="معرفة قانونية وتحديثات"
            subtitle="ابقَ على اطلاع بتحليلات الخبراء في القانون البحري والامتثال وأفضل الممارسات."
            detailsEmptyLabel="اختر مقالًا لعرض التفاصيل هنا."
            isRTL
          />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
