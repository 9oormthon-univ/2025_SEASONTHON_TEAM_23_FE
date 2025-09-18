import { Text, TouchableOpacity, View } from 'react-native';
import { toKoreanSpecies } from '@/utils/petLabels';
import Icon from '@common/Icon';
import { useMemo, useState } from 'react';
import ConfirmDeleteModal from '@common/ConfirmDeleteModal';
import type { Pet } from '@/types/pets';
import { PERSONALITY_OPTIONS } from '@/types/select';

type PetCardProps = {
  pet: Pet;
  deletingMode: boolean;
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => Promise<void> | void; // 서버 삭제 + 리스트 갱신
};

const PetCard = ({ pet, deletingMode = false, onEdit, onDelete }: PetCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const personalityText = useMemo(() => {
    const values = String(pet.personality ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (values.length === 0) return '';

    // value -> label 매핑
    const labelMap: Record<string, string> = {};
    PERSONALITY_OPTIONS.forEach((o) => (labelMap[o.value] = o.label));

    const labels = values.map((v) => labelMap[v] ?? v);

    if (labels.length <= 2) return labels.join(', ');
    return `${labels.slice(0, 2).join(', ')} 외 ${labels.length - 2}개`;
  }, [pet.personality]);

  return (
    <>
      <View className="flex-row items-center justify-between rounded-2xl bg-bg-light px-5 py-4">
        <View className="gap-2">
          <Text className="body1 text-white">{pet.name}</Text>
          <Text className="body3 text-gray-500">
            {toKoreanSpecies(pet.breed)}
            {` | `}
            {personalityText ? `${personalityText}` : ''}
          </Text>
        </View>
        <View className="flex-row gap-2">
          {deletingMode ? (
            <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.8}>
              <Icon name="IcCancel" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => onEdit(pet)} activeOpacity={0.8}>
              <Text className="body3 text-gray-500">{`수정하기`}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ConfirmDeleteModal
        visible={showModal}
        mainText={`${pet.name}의 등록을 삭제하시겠습니까?`}
        helperText={`반려동물 추가하기를 통해\n언제든지 다시 등록 가능합니다.`}
        confirmLabel="삭제하기"
        cancelLabel="취소"
        onConfirm={async () => {
          await onDelete(pet);
          setShowModal(false);
        }}
        onCancel={() => setShowModal(false)}
      ></ConfirmDeleteModal>
    </>
  );
};

export default PetCard;
