import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("main_logo.svg", () => {
  const svgPath = join(process.cwd(), "public", "main_logo.svg");
  const svg = readFileSync(svgPath, "utf8");

  it("contains a proper viewBox for scalable rendering", () => {
    expect(svg).toMatch(/viewBox="0 0 512 512"/);
  });

  it("includes the stars group with animation hooks", () => {
    expect(svg).toMatch(/id="komc-stars"/);
    expect(svg).toMatch(/@keyframes\s+komcStarSway/);
  });

  it("defines brand color tokens for theming", () => {
    expect(svg).toMatch(/--brand-accent:/);
    expect(svg).toMatch(/--ink-primary:/);
  });

  it("renders crisply at common sizes by scaling the viewBox", () => {
    // Ensure the root <svg> doesn't specify fixed width/height, allowing flexible scaling
    const firstTag = svg.split("\n")[0];
    expect(firstTag).toMatch(/^<svg\b/);
    expect(firstTag).not.toMatch(/\bwidth="/);
    expect(firstTag).not.toMatch(/\bheight="/);
    expect(svg).toMatch(/class="b"/);
    expect(svg).toMatch(/class="e"/);
  });
});
