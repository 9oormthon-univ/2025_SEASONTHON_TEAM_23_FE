import { Pressable, Text } from 'react-native';
import Loader from '@common/Loader';

type SaveButtonProps = {
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

const SaveButton = ({ label = '완료', onPress, disabled, isLoading }: SaveButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg ${disabled ? 'bg-gray-500' : 'bg-yellow-200'} px-3 py-2`}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Text className={`body2 ${disabled ? 'bg-gray-500' : 'text-gray-900'}`}>{label}</Text>
      )}
    </Pressable>
  );
};

export default SaveButton;
