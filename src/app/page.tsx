import IntroOverlay from "@/components/IntroOverlay";

export default function Home() {
  return (
    <div className="min-h-screen hero-bg home site-content">
      <IntroOverlay />
      <noscript>
        <main className="mx-auto max-w-2xl px-5 py-16">
          <h1 className="text-3xl font-extrabold text-[var(--ink-primary)]">KOMC</h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            Please choose your language to continue.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a className="rounded-lg bg-[var(--brand-accent)] text-[var(--brand-primary)] px-5 py-3 font-semibold" href="/ar/home">العربية</a>
            <a className="rounded-lg ring-1 ring-[var(--panel-border)] px-5 py-3 font-semibold" href="/en/home">English</a>
          </div>
        </main>
      </noscript>
    </div>
  );
}
