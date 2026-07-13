import { getCountry, getVictoryStatus } from "../gameLogic";
import { formatUsdB } from "../realWorldData";
import type { HostState } from "../types";

interface Props {
  host: HostState;
  onPlayFifa: () => void;
  onReplay: () => void;
}

export function HostResultScreen({ host, onPlayFifa, onReplay }: Props) {
  const country = getCountry(host.countryId);
  const victory = getVictoryStatus(host, country.startDebt);

  return (
    <div className="result-page">
      <h2>Báo cáo đăng cai — {country.name}</h2>
      <p className="result-lead">
        {victory.allOk
          ? "Cân bằng được lợi ích & tác hại — hiếm khi dễ trong thực tế."
          : "Kết quả hỗn hợp — phản ánh trade-off thực tế của siêu sự kiện."}
      </p>

      <div className="result-card">
        <h3>Chỉ số cuối</h3>
        <ul>
          <li>Di sản: {host.legacy.toFixed(0)}/100</li>
          <li>Ổn định: {host.stability.toFixed(0)}%</li>
          <li>Nợ công: {host.debt.toFixed(1)}% GDP</li>
          <li>Tâm lý dân chúng: {host.publicMood.toFixed(0)}%</li>
          <li>Rủi ro sân trắng: {host.whiteElephantRisk.toFixed(0)}%</li>
          <li>Tổng chi nước chủ nhà: {formatUsdB(host.totalSpent)}</li>
        </ul>
      </div>

      <div className="result-card">
        <h3>Bài học — Kinh tế chính trị</h3>
        <ul>
          <li>
            Đăng cai là <strong>tái phân bổ nguồn lực</strong>: FIFA + tư bản sự kiện thu
            lợi; lao động & người đóng thuế nước chủ nhà gánh sân–an ninh–nợ.
          </li>
          <li>
            Mâu thuẫn biện chứng: hạ tầng ↔ nợ, soft power ↔ an sinh, deadline FIFA ↔ quyền
            lao động (Brazil 2014, Qatar 2022).
          </li>
          <li>
            Kỳ vọng đấu thầu thường tô hồng (Nam Phi: kỳ vọng tỷ đô → thực tế ~$0.3B) —
            nhìn tâm lý dân chúng và sân trắng, không chỉ GDP.
          </li>
        </ul>
      </div>

      <div className="result-actions">
        <button type="button" className="btn-primary" onClick={onPlayFifa}>
          Đổi góc nhìn → Bạn là FIFA
        </button>
        <button type="button" className="btn-ghost" onClick={onReplay}>
          Chơi lại
        </button>
      </div>
    </div>
  );
}
