// app/create_account/email.tsx
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
// FIREBASE AUTH: Import for Firebase authentication
import { register } from "../services/auth";

export default function EmailScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = password.length >= 6;
  const emailIsValid = isValidEmail(email);
  const formIsValid = emailIsValid && passwordsMatch && isPasswordValid;

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    try {
      // FIREBASE AUTH: Firebase registration logic
      // await register(email, password);
      
      // Temporary mock implementation (Firebase auth disabled)
      // Simulating successful registration
      
      router.push({
        pathname: "/create_account/verify",
        params: { email },
      });
    } catch (error) {
      // FIREBASE AUTH: Firebase-specific error handling
      /*
      if (error.message.includes("email-already-in-use")) {
        alert("This email is already registered. Try logging in.");
      } else if (error.message.includes("weak-password")) {
        alert("Password is too weak. Use 6+ characters.");
      } else {
        alert("Something went wrong. Please try again.");
      }
      */
      
      // Generic error handling
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-16">
      {/* Logo */}
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

        {/* Email Input */}
        <Text className="text-gray-700 mb-2" style={{ fontFamily: "Roboto" }}>
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
          autoCapitalize="none"
        />

        {/* Password Input */}
        <Text
          className="text-gray-700 mb-2 mt-6"
          style={{ fontFamily: "Roboto" }}
        >
          Password
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: 336,
            height: 53,
            borderRadius: 26.5,
            borderWidth: 1,
            borderColor: "#ccc",
            paddingHorizontal: 16,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <TextInput
            placeholder="Create a password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={{
              flex: 1,
              fontFamily: "Roboto",
              fontSize: 16,
              color: "#333",
            }}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: 14,
                color: "#000",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          className="text-gray-600 mb-6"
          style={{ fontFamily: "Roboto", fontSize: 12 }}
        >
          Use 6 or more characters.
        </Text>

        {/* Confirm Password */}
        <Text className="text-gray-700 mb-2" style={{ fontFamily: "Roboto" }}>
          Confirm Password
        </Text>
        <TextInput
          placeholder="Re-enter your password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
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
          autoCapitalize="none"
        />

        {/* Error Message */}
        {!passwordsMatch && confirmPassword ? (
          <Text
            className="text-red-500 mb-6"
            style={{ fontFamily: "Roboto", fontSize: 14 }}
          >
            Passwords don’t match
          </Text>
        ) : null}

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!formIsValid}
          style={{
            backgroundColor: formIsValid ? "#000" : "#ccc",
            width: 336,
            height: 56,
            borderRadius: 9999,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
