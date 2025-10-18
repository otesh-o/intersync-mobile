// app/components/JobCard.js
import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Animated,
  Alert,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { api } from "../services/api";
import { useSavedJobs } from "../context/SavedJobsContext";
import { useProfile } from "../context/ProfileContext";

const JobCard = ({ job, onSwipe, isTop, style = {} }) => {
  const { width } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const { refreshSavedJobs } = useSavedJobs();
  const {
    name: profileName,
    role: aboutMe,
    workExperience,
    education,
    skills,
    languages,
    resumeUrl,
  } = useProfile();

  const rotate = translateX.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ["-12deg", "0deg", "12deg"],
    extrapolate: "clamp",
  });

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const buildApplyPayload = () => {
    return {
      fullName: profileName || "",
      role: aboutMe || "",
      aboutMe: aboutMe || "",
      workExperience: workExperience || [],
      education: education || [],
      skills: Array.isArray(skills) ? skills : [],
      languages: Array.isArray(languages) ? languages : [],
      resumeUrl: resumeUrl || "",
      portfolioUrl: "",
      message: `I'm excited to apply for the ${job.title} role at ${
        typeof job.company === "object"
          ? job.company.name
          : job.company || "this organization"
      }.`,
    };
  };

  const applyToJob = async (jobId) => {
    try {
      const payload = buildApplyPayload();
      await api.post(`/v1/apply/job/${jobId}`, payload);
    } catch (error) {
      console.error("Apply failed:", error);
      Alert.alert(
        "Application Failed",
        "Could not submit your application. Please try again."
      );
      throw error;
    }
  };

  const toggleBookmark = async () => {
    try {
      await api(`/v1/bookmark/job/${job.id}`, { method: "POST" });
      refreshSavedJobs();
    } catch (error) {
      console.error("Bookmark failed:", error);
      Alert.alert("Error", "Could not save this job.");
    }
  };

  const onHandlerStateChange = async (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = event.nativeEvent;
      const swipeThreshold = width * 0.25;

      if (
        Math.abs(translationX) > swipeThreshold ||
        Math.abs(velocityX) > 800
      ) {
        const direction = translationX > 0 ? "right" : "left";
        const toValue = direction === "right" ? width * 1.5 : -width * 1.5;

        Animated.timing(translateX, {
          toValue,
          duration: 300,
          useNativeDriver: true,
        }).start(async () => {
          try {
            if (direction === "right") {
              if (job.sourceType === "website") {
                await applyToJob(job.id);
              } else {
                await api(`/v1/bookmark/job/${job.id}`, { method: "POST" });
                refreshSavedJobs();
              }
            }
            onSwipe(job.id, direction);
          } catch (error) {
            Animated.parallel([
              Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
              }),
              Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
              }),
            ]).start();
          }
        });
      } else {
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
        ]).start();
      }
    }
  };

  const handleButtonPress = async (direction) => {
    const toValue = direction === "right" ? width * 1.5 : -width * 1.5;
    Animated.timing(translateX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(async () => {
      try {
        if (direction === "right") {
          if (job.sourceType === "website") {
            await applyToJob(job.id);
          } else {
            await api(`/v1/bookmark/job/${job.id}`, { method: "POST" });
            refreshSavedJobs();
          }
        }
        onSwipe(job.id, direction);
      } catch (error) {
        Animated.parallel([
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
        ]).start();
      }
    });
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "internships":
        return "Internship";
      case "extracurriculars":
        return "Extracurricular";
      case "scholarships":
        return "Scholarship";
      default:
        return "Opportunity";
    }
  };

  const getActionIcon = () => {
    return job.sourceType === "website" ? "checkmark" : "bookmark";
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      enabled={isTop}
    >
      <Animated.View
        className="absolute w-[90%] max-w-sm self-center bg-white rounded-3xl shadow-lg"
        style={[
          style,
          {
            transform: [{ translateX }, { translateY }, { rotate }],
          },
        ]}
      >
        {/* Job Image */}
        <View className="relative">
          <Image
            source={{
              uri:
                job.bannerImageUrl?.trim() ||
                (typeof job.company === "object" &&
                  job.company?.logoUrl?.trim()) ||
                "https://i.pinimg.com/736x/b3/c8/31/b3c831ecff785cbb3e3ec2969ec16f7e.jpg",
            }}
            className="w-full h-40 rounded-t-2xl"
            resizeMode="cover"
          />

          {/* Top-right Bookmark (website jobs only) */}
          {job.sourceType === "website" && (
            <TouchableOpacity
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full justify-center items-center shadow-sm"
              onPress={toggleBookmark}
            >
              <Icon name="bookmark" size={18} color="#22C55E" />
            </TouchableOpacity>
          )}

          <View className="absolute -bottom-6 left-5 bg-white p-1.5 rounded-2xl shadow-md border border-slate-200">
            {/* Company logo */}
          </View>
        </View>

        {/* Job Details */}
        <View className="p-5 pt-10">
          <View className="flex-row justify-between items-start mb-1">
            <Text
              className="text-2xl font-bold text-slate-800 flex-1"
              numberOfLines={1}
            >
              {job.title}
            </Text>

            <View
              className="px-2.5 py-1 rounded-full ml-2"
              style={{ backgroundColor: "#22C55E" }}
            >
              <Text className="text-white text-xs font-bold uppercase tracking-wide">
                {getCategoryLabel(job.category)}
              </Text>
            </View>
          </View>

          <Text className="text-base text-slate-500 mt-1">
            {(typeof job.company === "object"
              ? job.company.name
              : job.company) || "Organization"}{" "}
            - {job.location}
          </Text>

          {job.description?.stipend?.amount > 0 && (
            <Text className="text-base font-bold text-slate-700 mt-1">
              ${job.description.stipend.amount}{" "}
              {job.description.stipend.currency || "USD"} Stipend
            </Text>
          )}

          <View className="flex-row mt-4 flex-wrap">
            {job.type && (
              <Text className="bg-slate-100 text-slate-600 text-xs font-semibold mr-2 mb-2 px-4 py-1.5 rounded-full">
                {job.type}
              </Text>
            )}
            {job.workMode && (
              <Text className="bg-slate-100 text-slate-600 text-xs font-semibold mr-2 mb-2 px-4 py-1.5 rounded-full">
                {job.workMode}
              </Text>
            )}
            {job.level && (
              <Text className="bg-slate-100 text-slate-600 text-xs font-semibold mr-2 mb-2 px-4 py-1.5 rounded-full">
                {job.level}
              </Text>
            )}
            {job.isRemote && (
              <Text className="bg-blue-100 text-blue-700 text-xs font-semibold mr-2 mb-2 px-4 py-1.5 rounded-full">
                Remote
              </Text>
            )}
            {job.jobType && (
              <Text className="bg-violet-100 text-violet-700 text-xs font-semibold mr-2 mb-2 px-4 py-1.5 rounded-full">
                {job.jobType}
              </Text>
            )}
          </View>

          <Text
            className="text-sm text-slate-600 mt-4 leading-relaxed"
            numberOfLines={2}
          >
            {typeof job.description === "string"
              ? job.description
              : typeof job.description === "object"
              ? job.description.details ||
                job.description.summary ||
                "No description available."
              : "No description available."}
          </Text>
        </View>

        {/* Action Buttons */}
        {isTop && (
          <View className="flex-row justify-evenly pt-2 pb-5">
            {/* ❌ Dismiss */}
            <TouchableOpacity
              className="w-14 h-14 justify-center items-center rounded-full bg-red-400 border-0"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 12,
                transform: [{ translateY: 4 }],
                borderWidth: 1.5,
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
              onPress={() => handleButtonPress("left")}
            >
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>

            {/* ➕ View Details (website) OR Open External Link (csv) */}
            <TouchableOpacity
              className="w-14 h-14 justify-center items-center rounded-full bg-slate-800"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 7 },
                shadowOpacity: 0.45,
                shadowRadius: 10,
                elevation: 14,
                transform: [{ translateY: 4 }],
                borderWidth: 1.5,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
              onPress={() => {
                if (job.sourceType === "csv") {
                  const url =
                    job.sourceUrl?.trim() ||
                    (typeof job.company === "object"
                      ? job.company.website?.trim()
                      : null);
                  if (url) {
                    Linking.openURL(url).catch(() =>
                      Alert.alert("Error", "Could not open link.")
                    );
                  } else {
                    Alert.alert("No Link", "This job has no external URL.");
                  }
                } else {
                  router.push({
                    pathname: "/Homepage/jobdescription",
                    params: { id: job.id },
                  });
                }
              }}
            >
              <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>

            {/* ✅ Apply or 🔖 Bookmark */}
            <TouchableOpacity
              className="w-14 h-14 justify-center items-center rounded-full"
              style={{
                backgroundColor: "#22C55E",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 9,
                elevation: 13,
                transform: [{ translateY: 4 }],
                borderWidth: 1.5,
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
              onPress={() => handleButtonPress("right")}
            >
              <Icon name={getActionIcon()} size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default JobCard;
