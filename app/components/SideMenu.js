import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useProfile } from "../context/ProfileContext";

const SideMenu = ({
  isVisible,
  onClose,
  slideAnim,
  onModeChange,
  currentMode,
}) => {
  const { name: profileName, profilePicUrl } = useProfile();

  const menuItems = [
    { id: "internships", icon: "briefcase-outline", title: "Internships" },
    {
      id: "extracurriculars",
      icon: "heart-outline",
      title: "Extracurriculars",
    },
    { id: "scholarships", icon: "school-outline", title: "Scholarships" },
  ];

  const handleMenuItemPress = (itemId) => {
    onModeChange(itemId);
    onClose();
  };

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          className="absolute inset-0 bg-black/50 z-[99]"
          onPress={onClose}
          activeOpacity={1}
        />
      )}

      <Animated.View
        className="absolute top-0 left-0 h-full w-[280px] z-[100]"
        style={{ transform: [{ translateX: slideAnim }] }}
      >
        {/*30% height */}
        <View className="h-[30%] bg-slate-800 px-5 flex-col justify-between pb-4">
          {/* 🔹 Group A: Top — Back icon + App name */}
          <View className="flex-row items-center pt-14">
            <TouchableOpacity className="mr-3 p-1" onPress={onClose}>
              <Icon name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold tracking-wide">
              InternSync
            </Text>
          </View>

          {/* Profile pic + Greeting */}
          <View className="flex-row items-center">
            {profilePicUrl ? (
              <Image
                source={{ uri: profilePicUrl }}
                className="w-12 h-12 rounded-full mr-3"
                resizeMode="cover"
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-slate-700 mr-3" />
            )}

            <View>
              <Text className="text-slate-400 text-sm mb-0.5">Hello</Text>
              <Text className="text-white text-base font-semibold">
                {profileName || "User"}
              </Text>
            </View>
          </View>
        </View>

        {/*70% height */}
        <View className="h-[70%] bg-white rounded-t-2xl">
          <ScrollView
            contentContainerClassName="p-2.5"
            showsVerticalScrollIndicator={false}
          >
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
          </ScrollView>
        </View>
      </Animated.View>
    </>
  );
};

export default SideMenu;
