// app/profile_page/edit-work-experience.js
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_DATA_KEY = "userProfileData";

export default function EditWorkExperience() {
  const router = useRouter();
  const { section = "Work Experience" } = useLocalSearchParams();

  const [jobs, setJobs] = useState([
    { id: "1", title: "", company: "", startDate: "", endDate: "", description: "" },
  ]);

  // Load existing jobs
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
        const data = saved ? JSON.parse(saved) : {};
        const savedJobs = data[section] || [];

        if (savedJobs.length > 0) {
          setJobs(savedJobs);
        }
      } catch (e) {
        console.error("Failed to load work experience", e);
      }
    };
    load();
  }, [section]);

  const updateJob = (id, field, value) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, [field]: value } : job))
    );
  };

  const addNewJob = () => {
    const newJob = {
      id: Date.now().toString(), // Simple unique ID
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setJobs((prev) => [newJob, ...prev]); // Add to top
  };

  const removeJob = (id) => {
    if (jobs.length <= 1) {
      Alert.alert("At least one job required");
      return;
    }
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const handleSave = async () => {
    try {
      const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
      const data = saved ? JSON.parse(saved) : {};

      // Save as array
      data[section] = jobs;
      await AsyncStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(data));

      console.log("Saved work experiences:", jobs);
    } catch (e) {
      console.error("Failed to save", e);
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
        <Text style={styles.headerTitle}>WORK EXPERIENCE</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Scrollable Form */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.form}>
        {jobs.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            {/* Remove Job Button */}
            {jobs.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeJob(job.id)}
              >
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            )}

            {/* Job Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Job Title</Text>
              <TextInput
                style={styles.input}
                value={job.title}
                onChangeText={(text) => updateJob(job.id, "title", text)}
                placeholder="e.g. Manager"
              />
            </View>

            {/* Company */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company</Text>
              <TextInput
                style={styles.input}
                value={job.company}
                onChangeText={(text) => updateJob(job.id, "company", text)}
                placeholder="e.g. Amazon Inc"
              />
            </View>

            {/* Start Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Date</Text>
              <TextInput
                style={styles.input}
                value={job.startDate}
                onChangeText={(text) => updateJob(job.id, "startDate", text)}
                placeholder="e.g. Jan 2015"
              />
            </View>

            {/* End Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>End Date</Text>
              <TextInput
                style={styles.input}
                value={job.endDate}
                onChangeText={(text) => updateJob(job.id, "endDate", text)}
                placeholder="e.g. Feb 2022"
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={job.description}
                onChangeText={(text) => updateJob(job.id, "description", text)}
                placeholder="Describe your role and achievements..."
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        ))}

        {/* Add New Job Button */}
        <TouchableOpacity style={styles.addButton} onPress={addNewJob}>
          <Text style={styles.addButtonText}>+ Add Another Job</Text>
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
  jobCard: {
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