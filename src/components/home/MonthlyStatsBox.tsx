import React from 'react';
import { View, Text } from 'react-native';
import { useDailyLogMoodAnalyze } from '@/hooks/queries/useDailyLogMoodAnalyze';
import Icon from '@common/Icon';
import { ACTIVE_UI } from '@/constants/diary/emoji';

const MonthlyStatsBox: React.FC = () => {
  const { data: moodAnalyze } = useDailyLogMoodAnalyze();

  if (!moodAnalyze) return null;

  return (
    <View className="items-center gap-4 overflow-hidden rounded-[20px] bg-bg-light px-6 py-5">
      <Icon name="IcSmiley" width={24} height={24} color={ACTIVE_UI.best.icon} />
      <Text className="subHeading3 text-center !leading-7 text-white">
        {`지난 달에 작성한 ${moodAnalyze.dailyCount}개의 일기 중,\n좋았던 날은 ${moodAnalyze.bestMoodCount}일이에요.`}
      </Text>
    </View>
  );
};

export default MonthlyStatsBox;
