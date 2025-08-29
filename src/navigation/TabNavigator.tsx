import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { type TabsParamList } from '@/types/navigation';
import HomeScreen from '@/screens/home/HomeScreen';
import DiaryScreen from '@/screens/diary/DiaryScreen';
import LetterScreen from '@/screens/letter/LetterScreen';
import CounselingScreen from '@/screens/counseling/CounselingScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<TabsParamList>();

const COLORS = {
  active: '#c17b44',
  inactive: '#9ca3af',
  tabBg: '#ffffff',
} as const;

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarStyle: {
          backgroundColor: 'white',
        },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Diary"
        component={DiaryScreen}
        options={{
          title: '오늘의 일기',
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Letter"
        component={LetterScreen}
        options={{
          title: '한마디 편지',
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name={focused ? 'mail' : 'mail-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Counseling"
        component={CounselingScreen}
        options={{
          title: '심리 상담소',
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name={focused ? 'bandage' : 'bandage-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
