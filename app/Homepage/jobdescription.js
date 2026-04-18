// app/Homepage/jobdescription.js
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { api } from "../services/api";

const DescriptionView = ({ job }) => {
  return (
    <View>
      <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">
        Job Description
      </Text>
      <Text className="text-base text-slate-600 leading-6">
        {job.description?.details || "No description available."}
      </Text>

      {job.description?.requirements && (
        <>
          <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">
            Requirements
          </Text>
          <Text className="text-base text-slate-600 leading-6 ml-1">
            • {job.description.requirements}
          </Text>
        </>
      )}

      {job.description?.stipend?.amount && (
        <>
          <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">
            Stipend
          </Text>
          <Text className="text-base text-slate-600 leading-6">
            ${job.description.stipend.amount.toLocaleString()}{" "}
            {job.description.stipend.currency || "USD"} / Year
          </Text>
        </>
      )}
    </View>
  );
};

const CompanyView = ({ job }) => {
  const company = job.company;

  return (
    <View>
      <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">
        About Us
      </Text>
      <Text className="text-base text-slate-600 leading-6">
        {company?.aboutUs ||
          "We are a forward-thinking company focused on innovation, teamwork, and growth. Join us to build the future."}
      </Text>

      <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">
        Address
      </Text>
      <Text className="text-base text-slate-600 leading-6">
        {company?.address || "123 Innovation Drive, Tech City, CA 94000"}
      </Text>

      <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">
        Hours
      </Text>
      <Text className="text-base text-slate-600 leading-6">
        {company?.hours || "Not specified"}
      </Text>

      <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">
        Phone
      </Text>
      <Text className="text-base text-slate-600 leading-6">
        {company?.phone || "Not available"}
      </Text>

      {company?.website ? (
        <>
          <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">
            Website
          </Text>
          <Text className="text-base text-slate-600 leading-6 break-all">
            {company.website.trim()}
          </Text>
        </>
      ) : null}
    </View>
  );
};

const JobDescriptionScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Description");

  useEffect(() => {
    if (!id) {
      setError("No job ID provided");
      setLoading(false);
      return;
    }

    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const response = await api(`/v1/job/${id}`);
        if (response.success && response.data) {
          setJob(response.data);
          setError(null);
        } else {
          throw new Error(response.message || "Job not found");
        }
      } catch (err) {
        console.error("❌ Failed to load job:", err);
        setError(err.message || "Could not load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  const handleBackPress = () => {
    router.back();
  };

  const handleActionPress = () => {
    if (job.sourceType === "csv") {
      const url =
        job.sourceUrl?.trim() ||
        (typeof job.company === "object" ? job.company.website?.trim() : null);
      if (url) {
        Linking.openURL(url).catch(() =>
          Alert.alert("Error", "Could not open website.")
        );
      } else {
        Alert.alert("No Link", "This job has no external URL.");
      }
    } else {
      router.push({
        pathname: "/Homepage/apply",
        params: { jobId: job._id },
      });
    }
  };

  const getButtonText = () => {
    return job.sourceType === "csv" ? "Visit Website" : "Apply Now";
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#000" />
        <Text className="text-lg text-gray-600 mt-4">
          Loading job details...
        </Text>
      </View>
    );
  }

  if (error || !job) {
    return (
      <View className="flex-1 bg-white p-6">
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity onPress={handleBackPress} className="p-1 mb-6">
          <Icon name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <View className="flex-1 justify-center items-center">
          <Icon name="alert-circle-outline" size={60} color="#EF4444" />
          <Text className="text-xl font-bold text-red-600 mt-4">Error</Text>
          <Text className="text-base text-gray-600 mt-2 text-center">
            {error || "Job not found or unavailable."}
          </Text>
          <TouchableOpacity
            className="mt-6 bg-black py-3 px-6 rounded-full"
            onPress={() => router.replace("/Homepage/homepage")}
          >
            <Text className="text-white font-bold">Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const company = job.company;
  const cleanLogoUrl = (company?.logoUrl || "").trim();

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="flex-row justify-between items-center bg-slate-50 px-5 pt-[30px] pb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Icon
            name="chevron-back"
            size={28}
            color="#000"
            style={{
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 1,
              textShadowColor: "#000",
            }}
          />
        </TouchableOpacity>

        <Text className="text-2xl font-bold flex-1 text-center">DETAILS</Text>

        <View className="w-16" />
      </View>

      <View className="flex-1 bg-slate-50">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 160,
            minHeight: "100%",
          }}
        >
          <View
            className="bg-white rounded-2xl flex-row items-center p-4 mb-5 mt-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Image
              source={{
                uri:
                  cleanLogoUrl ||
                  "https://images.unsplash.com/photo-1750515712802-8b63e7dfbb36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8",
              }}
              className="w-20 h-20 rounded-lg"
              resizeMode="contain"
            />

            <View className="ml-4 flex-1">
              <Text
                className="text-xl font-bold text-slate-800"
                numberOfLines={1}
              >
                {job.title}
              </Text>
              <Text className="text-sm text-slate-500 mt-1">
                {company?.name || "Unknown Company"} • {job.location}
              </Text>

              <View className="flex-row mt-2 flex-wrap">
                {(job.labels || []).map((label, idx) => (
                  <View
                    key={idx}
                    className={`mr-2 mb-1 px-2.5 py-1 rounded-full ${
                      label.toLowerCase().includes("remote")
                        ? "bg-blue-100"
                        : label.toLowerCase().includes("full-time")
                        ? "bg-violet-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-xs ${
                        label.toLowerCase().includes("remote")
                          ? "text-blue-800"
                          : label.toLowerCase().includes("full-time")
                          ? "text-violet-800"
                          : "text-gray-800"
                      } font-medium`}
                    >
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View className="flex-row mx-1 mb-6 bg-slate-200 rounded-xl p-1">
            <TouchableOpacity
              className={`flex-1 py-2.5 rounded-lg items-center ${
                activeTab === "Description" ? "bg-white" : ""
              }`}
              style={
                activeTab === "Description"
                  ? {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 2,
                    }
                  : {}
              }
              onPress={() => setActiveTab("Description")}
            >
              <Text
                className={`text-base font-semibold ${
                  activeTab === "Description" ? "text-black" : "text-slate-600"
                }`}
              >
                Description
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2.5 rounded-lg items-center ${
                activeTab === "Company" ? "bg-white" : ""
              }`}
              style={
                activeTab === "Company"
                  ? {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 2,
                    }
                  : {}
              }
              onPress={() => setActiveTab("Company")}
            >
              <Text
                className={`text-base font-semibold ${
                  activeTab === "Company" ? "text-black" : "text-slate-600"
                }`}
              >
                Company
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "Description" ? (
            <DescriptionView job={job} />
          ) : (
            <CompanyView job={job} />
          )}
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-slate-200">
          <TouchableOpacity
            className="bg-black py-4 rounded-2xl items-center"
            onPress={handleActionPress}
          >
            <Text className="text-white text-lg font-bold">
              {getButtonText()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default JobDescriptionScreen;

