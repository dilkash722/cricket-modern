import StatBox from "./StatBox";
import { Target } from "lucide-react";

export default function BowlingUnit({ name, stats, bowlingTeam, allBowlers }) {
  const safeStats = stats || {};
  const safeAll = allBowlers || {};

  // current bowler
  const balls = safeStats.balls || 0;
  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
  const econ = balls > 0 ? (safeStats.runs / (balls / 6)).toFixed(1) : "0.0";

  // 🔥 filter only completed bowlers
  const historyBowlers = Object.entries(safeAll).filter(
    ([bowler, s]) => bowler !== name && (s?.balls || 0) >= 6,
  );

  return (
    <div className="bg-[#0A0F1E] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl h-full">
      {/* HEADER */}
      <div className="bg-white/[0.02] px-6 py-4 border-b border-white/5 flex items-center gap-2">
        <Target size={14} className="text-emerald-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {bowlingTeam || "Team"} Bowling
        </span>
      </div>

      {/* CURRENT BOWLER */}
      <div className="divide-y divide-white/5">
        <div className="p-5 flex justify-between items-center bg-emerald-500/[0.03]">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold uppercase text-white">
              {name || "Not Selected"} *
            </span>
          </div>

          <div className="grid grid-cols-5 gap-3 md:gap-6 min-w-[180px] md:min-w-[240px]">
            <StatBox label="O" val={overs} color="text-white" />
            <StatBox label="M" val={safeStats.maidens || 0} />
            <StatBox label="R" val={safeStats.runs || 0} />
            <StatBox label="W" val={safeStats.wickets || 0} highlight />
            <StatBox label="EC" val={econ} />
          </div>
        </div>
      </div>

      {/* HISTORY */}
      <div className="border-t border-white/5">
        <p className="px-5 py-3 text-[10px] text-slate-500 uppercase tracking-[0.2em]">
          Bowling History
        </p>

        <div className="divide-y divide-white/5">
          {historyBowlers.length > 0 ? (
            historyBowlers.map(([bowler, s], idx) => {
              const b = s?.balls || 0;
              const ov = `${Math.floor(b / 6)}.${b % 6}`;
              const ec = b > 0 ? (s.runs / (b / 6)).toFixed(1) : "0.0";

              return (
                <div
                  key={idx}
                  className="p-5 flex justify-between items-center"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                    <span className="text-sm font-bold uppercase text-slate-500">
                      {bowler}
                    </span>
                  </div>

                  {/* RIGHT */}
                  <div className="grid grid-cols-5 gap-3 md:gap-6 min-w-[180px] md:min-w-[240px]">
                    <StatBox label="O" val={ov} color="text-white" />
                    <StatBox label="M" val={s?.maidens || 0} />
                    <StatBox label="R" val={s?.runs || 0} />
                    <StatBox label="W" val={s?.wickets || 0} />
                    <StatBox label="EC" val={ec} />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="px-5 pb-4 text-xs text-slate-600">
              No completed overs yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
