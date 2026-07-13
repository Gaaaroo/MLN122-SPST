import { useState } from "react";
import {
  COST_CATEGORIES,
  EXPECTATION_GAP,
  FIFA_REVENUE,
  FIFA_STADIUM_CAPACITY,
  HOST_BENEFITS,
  HOST_COST_BY_EDITION,
  SHOCK_FACTS,
  TOURNAMENT_FORMAT,
  costContextLine,
} from "../realWorldData";

type Tab = "shock" | "costs" | "benefits" | "gap";

const TABS: { id: Tab; label: string }[] = [
  { id: "shock", label: "Số liệu shock" },
  { id: "costs", label: "Chi tiền gì?" },
  { id: "benefits", label: "Được gì?" },
  { id: "gap", label: "Kỳ vọng vs thật" },
];

interface Props {
  /** Chi phí host đang ước tính trên overview — hiện context dòng */
  liveHostCostB?: number;
  compact?: boolean;
}

export default function FactsPanel({ liveHostCostB, compact }: Props) {
  const [tab, setTab] = useState<Tab>("shock");

  return (
    <section className={`facts-panel ${compact ? "facts-compact" : ""}`}>
      <div className="facts-head">
        <div>
          <h2>World Cup thật sự tốn gì — và vì sao vẫn tranh đăng cai?</h2>
          <p className="facts-sub">
            Số liệu lịch sử: $
            {HOST_COST_BY_EDITION.SOUTH_AFRICA_2010}B (2010) → $
            {HOST_COST_BY_EDITION.QATAR_2022_TOTAL}B (2022) cho ~1 tháng bóng đá.
            FIFA dự thu chu kỳ 2026 ~${FIFA_REVENUE.CYCLE_2023_2026_PROJECTED}B.
          </p>
        </div>
        {liveHostCostB !== undefined && (
          <div className="facts-live-cost">
            <span className="facts-live-label">Kịch bản của bạn</span>
            <span className="facts-live-value">${liveHostCostB.toFixed(1)}B</span>
            <span className="facts-live-hint">{costContextLine(liveHostCostB)}</span>
          </div>
        )}
      </div>

      <div className="facts-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`facts-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "shock" && (
        <div className="facts-grid">
          {SHOCK_FACTS.map((f) => (
            <article key={f.id} className="fact-card">
              <span className="fact-tag">{f.tag}</span>
              <h3>{f.headline}</h3>
              <p>{f.detail}</p>
            </article>
          ))}
        </div>
      )}

      {tab === "costs" && (
        <div className="facts-grid">
          {COST_CATEGORIES.map((c) => (
            <article key={c.id} className="fact-card cost-card">
              <div className="fact-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.summary}</p>
              <p className="fact-example">{c.example}</p>
            </article>
          ))}
          <article className="fact-card cost-card fact-stadium-std">
            <div className="fact-icon">📏</div>
            <h3>Chuẩn sức chứa FIFA</h3>
            <p>
              Vòng bảng ≥{FIFA_STADIUM_CAPACITY.GROUP.toLocaleString("vi-VN")} chỗ ·
              Bán kết ≥{FIFA_STADIUM_CAPACITY.SEMI.toLocaleString("vi-VN")} · Chung kết ≥
              {FIFA_STADIUM_CAPACITY.FINAL.toLocaleString("vi-VN")}. Ghế VIP rộng ≥
              {FIFA_STADIUM_CAPACITY.VIP_SEAT_WIDTH_CM}cm (thường ~
              {FIFA_STADIUM_CAPACITY.NORMAL_SEAT_WIDTH_CM}cm).
            </p>
            <p className="fact-example">
              Việt Nam: Mỹ Đình chỉ đủ chuẩn vòng bảng tối thiểu.
            </p>
          </article>
        </div>
      )}

      {tab === "benefits" && (
        <div className="facts-grid">
          {HOST_BENEFITS.map((b) => (
            <article key={b.id} className="fact-card benefit-card">
              <div className="fact-icon">{b.icon}</div>
              <h3>{b.title}</h3>
              <p>{b.summary}</p>
            </article>
          ))}
        </div>
      )}

      {tab === "gap" && (
        <div className="facts-gap">
          <p className="facts-gap-intro">
            Báo cáo đấu thầu thường lạc quan để thắng phiếu — kinh tế gọi là{" "}
            <strong>lời nguyền kẻ chiến thắng</strong>. Dự báo làm trước giải 8–10 năm,
            dễ lệch vì lạm phát, tham nhũng, đội vốn.
          </p>
          <div className="gap-table">
            {EXPECTATION_GAP.map((g) => (
              <div key={g.id} className="gap-row">
                <div className="gap-name">{g.name}</div>
                <div className="gap-nums">
                  <span className="gap-expected">
                    Kỳ vọng ~${g.expectedB}B
                    {"expectedRange" in g && g.expectedRange
                      ? ` (${g.expectedRange})`
                      : ""}
                  </span>
                  <span className="gap-arrow">→</span>
                  <span className="gap-actual">Thực tế ~${g.actualB}B</span>
                </div>
                <div className="gap-note">{g.note}</div>
              </div>
            ))}
          </div>
          <p className="facts-gap-foot">
            WC 2026 thử phá lời nguyền: {TOURNAMENT_FORMAT.WC2026_STADIUMS} sân có sẵn (
            {TOURNAMENT_FORMAT.WC2026_USA_STADIUMS}+
            {TOURNAMENT_FORMAT.WC2026_MEXICO_STADIUMS}+
            {TOURNAMENT_FORMAT.WC2026_CANADA_STADIUMS}), Mỹ ôm ~
            {TOURNAMENT_FORMAT.WC2026_USA_MATCHES} trận — nhưng vẫn còn rủi ro giá vé, visa,
            địa chính trị.
          </p>
        </div>
      )}
    </section>
  );
}
