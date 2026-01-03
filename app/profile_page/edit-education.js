// app/profile_page/edit-education.js
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfile } from "../context/ProfileContext";
import { api } from "../services/api";

export default function EditEducation() {
  const router = useRouter();
  const { refreshProfile } = useProfile(); // To reload after save

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

  // Load education from backend
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
          startDate: item.startDate?.split("T")[0] || "", // "2024-01-01"
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
    // Validate required fields
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
      // Format for backend
      const formatted = entries.map(({ id, ...item }) => {
        // Clean dates
        let startDate = null;
        if (item.startDate && !item.current) {
          const d = new Date(item.startDate);
          if (!isNaN(d)) startDate = d.toISOString().split("T")[0];
        }

        let endDate = null;
        if (item.current) {
          // Still studying
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

      // Save to backend
      await api("/v1/user/profile", {
        method: "PUT",
        body: JSON.stringify({ education: formatted }),
      });

      // Refresh context
      await refreshProfile();

      // Show success
      Alert.alert("Success", "Education updated!", [
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
        <Text style={styles.headerTitle}>EDUCATION</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Scrollable Form */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.form}>
        {entries.map((item) => (
          <View key={item.id} style={styles.entryCard}>
            {/* Remove Button */}
            {entries.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeEntry(item.id)}
              >
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            )}

            {/* Institution */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Institution</Text>
              <TextInput
                style={styles.input}
                value={item.institution}
                onChangeText={(text) =>
                  updateEntry(item.id, "institution", text)
                }
                placeholder="e.g. Stanford University"
              />
            </View>

            {/* Degree */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Degree</Text>
              <TextInput
                style={styles.input}
                value={item.degree}
                onChangeText={(text) => updateEntry(item.id, "degree", text)}
                placeholder="e.g. BSc, PhD"
              />
            </View>

            {/* Field of Study */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Field of Study</Text>
              <TextInput
                style={styles.input}
                value={item.fieldOfStudy}
                onChangeText={(text) =>
                  updateEntry(item.id, "fieldOfStudy", text)
                }
                placeholder="e.g. Computer Science"
              />
            </View>

            {/* Start Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Date</Text>
              <TextInput
                style={styles.input}
                value={item.startDate}
                onChangeText={(text) => updateEntry(item.id, "startDate", text)}
                placeholder="YYYY-MM-DD"
                keyboardType="number-pad"
              />
            </View>

            {/* Currently Studying? */}
            <View style={styles.checkboxRow}>
              <Text style={styles.label}>Currently Studying?</Text>
              <Switch
                value={item.current}
                onValueChange={(val) => {
                  updateEntry(item.id, "current", val);
                  if (val) updateEntry(item.id, "endDate", ""); // Clear end date
                }}
              />
            </View>

            {/* End Date (only if not current) */}
            {!item.current && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>End Date</Text>
                <TextInput
                  style={styles.input}
                  value={item.endDate}
                  onChangeText={(text) => updateEntry(item.id, "endDate", text)}
                  placeholder="YYYY-MM-DD"
                  keyboardType="number-pad"
                />
              </View>
            )}

            {/* Grade */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Grade / GPA</Text>
              <TextInput
                style={styles.input}
                value={item.grade}
                onChangeText={(text) => updateEntry(item.id, "grade", text)}
                placeholder="e.g. 3.8 GPA"
              />
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={item.location}
                onChangeText={(text) => updateEntry(item.id, "location", text)}
                placeholder="e.g. Oxford, UK"
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
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

        {/* Add New Button */}
        <TouchableOpacity style={styles.addButton} onPress={addNewEntry}>
          <Text style={styles.addButtonText}>+ Add Another Education</Text>
        </TouchableOpacity>
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
  entryCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    position: "relative",
    borderWidth: 1,
    borderColor: "#eee",
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  removeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
    fontFamily: "Roboto",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    fontFamily: "Roboto",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
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
