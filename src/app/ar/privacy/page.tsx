import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata = {
  alternates: {
    canonical: "/ar/privacy",
    languages: { en: "/en/privacy", ar: "/ar/privacy" },
  },
};

export default function Page() {
  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
        <Reveal>
          <section className="section mx-auto max-w-4xl px-5 py-20">
            <h1 className="text-4xl font-bold text-[var(--brand-accent)]">سياسة الخصوصية</h1>
            <div className="mt-4 text-zinc-300">
              نجمع بيانات التواصل فقط للرد على استفسارك. لا نبيع البيانات الشخصية. يمكنك طلب الحذف في أي وقت. قد تُستخدم ملفات تعريف الارتباط للتحليلات والأداء. بإرسال نموذج التواصل، فإنك توافق على معالجة بياناتك لغرض التعامل مع طلبك.
            </div>
          </section>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
