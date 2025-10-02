// app/Homepage/notifications.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity, // ✅ Added here
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";

import { api } from "../services/api";
import NotificationCard from "../components/NotificationCard";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasFetchedOnce = useRef(false);

  // Fetch notifications from backend
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
        // Optionally show alert on initial load failure
        // Alert.alert("Error", "Could not load notifications.");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Mark all as read
  const handleReadAll = async () => {
    try {
      await api("/v1/notifications/read-all", { method: "POST" });
      console.log("[Notifications] Marked all as read");
      // Optionally refetch to update any "unread" indicators
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      Alert.alert("Error", "Could not mark all as read. Please try again.");
    }
  };

  // Initial load
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
      {/* Header */}
      <View className="flex-row justify-between items-center bg-slate-50 px-5 pt-[30px] pb-2.5">
        {/* Back Button - Left */}
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../../assets/images/back.png")}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Title - Center */}
        <Text className="text-2xl font-bold tracking-wider flex-1 text-center">
          NOTIFICATIONS
        </Text>

        {/* Read All - Right */}
        <TouchableOpacity onPress={handleReadAll}>
          <Text
            className="text-sm font-semibold"
            style={{ color: "#2563EB" }} // blue-600
          >
            Read All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Count */}
      <View className="px-5 mt-4 mb-2">
        <Text className="text-base font-bold text-black">
          {notifications.length} notification
          {notifications.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <NotificationCard
            item={item}
            onRemove={() => fetchNotifications()} // Refetch after delete
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
