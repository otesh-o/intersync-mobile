import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import Header from '../Components/Header';

export default function ResetSuccess() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="gray" />
      </Pressable>

      <Header />

      <Text className="text-lg font-semibold mt-2">Password reset</Text>
      <Text className="text-sm text-gray-500 mb-6">
        Your password has been successfully reset. click confirm to set a new password
      </Text>

      <TouchableOpacity className="bg-black rounded-full py-4">
        <Text className="text-center text-white font-semibold">Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}
