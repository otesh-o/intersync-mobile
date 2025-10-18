// app/profile_page/edit-skills.js
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useProfile } from "../../context/ProfileContext";

export default function EditSkills() {
  const router = useRouter();
  // ✅ Get current value + setter from context
  const { skills: currentSkills, setSkills: setContextSkills } = useProfile();

  const [localSkills, setLocalSkills] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const response = await api("/v1/user/profile");
      const serverSkills = response.user.skills || [];
      const validSkills = serverSkills.filter((s) => s && s.trim());
      setLocalSkills(validSkills);
    } catch (error) {
      console.error("Failed to load skills:", error);
      Alert.alert("Error", error.message || "Could not load skills.");
      setLocalSkills([]);
    }
  };

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (localSkills.includes(trimmed)) {
      Alert.alert("Duplicate Skill", `${trimmed} is already in your list.`);
      return;
    }
    setLocalSkills((prev) => [...prev, trimmed]);
    setInput("");
  };

  const removeSkill = (skillToRemove) => {
    setLocalSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = async () => {
    try {
      const cleaned = [
        ...new Set(localSkills.map((s) => s.trim()).filter(Boolean)),
      ];

      // ✅ 1. Update context IMMEDIATELY
      setContextSkills(cleaned);

      // ✅ 2. Save to backend
      await api("/v1/user/profile", {
        method: "PUT",
        body: JSON.stringify({ skills: cleaned }),
      });

      Alert.alert("Success", "Skills updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Save failed:", error);
      // ✅ Roll back on error
      setContextSkills(currentSkills);
      Alert.alert("Save Failed", error.message || "Could not save. Try again.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-6 pt-8 pb-4">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Image
            source={require("../../../assets/images/back.png")}
            className="w-5 h-5"
            style={{ tintColor: "#555" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-bold text-center text-gray-900 uppercase">
          Skills
        </Text>
        <View className="w-6" />
      </View>

      {/* Input */}
      <View className="flex-row px-6 mb-4 items-center">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-base"
          value={input}
          onChangeText={setInput}
          placeholder="e.g. Figma"
          onSubmitEditing={addSkill}
          autoCapitalize="none"
        />
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg ml-3"
          onPress={addSkill}
        >
          <Text className="text-white font-medium text-sm">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Skills List */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="flex-row flex-wrap gap-2 pb-6"
      >
        {localSkills.length === 0 ? (
          <Text className="text-gray-500 italic text-sm mt-2">
            No skills added yet
          </Text>
        ) : (
          localSkills.map((skill) => (
            <View
              key={skill}
              className="flex-row items-center bg-blue-500 px-3 py-1.5 rounded-full"
            >
              <Text className="text-white text-sm font-medium mr-1">
                {skill}
              </Text>
              <TouchableOpacity onPress={() => removeSkill(skill)}>
                <Text className="text-white text-sm font-bold">✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity
        className="w-80 h-12 bg-black rounded-full justify-center items-center self-center mb-6"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold text-base">Save</Text>
      </TouchableOpacity>
    </View>
  );
}
