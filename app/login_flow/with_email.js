// app/login_flow/with_email/LoginScreen.js
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";

export default function LoginScreen() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Only require email and password — no agreement needed
  const isValid = emailOrUsername.trim() !== "" && password.trim() !== "";

  const handleLogin = () => {
    if (!isValid) return;

    // 🔐 In real app: call Firebase/auth API
    // For now: mock success
    router.push("/Homepage/homepage");
  };

  return (
    <View className="flex-1 bg-white px-6 pt-24">
      {/* Header with Back Button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", left: 0 }}
        >
          <Image
            source={require("../../assets/images/back.png")}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text
          className="text-[27.11px] text-black uppercase"
          style={{ fontFamily: "ClaireNewsBold", lineHeight: 30 }}
        >
          INTERNSYNC
        </Text>
      </View>

      {/* Welcome Back */}
      <Text
        style={{
          fontFamily: "Roboto",
          fontWeight: "700",
          fontSize: 24,
          lineHeight: 35,
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        Welcome Back!
      </Text>

      {/* Input Fields */}
      <View style={{ gap: 16, marginBottom: 24 }}>
        {/* Email or Username */}
        <TextInput
          placeholder="Email or username"
          placeholderTextColor="#888"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            fontFamily: "Roboto",
            width: "100%",
            height: 53,
            borderRadius: 26.5,
            borderWidth: 1,
            borderColor: "#ccc",
            paddingHorizontal: 16,
            fontSize: 16,
            color: "#333",
          }}
        />

        {/* Password */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            fontFamily: "Roboto",
            width: "100%",
            height: 53,
            borderRadius: 26.5,
            borderWidth: 1,
            borderColor: "#ccc",
            paddingHorizontal: 16,
            fontSize: 16,
            color: "#333",
          }}
        />

        {/* Forgot Password Link */}
        <TouchableOpacity
          onPress={() => router.push("/login_flow/forgot_password/email")}
          style={{ alignSelf: "flex-start", marginTop: 8 }}
        >
          <Text style={{ color: "#1E40AF", fontWeight: "bold", fontSize: 14 }}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={!isValid}
        style={{
          backgroundColor: isValid ? "#000" : "#ccc",
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
          }}
        >
          Log in
        </Text>
      </TouchableOpacity>

      {/* Trouble Logging In */}
      <Text
        style={{
          marginTop: 24,
          textAlign: "center",
          color: "#444",
          fontFamily: "Roboto",
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        Trouble logging in?
      </Text>
    </View>
  );
}
