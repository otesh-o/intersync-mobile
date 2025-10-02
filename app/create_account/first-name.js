import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function FirstNameScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");

  const onContinue = () => {
    if (!firstName.trim()) return;
    router.push("/create_account/birthday");
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
              <View className="flex-row items-center justify-between mt-2">
                <TouchableOpacity onPress={() => router.back()}>
                  <Text className="text-3xl text-gray-700">{'\u00D7'}</Text>
                </TouchableOpacity>
                <View className="w-6" />
              </View>

              <Text className="mt-10 text-3xl font-semibold text-gray-800">
                My first name is
              </Text>

              <View className="mt-8 items-center">
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  placeholder="First name"
                  placeholderTextColor="#9CA3AF"
                  className="border-b border-gray-300 pb-2 text-lg text-gray-900 w-full"
                  style={{ maxWidth: 360, alignSelf: "center" }}
                />
                <Text
                  className="mt-3 text-gray-500 w-full"
                  style={{ maxWidth: 360, alignSelf: "center" }}
                >
                  This is how it will appear in{" "}
                  <Text className="font-semibold">intern sync</Text> and you will
                  not be able to change it
                </Text>
              </View>

              <View className="flex-1" />

              <TouchableOpacity
                onPress={onContinue}
                disabled={!firstName.trim()}
                className={`rounded-lg py-4 mb-6 ${
                  firstName.trim() ? "bg-black" : "bg-gray-300"
                }`}
              >
                <Text
                  className={`text-center text-lg font-semibold ${
                    firstName.trim() ? "text-white" : "text-gray-500"
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
