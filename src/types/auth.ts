export type AppTokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt?: number;
};

export type User = {
  kakaoId: string;
  nickname: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  id: string;
};
