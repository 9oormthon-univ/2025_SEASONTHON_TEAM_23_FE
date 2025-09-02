import { Pressable, Text } from 'react-native';

type SaveButtonProps = {
  onPress?: () => void;
};

const SaveButton = ({ onPress }: SaveButtonProps) => {
  return (
    <Pressable onPress={onPress} className="rounded-lg bg-primary px-3 py-2">
      <Text className="body2 text-white">{`완료`}</Text>
    </Pressable>
  );
};

export default SaveButton;
