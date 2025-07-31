import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";

export default function LoginScreen() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const isValid =
    emailOrUsername.trim() !== "" && password.trim() !== "" && agreed;

  const handleLogin = () => {
    if (emailOrUsername === "user@example.com" && password === "password123") {
      router.push("/home");
    } else {
      router.push("/login_flow/oops/oops");
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-24">
      {/* Header with Back Icon and INTERNSYNC */}
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
        className="mb-12 text-center"
        style={{
          fontFamily: "Roboto",
          fontWeight: "700",
          fontSize: 24,
          lineHeight: 24,
        }}
      >
        Welcome Back!
      </Text>

      {/* Inputs */}
      <View style={{ gap: 16, alignItems: "center", marginBottom: 24 }}>
        <TextInput
          placeholder="Email or username"
          placeholderTextColor="#888"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
          autoCapitalize="none"
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

        <TouchableOpacity
          onPress={() => router.push("/login_flow/forgot_password/email")}
          style={{ alignSelf: "flex-start", marginTop: 8, marginBottom: 16 }}
        >
          <Text style={{ color: "#1E40AF", fontWeight: "bold", fontSize: 14 }}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Terms and Privacy */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <TouchableOpacity
          onPress={() => setAgreed(!agreed)}
          style={{
            height: 20,
            width: 20,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: "#aaa",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
            backgroundColor: agreed ? "#000" : "transparent",
          }}
        >
          {agreed && <Text style={{ color: "white", fontSize: 14 }}>✓</Text>}
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 14,
            fontWeight: "bold",
            color: "#444",
            flex: 1,
          }}
        >
          I agree to the{" "}
          <Text style={{ color: "blue" }}>Terms and Conditions</Text> and{" "}
          <Text style={{ color: "blue" }}>Privacy Policy</Text>
        </Text>
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
            opacity: isValid ? 1 : 0.6,
          }}
        >
          Log in
        </Text>
      </TouchableOpacity>

      {/* Trouble logging in */}
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
