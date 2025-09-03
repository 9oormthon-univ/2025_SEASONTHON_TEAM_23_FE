import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DiaryStackParamList } from '@/types/navigation';
import DiaryMainScreen from '@/screens/diary/DiaryMainScreen';
import DiaryWriteScreen from '@/screens/diary/DiaryWriteScreen';
import DiaryByDateScreen from '@/screens/diary/DiaryByDateScreen';
import CustomHeader from '@navigation/CustomHeader';

const Stack = createNativeStackNavigator<DiaryStackParamList>();

const DiaryStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DiaryMain">
      <Stack.Screen
        name="DiaryMain"
        component={DiaryMainScreen}
        options={{
          header: () => (
            <CustomHeader hasBack hasButton icon="IcNotification" title="오늘의 일기" />
          ),
        }}
      />
      <Stack.Screen
        name="DiaryWrite"
        component={DiaryWriteScreen}
        options={{
          header: () => <CustomHeader hasBack hasButton title="오늘의 일기" />,
        }}
      />
      <Stack.Screen
        name="DiaryByDate"
        component={DiaryByDateScreen}
        options={{
          header: () => (
            <CustomHeader
              hasBack
              hasButton
              icon="IcTrash"
              iconSize={28}
              iconColor="#313131"
              title="오늘의 일기"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default DiaryStackNavigator;
