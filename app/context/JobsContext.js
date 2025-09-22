// app/context/JobsContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMode, setCurrentMode] = useState("internships"); // Default mode

  // Map mode to endpoint
  const getEndpoint = (mode) => {
    switch (mode) {
      case "internships":
        return "/v1/job/internships";
      case "scholarships":
        return "/v1/job/scholarships";
      case "extracurriculars":
        return "/v1/job/extracurriculars";
      default:
        return "/v1/job"; // All jobs
    }
  };

  const loadJobs = async (mode = currentMode) => {
    console.log(`🔍 Starting job load for mode: ${mode}`);
    setIsLoading(true);

    try {
      const endpoint = getEndpoint(mode);
      console.log("📡 Fetching from endpoint:", endpoint);

      const response = await api(endpoint);

      console.log("✅ Raw API Response:", JSON.stringify(response, null, 2));

      // Validate structure
      if (!response || !response.data) {
        throw new Error("Invalid response format: missing data");
      }

      if (!Array.isArray(response.data)) {
        console.warn("⚠️ Expected array, got:", typeof response.data);
        throw new Error("Expected job list to be an array");
      }

      // Map to internal format
      const mapped = response.data.map((item, index) => {
        if (!item._id) {
          console.warn(`⚠️ Job at index ${index} has no _id`, item);
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
          category: item.category || mode,
          description: item.description || "",
          image: item.image || "https://via.placeholder.com/300x200?text=Job",
        };
      });

      console.log(`🎉 Successfully loaded ${mapped.length} jobs for ${mode}`);
      setJobs(mapped);
    } catch (error) {
      console.error("❌ Failed to load jobs:", error);
      console.error("🚨 Error details:", {
        message: error.message,
        stack: error.stack,
      });

      // Still allow UI to show empty state
      setJobs([]);

      // Optional: Alert user in production
      // Alert.alert("Error", "Could not load jobs. Please check your connection.");
    } finally {
      setIsLoading(false);
      console.log("🏁 Job loading complete. isLoading = false");
    }
  };

  // 🔁 Change mode + reload jobs
  const changeMode = (mode) => {
    console.log(`🔄 Changing mode from '${currentMode}' to '${mode}'`);
    setCurrentMode(mode);
    loadJobs(mode);
  };

  // 🔄 Manual refresh (e.g., pull-to-refresh)
  const refreshJobs = () => {
    console.log("🔁 Refreshing jobs for current mode:", currentMode);
    loadJobs(currentMode);
  };

  // 🚀 Load on app start
  useEffect(() => {
    console.log("📱 App started — initializing job load...");
    loadJobs();
  }, []);

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
