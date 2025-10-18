// app/profile_page/edit-work-experience.js
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useProfile } from "../../context/ProfileContext";

export default function EditWorkExperience() {
  const router = useRouter();
  // ✅ Get current value + setter from context
  const {
    workExperience: currentWorkExperience,
    setWorkExperience: setContextWorkExperience,
  } = useProfile();

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
          startDate: item.startDate?.split("T")[0] || "",
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
      const formattedJobs = jobs.map(({ id, ...job }) => {
        const cleaned = {
          jobTitle: job.jobTitle.trim(),
          company: job.company.trim(),
          description: job.description?.trim() || "",
          current: !!job.current,
        };

        if (job.startDate) {
          const parsed = new Date(job.startDate);
          if (!isNaN(parsed)) {
            cleaned.startDate = parsed.toISOString().split("T")[0];
          } else {
            cleaned.startDate = "";
          }
        } else {
          cleaned.startDate = "";
        }

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

      // ✅ 1. Update context IMMEDIATELY
      setContextWorkExperience(formattedJobs);

      // ✅ 2. Save to backend
      await api("/v1/user/profile", {
        method: "PUT",
        body: JSON.stringify({ workExperience: formattedJobs }),
      });

      Alert.alert("Success", "Work experience updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Save failed:", error);
      // ✅ Roll back on error
      setContextWorkExperience(currentWorkExperience);
      Alert.alert("Save Failed", error.message || "Could not save. Try again.");
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
          Work Experience
        </Text>
        <View className="w-6" />
      </View>

      {/* Scrollable Form */}
      <ScrollView className="flex-1 px-6" contentContainerClassName="pb-6">
        {jobs.map((job) => (
          <View
            key={job.id}
            className="bg-gray-50 p-4 rounded-lg mb-5 border border-gray-200 relative"
          >
            {jobs.length > 1 && (
              <TouchableOpacity
                className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full justify-center items-center z-10"
                onPress={() => removeJob(job.id)}
              >
                <Text className="text-white font-bold text-sm">✕</Text>
              </TouchableOpacity>
            )}

            {/* Job Title */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Job Title
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base"
                value={job.jobTitle}
                onChangeText={(text) => updateJob(job.id, "jobTitle", text)}
                placeholder="e.g. UX Designer"
                maxLength={100}
              />
            </View>

            {/* Company */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Company
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base"
                value={job.company}
                onChangeText={(text) => updateJob(job.id, "company", text)}
                placeholder="e.g. Google"
                maxLength={100}
              />
            </View>

            {/* Start Date */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Start Date
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base"
                value={job.startDate}
                onChangeText={(text) => updateJob(job.id, "startDate", text)}
                placeholder="YYYY-MM-DD"
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>

            {/* Currently Working Toggle */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm font-medium text-gray-700">
                Currently working?
              </Text>
              <Switch
                value={job.current}
                onValueChange={(val) => {
                  updateJob(job.id, "current", val);
                  if (val) updateJob(job.id, "endDate", "");
                }}
              />
            </View>

            {/* End Date (only if not current) */}
            {!job.current && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  End Date
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base"
                  value={job.endDate}
                  onChangeText={(text) => updateJob(job.id, "endDate", text)}
                  placeholder="YYYY-MM-DD"
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
            )}

            {/* Description */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Description
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white min-h-[100] text-base"
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

        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-lg self-start mb-6"
          onPress={addNewJob}
        >
          <Text className="text-black font-medium text-sm">
            + Add Another Job
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity
        className="w-80 h-12 bg-black rounded-full justify-center items-center self-center mb-6"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold text-base">Save</Text>
      </TouchableOpacity>
    </View>
  );
}
