import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../Components/Header';

export default function SetNewPassword() {
  const router = useRouter();
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="gray" />
      </Pressable>

      <Header />

      <Text className="text-lg font-semibold mt-2">Set a new password</Text>
      <Text className="text-sm text-gray-500 mb-4">
        Create a new password. Ensure it differs from previous ones for security
      </Text>

      <View className="border border-gray-300 rounded-full px-4 mb-3 flex-row items-center h-[53px]">
        <TextInput
          placeholder="Enter your new password"
          className="flex-1"
          placeholderTextColor="#999"
          secureTextEntry={secure1}
          value={pass1}
          onChangeText={setPass1}
        />
        <Pressable onPress={() => setSecure1(!secure1)}>
          <Ionicons name={secure1 ? 'eye-off' : 'eye'} size={20} color="gray" />
        </Pressable>
      </View>

      <View className="border border-gray-300 rounded-full px-4 mb-4 flex-row items-center h-[53px]">
        <TextInput
          placeholder="Confirm Password"
          className="flex-1"
          placeholderTextColor="#999"
          secureTextEntry={secure2}
          value={pass2}
          onChangeText={setPass2}
        />
        <Pressable onPress={() => setSecure2(!secure2)}>
          <Ionicons name={secure2 ? 'eye-off' : 'eye'} size={20} color="gray" />
        </Pressable>
      </View>

      <TouchableOpacity
        className="bg-gray-400 rounded-full py-4"
        onPress={() => router.push('/login_account/reset-success')}
      >
        <Text className="text-center text-white font-semibold">Update Password</Text>
      </TouchableOpacity>
    </View>
  );
}
