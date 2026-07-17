import { lazy, Suspense, useState } from "react";
import { createGame, endTurn, resolveChoice, rollAndMove } from "../boardgameLogic";
import { COUNTRY_PROFILES } from "../boardgameData";
import type { CountryArchetype, GameState } from "../boardgameTypes";
import { EndScreen, nf, PlayArea, PLAYER_COLORS } from "./GameViews";

// Tách riêng: Firebase chỉ tải khi người dùng vào chế độ online.
const OnlineGame = lazy(() => import("./OnlineGame"));

interface Props {
  onBack: () => void;
}

const ARCHETYPES: CountryArchetype[] = ["developing", "developed", "resource"];
const LENGTHS = [9, 12, 15];

type Mode = "menu" | "hotseat" | "online";

export default function BoardGameScreen({ onBack }: Props) {
  const [mode, setMode] = useState<Mode>("menu");

  if (mode === "online")
    return (
      <Suspense
        fallback={
          <div className="bg-page">
            <p className="bg-loading">Đang tải chế độ online…</p>
          </div>
        }
      >
        <OnlineGame onBack={() => setMode("menu")} />
      </Suspense>
    );
  if (mode === "hotseat") return <HotseatGame onBack={() => setMode("menu")} />;

  return (
    <div className="bg-page">
      <header className="bg-topbar">
        <button type="button" className="btn-ghost" onClick={onBack}>
          ← Quay lại
        </button>
        <div>
          <h1 className="bg-h1">Đường đến World Cup</h1>
          <p className="bg-sub">
            Cờ tỷ phú kinh tế mùa World Cup: mỗi người là một nước chủ nhà, FIFA là nhà cái.
            Ai để lại nhiều <strong>phúc lợi ròng</strong> nhất thì thắng.
          </p>
        </div>
      </header>

      <div className="bg-mode-grid">
        <button
          type="button"
          className="bg-mode-card panel"
          onClick={() => setMode("online")}
        >
          <span className="bg-mode-icon" aria-hidden>
            🌐
          </span>
          <h3>Chơi online (mã phòng)</h3>
          <p>Mỗi người một thiết bị, vào chung một phòng bằng mã. Cần mạng.</p>
        </button>
        <button
          type="button"
          className="bg-mode-card panel"
          onClick={() => setMode("hotseat")}
        >
          <span className="bg-mode-icon" aria-hidden>
            🖥️
          </span>
          <h3>Chơi chung 1 máy</h3>
          <p>2–4 người luân phiên trên cùng một màn hình. Không cần mạng.</p>
        </button>
      </div>
    </div>
  );
}

function HotseatGame({ onBack }: { onBack: () => void }) {
  const [game, setGame] = useState<GameState | null>(null);
  const [setup, setSetup] = useState<{ name: string; profile: CountryArchetype }[]>([
    { name: "Nước 1", profile: "developing" },
    { name: "Nước 2", profile: "developed" },
    { name: "Nước 3", profile: "resource" },
    { name: "Nước 4", profile: "developing" },
  ]);
  const [turns, setTurns] = useState(12);

  function start() {
    setGame(
      createGame({
        players: setup.map((p) => ({
          name: p.name.trim() || "Nước chủ nhà",
          profile: p.profile,
        })),
        turnsPerPlayer: turns,
        seed: Math.floor(Math.random() * 1_000_000_000),
      }),
    );
  }

  // SETUP
  if (!game) {
    return (
      <div className="bg-page">
        <header className="bg-topbar">
          <button type="button" className="btn-ghost" onClick={onBack}>
            ← Đổi cách chơi
          </button>
          <div>
            <h1 className="bg-h1">Chơi chung 1 máy</h1>
            <p className="bg-sub">Đặt tên và chọn mẫu nước cho 4 người chơi luân phiên.</p>
          </div>
        </header>

        <section className="bg-archetype-legend">
          {ARCHETYPES.map((a) => {
            const pr = COUNTRY_PROFILES[a];
            return (
              <article key={a} className="bg-legend-card panel">
                <h3>{pr.label}</h3>
                <p className="bg-legend-budget">Ngân sách đầu: {nf(pr.startingBudgetB)} tỷ</p>
                <p className="bg-legend-blurb">{pr.blurb}</p>
              </article>
            );
          })}
        </section>

        <section className="bg-setup panel">
          <h2 className="bg-section-title">Chọn 4 người chơi</h2>
          {setup.map((p, i) => (
            <div key={i} className="bg-setup-row">
              <span className="bg-token" style={{ background: PLAYER_COLORS[i] }}>
                {i + 1}
              </span>
              <input
                className="bg-name-input"
                value={p.name}
                maxLength={16}
                onChange={(e) =>
                  setSetup((s) => s.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                }
              />
              <div className="bg-archetype-pick">
                {ARCHETYPES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`bg-arch-btn ${p.profile === a ? "active" : ""}`}
                    onClick={() =>
                      setSetup((s) => s.map((x, j) => (j === i ? { ...x, profile: a } : x)))
                    }
                  >
                    {COUNTRY_PROFILES[a].label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-length">
            <span className="bg-length-label">Độ dài ván (lượt/người):</span>
            {LENGTHS.map((t) => (
              <button
                key={t}
                type="button"
                className={`bg-arch-btn ${turns === t ? "active" : ""}`}
                onClick={() => setTurns(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <button type="button" className="btn-primary bg-start" onClick={start}>
            Bắt đầu chơi 🎲
          </button>
        </section>
      </div>
    );
  }

  // GAME OVER
  if (game.phase === "gameover") {
    return (
      <div className="bg-page">
        <header className="bg-topbar">
          <button type="button" className="btn-ghost" onClick={onBack}>
            ← Đổi cách chơi
          </button>
          <div>
            <h1 className="bg-h1">Kết quả</h1>
            <p className="bg-sub">
              Xếp theo điểm phúc lợi ròng: di sản + hài hòa + du lịch − nợ − sân trắng.
            </p>
          </div>
        </header>
        <EndScreen game={game} onReplay={() => setGame(null)} onExit={onBack} />
      </div>
    );
  }

  // PLAYING
  const current = game.players[game.current]!;
  return (
    <div className="bg-page">
      <header className="bg-topbar">
        <button type="button" className="btn-ghost" onClick={onBack}>
          ← Thoát
        </button>
        <div className="bg-turnmeta">
          <span className="bg-turn-count">
            Lượt {game.turn}/{game.turnsPerPlayer}
          </span>
          <span className="bg-turn-now">
            Đến lượt:{" "}
            <strong style={{ color: PLAYER_COLORS[current.id] }}>{current.name}</strong>
          </span>
        </div>
        <span className="bg-fifa-pill">Két FIFA: {nf(game.fifaBankB)} tỷ</span>
      </header>

      <PlayArea
        game={game}
        canAct
        onRoll={() => setGame(rollAndMove(game))}
        onChoose={(id) => setGame(resolveChoice(game, id))}
        onNext={() => setGame(endTurn(game))}
      />
    </div>
  );
}
