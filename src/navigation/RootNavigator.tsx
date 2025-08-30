import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { linking } from './linking';
import { type RootStackParamList } from '@/types/navigation';
import TabNavigator from './TabNavigator';
import {useAuth} from "@/provider/AuthProvider";
import OnboardingScreen from "@/screens/onboarding/OnboardingScreen";
import LetterDetailScreen from '@/screens/letter/LetterDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user } = useAuth();
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        {user ? (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{headerShown: false}}/>
            <Stack.Screen name="LetterDetail" component={LetterDetailScreen} />
          </>
        ) : (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown: false}} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
