import StatBox from "./StatBox";
import { Swords } from "lucide-react";

export default function BattingUnit({
  strikerName,
  nonStrikerName,
  stats,
  battingTeam,
}) {
  const safeStats = stats || {};

  // current players
  const currentPlayers = [
    { name: strikerName, active: true },
    { name: nonStrikerName, active: false },
  ];

  // out players
  const outPlayers = Object.entries(safeStats).filter(([_, s]) => s?.outBy);

  return (
    <div className="bg-[#0A0F1E] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl h-full">
      {/* HEADER */}
      <div className="bg-white/[0.02] px-6 py-4 border-b border-white/5 flex items-center gap-2">
        <Swords size={14} className="text-indigo-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {battingTeam} Batting
        </span>
      </div>

      {/* CURRENT PLAYERS */}
      <div className="divide-y divide-white/5">
        {currentPlayers.map((player, idx) => {
          const s = safeStats?.[player.name] || {};

          return (
            <div
              key={idx}
              className={`p-5 flex justify-between items-center ${
                player.active ? "bg-indigo-500/[0.03]" : ""
              }`}
            >
              <span
                className={`text-sm font-bold ${
                  player.active ? "text-white" : "text-slate-400"
                }`}
              >
                {player.name || "---"} {player.active && "*"}
              </span>

              <div className="grid grid-cols-5 gap-3">
                <StatBox label="R" val={s?.runs || 0} />
                <StatBox label="B" val={s?.balls || 0} />
                <StatBox label="4s" val={s?.fours || 0} />
                <StatBox label="6s" val={s?.sixes || 0} />
                <StatBox
                  label="SR"
                  val={
                    s?.balls > 0 ? ((s.runs / s.balls) * 100).toFixed(1) : "0.0"
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* FALL OF WICKETS (SAME UI) */}
      <div className="border-t border-white/5">
        <p className="px-5 py-3 text-[10px] text-slate-500 uppercase tracking-[0.2em]">
          Fall of Wickets
        </p>

        <div className="divide-y divide-white/5">
          {outPlayers.length > 0 ? (
            outPlayers.map(([name, s], idx) => (
              <div key={idx} className="p-5 flex justify-between items-center">
                {/* NAME + OUT BADGE */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-400">
                    {name}
                  </span>

                  <span className="text-[10px] px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
                    OUT
                  </span>
                </div>

                {/* SAME STATS UI */}
                <div className="grid grid-cols-5 gap-3">
                  <StatBox label="R" val={s?.runs || 0} />
                  <StatBox label="B" val={s?.balls || 0} />
                  <StatBox label="4s" val={s?.fours || 0} />
                  <StatBox label="6s" val={s?.sixes || 0} />
                  <StatBox
                    label="SR"
                    val={
                      s?.balls > 0
                        ? ((s.runs / s.balls) * 100).toFixed(1)
                        : "0.0"
                    }
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="px-5 pb-4 text-xs text-slate-600">No wickets yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
