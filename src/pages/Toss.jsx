import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMatch } from "../context/MatchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Coins, ArrowRight, ArrowLeft, Zap } from "lucide-react";

export default function Toss() {
  const navigate = useNavigate();
  const { state, dispatch } = useMatch();

  const [teamA, setTeamA] = useState(state.teamA || "");
  const [teamB, setTeamB] = useState(state.teamB || "");
  const [teamAChoice, setTeamAChoice] = useState("HEADS");
  const [teamBChoice, setTeamBChoice] = useState("TAILS");
  const [result, setResult] = useState("");
  const [winner, setWinner] = useState("");
  const [flipping, setFlipping] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTeamA(state.teamA || "");
    setTeamB(state.teamB || "");
  }, [state.teamA, state.teamB]);

  useEffect(() => {
    setTeamBChoice(teamAChoice === "HEADS" ? "TAILS" : "HEADS");
  }, [teamAChoice]);

  const handleTeamA = (val) => {
    setTeamA(val);
    dispatch({ type: "SET_TEAMS", A: val, B: teamB });
  };

  const handleTeamB = (val) => {
    setTeamB(val);
    dispatch({ type: "SET_TEAMS", A: teamA, B: val });
  };

  const startToss = () => {
    if (!teamA || !teamB) return;
    setWinner("");
    setResult("");
    setFlipping(true);
    setAnimate(true);
    const final = Math.random() < 0.5 ? "HEADS" : "TAILS";
    setTimeout(() => {
      setResult(final);
      const finalWinner = teamAChoice === final ? teamA : teamB;
      setWinner(`${finalWinner} won the toss`);
      setFlipping(false);
      dispatch({ type: "SET_TOSS", winner: finalWinner, choice: final });
    }, 1200);
    setTimeout(() => setAnimate(false), 1300);
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HEADER */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-[-0.05em] uppercase text-white">
            Coin <span className="text-indigo-500">Arbitration.</span>
          </h2>
          <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase mt-2">
            Step 02 — The Toss Phase
          </p>
        </div>
        {winner && (
          <div className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 animate-bounce-slow">
            <Trophy className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              {winner}
            </span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* LEFT: TEAM CHOICES */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* TEAM A BOX */}
              <div className="space-y-4">
                <LabelText label="Team Alpha" />
                <Input
                  value={teamA}
                  onChange={(e) => handleTeamA(e.target.value)}
                  className="elite-input"
                />

                <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5">
                  {["HEADS", "TAILS"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setTeamAChoice(opt)}
                      className={`flex-1 py-3 text-[10px] font-black tracking-widest transition-all rounded-lg ${
                        teamAChoice === opt
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* TEAM B BOX */}
              <div className="space-y-4">
                <LabelText label="Opponent Team" />
                <Input
                  value={teamB}
                  onChange={(e) => handleTeamB(e.target.value)}
                  className="elite-input"
                />

                <div className="h-[46px] flex items-center justify-center rounded-xl bg-white/[0.01] border border-dashed border-white/10 text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase">
                  Auto: {teamBChoice}
                </div>
              </div>
            </div>

            <Button
              onClick={startToss}
              disabled={flipping || !teamA || !teamB}
              className="w-full h-16 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-10 group"
            >
              {flipping ? (
                <Zap className="animate-spin h-4 w-4" />
              ) : (
                "Execute Toss"
              )}
              {!flipping && (
                <Coins className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              )}
            </Button>
          </div>

          {/* NAVIGATION */}
          {winner && (
            <div className="flex gap-4 animate-in slide-in-from-top-2">
              <Button
                variant="outline"
                className="flex-1 h-14 rounded-2xl border-white/5 bg-white/[0.02] text-slate-400 font-black uppercase text-[10px] tracking-widest"
                onClick={() => navigate("/setup")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                className="flex-1 h-14 rounded-2xl bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-500/20"
                onClick={() => navigate("/decision")}
              >
                Decision <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT: THE COIN VISUAL */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center py-10">
          <div className="relative">
            {/* GLOW BEHIND COIN */}
            <div
              className={`absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full transition-opacity duration-1000 ${animate ? "opacity-100" : "opacity-0"}`}
            />

            <div
              className={`w-56 h-56 rounded-full border-[6px] border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.15)]
                flex items-center justify-center relative overflow-hidden bg-[#1a1a1a]
                ${animate ? "coin-spin" : ""}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/40 via-amber-200/20 to-transparent" />
              <span className="text-3xl font-black text-amber-500 tracking-tighter uppercase z-10">
                {flipping ? "" : result || "Toss"}
              </span>
            </div>
          </div>
          <p className="mt-8 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
            Proprietary RNG Engine v1.0
          </p>
        </div>
      </div>

      <style>{`
        .coin-spin { animation: flip 0.6s cubic-bezier(.45,.05,.55,.95) infinite; }
        @keyframes flip { 0% { transform: rotateX(0deg); } 100% { transform: rotateX(1080deg); } }
        .elite-input { height: 64px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; font-weight: 900; font-size: 1.125rem; color: white; padding: 0 1.5rem; transition: all 0.3s; }
        .elite-input:focus { border-color: #6366f1; outline: none; background: rgba(255,255,255,0.04); }
      `}</style>
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
