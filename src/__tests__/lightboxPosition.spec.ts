import { describe, expect, it } from "vitest";
import { getAnchoredLightboxPosition, isAnchoredLightboxViewport } from "@/lib/lightboxPosition";

describe("lightbox positioning", () => {
  it("anchors directly to the tap point when there is room", () => {
    expect(
      getAnchoredLightboxPosition(
        { x: 120, y: 180 },
        { width: 240, height: 180 },
        { width: 768, height: 1024 }
      )
    ).toEqual({ x: 120, y: 180 });
  });

  it("clamps the frame inside the viewport when the tap is near the edge", () => {
    expect(
      getAnchoredLightboxPosition(
        { x: 730, y: 980 },
        { width: 320, height: 260 },
        { width: 768, height: 1024 }
      )
    ).toEqual({ x: 432, y: 748 });
  });

  it("uses anchored positioning only on phone and tablet widths", () => {
    expect(isAnchoredLightboxViewport(768)).toBe(true);
    expect(isAnchoredLightboxViewport(1024)).toBe(true);
    expect(isAnchoredLightboxViewport(1280)).toBe(false);
  });
});
