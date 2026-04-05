import { useScoreboard } from "./useScoreboard";

import SetupScreen from "@/components/scoreboard/SetupScreen";
import HeaderScoreboard from "@/components/scoreboard/HeaderScoreboard";
import BattingUnit from "@/components/scoreboard/BattingUnit";
import BowlingUnit from "@/components/scoreboard/BowlingUnit";
import ScoringControls from "@/components/scoreboard/ScoringControls";
import MatchTimeline from "@/components/scoreboard/MatchTimeline";
import ActionModal from "@/components/scoreboard/ActionModal";

export default function ScoreboardPage() {
  const {
    state,
    dispatch,
    setup,
    setSetup,
    modal,
    setModal,
    scrollRef,
    oversText,
    totalBalls,
  } = useScoreboard();

  // setup only before match start
  if (!state.matchStarted && !state.matchFinished) {
    return (
      <SetupScreen
        setup={setup}
        setSetup={setSetup}
        dispatch={dispatch}
        inningsNumber={state.inningsNumber}
      />
    );
  }

  // match end → kuch render mat karo
  if (state.matchFinished) return null;

  return (
    <div className="w-full max-w-[1300px] mx-auto pb-24 px-4 pt-8">
      <HeaderScoreboard
        state={state}
        oversText={oversText}
        totalBalls={totalBalls}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          <BattingUnit
            strikerName={state.striker}
            nonStrikerName={state.nonStriker}
            stats={state.batsmenStats}
            battingTeam={state.battingTeam}
          />
        </div>

        <BowlingUnit
          name={state.currentBowler}
          stats={state.bowlerStats[state.currentBowler]}
          bowlingTeam={state.bowlingTeam}
          allBowlers={state.bowlerStats}
        />
      </div>

      <ScoringControls dispatch={dispatch} setModal={setModal} />

      <MatchTimeline ballLog={state.ballLog} scrollRef={scrollRef} />

      <ActionModal modal={modal} setModal={setModal} dispatch={dispatch} />
    </div>
  );
}
