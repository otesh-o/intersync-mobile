// FILE: hpi1.js
// This is the first floating screen.
// ========================================================================
import React from 'react';
import { View, Text, StyleSheet as StyleSheet1, TouchableOpacity as TouchableOpacity1, Modal, StatusBar, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Hpi1 = ({ navigation }) => {
  return (
    <View style={styles1.modalOverlay}>
      <View style={styles1.modalContent}>
        
        <Text style={styles1.modalTitle}>Let's get you ready !</Text>

        <View style={styles1.logoContainer}>
          <View style={styles1.logoCircle} />
        </View>

        <Text style={styles1.modalSubtitle}>Find Your Perfect Opportunity!</Text>
        
        <TouchableOpacity1 
          style={styles1.guideButton}
          onPress={() => navigation.navigate('Hpi2')} // Navigate to the next intro screen
        >
          <Text style={styles1.guideButtonText}>Quick Guide</Text>
        </TouchableOpacity1>

        <View style={styles1.iconButtonsContainer}>
            <TouchableOpacity1 style={[styles1.iconButton, styles1.iconButtonRed]}>
                <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity1>
            <TouchableOpacity1 style={[styles1.iconButton, styles1.iconButtonBlack]}>
                <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity1>
            <TouchableOpacity1 style={[styles1.iconButton, styles1.iconButtonGreen]}>
                <Icon name="checkmark" size={30} color="#fff" />
            </TouchableOpacity1>
        </View>

        {/* This button now skips the intro and goes to the main app */}
        <TouchableOpacity1 onPress={() => navigation.navigate('Hp')}>
          <Text style={styles1.skipText}>Skip</Text>
        </TouchableOpacity1>

      </View>
    </View>
  );
};

const styles1 = StyleSheet1.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#2C2C2E', borderRadius: 20, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 20 },
  modalTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  logoContainer: { width: 100, height: 100, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 25 },
  logoCircle: { width: 50, height: 50, backgroundColor: '#fff', borderRadius: 25, opacity: 0.8 },
  modalSubtitle: { fontSize: 16, color: '#E0E0E0', marginTop: 15, textAlign: 'center' },
  guideButton: { backgroundColor: '#FFFFFF', paddingVertical: 16, paddingHorizontal: 50, borderRadius: 30, marginTop: 35, marginBottom: 20 },
  guideButtonText: { color: '#000000', fontSize: 18, fontWeight: 'bold' },
  iconButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
  iconButton: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  iconButtonRed: { backgroundColor: '#D9534F' },
  iconButtonBlack: { backgroundColor: '#383838' },
  iconButtonGreen: { backgroundColor: '#5CB85C' },
  skipText: { color: '#A0A0A0', fontSize: 16, marginTop: 30 },
});

export default Hpi1;