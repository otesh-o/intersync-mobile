// app/components/ProfileSetupModal.js
import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

const ProfileSetupModal = ({ isVisible, onClose, onSetup }) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/75">
        <View className="w-4/5 bg-white rounded-2xl p-6 items-center">
          <Text className="text-2xl font-bold text-black text-center mb-4">
            Complete Your Profile
          </Text>
          <Text className="text-base text-gray-600 text-center mb-6 leading-6">
            To get the best experience and job matches, please set up your
            profile now.
          </Text>

          <View className="flex-row justify-around w-full">
            <TouchableOpacity
              className="bg-gray-300 rounded-xl py-3 px-6"
              onPress={onClose}
            >
              <Text className="text-black font-semibold">Later</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-black rounded-xl py-3 px-6"
              onPress={onSetup}
            >
              <Text className="text-white font-semibold">Set Up Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProfileSetupModal;
