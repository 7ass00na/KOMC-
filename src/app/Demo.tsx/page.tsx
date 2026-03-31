import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import DemoSlider from "./DemoSlider";
import Slider02 from "./Slider02";
import Reveal from "@/components/Reveal";
import IntroPreview from "@/components/IntroPreview";
import VideoPlayerDemo from "@/components/VideoPlayerDemo";
import ZipPackGenerator from "@/components/ZipPackGenerator";

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
        <section className="section mx-auto max-w-7xl px-5 py-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]">Intro Video Preview</h2>
          <p className="mt-2 text-zinc-300">15s cinematic cut • Click Next or wait for auto progression.</p>
          <div className="mt-6">
            <IntroPreview />
          </div>
        </section>
        <section className="section mx-auto max-w-7xl px-5 py-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]">Intro Video (Final Render)</h2>
          <p className="mt-2 text-zinc-300">Place komc-intro.mp4 under /public/videos and reload this page to view the 4K cut.</p>
          <div className="mt-4">
            <a
              href="/Website%20AI%20Intro%20Vedio.txt"
              download
              className="inline-flex items-center rounded-lg bg-[var(--brand-accent)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
              Download AI Intro Prompt (TXT)
            </a>
          </div>
          <div className="mt-6">
            <VideoPlayerDemo src="/videos/komc.mp4" />
          </div>
          <div className="mt-6">
            <ZipPackGenerator />
          </div>
        </section>
        <Reveal>
          <section>
            <Hero />
          </section>
        </Reveal>

        <Reveal>
          <section className="section mx-auto mt-10 max-w-7xl px-5 py-10">
            <DemoSlider />
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-10">
            <Slider02 />
          </section>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
