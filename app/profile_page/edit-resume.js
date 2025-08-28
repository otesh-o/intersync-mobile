// app/profile_page/edit-resume.js
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_DATA_KEY = "userProfileData";

export default function EditResume() {
  const router = useRouter();
  const [resume, setResume] = useState(null); // { name, uri }

  // Load saved resume
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
        const data = saved ? JSON.parse(saved) : {};
        if (data.Resume) {
          setResume(data.Resume);
        }
      } catch (e) {
        console.error("Failed to load resume", e);
      }
    };
    load();
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // or restrict to "application/pdf"
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        const { uri, name } = result;
        const fileInfo = await FileSystem.getInfoAsync(uri);
        console.log("File size:", fileInfo.size);

        const resumeData = { name: name || "Resume", uri };
        setResume(resumeData);
      }
    } catch (e) {
      console.error("Document picker error", e);
    }
  };

  const handleSave = async () => {
    try {
      const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
      const data = saved ? JSON.parse(saved) : {};
      data.Resume = resume;
      await AsyncStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save resume", e);
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
        <Text style={styles.headerTitle}>RESUME</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Upload Button */}
      <View style={styles.uploadContainer}>
        {resume ? (
          <View style={styles.resumeItem}>
            <Text style={styles.resumeText} numberOfLines={1}>
              📄 {resume.name}
            </Text>
            <TouchableOpacity onPress={() => setResume(null)}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
            <Text style={styles.uploadButtonText}>Upload Resume</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Scrollable Area (for future fields) */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.form}>
        {/* You can add notes or visibility toggle here later */}
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 26,
  },
  form: {
    paddingBottom: 20,
  },
  uploadContainer: {
    paddingHorizontal: 26,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  resumeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  resumeText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  removeText: {
    color: "#ff4444",
    fontWeight: "bold",
    fontSize: 18,
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