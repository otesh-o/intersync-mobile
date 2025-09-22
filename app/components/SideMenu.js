// app/components/SideMenu.js
import React from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// Import profile picture URL
import { PROFILE_PIC_URL } from "../constants/appData";

// Context for dynamic user name
import { useProfile } from "../context/ProfileContext";

/**
 * Slide-in side menu with category selection.
 * @param {boolean} isVisible
 * @param {() => void} onClose
 * @param {Animated.Value} slideAnim
 * @param {(mode: string) => void} onModeChange
 * @param {string} currentMode - For active tab highlighting
 */
const SideMenu = ({
  isVisible,
  onClose,
  slideAnim,
  onModeChange,
  currentMode,
}) => {
  const { name: profileName } = useProfile();

  const menuItems = [
    { id: "internships", icon: "wifi-outline", title: "Internships" },
    {
      id: "Extracurriculars",
      icon: "heart-outline",
      title: "Extracurriculars",
    },
    { id: "scholarships", icon: "school-outline", title: "Scholarships" }, // ✅ Added
  ];

  const handleMenuItemPress = (itemId) => {
    onModeChange(itemId);
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
        {/* Header */}
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
              {profileName || "User"}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="flex-1 bg-white rounded-t-2xl p-2.5">
          {menuItems.map((item) => {
            const isActive = currentMode === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center px-4 py-3 mb-2 rounded-xl ${
                  isActive ? "bg-slate-200" : "bg-white"
                }`}
                onPress={() => handleMenuItemPress(item.id)}
              >
                <View
                  className="w-9 h-9 rounded-full justify-center items-center mr-3"
                  style={{
                    backgroundColor: isActive ? "#2D3748" : "#F7FAFC",
                  }}
                >
                  <Icon
                    name={item.icon}
                    size={22}
                    color={isActive ? "#fff" : "#718096"}
                  />
                </View>
                <Text
                  className={`text-[15px] font-medium ${
                    isActive ? "text-slate-800" : "text-slate-600"
                  }`}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </>
  );
};

export default SideMenu;
