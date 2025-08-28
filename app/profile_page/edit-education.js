// app/profile_page/edit-education.js
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

export default function EditEducation() {
  const router = useRouter();
  const { section = "Education" } = useLocalSearchParams();

  const [entries, setEntries] = useState([
    { id: "1", degree: "", school: "", startDate: "", endDate: "" },
  ]);

  // Load saved data
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
        const data = saved ? JSON.parse(saved) : {};
        const savedEntries = data[section] || [];

        if (savedEntries.length > 0) {
          setEntries(savedEntries);
        }
      } catch (e) {
        console.error("Failed to load education", e);
      }
    };
    load();
  }, [section]);

  const updateEntry = (id, field, value) => {
    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addNewEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      degree: "",
      school: "",
      startDate: "",
      endDate: "",
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const removeEntry = (id) => {
    if (entries.length <= 1) return;
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    try {
      const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
      const data = saved ? JSON.parse(saved) : {};
      data[section] = entries;
      await AsyncStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save education", e);
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

            {/* Degree */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Degree</Text>
              <TextInput
                style={styles.input}
                value={item.degree}
                onChangeText={(text) => updateEntry(item.id, "degree", text)}
                placeholder="e.g. PhD in HCI"
              />
            </View>

            {/* School */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>School</Text>
              <TextInput
                style={styles.input}
                value={item.school}
                onChangeText={(text) => updateEntry(item.id, "school", text)}
                placeholder="e.g. Stanford University"
              />
            </View>

            {/* Start Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Date</Text>
              <TextInput
                style={styles.input}
                value={item.startDate}
                onChangeText={(text) => updateEntry(item.id, "startDate", text)}
                placeholder="e.g. Sep 2010"
              />
            </View>

            {/* End Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>End Date</Text>
              <TextInput
                style={styles.input}
                value={item.endDate}
                onChangeText={(text) => updateEntry(item.id, "endDate", text)}
                placeholder="e.g. Jun 2014"
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