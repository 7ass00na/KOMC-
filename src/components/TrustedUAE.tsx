'use client';
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const citiesEn = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "RAK", "Fujairah", "UAQ"];
const citiesAr = ["دبي", "أبوظبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين"];
const sectorsEn = ["Shipowners", "Insurers", "P&I", "Logistics", "Traders", "Port Ops"];
const sectorsAr = ["مالكو السفن", "التأمين", "نوادي الحماية", "اللوجستيات", "التجار", "تشغيل الموانئ"];

export default function TrustedUAE() {
  const { lang } = useLanguage();
  const cities = lang === "ar" ? citiesAr : citiesEn;
  const sectors = lang === "ar" ? sectorsAr : sectorsEn;
  const testimonials =
    lang === "ar"
      ? [
          { city: "دبي", text: "استجابة فورية ونصائح واضحة في مسألة بحرية.", initials: "GC", role: "شركة شحن" },
          { city: "أبوظبي", text: "تسوية عادلة بفضل تحليل التغطية التأمينية.", initials: "CL", role: "شركة تأمين" },
          { city: "الشارقة", text: "التزام تنظيمي أفضل وتقليل المخاطر.", initials: "OM", role: "تشغيل موانئ" },
          { city: "عجمان", text: "صياغة عقود محكمة منعت نزاعاً مكلفاً.", initials: "LA", role: "مزود لوجستي" },
          { city: "رأس الخيمة", text: "تنفيذ سريع لحجز سفينة وتأمين ضمان.", initials: "CO", role: "مالك سفينة" },
          { city: "الفجيرة", text: "تواصل احترافي وخطة تنفيذ دقيقة.", initials: "PM", role: "مدير مشاريع" },
          { city: "أم القيوين", text: "إرشاد عملي وسريع في نزاع تجاري.", initials: "BD", role: "تاجر سلع" },
        ]
      : [
          { city: "Dubai", text: "Immediate response and clear guidance on a maritime matter.", initials: "GC", role: "Shipping Co." },
          { city: "Abu Dhabi", text: "Fair settlement achieved through coverage analysis.", initials: "CL", role: "Insurer" },
          { city: "Sharjah", text: "Improved compliance and reduced exposure.", initials: "OM", role: "Port Ops" },
          { city: "Ajman", text: "Tight contract drafting prevented a costly dispute.", initials: "LA", role: "Logistics" },
          { city: "RAK", text: "Swift vessel arrest with security secured.", initials: "CO", role: "Ship Owner" },
          { city: "Fujairah", text: "Professional communication and precise execution.", initials: "PM", role: "Project Lead" },
          { city: "UAQ", text: "Pragmatic advice resolved a trade issue fast.", initials: "BD", role: "Commodities" },
        ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, [testimonials.length]);
  return (
    <section id="trusted-uae" className="section-strong no-section-bg mx-auto max-w-7xl px-5 py-16 cards-ink">
      <div className="relative rounded-2xl surface p-6 md:p-8 overflow-hidden">
        <div className="pointer-events-none absolute -inset-24 -z-10 opacity-40">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] text-[11px] tracking-widest uppercase font-semibold" data-edit-key="uae-band-badge">
              {lang === "ar" ? "موثوق به من عملاء في جميع أنحاء الإمارات" : "Trusted by Clients Across the UAE"}
            </div>
            <p className="mt-2 text-sm text-zinc-300" data-edit-key="uae-band-subtitle">
              {lang === "ar"
                ? "من دبي إلى رأس الخيمة، ندعم المشغلين البحريين وشركات التأمين وسلاسل الإمداد."
                : "From Dubai to Ras Al Khaimah, supporting maritime operators, insurers and supply chains."}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 surface">
              <svg width="14" height="14" viewBox="0 0 24 24" className="text-yellow-400" aria-hidden="true"><path d="M12 17.3l-6.18 3.7 1.64-7.03L2 9.24l7.19-.62L12 2l2.81 6.62L22 9.24l-5.46 4.73 1.64 7.03z" fill="currentColor"/></svg>
              <span className="text-sm text-white font-semibold">4.9</span>
              <span className="text-[10px] text-zinc-300">{lang === "ar" ? "تقييم العملاء" : "Client rating"}</span>
            </div>
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden">
          <motion.div
            className="flex gap-3 whitespace-nowrap"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            aria-label={lang === "ar" ? "مدن الإمارات" : "UAE cities"}
          >
            {[...cities, ...cities].map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="px-3 py-1.5 rounded-lg chip text-xs text-zinc-300 shadow-sm"
              >
                {c}
              </span>
            ))}
          </motion.div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0A192F] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0A192F] to-transparent" />
        </div>

        <div className="mt-6">
          <div className="relative rounded-xl surface p-5 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1 bg-[var(--brand-accent)]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={`t-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <div className="text-xs text-zinc-400">{lang === "ar" ? "عميل في" : "Client in"} <span className="text-zinc-200 font-semibold" data-edit-key="uae-testimonial-city">{testimonials[idx].city}</span></div>
                <div className="mt-1 text-sm text-zinc-200 leading-relaxed" data-edit-key="uae-testimonial-text">
                  <span className="text-[var(--brand-accent)]">“</span>
                  {testimonials[idx].text}
                  <span className="text-[var(--brand-accent)]">”</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
                  <div className="h-7 w-7 rounded-full chip flex items-center justify-center text-[10px] text-zinc-300">
                    {testimonials[idx].initials}
                  </div>
                  <div data-edit-key="uae-testimonial-role">{testimonials[idx].role}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={`uae-dot-${i}`}
                aria-label={(lang === "ar" ? "تقييم " : "Testimonial ") + (i + 1)}
                onClick={() => setIdx(i)}
                className={`h-2.5 rounded-lg transition-all ${idx === i ? "w-6 bg-[var(--brand-accent)]" : "w-2.5 bg-zinc-400/40"}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-3">
            {sectors.map((s) => (
            <div
              key={s}
              className="flex items-center justify-center rounded-lg chip px-3 py-2 text-xs text-zinc-200 hover:opacity-90 transition-colors"
                data-edit-key={`uae-sector-${String(s).toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-")}`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
