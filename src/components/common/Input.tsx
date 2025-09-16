import { Text, TextInput, View } from 'react-native';

type InputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  helperText?: string;
  disabled?: boolean;
  error?: boolean;
};

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  helperText,
  disabled = false,
  error = false,
}: InputProps) => {
  return (
    <View className="gap-2">
      <Text className="body2 text-gray-200">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        maxLength={maxLength}
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor="#808080"
        className={`body1 rounded-2xl bg-gray-800 px-5 py-4 text-white ${error && 'border border-error'}`}
      />
      {helperText && (
        <Text className={`body3 ${error ? 'text-error' : 'text-gray-500'}`}>{helperText}</Text>
      )}
    </View>
  );
};

export default Input;
