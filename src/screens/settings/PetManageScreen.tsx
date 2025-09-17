import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Pet } from '@/types/pets';
import SelectBox from '@common/SelectBox';
import { PERSONALITY_CONFLICTS, PERSONALITY_OPTIONS, SPECIES_OPTIONS } from '@/types/select';
import { showConflictAlert } from '@/utils/selectConflict';
import Input from '@common/Input';
import Loader from '@common/Loader';
import { usePetEditModal } from '@/hooks/pets/usePetEditModal';
import { usePetsList } from '@/hooks/pets/usePetsList';
import { toKoreanPersonalities, toKoreanSpecies } from '@/utils/petLabels';
import { useCallback, useLayoutEffect, useState } from 'react';
import { setHeaderExtras } from '@/types/Header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/types/navigation';

const PetManageScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [showEmptyModal, setShowEmptyModal] = useState(false);
  const { pets, setPets, loading, reload, onDelete } = usePetsList({
    onEmpty: () => setShowEmptyModal(true), // 삭제 후 0마리 → 모달
  });

  // 돌아왔을 때(포커스 재획득) 바로 최신 목록 반영
  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload])
  );

  // 수정 모달 훅 (성공 시 리스트 갱신)
  const {
    editing,
    saving,
    openEdit,
    closeEdit,
    setName,
    handleSpeciesChange,
    handlePersonalityChange,
    submitEdit,
  } = usePetEditModal((updated: Pet) => {
    setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  });

  useLayoutEffect(() => {
    setHeaderExtras(navigation, {
      hasBack: true,
      hasButton: true,
      icon: 'IcPlus',
      onPress: () => navigation.navigate('PetRegistrationInProfile'),
      onBack: () => {
        if (navigation.canGoBack()) navigation.goBack();
        navigation.replace('PetManage');
      },
    });
  }, [navigation]);

  // 루트 스택의 등록 화면으로 이동 (폴백: 프로필 스택)
  const goToRootRegistration = useCallback(() => {
    setShowEmptyModal(false);

    // 일반적으로: ProfileStack(parent) -> Tabs(parent) -> Root
    const maybeRoot = navigation.getParent()?.getParent();
    if (maybeRoot && typeof (maybeRoot as any).navigate === 'function') {
      (maybeRoot as any).navigate('PetRegistration'); // RootNavigator에 등록된 이름
      return;
    }

    // 폴백: 같은 스택의 등록 화면
    navigation.navigate('PetRegistrationInProfile');
  }, [navigation]);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="subHeading2B text-white">불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          ListEmptyComponent={() => (
            <Modal visible={showEmptyModal} transparent animationType="fade" statusBarTranslucent>
              <Pressable className="flex-1 bg-black/60" onPress={() => setShowEmptyModal(false)}>
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
                      onPress={goToRootRegistration}
                      className="items-center justify-center rounded-xl bg-yellow-300 py-3"
                      activeOpacity={0.8}
                    >
                      <Text className="subHeading2B text-gray-900">확인</Text>
                    </TouchableOpacity>
                  </Pressable>
                </View>
              </Pressable>
            </Modal>
          )}
          renderItem={({ item }) => (
            <View className="mb-3 rounded-2xl bg-bg-light p-4">
              <Text className="subHeading2B text-white">{item.name}</Text>
              <Text className="body2 mt-1 text-gray-400">{toKoreanSpecies(item.breed)}</Text>
              <Text className="body2 text-gray-400">{toKoreanPersonalities(item.personality)}</Text>
              <View className="mt-3 flex-row gap-2">
                <TouchableOpacity
                  onPress={() => openEdit(item)}
                  className="flex-1 items-center justify-center rounded-xl bg-yellow-300 py-2"
                  activeOpacity={0.85}
                >
                  <Text className="subHeading2B text-gray-900">수정</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDelete(item)}
                  className="flex-1 items-center justify-center rounded-xl bg-gray-500 py-2"
                  activeOpacity={0.8}
                >
                  <Text className="subHeading2B text-white">삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      {/* 수정 모달 */}
      <Modal visible={!!editing} transparent animationType="fade" statusBarTranslucent>
        <Pressable className="flex-1 bg-black/60" onPress={() => !saving && closeEdit()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 justify-center px-6"
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className="rounded-2xl bg-bg-light px-5 py-6"
            >
              <Text className="subHeading1B text-white">반려동물 정보 수정</Text>
              <View className="mt-5 gap-3">
                <Input
                  label="이름"
                  value={editing?.name ?? ''}
                  onChange={(t) => setName(t)}
                  placeholder="이름을 입력해주세요."
                />
                <SelectBox
                  label="종"
                  items={SPECIES_OPTIONS}
                  values={editing?.selectSpecies ?? []}
                  onChange={handleSpeciesChange}
                  placeholder="종을 선택해주세요."
                  maxSelected={1}
                  closeOnSelect
                />
                <SelectBox
                  label="성격"
                  items={PERSONALITY_OPTIONS}
                  values={editing?.selectPersonality ?? []}
                  onChange={handlePersonalityChange}
                  placeholder="성격을 선택해주세요."
                  conflicts={PERSONALITY_CONFLICTS}
                  conflictStrategy="block"
                  onConflict={showConflictAlert}
                />
              </View>
              <View className="mt-6 flex-row gap-3">
                <TouchableOpacity
                  disabled={saving}
                  onPress={closeEdit}
                  className="flex-1 items-center justify-center rounded-xl bg-gray-500 py-3"
                  activeOpacity={0.8}
                >
                  <Text className="subHeading2B text-white">취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={saving}
                  onPress={submitEdit}
                  className={`flex-1 items-center justify-center rounded-xl py-3 ${
                    saving ? 'bg-yellow-200' : 'bg-yellow-300'
                  }`}
                  activeOpacity={0.85}
                >
                  {saving ? (
                    <Loader size="small" color="#121826" />
                  ) : (
                    <Text
                      className={`subHeading2B ${saving ? 'text-gray-800/50' : 'text-gray-900'}`}
                    >
                      저장
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default PetManageScreen;
