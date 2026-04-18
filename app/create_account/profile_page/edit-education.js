// app/profile_page/edit-education.js
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useProfile } from "../../context/ProfileContext";

export default function EditEducation() {
  const router = useRouter();
  const {
    education: currentEducation,
    setEducation,
    refreshProfile,
  } = useProfile();

  const [entries, setEntries] = useState([
    {
      id: "new-1",
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      current: false,
      grade: "",
      location: "",
      description: "",
    },
  ]);

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    try {
      const response = await api("/v1/user/profile");
      const serverData = response.user.education || [];

      if (serverData.length > 0) {
        const mapped = serverData.map((item) => ({
          id: item._id || Date.now().toString(),
          institution: item.institution || "",
          degree: item.degree || "",
          fieldOfStudy: item.fieldOfStudy || "",
          startDate: item.startDate?.split("T")[0] || "",
          endDate: item.endDate?.split("T")[0] || "",
          current: !!item.current,
          grade: item.grade || "",
          location: item.location || "",
          description: item.description || "",
        }));
        setEntries(mapped);
      }
    } catch (error) {
      console.error("Failed to load education:", error);
      Alert.alert("Error", error.message || "Could not load education.");
      setEntries([
        {
          id: "new-1",
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          current: false,
          grade: "",
          location: "",
          description: "",
        },
      ]);
    }
  };

  const updateEntry = (id, field, value) => {
    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addNewEntry = () => {
    const newEntry = {
      id: `new-${Date.now()}`,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      current: false,
      grade: "",
      location: "",
      description: "",
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const removeEntry = (id) => {
    if (entries.length <= 1) {
      Alert.alert("At least one entry required");
      return;
    }
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    const hasEmptyRequired = entries.some(
      (item) => !item.institution.trim() || !item.degree.trim()
    );

    if (hasEmptyRequired) {
      Alert.alert(
        "Missing Info",
        "Please fill in institution and degree for all entries."
      );
      return;
    }

    try {
      const formatted = entries.map(({ id, ...item }) => {
        let startDate = null;
        if (item.startDate && !item.current) {
          const d = new Date(item.startDate);
          if (!isNaN(d)) startDate = d.toISOString().split("T")[0];
        }

        let endDate = null;
        if (item.current) {
          item.endDate = null;
        } else if (item.endDate) {
          const d = new Date(item.endDate);
          if (!isNaN(d)) endDate = d.toISOString().split("T")[0];
        }

        return {
          institution: item.institution.trim(),
          degree: item.degree.trim(),
          fieldOfStudy: item.fieldOfStudy.trim(),
          startDate: startDate,
          endDate: endDate,
          current: !!item.current,
          grade: item.grade.trim(),
          location: item.location.trim(),
          description: item.description.trim(),
        };
      });

      setEducation(formatted);

      await api("/v1/user/profile", {
        method: "PUT",
        body: JSON.stringify({ education: formatted }),
      });

      Alert.alert("Success", "Education updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Save failed:", error);
      setEducation(currentEducation);
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
          Education
        </Text>
        <View className="w-6" />
      </View>

      {/* Scrollable Form */}
      <ScrollView className="flex-1 px-6" contentContainerClassName="pb-6">
        {entries.map((item) => (
          <View
            key={item.id}
            className="bg-gray-50 p-4 rounded-lg mb-5 border border-gray-200 relative"
          >
            {entries.length > 1 && (
              <TouchableOpacity
                className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full justify-center items-center z-10"
                onPress={() => removeEntry(item.id)}
              >
                <Text className="text-white font-bold text-sm">✕</Text>
              </TouchableOpacity>
            )}

            {/* Institution */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Institution *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base"
                value={item.institution}
                onChangeText={(text) =>
                  updateEntry(item.id, "institution", text)
                }
                placeholder="e.g. Stanford University"
              />
            </View>

            {/* Degree */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Degree *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base"
                value={item.degree}
                onChangeText={(text) => updateEntry(item.id, "degree", text)}
                placeholder="e.g. BSc, PhD"
              />
            </View>

            {/* Field of Study */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Field of Study
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base"
                value={item.fieldOfStudy}
                onChangeText={(text) =>
                  updateEntry(item.id, "fieldOfStudy", text)
                }
                placeholder="e.g. Computer Science"
              />
            </View>

            {/* Start Date */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Start Date
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base"
                value={item.startDate}
                onChangeText={(text) => updateEntry(item.id, "startDate", text)}
                placeholder="YYYY-MM-DD"
                keyboardType="number-pad"
              />
            </View>

            {/* Currently Studying */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm font-medium text-gray-700">
                Currently Studying?
              </Text>
              <Switch
                value={item.current}
                onValueChange={(val) => {
                  updateEntry(item.id, "current", val);
                  if (val) updateEntry(item.id, "endDate", "");
                }}
              />
            </View>

            {/* End Date (if not current) */}
            {!item.current && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  End Date
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base"
                  value={item.endDate}
                  onChangeText={(text) => updateEntry(item.id, "endDate", text)}
                  placeholder="YYYY-MM-DD"
                  keyboardType="number-pad"
                />
              </View>
            )}

            {/* Grade */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Grade / GPA
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base"
                value={item.grade}
                onChangeText={(text) => updateEntry(item.id, "grade", text)}
                placeholder="e.g. 3.8 GPA"
              />
            </View>

            {/* Location */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Location
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base"
                value={item.location}
                onChangeText={(text) => updateEntry(item.id, "location", text)}
                placeholder="e.g. Oxford, UK"
              />
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Description
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white min-h-[100] text-base"
                value={item.description}
                onChangeText={(text) =>
                  updateEntry(item.id, "description", text)
                }
                placeholder="Relevant coursework, achievements..."
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        ))}

        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-lg self-start mb-6"
          onPress={addNewEntry}
        >
          <Text className="text-black font-medium text-sm">
            + Add Another Education
          </Text>
        </TouchableOpacity>
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

