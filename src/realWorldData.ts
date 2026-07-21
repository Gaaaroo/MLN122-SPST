/**
 * Số liệu World Cup — chỉ giữ con số có trong docs dự án (MLN122).
 * Nguồn: docs/chi-phi-*.md, docs/world-cup-2026-*.md
 */

/** Doanh thu FIFA theo chu kỳ 4 năm (tỷ USD) — theo docs + báo cáo FIFA */
export const FIFA_REVENUE = {
  /** Docs: FIFA thường bỏ túi khoảng 7–9 tỷ mỗi chu kỳ */
  TYPICAL_LOW: 7.0,
  TYPICAL_HIGH: 9.0,
  /** Ngân sách / doanh thu dự kiến ban đầu chu kỳ 2023–2026 (48 đội) */
  CYCLE_2023_2026_PROJECTED: 11.0,
  /** FIFA công bố sau giải 2026 (7/2026): chu kỳ vượt 15 tỷ — nhờ vé & gói VIP giá cao */
  CYCLE_2023_2026_ANNOUNCED: 15.0,
  /** Mốc mô phỏng 32 đội (giữa khoảng 7–9) */
  BASE_32_TEAM: 7.0,
  BASE_48_TEAM: 15.0,
  /** Cơ cấu doanh thu WC 2026 theo ngân sách ban đầu (tỷ USD) — thực tế vé/VIP vượt xa */
  WC2026_TV: 4.2,
  WC2026_SPONSOR: 2.7,
  WC2026_TICKETS: 3.0,
  /** FIFA hỗ trợ sân bãi 3 nước đăng cai 2026 (ước 200–400 triệu, lấy mốc cao) */
  WC2026_HOST_SUPPORT: 0.4,
  /** Tiền thưởng đội tuyển 2026 — FIFA Council chốt 12/2025 (vô địch 50 triệu) */
  WC2026_PRIZE_MONEY: 0.655,
} as const;

/**
 * Chi phí đăng cai (tỷ USD) — docs + Statista (1994–2022).
 * Không gắn số “host cost tổng” cho WC 2026 — chưa có một tổng duy nhất đáng tin.
 */
export const HOST_COST_BY_EDITION = {
  /** Statista: tổng chi Đức 2006 ~4,3 tỷ (sân ~1,6 tỷ) */
  GERMANY_2006: 4.3,
  SOUTH_AFRICA_2010: 3.6,
  BRAZIL_2014: 15.0,
  RUSSIA_2018: 11.6,
  QATAR_2022_TOTAL: 220.0,
  /** ~6.5–7B sân — docs dùng cả hai; lấy 7B (7 sân mới + 1 nâng cấp) */
  QATAR_2022_STADIUMS: 7.0,
  QATAR_DOHA_METRO: 36.0,
  QATAR_LUSAIL_CITY: 45.0,
} as const;

/** Tác động kinh tế WC 2026 (dự phóng — không phải “chi phí đăng cai tổng”) */
export const WC2026_ECONOMIC = {
  FIFA_REVENUE_B: 11.0,
  USA_GDP_IMPACT_B: 17.2,
  /** GDP TOÀN CẦU theo nghiên cứu FIFA–WTO (OpenEconomics) — không phải riêng 3 nước chủ nhà */
  GLOBAL_GDP_B: 40.9,
  CANADA_DELOITTE_B: 2.7,
  MEXICO_DELOITTE_B: 4.05,
  FEDERAL_SECURITY_TRANSPORT_M: 625,
} as const;

/** Kỳ vọng vs thực tế lợi ích kinh tế — docs MLN122 + nghiên cứu học thuật */
export interface ExpectationGapEntry {
  id: string;
  name: string;
  /** Kỳ vọng (tỷ USD) — midpoint nếu có range */
  expectedB?: number;
  expectedRange?: string;
  /** Thực tế đo được ex-post (tỷ USD) */
  actualB?: number;
  actualRange?: string;
  /** Hiển thị thực tế khi không quy đổi được số (vd. ≈$0) */
  actualNote?: string;
  note: string;
}

export const EXPECTATION_GAP: ExpectationGapEntry[] = [
  {
    id: "usa-1994",
    name: "Mỹ 1994",
    expectedB: 4,
    actualNote: "các thành phố lỗ 5,5 đến 9,3 tỷ",
    note: "Ban tổ chức hứa nền kinh tế được lợi khoảng 4 tỷ. Nghiên cứu của Baade và Matheson đo lại sau giải: các thành phố đăng cai thu nhập còn thấp hơn bình thường, tổng thiệt khoảng 5,5 đến 9,3 tỷ.",
  },
  {
    id: "france-1998",
    name: "Pháp 1998",
    expectedRange: "hứa 500.000 khách, bùng nổ du lịch",
    actualNote: "gần như không đo được",
    note: "Các nghiên cứu sau giải gần như không thấy tác động rõ lên khách sạn, du lịch hay bán lẻ.",
  },
  {
    id: "korea-2002",
    name: "Hàn Quốc 2002",
    expectedB: 8.9,
    actualB: 1.35,
    note: "Dự báo lời gần 9 tỷ. Thực tế chỉ khoảng 1,3 tỷ, tức chừng 15% so với lời hứa.",
  },
  {
    id: "japan-2002",
    name: "Nhật Bản 2002",
    expectedB: 24.8,
    actualNote: "không đo được tác động rõ",
    note: "Viện Dentsu dự báo tới gần 25 tỷ. Nghiên cứu sau giải không đo được tác động rõ rệt nào — giải lại rơi đúng lúc kinh tế Nhật trì trệ.",
  },
  {
    id: "germany-2006",
    name: "Đức 2006",
    expectedRange: "kỳ vọng ~0,6–1,1 tỷ từ du lịch",
    actualB: 0.9,
    note: "Một trong số ít kỳ gần đạt kỳ vọng du lịch (khoảng 900 triệu). Nhưng việc làm dài hạn thì không thấy tăng rõ.",
  },
  {
    id: "sa-2010",
    name: "Nam Phi 2010",
    expectedB: 9,
    expectedRange: "hứa lời 6–12 tỷ",
    actualB: 0.5,
    note: "Chỉ 309.000 khách đến vì giải (dự báo 483.000), chi khoảng 0,5 tỷ. Trừ đi lượng khách thường tránh mùa giải, lợi ròng còn thấp hơn — kém lời hứa cả chục lần.",
  },
  {
    id: "brazil-2014",
    name: "Brazil 2014",
    expectedRange: "chính phủ nói tới ~70 tỷ",
    actualB: 1.0,
    note: "Đón khoảng 1 triệu khách quốc tế nhưng Ngân hàng Trung ương Brazil chỉ đo được thêm cỡ 1 tỷ từ khách nước ngoài. Chi phí đội vốn nhiều lần và dân xuống đường phản đối.",
  },
  {
    id: "russia-2018",
    name: "Nga 2018",
    expectedRange: "hứa 26–31 tỷ trong 10 năm",
    actualB: 14.5,
    note: "Ban tổ chức nhà nước tự công bố đóng góp 14,5 tỷ cho GDP giai đoạn 2013–2018. Giới nghiên cứu độc lập ước riêng du lịch thật chỉ mang về khoảng 1–3 tỷ.",
  },
  {
    id: "qatar-2022",
    name: "Qatar 2022",
    expectedRange: "đánh bóng hình ảnh quốc gia",
    actualNote: "chi khoảng 220 tỷ",
    note: "Khó tách lợi ích World Cup khỏi kế hoạch xây cả đất nước. Chi rất lớn, nhiều công trình có nguy cơ bỏ không sau giải.",
  },
];

export const EXPECTATION_GAP_SOURCES =
  "Statista, nghiên cứu Baade & Matheson (2004), Lee & Taylor (2005), Allmers & Maennig, Baumann & Matheson, Ngân hàng Trung ương Brazil, IMF, tài liệu môn MLN122";

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

/** Giải thích tĩnh — vì sao FIFA mở rộng số đội (không phải slider) */
export const TEAM_EXPANSION_BENEFITS = {
  title: "Vì sao FIFA muốn nhiều đội tham gia?",
  points: [
    "Tăng từ 32 lên 48 đội nghĩa là có thêm rất nhiều trận, kéo theo tiền bản quyền truyền hình và quảng cáo.",
    "Giải 48 đội giúp FIFA thu về nhiều hơn hẳn, nhưng phần lớn số tiền đó là của FIFA chứ không chia cho nước chủ nhà.",
    "Nhiều nước được dự hơn thì mở thêm thị trường ở châu Á và châu Phi; riêng châu Á tăng từ 4 lên 8 suất.",
    "Nước chủ nhà phải lo thêm hậu cần và an ninh, nhưng năm 2026 đỡ hơn nhờ dùng lại 16 sân có sẵn.",
  ],
} as const;

/** Format giải đấu cố định trong mô hình (WC 2026 trở đi) */
export const MODEL_WC_TEAMS = TOURNAMENT_FORMAT.TEAMS_48;

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
    headline: "1 tháng bóng đá tốn hàng trăm tỷ USD",
    detail:
      "Nam Phi 2010 hết 3,6 tỷ, Brazil 2014 15 tỷ, Nga 2018 11,6 tỷ, còn Qatar 2022 tới 220 tỷ (tính cả tàu điện, sân bay, thành phố mới).",
    tag: "Chi phí",
  },
  {
    id: "qatar-scale",
    headline: "220 tỷ đủ mua đứt Netflix, McDonald's, Nike hoặc Disney",
    detail:
      "Đủ mua trọn từng công ty một (theo giá trị năm 2022). Hoặc đủ nuôi NASA (khoảng 25 tỷ mỗi năm) trong gần 9 năm, tính cả chương trình lên Mặt Trăng và sao Hỏa.",
    tag: "Qatar 2022",
  },
  {
    id: "fifa-model",
    headline: "FIFA nắm đằng chuôi, nước chủ nhà nắm đằng lưỡi",
    detail:
      "FIFA gom tiền bản quyền truyền hình, tài trợ và vé, lại được ưu đãi thuế. Nước chủ nhà thì tự trả tiền sân, đường sá, an ninh, y tế.",
    tag: "Mô hình",
  },
  {
    id: "winner-curse",
    headline: "Càng cố thắng quyền đăng cai càng dễ lỗ",
    detail:
      "Nam Phi từng mơ lời 6–12 tỷ, thực tế khách chỉ chi khoảng 0,5 tỷ. Hồ sơ đấu thầu hay tô hồng để giành phiếu.",
    tag: "Kỳ vọng",
  },
  {
    id: "white-elephant",
    headline: "Sân xây xong rồi bỏ không",
    detail:
      "Sân Arena da Amazônia ở Brazil có 44.000 chỗ nằm giữa rừng Amazon; sau giải gần như bỏ hoang mà vẫn tốn tiền bảo trì.",
    tag: "Di sản",
  },
  {
    id: "wc2026",
    headline: "2026: 3 nước, 16 sân có sẵn, 48 đội",
    detail:
      "Mỹ 11 sân, Mexico 3, Canada 2, tận dụng sân bóng bầu dục có sẵn. FIFA dự thu 11 tỷ nhưng sau giải công bố vượt 15 tỷ; Mỹ tổ chức phần lớn số trận (78 trên 104).",
    tag: "WC 2026",
  },
  {
    id: "wc2026-city-bill",
    headline: "11 thành phố Mỹ hụt ít nhất 250 triệu đô tiền tổ chức",
    detail:
      "Hợp đồng với FIFA cấm thành phố bán tài trợ cạnh tranh với đối tác của FIFA, trong khi mỗi nơi phải tự lo 100 đến 200 triệu chi phí an ninh, giao thông, lễ hội fan.",
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
      "FIFA yêu cầu sân vòng bảng chứa ít nhất 40.000 người, bán kết 60.000, chung kết 80.000 — kèm khu VIP, mái che, cỏ tự nhiên và camera bay.",
    example: "Riêng sân, Qatar tốn khoảng 7 tỷ cho 7 sân mới và 1 sân nâng cấp.",
  },
  {
    id: "transport",
    title: "Giao thông & đô thị",
    icon: "🚇",
    summary:
      "Thường còn tốn hơn cả sân: tàu điện, sân bay, cao tốc. Sân mở cửa trước 3 tiếng nên hàng vạn người đổ về cùng lúc.",
    example: "Tàu điện Doha khoảng 36 tỷ; thành phố Lusail xây từ sa mạc khoảng 45 tỷ.",
  },
  {
    id: "security",
    title: "An ninh & mạng",
    icon: "🛡️",
    summary:
      "Vây kín sân bằng an ninh và cả tường lửa mạng. Nga 2018 chặn hơn 25 triệu vụ tấn công mạng chỉ trong một tháng.",
    example:
      "Qatar thuê hơn 3.000 cảnh sát Thổ Nhĩ Kỳ; Mỹ 2026 chi gói 625 triệu cho camera và AI.",
  },
  {
    id: "fifa-deal",
    title: "Hợp đồng với FIFA",
    icon: "📜",
    summary:
      "Chỉ riêng làm hồ sơ đấu thầu đã tốn 50–150 triệu, thua là mất trắng. Nước chủ nhà lo hạ tầng, còn FIFA được ưu đãi thuế trên doanh thu.",
    example: "Giống nhượng quyền: FIFA mang thương hiệu, nước chủ nhà bỏ tiền xây.",
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
    title: "Du lịch bùng nổ",
    icon: "✈️",
    summary:
      "Qatar 2022 đón khoảng 1–1,4 triệu khách (IMF ước ~1 triệu); giúp GDP năm đó tăng khoảng 0,7–1%. Ở Brazil, doanh thu quanh khu cổ động viên tăng gấp 3–4 lần.",
  },
  {
    id: "deadline",
    title: "Ép tiến độ hạ tầng",
    icon: "⏱️",
    summary:
      "World Cup buộc phải làm xong tàu điện, sân bay vốn ì ạch cả chục năm — thành di sản nếu quy hoạch tử tế.",
  },
  {
    id: "jobs",
    title: "Việc làm theo 3 giai đoạn",
    icon: "👷",
    summary:
      "Đầu tiên là thợ xây, rồi tới dịch vụ thời vụ, cuối cùng là vận hành lâu dài. Nga 2018 tạo nhiều việc làm qua cả ba giai đoạn.",
  },
  {
    id: "soft-power",
    title: "Quyền lực mềm",
    icon: "🌐",
    summary:
      "Đức 2006 xóa được hình ảnh cứng nhắc; Qatar mượn giải để quảng bá đất nước. Khu VIP như một hội nghị ngoại giao thu nhỏ.",
  },
];

export const DATA_SOURCES = [
  "Tài liệu môn MLN122 (chi phí đăng cai & World Cup 2026)",
  "Hướng dẫn sân vận động của FIFA (sức chứa)",
] as const;

/**
 * Liên hệ hiện tượng World Cup với Kinh tế chính trị Mác–Lênin.
 * Giữ khung sư phạm: ai tạo ra giá trị, ai sở hữu, ai hưởng, ai trả.
 */
export interface MlnConnection {
  concept: string;
  text: string;
}

export const MLN_CONNECTIONS: MlnConnection[] = [
  {
    concept: "Giá trị thặng dư & bóc lột lao động",
    text: "Công nhân xây sân, làm đường mới là người tạo ra của cải, nhưng phần lớn tiền bản quyền và tài trợ lại chảy về FIFA cùng nhà thầu — rõ nhất là lao động nhập cư ở Qatar.",
  },
  {
    concept: "Ai sở hữu thì người đó hưởng",
    text: "FIFA nắm thương hiệu và bản quyền truyền hình; nước chủ nhà bỏ tiền xây sân nhưng không nắm nguồn thu chính. Việc sở hữu tư liệu quyết định ai được chia lợi ích.",
  },
  {
    concept: "Nhà nước đứng về phía tư bản",
    text: "Tiền thuế của dân và các ưu đãi thuế cho FIFA được dùng để bảo đảm lợi nhuận cho tư bản sự kiện — nhà nước gánh chi phí, tư nhân gom lời.",
  },
  {
    concept: "Tư bản luôn tìm thị trường mới",
    text: "Mở lên 48 đội, thêm suất cho châu Á, nhắm vào 1,4 tỷ dân Trung Quốc — đúng với lý luận của Lênin về việc tư bản bành trướng để tìm thị trường và lợi nhuận mới.",
  },
  {
    concept: "Cán cân giai cấp: ai hưởng, ai trả",
    text: "Hưởng lợi là FIFA, tập đoàn tài trợ, nhà thầu. Trả giá là người đóng thuế, người lao động và dân bị di dời. Cả xã hội cùng đóng góp nhưng thành quả rơi vào tay số ít — đó là mâu thuẫn cơ bản của chủ nghĩa tư bản.",
  },
];

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
    Math.min(FIFA_REVENUE.CYCLE_2023_2026_ANNOUNCED + 0.5, revenue),
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

export function formatUsdB(value: number, digits = 1): string {
  const n = Number.isFinite(value) ? value : 0;
  if (digits === 0) return `$${Math.round(n)}B`;
  return `$${n.toFixed(digits)}B`;
}
