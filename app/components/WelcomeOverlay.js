import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const WelcomeOverlay = ({ onQuickGuide, onSkip }) => {
  return (
    <View className="absolute inset-0 bg-black/75 z-10">
      <View className="flex-1 justify-around items-center px-5">
        <Text className="text-3xl font-bold text-white text-center mt-20">
          Let{"'"}s get you ready!
        </Text>

        <Text className="text-lg text-white text-center">
          Find Your Perfect Opportunity!
        </Text>

        <View className="items-center w-full mb-10">
          <TouchableOpacity
            className="bg-black py-3 px-10 rounded-full mb-4"
            onPress={onQuickGuide}
          >
            <Text className="text-white text-lg font-bold">Quick Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSkip}>
            <Text className="text-white text-base">Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WelcomeOverlay;
