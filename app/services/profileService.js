// app/services/profileService.js
import { api } from "./api";

/**
 * Load the full user profile
 */
export const getProfile = async () => {
  const response = await api("/v1/user/profile"); // GET request
  return response.user; // returns the user object
};

/**
 * Update the user profile
 * @param {Object} updates - Fields to update (e.g., { firstName: "Alex" })
 */
export const updateProfile = async (updates) => {
  return await api("/v1/user/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};
