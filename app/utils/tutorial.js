// utils/tutorial.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const TUTORIAL_SEEN_KEY = "@internsync:has_seen_tutorial";

export const setHasSeenTutorial = async () => {
  try {
    await AsyncStorage.setItem(TUTORIAL_SEEN_KEY, "true");
  } catch (e) {
    console.error("Failed to save tutorial status", e);
  }
};

export const hasSeenTutorial = async () => {
  try {
    const value = await AsyncStorage.getItem(TUTORIAL_SEEN_KEY);
    return value === "true";
  } catch (e) {
    console.error("Failed to read tutorial status", e);
    return false;
  }
};

