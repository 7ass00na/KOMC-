import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

export const metadata = {
  alternates: {
    canonical: "/ar/news",
    languages: { en: "/en/news", ar: "/ar/news" },
  },
};

const posts: Record<string, { title: string; body: string }> = {
  "marpol-enforcement-trends": {
    title: "اتجاهات إنفاذ MARPOL",
    body: "يزداد نشاط رقابة الدول على الموانئ. ضبط الإجراءات وحفظ السجلات والاستجابة للحوادث يقلل التعرض للمساءلة.",
  },
  "charterparty-risk-controls": {
    title: "ضبط مخاطر عقود الإيجار",
    body: "صياغة بنود الأداء وخارج الخدمة والتعويضات المحددة تخفف النزاعات وتحسن اليقين التشغيلي.",
  },
  "vessel-arrest-essentials": {
    title: "أساسيات حجز السفن",
    body: "الضمان والاختصاص والإجراءات السريعة تقود النتائج. جهز الحقائق والمستندات قبل الأزمات.",
  },
};

export default function Page({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) return notFound();
  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
        <article className="section mx-auto max-w-4xl px-5 py-20">
          <h1 className="text-4xl font-bold text-[var(--brand-accent)]">{post.title}</h1>
          <div className="prose prose-invert mt-6">{post.body}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
