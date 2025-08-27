// Mock register function
export const register = async (email, password) => {
  console.log("🚀 Mock registration called for:", email);

  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return a fake user object
  return {
    email,
    idToken: "mock-id-token",
    localId: "mock-local-id",
  };
};
