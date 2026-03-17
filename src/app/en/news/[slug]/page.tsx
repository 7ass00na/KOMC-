import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

export const metadata = {
  alternates: {
    canonical: "/en/news",
    languages: { en: "/en/news", ar: "/ar/news" },
  },
};

const posts: Record<string, { title: string; body: string }> = {
  "marpol-enforcement-trends": {
    title: "MARPOL Enforcement Trends",
    body: "Port State Control activity continues to rise. Align procedures, recordkeeping, and incident response to reduce exposure.",
  },
  "charterparty-risk-controls": {
    title: "Charterparty Risk Controls",
    body: "Drafting performance, off-hire, and liquidated damages clauses mitigates disputes and improves operational certainty.",
  },
  "vessel-arrest-essentials": {
    title: "Vessel Arrest Essentials",
    body: "Security, jurisdiction, and swift applications drive outcomes. Prepare facts and documents ahead of crisis.",
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
