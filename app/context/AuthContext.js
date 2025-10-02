// context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext(null);

const TOKEN_KEY = "auth-token";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await getToken();
      if (savedToken) {
        setToken(savedToken);
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  // Login function
  const login = async (userToken) => {
    setToken(userToken);
    await saveToken(userToken);
  };

  // Logout function
  const logout = async () => {
    setToken(null);
    await removeToken();
    router.replace("/auth/login"); // Redirect to login
  };

  const value = {
    token,
    isAuthenticated: !!token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth anywhere
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
