// app/screens/Saved.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import { useSavedJobs } from "../context/SavedJobsContext"; // ✅ shared context
import { useRouter } from "expo-router"; 

const Saved = () => {
  const { savedJobs, setSavedJobs } = useSavedJobs(); // ✅ use context
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);

  const filterOptions = ["Full-Time", "Senior", "Remote"];

  // --- Filter jobs based on search + filter chip ---
  useEffect(() => {
    let filtered = savedJobs;

    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(lower) ||
          job.company.toLowerCase().includes(lower) ||
          job.location.toLowerCase().includes(lower)
      );
    }

    if (activeFilter) {
      filtered = filtered.filter(
        (job) =>
          job.type === activeFilter ||
          (job.title && job.title.includes(activeFilter)) ||
          (job.tags && job.tags.includes(activeFilter))
      );
    }

    setFilteredJobs(filtered);
  }, [searchQuery, activeFilter, savedJobs]);

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


const router = useRouter();


  // --- Render job card ---
  const renderJobCard = ({ item }) => (
    <View className="bg-white rounded-2xl p-5 mb-4 shadow-md">
      {/* Top row: Logo + info + remove button */}
      <View className="flex-row items-start mb-4">
        <Image
          source={{ uri: item.logo }} // ✅ corrected field
          className="w-12 h-12 rounded-lg mr-4"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold text-black mb-1">
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
      <View className="flex-row mb-4">
        <View className="bg-gray-100 rounded-full px-3 py-1.5 mr-2">
          <Text className="text-xs text-gray-500 font-medium">
            {item.type || "Job"}
          </Text>
        </View>
        <View className="bg-gray-100 rounded-full px-3 py-1.5 mr-2">
          <Text className="text-xs text-gray-500 font-medium">Remote</Text>
        </View>
      </View>

      {/* Short description */}
      <Text className="text-sm text-gray-500 leading-5 mb-4" numberOfLines={2}>
        {item.description || "No description available."}
      </Text>

      {/* Apply button */}
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
        <TouchableOpacity className="w-10 h-10 justify-center items-center">
          <Icon name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-white rounded-2xl mx-5 mt-2.5 px-4 shadow-md">
        <Icon name="search" size={20} color="#888" className="mr-2.5" />
        <TextInput
          className="flex-1 h-14 text-base"
          placeholder="Search jobs"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
      </View>

      {/* Filter Chips + Count */}
      <View className="mt-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-1"
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() =>
                setActiveFilter(activeFilter === filter ? null : filter)
              }
              className={`px-5 py-2.5 mr-3 rounded-full border justify-center ${
                activeFilter === filter
                  ? "bg-black border-black"
                  : "bg-white border-slate-200"
              }`}
              style={{ minWidth: 100, height: 44, justifyContent: "center" }}
            >
              <Text
                className={`text-sm font-medium ${
                  activeFilter === filter ? "text-white" : "text-gray-600"
                }`}
                numberOfLines={1}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Jobs Count */}
        <View className="flex-row justify-between items-center px-5">
          <Text className="text-base font-bold text-black">
            {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"}{" "}
            Available
          </Text>
          <TouchableOpacity>
            <Text className="text-sm text-blue-500 underline">view all</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Jobs List / Empty State */}
      {filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 5 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-10">
          <Icon name="bookmark-outline" size={80} color="#ccc" />
          <Text className="text-xl font-bold text-gray-500 mt-5 text-center">
            No saved jobs found
          </Text>
          <Text className="text-base text-gray-400 mt-2.5 text-center leading-6">
            {savedJobs.length === 0
              ? "Start swiping right on jobs you like!"
              : "Try adjusting your search or filters"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Saved;
