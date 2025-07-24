import { useRouter } from "expo-router";
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

const TOTAL_DIGITS = 8; // YYYYMMDD

export default function BirthdayScreen() {
  const router = useRouter();
  const [digits, setDigits] = useState("");
  const inputRef = useRef(null);

  const onChange = (text) => {
    const onlyNums = text.replace(/[^0-9]/g, "").slice(0, TOTAL_DIGITS);
    setDigits(onlyNums);
  };

  const { year, month, day } = useMemo(() => {
    const y = digits.slice(0, 4);
    const m = digits.slice(4, 6);
    const d = digits.slice(6, 8);
    return { year: y, month: m, day: d };
  }, [digits]);

  const isValid = useMemo(() => {
    if (digits.length !== TOTAL_DIGITS) return false;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    if (!(y >= 1900 && y <= new Date().getFullYear())) return false;
    if (!(m >= 1 && m <= 12)) return false;

    const daysInMonth = new Date(y, m, 0).getDate();
    if (!(d >= 1 && d <= daysInMonth)) return false;

    const birth = new Date(y, m - 1, d);
    const now = new Date();
    if (birth > now) return false;

    return true;
  }, [digits, year, month, day]);

  const handleContinue = () => {
    if (!isValid) return;
    // router.replace("/home");
  };

  const placeholders = ["Y", "Y", "Y", "Y", "M", "M", "D", "D"];

  const renderBoxes = () => {
    const items = [];
    for (let i = 0; i < TOTAL_DIGITS; i++) {
      const char = digits[i] ?? "";
      const isFilled = !!char;
      items.push(
        <View
          key={i}
          className="w-8 items-center justify-center mx-1 border-b border-gray-300 pb-1"
        >
          <Text className={`text-lg ${isFilled ? "text-gray-900" : "text-gray-400"}`}>
            {isFilled ? char : placeholders[i]}
          </Text>
        </View>
      );
      if (i === 3 || i === 5) {
        items.push(
          <Text key={`sep-${i}`} className="text-lg text-gray-400 mx-1">
            /
          </Text>
        );
      }
    }
    return items;
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
              {/* Header (X close) */}
              <View className="flex-row items-center justify-between mt-2">
                <TouchableOpacity onPress={() => router.back()}>
                  <Text className="text-3xl text-gray-700">{'\u00D7'}</Text>
                </TouchableOpacity>
                <View className="w-6" />
              </View>

              {/* Title */}
              <Text className="mt-10 text-3xl font-semibold text-gray-800">
                My birthday is
              </Text>

              {/* Hidden input */}
              <TextInput
                ref={inputRef}
                value={digits}
                onChangeText={onChange}
                autoFocus
                keyboardType="number-pad"
                maxLength={TOTAL_DIGITS}
                className="opacity-0 h-0 w-0"
              />

              {/* CENTERED DOB BOXES */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => inputRef.current?.focus()}
                className="flex-row mt-10 justify-center"
              >
                {renderBoxes()}
              </TouchableOpacity>

              <Text className="mt-3 text-gray-500 text-center">
                Your age will be public
              </Text>

              <View className="flex-1" />

              {/* Continue button */}
              <TouchableOpacity
                onPress={handleContinue}
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
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
