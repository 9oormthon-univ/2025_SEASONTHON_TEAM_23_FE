import type { SvgProps } from 'react-native-svg';
import * as Icons from '@icons';

export type SvgIconProps = SvgProps & {
  name: keyof typeof Icons;
  size?: number;
  color?: string;
};
