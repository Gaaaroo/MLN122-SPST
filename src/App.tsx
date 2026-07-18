import { useState } from "react";
import type { Screen } from "./types";
import OverviewPanel from "./components/OverviewPanel";
import { StoryLanding } from "./components/StoryLanding";
import BoardGameScreen from "./components/BoardGameScreen";
import type { OverviewConfig } from "./overviewTypes";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [overviewSeed, setOverviewSeed] = useState<
    Partial<OverviewConfig> | undefined
  >();

  if (screen === "landing") {
    return (
      <StoryLanding
        onExplore={() => {
          setOverviewSeed(undefined);
          setScreen("overview");
        }}
        onPlayGame={() => setScreen("boardgame")}
      />
    );
  }

  if (screen === "overview") {
    return (
      <OverviewPanel
        initial={overviewSeed}
        onBack={() => setScreen("landing")}
        onPlayGame={() => setScreen("boardgame")}
      />
    );
  }

  if (screen === "boardgame") {
    return <BoardGameScreen onBack={() => setScreen("landing")} />;
  }

  return null;
}
