import { Ionicons as Icon } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";

const SideMenu = ({
  isVisible,
  onClose,
  slideAnim,
  onModeChange,
  currentMode,
}) => {
  const { name: profileName, profilePicUrl } = useProfile();
  const { isPremium, setPremium, isDebugMode, logout } = useAuth();

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
          className="absolute inset-0 bg-black/40 z-[99]"
          onPress={onClose}
          activeOpacity={1}
        />
      )}

      <Animated.View
        className="absolute top-0 left-0 h-full w-[300px] z-[100] shadow-2xl"
        style={{ transform: [{ translateX: slideAnim }] }}
      >
        <View
          style={{ backgroundColor: "#111827" }}
          className="h-[30%] px-6 flex-col justify-between pb-6"
        >
          {/* Top Header */}
          <View className="flex-row items-center pt-16">
            <TouchableOpacity className="mr-4 p-1 rounded-full bg-white/10" onPress={onClose}>
              <Icon name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text
              style={{ fontFamily: 'ClaireNewsBold' }}
              className="text-white text-2xl font-bold tracking-tight"
            >
              InternSync
            </Text>
          </View>

          {/* Profile Section */}
          <View className="flex-row items-center bg-white/5 p-3 rounded-2xl border border-white/10">
            <View className="relative shadow-sm">
              {profilePicUrl ? (
                <Image
                  source={{ uri: profilePicUrl }}
                  className="w-14 h-14 rounded-full border-2 border-white/20"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-14 h-14 rounded-full bg-slate-700 items-center justify-center border-2 border-white/10">
                  <Icon name="person" size={24} color="#CBD5E1" />
                </View>
              )}
              <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900" />
            </View>

            <View className="ml-4 flex-1">
              <View className="flex-row items-center">
                <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider">Welcome back</Text>
                {/* Plan Badge */}
                <View className={`ml-2 px-2 py-0.5 rounded-full ${isPremium ? 'bg-amber-400' : 'bg-slate-600'}`}>
                  <Text className="text-[10px] text-white font-bold uppercase">
                    {isPremium ? 'Premium' : 'Free'}
                  </Text>
                </View>
              </View>
              <Text
                className="text-white text-lg font-bold"
                numberOfLines={1}
              >
                {profileName || "User"}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1 bg-white pt-6">

          <ScrollView
            contentContainerClassName="p-2.5"
            showsVerticalScrollIndicator={false}
          >
            {menuItems.map((item) => {
              const isActive = currentMode === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  className={`flex-row items-center px-4 py-3 mb-2 rounded-xl ${isActive ? "bg-slate-200" : "bg-white"
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
                    className={`text-[15px] font-medium ${isActive ? "text-slate-800" : "text-slate-600"
                      }`}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Fixed Footer Section */}
          <View className="p-4 border-t border-slate-100 bg-slate-50/50">
            {/* Logout Button */}
            <TouchableOpacity
              className="flex-row items-center px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm"
              onPress={() => {
                Alert.alert("Sign Out", "Are you sure you want to log out?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: () => logout(),
                  },
                ]);
              }}
            >
              <View className="w-9 h-9 rounded-full justify-center items-center mr-3 bg-red-50">
                <Icon name="log-out-outline" size={22} color="#EF4444" />
              </View>
              <Text className="text-[15px] font-medium text-red-600">
                Sign Out
              </Text>
            </TouchableOpacity>

            {/* Reviewer/Test Tools */}
            {isDebugMode && (
              <View className="mt-4 pt-4 border-t border-slate-200">
                {/* Reviewer Premium Toggle */}
                <View className="flex-row items-center justify-between mb-4 px-2">
                  <View className="flex-row items-center">
                    <Icon name="star" size={18} color="#EAB308" />
                    <Text className="ml-2 text-slate-700 font-medium">
                      Reviewer Access
                    </Text>
                  </View>
                  <Switch
                    value={isPremium}
                    onValueChange={setPremium}
                    trackColor={{ false: "#CBD5E1", true: "#000" }}
                    thumbColor="#fff"
                  />
                </View>

                <TouchableOpacity
                  onPress={async () => {
                    await SecureStore.deleteItemAsync("total_swipes");
                    await SecureStore.deleteItemAsync("right_swipes");
                    await SecureStore.deleteItemAsync("limit_reset_at");
                    alert("Audit cache cleared! Please refresh the app.");
                    onClose();
                  }}
                  className="flex-row items-center justify-center bg-red-50 py-3 rounded-xl"
                >
                  <Icon name="refresh-outline" size={18} color="#EF4444" />
                  <Text className="ml-2 text-red-500 font-semibold">
                    Clear Audit Cache
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Animated.View >
    </>
  );
};

export default SideMenu;
