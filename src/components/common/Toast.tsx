import React, { useEffect, useState } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(onHide);
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, duration, onHide]);

  const backgroundColor = {
    success: '#4CAF50',
    error: '#F44336',
    info: '#2196F3',
  }[type];

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          opacity: fadeAnim,
          backgroundColor,
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignSelf: 'center',
    minWidth: 200,
    maxWidth: 300,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default Toast;
