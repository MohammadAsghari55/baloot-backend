import jwt from "jsonwebtoken";
import crypto from "crypto";
import ITokenService from "../../domains/user/Interfaces/itoken.service.js";
import config from "../config/env.index.js";

class TokenService implements ITokenService {
  private readonly REFRESH_HASH_SECRET = crypto
    .createHash("sha256")
    .update(config.JWT_ACCESS_SECRET + "refresh-hash")
    .digest("hex");

  hashRefreshToken(refreshToken: string): string {
    return crypto
      .createHmac("sha256", this.REFRESH_HASH_SECRET)
      .update(refreshToken)
      .digest("hex");
  }

  generateAccessToken(
    userId: string,
    deviceId: string,
    role: string,
    accessType: "full" | "limited",
  ): string {
    return jwt.sign(
      { userId, deviceId, role, accessType },
      config.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );
  }

  generateRefreshToken(): string {
    return crypto.randomUUID();
  }

  async generateTokenPair(
    userId: string,
    deviceId: string,
    role: string,
    accessType: "full" | "limited",
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    hashedRefreshToken: string;
  }> {
    const accessToken = this.generateAccessToken(
      userId,
      deviceId,
      role,
      accessType,
    );
    const refreshToken = this.generateRefreshToken();
    const hashedRefreshToken = this.hashRefreshToken(refreshToken);

    return {
      accessToken,
      refreshToken,
      hashedRefreshToken,
    };
  }

  verifyAccessToken(token: string): {
    userId: string;
    deviceId: string;
    role: string;
    accessType: "full" | "limited";
  } {
    try {
      const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as {
        userId: string;
        deviceId: string;
        role: string;
        accessType: "full" | "limited";
      };
      return decoded;
    } catch (error) {
      throw error;
    }
  }

  decodeAccessToken(token: string): {
    userId: string;
    deviceId: string;
    role: string;
    accessType: "full" | "limited";
  } | null {
    try {
      return jwt.decode(token) as {
        userId: string;
        deviceId: string;
        role: string;
        accessType: "full" | "limited";
      };
    } catch {
      return null;
    }
  }
}

export default TokenService;
