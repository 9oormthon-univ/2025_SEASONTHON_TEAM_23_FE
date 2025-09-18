import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useToast } from '@/provider/ToastProvider';
import Toast from './Toast';

interface ToastContainerProps {
  position?: 'top' | 'bottom';
}

const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'bottom' }) => {
  const { toasts, hideToast } = useToast();

  const containerStyle = [styles.container, position === 'top' ? styles.top : styles.bottom];

  return (
    <View style={containerStyle}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onHide={() => hideToast(toast.id)}
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
