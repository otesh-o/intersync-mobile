import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../Components/Header';

export default function VerifyEmail() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '']);

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="gray" />
      </Pressable>

      <Header />

      <Text className="text-lg font-semibold mt-2">Check your email</Text>
      <Text className="text-sm text-gray-500 mb-2">
        We sent a reset link to <Text className="font-semibold text-black">contact@dscode...com</Text>
      </Text>
      <Text className="text-sm text-gray-500 mb-4">
        enter 5 digit code that mentioned in the email
      </Text>

      <View className="flex-row justify-between mb-4">
        {code.map((digit, idx) => (
          <TextInput
            key={idx}
            maxLength={1}
            className="border border-black w-12 h-12 text-center text-lg rounded"
            keyboardType="number-pad"
            value={digit}
            onChangeText={(value) => {
              const updated = [...code];
              updated[idx] = value;
              setCode(updated);
            }}
          />
        ))}
      </View>

      <TouchableOpacity
        className="bg-black rounded-full py-4"
        onPress={() => router.push('/login_account/set-password')}
      >
        <Text className="text-center text-white font-semibold">Verify</Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-400 mt-4">
        Haven’t got the email yet?{' '}
        <Text className="text-black underline">Resend email</Text>
      </Text>
    </View>
  );
}
