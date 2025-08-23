// ========================================================================
// FILE: app/components/WelcomeOverlay.js
//
// PURPOSE:
// A modal overlay shown to the user on their first visit to the app.
// It provides options to start a quick guide (tutorial) or skip
// the introduction.
// ========================================================================

import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ImageBackground, Keyboard
} from 'react-native';

// Import the background image URL from the centralized data file
import { CARD_BACKGROUND_URL } from '../constants/appData';

/**
 * A modal overlay shown to the user on their first visit.
 * @param {object} props - Component props.
 * @param {() => void} props.onQuickGuide - Function to call when "Quick Guide" is pressed.
 * @param {() => void} props.onSkip - Function to call when "Skip" is pressed.
 */
const WelcomeOverlay = ({ onQuickGuide, onSkip }) => {
  // --- Effects ---
  // Dismiss the keyboard automatically when this overlay is active,
  // preventing it from covering the modal.
  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
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

        <TouchableOpacity style={styles.guideButton} onPress={onQuickGuide}>
          <Text style={styles.guideButtonText}>Quick Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.92)', zIndex: 10, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: '#1C1C1E', borderRadius: 25, alignItems: 'center', padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 20 },
  cardBackground: { width: '100%', height: 200, borderRadius: 20, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  cardTextContainer: { width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', borderRadius: 20, padding: 10 },
  modalTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', fontStyle: 'italic' },
  logoContainer: { width: 70, height: 70, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  logoCircle: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, opacity: 0.9 },
  modalSubtitle: { fontSize: 16, color: '#E0E0E0', marginTop: 10, textAlign: 'center' },
  guideButton: { backgroundColor: '#FFFFFF', paddingVertical: 16, paddingHorizontal: 60, borderRadius: 30, marginTop: 25, marginBottom: 15, elevation: 5, shadowColor: '#fff', shadowOpacity: 0.3, shadowRadius: 10 },
  guideButtonText: { color: '#000000', fontSize: 18, fontWeight: 'bold' },
  skipText: { color: '#A0A0A0', fontSize: 16, padding: 10 },
});

export default WelcomeOverlay;
