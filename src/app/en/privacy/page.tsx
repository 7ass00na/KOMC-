import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  alternates: {
    canonical: "/en/privacy",
    languages: { en: "/en/privacy", ar: "/ar/privacy" },
  },
};

export default function Page() {
  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
        <section className="section mx-auto max-w-4xl px-5 py-20">
          <h1 className="text-4xl font-bold text-[var(--brand-accent)]">Privacy Policy</h1>
          <div className="mt-4 text-zinc-300">
            We collect contact details solely to respond to your inquiry. We do not sell personal data. You may request deletion at any time. Cookies may be used for analytics and performance. By submitting the contact form, you consent to processing for the purpose of handling your request.
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
