// app/profile_page/MainProfile.js
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Components
import Header from "./components/Header";
import ProfileCard from "./components/ProfileCard";
import SectionItem from "./components/SectionItem";

// Context (real data from backend)
import { Ionicons as Icon } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";

// Fallbacks only (not default content)
const DEFAULT_ABOUT_ME = "Tell us about yourself";

export default function MainProfile() {
  const [expandedSection, setExpandedSection] = useState(null);
  const router = useRouter();
  const { isPremium, setPremium } = useAuth();

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

  const handleCancelSubscription = () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your Unlimited plan? You will lose access to unlimited swipes and applications.",
      [
        { text: "Keep Plan", style: "cancel" },
        {
          text: "Cancel Subscription",
          style: "destructive",
          onPress: () => {
            setPremium(false);
            Alert.alert("Subscription Cancelled", "Your plan has been downgraded to Free.");
          }
        }
      ]
    );
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

      {/* Subscription Management */}
      <View className="w-full max-w-md mt-6 px-4">
        <View className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1" style={{ fontFamily: "Raleway-Medium" }}>Your Plan</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-900 text-xl font-bold" style={{ fontFamily: "Raleway-Medium" }}>
                  {isPremium ? "Unlimited Plan" : "Free Plan"}
                </Text>
                {isPremium && (
                  <View className="ml-2 bg-yellow-100 px-2 py-0.5 rounded-full">
                    <Text className="text-yellow-700 text-[10px] font-bold uppercase" style={{ fontFamily: "Raleway-Medium" }}>Pro</Text>
                  </View>
                )}
              </View>
            </View>
            <Icon name={isPremium ? "star" : "star-outline"} size={28} color={isPremium ? "#EAB308" : "#CBD5E1"} />
          </View>

          {isPremium ? (
            <TouchableOpacity
              onPress={handleCancelSubscription}
              className="w-full py-3 items-center justify-center bg-white border border-red-100 rounded-xl"
            >
              <Text className="text-red-500 font-semibold" style={{ fontFamily: "Raleway-Medium" }}>Cancel Subscription</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push("/payment_plan/plan")}
              className="w-full py-3 items-center justify-center bg-black rounded-xl"
            >
              <Text className="text-white font-semibold" style={{ fontFamily: "Raleway-Medium" }}>Upgrade to Unlimited</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
