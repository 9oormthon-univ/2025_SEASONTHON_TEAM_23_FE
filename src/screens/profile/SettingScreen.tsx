import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-bg px-6 py-6">
      <View className="mt-4">
        <Text className="subHeading2B text-white">설정</Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;
