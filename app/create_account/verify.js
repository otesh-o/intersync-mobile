import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
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

const CODE_LENGTH = 6;

export default function VerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const inputRef = useRef(null);

  const isValid = useMemo(() => code.length === CODE_LENGTH, [code]);

  const handleVerify = () => {
    if (!isValid) return;
    router.push("/create_account/first-name");
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
              {/* Header */}
              <View className="flex-row items-center justify-between mt-2">
                <TouchableOpacity onPress={() => router.back()}>
                  <Text className="text-2xl text-gray-700">{'\u2039'}</Text>
                </TouchableOpacity>
                <Text className="font-clairesBold text-2xl">INTERN SYNC</Text>
                <View className="w-6" />
              </View>

              {/* Title */}
              <Text className="mt-10 text-2xl font-semibold text-gray-800">
                Enter Verification Code
              </Text>

              {/* Hidden TextInput for capturing OTP */}
              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={onChangeCode}
                autoFocus
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                className="opacity-0 h-0 w-0"
              />

              {/* CENTERED OTP BOXES */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => inputRef.current?.focus()}
                className="flex-row mt-8 justify-center"
              >
                {boxes}
              </TouchableOpacity>

              {/* Info / Links */}
              <View className="mt-6">
                <Text className="text-gray-500">
                  We’ve sent a 6-digit code to your email. Enter it below to
                  continue.
                </Text>

                <View className="mt-4">
                  <Text className="text-blue-600">
                    Didn’t receive a code? <Text className="underline">[Resend Code]</Text>
                  </Text>
                </View>

                <View className="mt-2">
                  <Text className="text-blue-600">
                    Change email?{" "}
                    <Text className="underline" onPress={() => router.back()}>
                      [Edit Email]
                    </Text>
                  </Text>
                </View>
              </View>

              <View className="flex-1" />

              {/* Verify Button */}
              <TouchableOpacity
                onPress={handleVerify}
                disabled={!isValid}
                className={`rounded-lg py-4 mb-6 ${
                  isValid ? "bg-black" : "bg-gray-300"
                }`}
              >
                <Text
                  className={`text-center text-lg font-semibold ${
                    isValid ? "text-white" : "text-gray-500"
                  }`}
                >
                  Verify & Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
