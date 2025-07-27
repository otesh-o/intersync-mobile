// app/agreement.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const Agreement = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Arrow */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.header}>INTERN SYNC</Text>

        {/* Welcome Text */}
        <Text style={styles.title}>Welcome to Intern Sync</Text>
        <Text style={styles.subtitle}>
          Please follow these House Rules.
        </Text>

        {/* Rules */}
        <View style={styles.ruleContainer}>
          <Text style={styles.ruleTitle}>✓ Be yourself.</Text>
          <Text style={styles.ruleText}>
            Make sure your photos, age, and bio are true to who you are.
          </Text>
        </View>

        <View style={styles.ruleContainer}>
          <Text style={styles.ruleTitle}>✓ Stay safe.</Text>
          <Text style={styles.ruleText}>
            Don’t be too quick to give out personal information.
            <Text style={styles.link}> Date Safely</Text>
          </Text>
        </View>

        <View style={styles.ruleContainer}>
          <Text style={styles.ruleTitle}>✓ Play it cool.</Text>
          <Text style={styles.ruleText}>
            Respect others and treat them as you would like to be treated.
          </Text>
        </View>

        <View style={styles.ruleContainer}>
          <Text style={styles.ruleTitle}>✓ Be proactive.</Text>
          <Text style={styles.ruleText}>
            Always report bad behavior.
          </Text>
        </View>

        {/* I Agree Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/payment_plan/access')}
        >
          <Text style={styles.buttonText}>I Agree</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  backArrow: { fontSize: 28, color: '#444', marginBottom: 20 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000'
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  ruleContainer: { marginBottom: 20 },
  ruleTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  ruleText: { fontSize: 14, color: '#555' },
  link: { color: '#007AFF' },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 }
});

export default Agreement;
