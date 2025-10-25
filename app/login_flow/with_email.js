// app/login_flow/with_email/LoginScreen.js
import { router } from "expo-router";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    actionText: "Try Again",
    onAction: () => setModalVisible(false),
  });

  const isValid = email.trim() !== "" && password !== "";

  const togglePasswordVisibility = () => {
    setSecureEntry(!secureEntry);
  };

  const showModal = (data) => {
    setModalData(data);
    setModalVisible(true);
  };

  const handleLogin = async () => {
    if (!isValid || loading) return;
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      console.log("Logged in:", user.uid);

      const idToken = await user.getIdToken();

      await AsyncStorage.setItem("authToken", idToken);

      router.replace("../Homepage/homepage");
    } catch (error) {
      console.error("Login error:", error.code, error.message);

      let title, message, actionText, onAction;

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        title = "Couldn’t Sign In";
        message =
          "Hmm, those credentials don’t match our records. Double-check your email and password.";
        actionText = "Try Again";
        onAction = () => setModalVisible(false);
      } else if (error.code === "auth/invalid-email") {
        title = "Invalid Email";
        message =
          "Hmm, that email doesn’t look right. Double-check and try again.";
        actionText = "Got it";
        onAction = () => setModalVisible(false);
      } else if (error.code === "auth/network-request-failed") {
        title = "No Connection";
        message = "Oof, we can’t reach the server. Are you online?";
        actionText = "Retry";
        onAction = () => {
          setModalVisible(false);
          setTimeout(handleLogin, 500);
        };
      } else if (error.code === "auth/too-many-requests") {
        title = "Locked Temporarily";
        message = "Too many attempts. Reset your password or try again later.";
        actionText = "Reset Password";
        onAction = () => {
          setModalVisible(false);
          router.push("/login_flow/forgot_password/email");
        };
      } else if (
        error.code === "auth/internal-error" ||
        error.code === "auth/unknown-error"
      ) {
        title = "Unexpected Glitch";
        message = "Oof, something went wrong on our end. Try again in a bit.";
        actionText = "Dismiss";
        onAction = () => setModalVisible(false);
      } else {
        title = "Couldn’t Log In";
        message = "Something unexpected happened. Please try again.";
        actionText = "OK";
        onAction = () => setModalVisible(false);
      }

      showModal({ title, message, actionText, onAction });
    } finally {
      setLoading(false);
    }
  };

  const CustomModal = () => {
    if (!modalVisible) return null;

    return (
      <View className="absolute inset-0 bg-black/50 justify-center items-center z-10">
        <View className="bg-white p-6 rounded-2xl w-11/12 max-w-xs shadow-lg">
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
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 pt-8">
          {" "}
          {/* Reduced top padding */}
          {/* Back button — minimal, top-left */}
          <View className="self-start mb-2">
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityLabel="Go back"
            >
              <Image
                source={require("../../assets/images/back.png")}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          {/* Logo — EXACTLY like in EmailScreen.js */}
          <View className="items-center mb-8">
            <Image
              source={require("../../assets/images/Internsync-black.png")}
              className="w-48 h-16"
              resizeMode="contain"
            />
          </View>
          {/* Welcome */}
          <Text
            className="text-3xl font-bold text-center mb-8"
            style={{ fontFamily: "Roboto", lineHeight: 35 }}
          >
            Welcome Back!
          </Text>
          <View className="gap-4 mb-6">
            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              className="w-full h-[53] px-5 border border-gray-300 rounded-full text-base text-gray-700 font-sans"
            />

            {/* Password */}
            <View className="flex-row items-center w-full h-[53] px-5 border border-gray-300 rounded-full">
              <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureEntry}
                autoComplete="password"
                textContentType="password"
                className="flex-1 text-base text-gray-700 font-sans"
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Text className="text-indigo-600 text-xs font-semibold">
                  {secureEntry ? "SHOW" : "HIDE"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/login_flow/forgot_password/email")}
              className="self-start mt-2"
            >
              <Text className="text-indigo-600 font-bold text-sm">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            disabled={!isValid || loading}
            className={`w-full h-[53] rounded-full justify-center items-center ${
              isValid ? "bg-black" : "bg-gray-300"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-bold">Log in</Text>
            )}
          </TouchableOpacity>
          <Text className="text-center mt-6 text-gray-600 font-bold text-sm">
            Trouble logging in?
          </Text>
        </View>

        <CustomModal />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
