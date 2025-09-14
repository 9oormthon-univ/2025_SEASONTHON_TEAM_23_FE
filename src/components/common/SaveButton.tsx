import { Pressable, Text } from 'react-native';
import Loader from '@common/Loader';

type SaveButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

const SaveButton = ({ onPress, disabled, isLoading }: SaveButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg ${disabled ? 'bg-gray-800' : 'bg-yellow-200'} px-3 py-2`}
      disabled={disabled || isLoading}
    >
      {isLoading ? <Loader /> : <Text className="body2 text-gray-900">{`완료`}</Text>}
    </Pressable>
  );
};

export default SaveButton;
