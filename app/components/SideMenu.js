// ========================================================================
// FILE: app/components/SideMenu.js
//
// PURPOSE:
// A reusable, animated, slide-in side menu for app navigation.
// It includes a backdrop that closes the menu when pressed.
// ========================================================================

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Import the profile picture URL from the centralized data file
import { PROFILE_PIC_URL } from '../constants/appData';

/**
 * A slide-in side menu for navigation.
 * @param {object} props - Component props.
 * @param {boolean} props.isVisible - Controls the visibility of the menu.
 * @param {() => void} props.onClose - Function to close the menu.
 * @param {Animated.Value} props.slideAnim - Animated value for the slide-in/out transition.
 */
const SideMenu = ({ isVisible, onClose, slideAnim }) => {
  // --- Menu Items Configuration ---
  const menuItems = [
    { id: 'internships', icon: 'wifi-outline', title: 'Internships' },
    { id: 'activity', icon: 'grid-outline', title: 'Activity' },
    { id: 'volunteer', icon: 'heart-outline', title: 'Volunteer' },
  ];

  const handleMenuItemPress = (itemId) => {
    console.log(`Menu item pressed: ${itemId}`);
    onClose();
    // In a real app, you would add navigation logic here, e.g.:
    // router.push(`/some-path/${itemId}`);
  };

  return (
    <>
      {/* The backdrop is only rendered when the menu is visible. 
        Pressing it will trigger the onClose function.
      */}
      {isVisible && <TouchableOpacity style={styles.menuBackdrop} onPress={onClose} activeOpacity={1} />}
      
      {/* The main menu container. Its horizontal position is controlled
        by the animated 'slideAnim' value.
      */}
      <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.menuHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.menuTitle}>InternSync</Text>
        </View>

        <View style={styles.menuProfileSection}>
          <Image source={{ uri: PROFILE_PIC_URL }} style={styles.menuProfilePic} />
          <View style={styles.menuProfileInfo}>
            <Text style={styles.menuGreeting}>Hello</Text>
            <Text style={styles.menuUserName}>Emelyn Angga</Text>
          </View>
        </View>

        <View style={styles.menuWhiteSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handleMenuItemPress(item.id)}>
              <View style={styles.menuItemIconContainer}>
                <Icon name={item.icon} size={22} color="#718096" />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  menuBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 99 },
  sideMenu: { position: 'absolute', top: 0, left: 0, width: 280, height: '100%', backgroundColor: '#2B3D5A', zIndex: 100, paddingTop: 60 },
  menuHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, marginBottom: 20 },
  closeButton: { marginRight: 12, padding: 4 },
  menuTitle: { color: '#fff', fontSize: 18, fontWeight: '600', letterSpacing: 0.5 },
  menuProfileSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 30, marginBottom: 30, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
  menuProfilePic: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  menuProfileInfo: { flex: 1 },
  menuGreeting: { color: '#94A3B8', fontSize: 14, marginBottom: 2 },
  menuUserName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  menuWhiteSection: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, marginBottom: 8, borderRadius: 12 },
  menuItemIconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuItemText: { color: '#4A5568', fontSize: 15, fontWeight: '500' },
});

export default SideMenu;
