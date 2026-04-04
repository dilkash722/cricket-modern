import React from "react";
import { useMatch } from "../context/MatchContext.jsx";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trophy, Users, Target, RotateCcw, TrendingUp } from "lucide-react";

// --- Styled Sub-Components ---
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

const InningsReport = ({ team, score, wickets, overs, rr, num, children }) => (
  <div className="bg-[#0A0F1E]/60 border border-white/5 rounded-[24px] md:rounded-[32px] p-5 md:p-10 backdrop-blur-xl relative overflow-hidden group transition-all">
    {/* Background Decorative Number - Hidden on small mobile to save space */}
    <div className="absolute top-0 right-0 p-10 text-white/[0.02] font-black text-[8rem] md:text-[12rem] leading-none select-none pointer-events-none group-hover:text-indigo-500/[0.04] transition-colors hidden sm:block">
      {num}
    </div>

    <div className="relative z-10">
      <div className="flex flex-row justify-between items-end mb-6 md:mb-10 border-b border-white/5 pb-6 md:pb-8">
        <div className="max-w-[60%]">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black uppercase tracking-widest text-indigo-400 mb-2 md:mb-3">
            Innings {num}
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none truncate">
            {team}
          </h2>
        </div>
        <div className="text-right">
          <div className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter">
            {score}
            <span className="text-indigo-600">/</span>
            <span className="text-slate-500">{wickets}</span>
          </div>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] md:tracking-[0.2em] mt-2 bg-white/5 py-1 px-2 md:px-3 rounded-full inline-block">
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
  const firstInningsOvers =
    firstInningsBalls != null ? convertBalls(firstInningsBalls) : "-";
  const secondInningsOvers = convertBalls(balls);

  const getRR = (runs, oversText) => {
    if (!oversText || oversText === "-" || oversText === "0.0") return "0.00";
    const [ov, ball] = oversText.split(".");
    const o = Number(ov) + Number(ball) / 6;
    return o > 0 ? (runs / o).toFixed(2) : "0.00";
  };

  const RR1 = getRR(firstInningsTotal, firstInningsOvers);
  const RR2 = getRR(runs, secondInningsOvers);

  let winnerText = "Match Tied";
  let subWinnerText = "Scores are level";
  if (firstInningsTotal != null && runs != null) {
    if (runs > firstInningsTotal) {
      winnerText = teamB;
      subWinnerText = `Won by ${10 - (fallOfWickets?.length || 0)} Wickets`;
    } else if (runs < firstInningsTotal) {
      winnerText = teamA;
      subWinnerText = `Won by ${firstInningsTotal - runs} Runs`;
    }
  }

  const renderTable = (headers, rows) => (
    <div className="w-full overflow-x-auto rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm scrollbar-hide">
      <table className="w-full text-left text-[10px] md:text-[11px] min-w-[300px]">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.03]">
            {headers.map((h, i) => (
              <th
                key={i}
                className={`px-3 md:px-4 py-2.5 md:py-3 font-black uppercase text-slate-500 tracking-tighter ${i === 0 ? "sticky left-0 bg-[#0A0F1E] z-10" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">{rows}</tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full max-w-[1300px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 px-4 mt-4 md:mt-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* --- INNINGS 01 --- */}
        <InningsReport
          team={teamA}
          score={firstInningsTotal}
          wickets={firstInningsWickets}
          overs={firstInningsOvers}
          rr={RR1}
          num="01"
        >
          <SubHeader icon={<Users />} title="Batting" />
          {renderTable(
            ["Player", "R", "B", "4s", "6s", "SR"],
            Object.keys(firstInningsBatsmen || {}).map((name) => (
              <tr
                key={name}
                className="hover:bg-white/[0.02] border-b border-white/[0.02] last:border-0"
              >
                <td className="px-3 md:px-4 py-2.5 md:py-3 font-bold text-white uppercase text-[10px] md:text-[11px] sticky left-0 bg-[#111625] md:bg-transparent">
                  {name}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 font-black text-indigo-400">
                  {firstInningsBatsmen[name].runs}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 text-slate-500">
                  {firstInningsBatsmen[name].balls}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 text-slate-600">
                  {firstInningsBatsmen[name].fours}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 text-slate-600">
                  {firstInningsBatsmen[name].sixes}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 font-bold text-slate-700">
                  {(firstInningsBatsmen[name].balls > 0
                    ? (firstInningsBatsmen[name].runs /
                        firstInningsBatsmen[name].balls) *
                      100
                    : 0
                  ).toFixed(1)}
                </td>
              </tr>
            )),
          )}
          <SubHeader icon={<Target />} title="Bowling" />
          {renderTable(
            ["Bowler", "O", "R", "W", "Eco"],
            Object.keys(firstInningsBowlers || {}).map((name) => (
              <tr key={name} className="hover:bg-white/[0.02]">
                <td className="px-3 md:px-4 py-2.5 md:py-3 font-bold text-white uppercase sticky left-0 bg-[#111625] md:bg-transparent">
                  {name}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 text-slate-500">
                  {convertBalls(firstInningsBowlers[name].balls)}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 text-slate-600">
                  {firstInningsBowlers[name].runs}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 font-black text-indigo-400">
                  {firstInningsBowlers[name].wickets}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 font-bold text-slate-700">
                  {(firstInningsBowlers[name].balls > 0
                    ? firstInningsBowlers[name].runs /
                      (firstInningsBowlers[name].balls / 6)
                    : 0
                  ).toFixed(1)}
                </td>
              </tr>
            )),
          )}
        </InningsReport>

        {/* --- INNINGS 02 --- */}
        <InningsReport
          team={teamB}
          score={runs}
          wickets={fallOfWickets?.length}
          overs={secondInningsOvers}
          rr={RR2}
          num="02"
        >
          <SubHeader icon={<Users />} title="Batting" />
          {renderTable(
            ["Player", "R", "B", "4s", "6s", "SR"],
            Object.keys(batsmenStats || {}).map((name) => (
              <tr key={name} className="hover:bg-white/[0.02]">
                <td className="px-3 md:px-4 py-2.5 md:py-3 font-bold text-white uppercase text-[10px] md:text-[11px] sticky left-0 bg-[#111625] md:bg-transparent">
                  {name}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 font-black text-indigo-400">
                  {batsmenStats[name].runs}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 text-slate-500">
                  {batsmenStats[name].balls}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 text-slate-600">
                  {batsmenStats[name].fours}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 text-slate-600">
                  {batsmenStats[name].sixes}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 font-bold text-slate-700">
                  {(batsmenStats[name].balls > 0
                    ? (batsmenStats[name].runs / batsmenStats[name].balls) * 100
                    : 0
                  ).toFixed(1)}
                </td>
              </tr>
            )),
          )}
          <SubHeader icon={<Target />} title="Bowling" />
          {renderTable(
            ["Bowler", "O", "R", "W", "Eco"],
            Object.keys(bowlerStats || {}).map((name) => (
              <tr key={name} className="hover:bg-white/[0.02]">
                <td className="px-3 md:px-4 py-2.5 md:py-3 font-bold text-white uppercase sticky left-0 bg-[#111625] md:bg-transparent">
                  {name}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 text-slate-500">
                  {convertBalls(
                    bowlerStats[name].balls ||
                      bowlerStats[name].ballsBowled ||
                      0,
                  )}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 text-slate-600">
                  {bowlerStats[name].runs ||
                    bowlerStats[name].runsConceded ||
                    0}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 font-black text-indigo-400">
                  {bowlerStats[name].wickets || 0}
                </td>
                <td className="px-3 md:px-4 py-2.5 md:py-3 font-bold text-slate-700">
                  {((bowlerStats[name].balls || bowlerStats[name].ballsBowled) >
                  0
                    ? (bowlerStats[name].runs ||
                        bowlerStats[name].runsConceded) /
                      ((bowlerStats[name].balls ||
                        bowlerStats[name].ballsBowled) /
                        6)
                    : 0
                  ).toFixed(1)}
                </td>
              </tr>
            )),
          )}
        </InningsReport>
      </div>
    </div>
  );
}
