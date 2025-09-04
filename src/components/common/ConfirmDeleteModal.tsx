import { Modal, View, Text, Pressable } from 'react-native';
import Icon from '@common/Icon';

type ConfirmDeleteModalProps = {
  visible: boolean;
  helperText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal = ({
  visible,
  helperText = '글을 삭제하시겠습니까?',
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#0000004D' }}>
        <View className="rounded-4xl gap-6 bg-white px-11 py-6">
          <View className="items-center gap-2">
            <Icon name="IcWarning" size={40} color="#FF2E45" />
            <View className="items-center gap-1">
              <Text className="heading3 text-gray-900">{`글을 삭제하시겠습니까?`}</Text>
              <Text className="body1 text-center !leading-6 text-[#343434]">{helperText}</Text>
            </View>
          </View>
          <View className="flex-row gap-6">
            <Pressable
              onPress={onConfirm}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              className="items-center justify-center rounded-xl border bg-error px-6 py-3"
            >
              <Text className="body1 !leading-6 text-white">{`삭제하기`}</Text>
            </Pressable>

            <Pressable
              onPress={onCancel}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              className="items-center justify-center rounded-xl border bg-gray-500 px-6 py-3"
            >
              <Text className="body1 !leading-6 text-white">삭제</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDeleteModal;
