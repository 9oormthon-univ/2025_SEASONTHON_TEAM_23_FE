import './global.css';
import AppProvider from '@/provider/AppProvider';
import RootNavigator from '@/navigation/RootNavigator';

const App = () => {
  return (
      <AppProvider>
        <RootNavigator />
      </AppProvider>
  );
};

export default App;
