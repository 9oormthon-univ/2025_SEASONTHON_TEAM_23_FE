import * as Icons from '@icons';

export type HeaderProps = {
  hasBack?: boolean;
  hasLogo?: boolean;
  bgColor?: string;
  hasButton?: boolean;
  label?: string;
  icon?: keyof typeof Icons;
  iconSize?: number;
  iconColor?: string;
  title?: string;
  onBack?: () => void;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export const setHeaderExtras = (navigation: any, extras: HeaderProps) => {
  navigation.setOptions(extras as any);
};
