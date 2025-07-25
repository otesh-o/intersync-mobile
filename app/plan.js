import { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

const backIcon = require("../assets/images/back.png"); // make sure this path is correct

export default function Plan() {
  const [selectedPlan, setSelectedPlan] = useState("");

  const plans = [
    {
      id: "monthly",
      title: "Monthly Plan",
      subtitle: "$15/month - Cancel anytime",
    },
    {
      id: "annual",
      title: "Annual Plan",
      subtitle: "$120/year - Save 33%",
    },
  ];

  return (
    <View className="flex-1 bg-black px-6 pt-14">
      {/* Back Icon */}
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={backIcon}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Heading */}
      <Text
        style={{
          fontFamily: "Roboto",
          fontWeight: "700",
          fontSize: 24,
          lineHeight: 24,
          color: "#FFFFFF",
          marginTop: 72,
          marginBottom: 32,
        }}
      >
        Choose a Plan That Works for You
      </Text>

      {plans.map((plan) => {
        const isSelected = selectedPlan === plan.id;

        return (
          <TouchableOpacity
            key={plan.id}
            onPress={() => setSelectedPlan(plan.id)}
            style={{
              width: "100%",
              height: 112,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: isSelected ? "#FFFFFF" : "#FFFFFF30",
              backgroundColor: isSelected ? "#FFFFFF" : "#FFFFFF30",
              padding: 16,
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                color: isSelected ? "#000000" : "#FFFFFF",
                fontSize: 24,
                fontWeight: "600",
              }}
            >
              {plan.title}
            </Text>
            <Text
              style={{
                color: isSelected ? "#333333" : "#BBBBBB",
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {plan.subtitle}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Continue Button */}
      <TouchableOpacity
        onPress={() => {
          if (selectedPlan)
            router.push({
              pathname: "/review",
              params: { planId: selectedPlan },
            });
        }}
        disabled={!selectedPlan}
        style={{
          backgroundColor: selectedPlan ? "#FFFFFF" : "#FFFFFF40",
          borderRadius: 12,
          height: 48,
          justifyContent: "center",
          alignItems: "center",
          marginTop: "auto",
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            color: selectedPlan ? "#000" : "#888",
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
