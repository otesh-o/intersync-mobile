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
  switch (status.toUpperCase()) {
    case "PENDING":
      return "#fbbf24";
    case "REVIEWED":
      return "#8b5cf6";
    case "INTERVIEW":
      return "#3b82f6";
    case "OFFER":
      return "#10b981";
    case "REJECTED":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

const ApplicationCard = ({ application }) => {
  
  const { jobTitle, company, location } = application.job || {};

  const title = jobTitle || "Job Title Not Available";
  const companyName =
    typeof company === "object" ? company.name : company || "Unknown Company";
  const jobLocation = location || "Location not specified";

  const handlePress = () => {
    if (application.jobId) {
      router.push({
        pathname: "/Homepage/jobdescription",
        params: { id: application.jobId },
      });
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="bg-white border border-gray-300 rounded-lg p-4 mb-3 relative">
        
        <View
          className="absolute top-3 right-3 px-2 py-1 rounded-full"
          style={{ backgroundColor: getStatusColor(application.status) }}
        >
          <Text className="text-white text-xs font-bold uppercase tracking-tight">
            {application.status}
          </Text>
        </View>

        
        <View className="flex-row">
          {/* Logo*/}
          <View className="w-12 h-12 bg-slate-200 rounded-lg mr-4 justify-center items-center overflow-hidden">
            <Icon name="briefcase-outline" size={28} color="#999" />
          </View>

          <View className="flex-1">
            {/* Job Title */}
            <Text className="text-base font-bold text-black" numberOfLines={1}>
              {title}
            </Text>

            {/* Company & Location */}
            <Text className="text-sm text-gray-600 mt-1">
              {companyName} • {jobLocation}
            </Text>

            Applicant Name
            <Text className="text-sm text-gray-500 mt-1">
              Applied by: {application.applicantName}
            </Text>

            {/* Time */}
            <Text className="text-xs text-gray-500 mt-2">
              {formatTimeAgo(application.createdAt)}
            </Text>
          </View>
        </View>

    
        <TouchableOpacity
          className="mt-4 self-start bg-black py-1.5 px-4 rounded"
          onPress={handlePress}
        >
          <Text className="text-white text-sm font-medium">View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ApplicationCard;
