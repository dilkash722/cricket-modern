import { useEffect, useRef, useState } from "react";
import { useMatch } from "@/context/MatchContext";
import { useNavigate } from "react-router-dom";

export const useScoreboard = () => {
  const { state, dispatch } = useMatch();
  const navigate = useNavigate();

  const [setup, setSetup] = useState({
    striker: "",
    nonStriker: "",
    bowler: "",
  });

  const [modal, setModal] = useState({ type: null, name: "" });
  const scrollRef = useRef(null);

  const lastOverRef = useRef(-1);
  const skipNextModalRef = useRef(false);

  const totalBalls = (state.oversLimit || 0) * 6;
  const oversText = `${Math.floor(state.balls / 6)}.${state.balls % 6}`;

  // ---------------- MATCH FLOW ----------------
  useEffect(() => {
    if (!state.matchStarted || state.matchFinished) return;

    const isDone =
      state.wickets >= 10 || (state.balls >= totalBalls && totalBalls > 0);

    // First innings end
    if (state.inningsNumber === 1 && isDone) {
      dispatch({ type: "END_INNINGS", prepareSecond: true });

      setSetup({
        striker: "",
        nonStriker: "",
        bowler: "",
      });

      lastOverRef.current = -1;
      skipNextModalRef.current = true;
    }

    // Second innings end
    if (state.inningsNumber === 2 && (state.runs >= state.target || isDone)) {
      dispatch({ type: "END_MATCH" });

      setTimeout(() => {
        navigate("/result");
      }, 50);
    }
  }, [
    state.runs,
    state.wickets,
    state.balls,
    state.inningsNumber,
    state.target,
    state.matchStarted,
    state.matchFinished,
    totalBalls,
  ]);

  // ---------------- SKIP FIRST RENDER AFTER START ----------------
  useEffect(() => {
    if (state.matchStarted && state.balls === 0) {
      skipNextModalRef.current = true;
      lastOverRef.current = -1;
    }
  }, [state.matchStarted]);

  // ---------------- BOWLER MODAL ----------------
  useEffect(() => {
    if (!state.matchStarted || state.matchFinished) return;

    const currentOver = Math.floor(state.balls / 6);
    const isNewOver = state.balls > 0 && state.balls % 6 === 0;

    // skip first trigger after setup
    if (skipNextModalRef.current) {
      skipNextModalRef.current = false;
      return;
    }

    if (
      isNewOver &&
      currentOver !== lastOverRef.current &&
      state.currentBowler &&
      !modal.type
    ) {
      lastOverRef.current = currentOver;
      setModal({ type: "bowler", name: "" });
    }
  }, [
    state.balls,
    state.matchStarted,
    state.matchFinished,
    state.currentBowler,
    modal.type,
  ]);

  // ---------------- SCROLL ----------------
  useEffect(() => {
    const viewport = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );

    if (viewport) {
      viewport.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.ballLog]);

  return {
    state,
    dispatch,
    setup,
    setSetup,
    modal,
    setModal,
    scrollRef,
    oversText,
    totalBalls,
  };
};
