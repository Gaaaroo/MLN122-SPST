import { useState } from "react";
import {
  COST_CATEGORIES,
  EXPECTATION_GAP,
  EXPECTATION_GAP_SOURCES,
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
  { id: "shock", label: "Số liệu" },
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
          <h2>World Cup thật sự tốn bao nhiêu — và vì sao ai cũng muốn đăng cai?</h2>
          <p className="facts-sub">
            Chi phí đăng cai đã tăng từ {HOST_COST_BY_EDITION.SOUTH_AFRICA_2010} tỷ USD
            (Nam Phi 2010) lên {HOST_COST_BY_EDITION.QATAR_2022_TOTAL} tỷ USD (Qatar 2022) —
            chỉ cho một tháng bóng đá. Trong khi đó FIFA thu về khoảng{" "}
            {FIFA_REVENUE.CYCLE_2023_2026_PROJECTED} tỷ USD mỗi kỳ.
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
            <h3>Sân phải to cỡ nào?</h3>
            <p>
              Vòng bảng ít nhất {FIFA_STADIUM_CAPACITY.GROUP.toLocaleString("vi-VN")} chỗ,
              bán kết {FIFA_STADIUM_CAPACITY.SEMI.toLocaleString("vi-VN")}, chung kết{" "}
              {FIFA_STADIUM_CAPACITY.FINAL.toLocaleString("vi-VN")}. Ghế VIP rộng ít nhất{" "}
              {FIFA_STADIUM_CAPACITY.VIP_SEAT_WIDTH_CM}cm, trong khi ghế thường chỉ khoảng{" "}
              {FIFA_STADIUM_CAPACITY.NORMAL_SEAT_WIDTH_CM}cm.
            </p>
            <p className="fact-example">
              Ở Việt Nam, sân Mỹ Đình mới chỉ vừa đủ chuẩn vòng bảng.
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
            Để thắng quyền đăng cai, các nước thường vẽ ra con số lợi ích thật đẹp. Nhưng dự
            báo làm trước giải cả chục năm nên hay lệch xa vì lạm phát, đội vốn và tham nhũng.
            Dưới đây là lời hứa so với thực tế:
          </p>
          <div className="gap-table">
            {EXPECTATION_GAP.map((g) => {
              const expectedText = g.expectedRange
                ? g.expectedRange
                : g.expectedB !== undefined
                  ? `khoảng ${g.expectedB} tỷ USD`
                  : "—";
              const actualText =
                g.actualNote ??
                g.actualRange ??
                (g.actualB !== undefined ? `khoảng ${g.actualB} tỷ USD` : "—");

              return (
                <div key={g.id} className="gap-row">
                  <div className="gap-name">{g.name}</div>
                  <div className="gap-nums">
                    <span className="gap-expected">
                      <span className="gap-tag">Kỳ vọng</span> {expectedText}
                    </span>
                    <span className="gap-actual">
                      <span className="gap-tag">Thực tế</span> {actualText}
                    </span>
                  </div>
                  <div className="gap-note">{g.note}</div>
                </div>
              );
            })}
          </div>
          <p className="facts-gap-sources">Nguồn: {EXPECTATION_GAP_SOURCES}</p>
          <p className="facts-gap-foot">
            World Cup 2026 cố làm khác: dùng {TOURNAMENT_FORMAT.WC2026_STADIUMS} sân có sẵn
            (Mỹ {TOURNAMENT_FORMAT.WC2026_USA_STADIUMS}, Mexico{" "}
            {TOURNAMENT_FORMAT.WC2026_MEXICO_STADIUMS}, Canada{" "}
            {TOURNAMENT_FORMAT.WC2026_CANADA_STADIUMS}), Mỹ tổ chức phần lớn số trận — nhưng
            vẫn còn lo giá vé, visa và căng thẳng chính trị.
          </p>
        </div>
      )}
    </section>
  );
}
