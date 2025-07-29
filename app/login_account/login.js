import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TouchableOpacity } from 'react-native';

import CustomCheckbox from '../Components/CustomCheckbox';
import Header from '../Components/Header';
import InputField from '../Components/InputField';
import PasswordInput from '../Components/PasswordInput';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(true);
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white px-6"
    >
      {/* Back Arrow */}
      <Pressable className="mt-10" onPress={() => router.push('/welcome')}>
        <Ionicons name="arrow-back" size={24} color="gray" />
      </Pressable>

      <Header />

      <Text className="text-lg font-semibold text-center mb-4">Welcome Back!</Text>

      <InputField
        placeholder="Email or Username"
        value={email}
        onChangeText={setEmail}
      />

      <PasswordInput
        value={password}
        onChangeText={setPassword}
      />

      <CustomCheckbox
        checked={checked}
        onToggle={() => setChecked(!checked)}
      />

      <TouchableOpacity className="bg-black rounded-full py-4 mb-2">
        <Text className="text-white text-center font-semibold">LOG IN</Text>
      </TouchableOpacity>

      <Text className="text-center text-sm text-black">Trouble logging in?</Text>
    </KeyboardAvoidingView>
  );
}
