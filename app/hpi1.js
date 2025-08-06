// ========================================================================
// FILE: app/hpi1.js
// This file is updated to navigate to hp.js and trigger the tutorial.
// ========================================================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';

const Hpi1 = () => {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Let's get you ready !</Text>
        <View style={styles.logoContainer}><View style={styles.logoCircle} /></View>
        <Text style={styles.modalSubtitle}>Find Your Perfect Opportunity!</Text>

        <TouchableOpacity
          style={styles.guideButton}
          onPress={() => router.replace({ pathname: '/hp', params: { startTutorial: 'true' } })}
        >
          <Text style={styles.guideButtonText}>Start Guide</Text>
        </TouchableOpacity>

        <View style={styles.iconButtonsContainer}>
            <TouchableOpacity style={[styles.iconButton, styles.iconButtonRed]}><Icon name="close" size={30} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, styles.iconButtonBlack]}><Icon name="add" size={30} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, styles.iconButtonGreen]}><Icon name="checkmark" size={30} color="#fff" /></TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace('/hp')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#2C2C2E', borderRadius: 20, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 20 },
  modalTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  logoContainer: { width: 100, height: 100, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 25 },
  logoCircle: { width: 50, height: 50, backgroundColor: '#fff', borderRadius: 25, opacity: 0.8 },
  modalSubtitle: { fontSize: 16, color: '#E0E0E0', marginTop: 15, textAlign: 'center' },
  guideButton: { backgroundColor: '#FFFFFF', paddingVertical: 16, paddingHorizontal: 60, borderRadius: 30, marginTop: 35, marginBottom: 20 },
  guideButtonText: { color: '#000000', fontSize: 18, fontWeight: 'bold' },
  iconButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
  iconButton: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  iconButtonRed: { backgroundColor: '#D9534F' },
  iconButtonBlack: { backgroundColor: '#383838' },
  iconButtonGreen: { backgroundColor: '#5CB85C' },
  skipText: { color: '#A0A0A0', fontSize: 16, marginTop: 30 },
});

export default Hpi1;
