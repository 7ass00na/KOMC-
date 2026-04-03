"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function AIChatFab() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        lang === "ar"
          ? "مرحبًا بك! أنا مساعد الاستشارات القانونية الذكي الخاص بـ KOMC. اكتب سؤالك بخصوص القوانين والإجراءات في دولة الإمارات، وسأساعدك بخطوات عملية. هذا ليس بديلاً عن المشورة القانونية الرسمية."
          : "Welcome! I’m KOMC’s AI legal assistant for UAE law. Ask about procedures, requirements, or consultations and I’ll guide you. This is not a substitute for formal legal advice.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const reduce = useReducedMotion();
  const sideClass = lang === "ar" ? "left-6" : "right-6";
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 160);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/legal-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, messages: next.slice(-10) }),
      });
      const data = await res.json().catch(() => ({}));
      const reply =
        data?.reply ||
        (lang === "ar"
          ? "شكرًا على سؤالك. سأطلعك على المتطلبات والخطوات المبدئية وفقًا للوائح الإماراتية. للمضي قدمًا، يمكنك حجز استشارة تفصيلية."
          : "Thanks for your question. I’ll outline preliminary UAE requirements and steps. To proceed further, please book a detailed consultation.");
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      try {
        fetch("/api/analytics/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "message", lang }),
        }).catch(() => {});
      } catch {}
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            lang === "ar"
              ? "حدث انقطاع مؤقت في الخدمة. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب لحجز استشارة."
              : "Temporary service interruption. Please try again or use WhatsApp to schedule a consultation.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.button
            key="ai-fab"
            onClick={() => setOpen(true)}
            aria-label={lang === "ar" ? "مساعد الاستشارات" : "AI Legal Assistant"}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={`fixed bottom-28 md:bottom-40 ${sideClass} z-50 grid place-items-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-[var(--brand-accent)] text-black shadow-lg active:translate-y-[1px]`}
          >
            {reduce ? (
              <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                <path fill="currentColor" d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 1-1Zm3 4h10v2H7V8Zm0 4h7v2H7v-2Z" />
              </svg>
            ) : (
              <motion.div
                animate={{ y: [0, -6, 0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 4, ease: "easeOut" }}
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                  <path fill="currentColor" d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 1-1Zm3 4h10v2H7V8Zm0 4h7v2H7v-2Z" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="ai-modal"
            role="dialog"
            aria-modal="true"
            aria-label={lang === "ar" ? "محادثة الاستشارة القانونية" : "Legal Consultation Chat"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className={`fixed ${lang === "ar" ? "left-6" : "right-6"} bottom-28 md:bottom-44 z-[70] w-[min(92vw,420px)] rounded-2xl border border-zinc-700/40 bg-[var(--panel-bg)] shadow-2xl overflow-hidden`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/40">
                <div className="inline-flex items-center gap-2">
                  <div className="h-7 w-7 rounded bg-[var(--brand-accent)] grid place-items-center">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path fill="currentColor" d="M4 4h16v10H8l-4 4V4z" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold text-[var(--ink-primary)]">
                    {lang === "ar" ? "مساعد الاستشارات القانونية" : "AI Legal Assistant"}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={lang === "ar" ? "إغلاق" : "Close"}
                  className="h-8 w-8 rounded hover:bg-black/10 grid place-items-center"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                    <path fill="currentColor" d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div
                ref={listRef}
                className="max-h-[60vh] overflow-y-auto px-4 py-3 space-y-3"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={
                      "text-sm leading-6 " +
                      (m.role === "assistant"
                        ? "bg-[var(--panel-muted-bg)] border border-[var(--panel-border)] rounded-xl px-3 py-2 text-[var(--ink-primary)]"
                        : "ms-auto max-w-[84%] bg-[var(--brand-accent)] text-black rounded-xl px-3 py-2")
                    }
                    style={m.role === "user" ? { maxWidth: "84%" } : undefined}
                  >
                    <span dir={lang === "ar" ? "rtl" : "ltr"}>{m.content}</span>
                  </div>
                ))}
                {loading ? (
                  <div className="text-xs text-zinc-500 px-3">{lang === "ar" ? "جارٍ المعالجة..." : "Thinking..."}</div>
                ) : null}
              </div>
              <div className="border-t border-zinc-700/40 p-3">
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    aria-label={lang === "ar" ? "اكتب رسالتك" : "Type your message"}
                    className="flex-1 h-10 rounded-lg px-3 text-sm bg-[var(--panel-bg)] border border-[var(--panel-border)]"
                    placeholder={lang === "ar" ? "اكتب سؤالك هنا..." : "Ask your question here..."}
                  />
                  <button
                    onClick={send}
                    disabled={loading}
                    className="h-10 rounded-lg px-3 text-sm font-semibold bg-[var(--brand-accent)] text-black disabled:opacity-70"
                  >
                    {lang === "ar" ? "إرسال" : "Send"}
                  </button>
                </div>
                <div className="mt-2 text-[10px] text-zinc-500">
                  {lang === "ar"
                    ? "تنبيه: هذه الإجابات لأغراض إرشادية عامة وليست نصيحة قانونية. بالمتابعة، فإنك توافق على شروط الخصوصية."
                    : "Notice: Guidance only, not legal advice. By continuing you agree to our privacy terms."}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

