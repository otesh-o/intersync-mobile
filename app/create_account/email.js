// app/create_account/email.js
import { router } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // added

import { SignupContext } from "../context/SignupContext";

import { API_BASE_URL } from "../services/config";

const BASE_URL = API_BASE_URL;

export default function EmailScreen() {
  const insets = useSafeAreaInsets(); // safe area
  const { setSignupData } = useContext(SignupContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    actionText: "Got it",
    onAction: () => setModalVisible(false),
  });

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };

  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = password.length >= 6;
  const emailIsValid = isValidEmail(email);
  const formIsValid = emailIsValid && passwordsMatch && isPasswordValid;

  const showModal = (data) => {
    setModalData(data);
    setModalVisible(true);
  };

  const sendOtp = async () => {
    if (!formIsValid) return;
    setLoading(true);

    // MOCKING AUTH BACKEND FOR UI TESTING
    console.log("MOCK: Skipping OTP send for:", email);
    setSignupData({ email, password });
    router.push({
      pathname: "/create_account/verify",
      params: { email: email.trim() },
    });
    setLoading(false);
    return;

    /* Original code logic commented out for UI testing
    try {
      const response = await fetch(`${BASE_URL}/v1/auth/signup/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn("Unexpected server response:", text);
        throw new Error("Invalid server response");
      }

      if (response.ok) {
        setSignupData({ email, password });
        router.push({
          pathname: "/create_account/verify",
          params: { email: email.trim() },
        });
      } else {
        showModal({
          title: "Verification Failed",
          message:
            data.message || "Could not send OTP. Please check your email.",
          actionText: "Try Again",
          onAction: () => setModalVisible(false),
        });
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      let title, message, onAction;
      if (error.message.includes("Network request failed")) {
        title = "No Connection";
        message = "We couldn’t reach the server. Are you online?";
        onAction = sendOtp;
      } else if (error.message.includes("JSON Parse error")) {
        title = "Server Error";
        message = "Received invalid response from server.";
        onAction = () => setModalVisible(false);
      } else {
        title = "Unexpected Error";
        message = "Something went wrong. Please try again.";
        onAction = () => setModalVisible(false);
      }
      showModal({ title, message, actionText: "OK", onAction });
    } finally {
      setLoading(false);
    }
    */
  };

  const CustomModal = () => {
    if (!modalVisible) return null;
    return (
      <TouchableOpacity
        className="absolute inset-0 bg-black/50 justify-center items-center z-10"
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <TouchableOpacity activeOpacity={1} className="w-11/12 max-w-xs">
          <View className="bg-white p-6 rounded-2xl shadow-lg">
            <Text className="text-lg font-bold text-center mb-2">
              {modalData.title}
            </Text>
            <Text className="text-sm text-gray-600 text-center mb-5 leading-relaxed">
              {modalData.message}
            </Text>
            <TouchableOpacity
              onPress={modalData.onAction}
              className="bg-black py-3 px-6 rounded-full"
            >
              <Text className="text-white font-bold text-center">
                {modalData.actionText}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerClassName="flex-grow items-center px-4 pb-8"
          keyboardShouldPersistTaps="handled"
          style={{ paddingTop: insets.top + 16 }}
        >
          {/* Max-width container for tablets */}
          <View className="w-full max-w-md">
            {/* Logo */}
            <View className="items-center mb-10">
              <Image
                source={require("../../assets/images/Internsync-black.png")}
                className="w-40 h-14" // responsive size
                resizeMode="contain"
              />
            </View>

            <View>
              <Text className="text-black text-2xl font-bold mb-5 text-center">
                Let’s Get You Started
              </Text>

              {/* Email */}
              <Text className="text-gray-700 mb-2">Email</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-full text-base text-gray-700 mb-4"
              />

              {/* Password */}
              <Text className="text-gray-700 mb-2">Password</Text>
              <View className="w-full px-4 py-0.5 border border-gray-300 rounded-full flex-row items-center mb-2">
                <TextInput
                  placeholder="Create a password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="off"
                  textContentType="newPassword"
                  className="flex-1 text-base text-gray-700"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text className="text-black text-xs font-medium">
                    {showPassword ? "HIDE" : "SHOW"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-gray-500 text-xs mb-4">
                Use 6 or more characters.
              </Text>

              {/* Confirm Password */}
              <Text className="text-gray-700 mb-2">Confirm Password</Text>
              <TextInput
                placeholder="Re-enter your password"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-full text-base text-gray-700 mb-2"
              />

              {!passwordsMatch && confirmPassword ? (
                <Text className="text-red-500 text-sm mb-5">
                  Passwords don’t match
                </Text>
              ) : null}

              {/* Continue Button */}
              <TouchableOpacity
                onPress={sendOtp}
                disabled={!formIsValid || loading}
                className={`w-full py-3.5 rounded-full justify-center items-center mt-4 ${formIsValid ? "bg-black" : "bg-gray-300"
                  }`}
              >
                {loading ? (
                  <Text className="text-white text-lg font-bold">
                    Sending...
                  </Text>
                ) : (
                  <Text className="text-white text-lg font-bold">Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <CustomModal />
    </KeyboardAvoidingView>
  );
}
