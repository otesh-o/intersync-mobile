import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as RNIap from "react-native-iap";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../services/config";

const backIcon = require("../../assets/images/back.png");
const checkIcon = require("../../assets/images/check.png");

export default function Plan() {
  const [selectedPlan, setSelectedPlan] = useState("Unlimited");
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState({});
  const [appleProduct, setAppleProduct] = useState(null);
  const insets = useSafeAreaInsets();
  const { token, isDebugMode, updatePlan, setPremium } = useAuth();

  useEffect(() => {
    async function fetchPrices() {
      if (__DEV__ && isDebugMode) {
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
                const mappedKey = p.recurring.interval === "month" ? "monthly" : p.recurring.interval;
                obj[mappedKey] = p;
              }
            });
          }
          setPrices(obj);
        }
      } catch (err) {
        // Silently ignore or log error
      }
    }
    fetchPrices();
  }, []);

  // 🍏 Apple IAP Initialization
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    let purchaseUpdateSubscription;
    let purchaseErrorSubscription;

    const initIAP = async () => {
      try {
        await RNIap.initConnection();
        if (Platform.OS === 'ios') {
          await RNIap.clearTransactionIOS();
        }
        // Fetch our product to get the REAL price from Apple
        const products = await RNIap.getSubscriptions({ skus: ["com.internsync.unlimited"] });
        if (products && products.length > 0) {
          setAppleProduct(products[0]);
        }
      } catch (err) {
        console.warn("IAP initialization failed:", err);
      }
    };

    initIAP();

    // Listen for successful purchases
    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        try {
          // Tell the backend to verify the receipt
          const response = await fetch(`${API_BASE_URL}/v1/billing/apple/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ receipt }),
          });

          const data = await response.json();
          if (response.ok && data.success) {
            await RNIap.finishTransaction({ purchase, isConsumable: false });
            await updatePlan("unlimited");
            await setPremium(true);
            Alert.alert("Success", "Welcome to Unlimited!");
            router.replace("/Homepage/homepage");
          }
        } catch (err) {
          console.error("Backend verification failed:", err);
          Alert.alert("Error", "We couldn't verify your purchase. Please contact support.");
        } finally {
          setLoading(false);
        }
      }
    });

    purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      console.warn("purchaseErrorListener", error);
      setLoading(false);
      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert("Error", "There was a problem with your purchase.");
      }
    });

    return () => {
      if (purchaseUpdateSubscription) purchaseUpdateSubscription.remove();
      if (purchaseErrorSubscription) purchaseErrorSubscription.remove();
      RNIap.endConnection();
    };
  }, [token]);

  const handleRestore = async () => {
    setLoading(true);
    try {
      const purchases = await RNIap.getAvailablePurchases();
      if (purchases && purchases.length > 0) {
        // Just take the latest receipt and verify it
        const receipt = purchases[purchases.length - 1].transactionReceipt;
        const response = await fetch(`${API_BASE_URL}/v1/billing/apple/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ receipt }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          await updatePlan("unlimited");
          await setPremium(true);
          Alert.alert("Success", "Purchase Restored!");
          router.replace("/Homepage/homepage");
        } else {
          Alert.alert("Restore Failed", "No active subscription found.");
        }
      } else {
        Alert.alert("Restore Failed", "No previous purchases found.");
      }
    } catch (err) {
      console.error("Restore Error:", err);
      Alert.alert("Error", "Could not restore purchases.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (selectedPlan === "Free") {
      setLoading(true);
      try {
        await updatePlan("free");
        await setPremium(false);
        router.replace("/Homepage/homepage");
      } catch (err) {
        console.error("Plan error:", err);
        Alert.alert("Error", "Could not select plan.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!token) {
      Alert.alert("Error", "Please log in.");
      return;
    }

    setLoading(true);

    // 🍏 Apple In-App Purchase Flow
    if (Platform.OS === 'ios') {
      try {
        await RNIap.requestSubscription({ sku: "com.internsync.unlimited" });
      } catch (err) {
        console.warn("IAP Error:", err);
        setLoading(false);
        if (err.code !== 'E_USER_CANCELLED') {
          Alert.alert("Error", "Apple purchase failed.");
        }
      }
      return;
    }

    if (Platform.OS === 'android') {
      // 🤖 Android / Stripe Flow
      const priceId = prices["monthly"]?.id;
      if (!priceId) {
        Alert.alert("Error", "Pricing info missing.");
        setLoading(false);
        return;
      }

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
    } else {
      setLoading(false);
    }
  };

  const unlimitedFeatures = [
    "Unlimited applications",
    "Advanced analytics & insights",
    "Priority 24/7 support",
    "Unlimited storage",
    "Personalized internship matching",
    "Early access to new listings",
  ];

  const freeFeatures = [
    "20 on first day, then 3/day for Internships",
    "5 Scholarships per day",
    "5 Extracurriculars per day",
    "Basic internship search",
    "Profile builder",
  ];

  const features = selectedPlan === "Unlimited" ? unlimitedFeatures : freeFeatures;

  return (
    <View className="flex-1 bg-[#F6F6F6]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center">
          <Image
            source={backIcon}
            style={{ width: 24, height: 24, tintColor: "#000" }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity onPress={handleRestore}>
            <Text className="text-gray-500 font-medium">Restore</Text>
          </TouchableOpacity>
        )}
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
                fontSize: selectedPlan === "Unlimited" && Platform.OS === 'ios' ? 48 : 64,
                color: "#000",
                fontWeight: "700"
              }}
            >
              {selectedPlan === "Unlimited"
                ? (Platform.OS === 'ios'
                  ? (appleProduct?.localizedPrice || "$7.99")
                  : (prices["monthly"]
                    ? `$${Math.round(prices["monthly"].unit_amount / 100)}`
                    : "$8"))
                : "$0"}
            </Text>
            {!(selectedPlan === "Unlimited" && Platform.OS === 'ios') && (
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
            )}
          </View>

          <Text
            style={{
              fontFamily: "Raleway",
              fontSize: 14,
              color: "#999",
              marginBottom: 32
            }}
          >
            {selectedPlan === "Unlimited" && Platform.OS === 'ios' ? "Cancel anytime in App Store" : "billed monthly"}
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

          {Platform.OS === 'ios' && selectedPlan === "Unlimited" && (
            <View className="mt-6 flex-row justify-center items-center gap-x-4">
              <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync("https://docs.google.com/document/d/1DIHDsrmfBaz15RrHTwCOtXNbf3Dw4dRCH8o2HkSeO7w/edit?tab=t.0")}>
                <Text className="text-gray-600 text-sm underline">Terms of Use</Text>
              </TouchableOpacity>
              <Text className="text-gray-300">•</Text>
              <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync("https://docs.google.com/document/d/1DIHDsrmfBaz15RrHTwCOtXNbf3Dw4dRCH8o2HkSeO7w/edit?tab=t.0")}>
                <Text className="text-gray-600 text-sm underline">Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

