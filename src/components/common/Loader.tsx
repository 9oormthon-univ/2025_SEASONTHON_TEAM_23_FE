import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoaderProps = {
  isPageLoader?: boolean;
};

const Loader = ({ isPageLoader = false }: LoaderProps) => {
  return (
    <SafeAreaView
      edges={isPageLoader ? ['top'] : []}
      className={`absolute bottom-0 left-0 right-0 ${isPageLoader ? 'top-[60px]' : 'top-0'} z-10 justify-center bg-bg/30`}
    >
      <View className="" pointerEvents="auto">
        <ActivityIndicator size="large" color="#FFD86F" />
      </View>
    </SafeAreaView>
  );
};

export default Loader;
