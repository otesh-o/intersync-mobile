// app/context/ProfileContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

// 🔗 Your backend base URL (NO TRAILING SPACES!)
const BASE_URL = "https://internsync-production.up.railway.app"; // ✅ Fixed

// 🔐 Firebase
import { auth } from "../services/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState(""); // aboutMe
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [workExperience, setWorkExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [appreciation, setAppreciation] = useState([]);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async () => {
    console.log("🔍 Starting profile load...");
    setIsLoading(true); // Ensure loading state is on

    try {
      const response = await api("/v1/user/profile");
      console.log("✅ Raw API Response:", JSON.stringify(response, null, 2));

      const user = response.user;
      if (!user) {
        throw new Error("No user object in response");
      }

      // ✅ Build full profile picture URL
      let fullProfilePicUrl = null;
      if (user.profilePicture) {
        const cleanPath = user.profilePicture.startsWith("/")
          ? user.profilePicture.trim()
          : "/" + user.profilePicture.trim();
        fullProfilePicUrl = `${BASE_URL}${cleanPath}`;
      }

      // ✅ Build full resume URL
      let fullResumeUrl = null;
      if (user.resumeUrl) {
        const cleanPath = user.resumeUrl.startsWith("/")
          ? user.resumeUrl.trim()
          : "/" + user.resumeUrl.trim();
        fullResumeUrl = `${BASE_URL}${cleanPath}`;
      }

      console.log("👤 User data received:", {
        firstName: user.firstName,
        aboutMe: user.aboutMe,
        profilePicture: fullProfilePicUrl,
        workExperienceCount: user.workExperience?.length,
        resumeUrl: fullResumeUrl,
      });

      // ✅ Update all state with real data
      setName(user.firstName || "");
      setRole(user.aboutMe || "Looking for opportunities");
      setProfilePicUrl(fullProfilePicUrl);
      setWorkExperience(user.workExperience || []);
      setEducation(user.education || []);
      setSkills(user.skills || []);
      setLanguages(user.languages || []);
      setAppreciation(user.appreciation || []);
      setResumeUrl(fullResumeUrl);

      // ✅ SUCCESS LOG: Everything is now synced
      console.log("🎉 FULL PROFILE LOADED AND SYNCED TO CONTEXT", {
        name: user.firstName,
        role: user.aboutMe,
        hasPfp: !!fullProfilePicUrl,
        hasResume: !!fullResumeUrl,
        workExpCount: user.workExperience?.length,
      });
    } catch (error) {
      console.warn("❌ Failed to load profile:", error.message);

      // 🧾 Log full error details
      if (error.response) {
        console.error("Backend Error Response:", error.response);
      } else if (error.request) {
        console.error("Network Request Error:", error.request);
      } else {
        console.error("Unexpected Error:", error);
      }

      // Still allow app to run with fallbacks
      setName("");
      setRole("Looking for opportunities");
      setProfilePicUrl(null);
      setWorkExperience([]);
      setEducation([]);
      setSkills([]);
      setLanguages([]);
      setAppreciation([]);
      setResumeUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true; // Prevent state update if unmounted

    // 🔁 Listen for Firebase auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (isActive) {
        if (user) {
          console.log("🔐 Firebase user detected:", user.uid);

          try {
            // Get fresh token
            const idToken = await user.getIdToken(true); // Force refresh
            await AsyncStorage.setItem("authToken", idToken);
            console.log("🔑 Auth token saved");

            // ✅ Now load profile
            await loadProfile();
          } catch (tokenError) {
            console.error("Failed to get or save ID token:", tokenError);
            setIsLoading(false);
          }
        } else {
          // No user → reset profile
          console.log("👤 No logged-in user found at startup");
          setName("");
          setRole("Looking for opportunities");
          setProfilePicUrl(null);
          setWorkExperience([]);
          setEducation([]);
          setSkills([]);
          setLanguages([]);
          setAppreciation([]);
          setResumeUrl(null);
          setIsLoading(false);
        }
      }
    });

    // Cleanup listener on unmount
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        // Personal
        name,
        setName,
        role,
        setRole,
        profilePicUrl,
        setProfilePicUrl,

        // Professional
        workExperience,
        setWorkExperience,
        education,
        setEducation,
        skills,
        setSkills,
        languages,
        setLanguages,
        appreciation,
        setAppreciation,
        resumeUrl,
        setResumeUrl,

        // Meta
        isLoading,
        refreshProfile: loadProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
