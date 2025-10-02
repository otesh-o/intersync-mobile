// app/Homepage/saved.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  Alert,
} from "react-native";

import { api } from "../services/api"; // Assuming `api` handles auth/errors
import SavedJobCard from "../components/SavedJobCard";

const Saved = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Separate initial load

  const hasFetchedOnce = useRef(false);

  // Fetch from backend
  const fetchSavedJobs = async () => {
    if (!hasFetchedOnce.current) setIsLoading(true);
    setIsRefreshing(true);

    try {
      console.log("[Saved] Fetching saved jobs from backend...");
      const response = await api("/v1/bookmark/user");

      // Validate structure
      if (!response?.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format: expected array");
      }

      console.log("[Saved] Fetched jobs count:", response.data.length);
      setSavedJobs(response.data);
      hasFetchedOnce.current = true;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";

      console.error("[Saved] Failed to fetch saved jobs:", {
        message: errorMsg,
        status: error.response?.status,
        url: "/v1/bookmark/user",
        timestamp: new Date().toISOString(),
      });

      // Show user-friendly alert only if needed
      if (isRefreshing && !hasFetchedOnce.current) {
        Alert.alert("Load Failed", "Could not load saved jobs. Please retry.");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSavedJobs();
  }, []);

  // Pull-to-refresh handler
  const handleRefresh = () => {
    if (isRefreshing) return; // Prevent duplicate calls
    fetchSavedJobs();
  };

  // Filter jobs based on search query
  useEffect(() => {
    let filtered = [...savedJobs];

    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.jobTitle || item.title || "").toLowerCase().includes(lower) ||
          (typeof item.company === "string"
            ? item.company
            : item.company?.name || ""
          )
            .toLowerCase()
            .includes(lower) ||
          (item.location || "").toLowerCase().includes(lower)
      );
    }

    setFilteredJobs(filtered);
  }, [searchQuery, savedJobs]);

  // Loading placeholder
  if (isLoading && !isRefreshing) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <StatusBar barStyle="dark-content" />
        <Text className="text-lg text-slate-600">Loading saved jobs...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center bg-slate-50 px-5 pt-[30px] pb-2.5">
        <View style={{ width: 24 }} />
        <Text className="text-2xl font-bold tracking-wider">SAVED</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View className="mx-5 mt-2.5">
        <View className="flex-row items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
          <TextInput
            className="flex-1 h-10 text-base ml-2"
            placeholder="Search jobs"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Jobs Count */}
      <View className="px-5 mt-4 mb-2">
        <Text className="text-base font-bold text-black">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
          available
        </Text>
      </View>

      {/* Job List */}
      <FlatList
        data={filteredJobs}
        keyExtractor={(item, index) => `${item._id || item.id || index}`}
        renderItem={({ item }) => (
          <SavedJobCard item={item} onRemove={() => fetchSavedJobs()} />
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
              {searchQuery ? "No matches found" : "No saved jobs yet"}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Saved;
