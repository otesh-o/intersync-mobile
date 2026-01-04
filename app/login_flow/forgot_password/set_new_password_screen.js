// app/login_flow/forgot_password/set_new_password.js

import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SetNewPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = () => {
    let valid = true;
    let newErrors = { password: "", confirmPassword: "" };

    if (password.trim() === "") {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setShowSuccessModal(true);
    }
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    router.push("/login");
  };

  return (
    <View className="flex-1 bg-white pt-20 px-5">

      <View className="items-center mb-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-0"
        >
          <Image
            source={require("../../../assets/images/back.png")}
            className="w-6 h-6 tint-gray-500"
          />
        </TouchableOpacity>
        <Text
          className="text-[27.11px] text-black uppercase"
          style={{ fontFamily: "ClaireNewsBold", lineHeight: 30 }}
        >
          INTERNSYNC
        </Text>
      </View>


      <Text
        className="text-[24px] text-black font-bold mb-2"
        style={{ fontFamily: "Roboto" }}
      >
        Set a new password
      </Text>


      <Text
        className="text-[16px] text-[#828693] font-semibold mb-6"
        style={{
          fontFamily: "Inter",
          letterSpacing: -0.5,
          lineHeight: 20,
        }}
      >
        Create a new password. Ensure it differs from previous ones for
        security.
      </Text>


      <View style={{ width: 336, marginBottom: 10 }}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#A8A8A8"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: "" }));
          }}
          secureTextEntry={!showPassword}
          style={{
            width: 336,
            height: 53,
            borderColor: errors.password ? "#FF3B30" : "#A8A8A8",
            borderWidth: 1,
            borderRadius: 26.5,
            paddingHorizontal: 20,
            fontFamily: "Inter",
          }}
        />
        <Pressable
          onPress={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 justify-center"
          style={{ top: "30%" }}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#A8A8A8"
          />
        </Pressable>
      </View>
      {errors.password ? (
        <Text className="text-red-500 text-sm mb-4 ml-2">
          {errors.password}
        </Text>
      ) : (
        <View className="h-5 mb-4" />
      )}


      <View style={{ width: 336, marginBottom: 10 }}>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#A8A8A8"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          secureTextEntry={!showConfirmPassword}
          style={{
            width: 336,
            height: 53,
            borderColor: errors.confirmPassword ? "#FF3B30" : "#A8A8A8",
            borderWidth: 1,
            borderRadius: 26.5,
            paddingHorizontal: 20,
            fontFamily: "Inter",
          }}
        />
        <Pressable
          onPress={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute right-4 justify-center"
          style={{ top: "30%" }}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#A8A8A8"
          />
        </Pressable>
      </View>
      {errors.confirmPassword ? (
        <Text className="text-red-500 text-sm mb-6 ml-2">
          {errors.confirmPassword}
        </Text>
      ) : (
        <View className="h-5 mb-6" />
      )}


      <TouchableOpacity
        className="items-center justify-center bg-black"
        style={{
          width: 336,
          height: 50,
          borderRadius: 67.18,
          alignSelf: "center",
        }}
        onPress={handleUpdatePassword}
      >
        <Text className="text-white text-[18px] font-bold">
          Update Password
        </Text>
      </TouchableOpacity>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: "rgba(170, 170, 170, 0.7)" }}
        >

          <View
            className="items-center px-6 py-8"
            style={{
              width: 340,
              backgroundColor: "white",
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >

            <Image
              source={require("../../../assets/images/check.png")}
              style={{ width: 98, height: 98, marginBottom: 16 }}
              resizeMode="contain"
            />


            <Text
              className="text-black mb-3"
              style={{
                width: 313,
                height: 20,
                fontFamily: "Poppins",
                fontWeight: "600",
                fontSize: 20,
                lineHeight: 20,
                letterSpacing: -0.5,
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              Successful
            </Text>


            <Text
              className="text-black mb-6"
              style={{
                width: 200,
                height: 69,
                fontFamily: "Roboto",
                fontWeight: "500",
                fontSize: 15.54,
                lineHeight: 23.31,
                letterSpacing: 0,
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {
                "Congratulations!\nYour password has been changed. Click continue to login."
              }
            </Text>

            <TouchableOpacity
              className="items-center justify-center bg-black"
              style={{
                width: 300,
                height: 58.4,
                borderRadius: 11.68,
              }}
              onPress={handleContinue}
            >
              <Text
                className="text-white text-[18px] font-bold"
                style={{ fontFamily: "Inter", fontWeight: "bold" }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
