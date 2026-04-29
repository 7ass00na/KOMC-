"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useResponsiveFloatingVisibility } from "@/hooks/useResponsiveFloatingVisibility";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function AIChatFab() {
  const { lang } = useLanguage();
  const visible = useResponsiveFloatingVisibility();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sizeMode, setSizeMode] = useState<"min" | "default" | "lg" | "max">("default");
  const [dimmed, setDimmed] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
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
  const loadedFromSession = useRef(false);
  const [draft, setDraft] = useState("");
  const reduce = useReducedMotion();
  const sideClass = lang === "ar" ? "left-6" : "right-5";
  const listRef = useRef<HTMLDivElement | null>(null);
  const [consent, setConsent] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("komc_ai_consent") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Load persisted chat history once per session
    if (!loadedFromSession.current) {
      try {
        const k = `komc_chat_session_${lang}`;
        const raw = sessionStorage.getItem(k);
        if (raw) {
          const arr = JSON.parse(raw) as ChatMessage[];
          if (Array.isArray(arr) && arr.length > 0) setMessages(arr);
        }
      } catch {}
      loadedFromSession.current = true;
    }
  }, [lang]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
    try {
      const k = `komc_chat_session_${lang}`;
      sessionStorage.setItem(k, JSON.stringify(messages));
    } catch {}
  }, [messages, open, lang]);

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

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
    if (!consent || busy) return;
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      setBusy(true);
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const res = await fetch("/api/legal-chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, messages: next.slice(-10) }),
      });
      if (!res.body) {
        const fallback =
          lang === "ar"
            ? "تعذر توليد الرد الآن. يرجى المحاولة لاحقًا أو استخدام واتساب للتواصل الفوري."
            : "Unable to stream a reply right now. Please try again or use WhatsApp for immediate help.";
        setMessages((m) => {
          const arr = [...m];
          arr[arr.length - 1] = { role: "assistant", content: fallback };
          return arr;
        });
      } else {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((m) => {
            const arr = [...m];
            arr[arr.length - 1] = { role: "assistant", content: acc };
            return arr;
          });
        }
      }
      try {
        const auditPayload = {
          event: "chat_exchange",
          lang,
          ts: Date.now(),
        };
        fetch("/api/analytics/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(auditPayload),
        }).catch(() => {});
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
      setBusy(false);
    }
  };

  const clearHistory = () => {
    try {
      const k = `komc_chat_session_${lang}`;
      sessionStorage.removeItem(k);
    } catch {}
    setMessages([
      {
        role: "assistant",
        content:
          lang === "ar"
            ? "مرحبًا بك! أنا مساعد الاستشارات القانونية الذكي الخاص بـ KOMC. اكتب سؤالك بخصوص القوانين والإجراءات في دولة الإمارات، وسأساعدك بخطوات عملية. هذا ليس بديلاً عن المشورة القانونية الرسمية."
            : "Welcome! I’m KOMC’s AI legal assistant for UAE law. Ask about procedures, requirements, or consultations and I’ll guide you. This is not a substitute for formal legal advice.",
      },
    ]);
    setClearOpen(false);
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
            className={`fixed bottom-21 md:bottom-36 ${sideClass} z-[55] grid place-items-center h-16 w-16 md:h-20 md:w-20 active:translate-y-[1px]`}
          >
            {reduce ? (
              <img
                src="/AI_Chat.png"
                alt=""
                className="h-16 w-16 md:h-20 md:w-20 object-contain"
                decoding="async"
                style={{ imageRendering: "auto" }}
              />
            ) : (
              <motion.img
                src="/AI_Chat.png"
                alt=""
                className="h-16 w-16 md:h-20 md:w-20 object-contain"
                animate={{ y: [0, -6, 0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 4, ease: "easeOut" }}
                decoding="async"
                style={{ imageRendering: "auto" }}
              />
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
            {open ? (
              <div
                role="button"
                tabIndex={0}
                aria-label={lang === "ar" ? "إغلاق المحادثة" : "Close chat"}
                className="absolute inset-0 pointer-events-auto"
                onClick={() => {
                  setOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
                    e.preventDefault();
                    setOpen(false);
                  }
                }}
                onTouchStart={() => setOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="absolute inset-0 bg-black"
                />
              </div>
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
                    className="h-8 w-8 rounded hover:bg-black/10 grid place-items-center text-[var(--ink-primary)]"
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
              {!consent ? (
                <div className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel-muted-bg)] p-3 text-xs text-[var(--ink-primary)]">
                  <div className="font-semibold mb-1">
                    {lang === "ar" ? "الموافقة مطلوبة" : "Consent Required"}
                  </div>
                  <div className="opacity-90">
                    {lang === "ar"
                      ? "الردود لأغراض إرشادية وليست نصيحة قانونية. بالمتابعة، فإنك توافق على معالجة البيانات وفق قوانين حماية البيانات في الإمارات وسياسة الخصوصية."
                      : "Responses are informational and not legal advice. By continuing, you consent to processing under UAE data protection law and our privacy policy."}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        try { sessionStorage.setItem("komc_ai_consent", "1"); } catch {}
                        setConsent(true);
                      }}
                      className="rounded-md bg-[var(--brand-accent)] text-black text-xs font-semibold px-3 py-1.5"
                    >
                      {lang === "ar" ? "أوافق" : "I Consent"}
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="rounded-md border border-[var(--panel-border)] text-xs px-3 py-1.5"
                    >
                      {lang === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                  </div>
                </div>
              ) : null}
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
                    disabled={loading || busy || !consent}
                    className="h-10 rounded-lg px-3 text-sm font-semibold bg-[var(--brand-accent)] text-black disabled:opacity-70"
                  >
                    {lang === "ar" ? "إرسال" : "Send"}
                  </button>
                  <button
                    onClick={() => setClearOpen(true)}
                    className="h-10 rounded-lg px-3 text-sm font-semibold border border-[var(--panel-border)]"
                    aria-label={lang === "ar" ? "مسح المحادثة" : "Clear chat"}
                  >
                    {lang === "ar" ? "مسح" : "Clear"}
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
              {clearOpen ? (
                <div className="fixed inset-0 z-[80]" aria-hidden={false}>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={lang === "ar" ? "إغلاق" : "Close"}
                    className="absolute inset-0 bg-black/55"
                    onClick={() => setClearOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setClearOpen(false);
                      }
                    }}
                  />
                  <div className="absolute inset-0 grid place-items-center px-4">
                    <div
                      role="dialog"
                      aria-modal="true"
                      aria-label={lang === "ar" ? "تأكيد مسح المحادثة" : "Confirm Clear Chat"}
                      className="w-[min(92vw,420px)] rounded-2xl border border-zinc-700/40 bg-[var(--panel-bg)] shadow-2xl"
                    >
                      <div className="relative p-4 border-b border-zinc-700/40">
                        <div className="text-sm font-semibold text-[var(--ink-primary)]">
                          {lang === "ar" ? "تأكيد" : "Confirmation"}
                        </div>
                        <button
                          aria-label={lang === "ar" ? "إغلاق" : "Close"}
                          className="absolute top-3 right-3 h-8 w-8 rounded hover:bg-black/10 grid place-items-center"
                          onClick={() => setClearOpen(false)}
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                            <path fill="currentColor" d="M6 6l12 12M18 6L6 18" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4 text-sm text-[var(--ink-primary)]">
                        {lang === "ar" ? "سيؤدي هذا إلى مسح المحادثة الحالية. المتابعة؟" : "This will clear the current conversation. Proceed?"}
                      </div>
                      <div className="flex items-center justify-end gap-2 p-4 border-t border-zinc-700/40">
                        <button
                          className="rounded-lg border border-[var(--panel-border)] px-3 py-2 text-sm"
                          onClick={() => setClearOpen(false)}
                        >
                          {lang === "ar" ? "إلغاء" : "Cancel"}
                        </button>
                        <button
                          className="rounded-lg bg-[var(--brand-accent)] text-black px-3 py-2 text-sm font-semibold"
                          onClick={clearHistory}
                          autoFocus
                        >
                          {lang === "ar" ? "تأكيد" : "Confirm"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
