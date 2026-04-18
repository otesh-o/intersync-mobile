// app/profile_page/edit-about-me.js
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ToastAndroid,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useProfile } from "../../context/ProfileContext";

export default function EditAboutMe() {
  const router = useRouter();
  const { setRole } = useProfile(); 
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    loadAboutMe();
  }, []);

  const loadAboutMe = async () => {
    try {
      const response = await api("/v1/user/profile");
      setText(response.user.aboutMe || "");
    } catch (error) {
      console.error("Failed to load about me:", error);
      Alert.alert("Error", error.message || "Could not load profile.");
      setText("");
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccess = (message) => {
    if (ToastAndroid && typeof ToastAndroid.show === "function") {
      
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Success", message, [{ text: "OK", style: "cancel" }]);
    }
  };

  const handleSave = async () => {
    if (!text.trim()) {
      const confirm = await new Promise((resolve) =>
        Alert.alert(
          "Empty Bio",
          "Are you sure you want to save an empty 'About Me'?",
          [
            { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
            { text: "Yes", onPress: () => resolve(true) },
          ]
        )
      );
      if (!confirm) return;
    }

    try {
      await api("/v1/user/profile", {
        method: "PUT",
        body: JSON.stringify({ aboutMe: text.trim() }),
      });

      
      setRole(text.trim());

      
      showSuccess("About Me updated!");

      
      router.back();
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
            source={require("../../../assets/images/back.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ABOUT ME</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Input */}
      {isLoading ? (
        <View style={styles.loading}>
          <Text style={{ color: "#666" }}>Loading...</Text>
        </View>
      ) : (
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
      )}

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? "Saving..." : "Save"}
        </Text>
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

