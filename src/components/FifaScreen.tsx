import { computeFifaMetrics, getFifaInsight } from "../gameLogic";
import { formatUsdB } from "../realWorldData";
import type { FifaState } from "../types";
import { Slider } from "./Slider";

interface Props {
  fifa: FifaState;
  onChange: (next: FifaState) => void;
  onAdvance: () => void;
  onBack: () => void;
}

export function FifaScreen({ fifa, onChange, onAdvance, onBack }: Props) {
  const live = computeFifaMetrics(fifa);

  return (
    <div className="dashboard">
      <div className="top-bar">
        <span className="level">
          FIFA HQ — Lượt {fifa.turn}/{fifa.maxTurns}
        </span>
        <button type="button" className="btn-ghost" onClick={onBack}>
          ← Quay lại
        </button>
      </div>

      <div className="panel">
        <div className="event-banner">{fifa.eventText}</div>

        <h3 className="panel-title">Tại sao 32 → 48 đội? Vì sao cần Trung Quốc?</h3>

        <div className="team-selector">
          {([32, 48] as const).map((n) => (
            <button
              key={n}
              type="button"
              className={`team-btn ${fifa.teams === n ? "active" : ""}`}
              onClick={() => onChange({ ...fifa, teams: n })}
            >
              {n} đội
            </button>
          ))}
        </div>

        <div className="fifa-metrics">
          <div className="metric-card brand">
            <div className="metric-label">Doanh thu FIFA (chu kỳ 4 năm)</div>
            <div className="metric-value">{formatUsdB(live.revenue)}</div>
          </div>
          <div className="metric-card legacy">
            <div className="metric-label">Khán giả toàn cầu (tỷ)</div>
            <div className="metric-value">{live.marketReach.toFixed(1)}B</div>
          </div>
          <div className="metric-card debt">
            <div className="metric-label">Chi phí nước chủ nhà (ước tính)</div>
            <div className="metric-value">{formatUsdB(live.hostCost)}</div>
          </div>
          <div className="metric-card stability">
            <div className="metric-label">Quốc gia tham gia</div>
            <div className="metric-value">{live.nationsEngaged}</div>
          </div>
        </div>

        <Slider
          label="Suất châu Á (vòng loại)"
          value={fifa.asiaSlots}
          min={4}
          max={8}
          onChange={(v) => onChange({ ...fifa, asiaSlots: v })}
          hint="4 suất (32 đội) → 8 suất (48 đội, WC 2026)"
        />
        <Slider
          label="Ưu tiên thị trường Trung Quốc"
          value={fifa.chinaPriority}
          onChange={(v) => onChange({ ...fifa, chinaPriority: v })}
          hint="1.4 tỷ dân — TV, sponsor, đăng cai tiềm năng"
        />

        <div className="insight-box">{getFifaInsight(fifa)}</div>

        <button type="button" className="btn-next btn-next-spaced" onClick={onAdvance}>
          Mô phỏng quyết định FIFA →
        </button>
      </div>
    </div>
  );
}
