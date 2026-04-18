// app/context/ProfileContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "../services/api";
import { auth } from "../services/firebaseConfig";
import { useAuth } from "./AuthContext";

import { API_BASE_URL } from "../services/config";

const BASE_URL = API_BASE_URL;
const ProfileContext = createContext();
const TOKEN_KEY = "auth-token";

export const ProfileProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [workExperience, setWorkExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [appreciation, setAppreciation] = useState([]);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updatePlan, setPremium } = useAuth();

  const loadProfile = async () => {
    setIsLoading(true);

    try {
      const response = await api("/v1/user/profile");

      const user = response.user;
      if (!user) {
        throw new Error("No user object in response");
      }

      let fullProfilePicUrl = null;
      if (user.profilePicture) {
        const cleanPath = user.profilePicture.startsWith("/")
          ? user.profilePicture.trim()
          : "/" + user.profilePicture.trim();
        fullProfilePicUrl = `${BASE_URL}${cleanPath}`;
      }

      let fullResumeUrl = null;
      if (user.resumeUrl) {
        const cleanPath = user.resumeUrl.startsWith("/")
          ? user.resumeUrl.trim()
          : "/" + user.resumeUrl.trim();
        fullResumeUrl = `${BASE_URL}${cleanPath}`;
      }


      setName(user.firstName || "");
      setRole(user.aboutMe || "Enter your role");
      setProfilePicUrl(fullProfilePicUrl);
      setWorkExperience(user.workExperience || []);
      setEducation(user.education || []);
      setSkills(user.skills || []);
      setLanguages(user.languages || []);
      setAppreciation(user.appreciation || []);
      setResumeUrl(fullResumeUrl);

      // 🗺️ Sync plan status to AuthContext
      if (user.plan) {
        updatePlan(user.plan);
        setPremium(user.plan === "unlimited" || user.plan === "premium" || user.isPremium);
      }

    } catch (error) {
      console.warn("Failed to load profile:", error.message);

      if (error.response) {
        console.error("Backend Error Response:", error.response);
      } else if (error.request) {
        console.error("Network Request Error:", error.request);
      } else {
        console.error("Unexpected Error:", error);
      }

      setName("");
      setRole("Enter your role");
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
    let isActive = true;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (isActive) {
        if (user) {

          try {
            const idToken = await user.getIdToken(true);
            await SecureStore.setItemAsync(TOKEN_KEY, idToken);
            console.log("Auth token saved");

            await loadProfile();
          } catch (tokenError) {
            console.error("Failed to get or save ID token:", tokenError);
            setIsLoading(false);
          }
        } else {

          console.log("No logged-in user found at startup");
          setName("");
          setRole("Enter your role");
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


    return () => {
      isActive = false;
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
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


        isLoading,
        refreshProfile: loadProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

