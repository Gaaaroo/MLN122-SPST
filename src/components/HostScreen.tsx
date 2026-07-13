import {
  CAMERA_LABELS,
  getCameraLines,
  getCountry,
  getVictoryStatus,
  moodText,
} from "../gameLogic";
import { formatUsdB } from "../realWorldData";
import type { Camera, HostState, QuickAction, Stance } from "../types";
import { Slider } from "./Slider";

interface Props {
  host: HostState;
  showTimeToast: boolean;
  pendingEmergency: boolean;
  onPatch: (patch: Partial<HostState>) => void;
  onQuickAction: (action: QuickAction) => void;
  onEmergency: () => void;
  onConfirmTurn: () => void;
  onOpenOverview: () => void;
  onExit: () => void;
}

export function HostScreen({
  host,
  showTimeToast,
  pendingEmergency,
  onPatch,
  onQuickAction,
  onEmergency,
  onConfirmTurn,
  onOpenOverview,
  onExit,
}: Props) {
  const country = getCountry(host.countryId);
  const victory = getVictoryStatus(host, country.startDebt);
  const progress = ((host.turn - 1) / host.maxTurns) * 100;

  return (
    <div className="dashboard">
      {showTimeToast && (
        <div className="time-toast" role="status">
          Thời gian sắp hết — xác nhận lượt!
        </div>
      )}

      <div className="top-bar">
        <div>
          <span className="level">
            Lượt {host.turn}/{host.maxTurns} — {country.name}
          </span>
          <span
            className={`badge ${host.unstable ? "badge-unstable" : "badge-stable"}`}
          >
            {host.unstable ? "BẤT ỔN" : "ỔN ĐỊNH"}
          </span>
        </div>
        <div className="top-bar-actions">
          <div
            className={`timer-ring ${host.timer <= 8 ? "low" : ""}`}
            title="Thời gian mỗi lượt"
          >
            {host.timer}
          </div>
          <button type="button" className="btn-ghost" onClick={onOpenOverview}>
            Xem tổng quan
          </button>
          <button type="button" className="btn-ghost" onClick={onExit}>
            Thoát
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="section-label">Điều kiện thắng</div>
        <div className="victory-row">
          <div className={`victory-chip ${victory.legacyOk ? "ok" : "fail"}`}>
            <div className="label">Di sản</div>
            <div className="value">{host.legacy.toFixed(0)}</div>
            <div className="target">
              {victory.legacyOk ? "Đạt ≥ 70" : `Cần +${victory.legacyNeed.toFixed(0)}`}
            </div>
          </div>
          <div className={`victory-chip ${victory.stabilityOk ? "ok" : "fail"}`}>
            <div className="label">Ổn định XH</div>
            <div className="value">{host.stability.toFixed(0)}%</div>
            <div className="target">
              {victory.stabilityOk
                ? "Đạt ≥ 60%"
                : `Cần +${victory.stabilityNeed.toFixed(0)}%`}
            </div>
          </div>
          <div className={`victory-chip ${victory.fiscalOk ? "ok" : "fail"}`}>
            <div className="label">Nợ công</div>
            <div className="value">{host.debt.toFixed(1)}%</div>
            <div className="target">
              {victory.fiscalOk
                ? `≤ ${country.startDebt + 15}%`
                : `Vượt +${victory.fiscalNeed.toFixed(1)}%`}
            </div>
          </div>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="main-grid">
        <div className="panel">
          <div className="event-banner">{host.eventText}</div>

          <div className="metrics-grid">
            <div className="metric-card legacy">
              <div className="metric-label">Di sản hạ tầng</div>
              <div className="metric-value">{host.legacy.toFixed(0)}</div>
            </div>
            <div className="metric-card stability">
              <div className="metric-label">Ổn định xã hội</div>
              <div className="metric-value">{host.stability.toFixed(0)}%</div>
            </div>
            <div className="metric-card debt">
              <div className="metric-label">Nợ công</div>
              <div className="metric-value">{host.debt.toFixed(1)}%</div>
            </div>
            <div className="metric-card brand">
              <div className="metric-label">Thương hiệu & du lịch</div>
              <div className="metric-value">{host.brand.toFixed(0)}</div>
            </div>
          </div>

          <div className="sub-metrics">
            <div className="sub-pill">
              <span>Sân trắng: </span>
              {host.whiteElephantRisk.toFixed(0)}%
            </div>
            <div className="sub-pill">
              <span>FIFA: </span>
              {host.fifaSatisfaction.toFixed(0)}%
            </div>
            <div className="sub-pill">
              <span>Đã chi: </span>
              {formatUsdB(host.totalSpent)}
            </div>
            <div className="sub-pill">
              <span>Việc làm: </span>
              {host.jobs.toFixed(0)}K
            </div>
          </div>

          <div className="panel controls-panel">
            <h3>Chính sách đăng cai</h3>

            <div className="quick-actions">
              <button
                type="button"
                className="qa-btn mega"
                onClick={() => onQuickAction("mega")}
              >
                Xây mới tối đa
                <small>Sân + hạ tầng lớn — kiểu Qatar</small>
              </button>
              <button
                type="button"
                className="qa-btn reuse"
                onClick={() => onQuickAction("reuse")}
              >
                Tái sử dụng sân
                <small>Tiết kiệm — kiểu Đức / WC 2026</small>
              </button>
              <button
                type="button"
                className="qa-btn tourism"
                onClick={() => onQuickAction("tourism")}
              >
                Ưu tiên thương hiệu
                <small>Soft power & du lịch</small>
              </button>
              <button
                type="button"
                className="qa-btn austerity"
                onClick={() => onQuickAction("austerity")}
              >
                Thắt chặt chi
                <small>Giữ nợ, giảm đầu tư</small>
              </button>
            </div>

            <Slider
              label="Đầu tư hạ tầng"
              value={host.infrastructure}
              min={10}
              max={100}
              onChange={(v) => onPatch({ infrastructure: v })}
              hint="Cao = di sản lớn nhưng nợ & rủi ro sân trắng tăng"
            />
            <Slider
              label="Nhà nước ← → Tư nhân"
              value={host.publicPrivate}
              onChange={(v) => onPatch({ publicPrivate: v })}
              hint="Tư nhân: nhanh hơn, lợi nhuận tập trung"
            />
            <Slider
              label="An sinh ← → Hình ảnh quốc gia"
              value={host.socialPriority}
              onChange={(v) => onPatch({ socialPriority: v })}
              hint="Ưu tiên hình ảnh = soft power; ưu tiên an sinh = ổn định dân chúng"
            />

            <div className="stance-toggle">
              <button
                type="button"
                className={`stance-btn ${host.stance === "brand" ? "active" : ""}`}
                onClick={() => onPatch({ stance: "brand" as Stance })}
              >
                Thương hiệu quốc gia
              </button>
              <button
                type="button"
                className={`stance-btn ${host.stance === "people" ? "active" : ""}`}
                onClick={() => onPatch({ stance: "people" as Stance })}
              >
                Ưu tiên người dân
              </button>
            </div>

            <button
              type="button"
              className={`btn-emergency ${pendingEmergency ? "armed" : ""}`}
              disabled={host.emergencyUsed}
              onClick={onEmergency}
            >
              {pendingEmergency
                ? "Đã chọn: đẩy tiến độ (xác nhận lượt để áp dụng)"
                : "Đẩy nhanh tiến độ (khẩn cấp)"}
            </button>

            <button type="button" className="btn-next" onClick={onConfirmTurn}>
              Xác nhận lượt {host.turn} →
            </button>
          </div>
        </div>

        <div className="panel sidebar">
          <div className="mood-ring">
            <div className="mood-value">{host.publicMood.toFixed(0)}%</div>
            <div className="mood-label">
              Tâm lý dân chúng — {moodText(host.publicMood)}
            </div>
          </div>
          <div className="map-placeholder" aria-hidden>
            {country.flag}
          </div>

          <div className="section-label">4 góc nhìn — cùng sự kiện</div>
          <div className="camera-tabs">
            {(Object.keys(CAMERA_LABELS) as Camera[]).map((cam) => (
              <button
                key={cam}
                type="button"
                className={`cam-tab ${host.camera === cam ? "active" : ""}`}
                onClick={() => onPatch({ camera: cam })}
              >
                {CAMERA_LABELS[cam]}
              </button>
            ))}
          </div>
          <ul className="camera-text">
            {getCameraLines(host, host.camera).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
