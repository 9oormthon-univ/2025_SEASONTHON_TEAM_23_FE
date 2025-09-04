import { Modal, Pressable, View, Text, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type DropDownMenuProps = {
  visible: boolean;
  onDismiss: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const DropDownMenu = ({ visible, onDismiss, onEdit, onDelete }: DropDownMenuProps) => {
  const insets = useSafeAreaInsets();
  const statusTop = StatusBar.currentHeight ?? insets.top;

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onDismiss} statusBarTranslucent>
      <Pressable onPress={onDismiss} className="absolute inset-0" />
      <View className="absolute right-7 w-[73px] overflow-hidden" style={{ top: statusTop + 50 }}>
        <View className="overflow-hidden rounded-t-lg border border-gray-400 bg-white">
          <Pressable
            onPress={() => {
              onDismiss();
              onEdit();
            }}
            android_ripple={{ color: 'rgba(231, 231, 231, 1)', borderless: false }}
            className="px-3 py-2"
          >
            <Text className="body2 text-center text-gray-800">수정하기</Text>
          </Pressable>
        </View>
        <View className="overflow-hidden rounded-b-lg border border-gray-400 bg-white">
          <Pressable
            onPress={() => {
              onDismiss();
              onDelete();
            }}
            android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: false }}
            className="px-3 py-2"
          >
            <Text className="body2 text-center text-gray-800">삭제하기</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default DropDownMenu;
