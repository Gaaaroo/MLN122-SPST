import { useEffect, useRef, useState } from "react";
import {
  buildLabContext,
  DEBATE_PERSONAS,
  DEBATE_TOPICS,
  type DebatePersona,
} from "../aiLabData";
import { callGemini, getApiKey, saveApiKey, type ChatMessage } from "../geminiApi";
import type { OverviewOutcome } from "../overviewTypes";
import { AiRichText } from "./AiRichText";

interface Props {
  outcome?: OverviewOutcome;
}

type LabTab = "analyze" | "debate" | "chat";

interface DebateLine {
  speaker: "user" | "ai";
  name?: string;
  color?: string;
  text: string;
}

const CHAT_STARTERS = [
  "Vì sao nói FIFA giống một tổ chức độc quyền?",
  "Qatar chi 220 tỷ đô, vậy dân Qatar được gì?",
  "Ai làm ra tiền trong World Cup, và ai giữ phần lớn?",
];

const ANALYZE_SYSTEM = `Bạn là chuyên gia Kinh tế chính trị Mác–Lênin, phân tích số liệu thể thao. Trả lời bằng tiếng Việt, súc tích, dùng gạch đầu dòng (mỗi ý bắt đầu bằng "•"), tối đa khoảng 160 từ. Tập trung: giá trị thặng dư, tích lũy tư bản, độc quyền, mâu thuẫn nhà nước – tư bản tư nhân. Không bịa số ngoài ngữ cảnh được cung cấp.`;

const CHAT_SYSTEM_BASE = `Bạn là trợ lý phân tích kinh tế thể thao, chuyên World Cup và liên hệ Kinh tế chính trị Mác–Lênin. Trả lời tiếng Việt, ngắn gọn, có số liệu khi phù hợp (chỉ dùng số trong ngữ cảnh). Có thể dùng **đậm** cho thuật ngữ quan trọng và gạch đầu dòng (- ) cho ý phức tạp. Không dùng heading markdown (#).`;

/** Mỗi đợt tự động: mỗi vai nói 1 lần. Tổng tối đa cứng. */
const DEBATE_HARD_CAP = 8;

function initialDebateCtl() {
  return {
    personas: [] as DebatePersona[],
    topic: "",
    transcript: [] as DebateLine[],
    turnIndex: 0,
    turnsSpoken: 0,
    maxTurns: 0,
    running: false,
    busy: false,
    started: false,
    loopId: 0,
  };
}

export default function MlnChatBot({ outcome }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<LabTab>("analyze");
  const [apiKeyDraft, setApiKeyDraft] = useState("");
  const [hasKey, setHasKey] = useState(() => Boolean(getApiKey()));
  const [error, setError] = useState<string | null>(null);

  // Analyze
  const [analyzeText, setAnalyzeText] = useState("");
  const [analyzeBusy, setAnalyzeBusy] = useState(false);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Debate
  const [topicId, setTopicId] = useState(DEBATE_TOPICS[0].id);
  const [customTopic, setCustomTopic] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(["fifa", "ktct"]);
  const [transcript, setTranscript] = useState<DebateLine[]>([]);
  const [debateBusy, setDebateBusy] = useState(false);
  const [debateRunning, setDebateRunning] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [turnProgress, setTurnProgress] = useState({ spoken: 0, max: 0 });
  const [interjectInput, setInterjectInput] = useState("");
  const debateRef = useRef<HTMLDivElement>(null);
  const debateCtl = useRef(initialDebateCtl());

  const labContext = buildLabContext(outcome);

  useEffect(() => {
    if (!open) return;
    const el = tab === "chat" ? chatRef.current : debateRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, tab, chatMessages, transcript, chatBusy, debateBusy]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleSaveKey() {
    saveApiKey(apiKeyDraft);
    setHasKey(Boolean(getApiKey()));
    setApiKeyDraft("");
    setError(null);
  }

  async function runAnalyze() {
    if (!hasKey || analyzeBusy) return;
    setAnalyzeBusy(true);
    setError(null);
    setAnalyzeText("");
    try {
      const text = await callGemini({
        system: ANALYZE_SYSTEM,
        maxTokens: 500,
        messages: [
          {
            role: "user",
            content: `${labContext}\n\nTừ những số liệu trên, ai thực sự hưởng lợi và ai chịu rủi ro/chi phí? Phân tích ngắn dưới góc nhìn kinh tế chính trị.`,
          },
        ],
      });
      setAnalyzeText(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Phân tích thất bại.");
    } finally {
      setAnalyzeBusy(false);
    }
  }

  async function sendChat(text: string) {
    const trimmed = text.trim();
    if (!trimmed || chatBusy || !hasKey) return;
    const next: ChatMessage[] = [
      ...chatMessages,
      { role: "user", content: trimmed },
    ];
    setChatMessages(next);
    setChatInput("");
    setChatBusy(true);
    setError(null);
    try {
      const reply = await callGemini({
        system: `${CHAT_SYSTEM_BASE}\n\nBối cảnh số liệu:\n${labContext}`,
        messages: next,
        maxTokens: 700,
      });
      setChatMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gửi tin thất bại.");
    } finally {
      setChatBusy(false);
    }
  }

  function getTopicPrompt(): string {
    if (topicId === "custom") {
      return (
        customTopic.trim() ||
        "World Cup có thực sự mang lại lợi ích kinh tế cho nước chủ nhà, hay FIFA mới là bên hưởng lợi chính?"
      );
    }
    return (
      DEBATE_TOPICS.find((t) => t.id === topicId)?.prompt ??
      DEBATE_TOPICS[0].prompt
    );
  }

  function togglePersona(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function syncTurnProgress() {
    const s = debateCtl.current;
    setTurnProgress({ spoken: s.turnsSpoken, max: s.maxTurns });
  }

  function buildSpeakPrompt(
    persona: DebatePersona,
    transcript: DebateLine[],
    topic: string,
  ): string {
    if (transcript.length === 0) {
      return `Mở đầu tranh luận về chủ đề: "${topic}".
Với tư cách ${persona.name}, nêu lập trường mở đầu 2–4 câu, tiếng Việt, nói với khán giả/người tham gia trong phòng.`;
    }

    const last = transcript[transcript.length - 1];
    const history = transcript
      .map((t) => `${t.speaker === "user" ? "Bạn" : t.name}: ${t.text}`)
      .join("\n");

    if (last.speaker === "user") {
      return `Chủ đề phòng tranh luận: "${topic}"

Diễn biến đến giờ:
${history}

Câu vừa rồi của người tham gia thật (Bạn): "${last.text}"

Nhiệm vụ của bạn (${persona.name}):
1) Trả lời TRỰC TIẾP câu đó trước — như đang nói chuyện với họ.
2) Nếu là chào hỏi / câu ngắn / chưa rõ ý: đáp xã giao ngắn trong vai, hỏi họ muốn bàn điểm nào trong chủ đề; KHÔNG tự đọc bài luận dài về World Cup.
3) Nếu họ nêu ý kiến/lập luận: phản hồi đúng ý họ (đồng ý/phản biện/hỏi lại), rồi mới nối sang quan điểm của vai bạn nếu cần.
4) 2–5 câu, tiếng Việt tự nhiên. Không bỏ qua nội dung họ vừa nói.`;
    }

    return `Chủ đề: "${topic}"

Diễn biến đến giờ:
${history}

Lượt vừa rồi là của ${last.name ?? "một diễn giả"}.
Với tư cách ${persona.name}, phản biện hoặc bổ sung TRỰC TIẾP ý vừa nói (trích/ám chỉ nội dung cụ thể), 2–5 câu tiếng Việt. Không lặp lại diễn văn chung chung.`;
  }

  async function speakNext(): Promise<boolean> {
    const s = debateCtl.current;
    if (s.busy || s.personas.length === 0) return false;
    if (s.turnsSpoken >= s.maxTurns) return false;

    s.busy = true;
    setDebateBusy(true);

    const persona = s.personas[s.turnIndex % s.personas.length];
    const system = `${persona.system}\n\nBối cảnh số liệu (chỉ dùng khi thật sự cần cho lập luận):\n${labContext}\n\nChủ đề: "${s.topic}"`;
    const userMsg = buildSpeakPrompt(persona, s.transcript, s.topic);

    try {
      const text = await callGemini({
        system,
        messages: [{ role: "user", content: userMsg }],
        maxTokens: 350,
      });
      const line: DebateLine = {
        speaker: "ai",
        name: persona.name,
        color: persona.color,
        text,
      };
      s.transcript = [...s.transcript, line];
      s.turnsSpoken += 1;
      s.turnIndex = (s.turnIndex + 1) % s.personas.length;
      setTranscript(s.transcript);
      syncTurnProgress();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lượt tranh luận lỗi.");
      s.running = false;
      setDebateRunning(false);
      setShowContinue(s.turnsSpoken < DEBATE_HARD_CAP);
      return false;
    } finally {
      s.busy = false;
      setDebateBusy(false);
    }
  }

  async function autoPlayLoop() {
    const s = debateCtl.current;
    const loopId = ++s.loopId;
    while (
      s.running &&
      s.loopId === loopId &&
      s.turnsSpoken < s.maxTurns
    ) {
      const ok = await speakNext();
      if (!ok || !s.running || s.loopId !== loopId) break;
      await new Promise((r) => setTimeout(r, 350));
    }
    if (s.loopId !== loopId) return;
    s.running = false;
    setDebateRunning(false);
    setShowContinue(s.turnsSpoken < DEBATE_HARD_CAP);
    syncTurnProgress();
  }

  function startDebate() {
    if (selectedIds.length < 2) {
      setError("Chọn ít nhất 2 người tham gia tranh luận.");
      return;
    }
    if (!hasKey) return;
    setError(null);
    const personas = DEBATE_PERSONAS.filter((p) => selectedIds.includes(p.id));
    const s = debateCtl.current;
    s.loopId += 1;
    s.personas = personas;
    s.topic = getTopicPrompt();
    s.transcript = [];
    s.turnIndex = 0;
    s.turnsSpoken = 0;
    /** Mỗi vai nói đúng 1 lần rồi dừng */
    s.maxTurns = Math.min(personas.length, DEBATE_HARD_CAP);
    s.running = true;
    s.started = true;
    s.busy = false;
    setTranscript([]);
    setShowContinue(false);
    setDebateRunning(true);
    syncTurnProgress();
    void autoPlayLoop();
  }

  function stopDebate() {
    const s = debateCtl.current;
    s.running = false;
    s.loopId += 1;
    setDebateRunning(false);
    setShowContinue(s.turnsSpoken < DEBATE_HARD_CAP);
  }

  function continueDebate() {
    const s = debateCtl.current;
    if (s.turnsSpoken >= DEBATE_HARD_CAP || s.personas.length === 0) return;
    /** Thêm đúng 1 vòng nữa (mỗi vai 1 lượt), không vượt hard cap */
    s.maxTurns = Math.min(
      s.turnsSpoken + s.personas.length,
      DEBATE_HARD_CAP,
    );
    s.running = true;
    setShowContinue(false);
    setDebateRunning(true);
    syncTurnProgress();
    void autoPlayLoop();
  }

  function resetDebate() {
    const nextLoop = debateCtl.current.loopId + 1;
    debateCtl.current = { ...initialDebateCtl(), loopId: nextLoop };
    setTranscript([]);
    setDebateRunning(false);
    setShowContinue(false);
    setDebateBusy(false);
    setTurnProgress({ spoken: 0, max: 0 });
    setError(null);
  }

  async function interject() {
    const val = interjectInput.trim();
    if (!val || debateCtl.current.busy) return;

    const s = debateCtl.current;
    if (!s.started) {
      if (selectedIds.length < 2) {
        setError("Chọn ít nhất 2 người tham gia bên trái trước.");
        return;
      }
      s.personas = DEBATE_PERSONAS.filter((p) => selectedIds.includes(p.id));
      s.topic = getTopicPrompt();
      s.transcript = [];
      s.turnIndex = 0;
      s.turnsSpoken = 0;
      s.maxTurns = 1;
      s.started = true;
      s.running = false;
      setShowContinue(false);
      syncTurnProgress();
    }

    setInterjectInput("");
    setError(null);
    const line: DebateLine = { speaker: "user", text: val };
    s.transcript = [...s.transcript, line];
    setTranscript(s.transcript);

    if (!s.running && !s.busy) {
      if (s.turnsSpoken >= s.maxTurns && s.turnsSpoken < DEBATE_HARD_CAP) {
        s.maxTurns = s.turnsSpoken + 1;
        syncTurnProgress();
      }
      await speakNext();
      setShowContinue(s.turnsSpoken < DEBATE_HARD_CAP);
    }
  }

  return (
    <div className="mln-chat">
      {open ? (
        <div
          className="mln-lab-backdrop"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="mln-chat-panel panel mln-lab"
            role="dialog"
            aria-modal="true"
            aria-label="Phòng thí nghiệm AI kinh tế World Cup"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="mln-chat-head">
              <div className="mln-chat-brand">
                <span className="mln-chat-mark" aria-hidden>
                  AI
                </span>
                <div>
                  <div className="mln-chat-title-row">
                    <h3>World Cup Econ Lab</h3>
                    <span className="mln-chat-badge">MLN122</span>
                  </div>
                  <p>Phân tích, tranh luận, hỏi đáp theo góc nhìn kinh tế chính trị</p>
                </div>
              </div>
              <button
                type="button"
                className="mln-chat-close"
                onClick={() => setOpen(false)}
                aria-label="Đóng"
              >
                ✕
              </button>
            </header>

            <div className="mln-lab-tabs" role="tablist">
              {(
                [
                  ["analyze", "Phân tích", "Từ số liệu ra bài học"],
                  ["debate", "Tranh luận", "Nhiều góc nhìn"],
                  ["chat", "Hỏi đáp", "Trao đổi tự do"],
                ] as const
              ).map(([id, label, hint]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  className={`mln-lab-tab${tab === id ? " is-active" : ""}`}
                  onClick={() => {
                    setTab(id);
                    setError(null);
                  }}
                >
                  <span className="mln-lab-tab-label">{label}</span>
                  <span className="mln-lab-tab-hint">{hint}</span>
                </button>
              ))}
            </div>

            {!hasKey ? (
              <div className="mln-chat-key">
                <div className="mln-chat-key-copy">
                  <strong>Cần Gemini API key</strong>
                  <p>
                    Thêm <code>VITE_GEMINI_API_KEY</code> vào <code>.env.local</code> rồi
                    chạy lại, hoặc dán key tạm bên dưới.
                  </p>
                </div>
                <div className="mln-chat-key-row">
                  <input
                    type="password"
                    value={apiKeyDraft}
                    onChange={(e) => setApiKeyDraft(e.target.value)}
                    placeholder="AIza..."
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleSaveKey}
                    disabled={!apiKeyDraft.trim()}
                  >
                    Lưu key
                  </button>
                </div>
              </div>
            ) : null}

            {error ? <p className="mln-chat-error mln-lab-error">{error}</p> : null}

            {tab === "analyze" ? (
              <div className="mln-lab-body mln-lab-analyze">
                {!analyzeText && !analyzeBusy ? (
                  <div className="mln-analyze-hero">
                    <span className="mln-analyze-icon" aria-hidden>
                      ◈
                    </span>
                    <h4>Đọc số liệu theo góc nhìn Mác–Lênin</h4>
                    <p>
                      AI đọc các con số trong trang và giải thích ai làm ra của cải,
                      ai hưởng, ai trả. Dùng làm chất liệu viết bài luận.
                    </p>
                    <button
                      type="button"
                      className="btn-primary mln-analyze-cta"
                      disabled={!hasKey || analyzeBusy}
                      onClick={() => void runAnalyze()}
                    >
                      Phân tích cùng AI
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mln-analyze-toolbar">
                      <button
                        type="button"
                        className="btn-ghost"
                        disabled={!hasKey || analyzeBusy}
                        onClick={() => void runAnalyze()}
                      >
                        {analyzeBusy ? "Đang phân tích…" : "Phân tích lại"}
                      </button>
                    </div>
                    {analyzeBusy && !analyzeText ? (
                      <div className="mln-lab-output is-loading">
                        <span className="mln-typing-dots" aria-hidden>
                          <i />
                          <i />
                          <i />
                        </span>
                        AI đang phân tích số liệu…
                      </div>
                    ) : null}
                    {analyzeText ? (
                      <div className="mln-lab-output">
                        <AiRichText text={analyzeText} />
                      </div>
                    ) : null}
                  </>
                )}
                <p className="mln-lab-note">
                  Số liệu lấy từ tài liệu dự án và kịch bản bạn đang mở (nếu có).
                  Câu trả lời của AI chỉ để tham khảo.
                </p>
              </div>
            ) : null}

            {tab === "debate" ? (
              <div className="mln-lab-body mln-debate">
                <aside className="mln-debate-side">
                  <label className="mln-lab-field">
                    <span>Chủ đề</span>
                    <select
                      value={topicId}
                      onChange={(e) => setTopicId(e.target.value)}
                      disabled={debateRunning}
                    >
                      {DEBATE_TOPICS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                      <option value="custom">Chủ đề khác…</option>
                    </select>
                  </label>
                  {topicId === "custom" ? (
                    <input
                      type="text"
                      className="mln-lab-input"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="Nhập chủ đề tranh luận…"
                      disabled={debateRunning}
                    />
                  ) : null}

                  <div className="mln-lab-field">
                    <span>Người tham gia (từ 2 trở lên)</span>
                    <div className="mln-persona-pick">
                      {DEBATE_PERSONAS.map((p) => (
                        <label
                          key={p.id}
                          className={`mln-persona${selectedIds.includes(p.id) ? " is-on" : ""}`}
                          style={{ ["--persona" as string]: p.color }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(p.id)}
                            onChange={() => togglePersona(p.id)}
                            disabled={debateRunning}
                          />
                          <span className="mln-persona-dot" aria-hidden />
                          <span className="mln-persona-name">{p.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mln-debate-actions">
                    {!debateRunning ? (
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={!hasKey || debateBusy}
                        onClick={startDebate}
                      >
                        Bắt đầu tranh luận
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-ghost mln-btn-warn"
                        onClick={stopDebate}
                      >
                        Dừng
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={resetDebate}
                      disabled={debateRunning}
                    >
                      Làm mới
                    </button>
                  </div>
                </aside>

                <div className="mln-debate-main">
                  {turnProgress.max > 0 ? (
                    <div className="mln-debate-progress">
                      <span>
                        Lượt AI: {turnProgress.spoken}/{turnProgress.max}
                      </span>
                      <span className="mln-debate-status">
                        {debateRunning
                          ? "Đang chạy…"
                          : turnProgress.spoken >= DEBATE_HARD_CAP
                            ? "Hết lượt tự động"
                            : "Tạm dừng"}
                      </span>
                    </div>
                  ) : null}
                  <div className="mln-debate-transcript" ref={debateRef}>
                    {transcript.length === 0 ? (
                      <div className="mln-lab-empty">
                        <strong>Sẵn sàng tranh luận</strong>
                        <p>
                          Mỗi vai nói 1 lần rồi dừng (tối đa {DEBATE_HARD_CAP} lượt AI).
                          Chọn chủ đề và người tham gia, rồi bấm Bắt đầu.
                        </p>
                      </div>
                    ) : (
                      transcript.map((t, i) =>
                        t.speaker === "user" ? (
                          <div key={i} className="mln-bubble mln-bubble-user">
                            <div className="mln-bubble-who">Bạn</div>
                            <div className="mln-bubble-body">{t.text}</div>
                          </div>
                        ) : (
                          <div
                            key={i}
                            className="mln-bubble mln-bubble-ai"
                            style={{ borderLeftColor: t.color }}
                          >
                            <div
                              className="mln-bubble-who"
                              style={{ color: t.color }}
                            >
                              {t.name}
                            </div>
                            <div className="mln-bubble-body">
                              <AiRichText text={t.text} />
                            </div>
                          </div>
                        ),
                      )
                    )}
                    {debateBusy ? (
                      <div className="mln-bubble mln-bubble-ai is-typing">
                        <span className="mln-typing-dots" aria-hidden>
                          <i />
                          <i />
                          <i />
                        </span>
                        Đang suy nghĩ…
                      </div>
                    ) : null}
                  </div>

                  <div className="mln-debate-footer">
                    {showContinue &&
                    !debateRunning &&
                    turnProgress.spoken < DEBATE_HARD_CAP ? (
                      <button
                        type="button"
                        className="btn-ghost mln-continue"
                        onClick={continueDebate}
                        disabled={!hasKey || debateBusy}
                      >
                        Tiếp tục 1 vòng nữa
                      </button>
                    ) : (
                      <p className="mln-lab-hint">
                        Gõ để tham gia, hoặc bấm Bắt đầu để AI đối đáp nhau.
                      </p>
                    )}
                  </div>
                  <form
                    className="mln-chat-form mln-chat-composer"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void interject();
                    }}
                  >
                    <input
                      type="text"
                      value={interjectInput}
                      onChange={(e) => setInterjectInput(e.target.value)}
                      placeholder="Nhập ý kiến vào cuộc tranh luận…"
                      disabled={!hasKey || debateBusy}
                      aria-label="Ý kiến tranh luận"
                    />
                    <button
                      type="submit"
                      className="btn-primary mln-send"
                      disabled={!hasKey || debateBusy || !interjectInput.trim()}
                    >
                      Gửi
                    </button>
                  </form>
                </div>
              </div>
            ) : null}

            {tab === "chat" ? (
              <div className="mln-lab-body mln-lab-chat">
                <div className="mln-chat-messages" ref={chatRef}>
                  {chatMessages.length === 0 ? (
                    <div className="mln-chat-empty">
                      <span className="mln-chat-empty-icon" aria-hidden>
                        ✦
                      </span>
                      <p className="mln-chat-empty-title">Hỏi bất cứ điều gì về kinh tế World Cup</p>
                      <p>
                        AI trả lời ngắn gọn theo góc nhìn kinh tế chính trị Mác–Lênin,
                        có số liệu khi phù hợp.
                      </p>
                      <div className="mln-chat-starters">
                        {CHAT_STARTERS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="mln-chat-starter"
                            disabled={!hasKey || chatBusy}
                            onClick={() => void sendChat(s)}
                          >
                            <span>{s}</span>
                            <span className="mln-chat-starter-go" aria-hidden>
                              →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((m, i) => (
                      <div
                        key={`${m.role}-${i}`}
                        className={`mln-chat-row mln-chat-row-${m.role}`}
                      >
                        <div
                          className={`mln-chat-avatar mln-chat-avatar-${m.role}`}
                          aria-hidden
                        >
                          {m.role === "user" ? "Bạn" : "AI"}
                        </div>
                        <div className={`mln-chat-bubble mln-chat-${m.role}`}>
                          {m.role === "assistant" ? (
                            <AiRichText text={m.content} />
                          ) : (
                            m.content
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {chatBusy ? (
                    <div className="mln-chat-row mln-chat-row-assistant">
                      <div
                        className="mln-chat-avatar mln-chat-avatar-assistant"
                        aria-hidden
                      >
                        AI
                      </div>
                      <div className="mln-chat-bubble mln-chat-assistant mln-chat-typing">
                        <span className="mln-typing-dots" aria-label="Đang suy nghĩ">
                          <i />
                          <i />
                          <i />
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
                <form
                  className="mln-chat-form mln-chat-composer"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendChat(chatInput);
                  }}
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={
                      hasKey ? "Hỏi về FIFA, chi phí đăng cai, ai hưởng lợi…" : "Cần API key trước"
                    }
                    disabled={!hasKey || chatBusy}
                    aria-label="Câu hỏi"
                  />
                  <button
                    type="submit"
                    className="btn-primary mln-send"
                    disabled={!hasKey || chatBusy || !chatInput.trim()}
                  >
                    Gửi
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {!open ? (
        <button
          type="button"
          className="mln-chat-fab"
          onClick={() => setOpen(true)}
          aria-label="Mở World Cup Econ Lab"
          aria-expanded={false}
        >
          <svg
            className="mln-chat-fab-icon"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M5.5 18.5 4 21l3.2-1.3A8.6 8.6 0 0 0 12 21c4.7 0 8.5-3.4 8.5-7.5S16.7 6 12 6 3.5 9.4 3.5 13.5c0 1.7.6 3.3 1.7 4.6l.3.4Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path
              d="M8.2 12.2h7.6M8.2 15h5.2"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
