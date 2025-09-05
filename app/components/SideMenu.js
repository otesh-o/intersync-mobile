// app/components/SideMenu.js

import React from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// Import the profile picture URL from the centralized data file
import { PROFILE_PIC_URL } from "../constants/appData";

// ✅ Import context to get updated name
import { useProfile } from "../context/ProfileContext";

/**
 * A slide-in side menu for navigation.
 * @param {boolean} isVisible - Controls visibility
 * @param {() => void} onClose - Closes the menu
 * @param {Animated.Value} slideAnim - Slide animation value
 * @param {(mode: string) => void} onModeChange - Called when mode is selected
 */
const SideMenu = ({ isVisible, onClose, slideAnim, onModeChange }) => {
  const { name: profileName } = useProfile(); // ✅ Get updated name

  const menuItems = [
    { id: "internships", icon: "wifi-outline", title: "Internships" },
    { id: "activity", icon: "grid-outline", title: "Activity" },
    { id: "volunteer", icon: "heart-outline", title: "Volunteer" },
  ];

  const handleMenuItemPress = (itemId) => {
    onModeChange(itemId); // 🔁 Notify parent (Homepage) of mode change
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isVisible && (
        <TouchableOpacity
          className="absolute inset-0 bg-black/50 z-[99]"
          onPress={onClose}
          activeOpacity={1}
        />
      )}

      {/* Main Menu */}
      <Animated.View
        className="absolute top-0 left-0 h-full w-[280px] bg-slate-800 z-[100] pt-[60px]"
        style={[{ transform: [{ translateX: slideAnim }] }]}
      >
        {/* Header with Back Button */}
        <View className="flex-row items-center px-5 pb-5 mb-5">
          <TouchableOpacity className="mr-3 p-1" onPress={onClose}>
            <Icon name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold tracking-wide">
            InternSync
          </Text>
        </View>

        {/* User Info */}
        <View className="flex-row items-center px-5 pb-[30px] mb-[30px] border-b border-white/10">
          <Image
            source={{ uri: PROFILE_PIC_URL }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="text-slate-400 text-sm mb-0.5">Hello</Text>
            <Text className="text-white text-base font-semibold">
              {profileName || "User"} {/* ✅ Dynamic name */}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="flex-1 bg-white rounded-t-2xl p-2.5">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center px-4 py-3 mb-2 rounded-xl"
              onPress={() => handleMenuItemPress(item.id)}
            >
              <View className="w-9 h-9 rounded-full justify-center items-center mr-3 bg-slate-100">
                <Icon name={item.icon} size={22} color="#718096" />
              </View>
              <Text className="text-slate-600 text-[15px] font-medium">
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </>
  );
};

export default SideMenu;
