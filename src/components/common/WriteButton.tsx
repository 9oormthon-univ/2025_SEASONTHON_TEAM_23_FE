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
      className="flex-row items-center gap-1 rounded-xl px-9 py-3"
      style={{ backgroundColor: '#FFD86F' }}
    >
      <Icon name="IcEdit" size={20} fill="#1F2A3C" />
      <Text className="body1 leading-[1.6]" style={{ color: '#1F2A3C' }}>{label}</Text>
    </Pressable>
  );
};

export default WriteButton;
