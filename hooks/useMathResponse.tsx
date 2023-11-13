import { WolframAlphaResponse } from "@/types/wolframAlphaTypes";

import { useEffect, useReducer } from "react";

export type MathResponseProps = {
  equations: string[];
};

type MathState = {
  mathResponse: WolframAlphaResponse;
  isMathChecked: boolean;
  isMathCorrect: boolean;
  isMathLoading: boolean;
  isMathError: boolean;
  mathError: string;
  equations: string[];
  answer: string;
  steps: string;
};

type MathAction =
  | { type: "ADD_EQUATION"; payload: string }
  | { type: "MATH_RESPONSE"; payload: WolframAlphaResponse }
  | { type: "REMOVE_EQUATION"; payload: string }
  | { type: "IS_MATH_CHECKED"; payload: boolean }
  | { type: "IS_MATH_CORRECT"; payload: boolean }
  | { type: "IS_MATH_LOADING"; payload: boolean }
  | { type: "IS_MATH_ERROR"; payload: boolean }
  | { type: "MATH_ERROR"; payload: string };

const initialState: MathState = {
  mathResponse: {} as WolframAlphaResponse,
  isMathChecked: false,
  isMathCorrect: false,
  isMathLoading: false,
  isMathError: false,
  mathError: "",
  equations: [],
  answer: "",
  steps: "",
};

function mathReducer(state: MathState, action: MathAction): MathState {
  switch (action.type) {
    case "ADD_EQUATION":
      return {
        ...state,
        equations: [...state.equations, action.payload],
      };
    case "MATH_RESPONSE":
      const { answer, steps } = extractAnswerAndSteps(action.payload);
      return {
        ...state,
        mathResponse: action.payload,
        answer,
        steps,
      };
    case "REMOVE_EQUATION":
      return {
        ...state,
        equations: state.equations.filter((eq) => eq !== action.payload),
      };
    case "IS_MATH_CHECKED":
      return {
        ...state,
        isMathChecked: action.payload,
      };
    case "IS_MATH_CORRECT":
      return {
        ...state,
        isMathCorrect: action.payload,
      };
    case "IS_MATH_LOADING":
      return {
        ...state,
        isMathLoading: action.payload,
      };
    case "IS_MATH_ERROR":
      return {
        ...state,
        isMathError: action.payload,
      };
    case "MATH_ERROR":
      return {
        ...state,
        mathError: action.payload,
      };
    default:
      return state;
  }
}

function extractAnswerAndSteps(response: WolframAlphaResponse): {
  answer: string;
  steps: string;
} {
  let answer = "";
  let steps = "";

  response.queryresult.pods.forEach((pod) => {
    if (pod.title === "Solutions") {
      answer = pod.subpods.map((subpod) => subpod.plaintext).join("\n");
    }
    if (pod.title === "Step-by-step solution") {
      steps = pod.subpods.map((subpod) => subpod.plaintext).join("\n");
    }
  });

  return { answer, steps };
}
const useMathResponse = () => {
  const [mathState, mathDispatch] = useReducer(mathReducer, {
    ...initialState,
  });

  useEffect(() => {
    const fetchMathData = async (equation: string) => {
      if (!equation) {
        return;
      }
      mathDispatch({ type: "IS_MATH_LOADING", payload: true });

      try {
        const response = await fetch(
          `/api/wolfram-alpha?equation=${encodeURIComponent(equation)}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: WolframAlphaResponse = await response.json();
        mathDispatch({ type: "MATH_RESPONSE", payload: data });
        mathDispatch({ type: "REMOVE_EQUATION", payload: equation });
      } catch (err) {
        mathDispatch({ type: "IS_MATH_ERROR", payload: true });
        mathDispatch({
          type: "MATH_ERROR",
          payload: "An error occurred while retrieving calculations",
        });
      } finally {
        mathDispatch({ type: "IS_MATH_LOADING", payload: false });
      }
    };

    if (mathState.equations.length > 0) {
      const equationToProcess = mathState.equations[0];
      fetchMathData(equationToProcess);
    }
  }, [mathState.equations]);

  return {
    mathState,
    mathDispatch,
    isLoadingMath: mathState.isMathLoading,
    isError: mathState.isMathError,
    mathResponse: mathState.mathResponse,
    answer: mathState.answer,
    steps: mathState.steps,
  };
};

export default useMathResponse;
