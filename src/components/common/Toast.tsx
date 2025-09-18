import React, { useEffect, useState, useRef } from 'react';
import { Text, Animated, View, Pressable, PanResponder } from 'react-native';

interface ToastProps {
  message: string;
  title?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onHide: () => void;
  onPress?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
}

const typeStyles = {
  success: {
    container: 'bg-green-500',
    icon: '✅',
  },
  error: {
    container: 'bg-red-500',
    icon: '❌',
  },
  info: {
    container: 'bg-blue-500',
    icon: 'ℹ️',
  },
};

const Toast: React.FC<ToastProps> = ({
  message,
  title,
  type = 'info',
  duration = 3000,
  onHide,
  onPress,
  actionLabel,
  onActionPress,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(-100));
  const [translateX] = useState(new Animated.Value(0));
  const panResponderRef = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 100) {
          // Swipe to dismiss
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: gestureState.dx > 0 ? 400 : -400,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(onHide);
        } else {
          // Reset position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  );

  const exit = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(onHide);
  };

  useEffect(() => {
    // Enter animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide timer
    const timer = setTimeout(() => {
      exit();
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, translateY, duration, onHide, exit]);

  const { container, icon } = typeStyles[type];

  return (
    <Animated.View
      {...panResponderRef.current.panHandlers}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }, { translateX }],
      }}
      className="w-full px-4"
    >
      <Pressable
        onPress={() => (onPress ? onPress() : exit())}
        className={`rounded-2xl ${container} px-4 py-3 shadow-lg shadow-black/20 active:opacity-90`}
      >
        <View className="flex-row items-start gap-3">
          <Text className="text-xl leading-6 text-white">{icon}</Text>
          <View className="flex-1">
            {!!title && (
              <Text className="text-base font-semibold text-white" numberOfLines={1}>
                {title}
              </Text>
            )}
            {!!message && (
              <Text className="mt-0.5 text-[13px] text-white/95" numberOfLines={3}>
                {message}
              </Text>
            )}
          </View>
          {!!actionLabel && (
            <Pressable
              onPress={onActionPress}
              className="self-start rounded-xl bg-white/15 px-2 py-1"
            >
              <Text className="text-xs font-semibold text-white">{actionLabel}</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default Toast;
