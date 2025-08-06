// ========================================================================
// FILE: app/hp.js
// This is the main Home Page, with corrected tutorial positioning
// to ensure tips and pointers are accurate and do not cover the UI.
// ========================================================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';

// --- Tutorial Data ---
// Positions and arrow directions have been meticulously recalculated for accuracy.
const tutorialSteps = [
    { icon: 'menu-outline', title: 'Explore More', text: 'Discover Internship, Volunteer And Club Activity Opportunities.', position: { top: 85, left: 70 }, highlightTarget: 'menu', arrowDirection: 'left' },
    { icon: 'person-circle-outline', title: 'Hey There!', text: 'Let\'s Personalize Your Journey.', position: { top: 120, left: 90 }, highlightTarget: 'profile', arrowDirection: 'left' },
    { icon: 'notifications-outline', title: 'Let\'s Keep You Informed.', text: 'Tap The 🔔 Notification Icon To Check Important Updates.', position: { top: 120, right: 90 }, highlightTarget: 'notifications', arrowDirection: 'right' },
    { icon: 'return-down-back-outline', title: 'Swipe Left Card', text: 'Reject An Internship Quickly And Easily.', position: { top: '73%', left: 100 }, highlightTarget: 'reject', arrowDirection: 'left' },
    { icon: 'return-down-forward-outline', title: 'Swipe Right Card', text: 'Shortlist Or Mark The Internship As OK.', position: { top: '73%', right: 100 }, highlightTarget: 'accept', arrowDirection: 'right' },
    { icon: 'add-circle-outline', title: 'Tap The Plus Icon', text: 'See More Details About The Internship.', position: { top: '60%', alignSelf: 'center' }, highlightTarget: 'details', arrowDirection: 'down' },
    { icon: 'reader-outline', title: 'Application Tracker', text: 'View The List Of Internships You\'ve Applied To.', position: { bottom: 125, left: 25 }, highlightTarget: 'tracker', arrowDirection: 'down' },
    { icon: 'home-outline', title: 'Home', text: 'Discover And Swipe Through The Latest Opportunities.', position: { bottom: 125, alignSelf: 'center' }, highlightTarget: 'home', arrowDirection: 'down' },
    { icon: 'bookmark-outline', title: 'Saved Internships', text: 'All Swipe-Rights Land Here! Review And Apply Anytime.', position: { bottom: 125, right: 25 }, highlightTarget: 'saved', arrowDirection: 'down' },
];

const TutorialOverlay = ({ currentStep, onNext }) => {
  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const getArrowStyle = (direction) => {
    switch (direction) {
      case 'up': return styles.arrowUp;
      case 'down': return styles.arrowDown;
      case 'left': return styles.arrowLeft;
      case 'right': return styles.arrowRight;
      default: return null;
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={[styles.modalContainer, step.position]}>
        <View style={[styles.arrow, getArrowStyle(step.arrowDirection)]} />
        <Icon name={step.icon} size={28} color="#333" style={styles.icon} />
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.text}>{step.text}</Text>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>{isLastStep ? 'Done' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
// --- End of Tutorial Component ---


// --- Main Home Page Component ---
const Hp = () => {
  const params = useLocalSearchParams();
  const [isTutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    if (params.startTutorial === 'true') {
      setTutorialActive(true);
      setTutorialStep(0);
      router.setParams({ startTutorial: null });
    }
  }, [params]);

  const handleTutorialNext = () => {
      if (tutorialStep < tutorialSteps.length - 1) {
          setTutorialStep(tutorialStep + 1);
      } else {
          setTutorialActive(false);
      }
  };

  const currentHighlight = isTutorialActive ? tutorialSteps[tutorialStep].highlightTarget : null;

  const PROFILE_PIC_URL = 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop';
  const JOB_IMAGE_URL = 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=2070&auto=format&fit=crop';

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
            <TouchableOpacity style={[styles.headerButton, currentHighlight === 'menu' && styles.highlighted]}>
                <Icon name="menu" size={30} color={currentHighlight === 'menu' ? '#000' : '#000'} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>INTERN SYNC</Text>
            <View style={{width: 30}} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
              <TouchableOpacity style={[styles.profilePicContainer, currentHighlight === 'profile' && styles.highlighted]}>
                <Image source={{uri: PROFILE_PIC_URL}} style={styles.profilePic} />
              </TouchableOpacity>
              <View style={styles.welcomeTextContainer}><Text style={styles.helloText}>Hello</Text><Text style={styles.userName}>Emelyn Angga</Text></View>
              <TouchableOpacity style={[styles.notificationBell, currentHighlight === 'notifications' && styles.highlighted]}>
                 <Icon name="notifications-outline" size={28} color={currentHighlight === 'notifications' ? '#000' : '#000'} />
                 <View style={styles.notificationDot} />
              </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
              <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput placeholder="Search by job name" style={styles.searchInput} placeholderTextColor="#888" />
              <TouchableOpacity style={styles.filterButton}><Icon name="options-outline" size={26} color="#000" /></TouchableOpacity>
          </View>
          <View style={styles.jobCard}>
              <View style={styles.jobImageContainer}>
                  <Image source={{ uri: JOB_IMAGE_URL }} style={styles.jobImage} />
                  <View style={styles.jobLogoOuterContainer}><View style={styles.jobLogoInnerContainer}><View style={styles.logoLine} /></View></View>
              </View>
              <View style={styles.jobDetailsContainer}>
                <Text style={styles.jobTitle}>Software Engineer</Text><Text style={styles.jobLocation}>Linear - Jakarta, ID</Text><Text style={styles.jobSalary}>$50 - $75 / Mo</Text>
                <View style={styles.tagContainer}><Text style={styles.tag}>Full Time</Text><Text style={styles.tag}>Remote</Text><Text style={styles.tag}>Senior</Text></View>
                <Text style={styles.jobDescription}>Description : Project managers play the lead role in planning, executing, monitoring, controlling, and closing out projects.</Text>
              </View>
              <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity style={[styles.actionButton, styles.actionButtonRed, currentHighlight === 'reject' && styles.highlighted]}>
                      <Icon name="close" size={30} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonBlack, currentHighlight === 'details' && styles.highlighted]}
                      onPress={() => router.push('/jd')}
                  >
                      <Icon name="add" size={30} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.actionButtonGreen, currentHighlight === 'accept' && styles.highlighted]}>
                      <Icon name="checkmark" size={30} color="#fff" />
                  </TouchableOpacity>
              </View>
          </View>
          <View style={{ height: 80 }} />
        </ScrollView>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={[styles.navButton, currentHighlight === 'tracker' && styles.highlightedBottomNav]}>
              <Icon name="person-outline" size={28} color={currentHighlight === 'tracker' ? '#000' : '#888'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, currentHighlight === 'home' && styles.highlightedBottomNav]}>
              <Icon name="home" size={28} color={currentHighlight === 'home' ? '#000' : '#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, currentHighlight === 'saved' && styles.highlightedBottomNav]}>
              <Icon name="bookmark-outline" size={28} color={currentHighlight === 'saved' ? '#000' : '#888'} />
          </TouchableOpacity>
        </View>
      </View>

      {isTutorialActive && <TutorialOverlay currentStep={tutorialStep} onNext={handleTutorialNext} />}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: 20, backgroundColor: '#F9F9F9' },
    headerButton: { padding: 5, borderRadius: 30 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },
    welcomeSection: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, alignItems: 'center' },
    profilePicContainer: { padding: 3, borderRadius: 30 },
    profilePic: { width: 50, height: 50, borderRadius: 25 },
    welcomeTextContainer: { flex: 1, marginLeft: 15 },
    helloText: { fontSize: 18, color: '#888' },
    userName: { fontSize: 24, fontWeight: 'bold' },
    notificationBell: { position: 'relative', padding: 5, borderRadius: 20 },
    notificationDot: { position: 'absolute', right: 2, top: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: 'red', borderWidth: 1, borderColor: '#000' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 15, marginHorizontal: 20, marginTop: 25, paddingHorizontal: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, height: 55, fontSize: 16 },
    filterButton: { padding: 10 },
    jobCard: { backgroundColor: '#fff', borderRadius: 20, margin: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    jobImageContainer: { position: 'relative' },
    jobImage: { width: '100%', height: 160, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    jobLogoOuterContainer: { position: 'absolute', bottom: -25, left: 20, backgroundColor: '#fff', padding: 8, borderRadius: 18, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 },
    jobLogoInnerContainer: { width: 50, height: 50, backgroundColor: '#4A5568', borderRadius: 12, overflow: 'hidden', transform: [{ rotate: '45deg' }] },
    logoLine: { position: 'absolute', top: 23, left: -10, width: 70, height: 4, backgroundColor: '#FFFFFF' },
    jobDetailsContainer: { padding: 20, paddingTop: 40 },
    jobTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A202C' },
    jobLocation: { fontSize: 16, color: '#718096', marginTop: 5 },
    jobSalary: { fontSize: 16, color: '#2D3748', fontWeight: 'bold', marginTop: 5 },
    tagContainer: { flexDirection: 'row', marginTop: 15, flexWrap: 'wrap' },
    tag: { backgroundColor: '#EDF2F7', color: '#4A5568', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 15, marginRight: 10, marginBottom: 5, fontSize: 12, fontWeight: '600' },
    jobDescription: { fontSize: 14, color: '#4A5568', marginTop: 15, lineHeight: 21 },
    actionButtonsContainer: { flexDirection: 'row', justifyContent: 'space-evenly', paddingBottom: 20, paddingTop: 10 },
    actionButton: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
    actionButtonRed: { backgroundColor: '#FC8181' },
    actionButtonBlack: { backgroundColor: '#2D3748' },
    actionButtonGreen: { backgroundColor: '#68D391' },
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 75, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 10 },
    navButton: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10 },
    modalContainer: { minWidth: '60%', maxWidth: '85%', backgroundColor: '#FFFFFF', borderRadius: 15, padding: 20, alignItems: 'center', position: 'absolute', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
    icon: { marginBottom: 10 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 8, textAlign: 'center' },
    text: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
    nextButton: { backgroundColor: '#000', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 40, justifyContent: 'center', alignItems: 'center' },
    nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    highlighted: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 50, transform: [{ scale: 1.1 }], zIndex: 20, elevation: 20, shadowColor: '#0000FF', shadowRadius: 10, shadowOpacity: 1 },
    highlightedBottomNav: { transform: [{ scale: 1.2 }], backgroundColor: 'rgba(230, 230, 250, 0.8)', borderRadius: 20 },
    arrow: { width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', position: 'absolute' },
    arrowDown: { borderTopWidth: 15, borderTopColor: '#FFFFFF', borderLeftWidth: 15, borderLeftColor: 'transparent', borderRightWidth: 15, borderRightColor: 'transparent', bottom: -15, alignSelf: 'center' },
    arrowUp: { borderBottomWidth: 15, borderBottomColor: '#FFFFFF', borderLeftWidth: 15, borderLeftColor: 'transparent', borderRightWidth: 15, borderRightColor: 'transparent', top: -15, alignSelf: 'center' },
    arrowLeft: { borderRightWidth: 15, borderRightColor: '#FFFFFF', borderTopWidth: 15, borderTopColor: 'transparent', borderBottomWidth: 15, borderBottomColor: 'transparent', left: -15, top: '40%' },
    arrowRight: { borderLeftWidth: 15, borderLeftColor: '#FFFFFF', borderTopWidth: 15, borderTopColor: 'transparent', borderBottomWidth: 15, borderBottomColor: 'transparent', right: -15, top: '40%' },
});

export default Hp;
