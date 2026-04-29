import { NextRequest } from "next/server";

function encodeChunk(s: string) {
  return new TextEncoder().encode(s);
}

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  try {
    const { lang, messages } = (await req.json()) as {
      lang?: "en" | "ar";
      messages?: { role: "user" | "assistant"; content: string }[];
    };
    const last = (messages || []).slice(-1)[0]?.content || "";
    const ollamaUrl = process.env.OLLAMA_URL;
    const ollamaModel = process.env.OLLAMA_MODEL || "llama3.1";

    const templatesOlma = {
      en: {
        greeting:
          "Welcome to Khaled Omer’s virtual advisory assistant.\n\nPlease describe your matter briefly and include any deadlines or notices you received. I will outline initial UAE‑specific steps and options.\n\nNotice: This is general guidance, not legal advice.",
      },
      ar: {
        greeting:
          "مرحبًا بك في المساعد الافتراضي للاستشارات لدى خالد عمر.\n\nيرجى وصف مسألتك بإيجاز وذكر أي مهل زمنية أو إشعارات تلقيتها. سأقدم خطوات أولية وخيارات متوافقة مع القوانين الإماراتية.\n\nتنبيه: هذه إرشادات عامة وليست نصيحة قانونية.",
      },
    } as const;
    const greetRe = /^(hi|hello|hey|as-?s?alamu?|marhaba|مرحبا|أهلًا|اهلا|السلام|هاي)\b/i;
    if (greetRe.test(last || "")) {
      const greet = (lang === "ar" ? templatesOlma.ar.greeting : templatesOlma.en.greeting) + "\n";
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encodeChunk(greet));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Rate-Limit-By": ip,
        },
      });
    }

    if (ollamaUrl) {
      const r = await fetch(`${ollamaUrl.replace(/\/$/, "")}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ollamaModel,
          messages: (messages || []).map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        }),
      });
      if (!r.ok || !r.body) {
        return new Response("Upstream error", { status: 502 });
      }
      const stream = new ReadableStream({
        start(controller) {
          const reader = r.body!.getReader();
          function pump() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              try {
                const text = new TextDecoder().decode(value);
                const lines = text.split("\n").filter(Boolean);
                for (const line of lines) {
                  try {
                    const obj = JSON.parse(line);
                    const chunk = obj?.message?.content || obj?.response || "";
                    if (chunk) controller.enqueue(encodeChunk(chunk));
                  } catch {
                    controller.enqueue(encodeChunk(line));
                  }
                }
              } catch {
              }
              pump();
            });
          }
          pump();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Rate-Limit-By": ip,
        },
      });
    }

    const prefix =
      lang === "ar"
        ? "إرشاد عام (غير مُلزم قانونيًا): "
        : "General guidance (not legal advice): ";
    const body =
      (lang === "ar"
        ? `فهمت سؤالك: «${last.slice(0, 160)}». سيتم تزويدك بخطوات مبدئية متوافقة مع الأطر الإماراتية.`
        : `I understand your question: “${last.slice(0, 160)}”. I will provide initial steps aligned with UAE frameworks.`) +
      (lang === "ar"
        ? "\n\n• تحديد الجهة والاختصاص\n• جمع المستندات\n• تقييم المخاطر\n• حجز استشارة تفصيلية"
        : "\n\n• Identify authority and jurisdiction\n• Gather documentation\n• Assess risk\n• Book a detailed consultation");

    const text = prefix + body;
    const parts = text.match(/.{1,120}/g) || [text];
    const stream = new ReadableStream({
      start(controller) {
        let i = 0;
        function push() {
          if (i >= parts.length) {
            controller.close();
            return;
          }
          controller.enqueue(encodeChunk(parts[i]));
          i += 1;
          setTimeout(push, 60);
        }
        push();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Rate-Limit-By": ip,
      },
    });
  } catch {
    return new Response("Service unavailable", { status: 503 });
  }
}

