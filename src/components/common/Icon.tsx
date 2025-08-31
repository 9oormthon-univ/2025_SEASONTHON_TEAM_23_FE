import type { SvgIconProps } from '@/types/svg';
import * as Icons from '@icons';

const Icon = ({ name, size = 24, color = '#F7F0EA', ...props }: SvgIconProps) => {
  const Icon = Icons[name];

  return <Icon width={size} height={size} fill={color} fillRule="evenodd" {...props} />;
};

export default Icon;
