export type CreateRefreshTokenRequest = {
  user_id: string;
  ip_address: string | null;
  user_agent: string | null;
}

export type JWTPayload = {
  sub: string;
  exp: number;
};

export type AccessTokenResponse = {
  token: string;
  type: string;
  expires_in: number;
};

export type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResponse = {
  access: AccessTokenResponse;
  refresh: string;
  refreshCookieMaxAge?: number;
};
