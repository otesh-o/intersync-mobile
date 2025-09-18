// app/profile_page/main_profile.js
import { ScrollView, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

// Components
import Header from "./components/Header";
import ProfileCard from "./components/ProfileCard";
import SectionItem from "./components/SectionItem";

// Context (real data from backend)
import { useProfile } from "../context/ProfileContext";

// Fallbacks only (not default content)
const DEFAULT_ABOUT_ME = "Tell us about yourself";

export default function MainProfile() {
  const [expandedSection, setExpandedSection] = useState(null);
  const router = useRouter();

  // Get real data from context (loaded from GET /v1/user/profile)
  const {
    role: aboutMe,
    workExperience,
    education,
    skills,
    languages,
    appreciation,
    resumeUrl,
  } = useProfile();

  // Map backend fields to sections
  const content = {
    "About Me": aboutMe || DEFAULT_ABOUT_ME,
    "Work Experience": workExperience || [],
    Education: education || [],
    Skills: skills || [],
    Languages: languages || [],
    Appreciation: appreciation || [],
    Resume: resumeUrl
      ? { uri: resumeUrl, name: "resume.pdf" } // Simplified format
      : null,
  };

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
            onPressEdit={
              label === "About Me"
                ? () => router.push("/profile_page/edit-about-me")
                : label === "Work Experience"
                ? () => router.push("/profile_page/edit-work-experience")
                : undefined
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}
