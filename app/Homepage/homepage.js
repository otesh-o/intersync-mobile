// app/screens/Homepage.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";

import { folderIcon, homeIcon, bookmarkIcon } from "../constants/appData";

import SideMenu from "../components/SideMenu";
import JobCard from "../components/JobCard";
import ProfileSetupModal from "../components/ProfileSetupModal";

import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { useSavedJobs } from "../context/SavedJobsContext";
import { useJobs } from "../context/JobsContext";

const Homepage = () => {
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [currentMode, setCurrentMode] = useState("internships"); // Filter mode
  const [isMenuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const { jobs, setJobs } = useJobs(); // Full job list
  const { savedJobs, setSavedJobs } = useSavedJobs();

  // ✅ Get name and profilePicUrl from context
  const { name: profileName, profilePicUrl } = useProfile();
  const { token } = useAuth();

  // Filter jobs based on current mode
  const filteredJobs = jobs.filter((job) => job.category === currentMode);

  // Animate sidebar in/out
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isMenuVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuVisible]);

  // ✅ Handle swipe: save on right, skip on left
  const handleSwipe = (jobId, direction) => {
    const jobToSave = jobs.find((job) => job.id === jobId);

    if (direction === "right" && jobToSave) {
      if (!savedJobs.find((saved) => saved.id === jobId)) {
        setSavedJobs((prev) => [
          ...prev,
          { ...jobToSave, savedAt: new Date().toISOString(), status: "saved" },
        ]);
      }
    }

    // Remove from current jobs list
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  const handleBookmarkPress = () => {
    router.push("/Homepage/saved");
  };

  const handleMenuToggle = () => setMenuVisible(!isMenuVisible);
  const handleMenuClose = () => setMenuVisible(false);

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center bg-slate-50 px-5 pt-[30px] pb-2.5">
        <TouchableOpacity className="p-1.5" onPress={handleMenuToggle}>
          <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>
        <Text
          className="text-[24px] tracking-wider"
          style={{ fontFamily: "ClaireNewsBold" }}
        >
          INTERN SYNC
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Body */}
      <View className="flex-1 px-5">
        {/* User Info */}
        <View className="flex-row items-center mt-5">
          {/* ✅ Profile Picture from Backend */}
          <TouchableOpacity
            className="w-14 h-14 justify-center items-center rounded-full overflow-hidden"
            onPress={() => router.push("../profile_page/MainProfile")}
          >
            {profilePicUrl ? (
              <Image
                source={{ uri: profilePicUrl }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                }}
                resizeMode="cover"
              />
            ) : (
              // Fallback: Show initials or default avatar
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#007AFF",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  {profileName?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View className="flex-1 ml-4 mr-2.5">
            <Text className="text-lg text-gray-500">Hello</Text>
            <Text className="text-2xl font-bold" numberOfLines={1}>
              {profileName || "User"}
            </Text>
          </View>

          <TouchableOpacity className="relative w-10 h-10 justify-center items-center">
            <Icon name="notifications-outline" size={28} color="#000" />
            <View className="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-[1.5px] border-slate-50" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-slate-50 rounded-3xl mt-6 px-4 border border-gray-300">
          <Icon name="search" size={20} color="#888" />
          <TextInput
            placeholder="Search by job name"
            className="flex-1 h-14 text-base"
            placeholderTextColor="#888"
          />
          <TouchableOpacity className="p-2.5">
            <Icon name="options-outline" size={26} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Job Stack */}
        <View className="flex-1 justify-center items-center mt-5 mb-5">
          {filteredJobs.length === 0 ? (
            <View className="flex-1 justify-center items-center pb-12">
              <Icon name="alert-circle-outline" size={60} color="#ccc" />
              <Text className="text-xl font-bold text-gray-500 mt-5 text-center capitalize">
                No {currentMode} found
              </Text>
              <Text className="text-base text-gray-400 mt-2.5 text-center">
                Try another category or check back later
              </Text>
            </View>
          ) : (
            filteredJobs.map((job, index) => {
              const isTop = index === filteredJobs.length - 1;
              const cardStackIndex = filteredJobs.length - 1 - index;
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  onSwipe={handleSwipe}
                  isTop={isTop}
                  style={{
                    position: "absolute",
                    zIndex: index + 1,
                    transform: [
                      { scale: 1 - cardStackIndex * 0.05 },
                      { translateY: cardStackIndex * 15 },
                    ],
                  }}
                />
              );
            })
          )}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center bg-white h-[75px] border-t border-slate-200 pb-2.5">
        <TouchableOpacity className="flex-1 items-center justify-center">
          <Image source={folderIcon} className="w-7 h-7" resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center justify-center">
          <Image source={homeIcon} className="w-7 h-7" resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 items-center justify-center"
          onPress={handleBookmarkPress}
        >
          <Image
            source={bookmarkIcon}
            className="w-7 h-7"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Side Menu */}
      <SideMenu
        isVisible={isMenuVisible}
        onClose={handleMenuClose}
        slideAnim={slideAnim}
        onModeChange={handleModeChange}
        currentMode={currentMode}
      />

      {/* Profile Setup Modal - Show only if needed */}
      {isProfileModalVisible && (
        <ProfileSetupModal
          isVisible={isProfileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          onSetup={() => {
            setProfileModalVisible(false);
            router.push("/profile_page/MainProfile");
          }}
        />
      )}
    </View>
  );
};

export default Homepage;
