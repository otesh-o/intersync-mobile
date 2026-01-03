import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../services/config";

const backIcon = require("../../assets/images/back.png");
const checkIcon = require("../../assets/images/check.png");

export default function Plan() {
  const [selectedPlan, setSelectedPlan] = useState("Unlimited");
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState({});
  const insets = useSafeAreaInsets();
  const { token, isDebugMode, updatePlan, setPremium } = useAuth();

  useEffect(() => {
    async function fetchPrices() {
      if (isDebugMode) {
        setPrices({
          monthly: { id: "mock-price-id", unit_amount: 800, currency: "usd" },
        });
        return;
      }
      try {
        const response = await fetch(
          `${API_BASE_URL}/v1/billing/prices`
        );
        const data = await response.json();
        if (response.ok && data.success) {
          const obj = {};
          if (Array.isArray(data.prices)) {
            data.prices.forEach((p) => {
              if (p.recurring?.interval) {
                const mappedKey = p.recurring.interval === "month" ? "monthly" :
                  p.recurring.interval === "year" ? "annual" : p.recurring.interval;
                obj[mappedKey] = p;
              }
            });
          }
          setPrices(obj);
        }
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    }
    fetchPrices();
  }, []);

  const handleContinue = async () => {
    if (selectedPlan === "Free") {
      setLoading(true);
      try {
        // Sync plan selection to local state
        await updatePlan("free");
        await setPremium(false);

        // Optional: Notify backend about free plan selection if endpoint exists
        // await api("/v1/user/plan", { method: "POST", body: JSON.stringify({ plan: "free" }) });

        router.replace("/Homepage/homepage");
      } catch (err) {
        console.error("Plan selection error:", err);
        Alert.alert("Error", "Could not select plan. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Unlimited plan logic
    const priceId = prices["monthly"]?.id;
    if (!priceId) {
      Alert.alert("Error", "Could not find pricing information. Please try again.");
      return;
    }

    if (!token) {
      Alert.alert("Not logged in", "Please log in to continue.");
      return;
    }

    if (isDebugMode) {
      const amount = prices["monthly"] ? (prices["monthly"].unit_amount / 100).toFixed(2) : "8.00";
      console.log("Debug Mode: Bypassing Stripe checkout...");
      router.push({
        pathname: "/payment_plan/paid",
        params: { selectedAmount: amount, planId: "monthly" },
      });
      return;
    }

    setLoading(true);
    try {
      const successUrl = Linking.createURL("payment_plan/paid", { queryParams: { planId: "monthly" } });
      const cancelUrl = Linking.createURL("payment_plan/review", { queryParams: { planId: "monthly" } });

      const response = await fetch(
        `${API_BASE_URL}/v1/billing/checkout/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ priceId, successUrl, cancelUrl }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success && data.url) {
        await WebBrowser.openBrowserAsync(data.url);
      } else {
        Alert.alert("Checkout Error", data.message || "Failed to start checkout");
      }
    } catch (err) {
      console.error("Payment error:", err);
      Alert.alert("Payment Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const unlimitedFeatures = [
    "Unlimited applications",
    "Advanced analytics & insights",
    "Priority 24/7 support",
    "Unlimited storage",
    "Custom integrations",
    "Team collaboration",
  ];

  const freeFeatures = [
    "3 Applications per month",
    "Basic internship search",
    "Community access",
    "Profile builder",
  ];

  const features = selectedPlan === "Unlimited" ? unlimitedFeatures : freeFeatures;

  return (
    <View className="flex-1 bg-[#F6F6F6]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center">
          <Image
            source={backIcon}
            style={{ width: 24, height: 24, tintColor: "#000" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 40,
          flexGrow: 1
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Segmented Control */}
        <View
          className="bg-white rounded-2xl flex-row p-2 mb-8 shadow-sm"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          {["Free", "Unlimited"].map((plan) => {
            const isSelected = selectedPlan === plan;
            return (
              <TouchableOpacity
                key={plan}
                onPress={() => setSelectedPlan(plan)}
                className="flex-1 items-center pt-4 pb-2"
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: isSelected ? "700" : "500",
                    color: isSelected ? "#000" : "#888",
                    fontFamily: isSelected ? "Raleway-Medium" : "Raleway",
                  }}
                >
                  {plan}
                </Text>
                <View
                  className="mt-3 w-full"
                  style={{
                    height: isSelected ? 3 : 1,
                    backgroundColor: isSelected ? "#000" : "#E5E5E5",
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Pricing Card */}
        <View
          className="bg-white rounded-[32px] p-8 mb-auto shadow-lg"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 20,
            elevation: 5,
          }}
        >
          <View className="flex-row items-baseline mb-2">
            <Text
              style={{
                fontFamily: "Raleway-Medium",
                fontSize: 64,
                color: "#000",
                fontWeight: "700"
              }}
            >
              {selectedPlan === "Unlimited"
                ? (prices["monthly"]
                  ? `$${Math.round(prices["monthly"].unit_amount / 100)}`
                  : "$8")
                : "$0"}
            </Text>
            <Text
              style={{
                fontFamily: "Raleway",
                fontSize: 24,
                color: "#888",
                marginLeft: 8
              }}
            >
              /mo
            </Text>
          </View>

          <Text
            style={{
              fontFamily: "Raleway",
              fontSize: 14,
              color: "#999",
              marginBottom: 32
            }}
          >
            billed monthly
          </Text>

          {/* Features */}
          <View className="gap-y-5">
            {features.map((feature, index) => (
              <View key={index} className="flex-row items-center">
                <View
                  className="w-6 h-6 rounded-full bg-[#E8F5E9] items-center justify-center mr-4"
                >
                  <Image
                    source={checkIcon}
                    style={{ width: 12, height: 12, tintColor: "#4CAF50" }}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  style={{
                    fontFamily: "Raleway",
                    fontSize: 16,
                    color: "#444"
                  }}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Button - Space at bottom */}
        <View className="mt-10">
          <TouchableOpacity
            onPress={handleContinue}
            disabled={loading}
            className="bg-black rounded-full py-5 items-center justify-center shadow-md"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                className="text-white text-lg font-bold"
                style={{ fontFamily: "Raleway-Medium" }}
              >
                Continue with {selectedPlan}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
