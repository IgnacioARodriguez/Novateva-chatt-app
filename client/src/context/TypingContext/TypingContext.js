import { createContext, useEffect, useReducer } from "react";
import TypingReducer from "./TypingReducer";

const INITIAL_STATE = {
  typing: null,
  isFetching: false,
  error: false,
};

export const TypingContext = createContext(INITIAL_STATE);

export const TypingContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(TypingReducer, INITIAL_STATE);

  return (
    <TypingContext.Provider
      value={{
        typing: state.typing,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
};
