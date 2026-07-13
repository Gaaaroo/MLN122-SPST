import { formatUsdB } from "../realWorldData";
import type { FifaState } from "../types";

interface Props {
  fifa: FifaState;
  onHome: () => void;
  onReplay: () => void;
}

export function FifaResultScreen({ fifa, onHome, onReplay }: Props) {
  return (
    <div className="result-page">
      <h2>Kết luận — Logic kinh tế FIFA</h2>

      <div className="result-card">
        <h3>Vì sao mở rộng 48 đội?</h3>
        <ul>
          <li>
            Nhiều đội = nhiều trận (+40: 64→104) →{" "}
            <strong>bản quyền TV & quảng cáo</strong> (FIFA dự thu chu kỳ 2026 ~$11B).
          </li>
          <li>Nhiều quốc gia dự → mở thị trường châu Á/Phi; suất AFC 4→8.</li>
          <li>
            Chi phí nước chủ nhà tăng — FIFA chỉ hỗ trợ khiêm tốn (~$0.4B cho 3 nước 2026),{" "}
            <strong>không trả</strong> sân/metro/an ninh.
          </li>
        </ul>
      </div>

      <div className="result-card">
        <h3>Vì sao muốn Trung Quốc tham gia?</h3>
        <ul>
          <li>Thị trường truyền hình & nhà tài trợ lớn nhất châu Á.</li>
          <li>Bóng đá chưa thâm nhập hết 1.4 tỷ người — tiềm năng tăng trưởng.</li>
          <li>
            Đăng cai / vào vòng chung kết = mở khóa FDI, du lịch, thương hiệu FIFA.
          </li>
        </ul>
      </div>

      <div className="result-card">
        <h3>Góc nhìn Mác–Lênin</h3>
        <ul>
          <li>
            FIFA (phi lợi nhuận trên giấy) vận hành theo logic{" "}
            <strong>tư bản hóa thể thao</strong> — tối đa hóa giá trị & thị trường.
          </li>
          <li>
            Lợi ích <strong>phân hóa theo giai cấp</strong>: FIFA & tư bản thu lợi, lao động
            & người dân nước chủ nhà chịu chi phí.
          </li>
          <li>
            Cần nhìn <strong>cả thành quả và mâu thuẫn</strong> — phương pháp biện chứng.
          </li>
        </ul>
      </div>

      <p className="result-footnote">
        Doanh thu FIFA: {formatUsdB(fifa.revenue)}/chu kỳ · {fifa.teams} đội · Ưu tiên TQ:{" "}
        {fifa.chinaPriority}% · Nguồn: FIFA Annual Report 2022, Statista
      </p>

      <div className="result-actions">
        <button type="button" className="btn-primary" onClick={onHome}>
          Về trang chủ
        </button>
        <button type="button" className="btn-ghost" onClick={onReplay}>
          Chơi lại từ đầu
        </button>
      </div>
    </div>
  );
}
