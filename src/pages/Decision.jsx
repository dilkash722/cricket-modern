import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useMatch } from "../context/MatchContext";

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
    <div className="max-w-2xl mx-auto px-3 py-6 md:px-4 md:py-8 text-gray-900">
      <Card className="rounded-2xl shadow-lg bg-white/90 border-0 w-full">
        <CardHeader className="text-center pb-1 space-y-1">
          <CardTitle className="text-[24px] font-semibold tracking-tight leading-tight">
            Decision
          </CardTitle>
          <p className="text-[13px] leading-snug text-slate-500">
            Choose who will bat and total overs to start the match.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 py-6">
          {/* TEAM PREVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-[11px] tracking-wide text-slate-500">
                Team A
              </div>
              <div className="mt-1 text-[14px] font-medium tracking-tight">
                {teamA}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-[11px] tracking-wide text-slate-500">
                Team B
              </div>
              <div className="mt-1 text-[14px] font-medium tracking-tight">
                {teamB}
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium tracking-wide block">
                Batting Team
              </label>

              <div className="flex gap-2">
                <Button
                  className={`flex-1 h-9 text-[13px] font-medium tracking-wide ${
                    batting === teamA
                      ? "bg-gray-900 text-white"
                      : "bg-slate-200 text-slate-800"
                  }`}
                  onClick={() => setBatting(teamA)}
                >
                  {teamA}
                </Button>

                <Button
                  className={`flex-1 h-9 text-[13px] font-medium tracking-wide ${
                    batting === teamB
                      ? "bg-gray-900 text-white"
                      : "bg-slate-200 text-slate-800"
                  }`}
                  onClick={() => setBatting(teamB)}
                >
                  {teamB}
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium tracking-wide block">
                Bowling Team
              </label>
              <Input
                readOnly
                value={bowling}
                className="h-9 text-[13px] bg-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium tracking-wide block">
                Overs
              </label>
              <Input
                type="number"
                min={1}
                value={overs}
                onChange={(e) => setOvers(e.target.value)}
                className="h-9 text-[13px]"
              />
            </div>
          </div>

          {error && (
            <p className="text-[13px] font-medium text-red-600">{error}</p>
          )}

          {/* BUTTONS */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              className="text-[13px] font-medium"
              onClick={() => navigate("/toss")}
            >
              Back
            </Button>

            <Button
              onClick={validateAndNext}
              className="bg-gray-900 text-white hover:bg-gray-800 text-[13px] font-medium tracking-wide"
            >
              Next — Start Match Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
