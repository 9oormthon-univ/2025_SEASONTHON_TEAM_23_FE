import { useAuth } from '@/provider/AuthProvider';
import { useMyPets } from '@/hooks/queries/useMyPets';
import { View } from 'react-native';
import { useEffect } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Loader from '@common/Loader';

const PetsGate = () => {
  const { user } = useAuth();
  const { needsPet, loading } = useMyPets(!!user);
  const navigation = useNavigation();

  useEffect(() => {
    if (loading) return;
    // needsPet이면 등록 화면, 아니면 탭으로
    const target = needsPet ? 'PetRegistration' : 'Tabs';
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: target as never }] }));
  }, [loading, needsPet, navigation]);

  // 아주 짧은 로딩 표시
  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <Loader />
    </View>
  );
};

export default PetsGate;
