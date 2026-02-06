// context/AuthContext.js

import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { deleteUserAccount } from "../services/profileService";

const AuthContext = createContext(null);

const TOKEN_KEY = "auth-token";
const PREMIUM_KEY = "is-premium";
const PLAN_KEY = "user-plan";
const DEBUG_MODE_KEY = "is-debug-mode";

export const saveToken = async (token) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [plan, setPlan] = useState(null); // null, 'free', 'premium' (or 'unlimited')
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedToken = await getToken();
        if (savedToken) {
          setToken(savedToken);
        }
        const savedPremium = await SecureStore.getItemAsync(PREMIUM_KEY);
        setIsPremium(savedPremium === "true");

        const savedPlan = await SecureStore.getItemAsync(PLAN_KEY);
        setPlan(savedPlan);

        const savedDebug = await SecureStore.getItemAsync(DEBUG_MODE_KEY);
        setIsDebugMode(savedDebug === "true");
      } catch (error) {
        console.warn("Failed to load auth state:", error);
      } finally {
        setLoading(false);
      }
    };
    loadState();
  }, []);

  const login = async (userToken, { debug = false } = {}) => {
    setToken(userToken);
    await saveToken(userToken);

    if (debug) {
      setIsDebugMode(true);
      await SecureStore.setItemAsync(DEBUG_MODE_KEY, "true");
    }
  };

  const logout = async () => {
    setToken(null);
    setIsPremium(false);
    setPlan(null);
    setIsDebugMode(false);
    await removeToken();
    await SecureStore.deleteItemAsync(PREMIUM_KEY);
    await SecureStore.deleteItemAsync(PLAN_KEY);
    await SecureStore.deleteItemAsync(DEBUG_MODE_KEY);
    router.replace("/auth/login");
  };

  const updatePlan = async (newPlan) => {
    setPlan(newPlan);
    if (newPlan) {
      await SecureStore.setItemAsync(PLAN_KEY, newPlan);
    } else {
      await SecureStore.deleteItemAsync(PLAN_KEY);
    }
  };

  const setPremium = async (value) => {
    setIsPremium(value);
    await SecureStore.setItemAsync(PREMIUM_KEY, value ? "true" : "false");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isPremium,
        plan,
        isDebugMode,
        setPremium,
        updatePlan,
        deleteAccount: async () => {
          try {
            await deleteUserAccount();
            await logout();
          } catch (error) {
            console.error("Account deletion failed:", error);
            throw error;
          }
        },
        isAuthenticated: !!token,
        hasSelectedPlan: !!plan,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
