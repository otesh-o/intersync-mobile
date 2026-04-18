// app/profile_page/components/SectionItem.js
import { Image, Pressable, Text, View, Linking } from "react-native";
import { router } from "expo-router";

const ICON_MAP = {
  "About Me": require("../../../../assets/images/about.png"),
  "Work Experience": require("../../../../assets/images/experience.png"),
  Education: require("../../../../assets/images/education.png"),
  Skills: require("../../../../assets/images/Skill.png"),
  Languages: require("../../../../assets/images/Language.png"),
  Appreciation: require("../../../../assets/images/appreciation.png"),
  Resume: require("../../../../assets/images/resume2.png"),
};

export default function SectionItem({
  label,
  content,
  isExpanded,
  onToggle,
  onPressEdit, // ← Accept this
  onUpload,
}) {
  const iconSource =
    ICON_MAP[label] || require("../../../../assets/images/add.png");

  // Handle edit press: use parent-provided handler or fallback
  const handleEditPress = () => {
    if (onPressEdit) {
      onPressEdit();
    } else {
      // Fallback for profile page
      const routeMap = {
        "About Me": "edit-about-me",
        "Work Experience": "edit-work-experience",
        Education: "edit-education",
        Skills: "edit-skills",
        Languages: "edit-languages",
        Appreciation: "edit-appreciation",
        Resume: "edit-resume",
      };

      const route = routeMap[label];
      if (route) {
        router.push(
          `/profile_page/${route}?section=${encodeURIComponent(label)}`
        );
      }
    }
  };

  return (
    <View className="w-full max-w-md mx-auto rounded-xl bg-white mb-3 shadow-sm">
      <View className="flex-row justify-between items-center px-6 py-5 border-b border-gray-100">
        <View className="flex-row items-center">
          <Image
            source={iconSource}
            className="w-7 h-7 mr-3"
            resizeMode="contain"
          />
          <Text className="font-semibold text-base text-gray-900 font-sans">
            {label}
          </Text>
        </View>

        <Pressable onPress={onToggle} hitSlop={10}>
          <Text className="text-xl font-bold text-gray-500 w-6 text-center">
            {isExpanded ? "–" : "+"}
          </Text>
        </Pressable>
      </View>

      {isExpanded && (
        <View className="px-6 py-4 relative">
          {/* Edit icon uses unified handler */}
          <Pressable
            className="absolute top-4 right-6 z-10"
            onPress={handleEditPress}
            hitSlop={8}
          >
            <Image
              source={require("../../../../assets/images/edit.png")}
              className="w-4 h-4"
              style={{ tintColor: "#007AFF" }}
            />
          </Pressable>

          {/* Render content based on type */}
          {label === "Work Experience" ||
          label === "Education" ||
          label === "Appreciation" ? (
            <View className="mt-1">
              {Array.isArray(content) && content.length > 0 ? (
                content.map((item, index) => (
                  <View key={item.id || index} className="mb-4">
                    <Text className="text-lg font-semibold text-gray-900 font-sans">
                      {item.title || item.degree || "No title"}
                    </Text>
                    {item.company && (
                      <Text className="text-sm text-gray-700 font-sans mt-1">
                        {item.company}
                      </Text>
                    )}
                    {item.school && (
                      <Text className="text-sm text-gray-700 font-sans mt-1">
                        {item.school}
                      </Text>
                    )}
                    <Text className="text-xs italic text-gray-500 font-sans mt-1">
                      {item.startDate
                        ? `${item.startDate} – ${item.endDate || "Present"}`
                        : item.date
                        ? item.date
                        : ""}
                    </Text>
                    {item.description && (
                      <Text
                        className="text-sm text-gray-600 font-sans mt-2"
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>
                    )}
                    {index < content.length - 1 && (
                      <View className="h-px bg-gray-200 my-3" />
                    )}
                  </View>
                ))
              ) : (
                <Pressable onPress={handleEditPress}>
                  <Text className="text-blue-500 font-medium text-sm mt-1">
                    + Add {label.toLowerCase()}
                  </Text>
                </Pressable>
              )}
            </View>
          ) : label === "Skills" || label === "Languages" ? (
            <View className="flex-row flex-wrap gap-2 mt-1">
              {Array.isArray(content) && content.length > 0 ? (
                content.map((item) => (
                  <View
                    key={item}
                    className="bg-gray-200 px-3 py-1.5 rounded-full"
                  >
                    <Text className="text-sm text-gray-800 font-sans">
                      {item}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-sm text-gray-500 italic font-sans">
                  {label === "Skills"
                    ? "No skills added"
                    : "No languages added"}
                </Text>
              )}
            </View>
          ) : label === "Resume" ? (
            <View className="mt-1">
              {content && content.uri ? (
                <Pressable
                  onPress={() => {
                    Linking.openURL(content.uri).catch(() =>
                      alert(
                        "Cannot open file. It may have been moved or deleted."
                      )
                    );
                  }}
                >
                  <Text
                    numberOfLines={1}
                    className="bg-gray-200 px-3 py-2 rounded text-sm text-gray-800 font-sans max-w-[300]"
                  >
                    📄 {content.name}
                  </Text>
                </Pressable>
              ) : (
                <Text className="text-sm text-gray-500 italic font-sans">
                  No resume uploaded
                </Text>
              )}
            </View>
          ) : typeof content === "string" ? (
            content.trim() !== "" ? (
              <Text className="text-sm text-gray-600 font-sans mt-1">
                {content}
              </Text>
            ) : (
              <Pressable onPress={handleEditPress}>
                <Text className="text-blue-500 font-medium text-sm mt-1">
                  + Add About Me
                </Text>
              </Pressable>
            )
          ) : null}
        </View>
      )}
    </View>
  );
}

