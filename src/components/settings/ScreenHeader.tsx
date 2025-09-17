import { Text, View } from 'react-native';

type ScreenHeaderProps = {
  title: string;
};

const ScreenHeader = ({ title }: ScreenHeaderProps) => {
  return (
    <View className="gap-7 pt-5">
      <Text className="heading2B px-7 !leading-[42px] text-white">{title}</Text>
      <View className="h-2 border border-[#4A5263] bg-[#303A4F]"></View>
    </View>
  );
};

export default ScreenHeader;
