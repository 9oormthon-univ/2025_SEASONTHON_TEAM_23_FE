import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import type { IconMap, TabsParamList } from '@/types/navigation';
import HomeScreen from '@/screens/home/HomeScreen';
import DiaryStackNavigator from '@/navigation/diary/DiaryStackNavigator';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import TabIcon from '@navigation/TabIcon';
import CustomHeader from '@navigation/CustomHeader';
import LetterStackNavigator from '@/navigation/letter/LetterStackNavigator';

const Tab = createBottomTabNavigator<TabsParamList>();

const ICONS: IconMap = {
  Home: { icon: 'IcHome', name: 'Home' },
  Diary: { icon: 'IcCalendar', name: '일기', title: '오늘의 일기 - 감정 캘린더' },
  Letter: { icon: 'IcLetter', name: '편지' },
  Profile: { icon: 'IcProfile', name: '프로필' },
} as const;

const TABBAR_BG: Record<keyof TabsParamList, 'white' | 'gray'> = {
  Home: 'gray',
  Diary: 'white',
  Letter: 'white',
  Profile: 'gray',
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const { icon, name } = ICONS[route.name as keyof TabsParamList];
        const tabBarBg =
          TABBAR_BG[route.name as keyof TabsParamList] === 'white' ? 'white' : '#F5F5F5';

        return {
          headerTitleAlign: 'center',
          tabBarStyle: {
            backgroundColor: tabBarBg,
            height: 105,
            borderTopWidth: 1.6,
            borderTopColor: '#E7E7E7',
            paddingTop: 16,
            paddingBottom: 36,
          },
          tabBarLabel: ({ focused }) => (
            <Text className={`captionB pt-[5px] ${focused ? 'text-[#313131]' : 'text-[#808080]'}`}>
              {name}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <TabIcon name={icon} color={focused ? '#313131' : '#808080'} />
          ),
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: () => <CustomHeader hasLogo hasButton icon="IcNotification" />,
        }}
      />
      <Tab.Screen name="Diary" component={DiaryStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Letter" component={LetterStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
