// app/profile_page/edit-skills.js
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfile } from "../context/ProfileContext";
import { api } from "../services/api";

export default function EditSkills() {
  const router = useRouter();
  const { refreshProfile } = useProfile(); // To reload after save

  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState("");

  // Load skills from backend on mount
  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const response = await api("/v1/user/profile");
      const serverSkills = response.user.skills || [];

      // Filter out empty/null values
      const validSkills = serverSkills.filter((s) => s && s.trim());
      setSkills(validSkills);
    } catch (error) {
      console.error("Failed to load skills:", error);
      Alert.alert("Error", error.message || "Could not load skills.");
      setSkills([]); // Fallback
    }
  };

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      Alert.alert("Duplicate Skill", `${trimmed} is already in your list.`);
      return;
    }

    setSkills((prev) => [...prev, trimmed]);
    setInput("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = async () => {
    try {
      // Clean and dedupe before saving
      const cleaned = [...new Set(skills.map((s) => s.trim()).filter(Boolean))];

      await api("/v1/user/profile", {
        method: "PUT",
        body: JSON.stringify({ skills: cleaned }),
      });

      // Refresh context so MainProfile sees update
      await refreshProfile();

      // Show success
      Alert.alert("Success", "Skills updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("Save Failed", error.message || "Could not save. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Image
            source={require("../../assets/images/back.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SKILLS</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="e.g. Figma"
          onSubmitEditing={addSkill}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.addButton} onPress={addSkill}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Skills List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.skillsList}
      >
        {skills.length === 0 ? (
          <Text style={styles.placeholder}>No skills added yet</Text>
        ) : (
          skills.map((skill) => (
            <View key={skill} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
              <TouchableOpacity onPress={() => removeSkill(skill)}>
                <Text style={styles.removeSkill}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: "#555",
  },
  headerTitle: {
    fontFamily: "Roboto-Bold",
    fontWeight: "700",
    fontSize: 20,
    color: "#000",
    textTransform: "uppercase",
    flex: 1,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 26,
    marginBottom: 16,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    fontFamily: "Roboto",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 26,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 20,
  },
  skillTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 60,
    maxWidth: 140,
  },
  skillText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 6,
  },
  removeSkill: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  placeholder: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    fontFamily: "Roboto",
  },
  saveButton: {
    width: 320,
    height: 50,
    backgroundColor: "#000",
    borderRadius: 22.15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 24,
    marginTop: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto",
  },
});
