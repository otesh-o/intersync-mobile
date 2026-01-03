// app/components/JobCard.js
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { useProfile } from "../context/ProfileContext";
import { useSavedJobs } from "../context/SavedJobsContext";
import { api } from "../services/api";

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


  console.log("Job ID:", job.id);
  console.log("Raw bannerImageUrl:", job.bannerImageUrl);
  console.log("Trimmed bannerImageUrl:", job.bannerImageUrl?.trim());

  const [imageLoadFailed, setImageLoadFailed] = useState(false);

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
      message: `I'm excited to apply for the ${job.title} role at ${typeof job.company === "object"
          ? job.company.name
          : job.company || "this organization"
        }.`,
    };
  };

  const applyToJob = async (jobId) => {
    try {
      if (!resumeUrl || resumeUrl.trim() === "") {
        Alert.alert(
          "Resume Required",

          "Please upload your resume in your profile before applying."
        );

        throw new Error("Resume not uploaded");
      }

      console.log("Preparing application for job:", jobId);

      const payload = {
        applicantName: profileName || "",

        portfolioUrl: "",

        resumeUrl: resumeUrl,

        text: `I'm excited to apply for the ${job.title} role at ${typeof job.company === "object"
            ? job.company.name
            : job.company || "this organization"
          }.`,
      };

      console.log("Sending application payload:", payload);

      await api(`/v1/application/job/${jobId}`, {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(payload),
      });

      console.log("Job applied successfully:", jobId);
    } catch (error) {
      console.error("Apply failed:", error);

      if (error.message !== "Resume not uploaded") {
        Alert.alert(
          "Application Failed",

          error.message || "Could not submit your application. Please try again."
        );
      }

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
              if (job.sourceType === "web") {
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


          if (direction === "right") {
            if (job.sourceType === "web") {
              console.log("Applying to web job via swipe:", job.id);
              await applyToJob(job.id);
            } else {
              console.log("Bookmarking CSV job via swipe:", job.id);
              await api(`/v1/bookmark/job/${job.id}`, { method: "POST" });
              refreshSavedJobs();
            }
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
    console.log(
      "Button pressed:",
      direction,
      "| Job ID:",
      job.id,
      "| Source:",
      job.sourceType
    );

    const toValue = direction === "right" ? width * 1.5 : -width * 1.5;
    Animated.timing(translateX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(async () => {
      try {
        if (direction === "right") {
          if (job.sourceType === "web") {
            console.log("Applying to web job:", job.id);
            await applyToJob(job.id);
            console.log("Successfully applied to job:", job.id);
          } else {
            console.log("Bookmarking CSV job:", job.id);
            await api(`/v1/bookmark/job/${job.id}`, { method: "POST" });
            console.log("Successfully bookmarked job:", job.id);
            refreshSavedJobs();
            console.log("Saved jobs list refreshed");
          }
        } else {
          console.log("Job dismissed:", job.id);
        }

        console.log("Calling onSwipe callback for job:", job.id);
        onSwipe(job.id, direction);
      } catch (error) {
        console.error("Error in handleButtonPress:", error);
        console.log("Reverting card animation due to error");

        Animated.parallel([
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
        ]).start();
      }
    });
  };



  const getActionIcon = () => {
    return job.sourceType === "web" ? "checkmark" : "bookmark";
  };


  const getBannerUri = () => {
    if (!imageLoadFailed) {
      if (job.bannerImageUrl?.trim()) return job.bannerImageUrl.trim();
      if (typeof job.company === "object" && job.company?.logoUrl?.trim()) {
        return job.company.logoUrl.trim();
      }
    }

    return "https://i.pinimg.com/736x/b3/c8/31/b3c831ecff785cbb3e3ec2969ec16f7e.jpg";
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
            source={{ uri: getBannerUri() }}
            onError={() => {
              console.warn("Failed to load image:", job.bannerImageUrl);
              setImageLoadFailed(true);
            }}
            className="w-full h-40 rounded-t-2xl"
            resizeMode="cover"
          />

          {/* Top-right Bookmark (website jobs only) */}
          {job.sourceType === "web" && (
            <TouchableOpacity
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full justify-center items-center shadow-sm"
              onPress={toggleBookmark}
            >
              <Icon name="bookmark" size={18} color="#22C55E" />
            </TouchableOpacity>
          )}

          <View className="absolute -bottom-6 left-5 bg-white p-1.5 rounded-2xl shadow-md border border-slate-200">

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
              style={{}}
            >
              {/* <Text className="text-white text-xs font-bold uppercase tracking-wide">
                {getCategoryLabel(job.category)}
              </Text> */}
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

            {/*View Details or Open External Link */}
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
                router.push({
                  pathname: "/Homepage/jobdescription",
                  params: { id: job.id },
                });
              }}
            >
              <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Apply or Bookmark */}
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
