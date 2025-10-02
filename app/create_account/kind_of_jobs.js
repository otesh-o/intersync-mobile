// app/creat.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

export default function Creat() {
  const router = useRouter();

  const [jobType, setJobType] = useState("Remote"); 

  
  const [locations, setLocations] = useState([]);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  
  const addLocation = () => {
    if (locationInput.trim()) {
      setLocations([...locations, locationInput.trim()]);
      setLocationInput("");
      setShowLocationInput(false);
    }
  };

  
  const removeLocation = (loc) => {
    setLocations(locations.filter((l) => l !== loc));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="px-6 py-8">
          
          <Text className="text-2xl font-bold text-gray-900 pt-20 mb-8">
            What kind of jobs are you looking for?
          </Text>

          
          <Text className="text-base font-semibold text-gray-800 mb-4">
            What type of job fits you better?
          </Text>

          <View className="space-y-3 mb-8">
            {["Full Time", "Remote", "Hybrid"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setJobType(type)}
                className={`flex-row items-center p-4 border-2 rounded-xl ${
                  jobType === type
                    ? "border-black bg-black/5"
                    : "border-gray-200"
                }`}
              >
                
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    jobType === type
                      ? "border-black bg-black"
                      : "border-gray-400"
                  }`}
                >
                  {jobType === type && (
                    <View className="w-2 h-2 rounded-full bg-white" />
                  )}
                </View>
                <Text
                  className={`text-base ${
                    jobType === type
                      ? "font-bold text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          
          <Text className="text-base font-semibold text-gray-800 mb-4">
            Where do you wish to work?
          </Text>

          <View className="flex-row flex-wrap mb-4">
            {locations.map((loc, index) => (
              <View
                key={index}
                className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mr-2 mb-2"
              >
                <Text className="text-gray-800">{loc}</Text>
                <TouchableOpacity onPress={() => removeLocation(loc)}>
                  <Text className="text-gray-500 ml-2 font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {showLocationInput ? (
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
              placeholder="Enter location"
              value={locationInput}
              onChangeText={setLocationInput}
              onSubmitEditing={addLocation}
              autoFocus
              returnKeyType="done"
            />
          ) : (
            <TouchableOpacity
              className="border border-gray-300 rounded-lg px-4 py-3 mb-8"
              onPress={() => {
                setShowLocationInput(true);
                setLocationInput("");
              }}
            >
              <Text className="text-gray-800">+ Add Location</Text>
            </TouchableOpacity>
          )}

          
          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="flex-1 bg-gray-100 py-4 rounded-lg items-center"
              onPress={() => router.push("/welcome")}
            >
              <Text className="text-gray-900 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-black py-4 rounded-lg items-center"
              onPress={() => router.push("/create_account/agreement")}
            >
              <Text className="text-white font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
