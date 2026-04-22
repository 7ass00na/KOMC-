import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { readEntity } from "@/lib/store";

export const metadata = {
  alternates: {
    canonical: "/ar/privacy",
    languages: { en: "/en/privacy", ar: "/ar/privacy" },
  },
};

export default async function Page() {
  const legal = await readEntity("legal", { privacy_ar_html: "" });
  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
        <Reveal>
          <section className="section mx-auto max-w-4xl px-5 py-20">
            <div
              className="space-y-4 text-zinc-300 [&_h3]:text-4xl [&_h3]:font-bold [&_h3]:text-[var(--brand-accent)] [&_h4]:mt-6 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-[var(--brand-accent)] [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pr-5 [&_p]:leading-8 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pr-5"
              dangerouslySetInnerHTML={{ __html: legal.privacy_ar_html || "" }}
            />
          </section>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
