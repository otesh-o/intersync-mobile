// app/screens/Saved.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useSavedJobs } from "../context/SavedJobsContext";

const Saved = () => {
  const { savedJobs, setSavedJobs } = useSavedJobs();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    fullTime: false,
    senior: false,
    remote: false,
  });
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  // --- Filter jobs based on search and selected filters ---
  useEffect(() => {
    let filtered = [...savedJobs];

    // Text search
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(lower) ||
          job.company.toLowerCase().includes(lower) ||
          job.location.toLowerCase().includes(lower)
      );
    }

    // Apply filters
    if (activeFilters.fullTime) {
      filtered = filtered.filter((job) => job.type === "Full Time");
    }
    if (activeFilters.senior) {
      filtered = filtered.filter((job) => job.level === "Senior");
    }
    if (activeFilters.remote) {
      filtered = filtered.filter((job) => job.workMode === "Remote");
    }

    setFilteredJobs(filtered);
  }, [searchQuery, activeFilters, savedJobs]);

  // --- Format "time ago" ---
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const savedDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - savedDate) / (1000 * 60));
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // --- Remove job from saved list ---
  const handleRemoveJob = (jobId) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
  };

  // --- Toggle filter ---
  const toggleFilter = (filterKey) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  // --- Reset all filters ---
  const resetFilters = () => {
    setActiveFilters({ fullTime: false, senior: false, remote: false });
  };

  // --- Apply filters and close modal ---
  const applyFilters = () => {
    setFilterModalVisible(false);
  };

  // --- Clear search ---
  const clearSearch = () => {
    setSearchQuery("");
  };

  // --- Render job card ---
  const renderJobCard = ({ item }) => (
    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
      {/* Top row: Logo + info + remove button */}
      <View className="flex-row items-start mb-4">
        <Image
          source={{ uri: item.image || "https://picsum.photos/200/300" }}
          className="w-12 h-12 rounded-lg mr-4"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold text-black mb-1" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-sm text-gray-500 mb-0.5">{item.company}</Text>
          <Text className="text-sm text-gray-500">{item.location}</Text>
        </View>
        <TouchableOpacity
          className="w-8 h-8 justify-center items-center"
          onPress={() => handleRemoveJob(item.id)}
        >
          <Icon name="close" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Salary + saved time */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-bold text-black">
          {item.salary || "—"}
        </Text>
        <Text className="text-xs text-gray-400">
          {formatTimeAgo(item.savedAt)}
        </Text>
      </View>

      {/* Tags */}
      <View className="flex-row flex-wrap mb-4">
        {item.type && (
          <View className="bg-gray-100 rounded-full px-3 py-1.5 mr-2 mb-2">
            <Text className="text-xs text-gray-600 font-medium">
              {item.type}
            </Text>
          </View>
        )}
        {item.level && (
          <View className="bg-gray-100 rounded-full px-3 py-1.5 mr-2 mb-2">
            <Text className="text-xs text-gray-600 font-medium">
              {item.level}
            </Text>
          </View>
        )}
        {item.workMode && (
          <View className="bg-gray-100 rounded-full px-3 py-1.5 mr-2 mb-2">
            <Text className="text-xs text-gray-600 font-medium">
              {item.workMode}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      <Text className="text-sm text-gray-500 leading-5 mb-4" numberOfLines={2}>
        {item.description || "No description available."}
      </Text>

      {/* Apply Button */}
      <TouchableOpacity
        className="bg-black rounded-lg py-3 items-center"
        onPress={() => router.push("./apply")}
      >
        <Text className="text-white text-base font-semibold">Apply Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center bg-slate-50 px-5 pt-[10px] pb-2.5">
        <TouchableOpacity
          className="w-10 h-10 justify-center items-center"
          onPress={() => router.back()}
        >
          <Image
            source={require("../../assets/images/back.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
              tintColor: "#000",
            }}
          />
        </TouchableOpacity>
        <Text className="text-2xl font-bold tracking-wider">SAVED</Text>
        <View className="w-10" /> {/* Spacer */}
      </View>

      {/* Search Bar with Icons */}
      <View className="flex-row items-center bg-white rounded-2xl mx-5 mt-2.5 px-4 shadow-sm">
        {/* 🔍 Search Icon (functional) */}
        <TouchableOpacity className="p-2">
          <Icon name="search" size={20} color="#888" />
        </TouchableOpacity>

        {/* Search Input */}
        <TextInput
          className="flex-1 h-14 text-base"
          placeholder="Search jobs"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />

        {/* ❌ Clear or 🔲 Filter Icon */}
        {searchQuery ? (
          <TouchableOpacity className="p-2" onPress={clearSearch}>
            <Icon name="close" size={20} color="#888" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="p-2"
            onPress={() => setFilterModalVisible(true)}
          >
            <Icon name="options-outline" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Jobs Count */}
      <View className="px-5 mt-6 flex-row justify-between items-center">
        <Text className="text-base font-bold text-black">
          {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"}{" "}
          Saved
        </Text>
        {Object.values(activeFilters).some(Boolean) && (
          <TouchableOpacity onPress={resetFilters}>
            <Text className="text-sm text-blue-500 underline">
              Clear Filters
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Jobs List or Empty State */}
      {filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 20,
          }}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-10 mt-10">
          <Icon name="bookmark-outline" size={80} color="#ccc" />
          <Text className="text-xl font-bold text-gray-500 mt-5 text-center">
            No Saved Jobs Found
          </Text>
          <Text className="text-base text-gray-400 mt-2.5 text-center leading-6">
            {savedJobs.length === 0
              ? "Start liking jobs to save them!"
              : "Try adjusting your search or filters"}
          </Text>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center p-5"
          onPress={() => setFilterModalVisible(false)}
        >
          <Pressable
            className="bg-white rounded-2xl w-full max-w-sm p-6"
            onPress={() => {}}
          >
            <Text className="text-xl font-bold text-black mb-4">Filters</Text>

            {/* Filter Options */}
            <View className="space-y-4">
              <TouchableOpacity
                className={`flex-row items-center p-3 rounded-lg border ${
                  activeFilters.fullTime
                    ? "border-black bg-black/10"
                    : "border-gray-200"
                }`}
                onPress={() => toggleFilter("fullTime")}
              >
                <View
                  className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                    activeFilters.fullTime
                      ? "border-black bg-black"
                      : "border-gray-400"
                  }`}
                >
                  {activeFilters.fullTime && (
                    <Icon name="checkmark" size={12} color="#fff" />
                  )}
                </View>
                <Text className="text-base text-gray-700">Full Time</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center p-3 rounded-lg border ${
                  activeFilters.senior
                    ? "border-black bg-black/10"
                    : "border-gray-200"
                }`}
                onPress={() => toggleFilter("senior")}
              >
                <View
                  className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                    activeFilters.senior
                      ? "border-black bg-black"
                      : "border-gray-400"
                  }`}
                >
                  {activeFilters.senior && (
                    <Icon name="checkmark" size={12} color="#fff" />
                  )}
                </View>
                <Text className="text-base text-gray-700">Senior</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center p-3 rounded-lg border ${
                  activeFilters.remote
                    ? "border-black bg-black/10"
                    : "border-gray-200"
                }`}
                onPress={() => toggleFilter("remote")}
              >
                <View
                  className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                    activeFilters.remote
                      ? "border-black bg-black"
                      : "border-gray-400"
                  }`}
                >
                  {activeFilters.remote && (
                    <Icon name="checkmark" size={12} color="#fff" />
                  )}
                </View>
                <Text className="text-base text-gray-700">Remote</Text>
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <View className="flex-row mt-6 space-x-3">
              <TouchableOpacity
                className="flex-1 py-3 border border-gray-300 rounded-lg"
                onPress={resetFilters}
              >
                <Text className="text-center text-gray-600 font-medium">
                  Reset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 bg-black rounded-lg"
                onPress={applyFilters}
              >
                <Text className="text-center text-white font-medium">
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Saved;
