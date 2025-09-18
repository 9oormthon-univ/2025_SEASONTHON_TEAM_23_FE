import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/types/navigation';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import SettingScreen from '@/screens/settings/SettingScreen';
import ImageSettingScreen from '@/screens/settings/ImageSettingScreen';
import PetManageScreen from '@/screens/settings/PetManageScreen';
import CustomHeader from '@navigation/CustomHeader';
import type { HeaderProps } from '@/types/Header';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import PetRegistrationScreen from '@/screens/settings/PetRegistrationScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => {
          const { navigation, options, back } = props;
          const nativeOpts = options as unknown as NativeStackNavigationOptions;
          const tint = nativeOpts?.headerTintColor as string | undefined;
          const { hasBack, hasLogo, hasButton, label, icon, iconSize, iconColor, onPress } =
            options as unknown as HeaderProps;

          return (
            <CustomHeader
              hasBack={hasBack ?? !!back}
              hasLogo={!!hasLogo}
              hasButton={!!hasButton}
              label={label}
              icon={icon}
              iconSize={iconSize}
              iconColor={iconColor ?? tint}
              bgColor="#121826"
              onBack={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.navigate('ProfileMain');
                }
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
          title: '',
          hasBack: true,
          hasButton: true,
          icon: 'IcSetting',
          iconSize: 24,
          onPress: () => navigation.navigate('Setting'),
        })}
      />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="ImageSetting" component={ImageSettingScreen} />
      <Stack.Screen name="PetManage" component={PetManageScreen} />
      <Stack.Screen
        name="PetRegistrationInProfile"
        component={PetRegistrationScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
