// Header.js
import { router } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native";

export default function Header() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
        <Image
          source={require("../../../../assets/images/back.png")}
          style={{
            width: 20,
            height: 20,
            tintColor: "#555",
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Title */}
      <Text
        style={{
          fontFamily: "Roboto-Bold",
          fontWeight: "700",
          fontSize: 20,
          color: "#000",
          textTransform: "uppercase",
          flex: 1,
          textAlign: "center",
        }}
      >
        Profile
      </Text>

      {/* Spacer */}
      <View style={{ width: 24 }} />
    </View>
  );
}
