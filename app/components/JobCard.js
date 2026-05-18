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

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "tech": return "#3B82F6";
      case "design": return "#EC4899";
      case "marketing": return "#F59E0B";
      case "business": return "#10B981";
      default: return "#6366F1";
    }
  };

  const getCategoryLabel = (category) => {
    if (!category) return "Internship";
    return category.charAt(0).toUpperCase() + category.slice(1);
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

      const payload = {
        applicantName: profileName || "",
        portfolioUrl: "",
        resumeUrl: resumeUrl,
        text: `I'm excited to apply for the ${job.title} role at ${typeof job.company === "object"
            ? job.company.name
            : job.company || "this organization"
          }.`,
      };

      await api(`/v1/application/job/${jobId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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
          duration: 180,
          useNativeDriver: true,
        }).start(() => {
          onSwipe(job.id, direction);
        });
      } else {
        Animated.parallel([
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 100, friction: 8 }),
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 100, friction: 8 }),
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
    }).start(() => {
      onSwipe(job.id, direction);
    });
  };

  const getActionIcon = () => {
    return job.sourceType === "web" ? "checkmark" : "bookmark";
  };

  const getBannerUri = () => {
    if (!imageLoadFailed) {
      const logoUrl = typeof job.company === "object" ? job.company?.logoUrl : null;
      if (logoUrl?.trim()) return logoUrl.trim();
      if (job.bannerImageUrl?.trim()) return job.bannerImageUrl.trim();
    }
    return "https://i.pinimg.com/736x/b3/c8/31/b3c831ecff785cbb3e3ec2969ec16f7e.jpg";
  };

  const cleanText = (text) => {
    if (!text) return "";
    return text
      .replace(/[*#_>"`~|\[\]\(\)!]+/g, "")
      .replace(/^\s*[-•*+]\s*/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
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
        <View className="relative">
          <Image
            source={{ uri: getBannerUri() }}
            onError={() => setImageLoadFailed(true)}
            className="w-full h-52 rounded-t-2xl"
            resizeMode="cover"
          />

          {job.sourceType === "web" && (
            <TouchableOpacity
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full justify-center items-center shadow-sm"
              onPress={toggleBookmark}
            >
              <Icon name="bookmark" size={18} color="#22C55E" />
            </TouchableOpacity>
          )}
        </View>

        <View className="p-5 pt-4">
          <View className="flex-row justify-between items-start mb-1">
            <Text className="text-2xl font-bold text-slate-800 flex-1" numberOfLines={1}>
              {job.title}
            </Text>
            <View className="px-2.5 py-1 rounded-full ml-2" style={{ backgroundColor: getCategoryColor(job.category) }}>
              <Text className="text-white text-xs font-bold uppercase tracking-wide">
                {getCategoryLabel(job.category)}
              </Text>
            </View>
          </View>

          <Text className="text-base text-slate-500 mt-1">
            {(typeof job.company === "object" ? job.company.name : job.company) || "Organization"} - {job.location}
          </Text>

          <Text className="text-sm text-slate-600 mt-4 leading-relaxed" numberOfLines={4}>
            {typeof job.description === "string"
              ? cleanText(job.description)
              : typeof job.description === "object"
                ? cleanText(job.description.details || job.description.summary) || "No description available."
                : "No description available."}
          </Text>
        </View>

        {isTop && (
          <View className="flex-row justify-evenly pt-2 pb-5">
            <TouchableOpacity
              className="w-14 h-14 justify-center items-center rounded-full bg-red-400"
              style={{ elevation: 5, shadowOpacity: 0.3 }}
              onPress={() => handleButtonPress("left")}
            >
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-14 h-14 justify-center items-center rounded-full bg-slate-800"
              style={{ elevation: 5, shadowOpacity: 0.3 }}
              onPress={() => {
                router.push({
                  pathname: "/Homepage/jobdescription",
                  params: { id: job.id },
                });
              }}
            >
              <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-14 h-14 justify-center items-center rounded-full bg-green-500"
              style={{ elevation: 5, shadowOpacity: 0.3 }}
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
