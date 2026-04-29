type LockSnapshot = {
  count: number;
  bodyOverflow: string;
  htmlOverflow: string;
  bodyOverscrollBehavior: string;
  htmlOverscrollBehavior: string;
  touchAction: string;
};

const LOCK_KEY = "__komcBodyScrollLock";

function getSnapshot(): LockSnapshot {
  const globalScope = globalThis as typeof globalThis & {
    [LOCK_KEY]?: LockSnapshot;
  };

  if (!globalScope[LOCK_KEY]) {
    globalScope[LOCK_KEY] = {
      count: 0,
      bodyOverflow: "",
      htmlOverflow: "",
      bodyOverscrollBehavior: "",
      htmlOverscrollBehavior: "",
      touchAction: "",
    };
  }

  return globalScope[LOCK_KEY]!;
}

export function lockBodyScroll() {
  if (typeof document === "undefined") return;

  const state = getSnapshot();
  if (state.count === 0) {
    state.bodyOverflow = document.body.style.overflow;
    state.htmlOverflow = document.documentElement.style.overflow;
    state.bodyOverscrollBehavior = document.body.style.overscrollBehavior;
    state.htmlOverscrollBehavior = document.documentElement.style.overscrollBehavior;
    state.touchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.touchAction = "none";
    document.body.setAttribute("data-scroll-locked", "true");
  }

  state.count += 1;
}

export function unlockBodyScroll() {
  if (typeof document === "undefined") return;

  const state = getSnapshot();
  if (state.count === 0) return;

  state.count -= 1;
  if (state.count > 0) return;

  document.body.style.overflow = state.bodyOverflow;
  document.documentElement.style.overflow = state.htmlOverflow;
  document.body.style.overscrollBehavior = state.bodyOverscrollBehavior;
  document.documentElement.style.overscrollBehavior = state.htmlOverscrollBehavior;
  document.body.style.touchAction = state.touchAction;
  document.body.removeAttribute("data-scroll-locked");
}

export function resetBodyScrollLock() {
  if (typeof document === "undefined") return;

  const state = getSnapshot();
  state.count = 0;

  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  document.body.style.overscrollBehavior = "";
  document.documentElement.style.overscrollBehavior = "";
  document.body.style.touchAction = "";
  document.body.removeAttribute("data-scroll-locked");
}
