import { View, Text, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

const checkIcon = require("../../assets/images/check.png");
const backIcon = require("../../assets/images/back.png");

export default function PaymentSuccess() {
  const { selectedAmount, planId } = useLocalSearchParams();

  const plans = {
    monthly: "InternSync – Monthly Access",
    annual: "InternSync – Annual Access",
  };

  const planName = plans[planId] || "InternSync Access";

  const now = new Date();
  const formattedDate = now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#E5E5E5",
        paddingHorizontal: 24,
        paddingTop: 56,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 56,
          left: 24,
          zIndex: 1,
        }}
      >
        <Image
          source={backIcon}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View
        style={{
          width: 340,
          minHeight: 500,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: "#ffffff",
          backgroundColor: "#fff",
          padding: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={checkIcon}
          style={{ width: 64, height: 64, marginBottom: 24 }}
          resizeMode="contain"
        />

        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 16,
            color: "#000",
          }}
        >
          ${selectedAmount || "0.00"}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            marginBottom: 8,
            color: "#444",
          }}
        >
          Paid to
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 16,
            textAlign: "center",
            color: "#000",
          }}
        >
          {planName}
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "400",
            color: "#666",
            marginBottom: 32,
          }}
        >
          {formattedDate}
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/hpi1")}
          style={{
            backgroundColor: "#000",
            borderRadius: 12,
            height: 50,
            width: 200,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
