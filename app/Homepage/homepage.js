// ========================================================================
// FILE: app/Homepage/hp.js
// This version integrates the "Let's get you started" overlay into the homepage
// similar to how the tutorial overlay works, showing on first visit
// ========================================================================
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, ScrollView, TextInput, useWindowDimensions, Animated, Keyboard, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

// --- Import Custom Assets ---
const arrowVector = require('../../assets/images/Vector.png');
const folderIcon = require('../../assets/images/foldericon.png');
const homeIcon = require('../../assets/images/homeicon.png');
const bookmarkIcon = require('../../assets/images/bookmark.png');

// --- Mock Data ---
const JOBS = [
  { id: 1, title: 'Software Engineer', company: 'Linear', location: 'Jakarta, ID', salary: '$50 - $75 / Mo', image: 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, title: 'Product Manager', company: 'Stripe', location: 'San Francisco, CA', salary: '$120 - $150 / k', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop' },
  { id: 3, title: 'UX Designer', company: 'Figma', location: 'Remote', salary: '$90 - $110 / k', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop' },
  { id: 4, title: 'Frontend Developer', company: 'Vercel', location: 'Remote', salary: '$80 - $100 / k', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, title: 'Backend Developer', company: 'Supabase', location: 'London, UK', salary: '$85 - $105 / k', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop' },
  { id: 6, title: 'Data Scientist', company: 'OpenAI', location: 'San Francisco, CA', salary: '$130 - $160 / k', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' },
];
const PROFILE_PIC_URL = 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop';
const CARD_BACKGROUND_URL = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop';

// Global state for saved jobs (in a real app, this would be in a state management solution)
let savedJobs = [];

// --- Welcome Overlay Component ---
const WelcomeOverlay = ({ onQuickGuide, onSkip }) => {
  // Dismiss keyboard when welcome overlay is active
  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <View style={styles.overlay}>
      <View style={styles.welcomeModalContainer}>
        <ImageBackground
          source={{ uri: CARD_BACKGROUND_URL }}
          style={styles.cardBackground}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={styles.cardTextContainer}>
            <Text style={styles.modalTitle}>Let's get you ready !</Text>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle} />
            </View>
            <Text style={styles.modalSubtitle}>Find Your Perfect Opportunity!</Text>
          </View>
        </ImageBackground>

        <TouchableOpacity
          style={styles.guideButton}
          onPress={onQuickGuide}
        >
          <Text style={styles.guideButtonText}>Quick Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Side Menu Component ---
const SideMenu = ({ isVisible, onClose, slideAnim }) => {
  const menuItems = [
    { id: 'internships', icon: 'wifi-outline', title: 'Internships' },
    { id: 'activity', icon: 'grid-outline', title: 'Activity' },
    { id: 'volunteer', icon: 'heart-outline', title: 'Volunteer' },
  ];

  const handleMenuItemPress = (itemId) => {
    console.log(`Menu item pressed: ${itemId}`);
    onClose();
    // Add navigation logic here based on itemId
  };

  return (
    <>
      {/* Backdrop */}
      {isVisible && (
        <TouchableOpacity 
          style={styles.menuBackdrop} 
          onPress={onClose}
          activeOpacity={1}
        />
      )}
      
      {/* Side Menu */}
      <Animated.View
        style={[
          styles.sideMenu,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Header Section */}
        <View style={styles.menuHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.menuTitle}>InternSync</Text>
        </View>

        {/* User Profile Section */}
        <View style={styles.menuProfileSection}>
          <Image source={{ uri: PROFILE_PIC_URL }} style={styles.menuProfilePic} />
          <View style={styles.menuProfileInfo}>
            <Text style={styles.menuGreeting}>Hello</Text>
            <Text style={styles.menuUserName}>Emelyn Angga</Text>
          </View>
        </View>

        {/* Menu Items - White Background Section */}
        <View style={styles.menuWhiteSection}>
          <View style={styles.menuItemsContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item.id)}
              >
                <View style={styles.menuItemIconContainer}>
                  <Icon 
                    name={item.icon} 
                    size={22} 
                    color="#718096" 
                  />
                </View>
                <Text style={styles.menuItemText}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    </>
  );
};

// --- Reusable Job Card Component ---
const JobCard = ({ job, onSwipe, isTop, style = {} }) => {
  const { width } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = translateX.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  const opacity = translateX.interpolate({
    inputRange: [-width / 2, -50, 0, 50, width / 2],
    outputRange: [0.8, 1, 1, 1, 0.8],
    extrapolate: 'clamp',
  });

  const likeOpacity = translateX.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = translateX.interpolate({
    inputRange: [-150, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = event.nativeEvent;
      const threshold = width * 0.25; // 25% of screen width
      
      if (Math.abs(translationX) > threshold || Math.abs(velocityX) > 800) {
        // Swipe detected
        const swipeDirection = translationX > 0 ? 'right' : 'left';
        const toValue = swipeDirection === 'right' ? width * 1.5 : -width * 1.5;
        
        Animated.timing(translateX, {
          toValue,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onSwipe(job.id, swipeDirection);
        });
      } else {
        // Snap back to center
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

  const handleButtonPress = (direction) => {
    const toValue = direction === 'right' ? width * 1.5 : -width * 1.5;
    
    Animated.timing(translateX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onSwipe(job.id, direction);
    });
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      enabled={isTop}
    >
      <Animated.View
        style={[
          styles.jobCard,
          style,
          {
            transform: [{ translateX }, { translateY }, { rotate }],
            opacity,
          },
        ]}
      >
        {/* Like/Nope Labels */}
        <Animated.View style={[styles.choiceLabel, styles.likeLabel, { opacity: likeOpacity }]}>
          <Text style={styles.choiceLabelText}>LIKE</Text>
        </Animated.View>
        
        <Animated.View style={[styles.choiceLabel, styles.nopeLabel, { opacity: nopeOpacity }]}>
          <Text style={styles.choiceLabelText}>NOPE</Text>
        </Animated.View>

        <View style={styles.jobImageContainer}>
          <Image source={{ uri: job.image }} style={styles.jobImage} />
          <View style={styles.jobLogoOuterContainer}>
            <View style={styles.jobLogoInnerContainer}>
              <View style={styles.logoLine} />
            </View>
          </View>
        </View>
        
        <View style={styles.jobDetailsContainer}>
          {/* Title + Bookmark icon row */}
          <View style={styles.jobHeaderRow}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <TouchableOpacity>
              <Icon name="bookmark-outline" size={26} color="#2D3748" />
            </TouchableOpacity>
          </View>

          <Text style={styles.jobLocation}>{job.company} - {job.location}</Text>
          <Text style={styles.jobSalary}>{job.salary}</Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>Full Time</Text>
            <Text style={styles.tag}>Remote</Text>
            <Text style={styles.tag}>Senior</Text>
          </View>
          <Text style={styles.jobDescription}>
            Description: Project managers play the lead role in planning, executing, monitoring, controlling, and closing out projects.
          </Text>
        </View>
        
        {isTop && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonRed]}
              onPress={() => handleButtonPress('left')}
            >
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonBlack]}
              onPress={() => router.push('/Homepage/jobdescription')}
            >
              <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonGreen]}
              onPress={() => handleButtonPress('right')}
            >
              <Icon name="checkmark" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

// --- Tutorial Data ---
const tutorialSteps = [
    {
        title: '👋 Hey There!',
        text: "Let's Personalize Your Journey.\nTap \"View Your Profile Here!\" To Update Your Details And Unlock A Tailored Experience.",
        modalPosition: { top: 180, alignSelf: 'center' },
        spotlight: { top: 118, left: 18, width: 60, height: 60 },
        highlightedComponent: { type: 'image', source: { uri: PROFILE_PIC_URL } }
    },
    {
        icon: 'menu-outline',
        title: 'Explore More',
        text: 'Discover Internship, Volunteer And Club Activity Opportunities.',
        modalPosition: { top: 75, left: 70 },
        arrowStyle: { top: 1, left: -25, transform: [{ rotate: '180deg' }] },
        spotlight: { top: 52, left: 18, width: 45, height: 45 },
        highlightedComponent: { type: 'icon', name: 'menu', size: 30, color: '#000' }
    },
    {
        icon: 'notifications-outline',
        title: 'Let\'s Keep You Informed.',
        text: 'Tap The 🔔 Notification Icon To Check Important Updates.',
        modalPosition: { top: 140, right: 65 },
        spotlight: { top: 120, right: 18, width: 45, height: 45 },
        highlightedComponent: { type: 'icon', name: 'notifications-outline', size: 28, color: '#000' }
    },
    {
        icon: 'return-down-back-outline',
        title: 'Swipe Left Card',
        text: 'Reject An Internship Quickly And Easily.',
        modalPosition: { top: '55.5%', left: 40 },
        arrowStyle: { bottom: 20, left: -35, transform: [{ rotate: '180deg' }] },
        spotlight: { top: '78.5%', left: 70, width: 65, height: 65 },
        highlightedComponent: { type: 'icon', name: 'close', size: 30, color: '#fff', backgroundColor: '#FC8181' }
    },
    {
        icon: 'return-down-forward-outline',
        title: 'Swipe Right Card',
        text: 'Shortlist Or Mark The Internship As OK.',
        modalPosition: { top: '55.5%', right: 40 },
        arrowStyle: { bottom: 20, right: -35, transform: [{ rotate: '180deg' }, { scaleX: -1 }] },
        spotlight: { top: '78.5%', right: 70, width: 65, height: 65 },
        highlightedComponent: { type: 'icon', name: 'checkmark', size: 30, color: '#fff', backgroundColor: '#68D391' }
    },
    {
        icon: 'add-circle-outline',
        title: 'Tap The Plus Icon',
        text: 'See More Details About The Internship.',
        modalPosition: { top: '55.5%', alignSelf: 'center' },
        arrowStyle: { bottom: -25, alignSelf: 'center', transform: [{ rotate: '90deg' }], marginLeft: -15.5 },
        spotlight: { top: '78.55%', alignSelf: 'center', width: 65, height: 65, marginLeft: -.5 },
        highlightedComponent: { type: 'icon', name: 'add', size: 30, color: '#fff', backgroundColor: '#2D3748' }
    },
    {
        icon: 'reader-outline',
        title: 'Application Tracker',
        text: 'View The List Of Internships You\'ve Applied To.',
        modalPosition: { bottom: 130, left: 25 },
        arrowStyle: { bottom: -30, left: 20, transform: [{ rotate: '90deg' }] },
        spotlight: { bottom: 18, left: 40, width: 60, height: 60 },
        highlightedComponent: { type: 'image', source: folderIcon, style: { width: 28, height: 28 } }
    },
    {
        icon: 'home-outline',
        title: 'Home',
        text: 'Discover And Swipe Through The Latest Opportunities.',
        modalPosition: { bottom: 130, alignSelf: 'center' },
        arrowStyle: { bottom: -30, alignSelf: 'center', transform: [{ rotate: '90deg' }], marginLeft: -35.5 },
        spotlight: { bottom: 18, alignSelf: 'center', width: 60, height: 60, marginLeft: -30 },
        highlightedComponent: { type: 'image', source: homeIcon, style: { width: 28, height: 28 } }
    },
    {
        icon: 'bookmark-outline',
        title: 'Saved Internships',
        text: 'All Swipe-Rights Land Here! Review And Apply Anytime.',
        modalPosition: { bottom: 130, right: 25 },
        arrowStyle: { bottom: -30, right: 20, transform: [{ rotate: '90deg' }] },
        spotlight: { bottom: 18, right: 40, width: 60, height: 60 },
        highlightedComponent: { type: 'image', source: bookmarkIcon, style: { width: 28, height: 28 } }
    },
];

const TutorialOverlay = ({ currentStep, onNext }) => {
  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  // Dismiss keyboard when tutorial is active
  useEffect(() => {
    Keyboard.dismiss();
  }, [currentStep]);

  const renderHighlightedComponent = () => {
    const comp = step.highlightedComponent;
    if (!comp) return null;

    if (comp.type === 'image' && comp.source.uri) {
      return <Image source={comp.source} style={styles.profilePic} />;
    }
    if (comp.type === 'image') {
        return <Image source={comp.source} style={[styles.navIcon, comp.style]} />;
    }
    if (comp.type === 'icon') {
      return <Icon name={comp.name} size={comp.size} color={comp.color} />;
    }
    return null;
  };

  return (
    <View style={styles.overlay}>
      <View style={[styles.spotlight, step.spotlight, { backgroundColor: step.highlightedComponent?.backgroundColor || '#FFFFFF' }]}>
        {renderHighlightedComponent()}
      </View>
      <View style={[styles.modalContainer, step.modalPosition]}>
        {step.arrowStyle && (
          <Image
            source={arrowVector}
            style={[styles.arrowImage, step.arrowStyle]}
          />
        )}
        {step.icon && <Icon name={step.icon} size={28} color="#333" style={styles.icon} />}
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.text}>{step.text}</Text>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>{isLastStep ? 'Done' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Main Home Page Screen ---
const Hp = ({ isBackground = false }) => {
  const params = useLocalSearchParams();
  const [isWelcomeActive, setWelcomeActive] = useState(true); // Show welcome overlay on first visit
  const [isTutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [jobs, setJobs] = useState(JOBS);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current; // Start off-screen

  useEffect(() => {
    if (params.startTutorial === 'true') {
      setWelcomeActive(false); // Hide welcome if tutorial should start
      setTutorialActive(true);
      setTutorialStep(0);
      router.setParams({ startTutorial: null });
    }
  }, [params]);

  // Dismiss keyboard when welcome or tutorial is active
  useEffect(() => {
    if (isWelcomeActive || isTutorialActive) {
      Keyboard.dismiss();
    }
  }, [isWelcomeActive, isTutorialActive]);

  // Animate side menu
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isMenuVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuVisible]);

  const handleWelcomeQuickGuide = () => {
    setWelcomeActive(false);
    setTutorialActive(true);
    setTutorialStep(0);
  };

  const handleWelcomeSkip = () => {
    setWelcomeActive(false);
  };

  const handleTutorialNext = () => {
      if (tutorialStep < tutorialSteps.length - 1) {
          setTutorialStep(tutorialStep + 1);
      } else {
          setTutorialActive(false);
      }
  };
  
  const handleSwipe = (jobId, direction) => {
    console.log(`Swiped job ${jobId} in direction ${direction}`);
    
    // If swiped right, add to saved jobs
    if (direction === 'right') {
      const jobToSave = jobs.find(job => job.id === jobId);
      if (jobToSave && !savedJobs.find(saved => saved.id === jobId)) {
        savedJobs.push({
          ...jobToSave,
          savedAt: new Date().toISOString(),
          status: 'saved'
        });
      }
    }
    
    // Remove job from current list
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };

  const handleBookmarkPress = () => {
    // Navigate to saved jobs page and pass the saved jobs data
    router.push({
      pathname: '/Homepage/saved',
      params: { savedJobs: JSON.stringify(savedJobs) }
    });
  };

  const handleMenuToggle = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleMenuClose = () => {
    setMenuVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.pageContent, isBackground && styles.darkBackground]}>
        {!isBackground && (
          <>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={handleMenuToggle}>
                    <Icon name="menu" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>INTERN SYNC</Text>
                <View style={{width: 40}} />
            </View>
          </>
        )}
        <View style={styles.contentWrapper}>
            <View style={styles.welcomeSection}>
                <TouchableOpacity style={styles.profilePicContainer}>
                  <Image source={{uri: PROFILE_PIC_URL}} style={styles.profilePic} />
                </TouchableOpacity>
                <View style={styles.welcomeTextContainer}>
                  <Text style={styles.helloText}>Hello</Text>
                  <Text style={styles.userName} numberOfLines={1} ellipsizeMode='tail'>Evelyn Ang</Text>
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
                  blurOnSubmit={true}
                  returnKeyType="search"
                />
                <TouchableOpacity style={styles.filterButton}><Icon name="options-outline" size={26} color="#000" /></TouchableOpacity>
            </View>
            
            <View style={styles.cardContainer}>
              {jobs.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="briefcase-outline" size={80} color="#ccc" />
                  <Text style={styles.emptyStateText}>No more jobs to show!</Text>
                  <Text style={styles.emptyStateSubtext}>Check back later for new opportunities</Text>
                </View>
              ) : (
                jobs.map((job, index) => {
                  const cardIndex = jobs.length - 1 - index;
                  return (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSwipe={handleSwipe}
                      isTop={index === jobs.length - 1}
                      style={{
                        zIndex: index + 1,
                        transform: [
                          { scale: 1 - cardIndex * 0.02 },
                          { translateY: cardIndex * -5 }
                        ]
                      }}
                    />
                  );
                })
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

      {/* Side Menu */}
      <SideMenu 
        isVisible={isMenuVisible} 
        onClose={handleMenuClose}
        slideAnim={slideAnim}
      />

      {/* Welcome Overlay - Show on first visit */}
      {isWelcomeActive && (
        <WelcomeOverlay 
          onQuickGuide={handleWelcomeQuickGuide}
          onSkip={handleWelcomeSkip}
        />
      )}

      {/* Tutorial Overlay */}
      {isTutorialActive && <TutorialOverlay currentStep={tutorialStep} onNext={handleTutorialNext} />}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  darkBackground: {
    backgroundColor: '#1A202C',
  },
    contentWrapper: { flex: 1, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: 20, backgroundColor: '#F9F9F9' },
    headerButton: { padding: 5, borderRadius: 30, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontFamily: 'ClaireNewsBold', fontSize: 26, letterSpacing: 1 },
    welcomeSection: { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
    profilePicContainer: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
    profilePic: { width: 50, height: 50, borderRadius: 25 },
    welcomeTextContainer: { flex: 1, marginLeft: 15, marginRight: 10 },
    helloText: { fontSize: 18, color: '#888' },
    userName: { fontSize: 24, fontWeight: 'bold' },
    notificationBell: { position: 'relative', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    notificationDot: { position: 'absolute', right: 2, top: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: 'red', borderWidth: 1, borderColor: '#000' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 15, marginTop: 25, paddingHorizontal: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, height: 55, fontSize: 16 },
    filterButton: { padding: 10 },
    cardContainer: {
        flex: 1,
        marginTop: 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    jobCard: { 
        backgroundColor: '#fff', 
        borderRadius: 20, 
        width: '90%',
        maxWidth: 350,
        position: 'absolute',
        alignSelf: 'center',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 10, 
        elevation: 5 
    },
    choiceLabel: {
        position: 'absolute',
        top: 50,
        zIndex: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    likeLabel: {
        right: 20,
        backgroundColor: 'rgba(0, 200, 83, 0.95)', // Vibrant green
    },
    nopeLabel: {
        left: 20,
        backgroundColor: 'rgba(255, 61, 61, 0.95)', // Vibrant red
    },
    choiceLabelText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    jobImageContainer: { position: 'relative' },
    jobImage: { width: '100%', height: 160, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    jobLogoOuterContainer: { position: 'absolute', bottom: -25, left: 20, backgroundColor: '#fff', padding: 8, borderRadius: 18, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 },
    jobLogoInnerContainer: { width: 50, height: 50, backgroundColor: '#4A5568', borderRadius: 12, overflow: 'hidden', transform: [{ rotate: '45deg' }] },
    logoLine: { position: 'absolute', top: 23, left: -10, width: 70, height: 4, backgroundColor: '#FFFFFF' },
    jobDetailsContainer: { padding: 20, paddingTop: 40 },
    jobHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    jobTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A202C' },
    jobLocation: { fontSize: 16, color: '#718096', marginTop: 5 },
    jobSalary: { fontSize: 16, color: '#2D3748', fontWeight: 'bold', marginTop: 5 },
    tagContainer: { flexDirection: 'row', marginTop: 15, flexWrap: 'wrap' },
    tag: { backgroundColor: '#EDF2F7', color: '#4A5568', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 15, marginRight: 10, marginBottom: 5, fontSize: 12, fontWeight: '600' },
    jobDescription: { fontSize: 14, color: '#4A5568', marginTop: 15, lineHeight: 21 },
    actionButtonsContainer: { flexDirection: 'row', justifyContent: 'space-evenly', paddingBottom: 20, paddingTop: 10 },
    actionButton: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
    actionButtonRed: { backgroundColor: '#FF3D3D' },
    actionButtonBlack: { backgroundColor: '#2D3748' },
    actionButtonGreen: { backgroundColor: '#00C853' },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#888',
        marginTop: 20,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        fontSize: 16,
        color: '#aaa',
        marginTop: 10,
        textAlign: 'center',
    },
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 75, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 10 },
    navButton: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%', borderRadius: 20 },
    navIcon: { width: 28, height: 28, resizeMode: 'contain' },
    
    // --- SIDE MENU STYLES ---
    menuBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9,
    },
    sideMenu: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 280,
        height: '100%',
        backgroundColor: '#2B3D5A',
        zIndex: 10,
        paddingTop: 60,
    },
    menuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        marginBottom: 20,
    },
    closeButton: {
        marginRight: 12,
        padding: 4,
    },
    menuTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    menuProfileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30,
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    menuProfilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    menuProfileInfo: {
        flex: 1,
    },
    menuGreeting: {
        color: '#94A3B8',
        fontSize: 14,
        marginBottom: 2,
    },
    menuUserName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    menuWhiteSection: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    menuItemsContainer: {
        paddingHorizontal: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 8,
        borderRadius: 12,
    },
    activeMenuItem: {
        backgroundColor: '#000',
    },
    menuItemIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: 'transparent',
    },
    activeMenuItemIconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    menuItemText: {
        color: '#94A3B8',
        fontSize: 15,
        fontWeight: '500',
    },
    activeMenuItemText: {
        color: '#fff',
        fontWeight: '600',
    },
    
    // --- WELCOME OVERLAY STYLES ---
    welcomeModalContainer: {
        width: '85%',
        backgroundColor: '#1C1C1E',
        borderRadius: 25,
        alignItems: 'center',
        padding: 20,
        position: 'absolute',
        top: '60%',
        left: '63%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        marginLeft: '-42.5%',
        marginTop: '-25%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
        zIndex: 12,
    },
    cardBackground: {
        width: '100%',
        height: 200,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    cardTextContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    logoContainer: {
        width: 70,
        height: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    logoCircle: {
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        opacity: 0.9
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#E0E0E0',
        marginTop: 10,
        textAlign: 'center'
    },
    guideButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 30,
        marginTop: 25,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#fff',
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    guideButtonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold'
    },
    skipText: {
        color: '#A0A0A0',
        fontSize: 16,
        marginTop: 15,
        padding: 10,
    },
    
    // --- TUTORIAL STYLES ---
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.92)', zIndex: 10 },
    spotlight: {
        position: 'absolute',
        borderRadius: 999,
        zIndex: 11,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: { width: '80%', backgroundColor: '#FFFFFF', borderRadius: 15, padding: 20, alignItems: 'center', position: 'absolute', zIndex: 12 },
    icon: { marginBottom: 10 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 8, textAlign: 'center' },
    text: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
    nextButton: { backgroundColor: '#000', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 40, justifyContent: 'center', alignItems: 'center' },
    nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    arrowImage: { width: 40, height: 40, position: 'absolute', resizeMode: 'contain', zIndex: 13, tintColor: '#FFFFFF' }
});

export default Hp;