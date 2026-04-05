import { Trophy, Zap, ChevronRight, User, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SetupScreen({
  setup,
  setSetup,
  dispatch,
  inningsNumber,
}) {
  const navigate = useNavigate();

  const fields = [
    { key: "striker", icon: User, label: "Striker" },
    { key: "nonStriker", icon: User, label: "Non Striker" },
    { key: "bowler", icon: Target, label: "Bowler" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto min-h-[85vh] flex items-center justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full bg-[#0A0F1E] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        {/* LEFT */}
        <div className="relative p-6 sm:p-8 md:p-10 bg-indigo-600 flex flex-col justify-between text-white overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Trophy size={160} />
          </div>

          <div className="relative z-10">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <Zap size={18} />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase">
              Match Analytics
            </h2>
          </div>

          <div className="relative z-10 text-[11px] font-semibold opacity-70 uppercase tracking-[0.2em] mt-6">
            Innings 0{inningsNumber} Configuration
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
              Set Your Lineup
            </h3>

            <p className="text-slate-400 text-[11px] uppercase tracking-[0.2em] mt-1">
              Enter players and starting bowler
            </p>
          </div>

          {fields.map(({ key, icon: Icon, label }) => (
            <div key={key} className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em]">
                {label}
              </label>

              <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 px-4 py-3 rounded-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30 transition">
                <Icon size={16} className="text-slate-400" />

                <input
                  className="w-full bg-transparent text-white outline-none text-sm font-medium placeholder:text-slate-500"
                  placeholder={`Enter ${label}`}
                  value={setup[key]}
                  onChange={(e) =>
                    setSetup({ ...setup, [key]: e.target.value })
                  }
                />
              </div>
            </div>
          ))}

          {/* BUTTON */}
          <Button
            onClick={() => {
              const striker = setup.striker.trim();
              const nonStriker = setup.nonStriker.trim();
              const bowler = setup.bowler.trim();

              if (!striker || !nonStriker || !bowler) return;

              dispatch({
                type:
                  inningsNumber === 2 ? "START_SECOND_INNINGS" : "START_MATCH",
                striker,
                nonStriker,
                currentBowler: bowler,
              });

              navigate("/scoreboard");
            }}
            disabled={
              !setup.striker.trim() ||
              !setup.nonStriker.trim() ||
              !setup.bowler.trim()
            }
            className="
    w-full h-14 
    bg-white text-slate-900 
    hover:bg-indigo-500 hover:text-white 
    font-semibold rounded-xl 
    flex items-center justify-center gap-2 
    transition-all duration-200 
    active:scale-95 
    disabled:opacity-40 disabled:cursor-not-allowed
  "
          >
            Start Match
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
