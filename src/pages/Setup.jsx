import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatch } from "../context/MatchContext.jsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, ShieldAlert } from "lucide-react";

export default function Setup() {
  const navigate = useNavigate();
  const { dispatch } = useMatch();

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  const isSameName =
    teamA.trim() &&
    teamB.trim() &&
    teamA.trim().toLowerCase() === teamB.trim().toLowerCase();
  const canNext = teamA.trim() && teamB.trim() && !isSameName;

  const next = () => {
    dispatch({
      type: "SET_TEAMS",
      A: teamA.trim(),
      B: teamB.trim(),
    });
    navigate("/toss");
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase text-white">
          Initialize <span className="text-indigo-500 text-nowrap">Squads</span>
        </h2>

        <p className="text-xs md:text-sm font-medium tracking-wide text-slate-400 uppercase mt-2">
          Step 01 • Match Configuration
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* MAIN CARD */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[32px] overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12 space-y-10">
            <div className="grid md:grid-cols-2 gap-10 relative">
              {/* VS */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-[#020617] border border-white/10 items-center justify-center z-10">
                <span className="text-xs font-semibold text-indigo-500">
                  VS
                </span>
              </div>

              {/* TEAM A */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  <Label className="text-xs font-medium tracking-wide text-slate-300 uppercase">
                    Primary Team
                  </Label>
                </div>

                <Input
                  placeholder="Team Alpha"
                  value={teamA}
                  onChange={(e) => setTeamA(e.target.value)}
                  className="h-16 bg-white/[0.02] border-white/10 focus:border-indigo-500 focus:ring-0 rounded-2xl text-lg font-semibold tracking-tight text-white placeholder:text-slate-600"
                />
              </div>

              {/* TEAM B */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                  <Label className="text-xs font-medium tracking-wide text-slate-300 uppercase">
                    Opponent Team
                  </Label>
                </div>

                <Input
                  placeholder="Team Omega"
                  value={teamB}
                  onChange={(e) => setTeamB(e.target.value)}
                  className="h-16 bg-white/[0.02] border-white/10 focus:border-indigo-500 focus:ring-0 rounded-2xl text-lg font-semibold tracking-tight text-white placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* ERROR */}
            {isSameName && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                <p className="text-xs font-medium uppercase tracking-wide text-red-400">
                  Conflict: Names must be unique
                </p>
              </div>
            )}

            {/* BUTTON */}
            <div className="pt-6 border-t border-white/5 flex justify-end">
              <Button
                disabled={!canNext}
                onClick={next}
                className="h-14 px-10 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-2xl font-semibold text-sm uppercase tracking-wide transition-all disabled:opacity-20 group"
              >
                Proceed to Toss
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[32px] bg-indigo-600/5 border border-indigo-500/10">
            <Trophy className="text-indigo-500 h-6 w-6 mb-4" />

            <h4 className="text-base font-semibold text-white uppercase tracking-tight mb-2">
              Match Protocol
            </h4>

            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Ensure team names are official for accurate record keeping. Names
              will be locked once the toss is initialized.
            </p>
          </div>

          <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Engine Status
              </p>
              <p className="text-sm font-semibold text-emerald-500 uppercase mt-1">
                Ready to Sync
              </p>
            </div>

            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
