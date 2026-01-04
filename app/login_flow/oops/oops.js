import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function OopsScreen() {
  return (
    <View className="flex-1 bg-white pt-20 px-5">

      <View className="items-center mb-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-0"
        >
          <Image
            source={require("../../../assets/images/back.png")}
            className="w-6 h-6 tint-gray-500"
          />
        </TouchableOpacity>
        <Text
          className="text-[27.11px] text-black uppercase"
          style={{ fontFamily: "ClaireNewsBold", lineHeight: 30 }}
        >
          INTERNSYNC
        </Text>
      </View>


      <Text className="text-[28px] font-bold text-center mt-8">Oops!</Text>


      <Text
        className="text-[18px] font-medium text-[#828693] text-center mt-8"
        style={{
          width: 355,
          height: 51,
          alignSelf: "center",
        }}
      >
        We couldn’t find an InternSync account connected to that Gmail Account.
      </Text>


      <TouchableOpacity
        onPress={() => router.push("/create_account/email")}
        className="mt-10 bg-black items-center justify-center"
        style={{
          width: 336,
          height: 50,
          alignSelf: "center",
          borderRadius: 67.18,
        }}
      >
        <Text className="text-white text-[18px] font-bold">Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}
