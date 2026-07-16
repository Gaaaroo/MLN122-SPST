import {
  FIFA_REVENUE,
  formatUsdB,
  HOST_COST_BY_EDITION,
} from "../realWorldData";

interface Props {
  onExplore: () => void;
}

export function LandingScreen({ onExplore }: Props) {
  return (
    <div className="landing">
      <p className="landing-kicker">MLN122 · Kinh tế chính trị · World Cup</p>
      <h1>
        Hostia <span>2034</span>
      </h1>
      <p className="subtitle">
        Một tháng bóng đá. Hàng chục — thậm chí hàng trăm — tỷ đô. FIFA thu bản quyền;
        nước chủ nhà trả sân, metro, an ninh. Ai thắng thật?
      </p>

      <div className="landing-stats" aria-label="Chi phí đăng cai theo kỳ">
        <div className="landing-stat">
          <span className="landing-stat-num">
            {formatUsdB(HOST_COST_BY_EDITION.SOUTH_AFRICA_2010)}
          </span>
          <span className="landing-stat-label">Nam Phi 2010</span>
        </div>
        <div className="landing-stat">
          <span className="landing-stat-num">
            {formatUsdB(HOST_COST_BY_EDITION.BRAZIL_2014, 0)}
          </span>
          <span className="landing-stat-label">Brazil 2014</span>
        </div>
        <div className="landing-stat">
          <span className="landing-stat-num">
            {formatUsdB(HOST_COST_BY_EDITION.QATAR_2022_TOTAL, 0)}
          </span>
          <span className="landing-stat-label">Qatar 2022*</span>
        </div>
        <div className="landing-stat highlight">
          <span className="landing-stat-num">
            {formatUsdB(FIFA_REVENUE.CYCLE_2023_2026_PROJECTED, 0)}
          </span>
          <span className="landing-stat-label">FIFA dự thu 2026</span>
        </div>
      </div>
      <p className="landing-stat-note">
        *Qatar gồm metro, sân bay, thành phố mới — không chỉ sân bóng.
      </p>

      <div className="landing-actions">
        <button type="button" className="btn-primary" onClick={onExplore}>
          Khám phá số liệu + kéo slider
        </button>
      </div>
      <p className="landing-hint">
        Đọc case thật (Đức → Qatar → 2026), kéo slider — xem ai thắng, ai trả trên bảng phân
        phối.
      </p>
      <p className="footer-note">
        Soft power · Sân trắng (voi trắng) · Nhượng quyền FIFA · 48 đội 2026
      </p>
    </div>
  );
}
