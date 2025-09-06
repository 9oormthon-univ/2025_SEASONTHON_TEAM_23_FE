import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { linking } from './linking';
import { type RootStackParamList } from '@/types/navigation';
import TabNavigator from './TabNavigator';
import { useAuth } from '@/provider/AuthProvider';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
import MyDailyLogsScreen from '@/screens/profile/MyDailyLogsScreen';
import MyLettersScreen from '@/screens/profile/MyLettersScreen';
import NotificationListScreen from '@/screens/notification/NotificationListScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user } = useAuth();
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        {user ? (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen
              name="MyDailyLogs"
              component={MyDailyLogsScreen}
              options={{ title: '내가 쓴 일기' }}
            />
            <Stack.Screen
              name="MyLetters"
              component={MyLettersScreen}
              options={{ title: '내가 쓴 편지' }}
            />
            <Stack.Screen name="Notification" component={NotificationListScreen} />
          </>
        ) : (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
