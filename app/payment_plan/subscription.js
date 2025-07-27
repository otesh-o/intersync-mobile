import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";

const logos = {
  PayPal: require("../assets/images/paypal.png"),
  "G Pay": require("../assets/images/gpay.png"),
  "Apple Pay": require("../assets/images/apple.png"),
  Card: require("../assets/images/mastercard.png"),
};

const backIcon = require("../assets/images/back.png");

const paymentOptions = ["PayPal", "G Pay", "Apple Pay", "Card"];

export default function SubscriptionPage() {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const { selectedAmount, planId } = useLocalSearchParams();

  const fallbackAmounts = {
    PayPal: "15.00",
    "G Pay": "15.00",
    "Apple Pay": "15.00",
    Card: "15.00",
  };

  const displayAmount = selectedAmount || "0.00";
  const currentAmount = selectedOption
    ? selectedAmount || fallbackAmounts[selectedOption]
    : "0.00";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View
        style={{
          paddingTop: Constants.statusBarHeight,
          height: 100,
          backgroundColor: "black",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={backIcon}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "600",
            marginLeft: 16,
          }}
        >
          {planId === "annual" ? "Annual Subscription" : "Monthly Subscription"}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "white",
          paddingVertical: 8,
          paddingHorizontal: 16,
          marginTop: 24,
          borderRadius: 6,
          alignSelf: "stretch",
        }}
      >
        <Text
          style={{
            color: "#50555C",
            fontSize: 20,
            fontWeight: "700",
            textAlign: "left",
          }}
        >
          Payment Options
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 16,
        }}
      >
        {paymentOptions.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setSelectedOption(option)}
            style={{
              height: 62,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.25)",
              backgroundColor: selectedOption === option ? "#ddd" : "white",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              marginBottom: 12,
            }}
          >
            <Image
              source={logos[option]}
              style={{ width: 40, height: 40, resizeMode: "contain" }}
            />

            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                flex: 1,
                marginLeft: 12,
              }}
            >
              {option}
            </Text>

            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: selectedOption === option ? "#000" : "#999",
                backgroundColor:
                  selectedOption === option ? "#000" : "transparent",
              }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderColor: "#ccc",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            ${displayAmount}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "#888",
            }}
          >
            View Details
          </Text>
        </View>

        <TouchableOpacity
          disabled={!selectedOption}
          onPress={() => {
            if (selectedOption) {
              router.push({
                pathname: "/paid",
                params: {
                  paymentMethod: selectedOption,
                  selectedAmount: displayAmount,
                  planId: planId,
                },
              });
            }
          }}
          style={{
            width: 214,
            height: 60,
            backgroundColor: selectedOption ? "#000" : "#888",
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
