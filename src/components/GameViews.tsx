/** Các mảnh giao diện dùng chung cho cả hotseat lẫn online. */
import { useEffect, useRef, useState } from 'react';
import { finalRanking, scorePlayer } from '../boardgameLogic';
import { BOARD_TILES, COUNTRY_PROFILES } from '../boardgameData';
import type { BuildOption, GameState } from '../boardgameTypes';

export const PLAYER_COLORS = [
  'var(--cyan)',
  'var(--green)',
  'var(--yellow)',
  'var(--orange)',
];
const DIE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export function nf(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function optionSummary(o: BuildOption): string {
  const parts: string[] = [];
  if (o.legacy) parts.push(`+${o.legacy} di sản`);
  if (o.socialHarmony) {
    parts.push(`${o.socialHarmony > 0 ? '+' : ''}${o.socialHarmony} hài hòa`);
  }
  if (o.stadiums) parts.push(`+${o.stadiums} sân`);
  return parts.join(' · ') || 'không đổi chỉ số';
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
  { icon: '🏟️', label: 'Sân vận động' },
  { icon: '🚇', label: 'Giao thông' },
  { icon: '🏥', label: 'An sinh' },
  { icon: '✈️', label: 'Du lịch' },
  { icon: '🛡️', label: 'An ninh' },
  { icon: '📜', label: 'FIFA thu' },
  { icon: '❓', label: 'Cơ hội / Khí vận' },
];

export function BoardLegend() {
  return (
    <div className='bg-legend'>
      {LEGEND.map((l) => (
        <span key={l.label}>
          {l.icon} {l.label}
        </span>
      ))}
    </div>
  );
}

interface BoardTrackProps {
  game: GameState;
  canAct?: boolean;
  /** Đang chạy hiệu ứng xúc xắc → khóa nút Gieo để khỏi bấm đúp. */
  rollBusy?: boolean;
  onRoll?: () => void;
}

export function BoardTrack({
  game,
  canAct = false,
  rollBusy = false,
  onRoll,
}: BoardTrackProps) {
  const current = game.players[game.current]!;
  const color = PLAYER_COLORS[current.id];
  return (
    <div
      className='bg-ring'
      aria-label='Bàn cờ'
    >
      <div
        className='bg-ring-center'
        style={{ gridRow: `2 / ${RING_N}`, gridColumn: `2 / ${RING_N}` }}
      >
        <span className='bg-ring-brand'>
          Ngân hàng
          <br />
          Liên minh
        </span>
        <span className='bg-ring-sub'>World Cup Economics</span>
        {game.phase === 'rolling' && !rollBusy ? (
          canAct && onRoll ? (
            <>
              <span
                className='bg-ring-turn'
                style={{ color }}
              >
                {current.name}
              </span>
              <button
                type='button'
                className='btn-primary bg-ring-roll'
                onClick={onRoll}
              >
                🎲 Gieo
              </button>
            </>
          ) : (
            <span className='bg-ring-wait'>
              ⏳ Chờ <strong style={{ color }}>{current.name}</strong> gieo…
            </span>
          )
        ) : (
          game.lastRoll > 0 && (
            <span className='bg-ring-die'>{DIE_FACES[game.lastRoll]}</span>
          )
        )}
      </div>
      {BOARD_TILES.map((t, i) => {
        const pos = ringPos(i);
        const here = game.players.filter((p) => p.position === i);
        const isCorner = i % (RING_N - 1) === 0;
        return (
          <div
            key={t.id}
            className={`bg-rtile ${isCorner ? 'corner' : ''} ${current.position === i ? 'active' : ''}`}
            style={{ gridRow: pos.row, gridColumn: pos.col }}
          >
            {t.group && (
              <span
                className='bg-rtile-band'
                style={{ background: t.group }}
              />
            )}
            <span
              className='bg-rtile-icon'
              aria-hidden
            >
              {t.icon}
            </span>
            <span className='bg-rtile-label'>{t.label}</span>
            {here.length > 0 && (
              <div className='bg-rtokens'>
                {here.map((p) => (
                  <span
                    key={p.id}
                    className='bg-token xs'
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

/**
 * Lớp phủ "zoom" xúc xắc: khi có lượt đổ mới, phóng to con xúc xắc ra giữa màn
 * hình cho dễ nhìn, quay vài nhịp rồi dừng đúng số đã đổ (`game.lastRoll`), sau
 * đó tự tắt. Chạy chung cho cả hotseat lẫn online — mọi máy đều thấy cú đổ.
 */
function DiceRollOverlay({
  game,
  onBusyChange,
}: {
  game: GameState;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [dice, setDice] = useState<{
    face: number;
    stage: 'spin' | 'land' | 'leave';
  } | null>(null);
  const lastSig = useRef<string | null>(null);
  const initialized = useRef(false);
  const timers = useRef<number[]>([]);

  const rolled = game.phase === 'choosing' || game.phase === 'result';
  // Mỗi (lượt, người chơi) chỉ đổ đúng một lần → dùng làm chữ ký cú đổ.
  const sig = `${game.turn}-${game.current}`;

  useEffect(() => {
    // Vào ván ngay giữa lượt (ví dụ mới join phòng online): nhận cú đổ hiện tại
    // là "đã xem", không phát hiệu ứng.
    if (!initialized.current) {
      initialized.current = true;
      if (rolled && game.lastRoll >= 1) {
        lastSig.current = sig;
        return;
      }
    }
    if (!rolled || game.lastRoll < 1 || lastSig.current === sig) return;
    lastSig.current = sig;

    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current.forEach((t) => window.clearInterval(t));
    timers.current = [];

    // Bắt đầu đổ: báo "bận" để bảng hành động ẩn đi cho đến khi xúc xắc dừng.
    onBusyChange?.(true);
    const result = game.lastRoll;
    const spin = window.setInterval(() => {
      setDice({ face: 1 + Math.floor(Math.random() * 6), stage: 'spin' });
    }, 80);
    timers.current.push(spin);
    timers.current.push(
      window.setTimeout(() => {
        window.clearInterval(spin);
        setDice({ face: result, stage: 'land' });
      }, 620),
      window.setTimeout(
        () => setDice((d) => (d ? { ...d, stage: 'leave' } : d)),
        1350,
      ),
      window.setTimeout(() => {
        // Xúc xắc biến mất → mới cho phép thẻ/bảng lệnh hiện ra.
        setDice(null);
        onBusyChange?.(false);
      }, 1650),
    );
  }, [sig, rolled, game.lastRoll, onBusyChange]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current.forEach((t) => window.clearInterval(t));
    },
    [],
  );

  if (!dice) return null;
  const player = game.players[game.current]!;
  return (
    <div
      className={`bg-diceroll ${dice.stage === 'leave' ? 'leaving' : ''}`}
      aria-hidden
    >
      <div className={`bg-diceroll-die ${dice.stage}`}>
        {DIE_FACES[dice.face]}
      </div>
      {dice.stage !== 'spin' && (
        <p className='bg-diceroll-caption'>
          <strong style={{ color: PLAYER_COLORS[player.id] }}>
            {player.name}
          </strong>{' '}
          đổ được <strong>{dice.face}</strong>
        </p>
      )}
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
    <section className='bg-players'>
      {game.players.map((p) => {
        const sc = scorePlayer(p);
        return (
          <article
            key={p.id}
            className={`bg-player panel ${p.id === game.current ? 'active' : ''}`}
            style={{ borderTopColor: PLAYER_COLORS[p.id] }}
          >
            <h4 style={{ color: PLAYER_COLORS[p.id] }}>
              {p.name}
              {p.id === myPlayerId ? ' (bạn)' : ''}
            </h4>
            <div className='bg-pstats'>
              <span className={p.budgetB < 0 ? 'neg' : ''}>
                💰 {nf(p.budgetB)} tỷ
              </span>
              <span>🏗️ {p.legacy} di sản</span>
              <span>🤝 {p.socialHarmony} hài hòa</span>
              <span>✈️ {nf(p.tourismIncomeB)} tỷ</span>
              <span>🏟️ {p.stadiumsBuilt} sân</span>
              <span className='bg-pnet'>Phúc lợi ròng: {sc.net}đ</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

interface TurnPopupsProps {
  game: GameState;
  canAct: boolean;
  onChoose: (optionId: string) => void;
  onNext: () => void;
}

/** Số giây được suy nghĩ ở ô lựa chọn trước khi hệ thống tự chọn giúp. */
const CHOOSE_SECONDS = 10;

/**
 * Popup giữa màn hình cho mọi diễn biến sau cú gieo: ô có lựa chọn (chọn mức
 * chi) lẫn ô tự động (Cơ hội, Khí vận, FIFA thu…). Ô lựa chọn có 10 giây đếm
 * ngược — hết giờ tự chọn mức chi thấp nhất. Thẻ kết quả chờ bấm OK để sang lượt.
 */
function TurnPopups({ game, canAct, onChoose, onNext }: TurnPopupsProps) {
  const current = game.players[game.current]!;
  const tile = game.pendingTile;
  const color = PLAYER_COLORS[current.id];
  const card = game.lastCard;

  // Đếm ngược ở pha chọn; dừng hẳn tại 0 để effect auto-chọn bên dưới chỉ chạy một lần.
  const [countdown, setCountdown] = useState(CHOOSE_SECONDS);
  useEffect(() => {
    if (game.phase !== 'choosing') return;
    setCountdown(CHOOSE_SECONDS);
    const t = window.setInterval(
      () => setCountdown((c) => (c > 0 ? c - 1 : c)),
      1000,
    );
    return () => window.clearInterval(t);
  }, [game.phase, game.turn, game.current]);

  useEffect(() => {
    if (game.phase !== 'choosing' || !canAct || countdown > 0) return;
    const opts = game.pendingOptions;
    if (!opts || opts.length === 0) return;
    const cheapest = opts.reduce((a, b) => (b.costB < a.costB ? b : a));
    onChoose(cheapest.id);
    // onChoose được tạo mới mỗi render nên không đưa vào deps.
  }, [countdown, game.phase, canAct]);

  if (game.phase === 'choosing' && tile) {
    return (
      <div
        className='bg-choose-modal'
        role='dialog'
        aria-modal='true'
      >
        <div className='bg-choose-modal-card'>
          <header
            className='bg-choose-head'
            style={{ background: color }}
          >
            <span className='bg-choose-head-title'>
              {tile.icon} {tile.label}
            </span>
            <span className='bg-choose-head-side'>
              <span
                className={`bg-choose-timer${countdown <= 3 ? ' danger' : ''}`}
                role='timer'
              >
                ⏱ {countdown}s
              </span>
              <span
                className='bg-choose-head-die'
                aria-hidden
              >
                {DIE_FACES[game.lastRoll]}
              </span>
            </span>
          </header>
          <div className='bg-choose-body'>
            <div
              className='bg-choose-icon'
              aria-hidden
            >
              {tile.icon}
            </div>
            <p className='bg-choose-lead'>
              <strong style={{ color }}>{current.name}</strong>{' '}
              {canAct ? 'chọn mức chi:' : 'đang chọn mức chi…'}
            </p>
            <p className='bg-tile-blurb'>{tile.blurb}</p>
            <div className='bg-options'>
              {game.pendingOptions?.map((o) => (
                <button
                  key={o.id}
                  type='button'
                  className='bg-option'
                  disabled={!canAct}
                  onClick={() => onChoose(o.id)}
                >
                  <span className='bg-option-label'>{o.label}</span>
                  <span className='bg-option-cost'>Chi {nf(o.costB)} tỷ</span>
                  <span className='bg-option-effect'>{optionSummary(o)}</span>
                  <span className='bg-option-hint'>{o.hint}</span>
                </button>
              ))}
            </div>
            <p className='bg-choose-balance'>
              Ngân sách còn: <strong>{nf(current.budgetB)} tỷ</strong> 💰
            </p>
            <p className='bg-choose-timeout-hint'>
              Hết {CHOOSE_SECONDS}s sẽ tự chọn mức chi thấp nhất.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (game.phase === 'result' && tile) {
    return (
      <div
        className='bg-choose-modal'
        role='dialog'
        aria-modal='true'
      >
        <div className='bg-choose-modal-card'>
          <header
            className='bg-choose-head'
            style={{ background: color }}
          >
            <span className='bg-choose-head-title'>
              {card ? card.title : `${tile.icon} ${tile.label}`}
            </span>
            {game.lastRoll > 0 && (
              <span
                className='bg-choose-head-die'
                aria-hidden
              >
                {DIE_FACES[game.lastRoll]}
              </span>
            )}
          </header>
          <div className='bg-choose-body'>
            <div
              className='bg-choose-icon'
              aria-hidden
            >
              {tile.icon}
            </div>
            {card && <span className='bg-choose-tag'>{card.tag}</span>}
            {card && <p className='bg-tile-blurb'>{card.detail}</p>}
            <p className='bg-result-big'>{game.lastLog}</p>
            <p className='bg-choose-balance'>
              Ngân sách còn: <strong>{nf(current.budgetB)} tỷ</strong> 💰
            </p>
            {canAct ? (
              <button
                type='button'
                className='btn-primary bg-ok-btn'
                onClick={onNext}
              >
                OK — sang lượt
              </button>
            ) : (
              <p className='bg-choose-auto'>
                Chờ <strong style={{ color }}>{current.name}</strong> bấm OK…
              </p>
            )}
          </div>
        </div>
      </div>
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

/** Bố cục lúc chơi: bàn cờ (nút Gieo ở giữa) + popup diễn biến, thẻ người chơi bên phải. */
export function PlayArea({
  game,
  canAct,
  onRoll,
  onChoose,
  onNext,
  myPlayerId,
}: PlayAreaProps) {
  // Đang chạy hiệu ứng xúc xắc → giấu popup; chỉ hiện thẻ (kèm animation) sau
  // khi con xúc xắc dừng, để "xúc xắc trước, thẻ sau".
  const [rollBusy, setRollBusy] = useState(false);

  return (
    <div className='bg-play'>
      <DiceRollOverlay
        game={game}
        onBusyChange={setRollBusy}
      />
      <div className='bg-play-board'>
        <BoardLegend />
        <BoardTrack
          game={game}
          canAct={canAct}
          rollBusy={rollBusy}
          onRoll={() => {
            setRollBusy(true); // khóa nút Gieo ngay, chờ hiệu ứng xúc xắc
            onRoll();
          }}
        />
        {!rollBusy && (
          <TurnPopups
            game={game}
            canAct={canAct}
            onChoose={onChoose}
            onNext={onNext}
          />
        )}
      </div>
      <PlayerCards
        game={game}
        myPlayerId={myPlayerId}
      />
    </div>
  );
}

export function EndScreen({
  game,
  onReplay,
  onExit,
  replayLabel = 'Chơi lại',
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
      <section className='bg-end-ranking'>
        {ranking.map(({ player, score }, rank) => (
          <article
            key={player.id}
            className={`bg-rank panel ${rank === 0 ? 'win' : ''}`}
          >
            <div className='bg-rank-head'>
              <span className='bg-rank-pos'>
                {rank === 0 ? '🏆' : `#${rank + 1}`}
              </span>
              <span
                className='bg-rank-name'
                style={{ color: PLAYER_COLORS[player.id] }}
              >
                {player.name}
                {player.id === myPlayerId ? ' (bạn)' : ''}
              </span>
              <span className='bg-rank-arch'>
                {COUNTRY_PROFILES[player.profile].label}
              </span>
              <span className='bg-rank-net'>{score.net}đ</span>
            </div>
            <div className='bg-breakdown'>
              <span className='bg-chip up'>+{score.legacy} di sản</span>
              <span className='bg-chip up'>+{score.socialHarmony} hài hòa</span>
              <span className='bg-chip up'>+{score.tourismPts} du lịch</span>
              {score.debtPenalty > 0 && (
                <span className='bg-chip down'>−{score.debtPenalty} nợ</span>
              )}
              {score.whiteElephantPenalty > 0 && (
                <span className='bg-chip down'>
                  −{score.whiteElephantPenalty} sân trắng
                </span>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className='bg-punchline panel'>
        <h3>Két FIFA: {nf(game.fifaBankB)} tỷ</h3>
        <p>
          {losers > 0
            ? `${losers}/${game.players.length} nước chủ nhà kết thúc trong nợ, nhưng FIFA vẫn hốt đều tay mỗi lượt. `
            : 'Dù nước nào thắng, FIFA vẫn thu bản quyền, tài trợ và ưu đãi thuế mỗi lượt. '}
          Đó là mô hình:{' '}
          <strong>
            ai sở hữu thương hiệu thì hưởng, ai bỏ tiền xây thì gánh
          </strong>{' '}
          — nhà cái luôn thắng.
        </p>
      </section>

      <div className='bg-end-actions'>
        <button
          type='button'
          className='btn-primary'
          onClick={onReplay}
        >
          {replayLabel}
        </button>
        <button
          type='button'
          className='btn-ghost'
          onClick={onExit}
        >
          Thoát
        </button>
      </div>
    </>
  );
}
