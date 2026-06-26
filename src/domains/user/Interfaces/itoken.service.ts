interface ITokenService {
  generateAccessToken(userId: string, role: string): string;

  generateRefreshToken(): string;

  generateTokenPair(
    userId: string,
    role: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    hashedRefreshToken: string;
  }>;

  verifyAccessToken(token: string): { userId: string; role: string };

  decodeAccessToken(token: string): { userId: string; role: string } | null;
}

export default ITokenService;
