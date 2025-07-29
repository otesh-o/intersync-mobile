import { TextInput } from 'react-native';

export default function InputField({ placeholder, value, onChangeText }) {
  return (
    <TextInput
      className="border border-gray-300 rounded-full px-4 py-3 mb-4"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#999"
    />
  );
}
