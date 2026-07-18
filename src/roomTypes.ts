import type { CountryArchetype, GameState } from "./boardgameTypes";

export interface LobbyPlayer {
  clientId: string;
  name: string;
  profile: CountryArchetype;
}

export interface Room {
  code: string;
  status: "lobby" | "playing";
  hostClientId: string;
  turnsPerPlayer: number;
  /** clientId theo đúng thứ tự player index sau khi bắt đầu (map client ↔ người chơi) */
  order: string[];
  lobby: LobbyPlayer[];
  game: GameState | null;
}
