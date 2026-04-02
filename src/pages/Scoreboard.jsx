import React, { useEffect, useState } from "react";
import { useMatch } from "../context/MatchContext.jsx";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Swords,
  Activity,
  Target,
  History,
  Zap,
  ChevronRight,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

// --- PROFESSIONAL STAT MINI COMPONENT ---
const StatBox = ({ label, val, highlight, color = "text-slate-400" }) => (
  <div className="flex flex-col items-center justify-center py-2 px-1">
    <p className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-tighter mb-1">
      {label}
    </p>
    <p
      className={`text-xs md:text-sm font-black ${highlight ? "text-indigo-400 scale-110" : color}`}
    >
      {val}
    </p>
  </div>
);

// --- UNIFIED BATTING CARD ---
const BattingUnit = ({
  striker,
  nonStriker,
  stats,
  strikerName,
  nonStrikerName,
}) => (
  <div className="bg-[#0A0F1E] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl h-full">
    <div className="bg-white/[0.02] px-6 py-4 border-b border-white/5 flex items-center gap-2">
      <Swords size={14} className="text-indigo-500" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        Batting Department
      </span>
    </div>
    <div className="divide-y divide-white/5">
      {[
        { name: strikerName, s: stats[strikerName], active: true },
        { name: nonStrikerName, s: stats[nonStrikerName], active: false },
      ].map((player, idx) => (
        <div
          key={idx}
          className={`p-5 flex justify-between items-center transition-all ${player.active ? "bg-indigo-500/[0.03]" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-1.5 w-1.5 rounded-full ${player.active ? "bg-indigo-500 animate-pulse shadow-[0_0_8px_#6366f1]" : "bg-slate-800"}`}
            />
            <span
              className={`text-sm font-bold uppercase ${player.active ? "text-white" : "text-slate-500"}`}
            >
              {player.name || "---"} {player.active && "*"}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-3 md:gap-6 min-w-[180px] md:min-w-[240px]">
            <StatBox
              label="R"
              val={player.s?.runs || 0}
              highlight={player.active}
              color="text-white"
            />
            <StatBox label="B" val={player.s?.balls || 0} />
            <StatBox label="4s" val={player.s?.fours || 0} />
            <StatBox label="6s" val={player.s?.sixes || 0} />
            <StatBox
              label="SR"
              val={
                player.s?.balls > 0
                  ? ((player.s.runs / player.s.balls) * 100).toFixed(1)
                  : "0.0"
              }
              color="text-indigo-500"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- SEPARATE BOWLING CARD ---
const BowlingUnit = ({ name, stats }) => {
  const balls = stats?.balls || 0;
  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
  const econ = balls > 0 ? (stats.runs / (balls / 6)).toFixed(1) : "0.0";

  return (
    <div className="bg-[#0A0F1E] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl h-full">
      <div className="bg-white/[0.02] px-6 py-4 border-b border-white/5 flex items-center gap-2">
        <Target size={14} className="text-emerald-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Bowling Attack
        </span>
      </div>
      <div className="p-6 flex flex-col justify-center h-full min-h-[160px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
            <span className="text-lg font-black text-white uppercase tracking-tight truncate max-w-[150px]">
              {name || "---"}
            </span>
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-500 uppercase">
            Active
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 border-t border-white/5 pt-6">
          <StatBox label="O" val={overs} color="text-white" />
          <StatBox label="M" val={stats?.maidens || 0} />
          <StatBox label="R" val={stats?.runs || 0} />
          <StatBox
            label="W"
            val={stats?.wickets || 0}
            highlight
            color="text-emerald-400"
          />
          <StatBox label="EC" val={econ} color="text-indigo-500" />
        </div>
      </div>
    </div>
  );
};

export default function Scoreboard() {
  const navigate = useNavigate();
  const { state, dispatch } = useMatch();
  const {
    battingTeam,
    bowlingTeam,
    striker,
    nonStriker,
    currentBowler,
    batsmenStats,
    bowlerStats,
    runs,
    wickets,
    balls,
    inningsNumber,
    oversLimit,
    target,
    matchStarted,
    matchFinished,
    ballLog,
  } = state;

  const [setup, setSetup] = useState({
    striker: "",
    nonStriker: "",
    bowler: "",
  });
  const [modal, setModal] = useState({ type: null, name: "" });

  const totalBalls = (oversLimit || 0) * 6;
  const oversText = `${Math.floor(balls / 6)}.${balls % 6}`;

  useEffect(() => {
    if (matchStarted && !matchFinished) {
      const isDone = wickets >= 10 || (balls >= totalBalls && totalBalls > 0);
      if (inningsNumber === 1 && isDone) {
        dispatch({ type: "END_INNINGS", prepareSecond: true });
        setSetup({ striker: "", nonStriker: "", bowler: "" });
      } else if (inningsNumber === 2 && (runs >= target || isDone)) {
        dispatch({ type: "FINISH_MATCH" });
        navigate("/result");
      }
    }
  }, [
    runs,
    wickets,
    balls,
    inningsNumber,
    target,
    matchStarted,
    matchFinished,
    totalBalls,
    dispatch,
    navigate,
  ]);

  // --- CORPORATE LEVEL SETUP FORM ---
  if (!matchStarted)
    return (
      <div className="w-full max-w-[1100px] mx-auto min-h-[85vh] flex items-center justify-center p-4">
        <div className="grid md:grid-cols-2 bg-[#0A0F1E] border border-white/10 rounded-[48px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] w-full">
          <div className="p-12 bg-indigo-600 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Trophy size={250} />
            </div>
            <div className="relative z-10">
              <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                <Zap />
              </div>
              <h2 className="text-5xl font-black tracking-tighter leading-none mb-4 uppercase italic">
                Match
                <br />
                Analytics.
              </h2>
              <p className="text-indigo-100 font-medium opacity-80 uppercase tracking-widest text-[10px]">
                Official Scoring Interface v3.1
              </p>
            </div>
            <div className="relative z-10 text-sm font-bold opacity-60 uppercase tracking-[0.3em]">
              Innings 0{inningsNumber} Configuration
            </div>
          </div>
          <div className="p-12 space-y-6 bg-[#0A0F1E] flex flex-col justify-center">
            <div className="space-y-1 mb-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Set Your Lineup
              </h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                Assign opening batsmen and starting bowler
              </p>
            </div>
            {["striker", "nonStriker", "bowler"].map((f) => (
              <div key={f} className="space-y-2">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">
                  {f}
                </label>
                <input
                  className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold"
                  placeholder={`Enter ${f} name...`}
                  value={setup[f]}
                  onChange={(e) => setSetup({ ...setup, [f]: e.target.value })}
                />
              </div>
            ))}
            <Button
              onClick={() =>
                dispatch({
                  type: "START_MATCH",
                  striker: setup.striker,
                  nonStriker: setup.nonStriker,
                  currentBowler: setup.bowler,
                })
              }
              disabled={!setup.striker || !setup.nonStriker || !setup.bowler}
              className="w-full h-16 bg-white text-black hover:bg-indigo-500 hover:text-white font-black text-lg rounded-2xl mt-8 transition-all active:scale-95 shadow-xl"
            >
              INITIATE MATCH <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-[1300px] mx-auto pb-24 px-4 pt-8 animate-in fade-in duration-700">
      {/* HEADER SCOREBOARD */}
      <div className="bg-[#0A0F1E] border border-white/5 rounded-[48px] p-8 md:p-14 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
          <Activity size={200} className="text-indigo-500" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">
              Batting: {battingTeam}
            </div>
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-8xl md:text-[140px] font-black text-white tracking-tighter leading-none">
                {runs}
              </span>
              <span className="text-5xl font-black text-indigo-600">/</span>
              <span className="text-6xl font-black text-slate-800">
                {wickets}
              </span>
            </div>
          </div>
          <div className="md:text-right">
            <div className="text-6xl md:text-8xl font-black text-white tracking-tighter">
              {oversText}
            </div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mt-2">
              Overs Duration
            </p>
            {target && (
              <div className="mt-8 inline-block bg-white/5 px-6 py-2 rounded-2xl border border-white/5 text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">
                Target: {target} • Need {target - runs} off {totalBalls - balls}{" "}
                balls
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UNIFIED CARDS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          <BattingUnit
            strikerName={striker}
            nonStrikerName={nonStriker}
            stats={batsmenStats}
          />
        </div>
        <div className="lg:col-span-1">
          <BowlingUnit
            name={currentBowler}
            stats={bowlerStats[currentBowler]}
          />
        </div>
      </div>

      {/* ELITE CONTROLS */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-10">
        {[0, 1, 2, 3, 4, 6].map((n) => (
          <button
            key={n}
            onClick={() =>
              dispatch({ type: "BALL_EVENT", runs: n, event: String(n) })
            }
            className="h-16 md:h-20 bg-white text-black hover:bg-indigo-600 hover:text-white font-black rounded-[24px] text-2xl transition-all shadow-lg active:scale-90"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() =>
            dispatch({
              type: "BALL_EVENT",
              runs: 1,
              isExtra: true,
              event: "WD",
            })
          }
          className="h-16 md:h-20 bg-orange-600/10 text-orange-500 border border-orange-500/20 font-black rounded-[24px] text-lg hover:bg-orange-500 hover:text-white transition-all"
        >
          WD
        </button>
        <button
          onClick={() => setModal({ type: "wicket", name: "" })}
          className="h-16 md:h-20 bg-red-600 text-white font-black rounded-[24px] text-lg shadow-xl active:scale-95 hover:bg-red-700"
        >
          OUT
        </button>
      </div>
      {/* --- ELITE MATCH TIMELINE (CRICBUZZ PRO STYLE) --- */}
      <div className="bg-[#0A0F1E] border border-white/5 rounded-[40px] p-6 md:p-10 overflow-hidden shadow-2xl relative">
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <Activity size={18} className="text-indigo-500 animate-pulse" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
              Live Commentary & Ball Log
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
              Live Sync
            </span>
          </div>
        </div>

        {/* scrollbar-hide CSS logic */}
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

        <div
          className="scrollbar-hide flex flex-col-reverse gap-4 max-h-[500px] overflow-y-auto pr-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {ballLog?.length > 0 ? (
            ballLog.map((log, i) => (
              <div
                key={i}
                className={`flex flex-col gap-3 p-5 rounded-[24px] transition-all border ${
                  log.isWicket
                    ? "bg-red-500/[0.03] border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]"
                    : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 md:gap-6">
                    {/* Over Number Badge */}
                    <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                      <span className="text-[10px] font-black text-slate-500 tracking-tighter uppercase">
                        {log.over}
                      </span>
                    </div>

                    {/* Players Involvement */}
                    <div className="text-sm">
                      <span className="text-white font-black uppercase tracking-tight">
                        {log.bowler}
                      </span>
                      <span className="text-slate-700 mx-3 text-[9px] font-black">
                        TO
                      </span>
                      <span className="text-slate-300 font-bold uppercase tracking-tight">
                        {log.batsman}
                      </span>
                    </div>
                  </div>

                  {/* Run/Wicket Ball Circle */}
                  <div
                    className={`h-10 w-10 md:h-12 md:w-12 rounded-2xl flex items-center justify-center text-xs md:text-sm font-black border transition-all ${
                      log.isWicket
                        ? "bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                        : log.runs >= 4
                          ? "bg-indigo-600 border-indigo-400 text-white"
                          : "border-white/10 text-slate-400 bg-white/5"
                    }`}
                  >
                    {log.isWicket ? "OUT" : log.event}
                  </div>
                </div>

                {/* Contextual Commentary Label */}
                {log.isWicket && (
                  <div className="flex items-center gap-2 mt-1 px-4 py-2 bg-red-600/10 rounded-xl border border-red-600/10">
                    <Zap size={10} className="text-red-500 fill-red-500" />
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                      WICKET! {log.batsman} departs. Excellent delivery by{" "}
                      {log.bowler}.
                    </p>
                  </div>
                )}

                {(log.runs === 4 || log.runs === 6) && (
                  <div className="flex items-center gap-2 mt-1 px-4 py-2 bg-indigo-600/10 rounded-xl border border-indigo-600/10">
                    <TrendingUp size={10} className="text-indigo-400" />
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                      BOUNDARY! {log.runs} runs. {log.batsman} finds the gap
                      perfectly.
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-24 text-center flex flex-col items-center gap-4">
              <div className="p-4 bg-white/5 rounded-full border border-white/5 animate-pulse">
                <History className="text-slate-800" size={32} />
              </div>
              <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.4em]">
                Awaiting First Delivery...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {modal.type && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-[#0A0F1E] border border-white/10 p-12 rounded-[48px] w-full max-w-sm text-center shadow-2xl">
            <div className="h-16 w-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <UserPlus className="text-indigo-500" />
            </div>
            <h3 className="text-white text-3xl font-black mb-2 uppercase tracking-tighter">
              {modal.type === "wicket" ? "Wicket Fall" : "New Bowler"}
            </h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10">
              Verification Required
            </p>
            <input
              className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-white mb-8 outline-none text-center font-bold text-xl focus:border-indigo-500 transition-all placeholder:text-slate-800"
              autoFocus
              placeholder="Enter Name"
              value={modal.name}
              onChange={(e) => setModal({ ...modal, name: e.target.value })}
            />
            <Button
              className="w-full h-16 bg-white text-black hover:bg-indigo-500 hover:text-white font-black rounded-[24px] text-lg transition-all shadow-xl group"
              onClick={() => {
                if (modal.name.trim()) {
                  dispatch({
                    type:
                      modal.type === "wicket" ? "ADD_BATSMAN" : "CHANGE_BOWLER",
                    name: modal.name.trim(),
                  });
                  setModal({ type: null, name: "" });
                }
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <span>AUTHORIZE UPDATE</span>
                <ShieldCheck className="h-5 w-5 group-hover:scale-110 transition-transform text-indigo-600 group-hover:text-white" />
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
