// app/login_flow/forgot_password/email.js
import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";

// Import the logo (same as in Login.js)
const logo = require("../../../assets/images/logo.png");

export default function ForgotPasswordEmail() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    actionText: "OK",
    onAction: () => setModalVisible(false),
  });

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };

  const isDisabled = !isValidEmail(email);

  const showModal = (data) => {
    setModalData(data);
    setModalVisible(true);
  };

  const handleReset = async () => {
    if (!isDisabled && !loading) {
      setLoading(true);

      try {
        await sendPasswordResetEmail(auth, email.trim());
        showModal({
          title: "📨 Check Your Inbox",
          message: `We’ve sent a password reset link to ${email}.`,
          actionText: "Continue",
          onAction: () => {
            setModalVisible(false);
            router.replace("/login_flow/with_email");
          },
        });
      } catch (error) {
        console.error("Password reset error:", error.code, error.message);

        if (error.code === "auth/user-not-found") {
          showModal({
            title: "📧 Account Not Found",
            message:
              "No account exists with this email. Did you sign up with a different one?",
            actionText: "Try Again",
            onAction: () => setModalVisible(false),
          });
        } else if (error.code === "auth/invalid-email") {
          showModal({
            title: "✉️ Invalid Email",
            message: "That email doesn’t look right. Want to fix it?",
            actionText: "Edit Email",
            onAction: () => setModalVisible(false),
          });
        } else if (error.code === "auth/network-request-failed") {
          showModal({
            title: "📶 No Connection",
            message: "We couldn’t send the reset link. Are you online?",
            actionText: "Retry",
            onAction: handleReset,
          });
        } else {
          showModal({
            title: "⚠️ Something Went Wrong",
            message: "Could not send reset email. Please try again.",
            actionText: "OK",
            onAction: () => setModalVisible(false),
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Custom Modal
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
      <SafeAreaView className="flex-1">
        <View className="flex-1 pt-20 px-5">
          {/* Header with back button and logo */}
          <View className="flex-row items-center justify-center mb-10 relative">
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute left-0"
              accessibilityLabel="Go back"
            >
              <Image
                source={require("../../../assets/images/back.png")}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Logo instead of "INTERNSYNC" text */}
            <Image
              source={logo}
              className="w-[120px] h-[120px]"
              resizeMode="contain"
            />

            {/* Spacer to balance layout */}
            <View className="w-6" />
          </View>

          {/* Title */}
          <Text
            className="text-2xl font-bold text-black mb-4"
            style={{ fontFamily: "Roboto" }}
          >
            Forgot Password
          </Text>

          {/* Subtitle */}
          <Text
            className="text-base text-gray-600 mb-8"
            style={{ fontFamily: "Inter" }}
          >
            Please enter your email to reset the password
          </Text>

          {/* Email Input */}
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#A8A8A8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            className="w-full h-[53] px-5 border border-gray-300 rounded-full text-base text-gray-700 mb-10"
          />

          {/* Reset Button */}
          <TouchableOpacity
            disabled={isDisabled || loading}
            onPress={handleReset}
            className={`w-full h-14 rounded-full justify-center items-center ${
              isDisabled ? "bg-gray-300" : "bg-black"
            }`}
          >
            {loading ? (
              <Text className="text-white text-lg font-bold">Sending...</Text>
            ) : (
              <Text className="text-white text-lg font-bold">
                Reset Password
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <CustomModal />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
