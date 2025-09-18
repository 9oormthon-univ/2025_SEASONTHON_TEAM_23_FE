import { Text, View } from 'react-native';
import CustomSwitch from '@common/CustomSwitch';

type ToggleCardProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  bgColor?: string;
  smallText?: string;
  mainText?: string;
};

const ToggleCard = ({
  value,
  onChange,
  label,
  bgColor = '#2F394E',
  smallText,
  mainText,
}: ToggleCardProps) => {
  return (
    <View className="items-center gap-4">
      {/* 안내 문구 */}
      {label && <Text className="subHeading3 !leading-7 text-white">{label}</Text>}

      {/* 공개 토글 카드 */}
      <View
        className="w-full flex-row items-center justify-between rounded-[20px] px-8 py-5"
        style={{ backgroundColor: bgColor }}
      >
        <View>
          <Text className="captionSB text-white">{smallText}</Text>
          <Text className="body1 !leading-6 text-white">{mainText}</Text>
        </View>
        <CustomSwitch value={value} onValueChange={onChange} />
      </View>
    </View>
  );
};

export default ToggleCard;
