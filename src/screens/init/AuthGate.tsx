import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/provider/AuthProvider';
import { useNeedsPetProfile } from '@/hooks/queries/useNeedsPetProfile';
import Loader from '@common/Loader';

const AuthGate = () => {
  const nav = useNavigation<any>();
  const { user } = useAuth();
  const { needsPet, loading } = useNeedsPetProfile(!!user);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      nav.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    } else if (true) {
      nav.reset({ index: 0, routes: [{ name: 'PetRegistration' }] });
    } else {
      nav.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    }
  }, [user, needsPet, loading, nav]);

  return <Loader isPageLoader />;
};

export default AuthGate;
