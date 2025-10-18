// app/components/SavedJobCard.js
import { router } from "expo-router";
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

const SavedJobCard = ({ item, onRemove }) => {
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);

  
  const job = item.jobId || item; 
  const company = typeof job.company === "object" ? job.company : {};

  const companyName = company.name || "Unknown Company";
  const title = job.title || "No Title Available";
  const location = job.location || "Location not specified";
  const type = job.jobType || job.type || "N/A";
  const stipendAmount = job.description?.stipend?.amount;
  const compensation = stipendAmount
    ? `$${stipendAmount.toLocaleString()}`
    : "—";
  const aboutUsSnippet = company.aboutUs
    ? `${company.aboutUs.substring(0, 80)}...`
    : "Learn more about this organization and their mission.";
  const logoUrl = (company.logoUrl || "").trim();

  
  const handleDelete = async () => {
    const jobId = job._id || job.id;
    if (!jobId) {
      console.warn("Missing job ID for deletion");
      return;
    }

    try {
      await api(`/v1/bookmark/job/${jobId}`, { method: "DELETE" });
      onRemove?.(jobId);
      setConfirmModalVisible(false);
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      alert("Could not delete. Please check your connection.");
      setConfirmModalVisible(false);
    }
  };

  return (
    <>
      {/* Job Card */}
      <TouchableOpacity
        className="bg-white border border-gray-300 rounded-lg p-3 mb-3"
        onPress={() =>
          router.push({
            pathname: "/Homepage/jobdescription",
            params: { id: job._id || job.id },
          })
        }
      >
        {/* Logo */}
        <View className="flex-row">
          {/* <View className="w-10 h-10 bg-slate-200 rounded-lg mr-4 justify-center items-center overflow-hidden">
            {logoUrl ? (
              <Image
                source={{ uri: logoUrl }}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            ) : (
              <Icon name="business-outline" size={24} color="#999" />
            )}
          </View> */}

          {/* Main Content */}
          <View className="flex-1">
            {/* Company Name */}
            {/* <Text
              className="text-xs text-gray-500 font-medium"
              numberOfLines={1}
            >
              {companyName}
            </Text> */}

            {/* Title */}
            <Text
              className="text-base font-bold text-black mt-1"
              numberOfLines={2}
            >
              {title}
            </Text>

            {/* About Us  */}
            <Text
              className="text-sm text-gray-600 mt-1.5 leading-tight"
              numberOfLines={2}
            >
              {aboutUsSnippet}
            </Text>

            <View className="flex-row flex-wrap items-center gap-y-1 mt-2">
              <View className="flex-row items-center mr-3">
                <Icon name="location-outline" size={12} color="#666" />
                <Text className="text-xs text-gray-600 ml-1">{location}</Text>
              </View>

              <View className="flex-row items-center mr-3">
                <Icon name="calendar-outline" size={12} color="#666" />
                <Text className="text-xs text-gray-600 ml-1">{type}</Text>
              </View>

              {/* <View className="flex-row items-center">
                <Icon name="cash-outline" size={12} color="#666" />
                <Text className="text-xs text-gray-600 ml-1">
                  {compensation}
                </Text>
              </View> */}
              <Text className="text-xs text-gray-500 mt-2">
                {formatTimeAgo(item.createdAt || item.savedAt)}
              </Text>
            </View>

           
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            className="ml-2 self-start mt-1"
            onPress={() => setConfirmModalVisible(true)}
          >
            <Icon name="trash" size={20} color="#EF4444" />
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
              Remove from Saved?
            </Text>
            <Text className="text-gray-600 mb-6">
              Are you sure you want to remove &apos;{title}&apos; from your
              saved jobs? This can&apos;t be undone.
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
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default SavedJobCard;
