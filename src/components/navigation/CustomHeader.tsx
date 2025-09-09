import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { HeaderProps } from '@/types/Header';
import Icon from '@common/Icon';
import SaveButton from '@common/SaveButton';

const CustomHeader = ({
  hasBack,
  hasLogo,
  bgColor = '#2D3342',
  icon,
  iconSize = 32,
  iconColor = 'white',
  hasButton,
  title,
  onPress,
  disabled,
}: HeaderProps) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: bgColor }}>
      <View className="h-[60px] flex-row items-center justify-between px-7 py-4">
        <View className="flex-row gap-5">
          {hasBack && (
            <Pressable onPress={() => navigation.goBack()}>
              <Icon name="IcBack" size={28} color={'white'} />
            </Pressable>
          )}
          {hasLogo && <Icon name="IcBrandLogo" width={74} height={28} />}
          {title && <Text className="subHeading2B text-white">{title}</Text>}
        </View>
        {hasButton &&
          (icon ? (
            <Pressable onPress={onPress} disabled={disabled}>
              <Icon name={icon} size={iconSize} color={iconColor} />
            </Pressable>
          ) : (
            <SaveButton onPress={onPress} disabled={disabled} />
          ))}
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
