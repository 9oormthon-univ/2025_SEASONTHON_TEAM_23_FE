import React, { useEffect, useState, useRef } from 'react';
import { Text, Animated, View, Pressable, PanResponder, Dimensions } from 'react-native';
import { IcSuccess, IcInfo } from '../../../assets/icons';

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
    container: 'bg-bg',
  },
  error: {
    container: 'bg-bg',
  },
  info: {
    container: 'bg-bg',
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

  const { container } = typeStyles[type];

  const screenWidth = Dimensions.get('window').width;
  const toastWidth = Math.min(335, screenWidth * 0.9); // Max 335px or 90% of screen width
  const toastHeight = (toastWidth / 335) * 64; // Maintain aspect ratio

  return (
    <Animated.View
      {...panResponderRef.current.panHandlers}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }, { translateX }],
        alignSelf: 'center',
      }}
      className="px-4"
    >
      <Pressable
        onPress={() => (onPress ? onPress() : exit())}
        className={`rounded-2xl ${container} px-4 py-4 shadow-lg shadow-black/20 active:opacity-90`}
        style={{ width: toastWidth, height: toastHeight }}
      >
        <View className="flex-row items-center gap-3">
          <View className="justify-center pt-1">
            {type === 'success' && <IcSuccess width={24} height={24} className="text-white" />}
            {type === 'error' && <Text className="text-xl leading-6 text-white">❌</Text>}
            {type === 'info' && <IcInfo width={24} height={24} className="text-white" />}
          </View>
          <View className="flex-1 pt-1">
            {!!title && (
              <Text className="text-base font-semibold text-white" numberOfLines={1}>
                {title}
              </Text>
            )}
            {!!message && (
              <Text className="subHeading3 mt-0.5 text-white/95" numberOfLines={3}>
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
