export type Screen =
  | "landing"
  | "overview"
  | "select-country"
  | "host"
  | "host-result"
  | "fifa"
  | "fifa-result";

export type CountryId = "developing" | "developed" | "resource";

export type Stance = "brand" | "people";
export type Camera = "government" | "business" | "labor" | "fifa";
export type QuickAction = "mega" | "reuse" | "tourism" | "austerity" | null;

export interface CountryProfile {
  id: CountryId;
  name: string;
  flag: string;
  description: string;
  population: string;
  startDebt: number;
  startLegacy: number;
  startMood: number;
  startBrand: number;
}

export interface HostState {
  countryId: CountryId;
  turn: number;
  maxTurns: number;
  timer: number;
  legacy: number;
  stability: number;
  debt: number;
  brand: number;
  jobs: number;
  whiteElephantRisk: number;
  fifaSatisfaction: number;
  tourismRevenue: number;
  totalSpent: number;
  publicMood: number;
  infrastructure: number;
  publicPrivate: number;
  socialPriority: number;
  stance: Stance;
  emergencyUsed: boolean;
  unstable: boolean;
  eventText: string;
  history: string[];
  camera: Camera;
}

export interface FifaState {
  teams: 32 | 48;
  asiaSlots: number;
  chinaPriority: number;
  revenue: number;
  marketReach: number;
  hostCost: number;
  nationsEngaged: number;
  turn: number;
  maxTurns: number;
  eventText: string;
  history: string[];
}

export const COUNTRIES: CountryProfile[] = [
  {
    id: "developing",
    name: "Namovia",
    flag: "🌏",
    description:
      "Đang phát triển (kiểu Nam Phi/Brazil) — ít sân chuẩn FIFA, dễ đội vốn & sân trắng",
    population: "98 triệu",
    startDebt: 55,
    startLegacy: 35,
    startMood: 52,
    startBrand: 30,
  },
  {
    id: "developed",
    name: "Eurania",
    flag: "🏛️",
    description:
      "Phát triển (kiểu Đức/Mỹ–Canada) — tái sử dụng sân, chi thấp hơn, soft power ổn",
    population: "42 triệu",
    startDebt: 35,
    startLegacy: 62,
    startMood: 68,
    startBrand: 55,
  },
  {
    id: "resource",
    name: "Petroland",
    flag: "🛢️",
    description:
      "Tài nguyên (kiểu Qatar) — vốn lớn, xây metro & thành phố mới, lao động nhập cư",
    population: "28 triệu",
    startDebt: 25,
    startLegacy: 45,
    startMood: 58,
    startBrand: 40,
  },
];

export const TURN_EVENTS: Record<number, string> = {
  1: "FIFA chấp thuận — hồ sơ đấu thầu đã đốt $50–150M. Cam kết sân ≥40k/60k/80k chỗ + ưu đãi thuế cho FIFA.",
  2: "Khởi công: sân, metro, sân bay. Deadline FIFA ép tiến độ — ngân sách dễ đội vốn.",
  3: "Giá nhà quanh sân tăng; một số hộ bị di dời. An sinh vs hình ảnh quốc gia.",
  4: "Bán vé & sponsor. FIFA giữ phần lớn bản quyền TV — host thu chủ yếu từ du lịch.",
  5: "Áp lực phút chót: tăng ca, an ninh pháo đài, tường lửa chống tấn công mạng.",
  6: "Tháng thi đấu — cú sốc cầu: khách sạn kín, fanzone nóng. Mở cửa sân trước 3 tiếng.",
  7: "Hậu giải: báo chí đánh giá soft power (quyền lực mềm). Việc làm thời vụ bắt đầu biến mất.",
  8: "3 năm sau — sân còn đầy người hay thành voi trắng (sân trắng)? Metro có còn chạy?",
  9: "Báo cáo cuối: FIFA đã thu đủ chu kỳ 4 năm — nước chủ nhà còn nợ, di sản hay gánh nặng?",
};

export const FIFA_TURN_EVENTS: Record<number, string> = {
  1: "FIFA bắt đầu đánh giá mở rộng giải đấu & thị trường châu Á.",
  2: "Ủy ban đề xuất tăng số đội — thảo luận sôi nổi.",
  3: "Liên đoàn châu Á đòi thêm suất — Trung Quốc được nhắc tên.",
  4: "Nhà tài trợ Trung Quốc cam kết hợp đồng bản quyền.",
  5: "Quyết định: cơ cấu World Cup mới.",
};
