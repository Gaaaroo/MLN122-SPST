import { useMemo, useState } from 'react';
import { computeOverview } from '../overviewLogic';
import {
  DEFAULT_OVERVIEW,
  OVERVIEW_PRESETS,
  type MetricExplanation,
  type OverviewConfig,
} from '../overviewTypes';
import {
  formatUsdB,
  TEAM_EXPANSION_BENEFITS,
} from '../realWorldData';
import FactsPanel from './FactsPanel';
import MlnChatBot from './MlnChatBot';
import { Slider } from './Slider';

interface Props {
  initial?: Partial<OverviewConfig>;
  onBack: () => void;
  onPlayGame?: () => void;
}

function WhyHint({ explain }: { explain: MetricExplanation }) {
  return (
    <span
      className='ov-why'
      tabIndex={0}
      role='button'
      aria-label={`Vì sao ${explain.label}`}
    >
      <span className='ov-why-trigger'>Vì sao?</span>
      <span
        className='ov-why-pop'
        role='tooltip'
      >
        <span className='ov-why-title'>{explain.label}</span>
        <span className='ov-why-summary'>{explain.summary}</span>
        <span className='ov-why-drivers'>
          {explain.drivers.map((d) => (
            <span
              key={d.input}
              className={`ov-why-driver ov-why-${d.direction === 'tăng' ? 'up' : 'down'}`}
            >
              <span className='ov-why-tag'>
                {d.direction === 'tăng' ? 'Làm tăng' : 'Làm giảm'}
              </span>
              <span className='ov-why-driver-text'>
                <strong>{d.input}:</strong> {d.detail}
              </span>
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

function MetricBar({
  label,
  value,
  hint,
  invert,
  explain,
}: {
  label: string;
  value: number;
  hint?: string;
  invert?: boolean;
  explain?: MetricExplanation;
}) {
  // Bar luôn chạy đúng giá trị; `invert` chỉ đảo màu (giá trị cao = xấu = đỏ).
  const goodness = invert ? 100 - value : value;
  const color =
    goodness >= 65
      ? 'var(--green)'
      : goodness >= 40
        ? 'var(--yellow)'
        : 'var(--red)';

  return (
    <div className='ov-metric'>
      <div className='ov-metric-head'>
        <span className='ov-metric-label'>
          {label}
          {explain ? <WhyHint explain={explain} /> : null}
        </span>
        <span className='mono'>{Math.round(value)} / 100</span>
      </div>
      <div className='ov-bar-track'>
        <div
          className='ov-bar-fill'
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      {hint ? <div className='ov-metric-hint'>{hint}</div> : null}
    </div>
  );
}

function LensBar({ label, value }: { label: string; value: number }) {
  return (
    <div className='ov-lens-row'>
      <span className='ov-lens-label'>{label}</span>
      <div className='ov-bar-track ov-lens-track'>
        <div
          className='ov-bar-fill'
          style={{ width: `${value}%` }}
        />
      </div>
      <span className='mono ov-lens-val'>{value}</span>
    </div>
  );
}

export default function OverviewPanel({ initial, onBack, onPlayGame }: Props) {
  const [config, setConfig] = useState<OverviewConfig>({
    ...DEFAULT_OVERVIEW,
    ...initial,
  });
  const [showFacts, setShowFacts] = useState(true);

  const outcome = useMemo(() => computeOverview(config), [config]);

  const explainById = useMemo(() => {
    const map = new Map<string, MetricExplanation>();
    for (const item of outcome.metricExplanations) map.set(item.id, item);
    return map;
  }, [outcome.metricExplanations]);

  const patch = (p: Partial<OverviewConfig>) =>
    setConfig((c) => ({ ...c, ...p }));

  return (
    <div className='overview-page'>
      <header className='overview-header'>
        <div>
          <button
            type='button'
            className='btn-ghost'
            onClick={onBack}
          >
            ← Quay lại
          </button>
          <h1>Xem tổng quan</h1>
          <p className='overview-sub'>
            Kéo các thanh trượt bên trái và xem kết quả đổi theo — ai được lợi,
            ai phải trả giá khi đăng cai World Cup.
          </p>
        </div>
        <div className='overview-header-actions'>
          {onPlayGame && (
            <button
              type='button'
              className='btn-ghost'
              onClick={onPlayGame}
            >
              🎲 Chơi cờ tỷ phú
            </button>
          )}
          <button
            type='button'
            className='btn-ghost'
            onClick={() => setShowFacts((v) => !v)}
          >
            {showFacts ? 'Ẩn số liệu thật' : 'Hiện số liệu thật'}
          </button>
        </div>
      </header>

      <section className='ov-mln-banner'>
        <span
          className='ov-mln-banner-icon'
          aria-hidden='true'
        >
          ⚖️
        </span>
        <div className='ov-mln-banner-text'>
          <h2>Nhìn các con số này theo Kinh tế chính trị Mác–Lênin</h2>
          <p>
            Mọi con số bên dưới đều xoay quanh một câu hỏi:{' '}
            <strong>ai làm ra của cải, ai sở hữu, ai hưởng, ai trả?</strong>
          </p>
        </div>
      </section>

      {showFacts ? <FactsPanel /> : null}

      <div className='overview-grid'>
        <aside className='panel ov-controls'>
          <h2>Thiết lập kịch bản đăng cai</h2>

          <div className='ov-presets'>
            {OVERVIEW_PRESETS.map((p) => (
              <button
                key={p.id}
                type='button'
                className='ov-preset-btn'
                onClick={() => setConfig(p.config)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <h3 className='ov-section'>Ngân sách & Nhà nước</h3>
          <Slider
            label='Đầu tư hạ tầng'
            value={config.infrastructure}
            onChange={(v) => patch({ infrastructure: v })}
            hint='Kéo cao thì xây mới sân và tàu điện như Qatar; kéo thấp thì tận dụng sân có sẵn như Đức hay 2026.'
          />
          <Slider
            label='Tư nhân tham gia'
            value={config.publicPrivate}
            onChange={(v) => patch({ publicPrivate: v })}
            hint='Càng cao thì tư nhân nắm càng nhiều, lợi nhuận dồn vào số ít người.'
          />
          <Slider
            label='Chi an sinh xã hội'
            value={config.socialSpend}
            onChange={(v) => patch({ socialSpend: v })}
            hint='Tiền cho nhà ở, y tế, lương — phần đối trọng với tiền đổ vào World Cup.'
          />

          <h3 className='ov-section'>Xã hội & Lao động</h3>
          <Slider
            label='Ưu tiên du lịch / thương hiệu'
            value={config.tourismFocus}
            onChange={(v) => patch({ tourismFocus: v })}
            hint='Càng cao thì càng lo đánh bóng hình ảnh và hút khách trong mùa giải.'
          />
          <Slider
            label='Bảo vệ người lao động'
            value={config.laborProtection}
            onChange={(v) => patch({ laborProtection: v })}
            hint='Kéo thấp thì công nhân dễ bị ép tiến độ, làm việc trong điều kiện tệ như ở Qatar.'
          />

          <h3 className='ov-section'>FIFA & Toàn cầu hóa</h3>
          <div className='ov-expansion-callout'>
            <h4>{TEAM_EXPANSION_BENEFITS.title}</h4>
            <ul>
              {TEAM_EXPANSION_BENEFITS.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <Slider
            label='Suất vòng loại châu Á'
            value={config.asiaSlots}
            min={4}
            max={8}
            onChange={(v) => patch({ asiaSlots: v })}
            hint='Số vé cho châu Á: thời 32 đội có 4,5 suất (4 + play-off), từ World Cup 2026 tăng lên 8,33 suất.'
          />
          <Slider
            label='Ưu tiên thị trường Trung Quốc'
            value={config.chinaPriority}
            onChange={(v) => patch({ chinaPriority: v })}
            hint='Trung Quốc 1,4 tỷ dân là thị trường quảng cáo và bản quyền béo bở mà FIFA muốn khai thác.'
          />
        </aside>

        <main className='panel ov-outcomes'>
          <h2>Kết quả dự báo</h2>
          <p className='ov-outcomes-lead'>
            Kết quả đổi ngay khi bạn kéo thanh trượt. Đưa chuột vào chữ{' '}
            <strong>Vì sao?</strong> ở mỗi ô để đọc giải thích ngắn gọn.
          </p>

          <div className='ov-tags'>
            {outcome.tags.map((t) => (
              <span
                key={t}
                className='ov-tag'
              >
                {t}
              </span>
            ))}
          </div>

          <div className='ov-metrics-grid'>
            <MetricBar
              label='Lợi ích kinh tế'
              value={outcome.economicBenefit}
              hint='Tiền từ du lịch, đầu tư, việc làm — phần lớn chỉ được trong ngắn hạn.'
              explain={explainById.get('economicBenefit')}
            />
            <MetricBar
              label='Hài hòa xã hội'
              value={outcome.socialHarmony}
              hint='Người dân có được lo hay không, ai là người trả tiền.'
              explain={explainById.get('socialHarmony')}
            />
            <MetricBar
              label='Di sản hạ tầng'
              value={outcome.infrastructureLegacy}
              hint='Sân và tàu điện còn dùng lâu dài hay bị bỏ không.'
              explain={explainById.get('infrastructureLegacy')}
            />
            <MetricBar
              label='Thương hiệu quốc gia'
              value={outcome.nationalBrand}
              hint='Hình ảnh đất nước đẹp lên trong mắt thế giới.'
              explain={explainById.get('nationalBrand')}
            />
          </div>

          <div className='ov-split-cards'>
            <div className='ov-mini-card benefit'>
              <div className='ov-mini-label'>
                FIFA thu (mỗi kỳ)
                {explainById.get('fifaRevenue') ? (
                  <WhyHint explain={explainById.get('fifaRevenue')!} />
                ) : null}
              </div>
              <div className='ov-mini-value'>
                {formatUsdB(outcome.fifaRevenue)}
              </div>
            </div>
            <div className='ov-mini-card cost'>
              <div className='ov-mini-label'>
                Chi phí nước chủ nhà
                {explainById.get('hostCostUsd') ? (
                  <WhyHint explain={explainById.get('hostCostUsd')!} />
                ) : null}
              </div>
              <div className='ov-mini-value'>
                {formatUsdB(outcome.hostCostUsd)}
              </div>
            </div>
            <div className='ov-mini-card risk'>
              <div className='ov-mini-label'>
                Rủi ro biểu tình
                {explainById.get('protestRisk') ? (
                  <WhyHint explain={explainById.get('protestRisk')!} />
                ) : null}
              </div>
              <div className='ov-mini-value'>
                {outcome.protestRisk.toFixed(0)}%
              </div>
            </div>
            <div className='ov-mini-card risk'>
              <div className='ov-mini-label'>
                Sân bỏ không
                {explainById.get('whiteElephantRisk') ? (
                  <WhyHint explain={explainById.get('whiteElephantRisk')!} />
                ) : null}
              </div>
              <div className='ov-mini-value'>
                {outcome.whiteElephantRisk.toFixed(0)}%
              </div>
            </div>
          </div>

          <p className='ov-mln-contrast'>
            <span className='ov-mln-contrast-tag'>Cán cân giai cấp</span>
            FIFA và giới đầu tư đứng bên <strong>thu</strong>; nước chủ nhà,
            người đóng thuế và người lao động đứng bên <strong>trả</strong>.
            Khoảng cách đó chính là bất bình đẳng phân phối.
          </p>

          <section className='ov-lens panel-inner'>
            <h3>Góc nhìn Mác–Lênin</h3>
            <p className='ov-lens-dominant'>
              Nổi bật: <strong>{outcome.marxistLens.dominant}</strong>
            </p>
            <LensBar
              label='Duy vật lịch sử'
              value={Math.round(outcome.marxistLens.historicalMaterialism)}
            />
            <LensBar
              label='Phân tích giai cấp'
              value={Math.round(outcome.marxistLens.classAnalysis)}
            />
            <LensBar
              label='Biện chứng'
              value={Math.round(outcome.marxistLens.dialecticalMethod)}
            />
            <p className='ov-lens-summary'>{outcome.marxistLens.summary}</p>
            <MetricBar
              label='Bất bình đẳng phân phối'
              value={outcome.inequalityIndex}
              invert
              hint='Càng cao thì FIFA và giới đầu tư càng hưởng nhiều, người lao động và dân chịu thiệt.'
              explain={explainById.get('inequalityIndex')}
            />
          </section>

          <section className='ov-echo panel-inner'>
            <h3>Giống nước nào ngoài đời nhất</h3>
            <div className='ov-echo-primary'>
              <div className='ov-echo-match'>
                Giống {outcome.realWorldEcho.match}%
              </div>
              <div>
                <strong>
                  {outcome.realWorldEcho.name} ({outcome.realWorldEcho.year})
                </strong>
                <p>
                  {outcome.realWorldEcho.blurb}
                  {outcome.realWorldEcho.hostCostUsd != null
                    ? ` Chi phí khoảng ${formatUsdB(
                        outcome.realWorldEcho.hostCostUsd,
                        outcome.realWorldEcho.hostCostUsd % 1 === 0 ? 0 : 1,
                      )}.`
                    : ''}
                </p>
              </div>
            </div>
            <div className='ov-echo-list'>
              {outcome.secondaryEchoes.map((c) => (
                <div
                  key={c.id}
                  className='ov-echo-item'
                >
                  <span className='mono'>{c.match}%</span>
                  <span>
                    {c.name} — {c.blurb}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <MlnChatBot outcome={outcome} />
    </div>
  );
}
