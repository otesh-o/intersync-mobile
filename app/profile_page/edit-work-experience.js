// app/profile_page/edit-work-experience.js
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

export default function EditWorkExperience() {
  const router = useRouter();
  const { refreshProfile } = useProfile();

  const [jobs, setJobs] = useState([
    {
      id: "new-1",
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  ]);

  // Load work experience from backend
  useEffect(() => {
    loadWorkExperience();
  }, []);

  const loadWorkExperience = async () => {
    try {
      const response = await api("/v1/user/profile");
      const serverJobs = response.user.workExperience || [];

      if (serverJobs.length > 0) {
        const mapped = serverJobs.map((item) => ({
          id: item._id || Date.now().toString(),
          jobTitle: item.jobTitle || "",
          company: item.company || "",
          startDate: item.startDate?.split("T")[0] || "", // Extract YYYY-MM-DD
          endDate: item.endDate?.split("T")[0] || "",
          description: item.description || "",
          current: !!item.current,
        }));
        setJobs(mapped);
      }
    } catch (error) {
      console.error("Failed to load work experience:", error);
      Alert.alert("Error", error.message || "Could not load work history.");
    }
  };

  const updateJob = (id, field, value) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, [field]: value } : job))
    );
  };

  const addNewJob = () => {
    const newJob = {
      id: `new-${Date.now()}`,
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    };
    setJobs((prev) => [newJob, ...prev]);
  };

  const removeJob = (id) => {
    if (jobs.length <= 1) {
      Alert.alert("At least one job required");
      return;
    }
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const handleSave = async () => {
    // Validate required fields
    const hasEmptyRequired = jobs.some(
      (job) => !job.jobTitle.trim() || !job.company.trim()
    );

    if (hasEmptyRequired) {
      Alert.alert(
        "Missing Info",
        "Please fill in job title and company for all roles."
      );
      return;
    }

    try {
      // Format for backend: clean & validate each job
      const formattedJobs = jobs.map(({ id, ...job }) => {
        // Clean strings
        const cleaned = {
          jobTitle: job.jobTitle.trim(),
          company: job.company.trim(),
          description: job.description?.trim() || "",
          current: !!job.current,
        };

        // Start Date: must be valid YYYY-MM-DD or empty string
        if (job.startDate) {
          const parsed = new Date(job.startDate);
          if (!isNaN(parsed)) {
            cleaned.startDate = parsed.toISOString().split("T")[0]; // "2024-07-06"
          } else {
            cleaned.startDate = "";
          }
        } else {
          cleaned.startDate = "";
        }

        // End Date: if currently working null
        if (job.current) {
          cleaned.endDate = null;
        } else if (job.endDate) {
          const lower = job.endDate.toLowerCase().trim();
          if (["present", "now", "current"].includes(lower)) {
            cleaned.current = true;
            cleaned.endDate = null;
          } else {
            const parsed = new Date(job.endDate);
            if (!isNaN(parsed)) {
              cleaned.endDate = parsed.toISOString().split("T")[0];
            } else {
              cleaned.endDate = "";
            }
          }
        } else {
          cleaned.endDate = "";
        }

        return cleaned;
      });

      console.log(
        "Sending to backend:",
        JSON.stringify(formattedJobs, null, 2)
      );

      await api("/v1/user/profile", {
        method: "PUT",
        body: JSON.stringify({ workExperience: formattedJobs }),
      });

      // Refresh context
      await refreshProfile();

      // Show success message
      Alert.alert("Success", "Work experience updated!", [
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
                value={job.jobTitle}
                onChangeText={(text) => updateJob(job.id, "jobTitle", text)}
                placeholder="e.g. UX Designer"
                maxLength={100}
              />
            </View>

            {/* Company */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company</Text>
              <TextInput
                style={styles.input}
                value={job.company}
                onChangeText={(text) => updateJob(job.id, "company", text)}
                placeholder="e.g. Google"
                maxLength={100}
              />
            </View>

            {/* Start Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Date</Text>
              <TextInput
                style={styles.input}
                value={job.startDate}
                onChangeText={(text) => updateJob(job.id, "startDate", text)}
                placeholder="YYYY-MM-DD"
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>

            {/* Currently Working Toggle */}
            <View style={styles.checkboxRow}>
              <Text style={styles.label}>Currently working?</Text>
              <Switch
                value={job.current}
                onValueChange={(val) => {
                  updateJob(job.id, "current", val);
                  if (val) updateJob(job.id, "endDate", ""); // Clear end date
                }}
              />
            </View>

            {/* End Date (only if not current) */}
            {!job.current && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>End Date</Text>
                <TextInput
                  style={styles.input}
                  value={job.endDate}
                  onChangeText={(text) => updateJob(job.id, "endDate", text)}
                  placeholder="YYYY-MM-DD"
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
            )}

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
                maxLength={500}
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

