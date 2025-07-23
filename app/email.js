import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function EmailScreen() {
  const [email, setEmail] = useState("");

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text
        className="text-[27.11px] text-black uppercase text-center mb-2"
        style={{ fontFamily: "News701BT", lineHeight: 30 }}
      >
        INTERNSYNC
      </Text>

      <Text
        className="text-black text-xl text-center mb-10"
        style={{ fontFamily: "Roboto", fontWeight: "bold" }}
      >
        Let&apos;s get you started
      </Text>

      <Text
        className="text-gray-700 mb-2 text-base"
        style={{ fontFamily: "Roboto" }}
      >
        Email
      </Text>

      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        className="w-full h-14 border border-gray-400 rounded-lg px-4 text-base text-gray-800 mb-6"
        style={{ fontFamily: "Roboto" }}
      />

      <TouchableOpacity
        onPress={() => {
          router.push("/password");
        }}
        className="bg-black w-full h-14 rounded-full justify-center items-center"
      >
        <Text className="text-white text-lg font-bold">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
