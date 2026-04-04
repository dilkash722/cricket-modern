import { Activity } from "lucide-react";

export default function HeaderScoreboard({ state, oversText, totalBalls }) {
  const { runs, wickets, battingTeam, bowlingTeam, balls, target } = state;

  const crr = balls > 0 ? (runs / (balls / 6)).toFixed(2) : "0.00";

  const remainingRuns = target ? target - runs : 0;
  const remainingBalls = totalBalls - balls;

  const rrr =
    target && remainingBalls > 0
      ? (remainingRuns / (remainingBalls / 6)).toFixed(2)
      : null;

  return (
    <div className="bg-[#070B18] border border-white/10 rounded-3xl p-5 sm:p-6 md:p-8 mb-6 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
      {/* subtle bg */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12">
        <Activity size={120} className="text-indigo-500" />
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        {/* TOP ROW */}
        <div className="flex items-center justify-between">
          {/* LEFT */}
          <div className="flex flex-col gap-3">
            {/* badge */}
            <span className="px-3 py-1 w-fit bg-indigo-500/15 border border-indigo-500/30 rounded-full text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
              {battingTeam} Batting
            </span>

            {/* score */}
            <div className="flex items-end gap-3">
              <span className="text-[72px] sm:text-[90px] md:text-[110px] font-extrabold text-white leading-none tracking-tight">
                {runs}
              </span>

              <span className="text-3xl sm:text-4xl font-bold text-indigo-400 mb-2">
                /
              </span>

              <span className="text-4xl sm:text-5xl font-semibold text-slate-400 mb-1">
                {wickets}
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-end gap-3 text-right">
            {/* bowling */}
            <div>
              <p className="text-base font-semibold text-white tracking-wide">
                {bowlingTeam}
              </p>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest">
                Bowling
              </p>
            </div>

            {/* overs */}
            <div className="text-3xl sm:text-4xl font-bold text-white leading-none">
              {oversText}
            </div>

            {/* run rate */}
            <p className="text-[12px] font-medium text-indigo-300 uppercase tracking-wide">
              CRR {crr}
            </p>
          </div>
        </div>

        {/* TARGET */}
        {target && (
          <div className="flex justify-between items-center bg-white/5 border border-white/10 px-5 py-3 rounded-xl text-sm">
            <span className="text-slate-200 font-medium">
              Need {remainingRuns}
            </span>

            <span className="text-slate-400">{remainingBalls} balls</span>

            {rrr && (
              <span className="text-indigo-300 font-semibold">RRR {rrr}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
