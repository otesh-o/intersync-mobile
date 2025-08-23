import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Image, TextInput, Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';

// --- Import Data and Constants ---
// All static data is imported from a central file for easy management.
import {
  JOBS_DATA,
  PROFILE_PIC_URL,
  TUTORIAL_STEPS,
  folderIcon,
  homeIcon,
  bookmarkIcon
} from '../constants/appData';

// --- Import Reusable Components ---
// The UI is built by composing these smaller, focused components.
import WelcomeOverlay from '../components/WelcomeOverlay';
import SideMenu from '../components/SideMenu';
import JobCard from '../components/JobCard';
import TutorialOverlay from '../components/TutorialOverlay';

const Homepage = () => {
  const params = useLocalSearchParams();

  // --- State Management ---
  const [isWelcomeActive, setWelcomeActive] = useState(true);
  const [isTutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [jobs, setJobs] = useState(JOBS_DATA);
  const [savedJobs, setSavedJobs] = useState([]);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  // --- Effects ---
  // Effect to handle deep linking for starting the tutorial
  useEffect(() => {
    if (params.startTutorial === 'true') {
      setWelcomeActive(false);
      setTutorialActive(true);
      setTutorialStep(0);
      router.setParams({ startTutorial: null }); // Clear param after use
    }
  }, [params]);

  // Effect to animate the side menu's visibility
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
    if (direction === 'right') {
      const jobToSave = jobs.find(job => job.id === jobId);
      if (jobToSave && !savedJobs.find(saved => saved.id === jobId)) {
        setSavedJobs(prevSavedJobs => [
          ...prevSavedJobs,
          { ...jobToSave, savedAt: new Date().toISOString(), status: 'saved' }
        ]);
      }
    }
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };

  const handleBookmarkPress = () => {
    router.push({
      pathname: '/Homepage/saved',
      params: { savedJobs: JSON.stringify(savedJobs) }
    });
  };

  const handleMenuToggle = () => setMenuVisible(!isMenuVisible);
  const handleMenuClose = () => setMenuVisible(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.pageContent}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={handleMenuToggle}>
                <Icon name="menu" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>INTERN SYNC</Text>
            <View style={{width: 40}} />
        </View>

        <View style={styles.contentWrapper}>
            <View style={styles.welcomeSection}>
              <TouchableOpacity style={styles.profilePicContainer}>
                <Image source={{uri: PROFILE_PIC_URL}} style={styles.profilePic} />
              </TouchableOpacity>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.helloText}>Hello</Text>
                <Text style={styles.userName} numberOfLines={1}>Evelyn Ang</Text>
              </View>
              <TouchableOpacity style={styles.notificationBell}>
                  <Icon name="notifications-outline" size={28} color="#000" />
                  <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput 
                placeholder="Search by job name" 
                style={styles.searchInput} 
                placeholderTextColor="#888"
              />
              <TouchableOpacity style={styles.filterButton}>
                <Icon name="options-outline" size={26} color="#000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardContainer}>
              {jobs.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="briefcase-outline" size={80} color="#ccc" />
                  <Text style={styles.emptyStateText}>No more jobs to show!</Text>
                  <Text style={styles.emptyStateSubtext}>Check back later</Text>
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
                        zIndex: index + 1,
                        transform: [
                          { scale: 1 - cardStackIndex * 0.02 },
                          { translateY: cardStackIndex * -5 }
                        ]
                      }}
                    />
                  );
                }).reverse()
              )}
            </View>
        </View>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navButton}>
            <Image source={folderIcon} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Image source={homeIcon} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleBookmarkPress}>
            <Image source={bookmarkIcon} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Overlays are rendered on top of the main page content */}
      <SideMenu isVisible={isMenuVisible} onClose={handleMenuClose} slideAnim={slideAnim} />
      {isWelcomeActive && <WelcomeOverlay onQuickGuide={handleWelcomeQuickGuide} onSkip={handleWelcomeSkip} />}
      {isTutorialActive && <TutorialOverlay currentStep={tutorialStep} onNext={handleTutorialNext} />}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  pageContent: { flex: 1, backgroundColor: '#F9F9F9' },
  contentWrapper: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: 20, backgroundColor: '#F9F9F9' },
  headerButton: { padding: 5 },
  headerTitle: { fontFamily: 'ClaireNewsBold', fontSize: 26, letterSpacing: 1 },
  welcomeSection: { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
  profilePicContainer: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  profilePic: { width: 50, height: 50, borderRadius: 25 },
  welcomeTextContainer: { flex: 1, marginLeft: 15, marginRight: 10 },
  helloText: { fontSize: 18, color: '#888' },
  userName: { fontSize: 24, fontWeight: 'bold' },
  notificationBell: { position: 'relative', width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  notificationDot: { position: 'absolute', right: 2, top: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: 'red', borderWidth: 1.5, borderColor: '#F9F9F9' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 15, marginTop: 25, paddingHorizontal: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 55, fontSize: 16 },
  filterButton: { padding: 10 },
  cardContainer: { flex: 1, marginTop: 20, marginBottom: 20, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50 },
  emptyStateText: { fontSize: 20, fontWeight: 'bold', color: '#888', marginTop: 20, textAlign: 'center' },
  emptyStateSubtext: { fontSize: 16, color: '#aaa', marginTop: 10, textAlign: 'center' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 75, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 10 },
  navButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { width: 28, height: 28, resizeMode: 'contain' },
});

export default Homepage;
