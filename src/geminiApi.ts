export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MODEL = "gemini-3.1-flash-lite";

export function getApiKey(): string {
  const fromEnv = import.meta.env.VITE_GEMINI_API_KEY?.trim() ?? "";
  if (fromEnv) return fromEnv;
  try {
    return sessionStorage.getItem("hostia_gemini_key")?.trim() ?? "";
  } catch {
    return "";
  }
}

export function saveApiKey(key: string): void {
  try {
    const trimmed = key.trim();
    if (trimmed) sessionStorage.setItem("hostia_gemini_key", trimmed);
    else sessionStorage.removeItem("hostia_gemini_key");
  } catch {
    /* ignore */
  }
}

export async function callGemini(opts: {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
}): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "Chưa có API key. Thêm VITE_GEMINI_API_KEY vào .env.local hoặc dán key trong khung AI.",
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: opts.system }],
      },
      contents: opts.messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: opts.maxTokens ?? 800,
      },
    }),
  });

  const data = (await res.json()) as {
    candidates?: {
      content?: { parts?: { text?: string }[] };
      finishReason?: string;
    }[];
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(
      data.error?.message ?? `Gemini API lỗi (${res.status}). Kiểm tra API key.`,
    );
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();

  if (!text) {
    const reason = data.candidates?.[0]?.finishReason;
    throw new Error(
      reason
        ? `Gemini không trả text (finishReason: ${reason}).`
        : "Gemini không trả nội dung text.",
    );
  }

  return text;
}
