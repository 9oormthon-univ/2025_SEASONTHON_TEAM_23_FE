import { useEffect, useMemo, useRef } from 'react';
import { Pressable, Animated, Easing } from 'react-native';

type CustomSwitchProps = {
  value: boolean;
  onValueChange: (v: boolean) => void;
  width?: number;
  height?: number;
  gap?: number;
  disabled?: boolean;
  trackOnColor?: string;
  trackOffColor?: string;
  thumbOnColor?: string;
  thumbOffColor?: string;
};

const CustomSwitch = ({
  value,
  onValueChange,
  width = 52,
  height = 28,
  gap = 4,
  disabled = false,
  trackOnColor = '#FFFFFF',
  trackOffColor = '#9BA3B5',
  thumbOnColor = '#121826',
  thumbOffColor = '#FFFFFF',
}: CustomSwitchProps) => {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [value, animation]);

  const dimension = useMemo(() => {
    const trackW = width;
    const trackH = height;
    const pad = Math.max(0, gap);
    const thumbSize = Math.max(0, trackH - pad * 2);
    const travel = trackW - pad - thumbSize - pad;
    return { trackW, trackH, pad, thumbSize, travel };
  }, [width, height, gap]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [dimension.pad, dimension.pad + dimension.travel],
  });

  const trackBg = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [trackOffColor, trackOnColor],
  });
  const thumbBg = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [thumbOffColor, thumbOnColor],
  });
  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ disabled, checked: value }}
      android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
      style={{ width: dimension.trackW, height: dimension.trackH }}
    >
      {/* 트랙 */}
      <Animated.View
        className="rounded-full"
        style={{
          width: dimension.trackW,
          height: dimension.trackH,
          backgroundColor: trackBg as any,
          opacity: disabled ? 0.5 : 1,
        }}
      />
      {/* 썸(thumb) */}
      <Animated.View
        pointerEvents="none"
        className="absolute rounded-full"
        style={{
          width: dimension.thumbSize,
          height: dimension.thumbSize,
          backgroundColor: thumbBg,
          transform: [{ translateX }, { translateY: dimension.pad }],
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 1 },
          elevation: 1,
        }}
      />
    </Pressable>
  );
};

export default CustomSwitch;
