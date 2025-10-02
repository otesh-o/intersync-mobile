// app/Homepage/ApplicationTracker.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import { api } from "../services/api";
import ApplicationCard from "../components/ApplicationCard";

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasFetchedOnce = useRef(false);
  const fetchApplications = async () => {
    if (!hasFetchedOnce.current) setIsRefreshing(true);
    setIsRefreshing(true);

    try {
      console.log("[ApplicationTracker] Fetching from backend...");
      const response = await api("/v1/application/user/applications");

      if (!response?.success || !Array.isArray(response.data)) {
        throw new Error("Invalid response format or failed request");
      }

      console.log("[ApplicationTracker] Fetched count:", response.data.length);
      setApplications(response.data);
      hasFetchedOnce.current = true;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "Unknown error";

      console.error("[ApplicationTracker] Fetch failed:", {
        message: errorMsg,
        status: error.response?.status,
        url: "/v1/application/user/applications",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleRefresh = () => {
    if (isRefreshing) return;
    fetchApplications();
  };

  useEffect(() => {
    let filtered = [...applications];

    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter((app) => {
        const jobTitle = (app.jobTitle || "").toLowerCase();
        const companyName = (app.companyName || "").toLowerCase();
        const applicantName = (app.applicantName || "").toLowerCase();

        return (
          jobTitle.includes(lower) ||
          companyName.includes(lower) ||
          applicantName.includes(lower)
        );
      });
    }

    setFilteredApplications(filtered);
  }, [searchQuery, applications]);

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      
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
          APPLICATION TRACKER
        </Text>

        <View className="w-16" />
      </View>

      <View className="mx-5 mt-2.5">
        <View className="flex-row items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
          <TextInput
            className="flex-1 h-10 text-base ml-2"
            placeholder="Search applications"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View className="px-5 mt-4 mb-2">
        <Text className="text-base font-bold text-black">
          {filteredApplications.length} application
          {filteredApplications.length !== 1 ? "s" : ""} tracked
        </Text>
      </View>

      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ApplicationCard application={item} />}
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
              {searchQuery ? "No matches found" : "No applications yet"}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default ApplicationTracker;
