// app/components/JobCard.js
import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import { PanGestureHandler, State } from "react-native-gesture-handler";

/**
 * @param {object} props - Component props.
 * @param {object} props.job - The job data object to display.
 * @param {(id: number, direction: 'left' | 'right') => void} props.onSwipe - Callback when a card is swiped off-screen.
 * @param {boolean} props.isTop - True if this is the topmost, interactive card.
 * @param {object} props.style - Additional styles for the card container.
 */
const JobCard = ({ job, onSwipe, isTop, style = {} }) => {
  const { width } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Rotate card slightly during horizontal drag
  const rotate = translateX.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ["-12deg", "0deg", "12deg"],
    extrapolate: "clamp",
  });

  // Handle gesture events
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = event.nativeEvent;
      const swipeThreshold = width * 0.25; // 25% of screen width

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
        }).start(() => onSwipe(job.id, direction));
      } else {
        // Reset position if not swiped far enough
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

  // Simulate button press with animation
  const handleButtonPress = (direction) => {
    const toValue = direction === "right" ? width * 1.5 : -width * 1.5;
    Animated.timing(translateX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onSwipe(job.id, direction));
  };

  // Map category to label
  const getCategoryLabel = (category) => {
    switch (category) {
      case "internships":
        return "Internship";
      case "volunteer":
        return "Volunteer";
      case "scholarships":
        return "Scholarship";
      default:
        return "Opportunity";
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      enabled={isTop} // Only top card is draggable
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
            source={{ uri: job.image }}
            className="w-full h-40 rounded-t-2xl"
          />

          {/* Decorative icon badge */}
          <View className="absolute -bottom-6 left-5 bg-white p-2 rounded-2xl shadow-md">
            <View
              className="w-12 h-12 bg-slate-600 rounded-xl overflow-hidden"
              style={{ transform: [{ rotate: "45deg" }] }}
            >
              <View className="absolute top-[23px] -left-2.5 w-[70px] h-1 bg-white" />
            </View>
          </View>
        </View>

        {/* Job Details */}
        <View className="p-5 pt-10">
          {/* Title & Category Badge */}
          <View className="flex-row justify-between items-start mb-1">
            <Text
              className="text-2xl font-bold text-slate-800 flex-1"
              numberOfLines={1}
            >
              {job.title}
            </Text>

            <View
              className="px-2.5 py-1 rounded-full ml-2"
              style={{ backgroundColor: "#22C55E" }} // Vibrant green
            >
              <Text className="text-white text-xs font-bold uppercase tracking-wide">
                {getCategoryLabel(job.category)}
              </Text>
            </View>
          </View>

          {/* Company & Location */}
          <Text className="text-base text-slate-500 mt-1">
            {job.company} - {job.location}
          </Text>

          {/* Salary */}
          {job.salary ? (
            <Text className="text-base font-bold text-slate-700 mt-1">
              {job.salary}
            </Text>
          ) : null}

          {/* Tags */}
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
          </View>

          {/* Description */}
          <Text
            className="text-sm text-slate-600 mt-4 leading-relaxed"
            numberOfLines={2}
          >
            {job.description || "No description available for this position."}
          </Text>
        </View>

        {/* Action Buttons (only visible on top card) */}
        {isTop && (
          <View className="flex-row justify-evenly pt-2 pb-5">
            {/* ❌ Dislike / Skip */}
            <TouchableOpacity
              className="w-14 h-14 justify-center items-center rounded-full bg-red-400 shadow-md"
              onPress={() => handleButtonPress("left")}
            >
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>

            {/* ➕ View Details */}
            <TouchableOpacity
              className="w-14 h-14 justify-center items-center rounded-full bg-slate-800 shadow-md"
              onPress={() => router.push(`/jobdescription/${job.id}`)}
            >
              <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>

            {/* ✅ Save / Bookmark */}
            <TouchableOpacity
              className="w-14 h-14 justify-center items-center rounded-full shadow-md"
              style={{ backgroundColor: "#22C55E" }}
              onPress={() => handleButtonPress("right")}
            >
              <Icon name="bookmark" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default JobCard;
