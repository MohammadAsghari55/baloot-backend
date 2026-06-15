interface ITokenService {
  generateAccessToken(userId: string, role: string): string;

  generateRefreshToken(): string;

  hashRefreshToken(token: string): Promise<string>;
}

export default ITokenService;
