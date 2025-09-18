import React, { createContext, useState } from "react";

/**
 * Context to manage temporary signup data during onboarding.
 * Stores email and password until Firebase account creation.
 */
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
