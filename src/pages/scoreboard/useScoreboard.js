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

  const totalBalls = (state.oversLimit || 0) * 6;
  const oversText = `${Math.floor(state.balls / 6)}.${state.balls % 6}`;

  useEffect(() => {
    if (state.matchStarted && !state.matchFinished) {
      const isDone =
        state.wickets >= 10 || (state.balls >= totalBalls && totalBalls > 0);

      if (state.inningsNumber === 1 && isDone) {
        dispatch({ type: "END_INNINGS", prepareSecond: true });
        setSetup({ striker: "", nonStriker: "", bowler: "" });
      } else if (
        state.inningsNumber === 2 &&
        (state.runs >= state.target || isDone)
      ) {
        dispatch({ type: "FINISH_MATCH" });
        navigate("/result");
      }
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
    dispatch,
    navigate,
  ]);

  useEffect(() => {
    if (state.balls > 0 && state.balls % 6 === 0 && !modal.type) {
      setModal({ type: "bowler", name: "" });
    }
  }, [state.balls]);

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
