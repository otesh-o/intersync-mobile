import { useFonts } from 'expo-font';
import { Text, View } from 'react-native';

export default function Header() {
  const [fontsLoaded] = useFonts({
    ClairesNewsBold: require('../../assets/fonts/ClaireNewsBold.otf'),
  });

  if (!fontsLoaded) return null;

  return (
    <View className="mt-10 mb-4 items-center">
      <Text style={{ fontFamily: 'ClaireNewsBold' }} className="text-2xl">
        INTERN SYNC
      </Text>
    </View>
  );
}
