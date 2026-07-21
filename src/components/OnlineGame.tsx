import { useEffect, useState } from "react";
import { endTurn, resolveChoice, rollAndMove } from "../boardgameLogic";
import { BOARD_TILES, COUNTRY_PROFILES } from "../boardgameData";
import type { CountryArchetype } from "../boardgameTypes";
import { firebaseReady } from "../firebase";
import {
  backToLobby,
  createRoom,
  getClientId,
  joinRoom,
  leaveLobby,
  setTurns,
  startRoom,
  subscribeRoom,
  updateMyLobby,
  writeGame,
} from "../roomApi";
import type { Room } from "../roomTypes";
import { EndScreen, nf, PlayArea, PLAYER_COLORS } from "./GameViews";

interface Props {
  onBack: () => void;
}

const ARCHETYPES: CountryArchetype[] = ["developing", "developed", "resource"];
const LENGTHS = [9, 12, 15];

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : "Có lỗi, thử lại.";
}

export default function OnlineGame({ onBack }: Props) {
  const clientId = getClientId();
  const [name, setName] = useState("");
  const [profile, setProfile] = useState<CountryArchetype>("developing");
  const [joinCode, setJoinCode] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    const unsub = subscribeRoom(code, (r) => {
      setRoom(r);
      setLoading(false);
    });
    return unsub;
  }, [code]);

  if (!firebaseReady) return <NotConfigured onBack={onBack} />;

  async function onCreate() {
    setError("");
    setBusy(true);
    try {
      setCode(await createRoom(name, profile));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  async function onJoin() {
    setError("");
    setBusy(true);
    try {
      const c = joinCode.trim().toUpperCase();
      if (!c) throw new Error("Nhập mã phòng.");
      await joinRoom(c, name, profile);
      setCode(c);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  async function leave() {
    if (code && room?.status === "lobby") {
      try {
        await leaveLobby(code, room);
      } catch {
        /* rời phòng lỗi cũng không sao */
      }
    }
    setCode(null);
    setRoom(null);
    onBack();
  }

  // ---------- ENTRY ----------
  if (!code || (!room && !loading)) {
    return (
      <div className="bg-page">
        <header className="bg-topbar">
          <button type="button" className="btn-ghost" onClick={onBack}>
            ← Đổi cách chơi
          </button>
          <div>
            <h1 className="bg-h1">Chơi online</h1>
            <p className="bg-sub">
              Tạo phòng rồi gửi mã cho bạn bè, hoặc nhập mã để vào phòng có sẵn. Mỗi người
              chơi trên thiết bị của mình.
            </p>
          </div>
        </header>

        <section className="bg-online-entry panel">
          <label className="bg-field">
            <span>Tên của bạn</span>
            <input
              className="bg-name-input wide"
              value={name}
              maxLength={16}
              placeholder="VD: Minh"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <div className="bg-field">
            <span>Mẫu nước chủ nhà</span>
            <div className="bg-archetype-pick">
              {ARCHETYPES.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`bg-arch-btn ${profile === a ? "active" : ""}`}
                  onClick={() => setProfile(a)}
                >
                  {COUNTRY_PROFILES[a].label}
                </button>
              ))}
            </div>
            <p className="bg-legend-blurb">{COUNTRY_PROFILES[profile].blurb}</p>
          </div>

          {error && <p className="bg-error">{error}</p>}

          <div className="bg-entry-actions">
            <button type="button" className="btn-primary" disabled={busy} onClick={onCreate}>
              Tạo phòng mới
            </button>
            <div className="bg-join-row">
              <input
                className="bg-name-input code"
                value={joinCode}
                maxLength={5}
                placeholder="MÃ PHÒNG"
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              />
              <button type="button" className="btn-ghost" disabled={busy} onClick={onJoin}>
                Vào phòng
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (loading || !room) {
    return (
      <div className="bg-page">
        <p className="bg-loading">Đang vào phòng {code}…</p>
      </div>
    );
  }

  const myPlayerId = room.order.indexOf(clientId);
  const isHost = room.hostClientId === clientId;

  // ---------- LOBBY ----------
  if (room.status === "lobby") {
    const inRoom = room.lobby.some((p) => p.clientId === clientId);
    return (
      <div className="bg-page">
        <header className="bg-topbar">
          <button type="button" className="btn-ghost" onClick={leave}>
            ← Rời phòng
          </button>
          <div>
            <h1 className="bg-h1">Phòng chờ</h1>
            <p className="bg-sub">Gửi mã dưới đây cho bạn bè để họ vào cùng.</p>
          </div>
        </header>

        <section className="bg-code-display panel">
          <span className="bg-code-label">Mã phòng</span>
          <span className="bg-code">{room.code}</span>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => navigator.clipboard?.writeText(room.code).catch(() => {})}
          >
            Sao chép
          </button>
        </section>

        <section className="bg-roster panel">
          <h2 className="bg-section-title">Người chơi ({room.lobby.length}/4)</h2>
          {room.lobby.map((p, i) => (
            <div key={p.clientId} className="bg-roster-row">
              <span className="bg-token" style={{ background: PLAYER_COLORS[i] }}>
                {i + 1}
              </span>
              <span className="bg-roster-name">
                {p.name}
                {p.clientId === clientId ? " (bạn)" : ""}
              </span>
              <span className="bg-roster-arch">{COUNTRY_PROFILES[p.profile].label}</span>
              {p.clientId === room.hostClientId && <span className="bg-host-badge">Chủ phòng</span>}
            </div>
          ))}

          {inRoom && (
            <div className="bg-my-controls">
              <input
                className="bg-name-input"
                value={room.lobby.find((p) => p.clientId === clientId)?.name ?? ""}
                maxLength={16}
                onChange={(e) => code && updateMyLobby(code, room, { name: e.target.value })}
              />
              <div className="bg-archetype-pick">
                {ARCHETYPES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`bg-arch-btn ${
                      room.lobby.find((p) => p.clientId === clientId)?.profile === a ? "active" : ""
                    }`}
                    onClick={() => code && updateMyLobby(code, room, { profile: a })}
                  >
                    {COUNTRY_PROFILES[a].label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="bg-lobby-start panel">
          {isHost ? (
            <>
              <div className="bg-length">
                <span className="bg-length-label">Độ dài ván (lượt/người):</span>
                {LENGTHS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`bg-arch-btn ${room.turnsPerPlayer === t ? "active" : ""}`}
                    onClick={() => code && setTurns(code, t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn-primary"
                disabled={room.lobby.length < 2}
                onClick={() => code && startRoom(code, room)}
              >
                Bắt đầu chơi 🎲
              </button>
              {room.lobby.length < 2 && (
                <p className="bg-wait">Cần ít nhất 2 người để bắt đầu.</p>
              )}
            </>
          ) : (
            <p className="bg-wait">
              ⏳ Đang chờ chủ phòng bắt đầu… (ván {room.turnsPerPlayer} lượt/người)
            </p>
          )}
        </section>
      </div>
    );
  }

  // ---------- PLAYING ----------
  const game = room.game!;
  const current = game.players[game.current]!;

  if (game.phase === "gameover") {
    return (
      <div className="bg-page">
        <header className="bg-topbar">
          <button type="button" className="btn-ghost" onClick={leave}>
            ← Thoát
          </button>
          <div>
            <h1 className="bg-h1">Kết quả</h1>
            <p className="bg-sub">Xếp hạng theo điểm phúc lợi.</p>
          </div>
        </header>
        <EndScreen
          game={game}
          myPlayerId={myPlayerId}
          replayLabel={isHost ? "Về sảnh, chơi lại" : "Chờ chủ phòng…"}
          replayDisabled={!isHost}
          onReplay={() => isHost && code && backToLobby(code)}
          onExit={leave}
        />
      </div>
    );
  }

  const canAct = myPlayerId === game.current;

  return (
    <div className="bg-page bg-page-play">
      <header className="bg-topbar">
        <button type="button" className="btn-ghost" onClick={leave}>
          ← Thoát
        </button>
        <div className="bg-turnmeta">
          <span className="bg-turn-count">
            Lượt {game.turn}/{game.turnsPerPlayer} - Phòng {room.code}
          </span>
          <span className="bg-turn-now">
            Đến lượt:{" "}
            <strong style={{ color: PLAYER_COLORS[current.id] }}>
              {current.name}
              {current.id === myPlayerId ? " (bạn)" : ""}
            </strong>
          </span>
          <span className="bg-turn-loc">
            Đang ở: {BOARD_TILES[current.position]!.icon}{" "}
            {BOARD_TILES[current.position]!.label}
          </span>
        </div>
        <span className="bg-fifa-pill">Két FIFA: {nf(game.fifaBankB)} tỷ</span>
      </header>

      <PlayArea
        game={game}
        canAct={canAct}
        myPlayerId={myPlayerId}
        onRoll={() => code && writeGame(code, rollAndMove(game))}
        onChoose={(id) => code && writeGame(code, resolveChoice(game, id))}
        onNext={() => code && writeGame(code, endTurn(game))}
      />
    </div>
  );
}

function NotConfigured({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-page">
      <header className="bg-topbar">
        <button type="button" className="btn-ghost" onClick={onBack}>
          ← Đổi cách chơi
        </button>
        <div>
          <h1 className="bg-h1">Chưa cấu hình Firebase</h1>
          <p className="bg-sub">Chế độ online cần một Firebase project (miễn phí). Làm theo các bước:</p>
        </div>
      </header>

      <section className="bg-setup-guide panel">
        <ol>
          <li>
            Vào <code>console.firebase.google.com</code> → <strong>Add project</strong> (đặt tên bất kỳ).
          </li>
          <li>
            Trong project: <strong>Build → Firestore Database → Create database</strong> → chọn
            <strong> Start in test mode</strong> (cho demo) → chọn location gần nhất.
          </li>
          <li>
            <strong>Project settings (⚙️) → General → Your apps →</strong> bấm icon Web <code>&lt;/&gt;</code>,
            đăng ký app, copy khối <code>firebaseConfig</code>.
          </li>
          <li>
            Tạo file <code>.env.local</code> ở thư mục gốc dự án (xem mẫu <code>.env.example</code>),
            điền các giá trị tương ứng.
          </li>
          <li>
            Chạy lại <code>npm run dev</code>. Xong — nút online sẽ hoạt động.
          </li>
        </ol>
        <p className="bg-legend-blurb">
          Lưu ý: "test mode" mở quyền đọc/ghi cho mọi người trong ~30 ngày — hợp cho demo môn học,
          không dùng cho sản phẩm thật.
        </p>
      </section>
    </div>
  );
}
