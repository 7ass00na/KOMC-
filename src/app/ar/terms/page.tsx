import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata = {
  alternates: {
    canonical: "/ar/terms",
    languages: { en: "/en/terms", ar: "/ar/terms" },
  },
};

export default function Page() {
  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
        <Reveal>
          <section className="section mx-auto max-w-4xl px-5 py-20">
            <h1 className="text-4xl font-bold text-[var(--brand-accent)]">شروط الخدمة</h1>
            <div className="mt-4 text-zinc-300">
              المعلومات في هذا الموقع عامة ولا تُعد نصيحة قانونية. تتطلب التعاقدات اتفاقًا مكتوبًا. نحد المسؤولية إلى أقصى حد يسمح به القانون. باستخدام هذا الموقع، فإنك توافق على هذه الشروط.
            </div>
          </section>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
