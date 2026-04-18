// app/profile_page/MainProfile.js
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
  const { isPremium, setPremium, deleteAccount } = useAuth();

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

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and you will lose all your data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
            } catch (error) {
              Alert.alert("Error", "Failed to delete account. Please try again.");
            }
          },
        },
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL(
      "https://docs.google.com/document/d/1DIHDsrmfBaz15RrHTwCOtXNbf3Dw4dRCH8o2HkSeO7w/edit?tab=t.0"
    ).catch((err) => console.error("Couldn't load page", err));
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

      {/* Legal & Account Actions */}
      <View className="w-full max-w-md mt-6 px-4 pb-8">
        <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 ml-1" style={{ fontFamily: "Raleway-Medium" }}>
          Legal & Account
        </Text>
        <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Privacy Policy */}
          <TouchableOpacity
            onPress={openPrivacyPolicy}
            className="flex-row items-center justify-between p-4 border-b border-gray-100"
          >
            <View className="flex-row items-center">
              <Icon name="shield-checkmark-outline" size={22} color="#4B5563" />
              <Text className="ml-3 text-gray-700 font-medium" style={{ fontFamily: "Roboto" }}>
                Privacy Policy
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center">
              <Icon name="trash-outline" size={22} color="#EF4444" />
              <Text className="ml-3 text-red-500 font-medium" style={{ fontFamily: "Roboto" }}>
                Delete Account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView >
  );
}

