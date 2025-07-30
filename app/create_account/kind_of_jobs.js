// app/creat.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
} from 'react-native';
import { useRouter } from 'expo-router'; // Import router for navigation

const Creat = () => {
  const router = useRouter(); // Initialize router

  const [roles, setRoles] = useState(['Designer']);
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState(['Remote']);

  const [showRoleInput, setShowRoleInput] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showTypeInput, setShowTypeInput] = useState(false);

  const [roleInput, setRoleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [typeInput, setTypeInput] = useState('');

  const [salaryRange, setSalaryRange] = useState([60, 120]);
  const SLIDER_WIDTH = 280;
  const MIN_VALUE = 0;
  const MAX_VALUE = 200;

  // Add item to tags
  const addItem = (setter, value, resetSetter) => {
    if (value.trim() !== '') {
      setter((prev) => [...prev, value.trim()]);
      resetSetter('');
    }
  };

  // Remove item
  const removeItem = (setter, list, item) => {
    setter(list.filter((i) => i !== item));
  };

  // --- Custom Dual Thumb Slider Logic ---
  const [leftThumb, setLeftThumb] = useState((salaryRange[0] / MAX_VALUE) * SLIDER_WIDTH);
  const [rightThumb, setRightThumb] = useState((salaryRange[1] / MAX_VALUE) * SLIDER_WIDTH);

  const panResponderLeft = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      let newLeft = leftThumb + gestureState.dx;
      if (newLeft < 0) newLeft = 0;
      if (newLeft >= rightThumb - 20) newLeft = rightThumb - 20;
      setLeftThumb(newLeft);
      setSalaryRange([
        Math.round((newLeft / SLIDER_WIDTH) * MAX_VALUE),
        Math.round((rightThumb / SLIDER_WIDTH) * MAX_VALUE),
      ]);
    },
    onPanResponderRelease: () => {},
  });

  const panResponderRight = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      let newRight = rightThumb + gestureState.dx;
      if (newRight > SLIDER_WIDTH) newRight = SLIDER_WIDTH;
      if (newRight <= leftThumb + 20) newRight = leftThumb + 20;
      setRightThumb(newRight);
      setSalaryRange([
        Math.round((leftThumb / SLIDER_WIDTH) * MAX_VALUE),
        Math.round((newRight / SLIDER_WIDTH) * MAX_VALUE),
      ]);
    },
    onPanResponderRelease: () => {},
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>
            What kind of jobs are you looking for?
          </Text>

          {/* Role Section */}
          <Text style={styles.label}>What role do you want to see?</Text>
          <View style={styles.tagContainer}>
            {roles.map((role, index) => (
              <View style={styles.tag} key={index}>
                <Text style={styles.tagText}>{role}</Text>
                <TouchableOpacity
                  onPress={() => removeItem(setRoles, roles, role)}
                >
                  <Text style={styles.remove}> ✕ </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {showRoleInput ? (
            <TextInput
              style={styles.input}
              placeholder="Enter role"
              value={roleInput}
              onChangeText={setRoleInput}
              onSubmitEditing={() => {
                addItem(setRoles, roleInput, setRoleInput);
                setShowRoleInput(false);
              }}
              autoFocus
              returnKeyType="done"
            />
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setShowRoleInput(true);
                setRoleInput("");
              }}
            >
              <Text style={styles.addText}>+ Add role title</Text>
            </TouchableOpacity>
          )}

          {/* Location Section */}
          <Text style={styles.label}>Where do you wish to work?</Text>
          <View style={styles.tagContainer}>
            {locations.map((loc, index) => (
              <View style={styles.tag} key={index}>
                <Text style={styles.tagText}>{loc}</Text>
                <TouchableOpacity
                  onPress={() => removeItem(setLocations, locations, loc)}
                >
                  <Text style={styles.remove}> ✕ </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {showLocationInput ? (
            <TextInput
              style={styles.input}
              placeholder="Enter location"
              value={locationInput}
              onChangeText={setLocationInput}
              onSubmitEditing={() => {
                addItem(setLocations, locationInput, setLocationInput);
                setShowLocationInput(false);
              }}
              autoFocus
              returnKeyType="done"
            />
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setShowLocationInput(true);
                setLocationInput("");
              }}
            >
              <Text style={styles.addText}>+ Add Location</Text>
            </TouchableOpacity>
          )}

          {/* Type Section */}
          <Text style={styles.label}>What type of job fit you better?</Text>
          <View style={styles.tagContainer}>
            {types.map((type, index) => (
              <View style={styles.tag} key={index}>
                <Text style={styles.tagText}>{type}</Text>
                <TouchableOpacity
                  onPress={() => removeItem(setTypes, types, type)}
                >
                  <Text style={styles.remove}> ✕ </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {showTypeInput ? (
            <TextInput
              style={styles.input}
              placeholder="Enter type"
              value={typeInput}
              onChangeText={setTypeInput}
              onSubmitEditing={() => {
                addItem(setTypes, typeInput, setTypeInput);
                setShowTypeInput(false);
              }}
              autoFocus
              returnKeyType="done"
            />
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setShowTypeInput(true);
                setTypeInput("");
              }}
            >
              <Text style={styles.addText}>+ Add type</Text>
            </TouchableOpacity>
          )}

          {/* Salary Section */}
          <Text style={styles.label}>What is your salary range?</Text>
          <View style={styles.sliderWrapper}>
            <View style={styles.track} />
            {/* Left Thumb */}
            <View
              {...panResponderLeft.panHandlers}
              style={[styles.thumb, { left: leftThumb - 10 }]}
            />
            {/* Right Thumb */}
            <View
              {...panResponderRight.panHandlers}
              style={[styles.thumb, { left: rightThumb - 10 }]}
            />
            {/* Selected Track */}
            <View
              style={[
                styles.selectedTrack,
                { left: leftThumb, width: rightThumb - leftThumb },
              ]}
            />
          </View>
          <View style={styles.salaryText}>
            <Text style={styles.salary}>${salaryRange[0]}K</Text>
            <Text style={styles.salary}>${salaryRange[1]}K</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.push("/welcome")} // Navigate to welcome.js
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => router.push("/create_account/agreement")} // Navigate to agreement.js
            >
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10, marginBottom: 6 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: { color: '#000' },
  remove: { color: '#666', marginLeft: 6 },
  addButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  addText: { color: '#000' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  sliderWrapper: {
    width: 280,
    height: 40,
    alignSelf: 'center',
    marginVertical: 20,
  },
  track: {
    height: 4,
    backgroundColor: '#ddd',
    position: 'absolute',
    top: 18,
    left: 0,
    right: 0,
    borderRadius: 2,
  },
  selectedTrack: {
    height: 4,
    backgroundColor: '#000',
    position: 'absolute',
    top: 18,
    borderRadius: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    position: 'absolute',
    top: 10,
  },
  salaryText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  salary: { fontSize: 16, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelText: { color: '#000', fontWeight: '600' },
  okButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#000',
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  okText: { color: '#fff', fontWeight: '600' },
});

export default Creat;
