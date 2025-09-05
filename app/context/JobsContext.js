// app/context/JobsContext.js
import React, { createContext, useContext, useState } from "react";

const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  // ✅ Start with 2 fake jobs
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "UX Research Intern",
      company: "Nexa Labs",
      location: "Remote",
      type: "Internship",
      logo: "https://via.placeholder.com/60/3b82f6/FFFFFF?text=NL",
      description: "Conduct user interviews and design research.",
    },
    {
      id: 2,
      title: "Volunteer Mentor",
      company: "YouthCode NGO",
      location: "Lagos, Nigeria",
      type: "Volunteer",
      logo: "https://via.placeholder.com/60/10b981/FFFFFF?text=YC",
      description: "Teach coding to underprivileged teens.",
    },
  ]);

  const removeJob = (jobId) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const resetJobs = () => {
    setJobs([
      {
        id: 1,
        title: "UX Research Intern",
        company: "Nexa Labs",
        location: "Remote",
        type: "Internship",
        logo: "https://via.placeholder.com/60/3b82f6/FFFFFF?text=NL",
        description: "Conduct user interviews and design research.",
      },
      {
        id: 2,
        title: "Volunteer Mentor",
        company: "YouthCode NGO",
        location: "Lagos, Nigeria",
        type: "Volunteer",
        logo: "https://via.placeholder.com/60/10b981/FFFFFF?text=YC",
        description: "Teach coding to underprivileged teens.",
      },
    ]);
  };

  return (
    <JobsContext.Provider value={{ jobs, removeJob, resetJobs }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within JobsProvider");
  }
  return context;
};
