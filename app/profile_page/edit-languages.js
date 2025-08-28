// app/profile_page/edit-languages.js
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_DATA_KEY = "userProfileData";

export default function EditLanguages() {
  const router = useRouter();
  const { section = "Languages" } = useLocalSearchParams();

  const [languages, setLanguages] = useState([]);
  const [input, setInput] = useState("");

  // Load saved languages
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
        const data = saved ? JSON.parse(saved) : {};
        const savedLanguages = data[section] || [];
        setLanguages(savedLanguages);
      } catch (e) {
        console.error("Failed to load languages", e);
      }
    };
    load();
  }, [section]);

  const addLanguage = () => {
    const trimmed = input.trim();
    if (trimmed && !languages.includes(trimmed)) {
      setLanguages((prev) => [...prev, trimmed]);
    }
    setInput("");
  };

  const removeLanguage = (langToRemove) => {
    setLanguages((prev) => prev.filter((lang) => lang !== langToRemove));
  };

  const handleSave = async () => {
    try {
      const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
      const data = saved ? JSON.parse(saved) : {};
      data[section] = languages;
      await AsyncStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save languages", e);
    }
    router.back();
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
        <Text style={styles.headerTitle}>LANGUAGES</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="e.g. Yoruba"
          onSubmitEditing={addLanguage}
        />
        <TouchableOpacity style={styles.addButton} onPress={addLanguage}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Languages List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.languagesList}>
        {languages.length === 0 ? (
          <Text style={styles.placeholder}>No languages added yet</Text>
        ) : (
          languages.map((lang) => (
            <View key={lang} style={styles.languageTag}>
              <Text style={styles.languageText}>{lang}</Text>
              <TouchableOpacity onPress={() => removeLanguage(lang)}>
                <Text style={styles.removeLang}>✕</Text>
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
  languagesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 20,
  },
  languageTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 60,
    maxWidth: 140,
  },
  languageText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 6,
  },
  removeLang: {
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