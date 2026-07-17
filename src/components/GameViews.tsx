/** Các mảnh giao diện dùng chung cho cả hotseat lẫn online. */
import { finalRanking, scorePlayer } from "../boardgameLogic";
import { BOARD_TILES, COUNTRY_PROFILES } from "../boardgameData";
import type { BuildOption, GameState } from "../boardgameTypes";

export const PLAYER_COLORS = [
  "var(--cyan)",
  "var(--green)",
  "var(--yellow)",
  "var(--orange)",
];
const DIE_FACES = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export function nf(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function optionSummary(o: BuildOption): string {
  const parts: string[] = [];
  if (o.legacy) parts.push(`+${o.legacy} di sản`);
  if (o.socialHarmony) {
    parts.push(`${o.socialHarmony > 0 ? "+" : ""}${o.socialHarmony} hài hòa`);
  }
  if (o.stadiums) parts.push(`+${o.stadiums} sân`);
  return parts.join(" · ") || "không đổi chỉ số";
}

/** Kích thước lưới bàn cờ (N×N). Vành ngoài có 4*(N-1) ô = 20 ô với N=6. */
const RING_N = 6;

/** Vị trí (row, col) trên lưới cho ô thứ i, đi ngược chiều kim đồng hồ từ góc phải-dưới. */
function ringPos(i: number, n = RING_N): { row: number; col: number } {
  const s = n - 1;
  if (i <= s) return { row: n, col: n - i }; // cạnh dưới, phải → trái
  if (i <= 2 * s) return { row: n - (i - s), col: 1 }; // cạnh trái, dưới → trên
  if (i <= 3 * s) return { row: 1, col: 1 + (i - 2 * s) }; // cạnh trên, trái → phải
  return { row: 1 + (i - 3 * s), col: n }; // cạnh phải, trên → dưới
}

const LEGEND = [
  { icon: "🏟️", label: "Sân vận động" },
  { icon: "🚇", label: "Giao thông" },
  { icon: "🏥", label: "An sinh" },
  { icon: "✈️", label: "Du lịch" },
  { icon: "🛡️", label: "An ninh" },
  { icon: "📜", label: "FIFA thu" },
  { icon: "❓", label: "Cơ hội / Khí vận" },
];

export function BoardLegend() {
  return (
    <div className="bg-legend">
      {LEGEND.map((l) => (
        <span key={l.label}>
          {l.icon} {l.label}
        </span>
      ))}
    </div>
  );
}

export function BoardTrack({ game }: { game: GameState }) {
  const current = game.players[game.current]!;
  return (
    <div className="bg-ring" aria-label="Bàn cờ">
      <div
        className="bg-ring-center"
        style={{ gridRow: `2 / ${RING_N}`, gridColumn: `2 / ${RING_N}` }}
      >
        <span className="bg-ring-brand">
          Ngân hàng
          <br />
          Liên minh
        </span>
        <span className="bg-ring-sub">World Cup Economics</span>
        {game.lastRoll > 0 && game.phase !== "rolling" && (
          <span className="bg-ring-die">{DIE_FACES[game.lastRoll]}</span>
        )}
      </div>
      {BOARD_TILES.map((t, i) => {
        const pos = ringPos(i);
        const here = game.players.filter((p) => p.position === i);
        const isCorner = i % (RING_N - 1) === 0;
        return (
          <div
            key={t.id}
            className={`bg-rtile ${isCorner ? "corner" : ""} ${current.position === i ? "active" : ""}`}
            style={{ gridRow: pos.row, gridColumn: pos.col }}
          >
            {t.group && <span className="bg-rtile-band" style={{ background: t.group }} />}
            <span className="bg-rtile-icon" aria-hidden>
              {t.icon}
            </span>
            <span className="bg-rtile-label">{t.label}</span>
            {here.length > 0 && (
              <div className="bg-rtokens">
                {here.map((p) => (
                  <span
                    key={p.id}
                    className="bg-token xs"
                    style={{ background: PLAYER_COLORS[p.id] }}
                    title={p.name}
                  >
                    {p.id + 1}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function PlayerCards({
  game,
  myPlayerId,
}: {
  game: GameState;
  myPlayerId?: number;
}) {
  return (
    <section className="bg-players">
      {game.players.map((p) => {
        const sc = scorePlayer(p);
        return (
          <article
            key={p.id}
            className={`bg-player panel ${p.id === game.current ? "active" : ""}`}
            style={{ borderTopColor: PLAYER_COLORS[p.id] }}
          >
            <h4 style={{ color: PLAYER_COLORS[p.id] }}>
              {p.name}
              {p.id === myPlayerId ? " (bạn)" : ""}
            </h4>
            <div className="bg-pstats">
              <span className={p.budgetB < 0 ? "neg" : ""}>💰 {nf(p.budgetB)} tỷ</span>
              <span>🏗️ {p.legacy} di sản</span>
              <span>🤝 {p.socialHarmony} hài hòa</span>
              <span>✈️ {nf(p.tourismIncomeB)} tỷ</span>
              <span>🏟️ {p.stadiumsBuilt} sân</span>
              <span className="bg-pnet">Ròng: {sc.net}đ</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

interface ActionPanelProps {
  game: GameState;
  canAct: boolean;
  onRoll: () => void;
  onChoose: (optionId: string) => void;
  onNext: () => void;
}

export function ActionPanel({ game, canAct, onRoll, onChoose, onNext }: ActionPanelProps) {
  const current = game.players[game.current]!;
  const tile = game.pendingTile;
  const color = PLAYER_COLORS[current.id];

  if (game.phase === "rolling") {
    return (
      <section className="bg-action panel">
        <div className="bg-roll">
          {canAct ? (
            <>
              <p className="bg-action-lead">
                <strong style={{ color }}>{current.name}</strong>, tới lượt bạn.
              </p>
              <button type="button" className="btn-primary bg-dice-btn" onClick={onRoll}>
                🎲 Đổ xúc xắc
              </button>
            </>
          ) : (
            <p className="bg-wait">
              ⏳ Đang chờ <strong style={{ color }}>{current.name}</strong> đổ xúc xắc…
            </p>
          )}
        </div>
      </section>
    );
  }

  if (game.phase === "choosing" && tile) {
    return (
      <section className="bg-action panel">
        <div className="bg-choose">
          <p className="bg-action-lead">
            <span className="bg-die">{DIE_FACES[game.lastRoll]}</span> Dừng ở{" "}
            <strong>
              {tile.icon} {tile.label}
            </strong>{" "}
            — {canAct ? "chọn mức chi:" : `chờ ${current.name} chọn mức chi:`}
          </p>
          <p className="bg-tile-blurb">{tile.blurb}</p>
          <div className="bg-options">
            {game.pendingOptions?.map((o) => (
              <button
                key={o.id}
                type="button"
                className="bg-option"
                disabled={!canAct}
                onClick={() => onChoose(o.id)}
              >
                <span className="bg-option-label">{o.label}</span>
                <span className="bg-option-cost">Chi {nf(o.costB)} tỷ</span>
                <span className="bg-option-effect">{optionSummary(o)}</span>
                <span className="bg-option-hint">{o.hint}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (game.phase === "result" && tile) {
    return (
      <section className="bg-action panel">
        <div className="bg-result">
          <p className="bg-action-lead">
            <span className="bg-die">{DIE_FACES[game.lastRoll]}</span>{" "}
            <strong>
              {tile.icon} {tile.label}
            </strong>
          </p>
          {game.lastCard ? (
            <article className="bg-card">
              <span className="bg-card-tag">{game.lastCard.tag}</span>
              <h4>{game.lastCard.title}</h4>
              <p>{game.lastCard.detail}</p>
              <p className="bg-card-effect">{game.lastLog}</p>
            </article>
          ) : (
            <p className="bg-result-log">{game.lastLog}</p>
          )}
          {canAct ? (
            <button type="button" className="btn-primary" onClick={onNext}>
              Lượt tiếp →
            </button>
          ) : (
            <p className="bg-wait">
              ⏳ Chờ <strong style={{ color }}>{current.name}</strong> sang lượt…
            </p>
          )}
        </div>
      </section>
    );
  }

  return null;
}

interface PlayAreaProps {
  game: GameState;
  canAct: boolean;
  onRoll: () => void;
  onChoose: (optionId: string) => void;
  onNext: () => void;
  myPlayerId?: number;
}

/** Bố cục lúc chơi: bàn cờ + ô hành động bên trái, thẻ người chơi bên phải. */
export function PlayArea({
  game,
  canAct,
  onRoll,
  onChoose,
  onNext,
  myPlayerId,
}: PlayAreaProps) {
  return (
    <div className="bg-play">
      <div className="bg-play-board">
        <BoardLegend />
        <BoardTrack game={game} />
        <ActionPanel
          game={game}
          canAct={canAct}
          onRoll={onRoll}
          onChoose={onChoose}
          onNext={onNext}
        />
      </div>
      <PlayerCards game={game} myPlayerId={myPlayerId} />
    </div>
  );
}

export function EndScreen({
  game,
  onReplay,
  onExit,
  replayLabel = "Chơi lại",
  myPlayerId,
}: {
  game: GameState;
  onReplay: () => void;
  onExit: () => void;
  replayLabel?: string;
  myPlayerId?: number;
}) {
  const ranking = finalRanking(game);
  const losers = game.players.filter((p) => p.budgetB < 0).length;

  return (
    <>
      <section className="bg-end-ranking">
        {ranking.map(({ player, score }, rank) => (
          <article key={player.id} className={`bg-rank panel ${rank === 0 ? "win" : ""}`}>
            <div className="bg-rank-head">
              <span className="bg-rank-pos">{rank === 0 ? "🏆" : `#${rank + 1}`}</span>
              <span className="bg-rank-name" style={{ color: PLAYER_COLORS[player.id] }}>
                {player.name}
                {player.id === myPlayerId ? " (bạn)" : ""}
              </span>
              <span className="bg-rank-arch">{COUNTRY_PROFILES[player.profile].label}</span>
              <span className="bg-rank-net">{score.net}đ</span>
            </div>
            <div className="bg-breakdown">
              <span className="bg-chip up">+{score.legacy} di sản</span>
              <span className="bg-chip up">+{score.socialHarmony} hài hòa</span>
              <span className="bg-chip up">+{score.tourismPts} du lịch</span>
              {score.debtPenalty > 0 && (
                <span className="bg-chip down">−{score.debtPenalty} nợ</span>
              )}
              {score.whiteElephantPenalty > 0 && (
                <span className="bg-chip down">−{score.whiteElephantPenalty} sân trắng</span>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="bg-punchline panel">
        <h3>Két FIFA: {nf(game.fifaBankB)} tỷ</h3>
        <p>
          {losers > 0
            ? `${losers}/${game.players.length} nước chủ nhà kết thúc trong nợ, nhưng FIFA vẫn hốt đều tay mỗi lượt. `
            : "Dù nước nào thắng, FIFA vẫn thu bản quyền, tài trợ và ưu đãi thuế mỗi lượt. "}
          Đó là mô hình: <strong>ai sở hữu thương hiệu thì hưởng, ai bỏ tiền xây thì gánh</strong> — nhà cái luôn thắng.
        </p>
      </section>

      <div className="bg-end-actions">
        <button type="button" className="btn-primary" onClick={onReplay}>
          {replayLabel}
        </button>
        <button type="button" className="btn-ghost" onClick={onExit}>
          Thoát
        </button>
      </div>
    </>
  );
}
