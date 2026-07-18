import type { ReactNode } from "react";

/** Render Markdown nhẹ từ AI: **đậm**, *nghiêng*, `code`, list, xuống dòng. */
export function AiRichText({ text }: { text: string }) {
  const blocks = splitBlocks(text.trim());
  return (
    <div className="ai-rich">
      {blocks.map((block, i) => {
        if (block.type === "ul") {
          return (
            <ul key={i} className="ai-rich-list">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={i} className="ai-rich-list ai-rich-ol">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="ai-rich-p">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function splitBlocks(text: string): Block[] {
  const lines = text.split(/\r?\n/);
  const blocks: Block[] = [];
  let para: string[] = [];
  let ul: string[] | null = null;
  let ol: string[] | null = null;

  function flushPara() {
    if (para.length === 0) return;
    blocks.push({ type: "p", text: para.join(" ").trim() });
    para = [];
  }
  function flushUl() {
    if (!ul || ul.length === 0) return;
    blocks.push({ type: "ul", items: ul });
    ul = null;
  }
  function flushOl() {
    if (!ol || ol.length === 0) return;
    blocks.push({ type: "ol", items: ol });
    ol = null;
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushUl();
      flushOl();
      continue;
    }

    const ulMatch = line.match(/^[-*•]\s+(.+)$/);
    if (ulMatch) {
      flushPara();
      flushOl();
      if (!ul) ul = [];
      ul.push(ulMatch[1]);
      continue;
    }

    const olMatch = line.match(/^\d+[.)]\s+(.+)$/);
    if (olMatch) {
      flushPara();
      flushUl();
      if (!ol) ol = [];
      ol.push(olMatch[1]);
      continue;
    }

    flushUl();
    flushOl();
    para.push(line);
  }

  flushPara();
  flushUl();
  flushOl();
  return blocks;
}

function renderInline(text: string): ReactNode[] {
  // **bold** | *italic* | `code` — lần lượt, không lồng phức tạp
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.filter(Boolean).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (
      part.startsWith("*") &&
      part.endsWith("*") &&
      part.length > 2 &&
      !part.startsWith("**")
    ) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} className="ai-rich-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
