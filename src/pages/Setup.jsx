import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatch } from "../context/MatchContext.jsx";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Setup() {
  const navigate = useNavigate();
  const { dispatch } = useMatch();

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  const canNext =
    teamA.trim() &&
    teamB.trim() &&
    teamA.trim().toLowerCase() !== teamB.trim().toLowerCase();

  const next = () => {
    dispatch({
      type: "SET_TEAMS",
      A: teamA.trim(),
      B: teamB.trim(),
    });

    navigate("/toss");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      {/* PAGE HEADING */}
      <div className="space-y-1">
        <h2 className="text-[22px] font-semibold tracking-tight leading-tight text-slate-900">
          Match Setup
        </h2>
        <p className="text-[13px] leading-snug text-slate-500">
          Create teams to start the match process.
        </p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="space-y-0.5">
          <CardTitle className="text-[15px] font-medium tracking-tight">
            Teams
          </CardTitle>
          <CardDescription className="text-[11px] tracking-wide">
            Step 1 of 5
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* TEAM A */}
            <div className="space-y-1.5">
              <Label
                htmlFor="teamA"
                className="text-[12px] font-medium tracking-wide"
              >
                Team A
              </Label>
              <Input
                id="teamA"
                placeholder="Example: Nikhra"
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="border border-slate-300 focus:border-slate-400 focus:ring-0 text-[13px]"
              />
            </div>

            {/* TEAM B */}
            <div className="space-y-1.5">
              <Label
                htmlFor="teamB"
                className="text-[12px] font-medium tracking-wide"
              >
                Team B
              </Label>
              <Input
                id="teamB"
                placeholder="Example: Kamraili"
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="border border-slate-300 focus:border-slate-400 focus:ring-0 text-[13px]"
              />
            </div>

            {teamA &&
              teamB &&
              teamA.trim().toLowerCase() === teamB.trim().toLowerCase() && (
                <p className="text-[11px] leading-snug text-amber-600 md:col-span-2">
                  Team A and Team B must be different.
                </p>
              )}
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="flex justify-end">
          <Button
            size="sm"
            disabled={!canNext}
            onClick={next}
            className="
              bg-neutral-900 text-white
              border border-neutral-800
              hover:bg-neutral-800
              active:bg-neutral-700
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all
              text-[13px] font-medium tracking-wide
            "
          >
            Next — Toss
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
