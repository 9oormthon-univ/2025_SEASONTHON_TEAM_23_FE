import { NavigationContainer, type NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { linking } from './linking';
import { type RootStackParamList } from '@/types/navigation';
import TabNavigator from './TabNavigator';
import { useAuth } from '@/provider/AuthProvider';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
import NotificationListScreen from '@/screens/notification/NotificationListScreen';
import type { RefObject } from 'react';
import type { HeaderProps } from '@/types/Header';
import CustomHeader from '@navigation/CustomHeader';
import { useNeedsPetProfile } from '@/hooks/queries/useNeedsPetProfile';
import Loader from '@common/Loader';
import PetRegistrationScreen from '@/screens/settings/PetRegistrationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

type RootNavigatorProps = {
  navigationRef: RefObject<NavigationContainerRef<any> | null>;
};

const RootNavigator = ({ navigationRef }: RootNavigatorProps) => {
  const { user } = useAuth();
  const { needsPet, loading } = useNeedsPetProfile(!!user);

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        {!user ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : loading ? (
          <Stack.Screen
            name="Boot"
            options={{ headerShown: false }}
            component={() => <Loader isPageLoader />}
          />
        ) : needsPet ? (
          <Stack.Screen
            name="PetRegistration"
            component={PetRegistrationScreen}
            options={{ header: () => <CustomHeader hasLogo bgColor="#121826" /> }}
          />
        ) : (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen
              name="NotificationList"
              component={NotificationListScreen}
              options={{
                header: (props) => {
                  const { navigation, options } = props;
                  const { hasButton, icon, iconSize, iconColor, title, onPress } =
                    options as unknown as HeaderProps;
                  return (
                    <CustomHeader
                      hasBack={true}
                      hasButton={!!hasButton}
                      icon={icon}
                      iconSize={iconSize}
                      iconColor={iconColor}
                      title={title}
                      onBack={() => navigation.goBack()}
                      onPress={onPress}
                    />
                  );
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
