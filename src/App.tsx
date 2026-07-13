import { useCallback, useEffect, useState } from "react";
import {
  applyQuickAction,
  createFifaState,
  createHostState,
  simulateFifaTurn,
  simulateTurn,
} from "./gameLogic";
import type {
  CountryId,
  FifaState,
  HostState,
  QuickAction,
  Screen,
} from "./types";
import { FIFA_TURN_EVENTS, TURN_EVENTS } from "./types";
import OverviewPanel from "./components/OverviewPanel";
import { StoryLanding } from "./components/StoryLanding";
import { SelectCountryScreen } from "./components/SelectCountryScreen";
import { HostScreen } from "./components/HostScreen";
import { HostResultScreen } from "./components/HostResultScreen";
import { FifaScreen } from "./components/FifaScreen";
import { FifaResultScreen } from "./components/FifaResultScreen";
import { configFromHost } from "./overviewLogic";
import type { OverviewConfig } from "./overviewTypes";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [host, setHost] = useState<HostState | null>(null);
  const [fifa, setFifa] = useState<FifaState | null>(null);
  const [showTimeToast, setShowTimeToast] = useState(false);
  const [pendingEmergency, setPendingEmergency] = useState(false);
  const [overviewSeed, setOverviewSeed] = useState<
    Partial<OverviewConfig> | undefined
  >();

  const handleStartCountry = (id: CountryId) => {
    const next = createHostState(id);
    next.eventText = TURN_EVENTS[1] ?? "";
    setHost(next);
    setPendingEmergency(false);
    setScreen("host");
  };

  const patchHost = useCallback((patch: Partial<HostState>) => {
    setHost((h) => (h ? { ...h, ...patch } : h));
  }, []);

  useEffect(() => {
    if (screen !== "host" || !host || host.turn > host.maxTurns) return;

    const id = setInterval(() => {
      setHost((h) => {
        if (!h || h.timer <= 0) return h;
        const next = h.timer - 1;
        if (next <= 8 && next > 0) setShowTimeToast(true);
        if (next === 0) return h;
        return { ...h, timer: next };
      });
    }, 1000);

    return () => clearInterval(id);
  }, [screen, host?.turn]);

  useEffect(() => {
    if (!showTimeToast) return;
    const t = setTimeout(() => setShowTimeToast(false), 2500);
    return () => clearTimeout(t);
  }, [showTimeToast]);

  const handleAdvanceHostTurn = () => {
    if (!host) return;
    const next = simulateTurn(host, { emergency: pendingEmergency });
    if (next.turn > next.maxTurns) {
      setHost(next);
      setScreen("host-result");
    } else {
      next.eventText = TURN_EVENTS[next.turn] ?? "";
      setHost(next);
    }
    setPendingEmergency(false);
  };

  const handleQuickAction = (action: QuickAction) => {
    if (!host || !action) return;
    patchHost(applyQuickAction(host, action));
  };

  const handleAdvanceFifaTurn = () => {
    if (!fifa) return;
    const next = simulateFifaTurn(fifa);
    if (next.turn > next.maxTurns) {
      setFifa(next);
      setScreen("fifa-result");
      return;
    }
    next.eventText = FIFA_TURN_EVENTS[next.turn] ?? next.eventText;
    setFifa(next);
  };

  if (screen === "landing") {
    return (
      <StoryLanding
        onExplore={() => {
          setOverviewSeed(undefined);
          setScreen("overview");
        }}
        onSimulate={() => setScreen("select-country")}
      />
    );
  }

  if (screen === "overview") {
    return (
      <OverviewPanel
        initial={overviewSeed}
        onBack={() => setScreen("landing")}
        onPlayTurnBased={() => setScreen("select-country")}
      />
    );
  }

  if (screen === "select-country") {
    return (
      <SelectCountryScreen
        onBack={() => setScreen("landing")}
        onSelect={handleStartCountry}
      />
    );
  }

  if (screen === "host" && host) {
    return (
      <HostScreen
        host={host}
        showTimeToast={showTimeToast}
        pendingEmergency={pendingEmergency}
        onPatch={patchHost}
        onQuickAction={handleQuickAction}
        onEmergency={() => setPendingEmergency(true)}
        onConfirmTurn={handleAdvanceHostTurn}
        onOpenOverview={() => {
          setOverviewSeed(configFromHost(host));
          setScreen("overview");
        }}
        onExit={() => setScreen("landing")}
      />
    );
  }

  if (screen === "host-result" && host) {
    return (
      <HostResultScreen
        host={host}
        onPlayFifa={() => {
          setFifa(createFifaState());
          setScreen("fifa");
        }}
        onReplay={() => setScreen("select-country")}
      />
    );
  }

  if (screen === "fifa" && fifa) {
    return (
      <FifaScreen
        fifa={fifa}
        onChange={setFifa}
        onAdvance={handleAdvanceFifaTurn}
        onBack={() => setScreen("host-result")}
      />
    );
  }

  if (screen === "fifa-result" && fifa) {
    return (
      <FifaResultScreen
        fifa={fifa}
        onHome={() => setScreen("landing")}
        onReplay={() => setScreen("select-country")}
      />
    );
  }

  return null;
}
