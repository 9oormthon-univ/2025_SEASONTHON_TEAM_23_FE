import type { SvgIconProps } from '@/types/svg';
import * as Icons from '@icons';

const Icon = ({
  name,
  width: _width,
  height: _height,
  size = 24,
  color = '#F7F0EA',
  ...props
}: SvgIconProps) => {
  const Icon = Icons[name];
  const width = _width || size;
  const height = _height || size;

  return <Icon width={width} height={height} fill={color} fillRule="evenodd" {...props} />;
};

export default Icon;
