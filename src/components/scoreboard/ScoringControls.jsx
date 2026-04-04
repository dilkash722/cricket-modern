import { ArrowRightLeft, CircleDot, Plus, AlertTriangle } from "lucide-react";

export default function ScoringControls({ dispatch, setModal }) {
  return (
    <div className="mb-10 space-y-8">
      {/* RUNS */}
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] font-medium mb-2">
          Runs
        </p>

        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {[0, 1, 2, 3, 4, 6].map((n) => (
            <button
              key={n}
              onClick={() =>
                dispatch({ type: "BALL_EVENT", runs: n, event: String(n) })
              }
              className="h-14 md:h-16 bg-white text-black font-semibold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-500 hover:text-white transition active:scale-95"
            >
              <CircleDot size={14} />
              <span className="text-base">{n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* EXTRAS */}
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] font-medium mb-2">
          Extras
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["WD", "NB", "BYE", "LB"].map((e) => (
            <button
              key={e}
              onClick={() =>
                dispatch({
                  type: "BALL_EVENT",
                  runs: 1,
                  isExtra: true,
                  event: e,
                })
              }
              className="h-14 md:h-16 bg-white/5 border border-white/10 text-slate-200 font-medium text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition"
            >
              <Plus size={14} />
              <span className="tracking-wide">{e}</span>
            </button>
          ))}
        </div>
      </div>

      {/* WICKETS + SWAP */}
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] font-medium mb-2">
          Wickets & Actions
        </p>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {["OUT", "CATCH", "LBW", "RUN OUT", "STUMP"].map((w) => (
            <button
              key={w}
              onClick={() => setModal({ type: "wicket", name: "" })}
              className="h-14 md:h-16 bg-red-600 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition active:scale-95"
            >
              <AlertTriangle size={14} />
              <span className="tracking-wide">{w}</span>
            </button>
          ))}

          {/* SWAP STRIKE */}
          <button
            onClick={() => dispatch({ type: "SWAP_STRIKER" })}
            className="h-14 md:h-16 bg-indigo-600 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition active:scale-95"
          >
            <ArrowRightLeft size={14} />
            <span className="tracking-wide">Swap</span>
          </button>
        </div>
      </div>
    </div>
  );
}
