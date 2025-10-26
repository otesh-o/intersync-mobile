// app/components/ApplicationCard.js
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

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

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "PENDING": return "#fbbf24";
    case "REVIEWED": return "#8b5cf6";
    case "INTERVIEW": return "#3b82f6";
    case "OFFER": return "#10b981";
    case "REJECTED": return "#ef4444";
    default: return "#6b7280";
  }
};

const ApplicationCard = ({ application }) => {
  if (!application) {
    console.warn("ApplicationCard: received null or undefined application");
    return null;
  }

  // The job data is in application.jobId (as an object), not application.job
  const job = application.job || application.jobId || {};
  const company = typeof job.company === "object" ? job.company : {};

  const title = job.title || "Job Title Not Available";
  const companyName = company.name || "Unknown Company";
  const location = job.location || "Location not specified";
  const applicantName = application.applicantName || "You";
  const jobId = job._id || job.id;

  const handlePress = () => {
    if (jobId) {
      router.push({
        pathname: "/Homepage/jobdescription",
        params: { id: jobId },
      });
    } else {
      console.error("ApplicationCard: Cannot navigate — job ID is missing", job);
    }
  };

  return (
    <TouchableOpacity
      className="bg-white border border-gray-300 rounded-lg p-3 mb-3"
      onPress={handlePress}
    >
      <View className="flex-1">
        <Text
          className="text-base font-bold text-black"
          numberOfLines={2}
        >
          {title}
        </Text>

        <Text className="text-sm text-gray-600 mt-1">
          {companyName} • {location}
        </Text>

        <Text className="text-sm text-gray-500 mt-1">
          Applied by: {applicantName}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-xs text-gray-500">
            {formatTimeAgo(application.createdAt)}
          </Text>

          {application.status && (
            <View
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: getStatusColor(application.status) }}
            >
              <Text className="text-white text-xs font-bold uppercase tracking-tight">
                {application.status}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ApplicationCard;