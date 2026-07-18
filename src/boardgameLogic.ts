/**
 * Engine thuần cho bàn cờ "Đường đến World Cup".
 * Không side-effect ra ngoài: mỗi hàm nhận GameState và trả về GameState mới.
 * PRNG seeded (mulberry32) để xúc xắc / rút thẻ tái lập được.
 *
 * Vòng đời một lượt:
 *   rolling → (rollAndMove) → choosing  → (resolveChoice) → result → (endTurn) → …
 *                            \→ result (ô tự động đã áp hiệu ứng ngay) →/
 */
import type {
  BuildOption,
  EventCard,
  GameConfig,
  GameState,
  Player,
  ScoreBreakdown,
  Tile,
} from "./boardgameTypes";
import {
  BOARD_TILES,
  COUNTRY_PROFILES,
  EVENT_DECK,
  FIFA_FEE_B,
  SECURITY_COST_B,
  STADIUM_OPTIONS,
  TRANSPORT_OPTIONS,
  WELFARE_OPTIONS,
} from "./boardgameData";

/** mulberry32 — trả về [0,1) và state kế tiếp */
function nextRandom(state: number): { value: number; state: number } {
  let t = (state + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { value, state: t >>> 0 };
}

export function createGame(config: GameConfig): GameState {
  const players: Player[] = config.players.map((p, i) => {
    const profile = COUNTRY_PROFILES[p.profile];
    return {
      id: i,
      name: p.name,
      profile: p.profile,
      position: 0,
      budgetB: profile.startingBudgetB,
      legacy: 0,
      socialHarmony: profile.socialBase,
      tourismIncomeB: 0,
      stadiumsBuilt: 0,
      socialSpendB: 0,
      securityReady: false,
    };
  });

  return {
    players,
    current: 0,
    turn: 1,
    turnsPerPlayer: config.turnsPerPlayer,
    fifaBankB: 0,
    phase: "rolling",
    rngState: config.seed >>> 0,
    lastRoll: 0,
    pendingTile: null,
    pendingOptions: null,
    lastCard: null,
    lastLog: "",
  };
}

export function optionsForTile(tile: Tile): BuildOption[] | null {
  if (tile.kind === "stadium") return STADIUM_OPTIONS;
  if (tile.kind === "transport") return TRANSPORT_OPTIONS;
  if (tile.kind === "welfare") return WELFARE_OPTIONS;
  return null;
}

function drawEvent(rngState: number): { card: EventCard; state: number } {
  const { value, state } = nextRandom(rngState);
  const card = EVENT_DECK[Math.floor(value * EVENT_DECK.length)]!;
  return { card, state };
}

/** Áp hiệu ứng thẻ sự kiện lên player (mutate bản clone). Trả về FIFA thu thêm + log. */
function applyEvent(player: Player, card: EventCard): { fifaGainB: number; log: string } {
  const parts: string[] = [];
  if (typeof card.budgetB === "number") {
    player.budgetB += card.budgetB;
    parts.push(`${card.budgetB > 0 ? "+" : ""}${card.budgetB} tỷ ngân sách`);
  }
  if (typeof card.legacy === "number") {
    player.legacy += card.legacy;
    parts.push(`${card.legacy > 0 ? "+" : ""}${card.legacy} di sản`);
  }
  if (typeof card.socialHarmony === "number") {
    player.socialHarmony += card.socialHarmony;
    parts.push(`${card.socialHarmony > 0 ? "+" : ""}${card.socialHarmony} hài hòa xã hội`);
  }
  if (typeof card.tourismIncomeB === "number") {
    player.tourismIncomeB = Math.max(0, player.tourismIncomeB + card.tourismIncomeB);
    parts.push(`${card.tourismIncomeB > 0 ? "+" : ""}${card.tourismIncomeB} tỷ du lịch`);
  }
  if (typeof card.budgetPerStadium === "number") {
    const hit = card.budgetPerStadium * player.stadiumsBuilt;
    player.budgetB += hit;
    parts.push(
      player.stadiumsBuilt > 0
        ? `${hit} tỷ (${player.stadiumsBuilt} sân × ${card.budgetPerStadium})`
        : "chưa xây sân mới nên thoát",
    );
  }
  if (typeof card.penaltyIfNoSecurity === "number") {
    if (player.securityReady) {
      parts.push("đã chi an ninh nên chặn được");
    } else {
      player.budgetB += card.penaltyIfNoSecurity;
      parts.push(`${card.penaltyIfNoSecurity} tỷ vì chưa lo an ninh`);
    }
  }
  const fifaGainB = card.fifaGainB ?? 0;
  if (fifaGainB) parts.push(`FIFA hốt +${fifaGainB} tỷ`);

  return { fifaGainB, log: parts.length ? parts.join(", ") : "không ảnh hưởng" };
}

interface AutoResult {
  fifaBankB: number;
  rngState: number;
  lastCard: EventCard | null;
  log: string;
}

/** Áp hiệu ứng ô tự động (không cần người chơi chọn). */
function applyAutoTile(
  player: Player,
  tile: Tile,
  rngState: number,
  fifaBankB: number,
): AutoResult {
  if (tile.kind === "tourism") {
    const gain = COUNTRY_PROFILES[player.profile].tourismBaseB;
    player.tourismIncomeB += gain;
    return { fifaBankB, rngState, lastCard: null, log: `${player.name} thu +${gain} tỷ du lịch trong mùa giải.` };
  }
  if (tile.kind === "security") {
    player.budgetB -= SECURITY_COST_B;
    player.securityReady = true;
    return {
      fifaBankB,
      rngState,
      lastCard: null,
      log: `${player.name} chi ${SECURITY_COST_B} tỷ an ninh — chặn được thẻ tấn công mạng lượt này.`,
    };
  }
  if (tile.kind === "fifa") {
    player.budgetB -= FIFA_FEE_B;
    const bank = fifaBankB + FIFA_FEE_B;
    return {
      fifaBankB: bank,
      rngState,
      lastCard: null,
      log: `${player.name} nộp ${FIFA_FEE_B} tỷ cho FIFA. Két FIFA giờ ${bank} tỷ.`,
    };
  }
  if (tile.kind === "event") {
    const drawn = drawEvent(rngState);
    const res = applyEvent(player, drawn.card);
    return {
      fifaBankB: fifaBankB + res.fifaGainB,
      rngState: drawn.state,
      lastCard: drawn.card,
      log: `${drawn.card.title}: ${res.log}.`,
    };
  }
  if (tile.kind === "corner") {
    return {
      fifaBankB,
      rngState,
      lastCard: null,
      log: `${player.name} ghé ${tile.label} — chỉ đi qua, không tốn gì.`,
    };
  }
  return { fifaBankB, rngState, lastCard: null, log: `${player.name} đi qua ${tile.label}.` };
}

/** Đổ xúc xắc + di chuyển. Qua ô Xuất phát thì cấp ngân sách kỳ mới. */
export function rollAndMove(state: GameState): GameState {
  if (state.phase !== "rolling") return state;

  const { value, state: rngAfterDice } = nextRandom(state.rngState);
  const roll = 1 + Math.floor(value * 6);

  const players = state.players.map((p) => ({ ...p }));
  const player = players[state.current]!;
  const tileCount = BOARD_TILES.length;
  const raw = player.position + roll;
  const passedStart = raw >= tileCount;
  player.position = raw % tileCount;

  let lapLog = "";
  if (passedStart) {
    const gain = COUNTRY_PROFILES[player.profile].budgetPerLap;
    player.budgetB += gain;
    player.securityReady = false; // kỳ mới, an ninh phải lo lại
    lapLog = `Qua kỳ mới: +${gain} tỷ ngân sách. `;
  }

  const tile = BOARD_TILES[player.position]!;
  const options = optionsForTile(tile);

  if (options) {
    return {
      ...state,
      players,
      rngState: rngAfterDice,
      lastRoll: roll,
      pendingTile: tile,
      pendingOptions: options,
      lastCard: null,
      lastLog: `${lapLog}Dừng ở ô ${tile.label} — chọn mức chi.`,
      phase: "choosing",
    };
  }

  const auto = applyAutoTile(player, tile, rngAfterDice, state.fifaBankB);
  return {
    ...state,
    players,
    fifaBankB: auto.fifaBankB,
    rngState: auto.rngState,
    lastRoll: roll,
    pendingTile: tile,
    pendingOptions: null,
    lastCard: auto.lastCard,
    lastLog: `${lapLog}${auto.log}`,
    phase: "result",
  };
}

/** Áp mức chi người chơi chọn trên ô xây (stadium / transport / welfare). */
function applyBuildOption(player: Player, opt: BuildOption): string {
  const parts: string[] = [`chi ${opt.costB} tỷ`];
  player.budgetB -= opt.costB;
  if (opt.legacy) {
    player.legacy += opt.legacy;
    parts.push(`+${opt.legacy} di sản`);
  }
  if (opt.socialHarmony) {
    player.socialHarmony += opt.socialHarmony;
    parts.push(`${opt.socialHarmony > 0 ? "+" : ""}${opt.socialHarmony} hài hòa`);
  }
  if (opt.socialSpendB) player.socialSpendB += opt.socialSpendB;
  if (opt.stadiums) {
    player.stadiumsBuilt += opt.stadiums;
    parts.push(`+${opt.stadiums} sân`);
  }
  return parts.join(", ");
}

/** Người chơi chọn mức chi trên ô xây; áp hiệu ứng và chuyển sang "result". */
export function resolveChoice(state: GameState, optionId: string): GameState {
  if (state.phase !== "choosing" || !state.pendingOptions) return state;

  const players = state.players.map((p) => ({ ...p }));
  const player = players[state.current]!;
  const opt = state.pendingOptions.find((o) => o.id === optionId) ?? state.pendingOptions[0]!;
  const detail = applyBuildOption(player, opt);

  return {
    ...state,
    players,
    pendingOptions: null,
    lastLog: `${player.name}: ${opt.label} — ${detail}.`,
    phase: "result",
  };
}

/** Sang lượt kế; kết thúc khi mọi người đã đi đủ số lượt. */
export function endTurn(state: GameState): GameState {
  if (state.phase !== "result") return state;

  const nextIndex = (state.current + 1) % state.players.length;
  const wrapped = nextIndex === 0;
  const nextTurn = wrapped ? state.turn + 1 : state.turn;

  if (nextTurn > state.turnsPerPlayer) {
    return { ...state, phase: "gameover" };
  }

  return {
    ...state,
    current: nextIndex,
    turn: nextTurn,
    phase: "rolling",
    pendingTile: null,
    pendingOptions: null,
    lastCard: null,
    lastLog: "",
  };
}

/** Điểm phúc lợi ròng — thắng bằng cái này, KHÔNG bằng làm đối thủ phá sản. */
export function scorePlayer(p: Player): ScoreBreakdown {
  const legacy = p.legacy;
  const socialHarmony = p.socialHarmony;
  const tourismPts = p.tourismIncomeB * 3;
  const debtPenalty = p.budgetB < 0 ? Math.abs(p.budgetB) * 1.5 : 0;
  // Sân trắng: xây nhiều sân mà không đỡ bằng du lịch/an sinh thì bị phạt
  const whiteElephantPenalty = Math.max(
    0,
    p.stadiumsBuilt * 8 - p.tourismIncomeB * 2 - p.socialSpendB * 0.5,
  );
  const net = Math.round(
    legacy + socialHarmony + tourismPts - debtPenalty - whiteElephantPenalty,
  );
  return {
    playerId: p.id,
    legacy: Math.round(legacy),
    socialHarmony: Math.round(socialHarmony),
    tourismPts: Math.round(tourismPts),
    debtPenalty: Math.round(debtPenalty),
    whiteElephantPenalty: Math.round(whiteElephantPenalty),
    net,
  };
}

/** Bảng xếp hạng cuối, cao → thấp theo điểm ròng. */
export function finalRanking(state: GameState): { player: Player; score: ScoreBreakdown }[] {
  return state.players
    .map((player) => ({ player, score: scorePlayer(player) }))
    .sort((a, b) => b.score.net - a.score.net);
}
