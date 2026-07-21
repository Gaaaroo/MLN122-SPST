export interface OverviewConfig {
  infrastructure: number;
  publicPrivate: number;
  socialSpend: number;
  tourismFocus: number;
  laborProtection: number;
  asiaSlots: number;
  chinaPriority: number;
}

export interface MetricDriver {
  input: string;
  direction: "tăng" | "giảm";
  detail: string;
}

export interface MetricExplanation {
  id: string;
  label: string;
  summary: string;
  drivers: MetricDriver[];
}

export interface OverviewOutcome {
  economicBenefit: number;
  socialHarmony: number;
  infrastructureLegacy: number;
  nationalBrand: number;
  /** Doanh thu FIFA chu kỳ 4 năm (tỷ USD) — theo FIFA Annual Report */
  fifaRevenue: number;
  /** Chỉ số gánh nặng tương đối 0–100 */
  hostBurden: number;
  /** Chi phí đăng cai ước tính (tỷ USD) — theo Statista */
  hostCostUsd: number;
  protestRisk: number;
  whiteElephantRisk: number;
  inequalityIndex: number;
  dialecticBalance: number;
  tags: string[];
  marxistLens: MarxistAlignment;
  realWorldEcho: RealWorldCase;
  secondaryEchoes: RealWorldCase[];
  metricExplanations: MetricExplanation[];
}

export interface MarxistAlignment {
  historicalMaterialism: number;
  classAnalysis: number;
  dialecticalMethod: number;
  dominant: string;
  summary: string;
}

export interface RealWorldCase {
  id: string;
  name: string;
  year: string;
  match: number;
  blurb: string;
  /** Chi phí đăng cai (tỷ USD) — chỉ khi docs có số rõ */
  hostCostUsd?: number;
}

export interface OverviewPreset {
  id: string;
  label: string;
  config: OverviewConfig;
}

export const DEFAULT_OVERVIEW: OverviewConfig = {
  infrastructure: 50,
  publicPrivate: 50,
  socialSpend: 50,
  tourismFocus: 50,
  laborProtection: 50,
  asiaSlots: 6,
  chinaPriority: 40,
};

export const OVERVIEW_PRESETS: OverviewPreset[] = [
  {
    id: "germany",
    label: "Kiểu Đức 2006",
    config: {
      infrastructure: 35,
      publicPrivate: 25,
      socialSpend: 65,
      tourismFocus: 55,
      laborProtection: 70,
      asiaSlots: 4,
      chinaPriority: 20,
    },
  },
  {
    id: "brazil",
    label: "Kiểu Brazil 2014",
    config: {
      infrastructure: 85,
      publicPrivate: 55,
      socialSpend: 25,
      tourismFocus: 70,
      laborProtection: 30,
      asiaSlots: 4,
      chinaPriority: 25,
    },
  },
  {
    id: "qatar",
    label: "Kiểu Qatar 2022",
    config: {
      infrastructure: 95,
      publicPrivate: 30,
      socialSpend: 20,
      tourismFocus: 85,
      laborProtection: 15,
      asiaSlots: 4,
      chinaPriority: 35,
    },
  },
  {
    id: "fifa-max",
    label: "Mở rộng thị trường châu Á",
    config: {
      infrastructure: 75,
      publicPrivate: 60,
      socialSpend: 35,
      tourismFocus: 80,
      laborProtection: 40,
      asiaSlots: 8,
      chinaPriority: 85,
    },
  },
  {
    id: "people-first",
    label: "Ưu tiên người dân",
    config: {
      infrastructure: 30,
      publicPrivate: 20,
      socialSpend: 85,
      tourismFocus: 30,
      laborProtection: 80,
      asiaSlots: 4,
      chinaPriority: 30,
    },
  },
  {
    id: "wc2026",
    label: "Kiểu WC 2026 (3 nước)",
    config: {
      infrastructure: 40,
      publicPrivate: 55,
      socialSpend: 45,
      tourismFocus: 70,
      laborProtection: 55,
      asiaSlots: 8,
      chinaPriority: 50,
    },
  },
];

export const REAL_WORLD_CASES: RealWorldCase[] = [
  {
    id: "germany-2006",
    name: "Đức 2006",
    year: "2006",
    match: 0,
    hostCostUsd: 4.3,
    blurb:
      "Chi khoảng 4,3 tỷ (Statista), phần lớn dùng lại sân có sẵn. Chiến dịch 'Thế giới làm khách' đổi hình ảnh cứng nhắc thành thân thiện; du lịch lời khoảng 0,9 tỷ — một trong số ít kỳ gần đạt kỳ vọng.",
  },
  {
    id: "south-africa-2010",
    name: "Nam Phi 2010",
    year: "2010",
    match: 0,
    hostCostUsd: 3.6,
    blurb:
      "Chi khoảng 3,6 tỷ. Kỳ vọng lời 6–12 tỷ nhưng khách chỉ chi khoảng 0,5 tỷ (309.000 khách so với dự báo 483.000). Durban tắc đường, sân Cape Town ế khách cả chục năm.",
  },
  {
    id: "brazil-2014",
    name: "Brazil 2014",
    year: "2014",
    match: 0,
    hostCostUsd: 15.0,
    blurb:
      "Khoảng 15 tỷ, lạm phát 6,5%, chừng 250.000 người bị di dời. Sân Arena da Amazônia thành sân bỏ hoang giữa rừng Amazon.",
  },
  {
    id: "russia-2018",
    name: "Nga 2018",
    year: "2018",
    match: 0,
    hostCostUsd: 11.6,
    blurb:
      "Khoảng 11,6 tỷ, nâng cấp 11 sân bay. Riêng sân ở Saint Petersburg đội vốn hơn 5 lần. Chặn hơn 25 triệu vụ tấn công mạng.",
  },
  {
    id: "qatar-2022",
    name: "Qatar 2022",
    year: "2022",
    match: 0,
    hostCostUsd: 220.0,
    blurb:
      "Khoảng 220 tỷ (tàu điện 36 tỷ, thành phố Lusail 45 tỷ, sân khoảng 7 tỷ). Dùng giải để quảng bá đất nước; sân 974 hứa tháo dỡ nhưng chưa làm.",
  },
  {
    id: "wc-2026",
    name: "Mỹ–Mexico–Canada 2026",
    year: "2026",
    match: 0,
    blurb:
      "16 sân có sẵn (Mỹ 11, Mexico 3, Canada 2), 48 đội, Mỹ tổ chức khoảng 78 trận. FIFA dự thu 11 tỷ, sau giải công bố vượt 15 tỷ. Nghiên cứu do FIFA đặt làm dự báo GDP Mỹ tăng 17,2 tỷ, toàn cầu 40,9 tỷ — giới phân tích độc lập cho là con số bị thổi phồng.",
  },
];
