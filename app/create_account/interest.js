// interest.js

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

const interestsList = [
  "Computer Science",
  "Engineering",
  "Artificial Intelligence",
  "Data Science",
  "Software Development",
  "Design",
  "Business & Management",
  "Healthcare",
  "Education & Teaching",
  "Law & Policy",
  "Art",
  "Marketing & Communications",
  "Finance & Accounting",
  "Science & Research",
  "Media & Journalism",
];


const Interest = () => {
  const [selected, setSelected] = useState([]);
  const router = useRouter();

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <Text style={styles.close}>✕</Text>

        <Text style={styles.title}>Opportunities</Text>
        <Text style={styles.subtitle}>
          Select areas you’re most interested in. This helps us connect you with
          the right opportunities.
        </Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.chipsWrapper}>
            {interestsList.map((item, index) => {
              const isSelected = selected.includes(item);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => toggleInterest(item)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/create_account/kind_of_jobs")}
        >
          <Text style={styles.buttonText}>Continue 2/5</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  close: {
    fontSize: 28,
    alignSelf: "flex-start",
    color: "#666",
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#111", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
  scrollContainer: { flexGrow: 1 },
  chipsWrapper: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: "#000", borderColor: "#000" },
  chipText: { fontSize: 14, color: "#666" },
  chipTextSelected: { color: "#fff", fontWeight: "bold" },
  button: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default Interest;

