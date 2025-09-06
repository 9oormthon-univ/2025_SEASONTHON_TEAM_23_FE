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
  Home: { icon: 'IcHome', name: '홈' },
  Diary: { icon: 'IcCalendar', name: '일기', title: '오늘의 일기 - 감정 캘린더' },
  Letter: { icon: 'IcLetter', name: '편지' },
  Profile: { icon: 'IcProfile', name: '프로필' },
} as const;

// 디자인 명세: 공통 배경 #121826, 활성 아이콘/라벨 #FFD86F, 비활성 #AAAAAA
const TAB_BG = '#121826';
const ACTIVE_COLOR = '#FFD86F';
const INACTIVE_COLOR = '#AAAAAA';

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
  const { icon, name } = ICONS[route.name as keyof TabsParamList];

        return {
          headerTitleAlign: 'center',
          tabBarStyle: {
            backgroundColor: TAB_BG,
            height: 68,
            borderTopWidth: 0.5,
            borderTopColor: '#2D3852',
            paddingTop: 6,
            paddingBottom: 10,
          },
            tabBarLabel: ({ focused }) => (
            <Text className="captionB pt-[4px]" style={{ color: focused ? ACTIVE_COLOR : INACTIVE_COLOR }}>
              {name}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <TabIcon name={icon} color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
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
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: () => <CustomHeader hasBack title="프로필" />, // 뒤로가기 버튼 추가
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
