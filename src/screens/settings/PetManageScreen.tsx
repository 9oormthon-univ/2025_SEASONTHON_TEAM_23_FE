import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
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
import { fetchMyPets, updatePet, deletePet } from '@/services/pets';
import type { Pet } from '@/types/pets';
import SelectBox from '@common/SelectBox';
import { PERSONALITY_CONFLICTS, PERSONALITY_OPTIONS, SPECIES_OPTIONS } from '@/types/select';
import { showConflictAlert } from '@/utils/selectConflict';
import { toCSV } from '@/utils/payload';
import Input from '@common/Input';
import Loader from '@common/Loader';

const PetManageScreen = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{
    pet: Pet;
    name: string;
    selectSpecies: Array<string | number>;
    selectPersonality: Array<string | number>;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  // value -> label 매핑 (종 / 성격)
  const SPECIES_LABEL_MAP = useMemo(() => {
    const m: Record<string, string> = {};
    SPECIES_OPTIONS.forEach((o) => (m[o.value] = o.label));
    return m;
  }, []);
  const PERSONALITY_LABEL_MAP = useMemo(() => {
    const m: Record<string, string> = {};
    PERSONALITY_OPTIONS.forEach((o) => (m[o.value] = o.label));
    return m;
  }, []);

  const toKoreanSpecies = (value?: string | null) =>
    value ? (SPECIES_LABEL_MAP[String(value)] ?? String(value)) : '';

  const toKoreanPersonalities = (csv?: string | null) => {
    if (!csv) return '';
    return csv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((v) => PERSONALITY_LABEL_MAP[v] ?? v)
      .join(', ');
  };

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchMyPets();
      setPets(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openEdit = (pet: Pet) => {
    const parsedPers = String(pet.personality ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setEditing({
      pet,
      name: pet.name,
      selectSpecies: pet.breed ? [String(pet.breed)] : [],
      selectPersonality: parsedPers,
    });
  };

  const submitEdit = async () => {
    if (!editing) return;
    const name = editing.name.trim();
    const species = editing.selectSpecies;
    const personalities = editing.selectPersonality;
    if (!name || species.length !== 1 || personalities.length < 1) {
      Alert.alert('입력 확인', '이름을 입력하고, 종/성격을 선택해 주세요.');
      return;
    }
    setSaving(true);
    try {
      const updated = await updatePet(editing.pet.id, {
        name,
        breed: String(species[0]),
        personality: toCSV(personalities),
      });
      setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditing(null);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || '반려동물 정보를 수정하지 못했습니다.';
      Alert.alert('수정 실패', msg);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (pet: Pet) => {
    Alert.alert('삭제 확인', `${pet.name} 정보를 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePet(pet.id);
            setPets((prev) => prev.filter((p) => p.id !== pet.id));
          } catch (e: any) {
            const msg =
              e?.response?.data?.message || e?.message || '반려동물 정보를 삭제하지 못했습니다.';
            Alert.alert('삭제 실패', msg);
          }
        },
      },
    ]);
  };

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
            <View className="mt-10 items-center">
              <Text className="body1 text-gray-400">등록된 반려동물이 없어요.</Text>
            </View>
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
                  className="flex-1 items-center justify-center rounded-xl bg-gray-700 py-2"
                  activeOpacity={0.85}
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
        <Pressable className="flex-1 bg-black/60" onPress={() => !saving && setEditing(null)}>
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
                  onChange={(t) => setEditing((s) => (s ? { ...s, name: t } : s))}
                  placeholder="이름을 입력해주세요."
                />
                <SelectBox
                  label="종"
                  items={SPECIES_OPTIONS}
                  values={editing?.selectSpecies ?? []}
                  onChange={(next) =>
                    setEditing((s) => (s ? { ...s, selectSpecies: next.map(String) } : s))
                  }
                  placeholder="종을 선택해주세요."
                  maxSelected={1}
                  closeOnSelect
                />
                <SelectBox
                  label="성격"
                  items={PERSONALITY_OPTIONS}
                  values={editing?.selectPersonality ?? []}
                  onChange={(next) =>
                    setEditing((s) => (s ? { ...s, selectPersonality: next.map(String) } : s))
                  }
                  placeholder="성격을 선택해주세요."
                  conflicts={PERSONALITY_CONFLICTS}
                  conflictStrategy="block"
                  onConflict={showConflictAlert}
                />
              </View>
              <View className="mt-6 flex-row gap-3">
                <TouchableOpacity
                  disabled={saving}
                  onPress={() => setEditing(null)}
                  className="flex-1 items-center justify-center rounded-xl bg-gray-700 py-3"
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
