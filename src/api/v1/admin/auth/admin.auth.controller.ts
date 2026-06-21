import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import RegisterAdminUseCase from "../../../../application/auth/usecases/register.admin.usecase.js";
import LoginUseCase from "../../../../application/auth/usecases/login.usecase.js";
import RefreshTokenUseCase from "../../../../application/auth/usecases/refresh.token.usecase.js";
import { config } from "../../../../infrastructure/config/index.js";

@BoundClass
class AdminAuthController {
  constructor(
    private registerUseCase: RegisterAdminUseCase,
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  async register(req: Request, res: Response) {
    const user = await this.registerUseCase.execute(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }

  async login(req: Request, res: Response) {
    const token = await this.loginUseCase.execute(req.body, req.deviceId!);

    res.cookie("accessToken", token.accessToken, this.accessCookieOptions);
    res.cookie("refreshToken", token.refreshToken, this.refreshCookieOptions);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  }

  async refresh(req: Request, res: Response) {
    const token = await this.refreshTokenUseCase.execute(
      "admin",
      req.cookies.refreshToken,
      req.deviceId!,
    );

    res.cookie("accessToken", token.accessToken, this.accessCookieOptions);
    res.cookie("refreshToken", token.refreshToken, this.refreshCookieOptions);
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  }

  private readonly accessCookieOptions = {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: config.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  };

  private readonly refreshCookieOptions = {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: config.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export default AdminAuthController;
