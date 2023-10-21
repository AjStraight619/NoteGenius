// import { useEffect, useMemo, useReducer } from "react";

// const initialState = {
//   equationQueue: [],
//   selectedOptions: {},
//   apiResponse: {},
// };

// // Define action types
// type ActionTypes = "ADD_EQUATION" | "TOGGLE_OPTION" | "SET_API_RESPONSE";

// // Define action objects
// type AddEquationAction = {
//   type: "ADD_EQUATION";
//   payload: string; // assuming equations are strings
// };

// type ToggleOptionAction = {
//   type: "TOGGLE_OPTION";
//   payload: {
//     option: string;
//     value: boolean;
//   };
// };

// type SetApiResponseAction = {
//   type: "SET_API_RESPONSE";
//   payload: ApiResponse; // assuming you have a type ApiResponse
// };

// // Union type for actions
// type Actions = AddEquationAction | ToggleOptionAction | SetApiResponseAction;

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "ADD_EQUATION":
//       return {
//         ...state,
//         equationQueue: [...state.equationQueue, action.payload],
//       };
//     case "TOGGLE_OPTION":
//       return {
//         ...state,
//         selectedOptions: {
//           ...state.selectedOptions,
//           [action.payload.option]: action.payload.value,
//         },
//       };
//     case "SET_API_RESPONSE":
//       return { ...state, apiResponse: action.payload };
//     // ... other cases
//     default:
//       throw new Error(`Unhandled action type: ${action.type}`);
//   }
// };

// const useMathProcessor = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   const addEquation = (equation) => {
//     dispatch({ type: "ADD_EQUATION", payload: equation });
//   };

//   const toggleOption = (option, value) => {
//     dispatch({ type: "TOGGLE_OPTION", payload: { option, value } });
//   };

//   // ... other action dispatchers

//   useEffect(() => {
//     // Logic to process equation queue and interact with Wolfram Alpha API
//     // ...
//     // When API response is received:
//     dispatch({ type: "SET_API_RESPONSE", payload: apiResponse });
//   }, [state.equationQueue]);

//   const processedData = useMemo(() => {
//     // Memoized processing of data to avoid unnecessary re-computations
//     return processApiResponse(state.apiResponse, state.selectedOptions);
//   }, [state.apiResponse, state.selectedOptions]);

//   return {
//     ...state,
//     addEquation,
//     toggleOption,
//     processedData,
//     // ... other exported values and functions
//   };
// };

// export default useMathProcessor;
