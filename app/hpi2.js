// FILE: hpi2.js
// This is the second floating screen.
// ========================================================================
import React from 'react';
import { View, Text, StyleSheet as StyleSheet2, TouchableOpacity as TouchableOpacity2 } from 'react-native';

const Hpi2 = ({ navigation }) => {
  return (
    <View style={styles2.container}>
      <Text style={styles2.text}>This is the Second Intro Page!</Text>
      <Text style={styles2.subtext}>(hpi2.js)</Text>
      <TouchableOpacity2 
        style={styles2.button}
        onPress={() => navigation.navigate('Hp')} // This button now finishes the intro and goes to the main app
      >
        <Text style={styles2.buttonText}>Finish</Text>
      </TouchableOpacity2>
    </View>
  );
};

const styles2 = StyleSheet2.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.75)' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  subtext: { fontSize: 16, color: '#AAAAAA', marginTop: 10 },
  button: { marginTop: 30, backgroundColor: '#1E90FF', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default Hpi2;
