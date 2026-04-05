import React from "react";
import { useMatch } from "../context/MatchContext.jsx";
import { Button } from "@/components/ui/button";
import StatBox from "../components/scoreboard/StatBox";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Users,
  Target,
  RotateCcw,
  ShieldCheck,
  Skull,
} from "lucide-react";

// --- Sub Components ---
const SubHeader = ({ icon, title, className = "" }) => {
  const parts = title.split("/");

  return (
    <div
      className={`flex items-center gap-2 mb-4 mt-6 first:mt-0 ${className}`}
    >
      <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
        {React.cloneElement(icon, { size: 14 })}
      </div>

      <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wide text-slate-300 flex items-center gap-1">
        <span>{parts[0]}</span>

        {parts[1] && (
          <>
            <span className="text-slate-500 font-normal px-1">/</span>
            <span>{parts[1]}</span>
          </>
        )}
      </h3>
    </div>
  );
};

const Separator = () => (
  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"></div>
);

const InningsReport = ({ team, score, wickets, overs, rr, num, children }) => (
  <div className="bg-[#0A0F1E]/60 border border-white/5 rounded-[24px] md:rounded-[32px] p-6 md:p-10 backdrop-blur-xl relative overflow-hidden">
    <div className="absolute top-0 right-0 p-10 text-white/[0.02] font-black text-[8rem] md:text-[12rem] leading-none hidden sm:block">
      {num}
    </div>

    <div className="relative z-10">
      <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-indigo-400 mb-2">
            Innings {num}
          </div>
          <h2 className="text-2xl md:text-5xl font-extrabold text-white uppercase tracking-tight">
            {team}
          </h2>
        </div>

        <div className="text-right">
          <div className="text-3xl md:text-6xl font-extrabold text-white">
            {score}
            <span className="text-indigo-600">/</span>
            <span className="text-slate-500">{wickets}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {overs} Ov • {rr} RR
          </p>
        </div>
      </div>

      {children}
    </div>
  </div>
);

export default function Result() {
  const { state } = useMatch();
  const navigate = useNavigate();

  const {
    teamA,
    teamB,
    firstInningsTotal,
    firstInningsBatsmen,
    firstInningsBowlers,
    firstInningsBalls,
    firstInningsWickets,
    batsmenStats,
    bowlerStats,
    fallOfWickets,
    runs,
    balls,
  } = state;

  const convertBalls = (b) => `${Math.floor(b / 6)}.${b % 6}`;

  const firstOvers =
    firstInningsBalls != null ? convertBalls(firstInningsBalls) : "-";
  const secondOvers = convertBalls(balls);

  const getRR = (runs, oversText) => {
    if (!oversText || oversText === "-") return "0.00";
    const [ov, ball] = oversText.split(".");
    const o = Number(ov) + Number(ball) / 6;
    return o > 0 ? (runs / o).toFixed(2) : "0.00";
  };

  const RR1 = getRR(firstInningsTotal, firstOvers);
  const RR2 = getRR(runs, secondOvers);

  let winnerText = "Match Tied";
  let subWinnerText = "Scores are level";

  if (runs > firstInningsTotal) {
    winnerText = teamB;
    subWinnerText = `Won by ${10 - (fallOfWickets?.length || 0)} Wickets`;
  } else if (runs < firstInningsTotal) {
    winnerText = teamA;
    subWinnerText = `Won by ${firstInningsTotal - runs} Runs`;
  }

  const StatusBadge = ({ outBy }) =>
    outBy ? (
      <span className="text-[10px] px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-3xl">
        OUT
      </span>
    ) : (
      <span className="text-[10px] px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-3xl">
        NOT
      </span>
    );

  return (
    <div className="w-full max-w-[1300px] mx-auto pb-20 px-4 mt-4 md:mt-8">
      {/* --- RESPONSIVE WINNING BADGE --- */}
      <div className="relative overflow-hidden rounded-[24px] md:rounded-[32px] bg-[#0A0F1E] border border-white/[0.03] p-6 md:p-12 text-center mb-6 md:mb-8 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.02] to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Top Label */}
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="h-px w-6 md:w-8 bg-slate-800"></div>

            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-400">
              Match Result
            </span>

            <div className="h-px w-6 md:w-8 bg-slate-800"></div>
          </div>

          {/* Winner */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            <Trophy
              className="text-yellow-500 animate-pulse hidden sm:block"
              size={26}
            />

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-white leading-none px-2 break-words max-w-full">
              {winnerText}
            </h1>

            <div className="px-2 py-0.5 md:px-3 md:py-1 rounded bg-indigo-600 text-xs md:text-sm font-semibold uppercase tracking-wide text-white shadow-lg">
              Winner
            </div>
          </div>

          {/* Sub Text */}
          <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-1.5 md:px-6 md:py-2 rounded-lg md:rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-md">
            <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>

            <p className="text-xs md:text-sm font-medium text-slate-300 uppercase tracking-wide">
              {subWinnerText}
            </p>
          </div>
        </div>
      </div>

      {/* INNINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FIRST */}
        <InningsReport
          team={teamA}
          score={firstInningsTotal}
          wickets={firstInningsWickets}
          overs={firstOvers}
          rr={RR1}
          num="01"
        >
          <SubHeader icon={<Users />} title="Batting" />

          <div className="space-y-3">
            {Object.entries(firstInningsBatsmen || {}).map(([name, s]) => (
              <div key={name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {name}
                  </span>
                  <StatusBadge outBy={s.outBy} />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <StatBox label="R" val={s.runs} />
                  <StatBox label="B" val={s.balls} />
                  <StatBox label="4s" val={s.fours} />
                  <StatBox label="6s" val={s.sixes} />
                  <StatBox
                    label="SR"
                    val={
                      s.balls > 0
                        ? ((s.runs / s.balls) * 100).toFixed(1)
                        : "0.0"
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <SubHeader icon={<Target />} title="Bowling" />

          <div className="space-y-3">
            {Object.entries(firstInningsBowlers || {}).map(([name, s]) => (
              <div key={name} className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white">{name}</span>

                <div className="grid grid-cols-5 gap-2">
                  <StatBox label="O" val={convertBalls(s.balls)} />
                  <StatBox label="M" val={0} />
                  <StatBox label="R" val={s.runs} />
                  <StatBox label="W" val={s.wickets} />
                  <StatBox
                    label="ER"
                    val={
                      s.balls > 0 ? (s.runs / (s.balls / 6)).toFixed(2) : "0.00"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </InningsReport>

        {/* SECOND */}
        <InningsReport
          team={teamB}
          score={runs}
          wickets={fallOfWickets?.length || 0}
          overs={secondOvers}
          rr={RR2}
          num="02"
        >
          <SubHeader icon={<Users />} title="Batting" />

          <div className="space-y-3">
            {Object.entries(batsmenStats || {}).map(([name, s]) => (
              <div key={name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {name}
                  </span>
                  <StatusBadge outBy={s.outBy} />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <StatBox label="R" val={s.runs} />
                  <StatBox label="B" val={s.balls} />
                  <StatBox label="4s" val={s.fours} />
                  <StatBox label="6s" val={s.sixes} />
                  <StatBox
                    label="SR"
                    val={
                      s.balls > 0
                        ? ((s.runs / s.balls) * 100).toFixed(1)
                        : "0.0"
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <SubHeader icon={<Target />} title="Bowling" />

          <div className="space-y-3">
            {Object.entries(bowlerStats || {}).map(([name, s]) => (
              <div key={name} className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white">{name}</span>

                <div className="grid grid-cols-5 gap-2">
                  <StatBox label="O" val={convertBalls(s.balls)} />
                  <StatBox label="M" val={0} />
                  <StatBox label="R" val={s.runs} />
                  <StatBox label="W" val={s.wickets} />
                  <StatBox
                    label="EC"
                    val={
                      s.balls > 0 ? (s.runs / (s.balls / 6)).toFixed(2) : "0.00"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </InningsReport>
      </div>
    </div>
  );
}
