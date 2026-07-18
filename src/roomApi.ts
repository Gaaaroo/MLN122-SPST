/**
 * Lớp giao tiếp Firestore cho phòng chơi online.
 * Mỗi phòng là 1 document `rooms/{CODE}`. GameState lưu nguyên trong doc,
 * mọi máy nghe qua onSnapshot; chỉ người tới lượt mới ghi state mới.
 */
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { createGame } from "./boardgameLogic";
import type { CountryArchetype, GameState } from "./boardgameTypes";
import type { LobbyPlayer, Room } from "./roomTypes";

const CLIENT_KEY = "wc_client_id";
const MAX_PLAYERS = 4;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ 0/O/1/I dễ nhầm

/** ID cố định cho thiết bị này (lưu localStorage) — xác định mình là người chơi nào. */
export function getClientId(): string {
  let id = localStorage.getItem(CLIENT_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    localStorage.setItem(CLIENT_KEY, id);
  }
  return id;
}

function genCode(len = 4): string {
  let s = "";
  for (let i = 0; i < len; i++) {
    s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return s;
}

function roomRef(code: string) {
  if (!db) throw new Error("Firebase chưa được cấu hình.");
  return doc(db, "rooms", code);
}

export async function createRoom(name: string, profile: CountryArchetype): Promise<string> {
  const clientId = getClientId();
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = genCode();
    const ref = roomRef(code);
    const snap = await getDoc(ref);
    if (snap.exists()) continue;
    const room: Room = {
      code,
      status: "lobby",
      hostClientId: clientId,
      turnsPerPlayer: 12,
      order: [],
      lobby: [{ clientId, name: name.trim() || "Chủ phòng", profile }],
      game: null,
    };
    await setDoc(ref, { ...room, updatedAt: serverTimestamp() });
    return code;
  }
  throw new Error("Không tạo được mã phòng, thử lại.");
}

export async function joinRoom(
  code: string,
  name: string,
  profile: CountryArchetype,
): Promise<void> {
  const clientId = getClientId();
  const ref = roomRef(code);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Không tìm thấy phòng với mã này.");
  const room = snap.data() as Room;
  if (room.status !== "lobby") throw new Error("Phòng đã bắt đầu chơi rồi.");
  if (room.lobby.some((p) => p.clientId === clientId)) return; // đã ở trong phòng
  if (room.lobby.length >= MAX_PLAYERS) throw new Error("Phòng đã đủ 4 người.");
  const lobby: LobbyPlayer[] = [
    ...room.lobby,
    { clientId, name: name.trim() || "Người chơi", profile },
  ];
  await updateDoc(ref, { lobby, updatedAt: serverTimestamp() });
}

export function subscribeRoom(code: string, cb: (room: Room | null) => void): () => void {
  return onSnapshot(roomRef(code), (snap) => {
    cb(snap.exists() ? (snap.data() as Room) : null);
  });
}

export async function updateMyLobby(
  code: string,
  room: Room,
  patch: Partial<Pick<LobbyPlayer, "name" | "profile">>,
): Promise<void> {
  const clientId = getClientId();
  const lobby = room.lobby.map((p) =>
    p.clientId === clientId ? { ...p, ...patch } : p,
  );
  await updateDoc(roomRef(code), { lobby, updatedAt: serverTimestamp() });
}

export async function setTurns(code: string, turnsPerPlayer: number): Promise<void> {
  await updateDoc(roomRef(code), { turnsPerPlayer, updatedAt: serverTimestamp() });
}

export async function startRoom(code: string, room: Room): Promise<void> {
  const order = room.lobby.map((p) => p.clientId);
  const game = createGame({
    players: room.lobby.map((p) => ({ name: p.name, profile: p.profile })),
    turnsPerPlayer: room.turnsPerPlayer,
    seed: Math.floor(Math.random() * 1_000_000_000),
  });
  await updateDoc(roomRef(code), {
    status: "playing",
    order,
    game,
    updatedAt: serverTimestamp(),
  });
}

export async function writeGame(code: string, game: GameState): Promise<void> {
  await updateDoc(roomRef(code), { game, updatedAt: serverTimestamp() });
}

export async function backToLobby(code: string): Promise<void> {
  await updateDoc(roomRef(code), {
    status: "lobby",
    game: null,
    order: [],
    updatedAt: serverTimestamp(),
  });
}

export async function leaveLobby(code: string, room: Room): Promise<void> {
  const clientId = getClientId();
  const lobby = room.lobby.filter((p) => p.clientId !== clientId);
  await updateDoc(roomRef(code), { lobby, updatedAt: serverTimestamp() });
}
