import { FlatList, Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Pet } from '@/types/pets';
import Loader from '@common/Loader';
import { usePetsList } from '@/hooks/pets/usePetsList';
import { useCallback, useLayoutEffect, useState } from 'react';
import { setHeaderExtras } from '@/types/Header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/types/navigation';
import ScreenHeader from '@/components/settings/ScreenHeader';
import Icon from '@common/Icon';
import PetCard from '@/components/settings/PetCard';

const PetManageScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [isDeleting, setIsDeleting] = useState(false);
  const { pets, loading, reload, onDelete } = usePetsList();

  // 돌아왔을 때(포커스 재획득) 바로 최신 목록 반영
  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload])
  );

  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      hasBack: true,
      hasButton: true,
      onBack: () => {
        if (navigation.canGoBack()) navigation.goBack();
        navigation.replace('PetManage');
      },
    });
  }, [navigation]);

  const goToRegistration = useCallback(() => {
    navigation.navigate('PetRegistrationInProfile');
  }, [navigation]);

  if (loading) {
    return <Loader isPageLoader />;
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg">
      {pets.length === 0 && (
        <Modal
          visible
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => {}}
        >
          <View className="flex-1 bg-black/50">
            <View className="flex-1 items-center justify-center px-8">
              <Pressable
                onPress={(e) => e.stopPropagation()}
                className="w-full gap-8 rounded-[20px] bg-bg-light px-7 py-10"
              >
                <View className="items-center gap-4">
                  <Text className="subHeading2B text-white">알림</Text>
                  <Text className="body1 text-center !leading-6 text-gray-200">
                    {`등록된 반려동물이 없습니다.\n반려동물을 등록해주세요.`}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={goToRegistration}
                  className="items-center justify-center rounded-xl bg-yellow-300 py-3"
                  activeOpacity={0.8}
                >
                  <Text className="subHeading2B text-gray-900">확인</Text>
                </TouchableOpacity>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
      <ScreenHeader title="반려동물 관리" />
      <View className="gap-7 pt-7">
        <View className="gap-5 px-7">
          <View className="flex-row items-center justify-between">
            <Text className="subHeading3 !leading-7 text-white">{`등록되어 있는 반려동물`}</Text>
            <TouchableOpacity onPress={() => setIsDeleting(!isDeleting)} activeOpacity={0.8}>
              <Text className="body1 text-gray-500">{`삭제하기`}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={pets}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={() => <View className="h-4" />}
            ListEmptyComponent={() => (
              <View className="items-center justify-center py-32">
                <Text className="body1 text-center !leading-6 text-gray-200">
                  {`등록된 반려동물이 없습니다. 반려동물을 등록해주세요.`}
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <PetCard
                pet={item}
                deletingMode={isDeleting}
                onEdit={(pet: Pet) => navigation.navigate('PetRegistrationInProfile', { pet })}
                onDelete={async (pet: Pet) => {
                  await onDelete(pet);
                }}
              />
            )}
          />
        </View>
        <View className="items-center gap-3">
          <TouchableOpacity
            onPress={() => navigation.navigate('PetRegistrationInProfile')}
            activeOpacity={0.8}
          >
            <Icon name="IcPlus" size={40} color="#FFD86F" />
          </TouchableOpacity>
          <Text className="body1 !leading-6 text-yellow-200">{`반려동물 추가하기`}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PetManageScreen;
