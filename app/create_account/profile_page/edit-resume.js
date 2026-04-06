// app/profile_page/edit-resume.js
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useProfile } from "../../context/ProfileContext";
import { api } from "../../services/api";
import { API_BASE_URL } from "../../services/config";

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
          Resume
        </Text>
        <View className="w-6" />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerClassName="px-6 pb-6">
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Your Resume
          </Text>

          {!resume ? (
            <TouchableOpacity
              className="flex-row items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-6 bg-gray-50"
              onPress={pickDocument}
            >
              <Image
                source={require("../../../assets/images/upload.png")}
                className="w-6 h-6 mr-2"
                style={{ tintColor: "#777" }}
              />
              <Text className="text-gray-600 font-medium">Choose PDF File</Text>
            </TouchableOpacity>
          ) : (
            <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <View className="flex-row items-center mb-3">
                <Image
                  source={require("../../../assets/images/upload.png")}
                  className="w-8 h-8 mr-3"
                  style={{ tintColor: "#555" }}
                />
                <Text className="text-gray-900 flex-1 truncate">
                  {resume.name}
                </Text>
              </View>
              <View className="flex-row justify-end">
                <TouchableOpacity
                  className="px-4 py-2 bg-gray-200 rounded-full"
                  onPress={() => setResume(null)}
                >
                  <Text className="text-black text-sm font-medium">Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <Text className="text-xs text-gray-500 italic">
          Only PDF files up to 10MB allowed.
        </Text>
      </ScrollView>

      {/* Upload Button */}
      <View className="px-6 mt-auto mb-8">
        <TouchableOpacity
          className={`w-full h-12 rounded-full flex items-center justify-center ${!resume || uploading ? "bg-gray-400" : "bg-black"
            }`}
          onPress={handleUpload}
          disabled={!resume || uploading}
        >
          <Text className="text-white font-semibold">
            {uploading ? "Uploading..." : "Upload"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-4/5 max-w-xs items-center">
            <View className="w-15 h-15 rounded-full bg-green-500 flex items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">✓</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2">
              Success!
            </Text>
            <Text className="text-center text-gray-600 text-sm">
              Your resume has been uploaded.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
