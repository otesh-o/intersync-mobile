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
import { router, useLocalSearchParams } from "expo-router";

// --- Import Data and Constants ---
import {
  JOBS_DATA, // placeholder until backend is ready // backend
  PROFILE_PIC_URL, // placeholder // backend
  TUTORIAL_STEPS,
  folderIcon,
  homeIcon,
  bookmarkIcon,
} from "../constants/appData";

// --- Import Reusable Components ---
import WelcomeOverlay from "../components/WelcomeOverlay";
import SideMenu from "../components/SideMenu";
import JobCard from "../components/JobCard";
import TutorialOverlay from "../components/TutorialOverlay";

const Homepage = () => {
  const params = useLocalSearchParams();

  // --- State Management ---
  const [isWelcomeActive, setWelcomeActive] = useState(true);
  const [isTutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // job feed (to be replaced by API later) // backend
  const [jobs, setJobs] = useState(JOBS_DATA);

  // saved jobs (to be synced with backend later) // backend
  const [savedJobs, setSavedJobs] = useState([]);

  const [isMenuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  // --- Effects ---
  useEffect(() => {
    if (params.startTutorial === "true") {
      setWelcomeActive(false);
      setTutorialActive(true);
      setTutorialStep(0);
      router.setParams({ startTutorial: null });
    }
  }, [params]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isMenuVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuVisible]);

  // --- Handlers ---
  const handleWelcomeQuickGuide = () => {
    setWelcomeActive(false);
    setTutorialActive(true);
    setTutorialStep(0);
  };

  const handleWelcomeSkip = () => setWelcomeActive(false);

  const handleTutorialNext = () => {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setTutorialActive(false);
    }
  };

  const handleSwipe = (jobId, direction) => {
    if (direction === "right") {
      const jobToSave = jobs.find((job) => job.id === jobId);
      if (jobToSave && !savedJobs.find((saved) => saved.id === jobId)) {
        setSavedJobs((prevSavedJobs) => [
          ...prevSavedJobs,
          { ...jobToSave, savedAt: new Date().toISOString(), status: "saved" },
        ]);
        // later sync with backend // backend
      }
    }
    // remove swiped job
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  const handleBookmarkPress = () => {
    router.push({
      pathname: "/Homepage/saved",
      params: { savedJobs: JSON.stringify(savedJobs) },
    });
    // later this should fetch saved jobs from backend // backend
  };

  const handleMenuToggle = () => setMenuVisible(!isMenuVisible);
  const handleMenuClose = () => setMenuVisible(false);

  return (
    <View className="flex-1">
      <View className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View className="flex-row justify-between items-center bg-slate-50 px-5 pt-[40px] pb-2.5">
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
            <TouchableOpacity className="w-14 h-14 justify-center items-center rounded-full">
              <Image
                source={{ uri: PROFILE_PIC_URL }} // backend
                className="w-12 h-12 rounded-full"
              />
            </TouchableOpacity>
            <View className="flex-1 ml-4 mr-2.5">
              <Text className="text-lg text-gray-500">Hello</Text>
              <Text className="text-2xl font-bold" numberOfLines={1}>
                Emelyn Angga {/* backend: replace with dynamic user name */}
              </Text>
            </View>
            <TouchableOpacity className="relative w-10 h-10 justify-center items-center">
              <Icon name="notifications-outline" size={28} color="#000" />
              <View className="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-[1.5px] border-slate-50" />
              {/* backend: notification count */}
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View className="flex-row items-center bg-slate-50 rounded-3xl mt-6 px-4 border border-gray-300">
            <Icon name="search" size={20} color="#888" />
            <TextInput
              placeholder="Search by job name"
              className="flex-1 h-14 text-base"
              placeholderTextColor="#888"
              // backend: hook into API search
            />
            <TouchableOpacity className="p-2.5">
              <Icon name="options-outline" size={26} color="#000" />
              {/* backend: open filters */}
            </TouchableOpacity>
          </View>

          {/* Job Stack */}
          <View className="flex-1 justify-center items-center mt-5 mb-5">
            {jobs.length === 0 ? (
              <View className="flex-1 justify-center items-center pb-12">
                <Icon name="briefcase-outline" size={80} color="#ccc" />
                <Text className="text-xl font-bold text-gray-500 mt-5 text-center">
                  No more jobs to show!
                </Text>
                <Text className="text-base text-gray-400 mt-2.5 text-center">
                  Check back later
                </Text>
              </View>
            ) : (
              jobs.map((job, index) => {
                const cardStackIndex = jobs.length - 1 - index;
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSwipe={handleSwipe}
                    isTop={index === jobs.length - 1}
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
            <Image
              source={folderIcon}
              className="w-7 h-7"
              resizeMode="contain"
            />
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
      </View>

      {/* Overlays */}
      <SideMenu
        isVisible={isMenuVisible}
        onClose={handleMenuClose}
        slideAnim={slideAnim}
      />
      {isWelcomeActive && (
        <WelcomeOverlay
          onQuickGuide={handleWelcomeQuickGuide}
          onSkip={handleWelcomeSkip}
        />
      )}
      {isTutorialActive && (
        <TutorialOverlay
          currentStep={tutorialStep}
          onNext={handleTutorialNext}
        />
      )}
    </View>
  );
};

export default Homepage;
