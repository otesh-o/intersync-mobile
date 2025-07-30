import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EmailScreen() {
  const [email, setEmail] = useState("");

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };

  const emailIsValid = isValidEmail(email);

  return (
    <View className="flex-1 bg-white px-6 pt-16">
      {/* INTERNSYNC */}
      <Text
        className="text-[27.11px] text-black uppercase text-center mb-12"
        style={{ fontFamily: "ClaireNewsBold", lineHeight: 30 }}
      >
        INTERNSYNC
      </Text>

      <View style={{ marginTop: 60 }}>
        <Text
          className="text-black mb-4"
          style={{
            fontFamily: "Roboto",
            fontWeight: "700",
            fontSize: 24,
            lineHeight: 24,
          }}
        >
          Let’s Get You Started
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
          style={{
            fontFamily: "Roboto",
            width: 336,
            height: 53,
            borderRadius: 26.5,
            borderWidth: 1,
            borderColor: "#ccc",
            paddingHorizontal: 16,
            fontSize: 16,
            color: "#333",
            marginBottom: 8,
          }}
        />

        <Text
          className="text-gray-600 mb-8"
          style={{ fontFamily: "Roboto", fontSize: 14 }}
        >
          We’ll send a verification code to this email
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (emailIsValid) router.push("/create_account/verify");
          }}
          disabled={!emailIsValid}
          style={{
            backgroundColor: emailIsValid ? "#000" : "#ccc",
            width: "100%",
            height: 56,
            borderRadius: 9999,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              opacity: emailIsValid ? 1 : 0.6,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
