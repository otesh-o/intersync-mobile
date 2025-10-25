// app/services/profileService.js
import { api } from "./api";


export const getProfile = async () => {
  const response = await api("/v1/user/profile"); // GET request
  return response.user; // returns the user object
};

/**

 * @param {Object} updates 
 */
export const updateProfile = async (updates) => {
  return await api("/v1/user/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};
