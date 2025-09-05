import './global.css';
import { StatusBar } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import AppProvider from '@/provider/AppProvider';
import RootNavigator from '@/navigation/RootNavigator';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    const init = async () => {};

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
  }, []);

  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor="#121826" />
      <RootNavigator />
    </AppProvider>
  );
};

export default App;
