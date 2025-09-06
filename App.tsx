import './global.css';
import { StatusBar } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import AppProvider from '@/provider/AppProvider';
import RootNavigator from '@/navigation/RootNavigator';
import { useEffect } from 'react';
import { TributePollingProvider } from '@/provider/TributePollingProvider';
import { NotificationProvider } from '@/provider/NotificationCenter';

const App = () => {
  useEffect(() => {
    const init = async () => {};

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
  }, []);

  return (
    <AppProvider>
      <NotificationProvider>
        <TributePollingProvider>
          <StatusBar barStyle="light-content" backgroundColor="#121826" />
          <RootNavigator />
        </TributePollingProvider>
      </NotificationProvider>
    </AppProvider>
  );
};

export default App;
