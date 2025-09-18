export const PROFILE_IMAGE_PRESETS: Record<string, any> = {
  default1: require('@images/default-profile.png'),
  default2: require('@images/default-profile2.png'),
  default3: require('@images/default-profile3.png'),
  default4: require('@images/default-profile4.png'),
};

export const PROFILE_IMAGE_ORDER = ['default1', 'default2', 'default3', 'default4'] as const;
export type ProfileImageKey = (typeof PROFILE_IMAGE_ORDER)[number];
