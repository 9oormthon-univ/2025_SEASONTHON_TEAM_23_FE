import { Text, TouchableOpacity, View } from 'react-native';
import { toKoreanPersonalities, toKoreanSpecies } from '@/utils/petLabels';
import Icon from '@common/Icon';
import { useState } from 'react';
import ConfirmDeleteModal from '@common/ConfirmDeleteModal';
import type { Pet } from '@/types/pets';

type PetCardProps = {
  pet: Pet;
  deletingMode: boolean;
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => Promise<void> | void; // 서버 삭제 + 리스트 갱신
};

const PetCard = ({ pet, deletingMode = false, onEdit, onDelete }: PetCardProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <View className="flex-row items-center justify-between rounded-2xl bg-bg-light px-5 py-4">
        <View className="gap-2">
          <Text className="body1 text-white">{pet.name}</Text>
          <Text className="body3 text-gray-500">
            {toKoreanSpecies(pet.breed)}
            {` | `}
            {toKoreanPersonalities(pet.personality)}
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
