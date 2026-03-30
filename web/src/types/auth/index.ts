export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  familyId?: string;
  role?: 'admin' | 'editor' | 'reader';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
