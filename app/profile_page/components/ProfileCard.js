// ProfileCard.js
import { Image, Text, TouchableOpacity, View, TextInput } from "react-native";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons"; // Make sure you have this

export default function ProfileCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Emelyn Angga");
  const [role, setRole] = useState("UX Researcher. UX Researcher");

  return (
    <View
      style={{
        width: "100%",
        maxWidth: 350,
        borderRadius: 13.29,
        backgroundColor: "#F7F7F7",
        paddingHorizontal: 16,
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 32,
      }}
    >
      {/* Profile Image */}
      <TouchableOpacity>
        <View
          style={{
            width: 68,
            height: 68,
            borderRadius: 34,
            backgroundColor: "#ccc",
            marginBottom: 12,
          }}
        />
      </TouchableOpacity>

      {/* Edit Button - Top Right */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 20,
          right: 24,
          zIndex: 10,
        }}
        onPress={() => setIsEditing(!isEditing)}
      >
        <Icon name={isEditing ? "checkmark" : "create-outline"} size={24} color="#007AFF" />
      </TouchableOpacity>

      {/* Name */}
      <View style={{ width: "100%", alignItems: "center", marginBottom: 4 }}>
        {isEditing ? (
          <TextInput
            value={name}
            onChangeText={setName}
            style={{
              fontFamily: "Roboto-Bold",
              fontWeight: "700",
              fontSize: 20,
              color: "#000",
              textAlign: "center",
              width: "80%",
              borderBottomWidth: 1,
              borderBottomColor: "#007AFF",
              paddingBottom: 4,
            }}
            autoFocus
            onSubmitEditing={() => setIsEditing(false)}
          />
        ) : (
          <Text
            style={{
              fontFamily: "Roboto-Bold",
              fontWeight: "700",
              fontSize: 20,
              color: "#000",
            }}
          >
            {name}
          </Text>
        )}
      </View>

      {/* Role */}
      <View style={{ width: "100%", alignItems: "center", marginBottom: 16 }}>
        {isEditing ? (
          <TextInput
            value={role}
            onChangeText={setRole}
            style={{
              fontFamily: "Raleway-Medium",
              fontWeight: "500",
              fontSize: 12.5,
              lineHeight: 19,
              color: "#666",
              textAlign: "center",
              width: "80%",
              borderBottomWidth: 1,
              borderBottomColor: "#007AFF",
              paddingBottom: 4,
            }}
            placeholder="e.g. UX Researcher"
            multiline
            onSubmitEditing={() => setIsEditing(false)}
          />
        ) : (
          <Text
            style={{
              fontFamily: "Raleway-Medium",
              fontWeight: "500",
              fontSize: 12.5,
              lineHeight: 19,
              color: "#666",
              textAlign: "center",
              width: "80%",
            }}
          >
            {role}
          </Text>
        )}
      </View>

      {/* Stats Row */}
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          paddingHorizontal: 24,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Rate */}
        <View style={{ alignItems: "flex-start" }}>
          <Text
            style={{
              fontFamily: "Raleway-Medium",
              fontWeight: "500",
              fontSize: 12.5,
              color: "#000",
            }}
          >
            Rate
          </Text>
          <Text
            style={{
              fontFamily: "Roboto-Bold",
              fontWeight: "700",
              fontSize: 14,
              color: "#333",
              marginTop: 4,
            }}
          >
            $40/hr
          </Text>
        </View>

        {/* Projects */}
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Raleway-Medium",
              fontWeight: "500",
              fontSize: 12.5,
              color: "#000",
            }}
          >
            Projects
          </Text>
          <Text
            style={{
              fontFamily: "Roboto-Bold",
              fontWeight: "700",
              fontSize: 14,
              color: "#333",
              marginTop: 4,
            }}
          >
            120
          </Text>
        </View>

        {/* Reviews */}
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontFamily: "Raleway-Medium",
              fontWeight: "500",
              fontSize: 12.5,
              color: "#000",
            }}
          >
            Reviews
          </Text>
          <Text
            style={{
              fontFamily: "Roboto-Bold",
              fontWeight: "700",
              fontSize: 14,
              color: "#333",
              marginTop: 4,
            }}
          >
            222
          </Text>
        </View>
      </View>
    </View>
  );
}