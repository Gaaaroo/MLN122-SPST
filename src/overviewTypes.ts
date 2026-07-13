export interface OverviewConfig {
  infrastructure: number;
  publicPrivate: number;
  socialSpend: number;
  tourismFocus: number;
  laborProtection: number;
  teams: 32 | 48;
  asiaSlots: number;
  chinaPriority: number;
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
  narrative: string;
  timeline: TimelinePhase[];
  marxistLens: MarxistAlignment;
  realWorldEcho: RealWorldCase;
  secondaryEchoes: RealWorldCase[];
}

export interface TimelinePhase {
  year: string;
  label: string;
  icon: string;
  mood: "good" | "mixed" | "bad";
  caption: string;
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
  teams: 32,
  asiaSlots: 4,
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
      teams: 32,
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
      teams: 32,
      asiaSlots: 4,
      chinaPriority: 25,
    },
  },
  {
    id: "qatar",
    label: "Kiểu Qatar 2022",
    config: {
      infrastructure: 95,
      publicPrivate: 80,
      socialSpend: 20,
      tourismFocus: 85,
      laborProtection: 15,
      teams: 32,
      asiaSlots: 4,
      chinaPriority: 35,
    },
  },
  {
    id: "fifa-max",
    label: "FIFA tối đa (48 đội)",
    config: {
      infrastructure: 75,
      publicPrivate: 60,
      socialSpend: 35,
      tourismFocus: 80,
      laborProtection: 40,
      teams: 48,
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
      teams: 32,
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
      teams: 48,
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
    blurb:
      "Tái sử dụng sân; chiến dịch soft power 'Thế giới làm khách' — đổi hình ảnh cứng nhắc thành thân thiện. Docs không ghi một tổng chi phí duy nhất.",
  },
  {
    id: "south-africa-2010",
    name: "Nam Phi 2010",
    year: "2010",
    match: 0,
    hostCostUsd: 3.6,
    blurb:
      "Chi ~$3.6B. Kỳ vọng lợi ích $6–12B → thực tế ~$0.3B. Durban tắc đường; Cape Town ế khách cả thập kỷ.",
  },
  {
    id: "brazil-2014",
    name: "Brazil 2014",
    year: "2014",
    match: 0,
    hostCostUsd: 15.0,
    blurb:
      "~$15B, lạm phát 6.5%, ~250.000 người di dời. Arena da Amazônia = voi trắng giữa rừng Amazon.",
  },
  {
    id: "russia-2018",
    name: "Nga 2018",
    year: "2018",
    match: 0,
    hostCostUsd: 11.6,
    blurb:
      "~$11.6B. 11 sân bay nâng cấp. Saint Petersburg đội vốn sân ~540%. Chặn >25 triệu tấn công mạng.",
  },
  {
    id: "qatar-2022",
    name: "Qatar 2022",
    year: "2022",
    match: 0,
    hostCostUsd: 220.0,
    blurb:
      "~$220B (metro $36B, Lusail $45B, sân ~$7B). Soft power Vision 2030 — sân 974 lời hứa tháo dỡ chưa thành.",
  },
  {
    id: "wc-2026",
    name: "Mỹ–Mexico–Canada 2026",
    year: "2026",
    match: 0,
    blurb:
      "16 sân có sẵn (11+3+2), 48 đội, Mỹ ~78 trận. FIFA dự thu ~$11B. Oxford: GDP Mỹ +$17.2B; liên minh ~$40.9B (dự phóng — không phải hóa đơn xây sân).",
  },
];
