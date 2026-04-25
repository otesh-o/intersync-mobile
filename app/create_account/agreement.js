// app/agreement.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons as Icon } from "@expo/vector-icons";

const logo = require("../../assets/images/logo.png"); // Adjust path if needed

export default function Agreement() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        contentContainerClassName="px-5 py-4 items-center"
        className="flex-1"
        style={{ maxWidth: 420, alignSelf: "center", width: "100%" }}
      >
        {/* Header with back button and logo */}
        <View className="pt-6 px-5 w-full flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
            <Icon name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          {/* Logo instead of "INTERNSYNC" text */}
          <Image
            source={logo}
            className="w-[120px] h-[120px]" // Adjust size as needed
            resizeMode="contain"
          />
          <View className="w-6" /> {/* Spacer to balance layout */}
        </View>

        <Text className="text-2xl font-bold text-gray-900 mb-2 text-left self-start">
          Welcome to Intern Sync
        </Text>
        <Text className="text-sm text-gray-600 mb-6 text-left self-start">
          Please follow these House Rules when applying to jobs.
        </Text>

        {/* Rules */}
        <View className="w-full">
          <View className="mb-5">
            <Text className="text-base font-semibold text-gray-900 mb-1">
              ✓ Be truthful.
            </Text>
            <Text className="text-sm text-gray-700">
              Never provide fake information in your profile or applications.
            </Text>
          </View>

          <View className="mb-5">
            <Text className="text-base font-semibold text-gray-900 mb-1">
              ✓ Verify your CV.
            </Text>
            <Text className="text-sm text-gray-700">
              Keep your resume updated and use verified documents.
            </Text>
          </View>

          <View className="mb-5">
            <Text className="text-base font-semibold text-gray-900 mb-1">
              ✓ No spamming.
            </Text>
            <Text className="text-sm text-gray-700">
              Apply only to roles you&apos;re genuinely interested in.
            </Text>
          </View>

          <View className="mb-5">
            <Text className="text-base font-semibold text-gray-900 mb-1">
              ✓ Stay professional.
            </Text>
            <Text className="text-sm text-gray-700">
              Treat employers and applicants with respect.
            </Text>
          </View>

          <View className="mb-5">
            <Text className="text-base font-semibold text-gray-900 mb-1">
              ✓ Protect your data.
            </Text>
            <Text className="text-sm text-gray-700">
              Avoid sharing sensitive info.{" "}
              <Text className="text-blue-600 underline">Learn More</Text>
            </Text>
          </View>
        </View>

        {/* I Agree Button */}
        <TouchableOpacity
          className="bg-black py-4 rounded-lg w-full mt-6"
          onPress={() =>
            router.push("/create_account/profile_page/MainProfile")
          }
        >
          <Text className="text-white text-lg font-semibold text-center">
            I Agree
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

