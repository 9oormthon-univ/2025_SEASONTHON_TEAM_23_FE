import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useToast } from '@/provider/ToastProvider';
import Toast from '@/components/common/Toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastContainerProps {
  position?: 'top' | 'bottom' | 'above-tab';
}

const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'bottom' }) => {
  const { toasts, hideToast } = useToast();
  const insets = useSafeAreaInsets();

  // 탭 바 높이 계산 (TabNavigator에서와 동일한 로직)
  const tabBarHeight = 85 + Math.max(insets.bottom, 16);

  const getContainerStyle = () => {
    switch (position) {
      case 'top':
        return [styles.container, styles.top];
      case 'above-tab':
        return [styles.container, { bottom: tabBarHeight + 16 }]; // 탭 바 위 16px 여백
      case 'bottom':
      default:
        return [styles.container, styles.bottom];
    }
  };

  return (
    <View style={getContainerStyle()}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          title={toast.title}
          type={toast.type}
          duration={toast.duration}
          onHide={() => hideToast(toast.id)}
          onPress={toast.onPress}
          actionLabel={toast.actionLabel}
          onActionPress={toast.onActionPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  top: {
    top: 50,
  },
  bottom: {
    bottom: 50,
  },
});

export default ToastContainer;
