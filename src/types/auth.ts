export type AppTokens = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  id: number;
  nickname: string;
  profileImageUrl?: string;
};

export type AuthResponse = AppTokens & { user: User };
