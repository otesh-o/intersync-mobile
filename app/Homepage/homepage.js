import * as SecureStore from "expo-secure-store";
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

import { Ionicons as Icon } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import JobCard from "../components/JobCard";
import ProfileSetupModal from "../components/ProfileSetupModal";
import SideMenu from "../components/SideMenu";
import { bookmarkIcon, folderIcon, homeIcon } from "../constants/appData";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobsContext";
import { useProfile } from "../context/ProfileContext";
import { useSavedJobs } from "../context/SavedJobsContext";
import { api } from "../services/api"; // ADDED

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
  const { token, isPremium } = useAuth();
  const [displayedJobs, setDisplayedJobs] = useState([]);

  // Limit Tracking
  const [rightSwipesToday, setRightSwipesToday] = useState(0);
  const [totalSwipesToday, setTotalSwipesToday] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [resetTimestamp, setResetTimestamp] = useState(null);

  const SWIPE_LIMIT = 20;
  const APP_LIMIT = 2; // "2 applications" (right swipes)

  useEffect(() => {
    const updateCountdown = () => {
      if (!resetTimestamp) return;

      const now = new Date();
      const diff = resetTimestamp - now;

      if (diff <= 0) {
        setTimeRemaining("0h 0m");
        // Logic to clear limits once timer runs out
        handleResetLimits();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(`${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [resetTimestamp]);

  const handleResetLimits = async () => {
    await SecureStore.deleteItemAsync('limit_reset_at');
    await SecureStore.setItemAsync('right_swipes', '0');
    await SecureStore.setItemAsync('total_swipes', '0');
    setRightSwipesToday(0);
    setTotalSwipesToday(0);
    setIsLimitReached(false);
    setResetTimestamp(null);
  };

  useEffect(() => {
    const checkLimits = async () => {
      const storedResetAt = await SecureStore.getItemAsync('limit_reset_at');

      if (storedResetAt) {
        const resetAt = parseInt(storedResetAt);
        if (Date.now() > resetAt) {
          // Window has expired
          await handleResetLimits();
        } else {
          // Still in window
          setResetTimestamp(new Date(resetAt));
          const right = parseInt(await SecureStore.getItemAsync('right_swipes') || '0');
          const total = parseInt(await SecureStore.getItemAsync('total_swipes') || '0');
          setRightSwipesToday(right);
          setTotalSwipesToday(total);
          if (right >= APP_LIMIT || total >= SWIPE_LIMIT) {
            setIsLimitReached(true);
          }
        }
      }
    };
    checkLimits();
  }, []);

  const { showTutorial: showTutorialParam } = useLocalSearchParams();

  useEffect(() => {
    if (!jobsLoading && Array.isArray(jobs)) {
      if (!searchQuery.trim()) {
        setDisplayedJobs([...jobs]);
      } else {
        const query = searchQuery.toLowerCase().trim();

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

    // Update limits
    const newTotal = totalSwipesToday + 1;
    const newRight = direction === "right" ? rightSwipesToday + 1 : rightSwipesToday;

    setTotalSwipesToday(newTotal);
    setRightSwipesToday(newRight);

    // Set countdown timestamp on first swipe of the window
    if (!resetTimestamp) {
      const newResetAt = Date.now() + 24 * 60 * 60 * 1000;
      await SecureStore.setItemAsync('limit_reset_at', newResetAt.toString());
      setResetTimestamp(new Date(newResetAt));
    }

    await SecureStore.setItemAsync('total_swipes', newTotal.toString());
    await SecureStore.setItemAsync('right_swipes', newRight.toString());

    if (newRight >= APP_LIMIT || newTotal >= SWIPE_LIMIT) {
      setIsLimitReached(true);
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
        className="flex-row items-center justify-between bg-slate-50 px-4"
        style={{ paddingTop: insets.top + 8, paddingBottom: 10 }}
      >
        <TouchableOpacity
          className="p-2"
          onPress={handleMenuToggle}
        >
          <Icon name="menu" size={26} color="#000" />
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/Internsync-black.png")}
          style={{ width: 150, height: 40 }}
          resizeMode="contain"
        />

        <TouchableOpacity
          className="relative p-2"
          onPress={handlenotificationsPress}
        >
          <Icon name="notifications-outline" size={24} color="#000" />
          <View className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-[1.5px] border-white" />
        </TouchableOpacity>
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

          <View className="flex-1 ml-4">
            <Text className="text-base text-gray-500">Hello</Text>
            <Text className="text-xl font-bold" numberOfLines={1}>
              {profileName || "User"}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center bg-[#F1F1F1] rounded-full mt-4 px-4 py-2">
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
          ) : (isLimitReached && !isPremium) ? (
            /* Limit Reached View — Matches Screenshot */
            <View className="bg-white rounded-[32px] p-8 w-full items-center shadow-lg border border-gray-100">
              {/* Lock Icon */}
              <View className="w-16 h-16 rounded-full bg-[#E8F5E9] items-center justify-center mb-6">
                <Icon name="lock-closed" size={30} color="#4CAF50" />
              </View>

              <Text
                className="text-center text-slate-900 mb-2 text-3xl font-bold"
              >
                You're out of internships
              </Text>

              <Text className="text-gray-500 text-center text-sm mb-10 leading-relaxed px-4">
                You've reached your daily limit for the free plan. Upgrade to Unlimited to discover more opportunities.
              </Text>

              {/* Stats Grid */}
              <View className="flex-row gap-4 mb-10">
                <View className="flex-1 bg-[#F8F9FA] rounded-2xl p-5 items-center">
                  <Text className="text-slate-900 text-2xl font-bold">
                    {totalSwipesToday}
                  </Text>
                  <Text className="text-gray-400 text-[10px] text-center mt-1">Internships{"\n"}viewed</Text>
                </View>
                <View className="flex-1 bg-[#F8F9FA] rounded-2xl p-5 items-center">
                  <Text className="text-slate-900 text-2xl font-bold">
                    0
                  </Text>
                  <Text className="text-gray-400 text-[10px] text-center mt-1">Remaining{"\n"}today</Text>
                </View>
              </View>

              {/* Upgrade Button */}
              <TouchableOpacity
                onPress={() => router.push("/payment_plan/plan")}
                className="bg-black w-full py-4 rounded-2xl items-center mb-4 shadow-sm"
              >
                <Text className="text-white font-bold text-base">Upgrade to Unlimited</Text>
              </TouchableOpacity>

              <Text className="text-gray-400 text-xs mt-2">
                Resets in <Text className="font-bold text-gray-500">{timeRemaining}</Text>
              </Text>
            </View>
          ) : displayedJobs.length === 0 ? (
            <View className="flex-1 justify-center items-center pb-16">
              <Icon name={searchQuery ? "search" : "briefcase-outline"} size={50} color="#ccc" />
              <Text className="text-lg font-bold text-gray-500 mt-4 text-center">
                {searchQuery ? "No matching jobs" : `No ${currentMode} yet`}
              </Text>
              {searchQuery && (
                <Text className="text-sm text-gray-400 mt-2 text-center">
                  Try a different search term
                </Text>
              )}
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
              {"\n"}Swipe left or tap the X to skip.
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
