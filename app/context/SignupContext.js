import React, { createContext, useState } from "react";

export const SignupContext = createContext();

export function SignupProvider({ children }) {
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
  });

  const clearSignupData = () => {
    setSignupData({ email: "", password: "" });
  };

  return (
    <SignupContext.Provider
      value={{ signupData, setSignupData, clearSignupData }}
    >
      {children}
    </SignupContext.Provider>
  );
}

