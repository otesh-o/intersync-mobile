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
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import { api } from "../services/api";
import SavedJobCard from "../components/SavedJobCard";

const Saved = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const hasFetchedOnce = useRef(false);

 
  const fetchSavedJobs = async () => {
    if (!hasFetchedOnce.current) setIsLoading(true);
    setIsRefreshing(true);

    try {
      console.log("[Saved] Fetching saved jobs from backend...");
      const response = await api("/v1/bookmark/user");

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

      if (isRefreshing && !hasFetchedOnce.current) {
        Alert.alert("Load Failed", "Could not load saved jobs. Please retry.");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRefresh = () => {
    if (isRefreshing) return;
    fetchSavedJobs();
  };

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

        <Text className="text-2xl font-bold flex-1 text-center">SAVED</Text>

        <View className="w-16" />
      </View>

      <View className="mx-5 mt-2.5">
        <View className="flex-row items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
          <TextInput
            className="flex-1 h-10 text-base"
            placeholder="Search jobs"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            onPress={() => {
              // TODO: Open filter modal or navigate to filter screen
              Alert.alert("Filter", "Filter functionality coming soon!");
            }}
            className="p-2 ml-2"
            accessibilityLabel="Open filters"
          >
            <Icon name="filter" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-5 mt-4 mb-2">
        <Text className="text-base font-bold text-black">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
          available
        </Text>
      </View>

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

