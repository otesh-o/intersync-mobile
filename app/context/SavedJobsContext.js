// app/context/SavedJobsContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const SavedJobsContext = createContext();

export const SavedJobsProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved jobs
  const loadSavedJobs = async () => {
    console.log("Loading saved jobs from backend...");
    try {
      const response = await api("/v1/bookmark/user");
      console.log(
        "Raw saved jobs response:",
        JSON.stringify(response, null, 2)
      );

      const serverJobs = response.data || [];

      
      const idSet = new Set();
      const mapped = [];

      for (const item of serverJobs) {
        
        const jobId = item.jobId || item.id || item._id || item.job?._id;

        if (!jobId) {
          console.warn("Job missing ID in backend response:", item);
          continue;
        }

        if (idSet.has(jobId)) {
          console.warn("Duplicate job ID skipped:", jobId);
          continue;
        }

        idSet.add(jobId);

        mapped.push({
          id: jobId,
          title: item.jobTitle || item.title || "Untitled Job",
          company:
            typeof item.company === "object"
              ? item.company.name
              : item.company || "Unknown",
          location: item.location || "N/A",
          salary: item.salary || "",
          category: item.category || "internships",
          type: item.type || "",
          workMode: item.workMode || "",
          level: item.level || "",
          description: item.description || "",
          image: item.image || "https://via.placeholder.com/300",
          savedAt: item.createdAt
            ? new Date(item.createdAt).toISOString()
            : new Date().toISOString(), 
        });
      }

      setSavedJobs(mapped);
    } catch (error) {
      console.warn("Failed to load saved jobs:", error.message);
      setSavedJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addSavedJob = (job) => {
    setSavedJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) {
        console.log("Avoided duplicate add:", job.id);
        return prev;
      }
      return [job, ...prev];
    });
  };

  const removeSavedJob = async (jobId) => {
    try {
      await api(`/v1/bookmark/job/${jobId}`, {
        method: "DELETE",
      });

      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    }
  };

  const refreshSavedJobs = loadSavedJobs;

  useEffect(() => {
    loadSavedJobs();
  }, []);

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobs,
        setSavedJobs,
        addSavedJob, 
        removeSavedJob,
        isLoading,
        refreshSavedJobs, 
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => useContext(SavedJobsContext);

