import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Icon from '@common/Icon';
import { keepAllKorean } from '@/utils/keepAll';

type ConfirmDeleteModalProps = {
  visible: boolean;
  mainText?: string;
  helperText?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal = ({
  visible,
  mainText = '글을 삭제하시겠습니까?',
  helperText = '글을 삭제하면 되돌릴 수 없어요.',
  confirmLabel = '삭제하기',
  cancelLabel = '취소하기',
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <View
        className="flex-1 items-center justify-center px-[38px]"
        style={{ backgroundColor: '#0000004D' }}
      >
        <View className="items-center gap-6 rounded-[32px] bg-white px-11 py-6">
          <View className="items-center gap-2">
            <Icon name="IcWarning" size={40} color="#FF2E45" />
            <View className="items-center gap-3">
              <Text className="heading3 text-center !leading-10 leading-9 text-gray-900">
                {keepAllKorean(mainText)}
              </Text>
              <Text className="body1 text-center !leading-6 text-[#343434]">
                {keepAllKorean(helperText)}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-6">
            <TouchableOpacity
              onPress={onConfirm}
              activeOpacity={0.8}
              className="items-center justify-center rounded-xl bg-error px-6 py-3"
            >
              <Text className="body1 !leading-6 text-white">{confirmLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.8}
              className="items-center justify-center rounded-xl bg-gray-500 px-6 py-3"
            >
              <Text className="body1 !leading-6 text-white">{cancelLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDeleteModal;
