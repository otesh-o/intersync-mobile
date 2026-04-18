// app/components/NotificationCard.js
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { api } from "../services/api";

const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const now = new Date();
  const savedDate = new Date(dateString);
  if (isNaN(savedDate)) return "Just now";

  const diffInMinutes = Math.floor((now - savedDate) / (1000 * 60));
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

const NotificationCard = ({ item, onRemove }) => {
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);


  const title = item.title || "No Title";
  const description =
    item.description || item.body || "No description available.";
  const logoUrl = (item.icon || item.logoUrl || "").trim(); 
  const createdAt = item.createdAt || item.created_at || item.timestamp;

  
  const handleDelete = async () => {
    const notificationId = item._id || item.id;
    if (!notificationId) {
      console.warn("❌ Missing notification ID for deletion");
      return;
    }

    try {
      await api(`/v1/notifications/${notificationId}`, { method: "DELETE" });
      onRemove?.();
      setConfirmModalVisible(false);
    } catch (error) {
      console.error("Failed to delete notification:", error);
      alert("Could not delete. Please check your connection.");
      setConfirmModalVisible(false);
    }
  };

  return (
    <>
      {/* Notification Card */}
      <TouchableOpacity
        className="bg-white border border-gray-300 rounded-lg p-3 mb-3"
        onPress={() => {
        
          console.log("Tapped notification:", item);
        }}
      >
        <View className="flex-row">
          
          <View className="w-10 h-10 bg-slate-200 rounded-lg mr-4 justify-center items-center overflow-hidden">
            {logoUrl ? (
              <Image
                source={{ uri: logoUrl }}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            ) : (
              <Icon name="alert-circle-outline" size={24} color="#999" />
            )}
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Title */}
            <Text className="text-base font-bold text-black" numberOfLines={2}>
              {title}
            </Text>

            {/* Description */}
            <Text
              className="text-sm text-gray-600 mt-1 leading-tight"
              numberOfLines={2}
            >
              {description}
            </Text>

            {/* Time */}
            <Text className="text-xs text-gray-500 mt-2">
              {formatTimeAgo(createdAt)}
            </Text>
          </View>

          <TouchableOpacity
            className="absolute right-2 bottom-2"
            onPress={() => setConfirmModalVisible(true)}
          >
            <Text className="text-red-500 text-xs font-semibold">Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal visible={isConfirmModalVisible} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center p-5"
          onPress={() => setConfirmModalVisible(false)}
        >
          <View className="bg-white rounded-2xl w-full max-w-sm p-6">
            <Text className="text-lg font-bold text-black mb-2">
              Delete Notification?
            </Text>
            <Text className="text-gray-600 mb-6">
              Are you sure you want to delete this notification? This cannot be
              undone.
            </Text>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 py-3 border border-gray-300 rounded-lg"
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text className="text-center text-gray-600 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 bg-red-500 rounded-lg"
                onPress={handleDelete}
              >
                <Text className="text-center text-white font-medium">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default NotificationCard;

