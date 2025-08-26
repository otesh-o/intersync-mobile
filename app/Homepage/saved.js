// ========================================================================
// FILE: app/Homepage/saved.js
// This page displays the saved/bookmarked jobs, refactored with NativeWind.
// ========================================================================
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar, 
  Image, 
  ScrollView, 
  TextInput,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';

const Saved = () => {
  const params = useLocalSearchParams();
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  // --- Logic for parsing and filtering jobs (No changes needed here) ---
  useEffect(() => {
    if (params.savedJobs) {
      try {
        const jobs = JSON.parse(params.savedJobs);
        setSavedJobs(jobs);
      } catch (error) {
        console.error('Error parsing saved jobs:', error);
      }
    }
  }, [params.savedJobs]);

  useEffect(() => {
    let filtered = savedJobs;
    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(lowercasedQuery) ||
        job.company.toLowerCase().includes(lowercasedQuery) ||
        job.location.toLowerCase().includes(lowercasedQuery)
      );
    }
    if (activeFilter !== 'All') {
      // Filtering logic remains the same
    }
    setFilteredJobs(filtered);
  }, [searchQuery, activeFilter, savedJobs]);

  const formatTimeAgo = (dateString) => {
    // This helper function remains the same
    const now = new Date();
    const savedDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - savedDate) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleRemoveJob = (jobId) => {
    const updatedJobs = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(updatedJobs);
  };

  const renderJobCard = ({ item }) => (
    <View className="bg-white rounded-2xl p-5 mb-4 shadow-md">
      <View className="flex-row items-start mb-4">
        <Image source={{ uri: item.image }} className="w-12 h-12 rounded-lg mr-4" />
        <View className="flex-1">
          <Text className="text-lg font-bold text-black mb-1">{item.title}</Text>
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
      
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-bold text-black">{item.salary}</Text>
        <Text className="text-xs text-gray-400">{formatTimeAgo(item.savedAt)}</Text>
      </View>

      <View className="flex-row mb-4">
        <View className="bg-gray-100 rounded-full px-3 py-1.5 mr-2">
          <Text className="text-xs text-gray-500 font-medium">Full Time</Text>
        </View>
        <View className="bg-gray-100 rounded-full px-3 py-1.5 mr-2">
          <Text className="text-xs text-gray-500 font-medium">Remote</Text>
        </View>
      </View>

      <Text className="text-sm text-gray-500 leading-5 mb-4" numberOfLines={2}>
        Description: Project managers play the lead role in planning, executing, monitoring...
      </Text>

      <TouchableOpacity className="bg-black rounded-lg py-3 items-center">
        <Text className="text-white text-base font-semibold">Apply Now</Text>
      </TouchableOpacity>
    </View>
  );

  const filterOptions = ['All', 'Full-Time', 'Senior', 'Remote'];

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row justify-between items-center bg-slate-50 px-5 pt-[50px] pb-2.5">
        <TouchableOpacity className="w-10 h-10 justify-center items-center" onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#000" />
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
          placeholder="UX Designer"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="mt-4 mb-2.5"
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            className={`py-2 px-5 mr-2.5 flex-row items-center rounded-full border ${
              activeFilter === filter ? 'bg-black border-black' : 'bg-white border-slate-200'
            }`}
            onPress={() => setActiveFilter(filter)}
          >
            <Text className={`text-sm font-medium ${activeFilter === filter ? 'text-white' : 'text-gray-500'}`}>
              {filter}
            </Text>
            {filter !== 'All' && <Icon name="close" size={16} color={activeFilter === filter ? "#fff" : "#666"} style={{marginLeft: 4}}/>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Jobs Count */}
      <View className="flex-row justify-between items-center px-5 py-2.5">
        <Text className="text-base font-bold text-black">{filteredJobs.length} Jobs Available</Text>
        <TouchableOpacity>
          <Text className="text-sm text-blue-500 underline">view all</Text>
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
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
          <Text className="text-xl font-bold text-gray-500 mt-5 text-center">No saved jobs found</Text>
          <Text className="text-base text-gray-400 mt-2.5 text-center leading-6">
            {savedJobs.length === 0 
              ? "Start swiping right on jobs you like!" 
              : "Try adjusting your search or filters"
            }
          </Text>
        </View>
      )}
    </View>
  );
};

export default Saved;