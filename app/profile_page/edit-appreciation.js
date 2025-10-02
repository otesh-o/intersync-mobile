// app/profile_page/edit-appreciation.js
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useProfile } from "../context/ProfileContext";

export default function EditAppreciation() {
  const router = useRouter();
  const { refreshProfile } = useProfile(); 

  const [items, setItems] = useState([
    {
      id: "new-1",
      title: "",
      issuer: "",
      date: "",
      description: "",
      url: "",
    },
  ]);

  useEffect(() => {
    loadAppreciation();
  }, []);

  const loadAppreciation = async () => {
    try {
      const response = await api("/v1/user/profile");
      const serverData = response.user.appreciation || [];

      if (serverData.length > 0) {
        const mapped = serverData.map((item) => ({
          id: item._id || Date.now().toString(),
          title: item.title || "",
          issuer: item.issuer || "",
          date: item.date?.split("T")[0] || "", 
          description: item.description || "",
          url: item.url || "",
        }));
        setItems(mapped);
      }
    } catch (error) {
      console.error("Failed to load appreciation:", error);
      Alert.alert("Error", error.message || "Could not load appreciation.");
      
    }
  };

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addNewItem = () => {
    const newItem = {
      id: `new-${Date.now()}`,
      title: "",
      issuer: "",
      date: "",
      description: "",
      url: "",
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const removeItem = (id) => {
    if (items.length <= 1) {
      Alert.alert("At least one entry required");
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    
    const hasEmptyRequired = items.some((item) => !item.title.trim());
    if (hasEmptyRequired) {
      Alert.alert("Missing Info", "Please fill in the title for all entries.");
      return;
    }

    try {
      const formatted = items.map(({ id, ...item }) => ({
        title: item.title.trim(),
        issuer: item.issuer?.trim() || "",
        date: item.date || "",
        description: item.description?.trim() || "",
        url: item.url?.trim() || "",
      }));

      await api("/v1/user/profile", {
        method: "PUT",
        body: JSON.stringify({ appreciation: formatted }),
      });

      await refreshProfile();

      Alert.alert("Success", "Appreciation updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("Save Failed", error.message || "Could not save. Try again.");
    }
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
        <View className="w-6" />
      </View>

      {/* Scrollable Form */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {items.map((item) => (
          <View
            key={item.id}
            className="bg-gray-50 p-4 rounded-lg mb-5 border border-gray-200 relative"
          >
            {items.length > 1 && (
              <TouchableOpacity
                className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full justify-center items-center z-10"
                onPress={() => removeItem(item.id)}
              >
                <Text className="text-white font-bold text-sm">✕</Text>
              </TouchableOpacity>
            )}

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Title *
              </Text>
              <TextInput
                value={item.title}
                onChangeText={(text) => updateItem(item.id, "title", text)}
                placeholder="e.g. Team Excellence Award 2023"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base font-sans"
                maxLength={100}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Issuer
              </Text>
              <TextInput
                value={item.issuer}
                onChangeText={(text) => updateItem(item.id, "issuer", text)}
                placeholder="e.g. Young Scientists"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base font-sans"
                maxLength={80}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Date
              </Text>
              <TextInput
                value={item.date}
                onChangeText={(text) => updateItem(item.id, "date", text)}
                placeholder="YYYY-MM-DD"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base font-sans"
                keyboardType="number-pad"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Description
              </Text>
              <TextInput
                value={item.description}
                onChangeText={(text) =>
                  updateItem(item.id, "description", text)
                }
                placeholder="Received for outstanding contribution..."
                multiline
                textAlignVertical="top"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white min-h-[80] text-base font-sans"
                maxLength={300}
              />
            </View>

            <View className="mb-0">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Certificate URL
              </Text>
              <TextInput
                value={item.url}
                onChangeText={(text) => updateItem(item.id, "url", text)}
                placeholder="https://example.com/cert"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-base font-sans"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>
        ))}

        <TouchableOpacity
          className="bg-gray-100 py-3 px-4 rounded-lg self-start"
          onPress={addNewItem}
        >
          <Text className="text-black font-medium text-sm">
            + Add Another Appreciation
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        className="w-80 h-12 bg-black rounded-full justify-center items-center self-center mb-6 mt-2"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold text-base">Save</Text>
      </TouchableOpacity>
    </View>
  );
}
