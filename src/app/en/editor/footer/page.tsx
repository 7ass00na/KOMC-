import EditorShell from "@/components/editor/EditorShell";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <EditorShell pageId="footer" lang="en">
      <div className="min-h-screen hero-bg">
        <Header />
        <main className="pt-[80px] md:pt-[96px] lg:pt-[112px]">
          <section className="section mx-auto max-w-7xl px-5 py-10">
            <div className="text-sm text-white/70">Footer Editor</div>
            <div className="mt-2 text-xs text-white/50">Hover elements in the footer to edit.</div>
          </section>
        </main>
        <Footer />
      </div>
    </EditorShell>
  );
}
