// app/create_account/verify.js
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useMemo, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons as Icon } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { SignupContext } from "../context/SignupContext";

import { API_BASE_URL } from "../services/config";
import { auth } from "../services/firebaseConfig";

const BASE_URL = API_BASE_URL;
const CODE_LENGTH = 6;

export default function VerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { login } = useAuth();

  const { signupData } = useContext(SignupContext);
  const password = signupData.password;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    actionText: "OK",
    onAction: () => setModalVisible(false),
  });

  const isValid = useMemo(() => code.length === CODE_LENGTH, [code]);

  const showModal = (data) => {
    setModalData(data);
    setModalVisible(true);
  };

  const handleVerify = async () => {
    if (!isValid || loading) return;
    setLoading(true);

    try {
      const otpRes = await fetch(`${BASE_URL}/v1/auth/signup/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const otpData = await otpRes.json();

      if (otpRes.ok && otpData.success) {
        console.log("OTP verified — creating Firebase account...");

        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const { uid, email: firebaseEmail } = userCredential.user;

          console.log("Firebase account created:", uid);

          const idToken = await userCredential.user.getIdToken();

          const finalizeRes = await fetch(
            `${BASE_URL}/v1/auth/signup/finalize`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
              body: JSON.stringify({ uid, email: firebaseEmail }),
            }
          );

          const finalizeData = await finalizeRes.json();

          if (finalizeRes.status === 201 && finalizeData.success) {
            console.log("Account finalized in database:", finalizeData.user);

            await login(idToken);

            router.replace("/create_account/interest");
          } else {
            if (finalizeRes.status === 409) {
              showModal({
                title: "Already Exists",
                message:
                  finalizeData.message || "This account was already set up.",
                actionText: "Continue",
                onAction: () => {
                  setModalVisible(false);
                  router.replace("/create_account/interest");
                },
              });
            } else if (finalizeRes.status === 400) {
              showModal({
                title: "Setup Incomplete",
                message:
                  finalizeData.message || "Please restart the signup process.",
                actionText: "Restart",
                onAction: () => {
                  setModalVisible(false);
                  router.replace("/create_account/email");
                },
              });
            } else if (finalizeRes.status === 401) {
              showModal({
                title: "Unauthorized",
                message:
                  finalizeData.message || "Authentication failed. Try again.",
                actionText: "Retry",
                onAction: handleVerify,
              });
            } else {
              showModal({
                title: "Save Failed",
                message:
                  finalizeData.message ||
                  "Could not save your account. Please try again.",
                actionText: "Retry",
                onAction: handleVerify,
              });
            }
          }
        } catch (authError) {
          console.error("Firebase creation error:", authError);

          if (authError.code === "auth/email-already-in-use") {
            showModal({
              title: "Already Used",
              message: "An account with this email already exists.",
              actionText: "Sign In",
              onAction: () => {
                setModalVisible(false);
                router.replace("/login");
              },
            });
          } else if (authError.code === "auth/invalid-email") {
            showModal({
              title: "Invalid Email",
              message: "The email address is not valid.",
              actionText: "Fix Email",
              onAction: () => {
                setModalVisible(false);
                router.back();
              },
            });
          } else if (authError.code === "auth/network-request-failed") {
            showModal({
              title: "No Connection",
              message: "Check your internet connection and try again.",
              actionText: "Retry",
              onAction: handleVerify,
            });
          } else {
            showModal({
              title: "Setup Failed",
              message: "Could not create your account. Please try again.",
              actionText: "OK",
              onAction: () => setModalVisible(false),
            });
          }
        }
      } else {
        let title = "Invalid Code";
        let actionText = "Try Again";

        if (otpRes.status === 429) {
          title = "Too Many Attempts";
          actionText = "OK";
        } else if (otpRes.status === 409) {
          title = "Account Exists";
          actionText = "Go to Login";
        }

        showModal({
          title,
          message: otpData.message || "The code is incorrect or has expired.",
          actionText,
          onAction: () => {
            if (otpRes.status === 409) {
              router.replace("/login");
            }
            setModalVisible(false);
          },
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      if (error.message.includes("Network request failed")) {
        showModal({
          title: "No Connection",
          message: "We couldn’t reach the server. Are you online?",
          actionText: "Retry",
          onAction: handleVerify,
        });
      } else if (
        error.message.includes("JSON Parse error") ||
        error.message.includes("unexpected token")
      ) {
        showModal({
          title: "Server Error",
          message: "Received an invalid response. The service may be down.",
          actionText: "Try Again",
          onAction: handleVerify,
        });
      } else {
        showModal({
          title: "Unexpected Error",
          message: "Something went wrong. Please try again.",
          actionText: "OK",
          onAction: () => setModalVisible(false),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onChangeCode = (text) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(cleaned);
  };

  const boxes = Array.from({ length: CODE_LENGTH }).map((_, i) => {
    const char = code[i] ?? "";
    return (
      <View
        key={i}
        className="w-10 h-10 border-b-2 border-gray-300 items-center justify-center mx-1"
      >
        <Text className="text-xl text-gray-900">{char}</Text>
      </View>
    );
  });

  const resendOtp = async () => {
    try {
      const res = await fetch(`${BASE_URL}/v1/auth/signup/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        showModal({
          title: "Code Resent",
          message: data.message || "A new code has been sent to your email.",
          actionText: "Got it",
          onAction: () => setModalVisible(false),
        });
      } else {
        if (res.status === 409) {
          showModal({
            title: "Account Exists",
            message:
              data.message || "An account with this email already exists.",
            actionText: "Sign In",
            onAction: () => {
              setModalVisible(false);
              router.replace("/login");
            },
          });
        } else if (res.status === 429) {
          showModal({
            title: "Wait a Moment",
            message:
              data.message ||
              "Too many requests. Please wait before resending.",
            actionText: "OK",
            onAction: () => setModalVisible(false),
          });
        } else {
          showModal({
            title: "Send Failed",
            message: data.message || "Could not resend the code.",
            actionText: "OK",
            onAction: () => setModalVisible(false),
          });
        }
      }
    } catch (error) {
      showModal({
        title: "No Connection",
        message: "Couldn’t resend code. Check your internet.",
        actionText: "OK",
        onAction: () => setModalVisible(false),
      });
    }
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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="flex-1 bg-white items-center">
            <View
              className="flex-1 w-full px-5"
              style={{ maxWidth: 420, alignSelf: "center" }}
            >
              {/* Header with Logo */}
              <View className="flex-row items-center justify-between mt-2">
                <TouchableOpacity onPress={() => router.back()}>
                  <Icon name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>

                {/* LOGO REPLACES TEXT */}
                <View className="items-center">
                  <Image
                    source={require("../../assets/images/Internsync-black.png")}
                    className="w-48 h-16"
                    resizeMode="contain"
                  />
                </View>

                <View className="w-6" />
              </View>

              <Text className="mt-10 text-2xl font-semibold text-gray-800">
                Enter Verification Code
              </Text>

              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={onChangeCode}
                autoFocus
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                returnKeyType="done"
                onSubmitEditing={handleVerify}
                blurOnSubmit={false}
                className="opacity-0 h-0 w-0"
              />

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => inputRef.current?.focus()}
                className="flex-row mt-8 justify-center"
              >
                {boxes}
              </TouchableOpacity>

              <View className="mt-6">
                <Text className="text-gray-500 text-center">
                  We have sent a 6-digit code to{"\n"}
                  <Text className="font-medium">{email}</Text>
                </Text>

                <View className="mt-4">
                  <Text className="text-gray-500 text-center">
                    Did not receive a code?{" "}
                    <Text
                      className="text-indigo-600 underline font-bold"
                      onPress={!loading ? resendOtp : null}
                    >
                      Resend Code
                    </Text>
                  </Text>
                </View>

                <View className="mt-2">
                  <Text className="text-gray-500 text-center">
                    Change email?{" "}
                    <Text
                      className="text-indigo-600 underline font-bold"
                      onPress={() => router.back()}
                    >
                      Edit Email
                    </Text>
                  </Text>
                </View>
              </View>

              <View className="flex-1" />

              <TouchableOpacity
                onPress={handleVerify}
                disabled={!isValid || loading}
                className={`rounded-lg py-4 mb-6 ${isValid && !loading ? "bg-black" : "bg-gray-300"
                  }`}
              >
                {loading ? (
                  <Text className="text-center text-lg text-white font-semibold">
                    Verifying...
                  </Text>
                ) : (
                  <Text
                    className={`text-center text-lg font-semibold ${isValid ? "text-white" : "text-gray-500"
                      }`}
                  >
                    Verify & Continue
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <CustomModal />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

