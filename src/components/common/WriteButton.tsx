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
      className="bg-primary flex-row items-center gap-1 rounded-xl px-9 py-2"
    >
      <Icon name="IcEdit" size={24} fill="white" />
      <Text className="body1 leading-[1.6] text-white">{label}</Text>
    </Pressable>
  );
};

export default WriteButton;
