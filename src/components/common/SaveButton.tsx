import { Pressable, Text } from 'react-native';

type SaveButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
};

const SaveButton = ({ onPress, disabled }: SaveButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg ${disabled ? 'bg-yellow-100' : 'bg-yellow-200'} px-3 py-2`}
    >
      <Text className="body2 text-gray-900">{`완료`}</Text>
    </Pressable>
  );
};

export default SaveButton;
