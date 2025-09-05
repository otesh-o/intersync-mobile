import React, { createContext, useContext, useState } from "react";

// 1. Create the context
const ProfileContext = createContext();

// 2. Provider component that wraps your whole app
export const ProfileProvider = ({ children }) => {
  const [name, setName] = useState("User"); // default
  const [role, setRole] = useState("UX Researcher"); // default (optional)
  const [profilePicUrl, setProfilePicUrl] = useState(null); // default: no image

  return (
    <ProfileContext.Provider
      value={{
        name,
        setName,
        role,
        setRole,
        profilePicUrl,
        setProfilePicUrl,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// 3. Hook for easy access
export const useProfile = () => useContext(ProfileContext);
