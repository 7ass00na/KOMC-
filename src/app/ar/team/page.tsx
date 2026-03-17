import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  alternates: {
    canonical: "/ar/team",
    languages: { en: "/en/team", ar: "/ar/team" },
  },
};

export default function Page() {
  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
        <section className="section mx-auto max-w-7xl px-5 py-20">
          <h1 className="text-4xl font-bold text-[var(--brand-accent)]">فريقنا القانوني</h1>
          <p className="mt-4 text-zinc-300">ملفات الشركاء والمحامين.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
