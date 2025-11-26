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

  // Load from context/localStorage if empty
  useEffect(() => {
    if (!teamA) setTeamA(localStorage.getItem("teamA") || "");
    if (!teamB) setTeamB(localStorage.getItem("teamB") || "");
  }, []);

  // Set toss winner as default batting
  useEffect(() => {
    const winner = state.tossWinner || localStorage.getItem("tossWinner");
    if (winner) setBatting(winner);
  }, [state.tossWinner]);

  // Auto-select bowling team
  useEffect(() => {
    if (!batting || !teamA || !teamB) return;
    setBowling(batting === teamA ? teamB : teamA);
  }, [batting, teamA, teamB]);

  const validateAndNext = () => {
    if (!batting) return setError("Select batting team");
    if (overs <= 0) return setError("Overs must be greater than 0");

    // Store decision but DO NOT START MATCH
    dispatch({
      type: "SET_DECISION",
      battingTeam: batting,
      bowlingTeam: bowling,
      overs: Number(overs),
    });

    // go to scoreboard setup panel
    navigate("/scoreboard");
  };

  return (
    <div className="max-w-2xl mx-auto px-3 py-6 md:px-4 md:py-8 text-gray-900">
      <Card className="rounded-2xl shadow-lg bg-white/90 border-0 w-full">
        <CardHeader className="text-center pb-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Decision
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">
            Choose who will bat and total overs to start the match.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 py-6">
          {/* TEAM PREVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">Team A</div>
              <div className="mt-1 font-medium text-sm">{teamA}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">Team B</div>
              <div className="mt-1 font-medium text-sm">{teamB}</div>
            </div>
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-xs font-medium block mb-1">
                Batting Team
              </label>

              <div className="flex gap-2">
                <Button
                  className={`flex-1 h-9 text-sm ${
                    batting === teamA
                      ? "bg-gray-900 text-white"
                      : "bg-slate-200 text-slate-800"
                  }`}
                  onClick={() => setBatting(teamA)}
                >
                  {teamA}
                </Button>

                <Button
                  className={`flex-1 h-9 text-sm ${
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

            <div>
              <label className="text-xs font-medium block mb-1">
                Bowling Team
              </label>
              <Input
                readOnly
                value={bowling}
                className="h-9 text-sm bg-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Overs</label>
              <Input
                type="number"
                min={1}
                value={overs}
                onChange={(e) => setOvers(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* BUTTONS */}
          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" onClick={() => navigate("/toss")}>
              Back
            </Button>

            <Button
              onClick={validateAndNext}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              Next — Start Match Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
