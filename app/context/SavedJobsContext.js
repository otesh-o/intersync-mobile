// contexts/SavedJobsContext.js
import React, { createContext, useContext, useState } from "react";

const SavedJobsContext = createContext();

export const SavedJobsProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState([]);

  return (
    <SavedJobsContext.Provider value={{ savedJobs, setSavedJobs }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => useContext(SavedJobsContext);
