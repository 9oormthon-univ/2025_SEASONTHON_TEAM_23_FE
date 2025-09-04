import { Modal, View, Text, Pressable } from 'react-native';
import Icon from '@common/Icon';
import { keepAllKorean } from '@/utils/keepAll';

type ConfirmDeleteModalProps = {
  visible: boolean;
  helperText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal = ({
  visible,
  helperText = '글을 삭제하면 되돌릴 수 없어요.',
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
            <View className="items-center gap-1">
              <Text className="heading3 leading-9 text-gray-900">{`글을 삭제하시겠습니까?`}</Text>
              <Text className="body1 text-center !leading-6 text-[#343434]">
                {keepAllKorean(helperText)}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-6">
            <Pressable
              onPress={onConfirm}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              className="items-center justify-center rounded-xl bg-error px-6 py-3"
            >
              <Text className="body1 !leading-6 text-white">{`삭제하기`}</Text>
            </Pressable>
            <Pressable
              onPress={onCancel}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              className="items-center justify-center rounded-xl bg-gray-500 px-6 py-3"
            >
              <Text className="body1 !leading-6 text-white">취소하기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDeleteModal;
