// app/apply.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { useJobs } from "../context/JobsContext";


const uploadIcon = require("../../assets/images/upload.png");
const checkIcon = require("../../assets/images/check.png");
const Apply = () => {
  const [fullName, setFullName] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { removeJob } = useJobs();

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setResume(result.assets[0]);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick document.");
    }
  };

  const handleSubmit = () => {
    if (!fullName.trim() || !resume) {
      Alert.alert(
        "Missing Info",
        "Please enter your name and upload a resume."
      );
      return;
    }

    if (params.jobId) {
      removeJob(parseInt(params.jobId, 10));
    }

    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center bg-slate-50 px-5 pt-[30px] pb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Icon
            name="chevron-back"
            size={28}
            color="#000"
            style={{
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 1,
              textShadowColor: "#000",
            }}
          />
        </TouchableOpacity>

        <Text className="text-2xl font-bold flex-1 text-center">
          APPLICATION
        </Text>

        <View className="w-16" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-between"
      >
        <View className="px-6 mt-5">
          <TextInput
            placeholder="Enter Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#6B7280"
            className="bg-white px-4 rounded-xl mb-4 border border-slate-300 w-full"
            style={{ height: 58 }}
            autoCapitalize="words"
            autoComplete="name"
          />

          <TextInput
            placeholder="Portfolio Link (optional)"
            value={portfolio}
            onChangeText={setPortfolio}
            placeholderTextColor="#6B7280"
            className="bg-white px-4 rounded-xl mb-4 border border-slate-300 w-full"
            style={{ height: 58 }}
            keyboardType="url"
            autoCapitalize="none"
          />

          <TouchableOpacity
            className="bg-white px-4 rounded-xl mb-4 border border-slate-300 w-full h-44 justify-center items-center"
            onPress={pickDocument}
          >
            {resume ? (
              <View className="items-center">
                <Image
                  source={uploadIcon}
                  className="w-10 h-10 mb-2 opacity-80"
                />
                <Text className="text-sm text-gray-500 mb-1">
                  Uploaded Resume
                </Text>
                <Text
                  className="text-base text-black font-medium text-center max-w-60"
                  numberOfLines={2}
                >
                  {resume.name}
                </Text>
              </View>
            ) : (
              <View className="items-center">
                <Image
                  source={uploadIcon}
                  className="w-12 h-12 mb-2 opacity-70"
                />
                <Text className="text-base text-gray-500 text-center">
                  Tap to upload CV / Resume
                </Text>
                <Text className="text-sm text-gray-400 text-center">
                  PDF, DOC, or DOCX
                </Text>
              </View>
            )}
          </TouchableOpacity>

          
          <TextInput
            placeholder="Tell us why you'd be a great fit for this role..."
            value={message}
            onChangeText={setMessage}
            placeholderTextColor="#6B7280"
            className="bg-white px-4 rounded-xl mb-6 border border-slate-300 w-full h-44"
            textAlignVertical="top"
            multiline
            style={{ paddingTop: 12 }}
          />
        </View>

        
        <View className="px-5 pb-8">
          <TouchableOpacity
            className="bg-black py-4 rounded-2xl items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white text-lg font-bold">
              Submit Application
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      
      <Modal transparent visible={modalVisible} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <View className="bg-white w-full max-w-md rounded-2xl p-6 items-center shadow-xl">
            <Image
              source={checkIcon}
              className="w-16 h-16 mb-4"
              resizeMode="contain"
            />
            <Text className="text-xl font-bold text-slate-800 mb-2 text-center">
              Application sent successfully
            </Text>
            <Text className="text-base text-gray-500 mb-6 text-center">
              Your application has been successfully sent.
            </Text>
            <TouchableOpacity
              className="bg-slate-800 py-3 px-8 rounded-xl"
              onPress={() => {
                setModalVisible(false);
                router.replace("/Homepage/homepage"); 
              }}
            >
              <Text className="text-white text-base font-semibold">
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Apply;

