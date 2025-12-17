import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useMatch } from "../context/MatchContext";

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

      dispatch({
        type: "SET_TOSS",
        winner: finalWinner,
        choice: final,
      });
    }, 1200);

    setTimeout(() => setAnimate(false), 1300);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-slate-900">
      <Card className="rounded-2xl shadow-xl bg-white border-0">
        <CardHeader className="text-center pb-2 space-y-1">
          <CardTitle className="text-[26px] font-semibold tracking-tight leading-tight">
            Match Toss
          </CardTitle>
          <p className="text-[13px] leading-snug text-gray-500">
            Choose Heads or Tails — other team is auto assigned
          </p>
        </CardHeader>

        <CardContent className="space-y-12 pt-6">
          {/* TEAMS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            {/* TEAM A */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium tracking-wide text-gray-700">
                Team A
              </label>
              <Input
                value={teamA}
                onChange={(e) => handleTeamA(e.target.value)}
                placeholder="Enter Team A"
                className="h-10 text-[13px]"
              />
            </div>

            {/* TEAM A CHOICE */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium tracking-wide text-gray-700">
                Choice
              </label>

              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                {["HEADS", "TAILS"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setTeamAChoice(opt)}
                    className={`flex-1 py-2 text-[12px] font-semibold tracking-wide transition
                      ${
                        teamAChoice === opt
                          ? "bg-slate-900 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* VS */}
            <div className="flex justify-center">
              <span className="text-[12px] font-semibold tracking-[0.25em] text-gray-400">
                VS
              </span>
            </div>

            {/* TEAM B */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium tracking-wide text-gray-700">
                Team B
              </label>
              <Input
                value={teamB}
                onChange={(e) => handleTeamB(e.target.value)}
                placeholder="Enter Team B"
                className="h-10 text-[13px]"
              />
            </div>

            {/* TEAM B AUTO */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium tracking-wide text-gray-700">
                Auto Choice
              </label>
              <div className="h-10 flex items-center justify-center rounded-lg bg-gray-100 border border-dashed text-[13px] font-semibold text-gray-800 tracking-wide">
                {teamBChoice}
              </div>
            </div>
          </div>

          {/* COIN */}
          <div className="flex justify-center">
            <div
              className={`w-40 h-40 rounded-full bg-gradient-to-b
                from-yellow-200 to-yellow-400
                border border-yellow-500/40 shadow-2xl
                flex items-center justify-center
                text-[28px] font-bold tracking-tight
                ${animate ? "coin-spin" : ""}
              `}
            >
              {flipping ? "" : result || "TOSS"}
            </div>
          </div>

          {/* ACTION */}
          <div className="flex justify-center">
            <Button
              onClick={startToss}
              disabled={flipping}
              className="w-56 h-11 rounded-xl text-[14px] font-medium tracking-wide bg-slate-900 hover:bg-slate-800 text-gray-300"
            >
              {flipping ? "Flipping..." : "Start Toss"}
            </Button>
          </div>

          {/* RESULT */}
          {winner && (
            <div className="text-center bg-green-100 text-green-900 px-4 py-3 rounded-xl text-[14px] font-semibold tracking-tight">
              {winner}
            </div>
          )}

          {/* NAV */}
          {winner && (
            <div className="flex justify-between">
              <Button
                variant="outline"
                className="text-[13px] font-medium"
                onClick={() => navigate("/setup")}
              >
                Back
              </Button>

              <Button
                variant="outline"
                className="text-[13px] font-medium"
                onClick={() => navigate("/decision")}
              >
                Go to Decision
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <style>{`
        .coin-spin {
          animation: flip 0.65s cubic-bezier(.25,.6,.4,1.4) infinite;
        }
        @keyframes flip {
          0% { transform: rotateX(0deg); }
          50% { transform: rotateX(720deg); }
          100% { transform: rotateX(1440deg); }
        }
      `}</style>
    </div>
  );
}
