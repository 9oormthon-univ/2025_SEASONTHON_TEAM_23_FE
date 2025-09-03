import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { HeaderProps } from '@/types/Header';
import Icon from '@common/Icon';
import SaveButton from '@common/SaveButton';

const CustomHeader = ({
  hasBack,
  hasLogo,
  icon,
  iconSize = 32,
  iconColor = '#343434',
  hasButton,
  title,
  onPress,
}: HeaderProps) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView edges={['top']} className="bg-white">
      <View className="flex-row items-center justify-between px-7 py-4">
        <View className="flex-row gap-5">
          {hasBack && (
            <Pressable onPress={() => navigation.goBack()}>
              <Icon name="IcBack" size={28} color={'#131313'} />
            </Pressable>
          )}
          {hasLogo && <Icon name="IcBrandLogo" width={94} height={30} />}
          {title && <Text className="subHeading2B color-gray-900">{title}</Text>}
        </View>
        {hasButton &&
          (icon ? (
            <Pressable onPress={onPress}>
              <Icon name={icon} size={iconSize} color={iconColor} />
            </Pressable>
          ) : (
            <SaveButton onPress={onPress} />
          ))}
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
