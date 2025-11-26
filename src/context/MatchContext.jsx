import { createContext, useReducer, useContext } from "react";

const MatchContext = createContext();

const initialState = {
  teamA: "",
  teamB: "",
  tossWinner: "",
  tossChoice: "",

  battingTeam: "",
  bowlingTeam: "",
  oversLimit: null,

  matchStarted: false,
  matchFinished: false,
  inningsNumber: 1,
  target: null,

  runs: 0,
  wickets: 0,
  balls: 0,

  striker: "",
  nonStriker: "",
  batsmenStats: {},

  currentBowler: "",
  bowlerStats: {},

  ballLog: [],
  fallOfWickets: [],

  firstInningsTotal: null,
  firstInningsBallLog: [],
  firstInningsBatsmen: {},
  firstInningsBowlers: {},
  firstInningsFall: [],
  firstInningsBalls: 0,
  firstInningsWickets: 0,

  result: null,
};

function reducer(state, action) {
  switch (action.type) {
    // -------------------------------
    // TEAMS / TOSS / DECISION
    // -------------------------------
    case "SET_TEAMS":
      return { ...state, teamA: action.A, teamB: action.B };

    case "SET_TOSS":
      return { ...state, tossWinner: action.winner, tossChoice: action.choice };

    case "SET_DECISION":
      return {
        ...state,
        battingTeam: action.battingTeam,
        bowlingTeam: action.bowlingTeam,
        oversLimit: action.overs,
      };

    // -------------------------------
    // START MATCH
    // -------------------------------
    case "START_MATCH": {
      return {
        ...state,
        matchStarted: true,
        matchFinished: false,

        runs: 0,
        wickets: 0,
        balls: 0,
        ballLog: [],
        fallOfWickets: [],

        striker: action.striker,
        nonStriker: action.nonStriker,

        batsmenStats: {
          [action.striker]: {
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            outBy: null,
          },
          [action.nonStriker]: {
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            outBy: null,
          },
        },

        currentBowler: action.currentBowler,
        bowlerStats: {
          [action.currentBowler]: {
            balls: 0,
            runs: 0,
            wickets: 0,
            maidens: 0,
            prevRuns: 0,
          },
        },
      };
    }

    // -------------------------------
    // BALL EVENT
    // -------------------------------
    case "BALL_EVENT": {
      const runs = Number(action.runs || 0);
      const isExtra = !!action.isExtra;
      const isWicket = !!action.isWicket;
      const eventLabel = action.event;

      const striker = state.striker;
      const nonStriker = state.nonStriker;
      const bowler = state.currentBowler;

      if (!striker || !bowler) return state;

      // ensure bowler entry
      const bowStats = state.bowlerStats[bowler] || {
        balls: 0,
        runs: 0,
        wickets: 0,
        maidens: 0,
        prevRuns: 0,
      };

      // ensure batsman entry
      const batStats = state.batsmenStats[striker] || {
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        outBy: null,
      };

      // update batsman
      const updatedBat = {
        ...batStats,
        balls: batStats.balls + (isExtra ? 0 : 1),
        runs: batStats.runs + (isExtra ? 0 : runs),
        fours: batStats.fours + (runs === 4 ? 1 : 0),
        sixes: batStats.sixes + (runs === 6 ? 1 : 0),
      };

      const overBall = `${Math.floor(state.balls / 6)}.${state.balls % 6}`;

      if (isWicket) {
        updatedBat.outBy = `${eventLabel} @ ${overBall} by ${bowler}`;
      }

      const newBatsmenStats = {
        ...state.batsmenStats,
        [striker]: updatedBat,
      };

      // update bowler
      const updatedBowler = {
        ...bowStats,
        balls: bowStats.balls + (isExtra ? 0 : 1),
        runs: bowStats.runs + runs,
        wickets: bowStats.wickets + (isWicket ? 1 : 0),
      };

      // score / balls
      const newRuns = state.runs + runs;
      const newWickets = state.wickets + (isWicket ? 1 : 0);
      const newBalls = state.balls + (isExtra ? 0 : 1);

      // ball log
      const newBallLog = [
        ...state.ballLog,
        {
          over: overBall,
          bowler,
          batsman: striker,
          runs,
          isExtra,
          isWicket,
          event: eventLabel,
        },
      ];

      // fall of wickets
      let newFall = state.fallOfWickets;
      if (isWicket) {
        newFall = [
          ...newFall,
          {
            player: striker,
            score: `${newRuns}/${newWickets}`,
            over: overBall,
            bowler,
            type: eventLabel,
          },
        ];
      }

      // strike rotation on odd runs (valid ball & not wicket)
      let newStriker = striker;
      let newNonStriker = nonStriker;

      if (!isExtra && !isWicket && runs % 2 === 1) {
        newStriker = nonStriker;
        newNonStriker = striker;
      }

      // over complete logic
      const overComplete = !isExtra && updatedBowler.balls % 6 === 0;
      if (overComplete) {
        const overRuns = updatedBowler.runs - updatedBowler.prevRuns;
        if (overRuns === 0) {
          updatedBowler.maidens += 1;
        }
        updatedBowler.prevRuns = updatedBowler.runs;

        // end-of-over strike rotation
        [newStriker, newNonStriker] = [newNonStriker, newStriker];
      }

      return {
        ...state,
        runs: newRuns,
        wickets: newWickets,
        balls: newBalls,
        batsmenStats: newBatsmenStats,
        bowlerStats: {
          ...state.bowlerStats,
          [bowler]: updatedBowler,
        },
        striker: newStriker,
        nonStriker: newNonStriker,
        ballLog: newBallLog,
        fallOfWickets: newFall,
      };
    }

    // -------------------------------
    // NEW BATSMAN
    // -------------------------------
    case "ADD_BATSMAN":
      return {
        ...state,
        striker: action.name,
        batsmenStats: {
          ...state.batsmenStats,
          [action.name]: {
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            outBy: null,
          },
        },
      };

    // -------------------------------
    // CHANGE BOWLER
    // -------------------------------
    case "CHANGE_BOWLER": {
      const name = action.name;
      return {
        ...state,
        currentBowler: name,
        bowlerStats: {
          ...state.bowlerStats,
          [name]: state.bowlerStats[name] || {
            balls: 0,
            runs: 0,
            wickets: 0,
            maidens: 0,
            prevRuns: 0,
          },
        },
        // over ke start me strike rotate ho chuka hota hai
        striker: state.nonStriker,
        nonStriker: state.striker,
      };
    }

    // -------------------------------
    // MANUAL SWAP STRIKER
    // -------------------------------
    case "SWAP_STRIKER": {
      if (!state.striker || !state.nonStriker) return state;
      return {
        ...state,
        striker: state.nonStriker,
        nonStriker: state.striker,
      };
    }

    // -------------------------------
    // END INNINGS
    // -------------------------------
    case "END_INNINGS": {
      if (action.prepareSecond) {
        // save first innings snapshot
        return {
          ...state,
          firstInningsTotal: state.runs,
          firstInningsBatsmen: state.batsmenStats,
          firstInningsBowlers: state.bowlerStats,
          firstInningsFall: state.fallOfWickets,
          firstInningsBallLog: state.ballLog,
          firstInningsBalls: state.balls,
          firstInningsWickets: state.wickets,

          inningsNumber: 2,
          matchStarted: false,

          runs: 0,
          wickets: 0,
          balls: 0,
          striker: "",
          nonStriker: "",
          batsmenStats: {},
          bowlerStats: {},
          ballLog: [],
          fallOfWickets: [],

          target: state.runs + 1,

          battingTeam:
            state.battingTeam === state.teamA ? state.teamB : state.teamA,
          bowlingTeam:
            state.bowlingTeam === state.teamA ? state.teamA : state.teamB,
        };
      }

      // second innings end
      return {
        ...state,
        matchFinished: true,
        matchStarted: false,
      };
    }

    // -------------------------------
    // START SECOND INNINGS
    // -------------------------------
    case "START_SECOND_INNINGS":
      return {
        ...state,
        matchStarted: true,
        striker: action.striker,
        nonStriker: action.nonStriker,
        batsmenStats: {
          [action.striker]: {
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            outBy: null,
          },
          [action.nonStriker]: {
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            outBy: null,
          },
        },
        currentBowler: action.currentBowler,
        bowlerStats: {
          [action.currentBowler]: {
            balls: 0,
            runs: 0,
            wickets: 0,
            maidens: 0,
            prevRuns: 0,
          },
        },
      };

    // -------------------------------
    // END MATCH (RESULT)
    // -------------------------------
    case "END_MATCH": {
      const first = state.firstInningsTotal;
      const second = state.runs;

      let winner = "";
      let winType = "";
      let margin = 0;

      if (first === null) {
        return { ...state }; // safety
      }

      if (first === second) {
        winner = "Match Tied";
        winType = "tie";
      } else if (second > first) {
        winner = state.battingTeam;
        winType = "wickets";
        margin = 10 - state.wickets;
      } else {
        winner = state.bowlingTeam;
        winType = "runs";
        margin = first - second;
      }

      return {
        ...state,
        matchFinished: true,
        matchStarted: false,
        result: { winner, winType, margin },
      };
    }

    // -------------------------------
    // RESET
    // -------------------------------
    case "RESET_ALL":
      return initialState;

    default:
      return state;
  }
}

export function MatchProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <MatchContext.Provider value={{ state, dispatch }}>
      {children}
    </MatchContext.Provider>
  );
}

export const useMatch = () => useContext(MatchContext);
