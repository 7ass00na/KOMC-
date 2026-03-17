import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import DemoSlider from "./DemoSlider";
import Slider02 from "./Slider02";

export const metadata = {
  title: "Demo | KOMC",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
        <section>
          <Hero />
        </section>

        <section className="section mx-auto mt-10 max-w-7xl px-5 py-10">
          <DemoSlider />
        </section>

        <section className="mt-10">
          <Slider02 />
        </section>
      </main>
      <Footer />
    </div>
  );
}
