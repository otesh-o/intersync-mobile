// app/context/JobsContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMode, setCurrentMode] = useState("internships"); // Default mode

  // Strict endpoint mapping — no fallback
  const getEndpoint = (mode) => {
    switch (mode) {
      case "internships":
        return "/v1/job/internships";
      case "scholarships":
        return "/v1/job/scholarships";
      case "extracurriculars":
        return "/v1/job/extracurriculars";
      default:
        // This should never happen — but throw or log if it does
        throw new Error(`Unknown job mode: ${mode}`);
    }
  };

  const loadJobs = async (mode) => {
    console.log(`Starting job load for mode: ${mode}`);
    setIsLoading(true);

    try {
      const endpoint = getEndpoint(mode); // Will throw if mode is invalid
      console.log("Fetching from endpoint:", endpoint);

      const response = await api(endpoint);


      if (!response?.data || !Array.isArray(response.data)) {
        throw new Error("API response must contain an array under 'data'");
      }

      const mapped = response.data.map((item, index) => {
        if (!item._id) {
          console.warn(`Job at index ${index} has no _id`, item);
        }
        return {
          id: item._id,
          title: item.title || "No Title",
          company: item.company || "Unknown",
          location: item.location || "N/A",
          salary: item.salary || "",
          type: item.type || "",
          workMode: item.workMode || "",
          level: item.level || "",
          category: item.category || mode, // fallback to mode if missing
          description: item.description || "",
          image: item.image || "https://via.placeholder.com/300x200?text=Job",
          sourceType: item.sourceType || "csv",
          sourceUrl: item.sourceUrl || "",
          bannerImageUrl: item.bannerImageUrl || "",
          applyMode: item.applyMode || "",
          jobType: item.jobType || "",
        };
      });

      console.log(`Successfully loaded ${mapped.length} jobs for ${mode}`);

      setJobs(mapped);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      setJobs([]);
    } finally {
      setIsLoading(false);
      console.log("Job loading complete. isLoading = false");
    }
  };

  const changeMode = (mode) => {
    if (!["internships", "scholarships", "extracurriculars"].includes(mode)) {
      console.error("Invalid mode attempted:", mode);
      return;
    }
    setCurrentMode(mode);
    loadJobs(mode);
  };

  const refreshJobs = () => {
    loadJobs(currentMode);
  };

  // Initialize with the correct default mode
  useEffect(() => {
    loadJobs(currentMode); // currentMode is "internships"
  }, []); // currentMode is stable on mount, so safe

  return (
    <JobsContext.Provider
      value={{
        jobs,
        setJobs,
        isLoading,
        currentMode,
        changeMode,
        refreshJobs,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => useContext(JobsContext);
