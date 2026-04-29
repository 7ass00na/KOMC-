import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("main_logo.svg", () => {
  const svgPath = join(process.cwd(), "public", "main_logo.svg");
  const svg = readFileSync(svgPath, "utf8");

  it("contains a proper viewBox for scalable rendering", () => {
    expect(svg).toMatch(/viewBox="0 0 512 512"/);
  });

  it("includes an accessible title", () => {
    expect(svg).toMatch(/<title id="komc-logo-title">/);
    expect(svg).toMatch(/Khaled Omer Maritime &amp; Legal Consultancy logo/);
  });

  it("embeds the generated raster logo payload", () => {
    expect(svg).toMatch(/data:image\/png;base64,/);
    expect(svg).toMatch(/preserveAspectRatio="xMidYMid meet"/);
  });

  it("renders crisply at common sizes by scaling the viewBox", () => {
    const firstTag = svg.split("\n")[0];
    expect(firstTag).toMatch(/^<svg\b/);
    expect(firstTag).not.toMatch(/\bwidth="/);
    expect(firstTag).not.toMatch(/\bheight="/);
  });
});
