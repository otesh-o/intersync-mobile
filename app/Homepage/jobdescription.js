// ========================================================================
// FILE: app/jd.js - Back to Working Step 2
// ========================================================================
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

// --- Sub-components for the two tabs ---
const DescriptionView = () => (
    <View>
        <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">Job Description</Text>
        <Text className="text-base text-slate-600 leading-6">Project managers play the lead role in planning, executing, monitoring, controlling, and closing out projects.</Text>

        <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">Requirements</Text>
        <View>
            <Text className="text-base text-slate-600 leading-6 mb-1.5 ml-1">• Bachelor's degree in computer science</Text>
            <Text className="text-base text-slate-600 leading-6 mb-1.5 ml-1">• 5-8 years of project management experience</Text>
        </View>

        <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">Stipend</Text>
        <Text className="text-base text-slate-600 leading-6">$50 - $75 / Month</Text>
    </View>
);

const CompanyView = () => (
    <View>
        <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">About us</Text>
        <Text className="text-base text-slate-600 leading-6">Linear is a purpose-built tool for modern product development.</Text>

        <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">Address</Text>
        <Text className="text-base text-slate-600 leading-6">Jakarta, Indonesia</Text>

        <Text className="text-lg font-bold text-slate-800 mt-5 mb-2.5">Phone</Text>
        <Text className="text-base text-slate-600 leading-6">0821546789</Text>
    </View>
);

const Jd = () => {
    const [activeTab, setActiveTab] = useState('Description');
    const router = useRouter();

    const handleBackPress = () => {
        router.back();
    };

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="dark-content" />
            
            {/* --- Header --- */}
            <View className="flex-row justify-between items-center bg-slate-50 px-5 pt-[50px] pb-4">
                <TouchableOpacity onPress={handleBackPress} className="p-1">
                    <Icon name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-bold">DETAILS</Text>
                <View className="w-10" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* --- Job Info Header --- */}
                <View className="flex-row items-center px-5 mt-2.5">
                    <View className="bg-white p-2 rounded-2xl" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 }}>
                        <View className="w-12 h-12 bg-slate-600 rounded-xl" />
                    </View>
                    <View className="ml-4 flex-1">
                        <Text className="text-2xl font-bold text-slate-800">Software Engineer</Text>
                        <Text className="text-base text-slate-500 mt-0.5">Linear - Jakarta, ID</Text>
                        <View className="flex-row mt-2">
                            <Text className="bg-slate-600 text-white text-xs font-medium mr-2.5 px-3 py-1 rounded-2xl">Full Time</Text>
                            <Text className="bg-slate-600 text-white text-xs font-medium mr-2.5 px-3 py-1 rounded-2xl">Remote</Text>
                            <Text className="bg-slate-600 text-white text-xs font-medium mr-2.5 px-3 py-1 rounded-2xl">Senior</Text>
                        </View>
                    </View>
                </View>

                {/* --- Tab Switcher --- */}
                <View className="flex-row mx-5 mt-8 bg-slate-200 rounded-xl p-1">
                    <TouchableOpacity
                        className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'Description' ? 'bg-white' : ''}`}
                        style={activeTab === 'Description' ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 } : {}}
                        onPress={() => setActiveTab('Description')}
                    >
                        <Text className={`text-base font-semibold ${activeTab === 'Description' ? 'text-black' : 'text-slate-600'}`}>Description</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'Company' ? 'bg-white' : ''}`}
                        style={activeTab === 'Company' ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 } : {}}
                        onPress={() => setActiveTab('Company')}
                    >
                        <Text className={`text-base font-semibold ${activeTab === 'Company' ? 'text-black' : 'text-slate-600'}`}>Company</Text>
                    </TouchableOpacity>
                </View>

                {/* --- Content based on active tab --- */}
                <View className="px-5 mt-5">
                    {activeTab === 'Description' ? <DescriptionView /> : <CompanyView />}
                </View>

                {/* Spacer for the apply button */}
                <View className="h-24" />
            </ScrollView>

            {/* --- Apply Now Button (Fixed at bottom) --- */}
            <View className="absolute bottom-0 left-0 right-0 p-5 bg-slate-50 border-t border-slate-200">
                <TouchableOpacity className="bg-slate-800 py-4 rounded-2xl items-center">
                    <Text className="text-white text-lg font-bold">Apply Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Jd;