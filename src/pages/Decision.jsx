import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMatch } from "../context/MatchContext";
import {
  ShieldCheck,
  Swords,
  Timer,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

export default function Decision() {
  const navigate = useNavigate();
  const { state, dispatch } = useMatch();

  const [teamA, setTeamA] = useState(state.teamA || "");
  const [teamB, setTeamB] = useState(state.teamB || "");
  const [batting, setBatting] = useState("");
  const [bowling, setBowling] = useState("");
  const [overs, setOvers] = useState(6);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!teamA) setTeamA(localStorage.getItem("teamA") || "");
    if (!teamB) setTeamB(localStorage.getItem("teamB") || "");
  }, []);

  useEffect(() => {
    const winner = state.tossWinner || localStorage.getItem("tossWinner");
    if (winner) setBatting(winner);
  }, [state.tossWinner]);

  useEffect(() => {
    if (!batting || !teamA || !teamB) return;
    setBowling(batting === teamA ? teamB : teamA);
  }, [batting, teamA, teamB]);

  const validateAndNext = () => {
    if (!batting) return setError("Select batting team");
    if (overs <= 0) return setError("Overs must be greater than 0");

    dispatch({
      type: "SET_DECISION",
      battingTeam: batting,
      bowlingTeam: bowling,
      overs: Number(overs),
    });

    navigate("/scoreboard");
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: CONFIGURATION PANEL */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-8 md:p-10 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-10 shadow-2xl">
            {/* 1. BATTING SELECTION */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Swords className="h-4 w-4 text-indigo-500" />
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Strategic Selection
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[teamA, teamB].map((team) => (
                  <button
                    key={team}
                    onClick={() => setBatting(team)}
                    className={`h-20 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center justify-center gap-1 group relative overflow-hidden
                      ${
                        batting === team
                          ? "bg-indigo-600 border-indigo-400 shadow-[0_0_30px_rgba(79,70,229,0.3)]"
                          : "bg-white/[0.02] border-white/5 hover:border-white/10 text-slate-500"
                      }
                    `}
                  >
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest ${batting === team ? "text-indigo-200" : "text-slate-600"}`}
                    >
                      Batting First
                    </span>
                    <span
                      className={`text-lg font-black uppercase tracking-tight ${batting === team ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}
                    >
                      {team}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. MATCH DETAILS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
              <div className="space-y-4">
                <LabelText label="Defending Squad" />
                <div className="h-16 px-6 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl flex items-center">
                  <span className="text-lg font-black uppercase tracking-tight text-indigo-400/60">
                    {bowling || "Waiting..."}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Timer className="h-4 w-4 text-indigo-500" />
                  <span className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">
                    Match Duration
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min={1}
                    value={overs}
                    onChange={(e) => setOvers(e.target.value)}
                    className="h-16 bg-white/[0.02] border-white/10 focus:border-indigo-500 rounded-2xl text-xl font-black text-white px-6 transition-all"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    Overs
                  </span>
                </div>
              </div>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 animate-shake">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className="pt-8 flex flex-col md:flex-row gap-4 sm:gap-6 px-1 sm:px-0">
              {/* RESET BUTTON */}
              <Button
                variant="outline"
                onClick={() => navigate("/toss")}
                className="w-full md:w-auto md:px-8 h-[70px] md:h-16 border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 text-slate-400 rounded-[22px] font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Reset Toss
              </Button>

              {/* INITIALIZE BUTTON */}
              <Button
                onClick={validateAndNext}
                className="flex-1 min-h-[72px] md:h-16 px-5 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-[22px] font-black uppercase text-[11px] tracking-[0.25em] transition-all duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.05)] group active:scale-[0.96] flex items-center justify-center border-none outline-none"
              >
                <span className="flex items-center justify-center gap-3">
                  Initialize Live Scoreboard
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT: MATCH STATUS SUMMARY */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[32px] bg-indigo-600/5 border border-indigo-500/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="h-24 w-24" />
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4">
              Conflict Status
            </h4>
            <div className="space-y-4">
              <StatusRow label="Squad A" value={teamA} active />
              <StatusRow label="Squad B" value={teamB} active />
              <StatusRow label="Toss Verified" value="Success" active />
            </div>
          </div>

          <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
              Memory Sync
            </p>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelText({ label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
      <span className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">
        {label}
      </span>
    </div>
  );
}

function StatusRow({ label, value, active }) {
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-2">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </span>
      <span
        className={`text-[10px] font-black uppercase ${active ? "text-indigo-400" : "text-slate-700"}`}
      >
        {value}
      </span>
    </div>
  );
}
