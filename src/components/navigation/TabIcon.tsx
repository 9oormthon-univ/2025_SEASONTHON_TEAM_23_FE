import type { SvgIconProps } from '@/types/svg';
import * as Icons from '@icons';

const TabIcon = ({ name, size = 40, color = '#808080', ...props }: SvgIconProps) => {
  const Icon = Icons[name];

  return <Icon width={size} height={size} fill={color} fillRule="evenodd" {...props} />;
};

export default TabIcon;
