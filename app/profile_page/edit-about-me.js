// app/profile_page/edit-about-me.js
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

export default function EditAboutMe() {
  const router = useRouter();
  const { section = "About Me" } = useLocalSearchParams();
  const [text, setText] = useState("");

  // Load existing content
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
        const data = saved ? JSON.parse(saved) : {};
        setText(data[section] || "");
      } catch (e) {
        console.error("Failed to load", e);
      }
    };
    load();
  }, [section]);

  const handleSave = async () => {
    try {
      // Load current data
      const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
      const data = saved ? JSON.parse(saved) : {};

      // Update only this section
      data[section] = text;

      // Save back
      await AsyncStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(data));

      console.log("Saved:", data);
    } catch (e) {
      console.error("Failed to save", e);
    }

    // Go back — useFocusEffect will reload data
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
        <Text style={styles.headerTitle}>ABOUT ME</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Input */}
      <ScrollView style={styles.scrollView}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          placeholder="Tell us about yourself..."
          multiline
          textAlignVertical="top"
          autoFocus
        />
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

// ... styles (same as before)
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 26,
  },
  textInput: {
    width: 340,
    height: 256.93,
    borderRadius: 22.15,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    textAlignVertical: "top",
    fontFamily: "Roboto",
    alignSelf: "center",
    lineHeight: 22,
    borderWidth: 1,
    borderColor: "#eee",
  },
  saveButton: {
    width: 320,
    height: 50,
    backgroundColor: "#000",
    borderRadius: 22.15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto",
  },
});