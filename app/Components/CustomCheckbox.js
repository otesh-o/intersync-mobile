import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';

export default function CustomCheckbox({ checked, onToggle }) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      className="flex-row items-center mb-4"
    >
      <Ionicons
        name={checked ? 'checkbox' : 'square-outline'}
        size={20}
        color="black"
      />
      <Text className="ml-2 text-sm">
        I agree to the{' '}
        <Text className="text-blue-500">[Terms & Conditions]</Text> and{' '}
        <Text className="text-blue-500">[Privacy Policy]</Text>.
      </Text>
    </TouchableOpacity>
  );
}
