/**
 * Số liệu World Cup — chỉ giữ con số có trong docs dự án (MLN122).
 * Nguồn: docs/chi-phi-*.md, docs/world-cup-2026-*.md
 */

/** Doanh thu FIFA theo chu kỳ 4 năm (tỷ USD) — theo docs */
export const FIFA_REVENUE = {
  /** Docs: FIFA thường bỏ túi khoảng 7–9 tỷ mỗi chu kỳ */
  TYPICAL_LOW: 7.0,
  TYPICAL_HIGH: 9.0,
  /** Ngân sách / doanh thu dự kiến chu kỳ 2023–2026 (48 đội) */
  CYCLE_2023_2026_PROJECTED: 11.0,
  /** Mốc mô phỏng 32 đội (giữa khoảng 7–9) */
  BASE_32_TEAM: 7.0,
  BASE_48_TEAM: 11.0,
  /** Cơ cấu doanh thu WC 2026 (dự kiến, tỷ USD) */
  WC2026_TV: 4.2,
  WC2026_SPONSOR: 2.7,
  WC2026_TICKETS: 3.0,
  /** FIFA hỗ trợ 3 nước đăng cai 2026 */
  WC2026_HOST_SUPPORT: 0.4,
  WC2026_PRIZE_MONEY: 0.655,
} as const;

/**
 * Chi phí đăng cai có trong docs (tỷ USD).
 * Không gắn số “host cost tổng” cho Đức 2006 hay WC 2026 — docs không đưa một tổng duy nhất đáng tin.
 */
export const HOST_COST_BY_EDITION = {
  SOUTH_AFRICA_2010: 3.6,
  BRAZIL_2014: 15.0,
  RUSSIA_2018: 11.6,
  QATAR_2022_TOTAL: 220.0,
  /** ~6.5–7B sân — docs dùng cả hai; lấy 7B (7 sân mới + 1 nâng cấp) */
  QATAR_2022_STADIUMS: 7.0,
  QATAR_DOHA_METRO: 36.0,
  QATAR_LUSAIL_CITY: 45.0,
} as const;

/** Tác động kinh tế WC 2026 (dự phóng trong docs — không phải “chi phí đăng cai tổng”) */
export const WC2026_ECONOMIC = {
  FIFA_REVENUE_B: 11.0,
  USA_GDP_IMPACT_B: 17.2,
  ALLIANCE_TOTAL_B: 40.9,
  CANADA_DELOITTE_B: 2.7,
  MEXICO_DELOITTE_B: 4.05,
  FEDERAL_SECURITY_TRANSPORT_M: 625,
} as const;

/** Kỳ vọng vs thực tế — docs world-cup-2026 */
export const EXPECTATION_GAP = [
  {
    id: "korea-2002",
    name: "Hàn Quốc 2002",
    expectedB: 8.9,
    actualB: 1.35,
    note: "Thực tế chỉ ~15% kỳ vọng ban đầu.",
  },
  {
    id: "sa-2010",
    name: "Nam Phi 2010",
    expectedB: 9.0,
    expectedRange: "6–12 tỷ",
    actualB: 0.3,
    note: "Thấp hơn kỳ vọng 30–40 lần.",
  },
] as const;

export const FIFA_STADIUM_CAPACITY = {
  GROUP: 40_000,
  SEMI: 60_000,
  FINAL: 80_000,
  VIP_SEAT_WIDTH_CM: 60,
  NORMAL_SEAT_WIDTH_CM: 46,
  VIP_ROW_SPACING_CM: 90,
} as const;

export const BID_COST_M = { MIN: 50, MAX: 150 } as const;

export const ASIA_SLOTS = {
  ERA_32_TEAM: 4,
  ERA_48_TEAM: 8,
} as const;

export const TOURNAMENT_FORMAT = {
  TEAMS_32: 32,
  TEAMS_48: 48,
  MATCHES_32_TEAM: 64,
  MATCHES_48_TEAM: 104,
  MATCH_INCREASE: 40,
  MATCH_INCREASE_PCT: 62.5,
  WC2026_USA_MATCHES: 78,
  WC2026_PARTNER_MATCHES: 26,
  WC2026_STADIUMS: 16,
  WC2026_USA_STADIUMS: 11,
  WC2026_MEXICO_STADIUMS: 3,
  WC2026_CANADA_STADIUMS: 2,
} as const;

/** Docs: Qatar 2022 tiếp cận ~5 tỷ người */
export const VIEWERS_BILLIONS = {
  QATAR_2022: 5.0,
} as const;

export interface ShockFact {
  id: string;
  headline: string;
  detail: string;
  tag: string;
}

export const SHOCK_FACTS: ShockFact[] = [
  {
    id: "month-cost",
    headline: "1 tháng bóng đá = hàng trăm tỷ USD",
    detail:
      "Nam Phi 2010: $3.6B · Brazil 2014: $15B · Nga 2018: $11.6B · Qatar 2022: ~$220B (gồm metro, sân bay, thành phố mới).",
    tag: "Chi phí",
  },
  {
    id: "qatar-scale",
    headline: "$220B đủ mua Netflix + McDonald's + Nike + Disney",
    detail:
      "Hoặc tài trợ NASA (~$25B/năm) gần 9 năm — kể cả chương trình Mặt Trăng & sao Hỏa.",
    tag: "Qatar 2022",
  },
  {
    id: "fifa-model",
    headline: "FIFA nắm đằng chuôi — nước chủ nhà nắm đằng lưỡi",
    detail:
      "FIFA gom bản quyền TV, tài trợ, vé (ưu đãi thuế). Nước chủ nhà tự trả sân, giao thông, an ninh, y tế.",
    tag: "Mô hình",
  },
  {
    id: "winner-curse",
    headline: "Lời nguyền kẻ chiến thắng",
    detail:
      "Nam Phi từng kỳ vọng $6–12B lợi ích — thực tế ~$0.3B. Báo cáo đấu thầu tô hồng để thắng phiếu.",
    tag: "Kỳ vọng",
  },
  {
    id: "white-elephant",
    headline: "Sân trắng (white elephant)",
    detail:
      "Arena da Amazônia (Brazil): 44.000 chỗ giữa Amazon — sau giải gần như bỏ hoang, vẫn tốn bảo trì.",
    tag: "Di sản",
  },
  {
    id: "wc2026",
    headline: "2026: 3 nước · 16 sân có sẵn · 48 đội",
    detail:
      "Mỹ 11 sân, Mexico 3, Canada 2 — tái sử dụng NFL. FIFA dự thu ~$11B; Mỹ ôm ~75% số trận (78/104).",
    tag: "WC 2026",
  },
];

export interface CostCategory {
  id: string;
  title: string;
  icon: string;
  summary: string;
  example: string;
}

export const COST_CATEGORIES: CostCategory[] = [
  {
    id: "stadium",
    title: "Sân vận động",
    icon: "🏟️",
    summary:
      "FIFA đòi vòng bảng ≥40.000 chỗ, bán kết ≥60.000, chung kết ≥80.000 — kèm VIP, mái che, cỏ tự nhiên, spider cam.",
    example: "Qatar chi ~$7B chỉ cho 7 sân mới + 1 sân nâng cấp.",
  },
  {
    id: "transport",
    title: "Giao thông & đô thị",
    icon: "🚇",
    summary:
      "Thường tốn hơn cả sân: metro, sân bay, cao tốc. Mở cửa sân trước 3 tiếng — hàng vạn người đổ cùng lúc.",
    example: "Doha Metro ~$36B; Lusail xây từ sa mạc ~$45B.",
  },
  {
    id: "security",
    title: "An ninh & mạng",
    icon: "🛡️",
    summary:
      "Pháo đài quanh sân + tường lửa. Nga 2018: chặn >25 triệu cuộc tấn công mạng trong 1 tháng.",
    example:
      "Qatar thuê 3.000+ cảnh sát Thổ Nhĩ Kỳ; Mỹ 2026: gói $625M AI & camera liên bang.",
  },
  {
    id: "fifa-deal",
    title: "Hợp đồng với FIFA",
    icon: "📜",
    summary:
      "Đấu thầu hồ sơ $50–150M (thua = mất trắng). Nước chủ nhà chịu hạ tầng công; FIFA ưu đãi thuế doanh thu.",
    example: "Mô hình nhượng quyền: FIFA mang thương hiệu, host bỏ tiền xây.",
  },
];

export interface BenefitItem {
  id: string;
  title: string;
  icon: string;
  summary: string;
}

export const HOST_BENEFITS: BenefitItem[] = [
  {
    id: "tourism",
    title: "Cú sốc cầu du lịch",
    icon: "✈️",
    summary:
      "Qatar 2022: 1.4 triệu khách — IMF ước +0.7–1% GDP. Brazil: doanh thu quanh fanzone tăng 300–400%.",
  },
  {
    id: "deadline",
    title: "Deadline hạ tầng",
    icon: "⏱️",
    summary:
      "World Cup ép hoàn thành metro/sân bay vốn trì trệ 10–20 năm — di sản nếu quy hoạch đúng.",
  },
  {
    id: "jobs",
    title: "Việc làm (3 giai đoạn)",
    icon: "👷",
    summary:
      "Xây dựng → dịch vụ thời vụ → vận hành dài hạn. Nga 2018 tạo việc làm lớn qua 3 giai đoạn (chuẩn bị / trong giải / sau giải).",
  },
  {
    id: "soft-power",
    title: "Quyền lực mềm",
    icon: "🌐",
    summary:
      "Đức 2006 đổi hình ảnh cứng nhắc; Qatar dùng WC cho Vision 2030. VIP = hội nghị ngoại giao thu nhỏ.",
  },
];

export const DATA_SOURCES = [
  "Docs dự án MLN122 (chi phí đăng cai & WC 2026)",
  "FIFA Stadium Guidelines (sức chứa)",
] as const;

export function estimateFifaRevenueB(params: {
  teams: 32 | 48;
  asiaSlots: number;
  chinaPriority: number;
}): number {
  const teamFactor = (params.teams - 32) / 16;
  const asiaFactor = (params.asiaSlots - ASIA_SLOTS.ERA_32_TEAM) / 4;
  const chinaFactor = params.chinaPriority / 100;

  const revenue =
    FIFA_REVENUE.BASE_32_TEAM +
    teamFactor * (FIFA_REVENUE.BASE_48_TEAM - FIFA_REVENUE.BASE_32_TEAM) +
    asiaFactor * 0.35 +
    chinaFactor * 0.5;

  return Math.max(
    FIFA_REVENUE.TYPICAL_LOW,
    Math.min(FIFA_REVENUE.CYCLE_2023_2026_PROJECTED + 0.5, revenue),
  );
}

/**
 * Ước chi phí nước chủ nhà (tỷ USD) theo mức đầu tư.
 * Mốc docs: tái sử dụng/thấp ≈ Nam Phi $3.6B · xây lớn ≈ Brazil $15B ·
 * cực đại kiểu Qatar (metro + thành phố) ≈ $220B.
 * WC 2026 (48 đội + tái sử dụng sân): gần đầu thấp–trung, không dùng số $13.9B cũ.
 */
export function estimateHostCostB(params: {
  infrastructure: number;
  teams: 32 | 48;
}): number {
  const infra = params.infrastructure / 100;
  const reuseBoost = params.teams >= 48 && infra < 0.5 ? -0.15 : 0;
  const t = Math.min(1, Math.max(0, infra + reuseBoost));

  const sa = HOST_COST_BY_EDITION.SOUTH_AFRICA_2010;
  const br = HOST_COST_BY_EDITION.BRAZIL_2014;
  const qa = HOST_COST_BY_EDITION.QATAR_2022_TOTAL;

  if (t < 0.85) {
    const mid = sa + (br - sa) * Math.pow(t / 0.85, 1.6);
    return Math.max(2.5, Math.min(br, mid));
  }

  const u = (t - 0.85) / 0.15;
  return br + (qa - br) * Math.pow(u, 1.4);
}

export function estimateTurnSpendB(
  infrastructure: number,
  stance: "brand" | "people",
): number {
  const infra = infrastructure / 100;
  const spendBase = 0.35 + infra * 1.65;
  return spendBase * (stance === "brand" ? 1.12 : 0.88);
}

export function formatUsdB(value: number, digits = 1): string {
  const n = Number.isFinite(value) ? value : 0;
  if (digits === 0) return `$${Math.round(n)}B`;
  return `$${n.toFixed(digits)}B`;
}

export function costContextLine(costB: number): string {
  if (costB >= 100) {
    return "Quy mô kiểu Qatar: gồm metro/sân bay/thành phố mới — không chỉ sân bóng.";
  }
  if (costB >= 12) {
    return `Gần mức Brazil 2014 (~${formatUsdB(15, 0)}) — dư sức tài trợ nước sạch cho hàng chục triệu người.`;
  }
  if (costB >= 8) {
    return `Gần mức Nga 2018 (~${formatUsdB(11.6)}) — thường đội vốn sân & giao thông.`;
  }
  if (costB >= 3) {
    return `Gần mức Nam Phi 2010 (~${formatUsdB(3.6)}) — vẫn lớn hơn GDP ~40 nước nhỏ lúc bấy giờ.`;
  }
  return "Mức tiết kiệm: tái sử dụng sân có sẵn (kiểu WC 2026 / Đức).";
}
