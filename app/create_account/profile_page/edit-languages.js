// app/profile_page/edit-languages.js
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfile } from "../../context/ProfileContext";
import { api } from "../../services/api";

export default function EditLanguages() {
  const router = useRouter();
  // Get current value + setter from context
  const { languages: currentLanguages, setLanguages: setContextLanguages } =
    useProfile();

  const [localLanguages, setLocalLanguages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    try {
      const response = await api("/v1/user/profile");
      const serverLanguages = response.user.languages || [];
      const validLanguages = serverLanguages.filter(
        (lang) => lang && lang.trim()
      );
      setLocalLanguages(validLanguages);
    } catch (error) {
      console.error("Failed to load languages:", error);
      Alert.alert("Error", error.message || "Could not load languages.");
      setLocalLanguages([]);
    }
  };

  const addLanguage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (localLanguages.includes(trimmed)) {
      Alert.alert("Duplicate Language", `${trimmed} is already in your list.`);
      return;
    }
    setLocalLanguages((prev) => [...prev, trimmed]);
    setInput("");
  };

  const removeLanguage = (langToRemove) => {
    setLocalLanguages((prev) => prev.filter((lang) => lang !== langToRemove));
  };

  const handleSave = async () => {
    try {
      const cleaned = [
        ...new Set(localLanguages.map((l) => l.trim()).filter(Boolean)),
      ];

      // 1. Update context IMMEDIATELY for instant UI sync
      setContextLanguages(cleaned);

      // 2. Save to backend
      await api("/v1/user/profile", {
        method: "PUT",
        body: JSON.stringify({ languages: cleaned }),
      });

      Alert.alert("Success", "Languages updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Save failed:", error);
      // Roll back on error
      setContextLanguages(currentLanguages);
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
          Languages
        </Text>
        <View className="w-6" />
      </View>

      {/* Input */}
      <View className="flex-row px-6 mb-4 items-center">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-base"
          value={input}
          onChangeText={setInput}
          placeholder="e.g. Yoruba"
          onSubmitEditing={addLanguage}
          autoCapitalize="none"
        />
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg ml-3"
          onPress={addLanguage}
        >
          <Text className="text-white font-medium text-sm">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Languages List */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="flex-row flex-wrap gap-2 pb-6"
      >
        {localLanguages.length === 0 ? (
          <Text className="text-gray-500 italic text-sm mt-2">
            No languages added yet
          </Text>
        ) : (
          localLanguages.map((lang) => (
            <View
              key={lang}
              className="flex-row items-center bg-blue-500 px-3 py-1.5 rounded-full"
            >
              <Text className="text-white text-sm font-medium mr-1">
                {lang}
              </Text>
              <TouchableOpacity onPress={() => removeLanguage(lang)}>
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
