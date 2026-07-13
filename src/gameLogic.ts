import type {
  Camera,
  CountryId,
  CountryProfile,
  FifaState,
  HostState,
  QuickAction,
} from "./types";
import { COUNTRIES, FIFA_TURN_EVENTS } from "./types";
import {
  estimateFifaRevenueB,
  estimateHostCostB,
  estimateTurnSpendB,
  FIFA_REVENUE,
  formatUsdB,
  HOST_COST_BY_EDITION,
  TOURNAMENT_FORMAT,
  VIEWERS_BILLIONS,
} from "./realWorldData";

export const CAMERA_LABELS: Record<Camera, string> = {
  government: "Chính phủ",
  business: "Doanh nghiệp",
  labor: "Lao động",
  fifa: "FIFA / Media",
};

export function getCameraLines(state: HostState, camera: Camera): string[] {
  switch (camera) {
    case "government":
      return [
        `Hình ảnh quốc gia: ${state.brand.toFixed(0)}/100 — soft power (Đức 2006 / Qatar Vision 2030)`,
        `FIFA hài lòng: ${state.fifaSatisfaction.toFixed(0)}% (họ không trả hóa đơn sân–metro)`,
        "Mua vị thế trong 1 tháng — người đóng thuế trả dài hạn.",
      ];
    case "business":
      return [
        "Khách sạn, F&B, xây dựng bùng nổ — hiệu ứng số nhân ngắn hạn",
        `Tư nhân chiếm ${state.publicPrivate.toFixed(0)}% đầu tư (PPP)`,
        `Du lịch ước: ${formatUsdB(state.tourismRevenue)} (FIFA giữ TV/sponsor)`,
      ];
    case "labor":
      return [
        `Việc làm tạm: ${state.jobs.toFixed(0)}K — đa phần biến mất sau giải`,
        state.publicMood < 45
          ? "Giá nhà & lương không theo kịp — kiểu Brazil trước 2014."
          : "Điều kiện lao động được giám sát tương đối.",
        state.socialPriority < 40
          ? "Deadline FIFA — tăng ca, rủi ro an toàn."
          : "Ngân sách an sinh còn được bảo vệ.",
      ];
    case "fifa":
      return [
        "Chu kỳ 4 năm: FIFA thu khoảng $7–11B — nước chủ nhà tự trả hạ tầng & an ninh",
        `Rủi ro sân trắng: ${state.whiteElephantRisk.toFixed(0)}% (Manaus, Cape Town…)`,
        mediaNarrative(state),
      ];
  }
}

export function moodText(mood: number): string {
  if (mood >= 65) return "Hài lòng";
  if (mood >= 45) return "Lo ngại nhẹ";
  if (mood >= 35) return "Bất ổn tăng";
  return "Biểu tình";
}

export function getCountry(id: CountryId): CountryProfile {
  return COUNTRIES.find((c) => c.id === id)!;
}

export function createHostState(countryId: CountryId): HostState {
  const c = getCountry(countryId);
  return {
    countryId,
    turn: 1,
    maxTurns: 9,
    timer: 25,
    legacy: c.startLegacy,
    stability: 55,
    debt: c.startDebt,
    brand: c.startBrand,
    jobs: 0,
    whiteElephantRisk: 20,
    fifaSatisfaction: 70,
    tourismRevenue: 0,
    totalSpent: 0,
    publicMood: c.startMood,
    infrastructure: 45,
    publicPrivate: 50,
    socialPriority: 50,
    stance: "brand",
    emergencyUsed: false,
    unstable: false,
    eventText: "",
    history: [],
    camera: "government",
  };
}

export function mediaNarrative(s: HostState): string {
  if (s.brand > 70 && s.whiteElephantRisk < 40)
    return "Đầu báo: 'World Cup thành công — di sản bền vững'";
  if (s.publicMood < 40)
    return "Đầu báo: 'Chi phí đắt đỏ — người dân trả giá'";
  if (s.whiteElephantRisk > 60)
    return "Đầu báo: 'Sân vận động hoang phế sau giải'";
  return "Đầu báo: 'Thành công hỗn hợp — tranh luận tiếp diễn'";
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function applyQuickAction(
  _state: HostState,
  action: QuickAction,
): Partial<HostState> {
  switch (action) {
    case "mega":
      return {
        infrastructure: 85,
        publicPrivate: 70,
        socialPriority: 75,
        stance: "brand",
      };
    case "reuse":
      return {
        infrastructure: 35,
        publicPrivate: 30,
        socialPriority: 35,
        stance: "people",
      };
    case "tourism":
      return {
        infrastructure: 25,
        publicPrivate: 60,
        socialPriority: 80,
        stance: "brand",
      };
    case "austerity":
      return {
        infrastructure: 20,
        publicPrivate: 40,
        socialPriority: 20,
        stance: "people",
      };
    default:
      return {};
  }
}

export function simulateTurn(
  state: HostState,
  options?: { emergency?: boolean },
): HostState {
  const c = getCountry(state.countryId);
  const infra = state.infrastructure / 100;
  const privateRatio = state.publicPrivate / 100;
  const social = state.socialPriority / 100;
  const brandStance = state.stance === "brand" ? 1 : 0;
  const emergency = options?.emergency ?? false;

  const spendBase = estimateTurnSpendB(state.infrastructure, state.stance);
  const spend =
    spendBase * (emergency ? 1.25 : 1);

  let legacyGain = infra * 12 + (1 - privateRatio) * 3;
  if (state.infrastructure < 30) legacyGain += 8;
  if (state.infrastructure > 70) legacyGain -= (state.infrastructure - 70) * 0.15;

  let moodDelta = -social * 8 + (1 - social) * 5;
  moodDelta -= infra * 6;
  moodDelta += state.stance === "people" ? 6 : -3;
  if (emergency) moodDelta -= 12;

  let stabilityDelta = (1 - social) * 4 - infra * 3;
  stabilityDelta += state.stance === "people" ? 5 : -2;
  if (state.publicMood < 45) stabilityDelta -= 4;

  let debtDelta = spend * 0.9 - infra * 0.2;
  if (privateRatio > 0.6) debtDelta -= 1.5;

  const tourism =
    0.08 + infra * 0.22 + brandStance * 0.25 + (state.turn === 6 ? 1.0 : 0);
  const jobs = infra * 80 + (emergency ? 30 : 0);

  let whiteRisk = state.whiteElephantRisk + infra * 8 - (1 - privateRatio) * 4;
  if (state.infrastructure < 35) whiteRisk -= 10;
  if (state.infrastructure > 75) whiteRisk += 12;

  let fifaSat = state.fifaSatisfaction + infra * 5 - (1 - brandStance) * 4;
  if (emergency) fifaSat += 15;
  if (state.infrastructure < 25) fifaSat -= 10;

  const next: HostState = {
    ...state,
    legacy: clamp(state.legacy + legacyGain * 0.35, 0, 100),
    stability: clamp(state.stability + stabilityDelta, 0, 100),
    debt: clamp(state.debt + debtDelta - tourism * 0.15, 10, 120),
    brand: clamp(state.brand + tourism * 0.8 + brandStance * 2, 0, 100),
    jobs: clamp(state.jobs + jobs * 0.15, 0, 500),
    whiteElephantRisk: clamp(whiteRisk, 0, 100),
    fifaSatisfaction: clamp(fifaSat, 0, 100),
    tourismRevenue: state.tourismRevenue + tourism,
    totalSpent: state.totalSpent + spend,
    publicMood: clamp(state.publicMood + moodDelta, 0, 100),
    emergencyUsed: state.emergencyUsed || !!emergency,
    unstable: false,
    turn: state.turn + 1,
    timer: 25,
    history: [
      ...state.history,
      `Lượt ${state.turn}: Chi ${formatUsdB(spend)} | Di sản +${(legacyGain * 0.35).toFixed(1)}`,
    ],
  };

  next.unstable = next.publicMood < 38 || next.debt > c.startDebt + 25;

  return next;
}

export function getVictoryStatus(state: HostState, startDebt: number) {
  const legacyOk = state.legacy >= 70;
  const stabilityOk = state.stability >= 60;
  const fiscalOk = state.debt <= startDebt + 15;
  return {
    legacyOk,
    stabilityOk,
    fiscalOk,
    allOk: legacyOk && stabilityOk && fiscalOk,
    legacyNeed: Math.max(0, 70 - state.legacy),
    stabilityNeed: Math.max(0, 60 - state.stability),
    fiscalNeed: Math.max(0, state.debt - (startDebt + 15)),
  };
}

export function createFifaState(): FifaState {
  return {
    teams: 32,
    asiaSlots: 4,
    chinaPriority: 30,
    revenue: FIFA_REVENUE.BASE_32_TEAM,
    marketReach: VIEWERS_BILLIONS.QATAR_2022 * 0.7,
    hostCost: HOST_COST_BY_EDITION.SOUTH_AFRICA_2010,
    nationsEngaged: 32,
    turn: 1,
    maxTurns: 5,
    eventText: FIFA_TURN_EVENTS[1] ?? "",
    history: [],
  };
}

export function computeFifaMetrics(state: FifaState) {
  const teamFactor = (state.teams - 32) / 16;
  const asiaFactor = (state.asiaSlots - 4) / 4;
  const chinaFactor = state.chinaPriority / 100;

  const revenue = estimateFifaRevenueB({
    teams: state.teams,
    asiaSlots: state.asiaSlots,
    chinaPriority: state.chinaPriority,
  }) + (state.turn - 1) * 0.15;

  const marketReach =
    VIEWERS_BILLIONS.QATAR_2022 * (0.65 + teamFactor * 0.25 + chinaFactor * 0.15) +
    asiaFactor * 0.1;

  const hostCost = estimateHostCostB({
    infrastructure: 50 + teamFactor * 35,
    teams: state.teams,
  });

  const nationsEngaged =
    state.teams + Math.floor(asiaFactor * 3) + Math.floor(chinaFactor * 4);

  return {
    revenue: clamp(revenue, 5.5, 13),
    marketReach: clamp(marketReach, 3, 6.5),
    hostCost: clamp(hostCost, 3.6, 15),
    nationsEngaged: clamp(nationsEngaged, 32, 60),
  };
}

export function simulateFifaTurn(state: FifaState): FifaState {
  const metrics = computeFifaMetrics(state);
  return {
    ...state,
    ...metrics,
    turn: state.turn + 1,
    history: [
      ...state.history,
      `Lượt ${state.turn}: ${state.teams} đội | Doanh thu ${formatUsdB(metrics.revenue)}`,
    ],
  };
}

export function getFifaInsight(state: FifaState): string {
  if (state.teams === 48 && state.chinaPriority > 60) {
    return "FIFA tối đa hóa doanh thu: mở rộng giải + thị trường 1.4 tỷ người Trung Quốc.";
  }
  if (state.teams >= 48) {
    return `48 đội = ${TOURNAMENT_FORMAT.MATCHES_48_TEAM} trận (+${TOURNAMENT_FORMAT.MATCH_INCREASE} so với 64) → bản quyền & quảng cáo tăng.`;
  }
  if (state.chinaPriority > 70) {
    return "Trung Quốc = thị trường TV & sponsor châu Á chưa khai thác hết.";
  }
  return "Chỉnh số đội & ưu tiên châu Á để thấy logic kinh tế của FIFA.";
}
