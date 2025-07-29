import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../Components/Header';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="gray" />
      </Pressable>

      <Header />

      <Text className="text-lg font-semibold mt-2">Forgot password</Text>
      <Text className="text-sm text-gray-500 mb-4">
        Please enter your email to reset the password
      </Text>

      <TextInput
        className="border border-gray-300 rounded-full px-4 h-[53px] mb-4"
        placeholder="Your Email here"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        className="bg-gray-400 rounded-full py-4"
        onPress={() => router.push('/login_account/verify')}
      >
        <Text className="text-center text-white font-semibold">Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
}
