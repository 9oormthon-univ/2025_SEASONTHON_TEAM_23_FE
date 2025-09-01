import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, Text, View } from 'react-native';
import Icon from '@common/Icon';
import * as Icons from '@icons';
import SaveButton from '@common/SaveButton';

type HeaderProps = {
  hasBack?: boolean;
  hasLogo?: boolean;
  hasButton?: boolean;
  icon?: keyof typeof Icons;
  title?: string;
  onPress?: () => void;
};

const CustomHeader = ({ hasBack, hasLogo, icon, hasButton, title, onPress }: HeaderProps) => {
  return (
    <SafeAreaView edges={['top']} className="bg-white">
      <View className="flex-row items-center justify-between px-7 py-4">
        <View className="flex-row gap-5">
          {hasBack && <Icon name="IcBack" size={28} color={'#131313'} />}
          {hasLogo && <Icon name="IcBrandLogo" width={94} height={30} />}
          {title && <Text className="subHeading2B color-gray-900">{title}</Text>}
        </View>
        {hasButton &&
          (icon ? (
            <Pressable onPress={onPress}>
              <Icon name={icon} size={32} color="#131313" />
            </Pressable>
          ) : (
            <SaveButton onPress={onPress} />
          ))}
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
