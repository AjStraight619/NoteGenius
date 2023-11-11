import { fetcher } from "@/lib/fetcher";
import { useEffect, useReducer } from "react";
import useSWR from "swr";

export type MathResponseProps = {
  equations: string[];
};

type MathState = {
  mathResponse: string;
  isMathChecked: boolean;
  isMathCorrect: boolean;
  isMathLoading: boolean;
  isMathError: boolean;
  mathError: string;
};

type MathAction =
  | { type: "MATH_RESPONSE"; payload: string }
  | { type: "IS_MATH_CHECKED"; payload: boolean }
  | { type: "IS_MATH_CORRECT"; payload: boolean }
  | { type: "IS_MATH_LOADING"; payload: boolean }
  | { type: "IS_MATH_ERROR"; payload: boolean }
  | { type: "MATH_ERROR"; payload: string };

const initialState: MathState = {
  mathResponse: "",
  isMathChecked: false,
  isMathCorrect: false,
  isMathLoading: false,
  isMathError: false,
  mathError: "",
};

function mathReducer(state: MathState, action: MathAction): MathState {
  switch (action.type) {
    case "MATH_RESPONSE":
      return {
        ...state,
        mathResponse: action.payload,
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

const useMathResponse = ({ equations }: MathResponseProps) => {
  // use a queue for the math content?
  const queryString = equations
    .map((eq) => `equation=${encodeURIComponent(eq)}`)
    .join("&");

  const { data, error, isLoading } = useSWR(
    equations.length > 0 ? `/api/wolfram-alpha?${queryString}` : null,
    fetcher
  );

  const [mathState, mathDispatch] = useReducer(mathReducer, initialState);

  useEffect(() => {
    // Update loading state
    mathDispatch({ type: "IS_MATH_LOADING", payload: isLoading });

    if (error) {
      // Update error state
      mathDispatch({ type: "IS_MATH_ERROR", payload: true });
      mathDispatch({ type: "MATH_ERROR", payload: error.message });
    }

    if (data) {
      // Update math response state
      mathDispatch({ type: "MATH_RESPONSE", payload: data });
      // Here, you might want to add additional logic to format the response
    }
  }, [data, error, isLoading, equations]);

  return {
    mathState,
    mathDispatch,
    isLoadingMath: mathState.isMathLoading,
    isError: mathState.isMathError,
    mathResponse: mathState.mathResponse,
  };
};

export default useMathResponse;
