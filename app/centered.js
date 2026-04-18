import { View } from "react-native";

export default function Centered({ children, className = "", style }) {
  return (
    <View className="flex-1 bg-white items-center">
      <View
        className={`w-full flex-1 px-5 ${className}`}
        style={[{ maxWidth: 420, alignSelf: "center" }, style]}
      >
        {children}
      </View>
    </View>
  );
}

