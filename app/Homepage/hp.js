// ========================================================================
// FILE: app/hp.js
// This version replaces the bottom navigation icons with your custom
// image assets.
// ========================================================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';

// --- Import Custom Assets ---
const arrowVector = require('../../assets/images/Vector.png');
const folderIcon = require('../../assets/images/foldericon.png');
const homeIcon = require('../../assets/images/homeicon.png');
const bookmarkIcon = require('../../assets/images/bookmark.png');


// --- Mock Data ---
const PROFILE_PIC_URL = 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop';
const JOB_IMAGE_URL = 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=2070&auto=format&fit=crop';

// --- Tutorial Data ---
// This array is now the single source of truth for the tutorial's appearance.
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
        modalPosition: { top: 85, left: 80 },
        arrowStyle: { top: 20, left: -45, transform: [{ rotate: '90deg' }, { scaleY: -1 }, { scaleX: -1 }] },
        spotlight: { top: 52, left: 18, width: 45, height: 45 },
        highlightedComponent: { type: 'icon', name: 'menu', size: 30, color: '#000' }
    },
    {
        icon: 'notifications-outline',
        title: 'Let\'s Keep You Informed.',
        text: 'Tap The 🔔 Notification Icon To Check Important Updates.',
        modalPosition: { top: 150, right: 65 },
        arrowStyle: { top: 20, right: -40, transform: [{ rotate: '270deg' }, { scaleX: 1 }, { scaleY: -1 }] },
        spotlight: { top: 120, right: 18, width: 45, height: 45 },
        highlightedComponent: { type: 'icon', name: 'notifications-outline', size: 28, color: '#000' }
    },
    {
        icon: 'return-down-back-outline',
        title: 'Swipe Left Card',
        text: 'Reject An Internship Quickly And Easily.',
        modalPosition: { top: '55.5%', left: 80 },
        arrowStyle: { bottom: 20, left: -35, transform: [{ rotate: '180deg' }] },
        spotlight: { top: '77.5%', left: 50, width: 65, height: 65 },
        highlightedComponent: { type: 'icon', name: 'close', size: 30, color: '#fff', backgroundColor: '#FC8181' }
    },
    {
        icon: 'return-down-forward-outline',
        title: 'Swipe Right Card',
        text: 'Shortlist Or Mark The Internship As OK.',
        modalPosition: { top: '55.5%', right: 75 },
        arrowStyle: { bottom: 20, right: -35, transform: [{ rotate: '180deg' }, { scaleX: -1 }] },
        spotlight: { top: '77.5%', right: 50, width: 65, height: 65 },
        highlightedComponent: { type: 'icon', name: 'checkmark', size: 30, color: '#fff', backgroundColor: '#68D391' }
    },
    {
        icon: 'add-circle-outline',
        title: 'Tap The Plus Icon',
        text: 'See More Details About The Internship.',
        modalPosition: { top: '53%', alignSelf: 'center' },
        arrowStyle: { bottom: -25, alignSelf: 'center', transform: [{ rotate: '90deg' }], marginLeft: -20.5 },
        spotlight: { top: '77.5%', alignSelf: 'center', width: 65, height: 65, marginLeft: -5.5 },
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

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.pageContent}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton}>
                <Icon name="menu" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>INTERN SYNC</Text>
            <View style={{width: 30}} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
              <TouchableOpacity style={styles.profilePicContainer}>
                <Image source={{uri: PROFILE_PIC_URL}} style={styles.profilePic} />
              </TouchableOpacity>
              <View style={styles.welcomeTextContainer}><Text style={styles.helloText}>Hello</Text><Text style={styles.userName}>Evelyn Ang</Text></View>
              <TouchableOpacity style={styles.notificationBell}>
                 <Icon name="notifications-outline" size={28} color="#000" />
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
                  <TouchableOpacity style={[styles.actionButton, styles.actionButtonRed]}>
                      <Icon name="close" size={30} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonBlack]}
                      onPress={() => router.push('/Homepage/jd')}
                  >
                      <Icon name="add" size={30} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.actionButtonGreen]}>
                      <Icon name="checkmark" size={30} color="#fff" />
                  </TouchableOpacity>
              </View>
          </View>
          <View style={{ height: 80 }} />
        </ScrollView>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navButton}>
              <Image source={folderIcon} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
              <Image source={homeIcon} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
              <Image source={bookmarkIcon} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {isTutorialActive && <TutorialOverlay currentStep={tutorialStep} onNext={handleTutorialNext} />}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
    pageContent: { flex: 1, backgroundColor: '#F9F9F9' },
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: 20, backgroundColor: '#F9F9F9' },
    headerButton: { padding: 5, borderRadius: 30, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontFamily: 'ClaireNewsBold', fontSize: 26, letterSpacing: 1 },
    welcomeSection: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, alignItems: 'center' },
    profilePicContainer: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
    profilePic: { width: 50, height: 50, borderRadius: 25 },
    welcomeTextContainer: { flex: 1, marginLeft: 15 },
    helloText: { fontSize: 18, color: '#888' },
    userName: { fontSize: 24, fontWeight: 'bold' },
    notificationBell: { position: 'relative', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
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
    navButton: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%', borderRadius: 20 },
    navIcon: { width: 28, height: 28, resizeMode: 'contain' },
    // --- TUTORIAL STYLES ---
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 10 },
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
