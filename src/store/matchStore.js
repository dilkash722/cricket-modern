import { create } from "zustand";

export const useMatchStore = create((set, get) => ({
  // Basic match info
  teamA: "",
  teamB: "",
  oversLimit: 0,
  tossWinner: "",
  battingTeam: "",

  // Innings summary
  runs: 0,
  wickets: 0,
  balls: 0, // legal balls only

  // Batting
  batters: [
    // { name, runs, balls, fours, sixes, ones, isOut }
  ],
  strikerName: "",
  nonStrikerName: "",

  // Bowling
  bowlers: [
    // { name, balls, runs, wickets }
  ],
  currentBowlerName: "",

  // Extras
  extras: {
    wides: 0,
    noBalls: 0,
  },

  // Ball log
  ballLog: [
    // { id, over, description }
  ],

  // ---------- Utility helpers ----------
  getOversText: () => {
    const { balls } = get();
    const over = Math.floor(balls / 6);
    const ball = balls % 6;
    return `${over}.${ball}`;
  },

  totalBallsLimit: () => {
    const { oversLimit } = get();
    return oversLimit * 6;
  },

  canBowlMore: () => {
    const { balls, oversLimit, wickets } = get();
    return balls < oversLimit * 6 && wickets < 10;
  },

  // ---------- Setup ----------
  setSetupData: ({ teamA, teamB, oversLimit, tossWinner, battingTeam }) => {
    set({
      teamA,
      teamB,
      oversLimit,
      tossWinner,
      battingTeam,
      runs: 0,
      wickets: 0,
      balls: 0,
      batters: [],
      strikerName: "",
      nonStrikerName: "",
      bowlers: [],
      currentBowlerName: "",
      extras: { wides: 0, noBalls: 0 },
      ballLog: [],
    });
  },

  // ---------- Batting / Bowling pair ----------
  setBattingPair: (strikerName, nonStrikerName) => {
    const state = get();
    const batters = [...state.batters];

    const ensureBatter = (name) => {
      if (!name) return;
      const existing = batters.find(
        (b) => b.name.toLowerCase() === name.toLowerCase()
      );
      if (!existing) {
        batters.push({
          name,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          ones: 0,
          isOut: false,
        });
      }
    };

    ensureBatter(strikerName);
    ensureBatter(nonStrikerName);

    set({
      batters,
      strikerName,
      nonStrikerName,
    });
  },

  setCurrentBowler: (bowlerName) => {
    const state = get();
    if (!bowlerName) return;

    const bowlers = [...state.bowlers];
    const existing = bowlers.find(
      (b) => b.name.toLowerCase() === bowlerName.toLowerCase()
    );
    if (!existing) {
      bowlers.push({
        name: bowlerName,
        balls: 0,
        runs: 0,
        wickets: 0,
      });
    }

    set({
      bowlers,
      currentBowlerName: bowlerName,
    });
  },

  // New batter after wicket
  registerNewBatter: (newName) => {
    if (!newName) return;
    const state = get();
    const batters = [...state.batters];
    const exists = batters.find(
      (b) => b.name.toLowerCase() === newName.toLowerCase()
    );
    if (!exists) {
      batters.push({
        name: newName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        ones: 0,
        isOut: false,
      });
    }
    set({
      batters,
      strikerName: newName, // new batter comes as striker
    });
  },

  // ---------- Internal helpers ----------
  _updateBattersAfterRun: (runs) => {
    const state = get();
    const { strikerName } = state;
    if (!strikerName) return;

    const batters = state.batters.map((b) => {
      if (b.name === strikerName && !b.isOut) {
        const updated = { ...b };
        updated.runs += runs;
        updated.balls += 1;
        if (runs === 4) updated.fours += 1;
        if (runs === 6) updated.sixes += 1;
        if (runs === 1) updated.ones += 1;
        return updated;
      }
      return b;
    });

    set({ batters });
  },

  _updateBowlerBall: (runs, isLegal, isWicket = false) => {
    const state = get();
    const { currentBowlerName } = state;
    if (!currentBowlerName) return;

    const bowlers = state.bowlers.map((b) => {
      if (b.name === currentBowlerName) {
        const updated = { ...b };
        if (isLegal) updated.balls += 1;
        updated.runs += runs;
        if (isWicket) updated.wickets += 1;
        return updated;
      }
      return b;
    });

    set({ bowlers });
  },

  _addBallLog: (desc) => {
    const state = get();
    const over = state.getOversText();
    const { strikerName, currentBowlerName } = state;
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      over,
      description: desc,
      batter: strikerName || "-",
      bowler: currentBowlerName || "-",
    };
    set({ ballLog: [entry, ...state.ballLog].slice(0, 24) }); // last 24 balls
  },

  _flipStrike: () => {
    const { strikerName, nonStrikerName } = get();
    set({
      strikerName: nonStrikerName,
      nonStrikerName: strikerName,
    });
  },

  // ---------- Scoring actions ----------
  addRunsBall: (runs) => {
    const state = get();
    if (!state.canBowlMore()) return;
    if (!state.strikerName || !state.currentBowlerName) return;

    const newBalls = state.balls + 1;
    const newRuns = state.runs + runs;

    // update batters & bowler
    state._updateBattersAfterRun(runs);
    state._updateBowlerBall(runs, true, false);

    // strike rotation
    let strikerName = state.strikerName;
    let nonStrikerName = state.nonStrikerName;
    if (runs % 2 === 1) {
      [strikerName, nonStrikerName] = [nonStrikerName, strikerName];
    }
    if (newBalls % 6 === 0) {
      [strikerName, nonStrikerName] = [nonStrikerName, strikerName];
    }

    set({
      runs: newRuns,
      balls: newBalls,
      strikerName,
      nonStrikerName,
    });

    get()._addBallLog(`${runs} run(s)`);
  },

  addWide: () => {
    const state = get();
    if (!state.canBowlMore()) return;
    if (!state.currentBowlerName) return;

    const extras = {
      ...state.extras,
      wides: state.extras.wides + 1,
    };
    const newRuns = state.runs + 1;

    set({
      extras,
      runs: newRuns,
    });

    state._updateBowlerBall(1, false, false);
    get()._addBallLog("Wide +1");
  },

  addNoBall: () => {
    const state = get();
    if (!state.canBowlMore()) return;
    if (!state.currentBowlerName) return;

    const extras = {
      ...state.extras,
      noBalls: state.extras.noBalls + 1,
    };
    const newRuns = state.runs + 1;

    set({
      extras,
      runs: newRuns,
    });

    state._updateBowlerBall(1, false, false);
    get()._addBallLog("No ball +1");
  },

  addWicket: () => {
    const state = get();
    if (!state.canBowlMore()) return;
    if (!state.strikerName || !state.currentBowlerName) return;

    const newBalls = state.balls + 1;
    const newWickets = state.wickets + 1;

    // mark striker out
    const batters = state.batters.map((b) => {
      if (b.name === state.strikerName && !b.isOut) {
        return { ...b, balls: b.balls + 1, isOut: true };
      }
      return b;
    });

    // bowler stats
    state._updateBowlerBall(0, true, true);

    // end of over strike flip
    let strikerName = state.strikerName;
    let nonStrikerName = state.nonStrikerName;
    if (newBalls % 6 === 0) {
      [strikerName, nonStrikerName] = [nonStrikerName, strikerName];
    }

    set({
      batters,
      balls: newBalls,
      wickets: newWickets,
      strikerName, // new batter will replace striker later
      nonStrikerName,
    });

    get()._addBallLog("Wicket!");
  },

  // ---------- Reset ----------
  resetScore: () => {
    set((state) => ({
      runs: 0,
      wickets: 0,
      balls: 0,
      batters: [],
      strikerName: "",
      nonStrikerName: "",
      bowlers: [],
      currentBowlerName: "",
      extras: { wides: 0, noBalls: 0 },
      ballLog: [],
      // match info (teams, overs, toss) same rahega
    }));
  },

  resetAll: () => {
    set({
      teamA: "",
      teamB: "",
      oversLimit: 0,
      tossWinner: "",
      battingTeam: "",
      runs: 0,
      wickets: 0,
      balls: 0,
      batters: [],
      strikerName: "",
      nonStrikerName: "",
      bowlers: [],
      currentBowlerName: "",
      extras: { wides: 0, noBalls: 0 },
      ballLog: [],
    });
  },
}));
