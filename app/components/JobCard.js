// ========================================================================
// FILE: app/components/JobCard.js
// PURPOSE: A reusable, swipeable card component using NativeWind for styling.
// ========================================================================

import React, { useRef } from 'react';
import {
  View, Text, TouchableOpacity, Image,
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
  const rotate = translateX.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
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

  // --- Gesture Handling (No changes needed here) ---
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = event.nativeEvent;
      const swipeThreshold = width * 0.25;

      if (Math.abs(translationX) > swipeThreshold || Math.abs(velocityX) > 800) {
        const swipeDirection = translationX > 0 ? 'right' : 'left';
        const toValue = swipeDirection === 'right' ? width * 1.5 : -width * 1.5;

        Animated.timing(translateX, {
          toValue,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onSwipe(job.id, swipeDirection));
      } else {
        Animated.parallel([
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 100, friction: 8 }),
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 100, friction: 8 }),
        ]).start();
      }
    }
  };

  // --- Button Press Handling (No changes needed here) ---
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
      <Animated.View
        className="absolute w-[90%] max-w-sm self-center bg-white rounded-2xl shadow-lg"
        style={[style, { transform: [{ translateX }, { translateY }, { rotate }] }]}
      >
        {/* Like/Nope Overlays */}
        <Animated.View
          className="absolute top-12 right-5 z-10 px-5 py-2.5 rounded-md border-2 border-white bg-green-400/90"
          style={[{ transform: [{ rotate: '15deg' }] }, { opacity: likeOpacity }]}
        >
          <Text className="text-white text-lg font-bold">LIKE</Text>
        </Animated.View>
        <Animated.View
          className="absolute top-12 left-5 z-10 px-5 py-2.5 rounded-md border-2 border-white bg-red-400/90"
          style={[{ transform: [{ rotate: '-15deg' }] }, { opacity: nopeOpacity }]}
        >
          <Text className="text-white text-lg font-bold">NOPE</Text>
        </Animated.View>

        {/* Card Content */}
        <View className="relative">
          <Image source={{ uri: job.image }} className="w-full h-40 rounded-t-2xl" />
          <View className="absolute -bottom-6 left-5 bg-white p-2 rounded-2xl shadow-md">
            <View 
              className="w-12 h-12 bg-slate-600 rounded-xl overflow-hidden"
              style={{ transform: [{ rotate: '45deg' }] }}
            >
              <View className="absolute top-[23px] -left-2.5 w-[70px] h-1 bg-white" />
            </View>
          </View>
        </View>

        <View className="p-5 pt-10">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-slate-800 flex-1" numberOfLines={1}>{job.title}</Text>
            <TouchableOpacity className="ml-2">
              <Icon name="bookmark-outline" size={26} color="#2D3748" />
            </TouchableOpacity>
          </View>
          <Text className="text-base text-slate-500 mt-1">{job.company} - {job.location}</Text>
          <Text className="text-base font-bold text-slate-700 mt-1">{job.salary}</Text>
          <View className="flex-row mt-4 flex-wrap">
            <Text className="bg-slate-100 text-slate-600 text-xs font-semibold mr-2 mb-2 px-4 py-1.5 rounded-full">Full Time</Text>
            <Text className="bg-slate-100 text-slate-600 text-xs font-semibold mr-2 mb-2 px-4 py-1.5 rounded-full">Remote</Text>
            <Text className="bg-slate-100 text-slate-600 text-xs font-semibold mr-2 mb-2 px-4 py-1.5 rounded-full">Senior</Text>
          </View>
          <Text className="text-sm text-slate-600 mt-4 leading-relaxed" numberOfLines={2}>
            Description: Project managers play the lead role in planning, executing, monitoring, controlling, and closing out projects.
          </Text>
        </View>

        {/* Action buttons are only shown on the top card */}
        {isTop && (
          <View className="flex-row justify-evenly pt-2 pb-5">
            <TouchableOpacity className="w-14 h-14 justify-center items-center rounded-full bg-red-400 shadow-md" onPress={() => handleButtonPress('left')}>
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity className="w-14 h-14 justify-center items-center rounded-full bg-slate-800 shadow-md" onPress={() => router.push('/Homepage/jobdescription')}>
              <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity className="w-14 h-14 justify-center items-center rounded-full bg-green-400 shadow-md" onPress={() => handleButtonPress('right')}>
              <Icon name="checkmark" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default JobCard;