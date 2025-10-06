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
  ActivityIndicator,
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
  const [isMenuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const { jobs, isLoading: jobsLoading, currentMode, changeMode } = useJobs();
  const { savedJobs, setSavedJobs } = useSavedJobs();
  const { name: profileName, profilePicUrl } = useProfile();
  const { token } = useAuth;
  const [displayedJobs, setDisplayedJobs] = useState([]);

  useEffect(() => {
    if (!jobsLoading && Array.isArray(jobs)) {
      setDisplayedJobs([...jobs]);
    }
  }, [jobs, jobsLoading]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isMenuVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuVisible]); 

  
  const handleSwipe = (jobId, direction) => {
    const jobToSave = jobs.find((job) => job.id === jobId);

    if (
      direction === "right" &&
      jobToSave &&
      !savedJobs.some((s) => s.id === jobId)
    ) {
      setSavedJobs((prev) => [
        ...prev,
        { ...jobToSave, savedAt: new Date().toISOString() },
      ]);
    }

    setDisplayedJobs((prev) => prev.filter((job) => job.id !== jobId));
  };


    const handlenotificationsPress = () => {
      router.push("/Homepage/notifications");
    };  


    const handleApplicationTrackerPress = () => {
      router.push("/Homepage/ApplicationTracker");
    };


  const handleBookmarkPress = () => {
    router.push("/Homepage/saved");
  };

  const handleMenuToggle = () => setMenuVisible((prev) => !prev);
  const handleMenuClose = () => setMenuVisible(false);

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center bg-slate-50 px-5 pt-[30px] pb-2.5 relative">
        {/* Menu Button - Left */}
        <TouchableOpacity className="p-1.5 z-10" onPress={handleMenuToggle}>
          <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>

        {/* Logo - Centered */}
        <Image
          source={require("../../assets/images/Internsync-black.png")}
          className="absolute left-0 right-0 w-40 h-10 mx-auto"
          resizeMode="contain"
        />

        {/* Empty view for layout balance */}
        <View className="w-10" />
      </View>

      <View className="flex-1 px-5">
        <View className="flex-row items-center mt-5">
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

          <TouchableOpacity
            className="relative w-10 h-10 justify-center items-center"
            onPress={handlenotificationsPress}
          >
            <Icon name="notifications-outline" size={28} color="#000" />
            <View className="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-[1.5px] border-slate-50" />
          </TouchableOpacity>
        </View>

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

        <View className="flex-1 justify-center items-center mt-5 mb-5">
          {jobsLoading ? (
            <View className="flex-1 justify-center items-center pb-12">
              <ActivityIndicator size="large" color="#000" />
              <Text className="text-lg text-gray-600 mt-4">
                Loading {currentMode}...
              </Text>
            </View>
          ) : displayedJobs.length === 0 ? (
            <View className="flex-1 justify-center items-center pb-12">
              <Icon name="refresh" size={60} color="#ccc" />
              <Text className="text-xl font-bold text-gray-500 mt-5 text-center">
                No more jobs
              </Text>
              <Text className="text-base text-gray-400 mt-2.5 text-center">
                Check back later for new opportunities
              </Text>
            </View>
          ) : (
            displayedJobs.map((job, index) => {
              const isTop = index === displayedJobs.length - 1;
              const cardStackIndex = displayedJobs.length - 1 - index;
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

      <View className="flex-row justify-around items-center bg-white h-[75px] border-t border-slate-200 pb-2.5">
        <TouchableOpacity
          className="flex-1 items-center justify-center"
          onPress={handleApplicationTrackerPress}
        >
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

      <SideMenu
        isVisible={isMenuVisible}
        onClose={handleMenuClose}
        slideAnim={slideAnim}
        onModeChange={changeMode}
        currentMode={currentMode}
      />

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
