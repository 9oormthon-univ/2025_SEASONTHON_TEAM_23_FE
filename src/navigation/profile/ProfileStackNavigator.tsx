import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/types/navigation';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import SettingScreen from '@/screens/profile/SettingScreen';
import ImageSettingScreen from '@/screens/profile/ImageSettingScreen';
import CustomHeader from '@navigation/CustomHeader';
import type { HeaderProps } from '@/types/Header';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => {
          const { navigation, options, back } = props;
          const { hasBack, hasLogo, hasButton, icon, iconSize, iconColor, title, onPress } =
            options as unknown as HeaderProps;

          return (
            <CustomHeader
              hasBack={hasBack ?? !!back}
              hasLogo={!!hasLogo}
              hasButton={!!hasButton}
              icon={icon}
              iconSize={iconSize}
              iconColor={iconColor}
              title={title}
              onBack={() => {
                navigation.getParent()?.navigate('Tabs', { screen: 'Home' });
              }}
              onPress={onPress}
            />
          );
        },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: '프로필',
          hasBack: true,
          hasButton: true,
          icon: 'IcSetting',
          iconSize: 20,
          onPress: () => navigation.navigate('Setting'),
        })}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          title: '설정',
        }}
      />
      <Stack.Screen
        name="ImageSetting"
        component={ImageSettingScreen}
        options={{
          title: '프로필 사진 변경',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
