// FILE: hp.js
// This is the new main Home Page screen.
// ========================================================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Mock URLs for images, replace with your actual assets
const PROFILE_PIC_URL = 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?q=80&w=1887&auto=format&fit=crop';
const JOB_IMAGE_URL = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974&auto=format&fit=crop';

const Hp = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
            <TouchableOpacity>
                <Icon name="menu" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>INTERN SYNC</Text>
            <View style={{width: 30}} />
        </View>

        {/* User Welcome Section */}
        <View style={styles.welcomeSection}>
            <View>
                <Text style={styles.helloText}>Hello</Text>
                <Text style={styles.userName}>Emelyn Angga</Text>
            </View>
            <View style={styles.profileActions}>
                 <Image source={{uri: PROFILE_PIC_URL}} style={styles.profilePic} />
                 <TouchableOpacity style={styles.notificationBell}>
                    <Icon name="notifications" size={24} color="#000" />
                    <View style={styles.notificationDot} />
                 </TouchableOpacity>
            </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput placeholder="Search by job name" style={styles.searchInput} />
            <TouchableOpacity style={styles.filterButton}>
                <Icon name="filter" size={24} color="#000" />
            </TouchableOpacity>
        </View>

        {/* Job Card */}
        <View style={styles.jobCard}>
            <View style={styles.jobImageContainer}>
                <Image source={{ uri: JOB_IMAGE_URL }} style={styles.jobImage} />
                <View style={styles.jobLogoContainer}>
                    <View style={styles.jobLogo} />
                </View>
            </View>
            <Text style={styles.jobTitle}>Software Engineer</Text>
            <Text style={styles.jobLocation}>Linear - Jakarta, ID</Text>
            <Text style={styles.jobSalary}>$50 - $75 / Mo</Text>
            <View style={styles.tagContainer}>
                <Text style={styles.tag}>Full Time</Text>
                <Text style={styles.tag}>Remote</Text>
                <Text style={styles.tag}>Senior</Text>
            </View>
            <Text style={styles.jobDescription}>
                Description : Project managers play the lead role in planning, executing, monitoring, controlling, and closing out projects.
            </Text>
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={[styles.actionButton, styles.actionButtonRed]}>
                    <Icon name="close" size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.actionButtonBlack]}>
                    <Icon name="add" size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.actionButtonGreen]}>
                    <Icon name="checkmark" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
      {/* Bottom Tab Bar Placeholder */}
      <View style={styles.bottomNav}>
        <TouchableOpacity><Icon name="person-outline" size={28} color="#888" /></TouchableOpacity>
        <TouchableOpacity><Icon name="home" size={28} color="#000" /></TouchableOpacity>
        <TouchableOpacity><Icon name="bookmark-outline" size={28} color="#888" /></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
    welcomeSection: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20, alignItems: 'center' },
    helloText: { fontSize: 18, color: '#888' },
    userName: { fontSize: 24, fontWeight: 'bold' },
    profileActions: { flexDirection: 'row', alignItems: 'center' },
    profilePic: { width: 50, height: 50, borderRadius: 25 },
    notificationBell: { marginLeft: 15 },
    notificationDot: { position: 'absolute', right: 2, top: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: 'red', borderWidth: 2, borderColor: '#fff' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 15, marginHorizontal: 20, marginTop: 25, paddingHorizontal: 15 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, height: 50, fontSize: 16 },
    filterButton: { padding: 10 },
    jobCard: { backgroundColor: '#fff', borderRadius: 20, margin: 20, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    jobImageContainer: { marginBottom: 15 },
    jobImage: { width: '100%', height: 150, borderRadius: 15 },
    jobLogoContainer: { position: 'absolute', bottom: -20, left: 20, backgroundColor: '#fff', padding: 5, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    jobLogo: { width: 50, height: 50, backgroundColor: '#4A90E2', borderRadius: 10, borderWidth: 5, borderColor: '#fff' },
    jobTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 30 },
    jobLocation: { fontSize: 16, color: '#888', marginTop: 5 },
    jobSalary: { fontSize: 16, color: '#333', fontWeight: 'bold', marginTop: 5 },
    tagContainer: { flexDirection: 'row', marginTop: 15 },
    tag: { backgroundColor: '#EAEAEA', color: '#555', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15, marginRight: 10, fontSize: 12, fontWeight: '500' },
    jobDescription: { fontSize: 14, color: '#666', marginTop: 15, lineHeight: 20 },
    actionButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 25 },
    actionButton: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    actionButtonRed: { backgroundColor: '#D9534F' },
    actionButtonBlack: { backgroundColor: '#383838' },
    actionButtonGreen: { backgroundColor: '#5CB85C' },
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FFF' },
});

export default Hp;