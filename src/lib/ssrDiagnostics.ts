const enable = typeof process !== "undefined" && process.env?.NODE_ENV !== "production";
if (enable && typeof (globalThis as any).window === "undefined" && !(globalThis as any).__SSR_DIAG_INSTALLED__) {
  (globalThis as any).__SSR_DIAG_INSTALLED__ = true;
  const seen = new Set<string>();
  const logOnce = (label: string) => {
    try {
      const err = new Error();
      const stack = String(err.stack || "").split("\n").slice(2, 8).join("\n");
      const key = label + "|" + stack;
      if (seen.has(key)) return;
      seen.add(key);
      // eslint-disable-next-line no-console
      console.warn("[SSR-DIAG]", label, "\n", stack);
    } catch {}
  };
  if (!Object.getOwnPropertyDescriptor(globalThis, "window")) {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      get() {
        logOnce("Accessed 'window' during SSR");
        return undefined;
      },
    });
  }
  const origNow = Date.now;
  Date.now = function () {
    logOnce("Called Date.now() during SSR");
    // @ts-ignore
    return origNow.apply(Date, arguments);
  };
  const perf = (globalThis as any).performance;
  if (perf && typeof perf.now === "function") {
    const origPerfNow = perf.now.bind(perf);
    perf.now = function () {
      logOnce("Called performance.now() during SSR");
      // @ts-ignore
      return origPerfNow.apply(perf, arguments);
    };
  }
}
