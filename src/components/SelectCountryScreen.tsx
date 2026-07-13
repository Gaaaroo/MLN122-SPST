import { COUNTRIES } from "../types";
import type { CountryId } from "../types";

interface Props {
  onBack: () => void;
  onSelect: (id: CountryId) => void;
}

export function SelectCountryScreen({ onBack, onSelect }: Props) {
  return (
    <div className="select-page">
      <button type="button" className="btn-ghost" onClick={onBack}>
        ← Quay lại
      </button>
      <h2>Chọn quốc gia đăng cai</h2>
      <p className="hint">
        Ba profile lấy cảm hứng từ case thật: Nam Phi/Brazil · Đức/Bắc Mỹ · Qatar. Điểm
        xuất phát khác → trade-off khác khi đầu tư World Cup.
      </p>
      <div className="country-grid">
        {COUNTRIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className="country-card"
            onClick={() => onSelect(c.id)}
          >
            <div className="flag" aria-hidden>
              {c.flag}
            </div>
            <h3>{c.name}</h3>
            <p>{c.description}</p>
            <div className="stats">
              Dân số {c.population} · Nợ {c.startDebt}% GDP
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
