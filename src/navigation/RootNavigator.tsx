import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { linking } from './linking';
import { type RootStackParamList } from '@/types/navigation';
import TabNavigator from './TabNavigator';
import {useAuth} from "@/provider/AuthProvider";
import OnboardingScreen from "@/screens/onboarding/OnboardingScreen";
import LetterWriteScreen from '../screens/letter/LetterWriteScreen';
import LetterDetailScreen from '@/screens/letter/LetterDetailScreen';
import MyDailyLogsScreen from '@/screens/profile/MyDailyLogsScreen';
import MyLettersScreen from '@/screens/profile/MyLettersScreen';
import MyTributedLettersScreen from '@/screens/profile/MyTributedLettersScreen';

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
            <Stack.Screen name="MyDailyLogs" component={MyDailyLogsScreen} options={{ title: '내가 쓴 일기' }} />
            <Stack.Screen name="MyLetters" component={MyLettersScreen} options={{ title: '내가 쓴 편지' }} />
            <Stack.Screen name="MyTributedLetters" component={MyTributedLettersScreen} options={{ title: '받은 헌화' }} />
          </>
        ) : (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown: false}} />
        )}
  <Stack.Screen name="LetterWriteScreen" component={LetterWriteScreen} />
    <Stack.Screen name="LetterScreen" component={require('../screens/letter/LetterScreen').default} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
