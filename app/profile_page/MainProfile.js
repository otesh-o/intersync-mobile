// app/profile_page/main_profile.js
import { ScrollView, View } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

// Components
import Header from "./components/Header";
import ProfileCard from "./components/ProfileCard";
import SectionItem from "./components/SectionItem";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Default content
const DEFAULT_CONTENT = {
  "About Me": "I'm a UX researcher with 5+ years of experience...",
  "Work Experience": [
    {
      id: "1",
      title: "Senior UX Researcher",
      company: "Google",
      startDate: "2020",
      endDate: "2024",
      description: "Led user research for flagship products.",
    },
  ],
  Education: [
    {
      id: "1",
      degree: "PhD in HCI",
      school: "Stanford University",
      startDate: "2014",
      endDate: "2018",
    },
  ],
  Skills: ["User Research", "Usability Testing", "Figma"],
  Languages: ["English", "Yoruba", "French"],
  Appreciation: [
    {
      id: "1",
      title: "Team Excellence Award 2023",
      description: "Received for outstanding contribution to UX research",
      date: "Jan 2023",
    },
  ],
  Resume: null,
};

const PROFILE_DATA_KEY = "userProfileData";

export default function MainProfile() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [content, setContent] = useState(DEFAULT_CONTENT);

  const router = useRouter();

  // ✅ Load & refresh data when screen gains focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true; // Prevent state update if unmounted

      const loadProfileData = async () => {
        try {
          const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
          let savedData = {};

          if (saved) {
            savedData = JSON.parse(saved);
          }

          // ✅ Merge saved data into defaults
          const merged = { ...DEFAULT_CONTENT, ...savedData };

          // ✅ Only update if component is still active
          if (isActive) {
            setContent(merged);
          }
        } catch (e) {
          console.error("Failed to load or reload profile data", e);
          if (isActive) {
            setContent(DEFAULT_CONTENT); // Fallback
          }
        }
      };

      loadProfileData();

      // ✅ Cleanup: prevents race conditions
      return () => {
        isActive = false;
      };
    }, [])
    // ↑ Runs every time screen comes into focus
  );

  const toggleExpand = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 60,
        alignItems: "center",
      }}
    >
      {/* Header */}
      <Header />

      {/* Profile Card */}
      <ProfileCard />

      {/* Section List */}
      <View className="w-full max-w-md space-y-3 px-1">
        {Object.keys(content).map((label) => (
          <SectionItem
            key={label}
            label={label}
            content={content[label]}
            isExpanded={expandedSection === label}
            onToggle={() => toggleExpand(label)}
          />
        ))}
      </View>
    </ScrollView>
  );
}