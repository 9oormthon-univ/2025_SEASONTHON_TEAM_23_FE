import { Pressable, Text } from 'react-native';

type SaveButtonProps = {
  onPress?: () => void;
};

const SaveButton = ({ onPress }: SaveButtonProps) => {
  return (
    <Pressable onPress={onPress} className="rounded-lg bg-yellow-200 px-3 py-2">
      <Text className="body2 text-gray-900">{`완료`}</Text>
    </Pressable>
  );
};

export default SaveButton;
