import jwt from "jsonwebtoken";
import crypto from "crypto";
import type IPasswordHasher from "../../domains/user/Interfaces/ipassword.hasher.js";
import ITokenService from "../../domains/user/Interfaces/itoken.service.js";
import { config } from "../config/index.js";

class TokenService implements ITokenService {
  constructor(private readonly passwordHasher: IPasswordHasher) {}

  generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, config.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(): string {
    return crypto.randomUUID();
  }

  async hashRefreshToken(token: string): Promise<string> {
    return this.passwordHasher.hash(token);
  }

  async generateTokenPair(
    userId: string,
    role: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    hashedRefreshToken: string;
  }> {
    const accessToken = this.generateAccessToken(userId, role);
    const refreshToken = this.generateRefreshToken();
    const hashedRefreshToken = await this.hashRefreshToken(refreshToken);

    return {
      accessToken,
      refreshToken,
      hashedRefreshToken,
    };
  }

  verifyAccessToken(token: string): { userId: string; role: string } {
    try {
      const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as {
        userId: string;
        role: string;
      };
      return decoded;
    } catch (error) {
      throw error;
    }
  }
}

export default TokenService;
