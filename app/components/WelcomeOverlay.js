// ========================================================================
// FILE: app/components/WelcomeOverlay.js
// PURPOSE: A modal overlay using NativeWind for styling.
// ========================================================================

import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  ImageBackground, Keyboard
} from 'react-native';

// Import the background image URL from the centralized data file
import { CARD_BACKGROUND_URL } from '../constants/appData';

/**
 * A modal overlay shown to the user on their first visit.
 * @param {object} props - Component props.
 * @param {() => void} props.onQuickGuide - Function to call when "Quick Guide" is pressed.
 * @param {() => void} props.onSkip - Function to call when "Skip" is pressed.
 */
const WelcomeOverlay = ({ onQuickGuide, onSkip }) => {
  // --- Effects ---
  // Dismiss the keyboard automatically when this overlay is active.
  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <View className="absolute inset-0 justify-center items-center bg-black/[.92] z-10">
      <View className="w-[85%] items-center rounded-3xl bg-[#1C1C1E] p-5 shadow-2xl shadow-black">
        <ImageBackground
          source={{ uri: CARD_BACKGROUND_URL }}
          className="w-full h-[200px] justify-center items-center overflow-hidden"
          imageStyle={{ borderRadius: 20 }} // imageStyle applies to the <Image> component
        >
          <View className="w-full h-full justify-center items-center bg-black/40 p-2.5">
            <Text className="text-3xl font-bold italic text-white text-center">Let's get you ready !</Text>
            <View className="w-[70px] h-[70px] justify-center items-center bg-white/10 rounded-2xl mt-4">
              <View className="w-10 h-10 bg-white rounded-full opacity-90" />
            </View>
            <Text className="text-base text-gray-200 text-center mt-2.5">Find Your Perfect Opportunity!</Text>
          </View>
        </ImageBackground>

        <TouchableOpacity
          className="bg-white py-4 px-14 rounded-full mt-6 mb-4 shadow-lg shadow-white/30"
          onPress={onQuickGuide}
        >
          <Text className="text-black text-lg font-bold">Quick Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSkip}>
          <Text className="text-gray-400 text-base p-2.5">Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeOverlay;