export type AppTokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt?: number;
};

export type User = {
  email: string;
  nickname?: string;
  profileImageUrl?: string;
};
