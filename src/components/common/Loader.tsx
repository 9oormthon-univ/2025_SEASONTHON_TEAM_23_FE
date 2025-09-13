import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoaderProps = {
  isPageLoader?: boolean;
  size?: 'small' | 'large';
};

const Loader = ({ isPageLoader = false, size = 'large' }: LoaderProps) => {
  return (
    <SafeAreaView
      edges={isPageLoader ? ['top'] : []}
      className={`absolute bottom-0 left-0 right-0 ${isPageLoader ? 'top-[80px] bg-bg' : 'top-0 bg-bg/30'} z-10 justify-center`}
    >
      <View pointerEvents="auto">
        <ActivityIndicator size={size} color="#FFD86F" />
      </View>
    </SafeAreaView>
  );
};

export default Loader;
