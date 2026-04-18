// app/profile_page/edit-resume.js
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";

// Services
import { useProfile } from "../context/ProfileContext";
import { api } from "../services/api";
import { API_BASE_URL } from "../services/config";

export default function EditResume() {
  const router = useRouter();
  const { setResumeUrl } = useProfile();

  const [resume, setResume] = useState(null); // { name, uri }
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled || result.type === "cancel") return;

      const file = result.assets ? result.assets[0] : result;
      if (!file?.uri) throw new Error("No file URI found");

      setResume({ name: file.name || "resume.pdf", uri: file.uri });
    } catch (error) {
      console.error("Document picker error:", error);
      alert("Could not select document.");
    }
  };

  const handleUpload = async () => {
    if (!resume) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: resume.uri,
        type: "application/pdf",
        name: resume.name,
      });

      const token = await SecureStore.getItemAsync("auth-token");
      const uploadResponse = await fetch(
        `${API_BASE_URL}/v1/user/upload/resume`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.message || "Upload failed");
      }

      const cleanedUrl = (
        uploadData.absoluteUrl || uploadData.data?.absoluteUrl
      )?.trim();
      if (!cleanedUrl) throw new Error("No public URL returned");

      await api("/v1/user/profile", {
        method: "PUT",
        body: JSON.stringify({ resumeUrl: cleanedUrl }),
      });

      setResumeUrl(cleanedUrl);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        router.back();
      }, 1500);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error.message || "Could not upload resume.");
    } finally {
      setUploading(false);
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
        <Text style={styles.headerTitle}>RESUME</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.label}>Your Resume</Text>

          {!resume ? (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickDocument}
            >
              <Image
                source={require("../../assets/images/upload.png")}
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadButtonText}>Choose PDF File</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.previewCard}>
              <View style={styles.fileRow}>
                <Image
                  source={require("../../assets/images/upload.png")}
                  style={styles.fileIcon}
                />
                <Text style={styles.fileName} numberOfLines={1}>
                  {resume.name}
                </Text>
              </View>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={() => setResume(null)}
                >
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <Text style={styles.tip}>Only PDF files up to 10MB allowed.</Text>
      </ScrollView>

      {/* Upload Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.uploadButtonFinal,
            (!resume || uploading) && styles.disabledButton,
          ]}
          onPress={handleUpload}
          disabled={!resume || uploading}
        >
          <Text style={styles.uploadButtonFinalText}>
            {uploading ? "Uploading..." : "Upload"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalMessage}>
              Your resume has been uploaded.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  backIcon: { width: 20, height: 20, tintColor: "#555" },
  headerTitle: {
    fontFamily: "Roboto-Bold",
    fontWeight: "700",
    fontSize: 20,
    color: "#000",
    textTransform: "uppercase",
    flex: 1,
    textAlign: "center",
  },
  scrollContent: { paddingHorizontal: 26, paddingBottom: 20 },
  section: { marginBottom: 24 },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    fontFamily: "Roboto",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 24,
    backgroundColor: "#f9f9f9",
  },
  uploadIcon: { width: 24, height: 24, tintColor: "#888", marginRight: 8 },
  uploadButtonText: { color: "#555", fontSize: 16, fontWeight: "500" },
  previewCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  fileRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  fileIcon: { width: 32, height: 32, marginRight: 12 },
  fileName: { fontSize: 15, color: "#333", flex: 1 },
  buttonGroup: { flexDirection: "row", justifyContent: "flex-end" },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  changeText: { color: "#000", fontSize: 14, fontWeight: "600" },
  tip: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
    fontFamily: "Roboto",
  },

  buttonContainer: {
    paddingHorizontal: 26,
    marginTop: "auto",
    marginBottom: 32,
  },
  uploadButtonFinal: {
    width: "100%",
    height: 50,
    backgroundColor: "#000", // Black button only
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: { opacity: 0.6 },
  uploadButtonFinalText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
  },
  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  checkmark: { color: "white", fontSize: 32, fontWeight: "bold" },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  modalMessage: { fontSize: 14, color: "#666", textAlign: "center" },
});

