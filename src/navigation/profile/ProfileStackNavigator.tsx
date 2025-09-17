import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/types/navigation';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import SettingScreen from '@/screens/settings/SettingScreen';
import ImageSettingScreen from '@/screens/settings/ImageSettingScreen';
import PetManageScreen from '@/screens/settings/PetManageScreen';
import CustomHeader from '@navigation/CustomHeader';
import type { HeaderProps } from '@/types/Header';
import PetRegistrationScreen from '@/screens/settings/PetRegistrationScreen';

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
      <Stack.Screen
        name="PetManage"
        component={PetManageScreen}
        options={{
          title: '반려동물 관리',
        }}
      />
      <Stack.Screen
        name="PetRegistrationInProfile"
        component={PetRegistrationScreen}
        options={{
          title: '반려동물 등록',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
