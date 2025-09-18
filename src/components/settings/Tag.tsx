import { Text, TouchableOpacity } from 'react-native';

type TagProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  activeColor?: string;
  inactiveColor?: string;
};

const Tag = ({
  label,
  active = false,
  onPress,
  activeColor = '#FFD86F',
  inactiveColor = '#9D9D9D',
}: TagProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row gap-1 rounded-full border px-3 py-2"
      style={{ borderColor: active ? activeColor : inactiveColor }}
    >
      <Text className="body2" style={{ color: activeColor }}>{`#`}</Text>
      <Text className="body2" style={{ color: active ? activeColor : inactiveColor }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Tag;
