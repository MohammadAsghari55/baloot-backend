interface ITokenService {
  generateAccessToken(userId: string, deviceId: string, role: string): string;

  generateRefreshToken(): string;

  generateTokenPair(
    userId: string,
    deviceId: string,
    role: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    hashedRefreshToken: string;
  }>;

  verifyAccessToken(token: string): {
    userId: string;
    deviceId: string;
    role: string;
  };

  decodeAccessToken(token: string): {
    userId: string;
    deviceId: string;
    role: string;
  } | null;
}

export default ITokenService;
