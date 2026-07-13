import { useMemo, useState } from "react";
import { computeOverview } from "../overviewLogic";
import {
  DEFAULT_OVERVIEW,
  OVERVIEW_PRESETS,
  type OverviewConfig,
} from "../overviewTypes";
import { DATA_SOURCES, formatUsdB } from "../realWorldData";
import FactsPanel from "./FactsPanel";
import { Slider } from "./Slider";

interface Props {
  initial?: Partial<OverviewConfig>;
  onPlayTurnBased?: () => void;
  onBack: () => void;
}

function MetricBar({
  label,
  value,
  hint,
  invert,
}: {
  label: string;
  value: number;
  hint?: string;
  invert?: boolean;
}) {
  const display = invert ? 100 - value : value;
  const color =
    display >= 65 ? "var(--green)" : display >= 40 ? "var(--yellow)" : "var(--red)";

  return (
    <div className="ov-metric">
      <div className="ov-metric-head">
        <span>{label}</span>
        <span className="mono">{invert ? value : display}/100</span>
      </div>
      <div className="ov-bar-track">
        <div
          className="ov-bar-fill"
          style={{ width: `${display}%`, background: color }}
        />
      </div>
      {hint ? <div className="ov-metric-hint">{hint}</div> : null}
    </div>
  );
}

function LensBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="ov-lens-row">
      <span className="ov-lens-label">{label}</span>
      <div className="ov-bar-track ov-lens-track">
        <div className="ov-bar-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="mono ov-lens-val">{value}</span>
    </div>
  );
}

export default function OverviewPanel({ initial, onPlayTurnBased, onBack }: Props) {
  const [config, setConfig] = useState<OverviewConfig>({
    ...DEFAULT_OVERVIEW,
    ...initial,
  });
  const [showFacts, setShowFacts] = useState(true);

  const outcome = useMemo(() => computeOverview(config), [config]);

  const patch = (p: Partial<OverviewConfig>) =>
    setConfig((c) => ({ ...c, ...p }));

  return (
    <div className="overview-page">
      <header className="overview-header">
        <div>
          <button type="button" className="btn-ghost" onClick={onBack}>
            ← Quay lại
          </button>
          <h1>Xem tổng quan</h1>
          <p className="overview-sub">
            Số liệu thật + kéo thanh trượt — thấy ngay ai thắng, ai trả giá khi đăng cai
            World Cup.
          </p>
        </div>
        <div className="overview-header-actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setShowFacts((v) => !v)}
          >
            {showFacts ? "Ẩn số liệu thật" : "Hiện số liệu thật"}
          </button>
          {onPlayTurnBased ? (
            <button type="button" className="btn-primary" onClick={onPlayTurnBased}>
              Chơi mô phỏng 9 lượt →
            </button>
          ) : null}
        </div>
      </header>

      {showFacts ? <FactsPanel liveHostCostB={outcome.hostCostUsd} /> : null}

      <section className="ov-timeline panel">
        <p className="ov-narrative">{outcome.narrative}</p>
        <div className="ov-timeline-row">
          {outcome.timeline.map((phase) => (
            <div
              key={phase.year}
              className={`ov-timeline-item mood-${phase.mood}`}
              title={phase.caption}
            >
              <div className="ov-tl-icon">{phase.icon}</div>
              <div className="ov-tl-year">{phase.year}</div>
              <div className="ov-tl-label">{phase.label}</div>
              <div className="ov-tl-caption">{phase.caption}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="overview-grid">
        <aside className="panel ov-controls">
          <h2>Thiết lập kịch bản đăng cai</h2>

          <div className="ov-presets">
            {OVERVIEW_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="ov-preset-btn"
                onClick={() => setConfig(p.config)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <h3 className="ov-section">Ngân sách & Nhà nước</h3>
          <Slider
            label="Đầu tư hạ tầng"
            value={config.infrastructure}
            onChange={(v) => patch({ infrastructure: v })}
            hint="Cao = sân mới + metro (Qatar) · Thấp = tái sử dụng (Đức / 2026)"
          />
          <Slider
            label="Tư nhân tham gia"
            value={config.publicPrivate}
            onChange={(v) => patch({ publicPrivate: v })}
            hint="Cao = PPP, lợi nhuận tập trung ít người"
          />
          <Slider
            label="Chi an sinh xã hội"
            value={config.socialSpend}
            onChange={(v) => patch({ socialSpend: v })}
            hint="Nhà ở, y tế, lương — đối trọng với chi World Cup"
          />

          <h3 className="ov-section">Xã hội & Lao động</h3>
          <Slider
            label="Ưu tiên du lịch / thương hiệu"
            value={config.tourismFocus}
            onChange={(v) => patch({ tourismFocus: v })}
            hint="Soft power & cú sốc cầu ngắn hạn"
          />
          <Slider
            label="Bảo vệ người lao động"
            value={config.laborProtection}
            onChange={(v) => patch({ laborProtection: v })}
            hint="Thấp = rủi ro kiểu Qatar / tăng ca deadline"
          />

          <h3 className="ov-section">FIFA & Toàn cầu hóa</h3>
          <div className="team-selector">
            {([32, 48] as const).map((n) => (
              <button
                key={n}
                type="button"
                className={`team-btn ${config.teams === n ? "active" : ""}`}
                onClick={() => patch({ teams: n })}
              >
                {n} đội
              </button>
            ))}
          </div>
          <div className="slider-hint team-hint">
            FIFA chính thức: 32 đội (64 trận) → 48 đội / 104 trận từ WC 2026.
          </div>
          <Slider
            label="Suất vòng loại châu Á"
            value={config.asiaSlots}
            min={4}
            max={8}
            onChange={(v) => patch({ asiaSlots: v })}
            hint="4 suất (32 đội) → 8 suất (48 đội, WC 2026)"
          />
          <Slider
            label="Ưu tiên thị trường Trung Quốc"
            value={config.chinaPriority}
            onChange={(v) => patch({ chinaPriority: v })}
            hint="TV, sponsor, 1.4 tỷ người — logic mở rộng của FIFA"
          />
        </aside>

        <main className="panel ov-outcomes">
          <h2>Kết quả dự báo</h2>

          <div className="ov-tags">
            {outcome.tags.map((t) => (
              <span key={t} className="ov-tag">
                {t}
              </span>
            ))}
          </div>

          <div className="ov-metrics-grid">
            <MetricBar
              label="Lợi ích kinh tế"
              value={outcome.economicBenefit}
              hint="Du lịch, FDI, việc làm tạm — thường ngắn hạn"
            />
            <MetricBar
              label="Hài hòa xã hội"
              value={outcome.socialHarmony}
              hint="An sinh & ổn định — ai trả chi phí?"
            />
            <MetricBar
              label="Di sản hạ tầng"
              value={outcome.infrastructureLegacy}
              hint="Metro còn dùng vs sân trắng"
            />
            <MetricBar
              label="Thương hiệu quốc gia"
              value={outcome.nationalBrand}
              hint="Soft power / quyền lực mềm"
            />
          </div>

          <div className="ov-split-cards">
            <div className="ov-mini-card benefit">
              <div className="ov-mini-label">FIFA thu (chu kỳ 4 năm)</div>
              <div className="ov-mini-value">{formatUsdB(outcome.fifaRevenue)}</div>
              <div className="ov-metric-hint">
                Docs: FIFA thường ~$7–9B/chu kỳ → dự kiến ~$11B (2023–2026)
              </div>
            </div>
            <div className="ov-mini-card cost">
              <div className="ov-mini-label">Chi phí nước chủ nhà</div>
              <div className="ov-mini-value">{formatUsdB(outcome.hostCostUsd)}</div>
              <div className="ov-metric-hint">
                Nam Phi $3.6B · Brazil $15B · Nga $11.6B · Qatar $220B*
              </div>
            </div>
            <div className="ov-mini-card risk">
              <div className="ov-mini-label">Rủi ro biểu tình</div>
              <div className="ov-mini-value">{outcome.protestRisk.toFixed(0)}%</div>
            </div>
            <div className="ov-mini-card risk">
              <div className="ov-mini-label">Sân trắng</div>
              <div className="ov-mini-value">
                {outcome.whiteElephantRisk.toFixed(0)}%
              </div>
            </div>
          </div>

          <section className="ov-lens panel-inner">
            <h3>Góc nhìn Mác–Lênin</h3>
            <p className="ov-lens-dominant">
              Nổi bật: <strong>{outcome.marxistLens.dominant}</strong>
            </p>
            <LensBar
              label="Duy vật lịch sử"
              value={Math.round(outcome.marxistLens.historicalMaterialism)}
            />
            <LensBar
              label="Phân tích giai cấp"
              value={Math.round(outcome.marxistLens.classAnalysis)}
            />
            <LensBar
              label="Biện chứng"
              value={Math.round(outcome.marxistLens.dialecticalMethod)}
            />
            <p className="ov-lens-summary">{outcome.marxistLens.summary}</p>
            <MetricBar
              label="Bất bình đẳng phân phối"
              value={outcome.inequalityIndex}
              invert
              hint="Cao = FIFA/tư bản thắng — lao động & dân nước chủ nhà trả giá"
            />
          </section>

          <section className="ov-echo panel-inner">
            <h3>Giống case thực tế nhất</h3>
            <div className="ov-echo-primary">
              <div className="ov-echo-match">{outcome.realWorldEcho.match}% khớp</div>
              <div>
                <strong>
                  {outcome.realWorldEcho.name} ({outcome.realWorldEcho.year})
                </strong>
                <p>
                  {outcome.realWorldEcho.blurb}
                  {outcome.realWorldEcho.hostCostUsd != null
                    ? ` · Chi phí: ~${formatUsdB(
                        outcome.realWorldEcho.hostCostUsd,
                        outcome.realWorldEcho.hostCostUsd % 1 === 0 ? 0 : 1,
                      )}`
                    : ""}
                </p>
              </div>
            </div>
            <div className="ov-echo-list">
              {outcome.secondaryEchoes.map((c) => (
                <div key={c.id} className="ov-echo-item">
                  <span className="mono">{c.match}%</span>
                  <span>
                    {c.name} — {c.blurb}
                  </span>
                </div>
              ))}
            </div>
            <p className="ov-sources">Nguồn: {DATA_SOURCES.join(" · ")}</p>
          </section>
        </main>
      </div>
    </div>
  );
}
