import { Text, Pressable } from 'react-native';
import Icon from '@common/Icon';

type WriteButtonProps = {
  label: string;
  onPress?: () => void;
};

const WriteButton = ({ label, onPress }: WriteButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      className="flex-row items-center gap-1 rounded-xl bg-yellow-200 px-9 py-2"
    >
      <Icon name="IcEdit" size={24} color="#121826" />
      <Text className="body1 !leading-[1.6] text-bg">{label}</Text>
    </Pressable>
  );
};

export default WriteButton;
