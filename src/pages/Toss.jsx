import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

import { useNavigate } from "react-router-dom";
import { useMatch } from "../context/MatchContext";

export default function Toss() {
  const navigate = useNavigate();
  const { state, dispatch } = useMatch();

  // AUTO FILL TEAM NAMES FROM CONTEXT
  const [teamA, setTeamA] = useState(state.teamA || "");
  const [teamB, setTeamB] = useState(state.teamB || "");

  const [teamAChoice, setTeamAChoice] = useState("HEADS");
  const [teamBChoice, setTeamBChoice] = useState("TAILS");

  const [result, setResult] = useState("");
  const [winner, setWinner] = useState("");

  const [flipping, setFlipping] = useState(false);
  const [animate, setAnimate] = useState(false);

  // WHEN SETUP SENDS NEW TEAM NAMES → AUTO UPDATE
  useEffect(() => {
    setTeamA(state.teamA || "");
    setTeamB(state.teamB || "");
  }, [state.teamA, state.teamB]);

  // UPDATE TEAM A
  const handleTeamA = (val) => {
    setTeamA(val);
    dispatch({ type: "SET_TEAMS", A: val, B: teamB });
  };

  // UPDATE TEAM B
  const handleTeamB = (val) => {
    setTeamB(val);
    dispatch({ type: "SET_TEAMS", A: teamA, B: val });
  };

  // TOSS LOGIC
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

      setWinner(finalWinner + " won the toss");

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
    <div className="max-w-2xl mx-auto px-3 py-6 md:px-4 md:py-10 text-gray-900">
      <Card className="rounded-2xl shadow-lg bg-white/90 border-0 w-full">
        <CardHeader className="text-center pb-1">
          <CardTitle className="text-3xl font-semibold">Match Toss</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Team names auto-filled from Setup page
          </p>
        </CardHeader>

        <CardContent className="space-y-10 py-6">
          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
            {/* TEAM A */}
            <div className="space-y-1">
              <label className="text-sm font-medium block">
                {teamA || "Team A"}
              </label>
              <Input
                value={teamA}
                onChange={(e) => handleTeamA(e.target.value)}
                placeholder="Team A"
                className="h-9 text-sm"
              />
            </div>

            {/* TEAM A CHOICE */}
            <div className="space-y-1">
              <label className="text-sm font-medium block">
                {teamA || "Choice A"}
              </label>

              <Select value={teamAChoice} onValueChange={setTeamAChoice}>
                <SelectTrigger className="h-8 px-1 py-0 text-xs w-20">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="w-20 text-xs">
                  <SelectItem value="HEADS">HEADS</SelectItem>
                  <SelectItem value="TAILS">TAILS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* VS */}
            <div className="flex justify-center items-end md:items-center pb-1">
              <span className="font-semibold text-gray-500 text-lg">VS</span>
            </div>

            {/* TEAM B */}
            <div className="space-y-1">
              <label className="text-sm font-medium block">
                {teamB || "Team B"}
              </label>
              <Input
                value={teamB}
                onChange={(e) => handleTeamB(e.target.value)}
                placeholder="Team B"
                className="h-9 text-sm"
              />
            </div>

            {/* TEAM B CHOICE */}
            <div className="space-y-1">
              <label className="text-sm font-medium block">
                {teamB || "Choice B"}
              </label>

              <Select value={teamBChoice} onValueChange={setTeamBChoice}>
                <SelectTrigger className="h-8 px-1 py-0 text-xs w-20">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="w-20 text-xs">
                  <SelectItem value="HEADS">HEADS</SelectItem>
                  <SelectItem value="TAILS">TAILS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* COIN */}
          <div className="flex justify-center">
            <div
              className={`
                w-40 h-40 rounded-full bg-gradient-to-b
                from-yellow-200 to-yellow-400 border border-yellow-500/40
                shadow-xl flex items-center justify-center text-3xl font-semibold
                ${animate ? "coin-spin" : ""}
              `}
            >
              {flipping ? "" : result || "TOSS"}
            </div>
          </div>

          {/* TOSS BUTTON */}
          <div className="flex justify-center">
            <Button
              onClick={startToss}
              disabled={flipping}
              className="w-52 h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
            >
              {flipping ? "Flipping..." : "Start Toss"}
            </Button>
          </div>

          {/* TOSS RESULT */}
          {winner && (
            <div className="text-center text-gray-800 bg-green-100 px-4 py-3 rounded-lg shadow-sm font-medium text-sm">
              {winner}
            </div>
          )}

          {/* NEXT BUTTONS */}
          {winner && (
            <div className="flex items-center justify-between mt-4 px-1">
              <Button variant="outline" onClick={() => navigate("/setup")}>
                Back
              </Button>

              <Button variant="outline" onClick={() => navigate("/decision")}>
                Go to Decision
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ANIMATION */}
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
