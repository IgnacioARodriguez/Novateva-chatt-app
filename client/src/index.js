import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthState/AuthContext";
import { TypingContextProvider } from "./context/TypingContext/TypingContext";
import { UserContextProvider } from "./context/UserState/UserContext";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <UserContextProvider>
        <TypingContextProvider>
          <App />
        </TypingContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
