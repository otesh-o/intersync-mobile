// ========================================================================
// FILE: app/Homepage/saved.js
// This page displays the saved/bookmarked jobs that were swiped right
// ========================================================================
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
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

  useEffect(() => {
    // Parse the saved jobs from params
    if (params.savedJobs) {
      try {
        const jobs = JSON.parse(params.savedJobs);
        setSavedJobs(jobs);
        setFilteredJobs(jobs);
      } catch (error) {
        console.error('Error parsing saved jobs:', error);
        setSavedJobs([]);
        setFilteredJobs([]);
      }
    }
  }, [params.savedJobs]);

  useEffect(() => {
    // Filter jobs based on search query and active filter
    let filtered = savedJobs;

    if (searchQuery.trim()) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter !== 'All') {
      filtered = filtered.filter(job => {
        switch (activeFilter) {
          case 'Full-Time':
            return job.title.toLowerCase().includes('engineer') || job.title.toLowerCase().includes('manager');
          case 'Senior':
            return job.title.toLowerCase().includes('senior') || job.salary.includes('120');
          case 'Remote':
            return job.location.toLowerCase().includes('remote');
          default:
            return true;
        }
      });
    }

    setFilteredJobs(filtered);
  }, [searchQuery, activeFilter, savedJobs]);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const savedDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - savedDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} day ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const handleRemoveJob = (jobId) => {
    const updatedJobs = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(updatedJobs);
    setFilteredJobs(updatedJobs.filter(job => {
      let matchesSearch = true;
      if (searchQuery.trim()) {
        matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      job.location.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return matchesSearch;
    }));
  };

  const renderJobCard = ({ item }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Image source={{ uri: item.image }} style={styles.companyLogo} />
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.companyName}>{item.company}</Text>
          <Text style={styles.jobLocation}>{item.location}</Text>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveJob(item.id)}
        >
          <Icon name="close" size={20} color="#999" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.jobDetails}>
        <Text style={styles.salary}>{item.salary}</Text>
        <Text style={styles.savedTime}>{formatTimeAgo(item.savedAt)}</Text>
      </View>

      <View style={styles.tagContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Full Time</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Remote</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Senior</Text>
        </View>
      </View>

      <Text style={styles.jobDescription} numberOfLines={2}>
        Description: Project managers play the lead role in planning, executing, monitoring, controlling, and closing out projects.
      </Text>

      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Apply Now</Text>
      </TouchableOpacity>
    </View>
  );

  const filterOptions = ['All', 'Full-Time', 'Senior', 'Remote'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SAVED</Text>
        <TouchableOpacity style={styles.filterToggle}>
          <Icon name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="UX Designer"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterChipsContainer}
        contentContainerStyle={styles.filterChipsContent}
      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.activeFilterChip
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[
              styles.filterChipText,
              activeFilter === filter && styles.activeFilterChipText
            ]}>
              {filter}
              {filter !== 'All' && <Icon name="close" size={16} color={activeFilter === filter ? "#fff" : "#666"} />}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Jobs Count */}
      <View style={styles.jobsCountContainer}>
        <Text style={styles.jobsCount}>{filteredJobs.length} Jobs Available</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllButton}>view all</Text>
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.jobsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="bookmark-outline" size={80} color="#ccc" />
          <Text style={styles.emptyStateText}>No saved jobs found</Text>
          <Text style={styles.emptyStateSubtext}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F9F9F9',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  filterToggle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 55,
    fontSize: 16,
  },
  filterButton: {
    padding: 10,
  },
  filterChipsContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  filterChipsContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFilterChip: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  jobsCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  jobsCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAllButton: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  jobsList: {
    paddingHorizontal: 20,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  companyName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  salary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  savedTime: {
    fontSize: 12,
    color: '#999',
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  applyButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default Saved;