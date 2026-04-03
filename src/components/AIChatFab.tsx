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
  const [sizeMode, setSizeMode] = useState<"min" | "default" | "lg" | "max">("default");
  const [dimmed, setDimmed] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
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

  useEffect(() => {
    function onCloseAll() {
      setDimmed(false);
      setSizeMode("default");
      setOpen(false);
      setDragging(false);
      setPos(null);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("chat-close-all" as any, onCloseAll as any);
      return () => window.removeEventListener("chat-close-all" as any, onCloseAll as any);
    }
  }, []);

  const closeAllChats = () => {
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("chat-close-all"));
      }
    } catch {}
    setDimmed(false);
    setSizeMode("default");
    setOpen(false);
    setDragging(false);
    setPos(null);
  };

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const left = Math.max(8, dragStart.current.left + dx);
      const top = Math.max(8, dragStart.current.top + dy);
      setPos({ left, top });
    }
    function onUp() {
      dragStart.current = null;
      setDragging(false);
    }
    if (dragging) {
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
    }
  }, [dragging]);

  const beginDrag = (clientX: number, clientY: number) => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragStart.current = { x: clientX, y: clientY, left: rect.left, top: rect.top };
    setDragging(true);
    if (!pos) setPos({ left: rect.left, top: rect.top });
  };

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
            className={`fixed bottom-24 md:bottom-40 ${sideClass} z-50 grid place-items-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-[var(--brand-accent)] text-black shadow-lg active:translate-y-[1px]`}
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
            className="fixed inset-0 z-[60] pointer-events-none"
          >
            {open && sizeMode !== "max" ? (
              <div
                role="button"
                tabIndex={0}
                aria-label={lang === "ar" ? "تصغير المحادثة" : "Minimize chat"}
                className="absolute inset-0 bg-transparent pointer-events-auto"
                onClick={() => {
                  setDimmed(true);
                  setSizeMode("min");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDimmed(true);
                    setSizeMode("min");
                  }
                }}
              />
            ) : null}
            {sizeMode === "max" ? (
              <div
                role="button"
                tabIndex={0}
                aria-label={lang === "ar" ? "إغلاق المحادثة" : "Close chat"}
                className="absolute inset-0 bg-black/55 pointer-events-auto"
                onClick={closeAllChats}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
                    e.preventDefault();
                    closeAllChats();
                  }
                }}
              />
            ) : null}
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className={[
                "pointer-events-auto fixed",
                pos ? "inset-auto" : lang === "ar" ? "left-6" : "right-6",
                "z-[70] rounded-2xl border border-zinc-700/40 bg-[var(--panel-bg)] shadow-2xl overflow-hidden",
                sizeMode === "min" && !pos ? "bottom-28 md:bottom-44 w-[min(86vw,320px)]" : "",
                sizeMode === "default" && !pos ? "bottom-28 md:bottom-44 w-[min(92vw,420px)]" : "",
                sizeMode === "lg" && !pos ? "bottom-24 md:bottom-40 w-[min(96vw,560px)]" : "",
                sizeMode === "max" && !pos ? "inset-3 md:inset-6 w-auto h-auto" : "",
              ].join(" ")}
              style={pos ? { left: pos.left, top: pos.top, width: sizeMode === "min" ? 320 : sizeMode === "lg" ? 560 : sizeMode === "max" ? undefined : 420 } : undefined}
            >
              <div
                className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b border-zinc-700/40 select-none bg-[var(--panel-bg)] cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => {
                  if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
                  beginDrag(e.clientX, e.clientY);
                }}
                onDoubleClick={() => setSizeMode((m) => (m === "max" ? "default" : "max"))}
                onKeyDown={(e) => {
                  if (!panelRef.current) return;
                  const step = 16;
                  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home"].includes(e.key)) {
                    e.preventDefault();
                    const rect = panelRef.current.getBoundingClientRect();
                    let left = rect.left;
                    let top = rect.top;
                    if (!pos) setPos({ left, top });
                    if (e.key === "ArrowUp") top -= step;
                    if (e.key === "ArrowDown") top += step;
                    if (e.key === "ArrowLeft") left -= step;
                    if (e.key === "ArrowRight") left += step;
                    if (e.key === "Home") setPos(null);
                    else setPos({ left: Math.max(8, left), top: Math.max(8, top) });
                  }
                }}
                tabIndex={0}
                aria-label={lang === "ar" ? "سحب لتحريك النافذة" : "Drag to move window"}
              >
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
                <div className="inline-flex items-center gap-1.5">
                  <button
                    data-no-drag
                    onClick={() => {
                      if (dimmed) {
                        setDimmed(false);
                        setSizeMode("default");
                      } else {
                        setDimmed(true);
                        setSizeMode("min");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (dimmed) {
                          setDimmed(false);
                          setSizeMode("default");
                        } else {
                          setDimmed(true);
                          setSizeMode("min");
                        }
                      }
                    }}
                    aria-label={lang === "ar" ? "تصغير" : "Minimize"}
                    className="h-8 w-8 rounded hover:bg-black/10 grid place-items-center text-[var(--brand-accent)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                      <path fill="currentColor" d="M5 12h14v2H5z" />
                    </svg>
                  </button>
                  <button
                    data-no-drag
                    onClick={() =>
                      setSizeMode((m) => (m === "min" ? "default" : m === "default" ? "lg" : "min"))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSizeMode((m) => (m === "min" ? "default" : m === "default" ? "lg" : "min"));
                      }
                    }}
                    aria-label={lang === "ar" ? "تغيير الحجم" : "Resize"}
                    className="h-8 w-8 rounded hover:bg-black/10 grid place-items-center text-[var(--brand-accent)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                      <path fill="currentColor" d="M4 14h2v6H4a2 2 0 0 1-2-2v-2h2v-2Zm16 0h2v2a2 2 0 0 1-2 2h-2v-6h2v2ZM4 4h6v2H6v2H4V4Zm14 0a2 2 0 0 1 2 2v2h-6V6h2V4h2Z" />
                    </svg>
                  </button>
                  <button
                    data-no-drag
                    onClick={() => setSizeMode((m) => (m === "max" ? "default" : "max"))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSizeMode((m) => (m === "max" ? "default" : "max"));
                      }
                    }}
                    aria-label={lang === "ar" ? "ملء الشاشة" : "Fullscreen"}
                    className="h-8 w-8 rounded hover:bg-black/10 grid place-items-center text-[var(--brand-accent)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                      <path fill="currentColor" d="M4 4h6v2H6v4H4V4Zm10 0h6v6h-2V6h-4V4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4Z" />
                    </svg>
                  </button>
                  <button
                    data-no-drag
                    onClick={() => setOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpen(false);
                      }
                    }}
                    aria-label={lang === "ar" ? "إغلاق" : "Close"}
                    className="h-8 w-8 rounded hover:bg-black/10 grid place-items-center text-[var(--brand-accent)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                      <path fill="currentColor" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                ref={listRef}
                className={[
                  "overflow-y-auto px-4 py-3 space-y-3",
                  sizeMode === "max" ? "max-h-[calc(100vh-10rem)]" : "max-h-[60vh]",
                ].join(" ")}
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
              {dimmed ? (
                <div className="pointer-events-none absolute inset-0 bg-black/15" aria-hidden="true" />
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

