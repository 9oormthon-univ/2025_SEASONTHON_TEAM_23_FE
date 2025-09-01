import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import Icon from '@common/Icon';
import * as Icons from '@icons';

type HeaderProps = {
  hasBack?: boolean;
  hasLogo?: boolean;
  icon?: keyof typeof Icons;
  title?: string;
};

const CustomHeader = ({ hasBack, hasLogo, icon, title }: HeaderProps) => {
  return (
    <SafeAreaView edges={['top']} className="bg-white">
      <View className="flex-row items-center justify-between px-7 py-4">
        <View className="flex-row gap-5">
          {hasBack && <Icon name="IcBack" size={28} color={'#131313'} />}
          {hasLogo && <Icon name="IcBrandLogo" width={94} height={30} />}
          {title && <Text className="subHeading2B color-gray-900">{title}</Text>}
        </View>
        {icon && <Icon name={icon} size={32} color="#131313" />}
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
