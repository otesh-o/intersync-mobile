// ========================================================================
// FILE: app/components/TutorialOverlay.js
// PURPOSE: An interactive tutorial overlay using NativeWind for styling.
// ========================================================================

import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
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
      return <Image source={comp.source} className="w-12 h-12 rounded-full" />;
    }
    if (comp.type === 'image') {
      // Applies base styles via className and accepts overrides via style prop
      return <Image source={comp.source} className="w-7 h-7 resize-contain" style={comp.style} />;
    }
    if (comp.type === 'icon') {
      return <Icon name={comp.name} size={comp.size} color={comp.color} />;
    }
    return null;
  };

  if (!step) {
    return null;
  }

  return (
    <View className="absolute inset-0 bg-black/[.92] z-[11]">
      {/* The "spotlight" creates a highlighted circle around a UI element */}
      <View
        className="absolute rounded-full justify-center items-center z-[12]"
        style={[step.spotlight, { backgroundColor: step.highlightedComponent?.backgroundColor || '#FFFFFF' }]}
      >
        {renderHighlightedComponent()}
      </View>

      {/* The modal container displays the tutorial text and navigation */}
      <View
        className="absolute w-4/5 bg-white rounded-2xl p-5 items-center z-[13]"
        style={step.modalPosition}
      >
        {step.arrowStyle && (
          <Image
            source={arrowVector}
            className="absolute w-10 h-10 resize-contain z-[14] tint-white"
            style={step.arrowStyle}
          />
        )}
        {step.icon && <Icon name={step.icon} size={28} color="#333" className="mb-2.5" />}
        <Text className="text-lg font-bold text-black text-center mb-2">{step.title}</Text>
        <Text className="text-sm text-gray-600 text-center mb-5 leading-5">{step.text}</Text>
        <TouchableOpacity
          className="bg-black rounded-xl py-3 px-10"
          onPress={onNext}
        >
          <Text className="text-white text-base font-semibold">{isLastStep ? 'Done' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TutorialOverlay;