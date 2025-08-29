import { View, ActivityIndicator } from 'react-native';

const Loader = () => {
  return (
    <View
      className="absolute bottom-0 left-0 right-0 top-0 justify-center bg-black/15"
      pointerEvents="auto"
    >
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Loader;
