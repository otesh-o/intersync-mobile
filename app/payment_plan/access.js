import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const logo = require("../../assets/images/logo.png");
const globe = require("../../assets/images/globe.png");
const resume = require("../../assets/images/resume.png");
const contact = require("../../assets/images/contact.png");
const apply = require("../../assets/images/apply.png");

export default function Access() {
  return (
    <View className="flex-1 bg-black px-6 pt-20 items-center">
      
      <Image
        source={logo}
        className="w-[221px] h-[221px]"
        resizeMode="contain"
      />

      
      <Text
        style={{
          fontFamily: "Roboto",
          fontWeight: "700",
          fontSize: 24,
          lineHeight: 24,
          color: "#FFFFFF",
          textAlign: "center",
        }}
      >
        Get Access to Internships
      </Text>

      
      <Text
        style={{
          fontFamily: "Roboto",
          fontWeight: "500",
          fontSize: 14,
          lineHeight: 18.67,
          textAlign: "center",
          color: "#FFFFFF94",
          marginTop: 16,
        }}
      >
        Subscribe to explore real internships, build your profile, and connect
        with global companies
      </Text>

      
      <View
        style={{
          marginTop: 40,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.11)",
          padding: 24,
          height: 256,
          alignSelf: "stretch",
          justifyContent: "space-around",
        }}
      >
        
        {[
          { icon: globe, text: "Global Internship Listings" },
          { icon: resume, text: "Smart Resume builder" },
          { icon: contact, text: "Direct Employer Contact" },
          { icon: apply, text: "Apply Instantly" },
        ].map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: index !== 3 ? 8 : 0,
            }}
          >
            <Image
              source={item.icon}
              style={{ width: 35, height: 29, marginRight: 12 }}
              resizeMode="contain"
            />
            <Text style={{ color: "#9E9E9E", fontSize: 16 }}>{item.text}</Text>
          </View>
        ))}
      </View>

      
      <TouchableOpacity
        style={{
          marginTop: 32,
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
          height: 48,
          alignSelf: "stretch",
        }}
        onPress={() => {
          router.push("/payment_plan/plan");
        }}
      >
        <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
          Subscribe now
        </Text>
      </TouchableOpacity>

      
      <TouchableOpacity
        style={{ marginTop: 16 }}
        onPress={() => router.push("/welcome")}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}
