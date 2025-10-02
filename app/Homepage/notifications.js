// app/Homepage/notifications.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import { api } from "../services/api";
import NotificationCard from "../components/NotificationCard";
import Icon from "react-native-vector-icons/Ionicons";


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasFetchedOnce = useRef(false);

  
  const fetchNotifications = async () => {
    if (!hasFetchedOnce.current) setIsRefreshing(true);
    setIsRefreshing(true);

    try {
      console.log("[Notifications] Fetching from backend...");
      const response = await api("/v1/notifications");

      if (!response?.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format: expected array");
      }

      console.log("[Notifications] Fetched count:", response.data.length);
      setNotifications(response.data);
      hasFetchedOnce.current = true;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "Unknown error";

      console.error("[Notifications] Fetch failed:", {
        message: errorMsg,
        status: error.response?.status,
        url: "/v1/notifications",
        timestamp: new Date().toISOString(),
      });

      if (!hasFetchedOnce.current) {
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReadAll = async () => {
    try {
      await api("/v1/notifications/read-all", { method: "POST" });
      console.log("[Notifications] Marked all as read");
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      Alert.alert("Error", "Could not mark all as read. Please try again.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Pull-to-refresh
  const handleRefresh = () => {
    if (isRefreshing) return;
    fetchNotifications();
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center bg-slate-50 px-5 pt-[30px] pb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Icon
            name="chevron-back"
            size={28}
            color="#000"
            style={{
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 1,
              textShadowColor: "#000",
            }}
          />
        </TouchableOpacity>

        <Text className="text-2xl font-bold flex-1 text-center">
          NOTIFICATION
        </Text>

        <TouchableOpacity onPress={handleReadAll}>
          <Text className="text-sm font-semibold" style={{ color: "#2563EB" }}>
            Read All
          </Text>
        </TouchableOpacity>
      </View>

      <View className="px-5 mt-4 mb-2">
        <Text className="text-base font-bold text-black">
          {notifications.length} notification
          {notifications.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <NotificationCard
            item={item}
            onRemove={() => fetchNotifications()}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#000"]}
            tintColor="#000"
          />
        }
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className="text-slate-500 text-base">
              No notifications yet
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Notifications;
