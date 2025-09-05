// api/api.js

const BASE_URL = "https://api.myapp.com"; // ✅ Fixed: no extra spaces

export async function getJobs(token, type = "internships") {
  try {
    const res = await fetch(`${BASE_URL}/jobs?type=${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return await res.json();
  } catch (err) {
    console.error("API Error [getJobs]:", err.message);
    return []; // Return empty array on error
  }
}

export async function getSavedJobs(token) {
  try {
    const res = await fetch(`${BASE_URL}/saved-jobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch saved jobs");
    return await res.json();
  } catch (err) {
    console.error("API Error [getSavedJobs]:", err.message);
    return [];
  }
}

export async function saveJob(jobId, token) {
  try {
    const res = await fetch(`${BASE_URL}/save-job`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ jobId }),
    });
    if (!res.ok) throw new Error("Failed to save job");
    return await res.json(); // Assume returns { id, title, ...savedJob }
  } catch (err) {
    console.error("API Error [saveJob]:", err.message);
    return null;
  }
}

export async function getProfile(token) {
  try {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return await res.json();
  } catch (err) {
    console.error("API Error [getProfile]:", err.message);
    return {
      name: "User",
      profilePicUrl: null,
    };
  }
}
