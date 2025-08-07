// ========================================================================
// FILE: app/hpi1.js
// This version removes the cross, plus, and tick action buttons for a
// cleaner design.
// ========================================================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';

// Mock URL for the background image inside the card
const CARD_BACKGROUND_URL = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop';

const Hpi1 = () => {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <ImageBackground
            source={{ uri: CARD_BACKGROUND_URL }}
            style={styles.cardBackground}
            imageStyle={{ borderRadius: 20 }}
        >
            <View style={styles.cardTextContainer}>
                <Text style={styles.modalTitle}>Let's get you ready !</Text>
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle} />
                </View>
                <Text style={styles.modalSubtitle}>Find Your Perfect Opportunity!</Text>
            </View>
        </ImageBackground>

        <TouchableOpacity
          style={styles.guideButton}
          onPress={() => router.replace({ pathname: '/Homepage/hp', params: { startTutorial: 'true' } })}
        >
          <Text style={styles.guideButtonText}>Quick Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/Homepage/hp')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20
  },
  cardBackground: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardTextContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  logoContainer: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  logoCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    opacity: 0.9
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    marginTop: 10,
    textAlign: 'center'
  },
  guideButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 25,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#fff',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  guideButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold'
  },
  skipText: {
    color: '#A0A0A0',
    fontSize: 16,
    marginTop: 15,
    padding: 10,
  },
});

export default Hpi1;
