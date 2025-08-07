// ========================================================================
// FILE: app/jd.js
// This is the Job Details page with Description and Company tabs.
// ========================================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';

// --- Mock Data ---
const MOCK_GALLERY_IMAGES = [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop'
];

// --- Sub-components for the two tabs ---
const DescriptionView = () => (
    <View>
        <Text style={styles.sectionTitle}>Job Description</Text>
        <Text style={styles.bodyText}>Project managers play the lead role in planning, executing, monitoring, controlling, and closing out projects. They are accountable for the entire project scope, the project team, and resources, the project budget, and the success or failure of the project.</Text>

        <Text style={styles.sectionTitle}>Requirements</Text>
        <View>
            <Text style={styles.bulletPoint}>• Bachelor's degree in computer science, business, or a related field</Text>
            <Text style={styles.bulletPoint}>• 5-8 years of project management and related experience</Text>
            <Text style={styles.bulletPoint}>• Project Management Professional (PMP) certification preferred</Text>
            <Text style={styles.bulletPoint}>• Proven ability to solve problems creatively</Text>
        </View>

        <Text style={styles.sectionTitle}>Stipend</Text>
        <Text style={styles.bodyText}>$50 - $75 / Month</Text>
    </View>
);

const CompanyView = () => (
    <View>
        <Text style={styles.sectionTitle}>About us</Text>
        <Text style={styles.bodyText}>Linear is a purpose-built tool for modern product development. Streamline issues, projects, and product roadmaps. Start building. Start building.</Text>

        <Text style={styles.sectionTitle}>Gallery</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryContainer}>
            {MOCK_GALLERY_IMAGES.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.galleryImage} />
            ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.bodyText}>Jl. Jend. Sudirman Kav. 71 Sequis Tower, Level 19, Suite 3 Jakarta, 12190 Indonesia</Text>

        <Text style={styles.sectionTitle}>Hours</Text>
        <Text style={styles.bodyText}>Closed ⋅ opens 9 am</Text>

        <Text style={styles.sectionTitle}>Phone</Text>
        <Text style={styles.bodyText}>0821546789</Text>

        <Text style={styles.sectionTitle}>Website</Text>
        <Text style={styles.bodyText}>https://linear.com</Text>
    </View>
);


const Jd = () => {
    const [activeTab, setActiveTab] = useState('Description');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {/* --- Header --- */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>DETAILS</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* --- Job Info Header --- */}
                <View style={styles.jobHeader}>
                    <View style={styles.jobLogoOuterContainer}>
                        <View style={styles.jobLogoInnerContainer}><View style={styles.logoLine} /></View>
                    </View>
                    <View style={styles.jobHeaderText}>
                        <Text style={styles.jobTitle}>Software Engineer</Text>
                        <Text style={styles.jobLocation}>Linear - Jakarta, ID</Text>
                        <View style={styles.tagContainer}>
                            <Text style={styles.tag}>Full Time</Text>
                            <Text style={styles.tag}>Remote</Text>
                            <Text style={styles.tag}>Senior</Text>
                        </View>
                    </View>
                </View>

                {/* --- Tab Switcher --- */}
                <View style={styles.tabSwitcher}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Description' && styles.activeTab]}
                        onPress={() => setActiveTab('Description')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Description' && styles.activeTabText]}>Description</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Company' && styles.activeTab]}
                        onPress={() => setActiveTab('Company')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Company' && styles.activeTabText]}>Company</Text>
                    </TouchableOpacity>
                </View>

                {/* --- Content based on active tab --- */}
                <View style={styles.contentContainer}>
                    {activeTab === 'Description' ? <DescriptionView /> : <CompanyView />}
                </View>

                {/* Spacer for the apply button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* --- Apply Now Button (Fixed at bottom) --- */}
            <View style={styles.applyButtonContainer}>
                <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Apply Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: '#F9F9F9' },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    jobHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
    jobLogoOuterContainer: { backgroundColor: '#fff', padding: 8, borderRadius: 18, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
    jobLogoInnerContainer: { width: 50, height: 50, backgroundColor: '#4A5568', borderRadius: 12, overflow: 'hidden', transform: [{ rotate: '45deg' }] },
    logoLine: { position: 'absolute', top: 23, left: -10, width: 70, height: 4, backgroundColor: '#FFFFFF' },
    jobHeaderText: { marginLeft: 15, flex: 1 },
    jobTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A202C' },
    jobLocation: { fontSize: 16, color: '#718096', marginTop: 2 },
    tagContainer: { flexDirection: 'row', marginTop: 8 },
    tag: { backgroundColor: '#4A5568', color: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15, marginRight: 10, fontSize: 12, fontWeight: '500' },
    tabSwitcher: { flexDirection: 'row', marginHorizontal: 20, marginTop: 30, backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4 },
    tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    activeTab: { backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    tabText: { fontSize: 16, fontWeight: '600', color: '#4A5568' },
    activeTabText: { color: '#000000' },
    contentContainer: { paddingHorizontal: 20, marginTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    bodyText: { fontSize: 15, color: '#4A5568', lineHeight: 22 },
    bulletPoint: { fontSize: 15, color: '#4A5568', lineHeight: 22, marginBottom: 5, marginLeft: 5 },
    galleryContainer: { marginVertical: 10 },
    galleryImage: { width: 200, height: 120, borderRadius: 10, marginRight: 10 },
    applyButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#F9F9F9', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
    applyButton: { backgroundColor: '#1A202C', paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
    applyButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default Jd;
