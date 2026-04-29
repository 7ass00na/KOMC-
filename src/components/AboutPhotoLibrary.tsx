"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { getAnchoredLightboxPosition, isAnchoredLightboxViewport, type LightboxPoint } from "@/lib/lightboxPosition";

type MediaType = "photo" | "video";

type MediaItem = {
  id: string;
  type: MediaType;
  src: string;
  poster?: string;
  title_en?: string;
  title_ar?: string;
  alt_en?: string;
  alt_ar?: string;
  uploadedAt?: string;
};

type TabKey = "all" | "photos" | "videos";
type LightboxAnchor = LightboxPoint | null;

function parseTs(s?: string) {
  const t = Date.parse(s || "");
  return Number.isFinite(t) ? t : 0;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function formatSeconds(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AboutPhotoLibrary({ lang }: { lang: "ar" | "en" }) {
  const rtl = lang === "ar";
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<TabKey>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeAnchor, setActiveAnchor] = useState<LightboxAnchor>(null);
  const activeRef = useRef<string | null>(null);
  activeRef.current = activeId;
  const tabs: { key: TabKey; label: string }[] = useMemo(
    () => [
      { key: "all", label: rtl ? "الكل" : "All" },
      { key: "photos", label: rtl ? "الصور" : "Photos" },
      { key: "videos", label: rtl ? "الفيديوهات" : "Videos" },
    ],
    [rtl]
  );

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/photo-library", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as MediaItem[];
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(rtl ? "تعذر تحميل المكتبة. يرجى المحاولة مرة أخرى." : "Unable to load the library. Please try again.");
      setItems(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [rtl]);

  const sorted = useMemo(() => {
    const arr = Array.isArray(items) ? [...items] : [];
    arr.sort((a, b) => {
      const da = parseTs(a.uploadedAt);
      const db = parseTs(b.uploadedAt);
      return sort === "newest" ? db - da : da - db;
    });
    return arr;
  }, [items, sort]);

  const filtered = useMemo(() => {
    if (tab === "photos") return sorted.filter((x) => x.type === "photo");
    if (tab === "videos") return sorted.filter((x) => x.type === "video");
    return sorted;
  }, [sorted, tab]);

  const activeIndex = useMemo(() => {
    if (!activeId) return -1;
    return filtered.findIndex((x) => x.id === activeId);
  }, [filtered, activeId]);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (!activeRef.current) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setActiveId(null);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        if (filtered.length <= 1) return;
        e.preventDefault();
        const current = filtered.findIndex((x) => x.id === activeRef.current);
        if (current < 0) return;
        const step = e.key === "ArrowRight" ? 1 : -1;
        const next = (current + step + filtered.length) % filtered.length;
        setActiveId(filtered[next].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, filtered]);

  const onTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const count = tabs.length;
    const dir = rtl ? -1 : 1;
    const leftKey = rtl ? "ArrowRight" : "ArrowLeft";
    const rightKey = rtl ? "ArrowLeft" : "ArrowRight";
    let next = idx;
    if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else if (e.key === leftKey) next = (idx - dir + count) % count;
    else if (e.key === rightKey) next = (idx + dir + count) % count;
    setTab(tabs[next].key);
    const el = document.getElementById(`photo-lib-tab-${tabs[next].key}`);
    (el as HTMLButtonElement | null)?.focus();
  };

  return (
    <section className="section no-section-bg mx-auto max-w-7xl px-5 pb-20" dir={rtl ? "rtl" : "ltr"}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]">
            {rtl ? "مكتبة الصور" : "Photo Library"}
          </h2>
          <p className="mt-2 text-zinc-300 leading-7">
            {rtl
              ? "هنا نعرض بعض صورنا ومساهماتنا الخارجية وغيرها ضمن أرشيف مختصر."
              : "This is where we showcase some of our photos, external contributions, and more in a curated library."}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 flex-nowrap max-[768px]:gap-2">
        <div
          role="tablist"
          aria-label={rtl ? "تبويبات مكتبة الصور" : "Photo library tabs"}
          className="flex-1 min-w-0 max-w-full flex items-center gap-1 overflow-x-auto no-scrollbar rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-1"
        >
          {tabs.map((t, i) => {
            const selected = t.key === tab;
            return (
              <button
                key={t.key}
                id={`photo-lib-tab-${t.key}`}
                role="tab"
                aria-selected={selected}
                aria-controls={`photo-lib-panel-${t.key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(t.key)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={[
                  "min-h-[44px] px-4 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]",
                  selected ? "bg-[var(--brand-accent)] text-[var(--brand-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--panel-muted-bg)]",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
          <label className="text-xs font-semibold text-[var(--text-secondary)] max-[768px]:sr-only" htmlFor="photo-lib-sort">
            {rtl ? "الترتيب" : "Sort"}
          </label>
          <select
            id="photo-lib-sort"
            aria-label={rtl ? "الترتيب" : "Sort"}
            className="themed-select rounded-lg px-3 py-2 text-sm ring-1 ring-[var(--panel-border)] bg-[var(--panel-bg)] text-[var(--ink-primary)] max-[768px]:w-[140px]"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
          >
            <option value="newest">{rtl ? "الأحدث أولاً" : "Newest first"}</option>
            <option value="oldest">{rtl ? "الأقدم أولاً" : "Oldest first"}</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab + ":" + sort + ":" + (loading ? "loading" : "ready")}
          id={`photo-lib-panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`photo-lib-tab-${tab}`}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mt-6"
        >
          {error ? (
            <div className="rounded-2xl surface p-6 md:p-8">
              <div className="text-[var(--text-secondary)]">{error}</div>
              <button
                type="button"
                onClick={fetchItems}
                className="mt-4 min-h-[44px] rounded-lg px-5 py-3 bg-[var(--brand-accent)] text-[var(--brand-primary)] font-semibold hover:opacity-90"
              >
                {rtl ? "إعادة المحاولة" : "Retry"}
              </button>
            </div>
          ) : loading || items === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden ring-1 ring-[var(--panel-border)] bg-white/5">
                  <div className="aspect-[4/3] animate-pulse bg-white/10" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl surface p-6 md:p-8 text-[var(--text-secondary)]">
              {rtl ? "لا توجد عناصر لعرضها ضمن هذا التبويب." : "No items available for this tab."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((m) => (
                <MediaCard
                  key={m.id}
                  item={m}
                  lang={lang}
                  active={activeId === m.id}
                  onOpen={(anchor) => {
                    setActiveAnchor(anchor);
                    setActiveId(m.id);
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {activeId && activeIndex >= 0 ? (
          <MediaModal
            key={activeId}
            item={filtered[activeIndex]}
            lang={lang}
            canNavigate={filtered.length > 1}
            anchor={activeAnchor}
            onClose={() => {
              setActiveId(null);
              setActiveAnchor(null);
            }}
            onPrev={() => setActiveId(filtered[(activeIndex - 1 + filtered.length) % filtered.length].id)}
            onNext={() => setActiveId(filtered[(activeIndex + 1) % filtered.length].id)}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function MediaCard({
  item,
  lang,
  onOpen,
  active,
}: {
  item: MediaItem;
  lang: "ar" | "en";
  onOpen: (anchor: LightboxAnchor) => void;
  active: boolean;
}) {
  const rtl = lang === "ar";
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const alt = rtl ? item.alt_ar || "" : item.alt_en || "";
  const pointerAnchor = useRef<LightboxAnchor>(null);

  const rememberAnchor = (x: number, y: number) => {
    pointerAnchor.current = { x, y };
  };

  const openFromInteraction = (target: HTMLButtonElement) => {
    if (pointerAnchor.current) {
      onOpen(pointerAnchor.current);
      return;
    }

    const rect = target.getBoundingClientRect();
    onOpen({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  return (
    <button
      type="button"
      onPointerDown={(e) => rememberAnchor(e.clientX, e.clientY)}
      onPointerUp={(e) => rememberAnchor(e.clientX, e.clientY)}
      onClick={(e) => openFromInteraction(e.currentTarget)}
      style={active ? { zIndex: 30 } : undefined}
      className="group relative w-full text-left rounded-xl overflow-hidden ring-1 ring-[var(--panel-border)] bg-[var(--panel-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
      aria-label={rtl ? "فتح الوسائط" : "Open media"}
    >
      <motion.div layoutId={reduce ? undefined : `photo-lib-media-${item.id}`} className="relative aspect-[4/3]">
        {!loaded ? <div className="absolute inset-0 animate-pulse bg-white/10" /> : null}
        {failed ? (
          <div className="absolute inset-0 grid place-items-center text-sm text-[var(--text-secondary)] px-4">
            {rtl ? "تعذر تحميل الوسائط" : "Failed to load"}
          </div>
        ) : item.type === "photo" ? (
          <Image
            src={item.src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"
            loading="lazy"
            onLoadingComplete={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        ) : (
          <>
            <Image
              src={item.poster || "/images/about-hero-poster.jpg"}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"
              loading="lazy"
              onLoadingComplete={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-14 w-14 rounded-full bg-black/40 ring-1 ring-white/25 grid place-items-center">
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="text-white">
                  <path d="M9 8l8 4-8 4V8z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </button>
  );
}

function MediaModal({
  item,
  lang,
  anchor,
  onClose,
  onPrev,
  onNext,
  canNavigate,
}: {
  item: MediaItem;
  lang: "ar" | "en";
  anchor: LightboxAnchor;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  canNavigate: boolean;
}) {
  const rtl = lang === "ar";
  const reduce = useReducedMotion();
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchBase = useRef<{ dist: number; scale: number } | null>(null);
  const swipeRef = useRef<{ id: number | null; sx: number; sy: number; active: boolean }>({ id: null, sx: 0, sy: 0, active: false });
  const [swipeY, setSwipeY] = useState(0);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [anchoredViewport, setAnchoredViewport] = useState(false);
  const [framePosition, setFramePosition] = useState<LightboxPoint | null>(null);

  const resetView = () => {
    setScale(1);
    setTx(0);
    setTy(0);
    dragRef.current = null;
    pointers.current.clear();
    pinchBase.current = null;
  };

  useEffect(() => {
    resetView();
  }, [item.id]);

  useEffect(() => {
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, []);

  const onWheel = (e: React.WheelEvent) => {
    if (item.type !== "photo") return;
    e.preventDefault();
    const delta = -e.deltaY;
    const next = clamp(scale + (delta > 0 ? 0.12 : -0.12), 1, 4);
    setScale(next);
    if (next === 1) {
      setTx(0);
      setTy(0);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (item.type !== "photo") return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1 && scale > 1) {
      setDragging(true);
      dragRef.current = { x: e.clientX, y: e.clientY, tx, ty };
    }
    if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      pinchBase.current = { dist: Math.hypot(dx, dy), scale };
      setDragging(false);
      dragRef.current = null;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (item.type !== "photo") return;
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinchBase.current) {
      const pts = Array.from(pointers.current.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const dist = Math.hypot(dx, dy);
      const next = clamp((dist / pinchBase.current.dist) * pinchBase.current.scale, 1, 4);
      setScale(next);
      if (next === 1) {
        setTx(0);
        setTy(0);
      }
      return;
    }
    if (dragging && dragRef.current) {
      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      setTx(dragRef.current.tx + dx);
      setTy(dragRef.current.ty + dy);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (item.type !== "photo") return;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchBase.current = null;
    if (pointers.current.size === 0) {
      setDragging(false);
      dragRef.current = null;
    }
  };

  const onSwipePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    if (item.type === "photo") {
      if (pointers.current.size > 0) return;
      if (scale > 1.01) return;
    }
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    swipeRef.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, active: false };
  };

  const onSwipePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    if (swipeRef.current.id !== e.pointerId) return;
    const dx = e.clientX - swipeRef.current.sx;
    const dy = e.clientY - swipeRef.current.sy;
    if (dy < 0) return;
    if (!swipeRef.current.active) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) swipeRef.current.active = true;
      else return;
    }
    e.preventDefault();
    setSwipeY(dy);
  };

  const onSwipePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    if (swipeRef.current.id !== e.pointerId) return;
    const shouldClose = swipeRef.current.active && swipeY >= 50;
    swipeRef.current = { id: null, sx: 0, sy: 0, active: false };
    if (shouldClose) {
      onClose();
      return;
    }
    setSwipeY(0);
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const updateFramePosition = () => {
      const mobileOrTablet = isAnchoredLightboxViewport(window.innerWidth);
      setAnchoredViewport(mobileOrTablet);

      if (!mobileOrTablet || !anchor || !frameRef.current) {
        setFramePosition(null);
        return;
      }

      const rect = frameRef.current.getBoundingClientRect();

      // Start from the tap coordinates, then clamp to the viewport so the
      // lightbox never renders outside the visible area on phones/tablets.
      setFramePosition(
        getAnchoredLightboxPosition(
          anchor,
          { width: rect.width, height: rect.height },
          { width: window.innerWidth, height: window.innerHeight }
        )
      );
    };

    const rafId = window.requestAnimationFrame(updateFramePosition);
    window.addEventListener("resize", updateFramePosition);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateFramePosition);
    };
  }, [anchor, item.id]);

  const useAnchoredPosition = anchoredViewport && !!framePosition;
  const frameStyle = useAnchoredPosition
    ? {
        left: framePosition.x,
        top: framePosition.y,
        transition: reduce ? undefined : "left 200ms ease-out, top 200ms ease-out, opacity 200ms ease-out",
      }
    : undefined;
  const stageClassName = useAnchoredPosition
    ? "relative h-full w-full"
    : "relative mx-auto h-full max-w-5xl grid place-items-center";
  const frameClassName = useAnchoredPosition
    ? "absolute w-[min(calc(100vw-2rem),80rem)] md:w-[min(calc(100vw-4rem),80rem)] max-w-5xl"
    : "relative w-full";
  const mediaFrameClassName = "relative w-full max-w-5xl max-h-[82svh] aspect-[16/10] bg-black/20 ring-1 ring-white/10 rounded-2xl overflow-hidden touch-none";

  return (
    <motion.div
      className="fixed inset-0 z-[2147483647]"
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      aria-modal="true"
      role="dialog"
      dir={rtl ? "rtl" : "ltr"}
    >
      <button type="button" aria-label={rtl ? "إغلاق" : "Close"} className="absolute inset-0 bg-black/80" onClick={onClose} />

      <motion.div
        className="absolute inset-0 p-4 md:p-8 touch-none"
        style={{ y: swipeY }}
        animate={swipeRef.current.active ? undefined : { y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onPointerDown={onSwipePointerDown}
        onPointerMove={onSwipePointerMove}
        onPointerUp={onSwipePointerUp}
        onPointerCancel={onSwipePointerUp}
      >
        <div className={stageClassName}>
          <div ref={frameRef} className={frameClassName} style={frameStyle} data-lightbox-position={useAnchoredPosition ? "anchored" : "centered"}>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 z-10 h-12 w-12 rounded-full bg-black/50 ring-1 ring-white/20 grid place-items-center text-white hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            aria-label={rtl ? "إغلاق" : "Close"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {canNavigate ? (
            <>
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-black/50 ring-1 ring-white/20 grid place-items-center text-white hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
                aria-label={rtl ? "السابق" : "Previous"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={onNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-black/50 ring-1 ring-white/20 grid place-items-center text-white hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
                aria-label={rtl ? "التالي" : "Next"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          ) : null}

          {item.type === "photo" ? (
            <motion.div
              layoutId={reduce ? undefined : `photo-lib-media-${item.id}`}
              className={mediaFrameClassName}
              onWheel={onWheel}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <Image
                src={item.src}
                alt={rtl ? item.alt_ar || "" : item.alt_en || ""}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain"
                style={{ transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`, transformOrigin: "center center" }}
                priority
              />
            </motion.div>
          ) : (
            <motion.div layoutId={reduce ? undefined : `photo-lib-media-${item.id}`} className="w-full">
              <VideoPlayer item={item} lang={lang} />
            </motion.div>
          )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VideoPlayer({ item, lang }: { item: MediaItem; lang: "ar" | "en" }) {
  const rtl = lang === "ar";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(0.85);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = vol;
    v.muted = muted;
  }, [vol, muted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setT(v.currentTime || 0);
    const onMeta = () => setD(v.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (v.paused) await v.play();
      else v.pause();
    } catch {}
  };

  const seek = (value: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = clamp(value, 0, d || 0);
    setT(v.currentTime);
  };

  const toggleFullscreen = async () => {
    try {
      const el = wrapRef.current;
      if (!el) return;
      const doc: any = document;
      if (doc.fullscreenElement) {
        await doc.exitFullscreen?.();
      } else {
        await (el as any).requestFullscreen?.();
      }
    } catch {}
  };

  return (
    <div ref={wrapRef} className="relative w-full max-w-5xl max-h-[82svh] aspect-video bg-black/40 ring-1 ring-white/10 rounded-2xl overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-contain"
        src={item.src}
        poster={item.poster}
        playsInline
        preload="metadata"
        aria-label={rtl ? item.alt_ar || "فيديو" : item.alt_en || "Video"}
      />
      <div className="absolute inset-0 grid place-items-center">
        {!playing ? (
          <button
            type="button"
            onClick={togglePlay}
            className="h-16 w-16 rounded-full bg-black/50 ring-1 ring-white/20 grid place-items-center text-white hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            aria-label={rtl ? "تشغيل" : "Play"}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 8l8 4-8 4V8z" fill="currentColor" />
            </svg>
          </button>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="h-11 w-11 rounded-full bg-black/35 ring-1 ring-white/15 grid place-items-center text-white hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            aria-label={playing ? (rtl ? "إيقاف مؤقت" : "Pause") : rtl ? "تشغيل" : "Play"}
          >
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 6h4v12H7zM13 6h4v12h-4z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 8l8 4-8 4V8z" fill="currentColor" />
              </svg>
            )}
          </button>

          <div className="text-xs text-white/90 tabular-nums min-w-[76px]">
            {formatSeconds(t)} / {formatSeconds(d)}
          </div>

          <input
            aria-label={rtl ? "شريط التقدم" : "Timeline"}
            type="range"
            min={0}
            max={d || 0}
            step={0.1}
            value={t}
            onChange={(e) => seek(Number(e.target.value))}
            className="flex-1 accent-[var(--brand-accent)]"
          />

          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="h-11 w-11 rounded-full bg-black/35 ring-1 ring-white/15 grid place-items-center text-white hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            aria-label={muted ? (rtl ? "إلغاء الكتم" : "Unmute") : rtl ? "كتم" : "Mute"}
          >
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M11 5l-4 4H3v6h4l4 4V5z" fill="currentColor" />
                <path d="M16 9l5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M11 5l-4 4H3v6h4l4 4V5z" fill="currentColor" />
                <path d="M15 9a4 4 0 010 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M17.5 6.5a7 7 0 010 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <input
            aria-label={rtl ? "مستوى الصوت" : "Volume"}
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : vol}
            onChange={(e) => {
              const next = Number(e.target.value);
              setVol(next);
              setMuted(next === 0);
            }}
            className="w-24 accent-[var(--brand-accent)]"
          />

          <button
            type="button"
            onClick={toggleFullscreen}
            className="h-11 w-11 rounded-full bg-black/35 ring-1 ring-white/15 grid place-items-center text-white hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            aria-label={rtl ? "ملء الشاشة" : "Fullscreen"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
