import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

export default function PasswordInput({ value, onChangeText }) {
  const [secure, setSecure] = useState(true);

  return (
    <View className="flex-row items-center border border-gray-300 rounded-full px-4 mb-2" style={{ height: 53 }}>
      <TextInput
        placeholder="ENTER PASSWORD"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        placeholderTextColor="#999"
        className="flex-1"
      />
      <Pressable onPress={() => setSecure(!secure)}>
        <Ionicons name={secure ? 'eye-off' : 'eye'} size={20} color="gray" />
      </Pressable>
    </View>
  );
}
