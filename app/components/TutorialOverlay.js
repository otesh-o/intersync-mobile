// ========================================================================
// FILE: app/components/TutorialOverlay.js
//
// PURPOSE:
// An interactive tutorial overlay to guide new users through the app's
// main features. It highlights specific UI elements and displays
// corresponding informational text for each step.
// ========================================================================

import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Import the tutorial steps and other necessary assets/data
import { TUTORIAL_STEPS, arrowVector } from '../constants/appData';

/**
 * An interactive tutorial overlay to guide new users.
 * @param {object} props - Component props.
 * @param {number} props.currentStep - The index of the current tutorial step.
 * @param {() => void} props.onNext - Function to proceed to the next step or finish.
 */
const TutorialOverlay = ({ currentStep, onNext }) => {
  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  // Dismiss the keyboard automatically when the tutorial is active.
  useEffect(() => {
    Keyboard.dismiss();
  }, [currentStep]);

  /**
   * Renders the specific UI component that is being highlighted in the
   * current tutorial step (e.g., an icon, an image).
   */
  const renderHighlightedComponent = () => {
    const comp = step.highlightedComponent;
    if (!comp) return null;
    
    // Handle different types of components to highlight
    if (comp.type === 'image' && comp.source.uri) {
        return <Image source={comp.source} style={styles.highlightedProfilePic} />;
    }
    if (comp.type === 'image') {
        return <Image source={comp.source} style={[styles.navIcon, comp.style]} />;
    }
    if (comp.type === 'icon') {
        return <Icon name={comp.name} size={comp.size} color={comp.color} />;
    }
    return null;
  };

  if (!step) {
    // Return null or a loading indicator if the step data isn't available yet
    return null;
  }

  return (
    <View style={styles.overlay}>
      {/* The "spotlight" creates a highlighted circle around a UI element */}
      <View style={[styles.spotlight, step.spotlight, { backgroundColor: step.highlightedComponent?.backgroundColor || '#FFFFFF' }]}>
        {renderHighlightedComponent()}
      </View>

      {/* The modal container displays the tutorial text and navigation */}
      <View style={[styles.modalContainer, step.modalPosition]}>
        {step.arrowStyle && <Image source={arrowVector} style={[styles.arrowImage, step.arrowStyle]} />}
        {step.icon && <Icon name={step.icon} size={28} color="#333" style={styles.icon} />}
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.text}>{step.text}</Text>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>{isLastStep ? 'Done' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.92)', zIndex: 11 },
  spotlight: { position: 'absolute', borderRadius: 999, zIndex: 12, justifyContent: 'center', alignItems: 'center' },
  highlightedProfilePic: { width: 50, height: 50, borderRadius: 25 },
  navIcon: { width: 28, height: 28, resizeMode: 'contain' },
  modalContainer: { width: '80%', backgroundColor: '#FFFFFF', borderRadius: 15, padding: 20, alignItems: 'center', position: 'absolute', zIndex: 13 },
  icon: { marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 8, textAlign: 'center' },
  text: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  nextButton: { backgroundColor: '#000', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 40 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  arrowImage: { width: 40, height: 40, position: 'absolute', resizeMode: 'contain', zIndex: 14, tintColor: '#FFFFFF' },
});

export default TutorialOverlay;
