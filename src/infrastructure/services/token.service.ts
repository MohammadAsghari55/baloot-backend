import jwt from "jsonwebtoken";
import crypto from "crypto";
import type IBcryptService from "../../domains/user/Interfaces/ibcrypt.service.js";
import ITokenService from "../../domains/user/Interfaces/itoken.service.js";
import config from "../config/env.index.js";

class TokenService implements ITokenService {
  constructor(private readonly bcryptService: IBcryptService) {}

  generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, config.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(): string {
    return crypto.randomUUID();
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
    const hashedRefreshToken = await this.bcryptService.hash(refreshToken);

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

  decodeAccessToken(token: string): { userId: string; role: string } | null {
    try {
      return jwt.decode(token) as { userId: string; role: string };
    } catch {
      return null;
    }
  }
}

export default TokenService;
