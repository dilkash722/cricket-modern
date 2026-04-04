import React, { useEffect, useState, useRef } from "react";
import { useMatch } from "../context/MatchContext.jsx";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  TrendingUp,
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
  strikerName,
  nonStrikerName,
  stats,
  battingTeam,
  fallOfWickets,
}) => (
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
      {[
        { name: strikerName, s: stats[strikerName], active: true },
        { name: nonStrikerName, s: stats[nonStrikerName], active: false },
      ].map((player, idx) => (
        <div
          key={idx}
          className={`p-5 flex justify-between items-center ${
            player.active ? "bg-indigo-500/[0.03]" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                player.active ? "bg-indigo-500 animate-pulse" : "bg-slate-800"
              }`}
            />
            <span
              className={`text-sm font-bold uppercase ${
                player.active ? "text-white" : "text-slate-500"
              }`}
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

    {/* OUT PLAYERS (NEW SECTION) */}
    <div className="border-t border-white/5">
      <p className="px-5 py-3 text-[10px] text-slate-500 uppercase tracking-[0.2em]">
        Fall of Wickets
      </p>

      {Object.entries(stats)
        .filter(([_, s]) => s.outBy)
        .map(([name, s], i) => (
          <div
            key={i}
            className="px-5 py-2 flex justify-between text-sm text-slate-400"
          >
            <span>{name}</span>
            <span className="text-slate-500 text-xs">{s.outBy}</span>
          </div>
        ))}

      {Object.values(stats).filter((s) => s.outBy).length === 0 && (
        <p className="px-5 pb-4 text-xs text-slate-600">No wickets yet</p>
      )}
    </div>
  </div>
);

// --- SEPARATE BOWLING CARD ---
const BowlingUnit = ({ name, stats, bowlingTeam, allBowlers }) => {
  const safeStats = stats || {};

  const balls = safeStats.balls || 0;
  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
  const econ = balls > 0 ? (safeStats.runs / (balls / 6)).toFixed(1) : "0.0";

  return (
    <div className="bg-[#0A0F1E] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl h-full">
      {/* HEADER */}
      <div className="bg-white/[0.02] px-6 py-4 border-b border-white/5 flex items-center gap-2">
        <Target size={14} className="text-emerald-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {bowlingTeam || "Team"} Bowling
        </span>
      </div>

      {/* BODY */}
      <div className="p-6 flex flex-col justify-center h-full min-h-[160px]">
        {/* CURRENT BOWLER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-emerald-500 rounded-full" />

            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">
                Current Bowler
              </p>

              <span className="text-lg font-black text-white uppercase">
                {name || "Not Selected"}
              </span>
            </div>
          </div>

          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-500 uppercase">
            Active
          </div>
        </div>

        {/* CURRENT STATS */}
        <div className="grid grid-cols-5 gap-2 border-t border-white/5 pt-6">
          <StatBox label="O" val={overs} color="text-white" />
          <StatBox label="M" val={safeStats.maidens || 0} />
          <StatBox label="R" val={safeStats.runs || 0} />
          <StatBox
            label="W"
            val={safeStats.wickets || 0}
            highlight
            color="text-emerald-400"
          />
          <StatBox label="EC" val={econ} color="text-indigo-500" />
        </div>

        {/* 🔥 ALL BOWLERS HISTORY */}
        <div className="mt-6 border-t border-white/5 pt-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2">
            Bowling History
          </p>

          {Object.entries(allBowlers || {}).map(([bowler, s], i) => {
            const b = s.balls || 0;
            const ov = `${Math.floor(b / 6)}.${b % 6}`;

            return (
              <div
                key={i}
                className={`flex justify-between text-sm py-1 ${
                  bowler === name
                    ? "text-white font-semibold"
                    : "text-slate-400"
                }`}
              >
                <span>{bowler}</span>
                <span>{ov} ov</span>
              </div>
            );
          })}

          {Object.keys(allBowlers || {}).length === 0 && (
            <p className="text-xs text-slate-600">No bowlers yet</p>
          )}
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
  const scrollRef = useRef(null);

  // NEW EFFECT
  useEffect(() => {
    if (balls > 0 && balls % 6 === 0 && !modal.type) {
      setModal({ type: "bowler", name: "" });
    }
  }, [balls]);

  useEffect(() => {
    const viewport = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );

    if (viewport) {
      viewport.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [ballLog]);

  // --- CLEAN RESPONSIVE SETUP FORM ---
  if (!matchStarted)
    return (
      <div className="w-full max-w-5xl mx-auto min-h-[85vh] flex items-center justify-center px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full bg-[#0A0F1E] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          {/* LEFT PANEL */}
          <div className="relative p-6 sm:p-8 md:p-10 bg-indigo-600 flex flex-col justify-between text-white overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Trophy size={160} />
            </div>

            <div className="relative z-10">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Zap size={18} />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.04em] leading-tight uppercase">
                Match <br /> Analytics
              </h2>

              <p className="mt-3 text-xs text-indigo-100/80 font-medium uppercase tracking-[0.2em]">
                Official Scoring Interface
              </p>
            </div>

            <div className="relative z-10 text-[11px] font-semibold opacity-70 uppercase tracking-[0.2em] mt-6">
              Innings 0{inningsNumber} Configuration
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
                Set Your Lineup
              </h3>
              <p className="text-slate-400 text-[11px] uppercase tracking-[0.2em] mt-1">
                Enter players and starting bowler
              </p>
            </div>

            {["striker", "nonStriker", "bowler"].map((f) => (
              <div key={f} className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em]">
                  {f}
                </label>

                <input
                  className="w-full bg-white/[0.04] border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-indigo-500 transition"
                  placeholder={`Enter ${f} name`}
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
              className="w-full h-14 bg-white text-black hover:bg-indigo-500 hover:text-white font-semibold text-base rounded-xl mt-4 transition active:scale-95"
            >
              Start Match <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  return (
    <div className="w-full max-w-[1300px] mx-auto pb-24 px-4 pt-8 animate-in fade-in duration-700">
      {/* HEADER SCOREBOARD */}
      <div className="bg-[#0A0F1E] border border-white/5 rounded-3xl p-5 sm:p-6 md:p-10 mb-6 relative overflow-hidden shadow-xl">
        {/* Background Icon */}
        <div className="absolute top-0 right-0 p-6 opacity-[0.04] rotate-12">
          <Activity size={120} className="text-indigo-500" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-8 text-center md:text-left">
          {/* LEFT SIDE */}
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-semibold text-indigo-400 uppercase tracking-[0.2em] mb-3">
              Batting: {battingTeam}
            </div>

            <div className="flex items-baseline justify-center md:justify-start gap-1">
              <span className="text-5xl sm:text-7xl md:text-[110px] font-black text-white leading-none">
                {runs}
              </span>
              <span className="text-3xl sm:text-5xl font-black text-indigo-500">
                /
              </span>
              <span className="text-4xl sm:text-6xl font-black text-slate-500">
                {wickets}
              </span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col items-center md:items-end gap-2">
            {/* Overs */}
            <div className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-none">
              {oversText}
            </div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.3em]">
              Overs
            </p>

            {/* Run Rate */}
            <div className="mt-2 text-[11px] text-indigo-400 font-semibold uppercase tracking-[0.2em]">
              CRR: {balls > 0 ? (runs / (balls / 6)).toFixed(2) : "0.00"}
            </div>

            {/* Target */}
            {target && (
              <div className="mt-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-[11px] font-medium text-indigo-300 uppercase tracking-[0.15em] text-center md:text-right">
                Target {target} • Need {target - runs} off {totalBalls - balls}{" "}
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
            battingTeam={battingTeam}
          />
        </div>
        <div className="lg:col-span-1">
          <BowlingUnit
            name={currentBowler}
            stats={bowlerStats[currentBowler]}
            bowlingTeam={bowlingTeam}
          />
        </div>
      </div>

      {/* --- SCORING CONTROLS --- */}
      <div className="mb-10">
        {/* -------- RUNS -------- */}
        <div className="mb-6">
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] mb-3">
            Runs
          </p>

          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
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
          </div>
        </div>

        {/* -------- EXTRAS -------- */}
        <div className="mb-6">
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] mb-3">
            Extras
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              onClick={() =>
                dispatch({
                  type: "BALL_EVENT",
                  runs: 1,
                  isExtra: true,
                  event: "NB",
                })
              }
              className="h-16 md:h-20 bg-yellow-600/10 text-yellow-400 border border-yellow-500/20 font-black rounded-[24px] text-lg hover:bg-yellow-500 hover:text-black transition-all"
            >
              NB
            </button>

            <button
              onClick={() =>
                dispatch({
                  type: "BALL_EVENT",
                  runs: 1,
                  isExtra: true,
                  event: "BYE",
                })
              }
              className="h-16 md:h-20 bg-white/5 text-slate-300 border border-white/10 font-black rounded-[24px] text-sm hover:bg-white/10 transition-all"
            >
              BYE
            </button>

            <button
              onClick={() =>
                dispatch({
                  type: "BALL_EVENT",
                  runs: 1,
                  isExtra: true,
                  event: "LB",
                })
              }
              className="h-16 md:h-20 bg-white/5 text-slate-300 border border-white/10 font-black rounded-[24px] text-sm hover:bg-white/10 transition-all"
            >
              LB
            </button>
          </div>
        </div>

        {/* -------- WICKET -------- */}
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] mb-3">
            Wicket
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button
              onClick={() => setModal({ type: "wicket", name: "" })}
              className="h-16 md:h-20 bg-red-600 text-white font-black rounded-[24px] text-sm hover:bg-red-700"
            >
              OUT
            </button>

            <button
              onClick={() => setModal({ type: "wicket", name: "" })}
              className="h-16 md:h-20 bg-red-600/80 text-white font-black rounded-[24px] text-sm hover:bg-red-700"
            >
              CATCH
            </button>

            <button
              onClick={() => setModal({ type: "wicket", name: "" })}
              className="h-16 md:h-20 bg-red-600/80 text-white font-black rounded-[24px] text-sm hover:bg-red-700"
            >
              LBW
            </button>

            <button
              onClick={() => setModal({ type: "wicket", name: "" })}
              className="h-16 md:h-20 bg-red-600/80 text-white font-black rounded-[24px] text-sm hover:bg-red-700"
            >
              RUN OUT
            </button>

            <button
              onClick={() => setModal({ type: "wicket", name: "" })}
              className="h-16 md:h-20 bg-red-600/80 text-white font-black rounded-[24px] text-sm hover:bg-red-700"
            >
              STUMP
            </button>
          </div>
        </div>
      </div>

      {/* --- ELITE MATCH TIMELINE (CRICBUZZ PRO STYLE) --- */}
      <div className="bg-[#0A0F1E] border border-white/5 rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-indigo-500" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Match Timeline
            </h3>
          </div>

          <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-widest">
            Live
          </span>
        </div>

        {/* SCROLL AREA */}
        <ScrollArea ref={scrollRef} className="h-[350px] w-full">
          <div className="flex flex-col-reverse gap-3 pr-4">
            {ballLog?.length > 0 ? (
              ballLog.map((log, i) => {
                const isBoundary = log.runs === 4 || log.runs === 6;

                return (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border transition ${
                      i === 0
                        ? "border-indigo-500/30 bg-indigo-500/[0.05]"
                        : "border-white/5 bg-white/[0.02]"
                    } hover:bg-white/[0.04]`}
                  >
                    {/* TOP */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[11px] text-slate-500">
                          {log.over}
                        </span>

                        <span className="text-white font-semibold">
                          {log.bowler}
                        </span>

                        <span className="text-slate-500 text-xs">to</span>

                        <span className="text-slate-300">{log.batsman}</span>
                      </div>

                      {/* RESULT */}
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                          log.isWicket
                            ? "bg-red-600 text-white"
                            : isBoundary
                              ? "bg-indigo-600 text-white"
                              : "bg-white/5 text-slate-300"
                        }`}
                      >
                        {log.isWicket ? "W" : log.event}
                      </div>
                    </div>

                    {/* COMMENT */}
                    <p className="mt-2 text-[12px] text-slate-400 leading-relaxed">
                      {log.isWicket
                        ? `${log.bowler} dismisses ${log.batsman}. Big breakthrough.`
                        : isBoundary
                          ? `${log.batsman} hits a clean ${
                              log.runs === 4 ? "four" : "six"
                            } off ${log.bowler}.`
                          : log.runs === 0
                            ? `Dot ball. Tight bowling.`
                            : `${log.batsman} takes ${log.runs} run${
                                log.runs > 1 ? "s" : ""
                              }.`}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center text-slate-500 text-sm">
                No activity yet
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* MODALS */}
      {modal.type && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] px-4">
          <div className="w-full max-w-sm bg-[#0A0F1E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            {/* Icon */}
            <div className="h-14 w-14 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-6">
              <UserPlus className="text-indigo-500" size={20} />
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {modal.type === "wicket" ? "Wicket Fall" : "Change Bowler"}
            </h3>

            {/* Subtitle */}
            <p className="mt-2 text-xs text-slate-400 tracking-wide">
              Enter player name to continue
            </p>

            {/* Input */}
            <input
              className="w-full mt-6 bg-white/[0.04] border border-white/10 px-4 py-3 rounded-xl text-white outline-none text-center font-semibold text-base focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
              autoFocus
              placeholder="Enter name"
              value={modal.name}
              onChange={(e) => setModal({ ...modal, name: e.target.value })}
            />

            {/* Button */}
            <Button
              className="w-full mt-6 h-12 bg-white text-black hover:bg-slate-200 font-semibold rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
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
              Confirm
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
