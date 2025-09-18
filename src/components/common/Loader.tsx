import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoaderProps = {
  isPageLoader?: boolean;
  size?: 'small' | 'large';
  color?: string;
};

const Loader = ({ isPageLoader = false, size = 'large', color = '#FFD86F' }: LoaderProps) => {
  return (
    <SafeAreaView
      edges={isPageLoader ? ['top'] : []}
      className={`absolute bottom-0 left-0 right-0 ${isPageLoader ? 'top-[80px] bg-bg' : 'top-0 bg-bg/30'} z-10 justify-center`}
    >
      <View pointerEvents="auto">
        <ActivityIndicator size={size} color={color} />
      </View>
    </SafeAreaView>
  );
};

export default Loader;
