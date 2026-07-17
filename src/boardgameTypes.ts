/**
 * "Đường đến World Cup" — cờ tỷ phú 4 người, chủ đề kinh tế đăng cai.
 * Người chơi = nước chủ nhà; ngân hàng = FIFA (luôn thu). Thắng = phúc lợi ròng,
 * không phải làm đối thủ phá sản — lật thông điệp cờ tỷ phú cho khớp MLN122.
 */

/** 3 mẫu nước chủ nhà — quyết định ngân sách đầu & cách ăn điểm */
export type CountryArchetype = "developing" | "developed" | "resource";

export interface CountryProfile {
  id: CountryArchetype;
  label: string;
  blurb: string;
  /** Ngân sách khởi đầu (tỷ USD) */
  startingBudgetB: number;
  /** Ngân sách nhận mỗi khi qua ô Xuất phát (kỳ mới) */
  budgetPerLap: number;
  /** Thu du lịch cơ bản mỗi lần dừng ô Du lịch (tỷ USD) */
  tourismBaseB: number;
  /** Điểm hài hòa xã hội nền lúc bắt đầu */
  socialBase: number;
}

export interface Player {
  id: number;
  name: string;
  profile: CountryArchetype;
  /** Vị trí trên đường đua (index ô) */
  position: number;
  /** Ngân sách còn lại (tỷ USD) — có thể âm = nợ */
  budgetB: number;
  /** Di sản hạ tầng tích lũy (điểm) */
  legacy: number;
  /** Hài hòa xã hội tích lũy (điểm) */
  socialHarmony: number;
  /** Thu du lịch tích lũy (tỷ USD) */
  tourismIncomeB: number;
  /** Số sân đã xây — đẩy rủi ro sân trắng */
  stadiumsBuilt: number;
  /** Tổng chi an sinh — đối trọng sân trắng & bất bình đẳng */
  socialSpendB: number;
  /** Đã chi an ninh trong lượt gần nhất chưa (che thẻ tấn công mạng) */
  securityReady: boolean;
}

export type TileKind =
  | "start"
  | "stadium"
  | "transport"
  | "security"
  | "welfare"
  | "tourism"
  | "fifa"
  | "event"
  | "corner"; // góc trang trí kiểu Monopoly (Cẩm vận…) — không tốn gì

export interface Tile {
  id: string;
  kind: TileKind;
  label: string;
  icon: string;
  /** 1 câu giải thích, gắn số thật khi có */
  blurb: string;
  /** Màu dải nhóm (chỉ ô "mua/xây" kiểu địa ốc Monopoly) — chỉ để trang trí */
  group?: string;
}

/** Lựa chọn mức chi trên ô xây (sân / metro / an sinh) */
export interface BuildOption {
  id: string;
  label: string;
  hint: string;
  /** Chi phí (tỷ USD) */
  costB: number;
  legacy?: number;
  socialHarmony?: number;
  socialSpendB?: number;
  /** Số sân mới xây (đẩy sân trắng) */
  stadiums?: number;
}

/** Hiệu ứng thẻ sự kiện — khai báo dạng dữ liệu để engine áp dụng */
export interface EventCard {
  id: string;
  title: string;
  detail: string;
  tag: string;
  budgetB?: number;
  legacy?: number;
  socialHarmony?: number;
  tourismIncomeB?: number;
  /** FIFA (ngân hàng) thu thêm khoản này */
  fifaGainB?: number;
  /** Chỉ phạt nếu người chơi CHƯA chi an ninh */
  penaltyIfNoSecurity?: number;
  /** Phạt ngân sách nhân theo số sân đã xây (sân trắng / bảo trì) */
  budgetPerStadium?: number;
}

export interface GameConfig {
  players: { name: string; profile: CountryArchetype }[];
  /** Số lượt mỗi người chơi (mặc định 9) */
  turnsPerPlayer: number;
  seed: number;
}

export type GamePhase = "rolling" | "choosing" | "result" | "gameover";

export interface GameState {
  players: Player[];
  /** Index người chơi hiện tại */
  current: number;
  /** Lượt hiện tại của người chơi hiện tại (1..turnsPerPlayer) */
  turn: number;
  turnsPerPlayer: number;
  /** Tổng tiền FIFA đã thu (tỷ USD) */
  fifaBankB: number;
  phase: GamePhase;
  /** State của PRNG (mulberry32) */
  rngState: number;
  lastRoll: number;
  /** Ô vừa dừng chân */
  pendingTile: Tile | null;
  /** Các mức chi để người chơi chọn (ô xây) */
  pendingOptions: BuildOption[] | null;
  /** Thẻ vừa rút (ô sự kiện) */
  lastCard: EventCard | null;
  /** Mô tả ngắn chuyện vừa xảy ra trong lượt */
  lastLog: string;
}

export interface ScoreBreakdown {
  playerId: number;
  legacy: number;
  socialHarmony: number;
  tourismPts: number;
  debtPenalty: number;
  whiteElephantPenalty: number;
  net: number;
}
