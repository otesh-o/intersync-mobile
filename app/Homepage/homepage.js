// app/screens/Homepage.js
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import JobCard from "../components/JobCard";
import ProfileSetupModal from "../components/ProfileSetupModal";
import SideMenu from "../components/SideMenu";
import { bookmarkIcon, folderIcon, homeIcon } from "../constants/appData";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobsContext";
import { useProfile } from "../context/ProfileContext";
import { useSavedJobs } from "../context/SavedJobsContext";
import { api } from "../services/api"; // 👈 ADDED

const Homepage = () => {
  const insets = useSafeAreaInsets();
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const { jobs, isLoading: jobsLoading, currentMode, changeMode } = useJobs();
  const { savedJobs, setSavedJobs } = useSavedJobs();
  const { name: profileName, profilePicUrl } = useProfile();
  const { token } = useAuth;
  const [displayedJobs, setDisplayedJobs] = useState([]);

  const { showTutorial: showTutorialParam } = useLocalSearchParams();

  useEffect(() => {
    if (!jobsLoading && Array.isArray(jobs)) {
      if (!searchQuery.trim()) {
        setDisplayedJobs([...jobs]);
      } else {
        const query = searchQuery.toLowerCase().trim();
        console.log("Searching for:", query);

        const filtered = jobs.filter((job) => {
          const title = job.title?.toLowerCase() || "";
          const company =
            (typeof job.company === "object"
              ? job.company.name
              : job.company
            )?.toLowerCase() || "";
          const location = job.location?.toLowerCase() || "";
          const jobType = job.jobType?.toLowerCase() || "";
          const labels = (job.labels || []).join(" ").toLowerCase();

          const matches =
            title.includes(query) ||
            company.includes(query) ||
            location.includes(query) ||
            jobType.includes(query) ||
            labels.includes(query);

          return matches;
        });

        console.log(`Search results: ${filtered.length} jobs found`);

        // Log properties of each matched job
        filtered.forEach((job, index) => {
          console.log(`\n--- Job ${index + 1} ---`);
          console.log("ID:", job.id);
          console.log("Title:", job.title);
          console.log("Source Type:", job.sourceType);
          console.log(
            "Company:",
            typeof job.company === "object" ? job.company.name : job.company
          );
          console.log("Location:", job.location);
          console.log("Category:", job.category);
          console.log("Job Type:", job.jobType);

          console.log("Full job object:", JSON.stringify(job, null, 2));
        });

        setDisplayedJobs(filtered);
      }
    }
  }, [jobs, jobsLoading, searchQuery]);

  useEffect(() => {
    if (showTutorialParam === "true") {
      setShowTutorial(true);
    }
  }, [showTutorialParam]);

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isMenuVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuVisible]);

  //mark job as seen
  const handleSwipe = async (jobId, direction) => {
    const jobToSave = jobs.find((job) => job.id === jobId);

    //Only auto-save if it's a CSV job (or explicitly bookmarked)
    if (
      direction === "right" &&
      jobToSave &&
      jobToSave.sourceType === "csv" &&
      !savedJobs.some((s) => s.id === jobId)
    ) {
      setSavedJobs((prev) => [
        ...prev,
        { ...jobToSave, savedAt: new Date().toISOString() },
      ]);
    }

    try {
      await api("/v1/job/seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          action: direction === "right" ? "engaged" : "dismissed",
        }),
      });
    } catch (error) {
      console.warn("Failed to mark job as seen:", error);
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

      <View
        className="flex-row items-center bg-slate-50 px-4"
        style={{ paddingTop: insets.top + 8, paddingBottom: 10 }}
      >
        <TouchableOpacity
          className="p-2"
          style={{ zIndex: 10 }}
          onPress={handleMenuToggle}
        >
          <Icon name="menu" size={26} color="#000" />
        </TouchableOpacity>

        <View className="flex-1 items-center max-w-xs">
          <Image
            source={require("../../assets/images/Internsync-black.png")}
            className="w-full h-16"
            resizeMode="contain"
          />
        </View>

        <View className="w-10" />
      </View>

      <View className="flex-1 px-4">
        <View className="flex-row items-center mt-4">
          <TouchableOpacity
            className="w-14 h-14 justify-center items-center rounded-full overflow-hidden"
            onPress={() => router.push("../profile_page/MainProfile")}
          >
            {profilePicUrl ? (
              <Image
                source={{ uri: profilePicUrl }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full rounded-full bg-blue-500 justify-center items-center">
                <Text className="text-white text-lg font-bold">
                  {profileName?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View className="flex-1 ml-4 mr-2">
            <Text className="text-base text-gray-500">Hello</Text>
            <Text className="text-xl font-bold" numberOfLines={1}>
              {profileName || "User"}
            </Text>
          </View>

          <TouchableOpacity
            className="relative w-10 h-10 justify-center items-center"
            onPress={handlenotificationsPress}
          >
            <Icon name="notifications-outline" size={24} color="#000" />
            <View className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-[1.5px] border-white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center bg-slate-50 rounded-2xl mt-4 px-3 py-2 border border-gray-300">
          <Icon name="search" size={18} color="#888" />
          <TextInput
            placeholder="Search by job name"
            className="flex-1 ml-2 text-base"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Icon name="options-outline" size={22} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-1 justify-center items-center mt-4 mb-4">
          {jobsLoading ? (
            <View className="flex-1 justify-center items-center pb-16">
              <ActivityIndicator size="large" color="#000" />
              <Text className="text-base text-gray-600 mt-3">
                Loading {currentMode}...
              </Text>
            </View>
          ) : displayedJobs.length === 0 ? (
            <View className="flex-1 justify-center items-center pb-16">
              <Icon name="search" size={50} color="#ccc" />
              <Text className="text-lg font-bold text-gray-500 mt-4 text-center">
                No matching jobs
              </Text>
              <Text className="text-sm text-gray-400 mt-2 text-center">
                Try a different search term
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
                      { scale: 1 - cardStackIndex * 0.04 },
                      { translateY: cardStackIndex * 12 },
                    ],
                  }}
                />
              );
            })
          )}
        </View>
      </View>

      <View
        className="flex-row justify-around items-center bg-white border-t border-slate-200 pb-2"
        style={{ height: 70, paddingTop: 8 }}
      >
        <TouchableOpacity
          className="flex-1 items-center justify-center"
          onPress={handleApplicationTrackerPress}
        >
          <Image source={folderIcon} className="w-6 h-6" resizeMode="contain" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 items-center justify-center">
          <Image source={homeIcon} className="w-6 h-6" resizeMode="contain" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center justify-center"
          onPress={handleBookmarkPress}
        >
          <Image
            source={bookmarkIcon}
            className="w-6 h-6"
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

      <Modal
        transparent
        visible={showTutorial}
        animationType="fade"
        onRequestClose={closeTutorial}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <Text className="text-gray-600 text-center mb-5 leading-relaxed">
              Swipe right or tap the checkmark to quick apply.
              {"\n"}❌ Swipe left or tap the X to skip.
            </Text>
            <TouchableOpacity
              className="bg-black rounded-full py-3 mx-auto w-4/5"
              onPress={closeTutorial}
            >
              <Text className="text-white text-center font-bold">
                Start getting offers!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Homepage;
