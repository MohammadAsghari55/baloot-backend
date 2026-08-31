interface ITokenService {
  hashRefreshToken(refreshToken: string): string;

  generateAccessToken(
    userId: string,
    deviceId: string,
    role: string,
    accessType: "full" | "limited",
  ): string;

  generateRefreshToken(): string;

  generateTokenPair(
    userId: string,
    deviceId: string,
    role: string,
    accessType: "full" | "limited",
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    hashedRefreshToken: string;
  }>;

  verifyAccessToken(token: string): {
    userId: string;
    deviceId: string;
    role: string;
    accessType: "full" | "limited";
  };

  decodeAccessToken(token: string): {
    userId: string;
    deviceId: string;
    role: string;
    accessType: "full" | "limited";
  } | null;
}

export default ITokenService;
