import { View, Text, TouchableOpacity, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const backIcon = require("../../assets/images/back.png");
const checkIcon = require("../../assets/images/check.png");

export default function Review() {
  const { planId } = useLocalSearchParams();

  const plans = {
    monthly: {
      name: "Intern Sync – Monthly Access",
      amount: "15.00",
    },
    annual: {
      name: "Intern Sync – Annual Access",
      amount: "120.00",
    },
  };

  const selected = plans[planId];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#E5E5E5",
        paddingHorizontal: 24,
        paddingTop: 56,
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={backIcon}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View
        style={{
          width: 340,
          height: 663,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: "#ffffff",
          backgroundColor: "#fff",
          alignSelf: "center",
          marginTop: 40,
          padding: 24,
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 22,
            fontWeight: "700",
            fontFamily: "Poppins",
            color: "#000",
            marginBottom: 16,
          }}
        >
          Review Your Subscription
        </Text>

        <Image
          source={checkIcon}
          style={{ width: 64, height: 64, alignSelf: "center" }}
          resizeMode="contain"
        />

        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            fontFamily: "Poppins",
            textAlign: "center",
            letterSpacing: -0.5,
            textTransform: "capitalize",
            marginTop: 16,
          }}
        >
          {selected.name}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: "#000",
            textAlign: "center",
            marginTop: 12,
          }}
        >
          Amount Due Today: ${selected.amount}
        </Text>

        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#555",
              marginBottom: 8,
            }}
          >
            Details:
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#555",
              lineHeight: 24,
            }}
          >
            • Renews {planId === "monthly" ? "monthly" : "annually"}
            {"\n"}• Cancel Anytime From Settings
            {"\n"}• Secure Payment Guaranteed
          </Text>
        </View>

        <View style={{ marginTop: 40 }}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/payment_plan/subscription",
                params: {
                  selectedAmount: selected.amount,
                  planId: planId,
                },
              })
            }
            style={{
              backgroundColor: "#000",
              borderRadius: 12,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
              width: 313,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Pay ${selected.amount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#ccc",
              borderRadius: 12,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              width: 313,
              alignSelf: "center",
            }}
            onPress={() => router.back()}
          >
            <Text
              style={{
                color: "#000",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
