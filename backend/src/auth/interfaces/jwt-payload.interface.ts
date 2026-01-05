export interface JwtSignPayload {
  sub: string;
  userName: string;
  email: string;
}

export interface JwtVerifiedPayload extends JwtSignPayload {
  iat: number;
  exp: number;
}
