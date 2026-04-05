import { describe, it, expect } from "vitest";
import { POST, /* @ts-ignore */ } from "@/app/api/legal-chat/stream/route";
import { NextRequest } from "next/server";

async function readAll(res: Response) {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let acc = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    acc += decoder.decode(value);
  }
  return acc;
}

describe("legal-chat stream", () => {
  it("returns greeting template on hello", async () => {
    const req = new NextRequest("http://test/stream", {
      method: "POST",
      body: JSON.stringify({
        lang: "en",
        messages: [{ role: "user", content: "Hello" }],
      }),
    } as any);
    const res = await POST(req);
    const output = await readAll(res);
    expect(output.toLowerCase()).toContain("virtual advisory assistant");
  });

  it("streams fallback chunks when no ollama configured", async () => {
    const req = new NextRequest("http://test/stream", {
      method: "POST",
      body: JSON.stringify({
        lang: "en",
        messages: [{ role: "user", content: "Explain tenancy notice periods" }],
      }),
    } as any);
    const res = await POST(req);
    const text = await readAll(res);
    expect(text.length).toBeGreaterThan(10);
    expect(text.toLowerCase()).toContain("jurisdiction");
  });
});

