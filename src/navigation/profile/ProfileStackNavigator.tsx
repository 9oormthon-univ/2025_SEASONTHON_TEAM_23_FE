import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import type { ProfileStackParamList } from '@/types/navigation';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import SettingScreen from '@/screens/settings/SettingScreen';
import ImageSettingScreen from '@/screens/settings/ImageSettingScreen';
import PetManageScreen from '@/screens/settings/PetManageScreen';
import CustomHeader from '@navigation/CustomHeader';
import type { HeaderProps } from '@/types/Header';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ViewStyle } from 'react-native';
import PetRegistrationScreen from '@/screens/settings/PetRegistrationScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => {
          const { navigation, options, back } = props;
          const nativeOpts = options as unknown as NativeStackNavigationOptions;
          const flatHeaderStyle = StyleSheet.flatten(nativeOpts?.headerStyle as any) as
            | ViewStyle
            | undefined;
          const bg = flatHeaderStyle?.backgroundColor as string | undefined;
          const tint = nativeOpts?.headerTintColor as string | undefined;
          const {
            hasBack,
            hasLogo,
            hasButton,
            icon,
            iconSize,
            iconColor,
            title,
            onPress,
            bgColor,
          } = options as unknown as HeaderProps;

          return (
            <View style={{ backgroundColor: bg }}>
              <CustomHeader
                hasBack={hasBack ?? !!back}
                hasLogo={!!hasLogo}
                hasButton={!!hasButton}
                icon={icon}
                iconSize={iconSize}
                iconColor={iconColor ?? tint}
                bgColor={bgColor}
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
            </View>
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
          bgColor: '#121826',
          onPress: () => navigation.navigate('Setting'),
        })}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={({}) => ({
          bgColor: '#121826',
          title: '설정',
        })}
      />
      <Stack.Screen
        name="ImageSetting"
        component={ImageSettingScreen}
        options={({}) => ({
          bgColor: '#121826',
          title: '프로필 사진 변경',
        })}
      />
      <Stack.Screen
        name="PetManage"
        component={PetManageScreen}
        options={({}) => ({
          bgColor: '#121826',
          title: '반려동물 관리',
        })}
      />
      <Stack.Screen
        name="PetRegistrationInProfile"
        component={PetRegistrationScreen}
        options={({}) => ({
          bgColor: '#121826',
          title: '반려동물 등록',
        })}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
