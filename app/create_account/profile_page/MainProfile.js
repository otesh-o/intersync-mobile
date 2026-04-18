// app/create_account/OnboardingModal.js
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useProfile } from "../../context/ProfileContext";
import ProfileCard from "../profile_page/components/ProfileCard";
import SectionItem from "../profile_page/components/SectionItem";

const DEFAULT_ABOUT_ME = "Tell us about yourself";

export default function OnboardingModal() {
  const [expandedSection, setExpandedSection] = useState(null);
  const router = useRouter();
  const {
    role: aboutMe,
    workExperience,
    education,
    skills,
    languages,
    appreciation,
    resumeUrl,
  } = useProfile();

  const [localResumeUrl, setLocalResumeUrl] = useState(null);

  const toggleExpand = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const pickResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.type === "success") {
        setLocalResumeUrl(result.uri);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to select resume.");
    }
  };

  // NO VALIDATION — just go to payment
  const handleContinue = () => {
    router.push("/payment_plan/access");
  };

  const effectiveResumeUrl = localResumeUrl || resumeUrl;

  const content = useMemo(
    () => ({
      "About Me": aboutMe || DEFAULT_ABOUT_ME,
      "Work Experience":
        workExperience
          ?.map((w) => `${w.position} at ${w.company}`)
          .join("\n") || "Add your experience",
      Education:
        education?.map((e) => `${e.degree}, ${e.school}`).join("\n") ||
        "Add your education",
      Skills: Array.isArray(skills)
        ? skills.join(", ")
        : skills || "Add your skills",
      Languages: Array.isArray(languages)
        ? languages.join(", ")
        : languages || "Add languages you speak",
      Resume: effectiveResumeUrl
        ? { uri: effectiveResumeUrl, name: "resume.pdf" }
        : null,
    }),
    [aboutMe, workExperience, education, skills, languages, effectiveResumeUrl]
  );

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-8 pb-6">
        <Text
          className="text-2xl font-bold text-black text-center"
          style={{ fontFamily: "ClaireNewsBold" }}
        >
          Set up your profile
        </Text>
        <Text className="text-gray-500 text-center mt-2 text-sm">
          This info will be sent when applying.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 20,
          alignItems: "center",
        }}
      >
        <ProfileCard />

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
              onUpload={label === "Resume" ? pickResume : undefined}
            />
          ))}
        </View>
      </ScrollView>

      {/* Always enabled — no checks */}
      <View className="px-4 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          className="py-4 rounded-full bg-black"
          onPress={handleContinue}
        >
          <Text className="text-white text-center font-bold text-lg">
            Continue to Payment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

