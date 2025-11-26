import React from "react";
import { useMatch } from "../context/MatchContext.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Result() {
  const { state, dispatch } = useMatch();

  const {
    teamA,
    teamB,
    firstInningsTotal,
    firstInningsBatsmen,
    firstInningsBowlers,
    firstInningsFall,
    firstInningsBalls,
    firstInningsWickets,
    batsmenStats,
    bowlerStats,
    fallOfWickets,
    runs,
    balls,
    result,
  } = state;

  // Convert Balls → Overs
  const convertBalls = (b) => `${Math.floor(b / 6)}.${b % 6}`;

  const firstInningsOvers =
    firstInningsBalls != null ? convertBalls(firstInningsBalls) : "-";

  const secondInningsOvers = convertBalls(balls);

  // RR Calculation
  const getRR = (runs, oversText) => {
    if (!oversText || oversText === "-" || oversText === "0.0") return "0.00";
    const [ov, ball] = oversText.split(".");
    const o = Number(ov) + Number(ball) / 6;
    return o > 0 ? (runs / o).toFixed(2) : "0.00";
  };

  const RR1 = getRR(firstInningsTotal, firstInningsOvers);
  const RR2 = getRR(runs, secondInningsOvers);

  const loserTeam =
    result?.winner === teamA ? teamB : result?.winner === teamB ? teamA : "-";

  const rowStyle = "border-t border-b";

  // flexible table wrapper
  const TableWrapper = ({ children }) => (
    <div className="overflow-x-auto">{children}</div>
  );

  const renderBatsmanTable = (data) => {
    if (!data || Object.keys(data).length === 0)
      return <div className="text-sm text-muted-foreground">No data</div>;

    return (
      <TableWrapper>
        <table className="w-full text-sm min-w-[600px]">
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
            {Object.keys(data).map((name) => {
              const s = data[name];
              const sr =
                s.balls > 0 ? ((s.runs / s.balls) * 100).toFixed(2) : "0.00";

              return (
                <tr key={name} className={rowStyle}>
                  <td className="py-2 font-medium">{name}</td>
                  <td className="py-2 text-center">{s.runs}</td>
                  <td className="py-2 text-center">{s.balls}</td>
                  <td className="py-2 text-center">{s.fours}</td>
                  <td className="py-2 text-center">{s.sixes}</td>
                  <td className="py-2 text-center">{sr}</td>
                  <td className="py-2">{s.outBy || "Not Out"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrapper>
    );
  };

  const renderBowlerTable = (data) => {
    if (!data || Object.keys(data).length === 0)
      return <div className="text-sm text-muted-foreground">No data</div>;

    return (
      <TableWrapper>
        <table className="w-full text-sm min-w-[600px]">
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
            {Object.keys(data).map((name) => {
              const ob = data[name];
              const overs = `${Math.floor(ob.balls / 6)}.${ob.balls % 6}`;
              const eco =
                ob.balls > 0 ? (ob.runs / (ob.balls / 6)).toFixed(1) : "0.0";

              return (
                <tr key={name} className={rowStyle}>
                  <td className="py-2 font-medium">{name}</td>
                  <td className="py-2 text-center">{overs}</td>
                  <td className="py-2 text-center">{ob.runs}</td>
                  <td className="py-2 text-center">{ob.wickets}</td>
                  <td className="py-2 text-center">{ob.maidens || 0}</td>
                  <td className="py-2 text-center">{eco}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrapper>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <Card>
        <CardContent className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold border-b pb-2">
            Match Summary
          </h2>

          {/* 1st Innings */}
          <div className="pt-4 border-t border-b pb-4">
            <h3 className="font-semibold text-lg">1st Innings</h3>

            <div className="text-sm space-y-1">
              <p>
                Team: <b>{teamA}</b>
              </p>
              <p>
                Score: <b>{firstInningsTotal}</b> / {firstInningsWickets}
              </p>
              <p>
                Overs: <b>{firstInningsOvers}</b> — RR: <b>{RR1}</b>
              </p>
            </div>

            <div className="mt-3">
              <h4 className="font-medium mb-1">Batsmen</h4>
              {renderBatsmanTable(firstInningsBatsmen)}
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-1">Bowlers</h4>
              {renderBowlerTable(firstInningsBowlers)}
            </div>

            {firstInningsFall?.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium">Fall of Wickets</h4>
                <ul className="list-disc ml-5 mt-1 text-sm">
                  {firstInningsFall.map((f, i) => (
                    <li key={i}>
                      {f.player} — {f.score} ({f.over})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 2nd Innings */}
          <div className="pt-4 border-b pb-4">
            <h3 className="font-semibold text-lg">2nd Innings</h3>

            <div className="text-sm space-y-1">
              <p>
                Team: <b>{teamB}</b>
              </p>
              <p>
                Score: <b>{runs}</b> / {fallOfWickets?.length}
              </p>
              <p>
                Overs: <b>{secondInningsOvers}</b> — RR: <b>{RR2}</b>
              </p>
            </div>

            <div className="mt-3">
              <h4 className="font-medium mb-1">Batsmen</h4>
              {renderBatsmanTable(batsmenStats)}
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-1">Bowlers</h4>
              {renderBowlerTable(bowlerStats)}
            </div>

            {fallOfWickets?.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium">Fall of Wickets</h4>
                <ul className="list-disc ml-5 mt-1 text-sm">
                  {fallOfWickets.map((f, i) => (
                    <li key={i}>
                      {f.player} — {f.score} ({f.over})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RESULT */}
          <div className="pt-4">
            <h3 className="font-semibold mb-2 text-lg">Result</h3>

            {result?.winType === "tie" ? (
              <div className="p-4 border rounded bg-gray-50">
                <div className="text-lg md:text-xl font-bold">Match Tied</div>
                <p className="text-sm mt-2">
                  Both teams ended with equal runs.
                </p>
              </div>
            ) : result?.winner ? (
              <div className="p-4 border rounded space-y-6 bg-gray-50">
                {/* Winner */}
                <div>
                  <div className="text-lg md:text-xl font-bold">
                    {result.winner} Won
                  </div>

                  <p className="text-sm mt-1">
                    {result.winType === "wickets"
                      ? `by ${result.margin} wickets`
                      : `by ${result.margin} runs`}
                  </p>

                  <div className="mt-3 text-sm bg-green-100 p-3 rounded border">
                    <h4 className="font-semibold mb-1 text-green-900">
                      Winner Details
                    </h4>

                    {result.winner === teamA ? (
                      <>
                        <p>
                          Score: <b>{firstInningsTotal}</b> /{" "}
                          {firstInningsWickets} ({firstInningsOvers} overs)
                        </p>
                        <p>
                          Run Rate: <b>{RR1}</b>
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          Score: <b>{runs}</b> / {fallOfWickets.length} (
                          {secondInningsOvers} overs)
                        </p>
                        <p>
                          Run Rate: <b>{RR2}</b>
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Loser */}
                <div>
                  <h4 className="font-semibold text-red-900">
                    Losing Team — {loserTeam}
                  </h4>

                  <div className="text-sm bg-red-100 p-3 rounded border mt-1">
                    {loserTeam === teamA ? (
                      <>
                        <p>
                          Score: <b>{firstInningsTotal}</b> /{" "}
                          {firstInningsWickets} ({firstInningsOvers} overs)
                        </p>
                        <p>
                          Run Rate: <b>{RR1}</b>
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          Score: <b>{runs}</b> / {fallOfWickets.length} (
                          {secondInningsOvers} overs)
                        </p>
                        <p>
                          Run Rate: <b>{RR2}</b>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Result not decided yet.
              </div>
            )}
          </div>

          {/* RESET + PRINT */}
          <div className="mt-4 flex flex-col md:flex-row gap-3">
            <Button
              className="w-full md:w-auto"
              variant="outline"
              onClick={() => dispatch({ type: "RESET_ALL" })}
            >
              Reset Match
            </Button>

            <Button
              className="w-full md:w-auto"
              variant="outline"
              onClick={() => window.print()}
            >
              Print Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
