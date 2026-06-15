import jwt from "jsonwebtoken";
import crypto from "crypto";
import type IPasswordHasher from "../../domains/user/Interfaces/ipassword.hasher.js";
import ITokenService from "../../domains/user/Interfaces/itoken.service.js";

class TokenService implements ITokenService {
  constructor(private readonly passwordHasher: IPasswordHasher) {}

  generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(): string {
    return crypto.randomUUID();
  }

  async hashRefreshToken(token: string): Promise<string> {
    return this.passwordHasher.hash(token);
  }
}

export default TokenService;
