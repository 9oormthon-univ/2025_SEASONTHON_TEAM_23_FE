import type { SvgProps } from 'react-native-svg';
import type { StyleProp, ViewStyle } from 'react-native';
import * as Icons from '@icons';

export type SvgIconProps = SvgProps & {
  name: keyof typeof Icons;
  size?: number;
  color?: string;
  // RN 위치/레이아웃 스타일을 명시적으로 허용 (absolute 배치 등)
  style?: StyleProp<ViewStyle>;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};
