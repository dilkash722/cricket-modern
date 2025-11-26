import React, { useEffect, useState } from "react";
import { useMatch } from "../context/MatchContext.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Scoreboard() {
  const navigate = useNavigate();
  const { state, dispatch } = useMatch();

  const {
    teamA,
    teamB,
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
    fallOfWickets,
    matchStarted,
    matchFinished,
    firstInningsTotal,
    firstInningsFall,
    firstInningsBatsmen,
    firstInningsBowlers,
    firstInningsBalls,
    firstInningsWickets,
  } = state;

  // FIRST INNINGS OPENERS
  const [openStriker, setOpenStriker] = useState("");
  const [openNonStriker, setOpenNonStriker] = useState("");
  const [openBowler, setOpenBowler] = useState("");

  // SECOND INNINGS OPENERS
  const [showSecondInningsSetup, setShowSecondInningsSetup] = useState(false);
  const [secondStriker, setSecondStriker] = useState("");
  const [secondNonStriker, setSecondNonStriker] = useState("");
  const [secondBowler, setSecondBowler] = useState("");

  // MODALS
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [wicketType, setWicketType] = useState("Bowled");
  const [replacementBatsman, setReplacementBatsman] = useState("");

  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [nextBowlerName, setNextBowlerName] = useState("");

  const oversText = `${Math.floor(balls / 6)}.${balls % 6}`;
  const totalBalls = (oversLimit || 0) * 6;
  const inningsOver =
    (oversLimit != null ? balls >= totalBalls : false) || wickets >= 10;

  // run rate
  const currentOvers = balls > 0 ? balls / 6 : 0;
  const currentRR =
    currentOvers > 0 ? (runs / currentOvers).toFixed(2) : "0.00";

  let runsNeeded = null;
  let ballsRemaining = null;
  let requiredRR = null;
  if (inningsNumber === 2 && target != null) {
    runsNeeded = target - runs;
    ballsRemaining = totalBalls - balls;
    if (runsNeeded > 0 && ballsRemaining > 0) {
      requiredRR = (runsNeeded / (ballsRemaining / 6)).toFixed(2);
    }
  }

  const controlsDisabled =
    !matchStarted ||
    showWicketModal ||
    showBowlerModal ||
    matchFinished ||
    (inningsNumber === 2 && inningsOver);

  const canStartMatch =
    openStriker.trim() && openNonStriker.trim() && openBowler.trim();

  // START MATCH
  const handleStartMatch = () => {
    if (!canStartMatch) return;
    dispatch({
      type: "START_MATCH",
      striker: openStriker.trim(),
      nonStriker: openNonStriker.trim(),
      currentBowler: openBowler.trim(),
    });
  };

  // BALL EVENT (wrapper)
  const handleBallPress = (
    runsMade = 0,
    isExtra = false,
    isWicket = false,
    label
  ) => {
    if (controlsDisabled) return;

    dispatch({
      type: "BALL_EVENT",
      runs: runsMade,
      isExtra,
      isWicket,
      event: label || String(runsMade),
    });

    if (isWicket) {
      setWicketType(label || "Wicket");
      setShowWicketModal(true);
      return;
    }

    // Over complete → Change bowler (only if more overs left)
    const nextBall = balls + (isExtra ? 0 : 1);
    if (
      !isExtra &&
      nextBall > 0 &&
      nextBall % 6 === 0 &&
      oversLimit != null &&
      nextBall < totalBalls
    ) {
      setShowBowlerModal(true);
    }
  };

  const confirmReplacement = () => {
    const name = replacementBatsman.trim();
    if (!name) return;

    dispatch({ type: "ADD_BATSMAN", name });
    setReplacementBatsman("");
    setShowWicketModal(false);
  };

  const confirmNextBowler = () => {
    const nm = nextBowlerName.trim();
    if (!nm) return;

    dispatch({ type: "CHANGE_BOWLER", name: nm });
    setNextBowlerName("");
    setShowBowlerModal(false);
  };

  const handleEndInnings = () => {
    const prepareSecond = inningsNumber === 1;
    dispatch({ type: "END_INNINGS", prepareSecond });

    if (inningsNumber === 1) {
      setShowSecondInningsSetup(true);
    }
  };

  // ===========================
  // PATCH #1 → AUTO 1st → 2nd innings
  // ===========================
  useEffect(() => {
    if (!matchStarted) return;
    if (inningsNumber === 1 && inningsOver) {
      dispatch({ type: "END_INNINGS", prepareSecond: true });
      setShowSecondInningsSetup(true);
    }
  }, [inningsOver, inningsNumber, matchStarted, dispatch]);

  // ===========================
  // PATCH #2 → AUTO MATCH FINISH IN 2ND INNINGS
  // ===========================
  useEffect(() => {
    if (inningsNumber !== 2 || matchFinished) return;

    const allOut = wickets >= 10;
    const oversDone = oversLimit != null && balls >= totalBalls;
    const chased = target != null && runs >= target;

    if (allOut || oversDone || chased) {
      dispatch({ type: "END_MATCH" });
    }
  }, [
    inningsNumber,
    matchFinished,
    wickets,
    balls,
    target,
    runs,
    oversLimit,
    totalBalls,
    dispatch,
  ]);

  const startSecondInnings = () => {
    if (
      !secondStriker.trim() ||
      !secondNonStriker.trim() ||
      !secondBowler.trim()
    )
      return;

    dispatch({
      type: "START_SECOND_INNINGS",
      striker: secondStriker.trim(),
      nonStriker: secondNonStriker.trim(),
      currentBowler: secondBowler.trim(),
    });

    setShowSecondInningsSetup(false);
  };

  // first innings run rate & overs
  const firstOversText =
    firstInningsBalls && firstInningsBalls > 0
      ? `${Math.floor(firstInningsBalls / 6)}.${firstInningsBalls % 6}`
      : "-";

  const firstRR =
    firstInningsBalls && firstInningsBalls > 0
      ? (firstInningsTotal / (firstInningsBalls / 6)).toFixed(2)
      : "0.00";

  const firstInningsTeam =
    inningsNumber === 2 ? (battingTeam === teamA ? teamB : teamA) : battingTeam;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="mb-4 text-center text-sm font-semibold">
        {matchFinished
          ? "Match Completed"
          : inningsNumber === 1
          ? "1st Innings In Progress"
          : "2nd Innings In Progress"}
      </div>

      <Card className="p-5">
        <CardContent className="space-y-6">
          {/* Scoreboard Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">
                {battingTeam || "Batting Team"} Batting
              </h2>
              <p className="text-sm text-muted-foreground">
                {bowlingTeam || "Bowling Team"}
              </p>
              {inningsNumber === 2 && target && (
                <p className="text-sm">
                  Target: <b>{target}</b>
                </p>
              )}
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold">
                {runs}/{wickets}
              </div>
              <div className="text-sm">
                Overs: {oversText}/{oversLimit ?? "-"}
              </div>
              <div className="text-sm">
                Bowler: <b>{currentBowler || "—"}</b>
              </div>
              <div className="text-xs mt-1">
                CRR: <b>{currentRR}</b>
                {inningsNumber === 2 && requiredRR !== null && (
                  <>
                    {" "}
                    • RRR: <b>{requiredRR}</b> ({runsNeeded} off{" "}
                    {ballsRemaining})
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RUN / EXTRA / WICKET */}
          <div className="space-y-4">
            {/* Runs */}
            <div>
              <div className="text-sm font-medium mb-2">Runs</div>
              <div className="flex gap-2 flex-wrap">
                {[0, 1, 2, 3, 4, 6].map((n) => (
                  <Button
                    key={n}
                    size="sm"
                    variant="outline"
                    onClick={() => handleBallPress(n, false, false, String(n))}
                    disabled={controlsDisabled}
                  >
                    {n}
                  </Button>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div>
              <div className="text-sm font-medium mb-2">Extras</div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBallPress(1, true, false, "Wide +1")}
                  disabled={controlsDisabled}
                >
                  Wide +1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBallPress(1, true, false, "No Ball +1")}
                  disabled={controlsDisabled}
                >
                  No Ball +1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBallPress(0, true, false, "Bye")}
                  disabled={controlsDisabled}
                >
                  Bye
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBallPress(0, true, false, "Leg Bye")}
                  disabled={controlsDisabled}
                >
                  Leg Bye
                </Button>
              </div>
            </div>

            {/* Wickets */}
            <div>
              <div className="text-sm font-medium mb-2">Wickets</div>
              <div className="flex gap-2 flex-wrap">
                {[
                  "Bowled",
                  "Caught",
                  "LBW",
                  "Run Out",
                  "Stumped",
                  "Hit Wicket",
                  "Retired",
                ].map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setWicketType(type);
                      handleBallPress(0, false, true, type);
                    }}
                    disabled={controlsDisabled}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Swap Striker */}
            <div>
              <div className="text-sm font-medium mb-2">Change Strike</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => dispatch({ type: "SWAP_STRIKER" })}
                disabled={controlsDisabled}
              >
                Swap Striker
              </Button>
            </div>
          </div>

          {/* START MATCH */}
          {!matchStarted && inningsNumber === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="text-xs">Striker</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={openStriker}
                  onChange={(e) => setOpenStriker(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs">Non-Striker</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={openNonStriker}
                  onChange={(e) => setOpenNonStriker(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs">Bowler</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={openBowler}
                  onChange={(e) => setOpenBowler(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleStartMatch}
                  disabled={!canStartMatch}
                >
                  Start Match
                </Button>
              </div>
            </div>
          )}

          {/* SECOND INNINGS SETUP */}
          {showSecondInningsSetup && inningsNumber === 2 && (
            <div className="p-4 border rounded">
              <h3 className="font-semibold mb-3">Second Innings Setup</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs">Striker</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={secondStriker}
                    onChange={(e) => setSecondStriker(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs">Non-Striker</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={secondNonStriker}
                    onChange={(e) => setSecondNonStriker(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs">Bowler</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={secondBowler}
                    onChange={(e) => setSecondBowler(e.target.value)}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-4"
                onClick={startSecondInnings}
              >
                Start Second Innings
              </Button>
            </div>
          )}

          {/* Batsmen */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Batsmen</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th>Name</th>
                  <th className="text-center">R</th>
                  <th className="text-center">B</th>
                  <th className="text-center">4s</th>
                  <th className="text-center">6s</th>
                  <th className="text-center">SR</th>
                  <th>Out</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(batsmenStats).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center">
                      No batsmen yet
                    </td>
                  </tr>
                ) : (
                  Object.keys(batsmenStats).map((p) => {
                    const s = batsmenStats[p];
                    const sr =
                      s.balls > 0
                        ? ((s.runs / s.balls) * 100).toFixed(2)
                        : "0.00";

                    return (
                      <tr key={p} className="border-t">
                        <td className="py-2 font-medium">
                          {p} {p === striker && "*"}{" "}
                          {p === nonStriker && "(NS)"}
                        </td>
                        <td className="text-center">{s.runs}</td>
                        <td className="text-center">{s.balls}</td>
                        <td className="text-center">{s.fours}</td>
                        <td className="text-center">{s.sixes}</td>
                        <td className="text-center">{sr}</td>
                        <td>{s.outBy || "Not Out"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bowler Summary */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Bowler Summary</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th>Bowler</th>
                  <th className="text-center">O</th>
                  <th className="text-center">R</th>
                  <th className="text-center">W</th>
                  <th className="text-center">M</th>
                  <th className="text-center">Eco</th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(bowlerStats).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center">
                      No bowlers yet
                    </td>
                  </tr>
                ) : (
                  Object.keys(bowlerStats).map((b) => {
                    const ob = bowlerStats[b];
                    const o = `${Math.floor(ob.balls / 6)}.${ob.balls % 6}`;
                    const eco =
                      ob.balls > 0
                        ? (ob.runs / (ob.balls / 6)).toFixed(1)
                        : "0.0";

                    return (
                      <tr key={b} className="border-t">
                        <td className="py-2 font-medium">{b}</td>
                        <td className="text-center">{o}</td>
                        <td className="text-center">{ob.runs}</td>
                        <td className="text-center">{ob.wickets}</td>
                        <td className="text-center">{ob.maidens || 0}</td>
                        <td className="text-center">{eco}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* First Innings Summary */}
          {firstInningsTotal !== null && (
            <div className="mt-6 p-4 border rounded">
              <h3 className="font-semibold mb-2">1st Innings Summary</h3>
              <p className="text-sm">
                Team: <b>{firstInningsTeam || "First Innings Team"}</b> —{" "}
                <b>
                  {firstInningsTotal}/{firstInningsWickets}
                </b>{" "}
                in {firstOversText} overs (RR {firstRR})
              </p>

              {Object.keys(firstInningsBatsmen || {}).length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium mb-1 text-sm">
                    1st Innings Batsmen
                  </h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th>Name</th>
                        <th className="text-center">R</th>
                        <th className="text-center">B</th>
                        <th className="text-center">4s</th>
                        <th className="text-center">6s</th>
                        <th className="text-center">SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(firstInningsBatsmen).map((p) => {
                        const s = firstInningsBatsmen[p];
                        const sr =
                          s.balls > 0
                            ? ((s.runs / s.balls) * 100).toFixed(1)
                            : "0.0";
                        return (
                          <tr key={p} className="border-t">
                            <td className="py-1">{p}</td>
                            <td className="text-center">{s.runs}</td>
                            <td className="text-center">{s.balls}</td>
                            <td className="text-center">{s.fours}</td>
                            <td className="text-center">{s.sixes}</td>
                            <td className="text-center">{sr}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {Object.keys(firstInningsBowlers || {}).length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium mb-1 text-sm">
                    1st Innings Bowlers
                  </h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th>Bowler</th>
                        <th className="text-center">O</th>
                        <th className="text-center">R</th>
                        <th className="text-center">W</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(firstInningsBowlers).map((b) => {
                        const ob = firstInningsBowlers[b];
                        const o = `${Math.floor(ob.balls / 6)}.${ob.balls % 6}`;
                        return (
                          <tr key={b} className="border-t">
                            <td className="py-1">{b}</td>
                            <td className="text-center">{o}</td>
                            <td className="text-center">{ob.runs}</td>
                            <td className="text-center">{ob.wickets}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {firstInningsFall?.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-sm">
                    Fall of Wickets (1st Innings)
                  </h4>
                  <ul className="list-disc ml-5 mt-1 text-xs">
                    {firstInningsFall.map((f, i) => (
                      <li key={i}>
                        {f.player} — {f.score} ({f.over})
                        {f.bowler && (
                          <>
                            {" "}
                            by {f.bowler}
                            {f.type ? ` (${f.type})` : ""}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ================================
             PATCH #3 → ALWAYS SHOW 2ND INNINGS SUMMARY
          ================================= */}
          {matchFinished && (
            <div className="mt-6 p-4 border rounded">
              <h3 className="font-semibold mb-2">2nd Innings Summary</h3>

              <p className="text-sm">
                Team: <b>{battingTeam}</b> —{" "}
                <b>
                  {runs}/{wickets}
                </b>{" "}
                in {oversText} overs (RR {currentRR})
              </p>

              {/* 2nd Innings Batsmen */}
              {Object.keys(batsmenStats).length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium mb-1 text-sm">
                    2nd Innings Batsmen
                  </h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th>Name</th>
                        <th className="text-center">R</th>
                        <th className="text-center">B</th>
                        <th className="text-center">4s</th>
                        <th className="text-center">6s</th>
                        <th className="text-center">SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(batsmenStats).map((p) => {
                        const s = batsmenStats[p];
                        const sr =
                          s.balls > 0
                            ? ((s.runs / s.balls) * 100).toFixed(1)
                            : "0.0";
                        return (
                          <tr key={p} className="border-t">
                            <td className="py-1">{p}</td>
                            <td className="text-center">{s.runs}</td>
                            <td className="text-center">{s.balls}</td>
                            <td className="text-center">{s.fours}</td>
                            <td className="text-center">{s.sixes}</td>
                            <td className="text-center">{sr}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 2nd Innings Bowlers */}
              {Object.keys(bowlerStats).length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium mb-1 text-sm">
                    2nd Innings Bowlers
                  </h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th>Bowler</th>
                        <th className="text-center">O</th>
                        <th className="text-center">R</th>
                        <th className="text-center">W</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(bowlerStats).map((b) => {
                        const ob = bowlerStats[b];
                        const o = `${Math.floor(ob.balls / 6)}.${ob.balls % 6}`;
                        return (
                          <tr key={b} className="border-t">
                            <td className="py-1">{b}</td>
                            <td className="text-center">{o}</td>
                            <td className="text-center">{ob.runs}</td>
                            <td className="text-center">{ob.wickets}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 2nd Innings Fall of Wickets */}
              {fallOfWickets?.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-sm">
                    Fall of Wickets (2nd Innings)
                  </h4>
                  <ul className="list-disc ml-5 mt-1 text-xs">
                    {fallOfWickets.map((f, i) => (
                      <li key={i}>
                        {f.player} — {f.score} ({f.over}){" "}
                        {f.bowler ? `by ${f.bowler}` : ""}{" "}
                        {f.type ? `(${f.type})` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Bottom Controls */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm">
              Balls: {balls} • Overs: {oversText}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEndInnings}>
                End Innings
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  dispatch({ type: "END_MATCH" });
                  navigate("/result");
                }}
              >
                Go For Result
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wicket Modal */}
      {showWicketModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-sm">
            <h3 className="font-semibold mb-2">Batsman Out — {wicketType}</h3>

            <input
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Replacement batsman"
              value={replacementBatsman}
              onChange={(e) => setReplacementBatsman(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowWicketModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmReplacement}>Add</Button>
            </div>
          </div>
        </div>
      )}

      {/* Bowler Modal */}
      {showBowlerModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-sm">
            <h3 className="font-semibold mb-2">Change Bowler</h3>

            <input
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Next bowler"
              value={nextBowlerName}
              onChange={(e) => setNextBowlerName(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowBowlerModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmNextBowler}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
