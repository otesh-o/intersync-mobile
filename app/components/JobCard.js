// ========================================================================
// FILE: app/components/JobCard.js
//
// PURPOSE:
// A reusable, swipeable card component for displaying job opportunities.
// It includes gesture handling for swiping left/right and animated
// feedback (rotation, "LIKE"/"NOPE" labels).
// ========================================================================

import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  useWindowDimensions, Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

/**
 * A swipeable card component to display job information.
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

  // --- Animations ---
  // Rotate the card as it's being swiped
  const rotate = translateX.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  // Fade in the "LIKE" label as the card is swiped right
  const likeOpacity = translateX.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Fade in the "NOPE" label as the card is swiped left
  const nopeOpacity = translateX.interpolate({
    inputRange: [-150, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // --- Gesture Handling ---
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = event.nativeEvent;
      const swipeThreshold = width * 0.25; // Swipe is triggered if moved 25% of screen width

      // If swipe is significant enough, animate it off-screen
      if (Math.abs(translationX) > swipeThreshold || Math.abs(velocityX) > 800) {
        const swipeDirection = translationX > 0 ? 'right' : 'left';
        const toValue = swipeDirection === 'right' ? width * 1.5 : -width * 1.5;

        Animated.timing(translateX, {
          toValue,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onSwipe(job.id, swipeDirection));
      } else {
        // Otherwise, snap back to the center
        Animated.parallel([
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 100, friction: 8 }),
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 100, friction: 8 }),
        ]).start();
      }
    }
  };

  // --- Button Press Handling ---
  const handleButtonPress = (direction) => {
    const toValue = direction === 'right' ? width * 1.5 : -width * 1.5;
    Animated.timing(translateX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onSwipe(job.id, direction));
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange} enabled={isTop}>
      <Animated.View style={[styles.jobCard, style, { transform: [{ translateX }, { translateY }, { rotate }] }]}>
        {/* Like/Nope Overlays */}
        <Animated.View style={[styles.choiceLabel, styles.likeLabel, { opacity: likeOpacity }]}>
          <Text style={styles.choiceLabelText}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.choiceLabel, styles.nopeLabel, { opacity: nopeOpacity }]}>
          <Text style={styles.choiceLabelText}>NOPE</Text>
        </Animated.View>

        {/* Card Content */}
        <View style={styles.jobImageContainer}>
          <Image source={{ uri: job.image }} style={styles.jobImage} />
          <View style={styles.jobLogoOuterContainer}>
            <View style={styles.jobLogoInnerContainer}><View style={styles.logoLine} /></View>
          </View>
        </View>
        
        <View style={styles.jobDetailsContainer}>
          <View style={styles.jobHeaderRow}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <TouchableOpacity><Icon name="bookmark-outline" size={26} color="#2D3748" /></TouchableOpacity>
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
        
        {/* Action buttons are only shown on the top card */}
        {isTop && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonRed]} onPress={() => handleButtonPress('left')}>
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonBlack]} onPress={() => router.push('/Homepage/jobdescription')}>
              <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonGreen]} onPress={() => handleButtonPress('right')}>
              <Icon name="checkmark" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

// --- Styles ---
// All styles related to the JobCard are co-located here.
const styles = StyleSheet.create({
  jobCard: { backgroundColor: '#fff', borderRadius: 20, width: '90%', maxWidth: 350, position: 'absolute', alignSelf: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  choiceLabel: { position: 'absolute', top: 50, zIndex: 10, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5, borderWidth: 2, borderColor: 'white' },
  likeLabel: { right: 20, backgroundColor: 'rgba(104, 211, 145, 0.9)', transform: [{ rotate: '15deg' }] },
  nopeLabel: { left: 20, backgroundColor: 'rgba(252, 129, 129, 0.9)', transform: [{ rotate: '-15deg' }] },
  choiceLabelText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
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
  actionButtonRed: { backgroundColor: '#FC8181' },
  actionButtonBlack: { backgroundColor: '#2D3748' },
  actionButtonGreen: { backgroundColor: '#68D391' },
});

export default JobCard;
