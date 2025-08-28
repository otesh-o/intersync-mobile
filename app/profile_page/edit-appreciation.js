// app/profile_page/edit-appreciation.js
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_DATA_KEY = "userProfileData";

export default function EditAppreciation() {
  const router = useRouter();
  const { section = "Appreciation" } = useLocalSearchParams();

  const [items, setItems] = useState([
    {
      id: "1",
      title: "",
      description: "",
      date: "",
    },
  ]);

  // Load saved data
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
        const data = saved ? JSON.parse(saved) : {};
        const savedItems = data[section] || [];

        if (savedItems.length > 0) {
          setItems(savedItems);
        }
      } catch (e) {
        console.error("Failed to load appreciation", e);
      }
    };
    load();
  }, [section]);

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addNewItem = () => {
    const newItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
      date: "",
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const removeItem = (id) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    try {
      const saved = await AsyncStorage.getItem(PROFILE_DATA_KEY);
      const data = saved ? JSON.parse(saved) : {};
      data[section] = items;
      await AsyncStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save appreciation", e);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-6 pt-8 pb-4">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Image
            source={require("../../assets/images/back.png")}
            className="w-5 h-5"
            style={{ tintColor: "#555" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-bold text-center text-gray-900 uppercase font-sans">
          Appreciation
        </Text>
        <View className="w-6" /> {/* Spacer */}
      </View>

      {/* Scrollable Form */}
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 20 }}>
        {items.map((item) => (
          <View
            key={item.id}
            className="bg-gray-50 p-4 rounded-lg mb-5 border border-gray-200 relative"
          >
            {/* Remove Button */}
            {items.length > 1 && (
              <TouchableOpacity
                className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full justify-center items-center z-10"
                onPress={() => removeItem(item.id)}
              >
                <Text className="text-white font-bold text-sm">✕</Text>
              </TouchableOpacity>
            )}

            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Title</Text>
              <TextInput
                value={item.title}
                onChangeText={(text) => updateItem(item.id, "title", text)}
                placeholder="e.g. Team Excellence Award 2023"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base font-sans"
              />
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
              <TextInput
                value={item.description}
                onChangeText={(text) => updateItem(item.id, "description", text)}
                placeholder="Received for outstanding contribution..."
                multiline
                textAlignVertical="top"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white min-h-[80] text-base font-sans"
              />
            </View>

            {/* Date Input */}
            <View className="mb-0">
              <Text className="text-sm font-medium text-gray-700 mb-1">Date</Text>
              <TextInput
                value={item.date}
                onChangeText={(text) => updateItem(item.id, "date", text)}
                placeholder="e.g. Jan 2023"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base font-sans"
              />
            </View>
          </View>
        ))}

        {/* Add New Button */}
        <TouchableOpacity className="bg-gray-100 py-3 px-4 rounded-lg self-start" onPress={addNewItem}>
          <Text className="text-black font-medium text-sm">+ Add Another Appreciation</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity className="w-80 h-12 bg-black rounded-full justify-center items-center self-center mb-6 mt-2" onPress={handleSave}>
        <Text className="text-white font-semibold text-base">Save</Text>
      </TouchableOpacity>
    </View>
  );
}