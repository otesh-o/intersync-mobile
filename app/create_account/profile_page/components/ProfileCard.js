// app/components/ProfileCard.js
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  Alert,
  Platform,
  Image as RNImage,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../../context/AuthContext";
import { useProfile } from "../../../context/ProfileContext";
import { api } from "../../../services/api"; // For other profile updates
import { API_BASE_URL } from "../../../services/config";

export default function ProfileCard() {
  const { name, setName, role, setRole, profilePicUrl, setProfilePicUrl } =
    useProfile();
  const { isPremium } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(name);
  const [localRole, setLocalRole] = useState(role);
  const [uploading, setUploading] = useState(false);

  // Debug: Log when context values change
  React.useEffect(() => {
    console.log("ProfileCard: Context updated", {
      name,
      role,
      profilePicUrl: profilePicUrl ? "URL present" : null,
    });
  }, [name, role, profilePicUrl]);

  // Sync local inputs when context updates
  React.useEffect(() => {
    setLocalName(name);
    setLocalRole(role);
  }, [name, role]);

  // Show success toast (Android) or alert (iOS)
  const showSuccess = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Success", message, [{ text: "OK", style: "cancel" }]);
    }
  };

  // Function: Pick image and upload to backend
  const pickImage = async () => {
    console.log("Starting image picker...");
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      console.warn("Permission denied");
      Alert.alert("Permission required", "Please allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      console.log("Image selection canceled");
      return;
    }

    const uri = result.assets[0].uri;
    console.log("Selected image URI:", uri);
    setUploading(true);

    try {
      // --- Prepare File for Upload ---
      const formData = new FormData();

      const fileEntry = {
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        type: getMimeType(uri),
        name: getFileName(uri),
      };

      console.log("Uploading file:", fileEntry);
      formData.append("file", fileEntry);

      // --- Upload to Backend ---
      const token = await SecureStore.getItemAsync("auth-token");
      if (!token) {
        throw new Error("No auth token found. Please log in.");
      }


      const endpoint = `${API_BASE_URL}/v1/user/upload/profile-picture`;
      console.log("Sending to endpoint:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type — let fetch set boundary
        },
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }

      // --- Success: Extract public URL ---
      const imageUrl = data.absoluteUrl?.trim();
      console.log("Received image URL:", imageUrl);

      if (!imageUrl) {
        throw new Error("No public URL returned from server");
      }

      // Update frontend context
      setProfilePicUrl(imageUrl);
      console.log("Profile picture updated in context");

      // Show success
      showSuccess("Profile picture updated!");
    } catch (error) {
      console.error("Profile picture upload failed:", error);
      Alert.alert("Upload Failed", error.message || "Could not upload image.");
    } finally {
      setUploading(false);
    }
  };

  // Save name & role via PUT /v1/user/profile
  const handleSave = async () => {
    if (!localName.trim()) {
      Alert.alert("Name Required", "Please enter your name.");
      return;
    }

    console.log("Saving profile:", { name: localName, aboutMe: localRole });

    try {
      await api("/v1/user/profile", {
        method: "PUT",
        body: JSON.stringify({
          firstName: localName.trim(),
          aboutMe: localRole.trim() || undefined,
        }),
      });

      setName(localName.trim());
      setRole(localRole.trim() || "");
      setIsEditing(false);

      console.log("Name and role saved successfully");
      showSuccess("Name and role saved!");
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("Save Failed", error.message || "Could not save profile.");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  // Helper: Get MIME type from URI
  const getMimeType = (uri) => {
    const extension = uri.split(".").pop()?.toLowerCase();
    if (!extension) return "image/jpeg";

    const mimeMap = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };
    const type = mimeMap[extension] || "image/jpeg";
    console.log(`Detected MIME type for .${extension}: ${type}`);
    return type;
  };

  // Helper: Extract filename
  const getFileName = (uri) => {
    const name = uri.split("/").pop() || "profile-pic.jpg";
    console.log(`Generated filename: ${name}`);
    return name;
  };

  return (
    <View
      style={{
        width: "100%",
        maxWidth: 350,
        borderRadius: 13.29,
        backgroundColor: "#F7F7F7",
        paddingHorizontal: 16,
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 32,
      }}
    >
      {/* Profile Image */}
      <TouchableOpacity onPress={pickImage} disabled={uploading}>
        {uploading ? (
          <View
            style={{
              width: 68,
              height: 68,
              borderRadius: 34,
              backgroundColor: "#ccc",
              marginBottom: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              name="sync"
              size={24}
              color="#fff"
              style={{ transform: [{ rotate: "45deg" }] }}
            />
          </View>
        ) : (
          <RNImage
            source={
              profilePicUrl
                ? { uri: profilePicUrl }
                : require("../../../../assets/images/avatar.jpeg")
            }
            style={{
              width: 68,
              height: 68,
              borderRadius: 34,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          />
        )}
      </TouchableOpacity>

      {/* Edit Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 20,
          right: 24,
          zIndex: 10,
        }}
        onPress={handleEditToggle}
      >
        <Icon
          name={isEditing ? "checkmark" : "create-outline"}
          size={24}
          color="#007AFF"
        />
      </TouchableOpacity>

      {/* Name Field */}
      <View style={{ width: "100%", alignItems: "center", marginBottom: 4 }}>
        {isEditing ? (
          <TextInput
            value={localName}
            onChangeText={setLocalName}
            placeholder="Enter your name"
            style={{
              fontFamily: "Roboto-Bold",
              fontWeight: "700",
              fontSize: 20,
              color: "#000",
              textAlign: "center",
              width: "80%",
              borderBottomWidth: 1,
              borderBottomColor: "#007AFF",
              paddingBottom: 4,
            }}
            autoFocus
            onSubmitEditing={handleSave}
            placeholderTextColor="#999"
          />
        ) : (
          <Text
            style={{
              fontFamily: "Roboto-Bold",
              fontWeight: "700",
              fontSize: 20,
              color: "#000",
            }}
          >
            {name || "Enter your name"}
          </Text>
        )}
      </View>

      {/* Role / About Me Field */}
      <View style={{ width: "100%", alignItems: "center", marginBottom: 16 }}>
        {isEditing ? (
          <TextInput
            value={localRole}
            onChangeText={setLocalRole}
            placeholder="e.g. UX Designer, Student, Developer"
            style={{
              fontFamily: "Raleway-Medium",
              fontWeight: "500",
              fontSize: 12.5,
              lineHeight: 19,
              color: "#666",
              textAlign: "center",
              width: "80%",
              borderBottomWidth: 1,
              borderBottomColor: "#007AFF",
              paddingBottom: 4,
            }}
            multiline
            blurOnSubmit
            onSubmitEditing={handleSave}
            placeholderTextColor="#999"
          />
        ) : (
          <Text
            style={{
              fontFamily: "Raleway-Medium",
              fontWeight: "500",
              fontSize: 12.5,
              lineHeight: 19,
              color: "#666",
              textAlign: "center",
              width: "80%",
            }}
          >
            {role || "Enter your role or a brief bio."}
          </Text>
        )}
      </View>

      {/* Plan Badge */}
      <View
        style={{
          backgroundColor: isPremium ? "#EAB308" : "#64748B",
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 100,
          marginTop: 8,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 10,
            fontWeight: "700",
            textTransform: "uppercase",
            fontFamily: "Raleway",
          }}
        >
          {isPremium ? "Premium member" : "Free Plan"}
        </Text>
      </View>
    </View>
  );
}

